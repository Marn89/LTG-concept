import { useNavigate } from 'react-router-dom'
import { Box, Stack, Typography, IconButton, List, ListItemButton, ListItemText, Checkbox, Button, Divider } from '@mui/material'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { useWoForm } from './WoFormContext'

const groups = [
  {
    role: 'Tech priežiūros vadovas',
    members: [
      'Tomas Paulauskas',
      'Mindaugas Žukauskas',
      'Darius Černiauskas',
    ],
  },
  {
    role: 'Tech darbuotojas',
    members: [
      'Aleksas Jonaitis',
      'Petras Kazlauskas',
      'Jonas Stankevičius',
      'Gintaras Mackevičius',
      'Valdas Urbonas',
      'Rimas Jankauskas',
      'Saulius Petrauskas',
      'Aurimas Navickas',
      'Kęstutis Mockus',
      'Andrius Butkus',
      'Linas Grigas',
      'Vytautas Šimkus',
    ],
  },
]

export function WorkerSelectScreen() {
  const navigate = useNavigate()
  const { selectedWorkers, setSelectedWorkers } = useWoForm()

  const toggle = (name: string) =>
    setSelectedWorkers(
      selectedWorkers.includes(name)
        ? selectedWorkers.filter(w => w !== name)
        : [...selectedWorkers, name]
    )

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <Stack direction="row" alignItems="center" sx={{ px: 1, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
        <IconButton size="small" onClick={() => navigate(-1)}>
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>
        <Typography variant="subtitle1" fontWeight={600} sx={{ ml: 1 }}>
          Priskirti darbuotojus
        </Typography>
      </Stack>

      <List sx={{ flex: 1, overflowY: 'auto', p: 0 }}>
        {groups.map((group, gi) => (
          <Box key={group.role}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 2, py: 1 }}>
              <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, whiteSpace: 'nowrap' }}>
                {group.role}
              </Typography>
              <Divider sx={{ flex: 1 }} />
            </Stack>
            {group.members.map(name => (
              <ListItemButton
                key={name}
                onClick={() => toggle(name)}
                sx={{ borderBottom: 1, borderColor: 'divider' }}
              >
                <ListItemText primary={name} />
                <Checkbox edge="end" checked={selectedWorkers.includes(name)} disableRipple tabIndex={-1} />
              </ListItemButton>
            ))}
          </Box>
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
