import { useState, useEffect } from 'react'
import { m } from '../../lib/motion'
import { Camera, ChevronLeft, ChevronRight } from 'lucide-react'
import { useMarsPhotos } from '../../hooks/useMarsPhotos'
import { SectionHeader } from '../ui/SectionHeader'
import { ErrorState } from '../ui/ErrorState'
import { MarsPhotoCard } from './MarsPhotoCard'
import { MarsSkeleton } from './MarsSkeleton'

const MARS_MAX_DATE = new Date(Date.now() - 86400000).toISOString().split('T')[0]

const SUGGESTED_DATES = [
  '2023-01-01', '2022-06-15', '2021-11-30',
  '2020-08-10', '2019-04-20', '2018-12-25',
]

export function MarsSection() {
  const { photos, loading, error, date, setDate, page, setPage, refetch } = useMarsPhotos()
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)

  useEffect(() => {
    if (!selectedPhoto) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelectedPhoto(null) }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [selectedPhoto])

  return (
    <section id="mars" className="py-32 relative">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          eyebrow="// 02 · mars rover curiosity"
          title="Marte em Fotos"
          subtitle="Imagens reais capturadas pelo Rover Curiosity na superfície de Marte. Explore por data e câmera."
        />

        {/* Controles */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-nebula-light" />
            <input
              type="date"
              value={date}
              max={MARS_MAX_DATE}
              min="2012-08-06"
              onChange={(e) => { setDate(e.target.value); setPage(1) }}
              className="bg-space-800 border border-nebula-border rounded-lg px-3 py-2 text-star text-sm focus:outline-none focus:border-nebula"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-star-dim text-xs font-mono self-center">Datas com fotos:</span>
            {SUGGESTED_DATES.slice(0, 4).map((d) => (
              <button
                key={d}
                onClick={() => { setDate(d); setPage(1) }}
                className={`text-xs font-mono px-3 py-1 rounded-full border transition-all ${
                  date === d
                    ? 'bg-nebula text-star border-nebula'
                    : 'border-nebula-border text-nebula-light hover:bg-nebula-muted'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {loading && <MarsSkeleton />}
        {error   && <ErrorState message={error} onRetry={refetch} />}

        {!loading && !error && photos.length === 0 && (
          <div className="text-center py-16 text-star-muted">
            <p>Nenhuma foto encontrada para esta data.</p>
            <p className="text-sm mt-2">Tente uma das datas sugeridas acima.</p>
          </div>
        )}

        {!loading && photos.length > 0 && (
          <>
            <p className="text-star-dim text-xs font-mono mb-6">
              {photos.length} foto{photos.length !== 1 ? 's' : ''} encontrada{photos.length !== 1 ? 's' : ''} · {date}
            </p>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo, i) => (
                <MarsPhotoCard
                  key={photo.id}
                  photo={photo}
                  index={i}
                  onClick={() => setSelectedPhoto(photo.img_src)}
                />
              ))}
            </div>

            {/* Paginação */}
            <div className="flex items-center justify-center gap-4 mt-10">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="p-2 rounded-lg border border-nebula-border text-nebula-light hover:bg-nebula-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-star-muted text-sm font-mono">Página {page}</span>
              <button
                disabled={photos.length < 25}
                onClick={() => setPage(p => p + 1)}
                className="p-2 rounded-lg border border-nebula-border text-nebula-light hover:bg-nebula-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}

        {/* Lightbox */}
        {selectedPhoto && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 cursor-pointer"
          >
            <img
              src={selectedPhoto}
              alt="Mars"
              className="max-w-full max-h-full rounded-xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </m.div>
        )}
      </div>
    </section>
  )
}
