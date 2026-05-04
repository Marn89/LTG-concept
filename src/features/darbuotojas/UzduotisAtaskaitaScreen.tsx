import { useState } from 'react'
import {
  Box, Typography, Stack, IconButton, Button, Divider,
  Select, MenuItem, FormControl, InputLabel,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

const AMOUNTS = [
  '1 vnt.', '2 vnt.', '5 vnt.', '10 vnt.',
  '1 l', '2 l', '5 l', '10 l',
  '1 m', '5 m', '10 m', '50 m',
]

export interface CompletionReport {
  faultReason: string
  materialsYn: string
  material: string
  amount: string
  notes: string
}

interface Props {
  title: string
  subtitle: string
  elapsed: number
  onClose: () => void
  onConfirm: (report: CompletionReport) => void
}

export function UzduotisAtaskaitaScreen({ title, subtitle, onClose, onConfirm }: Props) {
  const [amount, setAmount] = useState('')

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="subtitle1" fontWeight={600}>Užduoties ataskaita</Typography>
        <IconButton size="small" onClick={onClose}><CloseIcon fontSize="small" /></IconButton>
      </Stack>

      <Box sx={{ mx: 2, my: 1.5, border: 1, borderColor: 'divider', borderRadius: '8px', p: 1.5 }}>
        <Typography variant="caption" color="text.secondary">{subtitle}</Typography>
        <Typography variant="body2" fontWeight={600}>{title}</Typography>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        <Box sx={{ px: 2, pt: 1.5, pb: 0.5 }}>
          <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Atlikto darbo informacija
          </Typography>
        </Box>
        <Divider />

        <Stack spacing={2} sx={{ px: 2, pt: 2 }}>
          <Box>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.25 }}>
              Medžiagos
            </Typography>
            <Typography variant="body2">Tepalas</Typography>
          </Box>

          <FormControl size="small" fullWidth>
            <InputLabel>Kiekis</InputLabel>
            <Select
              value={amount}
              label="Kiekis"
              onChange={e => setAmount(e.target.value)}
            >
              {AMOUNTS.map(a => (
                <MenuItem key={a} value={a}>{a}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Box>

      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button variant="contained" fullWidth onClick={() => onConfirm({ faultReason: '', materialsYn: 'Taip', material: 'Tepalas', amount, notes: '' })}>
          Patvirtinti
        </Button>
      </Box>
    </Box>
  )
}
