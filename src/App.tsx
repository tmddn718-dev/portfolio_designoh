import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'

const Home = lazy(() => import('./pages/Home'))
const CaseGeneric = lazy(() => import('./pages/CaseGeneric'))
const CaseNodi = lazy(() => import('./pages/CaseNodi'))
const CaseTrigr = lazy(() => import('./pages/CaseTrigr'))
const About = lazy(() => import('./pages/About'))
const NotFound = lazy(() => import('./pages/NotFound'))

export default function App() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#10110F]" role="status"><span className="sr-only">페이지 불러오는 중</span></div>}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="work/nodi" element={<CaseNodi />} />
          <Route path="work/trigr" element={<CaseTrigr />} />
          <Route path="work/:slug" element={<CaseGeneric />} />
          <Route path="about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
