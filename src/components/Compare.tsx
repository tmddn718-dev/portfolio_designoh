import { Zoomable } from './Modal'

// 한 장면(섹션)의 기존 vs 개선 비교: 왼쪽 기존 화면(빨간 박스=문제 위치) → 개선 화면들 → 오른쪽 변경 설명.
export type CompareData = {
  n: string; title: string; sub: string
  before: { src: string; alt: string; label: string }
  afters: { src: string; alt: string; tag: string; label: string }[]
  current: string[]; improved: string[]
}

export default function CompareSection({ d, color }: { d: CompareData; color: string }) {
  const Phone = ({ src, alt, caption }: { src: string; alt: string; caption: string }) => (
    <Zoomable src={src} alt={alt} caption={caption} className="w-full" imgClass="w-full rounded-[16px] border border-grid bg-white" />
  )
  return (
    <section aria-label={`${d.n} ${d.title}`} className="rounded-[28px] border border-grid bg-white p-5 md:p-10">
      <p className="text-[13px] font-bold" style={{ color }}>{d.n}</p>
      <h3 className="mt-2 text-[24px] md:text-[34px] font-bold tracking-tight">{d.title}</h3>
      <p className="mt-2 text-[15px] md:text-[17px] text-sub max-w-[60ch]">{d.sub}</p>

      <div className="mt-8 md:grid md:grid-cols-12 gap-6 md:gap-8 items-start">
        <div className="md:col-span-8 -mx-5 px-5 md:mx-0 md:px-0 flex md:grid md:grid-cols-3 gap-3 md:gap-6 items-start overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-2" role="group" aria-label="기존과 개선 화면 (좌우로 스크롤)">
          <figure className="min-w-0 shrink-0 w-[58%] sm:w-[40%] md:w-auto snap-start">
            <span className="inline-block px-3 py-1 rounded-full text-[13px] font-bold bg-ink text-white">BEFORE</span>
            <p className="mt-2 text-[14px] font-semibold">{d.before.label}</p>
            <div className="mt-3 rounded-[18px] bg-[#f5f5f7] p-2 md:p-3"><Phone src={d.before.src} alt={d.before.alt} caption={`BEFORE · ${d.before.label}`} /></div>
          </figure>
          {d.afters.map(a => (
            <figure key={a.src} className="min-w-0 shrink-0 w-[58%] sm:w-[40%] md:w-auto snap-start">
              <span className="inline-block px-3 py-1 rounded-full text-[13px] font-bold text-white" style={{ background: color }}>AFTER · {a.tag}</span>
              <p className="mt-2 text-[14px] font-semibold">{a.label}</p>
              <div className="mt-3 rounded-[18px] bg-[#f5f5f7] p-2 md:p-3"><Phone src={a.src} alt={a.alt} caption={`AFTER ${a.tag} · ${a.label}`} /></div>
            </figure>
          ))}
        </div>
        <div className="mt-6 md:mt-0 md:col-span-4 rounded-[20px] bg-[#f3f4f6] p-5 md:p-6">
          <p className="text-[14px] font-bold text-[#e5352b]">현재 당근 앱</p>
          <ol className="mt-3 space-y-3">{d.current.map((t, i) => <li key={t} className="flex gap-2.5 text-[14px] leading-[1.55]"><span className="grid place-items-center shrink-0 w-6 h-6 rounded-full text-[12px] font-bold text-white bg-[#e5352b]">{i + 1}</span><span>{t}</span></li>)}</ol>
          <p className="mt-6 pt-5 border-t border-black/10 text-[14px] font-bold" style={{ color }}>개선안</p>
          <ol className="mt-3 space-y-3">{d.improved.map((t, i) => <li key={t} className="flex gap-2.5 text-[14px] leading-[1.55]"><span className="grid place-items-center shrink-0 w-6 h-6 rounded-full text-[12px] font-bold text-white" style={{ background: color }}>{i + 1}</span><span>{t}</span></li>)}</ol>
        </div>
      </div>
    </section>
  )
}
