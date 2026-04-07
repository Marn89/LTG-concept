import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Box, BottomNavigation, BottomNavigationAction } from '@mui/material'
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined'
import EngineeringOutlinedIcon from '@mui/icons-material/EngineeringOutlined'
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined'
import { MobileShell } from '../layout/MobileShell'
import { PranesimuValdymasTab } from '../features/vadovas/PranesimuValdymasTab'
import { AktyvusDarbaiTab } from '../features/vadovas/AktyvusDarbaiTab'
import { AdministravimasTab } from '../features/vadovas/AdministravimasTab'

export function VadovasPage() {
  const location = useLocation()
  const [tab, setTab] = useState(() => Number(new URLSearchParams(location.search).get('tab') ?? 0))

  return (
    <MobileShell>
      <Box sx={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {tab === 0 && <PranesimuValdymasTab />}
        {tab === 1 && <AktyvusDarbaiTab />}
        {tab === 2 && <AdministravimasTab />}
      </Box>

      <BottomNavigation
        value={tab}
        onChange={(_, newValue) => setTab(newValue)}
        showLabels
        sx={{ flexShrink: 0, borderTop: 1, borderColor: 'divider' }}
      >
        <BottomNavigationAction label="Pranešimai" icon={<NotificationsOutlinedIcon />} />
        <BottomNavigationAction label="Darbo užsakymai (WO)" icon={<EngineeringOutlinedIcon />} />
        <BottomNavigationAction label="Administravimas"    icon={<TuneOutlinedIcon />} />
      </BottomNavigation>
    </MobileShell>
  )
}
