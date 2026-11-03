"use client"

import { createContext, useContext } from "react"
import { DEFAULT_BAND, parseBand, type Band } from "@/lib/jam/band"
import { BAND_KEY, useLocalState } from "@/lib/jam/storage"

interface BandCtx {
  band: Band
  setBand: (b: Band) => void
}

const Ctx = createContext<BandCtx>({ band: DEFAULT_BAND, setBand: () => {} })

export function BandProvider({ children }: { children: React.ReactNode }) {
  const [band, setBand] = useLocalState<Band>(BAND_KEY, DEFAULT_BAND, parseBand)
  return <Ctx.Provider value={{ band, setBand }}>{children}</Ctx.Provider>
}

export function useBand() {
  return useContext(Ctx)
}
