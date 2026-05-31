import { useState, useEffect } from 'react'
import { fetchISSPosition } from '../services/iss'
import type { ISSPosition } from '../types'

const REFRESH_INTERVAL = 5000

export function useISS() {
  const [position, setPosition] = useState<ISSPosition | null>(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const fetchAndUpdate = async () => {
      try {
        const pos = await fetchISSPosition()
        if (!cancelled) {
          setPosition(pos)
          setError(null)
        }
      } catch {
        if (!cancelled) setError('Erro ao obter posição da ISS.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchAndUpdate()
    const interval = setInterval(fetchAndUpdate, REFRESH_INTERVAL)
    return () => { cancelled = true; clearInterval(interval) }
  }, [])

  return { position, loading, error }
}
