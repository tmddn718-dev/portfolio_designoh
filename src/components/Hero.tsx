import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { projects } from '../data/projects'

// 표지 그대로: 얇은 그리드 위 outline Complexity → 검정 화살표 → 파란 Clarity, 하단 국문 카피.
// 첫 진입 때만 Complexity 가 나타나고 Clarity 가 outline 에서 파랑으로 채워진다.
export function HeroUI() {
  const items = projects.map(p => ({ p, src: p.mock.srcs[1], launched: p.slug === 'trigr' }))
  return (
    <section aria-label="프로젝트 한눈에 보기" className="wrap gutter -mt-2 md:-mt-6 relative z-10">
      <ul className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-5">
        {items.map(({ p, src, launched }) => (
          <li key={p.slug}>
            <Link to={`/work/${p.slug}`} className="group block rounded-[20px] overflow-hidden border border-grid bg-white">
              <div className="h-[170px] md:h-[210px] overflow-hidden" style={{ background: `color-mix(in srgb, ${launched ? '#DE5DE2' : p.accent} 16%, white)` }}>
                <img src={src} alt="" loading="lazy" className="w-[60%] mx-auto mt-6 rounded-t-[12px] object-cover object-top transition-transform duration-500 group-hover:-translate-y-1" />
              </div>
              <div className="p-4">
                <p className="text-[13px] text-sub">{launched ? 'Launched Product' : 'Personal Case Study'}</p>
                <p className="mt-1 text-[16px] font-bold leading-tight">{p.name}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

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
    <section ref={root} id="hero" className="relative overflow-hidden min-h-[calc(100svh-48px)] flex">
      <div aria-hidden className="grid-bg absolute inset-0" />
      <div className="relative w-full px-5 md:px-[6.25vw] flex flex-col justify-center py-14 md:py-20">
        <h1 aria-label="Complexity → Clarity" className="font-extrabold leading-[0.98] tracking-[-0.05em] text-[clamp(52px,17.5vw,96px)] md:text-[11.6vw]">
          <span data-cx aria-hidden className="outline-text block">Complexity</span>
          <span aria-hidden className="flex items-center gap-[0.1em]">
            <svg data-arrow viewBox="0 0 170 170" className="h-[0.74em] w-auto shrink-0 text-ink" fill="none" stroke="currentColor" strokeWidth="30" strokeLinejoin="miter" strokeMiterlimit="10"><path d="M0 85H146M66 5L146 85L66 165" /></svg>
            <span className="relative inline-block">
              <span data-ol className="outline-text opacity-0">Clarity</span>
              <span data-fill className="absolute left-0 top-0 text-blue">Clarity</span>
            </span>
          </span>
        </h1>
        <div className="mt-12 md:mt-[7vw] flex items-end justify-between gap-6 flex-wrap">
          <p data-copy className="text-[24px] md:text-[2.3vw] leading-[1.5] font-normal">
            복잡한 정보를<br />사용자가 <span className="text-blue font-bold">판단할 수 있는</span> 경험으로.
          </p>
          <div data-copy className="max-w-[34ch] md:text-right">
            <p className="text-[13px] font-semibold tracking-wide">Product Designer / UX·UI Designer</p>
            <p className="mt-2 text-[16px] leading-relaxed text-sub">복잡한 문제를 명확한 사용자 경험과 완성도 높은 인터페이스로 해결합니다.</p>
            <Link to="/#work" className="inline-block mt-4 text-[16px] font-semibold text-bluetext py-2 border-b border-bluetext">Selected Work ↓</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
