"use client"

import Link from "next/link"
import { useState } from "react"
import ChordDiagram from "@/components/ChordDiagram"
import FullChordFretboard from "@/components/FullChordFretboard"

// ─── Types ────────────────────────────────────────────────────────────────────

type Quality  = "major" | "minor"
type SetKey   = "123" | "234" | "345"
type Tab      = "overview" | "shapes" | "voiceleading" | "openvoicings" | "practice"

// ─── Constants ────────────────────────────────────────────────────────────────

const NOTES = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"]

// Semitones above E2 for each string (index 0 = string 6 = low E)
const STRING_SEMITONES = [0, 5, 10, 15, 19, 24]

const STRING_SETS: Record<SetKey, {
  label: string
  indices: [number, number, number]  // low→high, 0=string6, 5=string1
  notes: string
}> = {
  "123": { label: "Strings 1–2–3", indices: [3, 4, 5], notes: "G · B · e" },
  "234": { label: "Strings 2–3–4", indices: [2, 3, 4], notes: "D · G · B" },
  "345": { label: "Strings 3–4–5", indices: [1, 2, 3], notes: "A · D · G" },
}

const INVERSIONS = [
  { label: "Root Position", short: "R",  notes: "R – 3 – 5" },
  { label: "1st Inversion",  short: "1st", notes: "3 – 5 – R" },
  { label: "2nd Inversion",  short: "2nd", notes: "5 – R – 3" },
]

const TABS: { id: Tab; label: string }[] = [
  { id: "overview",     label: "Overview" },
  { id: "shapes",       label: "Shapes" },
  { id: "voiceleading", label: "Voice Leading" },
  { id: "openvoicings", label: "Open Voicings" },
  { id: "practice",     label: "Practice" },
]

const TRIAD_TYPES = [
  {
    name: "Major",    intervals: [0, 4, 7],
    formula: "R + M3 + P5", example: "C – E – G",
    feel: "Bright, stable, happy",
    color: "text-emerald-300", bg: "bg-emerald-500/10", border: "border-emerald-500/25",
  },
  {
    name: "Minor",    intervals: [0, 3, 7],
    formula: "R + m3 + P5", example: "C – Eb – G",
    feel: "Dark, stable, melancholy",
    color: "text-sky-300", bg: "bg-sky-500/10", border: "border-sky-500/25",
  },
  {
    name: "Diminished", intervals: [0, 3, 6],
    formula: "R + m3 + d5", example: "C – Eb – Gb",
    feel: "Tense, unstable, pulls to resolve",
    color: "text-rose-300", bg: "bg-rose-500/10", border: "border-rose-500/25",
  },
  {
    name: "Augmented",  intervals: [0, 4, 8],
    formula: "R + M3 + A5", example: "C – E – G#",
    feel: "Dreamy, ambiguous, floating",
    color: "text-amber-300", bg: "bg-amber-500/10", border: "border-amber-500/25",
  },
]

const SCALE_TRIADS = [
  { degree: "I",    quality: "Major",    note: "— Tonic, home" },
  { degree: "ii",   quality: "minor",    note: "" },
  { degree: "iii",  quality: "minor",    note: "" },
  { degree: "IV",   quality: "Major",    note: "— Subdominant" },
  { degree: "V",    quality: "Major",    note: "— Dominant, tension" },
  { degree: "vi",   quality: "minor",    note: "— Relative minor" },
  { degree: "vii°", quality: "diminished", note: "— Leading tone" },
]

// ─── Triad fingering computation ──────────────────────────────────────────────

function computeTriadFingering(
  root: number,                           // 0=C, 1=C#, ..., 11=B
  quality: Quality,
  strSet: [number, number, number],       // STRING_SEMITONES indices, low→high
  inversion: 0 | 1 | 2
): (number | string)[] {
  const intervals = quality === "major" ? [0, 4, 7] : [0, 3, 7]
  const rotated   = [0, 1, 2].map(i => intervals[(inversion + i) % 3])

  // E2 is 4 semitones above C (root is semitones above C)
  const rawFrets = strSet.map((strIdx, i) => {
    const strOpenFromC = STRING_SEMITONES[strIdx] + 4
    const targetNote   = root + rotated[i]
    let note = targetNote % 12
    while (note < strOpenFromC) note += 12
    return note - strOpenFromC
  })

  // Pull outliers into a 4-fret close-voicing window
  const maxFret = Math.max(...rawFrets)
  const frets   = rawFrets.map(f => { let a = f; while (maxFret - a > 4) a += 12; return a })

  const fingers: (number | string)[] = ["x", "x", "x", "x", "x", "x"]
  strSet.forEach((strIdx, i) => { fingers[strIdx] = frets[i] })
  return fingers
}

function triadNoteNames(root: number, quality: Quality, inversion: 0|1|2): string[] {
  const intervals = quality === "major" ? [0, 4, 7] : [0, 3, 7]
  const rotated   = [0, 1, 2].map(i => intervals[(inversion + i) % 3])
  return rotated.map(iv => NOTES[(root + iv) % 12])
}

// ─── Inline helpers ───────────────────────────────────────────────────────────

function Callout({ type, children }: {
  type: "tip" | "insight" | "exercise" | "warning"
  children: React.ReactNode
}) {
  const styles = {
    tip:      "border-purple-500/40 bg-purple-500/10 text-purple-200",
    insight:  "border-sky-500/40    bg-sky-500/10    text-sky-200",
    exercise: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
    warning:  "border-amber-500/40  bg-amber-500/10  text-amber-200",
  }
  const labels = { tip: "TIP", insight: "INSIGHT", exercise: "EXERCISE", warning: "NOTE" }
  return (
    <div className={`border-l-2 rounded-r-xl px-4 py-3 my-3 ${styles[type]}`}>
      <span className="text-xs font-bold tracking-widest opacity-60 mr-2">{labels[type]}</span>
      <span className="text-sm">{children}</span>
    </div>
  )
}

function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-4">
      {title && <h3 className="text-white font-semibold mb-3">{title}</h3>}
      {children}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TriadsPage() {
  const [tab,     setTab]     = useState<Tab>("overview")
  const [root,    setRoot]    = useState(0)
  const [quality, setQuality] = useState<Quality>("major")
  const [strSet,  setStrSet]  = useState<SetKey>("123")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">

        <div className="mb-6">
          <Link href="/" className="text-purple-300 hover:text-purple-200 text-sm mb-4 inline-block">← Back</Link>
          <h1 className="text-4xl font-bold text-white mb-2">Triads</h1>
          <p className="text-purple-200/70">Three-note chords — major, minor, inversions, open voicings, and voice leading.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                tab === t.id
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                  : "bg-white/5 text-purple-200/70 hover:bg-white/10"
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === "overview"     && <OverviewTab />}
        {tab === "shapes"       && <ShapesTab root={root} setRoot={setRoot} quality={quality} setQuality={setQuality} strSet={strSet} setStrSet={setStrSet} />}
        {tab === "voiceleading" && <VoiceLeadingTab root={root} setRoot={setRoot} quality={quality} setQuality={setQuality} />}
        {tab === "openvoicings" && <OpenVoicingsTab root={root} setRoot={setRoot} />}
        {tab === "practice"     && <PracticeTab />}

      </div>
    </div>
  )
}

// ─── Overview ─────────────────────────────────────────────────────────────────

function OverviewTab() {
  return (
    <div className="space-y-6">
      <Card>
        <p className="text-purple-200/80 text-sm leading-relaxed mb-3">
          A <strong className="text-white">triad</strong> is the simplest complete chord — three notes, each a third apart.
          Every chord you've ever played on guitar is either a triad or an extended version of one.
          Learning triads properly means understanding <em>what</em> you're playing, not just where to put your fingers.
        </p>
        <p className="text-purple-200/80 text-sm leading-relaxed">
          On guitar, triads are especially powerful because you can play them on any 3 adjacent strings,
          giving you three different shapes (inversions) across the entire neck — and switching between them
          creates smooth, professional-sounding chord movement.
        </p>
      </Card>

      {/* Four types */}
      <div>
        <h2 className="text-white font-semibold mb-3">The four triad types</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {TRIAD_TYPES.map(t => (
            <div key={t.name} className={`rounded-xl border p-4 ${t.bg} ${t.border}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-base font-bold ${t.color}`}>{t.name}</span>
                <span className="text-white/30 text-xs font-mono">{t.formula}</span>
              </div>
              <p className={`text-sm font-mono font-bold mb-1 ${t.color}`}>{t.example}</p>
              <p className="text-white/50 text-xs">{t.feel}</p>
            </div>
          ))}
        </div>
      </div>

      <Callout type="insight">
        Major and minor triads are stable — they can sit at rest. Diminished is tense and wants to resolve.
        Augmented is ambiguous — it doesn't clearly pull anywhere.
      </Callout>

      {/* Diatonic triads */}
      <div>
        <h2 className="text-white font-semibold mb-3">Diatonic triads — every major scale gives you 7</h2>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="grid grid-cols-7 gap-1 text-center">
            {SCALE_TRIADS.map(st => (
              <div key={st.degree} className="space-y-1">
                <div className="text-purple-300 text-sm font-bold">{st.degree}</div>
                <div className={`text-xs px-1 py-0.5 rounded font-medium ${
                  st.quality === "Major"     ? "bg-emerald-500/20 text-emerald-300"
                  : st.quality === "minor"   ? "bg-sky-500/20 text-sky-300"
                  : "bg-rose-500/20 text-rose-300"
                }`}>{st.quality}</div>
              </div>
            ))}
          </div>
          <p className="text-white/40 text-xs mt-3 text-center">Pattern: M m m M M m dim — same in every major key</p>
        </div>
      </div>

      {/* Inversions intro */}
      <div>
        <h2 className="text-white font-semibold mb-3">Inversions — same notes, different order</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { pos: "Root Position", bass: "Root in bass", example: "C – E – G", feel: "Solid, grounded" },
            { pos: "1st Inversion",  bass: "3rd in bass",  example: "E – G – C", feel: "Lighter, floating" },
            { pos: "2nd Inversion",  bass: "5th in bass",  example: "G – C – E", feel: "Unstable, pulls to resolve" },
          ].map(inv => (
            <div key={inv.pos} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-white text-sm font-semibold mb-1">{inv.pos}</p>
              <p className="text-white/40 text-xs mb-2">{inv.bass}</p>
              <p className="text-purple-300 font-mono text-sm mb-2">{inv.example}</p>
              <p className="text-white/50 text-xs">{inv.feel}</p>
            </div>
          ))}
        </div>
      </div>

      <Callout type="tip">
        Go to the <strong>Shapes</strong> tab to see every inversion on every string set for any root note.
        Start with major triads on strings 1–2–3 — these are the most commonly used triad shapes in modern guitar playing.
      </Callout>
    </div>
  )
}

// ─── Shapes ───────────────────────────────────────────────────────────────────

function ShapesTab({ root, setRoot, quality, setQuality, strSet, setStrSet }: {
  root: number; setRoot: (n: number) => void
  quality: Quality; setQuality: (q: Quality) => void
  strSet: SetKey; setStrSet: (s: SetKey) => void
}) {
  const set = STRING_SETS[strSet]

  return (
    <div className="space-y-6">

      {/* Controls */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">

        {/* Root */}
        <div>
          <p className="text-white/50 text-xs uppercase tracking-widest mb-2">Root note</p>
          <div className="flex flex-wrap gap-1.5">
            {NOTES.map((n, i) => (
              <button key={i} onClick={() => setRoot(i)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  root === i
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                    : "bg-white/5 text-white/60 hover:bg-white/10"
                }`}>
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Quality + String set */}
        <div className="flex flex-wrap gap-6">
          <div>
            <p className="text-white/50 text-xs uppercase tracking-widest mb-2">Quality</p>
            <div className="flex gap-2">
              {(["major", "minor"] as Quality[]).map(q => (
                <button key={q} onClick={() => setQuality(q)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                    quality === q
                      ? q === "major" ? "bg-emerald-500/25 border border-emerald-500/40 text-emerald-300"
                        : "bg-sky-500/25 border border-sky-500/40 text-sky-300"
                      : "bg-white/5 text-white/50 hover:bg-white/10"
                  }`}>
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-white/50 text-xs uppercase tracking-widest mb-2">String set</p>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(STRING_SETS) as SetKey[]).map(k => (
                <button key={k} onClick={() => setStrSet(k)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    strSet === k
                      ? "bg-purple-600 text-white"
                      : "bg-white/5 text-white/50 hover:bg-white/10"
                  }`}>
                  <span className="font-semibold">{STRING_SETS[k].label}</span>
                  <span className="ml-2 text-xs opacity-60">{STRING_SETS[k].notes}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chord diagrams — all 3 inversions */}
      <div>
        <p className="text-white/40 text-xs uppercase tracking-widest mb-4">
          {NOTES[root]} {quality} — {set.label} ({set.notes})
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {([0, 1, 2] as (0|1|2)[]).map(inv => {
            const fingers   = computeTriadFingering(root, quality, set.indices, inv)
            const noteNames = triadNoteNames(root, quality, inv)
            const inv_info  = INVERSIONS[inv]
            return (
              <div key={inv} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                <p className="text-white text-sm font-semibold mb-0.5">{inv_info.label}</p>
                <p className="text-white/40 text-xs mb-3 font-mono">{inv_info.notes}</p>
                <div className="flex justify-center">
                  <ChordDiagram
                    chordName={`${NOTES[root]}${quality === "minor" ? "m" : ""}`}
                    fingers={fingers}
                    size="medium"
                  />
                </div>
                <div className="mt-3 flex justify-center gap-1.5">
                  {noteNames.map((n, ni) => (
                    <span key={ni} className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      ni === 0
                        ? "bg-purple-500/25 text-purple-300 border border-purple-500/30"
                        : "bg-white/10 text-white/60"
                    }`}>{n}</span>
                  ))}
                </div>
                <p className="text-white/30 text-xs mt-1">
                  {noteNames[0]} in bass ({inv === 0 ? "root" : inv === 1 ? "3rd" : "5th"})
                </p>
              </div>
            )
          })}
        </div>
      </div>

      <Callout type="insight">
        All three shapes contain the same three notes — just in a different order. Moving between inversions
        up the neck keeps you in one area without jumping positions. This is how pro rhythm guitarists
        play chord progressions without big hand leaps.
      </Callout>

      {/* Both string sets side by side for root position */}
      <div>
        <h3 className="text-white font-semibold mb-3">
          {NOTES[root]} {quality} root position — all string sets
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {(["123", "234", "345"] as SetKey[]).map(sk => {
            const s       = STRING_SETS[sk]
            const fingers = computeTriadFingering(root, quality, s.indices, 0)
            return (
              <div key={sk} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                <p className="text-white text-sm font-semibold mb-0.5">{s.label}</p>
                <p className="text-white/40 text-xs mb-3">{s.notes}</p>
                <div className="flex justify-center">
                  <ChordDiagram
                    chordName={`${NOTES[root]}${quality === "minor" ? "m" : ""}`}
                    fingers={fingers}
                    size="small"
                  />
                </div>
              </div>
            )
          })}
        </div>
        <p className="text-white/30 text-xs mt-3 text-center">
          Root position on all three string sets — the same chord voiced at different registers
        </p>
      </div>

      {/* Full neck map */}
      <div>
        <h3 className="text-white font-semibold mb-1">Full neck map</h3>
        <p className="text-white/40 text-xs mb-4">
          Every occurrence of the {NOTES[root]} {quality} triad across all 12 frets — amber = root, purple = 3rd &amp; 5th
        </p>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 overflow-x-auto">
          <FullChordFretboard
            chordName={`${NOTES[root]} ${quality === "major" ? "Major" : "Minor"} Triad`}
            rootNoteIndex={root}
            intervals={quality === "major" ? [0, 4, 7] : [0, 3, 7]}
            showNoteNames={true}
          />
        </div>
        <p className="text-white/30 text-xs mt-2 text-center">
          Scroll horizontally if the fretboard is clipped · Each cluster of 3 notes is a playable shape
        </p>
      </div>

    </div>
  )
}

// ─── Voice Leading ────────────────────────────────────────────────────────────

function VoiceLeadingTab({ root, setRoot, quality, setQuality }: {
  root: number; setRoot: (n: number) => void
  quality: Quality; setQuality: (q: Quality) => void
}) {
  // Show I → IV → V → I using smooth inversion choices on strings 1-2-3
  // In key of C: C major (root=0), F major (root=5), G major (root=7)
  const key    = root
  const IV_root = (root + 5) % 12
  const V_root  = (root + 7) % 12

  // Voice-led progression: choose inversions that minimise movement
  // I root pos → IV 2nd inv → V 1st inv → I root pos
  const steps: { name: string; chordRoot: number; inv: 0|1|2; desc: string }[] = [
    { name: `I (${NOTES[key]})`,       chordRoot: key,     inv: 0, desc: "Root position — solid foundation" },
    { name: `IV (${NOTES[IV_root]})`,  chordRoot: IV_root, inv: 2, desc: "2nd inversion — shares 5th with I, minimal movement" },
    { name: `V (${NOTES[V_root]})`,    chordRoot: V_root,  inv: 1, desc: "1st inversion — leading tone on top, pulls to I" },
    { name: `I (${NOTES[key]})`,       chordRoot: key,     inv: 0, desc: "Root position — resolution feels complete" },
  ]

  const strSet = STRING_SETS["123"].indices as [number, number, number]

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-white font-semibold mb-3">What is voice leading?</h2>
        <p className="text-purple-200/80 text-sm leading-relaxed mb-3">
          Voice leading is choosing which inversion of each chord to play so that the individual notes
          (voices) move as little as possible between chords. Instead of jumping around the neck, each
          note slides or steps smoothly to the nearest note in the next chord.
        </p>
        <p className="text-purple-200/80 text-sm leading-relaxed">
          Good voice leading is what makes sophisticated guitar arrangements sound connected rather than
          choppy — and it's what separates professional rhythm guitar from basic strumming.
        </p>
      </Card>

      {/* Root selector */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
        <p className="text-white/50 text-xs uppercase tracking-widest mb-2">Key (I chord)</p>
        <div className="flex flex-wrap gap-1.5">
          {NOTES.map((n, i) => (
            <button key={i} onClick={() => setRoot(i)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                root === i
                  ? "bg-purple-600 text-white"
                  : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}>
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* I – IV – V – I with voice-led inversions */}
      <div>
        <h3 className="text-white font-semibold mb-1">I – IV – V – I in {NOTES[key]} major</h3>
        <p className="text-white/40 text-xs mb-4">Using inversions to keep each voice as close as possible — all on strings 1–2–3</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {steps.map((step, idx) => {
            const fingers   = computeTriadFingering(step.chordRoot, "major", strSet, step.inv)
            const noteNames = triadNoteNames(step.chordRoot, "major", step.inv)
            const inv_info  = INVERSIONS[step.inv]
            return (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                <p className="text-white text-sm font-bold mb-0.5">{step.name}</p>
                <p className="text-purple-400 text-xs mb-3">{inv_info.label}</p>
                <div className="flex justify-center">
                  <ChordDiagram
                    chordName={NOTES[step.chordRoot]}
                    fingers={fingers}
                    size="small"
                  />
                </div>
                <div className="mt-2 flex justify-center gap-1">
                  {noteNames.map((n, ni) => (
                    <span key={ni} className="text-xs bg-white/10 text-white/60 px-1.5 py-0.5 rounded font-mono">{n}</span>
                  ))}
                </div>
                <p className="text-white/30 text-xs mt-2 leading-tight">{step.desc}</p>
              </div>
            )
          })}
        </div>
      </div>

      <Callout type="insight">
        Notice how the top note barely moves across this whole progression. That's smooth voice leading in
        action — each voice travels the shortest possible distance to the next chord.
      </Callout>

      {/* Rules */}
      <Card title="Three rules for smooth voice leading">
        <div className="space-y-3">
          {[
            { rule: "Prefer stepwise motion", desc: "Move each voice to the nearest available note in the next chord — a half step or whole step. Big leaps sound disconnected." },
            { rule: "Minimise movement", desc: "If a note is shared between two chords, keep it in the same voice. Common tones are your anchor points." },
            { rule: "Contrary motion is elegant", desc: "When one voice moves up, have another move down. This prevents all voices crowding in the same direction." },
          ].map(r => (
            <div key={r.rule} className="flex gap-3">
              <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-purple-400 mt-2" />
              <div>
                <p className="text-white text-sm font-semibold">{r.rule}</p>
                <p className="text-white/50 text-xs leading-relaxed">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Callout type="tip">
        Practice the I–IV–V–I progression above with a metronome. Once you can switch smoothly, try playing
        the same progression on strings 2–3–4 — the same inversion choices apply.
      </Callout>
    </div>
  )
}

// ─── Open Voicings ────────────────────────────────────────────────────────────

function OpenVoicingsTab({ root, setRoot }: { root: number; setRoot: (n: number) => void }) {
  // Show close vs open comparison for the selected root
  // Close: strings 1-2-3 root position
  // Open (drop 2 style): strings 1-2-4 (skip string 3) — drop the 2nd highest note
  // We'll hardcode a few clear examples

  const closeFingering = computeTriadFingering(root, "major", [3,4,5], 0)

  // Open voicing on strings 1-2-4 — drop 2: take close root pos on 1-2-3,
  // and drop the 2nd highest note to string 4 (one octave lower)
  // For a major triad root position (R-3-5 on G-B-e):
  // Drop 2 means take the 3rd (2nd highest) and drop it an octave → 3rd goes to D string
  // Result: 5 on G string (skip), R on B string, 5-an-octave-lower? No...
  // Actually standard drop 2 for guitar chord voicings puts us on 4 strings.
  // For a triad drop 2 (strings 1-2-skip-4): note order becomes: 3(str4), skip(str3), 5(str2), R(str1)
  // Let's compute: major root position = R-3-5. Drop 2nd highest (3) = 3 goes to string 4
  const openFingering = computeTriadFingering(root, "major", [2,4,5], 0)

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-white font-semibold mb-3">Close vs open voicing</h2>
        <p className="text-purple-200/80 text-sm leading-relaxed mb-3">
          In a <strong className="text-white">close voicing</strong>, all three notes are packed within
          one octave on adjacent strings. In an <strong className="text-white">open voicing</strong>, one or
          more notes are displaced by an octave, spreading the chord across a wider range.
        </p>
        <p className="text-purple-200/80 text-sm leading-relaxed">
          Open voicings sound more spacious and resonant — individual notes have room to breathe without
          the adjacent strings dampening each other. This is why classical and fingerstyle arrangements
          often use spread voicings.
        </p>
      </Card>

      {/* Root selector */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
        <p className="text-white/50 text-xs uppercase tracking-widest mb-2">Root note</p>
        <div className="flex flex-wrap gap-1.5">
          {NOTES.map((n, i) => (
            <button key={i} onClick={() => setRoot(i)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                root === i ? "bg-purple-600 text-white" : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}>
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Close vs Open comparison */}
      <div>
        <h3 className="text-white font-semibold mb-3">{NOTES[root]} major — close vs open</h3>
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
            <p className="text-white font-semibold mb-1">Close Voicing</p>
            <p className="text-white/40 text-xs mb-3">Strings 1–2–3 · Root Position</p>
            <div className="flex justify-center">
              <ChordDiagram chordName={NOTES[root]} fingers={closeFingering} size="medium" />
            </div>
            <p className="text-white/40 text-xs mt-3">R – 3 – 5 within one octave</p>
            <div className="mt-2 inline-block text-xs bg-sky-500/10 border border-sky-500/20 text-sky-300 rounded-lg px-3 py-1">
              Tight · punchy · cuts through a mix
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
            <p className="text-white font-semibold mb-1">Open Voicing</p>
            <p className="text-white/40 text-xs mb-3">Strings 1–2–4 · Skip string 3</p>
            <div className="flex justify-center">
              <ChordDiagram chordName={NOTES[root]} fingers={openFingering} size="medium" />
            </div>
            <p className="text-white/40 text-xs mt-3">Notes spread across strings with a gap</p>
            <div className="mt-2 inline-block text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-lg px-3 py-1">
              Open · resonant · airy
            </div>
          </div>
        </div>
      </div>

      {/* Drop 2 explained */}
      <Card title="Drop 2 voicings">
        <p className="text-white/70 text-sm leading-relaxed mb-3">
          The most common open voicing technique. Take a close voicing, then drop the{" "}
          <strong className="text-white">second highest note</strong> down by one octave.
          On guitar, this typically means skipping one string, giving the chord a wider,
          fuller spread.
        </p>
        <div className="bg-black/30 rounded-xl p-4 font-mono text-sm space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-white/40 text-xs w-28">Close (R-3-5)</span>
            <span className="text-emerald-300">{NOTES[root]}</span>
            <span className="text-purple-300">{NOTES[(root+4)%12]}</span>
            <span className="text-sky-300">{NOTES[(root+7)%12]}</span>
          </div>
          <div className="text-white/20 text-xs pl-28">↓ drop 2nd highest note</div>
          <div className="flex items-center gap-3">
            <span className="text-white/40 text-xs w-28">Drop 2 (5-R-3)</span>
            <span className="text-sky-300">{NOTES[(root+7)%12]}</span>
            <span className="text-white/20">—</span>
            <span className="text-emerald-300">{NOTES[root]}</span>
            <span className="text-purple-300">{NOTES[(root+4)%12]}</span>
          </div>
        </div>
      </Card>

      {/* When to use */}
      <Card title="When to use open voicings">
        <div className="space-y-3">
          {[
            { ctx: "Fingerstyle & classical", desc: "Bass note on a lower string, spread harmony above — gives each note room to ring." },
            { ctx: "Chord melody", desc: "Spread voicings prevent melody notes from clashing with inner chord tones." },
            { ctx: "Ambient & indie guitar", desc: "The airy quality of open voicings (Radiohead, The National) defines that sound." },
            { ctx: "Band context", desc: "When bass and keys already cover the low end, an open-voiced triad on the top strings fits without muddying the mix." },
          ].map(c => (
            <div key={c.ctx} className="flex gap-3">
              <span className="shrink-0 text-purple-400 text-xs font-bold pt-0.5">{c.ctx}</span>
              <span className="text-white/50 text-xs">{c.desc}</span>
            </div>
          ))}
        </div>
      </Card>

    </div>
  )
}

// ─── Practice ─────────────────────────────────────────────────────────────────

function PracticeTab() {
  return (
    <div className="space-y-5">

      <Card>
        <p className="text-purple-200/80 text-sm leading-relaxed">
          The goal is to internalise the three shapes on each string set so you can call them up anywhere on
          the neck without thinking. Work through these exercises in order — each one builds on the last.
        </p>
      </Card>

      {[
        {
          num: 1,
          title: "Three shapes in one position",
          difficulty: "Beginner",
          color: "text-emerald-400",
          desc: "On strings 1–2–3, play all three inversions of C major ascending then descending. Stay in the same general area of the neck.",
          steps: [
            "Root position (frets 5-5-3 on G-B-e)",
            "1st inversion (frets 9-8-8)",
            "2nd inversion (frets 12-13-12)",
            "Descend back: 2nd → 1st → root",
            "Repeat for G major, then D major",
          ],
          tip: "Don't rush. Focus on clean note separation — each note should ring clearly before you move.",
        },
        {
          num: 2,
          title: "Root position — all 12 keys",
          difficulty: "Beginner",
          color: "text-emerald-400",
          desc: "Play the major root position triad on strings 1–2–3 for all 12 keys, moving up the neck chromatically.",
          steps: [
            "C major root: frets 5-5-3",
            "C# major: 6-6-4",
            "D major: 7-7-5",
            "Continue chromatically to the 12th fret",
            "Repeat for minor triads (each shape shifts back one fret on string 2)",
          ],
          tip: "This exercise also trains your ear — you'll start hearing the root note in each shape.",
        },
        {
          num: 3,
          title: "I – IV – V with voice leading",
          difficulty: "Intermediate",
          color: "text-amber-400",
          desc: "Play the I–IV–V–I progression in any key using smooth inversion choices on strings 1–2–3. Refer to the Voice Leading tab for the inversion map.",
          steps: [
            "I chord: root position",
            "IV chord: 2nd inversion (shared 5th, minimal movement)",
            "V chord: 1st inversion (leading tone on top, pulls to I)",
            "I chord: root position",
            "Now try in G, D, A, and E",
          ],
          tip: "Listen for how the top note barely moves. That sustained-sounding top voice is the hallmark of good voice leading.",
        },
        {
          num: 4,
          title: "Cross string-set movement",
          difficulty: "Intermediate",
          color: "text-amber-400",
          desc: "Play the same triad — same root, same inversion — across all three string sets. Learn to find the same chord sound in three different places on the neck.",
          steps: [
            "G major root position on strings 3–4–5",
            "G major root position on strings 2–3–4",
            "G major root position on strings 1–2–3",
            "Repeat for 1st inversion, then 2nd inversion",
            "Try for C major, E major, A major",
          ],
          tip: "After this exercise you'll have 9 shapes per chord (3 inversions × 3 string sets). That's full neck coverage.",
        },
        {
          num: 5,
          title: "Triad arpeggios",
          difficulty: "Advanced",
          color: "text-rose-400",
          desc: "Play each inversion as an arpeggio (one note at a time, ascending) across all string sets. This builds right-hand precision and harmonic awareness simultaneously.",
          steps: [
            "Pick strings 3-2-1 individually for the root position shape",
            "Ascend through all three inversions on the same string set",
            "Then descend",
            "Repeat starting on string set 2–3–4",
            "Finally connect all six shapes in one ascending run from the low E side to the high e side",
          ],
          tip: "Use alternate picking or fingerpicking. The goal is even tone across all three strings — avoid picking harder on the higher strings.",
        },
      ].map(ex => (
        <div key={ex.num} className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-white/30 text-xs font-mono">Exercise {ex.num}</span>
                <span className={`text-xs font-semibold ${ex.color}`}>{ex.difficulty}</span>
              </div>
              <h3 className="text-white font-semibold">{ex.title}</h3>
            </div>
          </div>
          <p className="text-white/60 text-sm leading-relaxed mb-3">{ex.desc}</p>
          <div className="space-y-1 mb-3">
            {ex.steps.map((s, i) => (
              <div key={i} className="flex gap-2 text-sm">
                <span className="text-purple-400 shrink-0">{i + 1}.</span>
                <span className="text-white/70">{s}</span>
              </div>
            ))}
          </div>
          <Callout type="tip">{ex.tip}</Callout>
        </div>
      ))}

    </div>
  )
}
