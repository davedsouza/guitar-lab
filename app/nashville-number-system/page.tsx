"use client"

import { useState } from "react"
import Link from "next/link"
import ChordDiagram from "@/components/ChordDiagram"
import FullChordFretboard from "@/components/FullChordFretboard"
import { getChordShape } from "@/lib/chordShapes"

const KEYS = ["C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B"]

const NASHVILLE_EXAMPLES = [
  {
    name: "I - V - vi - IV",
    description: "The most popular progression in modern music",
    numbers: ["1", "5", "6m", "4"],
    songs: ["Let It Be - Beatles", "Don't Stop Believin' - Journey", "Someone Like You - Adele"]
  },
  {
    name: "I - IV - V",
    description: "Classic three-chord rock",
    numbers: ["1", "4", "5"],
    songs: ["Twist and Shout - Beatles", "La Bamba - Ritchie Valens", "Wild Thing - The Troggs"]
  },
  {
    name: "2m - 5 - 1",
    description: "Jazz standard progression (ii-V-I)",
    numbers: ["2m", "5", "1"],
    songs: ["Autumn Leaves", "Fly Me to the Moon", "All The Things You Are"]
  },
  {
    name: "1 - 6m - 4 - 5",
    description: "50s progression, doo-wop classic",
    numbers: ["1", "6m", "4", "5"],
    songs: ["Stand By Me - Ben E. King", "Every Breath You Take - The Police"]
  },
  {
    name: "6m - 4 - 1 - 5",
    description: "Emotional pop progression",
    numbers: ["6m", "4", "1", "5"],
    songs: ["Grenade - Bruno Mars", "Poker Face - Lady Gaga"]
  },
  {
    name: "1 - 4 - 6m - 5",
    description: "Singer-songwriter favorite",
    numbers: ["1", "4", "6m", "5"],
    songs: ["With or Without You - U2", "No Woman No Cry - Bob Marley"]
  }
]

const COMMON_SYMBOLS = [
  { symbol: "1, 4, 5", meaning: "Major chords (uppercase)", example: "C, F, G in key of C" },
  { symbol: "2m, 3m, 6m", meaning: "Minor chords (lowercase 'm')", example: "Dm, Em, Am in key of C" },
  { symbol: "7°", meaning: "Diminished chord", example: "B° in key of C" },
  { symbol: "7", meaning: "Dominant 7th (like 57)", example: "G7 in key of C" },
  { symbol: "△7 or maj7", meaning: "Major 7th (like 1△7)", example: "Cmaj7 in key of C" },
  { symbol: "sus", meaning: "Suspended chord (like 4sus)", example: "Fsus in key of C" },
  { symbol: "/", meaning: "Slash chord - bass note (like 1/3)", example: "C/E in key of C" },
  { symbol: "♯ or ♭", meaning: "Raised or lowered (like ♭7)", example: "B♭ in key of C" }
]

export default function NashvilleNumberSystem() {
  const [selectedKey, setSelectedKey] = useState(0) // C
  const [customNumbers, setCustomNumbers] = useState("1 5 6m 4")
  const [mode, setMode] = useState<"converter" | "builder">("converter")
  const [builtProgression, setBuiltProgression] = useState<string[]>([])

  // Nashville number system scale degrees
  const getChordFromNumber = (numberStr: string, keyIndex: number) => {
    const number = numberStr.replace('m', '').replace('△7', '').replace('maj7', '').replace('7', '').replace('sus', '').replace('°', '')
    const isMinor = numberStr.includes('m')
    const isDiminished = numberStr.includes('°')
    const isSus = numberStr.includes('sus')
    const is7 = numberStr.includes('7') && !numberStr.includes('maj7') && !numberStr.includes('△7')
    const isMaj7 = numberStr.includes('maj7') || numberStr.includes('△7')

    const degreeMap: Record<string, number> = {
      "1": 0, "2": 2, "3": 4, "4": 5, "5": 7, "6": 9, "7": 11
    }

    const semitones = degreeMap[number]
    if (semitones === undefined) return null

    const noteIndex = (keyIndex + semitones) % 12
    const note = KEYS[noteIndex]

    let quality = ""
    if (isMinor) quality = "m"
    else if (isDiminished) quality = "°"
    else if (isSus) quality = "sus"
    else if (is7) quality = "7"
    else if (isMaj7) quality = "maj7"

    return note + quality
  }

  const customChords = customNumbers.split(/\s+/).map(num =>
    num ? getChordFromNumber(num.trim(), selectedKey) : null
  ).filter(Boolean)

  // For builder mode
  const addToProgression = (number: string) => {
    setBuiltProgression([...builtProgression, number])
  }

  const clearProgression = () => {
    setBuiltProgression([])
  }

  const removeLastChord = () => {
    setBuiltProgression(builtProgression.slice(0, -1))
  }

  // Get chords with proper quality mapping
  const getChordWithQuality = (numberStr: string, keyIndex: number) => {
    const chord = getChordFromNumber(numberStr, keyIndex)
    if (!chord) return null

    // Map to quality for chord shapes
    let quality = "Major"
    if (numberStr.includes('m') && !numberStr.includes('maj')) quality = "Minor"
    else if (numberStr.includes('°')) quality = "Diminished"
    else if (numberStr.includes('7') && !numberStr.includes('maj7') && !numberStr.includes('△7')) quality = "Dominant 7th"
    else if (numberStr.includes('maj7') || numberStr.includes('△7')) quality = "Major 7th"

    return { chord, quality }
  }

  const getChordIntervals = (quality: string): number[] => {
    switch (quality) {
      case "Major":
        return [0, 4, 7]
      case "Minor":
        return [0, 3, 7]
      case "Diminished":
        return [0, 3, 6]
      case "Dominant 7th":
        return [0, 4, 7, 10]
      case "Major 7th":
        return [0, 4, 7, 11]
      default:
        return [0, 4, 7]
    }
  }

  const getNoteIndex = (note: string): number => {
    // Remove any qualifiers (m, 7, etc.) to get just the note name
    const cleanNote = note.split(/[^A-G#b/]/)[0]
    return KEYS.indexOf(cleanNote)
  }

  // Major scale harmonization
  const scaleChords = [
    { number: "1", name: "Tonic", quality: "Major", color: "bg-purple-600" },
    { number: "2m", name: "Supertonic", quality: "Minor", color: "bg-blue-600" },
    { number: "3m", name: "Mediant", quality: "Minor", color: "bg-blue-600" },
    { number: "4", name: "Subdominant", quality: "Major", color: "bg-purple-600" },
    { number: "5", name: "Dominant", quality: "Major", color: "bg-purple-600" },
    { number: "6m", name: "Submediant", quality: "Minor", color: "bg-blue-600" },
    { number: "7°", name: "Leading Tone", quality: "Diminished", color: "bg-red-600" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-purple-300 hover:text-purple-200 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Nashville Number System</h1>
          <p className="text-purple-200">Master the universal language of chord progressions</p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Theory & Controls */}
          <div className="space-y-6">
            {/* What is Nashville Number System */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">What is the Nashville Number System?</h2>
              <div className="space-y-3 text-purple-200 text-sm">
                <p>
                  The Nashville Number System (NNS) is a method of transcribing music by denoting
                  chords with numbers rather than chord names. It's the universal language used by
                  session musicians to quickly learn and transpose songs.
                </p>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="font-semibold text-white mb-2">Why use it?</div>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Instantly transpose to any key</li>
                    <li>Focus on chord function, not names</li>
                    <li>Universal - works for any musician</li>
                    <li>Faster communication in sessions</li>
                    <li>Understand music theory deeply</li>
                  </ul>
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

            {/* Scale Harmonization */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">Scale Chords in {KEYS[selectedKey]}</h2>
              <div className="space-y-2">
                {scaleChords.map((chord, index) => {
                  const chordName = getChordFromNumber(chord.number, selectedKey)
                  return (
                    <div key={index} className="flex items-center gap-3 bg-white/10 rounded-lg p-3">
                      <div className={`${chord.color} text-white w-12 h-12 rounded-full flex items-center justify-center font-bold`}>
                        {chord.number}
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-semibold">{chordName}</div>
                        <div className="text-purple-300 text-xs">{chord.name} • {chord.quality}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Common Symbols */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">Common Symbols</h2>
              <div className="space-y-2">
                {COMMON_SYMBOLS.map((item, index) => (
                  <div key={index} className="bg-white/10 rounded-lg p-3">
                    <div className="flex items-start gap-3">
                      <div className="bg-purple-600 text-white px-3 py-1 rounded font-mono text-sm font-bold whitespace-nowrap">
                        {item.symbol}
                      </div>
                      <div className="flex-1">
                        <div className="text-white text-sm font-semibold">{item.meaning}</div>
                        <div className="text-purple-300 text-xs">{item.example}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Examples & Converter */}
          <div className="space-y-6">
            {/* Interactive Tools */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">Interactive Tools</h2>

              {/* Mode Tabs */}
              <div className="flex gap-2 mb-6 bg-white/10 rounded-lg p-1">
                <button
                  onClick={() => setMode("converter")}
                  className={`flex-1 py-2 px-4 rounded-md font-semibold text-sm transition-all ${
                    mode === "converter"
                      ? "bg-purple-600 text-white"
                      : "text-purple-200 hover:text-white"
                  }`}
                >
                  Converter
                </button>
                <button
                  onClick={() => setMode("builder")}
                  className={`flex-1 py-2 px-4 rounded-md font-semibold text-sm transition-all ${
                    mode === "builder"
                      ? "bg-purple-600 text-white"
                      : "text-purple-200 hover:text-white"
                  }`}
                >
                  Builder
                </button>
              </div>

              {/* Converter Mode */}
              {mode === "converter" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-purple-200 text-sm mb-2 block">Enter Nashville Numbers</label>
                    <input
                      type="text"
                      value={customNumbers}
                      onChange={(e) => setCustomNumbers(e.target.value)}
                      placeholder="1 5 6m 4"
                      className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-purple-300 border border-white/30 focus:border-purple-500 focus:outline-none"
                    />
                    <p className="text-purple-300 text-xs mt-1">Example: 1 5 6m 4 or 2m 5 1maj7</p>
                  </div>

                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-purple-200 text-sm mb-2">Chords in {KEYS[selectedKey]}:</div>
                    <div className="flex flex-wrap gap-2">
                      {customChords.map((chord, index) => (
                        <div key={index} className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold">
                          {chord}
                        </div>
                      ))}
                    </div>
                    {customChords.length === 0 && (
                      <div className="text-purple-300 text-sm italic">Enter numbers above to see chords</div>
                    )}
                  </div>

                  <div className="bg-amber-500/20 border border-amber-500/50 rounded-lg p-3">
                    <div className="text-amber-200 text-xs">
                      <strong>Tip:</strong> Use 'm' for minor (6m), '7' for dominant 7th (57), 'maj7' for major 7th (1maj7)
                    </div>
                  </div>
                </div>
              )}

              {/* Builder Mode */}
              {mode === "builder" && (
                <div className="space-y-4">
                  <div className="text-purple-200 text-sm mb-3">Click numbers to build your progression:</div>

                  <div className="grid grid-cols-4 gap-2">
                    {scaleChords.map((chord, index) => (
                      <button
                        key={index}
                        onClick={() => addToProgression(chord.number)}
                        className={`${chord.color} text-white py-3 px-2 rounded-lg font-bold text-sm hover:scale-105 transition-transform`}
                      >
                        {chord.number}
                      </button>
                    ))}
                    <button
                      onClick={() => addToProgression("1maj7")}
                      className="bg-purple-600 text-white py-3 px-2 rounded-lg font-bold text-sm hover:scale-105 transition-transform"
                    >
                      1maj7
                    </button>
                  </div>

                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-purple-200 text-sm">Your Progression:</div>
                      <div className="flex gap-2">
                        <button
                          onClick={removeLastChord}
                          className="text-xs bg-red-600/80 hover:bg-red-600 text-white px-3 py-1 rounded"
                          disabled={builtProgression.length === 0}
                        >
                          Undo
                        </button>
                        <button
                          onClick={clearProgression}
                          className="text-xs bg-gray-600/80 hover:bg-gray-600 text-white px-3 py-1 rounded"
                          disabled={builtProgression.length === 0}
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 min-h-[40px]">
                      {builtProgression.map((num, index) => (
                        <div key={index} className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold">
                          {getChordFromNumber(num, selectedKey)}
                        </div>
                      ))}
                      {builtProgression.length === 0 && (
                        <div className="text-purple-300 text-sm italic">Click numbers above to build</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chord Diagrams for Current Progression */}
            {mode === "converter" && customChords.length > 0 && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4">How to Play on Guitar</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {customNumbers.split(/\s+/).slice(0, 8).map((num, index) => {
                    const chordInfo = getChordWithQuality(num.trim(), selectedKey)
                    if (!chordInfo) return null

                    const shape = getChordShape(chordInfo.chord.split(/[^A-G#b]/)[0], chordInfo.quality)

                    return shape ? (
                      <div key={index} className="flex flex-col items-center bg-white/5 rounded-xl p-4">
                        <ChordDiagram
                          chordName={chordInfo.chord}
                          fingers={shape}
                          size="large"
                        />
                        <div className="text-purple-300 text-sm font-semibold mt-3">({num})</div>
                      </div>
                    ) : (
                      <div key={index} className="flex flex-col items-center bg-white/5 rounded-xl p-6 text-center">
                        <div className="text-xl font-bold text-white">{chordInfo.chord}</div>
                        <div className="text-purple-300 text-xs mt-2">({num})</div>
                        <div className="text-purple-400 text-xs mt-1">No diagram</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {mode === "builder" && builtProgression.length > 0 && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4">How to Play on Guitar</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {builtProgression.slice(0, 8).map((num, index) => {
                    const chordInfo = getChordWithQuality(num, selectedKey)
                    if (!chordInfo) return null

                    const shape = getChordShape(chordInfo.chord.split(/[^A-G#b]/)[0], chordInfo.quality)

                    return shape ? (
                      <div key={index} className="flex flex-col items-center bg-white/5 rounded-xl p-4">
                        <ChordDiagram
                          chordName={chordInfo.chord}
                          fingers={shape}
                          size="large"
                        />
                        <div className="text-purple-300 text-sm font-semibold mt-3">({num})</div>
                      </div>
                    ) : (
                      <div key={index} className="flex flex-col items-center bg-white/5 rounded-xl p-6 text-center">
                        <div className="text-xl font-bold text-white">{chordInfo.chord}</div>
                        <div className="text-purple-300 text-xs mt-2">({num})</div>
                        <div className="text-purple-400 text-xs mt-1">No diagram</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Famous Progressions */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">Famous Progressions</h2>
              <p className="text-purple-200 text-sm mb-4">
                Click any progression to see it in {KEYS[selectedKey]}
              </p>
              <div className="space-y-3">
                {NASHVILLE_EXAMPLES.map((example, index) => (
                  <div
                    key={index}
                    onClick={() => setCustomNumbers(example.numbers.join(" "))}
                    className="bg-white/10 rounded-lg p-4 hover:bg-white/20 cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-bold text-white">{example.name}</div>
                      <div className="flex gap-1">
                        {example.numbers.map((num, i) => (
                          <span key={i} className="bg-purple-600 text-white px-2 py-1 rounded text-xs font-mono">
                            {num}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-purple-300 text-sm mb-2">{example.description}</div>
                    <div className="text-purple-400 text-xs">
                      {example.songs.join(" • ")}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Practice Exercise */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-lg font-bold text-white mb-3">Practice Exercise</h2>
              <div className="space-y-3 text-sm text-purple-200">
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="font-semibold text-white mb-2">Exercise 1: Transpose</div>
                  <p className="mb-2">Take a song you know in one key and transpose it to another using Nashville numbers.</p>
                  <p className="text-purple-300 text-xs">Example: "Let It Be" (1-5-6m-4) from C to G</p>
                </div>

                <div className="bg-white/10 rounded-lg p-4">
                  <div className="font-semibold text-white mb-2">Exercise 2: Identify</div>
                  <p className="mb-2">Listen to a song and write out the progression in Nashville numbers.</p>
                  <p className="text-purple-300 text-xs">Focus on the function (1, 4, 5) not the specific chords</p>
                </div>

                <div className="bg-white/10 rounded-lg p-4">
                  <div className="font-semibold text-white mb-2">Exercise 3: Communicate</div>
                  <p className="mb-2">Practice calling out chord changes using numbers when playing with others.</p>
                  <p className="text-purple-300 text-xs">"Let's go to the 4, then back to the 1"</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Complete Chord Reference Table */}
        <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-4">Complete Chord Reference Table</h2>
          <p className="text-purple-200 text-sm mb-6">
            This table shows all chords for every Nashville number in all 12 keys. Use this as a quick reference for transposing songs.
          </p>

          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full border-collapse text-base">
              <thead>
                <tr className="border-b-2 border-white/30">
                  <th className="text-left py-4 px-6 text-white font-bold text-lg bg-white/10 sticky left-0 min-w-[120px]">Key</th>
                  <th className="text-center py-4 px-6 text-white font-bold text-lg bg-purple-600/50 min-w-[140px]">
                    <div>1</div>
                    <div className="text-xs font-normal opacity-80 mt-1">Major</div>
                  </th>
                  <th className="text-center py-4 px-6 text-white font-bold text-lg bg-blue-600/50 min-w-[140px]">
                    <div>2m</div>
                    <div className="text-xs font-normal opacity-80 mt-1">Minor</div>
                  </th>
                  <th className="text-center py-4 px-6 text-white font-bold text-lg bg-blue-600/50 min-w-[140px]">
                    <div>3m</div>
                    <div className="text-xs font-normal opacity-80 mt-1">Minor</div>
                  </th>
                  <th className="text-center py-4 px-6 text-white font-bold text-lg bg-purple-600/50 min-w-[140px]">
                    <div>4</div>
                    <div className="text-xs font-normal opacity-80 mt-1">Major</div>
                  </th>
                  <th className="text-center py-4 px-6 text-white font-bold text-lg bg-purple-600/50 min-w-[140px]">
                    <div>5</div>
                    <div className="text-xs font-normal opacity-80 mt-1">Major</div>
                  </th>
                  <th className="text-center py-4 px-6 text-white font-bold text-lg bg-blue-600/50 min-w-[140px]">
                    <div>6m</div>
                    <div className="text-xs font-normal opacity-80 mt-1">Minor</div>
                  </th>
                  <th className="text-center py-4 px-6 text-white font-bold text-lg bg-red-600/50 min-w-[140px]">
                    <div>7°</div>
                    <div className="text-xs font-normal opacity-80 mt-1">Diminished</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {KEYS.map((key, keyIndex) => (
                  <tr key={keyIndex} className={`border-b border-white/20 hover:bg-white/10 transition-colors ${keyIndex === selectedKey ? 'bg-amber-500/20 ring-2 ring-amber-500/50' : ''}`}>
                    <td className="py-4 px-6 font-bold text-white text-lg bg-white/10 sticky left-0">
                      {key}
                    </td>
                    {scaleChords.map((chord, chordIndex) => {
                      const chordName = getChordFromNumber(chord.number, keyIndex)
                      return (
                        <td key={chordIndex} className={`text-center py-4 px-6 font-bold text-lg ${keyIndex === selectedKey ? 'text-amber-300' : 'text-white'}`}>
                          {chordName}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile/Tablet View */}
          <div className="lg:hidden space-y-6">
            {KEYS.map((key, keyIndex) => (
              <div key={keyIndex} className={`bg-white/5 rounded-xl p-6 border-2 ${keyIndex === selectedKey ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/30' : 'border-white/20'}`}>
                <div className="text-white font-bold text-xl mb-4">{key} Major</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {scaleChords.map((chord, chordIndex) => {
                    const chordName = getChordFromNumber(chord.number, keyIndex)
                    return (
                      <div key={chordIndex} className="text-center">
                        <div className={`${chord.color} text-white text-sm font-bold px-3 py-2 rounded-t`}>
                          {chord.number}
                        </div>
                        <div className={`bg-white/20 text-white text-base font-bold px-3 py-3 rounded-b ${keyIndex === selectedKey ? 'text-amber-300' : ''}`}>
                          {chordName}
                        </div>
                        <div className="text-purple-300 text-xs mt-1">{chord.quality}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-6 bg-white/10 rounded-xl p-4">
            <h3 className="text-white font-semibold mb-3">Legend</h3>
            <div className="grid md:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-purple-600"></div>
                <span className="text-purple-200">Major Chords (1, 4, 5)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-blue-600"></div>
                <span className="text-purple-200">Minor Chords (2m, 3m, 6m)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-red-600"></div>
                <span className="text-purple-200">Diminished Chord (7°)</span>
              </div>
            </div>
          </div>

          {/* Usage Tips */}
          <div className="mt-4 bg-amber-500/20 border border-amber-500/50 rounded-lg p-4">
            <h3 className="text-amber-200 font-semibold mb-2 text-sm">How to Use This Table:</h3>
            <ul className="text-amber-100 text-xs space-y-1 list-disc list-inside">
              <li><strong>Quick Transposition:</strong> Find your current key, note the Nashville numbers, then look up the same numbers in your target key</li>
              <li><strong>Learn Patterns:</strong> Notice how the chord qualities stay the same across all keys (1, 4, 5 are always major)</li>
              <li><strong>Relative Keys:</strong> The 6m chord of any key is the relative minor key (e.g., Am is the 6m of C)</li>
              <li><strong>Common Progressions:</strong> Most pop songs use 1, 4, 5, and 6m - scan any row to see these chords in that key</li>
              <li><strong>Circle of Fifths:</strong> Moving down the table shows you keys in the circle of fifths (C→G→D→A→E)</li>
            </ul>
          </div>

          {/* Extended Chords Reference */}
          <div className="mt-6 bg-white/10 rounded-xl p-4">
            <h3 className="text-white font-semibold mb-3">Common Chord Extensions</h3>
            <p className="text-purple-200 text-sm mb-3">Add these to any Nashville number for more complex chords:</p>
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <div className="bg-white/10 rounded p-3">
                <div className="text-white font-semibold mb-1">7th Chords</div>
                <ul className="text-purple-200 space-y-1 text-xs">
                  <li><strong>1maj7, 4maj7</strong> - Major 7th chords (jazzy, dreamy)</li>
                  <li><strong>2m7, 3m7, 6m7</strong> - Minor 7th chords (smooth, mellow)</li>
                  <li><strong>57</strong> - Dominant 7th (tension, wants to resolve to 1)</li>
                  <li><strong>7m7♭5</strong> - Half-diminished (complex, jazzy)</li>
                </ul>
              </div>
              <div className="bg-white/10 rounded p-3">
                <div className="text-white font-semibold mb-1">Other Extensions</div>
                <ul className="text-purple-200 space-y-1 text-xs">
                  <li><strong>sus2, sus4</strong> - Suspended chords (open, floating)</li>
                  <li><strong>add9</strong> - Add ninth (rich, full sound)</li>
                  <li><strong>6</strong> - Major 6th (vintage, jazzy)</li>
                  <li><strong>9, 11, 13</strong> - Extended jazz voicings</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Complete Fretboard View */}
        {((mode === "converter" && customChords.length > 0) || (mode === "builder" && builtProgression.length > 0)) && (
          <div className="mt-8 bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">Complete Fretboard View</h3>
            <p className="text-purple-200 text-sm mb-6">
              See how each chord appears across the entire neck. This helps you understand how the chords connect and find alternative positions.
            </p>
            <div className="space-y-8">
              {mode === "converter" && customNumbers.split(/\s+/).slice(0, 8).map((num, index) => {
                const chordInfo = getChordWithQuality(num.trim(), selectedKey)
                if (!chordInfo) return null

                const noteIndex = getNoteIndex(chordInfo.chord)
                if (noteIndex === -1) return null

                return (
                  <div key={index} className="bg-white/5 rounded-xl p-6">
                    <div className="mb-4">
                      <div className="text-purple-300 text-sm mb-1">
                        Chord {index + 1} - Nashville Number: {num}
                      </div>
                    </div>
                    <FullChordFretboard
                      chordName={chordInfo.chord}
                      rootNoteIndex={noteIndex}
                      intervals={getChordIntervals(chordInfo.quality)}
                      showNoteNames={true}
                    />
                  </div>
                )
              })}
              {mode === "builder" && builtProgression.slice(0, 8).map((num, index) => {
                const chordInfo = getChordWithQuality(num, selectedKey)
                if (!chordInfo) return null

                const noteIndex = getNoteIndex(chordInfo.chord)
                if (noteIndex === -1) return null

                return (
                  <div key={index} className="bg-white/5 rounded-xl p-6">
                    <div className="mb-4">
                      <div className="text-purple-300 text-sm mb-1">
                        Chord {index + 1} - Nashville Number: {num}
                      </div>
                    </div>
                    <FullChordFretboard
                      chordName={chordInfo.chord}
                      rootNoteIndex={noteIndex}
                      intervals={getChordIntervals(chordInfo.quality)}
                      showNoteNames={true}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
