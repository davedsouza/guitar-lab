"use client"

import { useState } from "react"
import Link from "next/link"
import ChordDiagram from "@/components/ChordDiagram"
import { getChordShape } from "@/lib/chordShapes"

const KEYS = ["C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B"]

// Keys where flat spellings are preferred
const FLAT_KEY_INDICES = new Set([1, 3, 5, 8, 10])

// ─── Types ────────────────────────────────────────────────────────────────────

type ChordQuality = "Major" | "Minor" | "Dominant" | "Minor 7th" | "Major 7th" | "Diminished"
type Genre = "Pop" | "Soul" | "Classic Rock" | "Country" | "Jazz" | "Blues"
type Difficulty = "Beginner" | "Intermediate" | "Advanced"

interface ChordSlot {
  roman: string
  semitones: number
  quality: ChordQuality
}

interface RecommendedScale {
  name: string
  why: string
}

interface Song {
  id: string
  title: string
  artist: string
  genre: Genre
  difficulty: Difficulty
  originalKey: number
  displayKey: string
  progression: ChordSlot[]
  theoryCallout: string
  relatedModules: { href: string; label: string }[]
  recommendedScales: RecommendedScale[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getQualitySuffix(quality: ChordQuality): string {
  switch (quality) {
    case "Minor": return "m"
    case "Dominant": return "7"
    case "Minor 7th": return "m7"
    case "Major 7th": return "maj7"
    case "Diminished": return "°"
    default: return ""
  }
}

function getNoteSpelling(noteIndex: number, activeKey: number): string {
  const note = KEYS[noteIndex]
  if (!note.includes("/")) return note
  const [sharp, flat] = note.split("/")
  return FLAT_KEY_INDICES.has(activeKey) ? flat : sharp
}

function getVoicingsQuality(quality: ChordQuality): string {
  switch (quality) {
    case "Dominant": return "Dominant 7th"
    case "Minor 7th": return "Minor 7th"
    case "Major 7th": return "Major 7th"
    case "Diminished": return "Diminished"
    case "Minor": return "Minor"
    default: return "Major"
  }
}

function getChordName(semitones: number, quality: ChordQuality, selectedKey: number): string {
  const noteIndex = (selectedKey + semitones) % 12
  const rootNote = getNoteSpelling(noteIndex, selectedKey)
  return rootNote + getQualitySuffix(quality)
}

// ─── Song Data ────────────────────────────────────────────────────────────────

const SONGS: Song[] = [
  // ── Original 8 songs ──
  {
    id: "let-her-go",
    title: "Let Her Go",
    artist: "Passenger",
    genre: "Pop",
    difficulty: "Beginner",
    originalKey: 0,
    displayKey: "C",
    progression: [
      { roman: "I", semitones: 0, quality: "Major" },
      { roman: "V", semitones: 7, quality: "Major" },
      { roman: "vi", semitones: 9, quality: "Minor" },
      { roman: "IV", semitones: 5, quality: "Major" },
    ],
    theoryCallout: "I–V–vi–IV is pop music's most-used formula. The vi chord (relative minor) adds emotional pull before resolving back home to I. You'll hear this in hundreds of hits.",
    relatedModules: [
      { href: "/progressions", label: "Chord Progressions" },
      { href: "/nashville-number-system", label: "Nashville Numbers" },
    ],
    recommendedScales: [
      { name: "Major", why: "All chords are diatonic — the major scale covers the whole song" },
      { name: "Pentatonic Major", why: "5-note shortcut, zero clashes, instantly melodic" },
    ],
  },
  {
    id: "stand-by-me",
    title: "Stand By Me",
    artist: "Ben E. King",
    genre: "Soul",
    difficulty: "Beginner",
    originalKey: 0,
    displayKey: "C",
    progression: [
      { roman: "I", semitones: 0, quality: "Major" },
      { roman: "vi", semitones: 9, quality: "Minor" },
      { roman: "IV", semitones: 5, quality: "Major" },
      { roman: "V", semitones: 7, quality: "Major" },
    ],
    theoryCallout: "The 50s progression I–vi–IV–V creates a timeless circular feel. The vi chord (relative minor) shares two notes with the I chord — it's the smoothest possible move away from home.",
    relatedModules: [
      { href: "/progressions", label: "Chord Progressions" },
    ],
    recommendedScales: [
      { name: "Major", why: "Pure major key — the major scale covers all four chords" },
      { name: "Pentatonic Major", why: "Works over every chord, very singable melodic lines" },
    ],
  },
  {
    id: "house-of-the-rising-sun",
    title: "House of the Rising Sun",
    artist: "The Animals",
    genre: "Classic Rock",
    difficulty: "Intermediate",
    originalKey: 9,
    displayKey: "Am",
    progression: [
      { roman: "i", semitones: 0, quality: "Minor" },
      { roman: "♭III", semitones: 3, quality: "Major" },
      { roman: "IV", semitones: 5, quality: "Major" },
      { roman: "♭VI", semitones: 8, quality: "Major" },
      { roman: "i", semitones: 0, quality: "Minor" },
      { roman: "V", semitones: 7, quality: "Major" },
    ],
    theoryCallout: "Natural minor (Aeolian) key. The ♭III and ♭VI chords belong to the natural minor scale — they give it that brooding, cinematic quality that defines so much classic rock.",
    relatedModules: [
      { href: "/scales", label: "Guitar Scales" },
      { href: "/music-theory", label: "Music Theory" },
    ],
    recommendedScales: [
      { name: "Natural Minor", why: "The ♭III and ♭VI are pure Aeolian — this is natural minor's home" },
      { name: "Pentatonic Minor", why: "Removes the tension tones for a bluesy, singable sound" },
    ],
  },
  {
    id: "jolene",
    title: "Jolene",
    artist: "Dolly Parton",
    genre: "Country",
    difficulty: "Beginner",
    originalKey: 9,
    displayKey: "Am",
    progression: [
      { roman: "i", semitones: 0, quality: "Minor" },
      { roman: "♭III", semitones: 3, quality: "Major" },
      { roman: "IV", semitones: 5, quality: "Major" },
      { roman: "♭VI", semitones: 8, quality: "Major" },
    ],
    theoryCallout: "Minor key with ♭III and ♭VI gives country its longing, heartfelt quality. Notice this is the same harmonic formula as House of the Rising Sun — different genre, same emotional architecture.",
    relatedModules: [
      { href: "/chord-builder", label: "Chord Builder" },
    ],
    recommendedScales: [
      { name: "Natural Minor", why: "All chords come from the natural minor scale" },
      { name: "Pentatonic Minor", why: "Country picking lines sit perfectly in the minor pentatonic box" },
    ],
  },
  {
    id: "sweet-home-alabama",
    title: "Sweet Home Alabama",
    artist: "Lynyrd Skynyrd",
    genre: "Classic Rock",
    difficulty: "Beginner",
    originalKey: 2,
    displayKey: "D",
    progression: [
      { roman: "I", semitones: 0, quality: "Major" },
      { roman: "♭VII", semitones: 10, quality: "Major" },
      { roman: "IV", semitones: 5, quality: "Major" },
    ],
    theoryCallout: "The ♭VII chord is a Mixolydian move — borrowed from the scale built on the 5th degree. In D that's C major (♭VII). It's what gives Southern Rock its loose, swaggering feel.",
    relatedModules: [
      { href: "/scales", label: "Guitar Scales" },
      { href: "/chord-substitutions", label: "Chord Substitutions" },
    ],
    recommendedScales: [
      { name: "Mixolydian", why: "The ♭VII chord is the signature of Mixolydian mode — this scale nails it" },
      { name: "Pentatonic Major", why: "Safe and bluesy across all three chords" },
    ],
  },
  {
    id: "fly-me-to-the-moon",
    title: "Fly Me to the Moon",
    artist: "Frank Sinatra",
    genre: "Jazz",
    difficulty: "Intermediate",
    originalKey: 9,
    displayKey: "Am",
    progression: [
      { roman: "i", semitones: 0, quality: "Minor" },
      { roman: "iv", semitones: 5, quality: "Minor" },
      { roman: "♭VII7", semitones: 10, quality: "Dominant" },
      { roman: "♭III", semitones: 3, quality: "Major" },
    ],
    theoryCallout: "A descending circle-of-fifths movement. Each chord is a fifth below the last — i→iv→♭VII→♭III. This falling-fifths motion is one of jazz's most powerful harmonic engines.",
    relatedModules: [
      { href: "/nashville-number-system", label: "Nashville Numbers" },
      { href: "/chord-substitutions", label: "Chord Substitutions" },
    ],
    recommendedScales: [
      { name: "Natural Minor", why: "The i, iv and ♭III all come from natural minor" },
      { name: "Dorian", why: "Over the iv and ♭VII7 chords, Dorian's natural 6 adds a jazzier colour" },
    ],
  },
  {
    id: "wish-you-were-here",
    title: "Wish You Were Here",
    artist: "Pink Floyd",
    genre: "Classic Rock",
    difficulty: "Intermediate",
    originalKey: 7,
    displayKey: "G",
    progression: [
      { roman: "I", semitones: 0, quality: "Major" },
      { roman: "IV", semitones: 5, quality: "Major" },
      { roman: "ii", semitones: 2, quality: "Minor" },
      { roman: "I", semitones: 0, quality: "Major" },
    ],
    theoryCallout: "Purely diatonic — all chords belong to G major. The ii chord (Am in G) creates gentle tension before returning home. Pink Floyd prove that simplicity and space create the most lasting emotion.",
    relatedModules: [
      { href: "/chord-builder", label: "Chord Builder" },
      { href: "/progressions", label: "Chord Progressions" },
    ],
    recommendedScales: [
      { name: "Major", why: "100% diatonic major — one scale fits every chord perfectly" },
      { name: "Pentatonic Major", why: "Pink Floyd's tone lives in the major pentatonic warmth" },
    ],
  },
  {
    id: "autumn-leaves",
    title: "Autumn Leaves",
    artist: "Jazz Standard",
    genre: "Jazz",
    difficulty: "Advanced",
    originalKey: 7,
    displayKey: "G / Em",
    progression: [
      { roman: "ii", semitones: 2, quality: "Minor" },
      { roman: "V7", semitones: 7, quality: "Dominant" },
      { roman: "I", semitones: 0, quality: "Major" },
      { roman: "IV", semitones: 5, quality: "Major" },
    ],
    theoryCallout: "The ii–V7–I is the single most important movement in jazz. The V7 creates a tritone interval (3 whole steps) that aches to resolve to I. Mastering this pattern unlocks hundreds of jazz standards.",
    relatedModules: [
      { href: "/chord-substitutions", label: "Chord Substitutions" },
      { href: "/nashville-number-system", label: "Nashville Numbers" },
    ],
    recommendedScales: [
      { name: "Major", why: "The ii–V–I is the core of major key jazz harmony" },
      { name: "Dorian", why: "Play Dorian over the ii chord for a distinctly jazzy flavour" },
    ],
  },

  // ── New songs ──
  {
    id: "knockin-on-heavens-door",
    title: "Knockin' on Heaven's Door",
    artist: "Bob Dylan",
    genre: "Classic Rock",
    difficulty: "Beginner",
    originalKey: 7,
    displayKey: "G",
    progression: [
      { roman: "I", semitones: 0, quality: "Major" },
      { roman: "V", semitones: 7, quality: "Major" },
      { roman: "ii", semitones: 2, quality: "Minor" },
      { roman: "IV", semitones: 5, quality: "Major" },
    ],
    theoryCallout: "I–V–ii–IV substitutes Am (ii) where most songs use Em (vi). Both are minor chords in G, but ii shares two notes with IV, creating a more searching, world-weary quality — perfect for Dylan's lyrical mood.",
    relatedModules: [
      { href: "/progressions", label: "Chord Progressions" },
      { href: "/chord-substitutions", label: "Chord Substitutions" },
    ],
    recommendedScales: [
      { name: "Major", why: "All chords are diatonic to G major — one scale covers everything" },
      { name: "Pentatonic Major", why: "Simple, singable lines that sit perfectly over the rhythm" },
    ],
  },
  {
    id: "nothing-else-matters",
    title: "Nothing Else Matters",
    artist: "Metallica",
    genre: "Classic Rock",
    difficulty: "Intermediate",
    originalKey: 4,
    displayKey: "Em",
    progression: [
      { roman: "i", semitones: 0, quality: "Minor" },
      { roman: "♭VI", semitones: 8, quality: "Major" },
      { roman: "♭III", semitones: 3, quality: "Major" },
      { roman: "♭VII", semitones: 10, quality: "Major" },
    ],
    theoryCallout: "Pure natural minor (Aeolian). The ♭VI–♭III–♭VII triad — C, G, D in E minor — are the three borrowed major chords that give minor-key rock its cinematic power. You'll find this exact movement in power ballads across every decade.",
    relatedModules: [
      { href: "/scales", label: "Guitar Scales" },
      { href: "/music-theory", label: "Music Theory" },
    ],
    recommendedScales: [
      { name: "Natural Minor", why: "The ♭VI–♭III–♭VII are pure Aeolian — natural minor is the home scale here" },
      { name: "Pentatonic Minor", why: "Hendrix-style minor pentatonic phrases work beautifully over all four chords" },
    ],
  },
  {
    id: "hotel-california",
    title: "Hotel California",
    artist: "Eagles",
    genre: "Classic Rock",
    difficulty: "Advanced",
    originalKey: 11,
    displayKey: "Bm",
    progression: [
      { roman: "i", semitones: 0, quality: "Minor" },
      { roman: "V", semitones: 7, quality: "Major" },
      { roman: "♭VII", semitones: 10, quality: "Major" },
      { roman: "IV", semitones: 5, quality: "Major" },
      { roman: "♭VI", semitones: 8, quality: "Major" },
      { roman: "♭III", semitones: 3, quality: "Major" },
      { roman: "iv", semitones: 5, quality: "Minor" },
      { roman: "V", semitones: 7, quality: "Major" },
    ],
    theoryCallout: "One of rock's most harmonically complete progressions — it cycles through nearly all chords in B natural minor. The major V (F#) is borrowed from harmonic minor, giving it an exotic Spanish/classical quality. Joe Walsh's iconic solo is improvised over this exact cycle.",
    relatedModules: [
      { href: "/scales", label: "Guitar Scales" },
      { href: "/chord-substitutions", label: "Chord Substitutions" },
    ],
    recommendedScales: [
      { name: "Natural Minor", why: "The full diatonic minor scale handles the ♭VI, ♭III, and iv chords perfectly" },
      { name: "Pentatonic Minor", why: "Start here — then add the ♭6 and ♭7 for the full Aeolian flavour" },
    ],
  },
  {
    id: "hey-joe",
    title: "Hey Joe",
    artist: "Jimi Hendrix",
    genre: "Blues",
    difficulty: "Intermediate",
    originalKey: 4,
    displayKey: "E",
    progression: [
      { roman: "♭VI", semitones: 8, quality: "Major" },
      { roman: "♭III", semitones: 3, quality: "Major" },
      { roman: "♭VII", semitones: 10, quality: "Major" },
      { roman: "IV", semitones: 5, quality: "Major" },
      { roman: "I", semitones: 0, quality: "Major" },
    ],
    theoryCallout: "Five consecutive major chords descending in perfect 4ths: C–G–D–A–E. Each chord is a fifth below the last — an unstoppable gravitational pull to E. The ♭VI and ♭III point toward E Mixolydian, giving the song its simultaneously dark and triumphant blues-rock character.",
    relatedModules: [
      { href: "/scales", label: "Guitar Scales" },
      { href: "/progressions", label: "Chord Progressions" },
    ],
    recommendedScales: [
      { name: "Mixolydian", why: "The ♭VII chord (D) is the signature move of Mixolydian — this mode nails the Hendrix vibe" },
      { name: "Blues", why: "Hendrix's iconic bends and vibrato come from layering blues notes over Mixolydian" },
    ],
  },
  {
    id: "creep",
    title: "Creep",
    artist: "Radiohead",
    genre: "Pop",
    difficulty: "Beginner",
    originalKey: 7,
    displayKey: "G",
    progression: [
      { roman: "I", semitones: 0, quality: "Major" },
      { roman: "III", semitones: 4, quality: "Major" },
      { roman: "IV", semitones: 5, quality: "Major" },
      { roman: "iv", semitones: 5, quality: "Minor" },
    ],
    theoryCallout: "The B major chord (III — not the diatonic Bm) is a secondary dominant that briefly tonicises C. Then the chromatic drop from C major to C minor (IV→iv) is the emotional gut-punch that defines the chorus. Minor plagal motion (IV→iv) creates an unstoppable sense of dissolution.",
    relatedModules: [
      { href: "/chord-substitutions", label: "Chord Substitutions" },
      { href: "/music-theory", label: "Music Theory" },
    ],
    recommendedScales: [
      { name: "Major", why: "Works over G, C, and Cm — treat the B chord as a brief passing moment" },
      { name: "Pentatonic Major", why: "Avoids the chromatic tension notes — smooth over the whole loop" },
    ],
  },
  {
    id: "hallelujah",
    title: "Hallelujah",
    artist: "Leonard Cohen",
    genre: "Pop",
    difficulty: "Intermediate",
    originalKey: 0,
    displayKey: "C",
    progression: [
      { roman: "I", semitones: 0, quality: "Major" },
      { roman: "vi", semitones: 9, quality: "Minor" },
      { roman: "IV", semitones: 5, quality: "Major" },
      { roman: "V", semitones: 7, quality: "Major" },
    ],
    theoryCallout: "I–vi–IV–V is the 50s progression — the same DNA as Stand By Me. Cohen's arrangement adds an E7 (secondary dominant, V/vi) that briefly treats Am as a temporary home, giving the vi chord far more emotional weight than usual. Tiny move, enormous impact.",
    relatedModules: [
      { href: "/progressions", label: "Chord Progressions" },
      { href: "/nashville-number-system", label: "Nashville Numbers" },
    ],
    recommendedScales: [
      { name: "Major", why: "Purely diatonic — the C major scale covers every chord" },
      { name: "Pentatonic Major", why: "The folk-pop fingerpicking feel lives in the major pentatonic" },
    ],
  },
  {
    id: "brown-eyed-girl",
    title: "Brown Eyed Girl",
    artist: "Van Morrison",
    genre: "Soul",
    difficulty: "Beginner",
    originalKey: 7,
    displayKey: "G",
    progression: [
      { roman: "I", semitones: 0, quality: "Major" },
      { roman: "IV", semitones: 5, quality: "Major" },
      { roman: "I", semitones: 0, quality: "Major" },
      { roman: "V", semitones: 7, quality: "Major" },
    ],
    theoryCallout: "Pure I–IV–I–V — the oldest rock and roll formula. Just the three primary chords, no colour. The secret of Brown Eyed Girl's joy isn't harmonic complexity, it's rhythmic momentum. Master these three chords and you can play hundreds of classics from every decade.",
    relatedModules: [
      { href: "/progressions", label: "Chord Progressions" },
      { href: "/beginner", label: "Beginner Module" },
    ],
    recommendedScales: [
      { name: "Major", why: "Three primary chords — the major scale is completely at home here" },
      { name: "Pentatonic Major", why: "This is the perfect I–IV–V practice ground for pentatonic solos" },
    ],
  },
  {
    id: "comfortably-numb",
    title: "Comfortably Numb",
    artist: "Pink Floyd",
    genre: "Classic Rock",
    difficulty: "Advanced",
    originalKey: 11,
    displayKey: "Bm",
    progression: [
      { roman: "i", semitones: 0, quality: "Minor" },
      { roman: "♭VII", semitones: 10, quality: "Major" },
      { roman: "♭VI", semitones: 8, quality: "Major" },
      { roman: "iv", semitones: 5, quality: "Minor" },
    ],
    theoryCallout: "The descending natural minor sequence i–♭VII–♭VI–iv is one of rock's most cinematic movements. In B minor: Bm–A–G–Em — gravity pulling you down the scale. Gilmour's legendary solo sits in the chorus's D major key, creating one of music's great contrasts: a major-key oasis inside a minor-key song.",
    relatedModules: [
      { href: "/scales", label: "Guitar Scales" },
      { href: "/music-theory", label: "Music Theory" },
    ],
    recommendedScales: [
      { name: "Natural Minor", why: "The descending i–♭VII–♭VI–iv motion is pure Aeolian — natural minor is essential here" },
      { name: "Pentatonic Minor", why: "Gilmour's verse tone is rooted in minor pentatonic with added ♭6 colour tones" },
    ],
  },
]

// ─── Badge Styles ─────────────────────────────────────────────────────────────

const GENRE_COLORS: Record<Genre, string> = {
  Pop: "bg-blue-600 text-white",
  Soul: "bg-orange-600 text-white",
  "Classic Rock": "bg-red-600 text-white",
  Country: "bg-yellow-600 text-white",
  Jazz: "bg-purple-700 text-white",
  Blues: "bg-indigo-700 text-white",
}

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  Beginner: "bg-green-600 text-white",
  Intermediate: "bg-amber-600 text-white",
  Advanced: "bg-red-700 text-white",
}

const GENRES: (Genre | "All")[] = ["All", "Pop", "Soul", "Classic Rock", "Country", "Jazz", "Blues"]
const DIFFICULTIES: (Difficulty | "All")[] = ["All", "Beginner", "Intermediate", "Advanced"]

// ─── Component ────────────────────────────────────────────────────────────────

export default function SongLibrary() {
  const [selectedKey, setSelectedKey] = useState(0)
  const [genreFilter, setGenreFilter] = useState<Genre | "All">("All")
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | "All">("All")
  const [expandedSongIds, setExpandedSongIds] = useState<Set<string>>(new Set())

  const toggleExpand = (id: string) => {
    setExpandedSongIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const filteredSongs = SONGS.filter(s => {
    if (genreFilter !== "All" && s.genre !== genreFilter) return false
    if (difficultyFilter !== "All" && s.difficulty !== difficultyFilter) return false
    return true
  })

  const isFiltered = genreFilter !== "All" || difficultyFilter !== "All"

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-purple-300 hover:text-purple-200 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">Song Library</h1>
          <p className="text-purple-200">Real songs with chord diagrams, scales to solo over, and theory insights. Transpose to any key instantly.</p>
        </div>

        {/* Key Selector */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20 mb-5">
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-sm font-semibold text-purple-300 uppercase tracking-wider">Transpose to Key</h2>
            <span className="text-white font-bold">{KEYS[selectedKey]}</span>
            {selectedKey !== 0 && (
              <button
                onClick={() => setSelectedKey(0)}
                className="text-purple-400 hover:text-purple-200 text-xs underline transition-colors"
              >
                reset
              </button>
            )}
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

        {/* Filters */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 mb-5">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="text-purple-400 text-xs font-semibold uppercase tracking-wider mb-2">Genre</div>
              <div className="flex flex-wrap gap-2">
                {GENRES.map(g => (
                  <button
                    key={g}
                    onClick={() => setGenreFilter(g)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all active:scale-95 ${
                      genreFilter === g
                        ? "bg-purple-600 text-white"
                        : "bg-white/10 text-purple-200 hover:bg-white/20"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div className="w-px bg-white/20 hidden sm:block" />
            <div className="flex-1">
              <div className="text-purple-400 text-xs font-semibold uppercase tracking-wider mb-2">Difficulty</div>
              <div className="flex flex-wrap gap-2">
                {DIFFICULTIES.map(d => (
                  <button
                    key={d}
                    onClick={() => setDifficultyFilter(d)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all active:scale-95 ${
                      difficultyFilter === d
                        ? "bg-purple-600 text-white"
                        : "bg-white/10 text-purple-200 hover:bg-white/20"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Count bar */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-purple-400 text-sm">
            {isFiltered
              ? `${filteredSongs.length} of ${SONGS.length} songs`
              : `${SONGS.length} songs`}
          </p>
          {isFiltered && (
            <button
              onClick={() => { setGenreFilter("All"); setDifficultyFilter("All") }}
              className="text-purple-400 hover:text-purple-200 text-xs underline transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Song Grid */}
        {filteredSongs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredSongs.map(song => {
              const isExpanded = expandedSongIds.has(song.id)
              const isTransposed = selectedKey !== song.originalKey

              return (
                <div
                  key={song.id}
                  className={`bg-white/10 backdrop-blur-lg rounded-2xl border transition-all ${
                    isExpanded ? "border-purple-400/50 bg-white/12" : "border-white/20"
                  }`}
                >
                  {/* Card body */}
                  <div className="p-5">
                    {/* Title row */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-white leading-tight">{song.title}</h3>
                        <p className="text-purple-400 text-sm">{song.artist}</p>
                      </div>
                      <div className="flex flex-col gap-1.5 shrink-0 items-end">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${GENRE_COLORS[song.genre]}`}>
                          {song.genre}
                        </span>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${DIFFICULTY_COLORS[song.difficulty]}`}>
                          {song.difficulty}
                        </span>
                      </div>
                    </div>

                    {/* Key context */}
                    <div className="flex items-center gap-2 mb-3 text-xs">
                      <span className="text-purple-400">Original key:</span>
                      <span className="text-purple-200 font-semibold">{song.displayKey}</span>
                      {isTransposed && (
                        <>
                          <span className="text-purple-600">→</span>
                          <span className="text-amber-400 font-semibold">Showing in {KEYS[selectedKey]}</span>
                        </>
                      )}
                    </div>

                    {/* Roman + chord name rows */}
                    <div className="bg-white/5 rounded-xl p-3 mb-4">
                      <div className="flex flex-wrap gap-2">
                        {song.progression.map((slot, i) => (
                          <div key={i} className="text-center min-w-[48px]">
                            <div className="text-purple-400 text-xs mb-1">{slot.roman}</div>
                            <div className="bg-purple-600/50 text-white text-sm font-bold px-2 py-1.5 rounded-lg">
                              {getChordName(slot.semitones, slot.quality, selectedKey)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Toggle button */}
                    <button
                      onClick={() => toggleExpand(song.id)}
                      className="w-full bg-white/10 hover:bg-white/20 active:bg-white/25 text-purple-200 text-sm font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      {isExpanded ? (
                        <><span className="text-xs">▲</span> Hide Details</>
                      ) : (
                        <><span className="text-xs">▼</span> Diagrams, Scales &amp; Theory</>
                      )}
                    </button>
                  </div>

                  {/* Expanded panel */}
                  {isExpanded && (
                    <div className="border-t border-white/10 p-5 space-y-5">
                      {/* Chord Diagrams */}
                      <div>
                        <h4 className="text-sm font-semibold text-purple-300 uppercase tracking-wider mb-3">Chord Diagrams</h4>
                        <div className="flex flex-wrap gap-3">
                          {song.progression
                            .filter((slot, i, arr) =>
                              arr.findIndex(s => s.semitones === slot.semitones && s.quality === slot.quality) === i
                            )
                            .map((slot, i) => {
                              const noteIndex = (selectedKey + slot.semitones) % 12
                              const rootNoteForLookup = KEYS[noteIndex].split("/")[0]
                              const voicingQuality = getVoicingsQuality(slot.quality)
                              const shape = getChordShape(rootNoteForLookup, voicingQuality, 0)
                              const chordLabel = getChordName(slot.semitones, slot.quality, selectedKey)
                              return shape ? (
                                <div key={i} className="flex flex-col items-center bg-white/5 rounded-xl p-3">
                                  <ChordDiagram chordName={chordLabel} fingers={shape} size="medium" />
                                  <div className="text-white text-xs mt-1.5 font-bold">{chordLabel}</div>
                                  <div className="text-purple-500 text-xs">{slot.roman}</div>
                                </div>
                              ) : (
                                <div key={i} className="flex flex-col items-center justify-center bg-white/5 border border-dashed border-white/20 rounded-xl p-4 min-w-[64px] text-center">
                                  <div className="text-white font-bold text-base mb-1">{chordLabel}</div>
                                  <div className="text-purple-400 text-xs">{slot.roman}</div>
                                  <div className="text-purple-600 text-xs mt-1">diagram<br/>unavailable</div>
                                </div>
                              )
                            })}
                        </div>
                      </div>

                      {/* Compatible Scales */}
                      <div className="bg-white/5 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-purple-400 text-sm">🎸</span>
                          <h4 className="text-sm font-semibold text-purple-300 uppercase tracking-wider">Scales to Solo Over This</h4>
                        </div>
                        <div className="space-y-2 mb-3">
                          {song.recommendedScales.map((scale, i) => (
                            <div key={i} className="flex items-start gap-3">
                              <span className="text-amber-400 font-bold text-sm mt-0.5 shrink-0">→</span>
                              <div>
                                <span className="text-white text-sm font-semibold">{scale.name}</span>
                                <span className="text-purple-400 text-xs ml-2">{scale.why}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <Link
                          href="/scales"
                          className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 text-xs font-semibold transition-colors"
                        >
                          Open Scales module →
                        </Link>
                      </div>

                      {/* Theory Callout */}
                      <div className="bg-amber-500/15 border border-amber-500/30 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-amber-400 text-sm">🎓</span>
                          <div className="text-amber-300 text-xs font-semibold uppercase tracking-wider">Theory</div>
                        </div>
                        <p className="text-amber-100 text-sm leading-relaxed">{song.theoryCallout}</p>
                      </div>

                      {/* Related Modules */}
                      <div>
                        <div className="text-purple-400 text-xs font-semibold uppercase tracking-wider mb-2">Explore further</div>
                        <div className="flex flex-wrap gap-2">
                          {song.relatedModules.map(m => (
                            <Link
                              key={m.href}
                              href={m.href}
                              className="bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                            >
                              {m.label} →
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🎸</div>
            <p className="text-purple-200 text-lg mb-2">No songs match these filters</p>
            <button
              onClick={() => { setGenreFilter("All"); setDifficultyFilter("All") }}
              className="text-amber-400 hover:text-amber-300 text-sm underline"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Footer tip */}
        <div className="mt-10 bg-white/5 rounded-xl p-5 border border-white/10">
          <h3 className="text-white font-semibold mb-3">How to use this library</h3>
          <div className="text-purple-300 text-sm space-y-1.5">
            <p>• <strong className="text-purple-200">Transpose:</strong> Select any key above — all songs update instantly. Great for matching a singer&apos;s range.</p>
            <p>• <strong className="text-purple-200">Nashville numbers</strong> (I, IV, V…) stay fixed regardless of key — they describe chord relationships, not specific notes.</p>
            <p>• <strong className="text-purple-200">Expand</strong> any song to see fingering diagrams, scales to improvise with, and the theory behind the progression.</p>
            <p>• <strong className="text-purple-200">Scales:</strong> The recommended scales link directly to the <Link href="/scales" className="text-amber-400 hover:text-amber-300">Scales module</Link> where you can see every position on the neck.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
