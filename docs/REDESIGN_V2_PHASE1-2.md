# Full Redesign — Phase 1 Audit · Phase 2 Design System · Home Wireframe

> 승인 전 제안서입니다. 코드·콘텐츠·사실관계는 변경하지 않았습니다.

## Phase 1 — Audit

### 현재 구조
| 영역 | 파일 | 상태 |
|---|---|---|
| Home | `Hero`, `Sections`(Work·Philosophy·AboutContact) | Hero는 방금 표지 그대로(UI 없음)로 교체됨. Work는 NODI·올리브영 대표 2 + 당근·우리사이·trigr 컴팩트 3 |
| 상세 | `CaseNodi`, `CaseTrigr`(7챕터), `CaseGeneric`(올리브영·당근·우리사이) | 이미 5챕터 구조. trigr만 PDF 기반 7챕터 |
| 공통 | `case.tsx`(챕터 nav), `Modal/Zoomable`, `Mockup`(Phone, ProtoFrame), `BeforeAfter`, `Reveal` | 재사용 가능 |
| 데이터 | `data/projects.ts` 단일 소스 | 유지 |
| 프로토타입 | `public/proto/` 4개 (trigr 없음) | 유지 |

### 유지할 것
Complexity→Clarity 표지 Hero 모션, 5챕터 골격, Zoomable·Modal·BeforeAfter, 단일 데이터 소스, 프로토타입 패널, reduced-motion 처리, 사실관계 문구 전체.

### 바꿀 것
1. **Hero:** 제품 UI를 함께 보이게(브리프). 단, 방금 요청으로 표지와 같게 맞춘 상태라 충돌 → 아래 결정 1.
2. **Featured 순서·라벨:** 현재 NODI·올리브영 → trigr(Launched Product) + 1개(Personal Case Study).
3. **Selected Work:** 3개(올리브영·당근/NODI 중 남은 것·우리사이)로 재편. 2열 그리드에서 3개는 홀수 → 마지막 카드는 가로형.
4. **Design Approach:** 추상 5원칙 → Structure/Decision/Craft 3관점 × 실제 화면·판단 사례.
5. **About Preview:** 4개 역량 키워드(출시 경험, UX/UI·디자인 시스템, 프로토타이핑, 개발 협업) 중심으로 압축.
6. **내비 현재 위치 표시:** 현재 `aria-current`/활성 스타일이 약함.
7. **Back to Top, 프로젝트 라벨**(Launched Product / Personal Case Study) 추가.
8. **개인 프로젝트 비주얼 스토리텔링 차별화:** 올리브영(정보구조 비교·선택 흐름 다이어그램), 당근(상품 상세·정보 비교), NODI(정보 구조 다이어그램), 우리사이(에디토리얼) — 현재 일부만 반영.

### 누락 이미지 / 추가 자료
| 항목 | 상태 |
|---|---|
| 올리브영·당근 AS-IS 비교 | 올리브영 있음(적용됨), 당근 v1.9 없음 |
| NODI 초기 UI 7개(AS-IS) | 없음 → Before/After 불가 |
| 우리사이 설문 이후 변경 화면 | 없음 |
| trigr 1·2차 시안, 디자인 시스템 상세 | PDF에 없음 |
| OG 이미지(1200×630), 프로필 사진 | 없음 |
| 당근 프로토타입 상품 사진 출처 | 미확인 |

### 콘텐츠 보완 필요(임의 작성 안 함)
- 모든 프로젝트 Reflection(요청으로 건너뜀) — 비어 있으면 챕터에서 숨김
- 우리사이: 설문 이후 바뀐 부분
- trigr 역할 표기("UX/UI 설계 · 디자인 시스템 구축 (기획 일부 참여)") 및 이전 회고 원문의 "1인 디자이너" 표현 확인
- **성과 수치는 어떤 프로젝트에도 없음** → 수치 영역은 만들지 않고 "검증 계획/자체 점검"으로 표기

## Phase 2 — Design System

**Color**
| 토큰 | 값 |
|---|---|
| Primary | `#3975F6` |
| Background / Surface | `#FFFFFF` / `#F7F8FA` |
| Text / Secondary | `#111111` / `#666666` (밝은 배경 대비 4.5:1 이상) |
| Border | `#E8E8E8` |
| trigr | Pink `#DE5DE2` (출시 화면 추출) + Purple 틴트 |
| 올리브영 | Soft Lime `#E6F4C8` (브랜드 `#82DC28`은 포인트만) |
| 당근 | Soft Peach `#FFE6D6` (포인트 `#FF6F0F`) |
| NODI | Soft Blue `#E1E8FF` (포인트 `#3654D4`) |
| 우리사이 | Soft Lavender `#ECE8F7` (포인트 `#5B6E5F`는 프로토타입 색이라 라벤더와 충돌 → 결정 3) |

배경 틴트는 Hero·대표 패널에만, 글자색은 어두운 변형(`color-mix … black`)으로만 사용.

**Typography** — Pretendard(한글) + Inter(영문, 현재 미로드 → 추가). Hero 72–96px는 브리프 기준이나 표지 재현 Hero는 현재 약 11.6vw(1440px에서 167px) → 결정 1. Section 36–48 · Project Title 32–48 · Body 16–18 · Caption 12–14. 한글은 `word-break: keep-all`.

**Grid / Spacing** — 최대 1200px(브리프 1200–1280 내), 12컬럼, gutter 24, 모바일 20. 8px 배수. 섹션 간격 96/160px(모바일/데스크톱).

**Components** — Label chip(Launched Product / Personal Case Study), ProjectCard(feature·compact·wide 3종), PhoneFrame(dark/light), Zoomable, BeforeAfter, ChapterNav(sticky), StepRow, FlowLane, Timeline, BackToTop.

**Motion** — 등장 500ms ease-out(16px), 호버 160–240ms, 시차는 Hero·상세 Hero 이미지만. 텍스트 시차 없음. reduced-motion에서 전부 해제.

**Responsive** — Mobile ≤767(1열·가로 스트립), Tablet 768–1279(2열), Desktop ≥1280(프로토타입 패널). 터치 타깃 44px.

## 메인 와이어프레임
```
[Nav] PORTFOLIO 2026 ...................... Work · About · Contact   (현재 위치 밑줄)

01 HERO   (안 A: 표지 유지 + 하단 UI 띠)
  Complexity (outline)                          ┌ 대표 UI(trigr 지도) ┐
  → Clarity (blue)                              │   폰 2대, 우측 오프셋   │
  복잡한 문제를 명확한 사용자 경험과              └─────────────────────┘
  완성도 높은 인터페이스로 해결합니다.
  Product Designer / UX·UI Designer      [Selected Work ↓]

02 FEATURED
  [Launched Product]  trigr — Full-width Visual Showcase
    ┌ 핑크/퍼플 풀폭 패널: 지도·미션 생성·인증 화면 3~4대 ┐
    └ 목표 1문장 · 유형 · 핵심 역량(미션 플로우·디자인 시스템·출시) · 상세 링크
  [Personal Case Study]  NODI — Split Editorial
    ┌ 텍스트(5col): 문제·역량·링크 ┐ ┌ Soft Blue 패널(7col): 폰 3대 ┐

03 SELECTED WORK  (2열 + 하단 와이드)
  [올리브영 · Soft Lime]  [우리사이 · Lavender]
  [당근 · Peach  — 가로 와이드 카드]
  카드: UI 이미지 · 이름 · 1문장 · 유형 · 키워드

04 DESIGN APPROACH  Soft Clarity
  Structure ─ 올리브영: 수령 방법 정보 구조 비교
  Decision  ─ NODI: 추천 시간·근거 우선순위 / 당근: 미확인 정보 구분
  Craft     ─ trigr: 상금 지급 시트 등 화면 확대
  (각 행: 원칙 · 1~2문장 판단 · 클릭 확대 화면)

05 ABOUT PREVIEW  4개 역량 + 경력 3줄 → About

06 CONTACT  "함께 명확한 경험을 만들어요."  이메일
[Back to Top]
```

## 결정이 필요한 항목
1. **Hero:** (A) 표지 그대로 + 아래 대표 UI 띠(권장, 방금 요청과 브리프 모두 충족) / (B) 브리프대로 UI를 우측에 크게(표지 재현이 약해짐).
2. **Featured 두 번째:** NODI(권장: 인터뷰 6명·v6 26화면·프로토타입 근거가 가장 풍부) vs 당근(PRD 상세하나 검증 전). 선택하지 않은 쪽은 Selected Work로.
3. **우리사이 컬러:** 브리프의 Soft Lavender로 통일(권장) vs 프로토타입의 그린 유지.
4. **trigr 대표 이미지:** 지도 화면은 PDF 14p 대표 UI 사용.
5. **라벨:** 올리브영·당근은 기존 "비공식 개인 제안" 표기를 Personal Case Study 라벨과 함께 유지.
