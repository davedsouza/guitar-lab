import type { ReactNode } from "react"

// Draws hand-written ASCII tab (e|---3---|) as the same dark SVG panel the Jam tabs use.
// Anything that is not a plain tab block falls back to the original monospace <pre>.

const W = 340
const PANEL = "#05070d"
const GREEN = "#86efac"
const AMBER = "#fde68a"
const MUTED = "rgba(255,255,255,0.5)"
const LINE = "rgba(255,255,255,0.28)"
const BAR = "rgba(255,255,255,0.6)"
const GAP = 17
const FONT = 12

const TAB_LINE = /^(\s*)([A-Ga-g][#b]?)\s*\|(.*)$/
const DASHES = /[-─—–:]/g
const CHORD = /^[A-G][#b]?(?:m|maj|min|dim|aug|sus|add|M)?\d*(?:sus\d|add\d+|[#b]\d+)?(?:\/[A-G][#b]?)?$/
const RHYTHM = /^(?:\d+|&|\+|e|a|and|[↓↑vV^]|[DU]|\||x|%|\.+|-+)$/

interface TabSeg {
  kind: "tab"
  raw: string[]
  labels: string[]
  bodies: string[]
  base: number
  above: string[]
  below: string[]
  comments: string[]
  title?: string
}
interface TextSeg { kind: "text"; lines: string[] }
type Seg = TabSeg | TextSeg

const isAnnotation = (line: string) => {
  const t = line.trim().split(/\s+/)
  return t.length > 0 && t[0] !== "" && line.length <= 110 && t.every(w => CHORD.test(w) || RHYTHM.test(w))
}

interface Frag { label: string; body: string; comment: string; base: number }

function splitFrag(label: string, rest: string, base: number, allowComment: boolean): Frag | null {
  let content = rest
  let comment = ""
  const last = content.lastIndexOf("|")
  if (last >= 0) {
    comment = content.slice(last + 1).trim()
    content = content.slice(0, last + 1)
  } else if (allowComment) {
    const gap = /[-─—–]\s{2,}\S/.exec(content)
    if (gap) {
      comment = content.slice(gap.index + 1).trim()
      content = content.slice(0, gap.index + 1)
    }
  } else content = content.trimEnd()
  if (!allowComment) comment = ""
  if ((content.match(/[-─—–~]/g) ?? []).length < 2) return null
  if (/[A-Za-z]{4,}/.test(content.replace(/\([^)]*\)/g, "()"))) return null
  return { label, body: content, comment, base }
}

function splitTabLine(line: string): Frag | null {
  const m = TAB_LINE.exec(line)
  if (!m) return null
  if (/\s[A-Ga-g][#b]?\s*\|/.test(m[3])) return null
  return splitFrag(m[2], m[3], line.indexOf("|") + 1, true)
}

function panelsOf(line: string) {
  const out: { start: number; label: string; pipe: number }[] = []
  for (const m of line.matchAll(/(^|\s)([A-Ga-g][#b]?)\s*\|/g)) {
    const start = m.index + m[1].length
    out.push({ start, label: m[2], pipe: m.index + m[0].length - 1 })
  }
  return out
}

function parse(text: string): Seg[] | null {
  const lines = text.replace(/\r/g, "").split("\n")
  while (lines.length && !lines[0].trim()) lines.shift()
  while (lines.length && !lines[lines.length - 1].trim()) lines.pop()
  const segs: Seg[] = []
  let buf: string[] = []
  const flush = () => {
    if (buf.length) segs.push({ kind: "text", lines: buf })
    buf = []
  }
  let i = 0
  while (i < lines.length) {
    if (!TAB_LINE.test(lines[i])) { buf.push(lines[i]); i++; continue }
    let j = i
    while (j < lines.length && TAB_LINE.test(lines[j])) j++
    const run = lines.slice(i, j)
    const pans = run.map(panelsOf)
    const k = pans[0].length
    if (k > 1 && pans.every(p => p.length === k)) {
      const titleLines: string[] = []
      while (buf.length && titleLines.length < 3 && buf[buf.length - 1].trim()) titleLines.unshift(buf.pop() as string)
      flush()
      const frags: (Frag | null)[][] = []
      for (let c = 0; c < k; c++) {
        frags.push(run.map((line, r) => {
          const pn = pans[r][c]
          const end = c + 1 < k ? pans[r][c + 1].start : line.length
          return splitFrag(pn.label, line.slice(pn.pipe + 1, end), pn.pipe + 1, c === k - 1)
        }))
      }
      if (frags.some(col => col.some(f => f === null))) return null
      for (let c = 0; c < k; c++) {
        const cols = titleLines.map(l => l.trim().split(/\s{2,}/))
        const title = cols.length && cols.every(cc => cc.length === k) ? cols.map(cc => cc[c]).join(" · ") : c === 0 ? titleLines.map(l => l.trim()).join(" · ") : ""
        const part = frags[c] as Frag[]
        segs.push({ kind: "tab", raw: run.map(l => l), labels: part.map(f => f.label), bodies: part.map(f => f.body), base: part[0].base, above: [], below: [], comments: c === k - 1 ? part.map(f => (f.comment ? `${f.label}  ${f.comment}` : "")).filter(Boolean) : [], title })
      }
      i = j
      continue
    }
    const parsed = run.map(splitTabLine)
    if (parsed.some(p => p === null)) {
      buf.push(...run)
      i = j
      continue
    }
    const sz = run.length > 8 ? (run.length % 6 === 0 ? 6 : run.length % 4 === 0 ? 4 : run.length) : run.length
    const above: string[] = []
    while (buf.length && above.length < 2 && buf[buf.length - 1].trim() && isAnnotation(buf[buf.length - 1])) above.unshift(buf.pop() as string)
    flush()
    for (let k = 0; k < run.length; k += sz) {
      const part = parsed.slice(k, k + sz) as Frag[]
      const last = k + sz >= run.length
      const below: string[] = []
      if (last) {
        let b = j
        while (b < lines.length && below.length < 2 && lines[b].trim() && !TAB_LINE.test(lines[b]) && isAnnotation(lines[b])) below.push(lines[b++])
        j = b
      }
      segs.push({
        kind: "tab",
        raw: run.slice(k, k + sz),
        labels: part.map(p => p.label),
        bodies: part.map(p => p.body),
        base: part[0].base,
        above: k === 0 ? above : [],
        below,
        comments: part.map(p => (p.comment ? `${p.label}  ${p.comment}` : "")).filter(Boolean),
      })
    }
    i = j
  }
  flush()
  return segs
}

interface Chunk { a: number; b: number; bar: boolean }

function TabDrawing({ seg }: { seg: TabSeg }) {
  const n = seg.labels.length
  const bodies = seg.bodies.map(b => b.replace(DASHES, "-"))
  const L = Math.max(...bodies.map(b => b.length))
  const grid = bodies.map(b => b.padEnd(L, "-"))

  const barCount = new Map<number, number>()
  bodies.forEach(b => { for (let c = 0; c < b.length; c++) if (b[c] === "|") barCount.set(c, (barCount.get(c) ?? 0) + 1) })
  const lastPipe = Math.max(-1, ...bodies.map(b => (b.endsWith("|") ? b.length - 1 : -1)))
  const bars = [...barCount.entries()].filter(([c, k]) => k >= Math.ceil(n / 2) && c < L).map(([c]) => c).sort((x, y) => x - y)
  if (lastPipe >= 0 && !bars.includes(lastPipe) && lastPipe >= L - 2) bars.push(lastPipe)
  const cuts = bars.length ? bars : []
  const spans: Chunk[] = []
  let a = 0
  for (const c of cuts) {
    if (c > a) spans.push({ a, b: c, bar: true })
    a = c + 1
  }
  if (a < L) spans.push({ a, b: L, bar: false })
  if (!spans.length) spans.push({ a: 0, b: L, bar: false })

  const cleaned = grid.map(g => g.replace(/\|/g, "-"))
  const total = spans.reduce((s, c) => s + c.b - c.a + 1, 0)
  const gutter = 12 + 7 * Math.max(...seg.labels.map(l => l.length))
  const room = W - gutter - 4
  const cw = total * 9 <= room ? 9 : 7.4
  const cap = Math.floor(room / cw)

  const safeSplit = (from: number, to: number) => {
    for (let c = Math.min(to, from + cap - 2); c > from + 4; c--) {
      if (cleaned.every(g => g[c] === "-" && g[c - 1] !== undefined)) return c
    }
    return Math.min(to, from + cap - 2)
  }
  const chunks: Chunk[] = []
  for (const s of spans) {
    let from = s.a
    while (s.b - from + 1 > cap) {
      const cut = safeSplit(from, s.b)
      chunks.push({ a: from, b: cut, bar: false })
      from = cut
    }
    chunks.push({ a: from, b: s.b, bar: s.bar })
  }

  const rows: Chunk[][] = []
  let cur: Chunk[] = []
  let used = 0
  for (const c of chunks) {
    const wd = c.b - c.a + 1
    if (cur.length && used + wd > cap) { rows.push(cur); cur = []; used = 0 }
    cur.push(c)
    used += wd
  }
  if (cur.length) rows.push(cur)

  const words = (line: string) => {
    const out: { text: string; col: number }[] = []
    for (const m of line.matchAll(/\S+/g)) out.push({ text: m[0], col: m.index - seg.base })
    return out
  }
  const owner = (col: number) => {
    for (let r = 0; r < rows.length; r++) for (let k = 0; k < rows[r].length; k++) if (col < rows[r][k].b + 1) return [r, k] as const
    return [rows.length - 1, rows[rows.length - 1].length - 1] as const
  }

  let y = 0
  const out: ReactNode[] = []
  rows.forEach((row, ri) => {
    const g: ReactNode[] = []
    const aboveH = seg.above.length * 14
    const first = y + aboveH + 10
    const lastY = first + (n - 1) * GAP
    const widths = row.map(c => (c.b - c.a + 1) * cw)
    const sysW = widths.reduce((p, q) => p + q, 0)
    seg.labels.forEach((l, r) => {
      const ly = first + r * GAP
      g.push(<text key={`l${r}`} x={gutter - 5} y={ly + 4} textAnchor="end" fontSize={11} fill={MUTED} fontFamily="ui-monospace, monospace" fontWeight={600}>{l}</text>)
      g.push(<line key={`s${r}`} x1={gutter} x2={gutter + sysW} y1={ly} y2={ly} stroke={LINE} strokeWidth={1} />)
    })
    let x = gutter
    g.push(<line key="b0" x1={x} x2={x} y1={first} y2={lastY} stroke={BAR} strokeWidth={1.5} />)
    row.forEach((c, ci) => {
      for (let r = 0; r < n; r++) {
        const line = cleaned[r]
        for (const m of line.slice(c.a, c.b).matchAll(/[^\s-]+/g)) {
          const tm = /^(.*?)(~+)$/.exec(m[0])
          const txt = tm ? tm[1] : m[0]
          const tilde = tm ? tm[2].length : 0
          const ny = first + r * GAP
          if (txt) {
            const cx = x + (m.index + txt.length / 2 + 0.5) * cw
            const w = txt.length * 7.4 + 3
            const mute = /^x+$/i.test(txt)
            g.push(<rect key={`r${ci}-${r}-${m.index}`} x={cx - w / 2} y={ny - 8} width={w} height={16} rx={4} fill={PANEL} />)
            g.push(<text key={`t${ci}-${r}-${m.index}`} x={cx} y={ny + 4.5} textAnchor="middle" fontSize={FONT} fontWeight={700} fill={mute ? "#fca5a5" : GREEN} fontFamily="ui-monospace, monospace">{mute ? "×".repeat(txt.length) : txt}</text>)
          }
          if (tilde) {
            const x0 = x + (m.index + txt.length + 0.5) * cw
            const x1 = x0 + tilde * cw
            let d = `M${x0} ${ny}`
            for (let q = 0, px = x0; px < x1; q++, px += 4) d += ` Q${px + 1} ${ny + (q % 2 ? 3 : -3)} ${Math.min(px + 4, x1)} ${ny}`
            g.push(<path key={`w${ci}-${r}-${m.index}`} d={d} fill="none" stroke={GREEN} strokeWidth={1.4} />)
          }
        }
      }
      x += widths[ci]
      const hasBar = c.bar || ci < row.length - 1 || ri === rows.length - 1
      if (hasBar) g.push(<line key={`e${ci}`} x1={x} x2={x} y1={first} y2={lastY} stroke={BAR} strokeWidth={1.5} />)
    })
    seg.above.forEach((line, li) => {
      words(line).forEach((w, wi) => {
        const [r, k] = owner(Math.max(0, w.col))
        if (r !== ri) return
        let ox = gutter
        for (let q = 0; q < k; q++) ox += widths[q]
        const col = Math.max(0, w.col) - row[k].a
        const rhythm = RHYTHM.test(w.text)
        g.push(<text key={`a${li}-${wi}`} x={ox + Math.max(0, col) * cw + cw * 0.5} y={y + 12 + li * 14} fontSize={rhythm ? 10 : 13} fontWeight={rhythm ? 400 : 800} fill={rhythm ? MUTED : AMBER} fontFamily={rhythm ? "ui-monospace, monospace" : "ui-sans-serif, system-ui, sans-serif"}>{w.text}</text>)
      })
    })
    let below = lastY + 14
    if (ri === rows.length - 1) {
      seg.below.forEach((line, li) => {
        words(line).forEach((w, wi) => {
          const [r, k] = owner(Math.max(0, w.col))
          if (r !== ri) return
          let ox = gutter
          for (let q = 0; q < k; q++) ox += widths[q]
          const col = Math.max(0, w.col) - row[k].a
          g.push(<text key={`d${li}-${wi}`} x={ox + Math.max(0, col) * cw + cw * 0.5} y={below + li * 13} fontSize={10} fill={MUTED} fontFamily="ui-monospace, monospace">{w.text}</text>)
        })
      })
      below += seg.below.length * 13
    }
    out.push(<g key={ri}>{g}</g>)
    y = (ri === rows.length - 1 ? below : lastY + 14) + 8
  })
  const H = Math.max(10, y - 4)
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Guitar tab" style={{ display: "block" }}>
      {out}
    </svg>
  )
}

const PRE = "font-mono text-green-300 bg-black/40 rounded-xl p-4 text-xs overflow-x-auto whitespace-pre leading-relaxed"

export default function AsciiTab({ text, className }: { text: string; className?: string }) {
  const segs = parse(text)
  if (!segs || !segs.some(s => s.kind === "tab")) {
    return <pre className={className ?? PRE}>{text}</pre>
  }
  return (
    <div className="space-y-2 rounded-xl bg-[#05070d] p-2">
      {segs.map((s, i) => {
        if (s.kind === "text") {
          const diagram = s.lines.some(l => /[│┌└├┼┐┘┤]/.test(l))
          return (
            <pre key={i} className={diagram ? "overflow-x-auto whitespace-pre px-1 font-mono text-xs leading-relaxed text-green-300" : "whitespace-pre-wrap break-words px-1 font-mono text-xs leading-relaxed text-white/75"}>
              {s.lines.join("\n")}
            </pre>
          )
        }
        return (
          <div key={i}>
            {s.title && <p className="px-1 pb-0.5 text-xs font-bold text-amber-200">{s.title}</p>}
            <TabDrawing seg={s} />
            {s.comments.length > 0 && (
              <ul className="mt-1 space-y-0.5 px-1 font-mono text-[11px] text-white/55">
                {s.comments.map((c, k) => <li key={k}>{c}</li>)}
              </ul>
            )}
            <pre className="sr-only">{s.raw.join("\n")}</pre>
          </div>
        )
      })}
    </div>
  )
}
