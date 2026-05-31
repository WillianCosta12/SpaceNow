import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { divIcon } from 'leaflet'
import { useEffect } from 'react'
import type { ISSPosition } from '../../types'

const issIcon = divIcon({
  className: '',
  html: `<div style="
    width: 32px; height: 32px;
    background: rgba(124, 58, 237, 0.9);
    border: 2px solid rgba(167, 139, 250, 0.8);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0 20px rgba(124, 58, 237, 0.5);
    font-size: 16px;
  ">🛸</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
})

function MapUpdater({ position }: { position: ISSPosition }) {
  const map = useMap()
  useEffect(() => {
    map.setView([position.latitude, position.longitude], map.getZoom(), { animate: true })
  }, [position, map])
  return null
}

interface Props {
  position: ISSPosition | null
  loading: boolean
}

export function ISSMap({ position, loading }: Props) {
  return (
    <div className="rounded-2xl overflow-hidden border border-nebula-border" style={{ height: '420px' }}>
      {loading || !position ? (
        <div className="w-full h-full bg-space-800 animate-pulse flex items-center justify-center">
          <p className="text-star-muted text-sm">Localizando ISS...</p>
        </div>
      ) : (
        <MapContainer
          center={[position.latitude, position.longitude]}
          zoom={3}
          style={{ height: '100%', width: '100%', background: '#07071A' }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <Marker position={[position.latitude, position.longitude]} icon={issIcon}>
            <Popup className="iss-popup">
              <span style={{ fontFamily: 'monospace', color: '#A78BFA' }}>
                ISS · {position.latitude.toFixed(2)}°, {position.longitude.toFixed(2)}°
              </span>
            </Popup>
          </Marker>
          <MapUpdater position={position} />
        </MapContainer>
      )}
    </div>
  )
}
