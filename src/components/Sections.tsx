import { useState } from 'react'
import { Link } from 'react-router-dom'
import { projects, profile, type Project } from '../data/projects'
import Reveal from './Reveal'
import { Modal, Zoomable } from './Modal'
import { ProtoFrame } from './Mockup'
import SplitText from '../motion/SplitText'

const by = (slug: string) => projects.find(p => p.slug === slug)!

const Phone = ({ src, style, className = '' }: { src: string; style?: React.CSSProperties; className?: string }) => (
  <div className={`absolute ${className}`} style={style}><div className="phone-pro"><img src={src} alt="" className="screen" loading="lazy" decoding="async" /><span className="glare" /></div></div>
)

const BrowserMockup = ({ src, className = '' }: { src: string; className?: string }) => (
  <div className={`absolute overflow-hidden rounded-[14px] border border-white/70 bg-white p-[5px] shadow-[0_30px_70px_rgba(0,0,0,.24)] ${className}`}>
    <div className="flex h-5 items-center gap-1.5 rounded-t-[9px] bg-[#F4F5FA] px-2"><i className="h-1.5 w-1.5 rounded-full bg-[#FF7B75]" /><i className="h-1.5 w-1.5 rounded-full bg-[#F6C85F]" /><i className="h-1.5 w-1.5 rounded-full bg-[#69C47B]" /><span className="ml-2 h-1.5 w-[34%] rounded-full bg-[#DDE0EA]" /></div>
    <img src={src} alt="" className="block w-full rounded-b-[9px]" loading="lazy" decoding="async" />
  </div>
)

function OliveShowcase() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#CCF35B]">
      <div aria-hidden className="absolute -right-[16%] -top-[16%] aspect-square w-[78%] rounded-full border-[52px] border-white/20" />
      <div className="absolute left-[7%] top-[7%] z-40 flex max-w-[60%] flex-col items-start">
        <p className="text-[11px] font-bold uppercase tracking-[.2em] text-[#31421B]">Purchase recovery / 2026</p>
        <p className="mt-3 whitespace-nowrap text-[clamp(24px,3.3vw,48px)] font-black leading-[1] tracking-[-.065em] text-[#10150A]">OUT OF STOCK.<br />MORE OPTIONS.</p>
        <span className="mt-4 rounded-full bg-[#11150D] px-4 py-2 text-[12px] font-bold text-white">오늘드림 품절</span>
      </div>
      <div className="absolute bottom-[6%] left-[7%] z-20 w-[32%] rotate-[-5deg] overflow-hidden rounded-[15px] border border-black/10 bg-white p-2 shadow-[0_24px_50px_rgba(35,50,15,.22)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-[-3deg]">
        <img src="/images/oliveyoung-todaydream/n-optC-indicator.png" alt="" className="aspect-[10/11] w-full rounded-[10px] object-cover object-top" loading="lazy" decoding="async" />
        <p className="px-2 pb-1 pt-2 text-[11px] font-bold uppercase tracking-[.12em] text-[#5B654E]">01 · 옵션 선택</p>
      </div>
      <Phone src="/images/oliveyoung-todaydream/n-altMethods.webp" className="z-30 w-[44%] rotate-[2deg] drop-shadow-[0_34px_60px_rgba(27,40,9,.3)] transition-transform duration-300 group-hover:-translate-y-2 group-hover:rotate-0" style={{ right: '-2%', bottom: '-21%' }} />
    </div>
  )
}

function ProjectLabel({ p }: { p: Project }) {
  const labels: Record<string, string> = { 'karrot-large-furniture': 'UX REDESIGN / PERSONAL PROJECT', nodi: 'PRODUCT CONCEPT / FUNCTIONAL PROTOTYPE', woorisai: 'PRODUCT CONCEPT / PERSONAL PROJECT', trigr: 'SHIPPED PRODUCT / PROFESSIONAL EXPERIENCE' }
  return <span className="text-[12px] font-semibold uppercase tracking-[.08em] text-sub">{labels[p.slug]}</span>
}

function FeaturedOlive() {
  const p = by('oliveyoung-todaydream')
  const [open, setOpen] = useState(false)
  return (
    <article className="overflow-hidden rounded-[28px] bg-[#F1F6E8]">
      <div className="grid md:grid-cols-12">
        <div className="flex flex-col p-7 md:col-span-5 md:p-10 lg:p-12">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sub"><span className="text-[13px] font-semibold tabular-nums text-ink">01 / 05</span><span className="text-[12px] font-semibold uppercase tracking-[.08em]">UX REDESIGN / PERSONAL PROJECT</span></div>
          <h3 className="mt-7 max-w-[13ch] text-[30px] font-bold leading-[1.2] tracking-[-0.035em] md:text-[38px]">품절 이후에도 구매를 이어갈 수 있도록</h3>
          <p className="mt-5 max-w-[38ch] text-[16px] leading-[1.75] text-ink/75 md:text-[17px]">구매 가능 옵션을 더 쉽게 탐색하고, 결제 과정의 판단 부담을 줄이는 경험을 설계했습니다.</p>
          <dl className="mt-8 grid grid-cols-2 gap-4 border-y border-[#CEDBB7] py-5 tabular-nums">
            <div><dt className="text-[13px] leading-[1.5] text-sub">품절 후 결제 확정</dt><dd className="mt-1 text-[22px] font-bold tracking-tight">평균 약 42초 단축</dd></div>
            <div><dt className="text-[13px] leading-[1.5] text-sub">배송·혜택 확인 후 결정</dt><dd className="mt-1 text-[22px] font-bold tracking-tight">평균 26초 단축</dd></div>
            <p className="col-span-2 text-[12px] leading-[1.5] text-sub">동일 참여자 8명 · 기존 앱과 개선 프로토타입 비교</p>
          </dl>
          <div className="mt-8 flex flex-wrap gap-3"><Link to={`/work/${p.slug}`} className="inline-flex min-h-12 items-center rounded-full bg-ink px-6 text-[15px] font-semibold text-white hover:-translate-y-0.5">케이스 스터디 보기</Link>{p.proto && <button onClick={() => setOpen(true)} className="min-h-12 rounded-full border border-ink px-6 text-[15px] font-semibold hover:bg-white">프로토타입 실행</button>}</div>
        </div>
        <Link to={`/work/${p.slug}`} data-cursor="보기" aria-label="올리브영 오늘드림 케이스 스터디 보기" className="group relative min-h-[420px] overflow-hidden bg-[#C9F45A] md:col-span-7 md:min-h-[580px]">
          <OliveShowcase />
        </Link>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} label={`${p.name} 프로토타입`}><div className="flex justify-center pt-14"><ProtoFrame p={p} width={320} /></div></Modal>
    </article>
  )
}

const projectOrder = ['karrot-large-furniture', 'nodi', 'woorisai', 'trigr']
const cardCopy: Record<string, string> = {
  'karrot-large-furniture': '대형 가구의 상세 정보와 거래 조건을 미리 확인해, 거래 약속 조율에 집중할 수 있도록 개선했습니다.',
  nodi: '복잡한 일정 조건을 구조화하고 추천 이유를 설명해, 최종 선택은 사용자가 직접 내리도록 설계했습니다. 추천은 규칙 기반 데모입니다.',
  woorisai: '흩어진 사진과 이야기를 하나의 추억으로 쌓고, 사람과 장소, 시간의 맥락으로 다시 찾도록 설계했습니다.',
  trigr: '정의되지 않은 요구사항을 실제 사용자 흐름으로 구체화하다.',
}

function ThumbnailVisual({ p }: { p: Project }) {
  const tile = 'relative aspect-[4/3] overflow-hidden'
  // 1) 당근: 생활 사진을 무대로, 핵심 상세 화면 하나와 치수 정보만 남긴 컨텍스트 목업
  if (p.slug === 'karrot-large-furniture') return (
    <div className={`${tile} bg-[#D9C4AD]`}>
      <img src="/proto/karrot/images/sofa.png" alt="" className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.025]" loading="lazy" decoding="async" />
      <div className="absolute inset-0 bg-[#4A2D1E]/25" />
      <div className="absolute inset-y-0 left-0 w-[47%] bg-[#F5E7D8]/95" />
      <p className="absolute left-[6%] top-[8%] z-20 text-[11px] font-bold uppercase tracking-[.2em] text-[#A34510]">Karrot · UX redesign</p>
      <p className="absolute left-[6%] top-[18%] z-20 max-w-[36%] text-[clamp(24px,3.5vw,50px)] font-black leading-[.98] tracking-[-.06em] text-[#271A14]">KNOW IT.<br />MOVE IT.</p>
      <div className="absolute bottom-[8%] left-[6%] z-20 grid w-[35%] grid-cols-3 gap-1.5 border-y border-[#BDA48E] py-3 text-center text-[#593B2C]"><span className="text-[9px] uppercase tracking-wider">Width<b className="mt-1 block text-[13px] text-[#21150F]">140cm</b></span><span className="text-[9px] uppercase tracking-wider">Depth<b className="mt-1 block text-[13px] text-[#21150F]">80cm</b></span><span className="text-[9px] uppercase tracking-wider">Height<b className="mt-1 block text-[13px] text-[#21150F]">75cm</b></span></div>
      <Phone src="/images/karrot-large-furniture/L-b1.webp?v=20261119-seedtext" className="z-20 w-[39%] rotate-[6deg] drop-shadow-[0_32px_52px_rgba(31,18,10,.42)] transition-transform duration-300 group-hover:-translate-y-2 group-hover:rotate-[3deg]" style={{ right: '6%', bottom: '-24%' }} />
    </div>
  )

  // 2) NODI: 모바일 목업 대신 웹 결과 화면과 의사결정 카드가 겹치는 SaaS 데스크톱 구도
  if (p.slug === 'nodi') return (
    <div className={`${tile} bg-[#DCE3FB]`}>
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(rgba(32,32,32,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(32,32,32,.045)_1px,transparent_1px)] bg-[size:38px_38px]" />
      <p className="absolute left-[6%] top-[6%] z-30 text-[11px] font-bold uppercase tracking-[.2em] text-[#3E4C94]">NODI · Decision support</p>
      <p className="absolute left-[6%] top-[13%] z-30 text-[clamp(20px,2.5vw,36px)] font-black leading-[1] tracking-[-.055em] text-[#202020]">FROM CONDITIONS<br />TO ONE CLEAR TIME.</p>
      <BrowserMockup src="/images/nodi/web-reco.webp" className="bottom-[5%] left-[6%] z-10 w-[68%] -rotate-1 transition-transform duration-300 group-hover:-translate-y-2 group-hover:rotate-0" />
      <div className="absolute bottom-[6%] right-[5%] z-20 w-[31%] rotate-[4deg] overflow-hidden rounded-[12px] border border-[#BFC9F8] bg-white p-2 shadow-[0_24px_46px_rgba(8,15,54,.42)] transition-transform duration-300 group-hover:-translate-y-2 group-hover:rotate-[2deg]">
        <img src="/images/nodi/full-review.webp" alt="" className="aspect-[10/11] w-full rounded-[8px] object-cover object-[50%_23%]" loading="lazy" decoding="async" />
        <p className="px-1 pb-1 pt-2 text-[9px] font-bold uppercase tracking-[.12em] text-[#3E4E91]">Final review · user decides</p>
      </div>
    </div>
  )

  // 3) 우리사이: 한 대의 기기보다 사진과 기억 카드가 먼저 보이는 에디토리얼 아카이브
  if (p.slug === 'woorisai') return (
    <div className={`${tile} bg-[#E9E6DA]`}>
      <p className="absolute left-[6%] top-[8%] z-30 text-[11px] font-bold uppercase tracking-[.2em] text-[#526555]">Woorisai · Memory archive</p>
      <div className="absolute left-[6%] top-[15%] z-20 h-[80%] w-[48%] overflow-hidden rounded-[4px] bg-white p-2 shadow-[0_22px_46px_rgba(48,57,45,.2)] transition-transform duration-300 group-hover:-translate-y-1">
        <img src="/images/woorisai/detail.webp" alt="" className="h-full w-full object-cover object-[50%_10%]" loading="lazy" decoding="async" />
      </div>
      <div className="absolute right-[6%] top-[12%] z-10 h-[36%] w-[31%] rotate-[4deg] overflow-hidden bg-white p-2 shadow-[0_18px_40px_rgba(48,57,45,.18)] transition-transform duration-300 group-hover:rotate-[2deg]">
        <img src="/images/woorisai/feed.webp" alt="" className="h-full w-full object-cover object-[50%_31%]" loading="lazy" decoding="async" />
      </div>
      <div className="absolute bottom-[8%] right-[6%] z-30 w-[42%] border-l border-[#839284] pl-4"><p className="text-[10px] uppercase tracking-[.16em] text-[#66766A]">Nov. 08 · Hangang</p><p className="mt-2 text-[clamp(20px,2.8vw,40px)] font-black leading-[1.02] tracking-[-.055em] text-[#263B2F]">MEMORIES,<br />WITH CONTEXT.</p></div>
    </div>
  )

  // 4) trigr: 한 화면을 강하게 크롭하고 실제 제품 모듈을 전시하는 다크 프로덕트 포스터
  return (
    <div className={`${tile} bg-[#1B1020]`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_45%,#62245F_0%,#28142E_42%,#170B1B_76%)]" />
      <span aria-hidden className="absolute -right-[9%] top-[8%] aspect-square w-[60%] rounded-full border border-[#EE7CF0]/30" />
      <p className="absolute left-[6%] top-[8%] z-30 text-[11px] font-bold uppercase tracking-[.2em] text-[#F1B4F2]">Trigr · Shipped product</p>
      <p className="absolute left-[6%] top-[18%] z-30 max-w-[42%] text-[clamp(24px,3.5vw,50px)] font-black leading-[.98] tracking-[-.06em] text-white">FROM GAPS<br />TO FLOWS.</p>
      <div className="absolute bottom-[9%] left-[6%] z-20 w-[31%] overflow-hidden rounded-[12px] border border-white/15 bg-white/10 p-2 shadow-[0_24px_48px_rgba(0,0,0,.36)] backdrop-blur-sm transition-transform duration-300 group-hover:-translate-y-1">
        <img src="/images/trigr/home-map.webp" alt="" className="h-[120px] w-full rounded-[8px] object-cover object-[50%_22%] sm:h-[140px]" loading="lazy" decoding="async" />
        <p className="px-1 pb-1 pt-2 text-[9px] font-bold uppercase tracking-[.12em] text-[#E9B5E8]">Discover nearby</p>
      </div>
      <Phone src="/images/trigr/mission-discovery-02.png" className="z-20 w-[41%] rotate-[-3deg] drop-shadow-[0_34px_60px_rgba(0,0,0,.58)] transition-transform duration-300 group-hover:-translate-y-2 group-hover:rotate-[-1deg]" style={{ right: '5%', bottom: '-27%' }} />
    </div>
  )
}

function ProjectCard({ p }: { p: Project }) {
  const index = projectOrder.indexOf(p.slug) + 2
  return (
    <article className="group h-full">
      <Link to={`/work/${p.slug}`} data-cursor="보기" aria-label={`${p.name} 케이스 스터디 보기`} className="flex h-full flex-col rounded-[24px] focus-visible:outline-offset-4">
        <div className="relative overflow-hidden rounded-[24px]"><ThumbnailVisual p={p} /></div>
        <div className="mt-5 flex flex-1 items-start justify-between gap-5"><div><div className="flex flex-wrap items-center gap-x-4 gap-y-2"><span className="text-[13px] font-semibold tabular-nums text-ink">0{index} / 05</span><ProjectLabel p={p} /></div><h3 className="mt-3 text-[22px] font-bold tracking-[-0.025em] group-hover:text-blue md:text-[26px]">{p.name}</h3><p className="mt-2 max-w-[44ch] text-[16px] leading-[1.7] text-ink/70">{cardCopy[p.slug]}</p></div><span aria-hidden className="mt-7 text-[24px] transition-transform group-hover:translate-x-1">↗</span></div>
      </Link>
    </article>
  )
}

export function Work() {
  const selected = projectOrder.map(by)
  return (
    <section id="work" className="home-section wrap gutter scroll-mt-16">
      <Reveal className="grid gap-6 md:grid-cols-12 md:items-end"><div className="md:col-span-7"><p className="eyebrow text-bluetext">Selected work</p><SplitText as="h2" className="section-title mt-3 max-w-[18ch]" text={"Projects,\nbefore screens."} /></div><p className="body-copy md:col-span-4 md:col-start-9">대표 UX 개선부터 출시 경험까지, 해결한 문제와 설계 판단을 비교해 살펴볼 수 있습니다.</p></Reveal>
      <Reveal className="mt-12 md:mt-14"><FeaturedOlive /></Reveal>
      <div className="mt-24 md:mt-28"><div className="flex items-end justify-between gap-6 border-t border-grid pt-5"><h2 className="text-[28px] font-bold tracking-tight md:text-[36px]">이어지는 작업</h2><p className="hidden text-[14px] text-sub md:block">당근 / NODI / 우리사이 / trigr</p></div><div data-stagger className="mt-10 grid gap-x-8 gap-y-16 md:grid-cols-2">{selected.map(p => <ProjectCard key={p.slug} p={p} />)}</div></div>
    </section>
  )
}

const approach = [
  { key: 'Observe', title: '실제 흐름에서 문제를 발견합니다', text: '서비스 화면과 사용자 행동을 관찰하고, 리뷰와 인터뷰에서 반복되는 질문을 모아 문제의 순간을 좁힙니다.', shot: { src: '/images/oliveyoung-todaydream/n-optMain-indicator.png', alt: '올리브영 기존 품절 옵션 화면', cap: '실제 화면 관찰' } },
  { key: 'Define', title: '판단에 필요한 구조를 정합니다', text: '상태와 선택지를 사용자의 판단 순서로 다시 배열하고, 확인되지 않은 정보는 확정된 사실과 구분합니다.', shot: { src: '/images/karrot-large-furniture/L-b2.webp?v=20261119-seedtext', alt: '당근 정보 상태 구분 화면', cap: '정보 상태 구분' } },
  { key: 'Craft', title: '동작하는 경험으로 검증합니다', text: '클릭 가능한 프로토타입을 직접 구현하고, 과제 수행과 피드백을 확인해 다음 개선으로 연결합니다.', shot: { src: '/images/trigr/tr-reward-2.webp', alt: 'trigr 남은 상금 계산 화면', cap: '제품 경험 구현' } },
]

export function Philosophy() {
  return (
    <section id="approach" className="home-section wrap gutter scroll-mt-16">
      <Reveal className="grid gap-5 md:grid-cols-12"><div className="md:col-span-5"><SplitText as="h2" className="section-title" text="Soft Clarity" /></div><p className="body-copy md:col-span-5 md:col-start-8 md:mt-2">복잡함을 지우는 대신 관찰하고, 정의하고, 실제로 작동하는 형태까지 만듭니다.</p></Reveal>
      <ol className="mt-12 border-t border-grid">{approach.map((item, index) => <li key={item.key} className="border-b border-grid py-8 md:py-10"><div data-stagger className="grid gap-6 md:grid-cols-12 md:items-center"><div className="md:col-span-2"><p className="text-[13px] font-medium tabular-nums text-sub">0{index + 1}</p><h3 className="mt-2 text-[28px] font-bold tracking-[-.03em]">{item.key}</h3></div><div className="md:col-span-5"><p className="text-[20px] font-semibold leading-[1.45]">{item.title}</p><p className="mt-3 text-[16px] leading-[1.7] text-sub">{item.text}</p></div><div className="md:col-span-4 md:col-start-9"><div data-parallax-y="5"><Zoomable src={item.shot.src} alt={item.shot.alt} caption={item.shot.cap} className="w-full overflow-hidden rounded-[16px] bg-apple" imgClass="aspect-[16/10] w-full object-contain p-3" /><p className="mt-2 text-[12px] text-sub">{item.shot.cap}</p></div></div></div></li>)}</ol>
    </section>
  )
}

function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => navigator.clipboard?.writeText(email).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1600) }).catch(() => {})
  return <button onClick={copy} className="min-h-11 rounded-full border border-ink px-5 text-[15px] font-semibold hover:bg-white" aria-live="polite">{copied ? '복사됨' : '이메일 복사'}</button>
}

export function AboutContact() {
  const skills = [['Observe', '서비스 화면, 사용자 리뷰와 인터뷰에서 반복되는 질문을 찾아 문제를 좁힙니다.'], ['Define', '복잡한 상태와 선택지를 사용자의 판단 순서에 맞게 구조화합니다.'], ['Prototype', '설계안을 직접 눌러보고 과제로 확인할 수 있는 형태까지 구현합니다.'], ['Ship', '개발 조건과 제품 제약을 조율하며 실제 출시와 반복 개선에 참여했습니다.']]
  return (
    <><section id="about" className="home-section wrap gutter scroll-mt-16"><Reveal className="grid gap-8 md:grid-cols-12"><div className="md:col-span-4"><SplitText as="h2" className="section-title" text="About" /><p className="mt-4 text-[14px] font-semibold text-bluetext">Product Designer / UX·UI Designer</p></div><div className="md:col-span-8"><p className="max-w-[30ch] text-[24px] font-semibold leading-[1.5] tracking-[-0.02em] md:text-[32px]">복잡한 정보를 사용자가 이해하고 결정할 수 있는 경험으로 바꿉니다.</p><p className="mt-5 max-w-[60ch] text-[16px] leading-[1.75] text-sub">실제 경험에서 문제를 발견하고, 동작하는 프로토타입으로 구체화한 뒤 사용자 피드백과 구현 조건을 함께 보며 개선합니다. AI는 리서치와 아이디어 탐색을 돕는 도구로 사용하며, 제품 판단과 최종 결정은 직접 검토합니다.</p><ul data-stagger className="mt-9 grid gap-x-8 gap-y-6 sm:grid-cols-2">{skills.map(([title, body]) => <li key={title} className="border-t border-grid pt-4"><p className="font-semibold">{title}</p><p className="mt-2 text-[15px] leading-[1.65] text-sub">{body}</p></li>)}</ul><Link to="/about" className="mt-8 inline-flex min-h-11 items-center border-b border-ink text-[15px] font-semibold">경력과 작업 방식 더 보기 ↗</Link></div></Reveal></section><section id="contact" className="mt-[var(--space-section)] scroll-mt-24 border-y border-grid bg-white"><div data-stagger className="wrap gutter py-20 md:py-28"><p className="section-title max-w-[18ch]">함께 명확한 경험을 만들어요.</p><p className="mt-5 max-w-[54ch] text-[16px] leading-[1.7] text-sub">제품의 복잡한 문제를 정리하고, 실제로 확인할 수 있는 경험으로 만드는 일을 이야기하고 싶습니다.</p><div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"><a className="inline-flex min-h-12 items-center justify-center rounded-full bg-ink px-6 text-[15px] font-semibold text-white hover:-translate-y-0.5" href={`mailto:${profile.email}`}>이메일로 연락하기</a><CopyEmail email={profile.email} />{profile.resume && <a className="inline-flex min-h-12 items-center justify-center rounded-full px-5 text-[15px] font-semibold hover:bg-apple" href={profile.resume} target="_blank" rel="noreferrer">이력서 보기 ↗</a>}</div></div></section></>
  )
}
