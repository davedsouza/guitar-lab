import { CHORD_VOICINGS } from "@/lib/chordShapes"
import { SHARP_NAMES, noteName, prefersFlats } from "./theory"

export interface Tuning {
  id: string
  label: string
  strings: string
  /** MIDI note per string, low to high */
  midi: number[]
}

export const TUNINGS: Tuning[] = [
  { id: "standard", label: "Standard", strings: "E A D G B E", midi: [40, 45, 50, 55, 59, 64] },
  { id: "dropd", label: "Drop D", strings: "D A D G B E", midi: [38, 45, 50, 55, 59, 64] },
  { id: "dadgad", label: "DADGAD", strings: "D A D G A D", midi: [38, 45, 50, 55, 57, 62] },
  { id: "openg", label: "Open G", strings: "D G D G B D", midi: [38, 43, 50, 55, 59, 62] },
  { id: "opend", label: "Open D", strings: "D A D F# A D", midi: [38, 45, 50, 54, 57, 62] },
  { id: "halfdown", label: "Half step down", strings: "Eb Ab Db Gb Bb Eb", midi: [39, 44, 49, 54, 58, 63] },
]

/** One entry per string, low to high. null = muted, 0 = open, n = fret. */
export type Shape = (number | null)[]

export interface ChordType {
  suffix: string
  long: string
  intervals: number[]
  degrees: string[]
  cost: number
}

export const CHORD_TYPES: ChordType[] = [
  { suffix: "", long: "major", intervals: [0, 4, 7], degrees: ["1", "3", "5"], cost: 0 },
  { suffix: "m", long: "minor", intervals: [0, 3, 7], degrees: ["1", "♭3", "5"], cost: 0 },
  { suffix: "5", long: "power chord", intervals: [0, 7], degrees: ["1", "5"], cost: 1 },
  { suffix: "7", long: "dominant seventh", intervals: [0, 4, 7, 10], degrees: ["1", "3", "5", "♭7"], cost: 2 },
  { suffix: "maj7", long: "major seventh", intervals: [0, 4, 7, 11], degrees: ["1", "3", "5", "7"], cost: 2 },
  { suffix: "m7", long: "minor seventh", intervals: [0, 3, 7, 10], degrees: ["1", "♭3", "5", "♭7"], cost: 2 },
  { suffix: "sus4", long: "suspended fourth", intervals: [0, 5, 7], degrees: ["1", "4", "5"], cost: 2 },
  { suffix: "sus2", long: "suspended second", intervals: [0, 2, 7], degrees: ["1", "2", "5"], cost: 2 },
  { suffix: "dim", long: "diminished", intervals: [0, 3, 6], degrees: ["1", "♭3", "♭5"], cost: 3 },
  { suffix: "aug", long: "augmented", intervals: [0, 4, 8], degrees: ["1", "3", "♯5"], cost: 3 },
  { suffix: "6", long: "major sixth", intervals: [0, 4, 7, 9], degrees: ["1", "3", "5", "6"], cost: 3 },
  { suffix: "m6", long: "minor sixth", intervals: [0, 3, 7, 9], degrees: ["1", "♭3", "5", "6"], cost: 3 },
  { suffix: "add9", long: "major add nine", intervals: [0, 2, 4, 7], degrees: ["1", "9", "3", "5"], cost: 4 },
  { suffix: "madd9", long: "minor add nine", intervals: [0, 2, 3, 7], degrees: ["1", "9", "♭3", "5"], cost: 4 },
  { suffix: "7sus4", long: "dominant seventh suspended", intervals: [0, 5, 7, 10], degrees: ["1", "4", "5", "♭7"], cost: 4 },
  { suffix: "dim7", long: "diminished seventh", intervals: [0, 3, 6, 9], degrees: ["1", "♭3", "♭5", "♭♭7"], cost: 4 },
  { suffix: "m7b5", long: "half-diminished", intervals: [0, 3, 6, 10], degrees: ["1", "♭3", "♭5", "♭7"], cost: 4 },
  { suffix: "mMaj7", long: "minor major seventh", intervals: [0, 3, 7, 11], degrees: ["1", "♭3", "5", "7"], cost: 5 },
  { suffix: "9", long: "dominant ninth", intervals: [0, 2, 4, 7, 10], degrees: ["1", "9", "3", "5", "♭7"], cost: 5 },
  { suffix: "maj9", long: "major ninth", intervals: [0, 2, 4, 7, 11], degrees: ["1", "9", "3", "5", "7"], cost: 5 },
  { suffix: "m9", long: "minor ninth", intervals: [0, 2, 3, 7, 10], degrees: ["1", "9", "♭3", "5", "♭7"], cost: 5 },
]

export interface NoteRole {
  pc: number
  name: string
  degree: string
}

export interface Match {
  name: string
  long: string
  root: number
  rootName: string
  bass: number | null
  bassName: string | null
  slash: boolean
  omitsFifth: boolean
  notes: NoteRole[]
  score: number
  reason: string
}

export function pcsOfShape(shape: Shape, tuning: number[]): { pcs: number[]; bass: number | null; sounding: { string: number; midi: number; pc: number }[] } {
  const sounding = shape
    .map((f, i) => (f === null ? null : { string: i, midi: tuning[i] + f, pc: (tuning[i] + f) % 12 }))
    .filter((x): x is { string: number; midi: number; pc: number } => x !== null)
  if (sounding.length === 0) return { pcs: [], bass: null, sounding }
  const lowest = sounding.reduce((a, b) => (b.midi < a.midi ? b : a))
  return { pcs: Array.from(new Set(sounding.map(s => s.pc))), bass: lowest.pc, sounding }
}

const isMinorish = (t: ChordType) => /^(m(?!aj)|dim)/.test(t.suffix) || t.suffix === "m7b5"

export function spell(pc: number, root: number, t: ChordType): string {
  return noteName(pc, prefersFlats({ root, minor: isMinorish(t) }))
}

function toMatch(root: number, t: ChordType, omitsFifth: boolean, pcs: number[], bass: number | null, score: number): Match {
  const flats = prefersFlats({ root, minor: isMinorish(t) })
  const rootName = noteName(root, flats)
  const slash = bass !== null && bass !== root
  const bassName = bass === null ? null : noteName(bass, flats)
  const notes = pcs
    .map(pc => {
      const i = t.intervals.indexOf((pc - root + 120) % 12)
      return { pc, name: noteName(pc, flats), degree: i >= 0 ? t.degrees[i] : "?", iv: (pc - root + 120) % 12 }
    })
    .sort((a, b) => a.iv - b.iv)
    .map(({ pc, name, degree }) => ({ pc, name, degree }))
  const base = rootName + t.suffix + (slash ? "/" + bassName : "")
  return {
    name: base,
    long: `${rootName} ${t.long}`,
    root,
    rootName,
    bass,
    bassName,
    slash,
    omitsFifth,
    notes,
    score,
    reason: slash
      ? `The same notes, heard from ${rootName} as home, with ${bassName} in the bass.`
      : omitsFifth
        ? "The fifth is left out, which is common on guitar."
        : "Every note fits.",
  }
}

export function identify(pcs: number[], bass: number | null): Match[] {
  const set = Array.from(new Set(pcs))
  if (set.length < 2) return []
  const out: Match[] = []
  for (const root of set) {
    const rel = new Set(set.map(pc => (pc - root + 120) % 12))
    for (const t of CHORD_TYPES) {
      const exact = t.intervals.length === rel.size && t.intervals.every(i => rel.has(i))
      const noFifth = t.intervals.length >= 4 && t.intervals.includes(7)
      const short = noFifth ? t.intervals.filter(i => i !== 7) : []
      const omit = !exact && noFifth && short.length === rel.size && short.every(i => rel.has(i))
      if (!exact && !omit) continue
      if (omit && t.intervals.length >= 5 && bass !== root) continue
      let score = exact ? 100 : t.intervals.length >= 5 ? 70 : 82
      if (bass !== null) score += bass === root ? 12 : -4
      score -= t.cost
      out.push(toMatch(root, t, omit, set, bass, score))
    }
  }
  return out.sort((a, b) => b.score - a.score || a.name.length - b.name.length).slice(0, 6)
}

/** Typed notes (bass first) stacked upward from around the low E, as MIDI numbers. */
export function stackNotes(pcs: number[]): number[] {
  if (pcs.length === 0) return []
  let m = 40 + ((pcs[0] - 40) % 12 + 12) % 12
  const out = [m]
  for (const pc of pcs.slice(1)) {
    do m++
    while (m % 12 !== pc)
    out.push(m)
  }
  return out
}

export interface Closest {
  dropped: string
  match: Match
}

/** When nothing fits: the best name you get by leaving out one note. */
export function closest(pcs: number[], bass: number | null): Closest[] {
  const set = Array.from(new Set(pcs))
  if (set.length < 4) return []
  const seen = new Set<string>()
  const out: Closest[] = []
  for (const drop of set) {
    const rest = set.filter(p => p !== drop)
    const top = identify(rest, bass === drop ? null : bass)[0]
    if (!top || seen.has(top.name)) continue
    seen.add(top.name)
    out.push({ dropped: noteName(drop, false), match: top })
  }
  return out.sort((a, b) => b.match.score - a.match.score).slice(0, 3)
}

export interface Completion {
  chord: string
  adds: string
}

/** For one or two notes: chords that contain them, and which note would finish each. */
export function completions(pcs: number[]): Completion[] {
  const set = Array.from(new Set(pcs))
  if (set.length === 0 || set.length > 2) return []
  const found: { chord: string; adds: string; cost: number }[] = []
  for (let root = 0; root < 12; root++) {
    for (const t of CHORD_TYPES) {
      if (t.intervals.length !== 3) continue
      const notes = t.intervals.map(i => (root + i) % 12)
      if (!set.every(p => notes.includes(p))) continue
      const missing = notes.filter(n => !set.includes(n))
      found.push({
        chord: noteName(root, prefersFlats({ root, minor: isMinorish(t) })) + t.suffix,
        adds: missing.map(n => spell(n, root, t)).join(" + "),
        cost: t.cost,
      })
    }
  }
  return found.sort((a, b) => a.cost - b.cost).slice(0, 8).map(({ chord, adds }) => ({ chord, adds }))
}

// ─── Shape facts ──────────────────────────────────────────────────────────────

export function describeShape(shape: Shape): string | null {
  const played = shape.filter((f): f is number => f !== null)
  if (played.length < 2) return null
  if (played.some(f => f === 0)) return "Open shape"
  const fretted = played.filter(f => f > 0)
  const low = Math.min(...fretted)
  const atLow = shape.filter(f => f === low).length
  return atLow >= 3 ? "Barre chord" : "Movable shape"
}

const QUALITY_SUFFIX: Record<string, string> = {
  Major: "", Minor: "m", "Dominant 7th": "7", "Major 7th": "maj7", "Minor 7th": "m7", Diminished: "dim", Augmented: "aug", Sus4: "sus4",
}

export function knownShape(shape: Shape): { name: string; position: string } | null {
  const want = shape.map(f => (f === null ? "x" : String(f))).join(",")
  for (const root of Object.keys(CHORD_VOICINGS)) {
    for (const [quality, voicings] of Object.entries(CHORD_VOICINGS[root])) {
      for (const v of voicings) {
        if (v.fingers.map(f => String(f)).join(",") === want) {
          const suffix = QUALITY_SUFFIX[quality] ?? ""
          return { name: root + suffix, position: v.position }
        }
      }
    }
  }
  return null
}

export function shapeFromFingers(fingers: (number | string)[]): Shape {
  return fingers.map(f => (typeof f === "number" ? f : f === "x" || f === "X" ? null : Number(f)))
}

export { SHARP_NAMES }
