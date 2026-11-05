"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import ChordDiagram from "@/components/ChordDiagram"
import { getChordVoicings } from "@/lib/chordShapes"

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "map" | "progressions" | "keysigs" | "relationships" | "modulation" | "songwriting"

// ─── Circle data — clockwise from C (top), each step = perfect 5th up ─────────

const CIRCLE = [
  { major: "C",  minor: "Am",  semitone: 0,  sharps: 0, flats: 0 },
  { major: "G",  minor: "Em",  semitone: 7,  sharps: 1, flats: 0 },
  { major: "D",  minor: "Bm",  semitone: 2,  sharps: 2, flats: 0 },
  { major: "A",  minor: "F♯m", semitone: 9,  sharps: 3, flats: 0 },
  { major: "E",  minor: "C♯m", semitone: 4,  sharps: 4, flats: 0 },
  { major: "B",  minor: "G♯m", semitone: 11, sharps: 5, flats: 0 },
  { major: "F♯", minor: "D♯m", semitone: 6,  sharps: 6, flats: 0 },
  { major: "D♭", minor: "B♭m", semitone: 1,  sharps: 0, flats: 5 },
  { major: "A♭", minor: "Fm",  semitone: 8,  sharps: 0, flats: 4 },
  { major: "E♭", minor: "Cm",  semitone: 3,  sharps: 0, flats: 3 },
  { major: "B♭", minor: "Gm",  semitone: 10, sharps: 0, flats: 2 },
  { major: "F",  minor: "Dm",  semitone: 5,  sharps: 0, flats: 1 },
]

const SHARPS_IN_ORDER = ["F♯", "C♯", "G♯", "D♯", "A♯", "E♯", "B♯"]
const FLATS_IN_ORDER  = ["B♭", "E♭", "A♭", "D♭", "G♭", "C♭", "F♭"]
const SHARP_NAMES     = ["C","C♯","D","D♯","E","F","F♯","G","G♯","A","A♯","B"]
const FLAT_NAMES      = ["C","D♭","D","E♭","E","F","G♭","G","A♭","A","B♭","B"]

const SCALE_INTERVALS     = [0, 2, 4, 5, 7, 9, 11]
const CHORD_SUFFIX        = ["", "m", "m", "", "", "m", "°"]
const ROMAN               = ["I", "ii", "iii", "IV", "V", "vi", "vii°"]
type Fn = "tonic" | "subdominant" | "dominant"
const CHORD_FN: Fn[]      = ["tonic","subdominant","tonic","subdominant","dominant","tonic","dominant"]

const FN_COLORS: Record<Fn, { text: string; bg: string; border: string; dot: string }> = {
  tonic:       { text: "text-emerald-300", bg: "bg-emerald-500/15", border: "border-emerald-500/25", dot: "bg-emerald-400" },
  subdominant: { text: "text-sky-300",     bg: "bg-sky-500/15",     border: "border-sky-500/25",     dot: "bg-sky-400"     },
  dominant:    { text: "text-amber-300",   bg: "bg-amber-500/15",   border: "border-amber-500/25",   dot: "bg-amber-400"   },
}

// ─── Progression data ─────────────────────────────────────────────────────────

// Circle position offset from tonic for each scale degree
const DEGREE_OFFSET: Record<number, number> = { 1:0, 2:2, 3:4, 4:11, 5:1, 6:3, 7:5 }

const PROG_TEMPLATES = [
  {
    name: "I – IV – V",
    degrees: [1, 4, 5],
    description: "The three-chord trick. T → S → D. Covers most of rock, country, and blues.",
    genre: "Rock · Country · Blues",
    songs: "Johnny B. Goode, La Bamba, Wild Thing",
    shape: "Tight triangle — 1 step each side of tonic",
  },
  {
    name: "I – V – vi – IV",
    degrees: [1, 5, 6, 4],
    description: "The four-chord pop loop. Four adjacent positions — arguably the most ubiquitous modern progression.",
    genre: "Pop",
    songs: "Let It Be, Don't Stop Believin', Africa",
    shape: "Four consecutive circle positions",
  },
  {
    name: "ii – V – I",
    degrees: [2, 5, 1],
    description: "The jazz cadence. Three consecutive clockwise steps, each resolving a fifth to the next.",
    genre: "Jazz",
    songs: "Virtually every jazz standard",
    shape: "Three clockwise steps home",
  },
  {
    name: "I – vi – IV – V",
    degrees: [1, 6, 4, 5],
    description: "The 50s doo-wop loop. Tonic → relative minor → subdominant → dominant.",
    genre: "Doo-wop · Oldies · Pop",
    songs: "Stand By Me, Earth Angel, Every Breath You Take",
    shape: "Visits tonic cluster, then S → D",
  },
  {
    name: "I – vi – ii – V",
    degrees: [1, 6, 2, 5],
    description: "Jazz turnaround. T → T-sub → S → D — the most common cadential formula in jazz.",
    genre: "Jazz · Bossa Nova",
    songs: "Autumn Leaves, Take the A Train",
    shape: "Tonic area then S–D resolution",
  },
  {
    name: "Circle progression",
    degrees: [1, 4, 7, 3, 6, 2, 5],
    description: "All 7 diatonic chords descending by fifths. Each chord acts as V of the next — a chain of resolutions.",
    genre: "Jazz · Classical",
    songs: "Autumn Leaves, All the Things You Are, Baroque sequences",
    shape: "Full counter-clockwise spiral through 7 positions",
  },
]

const TABS: { id: Tab; label: string }[] = [
  { id: "map",           label: "Circle Map" },
  { id: "progressions",  label: "Progressions" },
  { id: "keysigs",       label: "Key Signatures" },
  { id: "relationships", label: "Key Relationships" },
  { id: "modulation",    label: "Modulation" },
  { id: "songwriting",   label: "Songwriting" },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const useFlatsForPos = (pos: number) => pos >= 7
const nn = (semi: number, flat: boolean) =>
  (flat ? FLAT_NAMES : SHARP_NAMES)[((semi % 12) + 12) % 12]
// Always use flat names for borrowed/chromatic chords
const nnFlat = (semi: number) => FLAT_NAMES[((semi % 12) + 12) % 12]

function getDiatonicChords(pos: number) {
  const { semitone } = CIRCLE[pos]
  const flat = useFlatsForPos(pos)
  return SCALE_INTERVALS.map((iv, i) => ({
    roman: ROMAN[i],
    name:  nn(semitone + iv, flat) + CHORD_SUFFIX[i],
    fn:    CHORD_FN[i],
  }))
}

function circleDistance(a: number, b: number): number {
  const d = Math.abs(a - b)
  return Math.min(d, 12 - d)
}

function keySigLabel(sharps: number, flats: number): string {
  if (!sharps && !flats) return "No sharps or flats ♮"
  if (sharps) return `${sharps} sharp${sharps > 1 ? "s" : ""}  —  ${SHARPS_IN_ORDER.slice(0, sharps).join("  ")}`
  return `${flats} flat${flats > 1 ? "s" : ""}  —  ${FLATS_IN_ORDER.slice(0, flats).join("  ")}`
}

function scaleNotes(pos: number): string {
  const { semitone } = CIRCLE[pos]
  const flat = useFlatsForPos(pos)
  return SCALE_INTERVALS.map(iv => nn(semitone + iv, flat)).join("  ·  ")
}

function getParallelMinorBorrows(pos: number) {
  const { semitone } = CIRCLE[pos]
  return [
    { degree: "bVII", name: nnFlat(semitone + 10)          },
    { degree: "bVI",  name: nnFlat(semitone + 8)           },
    { degree: "iv",   name: nnFlat(semitone + 5) + "m"     },
    { degree: "bIII", name: nnFlat(semitone + 3)           },
  ]
}

// ─── Chord diagram helpers ────────────────────────────────────────────────────

const FLAT_TO_SHARP: Record<string, string> = {
  "D♭": "C#", "E♭": "D#", "G♭": "F#", "A♭": "G#", "B♭": "A#",
}

function parseChordName(name: string): { root: string; suffix: string } {
  if (name.endsWith("°")) return { root: name.slice(0, -1), suffix: "°" }
  if (name.endsWith("m")) return { root: name.slice(0, -1), suffix: "m" }
  return { root: name, suffix: "" }
}

function toShapeRoot(root: string): string {
  return FLAT_TO_SHARP[root] ?? root.replace("♯", "#")
}

function suffixToQuality(suffix: string): string {
  if (suffix === "m") return "Minor"
  if (suffix === "°") return "Diminished"
  return "Major"
}

function ChordViewer({ chordName, fn }: { chordName: string; fn: Fn }) {
  const { root: rawRoot, suffix } = parseChordName(chordName)
  const root    = toShapeRoot(rawRoot)
  const quality = suffixToQuality(suffix)
  const voicings = getChordVoicings(root, quality)
  const fc = FN_COLORS[fn]

  return (
    <div className={`mt-1.5 rounded-xl border p-4 ${fc.bg} ${fc.border}`}>
      <p className="text-white/40 text-xs mb-3">{chordName} · {quality}</p>
      {voicings && voicings.length > 0 ? (
        <div className="flex gap-5 overflow-x-auto pb-1">
          {voicings.map((v, i) => (
            <div key={i} className="shrink-0 text-center">
              <ChordDiagram chordName={chordName} fingers={v.fingers} size="small" />
              <p className="text-white/30 text-xs mt-1 leading-tight">{v.position}</p>
              <p className={`text-xs font-medium mt-0.5 ${
                v.difficulty === "beginner"       ? "text-emerald-400"
                : v.difficulty === "intermediate" ? "text-amber-400"
                : "text-rose-400"
              }`}>{v.difficulty}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-white/30 text-xs">No voicings available for {chordName}</p>
      )}
    </div>
  )
}

// ─── SVG helpers ──────────────────────────────────────────────────────────────

const CX = 190, CY = 190
// Server and browser trig differ in the last digit; rounding keeps the SVG identical on both
const rd = (n: number) => Math.round(n * 100) / 100

function sectorPath(r1: number, r2: number, startDeg: number, endDeg: number): string {
  const r = (d: number) => (d * Math.PI) / 180
  const p = (radius: number, deg: number) =>
    [rd(CX + radius * Math.cos(r(deg))), rd(CY + radius * Math.sin(r(deg)))]
  const [x1, y1] = p(r1, startDeg), [x2, y2] = p(r2, startDeg)
  const [x3, y3] = p(r2, endDeg),   [x4, y4] = p(r1, endDeg)
  return `M${x1},${y1}L${x2},${y2}A${r2},${r2},0,0,1,${x3},${y3}L${x4},${y4}A${r1},${r1},0,0,0,${x1},${y1}Z`
}

function sectorFill(dist: number, sel: boolean): string {
  if (sel) return "#7c3aed"
  return ["#1e1b4b","#14532d","#0c4a6e","#312e81","#1e1b4b","#1e1b4b","#4c0519"][dist] ?? "#1e1b4b"
}
function sectorStroke(dist: number, sel: boolean): string {
  if (sel) return "#a855f7"
  return ["#3b0764","#16a34a","#0284c7","#4c1d95","#2d2060","#2d2060","#be123c"][dist] ?? "#3b0764"
}

// ─── CoF circle (Map tab) ─────────────────────────────────────────────────────

function CoFCircle({ selected, onSelect }: { selected: number; onSelect: (i: number) => void }) {
  const R_MAJ_OUT = 182, R_MAJ_IN = 138
  const R_MIN_OUT = 132, R_MIN_IN = 90
  const R_MAJ_LBL = 160, R_MIN_LBL = 111

  return (
    <svg viewBox="0 0 380 380" className="w-full max-w-sm mx-auto">
      <text x="8"   y={CY - 8}  fill="#6d28d9" fontSize="8" fontStyle="italic">← flats / fourths</text>
      <text x="372" y={CY - 8}  fill="#6d28d9" fontSize="8" fontStyle="italic" textAnchor="end">sharps / fifths →</text>

      <circle cx={CX} cy={CY} r={84} fill="#12062b" stroke="#4c1d95" strokeWidth="1.5" />
      <text x={CX} y={CY - 12} textAnchor="middle" fill="white" fontSize="24" fontWeight="bold">
        {CIRCLE[selected].major}
      </text>
      <text x={CX} y={CY + 8}  textAnchor="middle" fill="#a78bfa" fontSize="11">major</text>
      <text x={CX} y={CY + 26} textAnchor="middle" fill="#6d28d9" fontSize="10">{CIRCLE[selected].minor}</text>

      {CIRCLE.map((key, i) => {
        const dist = circleDistance(selected, i)
        const sel  = i === selected
        const ang  = i * 30 - 90
        const fill   = sectorFill(dist, sel)
        const stroke = sectorStroke(dist, sel)
        const r = (d: number) => (d * Math.PI) / 180
        const lxM = rd(CX + R_MAJ_LBL * Math.cos(r(ang)))
        const lyM = rd(CY + R_MAJ_LBL * Math.sin(r(ang)))
        const lxm = rd(CX + R_MIN_LBL * Math.cos(r(ang)))
        const lym = rd(CY + R_MIN_LBL * Math.sin(r(ang)))

        return (
          <g key={i} onClick={() => onSelect(i)} style={{ cursor: "pointer" }}>
            <path d={sectorPath(R_MAJ_IN, R_MAJ_OUT, ang - 14.5, ang + 14.5)}
              fill={fill} stroke={stroke} strokeWidth={sel ? "2" : "1.5"} />
            <text x={lxM} y={lyM + 5} textAnchor="middle" pointerEvents="none"
              fill={sel ? "white" : dist <= 2 ? "#e2e8f0" : "#64748b"}
              fontSize={sel ? "14" : "12"} fontWeight={sel ? "bold" : "normal"}>
              {key.major}
            </text>
            <path d={sectorPath(R_MIN_IN, R_MIN_OUT, ang - 14.5, ang + 14.5)}
              fill={`${fill}bb`} stroke={stroke} strokeWidth="1" />
            <text x={lxm} y={lym + 4} textAnchor="middle" pointerEvents="none"
              fill={sel ? "#c4b5fd" : dist <= 2 ? "#94a3b8" : "#334155"}
              fontSize="9">
              {key.minor}
            </text>
          </g>
        )
      })}
      <text x={CX} y={CY + 47} textAnchor="middle" fill="#4c1d95" fontSize="8" fontStyle="italic">
        rel. minor
      </text>
    </svg>
  )
}

// ─── Progression circle (Progressions tab) ────────────────────────────────────

function ProgCircle({ keyPos, degrees }: { keyPos: number; degrees: number[] }) {
  const posUsed   = degrees.map(d => (keyPos + DEGREE_OFFSET[d]) % 12)
  const uniquePos = new Set(posUsed)
  const R_OUT = 182, R_IN = 138, R_LBL = 160, ARROW_R = 115

  return (
    <svg viewBox="0 0 380 380" className="w-full max-w-xs mx-auto">
      <defs>
        <marker id="pa" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
          <polygon points="0 0, 6 2.5, 0 5" fill="#7c3aed" opacity="0.9" />
        </marker>
      </defs>

      {CIRCLE.map((key, i) => {
        const isUsed   = uniquePos.has(i)
        const ang      = i * 30 - 90
        const rad      = (ang * Math.PI) / 180
        const stepNums = posUsed.flatMap((p, si) => p === i ? [si + 1] : []).join("/")

        return (
          <g key={i}>
            <path
              d={sectorPath(R_IN, R_OUT, ang - 14.5, ang + 14.5)}
              fill={isUsed ? "#312e81" : "#070514"}
              stroke={isUsed ? "#6d28d9" : "#130d2a"}
              strokeWidth={isUsed ? "2" : "1"}
            />
            <text x={rd(CX + R_LBL * Math.cos(rad))} y={rd(CY + R_LBL * Math.sin(rad) + 5)}
              textAnchor="middle" pointerEvents="none"
              fill={isUsed ? "white" : "#2d2550"}
              fontSize={isUsed ? "13" : "10"} fontWeight={isUsed ? "bold" : "normal"}>
              {key.major}
            </text>
            {isUsed && (
              <text x={rd(CX + 120 * Math.cos(rad))} y={rd(CY + 120 * Math.sin(rad) + 4)}
                textAnchor="middle" pointerEvents="none"
                fill="#c4b5fd" fontSize="9" fontWeight="bold">
                {stepNums}
              </text>
            )}
          </g>
        )
      })}

      {/* Arrows between consecutive steps */}
      {degrees.map((_, si) => {
        if (si >= degrees.length - 1) return null
        const fp = posUsed[si], tp = posUsed[si + 1]
        if (fp === tp) return null
        const fa = ((fp * 30 - 90) * Math.PI) / 180
        const ta = ((tp * 30 - 90) * Math.PI) / 180
        const x1 = rd(CX + ARROW_R * Math.cos(fa)), y1 = rd(CY + ARROW_R * Math.sin(fa))
        const x2 = rd(CX + ARROW_R * Math.cos(ta)), y2 = rd(CY + ARROW_R * Math.sin(ta))
        const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1
        const ox = dx / len * 8, oy = dy / len * 8
        return (
          <line key={si}
            x1={x1 + ox} y1={y1 + oy} x2={x2 - ox} y2={y2 - oy}
            stroke="#7c3aed" strokeWidth="2" opacity="0.8" markerEnd="url(#pa)" />
        )
      })}

      {/* Dark center covers line crossings */}
      <circle cx={CX} cy={CY} r={R_IN - 4} fill="#070514" stroke="#160e30" strokeWidth="1" />
      <text x={CX} y={CY - 6}  textAnchor="middle" fill="#6d28d9" fontSize="10" fontStyle="italic">
        {CIRCLE[keyPos].major} major
      </text>
      <text x={CX} y={CY + 10} textAnchor="middle" fill="#3b0764" fontSize="9">
        {degrees.length} chords
      </text>
    </svg>
  )
}

// ─── Distance legend ──────────────────────────────────────────────────────────

function DistanceLegend() {
  const items = [
    { label: "Selected",        color: "bg-purple-600" },
    { label: "Adjacent (±1)",   color: "bg-green-800"  },
    { label: "Nearby (±2)",     color: "bg-sky-900"    },
    { label: "Moderate (±3)",   color: "bg-indigo-950" },
    { label: "Tritone (6 away)", color: "bg-rose-950"  },
  ]
  return (
    <div className="flex flex-wrap gap-3 mt-3">
      {items.map(it => (
        <div key={it.label} className="flex items-center gap-1.5">
          <span className={`w-3 h-3 rounded-sm ${it.color} border border-white/20`} />
          <span className="text-white/40 text-xs">{it.label}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Info panel ───────────────────────────────────────────────────────────────

function InfoPanel({ selected }: { selected: number }) {
  const [activeChord, setActiveChord] = useState<string | null>(null)
  useEffect(() => { setActiveChord(null) }, [selected])

  const key             = CIRCLE[selected]
  const chords          = getDiatonicChords(selected)
  const prevPos         = (selected + 11) % 12
  const nextPos         = (selected + 1)  % 12
  const parallelMinPos  = (selected + 9)  % 12   // relative major of parallel minor
  const borrows         = getParallelMinorBorrows(selected)

  return (
    <div className="space-y-4">
      {/* Key header */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-white text-2xl font-bold">{key.major} major</span>
          <span className="text-purple-400 text-sm">/ {key.minor}</span>
        </div>
        <p className="text-white/50 text-xs mb-2">{keySigLabel(key.sharps, key.flats)}</p>
        <p className="text-purple-200/70 text-xs font-mono">{scaleNotes(selected)}</p>

        {/* Parallel minor */}
        <div className="mt-3 pt-3 border-t border-white/10">
          <p className="text-white/30 text-xs uppercase tracking-widest mb-1.5">Parallel minor</p>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-rose-300 font-semibold text-sm">{key.major} minor</span>
            <span className="text-white/25 text-xs">
              {keySigLabel(CIRCLE[parallelMinPos].sharps, CIRCLE[parallelMinPos].flats).split("—")[0].trim()}
            </span>
          </div>
          <p className="text-white/30 text-xs mb-1.5">Common borrowed chords:</p>
          <div className="flex flex-wrap gap-1.5">
            {borrows.map(b => (
              <span key={b.degree}
                className="text-xs px-2 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/20 text-rose-300 font-mono">
                {b.degree} = {b.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Neighbors */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-green-900/20 border border-green-700/30 rounded-xl p-3">
          <p className="text-white/40 text-xs mb-1">← subdominant (IV)</p>
          <p className="text-green-300 font-bold">{CIRCLE[prevPos].major}</p>
          <p className="text-white/30 text-xs">{keySigLabel(CIRCLE[prevPos].sharps, CIRCLE[prevPos].flats).split("—")[0].trim()}</p>
        </div>
        <div className="bg-sky-900/20 border border-sky-700/30 rounded-xl p-3">
          <p className="text-white/40 text-xs mb-1">dominant (V) →</p>
          <p className="text-sky-300 font-bold">{CIRCLE[nextPos].major}</p>
          <p className="text-white/30 text-xs">{keySigLabel(CIRCLE[nextPos].sharps, CIRCLE[nextPos].flats).split("—")[0].trim()}</p>
        </div>
      </div>

      {/* Diatonic chords */}
      <div>
        <p className="text-white/40 text-xs uppercase tracking-widest mb-2">
          Diatonic chords <span className="normal-case font-normal opacity-60">— tap any chord to see shapes</span>
        </p>
        <div className="space-y-1">
          {chords.map(ch => {
            const fc       = FN_COLORS[ch.fn]
            const isActive = activeChord === ch.name
            return (
              <div key={ch.roman}>
                <button
                  onClick={() => setActiveChord(isActive ? null : ch.name)}
                  className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 border transition-all text-left ${
                    isActive
                      ? `${fc.bg} ${fc.border} ring-1 ring-purple-400/30`
                      : `${fc.bg} ${fc.border} hover:brightness-125`
                  }`}>
                  <span className="text-white/40 text-xs font-mono w-8 shrink-0">{ch.roman}</span>
                  <span className={`font-bold text-sm w-16 ${fc.text}`}>{ch.name}</span>
                  <span className={`text-xs capitalize ${fc.text} opacity-60 flex-1`}>{ch.fn}</span>
                  <span className="text-white/20 text-xs">{isActive ? "▲" : "▼"}</span>
                </button>
                {isActive && <ChordViewer chordName={ch.name} fn={ch.fn} />}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

function Callout({ type, children }: {
  type: "tip" | "insight" | "exercise"
  children: React.ReactNode
}) {
  const s = {
    tip:      "border-purple-500/40 bg-purple-500/10 text-purple-200",
    insight:  "border-sky-500/40    bg-sky-500/10    text-sky-200",
    exercise: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
  }
  const l = { tip: "TIP", insight: "INSIGHT", exercise: "EXERCISE" }
  return (
    <div className={`border-l-2 rounded-r-xl px-4 py-3 my-3 ${s[type]}`}>
      <span className="text-xs font-bold tracking-widest opacity-60 mr-2">{l[type]}</span>
      <span className="text-sm">{children}</span>
    </div>
  )
}

function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-4">
      {title && <h3 className="text-white font-semibold mb-3">{title}</h3>}
      {children}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CircleOfFifthsPage() {
  const [tab,      setTab]      = useState<Tab>("map")
  const [selected, setSelected] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">

        <div className="mb-6">
          <Link href="/" className="text-purple-300 hover:text-purple-200 text-sm mb-4 inline-block">← Back</Link>
          <h1 className="text-4xl font-bold text-white mb-2">Circle of Fifths</h1>
          <p className="text-purple-200/70">The map of all 12 keys — how they relate, how to move between them, and why it matters.</p>
        </div>

        <div className="flex gap-2 mb-8 flex-wrap">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                tab === t.id
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                  : "bg-white/5 text-purple-200/70 hover:bg-white/10"
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === "map"           && <MapTab           selected={selected} setSelected={setSelected} />}
        {tab === "progressions"  && <ProgressionsTab  selected={selected} setSelected={setSelected} />}
        {tab === "keysigs"       && <KeySigsTab       selected={selected} setSelected={setSelected} />}
        {tab === "relationships" && <RelationshipsTab selected={selected} setSelected={setSelected} />}
        {tab === "modulation"    && <ModulationTab    selected={selected} />}
        {tab === "songwriting"   && <SongwritingTab   selected={selected} />}

      </div>
    </div>
  )
}

// ─── Map tab ──────────────────────────────────────────────────────────────────

function MapTab({ selected, setSelected }: { selected: number; setSelected: (i: number) => void }) {
  return (
    <div className="space-y-6">
      <Card>
        <p className="text-purple-200/80 text-sm leading-relaxed">
          Every key has a place on this circle. Moving one step <strong className="text-white">clockwise</strong> takes
          you one fifth up (adding a sharp) — moving <strong className="text-white">counter-clockwise</strong> moves
          a fourth up (adding a flat). Keys close together share most of their notes; the key directly
          opposite is a tritone away — the maximum harmonic distance.
        </p>
        <p className="text-white/40 text-xs mt-2">Click any key to explore it →</p>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <div>
          <CoFCircle selected={selected} onSelect={setSelected} />
          <DistanceLegend />
        </div>
        <InfoPanel selected={selected} />
      </div>

      <Callout type="insight">
        The IV chord of any key is one step counter-clockwise, and the V chord is one step clockwise.
        I–IV–V–I is literally a triangle on the circle: one step left, two steps right, back home.
      </Callout>
    </div>
  )
}

// ─── Progressions tab ─────────────────────────────────────────────────────────

function ProgressionsTab({ selected, setSelected }: { selected: number; setSelected: (i: number) => void }) {
  const [progIdx, setProgIdx] = useState(0)

  const prog     = PROG_TEMPLATES[progIdx]
  const chords   = getDiatonicChords(selected)
  const progChords = prog.degrees.map(d => chords[d - 1])

  return (
    <div className="space-y-6">
      <Card>
        <p className="text-purple-200/80 text-sm leading-relaxed">
          Common progressions leave a clear visual signature on the circle. The ii–V–I is always three
          clockwise steps. I–IV–V always forms a tight triangle around the tonic. The circle progression
          spirals counter-clockwise through every diatonic chord. Numbers on lit sectors show the step order.
        </p>
      </Card>

      {/* Progression selector */}
      <div>
        <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Progression</p>
        <div className="flex flex-wrap gap-2">
          {PROG_TEMPLATES.map((p, i) => (
            <button key={i} onClick={() => setProgIdx(i)}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                progIdx === i ? "bg-purple-600 text-white" : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}>
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Key selector */}
      <div>
        <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Key</p>
        <div className="flex flex-wrap gap-1.5">
          {CIRCLE.map((k, i) => (
            <button key={i} onClick={() => setSelected(i)}
              className={`px-2.5 py-1 rounded-lg text-sm font-medium transition-all ${
                selected === i ? "bg-purple-600 text-white" : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}>{k.major}</button>
          ))}
        </div>
      </div>

      {/* Circle + info */}
      <div className="grid sm:grid-cols-2 gap-6 items-start">
        <ProgCircle keyPos={selected} degrees={prog.degrees} />

        <div className="space-y-4">
          {/* Chord sequence */}
          <div>
            <p className="text-white/40 text-xs uppercase tracking-widest mb-3">
              Chord sequence in {CIRCLE[selected].major}
            </p>
            <div className="flex flex-wrap gap-2 items-center">
              {progChords.map((ch, i) => {
                const fc = FN_COLORS[ch.fn]
                return (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className={`px-3 py-2 rounded-xl border text-center ${fc.bg} ${fc.border}`}>
                      <p className={`font-bold text-sm ${fc.text}`}>{ch.name}</p>
                      <p className="text-white/30 text-xs">{ch.roman}</p>
                    </div>
                    {i < progChords.length - 1 && (
                      <span className="text-white/20 text-xs">→</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
            <p className="text-white font-semibold text-sm">{prog.name}</p>
            <p className="text-white/60 text-sm leading-relaxed">{prog.description}</p>
            <p className="text-white/40 text-xs">
              <span className="text-purple-400">Genre: </span>{prog.genre}
            </p>
            <p className="text-white/40 text-xs">
              <span className="text-purple-400">Songs: </span>{prog.songs}
            </p>
            <p className="text-white/40 text-xs">
              <span className="text-purple-400">Circle shape: </span>{prog.shape}
            </p>
          </div>
        </div>
      </div>

      <Callout type="insight">
        The further apart the chords sit on the circle, the more dramatic the harmonic movement feels.
        Progressions that stay within 2 steps of the tonic sound smooth and familiar; ones that jump 4–5 steps
        sound surprising or cinematic.
      </Callout>
    </div>
  )
}

// ─── Key signatures tab ───────────────────────────────────────────────────────

function KeySigsTab({ selected, setSelected }: { selected: number; setSelected: (i: number) => void }) {
  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-white font-semibold mb-3">Why sharps and flats follow this pattern</h2>
        <p className="text-purple-200/80 text-sm leading-relaxed mb-3">
          Each time you move clockwise one step (up a fifth), exactly one note gets raised by a half step — that
          new sharp is always the 7th degree of the new key. Each time you move counter-clockwise (up a fourth),
          one note gets flattened — always the 4th degree of the new key.
        </p>
        <p className="text-purple-200/80 text-sm leading-relaxed">
          The sharps accumulate in the order F♯ C♯ G♯ D♯ A♯ E♯ B♯ ("Father Charles Goes Down And Ends Battle").
          Flats accumulate in reverse: B♭ E♭ A♭ D♭ G♭ C♭ F♭ ("Battle Ends And Down Goes Charles Father").
        </p>
      </Card>

      <div>
        <p className="text-white/40 text-xs uppercase tracking-widest mb-3">All 12 major keys</p>
        <div className="space-y-1.5">
          {CIRCLE.map((key, i) => {
            const dist = circleDistance(selected, i)
            const sel  = i === selected
            return (
              <button key={i} onClick={() => setSelected(i)} className="w-full text-left">
                <div className={`flex items-center gap-4 rounded-xl px-4 py-2.5 border transition-all ${
                  sel
                    ? "bg-purple-600/20 border-purple-500/40"
                    : dist <= 1
                    ? "bg-white/5 border-white/10 hover:bg-white/8"
                    : "bg-white/3 border-white/5 hover:bg-white/5"
                }`}>
                  <span className={`text-xs font-mono w-6 ${sel ? "text-purple-300" : "text-white/30"}`}>{i}</span>
                  <span className={`font-bold w-10 ${sel ? "text-white" : dist <= 2 ? "text-white/80" : "text-white/50"}`}>
                    {key.major}
                  </span>
                  <span className="text-white/30 text-xs w-12">{key.minor}</span>
                  <span className={`text-xs flex-1 ${sel ? "text-purple-300" : "text-white/40"}`}>
                    {keySigLabel(key.sharps, key.flats)}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                    key.sharps > 0 ? "bg-amber-500/15 text-amber-300"
                    : key.flats > 0 ? "bg-sky-500/15 text-sky-300"
                    : "bg-white/10 text-white/30"
                  }`}>
                    {key.sharps > 0 ? `${key.sharps}♯` : key.flats > 0 ? `${key.flats}♭` : "♮"}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <Callout type="tip">
        To find the key from a number of sharps: the last sharp added is the 7th degree — the key is a half
        step above it. 1 sharp = F♯, key is G. 3 sharps (F♯ C♯ G♯), last is G♯, key is A.
      </Callout>

      <Callout type="tip">
        For flats: the second-to-last flat added is always the key name. 2 flats = B♭ E♭, key is B♭.
        3 flats = B♭ E♭ A♭, key is E♭. (Exception: 1 flat = F major — just memorize it.)
      </Callout>
    </div>
  )
}

// ─── Relationships tab ────────────────────────────────────────────────────────

function RelationshipsTab({ selected, setSelected }: { selected: number; setSelected: (i: number) => void }) {
  const [comparePos,  setComparePos]  = useState<number>((selected + 1) % 12)
  const [activePivot, setActivePivot] = useState<string | null>(null)

  const chordsA = getDiatonicChords(selected)
  const chordsB = getDiatonicChords(comparePos)

  const namesA = new Set(chordsA.map(c => c.name))
  const namesB = new Set(chordsB.map(c => c.name))
  const shared = chordsA.filter(c => namesB.has(c.name))

  const dist = circleDistance(selected, comparePos)
  const sharedPct = Math.round((shared.length / 7) * 100)

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-white font-semibold mb-3">How much do two keys share?</h2>
        <p className="text-purple-200/80 text-sm leading-relaxed">
          Adjacent keys on the circle share 6 of 7 diatonic notes (and 4–6 of the same chords). The shared
          chords are called <strong className="text-white">pivot chords</strong> — chords that exist in both
          keys and can be used to modulate between them without the listener noticing an abrupt change.
        </p>
      </Card>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Key A</p>
          <div className="flex flex-wrap gap-1.5">
            {CIRCLE.map((k, i) => (
              <button key={i} onClick={() => setSelected(i)}
                className={`px-2.5 py-1 rounded-lg text-sm font-medium transition-all ${
                  selected === i ? "bg-purple-600 text-white" : "bg-white/5 text-white/60 hover:bg-white/10"
                }`}>{k.major}</button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Key B</p>
          <div className="flex flex-wrap gap-1.5">
            {CIRCLE.map((k, i) => (
              <button key={i} onClick={() => setComparePos(i)}
                className={`px-2.5 py-1 rounded-lg text-sm font-medium transition-all ${
                  comparePos === i ? "bg-sky-600 text-white" : "bg-white/5 text-white/60 hover:bg-white/10"
                }`}>{k.major}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <span className="text-purple-300 font-bold text-lg">{CIRCLE[selected].major}</span>
            <span className="text-white/30">↔</span>
            <span className="text-sky-300 font-bold text-lg">{CIRCLE[comparePos].major}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
              dist <= 1 ? "bg-green-500/20 text-green-300"
              : dist <= 3 ? "bg-sky-500/20 text-sky-300"
              : dist === 6 ? "bg-rose-500/20 text-rose-300"
              : "bg-white/10 text-white/50"
            }`}>{dist} step{dist !== 1 ? "s" : ""} apart</span>
            <span className="text-white/50 text-sm">{shared.length} / 7 shared chords ({sharedPct}%)</span>
          </div>
        </div>

        <div className="flex gap-1 mb-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full ${i < shared.length ? "bg-emerald-500" : "bg-white/10"}`} />
          ))}
        </div>

        {shared.length > 0 ? (
          <div>
            <p className="text-white/40 text-xs uppercase tracking-widest mb-2">
              Pivot chords <span className="normal-case font-normal opacity-60">— tap to see shapes</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {shared.map(ch => {
                const fc       = FN_COLORS[ch.fn]
                const inB      = chordsB.find(c => c.name === ch.name)
                const isActive = activePivot === ch.name
                return (
                  <button key={ch.name}
                    onClick={() => setActivePivot(isActive ? null : ch.name)}
                    className={`px-3 py-2 rounded-xl border text-left transition-all ${fc.bg} ${fc.border} ${
                      isActive ? "ring-1 ring-purple-400/30" : "hover:brightness-125"
                    }`}>
                    <p className={`font-bold text-sm ${fc.text}`}>{ch.name}</p>
                    <p className="text-white/30 text-xs">
                      {ch.roman} in {CIRCLE[selected].major} · {inB?.roman} in {CIRCLE[comparePos].major}
                    </p>
                  </button>
                )
              })}
            </div>
            {activePivot && (() => {
              const ch = shared.find(c => c.name === activePivot)
              return ch ? <ChordViewer chordName={ch.name} fn={ch.fn} /> : null
            })()}
          </div>
        ) : (
          <p className="text-white/30 text-sm">No shared chords — these keys are as distant as possible (tritone relationship).</p>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {[{ chords: chordsA, pos: selected, label: "A", col: "purple" }, { chords: chordsB, pos: comparePos, label: "B", col: "sky" }].map(side => (
          <div key={side.label}>
            <p className={`text-${side.col}-300 text-xs uppercase tracking-widest mb-2`}>
              {CIRCLE[side.pos].major} major — diatonic chords
            </p>
            <div className="space-y-1">
              {side.chords.map(ch => {
                const fc = FN_COLORS[ch.fn]
                const isShared = side.label === "A" ? namesB.has(ch.name) : namesA.has(ch.name)
                return (
                  <div key={ch.roman} className={`flex items-center gap-3 rounded-xl px-3 py-1.5 border transition-all ${
                    isShared ? `${fc.bg} ${fc.border}` : "bg-white/3 border-white/5 opacity-50"
                  }`}>
                    <span className="text-white/30 text-xs font-mono w-8">{ch.roman}</span>
                    <span className={`font-semibold text-sm ${isShared ? fc.text : "text-white/40"}`}>{ch.name}</span>
                    {isShared && <span className="text-white/30 text-xs ml-auto">pivot</span>}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <Callout type="insight">
        When two keys are 1 step apart, they share 6 of 7 chords. Moving through 3 keys in a row (e.g.
        C → G → D) lets you modulate twice with barely any friction — each step adds just one new note.
      </Callout>
    </div>
  )
}

// ─── Modulation tab ───────────────────────────────────────────────────────────

function ModulationTab({ selected }: { selected: number }) {
  const key         = CIRCLE[selected]
  const vPos        = (selected + 1)  % 12
  const chordsInKey = getDiatonicChords(selected)
  const vChord      = chordsInKey[4].name
  const viChord     = chordsInKey[5].name

  // Secondary dominants: for each scale degree, its V7 = 7 semitones above that degree
  const secDoms = [
    { label: "V/V",  targetLabel: `V (${chordsInKey[4].name})`,  targetInterval: 7  },
    { label: "V/ii", targetLabel: `ii (${chordsInKey[1].name})`, targetInterval: 2  },
    { label: "V/vi", targetLabel: `vi (${chordsInKey[5].name})`, targetInterval: 9  },
    { label: "V/IV", targetLabel: `IV (${chordsInKey[3].name})`, targetInterval: 5  },
  ].map(sd => ({
    ...sd,
    chord: nnFlat(key.semitone + sd.targetInterval + 7) + "7",
  }))

  // Tritone substitution: replace V7 with the chord 6 semitones above V
  const tritoneSubChord = nnFlat(key.semitone + 7 + 6) + "7"

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-white font-semibold mb-3">Moving between keys</h2>
        <p className="text-purple-200/80 text-sm leading-relaxed mb-3">
          Modulation means shifting the tonal center — making the listener feel a different key as "home."
          The circle tells you which keys to modulate to and which chords to use as the bridge.
        </p>
        <p className="text-purple-200/80 text-sm leading-relaxed">
          The closer two keys sit on the circle, the easier the modulation feels. Moving clockwise modulates
          to a brighter, higher-energy key; moving counter-clockwise modulates to a warmer, darker key.
        </p>
      </Card>

      {/* Three main modulation techniques */}
      <div className="space-y-4">
        <h2 className="text-white font-semibold">Three techniques — illustrated in {key.major} major</h2>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <div className="flex items-start gap-3 mb-3">
            <span className="text-emerald-400 text-lg font-bold shrink-0">1</span>
            <div>
              <h3 className="text-white font-semibold">Pivot chord modulation</h3>
              <p className="text-white/50 text-xs">The smoothest technique — use a chord that exists in both keys</p>
            </div>
          </div>
          <p className="text-white/60 text-sm leading-relaxed mb-3">
            A pivot chord belongs to both the departure key and the destination key. You play it as one function,
            the listener re-interprets it as another, and the new key arrives without any jolt.
          </p>
          <div className="bg-black/30 rounded-xl p-4 font-mono text-sm">
            <p className="text-white/40 text-xs mb-2">Example: {key.major} → {CIRCLE[vPos].major} (one step clockwise)</p>
            <div className="flex flex-wrap gap-3 items-center">
              <div className="text-center">
                <div className="text-emerald-300 font-bold">{chordsInKey[0].name}</div>
                <div className="text-white/30 text-xs">I in {key.major}</div>
              </div>
              <span className="text-white/20">→</span>
              <div className="text-center">
                <div className="text-emerald-300 font-bold">{chordsInKey[4].name}</div>
                <div className="text-white/30 text-xs">V in {key.major}</div>
              </div>
              <span className="text-white/20">→</span>
              <div className="text-center bg-purple-500/20 rounded-lg px-3 py-1.5 border border-purple-500/30">
                <div className="text-purple-300 font-bold">{chordsInKey[1].name}</div>
                <div className="text-white/30 text-xs">ii in {key.major}</div>
                <div className="text-white/30 text-xs">= IV in {CIRCLE[vPos].major}</div>
              </div>
              <span className="text-white/20">→</span>
              <div className="text-center">
                <div className="text-sky-300 font-bold">{CIRCLE[vPos].major}</div>
                <div className="text-white/30 text-xs">New tonic</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <div className="flex items-start gap-3 mb-3">
            <span className="text-amber-400 text-lg font-bold shrink-0">2</span>
            <div>
              <h3 className="text-white font-semibold">Direct modulation</h3>
              <p className="text-white/50 text-xs">Abrupt shift — powerful when used intentionally</p>
            </div>
          </div>
          <p className="text-white/60 text-sm leading-relaxed mb-3">
            Play the V7 of the new key, then land on the new tonic. There's no preparation — the new key
            announces itself. Works best at phrase boundaries (after a cadence, before a chorus).
          </p>
          <div className="bg-black/30 rounded-xl p-4 font-mono text-sm">
            <p className="text-white/40 text-xs mb-2">Example: {key.major} → {CIRCLE[vPos].major}</p>
            <div className="flex flex-wrap gap-3 items-center">
              <div className="text-center">
                <div className="text-emerald-300 font-bold">{chordsInKey[0].name}</div>
                <div className="text-white/30 text-xs">... cadence ...</div>
              </div>
              <span className="text-white/20">→</span>
              <div className="text-center bg-amber-500/15 rounded-lg px-3 py-1.5 border border-amber-500/25">
                <div className="text-amber-300 font-bold">{vChord}7</div>
                <div className="text-white/30 text-xs">V7 of new key</div>
              </div>
              <span className="text-white/20">→</span>
              <div className="text-center">
                <div className="text-sky-300 font-bold">{CIRCLE[vPos].major}</div>
                <div className="text-white/30 text-xs">New tonic</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <div className="flex items-start gap-3 mb-3">
            <span className="text-sky-400 text-lg font-bold shrink-0">3</span>
            <div>
              <h3 className="text-white font-semibold">Relative major / minor shift</h3>
              <p className="text-white/50 text-xs">The smoothest possible shift — same notes, new center</p>
            </div>
          </div>
          <p className="text-white/60 text-sm leading-relaxed mb-3">
            {key.major} major and {key.minor} share all 7 notes. Shift between them by emphasizing
            the new root chord — no chord changes needed, just a different gravitational pull.
          </p>
          <div className="bg-black/30 rounded-xl p-4 font-mono text-sm">
            <div className="flex flex-wrap gap-3 items-center">
              <div className="text-center">
                <div className="text-emerald-300 font-bold">{chordsInKey[0].name}</div>
                <div className="text-white/30 text-xs">Tonic of {key.major}</div>
              </div>
              <span className="text-white/20">↔</span>
              <div className="text-center">
                <div className="text-sky-300 font-bold">{viChord}</div>
                <div className="text-white/30 text-xs">Tonic of {key.minor}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Circle progression */}
      <Card title="The circle progression">
        <p className="text-white/60 text-sm leading-relaxed mb-4">
          Move through all 7 diatonic chords by descending fifths — each chord is the V of the next.
          This creates a chain of dominant resolutions that winds counter-clockwise all the way back to I.
        </p>
        <div className="bg-black/30 rounded-xl p-4">
          <p className="text-white/40 text-xs mb-3">In {key.major} major:</p>
          <div className="flex flex-wrap gap-2 items-center">
            {chordsInKey.map((ch, i) => {
              const fc = FN_COLORS[ch.fn]
              return (
                <div key={i} className="flex items-center gap-2">
                  <div className={`px-2.5 py-1.5 rounded-lg border text-center ${fc.bg} ${fc.border}`}>
                    <div className={`font-bold text-sm ${fc.text}`}>{ch.name}</div>
                    <div className="text-white/30 text-xs">{ch.roman}</div>
                  </div>
                  {i < 6 && <span className="text-white/20 text-xs">→</span>}
                </div>
              )
            })}
          </div>
        </div>
      </Card>

      {/* Secondary dominants */}
      <div>
        <h2 className="text-white font-semibold mb-3">Secondary dominants — V7 of any chord</h2>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <p className="text-white/60 text-sm leading-relaxed mb-4">
            Any chord in the key can be briefly "tonicised" by placing its dominant 7th (V7) before it.
            These <strong className="text-white">secondary dominants</strong> are borrowed from adjacent keys.
            On the circle, every secondary dominant sits exactly <strong className="text-white">one step
            clockwise from its target</strong>.
          </p>
          <div className="space-y-2">
            {secDoms.map(sd => (
              <div key={sd.label} className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-2.5">
                <span className="text-amber-300 font-bold text-sm w-12 shrink-0">{sd.label}</span>
                <span className="text-white font-semibold text-sm w-16">{sd.chord}</span>
                <span className="text-white/30 text-xs">→ resolves to {sd.targetLabel}</span>
              </div>
            ))}
          </div>
          <Callout type="insight">
            V/V is the most common. In {key.major}: play {secDoms[0].chord} before {chordsInKey[4].name} and
            the listener briefly hears {chordsInKey[4].name} as a temporary home — then {chordsInKey[0].name} brings
            them back.
          </Callout>
        </div>
      </div>

      {/* Tritone substitution */}
      <div>
        <h2 className="text-white font-semibold mb-3">Tritone substitution — the chord directly opposite</h2>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <p className="text-white/60 text-sm leading-relaxed mb-4">
            The chord exactly opposite on the circle (6 steps away) is the <strong className="text-white">tritone
            substitute</strong> for the dominant. In {key.major}: {vChord}7 and {tritoneSubChord} share the same
            internal tritone — the two notes that create tension — so either chord creates the same pull toward {key.major}.
            The bass note changes by a half step, creating chromatic voice leading.
          </p>
          <div className="bg-black/30 rounded-xl p-4">
            <p className="text-white/40 text-xs mb-3">In {key.major}: replace {vChord}7 with {tritoneSubChord}</p>
            <div className="flex flex-wrap gap-4 items-center">
              <div className="text-center">
                <div className="bg-emerald-500/15 border border-emerald-500/25 rounded-xl px-3 py-2">
                  <div className="text-emerald-300 font-bold">{chordsInKey[0].name}</div>
                  <div className="text-white/30 text-xs">I</div>
                </div>
              </div>
              <span className="text-white/20">→</span>
              <div className="space-y-1 text-center">
                <div className="bg-amber-500/15 border border-amber-500/25 rounded-xl px-3 py-2">
                  <div className="text-amber-300 font-bold">{vChord}7</div>
                  <div className="text-white/30 text-xs">V7 (standard)</div>
                </div>
                <div className="text-white/30 text-xs">or</div>
                <div className="bg-rose-500/15 border border-rose-500/25 rounded-xl px-3 py-2">
                  <div className="text-rose-300 font-bold">{tritoneSubChord}</div>
                  <div className="text-white/30 text-xs">♭II7 (tritone sub)</div>
                </div>
              </div>
              <span className="text-white/20">→</span>
              <div className="text-center">
                <div className="bg-emerald-500/15 border border-emerald-500/25 rounded-xl px-3 py-2">
                  <div className="text-emerald-300 font-bold">{chordsInKey[0].name}</div>
                  <div className="text-white/30 text-xs">I</div>
                </div>
              </div>
            </div>
            <p className="text-white/30 text-xs mt-3">
              Both V7 and ♭II7 contain the same tritone — just spelled enharmonically. The ♭II7 resolves
              with a chromatic half-step bass descent into I.
            </p>
          </div>
        </div>
      </div>

      <Callout type="insight">
        The Beatles used the circle constantly — "Yesterday" stays in adjacent keys, while "Penny Lane"
        makes bold multi-step jumps. Most pop songs stay within 2–3 steps; jazz traverses the full circle.
      </Callout>
    </div>
  )
}

// ─── Songwriting tab ──────────────────────────────────────────────────────────

function SongwritingTab({ selected }: { selected: number }) {
  const key     = CIRCLE[selected]
  const chords  = getDiatonicChords(selected)
  const borrows = getParallelMinorBorrows(selected)
  const vPos    = (selected + 1)  % 12
  const ivPos   = (selected + 11) % 12
  const secDomVV = nnFlat(key.semitone + 7 + 7) + "7"  // V/V chord

  const MOVES = [
    {
      title: "Stay diatonic",
      subtitle: "Use only the 7 chords in your key",
      effect: "Safe, familiar, consonant",
      how: `Pick any combination of: ${chords.map(c => c.name).join(", ")}`,
      emotional: "Approachable, bright, resolved",
      examples: "Most pop, country, folk",
      color: "border-emerald-500/30 bg-emerald-500/8",
      labelColor: "text-emerald-300",
    },
    {
      title: "Borrow from parallel minor",
      subtitle: `Pull chords from ${key.major} minor`,
      effect: "Darker color, dramatic contrast without modulating",
      how: `Insert ${borrows.map(b => b.name).join(", ")} into your progression`,
      emotional: "Yearning, melancholy, cinematic",
      examples: "Creep (Radiohead), Hotel California",
      color: "border-rose-500/30 bg-rose-500/8",
      labelColor: "text-rose-300",
    },
    {
      title: "Relative minor shift",
      subtitle: `${key.minor} — same notes, darker home`,
      effect: "Effortless tonal shift, no new notes",
      how: `Let ${chords[5].name} become the new tonic — emphasize it at phrase endings`,
      emotional: "Introspective, darker, suspended",
      examples: "Stairway to Heaven, Sultans of Swing",
      color: "border-sky-500/30 bg-sky-500/8",
      labelColor: "text-sky-300",
    },
    {
      title: "Secondary dominant",
      subtitle: `Add a V7 before any diatonic chord`,
      effect: "Brief tension without leaving the key",
      how: `Insert ${secDomVV} before ${chords[4].name} to "spotlight" the dominant`,
      emotional: "Sophisticated, jazzy pull",
      examples: "Jazz standards, I Got You (James Brown)",
      color: "border-amber-500/30 bg-amber-500/8",
      labelColor: "text-amber-300",
    },
    {
      title: "Modulate clockwise",
      subtitle: `Shift to ${CIRCLE[vPos].major} (one step right)`,
      effect: "Brighter, higher energy — classic verse-to-chorus lift",
      how: `Use ${chords[1].name} as pivot (it's IV in ${CIRCLE[vPos].major}), then establish ${CIRCLE[vPos].major}`,
      emotional: "Uplifting, energising, forward motion",
      examples: "Many pop choruses, Lady in Red",
      color: "border-violet-500/30 bg-violet-500/8",
      labelColor: "text-violet-300",
    },
    {
      title: "Modulate counter-clockwise",
      subtitle: `Shift to ${CIRCLE[ivPos].major} (one step left)`,
      effect: "Warmer, softer — bridge or outro resolution",
      how: `Use ${chords[0].name} as pivot (it's V in ${CIRCLE[ivPos].major}), then resolve to ${CIRCLE[ivPos].major}`,
      emotional: "Relaxing, warmer, settling",
      examples: "Many bridge sections",
      color: "border-teal-500/30 bg-teal-500/8",
      labelColor: "text-teal-300",
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-white font-semibold mb-3">From {key.major} major — your harmonic options</h2>
        <p className="text-purple-200/80 text-sm leading-relaxed">
          Every harmonic decision you make in a song corresponds to a move on the circle. Understanding
          what each move sounds like and when to use it is the practical skill that separates writers who
          "find" chord progressions from writers who <em>choose</em> them.
        </p>
      </Card>

      <div className="space-y-3">
        {MOVES.map(m => (
          <div key={m.title} className={`rounded-2xl border p-5 ${m.color}`}>
            <div className="flex items-start gap-3 mb-3">
              <div className="flex-1">
                <p className={`font-bold text-sm ${m.labelColor}`}>{m.title}</p>
                <p className="text-white/50 text-xs">{m.subtitle}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${m.color} ${m.labelColor} shrink-0`}>
                {m.emotional.split(",")[0]}
              </span>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-white/30 text-xs mb-1">How to use it</p>
                <p className="text-white/70 text-xs leading-relaxed">{m.how}</p>
              </div>
              <div>
                <p className="text-white/30 text-xs mb-1">Example songs</p>
                <p className="text-white/70 text-xs leading-relaxed">{m.examples}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Genre quick-ref */}
      <Card title="Genre tendencies">
        <div className="space-y-3">
          {[
            { genre: "Pop",      tendency: "I–V–vi–IV loop, occasional relative minor shift, rare modulation", stay: "1–2 steps" },
            { genre: "Rock",     tendency: "I–IV–V, borrowed bVII and bVI common, pentatonic implies Mixolydian", stay: "1–2 steps" },
            { genre: "Jazz",     tendency: "ii–V–I, turnarounds, secondary doms everywhere, tritone subs, modulates freely", stay: "All 12 keys" },
            { genre: "Country",  tendency: "I–IV–V, modulates a whole step up for final chorus (direct modulation)", stay: "1–2 steps" },
            { genre: "Classical",tendency: "Elaborate pivot-chord modulations through many keys, circle progression sequences", stay: "5–6 steps" },
            { genre: "Blues",    tendency: "I7–IV7–V7 (all dominant), parallel minor borrows, secondary doms natural to style", stay: "1–2 steps" },
          ].map(g => (
            <div key={g.genre} className="flex gap-3">
              <span className="text-purple-400 font-semibold text-sm w-20 shrink-0">{g.genre}</span>
              <div className="flex-1">
                <p className="text-white/60 text-xs leading-relaxed">{g.tendency}</p>
                <p className="text-white/30 text-xs mt-0.5">Circle range: {g.stay}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Callout type="tip">
        When you're stuck on a progression: pick any diatonic chord that sounds wrong, and try inserting
        its secondary dominant one beat before it. The sudden pull often makes that chord sound intentional
        and inevitable.
      </Callout>
    </div>
  )
}
