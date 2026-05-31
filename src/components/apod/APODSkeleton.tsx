export function APODSkeleton() {
  return (
    <div className="grid lg:grid-cols-2 gap-8 animate-pulse">
      <div className="rounded-2xl bg-space-800 aspect-video" />
      <div className="space-y-4">
        <div className="h-3 bg-space-800 rounded w-24" />
        <div className="h-8 bg-space-800 rounded w-3/4" />
        <div className="space-y-2">
          <div className="h-4 bg-space-800 rounded" />
          <div className="h-4 bg-space-800 rounded" />
          <div className="h-4 bg-space-800 rounded w-5/6" />
          <div className="h-4 bg-space-800 rounded w-4/6" />
        </div>
      </div>
    </div>
  )
}
