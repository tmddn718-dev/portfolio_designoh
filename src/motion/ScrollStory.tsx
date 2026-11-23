import { thumbSet } from '../data/thumb'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects } from '../data/projects'
import { reducedMotion } from './useMotion'

gsap.registerPlugin(ScrollTrigger)

type Story = { slug: string; category: string; headline: string; description: string; bg: string; fg: string }

const stories: Story[] = [
  { slug: 'oliveyoung-todaydream', category: 'UX REDESIGN / PERSONAL PROJECT', headline: '품절 이후에도 구매를 이어갈 수 있도록', description: '일반배송과 매장 픽업을 바로 비교하고 결제까지 이어갈 수 있도록 구매 흐름을 재설계했습니다.', bg: '#C9F45A', fg: '#10210A' },
  { slug: 'karrot-large-furniture', category: 'UX REDESIGN / PERSONAL PROJECT', headline: '채팅에서 물어보기 전에, 게시글에서 확인하도록', description: '대형 가구의 크기와 운반 조건을 게시글에서 확인해, 채팅에서는 거래 약속 조율에 집중하도록 개선했습니다.', bg: '#F3D7BE', fg: '#2B1D16' },
  { slug: 'nodi', category: 'PRODUCT CONCEPT / FUNCTIONAL PROTOTYPE', headline: 'AI는 이해하고, 사용자는 결정한다', description: '여러 사람의 일정 조건과 추천 이유를 보여주되, 최종 회의 시간은 사용자가 직접 선택하도록 설계했습니다. 추천 기능은 규칙 기반 데모입니다.', bg: '#D8DFFF', fg: '#17224C' },
  { slug: 'woorisai', category: 'PRODUCT CONCEPT / PERSONAL PROJECT', headline: '함께한 순간을 다시 발견하도록', description: '여러 앱에 흩어진 사진과 이야기를 하나의 추억으로 모으고, 사람·장소·시간을 기준으로 다시 찾도록 설계했습니다.', bg: '#E9E8DC', fg: '#263B2F' },
  { slug: 'trigr', category: 'SHIPPED PRODUCT / PROFESSIONAL EXPERIENCE', headline: '실제 출시 제품을 만들고, 반복해서 개선한 경험', description: '누락된 사용자 흐름과 예외 상태를 설계하고, 기획자·개발자와 협의해 태국 시장 출시까지 연결했습니다.', bg: '#241328', fg: '#FFFFFF' },
]

const by = (slug: string) => projects.find(p => p.slug === slug)!
const Phone = ({ src, className }: { src: string; className: string }) => <div className={`absolute ${className}`}><div className="phone-pro"><img {...thumbSet(src)} alt="" className="screen" loading="lazy" /></div></div>
const Browser = ({ src, className }: { src: string; className: string }) => <div className={`absolute overflow-hidden rounded-[16px] border border-white/70 bg-white p-[5px] shadow-[0_28px_60px_rgba(0,0,0,.24)] ${className}`}><div className="flex h-5 items-center gap-1.5 rounded-t-[10px] bg-[#F4F5FA] px-2"><i className="h-1.5 w-1.5 rounded-full bg-[#FF7B75]" /><i className="h-1.5 w-1.5 rounded-full bg-[#F6C85F]" /><i className="h-1.5 w-1.5 rounded-full bg-[#69C47B]" /><span className="ml-2 h-1.5 w-[32%] rounded-full bg-[#DDE0EA]" /></div><img src={src} alt="" className="block w-full rounded-b-[10px]" loading="lazy" /></div>

function StoryArt({ story }: { story: Story }) {
  if (story.slug === 'oliveyoung-todaydream') return <>
    <div className="absolute left-[7%] top-[7%] z-30 flex w-max max-w-[72%] flex-col items-start">
      <p className="hidden lg:block max-w-[8ch] text-[clamp(29px,4vw,61px)] font-black leading-[1.1] tracking-[-.06em]">MORE OPTIONS.</p>
      <span className="mt-4 whitespace-nowrap rounded-full bg-[#151719] px-4 py-2 text-[13px] font-bold text-white shadow-[0_8px_20px_rgba(0,0,0,.14)] md:text-[13px]">오늘드림 품절</span>
    </div>
    <span className="absolute -right-[16%] -top-[18%] h-[70%] w-[70%] rounded-full border-[52px] border-white/20" />
    <Phone src="/images/oliveyoung-todaydream/n-altMethods.webp" className="bottom-[-23%] right-[5%] z-10 w-[44%] rotate-[3deg] drop-shadow-[0_28px_42px_rgba(0,0,0,.25)]" />
  </>
  if (story.slug === 'karrot-large-furniture') return <>
    <img src="/proto/karrot/images/sofa.png" alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
    <div className="absolute inset-0 bg-gradient-to-r from-[#F7E8D9]/95 via-[#F7E8D9]/60 to-transparent" />
    <p className="hidden lg:block absolute left-[7%] top-[9%] z-10 max-w-[8ch] text-[clamp(29px,3.8vw,57px)] font-black leading-[1.1] tracking-[-.06em]">DECIDE BEFORE CHAT.</p>
    <Phone src="/images/karrot-large-furniture/f-home.webp?v=20261119-seedtext" className="bottom-[-28%] right-[33%] w-[27%] rotate-[-8deg] opacity-90 drop-shadow-[0_24px_38px_rgba(0,0,0,.22)]" />
    <Phone src="/images/karrot-large-furniture/L-b1.webp?v=20261119-seedtext" className="bottom-[-30%] right-[3%] z-10 w-[39%] rotate-[4deg] drop-shadow-[0_30px_48px_rgba(0,0,0,.3)]" />
  </>
  if (story.slug === 'nodi') return <>
    <p className="hidden lg:block absolute left-[7%] top-[7%] z-20 max-w-[8ch] text-[clamp(29px,3.8vw,57px)] font-black leading-[1.1] tracking-[-.06em]">REASONS, NOT JUST TIMES.</p>
    <span className="absolute -right-[12%] -top-[18%] h-[70%] w-[64%] rounded-full border-[48px] border-white/25" />
    <Browser src="/images/nodi/web-reco.webp" className="bottom-[7%] right-[5%] w-[72%] -rotate-2" />
    <Phone src="/images/nodi/full-review.webp" className="bottom-[-22%] left-[7%] z-10 w-[28%] rotate-[6deg] drop-shadow-[0_24px_42px_rgba(0,0,0,.28)]" />
  </>
  if (story.slug === 'woorisai') return <>
    <p className="hidden lg:block absolute bottom-[8%] left-[7%] z-20 max-w-[8ch] text-[clamp(30px,4vw,61px)] font-black leading-[1.1] tracking-[-.06em]">MEMORIES, TOGETHER.</p>
    <span className="absolute -right-[12%] -top-[24%] h-[78%] w-[64%] rounded-full bg-[#D7DDC9]" />
    <Phone src="/images/woorisai/detail.webp" className="right-[28%] top-[-14%] w-[32%] rotate-[-7deg] opacity-90 drop-shadow-[0_24px_40px_rgba(0,0,0,.22)]" />
    <Phone src="/images/woorisai/home.webp" className="right-[-3%] top-[-17%] z-10 w-[42%] rotate-[5deg] drop-shadow-[0_30px_46px_rgba(0,0,0,.26)]" />
  </>
  return <>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_46%,#6F276F_0%,#28142E_44%,#170B1B_78%)]" />
    <span className="absolute right-[5%] top-[9%] aspect-square w-[48%] rounded-full border border-[#EE7CF0]/35" />
    <p className="hidden lg:block absolute left-[7%] top-[8%] z-10 max-w-[9ch] text-[clamp(34px,4.1vw,64px)] font-black leading-[1.1] tracking-[-.065em]">FROM GAPS TO FLOWS.</p>
    <Phone src="/images/trigr/home-map.webp" className="bottom-[-28%] right-[28%] w-[31%] rotate-[-10deg] opacity-85 drop-shadow-[0_28px_54px_rgba(0,0,0,.5)]" />
    <Phone src="/images/trigr/mission-discovery-02.png" className="bottom-[-26%] right-0 z-10 w-[39%] rotate-[4deg] drop-shadow-[0_34px_60px_rgba(0,0,0,.55)]" />
  </>
}

function MobileStories() {
  return <section id="story" aria-label="주요 프로젝트" className="scroll-mt-16 overflow-hidden bg-[#FBFBFD] py-16 md:py-20 lg:hidden">
    <div className="wrap gutter">
      <div className="flex items-end justify-between gap-5">
        <div><p className="text-[13px] font-semibold uppercase tracking-[.14em] text-bluetext">Featured experience</p><h2 className="mt-2 max-w-[14ch] text-[24px] font-bold leading-[1.3] tracking-[-.035em] md:max-w-none md:text-[30px]">다섯 프로젝트, 다섯 가지 문제</h2></div>
        <p className="mb-1 shrink-0 text-[13px] font-medium text-sub">옆으로 넘겨 보기 <span aria-hidden>→</span></p>
      </div>
      <ol className="mobile-story-rail mt-7 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 pr-5 md:pr-8" aria-label="프로젝트 5개, 가로 스크롤">
        {stories.map((story, index) => <li key={story.slug} className="w-[78vw] min-w-[248px] max-w-[340px] shrink-0 snap-start"><article className="h-full"><Link to={`/work/${story.slug}`} className="group flex h-full flex-col rounded-[24px] focus-visible:outline-offset-4">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[24px]" style={{ background: story.bg, color: story.fg }}><StoryArt story={story} /></div>
          <div className="flex flex-1 flex-col pt-4"><div className="flex items-center gap-3"><span className="text-[13px] font-semibold tabular-nums text-ink">0{index + 1}</span><p className="truncate text-[13px] font-semibold uppercase tracking-[.05em] text-sub">{story.category}</p></div><div className="mt-3 flex items-start justify-between gap-4"><div><h3 className="text-[24px] font-bold leading-[1.3] tracking-[-.03em]">{by(story.slug).name}</h3><p className="mt-2 text-[15px] font-semibold leading-[1.5] tracking-[-.015em]">{story.headline}</p></div><span aria-hidden className="text-[22px] leading-none">↗</span></div></div>
        </Link></article></li>)}
      </ol>
    </div>
  </section>
}

export default function ScrollStory() {
  const sec = useRef<HTMLDivElement>(null)
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
    const st = ScrollTrigger.create({ trigger: sec.current, start: 'top top+=48', end: 'bottom bottom', invalidateOnRefresh: true, onUpdate: self => {
      const next = Math.min(stories.length - 1, Math.round(self.progress * (stories.length - 1)))
      setActive(prev => prev === next ? prev : next)
    } })
    return () => st.kill(true)
  }, [desktop])

  if (!desktop) return <MobileStories />
  return <div ref={sec} id="story" aria-label="주요 프로젝트" className="relative scroll-mt-12 bg-[#FBFBFD]" style={{ height: `${100 + 72 * (stories.length - 1)}svh` }}><section className="sticky top-12 h-[calc(100svh-48px)] overflow-hidden">
    <div className="wrap gutter grid h-full grid-cols-12 items-center gap-10">
      <div className="col-span-5">
        <p className="text-[13px] font-semibold tabular-nums text-bluetext">0{active + 1} / 0{stories.length}</p>
        <p className="text-[12px] font-semibold uppercase tracking-[.14em] text-sub">Featured experience</p>
        <ol className="mt-4 space-y-2">{stories.map((story, index) => <li key={story.slug}><Link to={`/work/${story.slug}`} onFocus={() => setActive(index)} onPointerEnter={() => setActive(index)} aria-current={index === active ? 'true' : undefined} className={`block leading-[1.3] tracking-[-.03em] transition-[color,transform,opacity] duration-300 ${index === active ? 'translate-x-2 text-[30px] font-bold text-ink' : 'text-[24px] font-normal text-ink/35 hover:text-ink/60'}`}>{by(story.slug).name.replace(' 중고거래', '').replace(' 오늘드림', '')}</Link></li>)}</ol>
        <div className="relative mt-8 min-h-[190px] max-w-[44ch]">{stories.map((story, index) => <div key={story.slug} className={`absolute inset-0 transition-[opacity,transform] duration-300 ${index === active ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'}`}>
          <p className="text-[13px] font-semibold uppercase tracking-[.08em] text-sub">{story.category}</p><h2 className="mt-3 text-[24px] font-bold leading-[1.35] tracking-[-.03em]">{story.headline}</h2><p className="mt-3 text-[16px] leading-[1.6] text-sub">{story.description}</p><Link to={`/work/${story.slug}`} className="mt-4 inline-flex min-h-11 items-center border-b border-ink text-[14px] font-semibold">프로젝트 보기 ↗</Link>
        </div>)}</div>
      </div>
      <div className="relative col-span-7 h-[min(74svh,720px)] overflow-hidden rounded-[28px]">{stories.map((story, index) => <div key={story.slug} aria-hidden={index !== active} className={`story-layer absolute inset-0 overflow-hidden rounded-[28px] ${index === active ? 'is-active' : ''}`} style={{ zIndex: index, background: story.bg, color: story.fg }}><StoryArt story={story} /></div>)}</div>
    </div>
  </section></div>
}
