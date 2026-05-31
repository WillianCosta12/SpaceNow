import { SectionHeader } from '../ui/SectionHeader'
import { ErrorState } from '../ui/ErrorState'
import { ISSMap } from './ISSMap'
import { ISSStats } from './ISSStats'
import { useISS } from '../../hooks/useISS'

export function ISSSection() {
  const { position, loading, error } = useISS()

  return (
    <section id="iss" className="py-32 relative">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          eyebrow="// 03 · international space station"
          title="ISS em Tempo Real"
          subtitle="Posição ao vivo da Estação Espacial Internacional. Atualiza automaticamente a cada 5 segundos."
        />

        {error && <ErrorState message={error} />}

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ISSMap position={position} loading={loading} />
          </div>
          <div>
            <ISSStats position={position} loading={loading} />
          </div>
        </div>
      </div>
    </section>
  )
}
