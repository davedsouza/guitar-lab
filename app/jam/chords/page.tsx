"use client"

import { useMemo, useState } from "react"
import { ChordCard } from "@/components/jam/ChordView"
import { Chip, NextSteps, Panel, inputClass } from "@/components/jam/ui"
import Link from "next/link"
import { SHARP_NAMES, findVoicings, parseChord, voicingsFor } from "@/lib/jam/theory"
import { BIBLE_GROUPS, BIBLE_QUALITIES } from "@/lib/chordBible"

function chipLabel(q: { label: string; suffix: string }) {
  return q.label === "Major" || q.label === "Minor" ? q.label : q.suffix
}

const QUICK = ["C", "D", "E", "F", "G", "A", "Am", "Dm", "Em", "Bm", "G7", "D7"]

export default function ChordFinder() {
  const [root, setRoot] = useState(0)
  const [quality, setQuality] = useState("Major")
  const [voicing, setVoicing] = useState(0)
  const [text, setText] = useState("")
  const [note, setNote] = useState("")

  const rootName = SHARP_NAMES[root]
  const voicings = useMemo(() => voicingsFor(root, quality) ?? [], [root, quality])
  const qInfo = BIBLE_QUALITIES.find(q => q.label === quality) ?? BIBLE_QUALITIES[0]
  const display = rootName + qInfo.suffix

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
        {BIBLE_GROUPS.map(g => (
          <div key={g} className="mb-3 last:mb-0">
            <p className="mb-1.5 text-xs font-semibold text-white/70">{g}</p>
            <div className="grid grid-cols-4 gap-1.5">
              {BIBLE_QUALITIES.filter(q => q.group === g).map(q => (
                <Chip key={q.id} active={quality === q.label} onClick={() => select(root, q.label)} className="px-1 text-sm" ariaLabel={chipLabel(q) === q.label ? undefined : `${chipLabel(q)}, ${q.label}`}>
                  {chipLabel(q)}
                </Chip>
              ))}
            </div>
          </div>
        ))}
      </Panel>

      <Panel>
        <ChordCard name={display} voicings={voicings} index={voicing} onIndex={setVoicing} />
        <Link
          href={`/chord-bible?root=${root}&q=${qInfo.id}`}
          className="mt-3 flex min-h-12 items-center justify-center rounded-xl border border-white/20 bg-white/10 px-4 text-sm font-semibold text-amber-300 active:bg-white/20"
        >
          See every {display} shape in the Chord Bible
        </Link>
      </Panel>
      <NextSteps items={[{ href: "/chord-bible", label: "Chord Bible" }, { href: "/jam/builder", label: "Song Builder" }, { href: "/jam/progressions", label: "Ideas" }]} />
    </div>
  )
}
