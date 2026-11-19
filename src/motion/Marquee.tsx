import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { reducedMotion } from './useMotion'

gsap.registerPlugin(ScrollTrigger)

const words = ['당근', 'NODI', '우리사이', 'trigr', '올리브영']

// 흐르는 큰 글자 띠. 스크롤 속도에 따라 빨라지고 방향이 바뀐다.
export default function Marquee() {
  const track = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (reducedMotion()) return
    const loop = gsap.to(track.current, { xPercent: -50, duration: 34, ease: 'none', repeat: -1 })
    const st = ScrollTrigger.create({
      onUpdate: self => {
        const v = self.getVelocity() / 360
        gsap.to(loop, { timeScale: (self.direction === 1 ? 1 : -1) * (1 + Math.min(Math.abs(v), 7)), duration: 0.25, overwrite: true })
        gsap.to(loop, { timeScale: self.direction === 1 ? 1 : -1, duration: 1.2, delay: 0.25, overwrite: 'auto' })
      },
    })
    return () => { st.kill(); loop.kill() }
  }, [])
  const row = [...words, ...words]
  return (
    <div className="marquee overflow-hidden border-y border-black/10 bg-white py-5 md:py-8" role="img" aria-label="작업 목록: 당근, NODI, 우리사이, trigr, 올리브영">
      <div ref={track} aria-hidden className="flex w-max whitespace-nowrap will-change-transform">
        {[0, 1].map(k => (
          <div key={k} className="flex shrink-0 items-center">
            {row.map((w, i) => (
              <span key={`${k}-${i}`} className="flex items-center text-[clamp(44px,9vw,128px)] font-black leading-none tracking-[-.05em]">
                <span className={i % 2 ? 'outline-text-dark' : ''}>{w}</span>
                <span className="mx-[.35em] text-[.5em] text-[#2997ff]">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
