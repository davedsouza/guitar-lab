"use client"

import { useState } from "react"
import Link from "next/link"
import ChordDiagram from "@/components/ChordDiagram"
import { CHORD_VOICINGS } from "@/lib/chordShapes"

type Tab = "positions" | "connecting" | "licks" | "bending" | "practice" | "key-explorer"

const TABS: { id: Tab; label: string }[] = [
  { id: "positions", label: "5 Positions" },
  { id: "connecting", label: "Connecting Positions" },
  { id: "licks", label: "Classic Licks" },
  { id: "bending", label: "Bending & Vibrato" },
  { id: "practice", label: "Practice Plan" },
  { id: "key-explorer", label: "🎯 Key Explorer" },
]

function Callout({ type, children }: { type: "tip" | "warning" | "insight" | "exercise"; children: React.ReactNode }) {
  const styles = {
    tip: "border-l-4 border-purple-500 bg-purple-500/10 text-purple-200",
    warning: "border-l-4 border-amber-500 bg-amber-500/10 text-amber-200",
    insight: "border-l-4 border-blue-400 bg-blue-400/10 text-blue-200",
    exercise: "border-l-4 border-green-500 bg-green-500/10 text-green-200",
  }
  const labels = { tip: "💡 Tip", warning: "⚠️ Common Mistake", insight: "🔑 Key Insight", exercise: "🎸 Exercise" }
  return (
    <div className={`rounded-xl p-4 mb-4 ${styles[type]}`}>
      <p className="text-xs font-bold uppercase tracking-wider mb-1 opacity-80">{labels[type]}</p>
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  )
}

function TabBlock({ label, children }: { label: string; children: string }) {
  return (
    <div className="mb-4">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{label}</p>
      <pre className="font-mono text-green-300 bg-black/40 rounded-xl p-4 text-sm overflow-x-auto whitespace-pre leading-relaxed">
        {children}
      </pre>
    </div>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/10 border border-white/20 rounded-xl p-5 mb-4">
      <h3 className="text-white font-bold mb-3">{title}</h3>
      {children}
    </div>
  )
}

function PositionCard({ num, name, notes, root, children }: { num: number; name: string; notes: string; root: string; children: React.ReactNode }) {
  const colors = ["border-red-500", "border-orange-500", "border-yellow-500", "border-green-500", "border-blue-500"]
  return (
    <div className={`bg-white/10 border-l-4 ${colors[num - 1]} rounded-xl p-5 mb-6`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white bg-purple-600 flex-shrink-0`}>{num}</div>
        <div>
          <h3 className="text-white font-bold">{name}</h3>
          <p className="text-purple-300 text-xs">{notes} · Root on {root}</p>
        </div>
      </div>
      {children}
    </div>
  )
}

function PositionsTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">The 5 Pentatonic Positions</h2>
      <p className="text-purple-200 mb-6">The minor pentatonic scale has 5 positions (shapes) that tile the entire fretboard. Each one covers different frets. Together they let you play anywhere on the neck.</p>

      <Callout type="insight">
        All 5 positions use the SAME 5 notes — just in different locations on the neck. Learn them all in Am (starting at fret 5, 7, 10, 12, 17) and you cover the full neck.
      </Callout>

      <PositionCard num={1} name="The Box (Position 1)" notes="A C D E G" root="A string fret 5 + Low E fret 5">
        <TabBlock label="A minor pentatonic — Position 1 (5th fret)">
{`e|--5-8---------|
B|--5-8---------|
G|--5-7---------|
D|--5-7---------|
A|--5-7---------|
E|--5-8---------|
   Root = A (fret 5, low E)`}
        </TabBlock>
        <p className="text-purple-200 text-sm">This is &quot;the box&quot; — the most used shape. Where 90% of beginners live. Roots are on the low E and A strings (fret 5). Start here.</p>
      </PositionCard>

      <PositionCard num={2} name="Position 2" notes="A C D E G" root="D string fret 7">
        <TabBlock label="Position 2 (7th fret)">
{`e|--7-10--------|
B|--8-10--------|
G|--7-9---------|
D|--7-9---------|
A|--7-10--------|
E|--7-10--------|
   Bridges between box and position 3`}
        </TabBlock>
        <p className="text-purple-200 text-sm">This position connects the box to the higher neck. Root on the D string at fret 7. The shift here is where many guitarists get stuck — practice the slide between positions 1 and 2.</p>
      </PositionCard>

      <PositionCard num={3} name="Position 3" notes="A C D E G" root="B string fret 8">
        <TabBlock label="Position 3 (9th–10th fret area)">
{`e|--10-12-------|
B|--10-13-------|
G|--9-12--------|
D|--9-12--------|
A|--9-12--------|
E|--10-12-------|
   Great for higher-register melodic playing`}
        </TabBlock>
        <p className="text-purple-200 text-sm">A strong melody position. Root on the B string (fret 10). This shape sits right between positions 2 and 4 and unlocks the middle of the neck.</p>
      </PositionCard>

      <PositionCard num={4} name="Position 4" notes="A C D E G" root="High E fret 12">
        <TabBlock label="Position 4 (12th fret)">
{`e|--12-15-------|
B|--13-15-------|
G|--12-14-------|
D|--12-14-------|
A|--12-15-------|
E|--12-15-------|
   One octave up from Position 1`}
        </TabBlock>
        <p className="text-purple-200 text-sm">This is Position 1 an octave higher. Root on the high E string (fret 12). Same shape as the box — just higher up. A great reference point.</p>
      </PositionCard>

      <PositionCard num={5} name="Position 5" notes="A C D E G" root="G string fret 14">
        <TabBlock label="Position 5 (14th–15th fret area)">
{`e|--15-17-------|
B|--15-17-------|
G|--14-17-------|
D|--14-17-------|
A|--14-17-------|
E|--15-17-------|
   Connects back to Position 1 at fret 17`}
        </TabBlock>
        <p className="text-purple-200 text-sm">The final position before looping back. Root on the G string (fret 14). Many players skip this — learning it completes the fretboard picture.</p>
      </PositionCard>

      <Callout type="tip">
        Learn positions in order: 1 → 2 → 3. Then 4 → 5. Then connect them. Start by nailing Position 1 before moving on — it&apos;s the foundation everything else builds on.
      </Callout>
    </div>
  )
}

function ConnectingTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Connecting the 5 Positions</h2>
      <p className="text-purple-200 mb-6">Knowing all 5 positions separately isn't the goal. The goal is to move between them fluidly so you can play anywhere on the neck without thinking about shapes.</p>

      <Callout type="insight">
        Every position shares notes with the ones adjacent to it. Find those overlapping notes — they are your &quot;gates&quot; to slide between positions.
      </Callout>

      <Card title="The Connection Points">
        <p className="text-purple-200 text-sm mb-3">Positions overlap at these frets (in Am):</p>
        <div className="space-y-2">
          {[
            { connection: "Pos 1 → Pos 2", gate: "Fret 7–8 on the G, B, e strings", technique: "Slide from 7 to 10 on G string" },
            { connection: "Pos 2 → Pos 3", gate: "Fret 10 on the D and A strings", technique: "Shift hand position up by 2 frets" },
            { connection: "Pos 3 → Pos 4", gate: "Fret 12 across all strings", technique: "Octave octave marker is your landmark" },
            { connection: "Pos 4 → Pos 5", gate: "Fret 15 on the B and e strings", technique: "Extend first finger to reach back" },
          ].map(c => (
            <div key={c.connection} className="border-b border-white/10 pb-2 text-sm">
              <p className="text-amber-300 font-semibold">{c.connection}</p>
              <p className="text-purple-200 text-xs">Gate: {c.gate}</p>
              <p className="text-green-300 text-xs">Technique: {c.technique}</p>
            </div>
          ))}
        </div>
      </Card>

      <TabBlock label="Run from Position 1 to Position 3 (ascending)">
{`e|--5-8---8-10---10-12------|
B|--5-8---8-10---10-13------|
G|--5-7---7-9----9-12------|
D|--5-7---7-9----9-12------|
A|--5-7---7-10---10-12-----|
E|--5-8---8-10---10-12-----|
  Pos1   Pos2   Pos3
  Feel the shift — no gaps, no jumps`}
      </TabBlock>

      <TabBlock label="Diagonal run — connect all 5 positions ascending">
{`e|--5-8-10-12-15-17---------|
B|--5-8-10-13-15------------|
G|--5-7-9-12-14-------------|
D|--5-7-9-12-14-------------|
A|--5-7-10-12-14------------|
E|--5-8-10-12-15-17---------|
  A minor pentatonic: full neck ascending`}
      </TabBlock>

      <TabBlock label="Position linking lick — shift technique">
{`e|--------------------------------|
B|--5-8-5---10-8-5----------------|
G|--------7--------7-5-4----------|
D|---------------------------7-5--|
A|--------------------------------|
E|--------------------------------|
  Shift hand up after fret 8 (B string)`}
      </TabBlock>

      <Card title="3 Methods to Move Between Positions">
        <div className="space-y-3">
          {[
            { method: "Slide", desc: "Slide your fretting finger from the last note of one position to the first note of the next. Smooth and fast.", example: "Slide from G-string fret 7 up to fret 9" },
            { method: "Stretch", desc: "Reach one finger up or down to grab the next position's note without moving your hand.", example: "From Pos 1, stretch pinky to fret 8 on G-string to enter Pos 2" },
            { method: "Shift", desc: "Move your entire hand position. Brief gap is OK — disguise it with a bend or vibrato on the destination note.", example: "Play to end of Pos 2, shift hand, land with a bend in Pos 3" },
          ].map(m => (
            <div key={m.method} className="border-b border-white/10 pb-3">
              <p className="text-white font-semibold text-sm">{m.method}</p>
              <p className="text-purple-200 text-xs mt-1">{m.desc}</p>
              <p className="text-amber-300 text-xs mt-1">Example: {m.example}</p>
            </div>
          ))}
        </div>
      </Card>

      <Callout type="exercise">
        <p className="font-semibold mb-1">Exercise: The One-String Run</p>
        Play the Am pentatonic up and down on the high E string only: frets 5, 8, 10, 12, 15, 17. Say the position number as you play each note. This shows you exactly where each position lives on the neck without the complexity of 6 strings.
      </Callout>
    </div>
  )
}

function LicksTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Classic Pentatonic Licks</h2>
      <p className="text-purple-200 mb-6">These are the building blocks of rock and blues guitar. Learn these licks, understand how they work, and mix and match them in your own solos.</p>

      <Callout type="tip">
        Don&apos;t just memorise these — understand them. Know which notes they use, why they sound good, and how to transpose them to other keys.
      </Callout>

      <TabBlock label="Lick 1 — The Classic BB King Box">
{`e|--8b10-8---------|
B|--------10-8-----|
G|-----------9-7---|
D|-------------7---|
A|-----------------|
E|-----------------|
  Bend on the B string, descend melodically
  This is in Am Position 1`}
      </TabBlock>

      <TabBlock label="Lick 2 — The Double Stop Grunt (Chuck Berry / Keith Richards)">
{`e|--8b10-10-8------|
B|--10-------10-8--|
G|-----------------|
D|-----------------|
A|-----------------|
E|-----------------|
  Play both strings together (double stop)
  Bend the high e while holding B`}
      </TabBlock>

      <TabBlock label="Lick 3 — The Hendrix Lick (Position 1, bends and hammer-ons)">
{`e|--8-5-----------  |
B|------8-6-5------|
G|----------7-5----|
D|------------7-5--|
A|-----------------|
E|-----------------|
  Descend with purpose. Land on the A (root)`}
      </TabBlock>

      <TabBlock label="Lick 4 — The Clapton Turnaround">
{`e|--8-8b10-8-------|
B|----------10-8---|
G|------------9-7--|
D|-----------------|
A|--0--------------|
E|-----------------|
  Pull off to open A string — gives it that twang`}
      </TabBlock>

      <TabBlock label="Lick 5 — The High String SRV Bend">
{`e|--17b19~~~-17-15--|
B|--15-17-----------|
G|------------------|
D|------------------|
A|------------------|
E|------------------|
  Position 4/5 area — big, emotional sound
  Dig into that bend and hold it`}
      </TabBlock>

      <TabBlock label="Lick 6 — The Rock Triplet Run">
{`e|--5-8-5-8-5-8--------|
B|----------5-8-5-8----|
G|----------------5-7--|
D|---------------------|
A|---------------------|
E|---------------------|
  Triplet feel: 1-trip-let 2-trip-let
  Speed up gradually — start slow!`}
      </TabBlock>

      <Card title="How to Make Licks Your Own">
        <ol className="space-y-2 text-sm text-purple-200">
          <li><span className="text-white font-semibold">1. Transpose:</span> Learn each lick in A, then move it to G, E, D. Same shape, different fret position.</li>
          <li><span className="text-white font-semibold">2. Combine:</span> Play Lick 1, pause, then Lick 3. Mix them. This is how solos are built.</li>
          <li><span className="text-white font-semibold">3. Vary timing:</span> Play lick 1 straight, then swing it, then double-time it. Same notes — different feel.</li>
          <li><span className="text-white font-semibold">4. Add dynamics:</span> Play it quiet, then loud, then with a swell. Volume changes expression radically.</li>
          <li><span className="text-white font-semibold">5. Reverse it:</span> Play any lick backwards. Often creates something completely new.</li>
        </ol>
      </Card>

      <Callout type="exercise">
        <p className="font-semibold mb-1">Exercise: The Lick Chain</p>
        Over a 12-bar blues, use only Licks 1, 2, and 3. For each 4-bar phrase, use one lick. Then start combining them: Lick 1 + pause + Lick 2. Build a whole solo from just these 3 licks. This forces musical arrangement, not noodling.
      </Callout>
    </div>
  )
}

function BendingTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Bending & Vibrato</h2>
      <p className="text-purple-200 mb-6">Bending and vibrato are what separates guitarists who sound human from those who sound like a MIDI file. These techniques add expression, emotion, and soul to every note you play.</p>

      <Card title="Bending — The Foundation">
        <p className="text-purple-200 text-sm mb-3">A bend pushes the string across the fretboard, raising the pitch. The most expressive tool on guitar.</p>
        <div className="space-y-3">
          {[
            { type: "Half bend (♭)", amount: "1 semitone up", target: "One fret higher in pitch", feel: "Slight tension — a musical question" },
            { type: "Full bend (1)", amount: "2 semitones up", target: "Two frets higher in pitch", feel: "Classic blues/rock expression" },
            { type: "1.5 bend", amount: "3 semitones up", target: "Three frets higher", feel: "Very emotional, pushing into uncharted territory" },
            { type: "Pre-bend", amount: "Bend before picking", target: "Pick after bending up", feel: "Surprise — note appears already bent" },
            { type: "Release bend", amount: "Bend up then release", target: "Descend by releasing", feel: "Drooping, melancholic sound" },
          ].map(b => (
            <div key={b.type} className="border-b border-white/10 pb-2 text-sm">
              <p className="text-white font-semibold">{b.type} <span className="text-amber-300 font-mono text-xs ml-1">{b.amount}</span></p>
              <p className="text-purple-200 text-xs">{b.feel}</p>
            </div>
          ))}
        </div>
      </Card>

      <TabBlock label="Bend exercises — start here">
{`e|----------------------------|
B|--8b10----- 8b10r8--------- |
G|----------- -------------- |
  ^ Full bend   ^ Bend + release

e|---------------------------|
B|--8b9------- 8(b10)-8----- |
G|------------ ------------- |
  ^ Half bend   ^ Pre-bend + pick

Tip: Use 3 fingers behind the bending finger
to add strength and control`}
      </TabBlock>

      <Card title="Vibrato — The Singer&apos;s Vibrato">
        <p className="text-purple-200 text-sm mb-3">Vibrato is a rhythmic oscillation of pitch. The goal: sound like a singer, not a sewing machine. Even vibrato = boring. Rhythmic vibrato = expression.</p>
        <div className="space-y-2 text-sm">
          {[
            { type: "Classical (parallel)", desc: "Move fingertip along the string length (in-out motion). Subtle, controlled.", use: "Clean tones, arpeggios" },
            { type: "Rock (push-pull)", desc: "Bend string slightly up-down in a rhythmic pulse. Like a small, controlled bend.", use: "Lead guitar, solos" },
            { type: "Wide & slow", desc: "Slow oscillation, wide pitch variation. Emotional, vocal quality.", use: "Ballads, held notes" },
            { type: "Fast & tight", desc: "Rapid small oscillation. Nervous energy, urgency.", use: "Intense moments, climactic notes" },
          ].map(v => (
            <div key={v.type} className="border-b border-white/10 pb-2">
              <p className="text-white font-semibold">{v.type}</p>
              <p className="text-purple-200 text-xs">{v.desc}</p>
              <p className="text-amber-300 text-xs">Use for: {v.use}</p>
            </div>
          ))}
        </div>
      </Card>

      <TabBlock label="Vibrato exercise — held note with vibrato">
{`e|---------------------------|
B|--8~~~(wide)---8~~~(tight)--|
G|---------------------------|
   Hold the note and oscillate
   Start wide and slow, then vary speed/width

   Aim for: rhythmic, intentional, vocal`}
      </TabBlock>

      <TabBlock label="Combined: bend into vibrato">
{`e|-------------------------------|
B|--8b10~~~ -- 8b10r8-5-- ------|
G|-------------------------------|
   Bend up + vibrato on peak     Release down

   This is the signature SRV/Clapton technique`}
      </TabBlock>

      <Callout type="warning">
        The most common mistake with bends: not bending in tune. A full bend (1 whole step) must reach the exact pitch of 2 frets higher. Practice bending and checking with a tuner until your ear locks in.
      </Callout>

      <Callout type="exercise">
        <p className="font-semibold mb-1">Exercise: Sing Your Bends</p>
        Before bending, hum the target note. Then bend to that pitch. If the bent note and hummed note match, you&apos;re bending in tune. Do this every day — it develops your ear and your bending accuracy simultaneously.
      </Callout>
    </div>
  )
}

function PracticeTab() {
  const [checked, setChecked] = useState<number[]>([])
  const toggle = (i: number) => setChecked(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])

  const days = [
    {
      day: "Day 1–3",
      title: "Learn Position 1",
      tasks: [
        "Play Position 1 ascending and descending (5 min)",
        "Identify root notes (fret 5 on low E and A strings)",
        "Play Position 1 over an Am backing track — just up and down",
        "Learn Lick 1 (BB King box)",
      ]
    },
    {
      day: "Day 4–6",
      title: "Add Position 2, connect to Position 1",
      tasks: [
        "Learn Position 2 ascending and descending (5 min)",
        "Practice the Position 1 → 2 slide/shift (10 min)",
        "Run from Position 1 to 2 and back (5 min)",
        "Add Lick 2 (double stop)",
      ]
    },
    {
      day: "Day 7–10",
      title: "Position 3 + first solo",
      tasks: [
        "Learn Position 3",
        "Connect Positions 1, 2, 3 in a continuous run",
        "Improvise a 12-bar blues using Positions 1 and 2 only",
        "Record yourself — listen back critically",
      ]
    },
    {
      day: "Day 11–14",
      title: "Positions 4 & 5 + bending",
      tasks: [
        "Learn Positions 4 and 5",
        "Full neck run: ascending through all 5 positions",
        "Practice full bends on B string (fret 7 and 8)",
        "Add vibrato to every held note in your solos",
      ]
    },
    {
      day: "Day 15–21",
      title: "Connecting all 5 + complete solos",
      tasks: [
        "Daily: run all 5 positions ascending and descending",
        "Learn Licks 3, 4, and 5",
        "Improvise a 3-chorus blues: each chorus in a different position",
        "Focus on dynamics — vary your attack intensity",
        "Build a signature 8-bar solo using your favourite licks",
      ]
    },
  ]

  const allTasks = days.flatMap((d, di) => d.tasks.map((t, ti) => ({ task: t, id: di * 10 + ti })))

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">21-Day Pentatonic Practice Plan</h2>
      <p className="text-purple-200 mb-6">A structured plan to go from knowing one position to owning the entire fretboard. Practice 20–30 minutes daily.</p>

      <Callout type="insight">
        Consistency beats intensity. 20 minutes every day beats 2 hours once a week. Your fingers and brain need repetition across multiple days to build new patterns.
      </Callout>

      <div className="mb-4 bg-white/5 rounded-xl p-3 flex items-center gap-3">
        <div className="text-2xl font-bold text-purple-300">{checked.length}/{allTasks.length}</div>
        <div className="flex-1 bg-white/10 rounded-full h-2">
          <div
            className="bg-purple-500 h-2 rounded-full transition-all"
            style={{ width: `${(checked.length / allTasks.length) * 100}%` }}
          />
        </div>
        <div className="text-purple-300 text-sm">{Math.round((checked.length / allTasks.length) * 100)}%</div>
      </div>

      {days.map((d, di) => (
        <div key={di} className="bg-white/10 border border-white/20 rounded-xl p-5 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{d.day}</div>
            <h3 className="text-white font-bold">{d.title}</h3>
          </div>
          <ul className="space-y-2">
            {d.tasks.map((t, ti) => {
              const id = di * 10 + ti
              const done = checked.includes(id)
              return (
                <li
                  key={ti}
                  onClick={() => toggle(id)}
                  className={`flex items-start gap-3 cursor-pointer text-sm transition-all ${done ? "opacity-50" : ""}`}
                >
                  <div className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${done ? "bg-purple-600 border-purple-600" : "border-white/30"}`}>
                    {done && <span className="text-white text-xs">✓</span>}
                  </div>
                  <span className={`text-purple-200 ${done ? "line-through" : ""}`}>{t}</span>
                </li>
              )
            })}
          </ul>
        </div>
      ))}

      <Card title="Daily Warm-Up Routine (5 minutes)">
        <ol className="space-y-1 text-sm text-purple-200">
          <li>1. Chromatic exercise: 1-2-3-4 across all strings to warm fingers</li>
          <li>2. Position 1 ascending and descending (slow, clean, with a metronome)</li>
          <li>3. One bend practice: fret 7 on G string, full bend to pitch of fret 9</li>
          <li>4. Vibrato on one held note: 20 seconds continuous vibrato</li>
        </ol>
      </Card>

      <Callout type="tip">
        Use a metronome. Start at 60 BPM. Only increase tempo when you can play clean at the current speed. Speed is a byproduct of accuracy, not effort.
      </Callout>
    </div>
  )
}

// ─── Key Explorer ─────────────────────────────────────────────────────────────
const CHROMATIC = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

const KEY_LABELS: Record<string, string> = {
  'C': 'C', 'C#': 'C# / Db', 'D': 'D', 'D#': 'D# / Eb', 'E': 'E',
  'F': 'F', 'F#': 'F# / Gb', 'G': 'G', 'G#': 'G# / Ab', 'A': 'A',
  'A#': 'A# / Bb', 'B': 'B',
}

function noteAt(rootIdx: number, semitones: number): string {
  return CHROMATIC[(rootIdx + semitones) % 12]
}

interface ChordEntry { name: string; root: string; quality: string; role: string }

function getChordGroups(rootIdx: number, scaleType: "minor" | "major"): Record<string, ChordEntry[]> {
  if (scaleType === "minor") {
    return {
      "Rock / Minor": [
        { name: `${noteAt(rootIdx, 0)}m`,  root: noteAt(rootIdx, 0),  quality: "Minor",        role: "i — home chord" },
        { name: noteAt(rootIdx, 10),        root: noteAt(rootIdx, 10), quality: "Major",        role: "♭VII — lift and drive" },
        { name: noteAt(rootIdx, 9),         root: noteAt(rootIdx, 9),  quality: "Major",        role: "♭VI — melancholy" },
        { name: noteAt(rootIdx, 3),         root: noteAt(rootIdx, 3),  quality: "Major",        role: "♭III — brightness" },
        { name: `${noteAt(rootIdx, 5)}m`,   root: noteAt(rootIdx, 5),  quality: "Minor",        role: "iv — darker pull" },
      ],
      "Blues / Dominant": [
        { name: `${noteAt(rootIdx, 0)}7`,   root: noteAt(rootIdx, 0),  quality: "Dominant 7th", role: "I7 — home (12-bar)" },
        { name: `${noteAt(rootIdx, 5)}7`,   root: noteAt(rootIdx, 5),  quality: "Dominant 7th", role: "IV7 — 12-bar IV" },
        { name: `${noteAt(rootIdx, 7)}7`,   root: noteAt(rootIdx, 7),  quality: "Dominant 7th", role: "V7 — tension" },
      ],
    }
  }
  return {
    "Country / Pop": [
      { name: noteAt(rootIdx, 0),           root: noteAt(rootIdx, 0),  quality: "Major",        role: "I — bright home" },
      { name: noteAt(rootIdx, 5),           root: noteAt(rootIdx, 5),  quality: "Major",        role: "IV — lift" },
      { name: noteAt(rootIdx, 7),           root: noteAt(rootIdx, 7),  quality: "Major",        role: "V — tension & drive" },
      { name: `${noteAt(rootIdx, 9)}m`,     root: noteAt(rootIdx, 9),  quality: "Minor",        role: "vi — relative minor" },
    ],
    "Rock / Blues-Major": [
      { name: noteAt(rootIdx, 0),           root: noteAt(rootIdx, 0),  quality: "Major",        role: "I — punchy home" },
      { name: noteAt(rootIdx, 5),           root: noteAt(rootIdx, 5),  quality: "Major",        role: "IV — classic rock" },
      { name: noteAt(rootIdx, 7),           root: noteAt(rootIdx, 7),  quality: "Major",        role: "V — driving" },
      { name: `${noteAt(rootIdx, 10)}`  ,   root: noteAt(rootIdx, 10), quality: "Major",        role: "♭VII — adds blues edge" },
    ],
  }
}

function getPentNotes(rootIdx: number, scaleType: "minor" | "major"): { note: string; interval: string }[] {
  const intervals = scaleType === "minor"
    ? [{ s: 0, i: "Root" }, { s: 3, i: "♭3" }, { s: 5, i: "4" }, { s: 7, i: "5" }, { s: 10, i: "♭7" }]
    : [{ s: 0, i: "Root" }, { s: 2, i: "2"  }, { s: 4, i: "3" }, { s: 7, i: "5" }, { s: 9,  i: "6"  }]
  return intervals.map(({ s, i }) => ({ note: noteAt(rootIdx, s), interval: i }))
}

function KeyExplorerTab() {
  const [selectedKey, setSelectedKey] = useState("A")
  const [scaleType, setScaleType] = useState<"minor" | "major">("minor")
  const [selectedChord, setSelectedChord] = useState<ChordEntry | null>(null)
  const [voicingIdx, setVoicingIdx] = useState(0)

  const rootIdx = CHROMATIC.indexOf(selectedKey)
  const pentNotes = getPentNotes(rootIdx, scaleType)
  const chordGroups = getChordGroups(rootIdx, scaleType)
  const scaleName = `${KEY_LABELS[selectedKey]} ${scaleType === "minor" ? "Minor" : "Major"} Pentatonic`

  const voicings = selectedChord ? CHORD_VOICINGS[selectedChord.root]?.[selectedChord.quality] : null
  const currentVoicing = voicings?.[voicingIdx] ?? null

  function selectChord(chord: ChordEntry) {
    if (selectedChord?.name === chord.name && selectedChord?.quality === chord.quality) {
      setSelectedChord(null)
    } else {
      setSelectedChord(chord)
      setVoicingIdx(0)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Key Explorer</h2>
      <p className="text-purple-200 mb-6">
        Select your key and scale type — see the scale notes and every backing chord that works.
        Tap any chord to view its shape on the fretboard.
      </p>

      {/* Scale type toggle */}
      <div className="flex gap-2 mb-5">
        {(["minor", "major"] as const).map(t => (
          <button
            key={t}
            onClick={() => { setScaleType(t); setSelectedChord(null) }}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
              scaleType === t ? "bg-purple-600 text-white" : "bg-white/10 text-purple-300 hover:bg-white/20"
            }`}
          >
            {t === "minor" ? "Minor Pentatonic" : "Major Pentatonic"}
          </button>
        ))}
      </div>

      {/* Key selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CHROMATIC.map(k => (
          <button
            key={k}
            onClick={() => { setSelectedKey(k); setSelectedChord(null) }}
            className={`px-3 py-2 rounded-xl text-sm font-bold transition-all min-w-[52px] text-center ${
              selectedKey === k
                ? "bg-amber-500 text-black"
                : "bg-white/10 text-purple-300 hover:bg-white/20"
            }`}
          >
            {k}
          </button>
        ))}
      </div>

      {/* Scale notes */}
      <div className="bg-white/10 border border-white/20 rounded-xl p-4 mb-6">
        <p className="text-amber-400 font-bold text-sm mb-3">{scaleName}</p>
        <div className="flex gap-2 flex-wrap">
          {pentNotes.map((n, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base border-2 ${
                i === 0 ? "bg-amber-500 border-amber-400 text-black" : "bg-purple-600/40 border-purple-500/50 text-white"
              }`}>
                {n.note}
              </div>
              <div className="text-purple-400 text-xs mt-1">{n.interval}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Chord groups */}
      {Object.entries(chordGroups).map(([groupName, chords]) => (
        <div key={groupName} className="mb-6">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">{groupName}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {chords.map((chord) => {
              const isSelected = selectedChord?.name === chord.name && selectedChord?.quality === chord.quality
              return (
                <button
                  key={chord.name + chord.quality}
                  onClick={() => selectChord(chord)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "bg-purple-600 border-purple-400 text-white"
                      : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                  }`}
                >
                  <p className="font-bold text-base">{chord.name}</p>
                  <p className={`text-xs mt-0.5 ${isSelected ? "text-purple-200" : "text-purple-400"}`}>{chord.role}</p>
                </button>
              )
            })}
          </div>
        </div>
      ))}

      {/* Chord diagram panel */}
      {selectedChord && (
        <div className="bg-white/10 border border-purple-500/50 rounded-2xl p-5 mt-2">
          <div className="flex items-start justify-between mb-4 gap-4">
            <div>
              <h3 className="text-white font-bold text-xl">{selectedChord.name}</h3>
              <p className="text-purple-300 text-sm">{selectedChord.quality} · {selectedChord.role}</p>
            </div>
            <button
              onClick={() => setSelectedChord(null)}
              className="text-purple-400 hover:text-white text-xl leading-none flex-shrink-0"
            >
              ✕
            </button>
          </div>

          {voicings && voicings.length > 0 ? (
            <>
              {/* Voicing selector */}
              {voicings.length > 1 && (
                <div className="flex gap-2 mb-5 flex-wrap">
                  {voicings.map((v, i) => (
                    <button
                      key={i}
                      onClick={() => setVoicingIdx(i)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                        voicingIdx === i
                          ? "bg-purple-600 border-purple-400 text-white"
                          : "bg-white/10 border-white/20 text-purple-300 hover:bg-white/20"
                      }`}
                    >
                      {v.position}
                      <span className={`ml-1.5 px-1.5 py-0.5 rounded text-xs ${
                        v.difficulty === 'beginner' ? 'bg-green-500/30 text-green-300' : 'bg-amber-500/30 text-amber-300'
                      }`}>
                        {v.difficulty}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Diagram + info */}
              <div className="flex gap-6 items-start flex-wrap">
                <ChordDiagram
                  chordName={selectedChord.name}
                  fingers={currentVoicing!.fingers}
                  size="large"
                />
                <div className="flex-1 min-w-[160px]">
                  <p className="text-white font-semibold mb-1">{currentVoicing!.position}</p>
                  <p className={`text-xs px-2 py-0.5 rounded-full inline-block mb-4 ${
                    currentVoicing!.difficulty === 'beginner'
                      ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {currentVoicing!.difficulty}
                  </p>
                  <div className="space-y-1 text-xs text-purple-300">
                    <p className="font-semibold text-purple-200 mb-2">String guide (low → high):</p>
                    {(['E','A','D','G','B','e'] as const).map((s, i) => {
                      const f = currentVoicing!.fingers[i]
                      return (
                        <div key={s} className="flex items-center gap-2">
                          <span className="w-4 text-purple-400 font-mono">{s}</span>
                          <span className={`font-mono ${
                            f === 'x' ? 'text-red-400' : f === 0 ? 'text-green-400' : 'text-white'
                          }`}>
                            {f === 'x' ? '✕ muted' : f === 0 ? '○ open' : `fret ${f}`}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p className="text-purple-400 text-sm">No shape found for this chord.</p>
          )}
        </div>
      )}
    </div>
  )
}

export default function PentatonicPage() {
  const [activeTab, setActiveTab] = useState<Tab>("positions")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link href="/" className="text-purple-300 hover:text-white text-sm">← Back to modules</Link>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Pentatonic Mastery</h1>
          <p className="text-purple-200">Master all 5 positions of the minor pentatonic, connect them across the neck, and play with licks, bends, and vibrato.</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === t.id
                  ? "bg-purple-600 text-white"
                  : "bg-white/10 text-purple-300 hover:bg-white/20"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
          {activeTab === "positions"    && <PositionsTab />}
          {activeTab === "connecting"   && <ConnectingTab />}
          {activeTab === "licks"        && <LicksTab />}
          {activeTab === "bending"      && <BendingTab />}
          {activeTab === "practice"     && <PracticeTab />}
          {activeTab === "key-explorer" && <KeyExplorerTab />}
        </div>
      </div>
    </div>
  )
}
