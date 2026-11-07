import { useEffect, useRef } from 'react'
import { Navbar, Nav, Container, Badge } from 'react-bootstrap'
import { BookHalf, Search } from 'react-bootstrap-icons'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useReadingListContext } from '../context/AppProviders'

/**
 * One navbar for the whole app. The only moving part is a native <dialog>
 * search box that opens with "/" or Ctrl/Cmd+K.
 */
export default function SiteNavbar() {
  const { count } = useReadingListContext()
  const dialogRef = useRef(null)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  function openSearch() {
    dialogRef.current?.showModal()
    // showModal() focuses the first focusable element; be explicit anyway.
    window.setTimeout(() => inputRef.current?.focus(), 0)
  }

  useEffect(() => {
    function onKeyDown(event) {
      const tag = document.activeElement?.tagName
      const isTyping = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT'
      const isShortcut = event.key === '/' || ((event.ctrlKey || event.metaKey) && event.key === 'k')

      if (isShortcut && !isTyping) {
        event.preventDefault()
        openSearch()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  function handleSearchSubmit(event) {
    event.preventDefault()
    const query = inputRef.current.value.trim()
    dialogRef.current?.close()
    if (query) navigate(`/explore?q=${encodeURIComponent(query)}`)
  }

  return (
    <Navbar expand="md" className="site-navbar sticky-top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
          <BookHalf aria-hidden="true" />
          <span>Shelf</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="ms-auto align-items-md-center gap-md-1">
            <Nav.Link as={NavLink} to="/" end>
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/explore">
              Explore
            </Nav.Link>
            <Nav.Link as={NavLink} to="/reading-list">
              Reading list
              {count > 0 && (
                <Badge bg="primary" pill className="ms-2" aria-label={`${count} saved books`}>
                  {count}
                </Badge>
              )}
            </Nav.Link>
            <button type="button" className="btn btn-sm btn-light ms-md-2" onClick={openSearch}>
              <Search className="me-1" aria-hidden="true" />
              Search
            </button>
          </Nav>
        </Navbar.Collapse>
      </Container>

      {/* Native <dialog>: the browser handles Esc, focus trapping and the backdrop. */}
      <dialog ref={dialogRef} className="search-dialog" aria-label="Search books">
        <form className="p-4" onSubmit={handleSearchSubmit}>
          <label htmlFor="nav-search-input" className="form-label fw-semibold">
            Search books, authors, subjects
          </label>
          <input
            id="nav-search-input"
            ref={inputRef}
            type="search"
            className="form-control form-control-lg"
            placeholder="e.g. Ursula K. Le Guin"
          />
          <div className="d-flex justify-content-between align-items-center mt-3">
            <small className="text-body-secondary">Press Esc to close</small>
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => dialogRef.current?.close()}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Search
              </button>
            </div>
          </div>
        </form>
      </dialog>
    </Navbar>
  )
}
