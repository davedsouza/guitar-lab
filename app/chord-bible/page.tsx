"use client"

import { Suspense, useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import ChordDiagram from "@/components/ChordDiagram"
import { Chip, Hint, Panel, inputClass } from "@/components/jam/ui"
import {
  BIBLE_GROUPS, BIBLE_QUALITIES, BIBLE_TOTAL, KINDS, KIND_INFO, bibleIdFromSuffix, bibleQuality,
  bibleVoicings, chordSymbol, chordTones, type VoiceKind,
} from "@/lib/chordBible"
import { findVoicings, fingersText, noteName, parseChord } from "@/lib/jam/theory"

const DIFF_COLOR: Record<string, string> = {
  beginner: "text-emerald-300",
  intermediate: "text-amber-300",
  advanced: "text-red-300",
}

const ROOT_LABEL = ["C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B"]
const EXAMPLES = ["Cmaj9", "F9", "Am11", "Bb13", "Dm7b5", "Edim7"]

function chipLabel(q: { label: string; suffix: string }) {
  return q.label === "Major" || q.label === "Minor" ? q.label : q.suffix
}

export default function ChordBiblePage() {
  return (
    <Suspense fallback={null}>
      <ChordBibleInner />
    </Suspense>
  )
}

function ChordBibleInner() {
  const params = useSearchParams()
  const [root, setRoot] = useState(() => {
    const r = Number(params.get("root"))
    return Number.isInteger(r) && r >= 0 && r < 12 ? r : 0
  })
  const [qid, setQid] = useState(() => {
    const q = params.get("q")
    return q && bibleQuality(q) ? q : "maj9"
  })
  const [kind, setKind] = useState<VoiceKind | "all">("all")
  const [text, setText] = useState("")
  const [note, setNote] = useState("")

  const q = bibleQuality(qid) ?? BIBLE_QUALITIES[0]
  const all = useMemo(() => bibleVoicings(root, q.id), [root, q.id])
  const shown = kind === "all" ? all : all.filter(v => v.kind === kind)
  const kindCounts = useMemo(() => {
    const m = new Map<VoiceKind, number>()
    for (const v of all) m.set(v.kind, (m.get(v.kind) ?? 0) + 1)
    return m
  }, [all])
  const symbol = chordSymbol(root, q.id)
  const flats = [1, 3, 5, 8, 10].includes(root)
  const tones = chordTones(root, q.id)

  function pick(r: number, id: string) {
    setRoot(r)
    setQid(id)
    setKind("all")
  }

  function search(value: string) {
    setText(value)
    const trimmed = value.trim()
    if (!trimmed) { setNote(""); return }
    const parsed = parseChord(trimmed)
    if (!parsed) { setNote("Not a chord we know yet. Try Cmaj9, F9, Am11 or Bb13."); return }
    const exact = bibleIdFromSuffix(parsed.suffix)
    if (exact) {
      pick(parsed.root, exact)
      setNote(parsed.bass !== null ? "Slash bass note ignored. Look for shapes marked with that note in the bass." : "")
      return
    }
    const m = findVoicings(trimmed)
    const near = m && BIBLE_QUALITIES.find(x => x.label === m.quality)
    if (!near) { setNote("Not a chord we know yet. Try Cmaj9, F9, Am11 or Bb13."); return }
    pick(parsed.root, near.id)
    setNote(`We do not have ${trimmed} itself. Showing the closest chord: ${chordSymbol(parsed.root, near.id)}.`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:py-8">
        <Link href="/" className="mb-2 inline-flex min-h-11 items-center text-sm text-purple-300 hover:text-purple-200">← Back to Home</Link>
        <h1 className="mb-1 text-3xl font-bold text-white sm:text-4xl">Chord Bible</h1>
        <p className="mb-5 text-purple-300">
          {BIBLE_TOTAL.toLocaleString()} shapes for 12 roots and {BIBLE_QUALITIES.length} chord types. Pick a chord, then pick the voicing that fits your hand and your song.
        </p>

        <div className="space-y-4">
          <div>
            <label htmlFor="bible-search" className="sr-only">Type a chord</label>
            <input
              id="bible-search"
              className={inputClass}
              placeholder="Type a chord: Cmaj9, F13, Bbm11..."
              value={text}
              onChange={e => search(e.target.value)}
              autoCapitalize="characters"
              autoCorrect="off"
              spellCheck={false}
              aria-describedby={note ? "bible-note" : undefined}
            />
            {note && <p id="bible-note" className="mt-2 text-sm text-amber-300">{note}</p>}
            {!text && (
              <div className="-mx-1 mt-2 flex gap-1.5 overflow-x-auto px-1 pb-1">
                {EXAMPLES.map(e => (
                  <Chip key={e} className="shrink-0" onClick={() => search(e)}>{e}</Chip>
                ))}
              </div>
            )}
          </div>

          <Panel title="Root">
            <div className="grid grid-cols-6 gap-1.5">
              {ROOT_LABEL.map((n, i) => (
                <Chip key={n} active={root === i} onClick={() => pick(i, q.id)} className="px-0 text-sm leading-tight">
                  {n.includes("/") ? (
                    <span className="flex flex-col"><span>{n.split("/")[0]}</span> <span className="text-xs opacity-70">{n.split("/")[1]}</span></span>
                  ) : n}
                </Chip>
              ))}
            </div>
          </Panel>

          <Panel title="Chord type">
            {BIBLE_GROUPS.map(g => (
              <div key={g} className="mb-3 last:mb-0">
                <p className="mb-1.5 text-xs font-semibold text-white/70">{g}</p>
                <div className="grid grid-cols-4 gap-1.5">
                  {BIBLE_QUALITIES.filter(x => x.group === g).map(x => (
                    <Chip key={x.id} active={qid === x.id} onClick={() => pick(root, x.id)} className="px-1 text-sm" ariaLabel={chipLabel(x) === x.label ? undefined : `${chipLabel(x)}, ${x.label}`}>
                      {chipLabel(x)}
                    </Chip>
                  ))}
                </div>
              </div>
            ))}
          </Panel>

          <Panel title={`${symbol} · ${q.label}`}>
            <p className="text-sm leading-relaxed text-white/90">{q.blurb}</p>
            <ul className="mt-3 flex flex-wrap gap-2" aria-label={`Notes in ${symbol}`}>
              {tones.map(t => (
                <li key={t.degree} className="flex min-w-12 flex-col items-center rounded-xl border border-white/20 bg-white/10 px-2 py-1.5">
                  <span className="text-lg font-extrabold text-amber-300">{t.name}</span>
                  <span className="text-xs font-semibold text-white/70">{t.degree}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-white/70">
              Guitar shapes rarely play every note. Most skip the 5th, and big chords often skip the root or the 11th too.
            </p>
          </Panel>

          <Panel title={`Voicings (${shown.length})`}>
            {kindCounts.size > 1 && (
              <>
                <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
                  <Chip active={kind === "all"} className="shrink-0" onClick={() => setKind("all")}>All {all.length}</Chip>
                  {KINDS.filter(k => kindCounts.has(k)).map(k => (
                    <Chip key={k} active={kind === k} className="shrink-0" onClick={() => setKind(k)}>
                      {KIND_INFO[k].label} {kindCounts.get(k)}
                    </Chip>
                  ))}
                </div>
                <p className="mt-2 text-sm text-white/80">
                  {kind === "all"
                    ? "Sorted from the nut up the neck. Muted strings are marked with a red x."
                    : KIND_INFO[kind].blurb}
                </p>
              </>
            )}
            {kindCounts.size <= 1 && (
              <p className="text-sm text-white/80">Sorted from the nut up the neck. Muted strings are marked with a red x.</p>
            )}

            <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {shown.map((v, i) => {
                const slash = !v.rootBass && !v.rootless ? `/${noteName(v.bassPc, flats)}` : ""
                return (
                  <li key={`${kind}-${i}`} className="flex flex-col items-center rounded-xl border border-white/15 bg-white/[0.05] p-2">
                    <ChordDiagram chordName={symbol + slash} fingers={v.fingers} size="small" />
                    <p className="mt-2 text-center text-xs font-semibold text-white/90">{v.position}</p>
                    <p className="text-center text-xs">
                      <span className={DIFF_COLOR[v.difficulty]}>{v.difficulty}</span>
                    </p>
                    <p className="mt-1 text-center font-mono text-xs text-white/60">{fingersText(v.fingers)}</p>
                  </li>
                )
              })}
            </ul>
            {shown.length === 0 && <p className="mt-3 text-base text-white/70">No shapes of that kind for this chord.</p>}
          </Panel>

          <Hint>
            Looking for something quicker? Try the{" "}
            <Link href="/jam/chords" className="font-semibold text-amber-300 underline">Jam chord finder</Link>.
          </Hint>
        </div>
      </div>
    </div>
  )
}
