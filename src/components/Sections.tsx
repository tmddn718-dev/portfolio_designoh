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
  const compact: Record<string, string> = { 'karrot-large-furniture': 'UX REDESIGN', nodi: 'PRODUCT CONCEPT', woorisai: 'PRODUCT CONCEPT', trigr: 'SHIPPED PRODUCT' }
  return <><span className="text-[11px] font-semibold uppercase tracking-[.07em] text-sub md:hidden">{compact[p.slug]}</span><span className="hidden text-[12px] font-semibold uppercase tracking-[.08em] text-sub md:inline">{labels[p.slug]}</span></>
}

function FeaturedOlive() {
  const p = by('oliveyoung-todaydream')
  const [open, setOpen] = useState(false)
  return (
    <article className="overflow-hidden rounded-[22px] bg-[#F1F6E8] md:rounded-[28px]">
      <div className="grid md:grid-cols-12">
        <div className="flex flex-col p-6 md:col-span-5 md:p-10 lg:p-12">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sub"><span className="text-[13px] font-semibold tabular-nums text-ink">01 / 05</span><span className="text-[12px] font-semibold uppercase tracking-[.08em]">UX REDESIGN / PERSONAL PROJECT</span></div>
          <h3 className="mt-5 max-w-[13ch] text-[28px] font-bold leading-[1.2] tracking-[-0.035em] md:mt-7 md:text-[38px]">품절 이후에도 구매를 이어갈 수 있도록</h3>
          <p className="mt-4 max-w-[38ch] text-[15px] leading-[1.7] text-ink/75 md:mt-5 md:text-[17px]">오늘드림 품절 시 일반배송과 매장 픽업을 바로 비교하고, 결제까지 이어갈 수 있도록 구매 흐름을 재설계했습니다.</p>
          <dl className="mt-6 grid grid-cols-2 gap-3 border-y border-[#CEDBB7] py-4 tabular-nums md:mt-8 md:gap-4 md:py-5">
            <div><dt className="text-[12px] leading-[1.45] text-sub md:text-[13px]">품절 후 결제 확정</dt><dd className="mt-1 text-[20px] font-bold tracking-tight md:text-[22px]">약 42초<span className="mt-0.5 block text-[11px] font-medium text-sub md:inline md:text-[14px]"> 평균 단축</span></dd></div>
            <div><dt className="text-[12px] leading-[1.45] text-sub md:text-[13px]">배송·혜택 확인 후 결정</dt><dd className="mt-1 text-[20px] font-bold tracking-tight md:text-[22px]">26초<span className="mt-0.5 block text-[11px] font-medium text-sub md:inline md:text-[14px]"> 평균 단축</span></dd></div>
            <p className="col-span-2 text-[11px] leading-[1.5] text-sub md:text-[12px]">동일 참여자 8명 · 기존 앱과 개선 프로토타입 비교</p>
          </dl>
          <div className="mt-6 grid grid-cols-2 gap-2 md:mt-8 md:flex md:flex-wrap md:gap-3"><Link to={`/work/${p.slug}`} className="inline-flex min-h-12 items-center justify-center rounded-full bg-ink px-3 text-[13px] font-semibold text-white hover:-translate-y-0.5 md:px-6 md:text-[15px]">케이스 스터디 보기</Link>{p.proto && <button onClick={() => setOpen(true)} className="min-h-12 rounded-full border border-ink px-3 text-[13px] font-semibold hover:bg-white md:px-6 md:text-[15px]">프로토타입 실행</button>}</div>
        </div>
        <Link to={`/work/${p.slug}`} data-cursor="보기" aria-label="올리브영 오늘드림 케이스 스터디 보기" className="group relative hidden overflow-hidden bg-[#C9F45A] md:col-span-7 md:block md:min-h-[580px]">
          <OliveShowcase />
        </Link>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} label={`${p.name} 프로토타입`}><div className="flex justify-center pt-14"><ProtoFrame p={p} width={320} /></div></Modal>
    </article>
  )
}

const projectOrder = ['karrot-large-furniture', 'nodi', 'woorisai', 'trigr']
const cardCopy: Record<string, string> = {
  'karrot-large-furniture': '대형 가구의 크기와 운반 조건을 채팅 전에 확인해, 구매자가 거래 가능 여부를 빠르게 판단하도록 개선했습니다.',
  nodi: '여러 사람의 일정 조건을 구조화하고 추천 이유를 보여주되, 최종 회의 시간은 사용자가 직접 선택하도록 설계했습니다. 추천 기능은 규칙 기반 데모입니다.',
  woorisai: '여러 앱에 흩어진 사진과 이야기를 하나의 추억으로 모으고, 사람·장소·시간을 기준으로 다시 찾도록 설계했습니다.',
  trigr: '기획서에 빠진 사용자 흐름과 예외 상태를 설계하고, 팀과 협의해 태국 시장 출시까지 연결했습니다.',
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
    <div className={`${tile} bg-[#DCE3FB] [container-type:inline-size]`}>
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(rgba(32,32,32,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(32,32,32,.045)_1px,transparent_1px)] bg-[size:38px_38px]" />
      <p className="absolute left-[6%] top-[8%] z-30 text-[11px] font-bold uppercase tracking-[.2em] text-[#3E4C94]">NODI · Decision support</p>
      <p className="absolute left-[6%] top-[18%] z-30 text-[8.4cqw] font-black leading-[.98] tracking-[-.06em] text-[#202020]">FROM CONDITIONS<br />TO ONE CLEAR TIME.</p>
      <BrowserMockup src="/images/nodi/web-reco.webp" className="bottom-[3%] left-[6%] z-10 w-[55%] -rotate-1 transition-transform duration-300 group-hover:-translate-y-2 group-hover:rotate-0" />
      <div className="absolute bottom-[5%] right-[5%] z-20 w-[28%] rotate-[4deg] overflow-hidden rounded-[12px] border border-[#BFC9F8] bg-white p-2 shadow-[0_24px_46px_rgba(8,15,54,.42)] transition-transform duration-300 group-hover:-translate-y-2 group-hover:rotate-[2deg]">
        <img src="/images/nodi/full-review.webp" alt="" className="aspect-[10/9] w-full rounded-[8px] object-cover object-[50%_23%]" loading="lazy" decoding="async" />
        <p className="px-1 pb-1 pt-2 text-[clamp(9px,1.9cqw,12px)] font-bold uppercase tracking-[.1em] text-[#3E4E91]">Final review · user decides</p>
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

  // 4) trigr: 당근·NODI와 같은 밝은 파스텔 무대, 왼쪽 큰 제목, 오른쪽 아래에서 올라오는 실제 미션 목록 화면
  return (
    <div className={`${tile} bg-[#F6E4F6]`}>
      <span aria-hidden className="absolute -right-[12%] top-[2%] aspect-square w-[62%] rounded-full bg-[#EBC4EC]/70" />
      <p className="absolute left-[6%] top-[8%] z-30 text-[11px] font-bold uppercase tracking-[.2em] text-[#8A2E8E]">Trigr · Shipped product</p>
      <p className="absolute left-[6%] top-[18%] z-30 max-w-[46%] text-[clamp(24px,3.5vw,50px)] font-black leading-[.98] tracking-[-.06em] text-[#2A1230]">FROM GAPS<br />TO FLOWS.</p>
      <ul className="absolute bottom-[8%] left-[6%] z-20 grid w-[42%] grid-cols-2 gap-2 text-[12px] font-bold text-[#4A1C50]">
        {['미션 탐색', '인증 피드', '상금 지급', '정산 신청'].map(t => <li key={t} className="rounded-full border border-[#D9A6DB] bg-white/80 px-3 py-2 text-center">{t}</li>)}
      </ul>
      <Phone src="/images/trigr/mission-discovery-02.png" className="z-20 w-[39%] rotate-[6deg] drop-shadow-[0_32px_52px_rgba(74,28,80,.32)] transition-transform duration-300 group-hover:-translate-y-2 group-hover:rotate-[3deg]" style={{ right: '6%', bottom: '-24%' }} />
    </div>
  )
}

function ProjectCard({ p }: { p: Project }) {
  const index = projectOrder.indexOf(p.slug) + 2
  return (
    <article className="group h-full border-b border-grid pb-5 md:border-0 md:pb-0">
      <Link to={`/work/${p.slug}`} data-cursor="보기" aria-label={`${p.name} 케이스 스터디 보기`} className="grid h-full grid-cols-[104px_1fr] gap-4 rounded-[16px] focus-visible:outline-offset-4 md:flex md:flex-col md:rounded-[24px]">
        <div className="relative overflow-hidden rounded-[14px] md:rounded-[24px]"><ThumbnailVisual p={p} /></div>
        <div className="flex min-w-0 flex-1 items-start justify-between gap-3 md:mt-5 md:gap-5"><div className="min-w-0"><div className="flex flex-wrap items-center gap-x-3 gap-y-1"><span className="text-[12px] font-semibold tabular-nums text-ink md:text-[13px]">0{index} / 05</span><ProjectLabel p={p} /></div><h3 className="mt-2 text-[19px] font-bold leading-[1.25] tracking-[-0.025em] group-hover:text-blue md:mt-3 md:text-[26px]">{p.name}</h3><p className="mt-1 line-clamp-2 max-w-[44ch] text-[14px] leading-[1.55] text-ink/70 md:mt-2 md:text-[16px] md:leading-[1.7]">{cardCopy[p.slug]}</p></div><span aria-hidden className="text-[20px] transition-transform group-hover:translate-x-1 md:mt-7 md:text-[24px]">↗</span></div>
      </Link>
    </article>
  )
}

export function Work() {
  const selected = projectOrder.map(by)
  return (
    <section id="work" className="home-section wrap gutter scroll-mt-16">
      <Reveal className="grid gap-6 md:grid-cols-12 md:items-end"><div className="md:col-span-7"><p className="eyebrow text-bluetext">Selected work</p><SplitText as="h2" className="section-title mt-3 max-w-[18ch]" text={"화면보다,\n문제부터."} /></div><p className="body-copy md:col-span-4 md:col-start-9">UX 개선안부터 실제 출시 경험까지, 각 프로젝트에서 해결한 문제와 설계 근거를 확인할 수 있습니다.</p></Reveal>
      <Reveal className="mt-8 md:mt-14"><FeaturedOlive /></Reveal>
      <div className="mt-16 md:mt-28"><div className="flex items-end justify-between gap-6 border-t border-grid pt-5"><h2 className="text-[24px] font-bold tracking-tight md:text-[36px]">이어지는 작업</h2><p className="hidden text-[14px] text-sub md:block">당근 / NODI / 우리사이 / trigr</p></div><div data-stagger className="mt-6 grid gap-x-8 gap-y-5 md:mt-10 md:grid-cols-2 md:gap-y-16">{selected.map(p => <ProjectCard key={p.slug} p={p} />)}</div></div>
    </section>
  )
}

const approach = [
  { key: 'Observe', title: '사용자가 막히는 순간을 찾습니다', text: '서비스 화면과 사용 행동을 관찰하고, 리뷰와 인터뷰에서 반복되는 질문을 모아 해결할 문제를 구체화합니다.', shot: { src: '/images/oliveyoung-todaydream/n-optMain-indicator.png', alt: '올리브영 기존 품절 옵션 화면', cap: '실제 화면 관찰' } },
  { key: 'Define', title: '판단에 필요한 정보를 구조화합니다', text: '상태와 선택지를 사용자가 판단하는 순서로 재배치하고, 확인된 사실과 가설을 명확히 구분합니다.', shot: { src: '/images/karrot-large-furniture/L-b2.webp?v=20261119-seedtext', alt: '당근 정보 상태 구분 화면', cap: '정보 상태 구분' } },
  { key: 'Complete', title: '막히는 순간의 화면까지 설계합니다', text: '정상 흐름뿐 아니라 입력하지 않았을 때, 불러오지 못했을 때, 다시 시도할 때의 화면과 문구까지 빠뜨리지 않고 설계합니다.', shot: { src: '/images/karrot-large-furniture/L-e1.webp', alt: '당근 정보 조회 실패 화면: 불러오지 못했다는 안내와 다시 시도 버튼', cap: '예외 상태 설계' } },
]

export function Philosophy() {
  return (
    <section id="approach" className="home-section wrap gutter scroll-mt-16">
      <Reveal className="grid gap-5 md:grid-cols-12"><div className="md:col-span-5"><SplitText as="h2" className="section-title" text="Soft Clarity" /></div><p className="body-copy md:col-span-5 md:col-start-8 md:mt-2">복잡한 문제를 관찰하고 핵심을 정의한 뒤, 실제로 확인할 수 있는 경험으로 구현합니다.</p></Reveal>
      <ol className="mt-8 border-t border-grid md:mt-12">{approach.map((item, index) => <li key={item.key} className="border-b border-grid py-6 md:py-10"><div data-stagger className="grid gap-4 md:grid-cols-12 md:items-center md:gap-6"><div className="md:col-span-2"><p className="text-[13px] font-medium tabular-nums text-sub">0{index + 1}</p><h3 className="mt-1 text-[24px] font-bold tracking-[-.03em] md:mt-2 md:text-[28px]">{item.key}</h3></div><div className="md:col-span-5"><p className="text-[18px] font-semibold leading-[1.45] md:text-[20px]">{item.title}</p><p className="mt-2 text-[15px] leading-[1.65] text-sub md:mt-3 md:text-[16px] md:leading-[1.7]">{item.text}</p></div><div className="max-w-[180px] md:col-span-4 md:col-start-9 md:max-w-none"><div data-parallax-y="5"><Zoomable src={item.shot.src} alt={item.shot.alt} caption={item.shot.cap} className="w-full overflow-hidden rounded-[14px] bg-apple md:rounded-[16px]" imgClass="aspect-[16/10] w-full object-contain p-2 md:p-3" /><p className="mt-2 text-[12px] text-sub">{item.shot.cap}</p></div></div></div></li>)}</ol>
    </section>
  )
}

function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => navigator.clipboard?.writeText(email).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1600) }).catch(() => {})
  return <button onClick={copy} className="min-h-11 rounded-full border border-ink px-5 text-[15px] font-semibold hover:bg-white" aria-live="polite">{copied ? '복사됨' : '이메일 복사'}</button>
}

export function AboutContact() {
  const skills = [['Observe', '서비스 화면과 사용자 의견에서 반복되는 불편을 찾아 해결할 문제를 구체화합니다.'], ['Define', '복잡한 상태와 선택지를 사용자가 판단하는 순서에 맞춰 구조화합니다.'], ['Complete', '입력 누락, 불러오기 실패, 재시도처럼 막히는 순간의 화면과 문구까지 빠뜨리지 않고 설계합니다.'], ['Ship', '개발 조건과 제품 제약을 조율하며 실제 출시와 반복 개선에 참여했습니다.']]
  return (
    <><section id="about" className="home-section wrap gutter scroll-mt-16"><Reveal className="grid gap-8 md:grid-cols-12"><div className="md:col-span-4"><SplitText as="h2" className="section-title" text="About" /><p className="mt-4 text-[14px] font-semibold text-bluetext">Product Designer / UX·UI Designer</p></div><div className="md:col-span-8"><p className="max-w-[30ch] text-[24px] font-semibold leading-[1.5] tracking-[-0.02em] md:text-[32px]">복잡한 정보를 사용자가 이해하고 결정할 수 있는 경험으로 바꿉니다.</p><p className="mt-5 max-w-[60ch] text-[16px] leading-[1.75] text-sub">사용자가 막히는 지점을 찾고, 해결안을 동작하는 프로토타입으로 구현합니다. 이후 사용자 피드백과 개발 조건을 함께 검토해 개선합니다. AI는 리서치와 아이디어 탐색에 활용하며, 제품 판단과 최종 결정은 직접 담당합니다.</p><ul data-stagger className="mt-8 grid grid-cols-2 gap-x-5 gap-y-5 md:mt-9 md:gap-x-8 md:gap-y-6">{skills.map(([title, body]) => <li key={title} className="border-t border-grid pt-3 md:pt-4"><p className="font-semibold">{title}</p><p className="mt-2 text-[14px] leading-[1.6] text-sub md:text-[15px] md:leading-[1.65]">{body}</p></li>)}</ul><Link to="/about" className="mt-8 inline-flex min-h-11 items-center border-b border-ink text-[15px] font-semibold">경력과 작업 방식 더 보기 ↗</Link></div></Reveal></section><section id="contact" className="mt-[var(--space-section)] scroll-mt-24 border-y border-grid bg-white"><div data-stagger className="wrap gutter py-16 md:py-28"><p className="section-title max-w-[18ch]">제품의 문제를 함께 해결하고 싶습니다.</p><p className="mt-4 max-w-[54ch] text-[15px] leading-[1.7] text-sub md:mt-5 md:text-[16px]">복잡한 제품 문제를 명확한 사용자 흐름으로 바꾸는 디자이너가 필요하다면 연락해 주세요.</p><div className="mt-7 grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-3"><a className="inline-flex min-h-12 items-center justify-center rounded-full bg-ink px-3 text-[13px] font-semibold text-white hover:-translate-y-0.5 sm:px-6 sm:text-[15px]" href={`mailto:${profile.email}`}>이메일로 연락하기</a><CopyEmail email={profile.email} />{profile.resume && <a className="inline-flex min-h-12 items-center justify-center rounded-full px-4 text-[14px] font-semibold hover:bg-apple" href={profile.resume} target="_blank" rel="noreferrer">이력서 보기 ↗</a>}</div></div></section></>
  )
}
