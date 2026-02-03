"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

// Fingerstyle patterns
// Format: Array of { string: 1-6 (1=high e, 6=low E), finger: "p"|"i"|"m"|"a", duration: beats }
const PATTERNS = [
  {
    name: "Travis Picking (Basic)",
    id: "travis-basic",
    description: "The foundation of fingerstyle - alternating bass with melody",
    difficulty: "Beginner",
    timeSignature: "4/4",
    tempo: 80,
    style: "Country/Folk",
    color: "bg-blue-600",
    pattern: [
      { string: 6, finger: "p", beat: 0 },    // Bass note
      { string: 3, finger: "i", beat: 0.5 },  // Treble
      { string: 4, finger: "p", beat: 1 },    // Alternating bass
      { string: 2, finger: "m", beat: 1.5 },  // Treble
      { string: 6, finger: "p", beat: 2 },    // Bass
      { string: 1, finger: "a", beat: 2.5 },  // Treble
      { string: 4, finger: "p", beat: 3 },    // Alternating bass
      { string: 2, finger: "m", beat: 3.5 },  // Treble
    ],
    songs: ["Dust in the Wind - Kansas", "Landslide - Fleetwood Mac"],
    tips: "Keep your thumb alternating between bass strings (usually 6-4 or 5-4). Let the treble strings ring out."
  },
  {
    name: "Classical Arpeggio (p-i-m-a)",
    id: "classical-pima",
    description: "Classic right-hand arpeggio pattern",
    difficulty: "Beginner",
    timeSignature: "4/4",
    tempo: 60,
    style: "Classical",
    color: "bg-purple-600",
    pattern: [
      { string: 6, finger: "p", beat: 0 },
      { string: 3, finger: "i", beat: 1 },
      { string: 2, finger: "m", beat: 2 },
      { string: 1, finger: "a", beat: 3 },
    ],
    songs: ["Romance Anónimo", "Study in Em - Sor"],
    tips: "Each finger plucks in sequence. Keep your hand stable and relaxed. This builds finger independence."
  },
  {
    name: "Folk Fingerpicking",
    id: "folk-basic",
    description: "Steady alternating pattern common in folk music",
    difficulty: "Beginner",
    timeSignature: "4/4",
    tempo: 90,
    style: "Folk",
    color: "bg-green-600",
    pattern: [
      { string: 5, finger: "p", beat: 0 },
      { string: 3, finger: "i", beat: 0.5 },
      { string: 2, finger: "m", beat: 0.5 },
      { string: 1, finger: "a", beat: 0.5 },
      { string: 4, finger: "p", beat: 1.5 },
      { string: 3, finger: "i", beat: 2 },
      { string: 2, finger: "m", beat: 2 },
      { string: 1, finger: "a", beat: 2 },
      { string: 5, finger: "p", beat: 3 },
      { string: 3, finger: "i", beat: 3.5 },
      { string: 2, finger: "m", beat: 3.5 },
      { string: 1, finger: "a", beat: 3.5 },
    ],
    songs: ["Blackbird - Beatles", "Tears in Heaven - Clapton"],
    tips: "Pinch the bass and treble strings together where beats align. This creates a fuller sound."
  },
  {
    name: "Rolling Pattern",
    id: "rolling",
    description: "Flowing pattern that 'rolls' through the strings",
    difficulty: "Intermediate",
    timeSignature: "4/4",
    tempo: 70,
    style: "Folk/Classical",
    color: "bg-amber-600",
    pattern: [
      { string: 6, finger: "p", beat: 0 },
      { string: 3, finger: "i", beat: 0.33 },
      { string: 2, finger: "m", beat: 0.66 },
      { string: 1, finger: "a", beat: 1 },
      { string: 2, finger: "m", beat: 1.33 },
      { string: 3, finger: "i", beat: 1.66 },
      { string: 5, finger: "p", beat: 2 },
      { string: 3, finger: "i", beat: 2.33 },
      { string: 2, finger: "m", beat: 2.66 },
      { string: 1, finger: "a", beat: 3 },
      { string: 2, finger: "m", beat: 3.33 },
      { string: 3, finger: "i", beat: 3.66 },
    ],
    songs: ["Stairway to Heaven - Led Zeppelin", "Nothing Else Matters - Metallica"],
    tips: "Practice the 'roll' motion slowly. The pattern should sound like a gentle wave."
  },
  {
    name: "Banjo Roll",
    id: "banjo-roll",
    description: "Fast, continuous picking pattern borrowed from banjo",
    difficulty: "Advanced",
    timeSignature: "4/4",
    tempo: 100,
    style: "Bluegrass",
    color: "bg-red-600",
    pattern: [
      { string: 3, finger: "i", beat: 0 },
      { string: 2, finger: "m", beat: 0.25 },
      { string: 5, finger: "p", beat: 0.5 },
      { string: 1, finger: "i", beat: 0.75 },
      { string: 2, finger: "m", beat: 1 },
      { string: 5, finger: "p", beat: 1.25 },
      { string: 1, finger: "i", beat: 1.5 },
      { string: 2, finger: "m", beat: 1.75 },
      { string: 5, finger: "p", beat: 2 },
      { string: 1, finger: "i", beat: 2.25 },
      { string: 2, finger: "m", beat: 2.5 },
      { string: 5, finger: "p", beat: 2.75 },
      { string: 1, finger: "i", beat: 3 },
      { string: 2, finger: "m", beat: 3.25 },
      { string: 5, finger: "p", beat: 3.5 },
      { string: 3, finger: "i", beat: 3.75 },
    ],
    songs: ["Dueling Banjos", "Cripple Creek"],
    tips: "Start very slowly. The pattern repeats continuously. Focus on evenness before speed."
  },
  {
    name: "Bossa Nova",
    id: "bossa-nova",
    description: "Syncopated Brazilian rhythm pattern",
    difficulty: "Intermediate",
    timeSignature: "4/4",
    tempo: 110,
    style: "Latin/Jazz",
    color: "bg-pink-600",
    pattern: [
      { string: 6, finger: "p", beat: 0 },
      { string: 3, finger: "i", beat: 0 },
      { string: 2, finger: "m", beat: 0 },
      { string: 4, finger: "p", beat: 0.75 },
      { string: 6, finger: "p", beat: 1.5 },
      { string: 3, finger: "i", beat: 1.5 },
      { string: 2, finger: "m", beat: 1.5 },
      { string: 4, finger: "p", beat: 2.25 },
      { string: 6, finger: "p", beat: 3 },
      { string: 3, finger: "i", beat: 3 },
      { string: 2, finger: "m", beat: 3 },
    ],
    songs: ["Girl from Ipanema", "Desafinado"],
    tips: "The syncopation is key. Count carefully and emphasize the off-beats with your thumb."
  }
]

export default function FingerstylePatterns() {
  const [selectedPattern, setSelectedPattern] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0)
  const [tempo, setTempo] = useState(60) // Start slower - 60 BPM
  const [volume, setVolume] = useState(0.5)

  const pattern = PATTERNS[selectedPattern]

  // Audio context for playing notes
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Create audio context on user interaction
    const createAudioContext = () => {
      if (!(window as any).audioContext) {
        (window as any).audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      }
    }

    document.addEventListener('click', createAudioContext, { once: true })
    return () => document.removeEventListener('click', createAudioContext)
  }, [])

  // Play a note sound
  const playNote = (stringNum: number) => {
    if (typeof window === 'undefined' || volume === 0) return

    const audioContext = (window as any).audioContext
    if (!audioContext) return

    // Map string numbers to frequencies (approximate guitar tuning)
    const frequencies: Record<number, number> = {
      1: 329.63, // E4 (high e)
      2: 246.94, // B3
      3: 196.00, // G3
      4: 146.83, // D3
      5: 110.00, // A2
      6: 82.41,  // E2 (low E)
    }

    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = frequencies[stringNum]
    oscillator.type = 'triangle' // Softer sound than sine

    // Envelope: quick attack, longer decay
    gainNode.gain.setValueAtTime(0, audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(volume * 0.3, audioContext.currentTime + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.6)
  }

  // Animation loop - step through notes one by one
  useEffect(() => {
    if (!isPlaying) {
      setCurrentNoteIndex(0)
      return
    }

    const beatsPerSecond = tempo / 60
    const sortedPattern = [...pattern.pattern].sort((a, b) => a.beat - b.beat)

    if (sortedPattern.length === 0) return

    // Calculate time between notes
    let currentBeat = sortedPattern[currentNoteIndex]?.beat || 0
    let nextBeat = sortedPattern[(currentNoteIndex + 1) % sortedPattern.length]?.beat || 4

    // Handle wrap-around
    if (nextBeat <= currentBeat) {
      nextBeat += 4
    }

    const beatDifference = nextBeat - currentBeat
    const msUntilNext = (beatDifference / beatsPerSecond) * 1000

    // Play the current note
    playNote(sortedPattern[currentNoteIndex].string)

    const timeout = setTimeout(() => {
      setCurrentNoteIndex(prev => (prev + 1) % sortedPattern.length)
    }, msUntilNext)

    return () => clearTimeout(timeout)
  }, [isPlaying, currentNoteIndex, tempo, pattern, volume])

  // Check if a note should be highlighted
  const isNoteActive = (noteIndex: number) => {
    const sortedPattern = [...pattern.pattern].sort((a, b) => a.beat - b.beat)
    return sortedPattern[currentNoteIndex] === pattern.pattern[noteIndex]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-purple-300 hover:text-purple-200 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Fingerstyle Patterns</h1>
          <p className="text-purple-200">Master the art of fingerpicking with classic patterns and techniques</p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Theory & Pattern Selection */}
          <div className="space-y-6">
            {/* What is Fingerstyle */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">What is Fingerstyle Guitar?</h2>
              <div className="space-y-3 text-purple-200 text-sm">
                <p>
                  Fingerstyle (or fingerpicking) is a technique where you pluck the strings directly with your fingertips,
                  fingernails, or picks attached to fingers, rather than using a single plectrum (pick).
                </p>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="font-semibold text-white mb-2">Why Learn Fingerstyle?</div>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Play bass, harmony, and melody simultaneously</li>
                    <li>Create fuller, more complex arrangements</li>
                    <li>Develop finger independence and dexterity</li>
                    <li>Access classical, folk, and jazz repertoire</li>
                    <li>Sound like multiple guitars at once</li>
                  </ul>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="font-semibold text-white mb-2">Finger Notation</div>
                  <div className="space-y-1 text-xs">
                    <div><strong className="text-purple-300">p</strong> = Thumb (pulgar)</div>
                    <div><strong className="text-purple-300">i</strong> = Index finger (índice)</div>
                    <div><strong className="text-purple-300">m</strong> = Middle finger (medio)</div>
                    <div><strong className="text-purple-300">a</strong> = Ring finger (anular)</div>
                    <div className="text-purple-400 mt-2">* Spanish names from classical tradition</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pattern Selection */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">Select Pattern</h2>
              <div className="space-y-2">
                {PATTERNS.map((p, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedPattern(index)
                      setTempo(60) // Always start at slow tempo for learning
                      setIsPlaying(false)
                      setCurrentNoteIndex(0)
                    }}
                    className={`w-full text-left py-3 px-4 rounded-lg transition-all ${
                      selectedPattern === index
                        ? "bg-purple-600 text-white"
                        : "bg-white/20 text-purple-200 hover:bg-white/30"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-semibold">{p.name}</div>
                      <div className={`${p.color} text-white px-2 py-1 rounded text-xs`}>
                        {p.difficulty}
                      </div>
                    </div>
                    <div className="text-xs opacity-80">{p.style} • {p.timeSignature}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Pattern Info */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-3">{pattern.name}</h3>
              <div className="space-y-3 text-sm">
                <div className="text-purple-200">{pattern.description}</div>

                <div className="bg-white/10 rounded-lg p-3">
                  <div className="font-semibold text-white mb-2">Details</div>
                  <div className="space-y-1 text-xs text-purple-200">
                    <div>Style: <span className="text-white">{pattern.style}</span></div>
                    <div>Time: <span className="text-white">{pattern.timeSignature}</span></div>
                    <div>Suggested Tempo: <span className="text-white">{pattern.tempo} BPM</span></div>
                    <div>Difficulty: <span className="text-white">{pattern.difficulty}</span></div>
                  </div>
                </div>

                <div className="bg-white/10 rounded-lg p-3">
                  <div className="font-semibold text-white mb-2">Practice Tips</div>
                  <div className="text-xs text-purple-200">{pattern.tips}</div>
                </div>

                <div className="bg-white/10 rounded-lg p-3">
                  <div className="font-semibold text-white mb-2">Famous Songs</div>
                  <ul className="text-xs text-purple-200 space-y-1">
                    {pattern.songs.map((song, i) => (
                      <li key={i}>• {song}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Pattern Visualizer */}
          <div className="space-y-6">
            {/* Playback Controls */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">Pattern Visualizer</h2>

              {/* Play/Pause Button */}
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                    isPlaying
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  {isPlaying ? "⏸ Pause" : "▶ Play Pattern"}
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
                  <label className="text-purple-200 text-sm font-semibold">Speed: {tempo} BPM</label>
                  <button
                    onClick={() => setTempo(60)}
                    className="text-xs text-purple-300 hover:text-purple-200"
                  >
                    Reset to 60
                  </button>
                </div>
                <input
                  type="range"
                  min="30"
                  max="120"
                  value={tempo}
                  onChange={(e) => setTempo(Number(e.target.value))}
                  className="w-full accent-purple-600"
                />
                <div className="flex justify-between text-xs text-purple-400 mt-1">
                  <span>Very Slow (30)</span>
                  <span>Medium (75)</span>
                  <span>Fast (120)</span>
                </div>
              </div>

              {/* Volume Control */}
              <div className="mb-6">
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
                <div className="flex justify-between text-xs text-purple-400 mt-1">
                  <span>Silent</span>
                  <span>Loud</span>
                </div>
              </div>

              <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-3 mb-6">
                <p className="text-blue-200 text-xs">
                  💡 <strong>Tip:</strong> Start at 30-40 BPM to learn the pattern slowly. Increase speed as you get comfortable.
                </p>
              </div>

              {/* String Visualizer */}
              <div className="bg-gradient-to-br from-amber-900/20 to-amber-700/10 rounded-xl p-6 border border-amber-600/30">
                <div className="mb-4 text-center">
                  <div className="text-purple-200 text-sm mb-2">Guitar Strings (View from player's perspective)</div>
                </div>

                <div className="space-y-5">
                  {[1, 2, 3, 4, 5, 6].map(stringNum => {
                    const stringNames = ["e", "B", "G", "D", "A", "E"]
                    const sortedPattern = [...pattern.pattern].sort((a, b) => a.beat - b.beat)
                    const currentNote = sortedPattern[currentNoteIndex]
                    const isActive = isPlaying && currentNote?.string === stringNum

                    return (
                      <div key={stringNum} className="flex items-center gap-3">
                        {/* String Label */}
                        <div className="w-16 text-right">
                          <div className={`font-bold text-lg transition-all ${
                            isActive ? "text-amber-400 scale-110" : "text-white"
                          }`}>
                            {stringNames[stringNum - 1]}
                          </div>
                          <div className="text-purple-400 text-xs">String {stringNum}</div>
                        </div>

                        {/* String Line */}
                        <div className="flex-1 relative h-8 flex items-center">
                          <div
                            className={`w-full rounded transition-all duration-200 ${
                              isActive ? "bg-amber-400 shadow-lg shadow-amber-400/50 scale-y-150" : "bg-white/30"
                            }`}
                            style={{
                              height: stringNum === 1 ? "2px" : stringNum === 6 ? "4px" : "3px"
                            }}
                          />

                          {/* Show finger notation when active */}
                          {isActive && (
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-10">
                              <div className="bg-amber-500 text-white px-4 py-2 rounded-full text-lg font-bold animate-bounce shadow-lg">
                                {currentNote.finger.toUpperCase()}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Legend */}
                <div className="mt-6 pt-4 border-t border-white/20">
                  <div className="text-purple-200 text-sm font-semibold mb-3">
                    {isPlaying ? "▶ Now Playing:" : "Ready to Play"}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {isPlaying && (() => {
                      const sortedPattern = [...pattern.pattern].sort((a, b) => a.beat - b.beat)
                      const currentNote = sortedPattern[currentNoteIndex]
                      return (
                        <div className="bg-gradient-to-r from-amber-600 to-amber-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg">
                          String {currentNote?.string} - {currentNote?.finger.toUpperCase()} finger
                        </div>
                      )
                    })()}
                    {!isPlaying && (
                      <div className="text-purple-400 text-sm">
                        Click <span className="text-green-400 font-semibold">▶ Play Pattern</span> to start
                      </div>
                    )}
                  </div>
                  <div className="mt-3 text-xs text-purple-300">
                    Note {currentNoteIndex + 1} of {pattern.pattern.length}
                  </div>
                </div>
              </div>

              {/* Beat Counter */}
              <div className="mt-4 bg-white/10 rounded-lg p-4">
                <div className="text-center">
                  <div className="text-purple-300 text-sm mb-3">Current Beat Position</div>
                  <div className="flex justify-center gap-2">
                    {[0, 1, 2, 3].map(beat => {
                      const sortedPattern = [...pattern.pattern].sort((a, b) => a.beat - b.beat)
                      const currentNote = sortedPattern[currentNoteIndex]
                      const currentNoteBeat = currentNote ? Math.floor(currentNote.beat) : -1

                      return (
                        <div
                          key={beat}
                          className={`w-14 h-14 rounded-lg flex items-center justify-center font-bold transition-all ${
                            currentNoteBeat === beat && isPlaying
                              ? "bg-purple-600 text-white scale-110 shadow-lg shadow-purple-600/50"
                              : "bg-white/20 text-purple-400"
                          }`}
                        >
                          {beat + 1}
                        </div>
                      )
                    })}
                  </div>
                  <div className="mt-3 text-xs text-purple-400">
                    Pattern loops every 4 beats
                  </div>
                </div>
              </div>
            </div>

            {/* Pattern Breakdown */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-4">Pattern Breakdown</h3>
              <p className="text-purple-300 text-xs mb-4">
                {pattern.pattern.length} notes total • Follow the highlighted note
              </p>
              <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                {(() => {
                  const sortedPattern = [...pattern.pattern].sort((a, b) => a.beat - b.beat)
                  return sortedPattern.map((note, index) => {
                    const isActive = isPlaying && currentNoteIndex === index

                    return (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                          isActive
                            ? "bg-gradient-to-r from-amber-600 to-amber-500 text-white scale-105 shadow-lg"
                            : "bg-white/10 text-purple-200 hover:bg-white/15"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`text-3xl font-bold ${isActive ? "animate-pulse" : ""}`}>
                            {note.finger.toUpperCase()}
                          </div>
                          <div className="text-sm">
                            <div className="font-semibold text-base">String {note.string}</div>
                            <div className="text-xs opacity-80">Beat {(note.beat + 1).toFixed(2)}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-xs font-mono opacity-70">
                            #{index + 1}
                          </div>
                          <div className={`w-4 h-4 rounded-full transition-all ${
                            isActive ? "bg-white animate-ping" : "bg-purple-500"
                          }`} />
                        </div>
                      </div>
                    )
                  })
                })()}
              </div>
            </div>
          </div>
        </div>

        {/* Practice Guide */}
        <div className="mt-8 bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
          <h3 className="text-xl font-bold text-white mb-4">Practice Guide</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-purple-200">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="font-semibold text-white mb-2">1. Start Slow</div>
              <p>Begin at 40-50 BPM, even if it feels too slow. Speed comes with accuracy.</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="font-semibold text-white mb-2">2. Right Hand Position</div>
              <p>Rest your pinky on the guitar body for stability. Keep your wrist relaxed and slightly arched.</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="font-semibold text-white mb-2">3. Left Hand Simple</div>
              <p>Start with one simple chord (like C or Am) and focus entirely on the picking pattern.</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="font-semibold text-white mb-2">4. Isolate Difficult Parts</div>
              <p>If a specific transition is hard, loop just those 2-3 notes until smooth.</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="font-semibold text-white mb-2">5. Metronome Practice</div>
              <p>Use the tempo slider. Increase by 5 BPM only when you can play 5 perfect repetitions.</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="font-semibold text-white mb-2">6. Mix Patterns</div>
              <p>Once comfortable, try different patterns over the same chord progression for variety.</p>
            </div>
          </div>
        </div>

        {/* Hand Position Guide */}
        <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">Right Hand Technique</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3 text-sm text-purple-200">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="font-semibold text-white mb-2">Thumb (p)</div>
                <ul className="space-y-1 text-xs">
                  <li>• Plays bass strings (usually strings 4, 5, 6)</li>
                  <li>• Moves from the knuckle, not just the tip</li>
                  <li>• Should alternate between bass strings smoothly</li>
                  <li>• Provides the rhythmic foundation</li>
                </ul>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="font-semibold text-white mb-2">Index (i)</div>
                <ul className="space-y-1 text-xs">
                  <li>• Usually plays string 3 (G string)</li>
                  <li>• Can also play strings 2 and 1</li>
                  <li>• Pluck with the tip of the finger/nail</li>
                  <li>• Quick, precise movements</li>
                </ul>
              </div>
            </div>
            <div className="space-y-3 text-sm text-purple-200">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="font-semibold text-white mb-2">Middle (m)</div>
                <ul className="space-y-1 text-xs">
                  <li>• Usually plays string 2 (B string)</li>
                  <li>• Works in tandem with index finger</li>
                  <li>• Should be independent from other fingers</li>
                  <li>• Same plucking motion as index</li>
                </ul>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="font-semibold text-white mb-2">Ring (a)</div>
                <ul className="space-y-1 text-xs">
                  <li>• Usually plays string 1 (high e string)</li>
                  <li>• Often the weakest finger - needs practice</li>
                  <li>• Keep it from pulling other fingers</li>
                  <li>• Build independence through exercises</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
