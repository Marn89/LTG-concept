import { useState, useMemo, useRef, useCallback, useEffect } from 'react'
import { NOW } from '../../utils/now'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Chip, Divider, Button, IconButton, Dialog, DialogContent } from '@mui/material'
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { tasksByOffset, type Status } from './data'
import { usePranesimai } from './PranesiamaiContext'
import { UzduotisAtaskaitaScreen } from './UzduotisAtaskaitaScreen'
import type { CompletionReport } from './UzduotisAtaskaitaScreen'

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


type Filter = 'all' | 'todo' | 'done'

export function UzduotysTab() {
  const [offset, setOffset] = useState(0)
  const [showMap, setShowMap] = useState(false)
  const [filter, setFilter] = useState<Filter>('all')
  const allTasksForTimer = tasksByOffset[0] ?? []
  const [timers, setTimers] = useState<Record<string, { startedAt: number | null; accumulated: number }>>(() => {
    const init: Record<string, { startedAt: number | null; accumulated: number }> = {}
    allTasksForTimer.filter(t => t.status === 'pending').forEach(t => {
      init[t.id] = { startedAt: Date.now(), accumulated: 0 }
    })
    return init
  })
  const [tick, setTick] = useState(0)
  const [pauseModal, setPauseModal] = useState<string | null>(null)
  const [completeModal, setCompleteModal] = useState<{ id: string; title: string; subtitle: string; elapsed: number; pranesimasId?: string } | null>(null)
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const running = Object.values(timers).some(t => t.startedAt !== null)
    if (!running) return
    const interval = setInterval(() => setTick(n => n + 1), 1000)
    return () => clearInterval(interval)
  }, [timers])

  function getElapsed(id: string) {
    void tick
    const t = timers[id]
    if (!t) return 0
    const extra = t.startedAt ? Math.floor((Date.now() - t.startedAt) / 1000) : 0
    return t.accumulated + extra
  }

  function formatElapsed(secs: number) {
    const h = Math.floor(secs / 3600)
    const m = Math.floor((secs % 3600) / 60)
    const s = secs % 60
    return h > 0
      ? `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
      : `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  function handleTimerToggle(id: string) {
    setTimers(prev => {
      const t = prev[id] ?? { startedAt: null, accumulated: 0 }
      if (t.startedAt === null) {
        return { ...prev, [id]: { ...t, startedAt: Date.now() } }
      } else {
        const extra = Math.floor((Date.now() - t.startedAt) / 1000)
        return { ...prev, [id]: { startedAt: null, accumulated: t.accumulated + extra } }
      }
    })
  }
  const navigate = useNavigate()
  const { updateWorkOrderStatus } = usePranesimai()
  const allTasks = (tasksByOffset[offset] ?? []).map(t =>
    completedIds.has(t.id) ? { ...t, status: 'done' as const } : t
  ).sort((a, b) => (a.status === 'done' ? 1 : 0) - (b.status === 'done' ? 1 : 0))
  const tasks = allTasks.filter(t =>
    filter === 'all' ? t.status !== 'done' : t.status === 'done'
  )

  const sendPins = useCallback(() => {
    const pins = tasks.map(t => ({
      lat: t.lat,
      lng: t.lng,
      title: t.title,
      desc: t.subtitle,
      type: 'work_order',
      createdDate: t.completionDate,
    }))
    iframeRef.current?.contentWindow?.postMessage({ type: 'SET_PINS', pins }, '*')
  }, [tasks])

  const today = useMemo(() => new Date(NOW), [])
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

  if (showMap) {
    return (
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', minHeight: 0 }}>
        <Box sx={{ position: 'absolute', top: 12, left: 12, zIndex: 1000 }}>
          <IconButton
            size="small"
            onClick={() => setShowMap(false)}
            sx={{ bgcolor: 'background.paper', boxShadow: 2, '&:hover': { bgcolor: 'background.paper' } }}
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>
        </Box>
        <iframe
          ref={iframeRef}
          src="/satellite-map.html"
          onLoad={sendPins}
          style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
          title="Task map"
        />
      </Box>
    )
  }

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
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography variant="subtitle1" fontWeight={700}>
          {heading}
        </Typography>
        <Button size="small" onClick={() => setShowMap(true)} sx={{ fontSize: '0.7rem', p: 0, minWidth: 0, textTransform: 'none' }}>
          Žiūrėti žemėlapyje
        </Button>
      </Stack>
      <Stack direction="row" spacing={0.75} sx={{ mb: 1.5 }}>
        {([['all', 'Laukia atlikimo'], ['done', 'Atliktos']] as [Filter, string][]).map(([val, label]) => {
          const count = allTasks.filter(t => val === 'all' ? t.status !== 'done' : t.status === 'done').length
          return (
          <Chip
            key={val}
            label={`${label} (${count})`}
            size="small"
            onClick={() => setFilter(val)}
            color="default"
            variant="filled"
            sx={{
              cursor: 'pointer', fontSize: '0.7rem', height: 22, borderRadius: '999px',
              '& .MuiChip-label': { px: 1.25 },
              ...(filter === val && val === 'all' && {
                bgcolor: '#007749',
                color: '#fff',
                '&:hover': { bgcolor: '#005f3a' },
              }),
              ...(filter === val && val === 'done' && {
                bgcolor: 'rgba(0,119,73,0.12)',
                color: '#007749',
                '&:hover': { bgcolor: 'rgba(0,119,73,0.18)' },
              }),
            }}
          />
        )})}

      </Stack>

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
              border: '1px solid',
              borderColor: task.status === 'pending' && timers[task.id]?.startedAt ? '#007749' : 'divider',
              overflow: 'hidden',
              cursor: 'pointer',
              '&:active': { opacity: 0.7 },
              ...(task.status === 'pending' && timers[task.id]?.startedAt && {
                animationName: 'borderPulse',
                animationDuration: '2s',
                animationTimingFunction: 'ease-in-out',
                animationIterationCount: 'infinite',
              }),
              '@keyframes borderPulse': {
                '0%, 100%': { borderColor: '#007749' },
                '50%': { borderColor: 'rgba(0,119,73,0.15)' },
              },
            }}
          >
            <Box sx={{ p: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  {task.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {task.subtitle}
                </Typography>
              </Box>
              {task.status === 'pending' && (
                <Typography variant="body2" fontWeight={700} color="primary.main" sx={{ flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>
                  {formatElapsed(getElapsed(task.id))}
                </Typography>
              )}
              {task.status === 'done' && (
                <Chip label={statusLabel[task.status]} size="small" color="success" variant="filled" />
              )}
            </Stack>

            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 1 }}>
              <LocationOnOutlinedIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">{task.location}</Typography>
            </Stack>
            </Box>
            {task.status === 'pending' && (
              <Box
                onClick={e => { e.stopPropagation(); setCompleteModal({ id: task.id, title: task.title, subtitle: task.subtitle, elapsed: getElapsed(task.id), pranesimasId: task.pranesimasId }) }}
                sx={{ bgcolor: 'primary.main', px: 2, py: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', '&:active': { opacity: 0.85 } }}
              >
                <Typography variant="body2" fontWeight={600} color="primary.contrastText">
                  Baigti užduotį
                </Typography>
              </Box>
            )}
          </Box>
        ))}
      </Stack>

      <Dialog
        open={!!pauseModal}
        onClose={() => setPauseModal(null)}
        fullWidth
        disablePortal
        sx={{ position: 'absolute' }}
        slotProps={{ backdrop: { sx: { position: 'absolute' } } }}
        PaperProps={{
          sx: {
            position: 'absolute', bottom: 0, left: 0, right: 0, m: 0,
            borderRadius: '16px 16px 0 0',
            maxWidth: '100%',
            width: '100%',
          }
        }}
      >
        <DialogContent sx={{ p: 2, pb: 3 }}>
          <Box sx={{ width: 36, height: 4, bgcolor: 'grey.300', borderRadius: 2, mx: 'auto', mb: 2 }} />
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
            Užduoties statusas
          </Typography>
          <Stack spacing={1.5}>
            <Button fullWidth variant="outlined" onClick={() => { handleTimerToggle(pauseModal!); setPauseModal(null) }}>
              Tęsti
            </Button>
            <Button fullWidth variant="contained" onClick={() => { setPauseModal(null); setCompleteModal(true) }}>
              Užduotį atlikau
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
      {completeModal && (
        <Box sx={{ position: 'absolute', inset: 0, zIndex: 1300, bgcolor: 'background.paper', display: 'flex', flexDirection: 'column' }}>
          <UzduotisAtaskaitaScreen
            title={completeModal.title}
            subtitle={completeModal.subtitle}
            elapsed={completeModal.elapsed}
            onClose={() => setCompleteModal(null)}
            onConfirm={(report: CompletionReport) => {
              setCompletedIds(prev => new Set([...prev, completeModal.id]))
              if (completeModal.pranesimasId) updateWorkOrderStatus(completeModal.pranesimasId, 'pending_approval', {
                ...report,
                elapsed: completeModal.elapsed,
                completedAt: NOW.toLocaleDateString('lt-LT'),
              })
              setCompleteModal(null)
            }}
          />
        </Box>
      )}
    </Box>
  )
}
