# Moonclock

## What is this?

It's a LED display powered by a RaspberryPi and you control it via this webapp, hosted on the Pi, or via an external button connected via GPIO pins.

You can configure an LED scene to display..

- For a period a time
- Until a specific time, tomorrow

I created this to help teach my toddler when bedtime and naptime are over, however the use-cases extend much farther!

```
"Daddy, my moonclock is off!"
My daughter, every morning at 7am! 😮‍💨
```

## The webapp and Panel

<p float="left">
    <img src="images/panel-empty.png" width="200" />
    <img src="images/panel-active.png" width="200" />
    <img src="images/presets.png" width="200" />
    <img src="images/composer.png" width="200" />
</p>

👉 Unfortunately **a photo doesn't capture the colors** well in the panel, but here is a real moonclock in action!

<p float="left">
    <img src="images/moon-real.png" width="400" />
    <img src="images/bunny-real.png" width="400" />
</p>

## Technology

The webapp is a Nextjs app that uses React Server Components and Server Actions. It runs off of a local json file that serves as the database.

The panel communication happens via the incredible [hzeller/rpi-rgb-led-matrix](https://github.com/hzeller/rpi-rgb-led-matrix) library and uses [alexeden/rpi-led-matrix](https://github.com/alexeden/rpi-led-matrix) which provides typescript bindings to hzeller's project.

The panel rendering is powered by [node-canvas](node-canvas). This allows for text, shapes, and more to easily be rendered on the panel. Additionally panel scenes can be rendered on the server or in the browser.

There are three processes (via systemd) that are run together:

- Nextjs webapp
- Hardware client
- Update checker

## Building a Moonclock

You'll need the following supplies:

1. A 32x32 LED panel, like this [one](https://www.adafruit.com/product/607)
1. A raspberry PI 3 or 4
1. [Female jumper wires](https://www.adafruit.com/product/266)
1. A usb cable that you can cut to power the LED panel
1. A usb cable to power the raspberry pi
1. Optional - For Button: [16mm push button](https://www.adafruit.com/product/1504)
1. Optional - For Button: [Button quick connect wire pairs](https://www.adafruit.com/product/1152)
1. Optional - For Presentation: [Translucent plastic](https://www.amazon.com/dp/B09XR1XBWG?ref=ppx_yo2ov_dt_b_fed_asin_title&th=1) to soften the LED Panel
1. Optional - For Presentation: 8.5" x 8.5" frame to house the Panel

Wire the panel according to the wiring chart [here](https://github.com/hzeller/rpi-rgb-led-matrix/blob/master/wiring.md).

👉 Remember, you are wiring a 32x32 panel, double check your work!

## Installation

Install the latest raspbian (not desktop verion!) on your pi. Joining it to WiFi up front is optional — you can also let Moonclock walk you through it after it's running (see [WiFi setup](#wifi-setup)). Then ssh into the machine and run...

```
curl -fsSL https://raw.githubusercontent.com/roykolak/moonclock/main/bootstrap.sh | sudo bash
```

That's the whole thing. It prepares the machine, downloads the latest release, installs it, and reboots.

Specifically, it...

- Disables onboard sound, which `hzeller/rpi-rgb-led-matrix` [requires](https://github.com/hzeller/rpi-rgb-led-matrix?tab=readme-ov-file#bad-interaction-with-sound)
- Configures GPIO 25 and its udev rule, for the optional external button
- Installs `wifi-connect` and NetworkManager for the WiFi setup portal
- Downloads and installs the latest release
- Reboots to apply the boot config

It's safe to re-run — every step checks before it changes anything.

It installs the latest stable release. To run beta builds, switch the "Release channel" setting to Beta once you're up.

Pass `--no-reboot` if you'd rather reboot yourself:

```
curl -fsSL https://raw.githubusercontent.com/roykolak/moonclock/main/bootstrap.sh | sudo bash -s -- --no-reboot
```

You can configure the LED panel up front instead of editing it on the Settings
page after first boot. Any of these flags are forwarded to the installer, and
only the fields you pass are changed:

```
curl -fsSL https://raw.githubusercontent.com/roykolak/moonclock/main/bootstrap.sh | sudo bash -s -- \
  --brightness=50 --hardware-mapping=adafruit-hat-pwm --pwm-bits=11 \
  --gpio-slowdown=4 --pwm-lsb-nanoseconds=130
```

- `--brightness=N` — panel brightness, 0-100
- `--hardware-mapping=NAME` — `regular`, `adafruit-hat`, `adafruit-hat-pwm`, or `regular-pi1`
- `--pwm-bits=N` — PWM bits, 1-11
- `--gpio-slowdown=N` — GPIO slowdown, 0-4
- `--pwm-lsb-nanoseconds=N` — PWM LSB nanoseconds

Re-running with these flags overwrites those fields even if you've since tuned
them on the Settings page. The flags require a release that includes them, so
they're a no-op against older releases.

Your moonclock will automatically start after any pi restarts.

To start Moonclock immediate run...

```
sudo mc start
```

## WiFi setup

If the pi boots without a network connection, Moonclock guides you through joining
one — no keyboard, screen, or ssh required:

1. The LED panel shows a pulsing amber **WiFi "searching" animation** — its
   signal for "I need to be set up."
2. On your phone, open WiFi settings and join the open **Moonclock** network. A
   setup page pops up automatically.
3. Pick your home WiFi, enter its password, and submit.
4. The pi connects, the setup hotspot disappears, and the panel scrolls the IP
   address where you can reach the app.

Under the hood this is [balena wifi-connect](https://github.com/balena-os/wifi-connect)
running a captive portal — with our own Moonclock-branded setup page
(`wifi-connect-ui/`, shipped in the release) in place of its stock UI —
coordinated with the panel by the `moonclock-wifi-provision` service. Once the pi
is connected, the web app starts as usual.

**Changing networks later** (e.g. you moved): press and hold the external button
for ~5 seconds. The panel shows a "Reset WiFi?" countdown; keep holding and the
pi forgets its saved networks and reboots back into the setup flow above.

## Updating

Your moonclock will check if there is a new version available nightly.

When a new version is available, you will see a banner like the one below in your moonclock app. Just click the update buttons and you'll be all set in a few seconds!

<img src="images/update-prompt.png" width="400" />

### Release channels

By default your moonclock only receives stable releases. If you want to try prerelease builds, switch the "Release channel" setting to Beta on the Settings page.

Switching back to Stable never downgrades — the moonclock keeps its current beta build until a newer stable release ships, then updates to that.

## Data Storage

All data is stored in `/var/lib/moonclock`. This includes...

- `database.json`
- `custom_scenes/`

This means that updating moonclock to the latest release will not effect the current of moonclock's data and configuration.

## Debugging

You can view logs with the following commands:

```
mc logs
```

Also you can trigger a restart of the hardware process with:

```
mc restart
```

## Developing locally

Clone and install Moonclock...

```
cd /usr/local/bin/
sudo git clone https://github.com/roykolak/moonclock.git
cd moonclock
sudo npm install
```

```
sudo npm run start:dev
```

## Build a release

```
npm run build
```

## Publishing a release

`npm run release <channel>` bumps the version, builds the tarball, pushes the commit and tag, and creates the GitHub release with auto-generated notes. A channel (`prod` or `beta`) is required — running it without one prints usage and publishes nothing.

```
npm run release prod          # stable, patch bump
npm run release prod minor
npm run release prod major
npm run release prod 0.87.5   # specific version
```

Requires a clean working tree on `main` and an authenticated `gh` CLI (`gh auth status`). If the build or push fails, the local commit and tag are rolled back automatically. If the GitHub release step fails after the push, the script prints the commands needed to clean up the remote tag.

### Beta releases

`npm run release beta` publishes a GitHub prerelease that only moonclocks on the Beta release channel will pick up.

```
npm run release beta          # 0.91.0 -> 0.92.0-beta.0, then -beta.1, -beta.2, ...
npm run release beta major    # 0.91.0 -> 1.0.0-beta.0
npm run release beta patch    # 0.91.0 -> 0.91.1-beta.0
```

Starting from a stable version begins a new beta line (minor bump by default); running it again on a beta version increments `-beta.N`.

To promote a beta line to stable, run `npm run release prod` — on `0.92.0-beta.3` it publishes `0.92.0`. The script prints a promotion notice when this happens.

## Developing on a pi

```
scp release.tar.gz pi@192.168.4.225:~/
```

## Developing on a vm

This is useful to test updates to the service files, install scripts, and the update process.

Would recommend using [multipass](https://canonical.com/multipass) as it is the quickiest way to start up a vm via the commandline.

```
npm run build
multipass launch --name moonclock-vm
multipass start moonclock-vm
multipass transfer release.tar.gz moonclock-vm:
multipass shell moonclock-vm
tar -xzvf release.tar.gz
cd ./moonclock
mv dist/hardware/vm-canvas.node dist/hardware/canvas.node
sudo ./install.sh

multipass info moonclock-vm
```
