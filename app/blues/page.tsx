"use client"

import { useState } from "react"
import Link from "next/link"
import ChordDiagram from "@/components/ChordDiagram"
import { getChordVoicings } from "@/lib/chordShapes"

type Tab = "overview" | "structure" | "chords" | "shuffle" | "licks" | "feels" | "practice" | "together" | "soloing" | "songs"

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: "overview", label: "Overview", emoji: "📖" },
  { id: "structure", label: "Structure", emoji: "🗺️" },
  { id: "chords", label: "Chords", emoji: "🎸" },
  { id: "shuffle", label: "Shuffle", emoji: "🥁" },
  { id: "licks", label: "Licks", emoji: "⚡" },
  { id: "feels", label: "Feels", emoji: "🎚️" },
  { id: "practice", label: "Practice Plan", emoji: "📋" },
  { id: "together", label: "Playing Together", emoji: "👥" },
  { id: "soloing", label: "Soloing", emoji: "🎵" },
  { id: "songs", label: "Songs", emoji: "🎶" },
]

const BLUES_KEYS = [
  { key: "A", i: "A7", iv: "D7", v: "E7", iRoot: "A", ivRoot: "D", vRoot: "E", note: "Most popular guitar blues key — open strings ring out perfectly" },
  { key: "E", i: "E7", iv: "A7", v: "B7", iRoot: "E", ivRoot: "A", vRoot: "B", note: "Raw and open — huge in Delta and Chicago blues" },
  { key: "G", i: "G7", iv: "C7", v: "D7", iRoot: "G", ivRoot: "C", vRoot: "D", note: "Great for acoustic and country blues" },
  { key: "D", i: "D7", iv: "G7", v: "A7", iRoot: "D", ivRoot: "G", vRoot: "A", note: "Common in rock blues and slide guitar" },
  { key: "C", i: "C7", iv: "F7", v: "G7", iRoot: "C", ivRoot: "F", vRoot: "G", note: "Comfortable key for many guitarists" },
]

const STANDARD_BARS = ["I", "I", "I", "I", "IV", "IV", "I", "I", "V", "IV", "I", "V"]
const QUICK_CHANGE_BARS = ["I", "IV", "I", "I", "IV", "IV", "I", "I", "V", "IV", "I", "V"]

const DEGREE_COLORS: Record<string, string> = {
  I: "bg-purple-600 border-purple-400",
  IV: "bg-blue-600 border-blue-400",
  V: "bg-amber-600 border-amber-400",
}
const DEGREE_TEXT: Record<string, string> = {
  I: "text-purple-300",
  IV: "text-blue-300",
  V: "text-amber-300",
}

const FAMOUS_SONGS = [
  { song: "Pride and Joy", artist: "Stevie Ray Vaughan", key: "E", style: "Texas Blues", technique: "Heavy shuffle groove, aggressive bending", era: "1983" },
  { song: "Johnny B. Goode", artist: "Chuck Berry", key: "Bb", style: "Rock & Roll", technique: "Signature double-stop intro riff, fast shuffle", era: "1958" },
  { song: "Sweet Home Chicago", artist: "Robert Johnson", key: "E", style: "Delta Blues", technique: "Slide guitar, alternating bass picking", era: "1936" },
  { song: "Boom Boom", artist: "John Lee Hooker", key: "A", style: "Chicago Blues", technique: "Hypnotic groove, monotonic bass stomp", era: "1962" },
  { song: "The Thrill Is Gone", artist: "B.B. King", key: "B minor", style: "Modern Blues", technique: "Single-note leads, vibrato, Lucille's singing tone", era: "1969" },
  { song: "La Grange", artist: "ZZ Top", key: "A", style: "Blues Rock", technique: "Boogie shuffle riff, fierce picking attack", era: "1973" },
  { song: "Crossroads", artist: "Cream (Robert Johnson)", key: "A", style: "Blues Rock", technique: "Clapton's driving pentatonic runs over shuffle", era: "1968" },
  { song: "Stormy Monday", artist: "T-Bone Walker", key: "G", style: "Classic Blues", technique: "Jazz-influenced chord melody, smooth electric tone", era: "1947" },
  { song: "Mannish Boy", artist: "Muddy Waters", key: "E", style: "Chicago Blues", technique: "Electric slide, powerful riff repetition", era: "1955" },
  { song: "Hound Dog", artist: "Willie Mae Thornton / Elvis", key: "C", style: "Rhythm & Blues", technique: "Driving 12/8 feel, simple but powerful chords", era: "1952" },
]

// ─── Licks data (all in key of A for consistency) ─────────────────────────────
const LICKS = [
  {
    name: "Classic Intro Lick",
    category: "intro",
    desc: "The 'here we go' announcement. Play this before bar 1 kicks in. Starts on the V chord and falls down to announce the key.",
    tab: [
      "e|--------------------------------|",
      "B|--------------------------------|",
      "G|--------------------------------|",
      "D|---2---0------------------------|",
      "A|--------2---0---2---0-----------|",
      "E|------------------0-------------|",
    ],
    tip: "Bend the D string fret 2 slightly as you hit it. The slide down to open A is the payoff.",
  },
  {
    name: "Standard Turnaround (Bars 11–12)",
    category: "turnaround",
    desc: "The most common turnaround lick. Walks down the A blues scale from the high E and resolves on the root before bar 1.",
    tab: [
      "e|--8---5-----------------------------|",
      "B|--------8---5-----------------------|",
      "G|------------7---5-------------------|",
      "D|----------------7---5---------------|",
      "A|--------------------7---5---7---0---|",
      "E|------------------------------------|",
    ],
    tip: "The last two notes (E string fret 7 → open A) are the 'V to I' pull. You can slide into that final A for drama.",
  },
  {
    name: "B.B. King Box Lick",
    category: "lead",
    desc: "The signature B.B. King move — a bent note with vibrato sitting right in the 'sweet spot' between boxes 1 and 2.",
    tab: [
      "e|--8b(10)~~---8---5---------------|",
      "B|------------------8---5---------|",
      "G|--------------------------7-----|",
      "D|--------------------------------|",
      "A|--------------------------------|",
      "E|--------------------------------|",
    ],
    tip: "The '~~' is vibrato. After bending to the 10th fret pitch, wobble the string continuously. This is B.B.'s whole identity.",
  },
  {
    name: "Double-Stop Riff",
    category: "lead",
    desc: "Two notes at once — the Chuck Berry / Blues Rock staple. Play these on the G and B strings together for a gritty, rich sound.",
    tab: [
      "e|-------------------------------|",
      "B|---5---5---5---5---5---5---5---|",
      "G|---5---5---6---6---7---7---7---|",
      "D|-------------------------------|",
      "A|-------------------------------|",
      "E|-------------------------------|",
    ],
    tip: "Frets 5/5 = D and G notes (minor 3rd). Frets 6/5 = add tension. Frets 7/5 = push to the 4th. Slide between them for swagger.",
  },
  {
    name: "Call-and-Response Fill",
    category: "fill",
    desc: "A short phrase followed by deliberate silence. Play this between chord stabs when comping. The space is as important as the notes.",
    tab: [
      "e|------------------------------------------|",
      "B|------------------------------------------|",
      "G|---7b(8)---7---5---7---5------------------|",
      "D|-----------------------------7---5---------|",
      "A|-----------------------------------7------|",
      "E|------------------------------------------|",
    ],
    tip: "After the last note, stop and let it ring or decay. Count two beats of silence before your next phrase. Breathe.",
  },
  {
    name: "Chord-to-Chord Chromatic Fill",
    category: "fill",
    desc: "A chromatic walkup that connects bar 6 (IV) back to bar 7 (I). Makes the chord change sound intentional and musical.",
    tab: [
      "e|-------------------------------|",
      "B|-------------------------------|",
      "G|-------------------------------|",
      "D|---0---1---2---3---4---5-------|",
      "A|-------------------------------|",
      "E|-------------------------------|",
    ],
    tip: "Play this on the last two beats of the IV bar. Each fret is a half step. Arrive on fret 5 = A, your I root. Very effective.",
  },
]

// ─── Bass Walkups ──────────────────────────────────────────────────────────────
const WALKUPS = [
  {
    from: "A7 → D7",
    bars: "Bar 4 → Bar 5",
    desc: "Walk up from the A root to the D root using bass notes. Use the last beat of bar 4.",
    tab: [
      "e|-------------------------------|",
      "B|-------------------------------|",
      "G|-------------------------------|",
      "D|---0---2---3---4---5-----------|",
      "A|---0---------------------------|",
      "E|-------------------------------|",
    ],
    tip: "Start on open A string (your I root), walk up D string: open → 2 → 3 → 4 → 5 (D). You've arrived on D, your IV root.",
  },
  {
    from: "D7 → A7",
    bars: "Bar 6 → Bar 7",
    desc: "Walk back down from D to A. Use the last two beats of bar 6.",
    tab: [
      "e|-------------------------------|",
      "B|-------------------------------|",
      "G|-------------------------------|",
      "D|---5---4---3---2---0-----------|",
      "A|-------------------------------|",
      "E|---0---------------------------|",
    ],
    tip: "Descend D string from fret 5 to open, then land on open low E (same pitch as A string but one octave lower). Powerful drop.",
  },
  {
    from: "A7 → E7",
    bars: "Bar 8 → Bar 9",
    desc: "Classic walkup to the V chord. Chromatic climb from A to E.",
    tab: [
      "e|-------------------------------|",
      "B|-------------------------------|",
      "G|-------------------------------|",
      "D|-------------------------------|",
      "A|---0---2---3---4---5---6---7---|",
      "E|-------------------------------|",
    ],
    tip: "Walk up the A string: open A → fret 7 = E. Each step is intentional. The arrival on fret 7 (E) signals the V chord with authority.",
  },
  {
    from: "E7 → A7 (Turnaround)",
    bars: "Bar 12 → Bar 1",
    desc: "The turnaround walkdown. Descend from E back to A as the progression loops back to the top.",
    tab: [
      "e|-------------------------------|",
      "B|-------------------------------|",
      "G|-------------------------------|",
      "D|-------------------------------|",
      "A|---7---6---5---4---3---2---0---|",
      "E|-------------------------------|",
    ],
    tip: "This is the 'reset' that tells every musician in the room the form is starting again. Learn this and you can jam with anyone.",
  },
]

// ─── Rhythm Feels ─────────────────────────────────────────────────────────────
const FEELS = [
  {
    name: "Slow Blues (12/8)",
    bpm: "50–70 BPM",
    icon: "🐢",
    color: "border-blue-500",
    desc: "The most emotional feel. Three equal subdivisions per beat instead of two — it breathes and aches. Think 'The Thrill Is Gone' by B.B. King. The space between notes is enormous.",
    howToPlay: "Count '1-and-a 2-and-a 3-and-a 4-and-a' and play on the '1' and 'and' of each group (skipping the 'a'). The groove is lazy and behind the beat. Let notes sustain fully.",
    characters: ["Emotional", "Spacious", "Singing tone", "Vibrato-heavy"],
    example: "The Thrill Is Gone — B.B. King",
  },
  {
    name: "Medium Shuffle",
    bpm: "85–110 BPM",
    icon: "🚶",
    color: "border-purple-500",
    desc: "The heartbeat of blues. The classic long-short swing feel that makes people nod their heads involuntarily. Most electric blues songs live here. The shuffle riff groove sits perfectly at these tempos.",
    howToPlay: "Swing your eighth notes — play the downbeat long and the upbeat short, like a slight limp. The boogie riff (root + 5th + 6th alternating) is your foundation here.",
    characters: ["Groovy", "Confident", "Shuffle riff territory", "Physical, visceral"],
    example: "Pride and Joy — SRV, La Grange — ZZ Top",
  },
  {
    name: "Fast Rock Shuffle",
    bpm: "140–180 BPM",
    icon: "🏃",
    color: "border-red-500",
    desc: "Blues at full speed. The shuffle feel is still there but compressed. Chuck Berry and early rock & roll lived here. Energy over nuance — but the form is still 12 bars.",
    howToPlay: "At these tempos, full chord changes are difficult. Play power chords or simplified versions. Focus on the rhythmic drive. The shuffle feel is subtle — it's more about forward momentum.",
    characters: ["Energetic", "Driving", "Chuck Berry territory", "Power chord friendly"],
    example: "Johnny B. Goode — Chuck Berry",
  },
  {
    name: "Funk Blues (16th Note)",
    bpm: "80–100 BPM",
    icon: "🕺",
    color: "border-amber-500",
    desc: "Straight 16th notes instead of swing 8ths. Funk-influenced blues with heavy muting and rhythmic precision. Stevie Wonder, early SRV, and Texas blues uses this feel. Tight and percussive.",
    howToPlay: "Mute the strings lightly with your fretting hand and strum 16th notes evenly (4 strums per beat). Accent beat 1 and the 'and' of beat 2. Ghost notes (muted strums) fill the space between accented notes.",
    characters: ["Tight", "Percussive", "Funky", "16th note subdivision"],
    example: "Superstition feel — Stevie Wonder",
  },
  {
    name: "Straight Rock",
    bpm: "100–130 BPM",
    icon: "⚡",
    color: "border-emerald-500",
    desc: "No swing — straight 8th notes. Power chords, distortion, and aggression. This is blues-rock: the same 12-bar form, but the swing is gone. Cream, Led Zeppelin, and Hendrix explored this territory.",
    howToPlay: "Play all eighth notes evenly (no swing). Distortion replaces nuance — hit the strings hard. Power chords (root + 5th) work better than full dominant 7ths at high gain. Let it roar.",
    characters: ["Aggressive", "Distorted", "No swing", "Riff-based"],
    example: "Crossroads — Cream",
  },
]

// ─── Practice Levels ──────────────────────────────────────────────────────────
const PRACTICE_LEVELS = [
  {
    level: 1,
    title: "Know the Form",
    duration: "Days 1–3",
    color: "border-emerald-500",
    goal: "You can play through all 12 bars without losing your place.",
    tasks: [
      "Memorise the 12-bar structure (write it on paper: I I I I | IV IV I I | V IV I V)",
      "Play the I7 chord only, counting 1-2-3-4 for each bar. Say the chord name out loud as you reach bar 5 (IV) and bar 9 (V).",
      "Do this at 60 BPM with a metronome. No shuffle yet — just even downstrokes.",
      "Loop it 5 times without stopping. Your internal clock is the skill being trained.",
    ],
    tip: "If you lose your place, it's fine. Just restart bar 1. Learning the form takes time — it lives in your body, not your head.",
  },
  {
    level: 2,
    title: "Three Chords, Clean Changes",
    duration: "Days 4–7",
    color: "border-blue-500",
    goal: "You can switch between I7, IV7, and V7 cleanly at the right bar.",
    tasks: [
      "Learn the open shapes: A7 (x02020), D7 (xx0212), E7 (020100). Practice each one until it's clean.",
      "Go back to 60 BPM. Now actually change to D7 at bar 5, E7 at bar 9, back to D7 at bar 10, back to A7 at bar 11, E7 at bar 12.",
      "The change must happen on beat 1 of the right bar. Early or late both count as wrong.",
      "When clean, raise to 70 BPM. Then 80.",
    ],
    tip: "Anticipate every change 1–2 beats before it arrives. Your fretting hand should be moving before beat 1 of the new bar.",
  },
  {
    level: 3,
    title: "Add the Shuffle",
    duration: "Week 2",
    color: "border-purple-500",
    goal: "The progression grooves. People could identify it as blues without being told.",
    tasks: [
      "Replace the chord strumming with the shuffle riff on the I chord (root + 5th + 6th alternating on the two bass strings).",
      "Add the D7 shuffle riff for bars 5–6 (same pattern, shifted to the D and G strings).",
      "Add the E7 shuffle riff for bar 9 (shifted to the E and A strings).",
      "Loop at 80–90 BPM and add the bass walkup from A to D at bar 4 → 5.",
      "Record yourself on your phone. Does it groove? Would you nod your head to it?",
    ],
    tip: "The shuffle riff is the hardest level jump. It takes 1–2 weeks to feel natural. Slow it down ruthlessly — 60 BPM is fine. Speed comes after feel.",
  },
  {
    level: 4,
    title: "Add Licks and Fills",
    duration: "Weeks 3–4",
    color: "border-amber-500",
    goal: "The progression has personality — not just correct notes but character.",
    tasks: [
      "Learn the standard turnaround lick and add it at bars 11–12.",
      "Learn one intro lick and use it to announce bar 1.",
      "Learn one call-and-response fill and insert it in bar 4 (between I and IV).",
      "Practice bass walkups: I → IV at bar 4, IV → I at bar 6, I → V at bar 8.",
      "Now play the full 12 bars with shuffle + intro lick + fills + turnaround. It should feel like a complete performance.",
    ],
    tip: "Don't try to fill every bar. Leave space. Two or three well-placed licks across 12 bars sound far better than constant busy-ness.",
  },
  {
    level: 5,
    title: "Improvise Over It",
    duration: "Week 5+",
    color: "border-red-500",
    goal: "You can improvise a solo over the 12-bar form while keeping your place in the progression.",
    tasks: [
      "Put on a 12-bar blues backing track in A at a comfortable tempo (YouTube: '12 bar blues backing track A 80bpm').",
      "Play ONLY the blues scale (Box 1) using single notes. Count bars out loud in your head.",
      "When you reach bar 5 (IV), move toward a note in the D7 chord. When bar 9 (V) hits, feel the tension rise.",
      "Practice ending phrases on the turnaround (bars 11–12) with a clear musical resolution.",
      "Vary your dynamics — play some phrases quietly, some with full aggression.",
    ],
    tip: "The moment you can improvise AND count the form simultaneously, you're a blues guitarist. That's the breakthrough moment. It feels impossible and then it doesn't.",
  },
]

// ─── Playing Together ─────────────────────────────────────────────────────────
const COMPING_TIPS = [
  {
    title: "Rhythm Guitar vs Lead Guitar",
    icon: "⚔️",
    body: "When someone else is soloing, your job is to support them, not compete. Play the shuffle groove quietly, leave the high strings open, and listen. When they pause, you can fill. When they play, you lay back. Two guitars talking to each other, not over each other.",
  },
  {
    title: "Comping — The Art of Playing Softly Behind a Solo",
    icon: "🤫",
    body: "Comp = accompaniment. Behind a vocalist or lead guitarist: play short, muted chord stabs on beats 2 and 4. Turn your volume knob down 30%. Stay in the low register (frets 0–5). Your job is to keep the harmony clear and the groove solid, invisibly.",
  },
  {
    title: "The Call-and-Response Conversation",
    icon: "💬",
    body: "Blues is a conversation. When the lead guitar plays a phrase, the rhythm guitar can respond — or the vocalist responds. In a two-guitar setting, try this: Guitar 1 plays a 4-note lick. Guitar 2 answers with a 3-note lick. Then Guitar 1 responds again. No plan — just listen and react.",
  },
  {
    title: "Trading 4s",
    icon: "🔄",
    body: "A common blues jam format: one player solos for 4 bars (bars 1–4), the other solos for 4 bars (bars 5–8), then both play the turnaround together (bars 9–12). You must know the form cold to trade — otherwise you'll enter at the wrong bar. This is the highest test of your 12-bar knowledge.",
  },
  {
    title: "Following the Singer",
    icon: "🎤",
    body: "In a band with a vocalist, the guitar fills the gaps in the vocal line. Singers breathe at the end of lines — that's your moment to insert a lick. Don't play over the singing. Think of the singer as the lead and your guitar as the response. This is how blues was designed from the start.",
  },
  {
    title: "Dynamics Are Everything",
    icon: "📊",
    body: "A blues band that plays at one volume all night is exhausting to listen to. Build: start quiet (verse), push (chorus), build tension (V chord), release (back to I). The best blues performances feel like a conversation with the audience, rising and falling with emotional energy.",
  },
]

const TRADING_STRUCTURE = [
  { bars: "1–4", player: "Guitar 1", label: "Solo", color: "bg-purple-600" },
  { bars: "5–8", player: "Guitar 2", label: "Solo", color: "bg-blue-600" },
  { bars: "9–10", player: "Both", label: "Build to turnaround", color: "bg-amber-600" },
  { bars: "11–12", player: "Both", label: "Turnaround together", color: "bg-emerald-600" },
]

export default function BluesPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview")
  const [selectedKeyIndex, setSelectedKeyIndex] = useState(0)
  const [quickChange, setQuickChange] = useState(false)
  const [selectedBar, setSelectedBar] = useState<number | null>(null)
  const [selectedLickCategory, setSelectedLickCategory] = useState("all")

  const currentKey = BLUES_KEYS[selectedKeyIndex]
  const bars = quickChange ? QUICK_CHANGE_BARS : STANDARD_BARS

  const getChordForDegree = (degree: string) => {
    if (degree === "I") return { name: currentKey.i, root: currentKey.iRoot }
    if (degree === "IV") return { name: currentKey.iv, root: currentKey.ivRoot }
    return { name: currentKey.v, root: currentKey.vRoot }
  }

  const getVoicing = (root: string, voicingIndex = 0) => {
    const voicings = getChordVoicings(root, "Dominant 7th")
    if (!voicings || voicings.length === 0) return null
    return voicings[voicingIndex] ?? voicings[0]
  }

  const lickCategories = ["all", "intro", "turnaround", "lead", "fill"]
  const filteredLicks = selectedLickCategory === "all"
    ? LICKS
    : LICKS.filter(l => l.category === selectedLickCategory)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-5xl">

        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-purple-300 hover:text-purple-200 mb-4 inline-block text-sm">
            ← Back to Home
          </Link>
          <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">12-Bar Blues</h1>
          <p className="text-purple-200">The foundation of blues, rock & roll, and modern music</p>
        </div>

        {/* Key Selector */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-purple-300 text-sm font-semibold">Key:</span>
            {BLUES_KEYS.map((k, i) => (
              <button
                key={k.key}
                onClick={() => { setSelectedKeyIndex(i); setSelectedBar(null) }}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                  selectedKeyIndex === i
                    ? "bg-amber-500 text-white scale-105"
                    : "bg-white/20 text-purple-200 hover:bg-white/30"
                }`}
              >
                {k.key}
              </button>
            ))}
            <span className="text-purple-400 text-xs ml-2 italic">{currentKey.note}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-2 mb-8 pb-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-purple-600 text-white"
                  : "bg-white/10 text-purple-200 hover:bg-white/20"
              }`}
            >
              <span>{tab.emoji}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ─── OVERVIEW ──────────────────────────────────────────────── */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">What is the 12-Bar Blues?</h2>
              <p className="text-purple-200 leading-relaxed mb-4">
                The 12-bar blues is a chord progression — 12 bars long — that repeats continuously throughout a song.
                It uses exactly three chords (the I, IV, and V) and it&apos;s the harmonic foundation of blues,
                rock & roll, jazz, R&B, and country. If you understand the 12-bar blues, you understand the
                DNA of most popular music since 1900.
              </p>
              <div className="bg-amber-500/20 border border-amber-500/40 rounded-xl p-4">
                <p className="text-amber-200 text-sm leading-relaxed">
                  <span className="font-bold text-amber-300">Why does it sound &ldquo;bluesy&rdquo;?</span> The three chords
                  are all dominant 7ths (A7, D7, E7). The dominant 7th chord has a natural tension built into it —
                  the added b7 note wants to resolve. When you keep that tension going through all three chords,
                  it creates that bittersweet, unresolved feeling that defines the blues.
                </p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">The Three Chords — I, IV, V</h2>
              <p className="text-purple-200 text-sm mb-4">
                Every 12-bar blues uses the same three chords relative to the key, labelled by Roman numeral. In the key of A:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { degree: "I", name: "Tonic", chord: "A7", color: "bg-purple-600", desc: "Home base. The chord you always return to. Sounds 'at rest'." },
                  { degree: "IV", name: "Subdominant", chord: "D7", color: "bg-blue-600", desc: "Creates movement away from home. Builds anticipation." },
                  { degree: "V", name: "Dominant", chord: "E7", color: "bg-amber-600", desc: "Strongest tension. Pulls hard back to the I chord." },
                ].map(item => (
                  <div key={item.degree} className={`${item.color}/20 border border-white/20 rounded-xl p-4 text-center`}>
                    <div className="text-3xl font-black text-white mb-1">{item.degree}</div>
                    <div className="text-white font-bold mb-1">{item.chord}</div>
                    <div className="text-purple-300 text-xs font-semibold mb-2">{item.name}</div>
                    <p className="text-purple-200 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">A Brief History</h2>
              <div className="space-y-4">
                {[
                  { era: "1890s–1920s", title: "Mississippi Delta", desc: "The 12-bar form emerged from African American work songs, field hollers, and spirituals in the Deep South. Early blues musicians like Robert Johnson and Charley Patton used it to express hardship, longing, and resilience." },
                  { era: "1940s–1950s", title: "Chicago Blues Goes Electric", desc: "Muddy Waters, Howlin' Wolf, and B.B. King electrified the blues. The 12-bar form moved from acoustic guitars and front porches to amplifiers and nightclubs, developing that gritty, overdriven tone." },
                  { era: "1950s–1960s", title: "Rock & Roll is Born", desc: "Chuck Berry, Little Richard, and Elvis Presley took the 12-bar form and sped it up. The blues became rock & roll. Songs like Johnny B. Goode are textbook 12-bar blueprints at 160+ BPM." },
                  { era: "1960s–Today", title: "Blues Rock and Beyond", desc: "Eric Clapton, Jimi Hendrix, Stevie Ray Vaughan, ZZ Top — blues rock took the 12-bar and added aggression, distortion, and virtuosity. Today the form lives in jazz, funk, country, and indie music alike." },
                ].map(item => (
                  <div key={item.era} className="flex gap-4">
                    <div className="shrink-0 text-amber-400 font-bold text-sm w-24">{item.era}</div>
                    <div>
                      <div className="text-white font-semibold mb-1">{item.title}</div>
                      <p className="text-purple-200 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-3">Why You Should Learn This First</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { icon: "⚡", title: "Instantly playable", desc: "Three chords. You can learn the shapes in an afternoon and jam with other musicians the same day." },
                  { icon: "👂", title: "Trains your ear", desc: "The I-IV-V movement is so fundamental that learning to hear it unlocks your ability to figure out thousands of songs by ear." },
                  { icon: "🎸", title: "Gateway to soloing", desc: "The blues scale fits perfectly over all three chords. Once you know the form, you can improvise immediately." },
                  { icon: "🌍", title: "Universal language", desc: "Play with any musician anywhere in the world. Call out a key and everyone knows what to do." },
                ].map(item => (
                  <div key={item.title} className="bg-white/5 rounded-xl p-4 flex gap-3">
                    <span className="text-2xl shrink-0">{item.icon}</span>
                    <div>
                      <div className="text-white font-semibold text-sm mb-1">{item.title}</div>
                      <p className="text-purple-300 text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── STRUCTURE ─────────────────────────────────────────────── */}
        {activeTab === "structure" && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20">
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-white font-semibold">Variation:</span>
                <button onClick={() => { setQuickChange(false); setSelectedBar(null) }} className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${!quickChange ? "bg-purple-600 text-white" : "bg-white/20 text-purple-200 hover:bg-white/30"}`}>Standard</button>
                <button onClick={() => { setQuickChange(true); setSelectedBar(null) }} className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${quickChange ? "bg-purple-600 text-white" : "bg-white/20 text-purple-200 hover:bg-white/30"}`}>Quick Change</button>
                <span className="text-purple-400 text-xs italic">{quickChange ? "Quick change goes to IV in bar 2" : "Standard form stays on I for 4 bars"}</span>
              </div>
            </div>

            <div className="flex gap-4 flex-wrap">
              {[
                { degree: "I", label: `I — ${currentKey.i} (Tonic)`, color: "bg-purple-600" },
                { degree: "IV", label: `IV — ${currentKey.iv} (Subdominant)`, color: "bg-blue-600" },
                { degree: "V", label: `V — ${currentKey.v} (Dominant)`, color: "bg-amber-600" },
              ].map(item => (
                <div key={item.degree} className="flex items-center gap-2 text-sm text-purple-200">
                  <div className={`w-4 h-4 rounded ${item.color}`} />
                  {item.label}
                </div>
              ))}
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-5">12-Bar Blues in {currentKey.key} — {quickChange ? "Quick Change" : "Standard"}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-2">
                {bars.map((degree, i) => {
                  const chord = getChordForDegree(degree)
                  const isSelected = selectedBar === i
                  return (
                    <button key={i} onClick={() => setSelectedBar(isSelected ? null : i)}
                      className={`relative rounded-xl p-4 text-center border-2 transition-all active:scale-95 ${isSelected ? `${DEGREE_COLORS[degree]} shadow-lg scale-105` : "bg-white/5 border-white/10 hover:bg-white/10"}`}>
                      <div className="text-xs text-purple-400 mb-1">Bar {i + 1}</div>
                      <div className={`text-xl font-black ${isSelected ? "text-white" : "text-purple-200"}`}>{chord.name}</div>
                      <div className={`text-xs font-bold mt-1 ${isSelected ? "text-white/80" : DEGREE_TEXT[degree]}`}>{degree}</div>
                      {quickChange && i === 1 && !isSelected && <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">Quick Change</div>}
                      {i === 11 && <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">Turnaround</div>}
                    </button>
                  )
                })}
              </div>
              <p className="text-purple-400 text-xs mt-3">Click any bar to highlight it</p>
            </div>

            {selectedBar !== null && (() => {
              const degree = bars[selectedBar]
              const chord = getChordForDegree(degree)
              const voicing = getVoicing(chord.root)
              return (
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                  <h3 className="text-white font-bold text-lg mb-1">Bar {selectedBar + 1}: <span className={DEGREE_TEXT[degree]}>{chord.name} ({degree})</span></h3>
                  <p className="text-purple-300 text-sm mb-5">
                    {degree === "I" && "Home chord — the tonic. The chord the song revolves around."}
                    {degree === "IV" && "Subdominant — moves away from home, creates anticipation."}
                    {degree === "V" && "Dominant — strongest tension, pulls back to the I chord."}
                  </p>
                  {voicing ? <ChordDiagram chordName={chord.name} fingers={voicing.fingers} size="large" /> : <p className="text-purple-400 text-sm">Chord diagram unavailable</p>}
                </div>
              )
            })()}

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                <div className="text-emerald-300 font-bold mb-2">The Turnaround (Bar 12)</div>
                <p className="text-purple-200 text-sm leading-relaxed">Bar 12 is the V chord — it creates tension that resolves back to the I in bar 1 when the progression loops. This &ldquo;turnaround&rdquo; is what makes the 12-bar feel circular and continuous.</p>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                <div className="text-amber-300 font-bold mb-2">Quick Change</div>
                <p className="text-purple-200 text-sm leading-relaxed">The quick change moves to the IV chord in bar 2 instead of staying on I. It adds harmonic movement earlier, making the progression feel more energetic from the very start.</p>
              </div>
            </div>
          </div>
        )}

        {/* ─── CHORDS ────────────────────────────────────────────────── */}
        {activeTab === "chords" && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-3">Why Dominant 7th Chords?</h2>
              <p className="text-purple-200 text-sm leading-relaxed mb-4">
                Standard major chords sound resolved and happy. The dominant 7th adds one extra note — the flattened 7th — creating a natural tension that never fully resolves. That perpetual sweet tension is the blues sound.
              </p>
              <div className="bg-purple-500/20 border border-purple-500/40 rounded-xl p-4">
                <p className="text-purple-200 text-sm">
                  <span className="font-bold text-white">In classical theory</span>, a dominant 7th on the V wants to resolve to the I. In the blues, <em>all three chords</em> are dominant 7ths — so nothing ever fully resolves. That&apos;s the restless, longing quality.
                </p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-6">The Three Chords — Key of {currentKey.key}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                {[
                  { degree: "I", chord: currentKey.i, root: currentKey.iRoot, label: "Tonic", color: "border-purple-500", textColor: "text-purple-300" },
                  { degree: "IV", chord: currentKey.iv, root: currentKey.ivRoot, label: "Subdominant", color: "border-blue-500", textColor: "text-blue-300" },
                  { degree: "V", chord: currentKey.v, root: currentKey.vRoot, label: "Dominant", color: "border-amber-500", textColor: "text-amber-300" },
                ].map(item => {
                  const voicing = getVoicing(item.root)
                  return (
                    <div key={item.degree} className={`bg-white/5 rounded-2xl p-5 border-t-4 ${item.color} flex flex-col items-center gap-3`}>
                      <div className="text-center">
                        <div className={`text-2xl font-black ${item.textColor}`}>{item.degree}</div>
                        <div className="text-white font-bold">{item.chord}</div>
                        <div className="text-purple-400 text-xs">{item.label}</div>
                      </div>
                      {voicing ? <ChordDiagram chordName={item.chord} fingers={voicing.fingers} size="large" /> : <p className="text-purple-400 text-sm">Unavailable</p>}
                      <div className="text-purple-400 text-xs text-center">{voicing?.position}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-white font-bold text-lg mb-4">How a Dominant 7th is Built</h3>
              <div className="grid sm:grid-cols-4 gap-3">
                {[
                  { step: "Root", interval: "1", example: "A", color: "bg-purple-600" },
                  { step: "Major 3rd", interval: "3", example: "C#", color: "bg-blue-600" },
                  { step: "Perfect 5th", interval: "5", example: "E", color: "bg-emerald-600" },
                  { step: "Minor 7th", interval: "b7", example: "G", color: "bg-amber-600" },
                ].map(item => (
                  <div key={item.step} className={`${item.color}/20 border border-white/10 rounded-xl p-3 text-center`}>
                    <div className="text-2xl font-black text-white mb-1">{item.interval}</div>
                    <div className="text-white font-semibold text-sm">{item.step}</div>
                    <div className="text-purple-300 text-xs mt-1">e.g. {item.example} in A7</div>
                  </div>
                ))}
              </div>
              <p className="text-purple-300 text-sm mt-4 leading-relaxed">
                The b7 (minor 7th) is the note that creates the bluesy tension. In A7, that&apos;s the note G. It clashes subtly against the major 3rd (C#), creating that irresistible push-pull sound.
              </p>
            </div>
          </div>
        )}

        {/* ─── SHUFFLE ───────────────────────────────────────────────── */}
        {activeTab === "shuffle" && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-3">The Shuffle Feel</h2>
              <p className="text-purple-200 text-sm leading-relaxed mb-4">
                The shuffle is the heartbeat of the blues. Instead of playing straight 8th notes (even spacing), you play a long-short pattern — like a limp, or a triplet feel where you skip the middle note.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-purple-300 font-semibold mb-2">Straight 8ths (boring)</div>
                  <div className="font-mono text-white text-sm tracking-widest">1 + 2 + 3 + 4 +</div>
                  <p className="text-purple-400 text-xs mt-2">All notes equal length — robotic</p>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                  <div className="text-amber-300 font-semibold mb-2">Shuffle 8ths (bluesy)</div>
                  <div className="font-mono text-white text-sm tracking-widest">1 — a 2 — a 3 — a 4 — a</div>
                  <p className="text-purple-300 text-xs mt-2">Long-short-long-short — that&apos;s the blues!</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">The Shuffle Riff (Boogie Pattern) — Key of A</h2>
              <p className="text-purple-200 text-sm mb-5">
                The classic blues shuffle alternates between the 5th and 6th of each chord on the two bass strings.
              </p>
              <div className="space-y-6">
                {[
                  { chord: "A7 (I chord — bars 1–4, 7–8, 11)", desc: "Root on open A string. Alternate between E (fret 2) and F# (fret 4) on the D string.", tab: ["e|----------------------------------|", "B|----------------------------------|", "G|----------------------------------|", "D|----2---4---2---4---2---4---2---4-|", "A|--0---0---0---0---0---0---0---0---|", "E|----------------------------------|"], note: "D string: fret 2 = E (5th), fret 4 = F# (6th)" },
                  { chord: "D7 (IV chord — bars 5–6)", desc: "Root on open D string. Alternate between A (fret 2) and B (fret 4) on the G string.", tab: ["e|----------------------------------|", "B|----------------------------------|", "G|----2---4---2---4---2---4---2---4-|", "D|--0---0---0---0---0---0---0---0---|", "A|----------------------------------|", "E|----------------------------------|"], note: "G string: fret 2 = A (5th), fret 4 = B (6th)" },
                  { chord: "E7 (V chord — bar 9)", desc: "Root on open E string. Alternate between B (fret 2) and C# (fret 4) on the A string.", tab: ["e|----------------------------------|", "B|----------------------------------|", "G|----------------------------------|", "D|----------------------------------|", "A|----2---4---2---4---2---4---2---4-|", "E|--0---0---0---0---0---0---0---0---|"], note: "A string: fret 2 = B (5th), fret 4 = C# (6th)" },
                ].map(item => (
                  <div key={item.chord} className="bg-white/5 rounded-xl p-5">
                    <div className="text-white font-bold mb-1">{item.chord}</div>
                    <p className="text-purple-300 text-sm mb-3">{item.desc}</p>
                    <pre className="font-mono text-green-300 text-xs bg-black/40 rounded-lg p-4 overflow-x-auto leading-relaxed">{item.tab.join("\n")}</pre>
                    <p className="text-purple-400 text-xs mt-2 italic">{item.note}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">Making It Groove</h2>
              <div className="space-y-4">
                {[
                  { title: "Use downstrokes", body: "Play all notes with downstrokes. The attack gives the shuffle its gritty authority." },
                  { title: "Palm mute lightly", body: "Rest the edge of your picking hand near the bridge. Gives notes a tighter, more percussive sound." },
                  { title: "Accent beats 2 and 4", body: "In blues, 2 and 4 are the groove points. Nod your head on 2 and 4, not 1 and 3." },
                  { title: "Start slow, feel it first", body: "At slow tempos, play evenly. Gradually let the swing creep in. Listen to Muddy Waters and imitate the pocket, not the notes." },
                ].map(item => (
                  <div key={item.title} className="bg-white/5 rounded-xl p-4">
                    <div className="text-amber-300 font-semibold mb-1">{item.title}</div>
                    <p className="text-purple-200 text-sm leading-relaxed">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── LICKS ─────────────────────────────────────────────────── */}
        {activeTab === "licks" && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20">
              <p className="text-purple-200 text-sm leading-relaxed">
                All licks are shown in the key of A — the most common key to learn blues in. Once you know a lick
                in A, shift the whole pattern up or down the neck to play it in any key.
              </p>
            </div>

            {/* Category filter */}
            <div className="flex flex-wrap gap-2">
              {lickCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedLickCategory(cat)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm capitalize transition-all ${selectedLickCategory === cat ? "bg-purple-600 text-white" : "bg-white/10 text-purple-200 hover:bg-white/20"}`}
                >
                  {cat === "all" ? "All Licks" : cat}
                </button>
              ))}
            </div>

            <div className="space-y-5">
              {filteredLicks.map((lick, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-white font-bold text-lg">{lick.name}</h3>
                    <span className="bg-purple-600/40 text-purple-200 text-xs px-2.5 py-1 rounded-full font-medium capitalize shrink-0">{lick.category}</span>
                  </div>
                  <p className="text-purple-200 text-sm leading-relaxed mb-4">{lick.desc}</p>
                  <pre className="font-mono text-green-300 text-xs bg-black/40 rounded-xl p-4 overflow-x-auto leading-relaxed">{lick.tab.join("\n")}</pre>
                  <div className="mt-3 bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-2.5">
                    <span className="text-amber-300 font-semibold text-xs">Tip: </span>
                    <span className="text-purple-200 text-xs">{lick.tip}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bass Walkups */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-white mb-2">Bass Walkups</h2>
              <p className="text-purple-300 text-sm mb-5">
                Walkups connect chord changes using ascending or descending bass notes. They signal upcoming chord changes
                to every musician in the room — and make you sound like you&apos;ve been playing blues for 20 years.
                Play them on the last 1–2 beats of the departing bar.
              </p>
              <div className="space-y-5">
                {WALKUPS.map((wu, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-white font-bold text-lg">{wu.from}</span>
                      <span className="text-purple-400 text-sm">{wu.bars}</span>
                    </div>
                    <p className="text-purple-200 text-sm mb-4">{wu.desc}</p>
                    <pre className="font-mono text-green-300 text-xs bg-black/40 rounded-xl p-4 overflow-x-auto leading-relaxed">{wu.tab.join("\n")}</pre>
                    <div className="mt-3 bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-2.5">
                      <span className="text-blue-300 font-semibold text-xs">How it works: </span>
                      <span className="text-purple-200 text-xs">{wu.tip}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-5">
              <h3 className="text-white font-bold mb-2">How to Use These Licks</h3>
              <ul className="space-y-1.5 text-purple-200 text-sm">
                <li>• Play the intro lick <strong className="text-white">before bar 1</strong> to announce the song</li>
                <li>• Insert fills in <strong className="text-white">bar 4</strong> (the space before IV) and <strong className="text-white">bar 8</strong> (before the V)</li>
                <li>• Use the turnaround lick in <strong className="text-white">bars 11–12</strong> every time the form loops</li>
                <li>• Use walkups on the <strong className="text-white">last beat of the bar before a chord change</strong></li>
                <li>• Don&apos;t play all of them every chorus — choose 1–2 per loop and rotate</li>
              </ul>
            </div>
          </div>
        )}

        {/* ─── FEELS ─────────────────────────────────────────────────── */}
        {activeTab === "feels" && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-3">Same Form, Different Feel</h2>
              <p className="text-purple-200 text-sm leading-relaxed">
                The 12-bar chord sequence is fixed. But the <em>feel</em> — the rhythmic subdivision, tempo, and attitude —
                transforms the same three chords into completely different musical experiences.
                A slow 12/8 blues and a fast rock shuffle share the same DNA but feel worlds apart.
              </p>
            </div>

            <div className="space-y-5">
              {FEELS.map(feel => (
                <div key={feel.name} className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 border-l-4 ${feel.color}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{feel.icon}</span>
                    <div>
                      <h3 className="text-white font-bold text-lg">{feel.name}</h3>
                      <span className="text-purple-400 text-sm">{feel.bpm}</span>
                    </div>
                  </div>
                  <p className="text-purple-200 text-sm leading-relaxed mb-4">{feel.desc}</p>
                  <div className="bg-white/5 rounded-xl p-4 mb-3">
                    <div className="text-white font-semibold text-sm mb-1">How to play it:</div>
                    <p className="text-purple-300 text-sm leading-relaxed">{feel.howToPlay}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {feel.characters.map(c => (
                      <span key={c} className="bg-white/10 text-purple-200 text-xs px-2.5 py-1 rounded-full">{c}</span>
                    ))}
                  </div>
                  <div className="text-amber-300 text-xs">▶ Reference: {feel.example}</div>
                </div>
              ))}
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-white font-bold text-lg mb-4">Feel Comparison — Same Chord, Different World</h3>
              <p className="text-purple-200 text-sm mb-4">
                Try this: play a simple A7 chord and strum it in each of these feels. You&apos;ll understand immediately how
                feel transforms harmony.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-purple-400 border-b border-white/10">
                      <th className="text-left pb-3 pr-4">Feel</th>
                      <th className="text-left pb-3 pr-4">Subdivision</th>
                      <th className="text-left pb-3 pr-4">Tempo</th>
                      <th className="text-left pb-3">Picking</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-2">
                    {[
                      { feel: "Slow Blues", sub: "12/8 triplets", tempo: "50–70 BPM", pick: "Fingers or soft pick" },
                      { feel: "Medium Shuffle", sub: "Swing 8ths", tempo: "85–110 BPM", pick: "Pick, downstrokes" },
                      { feel: "Fast Shuffle", sub: "Swing 8ths (fast)", tempo: "140–180 BPM", pick: "Pick, alternate" },
                      { feel: "Funk Blues", sub: "16th notes", tempo: "80–100 BPM", pick: "Pick, muted stabs" },
                      { feel: "Straight Rock", sub: "Straight 8ths", tempo: "100–130 BPM", pick: "Pick, aggressive" },
                    ].map(row => (
                      <tr key={row.feel} className="border-b border-white/5">
                        <td className="text-white font-semibold py-2.5 pr-4">{row.feel}</td>
                        <td className="text-purple-300 py-2.5 pr-4">{row.sub}</td>
                        <td className="text-purple-300 py-2.5 pr-4">{row.tempo}</td>
                        <td className="text-purple-300 py-2.5">{row.pick}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ─── PRACTICE PLAN ─────────────────────────────────────────── */}
        {activeTab === "practice" && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-3">From Zero to Jamming in 5 Levels</h2>
              <p className="text-purple-200 text-sm leading-relaxed">
                This practice plan takes you from &ldquo;knowing the form exists&rdquo; to &ldquo;being able to jam with other musicians&rdquo;.
                Don&apos;t rush levels. Each one builds on the last, and the foundation is more important than the speed.
                Use a metronome. Record yourself. The goal of each level is the stated goal — not perfection, just competency.
              </p>
            </div>

            <div className="space-y-5">
              {PRACTICE_LEVELS.map(level => (
                <div key={level.level} className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 border-l-4 ${level.color}`}>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-white/10 rounded-full w-12 h-12 flex items-center justify-center shrink-0">
                      <span className="text-white font-black text-xl">{level.level}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-1">
                        <h3 className="text-white font-bold text-xl">{level.title}</h3>
                        <span className="text-purple-400 text-sm bg-white/10 px-3 py-0.5 rounded-full">{level.duration}</span>
                      </div>
                      <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg px-3 py-1.5 inline-block">
                        <span className="text-emerald-300 text-xs font-semibold">Goal: </span>
                        <span className="text-emerald-200 text-xs">{level.goal}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5 mb-4">
                    {level.tasks.map((task, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-purple-300 text-xs font-bold">{i + 1}</span>
                        </div>
                        <p className="text-purple-200 text-sm leading-relaxed">{task}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3">
                    <span className="text-amber-300 font-semibold text-xs">Coach&apos;s note: </span>
                    <span className="text-purple-200 text-sm">{level.tip}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-white font-bold text-lg mb-4">Daily Practice Session (20 Minutes)</h3>
              <div className="space-y-3">
                {[
                  { time: "0–5 min", task: "Warm up", desc: "Slow shuffle riff on I chord only at 60 BPM. No pressure, just get the hands moving." },
                  { time: "5–10 min", task: "Form drilling", desc: "Play through the full 12-bar twice, focusing on clean chord changes at the right bar." },
                  { time: "10–15 min", task: "Lick practice", desc: "Work on one specific lick or walkup. Repeat it 10 times at slow tempo, then insert it into the form." },
                  { time: "15–20 min", task: "Free play", desc: "Put on a backing track. Don't think. Just play and have fun with what you know." },
                ].map(item => (
                  <div key={item.time} className="flex gap-4 items-start">
                    <span className="text-amber-400 font-mono text-sm shrink-0 w-20">{item.time}</span>
                    <div>
                      <span className="text-white font-semibold text-sm">{item.task} — </span>
                      <span className="text-purple-200 text-sm">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-5">
              <h3 className="text-white font-bold mb-3">When You&apos;re Ready to Jam</h3>
              <p className="text-purple-200 text-sm mb-3">You&apos;re ready to jam with another person when you can do all of the following:</p>
              <div className="grid sm:grid-cols-2 gap-2">
                {[
                  "Play through 12 bars without counting out loud",
                  "Change chords on the right bar without hesitation",
                  "Execute a clean turnaround at bars 11–12",
                  "Call out a key and immediately know all 3 chord shapes",
                  "Keep the groove going even if you hit a wrong note",
                  "Start and end phrases that feel musical, not random",
                ].map((item, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <span className="text-emerald-400 shrink-0">✓</span>
                    <span className="text-purple-200 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── PLAYING TOGETHER ──────────────────────────────────────── */}
        {activeTab === "together" && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-3">Blues is a Conversation</h2>
              <p className="text-purple-200 text-sm leading-relaxed mb-4">
                Blues was designed to be played with other people. It&apos;s not a solo exercise — it&apos;s a musical language
                where guitarists, singers, and other musicians speak to each other in real time.
                Knowing when <em>not</em> to play is as important as knowing what to play.
              </p>
              <div className="bg-amber-500/20 border border-amber-500/40 rounded-xl p-4">
                <p className="text-amber-200 text-sm">
                  <span className="font-bold text-amber-300">The golden rule:</span> The person not soloing supports the person who is.
                  Your volume goes down, your note density drops, and your job becomes making them sound great.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {COMPING_TIPS.map(tip => (
                <div key={tip.title} className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{tip.icon}</span>
                    <h3 className="text-white font-bold">{tip.title}</h3>
                  </div>
                  <p className="text-purple-200 text-sm leading-relaxed">{tip.body}</p>
                </div>
              ))}
            </div>

            {/* Trading 4s visual */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-white font-bold text-lg mb-2">Trading 4s — Visual Map</h3>
              <p className="text-purple-300 text-sm mb-5">
                The most common blues jam format between two guitarists. One solos for 4 bars, the other responds with 4 bars, then both play the turnaround together.
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {TRADING_STRUCTURE.map((t, i) => (
                  <div key={i} className={`${t.color} rounded-xl p-4 text-center`}>
                    <div className="text-white text-xs font-semibold mb-1">Bars {t.bars}</div>
                    <div className="text-white font-black text-lg">{t.player}</div>
                    <div className="text-white/80 text-xs mt-1">{t.label}</div>
                  </div>
                ))}
              </div>
              <p className="text-purple-400 text-sm mt-4">Then repeat from Bar 1 — swap who starts the next chorus.</p>
            </div>

            {/* Comping technique */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-white font-bold text-lg mb-4">Comping Techniques — What to Actually Play</h3>
              <div className="space-y-4">
                {[
                  {
                    tech: "Chord Stabs",
                    desc: "Short, muted hits on beats 2 and 4. Fret the chord shape, strum down once, then immediately release the fretting hand pressure to mute. Don't let it ring.",
                    tab: ["e|---x---x---x---x---|", "B|---x---x---x---x---|", "G|---x---x---x---x---|", "D|---5---x---5---x---|", "A|---5---x---5---x---|", "E|---x---x---x---x---|"],
                    tabNote: "x = muted. Hit on beats 2 and 4 only.",
                  },
                  {
                    tech: "Low Register Voicings",
                    desc: "When accompanying someone soloing on high strings, drop to low-register chord shapes (frets 0–5). You won't clash with their melody and the bass frequencies support without overwhelming.",
                    tab: ["e|---x---x---|", "B|---x---x---|", "G|---x---x---|", "D|---7---x---|", "A|---5---x---|", "E|---x---x---|"],
                    tabNote: "Stay in the bass register — let the lead guitar own the high end.",
                  },
                ].map(item => (
                  <div key={item.tech} className="bg-white/5 rounded-xl p-4">
                    <div className="text-amber-300 font-semibold mb-2">{item.tech}</div>
                    <p className="text-purple-200 text-sm mb-3">{item.desc}</p>
                    <pre className="font-mono text-green-300 text-xs bg-black/40 rounded-lg p-3 overflow-x-auto leading-relaxed">{item.tab.join("\n")}</pre>
                    <p className="text-purple-400 text-xs mt-1 italic">{item.tabNote}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-white font-bold text-lg mb-4">Your First Jam — A Script</h3>
              <p className="text-purple-300 text-sm mb-4">Use this format the first time you play blues with another guitarist:</p>
              <div className="space-y-3">
                {[
                  { step: "1", action: "Agree on the key", detail: "Say: 'Let's play a blues in A.' Both confirm the tempo — count it in together: '1-2-3-4'." },
                  { step: "2", action: "First chorus — both play rhythm", detail: "Play the shuffle groove together for one full 12-bar pass. Get locked into the feel." },
                  { step: "3", action: "Second chorus — Guitar 1 solos", detail: "Guitar 1 improvises (blues scale, Box 1). Guitar 2 comps quietly with chord stabs." },
                  { step: "4", action: "Third chorus — Guitar 2 solos", detail: "Swap. Guitar 2 solos, Guitar 1 comps. Listen to each other — respond to what you hear." },
                  { step: "5", action: "Fourth chorus — trade 4s", detail: "Guitar 1 plays bars 1–4, Guitar 2 plays 5–8, both play the turnaround (9–12) together." },
                  { step: "6", action: "Ending", detail: "On the turnaround of the last chorus, slow down slightly and end on the I chord together. A nod or eye contact signals the ending." },
                ].map(item => (
                  <div key={item.step} className="flex gap-4 items-start">
                    <div className="bg-purple-600 rounded-full w-7 h-7 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-white font-bold text-xs">{item.step}</span>
                    </div>
                    <div>
                      <span className="text-white font-semibold text-sm">{item.action} — </span>
                      <span className="text-purple-200 text-sm">{item.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── SOLOING ───────────────────────────────────────────────── */}
        {activeTab === "soloing" && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-3">The Blues Scale</h2>
              <p className="text-purple-200 text-sm leading-relaxed mb-4">
                The blues scale is 6 notes — the minor pentatonic plus one &ldquo;blue note&rdquo; (♭5).
                <strong className="text-white"> One scale works over all three chords in the 12-bar.</strong>
              </p>
              <div className="bg-purple-500/20 border border-purple-500/40 rounded-xl p-4 mb-4">
                <p className="text-purple-200 text-sm">
                  <span className="font-bold text-white">Formula:</span> Root – ♭3 – 4 – ♭5 (blue note) – 5 – ♭7
                  <br />
                  <span className="font-bold text-white">In A:</span> A – C – D – E♭ – E – G
                </p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">Box Position 1 — Key of {currentKey.key}</h2>
              <p className="text-purple-200 text-sm mb-5">
                &ldquo;Box 1&rdquo; is where every blues guitarist starts. B.B. King, Clapton, Hendrix — this position.
              </p>
              {currentKey.key === "A" && <pre className="font-mono text-green-300 text-sm bg-black/40 rounded-xl p-5 overflow-x-auto leading-relaxed">{`e|--5--------8--|
B|--5--------8--|
G|--5---6----7--|   ← Eb (blue note) fret 6
D|--5--------7--|
A|--5--------7--|
E|--5--------8--|`}</pre>}
              {currentKey.key === "E" && <pre className="font-mono text-green-300 text-sm bg-black/40 rounded-xl p-5 overflow-x-auto leading-relaxed">{`e|--0--------3--|
B|--0--------3--|
G|--0---1----2--|   ← Bb (blue note) fret 1
D|--0--------2--|
A|--0--------2--|
E|--0--------3--|`}</pre>}
              {currentKey.key === "G" && <pre className="font-mono text-green-300 text-sm bg-black/40 rounded-xl p-5 overflow-x-auto leading-relaxed">{`e|--3--------6--|
B|--3--------6--|
G|--3---4----5--|   ← Db (blue note) fret 4
D|--3--------5--|
A|--3--------5--|
E|--3--------6--|`}</pre>}
              {currentKey.key === "D" && <pre className="font-mono text-green-300 text-sm bg-black/40 rounded-xl p-5 overflow-x-auto leading-relaxed">{`e|--10-------13--|
B|--10-------13--|
G|--10--11---12--|   ← Ab (blue note) fret 11
D|--10-------12--|
A|--10-------12--|
E|--10-------13--|`}</pre>}
              {currentKey.key === "C" && <pre className="font-mono text-green-300 text-sm bg-black/40 rounded-xl p-5 overflow-x-auto leading-relaxed">{`e|--8--------11--|
B|--8--------11--|
G|--8---9----10--|   ← F# (blue note) fret 9
D|--8--------10--|
A|--8--------10--|
E|--8--------11--|`}</pre>}
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">Essential Techniques</h2>
              <div className="space-y-4">
                {[
                  { tech: "String Bending ↑", desc: "Push a string sideways to raise its pitch. A whole-step bend (2 frets up) is the most expressive blues sound. Use your ring finger, supported by index and middle.", example: "Bend G string fret 7 (key of A) up a whole step while I chord rings." },
                  { tech: "Vibrato 〰️", desc: "After fretting a note, rock the string back and forth rhythmically. This adds sustain and expression. B.B. King's vibrato is the most imitated in blues history.", example: "Hold any note in Box 1 and repeatedly rock the finger perpendicular to the strings." },
                  { tech: "Call and Response ↔️", desc: "Play a short phrase, then leave silence. Don't fill every space — the space IS the music. Your guitar is asking and answering questions.", example: "Play 3–4 notes, pause for 2 beats, then answer with 2–3 different notes." },
                  { tech: "Targeting Chord Tones 🎯", desc: "When the chord changes, land on a note in the new chord (root, 3rd, 5th, or 7th). Your solo sounds intentional, not random.", example: "When IV hits (D7), resolve your phrase to the D note." },
                ].map(item => (
                  <div key={item.tech} className="bg-white/5 rounded-xl p-4">
                    <div className="text-white font-bold mb-2">{item.tech}</div>
                    <p className="text-purple-200 text-sm leading-relaxed mb-2">{item.desc}</p>
                    <p className="text-amber-300 text-xs italic">Try: {item.example}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── SONGS ─────────────────────────────────────────────────── */}
        {activeTab === "songs" && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-2">Essential 12-Bar Blues Recordings</h2>
              <p className="text-purple-200 text-sm mb-6">Study these. Each one teaches you something different.</p>
              <div className="space-y-4">
                {FAMOUS_SONGS.map((song, i) => (
                  <div key={i} className="bg-white/5 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex-1">
                      <div className="text-white font-bold">{song.song}</div>
                      <div className="text-purple-300 text-sm">{song.artist} · {song.era}</div>
                      <div className="text-purple-400 text-xs mt-1">{song.technique}</div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <span className="bg-purple-600/40 border border-purple-500/40 text-purple-200 text-xs px-2.5 py-1 rounded-full font-medium">Key: {song.key}</span>
                      <span className="bg-white/10 text-purple-300 text-xs px-2.5 py-1 rounded-full font-medium">{song.style}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">Blues by Style</h2>
              <div className="space-y-4">
                {[
                  { style: "Delta Blues (1920s–1940s)", color: "border-amber-500", artists: "Robert Johnson, Son House, Charley Patton", sound: "Acoustic guitar, raw and sparse. Slide guitar, open tunings. The blues at its most primal.", listen: "Cross Road Blues — Robert Johnson" },
                  { style: "Chicago Blues (1940s–1960s)", color: "border-blue-500", artists: "Muddy Waters, Howlin' Wolf, Little Walter", sound: "Electric guitar, harmonica, rhythm section. Bigger, more aggressive. This is where the blues got its teeth.", listen: "Mannish Boy — Muddy Waters" },
                  { style: "Texas Blues (1950s–Present)", color: "border-red-500", artists: "T-Bone Walker, Freddie King, Stevie Ray Vaughan", sound: "Horn-influenced, jazz-tinged, later very high-gain. Technically demanding lead work over slow blues.", listen: "Pride and Joy — Stevie Ray Vaughan" },
                  { style: "Blues Rock (1960s–Present)", color: "border-purple-500", artists: "Clapton, Hendrix, ZZ Top, Gary Moore", sound: "Loud, distorted, fast. Rock energy fused with blues vocabulary. Extended solos, overdriven Marshalls.", listen: "Crossroads — Cream" },
                ].map(item => (
                  <div key={item.style} className={`bg-white/5 rounded-xl p-5 border-l-4 ${item.color}`}>
                    <div className="text-white font-bold mb-1">{item.style}</div>
                    <div className="text-purple-400 text-xs mb-2">{item.artists}</div>
                    <p className="text-purple-200 text-sm leading-relaxed mb-2">{item.sound}</p>
                    <div className="text-amber-300 text-xs">▶ Start with: {item.listen}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
