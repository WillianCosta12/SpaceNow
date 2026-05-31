import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import { divIcon } from 'leaflet'
import { useEffect } from 'react'
import { useLang } from '../../contexts/LangContext'
import { t } from '../../i18n'
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

function ZoomControls() {
  const map      = useMap()
  const { lang } = useLang()
  const tr       = t[lang].iss

  return (
    <div className="absolute bottom-4 right-4 z-[400] flex flex-col gap-1 lg:hidden">
      <button
        onClick={() => map.zoomIn()}
        aria-label={tr.zoomIn}
        className="w-8 h-8 rounded-lg bg-space-800/90 border border-nebula-border text-star text-lg flex items-center justify-center hover:bg-nebula-muted transition-colors"
      >+</button>
      <button
        onClick={() => map.zoomOut()}
        aria-label={tr.zoomOut}
        className="w-8 h-8 rounded-lg bg-space-800/90 border border-nebula-border text-star text-lg flex items-center justify-center hover:bg-nebula-muted transition-colors"
      >−</button>
    </div>
  )
}

interface Props {
  position: ISSPosition | null
  trail:    ISSPosition[]
  loading:  boolean
}

export function ISSMap({ position, trail, loading }: Props) {
  const { lang } = useLang()
  const tr       = t[lang].iss

  const center: [number, number] = position
    ? [position.latitude, position.longitude]
    : [0, 0]

  const trailPositions = trail.map(p => [p.latitude, p.longitude] as [number, number])

  return (
    <div className="rounded-2xl overflow-hidden border border-nebula-border relative h-64 sm:h-80 lg:h-[420px]">
      <MapContainer
        center={center}
        zoom={3}
        style={{ height: '100%', width: '100%', background: '#07071A' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {trailPositions.length >= 2 && (
          <Polyline
            positions={trailPositions}
            pathOptions={{ color: 'rgba(124, 58, 237, 0.5)', weight: 2, dashArray: '4 4' }}
          />
        )}
        {position && (
          <>
            <Marker position={[position.latitude, position.longitude]} icon={issIcon}>
              <Popup className="iss-popup">
                <span style={{ fontFamily: 'monospace', color: '#A78BFA' }}>
                  ISS · {position.latitude.toFixed(2)}°, {position.longitude.toFixed(2)}°
                </span>
              </Popup>
            </Marker>
            <MapUpdater position={position} />
          </>
        )}
        <ZoomControls />
      </MapContainer>

      {(loading || !position) && (
        <div className="absolute inset-0 z-10 bg-space-800 animate-pulse flex items-center justify-center">
          <p className="text-star-muted text-sm">{tr.locating}</p>
        </div>
      )}
    </div>
  )
}
