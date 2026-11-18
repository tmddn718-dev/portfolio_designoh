import { useEffect, useRef, type ElementType, type ReactNode } from 'react'

// 진입 시 opacity + translateY. stagger 면 자식이 차례로 등장한다. IntersectionObserver 미지원이면 즉시 표시.
export default function Reveal({ children, className = '', delay = 0, stagger = false, as: Tag = 'div' }: { children: ReactNode; className?: string; delay?: number; stagger?: boolean; as?: ElementType }) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = ref.current!
    if (!('IntersectionObserver' in window)) return el.classList.add('in')
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('in'); io.disconnect() }
    }, { threshold: 0.12 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return <Tag ref={ref} className={`reveal ${stagger ? 'stagger' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</Tag>
}
