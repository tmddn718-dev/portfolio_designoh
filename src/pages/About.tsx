import { Link } from 'react-router-dom'
import { profile } from '../data/projects'
import Reveal from '../components/Reveal'

const skills = [['실제 서비스 출시', 'trigr — 기획 단계부터 세 번의 개편을 거쳐 출시까지 참여'], ['UX/UI 설계 · 디자인 시스템', 'Figma Variables로 컴포넌트 디자인 시스템을 구축'], ['프로토타이핑', 'Claude Code, Figma Make로 HTML 프로토타입을 직접 구현'], ['개발 협업', '개발자와 구현 가능한지 확인하며 화면을 조정']]

const Row = ({ t, children }: { t: string; children: React.ReactNode }) => (
  <section className="rule py-10 md:py-14 md:grid md:grid-cols-12 gap-6">
    <h2 className="eyebrow text-bluetext md:col-span-3">{t}</h2>
    <div className="mt-4 md:mt-0 md:col-span-9 text-[17px] leading-[1.8]">{children}</div>
  </section>
)

export default function About() {
  return (
    <div>
      <section style={{ background: '#F7F8FA' }}>
        <div className="wrap gutter pt-14 md:pt-24 pb-14 md:pb-20 md:grid md:grid-cols-12 gap-6 items-end">
          <div className="md:col-span-8">
            <p className="eyebrow text-bluetext">About</p>
            <h1 className="mt-4 text-[48px] md:text-[96px] font-extrabold tracking-[-0.045em] leading-[1]">{profile.name}</h1>
            <p className="mt-6 text-[24px] md:text-[32px] font-bold leading-snug max-w-[24ch]">복잡한 정보를 <span className="text-blue">사용자가 판단할 수 있는</span> 경험으로.</p>
          </div>
          <div className="mt-6 md:mt-0 md:col-span-4">
          <p className="text-[18px] font-bold">{profile.name}</p>
          {profile.phone && <a className="mt-1 inline-block py-1 text-[18px] font-semibold text-bluetext" href={`tel:${profile.phone.replace(/-/g, '')}`}>{profile.phone}</a>}
          <p className="mt-3 text-[16px] leading-relaxed text-sub">Product Designer / UX·UI Designer. 문제를 구조로 정리하고, 판단에 필요한 정보의 우선순위를 설계합니다.</p>
          </div>
        </div>
      </section>

      <div className="wrap gutter">
        <Row t="WHAT I DO">
          <ul className="grid sm:grid-cols-2 gap-3">{skills.map(([a, b]) => <li key={a} className="rounded-[20px] bg-[#F7F8FA] p-5"><p className="text-[16px] font-bold">{a}</p><p className="mt-1 text-[14px] leading-snug text-sub">{b}</p></li>)}</ul>
        </Row>
        <Row t="DESIGN PHILOSOPHY">Soft Clarity — 부드러움, 명확함, 절제, 일관성, 배려. 복잡함을 없애기보다 사용자가 판단할 수 있는 순서로 정리합니다.</Row>
        <Row t="EXPERIENCE">
          <ul className="space-y-6">{profile.experience.map(e => (
            <Reveal key={e.org}><li><p className="text-[14px] text-sub">{e.period}</p><p className="font-semibold">{e.org} · {e.role}</p><p className="text-sub text-[16px]">{e.desc}</p></li></Reveal>
          ))}</ul>
        </Row>
        <Row t="TOOLS">
          <dl className="space-y-4">{profile.tools.map(([k, v]) => <div key={k}><dt className="text-[14px] text-sub">{k}</dt><dd>{v}</dd></div>)}</dl>
        </Row>
        <Row t="EDUCATION"><ul>{profile.education.map(e => <li key={e}>{e}</li>)}</ul></Row>
        <Row t="CONTACT">
          <a className="underline underline-offset-4" href={`mailto:${profile.email}`}>{profile.email}</a>
          {profile.resume && <> · <a className="underline underline-offset-4" href={profile.resume} target="_blank" rel="noreferrer">이력서 PDF</a></>}
          <p className="mt-6"><Link to="/#work" className="inline-block py-2 font-semibold text-bluetext border-b border-bluetext">프로젝트 보기</Link></p>
        </Row>
      </div>
    </div>
  )
}
