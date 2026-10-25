# zoom

The official site for the Zoom client — a Fabric client for Minecraft 1.21.11.

Live: <https://witheredpoop-sys.github.io/zoom/>

Static HTML, CSS and vanilla JavaScript. No build step.

## Pages

- `index.html` — hero, what's new, features, DonutSMP, setup, free download, FAQ
- `features.html` — the full module walkthrough
- `gallery.html` — real captures from the client, with filters and a lightbox
- `download.html` — the free Windows MSI, requirements and install steps
- `faq.html` — setup, version and free-download answers
- `404.html` — custom GitHub Pages not-found page

## Download

Zoom is free. The download button serves
`download/ZoomClient-Setup-1.0.0.msi`, a per-user Windows installer built with
`jpackage` that contains the obfuscated launcher and the obfuscated client jar.
There is no key, account or checkout.

The MSI is 61 MB and must stay under GitHub's 100 MB per-file limit. If a future
build grows past that, publish it as a GitHub Release and point the download
button at the release asset instead of committing the file.

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
