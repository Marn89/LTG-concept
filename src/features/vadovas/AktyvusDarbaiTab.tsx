import { Box, Stack, Typography, Chip, Divider } from '@mui/material'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined'
import { todayWorkerGroups } from './data'
import type { Status } from '../darbuotojas/data'

const statusLabel: Record<Status, string> = {
  done:        'Atlikta',
  in_progress: 'Vykdoma',
  pending:     'Laukia',
}

const statusColor: Record<Status, 'success' | 'warning' | 'default'> = {
  done:        'success',
  in_progress: 'warning',
  pending:     'default',
}

export function AktyvusDarbaiTab() {
  if (todayWorkerGroups.length === 0) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
        <Stack alignItems="center" justifyContent="center" spacing={1} sx={{ flex: 1 }}>
          <EventBusyOutlinedIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
          <Typography variant="body2" color="text.secondary">
            Aktyvių darbų nėra
          </Typography>
        </Stack>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      {todayWorkerGroups.map((group) => (
        <Box key={group.workerId}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {group.workerName}
            </Typography>
            <Divider sx={{ flex: 1 }} />
          </Stack>

          <Stack spacing={1}>
            {group.tasks.map((task) => (
              <Box
                key={task.id}
                sx={{
                  bgcolor: 'background.paper',
                  borderRadius: '8px',
                  border: 1,
                  borderColor: 'divider',
                  p: 2,
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                  <Typography variant="subtitle2" fontWeight={400} sx={{ flex: 1 }}>
                    {task.title}
                  </Typography>
                  <Chip
                    label={statusLabel[task.status]}
                    size="small"
                    color={statusColor[task.status]}
                    variant={task.status === 'done' ? 'filled' : 'outlined'}
                  />
                </Stack>

                <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <LocationOnOutlinedIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">{task.location}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <AccessTimeOutlinedIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">{task.time}</Typography>
                  </Stack>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>
      ))}
    </Box>
  )
}
