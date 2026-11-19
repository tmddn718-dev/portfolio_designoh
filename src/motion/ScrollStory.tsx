import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects } from '../data/projects'
import { reducedMotion } from './useMotion'

gsap.registerPlugin(ScrollTrigger)

type Story = { slug: string; category: string; headline: string; description: string; bg: string; fg: string }

const stories: Story[] = [
  { slug: 'oliveyoung-todaydream', category: 'UX REDESIGN / PERSONAL PROJECT', headline: '품절 이후에도 구매를 이어갈 수 있도록', description: '구매 가능 옵션을 더 쉽게 탐색하고, 결제 과정의 판단 부담을 줄이는 경험을 설계했습니다.', bg: '#C9F45A', fg: '#10210A' },
  { slug: 'karrot-large-furniture', category: 'UX REDESIGN / PERSONAL PROJECT', headline: '채팅에서 물어보기 전에, 게시글에서 확인하도록', description: '대형 가구의 상세 정보와 거래 조건을 미리 확인해, 거래 약속 조율에 집중할 수 있도록 개선했습니다.', bg: '#F3D7BE', fg: '#2B1D16' },
  { slug: 'nodi', category: 'PRODUCT CONCEPT / FUNCTIONAL PROTOTYPE', headline: 'AI는 이해하고, 사용자는 결정한다', description: '복잡한 일정 조건을 구조화하고 추천 이유를 설명해, 최종 선택은 사용자가 직접 내릴 수 있도록 설계했습니다. 추천 생성은 규칙 기반 데모입니다.', bg: '#D8DFFF', fg: '#17224C' },
  { slug: 'woorisai', category: 'PRODUCT CONCEPT / PERSONAL PROJECT', headline: '함께한 순간을 다시 발견하도록', description: '흩어진 사진과 이야기를 하나의 추억으로 쌓고, 사람과 장소, 시간의 맥락으로 다시 찾는 경험을 설계했습니다.', bg: '#E9E8DC', fg: '#263B2F' },
  { slug: 'trigr', category: 'SHIPPED PRODUCT / PROFESSIONAL EXPERIENCE', headline: '실제 제품을 만들고, 반복해서 개선한 경험', description: '초기 제품 구조와 디자인 시스템을 만들고 세 차례의 주요 개편을 거쳐 태국 출시까지 참여했습니다.', bg: '#241328', fg: '#FFFFFF' },
]

const by = (slug: string) => projects.find(p => p.slug === slug)!
const Phone = ({ src, className }: { src: string; className: string }) => <div className={`absolute ${className}`}><div className="phone-pro"><img src={src} alt="" className="screen" loading="lazy" /></div></div>

function StoryArt({ story }: { story: Story }) {
  if (story.slug === 'oliveyoung-todaydream') return <>
    <p className="absolute left-[7%] top-[7%] max-w-[8ch] text-[clamp(31px,4.5vw,68px)] font-black leading-[1.1] tracking-[-.06em]">MORE OPTIONS.</p>
    <Phone src="/images/oliveyoung-todaydream/n-optC.webp" className="bottom-[-30%] left-[8%] w-[28%] rotate-[-6deg] opacity-75" />
    <Phone src="/images/oliveyoung-todaydream/n-altMethods.webp" className="bottom-[-25%] left-[36%] z-10 w-[38%] drop-shadow-[0_28px_42px_rgba(42,65,6,.25)]" />
    <Phone src="/images/oliveyoung-todaydream/n-restock.webp" className="bottom-[-32%] right-[-2%] w-[27%] rotate-[7deg] opacity-80" />
  </>
  if (story.slug === 'karrot-large-furniture') return <>
    <img src="/proto/karrot/images/sofa.png" alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
    <div className="absolute inset-0 bg-gradient-to-r from-[#F7E8D9]/95 via-[#F7E8D9]/60 to-transparent" />
    <p className="absolute left-[7%] top-[9%] z-10 max-w-[8ch] text-[clamp(31px,4.2vw,63px)] font-black leading-[1.1] tracking-[-.06em]">DECIDE BEFORE CHAT.</p>
    <Phone src="/images/karrot-large-furniture/L-b1.webp?v=20261119-seedtext" className="bottom-[-29%] right-[8%] z-10 w-[38%] drop-shadow-[0_28px_42px_rgba(55,28,14,.28)]" />
  </>
  if (story.slug === 'nodi') return <>
    <p className="absolute left-[7%] top-[7%] z-20 max-w-[8ch] text-[clamp(31px,4.2vw,63px)] font-black leading-[1.1] tracking-[-.06em]">REASONS, NOT JUST TIMES.</p>
    <img src="/images/nodi/web-reco.webp" alt="" className="absolute bottom-[7%] right-[6%] w-[67%] rounded-[18px] border border-white/50 shadow-[0_28px_55px_rgba(41,57,132,.22)]" loading="lazy" />
    <img src="/images/nodi/full-reasonB.webp" alt="" className="absolute bottom-[-10%] left-[8%] z-10 w-[23%] rounded-[16px] shadow-[0_22px_40px_rgba(41,57,132,.24)]" loading="lazy" />
  </>
  if (story.slug === 'woorisai') return <>
    <p className="absolute bottom-[8%] left-[7%] z-20 max-w-[8ch] text-[clamp(32px,4.5vw,68px)] font-black leading-[1.1] tracking-[-.06em]">MEMORIES, TOGETHER.</p>
    <Phone src="/images/woorisai/feed.webp" className="right-[24%] top-[-24%] w-[31%] rotate-[-5deg] opacity-75" />
    <Phone src="/images/woorisai/home.webp" className="right-[-1%] top-[-19%] z-10 w-[40%] rotate-[5deg] drop-shadow-[0_30px_46px_rgba(40,56,47,.26)]" />
  </>
  return <>
    <img src="/images/trigr/home-map.webp" alt="" className="absolute inset-0 h-full w-full object-cover object-[center_18%] opacity-75" loading="lazy" />
    <div className="absolute inset-0 bg-gradient-to-r from-[#190C1D] via-[#190C1D]/65 to-transparent" />
    <p className="absolute left-[7%] top-[8%] z-10 max-w-[8ch] text-[clamp(38px,4.5vw,70px)] font-black leading-[1.1] tracking-[-.065em]">SHIPPED. LEARNED. IMPROVED.</p>
    <img src="/images/trigr/t-list.webp" alt="" className="absolute bottom-[-20%] right-[4%] z-10 w-[37%] rotate-[-6deg] rounded-[24px] shadow-[0_34px_60px_rgba(0,0,0,.5)]" loading="lazy" />
  </>
}

function MobileStories() {
  return <section id="story" aria-label="프로젝트 한눈에 보기" className="scroll-mt-16 bg-[#FBFBFD] py-20 md:py-24 lg:hidden">
    <div className="wrap gutter">
      <p className="text-[13px] font-semibold uppercase tracking-[.14em] text-bluetext">Selected projects</p>
      <h2 className="mt-3 text-[32px] font-bold tracking-[-.04em]">다섯 프로젝트, 다섯 가지 문제</h2>
      <div className="mt-10 space-y-14">
        {stories.map((story, index) => <article key={story.slug}><Link to={`/work/${story.slug}`} className="group block">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[22px]" style={{ background: story.bg, color: story.fg }}><StoryArt story={story} /></div>
          <div className="mt-5 flex gap-4"><span className="text-[13px] font-semibold tabular-nums text-sub">0{index + 1}</span><div><p className="text-[11px] font-semibold uppercase tracking-[.08em] text-sub">{story.category}</p><h3 className="mt-2 text-[24px] font-bold tracking-[-.03em]">{story.headline}</h3><p className="mt-3 text-[15px] leading-[1.7] text-sub">{story.description}</p><span className="mt-4 inline-flex border-b border-ink pb-1 text-[14px] font-semibold">프로젝트 보기 ↗</span></div></div>
        </Link></article>)}
      </div>
    </div>
  </section>
}

export default function ScrollStory() {
  const sec = useRef<HTMLElement>(null)
  const [desktop, setDesktop] = useState(false)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const mq = matchMedia('(min-width: 1024px)')
    const update = () => setDesktop(mq.matches && !reducedMotion())
    update(); mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!desktop) return
    const st = ScrollTrigger.create({ trigger: sec.current, start: 'top top+=48', end: () => `+=${Math.round(window.innerHeight * .82) * (stories.length - 1) + 160}`, pin: true, anticipatePin: 1, refreshPriority: 10, invalidateOnRefresh: true, onUpdate: self => {
      const next = Math.min(stories.length - 1, Math.round(self.progress * (stories.length - 1)))
      setActive(prev => prev === next ? prev : next)
    } })
    return () => st.kill(true)
  }, [desktop])

  if (!desktop) return <MobileStories />
  return <div><section ref={sec} id="story" aria-label="프로젝트 한눈에 보기" className="relative h-[calc(100svh-48px)] overflow-hidden bg-[#FBFBFD]">
    <div className="wrap gutter grid h-full grid-cols-12 items-center gap-10">
      <div className="col-span-5">
        <p className="text-[13px] font-semibold tabular-nums text-bluetext">0{active + 1} / 0{stories.length}</p>
        <ol className="mt-5 space-y-1">{stories.map((story, index) => <li key={story.slug}><Link to={`/work/${story.slug}`} aria-current={index === active ? 'true' : undefined} className={`block text-[clamp(34px,4.1vw,64px)] font-black leading-[1.02] tracking-[-.05em] transition-[color,transform,opacity] duration-500 ${index === active ? 'translate-x-3 text-ink' : 'text-ink/18 hover:text-ink/50'}`}>{by(story.slug).name.replace(' 중고거래', '').replace(' 오늘드림', '')}</Link></li>)}</ol>
        <div className="relative mt-8 min-h-[190px] max-w-[44ch]">{stories.map((story, index) => <div key={story.slug} className={`absolute inset-0 transition-all duration-500 ${index === active ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'}`}>
          <p className="text-[11px] font-semibold uppercase tracking-[.08em] text-sub">{story.category}</p><h2 className="mt-3 text-[24px] font-bold leading-[1.35] tracking-[-.03em]">{story.headline}</h2><p className="mt-3 text-[15px] leading-[1.7] text-sub">{story.description}</p><Link to={`/work/${story.slug}`} className="mt-4 inline-flex border-b border-ink pb-1 text-[14px] font-semibold">프로젝트 보기 ↗</Link>
        </div>)}</div>
      </div>
      <div className="relative col-span-7 h-[min(74svh,720px)] overflow-hidden rounded-[28px]">{stories.map((story, index) => <div key={story.slug} aria-hidden={index !== active} className={`story-layer absolute inset-0 overflow-hidden rounded-[28px] ${index === active ? 'is-active' : ''}`} style={{ zIndex: index, background: story.bg, color: story.fg }}><StoryArt story={story} /></div>)}</div>
    </div>
  </section></div>
}
