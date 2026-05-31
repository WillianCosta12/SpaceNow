import { Telescope, Github } from 'lucide-react'
import { useLang } from '../../contexts/LangContext'
import { t } from '../../i18n'

export function Footer() {
  const { lang } = useLang()
  const tr       = t[lang]

  return (
    <footer className="border-t border-space-700 py-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-star-muted">
          <Telescope className="w-4 h-4 text-nebula-light" />
          <span className="text-sm font-display">SpaceNow</span>
          <span className="text-star-dim text-xs">{tr.footer.data}</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/WillianCosta12"
            target="_blank"
            rel="noopener noreferrer"
            className="text-star-muted hover:text-star transition-colors"
          >
            <Github className="w-4 h-4" />
          </a>
          <span className="text-star-dim text-xs font-mono">
            Willian Costa · {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </footer>
  )
}
