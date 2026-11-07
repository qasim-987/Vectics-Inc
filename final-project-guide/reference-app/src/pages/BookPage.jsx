import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Badge, Button, Col, Container, Image, Nav, Row, Spinner, Tab } from 'react-bootstrap'
import { ArrowLeft, BookmarkHeart, BoxArrowUpRight } from 'react-bootstrap-icons'
import useFetch from '../hooks/useFetch'
import { authorPhotoUrl, getAuthor, getBook, searchByAuthor } from '../api/openLibrary'
import { CoverImage } from '../components/BookCard'
import { ErrorState } from '../components/StateViews'
import { useReadingListContext } from '../context/AppProviders'

export default function BookPage() {
  const { id } = useParams()
  const { data: book, error, loading, reload } = useFetch(() => getBook(id), [id])
  const { ids, toggle } = useReadingListContext()

  return (
    <Container className="py-4 py-lg-5">
      <Link to="/explore" className="back-link mb-4">
        <ArrowLeft aria-hidden="true" /> Back to search
      </Link>

      {loading && (
        <div className="d-flex justify-content-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading book…</span>
          </Spinner>
        </div>
      )}

      {error && <ErrorState error={error} onRetry={reload} title="Could not load this book" />}

      {book && (
        <Row className="g-4 g-lg-5">
          <Col md={4} lg={3}>
            <div className="book-detail__cover">
              <CoverImage coverId={book.coverId} title={book.title} size="L" />
            </div>

            <Button
              variant={ids.has(book.id) ? 'primary' : 'outline-primary'}
              className="w-100 mt-3"
              onClick={() => toggle(book)}
              aria-pressed={ids.has(book.id)}
            >
              <BookmarkHeart className="me-2" aria-hidden="true" />
              {ids.has(book.id) ? 'In your reading list' : 'Add to reading list'}
            </Button>

            <a
              className="btn btn-link w-100 mt-1"
              href={`https://openlibrary.org/works/${book.id}`}
              target="_blank"
              rel="noreferrer"
            >
              View on Open Library <BoxArrowUpRight className="ms-1" aria-hidden="true" />
            </a>
          </Col>

          <Col md={8} lg={9}>
            <h1 className="h2 mb-2">{book.title}</h1>

            <p className="book-detail__byline">
              {book.authorIds.length > 0
                ? book.authorIds.slice(0, 3).map((authorId, index) => (
                    <span key={authorId}>
                      {index > 0 && ', '}
                      <AuthorLink authorId={authorId} fallback={book.authors[index]} />
                    </span>
                  ))
                : 'Unknown author'}
              {book.year && <span className="text-body-secondary"> · first published {book.year}</span>}
            </p>

            <div className="book-detail__stats">
              <Stat label="Rating" value={book.rating ? `★ ${book.rating}` : '—'} hint={book.ratingCount ? `${book.ratingCount} ratings` : 'No ratings yet'} />
              <Stat label="Editions" value={book.editionCount} hint="Different printings" />
              <Stat label="Subjects" value={book.subjects.length} hint="In the catalogue" />
            </div>

            <Tab.Container defaultActiveKey="about">
              <Nav variant="underline" className="mb-3">
                <Nav.Item>
                  <Nav.Link eventKey="about">About</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="authors">Authors</Nav.Link>
                </Nav.Item>
              </Nav>

              <Tab.Content>
                <Tab.Pane eventKey="about">
                  {book.description ? (
                    <div className="book-detail__description">
                      {book.description.split('\n').filter(Boolean).map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-body-secondary">
                      Open Library has no description for this work yet. Volunteers add them
                      gradually, so this is common for older or rare books.
                    </p>
                  )}

                  {book.subjects.length > 0 && (
                    <div className="d-flex flex-wrap gap-2 mt-3">
                      {book.subjects.slice(0, 12).map((subject) => (
                        <Badge key={subject} bg="light" text="dark" className="subject-badge">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  )}
                </Tab.Pane>

                <Tab.Pane eventKey="authors">
                  {book.authorIds.length === 0 && (
                    <p className="text-body-secondary">No author is recorded for this work.</p>
                  )}
                  <Row className="g-3">
                    {book.authorIds.map((authorId) => (
                      <Col sm={6} key={authorId}>
                        <AuthorCard authorId={authorId} />
                      </Col>
                    ))}
                  </Row>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </Col>
        </Row>
      )}
    </Container>
  )
}

/**
 * The work endpoint returns author ids but not their names, so the link loads
 * just the name it needs. Small, self-contained, and easy to cache later.
 */
function AuthorLink({ authorId, fallback }) {
  const { data: author } = useFetch(() => getAuthor(authorId), [authorId])
  return <Link to={`/author/${authorId}`}>{author?.name ?? fallback ?? 'Author'}</Link>
}

function Stat({ label, value, hint }) {
  return (
    <div className="stat">
      <span className="stat__label">{label}</span>
      <strong className="stat__value">{value}</strong>
      <span className="stat__hint">{hint}</span>
    </div>
  )
}

/**
 * Loads one author. Kept as its own component so the book page does not have
 * to wait for author data before it can render.
 */
function AuthorCard({ authorId }) {
  const { data: author, loading, error } = useFetch(() => getAuthor(authorId), [authorId])
  const { data: works } = useFetch(() => searchByAuthor(authorId, 40), [authorId])
  const [showFullBio, setShowFullBio] = useState(false)

  if (loading) {
    return (
      <div className="author-card">
        <Spinner animation="border" size="sm" role="status" />
      </div>
    )
  }

  if (error) return <ErrorState error={error} title="Author unavailable" />

  const bio = author.bio ?? ''
  const shortBio = bio.length > 260 ? `${bio.slice(0, 260)}…` : bio

  return (
    <div className="author-card h-100">
      <div className="d-flex gap-3">
        {author.photoId ? (
          <Image
            src={authorPhotoUrl(author.photoId)}
            alt={author.name}
            roundedCircle
            width={56}
            height={56}
            className="author-card__photo"
          />
        ) : (
          <div className="author-card__photo author-card__photo--empty" aria-hidden="true">
            {author.name.slice(0, 1)}
          </div>
        )}

        <div>
          <h3 className="h6 mb-1">
            <Link to={`/author/${author.id}`}>{author.name}</Link>
          </h3>
          <p className="small text-body-secondary mb-1">
            {[author.birthDate, author.deathDate].filter(Boolean).join(' – ') || 'Dates unknown'}
          </p>
          <p className="small mb-1">
            {works?.total ? `${works.total} works in Open Library` : ' '}
          </p>
          <Link to={`/author/${author.id}`} className="small">
            Open author page
          </Link>
        </div>
      </div>

      {bio && (
        <>
          <p className="small mt-3 mb-1">{showFullBio ? bio : shortBio}</p>
          {bio.length > 260 && (
            <button
              type="button"
              className="btn btn-link btn-sm p-0"
              onClick={() => setShowFullBio((value) => !value)}
            >
              {showFullBio ? 'Show less' : 'Read more'}
            </button>
          )}
        </>
      )}
    </div>
  )
}
