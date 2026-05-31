import { m } from '../../lib/motion'
import { Satellite, Gauge, Navigation, Clock } from 'lucide-react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useLang } from '../../contexts/LangContext'
import { t } from '../../i18n'
import type { ISSPosition } from '../../types'

interface Props {
  position: ISSPosition | null
  loading: boolean
}

export function ISSStats({ position, loading }: Props) {
  const reducedMotion = useReducedMotion()
  const { lang }      = useLang()
  const tr            = t[lang].iss

  const stats = position
    ? [
        { icon: Navigation, label: tr.latitude,   value: `${position.latitude.toFixed(4)}°`,                        mobileHide: false },
        { icon: Navigation, label: tr.longitude,  value: `${position.longitude.toFixed(4)}°`,                       mobileHide: false },
        { icon: Satellite,  label: tr.altitude,   value: `${position.altitude.toFixed(1)} km`,                      mobileHide: true  },
        { icon: Gauge,      label: tr.velocity,   value: `${(position.velocity / 1000).toFixed(1)} km/s`,           mobileHide: true  },
        { icon: Clock,      label: tr.updated,    value: new Date(position.timestamp * 1000).toLocaleTimeString(), mobileHide: false },
      ]
    : []

  return (
    <div className="space-y-3 h-full flex flex-col justify-between">
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <m.div
            animate={reducedMotion ? {} : { rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <Satellite className="w-5 h-5 text-nebula-light" />
          </m.div>
          <span className="font-display font-semibold text-star">{tr.station}</span>
          <span className="ml-auto flex items-center gap-1 text-xs text-green-400">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            {tr.live}
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
              <div
                key={stat.label}
                className={`items-center justify-between py-2 border-b border-space-700 last:border-0 ${stat.mobileHide ? 'hidden sm:flex' : 'flex'}`}
              >
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
        <p className="text-star-dim text-xs font-mono leading-relaxed">{tr.fact}</p>
      </div>
    </div>
  )
}
