import type { Project } from '../data/projects'
import { Zoomable } from './Modal'
import { onBrand } from './case'

// 슬라이더 없이 Before / After 를 같은 크기로 나란히 놓는 비교 보드.
// marks 가 있으면 화면 위에 바뀐 영역을 번호 박스로 표시하고, changes 표에서 번호별로 무엇이 어떻게 바뀌었는지 설명한다.
type Data = NonNullable<Project['beforeAfter']>[number]
const strip = (s: string, k: string) => s.replace(new RegExp(`^${k}\\s*:\\s*`), '')
export default function BeforeAfter({ data, color = '#3975f6', beforeLabel = 'AS-IS', afterLabel = 'TO-BE' }: { data: Data; color?: string; beforeLabel?: string; afterLabel?: string }) {
  const hasChanges = !!data.changes?.length
  const bef = hasChanges ? [] : data.points.filter(p => p.startsWith('Before')).map(p => strip(p, 'Before'))
  const aft = hasChanges ? [] : data.points.filter(p => p.startsWith('After')).map(p => strip(p, 'After'))
  const note = data.points.filter(p => !p.startsWith('Before') && !p.startsWith('After'))
  const pair = [{ src: data.before, alt: data.beforeAlt, tag: beforeLabel }, { src: data.after, alt: data.afterAlt, tag: afterLabel }]
  const Col = ({ src, alt, tag, list, after }: { src: string; alt: string; tag: string; list: string[]; after?: boolean }) => (
    <div className="min-w-0">
      <span className={`inline-block px-2.5 py-1 sm:px-3 rounded-full text-[13px] font-bold ${after ? '' : 'bg-[#e8e8e8] text-ink'}`} style={after ? { background: color, color: onBrand(color) } : undefined}>{tag}</span>
      <div className="mt-3 rounded-[16px] sm:rounded-[22px] bg-[#f5f5f7] p-1.5 sm:p-3 md:p-5">
        <div className="relative max-w-[320px] mx-auto">
          <Zoomable src={src} alt={alt} caption={`${tag} · ${alt}`} pair={pair} pairIndex={after ? 1 : 0} pairColor={color} className="w-full" imgClass="w-full rounded-[14px] border border-grid bg-white" />
          {data.marks?.filter(m => m.side === (after ? 'after' : 'before')).map(m => (
            <span key={m.n} aria-hidden className="pointer-events-none absolute rounded-[10px]" style={{ left: `${m.x}%`, top: `${m.y}%`, width: `${m.w}%`, height: `${m.h}%`, border: after ? `2.5px solid ${color}` : '2.5px dashed #111', background: after ? `color-mix(in srgb, ${color} 10%, transparent)` : 'rgba(0,0,0,.05)' }}>
              <span className="absolute -top-2 -left-2 sm:-top-3 sm:-left-3 grid place-items-center w-6 h-6 sm:w-7 sm:h-7 rounded-full text-[13px] font-bold text-white" style={{ background: after ? color : '#111' }}>{m.n}</span>
            </span>
          ))}
        </div>
      </div>
      {list.length > 0 && <ul className="mt-3 space-y-2 text-[14px] sm:text-[15px] leading-snug">{list.map(t => <li key={t} className="flex gap-2"><span aria-hidden className="mt-[9px] w-1.5 h-1.5 shrink-0 rounded-full" style={{ background: after ? color : '#9a9a9a' }} /><span>{t}</span></li>)}</ul>}
    </div>
  )
  return (
    <figure className="rounded-[20px] sm:rounded-[28px] border border-grid p-3 sm:p-4 md:p-8 bg-white">
      <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-8 items-start relative">
        <Col src={data.before} alt={data.beforeAlt} tag={beforeLabel} list={bef} />
        <span aria-hidden className="absolute left-1/2 top-[38%] -translate-x-1/2 z-10 hidden md:grid place-items-center w-11 h-11 rounded-full bg-white border border-grid text-[18px] shadow-sm">→</span>
        <Col src={data.after} alt={data.afterAlt} tag={afterLabel} list={aft} after />
      </div>
      {hasChanges && (
        <ol aria-label="바뀐 부분" className="mt-6 md:mt-8 space-y-3">
          {data.changes!.map(c => (
            <li key={c.n} className="rounded-[18px] bg-[#f5f5f7] p-4 md:p-5 md:grid md:grid-cols-[40px_1fr_1fr] gap-4 items-start">
              <span className="grid place-items-center w-8 h-8 rounded-full text-[14px] font-bold text-white" style={{ background: color }}>{c.n}</span>
              <p className="mt-3 md:mt-0 text-[15px] leading-[1.6]"><b className="block text-[13px] text-sub">{beforeLabel}</b>{c.before}</p>
              <p className="mt-3 md:mt-0 text-[15px] leading-[1.6]"><b className="block text-[13px]" style={{ color }}>{afterLabel}</b>{c.after}</p>
            </li>
          ))}
        </ol>
      )}
      {note.length > 0 && <figcaption className="mt-5 pt-4 rule text-[13px] text-sub">{note.join(' ')}</figcaption>}
    </figure>
  )
}
