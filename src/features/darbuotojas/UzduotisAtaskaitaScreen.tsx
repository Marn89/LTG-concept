import { useState } from 'react'
import { NOW } from '../../utils/now'
import {
  Box, Typography, Stack, IconButton, Button, Divider,
  List, ListItemButton, ListItemText, TextField,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'

const FAULT_REASONS = [
  'Mechaninis gedimas',
  'Elektros gedimas',
  'Programinės įrangos klaida',
  'Aplinkos poveikis',
  'Nusidėvėjimas',
  'Vandalizmas',
  'Kita',
]

const MATERIALS = [
  'Alyva',
  'Bėgiai',
  'Kabeliai',
  'Signalizacijos moduliai',
  'Šviesaforo medžiagos',
  'Izoliuojančios jungtys',
  'Kontaktinis laidas',
]

const AMOUNTS = [
  '1 vnt.', '2 vnt.', '5 vnt.', '10 vnt.',
  '1 l', '2 l', '5 l', '10 l',
  '1 m', '5 m', '10 m', '50 m',
]

type Screen = 'form' | 'materials_yn' | 'fault_reason' | 'material' | 'amount'

function FieldRow({ label, value, onClick }: { label: string; value: string; onClick: () => void }) {
  return (
    <Box
      onClick={onClick}
      sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', cursor: 'pointer', '&:active': { bgcolor: 'action.hover' } }}
    >
      <Box sx={{ flex: 1 }}>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.25 }}>
          {label}
        </Typography>
        <Typography variant="body2" color={value ? 'text.primary' : 'text.disabled'}>
          {value || 'Pasirinkti…'}
        </Typography>
      </Box>
      <ChevronRightIcon sx={{ fontSize: 20, color: 'text.disabled', flexShrink: 0 }} />
    </Box>
  )
}

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

function formatElapsed(secs: number) {
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function UzduotisAtaskaitaScreen({ title, subtitle, elapsed, onClose, onConfirm }: Props) {
  const [screen, setScreen] = useState<Screen>('form')
  const [notes, setNotes] = useState('')
  const [materialsYn, setMaterialsYn] = useState('')
  const [faultReason, setFaultReason] = useState('')
  const [material, setMaterial] = useState('')
  const [amount, setAmount] = useState('')

  if (screen === 'materials_yn') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <Stack direction="row" alignItems="center" sx={{ px: 1, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
          <IconButton size="small" onClick={() => setScreen('form')}>
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>
          <Typography variant="subtitle1" fontWeight={600} sx={{ ml: 1 }}>
            Ar buvo naudojamos medžiagos?
          </Typography>
        </Stack>
        <List sx={{ flex: 1, overflowY: 'auto', p: 0 }}>
          {['Taip', 'Ne'].map((opt, i) => (
            <Box key={opt}>
              {i > 0 && <Divider />}
              <ListItemButton onClick={() => { setMaterialsYn(opt); if (opt === 'Ne') { setMaterial(''); setAmount('') } setScreen('form') }}>
                <ListItemText primary={opt} />
              </ListItemButton>
            </Box>
          ))}
        </List>
      </Box>
    )
  }

  if (screen === 'fault_reason') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <Stack direction="row" alignItems="center" sx={{ px: 1, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
          <IconButton size="small" onClick={() => setScreen('form')}>
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>
          <Typography variant="subtitle1" fontWeight={600} sx={{ ml: 1 }}>
            Gedimo priežastis
          </Typography>
        </Stack>
        <List sx={{ flex: 1, overflowY: 'auto', p: 0 }}>
          {FAULT_REASONS.map((opt, i) => (
            <Box key={opt}>
              {i > 0 && <Divider />}
              <ListItemButton onClick={() => { setFaultReason(opt); setScreen('form') }}>
                <ListItemText primary={opt} />
              </ListItemButton>
            </Box>
          ))}
        </List>
      </Box>
    )
  }

  if (screen === 'material') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <Stack direction="row" alignItems="center" sx={{ px: 1, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
          <IconButton size="small" onClick={() => setScreen('form')}>
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>
          <Typography variant="subtitle1" fontWeight={600} sx={{ ml: 1 }}>
            Medžiaga
          </Typography>
        </Stack>
        <List sx={{ flex: 1, overflowY: 'auto', p: 0 }}>
          {MATERIALS.map((opt, i) => (
            <Box key={opt}>
              {i > 0 && <Divider />}
              <ListItemButton onClick={() => { setMaterial(opt); setScreen('form') }}>
                <ListItemText primary={opt} />
              </ListItemButton>
            </Box>
          ))}
        </List>
      </Box>
    )
  }

  if (screen === 'amount') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <Stack direction="row" alignItems="center" sx={{ px: 1, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
          <IconButton size="small" onClick={() => setScreen('form')}>
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>
          <Typography variant="subtitle1" fontWeight={600} sx={{ ml: 1 }}>
            Kiekis
          </Typography>
        </Stack>
        <List sx={{ flex: 1, overflowY: 'auto', p: 0 }}>
          {AMOUNTS.map((opt, i) => (
            <Box key={opt}>
              {i > 0 && <Divider />}
              <ListItemButton onClick={() => { setAmount(opt); setScreen('form') }}>
                <ListItemText primary={opt} />
              </ListItemButton>
            </Box>
          ))}
        </List>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="subtitle1" fontWeight={600}>Užduoties ataskaita</Typography>
        <IconButton size="small" onClick={onClose}><CloseIcon fontSize="small" /></IconButton>
      </Stack>

      <Box sx={{ mx: 2, my: 1.5, border: 1, borderColor: 'divider', borderRadius: '8px', p: 1.5 }}>
        <Typography variant="caption" color="text.secondary">{subtitle}</Typography>
        <Typography variant="body2" fontWeight={600}>{title}</Typography>
        <Stack direction="row" spacing={3} sx={{ mt: 0.75 }}>
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">Atlikimo data</Typography>
            <Typography variant="body2">{NOW.toLocaleDateString('lt-LT')}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">Atlikimo laikas</Typography>
            <Typography variant="body2" sx={{ fontVariantNumeric: 'tabular-nums' }}>
              {formatElapsed(elapsed)}
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        <Box sx={{ px: 2, pt: 1.5, pb: 0.5 }}>
          <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Atlikto darbo informacija
          </Typography>
        </Box>
        <Divider />
        <FieldRow
          label="Ar buvo naudojamos medžiagos gedimui šalinti?"
          value={materialsYn}
          onClick={() => setScreen('materials_yn')}
        />
        <Divider />

        {materialsYn === 'Taip' && (
          <>
            <FieldRow label="Medžiaga" value={material} onClick={() => setScreen('material')} />
            <Divider />
            <FieldRow label="Kiekis" value={amount} onClick={() => setScreen('amount')} />
            <Divider />
          </>
        )}

        <FieldRow label="Gedimo priežastis" value={faultReason} onClick={() => setScreen('fault_reason')} />
        <Divider />
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.75 }}>
            Pastabos
          </Typography>
          <TextField
            fullWidth
            multiline
            minRows={3}
            placeholder="Įrašyti"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            onFocus={() => { if (!notes) setNotes('Reikėjo pakeisti apatinę ir viršutinę jungtis.') }}
            sx={{ '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
          />
        </Box>
      </Box>

      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button variant="contained" fullWidth onClick={() => onConfirm({ faultReason, materialsYn, material, amount, notes })}>
          Patvirtinti
        </Button>
      </Box>
    </Box>
  )
}
