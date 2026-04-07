import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

interface WoFormState {
  selectedWorkers: string[]
  setSelectedWorkers: (v: string[]) => void
  selectedEquipment: string
  setSelectedEquipment: (v: string) => void
  status: string
  setStatus: (v: string) => void
  completionDate: string
  setCompletionDate: (v: string) => void
}

const WoFormContext = createContext<WoFormState>({
  selectedWorkers: [], setSelectedWorkers: () => {},
  selectedEquipment: '',  setSelectedEquipment: () => {},
  status: '',             setStatus: () => {},
  completionDate: '',     setCompletionDate: () => {},
})

export function WoFormProvider({ children }: { children: ReactNode }) {
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>([])
  const [selectedEquipment, setSelectedEquipment] = useState('')
  const [status, setStatus] = useState('')
  const [completionDate, setCompletionDate] = useState('')

  return (
    <WoFormContext.Provider value={{ selectedWorkers, setSelectedWorkers, selectedEquipment, setSelectedEquipment, status, setStatus, completionDate, setCompletionDate }}>
      {children}
    </WoFormContext.Provider>
  )
}

export const useWoForm = () => useContext(WoFormContext)
