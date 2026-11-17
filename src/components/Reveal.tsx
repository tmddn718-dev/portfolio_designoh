import { useEffect, useRef, type ReactNode } from 'react'

// 진입 시 opacity + translateY. IntersectionObserver 미지원/JS 실패 시 CSS 쪽에서 reduced-motion 이면 즉시 표시.
export default function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current!
    if (!('IntersectionObserver' in window)) return el.classList.add('in')
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('in'); io.disconnect() }
    }, { threshold: 0.12 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>
}
