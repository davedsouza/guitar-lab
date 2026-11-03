import { capoOptions, guessKeys, MAJOR_STEPS, noteName, parseChord, prefersFlats, findVoicings, type KeyRef } from "./theory"

export type Slot = "solo" | "g1" | "g2" | "g3" | "bass" | "piano" | "harp"
export type TabKind = "guitar" | "bass" | "piano" | "harp"

export interface TabSpec {
  kind: TabKind
  chords: string[]
  // One string per bar. Columns are space separated: "." is a rest.
  // A column lists notes as "<string><fret>" joined by commas, e.g. "63,52" = string 6 fret 3 + string 5 fret 2.
  // Guitar strings 1-6 = e B G D A E. Bass strings 1-4 = G D A E. Piano 1 = RH, 2 = LH. Harmonica 1 = blow, 2 = draw (token = hole, "2-4" = holes 2 to 4 together).
  // Fret tokens may be "x" (mute) or "5/7" (slide).
  bars: string[]
  defs?: Record<string, string>
  capo?: number
  caption: string
  notes?: string[]
}

export const LABELS: Record<TabKind, string[]> = {
  guitar: ["e", "B", "G", "D", "A", "E"],
  bass: ["G", "D", "A", "E"],
  piano: ["RH", "LH"],
  harp: ["Blow", "Draw"],
}

export const COUNTS: Record<number, string[]> = {
  4: ["1", "2", "3", "4"],
  8: ["1", "&", "2", "&", "3", "&", "4", "&"],
  12: ["1", "&", "a", "2", "&", "a", "3", "&", "a", "4", "&", "a"],
  16: ["1", "e", "&", "a", "2", "e", "&", "a", "3", "e", "&", "a", "4", "e", "&", "a"],
}

type Cell = Map<number, string>

export function parseBars(spec: TabSpec): Cell[][] {
  const defs = spec.defs ?? {}
  return spec.bars.map(bar =>
    bar.trim().split(/\s+/).map(col => {
      const cell: Cell = new Map()
      if (col === ".") return cell
      for (const raw of col.split(",")) {
        const items = defs[raw] !== undefined ? defs[raw].split(",") : [raw]
        for (const it of items) cell.set(Number(it[0]), it.slice(1))
      }
      return cell
    })
  )
}

export const MAX_CHARS = 38

interface Chunk { bar: number; from: number; to: number }

// Renders the tab as plain text lines. Bars wrap onto new lines, and a bar that is too wide for the
// screen is split in equal parts, so no line is ever longer than MAX_CHARS.
export function renderTab(spec: TabSpec): string {
  const bars = parseBars(spec)
  const labels = LABELS[spec.kind]
  const lw = Math.max(...labels.map(l => l.length))
  let tokenMax = 1
  for (const bar of bars) for (const cell of bar) for (const t of cell.values()) tokenMax = Math.max(tokenMax, t.length)
  const w = tokenMax + 1

  const room = MAX_CHARS - lw - 1 - 2
  const chunks: Chunk[] = []
  bars.forEach((bar, i) => {
    let parts = 1
    while (parts < bar.length && (bar.length / parts) * w > room) parts *= 2
    const size = Math.ceil(bar.length / parts)
    for (let a = 0; a < bar.length; a += size) chunks.push({ bar: i, from: a, to: Math.min(bar.length, a + size) })
  })

  const widthOf = (c: Chunk) => {
    const base = (c.to - c.from) * w + 1
    const label = c.from === 0 ? (spec.chords[c.bar] ?? "") : ""
    return Math.max(base, label.length)
  }

  const systems: Chunk[][] = []
  let cur: Chunk[] = []
  let curLen = lw + 1
  for (const c of chunks) {
    const add = widthOf(c) + 1
    if (cur.length && curLen + add > MAX_CHARS) {
      systems.push(cur)
      cur = []
      curLen = lw + 1
    }
    cur.push(c)
    curLen += add
  }
  if (cur.length) systems.push(cur)

  const out: string[] = []
  for (const sys of systems) {
    const pad = " ".repeat(lw + 1)
    let chordLine = pad
    let countLine = pad
    const hasCounts = sys.some(c => COUNTS[bars[c.bar].length])
    for (const c of sys) {
      const n = bars[c.bar].length
      const cols = c.to - c.from
      const base = cols * w + 1
      const width = widthOf(c)
      const label = c.from === 0 ? (spec.chords[c.bar] ?? "") : ""
      chordLine += label.padEnd(width) + " "
      const tokens = COUNTS[n]?.slice(c.from, c.to)
      countLine += (tokens ? tokens.map(t => (" " + t).padEnd(w)).join("") : " ".repeat(base)).padEnd(width) + " "
    }
    out.push(chordLine.trimEnd())
    if (hasCounts) out.push(countLine.trimEnd())
    labels.forEach((label, s) => {
      let line = label.padEnd(lw) + "|"
      for (const c of sys) {
        const base = (c.to - c.from) * w + 1
        const extra = widthOf(c) - base
        for (let k = c.from; k < c.to; k++) {
          const t = bars[c.bar][k].get(s + 1)
          line += "-" + (t ?? "").padEnd(w - 1, "-")
        }
        line += "-".repeat(extra) + "-|"
      }
      out.push(line)
    })
    out.push("")
  }
  while (out.length && out[out.length - 1] === "") out.pop()
  return out.join("\n")
}

export function tabLegend(spec: TabSpec): string {
  const text = spec.bars.join(" ") + " " + Object.values(spec.defs ?? {}).join(" ")
  const bits: string[] = []
  if (spec.kind === "harp") return "Numbers are holes. Top row (green) = blow, breathe out. Bottom row (blue) = draw, breathe in. 2-4 = play holes 2 to 4 together."
  if (spec.kind === "piano") bits.push("x = play")
  else if (/\d[a-z]?x/.test(text) || /\bx\b/.test(text)) bits.push("x = muted")
  if (/\d\/\d/.test(text)) bits.push("/ = slide")
  return bits.join(" · ")
}

// ─── Chord model ──────────────────────────────────────────────────────────────

const mod = (n: number) => ((n % 12) + 12) % 12
const OPEN_GTR = [64, 59, 55, 50, 45, 40]
const OPEN_BASS = [43, 38, 33, 28]

export interface ChordInfo {
  sym: string
  root: number
  bass: number
  third: number | null
  fifth: number
  seventh: number | null
  exts: number[]
  minor: boolean
  tones: number[]
  must: number[]
}

const infoCache = new Map<string, ChordInfo | null>()

export function chordInfo(sym: string): ChordInfo | null {
  if (infoCache.has(sym)) return infoCache.get(sym) ?? null
  const info = buildInfo(sym)
  infoCache.set(sym, info)
  return info
}

function buildInfo(sym: string): ChordInfo | null {
  const c = parseChord(sym)
  if (!c) return null
  const root = c.root
  const bass = c.bass ?? c.root
  let s = c.suffix.replace(/[()]/g, "")
  let minor = false
  let dim = false
  let aug = false
  if (/^(min|m(?!aj)|-)/.test(s)) { minor = true; s = s.replace(/^(min|m|-)/, "") }
  else if (/^(dim|°)/.test(s)) { minor = true; dim = true; s = s.replace(/^(dim|°)/, "") }
  else if (/^(aug|\+)/.test(s)) { aug = true; s = s.replace(/^(aug|\+)/, "") }

  let third: number | null = root + (minor ? 3 : 4)
  let fifth = root + (dim ? 6 : aug ? 8 : 7)
  let seventh: number | null = null
  const exts: number[] = []

  if (s === "5") { third = null; s = "" }
  const mm = /^(maj|M|ma)(\d*)/.exec(s)
  const nm = /^(\d+)/.exec(s)
  if (mm) {
    seventh = root + 11
    s = s.slice(mm[0].length)
    if (mm[2] === "9") exts.push(root + 2)
    else if (mm[2] === "11") exts.push(root + 5)
    else if (mm[2] === "13") exts.push(root + 9)
  } else if (nm) {
    s = s.slice(nm[0].length)
    const n = nm[1]
    if (n === "6") seventh = root + 9
    else if (n === "69") { seventh = root + 9; exts.push(root + 2) }
    else if (n === "7") seventh = root + (dim ? 9 : 10)
    else if (n === "9") { seventh = root + 10; exts.push(root + 2) }
    else if (n === "11") { seventh = root + 10; exts.push(root + 5) }
    else if (n === "13") { seventh = root + 10; exts.push(root + 9) }
  }
  let altFifth = dim || aug
  for (const m of s.matchAll(/sus2|sus4|sus|add9|add2|add11|add4|add13|add6|b5|#5|b9|#9|#11|b13/g)) {
    switch (m[0]) {
      case "sus2": third = root + 2; break
      case "sus4": case "sus": third = root + 5; break
      case "add9": case "add2": exts.push(root + 2); break
      case "add11": case "add4": exts.push(root + 5); break
      case "add13": case "add6": exts.push(root + 9); break
      case "b5": fifth = root + 6; altFifth = true; break
      case "#5": fifth = root + 8; altFifth = true; break
      case "b9": exts.push(root + 1); break
      case "#9": exts.push(root + 3); break
      case "#11": exts.push(root + 6); break
      case "b13": exts.push(root + 8); break
    }
  }
  const thirdPc = third === null ? null : mod(third)
  const seventhPc = seventh === null ? null : mod(seventh)
  const extPcs = [...new Set(exts.map(mod))]
  const fifthPc = mod(fifth)
  const tones = [...new Set([mod(root), ...(thirdPc === null ? [] : [thirdPc]), fifthPc, ...(seventhPc === null ? [] : [seventhPc]), ...extPcs, mod(bass)])]
  const must = [...new Set([mod(root), ...(thirdPc === null ? [fifthPc] : [thirdPc]), ...(seventhPc === null ? [] : [seventhPc]), ...extPcs, ...(altFifth ? [fifthPc] : [])])]
  return { sym, root: mod(root), bass: mod(bass), third: thirdPc, fifth: fifthPc, seventh: seventhPc, exts: extPcs, minor, tones, must }
}

// ─── Guitar voicings ──────────────────────────────────────────────────────────

export type Voicing = (number | null)[] // index = tab string - 1 (0 = high e)

interface VNote { s: number; f: number }

function vnotes(v: Voicing): VNote[] {
  const out: VNote[] = []
  for (let s = 6; s >= 1; s--) {
    const f = v[s - 1]
    if (f !== null && f !== undefined) out.push({ s, f })
  }
  return out
}

const pcAt = (s: number, f: number) => mod(OPEN_GTR[s - 1] + f)
const cellOf = (ns: VNote[]) => ns.map(n => `${n.s}${n.f}`).join(",")

function voicingCost(v: Voicing, info: ChordInfo): number | null {
  const ns = vnotes(v)
  if (ns.length < (info.third === null ? 3 : 4)) return null
  const first = ns[0]
  const last = ns[ns.length - 1]
  for (let s = first.s; s >= last.s; s--) if (v[s - 1] === null || v[s - 1] === undefined) return null
  if (pcAt(first.s, first.f) !== info.bass) return null
  const pcs = new Set<number>()
  for (const n of ns) {
    const pc = pcAt(n.s, n.f)
    if (!info.tones.includes(pc)) return null
    pcs.add(pc)
  }
  for (const m of info.must) if (!pcs.has(m)) return null
  const fretted = ns.filter(n => n.f > 0).map(n => n.f)
  const span = fretted.length ? Math.max(...fretted) - Math.min(...fretted) : 0
  if (span > 4) return null
  let cost = fretted.length + span * 0.7 + (fretted.length ? Math.min(...fretted) * 0.9 : 0)
  cost -= ns.filter(n => n.f === 0).length * 0.4
  cost -= (ns.length - 4) * 0.3
  if (!pcs.has(info.fifth) && info.third !== null) cost += 1.5
  const counts = new Map<number, number>()
  for (const f of fretted) counts.set(f, (counts.get(f) ?? 0) + 1)
  if ([...counts.values()].some(x => x >= 3)) cost += 1.5
  return cost
}

function searchVoicing(info: ChordInfo): Voicing | null {
  let best: Voicing | null = null as Voicing | null
  let bestCost = Infinity
  const minStrings = info.third === null ? 3 : 4
  for (let lo = 0; lo <= 10; lo++) {
    const opts: number[][] = []
    for (let s = 1; s <= 6; s++) {
      const cand: number[] = []
      if (lo <= 3) cand.push(0)
      for (let f = Math.max(1, lo); f <= lo + 3 && f <= 15; f++) cand.push(f)
      opts.push(cand.filter(f => info.tones.includes(pcAt(s, f))))
    }
    for (let a = 6; a >= 3; a--) {
      const cur: Voicing = [null, null, null, null, null, null]
      const rec = (s: number, count: number) => {
        if (s < a && count >= minStrings) {
          const c = voicingCost(cur, info)
          if (c !== null && c < bestCost) { bestCost = c; best = [...cur] }
        }
        if (s < 1) return
        for (const f of opts[s - 1]) {
          if (s === a && pcAt(s, f) !== info.bass) continue
          cur[s - 1] = f
          rec(s - 1, count + 1)
        }
        cur[s - 1] = null
      }
      rec(a, 0)
      for (let s = 1; s <= 6; s++) cur[s - 1] = null
    }
  }
  return best
}

function fromFingers(fingers: (number | string)[]): Voicing {
  const v: Voicing = [null, null, null, null, null, null]
  for (let i = 0; i < 6; i++) {
    const f = fingers[i]
    v[5 - i] = typeof f === "number" ? f : null
  }
  return v
}

function powerVoicing(info: ChordInfo): Voicing {
  let bestS = 6
  let bestF = 99
  for (const s of [6, 5, 4]) {
    const f = mod(info.root - OPEN_GTR[s - 1])
    if (f < bestF) { bestF = f; bestS = s }
  }
  const v: Voicing = [null, null, null, null, null, null]
  const m0 = OPEN_GTR[bestS - 1] + bestF
  const iv = mod(info.fifth - info.root)
  v[bestS - 1] = bestF
  v[bestS - 2] = m0 + iv - OPEN_GTR[bestS - 2]
  const oct = m0 + 12 - OPEN_GTR[bestS - 3]
  if (bestS - 3 >= 0) v[bestS - 3] = oct
  return v
}

const voicingCache = new Map<string, Voicing>()

export function voicingFor(sym: string): Voicing {
  const hit = voicingCache.get(sym)
  if (hit) return hit
  const info = chordInfo(sym)
  if (!info) throw new Error("bad chord " + sym)
  let best: Voicing | null = null as Voicing | null
  let bestCost = Infinity
  const lib = findVoicings(sym)
  if (lib) {
    for (const cv of lib.voicings) {
      const v = fromFingers(cv.fingers)
      const c = voicingCost(v, info)
      if (c !== null && c - 1.5 < bestCost) { bestCost = c - 1.5; best = v }
    }
  }
  const found = searchVoicing(info)
  if (found) {
    const c = voicingCost(found, info)
    if (c !== null && c < bestCost) { bestCost = c; best = found }
  }
  if (!best) {
    const relaxed: ChordInfo = { ...info, must: info.must.slice(0, 2) }
    const r = searchVoicing(relaxed)
    if (r) best = r
  }
  const result = best ?? powerVoicing(info)
  voicingCache.set(sym, result)
  return result
}

// ─── Placement helpers ────────────────────────────────────────────────────────

interface Placed { frets: number[]; cost: number }

// Finds the lowest-position frets for one pitch class per string.
function placeSet(open: number[], strs: number[], pcs: number[], minF: number, maxF: number, maxSpan = 4): Placed | null {
  let best: Placed | null = null as Placed | null
  const cur: number[] = []
  const rec = (k: number) => {
    if (k === strs.length) {
      const fr = cur.filter(f => f > 0)
      const span = fr.length ? Math.max(...fr) - Math.min(...fr) : 0
      if (span > maxSpan) return
      const cost = Math.max(...cur) + span * 0.3 + cur.reduce((a, b) => a + b, 0) * 0.05
      if (!best || cost < best.cost) best = { frets: [...cur], cost }
      return
    }
    for (let f = minF; f <= maxF; f++) {
      if (mod(open[strs[k] - 1] + f) === pcs[k]) { cur.push(f); rec(k + 1); cur.pop() }
    }
  }
  rec(0)
  return best
}

function perms<T>(a: T[]): T[][] {
  if (a.length <= 1) return [a]
  return a.flatMap((x, i) => perms([...a.slice(0, i), ...a.slice(i + 1)]).map(p => [x, ...p]))
}

// Best arrangement of the given pitch classes across the given strings, in any order.
function placeAny(strs: number[], pcs: number[], minF: number, maxF: number, maxSpan = 4): VNote[] | null {
  let best: { n: VNote[]; cost: number } | null = null as { n: VNote[]; cost: number } | null
  for (const p of perms(pcs)) {
    const r = placeSet(OPEN_GTR, strs, p, minF, maxF, maxSpan)
    if (r && (!best || r.cost < best.cost)) best = { n: strs.map((s, i) => ({ s, f: r.frets[i] })), cost: r.cost }
  }
  return best ? best.n : null
}

function fretFor(midi: number, open: number[], o: { minF?: number; maxF?: number; low?: boolean } = {}): VNote | null {
  const minF = o.minF ?? 0
  const maxF = o.maxF ?? 9
  const idx = open.map((_, i) => i)
  if (o.low) idx.reverse()
  for (const i of idx) {
    const f = midi - open[i]
    if (f >= minF && f <= maxF) return { s: i + 1, f }
  }
  for (const i of idx) {
    const f = midi - open[i]
    if (f >= 0 && f <= maxF + 6) return { s: i + 1, f }
  }
  return null
}


// Places a melody on the neck, keeping the hand in one position instead of jumping around.
function placeLine(midis: number[], o: { minF?: number; maxF?: number } = {}): (VNote | null)[] {
  const minF = o.minF ?? 0
  const maxF = o.maxF ?? 9
  const cands = midis.map(m => {
    const c: VNote[] = []
    for (let i = 0; i < 6; i++) {
      const f = m - OPEN_GTR[i]
      if (f >= minF && f <= maxF) c.push({ s: i + 1, f })
    }
    if (!c.length) for (let i = 0; i < 6; i++) {
      const f = m - OPEN_GTR[i]
      if (f >= 0 && f <= 15) c.push({ s: i + 1, f })
    }
    return c
  })
  const best: { cost: number; prev: number }[][] = []
  cands.forEach((cs, k) => {
    best.push(cs.map(c => {
      const unary = c.f * 0.12
      if (k === 0) return { cost: unary, prev: -1 }
      let bc = Infinity
      let bp = -1
      cands[k - 1].forEach((p, j) => {
        const move = p.f > 0 && c.f > 0 ? Math.abs(p.f - c.f) : 0.6
        const cost = best[k - 1][j].cost + move + Math.abs(p.s - c.s) * 0.7
        if (cost < bc) { bc = cost; bp = j }
      })
      return { cost: bc + unary, prev: bp }
    }))
  })
  const out: (VNote | null)[] = midis.map(() => null)
  let k = midis.length - 1
  if (k < 0 || !cands[k].length) return out
  let j = best[k].reduce((bi, x, i, a) => (x.cost < a[bi].cost ? i : bi), 0)
  for (; k >= 0 && j >= 0; k--) {
    out[k] = cands[k][j]
    j = best[k][j].prev
  }
  return out
}

const MUTE_ALL = "1x,2x,3x,4x,5x,6x"

// ─── Context ──────────────────────────────────────────────────────────────────

interface Ctx {
  info: ChordInfo
  shape: ChordInfo
  next: ChordInfo
  i: number
  n: number
  key: KeyRef
  flats: boolean
  state: Record<string, number>
}

type PoolKind = "diatonic" | "funk" | "pent" | "blues"

interface LineCfg { pool: PoolKind; around: number; maxF?: number; minF?: number; low?: boolean }

export function keyScale(key: KeyRef): number[] {
  const steps = key.minor ? [0, 2, 3, 5, 7, 8, 10] : MAJOR_STEPS
  return steps.map(s => mod(key.root + s))
}

function scalePool(c: Ctx, kind: PoolKind): number[] {
  const { info, key } = c
  if (kind === "pent") return [0, 3, 5, 7, 10].map(s => mod(key.root + s))
  if (kind === "blues") return [0, 3, 5, 6, 7, 10].map(s => mod(key.root + s))
  if (kind === "funk") return (info.minor ? [0, 3, 5, 7, 10] : [0, 3, 4, 7, 10]).map(s => mod(info.root + s))
  const pool = new Set<number>(keyScale(key))
  for (const t of info.tones) pool.add(t)
  for (const n of [...pool]) {
    if (info.tones.includes(n)) continue
    if (info.tones.includes(mod(n - 1))) pool.delete(n)
    else if (info.third !== null && mod(n + 1) === info.third) pool.delete(n)
    else if (info.seventh !== null && mod(n + 1) === info.seventh) pool.delete(n)
  }
  return [...pool]
}

function ladder(pcs: number[], lo: number, hi: number): number[] {
  const out: number[] = []
  for (let m = lo; m <= hi; m++) if (pcs.includes(mod(m))) out.push(m)
  return out
}

function offsets(n: number, variant: number): number[] {
  const desc = Array.from({ length: n }, (_, k) => n - 1 - k)
  const asc = desc.map(x => -x)
  const zig = (a: number[]) => {
    const b = [...a]
    for (let k = 0; k + 2 < b.length; k += 2) [b[k], b[k + 1]] = [b[k + 1], b[k]]
    return b
  }
  return [desc, asc, zig(desc), zig(asc)][variant % 4]
}

function endTone(c: Ctx, pool: number[]): number {
  const cands = [c.info.root, c.info.third, c.info.fifth].filter((x): x is number => x !== null && pool.includes(x))
  const uniq = [...new Set(cands)]
  if (uniq.length) return uniq[c.i % uniq.length]
  return c.info.root
}

function scaleLine(c: Ctx, n: number, cfg: LineCfg): string[] {
  const base = scalePool(c, cfg.pool)
  const end = endTone(c, base)
  const pool = base.includes(end) ? base : [...base, end]
  const lad = ladder(pool, 40, 64 + (cfg.maxF ?? 9))
  const desc = c.i % 2 === 0
  let e = -1
  let bestD = Infinity
  for (const strict of [true, false]) {
    lad.forEach((m, k) => {
      if (mod(m) !== end) return
      if (strict && (desc ? k + (n - 1) > lad.length - 1 : k - (n - 1) < 0)) return
      if (Math.abs(m - cfg.around) < bestD) { bestD = Math.abs(m - cfg.around); e = k }
    })
    if (e >= 0) break
  }
  const offs = offsets(n, c.i)
  const midis = offs.map(o => lad[Math.min(lad.length - 1, Math.max(0, e + o))])
  return placeLine(midis, { maxF: cfg.maxF ?? 9, minF: cfg.minF ?? 0 }).map(p => (p ? `${p.s}${p.f}` : "."))
}

function toneLine(c: Ctx, n: number, around: number): string[] {
  const { info } = c
  const tones = [info.third ?? info.root, info.fifth, info.seventh ?? info.root, info.root]
  const lad = ladder([...new Set(tones)], around - 14, around + 14)
  let s = 0
  let bestD = Infinity
  lad.forEach((m, k) => {
    if (mod(m) === (info.third ?? info.root) && Math.abs(m - around) < bestD) { bestD = Math.abs(m - around); s = k }
  })
  const seq = c.i % 2 === 0 ? [0, 1, 2, 1, 0, 1, 2, 1] : [2, 1, 0, 1, 2, 1, 0, 1]
  const midis = Array.from({ length: n }, (_, k) => lad[Math.min(lad.length - 1, s + seq[k % seq.length])])
  return placeLine(midis, { maxF: 9 }).map(p => (p ? `${p.s}${p.f}` : "."))
}

function guideTone(c: Ctx): string {
  const { info } = c
  const cands = [info.third, info.seventh].filter((x): x is number => x !== null)
  if (!cands.length) cands.push(info.root)
  const prev = c.state.guide ?? 64
  let bestM = 64
  let bestD = Infinity
  for (const pc of cands) for (let m = 55; m <= 72; m++) {
    if (mod(m) === pc && Math.abs(m - prev) < bestD) { bestD = Math.abs(m - prev); bestM = m }
  }
  c.state.guide = bestM
  const p = fretFor(bestM, OPEN_GTR, { maxF: 12 })
  return p ? `${p.s}${p.f}` : "."
}

function altBass(info: ChordInfo, v: Voicing): VNote[] {
  const ns = vnotes(v)
  const low = ns[0]
  for (let s = low.s + 1; s <= 6; s++) {
    const f = mod(info.fifth - OPEN_GTR[s - 1])
    if (f <= 4) return [{ s, f }]
  }
  let best: VNote | null = null
  for (let s = low.s - 1; s >= Math.max(3, low.s - 2); s--) {
    const f = mod(info.fifth - OPEN_GTR[s - 1])
    if (f <= 5 && (!best || f < best.f)) best = { s, f }
  }
  return [best ?? ns.find(n => n !== low && pcAt(n.s, n.f) === info.fifth) ?? low]
}

function dyadFor(info: ChordInfo, pcs: [number, number], pairs: [number, number][], minF: number, maxF: number): VNote[] | null {
  let best: VNote[] | null = null as VNote[] | null
  let bestCost = Infinity
  for (const pr of pairs) {
    for (const o of [pcs, [pcs[1], pcs[0]]]) {
      const r = placeSet(OPEN_GTR, [pr[0], pr[1]], o, minF, maxF, 3)
      if (r && r.cost < bestCost) { bestCost = r.cost; best = [{ s: pr[0], f: r.frets[0] }, { s: pr[1], f: r.frets[1] }] }
    }
  }
  return best
}

function chordDyad(info: ChordInfo, k: number, minF: number, maxF: number): VNote[] | null {
  const t = info.third ?? info.fifth
  const sets: [number, number][] = [[info.root, t], [t, info.fifth], [info.fifth, info.root]]
  return dyadFor(info, sets[k % 3], [[2, 1], [3, 2]], minF, maxF)
}

function powerCell(info: ChordInfo): VNote[] {
  const v = powerVoicing(info)
  return vnotes(v)
}

function dyadShift(ns: VNote[] | null, by: number): string {
  if (!ns) return "."
  return ns.map(n => `${n.s}${n.f - by}/${n.f}`).join(",")
}

// ─── Guitar tokens ────────────────────────────────────────────────────────────

function guitarCell(t: string, c: Ctx, seq: { m: string[]; q: string[]; mi: number; qi: number }): string {
  const info = c.info
  const shape = c.shape
  const v = voicingFor(shape.sym)
  const ns = vnotes(v)
  const pick = (a: VNote[] | null) => (a && a.length ? cellOf(a) : ".")
  switch (t) {
    case ".": return "."
    case "S": return cellOf(ns)
    case "R": case "r0": return cellOf([ns[0]])
    case "F": return cellOf(altBass(shape, v))
    case "T": return cellOf(ns.slice(-3))
    case "U": return cellOf(ns.slice(-4))
    case "K": return cellOf([ns[ns.length - 1]])
    case "X": return MUTE_ALL
    case "P": return cellOf(powerCell(shape))
    case "D": return pick(dyadFor(info, [info.third ?? info.root, info.seventh ?? info.fifth], [[3, 2], [2, 1]], 1, 12))
    case "H": return pick(placeAny([3, 2, 1], [info.root, info.third ?? info.fifth, info.third === null ? info.root : info.fifth], 3, 14))
    case "SH6": case "SH5": {
      const rs = t === "SH6" ? 6 : 5
      const pcs = [info.bass, info.seventh ?? info.fifth, info.third ?? info.root]
      const r = placeSet(OPEN_GTR, [rs, rs - 2, rs - 3], pcs, 0, 12, 4)
      return r ? [rs, rs - 2, rs - 3].map((s, i) => `${s}${r.frets[i]}`).join(",") : "."
    }
    case "W5": case "W6": {
      const rs = (() => {
        let bs = 6
        let bf = 99
        for (const s of [6, 5, 4]) { const f = mod(info.root - OPEN_GTR[s - 1]); if (f < bf) { bf = f; bs = s } }
        return { s: bs, f: bf }
      })()
      const m0 = OPEN_GTR[rs.s - 1] + rs.f
      const iv = t === "W5" ? mod(info.fifth - info.root) : info.minor ? 10 : 9
      const f2 = m0 + iv - OPEN_GTR[rs.s - 2]
      return `${rs.s}${rs.f},${rs.s - 1}${f2}`
    }
    case "m": return seq.m[seq.mi++] ?? "."
    case "q": return seq.q[seq.qi++] ?? "."
    case "N": return guideTone(c)
    case "L": return dyadShift(chordDyad(info, 0, 3, 10), 2)
    case "E0": case "E1": case "E2": return pick(chordDyad(info, Number(t[1]), 0, 9))
    case "J0": case "J1": case "J2": return pick(chordDyad(info, Number(t[1]), 4, 12))
    case "t1": return cellOf([ns[ns.length - 1]])
    case "t2": return cellOf([ns[Math.max(0, ns.length - 2)]])
    case "r1": case "r2": case "r3": return cellOf([ns[Math.max(0, ns.length - 4 + Number(t[1]))]])
    default: {
      const pm = /^p(\d)$/.exec(t)
      if (pm) return cellOf([ns[Math.min(ns.length - 1, Number(pm[1]))]])
      const rf = /^rf(\d)$/.exec(t)
      if (rf) {
        const iv = (info.minor ? [0, 3, 5, 7, 10] : [0, 4, 7, 9, 10])[Number(rf[1])]
        const base = 40 + mod(info.root - 4)
        const p = fretFor(base + iv, OPEN_GTR, { maxF: 9, low: true })
        return p ? `${p.s}${p.f}` : "."
      }
      throw new Error("unknown guitar token " + t)
    }
  }
}

// ─── Bass ─────────────────────────────────────────────────────────────────────

const bassRoot = (pc: number) => 28 + mod(pc - 4)

function bassCell(t: string, c: Ctx): string {
  const { info, next } = c
  const rootM = bassRoot(info.bass)
  const up = (pc: number) => {
    let m = rootM + mod(pc - info.bass)
    if (m > 47) m -= 12
    return m
  }
  const place = (m: number) => {
    const p = fretFor(m, OPEN_BASS, { maxF: 5 })
    return p ? `${p.s}${p.f}` : "."
  }
  switch (t) {
    case ".": return "."
    case "R": return place(rootM)
    case "O": return place(rootM + 12)
    case "F": return place(up(info.fifth))
    case "T": return place(up(info.third ?? info.fifth))
    case "S": return place(up(info.minor ? mod(info.root + 10) : mod(info.root + 9)))
    case "V": return place(up(info.seventh ?? info.fifth))
    case "g": {
      const p = fretFor(rootM, OPEN_BASS, { maxF: 5 })
      return p ? `${p.s}x` : "."
    }
    case "A": {
      let nm = bassRoot(next.bass)
      if (Math.abs(nm + 12 - rootM) < Math.abs(nm - rootM) && nm + 12 <= 47) nm += 12
      let ap = rootM > nm + 2 ? nm + 1 : nm - 1
      if (ap < 28) ap = nm + 1
      return place(ap)
    }
    default: throw new Error("unknown bass token " + t)
  }
}

// ─── Piano ────────────────────────────────────────────────────────────────────

function stackUp(pcs: number[]): number[] {
  let best: number[] = []
  let bestD = Infinity
  for (let k = 0; k < pcs.length; k++) {
    const rot = [...pcs.slice(k), ...pcs.slice(0, k)]
    const ms: number[] = [57 + mod(rot[0] - 57)]
    for (let j = 1; j < rot.length; j++) {
      let m = ms[j - 1] + 1
      while (mod(m) !== rot[j]) m++
      ms.push(m)
    }
    const avg = ms.reduce((a, b) => a + b, 0) / ms.length
    const score = Math.abs(avg - 66) + (ms.length > 3 && ms[1] - ms[0] <= 2 ? 4 : 0)
    if (score < bestD) { bestD = score; best = ms }
  }
  return best.map(mod)
}

function rhTones(info: ChordInfo, genre: string): number[] {
  const third = info.third ?? info.fifth
  const out: number[] = []
  if (genre === "jazz") {
    const dimish = mod(info.fifth - info.root) === 6
    if (info.seventh !== null) {
      out.push(third, info.fifth, info.seventh)
      if (!dimish) out.push(mod(info.root + 2))
    } else {
      out.push(third, info.fifth, info.root)
    }
  } else if (genre === "funk" && info.seventh !== null) {
    out.push(third, info.fifth, info.seventh, ...info.exts.slice(0, 1))
  } else {
    out.push(info.root, third, info.fifth)
    if (info.seventh !== null) out.push(info.seventh)
    out.push(...info.exts)
  }
  const uniq = [...new Set(out)]
  return uniq.slice(0, genre === "folk" ? 4 : 5)
}

function lhTones(info: ChordInfo, genre: string): number[] {
  const r = info.bass
  if (genre === "blues") {
    const f = mod(info.fifth - info.root)
    const iv = info.minor ? [0, f, 10, 0, 10, f, 10, f] : [0, f, 9, 10, 0, 10, 9, f]
    return iv.map(x => mod(info.root + x))
  }
  if (genre === "country") return [r, info.fifth]
  return [r]
}

function pianoSpec(chords: string[], infos: ChordInfo[], genre: string, flats: boolean, caption: string, grid: string): TabSpec {
  const names = (pcs: number[], sym: string) => {
    const rootName = /^[A-G]([#b])?/.exec(sym)
    const useFlats = rootName?.[1] === "b" ? true : rootName?.[1] === "#" ? false : flats
    return pcs.map(p => noteName(p, useFlats))
  }
  const seen = new Set<string>()
  const notes: string[] = []
  infos.forEach(info => {
    if (seen.has(info.sym)) return
    seen.add(info.sym)
    let rh = stackUp(rhTones(info, genre))
    if (genre === "folk") {
      const seq = rh.length >= 4 ? [0, 1, 2, 3, 2, 1, 2] : [0, 1, 2, 1, 0, 1, 2]
      rh = seq.map(k => rh[Math.min(k, rh.length - 1)])
    }
    notes.push(`${info.sym}: RH ${names(rh, info.sym).join(" ")}, LH ${names(lhTones(info, genre), info.sym).join(" ")}`)
  })
  return { kind: "piano", chords, bars: chords.map(() => grid), caption, notes }
}

const PIANO: Record<string, { grid: string; cap: string }> = {
  general: { grid: "1x,2x . . .", cap: "Hold the chord for the whole bar. Root in the left hand." },
  funk: { grid: "2x . 1x . . . 1x . . . 1x . . . 1x .", cap: "Short stabs on every &. Left hand only on beat 1 (skip it if you have a bass)." },
  alternative: { grid: "1x,2x . . .", cap: "Whole-note pads. Simple and quiet." },
  jazz: { grid: "2x,1x . . 1x . . . .", cap: "Rootless voicings (3rd, 5th, 7th, 9th) in the right hand, Charleston rhythm. Skip the left hand if there is a bass." },
  blues: { grid: "2x 2x 2x,1x 2x 2x 2x 2x,1x 2x", cap: "Boogie: the left hand plays the 8-note pattern, the right hand stabs the chord on beats 2 and 4." },
  country: { grid: "2x 1x 2x 1x", cap: "Honky-tonk: left hand root on 1 and fifth on 3, right hand chord on 2 and 4." },
  pop: { grid: "1x,2x . 1x,2x .", cap: "Block chords on beats 1 and 3." },
  folk: { grid: "2x 1x 1x 1x 1x 1x 1x 1x", cap: "A soft broken chord: left hand on beat 1, then 7 right-hand notes. Keep it quiet." },
  reggae: { grid: "2x 1x 2x 1x 2x 1x 2x 1x", cap: "Left hand on the beat, right hand chop on every &." },
  gospel: { grid: "2x 1x . 1x", cap: "Left hand plays the bass note on beat 1. Right hand plays the chord on 2 and 4. Lead the band." },
  rock: { grid: "2x,1x 1x 2x,1x 1x 2x,1x 1x 2x,1x 1x", cap: "Right hand plays the chord in steady 8ths. Left hand plays the root on every beat." },
}

// ─── Parts ────────────────────────────────────────────────────────────────────

type PatFn = string | ((i: number, n: number) => string)
type GSlot = "solo" | "g1" | "g2" | "g3"

interface GPart { pat: PatFn; cap: string; line?: LineCfg; chordLine?: number; capo?: boolean }

const S8 = "S S S S S S S S"
const P8 = "P P P P P P P P"

const GUITAR: Record<string, Record<GSlot, GPart>> = {
  general: {
    solo: { pat: "R . T . R . T .", cap: "Boom-chick: bass note on 1 and 3, top strings on 2 and 4." },
    g1: { pat: "S S S S", cap: "Down strum on every beat. Keep it steady." },
    g2: { pat: "T . T . T . T .", capo: true, cap: "Play on the beat and let them ring." },
    g3: { pat: ". . . . m m m m", line: { pool: "diatonic", around: 69 }, cap: "Short fills in the gaps, using the key's scale. Each bar ends on a chord tone." },
  },
  funk: {
    solo: { pat: "S X X X X X S X X X X X X S X X", cap: "Scratch 16ths. Stab the chord on 1, the & of 2 and the e of 4." },
    g1: { pat: "X X S X X X S X X X S X X X S X", cap: "Keep the strumming hand moving in 16ths. Stab the chord on every &." },
    g2: { pat: ". . . D . . . . . . . D . . . D", cap: "Two-note stabs (3rd and 7th) on the top strings, on the a of 1, 3 and 4. Stay out of Guitar 1's way." },
    g3: { pat: ". . . . . . . . m . m m m . m .", line: { pool: "funk", around: 69 }, cap: "Horn-style answer in the second half of the bar, from the chord's minor pentatonic with the major 3rd." },
  },
  alternative: {
    solo: { pat: "S . . S . S . .", cap: "Let every chord ring. Sparse in the verse, add strums in the chorus." },
    g1: { pat: S8, cap: "Steady 8ths. Keep it low in the verse and open up in the chorus." },
    g2: { pat: "p0 p1 p2 p3 p4 p3 p2 p1", cap: "Picked arpeggio with delay and reverb. Let each note ring into the next." },
    g3: { pat: "K . . . . . . .", cap: "One long top note per bar. Let it ring and swell." },
  },
  jazz: {
    solo: { pat: "SH6 SH6 SH6 SH6", cap: "Shell voicings (root, 7th, 3rd) with the root on the low E string. Short chops on every beat, swing feel." },
    g1: { pat: "SH5 . . SH5 . . . .", cap: "Shell voicings with the root on the A string. Charleston rhythm: beat 1 and the & of 2." },
    g2: { pat: "q q q q", cap: "Melody line outlining each chord's tones, one note per beat. Swing it." },
    g3: { pat: "N . . .", cap: "Guide tones: the 3rd or 7th of each chord, moving by the smallest step. Only when Guitar 1 lays out." },
  },
  blues: {
    solo: {
      pat: (i) => (i % 4 === 3 ? "W5 W6 W5 W6 m m m m" : "W5 W6 W5 W6 W5 W6 W5 W6"),
      line: { pool: "blues", around: 69 },
      cap: "Shuffle (root and fifth, root and sixth) with a short lick in the second half of every fourth bar. Swing the 8ths.",
    },
    g1: { pat: "W5 W6 W5 W6 W5 W6 W5 W6", cap: "Shuffle: root and fifth, then root and sixth, all the way through. Swing the 8ths." },
    g2: {
      pat: (i) => (i % 4 === 3 ? ". . . . . . . ." : ". . m m m m m m"),
      line: { pool: "blues", around: 69 },
      cap: "Call and response in the minor pentatonic with the blue note. Rest every fourth bar and let the shuffle answer.",
    },
    g3: { pat: ". T . T . T . T", cap: "Three-note stabs on the off-beats." },
  },
  country: {
    solo: { pat: "R . T . F . T .", cap: "Boom-chick: bass note on 1, chord on 2, alternate bass note on 3, chord on 4." },
    g1: { pat: "R . T T F . T T", cap: "Alternating bass note, then a down-up chick." },
    g2: { pat: (i) => (i % 2 === 0 ? ". . . . E0 E1 E2 E0" : ". . . . E1 . E0 ."), cap: "Double-stop fills (two chord tones at a time) on the top strings, in the second half of each bar." },
    g3: { pat: ". . . . L . . .", cap: "Pedal-steel move: slide up into the chord tones on beat 3." },
  },
  pop: {
    solo: { pat: "S . S . S . S .", cap: "Verse: palm-muted quarter notes. Switch to open 8ths for the chorus." },
    g1: { pat: S8, cap: "Steady 8ths on open chords. Palm-mute in the verse." },
    g2: { pat: "T . . T . . T .", capo: true, cap: "A syncopated pattern: let the notes ring." },
    g3: { pat: "m . m . m . m .", line: { pool: "diatonic", around: 69, maxF: 9 }, cap: "A repeating hook on the high strings that follows each chord. Each bar ends on a chord tone." },
  },
  folk: {
    solo: { pat: "R t1 F t2 R t1 F t2", cap: "Travis picking: the thumb alternates the bass strings, the fingers pick the top strings." },
    g1: { pat: "S . S S . S S S", cap: "Down, down-up, up, down-up." },
    g2: { pat: "r0 r1 r2 r3 r2 r1 r2 r3", cap: "Rolling fingerpicking arpeggio: bass note, then up the top three strings and back." },
    g3: { pat: "E0 . E1 . E2 . . .", cap: "Two-note harmony on the top strings, under or over the melody. All chord tones." },
  },
  reggae: {
    solo: { pat: "R U . U . U . U", cap: "Low bass note on 1, then short chops on every &." },
    g1: { pat: ". U . U . U . U", cap: "The skank: short, dry chops on every &, top four strings." },
    g2: { pat: ". . H H . . H H . . H H . . H H", cap: "Double skank: two quick chops (the & and the a) on high triads." },
    g3: { pat: ". . . . m . m .", line: { pool: "diatonic", around: 67 }, cap: "Sparse licks with delay. Lots of space." },
  },
  gospel: {
    solo: { pat: "S . S .", cap: "Strum on 1 and 3. Let the bass note of each chord lead the line." },
    g1: { pat: "S . S S", cap: "Strum on beats 1, 3 and 4. Drive into the next chord." },
    g2: { pat: "p0 p1 p2 p3 H . . .", cap: "Sweep the strings up, then hold a high triad and let it swell." },
    g3: { pat: "J0 . . .", cap: "A third or sixth up high, moving with each chord." },
  },
  rock: {
    solo: {
      pat: (i, n) => (i === n - 1 ? "P P P P m m m m" : P8),
      line: { pool: "pent", around: 64 },
      cap: "Palm-muted power chord 8ths. In the last bar, fill with a pentatonic run.",
    },
    g1: { pat: "P . P . P . P P", cap: "Chorus feel: let the power chords ring with a driving down-strum pattern." },
    g2: { pat: "rf0 . rf1 . rf2 . rf3 rf4", cap: "The riff: a pentatonic shape on the low strings, moved with the root of each chord." },
    g3: { pat: "S . . . S . . .", cap: "Full chords on 1 and 3, against Guitar 1's power chords." },
  },
}

const BASS: Record<string, { pat: PatFn; cap: string }> = {
  general: { pat: "R F R F", cap: "Root on 1 and 3, fifth on 2 and 4." },
  funk: { pat: "R . . g . . O . . . R . . F A .", cap: "Root on 1, ghost note, octave on the & of 2, then walk up into the next beat." },
  alternative: { pat: "R R R R R R R R", cap: "Steady root 8ths." },
  jazz: { pat: (i) => (i % 2 === 0 ? "R T F A" : "R F T A"), cap: "Walking quarter notes. Root on 1, chord tones, then a step into the next root." },
  blues: { pat: "R T F S", cap: "Walk the root, 3rd, 5th and 6th of each chord." },
  country: { pat: "R . F .", cap: "Root on 1, fifth on 3." },
  pop: { pat: "R R R R R R R R", cap: "Steady root 8ths." },
  folk: { pat: (i, n) => (i === n - 1 ? "R . F A" : "R . R ."), cap: "Root on 1 and 3. In the last bar, walk the fifth and a passing note up into the next chord." },
  reggae: { pat: ". . R . R . F A", cap: "Rest on 1, play the root on 2 and 3, then a short run into the next chord. Let the notes sustain." },
  gospel: { pat: "R . R A", cap: "Root on 1 and 3, then a passing note on beat 4 that leads into the next chord." },
  rock: { pat: (i, n) => (i === n - 1 ? "R R R R R R F A" : "R R R R R R R R"), cap: "Steady root 8ths. In the last bar, climb into the next section." },
}

// ─── Capo ─────────────────────────────────────────────────────────────────────

interface CapoPlan { capo: number; shapes: string[] }

function planCapo(chords: string[]): CapoPlan | null {
  const opts = capoOptions(chords, 7).filter(o => o.capo >= 2 && o.shapes.every(s => chordInfo(s)))
  const best = opts[0]
  if (!best || best.easyCount < Math.ceil(chords.length * 0.6)) return null
  return { capo: best.capo, shapes: best.shapes }
}

const uniq = (a: string[]) => [...new Set(a)]
const list = (a: string[]) => (a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1])

// ─── Build ────────────────────────────────────────────────────────────────────

function expand(pat: PatFn, i: number, n: number): string[] {
  return (typeof pat === "function" ? pat(i, n) : pat).trim().split(/\s+/)
}

function buildGuitar(genre: string, slot: GSlot, chords: string[], infos: ChordInfo[], key: KeyRef, flats: boolean): TabSpec {
  const part = GUITAR[genre][slot]
  const n = chords.length
  const plan = part.capo ? planCapo(chords) : null
  const state: Record<string, number> = {}
  const bars = chords.map((_, i) => {
    const info = infos[i]
    const shape = plan ? (chordInfo(plan.shapes[i]) ?? info) : info
    const ctx: Ctx = { info, shape, next: infos[(i + 1) % n], i, n, key, flats, state }
    const toks = expand(part.pat, i, n)
    const mCount = toks.filter(t => t === "m").length
    const qCount = toks.filter(t => t === "q").length
    const seq = {
      m: mCount ? scaleLine(ctx, mCount, part.line ?? { pool: "diatonic", around: 69 }) : [],
      q: qCount ? toneLine(ctx, qCount, 57) : [],
      mi: 0,
      qi: 0,
    }
    return toks.map(t => guitarCell(t, ctx, seq)).join(" ")
  })
  let caption = part.cap
  if (part.capo) {
    caption = plan
      ? `Capo ${plan.capo}. Play ${list(uniq(plan.shapes))} shapes on the top three strings; they sound ${list(uniq(chords))}. ${part.cap}`
      : `Top three strings only. ${part.cap}`
  }
  return { kind: "guitar", chords, bars, caption, capo: plan?.capo }
}

function buildBass(genre: string, chords: string[], infos: ChordInfo[], key: KeyRef, flats: boolean): TabSpec {
  const part = BASS[genre]
  const n = chords.length
  const state: Record<string, number> = {}
  const bars = chords.map((_, i) => {
    const info = infos[i]
    const ctx: Ctx = { info, shape: info, next: infos[(i + 1) % n], i, n, key, flats, state }
    return expand(part.pat, i, n).map(t => bassCell(t, ctx)).join(" ")
  })
  return { kind: "bass", chords, bars, caption: part.cap }
}

// ─── Harmonica ────────────────────────────────────────────────────────────────

// Richter-tuned diatonic harp, holes 1-10, MIDI relative to a C harp. No bends.
const HARP_BLOW = [60, 64, 67, 72, 76, 79, 84, 88, 91, 96]
const HARP_DRAW = [62, 67, 71, 74, 77, 81, 83, 86, 89, 93]

interface HarpNote { hole: number; row: 1 | 2; midi: number; pc: number }

function harpNotes(harpKey: number): HarpNote[] {
  const out: HarpNote[] = []
  for (let h = 1; h <= 10; h++) {
    out.push({ hole: h, row: 1, midi: HARP_BLOW[h - 1] + harpKey, pc: mod(HARP_BLOW[h - 1] + harpKey) })
    out.push({ hole: h, row: 2, midi: HARP_DRAW[h - 1] + harpKey, pc: mod(HARP_DRAW[h - 1] + harpKey) })
  }
  return out
}

// "N" one held chord tone, "C" chord chop (2-3 holes together), "L" a line note, "." rest.
interface HPart { pat: string; cap: string; pool: "scale" | "pent" | "blues" }

const HARP: Record<string, HPart> = {
  general: { pat: "N . . . . . L L", pool: "scale", cap: "Hold one chord tone, then a two-note fill at the end of the bar. Leave the gaps for the singer." },
  funk: { pat: ". C . C . C . C", pool: "pent", cap: "Short chops on every &, like the guitar stabs. Keep it dry and tight." },
  alternative: { pat: "N . . . . . . .", pool: "scale", cap: "One long, soft note per chord. Let it ring." },
  jazz: { pat: "L L L . L L L .", pool: "scale", cap: "A short run of scale notes that lands on a chord tone. Rest in the gaps." },
  blues: { pat: "C . . C . . L L", pool: "blues", cap: "Chop the chord on beat 1 and the & of 2, then answer with a two-note lick." },
  country: { pat: "C . C . C . C .", pool: "scale", cap: "Train-style chops on every beat. Short and bouncy." },
  pop: { pat: ". . . . N . . .", pool: "scale", cap: "One held note on beat 3. Stay quiet in the verse." },
  folk: { pat: "N . . . L L L .", pool: "scale", cap: "A held note, then a small run that lands on a chord tone." },
  reggae: { pat: ". . C . . . C .", pool: "pent", cap: "Chop on beats 2 and 4. Lots of space." },
  gospel: { pat: "C . . . . . L L", pool: "scale", cap: "Swell a full chord on beat 1, then a two-note lead-in to the next bar." },
  rock: { pat: "C C C C C C C C", pool: "pent", cap: "Steady 8th-note chops. Play louder in the chorus." },
}

function buildHarp(genre: string, chords: string[], infos: ChordInfo[], key: KeyRef, flats: boolean): TabSpec {
  const part = HARP[genre] ?? HARP.general
  const harpKey = key.minor ? mod(key.root - 2) : mod(key.root + 5)
  const all = harpNotes(harpKey)
  const comfy = all.filter(n => n.hole >= 2 && n.hole <= 7)
  const scale = key.minor ? [0, 2, 3, 5, 7, 8, 10] : MAJOR_STEPS
  const intervals = part.pool === "scale" ? scale : part.pool === "blues" ? (key.minor ? [0, 2, 3, 5, 7, 10] : [0, 2, 4, 7, 9, 10]) : key.minor ? [0, 3, 5, 7, 10] : [0, 2, 4, 7, 9]
  const poolPcs = new Set(intervals.map(x => mod(key.root + x)))

  const lineFor = (extra: Set<number>) => {
    const m = new Map<number, HarpNote>()
    for (const n of comfy) if (poolPcs.has(n.pc) || extra.has(n.pc)) {
      const prev = m.get(n.midi)
      if (!prev || n.row === 2) m.set(n.midi, n)
    }
    return [...m.values()].sort((x, y) => x.midi - y.midi)
  }

  const state = { midi: 67 + harpKey }
  const missing = new Set<string>()

  const bars = chords.map((sym, i) => {
    const info = infos[i]
    const tones = new Set(info.tones)
    const held = comfy.filter(n => tones.has(n.pc)).sort((a, b) => a.midi - b.midi)
    const runs: { row: 1 | 2; from: number; to: number; score: number; pcs: number }[] = []
    for (const row of [1, 2] as const) {
      for (let a = 1; a <= 6; a++) {
        for (const len of [3, 2]) {
          const b = a + len - 1
          const ns = all.filter(n => n.row === row && n.hole >= a && n.hole <= b)
          if (ns.length !== len || !ns.every(n => tones.has(n.pc))) continue
          const pcs = new Set(ns.map(n => n.pc))
          const hasRoot = pcs.has(info.root) ? 1.5 : 0
          const hasThird = info.third !== null && pcs.has(info.third) ? 1 : 0
          runs.push({ row, from: a, to: b, pcs: pcs.size, score: pcs.size * 3 + hasRoot + hasThird - Math.abs(a - 3) * 0.3 - (row === 1 ? 0 : 0.1) })
        }
      }
    }
    runs.sort((x, y) => y.score - x.score)
    const run = runs[0]
    const chordCell = run ? `${run.row}${run.from}-${run.to}` : null
    const heldNote = held.length ? held.reduce((best, n) => (Math.abs(n.hole - 4) < Math.abs(best.hole - 4) ? n : best)) : null
    const heldCell = heldNote ? `${heldNote.row}${heldNote.hole}` : null

    const toks = part.pat.split(/\s+/)
    const line = lineFor(tones)
    const lSlots = toks.reduce<number[]>((acc, t, k) => (t === "L" ? [...acc, k] : acc), [])
    const lineCells = new Map<number, string>()
    if (lSlots.length) {
      let endIdx = -1
      let best = Infinity
      line.forEach((n, k) => {
        if (!tones.has(n.pc)) return
        const d = Math.abs(n.midi - state.midi)
        if (d < best) { best = d; endIdx = k }
      })
      if (endIdx >= 0) {
        const dir = i % 2 === 0 ? 1 : -1
        const m = lSlots.length
        lSlots.forEach((slot, j) => {
          const off = m - 1 - j
          let idx = endIdx + dir * off
          if (idx < 0 || idx >= line.length) idx = endIdx - dir * off
          idx = Math.max(0, Math.min(line.length - 1, idx))
          const n = line[idx]
          lineCells.set(slot, `${n.row}${n.hole}`)
        })
        state.midi = line[endIdx].midi
      }
    }

    let any = false
    const cols = toks.map((t, k) => {
      let cell: string | null = null
      if (t === "C") cell = chordCell ?? heldCell
      else if (t === "N") cell = heldCell
      else if (t === "L") cell = lineCells.get(k) ?? null
      if (cell) any = true
      return cell ?? "."
    })
    if (!any) missing.add(sym)
    return cols.join(" ")
  })

  const harpName = noteName(harpKey, flats)
  const position = key.minor ? "3rd position" : "2nd position (cross harp)"
  const caption = `Bring a ${harpName} harmonica and play in ${position}. ${part.cap}`
  const notes: string[] = []
  if (missing.size) notes.push(`Rest on ${[...missing].join(", ")}: a ${harpName} harp has no chord tones for it without bending.`)
  return { kind: "harp", chords, bars, caption, notes: notes.length ? notes : undefined }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export interface TabInput {
  chords: string[]
  key?: KeyRef
}

export interface Progression {
  key: string
  keyRef: KeyRef
  roman: string
  chords: string[]
}

const DEFAULTS: Record<string, Progression> = {
  general: { key: "G", keyRef: { root: 7, minor: false }, roman: "I  IV  V  I", chords: ["G", "C", "D", "G"] },
  funk: { key: "E", keyRef: { root: 4, minor: false }, roman: "I9  I9  IV9  I9", chords: ["E9", "E9", "A9", "E9"] },
  alternative: { key: "C", keyRef: { root: 0, minor: false }, roman: "I  V  vi  IV", chords: ["Cadd9", "G", "Am", "Fadd9"] },
  jazz: { key: "C", keyRef: { root: 0, minor: false }, roman: "Imaj7  vi7  ii7  V7", chords: ["Cmaj7", "Am7", "Dm7", "G7"] },
  blues: {
    key: "A", keyRef: { root: 9, minor: false }, roman: "12-bar blues",
    chords: ["A7", "A7", "A7", "A7", "D7", "D7", "A7", "A7", "E7", "D7", "A7", "E7"],
  },
  country: { key: "G", keyRef: { root: 7, minor: false }, roman: "I  IV  I  V", chords: ["G", "C", "G", "D"] },
  pop: { key: "C", keyRef: { root: 0, minor: false }, roman: "I  V  vi  IV", chords: ["C", "G", "Am", "F"] },
  folk: { key: "C", keyRef: { root: 0, minor: false }, roman: "I  vi  IV  V", chords: ["C", "Am", "F", "G"] },
  reggae: { key: "G", keyRef: { root: 7, minor: false }, roman: "I  V  vi  IV", chords: ["G", "D", "Em", "C"] },
  gospel: { key: "G", keyRef: { root: 7, minor: false }, roman: "I  I/3  IV  IV/5", chords: ["G", "G/B", "C", "C/D"] },
  rock: { key: "A", keyRef: { root: 9, minor: false }, roman: "I  bVII  IV  I", chords: ["A", "G", "D", "A"] },
}

export const MAX_CHORDS = 16

export function getProgression(genre: string): Progression {
  return DEFAULTS[genre] ?? DEFAULTS.general
}

const tabCache = new Map<string, TabSpec>()

export function getTab(genre: string, slot: Slot, input?: TabInput): TabSpec | undefined {
  const g = GUITAR[genre] ? genre : "general"
  const def = DEFAULTS[g]
  let chords = (input?.chords ?? []).filter(c => chordInfo(c)).slice(0, MAX_CHORDS)
  let key = input?.key
  if (chords.length === 0) { chords = def.chords; key = def.keyRef }
  if (!key) key = guessKeys(chords)[0]?.key ?? def.keyRef
  const id = `${g}|${slot}|${chords.join(",")}|${key.root}${key.minor ? "m" : ""}`
  const hit = tabCache.get(id)
  if (hit) return hit
  const infos = chords.map(c => chordInfo(c) as ChordInfo)
  const flats = prefersFlats(key)
  let spec: TabSpec
  if (slot === "bass") spec = buildBass(g, chords, infos, key, flats)
  else if (slot === "harp") spec = buildHarp(g, chords, infos, key, flats)
  else if (slot === "piano") spec = pianoSpec(chords, infos, g, flats, PIANO[g].cap, PIANO[g].grid)
  else spec = buildGuitar(g, slot, chords, infos, key, flats)
  tabCache.set(id, spec)
  return spec
}
