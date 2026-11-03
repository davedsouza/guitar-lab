import { diatonicChords, noteName, prefersFlats, type DiatonicChord, type KeyRef } from "./theory"

// Position 0 is C at the top; each step clockwise goes up a fifth.
export const CIRCLE_SIZE = 12

export const posOfMajor = (root: number) => (((root % 12) * 7) % 12 + 12) % 12
export const majorRootAt = (pos: number) => (((pos % 12) + 12) % 12 * 7) % 12
export const minorRootAt = (pos: number) => (majorRootAt(pos) + 9) % 12

export function posOfKey(k: KeyRef): number {
  return posOfMajor(k.minor ? (k.root + 3) % 12 : k.root)
}

const mod = (n: number) => ((n % CIRCLE_SIZE) + CIRCLE_SIZE) % CIRCLE_SIZE

// Count and kind of accidentals for the key at this position. Position 6 is spelled with flats (Gb major, Ebm).
export function signature(pos: number): { count: number; kind: "sharp" | "flat" | "none" } {
  const p = mod(pos)
  if (p === 0) return { count: 0, kind: "none" }
  if (p <= 5) return { count: p, kind: "sharp" }
  return { count: 12 - p, kind: "flat" }
}

const SHARP_ORDER = ["F#", "C#", "G#", "D#", "A#", "E#", "B#"]
const FLAT_ORDER = ["Bb", "Eb", "Ab", "Db", "Gb", "Cb", "Fb"]

export function accidentals(pos: number): string[] {
  const s = signature(pos)
  return s.kind === "sharp" ? SHARP_ORDER.slice(0, s.count) : s.kind === "flat" ? FLAT_ORDER.slice(0, s.count) : []
}

export function keyAt(pos: number, minor: boolean): KeyRef {
  return { root: minor ? minorRootAt(pos) : majorRootAt(pos), minor }
}

export function circleLabel(pos: number, minor: boolean): string[] {
  if (mod(pos) === 6) return minor ? ["D#m", "Ebm"] : ["F#", "Gb"]
  const k = keyAt(pos, minor)
  return [noteName(k.root, prefersFlats(k)) + (minor ? "m" : "")]
}

export type Role = "tonic" | "sub" | "dom" | "minor" | "none"

// Role of each circle segment relative to the selected key. The selected ring gets home, IV and V; the other ring gets their relatives.
export function roleAt(pos: number, minor: boolean, selPos: number, selMinor: boolean): Role {
  const d = mod(pos - selPos)
  if (d !== 0 && d !== 11 && d !== 1) return "none"
  if (minor !== selMinor) return "minor"
  return d === 0 ? "tonic" : d === 11 ? "sub" : "dom"
}

export interface DegreeChord extends DiatonicChord {
  roman: string
}

// Seven chords of the key starting on its own tonic.
export function chordsFor(key: KeyRef): DegreeChord[] {
  const d = diatonicChords(key)
  if (!key.minor) return d
  const order = [5, 6, 0, 1, 2, 3, 4]
  const romans = ["i", "ii°", "III", "iv", "v", "VI", "VII"]
  return order.map((i, n) => ({ ...d[i], roman: romans[n] }))
}

export interface Progression { name: string; where: string; romans: string[] }

export const MAJOR_PROGRESSIONS: Progression[] = [
  { name: "I  IV  V", where: "Rock, blues, folk, country", romans: ["I", "IV", "V"] },
  { name: "I  V  vi  IV", where: "Pop", romans: ["I", "V", "vi", "IV"] },
  { name: "I  vi  IV  V", where: "50s and doo-wop", romans: ["I", "vi", "IV", "V"] },
  { name: "ii  V  I", where: "Jazz and standards", romans: ["ii", "V", "I"] },
]

export const MINOR_PROGRESSIONS: Progression[] = [
  { name: "i  VI  III  VII", where: "Pop and rock", romans: ["i", "VI", "III", "VII"] },
  { name: "i  iv  v", where: "Folk and blues-rock", romans: ["i", "iv", "v"] },
  { name: "i  VII  VI  VII", where: "Driving minor rock", romans: ["i", "VII", "VI", "VII"] },
]
