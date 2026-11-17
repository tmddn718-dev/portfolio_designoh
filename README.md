# Portfolio 2026 — 노승우

UX/UI · Product Designer 포트폴리오. React + TypeScript + Vite, Tailwind, React Router, GSAP.

## 실행
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 타입 검사 + dist/ 빌드
```

## 콘텐츠 수정
- **모든 프로젝트 데이터:** `src/data/projects.ts` (이름·역할·기간·본문·이미지 경로). 사실관계는 이 파일의 문구가 원문입니다.
- **프로필·경력·도구:** 같은 파일의 `profile`. `email`이 홈 Contact에 노출되므로 공개해도 되는 주소인지 확인하세요. `resume`에 `/resume.pdf` 같은 경로를 넣으면 링크가 나타납니다(이력서 PDF에는 주소·전화·생년월일이 있으니 공개용 사본 사용).
- **페이지:** 홈 `src/components/Sections.tsx`·`Hero.tsx`, 상세 `src/pages/CaseTrigr.tsx`(trigr), `CaseNodi.tsx`, `CaseGeneric.tsx`(올리브영·당근·우리사이).
- **이미지:** `public/images/<project>/`. 모바일 화면은 780×1688(2x) 이상 권장.
- **프로토타입:** `public/proto/<project>/` (정적 파일, 페이지의 iframe으로 실행).
- 내용이 비어 있는 섹션(`추후 입력`)은 화면에서 숨겨집니다.

## 배포 (Vercel)
1. 이 폴더를 새 GitHub 저장소로 올립니다(`git init` → 커밋 → 푸시).
2. Vercel에서 저장소를 Import → Framework: Vite (빌드 `npm run build`, 출력 `dist`).
3. `vercel.json`의 rewrite 덕분에 `/work/nodi` 같은 주소를 직접 열어도 404가 나지 않습니다.
4. 배포 후 `index.html`의 `og:image`를 `https://<내 도메인>/og.png` 절대 주소로 바꾸세요.

## 배포 전 확인
- [ ] 홈 Contact의 이메일 공개 여부
- [ ] 우리사이 프로토타입(`public/proto/woorisai`)과 GitHub 링크 공개 여부 (현재 링크는 걸지 않음)
- [ ] 당근 프로토타입 상품 사진 출처
- [ ] trigr 역할 표기와 원문 회고 표현("1인 디자이너" 등) 확인
- [ ] Lighthouse·실기기(iOS Safari/Android) 점검

## 추가 자료가 필요한 항목
`docs/PORTFOLIO_2.0_PHASE1.md`의 "Figma 재추출" 목록 참고(trigr PDF 크롭 이미지, 프레임 없는 NODI v6, 올리브영 AS-IS 분할 캡처, OG 최종본 등).
