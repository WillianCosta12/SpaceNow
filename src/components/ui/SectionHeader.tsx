import { m } from '../../lib/motion'
import { useReducedMotion } from '../../hooks/useReducedMotion'

interface SectionHeaderProps {
  eyebrow: string
  title: string
  subtitle?: string
}

export function SectionHeader({ eyebrow, title, subtitle }: SectionHeaderProps) {
  const reducedMotion = useReducedMotion()
  const instant       = { duration: 0, delay: 0 }

  return (
    <div className="mb-10">
      <m.p
        initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={reducedMotion ? instant : undefined}
        className="text-nebula-light text-sm font-mono uppercase tracking-widest mb-3"
      >
        {eyebrow}
      </m.p>
      <m.h2
        initial={{ opacity: 0, y: reducedMotion ? 0 : 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={reducedMotion ? instant : { delay: 0.1 }}
        className="font-display text-3xl sm:text-4xl font-bold text-star mb-3"
      >
        {title}
      </m.h2>
      {subtitle && (
        <m.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={reducedMotion ? instant : { delay: 0.2 }}
          className="text-star-muted max-w-xl leading-relaxed"
        >
          {subtitle}
        </m.p>
      )}
    </div>
  )
}
