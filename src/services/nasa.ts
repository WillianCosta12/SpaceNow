import axios from 'axios'
import type { APODData, MarsPhotosResponse } from '../types'

const isDev        = import.meta.env.DEV
const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY'
const NASA_BASE    = 'https://api.nasa.gov'

export async function fetchAPOD(date?: string): Promise<APODData> {
  if (isDev) {
    const params: Record<string, string> = { api_key: NASA_API_KEY }
    if (date) params.date = date
    const { data } = await axios.get<APODData>(`${NASA_BASE}/planetary/apod`, { params })
    return data
  }
  const params: Record<string, string> = { endpoint: 'apod' }
  if (date) params.date = date
  const { data } = await axios.get<APODData>('/api/nasa', { params })
  return data
}

export async function fetchMarsPhotos(
  earthDate: string,
  page = 1,
  camera = ''
): Promise<MarsPhotosResponse> {
  if (isDev) {
    const params: Record<string, string | number> = {
      api_key: NASA_API_KEY, earth_date: earthDate, page,
    }
    if (camera) params.camera = camera
    const { data } = await axios.get<MarsPhotosResponse>(
      `${NASA_BASE}/mars-photos/api/v1/rovers/curiosity/photos`, { params }
    )
    return data
  }
  const params: Record<string, string | number> = { endpoint: 'mars', earth_date: earthDate, page }
  if (camera) params.camera = camera
  const { data } = await axios.get<MarsPhotosResponse>('/api/nasa', { params })
  return data
}
