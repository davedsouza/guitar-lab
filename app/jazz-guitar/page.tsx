"use client"

import React, { useState } from "react"
import Link from "next/link"
import ChordDiagram from "@/components/ChordDiagram"

type Tab = "fundamentals" | "voicings" | "ii-v-i" | "scales" | "comping" | "standards"

const TABS: { id: Tab; label: string }[] = [
  { id: "fundamentals", label: "Fundamentals" },
  { id: "voicings",     label: "Chord Voicings" },
  { id: "ii-v-i",       label: "ii–V–I" },
  { id: "scales",       label: "Jazz Scales" },
  { id: "comping",      label: "Comping" },
  { id: "standards",    label: "Standards to Learn" },
]

function Callout({ type, children }: { type: "tip" | "warning" | "insight" | "exercise"; children: React.ReactNode }) {
  const styles = {
    tip:      "border-l-4 border-purple-500 bg-purple-500/10 text-purple-200",
    warning:  "border-l-4 border-amber-500  bg-amber-500/10  text-amber-200",
    insight:  "border-l-4 border-blue-400   bg-blue-400/10   text-blue-200",
    exercise: "border-l-4 border-green-500  bg-green-500/10  text-green-200",
  }
  const labels = { tip: "Tip", warning: "Watch Out", insight: "Key Insight", exercise: "Exercise" }
  return (
    <div className={`rounded-xl p-4 mb-4 ${styles[type]}`}>
      <p className="text-xs font-bold uppercase tracking-wider mb-1 opacity-80">{labels[type]}</p>
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-4">
      <h3 className="text-lg font-bold text-white mb-3">{title}</h3>
      {children}
    </div>
  )
}

function TabBlock({ label, children }: { label?: string; children: string }) {
  return (
    <div className="mb-4">
      {label && <p className="text-purple-400 text-xs mb-2">{label}</p>}
      <pre className="font-mono text-green-300 bg-black/40 rounded-xl p-4 text-xs leading-relaxed overflow-x-auto whitespace-pre">
        {children}
      </pre>
    </div>
  )
}

// ── Tab Content ──────────────────────────────────────────────────────────────

function FundamentalsTab() {
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 rounded-2xl p-6 border border-purple-500/20">
        <h2 className="text-2xl font-bold text-white mb-2">Jazz Guitar</h2>
        <p className="text-white/70">Jazz is the deepest rabbit hole in guitar. It rewards curiosity, harmonic knowledge, and a willingness to hear music differently. Start with the vocabulary — chord shapes, the ii-V-I, and a few standards — and the doors open one by one.</p>
      </div>

      <Card title="What Makes Jazz Different">
        <div className="space-y-3 text-sm">
          {[
            { aspect: "Extended harmony", desc: "Jazz chords are built in 4ths beyond the basic triad — 7ths, 9ths, 11ths, 13ths. A simple Cmaj7 is already a 4-note chord with rich color." },
            { aspect: "The ii–V–I progression", desc: "The backbone of jazz harmony. Almost every jazz standard can be reduced to sequences of ii–V–I movements in various keys." },
            { aspect: "Chord substitutions", desc: "Jazz players constantly substitute chords with harmonically related alternatives — tritone subs, diminished replacements, secondary dominants." },
            { aspect: "Improvisation language", desc: "Jazz improvisation uses specific scales and vocabulary over each chord type, not just one scale over the whole song." },
            { aspect: "Comping (accompaniment)", desc: "When not soloing, jazz guitarists comp — playing supportive chord fragments rhythmically behind the soloist. Comping is as important as soloing." },
            { aspect: "Feel and swing", desc: "Swing rhythms, triplet-feel 8th notes, ghost notes, and rhythmic conversation between players define the jazz feel." },
          ].map(item => (
            <div key={item.aspect} className="bg-white/5 rounded-xl p-3">
              <div className="text-purple-300 font-semibold mb-0.5">{item.aspect}</div>
              <div className="text-white/60 text-xs">{item.desc}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Essential Jazz Guitarists to Study">
        <div className="grid grid-cols-1 gap-2">
          {[
            { name: "Wes Montgomery",    era: "1950s–60s", known: "Octave lines, thumb picking, deep swing. Start here — most accessible and universally loved." },
            { name: "Django Reinhardt",  era: "1930s–40s", known: "Gypsy jazz. Impossibly fast and lyrical with only two working fingers. Invented an entire style." },
            { name: "Joe Pass",          era: "1960s–80s", known: "Solo guitar master. Chord melody playing — the pinnacle of jazz guitar sophistication." },
            { name: "Pat Metheny",       era: "1970s–now", known: "Fusion + jazz + Americana. Modern, lyrical, innovative tone." },
            { name: "Grant Green",       era: "1960s",     known: "Bluesy bop with soulful simplicity. Perfect for connecting blues vocabulary to jazz." },
            { name: "Jim Hall",          era: "1950s–2010s",known: "Elegant, sparse, deeply musical. The model for tasteful guitar accompaniment." },
            { name: "George Benson",     era: "1970s–now", known: "Fluid bebop lines, incredible technique. 'Breezin' is the gateway record for many." },
            { name: "Kurt Rosenwinkel",  era: "1990s–now", known: "Modern jazz voice with creative use of extensions. For when you want to go deep." },
          ].map(p => (
            <div key={p.name} className="flex items-start gap-3 bg-white/5 rounded-xl p-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-white font-semibold text-sm">{p.name}</span>
                  <span className="text-purple-400 text-xs">{p.era}</span>
                </div>
                <div className="text-white/50 text-xs mt-0.5">{p.known}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Your Learning Path">
        <div className="space-y-2">
          {[
            { step: "1", title: "Shell voicings",     desc: "3-string chords with root, 3rd, and 7th. The foundation of jazz comping." },
            { step: "2", title: "The ii–V–I",         desc: "Learn this progression in all 12 keys. It's jazz grammar." },
            { step: "3", title: "A jazz standard",    desc: "Autumn Leaves or All of Me — learn the melody and chords in one key." },
            { step: "4", title: "Basic comping",      desc: "Strum chord fragments on beats 2 and 4 (the 'afterbeats')." },
            { step: "5", title: "Scales for soloing", desc: "Dorian for minor chords, Mixolydian for dominants, Major for major chords." },
            { step: "6", title: "ii–V–I licks",       desc: "Memorize 3–5 melodic lines that work over ii–V–I and transpose them." },
          ].map(s => (
            <div key={s.step} className="flex gap-3 items-start bg-white/5 rounded-xl p-3">
              <span className="bg-purple-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shrink-0 font-bold">{s.step}</span>
              <div>
                <div className="text-white font-medium text-sm">{s.title}</div>
                <div className="text-white/50 text-xs">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function VoicingsTab() {
  const [activeVoicing, setActiveVoicing] = useState<string>("shell")

  const voicingTypes = [
    {
      id: "shell",
      name: "Shell Voicings",
      desc: "3-string voicings using Root, 3rd, and 7th. The backbone of jazz comping — stripped down, uncluttered, leaves space for the bass and melody.",
      detail: "Shell voicings omit the 5th (rarely important) and focus on the notes that define chord quality: the root (where are we?), the 3rd (major or minor?), and the 7th (major 7, dominant 7, or minor 7?).",
    },
    {
      id: "drop2",
      name: "Drop 2 Voicings",
      desc: "Take a 4-note chord in close position, drop the 2nd-highest note down an octave. Results in open, guitar-friendly voicings spread across 4 strings.",
      detail: "Drop 2 is how most jazz guitarists voice 4-note chords. The spread gives a fuller sound than close position while keeping the notes playable on adjacent strings.",
    },
    {
      id: "rootless",
      name: "Rootless Voicings",
      desc: "Omit the root — the bass player covers it. Include the 3rd, 7th, and one or two extensions (9th, 13th). Creates rich, colorful harmony.",
      detail: "With a bass player present, the guitar root is redundant. Rootless voicings free up a finger to add extensions like 9ths and 13ths, making the harmony much richer.",
    },
    {
      id: "chord-melody",
      name: "Chord Melody",
      desc: "Play the melody note on top while chording below it — simultaneously being the singer and the accompanist. The summit of jazz guitar technique.",
      detail: "Chord melody requires knowing where every melody note is and what chord belongs under it. Start with 'Happy Birthday' or 'Autumn Leaves' in one position.",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex gap-1.5 flex-wrap mb-2">
        {voicingTypes.map(v => (
          <button
            key={v.id}
            onClick={() => setActiveVoicing(v.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${activeVoicing === v.id ? "bg-purple-600 text-white" : "bg-white/10 text-white/60 hover:bg-white/20"}`}
          >
            {v.name}
          </button>
        ))}
      </div>

      {(() => {
        const v = voicingTypes.find(x => x.id === activeVoicing)!
        return (
          <Card title={v.name}>
            <p className="text-purple-300 text-sm mb-2">{v.desc}</p>
            <p className="text-white/60 text-xs mb-4">{v.detail}</p>
          </Card>
        )
      })()}

      <Card title="Shell Voicings — Root Position (6th & 5th String Roots)">
        <p className="text-white/60 text-sm mb-3">Learn these 6 shapes. Every jazz chord type on string 6 root and string 5 root. Memorize their feel and function.</p>

        <p className="text-purple-400 text-xs mb-2">6th string root — shown here with G root (3rd fret). Slide up for any key.</p>
        <div className="flex gap-3 flex-wrap justify-center mb-4">
          <ChordDiagram chordName="Gmaj7" fingers={[3,'x',4,4,'x','x']} size="small" />
          <ChordDiagram chordName="G7"    fingers={[3,'x',3,4,'x','x']} size="small" />
          <ChordDiagram chordName="Gm7"   fingers={[3,'x',3,3,'x','x']} size="small" />
        </div>

        <p className="text-purple-400 text-xs mb-2">5th string root — shown here with C root (3rd fret). Slide up for any key.</p>
        <div className="flex gap-3 flex-wrap justify-center mb-4">
          <ChordDiagram chordName="Cmaj7" fingers={['x',3,'x',4,5,'x']} size="small" />
          <ChordDiagram chordName="C7"    fingers={['x',3,'x',3,5,'x']} size="small" />
          <ChordDiagram chordName="Cm7"   fingers={['x',3,'x',3,4,'x']} size="small" />
        </div>

        <TabBlock label="Shell voicings — interval structure (R = root, 3 = major/minor 3rd, 7 = major/minor 7th)">
{`6th string root:  [ R  x  7  3  x  x ]   Maj7: root, maj7, maj3
                  [ R  x  b7 3  x  x ]   Dom7: root, min7, maj3
                  [ R  x  b7 b3 x  x ]   Min7: root, min7, min3

5th string root:  [ x  R  x  7  3  x ]   Maj7
                  [ x  R  x  b7 3  x ]   Dom7
                  [ x  R  x  b7 b3 x ]   Min7

Move the shape up the neck to any root note.`}
        </TabBlock>
      </Card>

      <Card title="Drop 2 Voicings — G Family (strings 4–1)">
        <p className="text-white/60 text-sm mb-3">Drop 2 voicings spread across strings 4–1. Fuller sound than shell voicings. These three shapes are the core of jazz comping.</p>
        <div className="flex gap-3 flex-wrap justify-center mb-4">
          <ChordDiagram chordName="Gmaj7" fingers={['x','x',5,4,3,2]} size="small" />
          <ChordDiagram chordName="G7"    fingers={['x','x',5,4,3,1]} size="small" />
          <ChordDiagram chordName="Gm7"   fingers={['x','x',5,3,3,1]} size="small" />
        </div>
        <TabBlock label="Drop 2 — strings 4-1 (D-G-B-e), G root family">
{`Gmaj7  x x 5 4 3 2   → G  B  D  F#  (root, 3rd, 5th, maj7)
G7     x x 5 4 3 1   → G  B  D  F   (root, 3rd, 5th, min7)
Gm7    x x 5 3 3 1   → G  Bb D  F   (root, min3, 5th, min7)

Notice: Gmaj7 → G7: only top note drops from F# to F (min7)
        G7 → Gm7: only string 3 drops from B to Bb (minor quality)
One finger change = major → dominant → minor.`}
        </TabBlock>
        <Callout type="tip">
          Learn voicings in groups: all Maj7 shapes, then all Dom7, then all Min7. Connect them up and down the neck before mixing chord types.
        </Callout>
      </Card>

      <Card title="Common Jazz Chord Shapes to Know First">
        <p className="text-white/60 text-sm mb-3">These are the 8 most-used shapes. Learn all 8 in the key of C, then transpose up the neck.</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {/* Open Cmaj7 — x32000 */}
          <ChordDiagram chordName="Cmaj7"  fingers={['x',3,2,0,0,0]}   size="small" />
          {/* C7 — x32310 */}
          <ChordDiagram chordName="C7"     fingers={['x',3,2,3,1,0]}   size="small" />
          {/* Cm7 barre */}
          <ChordDiagram chordName="Cm7"    fingers={['x',3,5,3,4,'x']} size="small" />
          {/* Cm7b5 */}
          <ChordDiagram chordName="Cm7b5"  fingers={['x',3,4,3,4,'x']} size="small" />
          {/* Cdim7 */}
          <ChordDiagram chordName="Cdim7"  fingers={['x',3,4,2,4,'x']} size="small" />
          {/* Cmaj9 */}
          <ChordDiagram chordName="Cmaj9"  fingers={['x',3,2,4,3,'x']} size="small" />
          {/* C9 */}
          <ChordDiagram chordName="C9"     fingers={['x',3,2,3,3,'x']} size="small" />
          {/* Cm9 */}
          <ChordDiagram chordName="Cm9"    fingers={['x',3,1,3,3,'x']} size="small" />
        </div>
      </Card>
    </div>
  )
}

function IIVITab() {
  const [activeKey, setActiveKey] = useState("C")
  const keys = ["C", "F", "Bb", "Eb", "Ab", "Db", "G", "D", "A", "E", "B"]

  const iiVI: Record<string, { ii: string; V: string; I: string; bpm: string }> = {
    C:  { ii: "Dm7",   V: "G7",    I: "Cmaj7",  bpm: "x320xx" },
    F:  { ii: "Gm7",   V: "C7",    I: "Fmaj7",  bpm: "" },
    Bb: { ii: "Cm7",   V: "F7",    I: "Bbmaj7", bpm: "" },
    Eb: { ii: "Fm7",   V: "Bb7",   I: "Ebmaj7", bpm: "" },
    Ab: { ii: "Bbm7",  V: "Eb7",   I: "Abmaj7", bpm: "" },
    Db: { ii: "Ebm7",  V: "Ab7",   I: "Dbmaj7", bpm: "" },
    G:  { ii: "Am7",   V: "D7",    I: "Gmaj7",  bpm: "" },
    D:  { ii: "Em7",   V: "A7",    I: "Dmaj7",  bpm: "" },
    A:  { ii: "Bm7",   V: "E7",    I: "Amaj7",  bpm: "" },
    E:  { ii: "F#m7",  V: "B7",    I: "Emaj7",  bpm: "" },
    B:  { ii: "C#m7",  V: "F#7",   I: "Bmaj7",  bpm: "" },
  }

  const current = iiVI[activeKey]

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 rounded-2xl p-5 border border-purple-500/20">
        <h2 className="text-xl font-bold text-white mb-1">The ii–V–I</h2>
        <p className="text-white/70 text-sm">The single most important chord progression in jazz. Understanding it in all 12 keys unlocks 80% of standard jazz harmony. It creates maximum tension and resolution: away from home (ii), maximum pull toward home (V), arrival (I).</p>
      </div>

      <Card title="Why ii–V–I Works">
        <div className="space-y-3 text-sm text-white/70">
          <p>In the key of C major, the <strong className="text-purple-300">ii</strong> chord is Dm7, the <strong className="text-purple-300">V</strong> chord is G7, and the <strong className="text-purple-300">I</strong> chord is Cmaj7.</p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-white/5 rounded-xl p-3">
              <div className="text-purple-400 font-bold text-lg mb-1">ii</div>
              <div className="text-white font-semibold">Dm7</div>
              <div className="text-white/50 text-xs">Subdominant feel — moves away from tonic</div>
            </div>
            <div className="bg-purple-600/20 rounded-xl p-3 border border-purple-500/30">
              <div className="text-purple-400 font-bold text-lg mb-1">V</div>
              <div className="text-white font-semibold">G7</div>
              <div className="text-white/50 text-xs">Maximum tension — wants to resolve to I</div>
            </div>
            <div className="bg-white/5 rounded-xl p-3">
              <div className="text-purple-400 font-bold text-lg mb-1">I</div>
              <div className="text-white font-semibold">Cmaj7</div>
              <div className="text-white/50 text-xs">Resolution — home, arrival, rest</div>
            </div>
          </div>
          <p className="text-xs">The tension in G7 comes from the tritone between B (the 3rd) and F (the 7th). This interval desperately wants to resolve — B rises to C, F drops to E. That&apos;s the magnetic pull of the dominant chord.</p>
        </div>
      </Card>

      <Card title="ii–V–I in All Keys">
        <div className="flex gap-1.5 flex-wrap mb-4">
          {keys.map(k => (
            <button
              key={k}
              onClick={() => setActiveKey(k)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${activeKey === k ? "bg-purple-600 text-white" : "bg-white/10 text-white/60 hover:bg-white/20"}`}
            >
              {k}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3 text-center mb-4">
          <div className="bg-white/5 rounded-xl p-3">
            <div className="text-purple-400 text-xs mb-1">ii</div>
            <div className="text-white font-bold text-lg">{current.ii}</div>
          </div>
          <div className="bg-purple-600/20 rounded-xl p-3 border border-purple-500/30">
            <div className="text-purple-400 text-xs mb-1">V</div>
            <div className="text-white font-bold text-lg">{current.V}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <div className="text-purple-400 text-xs mb-1">I</div>
            <div className="text-white font-bold text-lg">{current.I}</div>
          </div>
        </div>
        <Callout type="exercise">
          Practice playing the ii–V–I in every key using shell voicings. Set a metronome to 60 BPM, give each chord 2 beats, and cycle through all 12 keys. This single exercise will do more for your jazz playing than anything else.
        </Callout>
      </Card>

      <Card title="ii–V–I Rhythm Guitar Pattern">
        <p className="text-white/60 text-sm mb-3">The basic jazz comping rhythm for a ii–V–I in C. Shell voicings on string 6 roots.</p>
        <TabBlock label="ii-V-I comping — C major, shell voicings, swing feel">
{`     Dm7        G7         Cmaj7
e  |--x---x---|--x---x---|--x---x---|
B  |--x---x---|--x---x---|--x---x---|
G  |--5---5---|--4---4---|--4---4---|   (3rd/7th)
D  |--5---5---|--5---5---|--4---4---|   (5th/7th)
A  |--5---5---|--5---5---|--3---3---|   (root)
E  |----------|----------|----------|

Rhythm: strum on beats 2 and 4 (the "afterbeats")
Each x is a chord hit — play with a slightly muffled strum
Swing feel: long–short 8th note pairs`}
        </TabBlock>
      </Card>

      <Card title="The Tritone Substitution">
        <p className="text-white/60 text-sm mb-3">The most common jazz chord substitution. The V7 chord can be replaced by a Dom7 chord a tritone away (6 semitones). G7 → Db7 in the key of C.</p>
        <div className="bg-white/5 rounded-xl p-4 text-sm">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="text-white font-bold">Dm7</span>
            <span className="text-white/40">→</span>
            <span className="text-amber-400 font-bold line-through">G7</span>
            <span className="text-white/40">→</span>
            <span className="text-green-400 font-bold">Db7</span>
            <span className="text-white/40">→</span>
            <span className="text-white font-bold">Cmaj7</span>
          </div>
          <p className="text-white/60 text-xs">Why it works: G7 contains B and F (a tritone apart). Db7 contains F and Cb (= B enharmonically). The same tritone! Both chords share the same tension notes, so they resolve equally well to Cmaj7. The Db7 creates a chromatic bass motion (Db → C) which sounds incredibly smooth.</p>
        </div>
      </Card>
    </div>
  )
}

function ScalesTab() {
  const scales = [
    {
      name: "Dorian Mode",
      use: "Over minor 7th chords (ii chord)",
      formula: "W H W W W H W",
      notes: "Root, 2, b3, 4, 5, 6, b7",
      character: "Smooth, soulful minor. Has a major 6th which gives it a brighter quality than natural minor.",
      example: "Over Dm7: D E F G A B C D. The B (natural 6th) is the distinctive note.",
      tabLabel: "D Dorian scale — two octaves on strings 6 and 5",
      tab: `E |---------------------5--7--8--|
B |------------------5--8--------|
G |-----------4--5--7------------|
D |------4--5--7-----------------|
A |--5--7------------------------|
E |------------------------------|
Notes: D E F G A B C D (D E F natural 6 gives the brightness)`
    },
    {
      name: "Mixolydian Mode",
      use: "Over dominant 7th chords (V chord)",
      formula: "W W H W W H W",
      notes: "Root, 2, 3, 4, 5, 6, b7",
      character: "Major scale with a flat 7th. The b7 creates the dominant tension that resolves to the major I chord.",
      example: "Over G7: G A B C D E F G. The F (b7) is what makes it dominant and creates the tension.",
      tabLabel: "G Mixolydian — position 1 (the 'minor pentatonic box' with 2nd and 6th added)",
      tab: `e |-----3--5--|
B |-----3--5--|
G |----4--5---|
D |--3--5-----|
A |--3--5-----|
E |--3--5-----|
G Mixolydian: G A B C D E F (same as C major starting on G)`
    },
    {
      name: "Bebop Dominant Scale",
      use: "Over dominant 7th chords — the definitive jazz improv scale",
      formula: "Major scale + chromatic passing tone between b7 and root",
      notes: "Root, 2, 3, 4, 5, 6, b7, maj7, Root (8 notes)",
      character: "The extra chromatic note ensures that chord tones land on the beat. This is the secret of bebop phrasing.",
      example: "Over G7: G A B C D E F F# G. The F# passing tone makes downbeats land on chord tones.",
      tabLabel: "G Bebop Dominant — note the chromatic F#→G passing tone",
      tab: `e |----3--4--5--7--|
B |--3--4--5--7----|
G |----------------|
D |----------------|
Notes: G A B C D E F F# G
The F# is the passing tone — never rest on it, always pass through it`
    },
    {
      name: "Bebop Major Scale",
      use: "Over major 7th chords (I chord)",
      formula: "Major scale + chromatic passing tone between 5 and 6",
      notes: "Root, 2, 3, 4, 5, #5, 6, 7, Root",
      character: "Same logic as bebop dominant — the extra note aligns chord tones with strong beats.",
      example: "Over Cmaj7: C D E F G G# A B C.",
      tabLabel: "C Bebop Major — #5 is the chromatic passing note",
      tab: `Notes: C D E F G G# A B C
The G# (or Ab) between G and A is the added chromatic passing note.
Use ascending runs with this scale: all chord tones fall on downbeats.`
    },
    {
      name: "Diminished Scale",
      use: "Over dim7 and dominant 7b9 chords",
      formula: "Alternating whole steps and half steps (or H–W)",
      notes: "8 notes, two versions: W–H and H–W",
      character: "Symmetric — repeats every 3 frets. Creates dark, tense, mysterious sounds. Very useful over altered dominants.",
      example: "Over G7b9: G Ab Bb B C# D E F. The half-step whole-step version.",
      tabLabel: "G Half-Whole Diminished — great over G7b9",
      tab: `G  Ab  Bb  B  C#  D  E  F  G
|  H  | W |  H  | W |  H  | W | H |
Each interval alternates half-step then whole-step.
The scale repeats every 3 frets — only 3 fingering shapes to learn!`
    },
    {
      name: "Lydian Mode",
      use: "Over major 7th chords for a floating, modern sound",
      formula: "Major scale with raised 4th (#4)",
      notes: "Root, 2, 3, #4, 5, 6, 7",
      character: "The raised 4th (tritone above root) gives a dreamy, suspended, non-resolving quality. Sounds modern and bright.",
      example: "Over Cmaj7: C D E F# G A B C. The F# (raised 4th) is the characteristic note.",
      tabLabel: "C Lydian — note the F# instead of F",
      tab: `e |-----5--7--9--|
B |--5--8--------|
G |--4--5--7-----|
D |--3--5--------|
Notes: C D E F# G A B — the #4 (F#) is what makes it Lydian
Compare to C major: Lydian has F# where major has F`
    },
  ]

  const [active, setActive] = useState(0)

  return (
    <div className="space-y-4">
      <div className="flex gap-1.5 flex-wrap mb-2">
        {scales.map((s, i) => (
          <button
            key={s.name}
            onClick={() => setActive(i)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${active === i ? "bg-purple-600 text-white" : "bg-white/10 text-white/60 hover:bg-white/20"}`}
          >
            {s.name.split(" ")[0] + " " + (s.name.split(" ")[1] || "")}
          </button>
        ))}
      </div>

      {(() => {
        const s = scales[active]
        return (
          <div className="space-y-3">
            <Card title={s.name}>
              <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
                <div><span className="text-purple-400">Use over: </span><span className="text-white/70">{s.use}</span></div>
                <div><span className="text-purple-400">Notes: </span><span className="text-white/70 font-mono">{s.notes}</span></div>
              </div>
              <p className="text-white/70 text-sm mb-3">{s.character}</p>
              <div className="bg-white/5 rounded-xl p-3 text-xs">
                <div className="text-purple-400 font-semibold mb-1">Example</div>
                <div className="text-white/60">{s.example}</div>
              </div>
            </Card>
            <TabBlock label={s.tabLabel}>{s.tab}</TabBlock>
          </div>
        )
      })()}

      <Callout type="insight">
        The key insight of jazz scales: <strong>don&apos;t think of one scale per song</strong> — think of one scale per chord. When the chord changes, your scale changes. Dm7 → Dorian. G7 → Mixolydian. Cmaj7 → Major or Lydian. This is called &quot;playing inside the changes.&quot;
      </Callout>
    </div>
  )
}

function CompingTab() {
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 rounded-2xl p-5 border border-purple-500/20">
        <h2 className="text-xl font-bold text-white mb-1">Comping</h2>
        <p className="text-white/70 text-sm">Comping (accompanying) is what you do when someone else is soloing. It&apos;s arguably more important than soloing — a great comper makes everyone around them sound better. The key is rhythmic, supportive, and tasteful.</p>
      </div>

      <Card title="The Fundamentals of Comping">
        <div className="space-y-3 text-sm">
          {[
            { rule: "Less is more", desc: "Leave space. Don't fill every beat. A single well-placed chord on beat 2 or 4 is more powerful than constant strumming." },
            { rule: "Comp on beats 2 and 4", desc: "The jazz \"afterbeat\". In 4/4, beats 2 and 4 are the weak beats — hitting there creates the classic jazz bounce and swing feel." },
            { rule: "Listen, don't lead", desc: "Your job is to support the soloist. Follow their phrasing. If they play a long note, give them space. If they rest, you can fill. React, don't predict." },
            { rule: "Voice lead smoothly", desc: "Move between chord voicings with minimal finger movement. If two adjacent chords share notes, keep those notes and move only the ones that change." },
            { rule: "Vary the register", desc: "Don't always comp in the same octave range. Move voicings up and down the neck to avoid competing with the soloist's range." },
          ].map(item => (
            <div key={item.rule} className="bg-white/5 rounded-xl p-3">
              <div className="text-purple-300 font-semibold mb-0.5">{item.rule}</div>
              <div className="text-white/60 text-xs">{item.desc}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Basic Comping Rhythms">
        <TabBlock label="Freddie Green style — 4 beats per bar, light strums on strings 4-3-2">
{`     | 1   2   3   4   | 1   2   3   4   |
Str: | G7      G7      | G7      G7      |
        ↓        ↓          ↓        ↓
Play on beats 2 and 4 only. Light downstroke.
Mute immediately after strumming — no ringing.`}
        </TabBlock>
        <TabBlock label="Syncopated jazz comp — anticipations and off-beats">
{`     | 1  +  2  +  3  +  4  +  |
     |    ↓     ↓  ↓        ↓  |
        and-2  beat-3  and-4
This creates a more conversational, interactive feel.
The anticipations (before the beat) are characteristic of bebop comping.`}
        </TabBlock>
        <TabBlock label="Chord melody-style comping — melody on top of shell chord">
{`e  |--5-----------5---3---2---|
B  |--6-----------5---3---1---|
G  |--5-----------5---4---2---|
D  |--5-----------3---3---2---|
A  |--------------------------|
E  |--------------------------|
Hold chord below while top note moves through the melody.
This is the beginning of chord-melody technique.`}
        </TabBlock>
      </Card>

      <Card title="Voice Leading Between ii–V–I">
        <p className="text-white/60 text-sm mb-3">The smoothest way to move through a ii–V–I is to let common tones stay put and move other notes by step. Watch how the 3rds and 7ths resolve:</p>
        <TabBlock label="Voice leading Dm7 → G7 → Cmaj7 (3rd and 7th guide tones)">
{`Chord:    Dm7      G7       Cmaj7
3rd:       F    →   B    →   E
7th:       C    →   F    →   B

The 3rd of Dm7 (F) becomes the 7th of G7 (F)
The 7th of G7 (F) resolves DOWN a half step to the 3rd of Cmaj7 (E)
The 3rd of G7 (B) resolves UP a half step to the root of Cmaj7 (C)

These guide tones (3rd and 7th) are all you need to outline any chord change.`}
        </TabBlock>
        <Callout type="exercise">
          Practice playing ONLY the 3rd and 7th of each chord in a ii–V–I, listening to how they resolve. These two notes tell you everything about a chord&apos;s function and where it&apos;s going.
        </Callout>
      </Card>
    </div>
  )
}

function StandardsTab() {
  const standards = [
    {
      title: "Autumn Leaves",
      key: "G minor / Bb major",
      level: "Beginner",
      why: "The most-taught jazz standard. Clear ii–V–I patterns in both major and relative minor. Learn this first — it contains everything.",
      structure: "AABA form, 32 bars. The A section is a ii-V-I in Bb, then a ii-V-i in Gm.",
      chords: "Cm7 – F7 – Bbmaj7 – Ebmaj7 – Am7b5 – D7 – Gm",
    },
    {
      title: "All of Me",
      key: "C major",
      level: "Beginner",
      why: "Simple, singable melody. Chord changes are all diatonic — no major key changes. Great for beginners learning to comp and improvise simultaneously.",
      structure: "AABA, 32 bars. Stays mostly in C major with some secondary dominants.",
      chords: "Cmaj7 – E7 – A7 – Dm – E7 – Am – D7 – Dm7 – G7 – Cmaj7",
    },
    {
      title: "Blue Bossa",
      key: "C minor / Db major",
      level: "Beginner–Intermediate",
      why: "The most accessible bossa nova standard. Introduces a key change (to Db major) which is a great ii–V–I practice opportunity.",
      structure: "16 bars. 8 bars in C minor, 4 bars modulate to Db major, 4 bars return to C minor.",
      chords: "Cm7 – Fm7 – Dm7b5 – G7 – Ebm7 – Ab7 – Dbmaj7 → back to Dm7b5 – G7 – Cm7",
    },
    {
      title: "Summertime",
      key: "A minor",
      level: "Beginner–Intermediate",
      why: "Gershwin's standard has a memorable melody and almost entirely minor ii–V–i movements. The minor key feel is important to know.",
      structure: "16 bars. Slow, ballad tempo — the slow tempo is actually harder, demanding more musical control.",
      chords: "Am – E7 – Am – E7 – Am – Dm – Am – E7 – Am",
    },
    {
      title: "There Will Never Be Another You",
      key: "Eb major",
      level: "Intermediate",
      why: "Bebop staple. Multiple ii–V–I sequences in the head — great practice. Fast enough to challenge but slow enough to understand.",
      structure: "ABAC, 32 bars. Used constantly as a jam vehicle.",
      chords: "Ebmaj7 – Ab7 – Ebmaj7 – Bbm7 – Eb7 – Abmaj7 – Am7b5 – D7 – Gm7 – C7...",
    },
    {
      title: "Satin Doll",
      key: "C major",
      level: "Intermediate",
      why: "Duke Ellington classic. The chord movement is unusual and educational — it moves through multiple ii–V pairs that resolve to unexpected places.",
      structure: "AABA, 32 bars. The bridge moves through Dm7 – G7 – Em7 – A7 – Am7 – D7 – Abm7 – Db7 – Cmaj7.",
      chords: "Dm7 – G7 – Dm7 – G7 – Cmaj7 – Em7 – A7 – Em7 – A7 – Amaj7...",
    },
    {
      title: "All The Things You Are",
      key: "Ab major (multiple key areas)",
      level: "Advanced",
      why: "The \"Mount Everest\" of jazz standards for learners — it cycles through 5 key centers. Once you can navigate this, you can navigate anything.",
      structure: "ABAC, 36 bars. Contains ii–V–I progressions in Ab, C, Eb, G, and E major.",
      chords: "Fm7 – Bbm7 – Eb7 – Abmaj7 – Dbmaj7 – Dm7b5 – G7 – Cmaj7...",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 rounded-2xl p-5 border border-purple-500/20">
        <h2 className="text-xl font-bold text-white mb-1">Jazz Standards</h2>
        <p className="text-white/70 text-sm">Jazz standards are the common language. Learning a standard means knowing the melody, the chord changes, and being able to improvise over it. Start with Autumn Leaves. Then All of Me. Then go deeper.</p>
      </div>

      <div className="space-y-3">
        {standards.map(s => (
          <div key={s.title} className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
              <div>
                <h3 className="text-white font-bold">{s.title}</h3>
                <div className="text-purple-400 text-xs">{s.key}</div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${s.level === "Beginner" ? "bg-green-500/20 text-green-400" : s.level.includes("Intermediate") ? "bg-amber-500/20 text-amber-400" : "bg-red-500/20 text-red-400"}`}>{s.level}</span>
            </div>
            <p className="text-white/70 text-sm mb-2">{s.why}</p>
            <div className="space-y-1 text-xs">
              <div><span className="text-purple-400">Form: </span><span className="text-white/50">{s.structure}</span></div>
              <div><span className="text-purple-400">Key chords: </span><span className="text-white/50 font-mono">{s.chords}</span></div>
            </div>
          </div>
        ))}
      </div>

      <Card title="How to Learn a Standard">
        <div className="space-y-2">
          {[
            { step: "1", title: "Sing the melody", desc: "Know the melody so well you can sing it without the guitar. Melody first, always." },
            { step: "2", title: "Learn the lead sheet", desc: "Find the chord changes. Play through them slowly with simple shell voicings." },
            { step: "3", title: "Identify the ii–V–Is", desc: "Mark every ii–V–I in the chart. There will be many — they're the architecture." },
            { step: "4", title: "Comp for yourself", desc: "Record yourself comping the changes, then improvise over the recording." },
            { step: "5", title: "Play the melody as chord melody", desc: "Eventually — play melody and chords simultaneously. This is the advanced step." },
          ].map(s => (
            <div key={s.step} className="flex gap-3 items-start bg-white/5 rounded-xl p-3">
              <span className="bg-purple-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shrink-0 font-bold">{s.step}</span>
              <div>
                <div className="text-white font-medium text-sm">{s.title}</div>
                <div className="text-white/50 text-xs">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function JazzGuitarPage() {
  const [activeTab, setActiveTab] = useState<Tab>("fundamentals")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 pb-16">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/" className="text-purple-400 hover:text-purple-300 text-sm mb-3 inline-block">← Back to Home</Link>
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎷</span>
            <div>
              <h1 className="text-2xl font-bold text-white">Jazz Guitar</h1>
              <p className="text-white/60 text-sm">Chord voicings, the ii–V–I, scales, comping, and essential standards</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1.5 flex-wrap mb-6">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeTab === t.id
                  ? "bg-purple-600 text-white"
                  : "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "fundamentals" && <FundamentalsTab />}
        {activeTab === "voicings"     && <VoicingsTab />}
        {activeTab === "ii-v-i"       && <IIVITab />}
        {activeTab === "scales"       && <ScalesTab />}
        {activeTab === "comping"      && <CompingTab />}
        {activeTab === "standards"    && <StandardsTab />}
      </div>
    </div>
  )
}
