# Project Context for AI Sessions

## What this project is

Personal portfolio website for Bohdan Hodzenko. Single-page, no framework, no build tool. Just HTML, CSS, and a small JS file. Deployed as a static site.

## Architecture

### Single entry point
Everything renders from `index.html`. There is no routing, no components system, and no JavaScript framework. All sections are hardcoded in the HTML.

### CSS is split by concern
Each section and layer has its own CSS file, loaded in order via `<link>` tags in `<head>`:

```
reset.css        → box-model normalisation
variables.css    → all design tokens (CSS custom properties)
base.css         → global typography, .container, shared components (.btn, .tech-badge)
animations.css   → [data-reveal] scroll-reveal system
layout.css       → header (sticky, blur-on-scroll), footer, mobile nav
hero.css         → hero section only
projects.css     → project grid and cards
about.css        → about section
contact.css      → contact section and social buttons
```

Never put styles in `index.html`. Always find the correct file above.

### JavaScript is minimal
`scripts/main.js` does exactly three things:
1. Writes the current year into `#year` in the footer
2. Toggles `.scrolled` on `<header>` when the user scrolls past 10px
3. Runs an `IntersectionObserver` that adds `.revealed` to any `[data-reveal]` element when it enters the viewport

Do not add libraries. If new interactivity is needed, extend `main.js` with vanilla JS.

### Scroll-reveal system
- Add `data-reveal` to any element that should fade-up on scroll
- The observer in `main.js` adds `.revealed` when the element hits the viewport
- Project cards use an inline CSS custom property `style="--delay: Xms"` for stagger timing
- Hero elements use `.hero-content > [data-reveal]:nth-child(n)` selectors in `animations.css`
- Always respect `prefers-reduced-motion` — the override is already in `animations.css`

### Design tokens
All values live in `styles/variables.css`. Never hardcode a colour, spacing value, or font name anywhere else. When adding new values, add them to `variables.css` first.

Key tokens:
- `--color-accent: #6366f1` — primary indigo accent, used sparingly
- `--color-accent-light: #818cf8` — lighter variant for text and hover states
- `--color-bg / --color-bg-elevated / --color-bg-card` — three levels of dark background
- `--font-body: 'Inter'` — all body text
- `--font-display: 'Syne'` — headings only
- `--max-width: 1200px` — content container cap
- `--gutter: clamp(1.25rem, 5vw, 2.5rem)` — horizontal padding on `.container`

## Code style preferences

### HTML
- Use semantic elements: `<header>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<nav>`
- Every `<section>` gets an `aria-label`
- Icon-only links always get an `aria-label`; decorative elements get `aria-hidden="true"`
- Inline SVG for icons — no icon font, no external icon library
- No inline styles except for CSS custom property values (e.g. `style="--delay: 100ms"`)

### CSS
- Mobile-first: base styles target mobile, `@media (min-width: N)` adds larger-screen overrides
- Breakpoints: `640px` (small tablet), `768px` (tablet), `1024px` (desktop)
- Use CSS custom properties from `variables.css` — never raw hex codes or px magic numbers
- Use `clamp()` for fluid typography and spacing where appropriate
- Transitions use `var(--duration)` / `var(--duration-slow)` and `var(--ease)`
- No `!important` except inside `@media (prefers-reduced-motion: reduce)`
- Use `gap` for spacing between flex/grid children; avoid margins between siblings

### JavaScript
- ES6+ syntax: `const`/`let`, arrow functions, template literals, destructuring
- No `var`
- No external libraries or CDN scripts
- Event listeners use `{ passive: true }` where applicable (e.g. scroll)
- Keep functions small and single-purpose

### General
- No comments that just describe what the code does — only explain non-obvious intent
- Prefer editing existing files over creating new ones
- Do not add a build step, package.json, or bundler

## Content locations

| Content | Where to edit |
|---|---|
| Name, tagline, bio | `index.html` |
| Project titles, descriptions, tech stacks, links | `index.html` — the four `.project-card` articles |
| Social links (Twitter, LinkedIn) | `index.html` — the two `.social-btn` anchors in `#contact` |
| Colour palette | `styles/variables.css` |
| Fonts | `index.html` Google Fonts `<link>` + `styles/variables.css` `--font-*` |
| Section spacing | `styles/variables.css` spacing scale + per-section CSS files |

## Known decisions and trade-offs

- **No real project images** — project card image areas use Unsplash URLs with a CSS gradient overlay tint. Replace with local `.webp` files in `assets/projects/` when real screenshots are ready.
- **No contact form** — contact section links to social profiles only. A form would require a backend or third-party service (e.g. Formspree); add only if needed.
- **No dark/light toggle** — the site is dark-only by design. If a toggle is added later, use `prefers-color-scheme` as the default and a `data-theme` attribute on `<html>` for the override.
- **Single HTML file** — if a blog or case studies page is added in the future, create separate `.html` files and a shared CSS/JS include pattern rather than introducing a framework.
