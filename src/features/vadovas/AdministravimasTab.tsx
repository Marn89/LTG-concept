import { Box, Stack, Typography } from '@mui/material'
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined'

export function AdministravimasTab() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <Stack alignItems="center" justifyContent="center" spacing={1} sx={{ flex: 1 }}>
        <TuneOutlinedIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
        <Typography variant="body2" color="text.secondary">
          Nėra duomenų
        </Typography>
      </Stack>
    </Box>
  )
}
