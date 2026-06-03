import { m } from '../../lib/motion'
import { Calendar, ExternalLink, Download } from 'lucide-react'
import { useAPOD } from '../../hooks/useAPOD'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useLang } from '../../contexts/LangContext'
import { t } from '../../i18n'
import { SectionHeader } from '../ui/SectionHeader'
import { ErrorState } from '../ui/ErrorState'
import { APODSkeleton } from './APODSkeleton'

export function APODSection() {
  const { data, loading, error, date, setDate, reload } = useAPOD()
  const reducedMotion = useReducedMotion()
  const instant       = { duration: 0, delay: 0 }
  const { lang }      = useLang()
  const tr            = t[lang]

  return (
    <section id="apod" className="min-h-screen flex flex-col justify-center py-32 relative">
      <div className="max-w-6xl mx-auto px-6 w-full">
        <SectionHeader
          eyebrow={tr.apod.eyebrow}
          title={tr.apod.title}
          subtitle={tr.apod.subtitle}
        />

        {/* Date picker */}
        <div className="flex flex-wrap items-center gap-3 mb-10">
          <Calendar className="w-4 h-4 text-nebula-light" aria-hidden="true" />
          <div>
            <label htmlFor="apod-date" className="sr-only">{tr.apod.dateLabel}</label>
            <input
              id="apod-date"
              type="date"
              value={date}
              max={new Date().toISOString().split('T')[0]}
              min="1995-06-16"
              onChange={(e) => setDate(e.target.value)}
              className="bg-space-800 border border-nebula-border rounded-lg px-3 py-2 text-star text-sm focus:outline-none focus:border-nebula focus:ring-2 focus:ring-nebula-muted"
            />
          </div>
          <span className="text-star-dim text-xs font-mono hidden sm:block">{tr.apod.since}</span>
        </div>

        {loading && <APODSkeleton />}
        {error && !data && !loading && (
          <ErrorState message={error} onRetry={() => reload(date || undefined)} />
        )}

        {data && !loading && (
          <m.div
            key={data.date}
            initial={{ opacity: 0, y: reducedMotion ? 0 : 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reducedMotion ? instant : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="grid lg:grid-cols-2 gap-8 items-start"
          >
            {/* Imagem / vídeo */}
            <div className="relative rounded-2xl overflow-hidden border border-nebula-border aspect-video bg-space-800">
              {data.media_type === 'image' ? (
                <img
                  src={data.url}
                  alt={data.title}
                  className="w-full h-full object-cover"
                  fetchPriority="high"
                />
              ) : (
                <iframe
                  src={data.url}
                  title={data.title}
                  className="w-full h-full"
                  allowFullScreen
                />
              )}
              {data.media_type === 'image' && data.hdurl && (
                <a
                  href={data.hdurl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-3 right-3 p-2 rounded-lg glass hover:bg-nebula-muted transition-colors"
                  title="Ver em alta resolução"
                >
                  <Download className="w-4 h-4 text-nebula-light" />
                </a>
              )}
            </div>

            {/* Texto */}
            <div className="space-y-4">
              <div>
                <p className="text-nebula-light text-xs font-mono mb-2">{data.date}</p>
                <h3 className="font-display text-2xl font-bold text-star leading-tight">{data.title}</h3>
                {data.copyright && (
                  <p className="text-star-dim text-xs mt-1">© {data.copyright}</p>
                )}
              </div>
              <p className="text-star-muted leading-relaxed text-sm">{data.explanation}</p>
              <a
                href={`https://apod.nasa.gov/apod/ap${data.date.replace(/-/g, '').slice(2)}.html`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-nebula-light hover:text-star transition-colors"
              >
                {tr.apod.viewNasa} <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </m.div>
        )}
      </div>
    </section>
  )
}
