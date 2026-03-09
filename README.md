# Portfolio v2

Personal portfolio website built with vanilla HTML, CSS, and JavaScript — no frameworks, no build step, no dependencies.

## Sections

- **Hero** — name, tagline, and a call-to-action
- **Projects** — four project cards with descriptions, tech stacks, and links
- **About** — short bio and skills list
- **Contact** — Twitter/X and LinkedIn links

## Tech

| Layer | Tool |
|---|---|
| Markup | HTML5 (semantic elements) |
| Styling | Vanilla CSS (custom properties, Flexbox, Grid) |
| Interactivity | Vanilla JS — scroll-reveal via `IntersectionObserver`, mobile nav toggle |
| Fonts | Inter + Syne via Google Fonts |
| Deployment | Vercel / Netlify / GitHub Pages |

## Running locally

No install required. Pick any of these options:

**Python (built-in, no install needed):**
```bash
python3 -m http.server 3000
```

**Node (via npx, no install needed):**
```bash
npx http-server . -p 3000
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Project structure

```
portfolio-v2/
├── assets/
│   ├── favicon.svg
│   └── projects/          # Project screenshot images
├── styles/
│   ├── reset.css
│   ├── variables.css      # All CSS custom properties
│   ├── base.css
│   ├── layout.css         # Header + footer
│   ├── hero.css
│   ├── projects.css
│   ├── about.css
│   ├── contact.css
│   └── animations.css     # Scroll-reveal system
├── scripts/
│   └── main.js
├── index.html
└── robots.txt
```

## Customising

All content lives directly in `index.html` — update your name, bio, project details, and social URLs there. Design tokens (colours, fonts, spacing) are all in `styles/variables.css`.

## Deployment

Push to GitHub and connect the repo to Vercel, Netlify, or GitHub Pages. No build command is needed — set the publish directory to the repository root.
