import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { finePointer, reducedMotion } from './useMotion'

// 포인터를 따라다니는 원. [data-cursor="라벨"] 위에서는 커지며 라벨을 보여준다. 터치·모션 줄이기에서는 쓰지 않는다.
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (!finePointer() || reducedMotion()) return
    const el = ref.current!
    const xTo = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3' })
    const move = (e: PointerEvent) => { el.classList.add('show'); xTo(e.clientX); yTo(e.clientY) }
    const over = (e: PointerEvent) => {
      const t = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-cursor]')
      if (t) { label.current!.textContent = t.dataset.cursor ?? ''; el.classList.add('on') } else el.classList.remove('on')
    }
    const out = () => el.classList.remove('show')
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerover', over, { passive: true })
    document.addEventListener('pointerleave', out)
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerover', over); document.removeEventListener('pointerleave', out) }
  }, [])
  return <div ref={ref} aria-hidden className="cursor"><span ref={label} /></div>
}
