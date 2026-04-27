import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Typography, IconButton, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Stack, Checkbox, FormControlLabel, Divider,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { WebAppShell } from '../layout/WebAppShell'
import { UZDUOTYS_LIST } from '../data/uzduotys'

function normalizeDaznis(raw: string): string {
  const map: [RegExp, (m: RegExpMatchArray) => string][] = [
    [/^Kartą per (.+)$/, m => `Kartoti kas ${m[1]}`],
    [/^Du kartus per (.+)$/, m => `Kartoti kas 2 ${m[1]}`],
    [/^Tris kartus per (.+)$/, m => `Kartoti kas 3 ${m[1]}`],
    [/^Keturis kartus per (.+)$/, m => `Kartoti kas 4 ${m[1]}`],
  ]
  for (const [re, fn] of map) {
    const m = raw.match(re)
    if (m) return fn(m)
  }
  return raw
}

function parseUzduotis(raw: string) {
  const match = raw.match(/^([\d.]+[a-z]?)\.\s+(.+?)\s+\[(.+)\]$/)
  if (!match) return { numeris: '', pavadinimas: raw, daznis: '' }
  return { numeris: match[1], pavadinimas: match[2], daznis: normalizeDaznis(match[3]) }
}

function compareNumeris(a: string, b: string) {
  const parts = (s: string) =>
    s.split('.').flatMap(p => {
      const m = p.match(/^(\d+)([a-z]*)$/)
      return m ? [parseInt(m[1]), m[2]] : [0, p]
    })
  const ap = parts(a), bp = parts(b)
  for (let i = 0; i < Math.max(ap.length, bp.length); i++) {
    const av = ap[i] ?? '', bv = bp[i] ?? ''
    if (av < bv) return -1
    if (av > bv) return 1
  }
  return 0
}

const PERIODAS_OPTIONS = [
  { value: 'savaitę', label: 'savaitė' },
  { value: 'mėnesį', label: 'mėnesis' },
  { value: 'metus', label: 'metai' },
  { value: '2 metus', label: '2 metai' },
  { value: '3 metus', label: '3 metai' },
  { value: '5 metus', label: '5 metai' },
]

const DIENOS = ['P', 'A', 'T', 'K', 'Pn', 'Š', 'S']

function parseDaznis(daznis: string): { kiekis: number; periodas: string } {
  // "Kartoti kas 2 metus"
  const m1 = daznis.match(/^Kartoti kas (\d+) (.+)$/)
  if (m1) return { kiekis: parseInt(m1[1]), periodas: m1[2] }
  // "Kartoti kas savaitę"
  const m2 = daznis.match(/^Kartoti kas (.+)$/)
  if (m2) return { kiekis: 1, periodas: m2[1] }
  return { kiekis: 1, periodas: 'savaitę' }
}

function buildDaznis(kiekis: number, periodas: string) {
  return kiekis === 1 ? `Kartoti kas ${periodas}` : `Kartoti kas ${kiekis} ${periodas}`
}

interface FrequencyPickerProps {
  kiekis: number
  periodas: string
  selectedDienos: string[]
  lanksti: boolean
  lankstumas: number
  onKiekis: (v: number) => void
  onPeriodas: (v: string) => void
  onToggleDiena: (d: string) => void
  onLanksti: (v: boolean) => void
  onLankstumas: (v: number) => void
}

function FrequencyPicker({ kiekis, periodas, selectedDienos, lanksti, lankstumas, onKiekis, onPeriodas, onToggleDiena, onLanksti, onLankstumas }: FrequencyPickerProps) {
  return (
    <Stack spacing={2}>
      <Typography variant="caption" fontWeight={700} sx={{ letterSpacing: 0.5, textTransform: 'uppercase' }}>
        Darbų atlikimo dažnumas
      </Typography>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>Kartoti kas</Typography>
        <TextField
          select size="small" value={kiekis}
          onChange={e => onKiekis(Number(e.target.value))}
          sx={{ width: 72 }}
        >
          {[1, 2, 3, 4, 5, 6].map(n => <MenuItem key={n} value={n}>{n}</MenuItem>)}
        </TextField>
        <TextField
          select size="small" value={periodas}
          onChange={e => onPeriodas(e.target.value)}
          sx={{ flex: 1 }}
        >
          {PERIODAS_OPTIONS.map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
        </TextField>
      </Stack>
      {periodas === 'savaitę' && (
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Pasirinkite kurią dieną
          </Typography>
          <Stack direction="row" spacing={0.75}>
            {DIENOS.map(d => {
              const active = selectedDienos.includes(d)
              return (
                <Box
                  key={d}
                  onClick={() => onToggleDiena(d)}
                  sx={{
                    width: 36, height: 36,
                    borderRadius: '50%',
                    border: '1.5px solid',
                    borderColor: active ? 'primary.main' : 'divider',
                    backgroundColor: active ? 'primary.main' : 'transparent',
                    color: active ? 'primary.contrastText' : 'text.primary',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                >
                  <Typography variant="caption" fontWeight={500}>{d}</Typography>
                </Box>
              )
            })}
          </Stack>
        </Box>
      )}
      <Box>
        <FormControlLabel
          control={<Checkbox size="small" checked={lanksti} onChange={e => onLanksti(e.target.checked)} />}
          label={<Typography variant="body2">Lanksti darbų atlikimo data</Typography>}
        />
        {lanksti && (
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1, ml: 0.5 }}>
            <Typography variant="body2" color="text.secondary">Nukrypimas:</Typography>
            <IconButton
              size="small"
              onClick={() => onLankstumas(Math.max(1, lankstumas - 1))}
              sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}
            >
              <Typography variant="body2" fontWeight={600}>−</Typography>
            </IconButton>
            <Typography variant="body2" fontWeight={500} sx={{ minWidth: 48, textAlign: 'center' }}>
              ±{lankstumas} d.
            </Typography>
            <IconButton
              size="small"
              onClick={() => onLankstumas(lankstumas + 1)}
              sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}
            >
              <Typography variant="body2" fontWeight={600}>+</Typography>
            </IconButton>
          </Stack>
        )}
      </Box>
    </Stack>
  )
}

interface Row { numeris: string; pavadinimas: string; daznis: string }

const baseRows: Row[] = UZDUOTYS_LIST.map(parseUzduotis).sort((a, b) => compareNumeris(a.numeris, b.numeris))
const customRows: Row[] = []

export function UzduotysPage() {
  const navigate = useNavigate()
  const [rows, setRows] = useState<Row[]>(() => [...baseRows, ...customRows])
  const [open, setOpen] = useState(false)
  const [viewRow, setViewRow] = useState<Row | null>(null)
  const [editMode, setEditMode] = useState(false)

  // create form state
  const [numeris, setNumeris] = useState('')
  const [pavadinimas, setPavadinimas] = useState('')
  const [kiekis, setKiekis] = useState(1)
  const [periodas, setPeriodasState] = useState('savaitę')
  const [selectedDienos, setSelectedDienos] = useState<string[]>([])
  const [lanksti, setLanksti] = useState(false)
  const [lankstumas, setLankstumas] = useState(1)

  // edit form state
  const [editNumeris, setEditNumeris] = useState('')
  const [editPavadinimas, setEditPavadinimas] = useState('')
  const [editKiekis, setEditKiekis] = useState(1)
  const [editPeriodas, setEditPeriodas] = useState('savaitę')
  const [editSelectedDienos, setEditSelectedDienos] = useState<string[]>([])
  const [editLanksti, setEditLanksti] = useState(false)
  const [editLankstumas, setEditLankstumas] = useState(1)

  function handleSave() {
    const newRow = { numeris, pavadinimas, daznis: buildDaznis(kiekis, periodas) }
    customRows.push(newRow)
    setRows([...baseRows, ...customRows].sort((a, b) => compareNumeris(a.numeris, b.numeris)))
    setOpen(false)
    setNumeris(''); setPavadinimas(''); setKiekis(1); setPeriodasState('savaitę')
    setSelectedDienos([]); setLanksti(false); setLankstumas(1)
  }

  function enterEdit(row: Row) {
    const { kiekis: k, periodas: p } = parseDaznis(row.daznis)
    setEditNumeris(row.numeris)
    setEditPavadinimas(row.pavadinimas)
    setEditKiekis(k)
    setEditPeriodas(p)
    setEditSelectedDienos([])
    setEditLanksti(false)
    setEditLankstumas(1)
    setEditMode(true)
  }

  function handleEditSave() {
    const updated = { numeris: editNumeris, pavadinimas: editPavadinimas, daznis: buildDaznis(editKiekis, editPeriodas) }
    setRows(prev =>
      prev.map(r => r === viewRow ? updated : r)
        .sort((a, b) => compareNumeris(a.numeris, b.numeris))
    )
    setViewRow(updated)
    setEditMode(false)
  }

  return (
    <WebAppShell>
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton size="small" onClick={() => navigate('/planuotojas')}>
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          <Typography variant="subtitle1" fontWeight={600} sx={{ flex: 1 }}>Užduotys</Typography>
          <Button variant="contained" size="small" disableElevation onClick={() => setOpen(true)}>
            Sukurti naują užduotį
          </Button>
        </Box>
        <TableContainer sx={{ flex: 1, overflowY: 'auto' }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Nr.</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Užduoties pavadinimas</TableCell>
                <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Atlikimo dažnis</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, i) => (
                <TableRow key={i} hover sx={{ cursor: 'pointer' }} onClick={() => setViewRow(row)}>
                  <TableCell sx={{ whiteSpace: 'nowrap', color: 'text.secondary' }}>
                    <Typography variant="caption">{row.numeris}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">{row.pavadinimas}</Typography>
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    <Typography variant="caption">{row.daznis}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* View / Edit dialog */}
      <Dialog
        open={!!viewRow}
        onClose={() => { setViewRow(null); setEditMode(false) }}
        fullWidth maxWidth="xs"
      >
        <DialogTitle>{editMode ? 'Redaguoti užduotį' : 'Užduotis'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {editMode ? (
              <>
                <TextField
                  label="Užduoties numeris" size="small" fullWidth
                  value={editNumeris} onChange={e => setEditNumeris(e.target.value)}
                />
                <TextField
                  label="Užduoties pavadinimas" size="small" fullWidth multiline minRows={2}
                  value={editPavadinimas} onChange={e => setEditPavadinimas(e.target.value)}
                />
                <Divider />
                <FrequencyPicker
                  kiekis={editKiekis} periodas={editPeriodas}
                  selectedDienos={editSelectedDienos} lanksti={editLanksti} lankstumas={editLankstumas}
                  onKiekis={setEditKiekis} onPeriodas={setEditPeriodas}
                  onToggleDiena={d => setEditSelectedDienos(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d])}
                  onLanksti={setEditLanksti} onLankstumas={setEditLankstumas}
                />
              </>
            ) : (
              <>
                <Box>
                  <Typography variant="caption" color="text.secondary">Numeris</Typography>
                  <Typography variant="body2" fontWeight={500}>{viewRow?.numeris}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Pavadinimas</Typography>
                  <Typography variant="body2">{viewRow?.pavadinimas}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Atlikimo dažnis</Typography>
                  <Typography variant="body2">{viewRow?.daznis}</Typography>
                </Box>
              </>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          {editMode ? (
            <>
              <Button onClick={() => setEditMode(false)}>Atšaukti</Button>
              <Button
                variant="contained" disableElevation
                disabled={!editNumeris.trim() || !editPavadinimas.trim()}
                onClick={handleEditSave}
              >
                Išsaugoti
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => { setViewRow(null); setEditMode(false) }}>Uždaryti</Button>
              <Button variant="outlined" onClick={() => enterEdit(viewRow!)}>Redaguoti</Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Create dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Nauja užduotis</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Užduoties numeris" size="small" fullWidth
              value={numeris} onChange={e => setNumeris(e.target.value)} placeholder="pvz. 15.1"
            />
            <TextField
              label="Užduoties pavadinimas" size="small" fullWidth multiline minRows={2}
              value={pavadinimas} onChange={e => setPavadinimas(e.target.value)}
            />
            <Divider />
            <FrequencyPicker
              kiekis={kiekis} periodas={periodas}
              selectedDienos={selectedDienos} lanksti={lanksti} lankstumas={lankstumas}
              onKiekis={setKiekis} onPeriodas={setPeriodasState}
              onToggleDiena={d => setSelectedDienos(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d])}
              onLanksti={setLanksti} onLankstumas={setLankstumas}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Atšaukti</Button>
          <Button
            variant="contained" disableElevation
            disabled={!numeris.trim() || !pavadinimas.trim()}
            onClick={handleSave}
          >
            Išsaugoti
          </Button>
        </DialogActions>
      </Dialog>
    </WebAppShell>
  )
}
