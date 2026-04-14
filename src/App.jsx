import { Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { DarbuotojasPage } from './pages/DarbuotojasPage'
import { VadovasLayout } from './pages/VadovasLayout'
import { VadovasPage } from './pages/VadovasPage'
import { DarboUzsakymasFormPage } from './pages/DarboUzsakymasFormPage'
import { WorkerSelectPage } from './pages/WorkerSelectPage'
import { EquipmentSelectPage } from './pages/EquipmentSelectPage'
import { StatusSelectPage } from './pages/StatusSelectPage'
import { DateSelectPage } from './pages/DateSelectPage'
import { UzduotisDetailPage } from './pages/UzduotisDetailPage'
import { PranesimasFormPage } from './pages/PranesimasFormPage'
import { PranesimasDetailPage } from './pages/PranesimasDetailPage'
import { TechObjectTypePage } from './pages/TechObjectTypePage'
import { TechObjectItemPage } from './pages/TechObjectItemPage'
import { FaultTypePage } from './pages/FaultTypePage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/darbuotojas" element={<Navigate to="/darbuotojas/mano-uzduotys" replace />} />
      <Route path="/darbuotojas/mano-uzduotys" element={<DarbuotojasPage />} />
      <Route path="/darbuotojas/pranesimai" element={<DarbuotojasPage />} />
      <Route path="/darbuotojas/uzduotis/:id" element={<UzduotisDetailPage />} />
      <Route path="/darbuotojas/pranesimai/naujas" element={<PranesimasFormPage />} />
      <Route path="/darbuotojas/pranesimai/naujas/techninis-objektas" element={<TechObjectTypePage />} />
      <Route path="/darbuotojas/pranesimai/naujas/techninis-objektas/:typeId" element={<TechObjectItemPage />} />
      <Route path="/darbuotojas/pranesimai/naujas/gedimo-tipas" element={<FaultTypePage />} />
      <Route path="/darbuotojas/pranesimai/:id" element={<PranesimasDetailPage />} />

      <Route path="/vadovas" element={<VadovasLayout />}>
        <Route index element={<VadovasPage />} />
        <Route path="pranesimai/:id" element={<VadovasPage />} />
        <Route path="pranesimai/:id/uzsakymas" element={<DarboUzsakymasFormPage />} />
        <Route path="pranesimai/:id/uzsakymas/darbuotojai" element={<WorkerSelectPage />} />
        <Route path="pranesimai/:id/uzsakymas/iranga" element={<EquipmentSelectPage />} />
        <Route path="pranesimai/:id/uzsakymas/statusas" element={<StatusSelectPage />} />
        <Route path="pranesimai/:id/uzsakymas/data" element={<DateSelectPage />} />
      </Route>
    </Routes>
  )
}
