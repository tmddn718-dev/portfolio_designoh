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

export type CropSide = { src: string; alt: string; ratio: number; region: Region; mark?: Region; caption: string; full?: string }

// 4) 핵심 구간 좌우 비교: 긴 원본에서 같은 정보 맥락의 구간만 잘라(크롭) AS-IS 왼쪽 / TO-BE 오른쪽에 같은 크기로 놓는다.
// 크롭은 원본 이미지를 CSS로 자를 뿐 새 이미지를 만들지 않고, 누르면 원본 전체 화면을 AS-IS/TO-BE로 전환하며 스크롤해서 볼 수 있다.
export function CropCompare({ n, title, asis, tobe, decision, color, className = '' }: { n: string; title: string; asis: CropSide; tobe: CropSide; decision: string; color: string; className?: string }) {
  const pair = [asis, tobe].map((x, i) => ({ src: x.full ?? x.src, alt: x.alt, tag: i ? 'TO-BE' : 'AS-IS', big: x.full ? undefined : x.src }))
  const Crop = ({ side, i }: { side: CropSide; i: 0 | 1 }) => {
    const { x, y, w, h } = side.region, m = side.mark, after = i === 1
    const view = (
      <span className="relative block overflow-hidden rounded-[12px] border border-grid bg-white" style={{ aspectRatio: `${w} / ${h * side.ratio}` }}>
        <img src={side.src} alt={side.alt} loading="lazy" className="absolute max-w-none" style={{ width: `${10000 / w}%`, left: `${-x * 100 / w}%`, top: `${-y * 100 / h}%` }} />
        {/* 테두리만 그려 실제 UI를 가리지 않는다 */}
        {m && <span aria-hidden className="pointer-events-none absolute rounded-[6px]" style={{ left: `${m.x}%`, top: `${m.y}%`, width: `${m.w}%`, height: `${m.h}%`, border: after ? `2.5px solid ${color}` : '2.5px dashed #555' }} />}
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

export type FullSide = { src: string; alt: string; label: string; big?: string }

// 5) 전체 길이 비교: 같은 너비·원본 비율로 AS-IS(왼쪽, 위·본문 두 장을 이어 붙인 실제 길이)와 TO-BE(오른쪽, 접힌·펼친 상태)를 위에서부터 놓는다.
// 높이를 억지로 맞추지 않고, 오른쪽 아래 남는 자리는 children(설명)이 채운다. 누르면 세 화면을 AS-IS/TO-BE로 전환하며 확대한다.
export function FullLengthCompare({ asis, tobe, color, children, className = '' }: { asis: { top: string; body: string; alt: string; zoom: string; note: string }; tobe: FullSide[]; color: string; children?: React.ReactNode; className?: string }) {
  const pair = [{ src: asis.zoom, alt: asis.alt, tag: 'AS-IS' }, ...tobe.map((t, i) => ({ src: t.src, alt: t.alt, tag: i ? 'TO-BE 펼침' : 'TO-BE 접힘', big: t.big }))]
  const pill = (txt: string, after: boolean) => <span className="inline-block w-fit rounded-full px-2.5 py-1 text-[13px] font-bold" style={after ? { background: color, color: onBrand(color) } : { background: '#e8e8e8', color: '#111' }}>{txt}</span>
  return (
    <div className={`grid grid-cols-2 items-start gap-x-2 sm:gap-x-4 ${className}`}>
      <div className="min-w-0">
        {pill('AS-IS · 전체 길이', false)}
        <Zoomable src={asis.zoom} alt={asis.alt} caption={asis.alt} pair={pair} pairIndex={0} pairColor={color} className="mt-2 w-full" trigger={<span className="block overflow-hidden rounded-[12px] border border-grid bg-white"><img src={asis.top} alt={asis.alt} loading="lazy" className="block w-full" /><img src={asis.body} alt="" aria-hidden loading="lazy" className="block w-full" /></span>} />
        <p className="mt-2 text-[13px] leading-[1.6] text-sub sm:text-[14px]">{asis.note}</p>
      </div>
      <div className="min-w-0">
        {tobe.map((t, i) => (
          <div key={t.src} className={i ? 'mt-4' : ''}>
            {pill(`TO-BE · ${t.label}`, true)}
            <Zoomable src={t.src} alt={t.alt} caption={t.alt} pair={pair} pairIndex={i + 1} pairColor={color} className="mt-2 w-full" trigger={<img src={t.src} alt={t.alt} loading="lazy" className="block w-full rounded-[12px] border border-grid bg-white" />} />
          </div>
        ))}
        {children}
      </div>
    </div>
  )
}

// 6) Phone Frame Overflow with Continuous UI Content
// 레이어 1(UI): 긴 원본 한 장을 원본 너비·비율 그대로 한 번만 그린다. 폰 화면 안에서 시작해 프레임 아래로 같은 UI가 이어진다(자르거나 줄이지 않으므로 중복·누락·왜곡이 없다).
// 레이어 2(프레임): 실제 기기 높이(390:844)로 고정된 베젤·다이내믹 아일랜드·하단 홈 영역을 UI 앞에 겹친다. 콘텐츠 길이에 따라 늘어나지 않는다.
// 프레임 아래로 이어지는 길이는 extra(기기 높이 대비)까지만 보이고 끝에서 옅게 사라진다. 전체는 눌러서 확대해 세로로 볼 수 있다.
// 내부 스크롤 컨테이너가 아니라 페이지 흐름이며, 서로 다른 화면(상태)을 이어 붙일 때는 쓰지 않는다.
export function ExtendedPhoneScreen({ src, alt, ratio, zoomSrc, caption, extra = 0.5, className = '' }: { src: string; alt: string; ratio: number; zoomSrc?: string; caption?: string; extra?: number; className?: string }) {
  const bz = 2.5 // 베젤 두께(cqw)
  const devH = (844 / 390) * 100 // 기기 전체 높이(cqw)
  const imgH = (100 - bz * 2) * ratio // 원본 이미지가 화면 너비로 그려질 때의 높이(cqw)
  const vis = Math.min(imgH, devH - bz * 2 + devH * extra) // 보이는 UI 높이
  const cut = imgH > vis + 0.5
  const trigger = (
    <span className="relative block [container-type:inline-size]">
      <span className="block overflow-hidden bg-white" style={{ margin: `${bz}cqw ${bz}cqw 0`, height: `${vis}cqw`, borderRadius: '9.5cqw 9.5cqw 0 0', maskImage: cut ? 'linear-gradient(to bottom, #000 calc(100% - 34cqw), transparent)' : undefined, WebkitMaskImage: cut ? 'linear-gradient(to bottom, #000 calc(100% - 34cqw), transparent)' : undefined }}>
        <img src={src} alt={alt} loading="lazy" className="block w-full" style={{ aspectRatio: `1 / ${ratio}` }} />
      </span>
      <span aria-hidden className="pointer-events-none absolute left-0 right-0 top-0 block overflow-hidden" style={{ height: `${devH}cqw`, border: `${bz}cqw solid #121214`, borderRadius: '12cqw', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.22), 0 0 0 1px rgba(0,0,0,.5)' }}>
        <span className="absolute left-1/2 block h-[5.4cqw] w-[26cqw] -translate-x-1/2 rounded-full bg-black" style={{ top: '0.5cqw' }} />
        <span className="absolute inset-x-0 bottom-0 block h-[15cqw]" style={{ background: 'linear-gradient(to top, rgba(255,255,255,.97) 45%, rgba(255,255,255,0))' }} />
        <span className="absolute bottom-[2.6cqw] left-1/2 block h-[1.3cqw] w-[34cqw] -translate-x-1/2 rounded-full bg-[#15171c]" />
      </span>
    </span>
  )
  return (
    <figure className={className}>
      <Zoomable src={zoomSrc ?? src} big={zoomSrc ? undefined : src} alt={alt} caption={caption ?? alt} className="w-full" trigger={trigger} />
      {caption && <figcaption className="mt-3 text-[14px] text-sub">{caption}</figcaption>}
    </figure>
  )
}

export type PhoneSide = { src: string; alt: string; caption: string; label?: string; big?: boolean; ratio?: number }

// 7) 폰 목업 좌우 비교: AS-IS(왼쪽)와 TO-BE(오른쪽)를 같은 폰 프레임으로 나란히 보여준다. 누르면 AS-IS/TO-BE(+추가 화면)를 전환하며 확대한다.
export function PhoneCompare({ n, title, asis, tobe, extra = [], decision, color, className = '' }: { n?: string; title: string; asis: PhoneSide; tobe: PhoneSide; extra?: { src: string; alt: string; tag: string; big?: string }[]; decision?: string; color: string; className?: string }) {
  const pair = [{ src: asis.src, alt: asis.alt, tag: 'AS-IS' }, { src: tobe.src, alt: tobe.alt, tag: 'TO-BE', big: tobe.big ? tobe.src : undefined }, ...extra]
  // 두 프레임은 같은 비율로 통일한다(2.6 이하 화면은 더 긴 쪽에 맞추고, 그보다 긴 화면은 기본 기기 비율에서 위쪽만 보여준다). 더 짧은 화면은 자르지 않고 위쪽 정렬로 담는다.
  const cap = (r?: number) => (r && r <= 2.6 ? r : 2.164)
  const fr = Math.max(cap(asis.ratio), cap(tobe.ratio), 2.164)
  const frameRatio = fr * 0.948 + 0.052
  const Col = ({ side, i }: { side: PhoneSide; i: 0 | 1 }) => (
    <figure className="min-w-0">
      <span className="inline-block rounded-full px-2.5 py-1 text-[13px] font-bold" style={i ? { background: color, color: onBrand(color) } : { background: '#e8e8e8', color: '#111' }}>{i ? 'TO-BE' : 'AS-IS'}</span>
      <Zoomable src={side.src} alt={side.alt} caption={`${i ? 'TO-BE' : 'AS-IS'} · ${side.caption}`} pair={pair} pairIndex={i} pairColor={color} className="phone-light mt-3 w-full" imgClass="screen" frameRatio={frameRatio} imgFit={side.ratio && side.ratio < fr - 0.01 ? 'contain' : undefined} />
      <figcaption className="mt-3 text-[13px] leading-[1.6] sm:text-[14px]" style={i ? undefined : { color: 'var(--color-sub)' }}>{side.caption}</figcaption>
    </figure>
  )
  return (
    <section aria-label={`${n ? `Comparison ${n} ` : ''}${title}`} className={className}>
      {n && <p className="text-[13px] font-bold" style={{ color }}>Comparison {n}</p>}
      <h4 className="mt-1 text-[20px] font-bold leading-snug md:text-[24px]">{title}</h4>
      <div className="mx-auto mt-5 grid max-w-[640px] grid-cols-2 items-start gap-x-3 sm:gap-x-8">
        <Col side={asis} i={0} />
        <Col side={tobe} i={1} />
      </div>
      {decision && <p className="mx-auto mt-5 max-w-[640px] rounded-[14px] p-4 text-[15px] leading-[1.65]" style={{ background: `color-mix(in srgb, ${color} 12%, white)` }}><b className="block text-[13px]" style={{ color: `color-mix(in srgb, ${color} 65%, black)` }}>디자인 판단</b>{decision}</p>}
    </section>
  )
}

// 8) UIPopout: 실제 UI 조각(말풍선·카드·버튼 등)을 폰 목업보다 앞 레이어로 올려 경계 밖으로 돌출시킨다. 원본 UI는 그대로이고 부드러운 그림자만 더한다.
// 위치·너비는 className(퍼센트)으로 지정하며, 부모(폰을 감싼 relative 박스)의 좌우 여백 안에 들어오도록 호출하는 쪽에서 맞춘다. 과하게 반복하지 않는다.
export function UIPopout({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return <img src={src} alt={alt} loading="lazy" className={`pointer-events-none absolute z-20 h-auto drop-shadow-[0_12px_22px_rgba(24,36,58,.24)] ${className}`} />
}
