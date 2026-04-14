import { Box, Stack, Typography, IconButton } from '@mui/material'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import { useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'

export function WebAppShell({ children, headerActions }: { children: ReactNode; headerActions?: ReactNode }) {
  const navigate = useNavigate()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', bgcolor: 'background.default' }}>
      <Box sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider', flexShrink: 0, px: 3, py: 1.5 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1.5} onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>
            <Box component="img" src="/images/ltg-logo.png" alt="LTG" sx={{ width: 36, height: 36, objectFit: 'contain' }} />
            <Typography variant="subtitle1" fontWeight={700}>LTG Infra</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            {headerActions}
            <IconButton size="small">
              <SettingsOutlinedIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>
      </Box>

      <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {children}
      </Box>
    </Box>
  )
}
