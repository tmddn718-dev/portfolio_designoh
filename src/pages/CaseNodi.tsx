import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects, TODO } from '../data/projects'
import Reveal from '../components/Reveal'
import BeforeAfter from '../components/BeforeAfter'
import { Modal, Zoomable } from '../components/Modal'
import { ProtoFrame, owner, useMedia } from '../components/Mockup'
import { ChapterHead, ChapterNav, InteractionPreview, tintOf, strongOf, useActive } from '../components/case'
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
const flow: [string, string][] = [['home', '자연어로 입력'], ['conds', '조건 확인'], ['sheetPick', '참석자 선택'], ['required', '일정 필수 설정'], ['progress', '조율 현황'], ['recs', '추천 시간'], ['review', '최종 검토'], ['done', '저장 완료'], ['meetings', '내 회의'], ['reschedAsk', '재조율 확인'], ['resched', '재조율 후보'], ['changes', '변경 내용 검토'], ['inbox', '받은 요청']]
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
    <article ref={root}>
      <ChapterNav active={active} />

      {/* Hero */}
      <section id="c1" className="overflow-hidden" style={{ background: T(9) }}>
        <div className="wrap gutter pt-10 md:pt-16 pb-16 md:pb-24">
          <Link to="/#work" className="inline-block py-2 text-[14px] text-sub hover:text-blue">← 프로젝트 목록</Link>
          <div className="mt-6 md:grid md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-6">
              <p className="eyebrow" style={{ color: S }}>Personal Case Study · {p.category}</p>
              <h1 className="mt-4 text-[88px] md:text-[168px] font-extrabold tracking-[-0.055em] leading-[0.88]">NODI</h1>
              <p className="mt-8 text-[28px] md:text-[40px] font-extrabold leading-[1.2] tracking-tight">AI는 이해하고,<br />사용자는 결정한다.</p>
              <p className="mt-5 text-[17px] leading-[1.7] text-sub max-w-[24ch] md:max-w-[22ch]">회의 조건은 AI가 정리하고, 참석자 선택과 최종 확정은 사용자가 합니다.</p>
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

      {/* 01 Challenge */}
      <section id="c2" className="wrap gutter py-20 md:py-32 scroll-mt-20 md:mt-24">
        <ChapterHead color={S} n="01" label="The Challenge" title="회의를 잡는 사람의 세 가지 스트레스" />
        <p className="mt-5 text-[16px] inline-block px-4 py-2 rounded-full font-semibold" style={{ background: T(14), color: S }}>직장인 6명 · 카카오톡 인터뷰</p>
        <ol className="mt-10 grid md:grid-cols-3 gap-5">
          {pains.map((x, i) => (
            <li key={i}><Reveal delay={i * 60}>
              <div className="rounded-[20px] border border-grid p-6 h-full flex flex-col">
                <span className="text-[48px] font-extrabold leading-none outline-text">0{i + 1}</span>
                <p className="mt-4 text-[18px] font-semibold leading-snug">{x.pain}</p>
                <div className="mt-6 pt-4 border-t border-grid"><p className="text-[13px] text-sub">NODI의 대응</p><p className="mt-1 text-[16px] font-semibold" style={{ color: S }}>{x.fix}</p></div>
                <div className="mt-5 mx-auto w-[44%] mt-auto pt-5"><img src={img(x.shot)} alt={`${x.fix} 화면`} loading="lazy" className="phone-bare" /></div>
              </div>
            </Reveal></li>
          ))}
        </ol>
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
              <p className="text-[56px] font-extrabold leading-none outline-text">02</p>
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
              <p className="text-[56px] font-extrabold leading-none outline-text">03</p>
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
              <div className="mt-5 grid grid-cols-3 gap-4 md:gap-6">{[['aiFail', 'AI 해석 실패'], ['recError', '추천 계산 오류'], ['recNone', '추천 후보 없음']].map(([n, l]) => <Shot key={n} n={n} cap={l} />)}</div>
            </div>
          </Reveal>
          {p.beforeAfter && <div className="mt-24"><BeforeAfter data={p.beforeAfter} /></div>}
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
        <InteractionPreview p={p} wide={wide} onOpen={() => setOpen(true)} title="직접 눌러보세요" note="GitHub 저장소 기준의 이전 버전 프로토타입입니다. 화면 이미지는 v6 시안과 세부가 다를 수 있습니다." />
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
        </div>
      </section>

      <Link to={`/work/${next.slug}`} className="group block rule">
        <div className="wrap gutter py-14 md:py-20 flex items-end justify-between gap-6">
          <div><p className="eyebrow text-sub">다음 프로젝트</p><p className="mt-3 text-[32px] md:text-[56px] font-extrabold tracking-tight leading-none group-hover:text-blue">{next.name}</p></div>
          <span className="px-5 py-3 rounded-full bg-ink text-white text-[14px] shrink-0">이어서 보기</span>
        </div>
      </Link>
      <Modal open={open} onClose={() => setOpen(false)} label="NODI 프로토타입"><div className="flex justify-center"><ProtoFrame p={p} width={380} /></div></Modal>
    </article>
  )
}
