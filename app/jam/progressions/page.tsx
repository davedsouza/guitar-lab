"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import BandGuidance from "@/components/jam/BandGuidance"
import ChordLab, { applySwaps, type Swaps } from "@/components/jam/ChordLab"
import { ChordTap } from "@/components/jam/ChordSheet"
import PlayBar from "@/components/jam/PlayBar"
import KeyPicker from "@/components/jam/KeyPicker"
import { BigButton, Chip, NextSteps, Panel } from "@/components/jam/ui"
import { GENRES, type GenreId, type JamProgression } from "@/lib/jam/genres"
import { chordsToChartBody, progressionChords, progressionKeyLabel } from "@/lib/jam/charts"
import { makeChart, prependChart, useRememberedKey } from "@/lib/jam/storage"
import { noteName, prefersFlats, type KeyRef } from "@/lib/jam/theory"

function Card({
  p, keyRef, genre, onChart,
}: { p: JamProgression; keyRef: KeyRef; genre: GenreId; onChart: (chords: string[]) => void }) {
  const written = progressionChords(p, keyRef)
  const [swaps, setSwaps] = useState<Swaps>({})
  const [open, setOpen] = useState(false)
  const [now, setNow] = useState<number | null>(null)
  const chords = applySwaps(written, swaps)
  const effective: KeyRef = { root: keyRef.root, minor: p.minor ?? keyRef.minor }
  return (
    <li className="rounded-2xl border border-white/15 bg-white/[0.06] p-4">
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-lg font-bold leading-tight">{p.name}</h2>
        <span className="shrink-0 rounded-lg bg-white/10 px-2 py-1 text-xs font-semibold text-purple-200">{progressionKeyLabel(p, keyRef)}</span>
      </div>
      <p className="mt-2 text-sm font-black tracking-wide text-amber-300">{p.chords.join("  ")}</p>
      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
        {chords.map((c, i) => (
          <ChordTap
            key={i}
            chord={c}
            className={`-mx-1 min-h-12 rounded-lg px-1 text-xl font-bold ${now === i ? "bg-amber-400 text-slate-950" : c !== written[i] ? "text-amber-300" : ""}`}
          >
            {c}
          </ChordTap>
        ))}
      </div>
      <p className="mt-2 text-xs font-semibold text-purple-200">{p.feel} · {p.bpm[0]}-{p.bpm[1]} bpm{p.example ? ` · like ${p.example}` : ""}</p>
      <p className="mt-2 text-sm leading-relaxed text-white/85">{p.note}</p>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
        className="mt-3 min-h-12 w-full rounded-xl border border-purple-300/50 bg-purple-400/15 px-3 text-base font-bold text-purple-100 active:bg-purple-400/30"
      >
        {open ? "Close play and try" : "Play it and try changes"}
      </button>
      {open && (
        <div className="mt-3">
          <PlayBar chords={chords} original={written} defaultBpm={Math.round((p.bpm[0] + p.bpm[1]) / 2)} onStep={setNow} />
          <ChordLab written={written} swaps={swaps} setSwaps={u => setSwaps(u)} genre={genre} keyRef={effective} title={`${p.name} (my version)`} />
        </div>
      )}
      <BigButton tone="ghost" className="mt-3 min-h-12 w-full text-base" onClick={() => onChart(chords)}>Send to Chart</BigButton>
    </li>
  )
}

export default function ProgressionIdeas() {
  const router = useRouter()
  const [genre, setGenre] = useState<GenreId>("pop")
  const [key, setKey] = useRememberedKey({ root: 7, minor: false }, false)
  const [order, setOrder] = useState(0)

  const info = GENRES.find(g => g.id === genre)!
  const list = info.progressions
  // Shuffle by rotating the list so each press shows a different first card
  const shown = [...list.slice(order % list.length), ...list.slice(0, order % list.length)]

  function sendToChart(p: JamProgression, chords: string[]) {
    const effective: KeyRef = { root: key.root, minor: p.minor ?? key.minor }
    const keyName = noteName(effective.root, prefersFlats(effective)) + (effective.minor ? "m" : "")
    const chart = makeChart({
      title: `${p.name} (${info.label})`,
      key: keyName,
      genre,
      body: chordsToChartBody(chords),
    })
    prependChart(chart)
    router.push(`/jam/chart?id=${chart.id}`)
  }

  return (
    <div className="space-y-4">
      <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1" role="group" aria-label="Genre">
        {GENRES.map(g => (
          <Chip key={g.id} active={genre === g.id} onClick={() => { setGenre(g.id); setOrder(0) }} className="shrink-0">{g.label}</Chip>
        ))}
      </div>
      <p className="text-sm leading-relaxed text-purple-200">{info.blurb}</p>

      <Panel>
        <KeyPicker value={key} onChange={setKey} label="Play in" allowMinor={false} />
      </Panel>

      <BigButton className="w-full" onClick={() => setOrder(o => o + 1 + Math.floor(Math.random() * (list.length - 1)))}>
        Shuffle
      </BigButton>

      <p className="text-sm text-purple-200">Tap any chord to see how to play it. Open &quot;Play it and try changes&quot; on a card to hear it and swap chords.</p>

      <ul className="space-y-3">
        {shown.map(p => (
          <Card key={`${p.name}-${key.root}`} p={p} keyRef={key} genre={genre} onChart={c => sendToChart(p, c)} />
        ))}
      </ul>

      <BandGuidance
        genre={genre}
        title={`${info.label}: who plays what`}
        defaultOpen
        progressions={shown.map(p => ({ label: p.name, chords: progressionChords(p, key), key: { root: key.root, minor: p.minor ?? key.minor } }))}
      />
      <NextSteps items={[{ href: "/jam/builder", label: "Song Builder" }, { href: "/jam/chart", label: "Chart" }, { href: "/jam/scales", label: "Scales" }, { href: "/jam/solo", label: "Solo over these" }]} />
    </div>
  )
}
