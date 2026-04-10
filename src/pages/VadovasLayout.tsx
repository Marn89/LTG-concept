import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { IconButton } from '@mui/material'
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined'
import TableRowsOutlinedIcon from '@mui/icons-material/TableRowsOutlined'
import ViewKanbanOutlinedIcon from '@mui/icons-material/ViewKanbanOutlined'
import { WebAppShell } from '../layout/WebAppShell'

export type VadovasViewMode = 'list' | 'table' | 'kanban'

export function VadovasLayout() {
  const [viewMode, setViewMode] = useState<VadovasViewMode>('table')
  const [showMap, setShowMap] = useState(true)

  const headerActions = (
    <>
      <IconButton size="small" onClick={() => setViewMode('list')} sx={{ color: viewMode === 'list' ? 'primary.main' : 'text.secondary' }}>
        <FormatListBulletedOutlinedIcon fontSize="small" />
      </IconButton>
      <IconButton size="small" onClick={() => setViewMode('table')} sx={{ color: viewMode === 'table' ? 'primary.main' : 'text.secondary' }}>
        <TableRowsOutlinedIcon fontSize="small" />
      </IconButton>
      <IconButton size="small" onClick={() => setViewMode('kanban')} sx={{ color: viewMode === 'kanban' ? 'primary.main' : 'text.secondary' }}>
        <ViewKanbanOutlinedIcon fontSize="small" />
      </IconButton>
    </>
  )

  return (
    <WebAppShell headerActions={headerActions}>
      <Outlet context={{ viewMode, showMap, setShowMap }} />
    </WebAppShell>
  )
}
