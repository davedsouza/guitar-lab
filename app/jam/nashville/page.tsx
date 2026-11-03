"use client"

import { useState } from "react"
import KeyPicker from "@/components/jam/KeyPicker"
import BandGuidance from "@/components/jam/BandGuidance"
import { ChordTap } from "@/components/jam/ChordSheet"
import ChordView from "@/components/jam/ChordView"
import { Chip, Panel } from "@/components/jam/ui"
import type { GuidanceGenre } from "@/lib/jam/band"
import { progressionChords } from "@/lib/jam/charts"
import { GENRES } from "@/lib/jam/genres"
import { diatonicChords, findVoicings, fromNashville, keyLabel, prefersFlats, type KeyRef } from "@/lib/jam/theory"

const COMMON: { name: string; nums: string[] }[] = [
  { name: "Three-chord song", nums: ["1", "4", "5", "1"] },
  { name: "Pop loop", nums: ["1", "5", "6m", "4"] },
  { name: "50s", nums: ["1", "6m", "4", "5"] },
  { name: "Sad start", nums: ["6m", "4", "1", "5"] },
  { name: "Jazz turnaround", nums: ["2m", "5", "1", "1"] },
  { name: "Blues turn", nums: ["1", "4", "1", "5"] },
]

const READING = [
  ["6m", "Minor chord. Lowercase or an m after the number."],
  ["4/1", "Slash chord: play the 4 chord with the 1 in the bass."],
  ["1 4", "Two numbers in one bar: split it. Two beats each."],
  ["1  .  .  .", "Dots or dashes are beats where you keep ringing the same chord."],
  ["<1>", "Diamond: hold it. Let it ring until the leader cuts you off."],
  ["^1", "Push: hit the chord a half beat early."],
]

const SAY = [
  "Call it before it comes: \"Four next!\" works better than \"F!\" when you don't know the key.",
  "The leader tells the key and the form once: \"G, verse is 1 4 1 5, chorus is 1 5 6m 4.\"",
  "Switching keys for a singer takes no extra work. The numbers stay the same.",
]

export default function Nashville() {
  const [key, setKey] = useState<KeyRef>({ root: 7, minor: false })
  const [sevenths, setSevenths] = useState(false)
  const [picked, setPicked] = useState<number | null>(null)
  const [genre, setGenre] = useState<GuidanceGenre>("general")

  const chords = diatonicChords(key)
  const flats = prefersFlats(key)
  const homeDegree = key.minor ? 6 : 1
  const sel = picked !== null ? chords[picked] : null
  const selMatch = sel ? findVoicings(sevenths ? sel.seventh : sel.triad) : null

  return (
    <div className="space-y-4">
      <Panel>
        <KeyPicker value={key} onChange={k => { setKey(k); setPicked(null) }} />
      </Panel>

      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-bold">Key of {keyLabel(key)}</h2>
        <div className="flex gap-1.5">
          <Chip active={!sevenths} onClick={() => setSevenths(false)} className="min-h-10 text-sm">Triads</Chip>
          <Chip active={sevenths} onClick={() => setSevenths(true)} className="min-h-10 text-sm">7ths</Chip>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 min-[420px]:grid-cols-4">
        {chords.map((c, i) => {
          const isHome = c.degree === homeDegree
          const on = picked === i
          return (
            <button
              key={c.degree}
              type="button"
              onClick={() => setPicked(on ? null : i)}
              aria-pressed={on}
              className={`flex min-h-24 flex-col items-center justify-center rounded-2xl border p-2 active:scale-95 ${
                on ? "border-amber-400 bg-amber-400 text-slate-950" : isHome ? "border-purple-300 bg-purple-500/25" : "border-white/20 bg-white/[0.07]"
              }`}
            >
              <span className={`text-3xl font-black leading-none ${on ? "" : "text-amber-300"}`}>{c.nashville}</span>
              <span className="mt-1.5 text-xl font-bold">{sevenths ? c.seventh : c.triad}</span>
              <span className={`text-xs ${on ? "text-slate-800" : "text-purple-200"}`}>{c.roman}{isHome ? " · home" : ""}</span>
            </button>
          )
        })}
      </div>
      {key.minor && (
        <p className="text-sm text-purple-200">
          Minor keys use the numbers of the relative major, so {keyLabel(key)} is the 6m. The home chord is highlighted.
        </p>
      )}

      {sel && selMatch && (
        <Panel title={`${sel.nashville} chord · ${sevenths ? sel.seventh : sel.triad}`}>
          <ChordView name={sevenths ? sel.seventh : sel.triad} fingers={selMatch.voicings[0].fingers} size="medium" />
        </Panel>
      )}

      <Panel title="Common patterns in this key">
        <ul className="space-y-2">
          {COMMON.map(p => {
            const tonic = key.minor ? (key.root + 3) % 12 : key.root
            return (
              <li key={p.name} className="rounded-xl bg-slate-950/60 p-3">
                <p className="text-sm font-semibold text-purple-200">{p.name}</p>
                <p className="mt-1 text-lg font-black text-amber-300">{p.nums.join("  ")}</p>
                <p className="flex flex-wrap gap-x-4 text-lg font-bold">
                  {p.nums.map((n, i) => { const c = fromNashville(n, tonic, flats); return <ChordTap key={i} chord={c} className="min-h-12 px-1">{c}</ChordTap> })}
                </p>
              </li>
            )
          })}
        </ul>
      </Panel>

      <Panel title="Reading a number chart">
        <dl className="space-y-2.5">
          {READING.map(([sym, txt]) => (
            <div key={sym} className="flex items-start gap-3">
              <dt className="min-w-16 rounded-lg bg-black/50 px-2 py-1 text-center font-mono text-base font-bold text-amber-300">{sym}</dt>
              <dd className="text-sm leading-relaxed text-white/85">{txt}</dd>
            </div>
          ))}
        </dl>
      </Panel>

      <Panel title="Calling it in a jam">
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-white/85">
          {SAY.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      </Panel>

      <BandGuidance
        genre={genre}
        onGenreChange={setGenre}
        title="Who plays what with numbers"
        progressions={genre === "general" ? undefined : GENRES.find(g => g.id === genre)?.progressions.map(p => ({
          label: p.name,
          chords: progressionChords(p, key),
          key: { root: key.root, minor: p.minor ?? key.minor },
        }))}
      />
    </div>
  )
}
