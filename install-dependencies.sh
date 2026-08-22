#!/bin/bash

# Node version each release is built and tested against. Kept in one variable so
# the guard below and the nvm install can't drift apart.
NODE_VERSION="22.9.0"

# install.sh runs this on every update, but after the first install there is
# normally nothing to do — and the nvm bootstrap below curls
# raw.githubusercontent.com unconditionally, which has cost between 3 and 12
# seconds of an update that already downloaded everything it needs. It also makes
# a working update depend on GitHub being reachable at install time, on a device
# whose whole point is running unattended. Skip it when the symlinked runtime is
# already the version we want.
if [ -x /usr/local/bin/node ] \
  && [ -x /usr/local/bin/npm ] \
  && [ "$(/usr/local/bin/node -v 2>/dev/null)" = "v$NODE_VERSION" ]; then
  echo " -> Node v$NODE_VERSION already installed, skipping"
  exit 0
fi

echo " -> Installing NVM"

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"

echo " -> Installing Node $NODE_VERSION"

source $NVM_DIR/nvm.sh

nvm install "$NODE_VERSION"

echo " -> Symlinking Node & NPM"

# Forced rather than created-only-when-missing. The old version of this left the
# symlinks alone if they already existed, which meant bumping NODE_VERSION would
# install the new runtime but keep /usr/local/bin/node pointed at the old one —
# and the guard above would then never be satisfied, re-running this whole script
# on every update forever.
NODE_BIN_DIR="$NVM_DIR/versions/node/$(nvm version)/bin"

sudo ln -sfn "$NODE_BIN_DIR/node" /usr/local/bin/node
sudo ln -sfn "$NODE_BIN_DIR/npm" /usr/local/bin/npm
