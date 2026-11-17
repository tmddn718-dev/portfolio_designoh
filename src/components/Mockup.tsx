import { useEffect, useState } from 'react'
import { profile, type Project } from '../data/projects'

export function useMedia(q: string) {
  const [m, setM] = useState(() => typeof matchMedia !== 'undefined' && matchMedia(q).matches)
  useEffect(() => {
    const mq = matchMedia(q); const f = () => setM(mq.matches)
    f(); mq.addEventListener('change', f); return () => mq.removeEventListener('change', f)
  }, [q])
  return m
}

export function Phone({ src, framed }: { src: string; framed: boolean }) {
  return framed
    ? <div className="phone"><img src={src} alt="" loading="lazy" /></div>
    : <img src={src} alt="" loading="lazy" className="phone-bare" />
}

// public/proto 의 실제 프로토타입을 폰 프레임 안에서 실행한다.
export function ProtoFrame({ p, width = 300 }: { p: Project; width?: number }) {
  if (!p.proto) {
    return (
      <div className="text-[13px] text-sub" style={{ width }}>
        <div className="phone" style={{ width: width * 0.6 }}><img src={p.mock.srcs[1]} alt={`${p.name} 시안`} /></div>
        <p className="mt-3">서비스 운영이 중단되어 실행할 수 없고, 당시 시안만 보관하고 있어요.</p>
      </div>
    )
  }
  const bare = !!p.proto.bare // 프로토타입이 자체 기기 베젤을 가진 경우 바깥 프레임을 또 씌우지 않는다
  const inner = bare ? width : width - 20, k = inner / p.proto.w
  const frame = (
    <iframe key={p.slug} title={`${p.name} 프로토타입`} src={p.proto.url} loading="lazy" allowTransparency
      style={{ width: p.proto.w, height: p.proto.h, transform: `scale(${k})`, transformOrigin: 'top left', border: 0, background: 'transparent' }} />
  )
  return (
    <div>
      {bare
        ? <div className="overflow-hidden" style={{ width: inner, height: p.proto.h * k, borderRadius: 62 * k }}>{frame}</div>
        : <div className="rounded-[28px] bg-[#111] p-[10px] shadow-[0_30px_60px_-20px_rgba(0,0,0,.45)]" style={{ width }}>
            <div className="overflow-hidden rounded-[28px] bg-white" style={{ width: inner, height: p.proto.h * k }}>{frame}</div>
          </div>}
      <p className="mt-3 text-[13px] text-sub flex items-center justify-between" style={{ width }}>
        <span>{p.name} · 직접 눌러보세요</span>
        <a className="text-bluetext underline underline-offset-4 py-1" href={p.proto.url} target="_blank" rel="noreferrer">새 탭에서 열기</a>
      </p>
    </div>
  )
}

export const owner = profile.name
