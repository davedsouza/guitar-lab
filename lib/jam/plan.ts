import type { GuidanceGenre } from "./band"
import { isDominantLabel, moveScore, resolveLabel, ruleSources, ruleTargets, slotOf, type Q } from "./next"
import type { Parser } from "./storage"
import { formatChord, guessKeys, isMinorSuffix, keyLabel, noteName, parseChord, prefersFlats, type KeyRef } from "./theory"

export type StyleId =
  | "general" | "funkyblues" | "funk" | "blues" | "soul" | "jazz" | "gospel" | "rock" | "pop" | "folk" | "country" | "reggae"
export type PartId = "riff" | "verse" | "chorus" | "bridge"
export type Tool = "slide" | "above" | "five" | "twofive" | "dim" | "scale"

export interface Direction {
  bpm: [number, number]
  feel: string
  rhythm: string[]
  riff: string[]
  scale: string
  shape?: string
}

export interface StyleDef {
  id: StyleId
  label: string
  blurb: string
  genre: GuidanceGenre
  // Chord endings for chords we add
  ext: { dom: string; min: string; maj: string }
  // true: every major chord we add becomes a dominant (blues and funk). false: only the ones that act as a V.
  domAll: boolean
  tools: Partial<Record<Tool, number>>
  direction: Direction
}

export const STYLES: StyleDef[] = [
  {
    id: "general", label: "Any style", blurb: "Plain chords that fit the key. Good when you are not sure yet.", genre: "general",
    ext: { dom: "", min: "m", maj: "" }, domAll: false,
    tools: { scale: 3.5, five: 1.2 },
    direction: {
      bpm: [80, 130], feel: "Steady and even. Pick the mood once you hear it.",
      rhythm: ["Start with a plain down, down-up, up-down-up strum.", "Change chords right on beat 1."],
      riff: ["Pick out the notes of each chord one at a time to find a hook.", "Repeat the same short idea every time round."],
      scale: "Major pentatonic over major chords, minor pentatonic over minor ones.",
    },
  },
  {
    id: "funkyblues", label: "Funky blues", blurb: "9th chords, chromatic slides and short licks in the gaps. The groove-blues feel John Mayer plays.", genre: "funk",
    ext: { dom: "9", min: "m7", maj: "maj7" }, domAll: true,
    tools: { slide: 3, above: 2, five: 2, twofive: 1.2, scale: 2, dim: 1.5 },
    direction: {
      bpm: [70, 105],
      feel: "Relaxed and a little behind the beat. The chords are short stabs and your licks answer them.",
      rhythm: [
        "Play chords as short stabs on 2 or 3 strings in the middle and top of the neck, then mute straight away.",
        "Keep your strumming hand moving in quiet 16ths so the stabs stand out.",
        "Leave the downbeat empty now and then. The space is half the sound.",
      ],
      riff: [
        "Slide the whole chord shape one fret up or down to reach the next chord. The slide ideas below are made for that.",
        "Between chords, play a 2 to 4 note lick from the minor pentatonic. Bend the minor 3rd a little sharp so it leans toward the major 3rd.",
        "Hammer on or pull off a note just above the chord, then let it ring into the next chord.",
      ],
      scale: "Minor pentatonic mixed with major pentatonic. The major 3rd and 6th give it the sweet sound.",
      shape: "A 9th shape with the root on the 5th string: C9 is x-3-2-3-3-3 (low string first). Slide it for other roots.",
    },
  },
  {
    id: "funk", label: "Funk", blurb: "One or two chords, all about the rhythm. 9ths and minor 7ths with chromatic slides.", genre: "funk",
    ext: { dom: "9", min: "m7", maj: "maj7" }, domAll: true,
    tools: { slide: 3, above: 2, scale: 2, five: 1, dim: 0.5, twofive: 0.5 },
    direction: {
      bpm: [90, 115],
      feel: "Tight and syncopated. The groove is the song.",
      rhythm: [
        "Chop: strum, release the pressure so the strings mute, strum again.",
        "Land hits on the off-beat 16ths (the e and a of each beat) and leave beat 1 open sometimes.",
        "Keep the strumming hand moving in steady 16ths, even when it hits nothing.",
      ],
      riff: [
        "Slide a chord shape up a fret and back for a horn-stab sound.",
        "Add a short single-note fill from the minor pentatonic at the end of the bar.",
      ],
      scale: "Minor pentatonic, or Dorian over minor chords.",
      shape: "Small 3-note 9th shapes on the top strings are easier to chop than full chords.",
    },
  },
  {
    id: "blues", label: "Blues", blurb: "7th chords on the I, IV and V, with turnarounds and call and response.", genre: "blues",
    ext: { dom: "7", min: "m7", maj: "" }, domAll: true,
    tools: { five: 3, scale: 3, slide: 2, above: 1, twofive: 1, dim: 1 },
    direction: {
      bpm: [70, 130],
      feel: "Shuffle or slow swing. Think long-short pairs of 8th notes.",
      rhythm: [
        "Swing the 8th notes: the first of each pair is long, the second short.",
        "On the low strings, alternate the 5th and 6th above the root for the classic shuffle.",
      ],
      riff: [
        "Answer each chord with a short lick, then stop and let the band speak.",
        "Aim the last bar back at the start: land on the V chord or a lick that falls into the root.",
      ],
      scale: "Minor pentatonic with the b5 (blue note) added.",
      shape: "7th chords with the root on the 6th or 5th string.",
    },
  },
  {
    id: "soul", label: "Soul / R&B", blurb: "Smooth 7ths and 9ths, ii-V approaches and passing diminished chords.", genre: "gospel",
    ext: { dom: "9", min: "m7", maj: "maj7" }, domAll: false,
    tools: { twofive: 3, dim: 2.5, scale: 2.5, five: 2, slide: 1.5, above: 1 },
    direction: {
      bpm: [60, 95],
      feel: "Warm and unhurried, with lots of space. Let the chords ring.",
      rhythm: [
        "Use soft, partial strums on the top four strings with a lazy swing on the 16ths.",
        "Decorate each chord with a small hammer-on or slide, then let it sustain.",
      ],
      riff: [
        "Play double stops (two notes at once) a 6th apart above the chord, like a backing vocal.",
        "Use the passing diminished chord as a quick slide on the way to the next chord.",
      ],
      scale: "Major pentatonic over major chords, minor pentatonic or Dorian over minor 7ths.",
      shape: "maj7 and m7 shapes on strings 4 to 1 give a clean, sweet sound.",
    },
  },
  {
    id: "jazz", label: "Jazz", blurb: "7th chords, ii-V-I motion and chromatic approach chords.", genre: "jazz",
    ext: { dom: "7", min: "m7", maj: "maj7" }, domAll: false,
    tools: { twofive: 3.5, above: 2.5, five: 2, dim: 2, scale: 2, slide: 1 },
    direction: {
      bpm: [100, 180],
      feel: "Swing 8ths. Play small shapes and let the bass line move underneath.",
      rhythm: [
        "Comp with 3 or 4 note shapes on beats 2 and 4, or chop four even beats to the bar.",
        "Keep each shape small: root, 3rd, 7th, plus one color note.",
      ],
      riff: [
        "Aim for the 3rd or 7th of the new chord on the beat when the chord changes.",
        "Play each chord as an arpeggio up or down to link the changes.",
      ],
      scale: "Chord tones first. Then Dorian over m7, Mixolydian over dominants, major scale over maj7.",
      shape: "Four-note shapes on the middle strings (drop 2 shapes).",
    },
  },
  {
    id: "gospel", label: "Gospel", blurb: "Rich 7ths, passing diminished chords and ii-V approaches. Big and emotional.", genre: "gospel",
    ext: { dom: "7", min: "m7", maj: "maj7" }, domAll: false,
    tools: { dim: 3, twofive: 2, scale: 2.5, five: 2, slide: 1.5 },
    direction: {
      bpm: [60, 110],
      feel: "Full and rolling. Build up through the part.",
      rhythm: [
        "Use strong, rolling strums or slow arpeggios that let the chords ring.",
        "Push the change a half beat early to give it a lift.",
      ],
      riff: [
        "Walk up with a passing diminished chord between two chords a step apart.",
        "Slide a sus chord down into the major chord for a sigh.",
      ],
      scale: "Major pentatonic, with the minor 3rd as a passing note.",
    },
  },
  {
    id: "rock", label: "Rock", blurb: "Open triads and power chords. The bVII and IV give it lift.", genre: "rock",
    ext: { dom: "", min: "m", maj: "" }, domAll: false,
    tools: { scale: 3, five: 1, slide: 0.5 },
    direction: {
      bpm: [90, 160],
      feel: "Driving 8th notes with the accent on the backbeat.",
      rhythm: [
        "Palm-mute the verse, then open up on the chorus.",
        "Strum all downstrokes for drive, and add upstrokes to push the groove.",
      ],
      riff: [
        "Build the riff on the root and 5th, then add the b7 for a bluesy turn.",
        "Accent beat 1 and the 'and' of 3.",
      ],
      scale: "Minor pentatonic, with the major pentatonic for brighter parts.",
    },
  },
  {
    id: "pop", label: "Pop", blurb: "Simple loops of 4 chords that stick in your head.", genre: "pop",
    ext: { dom: "", min: "m", maj: "" }, domAll: false,
    tools: { scale: 3.5, five: 1 },
    direction: {
      bpm: [90, 130],
      feel: "Clean and bright. Change chords exactly on beat 1.",
      rhythm: [
        "Use a steady 8th-note strum: down, down-up, up-down-up.",
        "Keep the strum lighter in the verse and bigger in the chorus.",
      ],
      riff: [
        "Make a short hook from the notes of the chord, played on the top strings.",
        "Repeat the hook exactly each time round so it sticks.",
      ],
      scale: "Major pentatonic over the whole key.",
    },
  },
  {
    id: "folk", label: "Folk", blurb: "Open chords and a steady picked or strummed pattern.", genre: "folk",
    ext: { dom: "", min: "m", maj: "" }, domAll: false,
    tools: { scale: 3.5, five: 1.2 },
    direction: {
      bpm: [70, 120],
      feel: "Steady and warm. Let the open strings ring.",
      rhythm: [
        "Play the bass note of each chord with your thumb, alternating root and 5th.",
        "Brush the top strings on beats 2 and 4.",
      ],
      riff: [
        "Add a short walking bass note between two chords.",
        "Hammer on or pull off one note of the chord to make a small hook.",
      ],
      scale: "Major pentatonic.",
    },
  },
  {
    id: "country", label: "Country", blurb: "Open chords, boom-chick strumming and walk-ups into the next chord.", genre: "country",
    ext: { dom: "", min: "m", maj: "" }, domAll: false,
    tools: { scale: 3, five: 2, slide: 1, dim: 0.5 },
    direction: {
      bpm: [90, 140],
      feel: "Bouncy and steady, with a clear two-beat feel.",
      rhythm: [
        "Boom-chick: a bass note, then a strum, alternating root and 5th in the bass.",
        "Walk up or down the bass strings on the last beat before a chord change.",
      ],
      riff: [
        "Fill the end of each phrase with a major pentatonic lick and a slide.",
        "Add a hammer-on from the 2nd to the 3rd of the chord.",
      ],
      scale: "Major pentatonic, with the minor 3rd as a passing note.",
    },
  },
  {
    id: "reggae", label: "Reggae", blurb: "Offbeat chops and lots of space.", genre: "reggae",
    ext: { dom: "", min: "m", maj: "" }, domAll: false,
    tools: { scale: 3, five: 1 },
    direction: {
      bpm: [65, 90],
      feel: "Relaxed and spacious. The guitar sits on the offbeats.",
      rhythm: [
        "Chop short chords on the upstroke of every beat (the 'and') and mute right away.",
        "Leave the downbeats empty. The bass and drums fill them.",
      ],
      riff: [
        "Keep any melody simple and short, and leave plenty of space.",
        "Play the top three strings only for a thin, bright chop.",
      ],
      scale: "Minor pentatonic or major pentatonic, played lightly.",
    },
  },
]

export const PARTS: { id: PartId; label: string; tip: string }[] = [
  { id: "riff", label: "Riff or vamp", tip: "A riff is short. Loop 2 to 4 bars and repeat them exactly, then change only the last bar." },
  { id: "verse", label: "Verse", tip: "Keep it lower and quieter than the chorus. Save the busiest idea for later." },
  { id: "chorus", label: "Chorus", tip: "Play it bigger: more strings, a stronger strum, and hit the first chord hard." },
  { id: "bridge", label: "Bridge", tip: "Move away from the verse sound. Start on a chord you have not used and finish on the V to pull back home." },
]

export function getStyle(id: StyleId): StyleDef {
  return STYLES.find(s => s.id === id) ?? STYLES[0]
}

export const TOOL_NAME: Record<Tool | "direct", string> = {
  direct: "Just your chords",
  slide: "Chromatic slide",
  above: "Sidestep from above",
  five: "Dominant push",
  twofive: "ii-V approach",
  dim: "Passing diminished",
  scale: "Stay in the key",
}

// ─── Reading chords ───────────────────────────────────────────────────────────

export function readChordInput(input: string): { ok: string[]; bad: string[] } {
  const ok: string[] = []
  const bad: string[] = []
  for (const raw of input.split(/[\s,|>→]+/).filter(Boolean)) {
    const t = raw.charAt(0).toUpperCase() + raw.slice(1)
    if (parseChord(t)) ok.push(t)
    else bad.push(raw)
  }
  return { ok, bad }
}

// ─── Saved state ──────────────────────────────────────────────────────────────

export interface PlanState {
  mode: "steps" | "plan"
  style: StyleId
  part: PartId
  wanted: string[]
  keep: boolean
  key: KeyRef | null
}

export const PLAN_KEY = "jam.plan.v1"
export const PLAN_MAX = 6
export const PLAN_EMPTY: PlanState = { mode: "steps", style: "general", part: "riff", wanted: [], keep: false, key: null }

export const parsePlan: Parser<PlanState> = raw => {
  if (typeof raw !== "object" || raw === null) return null
  const r = raw as Record<string, unknown>
  const style = STYLES.some(s => s.id === r.style) ? (r.style as StyleId) : "general"
  const part = PARTS.some(p => p.id === r.part) ? (r.part as PartId) : "riff"
  const wanted = Array.isArray(r.wanted)
    ? r.wanted.filter((c): c is string => typeof c === "string" && parseChord(c) !== null).slice(0, PLAN_MAX)
    : []
  const k = r.key as Record<string, unknown> | null | undefined
  const key =
    k && typeof k.root === "number" && Number.isInteger(k.root) && k.root >= 0 && k.root < 12 && typeof k.minor === "boolean"
      ? { root: k.root, minor: k.minor }
      : null
  return { mode: r.mode === "plan" ? "plan" : "steps", style, part, wanted, keep: r.keep === true, key }
}

// ─── Keys ─────────────────────────────────────────────────────────────────────

const SLOT_WEIGHT_MAJOR: Record<string, number> = {
  I: 3, IV: 2.6, V: 2.6, bVII: 2, ii: 1.6, vi: 1.6, iii: 1.2, bIII: 1.2, bVI: 1, II: 1, VI: 0.8, III: 0.6, iv: 1,
}
const SLOT_WEIGHT_MINOR: Record<string, number> = {
  i: 3, iv: 2.6, V: 2.4, v: 2, VII: 2, III: 1.8, VI: 1.6, "ii°": 0.8, IV: 1.4, I: 1.5,
}

export interface KeyChoice {
  key: KeyRef
  reason: string
}

export function planKeys(wanted: string[]): KeyChoice[] {
  if (wanted.length === 0) return []
  const fit = new Map<string, number>()
  for (const g of guessKeys(wanted, 24)) fit.set(`${g.key.root}${g.key.minor}`, g.matches)
  const first = parseChord(wanted[0])
  const scored: { key: KeyRef; score: number }[] = []
  for (let root = 0; root < 12; root++) {
    for (const minor of [false, true]) {
      const key = { root, minor }
      const table = minor ? SLOT_WEIGHT_MINOR : SLOT_WEIGHT_MAJOR
      let score = 1.5 * (fit.get(`${root}${minor}`) ?? 0)
      wanted.forEach(c => {
        const label = slotOf(c, key)?.label ?? ""
        score += table[label] ?? 0.2
        if (label === "V" && /^(7|9|11|13)/.test(parseChord(c)?.suffix ?? "")) score += 1.5
      })
      if (!minor) score += 0.5
      if (first && first.root === root) score += 0.8
      scored.push({ key, score })
    }
  }
  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, 3).map(({ key }) => ({
    key,
    reason: wanted.map(c => `${c} is ${slotOf(c, key)?.label ?? "?"}`).join(", "),
  }))
}

// ─── Connecting chords ────────────────────────────────────────────────────────

interface Candidate {
  tool: Tool | "direct"
  chords: string[]
  why: string
  score: number
}

function fillerSuffix(label: string, q: Q, s: StyleDef, minorKey: boolean): string {
  if (q === "d") return s.ext.dom ? "m7b5" : "dim"
  if (q === "m") return s.ext.min
  return s.domAll || isDominantLabel(label, minorKey) ? s.ext.dom : s.ext.maj
}

function candidates(aSym: string, bSym: string, key: KeyRef, s: StyleDef, used: Set<string>, flats: boolean): Candidate[] {
  const a = parseChord(aSym)
  const b = parseChord(bSym)
  if (!a || !b) return []
  const nm = (pc: number, suffix: string) => noteName(pc, flats) + suffix
  const d = (b.root - a.root + 12) % 12
  const la = slotOf(aSym, key)?.label ?? ""
  const lb = slotOf(bSym, key)?.label ?? ""
  const w = (t: Tool) => s.tools[t] ?? 0
  const out: Candidate[] = []
  const add = (tool: Tool | "direct", chords: string[], why: string, score: number) => out.push({ tool, chords, why, score })

  add("direct", [], `${aSym} to ${bSym} works as it is.`, 1 + 0.15 * moveScore(la, lb, key))
  if (d === 0) return out

  if (w("slide") > 0) {
    if (d === 2 || d === 3 || d === 9 || d === 10) {
      const step = d <= 3 ? 1 : -1
      const n = Math.min(d, 12 - d) - 1
      const chords = Array.from({ length: n }, (_, i) => nm(a.root + step * (i + 1) + 12, b.suffix))
      add("slide", chords,
        n === 1
          ? `Slide the ${aSym} shape ${step > 0 ? "up" : "down"} one fret to ${chords[0]}, then step on to ${bSym}.`
          : `Walk ${step > 0 ? "up" : "down"} by half steps from ${aSym}: ${chords.join(", ")}, then ${bSym}.`,
        w("slide") * (n === 1 ? 1 : 0.9))
    } else if (d !== 1 && d !== 11) {
      const c = nm(b.root - 1 + 12, b.suffix)
      add("slide", [c], `Approach ${bSym} from a half step below: ${c} slides up into it.`, w("slide") * 0.8)
    }
  }
  if (w("above") > 0 && d !== 11) {
    const c = nm(b.root + 1, b.suffix)
    add("above", [c], `Sidestep: land on ${bSym} from a half step above. ${c} slides down into it.`, w("above"))
  }
  const v = (b.root + 7) % 12
  if (w("five") > 0 && a.root !== v) {
    const c = nm(v, s.ext.dom || "7")
    add("five", [c], `${c} is the V chord of ${bSym}. It pulls hard toward it.`, w("five"))
  }
  if (w("twofive") > 0 && a.root !== v && a.root !== (b.root + 2) % 12) {
    const jazzy = ["jazz", "soul", "gospel"].includes(s.id) && isMinorSuffix(b.suffix)
    const ii = nm(b.root + 2, jazzy ? "m7b5" : s.ext.min || "m")
    const vv = nm(v, s.ext.dom || "7")
    add("twofive", [ii, vv], `${ii} then ${vv} is the classic setup for ${bSym}.`, w("twofive") * 0.9)
  }
  if (w("dim") > 0 && d !== 1) {
    const c = nm(b.root - 1 + 12, "dim7")
    add("dim", [c], `${c} is a passing diminished chord. It slides up a half step into ${bSym}.`, w("dim"))
  }
  if (w("scale") > 0 && la && lb) {
    const found: { x: string; ms: number }[] = []
    for (const x of ruleSources(key)) {
      if (x === la || x === lb) continue
      const m1 = moveScore(la, x, key)
      const m2 = moveScore(x, lb, key)
      if (m1 > 0 && m2 > 0) found.push({ x, ms: m1 + m2 })
    }
    found.sort((p, q) => q.ms - p.ms)
    for (const { x, ms } of found.slice(0, 2)) {
      const slot = resolveLabel(x, key)
      if (!slot) continue
      const flatName = x.startsWith("b") || (!x.startsWith("#") && flats)
      const c = noteName(key.root + slot.off, flatName) + fillerSuffix(x, slot.q, s, key.minor)
      if (used.has(c)) continue
      add("scale", [c], `${c} (${x}) sits naturally after ${aSym} and leads into ${bSym}.`, w("scale") * (0.5 + ms / 12))
    }
  }

  const best = new Map<string, Candidate>()
  for (const c of out) {
    const id = c.chords.join("|")
    const prev = best.get(id)
    if (!prev || c.score > prev.score) best.set(id, c)
  }
  return Array.from(best.values()).sort((p, q) => q.score - p.score)
}

// ─── Order ────────────────────────────────────────────────────────────────────

function permutations<T>(items: T[]): T[][] {
  if (items.length <= 1) return [items]
  const out: T[][] = []
  items.forEach((x, i) => {
    for (const rest of permutations([...items.slice(0, i), ...items.slice(i + 1)])) out.push([x, ...rest])
  })
  return out
}

function rankOrders(chords: string[], key: KeyRef, keep: boolean): string[][] {
  if (keep || chords.length < 2 || chords.length > PLAN_MAX) return [chords]
  const label = (c: string) => slotOf(c, key)?.label ?? ""
  const mv = (x: string, y: string) => Math.max(0.5, moveScore(label(x), label(y), key))
  const tonic = key.minor ? "i" : "I"
  const typed = chords.join("|")
  const seen = new Set<string>()
  const scored: { order: string[]; score: number }[] = []
  for (const order of permutations(chords)) {
    const id = order.join("|")
    if (seen.has(id)) continue
    seen.add(id)
    let score = 0
    for (let i = 0; i < order.length - 1; i++) score += mv(order[i], order[i + 1])
    score += 0.5 * mv(order[order.length - 1], order[0])
    if (label(order[0]) === tonic) score += 1.5
    if (/^v$/i.test(label(order[order.length - 1]))) score += 0.8
    if (id === typed) score += 1
    scored.push({ order, score })
  }
  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, 2).map(x => x.order)
}

// ─── Ideas ────────────────────────────────────────────────────────────────────

export interface PlanItem {
  chord: string
  mine: boolean
  roman: string
}

export interface PlanIdea {
  id: string
  title: string
  items: PlanItem[]
  notes: string[]
}

const MAX_BARS = 8

function buildIdea(order: string[], pairs: Candidate[][], tool: Tool, key: KeyRef): PlanIdea | null {
  const direct: Candidate = { tool: "direct", chords: [], why: "", score: 0 }
  const use = pairs.map(list => list.find(c => c.tool === tool) ?? list.find(c => c.tool === "direct") ?? direct)
  if (!use.some(p => p.tool === tool)) return null
  let total = order.length + use.reduce((n, p) => n + p.chords.length, 0)
  for (let i = use.length - 1; i >= 0 && total > MAX_BARS; i--) {
    total -= use[i].chords.length
    use[i] = direct
  }
  const label = (c: string) => slotOf(c, key)?.label ?? "?"
  const flat: PlanItem[] = []
  order.forEach((c, i) => {
    flat.push({ chord: c, mine: true, roman: label(c) })
    if (i < use.length) use[i].chords.forEach(x => flat.push({ chord: x, mine: false, roman: label(x) }))
  })
  return {
    id: `${tool}:${flat.map(f => f.chord).join(" ")}`,
    title: TOOL_NAME[tool],
    items: flat,
    notes: use.filter(p => p.chords.length > 0).map(p => p.why),
  }
}

export interface PlanResult {
  key: KeyRef
  keys: KeyChoice[]
  order: string[]
  reordered: boolean
  ideas: PlanIdea[]
}

function ideasFor(order: string[], key: KeyRef, s: StyleDef, limit: number, flats: boolean): PlanIdea[] {
  const used = new Set(order)
  const pairs = order.slice(0, -1).map((c, i) => candidates(c, order[i + 1], key, s, used, flats))
  const tools = (Object.keys(s.tools) as Tool[]).filter(t => (s.tools[t] ?? 0) > 0)
  const made: { idea: PlanIdea; score: number }[] = []
  for (const t of tools) {
    const idea = buildIdea(order, pairs, t, key)
    if (!idea) continue
    const score = pairs.reduce((n, list) => n + (list.find(c => c.tool === t)?.score ?? 0), 0)
    made.push({ idea, score })
  }
  made.sort((a, b) => b.score - a.score)
  const seen = new Set<string>()
  const out: PlanIdea[] = []
  for (const { idea } of made) {
    const sig = idea.items.map(i => i.chord).join(" ")
    if (seen.has(sig)) continue
    seen.add(sig)
    out.push(idea)
    if (out.length >= limit) break
  }
  return out
}

export function makePlan(wantedRaw: string[], styleId: StyleId, chosen: KeyRef | null, keep: boolean): PlanResult | null {
  if (wantedRaw.length === 0) return null
  const s = getStyle(styleId)
  const keys = planKeys(wantedRaw)
  const key = chosen ?? keys[0].key
  const flats = prefersFlats(key) || wantedRaw.some(c => /^[A-G]b/.test(c))
  const wanted = wantedRaw.map(c => {
    const p = parseChord(c)
    return p ? formatChord(p, flats) : c
  })

  if (wanted.length === 1) {
    const only = wanted[0]
    const label = slotOf(only, key)?.label ?? ""
    const targets = ruleTargets(label, key).filter(r => r[1] !== "surprise").slice(0, 3)
    const fallback = key.minor ? ["i", "V", "iv"] : ["I", "V", "IV"]
    const partners = (targets.length ? targets.map(t => t[0]) : fallback).filter(l => l !== label)
    const ideas: PlanIdea[] = []
    for (const l of partners) {
      const slot = resolveLabel(l, key)
      if (!slot) continue
      const flatName = l.startsWith("b") || (!l.startsWith("#") && flats)
      const partner = noteName(key.root + slot.off, flatName) + fillerSuffix(l, slot.q, s, key.minor)
      if (partner === only) continue
      const made = ideasFor([only, partner], key, s, 1, flats)[0]
      if (!made) continue
      const why = ruleTargets(label, key).find(r => r[0] === l)?.[2] ?? `It fits next to ${only}.`
      ideas.push({ ...made, title: `${only} then ${partner}`, notes: [`${partner} is the ${l} chord. ${why}`, ...made.notes] })
    }
    return { key, keys, order: wanted, reordered: false, ideas }
  }

  const orders = rankOrders(wanted, key, keep)
  const best = orders[0]
  const ideas = ideasFor(best, key, s, 3, flats)
  if (orders[1]) {
    const have = new Set(ideas.map(i => i.items.map(x => x.chord).join(" ")))
    const alt = ideasFor(orders[1], key, s, 1, flats).find(i => !have.has(i.items.map(x => x.chord).join(" ")))
    if (alt) ideas.push({ ...alt, title: `${alt.title}, other order` })
  }
  return { key, keys, order: best, reordered: best.join("|") !== wanted.join("|") && !keep, ideas }
}

export function keyName(key: KeyRef): string {
  return `${keyLabel(key)} ${key.minor ? "minor" : "major"}`
}
