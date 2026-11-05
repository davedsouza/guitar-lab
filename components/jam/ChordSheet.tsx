"use client"

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import GuitarTonePicker from "@/components/GuitarTonePicker"
import Link from "next/link"
import { BIBLE_QUALITIES } from "@/lib/chordBible"
import { findVoicings, parseChord } from "@/lib/jam/theory"
import { ChordCard } from "./ChordView"
import { BigButton } from "./ui"

const Ctx = createContext<(chord: string) => void>(() => {})

export function useChordSheet() {
  return useContext(Ctx)
}

function SheetBody({ name, onClose }: { name: string; onClose: () => void }) {
  const [index, setIndex] = useState(0)
  const match = findVoicings(name)
  const parsed = parseChord(name)
  const bq = match ? BIBLE_QUALITIES.find(q => q.label === match.quality) : undefined
  const closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])
  return (
    <>
    <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} aria-hidden />
    <div className="fixed inset-x-0 bottom-0 z-50 max-h-[85dvh] overflow-y-auto rounded-t-3xl border-t border-white/20 bg-slate-900 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-2xl" role="dialog" aria-label={`How to play ${name}`}>
      <div className="sticky top-0 z-10 -mx-4 mb-2 flex items-center justify-between gap-3 border-b border-white/10 bg-slate-900 px-4 py-2">
        <p className="min-w-0 truncate text-sm font-bold text-purple-200">{name}</p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="flex min-h-11 shrink-0 items-center gap-1.5 rounded-xl border border-white/25 bg-white/10 px-4 text-base font-bold text-white active:bg-white/20"
        >
          <span aria-hidden>✕</span> Close
        </button>
      </div>
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
        {match && parsed && bq && (
          <Link
            href={`/chord-bible?root=${parsed.root}&q=${bq.id}`}
            className="mt-4 flex min-h-12 items-center justify-center rounded-xl border border-white/20 bg-white/10 px-4 text-sm font-semibold text-amber-300 active:bg-white/20"
          >
            Every shape for this chord in the Chord Bible
          </Link>
        )}
        <BigButton tone="ghost" className="mt-4 w-full" onClick={onClose}>Close</BigButton>
      </div>
    </div>
    </>
  )
}

export function ChordSheetProvider({ children }: { children: React.ReactNode }) {
  const [name, setName] = useState<string | null>(null)
  const close = useCallback(() => setName(null), [])
  return (
    <Ctx.Provider value={setName}>
      {children}
      {name && <SheetBody key={name} name={name} onClose={close} />}
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
      {children ?? <span className="underline decoration-current/40 decoration-dotted underline-offset-4">{chord}</span>}
    </button>
  )
}
