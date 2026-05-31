import { m } from '../../lib/motion'
import type { MarsPhoto } from '../../types'

interface Props {
  photo: MarsPhoto
  index: number
  onClick: () => void
}

export function MarsPhotoCard({ photo, index, onClick }: Props) {
  return (
    <m.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      role="button"
      tabIndex={0}
      aria-label={`Ver foto - ${photo.camera.full_name} - ${photo.earth_date}`}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick() } }}
      className="group relative rounded-xl overflow-hidden border border-space-700 hover:border-nebula-border cursor-pointer aspect-square bg-space-800 transition-all"
    >
      <img
        src={photo.img_src}
        alt={`Mars - ${photo.camera.full_name}`}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-space-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-star text-xs font-mono truncate">{photo.camera.full_name}</p>
          <p className="text-star-dim text-xs">{photo.earth_date}</p>
        </div>
      </div>
    </m.div>
  )
}
