import { useState, useEffect } from 'react'
import {
  Box, Stack, Typography, Divider, Chip, IconButton, Switch, FormControlLabel,
  Table, TableHead, TableBody, TableRow, TableCell, TableSortLabel,
  Tabs, Tab, Select, MenuItem, TextField,
} from '@mui/material'
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined'
import MapOutlinedIcon from '@mui/icons-material/MapOutlined'
import ReorderIcon from '@mui/icons-material/Reorder'
import { useNavigate } from 'react-router-dom'
import { usePranesimai, type Pranesimas } from '../darbuotojas/PranesiamaiContext'
import { NOW } from '../../utils/now'
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

const DATE_FILTERS = [
  { label: 'Šiandienos',      key: 'today'  },
  { label: 'Šios savaitės',   key: 'week'   },
  { label: 'Šio mėnesio',     key: 'month'  },
  { label: 'Šių metų',        key: 'year'   },
  { label: 'Pasirinktinė data', key: 'custom' },
] as const

type DateFilter = typeof DATE_FILTERS[number]['key']

function matchesDateFilter(date: string, filter: DateFilter) {
  const d = new Date(date)
  const now = new Date(NOW)
  if (filter === 'today') return d.toDateString() === now.toDateString()
  if (filter === 'week') {
    const start = new Date(now); start.setDate(now.getDate() - 6); start.setHours(0,0,0,0)
    return d >= start
  }
  if (filter === 'month') return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
  if (filter === 'year') return d.getFullYear() === now.getFullYear()
  return true
}

const STATUS_FILTERS = [
  { label: 'Visi',                  key: 'all',              color: null       },
  { label: 'Nesuplanuoti',          key: 'backlog',          color: '#D32F2F'  },
  { label: 'Suplanuoti',            key: 'planned',          color: '#3B82F6'  },
  { label: 'Vykdomi',               key: 'in_progress',      color: '#F59E0B'  },
  { label: 'Vėluojantys',           key: 'overdue',          color: '#F97316'  },
  { label: 'Laukia patvirtinimo',   key: 'pending_approval', color: '#8B5CF6'  },
  { label: 'Atlikti',               key: 'done',             color: '#43A047'  },
] as const

type StatusFilter = typeof STATUS_FILTERS[number]['key']

export function PranesimuValdymasTab({ viewMode, showMap, onToggleMap, showNotifications, onToggleNotifications, onFilteredChange, onHoverPin, onSelectPranesimas }: { viewMode: VadovasViewMode; showMap: boolean; onToggleMap: () => void; showNotifications: boolean; onToggleNotifications: () => void; onFilteredChange?: (items: Pranesimas[]) => void; onHoverPin?: (p: Pranesimas | null) => void; onSelectPranesimas?: (id: string) => void }) {
  const { pranesimai, markAsRead } = usePranesimai()
  const navigate = useNavigate()
  const [innerTab, setInnerTab] = useState(() => Number(localStorage.getItem('vadovas_innerTab') ?? 0))

  const handleInnerTab = (_: unknown, v: number) => {
    setInnerTab(v)
    localStorage.setItem('vadovas_innerTab', String(v))
  }
  const [groupedView, setGroupedView] = useState(false)
  const [sortCol, setSortCol] = useState<'techObject' | 'faultType' | 'functionalLocation' | 'workOrderStatus' | 'woType' | 'createdDate' | 'createdAt' | 'reporter'>('createdDate')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const handleSort = (col: typeof sortCol) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortCol(col); setSortDir('asc') }
  }
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(
    () => (localStorage.getItem('vadovas_statusFilter') as StatusFilter) ?? 'all'
  )
  const [dateFilter, setDateFilter] = useState<DateFilter>(
    () => (localStorage.getItem('vadovas_dateFilter') as DateFilter) ?? 'month'
  )
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')

  const handleStatusFilter = (f: StatusFilter) => {
    setStatusFilter(f)
    localStorage.setItem('vadovas_statusFilter', f)
  }
  const handleDateFilter = (f: DateFilter) => {
    setDateFilter(f)
    localStorage.setItem('vadovas_dateFilter', f)
  }

  const getVal = (p: Pranesimas): string => {
    switch (sortCol) {
      case 'techObject':         return p.techObject || ''
      case 'faultType':          return p.faultType || ''
      case 'functionalLocation': return p.functionalLocation || ''
      case 'workOrderStatus':    return p.workOrderStatus ?? ''
      case 'woType':             return p.workOrderStatus === 'backlog' ? 'Neplaninis' : 'Planinis'
      case 'reporter':           return p.reporter
      case 'createdAt':          return p.createdAt
      case 'createdDate':        return p.createdDate + p.createdAt
    }
  }

  const sorted = pranesimai
    .slice()
    .sort((a, b) => {
      const av = getVal(a)
      const bv = getVal(b)
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
    })

  const workOrders = sorted.filter(p => p.pinType === 'work_order')
  const dateFilteredWO = workOrders.filter(p => matchesDateFilter(p.createdDate, dateFilter))

  const statusCounts: Record<StatusFilter, number> = {
    all:              dateFilteredWO.length,
    backlog:          dateFilteredWO.filter(p => p.workOrderStatus === 'backlog').length,
    planned:          dateFilteredWO.filter(p => p.workOrderStatus === 'planned').length,
    in_progress:      dateFilteredWO.filter(p => p.workOrderStatus === 'in_progress').length,
    done:             dateFilteredWO.filter(p => p.workOrderStatus === 'done').length,
    overdue:          dateFilteredWO.filter(p => p.workOrderStatus === 'overdue').length,
    pending_approval: dateFilteredWO.filter(p => p.workOrderStatus === 'pending_approval').length,
  }


  const filtered = viewMode === 'table'
    ? sorted.filter(p => {
        const byType = innerTab === 0 ? p.pinType === 'work_order' : p.pinType !== 'work_order'
        if (!byType) return false
        if (innerTab === 0) {
          const taskDate = p.woCompletionDate ?? p.createdDate
          if (dateFilter === 'custom') {
            if (customFrom && taskDate < customFrom) return false
            if (customTo && taskDate > customTo) return false
          } else if (!matchesDateFilter(taskDate, dateFilter)) return false
          if (statusFilter !== 'all') return p.workOrderStatus === (statusFilter as string)
        }
        return true
      })
    : sorted

  const groups = groupByDate(filtered)

  useEffect(() => {
    onFilteredChange?.(filtered)
  }, [filtered, onFilteredChange])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      {viewMode === 'table' && (
        <Tabs value={innerTab} onChange={handleInnerTab} sx={{ borderBottom: 1, borderColor: 'divider', minHeight: 40, px: 2 }}>
          <Tab label="Darbo užsakymai" sx={{ minHeight: 40, py: 0, fontSize: '0.8rem' }} />
          {(() => {
            const newCount = pranesimai.filter(p => p.pinType !== 'work_order' && p.isNew).length
            return (
              <Tab
                sx={{ minHeight: 40, py: 0, fontSize: '0.8rem' }}
                label={
                  <Stack direction="row" alignItems="center" spacing={0.75}>
                    <span>Pranešimai</span>
                    {newCount > 0 && (
                      <Box sx={{ bgcolor: '#F59E0B', borderRadius: '50%', width: 6, height: 6, flexShrink: 0 }} />
                    )}
                  </Stack>
                }
              />
            )
          })()}
        </Tabs>
      )}

      {viewMode === 'kanban' && filtered.length === 0 ? (
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
            <Box sx={{ px: 3, pt: 2, pb: 1.5 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                <Select
                  value={dateFilter}
                  onChange={e => handleDateFilter(e.target.value as DateFilter)}
                  size="small"
                  renderValue={val => {
                    const f = DATE_FILTERS.find(f => f.key === val)
                    return (
                      <Box>
                        <Typography variant="h6" lineHeight={1.1}>{f?.label}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {val === 'today' && NOW.toLocaleDateString('lt-LT', { year: 'numeric', month: 'long', day: 'numeric' })}
                          {val === 'week' && (() => { const now = new Date(); const from = new Date(now); from.setDate(now.getDate() - 6); return `${from.toLocaleDateString('lt-LT', { month: 'long', day: 'numeric' })} – ${now.toLocaleDateString('lt-LT', { month: 'long', day: 'numeric' })}` })()}
                          {val === 'month' && NOW.toLocaleDateString('lt-LT', { year: 'numeric', month: 'long' })}
                          {val === 'year' && NOW.getFullYear()}
                          {val === 'custom' && (customFrom || customTo ? `${customFrom || '…'} – ${customTo || '…'}` : 'Pasirinkite datą')}
                        </Typography>
                      </Box>
                    )
                  }}
                  sx={{ borderRadius: '16px', minWidth: 260, height: 'auto', '& .MuiSelect-select': { py: '12px' } }}
                >
                  {DATE_FILTERS.map(f => (
                    <MenuItem key={f.key} value={f.key}>{f.label}</MenuItem>
                  ))}
                </Select>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <FormControlLabel
                    control={<Switch size="small" checked={showNotifications} onChange={onToggleNotifications} />}
                    label={<Typography sx={{ fontSize: '16px' }}>Rodyti pranešimus</Typography>}
                    labelPlacement="start"
                    sx={{ mr: 0, ml: 0 }}
                  />
                  <IconButton onClick={onToggleMap} sx={{ color: showMap ? 'primary.main' : 'text.secondary' }}>
                    <MapOutlinedIcon />
                  </IconButton>
                </Stack>
              </Stack>
              {dateFilter === 'custom' && (
                <Stack direction="row" spacing={1} sx={{ mt: 1.5, mb: 0.5 }}>
                  <TextField
                    type="date"
                    size="small"
                    label="Nuo"
                    value={customFrom}
                    onChange={e => setCustomFrom(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    type="date"
                    size="small"
                    label="Iki"
                    value={customTo}
                    onChange={e => setCustomTo(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{ flex: 1 }}
                  />
                </Stack>
              )}
              <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: 'block', mb: 0.75 }}>Statusas</Typography>
              <Stack direction="row" alignItems="flex-start">
                <Stack direction="row" spacing={0.75} flexWrap="wrap" sx={{ flex: 1 }}>
                  {STATUS_FILTERS.map(f => {
                    const active = statusFilter === f.key
                    const color = f.color
                    return (
                      <Chip
                        key={f.key}
                        label={`${f.label} (${statusCounts[f.key]})`}
                        size="small"
                        onClick={() => handleStatusFilter(f.key)}
                        variant={active ? 'filled' : 'outlined'}
                        sx={color ? {
                          borderColor: color,
                          color: active ? '#fff' : color,
                          bgcolor: active ? color : 'transparent',
                          '&:hover': { bgcolor: active ? color : `${color}18` },
                        } : {}}
                      />
                    )
                  })}
                </Stack>
                <IconButton size="small" sx={{ flexShrink: 0, color: groupedView ? 'primary.main' : 'text.secondary' }} onClick={() => setGroupedView(v => !v)}>
                  <ReorderIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Box>
          )}
          {innerTab === 1 && (
            <Box sx={{ px: 3, pt: 2, pb: 1.5 }}>
              <Typography variant="h6">Visi pranešimai</Typography>
              <Typography variant="caption" color="text.secondary">Iš viso: {filtered.length}</Typography>
            </Box>
          )}
          {filtered.length === 0 ? (
            <Stack alignItems="center" justifyContent="center" spacing={1} sx={{ py: 8 }}>
              <NotificationsOutlinedIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
              <Typography variant="body2" color="text.secondary">Pranešimų nėra</Typography>
            </Stack>
          ) : (() => {
            const WO_STATUS_MAP: Record<string, { label: string; color: string }> = {
              planned:          { label: 'Suplanuotas',         color: '#3B82F6' },
              in_progress:      { label: 'Vykdomas',            color: '#F59E0B' },
              done:             { label: 'Atliktas',            color: '#43A047' },
              backlog:          { label: 'Nesuplanuotas',       color: '#D32F2F' },
              overdue:          { label: 'Vėluojantis',         color: '#F97316' },
              pending_approval: { label: 'Laukia patvirtinimo', color: '#8B5CF6' },
            }

            const WO_COLS = innerTab === 0
              ? [
                  { label: 'Gedimo tipas',                col: 'faultType'          },
                  { label: 'Techninis objektas',          col: 'techObject'         },
                  { label: 'Lokacija',                    col: 'functionalLocation' },
                  { label: 'WO tipas',                    col: 'woType'             },
                  ...(!groupedView ? [{ label: 'Statusas', col: 'workOrderStatus' }] : []),
                  { label: 'Planuojamas darbo atlikimas', col: 'createdDate'        },
                ]
              : [
                  { label: 'Lokacija',           col: 'functionalLocation' },
                  { label: 'Techninis objektas', col: 'techObject'         },
                  { label: 'Gedimo tipas',       col: 'faultType'          },
                  { label: 'Pranešėjas',         col: 'reporter'           },
                  { label: 'Pranešimo laikas',   col: 'createdDate'        },
                ]

            const cardCellSx = {
              borderTop: '1px solid',
              borderBottom: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              py: 1.25,
            }


            const renderRow = (p: Pranesimas) => {
              const cell = groupedView ? cardCellSx : {}
              return (
                <TableRow
                  key={p.id}
                  hover
                  onClick={() => { markAsRead(p.id); navigate(`/vadovas/pranesimai/${p.id}`) }}
                  onMouseEnter={() => onHoverPin?.(p)}
                  onMouseLeave={() => onHoverPin?.(null)}
                  sx={{
                    cursor: 'pointer',
                    ...(groupedView && {
                      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                      '& td:first-of-type': { borderLeft: '1px solid', borderColor: 'divider', borderRadius: '8px 0 0 8px', pl: '12px' },
                      '& td:last-of-type':  { borderRight: '1px solid', borderColor: 'divider', borderRadius: '0 8px 8px 0', pr: '12px' },
                    }),
                    ...(innerTab === 1 && { '& .MuiTableCell-root': { fontWeight: 500 }, ...(p.isNew && { bgcolor: '#FFF8E1' }) }),
                  }}
                >
                  {innerTab === 0 ? (
                    <>
                      <TableCell sx={cell}>{p.faultType || '—'}</TableCell>
                      <TableCell sx={cell}>{p.techObject || '—'}</TableCell>
                      <TableCell sx={cell}>{p.functionalLocation || '—'}</TableCell>
                      <TableCell sx={cell}>{p.workOrderStatus === 'backlog' ? 'Neplaninis' : 'Planinis'}</TableCell>
                      {!groupedView && (
                        <TableCell sx={cell}>
                          {(() => { const s = WO_STATUS_MAP[p.workOrderStatus ?? 'backlog']; return <Chip label={s.label} size="small" variant="outlined" sx={{ borderColor: s.color, color: s.color, fontWeight: 600, fontSize: '0.68rem', height: 20 }} /> })()}
                        </TableCell>
                      )}
                      <TableCell sx={cell}>{p.woCompletionDate ?? p.createdDate} {p.createdAt}</TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell sx={cell}>{p.functionalLocation || '—'}</TableCell>
                      <TableCell sx={cell}>{p.techObject || '—'}</TableCell>
                      <TableCell sx={cell}>{p.faultType || '—'}</TableCell>
                      <TableCell sx={cell}>{p.reporter}</TableCell>
                      <TableCell sx={cell}>{p.createdDate} {p.createdAt}</TableCell>
                    </>
                  )}
                </TableRow>
              )
            }

            const tableHead = (
              <TableHead>
                <TableRow>
                  {WO_COLS.map(({ label, col }) => (
                    <TableCell key={col} sx={{ fontWeight: 600 }}>
                      <TableSortLabel active={sortCol === col} direction={sortCol === col ? sortDir : 'asc'} onClick={() => handleSort(col as typeof sortCol)}>
                        {label}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
            )

            if (!groupedView || innerTab !== 0) {
              return (
                <Table size="small" sx={{ borderCollapse: 'separate', borderSpacing: '0 4px' }}>
                  {tableHead}
                  <TableBody>{filtered.map(renderRow)}</TableBody>
                </Table>
              )
            }

            return (
              <Table size="small" sx={{ borderCollapse: 'separate', borderSpacing: '0 4px' }}>
                {tableHead}
                <TableBody sx={{ bgcolor: 'grey.100' }}>
                  {STATUS_FILTERS.filter(f => f.key !== 'all').flatMap(f => {
                    const rows = filtered.filter(p => (p.workOrderStatus ?? 'backlog') === f.key)
                    if (rows.length === 0) return []
                    const s = WO_STATUS_MAP[f.key]
                    return [
                      <TableRow key={`grp-${f.key}`}>
                        <TableCell colSpan={WO_COLS.length} sx={{ pt: 2.5, pb: 0.5, border: 'none', bgcolor: 'transparent' }}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography variant="caption" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 0.5, color: f.color ?? s?.color }}>
                              {f.label}
                            </Typography>
                            <Typography variant="caption" color="text.disabled">({rows.length})</Typography>
                          </Stack>
                        </TableCell>
                      </TableRow>,
                      ...rows.map(renderRow),
                    ]
                  })}
                </TableBody>
              </Table>
            )
          })()}
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
