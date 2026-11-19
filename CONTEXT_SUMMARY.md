# CONTEXT_SUMMARY — 노승우 포트폴리오 사이트

> 새 세션용 요약 (2026-11-19, 코드·git으로 확인). 코드와 `src/data/projects.ts`가 최종 근거이고 이 문서와 다르면 코드를 믿는다.
> 표기: **[확정]** 사용자가 정했거나 코드에 반영됨 / **[검토중]** 미결 / **[미확인]** 확인 못 함. `CLAUDE.md`는 이 저장소에 없다.

## 1. 목적·핵심 기능
- 프로덕트 디자이너 노승우(UX/UI) 포트폴리오. 채용 담당자가 짧은 시간에 문제 해결 과정을 보게 하는 것이 목적.
- 작업 5개: trigr(출시·서비스 종료) / NODI(0→1) / 올리브영 오늘드림·당근 대형가구(기존 서비스 비공식 UX 개선) / 우리사이(0→1).
- 구성: 홈(모션 히어로·프로젝트 스토리·카드) + 케이스 상세 5개 + About. 화면 이미지는 눌러서 확대하고 스크롤해서 볼 수 있음(`Zoomable`).

## 2. 기술 스택·구조 [확정]
- React 19 · TypeScript · Vite · Tailwind v4 · React Router 7 · GSAP(ScrollTrigger) · Lenis(홈 한정). `vercel.json`은 SPA rewrite만.
- `src/data/projects.ts`: 프로젝트 단일 데이터(summary, gallery, beforeAfter, proto, sections). `src/data/karrotBig.ts`: 확대 시 보여줄 전체 스크롤 이미지 매핑(당근 `f-/L-*`, NODI `hi-/hero-/full-*`).
- `src/pages`: Home, About, CaseGeneric(올리브영·당근·우리사이), CaseNodi, CaseTrigr. `src/components`: Layout, Hero, Sections(홈 카드·썸네일), case.tsx, Compare, Modal, Mockup, ScrollPhone 등. `src/motion`: useMotion(Lenis·자석 버튼), SplitText, Cursor, Marquee, ScrollStory.
- `public/images/<slug>/`(화면 이미지), `public/proto/{karrot,nodi,oliveyoung,woorisai}`(정적 프로토타입 iframe).
- 안 건드림: `references/`, `PRODUCT.md`, `.impeccable/`.

## 3. 디자인 원칙·시스템 [확정]
- 제목·부제 행간 140%, 본문 13px 이상, 터치 44px. 문장은 쉬운 말(~해요), 문장 중간 쉼표 쓰지 않음.
- 전역 CSS는 `@layer base`(비레이어 CSS가 Tailwind 유틸을 이김). 폰 프레임 `.phone-pro`·`.phone-light`(바깥 그림자 없음), 섹션 번호 `.num-brand`.
- 브랜드 컬러: 올리브영 #82DC28, 당근 #FF6F0F, NODI #3654D4, 우리사이 #566B5C, trigr #DE5DE2. 카드는 옅은 틴트 배경.
- 긴 스크롤 화면은 설명에 맞는 위치를 보여주고 하단 CTA·탭바는 아래에 고정. NODI·우리사이는 기존 서비스가 없어 "초기/개선 시안" 표기.

## 4. 정책·의사결정 [확정]
- 사실 날조 금지: 수치·인용·테스트 결과를 만들지 않고 시뮬레이션·예시는 그렇게 표기. 자료 없으면 "[추가 자료 필요]".
- 기간: trigr 2025.05–2026.06 / 올리브영 2026.11.09–11.19(약 2주) / 당근 2026.10.19–10.30(2주) / NODI 2026.10.15–10.23(1주) / 우리사이 2026.11.02–11.09(1주).
- 이름·휴대폰·이메일은 노출, 주소·생년월일은 노출 금지. 당근 판매글 작성 AS-IS의 동네 이름은 가리지 않기로 함.
- 앱 아이콘: NODI·우리사이·trigr 제공 SVG, 올리브영·당근 공식 아이콘. 올리브영·당근은 비공식 제안 문구 유지.
- **푸시는 요청할 때만, 기본은 `site-develop`만.** "main도"라고 하면 main까지(현재 두 브랜치 모두 a8f516f). 푸시 전 `git fetch`, 갈라지면 병합(강제 푸시 금지). 커밋 끝에 `Co-Authored-By: Claude Sonnet 5.5` 줄.
- 작업 브랜치는 `site-develop`. 다른 세션이 같은 브랜치에 푸시한다.

## 5. 구현 상태
- 홈·About·상세 5개 동작. 1440/768/390px 자동 점검에서 가로 넘침·깨진 이미지·콘솔 오류 없음, `npm run build` 통과. 모션 줄이기·터치에서는 모션을 모두 끔.
- **NODI 상세** 개편: 배경→문제→디자인 질문→솔루션 01~04→구현 범위→회고→(MORE: 실제 UI·웹 반응형·설계 기록). 사실: 시안(`NODI-2` 저장소, `.dc.html`)이며 추천은 규칙 기반 점수 계산(AI 호출 없음), 참석자 응답·캘린더는 예시 데이터. 시나리오 A/B 캡처는 같은 화요일 90분에서 선호만 오후→오전으로 바꾼 실제 실행 결과.
- **당근 상세**: 새 UI 20장 적용, 사용성 테스트 섹션(동일 참가자 7명, 평균 −41초, 7/7명 단축). 수치는 사용자가 알려준 값이고 참가자별 원본 기록은 어디에도 없어 그래프 없음. 판매자 입력·정보 변경은 이 테스트에 미포함으로 표기.
- **올리브영**: 프로토타입은 상품 상세에서 시작(`?scenarios`로 시나리오 선택 화면), 펼치기/접기 화살표 방향 수정, 상품 이미지 고화질. 사용성 테스트(참여자 8명) 문구가 `projects.ts`에 있음 — 다른 세션이 넣은 것으로 원자료는 내가 확인하지 못함 **[미확인]**.
- **홈**: 섬네일 4개 서로 다른 구도, Lenis·텍스트 등장·핀 고정 프로젝트 전환(900px↑)·마키·커서·카드 기울임.
- 당근 프로토타입은 GitHub `dangn-prototype` 최신 빌드, 올리브영은 `OliveYoung` 저장소(수정본 push됨), 우리사이는 `WOORISAI` 사본. NODI는 정적 시안 사본(작동하는 앱 아님).

## 6. 진행 중·남은 작업
- **[검토중] 우리사이 설문 34명**: 문항별 응답 수·응답자 구성·기간·서술 의견을 못 받아 미적용(현재 실제 7명 값). 반영 위치: `CaseGeneric.tsx`의 `survey`·설문 카드·검증 "7" 카드, `projects.ts` 우리사이 본문.
- 당근: 채팅 장면 BEFORE는 자리표시. 다른 세션이 올린 구매자 화면(F1–F3, T1–T6, `references/karrot-large-furniture/to-be-full-scroll`)은 페이지에 아직 미사용.
- NODI: 실제 UI 목록의 `hi-*`(위쪽만 잘린 이미지)를 전체 스크롤 기준으로 바꾸는 작업 미실시.
- 올리브영·우리사이·trigr는 전체 스크롤 원본이 없어 확대하면 한 화면만 보임.
- 우리사이 사진 상호작용·발자국 Before/After는 예전 프로토타입 캡처. trigr 미션 생성 4단계는 PDF 이미지.
- 정리: 안 쓰는 `public/images/karrot-large-furniture/k-*`(10개) 등 미사용 이미지, 이미지 srcset, 긴 본문 문장 다듬기.

## 7. 알려진 문제
- 13px 미만 글자: 홈 장식 라벨(10~12px 여러 개)과 올리브영 몇 곳(미조치).
- 콘솔 경고 `allowTransparency`(ProtoFrame iframe 속성, 기존부터, 동작엔 영향 없음).
- 홈 모션의 호버·커서·자석 버튼·모바일 폭은 코드와 자동 점검으로만 확인, 직접 조작·눈 확인 못 함.

## 8. 주의사항
- 파일 수정 후 `npx tsc --noEmit -p .` → 점검 → `npm run build`. macOS는 `sed -i ''`. dev 서버 `npm run dev -- --port 5173`.
- 임시 도구(Playwright 점검, 로컬 서버)는 세션 scratchpad라 사라질 수 있음. 새로 만들 때 `npm i playwright-core`와 시스템 Chrome 사용.
- 핀 고정(ScrollTrigger pin) 섹션은 바깥 div로 감싸야 React 언마운트 오류가 없음. Lenis는 홈에서만 켜고, 모달은 `data-lenis-prevent`.
- 당근·NODI 화면 이미지는 `full-*`(전체), `sp-*`(상단·본문·CTA 분리), `f-*`(첫 화면), `L-*`(설명 위치) 규칙. 확대는 `karrotBig.ts`가 매핑.
- 사용자 PNG는 `~/Desktop/포트폴리오 프로젝트 UI/<프로젝트>/` 우선. 올리브영 상품 이미지는 올리브영 상품 페이지(A000000223414) 원본.
- 메모리에 "작업은 site-develop" 규칙이 있음(`~/.claude/projects/.../memory`).
