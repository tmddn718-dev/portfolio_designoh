// 홈 카드·쇼케이스 안의 작은(약 150~290px) 폰 이미지는 780px 원본을 3~5배로 줄여 그리면(특히 회전된 폰) 글자가 거칠게 보인다.
// 표시 크기에 맞춘 300w/600w 사본(/images/<프로젝트>/t/)을 srcset 으로 내려, 화면 배율(DPR)에 맞는 크기를 브라우저가 고르게 한다.
// 사본이 있는 이미지만 변환하고, 없으면 원본을 그대로 쓴다. (새 이미지를 쓰려면 t/ 에 600px 폭 <이름>.webp 와 300px 폭 <이름>-300.webp 를 만들고 아래 목록에 추가)
const HAS = new Set([
  'karrot-large-furniture/L-b1', 'karrot-large-furniture/L-b2', 'karrot-large-furniture/L-e1', 'karrot-large-furniture/f-home',
  'nodi/full-review', 'oliveyoung-todaydream/n-altMethods', 'oliveyoung-todaydream/n-optMain-indicator', 'oliveyoung-todaydream/n-optC-indicator',
  'trigr/home-map', 'trigr/mission-discovery-02', 'woorisai/detail', 'woorisai/home', 'woorisai/feed',
])
export function thumbSet(src: string, sizes = '300px'): { src: string; srcSet?: string; sizes?: string } {
  const m = /^\/images\/([^/]+)\/([^/?]+?)\.(?:webp|png)(\?.*)?$/.exec(src)
  if (!m || !HAS.has(`${m[1]}/${m[2]}`)) return { src }
  const base = `/images/${m[1]}/t/${m[2]}`
  return { src: `${base}.webp`, srcSet: `${base}-300.webp 300w, ${base}.webp 600w`, sizes }
}
