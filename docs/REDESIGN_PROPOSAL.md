# 포트폴리오 리디자인 제안 (Swiss Editorial + Modern Product Portfolio)

## 1. 현재 구조·에셋 분석
- 코드: React + Vite + Tailwind + GSAP. 홈(Hero, Work 카드, Approach, About, Contact)과 공통 Case 템플릿 1개(01~08 섹션 나열). 데이터는 `src/data/projects.ts` 단일 소스.
- 문제: 모든 프로젝트가 같은 템플릿, 텍스트 중심, 카드 썸네일이 작은 3폰 목업 위주, 본문 1단 문서형.
- 이미지 에셋(모두 앱 화면 캡처, 780px 폭 내외): 올리브영 4, 당근 5, NODI 6(저해상 390px) + 이번에 2x 재캡처 12, 우리사이 6, trigr 6. Before/After 이미지는 **없음**(슬라이더 컴포넌트는 준비되어 있고 이미지가 있을 때만 나타남).
- 실행형 프로토타입: `public/proto/` 4개.

## 2. 디자인 시스템
| 항목 | 값 |
|---|---|
| 컬러 | White `#FFF` · Black `#0B0B0C` · Gray `#666` · Hairline `#E6E6E6` · Blue `#3975F6`(사이트 공통 강조) |
| 프로젝트 서브컬러 | 올리브영 `#82DC28`(문서의 브랜드 그린) · 당근 `#FF6F0F` · NODI `#3654D4`(NODI Primary) · 우리사이 `#5B6E5F`(프로토타입 기준 근사값) · trigr `#DD5BE0` — Hero 틴트(8~14%)와 작은 마커에만 사용 |
| 타이포 | Pretendard. Display 136/0.95 · H1 56 · H2 36 · H3 24 · Body 17/1.75 · Caption 13 · Eyebrow 12 대문자 +0.14em |
| 그리드 | 최대 1200px, 12컬럼, gutter 24, 모바일 20px 여백. 8px 스페이싱 |
| 형태 | 1px 헤어라인 구분선, 이미지 모서리 24px, 그림자는 폰 목업에만 |
| 모션 | 등장 500ms ease-out(opacity+translateY 16px) · 이미지 호버 1.02 · 시차는 Hero 비주얼·상세 Hero 이미지에만 · reduced-motion에서는 전부 해제 |
| 상호작용 | 이미지 클릭 확대(네이티브 dialog, Esc·포커스 복귀) · 프로토타입 미리보기 모달 |

## 3. 와이어프레임
### 메인
```
[Nav]
[Hero ] Complexity / → Clarity ............ [대표 제품 비주얼 NODI]
        복잡한 정보를 ...  Selected Work
[Featured 01] NODI   : [ 큰 틴트 패널 + 폰 3대 (7col) ][ 번호·제목·문제·메타·CTA (5col) ]
[Featured 02] 올리브영: [ 텍스트 (5col, 좌) ][ 큰 폰 2대 (6col, 우로 오프셋) ]  + 한 줄 문제 인용
[More]  당근 | 우리사이   (2열 컴팩트)
        trigr (가로 컴팩트)
[Soft Clarity] 5원칙 × 실제 화면 사례 (행 단위, 클릭 확대)
[About + Contact]
```
### 프로젝트 상세 (5챕터)
```
01 Project Hero      : 틴트 배경 + 대형 폰 4대 + 메타 + Overview
02 The Challenge     : 좌 고정 헤드라인/문제 · 우 근거 카드 3개(→ 대응 기능)
03 Design Exploration: 결정 4개 (이미지 좌우 교차) + 토큰 + 예외 상태 + (Before/After는 이미지 있을 때)
04 Final Experience  : 사용 흐름 스트립(7화면, 가로 스크롤) + 실행형 프로토타입
05 Impact & Learnings: 검증 결과(문서 기준) + 한계 + 회고(있을 때)
```

## 4. 필요한 추가 에셋 목록 (없는 것은 만들어 쓰지 않음)
1. NODI 초기 모바일 UI 7개 화면 캡처 → Before/After
2. 올리브영 기존(AS-IS) 옵션 바텀시트 실제 캡처
3. 당근 기존(v1.9) 판매글·상세 화면 캡처
4. 우리사이 설문 결과 요약(응답 수는 7, 차트용 원본)과 설문 이후 바뀐 화면
5. trigr 대표 화면 중 공개 가능한 최종 선별본, 디자인 시스템 구조도(회사 파일 제외, 재구성본)
6. OG 이미지(1200×630), 프로필 사진(선택)
7. 당근 프로토타입 상품 사진의 출처 확인
