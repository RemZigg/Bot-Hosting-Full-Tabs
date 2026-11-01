# Bot-Hosting: Full Tabs

A tiny Chrome extension that removes the **More** dropdown from the [Bot-Hosting](https://bot-hosting.net) deployment page and shows every item as a regular tab instead.

> **Disclaimer:** This is an unofficial, community-made extension. It is not affiliated with, endorsed by, or supported by Bot-Hosting.

## What it does

On a deployment page (`https://bot-hosting.net/a/d/<deployment-id>`) the tab bar normally looks like this:

```
Console | Files | Environment | Domains | Backups | Settings | More ▾
```

with GitHub, Startup, Packages, Network, SFTP, Location and Sharing hidden inside the dropdown.

With the extension installed, the bar becomes:

```
Console | Files | Environment | Domains | Backups | Settings | GitHub | Startup | Packages | Network | SFTP | Location | Sharing
```

- The new tabs use the site's own tab styling, so they look native.
- The tab for the page you're on is highlighted.
- If the bar is wider than the screen, it scrolls horizontally.
- Works with in-page (client-side) navigation, since the dashboard is a single-page app.

## Installation

The extension isn't published on the Chrome Web Store, so you load it manually (works in Chrome and other Chromium-based browsers such as Edge, Brave and Opera).

1. Download this repository: click **Code → Download ZIP** on GitHub and unzip it, or run:
   ```bash
   git clone https://github.com/RemZigg/Bot-Hosting-Full-Tabs.git
   ```
2. Open `chrome://extensions` in your browser.
3. Turn on **Developer mode** (top-right toggle).
4. Click **Load unpacked** and select the folder that contains `manifest.json`.
5. Open any deployment page on Bot-Hosting. The tabs appear automatically (refresh the page if it was already open).

### Updating

Pull or re-download the latest version, then click the reload icon on the extension's card at `chrome://extensions`.

### Uninstalling

Click **Remove** on the extension's card at `chrome://extensions`.

## How it works

| File | Purpose |
| --- | --- |
| `manifest.json` | Manifest V3 definition. Runs the script only on `https://bot-hosting.net/a/*`. |
| `content.js` | Clones an existing tab and adds the seven extra tabs, pointing at `/a/d/<id>/<page>`. A `MutationObserver` re-applies them after page navigation or re-renders. |
| `content.css` | Hides the **More** button and its dropdown, and lets the tab bar scroll horizontally. |

### Added tabs

| Tab | Path |
| --- | --- |
| GitHub | `/a/d/<id>/github` |
| Startup | `/a/d/<id>/startup` |
| Packages | `/a/d/<id>/packages` |
| Network | `/a/d/<id>/network` |
| SFTP | `/a/d/<id>/sftp` |
| Location | `/a/d/<id>/location` |
| Sharing | `/a/d/<id>/permissions` |

## Privacy

The extension requests **no permissions**, makes **no network requests**, and collects **no data**. It only modifies the tab bar in the page you're viewing.

## Customizing

To add, remove or rename tabs, edit the `EXTRA_TABS` array at the top of `content.js`:

```js
const EXTRA_TABS = [
  { path: 'github', label: 'GitHub' },
  // { path: 'your-page', label: 'Label' },
];
```

## Troubleshooting

- **Tabs don't appear:** reload the page, and make sure the extension is enabled at `chrome://extensions`.
- **Layout looks broken after a site update:** the extension relies on the site's current markup (`nav.tabs[aria-label="Deployment"]`, `.more-wrap`). If Bot-Hosting changes its dashboard, the selectors may need updating. Please open an issue.
- **The More menu has new items:** add them to `EXTRA_TABS`.

## Contributing

Issues and pull requests are welcome. When reporting a problem, please include your browser version and, if possible, a screenshot of the tab bar.

## License

[MIT](LICENSE)
