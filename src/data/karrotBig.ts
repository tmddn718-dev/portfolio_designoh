// 당근 화면을 눌렀을 때 보여줄 '전체 스크롤' 이미지를 찾아요.
// 하단 고정 버튼이 있는 화면은 상단·본문·하단으로 나눠서 스크롤하는 동안에도 버튼이 아래에 붙어 있게 해요.
const BASE = '/images/karrot-large-furniture/'
const ID: Record<string, string> = {
  'f-b1': 'b1', 'L-b1': 'b1', 'f-b2': 'b2', 'L-b2': 'b2', 'f-b3': 'b3', 'f-b4': 'b4',
  'f-edit': 'c1', 'L-c1': 'c1', 'f-c2': 'c2', 'f-c3': 'c3', 'L-c3': 'c3', 'f-c4': 'c4',
  'f-e1': 'e1', 'L-e1': 'e1', 'f-e2': 'e2', 'f-done': 'e3',
  'f-home': 's1', 'f-s2': 's2', 'L-s2': 's2', 'f-s3': 's3', 'L-s3': 's3', 'f-s4': 's4', 'f-s5': 's5', 'L-s5': 's5',
  'asis-write': 'aw', 'f-recheck': 's6', 'f-confirm': 's7', 'f-confirm-empty': 's8', 'f-posted': 's9', 'L-s9': 's9',
}
const STICKY = new Set(['aw', 'b1', 'b2', 'c1', 'c3', 'e1', 'e2', 'e3', 's2', 's3', 's4', 's5', 's9'])
export type KarrotFull = { big: string } | { parts: { top: string; body: string; cta: string } }
export function karrotFull(src: string): KarrotFull | undefined {
  if (!src.startsWith(BASE)) return undefined
  const id = ID[src.slice(BASE.length).replace(/\.webp$/, '')]
  if (!id) return undefined
  return STICKY.has(id) ? { parts: { top: `${BASE}sp-${id}-top.webp`, body: `${BASE}sp-${id}-body.webp`, cta: `${BASE}sp-${id}-cta.webp` } } : { big: `${BASE}full-${id}.webp` }
}
