# Moonclock

## What is this?

It's a LED display powered by a RaspberryPi and you control it via this webapp, hosted on the Pi.

You can configure an LED scene to display..

- For a period a time
- Until a specific time, tomorrow

I created it this to help with bedtime, naptime, and more for my toddler to teach them when activities are over.

<p float="left">
    <img src="images/panel-empty.png" width="200" />
    <img src="images/panel-active.png" width="200" />
    <img src="images/presets.png" width="200" />
    <img src="images/composer.png" width="200" />
</p>

## Getting Started

### Building a Moonclock

You'll need the following supplies:

1. A 32x32 LED panel, like this [one](https://www.adafruit.com/product/607)
1. A raspberry PI 3 or 4
1. [Female jumper wires](https://www.adafruit.com/product/266)
1. A usb cable that you can cut to power the LED panel
1. A usb cable to power the raspberry pi
1. Optional - [Translucent plastic](https://www.amazon.com/dp/B09XR1XBWG?ref=ppx_yo2ov_dt_b_fed_asin_title&th=1) to soften the LED Panel
1. Optional - 8.5" x 8.5" frame to house the Panel

Wire the panel according to the wiring chart [here](https://github.com/hzeller/rpi-rgb-led-matrix/blob/master/wiring.md). Remember, you are wiring a 32x32 panel, double check your work!

### Installing this software

First install the latest raspbian on your pi and join it to your network.

Then install [nvm](https://github.com/nvm-sh/nvm) and Node 22.9.0

```
nvm install 22.9.0
nvm use 22.9.0
```

_The software that writes to the panel needs to be run with root access and the moonclock app also needs root access because it is served on port 80. We need to do a little bit of magic to make nvm play nice with `sudo`..._

```
sudo ln -s "$NVM_DIR/versions/node/$(nvm version)/bin/node" "/usr/local/bin/node"
```

And finally run the following commands...

```
cd /usr/local/bin/
sudo git clone git@github.com:roykolak/moonclock.git
cd moonclock
sudo cp moonclock.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable moonclock
sudo systemctl start moonclock
```

Your raspberry pi should now be running and serving your moonclock! You can view the status and logs with the following commands:

```
sudo systemctl status moonclock
sudo journalctl -fu moonclock -n 100
```
