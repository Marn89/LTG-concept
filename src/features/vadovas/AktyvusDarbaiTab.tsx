import { useState } from 'react'
import { Box, Stack, Typography, Chip, Divider, IconButton, Menu, MenuItem } from '@mui/material'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined'
import SwapVertOutlinedIcon from '@mui/icons-material/SwapVertOutlined'
import { useWo } from './WoContext'
import type { WoStatus } from '../darbuotojas/data'

const statusLabel: Record<WoStatus, string> = {
  ctrd_prel: 'CTRD/PREL',
  rel:       'REL',
  msgs:      'MSGS',
  tech:      'TECH',
}

const statusColor: Record<WoStatus, 'error' | 'default'> = {
  ctrd_prel: 'default',
  rel:       'default',
  msgs:      'error',
  tech:      'default',
}

const statusOrder: Record<WoStatus, number> = {
  msgs: 0, ctrd_prel: 1, rel: 2, tech: 3,
}

const SORT_OPTIONS = [
  { value: 'status',      label: 'Statusas' },
  { value: 'worker_asc',  label: 'Darbuotojas (A–Z)' },
  { value: 'worker_desc', label: 'Darbuotojas (Z–A)' },
  { value: 'date_desc',   label: 'Data (naujausi pirma)' },
  { value: 'date_asc',    label: 'Data (seniausi pirma)' },
]

export function AktyvusDarbaiTab() {
  const [sort, setSort] = useState('date_desc')
  const [anchor, setAnchor] = useState<null | HTMLElement>(null)
  const { workOrders } = useWo()

  const allTasks = workOrders

  const sorted = [...allTasks].sort((a, b) => {
    if (sort === 'status')      return statusOrder[a.status] - statusOrder[b.status]
    if (sort === 'worker_asc')  return a.workerName.localeCompare(b.workerName)
    if (sort === 'worker_desc') return b.workerName.localeCompare(a.workerName)
    if (sort === 'date_desc')   return b.date.localeCompare(a.date)
    if (sort === 'date_asc')    return a.date.localeCompare(b.date)
    return 0
  })

  const groups = sorted.reduce<{ key: string; label: string; tasks: typeof sorted }[]>((acc, task) => {
    let key = ''
    let label = ''
    if (sort === 'status') { key = task.status; label = statusLabel[task.status as WoStatus] }
    else if (sort === 'worker_asc' || sort === 'worker_desc') { key = task.workerName; label = task.workerName }
    else { key = task.date; label = new Date(task.date).toLocaleDateString('lt-LT', { year: 'numeric', month: 'long', day: 'numeric' }) }

    const existing = acc.find(g => g.key === key)
    if (existing) existing.tasks.push(task)
    else acc.push({ key, label, tasks: [task] })
    return acc
  }, [])

  if (workOrders.length === 0) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
        <Stack alignItems="center" justifyContent="center" spacing={1} sx={{ flex: 1 }}>
          <EventBusyOutlinedIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
          <Typography variant="body2" color="text.secondary">
            Darbo užsakymų nėra
          </Typography>
        </Stack>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, pt: 1.5, pb: 0 }}>
        <Typography variant="subtitle1" fontWeight={600}>Darbo užsakymai (WO)</Typography>
        <IconButton size="small" onClick={e => setAnchor(e.currentTarget)}>
          <SwapVertOutlinedIcon fontSize="small" />
        </IconButton>
        <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
          {SORT_OPTIONS.map(o => (
            <MenuItem
              key={o.value}
              selected={sort === o.value}
              onClick={() => { setSort(o.value); setAnchor(null) }}
            >
              {o.label}
            </MenuItem>
          ))}
        </Menu>
      </Stack>

      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {groups.map((group) => (
          <Box key={group.key}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, whiteSpace: 'nowrap' }}>
                {group.label}
              </Typography>
              <Divider sx={{ flex: 1 }} />
            </Stack>

            <Stack spacing={1}>
              {group.tasks.map(task => (
                <Box
                  key={task.id}
                  sx={{ bgcolor: 'background.paper', borderRadius: '8px', border: 1, borderColor: 'divider', p: 2 }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                    <Typography variant="subtitle2" fontWeight={400} sx={{ flex: 1 }}>
                      {task.title}
                    </Typography>
                    <Chip
                      label={statusLabel[task.status as WoStatus]}
                      size="small"
                      color={statusColor[task.status as WoStatus]}
                      variant="outlined"
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

                  {sort !== 'worker_asc' && sort !== 'worker_desc' && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                      {task.workerName}
                    </Typography>
                  )}
                </Box>
              ))}
            </Stack>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
