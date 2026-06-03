# 🚀 SpaceNow — Explorador de Dados Espaciais em Tempo Real

Aplicação web de exploração de dados espaciais usando as APIs públicas e gratuitas da NASA. Desenvolvida com React 18, TypeScript e Tailwind CSS.

**[🌐 Demo ao vivo](https://spacenow-willian.vercel.app)** · **[📡 NASA Open APIs](https://api.nasa.gov)**

---

## ✨ Funcionalidades

### 📸 APOD — Foto Astronômica do Dia
- Imagem ou vídeo diário publicado pela NASA com descrição científica
- Navegação por datas desde 16/06/1995
- Cache em memória para evitar requisições repetidas
- Link direto para o site oficial da NASA
- Download em alta resolução (HD)

### 🔴 Mars Rover — Galeria de Marte
- Fotos reais capturadas pelo Rover Curiosity na superfície de Marte
- Filtro por data (desde agosto de 2012)
- Filtro por câmera (Frontal, Traseira, Mastcam, ChemCam, MAHLI, MARDI, NavCam)
- Lightbox com navegação por teclado (←/→) e botão fechar
- Paginação de resultados
- Datas sugeridas com fotos garantidas

### 🛸 ISS Tracker — Rastreamento em Tempo Real
- Posição ao vivo da Estação Espacial Internacional
- Atualização automática a cada 5 segundos
- Rastro orbital dos últimos 20 pontos no mapa
- Mapa dark interativo (CartoDB Dark Matter)
- Painel com coordenadas, altitude, velocidade e horário
- Controles de zoom customizados para mobile

---

## 🛠️ Stack Técnica

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| Framework | Vite + React | 18.3.1 |
| Linguagem | TypeScript | 5.7 |
| Estilos | Tailwind CSS | 3.4 |
| Animações | Framer Motion (LazyMotion) | 11.15 |
| Mapa | React Leaflet | 4.2 |
| HTTP | Axios | 1.7 |
| Ícones | Lucide React | 0.469 |
| Deploy | Vercel | — |

---

## 🏗️ Arquitetura

```
src/
├── components/
│   ├── apod/          # APODSection, APODSkeleton
│   ├── iss/           # ISSSection, ISSMap, ISSStats
│   ├── mars/          # MarsSection, MarsPhotoCard, MarsSkeleton
│   ├── layout/        # Navbar, Footer
│   └── ui/            # StarField, SectionHeader, ErrorState, Badge
├── contexts/
│   └── LangContext.tsx  # Contexto de idioma (PT/EN)
├── hooks/
│   ├── useAPOD.ts       # Busca APOD com cache em memória
│   ├── useISS.ts        # Polling da ISS com AbortController
│   ├── useMarsPhotos.ts # Galeria de Marte com filtros
│   └── useReducedMotion.ts
├── i18n/
│   └── index.ts         # Traduções PT/EN de todas as strings da UI
├── lib/
│   └── motion.ts        # Re-export LazyMotion para bundle otimizado
├── services/
│   ├── nasa.ts          # Chamadas APOD e Mars (dev: direto, prod: proxy)
│   └── iss.ts           # Chamada ISS com suporte a AbortSignal
└── types/
    └── index.ts         # Interfaces TypeScript
api/
└── nasa.ts              # Serverless function Vercel (proxy da chave de API)
```

### Decisões arquiteturais

**Proxy serverless para a chave de API**
Em produção (Vercel), as chamadas para `api.nasa.gov` passam por `/api/nasa`, uma Edge Function que injeta a chave server-side. Em desenvolvimento, o serviço chama a NASA diretamente usando `VITE_NASA_API_KEY`. Isso evita que a chave apareça no bundle do cliente.

**LazyMotion**
O Framer Motion é carregado via `LazyMotion + domAnimation` em vez do bundle completo, reduzindo o chunk de animações em ~30%.

**Code splitting**
O Vite separa automaticamente: `vendor-react`, `vendor-motion`, `vendor-map` (Leaflet), `vendor-http` (Axios).

**AbortController no polling da ISS**
Cada intervalo de 5 segundos cria um novo `AbortController` e cancela a requisição anterior, evitando race conditions quando respostas chegam fora de ordem.

---

## 🚀 Instalação e uso

### Pré-requisitos
- Node.js 18+
- npm 9+
- Chave de API da NASA (gratuita em [api.nasa.gov](https://api.nasa.gov))

### 1. Clonar o repositório

```bash
git clone https://github.com/WillianCosta12/SpaceNow.git
cd SpaceNow
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env` e adicione sua chave da NASA:

```env
VITE_NASA_API_KEY=sua_chave_aqui
NASA_API_KEY=sua_chave_aqui
```

> **Como obter a chave:** Acesse [api.nasa.gov](https://api.nasa.gov), clique em "Generate API Key", preencha nome e e-mail. A chave aparece na tela imediatamente e é enviada por e-mail. Com a DEMO_KEY o limite é 30 req/hora; com chave própria, 1.000/hora.

### 4. Iniciar em desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

---

## 🌐 Deploy na Vercel

### Deploy automático via GitHub

1. Faça push do código para o GitHub
2. Acesse [vercel.com/new](https://vercel.com/new) e importe o repositório
3. Em **Environment Variables**, adicione:
   - `NASA_API_KEY` = sua chave real (sem o prefixo `VITE_`)
4. Clique em **Deploy**

### Deploy manual via CLI

```bash
npm install -g vercel
vercel --prod
```

> **Atenção:** Em produção, use apenas `NASA_API_KEY` (sem prefixo `VITE_`). A variável `VITE_` é somente para desenvolvimento local e não deve ser exposta em produção.

---

## 📜 Scripts disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Build de produção com Vite |
| `npm run build:check` | Build com verificação TypeScript completa |
| `npm run preview` | Preview do build de produção |
| `npm run lint` | Linting com ESLint |

---

## 🌍 Internacionalização

O app suporta Português (PT-BR) e English. O toggle de idioma fica na Navbar. As strings da UI estão em `src/i18n/index.ts`. O conteúdo das APIs (descrições da NASA, títulos das fotos) permanece no idioma original da fonte.

---

## ♿ Acessibilidade

- Labels `sr-only` em todos os inputs de data
- `role="dialog"` e `aria-modal` no lightbox com foco preso
- Navegação por teclado (←/→/Esc) no lightbox
- `role="button"` e `onKeyDown` nos cards de foto
- Suporte a `prefers-reduced-motion` em todas as animações
- Contraste mínimo WCAG AA em todas as combinações de cor

---

## 🔒 Segurança

- Chave da NASA protegida via proxy serverless em produção
- `.env` no `.gitignore` (nunca vai para o repositório)
- Validação do shape da resposta da API antes de processar
- Tratamento de erros específicos por código HTTP (400, 403, 429, 5xx)
- Timeout de 12–15s em todas as requisições

---

## 📡 APIs utilizadas

| API | Endpoint | Documentação |
|-----|----------|--------------|
| NASA APOD | `api.nasa.gov/planetary/apod` | [docs](https://api.nasa.gov/#apod) |
| NASA Mars Rover Photos | `api.nasa.gov/mars-photos/...` | [docs](https://api.nasa.gov/#mars-rover-photos) |
| Where the ISS at? | `api.wheretheiss.at/v1/satellites/25544` | [docs](https://wheretheiss.at/w/developer) |

---

## 👤 Autor

**Willian Costa**
- GitHub: [@WillianCosta12](https://github.com/WillianCosta12)
- Projeto criado para portfólio — demonstrando integração com APIs externas, TypeScript, UI/UX e deploy em produção.

---

## 📄 Licença

MIT — veja [LICENSE](LICENSE) para detalhes.
