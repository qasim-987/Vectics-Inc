import { Button, Col, Row, Spinner } from 'react-bootstrap'
import { ArrowClockwise, ExclamationTriangle, Search } from 'react-bootstrap-icons'

/** Skeleton grid shown while books are loading. */
export function BookGridSkeleton({ count = 12 }) {
  return (
    <Row xs={2} md={3} lg={4} className="g-4" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <Col key={index}>
          <div className="skeleton-card">
            <div className="skeleton skeleton--cover" />
            <div className="skeleton skeleton--line" />
            <div className="skeleton skeleton--line short" />
          </div>
        </Col>
      ))}
    </Row>
  )
}

/** Small inline spinner for buttons and toolbar areas. */
export function InlineSpinner({ label = 'Loading' }) {
  return (
    <span className="d-inline-flex align-items-center gap-2 text-body-secondary small">
      <Spinner animation="border" size="sm" role="status" />
      {label}
    </span>
  )
}

/** Friendly error panel with a retry button. Never show a raw stack trace. */
export function ErrorState({ error, onRetry, title = 'Something went wrong' }) {
  return (
    <div className="state-panel state-panel--error" role="alert">
      <ExclamationTriangle size={28} aria-hidden="true" />
      <h2 className="h5 mb-1">{title}</h2>
      <p className="mb-3">{error?.message ?? 'An unexpected error happened.'}</p>
      {onRetry && (
        <Button variant="outline-primary" onClick={onRetry}>
          <ArrowClockwise className="me-2" aria-hidden="true" />
          Try again
        </Button>
      )}
    </div>
  )
}

/** Shown when a search returns zero results. */
export function EmptyState({ title = 'No books found', message, action }) {
  return (
    <div className="state-panel">
      <Search size={28} aria-hidden="true" />
      <h2 className="h5 mb-1">{title}</h2>
      <p className="mb-3 text-body-secondary">{message}</p>
      {action}
    </div>
  )
}
