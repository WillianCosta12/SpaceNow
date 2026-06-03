import axios, { AxiosError } from 'axios'
import type { APODData, MarsPhotosResponse, NASAErrorResponse } from '../types'

const isDev        = import.meta.env.DEV
const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY'
const NASA_BASE    = 'https://api.nasa.gov'

// Returns today's date in local timezone (YYYY-MM-DD)
export function localToday(): string {
  const d = new Date()
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-')
}

// Returns yesterday's date in local timezone
function localYesterday(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-')
}

function nasaErrorMessage(err: unknown): string {
  if (err instanceof AxiosError) {
    const status = err.response?.status
    const body   = err.response?.data as NASAErrorResponse | undefined

    if (status === 429) return 'Limite de requisições da API atingido. Aguarde e tente novamente.'
    if (status === 403) return 'Acesso negado pela API da NASA. Verifique a chave de API no .env.'
    if (status === 400) {
      const msg = body?.msg || body?.error?.message || ''
      if (msg.toLowerCase().includes('date')) return 'Data inválida ou ainda não disponível.'
      return `Requisição inválida: ${msg || 'verifique os parâmetros.'}`
    }
    if (status === 404) return 'Nenhum dado encontrado para esta data.'
    if (status && status >= 500) return 'Serviço da NASA indisponível. Tente mais tarde.'
    if (err.code === 'ECONNABORTED' || err.code === 'ERR_NETWORK') {
      return 'Conexão lenta ou sem internet. Tente novamente.'
    }
  }
  if (err instanceof Error) return err.message
  return 'Erro inesperado ao contatar a NASA.'
}

// ─────────────────────────────────────────────
// APOD
// ─────────────────────────────────────────────
export async function fetchAPOD(date?: string): Promise<APODData> {
  const tryFetch = async (targetDate?: string): Promise<APODData> => {
    const params: Record<string, string> = {
      api_key: isDev ? NASA_API_KEY : '',
    }
    if (targetDate) params.date = targetDate

    const url = isDev
      ? `${NASA_BASE}/planetary/apod`
      : '/api/nasa'

    if (!isDev) params.endpoint = 'apod'

    const res = await axios.get<APODData>(url, { params, timeout: 20000 })
    return res.data
  }

  try {
    let data = await tryFetch(date)

    // Handle NASA's inline error object (HTTP 200 but body has error)
    const maybeError = data as unknown as NASAErrorResponse
    if (maybeError?.error?.message) throw new Error(maybeError.error.message)
    if (!data?.date || !data?.title) throw new Error('Resposta inválida da API APOD.')

    return data
  } catch (err) {
    // If today's APOD doesn't exist yet (future date in UTC), try yesterday
    const isDateErr =
      err instanceof AxiosError && err.response?.status === 400 ||
      (err instanceof Error && err.message.toLowerCase().includes('date'))

    if (isDateErr && !date) {
      try {
        const yesterday = localYesterday()
        const data = await tryFetch(yesterday)
        const maybeError = data as unknown as NASAErrorResponse
        if (maybeError?.error?.message) throw new Error(maybeError.error.message)
        if (!data?.date || !data?.title) throw new Error('Resposta inválida.')
        return data
      } catch {
        // fall through to original error
      }
    }

    if (err instanceof Error && !(err instanceof AxiosError)) throw err
    throw new Error(nasaErrorMessage(err))
  }
}

// ─────────────────────────────────────────────
// Mars Rover Photos
// ─────────────────────────────────────────────
export async function fetchMarsPhotos(
  earthDate: string,
  page = 1,
  camera = ''
): Promise<MarsPhotosResponse> {
  try {
    const cameraParam = camera && camera !== '' ? camera.toLowerCase() : undefined
    const params: Record<string, string> = {
      earth_date: earthDate,
      page:       String(page),
    }
    if (cameraParam) params.camera = cameraParam

    let data: MarsPhotosResponse

    if (isDev) {
      params.api_key = NASA_API_KEY
      const res = await axios.get<MarsPhotosResponse>(
        `${NASA_BASE}/mars-photos/api/v1/rovers/curiosity/photos`,
        { params, timeout: 20000 }
      )
      data = res.data
    } else {
      params.endpoint = 'mars'
      const res = await axios.get<MarsPhotosResponse>(
        '/api/nasa',
        { params, timeout: 20000 }
      )
      data = res.data
    }

    // NASA returns { errors: [...] } with HTTP 200 for empty dates
    if (Array.isArray((data as unknown as NASAErrorResponse).errors)) {
      return { photos: [] }
    }

    // NASA returns { error: { code, message } } for auth errors
    const maybeError = data as unknown as NASAErrorResponse
    if (maybeError?.error?.message) throw new Error(maybeError.error.message)

    if (!Array.isArray(data?.photos)) return { photos: [] }

    return data
  } catch (err) {
    // NASA returns 404 for valid dates with no Curiosity activity — treat as empty
    if (err instanceof AxiosError && err.response?.status === 404) {
      return { photos: [] }
    }
    if (err instanceof Error && !(err instanceof AxiosError)) throw err
    throw new Error(nasaErrorMessage(err))
  }
}
