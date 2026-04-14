import { useNavigate } from 'react-router-dom'
import { Box, Stack, Typography, IconButton, List, ListItemButton, ListItemText } from '@mui/material'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import CheckIcon from '@mui/icons-material/Check'
import { useWoForm } from './WoFormContext'
import { NOW } from '../../utils/now'

function generateDays(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(NOW)
    d.setDate(d.getDate() + i)
    return d.toISOString().slice(0, 10)
  })
}

const days = generateDays(14)

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('lt-LT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

export function DateSelectScreen() {
  const navigate = useNavigate()
  const { completionDate, setCompletionDate } = useWoForm()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <Stack direction="row" alignItems="center" sx={{ px: 1, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
        <IconButton size="small" onClick={() => navigate(-1)}>
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>
        <Typography variant="subtitle1" fontWeight={600} sx={{ ml: 1 }}>
          Darbo atlikimo diena
        </Typography>
      </Stack>

      <List sx={{ flex: 1, overflowY: 'auto', p: 0 }}>
        {days.map(day => (
          <ListItemButton
            key={day}
            onClick={() => { setCompletionDate(day); navigate(-1) }}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <ListItemText
              primary={formatDate(day)}
              primaryTypographyProps={{ sx: { textTransform: 'capitalize' } }}
            />
            {completionDate === day && <CheckIcon fontSize="small" color="primary" />}
          </ListItemButton>
        ))}
      </List>
    </Box>
  )
}
