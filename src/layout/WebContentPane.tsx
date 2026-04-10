import { Box } from '@mui/material'
import type { ReactNode } from 'react'

export function WebContentPane({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', p: 3 }}>
      <Box sx={{
        maxWidth: 680,
        width: '100%',
        mx: 'auto',
        flex: 1,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        borderRadius: 2,
        border: 1,
        borderColor: 'divider',
      }}>
        {children}
      </Box>
    </Box>
  )
}
