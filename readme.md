# YouTube Video Zoom

A Firefox extension that lets you zoom into YouTube videos using your mouse scroll wheel, with a minimap overlay showing your current zoom position — similar to Discord's screen share zoom feature.

## Features

- Scroll over the video to zoom in and out
- Zoom is centered on the cursor position
- Click and drag to pan around while zoomed
- Minimap in the bottom-right corner of the video shows the full frame with a highlighted rectangle indicating the zoomed area
- Double-click to reset zoom
- Works in normal, theater, and fullscreen modes — the minimap stays correctly anchored to the video in all three
- Toolbar icon opens a popup with two checkboxes:
  - **Allow minimap** — enable/disable the minimap overlay
  - **Stop zoom** — unchecked by default (zoom enabled); check it to disable zoom entirely and restore normal scrolling

## Installation

### From addons.mozilla.org

Available as a signed extension on addons.mozilla.org: https://addons.mozilla.org/en-US/firefox/addon/youtube-video-zoom/

### Manual / development

1. Download or clone this repository
2. Open Firefox and navigate to `about:debugging`
3. Click **This Firefox** in the left sidebar
4. Click **Load Temporary Add-on**
5. Select the `manifest.json` file from the repository folder

A manually loaded extension stays active only until you close Firefox.

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
- `popup.html` / `popup.js` — Toolbar popup with the "Allow minimap" and "Stop zoom" checkboxes
- `logo.png` — Extension/toolbar icon

## Notes

- Only works on `youtube.com`
- The minimap renders the actual video frame in real time using a canvas element
- Zoom level goes from 1x up to 5x

---

Made with &lt;3 by Claude Sonnet 4.6
