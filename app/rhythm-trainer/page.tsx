"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"

// Strumming patterns
// Format: Array of { stroke: "down"|"up"|"mute"|"rest", beat: position in measure, accent: boolean }
const RHYTHM_PATTERNS = [
  {
    name: "Basic Down Strums",
    id: "basic-down",
    description: "Quarter notes - one strum per beat",
    difficulty: "Beginner",
    timeSignature: "4/4",
    beatsPerMeasure: 4,
    tempo: 80,
    style: "Fundamental",
    color: "bg-blue-600",
    pattern: [
      { stroke: "down", beat: 0, accent: true },
      { stroke: "down", beat: 1, accent: false },
      { stroke: "down", beat: 2, accent: false },
      { stroke: "down", beat: 3, accent: false },
    ],
    notation: "D - D - D - D",
    songs: ["Perfect for learning - any simple song"],
    tips: "Keep your wrist loose. Strum from the elbow, not just the wrist. Count out loud: 1-2-3-4."
  },
  {
    name: "Down-Up (8th Notes)",
    id: "down-up-eighth",
    description: "Classic 8th note strumming",
    difficulty: "Beginner",
    timeSignature: "4/4",
    beatsPerMeasure: 4,
    tempo: 90,
    style: "Rock/Pop",
    color: "bg-green-600",
    pattern: [
      { stroke: "down", beat: 0, accent: true },
      { stroke: "up", beat: 0.5, accent: false },
      { stroke: "down", beat: 1, accent: false },
      { stroke: "up", beat: 1.5, accent: false },
      { stroke: "down", beat: 2, accent: false },
      { stroke: "up", beat: 2.5, accent: false },
      { stroke: "down", beat: 3, accent: false },
      { stroke: "up", beat: 3.5, accent: false },
    ],
    notation: "D U D U D U D U",
    songs: ["Stand By Me", "Wonderwall - Oasis", "Let It Be - Beatles"],
    tips: "Count: 1 & 2 & 3 & 4 &. Down strums on numbers, up strums on '&'. Keep your arm moving constantly."
  },
  {
    name: "Folk Strum",
    id: "folk-strum",
    description: "Classic folk/country pattern with bass emphasis",
    difficulty: "Beginner",
    timeSignature: "4/4",
    beatsPerMeasure: 4,
    tempo: 100,
    style: "Folk/Country",
    color: "bg-amber-600",
    pattern: [
      { stroke: "down", beat: 0, accent: true },
      { stroke: "down", beat: 1, accent: false },
      { stroke: "up", beat: 1.5, accent: false },
      { stroke: "down", beat: 2, accent: false },
      { stroke: "up", beat: 2.5, accent: false },
      { stroke: "down", beat: 3, accent: false },
      { stroke: "up", beat: 3.5, accent: false },
    ],
    notation: "D - D U - D U D U",
    songs: ["Take Me Home Country Roads", "Sweet Caroline"],
    tips: "Emphasize beat 1 (the bass notes). Rest on beat 2. This creates the characteristic boom-chick-a sound."
  },
  {
    name: "Reggae Offbeat",
    id: "reggae",
    description: "Upstrokes on the offbeats",
    difficulty: "Intermediate",
    timeSignature: "4/4",
    beatsPerMeasure: 4,
    tempo: 85,
    style: "Reggae/Ska",
    color: "bg-red-600",
    pattern: [
      { stroke: "rest", beat: 0, accent: false },
      { stroke: "up", beat: 0.5, accent: true },
      { stroke: "rest", beat: 1, accent: false },
      { stroke: "up", beat: 1.5, accent: true },
      { stroke: "rest", beat: 2, accent: false },
      { stroke: "up", beat: 2.5, accent: true },
      { stroke: "rest", beat: 3, accent: false },
      { stroke: "up", beat: 3.5, accent: true },
    ],
    notation: "- U - U - U - U",
    songs: ["Three Little Birds - Bob Marley", "No Woman No Cry"],
    tips: "Only strum on the '&' counts. Mute the strings slightly for a choppy sound. Very important to feel the groove."
  },
  {
    name: "Shuffle/Swing",
    id: "shuffle",
    description: "Triplet feel - swing rhythm",
    difficulty: "Intermediate",
    timeSignature: "4/4",
    beatsPerMeasure: 4,
    tempo: 100,
    style: "Blues/Jazz",
    color: "bg-purple-600",
    pattern: [
      { stroke: "down", beat: 0, accent: true },
      { stroke: "up", beat: 0.66, accent: false },
      { stroke: "down", beat: 1, accent: false },
      { stroke: "up", beat: 1.66, accent: false },
      { stroke: "down", beat: 2, accent: false },
      { stroke: "up", beat: 2.66, accent: false },
      { stroke: "down", beat: 3, accent: false },
      { stroke: "up", beat: 3.66, accent: false },
    ],
    notation: "D - U D - U D - U D - U (swing)",
    songs: ["Pride and Joy - SRV", "Sweet Home Chicago"],
    tips: "Think 'long-short, long-short'. Not even 8ths. The up-strum comes later. Swing feel!"
  },
  {
    name: "16th Note Rock",
    id: "sixteenth-rock",
    description: "Fast 16th note driving rhythm",
    difficulty: "Advanced",
    timeSignature: "4/4",
    beatsPerMeasure: 4,
    tempo: 120,
    style: "Rock/Punk",
    color: "bg-pink-600",
    pattern: [
      { stroke: "down", beat: 0, accent: true },
      { stroke: "up", beat: 0.25, accent: false },
      { stroke: "down", beat: 0.5, accent: false },
      { stroke: "up", beat: 0.75, accent: false },
      { stroke: "down", beat: 1, accent: false },
      { stroke: "up", beat: 1.25, accent: false },
      { stroke: "down", beat: 1.5, accent: false },
      { stroke: "up", beat: 1.75, accent: false },
      { stroke: "down", beat: 2, accent: false },
      { stroke: "up", beat: 2.25, accent: false },
      { stroke: "down", beat: 2.5, accent: false },
      { stroke: "up", beat: 2.75, accent: false },
      { stroke: "down", beat: 3, accent: false },
      { stroke: "up", beat: 3.25, accent: false },
      { stroke: "down", beat: 3.5, accent: false },
      { stroke: "up", beat: 3.75, accent: false },
    ],
    notation: "D U D U D U D U D U D U D U D U",
    songs: ["Basket Case - Green Day", "All The Small Things - Blink 182"],
    tips: "Very fast! Keep the motion constant. Down strums on beats/&s, up strums on e/a. Count: 1 e & a 2 e & a..."
  },
  {
    name: "Waltz (3/4)",
    id: "waltz",
    description: "Three beats per measure - classic waltz time",
    difficulty: "Beginner",
    timeSignature: "3/4",
    beatsPerMeasure: 3,
    tempo: 100,
    style: "Waltz/Folk",
    color: "bg-indigo-600",
    pattern: [
      { stroke: "down", beat: 0, accent: true },
      { stroke: "down", beat: 1, accent: false },
      { stroke: "down", beat: 2, accent: false },
    ],
    notation: "D - D - D (1-2-3)",
    songs: ["The Times They Are A-Changin' - Dylan", "Norwegian Wood - Beatles"],
    tips: "Emphasize beat 1. Feel the 1-2-3, 1-2-3 pattern. Often beat 1 is bass notes only."
  },
];

export default function RhythmTrainer() {
  const [selectedPattern, setSelectedPattern] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentBeat, setCurrentBeat] = useState(0)
  const [tempo, setTempo] = useState(80)
  const [volume, setVolume] = useState(0.5)
  const audioContextRef = useRef<AudioContext | null>(null)

  const pattern = RHYTHM_PATTERNS[selectedPattern]

  // Initialize audio context
  useEffect(() => {
    if (typeof window === 'undefined') return

    const createAudioContext = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }
    }

    document.addEventListener('click', createAudioContext, { once: true })
    return () => {
      document.removeEventListener('click', createAudioContext)
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  // Play click sound
  const playClick = (isAccent: boolean) => {
    if (!audioContextRef.current || volume === 0) return

    const audioContext = audioContextRef.current
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    // Accent beats are lower and louder, offbeats are higher and quieter
    oscillator.frequency.value = isAccent ? 1000 : 800
    oscillator.type = 'sine'

    const now = audioContext.currentTime
    const clickVolume = isAccent ? volume * 0.8 : volume * 0.4

    gainNode.gain.setValueAtTime(clickVolume, now)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05)

    oscillator.start(now)
    oscillator.stop(now + 0.05)
  }

  // Animation loop
  useEffect(() => {
    if (!isPlaying) {
      setCurrentBeat(0)
      return
    }

    const beatsPerSecond = tempo / 60
    const msPerBeat = 1000 / beatsPerSecond
    const increment = 0.25 // Quarter beat resolution

    const interval = setInterval(() => {
      setCurrentBeat(prev => {
        const next = prev + increment
        const newBeat = next >= pattern.beatsPerMeasure ? 0 : next

        // Play click on whole beats
        if (Number.isInteger(newBeat)) {
          playClick(newBeat === 0)
        }

        return newBeat
      })
    }, msPerBeat * increment)

    return () => clearInterval(interval)
  }, [isPlaying, tempo, pattern.beatsPerMeasure, volume])

  // Check if a stroke is active
  const isStrokeActive = (beat: number) => {
    const tolerance = 0.15
    return Math.abs(currentBeat - beat) < tolerance
  }

  // Get current active strokes
  const activeStrokes = pattern.pattern.filter(s => isStrokeActive(s.beat))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-purple-300 hover:text-purple-200 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Rhythm Trainer</h1>
          <p className="text-purple-200">Master strumming patterns and timing with visual and audio guides</p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Theory & Pattern Selection */}
          <div className="space-y-6">
            {/* What is Rhythm */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">Understanding Rhythm</h2>
              <div className="space-y-3 text-purple-200 text-sm">
                <p>
                  Rhythm is the pattern of sounds and silences in music. For guitar, it's about when and how you strum the strings.
                </p>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="font-semibold text-white mb-2">Key Concepts</div>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li><strong>Down Stroke (D):</strong> Strum from top to bottom</li>
                    <li><strong>Up Stroke (U):</strong> Strum from bottom to top</li>
                    <li><strong>Rest (-):</strong> Don't strum, let strings ring</li>
                    <li><strong>Accent:</strong> Strum louder/harder</li>
                    <li><strong>Time Signature:</strong> Beats per measure (4/4, 3/4, etc.)</li>
                  </ul>
                </div>
                <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-3">
                  <p className="text-blue-200 text-xs">
                    💡 <strong>Tip:</strong> Start slow! Speed comes with accuracy. Use a metronome to build timing.
                  </p>
                </div>
              </div>
            </div>

            {/* Pattern Selection */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">Select Pattern</h2>
              <div className="space-y-2">
                {RHYTHM_PATTERNS.map((p, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedPattern(index)
                      setTempo(p.tempo)
                      setIsPlaying(false)
                      setCurrentBeat(0)
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
                    <div>Tempo: <span className="text-white">{pattern.tempo} BPM</span></div>
                    <div>Difficulty: <span className="text-white">{pattern.difficulty}</span></div>
                  </div>
                </div>

                <div className="bg-white/10 rounded-lg p-3">
                  <div className="font-semibold text-white mb-2">Notation</div>
                  <div className="text-white font-mono text-lg text-center py-2">
                    {pattern.notation}
                  </div>
                </div>

                {/* Visual Pattern Preview */}
                <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-lg p-4 border border-blue-500/30">
                  <div className="font-semibold text-white mb-3 text-center">Pattern Preview</div>

                  {/* Timeline view of the pattern */}
                  <div className="relative">
                    {/* Beat markers */}
                    <div className="flex justify-between mb-2 px-1">
                      {Array.from({ length: pattern.beatsPerMeasure }).map((_, beat) => (
                        <div key={beat} className="text-xs text-purple-300 font-bold">
                          {beat + 1}
                        </div>
                      ))}
                    </div>

                    {/* Beat lines */}
                    <div className="relative h-24 bg-white/5 rounded-lg mb-2">
                      {/* Vertical beat lines */}
                      {Array.from({ length: pattern.beatsPerMeasure + 1 }).map((_, i) => (
                        <div
                          key={i}
                          className="absolute top-0 bottom-0 border-l border-white/20"
                          style={{ left: `${(i / pattern.beatsPerMeasure) * 100}%` }}
                        />
                      ))}

                      {/* Strokes positioned on timeline */}
                      {pattern.pattern.map((stroke, index) => {
                        const position = (stroke.beat / pattern.beatsPerMeasure) * 100

                        return (
                          <div
                            key={index}
                            className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2"
                            style={{ left: `${position}%` }}
                          >
                            <div className={`flex flex-col items-center ${
                              stroke.accent ? 'scale-125' : ''
                            }`}>
                              <div className={`text-3xl ${
                                stroke.stroke === 'down' ? 'text-blue-400' :
                                stroke.stroke === 'up' ? 'text-green-400' :
                                'text-gray-500'
                              }`}>
                                {stroke.stroke === 'down' ? '⬇' :
                                 stroke.stroke === 'up' ? '⬆' : '—'}
                              </div>
                              {stroke.accent && (
                                <div className="text-amber-400 text-xs font-bold">!</div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Legend */}
                    <div className="flex justify-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <span className="text-blue-400 text-lg">⬇</span>
                        <span className="text-purple-300">Down</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-green-400 text-lg">⬆</span>
                        <span className="text-purple-300">Up</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-500 text-lg">—</span>
                        <span className="text-purple-300">Rest</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-amber-400 text-sm font-bold">!</span>
                        <span className="text-purple-300">Accent</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 text-xs text-center text-blue-200">
                    ℹ️ This shows when each stroke happens in the measure
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

          {/* Right Panel - Visualizer */}
          <div className="space-y-6">
            {/* What to Expect */}
            <div className="bg-gradient-to-br from-green-600/20 to-blue-600/20 backdrop-blur-lg rounded-2xl p-6 border border-green-500/30">
              <div className="flex items-start gap-3 mb-3">
                <div className="text-3xl">📖</div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">What to Expect</h3>
                  <div className="text-green-100 text-sm space-y-2">
                    <p className="font-semibold text-green-200">This pattern has {pattern.pattern.length} strokes:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• <strong>{pattern.pattern.filter(s => s.stroke === 'down').length} DOWN</strong> strokes (⬇)</li>
                      <li>• <strong>{pattern.pattern.filter(s => s.stroke === 'up').length} UP</strong> strokes (⬆)</li>
                      {pattern.pattern.filter(s => s.stroke === 'rest').length > 0 && (
                        <li>• <strong>{pattern.pattern.filter(s => s.stroke === 'rest').length} REST</strong> (no strum)</li>
                      )}
                      {pattern.pattern.filter(s => s.accent).length > 0 && (
                        <li className="text-amber-200">• <strong>{pattern.pattern.filter(s => s.accent).length} ACCENTED</strong> (strum harder)</li>
                      )}
                    </ul>
                    <div className="mt-3 pt-3 border-t border-white/20">
                      <div className="text-white text-xs">
                        <strong>How it loops:</strong> After beat {pattern.beatsPerMeasure}, the pattern repeats from beat 1.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

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
                    setCurrentBeat(0)
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
                    onClick={() => setTempo(pattern.tempo)}
                    className="text-xs text-purple-300 hover:text-purple-200"
                  >
                    Reset to {pattern.tempo}
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
                <div className="flex justify-between text-xs text-purple-400 mt-1">
                  <span>Slow (40)</span>
                  <span>Medium (100)</span>
                  <span>Fast (160)</span>
                </div>
              </div>

              {/* Volume Control */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-purple-200 text-sm font-semibold">
                    Metronome: {volume === 0 ? "Off" : `${Math.round(volume * 100)}%`}
                  </label>
                  <button
                    onClick={() => setVolume(volume === 0 ? 0.5 : 0)}
                    className="text-xs text-purple-300 hover:text-purple-200"
                  >
                    {volume === 0 ? "🔇 Enable" : "🔊 Disable"}
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

              {/* Visual Strumming Display */}
              <div className="bg-gradient-to-br from-amber-900/20 to-amber-700/10 rounded-xl p-8 border border-amber-600/30">
                <div className="text-center mb-6">
                  <div className="text-purple-200 text-sm mb-4">Strumming Motion</div>

                  {/* Animated Hand/Pick */}
                  <div className="relative h-64 flex items-center justify-center">
                    {/* Guitar Strings Representation */}
                    <div className="absolute inset-x-0 space-y-3">
                      {[1, 2, 3, 4, 5, 6].map((string) => (
                        <div
                          key={string}
                          className={`h-0.5 bg-white/30 transition-all ${
                            activeStrokes.length > 0 ? 'bg-amber-400' : ''
                          }`}
                        />
                      ))}
                    </div>

                    {/* Animated Pick */}
                    {activeStrokes.map((stroke, i) => (
                      <div
                        key={i}
                        className={`absolute transition-all duration-200 ${
                          stroke.stroke === 'down'
                            ? 'top-0 animate-[slideDown_0.3s_ease-in-out]'
                            : stroke.stroke === 'up'
                            ? 'bottom-0 animate-[slideUp_0.3s_ease-in-out]'
                            : 'opacity-0'
                        }`}
                      >
                        <div className={`text-6xl ${
                          stroke.accent ? 'text-amber-400 scale-125' : 'text-purple-400'
                        }`}>
                          {stroke.stroke === 'down' ? '⬇' : stroke.stroke === 'up' ? '⬆' : '—'}
                        </div>
                        <div className="text-white text-sm font-bold text-center mt-2">
                          {stroke.stroke.toUpperCase()}
                          {stroke.accent && <span className="text-amber-400"> !</span>}
                        </div>
                      </div>
                    ))}

                    {!isPlaying && (
                      <div className="text-purple-400 text-sm">
                        Click Play to see strumming animation
                      </div>
                    )}
                  </div>
                </div>

                {/* Current Status */}
                <div className="mt-6 pt-4 border-t border-white/20 text-center">
                  <div className="text-purple-200 text-sm font-semibold mb-2">
                    {isPlaying ? "▶ Now:" : "Ready"}
                  </div>
                  {activeStrokes.length > 0 ? (
                    <div className="text-white text-lg font-bold">
                      {activeStrokes[0].stroke === 'down' ? '↓ DOWN STRUM' :
                       activeStrokes[0].stroke === 'up' ? '↑ UP STRUM' : '— REST'}
                    </div>
                  ) : (
                    <div className="text-purple-400 text-sm">
                      {isPlaying ? '...' : 'Click Play to start'}
                    </div>
                  )}
                </div>
              </div>

              {/* Beat Counter */}
              <div className="mt-4 bg-white/10 rounded-lg p-4">
                <div className="text-center">
                  <div className="text-purple-300 text-sm mb-3">Beat Counter</div>
                  <div className="flex justify-center gap-2">
                    {Array.from({ length: pattern.beatsPerMeasure }).map((_, beat) => (
                      <div
                        key={beat}
                        className={`w-16 h-16 rounded-lg flex items-center justify-center font-bold text-xl transition-all ${
                          Math.floor(currentBeat) === beat && isPlaying
                            ? "bg-purple-600 text-white scale-110 shadow-lg shadow-purple-600/50"
                            : "bg-white/20 text-purple-400"
                        }`}
                      >
                        {beat + 1}
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 text-xs text-purple-400">
                    {pattern.timeSignature} time
                  </div>
                </div>
              </div>
            </div>

            {/* Pattern Breakdown */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-4">Pattern Breakdown</h3>
              <div className="space-y-2">
                {pattern.pattern.map((stroke, index) => {
                  const isActive = isStrokeActive(stroke.beat)

                  return (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                        isActive
                          ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white scale-105"
                          : "bg-white/10 text-purple-200"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">
                          {stroke.stroke === 'down' ? '⬇' :
                           stroke.stroke === 'up' ? '⬆' : '—'}
                        </div>
                        <div>
                          <div className="font-bold">
                            {stroke.stroke === 'down' ? 'DOWN' :
                             stroke.stroke === 'up' ? 'UP' :
                             stroke.stroke === 'mute' ? 'MUTE' : 'REST'}
                          </div>
                          <div className="text-xs opacity-80">
                            Beat {stroke.beat + 1}
                            {stroke.accent && <span className="text-amber-300 ml-2">• ACCENT</span>}
                          </div>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full ${
                        isActive ? 'bg-white animate-pulse' : 'bg-purple-500'
                      }`} />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Practice Guide */}
        <div className="mt-8 bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
          <h3 className="text-xl font-bold text-white mb-4">Practice Guide</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-purple-200">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="font-semibold text-white mb-2">1. Start at 40-50 BPM</div>
              <p>Master the pattern slowly before increasing speed. Perfect practice makes perfect!</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="font-semibold text-white mb-2">2. Keep Arm Moving</div>
              <p>Even on rests, your arm should maintain the up-down motion. Just don't hit the strings.</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="font-semibold text-white mb-2">3. Relax Your Wrist</div>
              <p>Tension is the enemy. Let your wrist be loose and fluid, not stiff.</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="font-semibold text-white mb-2">4. Count Out Loud</div>
              <p>Say the counts while playing. This internalizes the rhythm pattern.</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="font-semibold text-white mb-2">5. One Chord First</div>
              <p>Practice the rhythm on a single chord before trying to change chords.</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="font-semibold text-white mb-2">6. Gradually Increase Speed</div>
              <p>Only increase by 5 BPM when you can play the pattern perfectly 5 times in a row.</p>
            </div>
          </div>
        </div>

        {/* Time Signatures Guide */}
        <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">Understanding Time Signatures</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-white font-bold text-lg mb-2">4/4 Time (Common Time)</div>
              <div className="text-purple-200 text-sm space-y-2">
                <p>4 beats per measure. Most popular music uses this.</p>
                <p className="text-xs">Count: 1 - 2 - 3 - 4 | 1 - 2 - 3 - 4</p>
                <p className="text-xs text-purple-400">Examples: Rock, Pop, Country, Blues</p>
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-white font-bold text-lg mb-2">3/4 Time (Waltz Time)</div>
              <div className="text-purple-200 text-sm space-y-2">
                <p>3 beats per measure. Dancing, classical music.</p>
                <p className="text-xs">Count: 1 - 2 - 3 | 1 - 2 - 3</p>
                <p className="text-xs text-purple-400">Examples: Waltzes, some folk songs</p>
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-white font-bold text-lg mb-2">6/8 Time</div>
              <div className="text-purple-200 text-sm space-y-2">
                <p>6 beats per measure, felt as 2 groups of 3.</p>
                <p className="text-xs">Count: 1 2 3 4 5 6 | Strong on 1 & 4</p>
                <p className="text-xs text-purple-400">Examples: Irish jigs, some ballads</p>
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-white font-bold text-lg mb-2">12/8 Time (Shuffle)</div>
              <div className="text-purple-200 text-sm space-y-2">
                <p>12 beats, felt as 4 groups of 3. Blues shuffle feel.</p>
                <p className="text-xs">Count: 1-2-3 2-2-3 3-2-3 4-2-3</p>
                <p className="text-xs text-purple-400">Examples: Blues, slow rock ballads</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from { transform: translateY(-50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
