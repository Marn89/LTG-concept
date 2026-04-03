import { useState } from 'react'
import { Box, BottomNavigation, BottomNavigationAction } from '@mui/material'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined'
import { MobileShell } from '../layout/MobileShell'
import { UzduotysTab } from '../features/darbuotojas/UzduotysTab'
import { PranesimaTab } from '../features/darbuotojas/PranesimaTab'

export function DarbuotojasPage() {
  const [tab, setTab] = useState(0)

  return (
    <MobileShell>
      <Box sx={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {tab === 0 ? <UzduotysTab /> : <PranesimaTab />}
      </Box>

      <BottomNavigation
        value={tab}
        onChange={(_, newValue) => setTab(newValue)}
        showLabels
        sx={{ flexShrink: 0, borderTop: 1, borderColor: 'divider' }}
      >
        <BottomNavigationAction label="Užduotys"   icon={<AssignmentOutlinedIcon />} />
        <BottomNavigationAction label="Pranešimai" icon={<NotificationsOutlinedIcon />} />
      </BottomNavigation>
    </MobileShell>
  )
}
