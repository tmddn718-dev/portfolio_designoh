import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects } from '../data/projects'
import Reveal from '../components/Reveal'
import { Zoomable } from '../components/Modal'
import { owner } from '../components/Mockup'
import Compose from '../components/Compose'
import ScrollPhone from '../components/ScrollPhone'
import { ChapterHead, ChapterNav, strongOf, tintOf, useActive, CaseSummary, ProjectIndex } from '../components/case'

gsap.registerPlugin(ScrollTrigger)

const p = projects.find(x => x.slug === 'trigr')!
const PINK = '#DE5DE2', TEAL = '#2FD1CD' // 출시 화면에서 추출한 색
const T = (n: number) => tintOf(PINK, n)
const S = strongOf(PINK)
const I = (n: string) => `/images/trigr/tr-${n}.webp`
const list = [['c1', '개요'], ['c2', '문제'], ['c3', '핵심 결정'], ['c4', '최종 화면'], ['c5', '검증']]

// 실제 화면 하나를 밝은 폰 프레임에 넣고 클릭하면 확대
function Screen({ src, alt, caption, className = '' }: { src: string; alt: string; caption?: string; className?: string }) {
  return <Zoomable src={src} alt={alt} caption={caption ?? alt} className={`phone-light w-full ${className}`} imgClass="screen" />
}

const Ann = ({ n, t, d }: { n: string; t: string; d: string }) => (
  <li className="flex gap-4"><span className="shrink-0 grid place-items-center w-8 h-8 rounded-full text-[13px] font-bold text-white" style={{ background: PINK }}>{n}</span><div><p className="text-[17px] font-bold leading-snug">{t}</p><p className="mt-1 text-[16px] leading-relaxed text-sub">{d}</p></div></li>
)
const Mini = ({ src, label, alt }: { src: string; label: string; alt: string }) => (
  <figure className="w-[120px] md:w-[140px]"><Screen src={src} alt={alt} caption={label} /><figcaption className="mt-2 text-[13px] text-sub leading-snug">{label}</figcaption></figure>
)
import Strip from '../components/Strip'

const stages = [
  { name: '초기 기획', change: '생성자·챌린저의 미션 생성·수행 구조 정의', role: '기획 참여 · 리워드 앱 조사·설문·인터뷰' },
  { name: '1차 시안', change: '당근마켓 기반 지역형 UI, 이벤트·미션·보상 연결', role: 'UI 방향 구체화 · 홈·미션 리스트 디자인' },
  { name: '2차 시안', change: '진행·종료 미션 정보 제공, 인기 미션·참여 유도 요소 추가', role: '홈 UI 개선 · 참여 유도 UI 디자인' },
  { name: '3차 시안 (출시)', change: '지도 기반 미션 탐색, 미션→채팅→인증 플로우 구체화', role: '전체 UI 디자인 · 주요 사용자 플로우 디자인' },
]
const lanes = [
  { title: '생성자', color: S, steps: [['미션 생성', '이 미션에 상금을 걸고 사람들과 함께 해볼까?'], ['미션 운영', '지금 참여자들이 어떻게 하고 있지?'], ['인증 확인', '이 인증이 미션을 제대로 수행한 걸까?'], ['보상 지급', '인증했으니 약속한 상금을 지급해야겠다.']] },
  { title: '참여자', color: '#16A19D', steps: [['미션 탐색', '내 주변에 재미있어 보이는 미션이 있나?'], ['미션 참여', '이 정도면 나도 한번 해볼 만하겠다.'], ['미션 인증', '미션을 수행했으니 이렇게 인증하면 되겠네.'], ['보상 확인', '인증 완료했으니 상금을 받았네!']] },
]

export default function CaseTrigr() {
  const root = useRef<HTMLElement>(null)
  const active = useActive('trigr', list)
  useEffect(() => { document.title = 'trigr | Portfolio 2026'; return () => { document.title = 'Portfolio 2026 | Complexity → Clarity' } }, [])
  useLayoutEffect(() => {
    const q = gsap.utils.selector(root)
    const mm = gsap.matchMedia()
    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(q('[data-hero-img]'), { y: 30 }, { y: -20, ease: 'none', scrollTrigger: { trigger: q('#c1')[0], start: 'top top', end: 'bottom top', scrub: true } })
    })
    return () => mm.revert()
  }, [])
  const next = projects[(projects.indexOf(p) + 1) % projects.length]

  return (
    <article ref={root} style={{ ['--brand' as string]: PINK }}>
      <ChapterNav active={active} list={list} title="trigr" />

      {/* Hero */}
      <section id="c1" className="overflow-hidden" style={{ background: T(9) }}>
        <div className="wrap gutter pt-10 md:pt-16 pb-14 md:pb-20">
          <Link to="/#work" className="inline-block py-2 text-[14px] text-sub hover:text-blue">← 프로젝트 목록</Link>
          <div className="mt-6 md:grid md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-5">
              <p className="eyebrow" style={{ color: S }}>Launched Product · 출시 프로젝트</p>
              <h1 className="mt-4 text-[96px] md:text-[168px] font-extrabold tracking-[-0.06em] leading-[0.9]">trigr</h1>
              <p className="mt-6 text-[24px] md:text-[28px] leading-snug font-bold">처음부터 만든<br />미션·리워드 앱</p>
              <p className="mt-3 text-[17px] text-sub">초기 기획부터 세 차례의 개편, 출시까지 참여한 UX/UI 설계 경험.</p>
              <p className="mt-6 inline-block px-4 py-2 rounded-full bg-ink text-white text-[13px] font-semibold">서비스 운영 종료 · 당시 디자인 기준</p>
              <dl className="mt-8 grid grid-cols-3 gap-5 text-[14px] rule pt-4" style={{ borderColor: T(35) }}>
                <div><dt className="text-sub text-[13px]">담당</dt><dd className="mt-1">{owner}</dd></div>
                <div><dt className="text-sub text-[13px]">역할</dt><dd className="mt-1">{p.role}</dd></div>
                <div><dt className="text-sub text-[13px]">기간</dt><dd className="mt-1">{p.period}</dd></div>
              </dl>
            </div>
            <div data-hero-img className="mt-10 md:mt-0 md:col-span-7">
              <div role="img" aria-label="trigr 출시 버전의 홈 지도와 미션 목록 화면">
                <Compose persp={1600} className="aspect-square rounded-[28px]" style={{ background: tintOf(PINK, 14) }} ghost="TRIGR" ghostColor="#9B3FA0" items={[
                  { src: '/images/trigr/t-list.webp', kind: 'pro', x: 10, y: 14, w: 34, ry: 14, rx: 3, r: -6, z: 1 },
                  { src: '/images/trigr/home-map.webp', kind: 'pro', x: 50, y: 20, w: 36, ry: -12, rx: 3, r: 5, z: 2, lift: 14 }]} />
              </div>
            </div>
          </div>
        </div>
      </section>
      <CaseSummary p={p} />

      {/* 01 Challenge */}
      <section id="c2" className="wrap gutter py-20 md:py-32 scroll-mt-20 md:mt-24">
        <ChapterHead color={S} n="01" label="The Challenge" title="미션의 생성부터 보상까지, 두 사용자의 경험을 하나로 잇기" />
        <p className="mt-6 max-w-2xl text-[17px] leading-[1.8] text-sub">생성자가 쉽게 미션을 만들고, 참여자가 주변 미션을 발견해 부담 없이 수행·인증하도록 핵심 흐름을 구체화했습니다. PG사 연동이 확정되지 않은 상태에서 MVP 출시를 목표로 진행했습니다.</p>
        <div className="mt-14 space-y-8">
          {lanes.map(l => (
            <div key={l.title}>
              <p className="text-[20px] font-bold" style={{ color: l.color }}>{l.title}의 핵심 경험</p>
              <ol className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {l.steps.map(([a, q], i) => (
                  <li key={a} className="relative rounded-[20px] bg-white border border-grid p-5">
                    <p className="text-[13px] font-semibold" style={{ color: l.color }}>0{i + 1} · {a}</p>
                    <p className="mt-2 text-[16px] leading-snug">“{q}”</p>
                    {i < 3 && <span aria-hidden className="hidden md:block absolute top-1/2 -right-[14px] z-10 text-sub">→</span>}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
        <p className="mt-8 rounded-[20px] bg-[#F7F8FA] px-6 py-5 text-[17px] md:text-[18px] leading-snug text-center">기획된 기능을 화면으로 옮기는 역할보다 <b style={{ color: S }}>문제 정의부터 출시까지 제품 경험을 연결</b>하는 데 집중했습니다.</p>
      </section>

      {/* 02 Design Decisions (Evolution + Decisions) */}
      <section id="c3" className="scroll-mt-20 md:mt-24" style={{ background: '#F7F8FB' }}>
        <div className="wrap gutter py-20 md:py-32">
          <ChapterHead color={S} n="02" label="Design Decisions" title="3번의 개편을 거치며 내린 세 가지 설계 결정" />

          <p className="mt-16 eyebrow text-sub">Product Evolution · 1년, 3번의 시안</p>
          <div role="region" aria-label="서비스 변화 타임라인 (좌우로 스크롤)" tabIndex={0} className="mt-6 -mx-5 px-5 md:mx-0 md:px-0 flex gap-5 overflow-x-auto pb-4 md:grid md:grid-cols-4 md:overflow-visible">
            {stages.map((s, i) => (
              <div key={s.name} className="w-[260px] shrink-0 md:w-auto">
                <div className="flex items-center gap-3">
                  <span className="grid place-items-center w-9 h-9 rounded-full text-[14px] font-bold text-white" style={{ background: PINK }}>{i}</span>
                  <p className="text-[18px] font-bold">{s.name}</p>
                  <span aria-hidden className="flex-1 h-px" style={{ background: i < 3 ? T(45) : 'transparent' }} />
                </div>
                <div className="mt-4 rounded-[20px] p-5" style={{ background: i === 3 ? T(16) : '#fff', border: i === 3 ? 'none' : '1px solid var(--color-grid)' }}>
                  <p className="text-[16px] leading-snug font-semibold">{s.change}</p>
                  <p className="mt-3 text-[14px] leading-snug text-sub">나의 역할 · {s.role}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[13px] text-sub">※ 1·2차 시안 화면은 PDF에 없어 추가 자료가 필요한 항목입니다.</p>

          {/* Decision 1 */}
          <Reveal className="mt-20 md:mt-24">
            <div className="md:grid md:grid-cols-12 gap-10 lg:gap-16 items-center">
              <div className="md:col-span-6">
                <p className="text-[56px] font-extrabold leading-none num-brand">01</p>
                <h3 className="mt-3 text-[28px] md:text-[36px] font-extrabold tracking-tight leading-tight max-w-[16ch]">미션 생성을 한 화면에서 끝낸다</h3>
                <ul className="mt-8 space-y-4"><Ann n="A" t="제목 → 미션 종류 → 태그 → 상금" d="미션 생성부터 모집 조건 설정까지 한 화면에서 완료되도록 입력 순서를 정리했습니다." /></ul>
                <ol aria-label="입력 항목" className="mt-8 grid grid-cols-2 gap-3 max-w-[460px]">{[['01', '미션 제목'], ['02', '미션 종류'], ['03', '태그 설정'], ['04', '상금 설정']].map(([n, t]) => <li key={n} className="rounded-[16px] px-4 py-3 text-[16px] font-semibold flex gap-3" style={{ background: T(14) }}><b style={{ color: S }}>{n}</b>{t}</li>)}</ol>
                <p className="mt-6 text-[15px] leading-[1.7] text-sub max-w-[44ch]">하단의 ‘미션 생성하기’ 버튼은 실제 앱처럼 화면 아래에 고정돼요. 화면 안에서 스크롤해 보세요.</p>
              </div>
              <div className="mt-12 md:mt-0 md:col-span-6 flex justify-center">
                <div className="w-full max-w-[320px]"><ScrollPhone body="/images/trigr/create-sample-body.webp" top="/images/trigr/create-sample-top.webp" cta="/images/trigr/create-sample-cta.webp" w={715} ctaH={195} topH={176} alt="미션 만들기: 제목, 미션 종류, 태그, 상금을 한 화면에서 설정하고 하단 고정 버튼으로 생성" /></div>
              </div>
            </div>
          </Reveal>

          {/* Decision 2 */}
          <Reveal className="mt-20 md:mt-24">
            <div className="md:grid md:grid-cols-12 gap-10 items-end">
              <div className="md:col-span-5"><p className="text-[56px] font-extrabold leading-none num-brand">02</p><h3 className="mt-3 text-[28px] md:text-[36px] font-extrabold tracking-tight leading-tight">상황에 따라 고르는 두 가지 탐색 경로</h3></div>
              <ul className="md:col-span-7 mt-6 md:mt-0 grid sm:grid-cols-2 gap-5"><Ann n="A" t="지도 탐색" d="주변 미션을 빠르게 발견. 지도 → 핀 선택 → 미리보기 → 참여." /><Ann n="B" t="리스트 탐색" d="원하는 미션을 찾아봄. 미션 탭 → 검색 → 선택 → 참여." /></ul>
            </div>
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {[[I('discover-map'), '지도 · 핀 선택', '지도에서 핀을 선택해 나온 미션 미리보기'], ['/images/trigr/home-map.webp', '지도', '지도 위 미션 핀'], [I('list'), '리스트', '미션 리스트'], [I('search'), '검색', '미션 검색 화면']].map(([s, l, a], i) => (
                <figure key={s} className={i % 2 ? 'md:mt-12' : ''}><Screen src={s} alt={a} caption={l} /><figcaption className="mt-2 text-[14px] text-sub">{l}</figcaption></figure>
              ))}
            </div>
          </Reveal>

          {/* Decision 3 */}
          <Reveal className="mt-20 md:mt-24">
            <div className="md:grid md:grid-cols-12 gap-10 items-start">
              <div className="md:col-span-5"><p className="text-[56px] font-extrabold leading-none num-brand">03</p><h3 className="mt-3 text-[28px] md:text-[36px] font-extrabold tracking-tight leading-tight">인증 방식은 달라도 흐름은 하나, 보상은 한 번에 확인</h3>
                <ul className="mt-8 space-y-6">
                  <Ann n="A" t="4가지 인증 방식, 같은 흐름" d="QR · 사진/동영상 · 내 위치 · 직접 인증. 참여자는 동일한 흐름으로 인증을 마칩니다." />
                  <Ann n="B" t="놓친 인증은 별도 관리 화면" d="실시간 채팅 운영과 인증 확인을 분리했습니다." />
                  <Ann n="C" t="상금 입력 → 남은 상금 계산" d="지급 전에 지급 후 남은 상금을 확인하고, 지급 결과까지 봅니다." />
                </ul></div>
              <div className="mt-10 md:mt-0 md:col-span-7 grid grid-cols-2 gap-6">
                <figure><Screen src={I('p-method')} alt="인증 방법 선택: QR, 사진/동영상, 내 위치, 직접 인증" caption="인증 방법 선택" /><figcaption className="mt-2 text-[14px] text-sub">참여자 · 인증 방법 선택</figcaption></figure>
                <figure className="md:mt-16"><Screen src={I('reward-2')} alt="지급 금액 입력과 지급 후 남은 상금 계산" caption="상금 지급" /><figcaption className="mt-2 text-[14px] text-sub">생성자 · 지급 후 남은 상금</figcaption></figure>
              </div>
            </div>
            <div className="mt-14"><p className="text-[14px] text-sub mb-4">전체 흐름 · 참여자 인증 → 생성자 관리·지급</p>
              <Strip label="인증과 보상 전체 흐름">
                {[[I('p-write'), '사진/동영상 인증', '사진 또는 동영상 인증 작성'], [I('p-done'), '인증 등록', '인증 등록 완료'], [I('p-card'), '채팅 공유', '채팅에 공유된 인증 카드'], [I('manage'), '미션 관리', '미션 관리 화면'], [I('proofs'), '인증 모아보기', '인증 모아보기'], [I('proof-detail'), '인증 상세', '인증 상세'], [I('reward-3'), '지급 완료', '상금 지급 완료']].map(([s, l, a]) => <Mini key={s} src={s} label={l} alt={a} />)}
              </Strip></div>
          </Reveal>
        </div>
      </section>

      {/* 03 Final UI */}
      <section id="c4" className="wrap gutter py-20 md:py-32 scroll-mt-20 md:mt-24">
        <ChapterHead color={S} n="03" label="Final Experience" title="출시 버전의 핵심 화면" />
        <div className="mt-14 grid md:grid-cols-12 gap-8 items-start">
          <figure className="md:col-span-5"><Screen src="/images/trigr/home-map.webp" alt="출시 버전 홈: 지도 위 미션 탐색" caption="홈: 지도 위 미션 탐색" /><figcaption className="mt-3 text-[16px] text-sub">홈 · 지도 위 미션 탐색</figcaption></figure>
          <figure className="md:col-span-4 md:mt-20"><Screen src={I('proof-detail')} alt="출시 버전 인증 상세" caption="인증 상세" /><figcaption className="mt-3 text-[16px] text-sub">인증 상세 · 상금 지급 진입</figcaption></figure>
          <div className="md:col-span-3 md:mt-40"><figure><Screen src={I('my-1')} alt="출시 버전 마이페이지" caption="마이페이지" /><figcaption className="mt-3 text-[16px] text-sub">마이페이지 · 활동과 보상 정보</figcaption></figure></div>
        </div>
        <div className="mt-20">
          <p className="eyebrow text-sub">UI Detail · 화면에서 확인되는 구성</p>
          <ul className="mt-5 grid sm:grid-cols-2 md:grid-cols-3 gap-3 text-[16px] leading-snug">
            {['단계별 바텀시트 (미션 생성 4단계)', '아이콘이 있는 카테고리 태그 칩', 'Point / Ticket 상금 옵션 카드', '+100 · +500 · +1,000 빠른 입력 칩', '사진/동영상 · 내 위치 · 직접 인증 탭', '총상금·참여자·태그 미션 요약 카드'].map(t => <li key={t} className="rounded-[20px] bg-[#F7F8FA] p-4">{t}</li>)}
          </ul>
          <div className="mt-6 flex flex-wrap items-center gap-6">
            <ul className="flex gap-4">{[['Primary', PINK], ['포인트', TEAL]].map(([n, c]) => <li key={n} className="flex items-center gap-3 text-[14px]"><span className="w-10 h-10 rounded-[12px] border border-grid" style={{ background: c }} /><span>{n}<br /><span className="text-sub">{c}</span></span></li>)}</ul>
            <p className="text-[14px] text-sub max-w-md">디자인 시스템 상세(변수·컴포넌트 구조), 다국어·다크 모드 범위는 PDF에서 확인되지 않아 추가 자료가 필요한 항목입니다.</p>
          </div>
        </div>
        <div className="mt-16"><p className="text-[16px] font-semibold mb-5">마이페이지 · 활동 / 피드 / 레벨업 보상</p>
          <ul className="grid grid-cols-3 gap-3 md:gap-8 max-w-[880px]">{[[I('my-1'), '활동', '마이페이지 활동 탭'], [I('my-2'), '피드', '마이페이지 피드 탭'], [I('my-3'), '레벨업 보상', '레벨업 보상']].map(([src, l, a]) => <li key={src}><Zoomable src={src} alt={a} caption={l} className="w-full" imgClass="w-full rounded-[20px] border border-grid bg-white" /><p className="mt-3 text-[14px] text-sub">{l}</p></li>)}</ul></div>
      </section>

      {/* 04 Reflection */}
      <section id="c5" className="scroll-mt-20 md:mt-24 rule">
        <div className="wrap gutter py-20 md:py-32">
          <ChapterHead color={S} n="04" label="Outcome & Reflection" title="출시 이후 다시 바라본 미션 생성" />
          <p className="mt-6 inline-block px-4 py-2 rounded-full text-[13px] font-semibold" style={{ background: T(14), color: S }}>사후 개선 제안 · 샘플 작업, 출시된 기능이 아닙니다</p>
          <div className="mt-8 md:grid md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-12 grid sm:grid-cols-2 gap-5 max-w-[860px]">
              {[['Current · 출시 버전', ['미션 제목', '태그 선택', '상금 설정', '미션 종류'], false], ['Proposed · 개선 제안', ['미션 제목', '미션 종류', '태그 선택', '상금 설정'], true]].map(([t, items, prop]) => (
                <div key={t as string} className="rounded-[20px] p-6" style={{ background: prop ? T(10) : '#f3f3f3', border: prop ? `1px solid ${T(45)}` : 'none' }}>
                  <p className="text-[16px] font-bold" style={{ color: prop ? S : undefined }}>{t as string}</p>
                  <ol className="mt-4 space-y-2">{(items as string[]).map((x, i) => <li key={x} className="rounded-[12px] bg-white px-4 py-3 text-[16px] flex gap-3" style={prop && i >= 1 ? { color: S } : undefined}><span className="text-sub">{i + 1}</span>{x}</li>)}</ol>
                </div>
              ))}
              <p className="sm:col-span-2 text-[17px] leading-[1.8]">미션의 수행 방식(종류)을 먼저 정한 뒤 보상을 설정하는 흐름이 더 자연스러울 가능성이 있다고 판단해, 새 페이지로 전환하는 구성을 제안했습니다. 위 01에서 보여준 한 화면 구성이 그 샘플 작업이에요.</p>
            </div>

          </div>
          <div className="mt-20 rounded-[28px] p-8 md:p-12" style={{ background: T(8) }}>
            <p className="eyebrow" style={{ color: S }}>What I Learned</p>
            <p className="mt-5 text-[24px] md:text-[28px] leading-[1.5] font-normal max-w-[34ch]">비즈니스 관점의 요구와 사용자 경험 관점의 고민이 일치하지 않는 순간을 경험했습니다.</p>
            <p className="mt-5 text-[17px] leading-[1.8] max-w-[52ch]">그래서 비즈니스의 목표와 사용자 경험을 함께 이해하고 <b>서로의 관점을 연결</b>하는 일이 디자이너의 중요한 역할이라고 배웠습니다.</p>
          </div>
          <details className="mt-12 rounded-[20px] border border-grid p-6">
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
