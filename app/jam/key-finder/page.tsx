"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ChordTap } from "@/components/jam/ChordSheet"
import BandGuidance from "@/components/jam/BandGuidance"
import { Chip, Hint, Panel, inputClass } from "@/components/jam/ui"
import { diatonicChords, guessKeys, keyLabel, parseChordList, type KeyRef } from "@/lib/jam/theory"

const QUICK = ["C", "D", "E", "F", "G", "A", "B", "Am", "Bm", "Dm", "Em", "F#m", "Cm", "Gm"]

export default function KeyFinder() {
  const [input, setInput] = useState("")
  const chords = useMemo(() => parseChordList(input), [input])
  const guesses = useMemo(() => guessKeys(chords), [chords])
  const best = guesses[0]

  function add(c: string) {
    setInput(v => (v.trim() ? v.trim() + " " + c : c))
  }

  return (
    <div className="space-y-4">
      <Panel title="What chords are in the song?">
        <label htmlFor="kf" className="sr-only">Chords</label>
        <input
          id="kf"
          className={`${inputClass} font-mono`}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Tap below or type: G C D Em"
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck={false}
        />
        <div className="mt-3 flex flex-wrap gap-1.5">
          {QUICK.map(c => <Chip key={c} className="min-w-14" onClick={() => add(c)}>{c}</Chip>)}
        </div>
        {input && <Chip className="mt-3" onClick={() => setInput("")}>Clear</Chip>}
      </Panel>

      {chords.length === 0 ? (
        <Hint>Add the chords you are hearing (3 or more works best) and we will guess the key.</Hint>
      ) : (
        <>
          <Panel title="Most likely key">
            <p className="text-5xl font-black text-amber-300">{keyLabel(best.key)}</p>
            <p className="mt-1 text-sm text-purple-200">{best.matches} of {best.total} chords fit.{best.outside.length ? ` Outside the key: ${Array.from(new Set(best.outside)).join(", ")}.` : " Every chord fits."}</p>
            <FitChords k={best.key} />
            <Link
              href={`/jam/scales?key=${best.key.root}&mode=${best.key.minor ? "minor" : "major"}`}
              className="mt-4 flex min-h-12 items-center justify-center rounded-xl border border-white/25 bg-white/10 px-4 text-base font-semibold text-white active:bg-white/20"
            >
              Scales for {keyLabel(best.key)} →
            </Link>
          </Panel>
          {guesses.slice(1, 3).length > 0 && (
            <Panel title="Could also be">
              <ul className="space-y-2">
                {guesses.slice(1, 3).map(g => (
                  <li key={keyLabel(g.key)} className="flex items-center justify-between rounded-xl bg-slate-950/60 px-4 py-3">
                    <span className="text-xl font-bold">{keyLabel(g.key)}</span>
                    <span className="text-sm text-purple-200">{g.matches}/{g.total} fit</span>
                  </li>
                ))}
              </ul>
            </Panel>
          )}
        </>
      )}
      <BandGuidance genre="general" title="Who plays what when finding the key" />
    </div>
  )
}

function FitChords({ k }: { k: KeyRef }) {
  const d = diatonicChords(k)
  return (
    <div className="mt-4">
      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-purple-300">Chords that will fit</p>
      <div className="flex flex-wrap gap-2">
        {d.map(c => (
          <ChordTap key={c.degree} chord={c.triad} className="min-h-12 rounded-xl bg-white/10 px-3 py-2 text-base font-bold">
            {c.triad} <span className="text-xs font-semibold text-amber-300">{c.nashville}</span>
          </ChordTap>
        ))}
      </div>
    </div>
  )
}
