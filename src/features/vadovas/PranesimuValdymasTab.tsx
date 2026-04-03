import { useState } from 'react'
import { Box, Stack, Typography, Divider, IconButton, Menu, MenuItem } from '@mui/material'
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined'
import SwapVertOutlinedIcon from '@mui/icons-material/SwapVertOutlined'
import { useNavigate } from 'react-router-dom'
import { usePranesimai, type Pranesimas } from '../darbuotojas/PranesiamaiContext'

function dateLabel(date: string) {
  return new Date(date).toLocaleDateString('lt-LT', { year: 'numeric', month: 'long', day: 'numeric' })
}

const SORT_OPTIONS = [
  { value: 'newest', label: 'Naujausias pirmas' },
  { value: 'oldest', label: 'Seniausias pirmas' },
]

function groupByDate(items: Pranesimas[]) {
  const groups: { date: string; items: Pranesimas[] }[] = []
  const seen = new Map<string, number>()
  for (const p of items) {
    if (!seen.has(p.createdDate)) {
      seen.set(p.createdDate, groups.length)
      groups.push({ date: p.createdDate, items: [] })
    }
    groups[seen.get(p.createdDate)!].items.push(p)
  }
  return groups
}

export function PranesimuValdymasTab() {
  const { pranesimai } = usePranesimai()
  const navigate = useNavigate()
  const [sort, setSort] = useState('newest')
  const [sortAnchor, setSortAnchor] = useState<null | HTMLElement>(null)

  const filtered = pranesimai
    .slice()
    .sort((a, b) => sort === 'newest'
      ? (b.createdDate + b.createdAt).localeCompare(a.createdDate + a.createdAt)
      : (a.createdDate + a.createdAt).localeCompare(b.createdDate + b.createdAt)
    )

  const groups = groupByDate(filtered)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, pt: 1.5, pb: 0 }}>
        <Typography variant="subtitle1" fontWeight={600}>Visi pranešimai</Typography>
        <IconButton size="small" onClick={e => setSortAnchor(e.currentTarget)}>
          <SwapVertOutlinedIcon fontSize="small" />
        </IconButton>
        <Menu anchorEl={sortAnchor} open={Boolean(sortAnchor)} onClose={() => setSortAnchor(null)}>
          {SORT_OPTIONS.map(o => (
            <MenuItem
              key={o.value}
              selected={sort === o.value}
              onClick={() => { setSort(o.value); setSortAnchor(null) }}
            >
              {o.label}
            </MenuItem>
          ))}
        </Menu>
      </Stack>


      {filtered.length === 0 ? (
        <Stack alignItems="center" justifyContent="center" spacing={1} sx={{ flex: 1 }}>
          <NotificationsOutlinedIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
          <Typography variant="body2" color="text.secondary">
            Pranešimų nėra
          </Typography>
        </Stack>
      ) : (
        <Box sx={{ flex: 1, overflowY: 'auto', px: 2, pt: 2 }}>
          {groups.map((group, gi) => (
            <Box key={group.date}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1, mt: gi > 0 ? 2 : 0 }}>
                <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                  {dateLabel(group.date)}
                </Typography>
                <Divider sx={{ flex: 1 }} />
              </Stack>
              {group.items.map(p => (
                <Box
                  key={p.id}
                  onClick={() => navigate(`/vadovas/pranesimai/${p.id}`)}
                  sx={{
                    bgcolor: 'background.paper',
                    borderRadius: '8px',
                    border: 1,
                    borderColor: 'divider',
                    p: 2,
                    mb: 1,
                    cursor: 'pointer',
                    '&:active': { opacity: 0.7 },
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                    <Typography variant="subtitle2" fontWeight={400} sx={{ flex: 1 }}>
                      {p.description || '—'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {p.createdAt}
                    </Typography>
                  </Stack>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                    {p.reporter}
                  </Typography>
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}
