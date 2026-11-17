import { useEffect, useState } from 'react'
import Reveal from './Reveal'

export const chapters = [['c1', 'Hero'], ['c2', 'Challenge'], ['c3', 'Decisions'], ['c4', 'Experience'], ['c5', 'Outcome']]
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

export function ChapterNav({ active, list = chapters }: { active: string; list?: string[][] }) {
  return (
    <nav aria-label="챕터" className="sticky top-16 z-30 bg-white/95 border-b border-grid">
      <ol className="wrap gutter flex gap-6 overflow-x-auto text-[13px]">
        {list.map(([id, label], i) => (
          <li key={id}><a href={`#${id}`} aria-current={active === id ? 'true' : undefined}
            className={`block py-3 whitespace-nowrap border-b-2 ${active === id ? 'border-ink text-ink font-semibold' : 'border-transparent text-sub hover:text-ink'}`}>0{i + 1} {label}</a></li>
        ))}
      </ol>
    </nav>
  )
}

export function ChapterHead({ n, label, title, color }: { n: string; label: string; title: string; color: string }) {
  return (
    <Reveal>
      <div className="rule pt-4" style={{ borderColor: `color-mix(in srgb, ${color} 35%, white)` }}><span className="sr-only">챕터 {n}: {label}</span></div>
      <h2 className="mt-4 text-[32px] md:text-[56px] font-extrabold tracking-tight leading-[1.08] max-w-[22ch]">{title}</h2>
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
