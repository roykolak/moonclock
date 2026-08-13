#!/bin/bash
set -euo pipefail

# Takes a freshly flashed Raspberry Pi OS Lite card from nothing to a running
# moonclock. Prepares the machine (sound, GPIO), downloads the latest release,
# and runs install.sh.
#
#   curl -fsSL https://raw.githubusercontent.com/roykolak/moonclock/main/bootstrap.sh | sudo bash
#
# Safe to re-run: every step checks before it changes anything.

REPO="roykolak/moonclock"
DATA_FOLDER="/var/lib/moonclock"
CHANNEL="stable"
RESTORE_FROM=""
SKIP_REBOOT=""
REBOOT_REQUIRED=""

usage() {
  cat >&2 <<'EOF'
Usage: bootstrap.sh [--beta] [--restore <backup.tar.gz>] [--no-reboot]

  --beta                 Install the latest prerelease instead of the latest stable.
  --restore <file>       Restore a /var/lib/moonclock backup after installing.
                         Expects a tar.gz of the data folder's contents
                         (database.json, custom_scenes/).
  --no-reboot            Don't reboot, even if boot config changed. The panel
                         will not work correctly until you reboot yourself.
EOF
  exit 1
}

while [ $# -gt 0 ]; do
  case "$1" in
    --beta) CHANNEL="beta"; shift ;;
    --restore) RESTORE_FROM="${2:-}"; [ -n "$RESTORE_FROM" ] || usage; shift 2 ;;
    --no-reboot) SKIP_REBOOT="1"; shift ;;
    -h | --help) usage ;;
    *) echo "Unknown option: $1" >&2; usage ;;
  esac
done

log() {
  echo "$1"
}

if [ "$(id -u)" -ne 0 ]; then
  echo "bootstrap.sh must run as root. Try: curl -fsSL <url> | sudo bash" >&2
  exit 1
fi

if [ -f /boot/firmware/config.txt ]; then
  BOOT_CONFIG="/boot/firmware/config.txt"
elif [ -f /boot/config.txt ]; then
  BOOT_CONFIG="/boot/config.txt"
else
  echo "Can't find config.txt in /boot/firmware or /boot." >&2
  echo "This doesn't look like a Raspberry Pi running Raspberry Pi OS." >&2
  exit 1
fi

if [ -n "$RESTORE_FROM" ]; then
  if [ ! -f "$RESTORE_FROM" ]; then
    echo "Backup file not found: $RESTORE_FROM" >&2
    exit 1
  fi
  # Resolved now because the restore happens after we've changed directories.
  RESTORE_FROM=$(cd "$(dirname "$RESTORE_FROM")" && pwd)/$(basename "$RESTORE_FROM")
fi

WORK_DIR=$(mktemp -d)
trap 'rm -rf "$WORK_DIR"' EXIT

log "Installing system packages"

apt-get update

# jq is only needed by install.sh in releases up to 0.91.0, which read the
# version with it. Newer releases use node. Keep installing it so bootstrap can
# still install an older release.
apt-get install -y curl ca-certificates python3 tar jq

log "Preparing the machine"

log " -> Disabling onboard sound (required by rpi-rgb-led-matrix)"

BLACKLIST_FILE="/etc/modprobe.d/blacklist-rgb-matrix.conf"
if [ ! -f "$BLACKLIST_FILE" ]; then
  echo "blacklist snd_bcm2835" > "$BLACKLIST_FILE"
  update-initramfs -u
  REBOOT_REQUIRED="1"
else
  log "   -> already blacklisted, skipping"
fi

if grep -qE '^[[:space:]]*dtparam=audio=on' "$BOOT_CONFIG"; then
  sed -i 's/^[[:space:]]*dtparam=audio=on/dtparam=audio=off/' "$BOOT_CONFIG"
  REBOOT_REQUIRED="1"
elif ! grep -qE '^[[:space:]]*dtparam=audio=off' "$BOOT_CONFIG"; then
  echo "dtparam=audio=off" >> "$BOOT_CONFIG"
  REBOOT_REQUIRED="1"
else
  log "   -> audio already off in $(basename "$BOOT_CONFIG"), skipping"
fi

log " -> Configuring GPIO for the external button"

if ! grep -qE '^[[:space:]]*gpio=16=ip,pu' "$BOOT_CONFIG"; then
  echo "gpio=16=ip,pu" >> "$BOOT_CONFIG"
  REBOOT_REQUIRED="1"
else
  log "   -> gpio=16 already configured, skipping"
fi

usermod -a -G gpio root

GPIO_RULES="/etc/udev/rules.d/99-gpio.rules"
if [ ! -f "$GPIO_RULES" ]; then
  echo 'SUBSYSTEM=="gpio", GROUP="gpio", MODE="0660"' > "$GPIO_RULES"
  udevadm control --reload-rules
  udevadm trigger
else
  log "   -> gpio udev rule exists, skipping"
fi

log "Finding the latest $CHANNEL release"

if [ "$CHANNEL" = "stable" ]; then
  # GitHub redirects this to the newest non-prerelease asset by this name.
  DOWNLOAD_URL="https://github.com/$REPO/releases/latest/download/release.tar.gz"
else
  # Releases come back newest-first, so the first eligible one is the one we want.
  DOWNLOAD_URL=$(python3 - "$REPO" <<'PY'
import json, sys, urllib.request

repo = sys.argv[1]
url = f"https://api.github.com/repos/{repo}/releases"
with urllib.request.urlopen(url, timeout=30) as response:
    releases = json.load(response)

for release in releases:
    if release.get("draft"):
        continue
    assets = release.get("assets") or []
    if not assets:
        continue
    print(assets[0]["browser_download_url"])
    break
else:
    sys.exit("No release with a downloadable asset found")
PY
  )
fi

log " -> $DOWNLOAD_URL"

log "Downloading Moonclock"

curl -fsSL -o "$WORK_DIR/release.tar.gz" "$DOWNLOAD_URL"
tar -xzf "$WORK_DIR/release.tar.gz" -C "$WORK_DIR"

RELEASE_DIR="$WORK_DIR/moonclock"
if [ ! -f "$RELEASE_DIR/install.sh" ]; then
  echo "Downloaded release is missing install.sh. Aborting." >&2
  exit 1
fi

chmod +x "$RELEASE_DIR/install.sh" "$RELEASE_DIR/install-dependencies.sh"

log "Running install.sh"

cd "$RELEASE_DIR"
./install.sh
cd /

if [ -n "$RESTORE_FROM" ]; then
  log "Restoring data from $RESTORE_FROM"

  # install.sh seeds an empty database and the stock custom scenes, so the
  # restore has to land after it to win.
  tar -xzf "$RESTORE_FROM" -C "$DATA_FOLDER"

  if [ -f "$DATA_FOLDER/database.json" ]; then
    chmod 666 "$DATA_FOLDER/database.json"
  fi

  log " -> Restarting Moonclock with the restored data"
  /usr/local/bin/mc restart
fi

echo ""

if [ -n "$REBOOT_REQUIRED" ] && [ -z "$SKIP_REBOOT" ]; then
  log "Moonclock is installed. Rebooting in 5 seconds to apply the boot config..."
  sleep 5
  reboot
else
  log "Moonclock is installed."
  if [ -n "$REBOOT_REQUIRED" ]; then
    echo "Reboot before using the panel — the boot config changed."
  fi
fi
