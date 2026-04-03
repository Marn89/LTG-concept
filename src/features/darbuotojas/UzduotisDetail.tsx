import { Box, Typography, Stack, IconButton, Divider, Button } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { tasksByOffset } from './data'

export function UzduotisDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const offset = Number(searchParams.get('offset') ?? 0)

  const task = (tasksByOffset[offset] ?? tasksByOffset[0]).find(t => t.id === id)
  const d = task?.detail

  const fields = d ? [
    { label: 'Description',            value: d.description },
    { label: 'Notification ID',        value: d.notificationId },
    { label: 'Notification Date',      value: d.notificationDate },
    { label: 'Planning Plant',         value: d.planningPlant },
    { label: 'Functional Location',    value: d.functionalLocation },
    { label: 'Maintenance Plant',      value: d.maintenancePlant },
    { label: 'Equipment',              value: d.equipment },
    { label: 'Malfunction Date',       value: d.malfunctionDate },
    { label: 'Malfunction Start Time', value: d.malfunctionStartTime },
  ] : []

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="subtitle1" fontWeight={600}>
          Užduotis
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
                {field.value}
              </Typography>
            </Box>
            {i < fields.length - 1 && <Divider />}
          </Box>
        ))}

        <Divider />
        <Box sx={{ px: 2, pt: 1.5, pb: 2 }}>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
            Nuotraukos
          </Typography>
          <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 0.5 }}>
            {[1, 2, 3].map((n) => (
              <Box
                key={n}
                component="img"
                src={`/images/task-${n}.jpg`}
                sx={{ width: 160, height: 120, borderRadius: '8px', flexShrink: 0, objectFit: 'cover' }}
              />
            ))}
          </Stack>
        </Box>
      </Box>

      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button variant="contained" fullWidth>
          Atlikta
        </Button>
      </Box>
    </Box>
  )
}
