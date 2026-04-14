import { useNavigate, useLocation } from 'react-router-dom'
import { Box, BottomNavigation, BottomNavigationAction, Button } from '@mui/material'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { MobileShell } from '../layout/MobileShell'
import { UzduotysTab } from '../features/darbuotojas/UzduotysTab'
import { PranesimaTab } from '../features/darbuotojas/PranesimaTab'

export function DarbuotojasPage() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const tab = pathname === '/darbuotojas/pranesimai' ? 1 : 0

  return (
    <MobileShell>
      <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 100 }}>
        <Button
          size="small"
          variant="outlined"
          endIcon={<OpenInNewIcon sx={{ fontSize: '12px !important' }} />}
          onClick={() => navigate('/vadovas')}
          sx={{ fontSize: '0.65rem', py: 0.25, px: 1, minWidth: 0, borderRadius: '999px', textTransform: 'none', bgcolor: 'background.paper' }}
        >
          Vadovas
        </Button>
      </Box>
      <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {tab === 0 ? <UzduotysTab /> : <PranesimaTab />}
      </Box>

      <BottomNavigation
        value={tab}
        onChange={(_, newValue) => navigate(newValue === 1 ? '/darbuotojas/pranesimai' : '/darbuotojas/mano-uzduotys')}
        showLabels
        sx={{ flexShrink: 0, borderTop: 1, borderColor: 'divider' }}
      >
        <BottomNavigationAction label="Mano užduotys" icon={<AssignmentOutlinedIcon />} />
        <BottomNavigationAction label="Pranešimai"    icon={<NotificationsOutlinedIcon />} />
      </BottomNavigation>
    </MobileShell>
  )
}
