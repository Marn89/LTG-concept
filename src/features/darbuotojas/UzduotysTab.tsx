import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Chip, Divider } from '@mui/material'
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'
import { tasksByOffset, type Status } from './data'

const DAY_ABBR = ['Sek.', 'Pir.', 'Antr.', 'Treč.', 'Ketv.', 'Penkt.', 'Šeš.']

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


export function UzduotysTab() {
  const [offset, setOffset] = useState(0)
  const navigate = useNavigate()
  const tasks = tasksByOffset[offset] ?? []

  const today = useMemo(() => new Date(), [])
  const todayDow = today.getDay()
  const mondayOffset = todayDow === 0 ? -6 : 1 - todayDow

  const weekDays = useMemo(() =>
    Array.from({ length: 7 }, (_, i) => {
      const off = mondayOffset + i
      const d = new Date(today)
      d.setDate(today.getDate() + off)
      return { offset: off, dayNum: d.getDate(), abbr: DAY_ABBR[d.getDay()] }
    }), [today, mondayOffset])

  const heading = offset === 0 ? 'Šiandienos užduotys'
    : offset === -1 ? 'Vakardienos užduotys'
    : offset === 1  ? 'Rytojaus užduotys'
    : (() => { const d = new Date(today); d.setDate(today.getDate() + offset); return d.toLocaleDateString('lt-LT', { month: 'long', day: 'numeric' }) })()

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <Stack direction="row" sx={{ mb: 1.5, gap: 0.5 }}>
        {weekDays.map(day => {
          const isSelected = day.offset === offset
          const isToday = day.offset === 0
          return (
            <Box
              key={day.offset}
              onClick={() => setOffset(day.offset)}
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                py: 0.75,
                borderRadius: '8px',
                cursor: 'pointer',
                bgcolor: isSelected ? 'primary.main' : 'transparent',
                color: isSelected ? 'primary.contrastText' : isToday ? 'primary.main' : 'text.primary',
                '&:active': { opacity: 0.7 },
              }}
            >
              <Typography variant="caption" fontWeight={isToday && !isSelected ? 700 : 400} lineHeight={1.2}>
                {day.abbr}
              </Typography>
              <Typography variant="caption" fontWeight={600} lineHeight={1.4}>
                {day.dayNum}
              </Typography>
            </Box>
          )
        })}
      </Stack>

      <Divider sx={{ mb: 1.5, mx: -2 }} />
      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>
        {heading}
      </Typography>

      {tasks.length === 0 && (
        <Stack alignItems="center" justifyContent="center" spacing={1} sx={{ flex: 1 }}>
          <EventBusyOutlinedIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
          <Typography variant="body2" color="text.secondary">
            Užduočių nėra
          </Typography>
        </Stack>
      )}

      <Stack spacing={1}>
        {tasks.map((task) => (
          <Box
            key={task.id}
            onClick={() => navigate(`/darbuotojas/uzduotis/${task.id}?offset=${offset}`)}
            sx={{
              bgcolor: 'background.paper',
              borderRadius: '8px',
              border: 1,
              borderColor: 'divider',
              p: 2,
              cursor: 'pointer',
              '&:active': { opacity: 0.7 },
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
  )
}
