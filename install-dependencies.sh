#!/bin/bash

echo " -> Installing NVM"

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"

echo " -> Installing Node 22.9.0"

source $NVM_DIR/nvm.sh

nvm install 22.9.0

echo " -> Symlinking Node & NPM"

if [ ! -d "/usr/local/bin/node" ]; then
    sudo ln -s "$NVM_DIR/versions/node/$(nvm version)/bin/node" "/usr/local/bin/node"
else
    echo "   -> Node symlink exists, skipping"
fi 

if [ ! -d "/usr/local/bin/npm" ]; then
    sudo ln -s "$NVM_DIR/versions/node/$(nvm version)/bin/npm" "/usr/local/bin/npm"
else
    echo "   -> NPM symlink exists, skipping"
fi 

echo " -> Installing apt-get packages"

sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev jq

echo " -> Installing AppleColorEmoji.ttf"

if [ ! -d "/usr/share/fonts/AppleColorEmoji.ttf" ]; then
    wget -O /usr/share/fonts/AppleColorEmoji.ttf https://github.com/samuelngs/apple-emoji-linux/releases/latest/download/AppleColorEmoji.ttf
else
    echo "   -> AppleColorEmoji.ttf exists, skipping"
fi 
