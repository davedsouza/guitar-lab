"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import FullChordFretboard from "@/components/FullChordFretboard"

const NOTES = ["C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B"]

// Arpeggio types with intervals
const ARPEGGIO_TYPES = [
  {
    name: "Major",
    id: "major",
    formula: "1 - 3 - 5",
    intervals: [0, 4, 7],
    description: "Happy, bright sound - same as major chord",
    color: "bg-blue-600",
    difficulty: "Beginner",
    uses: "Major key solos, happy melodies, resolution points"
  },
  {
    name: "Minor",
    id: "minor",
    formula: "1 - ♭3 - 5",
    intervals: [0, 3, 7],
    description: "Sad, melancholic - same as minor chord",
    color: "bg-purple-600",
    difficulty: "Beginner",
    uses: "Minor key solos, emotional passages, dark melodies"
  },
  {
    name: "Dominant 7th",
    id: "dom7",
    formula: "1 - 3 - 5 - ♭7",
    intervals: [0, 4, 7, 10],
    description: "Tension, wants to resolve - blues and jazz essential",
    color: "bg-amber-600",
    difficulty: "Intermediate",
    uses: "Blues solos, jazz improvisation, creating tension"
  },
  {
    name: "Major 7th",
    id: "maj7",
    formula: "1 - 3 - 5 - 7",
    intervals: [0, 4, 7, 11],
    description: "Dreamy, jazzy - sophisticated sound",
    color: "bg-green-600",
    difficulty: "Intermediate",
    uses: "Jazz, smooth melodies, sophisticated passages"
  },
  {
    name: "Minor 7th",
    id: "m7",
    formula: "1 - ♭3 - 5 - ♭7",
    intervals: [0, 3, 7, 10],
    description: "Smooth, mellow - jazz and funk",
    color: "bg-indigo-600",
    difficulty: "Intermediate",
    uses: "Jazz, funk, R&B, smooth solos"
  },
  {
    name: "Diminished",
    id: "dim",
    formula: "1 - ♭3 - ♭5",
    intervals: [0, 3, 6],
    description: "Tense, unstable - creates tension",
    color: "bg-red-600",
    difficulty: "Advanced",
    uses: "Passing tones, tension, chromatic movement"
  },
  {
    name: "Augmented",
    id: "aug",
    formula: "1 - 3 - #5",
    intervals: [0, 4, 8],
    description: "Mysterious, suspenseful - symmetrical",
    color: "bg-pink-600",
    difficulty: "Advanced",
    uses: "Creating mystery, suspense, exotic sounds"
  }
]

// 5 Position system (CAGED-based) - these are moveable shapes
const ARPEGGIO_POSITIONS = {
  major: [
    {
      name: "Position 1 (E-shape)",
      rootString: 6,
      rootFret: 0, // Offset from root note
      notes: [
        { string: 6, fret: 0, interval: 0, finger: 1 }, // Root
        { string: 5, fret: 2, interval: 2, finger: 3 }, // 5th
        { string: 4, fret: 2, interval: 2, finger: 4 }, // Root
        { string: 3, fret: 1, interval: 1, finger: 2 }, // 3rd
        { string: 2, fret: 0, interval: 0, finger: 1 }, // 5th
        { string: 1, fret: 0, interval: 0, finger: 1 }, // Root
      ]
    },
    {
      name: "Position 2 (D-shape)",
      rootString: 4,
      rootFret: 0,
      notes: [
        { string: 5, fret: 0, interval: 0, finger: 1 },
        { string: 4, fret: 0, interval: 0, finger: 0 }, // Root
        { string: 3, fret: 2, interval: 2, finger: 3 }, // 5th
        { string: 2, fret: 3, interval: 3, finger: 4 }, // Root
        { string: 1, fret: 2, interval: 2, finger: 2 }, // 3rd
      ]
    },
    {
      name: "Position 3 (C-shape)",
      rootString: 5,
      rootFret: 3,
      notes: [
        { string: 5, fret: 3, interval: 0, finger: 2 }, // Root
        { string: 4, fret: 2, interval: -1, finger: 1 }, // 5th
        { string: 3, fret: 0, interval: -3, finger: 0 }, // Root
        { string: 2, fret: 1, interval: -2, finger: 1 }, // 3rd
        { string: 1, fret: 3, interval: 0, finger: 4 }, // 5th
      ]
    },
    {
      name: "Position 4 (A-shape)",
      rootString: 5,
      rootFret: 0,
      notes: [
        { string: 5, fret: 0, interval: 0, finger: 0 }, // Root
        { string: 4, fret: 2, interval: 2, finger: 2 }, // 5th
        { string: 3, fret: 2, interval: 2, finger: 3 }, // Root
        { string: 2, fret: 2, interval: 2, finger: 4 }, // 3rd
        { string: 1, fret: 0, interval: 0, finger: 0 }, // 5th
      ]
    },
    {
      name: "Position 5 (G-shape)",
      rootString: 6,
      rootFret: 3,
      notes: [
        { string: 6, fret: 3, interval: 0, finger: 2 }, // Root
        { string: 5, fret: 2, interval: -1, finger: 1 }, // 3rd
        { string: 4, fret: 0, interval: -3, finger: 0 }, // 5th
        { string: 3, fret: 0, interval: -3, finger: 0 }, // Root
        { string: 2, fret: 0, interval: -3, finger: 0 }, // 3rd
        { string: 1, fret: 3, interval: 0, finger: 4 }, // Root
      ]
    }
  ]
}

export default function Arpeggios() {
  const [selectedRoot, setSelectedRoot] = useState(0) // C
  const [selectedType, setSelectedType] = useState(0) // Major
  const [selectedPosition, setSelectedPosition] = useState(0) // Position 1
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0)
  const [tempo, setTempo] = useState(80)
  const [volume, setVolume] = useState(0.5)
  const [playDirection, setPlayDirection] = useState<"ascending" | "descending" | "both">("ascending")

  const arpeggioType = ARPEGGIO_TYPES[selectedType]
  const position = ARPEGGIO_POSITIONS.major[selectedPosition]

  // Audio context
  useEffect(() => {
    if (typeof window === 'undefined') return

    const createAudioContext = () => {
      if (!(window as any).audioContext) {
        (window as any).audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      }
    }

    document.addEventListener('click', createAudioContext, { once: true })
    return () => document.removeEventListener('click', createAudioContext)
  }, [])

  // Play note sound
  const playNote = (stringNum: number, fret: number) => {
    if (typeof window === 'undefined' || volume === 0) return

    const audioContext = (window as any).audioContext
    if (!audioContext) return

    // Calculate frequency based on string and fret
    const stringBaseFreqs = [329.63, 246.94, 196.00, 146.83, 110.00, 82.41] // E B G D A E
    const baseFreq = stringBaseFreqs[stringNum - 1]
    const frequency = baseFreq * Math.pow(2, fret / 12)

    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = frequency
    oscillator.type = 'triangle'

    gainNode.gain.setValueAtTime(0, audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(volume * 0.3, audioContext.currentTime + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)
  }

  // Playback logic
  useEffect(() => {
    if (!isPlaying) {
      setCurrentNoteIndex(0)
      return
    }

    const notes = position.notes
    const beatsPerSecond = tempo / 60
    const msPerNote = (1000 / beatsPerSecond) * 0.5 // Half beat per note

    // Create playback sequence
    let sequence = [...notes]
    if (playDirection === "descending") {
      sequence = [...notes].reverse()
    } else if (playDirection === "both") {
      sequence = [...notes, ...notes.slice().reverse().slice(1, -1)]
    }

    const currentNote = sequence[currentNoteIndex]
    if (currentNote) {
      const actualFret = selectedRoot + currentNote.fret
      playNote(currentNote.string, actualFret)
    }

    const timeout = setTimeout(() => {
      setCurrentNoteIndex(prev => (prev + 1) % sequence.length)
    }, msPerNote)

    return () => clearTimeout(timeout)
  }, [isPlaying, currentNoteIndex, tempo, selectedRoot, position, playDirection, volume])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-purple-300 hover:text-purple-200 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Arpeggios</h1>
          <p className="text-purple-200">Master playing chords note-by-note across the fretboard</p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel */}
          <div className="space-y-6">
            {/* What are Arpeggios */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">What are Arpeggios?</h2>
              <div className="space-y-3 text-purple-200 text-sm">
                <p>
                  An arpeggio is a chord played one note at a time instead of all together. The word comes from the Italian "arpeggiare" meaning "to play on a harp."
                </p>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="font-semibold text-white mb-2">Why Learn Arpeggios?</div>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Essential for lead guitar and solos</li>
                    <li>Connect chords and scales smoothly</li>
                    <li>Create melodic lines over chord changes</li>
                    <li>Sound more musical and intentional</li>
                    <li>Foundation for sweep picking technique</li>
                    <li>Used in all genres - blues, jazz, rock, metal</li>
                  </ul>
                </div>
                <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-3">
                  <p className="text-blue-200 text-xs">
                    💡 <strong>Tip:</strong> Learn arpeggio shapes alongside chord shapes. They're related!
                  </p>
                </div>
              </div>
            </div>

            {/* Root Note Selector */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">1. Select Root Note</h2>
              <div className="grid grid-cols-4 gap-2">
                {NOTES.map((note, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedRoot(index)}
                    className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                      selectedRoot === index
                        ? "bg-purple-600 text-white scale-105"
                        : "bg-white/20 text-purple-200 hover:bg-white/30"
                    }`}
                  >
                    {note}
                  </button>
                ))}
              </div>
            </div>

            {/* Arpeggio Type Selector */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">2. Select Arpeggio Type</h2>
              <div className="space-y-2">
                {ARPEGGIO_TYPES.map((type, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedType(index)}
                    className={`w-full text-left py-3 px-4 rounded-lg transition-all ${
                      selectedType === index
                        ? "bg-purple-600 text-white"
                        : "bg-white/20 text-purple-200 hover:bg-white/30"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-semibold">{type.name}</div>
                      <div className={`${type.color} text-white px-2 py-1 rounded text-xs`}>
                        {type.difficulty}
                      </div>
                    </div>
                    <div className="text-xs opacity-80">{type.formula}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Arpeggio Info */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-3">
                {NOTES[selectedRoot]} {arpeggioType.name} Arpeggio
              </h3>
              <div className="space-y-3 text-sm">
                <div className="text-purple-200">{arpeggioType.description}</div>

                <div className="bg-white/10 rounded-lg p-3">
                  <div className="font-semibold text-white mb-2">Formula</div>
                  <div className="text-white text-lg">{arpeggioType.formula}</div>
                </div>

                <div className="bg-white/10 rounded-lg p-3">
                  <div className="font-semibold text-white mb-2">Best Uses</div>
                  <div className="text-xs text-purple-200">{arpeggioType.uses}</div>
                </div>

                <div className="bg-white/10 rounded-lg p-3">
                  <div className="font-semibold text-white mb-2">Notes in this Arpeggio</div>
                  <div className="flex flex-wrap gap-2">
                    {arpeggioType.intervals.map((interval, i) => {
                      const noteIndex = (selectedRoot + interval) % 12
                      return (
                        <div
                          key={i}
                          className="bg-purple-600 text-white px-3 py-2 rounded-lg font-bold"
                        >
                          {NOTES[noteIndex]}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="space-y-6">
            {/* Position Selector */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">3. Select Position</h2>
              <div className="space-y-2">
                {ARPEGGIO_POSITIONS.major.map((pos, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedPosition(index)
                      setIsPlaying(false)
                      setCurrentNoteIndex(0)
                    }}
                    className={`w-full text-left py-3 px-4 rounded-lg transition-all ${
                      selectedPosition === index
                        ? "bg-amber-600 text-white"
                        : "bg-white/20 text-purple-200 hover:bg-white/30"
                    }`}
                  >
                    <div className="font-semibold">{pos.name}</div>
                    <div className="text-xs opacity-80">{pos.notes.length} notes</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Fretboard */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">Position Diagram</h2>
              <div className="bg-slate-900/50 rounded-lg p-6">
                {/* Fretboard SVG */}
                <svg viewBox="0 0 400 200" className="w-full h-auto">
                  {/* Frets */}
                  {[0, 1, 2, 3, 4, 5].map((fret) => (
                    <line
                      key={`fret-${fret}`}
                      x1={60 + fret * 60}
                      y1="20"
                      x2={60 + fret * 60}
                      y2="180"
                      stroke="#666"
                      strokeWidth={fret === 0 ? "3" : "1"}
                    />
                  ))}

                  {/* Strings */}
                  {[1, 2, 3, 4, 5, 6].map((string) => (
                    <line
                      key={`string-${string}`}
                      x1="60"
                      y1={20 + (string - 1) * 32}
                      x2="360"
                      y2={20 + (string - 1) * 32}
                      stroke="#888"
                      strokeWidth="2"
                    />
                  ))}

                  {/* String labels */}
                  {["e", "B", "G", "D", "A", "E"].map((label, index) => (
                    <text
                      key={`label-${index}`}
                      x="40"
                      y={24 + index * 32}
                      fill="#888"
                      fontSize="12"
                      fontFamily="monospace"
                    >
                      {label}
                    </text>
                  ))}

                  {/* Position notes */}
                  {position.notes.map((note, index) => {
                    // Calculate playback sequence
                    let sequence = [...position.notes]
                    if (playDirection === "descending") {
                      sequence = [...position.notes].reverse()
                    } else if (playDirection === "both") {
                      sequence = [...position.notes, ...position.notes.slice().reverse().slice(1, -1)]
                    }

                    const isCurrentNote = isPlaying && sequence[currentNoteIndex]?.string === note.string && sequence[currentNoteIndex]?.fret === note.fret
                    const actualFret = selectedRoot + note.fret
                    const displayFret = actualFret % 12 // Keep within 12 frets

                    // Only show if within visible range (0-5 frets from root)
                    if (note.fret < 0 || note.fret > 5) return null

                    const x = 60 + note.fret * 60 + 30
                    const y = 20 + (note.string - 1) * 32

                    return (
                      <g key={`note-${index}`}>
                        {/* Note circle */}
                        <circle
                          cx={x}
                          cy={y}
                          r={isCurrentNote ? "16" : "12"}
                          fill={isCurrentNote ? "#f59e0b" : "#8b5cf6"}
                          stroke={isCurrentNote ? "#fbbf24" : "#a78bfa"}
                          strokeWidth={isCurrentNote ? "3" : "2"}
                          className={isCurrentNote ? "animate-pulse" : ""}
                        />
                        {/* Finger number */}
                        <text
                          x={x}
                          y={y + 5}
                          fill="white"
                          fontSize={isCurrentNote ? "14" : "12"}
                          fontWeight="bold"
                          textAnchor="middle"
                          fontFamily="sans-serif"
                        >
                          {note.finger === 0 ? "O" : note.finger}
                        </text>
                      </g>
                    )
                  })}

                  {/* Fret numbers */}
                  {[0, 1, 2, 3, 4, 5].map((fret) => {
                    const actualFret = selectedRoot + fret
                    return (
                      <text
                        key={`fret-num-${fret}`}
                        x={60 + fret * 60 + 30}
                        y="195"
                        fill="#666"
                        fontSize="10"
                        textAnchor="middle"
                        fontFamily="monospace"
                      >
                        {actualFret}
                      </text>
                    )
                  })}
                </svg>

                {/* Legend */}
                <div className="mt-4 flex items-center justify-center gap-6 text-xs text-purple-200">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-purple-600 border-2 border-purple-400 flex items-center justify-center text-white font-bold text-xs">
                      1
                    </div>
                    <span>Finger Position</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-amber-600 border-2 border-amber-400 flex items-center justify-center text-white font-bold text-xs">
                      2
                    </div>
                    <span>Currently Playing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-purple-600 border-2 border-purple-400 flex items-center justify-center text-white font-bold text-xs">
                      O
                    </div>
                    <span>Open String</span>
                  </div>
                </div>

                {/* Progress indicator */}
                {isPlaying && (
                  <div className="mt-4 text-center">
                    <div className="text-amber-300 font-semibold">
                      Note {currentNoteIndex + 1} of {(() => {
                        let length = position.notes.length
                        if (playDirection === "both") {
                          length = position.notes.length * 2 - 2
                        }
                        return length
                      })()}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Playback Controls */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">Play Pattern</h2>

              {/* Direction Selector */}
              <div className="mb-4">
                <label className="text-purple-200 text-sm font-semibold mb-2 block">Direction</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setPlayDirection("ascending")}
                    className={`py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                      playDirection === "ascending"
                        ? "bg-purple-600 text-white"
                        : "bg-white/20 text-purple-200 hover:bg-white/30"
                    }`}
                  >
                    ⬆ Up
                  </button>
                  <button
                    onClick={() => setPlayDirection("descending")}
                    className={`py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                      playDirection === "descending"
                        ? "bg-purple-600 text-white"
                        : "bg-white/20 text-purple-200 hover:bg-white/30"
                    }`}
                  >
                    ⬇ Down
                  </button>
                  <button
                    onClick={() => setPlayDirection("both")}
                    className={`py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                      playDirection === "both"
                        ? "bg-purple-600 text-white"
                        : "bg-white/20 text-purple-200 hover:bg-white/30"
                    }`}
                  >
                    ⬆⬇ Both
                  </button>
                </div>
              </div>

              {/* Play/Pause */}
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                    isPlaying
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  {isPlaying ? "⏸ Pause" : "▶ Play"}
                </button>
                <button
                  onClick={() => {
                    setIsPlaying(false)
                    setCurrentNoteIndex(0)
                  }}
                  className="px-6 py-3 rounded-lg font-semibold bg-white/20 hover:bg-white/30 text-white transition-all"
                >
                  ⏹ Stop
                </button>
              </div>

              {/* Tempo Control */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-purple-200 text-sm font-semibold">Tempo: {tempo} BPM</label>
                  <button
                    onClick={() => setTempo(80)}
                    className="text-xs text-purple-300 hover:text-purple-200"
                  >
                    Reset to 80
                  </button>
                </div>
                <input
                  type="range"
                  min="40"
                  max="160"
                  value={tempo}
                  onChange={(e) => setTempo(Number(e.target.value))}
                  className="w-full accent-purple-600"
                />
              </div>

              {/* Volume Control */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-purple-200 text-sm font-semibold">
                    Volume: {volume === 0 ? "Muted" : `${Math.round(volume * 100)}%`}
                  </label>
                  <button
                    onClick={() => setVolume(volume === 0 ? 0.5 : 0)}
                    className="text-xs text-purple-300 hover:text-purple-200"
                  >
                    {volume === 0 ? "🔇 Unmute" : "🔊 Mute"}
                  </button>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-full accent-purple-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Complete Fretboard View */}
        <div className="mt-8 bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">
            Complete Fretboard - All {NOTES[selectedRoot]} {arpeggioType.name} Notes
          </h3>
          <p className="text-purple-200 text-sm mb-6">
            Every note of the {NOTES[selectedRoot]} {arpeggioType.name} arpeggio across the entire fretboard
          </p>
          <FullChordFretboard
            chordName={`${NOTES[selectedRoot]} ${arpeggioType.name} Arpeggio`}
            rootNoteIndex={selectedRoot}
            intervals={arpeggioType.intervals}
            showNoteNames={true}
          />
        </div>

        {/* Practice Guide */}
        <div className="mt-8 bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
          <h3 className="text-xl font-bold text-white mb-4">Practice Guide</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-purple-200">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="font-semibold text-white mb-2">1. Learn One Position</div>
              <p>Master one position completely before moving to the next. Start with Position 1.</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="font-semibold text-white mb-2">2. Use a Metronome</div>
              <p>Practice with the built-in playback. Start slow (40-60 BPM) then gradually increase speed.</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="font-semibold text-white mb-2">3. Practice Both Directions</div>
              <p>Practice ascending, descending, and both. Real solos go in all directions!</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="font-semibold text-white mb-2">4. Connect to Chords</div>
              <p>Play the chord, then the arpeggio. This shows their relationship.</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="font-semibold text-white mb-2">5. Link Positions</div>
              <p>Practice moving from one position to another smoothly up and down the neck.</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="font-semibold text-white mb-2">6. Apply to Songs</div>
              <p>Use arpeggios when soloing over chord progressions. They always sound "right"!</p>
            </div>
          </div>
        </div>

        {/* Arpeggio vs Scale */}
        <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">Arpeggios vs Scales</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-white font-bold text-lg mb-2">🎸 Arpeggios</div>
              <ul className="text-purple-200 text-sm space-y-2">
                <li>• Chord tones only (3-4 notes)</li>
                <li>• Sounds consonant over the chord</li>
                <li>• Outlines the harmony</li>
                <li>• More "inside" the chord</li>
                <li>• Always safe choices</li>
                <li>• Best for chord changes</li>
              </ul>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-white font-bold text-lg mb-2">🎵 Scales</div>
              <ul className="text-purple-200 text-sm space-y-2">
                <li>• 5-7 notes (pentatonic/diatonic)</li>
                <li>• Includes passing tones</li>
                <li>• Fills the space between chord tones</li>
                <li>• More melodic freedom</li>
                <li>• Some notes create tension</li>
                <li>• Best for staying in one area</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 bg-amber-500/20 border border-amber-500/50 rounded-lg p-4">
            <p className="text-amber-200 text-sm">
              <strong>Pro Tip:</strong> Combine both! Use arpeggios to outline chords, scales to connect them. This is how the pros solo.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
