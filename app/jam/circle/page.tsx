"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ChordTap } from "@/components/jam/ChordSheet"
import { Chip, Panel } from "@/components/jam/ui"
import {
  MAJOR_PROGRESSIONS, MINOR_PROGRESSIONS, accidentals, chordsFor, circleLabel, keyAt, posOfKey, roleAt, signature,
  type Role,
} from "@/lib/jam/circle"
import { keyLabel, noteName, prefersFlats, type KeyRef } from "@/lib/jam/theory"

const C = 170
const OUT = 166
const MID_OUT = 112
const MID_IN = 108
const IN = 62

const FILL: Record<Role, { fill: string; text: string }> = {
  tonic: { fill: "#fbbf24", text: "#0b1020" },
  sub: { fill: "#b45309", text: "#ffffff" },
  dom: { fill: "#b45309", text: "#ffffff" },
  minor: { fill: "#6d28d9", text: "#ffffff" },
  none: { fill: "#1e293b", text: "#e2e8f0" },
}

const rad = (deg: number) => (deg * Math.PI) / 180
const pt = (r: number, deg: number) => `${(C + r * Math.cos(rad(deg))).toFixed(2)} ${(C + r * Math.sin(rad(deg))).toFixed(2)}`

function sector(r1: number, r2: number, a1: number, a2: number) {
  return `M ${pt(r1, a1)} A ${r1} ${r1} 0 0 1 ${pt(r1, a2)} L ${pt(r2, a2)} A ${r2} ${r2} 0 0 0 ${pt(r2, a1)} Z`
}

const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? "" : "s"}`

function sigText(pos: number): string {
  const s = signature(pos)
  return s.kind === "none" ? "No sharps or flats" : plural(s.count, s.kind === "sharp" ? "sharp" : "flat")
}

function CircleInner() {
  const params = useSearchParams()
  const [sel, setSel] = useState<{ pos: number; minor: boolean }>(() => {
    const k = Number(params.get("key"))
    const minor = params.get("mode") === "minor"
    return params.get("key") !== null && Number.isInteger(k) && k >= 0 && k <= 11 ? { pos: posOfKey({ root: k, minor }), minor } : { pos: 0, minor: false }
  })
  const key: KeyRef = keyAt(sel.pos, sel.minor)
  const flats = prefersFlats(key)
  const chords = chordsFor(key)
  const name = `${noteName(key.root, flats)} ${key.minor ? "minor" : "major"}`
  const rel = keyAt(sel.pos, !sel.minor)
  const progs = key.minor ? MINOR_PROGRESSIONS : MAJOR_PROGRESSIONS
  const acc = accidentals(sel.pos)
  const mode = key.minor ? "minor" : "major"

  const pick = (pos: number, minor: boolean) => setSel({ pos: ((pos % 12) + 12) % 12, minor })

  const segs: React.ReactNode[] = []
  for (const minor of [false, true]) {
    for (let i = 0; i < 12; i++) {
      const mid = -90 + i * 30
      const role = roleAt(i, minor, sel.pos, sel.minor)
      const active = i === sel.pos && minor === sel.minor
      const f = FILL[role]
      const rIn = minor ? IN : MID_OUT
      const rOut = minor ? MID_IN : OUT
      const label = circleLabel(i, minor)
      const k = keyAt(i, minor)
      const sg = signature(i)
      const aria = `${noteName(k.root, prefersFlats(k))} ${minor ? "minor" : "major"}, ${sg.kind === "none" ? "no sharps or flats" : plural(sg.count, sg.kind)}`
      const rMid = (rIn + rOut) / 2
      const tx = Number((C + rMid * Math.cos(rad(mid))).toFixed(1))
      const ty = Number((C + rMid * Math.sin(rad(mid))).toFixed(1))
      const fs = minor ? 11 : 15
      segs.push(
        <g
          key={`${minor}${i}`}
          role="button"
          tabIndex={0}
          aria-label={aria}
          aria-pressed={active}
          onClick={() => pick(i, minor)}
          onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(i, minor) } }}
          className="cursor-pointer outline-none focus-visible:[&>path]:stroke-white focus-visible:[&>path]:stroke-[3]"
        >
          <path d={sector(rOut, rIn, mid - 15, mid + 15)} fill={f.fill} stroke={active ? "#ffffff" : "#05070d"} strokeWidth={active ? 3 : 1.5} />
          <text x={tx} y={ty} textAnchor="middle" fontSize={fs} fontWeight={800} fill={f.text} pointerEvents="none">
            {label.length === 1
              ? <tspan dy={fs / 3}>{label[0]}</tspan>
              : label.map((l, n) => <tspan key={n} x={tx} dy={n === 0 ? -1 : fs - 1}>{l}</tspan>)}
          </text>
        </g>
      )
    }
  }

  return (
    <div className="space-y-4">
      <Panel>
        <svg viewBox="0 0 340 340" width="100%" role="group" aria-label="Circle of fifths. Outer ring major keys, inner ring relative minor keys." style={{ display: "block", maxWidth: 420, margin: "0 auto" }}>
          {segs}
          <text x={C} y={C - 8} textAnchor="middle" fontSize={22} fontWeight={900} fill="#fbbf24">{noteName(key.root, flats)}{key.minor ? "m" : ""}</text>
          <text x={C} y={C + 12} textAnchor="middle" fontSize={11} fontWeight={600} fill="#e2e8f0">{sigText(sel.pos)}</text>
        </svg>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-purple-200">
          <span className="flex items-center gap-1.5"><i className="inline-block h-3 w-3 rounded-sm bg-amber-400" />Home ({key.minor ? "i" : "I"})</span>
          <span className="flex items-center gap-1.5"><i className="inline-block h-3 w-3 rounded-sm" style={{ background: "#b45309" }} />Next door ({key.minor ? "iv, v" : "IV, V"})</span>
          <span className="flex items-center gap-1.5"><i className="inline-block h-3 w-3 rounded-sm" style={{ background: "#6d28d9" }} />Their relative {key.minor ? "majors" : "minors"}</span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          <Chip onClick={() => pick(sel.pos - 1, sel.minor)} className="px-2 text-sm">‹ {chords[3].triad}</Chip>
          <Chip onClick={() => pick(sel.pos, !sel.minor)} className="px-2 text-sm">{keyLabel(rel)}</Chip>
          <Chip onClick={() => pick(sel.pos + 1, sel.minor)} className="px-2 text-sm">{chords[4].triad} ›</Chip>
        </div>
        <p className="mt-2 text-center text-xs text-purple-300">Tap any key, or step around with the buttons. The middle one flips to the relative {key.minor ? "major" : "minor"}.</p>
      </Panel>

      <Panel>
        <p className="text-3xl font-black leading-tight text-amber-300">{name}</p>
        <p className="mt-1 text-sm text-purple-100">
          {sigText(sel.pos)}{acc.length ? `: ${acc.join(" ")}` : ""}. Same notes as {noteName(rel.root, prefersFlats(rel))} {key.minor ? "major" : "minor"}.
        </p>
        <div className="mt-3 flex flex-wrap gap-2" aria-label="Notes in the key">
          {chords.map((c, i) => (
            <div key={c.degree} className={`flex min-w-11 flex-col items-center rounded-xl px-2 py-1.5 ${i === 0 ? "bg-amber-400 text-slate-950" : "bg-white/10 text-white"}`}>
              <span className="text-lg font-black leading-tight">{noteName(c.root, flats)}</span>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Chords in this key">
        <div className="grid grid-cols-4 gap-2">
          {chords.map((c, i) => {
            const main = [0, 3, 4].includes(i)
            return (
              <ChordTap
                key={c.degree}
                chord={c.triad}
                className={`min-h-14 flex-col rounded-xl px-1 py-2 ${main ? "bg-amber-400/20 ring-1 ring-amber-400/60" : "bg-white/10"}`}
              >
                <span className="text-lg font-bold text-white">{c.triad}</span>
                <span className="text-xs font-semibold text-amber-300">{c.roman}</span>
              </ChordTap>
            )
          })}
        </div>
        <p className="mt-2 text-xs text-purple-300">Tap a chord to see how to play it. Outlined chords are the three most used.</p>
      </Panel>

      <Panel title="Common progressions in this key">
        <ul className="space-y-3">
          {progs.map(p => {
            const list = p.romans.map(r => chords.find(c => c.roman === r)).filter((c): c is NonNullable<typeof c> => !!c)
            return (
              <li key={p.name} className="rounded-xl bg-slate-950/60 p-3">
                <p className="text-sm font-bold text-white">{p.name}</p>
                <p className="mb-2 text-xs text-purple-300">{p.where}</p>
                <div className="flex flex-wrap gap-2">
                  {list.map((c, i) => (
                    <ChordTap key={i} chord={c.triad} className="min-h-12 rounded-xl bg-white/10 px-3 text-base font-bold text-white">{c.triad}</ChordTap>
                  ))}
                </div>
              </li>
            )
          })}
        </ul>
      </Panel>

      <Panel title="Go further">
        <div className="grid gap-2">
          <Link href={`/jam/scales?key=${key.root}&mode=${mode}`} className="flex min-h-12 items-center justify-between rounded-xl border border-white/20 bg-white/10 px-4 text-base font-semibold text-white active:bg-white/20">
            <span>Scales for {keyLabel(key)}</span><span aria-hidden>→</span>
          </Link>
          <Link href="/jam/transpose" className="flex min-h-12 items-center justify-between rounded-xl border border-white/20 bg-white/10 px-4 text-base font-semibold text-white active:bg-white/20">
            <span>Transpose and capo</span><span aria-hidden>→</span>
          </Link>
          <Link href="/jam/nashville" className="flex min-h-12 items-center justify-between rounded-xl border border-white/20 bg-white/10 px-4 text-base font-semibold text-white active:bg-white/20">
            <span>Nashville numbers</span><span aria-hidden>→</span>
          </Link>
        </div>
      </Panel>

      <Panel title="How to read the circle">
        <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-purple-100">
          <li>Each step clockwise goes up a fifth and adds one sharp. Each step counter-clockwise goes up a fourth and adds one flat.</li>
          <li>A key and the two keys beside it share almost every note. That is why I, IV and V sound good together.</li>
          <li>The inner ring holds each key&apos;s relative minor. It has the same notes with a different home.</li>
          <li>Changing key? Move to a neighbor. One step around the circle changes only one note.</li>
          <li>Straight across from a key (six steps) is the most distant sound.</li>
        </ul>
      </Panel>
    </div>
  )
}

export default function CirclePage() {
  return (
    <Suspense fallback={null}>
      <CircleInner />
    </Suspense>
  )
}
