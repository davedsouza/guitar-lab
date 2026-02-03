"use client"

import { useState } from "react"
import Link from "next/link"
import ChordDiagram from "@/components/ChordDiagram"
import FullChordFretboard from "@/components/FullChordFretboard"

const NOTES = ["C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B"]

// CAGED shapes for major chords (finger positions)
const CAGED_SHAPES = {
  C: {
    name: "C Shape",
    openPattern: [-1, 3, 2, 0, 1, 0], // x32010
    description: "The open C chord shape - moved up the neck becomes a barre chord",
    color: "bg-red-600",
    rootStrings: [5, 2], // Root notes on A string (3rd fret) and B string (1st fret)
    barreInfo: "When barred, use your index finger across all strings at the fret position"
  },
  A: {
    name: "A Shape",
    openPattern: [-1, 0, 2, 2, 2, 0], // x02220
    description: "The open A chord shape - one of the easiest to move up the neck",
    color: "bg-blue-600",
    rootStrings: [4], // Root note on D string
    barreInfo: "Barre with index finger, use ring finger to fret the 3 notes together"
  },
  G: {
    name: "G Shape",
    openPattern: [3, 2, 0, 0, 0, 3], // 320003
    description: "The open G chord shape - requires stretching when moved up",
    color: "bg-green-600",
    rootStrings: [5, 0], // Root on low E (3rd fret) and high E (3rd fret)
    barreInfo: "Challenging shape - requires wide finger stretch across 4 frets"
  },
  E: {
    name: "E Shape",
    openPattern: [0, 2, 2, 1, 0, 0], // 022100
    description: "The open E chord shape - classic barre chord foundation",
    color: "bg-purple-600",
    rootStrings: [5, 3], // Root on low E and D string
    barreInfo: "Most common barre chord shape - barre with index, use other fingers for the E shape"
  },
  D: {
    name: "D Shape",
    openPattern: [-1, -1, 0, 2, 3, 2], // xx0232
    description: "The open D chord shape - compact and moveable",
    color: "bg-amber-600",
    rootStrings: [3], // Root on D string (open)
    barreInfo: "Use a partial barre or individual fingers for the top 4 strings"
  }
}

const CAGED_ORDER = ["C", "A", "G", "E", "D"] as const

export default function CAGEDSystem() {
  const [selectedKey, setSelectedKey] = useState(0) // C
  const [selectedShape, setSelectedShape] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"shapes" | "connected">("shapes")
  const [showNoteNames, setShowNoteNames] = useState(true)

  const selectedNote = NOTES[selectedKey]

  // Calculate where each CAGED shape starts for the selected key
  const getShapePosition = (shape: string): number => {
    // For C major (index 0), the positions are:
    // C shape: fret 0, A shape: fret 3, G shape: fret 5, E shape: fret 8, D shape: fret 10
    const basePositions: Record<string, number> = {
      C: 0,
      A: 3,
      G: 5,
      E: 8,
      D: 10
    }

    // Add the key offset
    return (basePositions[shape] + selectedKey) % 12
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-purple-300 hover:text-purple-200 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">CAGED System</h1>
          <p className="text-purple-200">Master the fretboard by connecting 5 chord shapes</p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Theory & Explanation */}
          <div className="space-y-6">
            {/* What is CAGED */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">What is the CAGED System?</h2>
              <div className="space-y-3 text-purple-200 text-sm">
                <p>
                  The CAGED system is a method for understanding the guitar fretboard using five basic
                  open chord shapes: <span className="font-bold text-white">C-A-G-E-D</span>.
                </p>
                <p>
                  These five shapes connect across the entire neck, allowing you to:
                </p>
                <ul className="list-disc list-inside space-y-1 bg-white/10 rounded-lg p-4">
                  <li>Play any chord anywhere on the neck</li>
                  <li>Visualize scale patterns within chord shapes</li>
                  <li>Connect lead and rhythm playing seamlessly</li>
                  <li>Understand the fretboard logically</li>
                  <li>Move between positions smoothly</li>
                </ul>
                <div className="bg-amber-500/20 border border-amber-500/50 rounded-lg p-3 mt-4">
                  <p className="text-amber-200 text-xs">
                    <strong>Key Concept:</strong> Each of the 5 shapes overlaps with the next one.
                    The shapes spell out C-A-G-E-D in order as you move up the neck!
                  </p>
                </div>
              </div>
            </div>

            {/* Key Selector */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">Select Key</h2>
              <div className="grid grid-cols-4 gap-2">
                {NOTES.map((note, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedKey(index)}
                    className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                      selectedKey === index
                        ? "bg-purple-600 text-white scale-105"
                        : "bg-white/20 text-purple-200 hover:bg-white/30"
                    }`}
                  >
                    {note}
                  </button>
                ))}
              </div>
              <p className="text-purple-300 text-sm mt-3">
                Viewing CAGED shapes for {selectedNote} Major
              </p>
            </div>

            {/* How CAGED Works */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">How It Works</h2>
              <div className="space-y-3 text-purple-200 text-sm">
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="font-semibold text-white mb-2">1. Start with Open Chords</div>
                  <p>
                    Learn the 5 basic open chord shapes: C, A, G, E, and D. These are the foundation
                    of the system.
                  </p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="font-semibold text-white mb-2">2. Move Shapes Up the Neck</div>
                  <p>
                    Each open chord shape can be moved up the fretboard (using barre techniques) to
                    create different chords.
                  </p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="font-semibold text-white mb-2">3. Connect the Shapes</div>
                  <p>
                    The shapes overlap and connect in the order C-A-G-E-D. Once you reach the D shape,
                    the pattern repeats with the C shape an octave higher.
                  </p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="font-semibold text-white mb-2">4. Find Any Chord</div>
                  <p>
                    For any chord, you can play it using all 5 shapes at different positions on the neck.
                  </p>
                </div>
              </div>
            </div>

            {/* Practice Tips */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">Practice Tips</h2>
              <div className="space-y-2 text-sm text-purple-200">
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="font-semibold text-white mb-1">Master One Shape at a Time</div>
                  <p>
                    Start with the E and A shapes (easiest to move). Practice finding them in different keys.
                  </p>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="font-semibold text-white mb-1">Learn the Root Notes</div>
                  <p>
                    Know where the root note is in each shape. This helps you find the right position.
                  </p>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="font-semibold text-white mb-1">Connect Adjacent Shapes</div>
                  <p>
                    Practice moving from C to A, A to G, G to E, E to D, and D back to C.
                  </p>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="font-semibold text-white mb-1">Add Scales Later</div>
                  <p>
                    Once comfortable with chord shapes, learn the pentatonic/major scale within each shape.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Visual Shapes */}
          <div className="space-y-6">
            {/* View Mode Toggle */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex flex-col gap-3 mb-4">
                <div className="flex gap-2 bg-white/10 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("shapes")}
                    className={`flex-1 py-2 px-4 rounded-md font-semibold text-sm transition-all ${
                      viewMode === "shapes"
                        ? "bg-purple-600 text-white"
                        : "text-purple-200 hover:text-white"
                    }`}
                  >
                    Individual Shapes
                  </button>
                  <button
                    onClick={() => setViewMode("connected")}
                    className={`flex-1 py-2 px-4 rounded-md font-semibold text-sm transition-all ${
                      viewMode === "connected"
                        ? "bg-purple-600 text-white"
                        : "text-purple-200 hover:text-white"
                    }`}
                  >
                    Connected View
                  </button>
                </div>

                {/* Note Names Toggle */}
                {viewMode === "connected" && (
                  <button
                    onClick={() => setShowNoteNames(!showNoteNames)}
                    className="bg-white/10 hover:bg-white/20 text-purple-200 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                  >
                    {showNoteNames ? "Hide" : "Show"} Note Names
                  </button>
                )}
              </div>

              {viewMode === "shapes" ? (
                <>
                  <h2 className="text-xl font-bold text-white mb-4">
                    The 5 CAGED Shapes in {selectedNote}
                  </h2>
                  <p className="text-purple-200 text-sm mb-4">
                    Click any shape to highlight it. These are the positions where each shape appears for {selectedNote} Major.
                  </p>

                  {/* CAGED Shapes Grid */}
                  <div className="space-y-4">
                    {CAGED_ORDER.map((shapeName) => {
                      const shape = CAGED_SHAPES[shapeName]
                      const position = getShapePosition(shapeName)
                      const isSelected = selectedShape === shapeName

                      return (
                        <button
                          key={shapeName}
                          onClick={() => setSelectedShape(isSelected ? null : shapeName)}
                          className={`w-full text-left bg-white/10 rounded-xl p-4 hover:bg-white/20 transition-all border-2 ${
                            isSelected ? "border-amber-500 bg-white/20" : "border-white/20"
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`${shape.color} text-white w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl flex-shrink-0`}>
                              {shapeName}
                            </div>
                            <div className="flex-1">
                              <div className="font-bold text-white text-lg mb-1">
                                {shape.name}
                              </div>
                              <div className="text-purple-300 text-sm mb-2">
                                Position: Fret {position} {position === 0 ? "(Open Position)" : ""}
                              </div>
                              <div className="text-purple-200 text-xs">
                                {shape.description}
                              </div>
                            </div>
                          </div>

                          {isSelected && (
                            <div className="mt-4 pt-4 border-t border-white/20">
                              <div className="bg-white/10 rounded-lg p-3 mb-3">
                                <div className="text-white font-semibold text-sm mb-2">Barre Technique:</div>
                                <div className="text-purple-200 text-xs">
                                  {shape.barreInfo}
                                </div>
                              </div>
                              <div className="text-purple-300 text-xs">
                                <strong>Root notes:</strong> Located on strings {shape.rootStrings.map(s => {
                                  const stringNames = ["E", "A", "D", "G", "B", "e"]
                                  return stringNames[5 - s]
                                }).join(" and ")}
                              </div>
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-white mb-4">
                    Complete Fretboard View - All {selectedNote} Major Chord Positions
                  </h2>
                  <p className="text-purple-200 text-sm mb-6">
                    View all 5 CAGED shapes across the entire fretboard (frets 0-12). Each colored dot shows where to play {selectedNote} Major.
                  </p>

                  {/* Connected Fretboard View */}
                  <div className="bg-gradient-to-br from-amber-900/20 to-amber-700/10 rounded-xl p-6 border border-amber-600/30">
                    <div className="flex justify-center">
                      <FretboardCAGED selectedKey={selectedKey} selectedNote={selectedNote} showNoteNames={showNoteNames} />
                    </div>
                  </div>

                  <div className="mt-4 bg-white/10 rounded-xl p-4">
                    <h3 className="text-white font-semibold mb-3 text-sm">Reading This Diagram</h3>
                    <div className="space-y-2 text-xs text-purple-200">
                      <p>
                        <strong className="text-white">Colored Dots:</strong> Each dot represents a chord tone you should play.
                        The color shows which CAGED shape it belongs to (C=red, A=blue, G=green, E=purple, D=orange).
                      </p>
                      <p>
                        <strong className="text-white">Root Notes (R):</strong> Larger dots marked with "R" are the root notes
                        ({selectedNote}). These anchor each shape and help you find your position.
                      </p>
                      <p>
                        <strong className="text-white">Shape Labels:</strong> Letters at the top show where each CAGED shape
                        starts. Notice how they overlap and connect!
                      </p>
                      <p>
                        <strong className="text-white">Practice Tip:</strong> Pick one shape, play all its notes together as a chord,
                        then move to the next shape up the neck. This shows how CAGED shapes connect continuously.
                      </p>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="mt-4 bg-white/10 rounded-xl p-4">
                    <h3 className="text-white font-semibold mb-3 text-sm">Shape Colors</h3>
                    <div className="grid grid-cols-5 gap-2 text-xs">
                      {CAGED_ORDER.map((shapeName) => {
                        const shapeColors: Record<string, string> = {
                          C: "bg-red-600",
                          A: "bg-blue-600",
                          G: "bg-green-600",
                          E: "bg-purple-600",
                          D: "bg-amber-600"
                        }
                        return (
                          <div key={shapeName} className="flex items-center gap-2">
                            <div className={`${shapeColors[shapeName]} w-5 h-5 rounded-full border-2 border-white`}></div>
                            <span className="text-purple-200 font-semibold">{shapeName}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Shape Order Reference */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-3">CAGED Order</h3>
              <p className="text-purple-200 text-sm mb-4">
                The shapes always appear in this order as you move up the neck:
              </p>
              <div className="flex items-center justify-between gap-2">
                {CAGED_ORDER.map((shapeName, index) => (
                  <div key={shapeName} className="flex items-center">
                    <div className={`${CAGED_SHAPES[shapeName].color} text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg`}>
                      {shapeName}
                    </div>
                    {index < CAGED_ORDER.length - 1 && (
                      <div className="text-purple-400 mx-1">→</div>
                    )}
                  </div>
                ))}
                <div className="text-purple-400">↻</div>
              </div>
              <p className="text-purple-300 text-xs mt-3 text-center">
                After D comes C again (one octave higher)
              </p>
            </div>

            {/* Next Steps */}
            <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
              <h3 className="text-lg font-bold text-white mb-3">Beyond the Basics</h3>
              <div className="space-y-2 text-sm text-purple-200">
                <div className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <p>
                    <strong className="text-white">Minor Chords:</strong> Each CAGED shape has a minor version -
                    just adjust one note per shape
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <p>
                    <strong className="text-white">Scales:</strong> Major and pentatonic scales fit perfectly
                    within each CAGED shape
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <p>
                    <strong className="text-white">Arpeggios:</strong> Play the chord tones individually to
                    create melodic lines
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <p>
                    <strong className="text-white">7th Chords:</strong> Add one note to each shape to get
                    maj7, dom7, or min7 chords
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Complete Fretboard View */}
        <div className="mt-8 bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">Complete Fretboard View - All Chord Tones</h3>
          <p className="text-purple-200 text-sm mb-6">
            See every occurrence of {selectedNote} Major chord tones across the entire neck. This standard view shows how the chord appears across all 12 frets, complementing the CAGED shapes view above.
          </p>
          <FullChordFretboard
            chordName={`${selectedNote} Major`}
            rootNoteIndex={selectedKey}
            intervals={[0, 4, 7]}
            showNoteNames={true}
          />
        </div>
      </div>
    </div>
  )
}

// Component to show all CAGED shapes connected across the fretboard
function FretboardCAGED({ selectedKey, selectedNote, showNoteNames }: { selectedKey: number; selectedNote: string; showNoteNames: boolean }) {
  const strings = 6
  const numFrets = 12
  const fretWidth = 55 // Reduced from 70 to fit on screen
  const stringGap = 32 // Reduced from 35
  const startX = 70 // Reduced from 80
  const startY = 40 // Reduced from 50
  const width = startX + numFrets * fretWidth + 40
  const height = startY + (strings - 1) * stringGap + 80

  const STRING_TUNING = [4, 9, 2, 7, 11, 4] // E A D G B e in semitones from C
  const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

  // Define CAGED shapes with actual chord tones
  // Format: [string index, fret offset from root position, isRoot]
  // Root positions for each shape in key of C:
  // C shape: root at A string fret 3
  // A shape: root at D string fret 2
  // G shape: root at low E string fret 3
  // E shape: root at low E string fret 8
  // D shape: root at D string fret 10

  const cagedShapeNotes: Record<string, { rootFret: number; rootString: number; notes: [number, number, boolean][], color: string }> = {
    C: {
      rootFret: 3,
      rootString: 4, // A string
      color: "#dc2626",
      notes: [
        // [string, fret offset from root, isRoot]
        [5, -2, true],  // e string, 2 frets below root (root note)
        [4, 0, true],   // B string at root (root note)
        [3, 0, false],  // G string at root (5th)
        [2, 1, false],  // D string, 1 fret above (3rd)
        [1, 0, false],  // A string at root (root)
      ]
    },
    A: {
      rootFret: 5,
      rootString: 3, // D string
      color: "#2563eb",
      notes: [
        [5, 0, true],   // e string at root (root)
        [4, 1, false],  // B string, 1 above (3rd)
        [3, 1, false],  // G string, 1 above (5th)
        [2, 1, false],  // D string, 1 above (root)
        [1, 0, true],   // A string at root (5th)
        [0, 0, false],  // E string at root (root) - often muted
      ]
    },
    G: {
      rootFret: 7,
      rootString: 5, // low E string
      color: "#16a34a",
      notes: [
        [5, 3, true],   // e string, 3 above (root)
        [4, 0, false],  // B string at root (3rd)
        [3, 0, false],  // G string at root (root)
        [2, 0, false],  // D string at root (5th)
        [1, 2, false],  // A string, 2 above (3rd)
        [0, 3, true],   // E string, 3 above (root)
      ]
    },
    E: {
      rootFret: 8,
      rootString: 5, // low E string
      color: "#9333ea",
      notes: [
        [5, 0, true],   // e string at root (root)
        [4, 0, false],  // B string at root (5th)
        [3, 1, false],  // G string, 1 above (root)
        [2, 2, false],  // D string, 2 above (3rd)
        [1, 2, false],  // A string, 2 above (5th)
        [0, 0, true],   // E string at root (root)
      ]
    },
    D: {
      rootFret: 10,
      rootString: 3, // D string
      color: "#d97706",
      notes: [
        [5, 1, false],  // e string, 1 above (3rd)
        [4, 3, false],  // B string, 3 above (5th)
        [3, 2, false],  // G string, 2 above (root)
        [2, 0, true],   // D string at root (root)
        [1, 0, false],  // A string at root (5th) - often muted
      ]
    }
  }

  // Adjust root positions based on selected key
  const adjustedShapes = Object.fromEntries(
    Object.entries(cagedShapeNotes).map(([shapeName, shapeData]) => [
      shapeName,
      {
        ...shapeData,
        rootFret: (shapeData.rootFret + selectedKey) % 12
      }
    ])
  )

  // Collect all chord notes to display
  const chordNotes: { string: number; fret: number; isRoot: boolean; shape: string; color: string }[] = []

  CAGED_ORDER.forEach(shapeName => {
    const shape = adjustedShapes[shapeName]
    shape.notes.forEach(([stringIdx, fretOffset, isRoot]) => {
      const absoluteFret = shape.rootFret + fretOffset
      if (absoluteFret >= 0 && absoluteFret <= 12) {
        chordNotes.push({
          string: stringIdx,
          fret: absoluteFret,
          isRoot,
          shape: shapeName,
          color: shape.color
        })
      }
    })
  })

  return (
    <svg width={width} height={height} className="bg-transparent">
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
      {[3, 5, 7, 9, 12].map(fretNum => {
        const x = startX + (fretNum - 0.5) * fretWidth
        const y = startY + ((strings - 1) * stringGap) / 2

        if (fretNum === 12) {
          return (
            <g key={`marker-${fretNum}`}>
              <circle cx={x} cy={y - stringGap} r="6" fill="white" opacity="0.15" />
              <circle cx={x} cy={y + stringGap} r="6" fill="white" opacity="0.15" />
            </g>
          )
        }

        return <circle key={`marker-${fretNum}`} cx={x} cy={y} r="6" fill="white" opacity="0.15" />
      })}

      {/* Chord notes for all CAGED shapes */}
      {chordNotes.map((note, index) => {
        const x = startX + (note.fret === 0 ? 0 : (note.fret - 0.5) * fretWidth)
        const y = startY + note.string * stringGap

        // Calculate the actual note name at this position
        const openStringNote = STRING_TUNING[note.string]
        const noteIndex = (openStringNote + note.fret) % 12
        const noteName = NOTES[noteIndex]

        return (
          <g key={`note-${index}`}>
            <circle
              cx={x}
              cy={y}
              r={note.isRoot ? 12 : 10}
              fill={note.color}
              stroke="white"
              strokeWidth="2"
              opacity="0.9"
            />
            {showNoteNames ? (
              <text
                x={x}
                y={y + 1}
                fill="white"
                fontSize={note.isRoot ? "9" : "8"}
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {noteName.replace("#", "♯")}
              </text>
            ) : (
              note.isRoot && (
                <text
                  x={x}
                  y={y + 1}
                  fill="white"
                  fontSize="9"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  R
                </text>
              )
            )}
          </g>
        )
      })}

      {/* Shape labels at the top */}
      {CAGED_ORDER.map((shapeName) => {
        const shape = adjustedShapes[shapeName]
        const x = startX + shape.rootFret * fretWidth

        return (
          <text
            key={`label-${shapeName}`}
            x={x}
            y={startY - 12}
            fill={shape.color}
            fontSize="14"
            fontWeight="bold"
            textAnchor="middle"
          >
            {shapeName}
          </text>
        )
      })}

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
        <text x={startX - 20} y={startY + 5} textAnchor="middle">E</text>
        <text x={startX - 20} y={startY + stringGap + 5} textAnchor="middle">A</text>
        <text x={startX - 20} y={startY + stringGap * 2 + 5} textAnchor="middle">D</text>
        <text x={startX - 20} y={startY + stringGap * 3 + 5} textAnchor="middle">G</text>
        <text x={startX - 20} y={startY + stringGap * 4 + 5} textAnchor="middle">B</text>
        <text x={startX - 20} y={startY + stringGap * 5 + 5} textAnchor="middle">e</text>
      </g>
    </svg>
  )
}
