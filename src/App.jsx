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
import { PlanuotojasPage } from './pages/PlanuotojasPage'
import { PlanuotojasV2Page } from './pages/PlanuotojasV2Page'
import { UzduotysPage } from './pages/UzduotysPage'
import { ObjektaiPage } from './pages/ObjektaiPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/vadovas" replace />} />
      <Route path="/planuotojas" element={<PlanuotojasPage />} />
      <Route path="/planuotojas/naujas" element={<PlanuotojasPage />} />
      <Route path="/planuotojas/naujas-v2" element={<PlanuotojasV2Page />} />
      <Route path="/planuotojas/redaguoti-v2/:id" element={<PlanuotojasV2Page />} />
      <Route path="/planuotojas/uzduotys" element={<UzduotysPage />} />
      <Route path="/objektai" element={<Navigate to="/objektai/darbai" replace />} />
      <Route path="/objektai/:tabSlug" element={<ObjektaiPage />} />
      <Route path="/planuotojas/:planId" element={<PlanuotojasPage />} />
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
