#!/bin/bash
set -euo pipefail

# Takes a freshly flashed Raspberry Pi OS Lite card from nothing to a running
# moonclock. Prepares the machine (sound, GPIO), downloads the latest release,
# and runs install.sh.
#
#   curl -fsSL https://raw.githubusercontent.com/roykolak/moonclock/main/bootstrap.sh | sudo bash
#
# Safe to re-run: every step checks before it changes anything.
#
# Installs the latest stable release. To run beta builds, switch the release
# channel to Beta on the Settings page once you're up.

DOWNLOAD_URL="https://github.com/roykolak/moonclock/releases/latest/download/release.tar.gz"
SKIP_REBOOT=""

usage() {
  cat >&2 <<'EOF'
Usage: bootstrap.sh [--no-reboot]

  --no-reboot   Don't reboot when finished. The panel will not work correctly
                until you reboot yourself.
EOF
  exit 1
}

while [ $# -gt 0 ]; do
  case "$1" in
    --no-reboot) SKIP_REBOOT="1"; shift ;;
    -h | --help) usage ;;
    *) echo "Unknown option: $1" >&2; usage ;;
  esac
done

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

WORK_DIR=$(mktemp -d)
trap 'rm -rf "$WORK_DIR"' EXIT

echo "Installing system packages"

apt-get update

# Only needed by install.sh in releases up to 0.91.0, which read the version
# with jq. Newer releases use node.
apt-get install -y jq

echo "Preparing the machine"

echo " -> Disabling onboard sound (required by rpi-rgb-led-matrix)"

BLACKLIST_FILE="/etc/modprobe.d/blacklist-rgb-matrix.conf"
if [ ! -f "$BLACKLIST_FILE" ]; then
  echo "blacklist snd_bcm2835" > "$BLACKLIST_FILE"
  update-initramfs -u
else
  echo "   -> already blacklisted, skipping"
fi

if grep -qE '^[[:space:]]*dtparam=audio=on' "$BOOT_CONFIG"; then
  sed -i 's/^[[:space:]]*dtparam=audio=on/dtparam=audio=off/' "$BOOT_CONFIG"
elif ! grep -qE '^[[:space:]]*dtparam=audio=off' "$BOOT_CONFIG"; then
  echo "dtparam=audio=off" >> "$BOOT_CONFIG"
else
  echo "   -> audio already off, skipping"
fi

echo " -> Configuring GPIO for the external button"

if ! grep -qE '^[[:space:]]*gpio=16=ip,pu' "$BOOT_CONFIG"; then
  echo "gpio=16=ip,pu" >> "$BOOT_CONFIG"
else
  echo "   -> gpio=16 already configured, skipping"
fi

usermod -a -G gpio root

GPIO_RULES="/etc/udev/rules.d/99-gpio.rules"
if [ ! -f "$GPIO_RULES" ]; then
  echo 'SUBSYSTEM=="gpio", GROUP="gpio", MODE="0660"' > "$GPIO_RULES"
  udevadm control --reload-rules
  udevadm trigger
else
  echo "   -> gpio udev rule exists, skipping"
fi

echo " -> Setting up WiFi provisioning (NetworkManager + wifi-connect)"

# NetworkManager manages WiFi on Raspberry Pi OS Bookworm (already present on a
# stock image; installed here defensively). dnsmasq-base gives NetworkManager
# the DNS/DHCP it needs to run the setup hotspot's captive portal.
apt-get install -y network-manager dnsmasq-base

# balena wifi-connect: brings up an open hotspot + captive portal when the Pi is
# offline so a phone can hand it WiFi credentials. We only need balena's binary —
# the portal page is our own, shipped in the release and pointed at via
# --ui-directory (see bin/wifi-provision). See there for how it's launched.
#
# Our portal talks to wifi-connect's /networks and /connect HTTP API, which isn't
# a documented contract — wifi-connect-ui/index.html mirrors balena's own UI for
# THIS version. When bumping WC_VERSION, re-check that page against balena's
# ui/src at the new tag.
WC_VERSION="v4.11.84"
WC_BIN="/usr/local/sbin/wifi-connect"

if [ ! -x "$WC_BIN" ]; then
  case "$(uname -m)" in
    aarch64)
      WC_ASSET="wifi-connect-aarch64-unknown-linux-gnu.tar.gz" ;;
    armv7l | armv6l)
      WC_ASSET="wifi-connect-armv7-unknown-linux-gnueabihf.tar.gz" ;;
    *)
      WC_ASSET="" ;;
  esac

  if [ -z "$WC_ASSET" ]; then
    echo "   -> Unsupported architecture $(uname -m) for wifi-connect; skipping."
    echo "   -> WiFi setup portal will be unavailable, but Moonclock will still run."
  else
    WC_BASE="https://github.com/balena-os/wifi-connect/releases/download/$WC_VERSION"

    curl -fsSL -o "$WORK_DIR/wifi-connect.tar.gz" "$WC_BASE/$WC_ASSET"

    tar -xzf "$WORK_DIR/wifi-connect.tar.gz" -C "$WORK_DIR"
    WC_EXTRACTED="$(find "$WORK_DIR" -type f -name wifi-connect | head -n1)"
    install -m 0755 "$WC_EXTRACTED" "$WC_BIN"

    echo "   -> Installed wifi-connect $WC_VERSION"
  fi
else
  echo "   -> wifi-connect already installed, skipping"
fi

echo "Downloading Moonclock"

curl -fsSL -o "$WORK_DIR/release.tar.gz" "$DOWNLOAD_URL"
tar -xzf "$WORK_DIR/release.tar.gz" -C "$WORK_DIR"

RELEASE_DIR="$WORK_DIR/moonclock"
if [ ! -f "$RELEASE_DIR/install.sh" ]; then
  echo "Downloaded release is missing install.sh. Aborting." >&2
  exit 1
fi

chmod +x "$RELEASE_DIR/install.sh" "$RELEASE_DIR/install-dependencies.sh"

echo "Running install.sh"

cd "$RELEASE_DIR"
./install.sh

echo ""

if [ -n "$SKIP_REBOOT" ]; then
  echo "Moonclock is installed. Reboot to apply the boot config."
else
  echo "Moonclock is installed. Rebooting in 5 seconds..."
  sleep 5
  reboot
fi
