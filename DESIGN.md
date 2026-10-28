# Vectis website — design & implementation notes

Vectis is presented as a software and AI studio within **Forza Inc.** The visual and content direction takes cues from the editorial, cinematic rhythm of [forzainc.tech](https://forzainc.tech/) without reusing its logo, copy, or imagery. Existing Vectis product routes and names remain intact.

## Design system

- Warm editorial surfaces: `--canvas` `#f2efe9`, warm raised/deep surfaces, near-black type, readable muted text, and restrained blue accents. Navy remains for high-contrast hero, navigation, and footer regions.
- Shared CSS variables live in `src/app/globals.css`; Tailwind maps the semantic tokens in `tailwind.config.ts`.
- Fonts are self-hosted: Inter Variable, Instrument Serif, IBM Plex Mono, and Outfit.
- Motion easing is `cubic-bezier(0.22, 1, 0.36, 1)`. Shared reveal/stagger/hover timing tokens are in the CSS root. Motion is limited to opacity and transform in the new reveals; reduced-motion users get static content and no autoplay.
- Components are mobile-first, use semantic links/buttons and visible focus states, and share the global skip link and navigation/footer.

## Home page sections

1. Cinematic image hero with intentional two-line heading, priority-loaded first image, image slideshow controls, pause control, and a `#products` CTA.
2. Light editorial statement describing Vectis' custom software, web app, and practical AI work.
3. Four-stage discovery/design/build/improve story with responsive imagery and a sticky desktop image panel.
4. Three existing Vectis products with live/development badges and real detail routes.
5. Four principles and a five-step delivery loop.
6. Closing contact CTA and shared footer, including the Forza Inc. parent-company link.

## Shared components and data

- `src/components/Container.tsx`, `SectionLabel.tsx`, `Button.tsx`, `SiteImage.tsx`, `StatusBadge.tsx` — reusable layout, labels, links, `next/image` blur/ratio wrapper, and product status badge.
- `src/components/home/Reveal.tsx` — reduced-motion-aware reveal and image observer.
- `src/data/site-navigation.ts` — typed navigation shared by the header and footer, and the verified Forza parent link.
- `src/data/home.ts` and `src/data/vectis.ts` — hero/story media, product, story, principle, and process content.
- `src/components/VectisHeader.tsx` and `VectisFooter.tsx` — desktop dropdown, focus-managed mobile menu, consistent footer, contact CTA, and parent identity.

## Routes and technical systems

- Existing product pages: `/distributionlife`, `/nano`, `/studio`.
- Editorial pages: `/clients`, `/journal`, `/about`, `/privacy`, `/terms`, `/contact`.
- SEO: App Router metadata, Organization/WebSite structured data with `parentOrganization: Forza Inc.`, static `/opengraph-image.png`, `/icon.svg`, `robots.txt`, and `sitemap.xml`.
- Contact form: `/api/contact` validates and bounds input, quietly rejects honeypot submissions, and sends mail through Resend server-side. It does not return a false success when email credentials are missing.

## Contact delivery setup

Follow `CONTACT_SETUP.md`. Add `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, and optionally `CONTACT_TO_EMAIL` to local/deployment **server environment variables**. `.env.example` documents the names; do not commit secrets. WhatsApp and social links are intentionally omitted until Vectis supplies real contact details/URLs.

## Verification

```sh
npm ci --no-audit --no-fund
npm run build
npm run test:palette
node test_vectis_pages.js
```

The route suite checks the marketing/product pages, SEO endpoints, contact validation, spam handling, skip link, and behavior when email delivery is not configured.
