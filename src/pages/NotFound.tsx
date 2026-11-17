import { Link } from 'react-router-dom'
export default function NotFound() {
  return (
    <div className="wrap gutter py-32 md:py-48">
      <p className="eyebrow text-bluetext">404</p>
      <h1 className="mt-4 text-[40px] md:text-[64px] font-extrabold tracking-tight leading-tight">찾을 수 없는 페이지예요</h1>
      <p className="mt-5 text-[18px] text-sub">주소가 바뀌었거나 없는 페이지예요. 프로젝트 목록에서 다시 골라 주세요.</p>
      <Link to="/#work" className="inline-block mt-8 px-6 py-3 rounded-full bg-ink text-white text-[16px] font-semibold">프로젝트 목록으로</Link>
    </div>
  )
}
