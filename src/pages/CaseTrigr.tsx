import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects } from '../data/projects'
import Reveal from '../components/Reveal'
import { Zoomable } from '../components/Modal'
import { ProtoFrame } from '../components/Mockup'
import Compose from '../components/Compose'
import { ChapterHead, ChapterNav, strongOf, tintOf, useActive, ProjectIndex, AppIcon } from '../components/case'

gsap.registerPlugin(ScrollTrigger)

const p = projects.find(x => x.slug === 'trigr')!
const PINK = '#DE5DE2', TEAL = '#2FD1CD' // 출시 화면에서 추출한 색
const T = (n: number) => tintOf(PINK, n)
const S = strongOf(PINK)
const I = (n: string) => `/images/trigr/${n}.webp`
const list = [['c1', '개요'], ['c2', '맥락'], ['c3', '상금 지급'], ['c4', '정산 신청'], ['c5', '보조 흐름'], ['c6', '시스템'], ['c7', '프로토타입'], ['c8', '회고']]

// 실제 화면 하나를 밝은 폰 프레임에 넣고 클릭하면 확대
function Screen({ src, alt, caption, className = '' }: { src: string; alt: string; caption?: string; className?: string }) {
  return <Zoomable src={src} alt={alt} caption={caption ?? alt} className={`phone-light w-full ${className}`} imgClass="screen" />
}
// 자료가 없는 자리는 숨기지 않고 비어 있다고 표시한다
const Placeholder = ({ title, note }: { title: string; note: string }) => (
  <div className="phone-ph rounded-[28px] border border-dashed grid place-items-center text-center p-5 aspect-[390/844] w-full" style={{ borderColor: T(55), background: T(6) }}>
    <div><p className="text-[15px] font-bold" style={{ color: S }}>{title}</p><p className="mt-2 text-[14px] leading-snug text-sub">{note}</p></div>
  </div>
)
const Tag = ({ children }: { children: ReactNode }) => <span className="inline-block px-3 py-1.5 rounded-full text-[13px] font-semibold" style={{ background: T(14), color: S }}>{children}</span>

// 문제 → 디자인 결정 → UI → 확인된 결과. 두 사례가 같은 구조를 쓴다.
type Shot = { src?: string; title: string; why: string; ph?: string }
function CaseBlock({ id, n, title, problem, decisions, principles, shots, outcome }: { id: string; n: string; title: string; problem: string; decisions: string[]; principles?: string[]; shots: Shot[]; outcome: string }) {
  const label = 'text-[13px] font-bold tracking-[.08em] uppercase'
  return (
    <section id={id} className="wrap gutter py-20 md:py-32 scroll-mt-20 md:mt-24">
      <p className="eyebrow" style={{ color: S }}>Case Study {n}</p>
      <ChapterHead color={S} n={n} label="Case Study" title={title} />
      <ol className="mt-12 grid md:grid-cols-2 gap-4 md:gap-6">
        <li className="rounded-[24px] bg-white border border-grid p-6 md:p-8"><p className={label} style={{ color: S }}>01 · Problem</p><p className="mt-3 text-[17px] md:text-[18px] leading-[1.75]">{problem}</p></li>
        <li className="rounded-[24px] p-6 md:p-8" style={{ background: T(10), border: `1px solid ${T(40)}` }}><p className={label} style={{ color: S }}>02 · Design Decision</p>
          <p className="mt-3 text-[16px] text-sub">디자이너가 필요하다고 판단해 먼저 설계하고, 기획자·개발자와 협의해 반영했습니다.</p>
          <ul className="mt-3 space-y-2">{decisions.map(d => <li key={d} className="flex gap-3 text-[17px] font-semibold leading-snug"><span aria-hidden style={{ color: PINK }}>●</span>{d}</li>)}</ul>
          {principles && <div className="mt-5 pt-5 border-t" style={{ borderColor: T(40) }}><p className="text-[14px] font-bold" style={{ color: S }}>핵심 UX 원칙</p><ul className="mt-2 space-y-1.5 text-[16px] leading-snug">{principles.map(x => <li key={x}>· {x}</li>)}</ul></div>}
        </li>
      </ol>
      <p className={`mt-14 ${label}`} style={{ color: S }}>03 · UI Solution</p>
      <ul className="mt-5 -mx-5 px-5 md:mx-0 md:px-0 flex md:grid gap-5 md:gap-6 overflow-x-auto snap-x scroll-pl-5 pb-4 md:overflow-visible" style={{ gridTemplateColumns: `repeat(${shots.length}, minmax(0, 1fr))` }}>
        {shots.map((s, i) => (
          <li key={s.title} className="snap-start shrink-0 w-[72%] sm:w-[44%] md:w-auto">
            <p className="mb-3 text-[14px] font-bold" style={{ color: S }}>{i + 1}. {s.title}</p>
            {s.src ? <Screen src={s.src} alt={`${title} · ${s.title}`} caption={s.title} /> : <Placeholder title={s.title} note={s.ph ?? '추가 자료 필요'} />}
            <p className="mt-3 text-[15px] leading-[1.65] text-sub">{s.why}</p>
          </li>
        ))}
      </ul>
      <div className="mt-12 rounded-[24px] p-6 md:p-8 md:flex md:items-center md:gap-8" style={{ background: T(8) }}>
        <p className={`${label} shrink-0`} style={{ color: S }}>04 · Confirmed Outcome</p>
        <p className="mt-3 md:mt-0 text-[17px] md:text-[18px] leading-[1.75]">{outcome}</p>
      </div>
    </section>
  )
}

const stages = [
  ['초기 기획', '생성자·챌린저의 미션 생성·수행 구조 정의'],
  ['1차 시안', '지역형 UI, 이벤트·미션·보상 연결'],
  ['2차 시안', '진행·종료 미션 정보, 인기 미션·참여 유도 요소 추가'],
  ['3차 시안 (출시)', '지도 기반 미션 탐색, 미션→채팅→인증 플로우 구체화'],
]
const approach = [
  ['Identify', '기획서와 기능 흐름에서 누락된 상태 발견'],
  ['Design', '필요한 사용자 경험을 Figma에서 구체화'],
  ['Align', '기획자·개발자에게 제안하고 구현 방식 협의'],
  ['Deliver', '협의된 설계를 실제 서비스 화면에 반영'],
]
const lanes = [
  { title: '생성자', color: S, steps: [['미션 생성', '이 미션에 상금을 걸고 사람들과 함께 해볼까?'], ['미션 운영', '지금 참여자들이 어떻게 하고 있지?'], ['인증 확인', '이 인증이 미션을 제대로 수행한 걸까?'], ['보상 지급', '인증했으니 약속한 상금을 지급해야겠다.']] },
  { title: '참여자', color: '#16A19D', steps: [['미션 탐색', '내 주변에 재미있어 보이는 미션이 있나?'], ['미션 참여', '이 정도면 나도 한번 해볼 만하겠다.'], ['미션 인증', '미션을 수행했으니 이렇게 인증하면 되겠네.'], ['보상 확인', '인증 완료했으니 상금을 받았네!']] },
]

const flows: [string, string, string][] = [
  ['미션 탐색', I('tr-list'), '카테고리 필터와 미션 목록'],
  ['미션 상세 확인', I('tr-discover-map'), '지도 위 미션 선택과 요약'],
  ['미션 참여 및 채팅', I('t-chat-card'), '채팅방 속 인증 카드'],
  ['인증 피드', I('tr-proofs'), '인증 모아보기'],
  ['활동·포인트 확인', I('tr-my-1'), '마이페이지 활동과 포인트'],
]
const scenarios = [['a', '상금 지급 및 잔액 확인'], ['b', '정산 신청 및 결과 확인'], ['', '미션 탐색과 참여'], ['', '인증 피드 확인']]
const validation = ['테스트 목적', '테스트 참여자 수', '수행 과제', '과제 성공 여부', '주요 관찰 내용', '발견한 문제', '후속 개선안']

export default function CaseTrigr() {
  const root = useRef<HTMLElement>(null)
  const [sc, setSc] = useState('a')
  const [vw, setVw] = useState(typeof innerWidth === 'number' ? innerWidth : 1200)
  const active = useActive('trigr', list)
  useEffect(() => { document.title = 'trigr | Portfolio 2026'; return () => { document.title = 'Portfolio 2026 | Complexity → Clarity' } }, [])
  useEffect(() => { const f = () => setVw(innerWidth); addEventListener('resize', f); return () => removeEventListener('resize', f) }, [])
  useLayoutEffect(() => {
    const q = gsap.utils.selector(root)
    const mm = gsap.matchMedia()
    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(q('[data-hero-img]'), { y: 30 }, { y: -20, ease: 'none', scrollTrigger: { trigger: q('#c1')[0], start: 'top top', end: 'bottom top', scrub: true } })
    })
    return () => mm.revert()
  }, [])
  const next = projects[(projects.indexOf(p) + 1) % projects.length]
  const proto = p.proto && { ...p, proto: { ...p.proto, url: `/proto/trigr/index.html?sc=${sc}` } }
  const info: [string, string][] = [['Role', 'Product Designer / UX·UI Design'], ['Team', '초기 스타트업, 1인 디자이너'], ['Period', '2025.05–2026.06'], ['Platform', 'Mobile App'], ['Market', 'Thailand'], ['Status', 'Launched / Service Discontinued']]

  return (
    <article ref={root} style={{ ['--brand' as string]: PINK }}>
      <ChapterNav active={active} list={list} title="trigr" />

      {/* 01 Hero */}
      <section id="c1" className="overflow-hidden" style={{ background: T(9) }}>
        <div className="wrap gutter pt-10 md:pt-16 pb-14 md:pb-20">
          <Link to="/#work" className="inline-block py-2 text-[14px] text-sub hover:text-blue">← 프로젝트 목록</Link>
          <div className="mt-6 md:grid md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-6">
              <AppIcon src="/images/trigr/icon.svg" name="trigr" className="mb-5" />
              <p className="eyebrow" style={{ color: S }}>Launched Product · Mission-based Reward Platform</p>
              <h1 style={{ lineHeight: 1, marginTop: 'calc(1rem + .2em)' }} className="text-[72px] md:text-[126px] font-extrabold tracking-[-0.06em] leading-[0.9]">trigr</h1>
              <p className="mt-5 text-[26px] md:text-[34px] leading-[1.35] font-bold tracking-[-0.02em] max-w-[18ch]">정의되지 않은 요구사항을 사용자 흐름으로 구체화하다.</p>
              <p className="mt-4 text-[17px] leading-[1.75] text-sub max-w-[44ch]">기획서에 누락된 사용자 경험을 직접 설계하고, 기획자·개발자와 협의해 실제 제품에 반영한 미션 기반 리워드 플랫폼.</p>
              <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 text-[14px] rule pt-5 max-w-[520px]" style={{ borderColor: T(35) }}>
                {info.map(([k, v]) => <div key={k}><dt className="text-sub text-[13px]">{k}</dt><dd className="mt-1 font-medium">{v}</dd></div>)}
              </dl>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#c3" className="px-6 py-3 rounded-full bg-ink text-white text-[16px] font-semibold">핵심 사례 보기</a>
                {p.proto && <a href="#c7" className="px-6 py-3 rounded-full border border-ink text-[16px] font-semibold">프로토타입 보기</a>}
              </div>
            </div>
            <div data-hero-img className="mt-10 md:mt-0 md:col-span-6">
              <div role="img" aria-label="trigr 출시 버전의 홈 지도와 미션 목록 화면">
                <Compose persp={1600} className="aspect-square rounded-[28px]" style={{ background: tintOf(PINK, 14) }} ghost="TRIGR" ghostColor="#9B3FA0" items={[
                  { src: '/images/trigr/t-list.webp', kind: 'pro', x: 10, y: 14, w: 34, ry: 14, rx: 3, r: -6, z: 1 },
                  { src: '/images/trigr/home-map.webp', kind: 'pro', x: 50, y: 20, w: 36, ry: -12, rx: 3, r: 5, z: 2, lift: 14 }]} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 02 Project Context + 03 My Approach */}
      <section id="c2" className="wrap gutter py-20 md:py-32 scroll-mt-20 md:mt-24">
        <ChapterHead color={S} n="01" label="Project Context" title="불완전한 요구사항 속에서 시작된 제품 설계" />
        <ul className="mt-12 grid sm:grid-cols-2 gap-4 md:gap-6">
          {['서비스 정책과 상세 기능 정의가 충분하지 않았습니다.', '기획서에 일부 화면 상태와 예외 흐름이 빠져 있었습니다.', '요구사항이 바뀌면서 주요 UI 개편이 세 차례 있었습니다.', '디자이너 1명이 기획자·개발자와 협의하며 UX/UI를 구체화했습니다.'].map((t, i) => (
            <li key={t} className="rounded-[24px] bg-white border border-grid p-6 md:p-7 flex gap-4"><span className="text-[28px] font-extrabold leading-none num-brand">0{i + 1}</span><p className="text-[18px] leading-[1.55] font-semibold">{t}</p></li>
          ))}
        </ul>
        <div role="region" aria-label="세 차례 개편 흐름 (좌우로 스크롤)" tabIndex={0} className="mt-8 -mx-5 px-5 md:mx-0 md:px-0 flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-4 md:overflow-visible">
          {stages.map(([n, c], i) => (
            <div key={n} className="w-[230px] shrink-0 md:w-auto rounded-[20px] p-5" style={{ background: i === 3 ? T(16) : '#F7F8FB' }}>
              <p className="text-[13px] font-bold" style={{ color: S }}>{n}</p><p className="mt-2 text-[15px] leading-snug">{c}</p>
            </div>
          ))}
        </div>

        <h3 className="mt-24 apple-h text-[28px] md:text-[44px] max-w-[24ch]">누락된 흐름을 발견하고, 설계하고, 협의해 반영하다</h3>
        <ol className="mt-10 grid sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {approach.map(([k, d], i) => (
            <li key={k} className="rounded-[24px] p-6 md:p-7" style={{ background: T(10), border: `1px solid ${T(38)}` }}>
              <p className="text-[13px] font-bold" style={{ color: S }}>0{i + 1}</p>
              <p className="mt-2 text-[26px] font-extrabold tracking-tight">{k}</p>
              <p className="mt-3 text-[16px] leading-snug">{d}</p>
            </li>
          ))}
        </ol>
        <p className="mt-5 text-[14px] text-sub">실제로 수행한 작업을 순서대로 설명한 것이며, 별도의 정형화된 UX 프로세스를 운영했다는 뜻은 아닙니다.</p>
      </section>

      {/* 04 Case 01 */}
      <CaseBlock id="c3" n="01" title="상금 지급 전후의 상태를 사용자가 명확히 이해하도록 설계"
        problem="기획서에 상금 지급 후 남은 잔액과 지급 완료 상태에 대한 안내가 충분히 정의되지 않았습니다. 이 경우 사용자는 지급할 금액과 남은 상금의 관계를 확인하기 어렵고, 지급 결과를 명확히 인지하지 못할 가능성이 있습니다."
        decisions={['지급 금액 입력', '지급 후 남은 상금 계산 및 표시', '지급 완료 결과 안내', '지급 이후의 잔액 확인']}
        shots={[
          { src: I('tr-reward-1'), title: '지급 금액 입력 전', why: '현재 남은 상금을 먼저 보여주어, 지급할 수 있는 범위를 입력 전에 알 수 있게 했습니다.' },
          { src: I('tr-reward-2'), title: '입력 후 잔액 변화', why: '지급 금액을 입력하는 순간 남은 상금을 함께 보여주어, 사용자가 실행 전 지급 결과를 예측할 수 있도록 설계했습니다.' },
          { src: I('tr-reward-3'), title: '상금 지급 완료 안내', why: '지급이 끝났다는 결과와 남은 상금을 같은 시트에서 바로 알려, 지급 여부를 따로 찾지 않아도 되게 했습니다.' },
          { title: '지급 후 기존 화면 복귀', why: '지급을 마친 뒤 인증 상세로 돌아온 상태를 보여줄 화면입니다.', ph: '해당 화면 자료 확인 후 추가 예정' },
        ]}
        outcome="기획서에 정의되지 않았던 지급 금액·잔액 확인과 완료 피드백을 화면 설계에 반영했습니다. 실제 사용성 개선 여부는 검증 전이므로 성과로 단정하지 않습니다." />

      {/* 05 Case 02 */}
      <CaseBlock id="c4" n="02" title="정산 신청 전 금액과 계좌 정보를 확인할 수 있는 흐름 설계"
        problem="정산 신청은 금전과 관련된 중요한 작업이므로 사용자가 신청 금액, 실제 정산 금액, 입금 계좌, 신청 상태를 명확하게 이해할 필요가 있습니다."
        decisions={['정산 신청 포인트 입력', '실제 정산 금액 표시', '신청 전 금액 및 계좌 정보 확인', '신청 접수 완료 안내']}
        principles={['사용자가 금액을 입력할 때 결과를 확인할 수 있도록 구성', '신청 확정 전 중요한 정보를 다시 확인할 수 있도록 구성', '신청 접수와 실제 정산 완료를 혼동하지 않도록 구분']}
        shots={[
          { src: I('set-1-input'), title: '정산 금액 입력', why: '정산 신청 포인트를 입력하는 화면입니다. 최소 포인트 기준을 입력칸 바로 아래에 두었습니다.' },
          { src: I('set-2-filled'), title: '입력 금액 반영', why: '입력한 포인트에 맞춰 정산 가능 포인트와 실제 정산 금액, 입금 계좌를 한 화면에서 확인하게 했습니다.' },
          { src: I('set-3-confirm'), title: '신청 전 확인', why: '확정하기 전에 신청 포인트·실제 정산 금액·계좌 정보를 한 번 더 보여주도록 설계했습니다.' },
          { src: I('set-4-done'), title: '신청 접수 완료', why: '“접수되었다”는 표현과 관리자 승인 후 입금된다는 안내로, 접수와 실제 정산 완료를 구분했습니다.' },
        ]}
        outcome="정산 신청 전 금액·계좌 확인과 접수 완료 안내를 화면 설계에 반영했습니다. 실제 사용성 개선 여부는 검증 전이므로 성과로 단정하지 않습니다." />

      {/* 06 Supporting Flows */}
      <section id="c5" className="scroll-mt-20 md:mt-24" style={{ background: '#F7F8FB' }}>
        <div className="wrap gutter py-16 md:py-24">
          <ChapterHead color={S} n="05" label="Supporting Flows" title="미션 참여부터 인증까지 연결되는 사용자 경험" />
          <p className="mt-5 max-w-2xl text-[16px] leading-[1.75] text-sub">서비스의 전체 구조와 UI 설계 범위를 보여주는 보조 사례입니다. 기획서에 있던 기능도 포함하며, 디자이너가 제안한 기능만을 뜻하지 않습니다.</p>
          <ul className="mt-10 -mx-5 px-5 md:mx-0 md:px-0 flex md:grid md:grid-cols-5 gap-4 md:gap-5 overflow-x-auto snap-x scroll-pl-5 pb-3 md:overflow-visible">
            {flows.map(([t, src, c]) => (
              <li key={t} className="snap-start shrink-0 w-[46%] sm:w-[30%] md:w-auto"><Screen src={src} alt={`${t} 화면`} caption={t} /><p className="mt-3 text-[15px] font-bold">{t}</p><p className="mt-1 text-[14px] text-sub leading-snug">{c}</p></li>
            ))}
          </ul>
          <details className="mt-10 rounded-[20px] border border-grid bg-white p-5 md:p-6">
            <summary className="cursor-pointer text-[16px] font-semibold">생성자·참여자 관점의 흐름 보기</summary>
            <div className="mt-6 space-y-8">{lanes.map(l => (
              <div key={l.title}><p className="text-[17px] font-bold" style={{ color: l.color }}>{l.title}</p>
                <ol className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">{l.steps.map(([a, q], i) => <li key={a} className="rounded-[16px] bg-[#F7F8FA] p-4"><p className="text-[13px] font-semibold" style={{ color: l.color }}>0{i + 1} · {a}</p><p className="mt-1.5 text-[15px] leading-snug">“{q}”</p></li>)}</ol>
              </div>))}</div>
          </details>
        </div>
      </section>

      {/* 07 Design System */}
      <section id="c6" className="wrap gutter py-20 md:py-32 scroll-mt-20 md:mt-24">
        <ChapterHead color={S} n="06" label="Design System" title="반복되는 변경 속에서도 일관성을 유지하기 위한 UI 기반 구축" />
        <div className="mt-12 md:grid md:grid-cols-12 gap-10">
          <div className="md:col-span-6">
            <ul className="space-y-3">{['초기 기초 디자인 토큰 정의', '화면 설계 과정에서 디자인 시스템 점진적 확장', 'Figma Variables 활용', '라이트·다크 모드 대응', '다국어 UI 대응', '공통 컴포넌트와 UI 패턴 정리'].map(t => <li key={t} className="rounded-[16px] bg-white border border-grid px-5 py-4 text-[17px] font-semibold flex gap-3"><span aria-hidden style={{ color: PINK }}>●</span>{t}</li>)}</ul>
            <p className="mt-4 text-[14px] text-sub leading-snug">처음부터 완성된 시스템을 만든 것이 아니라, 화면을 만들며 필요한 규칙을 보완해 나갔습니다. 변수 구조는 Designbase의 앱 UI 템플릿을 참고해 trigr 컨셉에 맞게 재구성했습니다.</p>
          </div>
          <div className="mt-8 md:mt-0 md:col-span-6">
            <p className="text-[14px] font-bold" style={{ color: S }}>출시 화면에서 확인되는 색</p>
            <ul className="mt-3 flex gap-5">{[['Primary', PINK], ['포인트', TEAL]].map(([n, c]) => <li key={n} className="flex items-center gap-3 text-[14px]"><span className="w-14 h-14 rounded-[16px] border border-grid" style={{ background: c }} /><span>{n}<br /><span className="text-sub">{c}</span></span></li>)}</ul>
            <div className="mt-6 rounded-[24px] border border-dashed p-6 md:p-7" style={{ borderColor: T(55), background: T(6) }}>
              <p className="text-[15px] font-bold" style={{ color: S }}>Figma Variables · 컴포넌트 · 라이트/다크 · 다국어</p>
              <p className="mt-2 text-[15px] leading-snug text-sub">원본 Figma 자료가 확인되면 화면을 추가합니다. 남아 있지 않은 토큰이나 Variables는 당시 작업물처럼 재현하지 않습니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 08 Prototype + 09 Validation */}
      <section id="c7" className="scroll-mt-20 md:mt-24" style={{ background: T(9) }}>
        <div className="wrap gutter py-20 md:py-32">
          <ChapterHead color={S} n="07" label="Interactive Prototype" title="실제 사용자 흐름을 경험할 수 있는 인터랙티브 프로토타입" />
          <div className="mt-6 flex flex-wrap items-center gap-3"><Tag>Original Design · Interactive Prototype</Tag><p className="text-[14px] text-sub">실제 운영 중인 서비스가 아니라, 당시 디자인을 포트폴리오용으로 재현한 프로토타입입니다.</p></div>
          <div className="mt-10 md:grid md:grid-cols-12 gap-10 items-start">
            <div className="md:col-span-6 md:order-2 flex justify-center md:justify-end">{proto && <ProtoFrame key={sc} p={proto} width={Math.max(240, Math.min(320, vw - 80))} />}</div>
            <div className="md:col-span-6 md:order-1 mt-8 md:mt-0">
              <p className="text-[14px] font-bold" style={{ color: S }}>시나리오</p>
              <ul className="mt-3 space-y-3">{scenarios.map(([k, t]) => (
                <li key={t}>{k ? <button onClick={() => setSc(k)} aria-pressed={sc === k} className="w-full min-h-12 text-left rounded-[16px] px-5 py-3 text-[17px] font-semibold border" style={sc === k ? { background: PINK, color: '#fff', borderColor: PINK } : { background: '#fff', borderColor: T(40) }}>{t}</button>
                  : <div className="min-h-12 rounded-[16px] px-5 py-3 text-[17px] border border-dashed text-sub flex justify-between gap-3" style={{ borderColor: T(45) }}><span>{t}</span><span className="text-[13px] self-center">준비 중</span></div>}</li>))}</ul>
              <p className="mt-5 text-[14px] leading-snug text-sub">폰 화면을 직접 눌러 보세요. 시나리오 문구는 목표만 알려 주고, 화면 위치나 방법은 알려 주지 않습니다.</p>
            </div>
          </div>

          <div className="mt-24 rounded-[28px] bg-white border border-grid p-6 md:p-10">
            <div className="flex flex-wrap items-center gap-3"><Tag>Validation Planned</Tag></div>
            <h3 className="mt-4 apple-h text-[26px] md:text-[40px] max-w-[22ch]">설계한 사용자 흐름을 사후적으로 검증하다</h3>
            <p className="mt-4 max-w-[56ch] text-[16px] leading-[1.75] text-sub">현재 실제 사용성 테스트 결과는 없습니다. 위 프로토타입으로 테스트를 진행하면 아래 항목을 채울 예정입니다.</p>
            <ul className="mt-7 grid sm:grid-cols-2 md:grid-cols-4 gap-3">{validation.map(v => <li key={v} className="rounded-[16px] border border-dashed px-4 py-4" style={{ borderColor: T(45) }}><p className="text-[15px] font-semibold">{v}</p><p className="mt-1 text-[13px] text-sub">테스트 후 입력</p></li>)}</ul>
          </div>
        </div>
      </section>

      {/* 10 Reflection */}
      <section id="c8" className="scroll-mt-20 md:mt-24 rule">
        <div className="wrap gutter py-20 md:py-32">
          <ChapterHead color={S} n="08" label="Reflection" title="출시 경험을 통해 배운 것과 남은 과제" />
          <div className="mt-12 md:grid md:grid-cols-2 gap-6">
            <div className="rounded-[24px] p-6 md:p-8" style={{ background: T(8) }}>
              <p className="text-[13px] font-bold tracking-[.08em] uppercase" style={{ color: S }}>What I Did</p>
              <ul className="mt-4 space-y-3 text-[17px] leading-snug font-semibold">{['불완전한 요구사항을 구체적인 UX로 전환한 경험', '기획자·개발자와 협의해 설계를 반영한 경험', '반복적인 요구사항 변경에 대응한 경험', '디자인 시스템을 점진적으로 구축한 경험', '실제 서비스 출시까지 참여한 경험'].map(t => <li key={t} className="flex gap-3"><span aria-hidden style={{ color: PINK }}>●</span>{t}</li>)}</ul>
            </div>
            <div className="mt-4 md:mt-0 rounded-[24px] bg-[#F3F3F3] p-6 md:p-8">
              <p className="text-[13px] font-bold tracking-[.08em] uppercase text-sub">Limits</p>
              <ul className="mt-4 space-y-3 text-[17px] leading-snug">{['충분한 사용자 검증을 수행하지 못했습니다.', '서비스 운영 데이터와 정량적 성과를 확보하지 못했습니다.', '현재 서비스 운영이 종료되었습니다.', '향후 프로토타입으로 주요 사용자 흐름을 검증할 계획입니다.'].map(t => <li key={t} className="flex gap-3"><span aria-hidden className="text-sub">–</span>{t}</li>)}</ul>
            </div>
          </div>

          <div className="mt-16 rounded-[24px] border border-grid p-6 md:p-8">
            <Tag>Post-project proposal · 출시된 기능이 아닙니다</Tag>
            <p className="mt-4 text-[18px] font-bold">미션 생성 순서 개선 제안</p>
            <div className="mt-5 grid sm:grid-cols-2 gap-5 max-w-[860px]">
              {([['Current · 출시 버전', ['미션 제목', '태그 선택', '상금 설정', '미션 종류'], false], ['Proposed · 사후 제안', ['미션 제목', '미션 종류', '태그 선택', '상금 설정'], true]] as [string, string[], boolean][]).map(([t, items, prop]) => (
                <div key={t} className="rounded-[20px] p-5" style={{ background: prop ? T(10) : '#f3f3f3', border: prop ? `1px solid ${T(45)}` : 'none' }}>
                  <p className="text-[16px] font-bold" style={{ color: prop ? S : undefined }}>{t}</p>
                  <ol className="mt-3 space-y-2">{items.map((x, i) => <li key={x} className="rounded-[12px] bg-white px-4 py-3 text-[16px] flex gap-3" style={prop && i >= 1 ? { color: S } : undefined}><span className="text-sub">{i + 1}</span>{x}</li>)}</ol>
                </div>
              ))}
            </div>
            <p className="mt-5 text-[16px] leading-[1.75] text-sub max-w-[60ch]">미션의 수행 방식(종류)을 먼저 정한 뒤 보상을 설정하는 흐름이 더 자연스러울 가능성이 있다고 보고, 출시 후 새로 정리해 본 제안입니다. 검증되지 않았습니다.</p>
          </div>

          <details className="mt-10 rounded-[20px] border border-grid p-6">
            <summary className="cursor-pointer text-[16px] font-semibold">원문 보기 · 직접 작성한 회고</summary>
            <div className="mt-6 space-y-8 text-[16px] leading-[1.8]">
              {p.sections.map(s => <div key={s.id}><p className="text-[13px] text-sub">{s.title}</p>{s.body.split('\n\n').map(t => <p key={t} className="mt-2 whitespace-pre-line">{t}</p>)}</div>)}
            </div>
          </details>
        </div>
      </section>

      <ProjectIndex current={'trigr'} />
      <Link to={`/work/${next.slug}`} className="group block rule">
        <div className="wrap gutter py-14 md:py-20 flex items-end justify-between gap-6">
          <div><p className="eyebrow text-sub">다음 프로젝트</p><p className="mt-3 text-[32px] md:text-[56px] font-extrabold tracking-tight leading-none group-hover:text-blue">{next.name}</p></div>
          <span className="px-5 py-3 rounded-full bg-ink text-white text-[14px] shrink-0">이어서 보기</span>
        </div>
      </Link>
    </article>
  )
}
