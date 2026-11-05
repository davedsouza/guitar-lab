"use client"

import { nameOf, type FretNote } from "@/lib/jam/scales"
import type { Role, ToneNote } from "@/lib/jam/solo"

const W = 340
const PANEL = "#05070d"
const INK = "#0b1020"
const LINE = "rgba(255,255,255,0.3)"
const MUTED = "rgba(255,255,255,0.55)"
const MARKS = new Set([3, 5, 7, 9, 12, 15])
const NAMES = ["e", "B", "G", "D", "A", "E"]

export const ROLE_FILL: Record<Role, string> = { R: "#fbbf24", "3": "#f9a8d4", "7": "#6ee7b7", "5": "#a78bfa" }
const ROLE_R: Record<Role, number> = { R: 10.5, "3": 11, "7": 11, "5": 8.5 }

export default function SoloBoard({
  notes, faint, lo, hi, flats, numbers, rolesShown, target, approach, summary,
}: {
  notes: ToneNote[]
  faint: FretNote[]
  lo: number
  hi: number
  flats: boolean
  numbers: boolean
  rolesShown: Role[]
  target: ToneNote | null
  approach: FretNote | null
  summary: string
}) {
  const left = 24
  const right = 8
  const cols = hi - lo + 1
  const cw = (W - left - right) / cols
  const gap = 24
  const top = 16
  const H = top + 5 * gap + 14 + 20
  const yOf = (s: number) => top + (s - 1) * gap
  const xOf = (f: number) => left + (f - lo) * cw + cw / 2
  const shown = notes.filter(n => rolesShown.includes(n.role))
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label={summary} style={{ display: "block", background: PANEL, borderRadius: 12 }}>
      {NAMES.map((n, i) => (
        <text key={i} x={10} y={yOf(i + 1) + 4} fontSize={11} fontWeight={700} fill={MUTED} textAnchor="middle">{n}</text>
      ))}
      {Array.from({ length: cols + 1 }, (_, i) => {
        const nut = lo === 0 && i === 1
        if (lo === 0 && i === 0) return null
        return <line key={i} x1={left + i * cw} x2={left + i * cw} y1={yOf(1) - 6} y2={yOf(6) + 6} stroke={nut ? "rgba(255,255,255,0.85)" : LINE} strokeWidth={nut ? 4 : 1} />
      })}
      {NAMES.map((_, i) => (
        <line key={i} x1={left} x2={W - right} y1={yOf(i + 1)} y2={yOf(i + 1)} stroke={LINE} strokeWidth={1.2 + i * 0.5} />
      ))}
      {Array.from({ length: cols }, (_, i) => {
        const f = lo + i
        return (
          <text key={i} x={left + i * cw + cw / 2} y={H - 6} fontSize={10} textAnchor="middle" fill={MARKS.has(f) ? "#fde68a" : MUTED} fontWeight={MARKS.has(f) ? 700 : 400}>
            {f === 0 ? "open" : f}
          </text>
        )
      })}
      {faint.filter(n => n.fret >= lo && n.fret <= hi).map(n => (
        <circle key={`f${n.string}.${n.fret}`} cx={xOf(n.fret)} cy={yOf(n.string)} r={4} fill="rgba(255,255,255,0.28)" />
      ))}
      {approach && approach.fret >= lo && approach.fret <= hi && (
        <g>
          <circle cx={xOf(approach.fret)} cy={yOf(approach.string)} r={9} fill="none" stroke="#fbbf24" strokeWidth={2} />
          <text x={xOf(approach.fret)} y={yOf(approach.string) + 3.5} fontSize={10} fontWeight={800} textAnchor="middle" fill="#fde68a">
            {numbers ? "~" : nameOf(approach.pc, flats)}
          </text>
        </g>
      )}
      {shown.map(n => {
        const cx = xOf(n.fret)
        const cy = yOf(n.string)
        const r = ROLE_R[n.role]
        return (
          <g key={`${n.string}.${n.fret}`}>
            <circle cx={cx} cy={cy} r={r} fill={ROLE_FILL[n.role]} opacity={n.role === "5" ? 0.85 : 1} />
            <text x={cx} y={cy + 3.5} fontSize={10.5} fontWeight={800} textAnchor="middle" fill={INK}>
              {numbers ? n.role : nameOf(n.pc, flats)}
            </text>
          </g>
        )
      })}
      {target && target.fret >= lo && target.fret <= hi && (
        <g>
          <circle cx={xOf(target.fret)} cy={yOf(target.string)} r={ROLE_R[target.role] + 4} fill="none" stroke="#ffffff" strokeWidth={2.5} strokeDasharray="4 3" />
          <circle cx={xOf(target.fret)} cy={yOf(target.string)} r={ROLE_R[target.role]} fill={ROLE_FILL[target.role]} />
          <text x={xOf(target.fret)} y={yOf(target.string) + 3.5} fontSize={10.5} fontWeight={800} textAnchor="middle" fill={INK}>
            {numbers ? target.role : nameOf(target.pc, flats)}
          </text>
        </g>
      )}
    </svg>
  )
}
