"use client"

import React, { useState } from "react"
import Link from "next/link"
import ChordDiagram from "@/components/ChordDiagram"

// ─── Callout component ───────────────────────────────────────────────────────
type CalloutType = "tip" | "warning" | "insight" | "exercise"

const CALLOUT_STYLES: Record<CalloutType, { border: string; label: string; labelColor: string; bg: string; text: string }> = {
  tip: {
    border: "border-purple-500",
    bg: "bg-purple-500/10",
    label: "Tip",
    labelColor: "text-purple-300",
    text: "text-purple-200",
  },
  warning: {
    border: "border-amber-500",
    bg: "bg-amber-500/10",
    label: "Watch out",
    labelColor: "text-amber-300",
    text: "text-amber-200",
  },
  insight: {
    border: "border-blue-500",
    bg: "bg-blue-500/10",
    label: "Insight",
    labelColor: "text-blue-300",
    text: "text-blue-200",
  },
  exercise: {
    border: "border-green-500",
    bg: "bg-green-500/10",
    label: "Exercise",
    labelColor: "text-green-300",
    text: "text-green-200",
  },
}

function Callout({ type, children }: { type: CalloutType; children: React.ReactNode }) {
  const s = CALLOUT_STYLES[type]
  return (
    <div className={`border-l-4 ${s.border} ${s.bg} rounded-xl p-4 mb-4`}>
      <span className={`text-xs font-bold uppercase tracking-wider ${s.labelColor}`}>{s.label}</span>
      <div className={`mt-1 text-sm leading-relaxed ${s.text}`}>{children}</div>
    </div>
  )
}

// ─── Card component ───────────────────────────────────────────────────────────
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white/5 border border-white/10 rounded-2xl p-5 mb-4 ${className}`}>
      {children}
    </div>
  )
}

// ─── TAB block ────────────────────────────────────────────────────────────────
function Tab({ children }: { children: string }) {
  return (
    <pre className="font-mono text-green-300 bg-black/40 rounded-xl p-4 text-xs leading-relaxed overflow-x-auto whitespace-pre">
      {children}
    </pre>
  )
}

// ─── Chord reference chart ────────────────────────────────────────────────────
const E_SHAPE_MAJOR = [
  { note: "F",  fret: 1 },
  { note: "F#", fret: 2 },
  { note: "G",  fret: 3 },
  { note: "G#", fret: 4 },
  { note: "A",  fret: 5 },
  { note: "A#", fret: 6 },
  { note: "B",  fret: 7 },
  { note: "C",  fret: 8 },
  { note: "C#", fret: 9 },
  { note: "D",  fret: 10 },
  { note: "D#", fret: 11 },
  { note: "E",  fret: 12 },
]

const E_SHAPE_MINOR = [
  { note: "Fm",  fret: 1 },
  { note: "F#m", fret: 2 },
  { note: "Gm",  fret: 3 },
  { note: "G#m", fret: 4 },
  { note: "Am",  fret: 5 },
  { note: "A#m", fret: 6 },
  { note: "Bm",  fret: 7 },
  { note: "Cm",  fret: 8 },
  { note: "C#m", fret: 9 },
  { note: "Dm",  fret: 10 },
  { note: "D#m", fret: 11 },
  { note: "Em",  fret: 12 },
]

const A_SHAPE_MAJOR = [
  { note: "A#", fret: 1 },
  { note: "B",  fret: 2 },
  { note: "C",  fret: 3 },
  { note: "C#", fret: 4 },
  { note: "D",  fret: 5 },
  { note: "D#", fret: 6 },
  { note: "E",  fret: 7 },
  { note: "F",  fret: 8 },
  { note: "F#", fret: 9 },
  { note: "G",  fret: 10 },
  { note: "G#", fret: 11 },
  { note: "A",  fret: 12 },
]

const A_SHAPE_MINOR = [
  { note: "A#m", fret: 1 },
  { note: "Bm",  fret: 2 },
  { note: "Cm",  fret: 3 },
  { note: "C#m", fret: 4 },
  { note: "Dm",  fret: 5 },
  { note: "D#m", fret: 6 },
  { note: "Em",  fret: 7 },
  { note: "Fm",  fret: 8 },
  { note: "F#m", fret: 9 },
  { note: "Gm",  fret: 10 },
  { note: "G#m", fret: 11 },
  { note: "Am",  fret: 12 },
]

function ChordTable({ chords }: { chords: { note: string; fret: number }[] }) {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-3">
      {chords.map((c) => (
        <div key={c.note} className="bg-black/30 rounded-xl p-3 text-center border border-white/10">
          <div className="text-white font-bold text-sm">{c.note}</div>
          <div className="text-purple-300 text-xs mt-1">Fret {c.fret}</div>
        </div>
      ))}
    </div>
  )
}

// ─── Troubleshooting expandable cards ────────────────────────────────────────
const TROUBLE_ITEMS = [
  {
    title: "Buzzing strings",
    icon: "~",
    content: [
      "Your index finger is not close enough to the fret wire — move it as close to the fret as possible without going over.",
      "Your other fingers may be accidentally resting against adjacent strings — curl each one so only the fingertip touches.",
      "Check that your thumb is positioned behind the middle finger on the back of the neck, not creeping up over the top.",
      "Press straight down with your index finger rather than angling away from the fret.",
    ],
  },
  {
    title: "Muted / dead strings",
    icon: "x",
    content: [
      "Your index finger may not be lying flat enough — try rolling it slightly toward the headstock to use the bonier side.",
      "Check each string individually by plucking one at a time to locate exactly which finger is the culprit.",
      "The joint creases in your index finger naturally sit over strings — shift the barre slightly higher or lower to avoid them.",
      "Make sure no other finger is accidentally muting a string it is not supposed to touch.",
    ],
  },
  {
    title: "Pain and hand fatigue",
    icon: "!",
    content: [
      "Some discomfort is completely normal in the first few weeks — your hand is building strength it has never needed before.",
      "Always take a break the moment you feel sharp or shooting pain (not just burning muscle fatigue).",
      "Start with 10–15 second holds, rest, repeat — build up gradually over days, not hours.",
      "Ensure your thumb is behind the neck roughly behind the middle finger; having it too high or too low strains tendons.",
      "Lighter gauge strings (e.g. 9s or 10s) make barring significantly easier while you build strength.",
    ],
  },
  {
    title: "The F chord specifically",
    icon: "F",
    content: [
      "The F chord is the most notorious because it requires maximum barre pressure AND precise finger placement.",
      "Start by barring only strings 1 and 2 at fret 1. Get those clean, then add string 3, then strings 4–6.",
      "Try playing just the top four strings of F (strings 1–4) at first — it sounds great and is much more manageable.",
      "Practise the open E major shape with ring–pinky–middle, then slide it up one fret and add the barre separately.",
    ],
  },
  {
    title: "Weak or thin sound",
    icon: "~",
    content: [
      "Think of your thumb and fingers working like a clamp — squeeze from both sides simultaneously, not just from the fingers.",
      "Make sure your wrist is slightly forward (not pulled back behind the neck) to give your fingers more leverage.",
      "Check your guitar setup: if the action (string height) is very high, barre chords are harder than they need to be. A setup by a luthier can make a huge difference.",
    ],
  },
]

// ─── Main page ────────────────────────────────────────────────────────────────
const TABS = [
  "What & Why",
  "E-Shape Major",
  "E-Shape Minor",
  "A-Shape Major",
  "A-Shape Minor",
  "Troubleshooting",
  "Practice & Songs",
]

export default function BarreChordsPage() {
  const [activeTab, setActiveTab] = useState(0)
  const [openTrouble, setOpenTrouble] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">

        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-purple-300 hover:text-white text-sm">
            ← Back to modules
          </Link>
          <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2 mt-4">
            Barre Chords
          </h1>
          <p className="text-purple-300 text-sm sm:text-base">
            Master the technique that unlocks every chord on the neck
          </p>
        </div>

        {/* Tab bar */}
        <div className="flex flex-wrap gap-2 mb-8">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === i
                  ? "bg-purple-600 text-white"
                  : "bg-white/10 text-purple-300 hover:bg-white/20"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">

          {/* ── Tab 0: What & Why ─────────────────────────────────────────── */}
          {activeTab === 0 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">What Are Barre Chords — and Why Do They Matter?</h2>

              <Card>
                <h3 className="text-white font-semibold mb-2">What a barre actually is</h3>
                <p className="text-purple-200 text-sm leading-relaxed">
                  A barre chord uses your index finger laid flat across all six strings at a single fret, acting
                  as a movable capo. Your remaining fingers form the chord shape above it. Slide the whole thing
                  up or down the neck and you get a completely different chord — same shape, new root note.
                </p>
              </Card>

              <Card>
                <h3 className="text-white font-semibold mb-2">Why they are hard at first</h3>
                <p className="text-purple-200 text-sm leading-relaxed mb-3">
                  Open chords only require you to press a handful of strings at separate points. A barre asks one
                  finger to hold down all six strings simultaneously with enough pressure that every single one
                  rings clearly. Your hand has never had to do this before, so it takes time to build the specific
                  strength and muscle memory.
                </p>
                <p className="text-purple-200 text-sm leading-relaxed">
                  Most beginners spend a few weeks on barre chords before they feel natural. That struggle is
                  universal — every guitarist has gone through it.
                </p>
              </Card>

              <Callout type="insight">
                There are really only <strong>two barre shapes to learn</strong>: the E-shape and the A-shape.
                Between them, you can play any major or minor chord anywhere on the neck. Twenty-four chords
                from two shapes — that is the whole deal.
              </Callout>

              <Card>
                <h3 className="text-white font-semibold mb-3">The two master shapes</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-purple-900/40 rounded-xl p-4 border border-purple-500/30">
                    <div className="text-purple-300 font-bold text-sm mb-1">E-Shape</div>
                    <p className="text-purple-200 text-xs leading-relaxed">
                      Based on the open E major chord. The root note lives on the low E string (string 6).
                      Move it to fret 1 and you get F. Fret 3 gives you G. Any note on the low E string
                      becomes the chord name.
                    </p>
                  </div>
                  <div className="bg-purple-900/40 rounded-xl p-4 border border-purple-500/30">
                    <div className="text-purple-300 font-bold text-sm mb-1">A-Shape</div>
                    <p className="text-purple-200 text-xs leading-relaxed">
                      Based on the open A major chord. The root note lives on the A string (string 5).
                      Move it to fret 2 and you get B. Fret 3 gives you C. The low E string is muted.
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <h3 className="text-white font-semibold mb-2">The payoff</h3>
                <ul className="text-purple-200 text-sm leading-relaxed space-y-2 list-disc list-inside">
                  <li>Play in any key without a capo</li>
                  <li>Use one shape and just move it — no need to learn a new fingering per key</li>
                  <li>Unlock hundreds of songs that require F, Bm, F#m, and other common barre chords</li>
                  <li>Transition effortlessly between open and barre chords in the same song</li>
                  <li>Build a foundation for power chords, bar chord extensions (7ths, 9ths), and jazz voicings</li>
                </ul>
              </Card>

              <Callout type="tip">
                Before diving into the shapes, make sure you can play a clean open E major and open A major
                chord. Those are the exact finger positions you will be moving up the neck.
              </Callout>
            </div>
          )}

          {/* ── Tab 1: E-Shape Major ─────────────────────────────────────── */}
          {activeTab === 1 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">E-Shape Major Barre Chords</h2>

              <Card>
                <h3 className="text-white font-semibold mb-2">The gateway: F major</h3>
                <p className="text-purple-200 text-sm leading-relaxed">
                  F major at fret 1 is the most common first barre chord and the one that stops most beginners in
                  their tracks. Master this shape and every other major chord on the low E string is yours.
                </p>
              </Card>

              <Card>
                <h3 className="text-white font-semibold mb-3">Finger placement — F major (fret 1)</h3>
                <p className="text-purple-200 text-xs mb-3">
                  Finger guide: 1 = index (barre), 2 = middle, 3 = ring, 4 = pinky
                </p>
                <div className="flex justify-center mb-3">
                  <ChordDiagram chordName="F" fingers={[1, 3, 3, 2, 1, 1]} size="medium" />
                </div>
                <Tab>{`  e |---1---|  (index — barre)
  B |---1---|  (index — barre)
  G |---2---|  (middle finger, fret 2)
  D |---3---|  (ring finger, fret 3)
  A |---4---|  (pinky, fret 3)
  E |---1---|  (index — barre)`}</Tab>
                <p className="text-purple-200 text-xs mt-3 leading-relaxed">
                  Your index finger lies flat across ALL six strings at fret 1. Middle finger goes on G string at
                  fret 2. Ring finger on D string at fret 3. Pinky on A string at fret 3.
                </p>
              </Card>

              <Callout type="insight">
                The root note (F) is on the low E string. This is the key rule: <strong>the note under your
                index finger on string 6 is the chord name</strong>. Move the shape to fret 3 and the root is
                G — so you are playing G major.
              </Callout>

              <Card>
                <h3 className="text-white font-semibold mb-3">E-shape major across the neck</h3>
                <Tab>{`  F  (fret 1)     G  (fret 3)     A  (fret 5)     B  (fret 7)     C  (fret 8)
  e |--1---------3---------5---------7---------8--|
  B |--1---------3---------5---------7---------8--|
  G |--2---------4---------6---------8---------9--|
  D |--3---------5---------7---------9--------10--|
  A |--3---------5---------7---------9--------10--|
  E |--1---------3---------5---------7---------8--|`}</Tab>
              </Card>

              <Card>
                <h3 className="text-white font-semibold mb-1">All 12 major chords — E-shape</h3>
                <p className="text-purple-200 text-xs mb-2">Root note is on the low E string (string 6)</p>
                <ChordTable chords={E_SHAPE_MAJOR} />
              </Card>

              <Callout type="exercise">
                <strong>Sliding drill:</strong> Start at fret 1 (F). Play all six strings. Say the chord name
                out loud. Slide up one fret (F#). Play. Say the name. Continue all the way to fret 12. This is
                the single best exercise for learning the neck. Do it slowly and cleanly — speed is not the goal.
              </Callout>

              <Card>
                <h3 className="text-white font-semibold mb-2">Open E vs. barre F</h3>
                <div className="flex gap-6 flex-wrap justify-center mb-3">
                  <ChordDiagram chordName="Open E" fingers={[0, 2, 2, 1, 0, 0]} size="medium" />
                  <ChordDiagram chordName="F (barre)" fingers={[1, 3, 3, 2, 1, 1]} size="medium" />
                </div>
                <Tab>{`  Open E major        F major (barre fret 1)
  e |--0--|            e |--1--|
  B |--0--|            B |--1--|
  G |--1--|            G |--2--|
  D |--2--|            D |--3--|
  A |--2--|            A |--3--|
  E |--0--|            E |--1--|`}</Tab>
                <p className="text-purple-200 text-xs mt-3">
                  Notice: the shape of fingers 2, 3, 4 is identical. The only addition is the barre with finger 1
                  replacing the open nut.
                </p>
              </Card>

              <Callout type="tip">
                If barre chords are too hard at first, a temporary workaround for F is the "mini-F" or "cheater F":
                barre only strings 1 and 2 at fret 1, ring finger on string 3 fret 2, pinky on string 4 fret 3.
                Skip string 5 and 6. It does not sound full but it works in a band mix.
              </Callout>
            </div>
          )}

          {/* ── Tab 2: E-Shape Minor ─────────────────────────────────────── */}
          {activeTab === 2 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">E-Shape Minor Barre Chords</h2>

              <Card>
                <h3 className="text-white font-semibold mb-2">From major to minor: one finger change</h3>
                <p className="text-purple-200 text-sm leading-relaxed">
                  The E-shape minor is just the E-shape major with the middle finger lifted off the G string.
                  Instead of using fingers 1-2-3-4, you use fingers 1-3-4 (index barre, ring and pinky on A and D).
                  Same barre, same fret, simply remove the middle finger.
                </p>
              </Card>

              <Card>
                <h3 className="text-white font-semibold mb-3">E major shape vs E minor shape</h3>
                <div className="flex gap-6 flex-wrap justify-center mb-3">
                  <ChordDiagram chordName="F major" fingers={[1, 3, 3, 2, 1, 1]} size="medium" />
                  <ChordDiagram chordName="Fm minor" fingers={[1, 3, 3, 1, 1, 1]} size="medium" />
                </div>
                <Tab>{`  E major shape         E minor shape
  e |--1--|             e |--1--|
  B |--1--|             B |--1--|
  G |--2--|  <-- lift   G |--1--|  (barre only)
  D |--3--|             D |--3--|
  A |--3--|             A |--3--|
  E |--1--|             E |--1--|`}</Tab>
                <p className="text-purple-200 text-xs mt-3 leading-relaxed">
                  When you lift the middle finger the G string falls back to the barre (index). That interval
                  change — from the major 3rd to the minor 3rd — is what makes it sound minor.
                </p>
              </Card>

              <Callout type="insight">
                The root note rule is exactly the same: <strong>whatever fret your index finger is on for the
                low E string, that is the chord name</strong>, just with an "m" added. Fret 5 = Am, fret 7 = Bm,
                fret 3 = Gm.
              </Callout>

              <Card>
                <h3 className="text-white font-semibold mb-3">Fm and Bm — TAB examples</h3>
                <div className="flex gap-6 flex-wrap justify-center mb-3">
                  <ChordDiagram chordName="Fm" fingers={[1, 3, 3, 1, 1, 1]} size="medium" />
                  <ChordDiagram chordName="Bm" fingers={[7, 9, 9, 7, 7, 7]} size="medium" />
                </div>
                <Tab>{`  Fm (fret 1)                  Bm (fret 7)
  e |--1--|                    e |--7--|
  B |--1--|                    B |--7--|
  G |--1--|                    G |--7--|
  D |--3--|                    D |--9--|
  A |--3--|                    A |--9--|
  E |--1--|                    E |--7--|`}</Tab>
              </Card>

              <Card>
                <h3 className="text-white font-semibold mb-3">Common E-shape minor chord sequence</h3>
                <Tab>{`  Gm        Am        Bm        Cm        Dm
  e |--3--|  e |--5--|  e |--7--|  e |--8--|  e |--10-|
  B |--3--|  B |--5--|  B |--7--|  B |--8--|  B |--10-|
  G |--3--|  G |--5--|  G |--7--|  G |--8--|  G |--10-|
  D |--5--|  D |--7--|  D |--9--|  D |--10-|  D |--12-|
  A |--5--|  A |--7--|  A |--9--|  A |--10-|  A |--12-|
  E |--3--|  E |--5--|  E |--7--|  E |--8--|  E |--10-|`}</Tab>
              </Card>

              <Card>
                <h3 className="text-white font-semibold mb-1">All 12 minor chords — E-shape</h3>
                <p className="text-purple-200 text-xs mb-2">Root note is on the low E string (string 6)</p>
                <ChordTable chords={E_SHAPE_MINOR} />
              </Card>

              <Callout type="exercise">
                <strong>Major/minor switch drill:</strong> Hold an E-shape barre at fret 5 (A major). Play it.
                Lift your middle finger — now it is Am. Put it back — A major. Alternate 10 times without
                moving your barre. This ingrains the one-finger difference between major and minor.
              </Callout>

              <Callout type="tip">
                Bm (fret 7) and F#m (fret 2) are two of the most common minor barre chords you will encounter
                in songs. Both are E-shape minor. If you can nail those two, you are ready for most rock and
                pop songs in the keys of D and A.
              </Callout>
            </div>
          )}

          {/* ── Tab 3: A-Shape Major ─────────────────────────────────────── */}
          {activeTab === 3 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">A-Shape Major Barre Chords</h2>

              <Card>
                <h3 className="text-white font-semibold mb-2">Root on the A string</h3>
                <p className="text-purple-200 text-sm leading-relaxed">
                  The A-shape barre chord is based on the open A major chord, and the root note lives on the
                  A string (string 5). The low E string is <strong>muted</strong> — either by the tip of the
                  index finger lightly touching it, or by your thumb creeping over the neck edge.
                </p>
              </Card>

              <Card>
                <h3 className="text-white font-semibold mb-3">Two ways to finger the A-shape</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-purple-300 text-xs font-semibold mb-2">Option A — Ring finger barre (strings 2–4)</p>
                    <div className="flex justify-center mb-2">
                      <ChordDiagram chordName="Bb (opt A)" fingers={['x', 1, 3, 3, 3, 1]} size="small" />
                    </div>
                    <Tab>{`  e |--1--|  (index barre)
  B |--3--|  (ring barre)
  G |--3--|  (ring barre)
  D |--3--|  (ring barre)
  A |--1--|  (index barre = root)
  E |--x--|  (muted)`}</Tab>
                    <p className="text-purple-200 text-xs mt-2">Ring finger lays flat across strings 2, 3, 4 two frets above the barre.</p>
                  </div>
                  <div>
                    <p className="text-purple-300 text-xs font-semibold mb-2">Option B — Three separate fingers</p>
                    <div className="flex justify-center mb-2">
                      <ChordDiagram chordName="Bb (opt B)" fingers={['x', 1, 2, 3, 4, 1]} size="small" />
                    </div>
                    <Tab>{`  e |--1--|  (index barre)
  B |--4--|  (pinky)
  G |--3--|  (ring)
  D |--2--|  (middle)
  A |--1--|  (index barre = root)
  E |--x--|  (muted)`}</Tab>
                    <p className="text-purple-200 text-xs mt-2">More control over individual notes — preferred for clean sound.</p>
                  </div>
                </div>
              </Card>

              <Callout type="insight">
                The root note rule for A-shape: <strong>the note under your index finger on string 5 (A string)
                is the chord name</strong>. Fret 2 = B major. Fret 3 = C major. Fret 5 = D major.
              </Callout>

              <Card>
                <h3 className="text-white font-semibold mb-3">B, C, D, E using A-shape — TAB</h3>
                <Tab>{`  B (fret 2)   C (fret 3)   D (fret 5)   E (fret 7)
  e |--2--|    e |--3--|    e |--5--|    e |--7--|
  B |--4--|    B |--5--|    B |--7--|    B |--9--|
  G |--4--|    G |--5--|    G |--7--|    G |--9--|
  D |--4--|    D |--5--|    D |--7--|    D |--9--|
  A |--2--|    A |--3--|    A |--5--|    A |--7--|
  E |--x--|    E |--x--|    E |--x--|    E |--x--|`}</Tab>
              </Card>

              <Callout type="warning">
                The low E string must be muted in A-shape chords. If it rings out, it adds a note that clashes
                with the chord. Aim to mute it with the underside of your index finger tip or gently with your
                thumb. This is a skill in itself — do not worry if it occasionally rings at first.
              </Callout>

              <Card>
                <h3 className="text-white font-semibold mb-1">All 12 major chords — A-shape</h3>
                <p className="text-purple-200 text-xs mb-2">Root note is on the A string (string 5). Low E is muted.</p>
                <ChordTable chords={A_SHAPE_MAJOR} />
              </Card>

              <Callout type="exercise">
                <strong>Fret-by-fret crawl:</strong> Starting at fret 1 (A# / Bb), play the A-shape major chord,
                name the chord out loud, then slide up one fret. Continue to fret 12. This drills the A-string
                note names into your muscle memory.
              </Callout>

              <Card>
                <h3 className="text-white font-semibold mb-2">Open A vs. barre B comparison</h3>
                <div className="flex gap-6 flex-wrap justify-center mb-3">
                  <ChordDiagram chordName="Open A" fingers={['x', 0, 2, 2, 2, 0]} size="medium" />
                  <ChordDiagram chordName="B (barre)" fingers={['x', 2, 4, 4, 4, 2]} size="medium" />
                </div>
                <Tab>{`  Open A major          B major (A-shape, fret 2)
  e |--0--|             e |--2--|
  B |--2--|             B |--4--|
  G |--2--|             G |--4--|
  D |--2--|             D |--4--|
  A |--0--|             A |--2--|  (root)
  E |--x--|             E |--x--|`}</Tab>
                <p className="text-purple-200 text-xs mt-3">
                  Same relative shape — just moved up two frets with the barre replacing the open nut.
                  The open A string becomes the barred A string at fret 2, giving you B.
                </p>
              </Card>
            </div>
          )}

          {/* ── Tab 4: A-Shape Minor ─────────────────────────────────────── */}
          {activeTab === 4 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">A-Shape Minor Barre Chords</h2>

              <Card>
                <h3 className="text-white font-semibold mb-2">Based on open Am chord</h3>
                <p className="text-purple-200 text-sm leading-relaxed">
                  The A-shape minor barre uses the open Am chord as its template. The index finger barres across
                  all strings, and the remaining three fingers form a compact shape two frets up. Low E is still
                  muted. The root is still on the A string.
                </p>
              </Card>

              <Card>
                <h3 className="text-white font-semibold mb-3">Finger placement — Bm (fret 2)</h3>
                <div className="flex justify-center mb-3">
                  <ChordDiagram chordName="Bm (A-shape)" fingers={['x', 2, 4, 4, 3, 2]} size="medium" />
                </div>
                <Tab>{`  e |--2--|  (index barre)
  B |--3--|  (middle finger)
  G |--4--|  (ring finger)
  D |--4--|  (pinky)
  A |--2--|  (index barre = root B)
  E |--x--|  (muted)`}</Tab>
                <p className="text-purple-200 text-xs mt-3 leading-relaxed">
                  Middle finger on B string at fret 3. Ring and pinky on G and D strings at fret 4.
                  This compact three-finger cluster can feel tight at first — spread your fingers as far
                  as comfortable.
                </p>
              </Card>

              <Callout type="tip">
                Some players find it easier to use ring finger alone to barre strings 2–4 two frets above the
                barre (same as A-shape major) and then simply not play the high e string for A minor shape.
                Experiment and use whichever fingering gives you the cleanest sound.
              </Callout>

              <Card>
                <h3 className="text-white font-semibold mb-3">Bm, Cm, Dm, Em — A-shape minor TAB</h3>
                <Tab>{`  Bm (fret 2)   Cm (fret 3)   Dm (fret 5)   Em (fret 7)
  e |--2--|    e |--3--|    e |--5--|    e |--7--|
  B |--3--|    B |--4--|    B |--6--|    B |--8--|
  G |--4--|    G |--5--|    G |--7--|    G |--9--|
  D |--4--|    D |--5--|    D |--7--|    D |--9--|
  A |--2--|    A |--3--|    A |--5--|    A |--7--|
  E |--x--|    E |--x--|    E |--x--|    E |--x--|`}</Tab>
              </Card>

              <Card>
                <h3 className="text-white font-semibold mb-1">All 12 minor chords — A-shape</h3>
                <p className="text-purple-200 text-xs mb-2">Root note is on the A string (string 5). Low E is muted.</p>
                <ChordTable chords={A_SHAPE_MINOR} />
              </Card>

              <Callout type="insight">
                Now you have four shapes: E-major, E-minor, A-major, A-minor. Every major or minor chord can
                be played in at least two different positions on the neck using these shapes. This means you
                can choose the voicing closest to where you already are, making chord transitions much smoother.
              </Callout>

              <Card>
                <h3 className="text-white font-semibold mb-3">Am open vs. Dm A-shape barre comparison</h3>
                <div className="flex gap-6 flex-wrap justify-center mb-3">
                  <ChordDiagram chordName="Open Am" fingers={['x', 0, 2, 2, 1, 0]} size="medium" />
                  <ChordDiagram chordName="Dm (barre)" fingers={['x', 5, 7, 7, 6, 5]} size="medium" />
                </div>
                <Tab>{`  Open Am                Dm (A-shape barre, fret 5)
  e |--0--|             e |--5--|
  B |--1--|             B |--6--|
  G |--2--|             G |--7--|
  D |--2--|             D |--7--|
  A |--0--|             A |--5--|  (root D)
  E |--x--|             E |--x--|`}</Tab>
                <p className="text-purple-200 text-xs mt-3">
                  The same Am shape moved up 5 frets gives you Dm. This relationship holds for every minor chord
                  — the Am shape IS the A-shape minor barre template.
                </p>
              </Card>

              <Callout type="exercise">
                <strong>Am shape relay:</strong> Play open Am. Then play Bm at fret 2 (A-shape). Then Cm at
                fret 3. Then Dm at fret 5. Say each name. Notice how the same hand shape produces four
                different chords just by moving up the neck.
              </Callout>
            </div>
          )}

          {/* ── Tab 5: Troubleshooting ───────────────────────────────────── */}
          {activeTab === 5 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Troubleshooting Common Problems</h2>

              <p className="text-purple-200 text-sm leading-relaxed mb-6">
                Every one of these problems is fixable — and every guitarist has encountered them. Click any
                problem to expand the solution.
              </p>

              {TROUBLE_ITEMS.map((item, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl mb-3 overflow-hidden">
                  <button
                    onClick={() => setOpenTrouble(openTrouble === i ? null : i)}
                    className="w-full text-left px-5 py-4 flex items-center justify-between hover:bg-white/5 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-purple-600/40 border border-purple-500/40 flex items-center justify-center text-purple-300 text-xs font-bold">
                        {item.icon}
                      </span>
                      <span className="text-white font-semibold text-sm">{item.title}</span>
                    </div>
                    <span className="text-purple-400 text-lg">{openTrouble === i ? "−" : "+"}</span>
                  </button>
                  {openTrouble === i && (
                    <div className="px-5 pb-5 border-t border-white/10 pt-4">
                      <ul className="space-y-2">
                        {item.content.map((point, j) => (
                          <li key={j} className="flex gap-2 text-sm text-purple-200 leading-relaxed">
                            <span className="text-purple-400 mt-0.5 shrink-0">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}

              <Callout type="exercise">
                <strong>30-second hold drill:</strong> Place a barre at fret 3 (G major, E-shape). Hold it with
                enough pressure that all strings ring. Hold for 30 seconds. Release completely. Shake out your
                hand. Rest 15 seconds. Repeat 5 times. Do this drill daily and within 2 weeks you will notice
                significantly more endurance and cleaner tone.
              </Callout>

              <Callout type="tip">
                A cheap and effective trick: practise barre chords on an acoustic guitar. Acoustics usually have
                higher action and need more hand strength than electrics. If you get clean barre chords on an
                acoustic, an electric will feel effortless by comparison.
              </Callout>

              <Card>
                <h3 className="text-white font-semibold mb-3">Thumb position — the hidden key</h3>
                <Tab>{`  Correct thumb position:

  Seen from the side:

  Index finger presses strings  ────────────>  ────────
                                               ────────
                                               ────────
  Thumb sits HERE on the back                  ────────
  of the neck, roughly behind   ────────────>  ────────
  the middle finger              (NOT near      ────────
                                  the top edge
                                  of the neck)`}</Tab>
                <p className="text-purple-200 text-xs mt-3 leading-relaxed">
                  When the thumb creeps up over the top edge of the neck, the hand loses leverage. Keep the
                  thumb roughly perpendicular to the neck, pressing into the middle of the back of the neck.
                  Think of it as a pinching action between thumb and index finger.
                </p>
              </Card>
            </div>
          )}

          {/* ── Tab 6: Practice & Songs ──────────────────────────────────── */}
          {activeTab === 6 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Practice Plan & Songs</h2>

              <Card>
                <h3 className="text-white font-semibold mb-4">4-Week Barre Chord Progression</h3>
                <div className="space-y-4">
                  {[
                    {
                      week: "Week 1",
                      focus: "F major — just hold it cleanly",
                      color: "border-purple-500",
                      tasks: [
                        "Place F major (E-shape, fret 1) and hold for 10 seconds. Release. Repeat 10 times.",
                        "Pluck each string individually to diagnose which ones buzz.",
                        "End every practice session with 5 minutes of barre holds.",
                        "Do not worry about transitions yet — just build the chord.",
                      ],
                    },
                    {
                      week: "Week 2",
                      focus: "F major → C (open) transitions",
                      color: "border-blue-500",
                      tasks: [
                        "Alternate: F major (barre) → C major (open) → F → C. Aim for 60 BPM, 4 beats per chord.",
                        "Add G major (E-shape, fret 3) into the rotation: F → C → G → C.",
                        "Try the I–IV–V in F: F → Bb (A-shape fret 1) → C → F.",
                        "Practise the sliding drill: F → F# → G → G# ... to fret 12.",
                      ],
                    },
                    {
                      week: "Week 3",
                      focus: "Add Bm — play I–V–vi–IV in G",
                      color: "border-green-500",
                      tasks: [
                        "Learn Bm (E-shape minor, fret 7 OR A-shape minor, fret 2).",
                        "Practise I–V–vi–IV in G: G → D → Em (open) → C.",
                        "Now try it with barre chords only: G (E-shape fret 3) → D (A-shape fret 5) → Bm → C.",
                        "Practise F#m (E-shape minor, fret 2) — common in songs in D and A.",
                      ],
                    },
                    {
                      week: "Week 4",
                      focus: "Full songs with barre chords",
                      color: "border-amber-500",
                      tasks: [
                        "Pick one song from the list below and learn it chord by chord.",
                        "Focus on smooth transitions — no stopping between chords.",
                        "Try playing the same progression in multiple positions on the neck.",
                        "Mix open chords and barre chords freely in a single progression.",
                      ],
                    },
                  ].map((w) => (
                    <div key={w.week} className={`border-l-4 ${w.color} bg-black/20 rounded-xl p-4`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-white font-bold text-sm">{w.week}</span>
                        <span className="text-purple-300 text-xs">— {w.focus}</span>
                      </div>
                      <ul className="space-y-1">
                        {w.tasks.map((t, i) => (
                          <li key={i} className="text-purple-200 text-xs flex gap-2 leading-relaxed">
                            <span className="text-purple-400 shrink-0">•</span>
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <h3 className="text-white font-semibold mb-4">Songs That Use Barre Chords</h3>
                <div className="space-y-4">
                  {[
                    {
                      title: "Wonderwall — Oasis",
                      difficulty: "Intermediate",
                      chords: "F#m (A-shape fret 2), B (A-shape fret 2), Em, G",
                      notes: "The iconic F#m and B chords are A-shape barre chords at frets 2 and 2 (different strings). The strumming pattern is as important as the chords.",
                      tab: `  F#m (A-shape, fret 2)     B (A-shape, fret 2)
  e |--2--|                  e |--2--|
  B |--2--|                  B |--4--|
  G |--2--|                  G |--4--|
  D |--4--|                  D |--4--|
  A |--4--|                  A |--2--|  (root = B)
  E |--2--|  (root = F#)     E |--x--|`,
                    },
                    {
                      title: "Smells Like Teen Spirit — Nirvana",
                      difficulty: "Beginner–Intermediate",
                      chords: "F5, Bb5, Ab5, Db5 (power chord barres)",
                      notes: "These are technically power chords (root + 5th), but the barre technique is the same. A great entry point because you only need two strings to ring clearly.",
                      tab: `  F5 (fret 1)   Bb5 (fret 6)   Ab5 (fret 4)   Db5 (fret 9)
  e |--x--|     e |--x--|      e |--x--|      e |--x--|
  B |--x--|     B |--x--|      B |--x--|      B |--x--|
  G |--x--|     G |--x--|      G |--x--|      G |--x--|
  D |--3--|     D |--8--|      D |--6--|      D |--11-|
  A |--3--|     A |--8--|      A |--6--|      A |--11-|
  E |--1--|     E |--6--|      E |--4--|      E |--9--|`,
                    },
                    {
                      title: "Hotel California — Eagles",
                      difficulty: "Intermediate–Advanced",
                      chords: "Bm, F#, A, E, G, D, Em, F#",
                      notes: "A mix of open and barre chords across several keys. Bm (A-shape or E-shape), F# major (E-shape fret 2), and the descending progression make this a fantastic barre chord workout.",
                      tab: `  Bm (E-shape, fret 7)   F# (E-shape, fret 2)
  e |--7--|               e |--2--|
  B |--7--|               B |--2--|
  G |--7--|               G |--3--|
  D |--9--|               D |--4--|
  A |--9--|               A |--4--|
  E |--7--|               E |--2--|`,
                    },
                    {
                      title: "No Woman No Cry — Bob Marley",
                      difficulty: "Beginner",
                      chords: "C, G, Am, F",
                      notes: "The F chord (E-shape, fret 1) is the only barre chord, but it appears on every cycle. Perfect for a beginner drilling the F chord in a real musical context.",
                      tab: `  Progression:  C  G  Am  F
                 (repeat)

  F (E-shape, fret 1):
  e |--1--|
  B |--1--|
  G |--2--|
  D |--3--|
  A |--3--|
  E |--1--|`,
                    },
                    {
                      title: "Wish You Were Here — Pink Floyd",
                      difficulty: "Beginner–Intermediate",
                      chords: "C, D, Am, G — Am and Dm as A-shape minors",
                      notes: "The intro is fingerpicked in open position, but the chord progression uses Am and Dm naturally. Try substituting the A-shape barre versions to practise transitions.",
                      tab: `  Am (A-shape barre, fret 5)   Dm (A-shape barre, fret 5... wait:)
  Note: Dm root = fret 5 on A string
  e |--5--|                      e |--5--|
  B |--5--|                      B |--6--|
  G |--5--|                      G |--7--|
  D |--7--|                      D |--7--|
  A |--7--|                      A |--5--|  (root = D)
  E |--x--|                      E |--x--|`,
                    },
                  ].map((song) => (
                    <div key={song.title} className="bg-black/20 border border-white/10 rounded-xl p-4">
                      <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                        <h4 className="text-white font-semibold text-sm">{song.title}</h4>
                        <span className="text-xs text-purple-400 bg-purple-900/40 px-2 py-0.5 rounded-full">
                          {song.difficulty}
                        </span>
                      </div>
                      <p className="text-purple-300 text-xs font-medium mb-1">Chords: {song.chords}</p>
                      <p className="text-purple-200 text-xs leading-relaxed mb-3">{song.notes}</p>
                      <Tab>{song.tab}</Tab>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <h3 className="text-white font-semibold mb-4">Complete Barre Chord Reference Chart</h3>
                <p className="text-purple-200 text-xs mb-4 leading-relaxed">
                  Every note on the neck as a major or minor chord — two shapes, one chart.
                  E = E-shape (root on string 6). A = A-shape (root on string 5).
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr>
                        <th className="text-left text-purple-300 pb-2 pr-4 font-semibold">Note</th>
                        <th className="text-center text-purple-300 pb-2 px-2 font-semibold">E-major fret</th>
                        <th className="text-center text-purple-300 pb-2 px-2 font-semibold">A-major fret</th>
                        <th className="text-center text-purple-300 pb-2 px-2 font-semibold">E-minor fret</th>
                        <th className="text-center text-purple-300 pb-2 px-2 font-semibold">A-minor fret</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["A",   "5", "12", "5", "12"],
                        ["A#",  "6",  "1", "6",  "1"],
                        ["B",   "7",  "2", "7",  "2"],
                        ["C",   "8",  "3", "8",  "3"],
                        ["C#",  "9",  "4", "9",  "4"],
                        ["D",  "10",  "5","10",  "5"],
                        ["D#", "11",  "6","11",  "6"],
                        ["E",  "12",  "7","12",  "7"],
                        ["F",   "1",  "8", "1",  "8"],
                        ["F#",  "2",  "9", "2",  "9"],
                        ["G",   "3", "10", "3", "10"],
                        ["G#",  "4", "11", "4", "11"],
                      ].map(([note, em, am, emi, ami]) => (
                        <tr key={note} className="border-t border-white/5">
                          <td className="text-white font-bold py-2 pr-4">{note}</td>
                          <td className="text-green-300 text-center py-2 px-2">{em}</td>
                          <td className="text-blue-300 text-center py-2 px-2">{am}</td>
                          <td className="text-green-300/70 text-center py-2 px-2">{emi}</td>
                          <td className="text-blue-300/70 text-center py-2 px-2">{ami}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-purple-400 text-xs mt-3">
                  Green = E-shape (low E string root) | Blue = A-shape (A string root)
                </p>
              </Card>

              <Callout type="insight">
                Notice that every chord appears in at least two positions — one E-shape and one A-shape. When
                you are in the middle of a song and need to play Bb, you have a choice: A-shape at fret 1 (low
                on the neck) or E-shape at fret 6 (higher on the neck). Pick whichever is closer to where your
                hand already is. That is the real power of knowing both shapes.
              </Callout>

              <Callout type="exercise">
                <strong>Two-shape workout:</strong> Pick any chord — say, D major. Play it as an E-shape barre
                (fret 10). Then as an A-shape barre (fret 5). Then the open D chord. Three ways to play the
                same chord. Repeat for C, G, A, E. This will completely change how you think about the fretboard.
              </Callout>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
