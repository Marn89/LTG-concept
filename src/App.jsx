import { Routes, Route } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { DarbuotojasPage } from './pages/DarbuotojasPage'
import { VadovasPage } from './pages/VadovasPage'
import { UzduotisDetailPage } from './pages/UzduotisDetailPage'
import { PranesimasFormPage } from './pages/PranesimasFormPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/darbuotojas" element={<DarbuotojasPage />} />
      <Route path="/darbuotojas/uzduotis/:id" element={<UzduotisDetailPage />} />
      <Route path="/darbuotojas/pranesimai/naujas" element={<PranesimasFormPage />} />
      <Route path="/vadovas" element={<VadovasPage />} />
    </Routes>
  )
}
