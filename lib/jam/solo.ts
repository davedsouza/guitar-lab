import { chordInfo, type ChordInfo } from "./tabs"
import { GUITAR_TUNING, type FretNote } from "./scales"

export type Role = "R" | "3" | "5" | "7"

export interface ToneNote extends FretNote {
  role: Role
}

export interface Window {
  lo: number
  hi: number
  label: string
  sub: string
}

export const WINDOWS: Window[] = [
  { lo: 0, hi: 4, label: "Frets 0-4", sub: "open" },
  { lo: 3, hi: 7, label: "Frets 3-7", sub: "low" },
  { lo: 5, hi: 9, label: "Frets 5-9", sub: "middle" },
  { lo: 7, hi: 11, label: "Frets 7-11", sub: "middle" },
  { lo: 9, hi: 13, label: "Frets 9-13", sub: "high" },
  { lo: 12, hi: 16, label: "Frets 12-16", sub: "highest" },
]

const mod12 = (n: number) => ((n % 12) + 12) % 12

export function roleOf(info: ChordInfo, pc: number): Role | null {
  if (pc === info.root) return "R"
  if (info.third !== null && pc === info.third) return "3"
  if (info.seventh !== null && pc === info.seventh) return "7"
  if (pc === info.fifth) return "5"
  return null
}

export function roleName(info: ChordInfo, role: Role, sym: string): string {
  if (role === "R") return "root"
  if (role === "5") return "5th"
  if (role === "3") {
    const d = info.third === null ? 4 : mod12(info.third - info.root)
    return d === 2 ? "2nd" : d === 5 ? "4th" : "3rd"
  }
  if (info.seventh === null) return "7th"
  const d = mod12(info.seventh - info.root)
  return d === 9 && !/dim|°/.test(sym) ? "6th" : "7th"
}

export function chordToneNotes(sym: string, lo: number, hi: number): ToneNote[] {
  const info = chordInfo(sym)
  if (!info) return []
  const out: ToneNote[] = []
  GUITAR_TUNING.forEach((open, si) => {
    for (let f = lo; f <= hi; f++) {
      const midi = open + f
      const pc = mod12(midi)
      const role = roleOf(info, pc)
      if (role) out.push({ string: si + 1, fret: f, midi, pc, root: role === "R", role })
    }
  })
  return out
}

export interface GuideMove {
  from: { pc: number; role: Role }
  to: { pc: number; role: Role }
  semis: number
  direction: "same" | "up" | "down"
}

// The shortest step between the 3rds and 7ths of one chord and the 3rd or 7th of the next
export function guideMove(cur: string, next: string): GuideMove | null {
  const a = chordInfo(cur)
  const b = chordInfo(next)
  if (!a || !b) return null
  const pick = (i: ChordInfo): { pc: number; role: Role }[] => {
    const out: { pc: number; role: Role }[] = []
    if (i.third !== null) out.push({ pc: i.third, role: "3" })
    if (i.seventh !== null) out.push({ pc: i.seventh, role: "7" })
    if (out.length === 0) out.push({ pc: i.root, role: "R" })
    return out
  }
  let best: GuideMove | null = null
  let bestScore = 99
  for (const f of pick(a)) {
    for (const t of pick(b)) {
      const up = mod12(t.pc - f.pc)
      const down = 12 - up
      const semis = Math.min(up, down)
      const score = (semis === 0 ? 3 : semis * 2) + (t.role === "3" ? 0 : 1) + (f.role === "7" && t.role === "3" ? -0.5 : 0)
      if (score < bestScore) {
        bestScore = score
        best = { from: f, to: t, semis, direction: semis === 0 ? "same" : up <= down ? "up" : "down" }
      }
    }
  }
  return best
}

function nearestBy<T>(items: T[], score: (t: T) => number): T | null {
  let best: T | null = null
  let bs = Infinity
  for (const t of items) {
    const s = score(t)
    if (s < bs) { bs = s; best = t }
  }
  return best
}

export interface Cue {
  move: GuideMove
  from: ToneNote | null
  target: ToneNote | null
  approach: FretNote | null
}

// Finds where the move sits in the player's hand position: start near the middle of the window and aim for the closest target.
export function cueFor(cur: string, next: string, lo: number, hi: number): Cue | null {
  const move = guideMove(cur, next)
  if (!move) return null
  const mid = (lo + hi) / 2
  const here = chordToneNotes(cur, lo, hi).filter(n => n.pc === move.from.pc)
  const there = chordToneNotes(next, lo, hi).filter(n => n.pc === move.to.pc)
  let from: ToneNote | null = null
  let target: ToneNote | null = null
  let bestCost = Infinity
  for (const a of here) {
    for (const b of there) {
      const cost = Math.abs(b.midi - a.midi) * 10 + Math.abs(a.fret - mid) + Math.abs(b.fret - mid)
      if (cost < bestCost) { bestCost = cost; from = a; target = b }
    }
  }
  if (!target) target = nearestBy(there, n => Math.abs(n.fret - mid))
  let approach: FretNote | null = null
  if (target && target.fret > 0) {
    const midi = target.midi - 1
    approach = { string: target.string, fret: target.fret - 1, midi, pc: mod12(midi), root: false }
  }
  return { move, from, target, approach }
}

export function stepWords(move: GuideMove): string {
  if (move.semis === 0) return "the same note"
  const dir = move.direction === "up" ? "up" : "down"
  if (move.semis === 1) return `a half step ${dir}`
  if (move.semis === 2) return `a whole step ${dir}`
  return `${move.semis} half steps ${dir}`
}

export function spellFlats(chords: string[], fallback: boolean): boolean {
  const written = chords.map(c => /^[A-G]([#b♯♭]?)/.exec(c)?.[1] ?? "")
  if (written.some(a => a === "b" || a === "♭")) return true
  if (written.some(a => a === "#" || a === "♯")) return false
  return fallback
}

export interface Exercise {
  id: string
  title: string
  short: string
  steps: string[]
  listen: string
}

export const EXERCISES: Exercise[] = [
  {
    id: "roots",
    title: "Roots only",
    short: "Roots",
    steps: [
      "Play only the root of each chord, once, right as the chord changes. Rest for the other three beats.",
      "Use the amber dots. Keep your hand in one spot and let your ears find the new root.",
    ],
    listen: "You should hear each change land. If a root sounds wrong, you moved too early or too late.",
  },
  {
    id: "thirds",
    title: "Land on the 3rd",
    short: "3rds",
    steps: [
      "Now play the 3rd of each chord on beat 1 instead of the root. The 3rd is the note that makes a chord sound major or minor.",
      "Hold it for the whole bar, then move to the 3rd of the next chord. Watch how little your hand has to travel.",
    ],
    listen: "Even a single held note now tells the listener which chord is playing.",
  },
  {
    id: "wander",
    title: "Land, then wander",
    short: "Wander",
    steps: [
      "Play any note from the pentatonic box on beats 2, 3 and 4. Use the faint dots.",
      "On beat 1 of the next bar, land on a chord tone. Aim for the 3rd, or the 7th if the chord has one.",
    ],
    listen: "The wandering can be loose. The landing is what makes it sound planned.",
  },
  {
    id: "approach",
    title: "Half-step approach",
    short: "Approach",
    steps: [
      "On beat 4, play the note one fret below your target. It is the outlined dot.",
      "Step up onto the target on beat 1 of the next bar. The tension in that half step is what you hear resolve.",
    ],
    listen: "A note one fret away feels like it has to move. You are using that pull on purpose.",
  },
  {
    id: "arpeggio",
    title: "Arpeggios through the changes",
    short: "Arpeggios",
    steps: [
      "Play the chord tones one at a time, going up, one per beat: root, 3rd, 5th, 7th.",
      "On the next chord, start from whichever tone is nearest to where you ended. Do not jump back to the root.",
    ],
    listen: "You are outlining each chord yourself. The band could stop and the changes would still be clear.",
  },
  {
    id: "contrast",
    title: "Pentatonic vs chord tones",
    short: "Compare",
    steps: [
      "Play one loop using only the pentatonic box (faint dots) and ignore the chords.",
      "Play it again, but land every bar on a bright chord tone. Compare how the two loops sound.",
    ],
    listen: "The box keeps you safe. The chord tones show the harmony. The best solos move between the two.",
  },
]
