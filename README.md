# zoom

The official site for the Zoom client — a Fabric client for Minecraft 1.21.11.

Static HTML, CSS and vanilla JavaScript. No build step.

## Pages

- `index.html` — hero, features, DonutSMP, setup, pricing preview, FAQ
- `features.html` — the full module walkthrough
- `gallery.html` — real captures from the client, with filters and a lightbox
- `pricing.html` — $20/month or $40 lifetime and what happens after you buy
- `faq.html` — setup, version and licence answers
- `404.html` — custom GitHub Pages not-found page

Every **Buy now** button opens the Discord invite:
<https://discord.gg/vNaJJBzujt>

## Screenshots

All images in `assets/screenshots` were captured from the running client on
Minecraft 1.21.11. The gallery labels each capture by tab and by in-game scene.

## GitHub Pages

The site is deployed from the repository root with GitHub Pages:

1. Push this folder to a public repository named `zoom`.
2. In **Settings → Pages**, set **Source** to `Deploy from a branch`.
3. Choose the `main` branch and `/ (root)`.

The site is then available at `https://<username>.github.io/zoom/`.

`index.html`, `404.html` and all asset paths are relative, so the project site
subpath works without a build step.

## Notes

- Zoom is 1.21.11 only. There is no 1.8 version and no legacy branch.
- The site does not use cookies, analytics or third-party trackers.
- Fonts are loaded from Google Fonts. Everything else is local.
