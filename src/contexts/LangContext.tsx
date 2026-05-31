import { createContext, useContext, useState, useEffect } from 'react'
import type { Lang } from '../i18n'

interface LangCtx { lang: Lang; toggleLang: () => void }

const LangContext = createContext<LangCtx>({ lang: 'pt', toggleLang: () => {} })

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('pt')
  const toggleLang = () => setLang(l => l === 'pt' ? 'en' : 'pt')

  useEffect(() => {
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en'
  }, [lang])

  return <LangContext.Provider value={{ lang, toggleLang }}>{children}</LangContext.Provider>
}

export const useLang = () => useContext(LangContext)
