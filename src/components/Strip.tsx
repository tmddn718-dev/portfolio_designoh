import { useEffect, useRef, useState, type ReactNode } from 'react'

// 가로 스트립 + 스크롤 단서: 끝에 그라데이션, 이전/다음 버튼, 키보드 화살표.
export default function Strip({ label, children }: { label: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ start: true, end: true })
  useEffect(() => {
    const el = ref.current!
    const f = () => setPos({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 })
    f(); el.addEventListener('scroll', f, { passive: true }); const ro = new ResizeObserver(f); ro.observe(el)
    return () => { el.removeEventListener('scroll', f); ro.disconnect() }
  }, [])
  const go = (d: number) => ref.current?.scrollBy({ left: d * ref.current.clientWidth * 0.8, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  const showBtns = !(pos.start && pos.end)
  return (
    <div className="relative">
      <div ref={ref} role="region" aria-label={`${label} (좌우로 스크롤, 방향키 사용 가능)`} tabIndex={0} className="strip -mx-5 px-5 md:mx-0 md:px-0">{children}</div>
      {!pos.end && <span aria-hidden className="pointer-events-none absolute right-0 top-0 bottom-4 w-16 bg-gradient-to-l from-white/90 to-transparent" />}
      {showBtns && (
        <div className="mt-3 flex gap-2">
          <button type="button" onClick={() => go(-1)} disabled={pos.start} aria-label="이전 화면" className="px-4 py-3 rounded-full border border-grid text-[14px] disabled:opacity-40">← 이전</button>
          <button type="button" onClick={() => go(1)} disabled={pos.end} aria-label="다음 화면" className="px-4 py-3 rounded-full border border-grid text-[14px] disabled:opacity-40">다음 →</button>
        </div>
      )}
    </div>
  )
}
