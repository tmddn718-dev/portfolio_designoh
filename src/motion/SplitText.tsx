import { Fragment, useLayoutEffect, useRef, type ElementType } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { reducedMotion } from './useMotion'

gsap.registerPlugin(ScrollTrigger)

// 단어마다 마스크 안에서 아래→위로 올라오는 텍스트 등장. 줄바꿈은 \n 으로 쓴다.
// 화면 읽기 프로그램에는 원문 한 덩어리로 읽히고, 쪼갠 조각은 숨긴다.
export default function SplitText({ text, as: Tag = 'h2', className = '', delay = 0, onLoad = false }: { text: string; as?: ElementType; className?: string; delay?: number; onLoad?: boolean }) {
  const ref = useRef<HTMLElement>(null)
  useLayoutEffect(() => {
    if (reducedMotion()) return
    const el = ref.current!
    const words = el.querySelectorAll<HTMLElement>('.sw-i')
    gsap.set(words, { yPercent: 118, rotate: 4 })
    const tween = gsap.to(words, {
      yPercent: 0, rotate: 0, duration: 1, ease: 'power4.out', stagger: 0.055, delay,
      ...(onLoad ? {} : { scrollTrigger: { trigger: el, start: 'top 90%', once: true } }),
    })
    return () => { tween.scrollTrigger?.kill(); tween.kill(); gsap.set(words, { clearProps: 'all' }) }
  }, [text, delay, onLoad])
  const lines = text.split('\n')
  return (
    <Tag ref={ref} aria-label={text.replace(/\n/g, ' ')} className={className}>
      {lines.map((line, li) => (
        <span key={li} aria-hidden className="block">
          {line.split(' ').map((w, wi, arr) => (
            <Fragment key={wi}>
              <span className="sw"><span className="sw-i">{w}</span></span>{wi < arr.length - 1 ? ' ' : ''}
            </Fragment>
          ))}
        </span>
      ))}
    </Tag>
  )
}
