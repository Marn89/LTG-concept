import { useState } from 'react'
import {
  Box, Typography, Stack, Button, Divider,
  Chip, Autocomplete, TextField, IconButton, Breadcrumbs,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add'
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined'
import TableRowsOutlinedIcon from '@mui/icons-material/TableRowsOutlined'
import { WebAppShell } from '../layout/WebAppShell'
import { ROKISKIS_TOP_LEVEL, ROKISKIS_BY_PARENT, type TechObject } from '../data/rokiskisObjects'
import { RecurrencePicker } from '../components/RecurrencePicker'
import { StationMap } from '../components/StationMap'
import { LOKACIJA_COORDS } from '../data/rokiskisCoords'
const POPPER_PROPS = {
  placement: 'bottom-start' as const,
  modifiers: [{ name: 'flip', enabled: false }],
  sx: { width: 440 },
}

const LISTBOX_PROPS = {
  style: { maxHeight: '30vh' },
}

const MEISTRIJOS = [
  // Diagnostika
  { label: 'Kelio diagnostika', group: 'Diagnostika' },
  { label: 'Diagnostikos duomenų vertinimas', group: 'Diagnostika' },
  { label: 'Kontrolės laboratorija', group: 'Diagnostika' },
  { label: 'Bandymų ir kalibravimo laboratorija', group: 'Diagnostika' },
  // Vilniaus regionas
  { label: 'Vilniaus diagnostikos padalinys', group: 'Vilniaus regionas' },
  { label: 'Įrangos patikra Vilnius', group: 'Vilniaus regionas' },
  { label: 'Vievio meistrija', group: 'Vilniaus regionas' },
  { label: 'Rūdiškių meistrija', group: 'Vilniaus regionas' },
  { label: 'Lentvario atraminė meistrija', group: 'Vilniaus regionas' },
  { label: 'Panerių atraminė meistrija', group: 'Vilniaus regionas' },
  { label: 'Vaidotų meistrija', group: 'Vilniaus regionas' },
  { label: 'Valčiūnų meistrija', group: 'Vilniaus regionas' },
  { label: 'Vilniaus meistrija', group: 'Vilniaus regionas' },
  { label: 'Kenos meistrija', group: 'Vilniaus regionas' },
  { label: 'Ignalinos meistrija', group: 'Vilniaus regionas' },
  { label: 'Naujosios Vilnios atraminė meistrija', group: 'Vilniaus regionas' },
  { label: 'Pabradės atraminė meistrija', group: 'Vilniaus regionas' },
  { label: 'Švenčionėlių atraminė meistrija', group: 'Vilniaus regionas' },
  { label: 'Vilniaus kelio statinių priežiūra', group: 'Vilniaus regionas' },
  { label: 'Naujosios Vilnios automatikos priežiūra', group: 'Vilniaus regionas' },
  { label: 'Panerių automatikos priežiūra', group: 'Vilniaus regionas' },
  { label: 'Vilniaus automatikos priežiūra', group: 'Vilniaus regionas' },
  { label: 'Lentvario automatikos priežiūra', group: 'Vilniaus regionas' },
  { label: 'Vaidotų automatikos priežiūra', group: 'Vilniaus regionas' },
  { label: 'Pabradės automatikos priežiūra', group: 'Vilniaus regionas' },
  { label: 'Vilniaus kabelių priežiūra', group: 'Vilniaus regionas' },
  { label: 'Vilniaus ryšių priežiūra', group: 'Vilniaus regionas' },
  { label: 'Vilniaus RAKP ir EAP priežiūra', group: 'Vilniaus regionas' },
  { label: 'Vilniaus elektros sistemų priežiūra', group: 'Vilniaus regionas' },
  { label: 'Švenčionėlių elektros sistemų priežiūra', group: 'Vilniaus regionas' },
  { label: 'Vilniaus kontaktinio tinklo priežiūra', group: 'Vilniaus regionas' },
  { label: 'Kauno kontaktinio tinklo priežiūra', group: 'Vilniaus regionas' },
  { label: 'Vilniaus traukos pastočių priežiūra', group: 'Vilniaus regionas' },
  { label: 'Vilniaus mechanizacijos priežiūra', group: 'Vilniaus regionas' },
  { label: 'Vilniaus infrastruktūros atstatymas', group: 'Vilniaus regionas' },
  // Kauno regionas
  { label: 'Kauno diagnostikos padalinys', group: 'Kauno regionas' },
  { label: 'Baisogalos meistrija', group: 'Kauno regionas' },
  { label: 'Jonavos atraminė meistrija', group: 'Kauno regionas' },
  { label: 'Gaižiūnų meistrija', group: 'Kauno regionas' },
  { label: 'Kaišiadorių atraminė meistrija', group: 'Kauno regionas' },
  { label: 'Palemono atraminė meistrija', group: 'Kauno regionas' },
  { label: 'Kauno meistrija', group: 'Kauno regionas' },
  { label: 'Marijampolės meistrija', group: 'Kauno regionas' },
  { label: 'Vilkaviškio meistrija', group: 'Kauno regionas' },
  { label: 'Kybartų meistrija', group: 'Kauno regionas' },
  { label: 'Kėdainių atraminė meistrija', group: 'Kauno regionas' },
  { label: 'Kazlų Rūdos atraminė meistrija', group: 'Kauno regionas' },
  { label: 'Šeštokų atraminė meistrija', group: 'Kauno regionas' },
  { label: 'Kauno kelio statinių priežiūra', group: 'Kauno regionas' },
  { label: 'Kauno automatikos priežiūra', group: 'Kauno regionas' },
  { label: 'Jonavos automatikos priežiūra', group: 'Kauno regionas' },
  { label: 'Palemono automatikos priežiūra', group: 'Kauno regionas' },
  { label: 'Kėdainių automatikos priežiūra', group: 'Kauno regionas' },
  { label: 'Marijampolės automatikos priežiūra', group: 'Kauno regionas' },
  { label: 'Kazlų Rūdos automatikos priežiūra', group: 'Kauno regionas' },
  { label: 'Kauno kabelių priežiūra', group: 'Kauno regionas' },
  { label: 'Kauno ryšių priežiūra', group: 'Kauno regionas' },
  { label: 'Kauno RAKP ir EAP priežiūra', group: 'Kauno regionas' },
  { label: 'Kėdainių elektros sistemų priežiūra', group: 'Kauno regionas' },
  { label: 'Kauno elektros sistemų priežiūra', group: 'Kauno regionas' },
  { label: 'Marijampolės elektros sistemų priežiūra', group: 'Kauno regionas' },
  { label: 'Kauno SCADA ir RAA priežiūra', group: 'Kauno regionas' },
  { label: 'Kauno mechanizacijos priežiūra', group: 'Kauno regionas' },
  { label: 'Kauno infrastruktūros atstatymas', group: 'Kauno regionas' },
  // Šiaulių regionas
  { label: 'Šiaulių diagnostikos padalinys', group: 'Šiaulių regionas' },
  { label: 'Įrangos patikra Radviliškis', group: 'Šiaulių regionas' },
  { label: 'Bugenių meistrija', group: 'Šiaulių regionas' },
  { label: 'Akmenės atraminė meistrija', group: 'Šiaulių regionas' },
  { label: 'Kužių meistrija', group: 'Šiaulių regionas' },
  { label: 'Šiaulių atraminė meistrija', group: 'Šiaulių regionas' },
  { label: 'Zoknių meistrija', group: 'Šiaulių regionas' },
  { label: 'Radviliškio 2-oji meistrija', group: 'Šiaulių regionas' },
  { label: 'Šeduvos meistrija', group: 'Šiaulių regionas' },
  { label: 'Panevėžio atraminė meistrija', group: 'Šiaulių regionas' },
  { label: 'Rokiškio atraminė meistrija', group: 'Šiaulių regionas' },
  { label: 'Radviliškio 3-oji atraminė meistrija', group: 'Šiaulių regionas' },
  { label: 'Šiaulių kelio statinių priežiūra', group: 'Šiaulių regionas' },
  { label: 'Bugenių automatikos priežiūra', group: 'Šiaulių regionas' },
  { label: 'Akmenės automatikos priežiūra', group: 'Šiaulių regionas' },
  { label: 'Panevėžio automatikos priežiūra', group: 'Šiaulių regionas' },
  { label: 'Radviliškio automatikos priežiūra', group: 'Šiaulių regionas' },
  { label: 'Šiaulių automatikos priežiūra', group: 'Šiaulių regionas' },
  { label: 'Šiaulių kabelių priežiūra', group: 'Šiaulių regionas' },
  { label: 'Šiaulių ryšių priežiūra', group: 'Šiaulių regionas' },
  { label: 'Šiaulių RAKP ir EAP priežiūra', group: 'Šiaulių regionas' },
  { label: 'Radviliškio elektros sistemų priežiūra', group: 'Šiaulių regionas' },
  { label: 'Šiaulių elektros sistemų priežiūra', group: 'Šiaulių regionas' },
  { label: 'Panevėžio elektros sistemų priežiūra', group: 'Šiaulių regionas' },
  { label: 'Šiaulių SCADA ir RAA priežiūra', group: 'Šiaulių regionas' },
  { label: 'Įrenginių bandymų ir gedimų prevencija', group: 'Šiaulių regionas' },
  { label: 'Šiaulių mechanizacijos priežiūra', group: 'Šiaulių regionas' },
  { label: 'Šiaulių infrastruktūros atstatymas', group: 'Šiaulių regionas' },
  // Bėgių suvirinimas
  { label: 'Bėgių pakrovimas', group: 'Bėgių suvirinimas' },
  { label: 'Bėgių tiesinimas', group: 'Bėgių suvirinimas' },
  { label: 'Bėgių pjovimas', group: 'Bėgių suvirinimas' },
  { label: 'Bėgių galų valymas', group: 'Bėgių suvirinimas' },
  { label: 'Transportavimas (tarp operacijų)', group: 'Bėgių suvirinimas' },
  { label: 'Suvirinimas', group: 'Bėgių suvirinimas' },
  { label: 'Šlifavimas pado ir kaklelio', group: 'Bėgių suvirinimas' },
  { label: 'Tiesinimas sandūros', group: 'Bėgių suvirinimas' },
  { label: 'Šlifavimas sandūros galvutės', group: 'Bėgių suvirinimas' },
  { label: 'Suvirintų sandūrų bandymai', group: 'Bėgių suvirinimas' },
  { label: 'Ilgabėgių gamyba', group: 'Bėgių suvirinimas' },
  // Klaipėdos regionas
  { label: 'Klaipėdos diagnostikos padalinys', group: 'Klaipėdos regionas' },
  { label: 'Klaipėdos meistrija', group: 'Klaipėdos regionas' },
  { label: 'Kretingos atraminė meistrija', group: 'Klaipėdos regionas' },
  { label: 'Plungės meistrija', group: 'Klaipėdos regionas' },
  { label: 'Telšių meistrija', group: 'Klaipėdos regionas' },
  { label: 'Pavenčių atraminė meistrija', group: 'Klaipėdos regionas' },
  { label: 'Draugystės atraminė meistrija', group: 'Klaipėdos regionas' },
  { label: 'Rimkų meistrija', group: 'Klaipėdos regionas' },
  { label: 'Pagėgių meistrija', group: 'Klaipėdos regionas' },
  { label: 'Tauragės atraminė meistrija', group: 'Klaipėdos regionas' },
  { label: 'Klaipėdos kelio statinių priežiūra', group: 'Klaipėdos regionas' },
  { label: 'Draugystės automatikos priežiūra', group: 'Klaipėdos regionas' },
  { label: 'Klaipėdos automatikos priežiūra', group: 'Klaipėdos regionas' },
  { label: 'Kretingos automatikos priežiūra', group: 'Klaipėdos regionas' },
  { label: 'Tauragės automatikos priežiūra', group: 'Klaipėdos regionas' },
  { label: 'Telšių automatikos priežiūra', group: 'Klaipėdos regionas' },
  { label: 'Klaipėdos kabelių priežiūra', group: 'Klaipėdos regionas' },
  { label: 'Klaipėdos ryšių priežiūra', group: 'Klaipėdos regionas' },
  { label: 'Klaipėdos RAKP ir EAP priežiūra', group: 'Klaipėdos regionas' },
  { label: 'Klaipėdos elektros sistemų priežiūra', group: 'Klaipėdos regionas' },
  { label: 'Tauragės elektros sistemų priežiūra', group: 'Klaipėdos regionas' },
  { label: 'Klaipėdos SCADA ir RAA priežiūra', group: 'Klaipėdos regionas' },
  { label: 'Klaipėdos mechanizacijos priežiūra', group: 'Klaipėdos regionas' },
  { label: 'Klaipėdos infrastruktūros atstatymas', group: 'Klaipėdos regionas' },
]

interface Lokacija { label: string; code: string; group: string }
const LOKACIJOS_BY_MEISTRIJA: Record<string, Lokacija[]> = {
  'Rokiškio meistrija (ATRAMINĖ)': [
    { label: 'Gustonių geležinkelio stotis', code: 'LG-L08-000GUS', group: 'Stotys' },
    { label: 'Kupiškio geležinkelio stotis', code: 'LG-L08-000KPS', group: 'Stotys' },
    { label: 'Panevėžio geležinkelio stotis', code: 'LG-L08-000PNE', group: 'Stotys' },
    { label: 'Rokiškio geležinkelio stotis', code: 'LG-L08-000RKS', group: 'Stotys' },
    { label: 'Šeduvos geležinkelio stotis', code: 'LG-L08-000SDV', group: 'Stotys' },
    { label: 'Skapiškio geležinkelio stotis', code: 'LG-L08-000SKA', group: 'Stotys' },
    { label: 'Subačiaus geležinkelio stotis', code: 'LG-L08-000SUB', group: 'Stotys' },
    { label: 'Tarpstotis Gustonys-Panevėžys', code: 'LG-L08-GUSPNE', group: 'Tarpstočiai' },
    { label: 'Tarpstotis Kupiškis-Skapiškis', code: 'LG-L08-KPSSKA', group: 'Tarpstočiai' },
    { label: 'Tarpstotis Panevėžys-Subačius', code: 'LG-L08-PNESUB', group: 'Tarpstočiai' },
    { label: 'Tarpstotis Radviliškis-Šeduva', code: 'LG-L08-RDVSDV', group: 'Tarpstočiai' },
    { label: 'Tarpstotis Rokiškis-V.S. su Latvija', code: 'LG-L08-RKSVSS', group: 'Tarpstočiai' },
    { label: 'Tarpstotis Šeduva-Gustonys', code: 'LG-L08-SDVGUS', group: 'Tarpstočiai' },
    { label: 'Tarpstotis Skapiškis-Rokiškis', code: 'LG-L08-SKARKS', group: 'Tarpstočiai' },
    { label: 'Tarpstotis Subačius-Kupiškis', code: 'LG-L08-SUBKPS', group: 'Tarpstočiai' },
  ],
}

const KOMANDA = [
  'Algirdas Rimkus', 'Kęstutis Norvaišas', 'Ramūnas Žilinskas',
  'Povilas Stankūnas', 'Henrikas Jokubaitis', 'Ričardas Butkevičius',
  'Tautvydas Mikalajūnas', 'Žygimantas Paulauskas',
]

const MEDZIAGOS = [
  'Bėgiai', 'Pabėgiai', 'Saulčiniai', 'Balastas', 'Kabeliai',
  'Signalizacijos moduliai', 'Izoliuojančios jungtys', 'Kontaktinis laidas',
  'Šviesaforo medžiagos', 'Alyva',
]

interface PlaninisDarbas {
  id: number
  darbas: string | null
  lokacija: Lokacija | null
  grupe: TechObject | null
  objektai: TechObject[]
  rrule: string | null
}

function formatRrule(rrule: string | null): string {
  if (!rrule) return '—'
  const freq = rrule.match(/FREQ=(\w+)/)?.[1]
  const interval = Number(rrule.match(/INTERVAL=(\d+)/)?.[1] ?? 1)
  const map: Record<string, [string, string]> = {
    DAILY:   ['dieną', 'dienas'],
    WEEKLY:  ['savaitę', 'savaites'],
    MONTHLY: ['mėnesį', 'mėnesius'],
    YEARLY:  ['metus', 'metų'],
  }
  const [sing, plur] = map[freq ?? ''] ?? ['?', '?']
  return interval === 1 ? `Kas ${sing}` : `Kas ${interval} ${plur}`
}

export function PlanuotojasPage() {
  const [open, setOpen] = useState(false)
  const [planiniai, setPlaniniai] = useState<PlaninisDarbas[]>([])
  const [selected, setSelected] = useState<PlaninisDarbas | null>(null)
  const [prieziura, setPrieziura] = useState<{ label: string; group: string } | null>(null)
  const [lokacija, setLokacija] = useState<Lokacija | null>(null)
  const [grupe, setGrupe] = useState<TechObject | null>(null)
  const [elementas, setElementas] = useState<TechObject[]>([])
  const [showObjektai, setShowObjektai] = useState(false)
  const [darbas, setDarbas] = useState<string | null>(null)
  const [rrule, setRrule] = useState<string | null>(null)
  const [komanda, setKomanda] = useState<string[]>([])
  const [vyresnysis, setVyresnysis] = useState<string | null>(null)
  const [medziagos, setMedziagos] = useState<string[]>([])

  const allLokacijos = Object.values(LOKACIJOS_BY_MEISTRIJA).flat()
  const GRUPES_BY_LOKACIJA: Record<string, string[]> = {
    'LG-L08-000RKS': ['LG-L08-000RKS-IESA'],
  }
  const availableGrupes = lokacija
    ? (GRUPES_BY_LOKACIJA[lokacija.code]
        ? ROKISKIS_TOP_LEVEL.filter(g => GRUPES_BY_LOKACIJA[lokacija.code].includes(g.code))
        : ROKISKIS_TOP_LEVEL)
    : []
  const grupeItems = grupe ? (ROKISKIS_BY_PARENT[grupe.code] ?? []) : []

  const resetForm = () => {
    setPrieziura(null)
    setLokacija(null)
    setGrupe(null)
    setElementas([])
    setDarbas(null)
    setRrule(null)
    setKomanda([])
    setVyresnysis(null)
    setMedziagos([])
  }

  const handleClose = () => { setOpen(false); resetForm() }

  const handleSave = () => {
    setPlaniniai(prev => [...prev, {
      id: Date.now(),
      darbas,
      lokacija,
      grupe,
      objektai: elementas,
      rrule,
    }])
    setOpen(false)
    resetForm()
  }

  return (
    <WebAppShell>
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight={700}>Planiniai darbai</Typography>
          <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
            Sukurti planinį darbą
          </Button>
        </Stack>

        {planiniai.length === 0 ? (
          <Stack alignItems="center" justifyContent="center" spacing={1} sx={{ flex: 1 }}>
            <EventBusyOutlinedIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
            <Typography variant="body2" color="text.secondary">Nėra planinių darbų</Typography>
          </Stack>
        ) : (
          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 700 }}>Darbas</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Lokacija</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Grupė</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Objektai</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Dažnumas</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {planiniai.map(p => (
                  <TableRow key={p.id} hover sx={{ cursor: 'pointer' }} onClick={() => setSelected(p)}>
                    <TableCell>{p.darbas ?? '—'}</TableCell>
                    <TableCell>{p.lokacija ? `${p.lokacija.label} (${p.lokacija.code})` : '—'}</TableCell>
                    <TableCell>{p.grupe?.name ?? '—'}</TableCell>
                    <TableCell>
                      {p.objektai.length === 0
                        ? '—'
                        : p.objektai.length === 1
                          ? p.objektai[0].name
                          : `${p.objektai[0].name} +${p.objektai.length - 1}`}
                    </TableCell>
                    <TableCell>{formatRrule(p.rrule)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {open && (
      <Box sx={{ position: 'fixed', inset: 0, zIndex: 1300, bgcolor: 'grey.100', display: 'flex', overflow: 'hidden' }}>
        <Stack direction="row" sx={{ flex: 1, overflow: 'hidden' }}>
        <Box sx={{ width: 560, flexShrink: 0, bgcolor: 'background.paper', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}>
            <Typography variant="subtitle1" fontWeight={700}>Naujas planinis darbas</Typography>
            <IconButton size="small" onClick={handleClose}><CloseIcon fontSize="small" /></IconButton>
          </Stack>
          <Box sx={{ flex: 1, overflowY: 'auto', px: 3, py: 2.5 }}>
            <Stack spacing={2.5}>

              <Typography variant="caption" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary' }}>
                Darbo informacija
              </Typography>

              <Autocomplete
                options={['Iešmų patikrinimas', 'Iešmų patepimas', 'AB vald. įrang patikra', 'AB įrenginių patikra', 'Pervažų SĮ patikra']}
                value={darbas}
                onChange={(_, v) => setDarbas(v)}
                slotProps={{ popper: POPPER_PROPS }} ListboxProps={LISTBOX_PROPS}
                renderInput={params => <TextField {...params} label="Pasirinkite darbą" size="small" />}
              />

              <Divider />

              <Typography variant="caption" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary' }}>
                Darbų atlikimo dažnumas
              </Typography>

              <RecurrencePicker onChange={setRrule} />

              <Divider />

              <Typography variant="caption" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary' }}>
                Lokacijos informacija
              </Typography>

              <Stack spacing={2}>
                <Stack spacing={2}>
                  <Autocomplete
                    options={MEISTRIJOS}
                    groupBy={o => o.group}
                    getOptionLabel={o => o.label}
                    value={prieziura}
                    onChange={(_, v) => { setPrieziura(v); setLokacija(null); setGrupe(null); setElementas([]) }}
                    slotProps={{ popper: POPPER_PROPS }} ListboxProps={LISTBOX_PROPS}
                    renderInput={params => <TextField {...params} label="Pasirinkti meistriją" size="small" />}
                  />
                  <Autocomplete
                    options={allLokacijos}
                    disabled={!prieziura}
                    getOptionLabel={o => `${o.label} (${o.code})`}
                    groupBy={o => o.group}
                    value={lokacija}
                    onChange={(_, v) => { setLokacija(v); setGrupe(null); setElementas([]) }}
                    slotProps={{ popper: POPPER_PROPS }} ListboxProps={LISTBOX_PROPS}
                    renderInput={params => <TextField {...params} label="Pasirinkti lokaciją" size="small" />}
                  />
                  <Autocomplete
                    options={availableGrupes}
                    disabled={!lokacija}
                    getOptionLabel={o => `${o.name} (${o.code})`}
                    value={grupe}
                    onChange={(_, v) => {
                      setGrupe(v)
                      setShowObjektai(false)
                      const children = v ? (ROKISKIS_BY_PARENT[v.code] ?? []) : []
                      setElementas(v?.code === 'LG-L08-000RKS-IESA' ? children : [])
                    }}
                    slotProps={{ popper: POPPER_PROPS }} ListboxProps={LISTBOX_PROPS}
                    renderInput={params => (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <TextField {...params} label="Pasirinkti objekto grupę" size="small" sx={{ flex: 1 }} />
                        <IconButton
                          size="small"
                          disabled={!grupe || grupeItems.length === 0}
                          onClick={() => setShowObjektai(v => !v)}
                          sx={{ border: 1, borderColor: showObjektai ? 'primary.main' : 'divider', borderRadius: 1, color: showObjektai ? 'primary.main' : 'text.secondary', flexShrink: 0 }}
                        >
                          <TableRowsOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    )}
                  />
                </Stack>

              </Stack>

              <Divider />

              <Typography variant="caption" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary' }}>
                Darbuotojai
              </Typography>

              <Autocomplete
                multiple
                disableCloseOnSelect
                options={KOMANDA}
                value={komanda}
                onChange={(_, v) => setKomanda(v)}
                renderTags={() => null}
                slotProps={{ popper: POPPER_PROPS }} ListboxProps={LISTBOX_PROPS}
                renderInput={params => <TextField {...params} label="Pasirinkti darbuotojus" size="small" />}
              />
              {komanda.length > 0 && (
                <Stack direction="row" flexWrap="wrap" gap={0.5}>
                  {komanda.map(k => (
                    <Chip
                      key={k}
                      label={vyresnysis === k ? `⭐ ${k}` : k}
                      size="small"
                      color={vyresnysis === k ? 'primary' : 'default'}
                      variant={vyresnysis === k ? 'filled' : 'outlined'}
                      onClick={() => setVyresnysis(vyresnysis === k ? null : k)}
                      onDelete={() => {
                        setKomanda(komanda.filter(v => v !== k))
                        if (vyresnysis === k) setVyresnysis(null)
                      }}
                    />
                  ))}
                </Stack>
              )}

            </Stack>
          </Box>
          <Box sx={{ px: 3, py: 2, borderTop: 1, borderColor: 'divider', flexShrink: 0 }}>
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button onClick={handleClose}>Atšaukti</Button>
              <Button variant="contained" onClick={handleSave}>Išsaugoti</Button>
            </Stack>
          </Box>
        </Box>

        {showObjektai && grupe && grupeItems.length > 0 && (
          <Box sx={{ width: 260, flexShrink: 0, bgcolor: 'background.paper', borderLeft: 1, borderColor: 'divider', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}>
              <Typography variant="caption" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary' }}>
                Aptarnaujami objektai
              </Typography>
              <Typography variant="caption" color="text.disabled">{elementas.length}/{grupeItems.length}</Typography>
            </Stack>
            <Box sx={{ flex: 1, overflowY: 'auto' }}>
              {grupeItems.map(o => {
                const checked = elementas.some(e => e.code === o.code)
                return (
                  <Stack
                    key={o.code}
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{
                      px: 2, py: 0.75, cursor: 'pointer',
                      bgcolor: checked ? 'primary.50' : 'transparent',
                      '&:hover': { bgcolor: checked ? 'primary.50' : 'action.hover' },
                    }}
                    onClick={() => setElementas(checked ? elementas.filter(e => e.code !== o.code) : [...elementas, o])}
                  >
                    <Box sx={{ width: 16, height: 16, borderRadius: 0.5, border: 2, borderColor: checked ? 'primary.main' : 'text.disabled', bgcolor: checked ? 'primary.main' : 'transparent', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {checked && <Box component="span" sx={{ width: 8, height: 8, bgcolor: 'primary.contrastText', borderRadius: 0.25 }} />}
                    </Box>
                    <Typography variant="body2">{o.name}</Typography>
                  </Stack>
                )
              })}
            </Box>
          </Box>
        )}

        <Box sx={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          <StationMap items={grupeItems} selected={elementas} center={lokacija ? LOKACIJA_COORDS[lokacija.code] : undefined} />
        </Box>

        </Stack>
      </Box>
      )}

      {selected && (
      <Box sx={{ position: 'fixed', inset: 0, zIndex: 1300, bgcolor: 'grey.100', display: 'flex', flexDirection: 'column', alignItems: 'center', px: 4, pt: 3, pb: '48px' }}>
        <Box sx={{ width: '100%', maxWidth: 560, mb: 1.5 }}>
          <Breadcrumbs sx={{ '& .MuiBreadcrumbs-separator': { mx: 0.5 } }}>
            <Typography variant="caption" color="primary.main" sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }} onClick={() => setSelected(null)}>
              Planiniai darbai
            </Typography>
            <Typography variant="caption" color="text.primary" fontWeight={600}>{selected.darbas ?? 'Planinis darbas'}</Typography>
          </Breadcrumbs>
        </Box>
        <Box sx={{ width: '100%', maxWidth: 560, bgcolor: 'background.paper', borderRadius: '8px', boxShadow: 4, display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}>
            <Typography variant="subtitle1" fontWeight={700}>{selected.darbas ?? '—'}</Typography>
            <IconButton size="small" onClick={() => setSelected(null)}><CloseIcon fontSize="small" /></IconButton>
          </Stack>
          <Box sx={{ flex: 1, overflowY: 'auto', px: 3, py: 2.5 }}>
            <Stack spacing={2.5}>

              <Typography variant="caption" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary' }}>
                Darbo informacija
              </Typography>
              <Stack spacing={0.5}>
                <Typography variant="caption" color="text.secondary">Darbas</Typography>
                <Typography variant="body2">{selected.darbas ?? '—'}</Typography>
              </Stack>

              <Divider />

              <Typography variant="caption" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary' }}>
                Darbų atlikimo dažnumas
              </Typography>
              <Stack spacing={0.5}>
                <Typography variant="caption" color="text.secondary">Dažnumas</Typography>
                <Typography variant="body2">{formatRrule(selected.rrule)}</Typography>
              </Stack>

              <Divider />

              <Typography variant="caption" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary' }}>
                Lokacijos informacija
              </Typography>
              <Stack spacing={0.5}>
                <Typography variant="caption" color="text.secondary">Lokacija</Typography>
                <Typography variant="body2">{selected.lokacija ? `${selected.lokacija.label} (${selected.lokacija.code})` : '—'}</Typography>
              </Stack>
              <Stack spacing={0.5}>
                <Typography variant="caption" color="text.secondary">Grupė</Typography>
                <Typography variant="body2">{selected.grupe ? `${selected.grupe.name} (${selected.grupe.code})` : '—'}</Typography>
              </Stack>
              {selected.objektai.length > 0 && (
                <Stack spacing={0.5}>
                  <Typography variant="caption" color="text.secondary">Objektai</Typography>
                  <Stack direction="row" flexWrap="wrap" gap={0.5}>
                    {selected.objektai.map(o => (
                      <Chip key={o.code} label={o.name} size="small" />
                    ))}
                  </Stack>
                </Stack>
              )}

            </Stack>
          </Box>
          <Box sx={{ px: 3, py: 2, borderTop: 1, borderColor: 'divider', flexShrink: 0 }}>
            <Button onClick={() => setSelected(null)}>Uždaryti</Button>
          </Box>
        </Box>
      </Box>
      )}
    </WebAppShell>
  )
}
