import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { profile } from '../data/projects'

gsap.registerPlugin(ScrollTrigger)

export default function Layout() {
  const { pathname, hash } = useLocation()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
    if (!hash) { window.scrollTo(0, 0); return }
    // 지연 로딩 이미지로 위치가 밀릴 수 있어 한 번 더 맞춘다
    const go = () => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'instant' })
    requestAnimationFrame(go)
    const t = setTimeout(go, 400)
    return () => clearTimeout(t)
  }, [pathname, hash])

  // 애플식: [data-scale] 요소는 화면에 들어오며 작게→원래 크기로, 아래→제자리로 스크롤에 맞춰 커진다
  useEffect(() => {
    const mm = gsap.matchMedia()
    const t = setTimeout(() => {
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('[data-scale]').forEach(el => gsap.fromTo(el, { scale: 0.9, y: 40 }, { scale: 1, y: 0, ease: 'none', scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 45%', scrub: true } }))
        ScrollTrigger.refresh()
      })
    }, 150)
    return () => { clearTimeout(t); mm.revert() }
  }, [pathname])

  const link = 'px-3 py-3 text-[14px] text-ink/85 hover:text-ink'
  const on = (c: boolean) => `${link} ${c ? 'text-ink font-semibold' : ''}`
  const [top, setTop] = useState(false)
  useEffect(() => { const f = () => setTop(scrollY > 900); f(); addEventListener('scroll', f, { passive: true }); return () => removeEventListener('scroll', f) }, [])
  const items = (
    <>
      <Link className={on(pathname.startsWith('/work'))} aria-current={pathname.startsWith('/work') ? 'page' : undefined} to="/#work">Work</Link>
      <NavLink className={({ isActive }) => on(isActive)} to="/about">About</NavLink>
      {profile.resume && <a className={link} href={profile.resume} target="_blank" rel="noreferrer">Resume</a>}
      <Link className={link} to="/#contact">Contact</Link>
    </>
  )

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:px-3 focus:py-2">본문으로 건너뛰기</a>
      <header className="sticky top-0 z-40 glass border-b border-black/10">
        <div className="wrap gutter flex items-center justify-between h-12">
          <Link to="/" className="inline-flex items-center min-h-[44px] text-[14px] font-semibold tracking-tight text-ink">디자이너 {profile.name}</Link>
          <nav aria-label="주 메뉴" className="hidden md:flex items-center -mr-3">{items}</nav>
          <button className="md:hidden -mr-2 px-2 py-3 text-[16px]" aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}>
            {open ? '닫기' : '메뉴'}
          </button>
        </div>
        {open && <nav id="mobile-nav" aria-label="모바일 메뉴" className="md:hidden glass gutter pb-3 flex flex-col border-t border-grid">{items}</nav>}
      </header>
      <main id="main" key={pathname} className="page-in"><Outlet /></main>
      <footer className="border-t border-grid mt-24">
        <div className="wrap gutter py-8 text-[13px] text-sub flex justify-between gap-4 flex-wrap">
          <span>© 2026 Portfolio</span>
          <span>UX/UI · PRODUCT DESIGN</span>
        </div>
      </footer>
      {top && <button onClick={() => scrollTo({ top: 0 })} className="fixed right-4 bottom-4 z-40 px-4 py-3 rounded-full bg-ink text-white text-[13px] font-semibold shadow-lg">맨 위로</button>}
    </>
  )
}
