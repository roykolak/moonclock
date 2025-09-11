#!/bin/bash

echo " -> Installing NVM"

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"

echo " -> Installing Node 22.9.0"

source $NVM_DIR/nvm.sh

nvm install 22.9.0

echo " -> Symlinking Node & NPM"

if [ ! -f "/usr/local/bin/node" ]; then
    sudo ln -s "$NVM_DIR/versions/node/$(nvm version)/bin/node" "/usr/local/bin/node"
else
    echo "   -> Node symlink exists, skipping"
fi 

if [ ! -f "/usr/local/bin/npm" ]; then
    sudo ln -s "$NVM_DIR/versions/node/$(nvm version)/bin/npm" "/usr/local/bin/npm"
else
    echo "   -> NPM symlink exists, skipping"
fi 