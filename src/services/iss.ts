import axios from 'axios'
import type { ISSPosition } from '../types'

const ISS_API = 'https://api.wheretheiss.at/v1/satellites/25544'

export async function fetchISSPosition(): Promise<ISSPosition> {
  const { data } = await axios.get(ISS_API)
  return {
    latitude:  data.latitude,
    longitude: data.longitude,
    altitude:  data.altitude,
    velocity:  data.velocity,
    timestamp: data.timestamp,
  }
}
