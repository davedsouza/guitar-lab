"use client"

import { useState } from "react"
import Link from "next/link"

// ─── Types ────────────────────────────────────────────────────────────────────

interface NeckDot {
  s: number      // string: 0=E(low), 1=A, 2=D, 3=G(high)
  f: number      // fret offset from rootFret (negative = before root)
  root: boolean
}

// ─── Bass Neck Diagram (SVG) ──────────────────────────────────────────────────
// before/after control how many frets before/after root to show.
// Dot at f=0 always appears under the rootFret label.

function BassNeckDiagram({
  dots, rootFret = 5, before = 1, after = 4,
}: {
  dots: NeckDot[]; rootFret?: number; before?: number; after?: number
}) {
  const FRET_W = 44
  const STR_GAP = 32
  const SX = 28
  const SY = 28
  const COLS = before + after + 1
  const W = SX + COLS * FRET_W + 8
  const H = SY + 3 * STR_GAP + 24
  const STRING_LABELS = ["G", "D", "A", "E"]

  // Center dot in its fret cell: cell index = fOffset + before
  const dotX = (f: number) => SX + (f + before) * FRET_W + FRET_W / 2
  const dotY = (sIdx: number) => SY + (3 - sIdx) * STR_GAP

  return (
    <div className="overflow-x-auto">
      <svg width={W} height={H} className="block">
        {/* Fret numbers */}
        {Array.from({ length: COLS }, (_, col) => (
          <text key={col} x={SX + col * FRET_W + FRET_W / 2} y={17}
            textAnchor="middle" fontSize={11} fill="rgba(167,139,250,0.8)">
            {rootFret - before + col}
          </text>
        ))}

        {/* Fret lines */}
        {Array.from({ length: COLS + 1 }, (_, i) => (
          <line key={i} x1={SX + i * FRET_W} y1={SY} x2={SX + i * FRET_W} y2={SY + 3 * STR_GAP}
            stroke="rgba(167,139,250,0.3)" strokeWidth={i === 0 && rootFret - before <= 0 ? 4 : 1} />
        ))}

        {/* Strings */}
        {STRING_LABELS.map((label, di) => {
          const y = SY + di * STR_GAP
          return (
            <g key={label}>
              <text x={SX - 6} y={y + 4} textAnchor="end" fontSize={11}
                fill="rgba(167,139,250,0.8)" fontWeight="bold">{label}</text>
              <line x1={SX} y1={y} x2={SX + COLS * FRET_W} y2={y}
                stroke="rgba(167,139,250,0.5)" strokeWidth={1 + di * 0.5} />
            </g>
          )
        })}

        {/* Dots */}
        {dots.map((dot, i) => {
          if (dot.f < -before || dot.f > after) return null
          const x = dotX(dot.f)
          const y = dotY(dot.s)
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={12}
                fill={dot.root ? "#f59e0b" : "#7c3aed"}
                stroke={dot.root ? "#fbbf24" : "#a78bfa"} strokeWidth={1.5} />
              <text x={x} y={y + 4} textAnchor="middle" fontSize={10} fontWeight="bold" fill="white">
                {dot.root ? "R" : "●"}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

// ─── Full Bass Neck (12-fret, interactive) ────────────────────────────────────

const CHROMATIC = ["E","F","F#","G","G#","A","A#","B","C","C#","D","D#"]
const OPEN_NOTES = ["E","A","D","G"] // index 0=E(low)..3=G

function noteAt(stringIdx: number, fret: number): string {
  const base = CHROMATIC.indexOf(OPEN_NOTES[stringIdx])
  return CHROMATIC[(base + fret) % 12]
}

function FullBassNeck({ highlight }: { highlight: string | null }) {
  const FRET_W = 34
  const STR_GAP = 30
  const SX = 32
  const SY = 24
  const FRETS = 12
  const W = SX + FRETS * FRET_W + 8
  const H = SY + 3 * STR_GAP + 22
  const DISPLAY = ["G", "D", "A", "E"]
  const INLAYS = [3, 5, 7, 9, 12]

  return (
    <div className="overflow-x-auto">
      <svg width={W} height={H} className="block">
        {/* Fret numbers */}
        {Array.from({ length: FRETS }, (_, f) => (
          <text key={f} x={SX + (f + 0.5) * FRET_W} y={16}
            textAnchor="middle" fontSize={9} fill="rgba(167,139,250,0.7)">{f + 1}</text>
        ))}

        {/* Nut */}
        <line x1={SX} y1={SY} x2={SX} y2={SY + 3 * STR_GAP} stroke="white" strokeWidth={3} />

        {/* Fret lines */}
        {Array.from({ length: FRETS }, (_, f) => (
          <line key={f} x1={SX + (f + 1) * FRET_W} y1={SY} x2={SX + (f + 1) * FRET_W}
            y2={SY + 3 * STR_GAP} stroke="rgba(167,139,250,0.22)" strokeWidth={1} />
        ))}

        {/* Inlay dots */}
        {INLAYS.map(f => {
          const x = SX + (f - 0.5) * FRET_W
          const mid = SY + 1.5 * STR_GAP
          return f === 12 ? (
            <g key={f}>
              <circle cx={x} cy={SY + 0.7 * STR_GAP} r={3.5} fill="rgba(167,139,250,0.18)" />
              <circle cx={x} cy={SY + 2.3 * STR_GAP} r={3.5} fill="rgba(167,139,250,0.18)" />
            </g>
          ) : (
            <circle key={f} cx={x} cy={mid} r={3.5} fill="rgba(167,139,250,0.18)" />
          )
        })}

        {/* Strings */}
        {DISPLAY.map((label, di) => {
          const sIdx = 3 - di
          const y = SY + di * STR_GAP
          return (
            <g key={label}>
              <text x={SX - 5} y={y + 4} textAnchor="end" fontSize={10}
                fill="rgba(167,139,250,0.8)" fontWeight="bold">{label}</text>
              <line x1={SX} y1={y} x2={SX + FRETS * FRET_W} y2={y}
                stroke="rgba(167,139,250,0.45)" strokeWidth={1 + di * 0.45} />

              {/* Note dots for frets 1–12 */}
              {Array.from({ length: FRETS }, (_, fi) => {
                const fret = fi + 1
                const note = noteAt(sIdx, fret)
                const x = SX + (fi + 0.5) * FRET_W
                if (!highlight) {
                  return (
                    <text key={fret} x={x} y={y + 3} textAnchor="middle"
                      fontSize={7} fill="rgba(167,139,250,0.18)">{note}</text>
                  )
                }
                if (note !== highlight) return null
                return (
                  <g key={fret}>
                    <circle cx={x} cy={y} r={11} fill="#f59e0b" stroke="#fbbf24" strokeWidth={1.5} />
                    <text x={x} y={y + 4} textAnchor="middle"
                      fontSize={9} fontWeight="bold" fill="black">{note}</text>
                  </g>
                )
              })}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

// ─── Note Grid (table for reference) ─────────────────────────────────────────

function BassNoteGrid() {
  const STRINGS = [
    { label: "G", sIdx: 3 },
    { label: "D", sIdx: 2 },
    { label: "A", sIdx: 1 },
    { label: "E", sIdx: 0 },
  ]
  const LANDMARK = [0, 5, 7, 12]
  return (
    <div className="overflow-x-auto">
      <table className="text-xs border-collapse min-w-max">
        <thead>
          <tr>
            <th className="text-purple-400 text-right pr-3 py-1 font-semibold w-8">str</th>
            {Array.from({ length: 13 }, (_, i) => (
              <th key={i} className={`w-10 text-center py-1 font-semibold ${
                LANDMARK.includes(i) ? "text-amber-400" : "text-purple-500"
              }`}>{i}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {STRINGS.map(({ label, sIdx }) => (
            <tr key={label}>
              <td className="text-purple-300 text-right pr-3 py-0.5 font-bold">{label}</td>
              {Array.from({ length: 13 }, (_, fret) => {
                const note = noteAt(sIdx, fret)
                const isLandmark = LANDMARK.includes(fret)
                const isSharp = note.includes("#")
                return (
                  <td key={fret} className={`text-center py-1.5 rounded-sm ${
                    isLandmark
                      ? "bg-amber-500/20 text-amber-200 font-bold"
                      : isSharp
                      ? "bg-white/5 text-purple-400"
                      : "bg-white/10 text-white"
                  }`}>{note}</td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Shared UI ────────────────────────────────────────────────────────────────

function TipBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-amber-200 text-sm">
      <span className="font-semibold text-amber-300">Pro tip: </span>{children}
    </div>
  )
}

function TabBlock({ code, label }: { code: string; label?: string }) {
  return (
    <div>
      {label && <p className="text-purple-400 text-xs uppercase tracking-wider mb-2 font-semibold">{label}</p>}
      <pre className="bg-slate-900/80 border border-white/10 rounded-xl p-4 text-green-300 text-sm font-mono overflow-x-auto leading-relaxed whitespace-pre">
        {code}
      </pre>
    </div>
  )
}

// ─── Scale Data ───────────────────────────────────────────────────────────────

const BASS_SCALES = [
  {
    name: "Pentatonic Minor",
    intervals: "1  ♭3  4  5  ♭7",
    description: "Five notes — the most-used bass scale on the planet. Works over minor and major chords alike and fits virtually any genre.",
    feel: "Funky & versatile",
    usedIn: "Rock, funk, blues, jam",
    character: "Two notes per string in a tight 'box'. Start here — get this solid before learning anything else.",
    dots: [
      { s: 0, f: 0, root: true  }, { s: 0, f: 3, root: false },
      { s: 1, f: 0, root: false }, { s: 1, f: 2, root: false },
      { s: 2, f: 0, root: false }, { s: 2, f: 2, root: true  },
      { s: 3, f: 0, root: false }, { s: 3, f: 2, root: false },
    ] as NeckDot[],
    tab: `G|--5--7--|
D|--5--7--|
A|--5--7--|
E|--5--8--|
   (key of A — slide the whole shape to change key)`,
    tips: [
      "Learn the E and A strings first — that covers 90% of bass playing",
      "Amber R dots are your home base — land on them to feel resolved",
      "Transpose: fret 3 = G minor, fret 7 = B minor, fret 10 = D minor",
    ],
  },
  {
    name: "Natural Minor",
    intervals: "1  2  ♭3  4  5  ♭6  ♭7",
    description: "Seven notes, dark character. The foundation of rock and metal bass — more notes means more melodic colour.",
    feel: "Dark & powerful",
    usedIn: "Rock, metal, R&B, soul",
    character: "Three notes on E and A strings, two on D and G. More expressive than pentatonic once you have the box memorised.",
    dots: [
      { s: 0, f: 0, root: true  }, { s: 0, f: 2, root: false }, { s: 0, f: 3, root: false },
      { s: 1, f: 0, root: false }, { s: 1, f: 2, root: false }, { s: 1, f: 3, root: false },
      { s: 2, f: 0, root: false }, { s: 2, f: 2, root: true  },
      { s: 3, f: 0, root: false }, { s: 3, f: 2, root: false },
    ] as NeckDot[],
    tab: `G|--5--7--|
D|--5--7--|
A|--5--7--8--|
E|--5--7--8--|`,
    tips: [
      "The ♭3 (C when root is A) makes it sound 'minor' — lean on it for emotional weight",
      "Natural minor contains pentatonic minor — 2nd and ♭6 are the two extra notes",
      "Great for connecting root notes with chromatic movement across chord changes",
    ],
  },
  {
    name: "Major",
    intervals: "1  2  3  4  5  6  7",
    description: "Bright, resolved, complete. Essential for pop, country, and gospel bass where the music lifts rather than darkens.",
    feel: "Bright & uplifting",
    usedIn: "Pop, country, gospel, Latin",
    character: "The 3rd on A string sits one fret below rootFret — gives the major scale a distinctive fingering feel.",
    dots: [
      { s: 0, f: 0, root: true  }, { s: 0, f: 2, root: false },
      { s: 1, f:-1, root: false }, { s: 1, f: 0, root: false }, { s: 1, f: 2, root: false },
      { s: 2, f:-1, root: false }, { s: 2, f: 1, root: false }, { s: 2, f: 2, root: true  },
      { s: 3, f:-1, root: false }, { s: 3, f: 1, root: false },
    ] as NeckDot[],
    tab: `G|--4--6--|
D|--4--6--7--|
A|--4--5--7--|
E|--5--7--|`,
    tips: [
      "The 3rd (C# in A) is what makes it 'major' — that bright character lives there",
      "Root → 2 → 3 → 5 is the most-used major bass fill in pop and country",
      "The major 7th (G# on D string) creates a leading tone that naturally resolves up to root",
    ],
  },
  {
    name: "Pentatonic Major",
    intervals: "1  2  3  5  6",
    description: "Five-note major scale — bright, open, and forgiving. The country and gospel player's best friend.",
    feel: "Sunny & open",
    usedIn: "Country, pop, gospel, funk",
    character: "Same shape as pentatonic minor but rooted 3 frets higher. Learn both to get double the scales from one fingering.",
    dots: [
      { s: 0, f: 0, root: true  }, { s: 0, f: 2, root: false },
      { s: 1, f:-1, root: false }, { s: 1, f: 2, root: false },
      { s: 2, f:-1, root: false }, { s: 2, f: 2, root: true  },
      { s: 3, f:-1, root: false }, { s: 3, f: 1, root: false },
    ] as NeckDot[],
    tab: `G|--4--6--|
D|--4-----7--|
A|--4-----7--|
E|--5--7--|`,
    tips: [
      "A major pentatonic uses the same shape as F# minor pentatonic — one shape, two keys",
      "Root → 3rd → 5th → 6th is the classic country walk-up lick",
      "Works over major and dominant 7th chords — very forgiving to improvise with",
    ],
  },
  {
    name: "Blues",
    intervals: "1  ♭3  4  ♭5  5  ♭7",
    description: "Pentatonic minor plus the ♭5 'blue note'. That one extra note gives an instantly gritty, expressive flavour.",
    feel: "Gritty & expressive",
    usedIn: "Blues, rock, soul, shuffle",
    character: "The ♭5 sits between the 4th and 5th on the A string. Use it as a passing note — never sit on it.",
    dots: [
      { s: 0, f: 0, root: true  }, { s: 0, f: 3, root: false },
      { s: 1, f: 0, root: false }, { s: 1, f: 1, root: false }, { s: 1, f: 2, root: false },
      { s: 2, f: 0, root: false }, { s: 2, f: 2, root: true  },
      { s: 3, f: 0, root: false }, { s: 3, f: 2, root: false },
    ] as NeckDot[],
    tab: `G|--5--7--|
D|--5--7--|
A|--5--6--7--|  ← fret 6 = E♭ (blue note)
E|--5--8--|`,
    tips: [
      "Classic lick: 4 → ♭5 → 5 (frets 5→6→7 on A string) — hammer or slide through it",
      "The blue note sits between two strong tones — pass through it, never land on it",
      "Start with pentatonic minor, then add this one note for an instant blues upgrade",
    ],
  },
  {
    name: "Dorian",
    intervals: "1  2  ♭3  4  5  6  ♭7",
    description: "Minor with a raised 6th — soulful, sophisticated, and used everywhere in funk and jazz. James Jamerson's signature sound.",
    feel: "Funky & soulful",
    usedIn: "Funk, jazz, soul, R&B",
    character: "Natural minor + raised 6th. That one note change flips dark and brooding into cool and funky.",
    dots: [
      { s: 0, f: 0, root: true  }, { s: 0, f: 2, root: false }, { s: 0, f: 3, root: false },
      { s: 1, f: 0, root: false }, { s: 1, f: 2, root: false }, { s: 1, f: 4, root: false },
      { s: 2, f: 0, root: false }, { s: 2, f: 2, root: true  },
      { s: 3, f: 0, root: false }, { s: 3, f: 2, root: false },
    ] as NeckDot[],
    tab: `G|--5--7--|
D|--5--7--|
A|--5--7--9--|  ← fret 9 = F# (raised 6th, the Dorian note)
E|--5--7--8--|`,
    tips: [
      "Dorian = natural minor with the 6th raised one fret — just one note changes everything",
      "The raised 6th (fret 9 on A string) is the character note — reach for it for instant soul",
      "Descend: ♭3 → 2 → root is a James Jamerson signature — smooth and impossibly musical",
    ],
  },
]

// ─── Groove Patterns ──────────────────────────────────────────────────────────

const GROOVE_PATTERNS = [
  {
    name: "Root Only", style: "Foundation", emoji: "⚓",
    description: "The simplest bass line — hit the root note and lock with the kick drum. Your job is to make the band feel like one organism. Less is almost always more.",
    pro: "Mirror the kick drum's rhythm exactly. The spaces between your notes are just as important as the notes themselves.",
    tab: `G|-------------------------------|
D|-------------------------------|
A|---5-----------5---------------|
E|-------------------3-----------|`,
    famous: "Classic in country, simple rock — any situation where clarity matters most",
  },
  {
    name: "Root–Fifth", style: "Rock", emoji: "🎸",
    description: "Add the 5th above the root. This is the essential rock bass pattern — it adds harmonic motion without overcrowding the song.",
    pro: "The 5th is always in the same relative position: 2 frets higher on the next thinner string. Memorise this relationship.",
    tab: `G|-------------------------------|
D|---7--7--------9--9------------|
A|---5--5--5--5--7--7--5--5------|
E|-------------------------------|`,
    famous: "My Generation (The Who), Come As You Are (Nirvana), Blitzkrieg Bop (Ramones)",
  },
  {
    name: "Root–Octave", style: "Rock / Funk", emoji: "🚀",
    description: "Jump from the root to its octave. Creates a punchy, high-energy feel. The octave is always 2 strings up and 2 frets higher.",
    pro: "Root on E string → octave on D string (2 frets higher). Root on A string → octave on G string (2 frets higher). Same rule always.",
    tab: `G|---7-----------9---------------|
D|-------------------------------|
A|---5--5--5--5--7--7--5--5------|
E|-------------------------------|`,
    famous: "Good Times (Chic), Higher Ground (RHCP), Brick House (Commodores)",
  },
  {
    name: "Funk 16ths", style: "Funk", emoji: "🕺",
    description: "Syncopated 16th-note groove with ghost notes (muted touches between the real notes). The 'x' marks are light, percussive touches — not full notes.",
    pro: "Keep your plucking hand moving in a constant 16th-note pulse. Only some strokes produce full notes — the rest are ghost touches.",
    tab: `G|-------------------------------|
D|-------------------------------|
A|---5-x-5--5x5--7-x-7--5x5-----|
E|-------------------------------|
  x = ghost note (muted pluck)`,
    famous: "Superstition (Stevie Wonder), Get Up (James Brown), Sir Duke (Stevie Wonder)",
  },
  {
    name: "Reggae Drop", style: "Reggae", emoji: "🏝️",
    description: "Bass hits after beat 1 — on the 'and' of 2 or beat 3. Laid-back, syncopated, and sparse. The opposite of what your instinct says to do.",
    pro: "Leave space. Don't fill every beat. In reggae, the absence of bass on beat 1 IS the feel — resist the urge to anchor every bar.",
    tab: `G|-------------------------------|
D|-------------------------------|
A|-----------5-----------7-------|
E|---3-----------3---------------|`,
    famous: "No Woman No Cry, Red Red Wine, Pressure Drop",
  },
  {
    name: "Walking Bass", style: "Jazz / Blues", emoji: "🚶",
    description: "Four quarter notes per bar, stepping smoothly toward the root of the next chord. Uses scale tones and chromatic approaches to 'walk' the changes.",
    pro: "Beat 1 of each bar = the root of that chord. Beats 2, 3, 4 approach the next root — any note that moves smoothly there works.",
    tab: `G|-------------------------------|
D|---7--9------------------------|
A|---5-----7--5--3--5------------|
E|-------------------------------|`,
    famous: "Every jazz standard, 12-bar blues, any swing or shuffle tune",
  },
]

// ─── Techniques ───────────────────────────────────────────────────────────────

const TECHNIQUES = [
  {
    name: "Two-Finger Plucking", icon: "👆", difficulty: "Beginner" as const,
    description: "Alternate index (i) and middle (m) fingers for consistent tone and speed. The fundamental electric bass technique used by most professional players.",
    steps: [
      "Anchor your thumb on the pickup or the E string when playing on thinner strings",
      "Pluck with the side of your fingertip — not the pad or the nail",
      "Alternate index → middle → index → middle (i-m-i-m) without breaking the rhythm",
      "After plucking, let your finger follow through and rest lightly on the next lower string",
      "Practice slow with a metronome — evenness of tone between fingers matters more than speed",
    ],
    tip: "Record yourself and listen back. One finger almost always sounds louder at first. Identify which one and give it focused attention until they're equal.",
    tabExample: undefined,
  },
  {
    name: "Pick Technique", icon: "⬛", difficulty: "Beginner" as const,
    description: "A plectrum gives a brighter, more defined attack. Favoured in rock, punk, and metal — also produces cleaner, punchier results in the studio.",
    steps: [
      "Hold the pick between your thumb and the side of your index finger — loose grip, not tight",
      "Angle the pick slightly to the string (15-30°) to reduce click and drag",
      "Use downstrokes for a heavy, consistent attack when starting out",
      "Add upstrokes as your speed increases — alternate down-up for fast passages",
      "Palm-mute by resting your picking-hand edge near the bridge for a tight, defined tone",
    ],
    tip: "Use heavy picks (1mm+). Bass strings need more resistance — thin guitar picks sound weak and snap constantly.",
    tabExample: undefined,
  },
  {
    name: "String Muting", icon: "🤫", difficulty: "Beginner" as const,
    description: "Clean bass means constant muting of strings you're not playing. Both hands are always active — one plays, both mute.",
    steps: [
      "Fretting hand: lay unused fingers lightly across strings above the string you're fretting",
      "Plucking hand thumb: after plucking a string, move your thumb to mute the string you just left",
      "When releasing a fretted note, let the finger stay in contact but release pressure",
      "Moving from a lower string to a higher one — use your fretting hand to mute the lower as you leave it",
    ],
    tip: "Muting is the difference between muddy bass and defined bass. It's a constant, active process — never stop doing it.",
    tabExample: undefined,
  },
  {
    name: "Hammer-Ons & Pull-Offs", icon: "🔨", difficulty: "Intermediate" as const,
    description: "Sound notes without plucking — hammer on with your fretting finger, or pull off to a lower fretted note. Adds legato smoothness to bass lines.",
    steps: [
      "Hammer-on: pluck the lower note, then snap your next finger firmly onto the higher fret",
      "Pull-off: fret both target notes simultaneously, pluck the higher, then flick your finger sideways off the string onto the lower fret",
      "Bass strings need more force than guitar — use your fingertip, not the pad",
      "The hammered or pulled note must be as loud as the plucked note — exaggerate the snap at first",
    ],
    tip: "On bass, a weak hammer-on just produces a dead thud. Snap hard — subtlety and control come with practice.",
    tabExample: "A|--5h7--7p5--|   h = hammer-on   p = pull-off",
  },
  {
    name: "Slides", icon: "→", difficulty: "Intermediate" as const,
    description: "Connect two notes by sliding your fretting finger along the string. Creates a smooth, vocal quality and hides position shifts on the neck.",
    steps: [
      "Press the starting fret firmly and maintain consistent pressure while sliding",
      "Never lift your finger off the string during the slide — constant contact is essential",
      "Slide into notes from below (approach slide) or slide out (fall) for different expressions",
      "Slide speed changes the feel: slow = singing quality, fast = punchy accented note",
    ],
    tip: "Slides are how bass players invisibly shift positions. A jump sounds accidental — a slide sounds intentional.",
    tabExample: "A|--5/7--9\\7--|   / = slide up   \\ = slide down",
  },
  {
    name: "Slap & Pop", icon: "✊", difficulty: "Advanced" as const,
    description: "Thumb-slap on low strings + finger-pop on high strings. The defining funk bass technique — percussive, bright, and unmistakable.",
    steps: [
      "Slap: rotate your forearm so the bony side of your thumb strikes the E string near the last fret, then immediately bounces back",
      "The thumb must bounce — never rest on the string. Think of a drumstick rebound",
      "Pop: hook your index finger under the G or D string and snap it sharply away from the body",
      "Ghost notes: touch strings lightly with the fretting hand without pressing — creates percussive thuds",
      "Start at 60 BPM, thumb only. Add the pop once the slap is consistent. Combine slowly.",
    ],
    tip: "Slap bass is drum technique on bass strings. Thumb = kick drum. Pop = snare. Think rhythmically first, melodically second.",
    tabExample: `G|-----P---------P--|
D|---T---T-------T--|
A|-T-----------T----|
E|------------------|
  T = thumb slap   P = index pop`,
  },
]

// ─── Arpeggio Data ────────────────────────────────────────────────────────────
// All shown with root on E string at fret 5 (key of A), before=2 after=4 window.
// Dot offsets verified against actual note positions on each string.

const ARPEGGIOS = [
  {
    name: "Major", symbol: "Maj / M",
    intervals: "R  3  5",
    chords: "AMaj, DMaj, GMaj",
    description: "Three notes — bright and stable. Defines any major chord. The first arpeggio every bassist should learn.",
    feel: "Bright & stable",
    usage: "Over any major chord. I and IV chords in a major key. Anywhere the harmony lifts.",
    dots: [
      { s: 0, f: 0, root: true  },  // A = root (E string)
      { s: 1, f:-1, root: false },  // C# = 3rd (A string fret 4)
      { s: 1, f: 2, root: false },  // E = 5th (A string fret 7)
      { s: 2, f: 2, root: true  },  // A = root octave (D string fret 7)
      { s: 3, f: 1, root: false },  // C# = 3rd (G string fret 6)
      { s: 3, f: 4, root: false },  // E = 5th (G string fret 9)
    ] as NeckDot[],
    tab: `G|--6--9--|
D|--7--|
A|--4--7--|
E|--5--|
   R→3→5→R (ascending), key of A`,
    tip: "Root → 3rd → 5th → root is your bread-and-butter bass arpeggio. The 3rd (C# in A) is what makes it major — lead with it for brightness.",
    tabLine: `G|-------------------------------|
D|------7--6--4------------------|
A|--4--5------5--7---------------|
E|--5-----------5--7-------------|
   ascending major arpeggio across 2 octaves`,
  },
  {
    name: "Minor", symbol: "min / m",
    intervals: "R  ♭3  5",
    chords: "Am, Dm, Em",
    description: "Three notes — dark and grounded. The ♭3 (one fret lower than the major 3rd) gives the minor quality.",
    feel: "Dark & grounded",
    usage: "Over any minor chord. ii, iii, vi in a major key. All chords in a natural minor key.",
    dots: [
      { s: 0, f: 0, root: true  },  // A = root
      { s: 1, f:-2, root: false },  // C = ♭3 (A string fret 3)
      { s: 1, f: 2, root: false },  // E = 5th (A string fret 7)
      { s: 2, f: 2, root: true  },  // A = root octave
      { s: 3, f: 0, root: false },  // C = ♭3 (G string fret 5)
      { s: 3, f: 4, root: false },  // E = 5th (G string fret 9)
    ] as NeckDot[],
    tab: `G|--5--9--|
D|--7--|
A|--3--7--|
E|--5--|
   R→♭3→5→R, key of Am`,
    tip: "The ♭3 is 2 frets back on the A string — that stretch is the character of the minor sound. Nail it cleanly.",
    tabLine: `G|-------------------------------|
D|------7--5--3------------------|
A|--3--5------5--7---------------|
E|--5-----------5--7-------------|
   ascending minor arpeggio`,
  },
  {
    name: "Dominant 7", symbol: "7 / dom7",
    intervals: "R  3  5  ♭7",
    chords: "A7, D7, E7",
    description: "Adds the ♭7 above the major triad. Creates tension that wants to resolve. The harmonic engine of blues.",
    feel: "Tense & bluesy",
    usage: "Over dominant 7th chords. I7 in blues, V7 everywhere, any chord that wants to move forward.",
    dots: [
      { s: 0, f: 0, root: true  },  // A = root
      { s: 1, f:-1, root: false },  // C# = 3rd
      { s: 1, f: 2, root: false },  // E = 5th
      { s: 2, f: 0, root: false },  // G = ♭7 (D string fret 5)
      { s: 2, f: 2, root: true  },  // A = root octave
      { s: 3, f: 1, root: false },  // C# = 3rd
      { s: 3, f: 4, root: false },  // E = 5th
    ] as NeckDot[],
    tab: `G|--6--9--|
D|--5--7--|
A|--4--7--|
E|--5--|
   R→3→5→♭7→R, key of A7`,
    tip: "The ♭7 (G when root is A) appears on D string at the SAME fret as the root. That relationship is always identical — memorise it.",
    tabLine: `G|-------------------------------|
D|------7--5--4------------------|
A|--4--5------5--7---------------|
E|--5-----------5--7-------------|
   dominant 7 arpeggio through the chord`,
  },
  {
    name: "Major 7", symbol: "Maj7 / △7",
    intervals: "R  3  5  7",
    chords: "Cmaj7, Fmaj7",
    description: "The natural 7th (one fret below the octave) adds a dreamy, sophisticated colour. The sound of jazz and neo-soul.",
    feel: "Dreamy & lush",
    usage: "Over Imaj7 and IVmaj7 chords in jazz, neo-soul, pop. Avoid over dominant and minor chords.",
    dots: [
      { s: 0, f: 0, root: true  },  // A = root
      { s: 1, f:-1, root: false },  // C# = 3rd
      { s: 1, f: 2, root: false },  // E = 5th
      { s: 2, f: 1, root: false },  // G# = maj7 (D string fret 6)
      { s: 2, f: 2, root: true  },  // A = root octave
      { s: 3, f: 1, root: false },  // C# = 3rd
      { s: 3, f: 4, root: false },  // E = 5th
    ] as NeckDot[],
    tab: `G|--6--9--|
D|--6--7--|
A|--4--7--|
E|--5--|
   R→3→5→△7→R, key of Amaj7`,
    tip: "The major 7th (G# in A, one fret below root octave on D string) has a distinctive leading-tone sound — it pulls upward to the octave root.",
    tabLine: `G|-------------------------------|
D|------7--6--4------------------|
A|--4--5------5--7---------------|
E|--5-----------5--7-------------|
   major 7 arpeggio — note the ♮7 on D string`,
  },
  {
    name: "Minor 7", symbol: "m7 / min7",
    intervals: "R  ♭3  5  ♭7",
    chords: "Am7, Dm7, Em7",
    description: "Minor triad plus the ♭7. The most common 7th chord quality in jazz and R&B. Smooth, dark, and soulful.",
    feel: "Smooth & soulful",
    usage: "ii7, iii7, vi7 in major keys. im7 in minor keys. Everywhere in jazz, funk, and R&B.",
    dots: [
      { s: 0, f: 0, root: true  },  // A = root
      { s: 1, f:-2, root: false },  // C = ♭3 (A string fret 3)
      { s: 1, f: 2, root: false },  // E = 5th
      { s: 2, f: 0, root: false },  // G = ♭7 (D string fret 5)
      { s: 2, f: 2, root: true  },  // A = root octave
      { s: 3, f: 0, root: false },  // C = ♭3 (G string fret 5)
      { s: 3, f: 4, root: false },  // E = 5th
    ] as NeckDot[],
    tab: `G|--5--9--|
D|--5--7--|
A|--3--7--|
E|--5--|
   R→♭3→5→♭7→R, key of Am7`,
    tip: "Min7 = minor + the ♭7 from dom7. The ♭7 always appears on D string at root fret. The ♭3 always stretches 2 frets back on A string.",
    tabLine: `G|-------------------------------|
D|------7--5--3------------------|
A|--3--5------5--7---------------|
E|--5-----------5--7-------------|
   minor 7 arpeggio — darkest of the four`,
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

type MainTab = "basics" | "scales" | "groove" | "techniques" | "fretboard" | "arpeggios" | "blues"
type BasicsSection = "anatomy" | "strings" | "holding" | "tab"
type FretboardSection = "notes" | "octaves" | "finder"
type BluesSection = "form" | "shuffle" | "lines" | "turnaround"

const MAIN_TABS: { id: MainTab; icon: string; label: string }[] = [
  { id: "basics",     icon: "🎸", label: "Basics" },
  { id: "fretboard",  icon: "🗺️", label: "Fretboard" },
  { id: "arpeggios",  icon: "🎵", label: "Arpeggios" },
  { id: "scales",     icon: "🎼", label: "Scales" },
  { id: "groove",     icon: "🥁", label: "Groove" },
  { id: "blues",      icon: "🎷", label: "12-Bar Blues" },
  { id: "techniques", icon: "🤘", label: "Techniques" },
]

const BASICS_SECTIONS: { id: BasicsSection; label: string }[] = [
  { id: "anatomy", label: "Anatomy" },
  { id: "strings", label: "The 4 Strings" },
  { id: "holding", label: "Posture & Hands" },
  { id: "tab",     label: "Reading Bass TAB" },
]

const FRETBOARD_SECTIONS: { id: FretboardSection; label: string }[] = [
  { id: "notes",   label: "Note Names" },
  { id: "octaves", label: "Octave Shapes" },
  { id: "finder",  label: "Root Finder" },
]

const BLUES_SECTIONS: { id: BluesSection; label: string }[] = [
  { id: "form",       label: "The Form" },
  { id: "shuffle",    label: "Shuffle Feel" },
  { id: "lines",      label: "Bass Lines" },
  { id: "turnaround", label: "Turnarounds" },
]

const BASS_PARTS = [
  { name: "Body",      desc: "Solid wood resonator — shape affects balance, comfort, and (slightly) tone." },
  { name: "Neck",      desc: "Longer than guitar (34\" scale). Houses the frets. Can be fretted or fretless." },
  { name: "Headstock", desc: "Holds the 4 tuning pegs — 4-in-line (Fender style) or 2+2 (Music Man style)." },
  { name: "Nut",       desc: "Plastic or bone slot at the top of the neck. Sets string height and spacing." },
  { name: "Frets",     desc: "Metal strips across the neck — each one raises pitch by exactly one semitone." },
  { name: "Pickups",   desc: "Magnetic sensors converting vibration to signal. P-style = punchy, J-style = bright and articulate." },
  { name: "Bridge",    desc: "Anchors strings at the body. Adjustable saddles set intonation and string height." },
  { name: "Controls",  desc: "Volume & tone (passive) or 3-band EQ (active). Active basses need a 9V battery." },
]

const STRING_DATA = [
  { num: 4, note: "E", freq: "41 Hz", border: "border-red-500",    bg: "bg-red-500/10",    dot: "bg-red-500",    desc: "Thickest — the deepest, most powerful note. Root notes of most songs live here." },
  { num: 3, note: "A", freq: "55 Hz", border: "border-orange-500", bg: "bg-orange-500/10", dot: "bg-orange-500", desc: "Second thickest — roots, fifths, and the main body of most bass lines." },
  { num: 2, note: "D", freq: "73 Hz", border: "border-yellow-500", bg: "bg-yellow-500/10", dot: "bg-yellow-500", desc: "Mid string — upper roots, melodic fills, and walking lines." },
  { num: 1, note: "G", freq: "98 Hz", border: "border-green-500",  bg: "bg-green-500/10",  dot: "bg-green-500",  desc: "Thinnest — highest note, used for fills, octave jumps, and solo passages." },
]

const NOTE_BUTTONS = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"]

export default function BassGuitarModule() {
  const [activeTab, setActiveTab]                 = useState<MainTab>("basics")
  const [basicsSection, setBasicsSection]         = useState<BasicsSection>("anatomy")
  const [selectedScale, setSelectedScale]         = useState(0)
  const [selectedGroove, setSelectedGroove]       = useState(0)
  const [selectedTech, setSelectedTech]           = useState(0)
  const [fretboardSection, setFretboardSection]   = useState<FretboardSection>("notes")
  const [selectedNote, setSelectedNote]           = useState<string | null>(null)
  const [selectedArpeggio, setSelectedArpeggio]   = useState(0)
  const [bluesSection, setBluesSection]           = useState<BluesSection>("form")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-5xl">

        {/* Header */}
        <Link href="/" className="text-purple-300 hover:text-purple-200 mb-4 inline-block text-sm">
          ← Back to Home
        </Link>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1">Bass Guitar</h1>
        <p className="text-purple-300 mb-8">Foundation, scales, groove, and technique for the low end</p>

        {/* Main Tab Nav */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
          {MAIN_TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all whitespace-nowrap text-sm ${
                activeTab === tab.id
                  ? "bg-purple-600 text-white scale-105"
                  : "bg-white/10 text-purple-200 hover:bg-white/20"
              }`}>
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ── BASICS ─────────────────────────────────────────────────────────── */}
        {activeTab === "basics" && (
          <div>
            <div className="flex flex-wrap gap-2 mb-6">
              {BASICS_SECTIONS.map(s => (
                <button key={s.id} onClick={() => setBasicsSection(s.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    basicsSection === s.id ? "bg-purple-600 text-white" : "bg-white/10 text-purple-300 hover:bg-white/20"
                  }`}>{s.label}</button>
              ))}
            </div>

            {basicsSection === "anatomy" && (
              <div className="space-y-5">
                <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
                  <h2 className="text-2xl font-bold text-white mb-2">Parts of the Bass</h2>
                  <p className="text-purple-300 text-sm mb-5">Electric bass is similar to guitar but designed for the low end — longer neck, thicker strings, and pickups voiced for fundamental frequencies.</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {BASS_PARTS.map(p => (
                      <div key={p.name} className="bg-white/10 rounded-xl p-4">
                        <div className="text-white font-semibold mb-1">{p.name}</div>
                        <div className="text-purple-200 text-sm">{p.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5">
                  <div className="text-amber-300 font-semibold mb-3">Bass vs Guitar — Key Differences</div>
                  <div className="grid sm:grid-cols-2 gap-y-2 gap-x-4 text-sm">
                    {[
                      ["4 strings (EADG)","Guitar has 6 (EADGBE)"],
                      ["34\" scale length","Guitar ~25.5\""],
                      ["Much thicker strings","Guitar strings are lighter"],
                      ["Usually plays single notes","Guitar plays chords"],
                      ["Locks with the kick drum","Guitar sits in mid/high range"],
                      ["Defines the harmonic root","Guitar fills and embellishes"],
                    ].map(([b,g],i) => (
                      <div key={i} className="flex gap-2 text-amber-100 flex-wrap">
                        <span className="text-amber-400 shrink-0">Bass:</span><span>{b}</span>
                        <span className="text-purple-400 shrink-0">|</span><span className="text-purple-300">{g}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {basicsSection === "strings" && (
              <div className="space-y-5">
                <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
                  <h2 className="text-2xl font-bold text-white mb-2">The 4 Strings</h2>
                  <p className="text-purple-300 text-sm mb-5">Standard tuning: <span className="text-white font-bold">E A D G</span> — thickest (lowest) to thinnest (highest). In TAB the E string sits at the bottom, G at the top.</p>
                  <div className="space-y-3">
                    {STRING_DATA.map(s => (
                      <div key={s.note} className={`border rounded-xl p-4 flex items-start gap-4 ${s.border} ${s.bg}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold text-white shrink-0 ${s.dot}`}>{s.note}</div>
                        <div>
                          <div className="flex gap-3 items-baseline mb-1">
                            <span className="text-white font-semibold">String {s.num}</span>
                            <span className="text-purple-400 text-xs">{s.freq}</span>
                          </div>
                          <div className="text-purple-200 text-sm">{s.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white/10 rounded-2xl p-5 border border-white/20">
                  <h3 className="text-white font-bold mb-3">Mnemonic</h3>
                  <div className="bg-purple-600/20 rounded-xl p-4 text-center text-lg mb-3">
                    <span className="text-white font-bold">E</span><span className="text-purple-300">ddie </span>
                    <span className="text-white font-bold">A</span><span className="text-purple-300">te </span>
                    <span className="text-white font-bold">D</span><span className="text-purple-300">ynamite — </span>
                    <span className="text-white font-bold">G</span><span className="text-purple-300">oodbye Eddie</span>
                  </div>
                  <p className="text-purple-300 text-sm">Read thickest (lowest) to thinnest (highest). In TAB, G sits on top and E on the bottom — the reverse of how you hold the bass.</p>
                </div>
              </div>
            )}

            {basicsSection === "holding" && (
              <div className="space-y-5">
                <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
                  <h2 className="text-2xl font-bold text-white mb-5">Posture & Hand Position</h2>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { title:"Standing", icon:"🧍", tips:["Strap adjusted so bass sits around waist height — higher than guitar","Neck angled upward at about 30-45°, never drooping down","Keep the bass close to your body","Both shoulders relaxed — if one is raised, lower your strap"] },
                      { title:"Fretting Hand", icon:"🤚", tips:["Thumb behind the neck, roughly opposite your middle finger","Press with your fingertip, just behind the fret — not on it","Keep wrist relatively straight — avoid wrapping thumb over the top","One finger per fret: index=1, middle=2, ring=3, pinky=4"] },
                      { title:"Plucking Hand", icon:"👆", tips:["Anchor thumb on the pickup or E string when playing thinner strings","Pluck strings parallel to the body, not outward","Keep plucking fingers slightly curved — not flat or hooked","Rest your forearm on the body, just above the elbow"] },
                    ].map(sec => (
                      <div key={sec.title} className="bg-white/10 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3"><span className="text-2xl">{sec.icon}</span><span className="text-white font-bold">{sec.title}</span></div>
                        <ul className="space-y-2">{sec.tips.map((t,i) => (<li key={i} className="text-purple-200 text-sm flex gap-2"><span className="text-purple-400 shrink-0 mt-0.5">•</span><span>{t}</span></li>))}</ul>
                      </div>
                    ))}
                  </div>
                </div>
                <TipBox>If anything hurts — stop and check your posture. Bass technique should feel natural within a few weeks as muscle memory develops.</TipBox>
              </div>
            )}

            {basicsSection === "tab" && (
              <div className="space-y-5">
                <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
                  <h2 className="text-2xl font-bold text-white mb-2">Reading Bass TAB</h2>
                  <p className="text-purple-300 text-sm mb-5">Bass TAB uses 4 lines, one per string. Numbers show which fret to press. 0 = open string (no fretting).</p>
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      {[
                        { label:"4 lines = 4 strings", desc:"G on top, E on bottom. Thinnest at the top, thickest at the bottom." },
                        { label:"Numbers = fret positions", desc:"0 = open. 5 = press fret 5. Numbers above 12 mean further up the neck." },
                        { label:"Read left to right", desc:"Notes play in time order from left to right, like reading text." },
                        { label:"Stacked numbers = together", desc:"Numbers aligned vertically are played simultaneously." },
                      ].map(item => (
                        <div key={item.label} className="bg-white/10 rounded-xl p-3">
                          <div className="text-white font-semibold text-sm mb-1">{item.label}</div>
                          <div className="text-purple-200 text-sm">{item.desc}</div>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-4">
                      <TabBlock label="Example" code={`G|----------------------|
D|----------------------|
A|--5--5--7--5--7--8----|
E|--3--3----------------|`} />
                      <div className="bg-white/10 rounded-xl p-4">
                        <div className="text-white font-semibold mb-2 text-sm">Common TAB Symbols</div>
                        <div className="font-mono text-sm space-y-1.5">
                          {[["h","hammer-on  (5h7 = fret 5 to 7)"],["p","pull-off   (7p5 = fret 7 to 5)"],["/ ","slide up   (5/7)"],["\\","slide down (7\\5)"],["x","ghost note (muted pluck)"],["~","vibrato"]].map(([s,d]) => (
                            <div key={s} className="flex gap-3"><span className="text-amber-400 w-4 shrink-0">{s}</span><span className="text-purple-200">{d}</span></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <TipBox>TAB shows WHERE to play but not WHEN. Always listen to the original recording to learn the rhythm, then use TAB to find the fret positions.</TipBox>
              </div>
            )}
          </div>
        )}

        {/* ── FRETBOARD ──────────────────────────────────────────────────────── */}
        {activeTab === "fretboard" && (
          <div>
            <div className="mb-5">
              <h2 className="text-xl font-bold text-white mb-1">Fretboard Mastery</h2>
              <p className="text-purple-400 text-sm">Know every note on the neck — the single skill that unlocks everything else in bass playing.</p>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {FRETBOARD_SECTIONS.map(s => (
                <button key={s.id} onClick={() => setFretboardSection(s.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    fretboardSection === s.id ? "bg-purple-600 text-white" : "bg-white/10 text-purple-300 hover:bg-white/20"
                  }`}>{s.label}</button>
              ))}
            </div>

            {fretboardSection === "notes" && (
              <div className="space-y-5">
                <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
                  <h2 className="text-xl font-bold text-white mb-2">Note Names Across the Neck</h2>
                  <p className="text-purple-300 text-sm mb-4">
                    Frets 0–12. <span className="text-amber-300 font-semibold">Amber = landmark frets</span> (open, 5th, 7th, 12th). Fret 12 = same notes as open, one octave higher.
                  </p>
                  <BassNoteGrid />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { fret: "Open", notes: "E / A / D / G", desc: "Your 4 open strings. Free reference points — always in tune with themselves." },
                    { fret: "Fret 5", notes: "A / D / G / C", desc: "Fret 5 of any string plays the same note as the next open string — use this to tune by ear." },
                    { fret: "Fret 7", notes: "B / E / A / D", desc: "The 5th of each open string. Also the same notes as the strings 2 down." },
                    { fret: "Fret 12", notes: "E / A / D / G", desc: "Exact same notes as open strings, one octave higher. The neck repeats from here." },
                  ].map(item => (
                    <div key={item.fret} className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="text-amber-300 font-bold">{item.fret}</span>
                        <span className="text-amber-200 font-mono text-sm">{item.notes}</span>
                      </div>
                      <p className="text-purple-200 text-sm">{item.desc}</p>
                    </div>
                  ))}
                </div>
                <TipBox>
                  Learn the E string first (it&apos;s the most used), then the A string. The D and G strings are always the same notes — just 2 frets higher on 2 thinner strings (the octave shape).
                </TipBox>
              </div>
            )}

            {fretboardSection === "octaves" && (
              <div className="space-y-5">
                <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
                  <h2 className="text-xl font-bold text-white mb-2">The Octave Shape System</h2>
                  <p className="text-purple-300 text-sm mb-5">
                    Knowing one note location unlocks two more instantly. These three relationships are how bass players navigate the neck.
                  </p>
                  <div className="space-y-4">
                    {[
                      {
                        name: "The 2+2 Octave Shape",
                        rule: "2 strings thinner + 2 frets higher = same note, one octave up",
                        icon: "⬆️",
                        color: "border-amber-500 bg-amber-500/10",
                        examples: [
                          "Root on E string fret 5 (A) → octave on D string fret 7 (A, higher)",
                          "Root on A string fret 5 (D) → octave on G string fret 7 (D, higher)",
                        ],
                        tab: `G|--7--|       ← octave (2 strings up, 2 frets right)
D|-----|
A|-----|
E|--5--|       ← root`,
                        note: "This is the single most important shape on bass. Memorise it before anything else.",
                      },
                      {
                        name: "The 12-Fret Octave",
                        rule: "Same string + 12 frets = same note, one octave up",
                        icon: "➡️",
                        color: "border-blue-500 bg-blue-500/10",
                        examples: [
                          "E string open (E) → E string fret 12 (E, one octave higher)",
                          "A string fret 3 (C) → A string fret 15 (C, one octave higher)",
                        ],
                        tab: `E|--0-----------12--|   both = E, one octave apart`,
                        note: "Useful for staying on one string. The whole pattern repeats at fret 12.",
                      },
                      {
                        name: "The 5-Fret Unison",
                        rule: "1 string thinner + 5 frets higher = same note, same octave",
                        icon: "↗️",
                        color: "border-purple-500 bg-purple-500/10",
                        examples: [
                          "E string fret 5 (A) = A string open (A) — same note, different position",
                          "A string fret 5 (D) = D string open (D) — this is how you tune by ear",
                        ],
                        tab: `A|--0--|       ← same note (A) different string
E|--5--|       ← these are identical pitches`,
                        note: "Use this to find the same note in a higher position — also how the 5th-fret tuning method works.",
                      },
                    ].map(shape => (
                      <div key={shape.name} className={`border rounded-2xl p-5 ${shape.color}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{shape.icon}</span>
                          <h3 className="text-white font-bold text-lg">{shape.name}</h3>
                        </div>
                        <div className="bg-white/10 rounded-lg px-4 py-2 mb-3 text-white font-semibold text-sm">{shape.rule}</div>
                        <ul className="mb-3 space-y-1">
                          {shape.examples.map((ex, i) => (
                            <li key={i} className="text-purple-200 text-sm flex gap-2">
                              <span className="text-purple-400 shrink-0">•</span><span>{ex}</span>
                            </li>
                          ))}
                        </ul>
                        <TabBlock code={shape.tab} />
                        <p className="text-purple-300 text-xs mt-3 italic">{shape.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {fretboardSection === "finder" && (
              <div className="space-y-5">
                <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
                  <h2 className="text-xl font-bold text-white mb-2">Root Note Finder</h2>
                  <p className="text-purple-300 text-sm mb-5">
                    Select any note to see every position it appears on the neck (frets 1–12). This is how you find the root for any key — instantly.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {NOTE_BUTTONS.map(note => (
                      <button key={note} onClick={() => setSelectedNote(selectedNote === note ? null : note)}
                        className={`px-3 py-2 rounded-lg text-sm font-bold transition-all min-w-[2.5rem] ${
                          selectedNote === note
                            ? "bg-amber-500 text-black scale-110"
                            : note.includes("#")
                            ? "bg-white/10 text-purple-300 hover:bg-white/20"
                            : "bg-white/15 text-white hover:bg-white/25"
                        }`}>{note}</button>
                    ))}
                    {selectedNote && (
                      <button onClick={() => setSelectedNote(null)} className="px-3 py-2 rounded-lg text-sm text-purple-400 hover:text-white bg-white/5 hover:bg-white/10 transition-all">✕ Clear</button>
                    )}
                  </div>
                  {!selectedNote && (
                    <div className="text-center py-8 text-purple-400 text-sm">Select a note above to highlight all its positions on the neck</div>
                  )}
                  {selectedNote && (
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-black font-bold text-sm">{selectedNote}</div>
                        <p className="text-purple-200 text-sm">
                          All positions of <strong className="text-white">{selectedNote}</strong> on the bass neck (frets 1–12)
                        </p>
                      </div>
                      <FullBassNeck highlight={selectedNote} />
                      <div className="mt-4 bg-slate-900/50 rounded-xl p-4">
                        <div className="text-purple-400 text-xs font-semibold uppercase tracking-wider mb-2">Positions of {selectedNote}</div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                          {(["E","A","D","G"] as const).map((strLabel, di) => {
                            const sIdx = 3 - di
                            const positions = Array.from({ length: 12 }, (_, f) => f + 1).filter(f => noteAt(sIdx, f) === selectedNote)
                            if (positions.length === 0) return null
                            return (
                              <div key={strLabel} className="bg-white/5 rounded-lg p-2">
                                <div className="text-purple-300 font-bold mb-1">{strLabel} string</div>
                                <div className="text-white font-mono">fret {positions.join(", ")}</div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <TipBox>
                  Start by memorising {"{"}A{"}"} on every string — A is E-str fret 5, A-str open, D-str fret 7, G-str fret 2. Then do D, G, C, E, and B. You&apos;ll own the neck in a week.
                </TipBox>
              </div>
            )}
          </div>
        )}

        {/* ── ARPEGGIOS ──────────────────────────────────────────────────────── */}
        {activeTab === "arpeggios" && (
          <div>
            <div className="mb-5">
              <h2 className="text-xl font-bold text-white mb-1">Chord Tones & Arpeggios</h2>
              <p className="text-purple-400 text-sm">The notes inside each chord, played one at a time. Targeting chord tones is what makes bass lines sound harmonic and intentional.</p>
            </div>

            {/* Why chord tones matter */}
            <div className="bg-purple-600/10 border border-purple-500/20 rounded-2xl p-5 mb-6">
              <h3 className="text-white font-bold mb-2">Why This Changes Everything</h3>
              <div className="grid sm:grid-cols-3 gap-3 text-sm">
                {[
                  { title: "Root", desc: "Always safe to land on. Beat 1 of any chord = root. The harmonic anchor.", color: "text-amber-400" },
                  { title: "3rd", desc: "Defines major or minor quality. Land on it to highlight the chord's emotion.", color: "text-blue-400" },
                  { title: "5th", desc: "Neutral and stable. Adds movement without changing the harmony.", color: "text-green-400" },
                  { title: "7th", desc: "Adds sophistication and tension. Pulls toward the next chord's root.", color: "text-purple-400" },
                  { title: "Approach notes", desc: "One fret above or below any chord tone. Walk smoothly between chord changes.", color: "text-pink-400" },
                  { title: "The rule", desc: "Land on chord tones on strong beats. Move freely between them on weak beats.", color: "text-orange-400" },
                ].map(item => (
                  <div key={item.title} className="bg-white/5 rounded-xl p-3">
                    <div className={`font-bold mb-1 ${item.color}`}>{item.title}</div>
                    <div className="text-purple-200">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Arpeggio selector */}
            <div className="flex flex-wrap gap-2 mb-6">
              {ARPEGGIOS.map((a, i) => (
                <button key={a.name} onClick={() => setSelectedArpeggio(i)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    selectedArpeggio === i ? "bg-purple-600 text-white scale-105" : "bg-white/10 text-purple-300 hover:bg-white/20"
                  }`}>{a.name}</button>
              ))}
            </div>

            {(() => {
              const arp = ARPEGGIOS[selectedArpeggio]
              return (
                <div className="space-y-5">
                  <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                      <div>
                        <h2 className="text-2xl font-bold text-white">{arp.name} Arpeggio</h2>
                        <div className="text-purple-400 text-sm mt-0.5 font-mono">{arp.symbol}</div>
                      </div>
                      <span className="px-3 py-1 bg-purple-600/30 text-purple-200 rounded-full text-xs font-semibold">{arp.feel}</span>
                    </div>
                    <p className="text-purple-200 mb-3">{arp.description}</p>
                    <div className="bg-slate-900/50 rounded-lg p-3 font-mono text-lg text-amber-300 tracking-widest mb-2">{arp.intervals}</div>
                    <div className="text-purple-400 text-sm">Chord examples: {arp.chords}</div>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-5">
                    <div className="bg-white/10 rounded-2xl p-5 border border-white/20">
                      <h3 className="text-white font-bold mb-1">Shape (key of A)</h3>
                      <p className="text-purple-400 text-xs mb-4">
                        Root at fret 5 on E string. <span className="text-amber-400">Amber = root (R)</span>. Move the shape to change key.
                      </p>
                      <BassNeckDiagram dots={arp.dots} rootFret={5} before={2} after={4} />
                    </div>
                    <div className="bg-white/10 rounded-2xl p-5 border border-white/20">
                      <h3 className="text-white font-bold mb-1">Notes in Position</h3>
                      <p className="text-purple-400 text-xs mb-3">Ascending through the arpeggio</p>
                      <TabBlock code={arp.tab} />
                      <div className="mt-4 bg-purple-500/10 border border-purple-500/20 rounded-xl p-3 text-purple-200 text-sm">
                        When to use: {arp.usage}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-2xl p-5 border border-white/20">
                    <h3 className="text-white font-bold mb-3">Bass Line Example</h3>
                    <TabBlock label="using chord tones" code={arp.tabLine} />
                  </div>

                  <TipBox>{arp.tip}</TipBox>

                  {/* All arpeggios overview */}
                  <div className="bg-white/10 rounded-2xl p-5 border border-white/20">
                    <h3 className="text-white font-bold mb-4">All Arpeggios — At a Glance</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm min-w-max">
                        <thead>
                          <tr className="text-purple-400 text-xs border-b border-white/10">
                            <th className="text-left py-2 pr-4">Type</th>
                            <th className="text-left py-2 pr-4">Symbol</th>
                            <th className="text-left py-2 pr-4">Intervals</th>
                            <th className="text-left py-2">Feel</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ARPEGGIOS.map((a, i) => (
                            <tr key={a.name} onClick={() => setSelectedArpeggio(i)}
                              className={`border-b border-white/5 cursor-pointer transition-colors ${selectedArpeggio === i ? "bg-purple-600/20" : "hover:bg-white/5"}`}>
                              <td className="py-2 pr-4 text-white font-semibold">{a.name}</td>
                              <td className="py-2 pr-4 text-purple-300 font-mono text-xs">{a.symbol}</td>
                              <td className="py-2 pr-4 text-amber-300 font-mono">{a.intervals}</td>
                              <td className="py-2 text-purple-300">{a.feel}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )
            })()}
          </div>
        )}

        {/* ── SCALES ─────────────────────────────────────────────────────────── */}
        {activeTab === "scales" && (
          <div>
            <div className="flex flex-wrap gap-2 mb-6">
              {BASS_SCALES.map((s, i) => (
                <button key={s.name} onClick={() => setSelectedScale(i)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    selectedScale === i ? "bg-purple-600 text-white scale-105" : "bg-white/10 text-purple-300 hover:bg-white/20"
                  }`}>{s.name}</button>
              ))}
            </div>
            {(() => {
              const scale = BASS_SCALES[selectedScale]
              return (
                <div className="space-y-5">
                  <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                      <h2 className="text-2xl font-bold text-white">{scale.name}</h2>
                      <span className="px-3 py-1 bg-purple-600/30 text-purple-200 rounded-full text-xs font-semibold">{scale.feel}</span>
                    </div>
                    <p className="text-purple-200 mb-3">{scale.description}</p>
                    <div className="bg-slate-900/50 rounded-lg p-3 font-mono text-lg text-amber-300 tracking-widest mb-2">{scale.intervals}</div>
                    <div className="text-purple-400 text-sm">Used in: {scale.usedIn}</div>
                  </div>
                  <div className="grid lg:grid-cols-2 gap-5">
                    <div className="bg-white/10 rounded-2xl p-5 border border-white/20">
                      <h3 className="text-white font-bold mb-1">Neck Diagram</h3>
                      <p className="text-purple-400 text-xs mb-4">Key of A — root at fret 5 on low E string. Move the shape to change key. <span className="text-amber-400">Amber = root (R)</span></p>
                      <BassNeckDiagram dots={scale.dots} rootFret={5} />
                    </div>
                    <div className="bg-white/10 rounded-2xl p-5 border border-white/20">
                      <h3 className="text-white font-bold mb-1">TAB Reference</h3>
                      <p className="text-purple-400 text-xs mb-3">One-position pattern in key of A</p>
                      <TabBlock code={scale.tab} />
                      <div className="mt-4 bg-purple-500/10 border border-purple-500/20 rounded-xl p-3 text-purple-200 text-sm">{scale.character}</div>
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-5 border border-white/20">
                    <h3 className="text-white font-bold mb-3">Application Tips</h3>
                    <ul className="space-y-2">
                      {scale.tips.map((tip, i) => (
                        <li key={i} className="flex gap-3 text-purple-200 text-sm">
                          <span className="text-amber-400 shrink-0 font-bold">{i + 1}.</span><span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            })()}
          </div>
        )}

        {/* ── GROOVE ─────────────────────────────────────────────────────────── */}
        {activeTab === "groove" && (
          <div>
            <div className="mb-5">
              <h2 className="text-xl font-bold text-white mb-1">Groove Patterns</h2>
              <p className="text-purple-400 text-sm">The building blocks of bass lines — from basic root notes to walking jazz lines.</p>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {GROOVE_PATTERNS.map((g, i) => (
                <button key={g.name} onClick={() => setSelectedGroove(i)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    selectedGroove === i ? "bg-purple-600 text-white scale-105" : "bg-white/10 text-purple-300 hover:bg-white/20"
                  }`}><span>{g.emoji}</span><span>{g.name}</span></button>
              ))}
            </div>
            {(() => {
              const groove = GROOVE_PATTERNS[selectedGroove]
              return (
                <div className="space-y-5">
                  <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-4xl">{groove.emoji}</span>
                      <div>
                        <h2 className="text-2xl font-bold text-white">{groove.name}</h2>
                        <span className="text-xs px-2 py-0.5 bg-purple-600/30 text-purple-300 rounded-full">{groove.style}</span>
                      </div>
                    </div>
                    <p className="text-purple-200 mb-5">{groove.description}</p>
                    <TabBlock label="Bass TAB" code={groove.tab} />
                  </div>
                  <TipBox>{groove.pro}</TipBox>
                  <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                    <div className="text-purple-400 text-xs font-semibold uppercase tracking-wider mb-1">Famous examples</div>
                    <div className="text-purple-200 text-sm">{groove.famous}</div>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-5 border border-white/20">
                    <h3 className="text-white font-bold mb-4">All Patterns</h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {GROOVE_PATTERNS.map((g, i) => (
                        <button key={g.name} onClick={() => setSelectedGroove(i)}
                          className={`text-left p-3 rounded-xl transition-all border ${selectedGroove === i ? "border-purple-500 bg-purple-600/20" : "border-white/10 bg-white/5 hover:bg-white/10"}`}>
                          <div className="flex items-center gap-2 mb-1"><span>{g.emoji}</span><span className="text-white font-semibold text-sm">{g.name}</span></div>
                          <span className="text-xs text-purple-400">{g.style}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })()}
          </div>
        )}

        {/* ── 12-BAR BLUES ───────────────────────────────────────────────────── */}
        {activeTab === "blues" && (
          <div>
            <div className="mb-5">
              <h2 className="text-xl font-bold text-white mb-1">12-Bar Blues</h2>
              <p className="text-purple-400 text-sm">The most important musical form in rock, blues, jazz, and soul. Every bassist must know this inside-out.</p>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {BLUES_SECTIONS.map(s => (
                <button key={s.id} onClick={() => setBluesSection(s.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    bluesSection === s.id ? "bg-purple-600 text-white" : "bg-white/10 text-purple-300 hover:bg-white/20"
                  }`}>{s.label}</button>
              ))}
            </div>

            {bluesSection === "form" && (
              <div className="space-y-5">
                <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
                  <h2 className="text-xl font-bold text-white mb-2">The I–IV–V Structure</h2>
                  <p className="text-purple-300 text-sm mb-5">
                    The 12-bar blues is built on three chords: the <strong className="text-white">I</strong> (home), the <strong className="text-white">IV</strong> (move away), and the <strong className="text-white">V</strong> (tension). They always appear in the same 12-bar order.
                  </p>
                  {/* 12-bar chart */}
                  <div className="mb-5">
                    <div className="text-purple-400 text-xs uppercase tracking-wider font-semibold mb-2">12-Bar Chart (key of A)</div>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { bar:1, chord:"I (A7)",  bg:"bg-amber-500/20 border-amber-500/40" },
                        { bar:2, chord:"I (A7)",  bg:"bg-amber-500/20 border-amber-500/40" },
                        { bar:3, chord:"I (A7)",  bg:"bg-amber-500/20 border-amber-500/40" },
                        { bar:4, chord:"I (A7)",  bg:"bg-amber-500/20 border-amber-500/40" },
                        { bar:5, chord:"IV (D7)", bg:"bg-blue-500/20 border-blue-500/40" },
                        { bar:6, chord:"IV (D7)", bg:"bg-blue-500/20 border-blue-500/40" },
                        { bar:7, chord:"I (A7)",  bg:"bg-amber-500/20 border-amber-500/40" },
                        { bar:8, chord:"I (A7)",  bg:"bg-amber-500/20 border-amber-500/40" },
                        { bar:9, chord:"V (E7)",  bg:"bg-red-500/20 border-red-500/40" },
                        { bar:10,chord:"IV (D7)", bg:"bg-blue-500/20 border-blue-500/40" },
                        { bar:11,chord:"I (A7)",  bg:"bg-amber-500/20 border-amber-500/40" },
                        { bar:12,chord:"V (E7)",  bg:"bg-red-500/20 border-red-500/40" },
                      ].map(b => (
                        <div key={b.bar} className={`border rounded-xl p-3 text-center ${b.bg}`}>
                          <div className="text-purple-400 text-xs mb-1">Bar {b.bar}</div>
                          <div className="text-white font-bold text-sm">{b.chord}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {[
                      { label:"I chord (A7)", color:"amber", frets:"E string fret 5 or A string open", note:"Home. You always start and want to return here." },
                      { label:"IV chord (D7)", color:"blue", frets:"A string fret 5 or D string open", note:"Departure. Creates movement away from home." },
                      { label:"V chord (E7)", color:"red", frets:"A string fret 7 or E string open", note:"Tension. Wants to resolve — always goes back to I." },
                    ].map(item => (
                      <div key={item.label} className={`bg-white/10 rounded-xl p-4 border border-${item.color}-500/30`}>
                        <div className={`text-${item.color}-400 font-bold mb-1 text-sm`}>{item.label}</div>
                        <div className="text-white font-mono text-xs mb-2">{item.frets}</div>
                        <div className="text-purple-300 text-xs">{item.note}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <TipBox>Bar 12 is always the V chord (or I/V split) — this sets up the repeat back to bar 1. When the band keeps going, bar 12 = V. Last time through, bar 12 = I to end on home.</TipBox>
              </div>
            )}

            {bluesSection === "shuffle" && (
              <div className="space-y-5">
                <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
                  <h2 className="text-xl font-bold text-white mb-2">The Shuffle Feel</h2>
                  <p className="text-purple-300 text-sm mb-5">
                    Shuffle is a <strong className="text-white">long-short</strong> swing feel — 8th notes are played as triplet pairs (long-short, long-short). It&apos;s the heartbeat of blues.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4 mb-5">
                    <div className="bg-white/10 rounded-xl p-4">
                      <div className="text-white font-bold mb-2">Straight 8ths (even)</div>
                      <div className="flex gap-2 items-center">
                        {["1","&","2","&","3","&","4","&"].map((b,i) => (
                          <div key={i} className="w-8 h-8 bg-purple-600/50 rounded flex items-center justify-center text-xs text-white font-bold">{b}</div>
                        ))}
                      </div>
                      <div className="text-purple-400 text-xs mt-2">All notes equal duration</div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4">
                      <div className="text-white font-bold mb-2">Shuffle 8ths (long-short)</div>
                      <div className="flex gap-1 items-center">
                        {[["1","lg"],["&","sm"],["2","lg"],["&","sm"],["3","lg"],["&","sm"],["4","lg"],["&","sm"]].map(([b,size],i) => (
                          <div key={i} className={`${size === "lg" ? "w-12 h-10 bg-amber-600/60" : "w-6 h-7 bg-amber-400/40"} rounded flex items-center justify-center text-xs text-white font-bold`}>{b}</div>
                        ))}
                      </div>
                      <div className="text-purple-400 text-xs mt-2">Beat = long, &-of = short (triplet feel)</div>
                    </div>
                  </div>
                  <h3 className="text-white font-bold mb-3">Root–Fifth Shuffle Pattern</h3>
                  <p className="text-purple-300 text-sm mb-3">The most iconic blues bass pattern. Root on the beat, 5th on the off-beat. Repeat for 12 bars through I, IV, and V.</p>
                  <TabBlock label="I chord (A7) — 2 bars" code={`G|-------------------------------|
D|-------------------------------|
A|--7---7---7---7---7---7---7---7|  ← 5th (E)
E|--5---5---5---5---5---5---5---5|  ← root (A)
   1 & 2 & 3 & 4 &  (shuffle: play 1 long, & short)`} />
                  <div className="mt-4">
                    <TabBlock label="IV chord (D7)" code={`G|-------------------------------|
D|--7---7---7---7---7---7---7---7|  ← 5th (A)
A|--5---5---5---5---5---5---5---5|  ← root (D)
E|-------------------------------|`} />
                  </div>
                  <div className="mt-4">
                    <TabBlock label="V chord (E7)" code={`G|-------------------------------|
D|--9---9---9---9---9---9---9---9|  ← 5th (B)
A|--7---7---7---7---7---7---7---7|  ← root (E)
E|-------------------------------|`} />
                  </div>
                </div>
                <TipBox>The 5th is always 2 frets up on the next thinner string from the root. A→E string: root on E, 5th on A (+2 frets). D→A string: root on A, 5th on D (+2 frets). V→D string: root on A, 5th on D (+2 frets).</TipBox>
              </div>
            )}

            {bluesSection === "lines" && (
              <div className="space-y-5">
                <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
                  <h2 className="text-xl font-bold text-white mb-5">Three Levels of Blues Bass Line</h2>
                  <div className="space-y-6">
                    {[
                      {
                        level: "Level 1", name: "Root Only", color: "bg-green-500/20 border-green-500/30 text-green-300",
                        desc: "Just roots, locked with kick drum. Never sounds boring when the time is solid.",
                        tab: `G|-------------------------------|
D|-------------------------------|
A|--5-----------5-----------7----|  (D root for IV, E root for V)
E|--5---5---5---5---5---5---5----|
   I(A)         IV(D)      V(E)`,
                      },
                      {
                        level: "Level 2", name: "Root–Fifth Shuffle", color: "bg-blue-500/20 border-blue-500/30 text-blue-300",
                        desc: "The classic blues shuffle. Root on beat 1, 5th off the beat. Swing the 8th notes.",
                        tab: `G|-------------------------------|
D|---7--7---7--7---9--9---7--7---|
A|---5--5---5--5---7--7---5--5---|
E|-------------------------------|
   IV(D)      V(E)       I(A)  (bars 5-8 shown)`,
                      },
                      {
                        level: "Level 3", name: "Walking Blues Line", color: "bg-purple-500/20 border-purple-500/30 text-purple-300",
                        desc: "Quarter notes that move chromatically and scale-wise toward the next chord root. Jazz/blues feel.",
                        tab: `G|-------------------------------|
D|-------------------------------|
A|---5--6--7--5--5--4--3--5------|  (I chord to IV)
E|-------------------------------|
   A  Bb B  A  D  C# C  D
         chromatic approach to D (IV)`,
                      },
                    ].map(item => (
                      <div key={item.level} className={`border rounded-2xl p-5 ${item.color.replace("text-","").replace("green-300","").replace("blue-300","").replace("purple-300","")} bg-white/5 border-white/10`}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-bold border ${item.color}`}>{item.level}</span>
                          <h3 className="text-white font-bold">{item.name}</h3>
                        </div>
                        <p className="text-purple-300 text-sm mb-3">{item.desc}</p>
                        <TabBlock code={item.tab} />
                      </div>
                    ))}
                  </div>
                </div>
                <TipBox>Always start with Level 1 when learning a new song. Add the 5th once you know the chord changes cold. Add chromatic walks only when you can do it without thinking about the changes.</TipBox>
              </div>
            )}

            {bluesSection === "turnaround" && (
              <div className="space-y-5">
                <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
                  <h2 className="text-xl font-bold text-white mb-2">The Turnaround (Bars 11–12)</h2>
                  <p className="text-purple-300 text-sm mb-5">
                    The last 2 bars of the 12-bar form. Their job: set up the return to bar 1. A good turnaround creates maximum tension so bar 1 feels like a release.
                  </p>
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-white font-semibold mb-1">Turnaround 1 — Classic V-chord ending</h3>
                      <p className="text-purple-300 text-sm mb-2">Bar 11 = I chord, bar 12 = V chord. The V pulls hard back to I.</p>
                      <TabBlock label="bars 11–12 in A" code={`G|-----------------------------|
D|-----------------------------|
A|--5--5--5--5--7--7--7--7-----|
E|-----------------------------|
   I (A)        V (E)
   ← this E (V) wants to go back to A (I) →`} />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">Turnaround 2 — Chromatic walk</h3>
                      <p className="text-purple-300 text-sm mb-2">Walk down chromatically from the I chord to meet the V. Very common in Chicago blues.</p>
                      <TabBlock label="bars 11–12 chromatic in A" code={`G|-----------------------------|
D|-----------------------------|
A|-----------------------------|
E|--5--4--3--2--1--0--2--2-----|
   A  G# G  F# F  E  F# F#
   ← chromatic descent → land on E (V) →`} />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">Turnaround 3 — I–IV–I–V</h3>
                      <p className="text-purple-300 text-sm mb-2">Quick chord movement through all three chords in 2 bars. More harmonic movement, typical in jump blues.</p>
                      <TabBlock label="bars 11–12 I-IV-I-V in A" code={`G|-----------------------------|
D|-----------------------------|
A|--5--5--5--5--5--5--7--7-----|
E|--5--5-----------5-----------|
   I(A)  IV(D) I(A) V(E)
   (each chord = 2 beats)`} />
                    </div>
                  </div>
                </div>
                <TipBox>When playing with a band for the first time, use Turnaround 1 (plain I→V). It&apos;s universally understood. Switch to the chromatic walk once you know the other players are listening and following.</TipBox>
              </div>
            )}
          </div>
        )}

        {/* ── TECHNIQUES ─────────────────────────────────────────────────────── */}
        {activeTab === "techniques" && (
          <div>
            <div className="mb-5">
              <h2 className="text-xl font-bold text-white mb-1">Bass Techniques</h2>
              <p className="text-purple-400 text-sm">From foundational plucking mechanics to advanced slap — build your technique toolkit.</p>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {TECHNIQUES.map((t, i) => (
                <button key={t.name} onClick={() => setSelectedTech(i)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    selectedTech === i ? "bg-purple-600 text-white scale-105" : "bg-white/10 text-purple-300 hover:bg-white/20"
                  }`}><span>{t.icon}</span><span>{t.name}</span></button>
              ))}
            </div>
            {(() => {
              const tech = TECHNIQUES[selectedTech]
              const diffColor = tech.difficulty === "Beginner" ? "bg-green-500/20 text-green-300" : tech.difficulty === "Intermediate" ? "bg-yellow-500/20 text-yellow-300" : "bg-red-500/20 text-red-300"
              return (
                <div className="space-y-5">
                  <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
                    <div className="flex items-start gap-4 mb-4">
                      <span className="text-4xl">{tech.icon}</span>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h2 className="text-2xl font-bold text-white">{tech.name}</h2>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${diffColor}`}>{tech.difficulty}</span>
                        </div>
                        <p className="text-purple-200">{tech.description}</p>
                      </div>
                    </div>
                    <h3 className="text-white font-bold mb-3">How To Do It</h3>
                    <ol className="space-y-3 mb-5">
                      {tech.steps.map((step, i) => (
                        <li key={i} className="flex gap-3 text-purple-200 text-sm">
                          <span className="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                    {tech.tabExample && <TabBlock label="TAB Example" code={tech.tabExample} />}
                  </div>
                  <TipBox>{tech.tip}</TipBox>
                  <div className="bg-white/10 rounded-2xl p-5 border border-white/20">
                    <h3 className="text-white font-bold mb-4">All Techniques</h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {TECHNIQUES.map((t, i) => {
                        const dc = t.difficulty === "Beginner" ? "text-green-400" : t.difficulty === "Intermediate" ? "text-yellow-400" : "text-red-400"
                        return (
                          <button key={t.name} onClick={() => setSelectedTech(i)}
                            className={`text-left p-3 rounded-xl transition-all border ${selectedTech === i ? "border-purple-500 bg-purple-600/20" : "border-white/10 bg-white/5 hover:bg-white/10"}`}>
                            <div className="flex items-center gap-2 mb-1"><span>{t.icon}</span><span className="text-white font-semibold text-sm">{t.name}</span></div>
                            <span className={`text-xs ${dc}`}>{t.difficulty}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            })()}
          </div>
        )}

      </div>
    </div>
  )
}
