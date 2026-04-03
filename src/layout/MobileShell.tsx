import { Box } from '@mui/material'
import type { ReactNode } from 'react'

// Target device: Samsung Galaxy XCover 7
// Viewport: 360 × 780 px (CSS pixels)
const DEVICE_WIDTH  = 360
const DEVICE_HEIGHT = 780

interface Props {
  children: ReactNode
}

export function MobileShell({ children }: Props) {
  return (
    <Box
      sx={{
        width: DEVICE_WIDTH,
        height: DEVICE_HEIGHT,
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {children}
    </Box>
  )
}
