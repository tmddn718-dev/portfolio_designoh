import type { CSSProperties } from 'react'
import type { PhoneSpec, ThumbSpec } from '../data/thumbnails'

// 실제 앱 화면(780×1688 PNG)을 사이트의 기존 베젤(.phone-pro)에 넣는 재사용 목업.
// 위치·크기·회전은 CSS 변수로만 전달하고, 움직임은 transform 전환만 쓴다(index.css의 .pm).
export function PhoneMockup({ src, alt, role, x, y, w, rot = 0, z }: PhoneSpec) {
  const style = { left: `${x}%`, top: `${y}%`, width: `${w}%`, zIndex: z, '--rot': `${rot}deg` } as CSSProperties
  return (
    <div className={`pm pm-${role}`} style={style}>
      <div className="phone-pro">
        <img className="screen" src={src} alt={alt} width={780} height={1688} loading="lazy" decoding="async" draggable={false} />
        <span className="glare" />
      </div>
    </div>
  )
}

// 4:3 섬네일 한 장(fill이면 부모 영역을 가득 채움: 올리브영 대표 카드). 부모 카드가 `group`이면 hover·포커스에 반응한다.
export function PhoneShowcase({ spec, fill = false }: { spec: ThumbSpec; fill?: boolean }) {
  return (
    <div className={`pm-stage overflow-hidden ${fill ? 'pm-fill absolute inset-0' : 'relative aspect-[4/3]'} ${spec.hideBackOnSmall ? 'pm-hide-back-sm' : ''}`} style={{ background: spec.bg }}>
      {spec.phones.map(p => <PhoneMockup key={p.src} {...p} />)}
    </div>
  )
}
