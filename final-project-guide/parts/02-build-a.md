# Part 3 — Git, GitHub and the Vite project

## 3.1 Install the tools

You need **Node.js 20.19+ or 22.12+** (Vite 8 requires it) and npm.

```bash
node -v     # v22.x or v20.19+ — if older, install from https://nodejs.org (LTS)
npm -v      # 10.x is fine
git --version
```

Also install the **React Developer Tools** browser extension. You will use it to check
that components re-render when they should, and it makes debugging state much faster.

## 3.2 Create the repository

Do this **before** scaffolding, so `create-vite` does not complain about a non-empty
folder, and so your very first commit is already a real project.

1. On GitHub: **New repository** → name it `shelf` (or your app's name) → **Public** →
   do *not* add a README, `.gitignore` or licence (you will create those locally).
2. Then, in a terminal:

```bash
mkdir shelf && cd shelf
git init -b main
```

> Use `main`, not `master`. GitHub Pages and most CI assume `main`.

## 3.3 Scaffold with Vite

```bash
npm create vite@latest . -- --template react
```

Answer the prompts; when it asks to install and start, say no for now. You get:

```text
shelf/
├── index.html
├── package.json
├── vite.config.js
├── public/
└── src/
    ├── App.jsx
    ├── App.css
    ├── index.css
    ├── main.jsx
    └── assets/
```

Notes on the template as of Vite 8 / React 19:

- It ships **oxlint** instead of ESLint. That is fine, and faster; keep it (see 3.6).
- `src/App.css` and the demo counter in `App.jsx` are placeholder content. Delete them
  when you build the real screens; do not delete `index.css`.
- TypeScript? The assignment does not require it. This guide uses plain JavaScript, which
  keeps the report honest about "code you can explain". If you already know TypeScript,
  use the `react-ts` template and add types to the API layer — it is a real bonus.

## 3.4 Install the libraries

The rubric asks for third-party libraries for **styling** *and* **functionality**. This
guide uses four, each doing a job nothing else does:

```bash
npm install bootstrap react-bootstrap react-bootstrap-icons react-router-dom react-hot-toast
```

| Library | Category | Why it earns its place |
| --- | --- | --- |
| `bootstrap` | Styling | The CSS framework: grid, cards, buttons, utilities, responsive breakpoints |
| `react-bootstrap` | Styling + functionality | Bootstrap components as React components: `Modal`, `Navbar`, `Tabs`, `Table`, `Pagination`, `ProgressBar` — all keyboard accessible and controlled by props instead of jQuery |
| `react-bootstrap-icons` | Styling | Icon set that matches Bootstrap's sizing; no icon font to load |
| `react-router-dom` | Functionality | The required router: URLs, nested layouts, `useSearchParams` |
| `react-hot-toast` | Functionality | Non-blocking feedback when a book is saved (the rubric's "clear feedback" line) |

> **Justify your choices in the report.** "I compared X and Y" is worth more than a list.
> For example: *Bootstrap vs Tailwind* — Bootstrap gives you accessible components out of
> the box (modal focus trapping, navbar collapse) which I did not want to rebuild;
> *react-bootstrap vs raw Bootstrap JS* — I wanted no jQuery-style DOM manipulation in a
> React app; *CSS Modules vs one global stylesheet* — the app has one theme, so one
> `index.css` plus Bootstrap utilities was less ceremony.

Check the versions landed where you expect them:

```bash
npm ls react react-dom react-router-dom react-bootstrap bootstrap
```

## 3.5 The first real config change: `base`

This one line decides whether your deployed site is a blank page.

GitHub Pages serves a *project* site from `https://<user>.github.io/<repo>/`, **not** from
the domain root. If your built HTML asks for `/assets/index-abc.js`, the browser looks for
`https://<user>.github.io/assets/index-abc.js` — which does not exist. You get a white page
and a 404 in the console.

Replace `vite.config.js`:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Must match the GitHub repository name, exactly (case matters).
const REPO_NAME = 'shelf'

export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves the site from https://<user>.github.io/<repo>/
  base: `/${REPO_NAME}/`,
})
```

## 3.6 `package.json` scripts and Pages deployment

Open `package.json` and make the `scripts` block look like this (keep the dependencies
that are already there):

```json
{
  "name": "shelf",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "homepage": "https://YOUR-USERNAME.github.io/shelf/",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "oxlint src",
    "deploy": "npm run build && gh-pages -d dist --nojekyll"
  }
}
```

- `homepage` is used by `gh-pages` and documents your live URL in one place.
- `deploy` is a single command you will run in Part 16. `--nojekyll` stops GitHub Pages
  from running Jekyll over the build output (see 16.2).
- `lint` gives you a fast, dependency-free sanity check while you work.

Install the deploy helper as a dev dependency:

```bash
npm install -D gh-pages
```

## 3.7 `.gitignore` and the first commit

The Vite template ships a `.gitignore`. Confirm it contains at least:

```gitignore
node_modules
dist
dist-ssr
*.local
.env
.env.*
!.env.example
.DS_Store
*.log
.vscode/*
!.vscode/extensions.json
```

Two things people forget: **never** commit `node_modules` (thousands of files, huge repo)
and **never** commit `dist` if you deploy with `gh-pages` — the deployed branch holds
those files, not `main`.

Now commit:

```bash
git add .
git commit -m "chore: scaffold Vite + React app and install bootstrap, react-router, icons, toast"
git remote add origin https://github.com/YOUR-USERNAME/shelf.git
git push -u origin main
```

**Commit message style that scores well.** `type: what changed` — `feat:`, `fix:`, `docs:`,
`style:`, `refactor:`, `chore:`. Short summary in the imperative ("add search page", not
"added"). Aim for one commit per working step, roughly 15–25 commits over the project. A
history that reads like a diary of the build is exactly what "reflects the development
process" means.

## 3.8 Run it

```bash
npm run dev
```

Open <http://localhost:5173>. You should see the Vite counter demo. If you see a blank page,
open the console: it is almost always a typo in an import path.

Commit at the end of every part of this guide. It costs ten seconds and it is 6 points.

---

# Part 4 — Bootstrap and a custom theme

## 4.1 Import Bootstrap once, at the top

`src/main.jsx` — start with this (routing and providers arrive in Part 5):

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

Order matters: Bootstrap first, then your own `index.css`, so your overrides win.

> **StrictMode** double-invokes effects in development on purpose, to surface bugs. If your
> API calls appear twice in the Network tab, that is StrictMode, not a bug — in production
> the effect runs once.

## 4.2 Theme with CSS variables instead of new CSS

Bootstrap 5.3 exposes its palette as CSS custom properties, so you can restyle every
component without touching a single `.btn` rule. This file is the whole visual identity of
the app — change six hex values and it looks like a different product.

`src/index.css` (style section; the full file with layout rules is in Part 14):

```css
:root {
  --paper: #fbf7f0;   /* page background */
  --ink: #241f1a;     /* body text */
  --muted: #6b6257;   /* secondary text */
  --accent: #b3421b;  /* links and primary buttons */
  --accent-soft: #f6e3d8;
  --line: #e6ddd0;    /* borders */
  --radius: 14px;
}

/* Feed the palette into Bootstrap's own variables. */
:root,
[data-bs-theme='light'] {
  --bs-primary: #b3421b;
  --bs-primary-rgb: 179, 66, 27;
  --bs-body-bg: #fbf7f0;
  --bs-body-color: #241f1a;
  --bs-body-font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
  --bs-link-color: #9a3816;
  --bs-link-hover-color: #742a10;
  --bs-border-color: #e6ddd0;
}

body {
  background: var(--paper);
  color: var(--ink);
}

.btn-primary {
  --bs-btn-bg: var(--accent);
  --bs-btn-border-color: var(--accent);
  --bs-btn-hover-bg: #963716;
  --bs-btn-hover-border-color: #963716;
  --bs-btn-active-bg: #7f2e12;
  --bs-btn-active-border-color: #7f2e12;
}

.btn-outline-primary {
  --bs-btn-color: var(--accent);
  --bs-btn-border-color: var(--accent);
  --bs-btn-hover-bg: var(--accent);
  --bs-btn-hover-border-color: var(--accent);
}

/* Visible keyboard focus everywhere, not just on buttons. */
:focus-visible {
  outline: 3px solid #1d4ed8;
  outline-offset: 2px;
}
```

**Why this approach.** Setting `--bs-primary` restyles buttons, links, focus rings, form
controls, spinners, badges and progress bars at once. It is also the answer to "how did you
make it look designed rather than default" in the report.

**Contrast check before you go further.** Your text on your background must reach 4.5:1
for body text. Test the pair you chose with <https://webaim.org/resources/contrastchecker/>.
`#241f1a` on `#fbf7f0` is about 13:1 — comfortable. A slate grey on cream often is not.

## 4.3 Look at what you got for free

Add a throwaway `src/App.jsx` to see the theme applied, then open the page:

```jsx
import { Button, Card, ProgressBar, Spinner } from 'react-bootstrap'

export default function App() {
  return (
    <div className="container py-5">
      <h1 className="mb-3">Theme check</h1>
      <p><Button>Primary</Button> <Button variant="outline-primary">Outline</Button></p>
      <Card className="p-3 mb-3" style={{ maxWidth: 320 }}>
        <h2 className="h5">Card</h2>
        <ProgressBar now={60} label="60%" />
      </Card>
      <Spinner animation="border" role="status" />
    </div>
  )
}
```

Resize the window: Bootstrap's grid and utilities already respond. That is the "styling
library" line on the rubric handled — but it only counts if you *use* it, which the next
parts do.

```bash
git add -A
git commit -m "style: theme bootstrap with a custom palette via css variables"
```

---

# Part 5 — Routing skeleton and the shared layout

## 5.1 Choose the router mode before you build screens

`react-router-dom` offers two modes, and for GitHub Pages the choice matters:

| Mode | URL looks like | Deep links on Pages |
| --- | --- | --- |
| `BrowserRouter` | `/shelf/book/OL893414W` | **404** — Pages has no server to rewrite the path to `index.html` |
| `HashRouter` | `/shelf/#/book/OL893414W` | Works — the browser never sends the part after `#` to the server |

The professional-looking fix is a `404.html` redirect trick. The pragmatic fix — and the
one this guide uses — is *clean URLs locally, hash URLs in production*, so your development
experience stays pleasant and your deployed site never 404s:

```jsx
const Router = import.meta.env.PROD ? HashRouter : BrowserRouter
```

`import.meta.env.PROD` is `true` in the built bundle and `false` under `npm run dev`.

> Mention the `404.html` alternative in your report as the design decision you considered:
> it keeps URLs pretty, but relies on a redirect page plus sessionStorage tricks, and a
> broken deep link during the examiner's five-minute check costs more than a `#` in the URL.

## 5.2 `index.html`

Small file, three things that matter: the `<title>` (what the browser tab and Google show),
the meta description, and a favicon URL that respects `base`. `%BASE_URL%` is replaced by Vite
at build time, so the icon works both at `localhost:5173/` and at
`youruser.github.io/shelf/`.

{{index.html}}

A single-file SVG favicon lives in `public/favicon.svg` — no build step, no `.ico`, and it
scales. Any 32×32 SVG works:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="8" fill="#b3421b"/>
  <path d="M7 9.5c3-1.2 6-1.2 9 0v14c-3-1.2-6-1.2-9 0v-14Z" fill="#fbf7f0"/>
  <path d="M25 9.5c-3-1.2-6-1.2-9 0v14c3-1.2 6-1.2 9 0v-14Z" fill="#f6e3d8"/>
</svg>
```

## 5.3 `src/main.jsx` — the final version

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import App from './App.jsx'
import { ReadingListProvider, ShelvesProvider } from './context/AppProviders'

// On GitHub Pages there is no server to rewrite unknown paths to index.html,
// so a deep link such as /shelf/book/OL893414W would return 404. HashRouter keeps the
// route after the "#", which the browser never sends to the server. Locally we keep
// clean URLs with BrowserRouter.
const Router = import.meta.env.PROD ? HashRouter : BrowserRouter

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <ReadingListProvider>
        <ShelvesProvider>
          <App />
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: { borderRadius: '12px', background: '#1f1b16', color: '#fffdf8' },
            }}
          />
        </ShelvesProvider>
      </ReadingListProvider>
    </Router>
  </StrictMode>,
)
```

Write this file now but keep the two providers commented out until Part 7, or create the
file `src/context/AppProviders.jsx` in this part with empty stubs. Either is fine; the app
will not run until both exist.

## 5.4 The navbar

Familiar patterns score points: a logo that goes home, three text links, a persistent
search entry point, and a saved-items badge. On a phone the links collapse into a burger.

`src/components/SiteNavbar.jsx`:

```jsx
import { useEffect, useRef } from 'react'
import { Navbar, Nav, Container, Badge } from 'react-bootstrap'
import { BookHalf, Search } from 'react-bootstrap-icons'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useReadingListContext } from '../context/AppProviders'

/**
 * One navbar for the whole app. The only moving part is a native <dialog>
 * search box that opens with "/" or Ctrl/Cmd+K.
 */
export default function SiteNavbar() {
  const { count } = useReadingListContext()
  const dialogRef = useRef(null)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  function openSearch() {
    dialogRef.current?.showModal()
    window.setTimeout(() => inputRef.current?.focus(), 0)
  }

  useEffect(() => {
    function onKeyDown(event) {
      const tag = document.activeElement?.tagName
      const isTyping = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT'
      const isShortcut = event.key === '/' || ((event.ctrlKey || event.metaKey) && event.key === 'k')

      if (isShortcut && !isTyping) {
        event.preventDefault()
        openSearch()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  function handleSearchSubmit(event) {
    event.preventDefault()
    const query = inputRef.current.value.trim()
    dialogRef.current?.close()
    if (query) navigate(`/explore?q=${encodeURIComponent(query)}`)
  }

  return (
    <Navbar expand="md" className="site-navbar sticky-top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
          <BookHalf aria-hidden="true" />
          <span>Shelf</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="ms-auto align-items-md-center gap-md-1">
            <Nav.Link as={NavLink} to="/" end>Home</Nav.Link>
            <Nav.Link as={NavLink} to="/explore">Explore</Nav.Link>
            <Nav.Link as={NavLink} to="/reading-list">
              Reading list
              {count > 0 && (
                <Badge bg="primary" pill className="ms-2" aria-label={`${count} saved books`}>
                  {count}
                </Badge>
              )}
            </Nav.Link>
            <button type="button" className="btn btn-sm btn-light ms-md-2" onClick={openSearch}>
              <Search className="me-1" aria-hidden="true" />
              Search
            </button>
          </Nav>
        </Navbar.Collapse>
      </Container>

      {/* Native <dialog>: the browser handles Esc, focus trapping and the backdrop. */}
      <dialog ref={dialogRef} className="search-dialog" aria-label="Search books">
        <form className="p-4" onSubmit={handleSearchSubmit}>
          <label htmlFor="nav-search-input" className="form-label fw-semibold">
            Search books, authors, subjects
          </label>
          <input
            id="nav-search-input"
            ref={inputRef}
            type="search"
            className="form-control form-control-lg"
            placeholder="e.g. Ursula K. Le Guin"
          />
          <div className="d-flex justify-content-between align-items-center mt-3">
            <small className="text-body-secondary">Press Esc to close</small>
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => dialogRef.current?.close()}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">Search</button>
            </div>
          </div>
        </form>
      </dialog>
    </Navbar>
  )
}
```

Three details worth understanding, because they are the kind of thing you will be asked
about:

- `NavLink` from `react-router-dom` adds an `active` class to the current link
  automatically — that is how the navbar shows where you are. `end` on the Home link stops
  `/` from matching every route.
- A **native `<dialog>`** gives you Esc-to-close, a backdrop and focus trapping from the
  browser, with no library and no accessibility work. One caveat: jsdom (used in tests)
  does not implement `showModal()`, which matters in Part 15.
- `aria-hidden="true"` on decorative icons stops screen readers announcing "book half,
  search" before every label. Accessibility is a rubric line; it is also two words per icon.

## 5.5 The app shell and routes

`src/App.jsx`:

```jsx
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Container } from 'react-bootstrap'
import SiteNavbar from './components/SiteNavbar'
import HomePage from './pages/HomePage'
import ExplorePage from './pages/ExplorePage'
import BookPage from './pages/BookPage'
import AuthorPage from './pages/AuthorPage'
import ReadingListPage from './pages/ReadingListPage'

export default function App() {
  const { pathname } = useLocation()

  // A real page change should start at the top, like a normal website.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return (
    <div className="app-shell">
      <a href="#main" className="skip-link">Skip to content</a>
      <SiteNavbar />

      <main id="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/book/:id" element={<BookPage />} />
          <Route path="/author/:id" element={<AuthorPage />} />
          <Route path="/reading-list" element={<ReadingListPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

function NotFound() {
  return (
    <Container className="py-5 text-center">
      <p className="display-4 mb-2">404</p>
      <h1 className="h3">This shelf does not exist</h1>
      <p className="text-body-secondary">The page you followed is not part of the app.</p>
      <Link to="/" className="btn btn-primary">Back to home</Link>
    </Container>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <Container className="d-flex flex-wrap justify-content-between gap-2 py-4">
        <p className="small mb-0">
          Shelf is a student project. Book data from{' '}
          <a href="https://openlibrary.org/developers/api" target="_blank" rel="noreferrer">
            Open Library
          </a>
          , an initiative of the Internet Archive.
        </p>
        <p className="small mb-0 text-body-secondary">Built with React, Vite and Bootstrap.</p>
      </Container>
    </footer>
  )
}
```

Why this structure scores well:

- **The navbar and footer are outside `<Routes>`**, so they render once and never remount.
  Navigation feels instant and the saved-count badge does not flicker.
- **`:id` is a route parameter**, which is what makes `/book/:id` *one* screen that serves
  every book, instead of a page per book.
- **`*` catches everything else** and gives a friendly 404 instead of a blank page — a small
  thing examiners notice.
- **The footer credits the API.** Required by Open Library's terms and good practice.

## 5.6 Screen stubs so the app runs

Create the five page files with placeholder content, so you can walk the routes before
writing real features:

```jsx
// src/pages/HomePage.jsx
export default function HomePage() {
  return <div className="container py-5"><h1>Home</h1></div>
}
```

Repeat for `ExplorePage`, `BookPage`, `AuthorPage`, `ReadingListPage` (same shape, different
title).

`main.jsx` and `SiteNavbar.jsx` from above import providers and hooks that do not exist yet,
so pick one of two paths — both are fine:

- **Easiest:** paste the `main.jsx` from 5.3 later. For now keep the simple version without
  providers, and temporarily change the navbar line
  `const { count } = useReadingListContext()` to `const count = 0`. Delete that placeholder
  the moment Part 7 gives you the real provider.
- **Neater:** write `src/context/AppProviders.jsx` and the two hooks from Part 7 now, then
  everything in Part 5 runs unchanged.

Whichever you choose, the point of this step is that you can visit a route and see a heading.
That is your proof the router is wired correctly before any feature depends on it.

```bash
npm run dev
```

Visit `/#/explore`, `/book/123`, `/_nope` (404). Then commit:

```bash
git add -A
git commit -m "feat: add react-router routes, shared layout, navbar with search dialog"
```

---
