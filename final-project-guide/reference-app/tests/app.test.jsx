import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import App from '../src/App'
import { ReadingListProvider, ShelvesProvider } from '../src/context/AppProviders'

/* Trimmed copies of real Open Library responses. */
const DATA = {
  'search-dune': {
    numFound: 48280,
    docs: [
      {
        key: '/works/OL893414W',
        title: 'Dune',
        author_name: ['Frank Herbert'],
        author_key: ['OL79034A'],
        cover_i: 11481354,
        first_publish_year: 1965,
        edition_count: 155,
        ratings_average: 4.305677,
        ratings_count: 458,
        subject: ['Dune (Imaginary place)', 'Fiction'],
      },
      {
        key: '/works/OL1W',
        title: 'Dune: no author, no cover, no rating',
      },
    ],
  },
  'search-by-key': {
    numFound: 1,
    docs: [
      {
        key: '/works/OL893414W',
        first_publish_year: 1965,
        ratings_average: 4.305677,
        ratings_count: 458,
        edition_count: 155,
        author_key: ['OL79034A'],
        author_name: ['Frank Herbert'],
        subject: ['Dune (Imaginary place)'],
      },
    ],
  },
  'search-subject': {
    numFound: 119812,
    docs: [
      {
        key: '/works/OL8400950W',
        title: 'The Blade Itself',
        author_name: ['Joe Abercrombie'],
        cover_i: 14543422,
        first_publish_year: 2001,
      },
      { key: '/works/OL999W', title: 'A book with no cover at all' },
    ],
  },
  'search-by-author': {
    numFound: 144,
    docs: [
      { key: '/works/OL893414W', title: 'Dune', author_name: ['Frank Herbert'], cover_i: 11481354 },
      { key: '/works/OL893461W', title: 'Dune Messiah', author_name: ['Frank Herbert'], cover_i: 980253 },
    ],
  },
  work: {
    title: 'Dune',
    key: '/works/OL893414W',
    authors: [{ author: { key: '/authors/OL79034A' } }],
    description:
      'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides.\r\n\r\nWhen House Atreides is betrayed, the destruction of Paul\u2019s family will set the boy on a journey.',
    covers: [11481354, 12375564, -1],
    subjects: ['Dune (Imaginary place)', 'Fiction'],
  },
  author: {
    key: '/authors/OL79034A',
    name: 'Frank Herbert',
    birth_date: '8 October 1920',
    death_date: '11 February 1986',
    bio: 'Franklin Patrick Herbert Jr. was an American science-fiction author, best known for his 1965 novel Dune.',
    photos: [14852808],
    links: [{ title: 'ISFDB Author Entry', url: 'https://www.isfdb.org' }],
  },
}

function fakeFetch(url) {
  const decoded = decodeURIComponent(String(url))
  const query = decoded.match(/[?&]q=(.*?)(&|$)/)?.[1] ?? ''
  let key = 'search-dune'
  if (query.startsWith('author_key:')) key = 'search-by-author'
  else if (query.startsWith('subject:')) key = 'search-subject'
  else if (query.startsWith('key:')) key = 'search-by-key'
  else if (decoded.includes('/works/')) key = 'work'
  else if (decoded.includes('/authors/')) key = 'author'
  return Promise.resolve({ ok: true, status: 200, json: async () => DATA[key] })
}

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <ReadingListProvider>
        <ShelvesProvider>
          <App />
        </ShelvesProvider>
      </ReadingListProvider>
    </MemoryRouter>,
  )
}

beforeEach(() => {
  localStorage.clear()
  globalThis.fetch = vi.fn(fakeFetch)
})

describe('Shelf', () => {
  it('renders the home hero and the shelves loaded from the API', async () => {
    renderAt('/')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/find the book/i)
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Fantasy' })).toBeInTheDocument())
    // The coverless book is filtered out of the shelf row.
    expect(screen.getAllByText('The Blade Itself').length).toBe(4)
    expect(screen.queryByText('A book with no cover at all')).not.toBeInTheDocument()
  })

  it('shows a friendly error with a retry button when the network fails', async () => {
    globalThis.fetch = vi.fn(() => Promise.reject(new TypeError('Failed to fetch')))
    renderAt('/')
    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent(/could not reach open library/i),
    )
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
  })

  it('reads the search from the URL and renders result cards', async () => {
    renderAt('/explore?q=dune')
    await waitFor(() => expect(screen.getByText('48,280')).toBeInTheDocument())
    expect(screen.getByRole('link', { name: 'Dune' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Dune: no author, no cover, no rating' })).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument() // page indicator
  })

  it('renders the empty state when a search has no results', async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({ ok: true, status: 200, json: async () => ({ numFound: 0, docs: [] }) }),
    )
    renderAt('/explore?q=zzzz')
    await waitFor(() => expect(screen.getByText(/no books matched/i)).toBeInTheDocument())
  })

  it('renders a book detail page, merging both endpoints', async () => {
    renderAt('/book/OL893414W')
    await waitFor(() => expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Dune'))
    expect(screen.getByText(/set on the desert planet/i)).toBeInTheDocument()
    expect(screen.getByText('★ 4.31')).toBeInTheDocument()
    // \r\n in the description must not create empty paragraphs
    expect(document.querySelectorAll('.book-detail__description p')).toHaveLength(2)

    await userEvent.click(screen.getByRole('tab', { name: /authors/i }))
    // byline link + author card link both resolve the name
    await waitFor(() => expect(screen.getAllByRole('link', { name: 'Frank Herbert' }).length).toBeGreaterThan(1))
  })

  it('renders an author page with a sortable works grid', async () => {
    renderAt('/author/OL79034A')
    await waitFor(() =>
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Frank Herbert'),
    )
    expect(screen.getByText(/8 October 1920/)).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'A–Z' }))
    expect(screen.getByRole('button', { name: 'A–Z' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('saves a book, persists it across a remount, then removes it', async () => {
    const { unmount } = renderAt('/explore?q=dune')
    await waitFor(() => expect(screen.getAllByRole('button', { name: 'Save' })).toHaveLength(2))

    await userEvent.click(screen.getAllByRole('button', { name: 'Save' })[0])
    await waitFor(() => expect(screen.getByRole('button', { name: 'Saved' })).toBeInTheDocument())
    expect(JSON.parse(localStorage.getItem('shelf.reading-list.v1'))[0].title).toBe('Dune')

    unmount()
    renderAt('/reading-list')
    await waitFor(() => expect(screen.getByText(/1 saved book/)).toBeInTheDocument())

    await userEvent.click(screen.getByRole('button', { name: /remove dune/i }))
    await waitFor(() => expect(screen.getByText(/your shelf is empty/i)).toBeInTheDocument())
  })

  it('clears the list only after confirming in the modal', async () => {
    localStorage.setItem(
      'shelf.reading-list.v1',
      JSON.stringify([{ id: 'OL893414W', title: 'Dune', authors: ['Frank Herbert'], year: 1965 }]),
    )
    renderAt('/reading-list')
    await userEvent.click(screen.getByRole('button', { name: /^clear$/i }))
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument())

    await userEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: /keep them/i }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(screen.getByText(/1 saved book/)).toBeInTheDocument()
  })

  it('survives corrupt data in localStorage', () => {
    localStorage.setItem('shelf.reading-list.v1', '{not json')
    renderAt('/reading-list')
    expect(screen.getByText(/your shelf is empty/i)).toBeInTheDocument()
  })

  it('renders the 404 page for unknown routes', () => {
    renderAt('/does-not-exist')
    expect(screen.getByText('404')).toBeInTheDocument()
  })
})
