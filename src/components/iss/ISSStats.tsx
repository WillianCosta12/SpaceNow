import { m } from '../../lib/motion'
import { Satellite, Gauge, Navigation, Clock } from 'lucide-react'
import type { ISSPosition } from '../../types'

interface Props {
  position: ISSPosition | null
  loading: boolean
}

export function ISSStats({ position, loading }: Props) {
  const stats = position
    ? [
        { icon: Navigation, label: 'Latitude',   value: `${position.latitude.toFixed(4)}°`  },
        { icon: Navigation, label: 'Longitude',  value: `${position.longitude.toFixed(4)}°` },
        { icon: Satellite,  label: 'Altitude',   value: `${position.altitude.toFixed(1)} km` },
        { icon: Gauge,      label: 'Velocidade', value: `${(position.velocity / 1000).toFixed(1)} km/s` },
        { icon: Clock,      label: 'Atualizado', value: new Date(position.timestamp * 1000).toLocaleTimeString('pt-BR') },
      ]
    : []

  return (
    <div className="space-y-3 h-full flex flex-col justify-between">
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <m.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <Satellite className="w-5 h-5 text-nebula-light" />
          </m.div>
          <span className="font-display font-semibold text-star">Estação Espacial</span>
          <span className="ml-auto flex items-center gap-1 text-xs text-green-400">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Ao vivo
          </span>
        </div>

        {loading ? (
          <div className="space-y-3 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 rounded-lg bg-space-800" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center justify-between py-2 border-b border-space-700 last:border-0">
                <div className="flex items-center gap-2">
                  <stat.icon className="w-3.5 h-3.5 text-nebula-light" />
                  <span className="text-star-muted text-xs">{stat.label}</span>
                </div>
                <span className="text-star text-sm font-mono">{stat.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="glass rounded-2xl p-5">
        <p className="text-star-dim text-xs font-mono leading-relaxed">
          A ISS orbita a Terra a ~400 km de altitude, completando uma volta a cada 90 minutos a uma velocidade de ~7,7 km/s.
        </p>
      </div>
    </div>
  )
}
