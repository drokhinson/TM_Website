# TM_Website

Biotech Consulting: a single static page with no build step, no backend and no framework.

| File | What it holds |
|---|---|
| `index.html` | All content: hero, About Us, Partners, Contact Us, and the phone menu sheet |
| `styles.css` | Light and dark tokens on `:root`, and all layout |
| `js/theme.js` | Light/dark toggle (stored under `localStorage "bc.theme"`) |
| `js/lattice.js` | The drifting lattice behind the hero |
| `js/menu.js` | The phone menu (bottom sheet) |
| `js/section-nav.js` | Highlights the current section in the header and menu |
| `assets/brand/bc-logo.svg` | Logo and favicon |

`about.html` forwards to `#about` so old links keep working.

All paths are relative, so the site works at a domain root or under a subpath
such as `davidrokhinson.com/mom/`. `?v=__BUILD__` on the CSS and JS links is
replaced by a commit hash when deployed from the DPR_Website repo.

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```
