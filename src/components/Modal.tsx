import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode, type SyntheticEvent } from 'react'
import { onBrand } from './case'
import { karrotFull } from '../data/karrotBig'

// 네이티브 <dialog>: 포커스 가두기·Esc·배경 클릭 닫기, 닫히면 트리거로 포커스 복귀.
export function Modal({ open, onClose, label, children }: { open: boolean; onClose: () => void; label: string; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const d = ref.current!
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])
  return (
    <dialog ref={ref} aria-label={label} data-lenis-prevent className="modal" onClose={onClose}
      onClick={e => { if (e.target === ref.current) onClose() }}>
      {open && <div className="relative p-4 md:p-8">
        <button onClick={onClose} className="absolute right-4 top-4 md:right-8 md:top-8 z-10 px-4 py-3 rounded-full bg-white text-ink text-[14px] font-semibold">닫기</button>
        {children}
      </div>}
    </dialog>
  )
}

// 폰 프레임보다 조금 더 긴 화면(비율 2.17~2.6)은 아래가 잘리지 않게 프레임 높이를 이미지에 맞춘다. 더 긴 스크롤 화면은 의도적으로 위쪽만 보여준다.
function fitFrame(e: SyntheticEvent<HTMLImageElement>) {
  const img = e.currentTarget, btn = img.parentElement
  const r = img.naturalHeight / img.naturalWidth
  if (!btn || !btn.className.includes('phone-') || r <= 2.17 || r >= 2.6) return
  const pad = parseFloat(getComputedStyle(btn).paddingLeft) / btn.clientWidth
  btn.style.aspectRatio = `1 / ${r * (1 - 2 * pad) + 2 * pad}`
}

export type ZoomPair = { src: string; alt: string; tag: string }

// 이미지를 누르면 크게 보는 버튼형 이미지. pair(예: AS-IS / TO-BE)를 주면 확대 화면에서 두 이미지를 전환해 볼 수 있다(버튼·좌우 방향키).
export function Zoomable({ src, alt, caption, className = '', imgClass = '', big, pair, pairIndex = 0, pairColor }: { src: string; alt: string; caption?: string; className?: string; imgClass?: string; big?: string; pair?: ZoomPair[]; pairIndex?: number; pairColor?: string }) {
  const [open, setOpen] = useState(false)
  const [idx, setIdx] = useState(pairIndex)
  const cur = pair ? pair[idx] : { src, alt, tag: '' }
  const kf = big ? undefined : karrotFull(cur.src)
  const full = big ?? (kf && 'big' in kf ? kf.big : undefined)
  // 휴대폰 한 대 크기(화면 높이에 맞춰 줄여서 위아래가 잘리지 않게)에 상단·본문·하단을 따로 올려, 본문은 가운데에서만 스크롤한다
  const box = { width: 'min(390px, 92vw, calc(78vh * 780 / 1688))', aspectRatio: '780 / 1688', containerType: 'inline-size' as const }
  const scroller = 'absolute left-0 right-0 overflow-y-auto overscroll-contain [scrollbar-width:thin]'
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!pair) return
    if (e.key === 'ArrowLeft') setIdx(0)
    if (e.key === 'ArrowRight') setIdx(pair.length - 1)
  }
  return (
    <>
      <button type="button" className={`zoomable ${className}`} onClick={() => { setIdx(pairIndex); setOpen(true) }} aria-label={`${alt}: 크게 보기`}>
        <img src={src} alt={alt} loading="lazy" className={imgClass} onLoad={fitFrame} />
      </button>
      <Modal open={open} onClose={() => setOpen(false)} label={cur.alt}>
        <figure className="text-white text-center" onKeyDown={onKey}>
          {pair && <div role="group" aria-label="화면 전환 (좌우 방향키)" className="mb-3 mt-12 flex justify-center gap-2 md:mt-0">
            {pair.map((x, i) => {
              const after = i > 0, on = i === idx
              return <button key={x.tag} type="button" aria-pressed={on} onClick={() => setIdx(i)} className="min-h-11 rounded-full px-5 text-[14px] font-bold"
                style={on ? (after ? { background: pairColor ?? '#3975f6', color: onBrand(pairColor ?? '#3975f6') } : { background: '#e8e8e8', color: '#111' }) : { background: 'rgba(255,255,255,.14)', color: '#fff' }}>{x.tag}</button>
            })}
          </div>}
          {kf && 'parts' in kf
            ? <div className="relative mx-auto overflow-hidden rounded-[24px] bg-white" style={box}>
                <img src={kf.parts.top} alt="" aria-hidden className="absolute left-0 top-0 block w-full bg-white" />
                <div tabIndex={0} className={scroller} style={{ top: `${kf.parts.topCq ?? 26.41}cqw`, bottom: kf.parts.cta ? '28.46cqw' : 0 }}><img src={kf.parts.body} alt={cur.alt} className="block w-full" /></div>
                {kf.parts.cta && <img src={kf.parts.cta} alt="" aria-hidden className="absolute bottom-0 left-0 block w-full bg-white" style={{ boxShadow: '0 -6px 12px -8px rgba(0,0,0,.16)' }} />}
              </div>
            : full
              ? <div className="relative mx-auto overflow-hidden rounded-[24px] bg-white" style={box}><div tabIndex={0} className={`${scroller} inset-y-0`}><img src={full} alt={cur.alt} className="block w-full" /></div></div>
              : <img src={cur.src} alt={cur.alt} className="mx-auto max-h-[82vh] w-auto max-w-[92vw] rounded-[20px]" />}
          {(caption || pair) && <figcaption className="mt-3 text-[14px]">{pair ? `${cur.tag} · ${cur.alt}` : caption}</figcaption>}
        </figure>
      </Modal>
    </>
  )
}
