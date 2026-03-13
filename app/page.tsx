"use client"

import Link from "next/link"
import { useState } from "react"

type Category = "foundations" | "chords" | "scales" | "technique" | "styles" | "songs"

interface Module {
  href: string
  icon: string
  title: string
  description: string
  cta: string
  tags: string[]
  category: Category
}

interface PathStep { href: string; label: string }
interface LearningPath {
  icon: string
  title: string
  audience: string
  description: string
  accent: string
  steps: PathStep[]
}

const LEARNING_PATHS: LearningPath[] = [
  {
    icon: "🌱",
    title: "Complete Beginner",
    audience: "Never played before",
    description: "Go from zero to playing real songs. Covers everything you need before touching any other module.",
    accent: "border-green-500 bg-green-500/10",
    steps: [
      { href: "/beginner",               label: "Guitar Basics" },
      { href: "/music-theory",           label: "Music Theory" },
      { href: "/progressions",           label: "Chord Progressions" },
      { href: "/rhythm-trainer",         label: "Rhythm Trainer" },
      { href: "/song-library",           label: "Song Library" },
    ],
  },
  {
    icon: "🎸",
    title: "Rhythm Player",
    audience: "Know basic chords",
    description: "Master strumming, groove, and harmony to become the guitarist every band wants.",
    accent: "border-blue-500 bg-blue-500/10",
    steps: [
      { href: "/chord-builder",          label: "Chord Building" },
      { href: "/nashville-number-system",label: "Nashville Numbers" },
      { href: "/diatonic-chords",        label: "Diatonic Chords" },
      { href: "/rhythm-trainer",         label: "Rhythm Trainer" },
      { href: "/funk-guitar",            label: "Funk Guitar" },
    ],
  },
  {
    icon: "🎯",
    title: "Lead Guitarist",
    audience: "Ready to solo",
    description: "Build a complete soloing toolkit — scales, positions, bends, phrasing, and musical expression.",
    accent: "border-amber-500 bg-amber-500/10",
    steps: [
      { href: "/scales",                 label: "Guitar Scales" },
      { href: "/pentatonic",             label: "Pentatonic Mastery" },
      { href: "/techniques",             label: "Guitar Techniques" },
      { href: "/improvisation",          label: "Improvisation" },
      { href: "/modes",                  label: "Modes" },
    ],
  },
  {
    icon: "📚",
    title: "Theory Deep-Dive",
    audience: "Want to understand music",
    description: "Go beyond shapes — understand why music works and how to use that knowledge anywhere.",
    accent: "border-purple-500 bg-purple-500/10",
    steps: [
      { href: "/music-theory",           label: "Music Theory" },
      { href: "/standard-notation",      label: "Standard Notation" },
      { href: "/diatonic-chords",        label: "Diatonic Chords" },
      { href: "/nashville-number-system",label: "Nashville Numbers" },
      { href: "/chord-substitutions",    label: "Chord Substitutions" },
    ],
  },
]

const CATEGORIES: { id: Category | "all"; label: string }[] = [
  { id: "all",         label: "All Modules" },
  { id: "foundations", label: "Foundations" },
  { id: "chords",      label: "Chords & Harmony" },
  { id: "scales",      label: "Scales & Lead" },
  { id: "technique",   label: "Technique" },
  { id: "styles",      label: "Styles" },
  { id: "songs",       label: "Songs" },
]

const MODULES: Module[] = [
  {
    href: "/how-to-use",
    icon: "📱",
    title: "How to Use This App",
    description: "New here? Get an overview of all modules and follow structured learning paths for beginner, intermediate, or advanced levels.",
    cta: "View Guide →",
    tags: ["guide", "beginner", "overview", "start", "learning path"],
    category: "foundations",
  },
  {
    href: "/beginner",
    icon: "🌟",
    title: "Beginner Module",
    description: "Just starting out? Learn guitar anatomy, how to hold your guitar, read chord diagrams, and play your first chords.",
    cta: "Start Here →",
    tags: ["beginner", "basics", "first chords", "chord diagrams", "anatomy"],
    category: "foundations",
  },
  {
    href: "/music-theory",
    icon: "📚",
    title: "Music Theory",
    description: "Build a strong foundation in music theory. Learn notes, intervals, chord construction, and more.",
    cta: "Study Theory →",
    tags: ["theory", "notes", "intervals", "circle of fifths", "key signatures", "foundation"],
    category: "foundations",
  },
  {
    href: "/nashville-number-system",
    icon: "🎯",
    title: "Nashville Number System",
    description: "Learn the universal language of chord progressions. Transpose songs instantly to any key.",
    cta: "Learn the System →",
    tags: ["nashville", "numbers", "transposition", "transpose", "theory", "session"],
    category: "foundations",
  },
  {
    href: "/standard-notation",
    icon: "🎼",
    title: "Standard Notation",
    description: "Read music the way every other instrument does. Learn the staff, note values, key signatures, and train note recognition with the interactive Note Trainer.",
    cta: "Learn to Read Music →",
    tags: ["standard notation", "sheet music", "treble clef", "note reading", "rhythm", "key signatures", "time signatures", "sight reading", "note trainer", "staff", "theory"],
    category: "foundations",
  },
  {
    href: "/chord-builder",
    icon: "🎸",
    title: "Chord Building",
    description: "Learn how chords are constructed from the ground up. Understand intervals, triads, and extensions.",
    cta: "Start Learning →",
    tags: ["chords", "intervals", "triads", "extensions", "theory", "construction"],
    category: "chords",
  },
  {
    href: "/progressions",
    icon: "🎵",
    title: "Chord Progressions",
    description: "Explore common progressions used in popular music. Practice in all keys and understand the theory.",
    cta: "Explore Progressions →",
    tags: ["progressions", "chords", "keys", "popular music", "I IV V", "practice"],
    category: "chords",
  },
  {
    href: "/diatonic-chords",
    icon: "🔢",
    title: "Diatonic Chords",
    description: "Discover the 7 chords that live inside every scale. Understand which chords belong to a key and which scales to use over any chord.",
    cta: "Explore Diatonic Harmony →",
    tags: ["diatonic", "chords", "scales", "harmony", "key", "major", "minor", "chord scale", "theory", "I IV V", "modes", "soloing"],
    category: "chords",
  },
  {
    href: "/caged-system",
    icon: "🔗",
    title: "CAGED System",
    description: "Master the fretboard using 5 interconnected chord shapes. See how everything connects across the neck.",
    cta: "Unlock the Fretboard →",
    tags: ["caged", "fretboard", "shapes", "intermediate", "positions", "barre"],
    category: "chords",
  },
  {
    href: "/chord-substitutions",
    icon: "🎭",
    title: "Chord Substitutions",
    description: "Learn advanced techniques to replace chords with alternatives. Add color and sophistication to your playing.",
    cta: "Explore Substitutions →",
    tags: ["substitutions", "jazz", "advanced", "theory", "reharmonization", "color"],
    category: "chords",
  },
  {
    href: "/backing-chords",
    icon: "🎛️",
    title: "Backing Chords for Scales",
    description: "Playing pentatonic, Dorian, Mixolydian, or Phrygian? Find the chord progressions that activate each scale's character.",
    cta: "Find Your Backing →",
    tags: ["backing chords", "modes", "pentatonic", "dorian", "mixolydian", "phrygian", "lydian", "aeolian", "vamp", "progressions", "chord scale", "soloing"],
    category: "chords",
  },
  {
    href: "/scales",
    icon: "🎼",
    title: "Guitar Scales",
    description: "Master essential scales across the fretboard. Learn positions, patterns, and soloing techniques.",
    cta: "Learn Scales →",
    tags: ["scales", "pentatonic", "major", "minor", "soloing", "fretboard", "positions"],
    category: "scales",
  },
  {
    href: "/pentatonic",
    icon: "🎯",
    title: "Pentatonic Mastery",
    description: "Master all 5 positions of the minor pentatonic scale. Connect them across the neck and play with classic licks, bends, and vibrato.",
    cta: "Master the Pentatonic →",
    tags: ["pentatonic", "positions", "licks", "bends", "vibrato", "soloing", "fretboard", "minor scale", "lead guitar"],
    category: "scales",
  },
  {
    href: "/modes",
    icon: "🌀",
    title: "Modes Made Practical",
    description: "Understand Dorian, Mixolydian, Phrygian, Lydian, and Aeolian — with scale patterns, riffs, and real songs for each mode.",
    cta: "Explore Modes →",
    tags: ["modes", "dorian", "mixolydian", "phrygian", "lydian", "aeolian", "theory", "scales", "lead guitar", "jazz", "rock"],
    category: "scales",
  },
  {
    href: "/arpeggios",
    icon: "🎵",
    title: "Arpeggios",
    description: "Learn to play chords note-by-note across the fretboard. Essential for solos and melodic playing.",
    cta: "Master Arpeggios →",
    tags: ["arpeggios", "soloing", "fretboard", "technique", "melodic", "broken chords"],
    category: "scales",
  },
  {
    href: "/improvisation",
    icon: "🎙️",
    title: "Improvisation",
    description: "Learn to improvise with purpose — phrases, motifs, space, and dynamics that make your solos memorable and musical.",
    cta: "Start Improvising →",
    tags: ["improvisation", "soloing", "phrases", "motifs", "space", "dynamics", "blues", "lead guitar", "expression"],
    category: "scales",
  },
  {
    href: "/techniques",
    icon: "🤘",
    title: "Guitar Techniques",
    description: "Master bends, vibrato, slides, legato, and muting. Step-by-step technique breakdowns with TAB examples and daily workout.",
    cta: "Build Your Technique →",
    tags: ["techniques", "bends", "vibrato", "slides", "legato", "hammer-on", "pull-off", "muting", "workout"],
    category: "technique",
  },
  {
    href: "/fingerstyle-patterns",
    icon: "🎹",
    title: "Fingerstyle Patterns",
    description: "Master fingerpicking patterns from Travis picking to classical techniques. Build independence and fluidity.",
    cta: "Learn Patterns →",
    tags: ["fingerstyle", "travis picking", "fingerpicking", "classical", "patterns", "picking"],
    category: "technique",
  },
  {
    href: "/rhythm-trainer",
    icon: "🥁",
    title: "Rhythm Trainer",
    description: "Master strumming patterns and timing. Learn rock, folk, reggae, and more with visual and audio guides.",
    cta: "Practice Rhythm →",
    tags: ["rhythm", "strumming", "timing", "rock", "folk", "reggae", "patterns"],
    category: "technique",
  },
  {
    href: "/riffs",
    icon: "🎸",
    title: "Classic Riffs",
    description: "Learn iconic rock, blues, and folk riffs with full TAB. Understand what makes them great and how to build your own.",
    cta: "Learn the Riffs →",
    tags: ["riffs", "rock", "blues", "folk", "classic riffs", "smoke on the water", "iron man", "sunshine of your love", "wish you were here", "technique"],
    category: "technique",
  },
  {
    href: "/blues",
    icon: "🎷",
    title: "12-Bar Blues",
    description: "Master the foundation of blues, rock & roll, and modern music. Learn the structure, shuffle rhythm, chord shapes, and how to solo.",
    cta: "Learn the Blues →",
    tags: ["blues", "12 bar", "shuffle", "I IV V", "dominant 7th", "pentatonic", "soloing", "rock", "delta blues", "chicago blues", "stevie ray vaughan", "b.b. king", "boogie"],
    category: "styles",
  },
  {
    href: "/funk-guitar",
    icon: "🎛️",
    title: "Funk Guitar",
    description: "Master the chicken scratch, 16th note grooves, dominant 9th voicings, and the wah pedal. Rhythm, pocket, and space — the way James Brown and Nile Rodgers do it.",
    cta: "Get in the Pocket →",
    tags: ["funk", "rhythm", "chicken scratch", "dead notes", "muting", "16th notes", "groove", "wah", "nile rodgers", "james brown", "prince", "dominant 9th", "staccato"],
    category: "styles",
  },
  {
    href: "/open-tunings",
    icon: "🪕",
    title: "Open Tunings",
    description: "Retune to Open G, Open D, DADGAD, and Open E. Unlock slide guitar, drone sounds, and chord voicings impossible in standard tuning.",
    cta: "Explore Open Tunings →",
    tags: ["open tuning", "open g", "open d", "dadgad", "open e", "slide guitar", "keith richards", "joni mitchell", "duane allman", "bottleneck", "delta blues", "celtic", "drone"],
    category: "styles",
  },
  {
    href: "/song-library",
    icon: "🎶",
    title: "Song Library",
    description: "Learn 8 real songs with chord diagrams, Nashville numbers, and theory callouts. Transpose to any key.",
    cta: "Browse Songs →",
    tags: ["songs", "real songs", "repertoire", "practice", "transpose", "let her go", "passenger", "stand by me", "ben e. king", "house of the rising sun", "the animals", "jolene", "dolly parton", "sweet home alabama", "lynyrd skynyrd", "fly me to the moon", "frank sinatra", "wish you were here", "pink floyd", "autumn leaves", "classic rock", "jazz", "pop", "country", "soul"],
    category: "songs",
  },
]

const CATEGORY_COLORS: Record<Category, string> = {
  foundations: "text-sky-400 bg-sky-500/10 border-sky-500/30",
  chords:      "text-violet-400 bg-violet-500/10 border-violet-500/30",
  scales:      "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  technique:   "text-orange-400 bg-orange-500/10 border-orange-500/30",
  styles:      "text-pink-400 bg-pink-500/10 border-pink-500/30",
  songs:       "text-amber-400 bg-amber-500/10 border-amber-500/30",
}

const CATEGORY_LABELS: Record<Category, string> = {
  foundations: "Foundations",
  chords:      "Chords & Harmony",
  scales:      "Scales & Lead",
  technique:   "Technique",
  styles:      "Styles",
  songs:       "Songs",
}

export default function Home() {
  const [searchQuery, setSearchQuery]       = useState("")
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all")
  const [showPaths, setShowPaths]           = useState(true)

  const isSearching = searchQuery !== ""

  const filteredModules = MODULES.filter(m => {
    const matchesSearch =
      isSearching
        ? [m.title, m.description, ...m.tags].some(s =>
            s.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : true
    const matchesCategory =
      isSearching || activeCategory === "all" || m.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-16 max-w-7xl">

        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4">Guitar Lab</h1>
          <p className="text-base sm:text-xl text-purple-200">Master guitar theory, technique, and fretboard knowledge</p>
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
              >✕</button>
            )}
          </div>
          {isSearching && (
            <p className="text-purple-400 text-sm mt-2 text-center">
              {filteredModules.length === 0
                ? "No modules found"
                : `${filteredModules.length} module${filteredModules.length === 1 ? "" : "s"} found`}
            </p>
          )}
        </div>

        {/* ── Learning Paths ─────────────────────────────────────── */}
        {!isSearching && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-2xl font-bold text-white">Learning Paths</h2>
                <p className="text-purple-400 text-sm mt-0.5">Not sure where to start? Follow a guided sequence.</p>
              </div>
              <button
                onClick={() => setShowPaths(v => !v)}
                className="text-purple-400 hover:text-white text-sm transition-colors px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg"
              >
                {showPaths ? "▲ Hide" : "▼ Show"}
              </button>
            </div>

            {showPaths && (
              <div className="grid md:grid-cols-2 gap-4">
                {LEARNING_PATHS.map(path => (
                  <div key={path.title} className={`border-l-4 rounded-2xl p-5 ${path.accent}`}>
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-3xl">{path.icon}</span>
                      <div>
                        <h3 className="text-white font-bold text-lg leading-tight">{path.title}</h3>
                        <p className="text-purple-400 text-xs">{path.audience}</p>
                      </div>
                    </div>
                    <p className="text-purple-200 text-sm mb-4">{path.description}</p>
                    <ol className="space-y-1.5 mb-4">
                      {path.steps.map((step, i) => (
                        <li key={step.href}>
                          <Link
                            href={step.href}
                            className="flex items-center gap-2.5 text-sm text-purple-200 hover:text-white transition-colors group"
                          >
                            <span className="w-5 h-5 rounded-full bg-white/20 group-hover:bg-white/30 flex items-center justify-center text-xs font-bold text-white shrink-0">
                              {i + 1}
                            </span>
                            {step.label}
                          </Link>
                        </li>
                      ))}
                    </ol>
                    <Link
                      href={path.steps[0].href}
                      className="inline-block text-xs font-semibold text-white bg-white/20 hover:bg-white/30 px-4 py-1.5 rounded-lg transition-all"
                    >
                      Start Path →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── Category Tabs + Module Grid ───────────────────────── */}
        <section>
          {!isSearching && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">Browse Modules</h2>
                <span className="text-purple-400 text-sm">{filteredModules.length} modules</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition-all ${
                      activeCategory === cat.id
                        ? "bg-purple-600 text-white"
                        : "bg-white/10 text-purple-300 hover:bg-white/20"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredModules.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModules.map(module => (
                <Link key={module.href} href={module.href}>
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/20 transition-all cursor-pointer border border-white/20 hover:scale-[1.02] h-full flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-4xl">{module.icon}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[module.category]}`}>
                        {CATEGORY_LABELS[module.category]}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">{module.title}</h2>
                    <p className="text-purple-200 text-sm mb-4 flex-1">{module.description}</p>
                    <div className="text-purple-300 font-semibold text-sm">{module.cta}</div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🎸</div>
              <p className="text-purple-200 text-lg mb-2">No modules match &ldquo;{searchQuery}&rdquo;</p>
              <p className="text-purple-400 text-sm">Try &ldquo;jazz&rdquo;, &ldquo;beginner&rdquo;, &ldquo;scales&rdquo;, or &ldquo;songs&rdquo;</p>
            </div>
          )}
        </section>

      </div>
    </div>
  )
}
