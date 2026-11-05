import { BIBLE_QUALITIES, bibleIdFromSuffix } from "@/lib/chordBible"
import { formatChord, parseChord, type KeyRef } from "./theory"
import type { GuidanceGenre } from "./band"
import type { GenreId } from "./genres"
import { chordInfo } from "./tabs"

export interface ChordOption {
  chord: string
  label: string
  why: string
  best: boolean
}

interface Rule {
  id: string
  why: string
  genres?: GenreId[]
}

type Role = "home" | "dominant" | "other"

const JAZZY: GenreId[] = ["jazz", "gospel", "alternative"]
const BLUESY: GenreId[] = ["blues", "funk", "rock", "gospel"]
const SOFT: GenreId[] = ["folk", "pop", "country", "alternative", "reggae"]

const RULES: Record<string, Partial<Record<Role, Rule[]>> & { any: Rule[] }> = {
  maj: {
    home: [
      { id: "maj7", why: "Adds the 7th. Dreamy and relaxed, the most common upgrade.", genres: [...JAZZY, "pop", "folk", "reggae"] },
      { id: "sus2", why: "Swaps the 3rd for the 2nd. Open and airy, not happy or sad.", genres: [...SOFT, "rock"] },
      { id: "maj9", why: "Maj7 plus the 9th. Lush and a little jazzy.", genres: ["jazz", "gospel", "pop"] },
      { id: "sus4", why: "Swaps the 3rd for the 4th. Tension that settles when you go back.", genres: ["rock", "country", "folk", "alternative"] },
      { id: "7", why: "Adds the flat 7th. Bluesy, it wants to move on.", genres: BLUESY },
      { id: "9", why: "Dominant 7th plus the 9th. Funky and full.", genres: ["funk", "blues", "gospel"] },
      { id: "maj13", why: "Maj9 plus the 13th. Wide open, good for a last chord.", genres: ["jazz", "gospel"] },
    ],
    dominant: [
      { id: "7", why: "Adds the flat 7th. The classic pull back home.", genres: [...BLUESY, "country", "folk", "pop"] },
      { id: "sus4", why: "Hold the 4th, then let it fall to the 3rd. Delays the resolve.", genres: ["rock", "country", "folk", "pop", "alternative"] },
      { id: "9", why: "Dominant 7th plus the 9th. Smooth and soulful.", genres: ["funk", "blues", "gospel", "jazz"] },
      { id: "13", why: "Adds the 9th and 13th. Rich and jazzy.", genres: ["jazz", "gospel", "blues"] },
      { id: "7#5", why: "Raises the 5th. Tense and eager to resolve.", genres: ["jazz", "blues"] },
    ],
    any: [],
  },
  min: {
    any: [
      { id: "m7", why: "Adds the flat 7th. Softer and warmer than the plain minor.", genres: [...JAZZY, ...BLUESY, "pop", "reggae"] },
      { id: "m9", why: "Minor 7th plus the 9th. Smooth, moody and modern.", genres: ["jazz", "gospel", "alternative", "pop", "funk"] },
      { id: "m11", why: "Adds the 11th. Dark and spacious.", genres: ["jazz", "alternative", "funk"] },
      { id: "m13", why: "Adds the 13th. Rich and sophisticated.", genres: ["jazz", "gospel"] },
    ],
  },
  "7": {
    any: [
      { id: "9", why: "Adds the 9th. Fuller and smoother.", genres: ["funk", "blues", "gospel", "jazz", "rock"] },
      { id: "13", why: "Adds the 9th and 13th. The classic jazz and soul dominant.", genres: ["jazz", "gospel", "blues", "funk"] },
      { id: "7#5", why: "Raises the 5th. Tense, wants to resolve.", genres: ["jazz", "blues"] },
      { id: "11", why: "Adds the 9th and 11th. Hangs open and unresolved.", genres: ["funk", "jazz", "gospel"] },
      { id: "sus4", why: "Swaps the 3rd for the 4th. Pull the tension, then land the 7th again.", genres: ["rock", "country", "folk", "pop"] },
    ],
  },
  maj7: {
    any: [
      { id: "maj9", why: "Adds the 9th. Lush and open.", genres: ["jazz", "gospel", "pop", "alternative"] },
      { id: "maj13", why: "Adds the 9th and 13th. Wide and sweet.", genres: ["jazz", "gospel"] },
      { id: "maj11", why: "Adds the 11th. Floaty and unusual, great over a bass note.", genres: ["jazz", "alternative"] },
      { id: "maj", why: "Back to the plain triad. Stripped and simple.", genres: ["folk", "country", "pop"] },
    ],
  },
  m7: {
    any: [
      { id: "m9", why: "Adds the 9th. Warm and smooth.", genres: ["jazz", "gospel", "funk", "alternative", "pop"] },
      { id: "m11", why: "Adds the 11th. Moody and open.", genres: ["funk", "jazz", "alternative"] },
      { id: "m13", why: "Adds the 13th. Rich and wide.", genres: ["jazz", "gospel"] },
      { id: "min", why: "Back to the plain minor. Simple and direct.", genres: ["rock", "folk", "country"] },
    ],
  },
  "9": {
    any: [
      { id: "13", why: "Adds the 13th. Bigger and brighter.", genres: ["jazz", "gospel", "funk", "blues"] },
      { id: "11", why: "Adds the 11th. Open and a bit unresolved.", genres: ["funk", "jazz"] },
      { id: "7", why: "Back to the plain dominant 7th. Rawer and bluesier.", genres: ["blues", "rock", "country"] },
      { id: "7#5", why: "Raises the 5th. Tense and eager to resolve.", genres: ["jazz", "blues"] },
    ],
  },
  m9: {
    any: [
      { id: "m11", why: "Adds the 11th. Dark and spacious.", genres: ["funk", "jazz", "alternative"] },
      { id: "m13", why: "Adds the 13th. Rich and wide.", genres: ["jazz", "gospel"] },
      { id: "m7", why: "Back to the minor 7th. Cleaner and tighter.", genres: ["funk", "reggae", "blues"] },
    ],
  },
  maj9: {
    any: [
      { id: "maj13", why: "Adds the 13th. Wide and sweet.", genres: ["jazz", "gospel"] },
      { id: "maj7", why: "Back to the major 7th. Less crowded.", genres: ["pop", "folk", "reggae"] },
      { id: "sus2", why: "Drops the 3rd and 7th. Plain and open.", genres: ["alternative", "rock"] },
    ],
  },
  sus4: {
    any: [
      { id: "sus2", why: "Swaps the 4th for the 2nd. Lighter and floatier.", genres: ["alternative", "pop", "folk"] },
      { id: "maj", why: "Resolve to the plain major chord.", genres: ["rock", "country", "folk", "pop"] },
      { id: "7", why: "Drop the 4th and add the flat 7th. Bluesy.", genres: BLUESY },
    ],
  },
  sus2: {
    any: [
      { id: "sus4", why: "Swaps the 2nd for the 4th. Tenser, it wants to resolve.", genres: ["rock", "country", "folk"] },
      { id: "maj", why: "Fill in the 3rd. Plain major.", genres: ["rock", "country", "folk", "pop"] },
      { id: "maj7", why: "Add the 3rd and 7th. Dreamy.", genres: ["jazz", "alternative", "pop"] },
    ],
  },
  dim: {
    any: [
      { id: "dim7", why: "Adds the double-flat 7th. Even more tense and symmetrical.", genres: ["jazz", "gospel"] },
      { id: "m7b5", why: "Adds the flat 7th. Softer, a classic ii chord in minor keys.", genres: ["jazz", "gospel", "alternative"] },
    ],
  },
  m7b5: {
    any: [
      { id: "dim7", why: "Lowers the 7th once more. Tense and symmetrical.", genres: ["jazz", "gospel"] },
      { id: "dim", why: "Plain diminished triad. Starker and simpler.", genres: ["alternative", "rock"] },
    ],
  },
}

function pickRole(id: string, root: number, key?: KeyRef): Role {
  if (!key) return "other"
  const deg = (root - key.root + 12) % 12
  if (deg === 0 && id === "maj" && !key.minor) return "home"
  if (deg === 5 && id === "maj" && !key.minor) return "home"
  if (deg === 7 && id === "maj") return "dominant"
  return "other"
}

function rank(rule: Rule, genre: GuidanceGenre): number {
  if (genre === "general") return 0
  return rule.genres?.includes(genre) ? 0 : 1
}

export function chordOptions(sym: string, genre: GuidanceGenre, key?: KeyRef, max = 6): ChordOption[] {
  const c = parseChord(sym)
  if (!c || c.bass !== null) return []
  const id = bibleIdFromSuffix(c.suffix)
  if (!id) return []
  const rules = RULES[id]
  if (!rules) return []
  const role = pickRole(id, c.root, key)
  const list: Rule[] = [...(rules[role] ?? (id === "maj" ? rules.home ?? [] : [])), ...rules.any]
  const seen = new Set<string>()
  const ranked = list
    .map((r, i) => ({ r, i }))
    .filter(({ r }) => (seen.has(r.id) ? false : (seen.add(r.id), true)))
    .sort((a, b) => rank(a.r, genre) - rank(b.r, genre) || a.i - b.i)
    .slice(0, max)
  const flats = sym.charAt(1) === "b"
  return ranked.flatMap(({ r }, n) => {
    const q = BIBLE_QUALITIES.find(x => x.id === r.id)
    if (!q) return []
    const chord = formatChord({ root: c.root, suffix: q.suffix, bass: null }, flats)
    if (!chordInfo(chord)) return []
    return [{ chord, label: q.label, why: r.why, best: n === 0 && genre !== "general" && rank(r, genre) === 0 }]
  })
}

export type Mood = "richer" | "jazzier" | "dreamy" | "bluesy" | "simpler"

export const MOODS: { id: Mood; label: string; hint: string }[] = [
  { id: "richer", label: "Richer", hint: "Adds a 7th or 9th to each chord" },
  { id: "jazzier", label: "Jazzier", hint: "9ths, 11ths and 13ths" },
  { id: "dreamy", label: "Dreamier", hint: "Open, floating chords" },
  { id: "bluesy", label: "Bluesier", hint: "Dominant 7ths everywhere" },
  { id: "simpler", label: "Simpler", hint: "Strips back to plain triads and 7ths" },
]

const MOOD_MAP: Record<Mood, Record<string, string>> = {
  richer: { maj: "maj7", min: "m7", "7": "9", maj7: "maj9", m7: "m9", "9": "13" },
  jazzier: { maj: "maj9", min: "m9", "7": "13", maj7: "maj13", m7: "m11", "9": "13", m9: "m11", sus4: "11" },
  dreamy: { maj: "sus2", min: "m9", maj7: "maj9", m7: "m11", "7": "sus4", "9": "11" },
  bluesy: { maj: "7", min: "m7", maj7: "7", maj9: "9", sus4: "7", sus2: "7" },
  simpler: {
    maj7: "maj", maj9: "maj", maj11: "maj", maj13: "maj", sus2: "maj", sus4: "maj",
    m7: "min", m9: "min", m11: "min", m13: "min", "9": "7", "11": "7", "13": "7", "7#5": "7",
  },
}

const DOMINANT_MOOD: Partial<Record<Mood, Record<string, string>>> = {
  richer: { maj: "7" },
  jazzier: { maj: "13" },
  dreamy: { maj: "sus4" },
}

export function moodChord(sym: string, mood: Mood, key?: KeyRef): string {
  const c = parseChord(sym)
  if (!c || c.bass !== null) return sym
  const id = bibleIdFromSuffix(c.suffix)
  if (!id) return sym
  const role = pickRole(id, c.root, key)
  const target = (role === "dominant" ? DOMINANT_MOOD[mood]?.[id] : undefined) ?? MOOD_MAP[mood][id]
  if (!target) return sym
  const q = BIBLE_QUALITIES.find(x => x.id === target)
  if (!q) return sym
  const next = formatChord({ root: c.root, suffix: q.suffix, bass: null }, sym.charAt(1) === "b")
  return chordInfo(next) ? next : sym
}

/** One tasteful swap on a random chord, chosen from its best options. */
export function surpriseSwap(
  written: string[], current: Record<string, string>, genre: GuidanceGenre, key?: KeyRef,
): Record<string, string> {
  const uniq = Array.from(new Set(written)).filter(c => chordOptions(c, genre, key).length > 0)
  if (uniq.length === 0) return current
  const orig = uniq[Math.floor(Math.random() * uniq.length)]
  const opts = chordOptions(orig, genre, key, 3).filter(o => o.chord !== (current[orig] ?? orig))
  if (opts.length === 0) return current
  const pick = opts[Math.floor(Math.random() * opts.length)]
  return { ...current, [orig]: pick.chord }
}
