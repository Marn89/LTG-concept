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
  photos: string[]
  createdAt: string
}

interface ContextType {
  pranesimai: Pranesimas[]
  addPranesimas: (p: Omit<Pranesimas, 'id' | 'createdAt'>) => void
}

const PranesiamaiContext = createContext<ContextType>({
  pranesimai: [],
  addPranesimas: () => {},
})

export function PranesiamaiProvider({ children }: { children: ReactNode }) {
  const [pranesimai, setPranesimai] = useState<Pranesimas[]>([])

  const addPranesimas = (p: Omit<Pranesimas, 'id' | 'createdAt'>) => {
    setPranesimai(prev => [{
      ...p,
      id: Date.now().toString(),
      createdAt: new Date().toLocaleTimeString('lt-LT', { hour: '2-digit', minute: '2-digit' }),
    }, ...prev])
  }

  return (
    <PranesiamaiContext.Provider value={{ pranesimai, addPranesimas }}>
      {children}
    </PranesiamaiContext.Provider>
  )
}

export const usePranesimai = () => useContext(PranesiamaiContext)
