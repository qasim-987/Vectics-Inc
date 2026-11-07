import { createContext, useCallback, useContext, useMemo } from 'react'
import toast from 'react-hot-toast'
import useReadingList from '../hooks/useReadingList'
import useFetch from '../hooks/useFetch'
import { getFeaturedShelves } from '../api/openLibrary'

const ReadingListContext = createContext(null)

/**
 * Makes the reading list reachable from the navbar badge, the book cards,
 * the detail page and the reading list screen without prop-drilling.
 */
export function ReadingListProvider({ children }) {
  const readingList = useReadingList()

  const toggleWithToast = useCallback(
    (book) => {
      const alreadySaved = readingList.ids.has(book.id)
      readingList.toggle(book)
      toast[alreadySaved ? 'error' : 'success'](
        alreadySaved ? `Removed “${book.title}”` : `Added “${book.title}” to your list`,
      )
    },
    [readingList],
  )

  // Small enough that a plain object is fine; no useMemo ceremony needed.
  const value = { ...readingList, toggle: toggleWithToast }

  return <ReadingListContext.Provider value={value}>{children}</ReadingListContext.Provider>
}

export function useReadingListContext() {
  const context = useContext(ReadingListContext)
  if (!context) throw new Error('useReadingListContext must be used inside <ReadingListProvider>')
  return context
}

/* ---------------------------------------------------------------------- */

const ShelvesContext = createContext(null)

/**
 * The home screen and the Explore screen both want the featured shelves.
 * Loading them once in a provider means moving between those screens is
 * instant, and the data is cached for the whole session.
 */
export function ShelvesProvider({ children }) {
  const { data, error, loading, reload } = useFetch(() => getFeaturedShelves(4), [])

  const value = useMemo(() => ({ shelves: data ?? [], error, loading, reload }), [data, error, loading, reload])

  return <ShelvesContext.Provider value={value}>{children}</ShelvesContext.Provider>
}

export function useShelves() {
  const context = useContext(ShelvesContext)
  if (!context) throw new Error('useShelves must be used inside <ShelvesProvider>')
  return context
}
