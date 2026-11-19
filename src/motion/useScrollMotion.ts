import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// 홈 스크롤 모션 두 가지.
//  [data-stagger]      자식이 같은 줄에서 함께 보일 때 0.12초 간격으로 페이드업 (카드 그리드·목록·연락 블록)
//  [data-parallax-y=n] 스크롤 구간 동안 ±n% 만큼 위아래로 움직여 깊이감을 준다 (n 이 클수록 빠름, 음수는 반대 방향)
export function useScrollMotion() {
  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const items = gsap.utils.toArray<HTMLElement>('[data-stagger] > *')
      gsap.set(items, { opacity: 0, y: 36 })
      // 앵커 이동처럼 한 번에 지나쳐도(onLeave) 모두 나타나게 같은 동작을 세 곳에 연결한다
      const show = (els: Element[]) => gsap.to(els, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12, overwrite: true })
      ScrollTrigger.batch(items, { start: 'top 90%', onEnter: show, onLeave: show, onEnterBack: show })
      // 새로 계산한 뒤(refresh) 이미 지나친 곳에 숨은 채 남은 요소가 없도록 한 번 더 확인한다
      const sweep = () => show(items.filter(el => el.getBoundingClientRect().top < innerHeight * 0.9 && +getComputedStyle(el).opacity < 1))
      ScrollTrigger.addEventListener('refresh', sweep)
      gsap.utils.toArray<HTMLElement>('[data-parallax-y]').forEach(el => {
        const n = Number(el.dataset.parallaxY) || 0
        gsap.fromTo(el, { yPercent: n }, { yPercent: -n, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: 0.6 } })
      })
      // 핀 고정 섹션 때문에 아래 요소의 위치가 밀리므로 한 번 더 계산한다
      const timers = [400, 1500].map(ms => setTimeout(() => ScrollTrigger.refresh(), ms))
      return () => { timers.forEach(clearTimeout); ScrollTrigger.removeEventListener('refresh', sweep) }
    })
    return () => mm.revert()
  }, [])
}
