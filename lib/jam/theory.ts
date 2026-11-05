import { getChordVoicings, type ChordVoicing } from "@/lib/chordShapes"
import { BIBLE_QUALITIES, bibleIdFromSuffix, bibleVoicings } from "@/lib/chordBible"

export const SHARP_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
export const FLAT_NAMES = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"]

export const MAJOR_STEPS = [0, 2, 4, 5, 7, 9, 11]
export const DEGREE_BY_SEMITONE = ["1", "b2", "2", "b3", "3", "4", "b5", "5", "b6", "6", "b7", "7"]

// Major keys (by pitch class) that are conventionally written with flats
const FLAT_MAJOR_KEYS = new Set([5, 10, 3, 8, 1, 6])
// Minor keys written with flats: Dm Gm Cm Fm Bbm Ebm
const FLAT_MINOR_KEYS = new Set([2, 7, 0, 5, 10, 3])

export interface KeyRef {
  root: number
  minor: boolean
  /** Set when the player chose sharps or flats on purpose. */
  flats?: boolean
}

export function prefersFlats(key: KeyRef): boolean {
  if (typeof key.flats === "boolean") return key.flats
  return key.minor ? FLAT_MINOR_KEYS.has(key.root) : FLAT_MAJOR_KEYS.has(key.root)
}

export function noteName(pc: number, flats: boolean): string {
  const i = ((pc % 12) + 12) % 12
  return flats ? FLAT_NAMES[i] : SHARP_NAMES[i]
}

export function keyLabel(key: KeyRef): string {
  return noteName(key.root, prefersFlats(key)) + (key.minor ? "m" : "")
}

export function parseNote(s: string): number | null {
  const m = /^([A-Ga-g])([#b♯♭]?)$/.exec(s)
  if (!m) return null
  const base: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }
  let pc = base[m[1].toUpperCase()]
  if (m[2] === "#" || m[2] === "♯") pc += 1
  if (m[2] === "b" || m[2] === "♭") pc -= 1
  return (pc + 12) % 12
}

// ─── Chord symbols ────────────────────────────────────────────────────────────

export interface ParsedChord {
  root: number
  suffix: string
  bass: number | null
}

export function parseChord(sym: string): ParsedChord | null {
  const m = /^([A-G][#b♯♭]?)([^/\s]*)(?:\/([A-G][#b♯♭]?))?$/.exec(sym.trim())
  if (!m) return null
  const root = parseNote(m[1])
  if (root === null) return null
  const bass = m[3] ? parseNote(m[3]) : null
  const suffix = m[2].replace("♯", "#").replace("♭", "b").replace("°", "dim")
  if (suffix && !/^(m|min|-|M|maj|ma|dim|aug|\+|sus|add|\d|b\d|#\d|\(|\)|°)/.test(suffix)) return null
  return { root, suffix: suffix === "min" || suffix === "-" ? "m" : suffix, bass }
}

export function formatChord(c: ParsedChord, flats: boolean): string {
  return noteName(c.root, flats) + c.suffix + (c.bass !== null ? "/" + noteName(c.bass, flats) : "")
}

export function transposeChord(sym: string, semis: number, flats: boolean): string {
  const c = parseChord(sym)
  if (!c) return sym
  return formatChord({ root: (c.root + semis + 120) % 12, suffix: c.suffix, bass: c.bass === null ? null : (c.bass + semis + 120) % 12 }, flats)
}

export function isMinorSuffix(suffix: string): boolean {
  return /^(m(?!aj)|min|-|dim|m7b5)/.test(suffix)
}

// ─── Nashville numbers ────────────────────────────────────────────────────────

export function toNashville(sym: string, tonic: number): string {
  const c = parseChord(sym)
  if (!c) return sym
  const d = DEGREE_BY_SEMITONE[(c.root - tonic + 12) % 12]
  const bass = c.bass !== null ? "/" + DEGREE_BY_SEMITONE[(c.bass - tonic + 12) % 12] : ""
  return d + c.suffix + bass
}

const NASH_RE = /^([b#]?)([1-7])([^/]*)(?:\/([b#]?)([1-7]))?$/

export function fromNashville(token: string, tonic: number, flats: boolean): string {
  const m = NASH_RE.exec(token.trim())
  if (!m) return token
  const toPc = (acc: string, deg: string) => {
    let pc = (tonic + MAJOR_STEPS[parseInt(deg, 10) - 1]) % 12
    if (acc === "b") pc -= 1
    if (acc === "#") pc += 1
    return (pc + 12) % 12
  }
  const root = toPc(m[1], m[2])
  const bass = m[5] ? toPc(m[4], m[5]) : null
  return formatChord({ root, suffix: m[3], bass }, flats)
}

export interface DiatonicChord {
  degree: number
  roman: string
  nashville: string
  root: number
  triad: string
  seventh: string
  quality: "major" | "minor" | "diminished"
}

const MAJOR_QUALITIES: ("major" | "minor" | "diminished")[] = ["major", "minor", "minor", "major", "major", "minor", "diminished"]
const MAJOR_ROMAN = ["I", "ii", "iii", "IV", "V", "vi", "vii°"]
const MAJOR_SEVENTH = ["maj7", "m7", "m7", "maj7", "7", "m7", "m7b5"]

export function diatonicChords(key: KeyRef): DiatonicChord[] {
  const flats = prefersFlats(key)
  // Minor keys are built from the relative major so numbering lines up with the Nashville chart
  const majorTonic = key.minor ? (key.root + 3) % 12 : key.root
  return MAJOR_STEPS.map((step, i) => {
    const root = (majorTonic + step) % 12
    const q = MAJOR_QUALITIES[i]
    const name = noteName(root, flats)
    return {
      degree: i + 1,
      roman: MAJOR_ROMAN[i],
      nashville: String(i + 1) + (q === "minor" ? "m" : q === "diminished" ? "dim" : ""),
      root,
      triad: name + (q === "minor" ? "m" : q === "diminished" ? "dim" : ""),
      seventh: name + MAJOR_SEVENTH[i],
      quality: q,
    }
  })
}

// ─── Voicing lookup + tab ─────────────────────────────────────────────────────

export interface VoicingMatch {
  rootName: string
  quality: string
  voicings: ChordVoicing[]
  simplified: boolean
}

function qualityFromSuffix(suffix: string): { quality: string; simplified: boolean } {
  const s = suffix.replace(/[()]/g, "")
  if (s === "5") return { quality: "Major", simplified: true }
  const id = bibleIdFromSuffix(s)
  if (id) return { quality: BIBLE_QUALITIES.find(q => q.id === id)!.label, simplified: false }
  if (/^m(6|add9)/.test(s)) return { quality: "Minor", simplified: true }
  if (/^m(9|11|13)/.test(s)) return { quality: "Minor 7th", simplified: true }
  if (/^(maj9|maj13|M9)/.test(s)) return { quality: "Major 7th", simplified: true }
  if (/^7sus/.test(s)) return { quality: "Sus4", simplified: true }
  if (/^(9|11|13|7b9|7#9|7#11|7b5)/.test(s)) return { quality: "Dominant 7th", simplified: true }
  if (/^sus2/.test(s)) return { quality: "Sus2", simplified: true }
  return { quality: "Major", simplified: true }
}

// Library shapes come first (they are the friendly open shapes); Bible shapes follow.
export function voicingsFor(rootPc: number, quality: string): ChordVoicing[] | null {
  const lib = getChordVoicings(SHARP_NAMES[rootPc], quality) ?? []
  const bq = BIBLE_QUALITIES.find(q => q.label === quality)
  const seen = new Set(lib.map(v => v.fingers.join(",")))
  const extra: ChordVoicing[] = []
  if (bq) {
    const all = bibleVoicings(rootPc, bq.id)
    const ordered = bq.libKey ? all.filter(v => v.rootBass) : [...all.filter(v => v.rootBass), ...all.filter(v => !v.rootBass)]
    for (const v of ordered) {
      const k = v.fingers.join(",")
      if (seen.has(k)) continue
      seen.add(k)
      extra.push({ fingers: v.fingers, position: v.position, difficulty: v.difficulty })
    }
  }
  const out = [...lib, ...extra]
  return out.length ? out : null
}

export function findVoicings(sym: string): VoicingMatch | null {
  const c = parseChord(sym)
  if (!c) return null
  const rootName = SHARP_NAMES[c.root]
  const { quality, simplified } = qualityFromSuffix(c.suffix)
  const voicings = voicingsFor(c.root, quality)
  if (!voicings) return null
  return { rootName, quality, voicings, simplified }
}

const STRING_LABELS = ["e", "B", "G", "D", "A", "E"]

// fingers are [E,A,D,G,B,e]; tab is drawn high e on top
export function tabLines(fingers: (number | string)[]): string[] {
  const reversed = [...fingers].reverse()
  const width = Math.max(...reversed.map(f => String(f).length))
  return reversed.map((f, i) => `${STRING_LABELS[i]}|--${String(f).padEnd(width, "-")}--|`)
}

export function fingersText(fingers: (number | string)[]): string {
  return fingers.map(f => String(f)).join(" ")
}

export function listAllQualities(): string[] {
  return BIBLE_QUALITIES.map(q => q.label)
}

// ─── Key finder ───────────────────────────────────────────────────────────────

export interface KeyGuess {
  key: KeyRef
  score: number
  matches: number
  total: number
  outside: string[]
}

export function guessKeys(symbols: string[], limit = 4): KeyGuess[] {
  const chords = symbols.map(parseChord).filter((c): c is ParsedChord => c !== null)
  if (chords.length === 0) return []
  const guesses: KeyGuess[] = []
  for (let root = 0; root < 12; root++) {
    for (const minor of [false, true]) {
      const key = { root, minor }
      const diat = diatonicChords(key)
      const allowed = new Map<number, ("major" | "minor" | "diminished")[]>()
      diat.forEach(d => allowed.set(d.root, [...(allowed.get(d.root) ?? []), d.quality]))
      // Dominant V in a minor key is very common (harmonic minor)
      const tonic = minor ? root : root
      let matches = 0
      const outside: string[] = []
      chords.forEach(c => {
        const quals = allowed.get(c.root) ?? []
        const wanted = /^(dim|m7b5)/.test(c.suffix) ? "diminished" : isMinorSuffix(c.suffix) ? "minor" : "major"
        const harmonicV = minor && c.root === (root + 7) % 12 && wanted === "major"
        const ok = quals.includes(wanted) || harmonicV
        if (ok) matches++
        else outside.push(formatChord(c, prefersFlats(key)))
      })
      let score = matches * 10
      const first = chords[0]
      const last = chords[chords.length - 1]
      const isTonic = (c: ParsedChord) => c.root === tonic && (minor ? isMinorSuffix(c.suffix) : !isMinorSuffix(c.suffix))
      if (isTonic(first)) score += 4
      if (isTonic(last)) score += 6
      if (chords.some(isTonic)) score += 3
      // IV and V present support the key
      const has = (pc: number) => chords.some(c => c.root === pc)
      if (has((root + 5) % 12)) score += 1
      if (has((root + 7) % 12)) score += 2
      guesses.push({ key, score, matches, total: chords.length, outside })
    }
  }
  return guesses.sort((a, b) => b.score - a.score).slice(0, limit)
}

// ─── Capo ─────────────────────────────────────────────────────────────────────

const EASY_SHAPES = new Set(["C", "A", "G", "E", "D", "Am", "Em", "Dm", "E7", "A7", "D7", "G7", "C7", "B7", "Cmaj7", "Amaj7", "Dmaj7", "Gmaj7", "Fmaj7", "Am7", "Em7", "Dm7", "Asus4", "Dsus4", "Esus4", "Csus4"])

export interface CapoOption {
  capo: number
  shapeKey: string
  shapes: string[]
  easyCount: number
  total: number
}

export function capoOptions(chords: string[], maxCapo = 7): CapoOption[] {
  const out: CapoOption[] = []
  for (let capo = 0; capo <= maxCapo; capo++) {
    const shapes = chords.map(c => {
      const p = parseChord(c)
      if (!p) return c
      return formatChord({ root: (p.root - capo + 120) % 12, suffix: p.suffix, bass: p.bass === null ? null : (p.bass - capo + 120) % 12 }, false)
    })
    const easyCount = shapes.filter(s => {
      const p = parseChord(s)
      return p ? EASY_SHAPES.has(SHARP_NAMES[p.root] + p.suffix) : false
    }).length
    out.push({ capo, shapeKey: "", shapes, easyCount, total: chords.length })
  }
  return out.sort((a, b) => b.easyCount - a.easyCount || a.capo - b.capo)
}

// ─── Chord-chart text ─────────────────────────────────────────────────────────

const INLINE_CHORD = /\[([^\]]+)\]/g

function isChordToken(tok: string): boolean {
  return parseChord(tok) !== null || /^[|/\-.x%]+$/.test(tok)
}

export function isChordLine(line: string): boolean {
  const toks = line.trim().split(/\s+/).filter(Boolean)
  if (toks.length === 0) return false
  return toks.every(isChordToken) && toks.some(t => parseChord(t) !== null)
}

export function transposeChartText(text: string, semis: number, flats: boolean): string {
  if (semis === 0) return text
  return mapChartChords(text, c => transposeChord(c, semis, flats))
}

// Rewrites every chord in a chart (bracketed, bar lines and chord-above-lyric lines), keeping the layout.
export function mapChartChords(text: string, fn: (chord: string) => string): string {
  return text
    .split("\n")
    .map(line => {
      if (INLINE_CHORD.test(line)) {
        INLINE_CHORD.lastIndex = 0
        return line.replace(INLINE_CHORD, (_, c: string) => `[${fn(c)}]`)
      }
      INLINE_CHORD.lastIndex = 0
      if (!isChordLine(line)) return line
      let out = ""
      let carry = 0
      const re = /(\s*)(\S+)/g
      let m: RegExpExecArray | null
      while ((m = re.exec(line))) {
        let gap = m[1]
        // absorb length changes into the whitespace before the next chord
        if (carry !== 0 && gap.length > 1) {
          const take = Math.min(carry, gap.length - 1)
          gap = gap.slice(0, gap.length - take)
          carry -= take
        }
        const next = parseChord(m[2]) ? fn(m[2]) : m[2]
        carry += next.length - m[2].length
        out += gap + next
      }
      return out
    })
    .join("\n")
}

export interface ChartLine {
  kind: "section" | "chords" | "lyric" | "blank" | "inline"
  text: string
}

export function classifyChart(text: string): ChartLine[] {
  return text.split("\n").map(line => {
    if (line.trim() === "") return { kind: "blank", text: "" }
    if (/^\s*[\[(]?(verse|chorus|bridge|intro|outro|solo|pre-chorus|prechorus|tag|interlude|instrumental|turnaround|ending)\s*\d*[\])]?:?\s*$/i.test(line) || /^\s*\{.*\}\s*$/.test(line)) {
      return { kind: "section", text: line.replace(/[\[\]{}]/g, "").replace(/:$/, "").trim() }
    }
    if (/\[[^\]]+\]/.test(line)) return { kind: "inline", text: line }
    if (isChordLine(line)) return { kind: "chords", text: line }
    return { kind: "lyric", text: line }
  })
}

export function extractChordsFromChart(text: string): string[] {
  const found: string[] = []
  for (const l of classifyChart(text)) {
    if (l.kind === "inline") {
      for (const m of l.text.matchAll(/\[([^\]]+)\]/g)) if (parseChord(m[1])) found.push(m[1])
    } else if (l.kind === "chords") {
      l.text.trim().split(/\s+/).forEach(t => parseChord(t) && found.push(t))
    }
  }
  return found
}

export interface ChordPhrase {
  label: string
  chords: string[]
}

function collapseRepeats(chords: string[]): string[] {
  for (let p = 1; p <= chords.length / 2; p++) {
    if (chords.length % p !== 0) continue
    if (chords.every((c, i) => c === chords[i % p])) return p === 1 ? chords.slice(0, Math.min(4, chords.length)) : chords.slice(0, p)
  }
  return chords
}

// Splits a chart into its distinct chord progressions (one per section), so tabs can follow what is on screen.
export function extractPhrases(text: string, maxPhrases = 6, maxLen = 12): ChordPhrase[] {
  const sections: { label: string; lines: string[][] }[] = [{ label: "Chords", lines: [] }]
  for (const l of classifyChart(text)) {
    if (l.kind === "section") {
      sections.push({ label: l.text, lines: [] })
    } else if (l.kind === "inline" || l.kind === "chords") {
      const cs = l.kind === "inline"
        ? [...l.text.matchAll(/\[([^\]]+)\]/g)].map(m => m[1]).filter(c => parseChord(c) !== null)
        : l.text.trim().split(/\s+/).filter(t => parseChord(t) !== null)
      if (cs.length) sections[sections.length - 1].lines.push(cs)
    }
  }
  const out: ChordPhrase[] = []
  const seen = new Set<string>()
  const labelCount = new Map<string, number>()
  const push = (label: string, chords: string[]) => {
    const c = collapseRepeats(chords).slice(0, maxLen)
    const id = c.join(" ")
    if (!c.length || seen.has(id)) return
    seen.add(id)
    const n = (labelCount.get(label) ?? 0) + 1
    labelCount.set(label, n)
    out.push({ label: n > 1 ? `${label} (${n})` : label, chords: c })
  }
  for (const sec of sections) {
    if (!sec.lines.length) continue
    const all = sec.lines.flat()
    if (all.length <= maxLen) push(sec.label, all)
    else sec.lines.forEach(line => push(sec.label, line))
  }
  return out.slice(0, maxPhrases)
}

export function parseChordList(input: string): string[] {
  return input
    .split(/[\s,|\-–>]+/)
    .map(s => s.trim())
    .filter(s => s && parseChord(s) !== null)
}
