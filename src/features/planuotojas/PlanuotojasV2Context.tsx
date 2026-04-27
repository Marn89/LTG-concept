import { createContext, useContext, useState } from 'react'

export interface V2Plan {
  grupe: string
  sistema: string[]
  kelioKategorija: string
  priedai: string
  uzduotys: string[]
  objects: string[]
}

interface ContextType {
  v2Plans: V2Plan[]
  addV2Plan: (plan: V2Plan) => void
}

const Ctx = createContext<ContextType>({ v2Plans: [], addV2Plan: () => {} })

export function PlanuotojasV2Provider({ children }: { children: React.ReactNode }) {
  const [v2Plans, setV2Plans] = useState<V2Plan[]>([])
  const addV2Plan = (plan: V2Plan) => setV2Plans(prev => [...prev, plan])
  return <Ctx.Provider value={{ v2Plans, addV2Plan }}>{children}</Ctx.Provider>
}

export const useV2Plans = () => useContext(Ctx)
