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
  { slug: 'trigr', category: 'SHIPPED PRODUCT / PROFESSIONAL EXPERIENCE', headline: '정의되지 않은 요구사항을 실제 사용자 흐름으로 구체화하다', description: '기획서에 없던 사용자 경험을 설계하고, 기획자·개발자와 협의해 실제 출시까지 반영했습니다. Product Design · UX/UI Design · Design System · Product Launch', bg: '#241328', fg: '#FFFFFF' },
]

const by = (slug: string) => projects.find(p => p.slug === slug)!
const Phone = ({ src, className }: { src: string; className: string }) => <div className={`absolute ${className}`}><div className="phone-pro"><img src={src} alt="" className="screen" loading="lazy" /></div></div>
const Browser = ({ src, className }: { src: string; className: string }) => <div className={`absolute overflow-hidden rounded-[16px] border border-white/70 bg-white p-[5px] shadow-[0_28px_60px_rgba(35,48,112,.24)] ${className}`}><div className="flex h-5 items-center gap-1.5 rounded-t-[10px] bg-[#F4F5FA] px-2"><i className="h-1.5 w-1.5 rounded-full bg-[#FF7B75]" /><i className="h-1.5 w-1.5 rounded-full bg-[#F6C85F]" /><i className="h-1.5 w-1.5 rounded-full bg-[#69C47B]" /><span className="ml-2 h-1.5 w-[32%] rounded-full bg-[#DDE0EA]" /></div><img src={src} alt="" className="block w-full rounded-b-[10px]" loading="lazy" /></div>

function StoryArt({ story }: { story: Story }) {
  if (story.slug === 'oliveyoung-todaydream') return <>
    <p className="absolute left-[7%] top-[7%] max-w-[8ch] text-[clamp(31px,4.5vw,68px)] font-black leading-[1.1] tracking-[-.06em]">MORE OPTIONS.</p>
    <div className="absolute left-[7%] top-[31%] z-30 flex flex-wrap gap-2">
      <span className="rounded-full bg-[#151719] px-3 py-2 text-[10px] font-bold text-white shadow-[0_8px_20px_rgba(0,0,0,.14)] md:px-4 md:text-[11px]">일반배송</span>
      <span className="rounded-full bg-[#151719] px-3 py-2 text-[10px] font-bold text-white shadow-[0_8px_20px_rgba(0,0,0,.14)] md:px-4 md:text-[11px]">오늘드림</span>
      <span className="rounded-full bg-[#151719] px-3 py-2 text-[10px] font-bold text-white shadow-[0_8px_20px_rgba(0,0,0,.14)] md:px-4 md:text-[11px]">픽업</span>
    </div>
    <span className="absolute -right-[16%] -top-[18%] h-[70%] w-[70%] rounded-full border-[52px] border-white/20" />
    <Phone src="/images/oliveyoung-todaydream/n-cart.webp" className="bottom-[-28%] left-[17%] w-[30%] rotate-[-8deg] opacity-90" />
    <Phone src="/images/oliveyoung-todaydream/n-altMethods.webp" className="bottom-[-23%] right-[5%] z-10 w-[44%] rotate-[3deg] drop-shadow-[0_28px_42px_rgba(42,65,6,.25)]" />
  </>
  if (story.slug === 'karrot-large-furniture') return <>
    <img src="/proto/karrot/images/sofa.png" alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
    <div className="absolute inset-0 bg-gradient-to-r from-[#F7E8D9]/95 via-[#F7E8D9]/60 to-transparent" />
    <p className="absolute left-[7%] top-[9%] z-10 max-w-[8ch] text-[clamp(31px,4.2vw,63px)] font-black leading-[1.1] tracking-[-.06em]">DECIDE BEFORE CHAT.</p>
    <Phone src="/images/karrot-large-furniture/f-home.webp?v=20261119-seedtext" className="bottom-[-28%] right-[33%] w-[27%] rotate-[-8deg] opacity-90 drop-shadow-[0_24px_38px_rgba(55,28,14,.22)]" />
    <Phone src="/images/karrot-large-furniture/L-b1.webp?v=20261119-seedtext" className="bottom-[-30%] right-[3%] z-10 w-[39%] rotate-[4deg] drop-shadow-[0_30px_48px_rgba(55,28,14,.3)]" />
  </>
  if (story.slug === 'nodi') return <>
    <p className="absolute left-[7%] top-[7%] z-20 max-w-[8ch] text-[clamp(31px,4.2vw,63px)] font-black leading-[1.1] tracking-[-.06em]">REASONS, NOT JUST TIMES.</p>
    <span className="absolute -right-[12%] -top-[18%] h-[70%] w-[64%] rounded-full border-[48px] border-white/25" />
    <Browser src="/images/nodi/web-reco.webp" className="bottom-[7%] right-[5%] w-[72%] -rotate-2" />
    <Phone src="/images/nodi/full-review.webp" className="bottom-[-22%] left-[7%] z-10 w-[28%] rotate-[6deg] drop-shadow-[0_24px_42px_rgba(41,57,132,.28)]" />
  </>
  if (story.slug === 'woorisai') return <>
    <p className="absolute bottom-[8%] left-[7%] z-20 max-w-[8ch] text-[clamp(32px,4.5vw,68px)] font-black leading-[1.1] tracking-[-.06em]">MEMORIES, TOGETHER.</p>
    <span className="absolute -right-[12%] -top-[24%] h-[78%] w-[64%] rounded-full bg-[#D7DDC9]" />
    <Phone src="/images/woorisai/detail.webp" className="right-[28%] top-[-14%] w-[32%] rotate-[-7deg] opacity-90 drop-shadow-[0_24px_40px_rgba(40,56,47,.22)]" />
    <Phone src="/images/woorisai/home.webp" className="right-[-3%] top-[-17%] z-10 w-[42%] rotate-[5deg] drop-shadow-[0_30px_46px_rgba(40,56,47,.26)]" />
  </>
  return <>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_46%,#6F276F_0%,#28142E_44%,#170B1B_78%)]" />
    <span className="absolute right-[5%] top-[13%] h-[58%] w-[48%] rounded-full border border-[#EE7CF0]/35" />
    <p className="absolute left-[7%] top-[8%] z-10 max-w-[9ch] text-[clamp(34px,4.1vw,64px)] font-black leading-[1.1] tracking-[-.065em]">FROM GAPS TO FLOWS.</p>
    <Phone src="/images/trigr/home-map.webp" className="bottom-[-28%] right-[28%] w-[31%] rotate-[-10deg] opacity-85 drop-shadow-[0_28px_54px_rgba(0,0,0,.5)]" />
    <Phone src="/images/trigr/t-list.webp" className="bottom-[-28%] right-[-1%] z-10 w-[40%] rotate-[7deg] drop-shadow-[0_34px_60px_rgba(0,0,0,.55)]" />
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
