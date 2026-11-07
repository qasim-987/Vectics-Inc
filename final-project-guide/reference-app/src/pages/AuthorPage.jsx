import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Col, Container, Image, Row, Spinner } from 'react-bootstrap'
import { BoxArrowUpRight, CalendarHeart } from 'react-bootstrap-icons'
import useFetch from '../hooks/useFetch'
import { authorPhotoUrl, getAuthor, searchByAuthor } from '../api/openLibrary'
import { BookCard } from '../components/BookCard'
import { BookGridSkeleton, EmptyState, ErrorState } from '../components/StateViews'
import { useReadingListContext } from '../context/AppProviders'

export default function AuthorPage() {
  const { id } = useParams()
  const { data: author, error, loading, reload } = useFetch(() => getAuthor(id), [id])
  const { data: works, error: worksError, loading: worksLoading } = useFetch(
    () => searchByAuthor(id, 40),
    [id],
  )
  const { ids, toggle } = useReadingListContext()
  const [expanded, setExpanded] = useState(false)
  const [sortBy, setSortBy] = useState('rating')

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading author…</span>
        </Spinner>
      </Container>
    )
  }

  if (error) {
    return (
      <Container className="py-5">
        <ErrorState error={error} onRetry={reload} title="Could not load this author" />
      </Container>
    )
  }

  const bio = author.bio ?? ''
  const sortedWorks = [...(works?.works ?? [])].sort((a, b) => {
    if (sortBy === 'a-z') return a.title.localeCompare(b.title)
    if (sortBy === 'year') return (a.year ?? 9999) - (b.year ?? 9999)
    return (b.rating ?? 0) - (a.rating ?? 0)
  })

  return (
    <>
      <section className="author-hero">
        <Container>
          <Row className="align-items-center g-4">
            <Col xs="auto">
              {author.photoId ? (
                <Image
                  src={authorPhotoUrl(author.photoId)}
                  alt={author.name}
                  roundedCircle
                  className="author-hero__photo"
                />
              ) : (
                <div className="author-hero__photo author-hero__photo--empty" aria-hidden="true">
                  {author.name.slice(0, 1)}
                </div>
              )}
            </Col>
            <Col>
              <h1 className="h2 mb-1">{author.name}</h1>
              <p className="text-body-secondary mb-2">
                <CalendarHeart className="me-2" aria-hidden="true" />
                {[author.birthDate, author.deathDate].filter(Boolean).join(' – ') || 'Dates unknown'}
                {works?.total ? ` · ${works.total} works` : ''}
              </p>
              {author.links.length > 0 && (
                <div className="d-flex flex-wrap gap-3">
                  {author.links.map((link) => (
                    <a key={link.url} href={link.url} target="_blank" rel="noreferrer" className="small">
                      {link.title} <BoxArrowUpRight aria-hidden="true" />
                    </a>
                  ))}
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </section>

      <Container className="py-5">
        {bio && (
          <div className="author-bio mb-5">
            <h2 className="h5 mb-2">About</h2>
            <p className={`mb-2 ${expanded ? '' : 'author-bio__clamped'}`}>{bio}</p>
            {bio.length > 420 && (
              <button
                type="button"
                className="btn btn-link btn-sm p-0"
                onClick={() => setExpanded((value) => !value)}
                aria-expanded={expanded}
              >
                {expanded ? 'Show less' : 'Read full biography'}
              </button>
            )}
          </div>
        )}

        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
          <h2 className="h4 mb-0">Works</h2>
          <div className="btn-group btn-group-sm" role="group" aria-label="Sort works">
            {[
              { value: 'rating', label: 'Top rated' },
              { value: 'year', label: 'Oldest first' },
              { value: 'a-z', label: 'A–Z' },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                className={`btn ${sortBy === option.value ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setSortBy(option.value)}
                aria-pressed={sortBy === option.value}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {worksLoading && <BookGridSkeleton count={8} />}
        {worksError && <ErrorState error={worksError} title="Could not load this author's works" />}
        {!worksLoading && !worksError && sortedWorks.length === 0 && (
          <EmptyState
            title="No works recorded"
            message="Open Library does not list any works for this author yet."
            action={
              <Link to="/explore" className="btn btn-outline-primary">
                Search somewhere else
              </Link>
            }
          />
        )}

        {!worksLoading && !worksError && sortedWorks.length > 0 && (
          <Row xs={2} md={3} lg={4} className="g-4">
            {sortedWorks.map((book) => (
              <Col key={book.id}>
                <BookCard book={book} isSaved={ids.has(book.id)} onToggleSaved={toggle} />
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </>
  )
}
