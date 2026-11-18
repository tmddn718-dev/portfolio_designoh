import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { projects, profile } from '../data/projects'
import Reveal from './Reveal'

// 표지 그대로: outline Complexity → 화살표 → 파란 Clarity. 애플 미디어 히어로처럼 블랙 풀블리드로 시작한다.
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
    <section ref={root} id="hero" data-dark className="relative overflow-hidden min-h-[100svh] -mt-12 pt-12 flex bg-black text-white">
      <div aria-hidden className="grid-bg grid-bg-dark absolute inset-0" />
      <div className="relative w-full px-5 md:px-[6.25vw] flex flex-col justify-center py-14 md:py-20">
        <h1 aria-label="Complexity → Clarity" className="font-extrabold leading-[0.98] tracking-[-0.05em] text-[clamp(52px,17.5vw,96px)] md:text-[11.6vw]">
          <span data-cx aria-hidden className="outline-text block">Complexity</span>
          <span aria-hidden className="flex items-center gap-[0.1em]">
            <svg data-arrow viewBox="0 0 170 170" className="h-[0.74em] w-auto shrink-0 text-white" fill="none" stroke="currentColor" strokeWidth="30" strokeLinejoin="miter" strokeMiterlimit="10"><path d="M0 85H146M66 5L146 85L66 165" /></svg>
            <span className="relative inline-block">
              <span data-ol className="outline-text opacity-0">Clarity</span>
              <span data-fill className="absolute left-0 top-0 text-[#2997ff]">Clarity</span>
            </span>
          </span>
        </h1>
        <div className="mt-12 md:mt-[7vw] flex items-end justify-between gap-6 flex-wrap">
          <p data-copy className="text-[24px] md:text-[2.3vw] leading-[1.5] font-normal">
            복잡한 정보를<br />사용자가 <span className="text-[#2997ff] font-bold">판단할 수 있는</span> 경험으로.
          </p>
          <div data-copy className="max-w-[34ch] md:text-right">
            <p className="text-[15px] font-bold tracking-wide">{profile.name} · Product Designer / UX·UI Designer</p>
            <p className="mt-2 text-[16px] leading-relaxed text-white/60">복잡한 문제를 명확한 사용자 경험과 완성도 높은 인터페이스로 해결합니다.</p>
            <Link to="/#highlights" className="pill mt-5 !min-h-[40px] !px-5 text-[15px]">작업 보기</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
