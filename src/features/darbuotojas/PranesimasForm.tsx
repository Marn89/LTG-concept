import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePranesimai } from './PranesiamaiContext'
import { usePranesimasForm } from './PranesimasFormContext'
import {
  Box, Typography, Stack, IconButton, Button, Divider, TextField,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined'

const DEFAULT_LOCATION = { lat: 54.640204, lng: 25.227166 }

function FieldRow({ label, value, onClick }: {
  label: string
  value: string
  onClick?: () => void
}) {
  return (
    <Box
      onClick={onClick}
      sx={{
        px: 2, py: 1.5,
        display: 'flex', alignItems: 'center',
        cursor: 'pointer',
        '&:active': { bgcolor: 'action.hover' },
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.25 }}>
          {label}
        </Typography>
        <Typography variant="body2" color={value ? 'text.primary' : 'text.disabled'}>
          {value || 'Pasirinkti…'}
        </Typography>
      </Box>
      <ChevronRightIcon sx={{ fontSize: 20, color: 'text.disabled', flexShrink: 0 }} />
    </Box>
  )
}

interface Props {
  returnTo?: string
  basePath?: string
}

export function PranesimasForm({ returnTo = '/darbuotojas/pranesimai', basePath = '/darbuotojas/pranesimai/naujas' }: Props) {
  const navigate = useNavigate()
  const { addPranesimas } = usePranesimai()
  const { techObject, setTechObject, faultType, setFaultType } = usePranesimasForm()
  const [form, setForm] = useState({
    functionalLocation: 'Dūseikių gel. stotis',
    gpsCoordinates:     '55.978232, 22.460330',
    faultType:          '',
    notes:              '',
  })
  const [photos, setPhotos] = useState<string[]>([])

  const railImages = ['/images/railway-signal-snow.jpg']

  const addPhoto = () => {
    const next = railImages[photos.length % railImages.length]
    setPhotos(prev => [...prev, next])
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between"
        sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="subtitle1" fontWeight={600}>Sukurti pranešimą</Typography>
        <IconButton size="small" onClick={() => navigate(returnTo)}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Stack>

      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        <FieldRow label="Funkcinė lokacija" value={form.functionalLocation} />
        <Divider />
<FieldRow label="Techninis objektas" value={techObject} onClick={() => navigate(`${basePath}/techninis-objektas`)} />
        <Divider />
        <FieldRow label="Gedimo tipas"       value={faultType} onClick={() => navigate(`${basePath}/gedimo-tipas`)} />
        <Divider />

        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.75 }}>
            Papildoma informacija
          </Typography>
          <TextField
            fullWidth
            multiline
            minRows={3}
            placeholder="Įrašyti"
            value={form.notes}
            onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
            onFocus={() => { if (!form.notes) setForm(prev => ({ ...prev, notes: 'Dūseikių gel. blogas šviesaforo matomumas' })) }}
            sx={{ '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
          />
        </Box>

        <Divider />

        <Box sx={{ px: 2, py: 2 }}>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
            Nuotraukos
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
      </Box>

      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button variant="contained" fullWidth onClick={() => {
          addPranesimas({ ...form, techObject, faultType, location: DEFAULT_LOCATION, photos })
          setTechObject('')
          setFaultType('')
          navigate(returnTo)
        }}>
          Išsaugoti
        </Button>
      </Box>
    </Box>
  )
}
