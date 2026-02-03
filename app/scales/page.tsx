"use client"

import { useState } from "react"
import Link from "next/link"
import ScaleDiagram from "@/components/ScaleDiagram"
import FullFretboardDiagram from "@/components/FullFretboardDiagram"
import { SCALE_TYPES, NOTES, getScaleNotes } from "@/lib/scalePatterns"

export default function Scales() {
  const [selectedRoot, setSelectedRoot] = useState(0) // C
  const [selectedScale, setSelectedScale] = useState("Pentatonic Minor") // Most popular for beginners
  const [selectedPosition, setSelectedPosition] = useState(0)
  const [viewMode, setViewMode] = useState<"position" | "full">("position") // Toggle between views
  const [showNoteNames, setShowNoteNames] = useState(true) // Toggle for note names

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
          <h1 className="text-4xl font-bold text-white mb-2">Guitar Scales</h1>
          <p className="text-purple-200">Master scales across the entire fretboard</p>
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
                        setSelectedPosition(0) // Reset position when changing scale
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
              <p className="text-purple-200 text-center mb-6">
                See how all positions connect across the entire neck
              </p>

              <div className="flex justify-center mb-6">
                <FullFretboardDiagram
                  scaleName={`${rootNote} ${selectedScale} - All Positions`}
                  rootNoteIndex={selectedRoot}
                  scaleType={selectedScale}
                  showNoteNames={showNoteNames}
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
