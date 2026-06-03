// APOD
export interface APODData {
  date: string
  title: string
  explanation: string
  url: string
  hdurl?: string
  media_type: 'image' | 'video'
  copyright?: string
  service_version: string
}

// NASA API error response shape
export interface NASAErrorResponse {
  errors?: string[]
  error?: {
    code: string
    message: string
  }
  msg?: string
}

// Mars Rover
export interface MarsPhoto {
  id: number
  sol: number
  camera: {
    id: number
    name: string
    rover_id: number
    full_name: string
  }
  img_src: string
  earth_date: string
  rover: {
    id: number
    name: string
    landing_date: string
    launch_date: string
    status: string
  }
}

export interface MarsPhotosResponse {
  photos: MarsPhoto[]
  errors?: string[]
}

// ISS
export interface ISSPosition {
  latitude: number
  longitude: number
  altitude: number
  velocity: number
  timestamp: number
}
