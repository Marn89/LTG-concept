import { Box } from '@mui/material'
import type { ReactNode } from 'react'

export function WebPageLayout({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ height: '100vh', display: 'flex', bgcolor: 'background.default', alignItems: 'flex-start', justifyContent: 'center', p: 4 }}>
      <Box sx={{
        width: '100%',
        maxWidth: 600,
        bgcolor: 'background.paper',
        borderRadius: 2,
        border: 1,
        borderColor: 'divider',
        overflow: 'hidden',
        maxHeight: 'calc(100vh - 64px)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {children}
      </Box>
    </Box>
  )
}
