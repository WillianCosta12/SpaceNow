import { useState, useEffect, useCallback, useRef } from 'react'
import { fetchAPOD } from '../services/nasa'
import type { APODData } from '../types'

export function useAPOD(initialDate?: string) {
  const [data, setData]       = useState<APODData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)
  const [date, setDate]       = useState(initialDate || '')
  const cache                 = useRef(new Map<string, APODData>())

  const load = useCallback(async (targetDate?: string) => {
    const key    = targetDate || '__today__'
    const cached = cache.current.get(key)

    if (cached) {
      setData(cached)
      setError(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const result = await fetchAPOD(targetDate)
      cache.current.set(key, result)
      setData(result)
    } catch (err) {
      setError('Erro ao carregar a foto do dia. Tente novamente.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load(date || undefined)
  }, [date, load])

  return { data, loading, error, date, setDate, reload: load }
}
