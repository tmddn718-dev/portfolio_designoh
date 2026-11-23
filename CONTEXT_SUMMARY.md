# CONTEXT_SUMMARY — 노승우 포트폴리오 사이트

> 새 세션용 요약 (2026-11-24, 코드·git으로 확인). **새 세션은 이 파일을 가장 먼저 읽는다.** 코드와 `src/data/projects.ts`가 최종 근거이며 이 문서와 다르면 코드를 믿는다.
> 표기: **[확정]** 사용자가 정했거나 코드에 반영됨 / **[검토중]** 미결 / **[미확인]** 확인 못 함. `CLAUDE.md`는 이 저장소에 없다.

## 1. 목적·핵심 기능
- 프로덕트 디자이너 노승우(UX/UI) 포트폴리오. 채용 담당자가 짧은 시간에 문제 해결 과정을 보게 한다. 콘셉트 "Complexity → Clarity / Soft Clarity".
- 작업 5개: 올리브영 오늘드림·당근 대형가구(기존 서비스 비공식 UX 개선) / NODI·우리사이(0→1 신규) / trigr(출시·서비스 종료, 실무).
- 구성: 홈(히어로·핀 고정 프로젝트 스토리·Selected Work 대표+카드·Soft Clarity·About/Contact) + 상세 5개(`/work/:slug`) + About. 화면 이미지는 눌러서 확대.

## 2. 스택·구조 [확정]
- React 19 · TS · Vite · Tailwind v4 · React Router 7 · GSAP(ScrollTrigger) · Lenis · Pretendard(CDN). 배포 `vercel.json`(SPA rewrite).
- `src/data/projects.ts`(단일 사실 원문) · `karrotBig.ts` · `thumb.ts`(홈 srcset). 페이지: `Home`·`About`·`CaseGeneric`(올리브영·당근·우리사이)·`CaseNodi`·`CaseTrigr`. 컴포넌트: `Hero`·`Sections`(홈)·`LongScreen`(폰 비교·`ScreenSequence`)·`BeforeAfter`·`Strip`(`ScrollFade` 포함)·`case`(`ChapterHead`·`ChapterNav`·`ProjectIndex`·`onBrand`)·`Modal`·`Reveal`. 모션 `src/motion/*`(`ScrollStory`가 홈 스토리·모바일 레일).
- 미사용(삭제 안 함): `Landing`·`PhoneMockup`·`ScrollPhone`·`Marquee`·`Cursor`·`thumbnails.ts`.
- 이미지 `public/images/<slug>/`, 정적 프로토타입 `public/proto/*`(iframe). 건드리지 않음: `references/`·`PRODUCT.md`·`.impeccable/`.
- 검증: 임시 `scripts/_*.mjs`(Playwright-core + `/Applications/Google Chrome.app`)로 `localhost:5174`(`npm run dev -- --port 5174`), 끝나면 삭제. 측정 전 `html{scroll-behavior:auto}`, `.reveal`에 `in` 부여. `scripts/qa.mjs`는 기존.

## 3. 디자인 원칙·시스템 [확정] (모두 `src/index.css` 하단 블록)
- **그리드**: `--content-max` 1240, 좌우 gutter 60(≥1200)/32/20. 홈·상세 폭 동일. 2단 헤더 컬럼 간격 64. 카드 패딩 32(모바일 20). 반경 토큰 12/16/24/28만 사용.
- **상세 타이포(데스크톱 ≥768 / 모바일)**: h1 50/32 · 섹션 h2 42/28 · 문제 34/26 · 질문 42/28 · h3 34/24 · 카드 제목 24/18 · 강조문 26/20 · 본문 20/16 · 카드 설명 17/14 · 영문 라벨 13. 행간 h1 1.35·1.4(모바일), 제목 1.4, 본문 1.75, 보조 1.7. 본문 폭 756, 제목→설명 26, 문단 간 18, `.wrap` 상하 66. 텍스트 +2px 규칙은 `text-[Npx]` 클래스 기반 일반 규칙(`:where`)이고 **배지·라벨·캡션·버튼·썸네일·모바일은 제외**. 우선순위가 얽혀 있어 크기를 바꿀 때는 해당 선택자를 `getComputedStyle`로 확인한다.
- **홈 타이포**: 섹션 제목 `clamp(26,2.2vw,32)`, `.body-copy` 17~20, 카드 제목 28·설명 19, 스크롤 목록 선택 32 Bold·비선택 26 Regular(연회색), 히어로 80/40.
- **섹션 헤더**: 타이틀 좌(7칸)·설명 우(5칸, 오른쪽 끝, 최대 440)·상단선 일치 — `ChapterHead`/NODI `Head`의 `desc` prop. 홈 Selected Work: 타이틀 "화면보다 문제부터"(구두점 없음, 한 줄)가 설명문 마지막 줄과 하단 정렬, 카드와 48px. 구분선(섹션 위 가로선) 없이 간격으로 구분.
- **한국어 줄바꿈**: `word-break: keep-all`, 제목·본문 `text-wrap: balance`(Chrome 6줄 이하), 모바일에서 h2 `<br>` 숨김(`<br>` 앞 공백 유지).
- **썸네일 토큰(홈 카드)**: `.thumb-title` 800·행간 1.05·자간 −.04em·대문자, 크기 `clamp(20px,7.9cqw,48px)`; `.thumb-label` 700·.12em·14px(최소 11). 프로젝트별 임의 크기·scale 금지.
- **비교**: AS-IS 왼쪽·TO-BE 오른쪽, 같은 프레임. 가운데 화살표 없음. 모바일은 설명 불릿을 폰 아래로 쌓음. 긴 화면을 전부 Overflow로 만들지 않는다. 목업 하단 Safe Area 34pt.
- **모션**: 등장 14px·0.45s, 읽는 글은 투명도만, `prefers-reduced-motion`·1023px 이하 단순화. 모바일 가로 스크롤은 공통 우측 페이드(`Strip`·`ScrollFade`, 화면 끝 정렬).
- **접근성**: `onBrand()`가 WCAG 휘도로 글자색 선택(흰색 3.5:1 미만이면 #111), `strongOf` 55%. 스티키 "프로토타입" 버튼 38px(터치 44 유지). INDEX 현재 작업은 Lucide check 인라인 SVG + sr-only 문구.
- 브랜드 컬러: 올리브영 #82DC28, 당근 #FF6F0F, NODI #3654D4, 우리사이 #566B5C, trigr #DE5DE2(글자는 #0F7F7B 등 어둡게).

## 4. 구현 상태 [확정]
- **올리브영**: 솔루션 3개, 동일 참여자 8명 약 42초·26초 단축(과제별, 합산 금지), AS-IS/TO-BE 쌍+Decision 01~03(항목 위 선 없음). **당근**: 20화면, 7명 전원 단축·평균 −34초(사용자 제공값, 그래프·전환율 금지), 사용성 테스트 블록은 왼쪽 그룹 전체를 우측 카드 하단에 정렬. **NODI**: 추천은 규칙 기반(AI 호출 없음), 예시 데이터. **우리사이**: 설문 7명(소규모), h1 48/32. **trigr**: 프로토타입 없음, 첫 화면 CTA는 "핵심 사례 보기".
- 홈: 스토리 trigr 장면은 밝은 라벤더 톤, 썸네일 4종 타이포 통일, INDEX는 이름(좌)·유형/기간 2줄(우) 세로 중앙(≥640px, 제목은 ≥1280에서만 좌측 열). About은 소개 문장이 h1, 큰 이름 문구 삭제.
- 삭제한 것: 상세 섹션 구분 가로선, 당근 결과 카드 내부선, 우리사이·당근 썸네일 선, 홈 "이어지는 작업" 위 선, NODI 점검 섹션·반복 한계 문구. 사용성 인원 표기 "8명"(n= 금지).

## 5. 정책 [확정]
- 사실 날조 금지(수치·인용·테스트·성과), 예시는 예시로 표기. 실제 UI 이미지를 임의로 새로 그리지 않는다. 이름·연락처 외 개인정보 가림. 올리브영·당근은 비공식 제안 문구 유지.
- **요청하지 않은 변경 금지**: 사용자가 지정한 부분 밖(폭·비율·간격 포함)을 바꾸지 않는다. 바꿨다면 보고하고 되돌릴 수 있게 한다.
- **작업은 `site-develop`에서**(HEAD `d92370b`, `main` `6f05337`보다 106커밋 앞). 커밋·푸시는 요청할 때만, 푸시 전 `git pull --rebase --autostash`(강제 푸시 금지), 커밋 끝에 `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`. `tsconfig.tsbuildinfo`·이 파일은 요청 전 커밋하지 않음.
- Bash 한 번에 `rm`+`git pull`+`git push`를 묶으면 자동 권한 검사에 막힌다 → 임시 파일 삭제와 git 단계를 분리해 실행.

## 6. 진행 중·남은 작업
- **[검토중]** 우리사이 설문 34명 자료 대기. 올리브영 TO-BE 접힘 이미지는 합성(실제 캡처 있으면 교체). 상세 히어로 구조·폰 크기가 프로젝트마다 다름(통일 보류). 당근 Result Interpretation은 상단 정렬 유지(하단 정렬 여부 미정). 올리브영 Edge cases 항목선·trigr "핵심 UX 원칙" 위 선·홈 Soft Clarity 목록선은 남겨 둠(지울지 미정). 상세 섹션 헤더 중 설명이 따로 놓인 곳의 2단 통일은 사용자가 보류함.
- 미적용: 올리브영 주문/결제 TO-BE Focus Detail, 목업 분류표, 이미지 `width/height` 일괄 추가, 실제 기기 성능 점검, 미사용 컴포넌트 정리.

## 7. 알려진 문제
- 태블릿(768px)에서 +2px 이후 일부 줄바꿈 어색(올리브영 h1 고아 줄, 당근·우리사이 카드 제목, trigr 4열 카드). 필요하면 768~1023만 +1px로 낮추는 안.
- 우리사이 프로토타입 콘솔 경고(`{{ pf.date }}` 템플릿 문자열, `public/proto/woorisai/index.html`), `allowTransparency`(ProtoFrame). Chrome만 검증(Firefox·WebKit 미검증). 홈 카드 제목 `#a7a7a9`(대비 2.3, 의도된 연회색). 홈 썸네일 아트의 11px 장식 라벨.

## 8. 주의사항
- 수정 후 `npx tsc --noEmit -p .` → 화면·수치 점검(1440/768/390) → `npm run build`. macOS는 `sed -i ''`.
- CSS는 비계층이라 Tailwind 유틸리티보다 우선. 상세 규칙은 `main article`, 홈은 `main > :not(article)`. 홈 카드도 `article`이라 상세 카드 규칙이 새어 들어올 수 있음(홈 카드 설명은 `!important`로 19px 고정). `.apple-h`·`main h1:not(#hero h1)`는 우선순위가 높아 제목 행간은 `main article h2.apple-h`/`!important`로 덮는다.
- 핀 고정 섹션은 바깥 div로 감싼다. Lenis는 홈에서만, 모달은 `data-lenis-prevent`. 스크롤 구간 스크린샷은 전환 중 흐리므로 대기 후 촬영.
- 이미지 규칙: `full-*` `sp-*` `f-*` `L-*`, 확대 매핑 `karrotBig.ts`. 사용자 PNG는 `~/Desktop/포트폴리오 프로젝트 UI/<프로젝트>/` 우선.
