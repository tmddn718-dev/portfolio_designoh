import type { Project } from '../data/projects'
import { Zoomable } from './Modal'

// 슬라이더 없이 Before / After 를 같은 크기로 나란히 놓는 비교 보드(유아이볼 갤러리 방식).
// points 는 'Before:'·'After:' 로 시작하는 문장을 각 열 아래에 나누고, 나머지는 각주로 둔다.
const strip = (s: string, k: string) => s.replace(new RegExp(`^${k}\\s*:\\s*`), '')
export default function BeforeAfter({ data, color = '#3975f6' }: { data: NonNullable<Project['beforeAfter']>[number]; color?: string }) {
  const bef = data.points.filter(p => p.startsWith('Before')).map(p => strip(p, 'Before'))
  const aft = data.points.filter(p => p.startsWith('After')).map(p => strip(p, 'After'))
  const note = data.points.filter(p => !p.startsWith('Before') && !p.startsWith('After'))
  const Col = ({ src, alt, tag, list, after }: { src: string; alt: string; tag: string; list: string[]; after?: boolean }) => (
    <div className="min-w-0">
      <span className={`inline-block px-3 py-1 rounded-full text-[13px] font-bold ${after ? 'text-white' : 'bg-[#e8e8e8] text-ink'}`} style={after ? { background: color } : undefined}>{tag}</span>
      <div className="mt-3 rounded-[22px] bg-[#f5f5f7] p-3 md:p-5"><div className="max-w-[320px] mx-auto">
        <Zoomable src={src} alt={alt} caption={`${tag} · ${alt}`} className="w-full" imgClass="w-full rounded-[14px] border border-grid bg-white" /></div>
      </div>
      {list.length > 0 && <ul className="mt-4 space-y-2 text-[15px] leading-snug">{list.map(t => <li key={t} className="flex gap-2"><span aria-hidden className="mt-[9px] w-1.5 h-1.5 shrink-0 rounded-full" style={{ background: after ? color : '#9a9a9a' }} /><span>{t}</span></li>)}</ul>}
    </div>
  )
  return (
    <figure className="rounded-[28px] border border-grid p-4 md:p-8 bg-white">
      <div className="grid grid-cols-2 gap-3 md:gap-8 items-start relative">
        <Col src={data.before} alt={data.beforeAlt} tag="BEFORE" list={bef} />
        <span aria-hidden className="absolute left-1/2 top-[38%] -translate-x-1/2 z-10 hidden md:grid place-items-center w-11 h-11 rounded-full bg-white border border-grid text-[18px] shadow-sm">→</span>
        <Col src={data.after} alt={data.afterAlt} tag="AFTER" list={aft} after />
      </div>
      {note.length > 0 && <figcaption className="mt-5 pt-4 rule text-[13px] text-sub">{note.join(' ')}</figcaption>}
    </figure>
  )
}
