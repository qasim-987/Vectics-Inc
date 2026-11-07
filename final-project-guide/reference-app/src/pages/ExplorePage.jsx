import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Button, Col, Container, Form, Pagination, Row } from 'react-bootstrap'
import { Search, XCircle } from 'react-bootstrap-icons'
import { searchBooks } from '../api/openLibrary'
import { BookCard } from '../components/BookCard'
import { BookGridSkeleton, EmptyState, ErrorState, InlineSpinner } from '../components/StateViews'
import { useReadingListContext } from '../context/AppProviders'

const SORTS = [
  { value: '', label: 'Best match' },
  { value: 'rating', label: 'Highest rated' },
  { value: 'new', label: 'Newest' },
  { value: 'old', label: 'Oldest' },
]

const SUGGESTIONS = ['Ursula K. Le Guin', 'subject:poetry', 'artificial intelligence', 'Toni Morrison']

export default function ExplorePage() {
  // The URL is the single source of truth for the search state. That makes
  // results shareable, bookmarkable, and the back button keeps working.
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? 'dune'
  const sort = params.get('sort') ?? ''
  const page = Math.max(Number(params.get('page')) || 1, 1)

  const [draft, setDraft] = useState(query)
  const [result, setResult] = useState({ works: [], total: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [coversOnly, setCoversOnly] = useState(false)

  const { ids, toggle } = useReadingListContext()

  // Keep the input in sync when the URL changes from outside (a chip, a link…).
  // Adjusting state during render is the React-recommended alternative to an
  // effect that would cause a second render pass.
  const [syncedQuery, setSyncedQuery] = useState(query)
  if (query !== syncedQuery) {
    setSyncedQuery(query)
    setDraft(query)
  }

  useEffect(() => {
    // This effect runs when the URL changes, not on every keystroke in the box.
    // `ignore` stops a slower, older response from overwriting a newer one.
    let ignore = false

    async function run() {
      setLoading(true)
      setError(null)
      try {
        const data = await searchBooks(query, { page, sort })
        if (!ignore) setResult(data)
      } catch (err) {
        if (!ignore) setError(err)
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    run()
    return () => {
      ignore = true
    }
  }, [query, page, sort, reloadKey])

  const visibleWorks = useMemo(
    () => (coversOnly ? result.works.filter((work) => work.coverId) : result.works),
    [result.works, coversOnly],
  )

  const totalPages = Math.min(Math.ceil(result.total / 24), 50)

  function updateParams(patch) {
    const next = new URLSearchParams(params)
    Object.entries(patch).forEach(([key, value]) => {
      if (value) next.set(key, String(value))
      else next.delete(key)
    })
    setParams(next)
  }

  function handleSubmit(event) {
    event.preventDefault()
    const trimmed = draft.trim()
    if (!trimmed) return
    updateParams({ q: trimmed, page: 1 })
  }

  return (
    <Container className="py-5">
      <header className="mb-4">
        <h1 className="h2 mb-1">Explore the catalogue</h1>
        <p className="text-body-secondary mb-0">
          Type anything: a title, an author, or <code>subject:fantasy</code> to browse a category.
        </p>
      </header>

      <Form onSubmit={handleSubmit} role="search" className="explore-toolbar">
        <div className="explore-toolbar__search">
          <Search aria-hidden="true" />
          <Form.Control
            type="search"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Search books…"
            aria-label="Search books"
          />
          {draft && (
            <button
              type="button"
              className="btn btn-link btn-sm text-body-secondary"
              onClick={() => setDraft('')}
              aria-label="Clear search"
            >
              <XCircle aria-hidden="true" />
            </button>
          )}
        </div>

        <Form.Select
          aria-label="Sort results"
          value={sort}
          onChange={(event) => updateParams({ sort: event.target.value, page: 1 })}
          className="explore-toolbar__sort"
        >
          {SORTS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Form.Select>

        <Form.Check
          type="switch"
          id="covers-only"
          label="Covers only"
          checked={coversOnly}
          onChange={(event) => setCoversOnly(event.target.checked)}
        />

        <Button type="submit" variant="primary">
          Search
        </Button>
      </Form>

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 my-4">
        <p className="mb-0">
          {loading ? (
            <InlineSpinner label="Searching Open Library…" />
          ) : error ? (
            <span className="text-danger">Search failed</span>
          ) : (
            <>
              <strong>{result.total.toLocaleString()}</strong> results for{' '}
              <strong>“{query}”</strong>
              {result.total > 0 && (
                <span className="text-body-secondary"> · page {page} of {totalPages}</span>
              )}
            </>
          )}
        </p>

        {!loading && !error && (
          <div className="d-flex gap-2 flex-wrap">
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                className="btn btn-sm btn-outline-secondary rounded-pill"
                onClick={() => {
                  setDraft(suggestion)
                  updateParams({ q: suggestion, page: 1 })
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <ErrorState
          error={error}
          title="We could not run that search"
          onRetry={() => setReloadKey((key) => key + 1)}
        />
      )}

      {loading && <BookGridSkeleton count={12} />}

      {!loading && !error && visibleWorks.length === 0 && (
        <EmptyState
          title="No books matched"
          message={
            coversOnly
              ? 'Nothing with a cover here. Turn off “Covers only”, or try a different search.'
              : 'Try a shorter query, a different spelling, or browse a subject instead.'
          }
          action={
            <Link to="/explore?q=subject%3Afantasy" className="btn btn-outline-primary">
              Browse fantasy instead
            </Link>
          }
        />
      )}

      {!loading && !error && visibleWorks.length > 0 && (
        <Row xs={2} md={3} lg={4} className="g-4">
          {visibleWorks.map((book) => (
            <Col key={book.id}>
              <BookCard book={book} isSaved={ids.has(book.id)} onToggleSaved={toggle} />
            </Col>
          ))}
        </Row>
      )}

      {!loading && !error && totalPages > 1 && (
        <Pagination className="justify-content-center mt-5">
          <Pagination.Prev
            disabled={page <= 1}
            onClick={() => {
              updateParams({ page: page - 1 })
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          />
          <Pagination.Item active>{page}</Pagination.Item>
          <Pagination.Next
            disabled={page >= totalPages}
            onClick={() => {
              updateParams({ page: page + 1 })
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          />
        </Pagination>
      )}
    </Container>
  )
}
