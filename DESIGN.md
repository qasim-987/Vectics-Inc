# Vectis website — design & implementation notes

Vectis is a calm, mature B2B operations-software company within **Forza Inc.** Existing product names, routes, and copy remain in place; the visual system is shared across the app shell and route pages.

## Design system

- Approved palette only: `--bg: #FAFAF7`, `--surface: #FFFFFF`, `--border: #E4E4DE`, `--text: #0F1B2D`, `--text-muted: #5B6675`, `--accent: #1D4ED8`, `--accent-hover: #1E40AF`, `--dark: #0B1524`, `--dark-text: #E5E7EB`. Opacity variants use derived RGB channels of those exact tokens.
- CSS variables live in `src/app/globals.css`; Tailwind maps semantic and legacy utility names to the approved tokens in `tailwind.config.ts`.
- Typography uses self-hosted Inter for UI/body and Instrument Serif for headings. Headings are non-italic, and technical/legacy mono utilities resolve to Inter.
- Shared layout tokens: 1200px content shell, 72px solid sticky navigation, 48px buttons with 8px corners, and 12px card corners. Shadows remain subtle and section backgrounds stay neutral; dark surfaces are reserved for the shared contact CTA/footer.
- Reveals use a 300ms fade/short rise and honor `prefers-reduced-motion`. Decorative gradients, glow, glass effects, magnetic movement, and status-dot badges are removed.
- Components remain responsive, semantic, keyboard operable, and include visible focus states, a skip link, reduced-motion support, and image alt text.

## Home page sections

1. Contained two-column hero with the existing headline/copy and only the existing primary/secondary CTAs; the pill label and third text link are removed.
2. Editorial statement describing Vectis' custom software, web app, and practical AI work.
3. Four-stage discovery/design/build/improve story with responsive imagery and a sticky desktop image panel.
4. Three existing Vectis products with text-only status labels and real detail routes.
5. Four principles and a five-step delivery loop.
6. Shared dark contact CTA/footer, including the Forza Inc. parent-company link.

## Shared components and data

- `src/app/globals.css` and `tailwind.config.ts` — centralized palette, typography, spacing/layout, radius, shadow, and motion foundations.
- `src/components/Container.tsx`, `Button.tsx`, `SectionLabel.tsx`, `SiteImage.tsx`, and `home/StatusBadge.tsx` — shared layout, controls, labels, image handling, and text-only product status.
- `src/components/home/Reveal.tsx` — reduced-motion-aware 300ms reveal and image observer.
- `src/data/site-navigation.ts` — typed navigation shared by the header/footer, plus the verified Forza parent link.
- `src/data/home.ts` and `src/data/vectis.ts` — hero/story media, products, story, principles, and process content.
- `src/components/VectisHeader.tsx` and `VectisFooter.tsx` — 72px shared navigation, keyboard-accessible mobile menu, contact CTA, and footer.

## Routes and technical systems

- Product pages: `/distributionlife`, `/nano`, `/studio`.
- Editorial pages: `/clients`, `/journal`, `/about`, `/privacy`, `/terms`, `/contact`.
- Existing work, services, resources, company, blog, and demo routes are retained and use the shared app chrome.
- SEO: App Router metadata, Organization/WebSite structured data with `parentOrganization: Forza Inc.`, `/icon.svg`, `robots.txt`, and `sitemap.xml`.
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
