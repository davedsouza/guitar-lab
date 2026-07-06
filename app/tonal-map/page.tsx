"use client"

import Link from "next/link"
import { useState, useCallback } from "react"
import ChordDiagram from "@/components/ChordDiagram"
import { getChordVoicings } from "@/lib/chordShapes"

// ─── Types ────────────────────────────────────────────────────────────────────

type TonalFn = "tonic" | "subdominant" | "dominant"
type TabId   = "map" | "passing" | "cadences" | "borrowed" | "build"

interface DegInfo {
  degree: string; off: number; qual: string; fn: TonalFn
  resolves: number[]; scale: string; info: string
}
interface Approach {
  type: string; chord: string; label: string; why: string
  color: string; bg: string; border: string
}
interface CadenceInfo {
  name: string; abbr: string; from: number; to: number
  description: string; feel: string; genres: string; tip: string
  bg: string; border: string; text: string
}
interface BorrowedInfo {
  degree: string; semitones: number; qualSuffix: string; shapeQual: string
  from: string; feel: string; songs: string; common: string
  bg: string; border: string; text: string
}
interface ProgTemplate {
  name: string; genre: string; degrees: number[]
  description: string; songs: string
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const CHROMATIC = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"]
const KEYS = ["C","C#/Db","D","D#/Eb","E","F","F#/Gb","G","G#/Ab","A","A#/Bb","B"]

const DEGREES: DegInfo[] = [
  {
    degree:"I", off:0, qual:"maj7", fn:"tonic",
    resolves:[3,4,5], scale:"Ionian (Major)",
    info:"The tonal center — the gravitational home of the key. Everything orbits it. Maximum stability and rest.",
  },
  {
    degree:"ii", off:2, qual:"m7", fn:"subdominant",
    resolves:[4,6], scale:"Dorian",
    info:"Pre-dominant energy. Moving away from home toward tension. The smoothest path to V in jazz and pop.",
  },
  {
    degree:"iii", off:4, qual:"m7", fn:"tonic",
    resolves:[3,5], scale:"Phrygian",
    info:"Shares two notes with I — tonic function, but ambiguous. Often resolves to IV or vi rather than staying home.",
  },
  {
    degree:"IV", off:5, qual:"maj7", fn:"subdominant",
    resolves:[0,1,4], scale:"Lydian",
    info:"Bright and open. Moving away from home. IV→I is the 'amen' plagal cadence. Pre-dominant in classical harmony.",
  },
  {
    degree:"V", off:7, qual:"7", fn:"dominant",
    resolves:[0,5], scale:"Mixolydian",
    info:"Maximum tension. The tritone inside V7 pulls irresistibly back to I. V→I is the strongest resolution in tonal music.",
  },
  {
    degree:"vi", off:9, qual:"m7", fn:"tonic",
    resolves:[1,3,4], scale:"Aeolian (Natural Minor)",
    info:"The relative minor. Darker version of I — shares its stability but with a melancholy colour. V→vi is the deceptive cadence.",
  },
  {
    degree:"vii°", off:11, qual:"ø7", fn:"dominant",
    resolves:[0,2], scale:"Locrian",
    info:"The leading-tone chord. Half-diminished quality creates intense pull to I. Rarely used alone — best as a passing chord.",
  },
]

const FN_STYLE: Record<TonalFn, {
  label:string; short:string; desc:string; text:string; bg:string; border:string
  svgFill:string; svgStroke:string; dot:string
}> = {
  tonic: {
    label:"Tonic", short:"T", desc:"Stable · at rest",
    text:"text-emerald-300", bg:"bg-emerald-500/15", border:"border-emerald-500/40",
    svgFill:"#10b98120", svgStroke:"#10b981", dot:"bg-emerald-400",
  },
  subdominant: {
    label:"Subdominant", short:"S", desc:"Moving · pre-dominant",
    text:"text-sky-300", bg:"bg-sky-500/15", border:"border-sky-500/40",
    svgFill:"#0ea5e920", svgStroke:"#0ea5e9", dot:"bg-sky-400",
  },
  dominant: {
    label:"Dominant", short:"D", desc:"Tension · resolving",
    text:"text-amber-300", bg:"bg-amber-500/15", border:"border-amber-500/40",
    svgFill:"#f59e0b20", svgStroke:"#f59e0b", dot:"bg-amber-400",
  },
}

const NEXT_WEIGHTS: Record<TonalFn, number[]> = {
  tonic:       [0, 3, 1, 3, 4, 2, 1],
  subdominant: [2, 1, 0, 1, 5, 1, 2],
  dominant:    [5, 0, 1, 0, 0, 3, 0],
}

const CADENCES: CadenceInfo[] = [
  {
    name:"Perfect Authentic Cadence", abbr:"PAC", from:4, to:0,
    description:"The strongest resolution in tonal music. V7 contains a tritone (its 3rd and 7th) that resolves by half-step into the root and third of I. The leading tone pulls upward to the tonic — the feeling of inevitability is almost physical.",
    feel:"Complete · Conclusive · Full stop",
    genres:"Universal — classical, pop, jazz, gospel, folk",
    tip:"End your progressions here for maximum closure. Add a 7th to V (V7) for even stronger pull. Repeat V→I twice for extra finality.",
    bg:"bg-emerald-500/15", border:"border-emerald-500/40", text:"text-emerald-300",
  },
  {
    name:"Half Cadence", abbr:"HC", from:1, to:4,
    description:"Ends on V — a pause but not a resolution, like a comma in the middle of a sentence. The harmony is left open and expectant. Any chord can precede V, but ii→V is the smoothest approach.",
    feel:"Unfinished · Expectant · A question mark",
    genres:"Classical, pop (end of verses), jazz",
    tip:"Use at the end of a verse or A-section to create tension before the chorus resolves it. The contrast between a half cadence in the verse and a full PAC in the chorus is a core songwriting technique.",
    bg:"bg-amber-500/15", border:"border-amber-500/40", text:"text-amber-300",
  },
  {
    name:"Plagal Cadence", abbr:"PC", from:3, to:0,
    description:"Known as the 'Amen' cadence — softer and more meditative than V→I. There's no leading tone, so the resolution feels gentle rather than inevitable. IV shares two notes with I, making the voice-leading very smooth.",
    feel:"Soft · Devotional · At peace",
    genres:"Gospel, hymns, folk, Celtic, some pop",
    tip:"Often used as a tag after a Perfect Authentic Cadence to add warmth. Try I→IV→I after your final V→I for the classic 'amen' effect. Or use it mid-song where you want resolution without urgency.",
    bg:"bg-sky-500/15", border:"border-sky-500/40", text:"text-sky-300",
  },
  {
    name:"Deceptive Cadence", abbr:"DC", from:4, to:5,
    description:"Sounds like it's heading to V→I but sidesteps to vi instead. The ear expects I and gets vi — a chord that shares two notes with I and has the same tonic function, but with a darker, melancholy colour. The surprise extends the phrase.",
    feel:"Surprising · Bittersweet · Extended",
    genres:"Classical, pop, film music",
    tip:"Use when you want to avoid ending a phrase too early — the deceptive cadence says 'not yet.' Very effective before the true resolution. Common in film scores to sustain emotional ambiguity.",
    bg:"bg-violet-500/15", border:"border-violet-500/40", text:"text-violet-300",
  },
]

const BORROWED_CHORDS: BorrowedInfo[] = [
  {
    degree:"bVII", semitones:10, qualSuffix:"", shapeQual:"Major",
    from:"Natural Minor / Mixolydian",
    feel:"Anthemic · Powerful · Rock energy",
    songs:"Hey Jude · Sweet Home Alabama · With a Little Help from My Friends",
    common:"I → bVII → IV → I   or   bVII → IV → I",
    bg:"bg-orange-500/15", border:"border-orange-500/40", text:"text-orange-300",
  },
  {
    degree:"bVI", semitones:8, qualSuffix:"", shapeQual:"Major",
    from:"Natural Minor (Aeolian)",
    feel:"Cinematic · Dark · Dramatic",
    songs:"Under Pressure · California Dreamin' · many film scores",
    common:"I → bVI → bVII → I   or   I → bVI → IV → V",
    bg:"bg-violet-500/15", border:"border-violet-500/40", text:"text-violet-300",
  },
  {
    degree:"iv", semitones:5, qualSuffix:"m", shapeQual:"Minor",
    from:"Parallel Natural Minor",
    feel:"Melancholy · Bittersweet · Emotional",
    songs:"Yesterday (Beatles) · Under the Bridge · Creep (Radiohead)",
    common:"I → IV → iv → I   or   I → iv → V",
    bg:"bg-rose-500/15", border:"border-rose-500/40", text:"text-rose-300",
  },
  {
    degree:"bIII", semitones:3, qualSuffix:"", shapeQual:"Major",
    from:"Natural Minor / Aeolian",
    feel:"Bluesy · Heavy · Dark major",
    songs:"I Am the Walrus · Paranoid (Sabbath) · many metal / grunge songs",
    common:"I → bIII → IV   or   bIII → IV → I",
    bg:"bg-slate-400/15", border:"border-slate-400/30", text:"text-slate-300",
  },
  {
    degree:"v", semitones:7, qualSuffix:"m", shapeQual:"Minor",
    from:"Parallel Natural Minor",
    feel:"Subdued tension · Modal mystery",
    songs:"Scarborough Fair · various modal folk and R&B",
    common:"I → v → I   or   IV → v → I",
    bg:"bg-teal-500/15", border:"border-teal-500/40", text:"text-teal-300",
  },
]

const PROG_TEMPLATES: ProgTemplate[] = [
  {
    name:"Pop Axis", genre:"Pop / Rock", degrees:[0,4,5,3],
    description:"The most-used progression of the 21st century — Tonic → Dominant → Tonic (vi) → Subdominant.",
    songs:"Let It Be · Someone Like You · With or Without You · Don't Stop Believin'",
  },
  {
    name:"Minor Axis", genre:"Pop / Rock", degrees:[5,3,0,4],
    description:"Same four chords as Pop Axis starting on vi — darker and more introspective.",
    songs:"Mr. Brightside · Africa · Zombie · Despacito",
  },
  {
    name:"I – IV – V – I", genre:"Rock / Country", degrees:[0,3,4,0],
    description:"The foundational three-chord song. Tonic → Subdominant → Dominant → home.",
    songs:"La Bamba · Twist and Shout · Wild Thing · Johnny B. Goode",
  },
  {
    name:"50s Doo-Wop", genre:"Classic Pop", degrees:[0,5,3,4],
    description:"Circular motion through all three functions. Nostalgic and warm — never quite settles.",
    songs:"Stand By Me · Earth Angel · Blue Moon · Heart and Soul",
  },
  {
    name:"Jazz ii – V – I", genre:"Jazz", degrees:[1,4,0],
    description:"The fundamental jazz cadence. ii → V → I passes through all three functions and resolves decisively home.",
    songs:"Autumn Leaves · Fly Me to the Moon · All the Things You Are",
  },
  {
    name:"Jazz Turnaround", genre:"Jazz", degrees:[0,5,1,4],
    description:"I–vi–ii–V cycles back to the start of a phrase. The engine of jazz standards.",
    songs:"Satin Doll · Rhythm Changes · countless jazz standards",
  },
  {
    name:"Andalusian Cadence", genre:"Flamenco / Rock", degrees:[5,3,2,4],
    description:"Descending bass line vi – IV – iii – V. Dramatic, driving, unmistakable.",
    songs:"Stairway to Heaven (intro) · Hit the Road Jack · Sultans of Swing",
  },
  {
    name:"I – iii – IV – V", genre:"Pop / Soul", degrees:[0,2,3,4],
    description:"Ascending root motion that builds naturally toward the dominant.",
    songs:"Every Little Thing She Does Is Magic · Eye of the Tiger · countless ballads",
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getRoot = (k: string) => k.split('/')[0]

function chordRoot(key: string, off: number): string {
  return CHROMATIC[(CHROMATIC.indexOf(getRoot(key)) + off) % 12]
}

function fullChordName(key: string, di: number): string {
  const d = DEGREES[di]
  const r = chordRoot(key, d.off)
  const s = d.qual === "maj7" ? "maj7" : d.qual === "m7" ? "m7" : d.qual === "7" ? "7" : "ø7"
  return `${r}${s}`
}

function shortChordName(key: string, di: number): string {
  const d = DEGREES[di]
  const r = chordRoot(key, d.off)
  const s = d.qual === "maj7" ? "" : d.qual === "m7" ? "m" : d.qual === "7" ? "7" : "°"
  return `${r}${s}`
}

function getApproaches(key: string, di: number): Approach[] {
  const d   = DEGREES[di]
  const cr  = chordRoot(key, d.off)
  const ci  = CHROMATIC.indexOf(cr)
  const sd  = CHROMATIC[(ci + 7) % 12]
  const dim = CHROMATIC[(ci - 1 + 12) % 12]
  const hb  = CHROMATIC[(ci - 1 + 12) % 12]
  const ha  = CHROMATIC[(ci + 1) % 12]
  const tt  = CHROMATIC[(ci + 6) % 12]
  return [
    {
      type:"V7", chord:`${sd}7`, label:`V7/${d.degree}  —  Secondary Dominant`,
      why:`Treats ${cr} as a temporary home chord. The tritone inside ${sd}7 resolves by half step into the root and third of ${cr}. Works in any genre — the most idiomatic non-diatonic approach.`,
      color:"text-violet-300", bg:"bg-violet-500/10", border:"border-violet-500/25",
    },
    {
      type:"dim7", chord:`${dim}dim7`, label:`${dim}dim7  —  Chromatic Diminished`,
      why:`A fully-diminished 7th chord a half step below ${cr}. All 4 voices resolve upward by half step. The symmetrical structure means it can approach from any direction — common in jazz, gospel, and classic pop.`,
      color:"text-rose-300", bg:"bg-rose-500/10", border:"border-rose-500/25",
    },
    {
      type:"½ step", chord:`${hb} or ${ha}`, label:`Half-Step Approach`,
      why:`A major or minor chord a half step below (${hb}) or above (${ha}) creates simple chromatic motion into ${cr}. Works best as a quick one-beat chord on a weak beat. Common in rock, soul, and R&B.`,
      color:"text-slate-300", bg:"bg-slate-700/25", border:"border-slate-600/30",
    },
    ...(d.fn === "dominant" ? [{
      type:"bII7", chord:`${tt}7`, label:`${tt}7  —  Tritone Substitution`,
      why:`${tt}7 shares the same tritone interval as ${cr}7 (the 3rd and 7th swap roles). The bass descends by half step instead of a fifth — smoother voice leading, quintessentially jazz.`,
      color:"text-fuchsia-300", bg:"bg-fuchsia-500/10", border:"border-fuchsia-500/25",
    }] : []),
  ]
}

function weightedPick(weights: number[]): number {
  const total = weights.reduce((a, b) => a + b, 0)
  let r = Math.random() * total
  for (let i = 0; i < weights.length; i++) { r -= weights[i]; if (r <= 0) return i }
  return weights.length - 1
}

// ─── SVG wheel geometry ───────────────────────────────────────────────────────

const SZ = 360, CX = 180, CY = 180, OR = 138, NR = 34

function nPos(i: number) {
  const a = (i / 7) * 2 * Math.PI - Math.PI / 2
  return { x: CX + OR * Math.cos(a), y: CY + OR * Math.sin(a) }
}

const ARROWS: [number, number][] = [
  [0,3],[0,4],[0,5],[1,4],[1,6],[2,3],[2,5],
  [3,0],[3,4],[4,0],[4,5],[5,1],[5,3],[5,4],[6,0],[6,2],
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TonalMapPage() {
  const [key, setKey]     = useState("C")
  const [sel, setSel]     = useState<number | null>(null)
  const [tab, setTab]     = useState<TabId>("map")
  const [fromD, setFromD] = useState(0)
  const [toD,   setToD]   = useState(4)

  const [builtProg,  setBuiltProg]  = useState<number[]>([])
  const [expandPass, setExpandPass] = useState<number | null>(null)

  const addChord = useCallback((di: number) => {
    setBuiltProg(p => [...p, di])
    setExpandPass(null)
  }, [])

  const suggestNext = useCallback(() => {
    const lastFn: TonalFn = builtProg.length > 0
      ? DEGREES[builtProg[builtProg.length - 1]].fn
      : "dominant"
    const weights = builtProg.length === 0 ? [5,0,1,0,0,3,0] : NEXT_WEIGHTS[lastFn]
    addChord(weightedPick(weights))
  }, [builtProg, addChord])

  const loadTemplate = useCallback((degrees: number[]) => {
    setBuiltProg(degrees)
    setExpandPass(null)
  }, [])

  const resetBuild = () => { setBuiltProg([]); setExpandPass(null) }

  const changeKey = (k: string) => {
    setKey(k); setSel(null); setBuiltProg([]); setExpandPass(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-5xl">

        {/* Header */}
        <div className="mb-6">
          <Link href="/" className="text-purple-300 hover:text-purple-200 text-sm mb-4 inline-block">← Back</Link>
          <h1 className="text-4xl font-bold text-white mb-2">Tonal Map</h1>
          <p className="text-slate-400">
            The gravitational field of a key — how chords function, where they pull, and how to connect them.
          </p>
        </div>

        {/* Key selector */}
        <div className="mb-6 flex flex-wrap gap-2">
          {KEYS.map(k => (
            <button key={k} onClick={() => changeKey(k)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                getRoot(k) === getRoot(key)
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-700"
              }`}>
              {k}
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {([
            ["map",     "🎯", "Tonal Map"],
            ["passing", "🔗", "Passing Chords"],
            ["build",   "🎼", "Build Progression"],
          ] as [TabId, string, string][]).map(([id, icon, label]) => (
            <button key={id} onClick={() => setTab(id)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                tab === id
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-700"
              }`}>
              <span className="mr-1.5">{icon}</span>{label}
            </button>
          ))}

          <div className="w-px h-6 bg-slate-700 mx-1 hidden sm:block" />
          <span className="text-slate-600 text-xs hidden sm:block">Advanced</span>

          {([
            ["cadences", "🎓", "Cadences"],
            ["borrowed", "🔀", "Borrowed Chords"],
          ] as [TabId, string, string][]).map(([id, icon, label]) => (
            <button key={id} onClick={() => setTab(id)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                tab === id
                  ? "bg-slate-600 text-white"
                  : "bg-slate-800/50 text-slate-500 hover:bg-slate-700 hover:text-slate-300"
              }`}>
              <span className="mr-1.5">{icon}</span>{label}
            </button>
          ))}
        </div>

        {/* ── MAP TAB ─────────────────────────────────────────────────────────── */}
        {tab === "map" && (
          <div>
            <HowToUse steps={[
              { text: "Select a key at the top — the wheel updates to show all 7 diatonic chords in that key, each labelled with its degree (I, ii, iii, IV, V, vi, vii°)." },
              { text: "Each chord is colour-coded by function: Tonic (green) = stable home, Subdominant (blue) = moving away, Dominant (amber) = tension pulling back to I." },
              { text: "Click any chord on the wheel to open its info panel — function, natural resolution targets, mode to play over it, passing chord approaches, and a chord diagram." },
              { text: "The arrows show harmonic gravity — following them (V→I, ii→V, IV→I) creates smooth, resolved motion. Going against them creates surprise or tension." },
              { text: "The tonal center in the middle is always the I chord. Everything else orbits it." },
            ]} />

            {/* Function legend */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {(["tonic", "subdominant", "dominant"] as TonalFn[]).map(fn => {
                const s = FN_STYLE[fn]
                const degs = DEGREES.filter(d => d.fn === fn).map(d => d.degree).join(", ")
                return (
                  <div key={fn} className={`rounded-xl border p-4 ${s.bg} ${s.border}`}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${s.dot}`} />
                      <span className={`font-semibold text-sm ${s.text}`}>{s.label}</span>
                    </div>
                    <p className="text-slate-400 text-xs mb-1">{s.desc}</p>
                    <p className={`text-xs font-mono ${s.text} opacity-60`}>{degs}</p>
                  </div>
                )
              })}
            </div>

            <div className="grid lg:grid-cols-[390px_1fr] gap-6 items-start">
              {/* SVG Wheel */}
              <div className="bg-slate-900/50 border border-slate-700/40 rounded-2xl p-4 flex flex-col items-center">
                <svg width={SZ} height={SZ} viewBox={`0 0 ${SZ} ${SZ}`} className="w-full max-w-[360px]">
                  <defs>
                    <marker id="arr-n" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
                      <polygon points="0 0,7 2.5,0 5" fill="#334155" />
                    </marker>
                    <marker id="arr-a" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
                      <polygon points="0 0,7 2.5,0 5" fill="#fbbf24" />
                    </marker>
                  </defs>
                  <circle cx={CX} cy={CY} r={OR+NR+10} fill="none" stroke="#1e293b" strokeWidth={1} strokeDasharray="3 4" />
                  <circle cx={CX} cy={CY} r={50} fill="#0f172a" stroke="#1e293b" strokeWidth={1.5} />
                  <text x={CX} y={CY-8} textAnchor="middle" fill="#94a3b8" fontSize={14} fontWeight="600" fontFamily="system-ui">
                    {getRoot(key)} major
                  </text>
                  <text x={CX} y={CY+12} textAnchor="middle" fill="#334155" fontSize={8} fontFamily="system-ui" letterSpacing="1.5">
                    TONAL CENTER
                  </text>
                  {ARROWS.map(([f, t], idx) => {
                    const p1 = nPos(f), p2 = nPos(t)
                    const dx = p2.x-p1.x, dy = p2.y-p1.y
                    const dist = Math.sqrt(dx*dx+dy*dy)
                    const ux = dx/dist, uy = dy/dist
                    const sx = p1.x+ux*NR, sy = p1.y+uy*NR
                    const ex = p2.x-ux*(NR+5), ey = p2.y-uy*(NR+5)
                    const mx = (sx+ex)/2, my = (sy+ey)/2
                    const qx = mx+(CX-mx)*0.28, qy = my+(CY-my)*0.28
                    const isAct = sel !== null && f === sel && DEGREES[sel].resolves.includes(t)
                    const isDim = sel !== null && !isAct
                    return (
                      <path key={idx} d={`M ${sx} ${sy} Q ${qx} ${qy} ${ex} ${ey}`}
                        stroke={isAct ? "#fbbf24" : isDim ? "#0f172a" : "#334155"}
                        strokeWidth={isAct ? 2 : 1} fill="none"
                        markerEnd={`url(#${isAct ? "arr-a" : "arr-n"})`}
                        opacity={isDim ? 0.05 : isAct ? 1 : 0.4}
                      />
                    )
                  })}
                  {DEGREES.map((d, i) => {
                    const { x, y } = nPos(i)
                    const s = FN_STYLE[d.fn]
                    const isSel = sel === i
                    const isRes = sel !== null && DEGREES[sel].resolves.includes(i)
                    return (
                      <g key={i} style={{ cursor:"pointer" }} onClick={() => setSel(sel === i ? null : i)}>
                        <circle cx={x} cy={y} r={NR+7} fill="transparent" />
                        <circle cx={x} cy={y} r={NR}
                          fill={isSel ? s.svgFill : "#0f172a"}
                          stroke={isSel ? s.svgStroke : isRes ? "#fbbf2455" : "#1e293b"}
                          strokeWidth={isSel ? 2.5 : isRes ? 1.5 : 1}
                        />
                        <text x={x} y={y-8} textAnchor="middle"
                          fill={isSel ? s.svgStroke : "#475569"}
                          fontSize={10} fontWeight="700" fontFamily="system-ui">{d.degree}</text>
                        <text x={x} y={y+6} textAnchor="middle"
                          fill={isSel ? "white" : "#334155"}
                          fontSize={11} fontFamily="system-ui">{shortChordName(key, i)}</text>
                        <text x={x} y={y+19} textAnchor="middle"
                          fill={isSel ? s.svgStroke : "#1e293b"}
                          fontSize={8} fontFamily="system-ui">{s.short}</text>
                      </g>
                    )
                  })}
                </svg>
                <p className="text-slate-600 text-xs mt-2">Click any chord to explore it</p>
              </div>

              {/* Info panel */}
              {sel !== null
                ? <SelectedChordPanel key={`${key}-${sel}`} keyStr={key} di={sel} />
                : <TonalCenterPanel keyStr={key} />
              }
            </div>
          </div>
        )}

        {/* ── PASSING CHORDS TAB ──────────────────────────────────────────────── */}
        {tab === "passing" && (
          <PassingChordsTab
            keyStr={key} fromD={fromD} setFromD={setFromD} toD={toD} setToD={setToD}
          />
        )}

        {/* ── CADENCES TAB ────────────────────────────────────────────────────── */}
        {tab === "cadences" && <CadencesTab keyStr={key} />}

        {/* ── BORROWED CHORDS TAB ─────────────────────────────────────────────── */}
        {tab === "borrowed" && <BorrowedTab keyStr={key} />}

        {/* ── BUILD PROGRESSION TAB ───────────────────────────────────────────── */}
        {tab === "build" && (
          <BuildTab
            keyStr={key}
            builtProg={builtProg}
            expandPass={expandPass}
            setExpandPass={setExpandPass}
            onAdd={addChord}
            onSuggest={suggestNext}
            onLoad={loadTemplate}
            onReset={resetBuild}
          />
        )}

      </div>
    </div>
  )
}

// ─── Selected Chord Panel ─────────────────────────────────────────────────────

function SelectedChordPanel({ keyStr, di }: { keyStr: string; di: number }) {
  const d = DEGREES[di]
  const s = FN_STYLE[d.fn]
  const approaches = getApproaches(keyStr, di)
  return (
    <div className="space-y-4">
      <div className={`rounded-2xl border p-5 ${s.bg} ${s.border}`}>
        <div className="flex items-center gap-3 flex-wrap mb-2">
          <span className={`text-3xl font-bold ${s.text}`}>{fullChordName(keyStr, di)}</span>
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.border} ${s.text}`}>
            {d.degree} — {s.label}
          </span>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed">{d.info}</p>
      </div>

      <ChordViewer keyStr={keyStr} di={di} />

      <div className="bg-slate-800/50 border border-slate-700/40 rounded-xl p-4">
        <p className="text-slate-500 text-xs uppercase tracking-widest mb-3">Typically resolves to</p>
        <div className="flex flex-wrap gap-2">
          {d.resolves.map(i => {
            const ts = FN_STYLE[DEGREES[i].fn]
            return (
              <div key={i} className={`px-3 py-2 rounded-xl border ${ts.bg} ${ts.border} text-center`}>
                <div className={`text-sm font-bold ${ts.text}`}>{shortChordName(keyStr, i)}</div>
                <div className="text-slate-500 text-xs">{DEGREES[i].degree}</div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700/40 rounded-xl p-4">
        <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">Mode / scale to play over it</p>
        <p className={`text-base font-semibold ${s.text}`}>{chordRoot(keyStr, d.off)} {d.scale}</p>
      </div>

      <div>
        <p className="text-slate-500 text-xs uppercase tracking-widest mb-3">
          Passing chords that approach {shortChordName(keyStr, di)}
        </p>
        <div className="space-y-2">
          {approaches.map((a, i) => (
            <div key={i} className={`rounded-xl border p-4 ${a.bg} ${a.border}`}>
              <div className="flex items-start gap-3">
                <span className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded border ${a.bg} ${a.border} ${a.color} mt-0.5`}>
                  {a.type}
                </span>
                <div>
                  <p className={`text-sm font-bold font-mono ${a.color} mb-1`}>{a.chord}</p>
                  <p className="text-slate-400 text-xs leading-relaxed">{a.why}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Tonal Center Panel ───────────────────────────────────────────────────────

function TonalCenterPanel({ keyStr }: { keyStr: string }) {
  const leadingTone = CHROMATIC[(CHROMATIC.indexOf(getRoot(keyStr)) + 11) % 12]
  return (
    <div className="space-y-4">
      <div className="bg-slate-800/50 border border-slate-700/40 rounded-2xl p-5">
        <h2 className="text-xl font-bold text-white mb-3">The tonal center</h2>
        <p className="text-slate-300 text-sm leading-relaxed mb-3">
          Every key has a gravitational home — the <span className="text-purple-300 font-semibold">tonal center</span>.
          In {getRoot(keyStr)} major that's the {shortChordName(keyStr, 0)} chord. Every other chord creates tension
          that ultimately wants to resolve back to it.
        </p>
        <p className="text-slate-400 text-sm leading-relaxed">
          The wheel shows this gravity. Arrows point in the direction of natural resolution. The V chord has the
          strongest pull — the leading tone ({leadingTone}→{getRoot(keyStr)}) moves by just a half step, making
          V→I feel inevitable.
        </p>
      </div>
      <div className="bg-slate-800/50 border border-slate-700/40 rounded-2xl p-5">
        <h2 className="text-lg font-bold text-white mb-4">The three functions</h2>
        <div className="space-y-3">
          {([
            ["tonic",       `Stable home. ${DEGREES.filter(d=>d.fn==="tonic").map(d=>d.degree).join(", ")}. The I chord is the strongest; iii and vi share its stability but add colour.`],
            ["subdominant", `Moving away from home. ${DEGREES.filter(d=>d.fn==="subdominant").map(d=>d.degree).join(", ")}. Creates forward motion toward the dominant.`],
            ["dominant",    `Maximum tension. ${DEGREES.filter(d=>d.fn==="dominant").map(d=>d.degree).join(", ")}. The leading tone (${leadingTone}) pulls powerfully toward ${getRoot(keyStr)}. V7→I is the strongest cadence in tonal music.`],
          ] as [TonalFn, string][]).map(([fn, desc]) => {
            const s = FN_STYLE[fn]
            return (
              <div key={fn} className={`rounded-xl border p-4 ${s.bg} ${s.border}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                  <p className={`text-sm font-semibold ${s.text}`}>{s.label} · {s.short}</p>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
              </div>
            )
          })}
        </div>
      </div>
      <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
        <p className="text-slate-400 text-sm">← Click any chord on the wheel to see its function, what it resolves to, which scale to play over it, and every passing chord that approaches it.</p>
      </div>
    </div>
  )
}

// ─── Passing Chords Tab ───────────────────────────────────────────────────────

function PassingChordsTab({ keyStr, fromD, setFromD, toD, setToD }: {
  keyStr: string
  fromD: number; setFromD: (n: number) => void
  toD:   number; setToD:   (n: number) => void
}) {
  const approaches = getApproaches(keyStr, toD)
  const toFn    = FN_STYLE[DEGREES[toD].fn]
  const toShort = shortChordName(keyStr, toD)

  return (
    <div>
      <div className="bg-slate-800/50 border border-slate-700/40 rounded-2xl p-5 mb-6">
        <h2 className="text-xl font-bold text-white mb-2">Passing Chords</h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          A passing chord is a non-diatonic chord inserted <em>between</em> two diatonic chords to create smoother
          or more dramatic motion. The passing options are determined by the chord you're approaching, not the one
          you're leaving.
        </p>
      </div>

      <HowToUse steps={[
        { text: "Pick a 'From' chord (where you currently are) and a 'To' chord (your next destination)." },
        { text: "A passing chord sits between them for typically one beat on a weak beat — it creates a brief harmonic detour that makes landing on your target feel more satisfying." },
        { text: "Secondary Dominant (V7/x) is the most universal: it temporarily treats your target as a new home, creating a strong pull into it. Works in pop, jazz, gospel, and rock." },
        { text: "Chromatic Diminished (dim7) resolves all four voices by half-step simultaneously. Classic in jazz, gospel, and soul." },
        { text: "Half-step approach: just a chord a semitone above or below your target. Quick one-beat 'push' in rock, soul, and R&B." },
        { text: "Tritone Substitution (dominant targets only) swaps V7 for the chord a tritone away — same tension, smoother bass movement. Quintessentially jazz." },
      ]} />

      {/* From / To selectors */}
      {(() => {
        const naturalTargets = DEGREES[fromD].resolves
        const fromFn = FN_STYLE[DEGREES[fromD].fn]

        const handleFromD = (i: number) => {
          setFromD(i)
          if (!DEGREES[i].resolves.includes(toD)) setToD(DEGREES[i].resolves[0])
        }

        return (
          <div className="space-y-5 mb-6">
            <div>
              <p className="text-slate-500 text-xs uppercase tracking-wider mb-2">From</p>
              <div className="flex flex-wrap gap-1.5">
                {DEGREES.map((d, i) => {
                  const s = FN_STYLE[d.fn]
                  return (
                    <button key={i} onClick={() => handleFromD(i)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                        fromD === i ? `${s.bg} ${s.border} ${s.text}` : "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700"
                      }`}>
                      {d.degree} · {shortChordName(keyStr, i)}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className={`rounded-xl border p-3 ${fromFn.bg} ${fromFn.border}`}>
              <p className="text-slate-500 text-xs mb-1.5">
                <span className={`font-semibold ${fromFn.text}`}>{DEGREES[fromD].degree} ({fromFn.label})</span>
                {" "}naturally moves to:
              </p>
              <div className="flex flex-wrap gap-2">
                {naturalTargets.map(i => {
                  const ts = FN_STYLE[DEGREES[i].fn]
                  return (
                    <button key={i} onClick={() => setToD(i)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all ${
                        toD === i
                          ? `${ts.bg} ${ts.border} ${ts.text} shadow-md`
                          : `bg-slate-800/60 ${ts.border} ${ts.text} opacity-70 hover:opacity-100`
                      }`}>
                      {DEGREES[i].degree} · {shortChordName(keyStr, i)}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <p className="text-slate-500 text-xs uppercase tracking-wider">To (target chord)</p>
                <span className="text-slate-600 text-xs">— or pick any chord below</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {DEGREES.map((d, i) => {
                  const s = FN_STYLE[d.fn]
                  return (
                    <button key={i} onClick={() => setToD(i)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                        toD === i
                          ? `${s.bg} ${s.border} ${s.text}`
                          : naturalTargets.includes(i)
                          ? "bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700"
                          : "bg-slate-800/40 border-slate-700/40 text-slate-600 hover:bg-slate-700 hover:text-slate-400"
                      }`}>
                      {d.degree} · {shortChordName(keyStr, i)}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )
      })()}

      {/* Bridge */}
      <div className={`rounded-2xl border p-5 mb-4 ${toFn.bg} ${toFn.border}`}>
        <p className="text-slate-500 text-xs uppercase tracking-wider mb-3">The bridge</p>
        <div className="flex items-center gap-3 flex-wrap text-lg">
          <span className="text-white font-bold">{shortChordName(keyStr, fromD)}</span>
          <span className="text-slate-500">→</span>
          <span className="text-slate-500 font-mono text-sm px-2 py-1 bg-slate-800/60 rounded-lg">[passing chord]</span>
          <span className="text-slate-500">→</span>
          <span className={`font-bold ${toFn.text}`}>{fullChordName(keyStr, toD)}</span>
          <span className={`text-xs px-2 py-1 rounded-lg ${toFn.bg} ${toFn.border} ${toFn.text}`}>
            {DEGREES[toD].degree} — {toFn.label}
          </span>
        </div>
      </div>

      {/* Target chord diagram */}
      <ChordViewer key={`${keyStr}-${toD}`} keyStr={keyStr} di={toD} />

      {/* Approach options */}
      <div className="space-y-3 mt-4">
        {approaches.map((a, i) => (
          <div key={i} className={`rounded-2xl border p-5 ${a.bg} ${a.border}`}>
            <div className="flex items-start gap-4">
              <span className={`shrink-0 text-xs font-bold px-2 py-1 rounded border ${a.bg} ${a.border} ${a.color} mt-0.5`}>
                {a.type}
              </span>
              <div>
                <div className="flex items-center gap-3 flex-wrap mb-2">
                  <span className={`text-xl font-bold font-mono ${a.color}`}>{a.chord}</span>
                  <span className="text-slate-500">→</span>
                  <span className={`text-lg font-bold ${toFn.text}`}>{toShort}</span>
                </div>
                <p className="text-xs text-slate-500 mb-1">{a.label}</p>
                <p className="text-slate-400 text-sm leading-relaxed">{a.why}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Cadences Tab ─────────────────────────────────────────────────────────────

function CadencesTab({ keyStr }: { keyStr: string }) {
  return (
    <div>
      <div className="bg-slate-800/50 border border-slate-700/40 rounded-2xl p-5 mb-6">
        <h2 className="text-xl font-bold text-white mb-2">Cadences</h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          A cadence is a harmonic movement that creates a sense of rest, pause, or resolution at the end of a musical
          phrase — the punctuation of harmony. There are four main types, each creating a different emotional effect.
        </p>
      </div>

      <HowToUse steps={[
        { text: "A cadence is a 2-chord movement that ends a phrase. The four types differ in how resolved or 'finished' they feel." },
        { text: "Perfect Authentic Cadence (V→I) is the strongest resolution — use it to end sections and pieces. Half Cadence (→V) is a pause without resolution — use it mid-song to create expectation." },
        { text: "Plagal Cadence (IV→I) is the gentle 'amen' ending. Deceptive Cadence (V→vi) tricks the ear by going to vi instead of the expected I." },
        { text: "In practice: end verses with a Half Cadence, end choruses with a Perfect Authentic Cadence, use Deceptive Cadences to extend a phrase when you're not ready to resolve yet." },
      ]} />

      <div className="grid lg:grid-cols-2 gap-5">
        {CADENCES.map(c => {
          const fromD  = DEGREES[c.from]
          const toD    = DEGREES[c.to]
          const fromFn = FN_STYLE[fromD.fn]
          const toFn   = FN_STYLE[toD.fn]
          return (
            <div key={c.abbr} className={`rounded-2xl border p-5 space-y-4 ${c.bg} ${c.border}`}>
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded border ${c.bg} ${c.border} ${c.text}`}>
                      {c.abbr}
                    </span>
                  </div>
                  <h3 className={`text-lg font-bold ${c.text}`}>{c.name}</h3>
                  <p className="text-slate-500 text-xs mt-0.5 italic">{c.feel}</p>
                </div>
              </div>

              {/* Movement */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className={`px-3 py-2 rounded-xl border ${fromFn.bg} ${fromFn.border} text-center min-w-[60px]`}>
                  <div className={`text-base font-bold ${fromFn.text}`}>{shortChordName(keyStr, c.from)}</div>
                  <div className="text-slate-500 text-xs">{fromD.degree}</div>
                </div>
                <span className={`text-2xl font-light ${c.text}`}>→</span>
                <div className={`px-3 py-2 rounded-xl border ${toFn.bg} ${toFn.border} text-center min-w-[60px]`}>
                  <div className={`text-base font-bold ${toFn.text}`}>{shortChordName(keyStr, c.to)}</div>
                  <div className="text-slate-500 text-xs">{toD.degree}</div>
                </div>
              </div>

              {/* Chord diagrams */}
              <div className="flex gap-4 flex-wrap">
                <ChordViewer key={`${keyStr}-cad-from-${c.from}`} keyStr={keyStr} di={c.from} />
                <ChordViewer key={`${keyStr}-cad-to-${c.to}`} keyStr={keyStr} di={c.to} />
              </div>

              {/* Description */}
              <p className="text-slate-400 text-sm leading-relaxed">{c.description}</p>

              {/* Genres */}
              <p className="text-slate-500 text-xs">
                <span className="text-slate-400 font-medium">Genre: </span>{c.genres}
              </p>

              {/* Tip */}
              <div className={`rounded-lg border p-3 ${c.bg} ${c.border}`}>
                <p className="text-xs font-semibold text-slate-400 mb-1">Practical tip</p>
                <p className="text-slate-400 text-xs leading-relaxed">{c.tip}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Borrowed Chords Tab ──────────────────────────────────────────────────────

function BorrowedTab({ keyStr }: { keyStr: string }) {
  return (
    <div>
      <div className="bg-slate-800/50 border border-slate-700/40 rounded-2xl p-5 mb-6">
        <h2 className="text-xl font-bold text-white mb-2">Borrowed Chords</h2>
        <p className="text-slate-400 text-sm leading-relaxed mb-2">
          Modal interchange — borrowing chords from the parallel minor or related modes while staying in a major key.
          The key centre doesn't change; you're just reaching into a darker colour palette for one or two chords.
        </p>
        <p className="text-slate-400 text-sm leading-relaxed">
          In <span className="text-purple-300 font-semibold">{getRoot(keyStr)} major</span> the parallel minor is{" "}
          <span className="text-purple-300 font-semibold">{getRoot(keyStr)} minor</span>. These are the chords most
          commonly borrowed from it.
        </p>
      </div>

      <HowToUse steps={[
        { text: "A borrowed chord is a diatonic chord from the parallel minor (same root, minor key) used temporarily in your major key progression." },
        { text: "The key centre stays the same — you haven't modulated. The borrowed chord creates colour contrast before you return to major harmony." },
        { text: "bVII is the most common borrowed chord in rock and pop. iv (minor 4) adds a bittersweet melancholy. bVI is cinematic and dramatic." },
        { text: "Typical placement: insert a borrowed chord between two diatonic chords for contrast. Return to a diatonic chord immediately after for smooth voice-leading." },
        { text: "Listen to the 'famous songs' examples for each chord — borrowed chords are easier to hear than to explain theoretically." },
      ]} />

      <div className="space-y-4">
        {BORROWED_CHORDS.map(b => {
          const root      = CHROMATIC[(CHROMATIC.indexOf(getRoot(keyStr)) + b.semitones) % 12]
          const chordName = `${root}${b.qualSuffix}`
          const voicings  = getChordVoicings(root, b.shapeQual)
          return (
            <div key={b.degree} className={`rounded-2xl border p-5 ${b.bg} ${b.border}`}>
              <div className="grid lg:grid-cols-[1fr_auto] gap-5 items-start">
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`text-2xl font-bold ${b.text}`}>{chordName}</span>
                    <span className={`text-sm font-semibold px-2.5 py-1 rounded-full border ${b.bg} ${b.border} ${b.text}`}>
                      {b.degree}
                    </span>
                    <span className="text-slate-500 text-xs">from {b.from}</span>
                  </div>
                  <p className="text-slate-400 text-sm italic">{b.feel}</p>

                  {/* Common usage */}
                  <div>
                    <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Common usage</p>
                    <p className={`text-sm font-mono ${b.text}`}>{b.common.replace(/I/g, shortChordName(keyStr, 0)).replace(/IV/g, shortChordName(keyStr, 3)).replace(/V/g, shortChordName(keyStr, 4))}</p>
                    <p className="text-slate-600 text-xs mt-0.5 font-mono">{b.common}</p>
                  </div>

                  {/* Famous songs */}
                  <div>
                    <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Famous examples</p>
                    <p className="text-slate-300 text-sm">{b.songs}</p>
                  </div>
                </div>

                {/* Chord diagram */}
                {voicings && voicings.length > 0 && (
                  <BorrowedChordDiagram key={`${keyStr}-b-${b.degree}`} chordName={chordName} voicings={voicings} />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function BorrowedChordDiagram({ chordName, voicings }: {
  chordName: string
  voicings: { fingers: (number|string)[]; position: string; difficulty: string }[]
}) {
  const [vi, setVi] = useState(0)
  const idx = Math.min(vi, voicings.length - 1)
  const v   = voicings[idx]
  return (
    <div className="shrink-0">
      {voicings.length > 1 && (
        <div className="flex items-center gap-1.5 justify-end mb-2">
          <button onClick={() => setVi(i => Math.max(0, i-1))} disabled={idx===0}
            className="w-5 h-5 rounded bg-slate-700 hover:bg-slate-600 text-white text-xs disabled:opacity-30 flex items-center justify-center">‹</button>
          <span className="text-slate-600 text-xs tabular-nums">{idx+1}/{voicings.length}</span>
          <button onClick={() => setVi(i => Math.min(voicings.length-1, i+1))} disabled={idx===voicings.length-1}
            className="w-5 h-5 rounded bg-slate-700 hover:bg-slate-600 text-white text-xs disabled:opacity-30 flex items-center justify-center">›</button>
        </div>
      )}
      <ChordDiagram chordName={chordName} fingers={v.fingers} size="small" />
      <p className="text-slate-600 text-xs text-center mt-1">{v.position}</p>
    </div>
  )
}

// ─── Chord Viewer ─────────────────────────────────────────────────────────────

function qualToQuality(qual: string): string {
  if (qual === "maj7") return "Major 7th"
  if (qual === "m7")   return "Minor 7th"
  if (qual === "7")    return "Dominant 7th"
  return "Diminished"
}

function ChordViewer({ keyStr, di }: { keyStr: string; di: number }) {
  const [vi, setVi] = useState(0)
  const d        = DEGREES[di]
  const root     = chordRoot(keyStr, d.off)
  const quality  = qualToQuality(d.qual)
  const voicings = getChordVoicings(root, quality)
  if (!voicings || voicings.length === 0) return null
  const idx = Math.min(vi, voicings.length - 1)
  const v   = voicings[idx]
  return (
    <div className="bg-slate-800/50 border border-slate-700/40 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-slate-500 text-xs uppercase tracking-widest">How to play</p>
        {voicings.length > 1 && (
          <div className="flex items-center gap-2">
            <button onClick={() => setVi(i => Math.max(0, i-1))} disabled={idx===0}
              className="w-6 h-6 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-30 text-white text-sm flex items-center justify-center transition-all">‹</button>
            <span className="text-slate-500 text-xs tabular-nums">{idx+1} / {voicings.length}</span>
            <button onClick={() => setVi(i => Math.min(voicings.length-1, i+1))} disabled={idx===voicings.length-1}
              className="w-6 h-6 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-30 text-white text-sm flex items-center justify-center transition-all">›</button>
          </div>
        )}
      </div>
      <div className="flex items-start gap-5 flex-wrap">
        <ChordDiagram chordName={fullChordName(keyStr, di)} fingers={v.fingers} size="medium" />
        <div className="pt-1 space-y-2">
          <p className="text-white text-sm font-semibold">{v.position}</p>
          <span className={`inline-block text-xs px-2 py-0.5 rounded-full border ${
            v.difficulty === "beginner"     ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
            : v.difficulty === "intermediate" ? "bg-amber-500/15 border-amber-500/30 text-amber-400"
            : "bg-rose-500/15 border-rose-500/30 text-rose-400"
          }`}>{v.difficulty}</span>
          {voicings.length > 1 && <p className="text-slate-600 text-xs">{voicings.length} voicings available</p>}
        </div>
      </div>
    </div>
  )
}

// ─── How To Use (collapsible) ─────────────────────────────────────────────────

function HowToUse({ steps }: { steps: { text: string }[] }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="mb-5">
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors">
        <span className={`text-base leading-none transition-transform duration-200 ${open ? "rotate-90" : ""}`}>›</span>
        <span>{open ? "Hide instructions" : "How to use this tab"}</span>
      </button>
      {open && (
        <div className="mt-3 bg-slate-800/40 border border-slate-700/30 rounded-xl p-4 space-y-3">
          {steps.map((s, i) => (
            <div key={i} className="flex gap-3">
              <span className="shrink-0 w-5 h-5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-400 text-xs flex items-center justify-center font-bold mt-0.5">
                {i+1}
              </span>
              <p className="text-slate-400 text-sm leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Build Progression Tab ────────────────────────────────────────────────────

function BuildTab({ keyStr, builtProg, expandPass, setExpandPass, onAdd, onSuggest, onLoad, onReset }: {
  keyStr: string
  builtProg: number[]
  expandPass: number | null
  setExpandPass: (n: number | null) => void
  onAdd: (di: number) => void
  onSuggest: () => void
  onLoad: (degrees: number[]) => void
  onReset: () => void
}) {
  const [showTemplates, setShowTemplates] = useState(false)
  const [copied, setCopied]               = useState(false)
  const lastDi = builtProg.length > 0 ? builtProg[builtProg.length - 1] : null
  const lastFn = lastDi !== null ? DEGREES[lastDi].fn : null

  const copyProgression = () => {
    const degrees = builtProg.map(di => DEGREES[di].degree).join(" – ")
    const chords  = builtProg.map(di => shortChordName(keyStr, di)).join(" – ")
    navigator.clipboard.writeText(`${degrees} in ${getRoot(keyStr)} major: ${chords}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-5">

      <HowToUse steps={[
        { text: "Start by picking a Tonic chord (I, iii, or vi) — the palette dims non-tonic options to guide you. I and vi are most common starting points." },
        { text: "After each chord the palette highlights the suggested next function. The hint text explains why — follow it or break the rule for tension." },
        { text: "Hit 'Suggest' to let the app pick a harmonically appropriate next chord for you, weighted by tonal function logic." },
        { text: "Tap '↝' between any two chips in the progression to reveal passing chord options for that transition." },
        { text: "The 'Resolves to' buttons in the info panel are one-tap shortcuts — click any to immediately add the next chord in the natural resolution path." },
        { text: "The fundamental arc: Tonic → Subdominant → Dominant → Tonic (e.g. C → F → G → C). Every progression is a variation of this motion." },
      ]} />

      {/* Templates */}
      <div className="bg-slate-800/50 border border-slate-700/40 rounded-2xl overflow-hidden">
        <button
          onClick={() => setShowTemplates(o => !o)}
          className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-slate-700/30 transition-colors">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-sm font-medium">Start from a template</span>
            <span className="text-slate-600 text-xs">{PROG_TEMPLATES.length} common progressions</span>
          </div>
          <span className={`text-slate-500 transition-transform duration-200 ${showTemplates ? "rotate-90" : ""}`}>›</span>
        </button>
        {showTemplates && (
          <div className="px-5 pb-5 border-t border-slate-700/40 pt-4 grid sm:grid-cols-2 gap-2">
            {PROG_TEMPLATES.map((t, idx) => (
              <button key={idx} onClick={() => { onLoad(t.degrees); setShowTemplates(false) }}
                className="text-left rounded-xl border border-slate-700/50 bg-slate-800/60 hover:bg-slate-700/60 p-3 transition-all group">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="text-white text-sm font-semibold group-hover:text-purple-300 transition-colors">{t.name}</span>
                  <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/25 text-purple-400">{t.genre}</span>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed mb-1.5">{t.description}</p>
                <div className="flex flex-wrap gap-1">
                  {t.degrees.map((di, i) => {
                    const s = FN_STYLE[DEGREES[di].fn]
                    return (
                      <span key={i} className={`text-xs px-1.5 py-0.5 rounded border ${s.bg} ${s.border} ${s.text} font-mono`}>
                        {DEGREES[di].degree}
                      </span>
                    )
                  })}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Chord palette */}
      <div className="bg-slate-800/50 border border-slate-700/40 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white font-semibold text-sm mb-0.5">
              {builtProg.length === 0 ? "Pick a starting chord" : "Add the next chord"}
            </p>
            {builtProg.length === 0 ? (
              <p className="text-slate-500 text-xs">
                Start on <span className="text-emerald-400">Tonic</span> (I, iii, vi) to establish home — I and vi are most common
              </p>
            ) : lastFn === "tonic" ? (
              <p className="text-slate-500 text-xs">
                From <span className="text-emerald-400">Tonic</span> → move to <span className="text-sky-400">Subdominant</span> (ii, IV) to start leaving home, or <span className="text-amber-400">Dominant</span> (V) to build tension
              </p>
            ) : lastFn === "subdominant" ? (
              <p className="text-slate-500 text-xs">
                From <span className="text-sky-400">Subdominant</span> → move to <span className="text-amber-400">Dominant</span> (V) to build tension before resolving
              </p>
            ) : (
              <p className="text-slate-500 text-xs">
                From <span className="text-amber-400">Dominant</span> → resolve to <span className="text-emerald-400">Tonic</span> (I, vi) to land home, or delay with another Dominant
              </p>
            )}
          </div>
          <button onClick={onSuggest}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 transition-all shrink-0 ml-4">
            ✦ Suggest
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {DEGREES.map((d, i) => {
            const s = FN_STYLE[d.fn]
            const isLast = lastDi === i && builtProg.length > 0
            const suggestedFn: TonalFn | null =
              builtProg.length === 0 ? "tonic"
              : lastFn === "tonic" ? null
              : lastFn === "subdominant" ? "dominant"
              : "tonic"
            const isSuggested = suggestedFn === null ? true : d.fn === suggestedFn
            return (
              <button key={i} onClick={() => onAdd(i)}
                className={`flex-1 min-w-[72px] rounded-xl border py-3 px-2 text-center transition-all active:scale-95 ${
                  isLast
                    ? `${s.bg} ${s.border} shadow-md`
                    : isSuggested
                    ? `bg-slate-900/60 ${s.border} opacity-100`
                    : `bg-slate-900/60 ${s.border} opacity-25 hover:opacity-70`
                }`}>
                <div className={`text-xs font-bold ${s.text} mb-0.5`}>{d.degree}</div>
                <div className="text-white font-bold">{shortChordName(keyStr, i)}</div>
                <div className={`w-1.5 h-1.5 rounded-full ${s.dot} mx-auto mt-1.5`} />
              </button>
            )
          })}
        </div>

        <div className="flex gap-4 mt-3 pt-3 border-t border-slate-700/40">
          {(["tonic", "subdominant", "dominant"] as TonalFn[]).map(fn => (
            <div key={fn} className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${FN_STYLE[fn].dot}`} />
              <span className={`text-xs ${FN_STYLE[fn].text}`}>{FN_STYLE[fn].label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Built progression */}
      {builtProg.length === 0 ? (
        <div className="bg-slate-800/20 border border-slate-700/20 rounded-2xl p-10 text-center">
          <p className="text-slate-500 mb-2">Pick a chord above or load a template to start building.</p>
          <p className="text-slate-700 text-xs">
            "Suggest" picks chords using tonal function logic — dominant resolves to tonic, tonic moves to subdominant.
          </p>
        </div>
      ) : (
        <div className="bg-slate-800/50 border border-slate-700/40 rounded-2xl p-5 space-y-5">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-xs uppercase tracking-widest">
                {getRoot(keyStr)} major — {builtProg.length} chord{builtProg.length !== 1 ? "s" : ""}
              </p>
              <p className="text-slate-600 text-xs mt-0.5 font-mono">
                {builtProg.map(di => DEGREES[di].degree).join(" – ")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {builtProg.length >= 2 && (
                <button onClick={copyProgression}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                    copied
                      ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                      : "bg-slate-700 border-slate-600 text-slate-400 hover:text-slate-200 hover:border-slate-500"
                  }`}>
                  {copied ? "✓ Copied" : "Copy"}
                </button>
              )}
              <button onClick={onReset} className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
                ↺ Reset
              </button>
            </div>
          </div>

          {/* Progression chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            {builtProg.map((di, step) => {
              const d = DEGREES[di]
              const s = FN_STYLE[d.fn]
              const isExpanded = expandPass === step
              return (
                <div key={step} className="flex items-center gap-1.5">
                  {step > 0 && (
                    <button
                      onClick={() => setExpandPass(isExpanded ? null : step)}
                      className={`px-2 py-1 rounded-lg text-xs border transition-all ${
                        isExpanded
                          ? "bg-purple-600/25 border-purple-500/30 text-purple-300"
                          : "bg-slate-800 border-slate-700/50 text-slate-600 hover:text-slate-300 hover:border-slate-600"
                      }`}>
                      {isExpanded ? "▾" : "↝"}
                    </button>
                  )}
                  <div className={`px-3 py-2 rounded-xl border ${s.bg} ${s.border} text-center min-w-[56px]`}>
                    <div className={`text-sm font-bold ${s.text}`}>{shortChordName(keyStr, di)}</div>
                    <div className="text-slate-600 text-xs">{d.degree}</div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Passing chord panel */}
          {expandPass !== null && expandPass < builtProg.length && (
            <div className="border border-slate-700/40 rounded-xl p-4 bg-slate-900/50">
              <p className="text-slate-500 text-xs uppercase tracking-wider mb-3">
                Passing chords → {shortChordName(keyStr, builtProg[expandPass])}
              </p>
              <div className="space-y-2">
                {getApproaches(keyStr, builtProg[expandPass]).slice(0, 3).map((a, pi) => (
                  <div key={pi} className={`rounded-lg border px-3 py-2.5 flex items-start gap-3 ${a.bg} ${a.border}`}>
                    <span className={`shrink-0 text-xs font-bold px-1.5 py-0.5 rounded border ${a.bg} ${a.border} ${a.color} mt-0.5`}>
                      {a.type}
                    </span>
                    <div>
                      <span className={`text-sm font-mono font-bold ${a.color}`}>{a.chord}</span>
                      <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{a.why.split('.')[0]}.</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Last chord info */}
          {lastDi !== null && (
            <div className={`rounded-xl border p-4 ${FN_STYLE[DEGREES[lastDi].fn].bg} ${FN_STYLE[DEGREES[lastDi].fn].border}`}>
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <span className={`text-lg font-bold ${FN_STYLE[DEGREES[lastDi].fn].text}`}>
                  {fullChordName(keyStr, lastDi)}
                </span>
                <span className="text-slate-500 text-xs">
                  {DEGREES[lastDi].degree} — {FN_STYLE[DEGREES[lastDi].fn].label}
                </span>
                <span className="text-slate-600 text-xs">
                  play: {chordRoot(keyStr, DEGREES[lastDi].off)} {DEGREES[lastDi].scale}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-slate-600 text-xs">Resolves to:</span>
                {DEGREES[lastDi].resolves.map(ri => {
                  const rs = FN_STYLE[DEGREES[ri].fn]
                  return (
                    <button key={ri} onClick={() => onAdd(ri)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${rs.bg} ${rs.border} ${rs.text} hover:opacity-80`}>
                      {shortChordName(keyStr, ri)}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Chord diagram */}
          {lastDi !== null && (
            <ChordViewer key={`${keyStr}-${builtProg.length}-${lastDi}`} keyStr={keyStr} di={lastDi} />
          )}

        </div>
      )}
    </div>
  )
}
