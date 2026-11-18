import type { CSSProperties } from 'react'

// 섬네일용 목업 구도. 좌표는 모두 컨테이너 대비 %, 기기마다 회전·원근·크기를 달리해 구도를 다양하게 만든다.
export type Dev = { src: string; kind: 'dark' | 'light' | 'bare' | 'pro'; x: number; y: number; w: number; r?: number; ry?: number; rx?: number; z?: number; lift?: number }

export default function Compose({ items, className = '', style, persp = 1400, ghost, ghostColor }: { items: Dev[]; className?: string; style?: CSSProperties; persp?: number; ghost?: string; ghostColor?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ perspective: persp, containerType: 'inline-size', ...style }}>
      {ghost && <span aria-hidden className="ghost" style={{ ['--ghost' as string]: ghostColor }}>{ghost}</span>}
      {items.map((d, i) => {
        const t = `rotateX(${d.rx ?? 0}deg) rotateY(${d.ry ?? 0}deg) rotate(${d.r ?? 0}deg)`
        return (
          <div key={d.src + i} className="absolute transition-transform duration-700 ease-out group-hover:[transform:var(--hv)]"
            style={{ left: `${d.x}%`, top: `${d.y}%`, width: `${d.w}%`, zIndex: d.z ?? 1, transform: t, transformStyle: 'preserve-3d', ['--hv' as string]: `translateY(${-(d.lift ?? 10)}px) ${t}` }}>
            {d.kind === 'pro' ? <div className="phone-pro"><img src={d.src} alt="" loading="lazy" className="screen" /><span className="glare" /></div>
              : d.kind === 'bare' ? <img src={d.src} alt="" loading="lazy" className="phone-bare" />
              : d.kind === 'light' ? <div className="phone-light"><img src={d.src} alt="" loading="lazy" className="screen" /></div>
              : <div className="phone"><img src={d.src} alt="" loading="lazy" /></div>}
          </div>
        )
      })}
    </div>
  )
}
