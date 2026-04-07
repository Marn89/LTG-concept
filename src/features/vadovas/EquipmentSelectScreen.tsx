import { useNavigate } from 'react-router-dom'
import { Box, Stack, Typography, IconButton, Button, List, ListItemButton, ListItemText, Checkbox } from '@mui/material'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { useWoForm } from './WoFormContext'

const equipment = [
  '10097086', '10103421', '10089234',
  '10091122', '10094455', '10088771', '10096312', '10101567',
]

export function EquipmentSelectScreen() {
  const navigate = useNavigate()
  const { selectedEquipment, setSelectedEquipment } = useWoForm()
  const selected = selectedEquipment ? selectedEquipment.split(',') : []

  const toggle = (eq: string) => {
    const next = selected.includes(eq)
      ? selected.filter(e => e !== eq)
      : [...selected, eq]
    setSelectedEquipment(next.join(','))
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <Stack direction="row" alignItems="center" sx={{ px: 1, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
        <IconButton size="small" onClick={() => navigate(-1)}>
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>
        <Typography variant="subtitle1" fontWeight={600} sx={{ ml: 1 }}>
          Pridėti įrangą
        </Typography>
      </Stack>

      <List sx={{ flex: 1, overflowY: 'auto', p: 0 }}>
        {equipment.map(eq => (
          <ListItemButton
            key={eq}
            onClick={() => toggle(eq)}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <ListItemText primary={eq} />
            <Checkbox edge="end" checked={selected.includes(eq)} disableRipple tabIndex={-1} />
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button variant="contained" fullWidth onClick={() => navigate(-1)}>
          Patvirtinti
        </Button>
      </Box>
    </Box>
  )
}
