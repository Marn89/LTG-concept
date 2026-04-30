import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, IconButton, Chip, Divider, Stack, Collapse, Button, Autocomplete, TextField, Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel, Checkbox, Stepper, Step, StepLabel } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useV2Plans } from '../features/planuotojas/PlanuotojasV2Context'

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
  const { addV2Plan } = useV2Plans()
  const [regionas, setRegionas] = useState('')
  const [grupe, setGrupe] = useState('')
  const [sistema, setSistema] = useState<string[]>([])
  const [kelioKategorija, setKelioKategorija] = useState('')
  const [priedai, setPriedai] = useState('')
  const [uzduotis, setUzduotis] = useState<string[]>([])
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())
  const [expandedStations, setExpandedStations] = useState<Set<string>>(new Set())
  const [activeStep, setActiveStep] = useState(0)
  const [attrModalOpen, setAttrModalOpen] = useState(false)
  const [attrDraft, setAttrDraft] = useState<Set<string>>(new Set())
  const [activeAttrs, setActiveAttrs] = useState<Set<string>>(new Set())
  const [attrSistema, setAttrSistema] = useState<string | null>(null)
  const [attrKelioTipas, setAttrKelioTipas] = useState<string | null>(null)
  const [attrKastuCentras, setAttrKastuCentras] = useState<string | null>(null)
  const [attrKategorija, setAttrKategorija] = useState<string | null>(null)
  const [attrDarboCentras, setAttrDarboCentras] = useState<string | null>(null)
  const [attrKompanijosKodas, setAttrKompanijosKodas] = useState<string | null>(null)
  const [attrKelijoPriedai, setAttrKelijoPriedai] = useState<string | null>(null)

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

  const toggleGroup = (g: string) => {
    setExpandedGroups(prev => { const s = new Set(prev); s.has(g) ? s.delete(g) : s.add(g); return s })
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
          <Typography variant="subtitle1" fontWeight={600}>Naujas planinis darbas</Typography>
          <IconButton size="small" onClick={() => navigate('/planuotojas')}><CloseIcon fontSize="small" /></IconButton>
        </Box>
<Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <Box sx={{ flex: '0 0 33.333%', borderRight: 1, borderColor: 'divider', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Stepper activeStep={activeStep} sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}>
              <Step><StepLabel><Typography variant="caption">Pasirinkti objektus</Typography></StepLabel></Step>
              <Step><StepLabel><Typography variant="caption">Priskirti užduotis</Typography></StepLabel></Step>
            </Stepper>
            <Box sx={{ p: 2, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
              {activeStep === 1 && (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">Priskirti užduotis</Typography>
                    <Typography variant="caption" color="text.secondary">{uzduotis.length}/{UZDUOTYS.length}</Typography>
                  </Box>
                  <Stack spacing={1}>
                    {UZDUOTYS.map(u => {
                      const checked = uzduotis.includes(u)
                      const match = u.match(/^(.*?)\s*\[([^\]]+)\]$/)
                      const taskText = match ? match[1].trim() : u
                      const daznumas = match ? match[2] : ''
                      return (
                        <Box
                          key={u}
                          onClick={() => setUzduotis(prev => checked ? prev.filter(x => x !== u) : [...prev, u])}
                          sx={{
                            border: 2,
                            borderColor: checked ? 'primary.main' : 'divider',
                            borderRadius: 1.5,
                            px: 1.5,
                            py: 1,
                            cursor: 'pointer',
                            bgcolor: checked ? 'primary.50' : 'background.paper',
                            '&:hover': { borderColor: 'primary.main' },
                            transition: 'all 0.15s',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 1,
                          }}
                        >
                          <Checkbox size="small" checked={checked} disableRipple sx={{ p: 0, mt: '1px', flexShrink: 0 }} />
                          <Stack spacing={0.5}>
                            <Box>
                              <Typography component="span" variant="caption" color="text.secondary">Užduotis: </Typography>
                              <Typography component="span" variant="caption" sx={{ lineHeight: 1.5 }}>{taskText}</Typography>
                            </Box>
                            {daznumas && (
                              <Box>
                                <Typography component="span" variant="caption" color="text.secondary">Atlikimo dažnis: </Typography>
                                <Typography component="span" variant="caption" sx={{ lineHeight: 1.5 }}>{daznumas}</Typography>
                              </Box>
                            )}
                          </Stack>
                        </Box>
                      )
                    })}
                  </Stack>
                </>
              )}
              {activeStep === 0 && <>
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
                onChange={(_, v) => setGrupe(v ?? '')}
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
              </>}
            </Box>
            <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', flexShrink: 0, display: 'flex', gap: 1 }}>
              {activeStep === 1 && (
                <Button size="small" onClick={() => setActiveStep(0)}>Atgal</Button>
              )}
              <Button variant="contained" fullWidth size="small" onClick={() => {
                if (activeStep === 0) { setActiveStep(1); return }
                addV2Plan({ grupe, sistema, kelioKategorija, priedai, uzduotys: uzduotis, objects: filteredDarboCentrai.flatMap(m => m.stations.flatMap(s => s.objects.map(o => o.name))) })
                navigate('/planuotojas')
              }}>
                {activeStep === 0 ? 'Kitas žingsnis' : 'Išsaugoti'}
              </Button>
            </Box>
          </Box>

          <Box sx={{ flex: '0 0 66.667%', display: 'flex', flexDirection: 'column', overflow: 'hidden', bgcolor: 'grey.50' }}>
            <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}>
              <Typography variant="caption" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary' }}>
                Aptarnaujami objektai{grupe ? ` (${filteredTotal})` : ''}
              </Typography>
              {(regionas || grupe || attrSistema || attrKelioTipas || attrKelijoPriedai || attrKastuCentras || attrKategorija || attrDarboCentras || attrKompanijosKodas) && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
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
            </Box>
            <Box sx={{ flex: 1, overflowY: 'auto' }}>
              {!grupe && (
                <Stack alignItems="center" justifyContent="center" sx={{ height: '100%', px: 2 }}>
                  <Typography variant="caption" color="text.disabled" textAlign="center">Pasirinkite objekto tipą</Typography>
                </Stack>
              )}
              {grupe && filteredDarboCentrai.map(({ name, stations }) => {
                const isOpen = expandedGroups.has(name)
                return (
                  <Box key={name}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      onClick={() => toggleGroup(name)}
                      sx={{ px: 2, py: 1.5, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider', cursor: 'pointer', '&:hover': { bgcolor: 'grey.100' } }}
                    >
                      <Typography variant="body2" fontWeight={500}>{name} <Typography component="span" variant="caption" color="text.secondary">({stations.reduce((a, s) => a + s.objects.length, 0)})</Typography></Typography>
                      <ExpandMoreIcon sx={{ fontSize: 16, color: 'text.disabled', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                    </Stack>
                    <Collapse in={isOpen}>
                      {stations.map(st => {
                        const stOpen = expandedStations.has(st.name)
                        return (
                          <Box key={st.name}>
                            <Stack
                              direction="row"
                              alignItems="center"
                              justifyContent="space-between"
                              onClick={() => toggleStation(st.name)}
                              sx={{ pl: 3, pr: 2, py: 1, bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider', cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                            >
                              <Typography variant="caption" fontWeight={500} color="text.primary">{st.name} <Typography component="span" variant="caption" color="text.secondary">({st.objects.length})</Typography></Typography>
                              <ExpandMoreIcon sx={{ fontSize: 14, color: 'text.disabled', transform: stOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                            </Stack>
                            <Collapse in={stOpen}>
                              {st.objects.map(obj => (
                                <Stack key={obj.name} sx={{ pl: 4, pr: 2, py: 0.75, borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
                                  <Typography variant="caption" color="text.secondary">{obj.name}</Typography>
                                </Stack>
                              ))}
                            </Collapse>
                          </Box>
                        )
                      })}
                    </Collapse>
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
    </>
  )
}
