import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from './Reveal'
import { projects } from '../data/projects'

export const chapters = [['c1', '개요'], ['c2', '문제'], ['c3', '핵심 결정'], ['c4', '최종 화면'], ['c5', '검증']]
export const tintOf = (c: string, n: number) => `color-mix(in srgb, ${c} ${n}%, white)`
export const strongOf = (c: string) => `color-mix(in srgb, ${c} 62%, black)` // 밝은 서브컬러를 글자색으로 쓸 때

export function useActive(dep: unknown, list: string[][] = chapters) {
  const [active, setActive] = useState('c1')
  useEffect(() => {
    const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-40% 0px -55% 0px' })
    list.forEach(([id]) => { const el = document.getElementById(id); el && io.observe(el) })
    return () => io.disconnect()
  }, [dep])
  return active
}

function useProgress() {
  const [w, setW] = useState(0)
  useEffect(() => {
    const f = () => { const h = document.documentElement.scrollHeight - innerHeight; setW(h > 0 ? Math.min(100, (scrollY / h) * 100) : 0) }
    f(); addEventListener('scroll', f, { passive: true }); addEventListener('resize', f)
    return () => { removeEventListener('scroll', f); removeEventListener('resize', f) }
  }, [])
  return w
}

export function ChapterNav({ active, list = chapters, title, onCta }: { active: string; list?: string[][]; title?: string; onCta?: () => void }) {
  // 애플 로컬 내비: 제품명(좌) · 챕터 링크 + 파란 필(우), 글로벌 내비 바로 아래에 반투명으로 고정
  const w = useProgress()
  return (
    <nav aria-label="챕터" className="sticky top-14 z-30 pointer-events-none">
    <div className="wrap gutter"><div className="pointer-events-auto relative rounded-[18px] bg-[rgba(29,29,31,.95)] text-white backdrop-blur-xl overflow-hidden shadow-[0_10px_30px_-12px_rgba(0,0,0,.5)]">
      <div aria-hidden className="absolute left-0 bottom-0 h-[2px] bg-[#2997ff]" style={{ width: `${w}%` }} />
      <div className="px-5 flex items-center justify-between gap-4 h-[52px]">
        {title && <p className="hidden sm:block text-[19px] font-semibold tracking-tight shrink-0">{title}</p>}
        <ol className="flex items-center gap-5 overflow-x-auto text-[13px] min-w-0 flex-1 sm:flex-none">
          {list.map(([id, label]) => (
            <li key={id}><a href={`#${id}`} aria-current={active === id ? 'true' : undefined}
              className={`block py-3 whitespace-nowrap ${active === id ? 'text-white font-semibold' : 'text-white/60 hover:text-white'}`}>{label}</a></li>
          ))}
        </ol>
        {onCta && <button onClick={onCta} className="pill shrink-0">프로토타입</button>}
      </div>
    </div></div>
    </nav>
  )
}

export function ChapterHead({ n, label, title, color }: { n: string; label: string; title: string; color: string }) {
  return (
    <Reveal>
      <div className="rule pt-4" style={{ borderColor: `color-mix(in srgb, ${color} 35%, white)` }}><span className="sr-only">챕터 {n}: {label}</span></div>
      <h2 className="mt-4 apple-h text-[32px] md:text-[56px] max-w-[22ch]">{title}</h2>
    </Reveal>
  )
}

// 4개 상세 페이지 공용: 프로토타입 실행 영역
import type { Project } from '../data/projects'
import { ProtoFrame } from './Mockup'
export function InteractionPreview({ p, title, note, wide, onOpen }: { p: Project; title: string; note?: string; wide: boolean; onOpen: () => void }) {
  const S = strongOf(p.accent), T = (n: number) => tintOf(p.accent, n)
  if (!p.proto) return null
  return (
    <div className="mt-14 md:grid md:grid-cols-12 gap-10 items-center rounded-[28px] p-6 md:p-10" style={{ background: T(14) }}>
      <div className="md:col-span-6"><p className="eyebrow" style={{ color: S }}>Interaction preview</p><p className="mt-3 text-[28px] md:text-[32px] font-extrabold leading-tight tracking-tight">{title}</p>{note && <p className="mt-3 text-[16px] leading-relaxed text-sub">{note}</p>}</div>
      <div className="mt-8 md:mt-0 md:col-span-6 flex justify-center md:justify-end">{wide ? <ProtoFrame p={p} width={320} /> : <button onClick={onOpen} className="px-6 py-3 rounded-full bg-ink text-white text-[16px] font-semibold">프로토타입 실행</button>}</div>
    </div>
  )
}


// 스크롤하면 폰은 고정되고 화면만 바뀐다(애플 제품 스토리 방식). 모바일은 순서대로 쌓는다.
export type Step = { src: string; alt: string; title: string; body: string }
export function PinnedPhone({ steps, color, label }: { steps: Step[]; color: string; label: string }) {
  const [on, setOn] = useState(0)
  const refs = useRef<(HTMLLIElement | null)[]>([])
  useEffect(() => {
    const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && setOn(Number((e.target as HTMLElement).dataset.i))), { rootMargin: '-45% 0px -45% 0px' })
    refs.current.forEach(el => el && io.observe(el))
    return () => io.disconnect()
  }, [steps])
  return (
    <div className="md:grid md:grid-cols-2 md:gap-16" role="group" aria-label={label}>
      <ol className="md:order-1">
        {steps.map((s, i) => (
          <li key={s.title} ref={el => { refs.current[i] = el }} data-i={i} className={`stage-step md:min-h-[85vh] flex flex-col justify-center py-10 md:py-0 ${on === i ? 'on' : ''}`}>
            <p className="eyebrow" style={{ color }}>0{i + 1}</p>
            <h3 className="mt-3 apple-h text-[28px] md:text-[44px] max-w-[16ch]">{s.title}</h3>
            <p className="mt-4 text-[17px] md:text-[19px] leading-[1.6] text-ink/70 max-w-[32ch]">{s.body}</p>
            <div className="md:hidden mt-8 max-w-[260px]"><div className="phone-light"><img src={s.src} alt={s.alt} loading="lazy" className="screen" /></div></div>
          </li>
        ))}
      </ol>
      <div aria-hidden className="hidden md:block md:order-2">
        <div className="sticky top-[calc(50vh-300px)] mx-auto w-[280px]">
          <div className="phone-light"><div className="relative w-full h-full">{steps.map((s, i) => <img key={s.src} src={s.src} alt="" loading="lazy" className={`screen stage-screen ${on === i ? 'on' : ''}`} />)}</div></div>
        </div>
      </div>
    </div>
  )
}


// 채용 담당자용 30초 요약: 문제 · 내 역할 · 핵심 결정 · 검증 상태를 한 화면에서 읽게 한다.
const kindLabel = { launched: '출시', design: '설계안', evidence: '근거 일부' } as const
export function CaseSummary({ p }: { p: Project }) {
  const S = strongOf(p.accent)
  const cell = 'rounded-[20px] bg-white border border-grid p-5 md:p-6'
  const h = 'text-[13px] font-semibold text-sub'
  return (
    <section aria-label="30초 요약" className="bg-[#f5f5f7]">
      <div className="wrap gutter py-10 md:py-14">
        <p className="eyebrow" style={{ color: S }}>30초 요약</p>
        <Reveal stagger className="mt-5 grid md:grid-cols-12 gap-3 md:gap-4">
          <div className={`${cell} md:col-span-5`}><p className={h}>해결한 문제</p><p className="mt-2 text-[18px] md:text-[20px] font-bold leading-snug">{p.problem}</p></div>
          <div className={`${cell} md:col-span-4`}><p className={h}>내 역할</p><p className="mt-2 text-[17px] font-semibold leading-snug">{p.role}</p><p className="mt-1 text-[14px] text-sub">{p.period}</p><ul className="mt-3 flex flex-wrap gap-1.5">{p.tags.map(t => <li key={t} className="text-[13px] px-2.5 py-1 rounded-full bg-[#f5f5f7]">{t}</li>)}</ul></div>
          <div className={`${cell} md:col-span-3`}><p className={h}>검증 상태</p><span className="mt-2 inline-block px-3 py-1 rounded-full text-[13px] font-bold text-white" style={{ background: p.summary.kind === 'launched' ? '#111' : S }}>{kindLabel[p.summary.kind]}</span><p className="mt-3 text-[15px] leading-snug">{p.summary.status}</p></div>
          <div className={`${cell} md:col-span-12`}><p className={h}>핵심 결정</p><p className="mt-2 text-[20px] md:text-[26px] font-bold tracking-tight leading-snug max-w-[40ch]">{p.summary.decision}</p></div>
          <ul aria-label="컨셉 키워드" className="md:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">{p.summary.concept.map(([k, d], i) => <li key={k} className="rounded-[20px] p-5 md:p-6 text-white" style={{ background: `linear-gradient(160deg, color-mix(in srgb, ${p.accent} 45%, #111), #111 80%)` }}><p className="text-[13px] text-white/60">CONCEPT 0{i + 1}</p><p className="mt-3 apple-h text-[24px] md:text-[30px]">{k}</p><p className="mt-2 text-[14px] leading-snug text-white/75">{d}</p></li>)}</ul>
        </Reveal>
      </div>
    </section>
  )
}


// Behance 상위 포트폴리오의 INDEX 목록: 전체 작업을 이름·유형·기간으로 훑고 바로 이동
export function ProjectIndex({ current }: { current: string }) {
  return (
    <section aria-label="작업 목록" className="rule">
      <div className="wrap gutter py-14 md:py-20 md:grid md:grid-cols-12 gap-8">
        <h2 className="md:col-span-4 apple-h text-[32px] md:text-[48px]">INDEX.</h2>
        <ul className="mt-8 md:mt-0 md:col-span-8">
          {projects.map(p => (
            <li key={p.slug} className="rule">
              <Link to={`/work/${p.slug}`} aria-current={p.slug === current ? 'page' : undefined} className={`group flex items-baseline justify-between gap-4 py-5 ${p.slug === current ? 'text-ink' : 'text-ink/70 hover:text-ink'}`}>
                <span className="text-[20px] md:text-[26px] font-bold tracking-tight">{p.name}{p.slug === current && <span className="ml-3 text-[13px] font-semibold text-bluetext align-middle">현재 보는 작업</span>}</span>
                <span className="text-[13px] md:text-[14px] text-sub text-right">{p.slug === 'trigr' ? '출시 서비스' : p.kind} · {p.period}</span>
              </Link>
            </li>
          ))}
          <li className="rule" />
        </ul>
      </div>
    </section>
  )
}
