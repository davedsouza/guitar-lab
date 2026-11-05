"use client"

import { useState } from "react"
import { ChordTap } from "@/components/jam/ChordSheet"
import BandGuidance from "@/components/jam/BandGuidance"
import { useRememberedKey } from "@/lib/jam/storage"
import KeyPicker from "@/components/jam/KeyPicker"
import { Chip, Panel } from "@/components/jam/ui"
import type { GuidanceGenre } from "@/lib/jam/band"
import { fromNashville, prefersFlats } from "@/lib/jam/theory"

interface Strum {
  name: string
  where: string
  labels: string[]
  slots: string[]
  tip: string
}

const EIGHTS = ["1", "&", "2", "&", "3", "&", "4", "&"]

const STRUMS: Strum[] = [
  { name: "Campfire", where: "Folk, pop, almost anything", labels: EIGHTS, slots: ["D", "-", "D", "U", "-", "U", "D", "U"], tip: "The go-to pattern. Keep your arm moving down and up even on the missed strums." },
  { name: "Straight 8ths", where: "Pop, rock, alt", labels: EIGHTS, slots: ["D", "U", "D", "U", "D", "U", "D", "U"], tip: "Steady down-up. Accent the downbeats (1 2 3 4)." },
  { name: "Ballad", where: "Slow songs", labels: EIGHTS, slots: ["D", "-", "-", "U", "D", "-", "-", "U"], tip: "Let the chord ring. Lots of space." },
  { name: "Boom-chick", where: "Country, folk", labels: EIGHTS, slots: ["B", "-", "D", "U", "B", "-", "D", "U"], tip: "B is the bass note (root on beat 1, the fifth on beat 3). Then strum the top strings." },
  { name: "Reggae skank", where: "Reggae, ska", labels: EIGHTS, slots: ["-", "x", "-", "x", "-", "x", "-", "x"], tip: "Short, muted chops on the &. Top 3 or 4 strings only." },
  { name: "Palm-mute drive", where: "Rock, punk", labels: EIGHTS, slots: ["D", "D", "D", "D", "D", "D", "D", "D"], tip: "Rest the heel of your hand on the strings by the bridge. Go open on the chorus." },
  { name: "Waltz (3/4)", where: "3-beat songs", labels: ["1", "&", "2", "&", "3", "&"], slots: ["B", "-", "D", "-", "D", "-"], tip: "Bass note then two strums. Count 1-2-3, 1-2-3." },
  { name: "Shuffle", where: "Blues, swing", labels: ["1", "trip", "let", "2", "trip", "let", "3", "trip", "let", "4", "trip", "let"], slots: ["D", "-", "U", "D", "-", "U", "D", "-", "U", "D", "-", "U"], tip: "Long-short feel. Skip the middle of each triplet." },
]

const SLOT_STYLE: Record<string, string> = {
  D: "bg-amber-400 text-slate-950",
  U: "bg-purple-400 text-slate-950",
  B: "bg-emerald-400 text-slate-950",
  x: "bg-white/30 text-white",
  "-": "bg-white/5 text-white/30",
}

function StrumGrid({ s }: { s: Strum }) {
  return (
    <div className="rounded-xl bg-slate-950/60 p-3">
      <p className="text-base font-bold">{s.name} <span className="text-xs font-medium text-purple-200">· {s.where}</span></p>
      <div className="mt-2 overflow-x-auto" tabIndex={0} role="group" aria-label={`${s.name} strum pattern`}>
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${s.slots.length}, minmax(2rem, 1fr))` }}>
          {s.labels.map((l, i) => <span key={`l${i}`} className="text-center text-xs text-purple-200">{l}</span>)}
          {s.slots.map((c, i) => (
            <span key={i} className={`flex h-10 items-center justify-center rounded-lg text-base font-black ${SLOT_STYLE[c]}`}>{c === "-" ? "·" : c === "D" ? "↓" : c === "U" ? "↑" : c === "B" ? "B" : "×"}</span>
          ))}
        </div>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-white/80">{s.tip}</p>
    </div>
  )
}

const BLUES_BARS = ["1", "1", "1", "1", "4", "4", "1", "1", "5", "4", "1", "5"]
const TURNAROUNDS = [
  { name: "Plain", bars: "1 | 1", note: "Stay on the home chord. Easiest, loops back with no push." },
  { name: "Standard", bars: "1 | 5", note: "Land on the 5 chord in the last bar. Everyone knows it means going back to the top." },
  { name: "Busy", bars: "1 4 | 1 5", note: "Move twice in the last two bars. Gives a stronger lead into the next chorus." },
]

const ENDINGS = [
  { name: "Big stop", how: "Everybody hits the home chord once on beat 1 and stops dead. Leader gives a nod or a raised fist beforehand." },
  { name: "Slow down and hold (ritard)", how: "Last time through, slow the final line and hold the last chord. Watch the leader's hand to cut off together." },
  { name: "Repeat the last line (tag)", how: "Play the last line again, soft the second time, then slow down on the third. Call it out: 'tag it twice'." },
  { name: "Blues ending", how: "Walk 5 4 1: play the 5 chord, then the 4, then the 1 and hold. Or end 1 and a hit on 5 then 1." },
  { name: "Amen (plagal)", how: "Finish with 4 then 1. A soft church-style close that works on any slow song." },
  { name: "Fade out", how: "Everyone drops volume together over four bars. The leader signals by lowering a flat hand." },
]

const SIGNALS = [
  "One finger up: one more time through.",
  "Fist in the air or nod on beat 4: ending, big hit on the next 1.",
  "Hand circling: keep vamping on this chord.",
  "Flat hand pushed down: get quieter. Flat hand lifting: get louder.",
  "Call the chord before the change, not at the change: 'Four... four... now!'",
]

export default function Patterns() {
  const [key, setKey] = useRememberedKey({ root: 9, minor: false }, false)
  const [quick, setQuick] = useState(false)
  const [genre, setGenre] = useState<GuidanceGenre>("blues")
  const flats = prefersFlats(key)

  const bars = BLUES_BARS.map((n, i) => (quick && i === 1 ? "4" : n))
  const chordFor = (n: string) => fromNashville(n + "7", key.root, flats)

  return (
    <div className="space-y-4">
      <Panel title="Strum patterns">
        <p className="mb-3 text-sm text-purple-200">↓ down, ↑ up, B bass note, × muted chop, · skip (keep your arm moving).</p>
        <div className="space-y-3">{STRUMS.map(s => <StrumGrid key={s.name} s={s} />)}</div>
      </Panel>

      <Panel title="12-bar blues">
        <KeyPicker value={key} onChange={setKey} allowMinor={false} label="In the key of" />
        <div className="mt-3 flex gap-2">
          <Chip active={!quick} onClick={() => setQuick(false)} className="text-sm">Standard</Chip>
          <Chip active={quick} onClick={() => setQuick(true)} className="text-sm">Quick change</Chip>
        </div>
        <div className="mt-3 grid grid-cols-4 gap-1.5">
          {bars.map((n, i) => (
            <div key={i} className="rounded-xl bg-slate-950/70 px-1 py-2 text-center">
              <p className="text-xs font-semibold text-purple-300">{i + 1}</p>
              <ChordTap chord={chordFor(n)} className="min-h-12 w-full text-lg font-black leading-tight" />
              <p className="text-xs font-semibold text-amber-300">{n}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm text-purple-200">The numbers work in any key: 1 for four bars, 4 for two, 1 for two, then 5, 4, 1, 5.</p>
      </Panel>

      <Panel title="Turnarounds (bars 11 and 12)">
        <ul className="space-y-2">
          {TURNAROUNDS.map(t => (
            <li key={t.name} className="rounded-xl bg-slate-950/60 p-3">
              <p className="text-base font-bold">{t.name} <span className="ml-1 font-mono text-amber-300">{t.bars}</span></p>
              <p className="mt-1 text-sm text-white/80">
                {t.bars.split(" | ").map((b, bi) => (
                  <span key={bi}>
                    {bi > 0 && <span className="text-white/40"> | </span>}
                    {b.split(" ").map((n, ni) => <ChordTap key={ni} chord={chordFor(n)} className="min-h-12 px-1.5 font-semibold" />)}
                  </span>
                ))} <span className="text-white/50">in {fromNashville("1", key.root, flats)}</span>
              </p>
              <p className="mt-1 text-sm leading-relaxed text-white/80">{t.note}</p>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="How to end a song">
        <ul className="space-y-2.5">
          {ENDINGS.map(e => (
            <li key={e.name} className="rounded-xl bg-slate-950/60 p-3">
              <p className="text-base font-bold text-amber-300">{e.name}</p>
              <p className="mt-1 text-sm leading-relaxed text-white/85">{e.how}</p>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Signals so everyone stays together">
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-white/85">
          {SIGNALS.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      </Panel>

      <BandGuidance
        genre={genre}
        onGenreChange={setGenre}
        title="Who plays which part"
        progressions={[{ label: quick ? "12-bar blues (quick change)" : "12-bar blues", chords: bars.map(chordFor) }]}
        keyRef={key}
      />
    </div>
  )
}
