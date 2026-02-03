"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
const STRING_TUNING = [4, 9, 2, 7, 11, 4] // E A D G B e in semitones from C
const STRING_NAMES = ["E", "A", "D", "G", "B", "e"]

const INTERVALS = [
  { name: "Unison (Root)", semitones: 0, symbol: "P1", example: "C to C" },
  { name: "Minor 2nd", semitones: 1, symbol: "m2", example: "C to C#" },
  { name: "Major 2nd", semitones: 2, symbol: "M2", example: "C to D" },
  { name: "Minor 3rd", semitones: 3, symbol: "m3", example: "C to Eb" },
  { name: "Major 3rd", semitones: 4, symbol: "M3", example: "C to E" },
  { name: "Perfect 4th", semitones: 5, symbol: "P4", example: "C to F" },
  { name: "Tritone (Aug 4th)", semitones: 6, symbol: "TT", example: "C to F#" },
  { name: "Perfect 5th", semitones: 7, symbol: "P5", example: "C to G" },
  { name: "Minor 6th", semitones: 8, symbol: "m6", example: "C to Ab" },
  { name: "Major 6th", semitones: 9, symbol: "M6", example: "C to A" },
  { name: "Minor 7th", semitones: 10, symbol: "m7", example: "C to Bb" },
  { name: "Major 7th", semitones: 11, symbol: "M7", example: "C to B" },
  { name: "Octave", semitones: 12, symbol: "P8", example: "C to C" }
]

const CHORD_FORMULAS = [
  { name: "Major", formula: "1 - 3 - 5", intervals: [0, 4, 7], example: "C - E - G" },
  { name: "Minor", formula: "1 - ♭3 - 5", intervals: [0, 3, 7], example: "C - Eb - G" },
  { name: "Diminished", formula: "1 - ♭3 - ♭5", intervals: [0, 3, 6], example: "C - Eb - Gb" },
  { name: "Augmented", formula: "1 - 3 - ♯5", intervals: [0, 4, 8], example: "C - E - G#" },
  { name: "Major 7th", formula: "1 - 3 - 5 - 7", intervals: [0, 4, 7, 11], example: "C - E - G - B" },
  { name: "Minor 7th", formula: "1 - ♭3 - 5 - ♭7", intervals: [0, 3, 7, 10], example: "C - Eb - G - Bb" },
  { name: "Dominant 7th", formula: "1 - 3 - 5 - ♭7", intervals: [0, 4, 7, 10], example: "C - E - G - Bb" },
  { name: "Half-Diminished", formula: "1 - ♭3 - ♭5 - ♭7", intervals: [0, 3, 6, 10], example: "C - Eb - Gb - Bb" }
]

const CIRCLE_OF_FIFTHS = [
  { note: "C", majorKey: "C Major", minorKey: "A minor", sharpsFlats: "No ♯/♭", scaleNotes: ["C", "D", "E", "F", "G", "A", "B"] },
  { note: "G", majorKey: "G Major", minorKey: "E minor", sharpsFlats: "1 ♯", scaleNotes: ["G", "A", "B", "C", "D", "E", "F#"] },
  { note: "D", majorKey: "D Major", minorKey: "B minor", sharpsFlats: "2 ♯", scaleNotes: ["D", "E", "F#", "G", "A", "B", "C#"] },
  { note: "A", majorKey: "A Major", minorKey: "F# minor", sharpsFlats: "3 ♯", scaleNotes: ["A", "B", "C#", "D", "E", "F#", "G#"] },
  { note: "E", majorKey: "E Major", minorKey: "C# minor", sharpsFlats: "4 ♯", scaleNotes: ["E", "F#", "G#", "A", "B", "C#", "D#"] },
  { note: "B", majorKey: "B Major", minorKey: "G# minor", sharpsFlats: "5 ♯", scaleNotes: ["B", "C#", "D#", "E", "F#", "G#", "A#"] },
  { note: "F#/Gb", majorKey: "F# Major", minorKey: "D# minor", sharpsFlats: "6 ♯/♭", scaleNotes: ["F#", "G#", "A#", "B", "C#", "D#", "E#"] },
  { note: "Db", majorKey: "Db Major", minorKey: "Bb minor", sharpsFlats: "5 ♭", scaleNotes: ["Db", "Eb", "F", "Gb", "Ab", "Bb", "C"] },
  { note: "Ab", majorKey: "Ab Major", minorKey: "F minor", sharpsFlats: "4 ♭", scaleNotes: ["Ab", "Bb", "C", "Db", "Eb", "F", "G"] },
  { note: "Eb", majorKey: "Eb Major", minorKey: "C minor", sharpsFlats: "3 ♭", scaleNotes: ["Eb", "F", "G", "Ab", "Bb", "C", "D"] },
  { note: "Bb", majorKey: "Bb Major", minorKey: "G minor", sharpsFlats: "2 ♭", scaleNotes: ["Bb", "C", "D", "Eb", "F", "G", "A"] },
  { note: "F", majorKey: "F Major", minorKey: "D minor", sharpsFlats: "1 ♭", scaleNotes: ["F", "G", "A", "Bb", "C", "D", "E"] }
]

export default function MusicTheory() {
  // Existing state
  const [selectedNote, setSelectedNote] = useState(0) // C
  const [showAllNotes, setShowAllNotes] = useState(false)
  const [selectedInterval, setSelectedInterval] = useState<number | null>(null)

  // Interval Builder state
  const [intervalBuilderMode, setIntervalBuilderMode] = useState(false)
  const [rootNoteForInterval, setRootNoteForInterval] = useState(0)
  const [targetNoteForInterval, setTargetNoteForInterval] = useState<number | null>(null)
  const [calculatedInterval, setCalculatedInterval] = useState<typeof INTERVALS[0] | null>(null)

  // Circle of Fifths state
  const [selectedKey, setSelectedKey] = useState<number | null>(null)

  // Get note at specific string and fret
  const getNoteAtFret = (stringIndex: number, fret: number): string => {
    const openStringNote = STRING_TUNING[stringIndex]
    const noteIndex = (openStringNote + fret) % 12
    return NOTES[noteIndex]
  }

  // Calculate interval between two notes
  useEffect(() => {
    if (targetNoteForInterval !== null) {
      const semitones = (targetNoteForInterval - rootNoteForInterval + 12) % 12
      const interval = INTERVALS.find(int => int.semitones === semitones)
      setCalculatedInterval(interval || null)
    } else {
      setCalculatedInterval(null)
    }
  }, [rootNoteForInterval, targetNoteForInterval])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-purple-300 hover:text-purple-200 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Music Theory for Guitar</h1>
          <p className="text-purple-200">Build a strong foundation with interactive learning</p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Fretboard Notes Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">Notes on the Fretboard</h2>
            <p className="text-purple-200 mb-6">
              Understanding where notes are located on the fretboard is essential. Select a note to see where it appears across all strings.
            </p>

            {/* Note Selector */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Select a Note:</h3>
              <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
                {NOTES.map((note, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedNote(index)}
                    className={`py-3 px-4 rounded-lg font-bold transition-all ${
                      selectedNote === index
                        ? "bg-amber-500 text-white scale-105"
                        : "bg-white/20 text-purple-200 hover:bg-white/30"
                    }`}
                  >
                    {note}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggle for showing all notes */}
            <div className="mb-4 flex items-center gap-3">
              <button
                onClick={() => setShowAllNotes(!showAllNotes)}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                {showAllNotes ? "Show Selected Note Only" : "Show All Notes"}
              </button>
              <span className="text-purple-300 text-sm">
                Currently showing: {showAllNotes ? "All notes" : `All ${NOTES[selectedNote]} notes`}
              </span>
            </div>

            {/* Fretboard Visualization */}
            <div className="overflow-x-auto">
              <FretboardDiagram
                selectedNote={selectedNote}
                showAllNotes={showAllNotes}
                highlightString={null}
              />
            </div>

            {/* Fretboard Tips */}
            <div className="mt-6 bg-white/10 rounded-xl p-4">
              <h4 className="text-white font-semibold mb-2">Fretboard Learning Tips:</h4>
              <ul className="text-purple-200 text-sm space-y-1 list-disc list-inside">
                <li>Learn notes on the low E and A strings first (they're used for barre chords)</li>
                <li>Octave shapes help you find the same note in different positions</li>
                <li>The pattern repeats at the 12th fret (one octave higher)</li>
                <li>Natural notes (no sharps/flats) appear at specific frets: E, A, D on open strings</li>
              </ul>
            </div>
          </div>

          {/* Interval Builder Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Interactive Interval Builder</h2>
              <button
                onClick={() => {
                  setIntervalBuilderMode(!intervalBuilderMode)
                  setTargetNoteForInterval(null)
                  setCalculatedInterval(null)
                }}
                className={`font-semibold py-2 px-4 rounded-lg transition-all ${
                  intervalBuilderMode
                    ? "bg-purple-600 text-white"
                    : "bg-white/20 text-purple-200 hover:bg-white/30"
                }`}
              >
                {intervalBuilderMode ? "Active" : "Practice Mode"}
              </button>
            </div>

            {intervalBuilderMode ? (
              <div>
                <p className="text-purple-200 mb-6">
                  Select two notes to calculate the interval between them.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white/10 rounded-xl p-4">
                    <h3 className="text-white font-semibold mb-3">Root Note:</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {NOTES.map((note, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setRootNoteForInterval(index)
                            setTargetNoteForInterval(null)
                          }}
                          className={`py-2 px-3 rounded-lg font-bold transition-all ${
                            rootNoteForInterval === index
                              ? "bg-amber-500 text-white"
                              : "bg-white/20 text-purple-200 hover:bg-white/30"
                          }`}
                        >
                          {note}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-xl p-4">
                    <h3 className="text-white font-semibold mb-3">Target Note:</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {NOTES.map((note, index) => (
                        <button
                          key={index}
                          onClick={() => setTargetNoteForInterval(index)}
                          className={`py-2 px-3 rounded-lg font-bold transition-all ${
                            targetNoteForInterval === index
                              ? "bg-purple-600 text-white"
                              : "bg-white/20 text-purple-200 hover:bg-white/30"
                          }`}
                        >
                          {note}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {calculatedInterval && (
                  <div className="bg-gradient-to-r from-purple-600/30 to-amber-600/30 border border-purple-400 rounded-xl p-6">
                    <div className="text-center">
                      <div className="text-lg text-purple-200 mb-2">
                        {NOTES[rootNoteForInterval]} → {NOTES[targetNoteForInterval!]}
                      </div>
                      <div className="text-3xl font-bold text-white mb-2">
                        {calculatedInterval.name}
                      </div>
                      <div className="text-amber-400 font-mono text-xl mb-2">
                        {calculatedInterval.symbol}
                      </div>
                      <div className="text-purple-300">
                        {calculatedInterval.semitones} semitone{calculatedInterval.semitones !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p className="text-purple-200 mb-6">
                  An interval is the distance between two notes. Intervals are the building blocks of chords and scales.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  {INTERVALS.map((interval, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedInterval(index)}
                      className={`bg-white/10 rounded-lg p-4 cursor-pointer transition-all ${
                        selectedInterval === index ? "bg-purple-600/30 border-2 border-purple-400" : "hover:bg-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-white font-bold">{interval.name}</div>
                        <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-mono">
                          {interval.symbol}
                        </div>
                      </div>
                      <div className="text-purple-300 text-sm mb-1">
                        Distance: {interval.semitones} semitone{interval.semitones !== 1 ? 's' : ''}
                      </div>
                      <div className="text-purple-400 text-xs">
                        Example: {interval.example}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 bg-amber-500/20 border border-amber-500/50 rounded-lg p-4">
                  <h4 className="text-amber-200 font-semibold mb-2">Why Intervals Matter:</h4>
                  <div className="text-amber-100 text-sm space-y-1">
                    <p>• Intervals define the quality of chords (major vs minor, etc.)</p>
                    <p>• Understanding intervals helps you build chords anywhere on the neck</p>
                    <p>• Intervals are the foundation of melody and harmony</p>
                    <p>• They help you understand scales and modes</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chord Construction */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">Chord Construction</h2>
            <p className="text-purple-200 mb-6">
              Chords are built by stacking intervals. Here are the formulas for common chord types.
            </p>

            <div className="space-y-3">
              {CHORD_FORMULAS.map((chord, index) => (
                <div key={index} className="bg-white/10 rounded-lg p-5">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="flex-1">
                      <div className="text-white font-bold text-lg mb-1">{chord.name}</div>
                      <div className="text-purple-300 text-sm mb-2">Formula: {chord.formula}</div>
                      <div className="text-purple-400 text-sm">Example in C: {chord.example}</div>
                    </div>
                    <div className="flex gap-2">
                      {chord.intervals.map((interval, i) => {
                        const intervalInfo = INTERVALS.find(int => int.semitones === interval)
                        return (
                          <div
                            key={i}
                            className="bg-purple-600 text-white px-3 py-2 rounded-lg text-center"
                          >
                            <div className="text-xs opacity-80">{intervalInfo?.symbol || interval}</div>
                            <div className="font-bold text-sm">{NOTES[(0 + interval) % 12]}</div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-white/10 rounded-xl p-4">
              <h4 className="text-white font-semibold mb-2">Building Chords on Guitar:</h4>
              <div className="text-purple-200 text-sm space-y-2">
                <p>
                  <strong className="text-white">Major chord:</strong> Has a bright, happy sound (Major 3rd interval)
                </p>
                <p>
                  <strong className="text-white">Minor chord:</strong> Has a sad, melancholic sound (Minor 3rd interval)
                </p>
                <p>
                  <strong className="text-white">7th chords:</strong> Add color and tension, commonly used in jazz and blues
                </p>
                <p>
                  <strong className="text-white">Diminished:</strong> Creates tension, often used as passing chords
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Circle of Fifths */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">Interactive Circle of Fifths</h2>
            <p className="text-purple-200 mb-6">
              Click on any key to explore its scale notes and relationships.
            </p>

            {/* Circle visualization */}
            <div className="flex justify-center mb-6">
              <InteractiveCircleOfFifths
                selectedKey={selectedKey}
                onKeySelect={setSelectedKey}
              />
            </div>

            {/* Selected Key Info */}
            {selectedKey !== null && (
              <div className="bg-gradient-to-r from-purple-600/30 to-amber-600/30 border border-purple-400 rounded-xl p-6 mb-6">
                <h3 className="text-2xl font-bold text-white mb-4 text-center">
                  {CIRCLE_OF_FIFTHS[selectedKey].majorKey}
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-3">Key Information:</h4>
                    <div className="space-y-2 text-purple-200 text-sm">
                      <div>Major Key: <span className="text-white font-bold">{CIRCLE_OF_FIFTHS[selectedKey].majorKey}</span></div>
                      <div>Relative Minor: <span className="text-white font-bold">{CIRCLE_OF_FIFTHS[selectedKey].minorKey}</span></div>
                      <div>Key Signature: <span className="text-white font-bold">{CIRCLE_OF_FIFTHS[selectedKey].sharpsFlats}</span></div>
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-3">Scale Notes:</h4>
                    <div className="flex flex-wrap gap-2">
                      {CIRCLE_OF_FIFTHS[selectedKey].scaleNotes.map((note, index) => (
                        <div
                          key={index}
                          className="bg-purple-600 text-white px-3 py-2 rounded-lg font-bold"
                        >
                          {note}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Key signatures table */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white mb-3">All Keys:</h3>
              {CIRCLE_OF_FIFTHS.map((key, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedKey(index)}
                  className={`rounded-lg p-4 flex items-center justify-between cursor-pointer transition-all ${
                    selectedKey === index
                      ? "bg-purple-600/30 border-2 border-purple-400"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold">
                      {key.note}
                    </div>
                    <div>
                      <div className="text-white font-semibold">{key.majorKey}</div>
                      <div className="text-purple-300 text-sm">{key.minorKey}</div>
                    </div>
                  </div>
                  <div className="text-purple-200 text-sm font-mono bg-white/10 px-4 py-2 rounded">
                    {key.sharpsFlats}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-white/10 rounded-xl p-4">
              <h4 className="text-white font-semibold mb-2">Using the Circle of Fifths:</h4>
              <ul className="text-purple-200 text-sm space-y-1 list-disc list-inside">
                <li>Moving clockwise increases by a Perfect 5th and adds sharps</li>
                <li>Moving counter-clockwise decreases by a Perfect 5th and adds flats</li>
                <li>Helps with transposing songs to different keys</li>
                <li>Shows which keys are closely related (adjacent keys share many notes)</li>
                <li>Each major key has a relative minor (3 semitones down)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Interactive Fretboard Quiz Component
function InteractiveFretboardQuiz({
  onNoteClick
}: {
  onNoteClick: (stringIndex: number, fret: number) => void
}) {
  const strings = 6
  const numFrets = 12
  const fretWidth = 70
  const stringGap = 35
  const startX = 100
  const startY = 50
  const width = startX + numFrets * fretWidth + 40
  const height = startY + (strings - 1) * stringGap + 80

  const fretMarkers = [3, 5, 7, 9, 12]
  const doubleDotFrets = [12]

  return (
    <div className="flex justify-center">
      <svg width={width} height={height} className="bg-gradient-to-br from-amber-900/20 to-amber-700/10 rounded-xl border border-amber-600/30">
        {/* Nut */}
        <line
          x1={startX}
          y1={startY}
          x2={startX}
          y2={startY + (strings - 1) * stringGap}
          stroke="white"
          strokeWidth="6"
        />

        {/* Frets */}
        {Array.from({ length: numFrets + 1 }).map((_, i) => (
          <line
            key={`fret-${i}`}
            x1={startX + i * fretWidth}
            y1={startY}
            x2={startX + i * fretWidth}
            y2={startY + (strings - 1) * stringGap}
            stroke="white"
            strokeWidth={i === 0 ? "6" : "2"}
            opacity={i === 0 ? "1" : "0.4"}
          />
        ))}

        {/* Strings */}
        {Array.from({ length: strings }).map((_, i) => (
          <line
            key={`string-${i}`}
            x1={startX}
            y1={startY + i * stringGap}
            x2={startX + numFrets * fretWidth}
            y2={startY + i * stringGap}
            stroke="white"
            strokeWidth={i === 0 ? "3" : i === 5 ? "1.5" : "2"}
            opacity="0.6"
          />
        ))}

        {/* Fret markers */}
        {fretMarkers.map(fretNum => {
          const x = startX + (fretNum - 0.5) * fretWidth
          const y = startY + ((strings - 1) * stringGap) / 2

          if (doubleDotFrets.includes(fretNum)) {
            return (
              <g key={`marker-${fretNum}`}>
                <circle cx={x} cy={y - stringGap} r="6" fill="white" opacity="0.15" />
                <circle cx={x} cy={y + stringGap} r="6" fill="white" opacity="0.15" />
              </g>
            )
          }

          return <circle key={`marker-${fretNum}`} cx={x} cy={y} r="6" fill="white" opacity="0.15" />
        })}

        {/* Clickable areas */}
        {Array.from({ length: strings }).map((_, stringIndex) =>
          Array.from({ length: numFrets + 1 }).map((_, fret) => {
            const x = startX + (fret === 0 ? 0 : (fret - 0.5) * fretWidth)
            const y = startY + stringIndex * stringGap

            return (
              <circle
                key={`click-${stringIndex}-${fret}`}
                cx={x}
                cy={y}
                r={20}
                fill="transparent"
                stroke="none"
                className="cursor-pointer hover:fill-purple-500/30"
                onClick={() => onNoteClick(stringIndex, fret)}
              />
            )
          })
        )}

        {/* Fret numbers */}
        <g fontSize="12" fill="white" opacity="0.5" fontWeight="bold">
          {Array.from({ length: numFrets + 1 }).map((_, i) => (
            <text
              key={`fret-num-${i}`}
              x={startX + i * fretWidth}
              y={startY + (strings - 1) * stringGap + 30}
              textAnchor="middle"
            >
              {i}
            </text>
          ))}
        </g>

        {/* String labels */}
        <g fontSize="14" fill="white" opacity="0.7" fontWeight="bold">
          {STRING_NAMES.map((name, i) => (
            <text key={`string-${i}`} x={startX - 30} y={startY + i * stringGap + 5} textAnchor="middle">
              {name}
            </text>
          ))}
        </g>
      </svg>
    </div>
  )
}

// Fretboard Diagram Component (for note visualization)
function FretboardDiagram({
  selectedNote,
  showAllNotes,
  highlightString
}: {
  selectedNote: number
  showAllNotes: boolean
  highlightString: number | null
}) {
  const strings = 6
  const numFrets = 12
  const fretWidth = 70
  const stringGap = 35
  const startX = 100
  const startY = 50
  const width = startX + numFrets * fretWidth + 40
  const height = startY + (strings - 1) * stringGap + 80

  const getNoteAtFret = (stringIndex: number, fret: number): string => {
    const openStringNote = STRING_TUNING[stringIndex]
    const noteIndex = (openStringNote + fret) % 12
    return NOTES[noteIndex]
  }

  const shouldShowNote = (stringIndex: number, fret: number): boolean => {
    const note = getNoteAtFret(stringIndex, fret)
    if (showAllNotes) return true
    return note === NOTES[selectedNote]
  }

  const isHighlighted = (stringIndex: number, fret: number): boolean => {
    const note = getNoteAtFret(stringIndex, fret)
    return note === NOTES[selectedNote]
  }

  const fretMarkers = [3, 5, 7, 9, 12]
  const doubleDotFrets = [12]

  return (
    <div className="flex justify-center">
      <svg width={width} height={height} className="bg-gradient-to-br from-amber-900/20 to-amber-700/10 rounded-xl border border-amber-600/30">
        {/* Nut */}
        <line
          x1={startX}
          y1={startY}
          x2={startX}
          y2={startY + (strings - 1) * stringGap}
          stroke="white"
          strokeWidth="6"
        />

        {/* Frets */}
        {Array.from({ length: numFrets + 1 }).map((_, i) => (
          <line
            key={`fret-${i}`}
            x1={startX + i * fretWidth}
            y1={startY}
            x2={startX + i * fretWidth}
            y2={startY + (strings - 1) * stringGap}
            stroke="white"
            strokeWidth={i === 0 ? "6" : "2"}
            opacity={i === 0 ? "1" : "0.4"}
          />
        ))}

        {/* Strings */}
        {Array.from({ length: strings }).map((_, i) => (
          <line
            key={`string-${i}`}
            x1={startX}
            y1={startY + i * stringGap}
            x2={startX + numFrets * fretWidth}
            y2={startY + i * stringGap}
            stroke="white"
            strokeWidth={i === 0 ? "3" : i === 5 ? "1.5" : "2"}
            opacity="0.6"
          />
        ))}

        {/* Fret markers */}
        {fretMarkers.map(fretNum => {
          const x = startX + (fretNum - 0.5) * fretWidth
          const y = startY + ((strings - 1) * stringGap) / 2

          if (doubleDotFrets.includes(fretNum)) {
            return (
              <g key={`marker-${fretNum}`}>
                <circle cx={x} cy={y - stringGap} r="6" fill="white" opacity="0.15" />
                <circle cx={x} cy={y + stringGap} r="6" fill="white" opacity="0.15" />
              </g>
            )
          }

          return <circle key={`marker-${fretNum}`} cx={x} cy={y} r="6" fill="white" opacity="0.15" />
        })}

        {/* Notes */}
        {Array.from({ length: strings }).map((_, stringIndex) =>
          Array.from({ length: numFrets + 1 }).map((_, fret) => {
            if (!shouldShowNote(stringIndex, fret)) return null

            const x = startX + (fret === 0 ? 0 : (fret - 0.5) * fretWidth)
            const y = startY + stringIndex * stringGap
            const note = getNoteAtFret(stringIndex, fret)
            const highlighted = isHighlighted(stringIndex, fret)

            return (
              <g key={`note-${stringIndex}-${fret}`}>
                <circle
                  cx={x}
                  cy={y}
                  r={highlighted ? 16 : 14}
                  fill={highlighted ? "#f59e0b" : "#a855f7"}
                  stroke="white"
                  strokeWidth="2.5"
                  opacity="0.95"
                />
                <text
                  x={x}
                  y={y + 1}
                  fill="white"
                  fontSize="11"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {note.replace("#", "♯")}
                </text>
              </g>
            )
          })
        )}

        {/* Fret numbers */}
        <g fontSize="12" fill="white" opacity="0.5" fontWeight="bold">
          {Array.from({ length: numFrets + 1 }).map((_, i) => (
            <text
              key={`fret-num-${i}`}
              x={startX + i * fretWidth}
              y={startY + (strings - 1) * stringGap + 30}
              textAnchor="middle"
            >
              {i}
            </text>
          ))}
        </g>

        {/* String labels */}
        <g fontSize="14" fill="white" opacity="0.7" fontWeight="bold">
          {STRING_NAMES.map((name, i) => (
            <text key={`string-${i}`} x={startX - 30} y={startY + i * stringGap + 5} textAnchor="middle">
              {name}
            </text>
          ))}
        </g>
      </svg>
    </div>
  )
}

// Interactive Circle of Fifths Component
function InteractiveCircleOfFifths({
  selectedKey,
  onKeySelect
}: {
  selectedKey: number | null
  onKeySelect: (index: number) => void
}) {
  const centerX = 200
  const centerY = 200
  const radius = 140
  const notes = ["C", "G", "D", "A", "E", "B", "F#/Gb", "Db", "Ab", "Eb", "Bb", "F"]

  return (
    <svg width="400" height="400" className="max-w-full">
      {/* Outer circle */}
      <circle
        cx={centerX}
        cy={centerY}
        r={radius}
        fill="none"
        stroke="rgba(168, 85, 247, 0.3)"
        strokeWidth="2"
      />

      {/* Inner circle */}
      <circle
        cx={centerX}
        cy={centerY}
        r={radius - 50}
        fill="none"
        stroke="rgba(168, 85, 247, 0.2)"
        strokeWidth="2"
      />

      {/* Notes around the circle */}
      {notes.map((note, index) => {
        const angle = (index * 30 - 90) * (Math.PI / 180)
        const x = centerX + radius * Math.cos(angle)
        const y = centerY + radius * Math.sin(angle)
        const isSelected = selectedKey === index

        return (
          <g key={index} className="cursor-pointer" onClick={() => onKeySelect(index)}>
            {/* Connection line to center */}
            <line
              x1={centerX}
              y1={centerY}
              x2={x}
              y2={y}
              stroke={isSelected ? "rgba(245, 158, 11, 0.5)" : "rgba(168, 85, 247, 0.2)"}
              strokeWidth={isSelected ? "3" : "1"}
            />

            {/* Note circle */}
            <circle
              cx={x}
              cy={y}
              r="28"
              fill={isSelected ? "#f59e0b" : "#7c3aed"}
              stroke="white"
              strokeWidth={isSelected ? "3" : "2"}
              className="hover:fill-purple-500 transition-colors"
            />

            {/* Note text */}
            <text
              x={x}
              y={y + 1}
              fill="white"
              fontSize="14"
              fontWeight="bold"
              textAnchor="middle"
              dominantBaseline="middle"
              className="pointer-events-none"
            >
              {note}
            </text>
          </g>
        )
      })}

      {/* Center label */}
      <text
        x={centerX}
        y={centerY}
        fill="white"
        fontSize="16"
        fontWeight="bold"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        Circle of
      </text>
      <text
        x={centerX}
        y={centerY + 20}
        fill="white"
        fontSize="16"
        fontWeight="bold"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        Fifths
      </text>
    </svg>
  )
}
