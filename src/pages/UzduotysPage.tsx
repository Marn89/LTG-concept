import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import {
  Box, Typography, IconButton, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, MenuItem, Stack, Checkbox, FormControlLabel, Divider,
  Drawer, Chip, Autocomplete,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

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

const DARBO_CENTRAS_OPTIONS = [
  'Kelių priežiūra',
  'Automatikos ir ryšių priežiūra',
  'Elektros ir kontaktinio tinklo priežiūra',
]

const ATRIBUTAI_OPTIONS: { label: string; group: string }[] = [
  // Objekto grupė
  { label: 'APS (Automatinė pervažų signalizacija)',    group: 'Objekto grupė' },
  { label: 'Ašių skaičiavimo sistemos',                 group: 'Objekto grupė' },
  { label: 'Bekontakčiai kelio jutikliai',              group: 'Objekto grupė' },
  { label: 'Bėgių grandinės',                           group: 'Objekto grupė' },
  { label: 'Elektros tiekimas',                         group: 'Objekto grupė' },
  { label: 'Fotoelektriniai / radiotechniniai jutikliai', group: 'Objekto grupė' },
  { label: 'Gabarito kontrolės įrenginiai',             group: 'Objekto grupė' },
  { label: 'Gelžbetoninės konstrukcijos',               group: 'Objekto grupė' },
  { label: 'Iešmai',                                    group: 'Objekto grupė' },
  { label: 'Kabelių tinklas ir montažas',               group: 'Objekto grupė' },
  { label: 'Mikroprocesorinės sistemos (MPC/SKMPC)',    group: 'Objekto grupė' },
  { label: 'Signalizacijos aparatinė įranga',           group: 'Objekto grupė' },
  { label: 'Sąryšis ir veikimo parametrai',             group: 'Objekto grupė' },
  { label: 'Tunelių ir tiltų signalizacija',            group: 'Objekto grupė' },
  { label: 'Vagonų stabdikliai',                        group: 'Objekto grupė' },
  { label: 'Valdymo įrenginiai',                        group: 'Objekto grupė' },
  { label: 'Šviesoforai',                               group: 'Objekto grupė' },
  // Sistemos
  { label: 'EC, MPC',                                                     group: 'Sistemos' },
  { label: 'EC, MPC, RSĮ, SKEC, SKMPC',                                   group: 'Sistemos' },
  { label: 'Ecostar (EC/MPC)',                                             group: 'Sistemos' },
  { label: 'Ecostar 4 (EC/MPC)',                                           group: 'Sistemos' },
  { label: 'Hidrolink',                                                    group: 'Sistemos' },
  { label: 'Fotoelektriniai jutikliai (SKEC)',                             group: 'Sistemos' },
  { label: 'Keldėžės ir UPM movos',                                        group: 'Sistemos' },
  { label: 'Kontroliniai užraktai (RSĮ)',                                  group: 'Sistemos' },
  { label: 'Kontroliniai užraktai (RSĮ) — kiti keliai',                   group: 'Sistemos' },
  { label: 'Kontroliniai užraktai (RSĮ) — pagr. ir nestabdomo prav.',     group: 'Sistemos' },
  { label: 'Pneumatinio valymo įrenginiai',                                group: 'Sistemos' },
  { label: 'Radiotechniniai jutikliai (SKEC)',                             group: 'Sistemos' },
  { label: 'S700 (SKEC/SKMPC) — kalnelio keliai',                         group: 'Sistemos' },
  { label: 'S700 (SKMPC)',                                                 group: 'Sistemos' },
  { label: 'SP-6 (EC/MPC)',                                                group: 'Sistemos' },
  { label: 'Unistar (EC/MPC)',                                             group: 'Sistemos' },
  { label: 'Visi jutikliai (SKEC)',                                        group: 'Sistemos' },
  // Kelio tipas
  { label: 'Pagrindiniuose ir nestabdomuose keliuose', group: 'Kelio tipas' },
  { label: 'Kituose keliuose',                         group: 'Kelio tipas' },
  { label: 'Atvykimo keliuose',                        group: 'Kelio tipas' },
  { label: 'Kalnelio keliuose',                        group: 'Kelio tipas' },
]

const MINUTES_OPTIONS = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]

function parseDaznis(daznis: string): { kiekis: number; periodas: string } {
  const m1 = daznis.match(/^Kartoti kas (\d+) (.+)$/)
  if (m1) return { kiekis: parseInt(m1[1]), periodas: m1[2] }
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

interface Row {
  numeris: string
  pavadinimas: string
  daznis: string
  darboCentras?: string
  zmoniuSkaicius?: number
  atributai?: string[]
  trupmeVal?: number
  trupmeMin?: number
}

import { UZDUOTYS_LIST } from '../data/uzduotys'

function dr(seed: number, max: number) {
  return Math.floor(Math.abs(Math.sin(seed * 9301 + 49297) * 233280)) % max
}

function fillDefaults(row: Row, i: number): Row {
  const atributaiCount = dr(i, 3) + 1
  const picked = new Set<string>()
  let attempt = 0
  while (picked.size < atributaiCount && attempt < 60) {
    picked.add(ATRIBUTAI_OPTIONS[dr(i * 7 + attempt++, ATRIBUTAI_OPTIONS.length)].label)
  }
  return {
    ...row,
    darboCentras: DARBO_CENTRAS_OPTIONS[dr(i + 10, DARBO_CENTRAS_OPTIONS.length)],
    zmoniuSkaicius: dr(i + 20, 4) + 1,
    atributai: Array.from(picked),
    trupmeVal: dr(i + 30, 4),
    trupmeMin: MINUTES_OPTIONS[dr(i + 40, MINUTES_OPTIONS.length)],
  }
}

const baseRows: Row[] = UZDUOTYS_LIST.map((raw, i) => fillDefaults(parseUzduotis(raw), i)).sort((a, b) => compareNumeris(a.numeris, b.numeris))
const customRows: Row[] = []

function resetCreateForm() {
  return {
    numeris: '', pavadinimas: '',
    kiekis: 1, periodas: 'savaitę',
    selectedDienos: [] as string[], lanksti: false, lankstumas: 1,
    darboCentras: '', zmoniuSkaicius: 1, atributai: [] as string[],
    trupmeVal: 0, trupmeMin: 0,
  }
}

export function UzduotysTabContent() {
  const [rows, setRows] = useState<Row[]>(() => [...baseRows, ...customRows])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [viewRow, setViewRow] = useState<Row | null>(null)
  const [editMode, setEditMode] = useState(false)

  // create form
  const [numeris, setNumeris] = useState('')
  const [pavadinimas, setPavadinimas] = useState('')
  const [kiekis, setKiekis] = useState(1)
  const [periodas, setPeriodasState] = useState('savaitę')
  const [selectedDienos, setSelectedDienos] = useState<string[]>([])
  const [lanksti, setLanksti] = useState(false)
  const [lankstumas, setLankstumas] = useState(1)
  const [darboCentras, setDarboCentras] = useState('')
  const [zmoniuSkaicius, setZmoniuSkaicius] = useState(1)
  const [atributai, setAtributai] = useState<string[]>([])
  const [trupmeVal, setTrupmeVal] = useState(0)
  const [trupmeMin, setTrupmeMin] = useState(0)

  // filters
  const [filterSearch, setFilterSearch] = useState('')
  const [filterDarboCentras, setFilterDarboCentras] = useState<string[]>([])
  const [filterAtributai, setFilterAtributai] = useState<string[]>([])
  const [filterZmoniai, setFilterZmoniai] = useState<number | ''>('')

  // edit form
  const [editNumeris, setEditNumeris] = useState('')
  const [editPavadinimas, setEditPavadinimas] = useState('')
  const [editKiekis, setEditKiekis] = useState(1)
  const [editPeriodas, setEditPeriodas] = useState('savaitę')
  const [editSelectedDienos, setEditSelectedDienos] = useState<string[]>([])
  const [editLanksti, setEditLanksti] = useState(false)
  const [editLankstumas, setEditLankstumas] = useState(1)

  function closeDrawer() {
    setDrawerOpen(false)
    const f = resetCreateForm()
    setNumeris(f.numeris); setPavadinimas(f.pavadinimas)
    setKiekis(f.kiekis); setPeriodasState(f.periodas)
    setSelectedDienos(f.selectedDienos); setLanksti(f.lanksti); setLankstumas(f.lankstumas)
    setDarboCentras(f.darboCentras); setZmoniuSkaicius(f.zmoniuSkaicius)
    setAtributai(f.atributai); setTrupmeVal(f.trupmeVal); setTrupmeMin(f.trupmeMin)
  }

  function handleSave() {
    const newRow: Row = {
      numeris, pavadinimas, daznis: buildDaznis(kiekis, periodas),
      darboCentras, zmoniuSkaicius, atributai, trupmeVal, trupmeMin,
    }
    customRows.push(newRow)
    setRows([...baseRows, ...customRows].sort((a, b) => compareNumeris(a.numeris, b.numeris)))
    closeDrawer()
  }

  function enterEdit(row: Row) {
    const { kiekis: k, periodas: p } = parseDaznis(row.daznis)
    setEditNumeris(row.numeris); setEditPavadinimas(row.pavadinimas)
    setEditKiekis(k); setEditPeriodas(p)
    setEditSelectedDienos([]); setEditLanksti(false); setEditLankstumas(1)
    setEditMode(true)
  }

  function handleEditSave() {
    const updated: Row = { ...viewRow!, numeris: editNumeris, pavadinimas: editPavadinimas, daznis: buildDaznis(editKiekis, editPeriodas) }
    setRows(prev => prev.map(r => r === viewRow ? updated : r).sort((a, b) => compareNumeris(a.numeris, b.numeris)))
    setViewRow(updated)
    setEditMode(false)
  }

  const filteredRows = rows.filter(row => {
    if (filterSearch && !`${row.numeris} ${row.pavadinimas}`.toLowerCase().includes(filterSearch.toLowerCase())) return false
    if (filterDarboCentras.length && !filterDarboCentras.includes(row.darboCentras ?? '')) return false
    if (filterAtributai.length && !filterAtributai.every(a => row.atributai?.includes(a))) return false
    if (filterZmoniai !== '' && row.zmoniuSkaicius !== filterZmoniai) return false
    return true
  })

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h6" fontWeight={600}>Visos užduotys</Typography>
        </Box>
        <Button variant="contained" size="small" disableElevation onClick={() => setDrawerOpen(true)}>
          Sukurti naują užduotį
        </Button>
      </Box>

      {/* Filter bar */}
      <Box sx={{ px: 2, pt: 1.5, pb: 1, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            size="small" placeholder="Ieškoti pagal pavadinimą..." value={filterSearch}
            onChange={e => setFilterSearch(e.target.value)}
            sx={{ flex: '1 1 200px', minWidth: 180 }}
          />
          <Autocomplete
            multiple size="small"
            options={DARBO_CENTRAS_OPTIONS}
            value={filterDarboCentras}
            onChange={(_, v) => setFilterDarboCentras(v)}
            renderTags={() => null}
            renderInput={params => <TextField {...params} label="Darbo centras" />}
            sx={{ flex: '0 0 220px' }}
          />
          <Autocomplete
            multiple size="small"
            options={ATRIBUTAI_OPTIONS}
            groupBy={o => o.group}
            getOptionLabel={o => o.label}
            isOptionEqualToValue={(o, v) => o.label === v.label}
            value={ATRIBUTAI_OPTIONS.filter(o => filterAtributai.includes(o.label))}
            onChange={(_, v) => setFilterAtributai(v.map(o => o.label))}
            renderTags={() => null}
            renderInput={params => <TextField {...params} label="Atributai" />}
            sx={{ flex: '1 1 220px', minWidth: 200 }}
          />
          <TextField
            select size="small" label="Min. žmonių sk." value={filterZmoniai}
            onChange={e => setFilterZmoniai(e.target.value === '' ? '' : Number(e.target.value))}
            sx={{ flex: '0 0 140px' }}
          >
            <MenuItem value="">Bet koks</MenuItem>
            {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
              <MenuItem key={n} value={n}>{n}</MenuItem>
            ))}
          </TextField>
        </Box>
        <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', alignItems: 'center', mt: 1, minHeight: 24 }}>
          <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
            Rodoma {filteredRows.length} iš {rows.length}:
          </Typography>
          {filterDarboCentras.map(d => (
            <Chip key={d} size="small" label={d} onDelete={() => setFilterDarboCentras(prev => prev.filter(x => x !== d))} />
          ))}
          {filterAtributai.map(a => (
            <Chip key={a} size="small" label={a} onDelete={() => setFilterAtributai(prev => prev.filter(x => x !== a))} />
          ))}
          {filterZmoniai !== '' && (
            <Chip size="small" label={`Min. ${filterZmoniai} žm.`} onDelete={() => setFilterZmoniai('')} />
          )}
        </Box>
      </Box>

      <TableContainer sx={{ flex: 1, overflowY: 'auto' }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Nr.</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Užduoties pavadinimas</TableCell>
              <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Atlikimo dažnis</TableCell>
              <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Min. žm. sk.</TableCell>
              <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Trukmė</TableCell>
              <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Darbo centras</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row, i) => (
              <TableRow key={i} hover sx={{ cursor: 'pointer' }} onClick={() => setViewRow(row)}>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  <Typography variant="caption">{row.numeris}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="caption">{row.pavadinimas}</Typography>
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  <Typography variant="caption">{row.daznis}</Typography>
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  <Typography variant="caption">{row.zmoniuSkaicius ?? '—'}</Typography>
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  <Typography variant="caption">
                    {(row.trupmeVal || row.trupmeMin)
                      ? `${row.trupmeVal}h ${String(row.trupmeMin).padStart(2, '0')}m`
                      : '—'}
                  </Typography>
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  <Typography variant="caption">{row.darboCentras || '—'}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={closeDrawer} PaperProps={{ sx: { width: 700, borderRadius: 0 } }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Header */}
          <Box sx={{ px: 2.5, py: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <Typography variant="subtitle1" fontWeight={600}>Nauja užduotis</Typography>
            <IconButton size="small" onClick={closeDrawer}><CloseIcon fontSize="small" /></IconButton>
          </Box>

          {/* Body */}
          <Box sx={{ flex: 1, overflowY: 'auto', px: 2.5, py: 2.5 }}>
            <Stack spacing={2.5}>
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

              <Divider />

              <TextField
                select label="Darbo centras" size="small" fullWidth
                value={darboCentras} onChange={e => setDarboCentras(e.target.value)}
              >
                {DARBO_CENTRAS_OPTIONS.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
              </TextField>

              <TextField
                select label="Minimalus žmonių skaičius" size="small" fullWidth
                value={zmoniuSkaicius} onChange={e => setZmoniuSkaicius(Number(e.target.value))}
              >
                {Array.from({ length: 20 }, (_, i) => i + 1).map(n => (
                  <MenuItem key={n} value={n}>{n}</MenuItem>
                ))}
              </TextField>

              <Autocomplete
                multiple
                size="small"
                options={ATRIBUTAI_OPTIONS}
                groupBy={o => o.group}
                getOptionLabel={o => o.label}
                isOptionEqualToValue={(o, v) => o.label === v.label}
                value={ATRIBUTAI_OPTIONS.filter(o => atributai.includes(o.label))}
                onChange={(_, v) => setAtributai(v.map(o => o.label))}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip size="small" label={option.label} {...getTagProps({ index })} />
                  ))
                }
                renderInput={params => <TextField {...params} label="Užduoties atributai" />}
              />

              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Užduoties trukmė ant tech. objekto
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <TextField
                    select size="small" value={trupmeVal}
                    onChange={e => setTrupmeVal(Number(e.target.value))}
                    sx={{ flex: 1 }}
                  >
                    {Array.from({ length: 9 }, (_, i) => i).map(h => (
                      <MenuItem key={h} value={h}>{h} val.</MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select size="small" value={trupmeMin}
                    onChange={e => setTrupmeMin(Number(e.target.value))}
                    sx={{ flex: 1 }}
                  >
                    {MINUTES_OPTIONS.map(m => (
                      <MenuItem key={m} value={m}>{String(m).padStart(2, '0')} min.</MenuItem>
                    ))}
                  </TextField>
                </Stack>
              </Box>
            </Stack>
          </Box>

          {/* Footer */}
          <Box sx={{ px: 2.5, py: 2, borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'flex-end', gap: 1, flexShrink: 0 }}>
            <Button onClick={closeDrawer}>Atšaukti</Button>
            <Button
              variant="contained" disableElevation
              disabled={!numeris.trim() || !pavadinimas.trim()}
              onClick={handleSave}
            >
              Išsaugoti
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* View / Edit drawer */}
      <Drawer
        anchor="right" open={!!viewRow}
        onClose={() => { setViewRow(null); setEditMode(false) }}
        PaperProps={{ sx: { width: 500, borderRadius: 0 } }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ px: 2.5, py: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <Typography variant="subtitle1" fontWeight={600}>{editMode ? 'Redaguoti užduotį' : 'Užduotis'}</Typography>
            <IconButton size="small" onClick={() => { setViewRow(null); setEditMode(false) }}><CloseIcon fontSize="small" /></IconButton>
          </Box>

          <Box sx={{ flex: 1, overflowY: 'auto', px: 2.5, py: 2.5 }}>
            <Stack spacing={2.5}>
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
                    <Typography variant="body2" fontWeight={500}>{viewRow?.numeris || '—'}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Pavadinimas</Typography>
                    <Typography variant="body2">{viewRow?.pavadinimas || '—'}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Atlikimo dažnis</Typography>
                    <Typography variant="body2">{viewRow?.daznis || '—'}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Darbo centras</Typography>
                    <Typography variant="body2">{viewRow?.darboCentras || '—'}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Minimalus žmonių skaičius</Typography>
                    <Typography variant="body2">{viewRow?.zmoniuSkaicius ?? '—'}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Užduoties atributai</Typography>
                    {viewRow?.atributai?.length ? (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                        {viewRow.atributai.map(a => <Chip key={a} label={a} size="small" />)}
                      </Box>
                    ) : (
                      <Typography variant="body2">—</Typography>
                    )}
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Trukmė ant tech. objekto</Typography>
                    <Typography variant="body2">
                      {(viewRow?.trupmeVal || viewRow?.trupmeMin)
                        ? `${viewRow.trupmeVal} val. ${String(viewRow.trupmeMin).padStart(2, '0')} min.`
                        : '—'}
                    </Typography>
                  </Box>
                </>
              )}
            </Stack>
          </Box>

          <Box sx={{ px: 2.5, py: 2, borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'flex-end', gap: 1, flexShrink: 0 }}>
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
          </Box>
        </Box>
      </Drawer>
    </Box>
  )
}

export function UzduotysPage() {
  return <Navigate to="/objektai" replace />
}
