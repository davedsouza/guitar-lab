import type { GenreId } from "./genres"
import { SHARP_NAMES, FLAT_NAMES, prefersFlats } from "./theory"
import { BLOW, DRAW, MAX_BEND, POSITIONS, harpForSong, harpShift, tokText } from "../harmonicaData"

export type ScaleId = "major" | "minor" | "majPent" | "minPent" | "blues" | "mixo" | "dorian"

export interface ScaleDef {
  id: ScaleId
  name: string
  steps: number[]
  // Steps used to lay out the guitar and bass positions; the blues scale borrows the minor pentatonic boxes and adds its blue note.
  base: number[]
  // Notes played on each string in a position (2 for 5-note boxes, 3 for 7-note scales).
  per: number
  // Semitones from this scale's root up to the root of the major scale with the same notes (used for note spelling).
  parent: number
  feel: string
  harpPos: string
}

export const SCALES: ScaleDef[] = [
  { id: "majPent", name: "Major pentatonic", steps: [0, 2, 4, 7, 9], base: [0, 2, 4, 7, 9], per: 2, parent: 0, harpPos: "1st",
    feel: "Sweet and safe. Five notes with nothing that clashes. Great for country, folk and pop." },
  { id: "minPent", name: "Minor pentatonic", steps: [0, 3, 5, 7, 10], base: [0, 3, 5, 7, 10], per: 2, parent: 3, harpPos: "2nd",
    feel: "The rock and blues workhorse. Five notes that sound good almost anywhere." },
  { id: "blues", name: "Blues", steps: [0, 3, 5, 6, 7, 10], base: [0, 3, 5, 7, 10], per: 2, parent: 3, harpPos: "2nd",
    feel: "Minor pentatonic plus one gritty extra note (the flat 5). Lean on it, then move on." },
  { id: "major", name: "Major", steps: [0, 2, 4, 5, 7, 9, 11], base: [0, 2, 4, 5, 7, 9, 11], per: 3, parent: 0, harpPos: "1st",
    feel: "The full do-re-mi scale. Bright and happy. Seven notes, so land on chord tones." },
  { id: "minor", name: "Natural minor", steps: [0, 2, 3, 5, 7, 8, 10], base: [0, 2, 3, 5, 7, 8, 10], per: 3, parent: 3, harpPos: "4th",
    feel: "The sad, serious minor scale. Seven notes, darker than Dorian." },
  { id: "mixo", name: "Mixolydian", steps: [0, 2, 4, 5, 7, 9, 10], base: [0, 2, 4, 5, 7, 9, 10], per: 3, parent: 5, harpPos: "2nd",
    feel: "Major with a flat 7. The sound of dominant 7th chords, rock and bluesy major songs." },
  { id: "dorian", name: "Dorian", steps: [0, 2, 3, 5, 7, 9, 10], base: [0, 2, 3, 5, 7, 9, 10], per: 3, parent: 10, harpPos: "3rd",
    feel: "Minor with a lifted 6th. Smooth and funky. Santana, Miles Davis, minor groove tunes." },
]

export const SCALE_BY_ID: Record<ScaleId, ScaleDef> = Object.fromEntries(SCALES.map(s => [s.id, s])) as Record<ScaleId, ScaleDef>

export function isScaleId(v: unknown): v is ScaleId {
  return typeof v === "string" && v in SCALE_BY_ID
}

export const GENRE_SCALES: Record<GenreId, { id: ScaleId; why: string }[]> = {
  blues: [
    { id: "blues", why: "Play it in the song key over the whole 12 bars. The flat 5 is the blue note." },
    { id: "minPent", why: "The safe version. Works over major blues chords too." },
    { id: "majPent", why: "Sweeter, for a happier line. Great over the I chord and in shuffles." },
  ],
  rock: [
    { id: "minPent", why: "Most rock solos start and end here. Stay in one box." },
    { id: "majPent", why: "Brighter classic rock and southern rock lines." },
    { id: "mixo", why: "For riffs built on major chords with a flat 7 (think AC/DC, the Stones)." },
  ],
  country: [
    { id: "majPent", why: "The core country sound. Slide between the notes." },
    { id: "mixo", why: "Adds the flat 7 for twang and truck-driving songs." },
    { id: "major", why: "For melodies and walk-ups between chords." },
  ],
  folk: [
    { id: "majPent", why: "Easy melodic fills over open chords." },
    { id: "major", why: "Most folk melodies live right here." },
    { id: "minor", why: "For the minor-key ballads." },
  ],
  pop: [
    { id: "major", why: "Matches the melody and the chords of most pop songs." },
    { id: "majPent", why: "A safe, catchy way to build hooks and fills." },
    { id: "minor", why: "For the sadder minor-key pop songs." },
  ],
  jazz: [
    { id: "dorian", why: "The go-to scale over a minor 7 chord." },
    { id: "mixo", why: "The go-to scale over a dominant 7 chord." },
    { id: "major", why: "Over major 7 chords. Aim for chord tones on strong beats." },
  ],
  funk: [
    { id: "dorian", why: "Minor 7 groove with that lifted 6th. The funk classic." },
    { id: "minPent", why: "Short punchy licks with space in between." },
    { id: "mixo", why: "Over one-chord dominant 9th vamps." },
  ],
  reggae: [
    { id: "majPent", why: "Gentle, singable lines that leave space." },
    { id: "minPent", why: "For minor-key roots reggae." },
    { id: "mixo", why: "A relaxed major sound with a flat 7." },
  ],
  gospel: [
    { id: "majPent", why: "Soulful fills and turnarounds with gentle slides." },
    { id: "mixo", why: "Over dominant chords and the classic 'amen' feel." },
    { id: "blues", why: "A touch of grit between chords." },
  ],
  alternative: [
    { id: "minPent", why: "Easy, moody riffs and leads." },
    { id: "minor", why: "Darker, fuller lines over minor progressions." },
    { id: "dorian", why: "A little color when the minor key needs lifting." },
  ],
}

export const DEGREE = ["1", "b2", "2", "b3", "3", "4", "b5", "5", "b6", "6", "b7", "7"]

const BLUES_SHARP_ROOTS = new Set([1, 6, 8])

export function flatsFor(root: number, scale: ScaleDef): boolean {
  if (scale.id === "blues") return !BLUES_SHARP_ROOTS.has(root)
  return prefersFlats({ root: (root + scale.parent) % 12, minor: false })
}

export function nameOf(pc: number, flats: boolean): string {
  const i = ((pc % 12) + 12) % 12
  return flats ? FLAT_NAMES[i] : SHARP_NAMES[i]
}

export function scalePcs(root: number, scale: ScaleDef): number[] {
  return scale.steps.map(s => (root + s) % 12)
}

export function degreeOf(pc: number, root: number): string {
  return DEGREE[(((pc - root) % 12) + 12) % 12]
}

export function relativeLine(root: number, scale: ScaleDef): string | null {
  const flats = flatsFor(root, scale)
  const at = (n: number) => nameOf(root + n, flats)
  switch (scale.id) {
    case "major": return `Same notes as ${at(9)} natural minor.`
    case "minor": return `Same notes as ${at(3)} major.`
    case "majPent": return `Same notes as ${at(9)} minor pentatonic.`
    case "minPent": return `Same notes as ${at(3)} major pentatonic.`
    case "mixo": return `Same notes as ${at(5)} major.`
    case "dorian": return `Same notes as ${at(10)} major.`
    default: return "Minor pentatonic plus the flat 5."
  }
}

// ─── Fretboards ──────────────────────────────────────────────────────────────

// Open string pitches, highest string first (string 1 at the top of a tab).
export const GUITAR_TUNING = [64, 59, 55, 50, 45, 40]
export const BASS_TUNING = [43, 38, 33, 28]

export interface FretNote {
  string: number // 1 = highest string
  fret: number
  midi: number
  pc: number
  root: boolean
}

export interface Position {
  label: string
  lo: number
  hi: number
  notes: FretNote[]
}

const mod12 = (n: number) => ((n % 12) + 12) % 12

function mk(tuning: number[], si: number, fret: number, root: number): FretNote {
  const midi = tuning[si] + fret
  return { string: si + 1, fret, midi, pc: mod12(midi), root: mod12(midi - root) === 0 }
}

export function wholeNeck(tuning: number[], root: number, scale: ScaleDef, maxFret = 12): FretNote[] {
  const inScale = new Set(scale.steps)
  const out: FretNote[] = []
  for (let si = 0; si < tuning.length; si++) {
    for (let f = 0; f <= maxFret; f++) {
      if (inScale.has(mod12(tuning[si] + f - root))) out.push(mk(tuning, si, f, root))
    }
  }
  return out
}

// Five-note boxes (and the blues scale) walk up the scale two notes per string. Seven-note scales use a five-fret window that
// starts on each scale note of the lowest string, which keeps every position within one hand stretch.
export function positions(tuning: number[], root: number, scale: ScaleDef): Position[] {
  const base = new Set(scale.base)
  const blue = scale.steps.filter(s => !base.has(s))
  const lowIdx = tuning.length - 1
  const lowOpen = tuning[lowIdx]
  const n = scale.base.length
  const out: Position[] = []

  if (scale.per === 3) {
    const inScale = new Set(scale.steps)
    for (let s = 0; s <= 11; s++) {
      if (!inScale.has(mod12(lowOpen + s - root))) continue
      const notes: FretNote[] = []
      for (let si = tuning.length - 1; si >= 0; si--) {
        for (let f = s; f <= s + 4; f++) if (inScale.has(mod12(tuning[si] + f - root))) notes.push(mk(tuning, si, f, root))
      }
      out.push({ label: "", lo: s, hi: s + 4, notes })
    }
  } else {
    const ladder: number[] = []
    for (let m = lowOpen; m < lowOpen + 12 * 4; m++) if (base.has(mod12(m - root))) ladder.push(m)
    for (let k = 0; k < n; k++) {
      for (const shift of [0, n]) {
        const picked: FretNote[] = []
        let ok = true
        for (let j = 0; j < tuning.length && ok; j++) {
          const si = lowIdx - j
          for (let q = 0; q < scale.per; q++) {
            const m = ladder[k + shift + j * scale.per + q]
            const fret = m === undefined ? -1 : m - tuning[si]
            if (fret < 0 || fret > 17) { ok = false; break }
            picked.push(mk(tuning, si, fret, root))
          }
        }
        if (!ok) continue
        const lo = Math.min(...picked.map(p => p.fret))
        let hi = Math.max(...picked.map(p => p.fret))
        if (blue.length) {
          const extras = new Set(blue)
          for (let si = 0; si < tuning.length; si++) {
            for (let f = lo; f <= hi; f++) if (extras.has(mod12(tuning[si] + f - root))) picked.push(mk(tuning, si, f, root))
          }
        }
        picked.sort((a, b) => b.string - a.string || a.fret - b.fret)
        if (hi - lo < 3) hi = lo + 3
        out.push({ label: "", lo, hi, notes: picked })
        break
      }
    }
  }

  out.sort((a, b) => a.lo - b.lo)
  const seen = new Set<string>()
  const unique = out.filter(p => {
    const key = p.notes.map(x => `${x.string}.${x.fret}`).join(",")
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
  unique.forEach((p, i) => { p.label = `Pos ${i + 1}` })
  return unique
}

export function runTab(kind: "guitar" | "bass", notes: FretNote[]) {
  const cols = notes.map(n => `${n.string}${n.fret}`)
  const bars: string[] = []
  for (let i = 0; i < cols.length; i += 8) bars.push(cols.slice(i, i + 8).join(" "))
  return { kind, chords: bars.map(() => ""), bars, caption: "" }
}

// ─── Harmonica ───────────────────────────────────────────────────────────────

export interface HarpCell {
  hole: number
  draw: boolean
  bend: number
  midi: number
  pc: number
  inScale: boolean
  root: boolean
  tok: string
}

export function harpGrid(harpKey: number, root: number, scale: ScaleDef): HarpCell[] {
  const shift = harpShift(harpKey)
  const inScale = new Set(scale.steps)
  const out: HarpCell[] = []
  for (let hole = 1; hole <= 10; hole++) {
    for (const draw of [false, true]) {
      const max = (draw ? MAX_BEND.draw : MAX_BEND.blow)[hole - 1]
      for (let bend = 0; bend <= max; bend++) {
        const midi = (draw ? DRAW : BLOW)[hole - 1] - bend + shift
        const rel = mod12(midi - root)
        out.push({ hole, draw, bend, midi, pc: mod12(midi), inScale: inScale.has(rel), root: rel === 0, tok: tokText(draw, hole, bend) })
      }
    }
  }
  return out
}

// One octave of the scale, from the lowest unbent root, using bends only where a note is not otherwise there.
export function harpRun(harpKey: number, root: number, scale: ScaleDef): HarpCell[] {
  const cells = harpGrid(harpKey, root, scale).filter(c => c.inScale)
  const best = new Map<number, HarpCell>()
  for (const c of cells) {
    const cur = best.get(c.midi)
    if (!cur || c.bend < cur.bend) best.set(c.midi, c)
  }
  const roots = [...best.values()].filter(c => c.root).sort((a, b) => a.midi - b.midi)
  const start = roots.find(c => c.bend === 0) ?? roots[0]
  if (!start) return []
  return [...best.values()].filter(c => c.midi >= start.midi && c.midi <= start.midi + 12).sort((a, b) => a.midi - b.midi)
}

export function harpTab(run: HarpCell[]) {
  const cols = run.map(c => `${c.draw ? 2 : 1}${c.hole}${"'".repeat(c.bend)}`)
  const bars: string[] = []
  for (let i = 0; i < cols.length; i += 8) bars.push(cols.slice(i, i + 8).join(" "))
  return { kind: "harp" as const, chords: bars.map(() => ""), bars, caption: "" }
}

export const HARP_POSITION_NS = ["1st", "2nd", "3rd", "4th"]

export function harpKeyFor(root: number, posN: string): number {
  const pos = POSITIONS.find(p => p.n === posN) ?? POSITIONS[1]
  return harpForSong(root, pos)
}

// ─── Hearing it ──────────────────────────────────────────────────────────────

// Octave the scale is played in for each instrument. Root lands at or just above these pitches.
const REGISTER: Record<string, number> = { guitar: 52, bass: 38, piano: 60 }

export function scaleMidis(root: number, scale: ScaleDef, instrument: "guitar" | "bass" | "piano"): number[] {
  const floor = REGISTER[instrument]
  const start = floor + mod12(root - floor)
  const up = [...scale.steps, 12].map(s => start + s)
  return [...up, ...up.slice(0, -1).reverse()]
}
