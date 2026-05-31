import axios from 'axios'
import type { APODData, MarsPhotosResponse } from '../types'

const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY'
const BASE_URL = 'https://api.nasa.gov'

const nasaApi = axios.create({ baseURL: BASE_URL })

export async function fetchAPOD(date?: string): Promise<APODData> {
  const params: Record<string, string> = { api_key: NASA_API_KEY }
  if (date) params.date = date
  const { data } = await nasaApi.get<APODData>('/planetary/apod', { params })
  return data
}

export async function fetchMarsPhotos(
  earthDate: string,
  page = 1
): Promise<MarsPhotosResponse> {
  const { data } = await nasaApi.get<MarsPhotosResponse>(
    '/mars-photos/api/v1/rovers/curiosity/photos',
    {
      params: {
        earth_date: earthDate,
        page,
        api_key: NASA_API_KEY,
      },
    }
  )
  return data
}
