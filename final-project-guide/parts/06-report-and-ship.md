# Part 18 — The report (400–600 words of your own text)

The report is 5 points and it is the easiest 5 points on offer — but only if it is honest,
specific, and sectioned the way the brief asks. It is *your* text: if a sentence could be
pasted into any other student's report unchanged, delete it.

## 18.1 Word budget

| Section | Required | Aim for | Content |
| --- | --- | --- | --- |
| 1. Project description | 50–100 words | ~90 | What it does, who it is for, the API and libraries, both links |
| 2. Screenshots | 3–4 images | — | One per screen, captioned |
| 3. AI usage statement | 50–100 words | ~90 | Tools, frequency, task types, where you said no |
| 4. Reflection | 300–400 words | ~350 | Challenge, design decisions, what is next |
| **Total** | 400–600 | **~530** | |

Write it in a document editor, then export to PDF named exactly
`Lastname_Firstname_report.pdf`. Two A4 pages of calm layout beats four pages of cramped
text.

## 18.2 Section 1 — project description

Answer five questions in under 100 words: what, who, which API and why, which libraries and
for what, and both links. Example shape (rewrite in your own words):

> Shelf is a book discovery app for readers who know they want *something* but not what.
> It lets you browse curated subject shelves, search the Open Library catalogue, read about
> authors, and save books to a reading list that persists in the browser. Data comes from the
> Open Library REST API (`/search.json`, `/works/{id}`, `/authors/{id}`) with `fetch` and
> `async/await`. Bootstrap, react-bootstrap and react-bootstrap-icons handle styling and
> accessible components; react-router-dom handles routing; react-hot-toast confirms saves.
> **Repository:** github.com/you/shelf · **Live:** you.github.io/shelf/

## 18.3 Section 2 — screenshots

Four images, each full-window, each with a one-line caption that says **what the user is
doing**, not "screenshot of the home page":

1. **Home** — "Home: hero search, subject chips and four shelves fetched in parallel."
2. **Explore** — "Explore: 48,280 results for *dune* with sort, covers filter and pagination
   state visible in the URL."
3. **Book or Author detail** — "Book detail: description and rating merged from two
   endpoints, with the author card loaded independently."
4. **Reading list** — "Reading list: locally saved books, yearly goal and CSV export."

How to take screenshots that do not look like a student project:

- Use a real width (1440 × 900), not a phone screenshot scaled up.
- Wait for data to load; never ship a screenshot with a skeleton or a spinner in it.
- Show a realistic state: a populated reading list, a search with results.
- Optional and effective: one extra image of the **offline error state** with the caption
  "Graceful failure when the network drops". It directly evidences the API-integration marks.
- Crop nothing that matters; keep the navbar visible so navigation is legible.

## 18.4 Section 3 — AI usage statement

The brief is specific: which tools, how often, for which tasks, concrete cases, and where you
*chose not to* use them. All four elements, in 50–100 words. Example of the required shape:

> I used ChatGPT (GPT-5) and GitHub Copilot in VS Code, an average of two sessions per
> evening over nine days. I used them to explain the difference between `BrowserRouter` and
> `HashRouter` for GitHub Pages, to debug a `useEffect` that refetched on every render
> (the fix was keeping the fetch function in a ref and depending on the route parameter), to
> get a starting point for the CSV export with `Blob` and `createObjectURL`, and to review
> my error messages for tone. I did not use AI for the component structure, the screen
> planning, or the design/copy: I sketched those on paper first and wanted the decisions to
> be mine. I also wrote all final code by hand, typing it out and testing each piece against
> the real API rather than pasting whole files.

That is honest, specific, and it makes you look like a professional. Do not claim you wrote
everything yourself if you did not — and do not understate your own work either.

## 18.5 Section 4 — reflection (300–400 words)

Three questions, roughly one paragraph each. The grading note says *"grounded in concrete
examples from the student's own code"* — so every paragraph needs a filename, a function
name, or a bug you fixed.

**Most challenging part, and how you solved it.** Pick a real story with a beginning, a
symptom and a resolution. Strong examples from this build:

- *The blank page after deploying.* Everything worked locally; the deployed site was white
  with 404s on `/assets/index-….js`. Cause: GitHub Pages serves a project site from
  `/shelf/`, so the asset URLs needed `base: '/shelf/'` in `vite.config.js`. Then: refreshing
  `/shelf/book/OL893414W` returned GitHub's 404 because there is no server to rewrite the
  path, solved by switching to `HashRouter` for production only
  (`import.meta.env.PROD ? HashRouter : BrowserRouter`).
- *One screen, two endpoints.* The `/works/{id}.json` response has no rating, and the search
  endpoint has no description. The detail screen needed both, so `getBook()` now runs
  `Promise.all` and merges them — which also means the merging logic lives in one testable
  function instead of in a component.
- *The request that would not stop.* A naive `useEffect` with an inline `() => getBook(id)`
  refetched forever, because a new function is a new dependency on every render. Fixed by
  storing the function in `useRef` and making the route id the only dependency.

**Design decisions you considered.** Name the alternatives you *rejected* and why. This is
where you prove you thought rather than copied:

- Bootstrap vs Tailwind — Bootstrap's components (modal, tabs, navbar) already handle focus
  management and keyboard behaviour; with Tailwind I would have rebuilt those.
- react-bootstrap vs Bootstrap's JS bundle — I did not want jQuery-style DOM manipulation
  inside a React tree.
- A data-fetching library (React Query/SWR) vs my own `useFetch` — the library is better at
  caching, but twenty lines I can explain beat a dependency I cannot.
- One context vs two — splitting the reading list from the cached shelves stops a shelf load
  from re-rendering every book card.
- Where the "search state" lives — URL (`useSearchParams`) not `useState`, at the cost of a
  submit-based search instead of live-as-you-type.
- `localStorage` instead of a backend — no accounts, no server, instant, and honest about
  what a static site can do.

**What you would improve next.** Be specific and a bit ambitious: caching API responses for
a few minutes so returning to a search is instant; a real `404.html` redirect so URLs lose
the `#`; reading-list notes and a "currently reading" status; virtualising the results grid
for very large result sets; a dark theme using Bootstrap's `data-bs-theme`; moving
normalisation into TypeScript types so a field rename fails at build time; an infinite-scroll
option instead of pagination; E2E tests with Playwright against the deployed URL.

## 18.6 Assembly checklist before you export the PDF

- [ ] 400–600 words of your own text, counted (screenshots and captions excluded).
- [ ] All four sections present, in order, with headings that match the brief.
- [ ] Both links clickable and **tested in the PDF** (open the PDF, click them).
- [ ] 3–4 screenshots, captioned, readable at 100% zoom.
- [ ] No screenshot shows a loading skeleton, a broken cover, or `localhost` in the URL bar.
- [ ] File name `Lastname_Firstname_report.pdf`.
- [ ] Read once for typos, out loud. It takes four minutes and it is noticed.

---

# Part 19 — The submission ZIP

The brief: *"a ZIP file named Lastname_Firstname_final-project.zip including the entire
project folder WITHOUT node_modules, and the report as a separate PDF."*

## 19.1 Clean first

```bash
cd ..
rm -rf shelf/node_modules shelf/dist shelf/.git   # keep your local .git if you like, but it is not needed in the zip
```

Do **not** delete `.git` if you plan to keep committing after the deadline; just know that a
`node_modules`-free `.git` is still several MB. Most students exclude it; the GitHub link in
the report is the proof of history.

## 19.2 Build the zip

```bash
zip -r Lastname_Firstname_final-project.zip shelf \
  -x "shelf/node_modules/*" -x "shelf/dist/*" -x "*.DS_Store"
```

On Windows: right-click the folder → *Send to* → *Compressed folder*, then **verify** it does
not contain `node_modules`.

## 19.3 Verify like an examiner

1. Unzip into a fresh folder (`~/Downloads/verify`).
2. `cd` into the project, run `npm install` then `npm run dev`, and click through all five
   screens. If it does not run from a clean clone, it does not pass — this step catches a
   missing dependency in `package.json` or a file you forgot to save.
3. Check the folder contains `README.md`, `package.json`, `vite.config.js`, `index.html`,
   `src/`, and `.gitignore`.
4. Check the PDF is separate: `Lastname_Firstname_report.pdf` next to the ZIP.
5. Submit **both** files, with the exact names, before the deadline (13.11.2026), not at 23:58.

---

# Part 20 — Final rubric self-check

Print this, tick it honestly, and fix anything unticked. Anything you cannot tick is a known
loss you chose — and knowing where you lose marks is part of the assignment's point.

## Core structure (0–8)

- [ ] Built with Vite + React, `npm run dev` works from a clean clone.
- [ ] 3+ screens, each with a distinct purpose (browse / search / detail / person / collection).
- [ ] Routing with react-router-dom; a shared navbar; a 404 route.
- [ ] Components are reusable (`BookCard`, `CoverImage`, `StateViews`) and pages are thin.
- [ ] No giant component: nothing over ~200 lines with unrelated responsibilities.

## API integration (0–8)

- [ ] A real HTTPS REST API returning JSON, clearly tied to the topic.
- [ ] All requests in `src/api/`, using `fetch` + `async/await`.
- [ ] Loading state (skeleton or spinner), not a blank area.
- [ ] Error state with a plain-English message and a working retry.
- [ ] Empty state distinct from loading and from error.
- [ ] Timeouts/`AbortController`, status-code handling, no raw error objects in the UI.
- [ ] `Promise.all` where independent calls can run in parallel.

## UI and UX (0–8)

- [ ] Familiar patterns: search field with a submit action, sort select, pagination, tabs.
- [ ] Navigation is consistent and shows the current location.
- [ ] Tested at 320 / 375 / 768 / 992 / 1440 px, no horizontal scroll.
- [ ] Keyboard-only pass works; focus is always visible; skip link exists.
- [ ] Alt text, labelled inputs, one `h1` per screen, `aria-pressed` on toggles.
- [ ] An empty or half-broken record looks intentional, not broken.
- [ ] `prefers-reduced-motion` respected.

## Libraries (0–5)

- [ ] A styling library is used *and themed* (Bootstrap + CSS variables).
- [ ] A functionality library is used for something load-bearing (router, tabs, modal, toasts).
- [ ] You can say in one sentence why each library is there instead of hand-written code.

## Version control and deployment (0–6)

- [ ] Public GitHub repo, `node_modules` not committed.
- [ ] 15+ commits with meaningful messages telling the story of the build.
- [ ] README with clone → install → dev instructions, verified from a clean clone.
- [ ] Live GitHub Pages URL that loads, navigates, and survives a refresh on a deep link.
- [ ] A screenshot in the README.

## Report (0–5)

- [ ] 400–600 words, four sections, correct order.
- [ ] Both links, tested in the PDF.
- [ ] 3–4 captioned screenshots of *different* screens.
- [ ] AI statement with tools, frequency, concrete tasks, and where you declined.
- [ ] Reflection names real files, functions and bugs from your own code.
- [ ] Named `Lastname_Firstname_report.pdf`.

---

## If you only have two days

Do this, in this order, and stop when time runs out:

1. **Day 1 morning** — Parts 3–7: project, theme, routing, API layer, hooks. Commit five times.
2. **Day 1 afternoon** — Parts 8–10: components, Home, Explore. This alone is two screens and
   the API marks.
3. **Day 1 evening** — Parts 11–12: Book and Author. Three screens, three entities.
4. **Day 2 morning** — Part 13 (reading list) if time allows; otherwise polish and skip.
5. **Day 2 midday** — Part 14 and 15: responsive, keyboard, manual QA.
6. **Day 2 afternoon** — Parts 16–17: deploy, README, verify on your phone.
7. **Day 2 evening** — Parts 18–20: report, screenshots, PDF, ZIP, submit. **Submit early in
   the evening.** A server outage at 23:50 is not a valid excuse.

What you can drop under pressure, in order: automated tests, the author screen, CSV export,
the year goal. What you must not drop: three distinct screens, the error/empty states, the
README, the deployment. Those are the difference between 20/40 and 34/40.

---

## Where to look things up

| Need | Source |
| --- | --- |
| React fundamentals, hooks rules | <https://react.dev/learn> |
| Router APIs, `useSearchParams`, nesting | <https://reactrouter.com/start/declarative/routing> |
| Bootstrap classes and components | <https://react-bootstrap.netlify.app/docs/components/navbar> |
| Vite config, `base`, env variables | <https://vite.dev/guide/build> |
| GitHub Pages deployment for Vite | <https://vite.dev/guide/static-deploy> |
| Open Library API docs | <https://openlibrary.org/developers/api> |
| Which public API to use | <https://github.com/public-apis/public-apis> |
| Contrast checker | <https://webaim.org/resources/contrastchecker/> |
| Testing Library queries | <https://testing-library.com/docs/queries/about> |

Good luck. Build the small version first, get it deployed on day one even if it is ugly, and
then make it good — a live site with three screens beats a beautiful project on your laptop.
