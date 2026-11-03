"use client"

import { Chip } from "@/components/jam/ui"
import { GUITARS, useGuitarKind } from "@/lib/jam/guitarAudio"

// "chips" = big tap targets for Jam pages. "select" = compact control for the Lab nav bar.
export default function GuitarTonePicker({ variant = "chips", className = "" }: { variant?: "chips" | "select"; className?: string }) {
  const [kind, setKind] = useGuitarKind()

  if (variant === "select") {
    return (
      <label className={`flex items-center gap-2 text-sm text-slate-300 ${className}`}>
        <span>Guitar sound</span>
        <select
          value={kind}
          onChange={e => setKind(e.target.value as typeof kind)}
          className="rounded-lg border border-white/20 bg-slate-900 px-2 py-1.5 text-sm text-white focus:border-amber-400 focus:outline-none"
        >
          {GUITARS.map(g => <option key={g.id} value={g.id}>{g.label}</option>)}
        </select>
      </label>
    )
  }

  return (
    <div role="group" aria-label="Guitar sound" className={`flex flex-wrap gap-1.5 ${className}`}>
      {GUITARS.map(g => <Chip key={g.id} active={kind === g.id} onClick={() => setKind(g.id)}>{g.label}</Chip>)}
    </div>
  )
}
