interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'outline'
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  const base = 'text-xs font-mono px-3 py-1 rounded-full'
  const variants = {
    default: `${base} bg-nebula-muted border border-nebula-border text-nebula-light`,
    outline: `${base} border border-space-600 text-star-dim`,
  }
  return <span className={variants[variant]}>{children}</span>
}
