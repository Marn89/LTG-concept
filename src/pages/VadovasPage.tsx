import { useRef } from 'react'
import { Box } from '@mui/material'
import { useOutletContext } from 'react-router-dom'
import { PranesimuValdymasTab } from '../features/vadovas/PranesimuValdymasTab'
import { usePranesimai } from '../features/darbuotojas/PranesiamaiContext'
import type { VadovasViewMode } from './VadovasLayout'

export function VadovasPage() {
  const { pranesimai } = usePranesimai()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const { viewMode, showMap, setShowMap } = useOutletContext<{ viewMode: VadovasViewMode; showMap: boolean; setShowMap: (v: boolean) => void }>()

  const handleIframeLoad = () => {
    const pins = pranesimai.map(p => ({
      lat: p.location.lat,
      lng: p.location.lng,
      title: p.techObject || p.functionalLocation,
      desc: p.faultType || '',
      createdDate: p.createdDate,
      type: p.pinType ?? 'notification',
    }))
    iframeRef.current?.contentWindow?.postMessage({ type: 'SET_PINS', pins }, '*')
  }

  return (
    <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
      <Box sx={{ flex: 1, borderRight: showMap ? 1 : 0, borderColor: 'divider', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <PranesimuValdymasTab viewMode={viewMode} showMap={showMap} onToggleMap={() => setShowMap(!showMap)} />
      </Box>
      {showMap && (
        <Box sx={{ width: '50%', flexShrink: 0 }}>
          <iframe
            ref={iframeRef}
            src="/satellite-map.html"
            onLoad={handleIframeLoad}
            style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
            title="Satellite map"
          />
        </Box>
      )}
    </Box>
  )
}
