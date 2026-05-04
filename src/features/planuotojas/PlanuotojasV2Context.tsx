import { createContext, useContext, useState } from 'react'

export interface V2PlanStation {
  name: string
  objects: string[]
  paleidimoData: string
}

export interface V2PlanDarboCentras {
  name: string
  stations: V2PlanStation[]
}

export interface V2Plan {
  id: string
  regionas: string
  grupe: string
  sistema: string[]
  kelioKategorija: string
  priedai: string
  uzduotys: string[]
  objects: string[]
  darboCentrai: V2PlanDarboCentras[]
  atributai: Record<string, string>
  galiojaNuo: string
  galiojaIki: string
  createdAt: string
}

interface ContextType {
  v2Plans: V2Plan[]
  addV2Plan: (plan: Omit<V2Plan, 'id' | 'createdAt'>) => void
  updateV2Plan: (id: string, plan: Omit<V2Plan, 'id' | 'createdAt'>) => void
  deleteV2Plan: (id: string) => void
}

const STORAGE_KEY = 'ltg_v2_plans'
const STORAGE_VERSION = 3
const VERSION_KEY = 'ltg_v2_plans_version'

function loadPlans(): V2Plan[] {
  try {
    const version = Number(localStorage.getItem(VERSION_KEY) ?? 0)
    if (version < STORAGE_VERSION) {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.setItem(VERSION_KEY, String(STORAGE_VERSION))
      return []
    }
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function savePlans(plans: V2Plan[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans))
  localStorage.setItem(VERSION_KEY, String(STORAGE_VERSION))
}

const Ctx = createContext<ContextType>({ v2Plans: [], addV2Plan: () => {}, updateV2Plan: () => {}, deleteV2Plan: () => {} })

export function PlanuotojasV2Provider({ children }: { children: React.ReactNode }) {
  const [v2Plans, setV2Plans] = useState<V2Plan[]>(loadPlans)

  const addV2Plan = (plan: Omit<V2Plan, 'id' | 'createdAt'>) => {
    const full: V2Plan = { ...plan, id: Date.now().toString(), createdAt: new Date().toISOString() }
    setV2Plans(prev => {
      const next = [...prev, full]
      savePlans(next)
      return next
    })
  }

  const updateV2Plan = (id: string, plan: Omit<V2Plan, 'id' | 'createdAt'>) => {
    setV2Plans(prev => {
      const existing = prev.find(p => p.id === id)
      const next = prev.map(p => p.id === id ? { ...plan, id, createdAt: existing?.createdAt ?? new Date().toISOString() } : p)
      savePlans(next)
      return next
    })
  }

  const deleteV2Plan = (id: string) => {
    setV2Plans(prev => {
      const next = prev.filter(p => p.id !== id)
      savePlans(next)
      return next
    })
  }

  return <Ctx.Provider value={{ v2Plans, addV2Plan, updateV2Plan, deleteV2Plan }}>{children}</Ctx.Provider>
}

export const useV2Plans = () => useContext(Ctx)
