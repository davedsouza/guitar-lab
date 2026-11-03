"use client"

import { useState, useSyncExternalStore } from "react"
import Link from "next/link"
import ChordDiagram from "@/components/ChordDiagram"
import { ChordTap } from "@/components/jam/ChordSheet"
import { BigButton, Chip, Hint, Panel, inputClass } from "@/components/jam/ui"
import {
  TUNINGS, closest, completions, describeShape, identify, knownShape, pcsOfShape, shapeFromFingers, stackNotes, type Match, type Shape,
} from "@/lib/jam/identify"
import { BUILDER_KEY, EMPTY, MAX, parseSaved, type Saved } from "@/lib/jam/next"
import GuitarTonePicker from "@/components/GuitarTonePicker"
import { guitarStatus, onGuitarStatus, playGuitar, stopGuitar, useGuitarKind, type PlayStyle } from "@/lib/jam/guitarAudio"
import { useLocalState } from "@/lib/jam/storage"
import { findVoicings, noteName, parseNote } from "@/lib/jam/theory"

type Mode = "board" | "type"

const FRETS = 12
const MARKERS = new Set([3, 5, 7, 9, 12])
const STRING_WIDTH = [3, 2.5, 2, 1.5, 1.25, 1]
const EXAMPLE_NOTES = ["E G B D", "C E G", "A C E G", "D A D F# A D"]
const QUICK_CHORDS = ["Am", "C", "G", "F", "Bm7"]
const EMPTY_SHAPE: Shape = [null, null, null, null, null, null]

function readNotes(input: string): { pcs: number[]; bad: string[] } {
  const pcs: number[] = []
  const bad: string[] = []
  for (const raw of input.split(/[\s,]+/).filter(Boolean)) {
    const pc = parseNote(raw.charAt(0).toUpperCase() + raw.slice(1))
    if (pc === null) bad.push(raw)
    else pcs.push(pc)
  }
  return { pcs, bad }
}

function Fretboard({ shape, tuning, onChange }: { shape: Shape; tuning: number[]; onChange: (s: Shape) => void }) {
  const set = (i: number, v: number | null) => onChange(shape.map((f, j) => (j === i ? v : f)))
  const stringName = (i: number) => noteName(tuning[i] % 12, false)
  return (
    <div className="grid grid-cols-[2rem_repeat(6,minmax(0,1fr))] gap-x-0">
      <div />
      {shape.map((f, i) => (
        <button
          key={i}
          type="button"
          onClick={() => set(i, f === null ? 0 : null)}
          className="flex min-h-14 select-none flex-col items-center justify-center rounded-lg active:bg-white/15"
        >
          <span aria-hidden className="text-xs font-semibold text-purple-200">{stringName(i)}</span>
          <span aria-hidden className={`text-xl font-bold leading-tight ${f === null ? "text-red-300" : f === 0 ? "text-emerald-300" : "text-white/40"}`}>
            {f === null ? "×" : f === 0 ? "○" : "·"}
          </span>
          <span className="sr-only">
            String {6 - i}, {stringName(i)}, {f === null ? "muted" : f === 0 ? "open" : `fret ${f}`}. {f === 0 ? "Tap to mute it." : "Tap to play it open."}
          </span>
        </button>
      ))}
      {Array.from({ length: FRETS }, (_, n) => n + 1).map(fret => (
        <div key={fret} className="contents">
          <div aria-hidden className="flex h-11 items-center justify-center text-xs font-semibold text-white/60">
            {fret}
            {MARKERS.has(fret) && <span className="ml-0.5 text-purple-300">{fret === 12 ? "••" : "•"}</span>}
          </div>
          {shape.map((f, i) => {
            const on = f === fret
            return (
              <button
                key={i}
                type="button"
                onClick={() => set(i, on ? null : fret)}
                aria-pressed={on}
                className="relative flex h-11 select-none items-center justify-center border-b border-white/25 active:bg-white/10"
              >
                <span aria-hidden className="absolute inset-y-0 left-1/2 -translate-x-1/2 bg-white/35" style={{ width: STRING_WIDTH[i] }} />
                {on && (
                  <span aria-hidden className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-xs font-extrabold text-slate-950">
                    {noteName((tuning[i] + fret) % 12, false)}
                  </span>
                )}
                <span className="sr-only">String {6 - i}, fret {fret}, {noteName((tuning[i] + fret) % 12, false)}</span>
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default function IdentifyPage() {
  const [mode, setMode] = useState<Mode>("board")
  const [tuningId, setTuningId] = useState("standard")
  const [shape, setShape] = useState<Shape>(EMPTY_SHAPE)
  const [text, setText] = useState("")
  const [loadText, setLoadText] = useState("")
  const [loaded, setLoaded] = useState<{ name: string; index: number; count: number } | null>(null)
  const [loadError, setLoadError] = useState("")
  const [added, setAdded] = useState("")
  const [guitar] = useGuitarKind()
  const [playing, setPlaying] = useState<PlayStyle | null>(null)
  const sound = useSyncExternalStore(onGuitarStatus, guitarStatus, () => "synth" as const)
  const [saved, setSaved] = useLocalState<Saved>(BUILDER_KEY, EMPTY, parseSaved)

  const tuning = TUNINGS.find(t => t.id === tuningId) ?? TUNINGS[0]

  const fromBoard = pcsOfShape(shape, tuning.midi)
  const typed = readNotes(text)
  const pcs = mode === "board" ? fromBoard.pcs : Array.from(new Set(typed.pcs))
  const bass = mode === "board" ? fromBoard.bass : (typed.pcs[0] ?? null)

  const matches: Match[] = identify(pcs, bass)
  const best = matches[0] ?? null
  const near = !best && pcs.length >= 4 ? closest(pcs, bass) : []
  const finishers = pcs.length > 0 && pcs.length <= 2 ? completions(pcs) : []
  const playedCount = shape.filter(f => f !== null).length
  const standard = tuning.id === "standard"
  const kind = mode === "board" ? describeShape(shape) : null
  const known = mode === "board" && standard && best ? knownShape(shape) : null

  const midis = mode === "board"
    ? fromBoard.sounding.map(n => n.midi).sort((a, b) => a - b)
    : stackNotes(typed.pcs.filter((p, i) => typed.pcs.indexOf(p) === i))

  function hear(style: PlayStyle) {
    playGuitar(midis, guitar, style, () => setPlaying(null))
    setPlaying(style)
  }

  function editShape(next: Shape) {
    stopGuitar()
    setShape(next)
    setLoaded(null)
    setAdded("")
  }

  function load(name: string, index = 0) {
    const m = findVoicings(name.trim())
    if (!m || m.voicings.length === 0) {
      setLoadError(`No saved shape for "${name.trim()}". Try something like Am, C or Bm7.`)
      return
    }
    const i = index % m.voicings.length
    setLoadError("")
    setMode("board")
    setTuningId("standard")
    setShape(shapeFromFingers(m.voicings[i].fingers))
    setLoaded({ name: name.trim(), index: i, count: m.voicings.length })
    setAdded("")
  }

  function addToBuilder() {
    if (!best) return
    if (saved.chords.length >= MAX) {
      setAdded(`The Song Builder is full (${MAX} chords).`)
      return
    }
    setSaved(s => ({ ...s, chords: [...s.chords, best.name].slice(0, MAX) }))
    setAdded(`Added ${best.name} to the Song Builder.`)
  }

  function clearAll() {
    setShape(EMPTY_SHAPE)
    setText("")
    setLoaded(null)
    setAdded("")
    setLoadError("")
  }

  const frettedNotes = mode === "board" && playedCount > 0

  return (
    <div className="space-y-5">
      <Panel title="How do you want to enter notes?">
        <div className="flex gap-2">
          <Chip className="flex-1" active={mode === "board"} onClick={() => setMode("board")}>Tap the fretboard</Chip>
          <Chip className="flex-1" active={mode === "type"} onClick={() => setMode("type")}>Type note names</Chip>
        </div>
      </Panel>

      {mode === "board" ? (
        <>
          <Panel title="Tuning">
            <div className="flex flex-wrap gap-2">
              {TUNINGS.map(t => (
                <Chip key={t.id} active={t.id === tuning.id} onClick={() => { setTuningId(t.id); setAdded("") }}>{t.label}</Chip>
              ))}
            </div>
            <p className="mt-3 font-mono text-sm text-purple-200">{tuning.strings}</p>
          </Panel>

          <Panel title="Start from a chord">
            <div className="flex gap-2">
              <div className="min-w-0 flex-1">
                <label htmlFor="load-chord" className="sr-only">Chord name to load</label>
                <input
                  id="load-chord"
                  className={inputClass}
                  value={loadText}
                  onChange={e => setLoadText(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && loadText.trim()) load(loadText) }}
                  placeholder="Am7, F, Bm..."
                  autoCapitalize="characters"
                  autoCorrect="off"
                  spellCheck={false}
                />
              </div>
              <BigButton className="shrink-0" onClick={() => loadText.trim() && load(loadText)}>Load</BigButton>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {QUICK_CHORDS.map(c => (
                <Chip key={c} onClick={() => { setLoadText(c); load(c) }}>{c}</Chip>
              ))}
            </div>
            {loadError && <p role="alert" className="mt-3 text-sm text-red-300">{loadError}</p>}
            {loaded && (
              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="text-sm text-white/80">Showing {loaded.name}, shape {loaded.index + 1} of {loaded.count}.</p>
                {loaded.count > 1 && <Chip onClick={() => load(loaded.name, loaded.index + 1)}>Next shape</Chip>}
              </div>
            )}
          </Panel>

          <Panel title="Fretboard">
            <Hint>Tap a fret to place a note. Tap it again to clear. Tap the top of a string to switch between muted (×) and open (○).</Hint>
            <div className="mt-3">
              <Fretboard shape={shape} tuning={tuning.midi} onChange={editShape} />
            </div>
            <div className="mt-3">
              <Chip onClick={clearAll}>Clear the board</Chip>
            </div>
          </Panel>
        </>
      ) : (
        <Panel title="Note names">
          <label htmlFor="note-text" className="mb-2 block text-sm text-purple-200">
            Type the lowest note first, then the rest. Use # for sharp and b for flat.
          </label>
          <input
            id="note-text"
            className={inputClass}
            value={text}
            onChange={e => { setText(e.target.value); setAdded("") }}
            placeholder="E G B D"
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck={false}
          />
          {typed.bad.length > 0 && (
            <p role="alert" className="mt-3 text-sm text-red-300">
              Not a note: {typed.bad.join(", ")}. Use letters A to G, with # or b.
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            {EXAMPLE_NOTES.map(n => (
              <Chip key={n} onClick={() => { setText(n); setAdded("") }}>{n}</Chip>
            ))}
          </div>
          {text && (
            <div className="mt-3">
              <Chip onClick={clearAll}>Clear</Chip>
            </div>
          )}
        </Panel>
      )}

      <div
        role="status"
        aria-live="polite"
        className="sticky bottom-3 z-10 rounded-2xl border border-amber-400/70 bg-slate-900/95 px-4 py-3 shadow-xl backdrop-blur"
      >
        {best ? (
          <>
            <p className="flex flex-wrap items-baseline gap-x-3">
              <span className="sr-only">This chord is </span>
              <span className="text-4xl font-extrabold leading-tight text-amber-300">{best.name}</span>
              <span className="text-sm text-white/85">
                {best.long}
                {best.slash && `, with ${best.bassName} in the bass`}
              </span>
            </p>
          </>
        ) : pcs.length === 0 ? (
          <p className="text-base text-white/85">
            {mode === "board" ? "Tap the fretboard to place notes. The chord name shows up here." : "Type at least two notes. The chord name shows up here."}
          </p>
        ) : pcs.length === 1 ? (
          <p className="text-base text-white/85">One note so far ({noteName(pcs[0], false)}). Add another to name the chord.</p>
        ) : (
          <>
            <p className="text-xl font-bold text-white">No standard name for these notes</p>
            <p className="text-sm text-white/80">
              {pcs.map(p => noteName(p, false)).join(" ")}
              {pcs.length <= 2 ? " could be part of a bigger chord. See below." : " do not spell a common chord."}
            </p>
          </>
        )}
      </div>

      {best && (
        <Panel title="Notes in this chord">
          <ul className="flex flex-wrap gap-2">
            {best.notes.map(n => (
              <li key={n.pc} className="flex min-w-16 flex-col items-center rounded-xl border border-white/20 bg-white/10 px-3 py-2">
                <span className="text-xl font-extrabold text-white">{n.name}</span>
                <span className="text-xs font-semibold text-purple-200">{n.degree === "1" ? "root" : n.degree}</span>
              </li>
            ))}
          </ul>
          {best.omitsFifth && <p className="mt-3 text-sm text-white/80">{best.reason}</p>}
          {best.slash && (
            <p className="mt-3 text-sm text-white/80">
              The lowest note is {best.bassName}, not the root. If the bass does not matter to you, call it {best.name.split("/")[0]}.
            </p>
          )}
          {mode === "type" && <p className="mt-3 text-sm text-white/80">The first note you typed ({noteName(typed.pcs[0], false)}) is treated as the bass.</p>}
        </Panel>
      )}

      {best && frettedNotes && (
        <Panel title="Your shape">
          <div className="flex flex-col items-center gap-3">
            {standard && playedCount >= 2 ? (
              <ChordDiagram chordName={best.name} fingers={shape.map(f => (f === null ? "x" : f))} size="medium" />
            ) : (
              <p className="text-sm text-white/80">The board above is the diagram for this tuning ({tuning.strings}).</p>
            )}
            <p className="flex flex-wrap items-center justify-center gap-2 text-sm">
              {kind && <span className="rounded px-2 py-1 font-bold bg-white/10 text-white/90">{kind}</span>}
              {known && <span className="rounded bg-emerald-400/20 px-2 py-1 font-bold text-emerald-200">Same as the saved {known.name} shape ({known.position})</span>}
            </p>
          </div>
        </Panel>
      )}

      {matches.length > 1 && (
        <Panel title="Also called">
          <ul className="space-y-2">
            {matches.slice(1).map(m => (
              <li key={m.name} className="flex items-baseline justify-between gap-3 border-b border-white/10 pb-2 last:border-0 last:pb-0">
                <span className="text-lg font-bold text-white">{m.name}</span>
                <span className="text-right text-sm text-white/75">
                  {m.long}
                  {m.slash && `, bass ${m.bassName}`}
                  {m.omitsFifth && ", no 5th"}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-purple-200">Same notes, different names. The first one is the most likely.</p>
        </Panel>
      )}

      {near.length > 0 && (
        <Panel title="Closest names">
          <ul className="space-y-2">
            {near.map(c => (
              <li key={c.match.name} className="flex items-baseline justify-between gap-3">
                <span className="text-lg font-bold text-white">{c.match.name}</span>
                <span className="text-right text-sm text-white/75">if you leave out {c.dropped}</span>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      {finishers.length > 0 && (
        <Panel title="These notes could be part of">
          <ul className="space-y-2">
            {finishers.map(f => (
              <li key={f.chord} className="flex items-baseline justify-between gap-3">
                <span className="text-lg font-bold text-white">{f.chord}</span>
                <span className="text-right text-sm text-white/75">add {f.adds}</span>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      {midis.length > 0 && (
        <Panel title="Hear it">
          <div className="flex gap-2">
            <BigButton className="flex-1" onClick={() => hear("strum")}>{playing === "strum" ? "Playing..." : "Strum it"}</BigButton>
            <BigButton className="flex-1" tone="ghost" onClick={() => hear("notes")}>{playing === "notes" ? "Playing..." : "Note by note"}</BigButton>
          </div>
          <GuitarTonePicker className="mt-3" />
          <p role="status" className="mt-3 text-sm text-purple-200">
            {sound === "samples" ? "Playing real guitar samples." : sound === "loading" ? "Loading the guitar sound. A simple plucked tone plays until it arrives." : "Playing a simple plucked tone. Real guitar samples load on your first tap if you are online."}
          </p>
        </Panel>
      )}

      {best && (
        <Panel title="Use it">
          <div className="flex flex-col gap-3">
            <BigButton onClick={addToBuilder}>Add {best.name} to the Song Builder</BigButton>
            {added && (
              <p role="status" className="text-sm text-emerald-300">
                {added}{" "}
                {added.startsWith("Added") && <Link href="/jam/builder" className="font-bold underline">Open the Song Builder</Link>}
              </p>
            )}
            <ChordTap chord={best.name} className="min-h-14 w-full border border-white/25 bg-white/10 px-5 text-lg font-bold text-white">
              How to play {best.name}
            </ChordTap>
          </div>
        </Panel>
      )}
    </div>
  )
}
