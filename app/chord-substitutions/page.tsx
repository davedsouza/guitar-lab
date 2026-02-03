"use client"

import { useState } from "react"
import Link from "next/link"
import ChordDiagram from "@/components/ChordDiagram"
import FullChordFretboard from "@/components/FullChordFretboard"
import { getChordShape } from "@/lib/chordShapes"

interface ChordEntry {
  degree: number
  quality: string
  roman: string
  subFor?: string
}

const KEYS = ["C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B"]

// Substitution types
const SUBSTITUTION_TYPES = [
  {
    name: "Relative Minor/Major",
    id: "relative",
    description: "Replace a major chord with its relative minor (or vice versa)",
    explanation: "The relative minor is 3 semitones below the major. They share the same notes.",
    example: "C ↔ Am, G ↔ Em",
    difficulty: "Beginner",
    color: "bg-green-600"
  },
  {
    name: "Parallel Minor/Major",
    id: "parallel",
    description: "Replace a major chord with the minor version of the same root (or vice versa)",
    explanation: "Keeps the same root note but changes the chord quality. Creates dramatic mood shift.",
    example: "C ↔ Cm, G ↔ Gm",
    difficulty: "Beginner",
    color: "bg-blue-600"
  },
  {
    name: "Diatonic Substitution",
    id: "diatonic",
    description: "Replace with another chord from the same key that has similar function",
    explanation: "Chords with the same harmonic function can substitute for each other.",
    example: "I with iii or vi, IV with ii, V with vii°",
    difficulty: "Intermediate",
    color: "bg-purple-600"
  },
  {
    name: "Secondary Dominant",
    id: "secondary",
    description: "Add a dominant 7th chord that resolves to a diatonic chord",
    explanation: "Treat any chord as if it's the I chord temporarily, and play its V7.",
    example: "Before ii, play V7/ii (which is VI7)",
    difficulty: "Advanced",
    color: "bg-amber-600"
  },
  {
    name: "Tritone Substitution",
    id: "tritone",
    description: "Replace a dominant 7th with another dom7 a tritone away",
    explanation: "Works because they share the same 3rd and 7th notes (enharmonically).",
    example: "G7 ↔ Db7, D7 ↔ Ab7",
    difficulty: "Advanced",
    color: "bg-red-600"
  },
  {
    name: "Diminished Passing",
    id: "diminished",
    description: "Insert a diminished chord between two diatonic chords",
    explanation: "Diminished chords create smooth chromatic voice leading between chords.",
    example: "C - C#dim - Dm, or I - #I° - ii",
    difficulty: "Intermediate",
    color: "bg-indigo-600"
  }
]

// Example progressions with substitutions
const PROGRESSION_EXAMPLES = [
  {
    name: "I - V - vi - IV (Pop Progression)",
    original: [
      { degree: 0, quality: "Major", roman: "I" },
      { degree: 7, quality: "Major", roman: "V" },
      { degree: 9, quality: "Minor", roman: "vi" },
      { degree: 5, quality: "Major", roman: "IV" }
    ],
    substitutions: [
      {
        name: "With iii for I",
        type: "diatonic",
        chords: [
          { degree: 4, quality: "Minor", roman: "iii", subFor: "I" },
          { degree: 7, quality: "Major", roman: "V" },
          { degree: 9, quality: "Minor", roman: "vi" },
          { degree: 5, quality: "Major", roman: "IV" }
        ]
      },
      {
        name: "With ii for IV",
        type: "diatonic",
        chords: [
          { degree: 0, quality: "Major", roman: "I" },
          { degree: 7, quality: "Major", roman: "V" },
          { degree: 9, quality: "Minor", roman: "vi" },
          { degree: 2, quality: "Minor", roman: "ii", subFor: "IV" }
        ]
      }
    ]
  },
  {
    name: "ii - V - I (Jazz Standard)",
    original: [
      { degree: 2, quality: "Minor", roman: "ii" },
      { degree: 7, quality: "Dominant 7th", roman: "V7" },
      { degree: 0, quality: "Major", roman: "I" }
    ],
    substitutions: [
      {
        name: "Tritone Sub on V7",
        type: "tritone",
        chords: [
          { degree: 2, quality: "Minor", roman: "ii" },
          { degree: 1, quality: "Dominant 7th", roman: "♭II7", subFor: "V7" },
          { degree: 0, quality: "Major", roman: "I" }
        ]
      },
      {
        name: "With Secondary Dominant",
        type: "secondary",
        chords: [
          { degree: 9, quality: "Dominant 7th", roman: "VI7", subFor: "ii" },
          { degree: 2, quality: "Minor", roman: "ii" },
          { degree: 7, quality: "Dominant 7th", roman: "V7" },
          { degree: 0, quality: "Major", roman: "I" }
        ]
      }
    ]
  }
]

export default function ChordSubstitutions() {
  const [selectedKey, setSelectedKey] = useState(0) // C
  const [selectedProgression, setSelectedProgression] = useState(0)
  const [selectedSubstitution, setSelectedSubstitution] = useState(0)
  const [showOriginal, setShowOriginal] = useState(true)

  const getChordFromDegree = (semitones: number, quality: string) => {
    const noteIndex = (selectedKey + semitones) % 12
    const note = KEYS[noteIndex]
    return { note, quality }
  }

  const getChordIntervals = (quality: string): number[] => {
    switch (quality) {
      case "Major":
        return [0, 4, 7]
      case "Minor":
        return [0, 3, 7]
      case "Dominant 7th":
        return [0, 4, 7, 10]
      case "Major 7th":
        return [0, 4, 7, 11]
      case "Minor 7th":
        return [0, 3, 7, 10]
      case "Diminished":
        return [0, 3, 6]
      default:
        return [0, 4, 7]
    }
  }

  const getNoteIndex = (note: string): number => {
    return KEYS.indexOf(note)
  }

  const progression = PROGRESSION_EXAMPLES[selectedProgression]
  const currentSubstitution = progression.substitutions[selectedSubstitution]

  const displayedChords: ChordEntry[] = showOriginal ? progression.original : currentSubstitution.chords

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-purple-300 hover:text-purple-200 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Chord Substitutions</h1>
          <p className="text-purple-200">Transform your progressions with advanced substitution techniques</p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Theory & Types */}
          <div className="space-y-6">
            {/* What are Substitutions */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">What are Chord Substitutions?</h2>
              <div className="space-y-3 text-purple-200 text-sm">
                <p>
                  Chord substitution is the technique of replacing one chord with another while maintaining
                  the harmonic function or adding interesting color to a progression.
                </p>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="font-semibold text-white mb-2">Why Use Substitutions?</div>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Add sophistication to simple progressions</li>
                    <li>Create smoother voice leading</li>
                    <li>Introduce unexpected harmonic color</li>
                    <li>Reharmonize familiar melodies</li>
                    <li>Develop your jazz and advanced playing</li>
                  </ul>
                </div>
                <div className="bg-amber-500/20 border border-amber-500/50 rounded-lg p-3">
                  <p className="text-amber-200 text-xs">
                    <strong>Pro Tip:</strong> Start with simple substitutions (relative minor/major) and
                    gradually work up to advanced techniques like tritone substitution.
                  </p>
                </div>
              </div>
            </div>

            {/* Key Selector */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">Select Key</h2>
              <div className="grid grid-cols-4 gap-2">
                {KEYS.map((key, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedKey(index)}
                    className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                      selectedKey === index
                        ? "bg-purple-600 text-white scale-105"
                        : "bg-white/20 text-purple-200 hover:bg-white/30"
                    }`}
                  >
                    {key}
                  </button>
                ))}
              </div>
              <p className="text-purple-300 text-sm mt-3">Key of {KEYS[selectedKey]} Major</p>
            </div>

            {/* Substitution Types */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">Types of Substitutions</h2>
              <div className="space-y-3">
                {SUBSTITUTION_TYPES.map((type, index) => (
                  <div key={index} className="bg-white/10 rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-2">
                      <div className={`${type.color} text-white px-3 py-1 rounded-full text-xs font-bold`}>
                        {type.difficulty}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-white text-sm">{type.name}</div>
                      </div>
                    </div>
                    <div className="text-purple-200 text-xs mb-2">{type.description}</div>
                    <div className="text-purple-300 text-xs mb-2">{type.explanation}</div>
                    <div className="bg-white/10 rounded px-2 py-1 text-xs text-purple-200 font-mono">
                      Example: {type.example}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Interactive Examples */}
          <div className="space-y-6">
            {/* Progression Selector */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">Explore Substitutions</h2>

              {/* Progression Tabs */}
              <div className="mb-4">
                <label className="text-purple-200 text-sm mb-2 block">Select Progression</label>
                <div className="space-y-2">
                  {PROGRESSION_EXAMPLES.map((prog, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedProgression(index)
                        setSelectedSubstitution(0)
                      }}
                      className={`w-full text-left py-3 px-4 rounded-lg transition-all ${
                        selectedProgression === index
                          ? "bg-purple-600 text-white"
                          : "bg-white/20 text-purple-200 hover:bg-white/30"
                      }`}
                    >
                      <div className="font-semibold">{prog.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Substitution Options */}
              <div className="mb-4">
                <label className="text-purple-200 text-sm mb-2 block">Substitution Option</label>
                <div className="space-y-2">
                  {progression.substitutions.map((sub, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedSubstitution(index)}
                      className={`w-full text-left py-2 px-4 rounded-lg transition-all ${
                        selectedSubstitution === index
                          ? "bg-amber-600 text-white"
                          : "bg-white/20 text-purple-200 hover:bg-white/30"
                      }`}
                    >
                      <div className="text-sm font-semibold">{sub.name}</div>
                      <div className="text-xs opacity-80 capitalize">Type: {sub.type}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggle Original/Substitution */}
              <div className="flex gap-2 bg-white/10 rounded-lg p-1">
                <button
                  onClick={() => setShowOriginal(true)}
                  className={`flex-1 py-2 px-4 rounded-md font-semibold text-sm transition-all ${
                    showOriginal
                      ? "bg-purple-600 text-white"
                      : "text-purple-200 hover:text-white"
                  }`}
                >
                  Original
                </button>
                <button
                  onClick={() => setShowOriginal(false)}
                  className={`flex-1 py-2 px-4 rounded-md font-semibold text-sm transition-all ${
                    !showOriginal
                      ? "bg-purple-600 text-white"
                      : "text-purple-200 hover:text-white"
                  }`}
                >
                  Substituted
                </button>
              </div>
            </div>

            {/* Chord Display */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-lg font-bold text-white mb-4">
                {showOriginal ? "Original Progression" : `Substitution: ${currentSubstitution.name}`}
              </h2>

              {/* Chord Boxes */}
              <div className="flex flex-wrap gap-3 justify-center mb-6">
                {displayedChords.map((chord, index) => {
                  const { note, quality } = getChordFromDegree(chord.degree, chord.quality)
                  const isSubstituted = !showOriginal && chord.subFor

                  return (
                    <div key={index} className="text-center">
                      <div className={`rounded-xl p-4 min-w-[100px] ${
                        isSubstituted ? "bg-amber-600 ring-2 ring-amber-400" : "bg-purple-600"
                      }`}>
                        <div className="text-2xl font-bold text-white mb-1">
                          {note}
                        </div>
                        <div className="text-purple-100 text-xs">
                          {quality}
                        </div>
                      </div>
                      <div className="text-purple-300 text-sm mt-2 font-semibold">
                        {chord.roman}
                      </div>
                      {isSubstituted && (
                        <div className="text-amber-300 text-xs mt-1">
                          ↑ replaces {chord.subFor}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Explanation */}
              {!showOriginal && (
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="text-purple-200 text-sm mb-2">
                    <strong className="text-white">How it works:</strong>
                  </div>
                  <div className="text-purple-300 text-xs">
                    {SUBSTITUTION_TYPES.find(t => t.id === currentSubstitution.type)?.explanation}
                  </div>
                </div>
              )}
            </div>

            {/* Guitar Chord Diagrams */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-4">How to Play on Guitar</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {displayedChords.map((chord, index) => {
                  const { note, quality } = getChordFromDegree(chord.degree, chord.quality)
                  const shape = getChordShape(note.split(/[^A-G#b]/)[0], quality)

                  return shape ? (
                    <div key={index} className="flex flex-col items-center bg-white/5 rounded-xl p-4">
                      <ChordDiagram
                        chordName={`${note} ${quality}`}
                        fingers={shape}
                        size="large"
                      />
                      <div className="text-purple-300 text-sm mt-3 font-semibold">{chord.roman}</div>
                    </div>
                  ) : (
                    <div key={index} className="flex flex-col items-center bg-white/5 rounded-xl p-6 text-center">
                      <div className="text-2xl font-bold text-white">{note}</div>
                      <div className="text-purple-300 text-sm">{quality}</div>
                      <div className="text-purple-400 text-sm mt-2">({chord.roman})</div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Common Substitutions Quick Reference */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-4">Quick Reference in {KEYS[selectedKey]}</h3>
              <div className="space-y-2 text-sm">
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="font-semibold text-white mb-1">Relative Minor/Major</div>
                  <div className="text-purple-200 text-xs">
                    {KEYS[selectedKey]} ↔ {KEYS[(selectedKey + 9) % 12]} (vi)
                  </div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="font-semibold text-white mb-1">Diatonic Substitutions</div>
                  <div className="text-purple-200 text-xs space-y-1">
                    <div>I ({KEYS[selectedKey]}) → iii ({KEYS[(selectedKey + 4) % 12]}m) or vi ({KEYS[(selectedKey + 9) % 12]}m)</div>
                    <div>IV ({KEYS[(selectedKey + 5) % 12]}) → ii ({KEYS[(selectedKey + 2) % 12]}m)</div>
                    <div>V ({KEYS[(selectedKey + 7) % 12]}) → vii° ({KEYS[(selectedKey + 11) % 12]}°)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Complete Fretboard View */}
        <div className="mt-8 bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">
            Complete Fretboard View - {showOriginal ? "Original" : "Substituted"}
          </h3>
          <p className="text-purple-200 text-sm mb-6">
            See how each chord in the {showOriginal ? "original" : "substituted"} progression appears across the entire neck.
          </p>
          <div className="space-y-8">
            {displayedChords.map((chord, index) => {
              const { note, quality } = getChordFromDegree(chord.degree, chord.quality)
              const noteIndex = getNoteIndex(note)

              if (noteIndex === -1) return null

              return (
                <div key={index} className="bg-white/5 rounded-xl p-6">
                  <div className="mb-4">
                    <div className="text-purple-300 text-sm mb-1">
                      Chord {index + 1} - {chord.roman}
                      {!showOriginal && chord.subFor && (
                        <span className="text-amber-300"> (replaces {chord.subFor})</span>
                      )}
                    </div>
                  </div>
                  <FullChordFretboard
                    chordName={`${note} ${quality}`}
                    rootNoteIndex={noteIndex}
                    intervals={getChordIntervals(quality)}
                    showNoteNames={true}
                  />
                </div>
              )
            })}
          </div>
        </div>

        {/* Practice Tips */}
        <div className="mt-8 bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
          <h3 className="text-xl font-bold text-white mb-4">Practice Tips</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-purple-200">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="font-semibold text-white mb-2">Start Simple</div>
              <p>Take a song you know and try substituting just one chord. Listen to how it changes the feel.</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="font-semibold text-white mb-2">Use Your Ears</div>
              <p>Not all substitutions work in every context. Trust your ears and the style of music you're playing.</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="font-semibold text-white mb-2">Voice Leading</div>
              <p>Choose substitutions that allow smooth voice leading - minimal finger movement between chords.</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="font-semibold text-white mb-2">Study Jazz Standards</div>
              <p>Jazz music is full of sophisticated substitutions. Analyze classics to see techniques in action.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
