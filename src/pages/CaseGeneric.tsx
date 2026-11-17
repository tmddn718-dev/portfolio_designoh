import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects, TODO, type Project } from '../data/projects'
import Reveal from '../components/Reveal'
import BeforeAfter from '../components/BeforeAfter'
import { Modal, Zoomable } from '../components/Modal'
import { ProtoFrame, owner, useMedia } from '../components/Mockup'
import { ChapterHead, ChapterNav, InteractionPreview, strongOf, tintOf, useActive } from '../components/case'
import Strip from '../components/Strip'
import NotFound from './NotFound'

gsap.registerPlugin(ScrollTrigger)
const list = [['c1', 'Hero'], ['c2', 'Challenge'], ['c3', 'Decisions'], ['c4', 'Experience'], ['c5', 'Outcome']]

// ── 공통 조각 ────────────────────────────────────────────
const Screen = ({ src, alt, cap, className = '' }: { src: string; alt: string; cap?: string; className?: string }) => (
  <Zoomable src={src} alt={alt} caption={cap ?? alt} className={`phone-light w-full ${className}`} imgClass="screen" />
)
const Fig = ({ src, alt, cap, className = '' }: { src: string; alt: string; cap: string; className?: string }) => (
  <figure className={className}><Screen src={src} alt={alt} cap={cap} /><figcaption className="mt-3 text-[14px] text-sub">{cap}</figcaption></figure>
)
const Ann = ({ n, t, d, color }: { n: string; t: string; d?: string; color: string }) => (
  <li className="flex gap-3"><span className="shrink-0 grid place-items-center w-7 h-7 rounded-full text-[13px] font-bold text-white" style={{ background: color }}>{n}</span><div><p className="text-[16px] font-bold leading-snug">{t}</p>{d && <p className="mt-0.5 text-[14px] leading-snug text-sub">{d}</p>}</div></li>
)
const Num = ({ n, t }: { n: string; t: string }) => <div><p className="text-[56px] font-extrabold leading-none outline-text">{n}</p><h3 className="mt-3 text-[28px] md:text-[36px] font-extrabold tracking-tight leading-tight max-w-[18ch]">{t}</h3></div>

type Ctx = { p: Project; A: string; S: string; T: (n: number) => string; body: (id: string) => string[]; proto: ReactNode; wide: boolean; setOpen: (b: boolean) => void }

function Hero({ c, kicker, title, lead, children, size = 'md' }: { c: Ctx; kicker?: string; title: string; lead: string; children: ReactNode; size?: 'md' | 'xl' }) {
  const { p, S, T, setOpen } = c
  return (
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
          <div className="mt-12 md:mt-0 md:col-span-7">{children}</div>
        </div>
      </div>
    </section>
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

// ── 올리브영: 정보 비교 · 선택 흐름 ─────────────────────────────
function Olive({ c }: { c: Ctx }) {
  const { p, A, S, T } = c
  const I = (n: string) => `/images/oliveyoung-todaydream/${n}.webp`
  const cases = [['A', '일반배송 가능', '일반배송으로 구매'], ['B', '매장 픽업 확인', '매장 선택 → 옵션별 재고 확인 → 픽업 구매'], ['C', '모든 방법 품절', '재입고 알림 신청'], ['D', '재고 조회 실패', '다시 확인 (구매 가능 여부를 임의로 표시하지 않음)']]
  return (
    <>
      <Hero c={c} title="올리브영 오늘드림" lead="품절은 구매 여정의 끝이어야 할까?" kicker="비공식 개인 UX 개선 제안 · 소속 회사와 무관 · 재고·매장 데이터는 가상">
        <div className="flex items-end justify-center gap-5 md:gap-8">
          <figure className="w-[44%]"><p className="text-[13px] font-semibold mb-2 text-sub">AS-IS · 기존 앱 캡처</p><Screen src={I('ba-before')} alt="기존 옵션 선택 화면" /></figure>
          <span aria-hidden className="pb-[40%] text-[28px]" style={{ color: S }}>→</span>
          <figure className="w-[44%]"><p className="text-[13px] font-semibold mb-2" style={{ color: S }}>TO-BE · 개선안</p><Screen src={I('ba-after')} alt="개선 옵션 선택 화면" /></figure>
        </div>
      </Hero>

      <section id="c2" className="wrap gutter py-20 md:py-32 scroll-mt-20 md:mt-24">
        <ChapterHead color={S} n="01" label="The Challenge" title="품절 옵션에는 ‘일시품절’과 재입고 알림뿐" />
        <ol className="mt-10 flex flex-wrap items-center gap-2" aria-label="사용자 시나리오">{['상품 검색', '오늘드림 탐색', '상품 상세', '옵션 선택', '품절 확인', '다음 행동 탐색'].map((s, k, a) => <li key={s} className="flex items-center gap-2"><span className="px-4 py-2 rounded-full text-[14px]" style={k >= 4 ? { background: '#111', color: '#fff' } : { background: '#fff', border: '1px solid #e8e8e8' }}>{s}</span>{k < a.length - 1 && <span aria-hidden className="text-sub">→</span>}</li>)}</ol>
        <div className="mt-10 grid md:grid-cols-2 gap-5">
          {[['“오늘드림만 안 되는 걸까? 일반배송도 품절인 걸까?”', '품절 상태의 범위가 불명확'], ['“지금 사고 싶은데, 다른 방법으로 살 수 없을까?”', '대체 구매 경로를 찾기 어려움']].map(([q, t], i) => (
            <Reveal key={t} delay={i * 60}><div className="rounded-[20px] p-7 h-full" style={{ background: T(16) }}><p className="text-[13px] font-semibold" style={{ color: S }}>문제 0{i + 1}</p><p className="mt-3 text-[24px] font-bold leading-snug">{t}</p><p className="mt-4 text-[16px] text-sub">{q}</p></div></Reveal>
          ))}
        </div>
        <p className="mt-6 text-[13px] text-sub max-w-3xl">앱 리뷰·블로그 VOC 수집과 인터뷰, 실제 앱 UI 관찰에 기반한 문제 가설입니다. 원자료가 없어 표본 수와 수치는 싣지 않았고, 불편의 크기는 사용성 테스트로 검증이 필요합니다.</p>
      </section>

      <section id="c3" className="scroll-mt-20 md:mt-24" style={{ background: '#F7F8FA' }}>
        <div className="wrap gutter py-20 md:py-32">
          <ChapterHead color={S} n="02" label="Design Decisions" title="‘다른 구매 방법’을 주요 행동으로 올렸다" />
          <div className="mt-14 md:grid md:grid-cols-12 gap-10 items-start">
            <div className="md:col-span-5"><Num n="01" t="품절의 범위를 구분하고, 다음 행동을 하나로" />
              <ul className="mt-8 space-y-5"><Ann color={S} n="A" t="오늘드림 품절과 전체 품절을 구분" d="재고가 확인된 경우에만 구분해 안내합니다." /><Ann color={S} n="B" t="주요 CTA는 ‘구매 방법’ 하나" d="일반배송·픽업·알림 버튼을 늘어놓지 않아 복잡도를 낮췄습니다." /><Ann color={S} n="C" t="재입고 알림은 보조 행동으로 유지" d="모든 방법이 품절이면 주요 행동으로 올립니다." /></ul></div>
            <div className="mt-10 md:mt-0 md:col-span-7"><BeforeAfter data={p.beforeAfter!} /></div>
          </div>

          <Reveal className="mt-20 md:mt-24">
            <Num n="02" t="수령 방법별로 확인 기준을 나눴다" />
            <p className="mt-4 text-[17px] leading-[1.8] max-w-2xl">오늘드림은 배송지, 픽업은 선택한 매장 기준으로 재고를 확인합니다. 필요한 정보가 달라 대체 구매 과정의 확인 경로를 구분했습니다. 선택한 옵션과 수량은 유지합니다.</p>
            <div className="mt-10 grid md:grid-cols-12 gap-8 items-start">
              <ul className="md:col-span-5 space-y-3" aria-label="재고 상태별 흐름">{cases.map(([k, a, b]) => <li key={k} className="rounded-[20px] bg-white border border-grid p-5"><p className="text-[13px] font-bold" style={{ color: S }}>Case {k} · {a}</p><p className="mt-1 text-[16px] leading-snug">→ {b}</p></li>)}</ul>
              <div className="md:col-span-7 grid grid-cols-3 gap-4 md:gap-6"><Fig src={I('compare')} alt="수령 방법 확인" cap="수령 방법 비교" /><Fig src={I('pickup')} alt="픽업 매장 재고" cap="픽업 매장" className="md:mt-10" /><Fig src={I('restock')} alt="재입고 알림 신청" cap="재입고 알림" /></div>
            </div>
          </Reveal>

          {p.extra && (
            <Reveal className="mt-20 md:mt-24">
              <Num n="03" t="매출과 연결되는 구매 구간도 정리" />
              <p className="mt-4 text-[16px] leading-[1.8] text-sub max-w-2xl">{p.extra.intro}</p>
              <div className="mt-10 grid md:grid-cols-12 gap-8 items-start">
                <ul className="md:col-span-4 space-y-3">{p.extra.bullets.map(b => <li key={b} className="pl-4 border-l-2 text-[16px] leading-relaxed" style={{ borderColor: A }}>{b}</li>)}</ul>
                <div className="md:col-span-8 grid grid-cols-3 gap-4 md:gap-6">{p.extra.images.slice(1).map(im => <Fig key={im.src} src={im.src} alt={im.alt} cap={im.caption} />)}</div>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      <section id="c4" className="wrap gutter py-20 md:py-32 scroll-mt-20 md:mt-24">
        <ChapterHead color={S} n="03" label="Final Experience" title="옵션 선택에서 구매·알림까지" />
        <Strip label="올리브영 화면">{(p.gallery ?? []).map((g, i) => <figure key={g.src} className="w-[210px] md:w-[250px]"><p className="text-[14px] mb-3"><b style={{ color: S }}>0{i + 1}</b> <span className="text-sub">{g.caption}</span></p><Screen src={g.src} alt={g.alt} cap={g.caption} /></figure>)}</Strip>
        <InteractionPreview p={p} wide={c.wide} onOpen={() => c.setOpen(true)} title="재고 상태에 따라 직접 눌러보세요" />
      </section>

      <Outcome c={c} cards={<><div className="rounded-[20px] p-6" style={{ background: T(16) }}><p className="eyebrow text-sub">계획한 테스트 과업</p><ul className="mt-3 text-[16px] leading-relaxed list-disc pl-5"><li>오늘드림 품절 후 다른 구매 방법 찾기</li><li>다른 지역의 픽업 매장 재고 확인</li><li>원하는 옵션의 재입고 알림 신청</li><li>옵션이 많은 목록에서 구매 방법 찾기</li></ul></div><div className="rounded-[20px] p-6" style={{ background: T(16) }}><p className="eyebrow text-sub">핵심 지표</p><p className="mt-3 text-[16px] leading-relaxed">대체 경로 발견률 · 과업 성공률 · 알림 신청 성공률 · 완료 시간과 오류 횟수</p></div></>} />
    </>
  )
}

// ── 당근: 거래 정보 · 구매 판단 ──────────────────────────────
function Karrot({ c }: { c: Ctx }) {
  const { p, A, S, T } = c
  const I = (n: string) => `/images/karrot-large-furniture/${n}.webp`
  return (
    <>
      <Hero c={c} title="당근 대형 가구 중고거래" lead="채팅하기 전에 알아야 할 정보." kicker="비공식 개인 UX 개선 제안 · 소속 회사와 무관 · 당근 SEED Design 공개 토큰 기반 · 상품 정보는 예시">
        <div className="flex items-end justify-center gap-5 md:gap-8"><div className="w-[44%] md:w-[42%]"><Screen src={I('k-detail')} alt="상품 상세: 거래 정보 영역" /></div><div className="w-[44%] md:w-[42%] md:mt-12"><Screen src={I('k-questions')} alt="질문 고르기 바텀시트" /></div></div>
      </Hero>

      <section id="c2" className="wrap gutter py-20 md:py-32 scroll-mt-20 md:mt-24">
        <ChapterHead color={S} n="01" label="The Challenge" title="대형 가구는 정보가 빠지면 판단이 멈춘다" />
        <Reveal><blockquote className="mt-10 text-[28px] md:text-[40px] font-bold tracking-tight leading-snug max-w-[26ch]" style={{ borderLeft: `6px solid ${A}`, paddingLeft: 24 }}>{p.problem}</blockquote></Reveal>
        <ul className="mt-12 grid md:grid-cols-3 gap-5">{[['크기', '가로·세로·높이를 설명에서 찾아야 함'], ['분해 · 운반', '분해 가능 여부와 가져가는 조건이 문장으로 흩어짐'], ['반복 질문', '판매자에게 같은 질문을 되풀이해야 할 수 있음']].map(([a, b]) => <li key={a} className="rounded-[20px] p-6" style={{ background: T(14) }}><p className="text-[13px] font-semibold" style={{ color: S }}>{a}</p><p className="mt-2 text-[17px] leading-snug">{b}</p></li>)}</ul>
        <p className="mt-6 text-[13px] text-sub max-w-3xl">앱 리뷰·블로그 VOC와 인터뷰를 근거로 PRD 문제를 정의했습니다. 원자료가 없어 표본 수와 수치는 싣지 않았고, 발생 빈도와 영향은 사용성 테스트로 검증해야 하는 디자인 가설입니다.</p>
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
              <ul className="mt-8 space-y-5"><Ann color={S} n="A" t="분해 가능 · 분해 불가 · 잘 모르겠어요" d="‘분해 가능’을 고른 경우에만 전달 상태를 묻습니다." /><Ann color={S} n="B" t="조립된 상태 · 분해된 상태 · 협의" d="‘분해 가능’이 실제 전달 상태와 혼동되지 않게 했습니다." /><Ann color={S} n="C" t="큰 크기 값은 막지 않고 재확인" d="0 이하만 거절하고, 비정상적으로 큰 값은 다시 확인하게 합니다." /></ul></div>
            <div className="mt-10 md:mt-0 md:col-span-7 grid grid-cols-2 gap-6 md:order-1"><Fig src={I('k-form')} alt="가구 정보 입력" cap="선택형 가구 정보 입력" /><Fig src={I('k-recheck')} alt="큰 값 재확인" cap="큰 값 재확인" className="md:mt-12" /></div>
          </Reveal>

          <Reveal className="mt-20 md:mt-24 md:grid md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-5"><Num n="03" t="질문은 초안으로만, 보내는 건 사용자" />
              <ul className="mt-8 space-y-5"><Ann color={S} n="A" t="궁금한 항목만 골라 채팅 초안 생성" /><Ann color={S} n="B" t="자동 전송하지 않고 기존 입력을 보존" d="사용자가 고치고 직접 보냅니다." /><Ann color={S} n="C" t="정보가 바뀌면 변경 항목만 비교" d="이전 값이 실제로 있을 때만 전후를 보여줍니다." /></ul></div>
            <div className="mt-10 md:mt-0 md:col-span-7 grid grid-cols-3 gap-4 md:gap-6"><Fig src={I('k-questions')} alt="질문 고르기" cap="질문 고르기" /><Fig src={I('k-chat')} alt="채팅 질문 초안" cap="채팅 초안" className="md:mt-10" /><Fig src={I('k-changed')} alt="변경 내용 비교" cap="변경 비교" /></div>
          </Reveal>
        </div>
      </section>

      <section id="c4" className="wrap gutter py-20 md:py-32 scroll-mt-20 md:mt-24">
        <ChapterHead color={S} n="03" label="Final Experience" title="판매자 입력 → 구매자 확인 → 정보 변경" />
        <Strip label="당근 화면">{(p.gallery ?? []).map((g, i) => <figure key={g.src} className="w-[210px] md:w-[250px]"><p className="text-[14px] mb-3"><b style={{ color: S }}>0{i + 1}</b> <span className="text-sub">{g.caption}</span></p><Screen src={g.src} alt={g.alt} cap={g.caption} /></figure>)}</Strip>
        <p className="mt-8 max-w-3xl text-[17px] leading-[1.8]">예외 상태(조회 실패와 재시도, 거래 완료)까지 포함한 20개 화면을 클릭형 프로토타입으로 구현했습니다.</p>
        <InteractionPreview p={p} wide={c.wide} onOpen={() => c.setOpen(true)} title="입력부터 질문 초안까지" />
      </section>

      <Outcome c={c} cards={<>{[['테스트 A', '판매자 입력'], ['테스트 B', '구매자 정보 확인'], ['테스트 C', '정보 변경']].map(([a, b]) => <div key={a} className="rounded-[20px] p-6" style={{ background: T(16) }}><p className="eyebrow text-sub">{a} · 계획</p><p className="mt-2 text-[24px] font-bold">{b}</p></div>)}<p className="text-[13px] text-sub">현재 상태: 테스트 미진행.</p></>} />
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
  return (
    <>
      <section id="c1" className="overflow-hidden" style={{ background: T(13) }}>
        <div className="wrap gutter pt-10 md:pt-16 pb-14 text-center">
          <Link to="/#work" className="inline-block py-2 text-[14px] text-sub hover:text-blue">← 프로젝트 목록</Link>
          <p className="eyebrow mt-6" style={{ color: S }}>Personal Case Study · {p.category}</p>
          <h1 className="mt-4 text-[72px] md:text-[168px] font-extrabold tracking-[-0.05em] leading-[0.95]">우리사이</h1>
          <p className="mt-6 mx-auto text-[24px] md:text-[28px] font-bold leading-snug max-w-[22ch]">흩어지는 만남,<br />남지 않는 이야기.</p>
          <div className="mx-auto max-w-xl"><dl className="mt-8 grid grid-cols-3 gap-5 text-[14px] text-left rule pt-4" style={{ borderColor: T(40) }}>
            <div><dt className="text-sub text-[13px]">담당</dt><dd className="mt-1">{owner}</dd></div><div><dt className="text-sub text-[13px]">역할</dt><dd className="mt-1">{p.role}</dd></div><div><dt className="text-sub text-[13px]">기간</dt><dd className="mt-1">{p.period}</dd></div></dl></div>
          {c.proto && <button onClick={() => c.setOpen(true)} className="mt-8 px-6 py-3 rounded-full bg-ink text-white text-[16px] font-semibold">프로토타입 실행</button>}
          <ul className="mt-14 flex items-end justify-center gap-4 md:gap-8 max-w-[860px] mx-auto">
            {[['feed', '추억 피드', 'w-[28%]'], ['home', '홈', 'w-[34%]'], ['new', '새 추억 만들기', 'w-[28%]']].map(([n, a, w], i) => <li key={n} className={`${w} ${i !== 1 ? 'md:translate-y-8' : ''}`}><div className="phone-light"><img src={I(n)} alt={`우리사이 ${a} 화면`} className="screen" /></div></li>)}
          </ul>
        </div>
      </section>
      <p className="wrap gutter pt-8 text-[13px] text-sub text-center">우리사이 모바일 화면 시안 · 사진은 Unsplash 예시 이미지, 이름과 내용은 예시 데이터</p>

      <section id="c2" className="wrap gutter py-20 md:py-32 scroll-mt-20 md:mt-24">
        <ChapterHead color={S} n="01" label="The Challenge" title="한 번의 만남이 여러 서비스로 흩어진다" />
        <ol className="mt-10 flex flex-wrap items-center gap-2" aria-label="흩어지는 서비스">{['약속 → 메신저', '사진 → 각자의 갤러리', '정산 → 정산 앱', '과거 찾기 → 사진 앱'].map((s, i, a) => <li key={s} className="flex items-center gap-2"><span className="px-4 py-2 rounded-full bg-white border border-grid text-[14px]">{s}</span>{i < a.length - 1 && <span aria-hidden className="text-sub">·</span>}</li>)}</ol>
        <div className="mt-14 md:grid md:grid-cols-12 gap-10 items-start">
          <div className="md:col-span-5"><p className="eyebrow text-sub">설문 · 응답 7명 (2026.11.12-16)</p><p className="mt-3 text-[28px] font-extrabold leading-tight tracking-tight">쉽다는 답이 많았고, 초대와 기능 이동에서 막혔다</p><p className="mt-4 text-[16px] text-sub leading-relaxed">서술 의견: 친구 초대 기능을 못 찾음 · 일정 미응답자 재촉 버튼 제안 · 장소가 “서울 서울”로 표시 · 기능 구분이 불분명. 소규모 표본(20대 여성 중심)이라 방향 확인용입니다.</p></div>
          <div className="mt-8 md:mt-0 md:col-span-7 rounded-[20px] p-6 md:p-8 space-y-6" style={{ background: T(12) }}>
            {survey.map(([q, seg]) => <div key={q}><p className="text-[16px] font-semibold">{q}</p><div role="img" aria-label={seg.map(([l, n]) => `${l} ${n}명`).join(', ')} className="mt-2 flex h-3 rounded-full overflow-hidden gap-[2px]">{seg.map(([l, n], i) => <span key={l} style={{ flex: n, background: col[i] }} />)}</div><p className="mt-2 text-[13px] text-sub">{seg.map(([l, n]) => `${l} ${n}`).join(' · ')}</p></div>)}
          </div>
        </div>
      </section>

      <section id="c3" className="scroll-mt-20 md:mt-24" style={{ background: '#F7F8FA' }}>
        <div className="wrap gutter py-20 md:py-32">
          <ChapterHead color={S} n="02" label="Design Decisions" title="함께 쓰고, 다시 찾고, 보이는 범위는 하나로" />
          <Reveal className="mt-14 md:grid md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-5"><Num n="01" t="사람을 고르면, 각자의 사진과 이야기가 한 추억에 모인다" />
              <ul className="mt-8 space-y-5"><Ann color={S} n="A" t="첫 CTA는 ‘그룹 만들기’가 아니라 ‘추억 만들기’" d="그룹 없이 사람을 골라 바로 시작합니다." /><Ann color={S} n="B" t="초대를 수락한 사람만 보고 더한다" d="사진·글·댓글·좋아요를 함께 쌓습니다." /></ul></div>
            <div className="mt-10 md:mt-0 md:col-span-7 grid grid-cols-3 gap-4 md:gap-6"><Fig src={I('detail')} alt="공동 게시물 상세" cap="추억 상세" /><Fig src={I('add')} alt="내 사진과 이야기 더하기" cap="사진·이야기 더하기" className="md:mt-12" /><Fig src={I('people')} alt="볼 수 있는 사람 확인" cap="볼 수 있는 사람" /></div>
          </Reveal>
          <Reveal className="mt-20 md:mt-24 md:grid md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-5 md:order-2"><Num n="02" t="사람·장소·시간으로 다시 발견한다" />
              <ul className="mt-8 space-y-5"><Ann color={S} n="A" t="달력·목록·지역별 발자국" d="사람·그룹·연도 필터로 추억을 좁힙니다." /><Ann color={S} n="B" t="지역을 열면 구 단위까지" d="‘서울 > 마포구’처럼 세부 지역으로 내려갑니다." /></ul></div>
            <div className="mt-10 md:mt-0 md:col-span-7 grid grid-cols-3 gap-4 md:gap-6 md:order-1"><Fig src={I('calendar')} alt="추억 달력" cap="달력" /><Fig src={I('foot')} alt="우리의 발자국" cap="우리의 발자국" className="md:mt-12" /><Fig src={I('region')} alt="지역별 추억" cap="지역별 추억" /></div>
          </Reveal>
          <Reveal className="mt-20 md:mt-24"><blockquote className="text-[24px] md:text-[40px] font-bold tracking-tight leading-snug max-w-[26ch]">그룹은 편의를 위한 묶음, 모임은 특정 시점의 약속, 공동 게시물은 실제로 공유하기로 한 추억이다.</blockquote>
            <ul className="mt-10 grid md:grid-cols-3 gap-4">{['열람 권한은 게시물 멤버(초대 수락자)만 결정', '그룹·약속 초대·참석 응답은 권한의 근거가 아님', '지도·회상 같은 파생 뷰는 원본 권한보다 넓지 않음'].map((t, i) => <li key={t} className="rounded-[20px] bg-white border border-grid p-5 flex gap-4"><span className="text-[24px] font-extrabold" style={{ color: S }}>0{i + 1}</span><p className="text-[16px] leading-snug">{t}</p></li>)}</ul></Reveal>
        </div>
      </section>

      <section id="c4" className="wrap gutter py-20 md:py-32 scroll-mt-20 md:mt-24">
        <ChapterHead color={S} n="03" label="Final Experience" title="추억을 만들고, 약속을 잡고, 다시 발견하기" />
        <ul className="mt-14 columns-2 md:columns-3 gap-5 md:gap-8 [&>li]:mb-5 md:[&>li]:mb-8 [&>li]:break-inside-avoid">
          {['home', 'photo', 'plan', 'feed', 'space', 'new'].map(n => <li key={n}><Screen src={I(n)} alt={`우리사이 화면 ${n}`} cap={({ home: '홈', photo: '사진으로 시작', plan: '초대받은 약속 · 참석 응답', feed: '추억 피드', space: '우리 공간', new: '새 추억 만들기' } as Record<string, string>)[n]} /></li>)}
        </ul>
        <InteractionPreview p={p} wide={c.wide} onOpen={() => c.setOpen(true)} title="이전 버전 프로토타입" note="화면 시안과 세부가 다를 수 있습니다." />
      </section>

      <Outcome c={c} cards={<>{[['7', '설문 응답 (2026.11.12-16)'], ['통과', '서버 권한 시나리오 테스트 (마지막 실행)']].map(([n, l]) => <div key={l} className="rounded-[20px] p-6" style={{ background: T(16) }}><p className="text-[48px] md:text-[64px] font-extrabold leading-none" style={{ color: S }}>{n}</p><p className="mt-2 text-[16px]">{l}</p></div>)}<p className="text-[13px] text-sub">설문은 소규모 표본, 권한 테스트는 자동화된 서버 테스트입니다. 사용자 테스트 결과가 아닙니다.</p></>} />
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
      <ChapterNav active={active} list={list} />
      {View ? <View c={c} /> : <NotFound />}
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
