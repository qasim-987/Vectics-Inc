import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Image } from 'react-bootstrap'
import { coverUrl } from '../api/openLibrary'

/**
 * A cover image with a graceful fallback. Open Library returns 404 for some
 * cover ids, and the URL alone cannot tell us, so we listen for onError.
 */
export function CoverImage({ coverId, title, size = 'M', className = '' }) {
  const [failed, setFailed] = useState(false)
  const src = coverUrl(coverId, size)

  if (!src || failed) {
    return (
      <div className={`cover-fallback ${className}`} aria-hidden="true">
        <span>{title?.slice(0, 1) ?? '?'}</span>
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={`Cover of ${title}`}
      loading="lazy"
      className={className}
      onError={() => setFailed(true)}
    />
  )
}

export function BookCard({ book, onToggleSaved, isSaved }) {
  return (
    <article className="book-card h-100">
      <Link to={`/book/${book.id}`} className="book-card__cover" aria-label={`Open ${book.title}`}>
        <CoverImage coverId={book.coverId} title={book.title} className="book-card__image" />
      </Link>

      <div className="book-card__body">
        <h3 className="book-card__title">
          <Link to={`/book/${book.id}`}>{book.title}</Link>
        </h3>
        <p className="book-card__meta text-truncate">
          {book.authors.length ? book.authors.join(', ') : 'Unknown author'}
          {book.year ? ` · ${book.year}` : ''}
        </p>

        <div className="d-flex align-items-center justify-content-between gap-2 mt-2">
          <span className="book-card__rating">
            {book.rating ? `★ ${book.rating}` : 'Not rated'}
          </span>
          <button
            type="button"
            className={`btn btn-sm ${isSaved ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => onToggleSaved(book)}
            aria-pressed={isSaved}
          >
            {isSaved ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>
    </article>
  )
}
