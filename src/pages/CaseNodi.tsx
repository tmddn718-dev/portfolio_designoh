import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects, TODO } from '../data/projects'
import Reveal from '../components/Reveal'
import BeforeAfter from '../components/BeforeAfter'
import { ExtendedPhoneScreen, UIPopout } from '../components/LongScreen'
import { Modal, Zoomable } from '../components/Modal'
import { ProtoFrame, owner, useMedia } from '../components/Mockup'
import { ChapterHead, ChapterNav, InteractionPreview, tintOf, strongOf, useActive, CaseSummary, ProjectIndex, AppIcon } from '../components/case'
import Strip from '../components/Strip'
import BrowserFrame from '../components/BrowserFrame'

gsap.registerPlugin(ScrollTrigger)

const p = projects.find(x => x.slug === 'nodi')!
const next = projects.find(x => x.slug === 'oliveyoung-todaydream')!
const T = (n: number) => tintOf('#6F8BFF', n)
const S = strongOf(p.accent)
const body = (id: string) => p.sections.find(s => s.id === id && s.body !== TODO)?.body ?? ''
const paras = (id: string) => body(id).split('\n\n').filter(Boolean)
const img = (n: string) => `/images/nodi/hi-${n}.webp`
const full = (n: string) => `/images/nodi/full-${n}.webp` // 스크롤되는 전체 화면(원본 비율)
const list = [['c1', '개요'], ['bg', '배경'], ['sol', '솔루션'], ['impl', '구현 범위'], ['ref', '회고'], ['more', '보조 화면']]

const flow: [string, string][] = [['home', '자연어로 입력'], ['conds', '조건 확인'], ['sheetEdit', '조건 수정'], ['sheetPick', '참석자 선택'], ['required', '일정 필수 설정'], ['progress', '조율 현황'], ['recs', '추천 시간'], ['review', '최종 검토'], ['done', '저장 완료'], ['meetings', '내 회의'], ['detail', '회의 상세'], ['reschedAsk', '재조율 확인'], ['resched', '새 시간 조율'], ['changes', '변경 내용 검토'], ['inbox', '받은 요청'], ['respond', '가능 시간 응답'], ['changedReq', '변경된 요청'], ['reuse', '이전 회의 재사용'], ['reuseConds', '재사용 후 조건 확인']]
const swatches: [string, string][] = [['Primary', '#3654D4'], ['Navy', '#18243A'], ['Canvas', '#F5F7FB'], ['Text sub', '#5B6B81'], ['Border', '#E2E8F0']]

const Shot = ({ n, cap, className = '' }: { n: string; cap: string; className?: string }) => (
  <figure className={className}>
    <Zoomable src={img(n)} big={full(n)} alt={`NODI ${cap} 화면`} caption={cap} className="w-full" imgClass="phone-bare" />
    <figcaption className="mt-3 text-[14px] text-sub">{cap}</figcaption>
  </figure>
)
const Callout = ({ n, t, d }: { n: string; t: string; d: string }) => (
  <li className="flex gap-3"><span className="shrink-0 grid place-items-center w-7 h-7 rounded-full text-[13px] font-bold text-white" style={{ background: p.accent }}>{n}</span><div><p className="text-[16px] font-bold leading-snug">{t}</p><p className="mt-0.5 text-[14px] leading-snug text-sub">{d}</p></div></li>
)


const Head = ({ label, children, className = '', sm = false }: { label: string; children: React.ReactNode; className?: string; sm?: boolean }) => (
  <Reveal className={className}>
    <p className="eyebrow rule pt-4" style={{ color: S, borderColor: T(40) }}>{label}</p>
    <h2 className={`mt-4 apple-h ${sm ? 'text-[28px] md:text-[40px] max-w-[18ch]' : 'text-[30px] md:text-[52px] max-w-[22ch]'}`}>{children}</h2>
  </Reveal>
)
const Ph = ({ n, cap, className = '' }: { n: string; cap: string; className?: string }) => (
  <figure className={className}>
    <Zoomable src={full(n)} alt={`NODI ${cap} 화면`} caption={cap} className="phone-pro w-full" imgClass="screen" />
    <figcaption className="mt-3 text-[14px] text-sub">{cap}</figcaption>
  </figure>
)
const Key = ({ children }: { children: React.ReactNode }) => (
  <p className="mt-10 rounded-[20px] px-6 py-5 text-[18px] md:text-[22px] font-bold leading-snug tracking-tight max-w-[40ch]" style={{ background: T(14), color: '#18243A' }}>{children}</p>
)
// 배경 설명용 가상 일정표(예시). 9시~17시 시작 기준
const HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17]
const sample: { who: string; label: string; off: number[]; dislike: number[] }[] = [
  { who: 'A', label: '외근', off: [13, 14, 15, 16], dislike: [] },
  { who: 'B', label: '기존 미팅', off: [10, 15], dislike: [] },
  { who: 'C', label: '점심 직후 비선호', off: [], dislike: [12, 13] },
]
const cellOf = (hr: number) => {
  const offs = sample.filter(s => s.off.includes(hr)).length, dis = sample.filter(s => s.dislike.includes(hr)).length
  return offs ? 'off' : dis ? 'dis' : 'ok'
}

export default function CaseNodi() {
  const root = useRef<HTMLElement>(null)
  const active = useActive('nodi', list)
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
      <ChapterNav active={active} list={list} title="NODI" onCta={p.proto ? () => setOpen(true) : undefined} />

      {/* Hero */}
      <section id="c1" className="overflow-hidden" style={{ background: T(9) }}>
        <div className="wrap gutter pt-10 md:pt-16 pb-16 md:pb-24">
          <Link to="/#work" className="inline-flex min-h-11 items-center text-[14px] text-sub hover:text-blue">← 프로젝트 목록</Link>
          <div className="mt-6 md:grid md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-6">
              <AppIcon src="/images/nodi/icon.svg" name="NODI" className="mb-5" />
              <p className="eyebrow" style={{ color: S }}>NODI / AI SCHEDULING EXPERIENCE</p>
              <h1 style={{ lineHeight: 1, marginTop: 'calc(1rem + .2em)' }} className="text-[53px] md:text-[101px] font-extrabold tracking-[-0.055em] leading-[0.88]">NODI</h1>
              <p className="mt-4 text-[28px] md:text-[40px] font-bold leading-[1.2] tracking-tight">AI는 이해하고,<br />사용자는 결정한다.</p>
              <p className="mt-5 text-[17px] leading-[1.7] text-sub max-w-[30ch] md:max-w-[34ch]">여러 사람의 일정과 선호도를 비교하는 부담을 줄이기 위해, 추천 시간과 그 이유를 함께 제공하는 회의 일정 조율 경험을 설계했습니다.</p>
              <p className="mt-6 text-[13px] text-sub">Project Type · AI Scheduling Service Concept · Functional Prototype</p>
              <dl className="mt-6 grid grid-cols-3 gap-5 max-w-lg text-[16px] rule pt-4" style={{ borderColor: T(30) }}>
                <div><dt className="text-sub text-[13px]">담당</dt><dd className="mt-1">{owner}</dd></div>
                <div><dt className="text-sub text-[13px]">역할</dt><dd className="mt-1">{p.role}</dd></div>
                <div><dt className="text-sub text-[13px]">기간</dt><dd className="mt-1">{p.period}</dd></div>
              </dl>
              {p.proto && <button onClick={() => setOpen(true)} className="mt-8 px-6 py-3 rounded-full bg-ink text-white text-[16px] font-semibold">프로토타입 실행</button>}
            </div>
            <div className="mt-14 md:mt-0 md:col-span-6">
              {/* 모바일: 말풍선이 폰 밖으로 돌출하면 글자가 너무 작아져, 위에 읽히는 크기의 콜아웃으로 놓는다 */}
              <div className="mx-auto mb-5 max-w-[360px] space-y-3 md:hidden">
                <img src="/images/nodi/hero-pop-user.png" alt="사용자 입력: 다음주 화요일에 디자인팀 5명 1시간 미팅 시간 잡아줘" loading="lazy" className="ml-0 h-auto w-[82%] drop-shadow-[0_10px_18px_rgba(24,36,58,.18)]" />
                <img src="/images/nodi/hero-pop-ai.png" alt="NODI 응답: 회의 조건을 정리했어요. 맞는지 확인해 주세요." loading="lazy" className="ml-auto h-auto w-[78%] drop-shadow-[0_10px_18px_rgba(24,36,58,.18)]" />
              </div>
              <div data-rise className="relative mx-auto w-[58%] md:w-[60%]">
                <Zoomable src="/images/nodi/hero-phone-card.png?v=2" alt="NODI 조건 확인 화면: AI가 정리한 회의 조건 카드와 참석자 선택하기 버튼" caption="회의 조건을 확인해 주세요" className="block w-full" imgClass="block h-auto w-full" />
                <UIPopout src="/images/nodi/hero-pop-user.png" alt="사용자 입력: 다음주 화요일에 디자인팀 5명 1시간 미팅 시간 잡아줘" className="hidden md:block md:left-[-36%] md:top-[17%] md:w-[60%] lg:left-[-66%] lg:w-[86%]" />
                <UIPopout src="/images/nodi/hero-pop-ai.png" alt="NODI 응답: 회의 조건을 정리했어요. 맞는지 확인해 주세요." className="hidden md:block md:right-[-36%] md:top-[27%] md:w-[60%] lg:right-[-66%] lg:w-[86%]" />
              </div>
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

      {/* 02 Background */}
      <section id="bg" className="wrap gutter py-20 md:py-32 scroll-mt-20">
        <Head label="BACKGROUND">회의 시간을 정하는 일은,<br />여러 사람의 조건을 비교하는 일이었습니다.</Head>
        <div className="mt-10 md:grid md:grid-cols-12 gap-10 items-start">
          <div className="md:col-span-5 text-[17px] leading-[1.8] space-y-4">
            <p>여러 사람이 참여하는 회의를 잡으려면 각자의 빈 시간만 확인해서는 충분하지 않았습니다.</p>
            <p>누군가는 외근이 있고, 누군가는 이미 다른 미팅이 잡혀 있습니다. 또 누군가는 점심 직후 회의를 선호하지 않는 등 참여자마다 고려해야 할 조건이 달랐습니다.</p>
            <p>회의를 조율하는 사람은 이 조건들을 직접 확인하고 비교한 뒤 적절한 시간을 판단해야 했습니다.</p>
          </div>
          <Reveal className="mt-10 md:mt-0 md:col-span-7">
            <div className="rounded-[24px] border border-grid bg-white p-5 md:p-7" role="group" aria-label="3명의 참여자가 서로 다른 조건을 가진 가상의 회의 상황">
              <div><div>
                <div className="grid gap-1" style={{ gridTemplateColumns: 'minmax(78px, 30%) repeat(9, minmax(0, 1fr))' }}>
                  <span className="text-[13px] text-sub self-end">시작 시각</span>{HOURS.map(h => <span key={h} className="text-center text-[13px] text-sub self-end">{h}</span>)}
                  {sample.map(s => (
                    <div key={s.who} className="contents">
                      <p className="pr-2 text-[13px] md:text-[14px] leading-tight self-center"><b style={{ color: S }}>{s.who}</b> <span className="text-sub">{s.label}</span></p>
                      {HOURS.map(h => <span key={h} aria-label={`${s.who} ${h}시 ${s.off.includes(h) ? '참석 불가' : s.dislike.includes(h) ? '선호하지 않음' : '가능'}`} className="h-9 rounded-[6px]" style={s.off.includes(h) ? { background: '#E4B7BC' } : s.dislike.includes(h) ? { background: '#F6DFA8' } : { background: T(14) }} />)}
                    </div>
                  ))}
                  <p className="pr-2 pt-2 text-[14px] font-bold self-center">모두 가능</p>
                  {HOURS.map(h => { const c = cellOf(h); return <span key={h} className="mt-2 h-9 rounded-[6px] grid place-items-center text-[13px] font-bold" style={c === 'ok' ? { background: S, color: '#fff' } : c === 'dis' ? { background: '#F6DFA8', color: '#6B4A00' } : { background: '#EEF1F6', color: '#8A94A6' }}><span aria-label={c === 'ok' ? '모두 가능' : c === 'dis' ? '선호하지 않는 시간' : '참석 불가'}>{c === 'ok' ? '✓' : c === 'dis' ? '△' : '×'}</span></span> })}
                </div>
              </div></div>
              <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[13px]" aria-label="범례">
                <li className="flex items-center gap-2"><span className="h-3 w-3 rounded-[3px]" style={{ background: '#E4B7BC' }} />참석 불가능한 시간</li>
                <li className="flex items-center gap-2"><span className="h-3 w-3 rounded-[3px]" style={{ background: '#F6DFA8' }} />선호하지 않는 시간</li>
                <li className="flex items-center gap-2"><span className="h-3 w-3 rounded-[3px]" style={{ background: T(14) }} />가능한 시간</li>
              </ul>
            </div>
            <p className="mt-3 text-[13px] text-sub">※ 문제 설명을 위한 가상의 예시입니다. 실제 사용자 조사 결과가 아닙니다.</p>
          </Reveal>
        </div>
        <Key>문제는 빈 시간이 없다는 것이 아니라, 여러 조건을 종합해 결정하는 과정이 복잡하다는 점이었습니다.</Key>
      </section>

      {/* 03 Problem */}
      <section id="problem" className="scroll-mt-20" style={{ background: '#F7F8FB' }}>
        <div className="wrap gutter py-20 md:py-32">
          <Head label="PROBLEM">조건이 많아질수록,<br />회의 조율은 복잡한 의사결정이 됩니다.</Head>
          <p className="mt-6 max-w-[52ch] text-[17px] leading-[1.8]">참여자별 일정과 선호도가 서로 다르기 때문에 회의 시간을 정하려면 반복적인 확인과 비교가 필요합니다.</p>
          <ol className="mt-12 grid md:grid-cols-3 gap-4 md:gap-6">
            {[['01', '일정 확인', '외근과 기존 미팅 등 참석할 수 없는 시간을 확인해야 합니다.'], ['02', '조건 비교', '참석 불가능한 시간과 선호하지 않는 시간을 구분해야 합니다.'], ['03', '최종 판단', '여러 조건을 종합해 적절한 회의 시간을 결정해야 합니다.']].map(([n, t, d], i) => (
              <li key={n} className="relative"><Reveal delay={i * 60}>
                <div className="h-full rounded-[24px] bg-white border border-grid p-6 md:p-8">
                  <span className="text-[48px] font-extrabold leading-none num-brand">{n}</span>
                  <h3 className="mt-5 text-[22px] font-extrabold tracking-tight">{t}</h3>
                  <p className="mt-3 text-[16px] leading-[1.7] text-ink/80">{d}</p>
                </div>
              </Reveal></li>
            ))}
          </ol>
          <p className="mt-8 text-[13px] text-sub max-w-3xl">※ 직장인 6명의 카카오톡 인터뷰에서 반복된 불편을 바탕으로 정리했습니다. 소규모 조사이며 구체적인 응답 원문은 공개하지 않습니다.</p>
        </div>
      </section>

      {/* 04 Design Question */}
      <section id="question" className="wrap gutter py-24 md:py-40 scroll-mt-20">
        <Head label="DESIGN QUESTION">복잡한 조건 비교는 AI가 돕고,<br />최종 결정은 사용자가 할 수 없을까?</Head>
        <p className="mt-8 max-w-[44ch] text-[18px] md:text-[20px] leading-[1.8] text-ink/80">반복적인 일정 비교의 부담은 줄이되, 최종 선택에 필요한 판단 근거는 사용자에게 제공하고자 했습니다.</p>
      </section>

      {/* 05-08 Solutions */}
      <section id="sol" className="scroll-mt-20" style={{ background: T(9) }}>
        <div className="wrap gutter py-20 md:py-32">
          {/* Solution 01 */}
          <div className="md:grid md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-5">
              <Head sm label="SOLUTION 01 / INPUT">서로 다른 일정과 선호도를<br />하나의 입력 흐름으로.</Head>
              <p className="mt-6 text-[17px] leading-[1.8]">회의를 만드는 사람은 날짜와 길이, 선호하는 시간대, 참석자, 일정 필수 여부를 입력합니다. 참석자가 가능한 시간을 답하는 화면도 설계했습니다.</p>
              <p className="mt-3 text-[17px] leading-[1.8]">이렇게 입력한 조건은 회의 시간 추천에 반영됩니다.</p>
              <ul className="mt-8 space-y-5">
                <Callout n="A" t="일정 제약 · 일정 필수" d="필수 참석자가 참석할 수 없는 시간은 추천에서 제외합니다." />
                <Callout n="B" t="개인 선호 · 선호 시간대" d="선호는 제외하지 않고, 추천 순서에 반영합니다." />
              </ul>
            </div>
            <div className="mt-12 md:mt-0 md:col-span-7 grid grid-cols-3 gap-3 md:gap-6">
              <Ph n="sheetEdit" cap="날짜·길이·선호 시간대" />
              <Ph n="sheetPick" cap="참석자 선택" className="mt-6 md:mt-10" />
              <Ph n="required" cap="일정 필수 설정" />
            </div>
          </div>
          <p className="mt-8 text-[13px] text-sub max-w-3xl">프로토타입의 참석자 응답과 캘린더 상태는 기능 설명을 위한 예시 데이터입니다.</p>

          {/* Solution 02 */}
          <div className="mt-28 md:mt-40">
            <Head label="SOLUTION 02 / RECOMMENDATION">입력한 조건이 달라지면,<br />추천 시간도 달라집니다.</Head>
            <p className="mt-6 max-w-[56ch] text-[17px] leading-[1.8]">NODI는 참여자별 일정과 선호도를 바탕으로 회의 시간 후보를 제안합니다. 프로토타입에서는 사용자가 입력한 조건에 따라 실제 추천 결과가 달라지도록 구현했습니다.</p>
            <div className="mt-12 grid md:grid-cols-2 gap-5 md:gap-8">
              {[
                { k: 'A', pref: '오후', ino: 'scAin', outo: 'scA', res: '조건에 맞는 시간 3개', sub: '참석 가능성이 비슷한 후보 중 선호 시간을 사용자가 선택합니다' },
                { k: 'B', pref: '오전', ino: 'scBin', outo: 'scB', res: '오전 10시를 1순위로 추천', sub: '선호 조건을 반영해 오전 10:00–11:30을 우선 제안합니다' },
              ].map(s => (
                <Reveal key={s.k}><div className="h-full rounded-[28px] bg-white border border-grid p-5 md:p-8">
                  <p className="text-[13px] font-bold" style={{ color: S }}>Scenario {s.k}</p>
                  <p className="mt-2 text-[20px] md:text-[24px] font-extrabold tracking-tight">화요일 · 90분 · <mark className="rounded-[8px] px-2" style={{ background: T(22), color: '#18243A' }}>선호 {s.pref}</mark></p>
                  <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-2 md:gap-4">
                    <Ph n={s.ino} cap="입력 조건" />
                    <span aria-hidden className="text-[24px] text-sub">→</span>
                    <Ph n={s.outo} cap="추천 결과" />
                  </div>
                  <p className="mt-6 text-[18px] md:text-[20px] font-bold leading-snug" style={{ color: S }}>{s.res}</p>
                  <p className="mt-1 text-[15px] text-sub">{s.sub}</p>
                </div></Reveal>
              ))}
            </div>
            <p className="mt-6 text-[13px] text-sub max-w-3xl leading-relaxed">두 화면은 같은 날짜와 회의 길이에서 선호 시간대만 바꿔 비교한 결과입니다. 추천은 참석 가능 인원, 필수 참석자 충족 여부, 선호 시간대를 점수화하는 규칙 기반 로직이며 실제 AI 모델을 호출하지 않습니다.</p>
          </div>

          {/* Solution 03 */}
          <div className="mt-28 md:mt-40 md:grid md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-5">
              <Head sm label="SOLUTION 03 / EXPLANATION">추천 시간뿐 아니라,<br />추천하는 이유까지.</Head>
              <p className="mt-6 text-[17px] leading-[1.8]">추천된 시간이 왜 적절한지 이해할 수 있도록 추천 근거를 함께 제공했습니다.</p>
              <p className="mt-3 text-[17px] leading-[1.8]">사용자는 결과를 그대로 받아들이는 대신, 추천 이유를 확인하고 자신의 판단에 활용할 수 있습니다.</p>
              <ul className="mt-8 space-y-5">
                <Callout n="A" t="추천 시간 카드" d="추천 순위와 필수 일정 조건 충족 여부를 먼저 보여줍니다." />
                <Callout n="B" t="가능 응답 · 캘린더 빈 시간" d="추천에 반영된 정보를 인원 수로 보여줍니다." />
                <Callout n="C" t="참석자별 근거" d="응답 대기는 불가로 계산하지 않고, 확인이 필요하다고 알려줘요." />
              </ul>
              <Key>추천 결과를 보여주는 것에서 그치지 않고, 사용자가 납득할 수 있는 선택을 돕고자 했습니다.</Key>
            </div>
            <div className="mt-12 md:mt-0 md:col-span-7 grid grid-cols-2 gap-4 md:gap-8">
              <ExtendedPhoneScreen src={full('scB')} ratio={3260 / 780} alt="NODI 추천 시간 카드 전체 화면: 추천 순위와 필수 일정 조건 충족 여부, 가능 응답 수" caption="추천 시간 카드 · 전체 화면" />
              <Ph n="reasonB" cap="추천 이유 확인" className="mt-8 md:mt-14" />
            </div>
          </div>

          {/* Solution 04 */}
          <div className="mt-28 md:mt-40">
            <Head label="SOLUTION 04 / DECISION">최종 결정은<br />사용자에게 남겨두었습니다.</Head>
            <p className="mt-6 max-w-[56ch] text-[17px] leading-[1.8]">NODI는 회의 시간을 자동으로 확정하는 대신, 추천 결과와 근거를 확인한 사용자가 최종 시간을 선택하도록 설계했습니다.</p>
            <ol className="mt-12 grid grid-cols-3 gap-3 md:gap-8 max-w-4xl">
              {[['pickB', '추천 결과 확인'], ['reasonB', '추천 이유 검토'], ['review', '최종 시간 선택']].map(([n, t], i) => (
                <li key={n}>
                  <p className="mb-3 text-[14px]"><b style={{ color: S }}>0{i + 1}</b> <span className="text-sub">{t}</span></p>
                  <Ph n={n} cap={t} />
                </li>
              ))}
            </ol>
            <Key>AI는 조건 비교를 돕고, 사용자는 선택의 주체가 됩니다.</Key>
          </div>
        </div>
      </section>

      {/* 09 Implementation */}
      <section id="impl" className="wrap gutter py-20 md:py-32 scroll-mt-20">
        <Head label="IMPLEMENTATION">캘린더 연동 없이,<br />핵심 추천 경험을 구현했습니다.</Head>
        <div className="mt-8 max-w-[58ch] text-[17px] leading-[1.8] space-y-3">
          <p>실제 서비스에서는 외부 캘린더 연동을 전제로 설계했습니다.</p>
          <p>이번 프로젝트에서는 캘린더 API를 연결하는 대신 사용자가 직접 입력한 일정과 선호도를 활용했습니다.</p>
          <p>입력 조건에 따라 추천 결과가 달라지고, 추천 이유를 확인한 뒤 최종 시간을 선택하는 기능형 프로토타입을 구현했습니다.</p>
        </div>
        <div className="mt-12 grid md:grid-cols-2 gap-4 md:gap-6">
          <div className="rounded-[24px] p-6 md:p-8" style={{ background: T(14), border: `1px solid ${T(36)}` }}>
            <p className="text-[13px] font-bold" style={{ color: S }}>Implemented</p>
            <ul className="mt-4 space-y-3 text-[17px] font-semibold">{['조건 입력 (날짜 · 길이 · 선호 시간대 · 참석자 · 일정 필수)', '입력 조건별 추천 결과', '추천 이유', '최종 시간 선택'].map(t => <li key={t} className="flex gap-3"><span aria-hidden style={{ color: S }}>✓</span>{t}</li>)}</ul>
          </div>
          <div className="rounded-[24px] border border-grid bg-white p-6 md:p-8">
            <p className="text-[13px] font-bold text-sub">Not Implemented</p>
            <ul className="mt-4 space-y-3 text-[17px] text-ink/80">{['외부 캘린더 API 연동', '실제 캘린더 데이터 자동 수집', 'AI 모델 호출 (자연어 해석과 추천은 규칙 기반)'].map(t => <li key={t} className="flex gap-3"><span aria-hidden className="text-sub">–</span>{t}</li>)}</ul>
          </div>
        </div>
        <p className="mt-6 text-[13px] text-sub max-w-3xl leading-relaxed">참석자 응답과 캘린더 상태는 예시 데이터입니다. 자연어 입력은 규칙 기반 데모이며, 알림 발송과 캘린더 반영은 실제로 처리되지 않습니다.</p>
        <InteractionPreview p={p} wide={wide} onOpen={() => setOpen(true)} title="직접 눌러보세요" note="화면 이미지는 v6 시안과 세부가 다를 수 있습니다." />
      </section>

      {/* 10 Reflection */}
      <section id="ref" className="scroll-mt-20 rule" style={{ background: '#18243A', color: '#fff' }}>
        <div className="wrap gutter py-24 md:py-40">
          <p className="eyebrow rule pt-4" style={{ color: '#AFC0FF', borderColor: 'rgba(255,255,255,.25)' }}>REFLECTION</p>
          <h2 className="mt-4 apple-h text-[30px] md:text-[52px] max-w-[24ch]">좋은 추천은 답을 제시하는 것에서 끝나지 않습니다.</h2>
          <div className="mt-8 max-w-[56ch] text-[17px] leading-[1.8] space-y-4 text-white/85">
            <p>이번 프로젝트에서는 복잡한 조건을 정리해 추천하는 기능뿐 아니라, 사용자가 추천 결과를 이해하고 최종 선택할 수 있는 경험에 집중했습니다.</p>
            <p>이를 통해 AI가 판단을 대신하는 것보다, 사용자의 판단을 지원하도록 설계하는 것이 중요하다는 점을 배웠습니다.</p>
          </div>
          <p className="mt-14 text-[26px] md:text-[44px] font-extrabold leading-[1.2] tracking-tight" style={{ color: '#AFC0FF' }}>AI는 이해하고,<br />사용자는 결정한다.</p>
        </div>
      </section>

      {/* More: 보조 화면과 설계 기록 */}
      <section id="more" className="scroll-mt-20">
        <div className="wrap gutter pt-20 md:pt-28">
          <Head label="MORE">보조 화면과 설계 기록</Head>
          <p className="mt-6 max-w-[52ch] text-[17px] leading-[1.8] text-sub">위 흐름 밖의 화면과 예외 상태, 반응형, 설계 점검 기록을 모았어요.</p>
        </div>
      </section>


      <section className="scroll-mt-20" style={{ background: '#F7F8FB' }}>
        <div className="wrap gutter py-20 md:py-32">
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
          {p.beforeAfter?.map((b, i) => <div key={b.before} className="mt-14"><div className="max-w-[62ch]"><p className="eyebrow rule pt-4 text-sub">초기 시안 → 개선 시안 · {['조건 확인', '추천 시간', '저장 완료'][i]}</p><p className="mt-4 text-[15px] text-sub">신규 서비스이므로 직접 만든 초기 시안(v5.2)을 비교 기준으로 삼았습니다. 왼쪽은 초기 시안, 오른쪽은 개선 시안입니다.</p></div><div className="mt-6"><BeforeAfter data={b} color={S} beforeLabel="초기 시안" afterLabel="개선 시안" /></div></div>)}
          <p className="mt-10 text-[15px] leading-relaxed text-sub max-w-3xl">변경이 사용자의 이해와 행동에 미친 영향은 아직 검증하지 않았습니다. 대신 44px 이상 터치 영역, 13px 이상 글자 크기, 클릭 시나리오 19개로 구현 품질을 점검했습니다. 이해도 검증은 아래 계획에 따라 진행할 예정입니다.</p>
        </div>
      </section>

      {/* 보조: 실제 UI 흐름 · 웹 반응형 */}
      <section className="wrap gutter py-20 md:py-32 scroll-mt-20">
        <ChapterHead color={S} n="A2" label="Actual UI" title="입력부터 확정까지, 하나의 흐름" />
        <div className="mt-14"><Strip label="NODI 사용 흐름 화면">
          {flow.map(([n, l], i) => (
            <figure key={n} className="w-[210px] md:w-[250px]">
              <p className="text-[14px] mb-3"><b style={{ color: S }}>0{i + 1}</b> <span className="text-sub">{l}</span></p>
              <Zoomable src={img(n)} big={full(n)} alt={`NODI ${l} 화면`} caption={l} imgClass="phone-bare" />
            </figure>
          ))}
        </Strip></div>
        <p className="mt-8 max-w-3xl text-[17px] leading-[1.8]">재조율, 받은 요청과 응답, 이전 회의 재사용, 작성 중 이어하기까지 포함해 26개 아트보드로 구현했습니다.</p>
        <details className="group mt-12 rounded-[24px] bg-white p-4 md:p-8">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 text-[16px] font-bold"><span><span className="eyebrow block" style={{ color: S }}>Detail · Long screens</span>긴 화면 4개 전체 보기</span><span aria-hidden className="text-[20px] transition-transform group-open:rotate-180">⌄</span></summary>
          <h3 className="mt-4 text-[28px] md:text-[40px] font-extrabold tracking-tight leading-[1.15] max-w-[22ch]">긴 화면의 전체 흐름도 확인할 수 있습니다</h3>
          <p className="mt-5 max-w-[60ch] text-[17px] leading-[1.8]">조율 현황, 추천 시간, 회의 상세, 재조율 화면은 스마트폰 화면에서 시작해 아래로 이어집니다. 이미지를 누르면 확대해서 볼 수 있습니다.</p>
          <div className="mt-10 grid grid-cols-2 items-start gap-x-3 gap-y-10 md:gap-x-8 lg:grid-cols-4">
            {[['progress', '조율 진행 현황', 2424], ['recs', '추천 회의 시간', 3308], ['detail', '회의 상세', 3270], ['resched', '새 시간 조율', 3046]].map(([n, l, h]) => (
              <ExtendedPhoneScreen key={n} src={full(n as string)} ratio={(h as number) / 780} alt={`NODI ${l} 전체 화면`} caption={l as string} />
            ))}
          </div>
        </details>
        <div className="mt-24" id="nodi-web">
          <p className="eyebrow rule pt-4" style={{ color: S }}>Web · Responsive</p>
          <h3 className="mt-4 text-[28px] md:text-[40px] font-extrabold tracking-tight max-w-[22ch]">모바일 앱이면서 PC 웹에서도 그대로 쓰는 서비스</h3>
          <p className="mt-5 max-w-[60ch] text-[17px] leading-[1.8]">모바일과 웹에서 같은 정보 우선순위를 유지하되, 화면 폭에 맞춰 내비게이션과 요약 영역의 배치를 조정했습니다.</p>

          <div className="mt-12 md:grid md:grid-cols-12 gap-10 items-start">
            <BrowserFrame className="md:col-span-8" src="/images/nodi/web-understand.webp" alt="NODI 웹 화면: 왼쪽 내비게이션, 가운데 대화, 오른쪽 요약 패널의 3열 구성" label="PC 웹 (1200px 이상) · 내비게이션 · 대화 · 요약 패널 3열" />
            <div className="mt-8 md:mt-0 md:col-span-4">
              <p className="text-[13px] font-semibold text-sub">3열 구성</p>
              <ul className="mt-4 space-y-5">{[['A', '좌측 내비게이션', '새 회의 · 내 회의 · 받은 요청(배지) · 캘린더 연결'], ['B', '가운데 대화', 'AI와 대화하며 조건을 입력하고 선택지로 응답합니다'], ['C', '우측 요약 패널', '확정된 조건과 추가로 확인할 항목을 계속 보여줍니다']].map(([n, t, d]) => <li key={n} className="flex gap-3"><span className="shrink-0 grid place-items-center w-7 h-7 rounded-full text-[13px] font-bold text-white" style={{ background: p.accent }}>{n}</span><div><p className="text-[16px] font-bold leading-snug">{t}</p><p className="mt-0.5 text-[14px] leading-snug text-sub">{d}</p></div></li>)}</ul>
            </div>
          </div>

          <div className="mt-10 grid md:grid-cols-2 gap-6 md:gap-8">
            <BrowserFrame src="/images/nodi/web-start.webp" alt="NODI 웹 시작 화면: 회의 종류를 고르는 선택지와 우측 확인 필요 항목" label="선택지로 시작하고 우측에서 추가로 필요한 조건을 확인합니다" />
            <BrowserFrame src="/images/nodi/web-reco.webp" alt="NODI 웹 추천 카드: 확정 검토 가능 후보와 추천하는 이유" label="추천 시간과 이유를 함께 보여주고, 사용자가 직접 확정합니다" />
          </div>

          <div className="mt-12 md:grid md:grid-cols-12 gap-10 items-center rounded-[28px] p-6 md:p-10" style={{ background: T(14) }}>
            <div className="md:col-span-6">
              <p className="eyebrow" style={{ color: S }}>화면 폭에 따른 배치</p>
              <h4 className="mt-3 text-[24px] md:text-[30px] font-bold tracking-tight">같은 정보 다른 배치</h4>
              <table className="mt-6 w-full text-[15px] bg-white rounded-[18px] overflow-hidden"><caption className="sr-only">화면 폭별 레이아웃</caption><thead><tr className="text-left text-[13px] text-sub"><th scope="col" className="py-3 pl-5">구간</th><th scope="col">내비게이션</th><th scope="col" className="pr-5">요약</th></tr></thead><tbody>
                {[['1200px 이상', '좌측 내비', '우측 고정 패널'], ['768~1199px', '아이콘 레일', '서랍(시트)'], ['767px 이하', '하단 탭', '바텀시트']].map(([a, b, c]) => <tr key={a} className="border-t border-grid"><th scope="row" className="py-3 pl-5 text-left font-semibold">{a}</th><td>{b}</td><td className="pr-5">{c}</td></tr>)}
              </tbody></table>
              <p className="mt-4 text-[13px] text-sub">승인된 반응형 정책 문서를 기준으로 모바일을 먼저 정의하고 태블릿과 PC로 확장했습니다.</p>
            </div>
            <div className="mt-8 md:mt-0 md:col-span-6 flex justify-center"><div className="w-full max-w-[340px] rounded-[14px] overflow-hidden border border-black/15 bg-white"><Zoomable src="/images/nodi/tablet-start.webp" alt="NODI 태블릿 폭(820px) 화면: 아이콘 레일 내비게이션과 대화 영역" caption="태블릿 폭(820px)" className="w-full" imgClass="block w-full" /></div></div>
          </div>
          <p className="mt-4 text-[13px] text-sub max-w-3xl">웹 화면은 가상 데이터를 사용한 체험용 데모를 1440px와 820px 폭에서 캡처했습니다. 실제 일정은 등록되지 않습니다.</p>
        </div>
      </section>
      {/* 04 Outcome */}
      <section className="scroll-mt-20 rule">
        <div className="wrap gutter py-20 md:py-32">
          <ChapterHead color={S} n="A3" label="Outcome" title="점검한 것과 아직 확인하지 못한 것" />
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
            <p className="mt-5 text-[15px] leading-relaxed text-sub max-w-3xl">예정 방법: 과제 수행 과정을 관찰하고 혼란이 발생한 지점과 발화를 기록합니다. 이후 초기·개선 시안의 행동을 비교해 재설계합니다. 아직 수행하지 않아 수치와 인용문은 제시하지 않습니다.</p>
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
