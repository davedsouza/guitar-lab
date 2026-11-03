"use client"

import { COUNTS, LABELS, parseBars, renderTab, type TabSpec } from "@/lib/jam/tabs"

const W = 340
const PANEL = "#05070d"
const GREEN = "#86efac"
const AMBER = "#fde68a"
const DRAW = "#93c5fd"
const MUTED = "rgba(255,255,255,0.5)"
const LINE = "rgba(255,255,255,0.28)"
const BAR = "rgba(255,255,255,0.6)"
const PAD = 6
const FONT = 13

interface Chunk { bar: number; from: number; to: number }

export default function TabImage({ spec }: { spec: TabSpec }) {
  const bars = parseBars(spec)
  const labels = LABELS[spec.kind]
  const piano = spec.kind === "piano"
  const rows = labels.length
  const harp = spec.kind === "harp"
  const gap = piano || harp ? 26 : 17
  const gutter = harp ? 38 : piano ? 30 : 20
  let tokenMax = 1
  for (const bar of bars) for (const cell of bar) for (const t of cell.values()) tokenMax = Math.max(tokenMax, t.length)
  const colW = tokenMax <= 2 ? 18 : 8 * tokenMax + 4
  const room = W - gutter - 2

  const chunks: Chunk[] = []
  bars.forEach((bar, i) => {
    let parts = 1
    while (parts < bar.length && (bar.length / parts) * colW + PAD * 2 > room) parts *= 2
    const size = Math.ceil(bar.length / parts)
    for (let a = 0; a < bar.length; a += size) chunks.push({ bar: i, from: a, to: Math.min(bar.length, a + size) })
  })
  const widthOf = (c: Chunk) => {
    const label = c.from === 0 ? (spec.chords[c.bar] ?? "") : ""
    return Math.max((c.to - c.from) * colW + PAD * 2, label.length * 9 + PAD)
  }

  const systems: Chunk[][] = []
  let cur: Chunk[] = []
  let used = 0
  for (const c of chunks) {
    const wd = widthOf(c)
    if (cur.length && used + wd > room) { systems.push(cur); cur = []; used = 0 }
    cur.push(c)
    used += wd
  }
  if (cur.length) systems.push(cur)

  let y = 0
  const out: React.ReactNode[] = []
  systems.forEach((sys, si) => {
    const hasCounts = sys.some(c => COUNTS[bars[c.bar].length])
    const top = y
    const chordY = top + 12
    const countY = top + 25
    const first = top + (hasCounts ? 38 : 24)
    const sysW = sys.reduce((n, c) => n + widthOf(c), 0)
    const lastY = first + (rows - 1) * gap
    const g: React.ReactNode[] = []
    labels.forEach((l, r) => {
      const ly = first + r * gap
      g.push(<text key={`l${r}`} x={gutter - 5} y={ly + 4} textAnchor="end" fontSize={11} fill={MUTED} fontFamily="ui-monospace, monospace" fontWeight={600}>{l}</text>)
      g.push(<line key={`s${r}`} x1={gutter} x2={gutter + sysW} y1={ly} y2={ly} stroke={LINE} strokeWidth={1} />)
    })
    let x = gutter
    g.push(<line key="b0" x1={x} x2={x} y1={first} y2={lastY} stroke={BAR} strokeWidth={1.5} />)
    sys.forEach((c, ci) => {
      const wd = widthOf(c)
      const label = c.from === 0 ? spec.chords[c.bar] : ""
      if (label) g.push(<text key={`c${ci}`} x={x + 3} y={chordY} fontSize={13} fontWeight={800} fill={AMBER} fontFamily="ui-sans-serif, system-ui, sans-serif">{label}</text>)
      const counts = COUNTS[bars[c.bar].length]
      for (let k = c.from; k < c.to; k++) {
        const cx = x + PAD + (k - c.from) * colW + colW / 2
        if (counts) g.push(<text key={`n${ci}-${k}`} x={cx} y={countY} textAnchor="middle" fontSize={10} fill={MUTED} fontFamily="ui-monospace, monospace">{counts[k]}</text>)
        bars[c.bar][k].forEach((tok, str) => {
          const r = str - 1
          if (r < 0 || r >= rows) return
          const ny = first + r * gap
          if (piano) {
            g.push(<circle key={`p${ci}-${k}-${r}`} cx={cx} cy={ny} r={6} fill={GREEN} />)
            return
          }
          const mute = tok === "x"
          const txt = mute ? "×" : tok
          const bw = Math.max(12, txt.length * 8 + 4)
          g.push(<rect key={`r${ci}-${k}-${r}`} x={cx - bw / 2} y={ny - 8} width={bw} height={16} rx={4} fill={PANEL} />)
          g.push(<text key={`t${ci}-${k}-${r}`} x={cx} y={ny + 4.5} textAnchor="middle" fontSize={FONT} fontWeight={700} fill={mute ? "#fca5a5" : harp && r === 1 ? DRAW : GREEN} fontFamily="ui-monospace, monospace">{txt}</text>)
        })
      }
      x += wd
      g.push(<line key={`e${ci}`} x1={x} x2={x} y1={first} y2={lastY} stroke={BAR} strokeWidth={1.5} />)
    })
    out.push(<g key={si}>{g}</g>)
    y = lastY + 22
  })
  const H = Math.max(0, y - 8)

  return (
    <div className="rounded-xl bg-[#05070d] p-2">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label={`${spec.caption}. Chords ${spec.chords.join(", ")}`} style={{ display: "block" }}>
        {out}
      </svg>
      <pre className="sr-only" aria-label="Tab">{renderTab(spec)}</pre>
    </div>
  )
}
