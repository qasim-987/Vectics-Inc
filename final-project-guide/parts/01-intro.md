# Build It: A Complete Step-by-Step Guide to the Final Project

**Course:** Web Application with React · **Weight:** 40% · **Deadline:** 13 November 2026

**Reference app in this guide:** *Shelf* — a book discovery app built on the Open Library API.

> **How to use this guide.** Every step tells you what to do, why it matters, and which
> rubric line it earns. Code blocks are complete files: create the file, paste the block,
> save. Each part ends with a commit, so your git history tells the story of the build
> (that is worth 6 of the 40 points on its own). Every piece of code in this guide was
> compiled and tested before it was written down — search, detail pages, empty states,
> error states, the lot.
>
> **Read it once end to end before you start typing.** Ten minutes of reading will save
> you a day of "why is my page blank".

---

## Contents

| Part | What you do | Time | Page |
| --- | --- | --- | --- |
| 0 | Understand what is actually being graded | 20 min | 3 |
| 1 | Choose a topic and a real API | 45 min | 4 |
| 2 | Plan three screens on paper | 45 min | 5 |
| 3 | Git, GitHub and the Vite project | 45 min | 7 |
| 4 | Bootstrap and a custom theme | 40 min | 10 |
| 5 | Routing skeleton and the shared layout | 60 min | 12 |
| 6 | The API layer (`fetch`, `async/await`, errors) | 90 min | 17 |
| 7 | One reusable data-fetching hook | 45 min | 20 |
| 8 | Reusable UI components | 90 min | 24 |
| 9 | Screen 1 — Home | 90 min | 26 |
| 10 | Screen 2 — Explore (search, sort, paginate) | 120 min | 29 |
| 11 | Screen 3 — Book detail | 90 min | 33 |
| 12 | Screen 4 — Author page | 60 min | 36 |
| 13 | Screen 5 — Reading list (saved state) | 90 min | 38 |
| 14 | Styling, responsiveness and accessibility | 120 min | 42 |
| 15 | Quality assurance before you ship | 60 min | 50 |
| 16 | Deploy to GitHub Pages | 60 min | 53 |
| 17 | The README | 30 min | 55 |
| 18 | The report (400–600 words) | 120 min | 56 |
| 19 | The submission ZIP | 20 min | 58 |
| 20 | Final rubric self-check | 15 min | 59 |

That is roughly 20 hours of focused work. Spread over six evenings it is comfortable;
crammed into one night it is not. Start today.

---

# Part 0 — Understand what is being graded

Most students lose points on things that take ten minutes to fix: a README with no run
instructions, a deployed site that is blank because of one config line, or three screens
that all do the same search. Read the rubric as a checklist, not as prose.

| Rubric line | Points | What an examiner actually looks for |
| --- | --- | --- |
| Core structure | 0–8 | Vite + React, components with clear responsibilities, **3+ screens with different purposes**, a router |
| API integration | 0–8 | A real REST/JSON API that fits the topic, `fetch` + `async/await`, loading state, error state, empty state |
| UI and UX | 0–8 | Familiar patterns, consistent navigation, works at 320 px and at 1440 px, keyboard usable, alt text, labels |
| Libraries | 0–5 | At least one library for **styling** and one for **functionality**, used where they actually help |
| Version control + deployment | 0–6 | Real history (not one "final" commit), README that works for a stranger, live public URL that works |
| Report | 0–5 | All four sections, concrete examples from *your* code, honest AI statement |

Two hard rules people trip over:

1. **"Three different screens" means three different jobs.** Three URLs that all show a
   search box and a grid is one screen copied three times. The reference app in this guide
   has five screens: browse (Home), search (Explore), inspect one item (Book), inspect a
   person (Author), and manage a personal collection (Reading list).
2. **Weather apps are banned.** So is anything that is just a form that posts to an API and
   prints the raw JSON.

**The 3-screen sanity test.** Write one sentence per screen: *"On this screen the user
does ___ so that ___."* If two sentences are interchangeable, you have one screen twice.

---

# Part 1 — Choose a topic and a real API

## 1.1 What makes an API usable for this project

The assignment says *"a real REST API returning JSON data"*. Beyond that, pick one that
survives being called from GitHub Pages:

| Requirement | Why it matters | Quick test |
| --- | --- | --- |
| `https://` endpoint | Pages is served over HTTPS; mixed content is blocked | The URL starts with `https` |
| No key, or a key you can safely expose | A static site has no server to hide secrets in | Read the docs: "no authentication required" |
| CORS enabled | The browser blocks cross-origin reads unless the API says otherwise | See 1.3 below |
| Stable, documented shape | You will write code against its field names | Docs have example responses |
| Enough data for 3 screens | You need lists, details and something to filter | It returns more than one field |

## 1.2 Where to find one

- <https://github.com/public-apis/public-apis> — searchable list, filter by "no auth".
- <https://github.com/public-apis/public-apis#index> — the index by category.
- If a course topic interests you (music, football, space, books, art, food), look for the
  official API of an organisation in that field first. They are usually better documented
  than hobby APIs.

## 1.3 The CORS check (do this before you commit to an API)

Open the API URL directly in your browser. You will see JSON — that proves nothing, because
typing a URL is not a cross-origin request. Instead:

1. Open <https://example.com> in a tab.
2. Open DevTools → Console.
3. Paste and run:

```js
fetch('https://openlibrary.org/search.json?q=dune&limit=1')
  .then((r) => r.json())
  .then((d) => console.log('CORS OK', d.numFound))
  .catch((e) => console.error('CORS BLOCKED', e))
```

If you see `CORS OK`, the API will work from your deployed site. If you see a red CORS
error, that API cannot be called from a browser at all — pick another one. Do not "fix"
this with a proxy on day five; you will not have time.

## 1.4 The reference topic: Open Library

**Open Library** (<https://openlibrary.org/developers/api>) is an Internet Archive project
that catalogues tens of millions of books. It is a good fit because:

- no API key, no sign-up, HTTPS, CORS open;
- three genuinely different data types — **works** (a book), **authors**, and **subjects** —
  which gives you three different screens almost for free;
- cover images served from `covers.openlibrary.org`, so your UI looks like something;
- it fails in interesting ways (missing descriptions, missing authors, 404 covers), which
  means your error and empty states are real, not decorative.

The endpoints used in this guide:

| Purpose | Endpoint | Notes |
| --- | --- | --- |
| Free-text search | `GET /search.json?q=dune&limit=24&page=1` | Returns `numFound` + `docs[]` |
| Search by author | `GET /search.json?q=author_key:OL79034A&sort=rating` | `author_key` is a field query |
| Browse a subject | `GET /search.json?q=subject:fantasy` | `subject:` is a field query |
| Sort results | `...&sort=rating`, `new`, `old` | Anything else falls back to relevance |
| One work | `GET /works/OL893414W.json` | Title, description, subjects, covers |
| One author | `GET /authors/OL79034A.json` | Name, bio, dates, photo id |
| Cover image | `https://covers.openlibrary.org/b/id/11481354-M.jpg` | `-S`, `-M`, `-L` sizes |

Two quirks you must design around, and which make excellent report material:

1. **The rating is not on the work endpoint.** `/works/{id}.json` has no rating or first
   publish year; those fields live in the search index. So the detail screen fetches
   *both* endpoints at once with `Promise.all` and merges them.
2. **`description` and `bio` are sometimes a string, sometimes an object** like
   `{ "type": "/type/text", "value": "…" }`, and they contain Windows line endings. Your
   normalisation layer has to handle both.

## 1.5 If you want a different topic

You can keep every architectural decision in this guide and swap the API. Pick the mapping
that matches your taste:

| Topic | API | Screen 1 | Screen 2 | Screen 3 | Extra |
| --- | --- | --- | --- | --- | --- |
| Books (this guide) | Open Library | Featured shelves | Search + filters | Book + author | Reading list |
| Space | `https://api.spacexdata.com/v4` | Next launch + countdown | Launch history w/ filters | Rocket detail | Favourites |
| Art | `https://api.artic.edu/api/v1` | Highlighted works | Search + department filter | Artwork detail | Personal gallery |
| Anime | `https://api.jikan.moe/v4` | Seasonal picks | Search + genre | Anime + characters | Watchlist |
| Classic texts | `https://gutendex.com/books` | Popular books | Search + language | Book + similar | Reading queue |
| Football | `https://api.football-data.org/v4` (key) | League table | Fixtures by matchday | Team detail | Followed teams |

Whatever you choose, **write the three screen sentences before you write code**. If you
cannot fill the "extra" column with something a user would want, the topic is too thin.

> **Note on keys.** If an API needs a key, put it in a `.env` file and use
> `import.meta.env.VITE_API_KEY`. Vite inlines `VITE_*` variables into the built
> JavaScript, so the key is public — only do this for free, rate-limited, revocable keys,
> and say so in the README. Never commit `.env`. This is a good paragraph for the report.

---

# Part 2 — Plan three screens on paper

This is the step people skip and then regret. Fifteen minutes with a pen saves hours of
refactoring.

## 2.1 The screen map

Write this table for your own topic. For *Shelf*:

| Screen | Route | The user's job | Data source |
| --- | --- | --- | --- |
| Home | `/` | Get inspired and jump in | 4 subject searches in parallel |
| Explore | `/explore?q=…&sort=…&page=…` | Find a specific book | `/search.json` |
| Book | `/book/:id` | Decide whether to read it | `/works/{id}` + search |
| Author | `/author/:id` | See everything by one writer | `/authors/{id}` + search |
| Reading list | `/reading-list` | Keep what they chose | `localStorage` only |

Note what makes these different: one is editorial, one is a query tool, two are detail
views of *different entities* (a book and a person are not the same screen), and one is a
personal collection with no API call at all. That last one is worth points: it shows you
did not just wrap an API.

## 2.2 Sketch the layout

Draw boxes. Rough is correct. For the Home screen:

```text
+-------------------------------------------------------------+
| Shelf            Home   Explore   Reading list (2)  [Search] |  sticky navbar
+-------------------------------------------------------------+
|  POWERED BY OPEN LIBRARY                                     |
|  Find the book you                                           |
|  did not know you wanted.                                    |
|  [ 🔍 Title, author or subject ....... ] [ Search ]           |
|  In the mood for  [fantasy] [sci-fi] [mystery] [romance] ...  |
+-------------------------------------------------------------+
|  Browse the shelves                          Explore all ->  |
|  Fantasy                                      See all        |
|  [cover][cover][cover][cover][cover][cover]  -> scrolls       |
|  Science fiction                                             |
|  [cover][cover][cover][cover][cover][cover]                   |
+-------------------------------------------------------------+
```

Explore, on desktop and on a phone:

```text
DESKTOP                                    PHONE (<= 767px)
+----------------------------------------+ +------------------+
| Explore the catalogue                  | | Shelf      [menu]|
| [🔍 search...........] [sort v] [o] [ ]| | Explore          |
+----------------------------------------+ | [🔍 search....]  |
| 48,280 results for "dune"  [chips]     | | [sort v] [o] [ ] |
+----------------------------------------+ | 48,280 results   |
| [cover] [cover] [cover] [cover]        | | [cover] [cover]  |
|  Dune    Dune   Dune    Dune           | |  Dune    Dune    |
| [cover] [cover] [cover] [cover]        | | [cover] [cover]  |
+----------------------------------------+ +------------------+
|            < 1 >                       |
```

The important insight from the second sketch: a 4-column grid becomes 2 columns, and the
toolbar stacks vertically. You do not need a separate mobile design — you need a plan for
how each block collapses.

## 2.3 The component tree

```text
App
├── SiteNavbar            (nav + search dialog, reads the saved count)
├── Routes
│   ├── /            → HomePage      → ShelfRow → CoverImage
│   ├── /explore     → ExplorePage   → BookCard (grid) | ErrorState | EmptyState | skeleton
│   ├── /book/:id    → BookPage      → CoverImage, Stat, AuthorCard, Tabs
│   ├── /author/:id  → AuthorPage    → BookCard (grid), sort buttons
│   ├── /reading-list→ ReadingListPage → Table | BookCard, Modal
│   └── *            → NotFound
└── Footer
```

Rules of thumb that produce a good score here:

- A component that is used on two screens moves to `components/` (`BookCard`,
  `CoverImage`, `ErrorState`, `Skeleton`).
- A component used by one screen stays in `pages/` as a small local component
  (`AuthorCard` lives inside `BookPage.jsx`, `Stat` too). Do not over-abstract.
- No component both fetches data *and* renders a whole page. Fetching goes in the page or
  in a hook; rendering goes in small components.

**Checkpoint.** You now have: a topic sentence, a table of three-plus screens with
different jobs, two sketches, and a component tree. Commit nothing yet — git comes next.

---
