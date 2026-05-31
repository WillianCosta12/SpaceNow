export function StarField() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {Array.from({ length: 80 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width:     `${Math.random() < 0.8 ? 1 : 2}px`,
            height:    `${Math.random() < 0.8 ? 1 : 2}px`,
            left:      `${Math.random() * 100}%`,
            top:       `${Math.random() * 100}%`,
            opacity:   Math.random() * 0.7 + 0.1,
            animation: `pulse ${3 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 4}s`,
          }}
        />
      ))}
    </div>
  )
}
