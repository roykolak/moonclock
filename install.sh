#!/bin/bash

LOG_FILE="/tmp/moonclock-update.log"
DATA_FOLDER="/var/lib/moonclock"
APP_FOLDER="/usr/local/bin/moonclock"

log() {
  echo "$1"
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

if [ ! -d "$DATA_FOLDER" ]; then
    sudo mkdir -p "$DATA_FOLDER"
fi

sudo touch $DATA_FOLDER/current_install_step.txt
sudo chmod 666 $DATA_FOLDER/current_install_step.txt

message="Installing Dependencies"
log "$message"
echo "$message" > $DATA_FOLDER/current_install_step.txt

sudo ./install-dependencies.sh

MOONCLOCK_VERSION=$(jq -r '.version' package.json)

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
sudo cp services/moonclock-update-checker.service /etc/systemd/system/
sudo cp services/moonclock-update-checker.timer /etc/systemd/system/

log " -> Reloading systemd daemons"

sudo systemctl daemon-reload

log " -> Enabling services to start on restart"

sudo systemctl enable moonclock-app
sudo systemctl enable moonclock-hardware
sudo systemctl enable moonclock-update-checker.timer

log " -> Seeding database file"

sudo touch $DATA_FOLDER/database.json
sudo chmod 666 $DATA_FOLDER/database.json

log " -> Loosen fontconfig cache permissions"

sudo chmod 666 /var/cache/fontconfig

log " -> Seeding custom scenes"

if [ ! -d "$DATA_FOLDER/custom_scenes" ]; then
    sudo mkdir -p "$DATA_FOLDER/custom_scenes"
else
    log "   -> custom scenes directory exists, skipping"
fi

sudo cp "$APP_FOLDER/releases/$MOONCLOCK_VERSION/custom_scenes/"* "$DATA_FOLDER/custom_scenes/"

message="Starting Moonclock"
log "$message"
echo "$message" > $DATA_FOLDER/current_install_step.txt

sleep 5

log " -> Symlinking release to moonclock/current"

sudo ln -sfn "$APP_FOLDER/releases/$MOONCLOCK_VERSION" $APP_FOLDER/current

log " -> Symlinking mc to bin/mc"

sudo ln -sf "$APP_FOLDER/current/bin/mc" /usr/local/bin/mc

echo "" > $DATA_FOLDER/current_install_step.txt

sudo rm -fr /usr/local/bin/moonclock/update

sudo mc restart
