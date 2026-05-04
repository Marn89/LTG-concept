import { useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Box, Typography, IconButton, Chip, Divider, Stack, Collapse, Button, Autocomplete, TextField, Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel, Checkbox, Popover, Drawer, List, ListItemButton, ListItemText } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useV2Plans } from '../features/planuotojas/PlanuotojasV2Context'
import type { V2Plan } from '../features/planuotojas/PlanuotojasV2Context'

const SISTEMOS = [
  'SP_TRIFAZE',
  'SP_NUOLATINE',
  'MKI (kontroliniai užraktai)',
  'SPGB (kalneliams)',
  'S700 (Vaidotų kalnelis)',
  'ECOSTAR',
  'UNISTAR',
]

const OBJEKTU_GRUPES = [
  'Autonominis el. šaltinis (AELS)',
  'AERAS (AERA)',
  'AKAS (AKAS)',
  'Apšvietimas (APSV)',
  'Atramos/atmušos (ATRA)',
  'TRR (ATRR)',
  'Centrinis NMŠ (CNMS)',
  'Duomenų perdavimo įranga (DUOM)',
  'Elektros linijos (ELLI)',
  'Elektros tiekimo įrenginys (ELTI)',
  'Gabaritiniai vartai (GABV)',
  'Geležinkelio keliai (GKEL)',
  'GSM-R (GSMR)',
  'Įrenginių bandymų ir gedimų prevencija (IBGP)',
  'Iešmai ir sankirtos (IESA)',
  'Iešmų šildymas (IESI)',
  'Šilėnų ilgabėgių gamykla (ILGB)',
  'Klaipėdos komplektavimo bazė (KOBA)',
  'Kontaktiniai tinklai (KOTI)',
  'Laikrodžiai (LAIK)',
  'MRR (MARR)',
  'Pastatai ir teritorijos (NTTE)',
  'Oro kompresorinė Panerių st (ORKO)',
  'Pervažos ir perėjos (PEPE)',
  'Peronai ir platformos (PEPL)',
  'Pralaidos (PRAL)',
  'RAKP (RAKP)',
  'SIS (RGIS)',
  'Ryšių kabeliai (RYKA)',
  'SCADA (SCAD)',
  'Stoties eismo valdymo įranga (SEVI)',
  'Stoties garsinis ryšys (STGR)',
  'Sienelės ir tvoros (STVO)',
  'Svarstyklės (SVAR)',
  'Techninės apsaugos priemonės (TAPP)',
  'Tarpstočio eismo valdymo įranga (TEVI)',
  'Tiltai ir Viadukai (TIVI)',
  'Traukos pastotė (TRPA)',
  'Tuneliai (TUNE)',
  'Vandens nuvedimo įrenginiai (VAND)',
  'Vežių keitimo įrenginiai (VKIR)',
  'Žemės sankasos (ZSAN)',
]

const KELIO_TIPAI = [
  'Pagr. ir nestabdomo prav.',
  'Atvykimo keliai',
  'Kalnelio keliai',
]

const UZDUOTYS = [
  'Elektros pavarų, galutinės padėties tikrintuvų ir jų garnitūrų išorinės būklės tikrinimas; iešmų smailės prigludimo prie rėminio bėgio tikrinimas laužtuvėliu [kartą per savaitę]',
  'Iešmų išorinės būklės ir smailių prigludimo prie rėminio bėgio, įdėjus 4 mm ir 2 mm storio tarpamačius; Smailių prigludimo prie rėminio bėgio tikrinimas, ties galutinės padėties tikrintuvu įdėjus 6 mm ir 2 mm storio tarpamačius [Kartą per dvi savaites]',
  'Išorinis elektros pavarų, galutinės padėties tikrintuvų ir jų garnitūrų valymas [Du kartus per metus]',
  'Elektros pavarų ir galutinės padėties tikrintuvų vidaus būklės tikrinimas [Kartą per keturias savaites]',
  'Elektros variklio įtampos matavimas [Kartą per metus]',
]

export const UZDUOTYS_DC: Record<string, string> = {
  'Elektros pavarų, galutinės padėties tikrintuvų ir jų garnitūrų išorinės būklės tikrinimas; iešmų smailės prigludimo prie rėminio bėgio tikrinimas laužtuvėliu [kartą per savaitę]': 'AM',
  'Išorinis elektros pavarų, galutinės padėties tikrintuvų ir jų garnitūrų valymas [Du kartus per metus]': 'AM',
  'Iešmų išorinės būklės ir smailių prigludimo prie rėminio bėgio, įdėjus 4 mm ir 2 mm storio tarpamačius; Smailių prigludimo prie rėminio bėgio tikrinimas, ties galutinės padėties tikrintuvu įdėjus 6 mm ir 2 mm storio tarpamačius [Kartą per dvi savaites]': 'AM; Kelių priežiūros darbuotojas',
  'Elektros pavarų ir galutinės padėties tikrintuvų vidaus būklės tikrinimas [Kartą per keturias savaites]': 'AM',
  'Elektros variklio įtampos matavimas [Kartą per metus]': 'AM',
}

type ObjItem = { name: string; sistema: string; kelioTipas: string }
function makeObjs(count: number, base: number, suffix: string, step = 2): ObjItem[] {
  return Array.from({ length: count }, (_, i) => ({
    name: `Iešmas Nr. ${base + i * step}${suffix}`,
    sistema: SISTEMOS[i % SISTEMOS.length],
    kelioTipas: KELIO_TIPAI[i % KELIO_TIPAI.length],
  }))
}

const DARBO_CENTRAI: { name: string; stations: { name: string; objects: ObjItem[] }[] }[] = [
  { name: 'Šiaulių darbo centras', stations: [
    { name: 'Šiaulių gel. stotis', objects: makeObjs(320, 1, 'K') },
    { name: 'Zoknių gel. stotis', objects: makeObjs(240, 2, 'K') },
    { name: 'Bugenių gel. stotis', objects: makeObjs(160, 101, 'K') },
  ]},
  { name: 'Kužių darbo centras', stations: [
    { name: 'Kužių gel. stotis', objects: makeObjs(200, 201, 'K') },
    { name: 'Radviliškio gel. stotis', objects: makeObjs(280, 1, 'L') },
    { name: 'Šeduvos gel. stotis', objects: makeObjs(120, 301, 'K') },
  ]},
  { name: 'Akmenės darbo centras', stations: [
    { name: 'Akmenės gel. stotis', objects: makeObjs(240, 401, 'K') },
    { name: 'Viekšnių gel. stotis', objects: makeObjs(160, 501, 'K') },
    { name: 'Papilės gel. stotis', objects: makeObjs(200, 601, 'K') },
  ]},
  { name: 'Rokiškio darbo centras', stations: [
    { name: 'Rokiškio gel. stotis', objects: makeObjs(280, 701, 'K') },
    { name: 'Panevėžio gel. stotis', objects: makeObjs(320, 801, 'K') },
    { name: 'Kupiškio gel. stotis', objects: makeObjs(200, 901, 'K') },
  ]},
]


const MENU_PROPS = {
  disablePortal: true,
  anchorOrigin: { vertical: 'bottom' as const, horizontal: 'left' as const },
  transformOrigin: { vertical: 'top' as const, horizontal: 'left' as const },
  PaperProps: { sx: { maxHeight: 220 } },
}

export function PlanuotojasV2Page() {
  const navigate = useNavigate()
  const { id: editId } = useParams<{ id: string }>()
  const { addV2Plan, updateV2Plan, v2Plans } = useV2Plans()
  const editPlan: V2Plan | undefined = editId ? v2Plans.find(p => p.id === editId) : undefined

  const [regionas, setRegionas] = useState(editPlan?.regionas ?? '')
  const [grupe, setGrupe] = useState(editPlan?.grupe ?? '')
  const [sistema, setSistema] = useState<string[]>(editPlan?.sistema ?? [])
  const [kelioKategorija, setKelioKategorija] = useState(editPlan?.kelioKategorija ?? '')
  const [priedai, setPriedai] = useState(editPlan?.priedai ?? '')
  const [uzduotis, setUzduotis] = useState<string[]>(editPlan?.uzduotys ?? [])
  const [galiojaNuo, setGaliojaNuo] = useState(editPlan?.galiojaNuo ?? '')
  const [galiojaIki, setGaliojaIki] = useState(editPlan?.galiojaIki ?? '')
  const [expandedStations, setExpandedStations] = useState<Set<string>>(new Set())
  const [attrModalOpen, setAttrModalOpen] = useState(false)
  const [attrDraft, setAttrDraft] = useState<Set<string>>(new Set())
  const [activeAttrs, setActiveAttrs] = useState<Set<string>>(new Set(editPlan ? Object.keys(editPlan.atributai ?? {}) : []))
  const [attrSistema, setAttrSistema] = useState<string | null>(editPlan?.atributai?.['Sistema'] ?? null)
  const [attrKelioTipas, setAttrKelioTipas] = useState<string | null>(editPlan?.atributai?.['Kelio tipas'] ?? null)
  const [attrKastuCentras, setAttrKastuCentras] = useState<string | null>(editPlan?.atributai?.['Kaštų centras'] ?? null)
  const [attrKategorija, setAttrKategorija] = useState<string | null>(editPlan?.atributai?.['Kategorija'] ?? null)
  const [attrDarboCentras, setAttrDarboCentras] = useState<string | null>(editPlan?.atributai?.['Darbo centras'] ?? null)
  const [attrKompanijosKodas, setAttrKompanijosKodas] = useState<string | null>(editPlan?.atributai?.['Kompanijos kodas'] ?? null)
  const [attrKelijoPriedai, setAttrKelijoPriedai] = useState<string | null>(editPlan?.atributai?.['Kelio priedai'] ?? null)
  const [stationDates, setStationDates] = useState<Record<string, string>>(() => {
    if (!editPlan) return {}
    const dates: Record<string, string> = {}
    for (const dc of editPlan.darboCentrai ?? [])
      for (const st of dc.stations)
        if (st.paleidimoData) dates[st.name] = st.paleidimoData
    return dates
  })
  const [deselectedObjects, setDeselectedObjects] = useState<Set<string>>(new Set())
  const [addObjectDrawer, setAddObjectDrawer] = useState(false)
  const [drawerStation, setDrawerStation] = useState<string | null>(null)
  const [drawerSelected, setDrawerSelected] = useState<Set<string>>(new Set())
  const [extraObjects, setExtraObjects] = useState<Record<string, string[]>>({})
  const [dateAnchor, setDateAnchor] = useState<{ el: HTMLElement; station: string } | null>(null)
  const dateInputRef = useRef<HTMLInputElement>(null)

  const ATTR_OPTIONS = [
    'Sistema',
    'Kelio tipas',
    'Kelio priedai',
    'Kaštų centras',
    'Kategorija',
    'Darbo centras',
    'Kompanijos kodas',
  ]

  function openAttrModal() {
    setAttrDraft(new Set(activeAttrs))
    setAttrModalOpen(true)
  }

  function saveAttrs() {
    setActiveAttrs(new Set(attrDraft))
    setAttrModalOpen(false)
  }

  const toggleStation = (st: string) => {
    setExpandedStations(prev => { const s = new Set(prev); s.has(st) ? s.delete(st) : s.add(st); return s })
  }


  function filterObj(obj: ObjItem): boolean {
    if (attrSistema && obj.sistema !== attrSistema) return false
    if (attrKelioTipas && obj.kelioTipas !== attrKelioTipas) return false
    return true
  }

  const filteredDarboCentrai = DARBO_CENTRAI.map(dc => ({
    ...dc,
    stations: dc.stations.map(st => ({
      ...st,
      objects: st.objects.filter(filterObj),
    })).filter(st => st.objects.length > 0),
  })).filter(dc => dc.stations.length > 0)

  const filteredTotal = filteredDarboCentrai.reduce((acc, dc) => acc + dc.stations.reduce((a, s) => a + s.objects.length, 0), 0)

  return (
    <>
    <Box sx={{ position: 'fixed', inset: 0, zIndex: 1300, display: 'flex', flexDirection: 'column', overflow: 'hidden', bgcolor: 'background.paper' }}>
        <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="subtitle1" fontWeight={600}>{editId ? 'Redaguoti planą' : 'Naujas planinis darbas'}</Typography>
          <IconButton size="small" onClick={() => navigate('/planuotojas')}><CloseIcon fontSize="small" /></IconButton>
        </Box>
<Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <Box sx={{ flex: '0 0 33.333%', borderRight: 1, borderColor: 'divider', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Box sx={{ p: 2, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">Pasirinkti objektus</Typography>
              <Autocomplete
                size="small" fullWidth
                options={['Vilniaus', 'Kauno', 'Šiaulių', 'Klaipėdos'].map(r => `${r} regionas`)}
                value={regionas ? `${regionas} regionas` : null}
                onChange={(_, v) => setRegionas(v ? v.replace(' regionas', '') : '')}
                renderInput={params => <TextField {...params} label="Regionas" />}
              />

              {regionas && <>
              <Autocomplete
                size="small" fullWidth
                options={OBJEKTU_GRUPES}
                value={grupe || null}
                onChange={(_, v) => { setGrupe(v ?? ''); setExpandedStations(new Set()) }}
                renderInput={params => <TextField {...params} label="Objekto tipas" />}
              />
              {activeAttrs.has('Sistema') && (
                <Autocomplete size="small" fullWidth options={SISTEMOS} value={attrSistema} onChange={(_, v) => setAttrSistema(v)}
                  renderInput={params => <TextField {...params} label="Sistema" />} />
              )}
              {activeAttrs.has('Kelio tipas') && (
                <Autocomplete size="small" fullWidth options={KELIO_TIPAI} value={attrKelioTipas} onChange={(_, v) => setAttrKelioTipas(v)}
                  renderInput={params => <TextField {...params} label="Kelio tipas" />} />
              )}
              {activeAttrs.has('Kelio priedai') && (
                <Autocomplete size="small" fullWidth
                  options={['pneumatinisSniegoValymas', 'hidrolink', 'vietinioValdymoPultas', 'atviriKontaktai']}
                  value={attrKelijoPriedai} onChange={(_, v) => setAttrKelijoPriedai(v)}
                  renderInput={params => <TextField {...params} label="Kelio priedai" />} />
              )}
              {activeAttrs.has('Kaštų centras') && (
                <Autocomplete size="small" fullWidth options={[]} value={attrKastuCentras} onChange={(_, v) => setAttrKastuCentras(v)}
                  renderInput={params => <TextField {...params} label="Kaštų centras" />} />
              )}
              {activeAttrs.has('Kategorija') && (
                <Autocomplete size="small" fullWidth options={[]} value={attrKategorija} onChange={(_, v) => setAttrKategorija(v)}
                  renderInput={params => <TextField {...params} label="Kategorija" />} />
              )}
              {activeAttrs.has('Darbo centras') && (
                <Autocomplete size="small" fullWidth options={[]} value={attrDarboCentras} onChange={(_, v) => setAttrDarboCentras(v)}
                  renderInput={params => <TextField {...params} label="Darbo centras" />} />
              )}
              {activeAttrs.has('Kompanijos kodas') && (
                <Autocomplete size="small" fullWidth options={[]} value={attrKompanijosKodas} onChange={(_, v) => setAttrKompanijosKodas(v)}
                  renderInput={params => <TextField {...params} label="Kompanijos kodas" />} />
              )}
              <Button variant="text" size="small" startIcon={<AddIcon />} sx={{ alignSelf: 'flex-start', px: 0 }} onClick={openAttrModal}>
                Pridėti papildomus objektų pasirinkimo atributus
              </Button>
              {sistema.length > 0 && (
                <Autocomplete
                  size="small" fullWidth
                  options={['PAGRINDINIS_NESTABDOMAS', 'KITAS', 'KALNELIO_PAGRINDINIS', 'KALNELIO_KITAS', 'SKIRSTOMASIS_KALNELIS']}
                  value={kelioKategorija || null}
                  onChange={(_, v) => setKelioKategorija(v ?? '')}
                  renderInput={params => <TextField {...params} label="Kelio kategorija" />}
                />
              )}
              {kelioKategorija && (
                <Autocomplete
                  size="small" fullWidth
                  options={['pneumatinisSniegoValymas', 'hidrolink', 'vietinioValdymoPultas', 'atviriKontaktai']}
                  value={priedai || null}
                  onChange={(_, v) => setPriedai(v ?? '')}
                  renderInput={params => <TextField {...params} label="Priedai" />}
                />
              )}
              </>}
              <Divider sx={{ mx: -2 }} />
              <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">Priskirti užduotis</Typography>
              <Autocomplete
                multiple
                size="small"
                fullWidth
                disableCloseOnSelect
                options={UZDUOTYS}
                value={uzduotis}
                onChange={(_, v) => setUzduotis(v)}
                getOptionLabel={opt => {
                  const match = opt.match(/^(.*?)\s*\[([^\]]+)\]$/)
                  return match ? match[1].trim() : opt
                }}
                renderTags={(value) => value.length > 0
                  ? <Typography variant="body2" sx={{ ml: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 180 }}>
                      {(() => { const m = value[0].match(/^(.*?)\s*\[([^\]]+)\]$/); return m ? m[1].trim() : value[0] })()}
                      {value.length > 1 && <Typography component="span" variant="body2" color="text.secondary"> +{value.length - 1}</Typography>}
                    </Typography>
                  : null
                }
                renderInput={params => <TextField {...params} label="Pasirinkti užduotis" />}
              />
              <Typography variant="caption" color="text.secondary">Pasirinktos užduotys ({uzduotis.length}):</Typography>
              {uzduotis.length > 0 && (
                <Stack spacing={0.5}>
                  {uzduotis.map(u => {
                    const match = u.match(/^(.*?)\s*\[([^\]]+)\]$/)
                    const label = match ? match[1].trim() : u
                    const daznumas = match ? match[2] : null
                    return (
                      <Box key={u} sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 0.5, bgcolor: 'background.paper', border: 1, borderColor: 'divider', borderRadius: '8px', px: 1.5, py: 0.75 }}>
                        <Stack spacing={0.25} sx={{ flex: 1 }}>
                          <Typography variant="caption" sx={{ lineHeight: 1.5 }}>{label}</Typography>
                          {daznumas && <Typography variant="caption" color="text.secondary">Periodiškumas: {daznumas}</Typography>}
                          <Typography variant="caption" color="text.secondary">DC: {UZDUOTYS_DC[u] ?? '—'}</Typography>
                        </Stack>
                        <IconButton size="small" sx={{ p: 0, mt: '1px', flexShrink: 0 }} onClick={() => setUzduotis(prev => prev.filter(x => x !== u))}>
                          <CloseIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      </Box>
                    )
                  })}
                </Stack>
              )}
              <Divider sx={{ mx: -2 }} />
              <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">Plano galiojimas</Typography>
              <TextField
                label="Planas galioja nuo"
                type="date"
                size="small"
                fullWidth
                value={galiojaNuo}
                onChange={e => setGaliojaNuo(e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
                sx={{
                  '& input::-webkit-datetime-edit-fields-wrapper': { color: galiojaNuo ? 'text.primary' : 'text.secondary' },
                  '& input::-webkit-datetime-edit-text': { color: galiojaNuo ? 'text.primary' : 'text.secondary' },
                }}
              />
              <TextField
                label="Galioja iki"
                type="date"
                size="small"
                fullWidth
                value={galiojaIki}
                onChange={e => setGaliojaIki(e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
                sx={{
                  '& input::-webkit-datetime-edit-fields-wrapper': { color: galiojaIki ? 'text.primary' : 'text.secondary' },
                  '& input::-webkit-datetime-edit-text': { color: galiojaIki ? 'text.primary' : 'text.secondary' },
                }}
              />
            </Box>
            <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', flexShrink: 0 }}>
              <Button variant="contained" fullWidth size="small" onClick={() => {
                const darboCentrai = filteredDarboCentrai.map(dc => ({
                  name: dc.name,
                  stations: dc.stations.map(st => ({
                    name: st.name,
                    objects: [
                      ...st.objects.filter(o => !deselectedObjects.has(o.name)).map(o => o.name),
                      ...(extraObjects[st.name] ?? []),
                    ],
                    paleidimoData: stationDates[st.name] ?? '',
                  })),
                }))
                const atributai: Record<string, string> = {}
                if (attrSistema) atributai['Sistema'] = attrSistema
                if (attrKelioTipas) atributai['Kelio tipas'] = attrKelioTipas
                if (attrKelijoPriedai) atributai['Kelio priedai'] = attrKelijoPriedai
                if (attrKastuCentras) atributai['Kaštų centras'] = attrKastuCentras
                if (attrKategorija) atributai['Kategorija'] = attrKategorija
                if (attrDarboCentras) atributai['Darbo centras'] = attrDarboCentras
                if (attrKompanijosKodas) atributai['Kompanijos kodas'] = attrKompanijosKodas
                const payload = { regionas, grupe, sistema, kelioKategorija, priedai, uzduotys: uzduotis, atributai, galiojaNuo, galiojaIki, darboCentrai, objects: darboCentrai.flatMap(dc => dc.stations.flatMap(s => s.objects)) }
                if (editId) { updateV2Plan(editId, payload) } else { addV2Plan(payload) }
                navigate('/planuotojas')
              }}>
                Išsaugoti
              </Button>
            </Box>
          </Box>

          <Box sx={{ flex: '0 0 66.667%', display: 'flex', flexDirection: 'column', overflow: 'hidden', bgcolor: 'grey.50' }}>
            <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper', flexShrink: 0 }}>
              <Typography variant="caption" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary' }}>Aptarnaujami objektai</Typography>
            </Box>
            {grupe && (
              <Box sx={{ px: 2, py: 1, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper', flexShrink: 0, display: 'flex', flexWrap: 'wrap', gap: 0.5, alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>Iš viso {filteredTotal}:</Typography>
                {regionas && <Chip size="small" sx={{ borderRadius: '999px' }} label={`${regionas} regionas`} />}
                {grupe && <Chip size="small" sx={{ borderRadius: '999px' }} label={grupe} />}
                {attrSistema && <Chip size="small" sx={{ borderRadius: '999px' }} label={attrSistema} />}
                {attrKelioTipas && <Chip size="small" sx={{ borderRadius: '999px' }} label={attrKelioTipas} />}
                {attrKelijoPriedai && <Chip size="small" sx={{ borderRadius: '999px' }} label={attrKelijoPriedai} />}
                {attrKastuCentras && <Chip size="small" sx={{ borderRadius: '999px' }} label={attrKastuCentras} />}
                {attrKategorija && <Chip size="small" sx={{ borderRadius: '999px' }} label={attrKategorija} />}
                {attrDarboCentras && <Chip size="small" sx={{ borderRadius: '999px' }} label={attrDarboCentras} />}
                {attrKompanijosKodas && <Chip size="small" sx={{ borderRadius: '999px' }} label={attrKompanijosKodas} />}
              </Box>
            )}
            <Box sx={{ flex: 1, overflowY: 'auto' }}>
              {!grupe && (
                <Stack alignItems="center" justifyContent="center" sx={{ height: '100%', px: 2 }}>
                  <Typography variant="caption" color="text.disabled" textAlign="center">Pasirinkite objekto tipą</Typography>
                </Stack>
              )}
              {grupe && filteredDarboCentrai.map(({ name, stations }) => {
                return (
                  <Box key={name}>
                    <Box sx={{ px: 2, py: 1.5, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' }}>
                      <Typography variant="body2" fontWeight={500}>{name} <Typography component="span" variant="caption" color="text.secondary">({stations.reduce((a, s) => a + s.objects.length, 0)})</Typography></Typography>
                    </Box>
                    <>
                      {stations.map(st => {
                        const stOpen = expandedStations.has(st.name)
                        return (
                          <Box key={st.name}>
                            <Stack
                              direction="row"
                              alignItems="center"
                              justifyContent="space-between"
                              sx={{ pl: 3, pr: 2, py: 1, minHeight: 40, bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}
                            >
                              <Stack direction="row" alignItems="center" spacing={0.5}>
                                <ExpandMoreIcon onClick={() => toggleStation(st.name)} sx={{ fontSize: 14, color: 'text.disabled', transform: stOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', cursor: 'pointer' }} />
                                <Typography variant="caption" fontWeight={500} color="text.primary">{st.name} <Typography component="span" variant="caption" color="text.secondary">({st.objects.length})</Typography></Typography>
                              </Stack>
                              <Stack direction="row" alignItems="center" spacing={0.5} sx={{ whiteSpace: 'nowrap' }}>
                                <Typography variant="caption" color="text.secondary">Plano paleidimas:</Typography>
                                {stationDates[st.name]
                                  ? <Typography variant="caption" fontWeight={500} color="text.primary">{stationDates[st.name]}</Typography>
                                  : <Button size="small" variant="text" sx={{ fontSize: 11, px: 0, py: 0, minWidth: 0, verticalAlign: 'baseline' }}
                                      onClick={e => setDateAnchor({ el: e.currentTarget, station: st.name })}>
                                      Pasirinkti
                                    </Button>
                                }
                              </Stack>
                            </Stack>
                            <Collapse in={stOpen}>
                              {[...st.objects, ...(extraObjects[st.name] ?? []).map(name => ({ name, sistema: '', kelioTipas: '' }))].map(obj => {
                                const checked = !deselectedObjects.has(obj.name)
                                return (
                                  <Stack key={obj.name} direction="row" alignItems="center" spacing={0.5}
                                    onClick={() => setDeselectedObjects(prev => { const s = new Set(prev); s.has(obj.name) ? s.delete(obj.name) : s.add(obj.name); return s })}
                                    sx={{ pl: 3, pr: 2, py: 0.5, borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50', cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                                  >
                                    <Checkbox size="small" checked={checked} disableRipple sx={{ p: 0, flexShrink: 0 }} />
                                    <Typography variant="caption" color={checked ? 'text.secondary' : 'text.disabled'}>{obj.name}</Typography>
                                  </Stack>
                                )
                              })}
                              <Box sx={{ pl: 3, pr: 2, py: 0.75, borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
                                <Button size="small" variant="text" startIcon={<AddIcon />} sx={{ fontSize: 11, px: 0, py: 0, minWidth: 0 }} onClick={() => { setDrawerStation(st.name); setDrawerSelected(new Set()); setAddObjectDrawer(true) }}>
                                  Pridėti objektą
                                </Button>
                              </Box>
                            </Collapse>
                          </Box>
                        )
                      })}
                    </>
                  </Box>
                )
              })}
            </Box>
          </Box>
        </Box>
    </Box>

      <Dialog open={attrModalOpen} onClose={() => setAttrModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ pr: 6 }}>
          <Typography variant="subtitle1" fontWeight={600}>Pasirinkti atributus</Typography>
          <Typography variant="caption" color="text.secondary">Iešmai ir sankirtos</Typography>
          <IconButton size="small" onClick={() => setAttrModalOpen(false)} sx={{ position: 'absolute', right: 12, top: 12 }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ py: 1 }}>
          <Stack>
            {ATTR_OPTIONS.map(attr => (
              <FormControlLabel
                key={attr}
                control={
                  <Checkbox
                    size="small"
                    checked={attrDraft.has(attr)}
                    onChange={e => {
                      setAttrDraft(prev => {
                        const next = new Set(prev)
                        e.target.checked ? next.add(attr) : next.delete(attr)
                        return next
                      })
                    }}
                  />
                }
                label={<Typography variant="body2">{attr}</Typography>}
              />
            ))}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 2, py: 1.5 }}>
          <Button size="small" onClick={() => setAttrModalOpen(false)}>Atšaukti</Button>
          <Button size="small" variant="contained" disableElevation onClick={saveAttrs}>Išsaugoti</Button>
        </DialogActions>
      </Dialog>

      <Popover
        open={!!dateAnchor}
        anchorEl={dateAnchor?.el}
        onClose={() => setDateAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        TransitionProps={{ onEntered: () => dateInputRef.current?.showPicker?.() }}
        PaperProps={{ sx: { overflow: 'hidden', boxShadow: 'none', bgcolor: 'transparent', p: 0 } }}
      >
        <TextField
          type="date"
          size="small"
          inputRef={dateInputRef}
          value={dateAnchor ? (stationDates[dateAnchor.station] ?? '') : ''}
          onChange={e => {
            if (dateAnchor) setStationDates(prev => ({ ...prev, [dateAnchor.station]: e.target.value }))
            setDateAnchor(null)
          }}
          sx={{ width: 1, height: 1, opacity: 0, overflow: 'hidden' }}
        />
      </Popover>

      <Drawer anchor="right" open={addObjectDrawer} onClose={() => setAddObjectDrawer(false)}
        sx={{ zIndex: 1400 }}
        PaperProps={{ sx: { width: 320, borderRadius: 0, display: 'flex', flexDirection: 'column' } }}
      >
        <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <Typography variant="subtitle2" fontWeight={600}>Pridėti objektą</Typography>
          <IconButton size="small" onClick={() => setAddObjectDrawer(false)}><CloseIcon fontSize="small" /></IconButton>
        </Box>
        <List dense disablePadding sx={{ flex: 1, overflowY: 'auto' }}>
          {Array.from({ length: 30 }, (_, i) => `Iešmas Nr. ${1001 + i * 2}`).map(name => {
            const checked = drawerSelected.has(name)
            return (
              <ListItemButton key={name} onClick={() => setDrawerSelected(prev => { const s = new Set(prev); s.has(name) ? s.delete(name) : s.add(name); return s })} sx={{ borderBottom: 1, borderColor: 'divider', gap: 1 }}>
                <Checkbox size="small" checked={checked} disableRipple sx={{ p: 0, flexShrink: 0 }} />
                <ListItemText primary={name} primaryTypographyProps={{ variant: 'body2' }} />
              </ListItemButton>
            )
          })}
        </List>
        <Box sx={{ px: 2, py: 1.5, borderTop: 1, borderColor: 'divider', display: 'flex', gap: 1, flexShrink: 0 }}>
          <Button size="small" fullWidth onClick={() => setAddObjectDrawer(false)}>Atšaukti</Button>
          <Button size="small" variant="contained" fullWidth disableElevation onClick={() => {
            if (drawerStation && drawerSelected.size > 0) {
              setExtraObjects(prev => ({ ...prev, [drawerStation]: [...(prev[drawerStation] ?? []), ...Array.from(drawerSelected)] }))
            }
            setAddObjectDrawer(false)
          }}>Pridėti</Button>
        </Box>
      </Drawer>
    </>
  )
}
