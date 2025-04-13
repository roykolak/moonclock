#!/bin/bash

CURRENT_DIR=$(pwd)
DATA_FOLDER="/var/lib/moonclock"

echo " -> Copying services to /etc/systemd/system/"

sudo cp moonclock-app.service /etc/systemd/system/
sudo cp moonclock-hardware.service /etc/systemd/system/

echo " -> Reloading systemd daemons"

sudo systemctl daemon-reload

echo " -> Enabling services to start on restart"

sudo systemctl enable moonclock-app
sudo systemctl enable moonclock-hardware

echo " -> Seeding database file"

if [ ! -d "$DATA_FOLDER" ]; then
    sudo mkdir -p "$DATA_FOLDER"
else
    echo "   -> data directory exists, skipping"
fi 

sudo touch $DATA_FOLDER/database.json
sudo chmod 666 $DATA_FOLDER/database.json

echo " -> Seeding custom scenes"

if [ ! -d "$DATA_FOLDER/custom_scenes" ]; then
    sudo mkdir -p "$DATA_FOLDER/custom_scenes"
else
    echo "   -> custom scenes directory exists, skipping"
fi 

sudo cp "$CURRENT_DIR/custom_scenes/"* "$DATA_FOLDER/custom_scenes/"

echo " -> Symlinking ./bin/mc to /usr/local/bin/"

sudo ln -sf "$CURRENT_DIR/bin/mc" /usr/local/bin/mc
