"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { chordsToChartBody } from "@/lib/jam/charts"
import { makeChart, prependChart } from "@/lib/jam/storage"
import { MOODS, chordOptions, moodChord, surpriseSwap, type Mood } from "@/lib/jam/swap"
import { chordInfo } from "@/lib/jam/tabs"
import { noteName, prefersFlats, type KeyRef } from "@/lib/jam/theory"
import type { GuidanceGenre } from "@/lib/jam/band"
import { useChordSheet } from "./ChordSheet"
import { Chip } from "./ui"

export type Swaps = Record<string, string>

export function applySwaps(written: string[], swaps: Swaps): string[] {
  return written.map(c => swaps[c] ?? c)
}

export default function ChordLab({
  written, swaps, setSwaps, genre, keyRef, title = "My version",
}: {
  written: string[]
  swaps: Swaps
  setSwaps: (u: (s: Swaps) => Swaps) => void
  genre: GuidanceGenre
  keyRef?: KeyRef
  title?: string
}) {
  const router = useRouter()
  const openSheet = useChordSheet()
  const uniq = Array.from(new Set(written)).filter(c => chordInfo(c))
  const [picked, setPicked] = useState<string | null>(null)
  const orig = picked && uniq.includes(picked) ? picked : uniq[0]
  if (!orig) return null
  const options = chordOptions(orig, genre, keyRef)
  const now = swaps[orig] ?? orig
  const swapped = Object.keys(swaps).length > 0

  function swap(o: string, next: string | null) {
    setSwaps(s => {
      const n = { ...s }
      if (next) n[o] = next
      else delete n[o]
      return n
    })
  }

  function mood(m: Mood) {
    setSwaps(prev => {
      const n: Swaps = {}
      for (const c of uniq) {
        const next = moodChord(prev[c] ?? c, m, keyRef)
        if (next !== c) n[c] = next
      }
      return n
    })
  }

  function saveAsChart() {
    const chords = applySwaps(written, swaps)
    const k: KeyRef = keyRef ?? { root: 0, minor: false }
    const chart = makeChart({
      title,
      key: noteName(k.root, prefersFlats(k)) + (k.minor ? "m" : ""),
      genre,
      body: chordsToChartBody(chords),
    })
    prependChart(chart)
    router.push(`/jam/chart?id=${chart.id}`)
  }

  return (
    <div className="mt-3 rounded-xl border border-purple-300/30 bg-purple-400/10 p-3">
      <p className="text-sm text-white/85">
        Play with the chords. Change the whole feel in one tap, or pick a chord and swap it for another from the Chord Bible. Press Play to hear it.
      </p>

      <p className="mt-3 text-xs font-bold uppercase tracking-wide text-purple-200">Change the whole feel</p>
      <div className="mt-1.5 flex flex-wrap gap-1.5" role="group" aria-label="Change the whole progression">
        {MOODS.map(m => (
          <button
            key={m.id}
            type="button"
            title={m.hint}
            onClick={() => mood(m.id)}
            className="min-h-11 rounded-xl border border-white/20 bg-white/10 px-3 text-sm font-bold text-white active:bg-white/20"
          >
            {m.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setSwaps(s => surpriseSwap(written, s, genre, keyRef))}
          className="min-h-11 rounded-xl border border-amber-400/60 bg-amber-400/15 px-3 text-sm font-bold text-amber-200 active:bg-amber-400/30"
        >
          Surprise me
        </button>
      </div>
      <p className="mt-1.5 text-xs text-white/60">Tap a feel again to push it further. Surprise me makes one swap you can keep or undo.</p>

      <p className="mt-4 text-xs font-bold uppercase tracking-wide text-purple-200">Or change one chord</p>
      <div className="-mx-1 mt-1.5 flex gap-1.5 overflow-x-auto px-1 pb-1" role="group" aria-label="Which chord to change">
        {uniq.map(c => (
          <Chip key={c} active={c === orig} onClick={() => setPicked(c)} className="min-h-11 shrink-0 text-base">
            {swaps[c] && swaps[c] !== c ? `${c} → ${swaps[c]}` : c}
          </Chip>
        ))}
      </div>
      {options.length === 0 ? (
        <p className="mt-2 text-sm text-white/70">No swaps for {orig} yet. Open it in the Chord Bible to see every shape.</p>
      ) : (
        <ul className="mt-2 space-y-1.5" aria-label={`Options to try instead of ${orig}`}>
          {[{ chord: orig, label: "Original", why: "The chord as written.", best: false }, ...options].map((o, i) => {
            const on = now === o.chord
            return (
              <li key={o.chord} className="flex items-stretch gap-1.5">
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => swap(orig, i === 0 ? null : o.chord)}
                  className={`min-h-12 min-w-0 flex-1 rounded-xl border px-3 py-1.5 text-left transition-colors active:scale-[0.99] ${
                    on ? "border-amber-400 bg-amber-400 text-slate-950" : "border-white/20 bg-white/10 text-white active:bg-white/20"
                  }`}
                >
                  <span className="flex flex-wrap items-baseline gap-x-2">
                    <span className="text-base font-extrabold">{o.chord}</span>
                    <span className={`text-xs font-semibold ${on ? "text-slate-800" : "text-purple-200"}`}>{o.label}</span>
                    {o.best && <span className={`rounded px-1 text-xs font-bold ${on ? "bg-slate-900/20 text-slate-900" : "bg-amber-400/25 text-amber-200"}`}>Best fit</span>}
                  </span>
                  <span className={`block text-sm leading-snug ${on ? "text-slate-900" : "text-white/80"}`}>{o.why}</span>
                </button>
                <button
                  type="button"
                  onClick={() => openSheet(o.chord)}
                  aria-label={`Shapes for ${o.chord}`}
                  className="min-h-12 shrink-0 rounded-xl border border-white/20 bg-white/10 px-3 text-sm font-bold text-white active:bg-white/20"
                >
                  Shapes
                </button>
              </li>
            )
          })}
        </ul>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {swapped && (
          <>
            <button
              type="button"
              onClick={saveAsChart}
              className="min-h-11 rounded-xl bg-amber-400 px-3 text-sm font-bold text-slate-950 active:bg-amber-300"
            >
              Save my version as a chart
            </button>
            <button
              type="button"
              onClick={() => setSwaps(() => ({}))}
              className="min-h-11 rounded-xl border border-white/25 bg-white/10 px-3 text-sm font-bold text-white active:bg-white/20"
            >
              Put everything back
            </button>
          </>
        )}
        <Link href="/chord-bible" className="inline-flex min-h-11 items-center text-sm font-bold text-amber-300 underline">
          Browse the whole Chord Bible
        </Link>
      </div>
    </div>
  )
}
