import { useState } from 'react'
import { Zoomable } from './Modal'
import { onBrand } from './case'

// 긴 UI 화면을 읽기 쉽게 보여주는 공통 조각. 모두 원본 에셋만 쓰고, 확대는 Zoomable(Esc·포커스 복귀·세로 스크롤)에 맡긴다.
export { default as BeforeAfterComparison } from './BeforeAfter'

/** 원본 이미지 안의 영역(%). x·y는 왼쪽 위, w·h는 크기 */
export type Region = { x: number; y: number; w: number; h: number }

// 1) 단일 긴 화면: 원본 비율 그대로 전체를 보여주고, 누르면 확대 화면에서 위아래로 스크롤한다(축소·크롭 없음).
export function LongScreenViewer({ src, alt, caption, className = '' }: { src: string; alt: string; caption?: string; className?: string }) {
  return (
    <figure className={className}>
      <Zoomable src={src} big={src} alt={alt} caption={caption ?? alt} className="w-full" imgClass="block w-full rounded-[14px] border border-grid bg-white" />
      {caption && <figcaption className="mt-3 text-[14px] text-sub">{caption}<span className="block text-[13px]">눌러서 전체 화면을 스크롤해요</span></figcaption>}
    </figure>
  )
}

// 2) 핵심 영역 확대: 왼쪽은 원본 전체(설계 영역을 테두리로 표시), 오른쪽은 같은 원본의 해당 영역을 확대. 번호로 둘을 잇는다.
export function UIFocusDetail({ src, alt, region, color, n = 1, title, why, caption, className = '' }: { src: string; alt: string; region: Region; color: string; n?: number; title: string; why: string; caption?: string; className?: string }) {
  const [ratio, setRatio] = useState(2.2) // 원본 높이/너비. 불러온 뒤 실제 값으로 바뀐다
  const { x, y, w, h } = region
  const badge = <span aria-hidden className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[13px] font-bold" style={{ background: color, color: onBrand(color) }}>{n}</span>
  return (
    <figure className={className}>
      <div className="grid grid-cols-[42%_1fr] items-start gap-3 sm:gap-6 md:gap-8">
        <div>
          <p className="mb-2 text-[13px] font-bold text-sub">원본 전체 화면</p>
          <div className="relative">
            <Zoomable src={src} big={src} alt={alt} caption={caption ?? alt} className="w-full" imgClass="block w-full rounded-[10px] border border-grid bg-white" />
            {/* 테두리만 그려 실제 UI를 가리지 않는다 */}
            <span aria-hidden className="pointer-events-none absolute rounded-[6px]" style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%`, border: `2px solid ${color}` }}>
              <span className="absolute -left-2 -top-2 grid h-5 w-5 place-items-center rounded-full text-[11px] font-bold" style={{ background: color, color: onBrand(color) }}>{n}</span>
            </span>
            <img src={src} alt="" aria-hidden className="hidden" onLoad={e => setRatio(e.currentTarget.naturalHeight / e.currentTarget.naturalWidth)} />
          </div>
        </div>
        <div className="min-w-0">
          <p className="mb-2 text-[13px] font-bold" style={{ color: `color-mix(in srgb, ${color} 65%, black)` }}>확대한 영역</p>
          <div role="img" aria-label={`${title}: 원본 화면의 해당 영역을 확대한 모습`} className="relative overflow-hidden rounded-[12px] bg-white" style={{ border: `2px solid ${color}`, aspectRatio: `${w} / ${h * ratio}` }}>
            <img src={src} alt="" loading="lazy" className="absolute max-w-none" style={{ width: `${10000 / w}%`, left: `${-x * 100 / w}%`, top: `${-y * 100 / h}%` }} />
          </div>
        </div>
      </div>
      <figcaption className="mt-4 flex gap-3">{badge}<span className="min-w-0"><b className="block text-[16px] leading-snug">{title}</b><span className="mt-1 block text-[15px] leading-[1.65] text-sub">{why}</span></span></figcaption>
    </figure>
  )
}

export type SeqStep = { src: string; alt: string; title: string; body?: string; action?: string; decision?: string }

// 3) 여러 화면의 흐름: 단계 번호·제목·실제 화면·사용자 행동·설계 판단. 모바일은 한 화면씩 읽는 크기로 옆으로 넘기고 다음 카드가 살짝 보이게 한다.
export function ScreenSequence({ steps, color, label, className = '' }: { steps: SeqStep[]; color: string; label: string; className?: string }) {
  return (
    <div className={className}>
      <p className="text-[13px] text-sub sm:hidden" aria-hidden>{steps.length}단계 · 옆으로 넘겨 보기 →</p>
      <ol role="region" aria-label={`${label}, 모바일에서는 좌우로 탐색`} tabIndex={0} className="mt-3 -mx-5 flex snap-x snap-mandatory scroll-pl-5 gap-4 overflow-x-auto px-5 pb-4 sm:mx-0 sm:mt-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 lg:grid-cols-[repeat(auto-fit,minmax(160px,1fr))]">
        {steps.map((s, i) => (
          <li key={s.src} className="w-[74vw] max-w-[280px] shrink-0 snap-start sm:w-auto sm:max-w-none">
            <div className="flex items-center gap-2">
              <span aria-hidden className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[13px] font-bold tabular-nums" style={{ background: color, color: onBrand(color) }}>{i + 1}</span>
              <p className="text-[16px] font-bold leading-snug">{s.title}</p>
            </div>
            <Zoomable src={s.src} alt={s.alt} caption={`${i + 1} · ${s.title}`} className="phone-light mt-3 w-full" imgClass="screen" />
            {s.body && <p className="mt-3 text-[14px] leading-[1.65] text-sub">{s.body}</p>}
            {s.action && <p className="mt-3 text-[14px] leading-[1.6]"><b className="text-[13px] text-sub">사용자 행동</b><br />{s.action}</p>}
            {s.decision && <p className="mt-2 text-[14px] leading-[1.6]"><b className="text-[13px]" style={{ color: `color-mix(in srgb, ${color} 65%, black)` }}>설계 판단</b><br />{s.decision}</p>}
          </li>
        ))}
      </ol>
    </div>
  )
}

export type CropSide = { src: string; alt: string; ratio: number; region: Region; mark: Region; caption: string }

// 4) 핵심 구간 좌우 비교: 긴 원본에서 같은 정보 맥락의 구간만 잘라(크롭) AS-IS 왼쪽 / TO-BE 오른쪽에 같은 크기로 놓는다.
// 크롭은 원본 이미지를 CSS로 자를 뿐 새 이미지를 만들지 않고, 누르면 원본 전체 화면을 AS-IS/TO-BE로 전환하며 스크롤해서 볼 수 있다.
export function CropCompare({ n, title, asis, tobe, decision, color, className = '' }: { n: string; title: string; asis: CropSide; tobe: CropSide; decision: string; color: string; className?: string }) {
  const pair = [{ src: asis.src, alt: asis.alt, tag: 'AS-IS', big: asis.src }, { src: tobe.src, alt: tobe.alt, tag: 'TO-BE', big: tobe.src }]
  const Crop = ({ side, i }: { side: CropSide; i: 0 | 1 }) => {
    const { x, y, w, h } = side.region, m = side.mark, after = i === 1
    const view = (
      <span className="relative block overflow-hidden rounded-[12px] border border-grid bg-white" style={{ aspectRatio: `${w} / ${h * side.ratio}` }}>
        <img src={side.src} alt={side.alt} loading="lazy" className="absolute max-w-none" style={{ width: `${10000 / w}%`, left: `${-x * 100 / w}%`, top: `${-y * 100 / h}%` }} />
        {/* 테두리만 그려 실제 UI를 가리지 않는다 */}
        <span aria-hidden className="pointer-events-none absolute rounded-[6px]" style={{ left: `${m.x}%`, top: `${m.y}%`, width: `${m.w}%`, height: `${m.h}%`, border: after ? `2.5px solid ${color}` : '2.5px dashed #555' }} />
      </span>
    )
    return <Zoomable src={side.src} alt={side.alt} caption={`${pair[i].tag} · ${side.caption}`} pair={pair} pairIndex={i} pairColor={color} className="w-full" trigger={view} />
  }
  return (
    <section aria-label={`Comparison ${n} ${title}`} className={className}>
      <p className="text-[13px] font-bold" style={{ color }}>Comparison {n}</p>
      <h4 className="mt-1 text-[20px] font-bold leading-snug md:text-[24px]">{title}</h4>
      <div className="mt-4 grid grid-cols-2 items-start gap-x-2 gap-y-2 sm:gap-x-4">
        <span className="inline-block w-fit rounded-full bg-[#e8e8e8] px-2.5 py-1 text-[13px] font-bold text-ink">AS-IS</span>
        <span className="inline-block w-fit rounded-full px-2.5 py-1 text-[13px] font-bold" style={{ background: color, color: onBrand(color) }}>TO-BE</span>
        <Crop side={asis} i={0} />
        <Crop side={tobe} i={1} />
        <p className="text-[13px] leading-[1.6] text-sub sm:text-[14px]">{asis.caption}</p>
        <p className="text-[13px] leading-[1.6] sm:text-[14px]">{tobe.caption}</p>
      </div>
      <p className="mt-4 rounded-[14px] p-4 text-[15px] leading-[1.65]" style={{ background: `color-mix(in srgb, ${color} 12%, white)` }}><b className="block text-[13px]" style={{ color: `color-mix(in srgb, ${color} 65%, black)` }}>디자인 판단</b>{decision}</p>
    </section>
  )
}
