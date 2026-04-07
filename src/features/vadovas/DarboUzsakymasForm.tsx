import { useNavigate, useParams } from 'react-router-dom'
import { Box, Stack, Typography, IconButton, Button, Divider } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { usePranesimai } from '../darbuotojas/PranesiamaiContext'
import { useWoForm } from './WoFormContext'
import { useWo } from './WoContext'
import type { WoStatus } from '../darbuotojas/data'

const statusOptions = [
  { value: 'ctrd_prel', label: 'CTRD/PREL' },
  { value: 'rel',       label: 'REL' },
  { value: 'msgs',      label: 'MSGS' },
  { value: 'tech',      label: 'TECH' },
]

function SelectRow({ label, value, onPress }: { label: string; value: string; onPress: () => void }) {
  return (
    <Box
      onClick={onPress}
      sx={{ cursor: 'pointer', '&:active': { opacity: 0.6 } }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 2 }}>
        <Typography variant="body1">{label}</Typography>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Typography variant="body2" color={value ? 'text.primary' : 'text.disabled'}>
            {value || '—'}
          </Typography>
          <ChevronRightIcon fontSize="small" sx={{ color: 'text.disabled' }} />
        </Stack>
      </Stack>
      <Divider />
    </Box>
  )
}

export function DarboUzsakymasForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { pranesimai } = usePranesimai()
  const p = pranesimai.find(n => n.id === id)
  const { selectedWorkers, selectedEquipment, status, completionDate } = useWoForm()
  const { addWorkOrder } = useWo()


  const statusLabel = statusOptions.find(s => s.value === status)?.label ?? '—'
  const dateDisplay = completionDate
    ? new Date(completionDate).toLocaleDateString('lt-LT', { year: 'numeric', month: 'long', day: 'numeric' })
    : '—'
  const workersDisplay = selectedWorkers.length === 0
    ? '—'
    : selectedWorkers.length === 1
      ? selectedWorkers[0]
      : `${selectedWorkers[0]} +${selectedWorkers.length - 1}`

  const equipmentList = selectedEquipment ? selectedEquipment.split(',') : []
  const equipmentDisplay = equipmentList.length === 0
    ? '—'
    : equipmentList.length === 1
      ? equipmentList[0]
      : `${equipmentList[0]} +${equipmentList.length - 1}`

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="subtitle1" fontWeight={600}>Sukurti darbo užsakymą</Typography>
        <IconButton size="small" onClick={() => navigate(-1)}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Stack>

      <Box sx={{ flex: 1, overflowY: 'auto', px: 2 }}>
        {p && (
          <Box sx={{ py: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary" display="block">Pranešimas</Typography>
            <Typography variant="body1">{p.description}</Typography>
          </Box>
        )}

        <SelectRow
          label="Darbo atlikimo diena"
          value={dateDisplay}
          onPress={() => navigate(`/vadovas/pranesimai/${id}/uzsakymas/data`)}
        />
        <SelectRow
          label="Priskirti darbuotojus"
          value={workersDisplay}
          onPress={() => navigate(`/vadovas/pranesimai/${id}/uzsakymas/darbuotojai`)}
        />
        <SelectRow
          label="Pridėti įrangą"
          value={equipmentDisplay}
          onPress={() => navigate(`/vadovas/pranesimai/${id}/uzsakymas/iranga`)}
        />
        <SelectRow
          label="Pasirinkti statusą"
          value={statusLabel}
          onPress={() => navigate(`/vadovas/pranesimai/${id}/uzsakymas/statusas`)}
        />
      </Box>

      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button variant="contained" fullWidth onClick={() => {
          addWorkOrder({
            title: p?.description ?? 'Darbo užsakymas',
            location: p?.functionalLocation ?? '—',
            date: completionDate || new Date().toISOString().slice(0, 10),
            time: new Date().toLocaleTimeString('lt-LT', { hour: '2-digit', minute: '2-digit' }),
            status: (status || 'ctrd_prel') as WoStatus,
            workerName: selectedWorkers.length > 0 ? selectedWorkers.join(', ') : '—',
          })
          navigate('/vadovas?tab=1')
        }}>
          Patvirtinti
        </Button>
      </Box>
    </Box>
  )
}
