import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, IconButton, FormControl, InputLabel, Select, MenuItem, Chip, OutlinedInput, Divider, Stack, CircularProgress, Collapse, Button } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { WebAppShell } from '../layout/WebAppShell'
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
  'APS (Automatinė pervažų signalizacija)',
  'Ašių skaičiavimo sistemos',
  'Bekontakčiai kelio jutikliai',
  'Bėgių grandinės',
  'Elektros tiekimas',
  'Fotoelektriniai / radiotechniniai jutikliai',
  'Gabarito kontrolės įrenginiai',
  'Gelžbetoninės konstrukcijos',
  'Iešmai',
  'Kabelių tinklas ir montažas',
  'Mikroprocesorinės sistemos (MPC/SKMPC)',
  'Signalizacijos aparatinė įranga',
  'Sąryšis ir veikimo parametrai',
  'Tunelių ir tiltų signalizacija',
  'Vagonų stabdikliai',
  'Valdymo įrenginiai',
  'Šviesoforai',
]

const KELIO_TIPAI = [
  'Pagr. ir nestabdomo prav.',
  'Atvykimo keliai',
  'Kalnelio keliai',
]

const UZDUOTYS = [
  '4.1.1a. Pavarų ir tikrintuvų išorinė būklė; smailės prigludimo tikrinimas laužtuvėliu [Kartą per savaitę]',
  '4.1.1b. Pavarų ir tikrintuvų išorinė būklė; smailės prigludimo tikrinimas laužtuvėliu [Kartą per 2 savaites]',
  '4.1.1c. Pavarų ir tikrintuvų išorinė būklė; smailės prigludimo tikrinimas [Kartą per savaitę]',
  '4.1.1d. Pavarų išorinė būklė; smailės prigludimo tikrinimas [Kartą per 2 savaites]',
  '4.1.2a. Smailių prigludimas su 4 mm ir 2 mm tarpamačiais; tikrinimas ties tikrintuvu [Kartą per 2 savaites]',
  '4.1.2b. Smailių prigludimas su 4 mm ir 2 mm tarpamačiais [Kartą per 4 savaites]',
  '4.1.2c. Smailių prigludimas su tarpamačiais [Kartą per 2 savaites]',
  '4.1.3. Išorinis elektros pavarų ir garnitūrų valymas [Du kartus per metus]',
  '4.1.4a. Elektros pavarų ir tikrintuvų vidaus būklės tikrinimas [Kartą per 4 savaites]',
  '4.1.4b. Elektros pavarų ir tikrintuvų vidaus būklės tikrinimas [Keturis kartus per metus]',
  '4.1.4c. Pavarų vidaus būklės tikrinimas [Kartą per savaitę]',
  '4.1.4d. S700 pavarų vidaus būklės tikrinimas [Du kartus per metus]',
  '4.1.4e. Unistar pavarų vidaus būklės tikrinimas [Du kartus per metus]',
  '4.1.5. Keldėžių ir UPM movų vidinės būklės, reverso relių tikrinimas [Du kartus per metus]',
  '4.1.6a. Nuolatinės įtampos variklio srovės matavimas normaliu ir sankabos režimais [Keturis kartus per metus]',
  '4.1.6b. Nuolatinės įtampos variklio srovės matavimas [Du kartus per metus]',
  '4.1.6c. Variklio srovės matavimas ir kolektorių tikrinimas [Kartą per savaitę]',
  '4.1.6d. Variklio srovės matavimas ir kolektorių tikrinimas [Kartą per 2 savaites]',
  '4.1.7. Trifazės elektros įtampos variklio srovės matavimas [Kartą per metus]',
  '4.1.8a. Elektros variklio įtampos matavimas [Kartą per metus]',
  '4.1.8b. Elektros variklio įtampos matavimas [Kartą per 2 metus]',
  '4.1.8c. Elektros variklio įtampos matavimas [Keturis kartus per metus]',
  '4.1.8d. Elektros variklio įtampos matavimas [Du kartus per metus]',
  '4.1.9. Sniego pneumatinio valymo įrenginių schemos veikimo tikrinimas [Kartą per metus]',
  '4.1.10. Vietinio valdymo kontakto būklės ir veikimo tikrinimas [Du kartus per metus]',
  '4.2.2. Hidraulinės sistemos slėgio matavimas [Du kartus per metus]',
  '4.2.3. Rankinio pervedimo mechanizmo tikrinimas [Kartą per metus]',
  '4.2.4. HIDROLINK tvirtinimo mazgų išorinės būklės tikrinimas [Du kartus per metus]',
  '4.2.5. HIDROLINK hidraulinių cilindrų, vožtuvų, slėgio tikrinimas [Du kartus per metus]',
  '4.3.1a. Jutiklių maitinimo ir išėjimo įtampos matavimas (vidurinė padėtis) [Du kartus per metus]',
  '4.3.1b. Jutiklių maitinimo ir išėjimo įtampos matavimas (kitos padėtys) [Kartą per 4 savaites]',
  '4.4.1. Kontaktinių ritinėlių ir kontaktų būklės tikrinimas [Kartą per metus]',
  '4.4.2. Transmisijos tikrinimas ir tepimas, išardant [Kartą per 6 metus]',
  '4.4.3. Pavarų įžeminimo tvirtinimo elementų tikrinimas [Kartą per metus]',
  '4.5.1. Verstuko išorinės būklės ir tarpo tikrinimas [Kartą per 4 savaites]',
  '4.6.1a. Iešmo ir kontrolinio užrakto tikrinimas su 4 mm tarpamačiu [Kartą per 2 savaites]',
  '4.6.1b. Iešmo ir kontrolinio užrakto tikrinimas su 4 mm tarpamačiu [Kartą per 4 savaites]',
  '4.6.2. Kontrolinio užrakto išardymas, valymas, plovimas, tepimas [Kartą per metus]',
  '4.7.1. Elektros pavaros įtampos ir srovės matavimas [Kartą per metus]',
  '4.7.2a. Varančiojo veleno ir linijinio guolio tepimas [Du kartus per metus]',
  '4.7.2b. Kitų judančiųjų dalių ir suktuko mechanizmo tepimas [Kartą per metus]',
]

const DARBO_CENTRAI: { name: string; stations: { name: string; objects: string[] }[] }[] = [
  { name: 'Šiaulių darbo centras', stations: [
    { name: 'Šiaulių gel. stotis', objects: ['Iešmas Nr. 1K', 'Iešmas Nr. 3K', 'Iešmas Nr. 5K', 'Iešmas Nr. 7K', 'Iešmas Nr. 9K', 'Iešmas Nr. 11K', 'Iešmas Nr. 13K', 'Iešmas Nr. 15K'] },
    { name: 'Zoknių gel. stotis', objects: ['Iešmas Nr. 2K', 'Iešmas Nr. 4K', 'Iešmas Nr. 6K', 'Iešmas Nr. 8K', 'Iešmas Nr. 10K', 'Iešmas Nr. 12K'] },
    { name: 'Bugenių gel. stotis', objects: ['Iešmas Nr. 101K', 'Iešmas Nr. 103K', 'Iešmas Nr. 105K', 'Iešmas Nr. 107K'] },
  ]},
  { name: 'Kužių darbo centras', stations: [
    { name: 'Kužių gel. stotis', objects: ['Iešmas Nr. 201K', 'Iešmas Nr. 203K', 'Iešmas Nr. 205K', 'Iešmas Nr. 207K', 'Iešmas Nr. 209K'] },
    { name: 'Radviliškio gel. stotis', objects: ['Iešmas Nr. 1L', 'Iešmas Nr. 3L', 'Iešmas Nr. 5L', 'Iešmas Nr. 7L', 'Iešmas Nr. 9L', 'Iešmas Nr. 11L', 'Iešmas Nr. 13L'] },
    { name: 'Šeduvos gel. stotis', objects: ['Iešmas Nr. 301K', 'Iešmas Nr. 303K', 'Iešmas Nr. 305K'] },
  ]},
  { name: 'Akmenės darbo centras', stations: [
    { name: 'Akmenės gel. stotis', objects: ['Iešmas Nr. 401K', 'Iešmas Nr. 403K', 'Iešmas Nr. 405K', 'Iešmas Nr. 407K', 'Iešmas Nr. 409K', 'Iešmas Nr. 411K'] },
    { name: 'Viekšnių gel. stotis', objects: ['Iešmas Nr. 501K', 'Iešmas Nr. 503K', 'Iešmas Nr. 505K', 'Iešmas Nr. 507K'] },
    { name: 'Papilės gel. stotis', objects: ['Iešmas Nr. 601K', 'Iešmas Nr. 603K', 'Iešmas Nr. 605K', 'Iešmas Nr. 607K', 'Iešmas Nr. 609K'] },
  ]},
  { name: 'Rokiškio darbo centras', stations: [
    { name: 'Rokiškio gel. stotis', objects: ['Iešmas Nr. 701K', 'Iešmas Nr. 703K', 'Iešmas Nr. 705K', 'Iešmas Nr. 707K', 'Iešmas Nr. 709K', 'Iešmas Nr. 711K', 'Iešmas Nr. 713K'] },
    { name: 'Panevėžio gel. stotis', objects: ['Iešmas Nr. 801K', 'Iešmas Nr. 803K', 'Iešmas Nr. 805K', 'Iešmas Nr. 807K', 'Iešmas Nr. 809K', 'Iešmas Nr. 811K', 'Iešmas Nr. 813K', 'Iešmas Nr. 815K'] },
    { name: 'Kupiškio gel. stotis', objects: ['Iešmas Nr. 901K', 'Iešmas Nr. 903K', 'Iešmas Nr. 905K', 'Iešmas Nr. 907K', 'Iešmas Nr. 909K'] },
  ]},
]


export function PlanuotojasV2Page() {
  const navigate = useNavigate()
  const { addV2Plan } = useV2Plans()
  const [grupe, setGrupe] = useState('')
  const [sistema, setSistema] = useState<string[]>([])
  const [kelioKategorija, setKelioKategorija] = useState('')
  const [priedai, setPriedai] = useState('')
  const [uzduotis, setUzduotis] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())
  const [expandedStations, setExpandedStations] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!priedai) { setLoaded(false); return }
    setLoaded(false)
    setLoading(true)
    const t = setTimeout(() => { setLoading(false); setLoaded(true) }, 800)
    return () => clearTimeout(t)
  }, [priedai])

  const toggleGroup = (g: string) => {
    setExpandedGroups(prev => { const s = new Set(prev); s.has(g) ? s.delete(g) : s.add(g); return s })
  }
  const toggleStation = (st: string) => {
    setExpandedStations(prev => { const s = new Set(prev); s.has(st) ? s.delete(st) : s.add(st); return s })
  }

  return (
    <WebAppShell>
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', bgcolor: 'background.paper' }}>
        <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="subtitle1" fontWeight={600}>Naujas planinis darbas</Typography>
          <IconButton size="small" onClick={() => navigate('/planuotojas')}><CloseIcon fontSize="small" /></IconButton>
        </Box>
<Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <Box sx={{ flex: 1, borderRight: 1, borderColor: 'divider', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Box sx={{ p: 2, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">Pasirinkti objektų tipą</Typography>
              <FormControl fullWidth size="small">
                <InputLabel>Pasirinkti objektų grupę</InputLabel>
                <Select
                  value={grupe}
                  onChange={e => setGrupe(e.target.value)}
                  label="Pasirinkti objektų grupę"
                >
                  {OBJEKTU_GRUPES.map(g => (
                    <MenuItem key={g} value={g}>{g}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              {grupe && <FormControl fullWidth size="small">
                <InputLabel>Iešmų sistema</InputLabel>
                <Select
                  multiple
                  value={sistema}
                  onChange={e => setSistema(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value as string[])}
                  input={<OutlinedInput label="Iešmų sistema" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[]).map(v => <Chip key={v} label={v} size="small" />)}
                    </Box>
                  )}
                >
                  {SISTEMOS.map(s => (
                    <MenuItem key={s} value={s}>{s}</MenuItem>
                  ))}
                </Select>
              </FormControl>}
              {sistema.length > 0 && (
                <FormControl fullWidth size="small">
                  <InputLabel>Kelio kategorija</InputLabel>
                  <Select value={kelioKategorija} onChange={e => setKelioKategorija(e.target.value)} label="Kelio kategorija">
                    <MenuItem value="PAGRINDINIS_NESTABDOMAS">PAGRINDINIS_NESTABDOMAS (pagrindiniai ir nestabdomo važiavimo keliai)</MenuItem>
                    <MenuItem value="KITAS">KITAS (kiti keliai)</MenuItem>
                    <MenuItem value="KALNELIO_PAGRINDINIS">KALNELIO_PAGRINDINIS (kalnelio pagrindiniai ir pirmieji atšakynai)</MenuItem>
                    <MenuItem value="KALNELIO_KITAS">KALNELIO_KITAS</MenuItem>
                    <MenuItem value="SKIRSTOMASIS_KALNELIS">SKIRSTOMASIS_KALNELIS</MenuItem>
                  </Select>
                </FormControl>
              )}
              {kelioKategorija && (
                <FormControl fullWidth size="small">
                  <InputLabel>Priedai</InputLabel>
                  <Select value={priedai} onChange={e => setPriedai(e.target.value)} label="Priedai">
                    <MenuItem value="pneumatinisSniegoValymas">pneumatinisSniegoValymas</MenuItem>
                    <MenuItem value="hidrolink">hidrolink</MenuItem>
                    <MenuItem value="vietinioValdymoPultas">vietinioValdymoPultas</MenuItem>
                    <MenuItem value="atviriKontaktai">atviriKontaktai</MenuItem>
                  </Select>
                </FormControl>
              )}
              <Divider />
              <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">Priskirti užduotis</Typography>
              <FormControl fullWidth size="small" disabled={!grupe || sistema.length === 0 || !kelioKategorija || !priedai} sx={{ mt: 0 }}>
                <InputLabel>Pasirinkti užduotį</InputLabel>
                <Select
                  multiple
                  value={uzduotis}
                  onChange={e => setUzduotis(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value as string[])}
                  input={<OutlinedInput label="Pasirinkti užduotį" />}
                  renderValue={(selected) => (
                    <Typography variant="body2" color="text.secondary">
                      {(selected as string[]).length === 0 ? '' : `Pasirinkta: ${(selected as string[]).length}`}
                    </Typography>
                  )}
                  MenuProps={{ PaperProps: { sx: { maxHeight: 320 } } }}
                >
                  {UZDUOTYS.map(u => (
                    <MenuItem key={u} value={u} sx={{ whiteSpace: 'normal', fontSize: '0.75rem' }}>{u}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Stack spacing={1} sx={{ mt: -1 }}>
              {uzduotis.map(u => (
                <Box key={u} sx={{ border: 1, borderColor: 'divider', borderRadius: 1, px: 1.5, py: 1, bgcolor: 'background.paper', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
                  <Typography variant="caption" color="text.primary">{u}</Typography>
                  <IconButton size="small" sx={{ p: 0, flexShrink: 0, mt: '-2px' }} onClick={() => setUzduotis(prev => prev.filter(x => x !== u))}>
                    <CloseIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </Box>
              ))}
              </Stack>
            </Box>
            <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', flexShrink: 0 }}>
              <Button variant="contained" fullWidth size="small" onClick={() => {
                addV2Plan({ grupe, sistema, kelioKategorija, priedai, uzduotys: uzduotis, objects: DARBO_CENTRAI.flatMap(m => m.stations.flatMap(s => s.objects)) })
                navigate('/planuotojas')
              }}>Išsaugoti</Button>
            </Box>
          </Box>

          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', bgcolor: 'grey.50' }}>
            <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}>
              <Typography variant="caption" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary' }}>
                Aptarnaujami objektai
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                Šiaulių regiono kelių priežiūra
              </Typography>
            </Box>
            <Box sx={{ flex: 1, overflowY: 'auto' }}>
              {loading && (
                <Stack alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
                  <CircularProgress size={24} />
                </Stack>
              )}
              {!loading && !loaded && (
                <Stack alignItems="center" justifyContent="center" sx={{ height: '100%', px: 2 }}>
                  <Typography variant="caption" color="text.disabled" textAlign="center">Pasirinkite kelio tipą</Typography>
                </Stack>
              )}
              {!loading && loaded && DARBO_CENTRAI.map(({ name, stations }) => {
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
                                <Stack key={obj} sx={{ pl: 4, pr: 2, py: 0.75, borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
                                  <Typography variant="caption" color="text.secondary">{obj}</Typography>
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
    </WebAppShell>
  )
}
