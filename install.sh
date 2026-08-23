#!/bin/bash

LOG_FILE="/tmp/moonclock-update.log"
DATA_FOLDER="/var/lib/moonclock"
APP_FOLDER="/usr/local/bin/moonclock"

log() {
  echo "$1"
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

# Optional LED panel settings, applied to the database once the app is copied.
# Only the flags passed here are changed; everything else keeps its default or
# previously-tuned value. See dist/hardware/configure-panel.cjs.
PANEL_ARGS=()

usage() {
  cat >&2 <<'EOF'
Usage: install.sh [LED panel options]

LED panel options (all optional, --flag=value form):
  --brightness=N            Panel brightness, 0-100
  --hardware-mapping=NAME    regular | adafruit-hat | adafruit-hat-pwm | regular-pi1
  --pwm-bits=N               PWM bits, 1-11
  --gpio-slowdown=N          GPIO slowdown, 0-4
  --pwm-lsb-nanoseconds=N    PWM LSB nanoseconds
  --pwm-dither-bits=N        Time-dither the lowest bits, 0-2
  --limit-refresh-hz=N       Cap refresh rate in Hz, 0 for no limit
  --panel-type=NAME          Empty for standard HUB75, or FM6126A | FM6127
EOF
  exit 1
}

while [ $# -gt 0 ]; do
  case "$1" in
    --brightness=* | --hardware-mapping=* | --pwm-bits=* | \
    --gpio-slowdown=* | --pwm-lsb-nanoseconds=* | --pwm-dither-bits=* | \
    --limit-refresh-hz=* | --panel-type=*)
      PANEL_ARGS+=("$1"); shift ;;
    -h | --help) usage ;;
    *) echo "Unknown option: $1" >&2; usage ;;
  esac
done

if [ ! -d "$DATA_FOLDER" ]; then
    sudo mkdir -p "$DATA_FOLDER"
fi

sudo touch $DATA_FOLDER/current_install_step.txt
sudo chmod 666 $DATA_FOLDER/current_install_step.txt

message="Installing Dependencies"
log "$message"
echo "$message" > $DATA_FOLDER/current_install_step.txt

sudo ./install-dependencies.sh

if ! command -v node > /dev/null; then
  log "Node is not on PATH after installing dependencies. Aborting."
  exit 1
fi

MOONCLOCK_VERSION=$(node -p "require('./package.json').version")

if [ -z "$MOONCLOCK_VERSION" ]; then
  log "Could not read the version from package.json. Aborting."
  exit 1
fi

PREVIOUS_VERSION=""
if [ -L "$APP_FOLDER/current" ]; then
  PREVIOUS_VERSION=$(basename "$(readlink "$APP_FOLDER/current")")
fi

message="Installing Moonclock ($MOONCLOCK_VERSION)"
log "$message"
echo "$message" > $DATA_FOLDER/current_install_step.txt

log " -> Creating app folders"

sudo mkdir -p "$APP_FOLDER/releases"

log " -> Moving app to release folder"

RELEASE_FOLDER="$APP_FOLDER/releases/$MOONCLOCK_VERSION"
STAGING_FOLDER="$PWD"

# Both callers run this script from a throwaway staging directory — the in-app
# updater from moonclock/update, bootstrap.sh from a mktemp dir — so the release
# is moved rather than copied. On the updater's path staging and releases/ share
# a filesystem, which makes this an O(1) rename instead of writing all ~68 MB of
# the release to the SD card a second time. That second copy returned fast (the
# pages were only dirty, not flushed) but left the card in writeback for ~45s,
# and every command after it stalled behind the queue — most visibly `usermod`
# below, which fsyncs /etc/passwd and took 37s of an otherwise 78s update.
if [ "$STAGING_FOLDER" = "$RELEASE_FOLDER" ]; then
  log "   -> Already running from the release folder, skipping"
else
  if [ -e "$RELEASE_FOLDER" ]; then
    # Reinstalling a version that's already unpacked (bootstrap.sh re-run to
    # change panel flags, say). Swap it aside rather than deleting in place:
    # `current` may still point here, and a rename keeps the old inode alive for
    # anything already running out of it. The prune loop at the end of this
    # script sweeps up the .old folder in the background.
    log "   -> Release folder exists, replacing it"
    sudo rm -rf "$RELEASE_FOLDER.old"
    sudo mv "$RELEASE_FOLDER" "$RELEASE_FOLDER.old"
  fi

  sudo mv "$STAGING_FOLDER" "$RELEASE_FOLDER"

  # The rename keeps our inode, so bash's open fd on this script and the
  # process's cwd both follow it. But $PWD is now a path that no longer exists,
  # so every relative path below (services/, dist/) needs re-anchoring.
  cd "$RELEASE_FOLDER"
fi

log " -> Copying services to /etc/systemd/system/"

# Tracked so the daemon-reload further down can be skipped when every unit is
# already byte-identical. Note this rarely fires on a real update: four of the
# five units carry {VERSION} in their Description, so they differ every release
# by construction and the reload is genuinely needed.
UNITS_CHANGED=""

for unit in \
  moonclock-app.service \
  moonclock-hardware.service \
  moonclock-wifi-provision.service \
  moonclock-update-checker.service \
  moonclock-update-checker.timer; do
  if cmp -s "services/$unit" "/etc/systemd/system/$unit"; then
    continue
  fi
  sudo cp "services/$unit" /etc/systemd/system/
  UNITS_CHANGED="1"
done

if [ -z "$UNITS_CHANGED" ]; then
  log "   -> Unit files unchanged, skipping"
fi

log " -> Installing polkit rule (lets the root service reboot + manage WiFi)"

# polkit gates reboot and NetworkManager changes on an active login session, so
# the headless service is denied even as root without this. rules.d is watched
# and hot-reloaded by polkit, so no restart is needed.
sudo mkdir -p /etc/polkit-1/rules.d
sudo cp services/moonclock-polkit.rules /etc/polkit-1/rules.d/10-moonclock.rules

log " -> Configuring boot settings (sound off, button GPIO, isolated CPU)"

# Sound and the external-button GPIO pull-up live in the Pi's boot config. Unlike
# the rest of install.sh they only take effect on reboot, so they converge on the
# NEXT restart rather than immediately. Doing this here (not just once in
# bootstrap.sh) is what lets these settings reach already-installed clocks on
# update — bootstrap.sh no longer touches the boot config.
BOOT_CONFIG=""
if [ -f /boot/firmware/config.txt ]; then
  BOOT_CONFIG="/boot/firmware/config.txt"
elif [ -f /boot/config.txt ]; then
  BOOT_CONFIG="/boot/config.txt"
fi

if [ -z "$BOOT_CONFIG" ]; then
  # No Raspberry Pi boot layout (e.g. a dev VM) — nothing to configure here.
  log "   -> No Pi boot config found, skipping boot settings"
else
  BOOT_CONFIG_CHANGED=""

  # Disable onboard sound (required by rpi-rgb-led-matrix).
  BLACKLIST_FILE="/etc/modprobe.d/blacklist-rgb-matrix.conf"
  if [ ! -f "$BLACKLIST_FILE" ]; then
    echo "blacklist snd_bcm2835" | sudo tee "$BLACKLIST_FILE" > /dev/null
    sudo update-initramfs -u
    BOOT_CONFIG_CHANGED="1"
  fi

  if grep -qE '^[[:space:]]*dtparam=audio=on' "$BOOT_CONFIG"; then
    sudo sed -i 's/^[[:space:]]*dtparam=audio=on/dtparam=audio=off/' "$BOOT_CONFIG"
    BOOT_CONFIG_CHANGED="1"
  elif ! grep -qE '^[[:space:]]*dtparam=audio=off' "$BOOT_CONFIG"; then
    echo "dtparam=audio=off" | sudo tee -a "$BOOT_CONFIG" > /dev/null
    BOOT_CONFIG_CHANGED="1"
  fi

  # External-button pull-up on BCM 25 (must match BUTTON_GPIO_PIN in the hardware
  # service). Drop the old gpio=16 line moonclock used to write — BCM 16 is a
  # matrix data pin — so updating an older install migrates cleanly instead of
  # leaving a conflicting pull-up behind.
  if grep -qE '^[[:space:]]*gpio=16=ip,pu' "$BOOT_CONFIG"; then
    sudo sed -i '/^[[:space:]]*gpio=16=ip,pu/d' "$BOOT_CONFIG"
    BOOT_CONFIG_CHANGED="1"
  fi
  if ! grep -qE '^[[:space:]]*gpio=25=ip,pu' "$BOOT_CONFIG"; then
    echo "gpio=25=ip,pu" | sudo tee -a "$BOOT_CONFIG" > /dev/null
    BOOT_CONFIG_CHANGED="1"
  fi

  # Hand core 3 to the matrix. rpi-rgb-led-matrix pins its refresh thread to
  # that core and switches it to the `performance` governor when the kernel has
  # isolated it, which keeps everything else on the Pi — Next.js, the update
  # checker, us — from jittering the panel's OE pulse timing. Without it the
  # library just prints a suggestion to add this and carries on. isolcpus is a
  # kernel parameter, so it lives on the single line in cmdline.txt, not in
  # config.txt with the settings above.
  CMDLINE=""
  if [ -f /boot/firmware/cmdline.txt ]; then
    CMDLINE="/boot/firmware/cmdline.txt"
  elif [ -f /boot/cmdline.txt ]; then
    CMDLINE="/boot/cmdline.txt"
  fi

  if [ -n "$CMDLINE" ] && ! grep -q 'isolcpus=' "$CMDLINE"; then
    sudo sed -i '1s/[[:space:]]*$/ isolcpus=3/' "$CMDLINE"
    BOOT_CONFIG_CHANGED="1"
  fi

  # GPIO access for the (root) hardware service. Guarded because usermod
  # rewrites *and* fsyncs /etc/passwd, /etc/group, /etc/shadow and /etc/gshadow
  # on every run, so on a busy SD card this no-op re-add has been measured at
  # 37 seconds. After the first install there is nothing here to change.
  if ! id -nG root | tr ' ' '\n' | grep -qx gpio; then
    sudo usermod -a -G gpio root
  fi

  GPIO_RULES="/etc/udev/rules.d/99-gpio.rules"
  if [ ! -f "$GPIO_RULES" ]; then
    echo 'SUBSYSTEM=="gpio", GROUP="gpio", MODE="0660"' | sudo tee "$GPIO_RULES" > /dev/null
    sudo udevadm control --reload-rules
    sudo udevadm trigger
  fi

  if [ -n "$BOOT_CONFIG_CHANGED" ]; then
    log "   -> Boot config changed — reboot to apply the sound/GPIO/CPU settings"
  fi
fi

log " -> Configuring mDNS hostname"

# The address people actually use is http://moonclock.local. A 32x32 panel can't
# hand over a DHCP-assigned IP without a marquee you have to sit and watch, so
# the panel just confirms it's connected and the address is a constant instead.
#
# That name is published by avahi straight from the system hostname, so both are
# set here rather than only in bootstrap.sh — same reasoning as the boot config
# above: it's what lets already-installed clocks pick this up on update.
DESIRED_HOSTNAME="moonclock"
CURRENT_HOSTNAME="$(hostname)"

# Present on a stock Raspberry Pi OS image; installed defensively for VMs and
# any image that dropped it. Guarded so a normal update never touches apt.
if ! dpkg -s avahi-daemon > /dev/null 2>&1; then
  log "   -> Installing avahi-daemon"
  sudo apt-get install -y avahi-daemon
fi
sudo systemctl enable --now avahi-daemon > /dev/null 2>&1

if [ "$CURRENT_HOSTNAME" = "$DESIRED_HOSTNAME" ]; then
  log "   -> Hostname already $DESIRED_HOSTNAME, skipping"
elif [ "$CURRENT_HOSTNAME" != "raspberrypi" ]; then
  # Anything other than the stock name was chosen deliberately — renaming it
  # would break however its owner already reaches the box. avahi publishes
  # whatever hostname it finds, so <name>.local works either way.
  log "   -> Custom hostname '$CURRENT_HOSTNAME' — leaving it alone"
  log "   -> Reach the app at http://$CURRENT_HOSTNAME.local"
else
  log "   -> Renaming $CURRENT_HOSTNAME -> $DESIRED_HOSTNAME"

  # /etc/hosts first: between the rename and this line, anything resolving the
  # old name (sudo most visibly) warns about an unresolvable host.
  if grep -qE "^127\.0\.1\.1[[:space:]]" /etc/hosts; then
    sudo sed -i "s/^127\.0\.1\.1[[:space:]].*/127.0.1.1\t$DESIRED_HOSTNAME/" /etc/hosts
  else
    echo -e "127.0.1.1\t$DESIRED_HOSTNAME" | sudo tee -a /etc/hosts > /dev/null
  fi

  sudo hostnamectl set-hostname "$DESIRED_HOSTNAME"

  # avahi caches the hostname at startup, so it keeps publishing the old .local
  # name until it's restarted.
  sudo systemctl restart avahi-daemon > /dev/null 2>&1

  log "   -> Reach the app at http://$DESIRED_HOSTNAME.local"
fi

if [ -n "$UNITS_CHANGED" ]; then
  log " -> Reloading systemd daemons"
  sudo systemctl daemon-reload
else
  log " -> No unit files changed, skipping daemon-reload"
fi

log " -> Enabling services to start on restart"

sudo systemctl enable moonclock-app
sudo systemctl enable moonclock-hardware
sudo systemctl enable moonclock-wifi-provision
sudo systemctl enable moonclock-update-checker.timer

log " -> Seeding database file"

sudo touch $DATA_FOLDER/database.json
sudo chmod 666 $DATA_FOLDER/database.json

# Unconditional: this is what creates the database in a single process, before
# the app and hardware services start and race to seed it themselves.
log " -> Preparing the database"
NODE_ENV=production node ./dist/hardware/configure-panel.cjs "${PANEL_ARGS[@]}"

log " -> Loosen fontconfig cache permissions"

sudo chmod 666 /var/cache/fontconfig

message="Starting Moonclock"
log "$message"
echo "$message" > $DATA_FOLDER/current_install_step.txt

log " -> Symlinking release to moonclock/current"

sudo ln -sfn "$APP_FOLDER/releases/$MOONCLOCK_VERSION" $APP_FOLDER/current

log " -> Symlinking mc to bin/mc"

sudo ln -sf "$APP_FOLDER/current/bin/mc" /usr/local/bin/mc

log " -> Pruning old releases (keeping $MOONCLOCK_VERSION${PREVIOUS_VERSION:+ + $PREVIOUS_VERSION for rollback})"

for d in "$APP_FOLDER/releases"/*/; do
  v=$(basename "$d")
  if [ "$v" != "$MOONCLOCK_VERSION" ] && [ "$v" != "$PREVIOUS_VERSION" ]; then
    log "   -> Removing $v (in background)"
    # Deleting a release's node_modules (thousands of tiny files) on the SD card
    # takes ~30s and doesn't need to block the update. Hand it to a transient
    # unit so the app can restart immediately; --collect reaps the unit after.
    sudo systemd-run --no-block --collect rm -rf "$d"
  fi
done

echo "" > $DATA_FOLDER/current_install_step.txt

cd /
sudo rm -fr /usr/local/bin/moonclock/update
sudo rm -f /usr/local/bin/moonclock/release.tar.gz

sudo systemd-run --no-block --collect /usr/local/bin/mc restart
