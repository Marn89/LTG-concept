import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, IconButton, List, ListItemButton, ListItemText, Divider, TextField, InputAdornment } from '@mui/material'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import SearchIcon from '@mui/icons-material/Search'
import { TECH_OBJECTS } from './techObjects'
import { usePranesimasForm } from './PranesimasFormContext'

export function TechObjectTypeScreen() {
  const navigate = useNavigate()
  const { setTechObject } = usePranesimasForm()
  const [query, setQuery] = useState('')

  const filtered = query.trim()
    ? TECH_OBJECTS.filter(o => o.toLowerCase().includes(query.toLowerCase()))
    : TECH_OBJECTS

  const handleSelect = (label: string) => {
    setTechObject(label)
    navigate(-1)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <Stack direction="row" alignItems="center" sx={{ px: 1, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
        <IconButton size="small" onClick={() => navigate(-1)}>
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>
        <Typography variant="subtitle1" fontWeight={600} sx={{ ml: 1 }}>
          Techninis objektas
        </Typography>
      </Stack>

      <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
        <TextField
          fullWidth autoFocus size="small"
          placeholder="Ieškoti…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      <List sx={{ flex: 1, overflowY: 'auto', p: 0 }}>
        {filtered.map((label, i) => (
          <Box key={i}>
            {i > 0 && <Divider />}
            <ListItemButton onClick={() => handleSelect(label)}>
              <ListItemText primary={label} />
              <ChevronRightIcon sx={{ color: 'text.disabled' }} />
            </ListItemButton>
          </Box>
        ))}
      </List>
    </Box>
  )
}
