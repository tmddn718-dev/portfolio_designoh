import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// 포트폴리오의 핵심 메시지는 한 장면에만 집중시킨다.
gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const root = useRef<HTMLElement>(null)
  useLayoutEffect(() => {
    const q = gsap.utils.selector(root)
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.set(q('[data-cx]'), { opacity: 0, y: 16 })
      gsap.set(q('[data-arrow]'), { opacity: 0, x: -24 })
      gsap.set(q('[data-fill]'), { clipPath: 'inset(-30% 100% -30% 0)' })
      gsap.set(q('[data-ol]'), { opacity: 1 })
      gsap.set(q('[data-copy]'), { opacity: 0, y: 16 })
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .to(q('[data-cx]'), { opacity: 1, y: 0, duration: 0.7 })
        .to(q('[data-arrow]'), { opacity: 1, x: 0, duration: 0.5 }, '-=0.3')
        .to(q('[data-fill]'), { clipPath: 'inset(-30% -10% -30% 0)', duration: 0.8, ease: 'power2.inOut' }, '-=0.2')
        .set(q('[data-ol]'), { opacity: 0 })
        .to(q('[data-copy]'), { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }, '-=0.3')
      // 스크롤하면 헤드라인은 천천히 위로 사라지고 배경 격자는 더 느리게 따라온다
      gsap.to(q('[data-parallax]'), { yPercent: -14, opacity: 0.15, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } })
      gsap.to(q('[data-grid]'), { yPercent: 12, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } })
    })
    mm.add('(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)', () => {
      const section = root.current
      const title = section?.querySelector<HTMLElement>('[data-hero-title]')
      const complexity = section?.querySelector<HTMLElement>('[data-cx]')
      const arrow = section?.querySelector<HTMLElement>('[data-arrow]')
      const clarity = section?.querySelector<HTMLElement>('[data-clarity]')
      const glow = section?.querySelector<HTMLElement>('[data-hero-glow]')
      if (!section || !title || !complexity || !arrow || !clarity || !glow) return

      const complexityX = gsap.quickTo(complexity, 'x', { duration: 0.5, ease: 'power3.out' })
      const complexityY = gsap.quickTo(complexity, 'y', { duration: 0.5, ease: 'power3.out' })
      const clarityX = gsap.quickTo(clarity, 'x', { duration: 0.45, ease: 'power3.out' })
      const clarityY = gsap.quickTo(clarity, 'y', { duration: 0.45, ease: 'power3.out' })
      const arrowX = gsap.quickTo(arrow, 'x', { duration: 0.4, ease: 'power3.out' })
      const arrowY = gsap.quickTo(arrow, 'y', { duration: 0.4, ease: 'power3.out' })
      const arrowRotation = gsap.quickTo(arrow, 'rotation', { duration: 0.45, ease: 'power3.out' })
      const glowX = gsap.quickTo(glow, 'x', { duration: 0.65, ease: 'power3.out' })
      const glowY = gsap.quickTo(glow, 'y', { duration: 0.65, ease: 'power3.out' })

      const move = (event: PointerEvent) => {
        const titleRect = title.getBoundingClientRect()
        const sectionRect = section.getBoundingClientRect()
        const nx = (event.clientX - titleRect.left) / titleRect.width - 0.5
        const ny = (event.clientY - titleRect.top) / titleRect.height - 0.5
        complexityX(nx * -20)
        complexityY(ny * -12)
        clarityX(nx * 24)
        clarityY(ny * 14)
        arrowX(nx * 10)
        arrowY(ny * 8)
        arrowRotation(nx * 8)
        glowX(event.clientX - sectionRect.left)
        glowY(event.clientY - sectionRect.top)
      }
      const enter = () => {
        title.classList.add('is-active')
        gsap.to(glow, { opacity: 0.55, scale: 1, duration: 0.35, ease: 'power2.out' })
      }
      const leave = () => {
        title.classList.remove('is-active')
        complexityX(0); complexityY(0)
        clarityX(0); clarityY(0)
        arrowX(0); arrowY(0); arrowRotation(0)
        gsap.to(glow, { opacity: 0, scale: 0.78, duration: 0.45, ease: 'power2.out' })
      }

      title.addEventListener('pointerenter', enter)
      title.addEventListener('pointermove', move)
      title.addEventListener('pointerleave', leave)
      return () => {
        title.removeEventListener('pointerenter', enter)
        title.removeEventListener('pointermove', move)
        title.removeEventListener('pointerleave', leave)
      }
    })
    return () => mm.revert()
  }, [])

  return (
    <section ref={root} id="hero" data-dark className="relative -mt-12 flex min-h-[min(860px,92svh)] overflow-hidden bg-[#10110F] pt-12 text-white">
      <div aria-hidden data-grid className="grid-bg grid-bg-dark absolute inset-0" />
      <div aria-hidden data-hero-glow className="hero-pointer-glow" />
      <div data-parallax className="wrap gutter relative flex w-full flex-col justify-center py-14 md:py-20">
        <p data-copy className="mb-8 text-[13px] font-semibold uppercase tracking-[.16em] text-white/68 md:mb-10">Product Designer · UX/UI Portfolio / 2026</p>
        <h1 data-hero-title aria-label="Complexity → Clarity" className="hero-title text-[clamp(46px,14.5vw,64px)] font-extrabold leading-[0.98] tracking-[-0.05em] md:text-[clamp(88px,8.5vw,112px)]">
          <span data-cx data-text="Complexity" aria-hidden className="hero-outline outline-text block">Complexity</span>
          <span aria-hidden className="flex items-center gap-[0.1em]">
            <svg data-arrow viewBox="0 0 170 170" style={{ overflow: 'visible' }} className="h-[0.74em] w-auto shrink-0 text-white" fill="none" stroke="currentColor" strokeWidth="30" strokeLinejoin="miter" strokeMiterlimit="10"><path d="M0 85H146M66 5L146 85L66 165" /></svg>
            <span data-clarity className="hero-clarity relative inline-block">
              <span data-ol className="outline-text opacity-0">Clarity</span>
              <span data-fill className="absolute left-0 top-0 text-[#2997ff]">Clarity</span>
            </span>
          </span>
        </h1>
        <div className="mt-12 grid gap-7 md:mt-20 md:grid-cols-12 md:items-end">
          <div data-copy className="md:col-span-7">
            <p className="max-w-[27ch] text-[22px] font-semibold leading-[1.45] tracking-[-.025em] md:text-[30px]">복잡한 사용자 경험을 명확한 선택으로 바꾸는 프로덕트 디자이너</p>
            <p className="mt-4 max-w-[54ch] text-[15px] leading-[1.75] text-white/72 md:text-[17px]">문제를 발견하고, 동작하는 프로토타입으로 검증하며, 사용자가 더 쉽게 결정할 수 있는 경험을 설계합니다.</p>
          </div>
          <div data-copy className="md:col-span-5 md:flex md:justify-end">
            <Link to="/#story" className="inline-flex min-h-12 items-center gap-3 rounded-full bg-[#2997ff] px-6 text-[15px] font-semibold text-white shadow-[0_10px_30px_rgba(41,151,255,.22)] hover:-translate-y-0.5 hover:bg-[#1689ed]">Explore Work <span aria-hidden>↓</span></Link>
          </div>
        </div>
      </div>
    </section>
  )
}
