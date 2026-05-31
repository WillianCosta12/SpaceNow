import axios from 'axios'
import type { APODData, MarsPhotosResponse } from '../types'

const proxyApi = axios.create({ baseURL: '/api/nasa' })

export async function fetchAPOD(date?: string): Promise<APODData> {
  const params: Record<string, string> = { endpoint: 'apod' }
  if (date) params.date = date
  const { data } = await proxyApi.get<APODData>('', { params })
  return data
}

export async function fetchMarsPhotos(
  earthDate: string,
  page = 1
): Promise<MarsPhotosResponse> {
  const { data } = await proxyApi.get<MarsPhotosResponse>('', {
    params: {
      endpoint: 'mars',
      earth_date: earthDate,
      page,
    },
  })
  return data
}
