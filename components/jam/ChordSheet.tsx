"use client"

import { createContext, useContext, useState } from "react"
import GuitarTonePicker from "@/components/GuitarTonePicker"
import { findVoicings } from "@/lib/jam/theory"
import { ChordCard } from "./ChordView"
import { BigButton } from "./ui"

const Ctx = createContext<(chord: string) => void>(() => {})

export function useChordSheet() {
  return useContext(Ctx)
}

function SheetBody({ name, onClose }: { name: string; onClose: () => void }) {
  const [index, setIndex] = useState(0)
  const match = findVoicings(name)
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 max-h-[85dvh] overflow-y-auto rounded-t-3xl border-t border-white/20 bg-slate-900 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-2xl" role="dialog" aria-label={`How to play ${name}`}>
      <div className="mx-auto max-w-md">
        {match ? (
          <>
            <ChordCard name={name} voicings={match.voicings} index={index} onIndex={setIndex} size="medium" />
            {match.simplified && <p className="mt-3 text-center text-sm text-amber-300">Showing the closest shape: {match.quality}.</p>}
          </>
        ) : (
          <p className="py-4 text-center text-base text-white/80">No diagram for {name} yet.</p>
        )}
        {match && <GuitarTonePicker className="mt-4 justify-center" />}
        <BigButton tone="ghost" className="mt-4 w-full" onClick={onClose}>Close</BigButton>
      </div>
    </div>
  )
}

export function ChordSheetProvider({ children }: { children: React.ReactNode }) {
  const [name, setName] = useState<string | null>(null)
  return (
    <Ctx.Provider value={setName}>
      {children}
      {name && <SheetBody key={name} name={name} onClose={() => setName(null)} />}
    </Ctx.Provider>
  )
}

export function ChordTap({ chord, children, className = "" }: { chord: string; children?: React.ReactNode; className?: string }) {
  const open = useChordSheet()
  return (
    <button
      type="button"
      onClick={() => open(chord)}
      aria-label={`How to play ${chord}`}
      className={`inline-flex min-w-11 select-none items-center justify-center rounded-lg active:bg-white/20 ${className}`}
    >
      {children ?? chord}
    </button>
  )
}
