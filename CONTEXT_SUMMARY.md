# CONTEXT_SUMMARY — 노승우 포트폴리오 사이트

> 새 세션용 요약. 기준일 2026-11-19. 작업 브랜치는 `site-develop`(`main` 아님). 코드·`src/data/projects.ts`가 최종 근거이고, 이 문서와 다르면 코드를 믿는다.
> 표기: **[확정]** 사용자가 정했거나 코드에 반영됨 / **[검토중]** 미결 / **[미확인]** 확인 못 함.

## 1. 프로젝트
- 프로덕트 디자이너 노승우(UX/UI)의 포트폴리오. 채용 담당자가 짧은 시간에 역량을 보게 하는 것이 목적.
- 작업 5개: trigr(출시, 서비스 종료), NODI(0→1, 웹+모바일 반응형), 올리브영 오늘드림·당근 대형가구(기존 서비스 비공식 UX 개선), 우리사이(0→1, "추억 아카이빙 서비스").
- 홈(애플 iPhone 페이지 참고: 블랙 히어로·쇼케이스·하이라이트 카드·문장 하이라이트) + 케이스 상세 5개 + About.

## 2. 기술 스택·구조 [확정]
- React 19 + TypeScript + Vite + Tailwind v4 + React Router 7 + GSAP(ScrollTrigger). `vercel.json`은 SPA rewrite만(배포는 사용자가 요청할 때만).
- 단일 데이터: `src/data/projects.ts`(프로젝트 메타, `summary`{concept,short,about,decision,status}, gallery, beforeAfter, profile).
- `src/pages`: Home, About, CaseGeneric(올리브영·당근·우리사이), CaseNodi, CaseTrigr. `src/components`: Layout(글래스 GNB, 페이지 이동 시 즉시 맨 위), Hero, Landing, Sections, case.tsx(ChapterNav·CaseSummary·ProjectIndex·AppIcon·PinnedPhone), Compare(당근 비교표), BeforeAfter, Compose(목업 구도), ScrollPhone(상·하단 고정 + 본문 스크롤), BrowserFrame, Mockup(ProtoFrame `pro` 변형).
- `public/images/<slug>/`(UI 이미지, `icon.*` 앱 아이콘), `public/proto/<slug>/`(정적 프로토타입 iframe).
- CSS 규칙: 전역 규칙은 `@layer base`(비레이어 CSS가 Tailwind 유틸을 이김). 폰 프레임 `.phone-pro`/`.phone-light`(그림자 없음), 섹션 번호 `.num-brand`(상세 `<article>`의 `--brand`).

## 3. 디자인 원칙 [확정]
- 제목·부제 행간 140%, 본문 글자 최소 13px(QA에서 검사), 터치 44px.
- 문장은 쉬운 말(~해요), 문장 중간 쉼표 쓰지 않음(홈·About·요약 기준).
- 폰 목업 바깥 그림자 없음(캡션 가독성). 확대 가능 이미지에 `Zoomable`.
- 프로젝트 브랜드 컬러: 올리브영 #82DC28, 당근 #FF6F0F, NODI #3654D4, 우리사이 #566B5C, trigr #DE5DE2. 칩·배지·번호는 브랜드 컬러, 카드 배경은 옅은 틴트(진한 배경·그라데이션 지양).
- Before/After는 나란히 비교. NODI·우리사이는 기존 서비스가 없어 "초기 시안/개선 시안" 표기.
- 긴 스크롤 UI는 설명에 맞는 스크롤 위치를 캡처하고, 하단 고정 탭바·CTA는 화면 맨 아래에 붙인다.

## 4. 정책·의사결정 [확정]
- 사실 날조 금지: 수치·인터뷰·사용자 인용·테스트 결과를 만들지 않음. 시뮬레이션·예측은 항상 그렇게 표기(올리브영 시뮬레이션, 당근 예상 지표).
- 미확정 자료는 "[추가 자료 필요]"로 표시.
- 프로젝트 기간: trigr 2025.05–2026.06, 올리브영 1주, 우리사이 1주, 당근 2주, NODI 2주.
- 공개 정보: 이름·휴대폰·이메일은 사용자 요청으로 사이트에 노출. 주소·생년월일은 노출 금지. 올리브영 AS-IS의 실제 주소는 가상 주소로 가림(git 이력에서도 제거함).
- 앱 아이콘: NODI·우리사이·trigr은 사용자 제공 SVG, 올리브영·당근은 앱스토어 공식 아이콘.
- 설문 7명은 실제 값. 34명으로 바꾸기로 했지만 문항별 응답 수를 아직 못 받아 **미적용**(비율로 늘려 만들지 않음).
- GitHub 푸시·배포는 사용자가 요청할 때만. 푸시 시 `Co-Authored-By` 줄 포함.

## 5. 현재 구현 상태
- 홈, About, 상세 5개 모두 동작. QA 스크립트 기준 7개 경로 × 1440/390/320px에서 가로 넘침·깨진 이미지·콘솔 오류 없음, `npm run build` 통과.
- 이미지 출처 규칙: 사용자 PNG(`~/Desktop/포트폴리오 프로젝트 UI/<프로젝트>/`) 우선. 당근은 GitHub `dangn-prototype` 프로토타입을 직접 캡처한 스크롤 화면 `L-*.webp` 사용, AS-IS는 그 저장소 `docs/as-is/` 고화질.
- 프로토타입: 올리브영(GitHub `OliveYoung` 최신), 우리사이(GitHub `WOORISAI` 최신, 분석·PWA 제거 사본, 좁은 폭에서 화면 꽉 채움), 당근·NODI(예전 버전 정적 사본).
- 작업·푸시 브랜치는 `site-develop`(최신 81b5505 이후). 다른 세션이 푸시하므로 푸시 전 `git fetch`로 확인하고 갈라졌으면 병합(강제 푸시 금지).
- 올리브영 프로토타입: 기본은 상품 상세에서 시작, 주소 뒤 `?scenarios`를 붙이면 시나리오(Flow A~G) 선택 화면. 수정본은 GitHub `OliveYoung` 저장소(main 200d433)에도 반영됨. 상품 이미지는 올리브영 상품 페이지(A000000223414)의 고화질 원본으로 교체함.
- 당근 UI는 새 PNG 20장 기준: `full-*`(전체 스크롤), `sp-*`(상단·본문·하단 CTA 분리), `f-*`(처음 화면), `L-*`(설명 위치), `asis-write*`(판매글 작성 AS-IS). 하단 CTA 뒤에 가려진 끝부분은 프로토타입 캡처로 복원했고 모달 확대는 `src/data/karrotBig.ts`가 담당.
- NODI 전체 스크롤 시안 26장은 `full-*`(`public/images/nodi`), 실제 UI 챕터에서 눌러 끝까지 스크롤.

## 6. 진행 중·남은 작업
- **[검토중] 우리사이 설문 34명**: 문항별 보기 응답 수, 응답자 구성(성별·연령), 기간, 새 서술 의견이 필요. 반영 위치: `CaseGeneric.tsx`의 `survey` 상수·문제 챕터 설문 카드, 검증 챕터 "7" 카드, `projects.ts` 우리사이 research/validation 본문.
- 당근 채팅 장면의 고화질 AS-IS 이미지는 아직 없음(비교 카드 BEFORE에 자리표시). 판매글 작성 AS-IS는 추가 완료(동네 이름은 가리지 않기로 함).
- 당근·NODI 프로토타입은 최신 버전이 아님(필요 시 GitHub 최신으로 교체).
- 우리사이 "사진 상호작용·발자국 Before/After"는 PNG가 아니라 예전 프로토타입 캡처. 새 프로토타입에서 재캡처 가능.
- trigr 미션 생성 4단계 화면은 PDF 이미지(PNG 없음), 로고는 제공 SVG 사용.
- `main`과 `site-develop`의 올리브영 구성 차이를 나중에 정리해야 함. 병합본에서 13px 미만 글자가 홈 1곳·올리브영 3곳(site-develop 쪽 문구, 미조치).
- 정리하지 못한 것: 상세 본문 긴 글(Problem/Evidence) 문장 다듬기, 이미지 srcset, 사용하지 않는 `public/images` 파일 정리.

## 7. 주의사항
- 임시 도구(Playwright QA 스크립트, 서버)는 세션 scratchpad에 있어 사라질 수 있음. 새로 만들 때: `npm init -y && npm i playwright-core`, 시스템 Chrome 사용. dev 서버는 `npm run dev -- --port 5173`.
- macOS BSD `sed -i ''` 필요. 파일 수정 후 `npx tsc --noEmit -p .` → QA → `npm run build` 순서.
- 우리사이 하위 화면(지역별 추억 등)은 원본에도 탭바가 없음. 올리브영·당근 로고는 상표이며 비공식 제안이라는 문구 유지.
- `references/`, `PRODUCT.md`, `.impeccable/`(디자인 훅 설정)는 건드리지 않음.
