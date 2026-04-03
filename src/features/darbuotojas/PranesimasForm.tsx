import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePranesimai } from './PranesiamaiContext'
import {
  Box, Typography, Stack, IconButton, Button,
  FormControl, InputLabel, Select, MenuItem, Divider,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined'

const options = {
  description: [
    'Bėgių apžiūra',
    'Iešmo patikrinimas',
    'Signalo lempos keitimas',
    'Kontaktinio tinklo apžiūra',
    'Transformatoriaus patikrinimas',
    'Perjungiklio remontas',
    'Ryšio įrangos apžiūra',
    'Semaforo lempos keitimas',
  ],
  planningPlant: ['DA01', 'DA02', 'DA03'],
  functionalLocation: [
    'LG-L01-000GIR-AELS',
    'LG-L01-012500-SWCH',
    'LG-L02-000KAU-SWTS',
    'LG-L02-000VIL-TRNS',
    'LG-L03-000VIL-SIGS',
    'LG-L03-000KAI-COMM',
    'LG-L03-000NVL-SGLT',
  ],
  maintenancePlant: ['DP03', 'DP04', 'DP05'],
  equipment: [
    '10097086',
    '10103421',
    '10089234',
    '10091122',
    '10094455',
    '10088771',
    '10096312',
    '10101567',
  ],
}

export function PranesimasForm() {
  const navigate = useNavigate()
  const { addPranesimas } = usePranesimai()
  const [form, setForm] = useState({
    description:       '',
    planningPlant:     '',
    functionalLocation:'',
    maintenancePlant:  '',
    equipment:         '',
    malfunctionTime:   '',
  })
  const [photos, setPhotos] = useState<string[]>([])

  const set = (field: string) => (e: any) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  const railImages = ['/images/task-1.jpg', '/images/task-2.jpg', '/images/task-3.jpg']

  const addPhoto = () => {
    const next = railImages[photos.length % railImages.length]
    setPhotos(prev => [...prev, next])
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 1, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
        <IconButton size="small" onClick={() => navigate(-1)}>
          <ArrowBackIcon fontSize="small" />
        </IconButton>
        <Typography variant="subtitle1" fontWeight={600}>
          Naujas pranešimas
        </Typography>
      </Stack>

      <Box sx={{ flex: 1, overflowY: 'auto', px: 2, py: 2 }}>
        <Stack spacing={2.5}>

          <FormControl fullWidth size="small">
            <InputLabel>Description</InputLabel>
            <Select value={form.description} label="Description" onChange={set('description')}>
              {options.description.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Planning Plant</InputLabel>
            <Select value={form.planningPlant} label="Planning Plant" onChange={set('planningPlant')}>
              {options.planningPlant.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Functional Location</InputLabel>
            <Select value={form.functionalLocation} label="Functional Location" onChange={set('functionalLocation')}>
              {options.functionalLocation.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Maintenance Plant</InputLabel>
            <Select value={form.maintenancePlant} label="Maintenance Plant" onChange={set('maintenancePlant')}>
              {options.maintenancePlant.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Equipment</InputLabel>
            <Select value={form.equipment} label="Equipment" onChange={set('equipment')}>
              {options.equipment.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel shrink>Malfunction Start (Time)</InputLabel>
            <Select
              value={form.malfunctionTime}
              label="Malfunction Start (Time)"
              displayEmpty
              renderValue={v => v || ''}
              onChange={set('malfunctionTime')}
            >
              {['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
                '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map(t => (
                <MenuItem key={t} value={t}>{t}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Divider />

          <Box>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Attach pictures
            </Typography>
            <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 0.5 }}>
              {photos.map((src, i) => (
                <Box
                  key={i}
                  component="img"
                  src={src}
                  sx={{ width: 80, height: 80, borderRadius: '8px', flexShrink: 0, objectFit: 'cover' }}
                />
              ))}
              <Box
                onClick={addPhoto}
                sx={{
                  width: 80, height: 80, borderRadius: '8px', flexShrink: 0,
                  border: 1, borderColor: 'divider', borderStyle: 'dashed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: 'text.disabled',
                  '&:active': { opacity: 0.7 },
                }}
              >
                <AddPhotoAlternateOutlinedIcon />
              </Box>
            </Stack>
          </Box>

        </Stack>
      </Box>

      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button variant="contained" fullWidth onClick={() => {
          addPranesimas({ ...form, photos })
          navigate(-1)
        }}>
          Išsaugoti
        </Button>
      </Box>
    </Box>
  )
}
