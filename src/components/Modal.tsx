import { useEffect, useRef, useState, type ReactNode } from 'react'
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

// 이미지를 누르면 크게 보는 버튼형 이미지
export function Zoomable({ src, alt, caption, className = '', imgClass = '', big }: { src: string; alt: string; caption?: string; className?: string; imgClass?: string; big?: string }) {
  const [open, setOpen] = useState(false)
  const kf = big ? undefined : karrotFull(src)
  const full = big ?? (kf && 'big' in kf ? kf.big : undefined)
  // 휴대폰 한 대 크기(화면 높이에 맞춰 줄여서 위아래가 잘리지 않게)에 상단·본문·하단을 따로 올려, 본문은 가운데에서만 스크롤한다
  const box = { width: 'min(390px, 92vw, calc(78vh * 780 / 1688))', aspectRatio: '780 / 1688', containerType: 'inline-size' as const }
  const scroller = 'absolute left-0 right-0 overflow-y-auto overscroll-contain [scrollbar-width:thin]'
  return (
    <>
      <button type="button" className={`zoomable ${className}`} onClick={() => setOpen(true)} aria-label={`${alt}: 크게 보기`}>
        <img src={src} alt={alt} loading="lazy" className={imgClass} />
      </button>
      <Modal open={open} onClose={() => setOpen(false)} label={alt}>
        <figure className="text-white text-center">
          {kf && 'parts' in kf
            ? <div className="relative mx-auto overflow-hidden rounded-[24px] bg-white" style={box}>
                <img src={kf.parts.top} alt="" aria-hidden className="absolute left-0 top-0 block w-full bg-white" />
                <div tabIndex={0} className={scroller} style={{ top: `${kf.parts.topCq ?? 26.41}cqw`, bottom: kf.parts.cta ? '28.46cqw' : 0 }}><img src={kf.parts.body} alt={alt} className="block w-full" /></div>
                {kf.parts.cta && <img src={kf.parts.cta} alt="" aria-hidden className="absolute bottom-0 left-0 block w-full bg-white" style={{ boxShadow: '0 -6px 12px -8px rgba(0,0,0,.16)' }} />}
              </div>
            : full
              ? <div className="relative mx-auto overflow-hidden rounded-[24px] bg-white" style={box}><div tabIndex={0} className={`${scroller} inset-y-0`}><img src={full} alt={alt} className="block w-full" /></div></div>
              : <img src={src} alt={alt} className="mx-auto max-h-[82vh] w-auto max-w-[92vw] rounded-[20px]" />}
          {caption && <figcaption className="mt-3 text-[14px]">{caption}</figcaption>}
        </figure>
      </Modal>
    </>
  )
}
