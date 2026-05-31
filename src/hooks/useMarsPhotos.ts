import { useState, useEffect, useCallback } from 'react'
import { fetchMarsPhotos } from '../services/nasa'
import type { MarsPhoto } from '../types'

const DEFAULT_DATE = '2023-01-01'

export function useMarsPhotos() {
  const [photos, setPhotos]   = useState<MarsPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)
  const [date, setDate]       = useState(DEFAULT_DATE)
  const [page, setPage]       = useState(1)
  const [counter, setCounter] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchMarsPhotos(date, page)
      .then(({ photos }) => {
        if (!cancelled) setPhotos(photos)
      })
      .catch(() => {
        if (!cancelled) setError('Erro ao carregar fotos de Marte.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [date, page, counter])

  const refetch = useCallback(() => setCounter(c => c + 1), [])

  return { photos, loading, error, date, setDate, page, setPage, refetch }
}
