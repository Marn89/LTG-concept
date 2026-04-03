import { Box, Typography, Stack, IconButton, Divider, Button } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { useNavigate, useParams } from 'react-router-dom'
import { usePranesimai } from './PranesiamaiContext'
import { LocationMap } from '../../components/LocationMap'

export function PranesimasDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { pranesimai, removePranesimas } = usePranesimai()
  const p = pranesimai.find(n => n.id === id)

  const fields = p ? [
    { label: 'Description',            value: p.description },
    { label: 'Category',               value: p.category },
    { label: 'Equipment',              value: p.equipment },
    { label: 'Planning Plant',         value: p.planningPlant },
    { label: 'Functional Location',    value: p.functionalLocation },
    { label: 'Maintenance Plant',      value: p.maintenancePlant },
    { label: 'Malfunction Start Time', value: p.malfunctionTime },
  ] : []

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="subtitle1" fontWeight={600}>
          Pranešimas
        </Typography>
        <IconButton size="small" onClick={() => navigate(-1)}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Stack>

      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        {fields.map((field, i) => (
          <Box key={field.label}>
            <Box sx={{ px: 2, py: 2 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                {field.label}
              </Typography>
              <Typography variant="body1">
                {field.value || '—'}
              </Typography>
            </Box>
            {i < fields.length - 1 && <Divider />}
          </Box>
        ))}

        {p && (
          <>
            <Divider />
            <Box sx={{ px: 2, pt: 1.5, pb: 2 }}>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                GPS vieta
              </Typography>
              <LocationMap location={p.location} />
            </Box>
          </>
        )}

        {p && p.photos.length > 0 && (
          <>
            <Divider />
            <Box sx={{ px: 2, pt: 1.5, pb: 2 }}>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                Nuotraukos
              </Typography>
              <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 0.5 }}>
                {p.photos.map((src, i) => (
                  <Box
                    key={i}
                    component="img"
                    src={src}
                    sx={{ width: 160, height: 120, borderRadius: '8px', flexShrink: 0, objectFit: 'cover' }}
                  />
                ))}
              </Stack>
            </Box>
          </>
        )}
      </Box>

      <Stack spacing={1} sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button variant="outlined" fullWidth startIcon={<EditOutlinedIcon />} onClick={() => navigate(-1)}>
          Redaguoti
        </Button>
        <Button
          variant="outlined"
          color="error"
          fullWidth
          startIcon={<DeleteOutlineIcon />}
          onClick={() => { removePranesimas(id!); navigate(-1) }}
        >
          Išstrinti pranešimą
        </Button>
      </Stack>
    </Box>
  )
}
