import { useNavigate } from 'react-router-dom'
import { Box, Stack, Typography, IconButton, List, ListItem, ListItemText } from '@mui/material'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import CheckIcon from '@mui/icons-material/Check'
import { useWoForm } from './WoFormContext'

const statusOptions = [
  { value: 'ctrd_prel', label: 'CTRD/PREL' },
  { value: 'rel',       label: 'REL' },
  { value: 'msgs',      label: 'MSGS' },
  { value: 'tech',      label: 'TECH' },
]

export function StatusSelectScreen() {
  const navigate = useNavigate()
  const { status, setStatus } = useWoForm()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <Stack direction="row" alignItems="center" sx={{ px: 1, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
        <IconButton size="small" onClick={() => navigate(-1)}>
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>
        <Typography variant="subtitle1" fontWeight={600} sx={{ ml: 1 }}>
          Pasirinkti statusą
        </Typography>
      </Stack>

      <List sx={{ flex: 1, overflowY: 'auto', p: 0 }}>
        {statusOptions.map(s => (
          <ListItem
            key={s.value}
            onClick={() => { setStatus(s.value); navigate(-1) }}
            sx={{ cursor: 'pointer', borderBottom: 1, borderColor: 'divider', '&:active': { opacity: 0.6 } }}
            secondaryAction={
              status === s.value
                ? <CheckIcon fontSize="small" color="primary" />
                : null
            }
          >
            <ListItemText primary={s.label} />
          </ListItem>
        ))}
      </List>
    </Box>
  )
}
