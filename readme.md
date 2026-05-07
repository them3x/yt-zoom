# YouTube Video Zoom

A Firefox extension that lets you zoom into YouTube videos using your mouse scroll wheel, with a minimap overlay showing your current zoom position — similar to Discord's screen share zoom feature.

## Features

- Scroll over the video to zoom in and out
- Zoom is centered on the cursor position
- Click and drag to pan around while zoomed
- Minimap in the bottom-right corner shows the full video with a highlighted rectangle indicating the zoomed area
- Double-click to reset zoom
- Works in fullscreen mode

## Installation

This extension is not yet published to addons.mozilla.org, so it needs to be loaded manually.

1. Download or clone this repository
2. Open Firefox and navigate to `about:debugging`
3. Click **This Firefox** in the left sidebar
4. Click **Load Temporary Add-on**
5. Select the `manifest.json` file from the repository folder

The extension will stay active until you close Firefox. To make it permanent, the extension would need to be signed via Mozilla's add-on portal.

## Usage

| Action | Result |
|---|---|
| Scroll up (over video) | Zoom in |
| Scroll down (over video) | Zoom out |
| Click and drag | Pan the zoomed view |
| Double-click | Reset zoom |

## Files

- `manifest.json` — Extension manifest (Firefox WebExtension, Manifest V2)
- `content.js` — Content script injected into YouTube pages

## Notes

- Only works on `youtube.com`
- The minimap renders the actual video frame in real time using a canvas element
- Zoom level goes from 1x up to 5x

---

Made with &lt;3 by Claude Sonnet 4.6
