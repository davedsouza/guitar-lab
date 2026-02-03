"use client"

import { useState } from "react"
import Link from "next/link"
import ChordDiagram from "@/components/ChordDiagram"
import FullChordFretboard from "@/components/FullChordFretboard"
import { getChordShape, getChordVoicings } from "@/lib/chordShapes"

const KEYS = ["C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B"]

const PROGRESSIONS = [
  {
    name: "I - V - vi - IV",
    roman: ["I", "V", "vi", "IV"],
    description: "The most popular progression in modern music",
    examples: ["Let It Be - Beatles", "Don't Stop Believin' - Journey", "Someone Like You - Adele"],
    degrees: [0, 7, 9, 5]
  },
  {
    name: "I - IV - V",
    roman: ["I", "IV", "V"],
    description: "Classic rock and blues progression",
    examples: ["Twist and Shout - Beatles", "La Bamba - Ritchie Valens", "Wild Thing - The Troggs"],
    degrees: [0, 5, 7]
  },
  {
    name: "ii - V - I",
    roman: ["ii", "V", "I"],
    description: "Jazz standard progression",
    examples: ["Autumn Leaves", "All The Things You Are", "Satin Doll"],
    degrees: [2, 7, 0]
  },
  {
    name: "I - vi - IV - V",
    roman: ["I", "vi", "IV", "V"],
    description: "50s progression, doo-wop classic",
    examples: ["Stand By Me - Ben E. King", "Every Breath You Take - The Police", "Africa - Toto"],
    degrees: [0, 9, 5, 7]
  },
  {
    name: "vi - IV - I - V",
    roman: ["vi", "IV", "I", "V"],
    description: "Emotional, powerful progression",
    examples: ["Grenade - Bruno Mars", "Poker Face - Lady Gaga"],
    degrees: [9, 5, 0, 7]
  },
  {
    name: "I - V - vi - iii - IV - I - IV - V",
    roman: ["I", "V", "vi", "iii", "IV", "I", "IV", "V"],
    description: "Canon in D progression, very common",
    examples: ["Canon in D - Pachelbel", "Basket Case - Green Day", "Hook - Blues Traveler"],
    degrees: [0, 7, 9, 4, 5, 0, 5, 7]
  },
]

const MAJOR_SCALE = [
  { degree: "I", name: "Tonic", quality: "Major", semitones: 0 },
  { degree: "ii", name: "Supertonic", quality: "Minor", semitones: 2 },
  { degree: "iii", name: "Mediant", quality: "Minor", semitones: 4 },
  { degree: "IV", name: "Subdominant", quality: "Major", semitones: 5 },
  { degree: "V", name: "Dominant", quality: "Major", semitones: 7 },
  { degree: "vi", name: "Submediant", quality: "Minor", semitones: 9 },
  { degree: "vii°", name: "Leading Tone", quality: "Diminished", semitones: 11 },
]

export default function Progressions() {
  const [selectedKey, setSelectedKey] = useState(0) // C Major
  const [selectedProgression, setSelectedProgression] = useState(0)
  const [selectedVoicing, setSelectedVoicing] = useState(0) // Position on neck

  const getChordFromDegree = (semitones: number) => {
    const noteIndex = (selectedKey + semitones) % 12
    return KEYS[noteIndex]
  }

  const getChordQuality = (semitones: number) => {
    const scale = MAJOR_SCALE.find(s => s.semitones === semitones)
    return scale?.quality || ""
  }

  const getChordIntervals = (quality: string): number[] => {
    switch (quality) {
      case "Major":
        return [0, 4, 7]
      case "Minor":
        return [0, 3, 7]
      case "Diminished":
        return [0, 3, 6]
      default:
        return [0, 4, 7]
    }
  }

  const getNoteIndex = (note: string): number => {
    return KEYS.indexOf(note)
  }

  const progression = PROGRESSIONS[selectedProgression]
  const chords = progression.degrees.map((degree, index) => ({
    note: getChordFromDegree(degree),
    quality: getChordQuality(degree),
    roman: progression.roman[index]
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-purple-300 hover:text-purple-200 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Chord Progressions</h1>
          <p className="text-purple-200">Master the progressions used in thousands of songs</p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Controls */}
          <div className="space-y-6">
            {/* Key Selector */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">1. Select Key</h2>
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

            {/* Progression Selector */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">2. Select Progression</h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {PROGRESSIONS.map((prog, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedProgression(index)}
                    className={`w-full text-left py-3 px-4 rounded-lg transition-all ${
                      selectedProgression === index
                        ? "bg-purple-600 text-white"
                        : "bg-white/20 text-purple-200 hover:bg-white/30"
                    }`}
                  >
                    <div className="font-semibold">{prog.name}</div>
                    <div className="text-sm opacity-80">{prog.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Position Selector */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">3. Select Neck Position</h2>
              <p className="text-purple-300 text-sm mb-4">
                Choose where on the guitar neck to play these chords
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedVoicing(0)}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                    selectedVoicing === 0
                      ? "bg-purple-600 text-white scale-105"
                      : "bg-white/20 text-purple-200 hover:bg-white/30"
                  }`}
                >
                  <div className="text-sm">Position 1</div>
                  <div className="text-xs opacity-80">Lower Frets</div>
                </button>
                <button
                  onClick={() => setSelectedVoicing(1)}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                    selectedVoicing === 1
                      ? "bg-purple-600 text-white scale-105"
                      : "bg-white/20 text-purple-200 hover:bg-white/30"
                  }`}
                >
                  <div className="text-sm">Position 2</div>
                  <div className="text-xs opacity-80">Middle Frets</div>
                </button>
                <button
                  onClick={() => setSelectedVoicing(2)}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                    selectedVoicing === 2
                      ? "bg-purple-600 text-white scale-105"
                      : "bg-white/20 text-purple-200 hover:bg-white/30"
                  }`}
                >
                  <div className="text-sm">Position 3</div>
                  <div className="text-xs opacity-80">Higher Frets</div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Progression Display */}
          <div className="space-y-6">
            {/* Chord Display */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-6">Progression in {KEYS[selectedKey]} Major</h2>

              {/* Chord Boxes */}
              <div className="flex flex-wrap gap-4 justify-center mb-8">
                {chords.map((chord, index) => (
                  <div key={index} className="text-center">
                    <div className="bg-purple-600 rounded-xl p-6 min-w-[100px]">
                      <div className="text-3xl font-bold text-white mb-1">
                        {chord.note}
                      </div>
                      <div className="text-purple-200 text-sm">
                        {chord.quality}
                      </div>
                    </div>
                    <div className="text-purple-300 text-sm mt-2 font-semibold">
                      {chord.roman}
                    </div>
                  </div>
                ))}
              </div>

              {/* Progression Description */}
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-purple-200 text-sm mb-2">About this progression:</div>
                <div className="text-white mb-3">{progression.description}</div>
                <div className="text-purple-300 text-sm">
                  <div className="font-semibold mb-1">Famous songs using this:</div>
                  <ul className="list-disc list-inside">
                    {progression.examples.map((example, index) => (
                      <li key={index}>{example}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Guitar Chord Diagrams */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-6">How to Play on Guitar</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {chords.map((chord, index) => {
                  const voicings = getChordVoicings(chord.note, chord.quality)
                  const shape = voicings && selectedVoicing < voicings.length
                    ? voicings[selectedVoicing].fingers
                    : getChordShape(chord.note, chord.quality, 0)

                  const voicingInfo = voicings && selectedVoicing < voicings.length
                    ? voicings[selectedVoicing]
                    : null

                  return shape ? (
                    <div key={index} className="flex flex-col items-center bg-white/5 rounded-xl p-4">
                      <ChordDiagram
                        chordName={`${chord.note} ${chord.quality}`}
                        fingers={shape}
                        size="medium"
                      />
                      {voicingInfo && (
                        <div className="mt-2 text-center">
                          <div className="text-purple-300 text-xs">{voicingInfo.position}</div>
                          <div className="text-purple-400 text-xs opacity-70">
                            {voicingInfo.difficulty}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div key={index} className="text-center text-purple-300 text-sm bg-white/5 rounded-xl p-8">
                      <div className="text-2xl mb-2">{chord.note}</div>
                      <div className="mb-2">{chord.quality}</div>
                      <div className="text-xs opacity-70">Position unavailable</div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Theory Explanation */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-3">Understanding Roman Numerals</h3>
              <div className="space-y-2 text-sm text-purple-200">
                <p>Roman numerals represent scale degrees and chord quality:</p>
                <div className="bg-white/10 rounded-lg p-4 space-y-1">
                  <div>• <span className="font-semibold text-white">I, IV, V</span> = Major chords (uppercase)</div>
                  <div>• <span className="font-semibold text-white">ii, iii, vi</span> = Minor chords (lowercase)</div>
                  <div>• <span className="font-semibold text-white">vii°</span> = Diminished chord</div>
                </div>
              </div>
            </div>

            {/* Scale Reference */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-3">{KEYS[selectedKey]} Major Scale Chords</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {MAJOR_SCALE.map((scale, index) => {
                  const note = getChordFromDegree(scale.semitones)
                  return (
                    <div key={index} className="bg-white/10 rounded p-2">
                      <div className="font-semibold text-white">{scale.degree} - {note} {scale.quality}</div>
                      <div className="text-purple-300 text-xs">{scale.name}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Complete Fretboard View */}
        <div className="mt-8 bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">Complete Fretboard View</h3>
          <p className="text-purple-200 text-sm mb-6">
            See how each chord in the progression appears across the entire neck. This helps you understand how the chords connect and find alternative positions.
          </p>
          <div className="space-y-8">
            {chords.map((chord, index) => (
              <div key={index} className="bg-white/5 rounded-xl p-6">
                <div className="mb-4">
                  <div className="text-purple-300 text-sm mb-1">
                    Chord {index + 1} - {chord.roman}
                  </div>
                </div>
                <FullChordFretboard
                  chordName={`${chord.note} ${chord.quality}`}
                  rootNoteIndex={getNoteIndex(chord.note)}
                  intervals={getChordIntervals(chord.quality)}
                  showNoteNames={true}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
