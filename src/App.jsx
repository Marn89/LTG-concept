import { Routes, Route } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { DarbuotojasPage } from './pages/DarbuotojasPage'
import { VadovasPage } from './pages/VadovasPage'
import { VadovasPranesimasDetailPage } from './pages/VadovasPranesimasDetailPage'
import { DarboUzsakymasFormPage } from './pages/DarboUzsakymasFormPage'
import { WorkerSelectPage } from './pages/WorkerSelectPage'
import { EquipmentSelectPage } from './pages/EquipmentSelectPage'
import { StatusSelectPage } from './pages/StatusSelectPage'
import { DateSelectPage } from './pages/DateSelectPage'
import { UzduotisDetailPage } from './pages/UzduotisDetailPage'
import { PranesimasFormPage } from './pages/PranesimasFormPage'
import { PranesimasDetailPage } from './pages/PranesimasDetailPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/darbuotojas" element={<DarbuotojasPage />} />
      <Route path="/darbuotojas/uzduotis/:id" element={<UzduotisDetailPage />} />
      <Route path="/darbuotojas/pranesimai/naujas" element={<PranesimasFormPage />} />
      <Route path="/darbuotojas/pranesimai/:id" element={<PranesimasDetailPage />} />
      <Route path="/vadovas" element={<VadovasPage />} />
      <Route path="/vadovas/pranesimai/:id" element={<VadovasPranesimasDetailPage />} />
      <Route path="/vadovas/pranesimai/:id/uzsakymas" element={<DarboUzsakymasFormPage />} />
      <Route path="/vadovas/pranesimai/:id/uzsakymas/darbuotojai" element={<WorkerSelectPage />} />
      <Route path="/vadovas/pranesimai/:id/uzsakymas/iranga" element={<EquipmentSelectPage />} />
      <Route path="/vadovas/pranesimai/:id/uzsakymas/statusas" element={<StatusSelectPage />} />
      <Route path="/vadovas/pranesimai/:id/uzsakymas/data" element={<DateSelectPage />} />
    </Routes>
  )
}
