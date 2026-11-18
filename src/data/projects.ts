// 프로젝트 단일 데이터 소스. 실제 자료가 없는 필드는 TODO 로 두고, 수치·인터뷰·성과를 만들지 않는다.
export const TODO = '추후 입력'

export interface Project {
  slug: string
  name: string
  category: string
  kind: '기존 서비스 UX 개선' | '신규 서비스' | '출시 회고'
  problem: string // 사용자 문제 한 줄 (방향 설정안, 원본 자료로 확정 필요)
  role: string
  period: string
  tags: string[]
  summary: { short: string; decision: string; status: string; kind: 'launched' | 'design' | 'evidence' } // 채용 담당자용 30초 요약(원문 근거 내 표현만)
  thumbnail?: string // public/images/<slug>/thumb.png 가 준비되면 지정
  thumbAlt?: string
  accent: string // 프로젝트 서브컬러(Hero 틴트·마커 전용) // 썸네일 placeholder 에서만 사용하는 프로젝트 색
  mock: { srcs: [string, string, string]; framed: boolean } // 섬네일 목업(가운데가 메인)
  proto?: { url: string; w: number; h: number; bare?: boolean }
  // 포트폴리오 제작용 가상(시뮬레이션) 사용성 테스트 데이터. 실제 리서치 결과가 아니며 화면에 항상 그렇게 표기한다. 실측 후 교체.
  // 테스트 수행 전에 작성한 예측 시나리오(실제 결과 아님). 화면에 항상 '예상 결과'로 표기한다.
  forecast?: { buyer: string[][]; question: string[][]; seller: string[][] }
  simulation?: { n: number; rows: { id: string; asis: boolean; tobe: boolean; asisSec: number; tobeSec: number }[]; limit: number } // public/proto 에 담긴 실행 가능한 프로토타입
  // 본 흐름 밖의 연관 개선(예: 매출과 연결되는 구매 구간). 있을 때만 상세 Exploration 챕터에 나타난다.
  extra?: { eyebrow: string; title: string; intro: string; bullets: string[]; images: { src: string; alt: string; caption: string; tall?: boolean }[] }
  gallery?: { src: string; alt: string; caption: string }[] // 앱 화면 (세로형)
  // 실제 제작된 전/후 시안이 있을 때만 채운다. 없으면 모듈이 렌더되지 않는다.
  beforeAfter?: { before: string; after: string; beforeAlt: string; afterAlt: string; points: string[] }[]
  sections: { id: string; title: string; body: string }[]
}

const pending = (id: string, title: string) => ({ id, title, body: TODO })

export const projects: Project[] = [
  {
    slug: 'oliveyoung-todaydream',
    name: '올리브영 오늘드림',
    category: '기존 서비스 UX 개선 · 커머스',
    kind: '기존 서비스 UX 개선',
    problem: '오늘드림이 품절돼도 다른 구매 방법을 발견하고 구매를 이어갈 수 있도록, 옵션 선택부터 수령 방법 확인까지의 흐름을 재설계했습니다.',
    role: '기획 · 디자인 · 프로토타입 구현 (1인)',
    period: '1주',
    tags: ['상태 표현', '구매 흐름', '예외 처리'],
    summary: { short: '품절 이후에도 구매를 이어가는 옵션 선택 흐름', decision: '옵션별 행동을 찾는 방식에서, 선택한 옵션의 다음 행동을 확인하는 방식으로. 옵션 목록 + 하단 고정 CTA, 수령 방법별 재고 확인 분리.', status: '설계안 · 시뮬레이션 데이터로 점검(실제 사용성 테스트 아님)', kind: 'design' },
    accent: '#82DC28',
    mock: { srcs: ['/images/oliveyoung-todaydream/n-altMethods.webp', '/images/oliveyoung-todaydream/n-optC.webp', '/images/oliveyoung-todaydream/n-restock.webp'], framed: true },
    proto: { url: '/proto/oliveyoung/index.html', w: 390, h: 844 },
    extra: {
      eyebrow: 'Commerce flow',
      title: '매출과 연결되는 구매 구간도 함께 개선',
      intro: '품절 이후 경험과 함께, 올리브영의 매출과 연결될 수 있는 구매 구간(장바구니, 배송 시간, 주문·결제, 상세 하단)도 UX/UI를 개선했습니다. 매출에 미치는 효과는 측정하지 않았고, 개선 의도입니다.',
      bullets: [
        '장바구니: 무료배송 기준까지 남은 금액을 안내하고, 함께 담기 좋은 상품을 제안합니다.',
        '배송 시간: 날짜와 시간대별 배송비를 함께 보여주고, 무료배송까지 남은 금액을 안내합니다.',
        '주문·결제: 한 페이지에 길게 이어지던 정보를 배송·수령 / 할인·혜택 / 최종 결제의 3그룹으로 정리하고 접고 펼 수 있게 했습니다.',
        '상품 상세 하단: 오늘드림과 매장 픽업 중 수령 방법을 고르는 패널로 정리했습니다.',
      ],
      images: [
        { src: '/images/oliveyoung-todaydream/n-checkoutAsis.webp', alt: '기존 주문 결제 화면(실제 앱 캡처)', caption: 'AS-IS 주문/결제' },
        { src: '/images/oliveyoung-todaydream/n-checkoutTobe.webp', alt: '개선 주문 결제 화면: 배송·수령 정보, 할인·혜택, 최종 결제 3그룹', caption: '주문/결제 3그룹' },
        { src: '/images/oliveyoung-todaydream/n-slot.webp', alt: '배송 날짜와 시간대별 배송비, 무료배송까지 남은 금액 안내', caption: '시간대별 배송비' },
        { src: '/images/oliveyoung-todaydream/n-cart.webp', alt: '장바구니: 무료배송까지 남은 금액과 함께 담기 좋은 상품', caption: '장바구니 무료배송 안내' },
      ],
    },
    simulation: { n: 8, limit: 120, rows: [
      { id: 'P01', asis: true, tobe: true, asisSec: 55, tobeSec: 38 }, { id: 'P02', asis: false, tobe: true, asisSec: 90, tobeSec: 45 },
      { id: 'P03', asis: false, tobe: true, asisSec: 120, tobeSec: 48 }, { id: 'P04', asis: true, tobe: true, asisSec: 62, tobeSec: 50 },
      { id: 'P05', asis: false, tobe: true, asisSec: 110, tobeSec: 54 }, { id: 'P06', asis: true, tobe: true, asisSec: 70, tobeSec: 58 },
      { id: 'P07', asis: false, tobe: false, asisSec: 90, tobeSec: 95 }, { id: 'P08', asis: false, tobe: true, asisSec: 65, tobeSec: 60 },
    ] },
    beforeAfter: [
      {
        before: '/images/oliveyoung-todaydream/n-optMain.webp', after: '/images/oliveyoung-todaydream/n-optC.webp',
        beforeAlt: '기존 옵션 선택 바텀시트 재현: 품절 옵션마다 일시품절 표시와 재입고 알림 버튼이 있다', afterAlt: '개선 옵션 선택 화면: 오늘드림 품절 옵션을 고르면 하단에서 다른 구매 방법 확인이 주요 행동으로 나온다',
        points: ['Before: 품절 옵션마다 "일시품절" 표시와 "재입고 알림" 버튼이 줄마다 있고, 다른 구매 방법을 확인하는 행동은 보이지 않는다', 'After: 옵션 목록은 비교하는 영역으로 두고, 선택한 옵션에 맞는 주요 CTA("다른 구매 방법 확인")를 하단에 고정한다', '※ Before는 실제 앱의 옵션 바텀시트 구조(일시품절 표시, 재입고 알림)를 관찰해 재현한 화면이며 실제 앱 캡처가 아닙니다. 상품 이미지는 시안으로 대체했습니다'],
      },
      {
        before: '/images/oliveyoung-todaydream/n-detailAsis.webp', after: '/images/oliveyoung-todaydream/n-detailExpanded.webp',
        beforeAlt: '기존 상품 상세 하단: 오늘드림 선택 시 배송지와 장바구니·바로구매 버튼이 나온다', afterAlt: '개선 상품 상세 하단: 오늘드림·매장 픽업 중 수령 방법을 고르는 패널',
        points: ['Before: 오늘드림을 고르면 배송지 확인과 장바구니·바로구매가 함께 나온다', 'After: 수령 방법(오늘드림 · 매장 픽업)을 패널에서 먼저 고르고, 매장 픽업이면 매장과 재고를 확인한다', '※ Before는 실제 앱 화면을 직접 캡처한 이미지이며 주소 등 개인정보는 가렸습니다'],
      },
      {
        before: '/images/oliveyoung-todaydream/n-checkoutAsis.webp', after: '/images/oliveyoung-todaydream/n-slot.webp',
        beforeAlt: '기존 주문/결제: 배송 시간대를 고른 뒤 아래에 배송비가 한 번 표시된다', afterAlt: '개선 배송 시간 선택: 시간대마다 배송비를 함께 표시',
        points: ['Before: 배송 시간대를 선택한 뒤 별도 영역에서 배송비를 확인한다(12:45~13:45 선택 시 5,000원)', 'After: 12:45~13:45는 5,000원, 15:00~16:00과 22:00~24:00은 2,500원처럼 시간대마다 배송비를 함께 표시한다', '※ Before는 실제 앱 화면을 직접 캡처한 이미지이며 개인정보는 가렸습니다'],
      },
      {
        before: '/images/oliveyoung-todaydream/n-checkoutAsis.webp', after: '/images/oliveyoung-todaydream/n-checkoutTobe.webp',
        beforeAlt: '기존 주문/결제: 배송 방법, 요청사항, 주문상품, 쿠폰이 세로로 이어진다', afterAlt: '개선 주문/결제: 배송·수령 정보, 할인·혜택, 최종 결제 3그룹',
        points: ['Before: 배송 시간 선택, 요청사항, 주문상품, 쿠폰 등이 한 화면에 길게 이어진다', 'After: 배송·수령 정보 / 할인·혜택 / 최종 결제 3그룹으로 묶고 접고 펼칠 수 있다', '※ Before는 실제 앱 화면을 직접 캡처한 이미지이며 주소 등 개인정보는 가렸습니다'],
      },
    ],
    gallery: [
      { src: '/images/oliveyoung-todaydream/n-optA.webp', alt: '옵션 선택 바텀시트: 재고 상태별 구매 방법 표시', caption: '옵션 선택' },
      { src: '/images/oliveyoung-todaydream/n-optC.webp', alt: '오늘드림 품절 옵션: 다른 구매 방법 확인이 주요 행동', caption: '품절 옵션 선택' },
      { src: '/images/oliveyoung-todaydream/n-altMethods.webp', alt: '다른 수령 방법: 일반배송 구매 가능', caption: '일반배송 구매 가능' },
      { src: '/images/oliveyoung-todaydream/n-altPickup.webp', alt: '다른 수령 방법: 픽업 주문 가능', caption: '픽업 주문 가능' },
      { src: '/images/oliveyoung-todaydream/n-pickup.webp', alt: '픽업 매장 선택: 매장별 재고와 픽업 가능 여부', caption: '픽업 매장 선택' },
      { src: '/images/oliveyoung-todaydream/n-stockChanged.webp', alt: '주문 직전 픽업 재고가 바뀐 경우의 안내', caption: '주문 직전 재고 변동' },
      { src: '/images/oliveyoung-todaydream/n-restock.webp', alt: '재입고 알림 신청', caption: '재입고 알림 신청' },
      { src: '/images/oliveyoung-todaydream/n-restockDone.webp', alt: '재입고 알림 신청 완료', caption: '재입고 알림 완료' },
    ],
    sections: [
      { id: 'overview', title: 'Overview', body: '올리브영 오늘드림 품절 이후 구매 결정 UX/UI 개선. 오늘드림으로 구매하려던 옵션이 품절됐을 때, 사용자가 다른 구매 방법을 확인하거나 재입고를 기다리는 등 자신의 목적에 맞는 다음 행동을 고를 수 있게 하는 비공식 UX 개선 프로젝트입니다. 품절 이후 경험과 함께, 매출과 연결될 수 있는 구매 구간(장바구니, 배송 시간, 주문·결제)도 개선했습니다.\n\n기획, 디자인, 프로토타입 구현을 혼자 진행했습니다.' },
      { id: 'screens', title: 'Screens (프로토타입 캡처)', body: '올리브영의 비공식 개인 UX 개선 제안이며 소속 회사와 무관합니다. 아래는 Claude Code로 만든 390px 클릭형 프로토타입을 캡처한 화면이고, 재고·매장·수령 시간은 모두 가상 데이터입니다.' },
      { id: 'problem', title: 'Problem', body: '오늘드림 품절 옵션에는 일시품절만 표시되어 품절 범위(오늘드림만인지, 전체인지)가 불명확하고, 재입고 알림 외에 지금 살 수 있는 대체 구매 경로를 찾기 어렵습니다.\n\n사용자 질문: "오늘드림만 안 되는 걸까? 일반배송도 품절인 걸까?", "지금 사고 싶은데 다른 방법으로 살 수 없을까?"\n\n※ VOC·인터뷰와 UI 관찰에 기반한 문제 가설이며, 사용자 불편과 구매 이탈의 크기는 사용성 테스트로 추가 검증이 필요합니다.' },
      { id: 'research', title: 'Evidence / Research', body: '실제 서비스를 쓰는 사람들의 불편을 두 갈래로 모았습니다. 구글 플레이·앱스토어 앱 리뷰와 블로그 등 웹 후기에서 VOC를 수집했고, 실제 사용자 인터뷰도 진행했습니다.\n\n이와 별도로 실제 앱 UI를 관찰해 4가지 사실을 정리했습니다. 상품 옵션이 바텀시트에 목록으로 제공되고, 일부 옵션에 오늘드림 표시가 있으며, 품절 옵션에는 일시품절이 표시되고, 품절 옵션에서는 재입고 알림을 제공합니다. 이를 상품 검색 → 오늘드림 탐색 → 상품 상세 → 옵션 선택 → 품절 확인 → 다음 행동 탐색 시나리오로 풀어, 품절을 확인한 뒤 다음 행동을 고르는 순간을 이탈 위기로 보았습니다.\n\n※ VOC와 인터뷰의 원자료가 남아 있지 않아 표본 수, 인용, 수치는 싣지 않습니다.' },
      { id: 'insight', title: 'Insight', body: '핵심 질문은 "오늘드림 품절은 사용자의 구매 여정이 끝나는 순간이어야 할까?"였습니다. 사용자가 원하는 것은 품절 여부를 아는 것이 아니라 상품을 살 수 있는 다음 방법을 찾는 것이라고 정리했습니다.' },
      { id: 'decisions', title: 'Design Decisions', body: 'UX 설계 원칙 4가지: 옵션 목록의 주요 CTA는 하나로 유지 / 선택한 옵션과 수량을 유지 / 재고를 확인하기 전에는 구매 가능 여부를 단정하지 않음 / 기존 재입고 알림 접근성을 유지.\n\n옵션이 많은 상품에서 일반배송, 픽업, 재입고 알림 버튼을 모두 늘어놓지 않고 주요 CTA 하나로 줄여 복잡도를 낮췄습니다.\n\n오늘드림은 배송지, 픽업은 선택한 매장을 기준으로 재고를 확인하므로 대체 구매 과정에서 두 확인 경로를 구분했습니다.' },
      { id: 'solution', title: 'Solution', body: '1. 품절 상태 명확화: 재고 정보가 확인된 경우 오늘드림 품절과 전체 품절을 구분해 안내합니다.\n\n2. 다른 구매 방법 확인: 품절 옵션에 구매 방법 CTA를 제공하고, 재고 상태에 따라 일반배송 또는 매장 픽업 확인 경로로 연결합니다.\n\n3. 재입고 알림 유지: 오늘드림 재입고 알림은 보조 행동으로 유지하고, 모든 방법이 품절이면 주요 행동으로 제공합니다.\n\n프로토타입에는 일반배송 가능, 매장 픽업, 모든 방법 품절, 재고 조회 실패 후 재시도, 주문 중 픽업 재고 소진 후 다른 매장 선택까지 담았습니다.' },
      { id: 'validation', title: 'Validation', body: '사용성 테스트는 계획 단계이며 아직 결과가 없습니다(저장 문서 기준). 실제 서비스의 구매 전환 데이터를 확보할 수 없어, 기존 UI와 개선 프로토타입을 비교하는 테스트를 계획했습니다.\n\n과업: 오늘드림 품절 후 다른 구매 방법 찾기 / 다른 지역의 픽업 매장 재고 확인 / 원하는 옵션의 재입고 알림 신청 / 옵션이 많은 목록에서 구매 방법 찾기. 지표: 대체 경로 발견률, 과업 성공률, 알림 신청 성공률, 완료 시간·오류 횟수.\n\n※ 기대 효과는 가설입니다. 비용·수익·경쟁 우위는 내부 데이터가 아닌 기획 가설입니다.' },
      pending('reflection', 'Reflection'),
    ],
  },
  {
    slug: 'karrot-large-furniture',
    name: '당근 대형 가구 중고거래',
    category: '기존 서비스 UX 개선 · 의사결정 지원',
    kind: '기존 서비스 UX 개선',
    problem: '구매자는 대형 가구의 거래 가능 여부를 판단하는 데 필요한 정보를 채팅 전에 충분히 확인하기 어렵다.',
    role: '기획 · 디자인 · 프로토타입 구현 (1인)',
    period: '2주',
    tags: ['정보 구조화', '구매 판단 지원', '리서치'],
    summary: { short: '채팅 전에 거래 조건을 구조화해 확인', decision: '거래 조건을 자유 서술이 아닌 구조화된 카드로. 미입력·판매자도 모름·불러오지 못함을 구분하고, 질문 초안은 사용자가 편집해서 보낸다.', status: '설계안 · 사용성 테스트 미수행(예측 지표는 ‘예상’으로 별도 표기)', kind: 'design' },
    accent: '#FF6F0F',
    mock: { srcs: ['/images/karrot-large-furniture/k-questions.webp', '/images/karrot-large-furniture/k-detail.webp', '/images/karrot-large-furniture/k-form.webp'], framed: true },
    forecast: {
      buyer: [['거래 정보 발견 성공률', '37.5%', '62.5%', '87.5%'], ['거래 조건 판단 정확도', '50%', '75%', '87.5%'], ['첫 유효 정보 발견 시간(중앙값)', '55초', '38초', '18초'], ['탐색 용이성(7점)', '3.1', '4.8', '6.0']],
      question: [['질문 작성 시간', '52초', '27초'], ['두 필수 질문 포함률', '62.5%', '87.5%']],
      seller: [['등록 시간', '2분 45초', '3분 10초'], ['거래 조건 정확 기재율', '50%', '87.5%'], ['입력 부담(7점, 높을수록 부담)', '2.8', '3.4']],
    },
    beforeAfter: [
      {
        before: '/images/karrot-large-furniture/asis-desc.webp', after: '/images/karrot-large-furniture/k-info.webp',
        beforeAlt: '기존 당근 상품 상세 본문: 크기가 자유 텍스트 문장 속에 있다', afterAlt: '개선 상품 상세 본문 아래: 크기 및 분해, 가져가는 조건을 거래 정보 카드로 정리',
        points: ['Before: 가로·깊이 같은 크기 정보가 본문 문장 속에 섞여 있다', 'After: 크기 및 분해, 가져가는 조건을 거래 정보 카드로 나눠 보여준다', '※ Before는 실제 당근 앱 화면 캡처이며 판매자 닉네임, 거래 장소 주소·지도, 캡처한 사람의 정보는 가렸습니다'],
      },
      {
        before: '/images/karrot-large-furniture/asis-loc.webp', after: '/images/karrot-large-furniture/k-info-partial.webp',
        beforeAlt: '기존 당근 상품 상세 하단: 거래 장소와 용달비 안내, 채팅·관심 수', afterAlt: '개선 상품 상세: 미입력과 판매자도 모름을 구분해 표시한 거래 정보 카드',
        points: ['Before: 상세 하단에는 거래 장소·용달비 안내와 조회·관심 수가 있고, 확인되지 않은 거래 조건을 알려주는 영역은 없다', 'After: 높이 미입력, 엘리베이터 모름, 운반 도움 아직 입력되지 않았어요처럼 상태를 구분해 보여준다', '※ Before는 실제 당근 앱 화면 캡처이며 개인정보는 가렸습니다'],
      },
    ],
    proto: { url: '/proto/karrot/index.html?sc=detail-partial', w: 390, h: 844 },
    gallery: [
      { src: '/images/karrot-large-furniture/k-form.webp', alt: '판매글 작성 화면: 제목, 카테고리, 가격, 선택형 가구 정보', caption: '판매자 · 글 작성' },
      { src: '/images/karrot-large-furniture/k-detail.webp', alt: '상품 상세: 거래 정보 영역', caption: '구매자 · 상세' },
      { src: '/images/karrot-large-furniture/k-questions.webp', alt: '어떤 정보가 궁금하세요? 질문 고르기 바텀시트', caption: '질문 고르기' },
      { src: '/images/karrot-large-furniture/k-chat.webp', alt: '고른 질문이 채팅 입력창 초안으로 추가된 화면', caption: '채팅 질문 초안' },
      { src: '/images/karrot-large-furniture/k-changed.webp', alt: '판매자가 수정한 가격·분해 여부를 비교하는 바텀시트', caption: '변경 내용 비교' },
      { src: '/images/karrot-large-furniture/k-recheck.webp', alt: '비정상적으로 큰 크기 값을 입력했을 때 재확인을 요청하는 화면', caption: '큰 값 재확인' },
      { src: '/images/karrot-large-furniture/k-partial.webp', alt: '일부만 입력된 상품 상세: 미입력과 모름을 구분해 표시', caption: '상세 · 일부 입력' },
      { src: '/images/karrot-large-furniture/k-fail.webp', alt: '정보 조회에 실패했을 때의 상세 화면', caption: '정보 조회 실패' },
    ],
    sections: [
      { id: 'overview', title: 'Overview', body: '질문하기 전에 알 수 있는 당근 상품 정보. 대형 가구 중고거래에서 판매자가 거래 조건을 쉽게 입력하고, 구매자가 채팅 전에 필요한 정보를 확인하도록 설계한 비공식 UX 개선 프로젝트입니다(PRD v2.1).\n\n기획, 디자인, 프로토타입 구현을 혼자 진행했습니다.' },
      { id: 'screens', title: 'Screens (프로토타입 캡처)', body: '당근의 비공식 개인 UX 개선 제안이며 소속 회사와 무관합니다. 아래는 당근 SEED Design의 공개 토큰·컴포넌트를 바탕으로 React로 구현한 클릭형 프로토타입(20개 화면 중 일부)을 캡처한 화면이고, 상품 정보는 예시입니다.' },
      { id: 'problem', title: 'Problem', body: '대형 가구 거래에서는 상품 크기, 분해 가능 여부, 운반 조건이 구매 결정에 중요한 정보가 될 수 있습니다. 그런데 이 정보가 상품 설명에 빠지거나 자유로운 문장으로 쓰이면, 구매자는 필요한 정보를 찾기 어렵고 판매자에게 같은 질문을 반복해야 할 수 있습니다.\n\n핵심 문제: 구매자는 대형 가구의 거래 가능 여부를 판단하는 데 필요한 정보를 채팅 전에 충분히 확인하기 어렵다.\n\n※ 디자인 가설입니다. 실제 발생 빈도와 영향은 사용자 테스트로 검증해야 합니다.' },
      { id: 'research', title: 'Evidence / Research', body: '실제 서비스를 쓰는 사람들의 불편을 구글 플레이·앱스토어 앱 리뷰와 블로그 등 웹 후기에서 VOC로 모았고, 실제 사용자 인터뷰도 진행했습니다. 이 근거를 바탕으로 PRD의 문제 정의를 세웠습니다.\n\n※ VOC와 인터뷰의 원자료가 남아 있지 않아 표본 수, 인용, 수치는 싣지 않습니다. 문제의 실제 발생 빈도와 영향은 사용성 테스트로 검증해야 하는 디자인 가설입니다.' },
      { id: 'insight', title: 'Insight', body: '정보를 더 많이 입력하게 만드는 것이 아니라, 구매자가 판단하는 데 필요한 정보를 쉽게 제공하는 것이 핵심이라고 정리했습니다. 또 "아직 입력되지 않음", "판매자도 모름", "불러오지 못함"은 서로 다른 상태라서 구분해 보여줘야 한다고 보았습니다.' },
      { id: 'decisions', title: 'Design Decisions', body: '설계 원칙 4가지: 기존 판매글 작성·채팅 흐름 유지 / 추가 정보는 선택 입력 / 없거나 불확실한 상태를 명확히 표현 / 입력을 늘리기보다 구매자의 판단을 돕는 데 집중.\n\n분해 가능 여부와 전달 상태(조립된 상태·분해된 상태·협의)를 분리했습니다. "분해 가능"이라는 말이 실제 전달 상태와 혼동되지 않게 하기 위해서입니다.\n\n엘리베이터가 있다는 이유로 운반 가능하다고 단정하지 않습니다. 비정상적으로 큰 크기 값은 차단하지 않고 재확인을 요청합니다. 질문은 자동 전송하지 않고 채팅 입력창에 초안으로만 추가하며, 기존에 입력한 내용은 덮어쓰지 않습니다.\n\n이번 범위에서 제외한 것: 크기 실측 인증, 엘리베이터·복도 폭 입력, 운반 가능 여부 자동 판정, 운반 서비스 예약·결제, 자동 재고 예약, 복잡한 변경 이력 화면. 핵심 문제와의 연관성, 판매자 입력 부담, 구현 범위를 고려해 뺐습니다.' },
      { id: 'solution', title: 'Solution', body: '판매자: 판매글 작성 → 가구 정보 선택 입력(크기, 분해 여부, 층수·엘리베이터·운반 도움) → 입력 정보 확인 → 등록. 모든 추가 항목은 선택이며, 입력하지 않아도 등록할 수 있습니다.\n\n구매자: 상품 상세에서 크기 및 분해 정보, 가져가는 조건, 미확인 정보를 순서대로 확인하고, 필요하면 궁금한 항목을 골라 채팅 질문 초안을 만듭니다.\n\n정보 변경: 판매자가 가격·크기·분해 정보·가져가는 조건을 수정하면 구매자에게 변경 안내를 보여주고, 실제 이전 값이 있을 때만 변경 전후를 비교합니다.\n\n예외 상태(정보 조회 실패와 재시도, 거래 완료 등)까지 포함해 20개 화면을 클릭형 프로토타입으로 구현했습니다.' },
      { id: 'validation', title: 'Validation', body: '현재 사용성 테스트는 진행하지 않았습니다(PRD v2.1 기준: 설계안 확정 / 사용자 검증 전).\n\n계획: 판매자 입력, 구매자 정보 확인, 정보 변경 3가지 테스트를 기존 v1.9와 개선 v2.1 비교로, 구매·판매 경험자 약 6~8명을 대상으로 탐색적으로 진행하고 발견한 문제를 핵심 화면에 반영합니다.\n\n실제 전환율이나 채팅량 감소는 측정할 수 없어, 프로토타입에서 확인 가능한 지표(정보 탐색 과제 성공 여부, 거래 조건 이해 정확도, 입력 오류 발견·수정 여부, 변경 정보 인지 여부)를 쓰기로 했습니다. 기준선과 목표는 테스트 후 정합니다.' },
      pending('reflection', 'Reflection'),
    ],
  },
  {
    slug: 'nodi',
    name: 'NODI',
    category: '신규 서비스 · 생산성 / 협업',
    kind: '신규 서비스',
    problem: '여러 참여자의 시간과 필수/선택 조건을 조율하기 복잡하다.',
    role: '기획 · 디자인 · 프로토타입 구현 (1인)',
    period: '2주',
    tags: ['신규 제품 설계', '규칙·예외 정책', '일정 추천'],
    summary: { short: 'AI는 이해하고, 사용자는 결정한다', decision: 'AI는 자연어 이해와 설명을, 사용자는 참석자·날짜·후보를 구조화된 UI로 결정한다. 확정은 명시적 행동으로만.', status: '설계안 · 직장인 6명 인터뷰 기반 · 클릭 시나리오 19개 점검 통과(사용성 테스트 미수행)', kind: 'design' },
    accent: '#3654D4',
    mock: { srcs: ['/images/nodi/m-home.webp', '/images/nodi/m-recs.webp', '/images/nodi/m-review.webp'], framed: false },
    beforeAfter: [
      {
        before: '/images/nodi/it-init-conds.webp', after: '/images/nodi/it-final-conds.webp',
        beforeAlt: '초기 시안(v5.2) 조건 확인: 6개 항목이 같은 비중의 행으로 나열되고 확인 전·미정 배지가 붙는다', afterAlt: '개선 시안 조건 확인: 사용자의 말과 AI 정리 결과가 대화로 이어지고 제목과 날짜·시간이 카드에 먼저 나온다',
        points: ['Before: 회의 제목·길이·날짜·선호 시간대·방식·참석자 6개 항목이 같은 비중의 행으로 나열되고 "확인 전", "미정" 배지가 붙는다', 'After: 사용자가 말한 문장과 AI가 정리한 결과를 대화로 이어 보여주고, 제목과 날짜·시간을 카드 앞쪽에 둔다', '※ 초기 시안은 저장소의 v5.2 커밋(2026-11-16), 개선 시안은 현재 버전을 같은 도구로 렌더링한 화면입니다'],
      },
      {
        before: '/images/nodi/it-init-recs.webp', after: '/images/nodi/it-final-recs.webp',
        beforeAlt: '초기 시안 추천 시간: 추천 후보 3개 카드가 필수 조건 충족 칩과 함께 나열된다', afterAlt: '개선 시안 추천 시간: 오후 2시를 추천해요, NODI 추천 1순위 카드와 추천 이유 확인',
        points: ['Before: 후보 3개를 한꺼번에 카드로 나열하고, 후보마다 상태 칩과 안내 문구가 붙는다', 'After: 추천 1순위를 앞세우고 카드/후보 비교로 나눠 보며, 추천 이유는 바텀시트에서 확인한다', '※ 사용자가 두 화면을 어떻게 이해하는지는 아직 테스트하지 않았습니다'],
      },
      {
        before: '/images/nodi/it-init-done.webp', after: '/images/nodi/it-final-done.webp',
        beforeAlt: '초기 시안 저장 완료: 큰 3D 달력 일러스트와 두 개의 버튼', afterAlt: '개선 시안 저장 완료: 2D 체크 아이콘, 후속 처리 현황, 확인이 필요한 항목, 버튼 하나',
        points: ['Before: 큰 3D 달력 일러스트가 화면 위쪽을 차지하고 하단에 비슷한 비중의 버튼 두 개가 있다', 'After: 상태 아이콘을 2D 체크로 줄이고, 후속 처리 현황과 "확인이 필요한 항목 1건"을 먼저 보여준다', '※ 일러스트 교체는 저장소 커밋(63a8411 "3D 일러스트를 Lucide 2D 상태 아이콘으로 교체")에 기록돼 있습니다'],
      },
    ],
    proto: { url: '/proto/nodi/index.html', w: 414, h: 868, bare: true },
    gallery: [
      { src: '/images/nodi/hi-home.webp', alt: 'NODI 홈: 자연어 입력, 빠른 선택, 작성 중 회의', caption: '홈' },
      { src: '/images/nodi/hi-conds.webp', alt: 'AI가 정리한 회의 조건 확인 카드', caption: '조건 확인' },
      { src: '/images/nodi/hi-progress.webp', alt: '참석자 응답 현황과 리마인드', caption: '조율 현황' },
      { src: '/images/nodi/hi-recs.webp', alt: '추천 시간 카드와 추천 이유', caption: '추천 시간' },
      { src: '/images/nodi/hi-review.webp', alt: '확정 전 최종 검토와 후속 처리', caption: '최종 검토' },
      { src: '/images/nodi/hi-done.webp', alt: '저장 완료와 후속 처리 현황: 캘린더 연동·알림 상태 구분', caption: '저장 완료' },
    ],
    sections: [
      { id: 'overview', title: 'Overview', body: 'NODI는 AI와 대화하며 회의 조건을 입력하고, 참석자의 일정 정보를 확인한 뒤 적합한 회의 시간을 추천받아 확정하는 서비스입니다. 제가 직접 기획한 신규 서비스입니다. PRD v13.0과 초기 모바일 UI 7개 화면에서 출발해 UX/UI 개선 명세(v2.0)로 다듬고, 26개 아트보드의 모바일 시안으로 구현했습니다.\n\n기획, 디자인, 시안 구현을 혼자 진행했습니다.' },
      { id: 'screens', title: 'Screens (시안 캡처)', body: 'Claude Code와 Claude Design으로 만든 390pt 모바일 시안(26개 아트보드)을 캡처한 화면입니다. 실제 앱이 아니며 일정·알림·캘린더 연동은 시연용입니다.' },
      { id: 'problem', title: 'Problem', body: '회의를 잡는 사람은 참석자에게 일정을 묻고, 답이 없으면 다시 물어보고, 모인 조건을 직접 분석해 시간을 정하고, 확정한 뒤 변경이 생기면 처음부터 다시 조율해야 합니다. 이 반복이 회의 주최자에게 큰 스트레스가 됩니다.\n\n※ 직장인 6명 인터뷰에 기반한 문제 정의이며, 크기나 빈도는 검증하지 않았습니다.' },
      { id: 'research', title: 'Evidence / Research', body: '주변에서 실제로 회의를 잡아 본 직장인 6명을 카카오톡으로 인터뷰했습니다. 회의를 잡는 과정에서 가장 화나거나 스트레스를 받은 순간이 언제인지 물었고, 6명이 공통적으로 꼽은 가장 화났던 순간은 세 가지였습니다.\n\n1. 참석자에게 시간이 괜찮은지 물었는데 응답이 없어, 같은 사람에게 계속 리마인드해야 할 때\n2. 참석자들의 조건을 내가 직접 분석해 회의 시간을 정해야 할 때\n3. 어렵게 회의 시간을 확정했는데 갑자기 변경이 생겨, 앞서 한 조율을 처음부터 다시 해야 할 때\n\n이 인터뷰를 문제 정의의 출발점으로 삼았습니다.\n\n보조 근거로 웹에서 사용자 불편 사례를 조사하고 Codex로 사용자 불편사항을 정리했습니다. 이 부분은 AI가 정리한 2차 자료입니다.\n\n※ 인터뷰는 카카오톡 메시지로 진행한 소규모(6명) 조사이며 원자료와 구체적인 응답 내용은 확인 필요합니다.' },
      { id: 'insight', title: 'Insight', body: '인터뷰에서 나온 세 가지 스트레스를 각각 기능으로 풀었습니다. 미응답 반복 확인은 응답 현황과 리마인드로, 조건을 직접 분석하는 부담은 자연어 조건 입력과 추천 시간·추천 이유로, 확정 후 변경은 재조율과 이전 회의 재사용으로 대응했습니다.\n\n이후 시안 개선의 핵심은 사용자가 현재 단계를 이해하게 하고, AI가 해석한 조건과 사용자가 확정한 조건을 구분하고, 추천 결과의 근거와 불확실성을 설명하는 것으로 잡았습니다.' },
      { id: 'decisions', title: 'Design Decisions', body: 'AI는 자연어 이해와 설명을 맡고, 참석자 선택·날짜 변경·후보 선택은 구조화된 UI로 처리합니다. 최종 확정은 명시적인 사용자 행동으로만 수행합니다.\n\n참석자 선택(회의에 포함할 사람)과 필수 지정(일정 조건을 반드시 충족해야 하는 사람)을 다른 의미로 분리했고, 필수 지정은 참석 수락을 뜻하지 않습니다.\n\n일정 가능 여부, 참석 수락, 캘린더 상태, 알림 처리를 서로 다른 개념으로 표시하고, 데모 기능(캘린더 연동, 알림 발송)을 실제 성공처럼 보이게 하지 않습니다. 필수 참석자가 충돌하는 후보를 필수 일정 조건 충족으로 표시하지 않습니다.\n\n배지·상태 칩·CTA에는 아이콘 없이 텍스트만 쓰고, 최소 글자 13px, 터치 영역 44px을 기준으로 삼았습니다.' },
      { id: 'solution', title: 'Solution', body: '회의 잡기 → 자연어/선택형 입력 → 조건 확인 → 참석자 선택 → 일정 필수 → 조율 현황 → 추천 시간 → 최종 검토 → 저장 완료 흐름을 설계했습니다. 재조율, 받은 요청과 응답, 이전 회의 재사용, 작성 중 이어하기도 포함합니다.\n\n추천 시간 카드에는 상태 칩과 추천 이유 시트, 후보 비교를 두었고, 저장 완료 화면에는 후속 처리 현황을 보여줍니다. AI 해석 실패, 검색 결과 없음, 추천 계산 중·오류·없음 같은 상태 화면도 만들었습니다.' },
      { id: 'validation', title: 'Validation', body: '자체 점검 스크립트로 44px 미만 터치 영역과 13px 미만 글자가 없는지 확인하고, 클릭 시나리오 19개가 통과하는 것을 기록했습니다.\n\n한계: 조건 추출 AI는 규칙 기반 데모입니다. iOS Safari, Android, 실제 키보드, 320px, 큰 글자 환경은 시안 단계에서 검증하지 못했습니다.\n\n확인 필요 — 저장 문서에는 사용자 테스트 기록이 없습니다.' },
      pending('reflection', 'Reflection'),
    ],
  },
  {
    slug: 'woorisai',
    name: '우리사이',
    category: '신규 서비스 · 공동 기록 / 소셜',
    kind: '신규 서비스',
    problem: '한 번의 만남이 여러 서비스로 흩어져, 함께 만든 기억과 이야기가 남지 않는다.',
    role: '기획 · 디자인 · 프로토타입 구현 (1인)',
    period: '1주',
    tags: ['서비스 기획', '협업·권한', '상호작용'],
    summary: { short: '흩어진 기억을 하나의 추억으로', decision: '추억 하나부터 함께 기록하고, 사진 아래에서 바로 반응·대화하고, 발자국으로 다시 발견한다.', status: '설문 7명 · 권한 서버 테스트 통과 · 사진 상호작용·발자국 검증은 미수행', kind: 'evidence' },
    accent: '#566B5C',
    mock: { srcs: ['/images/woorisai/feed.webp', '/images/woorisai/home.webp', '/images/woorisai/new.webp'], framed: true },
    proto: { url: '/proto/woorisai/index.html', w: 390, h: 844 },
    gallery: [
      { src: '/images/woorisai/home.webp', alt: '홈: 최근 함께한 추억, 다가오는 약속, 우리의 발자국', caption: '홈' },
      { src: '/images/woorisai/feed.webp', alt: '추억 피드: 초대된 사람만 보는 공동 게시물', caption: '추억 피드' },
      { src: '/images/woorisai/detail.webp', alt: '추억 상세: 사진과 이야기를 함께 모은 공동 게시물', caption: '추억 상세' },
      { src: '/images/woorisai/add.webp', alt: '내 사진과 이야기 더하기 시트', caption: '사진·이야기 더하기' },
      { src: '/images/woorisai/people.webp', alt: '이 추억을 볼 수 있는 사람 확인', caption: '볼 수 있는 사람' },
      { src: '/images/woorisai/photo.webp', alt: '사진으로 추억 만들기 시작', caption: '사진으로 시작' },
      { src: '/images/woorisai/plan.webp', alt: '초대받은 약속: 참석 응답과 참석 현황', caption: '약속 · 참석 응답' },
      { src: '/images/woorisai/foot.webp', alt: '우리의 발자국: 지역별 추억 지도', caption: '우리의 발자국' },
      { src: '/images/woorisai/region.webp', alt: '서울의 발자국: 지역 안의 추억 목록', caption: '지역별 추억' },
    ],
    sections: [
      { id: 'overview', title: 'Overview', body: '우리사이는 함께한 사람만 초대해 하나의 추억을 같이 완성하고, 시간이 흐른 뒤 사람·장소·시간으로 다시 발견하는 프라이빗 공동 추억 기록 서비스입니다. 슬로건은 "함께한 순간을, 우리만의 이야기로."\n\n기획(PRD, 브랜드·UX 가이드), 디자인, 동작하는 웹 프로토타입 구현까지 혼자 진행했습니다.' },
      { id: 'screens', title: 'Screens (프로토타입 캡처)', body: '우리사이 모바일 화면 시안입니다. 사진은 Unsplash의 예시 이미지이고, 사용자 이름과 내용은 예시 데이터입니다.' },
      { id: 'problem', title: 'Problem', body: '사람들은 메신저에서 약속을 잡고, 각자 사진을 찍고, 정산 앱에서 비용을 나누고, 사진 앱에서 과거를 찾습니다. 한 번의 만남이 여러 서비스로 흩어져 그날의 맥락과 공동의 이야기가 남지 않습니다.\n\n※ PRD에서 정의한 문제 가설이며, 경쟁 서비스와의 차별점도 검증이 필요한 가설로 표현했습니다.' },
      { id: 'research', title: 'Evidence / Research', body: '웹에서 공동 추억 기록과 관련한 사용자 불편 사례를 조사하고, Codex로 사용자 불편사항을 정리해 문제 정의의 근거로 삼았습니다. 이후 설문조사를 직접 만들어 진행했고, 그 결과를 바탕으로 수정안을 만들었습니다.\n\n설문 응답: 7명 (2026.11.12 – 11.16, 여성 6·남성 1, 20대 6·30대 1)\n\n객관식 결과\n· 추억 만들기·기록: 쉽고 편리했다 5, 보통 2\n· 한 추억에 여러 친구가 사진·이야기 추가: 유용하고 매력적 4, 보통 2, 서술 1\n· 약속·일정 확인: 쉽고 편리했다 4, 보통 1, 체험하지 못함 1, 서술 1\n· 발자국(지역별 추억 찾기): 직관적이고 흥미로움 5, 보통 1, 서술 1\n· 지난 추억 회상: 다시 사용하고 싶은 경험 2, 보통 3, 체험하지 못함 1, 서술 1\n· 가장 개선이 필요한 영역: 추억 만들기·공동 기록 3, 특별히 없음 2, 서술 2\n\n서술형에서 나온 의견\n· 친구 초대 기능이 어디 있는지 찾지 못했다\n· 일정에 응답하지 않은 사람에게 재촉하는 버튼이 있으면 좋겠다\n· 장소 기록이 "서울 서울"처럼 표시되는 점이 불편하고, 지도 확대가 되면 좋겠다\n· 기능(추억, 달력 등)을 확인하러 가는 과정이 헷갈렸고 기능 구분이 불분명했다\n· 구글 캘린더 연동과 여행 기록 포함을 제안했다\n· 반드시 써야 할 매력 포인트가 약하다는 의견과, 소규모 모임이 잦은 사람에게는 유용하다는 의견이 함께 나왔다\n\n※ 응답자 7명, 20대 여성 중심의 소규모 표본이라 일반화할 수 없고, 정량 근거가 아니라 방향 확인용으로 사용했습니다. 친구 없이는 일부 기능을 체험하지 못했다는 응답도 있었습니다.' },
      { id: 'insight', title: 'Insight', body: '그룹을 운영하는 게시판이 아니라 사람 사이에 쌓이는 공동 추억을 장기적으로 되살리는 서비스로 포지셔닝했습니다. 핵심 경험은 하나의 루프입니다: 함께한 사람 선택 → 하나의 공동 게시물에 각자 사진·글 추가 → 사람·장소·시간으로 축적 → 공동 회상으로 재발견. 약속·참석응답·정산은 이 경험을 돕는 보조 기능으로 두었습니다.\n\ntrigr를 진행하며 초기 고객을 확보하는 MVP 전략이 부족했다고 보았고, 우리사이에서는 이를 다르게 설계하려 했습니다. 먼저 공동 추억 기록이라는 핵심 경험으로 초기 사용자를 모으고, 서비스가 확장된 뒤 수익 모델을 붙이는 순서입니다. 예를 들면 프리미엄 구독으로 사진 저장 용량을 크게 늘리거나 동영상 첨부를 제공하는 방식을 구상했습니다.\n\n※ 수익 모델은 아직 검증하지 않은 구상입니다.' },
      { id: 'decisions', title: 'Design Decisions', body: '첫 화면의 핵심 CTA는 그룹 만들기가 아니라 추억 만들기입니다. 그룹은 자주 만나는 사람을 빠르게 고르기 위한 선택적 편의 기능이며, 그룹 없이 사람을 골라 바로 시작할 수 있습니다.\n\n게시물 열람 권한은 게시물 멤버(초대 수락자)만 결정합니다. 그룹 소속, 약속 초대, 참석 응답은 권한의 근거가 아닙니다. 지도·회상 같은 파생 뷰는 원본의 현재 권한보다 넓게 노출되지 않습니다.\n\n나가기, 내 기여물 삭제, 게시물 종료, 차단, 탈퇴를 하나의 삭제로 합치지 않고 분리했습니다. 위치 정밀도(정확/동네/도시)를 고를 수 있고, 회상은 별도 옵트인입니다. 사진의 위치 정보(EXIF)는 업로드 시 제거합니다.\n\n비목표: 공개 피드·팔로우·광고, 실시간 위치 공유, 송금·보관, 얼굴 인식 기반 추정.' },
      { id: 'solution', title: 'Solution', body: '공동 게시물(초대·수락, 사진·글·댓글·좋아요), 사람·장소·연도 필터가 있는 추억 목록과 사진 마커, 모임·참석응답·정산, 1년 전 오늘 회상, 신고·내보내기·탈퇴까지 포함한 동작하는 웹 프로토타입(Node.js, SQLite)을 구현했고, 별도로 Claude Design 모바일 프로토타입과 Figma 시안을 만들었습니다.\n\n정산은 균등/직접 금액을 지원하며 완료는 당사자 확인을 뜻하고 송금이 아닙니다. 실제 지도 SDK와 푸시 알림은 구현하지 않았습니다.' },
      { id: 'validation', title: 'Validation', body: '서버 권한 시나리오 테스트(미초대 그룹 멤버 접근 차단, 나간 뒤 접근 제거, 정산 금액 비노출, 차단 후 초대 불가 등)를 작성했고 마지막 실행에서 통과했습니다. 간편가입은 가짜 제공자로만 확인했고 실제 제공자 키로는 실행하지 않았습니다.\n\n보안·운영 항목은 출시 전 과제로 정리되어 있으며, 일부 화면 동작은 아직 직접 확인하지 못했다고 문서에 구분해 기록했습니다.\n\n우리사이를 사용해 본 7명에게 설문을 받았습니다(결과는 Evidence/Research 참조). 대부분 핵심 기록 경험을 쉽다고 답했고, 초대 기능의 발견성, 기능 간 이동의 혼란, 장소 표시 같은 개선 의견이 나왔습니다.\n\n확인 필요 — 설문 외의 사용성 테스트를 했는지, 설문 결과로 바뀐 부분이 무엇인지.' },
      pending('reflection', 'Reflection'),
    ],
  },
  {
    slug: 'trigr',
    name: 'trigr',
    category: '출시 회고 · 미션 기반 리워드 앱',
    kind: '출시 회고',
    problem: '사용자의 행동을 보상으로 연결하는 0→1 리워드 기반 UGC 미션 플랫폼. 서비스는 현재 운영되지 않습니다.',
    role: 'UX/UI 총괄 · 디자인 시스템 구축',
    period: '2025.05 – 2026.06',
    tags: ['미션 플랫폼', 'UX/UI 설계', '디자인 시스템', '출시'],
    summary: { short: '디자인 시스템 구축부터 태국 출시까지', decision: 'Figma Variables 기반 디자인 시스템을 처음부터 구축하고, 세 차례 개편을 거쳐 태국 시장에 출시.', status: '출시 완료 · 서비스는 현재 운영되지 않음', kind: 'launched' },
    accent: '#DD5BE0',
    mock: { srcs: ['/images/trigr/mission-create.webp', '/images/trigr/home-map.webp', '/images/trigr/t-proof-detail.webp'], framed: true },
    gallery: [
      { src: '/images/trigr/home-map.webp', alt: 'trigr 홈: 지도 위에 미션 핀이 표시된 화면', caption: '홈 — 지도 위 미션 탐색' },
      { src: '/images/trigr/t-list.webp', alt: '미션 리스트: 카테고리 필터와 미션 목록', caption: '미션 리스트' },
      { src: '/images/trigr/mission-create.webp', alt: '미션 만들기: 제목, 미션 종류, 태그, 상금 설정', caption: '미션 만들기' },
      { src: '/images/trigr/t-proof-write.webp', alt: '사진/동영상으로 인증하는 작성 화면', caption: '챌린저 · 인증 작성' },
      { src: '/images/trigr/t-proof-done.webp', alt: '인증 등록 완료 안내', caption: '인증 등록 완료' },
      { src: '/images/trigr/t-chat-card.webp', alt: '미션 채팅방에 공유된 인증 카드', caption: '채팅 속 인증 카드' },
      { src: '/images/trigr/t-proof-detail.webp', alt: '인증 상세: 사진, 본문, 댓글, 상금 지급 버튼', caption: '생성자 · 인증 상세' },
      { src: '/images/trigr/t-reward.webp', alt: '상금 지급 시트: 지급 금액 입력과 지급 후 남은 상금', caption: '생성자 · 상금 지급' },
      { src: '/images/trigr/t-proof-list.webp', alt: '인증 모아보기: 미션 요약과 인증 카드 목록', caption: '인증 모아보기' },
      { src: '/images/trigr/mypage.png', alt: '마이페이지: 레벨, 포인트, 진행중·완료 미션', caption: '마이페이지' },
    ],
    sections: [
      { id: 'overview', title: 'Overview', body: 'trigr는 미션을 만들고 수행해 보상을 받는 리워드 앱입니다. 디자인 시스템도 명확한 서비스 정책도 없던 초기 스타트업에서 1인 디자이너로 참여해, 디자인 환경 구축부터 태국 시장 출시까지 담당했습니다.\n\n현재 서비스는 운영되지 않아 실제 앱은 확인할 수 없고, 아래 화면은 당시 디자인 시안입니다. 이 페이지는 결과물보다 과정과 배움을 중심으로 정리한 회고입니다.' },
      { id: 'screens', title: 'Screens (디자인 시안)', body: '' },
      { id: 'system', title: '디자인 시스템을 처음부터', body: '기초 디자인 토큰과 Figma Variables를 정의하는 것부터 시작해, 실제 앱 화면을 만들며 필요한 컴포넌트와 규칙을 점진적으로 보완했습니다.\n\n변수 구조는 Designbase의 앱 UI 템플릿을 참고해 trigr 컨셉에 맞게 재구성했습니다. 참고한 템플릿은 원시 값(Primitive)을 두고 그 위에 용도별 토큰(Alias)을 얹는 계층형이며, 색상은 라이트·다크 모드에서 같은 토큰이 서로 다른 원시 값을 가리키도록 나뉘어 있습니다. 간격·크기, 타이포그래피, 화면 크기도 별도 컬렉션으로 분리하는 방식입니다. 이 구조 덕분에 모드나 언어가 늘어도 화면을 다시 그리지 않고 변수만 바꿔 대응할 수 있다고 판단했습니다.\n\n태국 시장 출시를 고려해 다국어 대응과 라이트·다크 모드를 설계하며, 디자인 시스템이 UI 일관성 도구를 넘어 다양한 환경과 변화에 대응하는 제품의 기반이라는 점을 배웠습니다.\n\n※ 원본 Figma 파일은 회사 자산이라 공개하지 않습니다. 면접에서 구조를 말로 설명드릴 수 있습니다.' },
      { id: 'collab', title: '01. 정해진 답이 없는 환경에서 협업하기', body: '초기에는 서비스 정책과 요구사항이 충분히 정의되지 않아 화면 설계의 기준을 잡기 어려웠습니다. 기획자, 프론트엔드 개발자와 함께 기능과 사용자 흐름을 구체화하며 작업했습니다.\n\n미션 인증 기능에서는 수행 결과를 제출하는 챌린저와 인증 내역을 검토하는 미션 생성자의 서로 다른 목적을 함께 고려했습니다. 챌린저가 사진·영상으로 결과를 제출하면, 생성자가 카드 형태의 인증 내역을 확인해 보상 대상을 선택하는 흐름입니다.\n\nUX/UI 디자인은 화면을 완성하는 일을 넘어, 여러 사용자의 행동과 요구를 하나의 서비스 흐름으로 연결하는 일임을 체감했습니다.' },
      { id: 'sustain', title: '02. 좋은 UI만으로는 좋은 서비스가 되지 않는다', body: '가장 크게 고민한 것은 서비스의 지속 가능성이었습니다. 보상을 받는 챌린저와 달리, 자기 비용을 들여 미션을 만들어야 하는 사용자에게는 충분한 참여 동기가 필요하다고 판단했습니다.\n\n그래서 초기 MVP에서 핵심 사용자층을 먼저 확보하고 실제 반응을 보며 전략을 조정하는 방향을 제안했습니다. 다만 당시에는 기존 사업 방향이 유지되어, 제안을 검증할 기회로 이어지지는 못했습니다.\n\n편리한 화면을 설계하는 일과 사용자가 계속 쓸 이유를 만드는 일은 연결된 문제라는 것을 배웠습니다.' },
      { id: 'validation', title: '03. 디자인의 완성과 서비스의 성공은 다르다', body: '프로젝트 동안 세 차례의 주요 디자인 개편이 있었고, 불명확하거나 바뀌는 요구사항에 대응했습니다. 모든 개선 의견이 제품에 반영되지는 않았지만, 일정을 지키며 서비스 출시까지 경험했습니다.\n\n하지만 출시가 서비스의 성공으로 이어지지는 않았습니다. 사용자 반응을 충분히 검증하고 제품 개선에 반영하는 과정이 얼마나 중요한지 돌아보게 되었습니다. 문제를 발견하고 개선안을 내는 것에 더해, 제안의 근거를 구체화해 팀의 의사결정으로 연결하는 역량도 필요하다는 점을 배웠습니다.\n\n※ 사용자 반응 검증 결과는 없습니다. 수치나 성과는 기록하지 않았습니다.' },
      { id: 'reflection', title: '앞으로의 방향', body: '처음부터 모든 것을 알고 시작하지는 않았지만, 필요한 지식을 스스로 학습하고 디자인 시스템을 구축하며 실제 출시까지 경험했습니다. 이 실행력을 바탕으로 사용자의 문제를 명확히 정의하고, 가설을 검증하며, 디자인의 효과를 확인할 수 있는 디자이너로 성장하고자 합니다.' },
    ],
  },
]

export const profile = {
  name: '노승우',
  email: 'tmddn718@naver.com', // 이력서 기재 이메일. 공개 사이트에 노출되므로 바꾸려면 여기만 수정
  phone: '010-8511-1091', // 이력서 기재 번호(공개 사이트에 노출됨, 본인 요청)
  resume: '', // 이력서 PDF 에는 주소·전화·생년월일이 있어 공개용 사본이 준비되면 '/resume.pdf' 로 지정
  experience: [
    { period: '2025.05 – 2026.06', org: '핀랩스', role: '사원 · 프로덕트 디자인', desc: '미션 기반 리워드 앱(trigr) UX/UI 총괄, 디자인 시스템 구축, 글로벌(태국) 서비스 출시.' },
    { period: '2024.11 – 2025.04', org: '모바일이지배하는세상', role: '사원', desc: '사내 모바일 앱(4종) UX/UI 디자인, 생성형 AI(Midjourney) 활용 홍보 영상 제작.' },
    { period: '2023.02 – 2023.12', org: '아메바', role: '연구원', desc: 'LG전자·LG U+ 등 대기업 디지털 서비스 UX/UI 설계 지원, 운영 GUI 디자인.' },
  ],
  education: ['부천대학교 디지털 미디어 디자인 학사 (전공심화) · 2022 졸업', '부천대학교 산업디자인과 전문학사 · 2020 졸업'],
  tools: [
    ['Design', 'Figma (컴포넌트 기반 디자인 시스템, Variables), Adobe Photoshop · Illustrator · After Effects'],
    ['AI · 기획', 'GPT — 리서치, UX 아이데이션, 유저 시나리오, UX 라이팅, PRD 작성'],
    ['Vibe coding', 'Claude Code, Figma Make — HTML/코드 기반 프로토타입 구현, GitHub로 작업물 관리'],
  ] as [string, string][],
}
