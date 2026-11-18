import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects } from '../data/projects'
import Compose, { type Dev } from './Compose'
import Reveal from './Reveal'
import Strip from './Strip'

gsap.registerPlugin(ScrollTrigger)

const shot = (slug: string, src: string) => (slug === 'nodi' ? '/images/nodi/s-recs.webp' : src)

// 애플 미디어 히어로 다음 장면: 큰 기기 묶음이 화면에 들어오며 커진다(스케일은 Layout 의 [data-scale] 이 처리)
export function Showcase() {
  const m = Object.fromEntries(projects.map(p => [p.slug, shot(p.slug, p.mock.srcs[1])]))
  const items: Dev[] = [
    { src: m['oliveyoung-todaydream'], kind: 'light', x: 3, y: 34, w: 17, r: -10, z: 1 },
    { src: m['karrot-large-furniture'], kind: 'light', x: 21, y: 18, w: 18, r: -5, z: 2 },
    { src: m['nodi'], kind: 'light', x: 40, y: 6, w: 20, z: 4, lift: 12 },
    { src: m['woorisai'], kind: 'light', x: 61, y: 18, w: 18, r: 5, z: 2 },
    { src: m['trigr'], kind: 'light', x: 80, y: 34, w: 17, r: 10, z: 1 },
  ]
  return (
    <section data-dark aria-label="작업 화면 모음" className="bg-black overflow-hidden">
      <div className="wrap gutter pt-4 md:pt-10">
        <div data-scale className="relative"><Compose items={items} className="aspect-[16/10] md:aspect-[16/6.4]" persp={1800} /><span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black to-transparent" /></div>
      </div>
    </section>
  )
}

// 애플 '일단 핵심부터' 하이라이트: 큰 라운드 카드를 가로로 넘겨 본다
export function Highlights() {
  return (
    <section id="highlights" data-dark className="bg-black text-white scroll-mt-16">
      <div className="wrap gutter pt-16 md:pt-28 pb-20 md:pb-32">
        <Reveal>
          <h2 className="apple-h text-[40px] md:text-[64px]">작업 5개, <span className="text-white/45">핵심부터.</span></h2>
        </Reveal>
        <div className="mt-10 md:mt-14">
          <Strip label="작업 5개" dark>
            {projects.map(p => (
              <Link key={p.slug} to={`/work/${p.slug}`} className="group relative block w-[78vw] max-w-[340px] md:max-w-[380px] h-[500px] md:h-[560px] rounded-[28px] overflow-hidden" style={{ background: `linear-gradient(160deg, color-mix(in srgb, ${p.slug === 'trigr' ? '#DE5DE2' : p.accent} 38%, #141414), #141414 72%)` }}>
                <div className="absolute inset-x-0 top-0 p-7 z-10">
                  <p className="text-[14px] text-white/60">{p.slug === 'trigr' ? '출시 서비스' : p.kind}</p>
                  <h3 className="mt-2 apple-h text-[30px] md:text-[34px]">{p.name}</h3>
                  <p className="mt-2 text-[16px] leading-snug text-white/75 max-w-[22ch]">{p.summary.short}</p>
                </div>
                <img src={shot(p.slug, p.mock.srcs[1])} alt="" loading="lazy" className="absolute left-1/2 -translate-x-1/2 top-[40%] w-[64%] rounded-t-[22px] object-cover object-top shadow-[0_30px_60px_-20px_rgba(0,0,0,.6)] transition-transform duration-700 ease-out group-hover:-translate-y-3" />
                <span className="absolute left-7 bottom-6 z-10 px-4 py-2 rounded-full bg-white text-black text-[14px] font-semibold">자세히 보기</span>
              </Link>
            ))}
          </Strip>
        </div>
      </div>
    </section>
  )
}

// 애플의 문장 하이라이트: 스크롤하면 단어가 차례로 밝아진다
export function Statement() {
  const ref = useRef<HTMLParagraphElement>(null)
  const text = '복잡한 정보를 사용자가 판단할 수 있는 경험으로. 출시한 서비스와 직접 설계한 서비스, 두 방향 모두 만들어 왔습니다.'
  useLayoutEffect(() => {
    const el = ref.current!
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(el.querySelectorAll('span'), { opacity: 0.22 }, { opacity: 1, ease: 'none', stagger: 0.12, scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 48%', scrub: true } })
    })
    return () => mm.revert()
  }, [])
  return (
    <section data-dark aria-label="소개 문장" className="bg-black text-white">
      <div className="wrap gutter py-24 md:py-40">
        <p ref={ref} className="apple-h text-[30px] md:text-[56px] max-w-[24ch]" style={{ lineHeight: 1.4 }}>{text.split(' ').map((w, i) => <span key={i} className="inline-block mr-[0.28em]">{w}</span>)}</p>
      </div>
    </section>
  )
}
