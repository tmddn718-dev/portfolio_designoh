import { useEffect, useRef, useState, type ReactNode } from 'react'

// 네이티브 <dialog>: 포커스 가두기·Esc·배경 클릭 닫기, 닫히면 트리거로 포커스 복귀.
export function Modal({ open, onClose, label, children }: { open: boolean; onClose: () => void; label: string; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const d = ref.current!
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])
  return (
    <dialog ref={ref} aria-label={label} className="modal" onClose={onClose}
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
  return (
    <>
      <button type="button" className={`zoomable ${className}`} onClick={() => setOpen(true)} aria-label={`${alt}: 크게 보기`}>
        <img src={src} alt={alt} loading="lazy" className={imgClass} />
      </button>
      <Modal open={open} onClose={() => setOpen(false)} label={alt}>
        <figure className="text-white text-center">
          {big
            ? <div className="mx-auto max-h-[74vh] w-[min(390px,92vw)] overflow-y-auto overscroll-contain rounded-[20px] bg-white"><img src={big} alt={alt} className="block w-full" /></div>
            : <img src={src} alt={alt} className="mx-auto max-h-[82vh] w-auto max-w-[92vw] rounded-[20px]" />}
          {caption && <figcaption className="mt-3 text-[14px]">{caption}</figcaption>}
        </figure>
      </Modal>
    </>
  )
}
