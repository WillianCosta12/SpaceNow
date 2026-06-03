import { useState, useEffect, useRef, useCallback } from 'react'
import { fetchISSPosition } from '../services/iss'
import type { ISSPosition } from '../types'

const REFRESH_INTERVAL = 5000

export function useISS() {
  const [position, setPosition] = useState<ISSPosition | null>(null)
  const [trail, setTrail]       = useState<ISSPosition[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)
  const abortRef                = useRef<AbortController | null>(null)

  const fetchAndUpdate = useCallback(async () => {
    // Cancel previous in-flight request
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    try {
      const pos = await fetchISSPosition(controller.signal)
      if (controller.signal.aborted) return
      setPosition(pos)
      setTrail(prev => [...prev.slice(-19), pos])
      setError(null)
    } catch (err) {
      if (controller.signal.aborted) return
      const isAbort = (err as Error).name === 'AbortError' ||
                      (err as { code?: string }).code === 'ERR_CANCELED'
      if (!isAbort) {
        setError('Erro ao obter posição da ISS. Verificando conexão...')
      }
    } finally {
      if (!controller.signal.aborted) setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Initial fetch immediately
    fetchAndUpdate()

    // Pause polling when tab is hidden, resume on visibility
    const onVisibility = () => {
      if (document.visibilityState === 'visible') fetchAndUpdate()
    }
    document.addEventListener('visibilitychange', onVisibility)

    const interval = setInterval(() => {
      if (document.visibilityState !== 'hidden') fetchAndUpdate()
    }, REFRESH_INTERVAL)

    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisibility)
      abortRef.current?.abort()
    }
  }, [fetchAndUpdate])

  return { position, trail, loading, error }
}
