#!/bin/bash

sudo cp moonclock-app.service /etc/systemd/system/
sudo cp moonclock-hardware.service /etc/systemd/system/

sudo systemctl daemon-reload

sudo systemctl enable moonclock-app
sudo systemctl enable moonclock-hardware

CURRENT_DIR=$(pwd)

sudo ln -s "$CURRENT_DIR/bin/mc" /usr/local/bin/mc
