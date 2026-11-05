"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { BandProvider, useBand } from "@/components/jam/BandContext"
import { ChordSheetProvider } from "@/components/jam/ChordSheet"
import BandPicker from "@/components/jam/BandPicker"
import GuitarTonePicker from "@/components/GuitarTonePicker"
import { GUITARS, useGuitarKind } from "@/lib/jam/guitarAudio"
import { bandSummary } from "@/lib/jam/band"

const TITLES: Record<string, string> = {
  "/jam/chords": "Chord Finder",
  "/jam/nashville": "Nashville Cheat Sheet",
  "/jam/transpose": "Transpose & Capo",
  "/jam/chart": "Chart",
  "/jam/progressions": "Progression Ideas",
  "/jam/setlist": "Setlist",
  "/jam/key-finder": "Key Finder",
  "/jam/builder": "Song Builder",
  "/jam/identify": "Chord Identifier",
  "/jam/scales": "Scales",
  "/jam/solo": "Solo Over Changes",
  "/jam/circle": "Circle of Fifths",
  "/jam/patterns": "Patterns & Endings",
  "/jam/tools": "Tuner & Tempo",
}

function Bar() {
  const pathname = usePathname()
  const { band } = useBand()
  const [panel, setPanel] = useState<null | "band" | "sound">(null)
  const [kind] = useGuitarKind()
  const soundLabel = GUITARS.find(g => g.id === kind)?.label ?? "Guitar"
  const isHub = pathname === "/jam"
  const title = TITLES[pathname] ?? "Jam"

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-3xl items-center gap-2 px-3">
        <Link
          href={isHub ? "/" : "/jam"}
          className="flex min-h-12 min-w-12 items-center gap-1 rounded-xl px-2 text-base font-semibold text-white active:bg-white/10"
        >
          <span aria-hidden className="text-2xl leading-none">‹</span>
          <span>{isHub ? "Lab" : "Jam"}</span>
        </Link>
        <h1 className="min-w-0 flex-1 truncate text-center text-base font-bold text-white">{isHub ? "Jam Mode" : title}</h1>
        {!isHub && (
          <button
            type="button"
            onClick={() => setPanel(p => (p === "sound" ? null : "sound"))}
            aria-expanded={panel === "sound"}
            aria-label={`Guitar sound: ${soundLabel}. Tap to change`}
            className={`flex min-h-12 min-w-12 items-center justify-center rounded-xl border text-xl ${
              panel === "sound" ? "border-amber-400 bg-amber-400 text-slate-950" : "border-white/25 bg-white/10 text-white"
            }`}
          >
            <span aria-hidden>♪</span>
          </button>
        )}
        <button
          type="button"
          onClick={() => setPanel(p => (p === "band" ? null : "band"))}
          aria-expanded={panel === "band"}
          aria-label={`Who is playing: ${bandSummary(band)}`}
          className={`min-h-12 max-w-[6.5rem] truncate rounded-xl border px-3 text-sm font-semibold ${
            panel === "band" ? "border-amber-400 bg-amber-400 text-slate-950" : "border-amber-400/60 bg-amber-400/10 text-amber-300"
          }`}
        >
          {bandSummary(band)}
        </button>
      </div>
      {panel && (
        <div className="border-t border-white/10 bg-slate-950">
          <div className="mx-auto max-w-3xl space-y-3 px-4 py-4">
            <p className="text-sm font-bold text-white">{panel === "band" ? "Who is playing?" : "Guitar sound"}</p>
            {panel === "band" ? <BandPicker /> : <GuitarTonePicker />}
            {panel === "sound" && <p className="text-sm text-purple-200">Used wherever you tap Play: chords, scales, progressions and the Chord Identifier.</p>}
            <button
              type="button"
              onClick={() => setPanel(null)}
              className="min-h-12 w-full rounded-xl bg-white/10 text-base font-semibold text-white active:bg-white/20"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

export default function JamLayout({ children }: { children: React.ReactNode }) {
  return (
    <BandProvider>
      <ChordSheetProvider>
        <div className="min-h-dvh bg-slate-950 text-white">
          <Bar />
          <div className="mx-auto max-w-3xl px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-4">{children}</div>
        </div>
      </ChordSheetProvider>
    </BandProvider>
  )
}
