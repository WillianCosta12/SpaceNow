import { useState, useEffect, useRef } from 'react'
import { m } from '../../lib/motion'
import { Camera, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useMarsPhotos } from '../../hooks/useMarsPhotos'
import { useLang } from '../../contexts/LangContext'
import { t } from '../../i18n'
import { SectionHeader } from '../ui/SectionHeader'
import { ErrorState } from '../ui/ErrorState'
import { MarsPhotoCard } from './MarsPhotoCard'
import { MarsSkeleton } from './MarsSkeleton'

const MARS_MAX_DATE = new Date(Date.now() - 86400000).toISOString().split('T')[0]

const SUGGESTED_DATES = [
  '2023-01-01', '2022-06-15', '2021-11-30',
  '2020-08-10', '2019-04-20', '2018-12-25',
]

const CAMERA_KEYS = ['FHAZ', 'RHAZ', 'MAST', 'CHEMCAM', 'MAHLI', 'MARDI', 'NAVCAM'] as const

interface Selection { src: string; index: number }

export function MarsSection() {
  const { photos, loading, error, date, setDateAndReset, page, setPage, camera, setCamera, refetch } = useMarsPhotos()
  const [selectedPhoto, setSelectedPhoto] = useState<Selection | null>(null)
  const dialogRef     = useRef<HTMLDivElement>(null)
  const previousFocus = useRef<HTMLElement | null>(null)
  const { lang }      = useLang()
  const tr            = t[lang]

  const open = (src: string, index: number) => {
    previousFocus.current = document.activeElement as HTMLElement
    setSelectedPhoto({ src, index })
  }

  const close = () => {
    setSelectedPhoto(null)
    previousFocus.current?.focus()
  }

  const navigate = (dir: 1 | -1) => {
    setSelectedPhoto(prev => {
      if (!prev) return null
      const next = prev.index + dir
      if (next < 0 || next >= photos.length) return prev
      return { src: photos[next].img_src, index: next }
    })
  }

  useEffect(() => {
    if (selectedPhoto) dialogRef.current?.focus()
  }, [selectedPhoto])

  useEffect(() => {
    if (!selectedPhoto) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape')     close()
      if (e.key === 'ArrowLeft')  navigate(-1)
      if (e.key === 'ArrowRight') navigate(1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPhoto])

  return (
    <section id="mars" className="py-32 relative">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          eyebrow={tr.mars.eyebrow}
          title={tr.mars.title}
          subtitle={tr.mars.subtitle}
        />

        {/* Controles */}
        <div className="flex flex-col md:flex-row md:flex-wrap md:items-center gap-3 mb-8">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-nebula-light" aria-hidden="true" />
            <label htmlFor="mars-date" className="sr-only">{tr.mars.dateLabel}</label>
            <input
              id="mars-date"
              type="date"
              value={date}
              max={MARS_MAX_DATE}
              min="2012-08-06"
              onChange={(e) => { setDateAndReset(e.target.value); setPage(1) }}
              className="bg-space-800 border border-nebula-border rounded-lg px-3 py-2 text-star text-sm focus:outline-none focus:border-nebula"
            />
          </div>

          {/* Filtro de câmera */}
          <select
            value={camera}
            onChange={(e) => { setCamera(e.target.value); setPage(1) }}
            className="bg-space-800 border border-nebula-border rounded-lg px-3 py-2 text-star text-sm focus:outline-none focus:border-nebula"
          >
            <option value="">{tr.mars.allCameras}</option>
            {CAMERA_KEYS.map(key => (
              <option key={key} value={key}>{tr.mars.cameras[key]}</option>
            ))}
          </select>

          <div className="flex flex-col gap-2">
            <span className="text-star-dim text-xs font-mono">{tr.mars.datesLabel}</span>
            <div className="flex gap-2 overflow-x-auto pb-1 md:flex-wrap">
              {SUGGESTED_DATES.slice(0, 4).map((d) => (
                <button
                  key={d}
                  onClick={() => { setDateAndReset(d); setPage(1) }}
                  className={`shrink-0 text-xs font-mono px-3 py-1 rounded-full border transition-all ${
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
        </div>

        {loading && <MarsSkeleton />}
        {error && photos.length === 0 && <ErrorState message={tr.mars.error} onRetry={refetch} />}

        {!loading && !error && photos.length === 0 && (
          <div className="text-center py-16 text-star-muted">
            <p>{tr.mars.noPhotos}</p>
            <p className="text-sm mt-2">{tr.mars.noPhotosTip}</p>
          </div>
        )}

        {!loading && photos.length > 0 && (
          <>
            <p className="text-star-dim text-xs font-mono mb-6">
              {tr.mars.photosFound(photos.length)} · {date}
            </p>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo, i) => (
                <MarsPhotoCard
                  key={photo.id}
                  photo={photo}
                  index={i}
                  onClick={() => open(photo.img_src, i)}
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
              <span className="text-star-muted text-sm font-mono">{tr.mars.page} {page}</span>
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
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={tr.lightbox.dialog}
            tabIndex={-1}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 outline-none"
          >
            <button
              aria-label={tr.lightbox.close}
              onClick={(e) => { e.stopPropagation(); close() }}
              className="absolute top-4 right-4 p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {selectedPhoto.index > 0 && (
              <button
                aria-label={tr.lightbox.prev}
                onClick={(e) => { e.stopPropagation(); navigate(-1) }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            <img
              src={selectedPhoto.src}
              alt="Mars"
              className="max-w-full max-h-full rounded-xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {selectedPhoto.index < photos.length - 1 && (
              <button
                aria-label={tr.lightbox.next}
                onClick={(e) => { e.stopPropagation(); navigate(1) }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </m.div>
        )}
      </div>
    </section>
  )
}
