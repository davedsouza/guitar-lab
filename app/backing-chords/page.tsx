"use client"

import React, { useState } from "react"
import Link from "next/link"
import ChordDiagram from "@/components/ChordDiagram"
import { CHORD_VOICINGS } from "@/lib/chordShapes"

type Tab = "how-it-works" | "pentatonic" | "major" | "blues" | "dorian" | "mixolydian" | "phrygian" | "lydian-aeolian" | "locrian" | "practice"

const TABS: { id: Tab; label: string }[] = [
  { id: "how-it-works",   label: "How It Works" },
  { id: "pentatonic",     label: "Pentatonic" },
  { id: "major",          label: "Major" },
  { id: "blues",          label: "Blues" },
  { id: "dorian",         label: "Dorian" },
  { id: "mixolydian",     label: "Mixolydian" },
  { id: "phrygian",       label: "Phrygian" },
  { id: "lydian-aeolian", label: "Lydian & Aeolian" },
  { id: "locrian",        label: "Locrian" },
  { id: "practice",       label: "Practice" },
]

function Callout({ type, children }: { type: "tip" | "warning" | "insight" | "exercise"; children: React.ReactNode }) {
  const styles = {
    tip:      "border-l-4 border-purple-500 bg-purple-500/10 text-purple-200",
    warning:  "border-l-4 border-amber-500  bg-amber-500/10  text-amber-200",
    insight:  "border-l-4 border-blue-400   bg-blue-400/10   text-blue-200",
    exercise: "border-l-4 border-green-500  bg-green-500/10  text-green-200",
  }
  const labels = { tip: "💡 Tip", warning: "⚠️ Watch Out", insight: "🔑 Key Insight", exercise: "🎸 Exercise" }
  return (
    <div className={`rounded-xl p-4 mb-4 ${styles[type]}`}>
      <p className="text-xs font-bold uppercase tracking-wider mb-1 opacity-80">{labels[type]}</p>
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  )
}

function TabBlock({ label, children }: { label: string; children: string }) {
  return (
    <div className="mb-4">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{label}</p>
      <pre className="font-mono text-green-300 bg-black/40 rounded-xl p-4 text-sm overflow-x-auto whitespace-pre leading-relaxed">
        {children}
      </pre>
    </div>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/10 border border-white/20 rounded-xl p-5 mb-4">
      <h3 className="text-white font-bold mb-3">{title}</h3>
      {children}
    </div>
  )
}

// ─── Chord progression display pill ──────────────────────────────────────────
function ChordProg({ chords, label }: { chords: string[]; label?: string }) {
  return (
    <div className="mb-3">
      {label && <p className="text-purple-400 text-xs mb-2">{label}</p>}
      <div className="flex items-center gap-2 flex-wrap">
        {chords.map((c, i) => (
          <React.Fragment key={i}>
            <span className="bg-purple-600/30 border border-purple-500/40 text-white font-bold rounded-lg px-3 py-1.5 text-sm">
              {c}
            </span>
            {i < chords.length - 1 && <span className="text-purple-500 text-xs">→</span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

// ─── Mode header banner ───────────────────────────────────────────────────────
function ModeHeader({
  name, scale, character, activatingChord, color,
}: {
  name: string; scale: string; character: string; activatingChord: string; color: string
}) {
  return (
    <div className={`bg-white/10 border-l-4 ${color} rounded-xl p-5 mb-6`}>
      <h2 className="text-2xl font-bold text-white mb-1">{name}</h2>
      <p className="text-slate-300 text-sm font-mono mb-2">{scale}</p>
      <p className="text-purple-200 text-sm mb-2"><span className="text-white font-semibold">Sound: </span>{character}</p>
      <p className="text-amber-300 text-sm"><span className="text-white font-semibold">The activating chord: </span>{activatingChord}</p>
    </div>
  )
}

// ─── Key Explorer shared component ───────────────────────────────────────────
const CHROMATIC = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const

function noteAt(rootIdx: number, semitones: number): string {
  return CHROMATIC[(rootIdx + semitones) % 12]
}

type ExplorerMode = "pentatonic-minor" | "pentatonic-major" | "dorian" | "mixolydian" | "phrygian" | "lydian" | "aeolian" | "major" | "blues" | "locrian"

interface ChordEntry { name: string; root: string; quality: string; role: string }

const MODE_INTERVALS: Record<ExplorerMode, { semitones: number[]; labels: string[]; characteristic?: number }> = {
  "pentatonic-minor": { semitones: [0, 3, 5, 7, 10],    labels: ["Root", "♭3", "4",  "5",  "♭7"] },
  "pentatonic-major": { semitones: [0, 2, 4, 7, 9],     labels: ["Root", "2",  "3",  "5",  "6"] },
  "dorian":           { semitones: [0, 2, 3, 5, 7, 9, 10],  labels: ["1", "2", "♭3", "4",  "5",  "6",  "♭7"], characteristic: 5 },
  "mixolydian":       { semitones: [0, 2, 4, 5, 7, 9, 10],  labels: ["1", "2", "3",  "4",  "5",  "6",  "♭7"], characteristic: 6 },
  "phrygian":         { semitones: [0, 1, 3, 5, 7, 8, 10],  labels: ["1", "♭2","♭3", "4",  "5",  "♭6", "♭7"], characteristic: 1 },
  "lydian":           { semitones: [0, 2, 4, 6, 7, 9, 11],  labels: ["1", "2", "3",  "#4", "5",  "6",  "7"],  characteristic: 3 },
  "aeolian":          { semitones: [0, 2, 3, 5, 7, 8, 10],  labels: ["1", "2", "♭3", "4",  "5",  "♭6", "♭7"], characteristic: 5 },
  "major":            { semitones: [0, 2, 4, 5, 7, 9, 11],  labels: ["1", "2", "3",  "4",  "5",  "6",  "7"] },
  "blues":            { semitones: [0, 3, 5, 6, 7, 10],     labels: ["Root", "♭3", "4", "♭5", "5", "♭7"], characteristic: 3 },
  "locrian":          { semitones: [0, 1, 3, 5, 6, 8, 10],  labels: ["1", "♭2", "♭3", "4", "♭5", "♭6", "♭7"], characteristic: 4 },
}

function getGroups(mode: ExplorerMode, ri: number): Record<string, ChordEntry[]> {
  const n = (s: number) => noteAt(ri, s)
  if (mode === "pentatonic-minor") return {
    "Rock / Minor": [
      { name: `${n(0)}m`,  root: n(0),  quality: "Minor",        role: "i — home" },
      { name: n(10),        root: n(10), quality: "Major",        role: "♭VII — lift & drive" },
      { name: n(9),         root: n(9),  quality: "Major",        role: "♭VI — melancholy" },
      { name: n(3),         root: n(3),  quality: "Major",        role: "♭III — brightness" },
      { name: `${n(5)}m`,   root: n(5),  quality: "Minor",        role: "iv — dark pull" },
    ],
    "Blues / Dominant": [
      { name: `${n(0)}7`,   root: n(0),  quality: "Dominant 7th", role: "I7 — home (12-bar)" },
      { name: `${n(5)}7`,   root: n(5),  quality: "Dominant 7th", role: "IV7 — 12-bar IV" },
      { name: `${n(7)}7`,   root: n(7),  quality: "Dominant 7th", role: "V7 — tension" },
    ],
  }
  if (mode === "pentatonic-major") return {
    "Country / Pop": [
      { name: n(0),          root: n(0),  quality: "Major",  role: "I — bright home" },
      { name: n(5),          root: n(5),  quality: "Major",  role: "IV — lift" },
      { name: n(7),          root: n(7),  quality: "Major",  role: "V — tension" },
      { name: `${n(9)}m`,    root: n(9),  quality: "Minor",  role: "vi — relative minor" },
    ],
    "Rock": [
      { name: n(0),          root: n(0),  quality: "Major",  role: "I — punchy home" },
      { name: n(5),          root: n(5),  quality: "Major",  role: "IV — classic rock" },
      { name: n(7),          root: n(7),  quality: "Major",  role: "V — driving" },
      { name: n(10),         root: n(10), quality: "Major",  role: "♭VII — blues edge" },
    ],
  }
  if (mode === "dorian") return {
    "Dorian Vamps": [
      { name: `${n(0)}m`,    root: n(0),  quality: "Minor",  role: "i — home" },
      { name: n(5),          root: n(5),  quality: "Major",  role: "IV — activates Dorian ✦" },
      { name: n(10),         root: n(10), quality: "Major",  role: "♭VII — movement" },
    ],
    "Extended": [
      { name: `${n(0)}m`,    root: n(0),  quality: "Minor",  role: "i" },
      { name: n(10),         root: n(10), quality: "Major",  role: "♭VII" },
      { name: n(5),          root: n(5),  quality: "Major",  role: "IV ✦" },
      { name: n(3),          root: n(3),  quality: "Major",  role: "♭III" },
    ],
  }
  if (mode === "mixolydian") return {
    "Mixolydian Vamps": [
      { name: n(0),          root: n(0),  quality: "Major",        role: "I — home" },
      { name: n(10),         root: n(10), quality: "Major",        role: "♭VII — activates Mixolydian ✦" },
      { name: n(5),          root: n(5),  quality: "Major",        role: "IV — classic rock" },
    ],
    "Blues-Rock": [
      { name: `${n(0)}7`,    root: n(0),  quality: "Dominant 7th", role: "I7 — dominant home" },
      { name: n(10),         root: n(10), quality: "Major",        role: "♭VII ✦" },
      { name: n(5),          root: n(5),  quality: "Major",        role: "IV" },
    ],
  }
  if (mode === "phrygian") return {
    "Phrygian Vamps": [
      { name: `${n(0)}m`,    root: n(0),  quality: "Minor",  role: "i — home" },
      { name: n(1),          root: n(1),  quality: "Major",  role: "♭II — activates Phrygian ✦" },
      { name: n(10),         root: n(10), quality: "Major",  role: "♭VII" },
      { name: n(3),          root: n(3),  quality: "Major",  role: "♭III" },
    ],
    "Andalusian Cadence": [
      { name: `${n(9)}m`,    root: n(9),  quality: "Minor",  role: "iv (start)" },
      { name: n(8),          root: n(8),  quality: "Major",  role: "♭VI" },
      { name: n(1),          root: n(1),  quality: "Major",  role: "♭II ✦" },
      { name: n(0),          root: n(0),  quality: "Major",  role: "I (resolve)" },
    ],
  }
  if (mode === "lydian") return {
    "Lydian Vamps": [
      { name: n(0),          root: n(0),  quality: "Major",  role: "I — home" },
      { name: n(2),          root: n(2),  quality: "Major",  role: "II — activates Lydian ✦" },
      { name: `${n(9)}m`,    root: n(9),  quality: "Minor",  role: "vi — depth" },
      { name: n(7),          root: n(7),  quality: "Major",  role: "V" },
    ],
  }
  // aeolian
  if (mode === "aeolian") return {
    "Aeolian Vamps": [
      { name: `${n(0)}m`,    root: n(0),  quality: "Minor",  role: "i — home" },
      { name: n(10),         root: n(10), quality: "Major",  role: "♭VII — searching" },
      { name: n(9),          root: n(9),  quality: "Major",  role: "♭VI — sadness ✦" },
      { name: n(3),          root: n(3),  quality: "Major",  role: "♭III — lift" },
      { name: `${n(5)}m`,    root: n(5),  quality: "Minor",  role: "iv — darker pull" },
    ],
  }
  if (mode === "major") return {
    "Major Key Core": [
      { name: n(0),          root: n(0),  quality: "Major",      role: "I — home" },
      { name: n(5),          root: n(5),  quality: "Major",      role: "IV — lift" },
      { name: n(7),          root: n(7),  quality: "Major",      role: "V — tension" },
      { name: `${n(9)}m`,    root: n(9),  quality: "Minor",      role: "vi — relative minor" },
    ],
    "Full Diatonic": [
      { name: n(0),            root: n(0),  quality: "Major",      role: "I" },
      { name: `${n(2)}m`,      root: n(2),  quality: "Minor",      role: "ii" },
      { name: `${n(4)}m`,      root: n(4),  quality: "Minor",      role: "iii" },
      { name: n(5),            root: n(5),  quality: "Major",      role: "IV" },
      { name: n(7),            root: n(7),  quality: "Major",      role: "V" },
      { name: `${n(9)}m`,      root: n(9),  quality: "Minor",      role: "vi" },
      { name: `${n(11)}dim`,   root: n(11), quality: "Diminished", role: "vii°" },
    ],
  }
  if (mode === "blues") return {
    "12-Bar Blues": [
      { name: `${n(0)}7`, root: n(0), quality: "Dominant 7th", role: "I7 — home" },
      { name: `${n(5)}7`, root: n(5), quality: "Dominant 7th", role: "IV7 — lift" },
      { name: `${n(7)}7`, root: n(7), quality: "Dominant 7th", role: "V7 — tension" },
    ],
    "Rock / Blues": [
      { name: n(0),  root: n(0),  quality: "Major", role: "I — root" },
      { name: n(5),  root: n(5),  quality: "Major", role: "IV — lift" },
      { name: n(7),  root: n(7),  quality: "Major", role: "V — drive" },
      { name: n(10), root: n(10), quality: "Major", role: "♭VII — rock edge" },
    ],
  }
  // locrian
  return {
    "Locrian Vamps": [
      { name: `${n(0)}dim`, root: n(0),  quality: "Diminished", role: "i° — tense home" },
      { name: n(1),          root: n(1),  quality: "Major",      role: "♭II — escape ✦" },
      { name: n(10),         root: n(10), quality: "Major",      role: "♭VII" },
      { name: n(3),          root: n(3),  quality: "Major",      role: "♭III" },
    ],
  }
}

function KeyChordExplorer({ mode, title = "Try It In Your Key" }: { mode: ExplorerMode; title?: string }) {
  const [key, setKey] = useState("A")
  const [selected, setSelected] = useState<ChordEntry | null>(null)
  const [voicingIdx, setVoicingIdx] = useState(0)

  const ri = CHROMATIC.indexOf(key as typeof CHROMATIC[number])
  const groups = getGroups(mode, ri)
  const voicings = selected ? CHORD_VOICINGS[selected.root]?.[selected.quality] : null
  const voicing = voicings?.[voicingIdx] ?? null

  function pick(chord: ChordEntry) {
    if (selected?.name === chord.name && selected?.quality === chord.quality) {
      setSelected(null)
    } else {
      setSelected(chord)
      setVoicingIdx(0)
    }
  }

  return (
    <div className="mt-8 border-t border-white/10 pt-6">
      <p className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-4">{title}</p>

      {/* Key selector */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {CHROMATIC.map(k => (
          <button
            key={k}
            onClick={() => { setKey(k); setSelected(null) }}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all min-w-[36px] text-center ${
              key === k ? "bg-amber-500 text-black" : "bg-white/10 text-purple-300 hover:bg-white/20"
            }`}
          >
            {k}
          </button>
        ))}
      </div>

      {/* Scale notes */}
      {(() => {
        const { semitones, labels, characteristic } = MODE_INTERVALS[mode]
        return (
          <div className="mb-5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Scale Notes</p>
            <div className="flex flex-wrap gap-2">
              {semitones.map((s, i) => {
                const note = noteAt(ri, s)
                const isRoot = i === 0
                const isChar = characteristic !== undefined && i === characteristic
                return (
                  <div key={i} className="text-center">
                    <div className={`px-3 py-1.5 rounded-lg text-sm font-bold ${
                      isRoot  ? "bg-amber-500 text-black" :
                      isChar  ? "bg-purple-500 text-white" :
                                "bg-white/15 text-white"
                    }`}>
                      {note}
                    </div>
                    <p className={`text-xs mt-0.5 ${isRoot ? "text-amber-400" : isChar ? "text-purple-400" : "text-slate-500"}`}>
                      {labels[i]}
                    </p>
                  </div>
                )
              })}
            </div>
            {characteristic !== undefined && (
              <p className="text-xs text-purple-400 mt-2">
                <span className="bg-purple-500 text-white rounded px-1.5 py-0.5 text-xs font-bold mr-1">{noteAt(ri, semitones[characteristic])}</span>
                is the characteristic note — the note that defines this mode's sound
              </p>
            )}
          </div>
        )
      })()}

      {/* Chord groups */}
      {Object.entries(groups).map(([groupName, chords]) => (
        <div key={groupName} className="mb-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{groupName}</p>
          <div className="flex flex-wrap gap-2">
            {chords.map(chord => {
              const isSelected = selected?.name === chord.name && selected?.quality === chord.quality
              return (
                <button
                  key={chord.name + chord.quality}
                  onClick={() => pick(chord)}
                  className={`px-3 py-2 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "bg-purple-600 border-purple-400"
                      : "bg-white/10 border-white/20 hover:bg-white/20"
                  }`}
                >
                  <p className="text-white font-bold text-sm">{chord.name}</p>
                  <p className={`text-xs mt-0.5 ${isSelected ? "text-purple-200" : "text-purple-400"}`}>{chord.role}</p>
                </button>
              )
            })}
          </div>
        </div>
      ))}

      {/* Chord diagram */}
      {selected && (
        <div className="bg-white/10 border border-purple-500/40 rounded-2xl p-5 mt-3">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-white font-bold text-lg">{selected.name}</p>
              <p className="text-purple-300 text-xs">{selected.quality} · {selected.role}</p>
            </div>
            <button onClick={() => setSelected(null)} className="text-purple-400 hover:text-white text-xl">✕</button>
          </div>

          {voicings && voicings.length > 0 ? (
            <>
              {voicings.length > 1 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {voicings.map((v, i) => (
                    <button
                      key={i}
                      onClick={() => setVoicingIdx(i)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                        voicingIdx === i
                          ? "bg-purple-600 border-purple-400 text-white"
                          : "bg-white/10 border-white/20 text-purple-300 hover:bg-white/20"
                      }`}
                    >
                      {v.position}
                      <span className={`ml-1.5 px-1.5 py-0.5 rounded ${
                        v.difficulty === "beginner" ? "bg-green-500/30 text-green-300" : "bg-amber-500/30 text-amber-300"
                      }`}>
                        {v.difficulty}
                      </span>
                    </button>
                  ))}
                </div>
              )}
              <div className="flex gap-6 items-start flex-wrap">
                <ChordDiagram chordName={selected.name} fingers={voicing!.fingers} size="large" />
                <div className="flex-1 min-w-[140px]">
                  <p className="text-white font-semibold text-sm mb-1">{voicing!.position}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full inline-block mb-4 border ${
                    voicing!.difficulty === "beginner"
                      ? "bg-green-500/20 text-green-300 border-green-500/30"
                      : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                  }`}>
                    {voicing!.difficulty}
                  </span>
                  <div className="space-y-1">
                    {(['E','A','D','G','B','e'] as const).map((s, i) => {
                      const f = voicing!.fingers[i]
                      return (
                        <div key={s} className="flex items-center gap-2 text-xs">
                          <span className="w-4 text-purple-400 font-mono">{s}</span>
                          <span className={f === 'x' ? 'text-red-400' : f === 0 ? 'text-green-400' : 'text-white'}>
                            {f === 'x' ? '✕ muted' : f === 0 ? '○ open' : `fret ${f}`}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p className="text-purple-400 text-sm">No shape available for this chord.</p>
          )}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
function HowItWorksTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Scale → Backing Chords: How It Works</h2>
      <p className="text-purple-200 mb-6">
        You already know which scale to use over a chord. This is the reverse: you&apos;ve chosen a scale or mode you want to play in —
        now what chord progression should be underneath you to make that scale sound its best?
      </p>

      <Callout type="insight">
        Every scale has one or two chords that <strong className="text-white">&quot;activate&quot; its character</strong> — notes in that chord that only appear in that mode, not in the plain major or minor scale.
        Those chords are the signal to the listener that something specific is happening.
      </Callout>

      <Card title="The Two-Way Relationship">
        <div className="space-y-4 text-sm">
          <div className="flex gap-4">
            <div className="flex-1 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
              <p className="text-blue-300 font-semibold mb-2">Diatonic Chords (forward)</p>
              <p className="text-purple-200 text-xs">Scale → which chords live in it</p>
              <p className="text-slate-400 text-xs mt-1">e.g. G major scale contains G Am Bm C D Em F#dim</p>
            </div>
            <div className="flex-1 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
              <p className="text-amber-300 font-semibold mb-2">Backing Chords (reverse)</p>
              <p className="text-purple-200 text-xs">Scale/mode → what progressions bring out its sound</p>
              <p className="text-slate-400 text-xs mt-1">e.g. Dorian sounds best over i – IV (Am – D)</p>
            </div>
          </div>
        </div>
      </Card>

      <Card title="Why the Backing Chords Matter So Much">
        <p className="text-purple-200 text-sm mb-4">
          Try this: play the exact same A minor pentatonic lick over these two progressions and hear the difference:
        </p>
        <div className="space-y-3">
          <div>
            <ChordProg chords={["Am", "G", "F", "G"]} label="Progression 1 — Am backing (Aeolian feel)" />
            <p className="text-purple-300 text-xs ml-1">→ Sounds dark, melancholic, classic rock ballad</p>
          </div>
          <div>
            <ChordProg chords={["A7", "D7", "E7"]} label="Progression 2 — Blues backing (dominant feel)" />
            <p className="text-purple-300 text-xs ml-1">→ Sounds gritty, bluesy, completely different energy</p>
          </div>
        </div>
        <p className="text-purple-200 text-sm mt-4">
          Same scale. Same frets. Completely different character — because the chords underneath define the harmonic context.
        </p>
      </Card>

      <Card title="The Key Principle: The Characteristic Note">
        <p className="text-purple-200 text-sm mb-3">
          Each mode differs from the plain major or minor scale by one or two notes. Those notes are its <strong className="text-white">characteristic notes</strong>.
          The backing chord needs to <strong className="text-white">contain or imply</strong> that characteristic note to activate the mode&apos;s sound.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[420px]">
            <thead>
              <tr className="text-purple-400 border-b border-white/10 text-xs">
                <th className="pb-2 text-left">Mode</th>
                <th className="pb-2 text-left">Characteristic note</th>
                <th className="pb-2 text-left">Activating chord</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {[
                { mode: "Dorian",     note: "Natural 6th (e.g. F# in Am)",  chord: "IV major (D in Am)" },
                { mode: "Mixolydian", note: "Flat 7th (e.g. F in G)",        chord: "♭VII major (F in G)" },
                { mode: "Phrygian",   note: "Flat 2nd (e.g. F in Em)",       chord: "♭II major (F in Em)" },
                { mode: "Lydian",     note: "Sharp 4th (e.g. B in F)",       chord: "II major (G in F)" },
                { mode: "Aeolian",    note: "Flat 6th (e.g. F in Am)",       chord: "♭VI major (F in Am)" },
              ].map(r => (
                <tr key={r.mode} className="text-sm">
                  <td className="py-2 text-white font-semibold">{r.mode}</td>
                  <td className="py-2 text-amber-300 text-xs">{r.note}</td>
                  <td className="py-2 text-green-300 text-xs">{r.chord}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Callout type="tip">
        The simplest approach: use a two-chord vamp. One chord establishes home (the tonic), the second chord introduces the characteristic note. That&apos;s all you need to hear the mode clearly.
      </Callout>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
function PentatonicTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Pentatonic Backing Chords</h2>
      <p className="text-purple-200 mb-6">
        The minor pentatonic is the most flexible scale on the guitar — it works over multiple chord types without clashing.
        Knowing exactly which chords it loves (and which it merely tolerates) makes your backing choices intentional, not accidental.
      </p>

      <Card title="Minor Pentatonic — What It Contains (A minor)">
        <p className="text-purple-200 text-sm mb-3">
          A minor pentatonic = <span className="font-mono text-green-300">A C D E G</span> (just 5 notes — no 2nd, no 6th).
          Because it skips those two notes, it avoids the conflicts that make major/minor scale choice matter.
          This is why it &quot;works everywhere&quot;.
        </p>
      </Card>

      <Card title="Chords That Sound Great Under A Minor Pentatonic">
        <div className="space-y-4">
          {[
            {
              type: "Minor chords",
              chords: ["Am", "Dm", "Em"],
              why: "The pentatonic root (A) sits perfectly over Am. Dm and Em are diatonic to A minor — all pentatonic notes are safe.",
              feel: "Dark, melancholic, rock ballad",
              color: "border-blue-500",
            },
            {
              type: "Dominant 7 chords",
              chords: ["A7", "D7", "E7"],
              why: "The ♭3 (C) in the pentatonic creates that classic bluesy clash over a dominant chord. It's intentional tension — the blue note effect.",
              feel: "Bluesy, gritty, expressive",
              color: "border-amber-500",
            },
            {
              type: "12-bar blues (all three chords)",
              chords: ["A7", "D7", "E7"],
              why: "The minor pentatonic works over ALL THREE dominant 7 chords in a blues. You never need to switch — it sounds right throughout.",
              feel: "Full blues vocabulary",
              color: "border-red-500",
            },
            {
              type: "Major chords (power move)",
              chords: ["A", "C", "G", "D"],
              why: "The ♭3 (C) against an A major chord creates deliberate tension. Used in rock and southern rock — you're 'bending' the major third flat intentionally.",
              feel: "Rock edge, aggressive, expressive",
              color: "border-purple-500",
            },
          ].map(g => (
            <div key={g.type} className={`border-l-4 ${g.color} bg-white/5 rounded-xl p-4`}>
              <p className="text-white font-semibold mb-2">{g.type}</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {g.chords.map(c => (
                  <span key={c} className="bg-purple-600/30 border border-purple-500/40 text-white font-bold rounded-lg px-3 py-1 text-xs">{c}</span>
                ))}
              </div>
              <p className="text-purple-200 text-xs mb-1">{g.why}</p>
              <p className="text-amber-300 text-xs">Feel: {g.feel}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Best Backing Progressions for A Minor Pentatonic">
        <div className="space-y-4">
          <ChordProg chords={["Am", "G", "F", "G"]} label="Classic rock/pop — dark, searching" />
          <ChordProg chords={["A7", "D7", "A7", "E7"]} label="12-bar blues — the natural home" />
          <ChordProg chords={["Am", "F", "C", "G"]} label="Pop minor — emotional, radio-friendly" />
          <ChordProg chords={["Am", "Am", "Am", "Am"]} label="The pure vamp — just Am, maximum pentatonic freedom" />
          <ChordProg chords={["Em", "Am", "D", "Am"]} label="Minor shuffle — works beautifully in E too" />
        </div>
      </Card>

      <TabBlock label="Solo demonstration — same pentatonic lick over 3 different backings">
{`Your lick (A minor pentatonic):
e|--8-5-8-5--------------|
B|----------8-6-5--------|
G|----------------5-7-5--|

Over Am (minor):   Dark, moody, restrained
Over A7 (blues):   Gritty, expressive — the ♭3 fights the major 3rd
Over A  (major):   Aggressive tension — classic rock attitude

Same 9 notes. Three completely different emotional worlds.`}
      </TabBlock>

      <Card title="Major Pentatonic — Different Backing Needs">
        <p className="text-purple-200 text-sm mb-3">
          The major pentatonic (e.g. A major pent = A B C# E F#) is brighter and wants major chord backing:
        </p>
        <div className="space-y-2">
          <ChordProg chords={["A", "D", "E"]} label="Country / I IV V — the classic country sound" />
          <ChordProg chords={["A", "E", "D", "A"]} label="Rock major — bright, driving, triumphant" />
          <ChordProg chords={["A", "F#m", "D", "E"]} label="Pop major — the Nashville feel" />
        </div>
        <Callout type="tip">
          Use the <strong className="text-white">relative major pentatonic</strong> trick: A minor pentatonic = C major pentatonic (same 5 notes). So when a song is in C major, you can also reach for A minor pentatonic and it fits perfectly.
        </Callout>
      </Card>

      <KeyChordExplorer mode="pentatonic-minor" title="Minor Pentatonic — Pick Your Key" />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
function DorianTab() {
  return (
    <div>
      <ModeHeader
        name="Dorian — Backing Chords"
        scale="A Dorian: A B C D E F# G  (minor + natural 6th)"
        character="Jazzy, sophisticated minor. Cool but not sad."
        activatingChord="The IV major chord (D major in A Dorian) — contains F#, the characteristic note"
        color="border-blue-500"
      />

      <Callout type="insight">
        The difference between A Dorian and A Aeolian (natural minor) is one note: F# vs F natural.
        To make your scale <em>sound</em> Dorian rather than plain minor, the backing chord must contain or imply <strong className="text-white">F#</strong>.
        That&apos;s exactly what a D major chord does — D F# A.
      </Callout>

      <Card title="The Dorian Signature: i – IV">
        <p className="text-purple-200 text-sm mb-4">
          The defining Dorian movement is a minor i chord followed by a major IV chord. This single pairing signals Dorian immediately.
        </p>
        <ChordProg chords={["Am", "D"]} label="The essential Dorian vamp (A Dorian)" />
        <p className="text-purple-300 text-xs mb-4">Play this on loop and solo with A Dorian. The D major chord (containing F#) activates the mode.</p>
        <ChordProg chords={["Em", "A"]} label="E Dorian vamp (used in Oye Como Va, So What)" />
        <ChordProg chords={["Dm", "G"]} label="D Dorian vamp (Miles Davis 'So What' key)" />
      </Card>

      <Card title="Full Dorian Progressions">
        <div className="space-y-4">
          <div>
            <ChordProg chords={["Am", "D", "Am", "D"]} label="Minimal — pure i–IV loop" />
            <p className="text-purple-300 text-xs">Santana&apos;s favourite territory. Endlessly repeatable.</p>
          </div>
          <div>
            <ChordProg chords={["Am", "G", "D", "Am"]} label="Three chords — adds ♭VII for movement" />
            <p className="text-purple-300 text-xs">The G (♭VII) adds motion. Still clearly Dorian thanks to the D chord.</p>
          </div>
          <div>
            <ChordProg chords={["Am7", "D", "Fmaj7", "E"]} label="Jazz Dorian — more colour chords" />
            <p className="text-purple-300 text-xs">Used in jazz-fusion contexts. The Am7 and D are the Dorian anchors.</p>
          </div>
          <div>
            <ChordProg chords={["Am", "D", "G", "Bm"]} label="Extended Dorian loop" />
            <p className="text-purple-300 text-xs">All chords from A Dorian (same notes as G major). D major keeps the Dorian feel.</p>
          </div>
        </div>
      </Card>

      <TabBlock label="Dorian — hear the F# activating over the D chord">
{`A Dorian scale:  A  B  C  D  E  F#  G
                              ↑ This note
D major chord:   D  F#  A
                    ↑ Contains it!

When you land on F# (B string fret 7) as the D chord plays:
e|-----------------------------|
B|--7-8-7-5--------------------|  ← F# lands on the D chord = Dorian activated
G|-----------7-5-4-------------|
D|------------------7-5--------|
A|-----------------------------|
E|-----------------------------|`}
      </TabBlock>

      <Card title="Classic Songs — Dorian Backing">
        <div className="space-y-2 text-sm">
          {[
            { song: "Oye Como Va",       artist: "Santana",      prog: "Am – D",    key: "A Dorian" },
            { song: "So What",           artist: "Miles Davis",  prog: "Dm – E♭m",  key: "D/E♭ Dorian" },
            { song: "Riders on the Storm",artist:"The Doors",    prog: "Em – A",     key: "E Dorian" },
            { song: "Get Lucky",         artist: "Daft Punk",    prog: "Bm – D – F#m – E", key: "B Dorian" },
          ].map(s => (
            <div key={s.song} className="border-b border-white/10 pb-2">
              <p className="text-white font-semibold">{s.song} <span className="text-purple-400 font-normal">— {s.artist}</span></p>
              <p className="text-green-300 text-xs font-mono">{s.prog}</p>
              <p className="text-purple-400 text-xs">{s.key}</p>
            </div>
          ))}
        </div>
      </Card>

      <Callout type="exercise">
        <p className="font-semibold mb-1">Dorian Vamp Exercise:</p>
        Loop Am – D (2 bars each, 80 BPM). Solo using A minor pentatonic first. Now add the F# (fret 7, B string). Hear how it snaps into Dorian when that note plays over the D chord? That single note is the difference.
      </Callout>

      <KeyChordExplorer mode="dorian" title="Dorian — Pick Your Key" />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
function MixolydianTab() {
  return (
    <div>
      <ModeHeader
        name="Mixolydian — Backing Chords"
        scale="G Mixolydian: G A B C D E F  (major + flat 7th)"
        character="Major feel but bluesy — the sound of classic rock, funk, and soul."
        activatingChord="The ♭VII major chord (F major in G Mixolydian) — contains the flat 7th"
        color="border-amber-500"
      />

      <Callout type="insight">
        Mixolydian is a major scale with a lowered 7th. To activate it, the backing needs to include a chord built on that ♭7.
        In G Mixolydian that chord is F major — and the moment F major appears, the ♭7 (F natural) signals you&apos;re not in plain G major anymore.
      </Callout>

      <Card title="The Mixolydian Signature: I – ♭VII">
        <p className="text-purple-200 text-sm mb-4">
          The defining Mixolydian move is a major I chord followed by a major ♭VII chord.
          This two-chord loop is the backbone of countless rock anthems.
        </p>
        <ChordProg chords={["G", "F"]} label="The essential Mixolydian vamp (G Mixolydian)" />
        <p className="text-purple-300 text-xs mb-4">The F chord contains F natural — that ♭7 is what makes this Mixolydian, not major.</p>
        <ChordProg chords={["A", "G"]} label="A Mixolydian vamp" />
        <ChordProg chords={["D", "C"]} label="D Mixolydian vamp (Sweet Home Alabama territory)" />
        <ChordProg chords={["E", "D"]} label="E Mixolydian vamp (classic blues-rock)" />
      </Card>

      <Card title="Full Mixolydian Progressions">
        <div className="space-y-4">
          <div>
            <ChordProg chords={["G", "F", "G", "F"]} label="Pure ♭VII loop — maximum Mixolydian" />
            <p className="text-purple-300 text-xs">The simplest and most powerful Mixolydian vamp. Nothing else needed.</p>
          </div>
          <div>
            <ChordProg chords={["G", "F", "C", "G"]} label="Adds the IV chord for more movement" />
            <p className="text-purple-300 text-xs">All three chords from G Mixolydian. Feels like a driving rock chorus.</p>
          </div>
          <div>
            <ChordProg chords={["D", "C", "G", "D"]} label="Sweet Home Alabama progression (D Mixolydian)" />
            <p className="text-purple-300 text-xs">D – C – G. All Mixolydian. The C (♭VII of D) is the key.</p>
          </div>
          <div>
            <ChordProg chords={["A7", "D7", "E7"]} label="Blues dominant — fully Mixolydian" />
            <p className="text-purple-300 text-xs">Dominant 7 chords ARE Mixolydian chords. The 12-bar blues is built on this.</p>
          </div>
        </div>
      </Card>

      <TabBlock label="Mixolydian — the ♭7 activating over the ♭VII chord">
{`G Mixolydian:    G  A  B  C  D  E  F
                                    ↑ The ♭7 (F natural)
F major chord:   F  A  C
                 ↑ Contains it!

When you land on F (high e string fret 1) as the F chord plays:
e|--1-3-1--0-1-3--1----|  ← F natural over F chord = Mixolydian confirmed
B|--1-3-1--------------|
G|---------------------|
Sounds like classic rock, NOT like plain G major`}
      </TabBlock>

      <Card title="Classic Songs — Mixolydian Backing">
        <div className="space-y-2 text-sm">
          {[
            { song: "Sweet Home Alabama",   artist: "Lynyrd Skynyrd",  prog: "D – C – G",     key: "D Mixolydian" },
            { song: "Norwegian Wood",       artist: "Beatles",          prog: "E – D",          key: "E Mixolydian" },
            { song: "Hey Joe",              artist: "Hendrix",          prog: "C – G – D – A – E", key: "E Mixolydian" },
            { song: "Brown Eyed Girl",      artist: "Van Morrison",     prog: "G – C – G – D",  key: "G Mixolydian feel" },
            { song: "Sympathy for the Devil",artist:"Rolling Stones",   prog: "E – D – A – E",  key: "E Mixolydian" },
          ].map(s => (
            <div key={s.song} className="border-b border-white/10 pb-2">
              <p className="text-white font-semibold">{s.song} <span className="text-purple-400 font-normal">— {s.artist}</span></p>
              <p className="text-green-300 text-xs font-mono">{s.prog}</p>
              <p className="text-purple-400 text-xs">{s.key}</p>
            </div>
          ))}
        </div>
      </Card>

      <Callout type="exercise">
        <p className="font-semibold mb-1">Mixolydian Vamp Exercise:</p>
        Loop G – F (2 bars each). Solo using G major pentatonic. Now add the F note (♭7) to your lines — it&apos;s on fret 1 of the high e string, fret 3 of the D string. Hear how it transforms from happy-major to bluesy-rock the moment that F appears.
      </Callout>

      <KeyChordExplorer mode="mixolydian" title="Mixolydian — Pick Your Key" />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
function PhrygianTab() {
  return (
    <div>
      <ModeHeader
        name="Phrygian — Backing Chords"
        scale="E Phrygian: E F G A B C D  (minor + flat 2nd)"
        character="Dark, menacing, Spanish, exotic. Instant tension."
        activatingChord="The ♭II major chord (F major in E Phrygian) — contains the flat 2nd"
        color="border-red-500"
      />

      <Callout type="insight">
        Phrygian&apos;s defining feature is the ♭2 — just a half step above the root. The chord built on that ♭2 (the ♭II) is the most important chord in Phrygian progressions.
        In E Phrygian that&apos;s F major. The movement Em → F is the Phrygian sound.
      </Callout>

      <Card title="The Phrygian Signature: i – ♭II">
        <p className="text-purple-200 text-sm mb-4">
          The defining Phrygian move: a minor i chord followed by a major ♭II chord.
          That half-step movement between roots is unmistakably Phrygian.
        </p>
        <ChordProg chords={["Em", "F"]} label="The essential Phrygian vamp (E Phrygian)" />
        <p className="text-purple-300 text-xs mb-4">Just two chords, one semitone apart. That&apos;s the whole Phrygian sound.</p>
        <ChordProg chords={["Am", "Bb"]} label="A Phrygian vamp" />
        <ChordProg chords={["Dm", "Eb"]} label="D Phrygian vamp" />
      </Card>

      <Card title="Full Phrygian Progressions">
        <div className="space-y-4">
          <div>
            <ChordProg chords={["Em", "F", "Em", "F"]} label="Pure Phrygian loop" />
            <p className="text-purple-300 text-xs">Flamenco, metal, surf rock. The most Spanish sound on guitar.</p>
          </div>
          <div>
            <ChordProg chords={["Em", "F", "G", "Am"]} label="Expanded Phrygian — more movement" />
            <p className="text-purple-300 text-xs">The F chord (♭II) establishes Phrygian. G and Am add colour.</p>
          </div>
          <div>
            <ChordProg chords={["Em", "F", "Em", "G"]} label="Phrygian with ♭III resolution" />
            <p className="text-purple-300 text-xs">The G (♭III) gives a moment of lift before returning to the tension.</p>
          </div>
          <div>
            <ChordProg chords={["Am", "G", "F", "E"]} label="Descending Andalusian cadence — the flamenco sequence" />
            <p className="text-purple-300 text-xs">Descends from i to V via ♭VII and ♭VI. The F and E at the end are Phrygian. Used in White Rabbit, Stairway intro.</p>
          </div>
        </div>
      </Card>

      <TabBlock label="The Andalusian cadence — classic Phrygian movement">
{`Am      G       F       E
e|--0----|--3----|--1----|--0----|
B|--1----|--3----|--1----|--0----|
G|--2----|--0----|--2----|--1----|
D|--2----|--0----|--3----|--2----|
A|--0----|--2----|--3----|--2----|
E|-------|--3----|--1----|--0----|

Descend: Am → G → F → E
The E major chord (not Em) at the end creates a V in Phrygian — strong Flamenco resolution`}
      </TabBlock>

      <Card title="Classic Songs — Phrygian Backing">
        <div className="space-y-2 text-sm">
          {[
            { song: "White Rabbit",         artist: "Jefferson Airplane", prog: "F# – G – A – Bb – B", key: "F# Phrygian feel" },
            { song: "Wherever I May Roam",  artist: "Metallica",          prog: "E – F (riff)",          key: "E Phrygian" },
            { song: "Misirlou",             artist: "Dick Dale",           prog: "Dm – E (dominant)",     key: "D Phrygian dominant" },
            { song: "Stairway intro cadence",artist:"Led Zeppelin",        prog: "Am – G – F – E",        key: "Andalusian / Phrygian" },
          ].map(s => (
            <div key={s.song} className="border-b border-white/10 pb-2">
              <p className="text-white font-semibold">{s.song} <span className="text-purple-400 font-normal">— {s.artist}</span></p>
              <p className="text-green-300 text-xs font-mono">{s.prog}</p>
              <p className="text-purple-400 text-xs">{s.key}</p>
            </div>
          ))}
        </div>
      </Card>

      <Callout type="exercise">
        <p className="font-semibold mb-1">Phrygian Vamp Exercise:</p>
        Loop Em – F (2 bars each, slow tempo — 60 BPM). Solo using E minor pentatonic first. Now deliberately play the F note (open first string, fret 1) — the ♭2. Hear how that single note creates instant Spanish tension? That&apos;s Phrygian in action.
      </Callout>

      <KeyChordExplorer mode="phrygian" title="Phrygian — Pick Your Key" />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
function LydianAeolianTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">Lydian & Aeolian — Backing Chords</h2>

      {/* LYDIAN */}
      <ModeHeader
        name="Lydian"
        scale="F Lydian: F G A B C D E  (major + sharp 4th)"
        character="Dreamy, floating, cinematic, otherworldly."
        activatingChord="The II major chord (G major in F Lydian) — contains the #4 (B natural)"
        color="border-indigo-400"
      />

      <Card title="The Lydian Signature: I – II">
        <p className="text-purple-200 text-sm mb-4">
          Lydian&apos;s characteristic note is the #4. The chord built on the 2nd degree (a major II chord, one whole step above the root) contains that #4 and activates the dreamy Lydian sound.
        </p>
        <ChordProg chords={["Fmaj7", "G"]} label="F Lydian vamp — the II major signals Lydian" />
        <p className="text-purple-300 text-xs mb-3">G major contains B natural — the #4 of F. That&apos;s what makes it float.</p>
        <ChordProg chords={["Gmaj7", "A"]} label="G Lydian vamp (Satriani's favourite key area)" />
        <ChordProg chords={["Dmaj7", "E"]} label="D Lydian vamp" />
      </Card>

      <Card title="Full Lydian Progressions">
        <div className="space-y-3">
          <div>
            <ChordProg chords={["Fmaj7", "G", "Am", "G"]} label="Film-score Lydian" />
            <p className="text-purple-300 text-xs">The Fmaj7 and G are the Lydian core. Am adds emotional depth.</p>
          </div>
          <div>
            <ChordProg chords={["D", "E", "D", "E"]} label="D Lydian minimal vamp" />
            <p className="text-purple-300 text-xs">Just I and II. Pure floating Lydian quality.</p>
          </div>
          <div>
            <ChordProg chords={["Gmaj7", "A", "Bm", "A"]} label="G Lydian — Satriani-style loop" />
            <p className="text-purple-300 text-xs">The A major chord (II of G Lydian) contains C# — the #4. Flying in a Blue Dream.</p>
          </div>
        </div>
      </Card>

      <Callout type="tip">
        Lydian sounds best over major 7 chords (Imaj7) rather than plain major triads. The maj7 interval blends with the #4 to create that open, luminous quality.
      </Callout>

      <div className="border-t border-white/10 my-8" />

      {/* AEOLIAN */}
      <ModeHeader
        name="Aeolian (Natural Minor)"
        scale="A Aeolian: A B C D E F G  (natural minor scale)"
        character="Melancholic, dark, emotional, searching."
        activatingChord="The ♭VI major chord (F major in Am) — contains the ♭6 that deepens the sadness"
        color="border-slate-400"
      />

      <Card title="The Aeolian Signature: i – ♭VII – ♭VI">
        <p className="text-purple-200 text-sm mb-4">
          Aeolian is the natural minor scale, so it&apos;s less about a single activating chord and more about the combination of ♭VII and ♭VI alongside the i chord.
          Together these three chords create the archetypal minor-key sound.
        </p>
        <ChordProg chords={["Am", "G", "F"]} label="The core Aeolian movement (A Aeolian)" />
        <p className="text-purple-300 text-xs mb-4">i – ♭VII – ♭VI. This is the most common minor progression in all of rock.</p>
        <ChordProg chords={["Em", "D", "C"]} label="E Aeolian version" />
        <ChordProg chords={["Bm", "A", "G"]} label="B Aeolian version" />
      </Card>

      <Card title="Full Aeolian Progressions">
        <div className="space-y-3">
          <div>
            <ChordProg chords={["Am", "F", "C", "G"]} label="The mega-hit progression — i ♭VI ♭III ♭VII" />
            <p className="text-purple-300 text-xs">Billions of streams. Hotel California, Stairway, countless others.</p>
          </div>
          <div>
            <ChordProg chords={["Am", "G", "F", "E"]} label="Andalusian cadence — dramatic, Spanish-influenced" />
            <p className="text-purple-300 text-xs">The E major at the end pulls hard back to Am. Flamenco and film scores.</p>
          </div>
          <div>
            <ChordProg chords={["Am", "F", "Am", "G"]} label="Simple loop — melancholic and restless" />
            <p className="text-purple-300 text-xs">The ♭VI (F) and ♭VII (G) never quite resolve — perfect for sad, searching solos.</p>
          </div>
          <div>
            <ChordProg chords={["Em", "C", "G", "D"]} label="E Aeolian — Hotel California feel" />
            <p className="text-purple-300 text-xs">Eagles used this endlessly. The C (♭VI) is the heart of its sadness.</p>
          </div>
        </div>
      </Card>

      <Card title="Aeolian vs Dorian — Choosing With the Backing Chords">
        <p className="text-purple-200 text-sm mb-3">
          Both are minor modes over the same root. The backing chords tell you which to use:
        </p>
        <div className="space-y-2 text-sm">
          {[
            { signal: "IV chord is MAJOR (e.g. D over Am)", mode: "→ Play Dorian", reason: "F# in D major = the Dorian natural 6th" },
            { signal: "IV chord is MINOR (e.g. Dm over Am)", mode: "→ Play Aeolian", reason: "F natural in Dm = the Aeolian ♭6th" },
            { signal: "♭VI chord appears (e.g. F over Am)", mode: "→ Play Aeolian", reason: "F natural is the ♭6 — Aeolian's signature" },
            { signal: "Dominant 7 chords throughout", mode: "→ Play Pentatonic/Blues", reason: "Minor pentatonic is safest and most expressive" },
          ].map(r => (
            <div key={r.signal} className="border-b border-white/10 pb-2">
              <p className="text-purple-300 text-xs">If you see: <span className="text-white font-semibold">{r.signal}</span></p>
              <p className="text-green-300 text-xs font-semibold">{r.mode} <span className="text-purple-400 font-normal">({r.reason})</span></p>
            </div>
          ))}
        </div>
      </Card>

      <Callout type="exercise">
        <p className="font-semibold mb-1">Aeolian vs Dorian Comparison:</p>
        Loop Am – Dm (Aeolian feel). Solo in A natural minor. Then switch the Dm to a D major. Same loop, one chord changed. Now play A Dorian (add the F#). Hear how the whole colour of the solo shifts — same root, completely different emotional character.
      </Callout>

      <KeyChordExplorer mode="lydian"  title="Lydian — Pick Your Key" />
      <KeyChordExplorer mode="aeolian" title="Aeolian — Pick Your Key" />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
function MajorTab() {
  return (
    <div>
      <div className="bg-white/10 border-l-4 border-yellow-400 rounded-xl p-5 mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">Major Scale (Ionian)</h2>
        <p className="text-slate-300 text-sm font-mono mb-2">1 – 2 – 3 – 4 – 5 – 6 – 7</p>
        <p className="text-purple-200 text-sm mb-2"><span className="text-white font-semibold">Sound: </span>Bright, happy, resolved. The foundation of Western music.</p>
        <p className="text-amber-300 text-sm"><span className="text-white font-semibold">Natural home: </span>Any major key progression — I, IV, V, vi</p>
      </div>

      <Card title="Why the Major Scale Is Different">
        <p className="text-purple-200 text-sm mb-3">
          The major scale isn&apos;t a &quot;mode&quot; with a single characteristic note to activate — it <em>is</em> the reference. All 7 diatonic chords work under it.
          Your job is to choose which chords to emphasise for the mood you want.
        </p>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          {[
            { prog: "I – IV – V",       feel: "Classic rock, country — timeless & triumphant" },
            { prog: "I – V – vi – IV",  feel: "Pop mega-hit — every major hit ever written" },
            { prog: "I – vi – IV – V",  feel: "50s doo-wop, romantic ballads" },
            { prog: "I – ii – IV – V",  feel: "Jazz-pop, smooth & sophisticated" },
          ].map(r => (
            <div key={r.prog} className="bg-white/5 rounded-xl p-3 border border-white/10">
              <p className="text-green-300 font-mono font-bold text-xs mb-1">{r.prog}</p>
              <p className="text-purple-300 text-xs">{r.feel}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Best Backing Progressions for Major Scale (key of C)">
        <div className="space-y-3">
          <ChordProg chords={["C", "F", "G"]} label="I – IV – V — the backbone of rock and country" />
          <ChordProg chords={["C", "G", "Am", "F"]} label="I – V – vi – IV — four-chord hit machine" />
          <ChordProg chords={["C", "Am", "F", "G"]} label="I – vi – IV – V — classic doo-wop / pop" />
          <ChordProg chords={["C", "Dm", "F", "G"]} label="I – ii – IV – V — jazz-flavoured pop" />
          <ChordProg chords={["C", "F", "C", "G"]} label="Simple major vamp — pure major scale freedom" />
        </div>
      </Card>

      <Callout type="tip">
        The major scale works equally well over all 7 diatonic chords. The difference is what you <strong className="text-white">emphasise</strong>: land on the 3rd over the I chord for brightness, the 7th for a dreamy maj7 colour, the 5th for stability.
      </Callout>

      <Card title="Major Scale vs Relative Minor">
        <p className="text-purple-200 text-sm mb-3">
          The major scale and its relative minor share all the same notes. C major = A minor (Aeolian) — same 7 notes, different root.
          The backing chords determine which one your ear hears:
        </p>
        <div className="space-y-2">
          <ChordProg chords={["C", "G", "Am", "F"]} label="→ Sounds major (C is home)" />
          <ChordProg chords={["Am", "F", "C", "G"]} label="→ Sounds minor (Am is home — same chords!)" />
        </div>
        <p className="text-purple-300 text-xs mt-3">Same chords. Same scale. The first chord sets the tonal centre.</p>
      </Card>

      <KeyChordExplorer mode="major" title="Major Scale — Pick Your Key" />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
function BluesTab() {
  return (
    <div>
      <div className="bg-white/10 border-l-4 border-blue-400 rounded-xl p-5 mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">Blues Scale</h2>
        <p className="text-slate-300 text-sm font-mono mb-2">Root – ♭3 – 4 – ♭5 – 5 – ♭7</p>
        <p className="text-purple-200 text-sm mb-2"><span className="text-white font-semibold">Sound: </span>Raw, gritty, expressive, emotional. The DNA of rock and blues.</p>
        <p className="text-amber-300 text-sm"><span className="text-white font-semibold">The blue note: </span>The ♭5 (tritone) — the single note that gives blues its characteristic tension</p>
      </div>

      <Card title="What Makes the Blues Scale">
        <p className="text-purple-200 text-sm mb-3">
          The blues scale is the minor pentatonic with one extra note added: the ♭5, also called the &quot;blue note&quot; or tritone.
          That single addition transforms pentatonic from versatile to raw and soulful.
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {["Root", "♭3", "4", ["♭5 ★", true], "5", "♭7"].map((n, i) => (
            <div key={i} className="text-center">
              <div className={`px-3 py-1.5 rounded-lg text-sm font-bold ${Array.isArray(n) ? "bg-blue-500 text-white" : "bg-white/15 text-white"}`}>
                {Array.isArray(n) ? n[0] : n}
              </div>
              {Array.isArray(n) && <p className="text-blue-400 text-xs mt-0.5">blue note</p>}
            </div>
          ))}
        </div>
        <p className="text-purple-300 text-xs">
          The ♭5 sits exactly between the 4 and 5 — a tritone above the root. It creates maximum harmonic tension, which is why it sounds so expressive when bent or used as a passing note.
        </p>
      </Card>

      <Card title="The Blues Scale's Natural Home: Dominant 7th Chords">
        <p className="text-purple-200 text-sm mb-4">
          The blues scale was built for 12-bar blues — a three-chord progression using dominant 7th chords.
          The ♭3 in your scale &quot;fights&quot; the major 3rd in the chord, creating intentional tension that resolves beautifully.
        </p>
        <div className="space-y-3">
          <ChordProg chords={["A7", "D7", "A7", "A7"]} label="12-bar bars 1–4 (I7)" />
          <ChordProg chords={["D7", "D7", "A7", "A7"]} label="12-bar bars 5–8 (IV7 → I7)" />
          <ChordProg chords={["E7", "D7", "A7", "E7"]} label="12-bar bars 9–12 (V7 → IV7 → I7 → turnaround)" />
        </div>
      </Card>

      <Card title="Blues Scale Over Non-Blues Progressions">
        <div className="space-y-3">
          <div>
            <ChordProg chords={["A", "D", "E"]} label="Rock I–IV–V — blues scale adds grit to major chords" />
            <p className="text-purple-300 text-xs mt-1">The ♭3 against a major chord is deliberate tension — classic rock attitude (AC/DC, Chuck Berry)</p>
          </div>
          <div>
            <ChordProg chords={["Am", "F", "C", "G"]} label="Minor backing — blues scale = more aggressive than plain pentatonic" />
            <p className="text-purple-300 text-xs mt-1">The ♭5 adds an extra punch over minor progressions</p>
          </div>
          <div>
            <ChordProg chords={["A", "G", "D", "A"]} label="Southern rock vamp — blues scale with major chords" />
            <p className="text-purple-300 text-xs mt-1">Lynyrd Skynyrd, ZZ Top territory. Bend the ♭5 up to the 5th for maximum expression.</p>
          </div>
        </div>
      </Card>

      <Callout type="tip">
        Don&apos;t overuse the ♭5 — it&apos;s a <strong className="text-white">passing note</strong>, not a destination. Play it quickly between the 4 and 5, or bend it upward. Landing on it and holding creates an ugly clash. Use it for tension, resolve on the 5th or ♭3.
      </Callout>

      <TabBlock label="Blues scale lick — ♭5 as passing note (A blues)">
{`e|--------------------------|
B|--------------------------|
G|--7b9--7--5--------------|
D|----------7--6--5---------|   ♭5 = fret 6 on D string
A|------------------7--5---|
E|--------------------------|

The fret 6 (♭5) passes between fret 5 (4th) and fret 7 (5th).
Bend fret 6 up to fret 7 for maximum blues expression.`}
      </TabBlock>

      <KeyChordExplorer mode="blues" title="Blues Scale — Pick Your Key" />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
function LocriañTab() {
  return (
    <div>
      <div className="bg-white/10 border-l-4 border-red-500 rounded-xl p-5 mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">Locrian</h2>
        <p className="text-slate-300 text-sm font-mono mb-2">1 – ♭2 – ♭3 – 4 – ♭5 – ♭6 – ♭7</p>
        <p className="text-purple-200 text-sm mb-2"><span className="text-white font-semibold">Sound: </span>Extremely dark, unstable, tense. The most dissonant of all modes.</p>
        <p className="text-amber-300 text-sm"><span className="text-white font-semibold">Defining feature: </span>The ♭5 makes the home chord a diminished triad — there is no stable resting point</p>
      </div>

      <Callout type="warning">
        Locrian is the most theoretically important but practically rare mode. The diminished home chord (i°) has no root fifth — it never truly resolves. Most musicians use it in short bursts for dark colour, not as a full tonal centre.
      </Callout>

      <Card title="Why Locrian Is So Tense">
        <p className="text-purple-200 text-sm mb-3">
          Every other mode has a perfect 5th above the root (7 semitones), which creates a stable home chord.
          Locrian has a ♭5 (6 semitones) — a tritone — making the i chord diminished. There&apos;s no stability anywhere.
        </p>
        <div className="space-y-2 text-sm">
          {[
            { mode: "Phrygian", home: "Em (minor — stable)", reason: "Has perfect 5th" },
            { mode: "Aeolian",  home: "Am (minor — stable)", reason: "Has perfect 5th" },
            { mode: "Locrian",  home: "B° (diminished — unstable!)", reason: "Has tritone ♭5" },
          ].map(r => (
            <div key={r.mode} className="flex items-center gap-3 border-b border-white/10 pb-2">
              <span className="text-white font-semibold w-24">{r.mode}</span>
              <span className="text-purple-300 text-xs flex-1">{r.home}</span>
              <span className="text-amber-400 text-xs">{r.reason}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card title="The ♭II Chord — Locrian's Only Escape">
        <p className="text-purple-200 text-sm mb-4">
          The one chord that gives Locrian any sense of movement is the ♭II major — one half-step above the root.
          It contains the ♭2 (the other characteristic note) and feels like a momentary release from the tension.
        </p>
        <ChordProg chords={["Bdim", "C"]} label="B Locrian — i° → ♭II (the defining Locrian movement)" />
        <p className="text-purple-300 text-xs mb-3">C major is the ♭II of B. The move from Bdim to C is the Locrian signature.</p>
        <ChordProg chords={["Bdim", "C", "Am", "C"]} label="Expanded Locrian vamp" />
      </Card>

      <Card title="Where Locrian Actually Gets Used">
        <div className="space-y-2 text-sm">
          {[
            { context: "Metal & Djent", use: "Half-time riffs built around the tritone — the ♭5 interval creates maximum heaviness", example: "Meshuggah, Periphery" },
            { context: "Film scoring", use: "Short Locrian passages signal dread, horror, or imminent danger", example: "Hans Zimmer tension cues" },
            { context: "Jazz (brief)", use: "The 7th degree of any major key is Locrian — used over half-diminished chords (ø7)", example: "ii°7 in minor key ii-V-i" },
            { context: "Passing colour", use: "Single-bar Locrian runs before resolving to a more stable mode", example: "Prog rock, Dream Theater" },
          ].map(r => (
            <div key={r.context} className="border-b border-white/10 pb-3">
              <p className="text-white font-semibold">{r.context}</p>
              <p className="text-purple-300 text-xs mt-0.5">{r.use}</p>
              <p className="text-amber-400 text-xs mt-0.5">e.g. {r.example}</p>
            </div>
          ))}
        </div>
      </Card>

      <Callout type="exercise">
        <p className="font-semibold mb-1">Locrian Tension Exercise:</p>
        Loop Bdim → C (2 bars each, slow — 55 BPM). Solo using B Locrian. Land heavily on the F# (♭5) over Bdim to maximise the tritone tension. When you hit C, resolve to E or G (the 3rd or 5th of C major). Feel how the tension needs that resolution.
      </Callout>

      <KeyChordExplorer mode="locrian" title="Locrian — Pick Your Key" />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
function PracticeTab() {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  const sessions = [
    {
      title: "Session 1 — Pentatonic Freedom",
      goal: "Hear how the same scale sounds different over different chord types",
      bpm: "70 BPM",
      steps: [
        "Set a loop: Am (2 bars). Solo in A minor pentatonic. Feel the dark, restrained quality.",
        "Change the loop to A7 (dominant 7). Same scale, same fingering. Notice the bluesy tension now.",
        "Change to A major. Hear the aggressive, rock sound — the ♭3 clashing with the major 3rd.",
        "Try each backing for 5 minutes each. This is one of the most important exercises you can do.",
      ],
    },
    {
      title: "Session 2 — Dorian Activation",
      goal: "Learn to hear when the IV chord activates Dorian",
      bpm: "75 BPM",
      steps: [
        "Loop Am only (4 bars). Solo in A minor pentatonic. Sounds minor, nothing unusual.",
        "Add a D chord every 2nd bar: Am (2 bars) – D (2 bars). Don't change your scale.",
        "Now deliberately land on F# (B string fret 7) when the D chord plays.",
        "Hear that? The F# over D is the Dorian sound. You're now playing A Dorian.",
        "Expand to Am – G – D and keep targeting F# over the D chord.",
      ],
    },
    {
      title: "Session 3 — Mixolydian Drive",
      goal: "Build rock phrases that exploit the ♭7",
      bpm: "80 BPM",
      steps: [
        "Loop G – F (2 bars each). This is your Mixolydian vamp.",
        "Solo in G major pentatonic. Sounds fine but generic.",
        "Add the F note (♭7): fret 1 on high e, fret 3 on D string.",
        "Land on F whenever the F chord plays. That's your Mixolydian statement.",
        "Now build a full 8-bar phrase: set up over G, climax over the F chord with a bend to F natural.",
      ],
    },
    {
      title: "Session 4 — Phrygian Atmosphere",
      goal: "Create the Spanish/dark sound with backing chords",
      bpm: "65 BPM",
      steps: [
        "Loop Em – F (2 bars each, slow).",
        "Solo in E minor pentatonic.",
        "Add the F note (♭2): fret 1 on the high e string.",
        "Let the F note ring over the F chord. Instant Spanish flavour.",
        "Try the Andalusian cadence: Am – G – F – E. Solo through the whole descent.",
      ],
    },
    {
      title: "Session 5 — Modal Ear Training",
      goal: "Identify modes by their backing chord sounds alone",
      bpm: "Any",
      steps: [
        "Record yourself playing these 4 progressions (one minute each):",
        "① Am – D (Dorian)  ② G – F (Mixolydian)  ③ Em – F (Phrygian)  ④ Am – F – C – G (Aeolian)",
        "Listen back tomorrow without labels. Try to name each progression's mode.",
        "If you can identify them — congratulations: you have modal ear training.",
        "If not: repeat sessions 2–4 until the sound is locked in.",
      ],
    },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Practice Sessions</h2>
      <p className="text-purple-200 mb-6">
        Five focused sessions to take you from theory to your ears. Work through them in order — each builds on the last.
      </p>

      <Callout type="insight">
        The goal is <strong className="text-white">ear recognition</strong>, not theory memorisation. When you can feel the difference between a Dorian and Aeolian backing just by listening — without thinking about note names — you&apos;ve got it.
      </Callout>

      <div className="space-y-3 mb-8">
        {sessions.map((s, i) => {
          const isOpen = openIdx === i
          return (
            <div key={i} className="bg-white/10 border border-white/20 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenIdx(isOpen ? null : i)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-purple-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0">{i + 1}</div>
                  <div>
                    <p className="text-white font-semibold">{s.title}</p>
                    <p className="text-purple-300 text-xs">{s.goal} · {s.bpm}</p>
                  </div>
                </div>
                <span className="text-purple-400 text-xl flex-shrink-0">{isOpen ? "−" : "+"}</span>
              </button>
              {isOpen && (
                <div className="px-5 pb-5 border-t border-white/10 pt-4">
                  <ol className="space-y-2">
                    {s.steps.map((step, si) => (
                      <li key={si} className="flex gap-3 text-sm text-purple-200">
                        <span className="text-purple-500 font-mono text-xs mt-0.5 flex-shrink-0">{si + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <Card title="Quick-Reference Cheat Sheet">
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[480px]">
            <thead>
              <tr className="text-purple-400 border-b border-white/10">
                <th className="pb-2 text-left">Scale / Mode</th>
                <th className="pb-2 text-left">Activating chord</th>
                <th className="pb-2 text-left">Minimal vamp</th>
                <th className="pb-2 text-left">Full progression</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {[
                { scale: "Minor Pentatonic", act: "— (works everywhere)",   vamp: "Am or A7",   full: "Am–G–F–G or A7–D7–E7" },
                { scale: "Major Scale",      act: "I, IV, V all work",       vamp: "C – G",      full: "C – G – Am – F" },
                { scale: "Blues Scale",      act: "Dominant 7 (A7, D7, E7)", vamp: "A7",         full: "A7 – D7 – E7 (12-bar)" },
                { scale: "Dorian",           act: "IV major (D over Am)",    vamp: "Am – D",     full: "Am – G – D – Am" },
                { scale: "Mixolydian",       act: "♭VII major (F over G)",   vamp: "G – F",      full: "G – F – C – G" },
                { scale: "Phrygian",         act: "♭II major (F over Em)",   vamp: "Em – F",     full: "Am – G – F – E" },
                { scale: "Lydian",           act: "II major (G over F)",     vamp: "Fmaj7 – G",  full: "Fmaj7 – G – Am – G" },
                { scale: "Aeolian",          act: "♭VI major (F over Am)",   vamp: "Am – F",     full: "Am – F – C – G" },
                { scale: "Locrian",          act: "♭II major (C over Bdim)", vamp: "Bdim – C",   full: "Bdim – C – Am – C" },
              ].map(r => (
                <tr key={r.scale}>
                  <td className="py-2 text-white font-semibold">{r.scale}</td>
                  <td className="py-2 text-amber-300">{r.act}</td>
                  <td className="py-2 text-green-300 font-mono">{r.vamp}</td>
                  <td className="py-2 text-purple-300 font-mono">{r.full}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function BackingChordsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("how-it-works")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link href="/" className="text-purple-300 hover:text-white text-sm">← Back to modules</Link>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Backing Chords for Scales</h1>
          <p className="text-purple-200">Playing a scale or mode? Learn which chord progressions bring out its character — and why.</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === t.id
                  ? "bg-purple-600 text-white"
                  : "bg-white/10 text-purple-300 hover:bg-white/20"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
          {activeTab === "how-it-works"   && <HowItWorksTab />}
          {activeTab === "pentatonic"     && <PentatonicTab />}
          {activeTab === "major"          && <MajorTab />}
          {activeTab === "blues"          && <BluesTab />}
          {activeTab === "dorian"         && <DorianTab />}
          {activeTab === "mixolydian"     && <MixolydianTab />}
          {activeTab === "phrygian"       && <PhrygianTab />}
          {activeTab === "lydian-aeolian" && <LydianAeolianTab />}
          {activeTab === "locrian"        && <LocriañTab />}
          {activeTab === "practice"       && <PracticeTab />}
        </div>
      </div>
    </div>
  )
}
