"use client"

import { useState } from "react"
import Link from "next/link"
import ChordDiagram from "@/components/ChordDiagram"
import FullChordFretboard from "@/components/FullChordFretboard"
import { getChordShape } from "@/lib/chordShapes"

// ─── Interfaces ───────────────────────────────────────────────────────────────

interface ChordEntry {
  degree: number
  quality: string
  roman: string
  subFor?: string
}

interface SubstitutionVariant {
  name: string
  type: string
  chords: ChordEntry[]
}

interface ProgressionData {
  id: string
  name: string
  genre: string
  original: ChordEntry[]
  substitutions: SubstitutionVariant[]
}

interface SubstitutionType {
  id: string
  name: string
  description: string
  explanation: string
  example: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  difficultyOrder: number
  color: string
}

interface SubstitutionRule {
  replacementRoman: string
  degree: number
  quality: string
  typeId: string
  explanation: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const KEYS = ["C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B"]

const LEARNING_PATH = [
  {
    level: "Beginner",
    color: "bg-green-600",
    border: "border-green-500",
    text: "text-green-300",
    techniques: ["Relative Minor/Major", "Parallel Minor/Major"],
  },
  {
    level: "Intermediate",
    color: "bg-purple-600",
    border: "border-purple-500",
    text: "text-purple-300",
    techniques: ["Borrowed Chords", "Diatonic Substitution", "Diminished Passing"],
  },
  {
    level: "Advanced",
    color: "bg-red-600",
    border: "border-red-500",
    text: "text-red-300",
    techniques: ["Secondary Dominant", "Tritone Substitution"],
  },
]

const SUBSTITUTION_TYPES: SubstitutionType[] = [
  {
    id: "relative",
    name: "Relative Minor/Major",
    description: "Replace a major chord with its relative minor (or vice versa).",
    explanation: "The relative minor sits 3 semitones below the major root. Both chords share the same three notes, so the swap is nearly invisible harmonically.",
    example: "C ↔ Am, G ↔ Em, F ↔ Dm",
    difficulty: "Beginner",
    difficultyOrder: 1,
    color: "bg-green-600",
  },
  {
    id: "parallel",
    name: "Parallel Minor/Major",
    description: "Replace a major chord with the minor on the same root (or vice versa).",
    explanation: "Same root, different quality. Creates an immediate mood shift — major to minor darkens, minor to major brightens.",
    example: "C ↔ Cm, G ↔ Gm, D ↔ Dm",
    difficulty: "Beginner",
    difficultyOrder: 1,
    color: "bg-blue-600",
  },
  {
    id: "borrowed",
    name: "Borrowed Chords (Modal Mixture)",
    description: "Borrow a chord from the parallel minor key while staying in major.",
    explanation: "In a major key, bring in chords from the natural minor scale — iv, bVI, or bVII. Creates a darker, richer sound common in rock and pop.",
    example: "In C major: use Fm (iv), Ab (bVI), or Bb (bVII)",
    difficulty: "Intermediate",
    difficultyOrder: 2,
    color: "bg-teal-600",
  },
  {
    id: "diatonic",
    name: "Diatonic Substitution",
    description: "Replace with another chord from the same key that shares harmonic function.",
    explanation: "Tonic function: I, iii, vi. Subdominant function: IV, ii. Dominant function: V, vii°. Swap within a function group for a fresh colour.",
    example: "I → iii or vi, IV → ii, V → vii°",
    difficulty: "Intermediate",
    difficultyOrder: 2,
    color: "bg-purple-600",
  },
  {
    id: "diminished",
    name: "Diminished Passing",
    description: "Insert a diminished chord between two diatonic chords for chromatic motion.",
    explanation: "Diminished chords are symmetrical — any note can act as the root. They create half-step voice leading that pulls strongly toward the next chord.",
    example: "C - C#° - Dm  (I - #I° - ii)",
    difficulty: "Intermediate",
    difficultyOrder: 2,
    color: "bg-indigo-600",
  },
  {
    id: "secondary",
    name: "Secondary Dominant",
    description: "Play a dominant 7th chord that resolves to a diatonic chord other than I.",
    explanation: "Temporarily treat any diatonic chord as a local I and precede it with its own V7. Written V7/X — 'five-seven of X'.",
    example: "V7/ii = VI7, V7/V = II7, V7/vi = III7",
    difficulty: "Advanced",
    difficultyOrder: 3,
    color: "bg-amber-600",
  },
  {
    id: "tritone",
    name: "Tritone Substitution",
    description: "Replace a dominant 7th with another dom7 a tritone (6 semitones) away.",
    explanation: "The guide tones (3rd and 7th) of both chords are enharmonically identical — they just swap roles. The chromatic bass motion also creates smooth voice leading into the tonic.",
    example: "G7 ↔ Db7, D7 ↔ Ab7, A7 ↔ Eb7",
    difficulty: "Advanced",
    difficultyOrder: 3,
    color: "bg-red-600",
  },
]

const PROGRESSIONS: ProgressionData[] = [
  {
    id: "pop-I-V-vi-IV",
    name: "I - V - vi - IV",
    genre: "Pop",
    original: [
      { degree: 0, quality: "Major", roman: "I" },
      { degree: 7, quality: "Major", roman: "V" },
      { degree: 9, quality: "Minor", roman: "vi" },
      { degree: 5, quality: "Major", roman: "IV" },
    ],
    substitutions: [
      {
        name: "iii for I",
        type: "diatonic",
        chords: [
          { degree: 4, quality: "Minor", roman: "iii", subFor: "I" },
          { degree: 7, quality: "Major", roman: "V" },
          { degree: 9, quality: "Minor", roman: "vi" },
          { degree: 5, quality: "Major", roman: "IV" },
        ],
      },
      {
        name: "bVII borrowed for IV",
        type: "borrowed",
        chords: [
          { degree: 0, quality: "Major", roman: "I" },
          { degree: 7, quality: "Major", roman: "V" },
          { degree: 9, quality: "Minor", roman: "vi" },
          { degree: 10, quality: "Major", roman: "bVII", subFor: "IV" },
        ],
      },
    ],
  },
  {
    id: "jazz-ii-V-I",
    name: "ii7 - V7 - Imaj7",
    genre: "Jazz",
    original: [
      { degree: 2, quality: "Minor 7th", roman: "ii7" },
      { degree: 7, quality: "Dominant 7th", roman: "V7" },
      { degree: 0, quality: "Major 7th", roman: "Imaj7" },
    ],
    substitutions: [
      {
        name: "Tritone Sub on V7",
        type: "tritone",
        chords: [
          { degree: 2, quality: "Minor 7th", roman: "ii7" },
          { degree: 1, quality: "Dominant 7th", roman: "bII7", subFor: "V7" },
          { degree: 0, quality: "Major 7th", roman: "Imaj7" },
        ],
      },
      {
        name: "Secondary Dominant lead-in",
        type: "secondary",
        chords: [
          { degree: 9, quality: "Dominant 7th", roman: "VI7", subFor: "(before ii7)" },
          { degree: 2, quality: "Minor 7th", roman: "ii7" },
          { degree: 7, quality: "Dominant 7th", roman: "V7" },
          { degree: 0, quality: "Major 7th", roman: "Imaj7" },
        ],
      },
    ],
  },
  {
    id: "blues-I-IV-V",
    name: "I7 - IV7 - V7",
    genre: "Blues",
    original: [
      { degree: 0, quality: "Dominant 7th", roman: "I7" },
      { degree: 5, quality: "Dominant 7th", roman: "IV7" },
      { degree: 7, quality: "Dominant 7th", roman: "V7" },
    ],
    substitutions: [
      {
        name: "Tritone Sub on V7",
        type: "tritone",
        chords: [
          { degree: 0, quality: "Dominant 7th", roman: "I7" },
          { degree: 5, quality: "Dominant 7th", roman: "IV7" },
          { degree: 1, quality: "Dominant 7th", roman: "bII7", subFor: "V7" },
        ],
      },
      {
        name: "Diminished passing (I → #I° → IV)",
        type: "diminished",
        chords: [
          { degree: 0, quality: "Dominant 7th", roman: "I7" },
          { degree: 1, quality: "Diminished", roman: "#I°", subFor: "(passing)" },
          { degree: 5, quality: "Dominant 7th", roman: "IV7" },
          { degree: 7, quality: "Dominant 7th", roman: "V7" },
        ],
      },
    ],
  },
  {
    id: "minor-rock-i-bVII-bVI-bVII",
    name: "i - bVII - bVI - bVII",
    genre: "Minor Rock",
    original: [
      { degree: 0, quality: "Minor", roman: "i" },
      { degree: 10, quality: "Major", roman: "bVII" },
      { degree: 8, quality: "Major", roman: "bVI" },
      { degree: 10, quality: "Major", roman: "bVII" },
    ],
    substitutions: [
      {
        name: "bIII for bVII",
        type: "diatonic",
        chords: [
          { degree: 0, quality: "Minor", roman: "i" },
          { degree: 3, quality: "Major", roman: "bIII", subFor: "bVII" },
          { degree: 8, quality: "Major", roman: "bVI" },
          { degree: 10, quality: "Major", roman: "bVII" },
        ],
      },
      {
        name: "Relative major swap",
        type: "relative",
        chords: [
          { degree: 3, quality: "Major", roman: "bIII", subFor: "i" },
          { degree: 10, quality: "Major", roman: "bVII" },
          { degree: 8, quality: "Major", roman: "bVI" },
          { degree: 10, quality: "Major", roman: "bVII" },
        ],
      },
    ],
  },
  {
    id: "jazz-turnaround-I-vi-ii-V",
    name: "Imaj7 - vi7 - ii7 - V7",
    genre: "Jazz Turnaround",
    original: [
      { degree: 0, quality: "Major 7th", roman: "Imaj7" },
      { degree: 9, quality: "Minor 7th", roman: "vi7" },
      { degree: 2, quality: "Minor 7th", roman: "ii7" },
      { degree: 7, quality: "Dominant 7th", roman: "V7" },
    ],
    substitutions: [
      {
        name: "iii7 for Imaj7",
        type: "diatonic",
        chords: [
          { degree: 4, quality: "Minor 7th", roman: "iii7", subFor: "Imaj7" },
          { degree: 9, quality: "Minor 7th", roman: "vi7" },
          { degree: 2, quality: "Minor 7th", roman: "ii7" },
          { degree: 7, quality: "Dominant 7th", roman: "V7" },
        ],
      },
      {
        name: "Tritone Sub on V7",
        type: "tritone",
        chords: [
          { degree: 0, quality: "Major 7th", roman: "Imaj7" },
          { degree: 9, quality: "Minor 7th", roman: "vi7" },
          { degree: 2, quality: "Minor 7th", roman: "ii7" },
          { degree: 1, quality: "Dominant 7th", roman: "bII7", subFor: "V7" },
        ],
      },
    ],
  },
  {
    id: "natural-minor-i-iv-bVII-bIII",
    name: "i - iv - bVII - bIII",
    genre: "Natural Minor",
    original: [
      { degree: 0, quality: "Minor", roman: "i" },
      { degree: 5, quality: "Minor", roman: "iv" },
      { degree: 10, quality: "Major", roman: "bVII" },
      { degree: 3, quality: "Major", roman: "bIII" },
    ],
    substitutions: [
      {
        name: "bVI for iv (relative sub)",
        type: "relative",
        chords: [
          { degree: 0, quality: "Minor", roman: "i" },
          { degree: 8, quality: "Major", roman: "bVI", subFor: "iv" },
          { degree: 10, quality: "Major", roman: "bVII" },
          { degree: 3, quality: "Major", roman: "bIII" },
        ],
      },
      {
        name: "bVI borrowed for bIII",
        type: "borrowed",
        chords: [
          { degree: 0, quality: "Minor", roman: "i" },
          { degree: 5, quality: "Minor", roman: "iv" },
          { degree: 10, quality: "Major", roman: "bVII" },
          { degree: 8, quality: "Major", roman: "bVI", subFor: "bIII" },
        ],
      },
    ],
  },
  {
    id: "rnb-I-iii-IV-V",
    name: "I - iii - IV - V7",
    genre: "R&B / Soul",
    original: [
      { degree: 0, quality: "Major", roman: "I" },
      { degree: 4, quality: "Minor", roman: "iii" },
      { degree: 5, quality: "Major", roman: "IV" },
      { degree: 7, quality: "Dominant 7th", roman: "V7" },
    ],
    substitutions: [
      {
        name: "vi for iii",
        type: "diatonic",
        chords: [
          { degree: 0, quality: "Major", roman: "I" },
          { degree: 9, quality: "Minor", roman: "vi", subFor: "iii" },
          { degree: 5, quality: "Major", roman: "IV" },
          { degree: 7, quality: "Dominant 7th", roman: "V7" },
        ],
      },
      {
        name: "Borrowed iv for IV",
        type: "borrowed",
        chords: [
          { degree: 0, quality: "Major", roman: "I" },
          { degree: 4, quality: "Minor", roman: "iii" },
          { degree: 5, quality: "Minor", roman: "iv", subFor: "IV" },
          { degree: 7, quality: "Dominant 7th", roman: "V7" },
        ],
      },
    ],
  },
  {
    id: "minor-jazz-ii-V-i",
    name: "ii° - V7 - i",
    genre: "Minor Jazz",
    original: [
      { degree: 2, quality: "Diminished", roman: "ii°" },
      { degree: 7, quality: "Dominant 7th", roman: "V7" },
      { degree: 0, quality: "Minor", roman: "i" },
    ],
    substitutions: [
      {
        name: "Tritone Sub on V7",
        type: "tritone",
        chords: [
          { degree: 2, quality: "Diminished", roman: "ii°" },
          { degree: 1, quality: "Dominant 7th", roman: "bII7", subFor: "V7" },
          { degree: 0, quality: "Minor", roman: "i" },
        ],
      },
      {
        name: "iv approach before i",
        type: "diatonic",
        chords: [
          { degree: 2, quality: "Diminished", roman: "ii°" },
          { degree: 7, quality: "Dominant 7th", roman: "V7" },
          { degree: 5, quality: "Minor", roman: "iv", subFor: "(approach)" },
          { degree: 0, quality: "Minor", roman: "i" },
        ],
      },
    ],
  },
]

const SUBSTITUTION_RULES: Record<string, SubstitutionRule[]> = {
  "I": [
    { replacementRoman: "iii", degree: 4, quality: "Minor", typeId: "diatonic", explanation: "iii shares 2 of 3 tones with I — same tonic function, lighter feel." },
    { replacementRoman: "vi", degree: 9, quality: "Minor", typeId: "diatonic", explanation: "vi is the relative minor — shares 2 of 3 tones with I." },
    { replacementRoman: "i", degree: 0, quality: "Minor", typeId: "parallel", explanation: "Parallel minor darkens the tonic — powerful moment in rock/pop." },
    { replacementRoman: "bVI", degree: 8, quality: "Major", typeId: "borrowed", explanation: "bVI borrowed from parallel minor adds unexpected warmth." },
  ],
  "ii": [
    { replacementRoman: "IV", degree: 5, quality: "Major", typeId: "diatonic", explanation: "IV has the same subdominant function as ii — more resolved feel." },
    { replacementRoman: "IVmaj7", degree: 5, quality: "Major 7th", typeId: "diatonic", explanation: "IVmaj7 expands the subdominant — jazz-friendly swap." },
  ],
  "ii7": [
    { replacementRoman: "IV", degree: 5, quality: "Major", typeId: "diatonic", explanation: "IV shares subdominant function with ii7." },
    { replacementRoman: "IVmaj7", degree: 5, quality: "Major 7th", typeId: "diatonic", explanation: "IVmaj7 is a richer subdominant colour — common in jazz." },
  ],
  "iii": [
    { replacementRoman: "I", degree: 0, quality: "Major", typeId: "diatonic", explanation: "iii has tonic function — can act as a lighter version of I." },
    { replacementRoman: "vi", degree: 9, quality: "Minor", typeId: "diatonic", explanation: "vi shares two notes with iii and sits in the same tonic area." },
  ],
  "iii7": [
    { replacementRoman: "Imaj7", degree: 0, quality: "Major 7th", typeId: "diatonic", explanation: "Imaj7 and iii7 share tonic function — iii7 is the more colourful version." },
    { replacementRoman: "vi7", degree: 9, quality: "Minor 7th", typeId: "diatonic", explanation: "vi7 and iii7 both sit in the tonic area and share common tones." },
  ],
  "IV": [
    { replacementRoman: "ii", degree: 2, quality: "Minor", typeId: "diatonic", explanation: "ii is the classic diatonic substitute for IV — same subdominant function." },
    { replacementRoman: "bVII", degree: 10, quality: "Major", typeId: "borrowed", explanation: "bVII borrowed from parallel minor — very common in rock." },
    { replacementRoman: "iv", degree: 5, quality: "Minor", typeId: "borrowed", explanation: "iv (minor IV) borrowed from parallel minor — dark and expressive." },
  ],
  "V": [
    { replacementRoman: "V7", degree: 7, quality: "Dominant 7th", typeId: "diatonic", explanation: "V7 strengthens the dominant pull by adding a tritone interval inside." },
    { replacementRoman: "vii°", degree: 11, quality: "Diminished", typeId: "diatonic", explanation: "vii° contains the tritone of V7 — same dominant function." },
  ],
  "V7": [
    { replacementRoman: "bII7", degree: 1, quality: "Dominant 7th", typeId: "tritone", explanation: "The tritone sub — shares guide tones with V7, bass moves by half-step into I." },
    { replacementRoman: "vii°", degree: 11, quality: "Diminished", typeId: "diatonic", explanation: "vii° shares the tritone of V7 and resolves identically to I." },
  ],
  "vi": [
    { replacementRoman: "I", degree: 0, quality: "Major", typeId: "relative", explanation: "vi is the relative minor of I — they are interchangeable in many contexts." },
    { replacementRoman: "IV", degree: 5, quality: "Major", typeId: "diatonic", explanation: "IV shares two notes with vi and can take subdominant function." },
    { replacementRoman: "VI", degree: 9, quality: "Major", typeId: "parallel", explanation: "VI (parallel major of vi) — brightens the submediant." },
  ],
  "vi7": [
    { replacementRoman: "Imaj7", degree: 0, quality: "Major 7th", typeId: "relative", explanation: "Imaj7 is the relative major of vi7 — shares the same three core tones." },
    { replacementRoman: "IV", degree: 5, quality: "Major", typeId: "diatonic", explanation: "IV shares two notes with vi and can take subdominant function." },
  ],
  "vii°": [
    { replacementRoman: "V7", degree: 7, quality: "Dominant 7th", typeId: "diatonic", explanation: "V7 and vii° share dominant function — V7 is the more stable option." },
    { replacementRoman: "bII7", degree: 1, quality: "Dominant 7th", typeId: "tritone", explanation: "Tritone of V7 — works if vii° was serving a dominant function." },
  ],
  "i": [
    { replacementRoman: "bIII", degree: 3, quality: "Major", typeId: "relative", explanation: "bIII is the relative major of i — swapping lightens the mood considerably." },
    { replacementRoman: "I", degree: 0, quality: "Major", typeId: "parallel", explanation: "Parallel major — same root, dramatically different feel." },
  ],
  "iv": [
    { replacementRoman: "bVI", degree: 8, quality: "Major", typeId: "relative", explanation: "bVI is the relative major of iv — shares the same three notes." },
    { replacementRoman: "ii°", degree: 2, quality: "Diminished", typeId: "diatonic", explanation: "ii° has subdominant function in minor — a darker alternative to iv." },
  ],
  "ii°": [
    { replacementRoman: "iv", degree: 5, quality: "Minor", typeId: "diatonic", explanation: "iv is the more straightforward subdominant in minor." },
    { replacementRoman: "bII7", degree: 1, quality: "Dominant 7th", typeId: "tritone", explanation: "If ii° was acting dominant, the tritone sub applies here." },
  ],
  "bVII": [
    { replacementRoman: "V", degree: 7, quality: "Major", typeId: "diatonic", explanation: "V is the diatonic dominant — more traditional resolution to I." },
    { replacementRoman: "bIII", degree: 3, quality: "Major", typeId: "borrowed", explanation: "bIII shares the borrowed-from-minor character and a softer rock feel." },
  ],
  "bVI": [
    { replacementRoman: "iv", degree: 5, quality: "Minor", typeId: "relative", explanation: "iv is the relative minor of bVI — they share the exact same three notes." },
  ],
  "bIII": [
    { replacementRoman: "i", degree: 0, quality: "Minor", typeId: "relative", explanation: "i is the relative minor of bIII — they share the same three notes." },
    { replacementRoman: "bVII", degree: 10, quality: "Major", typeId: "diatonic", explanation: "bVII shares the same natural minor character as bIII — smooth swap." },
  ],
  "I7": [
    { replacementRoman: "bVII7", degree: 10, quality: "Dominant 7th", typeId: "tritone", explanation: "In a blues context, the tritone sub of I7 creates chromatic bass movement." },
  ],
  "IV7": [
    { replacementRoman: "bVII7", degree: 10, quality: "Dominant 7th", typeId: "tritone", explanation: "Tritone sub of IV7 — the bass descends by half-step into the next chord." },
  ],
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ChordSubstitutions() {
  const [activeTab, setActiveTab] = useState<"learn" | "explorer" | "finder">("learn")
  const [selectedKey, setSelectedKey] = useState(0)
  const [explorerProgression, setExplorerProgression] = useState(0)
  const [explorerSubstitution, setExplorerSubstitution] = useState(0)
  const [showFretboard, setShowFretboard] = useState(false)
  const [finderProgression, setFinderProgression] = useState(0)
  const [selectedChordIndex, setSelectedChordIndex] = useState<number | null>(null)

  // ── Helpers ──────────────────────────────────────────────────────────────

  const getChordFromDegree = (semitones: number, quality: string) => {
    const noteIndex = (selectedKey + semitones) % 12
    return { note: KEYS[noteIndex], quality }
  }

  const getChordIntervals = (quality: string): number[] => {
    switch (quality) {
      case "Major":        return [0, 4, 7]
      case "Minor":        return [0, 3, 7]
      case "Dominant 7th": return [0, 4, 7, 10]
      case "Major 7th":    return [0, 4, 7, 11]
      case "Minor 7th":    return [0, 3, 7, 10]
      case "Diminished":   return [0, 3, 6]
      default:             return [0, 4, 7]
    }
  }

  const getNoteIndex = (note: string) => KEYS.indexOf(note)

  const resolveChordName = (degree: number, quality: string): string => {
    const { note } = getChordFromDegree(degree, quality)
    const root = note.split("/")[0]
    const suffix: Record<string, string> = {
      "Major": "", "Minor": "m", "Dominant 7th": "7",
      "Major 7th": "maj7", "Minor 7th": "m7", "Diminished": "°",
    }
    return `${root}${suffix[quality] ?? ""}`
  }

  const getSubstitutionsForChord = (roman: string): SubstitutionRule[] => {
    if (SUBSTITUTION_RULES[roman]) return SUBSTITUTION_RULES[roman]
    const stripped = roman.replace(/maj7|7$/, "")
    if (SUBSTITUTION_RULES[stripped]) return SUBSTITUTION_RULES[stripped]
    return []
  }

  // ── Derived ──────────────────────────────────────────────────────────────

  const explorerProg = PROGRESSIONS[explorerProgression]
  const currentSub = explorerProg.substitutions[explorerSubstitution]
  const finderProg = PROGRESSIONS[finderProgression]

  const tabs = [
    { id: "learn", label: "Learn", icon: "📖" },
    { id: "explorer", label: "Progression Explorer", icon: "🔄" },
    { id: "finder", label: "Substitution Finder", icon: "🔍" },
  ]

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-purple-300 hover:text-purple-200 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">Chord Substitutions</h1>
          <p className="text-purple-200">Transform progressions with advanced substitution techniques</p>
        </div>

        {/* Key Selector — always visible */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-sm font-semibold text-purple-300 uppercase tracking-wider">Key</h2>
            <span className="text-white font-bold">{KEYS[selectedKey]} Major</span>
          </div>
          <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
            {KEYS.map((key, index) => (
              <button
                key={index}
                onClick={() => setSelectedKey(index)}
                className={`py-2 px-1 rounded-lg font-semibold text-xs transition-all active:scale-95 ${
                  selectedKey === index
                    ? "bg-purple-600 text-white scale-105"
                    : "bg-white/20 text-purple-200 hover:bg-white/30"
                }`}
              >
                {key}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-5 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-purple-600 text-white"
                  : "bg-white/10 text-purple-200 hover:bg-white/20"
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ══════════ TAB: LEARN ══════════ */}
        {activeTab === "learn" && (
          <div className="space-y-6">

            {/* Plain-English Intro */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-3">What are Chord Substitutions?</h2>
              <p className="text-purple-200 text-sm leading-relaxed mb-4">
                A chord substitution is simply swapping one chord for another that serves the same harmonic role — but adds a different colour or feel. The music still makes sense to the ear, it just sounds richer or more unexpected.
              </p>
              <div className="bg-white/10 rounded-xl p-4 border-l-4 border-amber-400">
                <p className="text-amber-200 text-sm leading-relaxed">
                  <span className="font-semibold text-amber-300">Think of it like language.</span> "Happy" and "joyful" mean the same thing but feel different. Chord substitutions work the same way — swap a chord for one that plays the same harmonic role, but brings new colour to the moment.
                </p>
              </div>
            </div>

            {/* Why It Matters */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">Why Every Guitarist Should Know This</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { icon: "🎸", title: "Elevates simple progressions", body: "Turns a plain I-IV-V into something that sounds deliberate and professional — without playing faster or harder." },
                  { icon: "🎵", title: "Used in every genre", body: "From Beatles pop to jazz standards to R&B — substitutions are behind the moments that make you stop and think 'how did they do that?'" },
                  { icon: "🔄", title: "Reharmonize any song", body: "Take a song you already know and make it sound like your own. Change the chords, keep the melody — it still works." },
                  { icon: "🧠", title: "Deepens your ear", body: "Once you understand why substitutions work, you start hearing them everywhere. Your playing and listening both level up." },
                ].map((item) => (
                  <div key={item.title} className="bg-white/5 rounded-xl p-4 flex gap-3">
                    <span className="text-2xl shrink-0">{item.icon}</span>
                    <div>
                      <div className="text-white font-semibold text-sm mb-1">{item.title}</div>
                      <p className="text-purple-300 text-xs leading-relaxed">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Before / After Example */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-1">Hear the Difference</h2>
              <p className="text-purple-300 text-sm mb-5">Same progression, one chord swapped. That's all it takes.</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Plain version */}
                <div>
                  <div className="text-purple-400 text-xs font-semibold uppercase tracking-wider mb-3">Plain version</div>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      { name: "C", roman: "I" },
                      { name: "G", roman: "V" },
                      { name: "Am", roman: "vi" },
                      { name: "F", roman: "IV" },
                    ].map((chord) => (
                      <div key={chord.name} className="text-center">
                        <div className="bg-white/20 rounded-xl px-4 py-3 min-w-[60px]">
                          <div className="text-lg font-bold text-white">{chord.name}</div>
                          <div className="text-purple-300 text-xs">{chord.roman}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Substituted version */}
                <div>
                  <div className="text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">With substitution</div>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      { name: "Em", roman: "iii", subbed: true },
                      { name: "G", roman: "V", subbed: false },
                      { name: "Am", roman: "vi", subbed: false },
                      { name: "Bb", roman: "bVII", subbed: true },
                    ].map((chord) => (
                      <div key={chord.name} className="text-center">
                        <div className={`rounded-xl px-4 py-3 min-w-[60px] ${chord.subbed ? "bg-amber-600 ring-2 ring-amber-400" : "bg-white/20"}`}>
                          <div className="text-lg font-bold text-white">{chord.name}</div>
                          <div className={`text-xs ${chord.subbed ? "text-amber-200" : "text-purple-300"}`}>{chord.roman}</div>
                        </div>
                        {chord.subbed && <div className="text-amber-400 text-xs mt-1">↑ swapped</div>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                <p className="text-amber-200 text-sm leading-relaxed">
                  <span className="font-semibold">C → Em:</span> diatonic sub — Em shares two notes with C and sits in the same tonic area, but feels lighter and more forward-moving.
                  <span className="mx-2">·</span>
                  <span className="font-semibold">F → Bb:</span> borrowed chord — Bb isn't in the key of C but comes from the parallel minor, adding an unexpected dark warmth before resolving back.
                </p>
              </div>
            </div>

            {/* Learning Path Banner */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-5">Your Learning Path</h2>
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                {LEARNING_PATH.map((step, i) => (
                  <div key={step.level} className="flex sm:flex-col items-center gap-3 flex-1">
                    <div className={`${step.border} border rounded-xl p-4 w-full`}>
                      <div className={`${step.color} text-white text-xs font-bold px-2 py-1 rounded-full inline-block mb-2`}>
                        {step.level}
                      </div>
                      <ul className="space-y-1">
                        {step.techniques.map((t) => (
                          <li key={t} className={`${step.text} text-xs`}>• {t}</li>
                        ))}
                      </ul>
                    </div>
                    {i < LEARNING_PATH.length - 1 && (
                      <div className="text-purple-400 text-xl font-bold sm:rotate-0 rotate-90 shrink-0">→</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Substitution Type Cards */}
            <div className="space-y-4">
              {[...SUBSTITUTION_TYPES].sort((a, b) => a.difficultyOrder - b.difficultyOrder).map((type) => (
                <div key={type.id} className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20">
                  <div className="flex items-start gap-3 mb-3">
                    <span className={`${type.color} text-white px-3 py-1 rounded-full text-xs font-bold shrink-0`}>
                      {type.difficulty}
                    </span>
                    <h3 className="text-white font-bold text-lg leading-tight">{type.name}</h3>
                  </div>
                  <p className="text-purple-200 text-sm mb-2">{type.description}</p>
                  <p className="text-purple-300 text-sm mb-3">{type.explanation}</p>
                  <div className="bg-white/10 rounded-lg px-3 py-2 text-xs text-purple-200 font-mono">
                    Example: {type.example}
                  </div>
                </div>
              ))}
            </div>

            {/* Practice Tips */}
            <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
              <h3 className="text-xl font-bold text-white mb-4">Practice Tips</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-purple-200">
                {[
                  { title: "Start Simple", body: "Take a song you know and substitute just one chord. Listen to how it changes the feel before moving on." },
                  { title: "Use Your Ears", body: "Not all substitutions work in every context. Trust your ears — the style of music matters." },
                  { title: "Voice Leading", body: "Choose substitutions that allow smooth voice leading — minimal finger movement between chords." },
                  { title: "Study the Classics", body: "Jazz standards are full of sophisticated substitutions. Analyse them to see these techniques in action." },
                ].map((tip) => (
                  <div key={tip.title} className="bg-white/10 rounded-lg p-4">
                    <div className="font-semibold text-white mb-1">{tip.title}</div>
                    <p>{tip.body}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ══════════ TAB: PROGRESSION EXPLORER ══════════ */}
        {activeTab === "explorer" && (
          <div className="space-y-6">

            {/* Progression Selector */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20">
              <h2 className="text-lg font-bold text-white mb-3">Select Progression</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {PROGRESSIONS.map((prog, i) => (
                  <button
                    key={prog.id}
                    onClick={() => { setExplorerProgression(i); setExplorerSubstitution(0); setShowFretboard(false) }}
                    className={`text-left p-3 rounded-xl transition-all ${
                      explorerProgression === i
                        ? "bg-purple-600 text-white"
                        : "bg-white/10 text-purple-200 hover:bg-white/20"
                    }`}
                  >
                    <div className={`text-xs font-bold mb-1 ${explorerProgression === i ? "text-purple-200" : "text-purple-400"}`}>
                      {prog.genre}
                    </div>
                    <div className="text-sm font-semibold">{prog.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Substitution Picker */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20">
              <h2 className="text-lg font-bold text-white mb-3">Substitution Variant</h2>
              <div className="flex flex-wrap gap-2">
                {explorerProg.substitutions.map((sub, i) => {
                  const typeInfo = SUBSTITUTION_TYPES.find(t => t.id === sub.type)
                  return (
                    <button
                      key={i}
                      onClick={() => setExplorerSubstitution(i)}
                      className={`text-left px-4 py-2.5 rounded-xl transition-all ${
                        explorerSubstitution === i
                          ? "bg-amber-600 text-white"
                          : "bg-white/10 text-purple-200 hover:bg-white/20"
                      }`}
                    >
                      <div className="text-sm font-semibold">{sub.name}</div>
                      {typeInfo && (
                        <div className={`text-xs mt-0.5 ${explorerSubstitution === i ? "text-amber-200" : "text-purple-400"}`}>
                          {typeInfo.name}
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Side-by-Side Comparison */}
            <div className="grid lg:grid-cols-2 gap-4">

              {/* Original */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20">
                <div className="text-purple-300 text-xs font-semibold uppercase tracking-wider mb-3">Original</div>
                <div className="flex flex-wrap gap-3 justify-center mb-5">
                  {explorerProg.original.map((chord, i) => {
                    const name = resolveChordName(chord.degree, chord.quality)
                    return (
                      <div key={i} className="text-center">
                        <div className="bg-purple-600 rounded-xl px-4 py-3 min-w-[80px]">
                          <div className="text-xl font-bold text-white">{name}</div>
                          <div className="text-purple-200 text-xs mt-0.5">{chord.roman}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {explorerProg.original.map((chord, i) => {
                    const { note } = getChordFromDegree(chord.degree, chord.quality)
                    const shape = getChordShape(note.split("/")[0], chord.quality)
                    return shape ? (
                      <div key={i} className="flex flex-col items-center bg-white/5 rounded-xl p-3">
                        <ChordDiagram chordName={resolveChordName(chord.degree, chord.quality)} fingers={shape} size="medium" />
                        <div className="text-purple-300 text-xs mt-2">{chord.roman}</div>
                      </div>
                    ) : (
                      <div key={i} className="flex flex-col items-center justify-center bg-white/5 rounded-xl p-4 text-center">
                        <div className="text-xl font-bold text-white">{resolveChordName(chord.degree, chord.quality)}</div>
                        <div className="text-purple-400 text-xs">{chord.roman}</div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Substituted */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-amber-500/30">
                <div className="flex items-center gap-2 mb-3">
                  <div className="text-amber-300 text-xs font-semibold uppercase tracking-wider">Substituted</div>
                  <div className={`${SUBSTITUTION_TYPES.find(t => t.id === currentSub.type)?.color} text-white text-xs px-2 py-0.5 rounded-full`}>
                    {SUBSTITUTION_TYPES.find(t => t.id === currentSub.type)?.name}
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 justify-center mb-4">
                  {currentSub.chords.map((chord, i) => {
                    const name = resolveChordName(chord.degree, chord.quality)
                    const isSubstituted = !!chord.subFor
                    return (
                      <div key={i} className="text-center">
                        <div className={`rounded-xl px-4 py-3 min-w-[80px] ${isSubstituted ? "bg-amber-600 ring-2 ring-amber-400" : "bg-purple-600"}`}>
                          <div className="text-xl font-bold text-white">{name}</div>
                          <div className={`text-xs mt-0.5 ${isSubstituted ? "text-amber-200" : "text-purple-200"}`}>{chord.roman}</div>
                        </div>
                        {isSubstituted && (
                          <div className="text-amber-400 text-xs mt-1">↑ replaces {chord.subFor}</div>
                        )}
                      </div>
                    )
                  })}
                </div>
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 mb-4">
                  <p className="text-amber-200 text-sm">
                    {SUBSTITUTION_TYPES.find(t => t.id === currentSub.type)?.explanation}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentSub.chords.map((chord, i) => {
                    const { note } = getChordFromDegree(chord.degree, chord.quality)
                    const shape = getChordShape(note.split("/")[0], chord.quality)
                    const isSubstituted = !!chord.subFor
                    return shape ? (
                      <div key={i} className={`flex flex-col items-center rounded-xl p-3 ${isSubstituted ? "bg-amber-500/20 ring-1 ring-amber-400/50" : "bg-white/5"}`}>
                        <ChordDiagram chordName={resolveChordName(chord.degree, chord.quality)} fingers={shape} size="medium" />
                        <div className={`text-xs mt-2 ${isSubstituted ? "text-amber-300" : "text-purple-300"}`}>{chord.roman}</div>
                      </div>
                    ) : (
                      <div key={i} className={`flex flex-col items-center justify-center rounded-xl p-4 text-center ${isSubstituted ? "bg-amber-500/20 ring-1 ring-amber-400/50" : "bg-white/5"}`}>
                        <div className="text-xl font-bold text-white">{resolveChordName(chord.degree, chord.quality)}</div>
                        <div className={`text-xs ${isSubstituted ? "text-amber-300" : "text-purple-400"}`}>{chord.roman}</div>
                      </div>
                    )
                  })}
                </div>
              </div>

            </div>

            {/* Fretboard Toggle */}
            <div>
              <button
                onClick={() => setShowFretboard(!showFretboard)}
                className="w-full py-3 px-5 bg-white/10 hover:bg-white/20 text-purple-200 hover:text-white rounded-xl border border-white/20 transition-all text-sm font-medium"
              >
                {showFretboard ? "▲ Hide Full Fretboard View" : "▼ Show Full Fretboard View"}
              </button>
            </div>

            {showFretboard && (
              <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10 space-y-8">
                <h3 className="text-lg font-bold text-white">Full Fretboard — Substituted Progression</h3>
                {currentSub.chords.map((chord, i) => {
                  const { note } = getChordFromDegree(chord.degree, chord.quality)
                  const noteIndex = getNoteIndex(note)
                  if (noteIndex === -1) return null
                  return (
                    <div key={i} className="bg-white/5 rounded-xl p-5">
                      <div className="text-purple-300 text-sm mb-3">
                        {resolveChordName(chord.degree, chord.quality)} — {chord.roman}
                        {chord.subFor && <span className="text-amber-300"> (replaces {chord.subFor})</span>}
                      </div>
                      <FullChordFretboard
                        chordName={resolveChordName(chord.degree, chord.quality)}
                        rootNoteIndex={noteIndex}
                        intervals={getChordIntervals(chord.quality)}
                        showNoteNames={true}
                      />
                    </div>
                  )
                })}
              </div>
            )}

          </div>
        )}

        {/* ══════════ TAB: SUBSTITUTION FINDER ══════════ */}
        {activeTab === "finder" && (
          <div className="space-y-6">

            {/* Instructions */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl px-5 py-4">
              <div className="text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">💡 How to use</div>
              <p className="text-amber-200 text-sm">Select a progression below, then tap any chord to see all valid substitutions for that specific chord — with explanations and diagrams.</p>
            </div>

            {/* Progression Selector (genre pills) */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20">
              <h2 className="text-lg font-bold text-white mb-3">Choose a Progression</h2>
              <div className="flex flex-wrap gap-2">
                {PROGRESSIONS.map((prog, i) => (
                  <button
                    key={prog.id}
                    onClick={() => { setFinderProgression(i); setSelectedChordIndex(null) }}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      finderProgression === i
                        ? "bg-purple-600 text-white"
                        : "bg-white/10 text-purple-200 hover:bg-white/20"
                    }`}
                  >
                    <span className="opacity-60 text-xs mr-1">{prog.genre}</span>
                    {prog.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Clickable Chord Row */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20">
              <h2 className="text-lg font-bold text-white mb-4">
                {finderProg.name} <span className="text-purple-400 font-normal text-sm">in {KEYS[selectedKey]}</span>
              </h2>
              <div className="flex flex-wrap gap-4 justify-center">
                {finderProg.original.map((chord, i) => {
                  const isSelected = selectedChordIndex === i
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedChordIndex(i === selectedChordIndex ? null : i)}
                      className={`rounded-xl p-4 min-w-[90px] text-center transition-all ${
                        isSelected
                          ? "bg-amber-600 ring-2 ring-amber-400 scale-110"
                          : "bg-white/20 hover:bg-white/30 hover:scale-105"
                      }`}
                    >
                      <div className="text-2xl font-bold text-white">{resolveChordName(chord.degree, chord.quality)}</div>
                      <div className={`text-xs mt-1 ${isSelected ? "text-amber-200" : "text-purple-300"}`}>{chord.roman}</div>
                    </button>
                  )
                })}
              </div>
              {selectedChordIndex === null && (
                <p className="text-center text-purple-400 text-sm mt-4">↑ Tap a chord to explore substitutions</p>
              )}
            </div>

            {/* Substitution Panel */}
            {selectedChordIndex !== null && (() => {
              const chord = finderProg.original[selectedChordIndex]
              const subs = getSubstitutionsForChord(chord.roman)
              const chordName = resolveChordName(chord.degree, chord.quality)
              return (
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-amber-500/30">
                  <h3 className="text-white font-bold text-lg mb-1">
                    Substitutions for <span className="text-amber-300">{chordName}</span>
                    <span className="text-purple-400 font-normal text-sm ml-2">({chord.roman})</span>
                  </h3>
                  <p className="text-purple-300 text-sm mb-5">
                    {subs.length} substitution{subs.length !== 1 ? "s" : ""} available
                  </p>

                  {subs.length === 0 ? (
                    <p className="text-purple-400 text-sm">No substitutions defined for this chord yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {subs.map((sub, i) => {
                        const typeInfo = SUBSTITUTION_TYPES.find(t => t.id === sub.typeId)
                        const { note } = getChordFromDegree(sub.degree, sub.quality)
                        const replacementName = resolveChordName(sub.degree, sub.quality)
                        const shape = getChordShape(note.split("/")[0], sub.quality)

                        return (
                          <div key={i} className="bg-white/10 rounded-xl p-4 flex gap-4 items-start">
                            {/* Mini diagram */}
                            <div className="shrink-0">
                              {shape ? (
                                <ChordDiagram chordName={replacementName} fingers={shape} size="small" />
                              ) : (
                                <div className="w-16 h-20 bg-white/5 rounded-lg flex items-center justify-center">
                                  <span className="text-white font-bold text-sm">{replacementName}</span>
                                </div>
                              )}
                            </div>
                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span className="text-2xl font-bold text-white">{replacementName}</span>
                                <span className="text-purple-300 text-sm">({sub.replacementRoman})</span>
                                {typeInfo && (
                                  <span className={`${typeInfo.color} text-white text-xs px-2 py-0.5 rounded-full`}>
                                    {typeInfo.name}
                                  </span>
                                )}
                                {typeInfo && (
                                  <span className="text-purple-400 text-xs">{typeInfo.difficulty}</span>
                                )}
                              </div>
                              <p className="text-purple-200 text-sm leading-relaxed">{sub.explanation}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })()}

          </div>
        )}

      </div>
    </div>
  )
}
