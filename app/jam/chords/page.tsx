"use client"

import { useMemo, useState } from "react"
import { ChordCard } from "@/components/jam/ChordView"
import { Chip, Panel, inputClass } from "@/components/jam/ui"
import { SHARP_NAMES, findVoicings, parseChord, listAllQualities } from "@/lib/jam/theory"
import { getChordVoicings } from "@/lib/chordShapes"

const QUALITY_LABEL: Record<string, string> = {
  "Major": "Major",
  "Minor": "Minor",
  "Dominant 7th": "7",
  "Major 7th": "maj7",
  "Minor 7th": "m7",
  "Diminished": "dim",
  "Augmented": "aug",
  "Sus4": "sus4",
}

const QUICK = ["C", "D", "E", "F", "G", "A", "Am", "Dm", "Em", "Bm", "G7", "D7"]

export default function ChordFinder() {
  const [root, setRoot] = useState(0)
  const [quality, setQuality] = useState("Major")
  const [voicing, setVoicing] = useState(0)
  const [text, setText] = useState("")
  const [note, setNote] = useState("")

  const rootName = SHARP_NAMES[root]
  const voicings = useMemo(() => getChordVoicings(rootName, quality) ?? [], [rootName, quality])
  const display = rootName + (quality === "Minor" ? "m" : quality === "Major" ? "" : QUALITY_LABEL[quality])

  function select(r: number, q: string) {
    setRoot(r)
    setQuality(q)
    setVoicing(0)
  }

  function search(value: string) {
    setText(value)
    const trimmed = value.trim()
    if (!trimmed) { setNote(""); return }
    const match = findVoicings(trimmed)
    const parsed = parseChord(trimmed)
    if (!match || !parsed) { setNote("Not a chord we know yet. Try C, Am, G7, Dmaj7, Bm7."); return }
    select(parsed.root, match.quality)
    setNote(match.simplified ? `Showing the closest shape: ${match.quality}.` : parsed.bass !== null ? "Slash bass note ignored; play the bass note on the low string." : "")
  }

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="chord-search" className="sr-only">Type a chord</label>
        <input
          id="chord-search"
          className={inputClass}
          placeholder="Type a chord: Am7, F#m, Bb..."
          value={text}
          onChange={e => search(e.target.value)}
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck={false}
        />
        {note && <p className="mt-2 text-sm text-amber-300">{note}</p>}
      </div>

      <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
        {QUICK.map(c => (
          <Chip
            key={c}
            className="shrink-0"
            onClick={() => {
              const m = findVoicings(c)
              const p = parseChord(c)
              if (m && p) select(p.root, m.quality)
              setText("")
              setNote("")
            }}
          >
            {c}
          </Chip>
        ))}
      </div>

      <Panel title="Root">
        <div className="grid grid-cols-6 gap-1.5">
          {SHARP_NAMES.map((n, i) => (
            <Chip key={n} active={root === i} onClick={() => select(i, quality)} className="px-0 leading-tight">
              {n}
            </Chip>
          ))}
        </div>
      </Panel>

      <Panel title="Type">
        <div className="grid grid-cols-4 gap-1.5">
          {listAllQualities().map(q => (
            <Chip key={q} active={quality === q} onClick={() => select(root, q)} className="px-1 text-sm">
              {QUALITY_LABEL[q] ?? q}
            </Chip>
          ))}
        </div>
      </Panel>

      <Panel>
        <ChordCard name={display} voicings={voicings} index={voicing} onIndex={setVoicing} />
      </Panel>
    </div>
  )
}
