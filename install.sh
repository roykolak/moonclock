#!/bin/bash

echo '\n -> Copying services to /etc/systemd/system/'

sudo cp moonclock-app.service /etc/systemd/system/
sudo cp moonclock-hardware.service /etc/systemd/system/

echo "\n -> Reloading systemd daemons"

sudo systemctl daemon-reload

echo "\n -> Enabling services to start on restart"

sudo systemctl enable moonclock-app
sudo systemctl enable moonclock-hardware

echo "\n -> Symlinking ./bin/mc to /usr/local/bin/"

CURRENT_DIR=$(pwd)

sudo ln -s "$CURRENT_DIR/bin/mc" /usr/local/bin/mc
