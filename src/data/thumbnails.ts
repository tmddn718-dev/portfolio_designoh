// 홈 프로젝트 카드의 스마트폰 목업 섬네일 설정.
// 프로젝트별로 이 값만 바꾸면 구도를 바꿀 수 있고, 항목을 지우면 기존 섬네일(Sections.tsx)로 돌아간다.
// x · w 는 섬네일 폭 기준 %, y 는 섬네일 높이 기준 % (섬네일은 4:3 고정).
export type PhoneSpec = {
  src: string
  alt: string
  role: 'main' | 'back'   // main: 가장 크게, hover 때 위로 / back: 뒤에서 겹침, hover 때 미세하게 반대로
  x: number
  y: number
  w: number
  rot?: number            // 도
  z?: number
}
export type ThumbSpec = { bg: string; phones: PhoneSpec[]; hideBackOnSmall?: boolean }
const I = (d: string, n: string) => `/images/${d}/${n}.webp`

export const thumbSpecs: Record<string, ThumbSpec> = {
  // 당근: 개선된 거래 정보 화면을 정면으로 크게, 질문 고르기 시트는 뒤에서 살짝 기울여 거래 흐름을 보여줌
  'karrot-large-furniture': {
    bg: '#F6E5D6',
    phones: [
      { src: '/images/karrot-large-furniture/f-b3.webp', alt: '질문 고르기 바텀시트', role: 'back', x: 17, y: 17, w: 30, rot: -6, z: 1 },
      { src: '/images/karrot-large-furniture/L-b1.webp', alt: '크기·분해와 가져가는 조건을 보여주는 상품 상세', role: 'main', x: 41, y: 8, w: 36, z: 2 },
    ],
    hideBackOnSmall: true,
  },
  // NODI: 정면의 추천 화면 + 오른쪽 뒤에서 약하게 기울어진 최종 검토 화면 (블루·라벤더 SaaS 톤)
  nodi: {
    bg: '#E1E6FA',
    phones: [
      { src: I('nodi', 'hero-review'), alt: '이 일정으로 확정할지 묻는 최종 검토 화면', role: 'back', x: 51, y: 13, w: 30, rot: 7, z: 1 },
      { src: I('nodi', 's-recs'), alt: '추천 회의 시간과 후보를 보여주는 화면', role: 'main', x: 23, y: 8, w: 36, z: 2 },
    ],
    hideBackOnSmall: true,
  },
  // 우리사이: 추억 피드와 사진 상호작용 화면 두 개를 따뜻한 톤 위에 자연스럽게 겹침
  woorisai: {
    bg: '#E8E7D9',
    phones: [
      { src: I('woorisai', 'feed'), alt: '추억 게시글이 쌓이는 피드', role: 'back', x: 15, y: 14, w: 31, rot: -7, z: 1 },
      { src: I('woorisai', 'ph-after-top'), alt: '사진에 반응과 댓글을 남기는 상세 화면', role: 'main', x: 40, y: 8, w: 36, rot: 2, z: 2 },
    ],
    hideBackOnSmall: true,
  },
  // trigr: 정산 신청 입력 화면을 정면으로, 상금 지급 화면을 뒤에서 기울여 두 핵심 사례를 보여줌
  trigr: {
    bg: '#F3DDF4',
    phones: [
      { src: I('trigr', 'tr-reward-2'), alt: '상금 입력 후 남은 상금이 계산되는 화면', role: 'back', x: 52, y: 16, w: 30, rot: 6, z: 1 },
      { src: I('trigr', 'set-2-filled'), alt: '정산 금액을 입력하고 실제 정산 금액을 확인하는 화면', role: 'main', x: 24, y: 8, w: 36, z: 2 },
    ],
    hideBackOnSmall: true,
  },
  // 올리브영(대표 카드): 대체 수령 방법 확인 화면을 정면으로, 옵션 선택 화면을 뒤에서 기울임
  'oliveyoung-todaydream': {
    bg: '#DCEFB4',
    phones: [
      { src: I('oliveyoung-todaydream', 'n-optC'), alt: '품절 옵션을 안내하는 옵션 선택 화면', role: 'back', x: 14, y: 14, w: 28, rot: -6, z: 1 },
      { src: I('oliveyoung-todaydream', 'n-altMethods'), alt: '다른 구매 방법을 비교하는 화면', role: 'main', x: 38, y: 5, w: 36, z: 2 },
    ],
    hideBackOnSmall: true,
  },
}
