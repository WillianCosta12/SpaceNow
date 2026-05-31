import { useState, useEffect, useRef } from 'react'
import { fetchISSPosition } from '../services/iss'
import type { ISSPosition } from '../types'

const REFRESH_INTERVAL = 5000

export function useISS() {
  const [position, setPosition] = useState<ISSPosition | null>(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)
  const abortRef                = useRef<AbortController | null>(null)

  useEffect(() => {
    const fetchAndUpdate = async () => {
      abortRef.current?.abort()
      const controller  = new AbortController()
      abortRef.current  = controller

      try {
        const pos = await fetchISSPosition(controller.signal)
        setPosition(pos)
        setError(null)
      } catch (err) {
        if ((err as Error).name !== 'AbortError' && (err as { code?: string }).code !== 'ERR_CANCELED') {
          setError('Erro ao obter posição da ISS.')
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    fetchAndUpdate()
    const interval = setInterval(fetchAndUpdate, REFRESH_INTERVAL)
    return () => {
      clearInterval(interval)
      abortRef.current?.abort()
    }
  }, [])

  return { position, loading, error }
}
