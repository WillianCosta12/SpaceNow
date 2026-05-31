import { m } from '../../lib/motion'
import { Calendar, ExternalLink, Download } from 'lucide-react'
import { useAPOD } from '../../hooks/useAPOD'
import { SectionHeader } from '../ui/SectionHeader'
import { ErrorState } from '../ui/ErrorState'
import { APODSkeleton } from './APODSkeleton'

export function APODSection() {
  const { data, loading, error, date, setDate, reload } = useAPOD()

  return (
    <section id="apod" className="min-h-screen flex flex-col justify-center py-32 relative">
      <div className="max-w-6xl mx-auto px-6 w-full">
        <SectionHeader
          eyebrow="// 01 · astronomy picture of the day"
          title="Foto do Dia"
          subtitle="Uma imagem ou fotografia do nosso universo fascinante, com explicação escrita por um astrônomo profissional."
        />

        {/* Date picker */}
        <div className="flex items-center gap-3 mb-10">
          <Calendar className="w-4 h-4 text-nebula-light" />
          <input
            type="date"
            value={date}
            max={new Date().toISOString().split('T')[0]}
            min="1995-06-16"
            onChange={(e) => setDate(e.target.value)}
            className="bg-space-800 border border-nebula-border rounded-lg px-3 py-2 text-star text-sm focus:outline-none focus:border-nebula focus:ring-2 focus:ring-nebula-muted"
          />
          <span className="text-star-dim text-xs font-mono">Disponível desde 16/06/1995</span>
        </div>

        {loading && <APODSkeleton />}
        {error   && <ErrorState message={error} onRetry={() => reload(date || undefined)} />}

        {data && !loading && (
          <m.div
            key={data.date}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
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
                Ver no site da NASA <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </m.div>
        )}
      </div>
    </section>
  )
}
