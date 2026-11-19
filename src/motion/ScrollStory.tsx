import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects } from '../data/projects'
import { reducedMotion } from './useMotion'

gsap.registerPlugin(ScrollTrigger)

type Step = { slug: string; shots: [string, string, string]; bg: string; fg: string; ghost: string }
const I = (d: string, ...n: string[]) => n.map(x => `/images/${d}/${x}.webp`) as [string, string, string]
const steps: Step[] = [
  { slug: 'oliveyoung-todaydream', shots: I('oliveyoung-todaydream', 'n-optC', 'n-altMethods', 'n-restock'), bg: '#C9F45A', fg: '#10210A', ghost: 'OPTIONS' },
  { slug: 'karrot-large-furniture', shots: I('karrot-large-furniture', 'f-b3', 'L-b1', 'f-b1').map(src => `${src}?v=20261119-safearea`) as [string, string, string], bg: '#F5DDC8', fg: '#2B1D16', ghost: 'DECIDE' },
  { slug: 'nodi', shots: I('nodi', 'hero-conds', 'full-scB', 'full-reasonB'), bg: '#D3DBFF', fg: '#17224C', ghost: 'NODI' },
  { slug: 'woorisai', shots: I('woorisai', 'home', 'detail', 'feed'), bg: '#E6E5D8', fg: '#263B2F', ghost: 'MEMORY' },
  { slug: 'trigr', shots: I('trigr', 't-reward', 't-list', 't-proof-detail'), bg: '#26142B', fg: '#FFFFFF', ghost: 'SHIPPED' },
]

// 스크롤하면 섹션이 고정되고, 프로젝트가 위로 닦이며(clip-path) 차례로 바뀌는 장면. 데스크톱·모션 허용일 때만 보인다.
export default function ScrollStory() {
  const sec = useRef<HTMLElement>(null)
  const [on, setOn] = useState(false)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const mq = matchMedia('(min-width: 900px)')
    const f = () => setOn(mq.matches && !reducedMotion())
    f(); mq.addEventListener('change', f)
    return () => mq.removeEventListener('change', f)
  }, [])

  useEffect(() => {
    if (!on) return
    const N = steps.length
    const st = ScrollTrigger.create({
      trigger: sec.current, start: 'top top+=48', end: () => `+=${Math.round(window.innerHeight * 0.85) * (N - 1) + 160}`,
      pin: true, anticipatePin: 1, invalidateOnRefresh: true,
      onUpdate: self => {
        const raw = Math.min(self.progress * (N - 1), N - 1)
        const i = Math.min(N - 1, Math.round(raw))
        setActive(prev => (prev === i ? prev : i))
        sec.current?.style.setProperty('--sp', String(raw - Math.floor(raw)))
        sec.current?.style.setProperty('--bar', String(self.progress))
      },
    })
    return () => st.kill(true)
  }, [on])

  if (!on) return null
  const by = (s: string) => projects.find(p => p.slug === s)!
  // 핀 고정 때 ScrollTrigger가 section을 감싸므로, React가 지울 수 있게 바깥에 고정된 div를 둔다
  return (
    <div>
    <section ref={sec} id="story" aria-label="프로젝트 한눈에 보기" className="relative h-[calc(100svh-48px)] overflow-hidden bg-[#FBFBFD]">
      <div className="wrap gutter grid h-full grid-cols-12 items-center gap-10">
        <div className="col-span-5">
          <p className="eyebrow text-bluetext">Projects at a glance</p>
          <p aria-hidden className="mt-3 text-[13px] font-semibold tabular-nums text-sub">0{active + 1} / 0{steps.length}</p>
          <ol className="mt-5 space-y-1">
            {steps.map((s, i) => {
              const p = by(s.slug)
              return (
                <li key={s.slug}>
                  <Link to={`/work/${p.slug}`} data-cursor="보기" className={`block text-[clamp(34px,4.3vw,68px)] font-black leading-[1.02] tracking-[-.05em] transition-[color,transform,opacity] duration-500 ease-out ${i === active ? 'translate-x-3 text-ink' : 'text-ink/20 hover:text-ink/55'}`}>
                    {p.name.replace(' 중고거래', '').replace(' 오늘드림', '')}
                  </Link>
                </li>
              )
            })}
          </ol>
          <div className="relative mt-8 h-[92px] max-w-[40ch]">
            {steps.map((s, i) => {
              const p = by(s.slug)
              return (
                <p key={s.slug} className={`absolute inset-0 text-[17px] leading-[1.6] text-ink/75 transition-all duration-700 ease-out ${i === active ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'}`}>
                  <span className="mb-1 block text-[13px] font-semibold text-sub">{p.kind} · {p.period}</span>{p.summary.short}
                </p>
              )
            })}
          </div>
          <div className="mt-6 h-[2px] w-40 overflow-hidden bg-black/10" aria-hidden><div className="h-full origin-left bg-ink" style={{ transform: 'scaleX(var(--bar, 0))' }} /></div>
        </div>

        <div className="relative col-span-7 h-[min(74svh,720px)] overflow-hidden rounded-[32px]">
          {steps.map((s, i) => (
            <div key={s.slug} aria-hidden className="story-layer absolute inset-0" style={{ zIndex: i, background: s.bg, color: s.fg, clipPath: i <= active ? 'inset(0% 0% 0% 0% round 32px)' : 'inset(100% 0% 0% 0% round 32px)' }}>
              <span className="absolute inset-x-0 bottom-[-6%] text-center text-[clamp(120px,17vw,260px)] font-black leading-none tracking-[-.07em] opacity-[.1]" style={{ transform: 'translateY(calc((0.5 - var(--sp)) * 40px))' }}>{s.ghost}</span>
              {[{ x: '8%', w: 25, y: 16, r: -7, d: 70 }, { x: '37%', w: 30, y: 6, r: 0, d: 36 }, { x: '69%', w: 25, y: 22, r: 7, d: 90 }].map((c, k) => (
                <div key={k} className="absolute" style={{ left: c.x, width: `${c.w}%`, top: `${c.y}%`, transform: `translateY(calc((0.5 - var(--sp)) * ${c.d}px)) rotate(${c.r}deg)` }}>
                  <div className="phone-pro" style={{ filter: 'drop-shadow(0 26px 40px rgba(0,0,0,.25))' }}><img src={s.shots[k === 0 ? 0 : k === 1 ? 1 : 2]} alt="" loading="lazy" className="screen" /></div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <p aria-hidden className="absolute bottom-5 left-1/2 -translate-x-1/2 text-[12px] font-semibold tracking-[.2em] text-sub">SCROLL ↓</p>
    </section>
    </div>
  )
}
