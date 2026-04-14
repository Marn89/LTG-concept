import { useState } from 'react'
import {
  Box, Typography, Stack, IconButton, Divider, Button,
  Select, MenuItem, Chip, TextField, OutlinedInput, InputLabel, FormControl, Tooltip,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import { useNavigate, useParams } from 'react-router-dom'
import { usePranesimai } from '../darbuotojas/PranesiamaiContext'

interface Props { id?: string; onClose?: () => void; onConfirm?: () => void }

const TEAM_MEMBERS = [
  'Algirdas Rimkus', 'Kęstutis Norvaišas', 'Ramūnas Žilinskas',
  'Povilas Stankūnas', 'Henrikas Jokubaitis', 'Ričardas Butkevičius',
  'Tautvydas Mikalajūnas', 'Žygimantas Paulauskas',
]

const OPERATIONS = [
  'Patikrinti ir pakeisti gedusią dalį',
  'Atlikti profilaktinę patikrą',
  'Pakeisti kabelius',
  'Sutvarkyti signalizaciją',
  'Pakeisti šviesoforo lempas',
  'Atlikti sistemos diagnostiką',
  'Pakeisti defektuotą įrangą',
  'Atlikti techninę apžiūrą',
]

const MATERIALS = [
  'Bėgiai', 'Pabėgiai', 'Saulčiniai', 'Balastas', 'Kabeliai',
  'Signalizacijos moduliai', 'Izoliuojančios jungtys', 'Kontaktinis laidas',
  'Šviesaforo medžiagos',
]

function formatElapsed(secs: number) {
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ px: 2, py: 1 }}>
      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.25 }}>
        {label}
      </Typography>
      <Typography variant="body2" color={value ? 'text.primary' : 'text.disabled'}>
        {value || '—'}
      </Typography>
    </Box>
  )
}

export function VadovasPranesimasDetail({ id: propId, onClose, onConfirm }: Props = {}) {
  const navigate = useNavigate()
  const { id: paramId } = useParams()
  const id = propId ?? paramId
  const close = onClose ?? (() => navigate(-1))
  const { pranesimai, addPranesimas, removePranesimas, updateWorkOrderStatus } = usePranesimai()
  const p = pranesimai.find(n => n.id === id)

  const isWorkOrder = p?.pinType === 'work_order'

  // WO read-only defaults (for Darbo užsakymai tab)
  function defaultTeam(p: ReturnType<typeof pranesimai.find>) {
    if (!p) return []
    const hash = p.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
    return [TEAM_MEMBERS[hash % TEAM_MEMBERS.length], TEAM_MEMBERS[(hash + 3) % TEAM_MEMBERS.length]]
  }
  function defaultDate(p: ReturnType<typeof pranesimai.find>) {
    if (!p) return ''
    const d = new Date(p.createdDate)
    d.setDate(d.getDate() + 7)
    return d.toISOString().slice(0, 10)
  }
  function defaultMaterials(p: ReturnType<typeof pranesimai.find>) {
    if (!p) return []
    const hash = p.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
    return [MATERIALS[hash % MATERIALS.length]]
  }
  function defaultOperation(p: ReturnType<typeof pranesimai.find>) {
    if (!p) return ''
    const hash = p.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
    return OPERATIONS[(hash + 2) % OPERATIONS.length]
  }

  const woTeam = p?.woTeam ?? defaultTeam(p)
  const woSeniorName = p?.woSeniorName ?? (woTeam.length > 0 ? woTeam[0] : null)
  const woDate = p?.woCompletionDate ?? defaultDate(p)
  const woMaterials = p?.woMaterials ?? defaultMaterials(p)
  const woOperation = p?.woOperation ?? defaultOperation(p)

  // Editable form state (for Pranešimai tab)
  const [selectedNames, setSelectedNames] = useState<string[]>([])
  const [seniorName, setSeniorName] = useState<string | null>(null)
  const [completionDate, setCompletionDate] = useState('')
  const [material, setMaterial] = useState('')
  const [operation, setOperation] = useState('')

  const handleNameChange = (names: string[]) => {
    setSelectedNames(names)
    if (seniorName && !names.includes(seniorName)) setSeniorName(null)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="subtitle1" fontWeight={600}>
          {isWorkOrder ? 'Darbo užsakymas' : 'Pranešimas'}
        </Typography>
        <IconButton size="small" onClick={close}><CloseIcon fontSize="small" /></IconButton>
      </Stack>

      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        {p && (
          <>
            <FieldRow label="Funkcinė lokacija" value={p.functionalLocation} />
            <FieldRow label="Techninis objektas" value={p.techObject} />
            <FieldRow label="Gedimo tipas" value={p.faultType} />

            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.25 }}>
                Papildoma informacija
              </Typography>
              <Typography variant="body2">{p.notes || '—'}</Typography>
            </Box>

            <Box sx={{ px: 2, py: 2 }}>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                Nuotraukos
              </Typography>
              <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 0.5 }}>
                {(p.photos.length > 0 ? p.photos : ['/images/railway-signal-snow.jpg']).map((src, i) => (
                  <Box key={i} component="img" src={src}
                    sx={{ width: 80, height: 80, borderRadius: '8px', flexShrink: 0, objectFit: 'cover' }}
                  />
                ))}
              </Stack>
            </Box>

            <Divider />

            {isWorkOrder ? (
              <>
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.25 }}>
                    Komanda
                  </Typography>
                  {p.workOrderStatus === 'backlog' || woTeam.length === 0 ? (
                    <Typography variant="body2" color="text.disabled">—</Typography>
                  ) : woTeam.map(name => (
                    <Stack key={name} direction="row" alignItems="center" spacing={0.5}>
                      <Typography variant="body2">{name}</Typography>
                      {name === woSeniorName && (
                        <Tooltip title="Vyr. Technikas" placement="right">
                          <ManageAccountsIcon sx={{ fontSize: 14, color: '#F59E0B', cursor: 'default' }} />
                        </Tooltip>
                      )}
                    </Stack>
                  ))}
                </Box>
                <FieldRow label="Atlikimo data" value={woDate || '—'} />
                <FieldRow label="Medžiagos" value={woMaterials.join(', ') || '—'} />
                <FieldRow label="Operacija (ką atlikti)" value={woOperation || '—'} />
                {p.completionReport && (
                  <>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ px: 2, py: 0.5 }}>
                      <Typography variant="caption" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 0.5, color: '#8B5CF6' }}>
                        Darbuotojo ataskaita
                      </Typography>
                    </Box>
                    <FieldRow label="Atlikimo data" value={p.completionReport.completedAt} />
                    <FieldRow label="Sugaištas laikas" value={formatElapsed(p.completionReport.elapsed)} />
                    <FieldRow label="Gedimo priežastis" value={p.completionReport.faultReason || '—'} />
                    <FieldRow label="Naudotos medžiagos" value={p.completionReport.materialsYn === 'Taip' ? `${p.completionReport.material} – ${p.completionReport.amount}` : 'Ne'} />
                    {p.completionReport.notes ? (
                      <Box sx={{ px: 2, py: 1 }}>
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.25 }}>Pastabos</Typography>
                        <Typography variant="body2">{p.completionReport.notes}</Typography>
                      </Box>
                    ) : null}
                  </>
                )}
              </>
            ) : (
              <Box sx={{ px: 2, py: 2, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Pasirinkti komandą</InputLabel>
                  <Select
                    multiple
                    value={selectedNames}
                    onChange={e => handleNameChange(e.target.value as string[])}
                    input={<OutlinedInput label="Pasirinkti komandą" />}
                    renderValue={selected => `${selected.length} nariai`}
                  >
                    {TEAM_MEMBERS.map(name => (
                      <MenuItem key={name} value={name}>{name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {selectedNames.length > 0 && (
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                      Spustelėkite žvaigždutę, kad paskirtumėte vyresnįjį specialistą
                    </Typography>
                    <Stack direction="row" flexWrap="wrap" gap={1}>
                      {selectedNames.map(name => (
                        <Chip
                          key={name}
                          label={name}
                          size="small"
                          onClick={() => setSeniorName(seniorName === name ? null : name)}
                          icon={seniorName === name
                            ? <ManageAccountsIcon sx={{ fontSize: 14, color: '#F59E0B !important' }} />
                            : <PersonOutlineIcon sx={{ fontSize: 14 }} />
                          }
                          sx={seniorName === name ? { bgcolor: '#FFF8E1', border: 1, borderColor: '#F59E0B', cursor: 'pointer' } : { cursor: 'pointer' }}
                        />
                      ))}
                    </Stack>
                  </Box>
                )}

                <TextField
                  label="Atlikimo data"
                  type="date"
                  size="small"
                  fullWidth
                  value={completionDate}
                  onChange={e => setCompletionDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />

                <FormControl fullWidth size="small">
                  <InputLabel>Medžiagos</InputLabel>
                  <Select
                    value={material}
                    onChange={e => setMaterial(e.target.value)}
                    label="Medžiagos"
                  >
                    {MATERIALS.map(m => (
                      <MenuItem key={m} value={m}>{m}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth size="small">
                  <InputLabel>Operacija (ką atlikti)</InputLabel>
                  <Select
                    value={operation}
                    onChange={e => setOperation(e.target.value)}
                    label="Operacija (ką atlikti)"
                  >
                    {OPERATIONS.map(o => (
                      <MenuItem key={o} value={o}>{o}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {operation && (
                  <Box sx={{ bgcolor: 'grey.50', border: 1, borderColor: 'divider', borderRadius: '8px', px: 2, py: 1.5 }}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">Nuvykimas</Typography>
                      <Typography variant="body2">2.5 val.</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
                      <Typography variant="body2" color="text.secondary">Darbo atlikimas</Typography>
                      <Typography variant="body2">2 val.</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between" sx={{ borderTop: 1, borderColor: 'divider', pt: 0.75 }}>
                      <Typography variant="body2" fontWeight={600}>Viso</Typography>
                      <Typography variant="body2" fontWeight={600}>4.5 val.</Typography>
                    </Stack>
                  </Box>
                )}
              </Box>
            )}
          </>
        )}
      </Box>

      {isWorkOrder && p?.workOrderStatus === 'pending_approval' && (
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button variant="contained" fullWidth onClick={() => { updateWorkOrderStatus(id!, 'done'); close() }}>
            Patvirtinti
          </Button>
        </Box>
      )}
      {!isWorkOrder && (
        <Stack spacing={1} sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button variant="contained" fullWidth onClick={() => {
            if (p) {
              addPranesimas({
                functionalLocation: p.functionalLocation,
                gpsCoordinates: p.gpsCoordinates,
                techObject: p.techObject,
                faultType: p.faultType,
                notes: p.notes,
                location: p.location,
                photos: p.photos,
                pinType: 'work_order',
                workOrderStatus: 'planned',
                woTeam: selectedNames,
                woSeniorName: seniorName ?? undefined,
                woCompletionDate: completionDate || undefined,
                woMaterials: material ? [material] : [],
                woOperation: operation || undefined,
              })
              removePranesimas(id!)
            }
            onConfirm ? onConfirm() : close()
          }}>
            Sukurti darbo užsakymą
          </Button>
          <Button variant="outlined" color="error" fullWidth onClick={() => { removePranesimas(id!); close() }}>
            Atmesti
          </Button>
        </Stack>
      )}
    </Box>
  )
}
