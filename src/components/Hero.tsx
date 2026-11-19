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
    return () => mm.revert()
  }, [])

  return (
    <section ref={root} id="hero" data-dark className="relative -mt-12 flex min-h-[100dvh] overflow-hidden bg-[#10110F] pt-12 text-white">
      <div aria-hidden data-grid className="grid-bg grid-bg-dark absolute inset-0" />
      <div data-parallax className="wrap gutter relative flex w-full flex-col justify-center py-14 md:py-20">
        <p data-copy className="mb-8 text-[12px] font-semibold uppercase tracking-[.16em] text-white/60 md:mb-10">Product Design Portfolio / 2026</p>
        <h1 aria-label="Complexity → Clarity" className="text-[clamp(52px,15vw,64px)] font-extrabold leading-[0.98] tracking-[-0.05em] md:text-[clamp(88px,8.5vw,112px)]">
          <span data-cx aria-hidden className="outline-text block">Complexity</span>
          <span aria-hidden className="flex items-center gap-[0.1em]">
            <svg data-arrow viewBox="0 0 170 170" style={{ overflow: 'visible' }} className="h-[0.74em] w-auto shrink-0 text-white" fill="none" stroke="currentColor" strokeWidth="30" strokeLinejoin="miter" strokeMiterlimit="10"><path d="M0 85H146M66 5L146 85L66 165" /></svg>
            <span className="relative inline-block">
              <span data-ol className="outline-text opacity-0">Clarity</span>
              <span data-fill className="absolute left-0 top-0 text-[#2997ff]">Clarity</span>
            </span>
          </span>
        </h1>
        <div className="mt-12 grid gap-7 md:mt-20 md:grid-cols-12 md:items-end">
          <div data-copy className="md:col-span-7">
            <p className="max-w-[27ch] text-[22px] font-semibold leading-[1.45] tracking-[-.025em] md:text-[30px]">복잡한 사용자 경험을 명확한 선택으로 바꾸는 프로덕트 디자이너</p>
            <p className="mt-4 max-w-[54ch] text-[15px] leading-[1.75] text-white/62 md:text-[17px]">문제를 발견하고, 프로토타입으로 검증하며, 사용자가 더 쉽게 결정할 수 있는 경험을 설계합니다.</p>
          </div>
          <div data-copy className="md:col-span-5 md:flex md:justify-end">
            <Link to="/#story" className="inline-flex min-h-12 items-center gap-3 border-b border-white/45 text-[15px] font-semibold text-white hover:border-[#2997ff] hover:text-[#2997ff]">Explore Selected Work <span aria-hidden>↗</span></Link>
          </div>
        </div>
      </div>
    </section>
  )
}
