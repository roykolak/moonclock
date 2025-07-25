#!/bin/bash

CURRENT_DIR=$(pwd)
DATA_FOLDER="/var/lib/moonclock"
APP_FOLDER="/usr/local/bin/moonclock"

if [ ! -d "$DATA_FOLDER" ]; then
    sudo mkdir -p "$DATA_FOLDER"
fi 

sudo touch $DATA_FOLDER/current_install_step.txt
sudo chmod 666 $DATA_FOLDER/current_install_step.txt

message="Installing Dependencies"
echo "$message"
echo "$message" > $DATA_FOLDER/current_install_step.txt

sudo ./install-dependencies.sh

MOONCLOCK_VERSION=$(jq -r '.version' package.json)

message="Installing Moonclock ($MOONCLOCK_VERSION)"
echo "$message"
echo "$message" > $DATA_FOLDER/current_install_step.txt


echo " -> Creating app folders"

if [ ! -d "$APP_FOLDER" ]; then
    sudo mkdir -p "$APP_FOLDER"
    sudo mkdir -p "$APP_FOLDER/releases"
    sudo mkdir -p "$APP_FOLDER/releases/$MOONCLOCK_VERSION"
else
    echo "   -> app folders exist, skipping"
fi 

echo " -> Copying app to release folder"

cp -r . "$APP_FOLDER/releases/$MOONCLOCK_VERSION"

echo " -> Copying services to /etc/systemd/system/"

sudo cp services/moonclock-app.service /etc/systemd/system/
sudo cp services/moonclock-hardware.service /etc/systemd/system/
sudo cp services/moonclock-update-checker.service /etc/systemd/system/
sudo cp services/moonclock-update-checker.timer /etc/systemd/system/

echo " -> Reloading systemd daemons"

sudo systemctl daemon-reload

echo " -> Enabling services to start on restart"

sudo systemctl enable moonclock-app
sudo systemctl enable moonclock-hardware
sudo systemctl enable moonclock-update-checker.timer

echo " -> Seeding database file"

sudo touch $DATA_FOLDER/database.json
sudo chmod 666 $DATA_FOLDER/database.json

echo " -> Seeding custom scenes"

if [ ! -d "$DATA_FOLDER/custom_scenes" ]; then
    sudo mkdir -p "$DATA_FOLDER/custom_scenes"
else
    echo "   -> custom scenes directory exists, skipping"
fi 

sudo cp "$APP_FOLDER/releases/$MOONCLOCK_VERSION/custom_scenes/"* "$DATA_FOLDER/custom_scenes/"

message="Starting Moonclock"
echo "$message"
echo "$message" > $DATA_FOLDER/current_install_step.txt

sleep 5

echo " -> Symlinking release to moonclock/current"

sudo ln -sfn "$APP_FOLDER/releases/$MOONCLOCK_VERSION" $APP_FOLDER/current

echo " -> Symlinking mc to bin/mc"

sudo ln -sf "$APP_FOLDER/current/bin/mc" /usr/local/bin/mc

sudo mc restart

echo "" > $DATA_FOLDER/current_install_step.txt