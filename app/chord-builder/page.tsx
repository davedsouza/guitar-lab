"use client"

import { useState } from "react"
import Link from "next/link"
import ChordDiagram from "@/components/ChordDiagram"
import FullChordFretboard from "@/components/FullChordFretboard"
import { getChordShape, getChordVoicings } from "@/lib/chordShapes"

const NOTES = ["C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B"]

const CHORD_TYPES = [
  { name: "Major", formula: "1 - 3 - 5", intervals: [0, 4, 7], description: "Happy, bright sound" },
  { name: "Minor", formula: "1 - ♭3 - 5", intervals: [0, 3, 7], description: "Sad, melancholic sound" },
  { name: "Dominant 7th", formula: "1 - 3 - 5 - ♭7", intervals: [0, 4, 7, 10], description: "Tension, wants to resolve" },
  { name: "Major 7th", formula: "1 - 3 - 5 - 7", intervals: [0, 4, 7, 11], description: "Dreamy, jazzy sound" },
  { name: "Minor 7th", formula: "1 - ♭3 - 5 - ♭7", intervals: [0, 3, 7, 10], description: "Smooth, mellow sound" },
  { name: "Diminished", formula: "1 - ♭3 - ♭5", intervals: [0, 3, 6], description: "Tense, unstable sound" },
  { name: "Augmented", formula: "1 - 3 - #5", intervals: [0, 4, 8], description: "Mysterious, suspenseful" },
  { name: "Sus4", formula: "1 - 4 - 5", intervals: [0, 5, 7], description: "Open, unresolved feel" },
]

export default function ChordBuilder() {
  const [selectedRoot, setSelectedRoot] = useState(0) // C
  const [selectedChordType, setSelectedChordType] = useState(0) // Major
  const [selectedVoicing, setSelectedVoicing] = useState(0) // Position 1

  const buildChord = () => {
    const chordType = CHORD_TYPES[selectedChordType]
    return chordType.intervals.map(interval => {
      const noteIndex = (selectedRoot + interval) % 12
      return NOTES[noteIndex]
    })
  }

  const chordNotes = buildChord()
  const chordName = `${NOTES[selectedRoot]} ${CHORD_TYPES[selectedChordType].name}`

  // Get all available voicings for the current chord
  const voicings = getChordVoicings(NOTES[selectedRoot], CHORD_TYPES[selectedChordType].name)
  const hasVoicings = voicings && voicings.length > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-purple-300 hover:text-purple-200 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Chord Builder</h1>
          <p className="text-purple-200">Learn how chords are constructed from intervals</p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Controls */}
          <div className="space-y-6">
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

            {/* Chord Type Selector */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">2. Select Chord Type</h2>
              <div className="space-y-2">
                {CHORD_TYPES.map((chord, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedChordType(index)
                      setSelectedVoicing(0) // Reset to first position when changing chord type
                    }}
                    className={`w-full text-left py-3 px-4 rounded-lg transition-all ${
                      selectedChordType === index
                        ? "bg-purple-600 text-white"
                        : "bg-white/20 text-purple-200 hover:bg-white/30"
                    }`}
                  >
                    <div className="font-semibold">{chord.name}</div>
                    <div className="text-sm opacity-80">{chord.formula}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Position Selector */}
            {hasVoicings && voicings.length > 1 && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h2 className="text-xl font-bold text-white mb-4">3. Select Position on Neck</h2>
                <p className="text-purple-300 text-sm mb-4">
                  Play the same chord in different positions
                </p>
                <div className="space-y-2">
                  {voicings.map((voicing, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedVoicing(index)}
                      className={`w-full text-left py-3 px-4 rounded-lg transition-all ${
                        selectedVoicing === index
                          ? "bg-purple-600 text-white"
                          : "bg-white/20 text-purple-200 hover:bg-white/30"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold">{voicing.position}</div>
                          <div className="text-xs opacity-70 capitalize">
                            {voicing.difficulty} level
                          </div>
                        </div>
                        {selectedVoicing === index && (
                          <div className="text-amber-400">✓</div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Results */}
          <div className="space-y-6">
            {/* Chord Display */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-6">Your Chord</h2>
              <div className="text-center mb-8">
                <div className="text-5xl font-bold text-white mb-2">{chordName}</div>
                <div className="text-purple-300 text-lg">
                  {CHORD_TYPES[selectedChordType].description}
                </div>
              </div>

              {/* Notes Display */}
              <div className="bg-white/10 rounded-xl p-6 mb-6">
                <div className="text-purple-200 text-sm mb-3">Notes in this chord:</div>
                <div className="flex justify-center gap-4">
                  {chordNotes.map((note, index) => (
                    <div
                      key={index}
                      className="bg-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold"
                    >
                      {note}
                    </div>
                  ))}
                </div>
              </div>

              {/* Guitar Diagram */}
              <div className="bg-white/10 rounded-xl p-6">
                {hasVoicings ? (
                  <div className="flex flex-col items-center">
                    <ChordDiagram
                      chordName={`${chordName} - ${voicings[selectedVoicing].position}`}
                      fingers={voicings[selectedVoicing].fingers}
                      size="large"
                    />
                    <div className="mt-4 text-center">
                      <div className="text-purple-300 text-sm mb-1">
                        Position: {voicings[selectedVoicing].position}
                      </div>
                      <div className="text-purple-400 text-xs capitalize">
                        Difficulty: {voicings[selectedVoicing].difficulty}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-purple-300 text-center py-8">
                    <div className="text-4xl mb-2">🎸</div>
                    <div>Chord diagram not available for this combination</div>
                    <div className="text-sm mt-2">Try C, D, E, F, G, A, or B with Major/Minor/7th</div>
                  </div>
                )}
              </div>
            </div>

            {/* Theory Explanation */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-3">How This Chord is Built</h3>
              <div className="space-y-3 text-purple-200">
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="font-semibold text-white mb-1">Formula</div>
                  <div>{CHORD_TYPES[selectedChordType].formula}</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="font-semibold text-white mb-2">Intervals from Root</div>
                  {CHORD_TYPES[selectedChordType].intervals.map((interval, index) => (
                    <div key={index} className="text-sm">
                      {chordNotes[index]} = {interval} semitones from {NOTES[selectedRoot]}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Educational Info */}
        <div className="mt-8 bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">Understanding Chord Construction</h3>
          <div className="grid md:grid-cols-2 gap-6 text-purple-200">
            <div>
              <h4 className="font-semibold text-white mb-2">What are Intervals?</h4>
              <p className="text-sm">
                Intervals are the distances between notes, measured in semitones (half steps).
                Each chord type has a unique interval formula that creates its characteristic sound.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">The Chromatic Scale</h4>
              <p className="text-sm">
                The chromatic scale contains all 12 notes: {NOTES.join(", ")}.
                We build chords by selecting specific notes from this scale based on interval patterns.
              </p>
            </div>
          </div>
        </div>

        {/* All Positions View */}
        {hasVoicings && voicings.length > 1 && (
          <div className="mt-8 bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">All Positions of {chordName}</h3>
            <p className="text-purple-200 text-sm mb-6">
              Compare all available positions on the neck. Each position offers different fingerings and tonal characteristics.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {voicings.map((voicing, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedVoicing(index)}
                  className={`bg-white/5 rounded-xl p-4 cursor-pointer transition-all hover:bg-white/10 ${
                    selectedVoicing === index ? "ring-2 ring-purple-500" : ""
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <ChordDiagram
                      chordName={voicing.position}
                      fingers={voicing.fingers}
                      size="medium"
                    />
                    <div className="mt-3 text-center w-full">
                      <div className="text-white font-semibold mb-1">
                        {voicing.position}
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-purple-300 text-xs capitalize">
                          {voicing.difficulty}
                        </span>
                        {selectedVoicing === index && (
                          <span className="text-amber-400 text-xs">✓ Selected</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 bg-amber-500/20 border border-amber-500/50 rounded-lg p-4">
              <h4 className="text-amber-200 font-semibold mb-2 text-sm">Position Tips:</h4>
              <div className="text-amber-100 text-xs space-y-1">
                <p>• <strong>Open Position:</strong> Easiest to play, uses open strings, great for beginners</p>
                <p>• <strong>Barre Chords:</strong> Movable shapes that work anywhere on the neck</p>
                <p>• <strong>Higher Frets:</strong> Brighter tone, useful for lead playing and solos</p>
                <p>• <strong>Practice Tip:</strong> Learn to switch between positions smoothly for more musical freedom</p>
              </div>
            </div>
          </div>
        )}

        {/* Complete Fretboard View */}
        <div className="mt-8 bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">Complete Fretboard View</h3>
          <p className="text-purple-200 text-sm mb-6">
            See how all positions of {chordName} connect across the entire neck. This view shows every occurrence of the chord tones across 12 frets.
          </p>
          <FullChordFretboard
            chordName={chordName}
            rootNoteIndex={selectedRoot}
            intervals={CHORD_TYPES[selectedChordType].intervals}
            showNoteNames={true}
          />
        </div>
      </div>
    </div>
  )
}
