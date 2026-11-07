import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Runs an async function and tracks its state: data, error and loading.
 * Every screen needs exactly these three things, so they all share this hook
 * instead of copy-pasting try/catch/finally blocks.
 *
 * Returns { data, error, loading, reload }.
 */
export default function useFetch(asyncFn, deps = []) {
  const [state, setState] = useState({ data: null, error: null, loading: true })
  const [nonce, setNonce] = useState(0)

  // Keep the latest function in a ref so a new inline function on every render
  // does not restart the request. The `deps` array decides when to re-run.
  const fnRef = useRef(asyncFn)
  fnRef.current = asyncFn

  useEffect(() => {
    let cancelled = false

    async function run() {
      setState({ data: null, error: null, loading: true })
      try {
        const data = await fnRef.current()
        if (!cancelled) setState({ data, error: null, loading: false })
      } catch (error) {
        if (!cancelled) setState({ data: null, error, loading: false })
      }
    }

    run()

    // Cleanup: if the user navigates away mid-request, we ignore the result
    // instead of setting state on a component that no longer exists.
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce])

  const reload = useCallback(() => setNonce((n) => n + 1), [])

  return { ...state, reload }
}
