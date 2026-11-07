# Final Project Guide — Web Application with React

Everything your friend needs to build and submit the final project (40% of the course grade,
due 13 November 2026).

## What is in this folder

| File | What it is |
| --- | --- |
| **`Final-Project-Guide.pdf`** | The printable guide, 61 pages. Start here. |
| `Final-Project-Guide.md` | The same guide as Markdown, if you want to copy code out of it. |
| `reference-app/` | The finished reference application (*Shelf*, an Open Library book app) that every code block in the guide comes from. Run it, read it, then build your own. |
| `parts/`, `build.py`, `make_pdf.py` | How the guide is assembled and rendered. Ignore unless you want to edit it. |

## How to use it

1. Read **Part 0–2** of the PDF (about an hour, mostly thinking and sketching). Decide the
   topic and the three screens *before* writing code.
2. Work through **Parts 3–13** in order. Each part creates files, then commits.
3. **Part 14–15** is polish and testing, **16–17** is deployment and README.
4. **Part 18–20** is the report, the ZIP, and the rubric self-check.

Every part ends with a `git commit` command — roughly 20 commits over the project, which is
what the "version control reflects the development process" line is asking for.

## Try the reference app first

```bash
cd reference-app
npm install
npm run dev      # http://localhost:5173
npm test         # 10 component tests
npm run build    # production build
```

It needs Node 20.19+ or 22.12+. The app is the completed version of everything in the guide:
five screens, live Open Library data, loading/empty/error states, a saved reading list with
CSV export, keyboard support and a responsive layout.

## Two warnings before you start

- **Do not hand in the reference app.** It is a worked example of the *shape* of a good
  project. The report asks for concrete decisions from your own code, the reflection asks what
  *you* found difficult, and the AI statement asks what *you* did — none of that can be
  borrowed. Change the topic or change the app substantially, and write your own copy and
  design, so every sentence in the report is true.
- **Deploy on day one, even if it is ugly.** Push the empty Vite app to GitHub Pages first
  (Part 16 gives the three settings). A live URL with three screens beats a beautiful project
  sitting on a laptop at 23:58.

## If there are only two days left

Jump to **"If you only have two days"** at the end of Part 20. It is a priority-ordered plan
that still hits every pass criterion.
