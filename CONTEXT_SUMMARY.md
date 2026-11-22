# CONTEXT_SUMMARY — 노승우 포트폴리오 사이트

> 새 세션용 요약 (2026-11-20 갱신, 코드·git으로 확인). **새 세션은 이 파일을 가장 먼저 읽는다.** 코드와 `src/data/projects.ts`가 최종 근거이고 이 문서와 다르면 코드를 믿는다.
> 표기: **[확정]** 사용자가 정했거나 코드에 반영됨 / **[검토중]** 미결 / **[미확인]** 확인 못 함. `CLAUDE.md`는 이 저장소에 없다.

## 1. 목적·핵심 기능
- 프로덕트 디자이너 노승우(UX/UI) 포트폴리오. 채용 담당자가 짧은 시간에 문제 해결 과정을 보게 하는 것이 목적. 콘셉트 "Complexity → Clarity", 디자인 철학 Soft Clarity.
- 작업 5개: 올리브영 오늘드림·당근 대형가구(기존 서비스 비공식 UX 개선) / NODI·우리사이(0→1) / trigr(출시·서비스 종료).
- 구성: 홈(히어로·핀 고정 프로젝트 스토리·대표 카드+카드 4개·접근 방식·About/Contact) + 케이스 상세 5개 + About. 화면 이미지는 눌러서 확대·스크롤(`Zoomable`).

## 2. 기술 스택·구조 [확정]
- React 19 · TypeScript · Vite · Tailwind v4 · React Router 7(라우트 분할) · GSAP(ScrollTrigger) · Lenis. `vercel.json`은 SPA rewrite와 보안 헤더.
- `src/data/projects.ts` 프로젝트 단일 데이터 / `karrotBig.ts` 확대 시 전체 스크롤 이미지 매핑 / `thumbnails.ts` 아래 4절 참고.
- `src/pages`: Home, About, CaseGeneric(올리브영·당근·우리사이), CaseNodi, CaseTrigr. `src/components`: Sections(홈 카드·섬네일), Hero, case.tsx(공용 상세 요소 `InteractionPreview` 등), Mockup(`ProtoFrame`), Modal. `src/motion`: ScrollStory, SplitText, useScrollMotion.
- `public/images/<slug>/` 화면 이미지, `public/proto/{karrot,nodi,oliveyoung,woorisai,trigr}` 정적 프로토타입(iframe). 안 건드림: `references/`, `PRODUCT.md`, `.impeccable/`.

## 3. 디자인 원칙·시스템 [확정]
- 제목·부제 행간 140%(예외는 상세 상단 제목), 본문 13px 이상, 터치 44px, 문장은 "~해요", 문장 중간 쉼표 쓰지 않음. 전역 CSS는 `@layer base`.
- 폰 프레임 `.phone-pro`·`.phone-light`. 브랜드 컬러: 올리브영 #82DC28, 당근 #FF6F0F, NODI #3654D4, 우리사이 #566B5C, trigr #DE5DE2.
- 긴 스크롤 화면은 설명에 맞는 위치를 보여주고 하단 CTA·탭바는 고정. NODI·우리사이는 기존 서비스가 없어 "초기/개선 시안" 표기.

## 4. 현재 구현 상태 [확정]
- **홈**: 단어 단위 텍스트 등장, 핀 고정 프로젝트 전환(900px↑), 스태거(`data-stagger`)·패럴랙스(`data-parallax-y`, `useScrollMotion.ts`). 핀 섹션은 `refreshPriority: 10`. 히어로의 포인터 따라다니는 파란 글로우는 다른 세션이 넣은 것(그대로 둠).
- **홈 섬네일**: 카드 구성은 `Sections.tsx`의 `ThumbnailVisual`·`OliveShowcase`(다른 세션이 직접 짠 구도, 제목은 올리브영 `OUT OF STOCK. MORE OPTIONS.`, NODI 배경 #DCE3FB·제목 #202020). **`PhoneMockup.tsx`·`thumbnails.ts`(설정 기반 목업)는 현재 아무 곳에서도 쓰이지 않지만 삭제하지 않음.** 쓰려면 `ThumbnailVisual` 맨 앞에서 `thumbSpecs[p.slug]`를 읽게 연결.
- **홈 최근 변경 [확정]**: 접근 방식 3번은 `Complete`("막히는 순간의 화면까지 설계합니다", 당근 조회 실패 화면 `L-e1`), About의 Prototype 항목도 Complete로 교체. trigr 섬네일은 밝은 톤(#F6E4F6, 알약 4개, 폰 6° 회전), NODI 섬네일은 `cqw` 단위(제목 8.4cqw)로 제목·목업이 겹치지 않게 맞춤.
- **상세 공통 [확정]**: 상단 챕터 내비는 `case.tsx`의 스크롤 기반 `useActive(dep, list)`로 동작(5개 상세 모두 확인, NODI는 list를 넘겨야 함). NODI 내비에는 `프로토타입` 버튼(`onCta`) 있음. NODI 문제 카드 사이 화살표 제거, 초기 시안 이미지 `it-init-*` 재렌더, 개선 시안 조건 확인 `it-final-conds`는 사용자 v6 PNG.
- **올리브영 BEFORE 롱스크롤 [확정]**: `karrotBig.ts`의 `n-checkoutAsis`(배송)·`n-checkoutAsisPickup`(픽업) `parts` 매핑(상단 고정+본문 스크롤, `topCq` 24.74). 현재 페이지는 픽업 사용, 개인정보(계좌 번호 등)는 가림.
- **작업 기간(확정)**: 올리브영 2026.11.09–11.19(약 2주), 당근 2026.10.19–10.30(2주), NODI 2026.10.15–10.23(1주), 우리사이 2026.11.02–11.09(1주), trigr 2025.05–2026.06.
- **NODI 상세**: 배경→문제→디자인 질문→솔루션 01~04→구현 범위→회고→MORE. 사실: 시안(`NODI-2` 저장소 `.dc.html`), 추천은 규칙 기반 점수(AI 호출 없음), 참석자·캘린더는 예시 데이터.
- **당근 상세**: 새 UI 20장, 사용성 테스트(동일 참가자 7명, 평균 −34초, 7/7명 단축 — 사용자가 준 값, 원본 기록 없어 그래프 없음).
- **올리브영**: 프로토타입은 상품 상세에서 시작(`?scenarios`). 사용성 테스트(참여자 8명) 문구는 다른 세션이 넣은 것 **[미확인]**.
- **Trigr 상세 리뉴얼**: `CaseTrigr.tsx` = Hero → Context·Approach → 상금 지급 → 정산 신청 → Supporting → Design System → Validation Plan(`Validation Planned`, 프로토타입 체험은 제외) → Reflection. 공용 `CaseBlock`(Problem → Decision → UI → Outcome). 역할 `Product Designer · UX/UI Design`, "총괄·디자인 시스템 구축" 같은 과장 표현은 쓰지 않음. 사후 제안은 `Post-project proposal` 라벨로 분리, 자료 없는 곳은 점선 플레이스홀더. 홈 trigr 문구는 `FROM GAPS TO FLOWS.` / "정의되지 않은 요구사항을 실제 사용자 흐름으로 구체화하다."
- **trigr 프로토타입(상세에서 제외됨, 2026-11-20)**: 상세 페이지의 실행 버튼·체험 섹션·내비 항목을 뺐고 `projects.ts`의 trigr `proto`도 지움. 정적 빌드 `public/proto/trigr/`와 저장소 밖 소스 `Documents/개인 프로젝트 자료/trigr-prototype`는 남겨 둠(다시 쓰려면 `proto: { url: '/proto/trigr/index.html?sc=e&v=20261120-flows', w: 390, h: 844, pro: true }` 복원).
- 당근·올리브영 프로토타입은 각 GitHub 저장소(`dangn-prototype`, `OliveYoung`) 최신 빌드 사본, 우리사이는 `WOORISAI` 사본, NODI는 정적 시안 사본(작동 앱 아님).

## 5. 정책·의사결정 [확정]
- 사실 날조 금지: 수치·인용·테스트 결과를 만들지 않고 예시·시뮬레이션은 그렇게 표기. 자료 없으면 "[추가 자료 필요]"/플레이스홀더.
- 이름·휴대폰·이메일은 노출, 주소·생년월일은 노출 금지. 당근 판매글 AS-IS의 동네 이름은 가리지 않음. 올리브영·당근은 비공식 제안 문구 유지.
- **작업은 `site-develop`에서. 푸시는 요청할 때만, 기본은 `site-develop`만.** "main도"라고 하면 main까지, fast-forward로. 푸시 전 `git fetch`, 갈라지면 병합(강제 푸시 금지). 다른 세션이 같은 브랜치에 푸시하니 자주 병합이 필요함. 커밋 끝에 `Co-Authored-By: Claude Sonnet 5.5` 줄.
- 2026-11-20 기준 `site-develop`과 `main` 모두 `6f05337`(동기화됨, 이후 변경은 `git log`로 확인. 메모리에도 규칙 저장).

## 6. 진행 중·남은 작업
- **[검토중] 우리사이 설문 34명**: 문항별 응답 수·구성·기간·서술 의견 자료 대기(현재 실제 7명 값). 반영 위치 `CaseGeneric.tsx`의 `survey`·설문 카드·검증 "7" 카드, `projects.ts` 우리사이 본문.
- 당근: 채팅 BEFORE는 사용자 캡처(`asis-chat`, 닉네임 가림)로 채움. 구매자 화면(F1–F3, T1–T6)은 페이지에 미사용.
- **[검토중] 올리브영 비교 불일치**: 두 번째 비교의 BEFORE는 픽업 결제 롱스크롤(`n-checkoutAsisPickup`), AFTER는 오늘드림 배송 화면이라 흐름이 다름. 맞출지 사용자 결정 필요.
- NODI: 실제 UI 목록의 `hi-*`(위쪽만 잘린 이미지)를 전체 스크롤 기준으로 교체 미실시. 올리브영·우리사이·trigr는 전체 스크롤 원본이 없어 확대하면 한 화면만 보임(trigr 프로토타입의 PNG 화면도 스크롤 안 됨).
- trigr: 상금 지급 4번째(복귀) 화면·Figma Variables 화면은 자료 없음, 미션 만들기(+) 흐름은 PNG 없어 미구현.
- 정리: 안 쓰는 `public/images/karrot-large-furniture/k-*`(10개), 미사용 `Marquee.tsx`·`Cursor.tsx`·`PhoneMockup`, 이미지 srcset.

## 7. 알려진 문제
- 13px 미만 장식 라벨(섬네일 11~12px 등). 콘솔 경고 `allowTransparency`(ProtoFrame iframe, 기존부터).
- 모바일 폭에서 섬네일 안 글자는 읽기 어려움(카드 4:3 고정의 한계). 홈 모션 hover·커서·모바일은 자동 점검과 코드로만 확인.

## 8. 주의사항
- 수정 후 `npx tsc --noEmit -p .` → 화면 점검 → `npm run build`. macOS는 `sed -i ''`. dev 서버는 `npm run dev -- --port 5174`(**5173은 예전 복사본 폴더 서버일 수 있음**). Playwright 점검 도구는 세션마다 사라지니 필요하면 `npm i playwright-core`+시스템 Chrome으로 다시 만든다.
- 핀 고정(ScrollTrigger pin) 섹션은 바깥 div로 감싸야 React 언마운트 오류가 없음. Lenis는 홈에서만, 모달은 `data-lenis-prevent`.
- 당근·NODI 이미지는 `full-*`(전체), `sp-*`(상단·본문·CTA 분리), `f-*`(첫 화면), `L-*`(설명 위치) 규칙, 확대 매핑은 `karrotBig.ts`. 사용자 PNG는 `~/Desktop/포트폴리오 프로젝트 UI/<프로젝트>/` 우선.
- 인라인 `style`의 `left/width`는 CSS보다 우선하므로 반응형 덮어쓰기에는 `!important`가 필요.
