export const PATH_KEY = "lab.path.v1"

export interface PathStep { href: string; label: string }
export interface LearningPath {
  title: string
  audience: string
  description: string
  accent: string
  labelColor: string
  steps: PathStep[]
}

export const LEARNING_PATHS: LearningPath[] = [
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
      { href: "/chord-bible",             label: "Chord Bible" },
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
      { href: "/circle-of-fifths",        label: "Circle of Fifths" },
      { href: "/diatonic-chords",         label: "Diatonic Chords" },
      { href: "/tonal-map",               label: "Tonal Map" },
      { href: "/chord-substitutions",     label: "Chord Substitutions" },
    ],
  },
  {
    title: "Harmony & Composition",
    audience: "Want to write better music",
    description: "Master how chords relate, how progressions move, and how to use harmony creatively in your own songs.",
    accent: "border-purple-500/40 bg-purple-500/5",
    labelColor: "text-purple-400",
    steps: [
      { href: "/diatonic-chords",         label: "Diatonic Chords" },
      { href: "/triads",                  label: "Triads" },
      { href: "/tonal-map",               label: "Tonal Map" },
      { href: "/progressions",            label: "Progressions" },
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
  {
    title: "Harmonica Player",
    audience: "Beginner to advanced",
    description: "Hold the harp, play clean single notes, then move to cross harp blues, bending and soloing.",
    accent: "border-amber-500/40 bg-amber-500/5",
    labelColor: "text-amber-400",
    steps: [
      { href: "/harmonica",     label: "Harmonica" },
      { href: "/blues",         label: "12-Bar Blues" },
      { href: "/jam",           label: "Jam Mode" },
    ],
  },
]

