import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

interface PranesimasFormCtx {
  techObject: string
  setTechObject: (v: string) => void
  faultType: string
  setFaultType: (v: string) => void
}

const Ctx = createContext<PranesimasFormCtx>({
  techObject: '', setTechObject: () => {},
  faultType: '',  setFaultType: () => {},
})

export function PranesimasFormProvider({ children }: { children: ReactNode }) {
  const [techObject, setTechObject] = useState('Išleidžiamasis šviesoforas L1')
  const [faultType, setFaultType] = useState('')
  return <Ctx.Provider value={{ techObject, setTechObject, faultType, setFaultType }}>{children}</Ctx.Provider>
}

export const usePranesimasForm = () => useContext(Ctx)
