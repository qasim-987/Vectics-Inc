import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import { ArrowRight, Search } from 'react-bootstrap-icons'
import { useReadingListContext, useShelves } from '../context/AppProviders'
import { BookCard, CoverImage } from '../components/BookCard'
import { BookGridSkeleton, ErrorState } from '../components/StateViews'
import { SHELF_SUBJECTS } from '../api/openLibrary'

export default function HomePage() {
  const { shelves, error, loading, reload } = useShelves()
  const { ids, toggle } = useReadingListContext()
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  function handleSubmit(event) {
    event.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return
    navigate(`/explore?q=${encodeURIComponent(trimmed)}`)
  }

  return (
    <>
      <section className="hero">
        <Container>
          <p className="hero__eyebrow">Powered by Open Library · 40 million+ records</p>
          <h1 className="hero__title">
            Find the book you
            <br />
            did not know you wanted.
          </h1>
          <p className="hero__lead">
            Search the Open Library catalogue, follow authors, and keep a reading list that
            survives your browser restarts.
          </p>

          <Form className="hero__search" onSubmit={handleSubmit} role="search">
            <Form.Label visuallyHidden>Search for a book</Form.Label>
            <div className="hero__search-row">
              <Search className="hero__search-icon" aria-hidden="true" />
              <Form.Control
                type="search"
                size="lg"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Title, author or subject — try “Le Guin”"
              />
              <Button type="submit" variant="primary" size="lg">
                Search
              </Button>
            </div>
          </Form>

          <div className="hero__moods">
            <span className="text-body-secondary small me-2">In the mood for</span>
            {SHELF_SUBJECTS.map((subject) => (
              <Link
                key={subject.slug}
                to={`/explore?q=subject%3A${subject.slug}`}
                className="mood-chip"
              >
                {subject.label}
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <Container className="py-5">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <h2 className="h3 mb-1">Browse the shelves</h2>
            <p className="text-body-secondary mb-0">Fresh picks from four subjects, straight from the API.</p>
          </div>
          <Link to="/explore" className="btn btn-outline-primary d-none d-sm-inline-flex">
            Explore all <ArrowRight className="ms-2" aria-hidden="true" />
          </Link>
        </div>

        {error && <ErrorState error={error} onRetry={reload} title="Could not load the shelves" />}
        {loading && <BookGridSkeleton count={4} />}

        {!loading &&
          !error &&
          shelves.map((shelf) => (
            <section key={shelf.slug} className="shelf mb-5">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="h5 mb-0">{shelf.label}</h3>
                <Link to={`/explore?q=subject%3A${shelf.slug}`} className="link-primary small">
                  See all
                </Link>
              </div>
              <div className="shelf__row">
                {shelf.works.slice(0, 6).map((book) => (
                  <Link key={book.id} to={`/book/${book.id}`} className="shelf__item">
                    <CoverImage coverId={book.coverId} title={book.title} size="M" />
                    <span className="shelf__caption">{book.title}</span>
                  </Link>
                ))}
              </div>
            </section>
          ))}

        {!loading && !error && (
          <Row className="g-4 mt-2">
            <Col lg={8}>
              <div className="callout">
                <h2 className="h5">Two ways to search</h2>
                <p className="mb-2">
                  <strong>Free text</strong> searches titles, authors and subjects at once. It is
                  what the hero search box does.
                </p>
                <p className="mb-0">
                  <strong>Subject</strong> queries like <code>subject:poetry</code> browse a whole
                  category. Use the mood chips above to try one.
                </p>
              </div>
            </Col>
            <Col lg={4}>
              <BookCard
                book={{
                  id: 'OL893414W',
                  title: 'Dune',
                  authors: ['Frank Herbert'],
                  year: 1965,
                  coverId: 11481354,
                  rating: 4.31,
                }}
                isSaved={ids.has('OL893414W')}
                onToggleSaved={toggle}
              />
            </Col>
          </Row>
        )}
      </Container>
    </>
  )
}
