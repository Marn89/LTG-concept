import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

export interface Pranesimas {
  id: string
  functionalLocation: string
  gpsCoordinates: string
  techObject: string
  faultType: string
  notes: string
  location: { lat: number; lng: number }
  photos: string[]
  reporter: string
  createdAt: string
  createdDate: string
  isSeeded?: boolean
  pinType?: 'notification' | 'work_order'
}

interface ContextType {
  pranesimai: Pranesimas[]
  addPranesimas: (p: Omit<Pranesimas, 'id' | 'createdAt' | 'reporter' | 'createdDate'>) => void
  removePranesimas: (id: string) => void
}

const PranesiamaiContext = createContext<ContextType>({
  pranesimai: [],
  addPranesimas: () => {},
  removePranesimas: () => {},
})

const initialPranesimai: Pranesimas[] = [
  {
    isSeeded: true,
    id: 'seed-1',
    functionalLocation: 'Dūseikių geležinkelio stotis',
    gpsCoordinates: '54.640204, 25.227166',
    techObject: 'Išleidžiamasis šviesoforas L1',
    faultType: 'Šviesoforo defektas',
    notes: 'Dūseikių gel. blogas šviesaforo matomumas',
    location: { lat: 54.640204, lng: 25.227166 },
    photos: ['/images/railway-signal-snow.jpg'],
    reporter: 'Tech darbuotojas',
    createdAt: '08:14',
    createdDate: '2026-04-10',
  },
  {
    isSeeded: true,
    id: 'seed-2',
    functionalLocation: 'Dūseikių geležinkelio stotis',
    gpsCoordinates: '54.642100, 25.224800',
    techObject: 'Priimamasis šviesoforas N2',
    faultType: 'Signalizacijos įrangos defektas',
    notes: 'Šviesoforas neįsijungia po perjungimo',
    location: { lat: 54.6421, lng: 25.2248 },
    photos: [],
    reporter: 'Tech darbuotojas',
    createdAt: '07:42',
    createdDate: '2026-04-10',
  },
  {
    isSeeded: true,
    id: 'seed-3',
    functionalLocation: 'Dūseikių geležinkelio stotis',
    gpsCoordinates: '54.638900, 25.230100',
    techObject: 'Manevrinė strėlė M14',
    faultType: 'Riedmens aptikimo įrangos defektas',
    notes: 'Aptikimo kilpa nefiksuoja riedmens',
    location: { lat: 54.6389, lng: 25.2301 },
    photos: [],
    reporter: 'Tech darbuotojas',
    createdAt: '06:55',
    createdDate: '2026-04-09',
  },
  {
    isSeeded: true,
    id: 'seed-4',
    pinType: 'work_order',
    functionalLocation: 'Dūseikių geležinkelio stotis',
    gpsCoordinates: '54.641500, 25.221300',
    techObject: 'Išleidžiamasis šviesoforas L3',
    faultType: 'Kabelių tinklo defektas',
    notes: 'Pertrauktas valdymo kabelis prie posto',
    location: { lat: 54.6415, lng: 25.2213 },
    photos: [],
    reporter: 'Tech darbuotojas',
    createdAt: '09:03',
    createdDate: '2026-04-10',
  },
  {
    isSeeded: true,
    id: 'seed-5',
    functionalLocation: 'Dūseikių geležinkelio stotis',
    gpsCoordinates: '54.637800, 25.226400',
    techObject: 'EC valdymo įranga VP-1',
    faultType: 'EC/MPC valdymo įrangos defektas',
    notes: 'Įranga neatsako į komandas iš centrinio posto',
    location: { lat: 54.6378, lng: 25.2264 },
    photos: [],
    reporter: 'Tech darbuotojas',
    createdAt: '10:17',
    createdDate: '2026-04-10',
  },
  {
    isSeeded: true,
    id: 'seed-6',
    pinType: 'work_order',
    functionalLocation: 'Dūseikių geležinkelio stotis',
    gpsCoordinates: '54.643200, 25.232700',
    techObject: 'Manevrinė strėlė M8',
    faultType: 'Šviesoforo defektas',
    notes: 'Žalias signalas neįsijungia',
    location: { lat: 54.6432, lng: 25.2327 },
    photos: [],
    reporter: 'Tech darbuotojas',
    createdAt: '11:44',
    createdDate: '2026-04-10',
  },
  {
    isSeeded: true,
    id: 'seed-7',
    functionalLocation: 'Dūseikių geležinkelio stotis',
    gpsCoordinates: '54.636500, 25.223900',
    techObject: 'RAKP sistemos modulis R2',
    faultType: 'RAKP sistemos defektas',
    notes: 'Ryšio sutrikimas su centrine stotimi',
    location: { lat: 54.6365, lng: 25.2239 },
    photos: [],
    reporter: 'Tech darbuotojas',
    createdAt: '05:30',
    createdDate: '2026-04-09',
  },
  {
    isSeeded: true,
    id: 'seed-8',
    functionalLocation: 'Dūseikių geležinkelio stotis',
    gpsCoordinates: '54.644700, 25.228900',
    techObject: 'Priimamasis šviesoforas N4',
    faultType: 'Kontrolės praradimas',
    notes: 'Prarastas šviesoforo būsenos kontrolės signalas',
    location: { lat: 54.6447, lng: 25.2289 },
    photos: [],
    reporter: 'Tech darbuotojas',
    createdAt: '14:22',
    createdDate: '2026-04-09',
  },
  {
    isSeeded: true,
    id: 'seed-9',
    pinType: 'work_order',
    functionalLocation: 'Dūseikių geležinkelio stotis',
    gpsCoordinates: '54.639600, 25.218500',
    techObject: 'SIS blokas S1',
    faultType: 'SIS defektas',
    notes: 'SIS sistema neužtikrina saugos funkcijų',
    location: { lat: 54.6396, lng: 25.2185 },
    photos: [],
    reporter: 'Tech darbuotojas',
    createdAt: '16:08',
    createdDate: '2026-04-09',
  },
  {
    isSeeded: true,
    id: 'seed-10',
    functionalLocation: 'Dūseikių geležinkelio stotis',
    gpsCoordinates: '54.645900, 25.224100',
    techObject: 'Išleidžiamasis šviesoforas L5',
    faultType: 'Signalizacijos įrangos defektas',
    notes: 'Signalo lempa veikia su pertrūkiais',
    location: { lat: 54.6459, lng: 25.2241 },
    photos: [],
    reporter: 'Tech darbuotojas',
    createdAt: '08:50',
    createdDate: '2026-04-08',
  },
  {
    isSeeded: true,
    id: 'seed-11',
    pinType: 'work_order',
    functionalLocation: 'Dūseikių geležinkelio stotis',
    gpsCoordinates: '54.638200, 25.233800',
    techObject: 'Manevrinė strėlė M21',
    faultType: 'Riedmens aptikimo įrangos defektas',
    notes: 'Strėlės padėties daviklis neveikia',
    location: { lat: 54.6382, lng: 25.2338 },
    photos: [],
    reporter: 'Tech darbuotojas',
    createdAt: '12:35',
    createdDate: '2026-04-08',
  },
  {
    isSeeded: true,
    id: 'seed-12',
    functionalLocation: 'Dūseikių geležinkelio stotis',
    gpsCoordinates: '54.642800, 25.219700',
    techObject: 'EC valdymo įranga VP-3',
    faultType: 'Kabelių tinklo defektas',
    notes: 'Drėgmė pažeidė kabelių jungtis',
    location: { lat: 54.6428, lng: 25.2197 },
    photos: [],
    reporter: 'Tech darbuotojas',
    createdAt: '07:15',
    createdDate: '2026-04-08',
  },
]

export function PranesiamaiProvider({ children }: { children: ReactNode }) {
  const [pranesimai, setPranesimai] = useState<Pranesimas[]>(initialPranesimai)

  const addPranesimas = (p: Omit<Pranesimas, 'id' | 'createdAt' | 'reporter' | 'createdDate'>) => {
    setPranesimai(prev => [{
      ...p,
      id: Date.now().toString(),
      reporter: 'Tech darbuotojas',
      createdAt: new Date().toLocaleTimeString('lt-LT', { hour: '2-digit', minute: '2-digit' }),
      createdDate: new Date().toISOString().slice(0, 10),
    }, ...prev])
  }

  const removePranesimas = (id: string) =>
    setPranesimai(prev => prev.filter(p => p.id !== id))

  return (
    <PranesiamaiContext.Provider value={{ pranesimai, addPranesimas, removePranesimas }}>
      {children}
    </PranesiamaiContext.Provider>
  )
}

export const usePranesimai = () => useContext(PranesiamaiContext)
