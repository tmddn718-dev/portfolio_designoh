# CONTEXT_SUMMARY — 노승우 포트폴리오 사이트

> 새 세션용 요약 (2026-11-23 갱신, 코드·git으로 확인). **새 세션은 이 파일을 가장 먼저 읽는다.** 코드와 `src/data/projects.ts`가 최종 근거이고 이 문서와 다르면 코드를 믿는다.
> 표기: **[확정]** 사용자가 정했거나 코드에 반영됨 / **[검토중]** 미결 / **[미확인]** 확인 못 함. `CLAUDE.md`는 이 저장소에 없다.

## 1. 목적·핵심 기능
- 프로덕트 디자이너 노승우(UX/UI) 포트폴리오. 채용 담당자가 짧은 시간에 문제 해결 과정을 보게 하는 것이 목적. 콘셉트 "Complexity → Clarity", 디자인 철학 Soft Clarity.
- 작업 5개: 올리브영 오늘드림·당근 대형가구(기존 서비스 비공식 UX 개선) / NODI·우리사이(0→1 신규 서비스) / trigr(출시·서비스 종료, 실무).
- 구성: 홈(히어로·핀 고정 프로젝트 스토리·대표 카드+카드 4개·접근 방식·About/Contact) + 케이스 상세 5개(`/work/:slug`, NODI·trigr는 전용 라우트) + About. 화면 이미지는 눌러서 확대·스크롤.

## 2. 기술 스택·구조 [확정]
- React 19 · TypeScript · Vite · Tailwind v4 · React Router 7 · GSAP(ScrollTrigger) · Lenis. 폰트 Pretendard(CDN)+fallback(Noto Sans KR·Malgun Gothic 추가). `vercel.json`은 SPA rewrite·보안 헤더.
- 데이터: `src/data/projects.ts`(프로젝트 단일 데이터) · `karrotBig.ts`(확대 시 전체 스크롤 이미지 매핑) · `thumb.ts`(홈 섬네일용 srcset 사본 매핑). `thumbnails.ts`·`PhoneMockup.tsx`·`ScrollPhone.tsx`·`Marquee`·`Cursor`·옛 `Olive` 컴포넌트는 미사용(삭제 안 함).
- 페이지: `Home`, `About`, `CaseGeneric`(올리브영 `OliveRenewed`·당근 `Karrot`·우리사이 `Woorisai`), `CaseNodi`, `CaseTrigr`. 공통 조각 `components/LongScreen.tsx`(아래 3절), `Modal.tsx`(`Zoomable`), `BeforeAfter.tsx`·`Compare.tsx`(당근 4구간 비교), `case.tsx`, `Strip.tsx`, `Sections.tsx`(홈 카드), `motion/ScrollStory.tsx`(홈 핀 스토리).
- 이미지 `public/images/<slug>/`(축소 사본은 `t/`), 정적 프로토타입 `public/proto/{karrot,nodi,oliveyoung,woorisai,trigr}`(iframe). 안 건드림: `references/`, `PRODUCT.md`, `.impeccable/`.
- QA: `scripts/qa.mjs`(Playwright-core + 시스템 Chrome, 라우트×뷰포트 오류·오버플로·이미지·폰트 검사), `npm run qa`. 결과 폴더 `qa-out/`는 gitignore.

## 3. 디자인 원칙·공통 컴포넌트 [확정]
- 행간: 큰 제목(h1·h2·인용구) 데스크톱 1.2·모바일 1.25, 작은 제목·부제 1.35, 본문 1.65(옛 "제목 140%" 규칙은 폐기, `index.css` 하단). 제목→본문 간격 데스크톱 24px·모바일 16~20px. 본문 13px 이상, 터치 44px, 문장은 "~해요". 폰 프레임 `.phone-pro`·`.phone-light`. 브랜드 컬러: 올리브영 #82DC28, 당근 #FF6F0F, NODI #3654D4, 우리사이 #566B5C, trigr #DE5DE2.
- 비교는 AS-IS(회색 알약) 왼쪽·TO-BE(프로젝트 컬러) 오른쪽, 같은 프레임 크기. 확대(`Zoomable`)는 Esc·포커스 복귀·세로 스크롤, `pair`로 AS-IS/TO-BE 전환(버튼·좌우 키).
- `LongScreen.tsx`: `ExtendedPhoneScreen`(기기 비율 고정 프레임 위에 긴 UI 한 장을 이어 보이고 아래로 페이드, `srcs`로 여러 장 이음), `PhoneCompare`(좌우 폰 비교, 프레임 비율 통일), `PhoneOverflowCompare`(AS-IS 긴 화면은 프레임 아래로 이어지고 TO-BE는 실제 길이에서 멈춤), `ScreenSequence`, `UIFocusDetail`, `UIPopout`, `CropCompare`·`FullLengthCompare`(현재 미사용). 긴 화면이라고 모두 Overflow로 만들지 않고 구조가 문제를 설명할 때만 쓴다.
- **Typography System**(`index.css` 하단 `--ty-*`): 카드 밖 본문 데스크톱 16/모바일 15 이상, 카드 설명 15/14, 캡션 13, 두 줄 이상 설명 행간 1.5~1.6, 굵은 강조 문장 1.5. 강조 설명문(문제 문장·핵심 문장)은 Regular·진회색, 큰 제목만 Bold. 당근 문제 설명은 23/17px Regular·#444·3/2px 강조선·최대 720px. 챕터 제목 56px는 존재감 때문에 유지(섹션 제목 32px 토큰·섹션 간격 120/72px은 미적용).
- **모션**(`index.css` `.reveal`·`.stagger`, `Reveal.tsx`, `useScrollMotion.ts`): 등장 이동 14px·0.45s ease-out, 읽는 글(`ChapterHead`)은 투명도만(`fade`), 비교 쌍은 AS-IS→TO-BE 순차(`seq-cmp`), 단계 목록은 `Reveal as="ol" stagger slow`, 올리브영 구매 흐름 칩 `.chain`, NODI 말풍선 `popout-in`(입력→응답). 1023px 이하는 카드 등장·패럴랙스 끔, 스케일 확대는 768px↑만, `prefers-reduced-motion` 대응.
- 목업 하단 Safe Area: 화면 이미지 안에서 34pt 확보(홈 인디케이터는 프레임 오버레이이거나 이미지에 포함 — 중복 생성 금지). 우리사이 9장·올리브영 12장 보정, 당근·NODI·trigr는 이미 충분.
- 홈 섬네일의 작은 폰 이미지는 `thumbSet()`으로 300w/600w 사본(srcset)을 쓴다(회전된 폰을 780px 원본에서 크게 줄이면 거칠어짐).

## 4. 현재 구현 상태 [확정]
- **홈**: 핀 고정 프로젝트 전환(900px↑)·모바일은 가로 스토리, 히어로 포인터 글로우(다른 세션 작업, 그대로). 상세 압축: 당근·우리사이의 sticky 갤러리를 시퀀스로 교체, NODI 긴 화면 4개와 올리브영 기존 장바구니 4구간·당근 20화면은 `<details>`(DETAIL)로 분리.
- **올리브영**(작업 2026.11.09–11.19(약 2주)): 솔루션 3개(품절 후 구매 회복 / 장바구니 / 주문·결제). 검증은 동일 참여자 8명 프로토타입 테스트, 품절 후 구매 회복 약 42초·결제 정보 확인 및 구매 결정 26초 단축(과제별로 분리, 합산 금지). 기존 장바구니에도 고정 구매 CTA·무료배송 안내가 있었으므로 새 기능처럼 쓰지 않는다. 주문/결제 AS-IS는 **오늘드림 캡처**(`n-checkoutAsis`, `sp-checkoutAsis-top/body`; 본문의 계좌번호는 흐리게 가림), TO-BE는 접힌 상태 `n-checkoutTobe-slots.webp`(실제 캡처 두 장을 이은 합성: 배송 시간대 항상 펼침)·펼친 상태 `n-checkoutOpen`. 장바구니 비교는 AS-IS가 프레임보다 짧아 바텀시트가 떠 보이던 문제를 `cart-asis-01-tall.jpg`(1720)·`cart-asis-03-tall.jpg`(1880)로 해결(원본 `cart-asis-0x.jpg`는 4구간 시퀀스에서 사용). "개선안" 영역은 AS-IS(`cart-asis-01-tall`)·TO-BE(`n-cart`) 좌우 쌍 + Decision 01~03, 아래 비교는 관련 상품 탐색 쌍만 남김. 프로토타입 `public/proto/oliveyoung/app.js`는 주문/결제 진입 6경로 모두 `g1Open: true`(배송·수령 정보 펼침 시작)로 고침 — 원본 저장소(`OliveYoung`) 재빌드 시 덮어써질 수 있음.
- **당근**(2026.10.19–10.30, 2주): 새 UI 20장, 동일 참가자 7명·전원 단축·평균 −34초(사용자 제공 값, 원본 기록 없어 그래프 없음), 실제 전환율로 표현 금지. 비교는 `karrotCompare` 4구간(AS-IS 다음에 같은 화면의 TO-BE가 먼저 오도록 정렬), 거래 정보 카드는 `ExtendedPhoneScreen`.
- **NODI**(2026.10.15–10.23, 1주): 시안 `NODI-2` 저장소 `.dc.html`, 추천은 규칙 기반 점수(AI 호출 없음), 참석자·캘린더는 예시 데이터. 히어로는 `hero-phone-card.png`(합성 폰 이미지)+`UIPopout` 말풍선(데스크톱 돌출, 모바일은 위 콜아웃). 초기 시안 → 개선 시안 3쌍(`it-*`). 추천 시간 카드·긴 화면 4개는 `ExtendedPhoneScreen`.
- **우리사이**(2026.11.02–11.09, 1주): 히어로는 대표 폰 1개, 문제 카드 2열 압축. 설문 7명(소규모 표본 한계 명시).
- **trigr**(2025.05–2026.06): 상세는 Hero→Context·Approach→상금 지급→정산 신청→Supporting→Design System→Reflection(검증 계획 챕터는 삭제). 프로토타입 실행·체험은 상세에서 제외(정적 빌드·저장소 밖 소스 `Documents/개인 프로젝트 자료/trigr-prototype`는 남김). 과장 표현·사후 제안은 `Post-project proposal`로 분리.
- 당근·올리브영 프로토타입은 GitHub 저장소(`dangn-prototype`, `OliveYoung`) 빌드 사본, 우리사이는 `WOORISAI` 사본, NODI는 정적 시안.

## 5. 정책·의사결정 [확정]
- 상세 본문에서 삭제한 것: NODI "점검한 것·일곱 가지 검증 계획" 섹션, 우리사이 검증 계획 박스·프로토타입 캡션, 반복되던 검증 한계 문구(당근·올리브영·우리사이·NODI·trigr). 사용성 테스트 인원은 "n=8" 대신 "8명" 표기. 핵심 결정은 `\n`으로 의미 단위 문장 분리(`whitespace-pre-line`).
- 사실 날조 금지: 수치·인용·테스트 결과를 만들지 않고 예시·시뮬레이션은 그렇게 표기. 자료 없으면 플레이스홀더·"[추가 자료 필요]". 실제 UI 이미지를 임의로 새로 그리지 않는다(합성·가림은 사용자가 요청한 범위에서만 하고 보고).
- 이름·휴대폰·이메일은 노출, 주소·생년월일·계좌번호는 가림. 올리브영·당근은 비공식 제안 문구 유지.
- **작업은 `site-develop`에서. 푸시는 요청할 때만, 기본은 `site-develop`만**(`main`은 `6f05337`에 머무름, `site-develop`이 39커밋 앞). 푸시 전 `git fetch`, 갈라지면 병합(강제 푸시 금지). 커밋 끝에 `Co-Authored-By: Claude Sonnet 5.5` 줄. 이 파일(`CONTEXT_SUMMARY.md`)은 사용자가 요청할 때 커밋.

## 6. 진행 중·남은 작업
- **[진행 중] 섬네일 해상도**: 홈의 작은 폰 이미지 13개는 `t/` 사본으로 해결. 남은 후보: 홈 `nodi/web-reco.webp`(1800px를 약 80~330px로 표시, 브라우저 목업) 축소 사본 미생성, 배경용 `sofa.png`. 상세 페이지의 작은 폰 격자(390px에서 폭 100~140px, 5~9배 축소)는 회전이 없어 손대지 않음 — 더 선명하게 하려면 1560px 폭 원본이 필요.
- **[검토중] 우리사이 설문 34명** 자료 대기(현재 실제 7명 값). 반영 위치 `CaseGeneric.tsx`의 `survey`·설문 카드, `projects.ts` 우리사이 본문.
- **[검토중] 올리브영 TO-BE 접힘 이미지**: 합성이므로 프로토타입의 실제 상태 캡처가 있으면 교체.
- 미해결 요청: 올리브영 주문/결제 TO-BE 아코디언 Focus Detail(시도 후 장바구니 Focus Detail은 사용자 요청으로 되돌림), 목업 분류표(A~E) 작성, 당근·우리사이·trigr 전용 인터랙션 모션(갤러리 전환·버전 타임라인), 본문 전체 문장 교정 중 일부(비교표 미작성), 모바일 실제 기기 성능 점검은 하지 않음.
- NODI `hi-*`(위쪽만 잘린 이미지) 전체 스크롤 교체 미실시, 올리브영·우리사이·trigr 일부는 전체 스크롤 원본 없음. trigr 상금 지급 4번째(복귀)·Figma Variables 화면은 자료 없음.
- 정리 후보: 미사용 컴포넌트·`public/images/karrot-large-furniture/k-*`(10개).

## 7. 알려진 문제
- 홈 데스크톱 섬네일의 12px 미만 글자 1건 남음(위치 미확인). 콘솔 경고 `allowTransparency`(ProtoFrame iframe, 기존부터).
- Playwright QA는 Chrome만 확인(Firefox·WebKit 미검증). 320px에서 2열 폰 비교는 폭 약 134px라 확대로 읽도록 함. 이미지 `width/height` 미지정(레이아웃 이동 가능성).

## 8. 주의사항
- 수정 후 `npx tsc --noEmit -p .` → 화면 점검 → `npm run build`. macOS는 `sed -i ''`. dev 서버 `npm run dev -- --port 5174`(5173은 예전 서버일 수 있음). 전역 `scroll-behavior: smooth`라 측정 전 `html{scroll-behavior:auto}`.
- 핀 고정 섹션은 바깥 div로 감싸야 React 언마운트 오류가 없음. Lenis는 홈에서만, 모달은 `data-lenis-prevent`. 인라인 `style`의 `left/width`는 CSS보다 우선(반응형 덮어쓰기는 `!important`).
- 당근·NODI 이미지 규칙: `full-*`(전체) `sp-*`(상단·본문·CTA 분리) `f-*`(첫 화면) `L-*`(설명 위치), 확대 매핑은 `karrotBig.ts`. 사용자 PNG는 `~/Desktop/포트폴리오 프로젝트 UI/<프로젝트>/` 우선.
