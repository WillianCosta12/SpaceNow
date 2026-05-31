import { useRef, useMemo, useEffect } from 'react'

interface Star {
  x: number
  y: number
  size: number
  baseOpacity: number
  speed: number
  offset: number
}

export function StarField() {
  const canvasRef     = useRef<HTMLCanvasElement>(null)
  const rafRef        = useRef<number>(0)
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const stars = useMemo<Star[]>(() =>
    Array.from({ length: 80 }, () => ({
      x:           Math.random(),
      y:           Math.random(),
      size:        Math.random() < 0.8 ? 1 : 2,
      baseOpacity: Math.random() * 0.7 + 0.1,
      speed:       3 + Math.random() * 4,
      offset:      Math.random() * Math.PI * 2,
    })),
  [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0

    function resize() {
      width         = canvas!.width  = window.innerWidth
      height        = canvas!.height = window.innerHeight
    }

    resize()
    window.addEventListener('resize', resize)

    if (reducedMotion) {
      ctx.clearRect(0, 0, width, height)
      for (const star of stars) {
        ctx.beginPath()
        ctx.arc(star.x * width, star.y * height, star.size / 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${star.baseOpacity.toFixed(3)})`
        ctx.fill()
      }
      return () => window.removeEventListener('resize', resize)
    }

    function draw(t: number) {
      if (document.visibilityState === 'hidden') {
        rafRef.current = requestAnimationFrame(draw)
        return
      }
      ctx!.clearRect(0, 0, width, height)
      for (const star of stars) {
        const pulse   = Math.sin(t / (star.speed * 1000) + star.offset)
        const opacity = star.baseOpacity * (0.5 + 0.5 * pulse)
        ctx!.beginPath()
        ctx!.arc(star.x * width, star.y * height, star.size / 2, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(255,255,255,${opacity.toFixed(3)})`
        ctx!.fill()
      }
      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafRef.current)
    }
  }, [stars, reducedMotion])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />
}
