import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, IconButton, List, ListItemButton, ListItemText, Divider } from '@mui/material'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { FAULT_TYPES } from './faultTypes'
import { usePranesimasForm } from './PranesimasFormContext'

export function FaultTypeScreen() {
  const navigate = useNavigate()
  const { setFaultType } = usePranesimasForm()

  const handleSelect = (label: string) => {
    setFaultType(label)
    navigate(-1)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <Stack direction="row" alignItems="center" sx={{ px: 1, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
        <IconButton size="small" onClick={() => navigate(-1)}>
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>
        <Typography variant="subtitle1" fontWeight={600} sx={{ ml: 1 }}>
          Gedimo tipas
        </Typography>
      </Stack>

      <List sx={{ flex: 1, overflowY: 'auto', p: 0 }}>
        {FAULT_TYPES.map((label, i) => (
          <Box key={label}>
            {i > 0 && <Divider />}
            <ListItemButton onClick={() => handleSelect(label)}>
              <ListItemText primary={label} />
            </ListItemButton>
          </Box>
        ))}
      </List>
    </Box>
  )
}
