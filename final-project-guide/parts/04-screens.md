# Part 9 — Screen 1: Home (browse)

Purpose in one sentence: *the user gets inspired and jumps somewhere, without needing to
know what to type.*

The Home screen is not a search box with decoration. It has three genuinely different jobs:
a hero with a primary action, **editorial shelves** the user did not ask for, and a footer
that credits the data source. It is the only screen that fires several requests at once.

## 9.1 The page

{{src/pages/HomePage.jsx}}

## 9.2 What each block is doing

**The hero form.** A real `<Form>` with `onSubmit`, so pressing Enter works and so the
browser does not reload. The label is `visuallyHidden` — sighted users get the placeholder,
screen-reader users get a name. `role="search"` on the form is a landmark, so keyboard users
can jump straight to it.

**The mood chips.** They are `<Link>`s, not buttons, because they navigate. Each one goes to
`/explore?q=subject:fantasy` — and `encodeURIComponent` is doing real work there: an
unencoded `:` or space in a query string is how "my search works on my machine" happens.
Reuse `SHELF_SUBJECTS` from the API module instead of a second hard-coded array; two lists
drift apart within a week.

**The shelves.** One horizontal scroller per subject, each `grid-auto-flow: column` with
`scroll-snap-type: x mandatory` (Part 14). On desktop it scrolls with the trackpad, on
mobile with a thumb, and there is no carousel JavaScript to break. `slice(0, 6)` keeps the
first paint light.

**The 8/4 split at the bottom.** `Col lg={8}` + `Col lg={4}` shows off the grid without
looking like a template, and it collapses to a single column on phones.

**A caveat worth understanding.** The demo `BookCard` in the last row is fed a hard-coded
object. It exists so the layout has something in the second column before you build the
reading list. Replace it with a real component (a "Because you saved…" row) once you can,
and if you leave it in, do not pretend in the report that it is API data. Honesty is
graded in the AI statement, and it is noticed everywhere.

## 9.3 The loading path you should test right now

1. Open DevTools → Network → throttle to **Slow 3G**.
2. Reload Home. You should see shimmering card skeletons, then cover rows.
3. Throttle to **Offline**, reload. You should see the friendly error panel and a working
   **Try again**.
4. Go back online, press **Try again**. The shelves appear without a reload.

If step 3 shows a blank page, `ErrorState` is not wired into the `error` branch. That is
the single most common lost-mark bug in this assignment.

```bash
git add -A
git commit -m "feat(home): hero search, subject chips and parallel featured shelves"
```

---

# Part 10 — Screen 2: Explore (search, sort, filter, paginate)

Purpose: *the user finds a specific book through a query, and can share or bookmark that
exact query.*

This is the most feature-dense screen and the one that will earn the most UX marks if you
get one architectural idea right: **the URL is the state**.

## 10.1 Why the URL is the state

If you keep search, sort and page in `useState`, you lose all of this for free:

- the back button (it leaves the site instead of undoing the search);
- refreshing the page (you land on an empty form);
- sharing a result (`"look what I found"` → your friend lands on the home page);
- deep-linking from the Home hero and the author page.

`useSearchParams` makes the query string the single source of truth. Typing updates a local
`draft`; **submitting** writes to the URL; the effect reacts to the URL. One consequence
worth spelling out: the search does not fire on every keystroke (no debounce needed, no
request storm), it fires when the user says so. Mention that trade-off in the report:
*"a live-search would need a 300 ms debounce; a submit-based search made the request
behaviour predictable and kept the URL meaningful."*

## 10.2 The page

{{src/pages/ExplorePage.jsx}}

## 10.3 The five details an examiner will notice

1. **`ignore` flag.** Type two searches quickly on a slow connection: the older response
   can arrive *after* the newer one and overwrite the results with stale data. The flag
   discards any response from a run that is no longer current. This is called a race
   condition, it is real, and being able to explain it is worth more than a feature.
2. **Syncing the input during render.** When the URL changes from outside (a chip, the
   navbar dialog, a link), the input must show the new query. The commented pattern here
   (`if (query !== syncedQuery) setSyncedQuery(query)`) is React's documented alternative to
   calling `setState` inside an effect to mirror a prop, which causes a second render pass.
   If you find this confusing, an effect works too — but then remove the `syncedQuery`
   state and just do `useEffect(() => setDraft(query), [query])`.
3. **The total count.** `48,280 results for "dune"` (`toLocaleString`) tells the user the
   query *worked* even if their book is on page 40. Without it, an aggressive search feels
   like a failure.
4. **Pagination is bounded.** `Math.min(Math.ceil(total / 24), 50)` — Open Library will not
   page forever, and preventing "page 9,999" saves a confusing error. `updateParams` deletes
   parameters that are empty instead of writing `sort=`, which keeps URLs clean and
   comparable.
5. **The empty state earns its keep.** It is not just "nothing found"; it explains the
   *reason* when the client-side "Covers only" filter is the culprit, and offers a way out.

## 10.4 The toolbar is a separate visual component, not a separate file

The toolbar is a `Grid` in CSS (`Part 14`) that becomes one column on phones. On a phone the
search field takes the full width, the sort select sits beside the toggle, and the Search
button goes full width. No horizontal scrolling, no overflow.

Test it: DevTools → device toolbar → **iPhone SE (375 px)**. Nothing should scroll sideways.

```bash
git add -A
git commit -m "feat(explore): url-driven search with sort, covers filter and bounded pagination"
```

---

# Part 11 — Screen 3: Book detail

Purpose: *the user decides whether to read this specific book.* It is not a bigger card; it
is the screen where the two-endpoint merge, the description formatting, the author lookup
and the "add to list" action live.

## 11.1 The page

{{src/pages/BookPage.jsx}}

## 11.2 The three ideas worth understanding here

**`Promise.all` inside the API layer, not in the component.** `getBook(id)` hides the fact
that there are two requests. The component asks one question and gets one answer — and the
detail screen cannot accidentally render "rating: loading" next to "description: loaded".

```
Component              getBook(id)                     Open Library
    |                       |                                |
    |--- getBook(id) ------>|--- GET /works/{id}.json ------>|
    |                       |<-- title, description, covers -|
    |                       |--- GET /search.json?q=key:"…" ->|
    |                       |<-- rating, year, editions -----|
    |<-- one merged object -|
```

**A route parameter is a prop.** `useParams()` gives you `id`; `useFetch(() => getBook(id), [id])`
refetches when the route changes. Navigate from one book to a related book and the page
updates without a full remount.

**`AuthorCard` loads its own data.** The author's *name* requires a second request (the work
endpoint only gives author ids). If `BookPage` awaited it, the whole page would wait for
data it does not show until a tab is clicked. A self-contained child component means each
author card has its own tiny loading state. This is the pattern to describe as "separating
concerns" in the report — with this exact example.

## 11.3 The honest empty states

Genuine Open Library records are missing descriptions and have no authors. Both are handled:
the description tab explains *why* it is empty ("volunteers add them gradually"), the
authors tab says "No author is recorded for this work." An examiner clicking a random
obscure book is the most likely way your app gets tested — make that case look intentional
rather than broken.

> **Tabs** (`Tab.Container` / `Tab.Pane` from react-bootstrap) are a functionality-library
> win: they come with `role="tab"`, `aria-selected`, and keyboard handling wired up. You
> could not hand-roll this correctly in ten minutes.

```bash
git add -A
git commit -m "feat(book): detail screen merging work and search endpoints, authors tab"
```

---

# Part 12 — Screen 4: Author page

Purpose: *the user explores one person's body of work, sorted the way they want.*

Why this is a different screen from Book detail, in one sentence: the book screen answers
"should I read this?", the author screen answers "what else has this person written that I
might like?" — different question, different data, different actions (no save button on the
author; a sort control instead).

## 12.1 The page

{{src/pages/AuthorPage.jsx}}

## 12.2 Details worth pointing at

- **`/authors/{id}/works.json` is the wrong endpoint here.** It returns works with no
  ratings and no covers. `searchByAuthor` (`q=author_key:OL79034A&sort=rating`) returns the
  same books *with* covers, years and ratings. Choosing the endpoint that returns what the
  UI needs is an API-integration skill; say so in the report.
- **Client-side sorting of up to 40 items** is instant and costs nothing, versus three more
  API calls. Sorting a *server* list of thousands would not be acceptable — knowing where
  the line is, is the point.
- **The biography is clamped with CSS** (`-webkit-line-clamp`), with a real "Read full
  biography" toggle that sets `aria-expanded`. Some author bios are 3,000 words.
- **`Col xs="auto"`** keeps the portrait from collapsing on small screens; the name column
  takes the rest. It is a one-line responsive decision that looks deliberate.

```bash
git add -A
git commit -m "feat(author): author screen with portrait, biography and sortable works"
```

---

# Part 13 — Screen 5: Reading list (a personal collection)

Purpose: *the user keeps what they chose, and can take it elsewhere.*

This screen is what proves your app is a *product* rather than an API viewer. It also gives
you the "interactive feature" a report needs, and it works entirely offline — an examiner
who opens it with the network disabled still sees a working screen.

## 13.1 The page

{{src/pages/ReadingListPage.jsx}}

## 13.2 What it demonstrates

| Element | Skill it shows |
| --- | --- |
| `localStorage` persistence | State management beyond `useState`, defensive coding |
| Responsive swap: table ↔ cards | `d-none d-lg-block` / `d-lg-none d-lg-block` — the same data, two presentations, no horizontal scroll on phones |
| `ProgressBar` against a 24-book goal | A derived value (`count / YEAR_GOAL`) and a library component used for a real purpose |
| Average rating, oldest book | `useMemo` for derived data over a list |
| **Filter field** | Local filtering, distinct from the API search — a different feature on a different screen |
| **Export CSV** | Building a `Blob`, an object URL, and a programmatic download — no server, no library |
| **Clear with a confirmation `Modal`** | Destructive actions need a confirm step; the modal traps focus for free |

The CSV export is worth ten lines of your report: it is the "functionality library plus
real feature" combination that reads as thought rather than tutorial-following.

```jsx
const csv = rows.map((row) => row.map(escape).join(',')).join('\n')
const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
const url = URL.createObjectURL(blob)
const link = document.createElement('a')
link.href = url
link.download = 'shelf-reading-list.csv'
link.click()
URL.revokeObjectURL(url)   // do not leak the object URL
```

Note the `escape` helper: a title containing a comma or a quote breaks a naive CSV. That is a
bug you can name in the reflection.

## 13.3 Three states of this screen

1. **Empty** — a real empty state that tells the user how to fill it (link to Explore).
2. **Populated** — cards on phones, a table on desktop.
3. **Filtered to nothing** — "No saved book matches 'xxx'." — not the same as empty, and
   most students conflate them.

```bash
git add -A
git commit -m "feat(reading-list): saved books with filter, yearly goal, csv export and confirm modal"
```

---
