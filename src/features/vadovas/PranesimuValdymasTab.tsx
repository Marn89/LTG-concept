import { useState, useEffect } from 'react'
import {
  Box, Stack, Typography, Divider, Chip, IconButton, Switch, FormControlLabel,
  Table, TableHead, TableBody, TableRow, TableCell, TableSortLabel,
  Tabs, Tab, Select, MenuItem, TextField, Tooltip, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Autocomplete,
} from '@mui/material'
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined'
import MapOutlinedIcon from '@mui/icons-material/MapOutlined'
import ReorderIcon from '@mui/icons-material/Reorder'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import CloseIcon from '@mui/icons-material/Close'
import PersonIcon from '@mui/icons-material/Person'
import SmartphoneIcon from '@mui/icons-material/Smartphone'
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

const PERSON_NOW = new Date('2026-05-14T10:00:00')

function matchesDateFilter(date: string, filter: DateFilter, now: Date) {
  const d = new Date(date)
  if (filter === 'today') return d.toDateString() === now.toDateString()
  if (filter === 'week') {
    const start = new Date(now); start.setDate(now.getDate() - 6); start.setHours(0,0,0,0)
    return d >= start
  }
  if (filter === 'month') return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
  if (filter === 'year') return d.getFullYear() === now.getFullYear()
  return true
}

const KOMANDA = [
  'Algirdas Rimkus', 'Kęstutis Norvaišas', 'Ramūnas Žilinskas',
  'Povilas Stankūnas', 'Henrikas Jokubaitis', 'Ričardas Butkevičius',
  'Tautvydas Mikalajūnas', 'Žygimantas Paulauskas',
]

const PERSON_VIEW_OBJECTS = [
  'Iešmas Nr. 325K',
  'Iešmas Nr. 367K',
  'Iešmas Nr. 409K',
  'Iešmas Nr. 451K',
  'Iešmas Nr. 493K',
  'Iešmas Nr. 535K',
]

const TASK_DC: Record<number, string> = {
  0: 'AM',
  1: 'AM; Kelių priežiūros darbuotojas',
  2: 'AM',
  3: 'AM',
  4: 'AM',
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
  const { pranesimai, markAsRead, updateWorkOrder } = usePranesimai()
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
  const [personView, setPersonView] = useState(true)
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [bulkModal, setBulkModal] = useState(false)
  const [bulkSelected, setBulkSelected] = useState<Set<string>>(new Set())
  const [bulkKomanda, setBulkKomanda] = useState<string[]>([])
  const [bulkSenior, setBulkSenior] = useState<string | null>(null)
  const [bulkDate, setBulkDate] = useState('')
  const [bulkTime, setBulkTime] = useState('')
  const [taskModal, setTaskModal] = useState<{ gi: number; obj: string } | null>(null)
  const [taskModalTab, setTaskModalTab] = useState(0)
  const [rowAssignments, setRowAssignments] = useState<Record<string, { komanda: string[]; senior: string | null; date: string; time: string }>>({})
  const [rowCycleStatus, setRowCycleStatus] = useState<Record<string, 'vykdomas'>>({})
  const [rowHistory, setRowHistory] = useState<Record<string, Array<{ date: string; time: string; senior: string | null }>>>({})
  const [modalKomanda, setModalKomanda] = useState<string[]>([])
  const [modalSenior, setModalSenior] = useState<string | null>(null)
  const [modalDate, setModalDate] = useState('')
  const [modalTime, setModalTime] = useState('')
  const effectiveNow = personView ? PERSON_NOW : NOW

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
      case 'woType':             { const t = p.woType ?? (p.workOrderStatus === 'backlog' ? 'Neplaninis' : 'Planinis'); return t === 'Planinis' ? 'Kas 1 savaitė' : t }
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
  const dateFilteredWO = personView ? [] : workOrders.filter(p => matchesDateFilter(p.createdDate, dateFilter, effectiveNow))

  const PERSON_VIEW_TOTAL = PERSON_VIEW_OBJECTS.length * 5

  const personViewPlanned = Object.values(rowAssignments).filter(a => a.komanda.length > 0).length
  const personViewBacklog = PERSON_VIEW_TOTAL - personViewPlanned

  const statusCounts: Record<StatusFilter, number> = personView
    ? { all: PERSON_VIEW_TOTAL, backlog: personViewBacklog, planned: personViewPlanned, in_progress: 0, done: 0, overdue: 0, pending_approval: 0 }
    : {
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
          } else if (!matchesDateFilter(taskDate, dateFilter, effectiveNow)) return false
          if (statusFilter !== 'all') return p.workOrderStatus === (statusFilter as string)
        }
        return true
      })
    : sorted

  const displayFiltered = personView && innerTab === 0 ? [] : filtered
  const groups = groupByDate(displayFiltered)

  useEffect(() => {
    onFilteredChange?.(filtered)
  }, [filtered, onFilteredChange])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      {viewMode === 'table' && (<>
        <Box sx={{ display: 'flex', alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={innerTab} onChange={handleInnerTab} sx={{ minHeight: 40, px: 2, flex: 1 }}>
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
          <IconButton size="small" sx={{ mr: 0.5, color: personView ? 'primary.main' : 'text.secondary' }} onClick={() => setPersonView(v => !v)}>
            <PersonOutlineIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" sx={{ mr: 1, color: 'text.secondary' }} onClick={() => window.open('/darbuotojas', '_blank')}>
            <SmartphoneIcon fontSize="small" />
          </IconButton>
        </Box>
      </>)}

      {viewMode === 'kanban' && displayFiltered.length === 0 ? (
        <Stack alignItems="center" justifyContent="center" spacing={1} sx={{ flex: 1 }}>
          <NotificationsOutlinedIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
          <Typography variant="body2" color="text.secondary">Pranešimų nėra</Typography>
        </Stack>
      ) : viewMode === 'kanban' ? (
        <Stack direction="row" spacing={0} sx={{ flex: 1, overflow: 'hidden' }}>
          {KANBAN_COLUMNS.map(col => {
            const items = displayFiltered.filter((p, i) => kanbanColumn(p, i) === col.key)
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
                          {val === 'today' && effectiveNow.toLocaleDateString('lt-LT', { year: 'numeric', month: 'long', day: 'numeric' })}
                          {val === 'week' && (() => { const from = new Date(effectiveNow); from.setDate(effectiveNow.getDate() - 6); return `${from.toLocaleDateString('lt-LT', { month: 'long', day: 'numeric' })} – ${effectiveNow.toLocaleDateString('lt-LT', { month: 'long', day: 'numeric' })}` })()}
                          {val === 'month' && effectiveNow.toLocaleDateString('lt-LT', { year: 'numeric', month: 'long' })}
                          {val === 'year' && effectiveNow.getFullYear()}
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
          {personView && innerTab === 0 && selectedRows.size > 0 && (
            <Box sx={{ px: 3, py: 1, borderBottom: 1, borderColor: 'divider', bgcolor: 'primary.50', display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography variant="caption" color="primary.main" fontWeight={500}>Pažymėta: {selectedRows.size}</Typography>
              <Button size="small" variant="contained" disableElevation onClick={() => { setBulkSelected(new Set(selectedRows)); setBulkKomanda([]); setBulkSenior(null); setBulkDate(''); setBulkTime(''); setBulkModal(true) }}>
                Suplanuoti pažymėtus
              </Button>
            </Box>
          )}
          {innerTab === 1 && (
            <Box sx={{ px: 3, pt: 2, pb: 1.5 }}>
              <Typography variant="h6">Visi pranešimai</Typography>
              <Typography variant="caption" color="text.secondary">Iš viso: {displayFiltered.length}</Typography>
            </Box>
          )}
          {displayFiltered.length === 0 && !(personView && innerTab === 0) ? (
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

            const PERSON_VIEW_TOTAL_ROWS = PERSON_VIEW_OBJECTS.length * 5
            const allSelected = selectedRows.size === PERSON_VIEW_TOTAL_ROWS
            const someSelected = selectedRows.size > 0 && !allSelected
            const toggleAll = () => {
              if (allSelected) { setSelectedRows(new Set()); return }
              const all = new Set(Array.from({ length: 5 }, (_, gi) => PERSON_VIEW_OBJECTS.map(obj => `${gi}-${obj}`)).flat())
              setSelectedRows(all)
            }

            const WO_COLS = innerTab === 0
              ? [
                  ...(personView ? [{ label: '_checkbox', col: '_checkbox' }] : []),
                  ...(personView ? [{ label: 'Techninis objektas', col: 'techObject' }] : []),
                  { label: personView ? 'Užduotis' : 'Darbo užsakymas', col: 'faultType' },
                  ...(!personView ? [{ label: 'Techninis objektas', col: 'techObject' }] : []),
                  ...(!personView ? [{ label: 'Periodiškumas', col: 'woType' }] : []),
                  ...(!personView ? [{ label: 'Kelias', col: 'kelias' }] : []),
                  ...(personView ? [{ label: 'Darbo centras', col: 'darboCentras' }] : []),
                  ...(personView ? [{ label: 'Periodiškumas', col: 'woType' }] : []),
                  ...(personView ? [{ label: 'Sekantis atlikimas', col: 'atlikimData' }] : []),
                  ...(!groupedView ? [{ label: 'Statusas', col: 'workOrderStatus' }] : []),
                  ...(!personView ? [{ label: 'Planuojamas darbo atlikimas', col: 'createdDate' }] : []),
                ]
              : [
                  { label: 'Techninis objektas', col: 'techObject'         },
                  { label: 'Darbo užsakymas',    col: 'faultType'          },
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
                      {personView && <TableCell sx={cell}>{p.techObject || '—'}</TableCell>}
                      <TableCell sx={cell}>{p.faultType || '—'}</TableCell>
                      {!personView && <TableCell sx={cell}>{p.techObject || '—'}</TableCell>}
                      <TableCell sx={cell}>{(() => { const t = p.woType ?? (p.workOrderStatus === 'backlog' ? 'Neplaninis' : 'Planinis'); return t === 'Planinis' ? 'Kas 1 savaitė' : t })()}</TableCell>
                      {!personView && <TableCell sx={cell}>{p.kelias || '—'}</TableCell>}
                      {!groupedView && (
                        <TableCell sx={cell}>
                          {(() => {
                            const s = WO_STATUS_MAP[p.workOrderStatus ?? 'backlog']
                            const isPlanned = p.workOrderStatus === 'planned'
                            return (
                              <Chip
                                label={s.label}
                                size="small"
                                variant="outlined"
                                onClick={isPlanned ? (e) => {
                                  e.stopPropagation()
                                  const base = new Date(p.woCompletionDate ?? p.createdDate)
                                  base.setDate(base.getDate() + 7)
                                  const nextDate = base.toISOString().slice(0, 10)
                                  updateWorkOrder(p.id, {
                                    createdDate: nextDate,
                                    woHistory: [...(p.woHistory ?? []), { date: '2026-05-01', duration: '3 val. 15 min.', senior: p.woSeniorName ?? '—' }],
                                  })
                                } : undefined}
                                sx={{ borderColor: s.color, color: s.color, fontWeight: 600, fontSize: '0.68rem', height: 20, ...(isPlanned && { cursor: 'pointer' }) }}
                              />
                            )
                          })()}
                        </TableCell>
                      )}
                      <TableCell sx={cell}>{p.woCompletionDate ?? p.createdDate} {p.createdAt}</TableCell>
                    </>
                  ) : (
                    <>
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
                    <TableCell key={col} sx={{ fontWeight: 600, ...(col === '_checkbox' && { width: 40, px: 1 }) }}>
                      {col === '_checkbox'
                        ? <Checkbox size="small" checked={allSelected} indeterminate={someSelected} onChange={toggleAll} sx={{ p: 0 }} />
                        : <TableSortLabel active={sortCol === col} direction={sortCol === col ? sortDir : 'asc'} onClick={() => handleSort(col as typeof sortCol)}>{label}</TableSortLabel>
                      }
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
            )

            if (!groupedView || innerTab !== 0) {
              return (
                <Table size="small" sx={{ borderCollapse: 'separate', borderSpacing: '0 4px' }}>
                  {tableHead}
                  <TableBody>
                    {personView && innerTab === 0
                      ? Array.from({ length: 5 }).flatMap((_, gi) => PERSON_VIEW_OBJECTS.map(obj => (
                          <TableRow key={`${gi}-${obj}`} hover sx={{ cursor: 'pointer' }} onClick={() => {
  const key = `${gi}-${obj}`
  const saved = rowAssignments[key]
  setTaskModal({ gi, obj })
  setTaskModalTab(0)
  setModalKomanda(saved?.komanda ?? [])
  setModalSenior(saved?.senior ?? null)
  setModalDate(saved?.date ?? '')
  setModalTime(saved?.time ?? '')
}}>
                            <TableCell sx={{ width: 40, px: 1 }} onClick={e => e.stopPropagation()}>
                              <Checkbox size="small" sx={{ p: 0 }}
                                checked={selectedRows.has(`${gi}-${obj}`)}
                                onChange={() => setSelectedRows(prev => { const s = new Set(prev); s.has(`${gi}-${obj}`) ? s.delete(`${gi}-${obj}`) : s.add(`${gi}-${obj}`); return s })}
                              />
                            </TableCell>
                            <TableCell>{obj}</TableCell>
                            <TableCell>{(() => {
                              const tasks: Record<number, string> = {
                                0: 'Elektros pavarų, galutinės padėties tikrintuvų ir jų garnitūrų išorinės būklės tikrinimas; iešmų smailės prigludimo prie rėminio bėgio tikrinimas laužtuvėliu',
                                1: 'Iešmų išorinės būklės ir smailių prigludimo prie rėminio bėgio, įdėjus 4 mm ir 2 mm storio tarpamačius; Smailių prigludimo prie rėminio bėgio tikrinimas, ties galutinės padėties tikrintuvu įdėjus 6 mm ir 2 mm storio tarpamačius',
                                2: 'Išorinis elektros pavarų, galutinės padėties tikrintuvų ir jų garnitūrų valymas',
                                3: 'Elektros pavarų ir galutinės padėties tikrintuvų vidaus būklės tikrinimas',
                                4: 'Elektros variklio įtampos matavimas',
                              }
                              const full = tasks[gi]
                              if (!full) return '—'
                              return full.length > 80 ? <Tooltip title={full}><span>{full.slice(0, 80)}…</span></Tooltip> : full
                            })()}</TableCell>
                            <TableCell>{gi === 1 ? 'AM; Kelių priežiūros darbuotojas' : 'AM'}</TableCell>
                            <TableCell>{gi === 0 ? 'Kartą per savaitę' : gi === 1 ? 'Kartą per dvi savaites' : gi === 2 ? 'Du kartus per metus' : gi === 3 ? 'Kartą per keturias savaites' : gi === 4 ? 'Kartą per metus' : '—'}</TableCell>
                            <TableCell>{(() => { const a = rowAssignments[`${gi}-${obj}`]; return a?.date ? `${a.date}${a.time ? ' ' + a.time : ''}` : '—' })()}</TableCell>
                            {!groupedView && <TableCell onClick={e => e.stopPropagation()}>{(() => {
                              const key = `${gi}-${obj}`
                              const assigned = (rowAssignments[key]?.komanda?.length ?? 0) > 0
                              if (!assigned) return <Chip label="Nesuplanuotas" size="small" variant="outlined" sx={{ borderColor: '#D32F2F', color: '#D32F2F', fontWeight: 600, fontSize: '0.68rem', height: 20 }} />
                              const isVykdomas = rowCycleStatus[key] === 'vykdomas'
                              return isVykdomas
                                ? <Chip label="Vykdomas" size="small" variant="outlined" onClick={() => {
                                    const a = rowAssignments[key]
                                    const histEntry = { date: a?.date ?? '', time: a?.time ?? '', senior: a?.senior ?? null }
                                    setRowHistory(prev => ({ ...prev, [key]: [...(prev[key] ?? []), histEntry] }))
                                    if (a?.date) {
                                      const d = new Date(a.date); d.setDate(d.getDate() + 7)
                                      setRowAssignments(prev => ({ ...prev, [key]: { ...a, date: d.toISOString().slice(0, 10) } }))
                                    }
                                    setRowCycleStatus(prev => { const n = { ...prev }; delete n[key]; return n })
                                  }} sx={{ borderColor: '#F59E0B', color: '#F59E0B', fontWeight: 600, fontSize: '0.68rem', height: 20, cursor: 'pointer' }} />
                                : <Chip label="Suplanuotas" size="small" variant="outlined" onClick={() => setRowCycleStatus(prev => ({ ...prev, [key]: 'vykdomas' }))} sx={{ borderColor: '#3B82F6', color: '#3B82F6', fontWeight: 600, fontSize: '0.68rem', height: 20, cursor: 'pointer' }} />
                            })()}</TableCell>}
                          </TableRow>
                        )))
                      : displayFiltered.map(renderRow)
                    }
                  </TableBody>
                </Table>
              )
            }

            return (
              <Table size="small" sx={{ borderCollapse: 'separate', borderSpacing: '0 4px' }}>
                {tableHead}
                <TableBody sx={{ bgcolor: 'grey.100' }}>
                  {STATUS_FILTERS.filter(f => f.key !== 'all').flatMap(f => {
                    const rows = displayFiltered.filter(p => (p.workOrderStatus ?? 'backlog') === f.key)
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

      <Dialog open={bulkModal} onClose={() => setBulkModal(false)} fullWidth maxWidth="sm" PaperProps={{ sx: { height: 700 } }}>
        {(() => {
          const TASKS: Record<number, string> = {
            0: 'Elektros pavarų, galutinės padėties tikrintuvų ir jų garnitūrų išorinės būklės tikrinimas; iešmų smailės prigludimo prie rėminio bėgio tikrinimas laužtuvėliu',
            1: 'Iešmų išorinės būklės ir smailių prigludimo prie rėminio bėgio, įdėjus 4 mm ir 2 mm storio tarpamačius; Smailių prigludimo prie rėminio bėgio tikrinimas, ties galutinės padėties tikrintuvu įdėjus 6 mm ir 2 mm storio tarpamačius',
            2: 'Išorinis elektros pavarų, galutinės padėties tikrintuvų ir jų garnitūrų valymas',
            3: 'Elektros pavarų ir galutinės padėties tikrintuvų vidaus būklės tikrinimas',
            4: 'Elektros variklio įtampos matavimas',
          }
          const selectedList = Array.from(bulkSelected).map(key => {
            const gi = Number(key.split('-')[0])
            const obj = key.slice(key.indexOf('-') + 1)
            return { key, gi, obj, task: TASKS[gi] ?? '—' }
          })
          return (
            <>
              <DialogTitle sx={{ pb: 0 }}>
                <Typography variant="subtitle1" fontWeight={700}>Suplanuoti pažymėtus ({bulkSelected.size})</Typography>
              </DialogTitle>
              <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2 }}>
                <Autocomplete
                  multiple
                  disableCloseOnSelect
                  options={KOMANDA}
                  value={bulkKomanda}
                  onChange={(_, v) => { setBulkKomanda(v); if (bulkSenior && !v.includes(bulkSenior)) setBulkSenior(null) }}
                  renderTags={() => null}
                  renderInput={params => <TextField {...params} label="Pasirinkti komandą" size="small" />}
                />
                {bulkKomanda.length > 0 && (
                  <Stack spacing={0.5}>
                    {bulkKomanda.map(p => (
                      <Stack key={p} direction="row" alignItems="center" justifyContent="space-between"
                        sx={{ px: 1.5, py: 0.75, border: 1, borderColor: 'divider', borderRadius: 1 }}
                      >
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <IconButton size="small" onClick={() => setBulkSenior(bulkSenior === p ? null : p)}
                            sx={{ p: 0, color: bulkSenior === p ? 'primary.main' : 'text.secondary' }}
                          >
                            {bulkSenior === p ? <PersonIcon sx={{ fontSize: 18 }} /> : <PersonOutlineIcon sx={{ fontSize: 18 }} />}
                          </IconButton>
                          <Typography variant="body2">{p}{bulkSenior === p && <Typography component="span" variant="body2" color="text.secondary"> (Vyr. tech. darbuotojas)</Typography>}</Typography>
                        </Stack>
                        <IconButton size="small" onClick={() => { const next = bulkKomanda.filter(n => n !== p); setBulkKomanda(next); if (bulkSenior === p) setBulkSenior(null) }} sx={{ color: 'text.disabled' }}>
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    ))}
                  </Stack>
                )}
                <Stack direction="row" spacing={1.5}>
                  <TextField label="Atlikimo data" type="date" size="small" value={bulkDate} onChange={e => setBulkDate(e.target.value)} slotProps={{ inputLabel: { shrink: true } }} sx={{ flex: 1 }} />
                  <TextField label="Atlikimo pradžia" type="time" size="small" value={bulkTime} onChange={e => setBulkTime(e.target.value)} slotProps={{ inputLabel: { shrink: true } }} sx={{ flex: 1 }} />
                </Stack>
                <Divider />
                <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
                  {selectedList.map(({ key, obj, task }, i) => (
                    <Stack key={key} direction="row" alignItems="center" spacing={1}
                      sx={{ px: 1.5, py: 1, borderTop: i > 0 ? 1 : 0, borderColor: 'divider' }}
                    >
                      <Typography variant="body2" fontWeight={500} sx={{ minWidth: 130, flexShrink: 0 }}>{obj}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ flex: 1 }}>{task.length > 60 ? task.slice(0, 60) + '…' : task}</Typography>
                      <IconButton size="small" sx={{ color: 'text.disabled', flexShrink: 0 }}
                        onClick={() => setBulkSelected(prev => { const s = new Set(prev); s.delete(key); return s })}
                      >
                        <CloseIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Stack>
                  ))}
                </Box>
              </DialogContent>
              <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={() => setBulkModal(false)}>Atšaukti</Button>
                <Button variant="contained" disableElevation onClick={() => {
                  setRowAssignments(prev => {
                    const next = { ...prev }
                    Array.from(bulkSelected).forEach(key => {
                      next[key] = { komanda: bulkKomanda, senior: bulkSenior, date: bulkDate, time: bulkTime }
                      const obj = key.replace(/^\d+-/, '')
                      localStorage.setItem(`ltg_task_${obj}`, JSON.stringify({ date: bulkDate, time: bulkTime, komanda: bulkKomanda, senior: bulkSenior }))
                    })
                    return next
                  })
                  setBulkModal(false)
                }}>Išsaugoti</Button>
              </DialogActions>
            </>
          )
        })()}
      </Dialog>

      <Dialog open={!!taskModal} onClose={() => setTaskModal(null)} fullWidth maxWidth="sm" PaperProps={{ sx: { height: 700 } }}>
        {taskModal && (() => {
          const TASKS: Record<number, string> = {
            0: 'Elektros pavarų, galutinės padėties tikrintuvų ir jų garnitūrų išorinės būklės tikrinimas; iešmų smailės prigludimo prie rėminio bėgio tikrinimas laužtuvėliu',
            1: 'Iešmų išorinės būklės ir smailių prigludimo prie rėminio bėgio, įdėjus 4 mm ir 2 mm storio tarpamačius; Smailių prigludimo prie rėminio bėgio tikrinimas, ties galutinės padėties tikrintuvu įdėjus 6 mm ir 2 mm storio tarpamačius',
            2: 'Išorinis elektros pavarų, galutinės padėties tikrintuvų ir jų garnitūrų valymas',
            3: 'Elektros pavarų ir galutinės padėties tikrintuvų vidaus būklės tikrinimas',
            4: 'Elektros variklio įtampos matavimas',
          }
          const taskName = TASKS[taskModal.gi] ?? '—'
          const dcParts = (TASK_DC[taskModal.gi] ?? 'AM').split('; ')
          const extraDCs = dcParts.slice(1)
          return (
            <>
              <DialogTitle sx={{ pb: 0 }}>
                <Typography variant="subtitle1" fontWeight={700}>{taskModal.obj}</Typography>
              </DialogTitle>
              <Tabs value={taskModalTab} onChange={(_, v) => setTaskModalTab(v)} sx={{ px: 3, borderBottom: 1, borderColor: 'divider', minHeight: 40, '& .MuiTab-root': { minHeight: 40, fontSize: '0.75rem' } }}>
                <Tab label="Užduoties informacija" />
                <Tab label="Atlikimo istorija" />
              </Tabs>
              <DialogContent>
                {taskModalTab === 0 && (
                  <Stack spacing={2.5}>
                    <Stack spacing={0.5}>
                      <Typography variant="caption" color="text.secondary">Tech. objektas</Typography>
                      <Typography variant="body2">{taskModal.obj}</Typography>
                    </Stack>
                    <Stack spacing={0.5}>
                      <Typography variant="caption" color="text.secondary">Užduotis</Typography>
                      <Typography variant="body2">{taskName}</Typography>
                    </Stack>
                    <Divider />
                    <Autocomplete
                      multiple
                      disableCloseOnSelect
                      options={KOMANDA}
                      value={modalKomanda}
                      onChange={(_, v) => { setModalKomanda(v); if (modalSenior && !v.includes(modalSenior)) setModalSenior(null) }}
                      renderTags={() => null}
                      renderInput={params => <TextField {...params} label="Pasirinkti komandą" size="small" />}
                    />
                    {modalKomanda.length > 0 && (
                      <Stack spacing={0.5}>
                        {modalKomanda.map(p => (
                          <Stack key={p} direction="row" alignItems="center" justifyContent="space-between"
                            sx={{ px: 1.5, py: 0.75, border: 1, borderColor: 'divider', borderRadius: 1 }}
                          >
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <IconButton size="small" onClick={() => setModalSenior(modalSenior === p ? null : p)}
                                sx={{ p: 0, color: modalSenior === p ? 'primary.main' : 'text.secondary' }}
                              >
                                {modalSenior === p ? <PersonIcon sx={{ fontSize: 18 }} /> : <PersonOutlineIcon sx={{ fontSize: 18 }} />}
                              </IconButton>
                              <Typography variant="body2">{p}{modalSenior === p && <Typography component="span" variant="body2" color="text.secondary"> (Vyr. tech. darbuotojas)</Typography>}</Typography>
                            </Stack>
                            <IconButton size="small" onClick={() => { const next = modalKomanda.filter(n => n !== p); setModalKomanda(next); if (modalSenior === p) setModalSenior(null) }}
                              sx={{ color: 'text.disabled' }}
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        ))}
                      </Stack>
                    )}
                    <Stack direction="row" spacing={1.5}>
                      <TextField
                        label="Atlikimo data"
                        type="date"
                        size="small"
                        value={modalDate}
                        onChange={e => setModalDate(e.target.value)}
                        slotProps={{ inputLabel: { shrink: true } }}
                        sx={{ flex: 1 }}
                      />
                      <TextField
                        label="Atlikimo pradžia"
                        type="time"
                        size="small"
                        value={modalTime}
                        onChange={e => setModalTime(e.target.value)}
                        slotProps={{ inputLabel: { shrink: true } }}
                        sx={{ flex: 1 }}
                      />
                    </Stack>
                    {extraDCs.length > 0 && extraDCs.map(dc => (
                      <Stack key={dc} spacing={0.5}>
                        <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>{dc}</Typography>
                        <Typography variant="body2" color="text.disabled">Nepriskirtas</Typography>
                      </Stack>
                    ))}
                  </Stack>
                )}
                {taskModalTab === 1 && (() => {
                  const key = `${taskModal.gi}-${taskModal.obj}`
                  const history = rowHistory[key] ?? []
                  if (history.length === 0) return <Typography variant="body2" color="text.secondary">Istorijos įrašų nėra.</Typography>
                  const cell = { fontSize: '0.75rem', py: 0.75, px: 1 }
                  return (
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ '& .MuiTableCell-root': { ...cell, fontWeight: 700, color: 'text.secondary', bgcolor: 'action.hover' } }}>
                          <TableCell>#</TableCell>
                          <TableCell>Atlikimo data ir laikas</TableCell>
                          <TableCell>Vyr. tech.</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {history.map((h, i) => (
                          <TableRow key={i} sx={{ '& .MuiTableCell-root': cell }}>
                            <TableCell>{i + 1}</TableCell>
                            <TableCell>{h.date}{h.time ? ` ${h.time}` : ''}</TableCell>
                            <TableCell>{h.senior ?? '—'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )
                })()}
              </DialogContent>
              <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={() => setTaskModal(null)}>Atšaukti</Button>
                <Button variant="contained" disableElevation onClick={() => {
                  if (taskModal) {
                    const key = `${taskModal.gi}-${taskModal.obj}`
                    setRowAssignments(prev => ({ ...prev, [key]: { komanda: modalKomanda, senior: modalSenior, date: modalDate, time: modalTime } }))
                    localStorage.setItem(`ltg_task_${taskModal.obj}`, JSON.stringify({ date: modalDate, time: modalTime, komanda: modalKomanda, senior: modalSenior }))
                  }
                  setTaskModal(null)
                }}>Išsaugoti</Button>
              </DialogActions>
            </>
          )
        })()}
      </Dialog>
    </Box>
  )
}
