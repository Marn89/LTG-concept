import { Box, Typography, Stack, Button } from '@mui/material'
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined'
import { useNavigate } from 'react-router-dom'
import { usePranesimai } from './PranesiamaiContext'

export function PranesimaTab() {
  const navigate = useNavigate()
  const { pranesimai } = usePranesimai()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      {pranesimai.length === 0 ? (
        <Stack alignItems="center" justifyContent="center" spacing={1} sx={{ flex: 1 }}>
          <NotificationsOutlinedIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
          <Typography variant="body2" color="text.secondary">
            Pranešimų nėra
          </Typography>
        </Stack>
      ) : (
        <Stack spacing={1} sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
          {pranesimai.map((p) => (
            <Box
              key={p.id}
              sx={{
                bgcolor: 'background.paper',
                borderRadius: '8px',
                border: 1,
                borderColor: 'divider',
                p: 2,
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                <Typography variant="subtitle2" fontWeight={400} sx={{ flex: 1 }}>
                  {p.description || '—'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {p.createdAt}
                </Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                {p.functionalLocation || p.equipment}
              </Typography>
            </Box>
          ))}
        </Stack>
      )}

      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button variant="contained" fullWidth onClick={() => navigate('/darbuotojas/pranesimai/naujas')}>
          Sukurti pranešimą
        </Button>
      </Box>
    </Box>
  )
}
