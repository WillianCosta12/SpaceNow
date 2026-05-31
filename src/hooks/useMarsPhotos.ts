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
  const [camera, setCamera]   = useState('')
  const [counter, setCounter] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchMarsPhotos(date, page, camera)
      .then((response) => {
        if (!cancelled) setPhotos(response?.photos ?? [])
      })
      .catch((err) => {
        console.error('Mars API error:', err.response?.data || err.message)
        if (!cancelled) setError('Erro ao carregar fotos de Marte.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [date, page, camera, counter])

  const refetch        = useCallback(() => setCounter(c => c + 1), [])
  const setDateAndReset = useCallback((newDate: string) => {
    setPhotos([])
    setDate(newDate)
  }, [])

  return { photos, loading, error, date, setDate, setDateAndReset, page, setPage, camera, setCamera, refetch }
}
