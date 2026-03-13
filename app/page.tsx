"use client"

import Link from "next/link"
import { useState } from "react"

interface Module {
  href: string
  icon: string
  title: string
  description: string
  cta: string
  tags: string[]
}

const MODULES: Module[] = [
  {
    href: "/how-to-use",
    icon: "📱",
    title: "How to Use This App",
    description: "New here? Get an overview of all modules and follow structured learning paths for beginner, intermediate, or advanced levels.",
    cta: "View Guide →",
    tags: ["guide", "beginner", "overview", "start", "learning path"],
  },
  {
    href: "/beginner",
    icon: "🌟",
    title: "Beginner Module",
    description: "Just starting out? Learn guitar anatomy, how to hold your guitar, read chord diagrams, and play your first chords.",
    cta: "Start Here →",
    tags: ["beginner", "basics", "first chords", "chord diagrams", "anatomy"],
  },
  {
    href: "/chord-builder",
    icon: "🎸",
    title: "Chord Building",
    description: "Learn how chords are constructed from the ground up. Understand intervals, triads, and extensions.",
    cta: "Start Learning →",
    tags: ["chords", "intervals", "triads", "extensions", "theory", "construction"],
  },
  {
    href: "/progressions",
    icon: "🎵",
    title: "Chord Progressions",
    description: "Explore common progressions used in popular music. Practice in all keys and understand the theory.",
    cta: "Explore Progressions →",
    tags: ["progressions", "chords", "keys", "popular music", "I IV V", "practice"],
  },
  {
    href: "/scales",
    icon: "🎼",
    title: "Guitar Scales",
    description: "Master essential scales across the fretboard. Learn positions, patterns, and soloing techniques.",
    cta: "Learn Scales →",
    tags: ["scales", "pentatonic", "major", "minor", "soloing", "fretboard", "positions"],
  },
  {
    href: "/nashville-number-system",
    icon: "🎯",
    title: "Nashville Number System",
    description: "Learn the universal language of chord progressions. Transpose songs instantly to any key.",
    cta: "Learn the System →",
    tags: ["nashville", "numbers", "transposition", "transpose", "theory", "session"],
  },
  {
    href: "/music-theory",
    icon: "📚",
    title: "Music Theory",
    description: "Build a strong foundation in music theory. Learn notes, intervals, chord construction, and more.",
    cta: "Study Theory →",
    tags: ["theory", "notes", "intervals", "circle of fifths", "key signatures", "foundation"],
  },
  {
    href: "/caged-system",
    icon: "🔗",
    title: "CAGED System",
    description: "Master the fretboard using 5 interconnected chord shapes. See how everything connects across the neck.",
    cta: "Unlock the Fretboard →",
    tags: ["caged", "fretboard", "shapes", "intermediate", "positions", "barre"],
  },
  {
    href: "/chord-substitutions",
    icon: "🎭",
    title: "Chord Substitutions",
    description: "Learn advanced techniques to replace chords with alternatives. Add color and sophistication to your playing.",
    cta: "Explore Substitutions →",
    tags: ["substitutions", "jazz", "advanced", "theory", "reharmonization", "color"],
  },
  {
    href: "/fingerstyle-patterns",
    icon: "🎹",
    title: "Fingerstyle Patterns",
    description: "Master fingerpicking patterns from Travis picking to classical techniques. Build independence and fluidity.",
    cta: "Learn Patterns →",
    tags: ["fingerstyle", "travis picking", "fingerpicking", "classical", "patterns", "picking"],
  },
  {
    href: "/rhythm-trainer",
    icon: "🥁",
    title: "Rhythm Trainer",
    description: "Master strumming patterns and timing. Learn rock, folk, reggae, and more with visual and audio guides.",
    cta: "Practice Rhythm →",
    tags: ["rhythm", "strumming", "timing", "rock", "folk", "reggae", "patterns"],
  },
  {
    href: "/arpeggios",
    icon: "🎵",
    title: "Arpeggios",
    description: "Learn to play chords note-by-note across the fretboard. Essential for solos and melodic playing.",
    cta: "Master Arpeggios →",
    tags: ["arpeggios", "soloing", "fretboard", "technique", "melodic", "broken chords"],
  },
  {
    href: "/song-library",
    icon: "🎶",
    title: "Song Library",
    description: "Learn 8 real songs with chord diagrams, Nashville numbers, and theory callouts. Transpose to any key.",
    cta: "Browse Songs →",
    tags: ["songs", "real songs", "repertoire", "practice", "transpose", "let her go", "passenger", "stand by me", "ben e. king", "house of the rising sun", "the animals", "jolene", "dolly parton", "sweet home alabama", "lynyrd skynyrd", "fly me to the moon", "frank sinatra", "wish you were here", "pink floyd", "autumn leaves", "classic rock", "jazz", "pop", "country", "soul"],
  },
  {
    href: "/blues",
    icon: "🎷",
    title: "12-Bar Blues",
    description: "Master the foundation of blues, rock & roll, and modern music. Learn the structure, shuffle rhythm, chord shapes, and how to solo.",
    cta: "Learn the Blues →",
    tags: ["blues", "12 bar", "shuffle", "I IV V", "dominant 7th", "pentatonic", "soloing", "rock", "delta blues", "chicago blues", "stevie ray vaughan", "b.b. king", "boogie"],
  },
  {
    href: "/pentatonic",
    icon: "🎯",
    title: "Pentatonic Mastery",
    description: "Master all 5 positions of the minor pentatonic scale. Connect them across the neck and play with classic licks, bends, and vibrato.",
    cta: "Master the Pentatonic →",
    tags: ["pentatonic", "positions", "licks", "bends", "vibrato", "soloing", "fretboard", "minor scale", "lead guitar"],
  },
  {
    href: "/techniques",
    icon: "🤘",
    title: "Guitar Techniques",
    description: "Master bends, vibrato, slides, legato, and muting. Step-by-step technique breakdowns with TAB examples and daily workout.",
    cta: "Build Your Technique →",
    tags: ["techniques", "bends", "vibrato", "slides", "legato", "hammer-on", "pull-off", "muting", "workout"],
  },
  {
    href: "/improvisation",
    icon: "🎙️",
    title: "Improvisation",
    description: "Learn to improvise with purpose — phrases, motifs, space, and dynamics that make your solos memorable and musical.",
    cta: "Start Improvising →",
    tags: ["improvisation", "soloing", "phrases", "motifs", "space", "dynamics", "blues", "lead guitar", "expression"],
  },
  {
    href: "/modes",
    icon: "🌀",
    title: "Modes Made Practical",
    description: "Understand Dorian, Mixolydian, Phrygian, Lydian, and Aeolian — with scale patterns, riffs, and real songs for each mode.",
    cta: "Explore Modes →",
    tags: ["modes", "dorian", "mixolydian", "phrygian", "lydian", "aeolian", "theory", "scales", "lead guitar", "jazz", "rock"],
  },
  {
    href: "/riffs",
    icon: "🎸",
    title: "Classic Riffs",
    description: "Learn iconic rock, blues, and folk riffs with full TAB. Understand what makes them great and how to build your own.",
    cta: "Learn the Riffs →",
    tags: ["riffs", "rock", "blues", "folk", "classic riffs", "smoke on the water", "iron man", "sunshine of your love", "wish you were here", "technique"],
  },
  {
    href: "/diatonic-chords",
    icon: "🔢",
    title: "Diatonic Chords",
    description: "Discover the 7 chords that live inside every scale. Understand which chords belong to a key and which scales to use over any chord.",
    cta: "Explore Diatonic Harmony →",
    tags: ["diatonic", "chords", "scales", "harmony", "key", "major", "minor", "chord scale", "theory", "I IV V", "modes", "soloing"],
  },
  {
    href: "/backing-chords",
    icon: "🎛️",
    title: "Backing Chords for Scales",
    description: "Playing pentatonic, Dorian, Mixolydian, or Phrygian? Find the chord progressions that activate each scale's character.",
    cta: "Find Your Backing →",
    tags: ["backing chords", "modes", "pentatonic", "dorian", "mixolydian", "phrygian", "lydian", "aeolian", "vamp", "progressions", "chord scale", "soloing"],
  },
  {
    href: "/open-tunings",
    icon: "🪕",
    title: "Open Tunings",
    description: "Retune to Open G, Open D, DADGAD, and Open E. Unlock slide guitar, drone sounds, and chord voicings impossible in standard tuning.",
    cta: "Explore Open Tunings →",
    tags: ["open tuning", "open g", "open d", "dadgad", "open e", "slide guitar", "keith richards", "joni mitchell", "duane allman", "bottleneck", "delta blues", "celtic", "drone"],
  },
  {
    href: "/funk-guitar",
    icon: "🎛️",
    title: "Funk Guitar",
    description: "Master the chicken scratch, 16th note grooves, dominant 9th voicings, and the wah pedal. Rhythm, pocket, and space — the way James Brown and Nile Rodgers do it.",
    cta: "Get in the Pocket →",
    tags: ["funk", "rhythm", "chicken scratch", "dead notes", "muting", "16th notes", "groove", "wah", "nile rodgers", "james brown", "prince", "dominant 9th", "staccato"],
  },
  {
    href: "/standard-notation",
    icon: "🎼",
    title: "Standard Notation",
    description: "Read music the way every other instrument does. Learn the staff, note values, key signatures, and train note recognition with the interactive Note Trainer.",
    cta: "Learn to Read Music →",
    tags: ["standard notation", "sheet music", "treble clef", "note reading", "rhythm", "key signatures", "time signatures", "sight reading", "note trainer", "staff", "theory"],
  },
]

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredModules = MODULES.filter(m =>
    searchQuery === "" ||
    [m.title, m.description, ...m.tags].some(s =>
      s.toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Guitar Lab
          </h1>
          <p className="text-xl text-purple-200">
            Master guitar theory, technique, and fretboard knowledge
          </p>
        </header>

        {/* Search */}
        <div className="max-w-xl mx-auto mb-10">
          <div className="relative flex items-center">
            <span className="absolute left-4 text-purple-400 text-lg select-none">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search modules… (e.g. jazz, scales, beginner)"
              className="w-full bg-white/10 border border-white/20 rounded-xl pl-11 pr-10 py-3 text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 text-purple-400 hover:text-white transition-colors text-lg leading-none"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="text-purple-400 text-sm mt-2 text-center">
              {filteredModules.length === 0
                ? "No modules found"
                : `${filteredModules.length} module${filteredModules.length === 1 ? "" : "s"} found`}
            </p>
          )}
        </div>

        {/* Module Grid */}
        {filteredModules.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {filteredModules.map(module => (
              <Link key={module.href} href={module.href}>
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition-all cursor-pointer border border-white/20 hover:scale-105 h-full flex flex-col">
                  <div className="text-4xl mb-4">{module.icon}</div>
                  <h2 className="text-2xl font-bold text-white mb-3">{module.title}</h2>
                  <p className="text-purple-200 mb-4 flex-1">{module.description}</p>
                  <div className="text-purple-300 font-semibold">{module.cta}</div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="max-w-7xl mx-auto text-center py-16">
            <div className="text-5xl mb-4">🎸</div>
            <p className="text-purple-200 text-lg mb-2">No modules match &ldquo;{searchQuery}&rdquo;</p>
            <p className="text-purple-400 text-sm">Try &ldquo;jazz&rdquo;, &ldquo;beginner&rdquo;, &ldquo;scales&rdquo;, or &ldquo;songs&rdquo;</p>
          </div>
        )}

        {/* Recommended Learning Path */}
        {!searchQuery && (
          <div className="mt-16 max-w-7xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white text-center mb-8">
                Recommended Learning Path
              </h3>
              <div className="grid md:grid-cols-5 gap-4">
                <div className="bg-white/10 rounded-xl p-5 text-center">
                  <div className="bg-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mx-auto mb-3">1</div>
                  <div className="text-white font-semibold mb-1">Beginner Module</div>
                  <div className="text-purple-200 text-xs">Learn guitar basics, chords, and how to read diagrams</div>
                </div>
                <div className="bg-white/10 rounded-xl p-5 text-center">
                  <div className="bg-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mx-auto mb-3">2</div>
                  <div className="text-white font-semibold mb-1">Practice Daily</div>
                  <div className="text-purple-200 text-xs">Master G, C, D, Em, Am, E, A with clean transitions</div>
                </div>
                <div className="bg-white/10 rounded-xl p-5 text-center">
                  <div className="bg-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mx-auto mb-3">3</div>
                  <div className="text-white font-semibold mb-1">Learn Songs</div>
                  <div className="text-purple-200 text-xs">Use the Song Library to play real music</div>
                </div>
                <div className="bg-white/10 rounded-xl p-5 text-center">
                  <div className="bg-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mx-auto mb-3">4</div>
                  <div className="text-white font-semibold mb-1">Explore Theory</div>
                  <div className="text-purple-200 text-xs">Dive into Scales and Chord Building</div>
                </div>
                <div className="bg-white/10 rounded-xl p-5 text-center">
                  <div className="bg-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mx-auto mb-3">5</div>
                  <div className="text-white font-semibold mb-1">Master Fretboard</div>
                  <div className="text-purple-200 text-xs">Learn CAGED to play anywhere on the neck</div>
                </div>
              </div>
              <div className="mt-6 bg-green-500/20 border border-green-500/50 rounded-lg p-4 text-center">
                <div className="text-green-200 font-semibold mb-1">New to Guitar?</div>
                <div className="text-green-100 text-sm">
                  Start with the <span className="font-bold">Beginner Module</span> above - it covers everything you need to get started!
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
