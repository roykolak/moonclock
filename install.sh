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
EOF
  exit 1
}

while [ $# -gt 0 ]; do
  case "$1" in
    --brightness=* | --hardware-mapping=* | --pwm-bits=* | \
    --gpio-slowdown=* | --pwm-lsb-nanoseconds=*)
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

if [ ! -d "$APP_FOLDER" ]; then
    sudo mkdir -p "$APP_FOLDER"
    sudo mkdir -p "$APP_FOLDER/releases"
    sudo mkdir -p "$APP_FOLDER/releases/$MOONCLOCK_VERSION"
else
    log "   -> app folders exist, skipping"
fi

log " -> Copying app to release folder"

cp -r . "$APP_FOLDER/releases/$MOONCLOCK_VERSION"

log " -> Copying services to /etc/systemd/system/"

sudo cp services/moonclock-app.service /etc/systemd/system/
sudo cp services/moonclock-hardware.service /etc/systemd/system/
sudo cp services/moonclock-wifi-provision.service /etc/systemd/system/
sudo cp services/moonclock-update-checker.service /etc/systemd/system/
sudo cp services/moonclock-update-checker.timer /etc/systemd/system/

log " -> Installing polkit rule (lets the root service reboot + manage WiFi)"

# polkit gates reboot and NetworkManager changes on an active login session, so
# the headless service is denied even as root without this. rules.d is watched
# and hot-reloaded by polkit, so no restart is needed.
sudo mkdir -p /etc/polkit-1/rules.d
sudo cp services/moonclock-polkit.rules /etc/polkit-1/rules.d/10-moonclock.rules

log " -> Configuring boot settings (sound off, button GPIO)"

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

  # GPIO access for the (root) hardware service.
  sudo usermod -a -G gpio root

  GPIO_RULES="/etc/udev/rules.d/99-gpio.rules"
  if [ ! -f "$GPIO_RULES" ]; then
    echo 'SUBSYSTEM=="gpio", GROUP="gpio", MODE="0660"' | sudo tee "$GPIO_RULES" > /dev/null
    sudo udevadm control --reload-rules
    sudo udevadm trigger
  fi

  if [ -n "$BOOT_CONFIG_CHANGED" ]; then
    log "   -> Boot config changed — reboot to apply the sound/GPIO settings"
  fi
fi

log " -> Reloading systemd daemons"

sudo systemctl daemon-reload

log " -> Enabling services to start on restart"

sudo systemctl enable moonclock-app
sudo systemctl enable moonclock-hardware
sudo systemctl enable moonclock-wifi-provision
sudo systemctl enable moonclock-update-checker.timer

log " -> Seeding database file"

sudo touch $DATA_FOLDER/database.json
sudo chmod 666 $DATA_FOLDER/database.json

if [ ${#PANEL_ARGS[@]} -gt 0 ]; then
  log " -> Applying LED panel configuration"
  NODE_ENV=production node ./dist/hardware/configure-panel.cjs "${PANEL_ARGS[@]}"
fi

log " -> Loosen fontconfig cache permissions"

sudo chmod 666 /var/cache/fontconfig

message="Starting Moonclock"
log "$message"
echo "$message" > $DATA_FOLDER/current_install_step.txt

# Give the UI (polls current_install_step.txt every 1s) a moment to catch the
# "Starting Moonclock" step and begin its reload countdown before the symlink
# swap + restart drops its connection.
sleep 2

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
