# CONTEXT_SUMMARY — 노승우 포트폴리오 사이트

> 새 세션용 요약 (2026-11-23, 코드·git으로 확인). **새 세션은 이 파일을 가장 먼저 읽는다.** 코드와 `src/data/projects.ts`가 최종 근거이며 이 문서와 다르면 코드를 믿는다.
> 표기: **[확정]** 사용자가 정했거나 코드에 반영됨 / **[검토중]** 미결 / **[미확인]** 확인 못 함. `CLAUDE.md`는 이 저장소에 없다.

## 1. 목적·핵심 기능
- 프로덕트 디자이너 노승우(UX/UI) 포트폴리오. 채용 담당자가 짧은 시간에 문제 해결 과정을 보게 한다. 콘셉트 "Complexity → Clarity".
- 작업 5개: 올리브영 오늘드림·당근 대형가구(기존 서비스 비공식 UX 개선) / NODI·우리사이(0→1 신규) / trigr(출시·서비스 종료, 실무).
- 구성: 홈(히어로·핀 고정 프로젝트 스토리·대표+카드·접근 방식·About/Contact) + 상세 5개(`/work/:slug`) + About. 화면 이미지는 눌러서 확대.

## 2. 스택·구조 [확정]
- React 19 · TS · Vite · Tailwind v4 · React Router 7 · GSAP(ScrollTrigger) · Lenis · Pretendard(CDN). 배포 설정 `vercel.json`(SPA rewrite).
- `src/data/projects.ts`(단일 데이터) · `karrotBig.ts`(확대용 전체 이미지 매핑) · `thumb.ts`(홈 srcset 사본). 페이지: `Home`, `About`, `CaseGeneric`(올리브영 `OliveRenewed`·당근 `Karrot`·우리사이 `Woorisai`), `CaseNodi`, `CaseTrigr`. 컴포넌트: `Hero`·`Sections`(홈 카드)·`LongScreen`(폰 비교/Overflow/Focus Detail/Popout)·`Modal`(`Zoomable`)·`case`(ChapterHead·CaseSummary)·`Reveal`. 모션: `src/motion/*`. 미사용(삭제 안 함): `thumbnails.ts`·`PhoneMockup`·`ScrollPhone`·`Marquee`·`Cursor`·옛 `Olive`·`MobileThumbnail`.
- 이미지 `public/images/<slug>/`(홈용 축소본 `t/`), 정적 프로토타입 `public/proto/*`(iframe). 안 건드림: `references/`·`PRODUCT.md`·`.impeccable/`.
- QA: `scripts/qa.mjs`(Playwright-core+시스템 Chrome), `npm run qa`. 검증은 임시 스크립트로 `localhost:5174`(`npm run dev -- --port 5174`). 측정 전 `html{scroll-behavior:auto}` 필요.

## 3. 디자인 원칙·시스템 [확정]
- **타이포(상세, `index.css` 하단 v2)**: 데스크톱/모바일 — 메인 h1 48/32(700), 섹션 h2 36/28, 서브 h3 26/22(600), 카드 제목 22/19, 본문 18/16, 카드 설명 17/15, 캡션 15/14, 각주 14/13, 영문 라벨 14. 콘텐츠 폭 1280·본문 최대 760·카드 패딩 32(모바일 20)·제목→본문 16·섹션 간 120/72. 강조 설명문은 Regular·진회색, 굵은 제목만 Bold.
- **홈 타이포**: 히어로 80/40px·700, 소개 20/16, 스크롤 목록 선택 30 Bold·비선택 24 Regular 연회색, 섹션 제목 30/24, 카드(이어지는 작업) 번호 14·유형 13·제목 26/22·설명 17/15, About 26, 네비 13/500. 홈 폭 1080(`html:has(#hero) .wrap`), 카드 간격 24. 모바일 카드는 썸네일 위·글 아래.
- **모션**: 등장 14px·0.45s ease-out, 읽는 글(`Reveal fade`)은 투명도만, 비교 쌍 AS-IS→TO-BE 순차(`seq-cmp`), 단계 목록 `Reveal as="ol" stagger slow`, 올리브영 칩 `.chain`, NODI 말풍선 `popout-in`, 홈 카드 호버 썸네일 1.03(마우스 환경만). 1023px 이하 카드 등장·패럴랙스 끔, `prefers-reduced-motion` 대응.
- **비교**: AS-IS(회색 알약) 왼쪽·TO-BE(프로젝트 컬러) 오른쪽, 같은 프레임 크기. `LongScreen.tsx`의 `PhoneCompare`·`PhoneOverflowCompare`(AS-IS 긴 화면만 프레임 아래로)·`UIFocusDetail`·`UIPopout`. 긴 화면이라고 전부 Overflow로 만들지 않는다.
- **목업 Safe Area**: 이미지 안에서 하단 34pt 확보(우리사이 9장·올리브영 12장 보정). 홈 인디케이터는 프레임 오버레이 또는 이미지 포함 — 중복 생성 금지.
- 브랜드 컬러: 올리브영 #82DC28, 당근 #FF6F0F, NODI #3654D4, 우리사이 #566B5C, trigr #DE5DE2.

## 4. 구현 상태 [확정]
- **올리브영**: 솔루션 3개(품절 후 구매 회복/장바구니/주문·결제). 동일 참여자 8명 프로토타입 테스트, 약 42초·26초 단축(과제별, 합산 금지). 장바구니 "개선안"은 AS-IS(`cart-asis-01-tall`)·TO-BE(`n-cart`) 좌우 쌍+Decision 01~03, 비교는 관련 상품 탐색 쌍 하나(`cart-asis-03-tall`/`n-cartAdded`). 주문/결제는 AS-IS 캡처 대 TO-BE 합성 이미지(`n-checkoutTobe-slots`). 프로토타입 `public/proto/oliveyoung/app.js`의 주문 진입 6경로는 `g1Open:true`(원본 저장소 재빌드 시 덮어써질 수 있음).
- **당근**: 20화면, 참가자 7명·전원 단축·평균 −34초(사용자 제공값, 그래프·전환율 표현 금지). 문제 설명은 Regular·#444·3px 주황 강조선.
- **NODI**: 추천은 규칙 기반(AI 호출 없음), 참석자·캘린더는 예시 데이터. 히어로 `hero-phone-card.png`+`UIPopout` 말풍선. 초기→개선 시안 3쌍.
- **우리사이**: 히어로 폰 1개, 설문 7명(소규모 한계). **trigr**: Hero→Context→상금 지급→정산 신청→Supporting→Design System→Reflection, 프로토타입 실행 없음.
- 상세에서 삭제한 것: NODI 점검·검증 계획 섹션, 우리사이·trigr 검증 계획, 반복 검증 한계 문구, 내부 작업 메모. 사용성 인원 표기는 "8명"(n= 금지). 핵심 결정은 `\n`으로 의미 단위 분리.

## 5. 정책 [확정]
- 사실 날조 금지(수치·인용·테스트·성과), 예시는 예시로 표기. 실제 UI 이미지를 임의로 새로 그리지 않는다(합성·가림은 요청 범위에서만, 보고).
- 이름·휴대폰·이메일 노출, 주소·생년월일·계좌번호 가림. 올리브영·당근은 비공식 제안 문구 유지.
- **작업은 `site-develop`에서(`main`은 `6f05337`, `site-develop`이 73커밋 앞, HEAD `c8b0e96`)**. 푸시는 요청할 때만·`site-develop`만, 푸시 전 `git pull --rebase --autostash`(강제 푸시 금지). 커밋 끝에 `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`. 이 파일은 요청할 때만 커밋. `tsconfig.tsbuildinfo`는 커밋하지 않음.

## 6. 진행 중·남은 작업
- **[검토중]** 우리사이 설문 34명 자료 대기(현재 7명), 올리브영 TO-BE 접힘 이미지는 합성이라 실제 캡처 있으면 교체, 우리사이 모바일 h1(43px)은 48/32 미적용(NODI·trigr만 적용).
- 미적용·미완: 올리브영 주문/결제 TO-BE Focus Detail, 목업 분류표(A~E), 홈 Soft Clarity 단계 위계·이미지-제목 12px, 문단 간격 20px 일괄 규칙, 본문 문장 교정의 수정 전·후 비교표, 실제 기기 성능 점검. NODI 히어로 문장(약 44px)이 h1(48px)과 비슷해 위계 확인 필요.
- 홈 섬네일: `nodi/web-reco.webp` 축소본 미생성. NODI `hi-*` 전체 스크롤 교체 미실시. 정리 후보: 미사용 컴포넌트, `karrot-large-furniture/k-*`.

## 7. 알려진 문제
- 홈 데스크톱 12px 미만 글자 1건(위치 미확인). 콘솔 경고 `allowTransparency`(ProtoFrame iframe, 기존). Chrome만 검증(Firefox·WebKit 미검증). 이미지 `width/height` 미지정(레이아웃 이동 가능). 홈 768px에서 대표 프로젝트 제목 3줄. 일부 홈 섬네일 아트(NODI)가 좁은 폭에서 폰 모서리에 붙음.

## 8. 주의사항
- 수정 후 `npx tsc --noEmit -p .` → 화면 점검 → `npm run build`. macOS는 `sed -i ''`. 임시 스크립트는 `scripts/_*.mjs`로 만들고 끝나면 삭제.
- CSS는 비계층(unlayered)이라 Tailwind 유틸리티보다 우선한다 — 상세 타이포 규칙은 `main article` 범위, 홈 보정은 `main > :not(article)`. 인라인 `style`이 CSS보다 우선. `text-[14px]` 같은 클래스는 부분 일치 규칙에 걸리니 14px는 `0.875rem`로 쓴다.
- 핀 고정 섹션은 바깥 div로 감싼다(React 언마운트 오류 방지). Lenis는 홈에서만, 모달은 `data-lenis-prevent`.
- 이미지 규칙: `full-*`(전체) `sp-*`(상단·본문 분리) `f-*`(첫 화면) `L-*`(설명 위치), 확대 매핑은 `karrotBig.ts`. 사용자 PNG는 `~/Desktop/포트폴리오 프로젝트 UI/<프로젝트>/` 우선.
