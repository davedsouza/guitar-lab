"use client"

import { useState } from "react"
import Link from "next/link"
import ScaleDiagram from "@/components/ScaleDiagram"
import FullFretboardDiagram from "@/components/FullFretboardDiagram"
import { SCALE_TYPES, NOTES, getScaleNotes } from "@/lib/scalePatterns"

// ─── Melodic Guide Data ────────────────────────────────────────────────────────

type NoteRole = 'target' | 'color' | 'passing' | 'tension'

interface DegreeInfo { degree: string; role: NoteRole; label: string }
interface SequenceIdea { name: string; feel: string; emoji: string; indices: number[] }

const MELODIC_GUIDE: Record<string, { degreeRoles: DegreeInfo[]; sequences: SequenceIdea[] }> = {
  "Major": {
    degreeRoles: [
      { degree: "1",  role: "target",  label: "Home — always land here" },
      { degree: "2",  role: "passing", label: "Step up, move through" },
      { degree: "3",  role: "target",  label: "The sweet spot" },
      { degree: "4",  role: "tension", label: "Avoid on downbeats" },
      { degree: "5",  role: "target",  label: "Strong & stable" },
      { degree: "6",  role: "color",   label: "Adds warmth" },
      { degree: "7",  role: "color",   label: "Pulls back up to root" },
    ],
    sequences: [
      { name: "Home base",      feel: "Warm & resolved",   emoji: "☀️", indices: [0,2,4,2,0] },
      { name: "Major climb",    feel: "Building energy",   emoji: "📈", indices: [0,1,2,3,4] },
      { name: "Descend home",   feel: "Resolving",         emoji: "🎯", indices: [4,3,2,1,0] },
      { name: "Bright bounce",  feel: "Lush & open",       emoji: "✨", indices: [2,4,5,4,2] },
      { name: "Leading tone",   feel: "Tense then home",   emoji: "🎶", indices: [4,6,0] },
      { name: "Stepwise sweet", feel: "Smooth & melodic",  emoji: "🌊", indices: [2,1,0,1,2] },
    ],
  },
  "Natural Minor": {
    degreeRoles: [
      { degree: "1",  role: "target",  label: "Home — always land here" },
      { degree: "2",  role: "passing", label: "Tense step — move through" },
      { degree: "b3", role: "color",   label: "The minor character" },
      { degree: "4",  role: "passing", label: "Approach note" },
      { degree: "5",  role: "target",  label: "Strong & stable" },
      { degree: "b6", role: "color",   label: "Dark & cinematic" },
      { degree: "b7", role: "color",   label: "Moody & unresolved" },
    ],
    sequences: [
      { name: "Aeolian lament",  feel: "Dark & brooding",   emoji: "🌑", indices: [0,2,1,0] },
      { name: "Minor ascent",    feel: "Building tension",  emoji: "📈", indices: [0,1,2,3,4] },
      { name: "Descend home",    feel: "Sombre resolve",    emoji: "🎯", indices: [4,3,2,1,0] },
      { name: "Dark colour",     feel: "Moody & cinematic", emoji: "🎬", indices: [0,6,5,4] },
      { name: "Minor sweep",     feel: "Deep & emotional",  emoji: "🌊", indices: [2,4,6,4,2,0] },
      { name: "Sad phrase",      feel: "Melancholic",       emoji: "🌧️", indices: [4,2,1,0] },
    ],
  },
  "Pentatonic Minor": {
    degreeRoles: [
      { degree: "1",  role: "target",  label: "Root — always safe to land" },
      { degree: "b3", role: "color",   label: "Blues/soul character" },
      { degree: "4",  role: "passing", label: "Approach note" },
      { degree: "5",  role: "target",  label: "Power tone" },
      { degree: "b7", role: "color",   label: "Soulful colour" },
    ],
    sequences: [
      { name: "Root anchor",     feel: "Grounded & strong",  emoji: "⚓", indices: [0,3,0] },
      { name: "Blues climb",     feel: "The classic ascent",  emoji: "📈", indices: [0,1,2,3] },
      { name: "Soul phrase",     feel: "Soulful expression",  emoji: "🎷", indices: [1,2,3,4,3] },
      { name: "Box turnaround",  feel: "Circular lick",       emoji: "🔄", indices: [0,1,3,1,0] },
      { name: "Upper run",       feel: "Top-of-box breezy",   emoji: "💨", indices: [1,2,3,4] },
      { name: "Resolve home",    feel: "Landing firmly",      emoji: "🎯", indices: [4,3,1,0] },
    ],
  },
  "Pentatonic Major": {
    degreeRoles: [
      { degree: "1",  role: "target",  label: "Home base" },
      { degree: "2",  role: "color",   label: "Bright passing tone" },
      { degree: "3",  role: "target",  label: "The sweet major note" },
      { degree: "5",  role: "target",  label: "Power tone" },
      { degree: "6",  role: "color",   label: "Country/pop sparkle" },
    ],
    sequences: [
      { name: "Country sweet",   feel: "Bright & catchy",   emoji: "🌟", indices: [0,2,3,2,0] },
      { name: "Happy walk",      feel: "Carefree",          emoji: "😊", indices: [0,1,2,3] },
      { name: "6th bounce",      feel: "Major sparkle",     emoji: "✨", indices: [2,3,4,3] },
      { name: "Full ascent",     feel: "Bright climb",      emoji: "📈", indices: [0,1,2,3,4] },
      { name: "Turnaround",      feel: "Simple & resolved", emoji: "🎯", indices: [0,2,1,0] },
      { name: "Peak & land",     feel: "Arc phrase",        emoji: "🌈", indices: [0,3,4,3,0] },
    ],
  },
  "Dorian": {
    degreeRoles: [
      { degree: "1",  role: "target",  label: "Home" },
      { degree: "2",  role: "passing", label: "Step through" },
      { degree: "b3", role: "color",   label: "Minor character" },
      { degree: "4",  role: "passing", label: "Neutral — pass through" },
      { degree: "5",  role: "target",  label: "Power tone" },
      { degree: "6",  role: "color",   label: "The Dorian signature ★" },
      { degree: "b7", role: "color",   label: "Soulful tone" },
    ],
    sequences: [
      { name: "Dorian signature", feel: "That Dorian flavour",   emoji: "⭐", indices: [0,2,5,4] },
      { name: "Santana phrase",   feel: "Warm minor groove",     emoji: "🎸", indices: [0,2,4,5,4,2] },
      { name: "Bright descent",   feel: "Dorian colour descend", emoji: "⬇️", indices: [4,5,4,2,0] },
      { name: "Modal groove",     feel: "Smooth stepwise",       emoji: "🌊", indices: [0,1,2,3,4,3] },
      { name: "Colour drop",      feel: "Moody with brightness", emoji: "🎨", indices: [0,6,5,4] },
      { name: "ii chord guide",   feel: "Jazz minor feel",       emoji: "🎷", indices: [1,2,4,6] },
    ],
  },
  "Phrygian": {
    degreeRoles: [
      { degree: "1",  role: "target",  label: "Home — dark and tense" },
      { degree: "b2", role: "tension", label: "The Phrygian signature ★" },
      { degree: "b3", role: "color",   label: "Dark minor colour" },
      { degree: "4",  role: "passing", label: "Neutral step" },
      { degree: "5",  role: "target",  label: "Stable anchor" },
      { degree: "b6", role: "color",   label: "Dark & dramatic" },
      { degree: "b7", role: "color",   label: "Moody tone" },
    ],
    sequences: [
      { name: "Flamenco snap",    feel: "Spanish tension",    emoji: "💃", indices: [1,0,2,1] },
      { name: "Phrygian descent", feel: "Classic dark fall",  emoji: "⬇️", indices: [4,3,2,1,0] },
      { name: "Dark brooding",    feel: "Heavy & dark",       emoji: "🌑", indices: [0,6,5,4] },
      { name: "Tension resolve",  feel: "Signature b2 → root",emoji: "😬", indices: [2,1,0] },
      { name: "Dark climb",       feel: "Tense ascending",    emoji: "⬆️", indices: [0,2,3,4] },
      { name: "Metal phrase",     feel: "Dense & aggressive", emoji: "🤘", indices: [4,3,2,1,0,1] },
    ],
  },
  "Lydian": {
    degreeRoles: [
      { degree: "1",  role: "target",  label: "Home" },
      { degree: "2",  role: "passing", label: "Bright step" },
      { degree: "3",  role: "target",  label: "Sweet major tone" },
      { degree: "#4", role: "color",   label: "The Lydian signature ★" },
      { degree: "5",  role: "target",  label: "Stable anchor" },
      { degree: "6",  role: "color",   label: "Warm brightness" },
      { degree: "7",  role: "color",   label: "Dreamy resolution pull" },
    ],
    sequences: [
      { name: "Lydian lift",     feel: "Dreamy & floating",  emoji: "☁️", indices: [0,2,3,4] },
      { name: "Ethereal ascent", feel: "Film score magic",   emoji: "🎬", indices: [0,1,2,3,4] },
      { name: "Dreamy phrase",   feel: "Spacious & open",    emoji: "✨", indices: [2,3,2,4,2,0] },
      { name: "Cinematic sweep", feel: "Cinematic",          emoji: "🌟", indices: [0,2,4,6,4] },
      { name: "Bright descent",  feel: "Shimmering",         emoji: "💫", indices: [4,3,2,1,0] },
      { name: "Magic #4",        feel: "The raised 4th moment",emoji: "🪄", indices: [0,3,4,3,0] },
    ],
  },
  "Mixolydian": {
    degreeRoles: [
      { degree: "1",  role: "target",  label: "Home" },
      { degree: "2",  role: "passing", label: "Bright step" },
      { degree: "3",  role: "target",  label: "Major character" },
      { degree: "4",  role: "passing", label: "Approach note" },
      { degree: "5",  role: "target",  label: "Power tone" },
      { degree: "6",  role: "color",   label: "Brightness" },
      { degree: "b7", role: "color",   label: "The Mixolydian signature ★" },
    ],
    sequences: [
      { name: "Mixo signature",  feel: "Rock/blues major vibe",  emoji: "🎸", indices: [0,2,4,6] },
      { name: "Dominant groove", feel: "Descending b7",          emoji: "⬇️", indices: [6,4,2,0] },
      { name: "Rock phrase",     feel: "Power & grit",           emoji: "💥", indices: [0,4,6,4,0] },
      { name: "Country blues",   feel: "Good-time music",        emoji: "🤠", indices: [0,2,3,4,6] },
      { name: "Smooth descend",  feel: "Full resolution",        emoji: "🎯", indices: [6,5,4,2,0] },
      { name: "b7 bounce",       feel: "Bluesy punch",           emoji: "🥊", indices: [0,6,0] },
    ],
  },
  "Locrian": {
    degreeRoles: [
      { degree: "1",  role: "target",  label: "Home (unstable root)" },
      { degree: "b2", role: "tension", label: "Very dark half-step" },
      { degree: "b3", role: "color",   label: "Dark colour" },
      { degree: "4",  role: "passing", label: "Neutral step" },
      { degree: "b5", role: "tension", label: "The unstable core ★" },
      { degree: "b6", role: "color",   label: "Dense & dark" },
      { degree: "b7", role: "color",   label: "Dark resolution area" },
    ],
    sequences: [
      { name: "Dim tension",     feel: "Extreme instability",  emoji: "💀", indices: [0,4,0] },
      { name: "Dark walk",       feel: "Dense chromatic",      emoji: "🌑", indices: [0,1,2,3] },
      { name: "Metal descent",   feel: "Aggressive & dark",    emoji: "🤘", indices: [4,3,2,1,0] },
      { name: "Eerie phrase",    feel: "Haunting",             emoji: "👻", indices: [0,6,5,4] },
      { name: "Tension climb",   feel: "Dissonant ascent",     emoji: "⬆️", indices: [0,2,4,6] },
      { name: "Full dark",       feel: "Atonal & dissonant",   emoji: "🕷️", indices: [4,3,2,1,0,1] },
    ],
  },
  "Blues": {
    degreeRoles: [
      { degree: "1",  role: "target",  label: "Root — home base" },
      { degree: "b3", role: "color",   label: "Blues character" },
      { degree: "4",  role: "passing", label: "Approach the 5th" },
      { degree: "b5", role: "tension", label: "The blue note ★ — bend here" },
      { degree: "5",  role: "target",  label: "Power tone" },
      { degree: "b7", role: "color",   label: "Soul tone" },
    ],
    sequences: [
      { name: "Blues box",        feel: "Timeless bread & butter",  emoji: "🎸", indices: [0,1,2,4] },
      { name: "Blue note hit",    feel: "Chromatic crunch",         emoji: "💥", indices: [2,3,4] },
      { name: "Soul cry",         feel: "Full blues lick",          emoji: "😭", indices: [1,2,3,4,5] },
      { name: "Call & response",  feel: "Classic turnaround",       emoji: "🔄", indices: [4,5,4,1,0] },
      { name: "Wail & descend",   feel: "Descend to root",          emoji: "⬇️", indices: [5,4,2,1,0] },
      { name: "Bent phrase",      feel: "Approach & retreat",       emoji: "🎵", indices: [0,1,2,3,2] },
    ],
  },
}

// ─── Melodic Guide Component ───────────────────────────────────────────────────

function MelodicGuide({ scaleNotes, selectedScale, userSequence, setUserSequence }: {
  scaleNotes: string[]
  selectedScale: string
  userSequence: number[]
  setUserSequence: (v: number[]) => void
}) {
  const guide = MELODIC_GUIDE[selectedScale]
  if (!guide) return null

  const roleDotClass: Record<NoteRole, string> = {
    target:  "bg-amber-500 border-amber-300",
    color:   "bg-purple-600 border-purple-400",
    passing: "bg-blue-600 border-blue-400",
    tension: "bg-red-600 border-red-400",
  }
  const roleTokenClass: Record<NoteRole, string> = {
    target:  "bg-amber-500/30 text-amber-200",
    color:   "bg-purple-500/30 text-purple-200",
    passing: "bg-blue-500/30 text-blue-200",
    tension: "bg-red-500/30 text-red-200",
  }
  const roleLabelClass: Record<NoteRole, string> = {
    target:  "text-amber-300",
    color:   "text-purple-300",
    passing: "text-blue-300",
    tension: "text-red-300",
  }
  const ROLE_LABELS: Record<NoteRole, string> = {
    target: "Landing tone", color: "Colour tone", passing: "Passing tone", tension: "Tension tone",
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
      <h3 className="text-lg font-bold text-white mb-1">Melodic Note Guide</h3>
      <p className="text-purple-300 text-xs mb-4">
        Which notes to lean on, which to pass through, and how to string them together.
      </p>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-4">
        {(["target","color","passing","tension"] as NoteRole[]).map(role => (
          <div key={role} className="flex items-center gap-1.5 text-xs">
            <div className={`w-3 h-3 rounded-full ${roleDotClass[role].split(" ")[0]}`} />
            <span className={roleLabelClass[role]}>{ROLE_LABELS[role]}</span>
          </div>
        ))}
      </div>

      {/* Scale degree pills */}
      <div className="flex flex-wrap gap-3 mb-3">
        {guide.degreeRoles.map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className={`${roleDotClass[d.role]} text-white text-sm font-bold w-11 h-11 rounded-full flex items-center justify-center border-2`}>
              {scaleNotes[i]}
            </div>
            <div className="text-xs text-purple-400 font-mono">{d.degree}</div>
          </div>
        ))}
      </div>

      {/* Degree role descriptions */}
      <div className="space-y-1 mb-5">
        {guide.degreeRoles.map((d, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className={`font-bold font-mono px-1.5 py-0.5 rounded min-w-[28px] text-center ${roleTokenClass[d.role]}`}>
              {scaleNotes[i]}
            </span>
            <span className="text-purple-500 font-mono">{d.degree}</span>
            <span className="text-purple-200">{d.label}</span>
          </div>
        ))}
      </div>

      {/* Sequence suggestions */}
      <h4 className="text-white font-semibold text-sm mb-1">Suggested Sequences</h4>
      <p className="text-purple-400 text-xs mb-3">Click a sequence to load it into the builder.</p>
      <div className="space-y-2 mb-5">
        {guide.sequences.map((seq, i) => (
          <button
            key={i}
            onClick={() => setUserSequence(seq.indices)}
            className="w-full text-left bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/40 rounded-xl p-3 transition-all"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span>{seq.emoji}</span>
              <span className="text-white font-semibold text-sm">{seq.name}</span>
              <span className="text-purple-400 text-xs ml-auto italic">{seq.feel}</span>
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              {seq.indices.map((idx, j) => (
                <span key={j} className="flex items-center gap-1">
                  <span className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${roleTokenClass[guide.degreeRoles[idx].role]}`}>
                    {scaleNotes[idx]}
                  </span>
                  {j < seq.indices.length - 1 && <span className="text-purple-500 text-xs">→</span>}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>

      {/* Interactive builder */}
      <h4 className="text-white font-semibold text-sm mb-1">Build Your Own Sequence</h4>
      <p className="text-purple-400 text-xs mb-3">
        Tap any note to add it. Start and end on a landing tone (amber) for the most musical result.
      </p>
      <div className="flex flex-wrap gap-2 mb-3">
        {guide.degreeRoles.map((d, i) => (
          <button
            key={i}
            onClick={() => { if (userSequence.length < 12) setUserSequence([...userSequence, i]) }}
            disabled={userSequence.length >= 12}
            className={`${roleDotClass[d.role]} text-white text-xs font-bold w-11 h-11 rounded-full border-2 hover:scale-110 active:scale-95 transition-transform disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            {scaleNotes[i]}
          </button>
        ))}
      </div>
      <div className="bg-black/30 rounded-xl p-3 min-h-[52px] flex items-center gap-1 flex-wrap border border-white/5">
        {userSequence.length === 0 ? (
          <span className="text-purple-500 text-xs">Your sequence will appear here…</span>
        ) : (
          userSequence.map((idx, j) => (
            <span key={j} className="flex items-center gap-1">
              <span className={`text-sm font-bold font-mono px-2 py-0.5 rounded ${roleTokenClass[guide.degreeRoles[idx].role]}`}>
                {scaleNotes[idx]}
              </span>
              {j < userSequence.length - 1 && <span className="text-purple-500 text-xs">→</span>}
            </span>
          ))
        )}
      </div>
      {userSequence.length > 0 && (
        <button
          onClick={() => setUserSequence([])}
          className="mt-2 text-xs text-purple-400 hover:text-white transition-colors"
        >
          ✕ Clear sequence
        </button>
      )}
    </div>
  )
}

export default function Scales() {
  const [selectedRoot, setSelectedRoot] = useState(0) // C
  const [selectedScale, setSelectedScale] = useState("Pentatonic Minor") // Most popular for beginners
  const [selectedPosition, setSelectedPosition] = useState(0)
  const [viewMode, setViewMode] = useState<"position" | "full">("position") // Toggle between views
  const [showNoteNames, setShowNoteNames] = useState(true) // Toggle for note names
  const [userSequence, setUserSequence] = useState<number[]>([])
  const guide = MELODIC_GUIDE[selectedScale]

  const scaleInfo = SCALE_TYPES[selectedScale]
  const position = scaleInfo.positions[selectedPosition]
  const scaleNotes = getScaleNotes(selectedRoot, selectedScale)
  const rootNote = NOTES[selectedRoot]

  // Calculate the actual starting fret based on root note and position
  const getActualStartFret = () => {
    if (selectedRoot === 0) {
      // C - use the position's default start fret
      return position.startFret
    }
    // Adjust start fret based on root note
    return (position.startFret + selectedRoot) % 12
  }

  const actualStartFret = getActualStartFret()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-purple-300 hover:text-purple-200 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">Guitar Scales</h1>
          <p className="text-purple-200">Master scales across the entire fretboard</p>
        </div>

        {/* Intro */}
        <div className="space-y-4 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-3">What is a Scale?</h2>
            <p className="text-purple-200 text-sm leading-relaxed mb-4">
              A scale is a set of notes that belong together in a key. Play any of them over a chord progression in that key and they'll sound right. The major scale is the foundation — every other scale, chord, and interval is described in relation to it.
            </p>
            <div className="bg-white/10 rounded-xl p-4 border-l-4 border-amber-400">
              <p className="text-amber-200 text-sm leading-relaxed">
                <span className="font-semibold text-amber-300">Think of scales like the alphabet.</span> You don't recite the alphabet when you write — but without knowing it, nothing makes sense. Scales are the same. You don't play them up and down in songs, but without them, you're guessing every time you pick a note.
              </p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-4">Why Scales Are Worth Learning</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { icon: "🎯", title: "Never hit a wrong note again", body: "Scales tell you exactly which notes will sound good over any chord progression. No more guessing." },
                { icon: "🎸", title: "Not just for soloists", body: "Knowing your scales improves chord choices, transitions, melody writing, and ear training — even if you never play a single solo." },
                { icon: "🗺️", title: "Makes the fretboard a map", body: "The same scale pattern repeats across the neck. Once you see the shapes, you can navigate anywhere confidently." },
                { icon: "🧠", title: "Foundation for everything else", body: "Modes, arpeggios, chord theory, improvisation — all of it is built on top of scale knowledge. Start here and it all connects." },
              ].map((item) => (
                <div key={item.title} className="bg-white/5 rounded-xl p-4 flex gap-3">
                  <span className="text-2xl shrink-0">{item.icon}</span>
                  <div>
                    <div className="text-white font-semibold text-sm mb-1">{item.title}</div>
                    <p className="text-purple-300 text-xs leading-relaxed">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Controls */}
          <div className="space-y-6">
            {/* Root Note Selector */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">1. Select Root Note</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {NOTES.map((note, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedRoot(index)}
                    className={`py-3 px-2 sm:px-4 text-sm sm:text-base rounded-lg font-semibold transition-all active:scale-95 ${
                      selectedRoot === index
                        ? "bg-purple-600 text-white scale-105"
                        : "bg-white/20 text-purple-200 hover:bg-white/30"
                    }`}
                  >
                    {note}
                  </button>
                ))}
              </div>
              <p className="text-purple-300 text-sm mt-3">Root: {rootNote}</p>
            </div>

            {/* Scale Type Selector */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">2. Select Scale Type</h2>
              <div className="space-y-2">
                {Object.keys(SCALE_TYPES).map((scaleKey) => {
                  const scale = SCALE_TYPES[scaleKey]
                  return (
                    <button
                      key={scaleKey}
                      onClick={() => {
                        setSelectedScale(scaleKey)
                        setSelectedPosition(0)
                        setUserSequence([])
                      }}
                      className={`w-full text-left py-3 px-4 rounded-lg transition-all ${
                        selectedScale === scaleKey
                          ? "bg-purple-600 text-white"
                          : "bg-white/20 text-purple-200 hover:bg-white/30"
                      }`}
                    >
                      <div className="font-semibold">{scale.name}</div>
                      <div className="text-sm opacity-80">{scale.description}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Position Selector */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">3. Select Position</h2>
              <p className="text-purple-300 text-sm mb-4">
                Learn the same scale in different positions across the neck
              </p>
              <div className="space-y-2">
                {scaleInfo.positions.map((pos, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedPosition(index)}
                    className={`w-full text-left py-3 px-4 rounded-lg transition-all ${
                      selectedPosition === index
                        ? "bg-purple-600 text-white"
                        : "bg-white/20 text-purple-200 hover:bg-white/30"
                    }`}
                  >
                    <div className="font-semibold">{pos.name}</div>
                    <div className="text-xs opacity-70">Starting around fret {pos.startFret}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Scale Display */}
          <div className="space-y-6">
            {/* Scale Diagram */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">
                  {rootNote} {scaleInfo.name}
                </h2>

                <div className="flex flex-col gap-2">
                  {/* View Toggle */}
                  <div className="flex gap-2 bg-white/10 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode("position")}
                      className={`px-4 py-2 rounded-md font-semibold text-sm transition-all ${
                        viewMode === "position"
                          ? "bg-purple-600 text-white"
                          : "text-purple-200 hover:text-white"
                      }`}
                    >
                      Position View
                    </button>
                    <button
                      onClick={() => setViewMode("full")}
                      className={`px-4 py-2 rounded-md font-semibold text-sm transition-all ${
                        viewMode === "full"
                          ? "bg-purple-600 text-white"
                          : "text-purple-200 hover:text-white"
                      }`}
                    >
                      Full Fretboard
                    </button>
                  </div>

                  {/* Note Names Toggle */}
                  <button
                    onClick={() => setShowNoteNames(!showNoteNames)}
                    className="bg-white/10 hover:bg-white/20 text-purple-200 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                  >
                    {showNoteNames ? "Hide" : "Show"} Note Names
                  </button>
                </div>
              </div>

              <div className="flex justify-center mb-8">
                <ScaleDiagram
                  scaleName={`${rootNote} ${selectedScale} - ${position.name}`}
                  pattern={position.pattern}
                  rootNote={rootNote}
                  startFret={actualStartFret}
                  rootString={position.rootString}
                  size="large"
                  showNoteNames={showNoteNames}
                />
              </div>

              {/* Scale Info */}
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-purple-200 text-sm mb-2">Position Information:</div>
                <div className="text-white mb-3">{position.name}</div>
                <div className="text-purple-300 text-sm">
                  <div className="font-semibold mb-1">Playing Tips:</div>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Orange dots mark the root note ({rootNote})</li>
                    <li>Purple dots are other notes in the scale</li>
                    <li>Practice ascending and descending</li>
                    <li>Start slow and focus on clean notes</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Scale Notes */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-3">Notes in This Scale</h3>
              <div className="flex flex-wrap justify-center gap-3 mb-4">
                {scaleNotes.map((note, index) => (
                  <div
                    key={index}
                    className={`${
                      index === 0
                        ? "bg-amber-500 text-white"
                        : "bg-purple-600 text-white"
                    } w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border-2 border-white`}
                  >
                    {note}
                  </div>
                ))}
              </div>
              <div className="text-purple-300 text-sm text-center">
                {scaleNotes.length} notes: {scaleNotes.join(" - ")}
              </div>
            </div>

            <MelodicGuide
              scaleNotes={scaleNotes}
              selectedScale={selectedScale}
              userSequence={userSequence}
              setUserSequence={setUserSequence}
            />

            {/* Practice Tips */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-3">Practice Tips</h3>
              <div className="space-y-2 text-sm text-purple-200">
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="font-semibold text-white mb-1">1. Learn the Pattern</div>
                  <div>Memorize the shape. Play it slowly until your fingers know where to go.</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="font-semibold text-white mb-1">2. Connect Positions</div>
                  <div>Once comfortable, try moving between different positions of the same scale.</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="font-semibold text-white mb-1">3. Create Music</div>
                  <div>Don't just run up and down! Skip notes, vary rhythm, and make melodies.</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="font-semibold text-white mb-1">4. Use a Backing Track</div>
                  <div>Practice over a backing track in the same key to develop your ear.</div>
                </div>
              </div>
            </div>

            {/* Theory Section */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-3">Understanding Scale Positions</h3>
              <div className="space-y-2 text-sm text-purple-200">
                <p>
                  Guitar scales can be played in multiple positions across the neck. Each position
                  contains the same notes but in a different location, allowing you to:
                </p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>Play in different registers (low to high)</li>
                  <li>Move fluidly across the entire fretboard</li>
                  <li>Create more interesting solos and melodies</li>
                  <li>Access different tonal colors and voicings</li>
                </ul>
                <p className="mt-3">
                  The CAGED system (referenced in position names) is a method for understanding
                  how chord and scale shapes connect across the guitar neck.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Full Fretboard View - Bottom Section */}
        {viewMode === "full" && (
          <div className="mt-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-2 text-center">
                Complete Fretboard View
              </h2>
              <p className="text-purple-200 text-center mb-4">
                Every scale note across all 12 frets — color-coded by role
              </p>

              {/* Active sequence display */}
              {userSequence.length > 0 ? (
                <div className="bg-black/30 border border-white/10 rounded-xl p-3 mb-4 text-center">
                  <div className="text-purple-300 text-xs mb-2">
                    Active sequence — highlighted across the fretboard:
                  </div>
                  <div className="flex items-center gap-1 flex-wrap justify-center mb-2">
                    {userSequence.map((idx, j) => {
                      const role = guide?.degreeRoles[idx]?.role
                      const cls = role === 'target' ? 'bg-amber-500/40 text-amber-200'
                        : role === 'color' ? 'bg-purple-500/40 text-purple-200'
                        : role === 'passing' ? 'bg-blue-500/40 text-blue-200'
                        : 'bg-red-500/40 text-red-200'
                      return (
                        <span key={j} className="flex items-center gap-1">
                          <span className={`text-sm font-bold font-mono px-2 py-0.5 rounded ${cls}`}>
                            {scaleNotes[idx]}
                          </span>
                          {j < userSequence.length - 1 && <span className="text-purple-500 text-xs">→</span>}
                        </span>
                      )
                    })}
                  </div>
                  <button
                    onClick={() => setUserSequence([])}
                    className="text-xs text-purple-400 hover:text-white transition-colors"
                  >
                    ✕ Clear sequence
                  </button>
                </div>
              ) : (
                <p className="text-purple-500 text-xs text-center mb-4">
                  Build a sequence in the Melodic Note Guide — it lights up here. Or click any note on the fretboard to start one.
                </p>
              )}

              <div className="flex justify-center mb-6">
                <FullFretboardDiagram
                  scaleName={`${rootNote} ${selectedScale}`}
                  rootNoteIndex={selectedRoot}
                  scaleType={selectedScale}
                  showNoteNames={showNoteNames}
                  degreeRoles={guide?.degreeRoles}
                  highlightedDegrees={userSequence.length > 0 ? [...new Set(userSequence)] : undefined}
                  onNoteClick={(idx) => {
                    if (userSequence.length < 12) setUserSequence([...userSequence, idx])
                  }}
                />
              </div>

              {/* Full Fretboard Info */}
              <div className="bg-white/10 rounded-xl p-6 max-w-4xl mx-auto">
                <h3 className="text-lg font-bold text-white mb-3 text-center">Understanding the Full Fretboard</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-purple-200">
                  <div>
                    <div className="font-semibold text-white mb-2">What you're seeing:</div>
                    <ul className="list-disc list-inside space-y-1">
                      <li>All scale notes from fret 0 to 12</li>
                      <li>How the 5 positions overlap and connect</li>
                      <li>Repeating patterns across the neck</li>
                      <li>Root notes (orange) as anchor points</li>
                    </ul>
                  </div>
                  <div>
                    <div className="font-semibold text-white mb-2">How to use this view:</div>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Trace horizontal lines to see scale movement</li>
                      <li>Notice the visual patterns that repeat</li>
                      <li>Use root notes to orient yourself</li>
                      <li>Practice connecting different positions smoothly</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
