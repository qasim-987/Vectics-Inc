import { Link, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Container } from 'react-bootstrap'
import SiteNavbar from './components/SiteNavbar'
import HomePage from './pages/HomePage'
import ExplorePage from './pages/ExplorePage'
import BookPage from './pages/BookPage'
import AuthorPage from './pages/AuthorPage'
import ReadingListPage from './pages/ReadingListPage'

export default function App() {
  const { pathname } = useLocation()

  // A real page change should start at the top, like a normal website.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return (
    <div className="app-shell">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <SiteNavbar />

      <main id="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/book/:id" element={<BookPage />} />
          <Route path="/author/:id" element={<AuthorPage />} />
          <Route path="/reading-list" element={<ReadingListPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

function NotFound() {
  return (
    <Container className="py-5 text-center">
      <p className="display-4 mb-2">404</p>
      <h1 className="h3">This shelf does not exist</h1>
      <p className="text-body-secondary">The page you followed is not part of the app.</p>
      <Link to="/" className="btn btn-primary">
        Back to home
      </Link>
    </Container>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <Container className="d-flex flex-wrap justify-content-between gap-2 py-4">
        <p className="small mb-0">
          Shelf is a student project. Book data from{' '}
          <a href="https://openlibrary.org/developers/api" target="_blank" rel="noreferrer">
            Open Library
          </a>
          , an initiative of the Internet Archive.
        </p>
        <p className="small mb-0 text-body-secondary">Built with React, Vite and Bootstrap.</p>
      </Container>
    </footer>
  )
}
