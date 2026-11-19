import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

export const reducedMotion = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
export const finePointer = () => typeof matchMedia !== 'undefined' && matchMedia('(hover: hover) and (pointer: fine)').matches

// 홈에서만 부드러운 스크롤(Lenis). ScrollTrigger와 같은 틱으로 돌려서 핀·스크럽이 어긋나지 않게 한다.
export function useSmoothScroll() {
  useEffect(() => {
    if (reducedMotion()) return
    const lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 0.95 })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t: number) => lenis.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => { gsap.ticker.remove(tick); lenis.destroy() }
  }, [])
}

// [data-magnetic] 요소가 포인터 쪽으로 살짝 끌려오고, 떠나면 탄성 있게 돌아간다.
export function useMagnetic() {
  useEffect(() => {
    if (reducedMotion() || !finePointer()) return
    const cleanups: (() => void)[] = []
    document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach(el => {
      const strength = Number(el.dataset.magnetic) || 0.28
      const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' })
      const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' })
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect()
        xTo((e.clientX - (r.left + r.width / 2)) * strength)
        yTo((e.clientY - (r.top + r.height / 2)) * strength)
      }
      const leave = () => { gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1,0.45)' }) }
      el.addEventListener('pointermove', move)
      el.addEventListener('pointerleave', leave)
      cleanups.push(() => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); gsap.set(el, { x: 0, y: 0 }) })
    })
    return () => cleanups.forEach(f => f())
  }, [])
}
