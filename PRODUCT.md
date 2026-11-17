# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
채용 담당자와 디자인 리드. 신입~주니어 프로덕트(UX/UI) 디자이너 채용 심사에서 여러 포트폴리오를 빠르게 훑어보고 면접 여부를 판단한다. 개발자·PM은 이번 범위의 주요 대상이 아니다.

## Product Purpose
노승우의 UX/UI · Product Designer 포트폴리오(2026). 프로젝트 사례를 통해 문제 정의, 설계 판단, 구현·협업 역량을 보여주고 면접으로 이어지게 하는 것이 목표다.

## Positioning
출시 경험(trigr)과 직접 만든 실행 가능한 프로토타입. 다른 신입 디자이너가 그대로 따라 말할 수 없는 두 가지다.

## Operating Context
- 프로젝트 5개: trigr(출시 회고), 올리브영 오늘드림·당근·NODI·우리사이(기존 서비스 UX 개선 / 신규 서비스).
- 프로토타입은 `public/proto/<project>/`에 정적 파일로 두고 상세 페이지 iframe에서 실행한다.
- 홈(Hero·Work·Philosophy·About/Contact), 프로젝트 상세(`/work/<slug>`), About 페이지로 구성된다.

## Capabilities and Constraints
- React + TypeScript + Vite, Tailwind, React Router, GSAP. Vercel 정적 배포(`vercel.json` rewrite).
- 프로젝트·프로필 사실관계의 단일 원문은 `src/data/projects.ts`다.
- 성과 수치, 인터뷰, 인용을 만들지 않는다. 자료가 없는 섹션은 '추후 입력'으로 두고 화면에서 숨긴다.
- 한국어가 기본, 영문은 라벨 수준.
- 미결: 이메일 공개 여부, 우리사이 프로토타입·GitHub 링크 공개 여부, 당근 프로토타입 상품 사진 출처, trigr 역할 표기, 도메인·OG 최종본.

## Evidence on Hand
프로젝트 화면 이미지(`public/images/`), 프로토타입 4개(trigr 제외), 올리브영 Before/After, `references/portfolio-cover.png`, `docs/` 내 기획·감사 문서. 성과 수치, 프로필 사진, trigr 1·2차 시안은 없으며 만들지 않는다.

## Product Principles
1. 사실만 보여준다. 근거 없는 수치와 표현보다 비어 있는 칸이 낫다.
2. 결과물과 판단 과정을 함께 보여준다. 화면 옆에 왜 그렇게 정했는지가 있다.
3. 직접 눌러볼 수 있는 프로토타입을 증거로 앞세운다.
4. 바쁜 심사자가 수 분 안에 요점을 파악할 수 있어야 한다.

## Accessibility & Inclusion
WCAG AA(본문 대비 4.5:1 이상)와 `prefers-reduced-motion` 존중.
