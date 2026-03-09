# Portfolio v2 — Implementation Plan

## 1. Recommended Tech Stack

| Layer | Tool | Rationale |
|---|---|---|
| Markup | **HTML5** | Semantic, no build step, universally supported |
| Styling | **Vanilla CSS** | Custom properties, Flexbox/Grid, `@media` queries — no dependencies |
| Interactivity | **Vanilla JS (ES6+)** | `IntersectionObserver` for scroll animations, mobile nav toggle |
| Icons | **SVG inline icons** | Zero dependency, fully styleable with CSS |
| Deployment | **Vercel** (or Netlify / GitHub Pages) | Drag-and-drop or Git-connected static hosting |

> **Why vanilla?** A portfolio is a simple, static site. There is nothing here that requires a framework or build tool. Plain HTML/CSS produces the fastest possible output, has no dependency maintenance burden, and is trivially easy to deploy anywhere.

---

## 2. File Structure

```
portfolio-v2/
├── assets/
│   ├── favicon.svg
│   ├── og-image.png           # Open Graph social preview
│   └── projects/              # Project screenshot images
│       ├── project-1.webp
│       ├── project-2.webp
│       ├── project-3.webp
│       └── project-4.webp
│
├── styles/
│   ├── reset.css              # Minimal CSS reset
│   ├── variables.css          # CSS custom properties (colors, spacing, fonts)
│   ├── base.css               # Typography, global element styles
│   ├── layout.css             # Header, footer, section containers
│   ├── hero.css               # Hero section styles
│   ├── projects.css           # Projects grid + cards
│   ├── about.css              # About section styles
│   ├── contact.css            # Contact / social links styles
│   └── animations.css         # Scroll-reveal keyframes + utility classes
│
├── scripts/
│   └── main.js                # Mobile nav toggle + IntersectionObserver scroll reveals
│
├── index.html                 # Single page — all sections live here
└── plan.md
```

---

## 3. Design Considerations

### Visual Style
- **Dark-first palette** — deep navy/slate backgrounds (`#0a0f1e`, `#111827`) with off-white text. Feels premium and modern for a developer portfolio.
- **Accent color** — a single vibrant highlight (e.g. electric indigo `#6366f1` or cyan `#06b6d4`) used sparingly on CTAs, links, and hover states to create focus.
- **Typography** — `Inter` or `Geist` (system-like, clean) for body; `Clash Display` or `Cal Sans` for headings to add personality.

### Layout
- **Full-width, single-page** design with anchor-linked sections. No page routing needed.
- Each section takes at least `100vh` on desktop to allow generous breathing room.
- **Maximum content width** of `1200px` centered, with `5–8%` horizontal padding on mobile.

### Responsiveness
- Mobile-first CSS with `@media` queries at `768px` and `1024px` breakpoints.
- Projects grid: 1 column on mobile → 2 on tablet → 2×2 or 4-wide on desktop using CSS Grid.
- Hamburger nav on mobile, inline nav on desktop.

### Animations
- **Scroll-triggered fade-up** on each section using the native `IntersectionObserver` API in `main.js` — no library needed.
- **Staggered card reveals** in the Projects section via CSS `animation-delay` on each card.
- **Subtle hover effects** on project cards (slight lift + border glow) using CSS `transform` and `transition`.
- No auto-play or looping animations — respect `prefers-reduced-motion` with a `@media` query.

### Accessibility
- Semantic HTML (`<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`).
- `aria-label` on icon-only links (Twitter, LinkedIn).
- Skip-to-content link for keyboard users.
- WCAG AA contrast ratios on all text.

### SEO & Performance
- `<meta>` title, description, and Open Graph tags in the `<head>` of `index.html`.
- Images served as `.webp` with explicit `width` and `height` attributes to prevent layout shift.
- Target: Lighthouse 100/100 across all categories.

---

## 4. Step-by-Step Implementation Plan

### Phase 1 — Project Bootstrap
1. Create the folder structure manually: `assets/projects/`, `styles/`, `scripts/`.
2. Create `index.html` with the HTML5 boilerplate — `<html lang="en">`, `<meta charset>`, viewport tag, Google Fonts `<link>`, and `<link>` tags for all CSS files.
3. Create `styles/variables.css` — define all CSS custom properties (colors, spacing scale, font families, border radii).
4. Create `styles/reset.css` using a minimal modern reset (box-sizing, margin/padding zero, `img` block display).
5. Create `styles/base.css` — global typography, `scroll-behavior: smooth` on `html`, and `prefers-reduced-motion` override.

### Phase 2 — Layout & Navigation
6. Write the `<header>` in `index.html` — logo/name on the left, anchor links (`#projects`, `#about`, `#contact`) on the right.
7. Style it in `styles/layout.css` — sticky positioning, backdrop blur, and transition on scroll (add `.scrolled` class via JS).
8. Add a hamburger button for mobile; wire up the toggle in `scripts/main.js`.
9. Write the `<footer>` — copyright line and a "Back to top" link.

### Phase 3 — Hero Section
10. Write the `<section id="hero">` in `index.html` — `<h1>` with your name, a `<p>` tagline, and a `<a>` CTA button pointing to `#projects`.
11. Style in `styles/hero.css` — full-height (`min-height: 100vh`), centered flex layout, large fluid heading using `clamp()`.
12. Add a subtle CSS animated gradient or radial glow as the background.

### Phase 4 — Projects Section
13. Write the `<section id="projects">` in `index.html` — a `<div class="projects-grid">` containing 4 project cards, each with an image, title, description, tech tags, and links.
14. Style the grid in `styles/projects.css` using CSS Grid with `auto-fit` and `minmax()` for responsive columns.
15. Style individual cards with a hover lift (`transform: translateY`) and border glow (`box-shadow`) transition.
16. Add `data-reveal` attributes to each card; `styles/animations.css` provides the initial hidden state and revealed state classes.

### Phase 5 — About Section
17. Write `<section id="about">` — two-column layout with a photo (`<img>`) and a bio `<div>` containing a paragraph and a list of skill tags.
18. Style in `styles/about.css` — CSS Grid two-column on desktop, single column on mobile.

### Phase 6 — Contact Section
19. Write `<section id="contact">` — centered layout with a heading, a short sentence, and two `<a>` buttons for Twitter and LinkedIn with inline SVG icons.
20. Style in `styles/contact.css` — large, pill-shaped link buttons with icon + label, hover color transitions.

### Phase 7 — Scroll Animations & Polish
21. In `scripts/main.js`, create an `IntersectionObserver` that adds a `.revealed` class to any element with `data-reveal` when it enters the viewport.
22. In `styles/animations.css`, define the `fade-up` keyframe and the `.revealed` class transition. Add `animation-delay` CSS variables to stagger the project cards.
23. Audit all sections for consistent spacing, color usage, and typography scale.
24. Test responsiveness at 375px, 768px, 1024px, and 1440px.

### Phase 8 — Accessibility & SEO Audit
25. Run Lighthouse and fix any issues.
26. Verify all images have meaningful `alt` text.
27. Test full keyboard navigation and focus styles.
28. Add a `robots.txt` file. Create a simple `sitemap.xml` manually (single URL entry).

### Phase 9 — Deployment
29. Push the folder to a GitHub repository.
30. Connect to Vercel — import the repo, set framework to "Other" (plain static), no build command needed, publish directory is root.
31. Configure custom domain in Vercel dashboard.
32. Verify live deployment with a final Lighthouse run.

---

## Quick Reference

No build tool or package manager needed. To work locally:

```bash
# Option A — Python built-in server (no install required)
python3 -m http.server 3000

# Option B — Node http-server
npx http-server . -p 3000

# Option C — VS Code Live Server extension
# Right-click index.html → "Open with Live Server"
```

To deploy, simply push the folder to GitHub and connect the repo to Vercel, Netlify, or GitHub Pages. No build command required — publish directory is the project root.
