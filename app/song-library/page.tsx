"use client"

import { useState } from "react"
import Link from "next/link"
import ChordDiagram from "@/components/ChordDiagram"
import { getChordShape } from "@/lib/chordShapes"

const KEYS = ["C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B"]

// Keys where flat spellings are preferred (F, Bb, Eb, Ab, Db)
const FLAT_KEY_INDICES = new Set([1, 3, 5, 8, 10])

// ─── Types ────────────────────────────────────────────────────────────────────

type ChordQuality = "Major" | "Minor" | "Dominant" | "Minor 7th" | "Major 7th" | "Diminished"
type Genre = "Pop" | "Soul" | "Classic Rock" | "Country" | "Jazz"
type Difficulty = "Beginner" | "Intermediate" | "Advanced"

interface ChordSlot {
  roman: string
  /** Semitones from root of the song's original key (0 = root, 7 = fifth, etc.) */
  semitones: number
  quality: ChordQuality
}

interface Song {
  id: string
  title: string
  artist: string
  genre: Genre
  difficulty: Difficulty
  /** Index into KEYS[] for the song's original/famous key */
  originalKey: number
  displayKey: string
  progression: ChordSlot[]
  theoryCallout: string
  relatedModules: { href: string; label: string }[]
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

/** Returns the preferred spelling of a note given the active key context */
function getNoteSpelling(noteIndex: number, activeKey: number): string {
  const note = KEYS[noteIndex]
  if (!note.includes("/")) return note
  const [sharp, flat] = note.split("/")
  return FLAT_KEY_INDICES.has(activeKey) ? flat : sharp
}

/** Maps song quality labels → chordShapes.ts key names */
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

/**
 * Given a chord's semitone offset from its song's root, return the chord name
 * transposed to selectedKey.
 *
 * Formula: (song.originalKey + semitones + transposition) % 12
 * which simplifies to: (selectedKey + semitones) % 12
 * because transposition = selectedKey - originalKey, and originalKey cancels.
 */
function getChordName(semitones: number, quality: ChordQuality, selectedKey: number): string {
  const noteIndex = (selectedKey + semitones) % 12
  const rootNote = getNoteSpelling(noteIndex, selectedKey)
  return rootNote + getQualitySuffix(quality)
}

// ─── Song Data ────────────────────────────────────────────────────────────────

const SONGS: Song[] = [
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
  },
]

// ─── Badge Styles ─────────────────────────────────────────────────────────────

const GENRE_COLORS: Record<Genre, string> = {
  Pop: "bg-blue-600 text-white",
  Soul: "bg-orange-600 text-white",
  "Classic Rock": "bg-red-600 text-white",
  Country: "bg-yellow-600 text-white",
  Jazz: "bg-purple-700 text-white",
}

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  Beginner: "bg-green-600 text-white",
  Intermediate: "bg-amber-600 text-white",
  Advanced: "bg-red-700 text-white",
}

const GENRES: (Genre | "All")[] = ["All", "Pop", "Soul", "Classic Rock", "Country", "Jazz"]
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
          <h1 className="text-4xl font-bold text-white mb-2">Song Library</h1>
          <p className="text-purple-200">Real songs with chord diagrams, Nashville numbers, and theory insights. Transpose to any key instantly.</p>
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
                        <><span className="text-xs">▼</span> Chord Diagrams &amp; Theory</>
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
                              // Always use sharp spelling for chordShapes lookup (lib has C#/D#/etc, not Db/Eb)
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
            <p>• <strong className="text-purple-200">Transpose:</strong> Select any key above — all songs update instantly. Great for matching a singer's range.</p>
            <p>• <strong className="text-purple-200">Nashville numbers</strong> (I, IV, V…) stay fixed regardless of key — they describe chord relationships, not specific notes.</p>
            <p>• <strong className="text-purple-200">Expand</strong> any song to see fingering diagrams and the theory behind why the progression works the way it does.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
