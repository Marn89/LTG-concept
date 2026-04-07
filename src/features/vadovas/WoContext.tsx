import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { WoStatus } from '../darbuotojas/data'

export interface WorkOrder {
  id: string
  title: string
  location: string
  date: string
  time: string
  status: WoStatus
  workerName: string
}

interface WoContextType {
  workOrders: WorkOrder[]
  addWorkOrder: (wo: Omit<WorkOrder, 'id'>) => void
}

const WoContext = createContext<WoContextType>({
  workOrders: [],
  addWorkOrder: () => {},
})

const initialWorkOrders: WorkOrder[] = [
  { id: 'w1-1', title: 'Bėgių apžiūra',            location: 'Km 45+200 – 45+800',   date: '2026-04-07', time: '08:00', status: 'msgs',      workerName: 'Aleksas Jonaitis' },
  { id: 'w1-2', title: 'Iešmo Nr. 12 patikrinimas', location: 'Kauno st., A peronas', date: '2026-04-06', time: '10:30', status: 'ctrd_prel', workerName: 'Aleksas Jonaitis' },
  { id: 'w1-3', title: 'Signalo lempos keitimas',   location: 'Km 67+100',             date: '2026-04-05', time: '13:00', status: 'rel',       workerName: 'Aleksas Jonaitis' },
  { id: 'w2-1', title: 'Apsaugos relės keitimas',   location: 'Lentvario st.',         date: '2026-04-07', time: '08:30', status: 'tech',      workerName: 'Petras Kazlauskas' },
  { id: 'w2-2', title: 'Kabelių kanalo apžiūra',    location: 'Km 88+000 – 88+600',   date: '2026-04-06', time: '11:00', status: 'msgs',      workerName: 'Petras Kazlauskas' },
  { id: 'w3-1', title: 'Semaforo lempos keitimas',  location: 'Naujoji Vilnia st.',    date: '2026-04-05', time: '14:30', status: 'ctrd_prel', workerName: 'Jonas Stankevičius' },
]

export function WoProvider({ children }: { children: ReactNode }) {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(initialWorkOrders)

  const addWorkOrder = (wo: Omit<WorkOrder, 'id'>) =>
    setWorkOrders(prev => [{ ...wo, id: Date.now().toString() }, ...prev])

  return (
    <WoContext.Provider value={{ workOrders, addWorkOrder }}>
      {children}
    </WoContext.Provider>
  )
}

export const useWo = () => useContext(WoContext)
