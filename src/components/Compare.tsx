import { Zoomable } from './Modal'
import { onBrand } from './case'

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
    <section aria-label={`${d.n} ${d.title}`} className="rounded-[24px] md:rounded-[28px] border border-grid bg-white p-3 sm:p-5 md:p-10">
      <p className="text-[13px] font-bold" style={{ color }}>{d.n}</p>
      <h3 className="mt-2 text-[24px] md:text-[34px] font-bold tracking-tight">{d.title}</h3>
      <p className="mt-2 text-[15px] md:text-[17px] text-sub max-w-[60ch]">{d.sub}</p>

      <div className="mt-6 md:mt-8 lg:grid lg:grid-cols-12 gap-6 md:gap-8 items-start">
        <div className="lg:hidden">
          {/* 모바일: AS-IS(왼쪽)와 대응하는 첫 TO-BE(오른쪽)를 좌우로 나란히. 나머지 TO-BE 화면은 아래 줄에 이어서 */}
          {/* 제목 줄과 이미지 줄을 한 격자의 같은 행에 놓아, 라벨이 몇 줄이든 두 이미지의 위·아래 위치가 같다 */}
          <div className="grid grid-cols-2 gap-x-2 sm:gap-x-3 gap-y-2 items-start">
            <div className="min-w-0"><span className="inline-block px-2.5 py-1 rounded-full text-[13px] font-bold bg-[#e8e8e8] text-ink">AS-IS</span><p className="mt-2 text-[13px] font-semibold leading-snug">{d.before.label}</p></div>
            <div className="min-w-0"><span className="inline-block px-2.5 py-1 rounded-full text-[13px] font-bold" style={{ background: color, color: onBrand(color) }}>TO-BE · {d.afters[0].tag}</span><p className="mt-2 text-[13px] font-semibold leading-snug">{d.afters[0].label}</p></div>
            {d.before.src
              ? <div className="min-w-0 rounded-[16px] bg-[#f5f5f7] p-1.5"><Zoomable src={d.before.src} alt={d.before.alt} caption={`AS-IS · ${d.before.label}`} pair={[{ src: d.before.src, alt: d.before.alt, tag: 'AS-IS' }, { src: d.afters[0].src, alt: d.afters[0].alt, tag: `TO-BE ${d.afters[0].tag}` }]} pairColor={color} className="w-full" imgClass="w-full rounded-[12px] border border-grid bg-white" /></div>
              : <div className="rounded-[16px] border border-dashed border-line aspect-[390/844] grid place-items-center text-center text-[13px] text-sub p-2">[추가 자료 필요]</div>}
            <div className="min-w-0 rounded-[16px] bg-[#f5f5f7] p-1.5"><Zoomable src={d.afters[0].src} alt={d.afters[0].alt} caption={`TO-BE ${d.afters[0].tag} · ${d.afters[0].label}`} pair={d.before.src ? [{ src: d.before.src, alt: d.before.alt, tag: 'AS-IS' }, { src: d.afters[0].src, alt: d.afters[0].alt, tag: `TO-BE ${d.afters[0].tag}` }] : undefined} pairIndex={1} pairColor={color} className="w-full" imgClass="w-full rounded-[12px] border border-grid bg-white" /></div>
          </div>
          {d.afters.length > 1 && <>
            <p className="mt-5 text-[13px] font-bold" style={{ color: `color-mix(in srgb, ${color} 65%, black)` }}>이어지는 TO-BE 화면</p>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:gap-3 items-start">
              {d.afters.slice(1).map(a => (
                <figure key={a.src} className="min-w-0">
                  <span className="inline-block px-2.5 py-1 rounded-full text-[13px] font-bold" style={{ background: color, color: onBrand(color) }}>TO-BE · {a.tag}</span>
                  <p className="mt-2 text-[13px] font-semibold leading-snug">{a.label}</p>
                  <div className="mt-2 rounded-[16px] bg-[#f5f5f7] p-1.5"><Phone src={a.src} alt={a.alt} caption={`TO-BE ${a.tag} · ${a.label}`} /></div>
                </figure>
              ))}
            </div>
          </>}
        </div>
        <div className="hidden lg:grid lg:col-span-8 lg:grid-cols-3 gap-6 items-start" role="group" aria-label="기존과 개선 화면">
          <figure className="min-w-0">
            <span className="inline-block px-3 py-1 rounded-full text-[13px] font-bold bg-[#e8e8e8] text-ink">AS-IS</span>
            <p className="mt-2 min-h-[2.8em] text-[14px] font-semibold">{d.before.label}</p>
            {d.before.src
              ? <div className="mt-3 rounded-[16px] bg-[#f5f5f7] p-2 md:p-3"><Phone src={d.before.src} alt={d.before.alt} caption={`AS-IS · ${d.before.label}`} /></div>
              : <div className="mt-3 rounded-[16px] border border-dashed border-line aspect-[390/844] grid place-items-center text-center text-[13px] text-sub p-3">[추가 자료 필요]<br />고화질 AS-IS 캡처</div>}
          </figure>
          {d.afters.map(a => (
            <figure key={a.src} className="min-w-0">
              <span className="inline-block px-3 py-1 rounded-full text-[13px] font-bold" style={{ background: color, color: onBrand(color) }}>TO-BE · {a.tag}</span>
              <p className="mt-2 min-h-[2.8em] text-[14px] font-semibold">{a.label}</p>
              <div className="mt-3 rounded-[16px] bg-[#f5f5f7] p-2 md:p-3"><Phone src={a.src} alt={a.alt} caption={`TO-BE ${a.tag} · ${a.label}`} /></div>
            </figure>
          ))}
        </div>
        <div className="mt-6 lg:mt-0 lg:col-span-4 rounded-[24px] bg-[#f3f4f6] p-5 md:p-6">
          <p className="text-[14px] font-bold text-[#555]">현재 당근 앱</p>
          <ol className="mt-3 space-y-3">{d.current.map((t, i) => <li key={t} className="flex gap-2.5 text-[14px] leading-[1.55]"><span className="grid place-items-center shrink-0 w-6 h-6 rounded-full text-[13px] font-bold text-white bg-[#555]">{i + 1}</span><span>{t}</span></li>)}</ol>
          <p className="mt-6 pt-5 border-t border-black/10 text-[14px] font-bold" style={{ color: `color-mix(in srgb, ${color} 65%, black)` }}>개선안</p>
          <ol className="mt-3 space-y-3">{d.improved.map((t, i) => <li key={t} className="flex gap-2.5 text-[14px] leading-[1.55]"><span className="grid place-items-center shrink-0 w-6 h-6 rounded-full text-[13px] font-bold" style={{ background: color, color: onBrand(color) }}>{i + 1}</span><span>{t}</span></li>)}</ol>
        </div>
      </div>
    </section>
  )
}
