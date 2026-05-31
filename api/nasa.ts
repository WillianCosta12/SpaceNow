import type { VercelRequest, VercelResponse } from '@vercel/node'

const NASA_BASE = 'https://api.nasa.gov'

const ENDPOINTS: Record<string, string> = {
  apod: '/planetary/apod',
  mars: '/mars-photos/api/v1/rovers/curiosity/photos',
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { endpoint, ...rest } = req.query

  if (!endpoint || typeof endpoint !== 'string' || !ENDPOINTS[endpoint]) {
    return res.status(400).json({ error: 'Invalid or missing endpoint' })
  }

  const apiKey = process.env.NASA_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'NASA_API_KEY not configured' })
  }

  const params = new URLSearchParams({ api_key: apiKey })
  for (const [key, value] of Object.entries(rest)) {
    if (typeof value === 'string') params.set(key, value)
  }

  const upstream = `${NASA_BASE}${ENDPOINTS[endpoint]}?${params}`

  try {
    const response = await fetch(upstream)
    const data = await response.json()

    if (!response.ok) {
      return res.status(response.status).json(data)
    }

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600')
    return res.status(200).json(data)
  } catch {
    return res.status(502).json({ error: 'Failed to reach NASA API' })
  }
}
