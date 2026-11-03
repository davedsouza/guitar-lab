import { POPULAR_ACOUSTIC } from "./songs"
import type { Parser } from "./storage"
import {
  diatonicChords, extractChordsFromChart, findVoicings, formatChord, guessKeys, isMinorSuffix, noteName, parseChord, parseNote, prefersFlats,
  type KeyRef,
} from "./theory"

export type Group = "safe" | "colour" | "surprise"
type Q = "M" | "m" | "d"

export const GROUPS: { id: Group; label: string; blurb: string }[] = [
  { id: "safe", label: "Safe and common", blurb: "Moves you will hear in thousands of songs." },
  { id: "colour", label: "Adds colour", blurb: "Still natural, but with a different mood." },
  { id: "surprise", label: "A surprise", blurb: "Bolder moves. Use them once, then come home." },
]

export interface Suggestion {
  chord: string
  roman: string
  group: Group
  why: string
  open: boolean | null
  songs: string[]
}

const MAJOR_NAMES = ["I", "bII", "II", "bIII", "III", "IV", "#IV", "V", "bVI", "VI", "bVII", "VII"]
const MINOR_NAMES = ["I", "bII", "II", "III", "#III", "IV", "bV", "V", "VI", "#VI", "VII", "#VII"]

function labelOf(off: number, q: Q, minorKey: boolean): string {
  const base = (minorKey ? MINOR_NAMES : MAJOR_NAMES)[off]
  if (q === "M") return base
  const m = /^([b#]?)([IV]+)$/.exec(base)
  const lower = m ? m[1] + m[2].toLowerCase() : base.toLowerCase()
  return q === "d" ? lower + "°" : lower
}

type Rule = [to: string, group: Group, why: string]

const MAJOR_RULES: Record<string, Rule[]> = {
  I: [
    ["IV", "safe", "Steps away from home. The most common first move."],
    ["V", "safe", "Builds tension that wants to fall back to I."],
    ["vi", "safe", "The relative minor. Same notes, a softer mood."],
    ["ii", "safe", "Sets up V, so it feels like you are heading somewhere."],
    ["iii", "colour", "Floaty and gentle. It usually walks down to IV or vi."],
    ["bVII", "colour", "A rock chord borrowed from the minor key. Big and open."],
    ["iv", "colour", "The minor IV, borrowed. Wistful, like a cloud passing over."],
    ["bVI", "surprise", "Borrowed and cinematic. Lifts the song in a big way."],
    ["bIII", "surprise", "Borrowed. A bluesy, rock sound."],
    ["VI", "surprise", "Major VI is a pull towards ii. Jazzy and bright."],
  ],
  ii: [
    ["V", "safe", "The classic setup. ii to V to I is everywhere."],
    ["IV", "safe", "Both are \"away from home\" chords, so they swap easily."],
    ["I", "safe", "Lands home early, softer than going through V."],
    ["vi", "colour", "Stays in minor land for a moment longer."],
    ["iii", "colour", "A gentle step up. Leads towards IV."],
    ["bII", "surprise", "A half step above home. Dark, flamenco-like tension."],
  ],
  iii: [
    ["vi", "safe", "Falls a fifth, which sounds natural."],
    ["IV", "safe", "A half step up. A very popular pairing."],
    ["ii", "colour", "Starts a stepwise walk down to I."],
    ["V", "colour", "Skips ahead to the tension chord."],
    ["III", "surprise", "Major III points hard at vi. Dramatic."],
  ],
  IV: [
    ["I", "safe", "The \"amen\" ending. Gentle and settled."],
    ["V", "safe", "The classic step up. Tension, then release."],
    ["vi", "safe", "Slides into the relative minor."],
    ["ii", "colour", "Stays in the \"away from home\" area."],
    ["iv", "colour", "Major IV turns minor. A famous sad turn."],
    ["bVII", "colour", "Mixes in a bluesy rock chord."],
    ["iii", "colour", "Steps down to a soft minor."],
    ["#iv°", "surprise", "A tense diminished chord that leads up to V."],
  ],
  V: [
    ["I", "safe", "The big release. V wants to go home."],
    ["vi", "safe", "A \"deceptive\" ending. You expect I, and get a minor."],
    ["IV", "colour", "Goes back instead of home. Common in rock."],
    ["ii", "colour", "Turns the corner and loops the verse."],
    ["iii", "colour", "A gentle detour."],
    ["bVI", "surprise", "Borrowed chord instead of the expected home."],
  ],
  vi: [
    ["IV", "safe", "One of the most used moves in pop."],
    ["V", "safe", "Climbs to tension."],
    ["ii", "safe", "Keeps the circle of fifths going."],
    ["I", "safe", "Goes back to the major home."],
    ["iii", "colour", "Stays in minor and floats."],
    ["III", "surprise", "Major III points back at vi. Dramatic."],
    ["bVII", "surprise", "Borrowed. Opens the sound up."],
  ],
  "vii°": [
    ["I", "safe", "Leading-tone chord. It pulls straight home."],
    ["iii", "colour", "Resolves up a third."],
    ["vi", "colour", "Steps down into the relative minor."],
  ],
  bVII: [
    ["IV", "safe", "I, bVII, IV is a rock classic."],
    ["I", "safe", "Falls home with a swagger."],
    ["V", "colour", "Climbs back to normal tension."],
    ["vi", "colour", "Settles into minor."],
    ["bVI", "surprise", "Walks further down the borrowed chords."],
  ],
  iv: [
    ["I", "safe", "Sad turn, then a bright resolve."],
    ["V", "colour", "Goes to tension from a different side."],
    ["bVII", "colour", "Stays in the borrowed world."],
    ["vi", "colour", "Settles into the relative minor."],
    ["bVI", "surprise", "Moves deeper into minor colours."],
  ],
  bVI: [
    ["bVII", "safe", "The rock staircase: bVI, bVII, I."],
    ["V", "colour", "Climbs into tension."],
    ["I", "colour", "Direct to home with some drama."],
    ["iv", "colour", "More minor colour."],
  ],
  bIII: [
    ["IV", "safe", "Steps up. Works in many rock songs."],
    ["bVII", "colour", "Goes the borrowed route."],
    ["I", "colour", "Returns home."],
  ],
  II: [
    ["V", "safe", "Major II is the dominant of V. It leads in strongly."],
    ["IV", "colour", "Skips the usual V."],
  ],
  III: [
    ["vi", "safe", "Major III is the dominant of vi. Leads in strongly."],
    ["IV", "colour", "Resolves up instead."],
  ],
  VI: [
    ["ii", "safe", "Major VI is the dominant of ii. Leads in strongly."],
    ["V", "colour", "Another way to climb."],
  ],
}

const MINOR_RULES: Record<string, Rule[]> = {
  i: [
    ["VI", "safe", "Steps down to the major chord below. Warm and dramatic."],
    ["VII", "safe", "A rock staircase back up to home."],
    ["iv", "safe", "Away from home. The most natural minor move."],
    ["III", "safe", "The relative major. A bright lift."],
    ["v", "colour", "Minor v keeps the sound dark."],
    ["V", "colour", "Major V pulls hard to i. Strong, classical finish."],
    ["IV", "colour", "A major IV in a minor key. The Dorian sound."],
    ["ii°", "colour", "A diminished chord that leads to v or V."],
    ["bII", "surprise", "A half step up. Dark, flamenco-like colour."],
  ],
  III: [
    ["VII", "safe", "A staircase back towards home."],
    ["VI", "safe", "Steps down. Warm and flowing."],
    ["iv", "safe", "Moves into the away chord."],
    ["i", "colour", "Returns home in minor."],
    ["v", "colour", "A relaxed alternative."],
  ],
  iv: [
    ["i", "safe", "Back home. A classic minor feel."],
    ["VII", "safe", "Pushes the sound upward."],
    ["V", "colour", "Climbs to the strong chord, then home."],
    ["VI", "colour", "Steps up to the major chord."],
    ["III", "colour", "Brightens into the relative major."],
    ["bII", "surprise", "A dramatic, Spanish-style approach."],
  ],
  v: [
    ["i", "safe", "Soft landing home."],
    ["VI", "safe", "Steps up. Smooth."],
    ["iv", "colour", "Steps back."],
    ["III", "colour", "Lifts into the relative major."],
  ],
  V: [
    ["i", "safe", "The big release home. Strongest minor ending."],
    ["VI", "safe", "A \"deceptive\" ending. You expect i, and get VI."],
    ["iv", "colour", "Goes back instead of home."],
    ["III", "surprise", "Skips to the relative major."],
  ],
  VI: [
    ["VII", "safe", "VI, VII, i is a rock and pop staircase."],
    ["III", "safe", "Moves up to the relative major."],
    ["iv", "safe", "Falls into the away chord."],
    ["i", "colour", "Goes home with a gentle fall."],
    ["V", "colour", "Climbs to tension for a strong finish."],
    ["v", "colour", "Stays soft."],
  ],
  VII: [
    ["i", "safe", "Falls home. A very common ending."],
    ["III", "safe", "Lifts to the relative major."],
    ["VI", "safe", "Walks down to a warm major chord."],
    ["iv", "colour", "A different way to leave."],
    ["V", "colour", "Climbs to tension."],
  ],
  "ii°": [
    ["V", "safe", "ii° to V is the minor setup chord."],
    ["v", "colour", "Same movement, softer."],
    ["i", "colour", "Resolves home."],
  ],
  IV: [
    ["i", "safe", "The Dorian sound resolves home."],
    ["VII", "safe", "Keeps the modal sound going."],
    ["v", "colour", "Stays in the minor pull."],
  ],
  bII: [
    ["i", "safe", "Falls a half step home. Very dramatic."],
    ["V", "colour", "Detours to tension."],
  ],
}

const MAJOR_START: Rule[] = [
  ["I", "safe", "Home. The most natural place to begin."],
  ["vi", "safe", "Starts in the relative minor for a mood."],
  ["IV", "safe", "Starts away from home. Open and hopeful."],
  ["ii", "colour", "A gentle start that leads towards V."],
  ["V", "colour", "Begins with tension."],
]
const MINOR_START: Rule[] = [
  ["i", "safe", "Home. The most natural place to begin."],
  ["VI", "safe", "Starts warm and dramatic."],
  ["iv", "safe", "Starts away from home."],
  ["III", "colour", "Starts in the relative major."],
  ["V", "colour", "Begins with tension."],
]
const MAJOR_FALLBACK: Rule[] = [
  ["I", "safe", "Home settles any odd chord."],
  ["V", "safe", "Tension that points home."],
  ["IV", "safe", "A friendly step away."],
  ["vi", "colour", "The relative minor."],
]
const MINOR_FALLBACK: Rule[] = [
  ["i", "safe", "Home settles any odd chord."],
  ["V", "safe", "Tension that points home."],
  ["iv", "safe", "A friendly step away."],
  ["VI", "colour", "A warm major chord."],
]

// ─── Slots ────────────────────────────────────────────────────────────────────

function qualityOf(suffix: string): Q {
  if (/^(dim|m7b5|°)/.test(suffix)) return "d"
  return isMinorSuffix(suffix) ? "m" : "M"
}

export function slotOf(sym: string, key: KeyRef): { off: number; q: Q; label: string } | null {
  const c = parseChord(sym)
  if (!c) return null
  const off = (c.root - key.root + 120) % 12
  const q = qualityOf(c.suffix)
  return { off, q, label: labelOf(off, q, key.minor) }
}

function lookup(minorKey: boolean): Map<string, { off: number; q: Q }> {
  const map = new Map<string, { off: number; q: Q }>()
  for (let off = 0; off < 12; off++) for (const q of ["M", "m", "d"] as Q[]) map.set(labelOf(off, q, minorKey), { off, q })
  return map
}
const LOOKUP = { major: lookup(false), minor: lookup(true) }

const SEVENTH: Record<Q, string> = { M: "maj7", m: "m7", d: "m7b5" }

function chordFor(label: string, key: KeyRef, sevenths: boolean): string | null {
  const slot = LOOKUP[key.minor ? "minor" : "major"].get(label)
  if (!slot) return null
  const flats = label.startsWith("b") || (!label.startsWith("#") && prefersFlats(key))
  const root = (key.root + slot.off) % 12
  const name = noteName(root, flats)
  if (!sevenths) return name + (slot.q === "m" ? "m" : slot.q === "d" ? "dim" : "")
  if (slot.q === "M" && isDominantLabel(label, key.minor)) return name + "7"
  return name + SEVENTH[slot.q]
}

function isDominantLabel(label: string, minorKey: boolean): boolean {
  if (label === "V") return true
  if (label === "VII" && minorKey) return true
  return label === "II" || label === "III" || label === "VI" ? !minorKey : false
}

export function isOpenShape(sym: string): boolean | null {
  const m = findVoicings(sym)
  if (!m || m.voicings.length === 0) return null
  return m.voicings[0].difficulty === "beginner"
}

// ─── Songs ────────────────────────────────────────────────────────────────────

interface SongMoves {
  title: string
  moves: Set<string>
}

let songMoves: SongMoves[] | null = null

function keyFromSongKey(s: string): KeyRef | null {
  const m = /^([A-G][#b]?)(m?)$/.exec(s.trim())
  if (!m) return null
  const root = parseNote(m[1])
  return root === null ? null : { root, minor: m[2] === "m" }
}

function getSongMoves(): SongMoves[] {
  if (songMoves) return songMoves
  songMoves = POPULAR_ACOUSTIC.flatMap(s => {
    const key = keyFromSongKey(s.key)
    if (!key) return []
    const labels = extractChordsFromChart(s.body).map(c => slotOf(c, key)?.label ?? "?")
    const moves = new Set<string>()
    let prev = ""
    for (const l of labels) {
      if (l === prev) continue
      if (prev && prev !== "?" && l !== "?") moves.add(`${prev}>${l}`)
      prev = l
    }
    return [{ title: s.title, moves }]
  })
  return songMoves
}

export function songsWithMove(from: string, to: string, limit = 2): string[] {
  const out: string[] = []
  for (const s of getSongMoves()) {
    if (s.moves.has(`${from}>${to}`)) out.push(s.title)
    if (out.length >= limit) break
  }
  return out
}

// ─── Suggestions ──────────────────────────────────────────────────────────────

export function keyCandidates(chords: string[]): KeyRef[] {
  const ranked = guessKeys(chords, 24)
  const parsed = chords.map(parseChord).filter((c): c is NonNullable<ReturnType<typeof parseChord>> => c !== null)
  const strict = ranked.filter(g => {
    const diat = diatonicChords(g.key)
    return parsed.every(c => {
      const want: Q = qualityOf(c.suffix)
      return diat.some(d => d.root === c.root && (d.quality === "major" ? "M" : d.quality === "minor" ? "m" : "d") === want)
    })
  })
  const first = parsed[0]
  const startsHome = (k: KeyRef) => (first && first.root === k.root && isMinorSuffix(first.suffix) === k.minor ? 4 : 0)
  const pool = (strict.length >= 2 ? strict : ranked).map(g => ({ k: g.key, s: g.score + startsHome(g.key) }))
  return pool.sort((a, b) => b.s - a.s).slice(0, 3).map(x => x.k)
}

export function suggestNext(chords: string[], key: KeyRef, sevenths: boolean): Suggestion[] {
  const rules = key.minor ? MINOR_RULES : MAJOR_RULES
  const last = chords.length ? chords[chords.length - 1] : null
  const lastSlot = last ? slotOf(last, key) : null
  let list: Rule[]
  if (!last) list = key.minor ? MINOR_START : MAJOR_START
  else if (lastSlot && rules[lastSlot.label]) list = rules[lastSlot.label]
  else list = key.minor ? MINOR_FALLBACK : MAJOR_FALLBACK

  const out: Suggestion[] = []
  const seen = new Set<string>()
  for (const [to, group, why] of list) {
    const chord = chordFor(to, key, sevenths)
    if (!chord || seen.has(chord)) continue
    if (last && lastSlot && lastSlot.label === to) continue
    seen.add(chord)
    out.push({
      chord,
      roman: to,
      group,
      why,
      open: isOpenShape(chord),
      songs: lastSlot ? songsWithMove(lastSlot.label, to) : [],
    })
  }
  return out
}

export function loopBack(chords: string[]): string | null {
  if (chords.length < 3) return null
  const first = chords[0]
  const last = chords[chords.length - 1]
  return first !== last ? first : null
}

export function keyChordList(key: KeyRef, sevenths: boolean): { chord: string; roman: string }[] {
  const labels = key.minor ? ["i", "ii°", "III", "iv", "v", "VI", "VII"] : ["I", "ii", "iii", "IV", "V", "vi", "vii°"]
  const out: { chord: string; roman: string }[] = []
  for (const l of labels) {
    const chord = chordFor(l, key, sevenths)
    if (chord) out.push({ chord, roman: l })
  }
  return out
}

export function romanLine(chords: string[], key: KeyRef): string[] {
  return chords.map(c => slotOf(c, key)?.label ?? "?")
}

export function tidy(chords: string[], key: KeyRef): string[] {
  const flats = prefersFlats(key)
  return chords.map(c => {
    const p = parseChord(c)
    return p ? formatChord(p, flats) : c
  })
}

export interface Saved {
  chords: string[]
  key: KeyRef | null
}

export const BUILDER_KEY = "jam.builder.v1"
export const MAX = 16
export const EMPTY: Saved = { chords: [], key: null }

export const parseSaved: Parser<Saved> = raw => {
  if (typeof raw !== "object" || raw === null) return null
  const r = raw as Record<string, unknown>
  const chords = Array.isArray(r.chords) ? r.chords.filter((c): c is string => typeof c === "string" && parseChord(c) !== null).slice(0, MAX) : []
  const k = r.key as Record<string, unknown> | null
  const key = k && typeof k.root === "number" && k.root >= 0 && k.root < 12 && typeof k.minor === "boolean" ? { root: Math.floor(k.root), minor: k.minor } : null
  return { chords, key }
}
