import { useState } from 'react'
import { useV2Plans } from '../features/planuotojas/PlanuotojasV2Context'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import {
  Box, Typography, Stack, Button, Divider,
  Chip, Autocomplete, TextField, IconButton, Breadcrumbs,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Checkbox, FormControlLabel, Select, MenuItem, InputLabel, FormControl, Collapse,
  Tabs, Tab, Menu, ListItemIcon, ListItemText,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AddIcon from '@mui/icons-material/Add'
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import DirectionsRailwayOutlinedIcon from '@mui/icons-material/DirectionsRailwayOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { WebAppShell } from '../layout/WebAppShell'
import { ROKISKIS_TOP_LEVEL, ROKISKIS_BY_PARENT, type TechObject } from '../data/rokiskisObjects'
import { RecurrencePicker } from '../components/RecurrencePicker'
import { StationMap } from '../components/StationMap'
import { LOKACIJA_COORDS } from '../data/rokiskisCoords'
import { IESMAI_SUTEPIMAS, IESMAI_SUTEPIMAS_GROUPED } from '../data/iesmaiSutepimas'
import { UZDUOTYS_DC } from './PlanuotojasV2Page'
const POPPER_PROPS = {
  placement: 'bottom-start' as const,
  modifiers: [{ name: 'flip', enabled: false }],
  sx: { width: 440 },
}

const LISTBOX_PROPS = {
  style: { maxHeight: '30vh' },
}

const DARBO_CENTRAI = [
  // Diagnostika
  { label: 'Kelio diagnostika', group: 'Diagnostika' },
  { label: 'Diagnostikos duomenų vertinimas', group: 'Diagnostika' },
  { label: 'Kontrolės laboratorija', group: 'Diagnostika' },
  { label: 'Bandymų ir kalibravimo laboratorija', group: 'Diagnostika' },
  // Vilniaus regionas
  { label: 'Vilniaus diagnostikos padalinys', group: 'Vilniaus regionas' },
  { label: 'Įrangos patikra Vilnius', group: 'Vilniaus regionas' },
  { label: 'Vievio darbo centras', group: 'Vilniaus regionas' },
  { label: 'Rūdiškių darbo centras', group: 'Vilniaus regionas' },
  { label: 'Lentvario atraminė darbo centras', group: 'Vilniaus regionas' },
  { label: 'Panerių atraminė darbo centras', group: 'Vilniaus regionas' },
  { label: 'Vaidotų darbo centras', group: 'Vilniaus regionas' },
  { label: 'Valčiūnų darbo centras', group: 'Vilniaus regionas' },
  { label: 'Vilniaus darbo centras', group: 'Vilniaus regionas' },
  { label: 'Kenos darbo centras', group: 'Vilniaus regionas' },
  { label: 'Ignalinos darbo centras', group: 'Vilniaus regionas' },
  { label: 'Naujosios Vilnios atraminė darbo centras', group: 'Vilniaus regionas' },
  { label: 'Pabradės atraminė darbo centras', group: 'Vilniaus regionas' },
  { label: 'Švenčionėlių atraminė darbo centras', group: 'Vilniaus regionas' },
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
  { label: 'Baisogalos darbo centras', group: 'Kauno regionas' },
  { label: 'Jonavos atraminė darbo centras', group: 'Kauno regionas' },
  { label: 'Gaižiūnų darbo centras', group: 'Kauno regionas' },
  { label: 'Kaišiadorių atraminė darbo centras', group: 'Kauno regionas' },
  { label: 'Palemono atraminė darbo centras', group: 'Kauno regionas' },
  { label: 'Kauno darbo centras', group: 'Kauno regionas' },
  { label: 'Marijampolės darbo centras', group: 'Kauno regionas' },
  { label: 'Vilkaviškio darbo centras', group: 'Kauno regionas' },
  { label: 'Kybartų darbo centras', group: 'Kauno regionas' },
  { label: 'Kėdainių atraminė darbo centras', group: 'Kauno regionas' },
  { label: 'Kazlų Rūdos atraminė darbo centras', group: 'Kauno regionas' },
  { label: 'Šeštokų atraminė darbo centras', group: 'Kauno regionas' },
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
  { label: 'Bugenių darbo centras', group: 'Šiaulių regionas' },
  { label: 'Akmenės atraminė darbo centras', group: 'Šiaulių regionas' },
  { label: 'Kužių darbo centras', group: 'Šiaulių regionas' },
  { label: 'Šiaulių atraminė darbo centras', group: 'Šiaulių regionas' },
  { label: 'Zoknių darbo centras', group: 'Šiaulių regionas' },
  { label: 'Radviliškio 2-oji darbo centras', group: 'Šiaulių regionas' },
  { label: 'Šeduvos darbo centras', group: 'Šiaulių regionas' },
  { label: 'Panevėžio atraminė darbo centras', group: 'Šiaulių regionas' },
  { label: 'Rokiškio atraminė darbo centras', group: 'Šiaulių regionas' },
  { label: 'Radviliškio 3-oji atraminė darbo centras', group: 'Šiaulių regionas' },
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
  { label: 'Klaipėdos darbo centras', group: 'Klaipėdos regionas' },
  { label: 'Kretingos atraminė darbo centras', group: 'Klaipėdos regionas' },
  { label: 'Plungės darbo centras', group: 'Klaipėdos regionas' },
  { label: 'Telšių darbo centras', group: 'Klaipėdos regionas' },
  { label: 'Pavenčių atraminė darbo centras', group: 'Klaipėdos regionas' },
  { label: 'Draugystės atraminė darbo centras', group: 'Klaipėdos regionas' },
  { label: 'Rimkų darbo centras', group: 'Klaipėdos regionas' },
  { label: 'Pagėgių darbo centras', group: 'Klaipėdos regionas' },
  { label: 'Tauragės atraminė darbo centras', group: 'Klaipėdos regionas' },
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
const LOKACIJOS_BY_DARBO_CENTRAS: Record<string, Lokacija[]> = {
  'Rokiškio darbo centras (ATRAMINĖ)': [
    { label: 'Gustonių gel. stotis', code: 'LG-L08-000GUS', group: 'Stotys' },
    { label: 'Kupiškio gel. stotis', code: 'LG-L08-000KPS', group: 'Stotys' },
    { label: 'Panevėžio gel. stotis', code: 'LG-L08-000PNE', group: 'Stotys' },
    { label: 'Rokiškio gel. stotis', code: 'LG-L08-000RKS', group: 'Stotys' },
    { label: 'Šeduvos gel. stotis', code: 'LG-L08-000SDV', group: 'Stotys' },
    { label: 'Skapiškio gel. stotis', code: 'LG-L08-000SKA', group: 'Stotys' },
    { label: 'Subačiaus gel. stotis', code: 'LG-L08-000SUB', group: 'Stotys' },
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
  startDate: string
  objektai: TechObject[]
  rrule: string | null
  rrule2: string | null
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

function spreadCoords(center: [number, number], count: number): [number, number][] {
  const [lat, lon] = center
  const spread = 0.03
  const cols = Math.ceil(Math.sqrt(count * 1.4))
  return Array.from({ length: count }, (_, i) => {
    const row = Math.floor(i / cols)
    const col = i % cols
    const jLat = ((i * 7919) % 97) / 97 * 0.003 - 0.0015
    const jLon = ((i * 6271) % 89) / 89 * 0.003 - 0.0015
    return [
      lat + (row - Math.floor(cols / 2)) * (spread / cols) * 2 + jLat,
      lon + (col - Math.floor(cols / 2)) * (spread / cols) * 2 + jLon,
    ] as [number, number]
  })
}

const DARBO_CENTRAS_COORDS: Record<string, [number, number]> = {
  'Šiaulių darbo centras':           [55.9333, 23.3167],
  'Kužių darbo centras':             [55.8489, 23.1667],
  'Zoknių darbo centras':            [55.9947, 23.3556],
  'Akmenės darbo centras':           [56.2500, 22.7500],
  'Bugenių darbo centras':           [55.9175, 23.0342],
  'Radviliškio 3-oji darbo centras': [55.8167, 23.5500],
  'Radviliškio 2-oji darbo centras': [55.8167, 23.5500],
  'Panevėžio darbo centras':         [55.7333, 24.3667],
  'Šeduvos darbo centras':           [55.7525, 23.7603],
  'Rokiškio darbo centras':          [55.9667, 25.5833],
}

export function PlanuotojasPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { planId } = useParams<{ planId: string }>()
  const open = location.pathname === '/planuotojas/naujas'
  const { v2Plans, deleteV2Plan } = useV2Plans()
  const [selectedV2, setSelectedV2] = useState<typeof v2Plans[0] | null>(null)
  const [menuAnchor, setMenuAnchor] = useState<{ el: HTMLElement; id: string } | null>(null)
  const [expandedPreviewStations, setExpandedPreviewStations] = useState<Set<string>>(new Set())
  const [v2Tab, setV2Tab] = useState(0)
  const [planiniai, setPlaniniai] = useState<PlaninisDarbas[]>([])
  const selected = planId ? (planiniai.find(p => String(p.id) === planId) ?? null) : null
  const [prieziura, setPrieziura] = useState<{ label: string; group: string } | null>(null)
  const [lokacija, setLokacija] = useState<Lokacija | null>(null)
  const [grupe, setGrupe] = useState<TechObject | null>(null)
  const [elementas, setElementas] = useState<TechObject[]>([])
  const [showObjektai, setShowObjektai] = useState(false)
  const [darbas, setDarbas] = useState<string | null>(null)
  const [rrule, setRrule] = useState<string | null>(null)
  const [rrule2, setRrule2] = useState<string | null>(null)
  const [editingPlanId, setEditingPlanId] = useState<number | null>(null)
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())
  const [mapCenter, setMapCenter] = useState<[number, number] | undefined>(undefined)
  const [mapZoom, setMapZoom] = useState(16)
  const [hoveredCode, setHoveredCode] = useState<string | null>(null)
  const [meistriaMapItems, setMeistriaMapItems] = useState<TechObject[]>([])
  const [meistriaCoords, setMeistriaCoords] = useState<Record<string, [number, number]>>({})
  const toggleGroup = (g: string) => {
    setExpandedGroups(prev => { const s = new Set(prev); s.has(g) ? s.delete(g) : s.add(g); return s })
    const cityCenter = DARBO_CENTRAS_COORDS[g]
    if (cityCenter) {
      setMapCenter(cityCenter)
      setMapZoom(13)
      const group = IESMAI_SUTEPIMAS_GROUPED.find(gr => gr.group === g)
      if (group) {
        const positions = spreadCoords(cityCenter, group.items.length)
        const coords: Record<string, [number, number]> = {}
        group.items.forEach((item, i) => { coords[item.code] = positions[i] })
        setMeistriaMapItems(group.items)
        setMeistriaCoords(coords)
      }
    }
  }
  const [lanksti1, setLanksti1] = useState(false)
  const [lanksti2, setLanksti2] = useState(false)
  const [lankstiDays1, setLankstiDays1] = useState<number | ''>('')
  const [lankstiDays2, setLankstiDays2] = useState<number | ''>('')
  const [startDate, setStartDate] = useState<string>('')
  const [komanda, setKomanda] = useState<string[]>([])
  const [vyresnysis, setVyresnysis] = useState<string | null>(null)
  const [medziagos, setMedziagos] = useState<string[]>([])

  const allLokacijos = Object.values(LOKACIJOS_BY_DARBO_CENTRAS).flat()
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
    setRrule2(null)
    setLanksti1(false)
    setLanksti2(false)
    setLankstiDays1('')
    setLankstiDays2('')
    setStartDate('')
    setKomanda([])
    setVyresnysis(null)
    setMedziagos([])
  }

  const handleClose = () => { navigate('/planuotojas'); resetForm(); setEditingPlanId(null) }

  const handleEdit = (p: PlaninisDarbas) => {
    setDarbas(p.darbas)
    setStartDate(p.startDate)
    setElementas(p.objektai)
    setRrule(p.rrule)
    setRrule2(p.rrule2)
    setEditingPlanId(p.id)
    navigate('/planuotojas/naujas')
  }

  const handleSave = () => {
    if (editingPlanId !== null) {
      setPlaniniai(prev => prev.map(p => p.id === editingPlanId ? { ...p, darbas, startDate, objektai: elementas, rrule, rrule2 } : p))
    } else {
      setPlaniniai(prev => [...prev, { id: Date.now(), darbas, startDate, objektai: elementas, rrule, rrule2 }])
    }
    navigate('/planuotojas')
    resetForm()
    setEditingPlanId(null)
  }

  return (
    <WebAppShell>
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight={700}>Objektų aptarnavimo planai</Typography>
          <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => navigate('/planuotojas/naujas-v2')}>
            Sukurti planą
          </Button>
        </Stack>

        {v2Plans.length > 0 && (
          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, mb: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 700 }}>Tech. objektų grupė</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Statusas</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Regionas</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Užduotys</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Objektai</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Planas galioja nuo</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {v2Plans.map(p => (
                  <TableRow key={p.id} hover sx={{ cursor: 'pointer' }} onClick={() => setSelectedV2(p)}>
                    <TableCell><Typography variant="body2">{p.grupe || '—'}</Typography></TableCell>
                    <TableCell><Chip label="Aktyvus" size="small" color="success" variant="outlined" /></TableCell>
                    <TableCell><Typography variant="body2">{p.regionas || '—'}</Typography></TableCell>
                    <TableCell><Typography variant="body2">{p.uzduotys.length}</Typography></TableCell>
                    <TableCell><Typography variant="body2">{p.objects.length}</Typography></TableCell>
                    <TableCell><Typography variant="body2">{p.galiojaNuo || '—'}</Typography></TableCell>
                    <TableCell align="right" onClick={e => e.stopPropagation()}>
                      <IconButton size="small" onClick={e => setMenuAnchor({ el: e.currentTarget, id: p.id })}>
                        <MoreVertIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

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
                  <TableCell sx={{ fontWeight: 700 }}>Pradžia</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Objektai</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Dažnumas</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {planiniai.map(p => (
                  <TableRow key={p.id} hover>
                    <TableCell>{p.darbas ?? '—'}</TableCell>
                    <TableCell>{p.startDate || '—'}</TableCell>
                    <TableCell>{p.objektai.length > 0 ? `${p.objektai.length} obj.` : '—'}</TableCell>
                    <TableCell>{formatRrule(p.rrule)}</TableCell>
                    <TableCell align="right">
                      <Button size="small" onClick={() => handleEdit(p)}>Peržiūrėti</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

      </Box>

      <Menu open={!!menuAnchor} anchorEl={menuAnchor?.el} onClose={() => setMenuAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={() => setMenuAnchor(null)}>
          <ListItemIcon><EditOutlinedIcon fontSize="small" /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ variant: 'body2' }}>Redaguoti</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => setMenuAnchor(null)}>
          <ListItemIcon><PauseCircleOutlineIcon fontSize="small" /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ variant: 'body2' }}>Stabdyti</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { if (menuAnchor) deleteV2Plan(menuAnchor.id); setMenuAnchor(null) }} sx={{ color: 'error.main' }}>
          <ListItemIcon><DeleteOutlineIcon fontSize="small" color="error" /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ variant: 'body2' }}>Ištrinti</ListItemText>
        </MenuItem>
      </Menu>

      {open && (
      <Box sx={{ position: 'fixed', inset: 0, zIndex: 1300, bgcolor: 'grey.100', display: 'flex', overflow: 'hidden' }}>
        <Stack direction="row" sx={{ flex: 1, overflow: 'hidden' }}>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', bgcolor: 'background.paper', borderRight: 1, borderColor: 'divider' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}>
            <Typography variant="subtitle1" fontWeight={700}>{editingPlanId !== null ? 'Redaguoti planinį darbą' : 'Naujas planinis darbas'}</Typography>
            <IconButton size="small" onClick={handleClose}><CloseIcon fontSize="small" /></IconButton>
          </Stack>
          <Box sx={{ flex: 1, overflowY: 'auto', px: 3, py: 2.5 }}>
            <Stack spacing={2.5}>

              <Typography variant="caption" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary' }}>
                Darbo informacija
              </Typography>

              <Autocomplete
                options={[
                  'Periodinė iešmų patikra',
                  'MPC spintų patikra',
                  'Periodinė Šviesaforų patikra',
                  'GS RES priežiūra',
                  'SĮ kabelių patikra',
                  'NMŠ patikra',
                  'STAB vald įrang patikra',
                ]}
                value={darbas}
                onChange={(_, v) => {
                  setDarbas(v)
                  setElementas(v === 'Periodinė iešmų patikra' ? IESMAI_SUTEPIMAS : [])
                }}
                slotProps={{ popper: POPPER_PROPS }} ListboxProps={LISTBOX_PROPS}
                renderInput={params => <TextField {...params} label="Pasirinkite darbą" size="small" />}
              />

              <TextField
                label="Darbo pradžia"
                type="date"
                size="small"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                slotProps={{ inputLabel: { shrink: true }, htmlInput: { onClick: (e: React.MouseEvent<HTMLInputElement>) => (e.currentTarget as HTMLInputElement & { showPicker?: () => void }).showPicker?.() } }}
                sx={{
                  '& input::-webkit-datetime-edit-fields-wrapper': { color: startDate ? 'text.primary' : 'text.secondary' },
                  '& input::-webkit-datetime-edit-text': { color: startDate ? 'text.primary' : 'text.secondary' },
                }}
              />

              <Divider />

              <Typography variant="caption" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary' }}>
                {darbas === 'Periodinė iešmų patikra' ? 'Objekto aptarnavimo dažnumas pagrindiniuose keliuose' : 'Darbų atlikimo dažnumas'}
              </Typography>

              <RecurrencePicker key={`rrule-${editingPlanId}`} initialValue={rrule} onChange={setRrule} />
              <FormControlLabel
                control={<Checkbox size="small" checked={lanksti1} onChange={e => { setLanksti1(e.target.checked); if (!e.target.checked) setLankstiDays1('') }} />}
                label={<Typography variant="body2">Lanksti darbų atlikimo data</Typography>}
                sx={{ ml: 0, mt: -1 }}
              />
              {lanksti1 && (
                <FormControl size="small" fullWidth>
                  <InputLabel>Nukrypimo riba</InputLabel>
                  <Select value={lankstiDays1} onChange={e => setLankstiDays1(Number(e.target.value))} label="Nukrypimo riba" MenuProps={{ disablePortal: true, anchorOrigin: { vertical: 'bottom', horizontal: 'left' }, transformOrigin: { vertical: 'top', horizontal: 'left' }, PaperProps: { sx: { maxHeight: 220 } } }}>
                    {[['±1 diena',1],['±2 dienos',2],['±3 dienos',3],['±4 dienos',4],['±5 dienų',5],['±6 dienų',6],['±7 dienų',7]].map(([label, val]) => (
                      <MenuItem key={val} value={val}>{label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {darbas === 'Periodinė iešmų patikra' && (
                <>
                  <Divider />
                  <Typography variant="caption" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary' }}>
                    Objekto aptarnavimo dažnumas atvykimo keliuose
                  </Typography>
                  <RecurrencePicker key={`rrule2-${editingPlanId}`} initialValue={rrule2} onChange={setRrule2} />
                  <FormControlLabel
                    control={<Checkbox size="small" checked={lanksti2} onChange={e => { setLanksti2(e.target.checked); if (!e.target.checked) setLankstiDays2('') }} />}
                    label={<Typography variant="body2">Lanksti darbų atlikimo data</Typography>}
                    sx={{ ml: 0, mt: -1 }}
                  />
                  {lanksti2 && (
                    <FormControl size="small" fullWidth>
                      <InputLabel>Nukrypimo riba</InputLabel>
                      <Select value={lankstiDays2} onChange={e => setLankstiDays2(Number(e.target.value))} label="Nukrypimo riba" MenuProps={{ disablePortal: true, anchorOrigin: { vertical: 'bottom', horizontal: 'left' }, transformOrigin: { vertical: 'top', horizontal: 'left' }, PaperProps: { sx: { maxHeight: 220 } } }}>
                        {[['±1 diena',1],['±2 dienos',2],['±3 dienos',3],['±4 dienos',4],['±5 dienų',5],['±6 dienų',6],['±7 dienų',7]].map(([label, val]) => (
                          <MenuItem key={val} value={val}>{label}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                </>
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

        <Box sx={{ flex: 1, borderLeft: 1, borderRight: 1, borderColor: 'divider', display: 'flex', flexDirection: 'column', overflow: 'hidden', bgcolor: 'grey.50' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}>
            <Box>
              <Typography variant="caption" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary' }}>
                Aptarnaujami objektai
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                Šiaulių regiono kelių priežiūra
              </Typography>
            </Box>
            {elementas.length > 0 && (
              <Typography variant="caption" color="text.secondary">({elementas.length})</Typography>
            )}
          </Stack>
          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            {elementas.length === 0 ? (
              <Stack alignItems="center" justifyContent="center" sx={{ height: '100%', px: 2 }}>
                <Typography variant="caption" color="text.disabled" textAlign="center">Nepasirinkta objektų</Typography>
              </Stack>
            ) : (
              IESMAI_SUTEPIMAS_GROUPED.map(({ group, items }) => {
                if (items.length === 0) return null
                const checkedCount = items.filter(o => elementas.some(e => e.code === o.code)).length
                const isOpen = expandedGroups.has(group)
                return (
                  <Box key={group}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      onClick={() => toggleGroup(group)}
                      sx={{ px: 2, py: 1.5, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider', cursor: 'pointer', '&:hover': { bgcolor: 'grey.100' } }}
                    >
                      <Stack direction="row" alignItems="center" spacing={0.75}>
                        <Typography variant="caption" fontWeight={700} color="text.secondary">{group}</Typography>
                        <Typography variant="caption" color="text.secondary">({checkedCount}/{items.length})</Typography>
                      </Stack>
                      <ExpandMoreIcon sx={{ fontSize: 16, color: 'text.disabled', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                    </Stack>
                    <Collapse in={isOpen}>
                      {items.map((o, idx) => {
                        const checked = elementas.some(e => e.code === o.code)
                        const isPagrindinis = idx % 2 === 0
                        return (
                          <Stack
                            key={o.code}
                            direction="row"
                            alignItems="center"
                            spacing={1}
                            sx={{ px: 2, py: 0.75, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                            onClick={() => setElementas(prev => checked ? prev.filter(e => e.code !== o.code) : [...prev, o])}
                            onMouseEnter={() => setHoveredCode(o.code)}
                            onMouseLeave={() => setHoveredCode(null)}
                          >
                            <Checkbox size="small" checked={checked} disableRipple sx={{ p: 0, flexShrink: 0 }} />
                            <Stack direction="row" alignItems="center" spacing={0.75}>
                              <Typography variant="body2" sx={{ lineHeight: 1.3 }}>{o.name}</Typography>
                              <Chip
                                label={isPagrindinis ? 'Pagrindinis kelias' : 'Atvykimo kelias'}
                                size="small"
                                color={isPagrindinis ? 'primary' : 'default'}
                                sx={{ height: 16, fontSize: '0.6rem', '& .MuiChip-label': { px: 0.75 } }}
                              />
                            </Stack>
                          </Stack>
                        )
                      })}
                    </Collapse>
                  </Box>
                )
              })
            )}
          </Box>
        </Box>

        {showObjektai && grupe && grupeItems.length > 0 && (
          <Box sx={{ width: 260, flexShrink: 0, bgcolor: 'background.paper', borderLeft: 1, borderColor: 'divider', display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 1 }}>
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
          <StationMap
            items={meistriaMapItems.length > 0 ? meistriaMapItems : grupeItems}
            selected={elementas}
            center={mapCenter ?? (lokacija ? LOKACIJA_COORDS[lokacija.code] : undefined)}
            zoom={mapZoom}
            coordsOverride={meistriaCoords}
            highlightedCode={hoveredCode}
          />
        </Box>

        </Stack>
      </Box>
      )}

      {selected && (
      <Box sx={{ position: 'fixed', inset: 0, zIndex: 1300, bgcolor: 'grey.100', display: 'flex', flexDirection: 'column', alignItems: 'center', px: 4, pt: 3, pb: '48px' }}>
        <Box sx={{ width: '100%', maxWidth: 560, mb: 1.5 }}>
          <Breadcrumbs sx={{ '& .MuiBreadcrumbs-separator': { mx: 0.5 } }}>
            <Typography variant="caption" color="primary.main" sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }} onClick={() => navigate('/planuotojas')}>
              Planiniai darbai
            </Typography>
            <Typography variant="caption" color="text.primary" fontWeight={600}>{selected.darbas ?? 'Planinis darbas'}</Typography>
          </Breadcrumbs>
        </Box>
        <Box sx={{ width: '100%', maxWidth: 560, bgcolor: 'background.paper', borderRadius: '8px', boxShadow: 4, display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}>
            <Typography variant="subtitle1" fontWeight={700}>{selected.darbas ?? '—'}</Typography>
            <IconButton size="small" onClick={() => navigate('/planuotojas')}><CloseIcon fontSize="small" /></IconButton>
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
              <Stack spacing={0.5}>
                <Typography variant="caption" color="text.secondary">Pradžia</Typography>
                <Typography variant="body2">{selected.startDate || '—'}</Typography>
              </Stack>

              <Divider />

              <Typography variant="caption" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary' }}>
                Dažnumas
              </Typography>
              <Stack spacing={0.5}>
                <Typography variant="caption" color="text.secondary">Pagrindiniuose keliuose</Typography>
                <Typography variant="body2">{formatRrule(selected.rrule)}</Typography>
              </Stack>
              {selected.rrule2 && (
                <Stack spacing={0.5}>
                  <Typography variant="caption" color="text.secondary">Atvykimo keliuose</Typography>
                  <Typography variant="body2">{formatRrule(selected.rrule2)}</Typography>
                </Stack>
              )}

              <Divider />

              <Typography variant="caption" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary' }}>
                Aptarnaujami objektai
              </Typography>
              <Stack spacing={0.5}>
                <Typography variant="body2">{selected.objektai.length > 0 ? `${selected.objektai.length} objektai` : '—'}</Typography>
              </Stack>

            </Stack>
          </Box>
          <Box sx={{ px: 3, py: 2, borderTop: 1, borderColor: 'divider', flexShrink: 0 }}>
            <Button onClick={() => navigate('/planuotojas')}>Uždaryti</Button>
          </Box>
        </Box>
      </Box>
      )}

      {selectedV2 && (
        <Box sx={{ position: 'fixed', inset: 0, zIndex: 1300, bgcolor: 'grey.100', display: 'flex', flexDirection: 'column', alignItems: 'center', px: 4, pt: 3, pb: '48px' }}>
          <Box sx={{ width: '100%', maxWidth: 560, mb: 1.5 }}>
            <Breadcrumbs sx={{ '& .MuiBreadcrumbs-separator': { mx: 0.5 } }}>
              <Typography variant="caption" color="primary.main" sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }} onClick={() => { setSelectedV2(null); setV2Tab(0) }}>
                Planiniai darbai
              </Typography>
              <Typography variant="caption" color="text.primary" fontWeight={600}>Iešmų priežiūros planas</Typography>
            </Breadcrumbs>
          </Box>
          <Box sx={{ width: '100%', maxWidth: 560, bgcolor: 'background.paper', borderRadius: '8px', boxShadow: 4, display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 3, py: 2, borderBottom: 0, flexShrink: 0 }}>
              <Typography variant="subtitle1" fontWeight={700}>Iešmų priežiūros planas</Typography>
              <IconButton size="small" onClick={() => { setSelectedV2(null); setV2Tab(0); setExpandedPreviewStations(new Set()) }}><CloseIcon fontSize="small" /></IconButton>
            </Stack>
            <Tabs value={v2Tab} onChange={(_, v) => setV2Tab(v)} sx={{ px: 3, borderBottom: 1, borderColor: 'divider', flexShrink: 0, minHeight: 40, '& .MuiTab-root': { minHeight: 40, fontSize: '0.75rem' } }}>
              <Tab label="Plano informacija" />
              <Tab label="Aptarnaujami objektai" />
              <Tab label="Užduotys" />
            </Tabs>
            <Box sx={{ flex: 1, overflowY: 'auto', px: 3, py: 2.5 }}>
              {v2Tab === 0 && (
                <Stack spacing={2}>
                  {selectedV2.regionas && (
                    <Stack spacing={0.5}>
                      <Typography variant="caption" color="text.secondary">Regionas</Typography>
                      <Typography variant="body2">{selectedV2.regionas} regionas</Typography>
                    </Stack>
                  )}
                  <Stack spacing={0.5}>
                    <Typography variant="caption" color="text.secondary">Tech. objektų grupė</Typography>
                    <Typography variant="body2">{selectedV2.grupe || '—'}</Typography>
                  </Stack>
                  {selectedV2.galiojaNuo && (
                    <Stack spacing={0.5}>
                      <Typography variant="caption" color="text.secondary">Planas galioja nuo</Typography>
                      <Typography variant="body2">{selectedV2.galiojaNuo}</Typography>
                    </Stack>
                  )}
                  {Object.keys(selectedV2.atributai ?? {}).length > 0 && (
                    <>
                      <Divider />
                      {Object.entries(selectedV2.atributai).map(([key, val]) => (
                        <Stack key={key} spacing={0.5}>
                          <Typography variant="caption" color="text.secondary">{key}</Typography>
                          <Typography variant="body2">{val}</Typography>
                        </Stack>
                      ))}
                    </>
                  )}
                </Stack>
              )}
              {v2Tab === 1 && (
                <Stack spacing={1.5}>
                  {(selectedV2.darboCentrai ?? []).map(dc => (
                    <Box key={dc.name}>
                      <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>{dc.name}</Typography>
                      <Stack spacing={0.5} sx={{ mt: 0.75 }}>
                        {dc.stations.map(st => {
                          const stOpen = expandedPreviewStations.has(st.name)
                          return (
                            <Box key={st.name} sx={{ border: 1, borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
                              <Stack direction="row" alignItems="center" justifyContent="space-between"
                                onClick={() => setExpandedPreviewStations(prev => { const s = new Set(prev); s.has(st.name) ? s.delete(st.name) : s.add(st.name); return s })}
                                sx={{ px: 1.5, py: 1, bgcolor: 'grey.50', cursor: 'pointer', '&:hover': { bgcolor: 'grey.100' } }}
                              >
                                <Stack direction="row" alignItems="center" spacing={0.75}>
                                  <ExpandMoreIcon sx={{ fontSize: 16, color: 'text.disabled', transform: stOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                                  <Typography variant="body2" fontWeight={500}>{st.name}</Typography>
                                  <Typography variant="caption" color="text.secondary">({st.objects.length})</Typography>
                                </Stack>
                                {st.paleidimoData
                                  ? <Typography variant="caption" color="text.secondary">Nuo: {st.paleidimoData}</Typography>
                                  : <Typography variant="caption" color="text.disabled">Data nenustatyta</Typography>
                                }
                              </Stack>
                              <Collapse in={stOpen}>
                                {st.objects.map(obj => (
                                  <Box key={obj} sx={{ px: 1.5, py: 0.5, borderTop: 1, borderColor: 'divider' }}>
                                    <Typography variant="caption" color="text.secondary">{obj}</Typography>
                                  </Box>
                                ))}
                              </Collapse>
                            </Box>
                          )
                        })}
                      </Stack>
                    </Box>
                  ))}
                  {!(selectedV2.darboCentrai ?? []).length && (
                    <Typography variant="caption" color="text.disabled">Nėra objektų</Typography>
                  )}
                </Stack>
              )}
              {v2Tab === 2 && (
                <Stack spacing={0.75}>
                  {selectedV2.uzduotys.length === 0 && (
                    <Typography variant="caption" color="text.disabled">Nėra užduočių</Typography>
                  )}
                  {selectedV2.uzduotys.map(u => {
                    const m = u.match(/^(.*?)\s*\[([^\]]+)\]$/)
                    const dc = UZDUOTYS_DC[u]
                    return (
                      <Box key={u} sx={{ border: 1, borderColor: 'divider', borderRadius: 1, px: 1.5, py: 0.75 }}>
                        <Typography variant="caption">{m ? m[1].trim() : u}</Typography>
                        {m && <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Periodiškumas: {m[2]}</Typography>}
                        {dc && <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>DC: {dc}</Typography>}
                      </Box>
                    )
                  })}
                </Stack>
              )}
            </Box>
            <Box sx={{ px: 3, py: 2, borderTop: 1, borderColor: 'divider', flexShrink: 0, display: 'flex', gap: 1 }}>
              <Button onClick={() => { setSelectedV2(null); setV2Tab(0) }}>Uždaryti</Button>
              <Button variant="contained" disableElevation onClick={() => { navigate(`/planuotojas/redaguoti-v2/${selectedV2.id}`); setSelectedV2(null); setV2Tab(0) }}>Redaguoti</Button>
            </Box>
          </Box>
        </Box>
      )}
    </WebAppShell>
  )
}
