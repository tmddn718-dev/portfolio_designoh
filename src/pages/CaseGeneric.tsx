import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects, TODO, type Project } from '../data/projects'
import Reveal from '../components/Reveal'
import BeforeAfter from '../components/BeforeAfter'
import { Modal, Zoomable } from '../components/Modal'
import { ProtoFrame, owner, useMedia } from '../components/Mockup'
import { AppIcon, onBrand, CaseSummary, ChapterHead, ChapterNav, InteractionPreview, PinnedPhone, strongOf, tintOf, useActive, ProjectIndex } from '../components/case'
import Strip from '../components/Strip'
import CompareSection, { type CompareData } from '../components/Compare'
import NotFound from './NotFound'

gsap.registerPlugin(ScrollTrigger)
const list = [['c1', '개요'], ['c2', '문제'], ['c3', '솔루션'], ['c4', '실제 UI'], ['c5', '결과']]
const karrotList = [['c1', '개요'], ['c2', '문제'], ['c3', '솔루션'], ['test', '사용성 테스트'], ['c4', '실제 UI'], ['c5', '결과']]
const oliveList = [['c1', '개요'], ['c2', '문제 발견'], ['c3', '솔루션'], ['c4', '예외 상태'], ['c5', '회고']]

// ── 공통 조각 ────────────────────────────────────────────
const Screen = ({ src, alt, cap, className = '' }: { src: string; alt: string; cap?: string; className?: string }) => (
  <Zoomable src={src} alt={alt} caption={cap ?? alt} className={`phone-light w-full ${className}`} imgClass="screen" />
)
const Fig = ({ src, alt, cap, className = '' }: { src: string; alt: string; cap: string; className?: string }) => (
  <figure className={className}><Screen src={src} alt={alt} cap={cap} /><figcaption className="mt-3 text-[14px] text-sub">{cap}</figcaption></figure>
)
const Ann = ({ n, t, d, color }: { n: string; t: string; d?: string; color: string }) => (
  <li className="flex gap-3"><span className="shrink-0 grid place-items-center w-7 h-7 rounded-full text-[13px] font-bold" style={{ background: color, color: onBrand(color) }}>{n}</span><div><p className="text-[16px] font-bold leading-snug">{t}</p>{d && <p className="mt-0.5 text-[14px] leading-snug text-sub">{d}</p>}</div></li>
)
const Num = ({ n, t }: { n: string; t: string }) => <div><p className="text-[56px] font-extrabold leading-none num-brand">{n}</p><h3 className="mt-3 text-[28px] md:text-[36px] font-extrabold tracking-tight leading-tight max-w-[18ch]">{t}</h3></div>

type Ctx = { p: Project; A: string; S: string; T: (n: number) => string; body: (id: string) => string[]; proto: ReactNode; wide: boolean; setOpen: (b: boolean) => void }

function Hero({ c, eyebrow, kicker, title, lead, children, size = 'md' }: { c: Ctx; eyebrow?: string; kicker?: string; title: string; lead: string; children: ReactNode; size?: 'md' | 'xl' }) {
  const { p, S, T, setOpen } = c
  return (
    <>
    <section id="c1" className="overflow-hidden" style={{ background: T(13) }}>
      <div className="wrap gutter pt-10 md:pt-16 pb-14 md:pb-20">
        <Link to="/#work" className="inline-block py-2 text-[14px] text-sub hover:text-blue">← 프로젝트 목록</Link>
        <div className="mt-6 md:grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-5">
            <AppIcon src={`/images/${p.slug}/icon.webp`} name={p.name} className="mb-5" />
            <p className="eyebrow" style={{ color: S }}>{eyebrow ?? `Personal Case Study · ${p.category}`}</p>
            <h1 style={{ lineHeight: 1.2 }} className={`mt-4 font-extrabold tracking-[-0.045em] ${size === 'xl' ? 'text-[64px] md:text-[104px]' : 'text-[44px] md:text-[72px]'}`}>{title}</h1>
            <p className="mt-6 text-[24px] md:text-[28px] font-bold leading-snug max-w-[20ch]">{lead}</p>
            <dl className="mt-8 grid grid-cols-3 gap-5 text-[14px] rule pt-4" style={{ borderColor: T(40) }}>
              <div><dt className="text-sub text-[13px]">담당</dt><dd className="mt-1">{owner}</dd></div>
              <div><dt className="text-sub text-[13px]">역할</dt><dd className="mt-1">{p.role}</dd></div>
              <div><dt className="text-sub text-[13px]">기간</dt><dd className="mt-1">{p.period}</dd></div>
            </dl>
            {p.proto && <button onClick={() => setOpen(true)} className="mt-8 px-6 py-3 rounded-full bg-ink text-white text-[16px] font-semibold">프로토타입 실행</button>}
            <p className="mt-6 text-[13px] text-sub max-w-[40ch]">{kicker}</p>
          </div>
          <div data-scale className="mt-12 md:mt-0 md:col-span-7">{children}</div>
        </div>
      </div>
    </section>
    <CaseSummary p={p} />
    </>
  )
}

const Outcome = ({ c, children, cards }: { c: Ctx; children?: ReactNode; cards: ReactNode }) => (
  <section id="c5" className="scroll-mt-20 md:mt-24 rule">
    <div className="wrap gutter py-20 md:py-32">
      <ChapterHead color={c.S} n="04" label="Outcome" title="검증 결과와 남은 한계" />
      <div className="mt-12 md:grid md:grid-cols-12 gap-10">
        <div className="md:col-span-5 grid gap-4">{cards}</div>
        <div className="md:col-span-7 mt-10 md:mt-0 text-[17px] leading-[1.8] space-y-4">
          {c.body('validation').map(t => <p key={t} className={`whitespace-pre-line ${t.startsWith('※') || t.startsWith('확인 필요') ? 'text-sub text-[16px]' : ''}`}>{t}</p>)}
          {children}
          {c.body('reflection').length > 0 && <div className="pt-6 rule"><p className="eyebrow text-sub mb-2">Learnings</p>{c.body('reflection').map(t => <p key={t}>{t}</p>)}</div>}
        </div>
      </div>
    </div>
  </section>
)

// ── 올리브영: 문제 → 판단 → 실제 UI → 검증 ───────────────────
function OliveRenewed({ c }: { c: Ctx }) {
  const { p, A, S } = c
  const I = (n: string) => `/images/oliveyoung-todaydream/${n}${n.startsWith('n-opt') ? '-indicator.png' : '.webp'}`
  const Result = ({ value, task }: { value: string; task: string }) => (
    <div className="mt-10 rounded-[28px] bg-ink p-7 md:p-10 text-white">
      <p className="eyebrow text-white/55">Usability test · 동일 참여자 8명</p>
      <p className="mt-3 text-[40px] md:text-[56px] font-extrabold tracking-tight">{value}</p>
      <p className="mt-3 max-w-[52ch] text-[16px] md:text-[18px] leading-[1.7] text-white/80">기존 앱과 개선 프로토타입을 비교해 {task} 과제를 수행한 평균 결과입니다.</p>
    </div>
  )
  return (
    <>
      <Hero c={c} eyebrow="OLIVE YOUNG / COMMERCE UX REDESIGN" title="품절은 구매의 끝이어야 할까?" lead="다음 선택을 이해하고 행동할 수 있는 구매 경험" kicker="Personal UX Redesign · 비공식 개인 제안 · 실제 UI와 사용성 테스트 결과 기반">
        <div>
          <div className="flex items-end justify-center gap-5 md:gap-8">
            <figure className="w-[44%]"><p className="mb-2 text-[13px] font-semibold" style={{ color: S }}>Purchase Recovery</p><Screen src={I('n-optC')} alt="품절 옵션에서 다른 구매 방법을 안내하는 개선 화면" /></figure>
            <figure className="w-[44%] md:mt-12"><p className="mb-2 text-[13px] font-semibold" style={{ color: S }}>Alternative Methods</p><Screen src={I('n-altMethods')} alt="일반배송과 매장 픽업을 비교하는 개선 화면" /></figure>
          </div>
          <dl className="mt-7 grid grid-cols-3 gap-2 text-center tabular-nums">
            <div className="rounded-[16px] bg-white/80 p-3"><dd className="text-[22px] font-extrabold md:text-[30px]">−42초</dd><dt className="mt-1 text-[11px] leading-snug text-sub md:text-[12px]">대체 구매 후 결제 확정</dt></div>
            <div className="rounded-[16px] bg-white/80 p-3"><dd className="text-[22px] font-extrabold md:text-[30px]">−26초</dd><dt className="mt-1 text-[11px] leading-snug text-sub md:text-[12px]">배송·혜택 확인 후 결정</dt></div>
            <div className="rounded-[16px] bg-white/80 p-3"><dd className="text-[22px] font-extrabold md:text-[30px]">n=8</dd><dt className="mt-1 text-[11px] leading-snug text-sub md:text-[12px]">동일 참여자 비교 테스트</dt></div>
          </dl>
        </div>
      </Hero>

      <section id="c2" className="wrap gutter py-20 md:py-32 scroll-mt-20 md:mt-24">
        <ChapterHead color={S} n="01" label="Background & Problem Discovery" title="특정 구매 방법의 품절이, 구매 전체의 끝처럼 보였다" />
        <div className="mt-8 grid gap-8 md:grid-cols-12">
          <div className="md:col-span-7"><p className="max-w-[46rem] text-[18px] leading-[1.8]">오늘드림 사용자는 필요한 상품을 빠르게 받으려 할 수 있어요. 하지만 오늘드림 재고가 없을 때 매장 픽업이나 일반배송이 가능해도, 그 가능성을 발견하지 못하면 이전 단계로 돌아가 구매 방법을 다시 탐색해야 했습니다.</p></div>
          <aside className="rounded-[24px] bg-[#F3F7EB] p-6 md:col-span-5 md:p-8"><p className="eyebrow text-sub">Problem statement</p><p className="mt-3 text-[20px] font-bold leading-[1.55]">상품이 품절된 것이 아니라 특정 구매 방법만 불가능한 상황에서도, 구매 자체가 불가능하다고 판단할 수 있었습니다.</p></aside>
        </div>
        <div className="mt-12 rounded-[28px] bg-ink p-7 text-white md:p-10"><p className="eyebrow text-white/55">Design question</p><p className="mt-3 max-w-[30ch] text-[26px] font-bold leading-[1.4] md:text-[36px]">오늘드림이 품절된 순간, 사용할 수 있는 다른 구매 경로를 자연스럽게 안내할 수 없을까?</p></div>
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {[
            ['Before flow', ['상품 옵션 선택', '오늘드림 품절', '이전 단계 이동', '구매 방법 재탐색', '결제 진행']],
            ['After flow', ['상품 옵션 선택', '오늘드림 품절', '다른 구매 방법 안내', '일반배송·픽업 선택', '결제 진행']],
          ].map(([label, steps]) => <div key={label as string} className="rounded-[24px] border border-grid p-6"><p className="eyebrow text-sub">{label as string}</p><ol className="mt-5 flex flex-wrap items-center gap-2 text-[14px]">{(steps as string[]).map((step, index) => <li key={step} className="contents"><span className={`rounded-full px-3 py-2 ${label === 'After flow' && index === 2 ? 'font-semibold text-white' : 'bg-[#F5F5F3]'}`} style={label === 'After flow' && index === 2 ? { background: S } : undefined}>{step}</span>{index < (steps as string[]).length - 1 && <span aria-hidden className="text-sub">→</span>}</li>)}</ol></div>)}
        </div>
      </section>

      <section id="c3" className="scroll-mt-20 md:mt-24" style={{ background: '#F3F7EB' }}>
        <div className="wrap gutter py-20 md:py-32">
          <ChapterHead color={S} n="02" label="Solutions" title="세 가지 구매 구간을 결정 중심으로 다시 설계" />

          <article className="mt-16">
            <p className="eyebrow" style={{ color: S }}>Solution 01</p>
            <p className="mt-3 text-[16px] font-semibold text-sub">Purchase Recovery</p>
            <h3 className="mt-2 text-[30px] font-extrabold tracking-tight md:text-[38px]">품절 이후에도 구매 가능한 방법을 안내하다.</h3>
            <div className="mt-8 grid md:grid-cols-2 gap-5">
              <div className="rounded-[24px] bg-white p-6 md:p-8"><p className="eyebrow text-sub">문제</p><p className="mt-3 text-[19px] font-bold leading-snug">오늘드림 품절이 상품 전체 품절처럼 느껴져 구매가 멈췄어요.</p></div>
              <div className="rounded-[24px] bg-white p-6 md:p-8"><p className="eyebrow text-sub">디자인 판단</p><p className="mt-3 text-[19px] font-bold leading-snug">품절을 끝이 아닌 분기점으로 보고, 선택한 옵션을 유지한 채 일반배송·매장 픽업을 안내했어요.</p></div>
            </div>
            {p.beforeAfter?.[0] && <div className="mt-8"><BeforeAfter data={p.beforeAfter[0]} color={A} /></div>}
            <div className="mt-8 grid grid-cols-2 gap-4 md:gap-8 max-w-[760px] mx-auto"><Fig src={I('n-altMethods')} alt="다른 구매 방법 안내" cap="일반배송과 픽업 비교" /><Fig src={I('n-pickup')} alt="매장 픽업 선택" cap="픽업 매장 선택" className="md:mt-14" /></div>
            <Result value="평균 약 42초 단축" task="품절 이후 대체 구매 경로를 찾아 결제를 확정하는" />
            <p className="mt-5 max-w-[48rem] text-[15px] leading-[1.75] text-sub">가능한 구매 경로를 바로 확인하는 개선 흐름에서 과제 수행 시간이 짧게 나타났습니다. 실제 서비스의 구매 전환율 상승을 검증한 결과는 아닙니다.</p>
          </article>

          <article id="cart-experience" className="mt-24 md:mt-32 pt-16 border-t border-black/10 scroll-mt-24">
            <p className="eyebrow" style={{ color: S }}>Solution 02</p>
            <p className="mt-3 text-[16px] font-semibold text-sub">Cart Experience</p>
            <h3 className="mt-2 text-[30px] font-extrabold tracking-tight md:text-[38px]">구매에 필요한 판단과 행동을 더 가까이 배치하다.</h3>
            <div className="mt-8 grid md:grid-cols-2 gap-5">
              <div className="rounded-[24px] bg-white p-6 md:p-8"><p className="eyebrow text-sub">문제</p><p className="mt-3 text-[18px] font-bold leading-[1.55]">무료배송 조건은 확인할 수 있었지만, 추가 구매에 참고할 추천 상품은 긴 스크롤의 별도 영역에 나뉘어 있었어요.</p></div>
              <div className="rounded-[24px] bg-white p-6 md:p-8"><p className="eyebrow text-sub">Design question</p><p className="mt-3 text-[18px] font-bold leading-[1.55]">무료배송까지 남은 금액을 확인한 순간, 필요한 상품을 바로 선택할 수 있다면?</p></div>
            </div>
            <div className="mt-10">
              <p className="eyebrow text-sub">Before · 실제 올리브영 앱의 긴 장바구니 흐름</p>
              <p className="mt-3 max-w-[48rem] text-[15px] leading-[1.75] text-sub">기존 앱도 무료배송 안내와 구매 버튼을 하단에 고정해 제공했습니다. 문제는 버튼을 찾는 것이 아니라, 무료배송 조건을 확인한 순간 추가 구매에 참고할 추천 상품이 현재 구매 맥락과 바로 연결되지 않는 구조였습니다.</p>
              <ol id="cart-before-flow" role="region" aria-label="기존 장바구니 스크롤 흐름, 모바일에서는 좌우로 탐색" tabIndex={0} className="mt-7 -mx-5 flex scroll-mt-24 gap-5 overflow-x-auto px-5 pb-5 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
                {[
                  ['/images/oliveyoung-todaydream/cart-asis-01.jpg', '01', '상품과 배송 조건', '배송 방식·배송지·도착 예정 시간과 상품 옵션을 확인합니다.'],
                  ['/images/oliveyoung-todaydream/cart-asis-02.jpg', '02', '결제 예상과 추천 시작', '예상 결제 금액 아래에서 추천 상품 영역이 시작됩니다.'],
                  ['/images/oliveyoung-todaydream/cart-asis-03.jpg', '03', '추천 상품 탐색', '나를 위한 추천과 함께 보면 좋은 상품이 긴 화면에 이어집니다.'],
                  ['/images/oliveyoung-todaydream/cart-asis-04.jpg', '04', '화면 하단까지 유지되는 CTA', '스크롤 위치와 관계없이 무료배송 안내와 구매 버튼은 고정됩니다.'],
                ].map(([src, n, title, body]) => <li key={src} className="w-[72vw] max-w-[270px] shrink-0 sm:w-auto sm:max-w-none"><Fig src={src} alt={`실제 올리브영 오늘드림 장바구니 ${title}`} cap={`${n} · ${title}`} /><p className="mt-2 text-[13px] leading-[1.65] text-sub">{body}</p></li>)}
              </ol>
            </div>
            <div className="mt-14 rounded-[28px] bg-white p-6 md:p-10">
              <p className="eyebrow" style={{ color: S }}>After · 개선안</p>
              <div className="mt-6 grid items-start gap-10 md:grid-cols-12">
                <div className="mx-auto w-full max-w-[380px] md:col-span-5"><Fig src={I('n-cart')} alt="무료배송 남은 금액, 현재 상품, 연관 상품과 담기 버튼을 한 흐름으로 보여주는 장바구니 개선 화면" cap="무료배송 조건과 장바구니 상품 기반 연관 상품을 한 흐름에서 안내" /></div>
                <ol className="space-y-6 md:col-span-7">
                  {[
                    ['01', '무료배송 조건의 가시성', '현재 상품금액 10,000원, 기준 30,000원, 남은 금액 20,000원을 프로토타입 예시 조건으로 분명하게 보여줍니다.'],
                    ['02', '구매 맥락에 맞는 연관 상품', '장바구니에 담긴 마스크팩과 함께 고려할 수 있는 메디힐 상품 두 개에 집중했습니다. AI 개인화 추천이 아니라 장바구니 상품 기반 제안입니다.'],
                    ['03', '탐색과 행동의 거리 축소', '무료배송 조건 아래에 현재 상품과 추천 상품, 담기 버튼을 배치해 판단 직후 다음 행동으로 이어지게 했습니다.'],
                  ].map(([n, title, body]) => <li key={n} className="border-t border-grid pt-5"><p className="text-[13px] font-bold" style={{ color: S }}>Decision {n}</p><h4 className="mt-2 text-[20px] font-bold">{title}</h4><p className="mt-2 text-[15px] leading-[1.75] text-sub">{body}</p></li>)}
                </ol>
              </div>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              <div className="rounded-[24px] bg-[#EAF4DB] p-6 md:p-8"><p className="eyebrow" style={{ color: S }}>Qualitative feedback</p><ul className="mt-4 space-y-3 text-[16px] leading-[1.7]"><li>무료배송까지 더 담아야 할 금액을 이해하기 쉬웠음</li><li>기존에 구매하려던 상품과 관련된 추천이 자연스럽게 느껴졌음</li><li>추천 상품을 보며 추가 구매를 긍정적으로 고려하게 됐음</li></ul><p className="mt-5 text-[13px] leading-[1.65] text-sub">정성적 반응이며 실제 추가 구매 행동이나 금액·매출 지표는 측정하지 않았습니다.</p></div>
              <div className="rounded-[24px] border border-grid bg-white p-6 md:p-8"><p className="eyebrow text-sub">후속 보완 방향 · 미구현</p><ul className="mt-4 list-disc space-y-2 pl-5 text-[15px] leading-[1.7] text-sub"><li>옵션·수량 변경, 상품 삭제와 선택 상태 보완</li><li>배송지 확인·변경 경로 추가</li><li>실제 다음 단계에 맞는 CTA 문구 확정</li><li>상품 추가 후 금액·프로그레스·안내의 일관된 갱신</li></ul></div>
            </div>
            <div className="mt-5 rounded-[20px] bg-white/70 p-6 text-[15px] leading-[1.7] text-sub"><b className="text-ink">Future validation</b><br />“무료배송까지 남은 금액을 확인하고 필요한 상품을 추가해 구매를 진행해 주세요” 과제로 조건 확인 시간, 추천 발견 여부, 선택 이유와 혼란 지점을 추후 검증할 수 있습니다. 아직 수행한 테스트로 표현하지 않습니다.</div>
          </article>

          <article className="mt-24 md:mt-32 pt-16 border-t border-black/10">
            <p className="eyebrow" style={{ color: S }}>Solution 03</p>
            <p className="mt-3 text-[16px] font-semibold text-sub">Checkout Experience</p>
            <h3 className="mt-2 text-[30px] font-extrabold tracking-tight md:text-[38px]">결제에 필요한 정보를, 필요한 순간에 확인하도록.</h3>
            <div className="mt-8 grid md:grid-cols-2 gap-5">
              <div className="rounded-[24px] bg-white p-6 md:p-8"><p className="eyebrow text-sub">문제</p><p className="mt-3 text-[18px] font-bold leading-[1.55]">배송 시간, 배송비, 쿠폰, 포인트와 최종 금액이 긴 화면에 분산되면 필요한 정보를 다시 찾는 부담이 생길 수 있어요.</p></div>
              <div className="rounded-[24px] bg-white p-6 md:p-8"><p className="eyebrow text-sub">디자인 판단</p><p className="mt-3 text-[18px] font-bold leading-[1.55]">배송·수령 정보 / 할인·혜택 / 최종 결제의 세 영역으로 묶고, 핵심은 접힌 상태에서도 확인하게 했어요.</p></div>
            </div>
            {p.beforeAfter?.[3] && <div className="mt-8"><BeforeAfter data={p.beforeAfter[3]} color={A} /></div>}
            <div className="mt-10 grid grid-cols-2 gap-5 md:mx-auto md:max-w-[760px] md:gap-8"><Fig src={I('n-checkoutOpen')} alt="할인과 혜택 정보를 펼쳐 확인하는 주문 결제 화면" cap="필요할 때 세부 정보 펼치기" /><Fig src={I('n-slot')} alt="배송 시간대와 비용을 함께 비교하는 화면" cap="시간대별 배송비 비교" className="md:mt-14" /></div>
            <ul className="mt-8 grid gap-3 text-[15px] leading-[1.65] sm:grid-cols-2 lg:grid-cols-4">{['접힌 상태에서도 핵심 정보 확인', '시간대와 배송비 관계를 함께 표시', '쿠폰·포인트 조건을 목적별로 확인', '선택 변경 시 금액 정보 일관성 유지'].map(item => <li key={item} className="rounded-[18px] bg-white p-4">{item}</li>)}</ul>
            <Result value="평균 26초 단축" task="배송 시간과 혜택을 확인하고 구매를 결정하는" />
            <p className="mt-5 max-w-[48rem] text-[15px] leading-[1.75] text-sub">목적별로 정보를 그룹화한 개선 프로토타입에서 구매 결정 과제의 평균 시간이 짧게 나타났습니다. 실제 결제 완료율이나 구매 전환율 상승을 검증한 결과는 아닙니다.</p>
          </article>
        </div>
      </section>

      <section id="c4" className="wrap gutter py-20 md:py-32 scroll-mt-20 md:mt-24">
        <ChapterHead color={S} n="03" label="Edge cases" title="대표 흐름과 예외 상황을 분리하다" />
        <p className="mt-6 max-w-2xl text-[17px] leading-[1.8] text-sub">주요 구매 흐름과 분리해, 사용자가 멈출 수 있는 상태만 빠르게 비교할 수 있도록 묶었어요.</p>
        <div className="mt-12"><Strip label="구매 예외 상황 갤러리">{[
          ['n-optFail', '재고 확인 실패'], ['n-altNone', '전체 품절'], ['n-restock', '재입고 알림'], ['n-stockChanged', '주문 직전 재고 변경'],
        ].map(([n, label]) => <figure key={n} className="w-[230px] shrink-0"><Screen src={I(n)} alt={`${label} 화면`} /><figcaption className="mt-3 text-[14px] text-sub">{label}</figcaption></figure>)}</Strip></div>
        <InteractionPreview p={p} wide={c.wide} onOpen={() => c.setOpen(true)} title="재고 상태에 따른 흐름을 직접 확인해보세요" />
      </section>

      <section id="c5" className="scroll-mt-20 md:mt-24 rule">
        <div className="wrap gutter py-20 md:py-32">
          <ChapterHead color={S} n="04" label="Reflection & Limitations" title="화면보다, 다음 결정을 설계하며 배운 것" />
          <ol className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              ['01', 'Recovery', '품절이나 실패 상태에서도 사용자가 다음 행동을 이해할 수 있도록 안내해야 합니다.'],
              ['02', 'Decision', '구매 맥락과 연결된 정보는 사용자가 다음 선택을 내리는 데 도움을 줄 수 있습니다.'],
              ['03', 'Structure', '정보를 무조건 줄이기보다 필요한 순간에 이해할 수 있도록 구조화하는 것이 중요합니다.'],
            ].map(([n, title, body]) => <li key={n} className="border-t border-grid pt-5"><p className="text-[13px] font-bold" style={{ color: S }}>{n}</p><h3 className="mt-2 text-[24px] font-bold">{title}</h3><p className="mt-3 text-[16px] leading-[1.75] text-sub">{body}</p></li>)}
          </ol>
          <div className="mt-12 rounded-[24px] bg-[#F5F5F3] p-6 md:p-8"><p className="eyebrow text-sub">Limitations</p><ul className="mt-4 grid gap-x-8 gap-y-2 text-[15px] leading-[1.7] text-sub md:grid-cols-2"><li>소규모 사용자 테스트 n=8</li><li>실제 서비스와 프로토타입의 사용 환경 차이</li><li>테스트 순서에 따른 학습 효과 가능성</li><li>실제 매출·구매 전환율 변화 미검증</li><li>장바구니 추가 구매 의향은 정성적 피드백</li><li>후속 보완 기능은 실제 미구현 항목으로 분리</li></ul></div>
        </div>
      </section>
    </>
  )
}

// ── 이전 올리브영 상세 구성(참고용) ──────────────────────────
function Olive({ c }: { c: Ctx }) {
  const { p, A, S, T } = c
  const I = (n: string) => `/images/oliveyoung-todaydream/${n}.webp`
  const ctas: [string, string][] = [['미선택', '옵션을 선택해 주세요'], ['오늘드림 구매 가능', '이 옵션 선택하기'], ['오늘드림 품절', '다른 구매 방법 확인'], ['전체 품절', '재입고 알림 받기'], ['재고 조회 실패', '재고 다시 확인']]
  const states = ['구매 가능', '품절', '재고 확인 중', '재고 조회 실패', '매장 선택 필요', '픽업 주문 불가']
  const journey: [string, string, string, string][] = [['asisHome', '01 상품 탐색', '홈에서 상품을 찾고 선택', '메디힐 마스크팩 선택'], ['detailAsis', '02 상품 상세', '오늘드림 또는 픽업 선택 영역이 있음', '장바구니·바로구매'], ['checkoutAsis', '03 주문/결제', '배송지, 시간대, 배송비, 쿠폰, 최종 금액', '시간대별 배송비 차이 확인']]
  return (
    <>
      <Hero c={c} title="품절 이후에도 구매를 이어갈 수 있도록" lead="오늘드림이 품절돼도 다른 방법으로 구매를 이어가게 했어요" kicker="비공식 개인 UX 개선 제안 · 소속 회사와 무관 · 재고·매장 데이터는 가상" size="md">
        <div className="flex items-end justify-center gap-5 md:gap-8">
          <figure className="w-[44%]"><p className="text-[13px] font-semibold mb-2" style={{ color: S }}>TO-BE · 품절 옵션 선택</p><Screen src={I('n-optC')} alt="개선 화면: 오늘드림 품절 옵션을 고르면 다른 구매 방법 확인이 주요 행동으로 나온다" /></figure>
          <figure className="w-[44%] md:mt-12"><p className="text-[13px] font-semibold mb-2" style={{ color: S }}>TO-BE · 다른 구매 방법</p><Screen src={I('n-altMethods')} alt="개선 화면: 일반배송으로 구매할 수 있는 경우" /></figure>
        </div>
      </Hero>

      <section aria-label="프로젝트 이해하기" className="wrap gutter pt-20 md:pt-28">
        <p className="eyebrow" style={{ color: S }}>이 프로젝트를 쉽게 이해하기</p>
        <h2 className="mt-3 apple-h text-[30px] md:text-[48px] max-w-[22ch]">품절은 구매의 끝이 아니라 다른 방법으로 이어주는 순간이에요</h2>

        <Reveal stagger className="mt-10 grid md:grid-cols-3 gap-3 md:gap-5">
          {[['01', '오늘드림이 뭐예요?', '올리브영 앱에서 주문하면 내 배송지로 빠르게 받는 배송 서비스예요. 재고는 내 배송지 기준으로 확인해요. 같은 상품을 일반배송으로 받거나 매장에서 픽업할 수도 있어요.'],
            ['02', '언제 문제가 생겼나요?', '오늘드림으로 주문하려고 옵션을 골랐는데 ‘일시품절’만 보일 때예요. 이때 화면에는 ‘재입고 알림’ 버튼만 있었어요.'],
            ['03', '왜 문제로 봤나요?', '이 순간 사용자는 보통 주문을 포기하거나 재입고 알림만 눌러요. 하지만 같은 상품을 일반배송이나 매장 픽업으로 살 수 있다면 구매할 수 있는 사람을 놓치는 거예요. 올리브영에게는 팔 수 있었던 기회가 사라져요.']].map(([n, t, d]) => (
            <div key={n} className="rounded-[24px] bg-[#F7F8FA] p-6 md:p-7"><p className="text-[13px] font-bold" style={{ color: S }}>{n}</p><h3 className="mt-2 text-[20px] md:text-[22px] font-bold tracking-tight">{t}</h3><p className="mt-3 text-[16px] leading-[1.75] text-ink/80">{d}</p></div>
          ))}
        </Reveal>

        <div className="mt-6 md:mt-8 grid md:grid-cols-2 gap-4 md:gap-6">
          <div className="rounded-[24px] border border-grid p-6 md:p-8">
            <span className="inline-block px-3 py-1 rounded-full text-[13px] font-bold bg-[#e8e8e8]">기존</span>
            <ol aria-label="기존 흐름" className="mt-5 flex flex-wrap items-center gap-2 text-[15px]">
              <li className="px-4 py-2 rounded-full bg-[#f5f5f7]">오늘드림 옵션 선택</li><li aria-hidden className="text-sub">→</li>
              <li className="px-4 py-2 rounded-full bg-[#f5f5f7] font-semibold">일시품절</li><li aria-hidden className="text-sub">→</li>
              <li className="px-4 py-2 rounded-full bg-[#fdeaea] text-[#a12a2a] font-semibold">주문 포기 또는 재입고 알림</li>
            </ol>
            <p className="mt-4 text-[15px] leading-[1.7] text-sub">구매가 여기서 멈춰요. 다른 방법으로 살 수 있는지는 알려주지 않아요.</p>
          </div>
          <div className="rounded-[24px] p-6 md:p-8" style={{ background: T(16), border: `1px solid ${T(36)}` }}>
            <span className="inline-block px-3 py-1 rounded-full text-[13px] font-bold" style={{ background: A, color: onBrand(A) }}>개선</span>
            <ol aria-label="개선 흐름" className="mt-5 flex flex-wrap items-center gap-2 text-[15px]">
              <li className="px-4 py-2 rounded-full bg-white">오늘드림 옵션 선택</li><li aria-hidden className="text-sub">→</li>
              <li className="px-4 py-2 rounded-full bg-white">품절</li><li aria-hidden className="text-sub">→</li>
              <li className="px-4 py-2 rounded-full font-semibold" style={{ background: A, color: onBrand(A) }}>다른 구매 방법 확인</li><li aria-hidden className="text-sub">→</li>
              <li className="px-4 py-2 rounded-full bg-white">일반배송 · 매장 픽업</li><li aria-hidden className="text-sub">→</li>
              <li className="px-4 py-2 rounded-full bg-white">구매 이어짐</li>
            </ol>
            <p className="mt-4 text-[15px] leading-[1.7] text-ink/80">품절 옵션을 고르면 ‘다른 구매 방법 확인’ 버튼이 먼저 나와요. 고른 옵션을 그대로 가지고 일반배송이나 매장 픽업으로 이어가요.</p>
          </div>
        </div>

        <div className="mt-6 md:mt-8 md:grid md:grid-cols-12 gap-8 items-center rounded-[28px] bg-[#F7F8FA] p-6 md:p-10">
          <div className="md:col-span-7">
            <p className="eyebrow text-sub">프로젝트의 핵심</p>
            <p className="mt-3 text-[24px] md:text-[34px] font-bold tracking-tight leading-snug">오늘드림이 품절됐다고 매출을 포기하지 않아요. 다른 방법으로 구매하도록 이어서 잠재 매출을 지키는 게 목표예요.</p>
            <p className="mt-4 text-[14px] leading-[1.7] text-sub">매출이 얼마나 오를지는 측정하지 않았어요. 사용자가 구매를 이어갈 가능성을 높이는 설계 목표이고, 사용성 테스트로 검증이 필요해요.</p>
          </div>
          <div className="mt-8 md:mt-0 md:col-span-5 grid grid-cols-2 gap-4">
            <figure><p className="text-[13px] font-semibold text-sub mb-2">기존 · 품절 옵션 선택</p><Screen src={p.beforeAfter![0].before} alt={p.beforeAfter![0].beforeAlt} /></figure>
            <figure><p className="text-[13px] font-semibold mb-2" style={{ color: S }}>개선 · 품절 옵션 선택</p><Screen src={p.beforeAfter![0].after} alt={p.beforeAfter![0].afterAlt} /></figure>
          </div>
        </div>
      </section>

      <section id="c2" className="wrap gutter py-20 md:py-32 scroll-mt-20 md:mt-24">
        <ChapterHead color={S} n="01" label="The Challenge" title="품절은 구매 여정의 끝이어야 할까?" />
        <p className="mt-6 max-w-2xl text-[18px] leading-[1.7]">오늘드림에서 원하는 옵션이 품절됐을 때, 일반배송이나 매장 픽업이 가능한지 쉽게 확인하지 못하면 구매를 멈출 수 있어요. 품절을 <b>끝</b>이 아니라 <b>다른 구매 방법을 탐색하는 지점</b>으로 다시 설계했어요.</p>

        <p className="mt-16 eyebrow text-sub">AS-IS 구매 여정 · 실제 앱 캡처</p>
        <ol className="mt-5 grid md:grid-cols-3 gap-6 md:gap-10">{journey.map(([n, l, d, e]) => <li key={n}><Fig src={I('n-' + n)} alt={`실제 올리브영 앱 ${l}`} cap={l} /><p className="mt-1 text-[16px] leading-snug">{d}</p><p className="mt-1 text-[14px] text-sub">{e}</p></li>)}</ol>
        <div className="mt-8 rounded-[20px] p-6 md:p-8" style={{ background: T(14) }}>
          <p className="eyebrow text-sub">실제 화면에서 확인한 사실</p>
          <ul className="mt-3 text-[16px] leading-[1.8] list-disc pl-5"><li>상품 상세에 오늘드림 또는 픽업 이용 영역이 있다</li><li>주문/결제에서 배송 시간대에 따라 배송비가 다르다: 12:45~13:45 5,000원 · 15:00~16:00 2,500원 · 22:00~24:00 2,500원</li><li>최종 결제금액 12,500원 화면이 확인된다</li></ul>
          <p className="mt-3 text-[13px] text-sub">품절 옵션 선택 화면도 실제 앱 캡처예요. 그 이후의 기존 동작은 단정하지 않고 검증할 가설로 뒀어요.</p>
        </div>

        <div className="mt-20 md:grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5"><p className="eyebrow text-sub rule pt-4">Problem Definition</p><h3 className="mt-4 text-[28px] md:text-[36px] font-extrabold tracking-tight leading-tight">품절 이후 다른 수령 방법을 발견하고 고르는 과정의 불확실성</h3></div>
          <ol className="mt-8 md:mt-0 md:col-span-7 space-y-3">{[['다음 행동의 발견성', '재입고 알림 외에 다른 구매 방법을 탐색할 수 있는지 이해해야 한다'], ['재고 상태의 명확성', '오늘드림 품절, 일반배송 품절, 픽업 주문 불가, 재고 조회 실패는 서로 다른 상태다'], ['구매 여정의 연속성', '다른 방법으로 이동해도 선택한 옵션, 수량, 배송 조건이 유지되어야 한다']].map(([a, b], i) => <li key={a} className="rounded-[20px] bg-white border border-grid p-5 flex gap-4"><span className="text-[28px] font-extrabold leading-none" style={{ color: S }}>0{i + 1}</span><div><p className="text-[17px] font-bold">{a}</p><p className="mt-1 text-[15px] leading-snug text-sub">{b}</p></div></li>)}</ol>
        </div>

        <div className="mt-16 rounded-[28px] p-7 md:p-10" style={{ background: '#F7F8FA' }}>
          <p className="eyebrow text-sub">Design Hypothesis</p>
          <p className="mt-4 text-[22px] md:text-[28px] font-bold leading-snug max-w-[34ch]">품절 옵션을 선택했을 때 다음 행동을 하단 고정 CTA로 보여주면, 대체 구매 경로 발견과 수령 방법 선택 성공률이 높아질 것이다.</p>
          <ul className="mt-6 grid md:grid-cols-3 gap-4 text-[15px] leading-snug">{['옵션 선택과 행동 영역을 분리하면 복잡도가 줄어들 것이다', '일반배송과 픽업의 구매 가능 상태를 구분하면 잘못된 선택이 줄어들 것이다', '시간대별 배송비를 선택 전에 보여주면 비용 비교 시간이 줄어들 것이다'].map((h, i) => <li key={h} className="rounded-[20px] bg-white p-5"><span className="text-[13px] font-semibold" style={{ color: S }}>Sub 0{i + 1}</span><p className="mt-1">{h}</p></li>)}</ul>
        </div>
        <p className="mt-8 text-[13px] text-sub max-w-3xl">앱 리뷰·블로그 VOC 수집과 인터뷰를 근거로 문제를 정리했어요. 원자료가 없어 표본 수와 수치는 싣지 않았고, 불편의 크기는 사용성 테스트로 검증이 필요한 가설이에요.</p>
      </section>

      <section id="c3" className="scroll-mt-20 md:mt-24" style={{ background: '#F7F8FA' }}>
        <div className="wrap gutter py-20 md:py-32">
          <ChapterHead color={S} n="02" label="Design Decisions" title="옵션 선택에서 수령 방법 확인까지의 흐름을 다시 짰다" />

          <div className="mt-14 md:grid md:grid-cols-12 gap-10 items-start">
            <div className="md:col-span-5"><Num n="01" t="옵션 선택형 리스트 + 하단 고정 CTA" />
              <p className="mt-4 text-[16px] leading-[1.7] text-sub">옵션 목록은 상품·재고를 비교하는 영역으로, 하단에는 선택한 옵션에 맞는 주요 CTA 하나를 고정했어요. 보조 행동은 텍스트 링크예요.</p>
              <table className="mt-6 w-full text-[15px] bg-white rounded-[20px] overflow-hidden"><caption className="sr-only">옵션 상태별 하단 CTA</caption><thead><tr className="text-left text-[13px] text-sub"><th scope="col" className="py-3 pl-5">옵션 상태</th><th scope="col" className="py-3 pr-5">하단 CTA</th></tr></thead><tbody>{ctas.map(([a, b]) => <tr key={a} className="border-t border-grid"><th scope="row" className="py-3 pl-5 pr-3 text-left font-semibold">{a}</th><td className="py-3 pr-5" style={{ color: S }}>{b}</td></tr>)}</tbody></table></div>
            <div className="mt-10 md:mt-0 md:col-span-7 grid grid-cols-3 gap-4 md:gap-6"><Fig src={I('n-optA')} alt="옵션 미선택 상태" cap="옵션 미선택" /><Fig src={I('n-optC')} alt="오늘드림 품절 옵션 선택" cap="오늘드림 품절" className="md:mt-10" /><Fig src={I('n-optFail')} alt="재고 확인 실패 상태" cap="재고 확인 실패" /></div>
          </div>
          {p.beforeAfter?.[0] && <div className="mt-14"><div className="max-w-[62ch]"><p className="eyebrow rule pt-4 text-sub">Before / After · 품절 옵션 선택</p><h3 className="mt-4 text-[28px] md:text-[32px] font-bold tracking-tight leading-tight">옵션별 행동을 찾는 방식에서, 선택한 옵션의 다음 행동을 확인하는 방식으로</h3><p className="mt-4 text-[15px] text-sub">Before는 실제 올리브영 앱의 옵션 시트 캡처예요.</p></div><div className="mt-8"><BeforeAfter data={p.beforeAfter[0]} color={A} /></div></div>}

          <Reveal className="mt-20 md:mt-24">
            <Num n="02" t="수령 방법별로 재고와 주문 가능 상태를 구분" />
            <p className="mt-4 text-[17px] leading-[1.8] max-w-2xl">오늘드림 품절을 상품 전체 품절로 읽지 않도록, 오늘드림은 배송지 · 일반배송은 동일 옵션 · 매장 픽업은 선택한 매장 기준으로 따로 확인해요. <b>재고 조회 실패는 품절로 표시하지 않아요.</b></p>
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="재고 상태">{states.map(s => <li key={s} className="px-4 py-2 rounded-full bg-white border border-grid text-[14px]">{s}</li>)}</ul>
            <div className="mt-10 grid grid-cols-3 gap-4 md:gap-6 md:max-w-3xl"><Fig src={I('n-altMethods')} alt="일반배송 구매 가능" cap="일반배송 구매 가능" /><Fig src={I('n-pickup')} alt="픽업 매장 선택" cap="픽업 매장 선택" className="md:mt-10" /><Fig src={I('n-stockChanged')} alt="주문 직전 재고 변동" cap="주문 직전 재고 변동" /></div>
            <p className="mt-4 text-[15px] leading-relaxed text-sub max-w-2xl">옵션·수량·배송지·매장이 바뀌면 그 조건으로 재고를 다시 확인하고, 주문 직전에 재고가 소진되면 상품 정보를 유지한 채 다른 구매 방법을 다시 고르게 해요.</p>
          </Reveal>
          {p.beforeAfter?.[1] && <div className="mt-16"><div className="max-w-[62ch]"><p className="eyebrow rule pt-4 text-sub">Before / After · 수령 방법 선택</p><h3 className="mt-4 text-[28px] md:text-[32px] font-bold tracking-tight leading-tight">수령 방법의 존재 확인에서, 구매 가능한 방법을 비교·선택으로</h3><p className="mt-4 text-[15px] text-sub"></p></div><div className="mt-8"><BeforeAfter data={p.beforeAfter[1]} color={A} /></div></div>}

          <Reveal className="mt-20 md:mt-24">
            <Num n="03" t="배송 시간대별 배송비를 선택 전에 비교" />
            <p className="mt-4 text-[17px] leading-[1.8] max-w-2xl">시간대를 고른 뒤 배송비를 확인하는 구조를, 각 시간대 항목에 배송비를 함께 보여주는 구조로 바꿨어요. 시간대를 바꾸면 최종 결제금액도 바로 갱신돼요.</p>
          </Reveal>
          {p.beforeAfter?.[2] && <div className="mt-10"><div className="max-w-[62ch]"><p className="eyebrow rule pt-4 text-sub">Before / After · 배송비</p><h3 className="mt-4 text-[28px] md:text-[32px] font-bold tracking-tight leading-tight">시간 선택 뒤 비용 확인에서, 시간과 비용을 함께 비교로</h3></div><div className="mt-8"><BeforeAfter data={p.beforeAfter[2]} color={A} /></div></div>}

          {p.extra && p.beforeAfter?.[3] && (
            <Reveal className="mt-20 md:mt-24">
              <p className="eyebrow text-sub rule pt-4">함께 정리한 구매 구간</p>
              <p className="mt-4 text-[16px] leading-[1.8] text-sub max-w-2xl">{p.extra.intro}</p>
              <div className="mt-8"><ul className="md:col-span-5 space-y-3">{p.extra.bullets.map(b => <li key={b} className="pl-4 border-l-2 text-[15px] leading-relaxed" style={{ borderColor: A }}>{b}</li>)}</ul><div className="mt-8"><BeforeAfter data={p.beforeAfter[3]} color={A} /></div></div>
            </Reveal>
          )}
        </div>
      </section>

      <section id="c4" className="wrap gutter py-20 md:py-32 scroll-mt-20 md:mt-24">
        <ChapterHead color={S} n="03" label="Final Experience" title="옵션 선택에서 구매·알림까지" />
        <div className="mt-14"><PinnedPhone color={S} label="올리브영 화면 둘러보기" steps={(p.gallery ?? []).map(g => ({ src: g.src, alt: g.alt, title: g.caption ?? g.alt, body: g.alt }))} /></div>
        <InteractionPreview p={p} wide={c.wide} onOpen={() => c.setOpen(true)} title="재고 상태에 따라 직접 눌러보세요" />
      </section>

      <Outcome c={c} cards={<><div className="rounded-[20px] bg-[#F7F8FA] p-6"><p className="text-[14px] text-sub">현재 상태</p><p className="mt-2 text-[20px] font-bold">사용성 테스트 계획 단계</p></div><div className="rounded-[20px] p-6" style={{ background: T(14) }}><p className="text-[14px] text-sub">검증할 것</p><p className="mt-2 text-[16px] leading-relaxed">품절 이후 다른 구매 방법을 발견하고 선택할 수 있는지 확인합니다.</p></div></>}>
        <div className="pt-6 rule"><p className="eyebrow text-sub">Test plan</p><ul className="mt-4 list-disc space-y-2 pl-5 text-[16px] leading-relaxed"><li>오늘드림 품절 후 구매 가능한 수령 방법 찾기</li><li>다른 지역의 픽업 매장 재고 확인</li><li>원하는 옵션의 재입고 알림 신청</li><li>대체 경로 발견 여부, 과업 성공 여부, 완료 시간과 오류를 관찰</li></ul><p className="mt-5 text-[14px] leading-relaxed text-sub">실제 구매 전환율, 매출, 성공률은 측정하지 않았으며 실측 결과가 생기기 전에는 수치로 제시하지 않습니다.</p></div>
      </Outcome>
    </>
  )
}

// ── 당근: 거래 정보 · 구매 판단 ──────────────────────────────
const I2 = (n: string) => `/images/karrot-large-furniture/${n}.webp`
const karrotCompare: CompareData[] = [
  { n: '01', title: '판매글 작성 · 가구 정보를 따로 받아요', sub: '판매자가 크기·분해 여부·운반 조건을 자유 서술에 의존하지 않고 선택 입력 섹션으로 정리해 남길 수 있어요.',
    before: { src: I2('asis-write'), alt: '현재 당근 앱 판매글 작성: 사진, 제목, 자세한 설명, 가격 입력만 있고 대형 가구 거래 조건을 입력하는 칸이 없음', label: '현재 당근 앱' },
    afters: [{ src: I2('L-s2'), alt: '개선 판매글 작성: 자세한 설명 아래에 선택 입력 가구 정보 섹션', tag: 'S2', label: '판매글 작성 · 아래로 스크롤' }, { src: I2('L-s3'), alt: '개선 가구 정보 입력: 크기와 분해 여부, 가져가는 조건 입력', tag: 'S3', label: '가구 정보 입력 · 펼친 상태' }],
    current: ['크기·분해 여부·운반 조건을 ‘자세한 설명’ 자유 입력란에 쓸 수 있어요. 판매자마다 쓰는 정보의 양과 형식이 달라져요.', '거래 방식·가격 외에 대형 가구 거래에 필요한 조건(층수, 엘리베이터, 운반 도움)을 입력하는 칸이 없어요.'],
    improved: ['S2 · 판매글 작성에 ‘가구 정보’ 섹션을 선택 입력으로 추가했어요. 상품 정보(크기, 분해 여부)와 가져가는 조건(층수, 엘리베이터, 운반 도움)으로 나뉘어요.', 'S3 · 아는 항목만 입력해도 되고 섹션별 입력 진행도(4/4 입력, 3/3 입력)를 바로 보여줘요.'] },
  { n: '02', title: '상품 상세 · 채팅 전에 거래 조건을 확인해요', sub: '구매자가 채팅을 열기 전에 크기와 가져가는 조건을 확인하고 확인되지 않은 정보가 무엇인지도 알 수 있어요.',
    before: { src: I2('asis-desc'), alt: '현재 당근 앱 상품 상세 본문: 크기와 분해 정보가 문장 속에 섞여 있고 하단에 채팅하기 버튼이 있음', label: '현재 당근 앱' },
    afters: [{ src: I2('L-b1'), alt: '개선 상품 상세: 거래 정보 카드에 크기·분해와 가져가는 조건이 모두 입력됨', tag: 'B1', label: '상세 · 거래 정보(스크롤)' }, { src: I2('L-b2'), alt: '개선 상품 상세: 일부만 입력되어 확인되지 않은 정보 3개를 알려줌', tag: 'B2', label: '상세 · 확인되지 않은 정보(스크롤)' }],
    current: ['상품 정보가 본문 자유 텍스트에만 있어서 크기, 분해 여부, 운반 조건을 상세 화면에서 알 수 없어요.', '궁금한 점을 확인하는 방법이 채팅뿐이라 기본적인 질문까지 모두 채팅으로 물려요.'],
    improved: ['B1 · ‘거래 정보’ 카드에 판매자가 직접 입력한 크기·분해, 가져가는 조건을 정리해 보여줘요.', 'B2 · ‘아직 미입력’과 ‘판매자도 모름’을 구분해 ‘확인되지 않은 정보 3개’로 알려줘요.'] },
  { n: '03', title: '채팅 문의 · 질문을 골라서 보내요', sub: '확인되지 않은 정보를 바탕으로 질문을 고르면 채팅 입력창에 초안으로 들어가요. 처음 말 걸기가 쉬워지고 질문이 구체적이 돼요.',
    before: { src: I2('asis-chat'), alt: '현재 당근 앱 채팅 시작 화면: 상단에 상품 요약과 당근페이 등 버튼, 하단에 안녕하세요 같은 일반 인사 추천 문구와 입력창', label: '현재 당근 앱' },
    afters: [{ src: I2('f-b3'), alt: '개선 질문 고르기: 확인되지 않은 정보에서 물어볼 질문을 선택', tag: 'B3', label: '질문 고르기' }, { src: I2('f-b4'), alt: '개선 채팅 질문 초안: 고른 질문이 입력창에 초안으로 들어감', tag: 'B4', label: '채팅 질문 초안' }],
    current: ['추천 문구가 ‘안녕하세요’ ‘관심 있어서 문의드려요.’ 같은 일반 인사라서 크기·운반 같은 필요한 조건은 직접 써서 물어봐야 해요.', '상단 상품 요약에는 상태와 제목만 있어서 대화 중에 거래 조건을 보려면 상세 화면으로 다시 돌아가야 해요.'],
    improved: ['B3 · 상세의 확인되지 않은 정보에서 물어볼 질문을 골라요.', 'B4 · 고른 질문이 채팅 입력창에 초안으로 들어가요. 확인하고 고친 뒤 보낼 수 있어요.'] },
  { n: '04', title: '정보 변경 · 바뀐 내용을 알려줘요', sub: '판매자가 가격이나 거래 조건을 수정하면 대화 중인 구매자와 상세 화면을 보는 구매자 모두 최신 정보를 확인할 수 있어요.',
    before: { src: I2('asis-top'), alt: '현재 당근 앱 상품 상세 상단: 사진과 가격 위에 수정 여부나 변경 항목 안내가 없음', label: '현재 당근 앱' },
    afters: [{ src: I2('f-c2'), alt: '개선 채팅 변경 알림: 판매자가 상품 정보를 수정했다는 시스템 메시지', tag: 'C2', label: '채팅 · 변경 알림' }, { src: I2('f-c3'), alt: '개선 상세 변경 안내: 변경된 항목 안내와 이전 가격 표시', tag: 'C3', label: '상세 · 변경 안내' }],
    current: ['게시글이 수정돼도 상세 화면에 무엇이 바뀌었는지 표시되지 않아요.', '이미 대화 중인 구매자에게 가격이나 조건 변경이 전달되지 않아 예전 정보로 거래를 진행할 수 있어요.'],
    improved: ['C3 · 상세 상단에 ‘판매자가 상품 정보를 수정했어요 · 변경된 항목’ 안내와 ‘변경 내용 보기’를 보여줘요. 가격에는 이전 가격을 함께 표시해요.', 'C2 · 채팅방에 변경 알림을 시스템 메시지로 남겨 대화 중인 구매자가 바로 알 수 있어요.'] },
]

function Karrot({ c }: { c: Ctx }) {
  const { p, A, S, T } = c
  const I = (n: string) => `/images/karrot-large-furniture/${n}.webp`
  return (
    <>
      <Hero c={c} title="당근 대형 가구 중고거래" lead="채팅하기 전에 먼저 확인해야 할 정보" kicker="비공식 개인 UX 개선 제안 · 소속 회사와 무관 · 당근 SEED Design 공개 토큰 기반 · 상품 정보는 예시">
        <div className="flex items-end justify-center gap-5 md:gap-8"><div className="w-[44%] md:w-[42%]"><Screen src={I('f-b1')} alt="상품 상세: 거래 정보 영역" /></div><div className="w-[44%] md:w-[42%] md:mt-12"><Screen src={I('f-b3')} alt="질문 고르기 바텀시트" /></div></div>
      </Hero>

      <section aria-label="프로젝트 이해하기" className="wrap gutter pt-20 md:pt-28">
        <p className="eyebrow" style={{ color: S }}>이 프로젝트를 쉽게 이해하기</p>
        <h2 className="mt-3 apple-h text-[30px] md:text-[48px] max-w-[22ch]">구매자가 채팅 전에 알고 싶은 정보를 게시글에서 바로 확인하게 했어요</h2>

        <Reveal stagger className="mt-10 grid md:grid-cols-3 gap-3 md:gap-5">
          {[['01', '무엇을 개선했나요?', '당근에서 대형 가구를 사고팔 때 쓰는 판매글을 개선했어요. 크기·분해 여부·가져가는 조건처럼 구매자가 확인하고 싶은 정보를 판매글에서 쉽게 알 수 있게 했어요.'],
            ['02', '언제 문제가 생겼나요?', '구매자가 글을 읽고 ‘내가 사서 가져갈 수 있을까?’를 판단하는 순간이에요. 크기가 본문 문장 속에 섞여 있거나 층수·엘리베이터 정보가 없으면 글만으로는 판단하기 어려워요.'],
            ['03', '왜 문제로 봤나요?', '대형 가구는 크기와 운반 조건이 구매를 좌우해요. 정보를 찾지 못한 구매자는 채팅으로 같은 질문을 하게 되고 판매자도 같은 답을 반복해야 해요.']].map(([n, t, d]) => (
            <div key={n} className="rounded-[24px] bg-[#F7F8FA] p-6 md:p-7"><p className="text-[13px] font-bold" style={{ color: S }}>{n}</p><h3 className="mt-2 text-[20px] md:text-[22px] font-bold tracking-tight">{t}</h3><p className="mt-3 text-[16px] leading-[1.75] text-ink/80">{d}</p></div>
          ))}
        </Reveal>

        <div className="mt-6 md:mt-8 grid md:grid-cols-2 gap-4 md:gap-6">
          <div className="rounded-[24px] border border-grid p-6 md:p-8">
            <span className="inline-block px-3 py-1 rounded-full text-[13px] font-bold bg-[#e8e8e8]">기존</span>
            <ol aria-label="기존 흐름" className="mt-5 flex flex-wrap items-center gap-2 text-[15px]">
              <li className="px-4 py-2 rounded-full bg-[#f5f5f7]">판매글 읽기</li><li aria-hidden className="text-sub">→</li>
              <li className="px-4 py-2 rounded-full bg-[#f5f5f7] font-semibold">크기가 문장 속에 섞여 있음</li><li aria-hidden className="text-sub">→</li>
              <li className="px-4 py-2 rounded-full bg-[#fdeaea] text-[#a12a2a] font-semibold">채팅으로 같은 질문 반복</li>
            </ol>
            <p className="mt-4 text-[15px] leading-[1.7] text-sub">채팅을 시작해야 거래할 수 있는지 알 수 있어요.</p>
          </div>
          <div className="rounded-[24px] p-6 md:p-8" style={{ background: T(16), border: `1px solid ${T(36)}` }}>
            <span className="inline-block px-3 py-1 rounded-full text-[13px] font-bold" style={{ background: A, color: onBrand(A) }}>개선</span>
            <ol aria-label="개선 흐름" className="mt-5 flex flex-wrap items-center gap-2 text-[15px]">
              <li className="px-4 py-2 rounded-full bg-white">판매글 읽기</li><li aria-hidden className="text-sub">→</li>
              <li className="px-4 py-2 rounded-full font-semibold" style={{ background: A, color: onBrand(A) }}>거래 정보 카드로 한눈에 확인</li><li aria-hidden className="text-sub">→</li>
              <li className="px-4 py-2 rounded-full bg-white">궁금한 것만 질문 초안으로</li>
            </ol>
            <p className="mt-4 text-[15px] leading-[1.7] text-ink/80">크기·분해·가져가는 조건을 채팅 전에 보고 판단해요. 입력되지 않은 정보도 이유를 구분해서 알려줘요.</p>
          </div>
        </div>

        <div className="mt-6 md:mt-8 md:grid md:grid-cols-12 gap-8 items-center rounded-[28px] bg-[#F7F8FA] p-6 md:p-10">
          <div className="md:col-span-7">
            <p className="eyebrow text-sub">프로젝트의 핵심</p>
            <p className="mt-3 text-[24px] md:text-[34px] font-bold tracking-tight leading-snug">대형 가구에 대한 정보를 중심으로 구매자가 확인하고 싶은 내용을 게시글에서 쉽게 알 수 있게 한 UX 개선 프로젝트예요.</p>
            <p className="mt-4 text-[14px] leading-[1.7] text-sub">비공식 개인 UX 개선 제안이에요. 프로토타입 사용성 테스트(7명)에서는 거래 약속 확정이 빨라졌지만, 실제 서비스의 거래 성사율은 측정하지 않았어요.</p>
          </div>
          <div className="mt-8 md:mt-0 md:col-span-5 grid grid-cols-2 gap-4">
            <figure><p className="text-[13px] font-semibold text-sub mb-2">기존 · 상품 상세</p><Screen src={p.beforeAfter![0].before} alt={p.beforeAfter![0].beforeAlt} /></figure>
            <figure><p className="text-[13px] font-semibold mb-2" style={{ color: S }}>개선 · 상품 상세</p><Screen src={p.beforeAfter![0].after} alt={p.beforeAfter![0].afterAlt} /></figure>
          </div>
        </div>
      </section>

      <section id="c2" className="wrap gutter py-20 md:py-32 scroll-mt-20 md:mt-24">
        <ChapterHead color={S} n="01" label="Problem" title="대형 가구는 정보가 빠지면 판단이 멈춘다" />
        <Reveal><blockquote className="mt-10 text-[28px] md:text-[40px] font-bold tracking-tight leading-snug max-w-[26ch]" style={{ borderLeft: `6px solid ${A}`, paddingLeft: 24 }}>{p.problem}</blockquote></Reveal>
        <ul className="mt-12 grid md:grid-cols-3 gap-5">{[['크기', '가로·세로·높이를 설명에서 찾아야 함'], ['분해 · 운반', '분해 가능 여부와 가져가는 조건이 문장으로 흩어짐'], ['반복 질문', '판매자에게 같은 질문을 되풀이해야 할 수 있음']].map(([a, b]) => <li key={a} className="rounded-[20px] p-6" style={{ background: T(14) }}><p className="text-[13px] font-semibold" style={{ color: S }}>{a}</p><p className="mt-2 text-[17px] leading-snug">{b}</p></li>)}</ul>
        <div className="mt-14"><p className="eyebrow text-sub">실제 당근 앱 · AS-IS 캡처</p>
          <ul className="mt-5 grid grid-cols-3 gap-4 md:grid-cols-5 md:gap-6 max-w-5xl">{[['asis-write', '판매글 작성: 제목·설명·가격만 입력'], ['asis-write-ai', '사진 분석 중(AI 작성)'], ['asis-search', '대형가구 검색 결과'], ['asis-desc', '상품 본문: 크기가 문장 속에'], ['asis-loc', '거래 장소·용달비 안내']].map(([n, l]) => <li key={n}><Fig src={I(n)} alt={`실제 당근 앱 ${l}`} cap={l} /></li>)}</ul>
          <p className="mt-4 text-[13px] text-sub max-w-3xl">실제 앱 화면 캡처이며 판매자 닉네임, 거래 장소 주소·지도, 캡처한 사람의 정보는 가렸습니다. 판매글 작성 화면 두 장은 동네 이름과 거래 희망 장소를 가리지 않았습니다.</p></div>
        <p className="mt-10 text-[13px] text-sub max-w-3xl">앱 리뷰·블로그 VOC와 인터뷰를 근거로 PRD 문제를 정의했습니다. 원자료가 없어 표본 수와 수치는 싣지 않았고, 발생 빈도와 영향은 사용성 테스트로 검증해야 하는 디자인 가설입니다.</p>
      </section>

      <section id="c3" className="scroll-mt-20 md:mt-24" style={{ background: '#F7F8FA' }}>
        <div className="wrap gutter py-20 md:py-32">
          <ChapterHead color={S} n="02" label="Solutions" title="있는 정보, 없는 정보, 모르는 정보를 나눠 보여준다" />
          <div className="mt-14 md:grid md:grid-cols-12 gap-10 items-start">
            <div className="md:col-span-5"><Num n="01" t="상태를 네 가지로 구분" />
              <table className="mt-8 w-full text-[16px] bg-white rounded-[20px] overflow-hidden"><caption className="sr-only">정보 상태별 표시 원칙</caption><tbody>{[['입력 완료', '입력된 값 표시'], ['미입력', '아직 입력되지 않았어요'], ['모름', '판매자도 확인하지 못했어요'], ['조회 실패', '정보를 불러오지 못했어요']].map(([a, b]) => <tr key={a} className="border-t border-grid first:border-0"><th scope="row" className="py-3 pl-5 pr-3 text-left font-semibold whitespace-nowrap">{a}</th><td className="py-3 pr-5 text-sub">{b}</td></tr>)}</tbody></table>
              <p className="mt-4 text-[16px] leading-relaxed text-sub">엘리베이터가 있다는 이유로 운반 가능하다고 단정하지 않습니다.</p></div>
            <div className="mt-10 md:mt-0 md:col-span-7 grid grid-cols-2 gap-6"><Fig src={I('L-b2')} alt="미입력과 모름을 구분한 상세" cap="일부 입력 · 미입력/모름 구분(스크롤)" /><Fig src={I('L-e1')} alt="정보 조회 실패 화면" cap="조회 실패 · 재시도" className="md:mt-12" /></div>
          </div>


          <Reveal className="mt-20 md:mt-24 md:grid md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-5 md:order-2"><Num n="02" t="분해 가능과 전달 상태를 분리" />
              <ul className="mt-8 space-y-5"><Ann color={A} n="A" t="분해 가능 · 분해 불가 · 잘 모르겠어요" d="‘분해 가능’을 고른 경우에만 전달 상태를 묻습니다." /><Ann color={A} n="B" t="조립된 상태 · 분해된 상태 · 협의" d="‘분해 가능’이 실제 전달 상태와 혼동되지 않게 했습니다." /><Ann color={A} n="C" t="큰 크기 값은 막지 않고 재확인" d="0 이하만 거절하고, 비정상적으로 큰 값은 다시 확인하게 합니다." /></ul></div>
            <div className="mt-10 md:mt-0 md:col-span-7 grid grid-cols-2 gap-6 md:order-1"><Fig src={I('L-s3')} alt="가구 정보 입력" cap="가구 정보 입력 · 분해 가능과 전달 상태" /><Fig src={I('L-s5')} alt="큰 값 재확인" cap="큰 값 재확인(스크롤)" className="md:mt-12" /></div>
          </Reveal>


          <Reveal className="mt-20 md:mt-24 md:grid md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-5"><Num n="03" t="질문은 초안으로만, 보내는 건 사용자" />
              <ul className="mt-8 space-y-5"><Ann color={A} n="A" t="궁금한 항목만 골라 채팅 초안 생성" /><Ann color={A} n="B" t="자동 전송하지 않고 기존 입력을 보존" d="사용자가 고치고 직접 보냅니다." /><Ann color={A} n="C" t="정보가 바뀌면 변경 항목만 비교" d="이전 값이 실제로 있을 때만 전후를 보여줍니다." /></ul></div>
            <div className="mt-10 md:mt-0 md:col-span-7 grid grid-cols-3 gap-4 md:gap-6"><Fig src={I('f-b3')} alt="질문 고르기" cap="질문 고르기" /><Fig src={I('f-b4')} alt="채팅 질문 초안" cap="채팅 초안" className="md:mt-10" /><Fig src={I('f-c4')} alt="변경 내용 비교" cap="변경 비교" /></div>
          </Reveal>
        </div>
      </section>

      {/* Design Decision: 정보를 확인하는 시점의 변화 */}
      <section id="dd" className="wrap gutter py-20 md:py-32 scroll-mt-20">
        <p className="eyebrow rule pt-4" style={{ color: S, borderColor: T(40) }}>DESIGN DECISION</p>
        <h2 className="mt-4 apple-h text-[30px] md:text-[52px] max-w-[22ch]">채팅에서 물어봐야 했던 정보를,<br />채팅 전에 확인할 수 있도록.</h2>
        <div className="mt-10 md:grid md:grid-cols-12 gap-10 items-start">
          <div className="md:col-span-5">
            <p className="text-[17px] leading-[1.8]">기존 거래 과정에서는 구매자가 대형가구의 상세 정보, 거래 가능 여부, 거래 방법을 채팅으로 추가 확인해야 했습니다.</p>
            <p className="mt-3 text-[17px] leading-[1.8]">이에 거래 전에 필요한 정보를 게시글에서 먼저 확인할 수 있도록 정보 구조를 개선했습니다.</p>
            <ul className="mt-8 space-y-5">
              <Ann color={A} n="1" t="상세 상품 정보" d="‘크기 및 분해’ 카드에 가로·세로·높이와 분해 여부, 전달 상태를 보여줘요." />
              <Ann color={A} n="2" t="거래 진행 방법" d="‘가져가는 조건’ 카드에 층수·엘리베이터·운반 도움을 보여줘요." />
              <Ann color={A} n="3" t="거래 가능 여부" d="예약중·거래완료 상태를 배지와 버튼에 표시해요." />
            </ul>
            <p className="mt-10 rounded-[20px] px-6 py-5 text-[18px] md:text-[22px] font-bold leading-snug tracking-tight max-w-[40ch]" style={{ background: T(14) }}>정보를 더 많이 보여주는 것이 아니라, 사용자가 정보를 필요로 하는 시점을 바꾸는 데 집중했습니다.</p>
          </div>
          <div className="mt-12 md:mt-0 md:col-span-7 grid grid-cols-3 gap-3 md:gap-6">
            <figure><p className="mb-2 text-[13px] font-bold text-sub">AS-IS · 기존 게시글</p><Screen src={I('asis-desc')} alt="기존 당근 상품 상세 본문: 크기와 분해 정보가 문장 속에 섞여 있음" cap="기존 게시글" /></figure>
            <figure className="mt-6 md:mt-10"><p className="mb-2 text-[13px] font-bold" style={{ color: S }}>TO-BE · 정보 카드</p><Screen src={I('L-b1')} alt="개선 상품 상세: 크기 및 분해, 가져가는 조건 카드" cap="크기·분해·가져가는 조건" /></figure>
            <figure><p className="mb-2 text-[13px] font-bold" style={{ color: S }}>TO-BE · 거래 상태</p><Screen src={I('f-done')} alt="개선 상품 상세: 거래완료 안내와 비활성 버튼" cap="거래 상태 표시" /></figure>
          </div>
        </div>
      </section>

      {/* Flow: AS-IS / TO-BE */}
      <section id="flow" className="scroll-mt-20" style={{ background: '#F7F8FA' }}>
        <div className="wrap gutter py-20 md:py-32">
          <p className="eyebrow rule pt-4" style={{ color: S, borderColor: T(40) }}>BEFORE &amp; AFTER</p>
          <h2 className="mt-4 apple-h text-[30px] md:text-[52px] max-w-[24ch]">상품 정보 확인에 쓰이던 채팅을,<br />거래 약속 조율에 집중하도록.</h2>
          <div className="mt-12 grid md:grid-cols-2 gap-4 md:gap-8">
            <div className="rounded-[28px] bg-white border border-grid p-5 md:p-8">
              <span className="inline-block px-3 py-1 rounded-full text-[13px] font-bold bg-[#e8e8e8]">AS-IS · 기존 앱</span>
              <ol aria-label="기존 거래 과정" className="mt-6">
                {[['게시글 확인', false], ['채팅 시작', false], ['가구 상세 정보 질문', true], ['거래 가능 여부 확인', true], ['거래 방법 질문', true], ['거래 약속 조율 및 확정', false]].map(([t, ask], i, a) => (
                  <li key={String(t)}>
                    <div className="flex items-center gap-3 rounded-[16px] border px-4 py-3 text-[16px]" style={ask ? { background: '#FDEAEA', borderColor: '#F2BDBD', color: '#7A1F1F', fontWeight: 600 } : { background: '#fff', borderColor: '#E5E5E7' }}>
                      <span className="text-[13px] font-bold tabular-nums opacity-60">0{i + 1}</span><span className="flex-1">{t}</span>
                      {ask ? <span className="text-[13px] font-bold rounded-full px-2 py-0.5 bg-white/80">채팅에서 확인</span> : null}
                    </div>
                    {i < a.length - 1 && <p aria-hidden className="my-1 text-center text-[18px] leading-none text-sub">↓</p>}
                  </li>
                ))}
              </ol>
              <p className="mt-5 text-[14px] leading-relaxed text-sub">상세 정보·거래 가능 여부·거래 방법을 채팅으로 물은 뒤에야 약속을 조율했어요.</p>
            </div>
            <div className="rounded-[28px] p-5 md:p-8" style={{ background: T(14), border: `1px solid ${T(36)}` }}>
              <span className="inline-block px-3 py-1 rounded-full text-[13px] font-bold" style={{ background: A, color: onBrand(A) }}>TO-BE · 개선 프로토타입</span>
              <ol aria-label="개선된 거래 과정" className="mt-6">
                <li><div className="rounded-[16px] border bg-white px-4 py-3 text-[16px]" style={{ borderColor: T(36) }}><span className="text-[13px] font-bold tabular-nums opacity-60 mr-3">01</span>개선 게시글 확인</div></li>
                <li aria-hidden className="my-1 text-center text-[18px] leading-none text-sub">↓</li>
                <li><div className="rounded-[16px] p-3" style={{ background: '#fff', border: `2px solid ${A}` }}>
                  <p className="px-1 text-[16px] font-bold"><span className="text-[13px] tabular-nums opacity-60 mr-3">02</span>게시글에서 한 번에 확인</p>
                  <ul className="mt-3 grid grid-cols-3 gap-2 text-[14px] font-semibold text-center">{['상세 정보', '거래 가능 여부', '거래 방법'].map(t => <li key={t} className="rounded-[12px] px-2 py-3" style={{ background: T(16) }}>{t}</li>)}</ul>
                </div></li>
                <li aria-hidden className="my-1 text-center text-[18px] leading-none text-sub">↓</li>
                <li><div className="rounded-[16px] border bg-white px-4 py-3 text-[16px]" style={{ borderColor: T(36) }}><span className="text-[13px] font-bold tabular-nums opacity-60 mr-3">03</span>채팅 시작</div></li>
                <li aria-hidden className="my-1 text-center text-[18px] leading-none text-sub">↓</li>
                <li><div className="rounded-[16px] border bg-white px-4 py-3 text-[16px] font-semibold" style={{ borderColor: T(36) }}><span className="text-[13px] font-bold tabular-nums opacity-60 mr-3">04</span>거래 약속 조율 및 확정</div></li>
              </ol>
              <p className="mt-5 text-[14px] leading-relaxed text-ink/80">채팅 전에 정보를 확인하고, 채팅에서는 약속 조율에 집중해요.</p>
            </div>
          </div>
          <p className="mt-6 text-[13px] text-sub max-w-3xl">테스트에서 확인한 대표적인 거래 흐름을 설명하는 그림이에요. 참가자별 채팅 횟수나 질문 개수는 측정하지 않았습니다.</p>
        </div>
      </section>

      {/* Usability Test + Key Results */}
      <section id="test" className="wrap gutter py-20 md:py-32 scroll-mt-20">
        <p className="eyebrow rule pt-4" style={{ color: S, borderColor: T(40) }}>USABILITY TEST / AS-IS vs. TO-BE</p>
        <h2 className="mt-4 apple-h text-[30px] md:text-[52px] max-w-[24ch]">채팅 전에 거래 정보를 확인하자,<br />약속 확정까지 평균 41초 빨라졌습니다.</h2>
        <div className="mt-10 md:grid md:grid-cols-12 gap-10">
          <div className="md:col-span-7 text-[17px] leading-[1.8] space-y-3">
            <p>대형가구 거래에서 구매자가 게시글을 확인한 뒤 채팅으로 거래 약속을 확정하기까지의 과정을 비교했습니다.</p>
            <p>동일한 참가자 7명이 기존 당근 앱(AS-IS)과 개선 프로토타입(TO-BE)에서 같은 과제를 수행했습니다.</p>
            <p>7명 모두 TO-BE에서 더 빠르게 거래 약속을 확정했으며, 평균 소요 시간은 AS-IS보다 41초 짧게 측정됐습니다.</p>
          </div>
          <dl className="mt-8 md:mt-0 md:col-span-5 rounded-[24px] border border-grid p-6 text-[15px] grid grid-cols-[auto_1fr] gap-x-5 gap-y-3 content-start">
            {[['Method', '동일 참가자 비교 사용성 테스트'], ['Participants', '7명'], ['Comparison', '기존 앱 AS-IS / 개선 프로토타입 TO-BE'], ['Task', '게시글 확인부터 채팅을 통한 거래 약속 확정까지'], ['Environment', '프로토타입 테스트']].map(([k, v]) => <div key={k} className="contents"><dt className="text-sub text-[13px] pt-0.5">{k}</dt><dd className="font-semibold">{v}</dd></div>)}
          </dl>
        </div>

        <Reveal className="mt-16 md:mt-24">
          <div className="rounded-[32px] p-7 md:p-14 text-center md:text-left" style={{ background: '#17120F', color: '#fff' }} role="group" aria-label="사용성 테스트 핵심 결과: 평균 41초 단축, 7명 중 7명 단축">
            <div className="md:grid md:grid-cols-12 gap-10 items-end">
            <div className="md:col-span-7">
              <p className="text-[13px] font-bold tracking-[.14em]" style={{ color: '#FFB78A' }}>RESULT 01 · AVERAGE TIME DIFFERENCE</p>
              <p className="mt-4 font-extrabold leading-[.9] tracking-[-.06em] text-[clamp(88px,17vw,196px)]">−41<span className="text-[.42em] tracking-[-.03em] ml-1" style={{ color: '#FF8A3D' }}>초</span></p>
              <p className="mt-5 text-[18px] md:text-[22px] font-bold">거래 약속 확정까지의 평균 소요 시간 차이</p>
              <p className="mt-2 text-[15px] text-white/70">TO-BE에서 AS-IS보다 평균 41초 짧게 측정</p>
            </div>
            <div className="mt-10 md:mt-0 md:col-span-5 pt-8 md:pt-0 md:pl-10 border-t md:border-t-0 md:border-l border-white/20">
              <p className="text-[13px] font-bold tracking-[.14em]" style={{ color: '#FFB78A' }}>RESULT 02 · PARTICIPANT IMPROVEMENT</p>
              <p className="mt-4 font-extrabold leading-[.95] tracking-[-.05em] text-[clamp(60px,10vw,112px)]">7/7<span className="text-[.42em] tracking-[-.03em] ml-1" style={{ color: '#FF8A3D' }}>명</span></p>
              <p className="mt-4 text-[17px] md:text-[19px] font-bold">모든 참가자가 TO-BE에서 소요 시간 단축</p>
              <p className="mt-2 text-[15px] text-white/70">동일한 7명이 두 조건을 모두 수행한 비교 결과</p>
            </div>
            </div>
            <p className="mt-10 pt-5 border-t border-white/20 text-[13px] text-white/65 text-left">측정 조건 · 동일 참가자 7명 · 프로토타입 테스트 · 게시글 확인부터 채팅을 통한 거래 약속 확정까지의 소요 시간</p>
          </div>
        </Reveal>
      </section>

      {/* Feedback + Interpretation */}
      <section id="feedback" className="scroll-mt-20" style={{ background: '#F7F8FA' }}>
        <div className="wrap gutter py-20 md:py-32">
          <p className="eyebrow rule pt-4" style={{ color: S, borderColor: T(40) }}>USER FEEDBACK</p>
          <h2 className="mt-4 apple-h text-[30px] md:text-[52px] max-w-[24ch]">채팅에서는 상품 질문보다,<br />거래 약속 조율에 집중할 수 있었습니다.</h2>
          <p className="mt-8 max-w-[58ch] text-[17px] leading-[1.8]">참가자들은 개선된 게시글에서 필요한 가구 정보와 거래 조건을 미리 확인할 수 있어, 채팅에서는 추가적인 상품 정보 질문보다 거래 약속 조율에 집중할 수 있었다고 피드백했습니다.</p>
          <ol className="mt-10 grid md:grid-cols-3 gap-4 md:gap-6">
            {[['01', '거래 전에 필요한 정보 확인'], ['02', '추가적인 상품 정보 질문의 필요성 감소'], ['03', '채팅에서 거래 약속 조율에 집중']].map(([n, t]) => (
              <li key={n} className="rounded-[24px] bg-white border border-grid p-6"><span className="text-[40px] font-extrabold leading-none num-brand">{n}</span><p className="mt-4 text-[19px] font-bold leading-snug">{t}</p></li>
            ))}
          </ol>
          <p className="mt-5 text-[13px] text-sub">참가자 피드백을 요약한 내용이에요. 직접 인용문이 아닙니다.</p>

          <div className="mt-24 md:mt-32">
            <p className="eyebrow rule pt-4" style={{ color: S, borderColor: T(40) }}>RESULT INTERPRETATION</p>
            <h2 className="mt-4 apple-h text-[30px] md:text-[52px] max-w-[24ch]">정보를 확인하는 시점의 변화가,<br />거래 약속 확정 과정을 단축했습니다.</h2>
            <div className="mt-8 md:grid md:grid-cols-12 gap-10">
              <div className="md:col-span-7 text-[17px] leading-[1.8] space-y-3">
                <p>게시글에서 거래 정보를 미리 확인할 수 있도록 개선한 프로토타입에서 참가자 7명 모두 거래 약속을 더 빠르게 확정했습니다.</p>
                <p>이번 결과는 거래 전에 필요한 정보를 제공하는 설계가 채팅에서의 반복적인 확인 부담을 줄이고, 거래 약속 조율을 효율적으로 진행하는 데 도움이 될 가능성을 보여줍니다.</p>
              </div>
              <div className="mt-8 md:mt-0 md:col-span-5 rounded-[24px] bg-white border border-grid p-6">
                <p className="text-[13px] font-bold text-sub">Limitations</p>
                <ul className="mt-4 space-y-3 text-[16px] leading-snug">{['참가자 7명의 소규모 테스트', '프로토타입 환경에서 측정한 결과', '테스트 순서에 따른 학습 효과 가능성', '실제 서비스의 거래 성사율 및 운영 성과 미검증'].map(t => <li key={t} className="flex gap-3"><span aria-hidden className="text-sub">–</span>{t}</li>)}</ul>
              </div>
            </div>
            <p className="mt-6 text-[13px] text-sub max-w-3xl">이 결과는 프로토타입 과제에서 측정한 시간이에요. 실제 서비스 전체의 거래 시간이 41초 단축됐다는 뜻이 아닙니다.</p>
          </div>
        </div>
      </section>

      <section aria-label="기존 앱과 개선안 비교" className="wrap gutter pb-8 md:pb-16">
        <p className="eyebrow rule pt-4 text-sub">Before / After</p>
        <h3 className="mt-4 text-[28px] md:text-[40px] font-bold tracking-tight">실제 당근 앱 vs 대형 가구 거래 개선안</h3>
        <p className="mt-3 text-[16px] text-sub max-w-[62ch]">같은 장면의 현재 화면(BEFORE)과 개선안(AFTER)을 나란히 놓았어요. 빨간 박스와 번호가 기존 앱의 문제 위치이고 오른쪽 표에서 번호별로 설명해요.</p>
        <div className="mt-10 space-y-6 md:space-y-10">{karrotCompare.map(d => <CompareSection key={d.n} d={d} color={A} />)}</div>
        <p className="mt-6 text-[13px] text-sub max-w-3xl">※ Before는 유아이볼(uibowl.io)에 수집된 실제 당근 앱 화면이에요. After는 제가 설계한 개선안으로 상품 정보는 예시예요.</p>
      </section>

      <section id="c4" className="wrap gutter py-20 md:py-32 scroll-mt-20 md:mt-24">
        <ChapterHead color={S} n="03" label="Actual UI" title="판매자 입력 → 구매자 확인 → 정보 변경" />
        <div className="mt-14"><PinnedPhone color={S} label="당근 화면 둘러보기" steps={(p.gallery ?? []).map(g => ({ src: g.src, alt: g.alt, title: g.caption ?? g.alt, body: g.alt }))} /></div>
        <p className="mt-8 max-w-3xl text-[17px] leading-[1.8]">예외 상태(조회 실패와 재시도, 거래 완료)까지 포함한 20개 화면을 클릭형 프로토타입으로 구현했습니다.</p>
        <InteractionPreview p={p} wide={c.wide} onOpen={() => c.setOpen(true)} title="입력부터 질문 초안까지" />
      </section>

      <Outcome c={c} cards={<><div className="rounded-[20px] bg-[#F7F8FA] p-6"><p className="text-[14px] text-sub">확인된 것</p><p className="mt-2 text-[18px] font-bold">프로토타입 테스트 7명 전원, 거래 약속 확정이 평균 41초 빨라짐</p></div><div className="rounded-[20px] p-6" style={{ background: T(14) }}><p className="text-[14px] text-sub">아직 필요한 것</p><p className="mt-2 text-[18px] font-bold">더 큰 표본과 실제 서비스 환경에서의 검증</p></div></>}>
        <div className="pt-6 rule"><p className="eyebrow text-sub">Next</p><ul className="mt-4 list-disc space-y-2 pl-5 text-[16px] leading-relaxed"><li>판매자 입력 부담과 정보 변경 흐름은 이번 테스트에 포함되지 않았어요</li><li>더 많은 참가자와 순서를 섞은 비교로 학습 효과 줄이기</li><li>실제 서비스 환경에서 거래 성사율과 채팅 흐름 확인</li></ul></div>
      </Outcome>
    </>
  )
}

// ── 우리사이: 콘텐츠 에디토리얼 ─────────────────────────────
const survey: [string, [string, number][]][] = [
  ['추억 만들기·기록', [['쉽고 편리했다', 5], ['보통', 2]]],
  ['여러 친구가 함께 사진·이야기 추가', [['유용하고 매력적', 4], ['보통', 2], ['서술', 1]]],
  ['약속·일정 확인', [['쉽고 편리했다', 4], ['보통', 1], ['체험하지 못함', 1], ['서술', 1]]],
  ['발자국(지역별 추억 찾기)', [['직관적이고 흥미로움', 5], ['보통', 1], ['서술', 1]]],
  ['지난 추억 회상', [['다시 사용하고 싶음', 2], ['보통', 3], ['체험하지 못함', 1], ['서술', 1]]],
]
function Woorisai({ c }: { c: Ctx }) {
  const { p, A, S, T } = c
  const I = (n: string) => `/images/woorisai/${n}.webp`
  const col = [A, tintOf(A, 45), '#d9d9d9', '#ececec']
  const Need = ({ t }: { t: string }) => <p className="rounded-[16px] border border-dashed border-grid p-4 text-[14px] text-sub">[추가 자료 필요] {t}</p>
  return (
    <>
      <section id="c1" className="overflow-hidden" style={{ background: '#FAF9F6' }}>
        <div className="wrap gutter pt-10 md:pt-16 pb-14 md:pb-20">
          <Link to="/#work" className="inline-block py-2 text-[14px] text-sub hover:text-blue">← 프로젝트 목록</Link>
          <div className="mt-6 md:grid md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-6">
              <AppIcon src="/images/woorisai/icon.svg" name={p.name} className="mb-5" />
              <p className="eyebrow" style={{ color: S }}>Personal Case Study · {p.category}</p>
              <h1 className="text-[54px] md:text-[126px] font-extrabold tracking-[-0.05em]" style={{ lineHeight: 1, marginTop: 'calc(1rem + .2em)', color: '#242622' }}>우리사이</h1>
              <p className="mt-4 text-[22px] md:text-[28px] font-semibold leading-snug max-w-[24ch]">흩어진 사진과 기억을 하나의 추억으로 연결하고, 기록이 다시 대화로 이어지는 경험을 설계했습니다.</p>
              <dl className="mt-8 grid grid-cols-3 gap-5 text-[14px] rule pt-4" style={{ borderColor: T(40) }}>
                <div><dt className="text-sub text-[13px]">담당</dt><dd className="mt-1">{owner}</dd></div><div><dt className="text-sub text-[13px]">역할</dt><dd className="mt-1">{p.role}</dd></div><div><dt className="text-sub text-[13px]">기간</dt><dd className="mt-1">{p.period}</dd></div>
              </dl>
              {c.proto && <button onClick={() => c.setOpen(true)} className="mt-8 px-6 py-3 rounded-full bg-ink text-white text-[16px] font-semibold">프로토타입 실행</button>}
            </div>
            <ul data-scale className="mt-12 md:mt-0 md:col-span-6 flex items-end justify-center gap-4 md:gap-6">
              {[['feed', '추억 피드', 'w-[28%]'], ['ph-after-top', '사진 상세', 'w-[34%]'], ['foot-after', '발자국', 'w-[28%]']].map(([n, a, w], i) => <li key={n} className={`${w} ${i !== 1 ? 'md:translate-y-8' : ''}`}><Screen src={I(n)} alt={`우리사이 ${a} 화면`} cap={a} /></li>)}
            </ul>
          </div>
        </div>
      </section>
      <p className="wrap gutter pt-8 text-[13px] text-sub text-center">실제 프로토타입 화면 캡처 · 사진은 Unsplash 예시 이미지, 이름과 내용은 예시 데이터</p>
      <CaseSummary p={p} />

      <section aria-label="프로젝트 이해하기" className="wrap gutter pt-20 md:pt-28">
        <p className="eyebrow" style={{ color: S }}>이 서비스를 쉽게 이해하기</p>
        <h2 className="mt-3 apple-h text-[30px] md:text-[48px] max-w-[22ch]">모임을 관리하는 앱이 아니라 추억을 남기고 다시 꺼내보는 앱이에요</h2>

        <Reveal stagger className="mt-10 grid md:grid-cols-3 gap-3 md:gap-5">
          {[['01', '우리사이는 어떤 서비스인가요?', '친구들과 약속을 잡고 그날 있었던 일을 사진과 이야기로 남기는 추억 아카이빙 서비스예요. 함께한 사람만 초대해서 하나의 추억을 같이 완성해요.'],
            ['02', '다른 모임 앱과 무엇이 다른가요?', '모임 앱은 일정과 멤버를 관리하는 데 집중해요. 우리사이는 관리가 아니라 지난 추억을 중심에 두고 친구와 이야기를 이어가는 데 집중해요.'],
            ['03', '어떻게 상호작용하나요?', '지난 추억을 다시 보다가 사진마다 바로 반응하고 댓글을 남겨요. 기록이 다시 친구와의 대화로 이어져요.']].map(([n, t, d]) => (
            <div key={n} className="rounded-[24px] p-6 md:p-7" style={{ background: T(14) }}><p className="text-[13px] font-bold" style={{ color: S }}>{n}</p><h3 className="mt-2 text-[20px] md:text-[22px] font-bold tracking-tight">{t}</h3><p className="mt-3 text-[16px] leading-[1.75] text-ink/80">{d}</p></div>
          ))}
        </Reveal>

        <div className="mt-6 md:mt-8 grid md:grid-cols-2 gap-4 md:gap-6">
          <div className="rounded-[24px] border border-grid p-6 md:p-8">
            <span className="inline-block px-3 py-1 rounded-full text-[13px] font-bold bg-[#e8e8e8]">모임 관리 앱</span>
            <ol aria-label="모임 관리 앱의 흐름" className="mt-5 flex flex-wrap items-center gap-2 text-[15px]">
              <li className="px-4 py-2 rounded-full bg-[#f5f5f7]">모임 만들기</li><li aria-hidden className="text-sub">→</li>
              <li className="px-4 py-2 rounded-full bg-[#f5f5f7]">멤버·일정 관리</li><li aria-hidden className="text-sub">→</li>
              <li className="px-4 py-2 rounded-full bg-[#f5f5f7] font-semibold">모임이 끝나면 끝</li>
            </ol>
            <p className="mt-4 text-[15px] leading-[1.7] text-sub">모임을 운영하는 일이 중심이라 지나간 날의 이야기는 남지 않아요.</p>
          </div>
          <div className="rounded-[24px] p-6 md:p-8" style={{ background: T(16), border: `1px solid ${T(36)}` }}>
            <span className="inline-block px-3 py-1 rounded-full text-[13px] font-bold" style={{ background: A, color: onBrand(A) }}>우리사이</span>
            <ol aria-label="우리사이의 흐름" className="mt-5 flex flex-wrap items-center gap-2 text-[15px]">
              <li className="px-4 py-2 rounded-full bg-white">친구와 약속</li><li aria-hidden className="text-sub">→</li>
              <li className="px-4 py-2 rounded-full bg-white">그날의 추억 남기기</li><li aria-hidden className="text-sub">→</li>
              <li className="px-4 py-2 rounded-full font-semibold" style={{ background: A, color: onBrand(A) }}>다시 꺼내보기</li><li aria-hidden className="text-sub">→</li>
              <li className="px-4 py-2 rounded-full bg-white">사진마다 반응·대화</li>
            </ol>
            <p className="mt-4 text-[15px] leading-[1.7] text-ink/80">약속은 추억을 만드는 계기예요. 쌓인 추억을 다시 보면서 친구와 이야기를 이어가는 것이 서비스의 중심이에요.</p>
          </div>
        </div>
      </section>


      <section className="wrap gutter py-16 md:py-24 md:grid md:grid-cols-12 gap-10">
        <div className="md:col-span-4"><p className="eyebrow text-sub">Overview</p><h2 className="mt-3 text-[28px] md:text-[36px] font-extrabold tracking-tight leading-tight">함께한 사람만 초대해, 하나의 추억을 같이 완성한다</h2></div>
        <div className="mt-6 md:mt-0 md:col-span-8 text-[17px] leading-[1.8] space-y-4">{c.body('overview').map(t => <p key={t}>{t}</p>)}</div>
      </section>

      <section id="c2" className="scroll-mt-20 md:mt-8" style={{ background: '#F4F2EC' }}>
        <div className="wrap gutter py-20 md:py-28">
          <ChapterHead color={S} n="01" label="Problem" title="친구와 보낸 하루가 여러 앱에 흩어진다" />
          <p className="mt-6 max-w-[60ch] text-[18px] leading-[1.8]">친구와 약속을 잡고 만나서 사진을 찍고 비용을 나누고 나중에 그날을 떠올릴 때까지 사람들은 서로 다른 앱과 기능을 오가요. 그래서 하루의 사진과 이야기가 한곳에 남지 않아요.</p>

          <ol aria-label="친구와의 하루에서 쓰는 앱" className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {[['01', '약속 잡기', '메신저', '대화방에서 일정과 장소를 정해요'], ['02', '사진 공유', '각자의 갤러리', '사진이 각자의 휴대폰에 따로 남아요'], ['03', '정산', '정산 앱', '비용은 또 다른 앱에서 나눠요'], ['04', '추억 회상', '사진 앱', '나중에 그날을 사진 앱에서 찾아야 해요']].map(([n, t, app, d]) => (
              <li key={n} className="rounded-[24px] bg-white border border-grid p-6 flex flex-col">
                <span className="text-[13px] font-bold" style={{ color: S }}>{n}</span>
                <p className="mt-2 text-[22px] font-bold tracking-tight">{t}</p>
                <p className="mt-4 inline-flex w-fit px-3 py-1.5 rounded-full text-[14px] font-semibold" style={{ background: T(16) }}>{app}</p>
                <p className="mt-4 text-[15px] leading-[1.65] text-ink/75">{d}</p>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-[14px] text-sub max-w-[60ch]">※ 이 흐름은 PRD에서 세운 문제 가설이에요. 검증된 사용자 문제가 아니에요.</p>

          <div className="mt-16 rounded-[28px] p-7 md:p-12" style={{ background: T(16), border: `1px solid ${T(36)}` }}>
            <p className="eyebrow" style={{ color: S }}>그래서 잡은 컨셉</p>
            <h3 className="mt-3 text-[28px] md:text-[44px] font-extrabold tracking-tight max-w-[22ch]">흩어진 하루를 한곳에 남기는 ‘추억 아카이빙 서비스’</h3>
            <p className="mt-5 max-w-[56ch] text-[17px] leading-[1.8] text-ink/80">약속부터 사진 공유와 정산 그리고 추억 회상까지 따로 쓰던 흐름을 우리사이 하나로 이었어요. 모임을 관리하는 앱이 아니라 지난 추억을 다시 꺼내며 친구와 이야기하는 데 집중해요.</p>
            <ol aria-label="문제와 해결의 연결" className="mt-8 grid md:grid-cols-2 gap-3">
              {[['약속은 메신저에서', '약속은 추억을 만드는 계기로 두고 약속에서 바로 추억을 만들 수 있어요.'], ['사진은 각자의 갤러리에', '함께한 사람이 사진과 이야기를 한 추억에 같이 모아요.'], ['정산은 정산 앱에서', '약속·정산은 추억을 돕는 보조 기능으로 둬요.'], ['추억은 사진 앱에서 찾기', '사람·장소·시간으로 다시 찾고 사진마다 반응과 댓글로 이야기를 이어가요.']].map(([p, r]) => (
                <li key={p} className="rounded-[18px] bg-white p-5 md:flex md:items-center">
                  <p className="text-[15px] font-semibold text-sub shrink-0">{p}</p><span aria-hidden className="hidden md:block flex-1 text-center text-[20px]" style={{ color: S }}>→</span>
                  <p className="mt-2 md:mt-0 text-[15px] leading-[1.6] md:w-[56%] md:shrink-0">{r}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-20">
            <p className="eyebrow text-sub">Design Strategy</p>
            <h3 className="mt-3 text-[28px] md:text-[36px] font-extrabold tracking-tight">기록 → 함께 쌓기 → 다시 발견하기 → 대화로 이어지기</h3>
            <ol className="mt-8 grid md:grid-cols-4 gap-4">{[['기록', '추억 하나부터 가볍게 시작'], ['함께 쌓기', '참여자별 사진과 이야기를 한 추억에'], ['다시 발견하기', '사람·장소·시간으로 되찾기'], ['대화로 이어지기', '사진 단위 반응과 댓글']].map(([t, d], i) => <li key={t} className="rounded-[20px] bg-white border border-grid p-5"><span className="text-[24px] font-extrabold" style={{ color: S }}>0{i + 1}</span><p className="mt-2 text-[18px] font-bold">{t}</p><p className="mt-1 text-[14px] text-sub leading-snug">{d}</p></li>)}</ol>
          </div>

          <div className="relative mt-16 rounded-[24px] bg-white border border-grid p-6 md:p-8">
            <div className="md:pr-52 max-w-[820px]">
              <p className="eyebrow text-sub">프로토타입 설문 · 응답 7명 (2026.11.12-16)</p>
              <p className="mt-3 text-[22px] md:text-[26px] font-bold tracking-tight">만든 프로토타입을 써 본 사람들의 의견으로 앱을 계속 고쳤어요</p>
              <p className="mt-3 text-[15px] leading-[1.7] text-ink/75">직접 만든 프로토타입을 사용해 본 7명에게 설문을 받았고 초대와 기능 이동처럼 막히는 부분을 확인해 화면을 개선해 나갔어요. 20대 여성 중심의 소규모 표본이라 방향을 확인하는 데만 썼어요.</p>
            </div>
            <details className="mt-5 md:mt-0 md:static group">
              <summary className="cursor-pointer list-none inline-flex items-center min-h-[44px] px-4 rounded-full border border-grid text-[14px] font-semibold md:absolute md:top-6 md:right-8 bg-white">설문 결과 보기</summary>
              <div className="mt-6 grid md:grid-cols-2 gap-x-10 gap-y-5">
                {survey.map(([q, seg]) => <div key={q}><p className="text-[14px] font-semibold">{q}</p><div role="img" aria-label={seg.map(([l, n]) => `${l} ${n}명`).join(', ')} className="mt-2 flex h-2.5 rounded-full overflow-hidden gap-[2px]">{seg.map(([l, n], i) => <span key={l} style={{ flex: n, background: col[i] }} />)}</div><p className="mt-1.5 text-[13px] text-sub">{seg.map(([l, n]) => `${l} ${n}`).join(' · ')}</p></div>)}
              </div>
            </details>
          </div>
        </div>
      </section>

      <section aria-label="화면 둘러보기" className="bg-[#f5f5f7] mt-8">
        <div className="wrap gutter py-20 md:py-28">
          <p className="eyebrow text-sub">Walkthrough</p>
          <h2 className="mt-3 apple-h text-[32px] md:text-[56px] max-w-[18ch]">추억이 쌓이고, 다시 이어지는 흐름</h2>
          <div className="mt-14"><PinnedPhone color={S} label="우리사이 화면 둘러보기" steps={[0, 1, 2, 5, 7].map(i => p.gallery![i]).map(g => ({ src: g.src, alt: g.alt, title: g.caption ?? g.alt, body: g.alt }))} /></div>
        </div>
      </section>

      <section id="c3" className="scroll-mt-20 md:mt-24">
        <div className="wrap gutter py-20 md:py-28">
          <ChapterHead color={S} n="02" label="Solutions" title="기록, 대화, 발자국 — 처음부터 설계한 세 가지 경험" />

          <Reveal className="mt-14 md:grid md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-5"><Num n="01" t="추억 하나부터, 함께 기록한다" />
              <ul className="mt-8 space-y-5"><Ann color={A} n="A" t="첫 CTA는 ‘그룹 만들기’가 아니라 ‘추억 만들기’" d="그룹 없이 사람을 골라 바로 시작합니다." /><Ann color={A} n="B" t="친구 선택 · 검색과 여러 명 선택" d="검색해서 여러 친구를 한 번에 고르는 선택기를 구현했습니다." /><Ann color={A} n="C" t="참여자별 기록 유지" d="각자의 사진과 이야기가 사라지지 않고 한 추억에 모입니다." /></ul></div>
            <div className="mt-10 md:mt-0 md:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5"><Fig src={I('new')} alt="새 추억 만들기" cap="새 추억 만들기" /><Fig src={I('picker')} alt="함께한 친구 선택: 이름으로 검색하고 여러 명을 한 번에 선택" cap="친구 검색·다중 선택" className="md:mt-10" /><Fig src={I('picker-many')} alt="친구가 많을 때의 선택 목록" cap="친구가 많을 때" /><Fig src={I('people')} alt="볼 수 있는 사람 확인" cap="볼 수 있는 사람 확인" className="md:mt-10" /></div>
          </Reveal>

          <Reveal className="mt-24 md:mt-32 rounded-[28px] p-6 md:p-12 bg-[#F4F2EC]">
            <div className="max-w-[60ch]"><p className="text-[56px] font-extrabold leading-none num-brand">02</p><h3 className="mt-3 text-[32px] md:text-[48px] font-extrabold tracking-tight leading-tight">사진 아래에서 바로 반응하고, 대화한다</h3>
              <p className="mt-4 text-[17px] leading-[1.8]">우리사이는 기존 서비스가 없는 신규 서비스라 비교 대상은 제가 처음 만든 프로토타입이에요. 첫 버전에서는 기록(‘기억 이어가기’)이 사진과 떨어진 별도 카드에 있었어요. 직접 써 보며 발견한 문제를 고친 과정을 초기 버전과 개선 버전으로 보여줘요.</p></div>
            <div className="mt-12 md:grid md:grid-cols-12 gap-10 items-start">
              <div className="md:col-span-4"><p className="eyebrow text-sub">초기 버전</p><div className="mt-3 max-w-[300px]"><Screen src={I('ph-before')} alt="초기 버전 사진 상세: 사진 아래 별도 기억 이어가기 카드" cap="초기 버전 · 사진 상세" /></div></div>
              <div className="mt-10 md:mt-0 md:col-span-8">
                <p className="eyebrow text-sub">발견한 문제 (제 점검)</p>
                <ul className="mt-4 space-y-5"><Ann color={A} n="1" t="‘기억 이어가기’ 카드가 사진에서 떨어져 있다" d="사진을 보다가 바로 반응하기 어렵습니다." /><Ann color={A} n="2" t="반응·댓글 수가 ‘0’으로 표시된 카드에 묻혀 있다" d="사진에 대한 가벼운 참여와 함께 기록하기가 구분되지 않습니다." /><Ann color={A} n="3" t="‘이어진 기억이 아직 없어요’ 문구가 비어 있다는 인상만 준다" d="다음에 할 행동이 버튼 하나뿐입니다." /></ul>
                <p className="mt-10 eyebrow text-sub">개선 가설</p>
                <p className="mt-3 text-[20px] md:text-[24px] font-bold leading-snug max-w-[28ch]">반응·댓글이 사진 바로 아래에 있으면, 가벼운 참여가 먼저 일어나고 대화로 이어질 것이다.</p>
                <p className="mt-3 text-[14px] text-sub">※ 가설이며 사용자 검증 전입니다.</p>
              </div>
            </div>
            <div className="mt-14"><p className="eyebrow text-sub">개선 버전</p>
              <div className="mt-3 md:grid md:grid-cols-12 gap-10 items-start">
                <div className="md:col-span-7 grid grid-cols-2 gap-4 md:gap-6"><Fig src={I('ph-after-top')} alt="현재 버전: 사진 바로 아래 반응·댓글" cap="사진 바로 아래 반응·댓글" /><Fig src={I('ph-after-mid')} alt="현재 버전: 최근 댓글 미리보기와 함께 남기는 추억" cap="최근 댓글 · 함께 남기는 추억" className="md:mt-10" /></div>
                <ul className="mt-8 md:mt-0 md:col-span-5 space-y-5"><Ann color={A} n="A" t="반응·댓글을 사진 바로 아래로" d="사진을 본 자리에서 바로 남깁니다." /><Ann color={A} n="B" t="최근 댓글 미리보기 + ‘이 사진에 댓글 남기기’" d="대화가 있는지 한눈에 보입니다." /><Ann color={A} n="C" t="가벼운 반응과 ‘함께 남기는 추억’ 분리" d="반응은 가볍게, 함께 기록은 별도 카드로." /></ul>
              </div>
              <div className="mt-6"><Need t="전체 댓글·답글 바텀시트 화면 캡처" /></div>
            </div>
            <div className="mt-12 rounded-[20px] bg-white border border-grid p-6"><p className="eyebrow text-sub">검증 계획 (미수행)</p><ul className="mt-3 text-[16px] leading-[1.8] list-disc pl-5"><li>사진 단위 반응·댓글 사용 비율을 초기·개선 버전으로 비교</li><li>‘함께 남기는 추억’과 ‘반응’을 구분해 이해하는지 과제 기반 관찰</li></ul><p className="mt-3 text-[13px] text-sub">아직 수행하지 않았고, 결과는 없습니다.</p></div>
          </Reveal>

          <Reveal className="mt-24 md:mt-32">
            <div className="md:grid md:grid-cols-12 gap-10 items-start">
              <div className="md:col-span-5"><Num n="03" t="발자국으로 다녀온 곳을 다시 발견한다" />
                <ul className="mt-8 space-y-5"><Ann color={A} n="1" t="전체 시도 라벨 → 기록된 지역만 사진 마커로" d="17개 시도 라벨이 지도 위에서 겹치지 않도록, 추억이 있는 지역만 사진 마커로 보여줍니다." /><Ann color={A} n="2" t="지역별 추억 개수와 국내/해외 구분" d="기록된 지역 수와 연결된 추억 수를 요약합니다." /><Ann color={A} n="3" t="내 발자국 / 함께한 발자국" d="지역을 열면 그 지역의 추억 목록으로 이어집니다. GPS는 필요하지 않습니다." /></ul></div>
              <div className="mt-10 md:mt-0 md:col-span-7 grid grid-cols-2 gap-5 md:gap-10 max-w-[620px] md:ml-auto"><Fig src={I('foot-after')} alt="우리의 발자국: 기록된 지역을 사진 마커로 보여주는 지도와 하단 탭바" cap="우리의 발자국" /><Fig src={I('region')} alt="서울의 발자국: 지역 안의 추억 목록" cap="지역별 추억" className="md:mt-12" /></div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="c4" className="wrap gutter py-20 md:py-28 scroll-mt-20 md:mt-8">
        <ChapterHead color={S} n="03" label="Actual UI" title="약속과 우리 공간은 추억을 돕는 보조 기능" />
        <ul className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8" data-scale>
          {['plan', 'space', 'calendar', 'home'].map(n => <li key={n}><Screen src={I(n)} alt={`우리사이 화면 ${n}`} cap={({ plan: '초대받은 약속 · 참석 응답', space: '우리 공간', calendar: '추억 달력', home: '홈' } as Record<string, string>)[n]} /></li>)}
        </ul>
        <InteractionPreview p={p} wide={c.wide} onOpen={() => c.setOpen(true)} title="최신 프로토타입 직접 체험" note="GitHub에 올라온 최신 프로토타입이에요. 화면 시안과 세부가 조금 다를 수 있어요." />
      </section>

      <Outcome c={c} cards={<>{[['7', '설문 응답 (2026.11.12-16)'], ['통과', '서버 권한 시나리오 테스트 (마지막 실행)']].map(([n, l]) => <div key={l} className="rounded-[20px] p-6" style={{ background: T(16) }}><p className="text-[48px] md:text-[64px] font-extrabold leading-none" style={{ color: S }}>{n}</p><p className="mt-2 text-[16px]">{l}</p></div>)}<p className="text-[13px] text-sub">설문은 소규모 표본, 권한 테스트는 자동화된 서버 테스트입니다. Solution 02·03의 사용자 검증은 아직 수행하지 않았습니다.</p></>} />
    </>
  )
}

export default function CaseGeneric() {
  const { slug = '' } = useParams()
  const i = projects.findIndex(x => x.slug === slug)
  const p = projects[i]
  const root = useRef<HTMLElement>(null)
  const navList = slug === 'oliveyoung-todaydream' ? oliveList : slug === 'karrot-large-furniture' ? karrotList : list
  const active = useActive(slug, navList)
  const [open, setOpen] = useState(false)
  const wide = useMedia('(min-width: 1024px)')
  useEffect(() => { if (p) document.title = `${p.name} | Portfolio 2026`; return () => { document.title = 'Portfolio 2026 | Complexity → Clarity' } }, [p])
  useEffect(() => setOpen(false), [slug])
  useLayoutEffect(() => {
    if (!p) return
    const mm = gsap.matchMedia()
    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      gsap.utils.toArray<HTMLElement>('[data-rise]').forEach((el, n) => gsap.fromTo(el, { y: 20 + n * 10 }, { y: -10, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } }))
    })
    return () => mm.revert()
  }, [slug, p])
  if (!p) return <NotFound />
  if (p.slug === 'nodi') return <Navigate to="/work/nodi" replace />
  if (p.slug === 'trigr') return <Navigate to="/work/trigr" replace />
  const next = projects[(i + 1) % projects.length]
  const body = (id: string) => p.sections.find(s => s.id === id && s.body !== TODO)?.body.split('\n\n').filter(Boolean) ?? []
  const c: Ctx = { p, A: p.accent, S: strongOf(p.accent), T: n => tintOf(p.accent, n), body, proto: null, wide, setOpen }
  const View = ({ olive: OliveRenewed, 'karrot-large-furniture': Karrot, woorisai: Woorisai } as Record<string, (a: { c: Ctx }) => ReactNode>)[p.slug === 'oliveyoung-todaydream' ? 'olive' : p.slug]
  return (
    <article ref={root} style={{ ['--brand' as string]: p.accent }}>
      <ChapterNav active={active} list={navList} title={p.name} onCta={p.proto ? () => setOpen(true) : undefined} />
      {View ? <View c={c} /> : <NotFound />}
      <ProjectIndex current={p.slug} />
      <Link to={`/work/${next.slug}`} className="group block rule">
        <div className="wrap gutter py-14 md:py-20 flex items-end justify-between gap-6">
          <div><p className="eyebrow text-sub">다음 프로젝트</p><p className="mt-3 text-[32px] md:text-[56px] font-extrabold tracking-tight leading-none group-hover:text-blue">{next.name}</p></div>
          <span className="px-5 py-3 rounded-full bg-ink text-white text-[14px] shrink-0">이어서 보기</span>
        </div>
      </Link>
      {p.proto && <Modal open={open} onClose={() => setOpen(false)} label={`${p.name} 프로토타입`}><div className="flex justify-center pt-14"><ProtoFrame p={p} width={320} /></div></Modal>}
    </article>
  )
}
