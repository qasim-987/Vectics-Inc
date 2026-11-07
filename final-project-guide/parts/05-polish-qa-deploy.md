# Part 14 — Styling, responsiveness and accessibility

You now have five working screens. This part makes them look like one product on a phone, a
laptop and a projector. It is worth several marks and takes an evening.

## 14.1 The division of labour

Do not fight Bootstrap. Use it for the 80% it is good at, and write CSS only for the things
it cannot know:

| Use Bootstrap for | Write your own CSS for |
| --- | --- |
| Grid, spacing (`g-4`, `py-5`), flex helpers | The hero background, the shelf scroller, the cover fallback |
| Cards, buttons, badges, forms, tabs, modal, table | Book cover aspect ratio, card hover, stat blocks |
| Responsive display (`d-none d-lg-block`) | The explore toolbar's grid, the author hero |
| Dark-mode-ready variables | Anything with a name from your design ("shelf row") |

## 14.2 The stylesheet

Add this below the theme block from Part 4. It is one file, ordered top to bottom, grouped by
feature with comments — which is what makes a 600-line stylesheet readable.

{{src/index.css}}

## 14.3 Responsiveness: the four breakpoints that matter

Do not design for "phones" — design for these widths and check them in DevTools:

| Width | Device | What must still work |
| --- | --- | --- |
| 320–375 px | iPhone SE | Navbar collapses; grid is 2 columns; toolbar stacks; no horizontal scroll |
| 768 px | iPad portrait | Grid is 3 columns; navbar expanded; book detail is 2 columns |
| 992 px | Small laptop | Reading list switches from cards to table |
| 1440 px | Projector | Container is capped by Bootstrap; text lines do not run 200 characters wide |

The techniques used, and the one-line reason for each:

```css
/* Fluid type and spacing instead of media queries for every step. */
.hero__title { font-size: clamp(2.2rem, 6vw, 4rem); }
.hero { padding: clamp(3rem, 8vw, 6rem) 0; }

/* Covers keep the 2:3 book ratio at any width, and never squash. */
.book-card__image { width: 100%; aspect-ratio: 2 / 3; object-fit: cover; }

/* A scroller that snaps and shows partial next card, which hints "scroll me". */
.shelf__row {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: clamp(110px, 22vw, 150px);
  gap: 1rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}
.shelf__item { scroll-snap-align: start; }

/* Toolbar: one column on phones, four on anything wider. */
.explore-toolbar { display: grid; grid-template-columns: 1fr; gap: 0.75rem; }
@media (min-width: 768px) {
  .explore-toolbar { grid-template-columns: minmax(0, 1fr) 12rem auto auto; }
}
```

`minmax(0, 1fr)` on the first column is the fix for the classic "search input makes the
whole page wider than the viewport" bug: `1fr` alone refuses to shrink below the input's
intrinsic width.

## 14.4 Accessibility: the checklist you can actually complete

The rubric says "at least some extent" of accessibility. These seven items are cheap and
visible; tick them off in a list in your report.

1. **One `<h1>` per screen**, headings in order (`h1` → `h2` → `h3`). The card titles are
   `h3` because each card sits under a section `h2`.
2. **Labels on every input.** A `Form.Label` (visible or `visuallyHidden`) with a matching
   `htmlFor`/`id`. Placeholders are not labels; they vanish when you type.
3. **Alt text that means something**: `alt={`Cover of ${title}`}`, and `alt=""` or
   `aria-hidden` on decorative icons and on the cover *fallback*.
4. **Visible focus.** The global `:focus-visible { outline: 3px solid …; offset 2px }` rule
   means keyboard users can see where they are on *every* element, not just Bootstrap buttons.
5. **A skip link.** Tab once on any screen: "Skip to content" appears, and Enter jumps past
   the navbar to `<main id="main">`.
6. **State announced, not just coloured.** The Save button toggles its label ("Save" →
   "Saved") and its `aria-pressed`; the toast announces "Added *Dune* to your list"; the error
   panel is `role="alert"`.
7. **Motion respect.** Every animation is disabled when the operating system asks:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}
```

## 14.5 Test with a keyboard, not a mouse

Put the mouse aside and do this on every screen. It takes five minutes and finds real bugs:

- **Tab** through Home: skip link → logo → Home → Explore → Reading list → Search → hero
  input → Search button → chips → shelf covers → cards. Focus is always visible.
- **Enter** on the navbar search button: the dialog opens, focus is in the input, **Esc** closes it.
- **Tab** inside the dialog: focus must not escape to the page behind it (native `<dialog>`
  handles this).
- On Explore, press Tab to the sort select: the arrow keys change the value.
- On Reading list, Tab to a remove button and press Enter: the row disappears and the count
  updates.

Any dead end here is a bug worth fixing rather than mentioning.

```bash
git add -A
git commit -m "style: responsive layout, cover aspect ratios, focus styles and reduced-motion support"
```

---

# Part 15 — Quality assurance before you ship

## 15.1 The manual test matrix

Run this top to bottom and write the result in a scratch file. Fix everything. This table is
also the skeleton of your report's reflection.

| # | Scenario | Expected result | Seen |
| --- | --- | --- | --- |
| 1 | `npm run dev`, open `/` | Hero, chips, 4 shelves with covers | |
| 2 | Throttle **Slow 3G**, reload Home | Skeletons, then shelves (no layout jump) | |
| 3 | **Offline**, reload Home | Error panel + working **Try again** | |
| 4 | Back online, press Try again | Shelves load, no page reload | |
| 5 | Search "dune" on Home | Lands on Explore with results and a count | |
| 6 | Change sort to "Highest rated" | URL gains `&sort=rating`, results change | |
| 7 | Press browser **Back** | Returns to the previous sort/results, not off-site | |
| 8 | Search `subject:poetry` | Poetry results; count is large | |
| 9 | Search `qzxvbnm` | Empty state with a way out | |
| 10 | Toggle "Covers only" with a mixed result | Coverless cards disappear instantly | |
| 11 | Page 2 via Pagination | New results, page indicator updates, scroll to top | |
| 12 | Open a book | Cover, description as paragraphs, rating, editions, subjects | |
| 13 | Open an obscure book with no description | Explanatory text, not a blank panel | |
| 14 | Click an author link | Author page with portrait (or initial fallback), bio, works | |
| 15 | Sort author works A–Z | Order changes; button shows pressed state | |
| 16 | Save a book anywhere | Toast appears, navbar badge increments | |
| 17 | Reload the page | Book is still saved | |
| 18 | Open a second tab, save another book | First tab's badge updates (storage event) | |
| 19 | Reading list → Export CSV | File downloads, opens correctly in a spreadsheet | |
| 20 | Reading list → Clear → Keep them | List survives | |
| 21 | Reading list → Clear → Clear list | Empty state appears | |
| 22 | Visit `/nonsense` | 404 screen with a link home | |
| 23 | Resize to 320 px on every screen | No horizontal scrollbar, everything usable | |
| 24 | Keyboard-only pass (14.5) | All controls reachable and visible | |

## 15.2 A tiny automated safety net (optional but impressive)

You do not need tests to pass this assignment. Ten tests that run in under a second, though,
are the difference between "works" and "engineered", and they give the report concrete
material. This is the setup that produced the app in this guide:

```bash
npm install -D vitest jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom
```

```js
// vitest.config.js
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: { environment: 'jsdom', globals: true, setupFiles: ['./tests/setup.js'] },
})
```

```js
// tests/setup.js
import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// jsdom has no <dialog>; the app only calls these two methods.
if (!HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function showModal() { this.open = true }
  HTMLDialogElement.prototype.close = function close() {
    this.open = false
    this.dispatchEvent(new Event('close'))
  }
}

afterEach(cleanup)
```

Add `"test": "vitest run"` to your scripts. The tests stub `fetch` with trimmed real
responses, render the app inside a `MemoryRouter`, and assert on what the user sees:

```jsx
it('shows a friendly error with a retry button when the network fails', async () => {
  globalThis.fetch = vi.fn(() => Promise.reject(new TypeError('Failed to fetch')))
  renderAt('/')
  await waitFor(() =>
    expect(screen.getByRole('alert')).toHaveTextContent(/could not reach open library/i),
  )
  expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
})
```

Two things this found in the reference app, both of which would have shipped otherwise:
descriptions containing `\r\n` rendered a phantom empty paragraph, and the same book could
be saved twice if a stale list was read from another tab. Name these in the reflection —
specific bugs are what "grounded in concrete examples" means.

> **Keep or cut?** If tests feel like too much before the deadline, cut them — a finished
> app beats an unfinished well-tested one. If you keep them, run `npm test` in front of your
> own eyes and mention the number of tests in the report.

## 15.3 The five bugs that will bite you (and their fixes)

| Symptom | Cause | Fix |
| --- | --- | --- |
| Blank page after deploying, console 404s on `/assets/…` | `base` is not your repo name | Part 3.5 — set `base: '/repo-name/'` |
| Deep link on the deployed site is a 404 | `BrowserRouter` on Pages | Use `HashRouter` in production (Part 5.1) |
| `Objects are not valid as a React child` | Rendering an array/object from the API (`author_name`) | `.join(', ')`, or map to elements |
| Infinite request loop | `useEffect` dependency is a new function/object each render | The `fnRef` + explicit `deps` pattern in Part 7 |
| "Cannot read properties of undefined" on some books | Field missing for that record | `??` defaults in `normaliseWork` (Part 6) |

## 15.4 Lint, build, and a production preview

```bash
npm run lint     # oxlint: catch unused imports and hooks mistakes
npm run build    # must finish with no error
npm run preview  # serve the built bundle locally
```

`npm run preview` serves at `http://localhost:4173/shelf/` (note the `/shelf/` — that is
your `base`). Open that URL, not `localhost:4173`, or you will see a 404 page that has
nothing to do with your app. Walk the whole test matrix once more **against the build**, in
production mode with hash URLs. This is exactly what the examiner will see.

```bash
git add -A
git commit -m "test: add smoke tests for routing, search states, error paths and saved books"
```

---

# Part 16 — Deploy to GitHub Pages

## 16.1 The three things that must be true

1. `vite.config.js` → `base: '/<repo-name>/'` (Part 3.5).
2. A router mode that survives having no server (Part 5.1 — `HashRouter` in production).
3. A `deploy` script that publishes `dist/` to the `gh-pages` branch.

Everything else is clicking. Get these three right and deployment takes one command.

## 16.2 Deploy with one command

```bash
npm run deploy
```

That runs `vite build` and then `gh-pages -d dist --nojekyll`, which:

- creates (or updates) the **`gh-pages` branch** in your GitHub repo,
- pushes the contents of `dist/` there,
- adds a `.nojekyll` file, because `--nojekyll` asks for it. That file tells Pages to serve
  your files as they are instead of running them through Jekyll, which silently ignores any
  file or folder beginning with an underscore. Vite's own asset names do not start with `_`,
  so the site usually works without it — but it is one flag that removes a whole class of
  "my files disappeared after deploy" bugs, and it is also faster.

The first run will ask for GitHub credentials. Use a **personal access token** as the
password (GitHub → Settings → Developer settings → Personal access tokens → *Fine-grained*,
scope: this repository, Contents: read and write) or let the Git credential helper do it.
Never paste a token into a file that ends up in git.

## 16.3 Turn Pages on, once

1. GitHub → your repo → **Settings** → **Pages**.
2. **Source:** *Deploy from a branch*.
3. **Branch:** `gh-pages` · **Folder:** `/ (root)` → **Save**.
4. Wait 1–3 minutes. The URL appears at the top:
   `https://YOUR-USERNAME.github.io/shelf/`.
5. Hard-reload (Ctrl+Shift+R). GitHub's CDN caches aggressively; a "blank site" five seconds
   after the first deploy is usually cache.

## 16.4 Alternative: deploy with a GitHub Action

If you prefer the repo to build itself on every push to `main` (nice for the report, and it
means you cannot forget to deploy), add `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

Then set Pages → **Source: GitHub Actions**. Use one method or the other, not both —
two publishers fighting over the same site is a confusing hour.

## 16.5 Verify the deployment like an examiner would

Open the live URL on **your phone**, not just your laptop, and check:

- [ ] Home loads with covers (not a blank page, no 404s in the console).
- [ ] Click through all five screens; the URL updates on every navigation.
- [ ] Refresh *while on the book screen* — the page still works (this is the hash-URL payoff).
- [ ] Copy the book URL into a new tab — it opens on that book.
- [ ] Save a book, refresh, it is still there.
- [ ] Turn on airplane mode, reload: the error state appears, not a broken page.
- [ ] Rotate to landscape: no layout break.

If the home page is blank, do not guess. Open DevTools → Console and Network. In order:
404 on `/assets/*` → `base`; 404 on navigation only → router mode; CORS error → wrong API;
`Uncaught SyntaxError` → a stale cached bundle, hard-reload.

```bash
git add -A
git commit -m "ci: add github pages deploy workflow and deploy script"
```

---

# Part 17 — The README

The rubric: *"The project's README provides clear instructions for running the project."*
A stranger should be able to clone your repo and see the app in three commands. Write it for
someone who has never seen your machine.

```markdown
# Shelf — find your next book

A book discovery app built with React and the Open Library API. Browse curated shelves,
search 40 million catalogue records, read about authors, and keep a reading list that
survives a reload.

**Live app:** https://YOUR-USERNAME.github.io/shelf/
**API:** [Open Library](https://openlibrary.org/developers/api) (no key required)

![Home](docs/screenshot-home.png)

## Features

- **Home** — hero search, subject chips and four shelves loaded in parallel.
- **Explore** — search with sort, "covers only" filter and bounded pagination; the query
  lives in the URL, so results are shareable and the back button works.
- **Book** — description, rating, edition count and subjects, merging two API endpoints.
- **Author** — portrait, biography and a sortable list of works.
- **Reading list** — saved in `localStorage`, with filtering, a yearly goal, CSV export and
  a confirmation before clearing.

## Tech stack

| Concern | Choice |
| --- | --- |
| Build tool | Vite 8 |
| UI | React 19 |
| Routing | react-router-dom 7 |
| Styling | Bootstrap 5.3 + react-bootstrap + react-bootstrap-icons, themed with CSS variables |
| Feedback | react-hot-toast |
| Data | Open Library REST API, `fetch` + `async/await` |

## Getting started

Requires **Node.js 20.19+ or 22.12+**.

```bash
git clone https://github.com/YOUR-USERNAME/shelf.git
cd shelf
npm install
npm run dev
```

Open http://localhost:5173.

```bash
npm run build     # production build into dist/
npm run preview   # serve the production build locally
npm run lint      # static checks
npm test          # component tests (if included)
npm run deploy    # build and publish to the gh-pages branch
```

## Project structure

```
src/
├── api/openLibrary.js       # all fetch calls, normalisation, friendly errors
├── hooks/useFetch.js        # data + loading + error + retry
├── hooks/useReadingList.js  # localStorage-backed saved books
├── context/AppProviders.jsx # reading list + cached shelves contexts
├── components/              # BookCard, CoverImage, SiteNavbar, StateViews
├── pages/                   # Home, Explore, Book, Author, ReadingList
├── App.jsx                  # routes and layout
└── index.css                # theme variables + layout rules
```

## Deployment notes

The app is a static site on GitHub Pages, served from the `/shelf/` sub-path, so
`vite.config.js` sets `base: '/shelf/'`. GitHub Pages cannot rewrite deep links to
`index.html`, so production builds use `HashRouter`; development keeps clean URLs with
`BrowserRouter`.

## Credits

Book data and covers from [Open Library](https://openlibrary.org), an initiative of the
Internet Archive. Built as a course project.
```

Two habits that pay off: put **real screenshots** in `docs/` and reference them (a README
with images reads as a finished product), and keep the **project structure** block in sync —
it is the fastest way an examiner understands your architecture.

```bash
git add -A
git commit -m "docs: add readme with setup, structure, deployment notes and screenshots"
```

---
