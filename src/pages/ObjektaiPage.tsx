import { useState, Fragment } from 'react'
import { Box, Tabs, Tab, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, TextField, Autocomplete, Chip, Button, Drawer, Stack, MenuItem, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Stepper, Step, StepLabel, StepContent, Menu, ListItemText } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import { useNavigate, useParams } from 'react-router-dom'
import { WebAppShell } from '../layout/WebAppShell'
import { UzduotysTabContent } from './UzduotysPage'
import { DARBO_CENTRAI, type DarboCentras } from '../data/darboCentrai'
import { TECH_OBJEKTAI, type TechObjektas } from '../data/techObjektai'

function formatPavadinimas(name: string): string {
  const m = name.match(/^(.+?)\s+((?:\d+-\w+\s+)?(?:atraminė\s+)?)meistrija$/)
  if (!m) return name
  const location = m[1]
  const qualifier = m[2].trim()
  if (!qualifier) return `${location} darbo centras`
  return `${location} darbo centras (${qualifier.charAt(0).toUpperCase()}${qualifier.slice(1)})`
}

const TABS: { label: string; slug: string }[] = [
  { label: 'Užduotys',      slug: 'darbai' },
  { label: 'Tech objektai', slug: 'tech-objektai' },
  { label: 'Darbo centrai', slug: 'darbo-centrai' },
]

type SortKey = keyof DarboCentras
type SortDir = 'asc' | 'desc'

const REGIONAS_OPTIONS = [...new Set(DARBO_CENTRAI.map(d => d.regionas).filter(Boolean))] as string[]
const DARBO_CENTRAS_OPTIONS = [...new Set(DARBO_CENTRAI.map(d => d.darboCentras).filter(Boolean))] as string[]
const SKYRIUS_OPTIONS = ['DP01','DP02','DP03','DP04','DP05','DP06','DP07','DP08','DP09','DP10']
const IMONE_OPTIONS = ['LTG', 'IGC']
const DARBUOTOJAI_OPTIONS = [
  'Tomas Petravičius','Linas Kazlauskas','Rima Stankevičienė','Jonas Butkus',
  'Eglė Mockevičiūtė','Andrius Jankauskas','Dalia Petrauskienė','Mindaugas Grigas',
  'Kristina Žukienė','Paulius Vaitkus','Ingrida Malinauskaite','Artūras Šimkus',
]

type TechSortKey = keyof TechObjektas
type DetailField = { label: string; key: keyof TechObjektas }
type DetailSection = { title: string; fields: DetailField[]; defaultExpanded?: boolean }

const DETAIL_SECTIONS: DetailSection[] = [
  {
    title: 'Identifikacija',
    defaultExpanded: true,
    fields: [
      { label: 'Equipment', key: 'equipment' },
      { label: 'Object Type', key: 'objectType' },
      { label: 'Object Description', key: 'objectDescription' },
      { label: 'Functional Location', key: 'functionalLocation' },
      { label: 'FunctLocDescrip.', key: 'functLocDescrip' },
      { label: 'Inventory Number', key: 'inventoryNumber' },
      { label: 'Object number', key: 'objectNumber' },
      { label: 'Internal object no.', key: 'internalObjectNo' },
      { label: 'System status', key: 'systemStatus' },
      { label: 'User Status', key: 'userStatus' },
    ],
  },
  {
    title: 'Techniniai duomenys',
    defaultExpanded: true,
    fields: [
      { label: 'Model number', key: 'modelNumber' },
      { label: 'Equipment category', key: 'equipmentCategory' },
      { label: 'Technical IdentNo.', key: 'technicalIdentNo' },
      { label: 'Construction month', key: 'constructionMonth' },
      { label: 'Construction year', key: 'constructionYear' },
      { label: 'Start-up date', key: 'startupDate' },
      { label: 'Manufacturer', key: 'manufacturer' },
      { label: 'Mfr Ctry/Reg', key: 'mfrCtryReg' },
      { label: 'ManufDrawingNumber', key: 'manufDrawingNumber' },
      { label: 'Serial Number', key: 'serialNumber' },
      { label: 'Manuf. Serial Number', key: 'manufSerialNumber' },
      { label: 'Construction Type', key: 'constructionType' },
      { label: 'Construc. type desc.', key: 'construcTypeDesc' },
      { label: 'Size/dimension', key: 'sizeDimension' },
      { label: 'Gross Weight', key: 'grossWeight' },
      { label: 'Unit of Weight', key: 'unitOfWeight' },
      { label: 'Position', key: 'position' },
      { label: 'Superord. Equipment', key: 'supordEquipment' },
      { label: 'EquipmentData exists', key: 'equipmentDataExists' },
    ],
  },
  {
    title: 'Planavimas ir priežiūra',
    fields: [
      { label: 'Selected Line', key: 'selectedLine' },
      { label: 'Planning Plant', key: 'planningPlant' },
      { label: 'Maintenance Plant', key: 'maintenancePlant' },
      { label: 'Planning Group', key: 'planningGroup' },
      { label: 'Maint. Planner Group', key: 'maintPlannerGroup' },
      { label: 'Main Work Center', key: 'mainWorkCenter' },
      { label: 'Work Center', key: 'workCenter' },
      { label: 'Plant Section', key: 'plantSection' },
      { label: 'ABC Indicator', key: 'abcIndicator' },
      { label: 'Planning indicator', key: 'planningIndicator' },
      { label: 'Catalog Profile', key: 'catalogProfile' },
      { label: 'Doc. cat. allowed', key: 'docCatAllowed' },
    ],
  },
  {
    title: 'Finansai ir apskaita',
    fields: [
      { label: 'Cost Center', key: 'costCenter' },
      { label: 'Company Code', key: 'companyCode' },
      { label: 'Business Area', key: 'businessArea' },
      { label: 'Controlling Area', key: 'controllingArea' },
      { label: 'Profitab. Segmt No.', key: 'profitSegmtNo' },
      { label: 'Asset', key: 'asset' },
      { label: 'Sub-number', key: 'subNumber' },
      { label: 'Acquisition date', key: 'acquisitionDate' },
      { label: 'Acquisition Value', key: 'acquisitionValue' },
      { label: 'WBS element', key: 'wbsElement' },
      { label: 'WBS Serial Data', key: 'wbsSerialData' },
      { label: 'Settlement Using PBE Document', key: 'settlementPBE' },
      { label: 'Settlement Using Shipping Doc.', key: 'settlementShipping' },
      { label: 'Material Price Grp', key: 'materialPriceGrp' },
      { label: 'Provision fee ind.', key: 'provisionFeeInd' },
      { label: 'Leasing type', key: 'leasingType' },
      { label: 'PM order - owner', key: 'pmOrderOwner' },
      { label: 'PM order - admin.', key: 'pmOrderAdmin' },
      { label: 'Unit/meas. settl.', key: 'unitMeasSettl' },
    ],
  },
  {
    title: 'Medžiagos ir sandėlis',
    fields: [
      { label: 'Material', key: 'material' },
      { label: 'Material Description', key: 'materialDescription' },
      { label: 'ManufactPartNo.', key: 'manufactPartNo' },
      { label: 'Storage Location', key: 'storageLocation' },
      { label: 'Stock batch', key: 'stockBatch' },
      { label: 'Batch', key: 'batch' },
      { label: 'Stock Type (Primary Posting)', key: 'stockTypePrimary' },
      { label: 'Special Stock', key: 'specialStock' },
      { label: 'Configurable material', key: 'configurableMaterial' },
      { label: 'Referenced config.', key: 'referencedConfig' },
    ],
  },
  {
    title: 'Garantija',
    fields: [
      { label: 'Descr.CustomWarranty', key: 'descrCustomWarranty' },
      { label: 'Descr.VendorWarranty', key: 'descrVendorWarranty' },
      { label: 'Cus. master warranty', key: 'cusMasterWarranty' },
      { label: 'Ven. master warranty', key: 'venMasterWarranty' },
      { label: 'Cust. Warranty Start', key: 'custWarrantyStart' },
      { label: 'Vendor Wrty Start', key: 'vendorWrtyStart' },
      { label: 'Cust. warranty end', key: 'custWarrantyEnd' },
      { label: 'Vendor warranty end', key: 'vendorWarrantyEnd' },
    ],
  },
  {
    title: 'Užsakymas ir tiekimas',
    fields: [
      { label: 'Order', key: 'order' },
      { label: 'Delivery date', key: 'deliveryDate' },
      { label: 'Procurement type', key: 'procurementType' },
      { label: 'Own/external equi.', key: 'ownExternalEqui' },
      { label: 'Owner', key: 'owner' },
      { label: 'Fictitious', key: 'fictitious' },
      { label: 'Rel. to load. costs', key: 'relToLoadCosts' },
      { label: 'Item/multipart ind.', key: 'itemMultipartInd' },
      { label: 'C/D equipment', key: 'cdEquipment' },
      { label: 'License plate number', key: 'licensePlateNumber' },
      { label: 'License number', key: 'licenseNumber' },
    ],
  },
  {
    title: 'Adresas ir vieta',
    fields: [
      { label: 'Location', key: 'location' },
      { label: 'Address number', key: 'addressNumber' },
      { label: 'Postal Code', key: 'postalCode' },
      { label: 'City', key: 'city' },
      { label: 'District', key: 'district' },
      { label: 'Street', key: 'street' },
      { label: 'Country/Region Key', key: 'countryRegionKey' },
      { label: 'Region', key: 'region' },
      { label: 'Room', key: 'room' },
      { label: 'Loc/Acct Assignment', key: 'locAcctAssignment' },
    ],
  },
  {
    title: 'Pardavimai',
    fields: [
      { label: 'Sales Order', key: 'salesOrder' },
      { label: 'Sales Order Item', key: 'salesOrderItem' },
      { label: 'Sales Organization', key: 'salesOrganization' },
      { label: 'Distribution Channel', key: 'distributionChannel' },
      { label: 'Division', key: 'division' },
      { label: 'Currency', key: 'currency' },
      { label: 'Plant', key: 'plant' },
    ],
  },
  {
    title: 'Linijinis turtas',
    fields: [
      { label: 'Start Point', key: 'startPoint' },
      { label: 'End Point', key: 'endPoint' },
      { label: 'Length', key: 'length' },
      { label: 'Unit of Measure', key: 'unitOfMeasure' },
      { label: 'Linear Reference Pattern', key: 'linearRefPattern' },
      { label: 'Start Marker', key: 'startMarker' },
      { label: 'Dist.Start Mkr', key: 'distStartMkr' },
      { label: 'End Marker', key: 'endMarker' },
      { label: 'Dist End Marker', key: 'distEndMarker' },
      { label: 'Marker Distance Unit', key: 'markerDistanceUnit' },
      { label: 'Type of First Offset', key: 'typeFirstOffset' },
      { label: 'Value of Offset 1', key: 'valueOffset1' },
      { label: 'UoM for Offset 1', key: 'uomOffset1' },
      { label: 'Type of Second Offset', key: 'typeSecondOffset' },
      { label: 'Value of Offset 2', key: 'valueOffset2' },
      { label: 'UoM for Offset 2', key: 'uomOffset2' },
    ],
  },
  {
    title: 'Administravimas',
    fields: [
      { label: 'Created On', key: 'createdOn' },
      { label: 'Created By', key: 'createdBy' },
      { label: 'Changed On', key: 'changedOn' },
      { label: 'Changed By', key: 'changedBy' },
      { label: 'Valid From', key: 'validFrom' },
      { label: 'Valid To', key: 'validTo' },
      { label: 'Standing Order', key: 'standingOrder' },
      { label: 'Sort Field', key: 'sortField' },
      { label: 'Administrator', key: 'administrator' },
      { label: 'AuthorizGroup', key: 'authorizGroup' },
      { label: 'List Name', key: 'listName' },
      { label: 'Language Key', key: 'languageKey' },
      { label: 'Telephone', key: 'telephone' },
      { label: 'Time', key: 'time' },
      { label: 'Long text exists', key: 'longTextExists' },
    ],
  },
  {
    title: 'Laiko segmentai',
    fields: [
      { label: 'UsgePerConsecNo.', key: 'usgePerConsecNo' },
      { label: 'NxtUsagePeriodNo.', key: 'nxtUsagePeriodNo' },
      { label: 'TimeSeg changed on', key: 'timeSegChangedOn' },
      { label: 'TimeSeg changed by', key: 'timeSegChangedBy' },
      { label: 'TimeSeg created on', key: 'timeSegCreatedOn' },
      { label: 'TimeSeg. created by', key: 'timeSegCreatedBy' },
    ],
  },
]

const TECH_INFO_TITLES = new Set(['Identifikacija', 'Techniniai duomenys', 'Planavimas ir priežiūra', 'Linijinis turtas', 'Adresas ir vieta'])

type AptField = { label: string }
type AptSection = { title: string; fields: AptField[] }

const APT_SECTIONS: AptSection[] = [
  {
    title: 'Matavimai',
    fields: [
      { label: 'Matavimo taškas' },
      { label: 'Paskutinė reikšmė' },
      { label: 'Matavimo data' },
      { label: 'Vienetas' },
      { label: 'Skaitiklio tipas' },
    ],
  },
  {
    title: 'Gedimai',
    fields: [
      { label: 'Gedimų skaičius' },
      { label: 'Paskutinis gedimas' },
      { label: 'Prastovos laikas (val.)' },
      { label: 'Gedimo priežastis' },
      { label: 'MTBF' },
    ],
  },
  {
    title: 'Kaštai',
    fields: [
      { label: 'Planiniai kaštai' },
      { label: 'Faktiniai kaštai' },
      { label: 'Darbo kaštai' },
      { label: 'Medžiagų kaštai' },
      { label: 'Išorinių paslaugų kaštai' },
    ],
  },
  {
    title: 'Aptarnavimo laikas',
    fields: [
      { label: 'Paskutinis TP' },
      { label: 'Kitas TP' },
      { label: 'TP intervalas' },
      { label: 'Atsakingas asmuo' },
      { label: 'Aptarnavimo grupė' },
    ],
  },
]

function TechObjektaiTabContent() {
  const [sortKey, setSortKey] = useState<TechSortKey>('objectDescription')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [search, setSearch] = useState('')
  const [viewObject, setViewObject] = useState<TechObjektas | null>(null)
  const [activeTab, setActiveTab] = useState(0)
  const [dialogSearch, setDialogSearch] = useState('')
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(() => new Set(DETAIL_SECTIONS.map(s => s.title)))
  const [expandedAptSteps, setExpandedAptSteps] = useState<Set<string>>(() => new Set(APT_SECTIONS.map(s => s.title)))
  const [attrMenuAnchor, setAttrMenuAnchor] = useState<HTMLElement | null>(null)

  function toggleStep(title: string) {
    setExpandedSteps(prev => {
      const next = new Set(prev)
      if (next.has(title)) next.delete(title); else next.add(title)
      return next
    })
  }

  function toggleAptStep(title: string) {
    setExpandedAptSteps(prev => {
      const next = new Set(prev)
      if (next.has(title)) next.delete(title); else next.add(title)
      return next
    })
  }

  function handleSort(key: TechSortKey) {
    if (key === sortKey) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const filtered = TECH_OBJEKTAI.filter(o =>
    !search || `${o.objectDescription} ${o.planningPlant} ${o.functionalLocation} ${o.functLocDescrip}`
      .toLowerCase().includes(search.toLowerCase())
  )

  const sorted = [...filtered].sort((a, b) => {
    const av = (a[sortKey] ?? '').toLowerCase()
    const bv = (b[sortKey] ?? '').toLowerCase()
    return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
  })

  function th(label: string, key: TechSortKey) {
    return (
      <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
        <TableSortLabel
          active={sortKey === key}
          direction={sortKey === key ? sortDir : 'asc'}
          onClick={() => handleSort(key)}
        >
          {label}
        </TableSortLabel>
      </TableCell>
    )
  }

  const dlgSearchLow = dialogSearch.toLowerCase()
  const modalSections = DETAIL_SECTIONS
    .map(s => ({
      ...s,
      fields: dlgSearchLow
        ? s.fields.filter(f =>
            f.label.toLowerCase().includes(dlgSearchLow) ||
            (viewObject?.[f.key] ?? '').toLowerCase().includes(dlgSearchLow)
          )
        : s.fields,
    }))
    .filter(s => !dlgSearchLow || s.fields.length > 0)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <Box sx={{ px: 2, pt: 1.5, pb: 1.5, borderBottom: 1, borderColor: 'divider' }}>
        <TextField
          size="small" fullWidth
          placeholder="Ieškoti..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.75, display: 'block' }}>
          Rodoma {filtered.length} iš {TECH_OBJEKTAI.length}
        </Typography>
      </Box>
      <TableContainer sx={{ flex: 1, overflowY: 'auto' }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              {th('Object Description', 'objectDescription')}
              {th('Functional Location', 'functionalLocation')}
              {th('FunctLocDescrip.', 'functLocDescrip')}
            </TableRow>
          </TableHead>
          <TableBody>
            {sorted.map((o, i) => (
              <TableRow key={i} hover sx={{ cursor: 'pointer' }} onClick={() => setViewObject(o)}>
                <TableCell>
                  <Typography variant="caption">{o.objectDescription}</Typography>
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  <Typography variant="caption">{o.functionalLocation}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="caption">{o.functLocDescrip}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={!!viewObject}
        onClose={() => { setViewObject(null); setDialogSearch('') }}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2, height: '90vh' } }}
      >
        <DialogTitle sx={{ pb: 1, pr: 6 }}>
          <Typography variant="subtitle1" fontWeight={600}>{viewObject?.objectDescription || '—'}</Typography>
          <Typography variant="caption" color="text.secondary">
            {viewObject?.functionalLocation} · {viewObject?.functLocDescrip}
          </Typography>
          <IconButton
            size="small"
            onClick={() => setViewObject(null)}
            sx={{ position: 'absolute', right: 12, top: 12 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
          <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
            <Tab label="Technine informacija" />
            <Tab label="Aptarnavimas" />
          </Tabs>
        </Box>
        <Box sx={{ px: 2, py: 1, borderBottom: 1, borderColor: 'divider' }}>
          <TextField
            size="small" fullWidth
            placeholder="Ieškoti laukų..."
            value={dialogSearch}
            onChange={e => setDialogSearch(e.target.value)}
          />
        </Box>
        <DialogContent sx={{ p: 0 }}>
          {activeTab === 1 && (
            <Stepper orientation="vertical" nonLinear sx={{ p: 2, '& .MuiStepLabel-iconContainer': { display: 'none' }, '& .MuiStepContent-root': { ml: 0, pl: 1, borderLeft: 'none' }, '& .MuiStepConnector-root': { display: 'none' } }}>
              {APT_SECTIONS.map(section => (
                <Step key={section.title} active expanded={expandedAptSteps.has(section.title)}>
                  <StepLabel sx={{ cursor: 'pointer' }} onClick={() => toggleAptStep(section.title)}>
                    <Typography variant="caption" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 0.8, color: 'text.secondary' }}>
                      {section.title}
                    </Typography>
                  </StepLabel>
                  <StepContent>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: 0.75, columnGap: 2, pb: 1.5 }}>
                      {section.fields.map(f => (
                        <Fragment key={f.label}>
                          <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.5 }}>{f.label}</Typography>
                          <Typography variant="caption" sx={{ lineHeight: 1.5 }}>—</Typography>
                        </Fragment>
                      ))}
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          )}
          {activeTab === 0 && <Stepper orientation="vertical" nonLinear sx={{ p: 2, '& .MuiStepLabel-iconContainer': { display: 'none' }, '& .MuiStepContent-root': { ml: 0, pl: 1, borderLeft: 'none' }, '& .MuiStepConnector-root': { display: 'none' } }}>
            {modalSections.map(section => {
              const isExpanded = expandedSteps.has(section.title)
              return (
                <Step key={section.title} active expanded={isExpanded}>
                  <StepLabel sx={{ cursor: 'pointer' }} onClick={() => toggleStep(section.title)}>
                    <Typography variant="caption" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 0.8, color: 'text.secondary' }}>
                      {section.title}
                    </Typography>
                  </StepLabel>
                  <StepContent>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: 0.75, columnGap: 2, pb: 1.5 }}>
                      {section.fields.map(f => (
                        <Fragment key={String(f.key)}>
                          <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.5 }}>{f.label}</Typography>
                          <Typography variant="caption" sx={{ lineHeight: 1.5 }}>{viewObject?.[f.key] || '—'}</Typography>
                        </Fragment>
                      ))}
                    </Box>
                  </StepContent>
                </Step>
              )
            })}
          </Stepper>}
        </DialogContent>
        <DialogActions sx={{ px: 2, py: 1.5, borderTop: 1, borderColor: 'divider' }}>
          <Button variant="contained" size="small" startIcon={<AddIcon />} disableElevation
            onClick={e => setAttrMenuAnchor(e.currentTarget)}>
            Pridėti atributą
          </Button>
          <Menu
            anchorEl={attrMenuAnchor}
            open={!!attrMenuAnchor}
            onClose={() => setAttrMenuAnchor(null)}
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          >
            {[
              'Galia (kW)', 'Įtampa (V)', 'Srovė (A)', 'Dažnis (Hz)',
              'Svoris (kg)', 'Ilgis (m)', 'Plotis (m)', 'Aukštis (m)',
              'Temperatūra (°C)', 'Slėgis (bar)', 'Greitis (km/h)',
              'Talpa (l)', 'Techninė būklė', 'Konfigūracija',
              'Paskirtis', 'Garantija (mėn.)', 'Pagaminimo metai',
            ].map(attr => (
              <MenuItem key={attr} dense onClick={() => setAttrMenuAnchor(null)}>
                <ListItemText primary={attr} primaryTypographyProps={{ variant: 'body2' }} />
              </MenuItem>
            ))}
          </Menu>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

function DarboCentraiTabContent() {
  const [sortKey, setSortKey] = useState<SortKey>('kodas')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [search, setSearch] = useState('')
  const [filterRegionas, setFilterRegionas] = useState<string[]>([])
  const [filterDarboCentras, setFilterDarboCentras] = useState<string[]>([])

  const [createOpen, setCreateOpen] = useState(false)
  const [formPavadinimas, setFormPavadinimas] = useState('')
  const [formSkyrius, setFormSkyrius] = useState('')
  const [formImone, setFormImone] = useState('')
  const [formRegionas, setFormRegionas] = useState('')
  const [formDarboCentras, setFormDarboCentras] = useState('')
  const [formDarbuotojai, setFormDarbuotojai] = useState<string[]>([])

  function closeCreate() {
    setCreateOpen(false)
    setFormPavadinimas(''); setFormSkyrius(''); setFormImone('')
    setFormRegionas(''); setFormDarboCentras(''); setFormDarbuotojai([])
  }

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const filtered = DARBO_CENTRAI.filter(dc => {
    if (search && !`${dc.kodas} ${dc.pavadinimas}`.toLowerCase().includes(search.toLowerCase())) return false
    if (filterRegionas.length && !filterRegionas.includes(dc.regionas ?? '')) return false
    if (filterDarboCentras.length && !filterDarboCentras.includes(dc.darboCentras ?? '')) return false
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    const av = (a[sortKey] ?? '').toString().toLowerCase()
    const bv = (b[sortKey] ?? '').toString().toLowerCase()
    return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
  })

  function th(label: string, key: SortKey, nowrap = true) {
    return (
      <TableCell sx={{ fontWeight: 600, whiteSpace: nowrap ? 'nowrap' : 'normal' }}>
        <TableSortLabel
          active={sortKey === key}
          direction={sortKey === key ? sortDir : 'asc'}
          onClick={() => handleSort(key)}
        >
          {label}
        </TableSortLabel>
      </TableCell>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <Box sx={{ px: 2, pt: 1.5, pb: 1, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
          <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
            Sukurti Darbo Centrą
          </Button>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            size="small" placeholder="Ieškoti pagal kodą ar pavadinimą..." value={search}
            onChange={e => setSearch(e.target.value)}
            sx={{ flex: '1 1 220px', minWidth: 200 }}
          />
          <Autocomplete
            multiple size="small"
            options={REGIONAS_OPTIONS}
            value={filterRegionas}
            onChange={(_, v) => setFilterRegionas(v)}
            renderTags={() => null}
            renderInput={params => <TextField {...params} label="Regionas" />}
            sx={{ flex: '0 0 180px' }}
          />
          <Autocomplete
            multiple size="small"
            options={DARBO_CENTRAS_OPTIONS}
            value={filterDarboCentras}
            onChange={(_, v) => setFilterDarboCentras(v)}
            renderTags={() => null}
            renderInput={params => <TextField {...params} label="Darbo centras" />}
            sx={{ flex: '1 1 260px', minWidth: 240 }}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', alignItems: 'center', mt: 1, minHeight: 24 }}>
          <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
            Rodoma {filtered.length} iš {DARBO_CENTRAI.length}:
          </Typography>
          {filterRegionas.map(r => (
            <Chip key={r} size="small" label={r} onDelete={() => setFilterRegionas(prev => prev.filter(x => x !== r))} />
          ))}
          {filterDarboCentras.map(d => (
            <Chip key={d} size="small" label={d} onDelete={() => setFilterDarboCentras(prev => prev.filter(x => x !== d))} />
          ))}
        </Box>
      </Box>

    <TableContainer sx={{ flex: 1, overflowY: 'auto' }}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            {th('Kodas', 'kodas')}
            {th('Pavadinimas', 'pavadinimas', false)}
            {th('Skyrius', 'skyrius')}
            {th('Įmonė', 'imone')}
            {th('Regionas', 'regionas')}
            {th('Darbo centras', 'darboCentras')}
          </TableRow>
        </TableHead>
        <TableBody>
          {sorted.map(dc => (
            <TableRow key={dc.kodas + dc.skyrius} hover sx={{ cursor: 'pointer' }}>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>
                <Typography variant="caption">{dc.kodas}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="caption">{formatPavadinimas(dc.pavadinimas)}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="caption">{dc.skyrius}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="caption">{dc.imone}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="caption">{dc.regionas || '—'}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="caption">{dc.darboCentras || '—'}</Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

      <Drawer anchor="right" open={createOpen} onClose={closeCreate} PaperProps={{ sx: { width: 500, borderRadius: 0 } }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ px: 2.5, py: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <Typography variant="subtitle1" fontWeight={600}>Naujas darbo centras</Typography>
            <IconButton size="small" onClick={closeCreate}><CloseIcon fontSize="small" /></IconButton>
          </Box>

          <Box sx={{ flex: 1, overflowY: 'auto', px: 2.5, py: 2.5 }}>
            <Stack spacing={2.5}>
              <TextField
                label="Darbo centro pavadinimas" size="small" fullWidth
                value={formPavadinimas} onChange={e => setFormPavadinimas(e.target.value)}
              />
              <TextField
                select label="Skyrius" size="small" fullWidth
                value={formSkyrius} onChange={e => setFormSkyrius(e.target.value)}
              >
                {SKYRIUS_OPTIONS.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
              </TextField>
              <TextField
                select label="Įmonė" size="small" fullWidth
                value={formImone} onChange={e => setFormImone(e.target.value)}
              >
                {IMONE_OPTIONS.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
              </TextField>
              <TextField
                select label="Regionas" size="small" fullWidth
                value={formRegionas} onChange={e => setFormRegionas(e.target.value)}
              >
                {REGIONAS_OPTIONS.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
              </TextField>
              <TextField
                select label="Darbo centras" size="small" fullWidth
                value={formDarboCentras} onChange={e => setFormDarboCentras(e.target.value)}
              >
                {DARBO_CENTRAS_OPTIONS.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
              </TextField>
              <Autocomplete
                multiple size="small"
                options={DARBUOTOJAI_OPTIONS}
                value={formDarbuotojai}
                onChange={(_, v) => setFormDarbuotojai(v)}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip size="small" label={option} {...getTagProps({ index })} />
                  ))
                }
                renderInput={params => <TextField {...params} label="Darbuotojai" />}
              />
            </Stack>
          </Box>

          <Box sx={{ px: 2.5, py: 2, borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'flex-end', gap: 1, flexShrink: 0 }}>
            <Button onClick={closeCreate}>Atšaukti</Button>
            <Button
              variant="contained" disableElevation
              disabled={!formPavadinimas.trim()}
              onClick={closeCreate}
            >
              Išsaugoti
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  )
}

const ATRIBUTAI: { pavadinimas: string; vienetas: string; tipas: string; privalomas: boolean }[] = []

function AtributaiTabContent() {
  const [search, setSearch] = useState('')

  const filtered = ATRIBUTAI.filter(a =>
    !search || a.pavadinimas.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <Box sx={{ px: 2, pt: 1.5, pb: 1.5, borderBottom: 1, borderColor: 'divider', display: 'flex', gap: 1.5, alignItems: 'center' }}>
        <TextField
          size="small" fullWidth
          placeholder="Ieškoti atributų..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Button variant="contained" size="small" startIcon={<AddIcon />} disableElevation sx={{ whiteSpace: 'nowrap' }}>
          Naujas
        </Button>
      </Box>
      <TableContainer sx={{ flex: 1, overflowY: 'auto' }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Pavadinimas</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Tipas</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Vienetas</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Privalomas</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map(a => (
              <TableRow key={a.pavadinimas} hover sx={{ cursor: 'pointer' }}>
                <TableCell><Typography variant="caption">{a.pavadinimas}</Typography></TableCell>
                <TableCell><Typography variant="caption">{a.tipas}</Typography></TableCell>
                <TableCell><Typography variant="caption">{a.vienetas}</Typography></TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={a.privalomas ? 'Taip' : 'Ne'}
                    color={a.privalomas ? 'primary' : 'default'}
                    variant={a.privalomas ? 'filled' : 'outlined'}
                    sx={{ fontSize: 10, height: 18 }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export function ObjektaiPage() {
  const { tabSlug } = useParams<{ tabSlug: string }>()
  const navigate = useNavigate()
  const tabIndex = Math.max(0, TABS.findIndex(t => t.slug === tabSlug))

  return (
    <WebAppShell>
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
          <Tabs value={tabIndex} onChange={(_, v) => navigate(`/objektai/${TABS[v].slug}`)}>
            {TABS.map(t => <Tab key={t.slug} label={t.label} />)}
          </Tabs>
        </Box>
        {tabIndex === 0 && <UzduotysTabContent />}
        {tabIndex === 1 && <TechObjektaiTabContent />}
        {tabIndex === 2 && <DarboCentraiTabContent />}
        {tabIndex === 4 && <AtributaiTabContent />}
        {tabIndex !== 0 && tabIndex !== 1 && tabIndex !== 2 && tabIndex !== 4 && <Box sx={{ flex: 1 }} />}
      </Box>
    </WebAppShell>
  )
}
