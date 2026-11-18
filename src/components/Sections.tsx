import { useState } from 'react'
import { Link } from 'react-router-dom'
import { projects, profile, type Project } from '../data/projects'
import Reveal from './Reveal'
import { Modal, Zoomable } from './Modal'
import { ProtoFrame } from './Mockup'

const by = (slug: string) => projects.find(p => p.slug === slug)!

function ProjectLabel({ p }: { p: Project }) {
  const launched = p.slug === 'trigr'
  return <span className="inline-flex items-center gap-2 text-[13px] font-semibold"><span aria-hidden className="h-2 w-2 rounded-full" style={{ background: launched ? '#DE5DE2' : p.accent }} />{launched ? 'Launched Product' : 'Personal Case Study'}</span>
}

function FeaturedOlive() {
  const p = by('oliveyoung-todaydream')
  const [open, setOpen] = useState(false)
  return (
    <article className="overflow-hidden rounded-[28px] bg-[#F1F6E8]">
      <div className="grid md:grid-cols-12">
        <div className="flex flex-col p-7 md:col-span-5 md:p-10 lg:p-12">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sub"><span className="eyebrow text-ink">Featured project / 01</span><span className="text-[13px] font-medium">Commerce UX Redesign</span></div>
          <h3 className="mt-7 max-w-[12ch] text-[30px] font-bold leading-[1.2] tracking-[-0.035em] md:text-[38px]">품절은 구매의 끝이어야 할까?</h3>
          <p className="mt-5 max-w-[38ch] text-[16px] leading-[1.75] text-ink/75 md:text-[17px]">오늘드림 품절 이후에도 다른 구매 방법을 자연스럽게 찾고 결제까지 이어갈 수 있도록 구매 경험을 재설계했습니다.</p>
          <dl className="mt-8 grid grid-cols-2 gap-4 border-y border-[#CEDBB7] py-5 tabular-nums">
            <div><dt className="text-[13px] leading-[1.5] text-sub">품절 후 결제 확정</dt><dd className="mt-1 text-[22px] font-bold tracking-tight">평균 약 42초 단축</dd></div>
            <div><dt className="text-[13px] leading-[1.5] text-sub">배송·혜택 확인 후 결정</dt><dd className="mt-1 text-[22px] font-bold tracking-tight">평균 26초 단축</dd></div>
            <p className="col-span-2 text-[12px] leading-[1.5] text-sub">동일 참여자 8명 · 기존 앱과 개선 프로토타입 비교</p>
          </dl>
          <div className="mt-8 flex flex-wrap gap-3"><Link to={`/work/${p.slug}`} className="inline-flex min-h-12 items-center rounded-full bg-ink px-6 text-[15px] font-semibold text-white hover:-translate-y-0.5">케이스 스터디 보기</Link>{p.proto && <button onClick={() => setOpen(true)} className="min-h-12 rounded-full border border-ink px-6 text-[15px] font-semibold hover:bg-white">프로토타입 실행</button>}</div>
        </div>
        <Link to={`/work/${p.slug}`} aria-label="올리브영 오늘드림 케이스 스터디 보기" className="group relative min-h-[420px] overflow-hidden bg-[#C9F45A] md:col-span-7 md:min-h-[580px]">
          <div className="absolute left-6 top-7 z-20 max-w-[11ch] text-[clamp(30px,4vw,58px)] font-black leading-[.9] tracking-[-0.07em] text-black md:left-9 md:top-10">OUT OF STOCK.<br />MORE OPTIONS.</div>
          <span aria-hidden className="absolute bottom-6 left-7 z-20 text-[11px] font-bold uppercase tracking-[.18em] text-black/60 md:left-10">Purchase recovery / 2026</span>
          <img src="/proto/oliveyoung/public/assets/product-03.png" alt="" className="absolute left-[7%] top-[38%] z-10 w-[15%] -rotate-12 drop-shadow-[0_16px_20px_rgba(54,77,12,.18)] transition-transform duration-300 group-hover:-translate-y-2" />
          <img src="/proto/oliveyoung/public/assets/product-05.png" alt="" className="absolute bottom-[13%] left-[19%] z-10 w-[16%] rotate-6 drop-shadow-[0_16px_20px_rgba(54,77,12,.18)] transition-transform duration-300 group-hover:-translate-y-1" />
          <div className="absolute -bottom-[31%] right-[-5%] z-10 w-[58%] transition-transform duration-300 group-hover:-translate-y-2 group-hover:-rotate-1"><div className="phone-pro"><img src="/images/oliveyoung-todaydream/n-altMethods.webp" alt="" className="screen" /><span className="glare" /></div></div>
          <div className="absolute bottom-[-22%] right-[38%] w-[26%] rotate-[-7deg] opacity-75"><div className="phone-pro"><img src="/images/oliveyoung-todaydream/n-optC.webp" alt="" className="screen" /><span className="glare" /></div></div>
        </Link>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} label={`${p.name} 프로토타입`}><div className="flex justify-center pt-14"><ProtoFrame p={p} width={320} /></div></Modal>
    </article>
  )
}

const projectOrder = ['karrot-large-furniture', 'nodi', 'woorisai', 'trigr']
const cardCopy: Record<string, string> = {
  'karrot-large-furniture': '채팅하기 전에 크기·분해·운반 조건을 확인하고 거래 가능성을 판단하도록 정보를 구조화했습니다.',
  nodi: 'AI는 복잡한 조건을 이해하고 설명하되, 후보 선택과 최종 확정은 사용자가 직접 하도록 설계했습니다.',
  woorisai: '흩어진 사진과 이야기를 함께 쌓고 사람·장소·시간으로 다시 발견하는 공동 기록 경험입니다.',
  trigr: '디자인 시스템이 없던 초기 단계부터 세 차례의 개편과 태국 출시까지 참여한 제품 회고입니다.',
}

function ThumbnailVisual({ p }: { p: Project }) {
  if (p.slug === 'karrot-large-furniture') return (
    <div className="relative aspect-[4/3] overflow-hidden bg-[#EFC9AA] transition-transform duration-300 group-hover:scale-[1.015]">
      <img src="/proto/karrot/images/sofa.png" alt="" className="absolute inset-0 h-full w-full object-cover object-center opacity-95" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#F4DCC7]/95 via-[#F4DCC7]/35 to-transparent" />
      <div className="absolute left-[6%] top-[8%] z-10 max-w-[48%] text-[clamp(23px,2.7vw,42px)] font-black leading-[.94] tracking-[-.055em] text-[#2B1D16]">BETTER DECISIONS<br />BEFORE CHAT.</div>
      <div className="absolute bottom-[9%] left-[6%] z-10 rounded-full bg-[#FF6F0F] px-3 py-2 text-[8px] font-bold uppercase tracking-[.08em] text-white lg:px-4 lg:text-[10px] lg:tracking-[.14em]">Size · Move · Disassemble</div>
      <div className="absolute -bottom-[35%] right-[6%] z-10 w-[34%] rotate-[4deg] drop-shadow-[0_24px_36px_rgba(55,28,14,.28)] transition-transform duration-300 group-hover:-translate-y-2 group-hover:rotate-2"><div className="phone-pro"><img src="/images/karrot-large-furniture/f-b1.webp" alt="" className="screen" /><span className="glare" /></div></div>
    </div>
  )

  if (p.slug === 'nodi') return (
    <div className="relative aspect-[4/3] overflow-hidden bg-[#DFE4FF] transition-transform duration-300 group-hover:scale-[1.015]">
      <span aria-hidden className="absolute -right-4 -top-8 text-[clamp(88px,13vw,170px)] font-black leading-none tracking-[-.08em] text-[#3D5ADA]/[.08]">NODI</span>
      <div className="absolute left-[6%] top-[8%] z-20 max-w-[52%] text-[clamp(23px,2.7vw,41px)] font-black leading-[.94] tracking-[-.055em] text-[#17224C]">AI UNDERSTANDS.<br />YOU DECIDE.</div>
      <div className="absolute -bottom-[30%] left-[4%] z-10 w-[29%] -rotate-[6deg] drop-shadow-[0_24px_36px_rgba(53,73,164,.22)] transition-transform duration-300 group-hover:-translate-y-1"><div className="phone-pro"><img src="/images/nodi/full-conds.webp" alt="" className="screen" /><span className="glare" /></div></div>
      <div className="absolute -bottom-[34%] left-[35.5%] z-20 w-[30%] drop-shadow-[0_28px_44px_rgba(53,73,164,.28)] transition-transform duration-300 group-hover:-translate-y-2"><div className="phone-pro"><img src="/images/nodi/full-sheetEdit.webp" alt="" className="screen" /><span className="glare" /></div></div>
      <div className="absolute -bottom-[30%] right-[4%] z-10 w-[29%] rotate-[6deg] drop-shadow-[0_24px_36px_rgba(53,73,164,.22)] transition-transform duration-300 group-hover:-translate-y-1"><div className="phone-pro"><img src="/images/nodi/full-sheetPick.webp" alt="" className="screen" /><span className="glare" /></div></div>
    </div>
  )

  if (p.slug === 'woorisai') return (
    <div className="relative aspect-[4/3] overflow-hidden bg-[#EEEDE3] transition-transform duration-300 group-hover:scale-[1.015]">
      <div className="absolute left-[5%] top-[7%] z-20 text-[11px] font-bold uppercase tracking-[.18em] text-[#566B5C]">A shared memory archive</div>
      <div className="absolute left-[5%] top-[16%] z-20 max-w-[48%] text-[clamp(22px,2.6vw,40px)] font-black leading-[.94] tracking-[-.055em] text-[#263B2F]">SHARED MOMENTS,<br />REDISCOVERED.</div>
      <div className="absolute -bottom-[30%] left-[4%] z-10 w-[29%] -rotate-[5deg] drop-shadow-[0_24px_36px_rgba(40,56,47,.2)] transition-transform duration-300 group-hover:-translate-y-1"><div className="phone-pro"><img src="/images/woorisai/home.webp" alt="" className="screen" /><span className="glare" /></div></div>
      <div className="absolute -bottom-[34%] left-[35.5%] z-20 w-[30%] drop-shadow-[0_28px_44px_rgba(40,56,47,.26)] transition-transform duration-300 group-hover:-translate-y-2"><div className="phone-pro"><img src="/images/woorisai/detail.webp" alt="" className="screen" /><span className="glare" /></div></div>
      <div className="absolute -bottom-[30%] right-[4%] z-10 w-[29%] rotate-[5deg] drop-shadow-[0_24px_36px_rgba(40,56,47,.2)] transition-transform duration-300 group-hover:-translate-y-1"><div className="phone-pro"><img src="/images/woorisai/feed.webp" alt="" className="screen" /><span className="glare" /></div></div>
    </div>
  )

  return (
    <div className="relative aspect-[4/3] overflow-hidden bg-[#1B1020] transition-transform duration-300 group-hover:scale-[1.015]">
      <img src="/images/trigr/home-map.webp" alt="" className="absolute inset-0 h-full w-full object-cover object-[center_20%] opacity-90 transition-transform duration-500 group-hover:scale-[1.025]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1A0F1F]/90 via-[#1A0F1F]/35 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-[3px] bg-[#DE5DE2]" />
      <div className="absolute left-[6%] top-[8%] z-10 text-[10px] font-bold uppercase tracking-[.16em] text-[#F1B4F2]">Launched in Thailand</div>
      <div className="absolute left-[6%] top-[17%] z-10 max-w-[45%] text-[clamp(29px,3.4vw,52px)] font-black leading-[.88] tracking-[-.06em] text-white">SHIPPED<br />PRODUCT.</div>
      <div className="absolute bottom-[8%] left-[6%] z-10 flex gap-2"><span className="rounded-full border border-white/35 bg-black/25 px-3 py-2 text-[10px] font-bold uppercase tracking-[.12em] text-white backdrop-blur">Product design</span><span className="rounded-full bg-[#DE5DE2] px-3 py-2 text-[10px] font-bold uppercase tracking-[.12em] text-black">3 redesigns</span></div>
      <div className="absolute -bottom-[37%] right-[5%] h-[102%] w-[36%] rotate-3 overflow-hidden rounded-t-[22px] border-[7px] border-b-0 border-[#222126] bg-white shadow-[0_28px_70px_rgba(0,0,0,.4)]"><img src="/images/trigr/t-list.webp" alt="" className="h-full w-full object-cover object-top" /></div>
    </div>
  )
}

function ProjectCard({ p }: { p: Project }) {
  return (
    <article className="group h-full">
      <Link to={`/work/${p.slug}`} aria-label={`${p.name} 케이스 스터디 보기`} className="flex h-full flex-col rounded-[24px] focus-visible:outline-offset-4">
        <div className="overflow-hidden rounded-[24px]"><ThumbnailVisual p={p} /></div>
        <div className="mt-5 flex flex-1 items-start justify-between gap-5"><div><ProjectLabel p={p} /><h3 className="mt-3 text-[22px] font-bold tracking-[-0.025em] group-hover:text-blue md:text-[26px]">{p.name}</h3><p className="mt-2 max-w-[44ch] text-[16px] leading-[1.7] text-ink/70">{cardCopy[p.slug]}</p></div><span aria-hidden className="mt-7 text-[24px] transition-transform group-hover:translate-x-1">↗</span></div>
      </Link>
    </article>
  )
}

export function Work() {
  const selected = projectOrder.map(by)
  return (
    <section id="work" className="home-section wrap gutter scroll-mt-16">
      <Reveal className="grid gap-6 md:grid-cols-12 md:items-end"><div className="md:col-span-7"><p className="eyebrow text-bluetext">Selected work</p><h2 className="section-title mt-3 max-w-[18ch]">문제를 이해하고, 판단할 수 있는 구조로 바꿉니다.</h2></div><p className="body-copy md:col-span-4 md:col-start-9">대표 케이스부터 출시 경험까지, 결과 화면과 그 안의 설계 판단을 함께 보여드립니다.</p></Reveal>
      <Reveal className="mt-12 md:mt-14"><FeaturedOlive /></Reveal>
      <div className="mt-24 md:mt-28"><div className="flex items-end justify-between gap-6 border-t border-grid pt-5"><div><p className="eyebrow text-sub">More projects</p><h2 className="mt-3 text-[28px] font-bold tracking-tight md:text-[36px]">이어지는 작업</h2></div><p className="hidden text-[14px] text-sub md:block">당근 → NODI → 우리사이 → trigr</p></div><div className="mt-10 grid gap-x-8 gap-y-16 md:grid-cols-2">{selected.map(p => <ProjectCard key={p.slug} p={p} />)}</div></div>
    </section>
  )
}

const approach = [
  { key: 'Structure', title: '이해할 수 있는 구조', text: '복잡한 정보를 사용자가 이해할 수 있는 구조로 정리합니다.', shot: { src: '/images/oliveyoung-todaydream/n-altMethods.webp', alt: '올리브영 수령 방법 비교 화면', cap: '수령 방법 비교' } },
  { key: 'Decision', title: '스스로 내리는 판단', text: '필요한 정보를 바탕으로 사용자가 스스로 판단할 수 있도록 설계합니다.', shot: { src: '/images/karrot-large-furniture/L-b2.webp', alt: '당근 정보 상태 구분 화면', cap: '정보 상태 구분' } },
  { key: 'Craft', title: '동작하는 경험', text: '아이디어를 실제 동작하는 경험으로 구현하고 피드백을 바탕으로 개선합니다.', shot: { src: '/images/trigr/tr-reward-2.webp', alt: 'trigr 남은 상금 계산 화면', cap: '결과 확인' } },
]

export function Philosophy() {
  return (
    <section id="approach" className="home-section wrap gutter scroll-mt-16">
      <Reveal className="grid gap-5 md:grid-cols-12"><div className="md:col-span-5"><p className="eyebrow text-bluetext">Design approach</p><h2 className="section-title mt-3">Soft Clarity</h2></div><p className="body-copy md:col-span-5 md:col-start-8 md:mt-8">복잡한 경험을 명확한 선택으로 바꾸기 위해 세 가지 원칙을 적용합니다.</p></Reveal>
      <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{approach.map((item, index) => <li key={item.key} className="border-t border-grid pt-5"><Reveal><p className="text-[13px] font-medium text-sub">0{index + 1}</p><h3 className="mt-2 text-[26px] font-bold tracking-tight">{item.key}</h3><p className="mt-4 text-[19px] font-semibold leading-[1.45]">{item.title}</p><p className="mt-3 text-[16px] leading-[1.7] text-sub">{item.text}</p><Zoomable src={item.shot.src} alt={item.shot.alt} caption={item.shot.cap} className="mt-6 w-full overflow-hidden rounded-[18px] bg-apple" imgClass="aspect-[4/3] w-full object-contain p-4" /><p className="mt-2 text-[13px] text-sub">{item.shot.cap}</p></Reveal></li>)}</ol>
    </section>
  )
}

function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => navigator.clipboard?.writeText(email).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1600) }).catch(() => {})
  return <button onClick={copy} className="min-h-11 rounded-full border border-ink px-5 text-[15px] font-semibold hover:bg-white" aria-live="polite">{copied ? '복사됨' : '이메일 복사'}</button>
}

export function AboutContact() {
  const skills = [['출시 경험', 'trigr의 초기 설계부터 세 차례의 개편과 출시까지 참여'], ['정보 구조화', '복잡한 상태와 선택지를 사용자의 판단 순서에 맞게 정리'], ['프로토타이핑', '설계안을 직접 눌러보고 검토할 수 있는 형태로 구현'], ['개발 협업', '구현 조건을 확인하고 제품 제약 안에서 화면을 조정']]
  return (
    <><section id="about" className="home-section wrap gutter scroll-mt-16"><Reveal className="grid gap-8 md:grid-cols-12"><div className="md:col-span-4"><p className="eyebrow text-bluetext">About</p><h2 className="section-title mt-3">{profile.name}</h2></div><div className="md:col-span-8"><p className="max-w-[30ch] text-[24px] font-semibold leading-[1.5] tracking-[-0.02em] md:text-[32px]">복잡한 정보를 사용자가 쉽게 이해하고 판단할 수 있는 경험으로 바꾸는 프로덕트 디자이너입니다.</p><p className="mt-5 max-w-[60ch] text-[16px] leading-[1.75] text-sub">실제 경험에서 문제를 발견하고, 눌러볼 수 있는 프로토타입으로 구체화한 뒤 사용자 피드백을 통해 개선합니다.</p><ul className="mt-9 grid gap-x-8 gap-y-6 sm:grid-cols-2">{skills.map(([title, body]) => <li key={title} className="border-t border-grid pt-4"><p className="font-semibold">{title}</p><p className="mt-2 text-[15px] leading-[1.65] text-sub">{body}</p></li>)}</ul><Link to="/about" className="mt-8 inline-flex min-h-11 items-center border-b border-ink text-[15px] font-semibold">경력과 작업 방식 더 보기 ↗</Link></div></Reveal></section><section id="contact" className="mt-[var(--space-section)] scroll-mt-24 bg-[#F0F2EC]"><Reveal className="wrap gutter py-20 md:py-28"><p className="eyebrow text-bluetext">Contact</p><p className="section-title mt-4 max-w-[18ch]">함께 명확한 경험을 만들어요.</p><div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"><a className="inline-flex min-h-12 items-center justify-center rounded-full bg-ink px-6 text-[15px] font-semibold text-white hover:-translate-y-0.5" href={`mailto:${profile.email}`}>이메일로 연락하기</a><CopyEmail email={profile.email} />{profile.resume && <a className="inline-flex min-h-12 items-center justify-center rounded-full px-5 text-[15px] font-semibold hover:bg-white/70" href={profile.resume} target="_blank" rel="noreferrer">이력서 보기 ↗</a>}</div></Reveal></section></>
  )
}
