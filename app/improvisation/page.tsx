"use client"

import { useState } from "react"
import Link from "next/link"

type Tab = "mindset" | "phrases" | "motifs" | "space" | "dynamics" | "over-blues"

const TABS: { id: Tab; label: string }[] = [
  { id: "mindset", label: "The Right Mindset" },
  { id: "phrases", label: "Building Phrases" },
  { id: "motifs", label: "Motif Development" },
  { id: "space", label: "The Power of Space" },
  { id: "dynamics", label: "Dynamics" },
  { id: "over-blues", label: "Over the Blues" },
]

function Callout({ type, children }: { type: "tip" | "warning" | "quote" | "exercise"; children: React.ReactNode }) {
  const styles = {
    tip: "border-l-4 border-purple-500 bg-purple-500/10 text-purple-200",
    warning: "border-l-4 border-amber-500 bg-amber-500/10 text-amber-200",
    quote: "border-l-4 border-blue-400 bg-blue-400/10 text-blue-200 italic",
    exercise: "border-l-4 border-green-500 bg-green-500/10 text-green-200",
  }
  const labels = { tip: "💡 Tip", warning: "⚠️ Common Mistake", quote: "💬 Remember", exercise: "🎸 Exercise" }
  return (
    <div className={`rounded-xl p-4 mb-4 ${styles[type]}`}>
      <p className="text-xs font-bold uppercase tracking-wider mb-1 opacity-80">{labels[type]}</p>
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  )
}

function Tab({ label, children }: { label: string; children: string }) {
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

function MindsetTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">The Right Mindset for Improvisation</h2>
      <p className="text-purple-200 mb-6">Before you play a single note, you need to rewire how you think about improvisation. The biggest barrier isn't technique — it's your inner critic.</p>

      <Callout type="quote">
        "There are no wrong notes in jazz — only wrong resolutions." — Miles Davis
      </Callout>

      <Card title="The 5 Mental Shifts">
        <ol className="space-y-3 text-sm text-purple-200">
          <li><span className="text-white font-semibold">1. From 'playing correct notes' to 'making music'</span><br />Your job isn't to avoid mistakes. It's to express something. A "wrong" note played confidently and resolved well sounds intentional.</li>
          <li><span className="text-white font-semibold">2. From 'soloing' to 'having a conversation'</span><br />Think of improv as dialogue — you ask a question (rising phrase), someone answers (falling phrase). Listen and respond.</li>
          <li><span className="text-white font-semibold">3. From 'playing lots of notes' to 'saying something'</span><br />Beginners fill space. Pros choose when to play. A single well-placed bend says more than 16 notes of noodling.</li>
          <li><span className="text-white font-semibold">4. From 'the pentatonic box' to 'targeting chord tones'</span><br />Know which notes belong to each chord. Arrive on those notes on beat 1 — everything else is just the journey there.</li>
          <li><span className="text-white font-semibold">5. From 'improvising' to 'composing in real time'</span><br />Great improvisers are building structure on the fly — themes, variations, tension, release. Start thinking this way.</li>
        </ol>
      </Card>

      <Card title="The 5-Minute Mindset Reset (Do This Before Every Practice)">
        <ol className="space-y-2 text-sm text-purple-200">
          <li>1. Put on a backing track. Just listen for 1 minute — feel the groove without playing.</li>
          <li>2. Hum a melody over it. Whatever comes out. Don't judge it.</li>
          <li>3. Now find those hummed notes on the guitar. Match what you sang.</li>
          <li>4. Play that phrase. Then stop. Then play something in response to it.</li>
          <li>5. You're now improvising — not from theory, but from your musical ear.</li>
        </ol>
      </Card>

      <Callout type="tip">
        Sing what you want to play BEFORE you play it. This is the single most powerful habit you can develop. It forces your fingers to follow your musical ideas instead of running on autopilot.
      </Callout>

      <Card title="The Golden Rule of Improvisation">
        <p className="text-purple-200 text-sm mb-3">Every phrase you play should have:</p>
        <ul className="space-y-2 text-sm">
          <li className="text-green-300 font-semibold">• A beginning (a starting note or gesture)</li>
          <li className="text-green-300 font-semibold">• A middle (movement, tension, development)</li>
          <li className="text-green-300 font-semibold">• An end (resolution — landing somewhere intentional)</li>
        </ul>
        <p className="text-purple-200 text-sm mt-3">Even a 3-note phrase can have all three. This gives your playing shape and direction.</p>
      </Card>

      <Callout type="exercise">
        <p className="font-semibold mb-1">Daily Mindset Exercise:</p>
        Pick up your guitar and play exactly 5 notes over a backing track. That's it — just 5. Make them count. Give them a beginning, middle, and end. The constraint forces musicality.
      </Callout>
    </div>
  )
}

function PhrasesTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Building Musical Phrases</h2>
      <p className="text-purple-200 mb-6">A phrase is a complete musical thought — like a sentence. Great solos are built from great phrases, not random notes. Here's how to build them.</p>

      <Card title="The 4-Note Phrase — Your Starting Point">
        <p className="text-purple-200 text-sm mb-3">Start with just 4 notes. This forces you to make every note matter. Here's a simple framework:</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
          {["Note 1\nTension", "Note 2\nMovement", "Note 3\nPeak", "Note 4\nResolution"].map((n, i) => (
            <div key={i} className="bg-purple-600/20 border border-purple-500/30 rounded-lg p-2 text-center">
              <p className="text-purple-300 text-xs whitespace-pre-line">{n}</p>
            </div>
          ))}
        </div>
      </Card>

      <Tab label="Phrase 1 — Call (A minor pentatonic, position 1)">
{`e|------------------------|
B|------------------------|
G|------------------------|
D|------5b7~~~------------|
A|--5-7-------------------|
E|------------------------|
  Start  Bend  Hold...    `}
      </Tab>

      <Tab label="Phrase 2 — Response">
{`e|------------------------|
B|--5-8-5-----------3-5---|
G|--------5-4-2-----------|
D|------------------------|
A|------------------------|
E|------------------------|
  Question...      Answer `}
      </Tab>

      <Tab label="Phrase 3 — Ascending then landing">
{`e|------8-5---------------|
B|--5-8-----8-6-5---------|
G|----------------5-4-2---|
D|----------------------5-|
A|------------------------|
E|------------------------|
  Climb up...   Land here  `}
      </Tab>

      <Tab label="Phrase 4 — Repetition with variation">
{`e|------------------------|
B|--5-8b10--5-8b10r8-5----|
G|------------------------|
D|------------------------|
A|------------------------|
E|------------------------|
  Same idea, pushed further `}
      </Tab>

      <Card title="Phrase Shapes — The 4 Moves">
        <div className="space-y-3">
          {[
            { name: "Arc Up", desc: "Start low, climb to a peak, then resolve down. Creates excitement and release.", symbol: "↗↘" },
            { name: "Arc Down", desc: "Start high, descend with intention. Melancholic, resolved feeling.", symbol: "↘↗" },
            { name: "Tension Hold", desc: "Stay on one note (or bend), vibrato it, then move. Like a question hanging in the air.", symbol: "→→→" },
            { name: "Call and Response", desc: "Play a phrase, leave space, then answer it. Best technique for musical dialogue.", symbol: "? !" },
          ].map(s => (
            <div key={s.name} className="flex gap-3 items-start">
              <div className="bg-purple-600/30 text-purple-300 font-mono text-lg w-10 flex-shrink-0 text-center pt-0.5">{s.symbol}</div>
              <div>
                <p className="text-white font-semibold text-sm">{s.name}</p>
                <p className="text-purple-200 text-xs">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Callout type="exercise">
        <p className="font-semibold mb-1">Practice: Phrase and Respond</p>
        Put on an A minor backing track (70 BPM). Play a 2-bar phrase, then stop. Listen to the silence. Then play a response. Do this for 10 minutes — no noodling, just deliberate call-and-response. Record yourself.
      </Callout>

      <Callout type="tip">
        Land on chord tones on beat 1. You can play any note on the way there — but arrive on a chord tone (root, 3rd, 5th) on the downbeat and it will always sound musical.
      </Callout>
    </div>
  )
}

function MotifsTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Motif Development</h2>
      <p className="text-purple-200 mb-6">A motif is a short musical idea — 2 to 5 notes — that you repeat, vary, and develop throughout a solo. It's what separates a memorable solo from random noodling.</p>

      <Callout type="quote">
        Beethoven's 5th Symphony uses 4 notes — da-da-da-DUM. That's a motif. Build your solos the same way.
      </Callout>

      <Card title="The 3-Step Motif Technique">
        <ol className="space-y-3 text-sm text-purple-200">
          <li><span className="text-white font-semibold">Step 1 — State it:</span> Play your motif clearly. Let the listener hear it and recognise it.</li>
          <li><span className="text-white font-semibold">Step 2 — Vary it:</span> Repeat it higher, lower, faster, slower, with bends, with rhythm changes.</li>
          <li><span className="text-white font-semibold">Step 3 — Resolve it:</span> Bring the motif home — play it one final time and land on the root. Full circle.</li>
        </ol>
      </Card>

      <Tab label="Base Motif — 3 notes (A minor pentatonic)">
{`e|----------------|
B|----------------|
G|----------------|
D|--7-5-----------|
A|------7---------|
E|----------------|
  Motif: D-C-A     `}
      </Tab>

      <Tab label="Variation 1 — Move it up an octave">
{`e|--8-5-----------|
B|------8---------|
G|----------------|
D|----------------|
A|----------------|
E|----------------|
  Same shape, up 1 octave `}
      </Tab>

      <Tab label="Variation 2 — Add a bend">
{`e|----------------|
B|----------------|
G|--7b9-5---------|
D|--------7-------|
A|----------------|
E|----------------|
  Same rhythm, bend the 1st note `}
      </Tab>

      <Tab label="Variation 3 — Slower, with vibrato">
{`e|----------------|
B|----------------|
G|----------------|
D|--7-5~~~--------|
A|------7~~~------|
E|----------------|
  Hold each note longer, add vibrato `}
      </Tab>

      <Tab label="Variation 4 — Double time (twice as fast)">
{`e|--------------------------|
B|--------------------------|
G|--------------------------|
D|--7-5-7-5-7-5-------------|
A|----------7-5-7-----------|
E|--------------------------|
  Same notes, play twice as fast `}
      </Tab>

      <Tab label="Full motif solo — all 4 variations connected">
{`e|-------------------------8-5-----------|
B|-----------------------------8---------|
G|--7b9-5--------------------------7b9-5-|
D|--------7---7-5-7-5-7-5-----------7---|
A|------------7-5-7--------7~~~---------|
E|---------------------------------------|
  State → vary → escalate → resolve      `}
      </Tab>

      <Callout type="exercise">
        <p className="font-semibold mb-1">Exercise: The 12-Bar Motif Solo</p>
        Choose a 3-note motif. Over a 12-bar blues, use ONLY that motif. Play it in 4 different ways across the 12 bars. No other notes. This forces motif thinking and will change how you solo.
      </Callout>

      <Callout type="tip">
        The best motifs are singable. If you can hum it, you can develop it. If you can't hum it, it's probably too complicated.
      </Callout>
    </div>
  )
}

function SpaceTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">The Power of Space</h2>
      <p className="text-purple-200 mb-6">Silence is the most underused tool in a guitarist's arsenal. The notes you don't play define the notes you do. Space creates tension, drama, and gives the listener time to absorb what you just played.</p>

      <Callout type="quote">
        "It's not the notes you play, it's the notes you don't play." — Miles Davis
      </Callout>

      <Card title="The 50/50 Rule">
        <p className="text-purple-200 text-sm mb-3">In any given bar, aim to have silence for at least 50% of it. Play for 2 beats, rest for 2 beats. This instantly makes your playing more musical.</p>
        <Tab label="50/50 Example — play 2, rest 2">
{`Beats:  1   2   3   4   1   2   3   4
        PLAY REST REST REST PLAY PLAY REST REST

e|------5-8-----------5-8b10--------|
B|--5-8---------5-8-9---------------|
G|----------------------------------|
D|----------------------------------|
        Play      Space      Play  Space`}
        </Tab>
      </Card>

      <Card title="Types of Space">
        <div className="space-y-3">
          {[
            { name: "The Setup Pause", desc: "Before a big bend or climax note, pause 1 beat. The silence creates anticipation.", time: "~1 beat" },
            { name: "The Breath Space", desc: "After a fast run, stop. Let the run land. Then respond to it.", time: "~1 bar" },
            { name: "The Dramatic Pause", desc: "Stop for 2+ bars. Let the backing track breathe. Then re-enter with authority.", time: "2+ bars" },
            { name: "The Call Space", desc: "Play a phrase, stop, and let the rhythm section 'answer'. Then you respond.", time: "~2 beats" },
          ].map(s => (
            <div key={s.name} className="flex gap-3 items-start">
              <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg px-2 py-1 text-blue-300 text-xs font-mono flex-shrink-0">{s.time}</div>
              <div>
                <p className="text-white font-semibold text-sm">{s.name}</p>
                <p className="text-purple-200 text-xs">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Tab label="Using space to build tension — before the big bend">
{`e|--------------------------------8b10~~~|
B|--5-8-5---5-8-5---------...----|--------|
G|--------6-------6-4-2-...-.....|--------|
D|---------------------------------------|
        Phrase    Space (2 beats)  BANG!  `}
      </Tab>

      <Callout type="exercise">
        <p className="font-semibold mb-1">Exercise: The Space Police</p>
        Record yourself soloing for 2 minutes. Then listen back. Every time you play non-stop for more than 4 beats, mark it. Aim to cut those sections in half. Replace the extra notes with silence. Listen again — you'll be shocked how much better it sounds.
      </Callout>

      <Card title="Follow the Drummer — Space Exercise">
        <p className="text-purple-200 text-sm mb-3">Instead of thinking about the chord or scale, listen to the drummer. Play in the gaps between snare hits. Let the kick drum tell you when to land notes. This syncs you to the groove and naturally creates space.</p>
        <ol className="space-y-1 text-sm text-purple-200">
          <li>1. Put on a drum-heavy backing track</li>
          <li>2. Listen for 30 seconds — identify snare hits (beats 2 and 4)</li>
          <li>3. Play phrases that END on snare hits (not start)</li>
          <li>4. Leave the beats before the snare empty — that's where tension lives</li>
        </ol>
      </Card>

      <Callout type="tip">
        When you feel the urge to fill space — don't. That feeling of discomfort is the feeling of tension being built. Sit in it. When you finally play, the notes will hit harder.
      </Callout>
    </div>
  )
}

function DynamicsTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Dynamics — Volume, Intensity & Emotion</h2>
      <p className="text-purple-200 mb-6">Dynamics are the difference between a flat solo and an emotional journey. Learn to control not just what you play, but how loud, hard, or soft you play it.</p>

      <Card title="The 4 Dynamic Levels">
        <div className="space-y-3">
          {[
            { level: "pp", name: "Whisper", desc: "Barely touching the strings. Ghost notes, barely-there bends. Creates mystery and intimacy.", color: "text-blue-300" },
            { level: "mp", name: "Conversation", desc: "Normal playing volume. The baseline you return to. Most of your solo lives here.", color: "text-purple-300" },
            { level: "f", name: "Argument", desc: "Digging in hard. Attacking the strings. Aggressive bends and heavy vibrato. Peak intensity.", color: "text-amber-300" },
            { level: "—", name: "Silence", desc: "The loudest dynamic. Total stop. Used strategically, this hits harder than any note.", color: "text-red-300" },
          ].map(d => (
            <div key={d.name} className="flex gap-3 items-start">
              <div className={`font-bold text-lg w-8 text-center flex-shrink-0 ${d.color}`}>{d.level}</div>
              <div>
                <p className={`font-semibold text-sm ${d.color}`}>{d.name}</p>
                <p className="text-purple-200 text-xs">{d.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Tab label="Dynamic arc — whisper to explosion">
{`Whisper:
e|---(8)-(8)-(8)------|   Light touch, barely audible
B|--------------------|
G|--------------------|

Conversation:
e|-----------8-5------|   Normal attack
B|--5-8----------8----|
G|--------------------|

Argument:
e|--8b10!!!~~---------|   DIG IN. Maximum aggression.
B|--------------------|
G|--------------------|

Silence:
    (stop everything)      Let it breathe.`}
      </Tab>

      <Card title="The 12-Bar Dynamic Arc Blueprint">
        <p className="text-purple-200 text-sm mb-3">Map your dynamics across a 12-bar blues to create a structured emotional journey:</p>
        <div className="space-y-2">
          {[
            { bars: "Bars 1–2", dynamic: "pp → mp", desc: "Intro — quiet, create intrigue. Just hints." },
            { bars: "Bars 3–4", dynamic: "mp", desc: "Develop — state your main idea clearly." },
            { bars: "Bars 5–6", dynamic: "mp → f", desc: "Build — repeat idea harder, more intense." },
            { bars: "Bars 7–8", dynamic: "f → SILENCE", desc: "Climax — hit your peak note, then stop." },
            { bars: "Bars 9–10", dynamic: "pp", desc: "Recovery — whisper back in. Deceptive quiet." },
            { bars: "Bars 11–12", dynamic: "f", desc: "Final statement — end with authority." },
          ].map(b => (
            <div key={b.bars} className="flex gap-3 items-center text-sm">
              <div className="w-20 text-purple-400 font-mono text-xs flex-shrink-0">{b.bars}</div>
              <div className="w-20 text-amber-300 font-semibold text-xs">{b.dynamic}</div>
              <div className="text-purple-200 text-xs">{b.desc}</div>
            </div>
          ))}
        </div>
      </Card>

      <Callout type="exercise">
        <p className="font-semibold mb-1">Exercise: The Dynamic Contrast Run</p>
        Play a 12-bar blues 3 times in a row. First chorus: only play quietly (barely touching strings). Second chorus: normal volume. Third chorus: maximum aggression. Then combine all three in a final chorus. Your ear will show you where each belongs.
      </Callout>

      <Callout type="tip">
        Right-hand control is where dynamics come from. Practice the same lick at 4 different pick attack intensities. Feather-light → medium → firm → aggressive. This teaches your right hand to be expressive.
      </Callout>
    </div>
  )
}

function OverBluesTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Improvising Over the Blues</h2>
      <p className="text-purple-200 mb-6">The 12-bar blues is the greatest sandbox for improvisation ever created. Here's how to navigate it bar-by-bar and make smart, musical choices throughout.</p>

      <Card title="The Chord Progression (A Blues)">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center">
            <thead>
              <tr className="text-purple-400 border-b border-white/10">
                <th className="pb-2">Bar</th>
                <th className="pb-2">1</th><th className="pb-2">2</th><th className="pb-2">3</th><th className="pb-2">4</th>
                <th className="pb-2">5</th><th className="pb-2">6</th><th className="pb-2">7</th><th className="pb-2">8</th>
                <th className="pb-2">9</th><th className="pb-2">10</th><th className="pb-2">11</th><th className="pb-2">12</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-white font-bold">
                <td className="py-2 text-purple-400">Chord</td>
                <td>A7</td><td>A7</td><td>A7</td><td>A7</td>
                <td>D7</td><td>D7</td><td>A7</td><td>A7</td>
                <td>E7</td><td>D7</td><td>A7</td><td>E7</td>
              </tr>
              <tr className="text-xs text-purple-300">
                <td>Target</td>
                <td>A</td><td>A</td><td>A</td><td>C#</td>
                <td>D</td><td>F#</td><td>A</td><td>A</td>
                <td>E</td><td>D</td><td>A</td><td>E/G#</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-purple-300 text-xs mt-2">Target row = best notes to land on beat 1 of each bar (chord tones)</p>
      </Card>

      <Card title="Bar-by-Bar Strategy">
        <div className="space-y-2 text-sm">
          {[
            { bars: "Bars 1–4 (A7)", strategy: "Home base. Use full A minor pentatonic + the ♭7 (G). Land on A or C# on beat 1. Establish your theme here." },
            { bars: "Bars 5–6 (D7)", strategy: "Move UP the neck. Shift your phrases to highlight D and F#. The ♭7 of D7 is C — use it for bluesy tension." },
            { bars: "Bars 7–8 (A7)", strategy: "Return home. But play it differently — vary the rhythm or octave. Don't repeat bars 1–4 exactly." },
            { bars: "Bar 9 (E7)", strategy: "The turnaround begins. This is the highest tension bar. Bend up to E or B. Create maximum energy here." },
            { bars: "Bar 10 (D7)", strategy: "Step down the tension. Descending phrase toward A." },
            { bars: "Bar 11 (A7)", strategy: "Resolution. Land on the root. Settle back to home." },
            { bars: "Bar 12 (E7)", strategy: "Setup for next chorus. Build a phrase that 'asks a question' — it leads back into bar 1." },
          ].map(s => (
            <div key={s.bars} className="border-b border-white/10 pb-2">
              <p className="text-amber-300 font-semibold text-xs">{s.bars}</p>
              <p className="text-purple-200 text-xs">{s.strategy}</p>
            </div>
          ))}
        </div>
      </Card>

      <Tab label="Chorus 1 — State your theme (bars 1–4, A7)">
{`e|---------------------------------------|
B|---------------------------------------|
G|--2~~----2-2~~~------2-0---------------|
D|--------------4-2-4------4-2-0---------|
A|---------------------------------------|
E|---------------------------------------|
  Land on A.   Develop.     Resolve.      `}
      </Tab>

      <Tab label="Chorus 2 — Move to the IV chord (bars 5–6, D7)">
{`e|---------------------------------------|
B|--7b9-7----7b9-7-5---------------------|
G|-----------5-------7-5-4---------------|
D|---------------------------------------|
A|---------------------------------------|
E|---------------------------------------|
  Target D (fret 7 B-string = D note)    `}
      </Tab>

      <Tab label="Turnaround — bars 9–12">
{`e|--12b14~~~----12-10-9-7-5--------------|
B|---------------------------8-5---------|
G|--------------------------------7-6-5--|
D|---------------------------------------|
A|---------------------------------------|
E|---------------------------------------|
  Bar 9: peak | Bar 10: descend | 11-12: land `}
      </Tab>

      <Card title="3-Chorus Practice Plan">
        <ol className="space-y-2 text-sm text-purple-200">
          <li><span className="text-white font-semibold">Chorus 1 — Establish:</span> Play simple, singable phrases. Max 4 notes per phrase. State your theme.</li>
          <li><span className="text-white font-semibold">Chorus 2 — Develop:</span> Take your Chorus 1 theme. Vary it — higher, lower, rhythmically different. Build intensity.</li>
          <li><span className="text-white font-semibold">Chorus 3 — Climax + Resolve:</span> Hit your peak at bar 9. Then bring it all home with a definitive final phrase on bar 11.</li>
        </ol>
      </Card>

      <Callout type="exercise">
        <p className="font-semibold mb-1">Exercise: Chord Tone Targeting</p>
        Put on a slow A blues (60 BPM). For each chord change, your first note MUST be a chord tone. A7 → land on A, C#, or G. D7 → land on D, F#, or C. E7 → land on E, G#, or D. Just this constraint will transform your phrasing.
      </Callout>
    </div>
  )
}

export default function ImprovisationPage() {
  const [activeTab, setActiveTab] = useState<Tab>("mindset")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link href="/" className="text-purple-300 hover:text-white text-sm">← Back to modules</Link>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">Improvisation</h1>
          <p className="text-purple-200">Learn to improvise with purpose — phrases, motifs, space, and dynamics that make your solos memorable.</p>
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
          {activeTab === "mindset" && <MindsetTab />}
          {activeTab === "phrases" && <PhrasesTab />}
          {activeTab === "motifs" && <MotifsTab />}
          {activeTab === "space" && <SpaceTab />}
          {activeTab === "dynamics" && <DynamicsTab />}
          {activeTab === "over-blues" && <OverBluesTab />}
        </div>
      </div>
    </div>
  )
}
