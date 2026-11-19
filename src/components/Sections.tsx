import { useState } from 'react'
import { Link } from 'react-router-dom'
import { projects, profile, type Project } from '../data/projects'
import Reveal from './Reveal'
import { Modal, Zoomable } from './Modal'
import { ProtoFrame } from './Mockup'
import SplitText from '../motion/SplitText'

const by = (slug: string) => projects.find(p => p.slug === slug)!

function ProjectLabel({ p }: { p: Project }) {
  const labels: Record<string, string> = { 'karrot-large-furniture': 'UX REDESIGN / PERSONAL PROJECT', nodi: 'PRODUCT CONCEPT / FUNCTIONAL PROTOTYPE', woorisai: 'PRODUCT CONCEPT / PERSONAL PROJECT', trigr: 'SHIPPED PRODUCT / PROFESSIONAL EXPERIENCE' }
  return <span className="text-[11px] font-semibold uppercase tracking-[.08em] text-sub">{labels[p.slug]}</span>
}

function FeaturedOlive() {
  const p = by('oliveyoung-todaydream')
  const [open, setOpen] = useState(false)
  return (
    <article className="overflow-hidden rounded-[28px] bg-[#F1F6E8]">
      <div className="grid md:grid-cols-12">
        <div className="flex flex-col p-7 md:col-span-5 md:p-10 lg:p-12">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sub"><span className="text-[13px] font-semibold tabular-nums text-ink">01 / 05</span><span className="text-[11px] font-semibold uppercase tracking-[.08em]">UX REDESIGN / PERSONAL PROJECT</span></div>
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
          <span aria-hidden className="absolute -right-[18%] -top-[20%] h-[72%] w-[72%] rounded-full border-[52px] border-white/20" />
          <span aria-hidden className="absolute bottom-[17%] left-[9%] h-[24%] w-[24%] rounded-full border border-black/15" />
          <div className="absolute left-6 top-7 z-20 max-w-[11ch] text-[clamp(27px,3.6vw,52px)] font-black leading-[1.1] tracking-[-0.07em] text-black md:left-9 md:top-10">OUT OF STOCK.<br />MORE OPTIONS.</div>
          <span aria-hidden className="absolute bottom-6 left-7 z-20 text-[11px] font-bold uppercase tracking-[.18em] text-black/60 md:left-10">Purchase recovery / 2026</span>
          <div data-parallax-y="9" className="pointer-events-none absolute inset-0 z-10">
          <img src="/proto/oliveyoung/public/assets/product-03.png" alt="" className="absolute left-[7%] top-[38%] z-10 w-[15%] -rotate-12 drop-shadow-[0_16px_20px_rgba(54,77,12,.18)] transition-transform duration-300 group-hover:-translate-y-2" />
          <img src="/proto/oliveyoung/public/assets/product-05.png" alt="" className="absolute bottom-[13%] left-[19%] z-10 w-[16%] rotate-6 drop-shadow-[0_16px_20px_rgba(54,77,12,.18)] transition-transform duration-300 group-hover:-translate-y-1" />
          </div>
          <div data-parallax-y="-3" className="pointer-events-none absolute inset-0 z-10">
          <div className="absolute -bottom-[28%] right-[-4%] z-10 w-[57%] rotate-[2deg] transition-transform duration-300 group-hover:-translate-y-2 group-hover:rotate-0"><div className="phone-pro"><img src="/images/oliveyoung-todaydream/n-altMethods.webp" alt="" className="screen" /><span className="glare" /></div></div>
          </div>
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

// 홈 카드 섬네일: 프로젝트마다 구도를 다르게 한다(애플 코리아 홈의 타일처럼: 중앙 정렬 단독 기기 · 부채꼴 겹침 · 위에서 내려오는 구도 · 크게 잘린 기울임)
const Phone = ({ src, style, className = '' }: { src: string; style?: React.CSSProperties; className?: string }) => (
  <div className={`absolute ${className}`} style={style}><div className="phone-pro"><img src={src} alt="" className="screen" /><span className="glare" /></div></div>
)

const BrowserMockup = ({ src, className = '' }: { src: string; className?: string }) => (
  <div className={`absolute overflow-hidden rounded-[14px] border border-white/70 bg-white p-[5px] shadow-[0_30px_70px_rgba(35,48,112,.24)] ${className}`}>
    <div className="flex h-5 items-center gap-1.5 rounded-t-[9px] bg-[#F4F5FA] px-2"><i className="h-1.5 w-1.5 rounded-full bg-[#FF7B75]" /><i className="h-1.5 w-1.5 rounded-full bg-[#F6C85F]" /><i className="h-1.5 w-1.5 rounded-full bg-[#69C47B]" /><span className="ml-2 h-1.5 w-[34%] rounded-full bg-[#DDE0EA]" /></div>
    <img src={src} alt="" className="block w-full rounded-b-[9px]" />
  </div>
)

function ThumbnailVisual({ p }: { p: Project }) {
  const tile = 'relative aspect-[4/3] overflow-hidden transition-transform duration-300 group-hover:scale-[1.015]'
  // 1) 당근: 실제 가구 사진 위에 탐색 화면과 정보 화면을 겹친 에디토리얼 목업
  if (p.slug === 'karrot-large-furniture') return (
    <div className={`${tile} bg-[#EFC9AA]`}>
      <img src="/proto/karrot/images/sofa.png" alt="" className="absolute inset-0 h-full w-full object-cover object-center opacity-95" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#F6E6D6] via-[#F6E6D6]/75 to-transparent" />
      <div className="absolute -left-[9%] -top-[18%] h-[72%] w-[58%] rounded-full border border-[#C87032]/20" />
      <p className="absolute left-[6%] top-[8%] z-30 text-[10px] font-bold uppercase tracking-[.18em] text-[#B5500C]">Size · Move · Disassemble</p>
      <p className="absolute left-[6%] top-[16%] z-30 max-w-[52%] text-[clamp(21px,2.6vw,40px)] font-black leading-[1.1] tracking-[-.055em] text-[#2B1D16]">BETTER DECISIONS<br />BEFORE CHAT.</p>
      <Phone src="/images/karrot-large-furniture/f-home.webp?v=20261119-seedtext" className="z-10 w-[25%] rotate-[-8deg] opacity-90 drop-shadow-[0_24px_42px_rgba(55,28,14,.25)]" style={{ left: '39%', bottom: '-25%' }} />
      <Phone src="/images/karrot-large-furniture/L-b1.webp?v=20261119-seedtext" className="z-20 w-[34%] rotate-[4deg] drop-shadow-[0_32px_50px_rgba(55,28,14,.34)] transition-transform duration-300 group-hover:-translate-y-2 group-hover:rotate-[2deg]" style={{ right: '4%', bottom: '-34%' }} />
      <span aria-hidden className="absolute bottom-[10%] left-[6%] z-30 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold text-[#2B1D16] shadow-[0_8px_24px_rgba(55,28,14,.18)]">140 × 80 × 75cm</span>
      <span aria-hidden className="absolute bottom-[10%] left-[27%] z-30 rounded-full bg-[#FF6F0F] px-3 py-1.5 text-[11px] font-bold text-white shadow-[0_8px_24px_rgba(255,111,15,.3)]">거래 전 확인</span>
    </div>
  )

  // 2) NODI: 데스크톱 추천 결과를 크게, 최종 검토 모바일 화면을 전면에
  if (p.slug === 'nodi') return (
    <div className={`${tile} bg-gradient-to-b from-[#E4E8FF] to-[#CBD4FF]`}>
      <span aria-hidden className="absolute -right-[8%] -top-[14%] h-[78%] w-[62%] rounded-full border-[44px] border-white/25" />
      <span aria-hidden className="absolute inset-x-0 bottom-[-7%] text-center text-[clamp(110px,19vw,250px)] font-black leading-none tracking-[-.08em] text-[#3D5ADA]/[.08]">NODI</span>
      <p className="absolute left-[6%] top-[8%] z-30 max-w-[52%] text-[clamp(21px,2.4vw,37px)] font-black leading-[1.1] tracking-[-.055em] text-[#17224C]">AI UNDERSTANDS.<br />YOU DECIDE.</p>
      <BrowserMockup src="/images/nodi/web-reco.webp" className="bottom-[8%] left-[7%] z-10 w-[68%] -rotate-2 transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-0" />
      <Phone src="/images/nodi/full-review.webp" className="z-20 w-[27%] rotate-[7deg] drop-shadow-[0_28px_46px_rgba(43,59,145,.3)] transition-transform duration-300 group-hover:-translate-y-2 group-hover:rotate-[4deg]" style={{ right: '3%', bottom: '-25%' }} />
      <span className="absolute bottom-[6%] left-[8%] z-30 rounded-full bg-[#3155D9] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.12em] text-white">Recommendation rationale</span>
    </div>
  )

  // 3) 우리사이: 사진이 중심이 되는 두 개의 큰 화면과 여백 있는 타이포
  if (p.slug === 'woorisai') return (
    <div className={`${tile} bg-[#EEEDE3]`}>
      <span aria-hidden className="absolute -right-[12%] -top-[28%] h-[82%] w-[64%] rounded-full bg-[#D7DDC9]" />
      <span aria-hidden className="absolute right-[38%] top-[18%] h-24 w-24 rounded-full border border-[#829386]/40" />
      <Phone src="/images/woorisai/detail.webp" className="z-10 w-[30%] rotate-[-7deg] opacity-90 drop-shadow-[0_24px_40px_rgba(40,56,47,.22)] transition-transform duration-300 group-hover:-translate-y-1" style={{ right: '29%', top: '-14%' }} />
      <Phone src="/images/woorisai/home.webp" className="z-20 w-[38%] rotate-[5deg] drop-shadow-[0_30px_46px_rgba(40,56,47,.28)] transition-transform duration-300 group-hover:translate-y-2 group-hover:rotate-[3deg]" style={{ right: '-4%', top: '-21%' }} />
      <p className="absolute bottom-[39%] left-[6%] z-30 text-[10px] font-bold uppercase tracking-[.18em] text-[#566B5C]">A shared memory archive</p>
      <p className="absolute bottom-[7%] left-[6%] z-30 max-w-[56%] text-[clamp(20px,2.35vw,36px)] font-black leading-[1.1] tracking-[-.055em] text-[#263B2F]">SHARED MOMENTS,<br />REDISCOVERED.</p>
    </div>
  )

  // 4) trigr: 출시 제품의 지도와 미션 목록을 겹친 다크 캠페인 포스터
  return (
    <div className={`${tile} bg-[#1B1020]`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_46%,#6F276F_0%,#28142E_44%,#170B1B_78%)]" />
      <span aria-hidden className="absolute right-[7%] top-[10%] aspect-square w-[44%] rounded-full border border-[#EE7CF0]/35" />
      <span aria-hidden className="absolute right-[13%] top-[19%] aspect-square w-[32%] rounded-full border border-[#EE7CF0]/20" />
      <p className="absolute left-[6%] top-[8%] z-10 text-[10px] font-bold uppercase tracking-[.16em] text-[#F1B4F2]">Trigr · Launched in Thailand</p>
      <p className="absolute left-[6%] top-[17%] z-10 max-w-[45%] text-[clamp(23px,2.7vw,42px)] font-black leading-[1.1] tracking-[-.06em] text-white">FROM GAPS<br />TO FLOWS.</p>
      <div className="absolute bottom-[8%] left-[6%] z-30 flex max-w-[54%] flex-wrap gap-2">{['Product Design', 'UX/UI Design', 'Design System', 'Product Launch'].map((m, i) => <span key={m} className={`rounded-full px-3 py-2 text-[10px] font-bold uppercase tracking-[.1em] text-white shadow-[0_8px_18px_rgba(0,0,0,.18)] ${i === 3 ? 'bg-[#DE5DE2]' : 'border border-white/45 bg-[#1B1020]/80 backdrop-blur'}`}>{m}</span>)}</div>
      <Phone src="/images/trigr/home-map.webp" className="z-10 w-[29%] rotate-[-10deg] opacity-85 drop-shadow-[0_28px_54px_rgba(0,0,0,.5)]" style={{ right: '24%', bottom: '-30%' }} />
      <Phone src="/images/trigr/mission-discovery-02.png" className="z-20 w-[36%] rotate-[4deg] drop-shadow-[0_34px_60px_rgba(0,0,0,.58)] transition-transform duration-300 group-hover:-translate-y-2 group-hover:rotate-[2deg]" style={{ right: '-1%', bottom: '-31%' }} />
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
  { key: 'Observe', title: '실제 흐름에서 문제를 발견합니다', text: '서비스 화면과 사용자 행동을 관찰하고, 리뷰와 인터뷰에서 반복되는 질문을 모아 문제의 순간을 좁힙니다.', shot: { src: '/images/oliveyoung-todaydream/n-optMain.webp', alt: '올리브영 기존 품절 옵션 화면', cap: '실제 화면 관찰' } },
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
