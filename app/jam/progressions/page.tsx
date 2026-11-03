"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import BandGuidance from "@/components/jam/BandGuidance"
import { ChordTap } from "@/components/jam/ChordSheet"
import KeyPicker from "@/components/jam/KeyPicker"
import { BigButton, Chip, Panel } from "@/components/jam/ui"
import { GENRES, type GenreId, type JamProgression } from "@/lib/jam/genres"
import { progressionChords, progressionKeyLabel, progressionToChartBody } from "@/lib/jam/charts"
import { makeChart, prependChart } from "@/lib/jam/storage"
import { noteName, prefersFlats, type KeyRef } from "@/lib/jam/theory"

function Card({
  p, keyRef, onChart,
}: { p: JamProgression; keyRef: KeyRef; onChart: () => void }) {
  const chords = progressionChords(p, keyRef)
  return (
    <li className="rounded-2xl border border-white/15 bg-white/[0.06] p-4">
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-lg font-bold leading-tight">{p.name}</h2>
        <span className="shrink-0 rounded-lg bg-white/10 px-2 py-1 text-xs font-semibold text-purple-200">{progressionKeyLabel(p, keyRef)}</span>
      </div>
      <p className="mt-2 text-sm font-black tracking-wide text-amber-300">{p.chords.join("  ")}</p>
      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
        {chords.map((c, i) => (
          <ChordTap key={i} chord={c} className="-mx-1 min-h-12 px-1 text-xl font-bold">{c}</ChordTap>
        ))}
      </div>
      <p className="mt-2 text-xs font-semibold text-purple-200">{p.feel} · {p.bpm[0]}-{p.bpm[1]} bpm{p.example ? ` · like ${p.example}` : ""}</p>
      <p className="mt-2 text-sm leading-relaxed text-white/85">{p.note}</p>
      <BigButton tone="ghost" className="mt-3 min-h-12 w-full text-base" onClick={onChart}>Send to Chart</BigButton>
    </li>
  )
}

export default function ProgressionIdeas() {
  const router = useRouter()
  const [genre, setGenre] = useState<GenreId>("pop")
  const [key, setKey] = useState<KeyRef>({ root: 7, minor: false })
  const [order, setOrder] = useState(0)

  const info = GENRES.find(g => g.id === genre)!
  const list = info.progressions
  // Shuffle by rotating the list so each press shows a different first card
  const shown = [...list.slice(order % list.length), ...list.slice(0, order % list.length)]

  function sendToChart(p: JamProgression) {
    const effective: KeyRef = { root: key.root, minor: p.minor ?? key.minor }
    const keyName = noteName(effective.root, prefersFlats(effective)) + (effective.minor ? "m" : "")
    const chart = makeChart({
      title: `${p.name} (${info.label})`,
      key: keyName,
      genre,
      body: progressionToChartBody(p, effective),
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

      <ul className="space-y-3">
        {shown.map(p => (
          <Card key={p.name} p={p} keyRef={key} onChart={() => sendToChart(p)} />
        ))}
      </ul>

      <BandGuidance
        genre={genre}
        title={`${info.label}: who plays what`}
        defaultOpen
        progressions={shown.map(p => ({ label: p.name, chords: progressionChords(p, key), key: { root: key.root, minor: p.minor ?? key.minor } }))}
      />
    </div>
  )
}
