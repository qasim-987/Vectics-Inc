import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Col, Container, Form, Modal, ProgressBar, Row, Table } from 'react-bootstrap'
import { BookmarkHeart, Download, Trash3 } from 'react-bootstrap-icons'
import { BookCard } from '../components/BookCard'
import { useReadingListContext } from '../context/AppProviders'

const YEAR_GOAL = 24

export default function ReadingListPage() {
  const { items, clear, remove, count } = useReadingListContext()
  const [filter, setFilter] = useState('')
  const [confirming, setConfirming] = useState(false)

  const filtered = useMemo(() => {
    const needle = filter.trim().toLowerCase()
    if (!needle) return items
    return items.filter(
      (book) =>
        book.title.toLowerCase().includes(needle) ||
        (book.authors ?? []).join(' ').toLowerCase().includes(needle),
    )
  }, [items, filter])

  const averageRating = useMemo(() => {
    const rated = items.filter((book) => book.rating)
    if (rated.length === 0) return null
    return (rated.reduce((sum, book) => sum + book.rating, 0) / rated.length).toFixed(2)
  }, [items])

  /** Export as CSV so the list is portable. Built client-side, no server needed. */
  function exportCsv() {
    const escape = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`
    const rows = [
      ['Title', 'Authors', 'Year', 'Rating', 'Open Library ID'],
      ...items.map((book) => [book.title, (book.authors ?? []).join('; '), book.year, book.rating, book.id]),
    ]
    const csv = rows.map((row) => row.map(escape).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'shelf-reading-list.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  const progress = Math.min(Math.round((count / YEAR_GOAL) * 100), 100)

  return (
    <Container className="py-5">
      <header className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
        <div>
          <h1 className="h2 mb-1">Your reading list</h1>
          <p className="text-body-secondary mb-0">
            {count === 0
              ? 'Nothing saved yet — the list lives in this browser.'
              : `${count} saved ${count === 1 ? 'book' : 'books'}, stored locally in this browser.`}
          </p>
        </div>

        <div className="d-flex gap-2">
          <Button variant="outline-secondary" onClick={exportCsv} disabled={count === 0}>
            <Download className="me-2" aria-hidden="true" />
            Export CSV
          </Button>
          <Button variant="outline-danger" onClick={() => setConfirming(true)} disabled={count === 0}>
            <Trash3 className="me-2" aria-hidden="true" />
            Clear
          </Button>
        </div>
      </header>

      {count > 0 && (
        <Row className="g-3 mb-4">
          <Col md={6}>
            <div className="panel p-3 h-100">
              <p className="small text-body-secondary mb-1">Yearly goal · {YEAR_GOAL} books</p>
              <ProgressBar
                now={progress}
                label={`${progress}%`}
                aria-label={`${progress} percent of your yearly goal`}
                className="mb-2"
              />
              <p className="small mb-0">
                {count >= YEAR_GOAL
                  ? 'Goal reached. Time to raise it.'
                  : `${YEAR_GOAL - count} more to reach your goal.`}
              </p>
            </div>
          </Col>
          <Col md={3}>
            <div className="panel p-3 h-100">
              <p className="small text-body-secondary mb-1">Average rating</p>
              <p className="stat__value mb-0">{averageRating ? `★ ${averageRating}` : '—'}</p>
            </div>
          </Col>
          <Col md={3}>
            <div className="panel p-3 h-100">
              <p className="small text-body-secondary mb-1">Oldest book</p>
              <p className="stat__value mb-0">
                {items.filter((book) => book.year).length
                  ? Math.min(...items.filter((book) => book.year).map((book) => book.year))
                  : '—'}
              </p>
            </div>
          </Col>
        </Row>
      )}

      {count === 0 ? (
        <div className="state-panel">
          <BookmarkHeart size={28} aria-hidden="true" />
          <h2 className="h5 mb-1">Your shelf is empty</h2>
          <p className="mb-3 text-body-secondary">
            Save a book from any card, then come back here to see it.
          </p>
          <Link to="/explore" className="btn btn-primary">
            Find something to read
          </Link>
        </div>
      ) : (
        <>
          <Form className="mb-3" onSubmit={(event) => event.preventDefault()} role="search">
            <Form.Label visuallyHidden>Filter your list</Form.Label>
            <Form.Control
              type="search"
              placeholder="Filter by title or author…"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            />
          </Form>

          {filtered.length === 0 ? (
            <p className="text-body-secondary">No saved book matches “{filter}”.</p>
          ) : (
            <>
              {/* Table on wide screens… */}
              <div className="d-none d-lg-block">
                <Table hover responsive className="align-middle reading-table">
                  <thead>
                    <tr>
                      <th scope="col">Title</th>
                      <th scope="col">Author</th>
                      <th scope="col">Year</th>
                      <th scope="col">Rating</th>
                      <th scope="col">
                        <span className="visually-hidden">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((book) => (
                      <tr key={book.id}>
                        <td>
                          <Link to={`/book/${book.id}`}>{book.title}</Link>
                        </td>
                        <td>{(book.authors ?? []).join(', ') || 'Unknown'}</td>
                        <td>{book.year ?? '—'}</td>
                        <td>{book.rating ? `★ ${book.rating}` : '—'}</td>
                        <td className="text-end">
                          <Button
                            variant="link"
                            size="sm"
                            className="text-danger"
                            onClick={() => remove(book.id)}
                            aria-label={`Remove ${book.title}`}
                          >
                            <Trash3 aria-hidden="true" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {/* …cards on small screens, because a table would need horizontal scrolling. */}
              <Row xs={2} sm={3} className="g-3 d-lg-none">
                {filtered.map((book) => (
                  <Col key={book.id}>
                    <BookCard book={book} isSaved onToggleSaved={() => remove(book.id)} />
                  </Col>
                ))}
              </Row>
            </>
          )}
        </>
      )}

      <Modal show={confirming} onHide={() => setConfirming(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="h5">Clear your reading list?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          This removes all {count} saved books from this browser. It cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirming(false)}>
            Keep them
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              clear()
              setConfirming(false)
            }}
          >
            Clear list
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}
