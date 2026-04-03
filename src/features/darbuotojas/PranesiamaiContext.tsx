import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

export interface Pranesimas {
  id: string
  description: string
  planningPlant: string
  functionalLocation: string
  maintenancePlant: string
  equipment: string
  malfunctionTime: string
  category: string
  reporter: string
  location: { lat: number; lng: number }
  photos: string[]
  createdAt: string
  createdDate: string
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
    id: '1',
    description: 'Bėgių apžiūra',
    planningPlant: 'DA01',
    functionalLocation: 'LG-L01-000GIR-AELS',
    maintenancePlant: 'DP03',
    equipment: '10097086',
    malfunctionTime: '07:00',
    category: 'Bėgiai',
    location: { lat: 54.6700, lng: 25.2797 },
    photos: ['/images/task-1.jpg', '/images/task-2.jpg'],
    reporter: 'Aleksas Jonaitis',
    createdAt: '07:14',
    createdDate: '2026-04-03',
  },
  {
    id: '2',
    description: 'Iešmo patikrinimas',
    planningPlant: 'DA02',
    functionalLocation: 'LG-L01-012500-SWCH',
    maintenancePlant: 'DP04',
    equipment: '10103421',
    malfunctionTime: '09:00',
    category: 'Iešmai',
    location: { lat: 54.8983, lng: 23.9275 },
    photos: ['/images/task-2.jpg', '/images/task-3.jpg'],
    reporter: 'Petras Kazlauskas',
    createdAt: '09:32',
    createdDate: '2026-04-03',
  },
  {
    id: '3',
    description: 'Kontaktinio tinklo apžiūra',
    planningPlant: 'DA03',
    functionalLocation: 'LG-L02-000VIL-TRNS',
    maintenancePlant: 'DP05',
    equipment: '10089234',
    malfunctionTime: '11:00',
    category: 'Kontaktinis tinklas',
    location: { lat: 54.6872, lng: 25.2798 },
    photos: ['/images/task-3.jpg'],
    reporter: 'Aleksas Jonaitis',
    createdAt: '11:08',
    createdDate: '2026-04-03',
  },
  {
    id: '4',
    description: 'Semaforo lempos keitimas',
    planningPlant: 'DA01',
    functionalLocation: 'LG-L03-000VIL-SIGS',
    maintenancePlant: 'DP03',
    equipment: '10094455',
    malfunctionTime: '14:00',
    category: 'Signalizacija',
    location: { lat: 55.9333, lng: 23.3167 },
    photos: [],
    reporter: 'Jonas Stankevičius',
    createdAt: '14:22',
    createdDate: '2026-04-02',
  },
  {
    id: '5',
    description: 'Ryšio įrangos apžiūra',
    planningPlant: 'DA02',
    functionalLocation: 'LG-L03-000KAI-COMM',
    maintenancePlant: 'DP04',
    equipment: '10088771',
    malfunctionTime: '08:00',
    category: 'Ryšiai',
    location: { lat: 54.8983, lng: 23.9275 },
    photos: ['/images/task-1.jpg'],
    reporter: 'Petras Kazlauskas',
    createdAt: '08:45',
    createdDate: '2026-04-02',
  },
  {
    id: '6',
    description: 'Transformatoriaus patikrinimas',
    planningPlant: 'DA03',
    functionalLocation: 'LG-L02-000KAU-SWTS',
    maintenancePlant: 'DP05',
    equipment: '10096312',
    malfunctionTime: '10:00',
    category: 'Kontaktinis tinklas',
    location: { lat: 54.3610, lng: 23.9410 },
    photos: ['/images/task-2.jpg'],
    reporter: 'Jonas Stankevičius',
    createdAt: '10:17',
    createdDate: '2026-04-01',
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
