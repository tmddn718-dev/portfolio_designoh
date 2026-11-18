// 긴 화면 캡처를 폰 프레임 안에서 스크롤해 보게 하고, 하단 고정(sticky) 버튼은 화면 맨 아래에 붙여 둔다.
export default function ScrollPhone({ body, cta, top, w, ctaH, topH = 0, alt, className = '' }: { body: string; cta: string; top?: string; w: number; ctaH: number; topH?: number; alt: string; className?: string }) {
  const pad = (ctaH / w) * 100 // 버튼 높이만큼 본문 끝에 여백(가로폭 대비 %)
  return (
    <div className={className}>
      <div className="phone-light" role="group" aria-label={`${alt} (화면 안에서 스크롤해 볼 수 있어요)`}>
        <div className="relative w-full h-full overflow-hidden bg-white" style={{ borderRadius: '11.5% / 5.3%', containerType: 'inline-size' }}>
          <div tabIndex={0} className="absolute inset-0 overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <img src={body} alt={alt} loading="lazy" className="block w-full" style={{ marginTop: `${(topH / w) * 100}cqw`, marginBottom: `${pad}cqw` }} />
          </div>
          {top && <img src={top} alt="" aria-hidden loading="lazy" className="absolute top-0 left-0 w-full bg-white" />}
          <img src={cta} alt="" aria-hidden loading="lazy" className="absolute bottom-0 left-0 w-full" style={{ boxShadow: '0 -8px 14px -8px rgba(0,0,0,.18)' }} />
        </div>
      </div>
      <p className="mt-3 text-[13px] text-sub">화면 안에서 스크롤해 보세요. 하단 버튼은 실제 앱처럼 고정돼요.</p>
    </div>
  )
}
