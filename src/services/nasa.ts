import axios, { AxiosError } from 'axios'
import type { APODData, MarsPhotosResponse, NASAErrorResponse } from '../types'

const isDev        = import.meta.env.DEV
const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY'
const NASA_BASE    = 'https://api.nasa.gov'

// Translate HTTP / network errors into friendly messages
function nasaErrorMessage(err: unknown): string {
  if (err instanceof AxiosError) {
    const status = err.response?.status
    const body   = err.response?.data as NASAErrorResponse | undefined

    if (status === 429) return 'Limite de requisições da API atingido. Aguarde e tente novamente.'
    if (status === 403) return 'Acesso negado pela API da NASA. Verifique a chave de API no arquivo .env.'
    if (status === 400) {
      const msg = body?.msg || body?.error?.message || ''
      if (msg.toLowerCase().includes('date')) return 'Data inválida ou fora do intervalo disponível.'
      return `Requisição inválida: ${msg || 'verifique os parâmetros.'}`
    }
    if (status === 404) return 'Endpoint não encontrado. Tente novamente.'
    if (status && status >= 500) return 'Serviço da NASA indisponível. Tente mais tarde.'
    if (err.code === 'ERR_NETWORK')    return 'Sem conexão com a internet.'
    if (err.code === 'ECONNABORTED')   return 'Tempo de resposta excedido. Verifique sua conexão.'
  }
  if (err instanceof Error) return err.message
  return 'Erro inesperado ao contatar a NASA.'
}

// ─────────────────────────────────────────────
// APOD
// ─────────────────────────────────────────────
export async function fetchAPOD(date?: string): Promise<APODData> {
  try {
    let data: APODData

    if (isDev) {
      const params: Record<string, string> = { api_key: NASA_API_KEY }
      if (date) params.date = date
      const res = await axios.get<APODData>(
        `${NASA_BASE}/planetary/apod`,
        { params, timeout: 12000 }
      )
      data = res.data
    } else {
      const params: Record<string, string> = { endpoint: 'apod' }
      if (date) params.date = date
      const res = await axios.get<APODData>('/api/nasa', { params, timeout: 12000 })
      data = res.data
    }

    // NASA can return { error: { code, message } } with HTTP 200 for bad keys
    const maybeError = data as unknown as NASAErrorResponse
    if (maybeError?.error?.message) {
      throw new Error(maybeError.error.message)
    }
    if (!data?.date || !data?.title) {
      throw new Error('Resposta inesperada da API APOD.')
    }
    return data
  } catch (err) {
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
    let data: MarsPhotosResponse

    const cameraParam = camera && camera !== '' ? camera.toLowerCase() : undefined

    if (isDev) {
      const params: Record<string, string> = {
        api_key:    NASA_API_KEY,
        earth_date: earthDate,
        page:       String(page),
      }
      if (cameraParam) params.camera = cameraParam
      const res = await axios.get<MarsPhotosResponse>(
        `${NASA_BASE}/mars-photos/api/v1/rovers/curiosity/photos`,
        { params, timeout: 15000 }
      )
      data = res.data
    } else {
      const params: Record<string, string> = {
        endpoint:   'mars',
        earth_date: earthDate,
        page:       String(page),
      }
      if (cameraParam) params.camera = cameraParam
      const res = await axios.get<MarsPhotosResponse>('/api/nasa', { params, timeout: 15000 })
      data = res.data
    }

    // NASA returns { errors: ["No Photos Found"] } (HTTP 200) for empty dates
    // Treat this as empty results, NOT as an error
    if (Array.isArray((data as unknown as NASAErrorResponse).errors)) {
      return { photos: [] }
    }

    // NASA can return { error: { code, message } } (HTTP 200) for bad API keys
    const maybeError = data as unknown as NASAErrorResponse
    if (maybeError?.error?.message) {
      throw new Error(maybeError.error.message)
    }

    if (!Array.isArray(data?.photos)) {
      return { photos: [] }
    }

    return data
  } catch (err) {
    if (err instanceof Error && !(err instanceof AxiosError)) throw err
    throw new Error(nasaErrorMessage(err))
  }
}
