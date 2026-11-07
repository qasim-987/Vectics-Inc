# Part 6 — The API layer (`fetch`, `async/await`, errors)

This is the 8-point rubric line, and it is where most projects leak marks. The examiner
opens your app, throttles the network to offline, and watches what happens. If the page
hangs on a spinner forever, or shows `TypeError: Failed to fetch` in the middle of the UI,
you lose the "clear and user-friendly feedback" part.

## 6.1 The rule: components never call `fetch` directly

Put every request in one module, `src/api/openLibrary.js`. Reasons that belong in your
report:

- **One place to change** if the API URL or a field name changes.
- **One place to handle errors**, so every screen fails the same friendly way.
- **Normalisation**: the API's shape is not your component's shape. `cover_i` is not a
  name any component should know about.
- **Testability**: you can call these functions from Node or a test without rendering
  anything.

## 6.2 The shared request wrapper

```js
const BASE = 'https://openlibrary.org'
const COVERS = 'https://covers.openlibrary.org'
```

Now the wrapper. Read it slowly; every line is doing a job you will be asked about:

- `AbortController` + `setTimeout` = a request that cannot hang forever.
- `clearTimeout` in `finally` = the timer never fires after a successful response.
- `response.ok` is `false` for 404/500 *without* throwing, so you must check it yourself.
  `fetch` only rejects on *network* failure, never on HTTP error status.
- Status-specific messages mean the user learns something.
- `A TypeError from fetch` means offline/DNS/CORS — the message says "are you online?"
  because that is the only thing the user can act on.

{{src/api/openLibrary.js}}

**What to notice, and what to say in the report:**

1. `normaliseWork` turns `/works/OL893414W` into `OL893414W` and `cover_i` into `coverId`.
   Every component downstream works with `book.title`, `book.coverId`, `book.rating` —
   names *you* chose. If Open Library ever renames a field, you edit one function.
2. `??` (nullish coalescing) and `?.` (optional chaining) are doing the defensive work:
   `doc.author_name ?? []` means "missing authors" is an empty array, not `undefined`, so
   `book.authors.length` cannot crash. Watch for the third search result in the demo data —
   a book with no author, no cover and no rating is a normal Open Library record.
3. `cleanText` exists because real descriptions arrive with `\r\n`. Without it, splitting
   on `\n` produces empty paragraphs. I found this while testing against real responses,
   and it is a good concrete example for the reflection section of your report.
4. `getBook` calls **two** endpoints with `Promise.all`. The work endpoint has the
   description; the search index has the rating. `Promise.all` means the slower of the two
   dictates the wait — not the sum.
5. `getFeaturedShelves` fires six subject searches in parallel and labels each shelf.
   Sequential `for` + `await` would take six times as long.

## 6.3 Test the layer before you build UI on it

You do not need a test framework yet. A throwaway script in the project root, run with
`node`, is enough:

```js
// scratch/api-check.mjs   (delete before submitting, or move into tests/)
import { searchBooks, getBook, getAuthor, getFeaturedShelves } from '../src/api/openLibrary.js'

const search = await searchBooks('dune')
console.log('total:', search.total)
console.log('first:', search.works[0])

const book = await getBook('OL893414W')
console.log('book:', book.title, book.year, book.rating, book.authorIds)

const author = await getAuthor('OL79034A')
console.log('author:', author.name, author.photoId)

const shelves = await getFeaturedShelves(2)
console.log('shelves:', shelves.map((shelf) => `${shelf.label} (${shelf.works.length})`))

try {
  await getBook('NOT-A-REAL-ID')
} catch (error) {
  console.log('error message the user would see:', error.message)
}
```

Run it with `node scratch/api-check.mjs`. Node 20+ can import `.js` modules directly. If you
see the fields you expect, your whole app is now built on solid ground. If a field is
`undefined`, fix the mapping **now**, not after three screens depend on it.

```bash
git add -A
git commit -m "feat: add open library api layer with normalisation, timeouts and friendly errors"
```

---

# Part 7 — One data-fetching hook (and two providers)

Every screen needs the same three things: **data**, **error**, **loading**. If you write
`useState` + `useEffect` + `try/catch/finally` five times, you will eventually forget
`finally` in one of them and ship a spinner that never stops. Write it once.

## 7.1 `useFetch`

{{src/hooks/useFetch.js}}

Three subtleties that separate "works" from "works well":

- **`fnRef`** holds the latest function. Without it, an inline arrow function
  (`() => getBook(id)`) is a *new* function on every render, so a naive
  `useEffect(..., [fn])` would refetch forever. `deps` is the honest dependency list.
- **`cancelled`** prevents the classic React warning *"state update on an unmounted
  component"* when a user navigates away mid-request.
- **`reload`** is a counter, not a refetch function. Bumping it re-runs the effect. That is
  what your "Try again" buttons call.

> Why not React Query / SWR? They are excellent and I would use one on a bigger app, but
> they add a caching model you would then have to explain. Twenty lines you understand beat
> a library you do not. Say exactly this in the report — it is a *design decision*, which
> is what the reflection asks for.

## 7.2 `useReadingList` — state that survives a reload

This is what makes screen 5 more than a list. It is `useState` + `localStorage`, written
defensively.

{{src/hooks/useReadingList.js}}

Details that matter: reads happen **once** inside `useState(readStored)` (not in an effect,
so there is no flash of empty state); every `try/catch` protects against private-browsing
mode where `localStorage` throws; the `storage` event keeps two open tabs in sync; `ids`
is a `Set` so `ids.has(id)` is O(1) inside a card list of 24 items.

> **Why not `useReducer`?** The actions are one-liners over an array. `useReducer` would add
> indirection for no gain. If you later add re-ordering, filters and notes, switch — and say
> so in the reflection.

## 7.3 Two contexts, two different jobs

The reading list must be reachable from the navbar badge, every card, the detail page and
the list page. Passing it down as props through five levels is the prop-drilling problem
the course talks about; a context solves it. The featured shelves are cached in a second
context so Home does not refetch when you navigate back to it.

{{src/context/AppProviders.jsx}}

Note two habits:

- **The guard in the hook** (`if (!context) throw`) turns "I forgot the provider" into a
  clear error message instead of `Cannot read properties of null`.
- **`toggle` is wrapped in `useCallback`** because it goes into every card and into the
  context value; without it, every card re-renders when anything in the provider changes.

> **Splitting contexts** (`ReadingListContext` and `ShelvesContext` in one file) means a
> shelf load does not re-render the whole tree. That is a real optimisation you can point
> at, rather than a claim about "using context for performance".

```bash
git add -A
git commit -m "feat: add useFetch and useReadingList hooks plus reading-list and shelves contexts"
```

---

# Part 8 — Reusable UI components

Three components carry the whole app's look and its states. Build them before the screens.
You will write each file once and use it twenty times.

## 8.1 `BookCard` and `CoverImage`

{{src/components/BookCard.jsx}}

Things to notice:

- **`CoverImage` handles a real failure mode.** Open Library has cover ids that 404. An
  `<img>` with a broken `src` shows a torn-image icon, which looks broken. The `onError`
  handler swaps in a typographic fallback with the book's initial, so a missing cover looks
  *designed*.
- **`loading="lazy"`** defers off-screen covers. With 24 covers per page this is the
  difference between a snappy grid and a stutter.
- **`alt` text is meaningful**, and when there is no image the fallback is
  `aria-hidden` — because the title is already right below it. Duplicated announcements are
  an accessibility bug.
- **The Save button uses `aria-pressed`** and changes its label. A screen-reader user hears
  the state ("pressed"), not just a colour change. Colour alone is never enough.

## 8.2 The three states every data screen must have

{{src/components/StateViews.jsx}}

This file is the rubric's "clear and user-friendly feedback" line made concrete:

| State | Component | What the user sees |
| --- | --- | --- |
| Loading | `BookGridSkeleton` | Card-shaped placeholders, so the layout does not jump when data lands |
| Empty | `EmptyState` | "No books matched" + a suggestion + a way out |
| Error | `ErrorState` | A plain-English message + a **Try again** button |

Two decisions to defend in your report: a **skeleton instead of a spinner** on grids,
because it communicates *what* is coming and prevents layout shift; and **never exposing a
raw error object**, because `TypeError: Failed to fetch` is not a sentence. The API layer
already converted errors into English, so `ErrorState` just prints `error.message`.

> Accessibility note: the error panel is `role="alert"`, so assistive technology announces
> it as soon as it appears. The skeleton is `aria-hidden` so it is not read out.

```bash
git add -A
git commit -m "feat: add book card, cover fallback and loading/empty/error state components"
```

---
