import { SectionHeader } from '../ui/SectionHeader'
import { ErrorState } from '../ui/ErrorState'
import { ISSMap } from './ISSMap'
import { ISSStats } from './ISSStats'
import { useISS } from '../../hooks/useISS'
import { useLang } from '../../contexts/LangContext'
import { t } from '../../i18n'

export function ISSSection() {
  const { position, trail, loading, error } = useISS()
  const { lang } = useLang()
  const tr       = t[lang]

  return (
    <section id="iss" className="py-32 relative">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          eyebrow={tr.iss.eyebrow}
          title={tr.iss.title}
          subtitle={tr.iss.subtitle}
        />

        {error && <ErrorState message={tr.iss.error} />}

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 order-2 lg:order-1">
            <ISSMap position={position} trail={trail} loading={loading} />
          </div>
          <div className="order-1 lg:order-2">
            <ISSStats position={position} loading={loading} />
          </div>
        </div>
      </div>
    </section>
  )
}
