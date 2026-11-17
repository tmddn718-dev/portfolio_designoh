import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import CaseGeneric from './pages/CaseGeneric'
import CaseNodi from './pages/CaseNodi'
import CaseTrigr from './pages/CaseTrigr'
import About from './pages/About'
import NotFound from './pages/NotFound'

export default function App() {
  return (
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
  )
}
