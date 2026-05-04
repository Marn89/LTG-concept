import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { WebAppShell } from '../layout/WebAppShell'

export type VadovasViewMode = 'list' | 'table' | 'kanban'

export function VadovasLayout() {
  const [viewMode, setViewMode] = useState<VadovasViewMode>('table')
  const [showMap, setShowMap] = useState(false)

  return (
    <WebAppShell>
      <Outlet context={{ viewMode, showMap, setShowMap }} />
    </WebAppShell>
  )
}
