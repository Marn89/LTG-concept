import { useState, useRef } from 'react'
import { Box, Typography, Fab, IconButton, Stack, Chip } from '@mui/material'
// import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined' — used by hidden empty state
import AddIcon from '@mui/icons-material/Add'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import MapOutlinedIcon from '@mui/icons-material/MapOutlined'
import { useNavigate } from 'react-router-dom'
import { usePranesimai } from './PranesiamaiContext'

export function PranesimaTab() {
  const navigate = useNavigate()
  const [showList, setShowList] = useState(false)
  const { pranesimai } = usePranesimai()
  const sessionPranesimai = pranesimai.filter(p => !p.isSeeded)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const handleIframeLoad = () => {
    const pins = sessionPranesimai.map(p => ({
      lat: p.location.lat,
      lng: p.location.lng,
      title: p.techObject || p.functionalLocation,
      desc: p.faultType || '',
      createdDate: p.createdDate,
      type: 'notification' as const,
    }))
    iframeRef.current?.contentWindow?.postMessage({ type: 'SET_PINS', pins }, '*')
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, pt: 3, pb: 0 }}>
        <Typography variant="subtitle1" fontWeight={600}>Visi pranešimai ir užsakymai</Typography>
        <IconButton size="small" onClick={() => setShowList(v => !v)}>
          {showList
            ? <MapOutlinedIcon fontSize="small" />
            : <FormatListBulletedIcon fontSize="small" />}
        </IconButton>
      </Stack>

      {/* HIDDEN — original notification cards, restore later
      {pranesimai.length === 0 ? (
        <Stack alignItems="center" justifyContent="center" spacing={1} sx={{ flex: 1 }}>
          <NotificationsOutlinedIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
          <Typography variant="body2" color="text.secondary">Pranešimų nėra</Typography>
        </Stack>
      ) : (
        <Stack spacing={1} sx={{ flex: 1, overflowY: 'auto', p: 2, pb: 10 }}>
          {pranesimai.map((p) => (
            <Box key={p.id} onClick={() => navigate(`/darbuotojas/pranesimai/${p.id}`)}
              sx={{ bgcolor: 'background.paper', borderRadius: '8px', border: 1, borderColor: 'divider', p: 2, cursor: 'pointer', '&:active': { opacity: 0.7 } }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                <Typography variant="subtitle2" fontWeight={400} sx={{ flex: 1 }}>{p.description || '—'}</Typography>
                <Typography variant="caption" color="text.secondary">{p.createdAt}</Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>{p.functionalLocation || p.equipment}</Typography>
            </Box>
          ))}
        </Stack>
      )}
      */}

      {showList ? (
        <Stack spacing={1.5} sx={{ flex: 1, overflowY: 'auto', px: 2, pt: 1.5, pb: 10 }}>
          {sessionPranesimai.length === 0 && (
            <Typography variant="caption" color="text.disabled" sx={{ display: 'block', textAlign: 'center', mt: 4 }}>
              Pranešimų nėra
            </Typography>
          )}
          {sessionPranesimai.map(p => (
            <Box
              key={p.id}
              sx={{ bgcolor: 'background.paper', borderRadius: '12px', border: 1, borderColor: 'divider', p: 1.5 }}
            >
              <Chip
                label="Pranešimas"
                size="small"
                sx={{ bgcolor: '#F59E0B', color: '#fff', fontWeight: 600, height: 20, fontSize: '0.68rem', mb: 0.75 }}
              />
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.25 }}>
                {p.techObject || p.functionalLocation}
              </Typography>
              {p.faultType ? (
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                  {p.faultType}
                </Typography>
              ) : null}
              <Typography variant="caption" color="text.disabled" display="block">
                {p.createdDate}
              </Typography>
            </Box>
          ))}
        </Stack>
      ) : (
        <Box sx={{ flex: 1, overflow: 'hidden', mt: 1.5 }}>
          <iframe
            ref={iframeRef}
            src="/satellite-map.html"
            onLoad={handleIframeLoad}
            style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
            title="Satellite map"
          />
        </Box>
      )}

      <Fab
        size="large"
        onClick={() => navigate('/darbuotojas/pranesimai/naujas')}
        sx={{ position: 'absolute', bottom: 16, right: 16, bgcolor: '#ffdf00', color: '#000', '&:hover': { bgcolor: '#ccb200' } }}
      >
        <AddIcon />
      </Fab>
    </Box>
  )
}
