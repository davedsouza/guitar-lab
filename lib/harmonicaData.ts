import type { TabSpec } from "@/lib/jam/tabs"

// Richter-tuned 10-hole diatonic harmonica. All pitches are MIDI numbers for a C harp (C4 = 60).
// A harp in another key is the same layout shifted by harpShift().

export const KEY_NAMES = ["C", "Db", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"]
export const noteName = (m: number) => KEY_NAMES[((m % 12) + 12) % 12]
export const octaveOf = (m: number) => Math.floor(m / 12) - 1

// Standard harps run C up to F#, then G, A, Bb... sit an octave lower so every key stays in the same range.
export const harpShift = (keyIdx: number) => (keyIdx <= 6 ? keyIdx : keyIdx - 12)

export const BLOW = [60, 64, 67, 72, 76, 79, 84, 88, 91, 96]
export const DRAW = [62, 67, 71, 74, 77, 81, 83, 86, 89, 93]

// Largest bend in half steps for each hole (index 0 = hole 1).
export const MAX_BEND = {
  blow: [0, 0, 0, 0, 0, 0, 0, 1, 1, 2],
  draw: [1, 2, 3, 1, 1, 1, 0, 0, 0, 0],
}

export interface Tok { draw: boolean; from: number; to: number; bend: number }

// 4 = blow 4, -4 = draw 4, -3' = draw 3 half step bend, -3'' = whole step, 4-6 = blow chord on holes 4 to 6, -4-6 = draw chord.
export function parseTok(t: string): Tok | null {
  const m = /^(-?)(\d+)(?:-(\d+))?('{0,3})$/.exec(t)
  if (!m) return null
  const from = Number(m[2])
  const to = m[3] ? Number(m[3]) : from
  return { draw: m[1] === "-", from, to, bend: m[4].length }
}

export function tokOk(t: Tok): boolean {
  if (t.from < 1 || t.to > 10 || t.to < t.from) return false
  if (t.to > t.from && (t.bend > 0 || t.to - t.from > 3)) return false
  if (t.bend === 0) return true
  return t.bend <= (t.draw ? MAX_BEND.draw : MAX_BEND.blow)[t.from - 1]
}

export function holeMidi(hole: number, draw: boolean, bend: number, keyIdx: number): number {
  return (draw ? DRAW : BLOW)[hole - 1] - bend + harpShift(keyIdx)
}

export function tokMidi(t: Tok, keyIdx: number): number[] {
  const out: number[] = []
  for (let h = t.from; h <= t.to; h++) out.push(holeMidi(h, t.draw, t.bend, keyIdx))
  return out
}

export const tokText = (draw: boolean, hole: number, bend: number) => `${draw ? "-" : ""}${hole}${"'".repeat(bend)}`

export const bendName = (b: number) => (b === 1 ? "half step" : b === 2 ? "whole step" : "step and a half")

export interface Lick {
  id: string
  title: string
  note: string
  bars: string[]
  labels?: string[]
  holds?: boolean
  tonic?: number
  pool?: number[]
  ends?: number[]
}

// Tab image spec. Row 1 = blow, row 2 = draw; "." is a rest (or a held note when the lick has holds).
export function toTabSpec(l: Lick): TabSpec {
  const bars = l.bars.map(bar =>
    bar.trim().split(/\s+/).map(col => {
      if (col === ".") return "."
      const t = parseTok(col)
      if (!t) throw new Error("bad token " + col)
      const text = (t.to > t.from ? `${t.from}-${t.to}` : `${t.from}`) + "'".repeat(t.bend)
      return `${t.draw ? 2 : 1}${text}`
    }).join(" ")
  )
  return { kind: "harp", chords: l.labels ?? l.bars.map(() => ""), bars, caption: l.title }
}

export interface Step { midis: number[]; at: number; len: number }

// Beats are quarter notes. A bar of 4 columns = one beat each; a bar of 8 = half a beat each.
export function lickSteps(l: Lick, keyIdx: number): Step[] {
  const steps: Step[] = []
  let beat = 0
  for (const bar of l.bars) {
    const cols = bar.trim().split(/\s+/)
    const per = 4 / cols.length
    for (const col of cols) {
      if (col === ".") {
        if (l.holds && steps.length) steps[steps.length - 1].len += per
      } else {
        const t = parseTok(col)
        if (t) steps.push({ midis: tokMidi(t, keyIdx), at: beat, len: per })
      }
      beat += per
    }
  }
  return steps
}

// ─── Melodies (public domain), written for a C harp in 1st position ──────────

export interface Tune { id: string; title: string; note: string; bars: string[]; tip: string }

const PITCH: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }
export const pitchOf = (n: string) => 12 * (Number(n.slice(1)) + 1) + PITCH[n[0]]

export function holeFor(midi: number): string | null {
  for (let h = 0; h < 10; h++) if (BLOW[h] === midi) return String(h + 1)
  for (let h = 0; h < 10; h++) if (DRAW[h] === midi) return `-${h + 1}`
  return null
}

export const TUNES: Tune[] = [
  {
    id: "mary",
    title: "Mary Had a Little Lamb",
    note: "Traditional. Four notes: 4, -4, 5 and 6.",
    bars: ["E5 D5 C5 D5", "E5 E5 E5 .", "D5 D5 D5 .", "E5 G5 G5 .", "E5 D5 C5 D5", "E5 E5 E5 E5", "D5 D5 E5 D5", "C5 . . ."],
    tip: "An empty beat means keep holding the note before it. Breathe in those gaps, not mid-phrase.",
  },
  {
    id: "twinkle",
    title: "Twinkle, Twinkle, Little Star",
    note: "Traditional. The first four lines of the tune. Adds draw 5 and draw 6.",
    bars: ["C5 C5 G5 G5", "A5 A5 G5 .", "F5 F5 E5 E5", "D5 D5 C5 .", "G5 G5 F5 F5", "E5 E5 D5 .", "G5 G5 F5 F5", "E5 E5 D5 ."],
    tip: "Hole 6 blow then draw 6 is the jump that trips people up. Slide, don't hop.",
  },
  {
    id: "ode",
    title: "Ode to Joy",
    note: "Beethoven, public domain. Rhythm simplified to even beats.",
    bars: ["E5 E5 F5 G5", "G5 F5 E5 D5", "C5 C5 D5 E5", "E5 D5 D5 .", "E5 E5 F5 G5", "G5 F5 E5 D5", "C5 C5 D5 E5", "D5 C5 C5 ."],
    tip: "The real tune has a long-short rhythm at the end of each line. Learn the notes first, then listen and add it.",
  },
  {
    id: "susanna",
    title: "Oh! Susanna",
    note: "Stephen Foster, 1848. First two lines, rhythm simplified.",
    bars: ["C5 D5 E5 G5", "G5 A5 G5 E5", "C5 D5 E5 E5", "D5 C5 D5 ."],
    tip: "Folk players use this style of tune a lot. The same notes work on a harp in any key.",
  },
  {
    id: "jingle",
    title: "Jingle Bells (chorus, first line)",
    note: "James Lord Pierpont, 1857. One line, all on blow 5 until the jump.",
    bars: ["E5 E5 E5 .", "E5 E5 E5 .", "E5 G5 C5 D5", "E5 . . ."],
    tip: "Four repeated blow 5s are a great test of steady air. Keep each one the same loudness.",
  },
]

export function tuneToLick(t: Tune): Lick {
  const bars = t.bars.map(b => b.split(" ").map(n => (n === "." ? "." : holeFor(pitchOf(n)) ?? "?")).join(" "))
  return { id: t.id, title: t.title, note: t.note, bars, holds: true, tonic: 0, pool: [0, 2, 4, 5, 7, 9, 11], ends: [0, 2, 4] }
}

// ─── Positions and the key finder ────────────────────────────────────────────

export interface Position {
  n: string
  name: string
  mode: string
  up: number
  feel: string
  home: string
}

// up = semitones from the harp key to the song's home note.
export const POSITIONS: Position[] = [
  { n: "1st", name: "Straight harp", mode: "Major (Ionian)", up: 0, feel: "Bright and folky. Melodies, kids' songs, Celtic tunes.", home: "Blow 4 (also blow 1, 7 and 10)" },
  { n: "2nd", name: "Cross harp", mode: "Mixolydian (blues major)", up: 7, feel: "The blues, rock and country workhorse. Draw notes lean on the dominant 7th sound.", home: "Draw 2 (also blow 3, 6 and 9)" },
  { n: "3rd", name: "Slant harp", mode: "Dorian (minor)", up: 2, feel: "Minor blues, soul, funk. Smooth and a little jazzy.", home: "Draw 4 (also draw 1 and 8)" },
  { n: "4th", name: "Natural minor", mode: "Aeolian (natural minor)", up: 9, feel: "Dark, sad minor songs and slow blues.", home: "Draw 6 (also draw 10)" },
  { n: "5th", name: "Phrygian", mode: "Phrygian", up: 4, feel: "Spanish-tinged, tense minor. Rare, but a few blues players love it.", home: "Blow 5 (also blow 2 and 8)" },
  { n: "12th", name: "Lydian", mode: "Lydian (dreamy major)", up: 5, feel: "A floating, bright major sound used by a few advanced players.", home: "Draw 5 (also draw 9)" },
]

export function harpForSong(songKey: number, pos: Position): number {
  return (((songKey - pos.up) % 12) + 12) % 12
}

// ─── Exercises and licks ─────────────────────────────────────────────────────
// Written for a C harp. In 2nd position (cross harp) on a C harp the song key is G, so tonic = 7.

export const SCALE_LICK: Lick = {
  id: "cscale", title: "C major scale, holes 4 to 7", note: "Blow 4, draw 4, blow 5, draw 5, blow 6, draw 6, draw 7, blow 7.",
  bars: ["4 -4 5 -5", "6 -6 -7 7"], tonic: 0, pool: [0, 2, 4, 5, 7, 9, 11], ends: [0],
}

export const CHORD_LICKS: Lick[] = [
  { id: "chug13", title: "In-out chug on holes 1 to 3", note: "Blow the chord on the beat, draw it on the &. Think chuh-ka, chuh-ka.", bars: ["1-3 -1-3 1-3 -1-3 1-3 -1-3 1-3 -1-3"] },
  { id: "chug46", title: "Blow chord on holes 4 to 6", note: "Three notes at once. Aim the air across all three holes.", bars: ["4-6 . 4-6 .", "4-6 . . ."] },
]

export const BEND_LICKS: Lick[] = [
  { id: "bend4", title: "Draw 4 bend ladder", note: "Draw 4 and bend down half a step, then release. Hold each for a beat.", bars: ["-4 -4' -4 -4'", "-4 -4' -4 ."] },
  { id: "bend2", title: "Draw 2 bends", note: "Draw 2 has two bends. The whole step is a deeper, hollow sound.", bars: ["-2 -2' -2'' -2'", "-2 . . ."] },
  { id: "bend3", title: "Draw 3, three bends", note: "Hole 3 draw goes down three steps. Take them one at a time.", bars: ["-3 -3' -3'' -3'''", "-3'' -3' -3 ."] },
  { id: "blowbend", title: "Blow bend on 8", note: "Blow bends only work on holes 8 to 10 and are harder than draw bends. Come back to this one after draw bends feel easy.", bars: ["8 8' 8 8'", "8 . . ."] },
]

// 2nd position, key of G on a C harp. Blues scale = 0 3 5 6 7 10 from the tonic.
const BLUES = [0, 3, 5, 6, 7, 10]
const BLUES_END = [0, 7, 10]

export const BLUES_LICKS: Lick[] = [
  { id: "l-shuffle", title: "Shuffle starter", note: "Root, blue note, back home. Keep it short and bouncy.", bars: ["-2 -2 -3' -3' 4 -3' -2 ."], tonic: 7, pool: BLUES, ends: BLUES_END },
  { id: "l-walk", title: "Walk up and back", note: "Climb the blues scale to the 5th, then fall to the root.", bars: ["-2 -3' 4 -4' -4 -5 -4 -2"], tonic: 7, pool: BLUES, ends: BLUES_END },
  { id: "l-octave", title: "Octave pop", note: "Blow 3 and draw 2 are the same note. Move to hole 6 for the octave.", bars: ["-2 . 3 . 6 . -5 -4"], tonic: 7, pool: BLUES, ends: BLUES_END },
  { id: "l-bend", title: "Bend and release", note: "The half-step bend on draw 4 is the blue note. Lean in, then let go.", bars: ["-4 -4' -4 -4' -4 . -3' -2"], tonic: 7, pool: BLUES, ends: BLUES_END },
  { id: "l-major", title: "Sunny major lick", note: "Draw 3 is the major 3rd. This is the happy side of the blues.", bars: ["-3 -4 5 -4 -3 -2 . ."], tonic: 7, pool: [0, 2, 4, 7, 9], ends: [0, 7] },
  { id: "l-call", title: "Call and response", note: "Play the call, leave a beat, then answer with the response.", bars: ["-2 -3' -2 . 4 -3' -2 .", "-4 -4' -4 . 4 -3' -2 ."], labels: ["Call", "Response"], tonic: 7, pool: BLUES, ends: BLUES_END },
]

export const BLUES_CHORD_LICKS: Lick[] = [
  { id: "train", title: "In-out chug on the I and IV chord", note: "Draw 2-3-4 is the home chord on cross harp. Blow 2-3-4 is the IV chord. Alternate them.", bars: ["-2-4 2-4 -2-4 2-4 -2-4 2-4 -2-4 2-4"] },
  { id: "shuffle", title: "Shuffle rhythm", note: "Each beat is split in three. Hit the first and third part and rest on the middle one.", bars: ["-2-4 . -2-4 -2-4 . -2-4 -2-4 . -2-4 -2-4 . -2-4"] },
]

// 12 bars of blues in G. Chord names are the truth; the checker confirms every note against them.
export const BLUES_12 = {
  chords: ["G7", "G7", "G7", "G7", "C7", "C7", "G7", "G7", "D7", "C7", "G7", "D7"],
  patterns: { G7: "-2 . -3' -2", C7: "4 . -3' 4", D7: "-4 . 4 -4" } as Record<string, string>,
}

export const BLUES_12_LICK: Lick = {
  id: "twelve", title: "12-bar blues: landing notes", note: "Land on these notes as each chord arrives.",
  bars: BLUES_12.chords.map(c => BLUES_12.patterns[c]), labels: BLUES_12.chords, tonic: 7,
}

// ─── Advanced scales ─────────────────────────────────────────────────────────

export const ADV_LICKS: Lick[] = [
  { id: "p3", title: "3rd position: D Dorian scale", note: "Same notes as C major, started on draw 4. Minor sound.", bars: ["-4 5 -5 6", "-6 -7 7 -8"], tonic: 2, pool: [0, 2, 3, 5, 7, 9, 10], ends: [0] },
  { id: "p3p", title: "3rd position: D minor pentatonic", note: "Five notes. Your go-to for minor blues and soul.", bars: ["-4 -5 6 -6 7 -6 6 -5", "-4 . . ."], tonic: 2, pool: [0, 3, 5, 7, 10], ends: [0, 7] },
  { id: "p12", title: "12th position: F Lydian scale", note: "Same notes again, started on draw 5. A bright, floating major.", bars: ["-5 6 -6 -7", "7 -8 8 -9"], tonic: 5, pool: [0, 2, 4, 6, 7, 9, 11], ends: [0] },
  { id: "p4", title: "4th position: A natural minor", note: "Start on draw 6. Dark and plain.", bars: ["-6 -7 7 -8", "8 -9 9 -10"], tonic: 9, pool: [0, 2, 3, 5, 7, 8, 10], ends: [0, 2, 3, 5, 7, 8, 10] },
  { id: "motif", title: "Hook and answer", note: "A short hook, then the same hook one step changed. Repeat on the IV chord.", bars: ["-2 -3' 4 -3' -2 . . .", "-2 -3' 4 -4' -4 . . ."], labels: ["Hook", "Answer"], tonic: 7, pool: BLUES, ends: BLUES_END },
]
