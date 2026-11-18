import { useState } from 'react'
import { Link } from 'react-router-dom'
import { projects, profile, type Project } from '../data/projects'
import Reveal from './Reveal'
import { Modal, Zoomable } from './Modal'
import { ProtoFrame, owner } from './Mockup'
import Compose, { type Dev } from './Compose'
import { strongOf } from './case'

const PINK = '#DE5DE2'

const by = (slug: string) => projects.find(p => p.slug === slug)!
const tint = (c: string, n: number) => `color-mix(in srgb, ${c} ${n}%, white)`

function Meta({ p }: { p: Project }) {
  return (
    <dl className="mt-8 grid grid-cols-3 gap-4 rule pt-4 text-[14px]">
      <div><dt className="text-sub text-[13px]">담당</dt><dd className="mt-1">{owner}</dd></div>
      <div><dt className="text-sub text-[13px]">역할</dt><dd className="mt-1">{p.role}</dd></div>
      <div><dt className="text-sub text-[13px]">기간</dt><dd className="mt-1">{p.period}</dd></div>
    </dl>
  )
}

export function Label({ launched = false, color }: { launched?: boolean; color?: string }) {
  return <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[13px] font-semibold" style={launched ? { background: '#111', color: '#fff' } : { background: color ? tint(color, 16) : '#f3f3f3', color: '#111' }}>
    {launched && <span aria-hidden className="w-1.5 h-1.5 rounded-full" style={{ background: '#DE5DE2' }} />}{launched ? 'Launched Product' : 'Personal Case Study'}
  </span>
}

const Skills = ({ items }: { items: string[] }) => <ul className="mt-5 flex flex-wrap gap-2">{items.map(t => <li key={t} className="text-[13px] px-3 py-1 rounded-full bg-[#f3f3f3] text-sub">{t}</li>)}</ul>

const LightPhone = ({ src, className = '', style }: { src: string; className?: string; style?: React.CSSProperties }) => <div className={`phone-light absolute ${className}`} style={style}><img src={src} alt="" loading="lazy" className="screen" /></div>

const Chips = ({ items, color }: { items: string[]; color?: string }) => <ul className="flex flex-wrap items-center gap-2">{items.map((t, i) => <li key={t} className="flex items-center gap-2"><span className="px-3 py-1.5 rounded-full bg-white border border-grid text-[13px]">{t}</span>{i < items.length - 1 && <span aria-hidden className="text-sub" style={{ color }}>→</span>}</li>)}</ul>

// Featured 1 — trigr: Full-width Visual Showcase (중앙 화면을 크게)
function FeatureTrigr({ p }: { p: Project }) {
  const shots: [string, string, string][] = [['/images/trigr/tr-p-method.webp', '인증 방식 선택', '참여자 · 인증'], ['/images/trigr/tr-proof-detail.webp', '인증 상세와 상금 지급 진입', '생성자 · 인증 확인'], ['/images/trigr/tr-reward-2.webp', '지급 후 남은 상금 계산', '생성자 · 보상 지급']]
  return (
    <article>
      <Link to={`/work/${p.slug}`} aria-label={`${p.name} 케이스 스터디 보기`} className="group relative block overflow-hidden rounded-[28px] px-6 pt-20 pb-10 md:px-16 md:pt-24 md:pb-14" style={{ background: `linear-gradient(135deg, ${tint(p.accent, 12)}, ${tint('#9B6BFF', 26)})` }}>
        <span className="absolute left-6 top-6 md:left-10 md:top-10"><Label launched /></span>
        <Compose ghost="TRIGR" ghostColor="#9B3FA0" className="aspect-[16/10] md:aspect-[16/7] mt-6" items={[
          { src: shots[0][0], kind: 'pro', x: 17, y: 20, w: 19, r: -9, z: 1 },
          { src: shots[2][0], kind: 'pro', x: 64, y: 18, w: 19, r: 9, z: 1 },
          { src: shots[1][0], kind: 'pro', x: 37, y: 9, w: 26, z: 2, lift: 14 }]} />
      </Link>
      <div className="mt-10 md:grid md:grid-cols-12 gap-10 items-start">
        <div className="md:col-span-6">
          <h3 className="text-[48px] md:text-[88px] font-extrabold tracking-[-0.05em] leading-[0.95]">{p.name}</h3>
          <p className="mt-5 text-[18px] md:text-[24px] leading-snug max-w-[26ch]">기획 단계부터 세 번의 개편을 거쳐 출시까지 함께한 미션 앱.</p>
        </div>
        <div className="md:col-span-6 mt-8 md:mt-3 space-y-4">
          <Chips items={['미션 생성', '운영', '인증 확인', '보상 지급']} color={PINK} />
          <Chips items={['미션 탐색', '참여', '인증', '보상 확인']} color="#16A19D" />
          <p className="text-[13px] text-sub">미션을 만드는 사람과 참여하는 사람의 흐름이에요 · 서비스는 지금 운영하지 않아요</p>
          <Link to={`/work/${p.slug}`} className="inline-block mt-2 px-6 py-3 rounded-full bg-ink text-white text-[16px] font-semibold">케이스 스터디 보기</Link>
        </div>
      </div>
    </article>
  )
}

// Featured 2 — NODI: Split Editorial (AI 제안 → 사용자 확인 → 확정)
function FeatureNodi({ p }: { p: Project }) {
  const [open, setOpen] = useState(false)
  const steps: [string, string, string][] = [['s-conds', 'AI가 조건을 정리', 'AI 제안'], ['s-recs', '추천 이유를 확인', '사용자 확인'], ['s-review', '사용자가 확정', '사용자 결정']]
  return (
    <article className="grid md:grid-cols-12 gap-8 md:gap-12 items-stretch">
      <div className="md:col-span-4 flex flex-col">
        <div className="flex items-center gap-3 flex-wrap"><Label color={p.accent} /><span className="eyebrow text-sub">{p.category}</span></div>
        <h3 className="mt-6 text-[44px] md:text-[72px] font-extrabold tracking-tight leading-[1]">{p.name}</h3>
        <p className="mt-5 text-[24px] md:text-[28px] font-bold leading-snug">AI는 이해하고<br />사용자는 결정한다.</p>
        <p className="mt-4 text-[16px] leading-relaxed text-sub">{p.problem}</p>
        <div className="mt-auto pt-10 grid w-fit gap-3">
          <Link to={`/work/${p.slug}`} className="px-6 py-3 rounded-full border border-ink bg-ink text-white text-[16px] font-semibold text-center">케이스 스터디 보기</Link>
          {p.proto && <button onClick={() => setOpen(true)} className="px-6 py-3 rounded-full border border-ink text-[16px] font-semibold text-center">프로토타입 실행</button>}
        </div>
      </div>
      <Link to={`/work/${p.slug}`} aria-label={`${p.name} 케이스 스터디 보기`} className="group md:col-span-8 block overflow-hidden rounded-[28px] px-5 py-8 md:px-10 md:py-12" style={{ background: tint('#6F8BFF', 14) }}>
        <Compose className="aspect-[16/11] md:aspect-[16/9]" persp={1600} items={steps.map(([n], i) => ({ src: `/images/nodi/${n}.webp`, kind: 'pro' as const, x: 8 + i * 27, y: 30 - i * 14, w: 24, ry: -18, rx: 4, r: 4, z: i + 1, lift: 12 }))} ghost="NODI" ghostColor="#3654D4" />
        <ol className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-[13px] font-semibold" style={{ color: strongOf(p.accent) }}>{steps.map(([, cap, tag], i) => <li key={tag}>0{i + 1} · {tag} <span className="font-normal text-ink/70">{cap}</span></li>)}</ol>
      </Link>
      <Modal open={open} onClose={() => setOpen(false)} label={`${p.name} 프로토타입`}><div className="flex justify-center pt-14"><ProtoFrame p={p} width={320} /></div></Modal>
    </article>
  )
}

// 프로젝트마다 다른 구도: 부채꼴(올리브영) · 3D 사선(우리사이) · 엇갈린 기울기(당근)
const ghosts: Record<string, string> = { 'oliveyoung-todaydream': 'OLIVE YOUNG', woorisai: 'WOORISAI', 'karrot-large-furniture': 'DANGN' }
const comps: Record<string, { ratio: string; items: (m: string[]) => Dev[] }> = {
  'oliveyoung-todaydream': { ratio: 'aspect-[4/3]', items: m => [
    { src: m[2], kind: 'pro', x: 5, y: 16, w: 23, r: -10, z: 1 },
    { src: m[1], kind: 'pro', x: 35, y: 15, w: 30, z: 3, lift: 14 },
    { src: m[0], kind: 'pro', x: 72, y: 6, w: 23, r: 9, z: 2 }] },
  woorisai: { ratio: 'aspect-square', items: m => [
    { src: m[1], kind: 'pro', x: 6, y: 9, w: 40, ry: -24, rx: 5, r: 3, z: 2, lift: 12 },
    { src: m[0], kind: 'pro', x: 56, y: 30, w: 36, ry: -24, rx: 5, r: 3, z: 1 }] },
  'karrot-large-furniture': { ratio: 'aspect-square', items: m => [
    { src: m[1], kind: 'pro', x: 8, y: 24, w: 38, r: -9, z: 1 },
    { src: m[0], kind: 'pro', x: 55, y: 5, w: 36, r: 8, z: 2, lift: 14 }] },
}

function Compact({ p, big = false }: { p: Project; big?: boolean }) {
  const c = comps[p.slug]
  return (
    <Reveal>
      <Link to={`/work/${p.slug}`} className="group block">
        <Compose items={c.items(p.mock.srcs)} ghost={ghosts[p.slug]} ghostColor={strongOf(p.accent)} className={`rounded-[20px] ${big ? 'aspect-[4/3]' : c.ratio}`} style={{ background: `linear-gradient(160deg, ${tint(p.accent, 12)}, ${tint(p.accent, 30)})` }} />
        <div className="mt-6">
          <div className="flex items-center gap-3 flex-wrap"><Label color={p.accent} /><span className="eyebrow text-sub">{p.category}</span></div>
          <h3 className="mt-3 text-[28px] font-bold tracking-tight group-hover:text-blue">{p.name}</h3>
          <p className="mt-2 text-[16px] leading-relaxed max-w-[34ch]">{p.problem}</p>
        </div>
      </Link>
    </Reveal>
  )
}

export function Work() {
  const [a, b, c] = ['oliveyoung-todaydream', 'woorisai', 'karrot-large-furniture'].map(by)
  return (
    <section id="work" className="wrap gutter pt-24 md:pt-36 scroll-mt-16">
      <Reveal>
        <p className="eyebrow text-bluetext">Featured Work</p>
        <h2 className="mt-3 text-[32px] md:text-[48px] font-bold tracking-tight leading-tight">출시한 프로젝트와 직접 설계한 프로젝트</h2>
      </Reveal>
      <div className="mt-16 space-y-28 md:space-y-40">
        <Reveal><FeatureTrigr p={by('trigr')} /></Reveal>
        <Reveal><FeatureNodi p={by('nodi')} /></Reveal>
        <div>
          <p className="eyebrow text-sub rule pt-4">Selected Work</p>
          <div className="mt-10 grid md:grid-cols-12 gap-x-12 gap-y-20">
            <div className="md:col-span-7"><Compact p={a} big /></div>
            <div className="md:col-span-5 md:mt-24"><Compact p={b} /></div>
            <div className="md:col-span-5 md:col-start-2"><Compact p={c} /></div>
          </div>
        </div>
      </div>
    </section>
  )
}

type Row = { key: string; kicker: string; title: string; text: string; shots: { src: string; alt: string; cap: string; bare?: boolean }[] }
const approach: Row[] = [
  { key: 'Structure', kicker: '복잡한 정보를 이해하기 쉬운 구조로', title: '올리브영 오늘드림 — 오늘드림과 매장 픽업의 재고 확인을 따로 보여줘요', text: '재고는 오늘드림이면 내 배송지 기준으로 확인하고 매장 픽업이면 고른 매장 기준으로 확인해요. 그래서 확인하는 길을 둘로 나눴어요. 주문·결제 화면은 3묶음으로 정리했어요.',
    shots: [{ src: '/images/oliveyoung-todaydream/n-altMethods.webp', alt: '올리브영 다른 수령 방법 확인 화면', cap: '수령 방법 비교' }, { src: '/images/oliveyoung-todaydream/n-checkoutTobe.webp', alt: '올리브영 주문 결제 3그룹 화면', cap: '주문/결제 3그룹' }] },
  { key: 'Decision', kicker: '중요한 선택을 돕는 정보 순서', title: 'NODI · 당근 — 확정된 것과 아직 모르는 것을 나눠서 보여줘요', text: 'NODI는 일정 가능·참석 수락·캘린더·알림을 서로 다른 상태로 나눠 보여줘요. 당근은 입력하지 않은 건지 판매자도 모르는 건지 불러오지 못한 건지를 구분해서 알려줘요.',
    shots: [{ src: '/images/nodi/s-recs.webp', alt: 'NODI 추천 시간 화면', cap: 'NODI · 추천 시간' }, { src: '/images/karrot-large-furniture/k-partial.webp', alt: '당근 상세: 미입력과 모름을 구분한 화면', cap: '당근 · 정보 상태 구분' }] },
  { key: 'Craft', kicker: '쓰기 쉬운 화면을 꼼꼼하게', title: 'trigr — 상금 지급을 한 화면에서 확인하는 시트', text: '상금을 입력하면 지급하고 남는 금액이 바로 계산돼요. 지급을 마치면 결과를 한 번 더 확인할 수 있어요.',
    shots: [{ src: '/images/trigr/tr-reward-1.webp', alt: 'trigr 상금 입력 시트', cap: '상금 입력' }, { src: '/images/trigr/tr-reward-2.webp', alt: 'trigr 지급 후 남은 상금 계산', cap: '남은 상금 계산' }, { src: '/images/trigr/tr-reward-3.webp', alt: 'trigr 상금 지급 완료', cap: '지급 완료' }] },
]

export function Philosophy() {
  return (
    <section id="approach" className="wrap gutter pt-28 md:pt-44 scroll-mt-16">
      <Reveal className="md:grid md:grid-cols-12 gap-6">
        <div className="md:col-span-5">
          <p className="eyebrow text-bluetext">Design Approach</p>
          <h2 className="mt-3 text-[40px] md:text-[64px] font-extrabold tracking-tight leading-none">Soft Clarity</h2>
        </div>
        <p className="mt-6 md:mt-12 md:col-span-6 md:col-start-7 text-[18px] leading-relaxed text-sub">정보를 구조로 정리하고 우선순위를 정해서 사용자가 쉽게 판단하게 해요.</p>
      </Reveal>
      <ul className="mt-14">
        {approach.map((r, i) => (
          <li key={r.key} className="rule">
            <Reveal className="py-12 md:grid md:grid-cols-12 gap-8 items-start">
              <div className={`md:col-span-6 ${i === 1 ? 'md:order-2' : ''}`}>
                <p className="text-[13px] text-sub">0{i + 1} · {r.kicker}</p>
                <h3 className="mt-2 text-[32px] md:text-[48px] font-extrabold tracking-tight leading-none">{r.key}</h3>
                <p className="mt-6 text-[18px] md:text-[24px] font-semibold leading-snug">{r.title}</p>
                <p className="mt-4 text-[16px] leading-[1.8] text-sub">{r.text}</p>
              </div>
              <ul className={`mt-8 md:mt-0 md:col-span-6 flex gap-4 ${i === 1 ? 'md:order-1' : ''}`}>
                {r.shots.map(s => <li key={s.src} className="flex-1 min-w-0"><Zoomable src={s.src} alt={s.alt} caption={s.cap} className="w-full" imgClass={s.bare ? 'phone-bare' : 'w-full rounded-[20px] border border-grid'} /><p className="mt-2 text-[13px] text-sub">{s.cap}</p></li>)}
              </ul>
            </Reveal>
          </li>
        ))}
        <li className="rule" />
      </ul>
    </section>
  )
}

function CopyEmail({ email }: { email: string }) {
  const [done, setDone] = useState(false)
  const copy = () => { navigator.clipboard?.writeText(email).then(() => { setDone(true); setTimeout(() => setDone(false), 1600) }).catch(() => {}) }
  return <button onClick={copy} className="px-4 py-2 rounded-full border border-ink text-[15px] font-semibold" aria-live="polite">{done ? '복사됨 ✓' : '이메일 복사'}</button>
}

export function AboutContact() {
  return (
    <>
      <section id="about" className="wrap gutter pt-28 md:pt-44 scroll-mt-16">
        <Reveal className="md:grid md:grid-cols-12 gap-6">
          <p className="eyebrow text-bluetext md:col-span-4">About</p>
          <div className="md:col-span-8">
            <p className="text-[28px] md:text-[36px] font-semibold leading-snug tracking-tight">복잡한 정보를 사용자가 쉽게 판단할 수 있는 경험으로 바꾸는 프로덕트 디자이너 {profile.name}입니다.</p>
            <p className="mt-6 text-[17px] font-semibold">{profile.name}{profile.phone && <> · <a className="py-1 text-bluetext underline underline-offset-4" href={`tel:${profile.phone.replace(/-/g, '')}`}>{profile.phone}</a></>}</p>
            <ul className="mt-8 grid sm:grid-cols-2 gap-3">{[['실제 서비스 출시', 'trigr — 기획 단계부터 세 번의 개편을 거쳐 출시까지 참여'], ['UX/UI 설계·디자인 시스템', 'Figma Variables로 컴포넌트 디자인 시스템을 구축'], ['프로토타이핑', 'Claude Code·Figma Make로 HTML 프로토타입을 직접 구현'], ['개발 협업', '개발자와 구현 가능한지 확인하며 화면을 조정']].map(([a, b]) => <li key={a} className="rounded-[20px] bg-[#F7F8FA] p-5"><p className="text-[16px] font-bold">{a}</p><p className="mt-1 text-[14px] leading-snug text-sub">{b}</p></li>)}</ul>
            <ul className="mt-8 text-[16px]">
              {profile.experience.map(e => (
                <li key={e.org} className="rule py-3 flex flex-wrap justify-between gap-x-6"><span className="font-semibold">{e.org} <span className="font-normal text-sub">· {e.role}</span></span><span className="text-sub">{e.period}</span></li>
              ))}
            </ul>
            <Link to="/about" className="inline-block mt-6 py-2 text-[16px] font-semibold text-bluetext border-b border-bluetext">About 자세히 보기</Link>
          </div>
        </Reveal>
      </section>
      <section id="contact" className="wrap gutter pt-28 md:pt-44 scroll-mt-16">
        <Reveal>
          <p className="eyebrow text-bluetext">Contact</p>
          <p className="mt-3 text-[32px] md:text-[64px] font-extrabold tracking-tight leading-[1.05]">함께 <span className="text-blue">명확한</span> 경험을<br />만들어요.</p>
          <div className="mt-8 flex flex-wrap items-start gap-x-10 gap-y-4 text-[17px]">
            {profile.email && <div className="flex flex-col items-start gap-3"><a className="py-2 underline underline-offset-4" href={`mailto:${profile.email}`}>{profile.email}</a><CopyEmail email={profile.email} /></div>}
            {profile.phone && <a className="py-2 underline underline-offset-4" href={`tel:${profile.phone.replace(/-/g, '')}`}>{profile.phone}</a>}
            {profile.resume && <a className="py-2 underline underline-offset-4" href={profile.resume} target="_blank" rel="noreferrer">이력서 PDF</a>}
          </div>
        </Reveal>
      </section>
    </>
  )
}
