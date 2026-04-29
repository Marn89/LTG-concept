import { Box, Stack, Typography, IconButton, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined'
import { useNavigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'

const NAV_ITEMS = [
  { label: 'Planavimas', path: '/planuotojas', icon: <EventNoteOutlinedIcon fontSize="small" /> },
  { label: 'Darbo užsakymai', path: '/vadovas', icon: <AssignmentOutlinedIcon fontSize="small" /> },
  { label: 'Objektai', path: '/objektai', icon: <ApartmentOutlinedIcon fontSize="small" /> },
]

export function WebAppShell({ children, headerActions }: { children: ReactNode; headerActions?: ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()

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

      <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'row' }}>
        <Box sx={{
          width: 210, flexShrink: 0,
          borderRight: 1, borderColor: 'divider',
          bgcolor: 'background.paper',
          display: 'flex', flexDirection: 'column',
          py: 1,
        }}>
          <List dense disablePadding>
            {NAV_ITEMS.map(item => {
              const active = location.pathname.startsWith(item.path)
              return (
                <ListItemButton
                  key={item.path}
                  selected={active}
                  onClick={() => navigate(item.path)}
                  sx={{ borderRadius: 1, mx: 1, mb: 0.5 }}
                >
                  <ListItemIcon sx={{ minWidth: 32, color: active ? 'primary.main' : 'text.secondary' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ variant: 'body2', fontWeight: active ? 600 : 400 }}
                  />
                </ListItemButton>
              )
            })}
          </List>
        </Box>

        <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          {children}
        </Box>
      </Box>
    </Box>
  )
}
