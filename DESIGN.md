# Premium redesign — design direction & code map

> **Scope note.** This workspace is `Vectics-Inc`, the Vectis-branded twin of
> Forza Inc.'s site (same routes `/`, `/distributionlife`, `/nano`, `/studio`,
> `/clients`, `/journal`, `/about`, …). Every piece of copy that already existed
> in this repo is preserved **verbatim**. The brief's own structural labels
> (`See products`, `A focused portfolio of software products.`, `Built with
> purpose.`, `From problem to product.`, `The loop`, `Explore / Products /
> Resources / Connect`) are layered in as additional headings/links. No route,
> link, API route or contact-modal behaviour was removed. If you want the exact
> Forza wordmark/product names on this codebase, swap the strings in
> `src/data/vectis.ts` and `src/components/Vectis{Header,Footer}.tsx` — the
> design system does not depend on them.

---

## 1. Design direction (before the code)

**Concept: professional navy and slate.** The navigation, hero and footer use
navy, while the content alternates white and cool gray surfaces with dark slate
text. Restrained steel-blue accents replace the former bronze. The homepage's
existing `brass` token names remain as compatibility aliases for those blues.

### Palette (CSS variables, WCAG AA checked)

| Token | Hex | Role | Contrast |
| --- | --- | --- | --- |
| `--ink-deep` | `#0b1d2d` | deepest navy background | — |
| `--ink-soft` | `#10263a` | navigation and global background | — |
| `--ink-card` | `#1c364d` | raised navy surface | — |
| `--ink` | `#122b42` | secondary dark neutral | — |
| `--paper` | `#f8fafc` | primary text on dark | 14.75:1 on ink-soft |
| `--paper-muted` | `#e4edf4` | secondary light text | — |
| `--paper-dim` | `#c7d5e1` | subtle light text / hairlines | — |
| `--muted` | `#b6c6d2` | body copy on dark | 8.82:1 on ink-soft |
| `--muted-dark` | `#9fb2c1` | labels on dark | 7.83:1 on ink-deep |
| `--muted-deep` | `#8fa3b3` | faint labels on dark | — |
| `--canvas` | `#f3f6f9` | light gray section background | — |
| `--canvas-raised` | `#ffffff` | white card surface | — |
| `--canvas-deep` | `#eaf0f5` | light surface / image fallback | — |
| `--char` | `#172d43` | primary text on light | 14.07:1 on white |
| `--char-soft` | `#4b6175` | secondary text on light | 5.93:1 on canvas |
| `--char-faint` | `#5c7184` | labels on light | 4.66:1 on canvas |
| `--brass` | `#709db8` | steel-blue accent for borders and rails | — |
| `--brass-light` | `#a9cfe2` | accent on dark backgrounds | 10.35:1 on ink-deep |
| `--brass-deep` | `#285f85` | blue accent on light backgrounds | 6.32:1 on canvas |
| `--live` | `#5cc2a2` | muted green status indicator | — |
| `--accent-red` | `#b8444d` | validation errors | 5.29:1 on white |
| `--accent-blue` | `#78a9ca` | secondary blue states | — |

The semantic Tailwind aliases `surface`, `content` and `brand` use the same
variables on inner pages and the contact form. Run `npm run test:palette` to
check the primary text/surface combinations and alias consistency.

**Status badges.** `Live` = soft green tinted pill + slow pulsing ring;
`In development` = quiet outlined pill with a hollow dot. Light/dark variants
are provided (`status-live`, `status-live-light`, `status-dev`, `status-dev-light`).

### Typography

| Role | Family | Source | Treatment |
| --- | --- | --- | --- |
| Display | **Instrument Serif** (regular + italic) | `@fontsource/instrument-serif` | Large, tight `-0.03em`, italic blue emphasis |
| Body | **Inter Variable** | `@fontsource-variable/inter` | 400–700, generous line-height |
| Labels / `//` eyebrows | **IBM Plex Mono** | `@fontsource/ibm-plex-mono` | Uppercase, `0.14–0.22em` tracking |
| Wordmark | **Outfit** | `@fontsource/outfit` | 700/800, wide `0.18em` tracking |

All fonts are **self-hosted** — no external requests, no FOUT from a blocked
Google Fonts CDN, and the build is network-independent.

### Motion style

Quiet, cinematic, editorial. Easing `cubic-bezier(.22,1,.36,1)`; slow
crossfades (Embla `duration: 48`), 5.6s slides with a 7.4s Ken Burns push,
word-mask headline reveals replayed on every slide change, and scroll-linked
storytelling that shifts the palette between cool navy tones. Only
`transform`, `opacity` and one `clip-path` mask are animated; `prefers-reduced-motion`
disables autoplay, Ken Burns, scroll-linked tone shifts, magnetic pull and all
reveals. `useReducedMotion` + a global `@media` block + a `<noscript>` fallback
cover every path.

### Section rhythm

| # | Section | Tone | Key motion |
| --- | --- | --- | --- |
| 01 | Hero slideshow | deep ink | 5-slide crossfade, word reveal, progress bars |
| 02 | Why we exist | cool gray | staggered fade-up, gradient mesh, route lines |
| 03 | The day | dark → night | sticky image swap, navy tone shift, drawn rail |
| 04 | Products | cool gray | mask-revealed images, gradient border glow, lift |
| 05 | Principles | ink | cursor spotlight, fill sweep |
| 06 | The loop | deep ink | scroll-drawn progress line, sequential step highlighting |
| 07 | Contact CTA + footer | deep ink | magnetic shine buttons, animated underlines |

---

## 2. Design tokens — complete source

### `src/app/globals.css` → `:root` (verbatim token block)

```css
:root {
  /* Navy backgrounds and light text */
  --ink-rgb: 18 43 66;             /* #122b42 */
  --ink-soft-rgb: 16 38 58;        /* #10263a */
  --ink-card-rgb: 28 54 77;        /* #1c364d */
  --ink-deep-rgb: 11 29 45;        /* #0b1d2d */
  --paper-rgb: 248 250 252;        /* #f8fafc */
  --paper-muted-rgb: 228 237 244;  /* #e4edf4 */
  --paper-dim-rgb: 199 213 225;    /* #c7d5e1 */
  --muted-rgb: 182 198 210;        /* #b6c6d2 */
  --muted-dark-rgb: 159 178 193;   /* #9fb2c1 */
  --muted-deep-rgb: 143 163 179;   /* #8fa3b3 */

  /* White/slate surfaces and dark text */
  --canvas-rgb: 243 246 249;        /* #f3f6f9 */
  --canvas-raised-rgb: 255 255 255;  /* #ffffff */
  --canvas-deep-rgb: 234 240 245;   /* #eaf0f5 */
  --surface-border-rgb: 214 224 232; /* #d6e0e8 */
  --char-rgb: 23 45 67;             /* #172d43 */
  --char-soft-rgb: 75 97 117;       /* #4b6175 */
  --char-faint-rgb: 92 113 132;     /* #5c7184 */

  /* Restrained blue accents + status */
  --brass-rgb: 112 157 184;         /* #709db8 */
  --brass-light-rgb: 169 207 226;   /* #a9cfe2 */
  --brass-deep-rgb: 40 95 133;      /* #285f85 */
  --brand-deep-rgb: 27 73 107;      /* #1b496b */
  --brand-muted-rgb: 131 170 191;    /* #83aabf */
  --live-rgb: 92 194 162;           /* #5cc2a2 */
  --accent-red-rgb: 184 68 77;       /* #b8444d */
  --accent-blue-rgb: 120 169 202;   /* #78a9ca */

  /* Semantic aliases used by component CSS */
  --bg: rgb(var(--ink-soft-rgb));
  --fg: rgb(var(--paper-rgb));
  --line: rgb(var(--paper-rgb) / 0.12);
  --line-light: rgb(var(--char-rgb) / 0.14);
  --accent: rgb(var(--brass-rgb));
  --accent-strong: rgb(var(--brass-light-rgb));

  /* Typography */
  --font-display: "Instrument Serif", "Newsreader", Georgia, serif;
  --font-body: "Inter Variable", "Inter", system-ui, -apple-system, sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, monospace;
  --font-logo: "Outfit", sans-serif;

  /* Geometry + depth */
  --radius-card: 18px;
  --radius-panel: 28px;
  --shell: 1280px;
  --header-h: 76px;
  --shadow-soft: 0 18px 48px -26px rgb(0 0 0 / 0.6);
  --shadow-lift: 0 34px 72px -30px rgb(0 0 0 / 0.7);
  --shadow-glow: 0 0 0 1px rgb(var(--brass-rgb) / 0.22), 0 28px 70px -34px rgb(var(--brass-rgb) / 0.36);
  --ease-expo: cubic-bezier(0.22, 1, 0.36, 1);
  --slide-duration: 5600ms;
}
```

The rest of `globals.css` supplies the reusable component layer: `.eyebrow`,
`.link-underline`, `.btn` + `.btn-primary` / `.btn-outline` / `.btn-dark`
(fill-slide + shine sweep), `.glass-nav`, `.grain-layer`, `.route-grid`,
`.mesh-blob`, `.embla*` slideshow CSS, `.hero-kenburns-inner`, `.hero-progress-fill`,
`.gradient-border`, `.spotlight-card`, `.status-badge` variants, `.clip-reveal`,
`.section-index`, legacy `.reveal` support, `.page-enter`, custom scrollbar,
focus-visible outlines and the reduced-motion overrides.

### `tailwind.config.ts` → token mapping (selected blocks)

```ts
colors: {
  paper:  { DEFAULT: "rgb(var(--paper-rgb) / <alpha-value>)",
            muted:   "rgb(var(--paper-muted-rgb) / <alpha-value>)",
            dim:     "rgb(var(--paper-dim-rgb) / <alpha-value>)" },
  ink:    { DEFAULT: "rgb(var(--ink-rgb) / <alpha-value>)",
            soft:    "rgb(var(--ink-soft-rgb) / <alpha-value>)",
            card:    "rgb(var(--ink-card-rgb) / <alpha-value>)",
            deep:    "rgb(var(--ink-deep-rgb) / <alpha-value>)" },
  muted:  { DEFAULT: "rgb(var(--muted-rgb) / <alpha-value>)",
            dark:    "rgb(var(--muted-dark-rgb) / <alpha-value>)",
            deep:    "rgb(var(--muted-deep-rgb) / <alpha-value>)" },
  canvas: { DEFAULT: "rgb(var(--canvas-rgb) / <alpha-value>)",
            raised:  "rgb(var(--canvas-raised-rgb) / <alpha-value>)",
            deep:    "rgb(var(--canvas-deep-rgb) / <alpha-value>)" },
  char:   { DEFAULT: "rgb(var(--char-rgb) / <alpha-value>)",
            soft:    "rgb(var(--char-soft-rgb) / <alpha-value>)",
            faint:   "rgb(var(--char-faint-rgb) / <alpha-value>)" },
  brass:  { DEFAULT: "rgb(var(--brass-rgb) / <alpha-value>)",
            light:   "rgb(var(--brass-light-rgb) / <alpha-value>)",
            deep:    "rgb(var(--brass-deep-rgb) / <alpha-value>)" },
  live:   "rgb(var(--live-rgb) / <alpha-value>)",
  accent: { red: "rgb(var(--accent-red-rgb) / <alpha-value>)",
            blue: "rgb(var(--accent-blue-rgb) / <alpha-value>)",
            amber: "rgb(var(--brass-light-rgb) / <alpha-value>)" },
},
fontFamily: {
  sans:  ["var(--font-body)", "Inter", "system-ui", "-apple-system", "sans-serif"],
  serif: ["var(--font-display)", "Instrument Serif", "Newsreader", "Georgia", "serif"],
  mono:  ["var(--font-mono)", "IBM Plex Mono", "ui-monospace", "monospace"],
  logo:  ["var(--font-logo)", "Outfit", "sans-serif"],
},
borderRadius: { card: "var(--radius-card)", panel: "var(--radius-panel)" },
boxShadow:    { soft: "var(--shadow-soft)", lift: "var(--shadow-lift)", glow: "var(--shadow-glow)" },
maxWidth:     { shell: "var(--shell)" },
transitionTimingFunction: { expo: "cubic-bezier(0.22, 1, 0.36, 1)" },
```

The `surface`, `content`, and `brand` aliases in the config map to the same RGB variables.

`keyframes`/`animation` additions: `progress`, `pulse-ring`, `spin-slow`,
`mesh-drift`, `float-y`, `scroll-cue`, `shine-sweep` (plus the original
`reveal-in`, `hero-kenburns`, `hero-enter`, `nano-draw` for legacy pages).

---

## 3. Complete updated code — file by file

Full source lives in these files; below is the role of each one.

### Configuration / global

| File | What changed |
| --- | --- |
| `package.json` | Added `framer-motion`, `embla-carousel-react`, `embla-carousel-autoplay`, `embla-carousel-fade`, four `@fontsource*` packages, `sharp`; bumped Next to `14.2.35`, postcss to `8.5.32` and added a `postcss` override. |
| `package-lock.json` | Regenerated. |
| `tailwind.config.ts` | Full token layer above; new radii, shadows, easings, keyframes; legacy colour aliases retained so all other routes keep working. |
| `next.config.mjs` | AVIF/WebP image formats, tuned `deviceSizes`/`imageSizes`, `poweredByHeader: false`, `optimizeFonts: false` (fonts are self-hosted now). |
| `src/app/globals.css` | Complete design system: tokens, base, component classes, slideshow CSS, hover effects, reduced motion, no-JS-friendly page fade. |
| `src/app/layout.tsx` | Self-hosted font CSS imports; removed Google Fonts `<link>`; `themeColor: #10263a`; `<PageTransition>` wrapper; `<noscript>` reveal fallback; kept skip link, JSON-LD, `ScrollObserver`, header, footer, contact modal. |
| `src/app/page.tsx` | New composition: `HeroSlideshow → StatementSection → DayNarrative → ProductsSection → PrinciplesSection → ProcessSteps`. Server component; all copy preserved. |
| `src/app/distributionlife/page.tsx` | Added `id="features"` for the dropdown anchor only. Copy untouched. |
| `src/app/contact/page.tsx` | Added `id="faq"` for the dropdown anchor only. Copy untouched. |

### Shared chrome

| File | What it does |
| --- | --- |
| `src/components/VectisHeader.tsx` | Sticky glass header; hides on scroll down / shows on scroll up; animated underlines; Products/Clients/Journal/Approach/About + Contact + the **DistributionLife dropdown** (Overview, Features, Pricing, Download, Contact sales / Resources: User Guide, FAQ, Web app login) with a smooth 3-column mega panel; refined mobile drawer (rendered outside the transformed header so `position: fixed` is viewport-relative), staggered links, Escape/outside-click close, scroll lock. |
| `src/components/VectisFooter.tsx` | Closing CTA "Let's build what's next." with magnetic shine buttons; footer columns **Explore / Products / Resources / Connect** + Follow us social icons; animated underlines; back-to-top; all original links preserved. |
| `src/components/PageTransition.tsx` | CSS-keyframe route/page fade keyed by `usePathname()` — SSR-safe (no hidden pre-hydration content). |
| `src/data/home.ts` | 5 hero slides, 4 day-stage images (with dawn→dusk tints), 3 product images, per-image base64 blur placeholders, and the dropdown link data. |
| `src/components/ScrollObserver.tsx` | Unchanged — still powers `.reveal` on legacy pages. |

### Home components (`src/components/home/`)

| File | What it does |
| --- | --- |
| `HeroSlideshow.tsx` | Full-viewport Embla (Fade + Autoplay) slideshow: 5 slides, 5.6s autoplay, pause on hover/focus/tab-hidden, manual pause, arrow buttons + ←/→/Home/End keys, progress-bar tabs with `01 / 05` counter and live labels, Ken Burns on the active slide, dual dark gradient + grain + route grid, word-by-word line-mask headline replayed on each slide change, staggered lede/CTA, scroll cue. |
| `Reveal.tsx` | `Reveal` (transform/opacity fade-up via `whileInView`) and `RevealImage` (editorial clip-mask). The mask observes an **unclipped wrapper** so IntersectionObserver can actually fire. |
| `MagneticLink.tsx` | Pointer-following magnetic CTA; disabled for touch / reduced motion; no React re-renders on mouse move. |
| `Atmosphere.tsx` | Decorative gradient mesh + fine grain + faint grid/route-line SVG, transform-only drift. |
| `StatusBadge.tsx` | Distinct Live (pulsing green) / In development (outlined) badges, light + dark variants. |
| `StatementSection.tsx` | Light "Why we exist" section, editorial two-column copy, `//` eyebrow, route-line atmosphere. |
| `DayNarrative.tsx` | Dark sticky scroll story: image swaps through the four stages, section background drifts `#12171C → #070A0D` via `useScroll`/`useTransform`, drawn progress rail, sequential stage highlighting, mobile inline image reveals. |
| `ProductsSection.tsx` | Light products section header + 3-card grid. |
| `ProductCard.tsx` | `next/image` photo, mask reveal, gradient border glow, lift + soft shadow, image zoom, hover caption reveal, sliding "Explore" arrow, status badge. |
| `PrinciplesSection.tsx` | Four principle cards with cursor-tracking spotlight, bottom-up fill sweep and hover underline. |
| `ProcessSteps.tsx` | Five-step loop with a scroll-drawn horizontal/vertical rail and sequential number highlighting. |

---

## 4. Requirement → implementation map

- **Premium palette / tokens / AA contrast** → §1–2 above; every colour is an RGB CSS variable consumed by Tailwind's `<alpha-value>` so opacity modifiers still work.
- **Alternating light/dark rhythm** → hero (dark) → statement (light) → day (dark) → products (light) → principles/process/footer (dark).
- **Hero slideshow** → `HeroSlideshow.tsx`: 5 slides, crossfade, Ken Burns, 5.6s autoplay, pause on hover, arrows, progress bars + `01 / 05`, gradient overlay, word-mask headline replay, staggered subtext/CTA, scroll cue, keyboard support.
- **Scroll reveals + image masks** → `Reveal`, `RevealImage`, staggered delays in every section.
- **The day scroll story** → sticky panel, image swap, navy tone shift, drawn rail.
- **From problem to product** → `ProcessSteps` scroll-drawn rail + sequential highlighting.
- **Navbar** → glass on scroll, hide/show on direction, animated underlines, smooth dropdown, mobile drawer.
- **Route transitions** → `PageTransition`.
- **Hover effects** → product card lift/zoom/gradient glow/arrow, principle spotlight, button shine + magnetic pull, image caption reveal.
- **Background atmosphere** → `Atmosphere` (gradient mesh, grain SVG, grid/route lines).
- **Typography / polish / responsive / a11y** → self-hosted fonts, mono `//` eyebrows, generous whitespace, consistent radii/shadows, `next/image` blur placeholders + `sizes` + AVIF/WebP, semantic landmarks, focus-visible rings, `aria-expanded`/`aria-selected`/`aria-live` on the slideshow, `prefers-reduced-motion` everywhere.

---

## 5. Assets you need to supply (or replace)

Everything needed to run is **already included** in `public/images/`. The
current files are AI-generated editorial placeholders with a consistent warm
muted, cool-toned grade — swap them 1:1 with your own licensed photography.

| Path | Used for | Ideal spec |
| --- | --- | --- |
| `public/images/home/slide-opening.jpg` | Hero 01 + The day / Opening | 16:9, ≥1920×1080 |
| `public/images/home/slide-route.jpg` | Hero 02 + The day / Route | 16:9, ≥1920×1080 |
| `public/images/home/slide-collection.jpg` | Hero 03 + The day / Collection | 16:9, ≥1920×1080 |
| `public/images/home/slide-close.jpg` | Hero 04 + The day / Close | 16:9, ≥1920×1080 |
| `public/images/home/slide-city.jpg` | Hero 05 | 16:9, ≥1920×1080 |
| `public/images/home/product-distributionlife.jpg` | Product card 01 + dropdown thumbnail | 4:3, ≥1200×900 |
| `public/images/home/product-nano.jpg` | Product card 02 | 4:3, ≥1200×900 |
| `public/images/home/product-studio.jpg` | Product card 03 | 4:3, ≥1200×900 |
| `public/images/noise.svg` | Fine film grain | supplied |
| `public/images/route-lines.svg` | Logistics route motif | supplied |

If you replace a file, also refresh its `blurDataURL` in `src/data/home.ts`
(a 20px-wide base64 JPEG is generated with:
`convert IMG -resize 20x12! -strip -quality 42 jpg:- | base64 -w0`).

**Fonts:** none to supply — Instrument Serif, Inter, IBM Plex Mono and Outfit
are bundled via `@fontsource*`.

**Still to configure before launch:**
1. Social profile URLs in `VectisFooter.tsx` (`socialLinks` currently point at
   the platform homepages as placeholders).
2. Dropdown targets in `src/data/home.ts` — `Download` and `Web app login`
   point at the original `distributionlife.app` product endpoints; `Pricing`
   and `Contact sales` point at `/contact`. Repoint them if you add dedicated
   routes. The item labels/grouping match the brief exactly.
3. Brand strings if you want the Forza wordmark rather than Vectis (see the
   scope note at the top).

---

## 6. Dependencies to install

Already installed and saved; on a fresh clone run `npm install` (or `npm ci`).

```bash
npm install framer-motion@^11.18.2 \
            embla-carousel-react@^8.6.0 \
            embla-carousel-autoplay@^8.6.0 \
            embla-carousel-fade@^8.6.0 \
            @fontsource-variable/inter@^5.3.0 \
            @fontsource/instrument-serif@^5.3.0 \
            @fontsource/ibm-plex-mono@^5.3.0 \
            @fontsource/outfit@^5.3.0 \
            sharp@^0.35.5
```

Also upgraded: `next@14.2.35`, `postcss@8.5.32` (plus an `overrides.postcss`
entry so Next's pinned copy dedupes to the patched version). No Swiper/GSAP is
needed — Framer Motion handles scroll-linked motion and the Embla Fade plugin
handles the crossfade, so the bundle stays lean.

---

## 7. Verification performed

- `npm run build` → **0 errors**, 52 static/SSG/dynamic routes generated.
- Home First Load JS ≈ **165 kB** (87.3 kB shared baseline + hero/sections).
- All sampled routes return HTTP 200 (`/`, `/distributionlife`, `/nano`,
  `/studio`, `/about`, `/clients`, `/journal`, `/contact`, `/privacy`, `/terms`,
  `/resources/vendor-matrix`).
- `next/image` serves **AVIF** for modern browsers (e.g. 1920px hero ≈ 72 KB).
- Headless Chromium checks at 1440×900, 390×844 and reduced-motion:
  **0 console/page errors**; self-hosted fonts resolved; hero fits 100svh with
  controls visible; arrow buttons + ←/→ keys change slides; pause control works;
  dropdown opens on hover and closes on scroll; product card lifts −8px and
  reveals its caption; mobile drawer is full-height and opaque; reduced-motion
  shows static content with no autoplay.
- `prefers-reduced-motion` verified via `useReducedMotion` and CSS queries.

**Known follow-up:** `npm audit` still reports one `critical` advisory against
Next 14 that is only fixed by a Next 16 major upgrade. That upgrade was left out
of this visual-design task; schedule it separately.
