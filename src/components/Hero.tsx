import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { profile } from '../data/projects'

// 포트폴리오의 핵심 메시지는 한 장면에만 집중시킨다.
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
    })
    return () => mm.revert()
  }, [])

  return (
    <section ref={root} id="hero" data-dark className="relative -mt-12 flex min-h-[100dvh] overflow-hidden bg-[#10110F] pt-12 text-white">
      <div aria-hidden className="grid-bg grid-bg-dark absolute inset-0" />
      <div className="wrap gutter relative flex w-full flex-col justify-center py-14 md:py-20">
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
        <div className="mt-12 flex flex-col gap-8 md:mt-20 md:flex-row md:items-end md:justify-between">
          <p data-copy className="max-w-[26ch] text-[18px] font-normal leading-[1.6] md:text-[20px]">
            복잡한 정보를 사용자가 <span className="font-semibold text-[#2997ff]">판단할 수 있는</span> 경험으로.
          </p>
          <div data-copy className="max-w-[36ch] md:text-right">
            <p className="text-[14px] font-semibold tracking-wide text-white/85">{profile.name} · Product Designer / UX·UI Designer</p>
            <p className="mt-2 text-[15px] leading-[1.65] text-white/65">문제를 구조로 정리하고, 판단에 필요한 정보의 우선순위를 설계합니다.</p>
            <Link to="/#work" className="pill mt-5 !min-h-12 !px-6 text-[15px]">프로젝트 보기 ↓</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
