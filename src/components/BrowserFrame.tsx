// 웹 화면 캡처용 브라우저 프레임(그림자 없음, 얇은 테두리)
export default function BrowserFrame({ src, alt, label, className = '' }: { src: string; alt: string; label: string; className?: string }) {
  return (
    <figure className={className}>
      <div className="rounded-[14px] overflow-hidden border border-black/15 bg-white">
        <div className="flex items-center gap-1.5 h-8 px-3 bg-[#f1f2f4] border-b border-black/10" aria-hidden>
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" /><span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" /><span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-3 flex-1 max-w-[260px] h-5 rounded-md bg-white/80 text-[13px] leading-5 px-2 text-black/40 truncate">nodi.app</span>
        </div>
        <img src={src} alt={alt} loading="lazy" className="block w-full" />
      </div>
      <figcaption className="mt-3 text-[14px] text-sub">{label}</figcaption>
    </figure>
  )
}
