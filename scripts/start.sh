#!/bin/bash

sudo systemctl start moonclock-app
sudo systemctl start moonclock-hardware
sudo systemctl start moonclock-hardware-watcher
sudo systemctl start moonclock-hardware-watcher.path