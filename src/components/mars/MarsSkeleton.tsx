export function MarsSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="aspect-square rounded-xl bg-space-800" />
      ))}
    </div>
  )
}
