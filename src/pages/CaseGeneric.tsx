import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects, TODO, type Project } from '../data/projects'
import Reveal from '../components/Reveal'
import BeforeAfter from '../components/BeforeAfter'
import { Modal, Zoomable } from '../components/Modal'
import { ProtoFrame, owner, useMedia } from '../components/Mockup'
import { onBrand, CaseSummary, ChapterHead, ChapterNav, InteractionPreview, PinnedPhone, strongOf, tintOf, useActive, ProjectIndex } from '../components/case'
import Strip from '../components/Strip'
import CompareSection, { type CompareData } from '../components/Compare'
import NotFound from './NotFound'

gsap.registerPlugin(ScrollTrigger)
const list = [['c1', '개요'], ['c2', '문제'], ['c3', '핵심 결정'], ['c4', '최종 화면'], ['c5', '검증']]

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
const Num = ({ n, t }: { n: string; t: string }) => <div><p className="text-[56px] font-extrabold leading-none outline-text">{n}</p><h3 className="mt-3 text-[28px] md:text-[36px] font-extrabold tracking-tight leading-tight max-w-[18ch]">{t}</h3></div>

type Ctx = { p: Project; A: string; S: string; T: (n: number) => string; body: (id: string) => string[]; proto: ReactNode; wide: boolean; setOpen: (b: boolean) => void }

function Hero({ c, kicker, title, lead, children, size = 'md' }: { c: Ctx; kicker?: string; title: string; lead: string; children: ReactNode; size?: 'md' | 'xl' }) {
  const { p, S, T, setOpen } = c
  return (
    <>
    <section id="c1" className="overflow-hidden" style={{ background: T(13) }}>
      <div className="wrap gutter pt-10 md:pt-16 pb-14 md:pb-20">
        <Link to="/#work" className="inline-block py-2 text-[14px] text-sub hover:text-blue">← 프로젝트 목록</Link>
        <div className="mt-6 md:grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-5">
            <p className="eyebrow" style={{ color: S }}>Personal Case Study · {p.category}</p>
            <h1 className={`mt-4 font-extrabold tracking-[-0.045em] leading-[1.02] ${size === 'xl' ? 'text-[64px] md:text-[104px]' : 'text-[44px] md:text-[72px]'}`}>{title}</h1>
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
      <ChapterHead color={c.S} n="04" label="Outcome & Reflection" title="검증은 어디까지 했나" />
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

// ── 올리브영: 문제 해결 · 검증(시뮬레이션) ───────────────────────
const median = (a: number[]) => { const s = [...a].sort((x, y) => x - y), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2 }
const SimBanner = () => <p role="note" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ink text-white text-[13px] font-semibold">시뮬레이션 데이터 · 실제 사용성 테스트 결과가 아닙니다</p>

function Olive({ c }: { c: Ctx }) {
  const { p, A, S, T } = c
  const I = (n: string) => `/images/oliveyoung-todaydream/${n}.webp`
  const sim = p.simulation!
  const rate = (k: 'asis' | 'tobe') => sim.rows.filter(r => r[k]).length
  const med = (k: 'asisSec' | 'tobeSec') => median(sim.rows.map(r => r[k]))
  const ra = rate('asis'), rt = rate('tobe'), ma = med('asisSec'), mt = med('tobeSec')
  const pct = (x: number) => `${Math.round((x / sim.n) * 1000) / 10}%`
  const drop = Math.round(((ma - mt) / ma) * 100)
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
          <p className="mt-3 text-[13px] text-sub">품절 옵션 선택 화면은 실제 캡처가 아니라, 관찰한 구조(옵션 바텀시트, 일시품절 표시, 재입고 알림)를 재현한 거예요. 그 이후의 기존 동작은 단정하지 않고 검증할 가설로 뒀어요.</p>
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
          {p.beforeAfter?.[0] && <div className="mt-14"><div className="max-w-[62ch]"><p className="eyebrow rule pt-4 text-sub">Before / After · 품절 옵션 선택</p><h3 className="mt-4 text-[28px] md:text-[32px] font-bold tracking-tight leading-tight">옵션별 행동을 찾는 방식에서, 선택한 옵션의 다음 행동을 확인하는 방식으로</h3><p className="mt-4 text-[15px] text-sub">Before는 실제 앱의 옵션 시트를 관찰해 <b>재현한 화면</b>이에요(실제 캡처 아님).</p></div><div className="mt-8"><BeforeAfter data={p.beforeAfter[0]} color={A} /></div></div>}

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

      <section id="c5" className="scroll-mt-20 md:mt-24 rule">
        <div className="wrap gutter py-20 md:py-32">
          <ChapterHead color={S} n="04" label="Usability Test & Results" title="대체 구매 경로를 더 쉽게 선택하는지 비교했다" />
          <div className="mt-6"><SimBanner /></div>
          <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-sub">아래 테스트 설계는 계획이고, 참가자·시간·성공률은 <b>포트폴리오 제작용 가상 데이터</b>예요. 실제 테스트를 진행하면 이 영역을 실측 결과로 교체해야 해요.</p>

          <div className="mt-12 md:grid md:grid-cols-12 gap-10 items-start">
            <div className="md:col-span-6"><p className="eyebrow text-sub">테스트 설계</p>
              <ul className="mt-4 space-y-2 text-[16px] leading-relaxed list-disc pl-5"><li>참가자: 모바일 쇼핑 경험자 {sim.n}명, 진행자 관찰형 프로토타입 테스트(실제 결제 없음)</li><li>비교: AS-IS ↔ TO-BE. P01~P04는 AS-IS → TO-BE, P05~P08은 TO-BE → AS-IS(학습 효과 상쇄)</li><li>과업 제한 {sim.limit}초, 구매 가능한 수령 방법을 선택하거나 시간에 도달하면 종료</li><li>재고 조건(양쪽 동일): 오늘드림 품절 · 일반배송 구매 가능 · 픽업 주문 가능한 매장 1곳 · 수량 1개</li></ul></div>
            <blockquote className="mt-8 md:mt-0 md:col-span-6 rounded-[20px] p-6 text-[17px] leading-[1.7]" style={{ background: T(14) }}>“메디힐 로제 PDRN 모공결광 10매를 오늘드림으로 구매하려고 했지만 품절되었습니다. 다른 방법으로 구매할 수 있는지 확인하고, 구매 가능한 방법을 선택해 주세요.”</blockquote>
          </div>

          <div className="mt-16 grid md:grid-cols-2 gap-6 [&>*]:min-w-0">
            <div className="rounded-[28px] p-7 md:p-9 bg-[#F7F8FA]"><p className="eyebrow text-sub">대체 구매 과업 성공률</p>
              <p className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1"><span className="text-[32px] sm:text-[44px] md:text-[64px] font-extrabold leading-none tracking-tight">{pct(ra)}</span><span aria-hidden className="text-sub">→</span><span className="text-[32px] sm:text-[44px] md:text-[64px] font-extrabold leading-none tracking-tight" style={{ color: S }}>{pct(rt)}</span></p>
              <p className="mt-2 text-[16px]">AS-IS {ra}/{sim.n}명 → TO-BE {rt}/{sim.n}명 · <b>+{Math.round(((rt - ra) / sim.n) * 100)}%p</b></p>
              <div role="img" aria-label={`AS-IS ${pct(ra)}, TO-BE ${pct(rt)}`} className="mt-5 space-y-2"><div className="h-3 rounded-full bg-[#e8e8e8]"><div className="h-3 rounded-full bg-[#9a9a9a]" style={{ width: pct(ra) }} /></div><div className="h-3 rounded-full bg-[#e8e8e8]"><div className="h-3 rounded-full" style={{ width: pct(rt), background: A }} /></div></div></div>
            <div className="rounded-[28px] p-7 md:p-9 bg-[#F7F8FA]"><p className="eyebrow text-sub">과업 종료 시간 중앙값</p>
              <p className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1"><span className="text-[32px] sm:text-[44px] md:text-[64px] font-extrabold leading-none tracking-tight">{ma}초</span><span aria-hidden className="text-sub">→</span><span className="text-[32px] sm:text-[44px] md:text-[64px] font-extrabold leading-none tracking-tight" style={{ color: S }}>{mt}초</span></p>
              <p className="mt-2 text-[16px]">중앙값 <b>{drop}% 감소</b> · 실패 참가자의 시간도 포함</p>
              <div role="img" aria-label={`AS-IS ${ma}초, TO-BE ${mt}초`} className="mt-5 space-y-2"><div className="h-3 rounded-full bg-[#e8e8e8]"><div className="h-3 rounded-full bg-[#9a9a9a]" style={{ width: `${(ma / sim.limit) * 100}%` }} /></div><div className="h-3 rounded-full bg-[#e8e8e8]"><div className="h-3 rounded-full" style={{ width: `${(mt / sim.limit) * 100}%`, background: A }} /></div></div></div>
          </div>

          <div className="mt-8 overflow-x-auto"><table className="w-full min-w-[520px] text-[15px]"><caption className="text-left text-[13px] text-sub pb-3">참가자별 결과 (가상 데이터)</caption><thead><tr className="text-left text-[13px] text-sub border-b border-grid"><th scope="col" className="py-3">참가자</th><th scope="col">AS-IS 성공</th><th scope="col">TO-BE 성공</th><th scope="col">AS-IS 시간</th><th scope="col">TO-BE 시간</th></tr></thead><tbody>{sim.rows.map(r => <tr key={r.id} className="border-b border-grid"><th scope="row" className="py-3 text-left font-semibold">{r.id}</th><td>{r.asis ? '성공' : <span className="text-sub">실패</span>}</td><td style={r.tobe ? { color: S, fontWeight: 600 } : undefined}>{r.tobe ? '성공' : <span className="text-sub">실패</span>}</td><td>{r.asisSec}초</td><td>{r.tobeSec}초</td></tr>)}</tbody></table></div>

          <div className="mt-16 md:grid md:grid-cols-12 gap-10">
            <div className="md:col-span-7 space-y-6 text-[17px] leading-[1.8]">
              <div><p className="eyebrow text-sub mb-2">결과 해석</p><p>가상 데이터에서 대체 구매 과업 성공률은 {pct(ra)}에서 {pct(rt)}로, 종료 시간 중앙값은 {ma}초에서 {mt}초로 나타났어요. 옵션 선택 뒤 다음 행동을 하단 CTA로 주는 방식이 대체 구매 경로 선택에 도움이 될 수 있다는 가설과 일치해요.</p></div>
              <div><p className="eyebrow text-sub mb-2">남은 문제</p><p>TO-BE에서도 {sim.n}명 중 1명(P07)은 과업을 끝내지 못했어요. 실제 테스트라면 어느 화면에서 막혔는지, 어떤 버튼을 골랐는지, 무엇을 오해했는지 관찰 기록으로 확인해야 해요. 관찰되지 않은 발화나 실패 이유는 만들지 않았어요.</p></div>
            </div>
            <div className="mt-10 md:mt-0 md:col-span-5 rounded-[20px] border border-dashed border-line p-6 bg-white"><p className="text-[16px] font-bold">해석의 한계</p>
              <ul className="mt-2 text-[15px] leading-relaxed text-sub list-disc pl-5"><li>표본 8명의 가상 데이터라 일반화할 수 없어요</li><li>특정 UI 요소 하나가 개선의 유일한 원인이라고 단정할 수 없어요</li><li>종료 시간에는 실패 참가자도 포함돼요(성공 완료 시간과 분리 필요)</li><li>첫 행동 정확도 50% → 87.5%, 평균 잘못된 탭 2.5회 → 1.0회는 참가자별 로그가 없는 가상 요약치라 이 페이지의 근거로 쓰지 않았어요</li></ul></div>
          </div>
          <p className="mt-10 text-[13px] text-sub max-w-3xl">실제 구매 전환율, 매출, 재고 시스템 연동 성과는 측정하지 않았고 주장하지 않아요.</p>
        </div>
      </section>
    </>
  )
}

// ── 당근: 거래 정보 · 구매 판단 ──────────────────────────────
const I2 = (n: string) => `/images/karrot-large-furniture/${n}.webp`
const karrotCompare: CompareData[] = [
  { n: '01', title: '판매글 작성 · 가구 정보를 따로 받아요', sub: '판매자가 크기·분해 여부·운반 조건을 자유 서술에 의존하지 않고 선택 입력 섹션으로 정리해 남길 수 있어요.',
    before: { src: I2('bf-write'), alt: '현재 당근 앱 내 물건 팔기 화면: 거래 방식·가격과 자세한 설명 입력란', label: '현재 당근 앱' },
    afters: [{ src: I2('f-s2'), alt: '개선 판매글 작성: 자세한 설명 아래에 선택 입력 가구 정보 섹션', tag: 'S2', label: '판매글 작성' }, { src: I2('f-s3'), alt: '개선 가구 정보 입력: 크기와 분해 여부, 가져가는 조건 입력', tag: 'S3', label: '가구 정보 입력' }],
    current: ['크기·분해 여부·운반 조건을 ‘자세한 설명’ 자유 입력란에 쓸 수 있어요. 판매자마다 쓰는 정보의 양과 형식이 달라져요.', '거래 방식·가격 외에 대형 가구 거래에 필요한 조건(층수, 엘리베이터, 운반 도움)을 입력하는 칸이 없어요.'],
    improved: ['S2 · 판매글 작성에 ‘가구 정보’ 섹션을 선택 입력으로 추가했어요. 상품 정보(크기, 분해 여부)와 가져가는 조건(층수, 엘리베이터, 운반 도움)으로 나뉘어요.', 'S3 · 아는 항목만 입력해도 되고 섹션별 입력 진행도(4/4 입력, 3/3 입력)를 바로 보여줘요.'] },
  { n: '02', title: '상품 상세 · 채팅 전에 거래 조건을 확인해요', sub: '구매자가 채팅을 열기 전에 크기와 가져가는 조건을 확인하고 확인되지 않은 정보가 무엇인지도 알 수 있어요.',
    before: { src: I2('bf-detail'), alt: '현재 당근 앱 상품 상세: 본문 텍스트와 하단 가격 제안 영역', label: '현재 당근 앱' },
    afters: [{ src: I2('f-b1'), alt: '개선 상품 상세: 거래 정보 카드에 크기·분해와 가져가는 조건이 모두 입력됨', tag: 'B1', label: '상세 · 모두 입력' }, { src: I2('f-b2'), alt: '개선 상품 상세: 일부만 입력되어 확인되지 않은 정보 3개를 알려줌', tag: 'B2', label: '상세 · 일부 입력' }],
    current: ['상품 정보가 본문 자유 텍스트에만 있어서 크기, 분해 여부, 운반 조건을 상세 화면에서 알 수 없어요.', '궁금한 점을 확인하는 방법이 채팅뿐이라 기본적인 질문까지 모두 채팅으로 물려요.'],
    improved: ['B1 · ‘거래 정보’ 카드에 판매자가 직접 입력한 크기·분해, 가져가는 조건을 정리해 보여줘요.', 'B2 · ‘아직 미입력’과 ‘판매자도 모름’을 구분해 ‘확인되지 않은 정보 3개’로 알려줘요.'] },
  { n: '03', title: '채팅 문의 · 질문을 골라서 보내요', sub: '확인되지 않은 정보를 바탕으로 질문을 고르면 채팅 입력창에 초안으로 들어가요. 처음 말 걸기가 쉬워지고 질문이 구체적이 돼요.',
    before: { src: I2('bf-chat'), alt: '현재 당근 앱 채팅: 첫 메시지를 직접 쓰고 상단 상품 요약에는 가격만 보임', label: '현재 당근 앱' },
    afters: [{ src: I2('f-b3'), alt: '개선 질문 고르기: 확인되지 않은 정보에서 물어볼 질문을 선택', tag: 'B3', label: '질문 고르기' }, { src: I2('f-b4'), alt: '개선 채팅 질문 초안: 고른 질문이 입력창에 초안으로 들어감', tag: 'B4', label: '채팅 질문 초안' }],
    current: ['첫 메시지를 직접 써야 해서 ‘구매 가능할까요?’ 같은 일반적인 질문에 그치고 필요한 조건은 대화를 여러 번 주고받으며 확인해요.', '상단 상품 요약에는 가격만 있어서 대화 중에 거래 조건을 보려면 상세 화면으로 다시 돌아가야 해요.'],
    improved: ['B3 · 상세의 확인되지 않은 정보에서 물어볼 질문을 골라요.', 'B4 · 고른 질문이 채팅 입력창에 초안으로 들어가요. 확인하고 고친 뒤 보낼 수 있어요.'] },
  { n: '04', title: '정보 변경 · 바뀐 내용을 알려줘요', sub: '판매자가 가격이나 거래 조건을 수정하면 대화 중인 구매자와 상세 화면을 보는 구매자 모두 최신 정보를 확인할 수 있어요.',
    before: { src: I2('bf-change'), alt: '현재 당근 앱 상품 상세: 게시글이 수정돼도 무엇이 바뀌었는지 표시되지 않음', label: '현재 당근 앱' },
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
            <p className="mt-4 text-[14px] leading-[1.7] text-sub">비공식 개인 UX 개선 제안이에요. 거래가 얼마나 늘지는 측정하지 않았고 사용성 테스트로 검증이 필요해요.</p>
          </div>
          <div className="mt-8 md:mt-0 md:col-span-5 grid grid-cols-2 gap-4">
            <figure><p className="text-[13px] font-semibold text-sub mb-2">기존 · 상품 상세</p><Screen src={p.beforeAfter![0].before} alt={p.beforeAfter![0].beforeAlt} /></figure>
            <figure><p className="text-[13px] font-semibold mb-2" style={{ color: S }}>개선 · 상품 상세</p><Screen src={p.beforeAfter![0].after} alt={p.beforeAfter![0].afterAlt} /></figure>
          </div>
        </div>
      </section>

      <section id="c2" className="wrap gutter py-20 md:py-32 scroll-mt-20 md:mt-24">
        <ChapterHead color={S} n="01" label="The Challenge" title="대형 가구는 정보가 빠지면 판단이 멈춘다" />
        <Reveal><blockquote className="mt-10 text-[28px] md:text-[40px] font-bold tracking-tight leading-snug max-w-[26ch]" style={{ borderLeft: `6px solid ${A}`, paddingLeft: 24 }}>{p.problem}</blockquote></Reveal>
        <ul className="mt-12 grid md:grid-cols-3 gap-5">{[['크기', '가로·세로·높이를 설명에서 찾아야 함'], ['분해 · 운반', '분해 가능 여부와 가져가는 조건이 문장으로 흩어짐'], ['반복 질문', '판매자에게 같은 질문을 되풀이해야 할 수 있음']].map(([a, b]) => <li key={a} className="rounded-[20px] p-6" style={{ background: T(14) }}><p className="text-[13px] font-semibold" style={{ color: S }}>{a}</p><p className="mt-2 text-[17px] leading-snug">{b}</p></li>)}</ul>
        <div className="mt-14"><p className="eyebrow text-sub">실제 당근 앱 · AS-IS 캡처</p>
          <ul className="mt-5 grid grid-cols-3 gap-4 md:gap-8 max-w-3xl">{[['bf-write', '판매글 작성: 설명 입력란에 자유롭게'], ['bf-detail', '상품 본문: 크기가 문장 속에'], ['bf-chat', '채팅: 첫 메시지를 직접 작성']].map(([n, l]) => <li key={n}><Fig src={I(n)} alt={`실제 당근 앱 ${l}`} cap={l} /></li>)}</ul>
          <p className="mt-4 text-[13px] text-sub max-w-3xl">실제 앱 화면 캡처이며 판매자 닉네임, 거래 장소 주소·지도, 캡처한 사람의 정보는 가렸습니다.</p></div>
        <p className="mt-10 text-[13px] text-sub max-w-3xl">앱 리뷰·블로그 VOC와 인터뷰를 근거로 PRD 문제를 정의했습니다. 원자료가 없어 표본 수와 수치는 싣지 않았고, 발생 빈도와 영향은 사용성 테스트로 검증해야 하는 디자인 가설입니다.</p>
      </section>

      <section id="c3" className="scroll-mt-20 md:mt-24" style={{ background: '#F7F8FA' }}>
        <div className="wrap gutter py-20 md:py-32">
          <ChapterHead color={S} n="02" label="Design Decisions" title="있는 정보, 없는 정보, 모르는 정보를 나눠 보여준다" />
          <div className="mt-14 md:grid md:grid-cols-12 gap-10 items-start">
            <div className="md:col-span-5"><Num n="01" t="상태를 네 가지로 구분" />
              <table className="mt-8 w-full text-[16px] bg-white rounded-[20px] overflow-hidden"><caption className="sr-only">정보 상태별 표시 원칙</caption><tbody>{[['입력 완료', '입력된 값 표시'], ['미입력', '아직 입력되지 않았어요'], ['모름', '판매자도 확인하지 못했어요'], ['조회 실패', '정보를 불러오지 못했어요']].map(([a, b]) => <tr key={a} className="border-t border-grid first:border-0"><th scope="row" className="py-3 pl-5 pr-3 text-left font-semibold whitespace-nowrap">{a}</th><td className="py-3 pr-5 text-sub">{b}</td></tr>)}</tbody></table>
              <p className="mt-4 text-[16px] leading-relaxed text-sub">엘리베이터가 있다는 이유로 운반 가능하다고 단정하지 않습니다.</p></div>
            <div className="mt-10 md:mt-0 md:col-span-7 grid grid-cols-2 gap-6"><Fig src={I('k-partial')} alt="미입력과 모름을 구분한 상세" cap="일부 입력 · 미입력/모름 구분" /><Fig src={I('k-fail')} alt="정보 조회 실패 화면" cap="조회 실패 · 재시도" className="md:mt-12" /></div>
          </div>


          <Reveal className="mt-20 md:mt-24 md:grid md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-5 md:order-2"><Num n="02" t="분해 가능과 전달 상태를 분리" />
              <ul className="mt-8 space-y-5"><Ann color={A} n="A" t="분해 가능 · 분해 불가 · 잘 모르겠어요" d="‘분해 가능’을 고른 경우에만 전달 상태를 묻습니다." /><Ann color={A} n="B" t="조립된 상태 · 분해된 상태 · 협의" d="‘분해 가능’이 실제 전달 상태와 혼동되지 않게 했습니다." /><Ann color={A} n="C" t="큰 크기 값은 막지 않고 재확인" d="0 이하만 거절하고, 비정상적으로 큰 값은 다시 확인하게 합니다." /></ul></div>
            <div className="mt-10 md:mt-0 md:col-span-7 grid grid-cols-2 gap-6 md:order-1"><Fig src={I('f-s2')} alt="가구 정보 입력" cap="선택형 가구 정보 입력" /><Fig src={I('f-recheck')} alt="큰 값 재확인" cap="큰 값 재확인" className="md:mt-12" /></div>
          </Reveal>


          <Reveal className="mt-20 md:mt-24 md:grid md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-5"><Num n="03" t="질문은 초안으로만, 보내는 건 사용자" />
              <ul className="mt-8 space-y-5"><Ann color={A} n="A" t="궁금한 항목만 골라 채팅 초안 생성" /><Ann color={A} n="B" t="자동 전송하지 않고 기존 입력을 보존" d="사용자가 고치고 직접 보냅니다." /><Ann color={A} n="C" t="정보가 바뀌면 변경 항목만 비교" d="이전 값이 실제로 있을 때만 전후를 보여줍니다." /></ul></div>
            <div className="mt-10 md:mt-0 md:col-span-7 grid grid-cols-3 gap-4 md:gap-6"><Fig src={I('f-b3')} alt="질문 고르기" cap="질문 고르기" /><Fig src={I('k-chat')} alt="채팅 질문 초안" cap="채팅 초안" className="md:mt-10" /><Fig src={I('k-changed')} alt="변경 내용 비교" cap="변경 비교" /></div>
          </Reveal>
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
        <ChapterHead color={S} n="03" label="Final Experience" title="판매자 입력 → 구매자 확인 → 정보 변경" />
        <div className="mt-14"><PinnedPhone color={S} label="당근 화면 둘러보기" steps={(p.gallery ?? []).map(g => ({ src: g.src, alt: g.alt, title: g.caption ?? g.alt, body: g.alt }))} /></div>
        <p className="mt-8 max-w-3xl text-[17px] leading-[1.8]">예외 상태(조회 실패와 재시도, 거래 완료)까지 포함한 20개 화면을 클릭형 프로토타입으로 구현했습니다.</p>
        <InteractionPreview p={p} wide={c.wide} onOpen={() => c.setOpen(true)} title="입력부터 질문 초안까지" />
      </section>

      <section id="c5" className="scroll-mt-20 md:mt-24 rule">
        <div className="wrap gutter py-20 md:py-32">
          <ChapterHead color={S} n="04" label="Hypothesis → Validation" title="가설 → 검증 → 발견된 문제 → 디자인 수정 → 재검증" />
          <div className="mt-6"><p role="note" className="inline-flex px-4 py-2 rounded-full bg-ink text-white text-[13px] font-semibold">예상 결과 · 테스트 수행 전에 작성한 예측 시나리오이며 실제 검증 결과가 아닙니다</p></div>
          <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-sub">사용성 테스트는 아직 수행하지 않았어요. 아래 수치는 설계 가설을 점검하기 위해 미리 세운 예측이고, 실제로 테스트하면 이 영역을 실측으로 바꾸고 예측과 다른 결과도 이유와 후속 개선안과 함께 싣습니다.</p>

          <div className="mt-12 md:grid md:grid-cols-12 gap-10 items-start">
            <div className="md:col-span-6"><p className="eyebrow text-sub">테스트 설계 (계획)</p>
              <ul className="mt-4 space-y-2 text-[16px] leading-relaxed list-disc pl-5"><li>구매자: AS-IS 8명, TO-BE 8명</li><li>구매자 과업: 거래 조건 확인, 거래 가능성 판단, 판매자 질문 초안 작성</li><li>판매자: 8명, 기존 등록 흐름과 개선 등록 흐름 비교 · 과업은 대형 가구 판매글 등록과 거래 조건 입력</li></ul></div>
            <ol className="mt-8 md:mt-0 md:col-span-6 grid grid-cols-2 gap-3 max-w-[420px]" aria-label="개선 과정">{[['AS-IS', '거래 조건이 자유 서술형 설명에 흩어져 있다', 'bf-detail'], ['TO-BE', '거래 정보를 카드로 구조화한다(현재 구현 화면)', 'k-info']].map(([a, d, img]) => <li key={a} className="rounded-[20px] bg-[#F7F8FA] p-3"><p className="text-[13px] font-bold" style={{ color: S }}>{a}</p><div className="mt-2"><Screen src={I(img)} alt={`${a} 화면`} /></div><p className="mt-2 text-[13px] leading-snug">{d}</p></li>)}</ol>
          </div>

          <p className="mt-16 eyebrow text-sub">구매자 · 예상 지표 (AS-IS / TO-BE)</p>
          <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[520px] text-[15px]"><caption className="sr-only">구매자 지표 예상값</caption><thead><tr className="text-left text-[13px] text-sub border-b border-grid"><th scope="col" className="py-3">지표</th><th scope="col">AS-IS</th><th scope="col">TO-BE</th></tr></thead><tbody>{p.forecast!.buyer.map(r => <tr key={r[0]} className="border-b border-grid"><th scope="row" className="py-3 text-left font-semibold pr-4">{r[0]}</th><td>{r[1]}</td><td className="font-semibold" style={{ color: S }}>{r[3]}</td></tr>)}</tbody></table></div>
          <div className="mt-8 grid md:grid-cols-2 gap-5">{p.forecast!.buyer.slice(0, 2).map(r => <div key={r[0]} className="rounded-[20px] p-6 bg-[#F7F8FA]"><p className="text-[15px] font-semibold">{r[0]}</p><div role="img" aria-label={`AS-IS ${r[1]}, TO-BE ${r[3]}`} className="mt-4 space-y-2">{[['AS-IS', r[1], '#9a9a9a'], ['TO-BE', r[3], A]].map(([l, v, col]) => <div key={l} className="flex items-center gap-3"><span className="w-14 text-[13px] text-sub">{l}</span><div className="flex-1 h-3 rounded-full bg-[#e8e8e8]"><div className="h-3 rounded-full" style={{ width: v, background: col }} /></div><span className="w-14 text-right text-[14px]">{v}</span></div>)}</div></div>)}</div>

          <div className="mt-12 grid md:grid-cols-2 gap-8">
            <div><p className="eyebrow text-sub">질문 작성 과업 (AS-IS → TO-BE)</p><table className="mt-3 w-full text-[15px]"><caption className="sr-only">질문 작성 과업 예상값</caption><tbody>{p.forecast!.question.map(r => <tr key={r[0]} className="border-b border-grid"><th scope="row" className="py-3 text-left font-semibold pr-4">{r[0]}</th><td>{r[1]}</td><td aria-hidden className="text-sub">→</td><td className="font-semibold" style={{ color: S }}>{r[2]}</td></tr>)}</tbody></table></div>
            <div><p className="eyebrow text-sub">판매자 등록 과업 (기존 → 개선)</p><table className="mt-3 w-full text-[15px]"><caption className="sr-only">판매자 등록 과업 예상값</caption><tbody>{p.forecast!.seller.map(r => <tr key={r[0]} className="border-b border-grid"><th scope="row" className="py-3 text-left font-semibold pr-4">{r[0]}</th><td>{r[1]}</td><td aria-hidden className="text-sub">→</td><td className="font-semibold" style={{ color: S }}>{r[2]}</td></tr>)}</tbody></table>
              <p className="mt-3 text-[13px] text-sub">등록 시간은 늘어날 것으로 예상했어요. 입력이 늘어나는 대신 거래 조건을 정확히 적는 비율이 오르는 절충점이 있는지를 확인할 가설이에요.</p></div>
          </div>

          <div className="mt-14 md:grid md:grid-cols-12 gap-10">
            <div className="md:col-span-7"><p className="eyebrow text-sub">예상 인사이트 · 검증 전 가설</p>
              <ol className="mt-4 space-y-3 text-[16px] leading-relaxed">{['거래 정보를 구조화해도 화면 하단에 두면 발견하지 못할 수 있다', '상품명과 가격 바로 아래에 핵심 조건을 두면 발견성이 높아질 가능성이 있다', '‘미입력’과 ‘불가능’을 구분하는 상태 표현이 거래 판단 정확도에 중요하다', '편집 가능한 질문 초안은 질문 작성 시간과 누락을 줄일 가능성이 있다', '판매자의 입력 부담이 늘어도 거래 조건을 정확히 적는 비율이 오르는 절충점이 있을 수 있다'].map((x, i) => <li key={x} className="flex gap-3"><span className="font-extrabold" style={{ color: S }}>0{i + 1}</span><span>{x}</span></li>)}</ol></div>
            <div className="mt-10 md:mt-0 md:col-span-5 rounded-[20px] border border-dashed border-line p-6 bg-white"><p className="text-[16px] font-bold">검증 상태 구분</p>
              <ul className="mt-2 text-[15px] leading-relaxed text-sub list-disc pl-5"><li>확인된 사실: 실제 앱 캡처, 구현한 프로토타입 20개 화면</li><li>설계 가설: 거래 조건 구조화, 핵심 요약 위치 이동</li><li>예측: 위 지표 전체(테스트 전)</li><li>검증 결과: 아직 없음</li></ul>
              <p className="mt-3 text-[13px] text-sub">인터뷰 발언과 행동 기록은 실제로 수집한 뒤에만 싣습니다.</p></div>
          </div>
        </div>
      </section>
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
  const Tag = ({ t }: { t: string }) => <span className="inline-block px-3 py-1 rounded-full text-[13px] font-semibold" style={{ background: A, color: onBrand(A) }}>{t}</span>
  return (
    <>
      <section id="c1" className="overflow-hidden" style={{ background: '#FAF9F6' }}>
        <div className="wrap gutter pt-10 md:pt-16 pb-14 text-center">
          <Link to="/#work" className="inline-block py-2 text-[14px] text-sub hover:text-blue">← 프로젝트 목록</Link>
          <p className="eyebrow mt-6" style={{ color: S }}>Personal Case Study · {p.category}</p>
          <h1 className="mt-4 text-[72px] md:text-[168px] font-extrabold tracking-[-0.05em] leading-[0.95]" style={{ color: '#242622' }}>우리사이</h1>
          <p className="mt-6 mx-auto text-[22px] md:text-[28px] font-bold leading-snug max-w-[28ch]">흩어진 사진과 기억을 하나의 추억으로 연결하고, 기록이 다시 대화로 이어지는 경험을 설계했습니다.</p>
          <div className="mx-auto max-w-xl"><dl className="mt-8 grid grid-cols-3 gap-5 text-[14px] text-left rule pt-4" style={{ borderColor: T(40) }}>
            <div><dt className="text-sub text-[13px]">담당</dt><dd className="mt-1">{owner}</dd></div><div><dt className="text-sub text-[13px]">역할</dt><dd className="mt-1">{p.role}</dd></div><div><dt className="text-sub text-[13px]">기간</dt><dd className="mt-1">{p.period}</dd></div></dl></div>
          {c.proto && <button onClick={() => c.setOpen(true)} className="mt-8 px-6 py-3 rounded-full bg-ink text-white text-[16px] font-semibold">프로토타입 실행</button>}
          <ul data-scale className="mt-14 flex items-end justify-center gap-4 md:gap-8 max-w-[860px] mx-auto">
            {[['feed', '추억 피드', 'w-[28%]'], ['ph-after-top', '사진 상세', 'w-[34%]'], ['foot-after', '발자국', 'w-[28%]']].map(([n, a, w], i) => <li key={n} className={`${w} ${i !== 1 ? 'md:translate-y-8' : ''}`}><div className="phone-light"><img src={I(n)} alt={`우리사이 ${a} 화면`} className="screen" /></div></li>)}
          </ul>
        </div>
      </section>
      <p className="wrap gutter pt-8 text-[13px] text-sub text-center">실제 프로토타입 화면 캡처 · 사진은 Unsplash 예시 이미지, 이름과 내용은 예시 데이터</p>
      <CaseSummary p={p} />

      <section className="wrap gutter py-16 md:py-24 md:grid md:grid-cols-12 gap-10">
        <div className="md:col-span-4"><p className="eyebrow text-sub">Overview</p><h2 className="mt-3 text-[28px] md:text-[36px] font-extrabold tracking-tight leading-tight">함께한 사람만 초대해, 하나의 추억을 같이 완성한다</h2></div>
        <div className="mt-6 md:mt-0 md:col-span-8 text-[17px] leading-[1.8] space-y-4">{c.body('overview').map(t => <p key={t}>{t}</p>)}</div>
      </section>

      <section id="c2" className="scroll-mt-20 md:mt-8" style={{ background: '#F4F2EC' }}>
        <div className="wrap gutter py-20 md:py-28">
          <ChapterHead color={S} n="01" label="Problem Framing" title="한 번의 만남이 여러 서비스로 흩어진다" />
          <ol className="mt-10 flex flex-wrap items-center gap-2" aria-label="흩어지는 서비스">{['약속 → 메신저', '사진 → 각자의 갤러리', '정산 → 정산 앱', '과거 찾기 → 사진 앱'].map((s, i, a) => <li key={s} className="flex items-center gap-2"><span className="px-4 py-2 rounded-full bg-white border border-grid text-[14px]">{s}</span>{i < a.length - 1 && <span aria-hidden className="text-sub">·</span>}</li>)}</ol>
          <p className="mt-6 text-[14px] text-sub max-w-[60ch]">※ 위 흐름은 PRD에서 세운 문제 가설이며, 검증된 사용자 문제가 아닙니다.</p>
          <div className="mt-14 md:grid md:grid-cols-12 gap-10 items-start">
            <div className="md:col-span-5"><p className="eyebrow text-sub">설문 · 응답 7명 (2026.11.12-16)</p><p className="mt-3 text-[28px] font-extrabold leading-tight tracking-tight">쉽다는 답이 많았고, 초대와 기능 이동에서 막혔다</p><p className="mt-4 text-[16px] text-sub leading-relaxed">서술 의견: 친구 초대 기능을 못 찾음 · 일정 미응답자 재촉 버튼 제안 · 장소가 “서울 서울”로 표시 · 기능 구분이 불분명. 20대 여성 중심 소규모 표본이라 방향 확인용입니다.</p></div>
            <div className="mt-8 md:mt-0 md:col-span-7 rounded-[20px] p-6 md:p-8 space-y-6 bg-white">
              {survey.map(([q, seg]) => <div key={q}><p className="text-[16px] font-semibold">{q}</p><div role="img" aria-label={seg.map(([l, n]) => `${l} ${n}명`).join(', ')} className="mt-2 flex h-3 rounded-full overflow-hidden gap-[2px]">{seg.map(([l, n], i) => <span key={l} style={{ flex: n, background: col[i] }} />)}</div><p className="mt-2 text-[13px] text-sub">{seg.map(([l, n]) => `${l} ${n}`).join(' · ')}</p></div>)}
            </div>
          </div>
          <div className="mt-20">
            <p className="eyebrow text-sub">Design Strategy</p>
            <h3 className="mt-3 text-[28px] md:text-[36px] font-extrabold tracking-tight leading-tight">기록 → 함께 쌓기 → 다시 발견하기 → 대화로 이어지기</h3>
            <ol className="mt-8 grid md:grid-cols-4 gap-4">{[['기록', '추억 하나부터 가볍게 시작'], ['함께 쌓기', '참여자별 사진과 이야기를 한 추억에'], ['다시 발견하기', '사람·장소·시간으로 되찾기'], ['대화로 이어지기', '사진 단위 반응과 댓글']].map(([t, d], i) => <li key={t} className="rounded-[20px] bg-white border border-grid p-5"><span className="text-[24px] font-extrabold" style={{ color: S }}>0{i + 1}</span><p className="mt-2 text-[18px] font-bold">{t}</p><p className="mt-1 text-[14px] text-sub leading-snug">{d}</p></li>)}</ol>
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
          <ChapterHead color={S} n="02" label="Solutions" title="기록, 대화, 발자국 — 세 가지 해결" />

          <Reveal className="mt-14 md:grid md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-5"><Num n="01" t="추억 하나부터, 함께 기록한다" />
              <ul className="mt-8 space-y-5"><Ann color={A} n="A" t="첫 CTA는 ‘그룹 만들기’가 아니라 ‘추억 만들기’" d="그룹 없이 사람을 골라 바로 시작합니다." /><Ann color={A} n="B" t="친구 선택 · 검색과 여러 명 선택" d="검색해서 여러 친구를 한 번에 고르는 선택기를 구현했습니다." /><Ann color={A} n="C" t="참여자별 기록 유지" d="각자의 사진과 이야기가 사라지지 않고 한 추억에 모입니다." /></ul></div>
            <div className="mt-10 md:mt-0 md:col-span-7 grid grid-cols-3 gap-4 md:gap-6"><Fig src={I('new')} alt="새 추억 만들기" cap="새 추억 만들기" /><Fig src={I('people')} alt="볼 수 있는 사람 확인" cap="참여자" className="md:mt-12" /><Fig src={I('add')} alt="내 사진과 이야기 더하기" cap="사진·이야기 더하기" /></div>
          </Reveal>
          <div className="mt-6"><Need t="친구 검색·다중 선택 화면 캡처" /></div>

          <Reveal className="mt-24 md:mt-32 rounded-[28px] p-6 md:p-12 bg-[#F4F2EC]">
            <div className="max-w-[60ch]"><Tag t="Solution 02 · 핵심" /><h3 className="mt-4 text-[32px] md:text-[48px] font-extrabold tracking-tight leading-tight">사진 아래에서 바로 반응하고, 대화한다</h3>
              <p className="mt-4 text-[17px] leading-[1.8]">사진 상세에서 이어지는 기록(‘기억 이어가기’)이 사진과 분리된 별도 카드에 있었습니다. 같은 프로토타입의 이전 버전과 현재 버전을 비교합니다.</p></div>
            <div className="mt-12 md:grid md:grid-cols-12 gap-10 items-start">
              <div className="md:col-span-4"><p className="eyebrow text-sub">Before</p><div className="mt-3 max-w-[300px]"><Screen src={I('ph-before')} alt="이전 버전 사진 상세: 사진 아래 별도 기억 이어가기 카드" cap="Before · 사진 상세" /></div></div>
              <div className="mt-10 md:mt-0 md:col-span-8">
                <p className="eyebrow text-sub">발견한 문제 (제 점검)</p>
                <ul className="mt-4 space-y-5"><Ann color={A} n="1" t="‘기억 이어가기’ 카드가 사진에서 떨어져 있다" d="사진을 보다가 바로 반응하기 어렵습니다." /><Ann color={A} n="2" t="반응·댓글 수가 ‘0’으로 표시된 카드에 묻혀 있다" d="사진에 대한 가벼운 참여와 함께 기록하기가 구분되지 않습니다." /><Ann color={A} n="3" t="‘이어진 기억이 아직 없어요’ 문구가 비어 있다는 인상만 준다" d="다음에 할 행동이 버튼 하나뿐입니다." /></ul>
                <p className="mt-10 eyebrow text-sub">개선 가설</p>
                <p className="mt-3 text-[20px] md:text-[24px] font-bold leading-snug max-w-[28ch]">반응·댓글이 사진 바로 아래에 있으면, 가벼운 참여가 먼저 일어나고 대화로 이어질 것이다.</p>
                <p className="mt-3 text-[14px] text-sub">※ 가설이며 사용자 검증 전입니다.</p>
              </div>
            </div>
            <div className="mt-14"><p className="eyebrow text-sub">After</p>
              <div className="mt-3 md:grid md:grid-cols-12 gap-10 items-start">
                <div className="md:col-span-7 grid grid-cols-2 gap-4 md:gap-6"><Fig src={I('ph-after-top')} alt="현재 버전: 사진 바로 아래 반응·댓글" cap="사진 바로 아래 반응·댓글" /><Fig src={I('ph-after-mid')} alt="현재 버전: 최근 댓글 미리보기와 함께 남기는 추억" cap="최근 댓글 · 함께 남기는 추억" className="md:mt-10" /></div>
                <ul className="mt-8 md:mt-0 md:col-span-5 space-y-5"><Ann color={A} n="A" t="반응·댓글을 사진 바로 아래로" d="사진을 본 자리에서 바로 남깁니다." /><Ann color={A} n="B" t="최근 댓글 미리보기 + ‘이 사진에 댓글 남기기’" d="대화가 있는지 한눈에 보입니다." /><Ann color={A} n="C" t="가벼운 반응과 ‘함께 남기는 추억’ 분리" d="반응은 가볍게, 함께 기록은 별도 카드로." /></ul>
              </div>
              <div className="mt-6"><Need t="전체 댓글·답글 바텀시트 화면 캡처" /></div>
            </div>
            <div className="mt-12 rounded-[20px] bg-white border border-grid p-6"><p className="eyebrow text-sub">검증 계획 (미수행)</p><ul className="mt-3 text-[16px] leading-[1.8] list-disc pl-5"><li>사진 단위 반응·댓글 사용 비율을 Before/After로 비교</li><li>‘함께 남기는 추억’과 ‘반응’을 구분해 이해하는지 과제 기반 관찰</li></ul><p className="mt-3 text-[13px] text-sub">아직 수행하지 않았고, 결과는 없습니다.</p></div>
          </Reveal>

          <Reveal className="mt-24 md:mt-32">
            <div className="md:grid md:grid-cols-12 gap-10 items-start">
              <div className="md:col-span-5"><Num n="03" t="발자국으로 다녀온 곳을 다시 발견한다" />
                <ul className="mt-8 space-y-5"><Ann color={A} n="1" t="전체 시도 라벨 → 기록된 지역만 사진 마커로" d="이전 버전은 17개 라벨이 지도 위에서 겹치거나 잘렸습니다." /><Ann color={A} n="2" t="지역별 추억 개수와 국내/해외 구분" d="기록된 지역 수와 연결된 추억 수를 요약합니다." /><Ann color={A} n="3" t="내 발자국 / 함께한 발자국" d="지역을 열면 그 지역의 추억 목록으로 이어집니다. GPS는 필요하지 않습니다." /></ul></div>
              <div className="mt-10 md:mt-0 md:col-span-7 grid grid-cols-3 gap-4 md:gap-6"><Fig src={I('foot-before')} alt="이전 버전 발자국: 지도 형태가 부정확하고 라벨이 겹침" cap="Before" /><Fig src={I('foot-after')} alt="현재 버전 발자국: 기록된 지역 사진 마커" cap="After" className="md:mt-12" /><Fig src={I('region')} alt="지역별 추억" cap="지역별 추억" /></div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="c4" className="wrap gutter py-20 md:py-28 scroll-mt-20 md:mt-8">
        <ChapterHead color={S} n="03" label="Supporting Experience" title="약속과 우리 공간은 추억을 돕는 보조 기능" />
        <ul className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8" data-scale>
          {['plan', 'space', 'calendar', 'home'].map(n => <li key={n}><Screen src={I(n)} alt={`우리사이 화면 ${n}`} cap={({ plan: '초대받은 약속 · 참석 응답', space: '우리 공간', calendar: '추억 달력', home: '홈' } as Record<string, string>)[n]} /></li>)}
        </ul>
        <InteractionPreview p={p} wide={c.wide} onOpen={() => c.setOpen(true)} title="이전 버전 프로토타입" note="현재 화면 시안과 세부가 다를 수 있습니다." />
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
  const active = useActive(slug, list)
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
  const View = ({ olive: Olive, 'karrot-large-furniture': Karrot, woorisai: Woorisai } as Record<string, (a: { c: Ctx }) => ReactNode>)[p.slug === 'oliveyoung-todaydream' ? 'olive' : p.slug]
  return (
    <article ref={root}>
      <ChapterNav active={active} list={list} title={p.name} onCta={p.proto ? () => setOpen(true) : undefined} />
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
