import { useRef, useState, useCallback } from 'react'
import { Box, Dialog, Snackbar, Alert } from '@mui/material'
import { useOutletContext } from 'react-router-dom'
import { PranesimuValdymasTab } from '../features/vadovas/PranesimuValdymasTab'
import { VadovasPranesimasDetail } from '../features/vadovas/VadovasPranesimasDetail'
import { usePranesimai, type Pranesimas } from '../features/darbuotojas/PranesiamaiContext'
import type { VadovasViewMode } from './VadovasLayout'

function toPin(p: Pranesimas) {
  return {
    lat: p.location.lat,
    lng: p.location.lng,
    title: p.techObject || p.functionalLocation,
    desc: p.faultType || '',
    createdDate: p.createdDate,
    type: p.pinType ?? 'notification',
  }
}

export function VadovasPage() {
  const { pranesimai } = usePranesimai()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const { viewMode, showMap, setShowMap } = useOutletContext<{ viewMode: VadovasViewMode; showMap: boolean; setShowMap: (v: boolean) => void }>()
  const [showNotifications, setShowNotifications] = useState(true)
  const [selectedPranesimasId, setSelectedPranesimasId] = useState<string | null>(null)
  const [toast, setToast] = useState(false)
  const [tabResetKey, setTabResetKey] = useState(0)
  const filteredRef = useRef<Pranesimas[]>([])
  const showNotifsRef = useRef(true)

  const sendPins = useCallback((workOrders: Pranesimas[], showNotifs: boolean, allPranesimai: Pranesimas[]) => {
    const pins = [
      ...workOrders.map(toPin),
      ...(showNotifs ? allPranesimai.filter(p => p.pinType !== 'work_order').map(toPin) : []),
    ]
    iframeRef.current?.contentWindow?.postMessage({ type: 'SET_PINS', pins }, '*')
  }, [])

  const handleFilteredChange = useCallback((items: Pranesimas[]) => {
    filteredRef.current = items
    sendPins(items, showNotifsRef.current, pranesimai)
  }, [sendPins, pranesimai])

  const handleToggleNotifications = useCallback(() => {
    setShowNotifications(v => {
      showNotifsRef.current = !v
      sendPins(filteredRef.current, !v, pranesimai)
      return !v
    })
  }, [sendPins, pranesimai])

  return (
    <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
      <Box sx={{ flex: 1, borderRight: showMap ? 1 : 0, borderColor: 'divider', overflowY: 'auto', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
        <PranesimuValdymasTab key={tabResetKey}
          viewMode={viewMode}
          showMap={showMap}
          onToggleMap={() => setShowMap(!showMap)}
          showNotifications={showNotifications}
          onToggleNotifications={handleToggleNotifications}
          onFilteredChange={handleFilteredChange}
          onSelectPranesimas={id => setSelectedPranesimasId(id)}
          onHoverPin={p => iframeRef.current?.contentWindow?.postMessage(
            { type: 'HIGHLIGHT_PIN', lat: p?.location.lat ?? null, lng: p?.location.lng ?? null }, '*'
          )}
        />
      </Box>
      <Dialog
        open={!!selectedPranesimasId}
        onClose={() => setSelectedPranesimasId(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '8px', height: '80vh', display: 'flex', flexDirection: 'column' } }}
      >
        {selectedPranesimasId && (
          <VadovasPranesimasDetail
            id={selectedPranesimasId}
            onClose={() => setSelectedPranesimasId(null)}
            onConfirm={() => { setSelectedPranesimasId(null); setToast(true) }}
          />
        )}
      </Dialog>
      <Snackbar open={toast} autoHideDuration={4000} onClose={() => setToast(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" onClose={() => setToast(false)} sx={{ width: '100%' }}>
          Darbo užsakymas sėkmingai sukurtas
        </Alert>
      </Snackbar>
      {showMap && (
        <Box sx={{ width: '50%', flexShrink: 0 }}>
          <iframe
            ref={iframeRef}
            src="/satellite-map.html"
            onLoad={() => sendPins(filteredRef.current, showNotifsRef.current, pranesimai)}
            style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
            title="Satellite map"
          />
        </Box>
      )}
    </Box>
  )
}
