import { useState } from 'react'
import type { Project } from '../data/projects'

// 실제 전/후 시안이 있을 때만 사용. 네이티브 range 라 드래그·터치·키보드(←→) 모두 지원, 버튼으로 전/후 전환도 가능.
export default function BeforeAfter({ data }: { data: NonNullable<Project['beforeAfter']> }) {
  const [pos, setPos] = useState(50)
  return (
    <figure className="border border-grid rounded-[20px] bg-white p-4 md:p-6 max-w-[460px] mx-auto">
      <div className="relative overflow-hidden select-none focus-within:outline-2 focus-within:outline-blue">
        <img src={data.after} alt={`After: ${data.afterAlt}`} className="block w-full" />
        <img src={data.before} alt={`Before: ${data.beforeAlt}`} className="absolute inset-0 w-full h-full object-cover" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }} />
        <span className="absolute top-2 left-2 bg-white text-[13px] px-2 py-1">Before</span>
        <span className="absolute top-2 right-2 bg-blue text-white text-[13px] px-2 py-1">After</span>
        <div aria-hidden className="absolute inset-y-0 w-0.5 bg-blue" style={{ left: `${pos}%` }} />
        <input type="range" min={0} max={100} step={2} value={pos} onChange={e => setPos(+e.target.value)} aria-label="Before/After 비교 위치" className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize" />
      </div>
      <div className="mt-3 flex gap-2">
        <button className="px-4 py-3 text-[14px] border border-grid" onClick={() => setPos(100)}>Before 보기</button>
        <button className="px-4 py-3 text-[14px] border border-grid" onClick={() => setPos(0)}>After 보기</button>
      </div>
      <figcaption className="mt-3 text-[14px] text-sub"><ul className="list-disc pl-5">{data.points.map(p => <li key={p}>{p}</li>)}</ul></figcaption>
    </figure>
  )
}
