import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects, TODO } from '../data/projects'
import Reveal from '../components/Reveal'
import BeforeAfter from '../components/BeforeAfter'
import { Modal, Zoomable } from '../components/Modal'
import { ProtoFrame, owner, useMedia } from '../components/Mockup'
import { ChapterHead, ChapterNav, InteractionPreview, tintOf, strongOf, useActive, CaseSummary, ProjectIndex, AppIcon } from '../components/case'
import Strip from '../components/Strip'

gsap.registerPlugin(ScrollTrigger)

const p = projects.find(x => x.slug === 'nodi')!
const next = projects.find(x => x.slug === 'oliveyoung-todaydream')!
const T = (n: number) => tintOf('#6F8BFF', n)
const S = strongOf(p.accent)
const body = (id: string) => p.sections.find(s => s.id === id && s.body !== TODO)?.body ?? ''
const paras = (id: string) => body(id).split('\n\n').filter(Boolean)
const img = (n: string) => `/images/nodi/hi-${n}.webp`

const pains = [
  { pain: '시간을 물었는데 응답이 없어, 같은 사람에게 계속 리마인드해야 한다', fix: '응답 현황 · 리마인드', shot: 'progress' },
  { pain: '참석자들의 조건을 내가 직접 분석해 시간을 정해야 한다', fix: '자연어 조건 입력 · 추천 시간과 이유', shot: 'recs' },
  { pain: '확정한 뒤 변경이 생기면 조율을 처음부터 다시 해야 한다', fix: '재조율 · 이전 회의 재사용', shot: 'reschedAsk' },
]
const flow: [string, string][] = [['home', '자연어로 입력'], ['conds', '조건 확인'], ['sheetEdit', '조건 수정'], ['sheetPick', '참석자 선택'], ['required', '일정 필수 설정'], ['progress', '조율 현황'], ['recs', '추천 시간'], ['review', '최종 검토'], ['done', '저장 완료'], ['meetings', '내 회의'], ['detail', '회의 상세'], ['reschedAsk', '재조율 확인'], ['resched', '새 시간 조율'], ['changes', '변경 내용 검토'], ['inbox', '받은 요청'], ['respond', '가능 시간 응답'], ['changedReq', '변경된 요청'], ['reuse', '이전 회의 재사용'], ['reuseConds', '재사용 후 조건 확인']]
const swatches: [string, string][] = [['Primary', '#3654D4'], ['Navy', '#18243A'], ['Canvas', '#F5F7FB'], ['Text sub', '#5B6B81'], ['Border', '#E2E8F0']]

const Shot = ({ n, cap, className = '' }: { n: string; cap: string; className?: string }) => (
  <figure className={className}>
    <Zoomable src={img(n)} alt={`NODI ${cap} 화면`} caption={cap} className="w-full" imgClass="phone-bare" />
    <figcaption className="mt-3 text-[14px] text-sub">{cap}</figcaption>
  </figure>
)
const Callout = ({ n, t, d }: { n: string; t: string; d: string }) => (
  <li className="flex gap-3"><span className="shrink-0 grid place-items-center w-7 h-7 rounded-full text-[13px] font-bold text-white" style={{ background: p.accent }}>{n}</span><div><p className="text-[16px] font-bold leading-snug">{t}</p><p className="mt-0.5 text-[14px] leading-snug text-sub">{d}</p></div></li>
)

export default function CaseNodi() {
  const root = useRef<HTMLElement>(null)
  const active = useActive('nodi')
  const [open, setOpen] = useState(false)
  const wide = useMedia('(min-width: 1024px)')

  useEffect(() => { document.title = `${p.name} | Portfolio 2026`; return () => { document.title = 'Portfolio 2026 | Complexity → Clarity' } }, [])
  useLayoutEffect(() => {
    const q = gsap.utils.selector(root)
    const mm = gsap.matchMedia()
    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      q('[data-rise]').forEach((el, i) => gsap.fromTo(el, { y: 24 + i * 16 }, { y: -8 - i * 10, ease: 'none', scrollTrigger: { trigger: q('#c1')[0], start: 'top top', end: 'bottom top', scrub: true } }))
    })
    return () => mm.revert()
  }, [])
  const validation = paras('validation')

  return (
    <article ref={root} style={{ ['--brand' as string]: p.accent }}>
      <ChapterNav active={active} title="NODI" />

      {/* Hero */}
      <section id="c1" className="overflow-hidden" style={{ background: T(9) }}>
        <div className="wrap gutter pt-10 md:pt-16 pb-16 md:pb-24">
          <Link to="/#work" className="inline-block py-2 text-[14px] text-sub hover:text-blue">← 프로젝트 목록</Link>
          <div className="mt-6 md:grid md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-6">
              <AppIcon src="/images/nodi/icon.svg" name="NODI" className="mb-5" />
              <p className="eyebrow" style={{ color: S }}>Personal Case Study · {p.category}</p>
              <h1 className="mt-4 text-[88px] md:text-[168px] font-extrabold tracking-[-0.055em] leading-[0.88]">NODI</h1>
              <p className="mt-8 text-[28px] md:text-[40px] font-extrabold leading-[1.2] tracking-tight">AI는 이해하고<br />사용자는 결정한다.</p>
              <p className="mt-5 text-[17px] leading-[1.7] text-sub max-w-[24ch] md:max-w-[22ch]">복잡한 회의 조율 과정을 사용자가 이해하고 직접 결정할 수 있게 설계했어요.</p>
              <dl className="mt-8 grid grid-cols-3 gap-5 max-w-lg text-[16px] rule pt-4" style={{ borderColor: T(30) }}>
                <div><dt className="text-sub text-[13px]">담당</dt><dd className="mt-1">{owner}</dd></div>
                <div><dt className="text-sub text-[13px]">역할</dt><dd className="mt-1">{p.role}</dd></div>
                <div><dt className="text-sub text-[13px]">기간</dt><dd className="mt-1">{p.period}</dd></div>
              </dl>
              {p.proto && <button onClick={() => setOpen(true)} className="mt-8 px-6 py-3 rounded-full bg-ink text-white text-[16px] font-semibold">프로토타입 실행</button>}
            </div>
            <div className="mt-14 md:mt-0 md:col-span-6 relative flex justify-center md:justify-end gap-4 md:gap-0">
              <div data-rise className="relative w-[58%] md:w-[62%] z-10">
                <img src={img('conds')} alt="NODI 조건 확인 화면: AI가 정리한 회의 조건" className="phone-bare" />
                <ul className="hidden md:block absolute -left-40 top-[22%] w-36 space-y-24 text-[13px] leading-snug">
                  <li className="rounded-[12px] bg-white p-3 shadow-sm border border-grid"><b style={{ color: S }}>① AI가 정리</b><br />자연어를 회의 조건 카드로</li>
                  <li className="rounded-[12px] bg-white p-3 shadow-sm border border-grid"><b style={{ color: S }}>② 사용자가 수정</b><br />조건 항목별 수정·직접 입력</li>
                </ul>
              </div>
              <div data-rise className="w-[38%] md:w-[34%] mt-16 md:mt-24 md:-ml-8"><img src={img('review')} alt="NODI 최종 검토 화면: 사용자가 일정을 확정" className="phone-bare" /></div>
            </div>
          </div>
          {/* 모바일용 주석 */}
          <ul className="md:hidden mt-8 grid grid-cols-2 gap-3 text-[14px] leading-snug">
            <li className="rounded-[12px] bg-white p-3 border border-grid"><b style={{ color: S }}>① AI가 정리</b><br />자연어를 조건 카드로</li>
            <li className="rounded-[12px] bg-white p-3 border border-grid"><b style={{ color: S }}>② 사용자가 확정</b><br />최종 검토 후 확정</li>
          </ul>
        </div>
      </section>
      <CaseSummary p={p} />

      <section aria-label="프로젝트 이해하기" className="wrap gutter pt-20 md:pt-28">
        <p className="eyebrow" style={{ color: S }}>새로 만든 서비스 · 0→1</p>
        <h2 className="mt-3 apple-h text-[30px] md:text-[48px] max-w-[22ch]">비교할 기존 앱이 없어서 회의 조율 경험을 처음부터 설계했어요</h2>

        <Reveal stagger className="mt-10 grid md:grid-cols-3 gap-3 md:gap-5">
          {[['01', 'NODI는 어떤 서비스인가요?', '회의 조건을 말로 입력하면 AI가 조건을 정리하고 참석자의 일정을 확인해 알맞은 시간을 추천해 주는 서비스예요. 확정은 사용자가 직접 해요.'],
            ['02', '왜 만들었나요?', '직장인 6명을 인터뷰하니 회의를 잡을 때 세 가지가 스트레스였어요. 답 없는 사람에게 계속 물어야 하고 조건을 직접 분석해야 하고 확정한 뒤 바뀌면 처음부터 다시 맞춰야 해요.'],
            ['03', '어떻게 설계했나요?', 'AI가 하는 일과 사용자가 정하는 일을 나눴어요. AI는 이해하고 설명하고 사용자는 참석자·날짜·후보를 직접 고르고 확정해요.']].map(([n, t, d]) => (
            <div key={n} className="rounded-[24px] p-6 md:p-7" style={{ background: tintOf(p.accent, 14) }}><p className="text-[13px] font-bold" style={{ color: S }}>{n}</p><h3 className="mt-2 text-[20px] md:text-[22px] font-bold tracking-tight">{t}</h3><p className="mt-3 text-[16px] leading-[1.75] text-ink/80">{d}</p></div>
          ))}
        </Reveal>

        <div className="mt-6 md:mt-8 grid md:grid-cols-2 gap-4 md:gap-6">
          <div className="rounded-[24px] border border-grid p-6 md:p-8">
            <span className="inline-block px-3 py-1 rounded-full text-[13px] font-bold bg-[#e8e8e8]">지금 사람들이 하는 방식</span>
            <ol aria-label="지금의 회의 조율 방식" className="mt-5 flex flex-wrap items-center gap-2 text-[15px]">
              <li className="px-4 py-2 rounded-full bg-[#f5f5f7]">메신저로 일정 묻기</li><li aria-hidden className="text-sub">→</li>
              <li className="px-4 py-2 rounded-full bg-[#fdeaea] text-[#a12a2a] font-semibold">답 없는 사람 재촉</li><li aria-hidden className="text-sub">→</li>
              <li className="px-4 py-2 rounded-full bg-[#f5f5f7]">조건 직접 분석</li><li aria-hidden className="text-sub">→</li>
              <li className="px-4 py-2 rounded-full bg-[#fdeaea] text-[#a12a2a] font-semibold">변경되면 처음부터</li>
            </ol>
            <p className="mt-4 text-[15px] leading-[1.7] text-sub">인터뷰에서 나온 스트레스를 이어 그린 흐름이에요. 특정 앱을 가리키는 것이 아니에요.</p>
          </div>
          <div className="rounded-[24px] p-6 md:p-8" style={{ background: tintOf(p.accent, 16), border: `1px solid ${tintOf(p.accent, 36)}` }}>
            <span className="inline-block px-3 py-1 rounded-full text-[13px] font-bold text-white" style={{ background: p.accent }}>NODI</span>
            <ol aria-label="NODI의 흐름" className="mt-5 flex flex-wrap items-center gap-2 text-[15px]">
              <li className="px-4 py-2 rounded-full bg-white">말로 조건 입력</li><li aria-hidden className="text-sub">→</li>
              <li className="px-4 py-2 rounded-full bg-white">응답 현황·리마인드</li><li aria-hidden className="text-sub">→</li>
              <li className="px-4 py-2 rounded-full text-white font-semibold" style={{ background: p.accent }}>추천 시간과 이유</li><li aria-hidden className="text-sub">→</li>
              <li className="px-4 py-2 rounded-full bg-white">사용자가 확정</li><li aria-hidden className="text-sub">→</li>
              <li className="px-4 py-2 rounded-full bg-white">바뀌면 재조율</li>
            </ol>
            <p className="mt-4 text-[15px] leading-[1.7] text-ink/80">세 가지 스트레스를 각각 기능으로 풀었어요. 이 설계안은 아직 사용성 테스트를 하지 않았어요.</p>
          </div>
        </div>
      </section>

      {/* 01 Challenge */}
      <section id="c2" className="wrap gutter py-20 md:py-32 scroll-mt-20 md:mt-24">
        <ChapterHead color={S} n="01" label="The Challenge" title="회의를 잡는 사람의 세 가지 스트레스" />
        <p className="mt-5 text-[16px] inline-block px-4 py-2 rounded-full font-semibold" style={{ background: T(14), color: S }}>직장인 6명 · 카카오톡 인터뷰</p>
        <ol className="mt-10 grid md:grid-cols-3 gap-5">
          {pains.map((x, i) => (
            <li key={i}><Reveal delay={i * 60}>
              <div className="rounded-[20px] border border-grid p-6 h-full flex flex-col">
                <span className="text-[48px] font-extrabold leading-none num-brand">0{i + 1}</span>
                <p className="mt-4 text-[18px] font-semibold leading-snug">{x.pain}</p>
                <div className="mt-6 pt-4 border-t border-grid"><p className="text-[13px] text-sub">NODI의 대응</p><p className="mt-1 text-[16px] font-semibold" style={{ color: S }}>{x.fix}</p></div>
                <div className="mt-5 mx-auto w-[44%] mt-auto pt-5"><img src={img(x.shot)} alt={`${x.fix} 화면`} loading="lazy" className="phone-bare" /></div>
              </div>
            </Reveal></li>
          ))}
        </ol>
        <div className="mt-16 rounded-[28px] p-7 md:p-10" style={{ background: T(9) }}>
          <p className="eyebrow" style={{ color: S }}>Core Insight</p>
          <p className="mt-4 text-[24px] md:text-[32px] font-extrabold leading-[1.3] tracking-tight max-w-[28ch]">정보를 많이 주는 것보다, 지금 결정에 필요한 정보를 알맞은 순서로 주는 것이 중요하다.</p>
          <p className="mt-4 text-[15px] leading-relaxed text-sub max-w-2xl">인터뷰에서 나온 세 가지 스트레스(반복 확인, 직접 분석, 처음부터 다시 조율)와 설계 점검에서 발견한 정보 과밀 문제를 함께 보고 정리한 설계 가설이에요. 아직 사용자 테스트로 검증하지 않았어요.</p>
        </div>
        <p className="mt-14 eyebrow text-sub">Design Strategy · 4 principles → 실제 UI 결정</p>
        <ul className="mt-5 grid md:grid-cols-2 gap-4">{[['Text-first', '배지·상태 칩·CTA에는 아이콘 없이 텍스트만 쓴다. 아이콘은 하단 내비게이션(아이콘+문구)에만 둔다.'], ['Clear Hierarchy', '화면 제목, 현재 단계(1/5…5/5)와 다음 단계를 항상 같은 자리에 둔다. 글자 크기는 13·14·16·18·24·28 스케일.'], ['Progressive Disclosure', '추천 이유는 바텀시트로, 알고리즘 설명은 접어 둔다. 항목별 수정은 시트에서 한다.'], ['Action-focused', '화면마다 파란 주요 버튼은 하나, 보조 행동은 텍스트 링크로 둔다(예: 회의 확정하기 / 다른 시간 보기).']].map(([a, b], i) => <li key={a} className="rounded-[20px] bg-white border border-grid p-5"><p className="text-[13px] font-semibold" style={{ color: S }}>0{i + 1}</p><p className="mt-1 text-[18px] font-bold">{a}</p><p className="mt-2 text-[15px] leading-snug text-sub">{b}</p></li>)}</ul>
        <p className="mt-6 text-[13px] text-sub">※ 인터뷰 원자료와 구체적 응답은 확인 필요. 웹 조사와 Codex 정리는 AI가 정리한 보조 자료입니다.</p>
      </section>

      {/* 02 Design Decisions */}
      <section id="c3" className="scroll-mt-20 md:mt-24" style={{ background: '#F7F8FB' }}>
        <div className="wrap gutter py-20 md:py-32">
          <ChapterHead color={S} n="02" label="Design Decisions" title="AI가 하는 일과 사용자가 정하는 일을 나눴다" />

          {/* 01 role board */}
          <div className="mt-14 grid md:grid-cols-2 gap-6">
            {[
              { h: 'AI가 하는 일', c: p.accent, items: [['conds', '자연어를 조건 카드로 정리'], ['recs', '추천 시간과 이유를 설명']] },
              { h: '사용자가 정하는 일', c: '#18243A', items: [['sheetPick', '참석자 선택 · 필수 지정'], ['review', '최종 검토 후 확정']] },
            ].map(col => (
              <Reveal key={col.h}><div className="rounded-[28px] bg-white border border-grid p-6 md:p-8 h-full">
                <p className="text-[20px] font-extrabold" style={{ color: col.c }}>{col.h}</p>
                <div className="mt-6 grid grid-cols-2 gap-5">{col.items.map(([n, c]) => <Shot key={n} n={n} cap={c} />)}</div>
              </div></Reveal>
            ))}
          </div>
          <p className="mt-6 max-w-3xl text-[17px] leading-[1.8]">AI는 자연어 이해와 설명을 맡고, 참석자 선택·날짜 변경·후보 선택은 구조화된 UI로 처리합니다. <b>최종 확정은 명시적인 사용자 행동으로만</b> 이뤄집니다.</p>

          {/* 02 */}
          <Reveal className="mt-20 md:mt-24 md:grid md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-5">
              <p className="text-[56px] font-extrabold leading-none num-brand">02</p>
              <h3 className="mt-3 text-[28px] md:text-[36px] font-extrabold tracking-tight leading-tight">참석자 선택과 필수 지정은 다른 의미</h3>
              <ul className="mt-8 space-y-5">
                <Callout n="A" t="선택 = 회의에 포함할 사람" d="다중 선택, 검색, 팀 필터를 지원합니다." />
                <Callout n="B" t="필수 = 일정 조건을 반드시 충족할 사람" d="필수 지정은 참석 수락을 뜻하지 않습니다." />
              </ul>
            </div>
            <div className="mt-10 md:mt-0 md:col-span-7 grid grid-cols-2 gap-6"><Shot n="sheetPick" cap="참석자 선택" /><Shot n="progress" cap="조율 현황 · 응답 대기" className="md:mt-16" /></div>
          </Reveal>

          {/* 03 */}
          <Reveal className="mt-20 md:mt-24 md:grid md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-5 md:order-2">
              <p className="text-[56px] font-extrabold leading-none num-brand">03</p>
              <h3 className="mt-3 text-[28px] md:text-[36px] font-extrabold tracking-tight leading-tight">성공처럼 보이는 것과 실제 처리를 구분</h3>
              <ul className="mt-8 space-y-5">
                <Callout n="A" t="일정 가능 · 참석 수락 · 캘린더 · 알림을 분리" d="서로 다른 개념으로 따로 표시합니다." />
                <Callout n="B" t="데모 기능을 성공처럼 보이지 않게" d="캘린더 미연결, 알림 데모는 상태 그대로 표시합니다." />
                <Callout n="C" t="필수 참석자가 충돌하면 충족으로 표시하지 않음" d="추천 후보의 상태 칩에 반영합니다." />
              </ul>
            </div>
            <div className="mt-10 md:mt-0 md:col-span-7 grid grid-cols-2 gap-6 md:order-1"><Shot n="done" cap="저장 완료 · 후속 처리 현황" /><Shot n="recs" cap="추천 후보 · 상태 칩" className="md:mt-16" /></div>
          </Reveal>

          {/* tokens + states */}
          <Reveal className="mt-20 md:mt-24 md:grid md:grid-cols-12 gap-10 items-start">
            <div className="md:col-span-5 rounded-[20px] bg-white border border-grid p-6 md:p-8">
              <p className="eyebrow text-sub">Design tokens · 문서 기준</p>
              <ul className="mt-5 grid grid-cols-5 gap-2">{swatches.map(([n, c]) => <li key={n}><span className="block aspect-square rounded-[12px] border border-grid" style={{ background: c }} /><span className="mt-2 block text-[13px] leading-tight">{n}<br /><span className="text-sub">{c}</span></span></li>)}</ul>
              <p className="mt-6 text-[16px] leading-relaxed text-sub">글자 13·14·16·18·24·28 · 4px 격자 · 터치 44px · 칩과 CTA는 아이콘 없이 텍스트만</p>
            </div>
            <div className="mt-10 md:mt-0 md:col-span-7">
              <p className="eyebrow text-sub">실패와 예외 상태</p>
              <div className="mt-5 grid grid-cols-3 gap-4 md:gap-6">{[['aiFail', 'AI 해석 실패'], ['pickEmpty', '검색 결과 없음'], ['recLoading', '추천 계산 중'], ['recError', '추천 계산 오류'], ['recNone', '추천 후보 없음'], ['reschedNone', '재조율 후보 없음']].map(([n, l]) => <Shot key={n} n={n} cap={l} />)}</div>
            </div>
          </Reveal>
          <Reveal className="mt-24">
            <p className="eyebrow rule pt-4" style={{ color: S }}>Iteration · 정보 과밀 문제 해결</p>
            <h3 className="mt-4 text-[28px] md:text-[40px] font-extrabold tracking-tight leading-[1.15] max-w-[22ch]">정보를 빠짐없이 보여주려다, 정작 중요한 정보가 읽히지 않았다</h3>
            <div className="mt-8 md:grid md:grid-cols-12 gap-8">
              <div className="md:col-span-6"><p className="text-[13px] font-semibold text-sub">무엇이 문제였나 · 설계 점검에서 확인</p>
                <ul className="mt-3 text-[15px] leading-relaxed list-disc pl-5">{['카드 안에 카드가 중첩되고, 배지·상태 칩이 많았다(알약 모양 46곳)', '같은 정보가 여러 곳에 반복됐다(조율 진행의 응답 수 4곳 등)', '큰 3D 일러스트와 비슷한 비중의 버튼, 항상 보이는 비활성 버튼', '파란색 신호가 서로 부딪히고, 헤더 규칙과 카드 모서리(12/14/16/20/24)가 제각각이었다'].map(x => <li key={x}>{x}</li>)}</ul></div>
              <div className="mt-8 md:mt-0 md:col-span-6"><p className="text-[13px] font-semibold text-sub">어떤 기준으로 바꿨나</p>
                <ul className="mt-3 text-[15px] leading-relaxed list-disc pl-5">{['아이콘·중복 설명 제거, 텍스트 중심으로(3D 일러스트 → 2D 상태 아이콘)', '핵심 정보를 먼저 보이고 상세는 단계적으로(추천 이유 바텀시트, 알고리즘 설명 접기)', '화면마다 주요 버튼 하나를 강조하고 보조는 텍스트 링크로', '조건 확인 카드를 압축(날짜·시간 2열, 참석자 중복 안내 제거)'].map(x => <li key={x}>{x}</li>)}</ul></div>
            </div>
          </Reveal>
          {p.beforeAfter?.map((b, i) => <div key={b.before} className="mt-14"><div className="max-w-[62ch]"><p className="eyebrow rule pt-4 text-sub">초기 시안 → 개선 시안 · {['조건 확인', '추천 시간', '저장 완료'][i]}</p><p className="mt-4 text-[15px] text-sub">NODI는 기존 서비스가 없는 신규 서비스라 비교 대상은 제가 처음 만든 시안이에요. 왼쪽은 초기 시안(v5.2) 오른쪽은 개선 시안이에요.</p></div><div className="mt-6"><BeforeAfter data={b} color={S} beforeLabel="초기 시안" afterLabel="개선 시안" /></div></div>)}
          <p className="mt-10 text-[15px] leading-relaxed text-sub max-w-3xl">변경이 사용자의 이해와 행동에 미친 영향은 아직 확인하지 못했어요. 대신 터치 영역 44px·글자 13px 기준과 클릭 시나리오 19개로 구현 품질을 점검했고, 이해도 검증은 아래 계획으로 진행해요.</p>
        </div>
      </section>

      {/* 03 Final Experience */}
      <section id="c4" className="wrap gutter py-20 md:py-32 scroll-mt-20 md:mt-24">
        <ChapterHead color={S} n="03" label="Final Experience" title="입력부터 확정까지, 하나의 흐름" />
        <div className="mt-14"><Strip label="NODI 사용 흐름 화면">
          {flow.map(([n, l], i) => (
            <figure key={n} className="w-[210px] md:w-[250px]">
              <p className="text-[14px] mb-3"><b style={{ color: S }}>0{i + 1}</b> <span className="text-sub">{l}</span></p>
              <Zoomable src={img(n)} alt={`NODI ${l} 화면`} caption={l} imgClass="phone-bare" />
            </figure>
          ))}
        </Strip></div>
        <p className="mt-8 max-w-3xl text-[17px] leading-[1.8]">재조율, 받은 요청과 응답, 이전 회의 재사용, 작성 중 이어하기까지 포함해 26개 아트보드로 구현했습니다.</p>
        <InteractionPreview p={p} wide={wide} onOpen={() => setOpen(true)} title="직접 눌러보세요" note="화면 이미지는 v6 시안과 세부가 다를 수 있습니다." />
      </section>

      {/* 04 Outcome */}
      <section id="c5" className="scroll-mt-20 md:mt-24 rule">
        <div className="wrap gutter py-20 md:py-32">
          <ChapterHead color={S} n="04" label="Outcome & Reflection" title="점검한 것과 아직 확인하지 못한 것" />
          <div className="mt-14 md:grid md:grid-cols-12 gap-10">
            <ul className="md:col-span-5 grid grid-cols-3 md:grid-cols-1 gap-4">
              {[['0', '44px 미만 터치 영역'], ['0', '13px 미만 글자'], ['19', '클릭 시나리오 통과']].map(([n, l]) => (
                <li key={l} className="rounded-[20px] p-5 md:p-7" style={{ background: T(9) }}>
                  <p className="text-[44px] md:text-[72px] font-extrabold leading-none tracking-tight" style={{ color: S }}>{n}</p>
                  <p className="mt-2 text-[14px] md:text-[16px]">{l}</p>
                </li>
              ))}
              <li className="col-span-3 md:col-span-1 text-[13px] text-sub leading-relaxed">자체 점검 스크립트 기준입니다. 사용자 테스트 결과가 아닙니다.</li>
            </ul>
            <div className="md:col-span-7 mt-10 md:mt-0 text-[17px] leading-[1.8] space-y-4">
              {validation.map(t => <p key={t} className={t.startsWith('확인 필요') ? 'text-sub' : ''}>{t}</p>)}
            </div>
          </div>
          <div className="mt-16 rounded-[28px] p-7 md:p-10 bg-[#F7F8FA]">
            <p className="inline-flex px-3 py-1.5 rounded-full bg-ink text-white text-[13px] font-semibold">검증 계획 · 아직 수행하지 않음</p>
            <h3 className="mt-4 text-[24px] md:text-[32px] font-extrabold tracking-tight leading-tight max-w-[24ch]">프로토타입으로 확인할 일곱 가지</h3>
            <ol className="mt-6 grid sm:grid-cols-2 gap-3 text-[15px] leading-snug">{['조건 확인 정확도', '조건 수정 성공률', '필수 참석자 설정 성공 여부', '추천 후보 비교 성공률', '후보 선택 소요 시간', '저장 상태 이해 정확도(저장·캘린더·알림 구분)', '오류 상황에서 다음 행동 선택 여부'].map((x, i) => <li key={x} className="rounded-[20px] bg-white p-4"><span className="text-[13px] font-semibold" style={{ color: S }}>0{i + 1}</span> {x}</li>)}</ol>
            <p className="mt-5 text-[15px] leading-relaxed text-sub max-w-3xl">방법: 과제를 주고 프로토타입 조작을 관찰하며, 혼란이 생긴 지점과 발화를 기록한 뒤 초기·개선 시안의 행동을 비교하고 재설계해요. 수행 전이라 수치나 인용문은 싣지 않았어요.</p>
          </div>
        </div>
      </section>

      <ProjectIndex current={'nodi'} />
      <Link to={`/work/${next.slug}`} className="group block rule">
        <div className="wrap gutter py-14 md:py-20 flex items-end justify-between gap-6">
          <div><p className="eyebrow text-sub">다음 프로젝트</p><p className="mt-3 text-[32px] md:text-[56px] font-extrabold tracking-tight leading-none group-hover:text-blue">{next.name}</p></div>
          <span className="px-5 py-3 rounded-full bg-ink text-white text-[14px] shrink-0">이어서 보기</span>
        </div>
      </Link>
      <Modal open={open} onClose={() => setOpen(false)} label="NODI 프로토타입"><div className="flex justify-center pt-14"><ProtoFrame p={p} width={320} /></div></Modal>
    </article>
  )
}
