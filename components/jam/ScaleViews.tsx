"use client"

import { DEGREE, nameOf, type FretNote, type HarpCell } from "@/lib/jam/scales"

const W = 340
const PANEL = "#05070d"
const ROOT = "#fbbf24"
const TONE = "#a78bfa"
const INK = "#0b1020"
const LINE = "rgba(255,255,255,0.3)"
const MUTED = "rgba(255,255,255,0.55)"
const FAINT = "rgba(255,255,255,0.22)"
const MARKS = new Set([3, 5, 7, 9, 12, 15])

const label = (pc: number, root: number, flats: boolean, degrees: boolean) =>
  degrees ? DEGREE[(((pc - root) % 12) + 12) % 12] : nameOf(pc, flats)

export function Fretboard({
  names, notes, lo, hi, root, flats, degrees, summary,
}: { names: string[]; notes: FretNote[]; lo: number; hi: number; root: number; flats: boolean; degrees: boolean; summary: string }) {
  const strings = names.length
  const left = 24
  const right = 8
  const cols = hi - lo + 1
  const cw = (W - left - right) / cols
  const gap = strings > 4 ? 22 : 28
  const top = 14
  const H = top + (strings - 1) * gap + 14 + 20
  const r = Math.min(11, cw / 2 - 2)
  const x0 = left
  const yOf = (s: number) => top + (s - 1) * gap
  const fontSize = r < 10 ? 9 : 11
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label={summary} style={{ display: "block", background: PANEL, borderRadius: 12 }}>
      {names.map((n, i) => (
        <text key={i} x={10} y={yOf(i + 1) + 4} fontSize={11} fontWeight={700} fill={MUTED} textAnchor="middle">{n}</text>
      ))}
      {Array.from({ length: cols + 1 }, (_, i) => {
        const nut = lo === 0 && i === 1
        if (lo === 0 && i === 0) return null
        return <line key={i} x1={x0 + i * cw} x2={x0 + i * cw} y1={yOf(1) - 6} y2={yOf(strings) + 6} stroke={nut ? "rgba(255,255,255,0.85)" : LINE} strokeWidth={nut ? 4 : 1} />
      })}
      {names.map((_, i) => (
        <line key={i} x1={x0} x2={W - right} y1={yOf(i + 1)} y2={yOf(i + 1)} stroke={LINE} strokeWidth={strings > 4 ? 0.8 + (i * 0.35) : 1.2 + i * 0.5} />
      ))}
      {Array.from({ length: cols }, (_, i) => {
        const f = lo + i
        return (
          <text key={i} x={x0 + i * cw + cw / 2} y={H - 6} fontSize={10} textAnchor="middle" fill={MARKS.has(f) ? "#fde68a" : MUTED} fontWeight={MARKS.has(f) ? 700 : 400}>
            {f === 0 ? "open" : f}
          </text>
        )
      })}
      {notes.filter(n => n.fret >= lo && n.fret <= hi).map(n => {
        const cx = x0 + (n.fret - lo) * cw + cw / 2
        const cy = yOf(n.string)
        return (
          <g key={`${n.string}.${n.fret}`}>
            <circle cx={cx} cy={cy} r={r} fill={n.root ? ROOT : TONE} />
            <text x={cx} y={cy + fontSize / 3} fontSize={fontSize} fontWeight={800} textAnchor="middle" fill={INK}>
              {label(n.pc, root, flats, degrees)}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

const WHITE_PCS = [0, 2, 4, 5, 7, 9, 11]
const BLACK_AFTER: [number, number][] = [[0, 1], [1, 3], [3, 6], [4, 8], [5, 10]]

export function Keyboard({
  pcs, root, flats, degrees, summary,
}: { pcs: number[]; root: number; flats: boolean; degrees: boolean; summary: string }) {
  const octaves = 2
  const whites = 7 * octaves
  const ww = W / whites
  const H = 120
  const bh = 72
  const bw = ww * 0.62
  const inScale = new Set(pcs)
  const rows: React.ReactNode[] = []
  for (let w = 0; w < whites; w++) {
    const pc = WHITE_PCS[w % 7]
    const on = inScale.has(pc)
    rows.push(
      <g key={`w${w}`}>
        <rect x={w * ww + 0.5} y={4} width={ww - 1} height={H - 8} rx={3} fill={on ? (pc === root ? ROOT : TONE) : "#e5e7eb"} />
        {on && <text x={w * ww + ww / 2} y={H - 14} fontSize={10} fontWeight={800} textAnchor="middle" fill={INK}>{label(pc, root, flats, degrees)}</text>}
      </g>
    )
  }
  for (let o = 0; o < octaves; o++) {
    for (const [wi, pc] of BLACK_AFTER) {
      const x = (o * 7 + wi + 1) * ww - bw / 2
      const on = inScale.has(pc)
      rows.push(
        <g key={`b${o}.${pc}`}>
          <rect x={x} y={4} width={bw} height={bh} rx={3} fill={on ? (pc === root ? ROOT : TONE) : "#111827"} stroke={on ? "none" : "#000"} />
          {on && <text x={x + bw / 2} y={bh - 6} fontSize={8.5} fontWeight={800} textAnchor="middle" fill={INK}>{label(pc, root, flats, degrees)}</text>}
        </g>
      )
    }
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label={summary} style={{ display: "block", background: PANEL, borderRadius: 12 }}>
      {rows}
    </svg>
  )
}

const HARP_ROW: Record<string, number> = { b2: 0, b1: 1, blow: 2, draw: 3, d1: 4, d2: 5, d3: 6 }

function rowOf(c: HarpCell): number {
  if (c.bend === 0) return c.draw ? HARP_ROW.draw : HARP_ROW.blow
  return c.draw ? HARP_ROW.draw + c.bend : HARP_ROW.blow - c.bend
}

export function HarpGrid({
  cells, root, flats, degrees, summary,
}: { cells: HarpCell[]; root: number; flats: boolean; degrees: boolean; summary: string }) {
  const left = 34
  const right = 4
  const cw = (W - left - right) / 10
  const rowH = 26
  const top = 22
  const H = top + 7 * rowH + 4
  const r = 10.5
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label={summary} style={{ display: "block", background: PANEL, borderRadius: 12 }}>
      {Array.from({ length: 10 }, (_, i) => (
        <text key={i} x={left + i * cw + cw / 2} y={13} fontSize={11} fontWeight={700} textAnchor="middle" fill={MUTED}>{i + 1}</text>
      ))}
      <text x={4} y={top + 2 * rowH + rowH / 2 + 4} fontSize={10} fontWeight={700} fill="#86efac">Blow</text>
      <text x={4} y={top + 3 * rowH + rowH / 2 + 4} fontSize={10} fontWeight={700} fill="#93c5fd">Draw</text>
      <line x1={left} x2={W - right} y1={top + 3 * rowH} y2={top + 3 * rowH} stroke={LINE} strokeWidth={1} />
      {cells.map(c => {
        const row = rowOf(c)
        const cx = left + (c.hole - 1) * cw + cw / 2
        const cy = top + row * rowH + rowH / 2
        const bent = c.bend > 0
        if (!c.inScale) {
          if (bent) return <circle key={c.tok + c.draw} cx={cx} cy={cy} r={2.5} fill={FAINT} />
          return (
            <g key={c.tok + c.draw}>
              <circle cx={cx} cy={cy} r={r} fill="none" stroke={FAINT} strokeWidth={1} />
              <text x={cx} y={cy + 3.5} fontSize={9} textAnchor="middle" fill={FAINT}>{label(c.pc, root, flats, false)}</text>
            </g>
          )
        }
        return (
          <g key={c.tok + c.draw}>
            <circle cx={cx} cy={cy} r={r} fill={c.root ? ROOT : TONE} stroke={bent ? "#fff" : "none"} strokeWidth={bent ? 1.5 : 0} strokeDasharray={bent ? "3 2" : undefined} />
            <text x={cx} y={cy + 3.5} fontSize={10} fontWeight={800} textAnchor="middle" fill={INK}>{label(c.pc, root, flats, degrees)}</text>
          </g>
        )
      })}
    </svg>
  )
}
