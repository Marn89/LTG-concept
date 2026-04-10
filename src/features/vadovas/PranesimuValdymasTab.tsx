import { useState } from 'react'
import {
  Box, Stack, Typography, Divider, Chip, IconButton,
  Table, TableHead, TableBody, TableRow, TableCell,
  Tabs, Tab,
} from '@mui/material'
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined'
import MapOutlinedIcon from '@mui/icons-material/MapOutlined'
import { useNavigate } from 'react-router-dom'
import { usePranesimai, type Pranesimas } from '../darbuotojas/PranesiamaiContext'
import type { VadovasViewMode } from '../../pages/VadovasLayout'

function dateLabel(date: string) {
  return new Date(date).toLocaleDateString('lt-LT', { year: 'numeric', month: 'long', day: 'numeric' })
}

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

const KANBAN_COLUMNS = [
  { key: 'pranesimai', label: 'Pranešimai', color: '#F59E0B' },
  { key: 'suplanuoti', label: 'Suplanuoti', color: '#3B82F6' },
  { key: 'ivykdyti',  label: 'Įvykdyti',   color: '#43A047' },
]

function kanbanColumn(p: Pranesimas, index: number) {
  if (p.pinType === 'work_order') return 'suplanuoti'
  if (index % 5 === 4) return 'ivykdyti'
  return 'pranesimai'
}

function KanbanCard({ p, onClick }: { p: Pranesimas; onClick: () => void }) {
  return (
    <Box
      onClick={onClick}
      sx={{ bgcolor: 'background.paper', borderRadius: '8px', border: 1, borderColor: 'divider', p: 1.5, mb: 1, cursor: 'pointer', '&:hover': { borderColor: 'primary.main' } }}
    >
      <Typography variant="caption" fontWeight={600} display="block" sx={{ mb: 0.5 }}>
        {p.techObject || p.functionalLocation || '—'}
      </Typography>
      {p.faultType && (
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.75 }}>
          {p.faultType}
        </Typography>
      )}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="caption" color="text.disabled">{p.createdDate}</Typography>
        <Chip label={p.reporter} size="small" sx={{ height: 16, fontSize: '0.6rem' }} />
      </Stack>
    </Box>
  )
}

export function PranesimuValdymasTab({ viewMode, showMap, onToggleMap }: { viewMode: VadovasViewMode; showMap: boolean; onToggleMap: () => void }) {
  const { pranesimai } = usePranesimai()
  const navigate = useNavigate()
  const [innerTab, setInnerTab] = useState(0)
  const [sort] = useState('newest')

  const sorted = pranesimai
    .slice()
    .sort((a, b) => sort === 'newest'
      ? (b.createdDate + b.createdAt).localeCompare(a.createdDate + a.createdAt)
      : (a.createdDate + a.createdAt).localeCompare(b.createdDate + b.createdAt)
    )

  const filtered = viewMode === 'table'
    ? sorted.filter(p => innerTab === 0
        ? p.pinType === 'work_order'
        : p.pinType !== 'work_order'
      )
    : sorted

  const groups = groupByDate(filtered)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      {viewMode === 'table' && (
        <Tabs value={innerTab} onChange={(_, v) => setInnerTab(v)} sx={{ borderBottom: 1, borderColor: 'divider', minHeight: 40, px: 2 }}>
          <Tab label="Darbo užsakymai" sx={{ minHeight: 40, py: 0, fontSize: '0.8rem' }} />
          <Tab label="Pranešimai" sx={{ minHeight: 40, py: 0, fontSize: '0.8rem' }} />
        </Tabs>
      )}

      {filtered.length === 0 ? (
        <Stack alignItems="center" justifyContent="center" spacing={1} sx={{ flex: 1 }}>
          <NotificationsOutlinedIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
          <Typography variant="body2" color="text.secondary">Pranešimų nėra</Typography>
        </Stack>
      ) : viewMode === 'kanban' ? (
        <Stack direction="row" spacing={0} sx={{ flex: 1, overflow: 'hidden' }}>
          {KANBAN_COLUMNS.map(col => {
            const items = filtered.filter((p, i) => kanbanColumn(p, i) === col.key)
            return (
              <Box key={col.key} sx={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: 1, borderColor: 'divider', '&:last-child': { borderRight: 0 } }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 2, py: 1.25, borderBottom: 1, borderColor: 'divider' }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: col.color, flexShrink: 0 }} />
                  <Typography variant="caption" fontWeight={600}>{col.label}</Typography>
                  <Typography variant="caption" color="text.disabled">({items.length})</Typography>
                </Stack>
                <Box sx={{ flex: 1, overflowY: 'auto', p: 1.5 }}>
                  {items.map(p => (
                    <KanbanCard key={p.id} p={p} onClick={() => navigate(`/vadovas/pranesimai/${p.id}`)} />
                  ))}
                </Box>
              </Box>
            )
          })}
        </Stack>
      ) : viewMode === 'table' ? (
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          {innerTab === 0 && (
            <Stack direction="row" alignItems="flex-end" justifyContent="space-between" sx={{ px: 3, pt: 3, pb: 2 }}>
              <Box>
                <Typography variant="h6" color="text.secondary" fontWeight={400}>Šiandien</Typography>
                <Typography variant="h3" fontWeight={700}>
                  {new Date().toLocaleDateString('lt-LT', { year: 'numeric', month: 'long', day: 'numeric' })}
                </Typography>
              </Box>
              <IconButton onClick={onToggleMap} sx={{ color: showMap ? 'primary.main' : 'text.secondary', mb: 0.5 }}>
                <MapOutlinedIcon />
              </IconButton>
            </Stack>
          )}
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Tipas</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Techninis objektas</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Gedimo tipas</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Funkcinė lokacija</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Pranešėjas</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Data</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Laikas</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map(p => (
                <TableRow
                  key={p.id}
                  hover
                  onClick={() => navigate(`/vadovas/pranesimai/${p.id}`)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>
                    <Chip
                      label={p.pinType === 'work_order' ? 'Darbo užsakymas' : 'Pranešimas'}
                      size="small"
                      sx={{
                        bgcolor: p.pinType === 'work_order' ? '#43A047' : '#F59E0B',
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: '0.68rem',
                        height: 20,
                      }}
                    />
                  </TableCell>
                  <TableCell>{p.techObject || '—'}</TableCell>
                  <TableCell>{p.faultType || '—'}</TableCell>
                  <TableCell>{p.functionalLocation || '—'}</TableCell>
                  <TableCell>{p.reporter}</TableCell>
                  <TableCell>{p.createdDate}</TableCell>
                  <TableCell>{p.createdAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
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
                  sx={{ bgcolor: 'background.paper', borderRadius: '8px', border: 1, borderColor: 'divider', p: 2, mb: 1, cursor: 'pointer', '&:active': { opacity: 0.7 } }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                    <Typography variant="subtitle2" fontWeight={400} sx={{ flex: 1 }}>
                      {p.techObject || p.functionalLocation || '—'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">{p.createdAt}</Typography>
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
