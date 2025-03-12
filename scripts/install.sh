#!/bin/bash

sudo cp moonclock-app.service /etc/systemd/system/
sudo cp moonclock-hardware.service /etc/systemd/system/

sudo systemctl daemon-reload

sudo systemctl enable moonclock-app
sudo systemctl enable moonclock-hardware