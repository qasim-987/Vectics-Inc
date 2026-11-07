import { useCallback, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'shelf.reading-list.v1'

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    // Corrupt JSON or storage disabled (private mode) should never crash the app.
    return []
  }
}

/**
 * The reading list lives in localStorage, so it survives a page reload.
 * Reading is done once on mount, writing whenever the list changes.
 */
export default function useReadingList() {
  const [items, setItems] = useState(readStored)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // Storage full or blocked: the app still works for this session.
    }
  }, [items])

  // Sync between two open tabs, a nice detail that costs four lines.
  useEffect(() => {
    function onStorage(event) {
      if (event.key === STORAGE_KEY) setItems(readStored())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const ids = useMemo(() => new Set(items.map((item) => item.id)), [items])

  const add = useCallback((book) => {
    setItems((current) =>
      current.some((item) => item.id === book.id) ? current : [book, ...current],
    )
  }, [])

  const remove = useCallback((id) => {
    setItems((current) => current.filter((item) => item.id !== id))
  }, [])

  const toggle = useCallback((book) => {
    setItems((current) =>
      current.some((item) => item.id === book.id)
        ? current.filter((item) => item.id !== book.id)
        : [book, ...current],
    )
  }, [])

  const clear = useCallback(() => setItems([]), [])

  return { items, ids, add, remove, toggle, clear, count: items.length }
}
