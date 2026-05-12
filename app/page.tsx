"use client"

import Link from "next/link"
import { useState } from "react"

type Category = "foundations" | "chords" | "scales" | "technique" | "styles" | "songs"
type ViewTab  = "paths" | "themes" | "all"

interface Module {
  href: string
  title: string
  description: string
  cta: string
  tags: string[]
  category: Category
}

interface PathStep { href: string; label: string }
interface LearningPath {
  title: string
  audience: string
  description: string
  accent: string
  labelColor: string
  steps: PathStep[]
}

const LEARNING_PATHS: LearningPath[] = [
  {
    title: "Complete Beginner",
    audience: "Never played before",
    description: "Go from zero to playing real songs — covers everything you need before touching any other module.",
    accent: "border-emerald-500/40 bg-emerald-500/5",
    labelColor: "text-emerald-400",
    steps: [
      { href: "/beginner",               label: "Guitar Basics" },
      { href: "/progressions",           label: "Chord Progressions" },
      { href: "/barre-chords",           label: "Barre Chords" },
      { href: "/rhythm-trainer",         label: "Rhythm Trainer" },
      { href: "/song-library",           label: "Song Library" },
    ],
  },
  {
    title: "Rhythm Player",
    audience: "Know basic chords",
    description: "Master strumming, groove, and harmony to become the guitarist every band wants.",
    accent: "border-blue-500/40 bg-blue-500/5",
    labelColor: "text-blue-400",
    steps: [
      { href: "/chord-builder",           label: "Chord Building" },
      { href: "/nashville-number-system", label: "Nashville Numbers" },
      { href: "/diatonic-chords",         label: "Diatonic Chords" },
      { href: "/rhythm-trainer",          label: "Rhythm Trainer" },
      { href: "/funk-guitar",             label: "Funk Guitar" },
    ],
  },
  {
    title: "Lead Guitarist",
    audience: "Ready to solo",
    description: "Build a complete soloing toolkit — scales, positions, bends, phrasing, and musical expression.",
    accent: "border-amber-500/40 bg-amber-500/5",
    labelColor: "text-amber-400",
    steps: [
      { href: "/scales",        label: "Guitar Scales" },
      { href: "/pentatonic",    label: "Pentatonic Mastery" },
      { href: "/techniques",    label: "Guitar Techniques" },
      { href: "/improvisation", label: "Improvisation" },
      { href: "/modes",         label: "Modes" },
    ],
  },
  {
    title: "Theory Deep-Dive",
    audience: "Want to understand music",
    description: "Go beyond shapes — understand why music works and use that knowledge anywhere.",
    accent: "border-violet-500/40 bg-violet-500/5",
    labelColor: "text-violet-400",
    steps: [
      { href: "/music-theory",            label: "Music Theory" },
      { href: "/standard-notation",       label: "Standard Notation" },
      { href: "/diatonic-chords",         label: "Diatonic Chords" },
      { href: "/nashville-number-system", label: "Nashville Numbers" },
      { href: "/chord-substitutions",     label: "Chord Substitutions" },
    ],
  },
  {
    title: "Bass Fundamentals",
    audience: "Learning bass guitar",
    description: "Master the low end from the ground up — anatomy, scales, groove patterns, and essential techniques.",
    accent: "border-orange-500/40 bg-orange-500/5",
    labelColor: "text-orange-400",
    steps: [
      { href: "/bass-guitar",  label: "Bass Guitar" },
      { href: "/music-theory", label: "Music Theory" },
      { href: "/scales",       label: "Guitar Scales" },
      { href: "/blues",        label: "12-Bar Blues" },
      { href: "/funk-guitar",  label: "Funk Guitar" },
    ],
  },
]

interface CategoryMeta {
  id: Category
  label: string
  dot: string
  pill: string
}

const CATEGORY_META: CategoryMeta[] = [
  { id: "foundations", label: "Foundations",      dot: "bg-sky-400",     pill: "text-sky-400 bg-sky-500/10 border-sky-500/20" },
  { id: "chords",      label: "Chords & Harmony", dot: "bg-violet-400",  pill: "text-violet-400 bg-violet-500/10 border-violet-500/20" },
  { id: "scales",      label: "Scales & Lead",    dot: "bg-emerald-400", pill: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  { id: "technique",   label: "Technique",        dot: "bg-orange-400",  pill: "text-orange-400 bg-orange-500/10 border-orange-500/20" },
  { id: "styles",      label: "Styles",           dot: "bg-pink-400",    pill: "text-pink-400 bg-pink-500/10 border-pink-500/20" },
  { id: "songs",       label: "Songs",            dot: "bg-amber-400",   pill: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
]

const MODULES: Module[] = [
  {
    href: "/how-to-use",
    title: "How to Use This App",
    description: "New here? Get an overview of all modules and follow structured learning paths for beginner, intermediate, or advanced levels.",
    cta: "View Guide",
    tags: ["guide", "beginner", "overview", "start", "learning path"],
    category: "foundations",
  },
  {
    href: "/beginner",
    title: "Beginner Module",
    description: "Just starting out? Learn guitar anatomy, how to hold your guitar, read chord diagrams, and play your first chords.",
    cta: "Start Here",
    tags: ["beginner", "basics", "first chords", "chord diagrams", "anatomy"],
    category: "foundations",
  },
  {
    href: "/music-theory",
    title: "Music Theory",
    description: "Build a strong foundation in music theory. Learn notes, intervals, chord construction, and more.",
    cta: "Study Theory",
    tags: ["theory", "notes", "intervals", "circle of fifths", "key signatures", "foundation"],
    category: "foundations",
  },
  {
    href: "/nashville-number-system",
    title: "Nashville Number System",
    description: "Learn the universal language of chord progressions. Transpose songs instantly to any key.",
    cta: "Learn the System",
    tags: ["nashville", "numbers", "transposition", "transpose", "theory", "session"],
    category: "foundations",
  },
  {
    href: "/standard-notation",
    title: "Standard Notation",
    description: "Read music the way every other instrument does. Learn the staff, note values, key signatures, and train note recognition with the interactive Note Trainer.",
    cta: "Learn to Read Music",
    tags: ["standard notation", "sheet music", "treble clef", "note reading", "rhythm", "key signatures", "sight reading"],
    category: "foundations",
  },
  {
    href: "/capo-guide",
    title: "Capo Guide",
    description: "Master the capo — transpose to any key using familiar shapes. Includes an interactive key calculator, common positions, and 20+ real song examples.",
    cta: "Use the Capo",
    tags: ["capo", "transposing", "key", "shapes", "beginner", "singer-songwriter", "open chords"],
    category: "foundations",
  },
  {
    href: "/practice-routine",
    title: "Practice Routine Builder",
    description: "Build a personalised daily practice routine. Choose your time budget, level, and focus areas — get a structured session with warm-ups, exercises, and repertoire.",
    cta: "Build My Routine",
    tags: ["practice", "routine", "warm-up", "schedule", "beginner", "intermediate", "advanced", "daily"],
    category: "foundations",
  },
  {
    href: "/ear-training",
    title: "Ear Training",
    description: "Develop your musical ear with interval recognition, chord quality identification, and melodic memory exercises — all interactive.",
    cta: "Train Your Ear",
    tags: ["ear training", "intervals", "chord recognition", "melodic memory", "listening", "pitch", "relative pitch"],
    category: "foundations",
  },
  {
    href: "/guitar-setup",
    title: "Guitar Setup & Maintenance",
    description: "Learn to restring, adjust action, set intonation, and care for your guitar. Covers truss rod basics, cleaning, and when to see a luthier.",
    cta: "Set Up Your Guitar",
    tags: ["setup", "maintenance", "restringing", "action", "intonation", "truss rod", "care"],
    category: "foundations",
  },
  {
    href: "/songwriting",
    title: "Songwriting Basics",
    description: "Learn the creative process — song structure, melody writing, chord progressions, lyric craft, and the habit of finishing songs.",
    cta: "Write Your Song",
    tags: ["songwriting", "lyrics", "melody", "song structure", "verse chorus bridge", "hook"],
    category: "foundations",
  },
  {
    href: "/chord-builder",
    title: "Chord Building",
    description: "Learn how chords are constructed from the ground up. Understand intervals, triads, and extensions.",
    cta: "Start Learning",
    tags: ["chords", "intervals", "triads", "extensions", "theory", "construction"],
    category: "chords",
  },
  {
    href: "/progressions",
    title: "Chord Progressions",
    description: "Explore common progressions used in popular music. Practice in all keys and understand the theory.",
    cta: "Explore Progressions",
    tags: ["progressions", "chords", "keys", "popular music", "I IV V", "practice"],
    category: "chords",
  },
  {
    href: "/diatonic-chords",
    title: "Diatonic Chords",
    description: "Discover the 7 chords that live inside every scale. Understand which chords belong to a key and which scales to use over any chord.",
    cta: "Explore Diatonic Harmony",
    tags: ["diatonic", "chords", "scales", "harmony", "key", "major", "minor", "theory", "I IV V"],
    category: "chords",
  },
  {
    href: "/caged-system",
    title: "CAGED System",
    description: "Master the fretboard using 5 interconnected chord shapes. See how everything connects across the neck.",
    cta: "Unlock the Fretboard",
    tags: ["caged", "fretboard", "shapes", "intermediate", "positions", "barre"],
    category: "chords",
  },
  {
    href: "/chord-substitutions",
    title: "Chord Substitutions",
    description: "Learn advanced techniques to replace chords with alternatives. Add color and sophistication to your playing.",
    cta: "Explore Substitutions",
    tags: ["substitutions", "jazz", "advanced", "theory", "reharmonization", "color"],
    category: "chords",
  },
  {
    href: "/chord-inversions",
    title: "Chord Inversions & Voice Leading",
    description: "Learn root, 1st, 2nd, and 3rd inversions. Master Drop 2 voicings and smooth voice leading for jazz, pop, and beyond.",
    cta: "Explore Inversions",
    tags: ["inversions", "voice leading", "drop 2", "slash chords", "jazz", "voicings", "harmony"],
    category: "chords",
  },
  {
    href: "/backing-chords",
    title: "Backing Chords for Scales",
    description: "Playing pentatonic, Dorian, Mixolydian, or Phrygian? Find the chord progressions that activate each scale's character.",
    cta: "Find Your Backing",
    tags: ["backing chords", "modes", "pentatonic", "dorian", "mixolydian", "phrygian", "vamp", "soloing"],
    category: "chords",
  },
  {
    href: "/scales",
    title: "Guitar Scales",
    description: "Master essential scales across the fretboard. Learn positions, patterns, and soloing techniques.",
    cta: "Learn Scales",
    tags: ["scales", "pentatonic", "major", "minor", "soloing", "fretboard", "positions"],
    category: "scales",
  },
  {
    href: "/pentatonic",
    title: "Pentatonic Mastery",
    description: "Master all 5 positions of the minor pentatonic scale. Connect them across the neck and play with classic licks, bends, and vibrato.",
    cta: "Master the Pentatonic",
    tags: ["pentatonic", "positions", "licks", "bends", "vibrato", "soloing", "fretboard", "lead guitar"],
    category: "scales",
  },
  {
    href: "/modes",
    title: "Modes Made Practical",
    description: "Understand Dorian, Mixolydian, Phrygian, Lydian, and Aeolian — with scale patterns, riffs, and real songs for each mode.",
    cta: "Explore Modes",
    tags: ["modes", "dorian", "mixolydian", "phrygian", "lydian", "aeolian", "theory", "scales", "lead guitar"],
    category: "scales",
  },
  {
    href: "/arpeggios",
    title: "Arpeggios",
    description: "Learn to play chords note-by-note across the fretboard. Essential for solos and melodic playing.",
    cta: "Master Arpeggios",
    tags: ["arpeggios", "soloing", "fretboard", "technique", "melodic", "broken chords"],
    category: "scales",
  },
  {
    href: "/improvisation",
    title: "Improvisation",
    description: "Learn to improvise with purpose — phrases, motifs, space, and dynamics that make your solos memorable and musical.",
    cta: "Start Improvising",
    tags: ["improvisation", "soloing", "phrases", "motifs", "space", "dynamics", "blues", "lead guitar"],
    category: "scales",
  },
  {
    href: "/barre-chords",
    title: "Barre Chords",
    description: "Conquer the F chord and beyond. Master E-shape and A-shape barre chords, troubleshoot buzzing, and unlock every key on the neck.",
    cta: "Crack the Barre",
    tags: ["barre chords", "F chord", "barre", "E shape", "A shape", "beginner", "intermediate", "movable chords"],
    category: "technique",
  },
  {
    href: "/techniques",
    title: "Guitar Techniques",
    description: "Master bends, vibrato, slides, legato, and muting. Step-by-step technique breakdowns with TAB examples and daily workout.",
    cta: "Build Your Technique",
    tags: ["techniques", "bends", "vibrato", "slides", "legato", "hammer-on", "pull-off", "muting"],
    category: "technique",
  },
  {
    href: "/fingerstyle-patterns",
    title: "Fingerstyle Patterns",
    description: "Master fingerpicking patterns from Travis picking to classical techniques. Build independence and fluidity.",
    cta: "Learn Patterns",
    tags: ["fingerstyle", "travis picking", "fingerpicking", "classical", "patterns", "picking"],
    category: "technique",
  },
  {
    href: "/rhythm-trainer",
    title: "Rhythm Trainer",
    description: "Master strumming patterns and timing. Learn rock, folk, reggae, and more with visual and audio guides.",
    cta: "Practice Rhythm",
    tags: ["rhythm", "strumming", "timing", "rock", "folk", "reggae", "patterns"],
    category: "technique",
  },
  {
    href: "/riffs",
    title: "Classic Riffs",
    description: "Learn iconic rock, blues, and folk riffs with full TAB. Understand what makes them great and how to build your own.",
    cta: "Learn the Riffs",
    tags: ["riffs", "rock", "blues", "folk", "classic riffs", "smoke on the water", "iron man", "wish you were here"],
    category: "technique",
  },
  {
    href: "/blues",
    title: "12-Bar Blues",
    description: "Master the foundation of blues, rock & roll, and modern music. Learn the structure, shuffle rhythm, chord shapes, and how to solo.",
    cta: "Learn the Blues",
    tags: ["blues", "12 bar", "shuffle", "I IV V", "dominant 7th", "pentatonic", "soloing", "rock", "delta blues"],
    category: "styles",
  },
  {
    href: "/funk-guitar",
    title: "Funk Guitar",
    description: "Master the chicken scratch, 16th note grooves, dominant 9th voicings, and the wah pedal. Rhythm, pocket, and space.",
    cta: "Get in the Pocket",
    tags: ["funk", "rhythm", "chicken scratch", "dead notes", "muting", "16th notes", "groove", "wah", "nile rodgers"],
    category: "styles",
  },
  {
    href: "/open-tunings",
    title: "Open Tunings",
    description: "Retune to Open G, Open D, DADGAD, and Open E. Unlock slide guitar, drone sounds, and chord voicings impossible in standard tuning.",
    cta: "Explore Open Tunings",
    tags: ["open tuning", "open g", "open d", "dadgad", "open e", "slide guitar", "keith richards", "joni mitchell"],
    category: "styles",
  },
  {
    href: "/slide-guitar",
    title: "Slide Guitar",
    description: "Learn the bottleneck technique from Delta Blues to rock. Covers slide types, intonation, vibrato, Open G, Open D, and standard tuning playing.",
    cta: "Play Slide",
    tags: ["slide guitar", "bottleneck", "open g", "open d", "vibrato", "intonation", "blues", "delta blues"],
    category: "styles",
  },
  {
    href: "/jazz-guitar",
    title: "Jazz Guitar",
    description: "Dive into jazz harmony — shell voicings, the ii–V–I progression, bebop scales, comping rhythm, and essential standards to learn.",
    cta: "Explore Jazz",
    tags: ["jazz", "ii-v-i", "shell voicings", "comping", "standards", "bebop", "dorian", "mixolydian"],
    category: "styles",
  },
  {
    href: "/bass-guitar",
    title: "Bass Guitar",
    description: "Learn the low end — anatomy, 4-string scales, groove patterns (rock, funk, reggae, jazz), and core techniques including slap & pop.",
    cta: "Play Bass",
    tags: ["bass", "bass guitar", "slap", "groove", "funk", "scales", "four string", "rhythm section"],
    category: "styles",
  },
  {
    href: "/song-library",
    title: "Song Library",
    description: "Learn 8 real songs with chord diagrams, Nashville numbers, and theory callouts. Transpose to any key.",
    cta: "Browse Songs",
    tags: ["songs", "real songs", "repertoire", "practice", "transpose", "let her go", "stand by me", "jolene", "wish you were here"],
    category: "songs",
  },
]

// ── Helpers ─────────────────────────────────────────────────────────────────

function getCategoryMeta(id: Category): CategoryMeta {
  return CATEGORY_META.find(c => c.id === id)!
}

// ── Module card ──────────────────────────────────────────────────────────────

function ModuleCard({ module }: { module: Module }) {
  const cat = getCategoryMeta(module.category)
  return (
    <Link href={module.href} className="group block">
      <div className="h-full flex flex-col bg-slate-800/50 border border-white/8 rounded-2xl p-5 hover:bg-slate-800/80 hover:border-white/15 transition-all duration-200">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h2 className="text-base font-semibold text-white leading-snug">{module.title}</h2>
          <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full border ${cat.pill}`}>
            {cat.label}
          </span>
        </div>
        <p className="text-sm text-slate-400 leading-relaxed flex-1 mb-4">{module.description}</p>
        <span className="text-sm font-medium text-purple-400 group-hover:text-purple-300 transition-colors">
          {module.cta} →
        </span>
      </div>
    </Link>
  )
}

// ── Path card ────────────────────────────────────────────────────────────────

function PathCard({ path }: { path: LearningPath }) {
  return (
    <div className={`flex flex-col border rounded-2xl p-6 ${path.accent}`}>
      <div className="mb-1">
        <span className={`text-xs font-semibold uppercase tracking-wider ${path.labelColor}`}>
          {path.audience}
        </span>
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{path.title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed mb-5">{path.description}</p>
      <ol className="space-y-2 flex-1 mb-5">
        {path.steps.map((step, i) => (
          <li key={step.href}>
            <Link
              href={step.href}
              className="flex items-center gap-3 text-sm text-slate-300 hover:text-white transition-colors group"
            >
              <span className="w-5 h-5 shrink-0 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center text-xs font-bold text-white transition-colors">
                {i + 1}
              </span>
              {step.label}
            </Link>
          </li>
        ))}
      </ol>
      <Link
        href={path.steps[0].href}
        className={`self-start text-xs font-semibold px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all`}
      >
        Start Path →
      </Link>
    </div>
  )
}

// ── Views ────────────────────────────────────────────────────────────────────

function PathsView() {
  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
      {LEARNING_PATHS.map(p => <PathCard key={p.title} path={p} />)}
    </div>
  )
}

function ThemesView({ modules }: { modules: Module[] }) {
  return (
    <div className="space-y-10">
      {CATEGORY_META.map(cat => {
        const mods = modules.filter(m => m.category === cat.id)
        if (!mods.length) return null
        return (
          <section key={cat.id}>
            <div className="flex items-center gap-2.5 mb-4">
              <span className={`w-2 h-2 rounded-full ${cat.dot}`} />
              <h2 className="text-base font-semibold text-white">{cat.label}</h2>
              <span className="text-xs text-slate-500 ml-auto">{mods.length} modules</span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mods.map(m => <ModuleCard key={m.href} module={m} />)}
            </div>
          </section>
        )
      })}
    </div>
  )
}

function AllModulesView({ modules }: { modules: Module[] }) {
  const [active, setActive] = useState<Category | "all">("all")
  const filtered = active === "all" ? modules : modules.filter(m => m.category === active)

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActive("all")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            active === "all"
              ? "bg-purple-600 text-white"
              : "text-slate-400 hover:text-white bg-white/5 hover:bg-white/10"
          }`}
        >
          All ({modules.length})
        </button>
        {CATEGORY_META.map(cat => {
          const count = modules.filter(m => m.category === cat.id).length
          return (
            <button
              key={cat.id}
              onClick={() => setActive(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                active === cat.id
                  ? "bg-purple-600 text-white"
                  : "text-slate-400 hover:text-white bg-white/5 hover:bg-white/10"
              }`}
            >
              {cat.label} ({count})
            </button>
          )
        })}
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(m => <ModuleCard key={m.href} module={m} />)}
      </div>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

const TABS: { id: ViewTab; label: string }[] = [
  { id: "paths",  label: "Learning Paths" },
  { id: "themes", label: "By Theme" },
  { id: "all",    label: "All Modules" },
]

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeView, setActiveView]   = useState<ViewTab>("paths")

  const isSearching = searchQuery.trim() !== ""
  const searchResults = MODULES.filter(m =>
    [m.title, m.description, ...m.tags].some(s =>
      s.toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 py-12">

        {/* Hero */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight">
            Guitar Lab
          </h1>
          <p className="text-slate-400 text-base">
            {MODULES.length} modules covering theory, technique, scales, and styles.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-lg mb-8">
          <div className="relative flex items-center">
            <svg className="absolute left-3.5 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search modules…"
              className="w-full bg-slate-800/60 border border-white/8 rounded-xl pl-10 pr-9 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:bg-slate-800 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 text-slate-500 hover:text-slate-300 transition-colors"
                aria-label="Clear search"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          {isSearching && (
            <p className="text-slate-500 text-xs mt-1.5 ml-1">
              {searchResults.length === 0 ? "No modules found" : `${searchResults.length} result${searchResults.length === 1 ? "" : "s"}`}
            </p>
          )}
        </div>

        {/* Tabs */}
        {!isSearching && (
          <div className="flex gap-0.5 mb-8 bg-slate-800/40 border border-white/8 p-1 rounded-xl w-fit">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activeView === tab.id
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        {isSearching ? (
          searchResults.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map(m => <ModuleCard key={m.href} module={m} />)}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-slate-300 mb-1">No modules match &ldquo;{searchQuery}&rdquo;</p>
              <p className="text-slate-500 text-sm">Try &ldquo;jazz&rdquo;, &ldquo;scales&rdquo;, or &ldquo;beginner&rdquo;</p>
            </div>
          )
        ) : activeView === "paths" ? (
          <PathsView />
        ) : activeView === "themes" ? (
          <ThemesView modules={MODULES} />
        ) : (
          <AllModulesView modules={MODULES} />
        )}

      </div>
    </div>
  )
}
