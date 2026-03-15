"use client"

import React, { useState } from "react"
import Link from "next/link"

// ─── Types ───────────────────────────────────────────────────────────────────

type CalloutType = "tip" | "warning" | "insight" | "exercise"
type TimeOption = 15 | 30 | 45 | 60 | 90
type Level = "Beginner" | "Intermediate" | "Advanced"
type FocusArea =
  | "Chords"
  | "Scales"
  | "Technique"
  | "Theory"
  | "Improvisation"
  | "Rhythm"
  | "Repertoire"
  | "Sight Reading"

interface RoutineBlock {
  category: "warm-up" | "technique" | "theory" | "repertoire" | "scales" | "rhythm" | "improvisation" | "chords" | "sight-reading"
  name: string
  duration: number
  description: string
}

// ─── Callout Component ───────────────────────────────────────────────────────

function Callout({ type, children }: { type: CalloutType; children: React.ReactNode }) {
  const styles: Record<CalloutType, { border: string; bg: string; icon: string; label: string }> = {
    tip:      { border: "border-blue-400",   bg: "bg-blue-400/10",   icon: "💡", label: "Tip" },
    warning:  { border: "border-amber-400",  bg: "bg-amber-400/10",  icon: "⚠️", label: "Watch Out" },
    insight:  { border: "border-purple-400", bg: "bg-purple-400/10", icon: "✨", label: "Insight" },
    exercise: { border: "border-green-400",  bg: "bg-green-400/10",  icon: "🎯", label: "Exercise" },
  }
  const s = styles[type]
  return (
    <div className={`border-l-4 ${s.border} ${s.bg} rounded-r-xl p-4 mb-4`}>
      <p className="text-sm font-semibold text-white/70 mb-1">{s.icon} {s.label}</p>
      <div className="text-white/90 text-sm leading-relaxed">{children}</div>
    </div>
  )
}

// ─── Card Component ───────────────────────────────────────────────────────────

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white/5 border border-white/10 rounded-2xl p-5 mb-4 ${className}`}>
      {children}
    </div>
  )
}

// ─── Category Pill ───────────────────────────────────────────────────────────

function CategoryPill({ category }: { category: RoutineBlock["category"] }) {
  const colors: Record<RoutineBlock["category"], string> = {
    "warm-up":      "bg-blue-600 text-white",
    "technique":    "bg-orange-500 text-white",
    "theory":       "bg-purple-600 text-white",
    "repertoire":   "bg-green-600 text-white",
    "scales":       "bg-cyan-600 text-white",
    "rhythm":       "bg-pink-600 text-white",
    "improvisation":"bg-amber-500 text-white",
    "chords":       "bg-indigo-500 text-white",
    "sight-reading":"bg-teal-600 text-white",
  }
  const labels: Record<RoutineBlock["category"], string> = {
    "warm-up":      "Warm-Up",
    "technique":    "Technique",
    "theory":       "Theory",
    "repertoire":   "Repertoire",
    "scales":       "Scales",
    "rhythm":       "Rhythm",
    "improvisation":"Improv",
    "chords":       "Chords",
    "sight-reading":"Sight Reading",
  }
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${colors[category]}`}>
      {labels[category]}
    </span>
  )
}

// ─── TAB notation display ─────────────────────────────────────────────────────

function TabNotation({ lines }: { lines: string[] }) {
  return (
    <pre className="bg-black/40 border border-white/10 rounded-xl p-4 text-green-300 text-xs font-mono overflow-x-auto leading-relaxed">
      {lines.join("\n")}
    </pre>
  )
}

// ─── Routine Generation Logic ─────────────────────────────────────────────────

const EXERCISES: Record<Level, Record<FocusArea, Array<{ name: string; description: string; category: RoutineBlock["category"] }>>> = {
  Beginner: {
    Chords: [
      { name: "Chord Transitions", category: "chords", description: "G → C → D → Em — 1 min each, focus on clean finger placement and smooth changes" },
      { name: "Open Chord Shapes", category: "chords", description: "Hold each chord for 10 sec, check every string rings clearly before moving on" },
      { name: "Simple Song Run-Through", category: "repertoire", description: "Play a song you know using the chords you've been practising — aim for no stops" },
    ],
    Scales: [
      { name: "Pentatonic Position 1", category: "scales", description: "A minor pentatonic, low E to high E and back — start at 60bpm, no rushing" },
      { name: "Major Scale (1 octave)", category: "scales", description: "G major starting at 3rd fret — count each note aloud as you play" },
      { name: "Simple Melody", category: "repertoire", description: "Pick out a simple melody (Happy Birthday, Twinkle Twinkle) by ear or from TAB" },
    ],
    Technique: [
      { name: "Chromatic Crawl", category: "technique", description: "1-2-3-4 pattern on every string — focus on finger independence, not speed" },
      { name: "Pick Control", category: "technique", description: "Alternate pick single notes cleanly — listen for even tone on down and up strokes" },
      { name: "Simple Chord Song", category: "repertoire", description: "Apply technique in context — play a 2-chord song slowly and cleanly" },
    ],
    Theory: [
      { name: "Note Names on E String", category: "theory", description: "Memorise frets 1–12 on the low E string — say the note name as you play each fret" },
      { name: "Major Scale Formula", category: "theory", description: "W-W-H-W-W-W-H — play a C major scale and feel where the half steps land" },
      { name: "Apply Theory to Song", category: "repertoire", description: "Identify the chords in a song you know — what key is it in?" },
    ],
    Improvisation: [
      { name: "Pentatonic Noodling", category: "improvisation", description: "Stay in position 1 of A minor pentatonic — just explore, no wrong notes" },
      { name: "Call and Response", category: "improvisation", description: "Play a short 2-bar phrase, then answer it with a different 2-bar phrase" },
      { name: "Song Along", category: "repertoire", description: "Play rhythm behind a simple backing track or song recording" },
    ],
    Rhythm: [
      { name: "Down Strum Groove", category: "rhythm", description: "Quarter note down strums on muted strings at 80bpm — feel the pulse" },
      { name: "D-DU Strum Pattern", category: "rhythm", description: "Count 1-2-& → D-D-U. Use Em and Am to practise changing while strumming" },
      { name: "Strummed Song", category: "repertoire", description: "Play a full song using your strum pattern — aim for steady tempo throughout" },
    ],
    Repertoire: [
      { name: "Run Current Song", category: "repertoire", description: "Play your current song from start to finish — note any trouble spots" },
      { name: "Drill Trouble Spots", category: "technique", description: "Isolate any bar or transition that broke down and repeat it 10 times slowly" },
      { name: "Slow + Clean Pass", category: "repertoire", description: "Play the whole song at 75% speed — prioritise clean notes over tempo" },
    ],
    "Sight Reading": [
      { name: "Open String Notes", category: "sight-reading", description: "Identify E-A-D-G-B-e on the staff — draw and label them from memory" },
      { name: "First Position Reading", category: "sight-reading", description: "Read simple single-note melodies in first position from a beginner songbook" },
      { name: "Apply Reading", category: "repertoire", description: "Try to read a simple melody you've never played — it's okay to be slow" },
    ],
  },
  Intermediate: {
    Chords: [
      { name: "Barre Chord Transitions", category: "chords", description: "F major → B minor → E major barre — clean transitions with a metronome" },
      { name: "Jazz Voicings", category: "chords", description: "Drop-2 voicings on strings 4-3-2-1 — Cmaj7, Am7, Dm7, G7 progression" },
      { name: "Chord Melody Fragment", category: "repertoire", description: "Play a short chord melody arrangement — melody on top, chords below" },
    ],
    Scales: [
      { name: "Pentatonic Positions 1+2", category: "scales", description: "Connect position 1 and 2 without stopping — use a ii-V-I backing track" },
      { name: "Major Scale (2 octaves)", category: "scales", description: "G major across the full neck, multiple positions — 100bpm, in 3rds" },
      { name: "Improvisation Study", category: "improvisation", description: "Solo over a one-chord vamp (Am) using only scales you practised — listen back" },
    ],
    Technique: [
      { name: "Legato Runs", category: "technique", description: "Hammer-on/pull-off sequences on one string — aim for even volume between picked and legato notes" },
      { name: "Bends to Pitch", category: "technique", description: "Bend the 7th fret G string to match the 9th fret pitch — check with a tuner or by ear" },
      { name: "Speed Building", category: "technique", description: "Pick a lick at 80% max speed, add 4bpm every 2 clean runs — stop at first mistake" },
    ],
    Theory: [
      { name: "Modes Overview", category: "theory", description: "Play Dorian mode (minor scale starting from 2nd degree) — identify its characteristic note" },
      { name: "ii-V-I Progression", category: "theory", description: "Dm7-G7-Cmaj7 in multiple keys — understand why this is the most important jazz progression" },
      { name: "Transcribe a Lick", category: "theory", description: "Pick a 4-bar lick from a song you love and figure it out by ear" },
    ],
    Improvisation: [
      { name: "Pentatonic + Blue Note", category: "improvisation", description: "Add the flat 5 (blue note) to your pentatonic phrases — use it as a passing tone" },
      { name: "Motif Development", category: "improvisation", description: "Create a 2-note motif, then build a 16-bar solo developing only that motif" },
      { name: "Target Notes", category: "improvisation", description: "Aim to land on chord tones (1-3-5-7) on beat 1 of each bar change" },
    ],
    Rhythm: [
      { name: "Syncopated Strumming", category: "rhythm", description: "DDUUDU pattern — mute on beat 3. Use Em and A. Aim for 110bpm" },
      { name: "Funk 16th Notes", category: "rhythm", description: "Muted strings with ghost notes — emphasise the upbeats for that funk feel" },
      { name: "Groove Song", category: "repertoire", description: "Play a full song with your syncopated pattern — record yourself and listen back" },
    ],
    Repertoire: [
      { name: "Performance Run-Through", category: "repertoire", description: "Play your current piece as if performing — no stops, keep going through mistakes" },
      { name: "Trouble Section Drill", category: "technique", description: "Loop any rough section 15 times — slow, medium, then performance tempo" },
      { name: "New Song Start", category: "repertoire", description: "Begin learning a new song — learn the first 8 bars today" },
    ],
    "Sight Reading": [
      { name: "Reading in Position", category: "sight-reading", description: "Read a 16-bar exercise in 2nd or 5th position — track notes without looking down" },
      { name: "Rhythm Reading", category: "sight-reading", description: "Clap or tap a rhythm exercise before playing — understand the notation first" },
      { name: "New Piece Cold Read", category: "repertoire", description: "Read a new piece of music cold — note what tripped you up and revisit it" },
    ],
  },
  Advanced: {
    Chords: [
      { name: "Chord Substitutions", category: "chords", description: "Tritone substitutions over a ii-V-I — replace G7 with Db7 and hear the tension" },
      { name: "Upper Structure Triads", category: "chords", description: "Play a triad a major 2nd above the root over dominant chords — creates 9th/13th colour" },
      { name: "Chord Melody Arrangement", category: "repertoire", description: "Arrange a jazz standard as a chord melody solo piece — work on one 8-bar section" },
    ],
    Scales: [
      { name: "All 5 Pentatonic Positions", category: "scales", description: "Connect all 5 positions with no pauses — visualise the whole neck as one shape" },
      { name: "Melodic Minor Applications", category: "scales", description: "Use melodic minor over a minor major 7th chord — identify the characteristic #6 and #7" },
      { name: "Improvise over Changes", category: "improvisation", description: "Solo over a full 12-bar blues or rhythm changes, targeting chord tones as they change" },
    ],
    Technique: [
      { name: "Sweep Picking Arpeggio", category: "technique", description: "3-string major arpeggio sweep at 80bpm — rake the pick across strings in one fluid motion" },
      { name: "Economy Picking Lick", category: "technique", description: "3-notes-per-string scale run using economy picking — alternate within strings, sweep across" },
      { name: "Vibrato Width Control", category: "technique", description: "Slow wide vibrato vs. fast narrow vibrato — nail the distinction for expressive phrasing" },
    ],
    Theory: [
      { name: "Modal Harmony", category: "theory", description: "Compose a 4-bar phrase that clearly establishes Lydian mode — focus on the #4 as the key sound" },
      { name: "Reharmonisation Exercise", category: "theory", description: "Take a simple tune and reharmonise every bar — use secondary dominants and borrowed chords" },
      { name: "Compose and Record", category: "repertoire", description: "Write a 16-bar composition using today's theory concept — record it even on your phone" },
    ],
    Improvisation: [
      { name: "Motivic Development", category: "improvisation", description: "Build a 2-minute solo from one 3-note motif — vary it rhythmically and harmonically" },
      { name: "Outside Playing", category: "improvisation", description: "Intentionally play outside the key for 1-2 bars, then resolve back — tension and release" },
      { name: "Transcription Study", category: "improvisation", description: "Transcribe and analyse 8 bars from a master improviser — identify their device" },
    ],
    Rhythm: [
      { name: "Odd Time Groove", category: "rhythm", description: "Strum a groove in 7/8 or 5/4 — subdivide as 4+3 or 3+2 to feel it naturally" },
      { name: "Polyrhythm Exercise", category: "rhythm", description: "Play 3 against 4 — tap your foot in 4/4 while playing triplets. Then switch" },
      { name: "Studio-Quality Take", category: "repertoire", description: "Record a rhythm part to a click track aiming for a usable take — no punch-ins" },
    ],
    Repertoire: [
      { name: "Concert-Ready Performance", category: "repertoire", description: "Play your piece from memory at performance tempo — visualise the audience" },
      { name: "Technical Breakdown", category: "technique", description: "Identify the single hardest bar and do 20 focused repetitions with a metronome" },
      { name: "Arrangement Refinement", category: "repertoire", description: "Polish dynamics, phrasing, and expression — the notes are the skeleton, make it breathe" },
    ],
    "Sight Reading": [
      { name: "Complex Rhythm Reading", category: "sight-reading", description: "Read a page with syncopation, triplets, and ties — count aloud before playing" },
      { name: "Ensemble Part Reading", category: "sight-reading", description: "Read a guitar part from a real ensemble piece — maintain the steady tempo" },
      { name: "Improvise Off the Page", category: "improvisation", description: "Read a melody, then immediately improvise variations on it — bridge reading and creativity" },
    ],
  },
}

function generateRoutine(time: TimeOption, level: Level, focuses: FocusArea[]): RoutineBlock[] {
  const warmUpTime = time <= 15 ? 3 : time <= 30 ? 5 : 7
  const remainingTime = time - warmUpTime

  const blocks: RoutineBlock[] = [
    {
      category: "warm-up",
      name: "Warm-Up",
      duration: warmUpTime,
      description:
        time <= 15
          ? "Finger stretches + slow chromatic exercise (1-2-3-4) on all strings at 60bpm"
          : time <= 30
          ? "Finger stretches, chromatic exercise (60→80bpm), spider walk drill"
          : "Full warm-up: stretches, chromatic, spider walk, light strumming — build heat gradually",
    },
  ]

  if (focuses.length === 0) {
    blocks.push({
      category: "chords",
      name: "Free Practice",
      duration: remainingTime,
      description: "Select a focus area above to get a tailored routine — for now, play whatever feels good",
    })
    return blocks
  }

  const effectiveFocuses = focuses.slice(0, time <= 15 ? 1 : time <= 30 ? 2 : time <= 60 ? 3 : 4)
  const timePerFocus = Math.floor(remainingTime / effectiveFocuses.length)
  const leftover = remainingTime - timePerFocus * effectiveFocuses.length

  effectiveFocuses.forEach((focus, i) => {
    const exerciseList = EXERCISES[level][focus]
    const exercisesAvailable = exerciseList.length
    const pick = exerciseList[Math.min(i, exercisesAvailable - 1)]
    const duration = i === 0 ? timePerFocus + leftover : timePerFocus
    blocks.push({
      category: pick.category,
      name: pick.name,
      duration,
      description: pick.description,
    })
  })

  return blocks
}

// ─── Tab 1: Why Routine Matters ───────────────────────────────────────────────

function WhyRoutineTab() {
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">Why Routine Matters</h2>

      <Card>
        <h3 className="text-lg font-semibold text-purple-300 mb-2">Noodling vs. Practising</h3>
        <p className="text-white/80 text-sm leading-relaxed mb-3">
          Most guitarists pick up their guitar, play what they already know, noodle around for 30 minutes,
          and put it down. That feels good — but it is not practice. It does not make you better.
        </p>
        <p className="text-white/80 text-sm leading-relaxed">
          Deliberate practice means working on specific skills at the edge of your ability, with focused
          attention, correcting mistakes as you go. A 20-minute deliberate session will do more for you
          than two hours of comfortable noodling.
        </p>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-purple-300 mb-3">The 4 Pillars of Every Session</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { pill: "bg-blue-600", label: "1. Warm-Up", desc: "Prepare your hands and mind. Prevent injury. Never skip this even if you only have 5 minutes." },
            { pill: "bg-orange-500", label: "2. Technique", desc: "The mechanics of playing — scales, picking, fretting, bends. Build the physical skill." },
            { pill: "bg-purple-600", label: "3. Theory / Learning", desc: "Understand what you're playing. Chords, progressions, modes — the language of music." },
            { pill: "bg-green-600", label: "4. Repertoire", desc: "Apply everything to real music. Songs, solos, and pieces are the point of all the work." },
          ].map((p) => (
            <div key={p.label} className="bg-white/5 rounded-xl p-3">
              <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold text-white ${p.pill} mb-2`}>{p.label}</span>
              <p className="text-white/75 text-sm">{p.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      <Callout type="insight">
        Shorter focused sessions beat long unfocused ones every time. Your brain can only absorb deep
        learning for about 20-30 minutes before diminishing returns set in. When your mind starts
        wandering, stop — you are no longer practising.
      </Callout>

      <Card>
        <h3 className="text-lg font-semibold text-purple-300 mb-2">The 80/20 Rule for Guitar</h3>
        <p className="text-white/80 text-sm leading-relaxed mb-3">
          80% of your progress will come from 20% of your practice time — specifically, from working on
          your weakest area. It is tempting to spend all your time on what you are already good at because
          it feels rewarding. Resist this.
        </p>
        <p className="text-white/80 text-sm leading-relaxed">
          Ask yourself honestly: what is holding me back right now? Barre chords? Rhythm? Staying in
          time? That is where your 20% should go. Use the Routine Builder tab to build sessions that
          deliberately target your weak spot.
        </p>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-purple-300 mb-2">Consistency Over Duration</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 text-center">
            <p className="text-green-400 font-bold text-lg">20 min × 7 days</p>
            <p className="text-white/70 text-sm mt-1">= 140 min/week</p>
            <p className="text-green-300 text-xs mt-2 font-medium">Daily repetition = deep muscle memory</p>
          </div>
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-center">
            <p className="text-red-400 font-bold text-lg">3 hrs on Saturday</p>
            <p className="text-white/70 text-sm mt-1">= 180 min/week</p>
            <p className="text-red-300 text-xs mt-2 font-medium">Weekend sessions = fatigue + forgetting</p>
          </div>
        </div>
        <p className="text-white/75 text-sm">
          The daily player wins. Even 10 minutes every single day is more effective than a long session
          once or twice a week. Schedule it like a meeting — same time, same place.
        </p>
      </Card>

      <Callout type="warning">
        Your fingers need sleep too. Muscle memory and motor skills solidify during rest — specifically
        during sleep. If you practise something new, the neural pathways are still forming overnight.
        Playing for 3 hours straight does not give you 9x the benefit of a 20-minute session.
      </Callout>

      <Card>
        <h3 className="text-lg font-semibold text-purple-300 mb-2">Keep a Practice Journal</h3>
        <p className="text-white/80 text-sm leading-relaxed mb-3">
          The simplest habit that separates improving players from plateaued ones: write down what you
          practised, at what tempo, and how it felt. Even three lines in a notes app is enough.
        </p>
        <ul className="space-y-1 text-sm text-white/75">
          <li className="flex items-start gap-2"><span className="text-purple-400 mt-0.5">•</span>Date and duration of session</li>
          <li className="flex items-start gap-2"><span className="text-purple-400 mt-0.5">•</span>What you worked on and current metronome speed</li>
          <li className="flex items-start gap-2"><span className="text-purple-400 mt-0.5">•</span>What felt hard / what improved</li>
          <li className="flex items-start gap-2"><span className="text-purple-400 mt-0.5">•</span>Goal for the next session</li>
        </ul>
      </Card>

      <Callout type="tip">
        Start your next session by reading your last journal entry. It immediately restores context,
        reminds you of your goal, and makes every session connect to the one before it.
      </Callout>
    </div>
  )
}

// ─── Tab 2: Routine Builder ───────────────────────────────────────────────────

const TIME_OPTIONS: TimeOption[] = [15, 30, 45, 60, 90]
const LEVELS: Level[] = ["Beginner", "Intermediate", "Advanced"]
const FOCUS_AREAS: FocusArea[] = [
  "Chords", "Scales", "Technique", "Theory",
  "Improvisation", "Rhythm", "Repertoire", "Sight Reading",
]

function RoutineBuilderTab() {
  const [time, setTime] = useState<TimeOption>(30)
  const [level, setLevel] = useState<Level>("Beginner")
  const [focuses, setFocuses] = useState<FocusArea[]>(["Chords"])

  const toggleFocus = (f: FocusArea) => {
    setFocuses((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    )
  }

  const routine = generateRoutine(time, level, focuses)
  const totalTime = routine.reduce((sum, b) => sum + b.duration, 0)

  const maxFocuses = time <= 15 ? 1 : time <= 30 ? 2 : time <= 60 ? 3 : 4
  const noteForMax =
    focuses.length > maxFocuses
      ? `Only the first ${maxFocuses} focus area${maxFocuses > 1 ? "s" : ""} will be used for a ${time}-min session.`
      : null

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-1">Routine Builder</h2>
      <p className="text-white/60 text-sm mb-6">Choose your time, level, and focus areas to generate a tailored practice plan.</p>

      {/* Step 1 — Time */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-4">
        <p className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-3">Step 1 — How much time do you have?</p>
        <div className="flex flex-wrap gap-2">
          {TIME_OPTIONS.map((t) => (
            <button
              key={t}
              onClick={() => setTime(t)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                time === t
                  ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              {t} min
            </button>
          ))}
        </div>
      </div>

      {/* Step 2 — Level */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-4">
        <p className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-3">Step 2 — What is your level?</p>
        <div className="flex flex-wrap gap-2">
          {LEVELS.map((l) => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                level === l
                  ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Step 3 — Focus Areas */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
        <p className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-1">Step 3 — Pick your focus areas</p>
        <p className="text-white/40 text-xs mb-3">Select one or more. Multi-select supported — time is split proportionally.</p>
        <div className="flex flex-wrap gap-2">
          {FOCUS_AREAS.map((f) => (
            <button
              key={f}
              onClick={() => toggleFocus(f)}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${
                focuses.includes(f)
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                  : "bg-white/10 text-purple-300 hover:bg-white/20"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        {noteForMax && (
          <p className="text-amber-400 text-xs mt-3">Note: {noteForMax}</p>
        )}
      </div>

      {/* Generated Routine */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold text-base">Your Practice Routine</h3>
          <span className="bg-amber-500/20 text-amber-400 text-xs font-semibold px-3 py-1 rounded-full border border-amber-500/30">
            {totalTime} min total
          </span>
        </div>

        <div className="space-y-3">
          {routine.map((block, i) => (
            <div key={i} className="flex items-start gap-3 bg-white/5 rounded-xl p-4 border border-white/5">
              <div className="flex-shrink-0 text-center">
                <span className="block text-white font-bold text-lg leading-none">{block.duration}</span>
                <span className="text-white/40 text-xs">min</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <CategoryPill category={block.category} />
                  <span className="text-white font-semibold text-sm">{block.name}</span>
                </div>
                <p className="text-white/65 text-xs leading-relaxed">{block.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Time bar */}
        <div className="mt-4">
          <div className="flex rounded-full overflow-hidden h-2 gap-0.5">
            {routine.map((block, i) => {
              const catColors: Record<RoutineBlock["category"], string> = {
                "warm-up": "bg-blue-500",
                "technique": "bg-orange-500",
                "theory": "bg-purple-500",
                "repertoire": "bg-green-500",
                "scales": "bg-cyan-500",
                "rhythm": "bg-pink-500",
                "improvisation": "bg-amber-500",
                "chords": "bg-indigo-500",
                "sight-reading": "bg-teal-500",
              }
              return (
                <div
                  key={i}
                  className={`${catColors[block.category]} transition-all duration-300`}
                  style={{ width: `${(block.duration / totalTime) * 100}%` }}
                />
              )
            })}
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
            {routine.map((block, i) => (
              <span key={i} className="text-white/50 text-xs">
                {block.name}: {Math.round((block.duration / totalTime) * 100)}%
              </span>
            ))}
          </div>
        </div>
      </div>

      <Callout type="tip">
        Print or screenshot your routine, then post it near your practice space. Alternatively, copy it
        into a notes app. Having it visible means you spend zero time deciding what to work on — you just
        start the timer and go.
      </Callout>
    </div>
  )
}

// ─── Tab 3: Warm-Up Exercises ─────────────────────────────────────────────────

function WarmUpTab() {
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">Warm-Up Exercises</h2>
      <p className="text-white/60 text-sm mb-6">
        Never skip a warm-up. Cold hands play sloppy, tense, and — over time — injured. These exercises
        take 5-10 minutes and pay for themselves every session.
      </p>

      {/* 1 Chromatic */}
      <Card>
        <h3 className="text-lg font-semibold text-purple-300 mb-1">1. Chromatic Exercise (Spider Walk)</h3>
        <p className="text-white/70 text-sm mb-3">
          One finger per fret, in order, ascending and descending on every string. The most fundamental
          warm-up for finger independence and synchronisation between picking hand and fretting hand.
        </p>
        <TabNotation lines={[
          "e|--1-2-3-4--|",
          "B|--1-2-3-4--|",
          "G|--1-2-3-4--|",
          "D|--1-2-3-4--|",
          "A|--1-2-3-4--|",
          "E|--1-2-3-4--|",
        ]} />
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="text-xs bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full border border-blue-500/30">Start: 60bpm</span>
          <span className="text-xs bg-green-500/20 text-green-300 px-3 py-1 rounded-full border border-green-500/30">Progress: +4bpm when clean</span>
          <span className="text-xs bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full border border-amber-500/30">Use alternate picking</span>
        </div>
        <Callout type="tip">
          Use a metronome every time. The point is not to go fast — it is to go perfectly in time.
          Play each note exactly on the click. Even one note rushing is sloppy technique.
        </Callout>
      </Card>

      {/* 2 Finger Independence */}
      <Card>
        <h3 className="text-lg font-semibold text-purple-300 mb-1">2. Finger Independence</h3>
        <p className="text-white/70 text-sm mb-3">
          Changing the order of the fingers breaks ingrained patterns and forces each finger to act
          independently. The hardest variants (1-4-2-3, 1-3-4-2) will expose weak fingers immediately.
        </p>
        <TabNotation lines={[
          "-- Pattern A: 1-3-2-4 --",
          "e|--1-3-2-4--|",
          "B|--1-3-2-4--|",
          "",
          "-- Pattern B: 1-4-2-3 --",
          "e|--1-4-2-3--|",
          "B|--1-4-2-3--|",
          "",
          "-- Pattern C: 2-4-1-3 --",
          "e|--2-4-1-3--|",
          "B|--2-4-1-3--|",
        ]} />
        <p className="text-white/60 text-xs mt-3">
          Move each pattern across all 6 strings before trying the next pattern.
          Slow is fast — start at 50bpm and only increase when all fingers land cleanly.
        </p>
      </Card>

      {/* 3 String Skipping */}
      <Card>
        <h3 className="text-lg font-semibold text-purple-300 mb-1">3. String Skipping</h3>
        <p className="text-white/70 text-sm mb-3">
          Forces your picking hand to develop accuracy and control when jumping strings. It also trains
          your fretting hand to stay in position while your picking hand moves.
        </p>
        <TabNotation lines={[
          "e|--5-------5------|",
          "B|----5---5---------|",
          "G|------5-----------|",
          "D|------------------|",
          "A|--5-------5-------|",
          "E|----5---5---------|",
          "",
          "(Repeat descending: high e → A → E → D → G → B)",
        ]} />
        <p className="text-white/60 text-xs mt-3">
          Keep your picking arm still and let only your wrist move. Watch for unintentional string noise
          on the skipped strings — mute lightly with the fretting hand.
        </p>
      </Card>

      {/* 4 Legato Warm-up */}
      <Card>
        <h3 className="text-lg font-semibold text-purple-300 mb-1">4. Legato Warm-Up</h3>
        <p className="text-white/70 text-sm mb-3">
          Hammer-ons and pull-offs in isolation to activate finger strength and the left/right hand
          independence needed for smooth legato playing. Especially valuable before any lead playing.
        </p>
        <TabNotation lines={[
          "-- Hammer-ons --",
          "e|--5h7h8h10-----------|",
          "B|--5h7h8h10-----------|",
          "",
          "-- Pull-offs --",
          "e|--10p8p7p5-----------|",
          "B|--10p8p7p5-----------|",
          "",
          "-- Combined (trill) --",
          "e|--5h7p5h7p5h7--------|",
        ]} />
        <Callout type="tip">
          Hammer-ons: strike the string firmly with just the fretting finger — no picking.
          Pull-offs: pull the finger slightly downward (toward the floor) as you lift it, plucking the string.
        </Callout>
      </Card>

      {/* 5 Stretch & Relax */}
      <Card>
        <h3 className="text-lg font-semibold text-purple-300 mb-1">5. Stretch and Relax (Physical)</h3>
        <p className="text-white/70 text-sm mb-4">
          Especially important if you have not played for a day or more. Cold tendons + enthusiastic
          playing = repetitive strain injury. Spend 2-3 minutes on these before picking up the guitar.
        </p>
        <div className="space-y-3">
          {[
            { name: "Wrist Circles", desc: "Extend one arm forward, make 10 slow circles inward, 10 outward. Repeat both wrists." },
            { name: "Finger Pulls", desc: "Gently pull each finger back toward your wrist for 10 seconds per finger. Feel the stretch in the palm." },
            { name: "Forearm Stretch", desc: "Press palm flat against a wall with fingers pointing down, arm straight. Hold 30 seconds each side." },
            { name: "Prayer Stretch", desc: "Press palms together in front of chest, fingers pointing up. Slowly lower hands — stop if you feel sharp pain." },
            { name: "Shake It Out", desc: "Shake both hands loosely from the wrist for 10 seconds. This releases residual tension and increases blood flow." },
          ].map((s) => (
            <div key={s.name} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-600/40 flex items-center justify-center text-purple-300 text-xs font-bold mt-0.5">→</span>
              <div>
                <span className="text-white font-medium text-sm">{s.name}: </span>
                <span className="text-white/65 text-sm">{s.desc}</span>
              </div>
            </div>
          ))}
        </div>
        <Callout type="warning">
          Never force a stretch. You should feel tension, not pain. If anything hurts sharply — stop.
          Guitarists who ignore early warning signs of strain develop tendinitis that can sideline them
          for months. Warm up, play with good posture, and take breaks.
        </Callout>
      </Card>
    </div>
  )
}

// ─── Tab 4: Exercise Library ──────────────────────────────────────────────────

interface ExerciseGroup {
  title: string
  color: string
  exercises: { name: string; description: string; tip?: string }[]
}

const EXERCISE_LIBRARY: ExerciseGroup[] = [
  {
    title: "Chords",
    color: "bg-indigo-600",
    exercises: [
      {
        name: "Chord Transition Drill",
        description: "Set a timer for 2 minutes. Pick two chords. Change on every 4 beats with a metronome. Count clean changes only.",
        tip: "Start with G and C. When you can change cleanly 20 times in a row, add a third chord.",
      },
      {
        name: "1-Minute Changes",
        description: "Set a 60-second timer. Pick two chords. Count how many clean changes you can make. Record your score each session.",
        tip: "Beginners: 10-15 changes is solid. Intermediate: 20+. Advanced: 30+ with barre chords.",
      },
      {
        name: "Barre Chord Hold",
        description: "Hold the F major barre chord and press until every note rings clearly. Hold for 30 seconds. Rest. Repeat 5 times.",
        tip: "The bar should be just behind the fret (toward headstock). Roll your index finger slightly to the bone side of the pad.",
      },
      {
        name: "Chord Quality Comparison",
        description: "Play the same root note as major, minor, dominant 7th, and major 7th chords back to back. Listen to the colour of each.",
        tip: "Train your ear to recognise these sounds in isolation before you hear them in music.",
      },
    ],
  },
  {
    title: "Scales",
    color: "bg-cyan-600",
    exercises: [
      {
        name: "Position Practice",
        description: "Play one position of the pentatonic or major scale up and down with a metronome. 60bpm, then 80bpm, then 100bpm.",
        tip: "Don't move on until the position is automatic — you should be able to play it while having a conversation.",
      },
      {
        name: "Scale Sequences — Thirds",
        description: "Play scale degrees 1-3, then 2-4, then 3-5, and so on through the position. Then descend in thirds.",
        tip: "This is one of the best exercises for making scales sound musical instead of just 'up and down'.",
      },
      {
        name: "Scale Sequences — Patterns of 3",
        description: "Play 1-2-3, then 2-3-4, then 3-4-5 etc. ascending. Descend: top-down in triplets. Great for flowing licks.",
        tip: "Set your metronome to triplets (3 notes per click) for this one.",
      },
      {
        name: "Connecting Positions",
        description: "Play position 1 → shift to position 2 → shift to position 3 without stopping. Use a slow backing track.",
        tip: "The shift should be invisible to the listener. Visualise the next position before you arrive at it.",
      },
    ],
  },
  {
    title: "Technique",
    color: "bg-orange-500",
    exercises: [
      {
        name: "Bend and Return to Pitch",
        description: "Bend the 7th fret on the G string up a full tone. Match the pitch of the 9th fret exactly. Check with a tuner.",
        tip: "Use multiple fingers stacked behind the bending finger for strength. The bend must be in tune — out-of-tune bends are the most noticeable flaw in lead playing.",
      },
      {
        name: "Vibrato Control",
        description: "On the 9th fret, practice: 1) slow wide vibrato, 2) fast narrow vibrato, 3) vibrato that starts slow and builds speed.",
        tip: "Rock the whole hand from the wrist, not just the finger. Keep the pitch above the note, never below.",
      },
      {
        name: "Alternate Picking Tremolo",
        description: "Pick one note as fast as you can while alternate picking (D-U-D-U). Record your max clean BPM each session.",
        tip: "Tighten your grip slightly for control, then release tension in your forearm. Tension is the enemy of speed.",
      },
      {
        name: "Legato Runs",
        description: "A pentatonic pattern entirely with hammer-ons and pull-offs — no picking except the first note per string.",
        tip: "Volume should be even between picked and legato notes. If the legato notes are quieter, your fingers are not landing firmly enough.",
      },
    ],
  },
  {
    title: "Rhythm",
    color: "bg-pink-600",
    exercises: [
      {
        name: "Muted String Groove",
        description: "Mute all strings with your fretting hand palm. Strum DDUUDU pattern. Focus entirely on the feel — no notes, just rhythm.",
        tip: "This is how you discover your natural groove. If it does not feel good muted, it won't feel good with chords.",
      },
      {
        name: "8th Note Groove",
        description: "Simple D-U-D-U-D-U-D-U on one chord. Play it at 80bpm, then 100bpm, then 120bpm. Record yourself.",
        tip: "Your arm should move continuously down-up on every 8th note. Muting (resting) is just as important as strumming.",
      },
      {
        name: "Syncopated Pattern — DDUUDU",
        description: "The classic strum pattern: Down-Down-Up-Up-Down-Up. Mute on beat 3 (the 4th strum position). Count: 1-2-&-3-4-&.",
        tip: "Start at 70bpm. The mute on beat 3 is what gives it the syncopated feel — nail that rest.",
      },
      {
        name: "Reggae Offbeat",
        description: "ONLY strum on the offbeats (the &'s). Fully rest on beats 1-2-3-4. Count: - & - & - & - &",
        tip: "It feels unnatural at first because you're fighting the urge to play on the beat. That tension IS the reggae feel.",
      },
    ],
  },
  {
    title: "Improvisation",
    color: "bg-amber-500",
    exercises: [
      {
        name: "Play One Idea, Leave Space",
        description: "Over a backing track: play for 8 bars, then rest completely for 8 bars. Listen to yourself. What worked?",
        tip: "The rests are not empty — they are part of your solo. Some of the best solos ever recorded are 50% silence.",
      },
      {
        name: "Motif Development",
        description: "Pick two specific notes. Play them as a short motif. Spend 5 minutes varying that motif only — rhythm, register, articulation.",
        tip: "This trains you to develop ideas rather than just running scales. It is the difference between a musical solo and an exercise.",
      },
      {
        name: "Restrict to 3 Notes Only",
        description: "Choose any 3 notes. Build an entire improvised solo using only those 3 notes. Ignore all others completely.",
        tip: "Constraint forces creativity. Players who can say something interesting with 3 notes can say anything with the whole scale.",
      },
      {
        name: "Call and Response",
        description: "Play a 2-bar musical phrase (the call). Then answer it with a different 2-bar phrase (the response). Alternate.",
        tip: "The response should feel like it 'answers' the call. High pitch calling, low pitch answering — or tension answered by resolution.",
      },
    ],
  },
]

function ExerciseLibraryTab() {
  const [openGroup, setOpenGroup] = useState<string | null>("Chords")

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-2">Exercise Library</h2>
      <p className="text-white/60 text-sm mb-6">
        A curated library of drills organised by category. Expand a category to see individual
        exercises with full descriptions and tips.
      </p>

      <div className="space-y-3">
        {EXERCISE_LIBRARY.map((group) => (
          <div key={group.title} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <button
              onClick={() => setOpenGroup(openGroup === group.title ? null : group.title)}
              className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className={`w-3 h-3 rounded-full ${group.color}`} />
                <span className="text-white font-semibold">{group.title}</span>
                <span className="text-white/40 text-xs">{group.exercises.length} exercises</span>
              </div>
              <span className={`text-white/50 transition-transform ${openGroup === group.title ? "rotate-180" : ""}`}>
                ▼
              </span>
            </button>

            {openGroup === group.title && (
              <div className="border-t border-white/10 p-5 space-y-4">
                {group.exercises.map((ex) => (
                  <div key={ex.name} className="bg-white/5 rounded-xl p-4">
                    <h4 className="text-white font-semibold text-sm mb-1">{ex.name}</h4>
                    <p className="text-white/70 text-sm leading-relaxed mb-2">{ex.description}</p>
                    {ex.tip && (
                      <p className="text-amber-300/80 text-xs italic border-l-2 border-amber-500/40 pl-3">
                        Pro tip: {ex.tip}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Tab 5: Weekly Plans ──────────────────────────────────────────────────────

interface WeeklyPlan {
  title: string
  subtitle: string
  color: string
  days: { day: string; focus: string; details: string }[]
}

const WEEKLY_PLANS: WeeklyPlan[] = [
  {
    title: "Beginner",
    subtitle: "3 days/week · 20 min",
    color: "border-green-500 bg-green-500/10",
    days: [
      { day: "Monday", focus: "Chords + Transitions", details: "Warm-up (3 min) → Work on G, C, D, Em transitions (12 min) → Play a song using just those chords (5 min)" },
      { day: "Wednesday", focus: "New Chord + Strumming", details: "Warm-up (3 min) → Learn one new chord shape (7 min) → Practice a simple D-DU strum pattern with Am and Em (10 min)" },
      { day: "Friday", focus: "Full Song Play-Through", details: "Warm-up (3 min) → Play your current song from start to finish, no stops (10 min) → Drill any section that went wrong (7 min)" },
    ],
  },
  {
    title: "Intermediate",
    subtitle: "4 days/week · 30 min",
    color: "border-blue-500 bg-blue-500/10",
    days: [
      { day: "Monday", focus: "Scales + Technique", details: "Warm-up (5 min) → Pentatonic positions 1+2 with metronome (15 min) → Legato run or bending exercise (10 min)" },
      { day: "Tuesday", focus: "Chord Voicings + Theory", details: "Warm-up (5 min) → 3-4 jazz or extended chord voicings (15 min) → Understand the ii-V-I they come from (10 min)" },
      { day: "Thursday", focus: "Improvisation", details: "Warm-up (5 min) → Pentatonic + blue note solos over a backing track (15 min) → Motif development exercise (10 min)" },
      { day: "Saturday", focus: "Repertoire + Song Learning", details: "Warm-up (5 min) → Run your current piece (10 min) → Begin a new song: learn first 8 bars (15 min)" },
    ],
  },
  {
    title: "Advanced",
    subtitle: "5 days/week · 45 min",
    color: "border-purple-500 bg-purple-500/10",
    days: [
      { day: "Monday", focus: "Technique Focus", details: "Warm-up (7 min) → Metronome drills: speed build a lick from 80% to max (20 min) → Sweep picking or economy picking patterns (18 min)" },
      { day: "Tuesday", focus: "Theory + Composition", details: "Warm-up (7 min) → Analyse a song or mode in depth (15 min) → Write/record a short 8-16 bar original idea (23 min)" },
      { day: "Wednesday", focus: "Scales + Modes", details: "Warm-up (7 min) → All 5 pentatonic positions connected (15 min) → Modal playing: establish Dorian or Lydian over a drone (23 min)" },
      { day: "Thursday", focus: "Repertoire + Song Learning", details: "Warm-up (7 min) → Performance run-through of current piece (15 min) → Deep work on a new song — 2 sections (23 min)" },
      { day: "Friday", focus: "Jam / Record / Free Play", details: "Warm-up (7 min) → Record a full take of something — no punch-ins, performance mindset (20 min) → Free improvisation over a backing track (18 min)" },
      { day: "Saturday", focus: "Review Weakest Area", details: "Look at your practice journal. What struggled most this week? Spend the whole session on that — warm-up (7 min), then pure focused work (38 min)." },
    ],
  },
]

function WeeklyPlansTab() {
  const [openPlan, setOpenPlan] = useState<string>("Beginner")

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-2">Weekly Practice Plans</h2>
      <p className="text-white/60 text-sm mb-6">
        Four pre-built weekly schedules to plug into your calendar. Click a plan to see its full
        day-by-day breakdown. The more days you commit to, the faster you improve.
      </p>

      <div className="space-y-3 mb-8">
        {WEEKLY_PLANS.map((plan) => (
          <div key={plan.title} className={`border ${plan.color} rounded-2xl overflow-hidden`}>
            <button
              onClick={() => setOpenPlan(openPlan === plan.title ? "" : plan.title)}
              className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors"
            >
              <div>
                <span className="text-white font-bold text-base">{plan.title}</span>
                <span className="text-white/50 text-sm ml-3">{plan.subtitle}</span>
              </div>
              <span className={`text-white/50 transition-transform ${openPlan === plan.title ? "rotate-180" : ""}`}>
                ▼
              </span>
            </button>

            {openPlan === plan.title && (
              <div className="border-t border-white/10 p-5">
                <div className="space-y-3">
                  {plan.days.map((d) => (
                    <div key={d.day} className="bg-white/5 rounded-xl p-4">
                      <div className="flex flex-wrap items-baseline gap-2 mb-1">
                        <span className="text-white font-semibold text-sm">{d.day}</span>
                        <span className="text-purple-300 text-xs font-medium">{d.focus}</span>
                      </div>
                      <p className="text-white/65 text-xs leading-relaxed">{d.details}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* The One Thing Method */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6">
        <h3 className="text-amber-400 font-bold text-lg mb-2">The "One Thing" Method</h3>
        <p className="text-white/80 text-sm leading-relaxed mb-4">
          Pick one skill to improve each month. Dedicate 50% of your practice time to it. Everything
          else maintains — this one thing grows. At the end of the month you will have made a real,
          permanent improvement in one area rather than small shallow improvements across many.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {[
            { month: "January", skill: "Barre Chords" },
            { month: "February", skill: "Pentatonic Positions" },
            { month: "March", skill: "Strumming Rhythm" },
            { month: "April", skill: "Bending + Vibrato" },
            { month: "May", skill: "Scale Sequences" },
            { month: "June", skill: "Chord Voicings" },
            { month: "July", skill: "Fingerstyle Technique" },
            { month: "August", skill: "Improvisation Phrasing" },
          ].map((item) => (
            <div key={item.month} className="bg-white/5 rounded-xl p-3 text-center">
              <p className="text-amber-400 text-xs font-semibold">{item.month}</p>
              <p className="text-white/75 text-xs mt-1">{item.skill}</p>
            </div>
          ))}
        </div>
        <Callout type="insight">
          Guitarists who follow the "One Thing" method for a full year (12 focused monthly skills) make
          more measurable progress than players who practise randomly for 3+ years. Focused
          improvement compounds — each skill you master makes learning the next one easier.
        </Callout>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const TABS = [
  { id: "why", label: "Why Routine Matters" },
  { id: "builder", label: "Routine Builder" },
  { id: "warmup", label: "Warm-Up Exercises" },
  { id: "library", label: "Exercise Library" },
  { id: "weekly", label: "Weekly Plans" },
]

export default function PracticeRoutinePage() {
  const [activeTab, setActiveTab] = useState("why")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">

        {/* Back link */}
        <Link href="/" className="text-purple-300 hover:text-white text-sm">
          ← Back to modules
        </Link>

        {/* Header */}
        <div className="mt-4 mb-6">
          <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">Practice Routine Builder</h1>
          <p className="text-purple-200/70 text-sm sm:text-base">
            Stop noodling, start improving. Build a structured practice routine tailored to your
            time, level, and goals — then stick to it.
          </p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { value: "5", label: "Practice Sections" },
            { value: "5+", label: "Time Options" },
            { value: "8", label: "Focus Areas" },
            { value: "3", label: "Skill Levels" },
          ].map((s) => (
            <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
              <p className="text-purple-300 font-bold text-xl">{s.value}</p>
              <p className="text-white/50 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tab bar */}
        <div className="flex flex-wrap gap-2 mb-8">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-purple-600 text-white"
                  : "bg-white/10 text-purple-300 hover:bg-white/20"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
          {activeTab === "why"     && <WhyRoutineTab />}
          {activeTab === "builder" && <RoutineBuilderTab />}
          {activeTab === "warmup"  && <WarmUpTab />}
          {activeTab === "library" && <ExerciseLibraryTab />}
          {activeTab === "weekly"  && <WeeklyPlansTab />}
        </div>

      </div>
    </div>
  )
}
