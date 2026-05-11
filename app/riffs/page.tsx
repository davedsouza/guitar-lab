"use client"

import { useState } from "react"
import Link from "next/link"

type Tab = "what-makes-a-riff" | "rock" | "blues" | "pop-folk" | "technique" | "signature-licks"

const TABS: { id: Tab; label: string }[] = [
  { id: "what-makes-a-riff", label: "What Makes a Riff?" },
  { id: "rock", label: "Rock Riffs" },
  { id: "blues", label: "Blues Riffs" },
  { id: "pop-folk", label: "Pop & Folk Riffs" },
  { id: "technique", label: "Learning Technique" },
  { id: "signature-licks", label: "✦ Signature Licks" },
]

function Callout({ type, children }: { type: "tip" | "warning" | "insight" | "exercise"; children: React.ReactNode }) {
  const styles = {
    tip: "border-l-4 border-purple-500 bg-purple-500/10 text-purple-200",
    warning: "border-l-4 border-amber-500 bg-amber-500/10 text-amber-200",
    insight: "border-l-4 border-blue-400 bg-blue-400/10 text-blue-200",
    exercise: "border-l-4 border-green-500 bg-green-500/10 text-green-200",
  }
  const labels = { tip: "💡 Tip", warning: "⚠️ Watch Out", insight: "🔑 Key Insight", exercise: "🎸 Exercise" }
  return (
    <div className={`rounded-xl p-4 mb-4 ${styles[type]}`}>
      <p className="text-xs font-bold uppercase tracking-wider mb-1 opacity-80">{labels[type]}</p>
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  )
}

function TabBlock({ label, song, artist, children }: { label: string; song?: string; artist?: string; children: string }) {
  return (
    <div className="mb-6">
      <div className="flex items-baseline gap-3 mb-2">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
        {song && <p className="text-purple-300 text-xs">— {song}{artist ? ` · ${artist}` : ""}</p>}
      </div>
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

function WhatMakesARiffTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">What Makes a Great Riff?</h2>
      <p className="text-purple-200 mb-6">A riff is a short, repeated musical phrase that forms the backbone of a song. The best riffs are immediately recognisable and impossible to get out of your head.</p>

      <Callout type="insight">
        The best riffs in history all share the same qualities: simplicity, rhythm, and a distinctive character. &quot;Smoke on the Water&quot; uses only 3 notes. &quot;Satisfaction&quot; uses a 5-note phrase. Complexity is not the point.
      </Callout>

      <Card title="The 5 Qualities of Great Riffs">
        <div className="space-y-3">
          {[
            { quality: "Memorable", desc: "You can hum it after hearing it once. If you can&apos;t hum it, it&apos;s not a great riff." },
            { quality: "Rhythmic", desc: "The rhythm matters as much as the notes. 'Satisfaction' is about the syncopation, not just the pitches." },
            { quality: "Repeated (but varied)", desc: "Riffs loop, but the best ones develop slightly across verses, choruses, and bridges." },
            { quality: "Character", desc: "Each riff creates a specific emotional or sonic world — menacing, funky, melancholic, driving." },
            { quality: "Simple", desc: "The best riffs are deliberately simple. Complexity is the enemy of a good riff." },
          ].map(q => (
            <div key={q.quality} className="border-b border-white/10 pb-2 text-sm">
              <p className="text-amber-300 font-semibold">{q.quality}</p>
              <p className="text-purple-200 text-xs">{q.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card title="How Riffs Are Built — The 5 Building Blocks">
        <div className="space-y-3">
          {[
            { type: "Power chord riffs", desc: "Two-note chords (root + 5th) played in a rhythmic pattern. The foundation of rock and metal.", examples: "Iron Man, Back in Black" },
            { type: "Single-note riffs", desc: "Single notes, usually on the lower strings, that outline a melody or groove.", examples: "Smoke on the Water, Satisfaction" },
            { type: "Open-string riffs", desc: "Incorporate open strings for resonance and ease of movement.", examples: "Sunshine of Your Love, Enter Sandman" },
            { type: "Chord-melody riffs", desc: "Blend chords and single notes — the riff implies harmony and melody simultaneously.", examples: "Day Tripper, Layla intro" },
            { type: "Ostinato riffs", desc: "A repeated bass-note pattern under changing melody/chords.", examples: "Crazy Train, Seven Nation Army" },
          ].map(t => (
            <div key={t.type} className="border-b border-white/10 pb-2 text-sm">
              <p className="text-white font-semibold">{t.type}</p>
              <p className="text-purple-200 text-xs">{t.desc}</p>
              <p className="text-amber-300 text-xs">Examples: {t.examples}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card title="How to Approach Learning Riffs">
        <ol className="space-y-2 text-sm text-purple-200">
          <li><span className="text-white font-semibold">1. Listen first:</span> Listen to the riff 5 times before touching your guitar. Internalise it.</li>
          <li><span className="text-white font-semibold">2. Hum it:</span> Hum the riff. If you can hum it, you can find it on the guitar.</li>
          <li><span className="text-white font-semibold">3. Find the root:</span> Identify the lowest note — start there.</li>
          <li><span className="text-white font-semibold">4. Slow it down:</span> Use a slow version (50% speed) to map the notes.</li>
          <li><span className="text-white font-semibold">5. Loop the hardest part:</span> Identify the hardest 2 beats. Practice those before anything else.</li>
          <li><span className="text-white font-semibold">6. Add tempo:</span> Gradually increase until you reach full speed.</li>
        </ol>
      </Card>

      <Callout type="exercise">
        <p className="font-semibold mb-1">Write a Riff Today:</p>
        Open the A minor pentatonic (Position 1). Pick 3 notes. Put them in a rhythm. Repeat it. Change one note. You just wrote a riff. The goal isn&apos;t great — it&apos;s to understand how riffs are born: from tiny ideas repeated with rhythmic intention.
      </Callout>
    </div>
  )
}

function RockTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Classic Rock Riffs</h2>
      <p className="text-purple-200 mb-6">These riffs are the vocabulary of rock guitar. Learn them, understand their construction, and use them as models for your own writing.</p>

      <TabBlock label="Smoke on the Water — the most famous riff" song="Smoke on the Water" artist="Deep Purple">
{`e|--------------------------|
B|--------------------------|
G|--0-3-5--0-3-6-5--0-3-5-3-|
D|--0-3-5--0-3-6-5--0-3-5-3-|
A|--------------------------|
E|--------------------------|

Theory: Power chords on G and D strings
Notes: G♭ - G - B♭ pattern
Why it works: Simple intervals, strong rhythm, immediately singable`}
      </TabBlock>

      <TabBlock label="Sunshine of Your Love — open string magic" song="Sunshine of Your Love" artist="Cream / Clapton">
{`e|--------------------------|
B|--------------------------|
G|--------------------------|
D|--4-4-2-------------------|
A|--------4-3-1-0-----------|
E|--0-0-------0-------------|

The open E string (low) anchors the whole riff
Descend from D4 to open E — classic blues-rock movement`}
      </TabBlock>

      <TabBlock label="Iron Man — pure power chord menace" song="Iron Man" artist="Black Sabbath">
{`e|-------------------------------|
B|-------------------------------|
G|--9-9----7-7----6-6--4-4-------|
D|--9-9----7-7----6-6--4-4-------|
A|--7-7----5-5----4-4--2-2-------|
E|-------------------------------|

Power chords descending in 4ths
The slight rhythmic stagger (not straight 8ths) = the menacing feel
Played with heavy palm muting`}
      </TabBlock>

      <TabBlock label="Back in Black — 16th note cool" song="Back in Black" artist="AC/DC">
{`e|--0-2---2-0---------------|
B|-------3---3-0------------|
G|------------------2-0-----|
D|------------------------2-|
A|--------------------------|
E|--------------------------|

E minor pentatonic in open position
The 16th note rhythm is key — swing that feel
Angus plays this loose and punchy`}
      </TabBlock>

      <TabBlock label="Whole Lotta Love — open tuning-style riff" song="Whole Lotta Love" artist="Led Zeppelin">
{`e|----------------------|
B|----------------------|
G|----------------------|
D|--2-0-2-0-------------|
A|----------3-2-0-------|
E|-------------------3--|

Jimmy Page — simple, sexual groove
Alternates between 2nd and open strings
Power comes from the RHYTHM not the notes`}
      </TabBlock>

      <TabBlock label="Layla intro — chord riff" song="Layla" artist="Derek and the Dominos / Clapton">
{`e|------5-5-3---------3-5---|
B|--5-8-------6-5---5-------|
G|----------------5---------|
D|--------------------------|
A|--------------------------|
E|--------------------------|

Dm, C, Bb progression disguised as a riff
The descending line D→C→B♭ = classical movement
Duane Allman slide + Clapton rhythm together`}
      </TabBlock>

      <Card title="The Rock Riff Formula">
        <p className="text-purple-200 text-sm mb-3">Most classic rock riffs follow one of these patterns:</p>
        <ul className="space-y-2 text-sm text-purple-200">
          <li><span className="text-white font-semibold">Low string + climb:</span> Start on a low note, climb up. Smoke on the Water, Day Tripper.</li>
          <li><span className="text-white font-semibold">Descending thirds:</span> Fall down by thirds from a high note. Back in Black, Paranoid.</li>
          <li><span className="text-white font-semibold">Ostinato root + melody:</span> Repeat a root bass note while a melody plays above. Sweet Home Alabama.</li>
          <li><span className="text-white font-semibold">Call-response:</span> Guitar asks, guitar answers (echo). Satisfaction, Message in a Bottle.</li>
        </ul>
      </Card>

      <Callout type="exercise">
        <p className="font-semibold mb-1">Build a Rock Riff:</p>
        Pick E as your root. Start on the low E string open. Climb up 4 notes using the E minor pentatonic (E G A B). Add a descending response. Add a simple rhythm. You now have the skeleton of a rock riff — build on it.
      </Callout>
    </div>
  )
}

function BluesTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Blues Riffs</h2>
      <p className="text-purple-200 mb-6">Blues riffs are the DNA of all rock guitar. They&apos;re built on the blues scale, dominant 7th chords, and a shuffle rhythm that makes you want to move.</p>

      <TabBlock label="Standard 12-bar blues intro riff (A blues)" song="Universal blues intro">
{`e|------------------------------|
B|------------------------------|
G|------------------------------|
D|------------------------------|
A|--0-2-3-2-3-2-0---------------|
E|--0-0-0-0-0-0-0---------------|

Low E open stays as the drone
A string walks up: open → 2nd fret → 3rd fret
This is the 'Albert King' style blues intro`}
      </TabBlock>

      <TabBlock label="The classic shuffle riff (E blues, open position)" song="Standard blues shuffle">
{`e|------------------------------------------|
B|------------------------------------------|
G|------------------------------------------|
D|------------------------------------------|
A|--0-2-0-2-0-2-0-2-0-2-0-2-0-2-0-2--------|
E|--0---0---0---0---0---0---0---0-----------|

Swing the 8th notes (long-short feel)
Mute palm on bridge for that chunky sound
Root = E (open), add the 2nd fret = the bluesy tension`}
      </TabBlock>

      <TabBlock label="Texas shuffle riff (SRV style)" song="Pride and Joy style" artist="Stevie Ray Vaughan">
{`e|---0------------------------------------|
B|---0------------------------------------|
G|---1------------------------------------|
D|---2-4---4-2---2-4---4-2----------------|
A|---2-4---4-2---2-4---4-2----------------|
E|---0------------------------------------|

E dominant chord on top, shuffle on low strings
The 'Texas' sound: heavy, swinging, syncopated
SRV played this with neck pickup, mid-heavy tone`}
      </TabBlock>

      <TabBlock label="The Albert King box riff" song="Born Under a Bad Sign style" artist="Albert King">
{`e|--------------------------------------|
B|---5-7-5---5-7-5----------------------|
G|--------6--------6-4-2----------------|
D|----------------------4-2-0-----------|
A|--------------------------------3-2-0-|
E|--------------------------------------|

Minor pentatonic, Position 1 & 2
The bends on the B string are what make it BLUES
Play with heavy vibrato on the landing notes`}
      </TabBlock>

      <TabBlock label="The turnaround riff (12th bar)" song="Standard blues turnaround">
{`e|---0-2-0-2-0-2-0-2-0-|
B|---------------------|
G|---------------------|
D|---------------------|
A|--4-4-3-3-2-2-1-1-0--|
E|---------------------|

This is bar 12 of the 12-bar blues
Chromatic descent on A string sets up the return to bar 1
The e-string trill adds brilliance on top`}
      </TabBlock>

      <Card title="The Blues Scale — Your Riff Source">
        <p className="text-purple-200 text-sm mb-3">The blues scale = minor pentatonic + the ♭5 (blue note):</p>
        <div className="font-mono text-green-300 bg-black/40 rounded-xl p-3 text-sm mb-3">
          {`A blues scale: A  C  D  D#  E  G  A
                         1  ♭3  4  ♭5   5  ♭7  8
                              ↑ The blue note`}
        </div>
        <p className="text-purple-200 text-sm">The ♭5 (D# in A blues) is the &quot;blue note&quot; — use it as a passing tone between D and E. Don&apos;t land on it — slide through it.</p>
      </Card>

      <TabBlock label="Using the blue note (♭5) as a passing tone">
{`e|------------------------------|
B|--8b10-8-5--------------------|
G|-----------6-5-4-----------   |
D|----------------7-5-------    |
A|------------------5-0---      |
E|------------------------------|

The ♭5 (D# on G string fret 4) slides to E (fret 5)
Never land on it — just pass through it
That's the blue note in action`}
      </TabBlock>

      <Callout type="tip">
        Blues is about feel more than notes. A riff played with a genuine shuffle feel and real dynamic variation will sound far better than a technically perfect riff played mechanically. Lean into the groove.
      </Callout>
    </div>
  )
}

function PopFolkTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Pop & Folk Riffs</h2>
      <p className="text-purple-200 mb-6">Not all riffs live on the low strings. Pop and folk riffs often float on higher strings, use open chords, and create atmosphere through fingerpicking and melody.</p>

      <TabBlock label="Wish You Were Here — iconic opening riff" song="Wish You Were Here" artist="Pink Floyd">
{`e|--0-0-0-0-3-3-3-2-2-2-0-0-0-0-0-0-|
B|--0----------------------------0---|
G|--0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-|
D|-----------------------------------|
A|-----------------------------------| (partial)
E|-----------------------------------|

Played on a 12-string for the recording
The open strings ring throughout — do not mute them
Alternate between frets 3 and 0 on the high strings`}
      </TabBlock>

      <TabBlock label="House of the Rising Sun — arpeggiated riff" song="House of the Rising Sun" artist="The Animals">
{`e|--0-------0-----0---|
B|----1---1---1--1----|
G|------2------2------|
D|--2-------2---------|
A|--0-----------------|
E|--------------------|

Am chord arpeggiated: A-E-A-C-E-A-C-E
Fingerpick: thumb (A string) + fingers (D, G, B, e)
This IS the chord — spelled out note by note`}
      </TabBlock>

      <TabBlock label="The Boxer intro riff" song="The Boxer" artist="Simon & Garfunkel">
{`e|--2-2-2-2-2-2-2-2-3-2-----|
B|--3-3-3-3-3-3-3-3-3-3-----|
G|--2-2-2-2-2-2-2-2-2-2-----|
D|--------------------------|
A|--------------------------|
E|--0-0-0-0-0-0-0-0-0-0-----|

Open E string as bass drone
D chord shape on upper strings
The C# (fret 2, B string) is the distinctive note`}
      </TabBlock>

      <TabBlock label="Wonderwall intro riff" song="Wonderwall" artist="Oasis">
{`e|--3-3-3-3-3-3-3-3---3-3-3-3---|
B|--3-3-3-3-3-3-3-3---3-3-3-3---|
G|--0-0-2-2-0-0-2-2---0-0-4-4---|
D|--0-0-2-2-0-0-2-2---0-0-4-4---|
A|--2-2-0-0-2-2-0-0---2-2-2-2---|
E|--3-3-3-3-3-3-3-3---3-3-3-3---|

Note: capo 2nd fret in original
Em7, G, Dsus4, A7sus4 progression
The static top strings (B and e) create the Oasis sound`}
      </TabBlock>

      <TabBlock label="Blackbird — melodic bass riff" song="Blackbird" artist="Beatles / Paul McCartney">
{`e|--0-0-0-0-0-0-0-0---|
B|--7-8-7-5-3-2-0-----|
G|--0-0-0-0-0-0-0-----|
D|--0-0-0-0-0-0-0-----|
A|--0-0-0-0-0-0-0-----|
E|--0-0-0-0-0-0-0-----|

(simplified version — actual uses many positions)
The bass line descends while high e stays on 0
Fingerpicked: thumb on bass, index/middle on melody`}
      </TabBlock>

      <Card title="Folk Riff Techniques">
        <div className="space-y-3">
          {[
            { tech: "Drone strings", desc: "Keep one string (often the open high e or B) ringing while other strings move. Creates a bagpipe-like sound.", example: "Wish You Were Here, Brown Eyed Girl" },
            { tech: "Walking bass lines", desc: "Alternate between bass notes and treble notes in alternating bass style.", example: "Blackbird, The Boxer" },
            { tech: "Static voicings + moving bass", desc: "Hold a chord shape while the bass note changes underneath.", example: "Dust in the Wind, Scarborough Fair" },
            { tech: "Arpeggios as riffs", desc: "Spell out each chord note by note — the arpeggio pattern becomes the riff.", example: "House of the Rising Sun, Mad World" },
          ].map(t => (
            <div key={t.tech} className="border-b border-white/10 pb-2 text-sm">
              <p className="text-white font-semibold">{t.tech}</p>
              <p className="text-purple-200 text-xs">{t.desc}</p>
              <p className="text-amber-300 text-xs">Examples: {t.example}</p>
            </div>
          ))}
        </div>
      </Card>

      <Callout type="exercise">
        <p className="font-semibold mb-1">Exercise: The Drone Riff</p>
        Keep your high e string (open) ringing throughout. With your other fingers, play notes on the B and G strings. The drone creates an instant folk/atmospheric quality. Try it over Am and G chords — you&apos;ll hear the sound immediately.
      </Callout>
    </div>
  )
}

function TechniqueTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Learning Riffs — The Right Way</h2>
      <p className="text-purple-200 mb-6">Most guitarists learn riffs wrong — they play too fast, don&apos;t isolate the hard parts, and build in mistakes. Here&apos;s the method that actually works.</p>

      <Card title="The 5-Step Riff Learning Method">
        <ol className="space-y-3 text-sm text-purple-200">
          <li>
            <span className="text-white font-semibold">Step 1 — Listen (5 times without guitar)</span>
            <p>Play the song section 5 times. Hum the riff. Count the beats. Notice the rhythm before touching the guitar. Most people skip this — don&apos;t.</p>
          </li>
          <li>
            <span className="text-white font-semibold">Step 2 — Find the first note</span>
            <p>Identify the root or starting note. Play it on one string until it matches. This anchors everything else.</p>
          </li>
          <li>
            <span className="text-white font-semibold">Step 3 — Slow it to 50%</span>
            <p>Use a slow-down app (Amazing Slow Downer, YouTube speed control). Play at 50% speed to map every note clearly.</p>
          </li>
          <li>
            <span className="text-white font-semibold">Step 4 — Isolate the hard beat</span>
            <p>Find the hardest 2-beat section. Loop just that part 20 times until clean. Then connect it to what comes before and after.</p>
          </li>
          <li>
            <span className="text-white font-semibold">Step 5 — Tempo build</span>
            <p>Start at 60% of full speed. Only increase 5 BPM when clean at current tempo. Never rush this step — you&apos;re building muscle memory.</p>
          </li>
        </ol>
      </Card>

      <Card title="Right-Hand Technique for Riffs">
        <div className="space-y-3">
          {[
            { tech: "Palm muting", desc: "Rest the edge of your picking hand lightly on the saddle/bridge. Muffles the string for a chunky, percussive sound. Essential for rock riffs.", example: "AC/DC, Metallica chugging, most rhythm riffs" },
            { tech: "Alternate picking", desc: "Down-up-down-up consistently. Maintains even note timing and allows higher speeds.", example: "Most single-note riffs and runs" },
            { tech: "All downstrokes", desc: "All down strokes for a heavier, more aggressive attack. Slightly uneven but powerfully rhythmic.", example: "AC/DC, punk rock — the Angus Young technique" },
            { tech: "Pick angle", desc: "Tilt your pick slightly (45°) against the string. Reduces resistance and produces a cleaner attack.", example: "Used in all riff playing" },
          ].map(t => (
            <div key={t.tech} className="border-b border-white/10 pb-3 text-sm">
              <p className="text-white font-semibold">{t.tech}</p>
              <p className="text-purple-200 text-xs mt-1">{t.desc}</p>
              <p className="text-amber-300 text-xs mt-1">Used in: {t.example}</p>
            </div>
          ))}
        </div>
      </Card>

      <TabBlock label="Palm muting exercise — feel the difference">
{`With palm mute:          Without mute:
e|----------------------|  e|---------------------|
B|----------------------|  B|---------------------|
G|----------------------|  G|---------------------|
D|--x-x-x-5-x-x-7-5----|  D|--0-0-0-5-0-0-7-5---|
A|--x-x-x-5-x-x-7-5----|  A|--0-0-0-5-0-0-7-5---|
E|--x-x-x-3-x-x-5-3----|  E|--0-0-0-3-0-0-5-3---|

x = palm muted (chunky)     Open = full ring
Both versions are valuable — learn to switch mid-riff`}
      </TabBlock>

      <Card title="Tone Settings for Classic Riff Sounds">
        <div className="space-y-2 text-sm">
          {[
            { genre: "Classic Rock", settings: "Mid-boost, moderate gain (5-6/10), bridge pickup, slight treble cut" },
            { genre: "Heavy Rock/Metal", settings: "High gain (8-9/10), scooped mids, palm muted, bridge pickup" },
            { genre: "Blues", settings: "Low-medium gain (3-4/10), neck pickup, mid-heavy, clean or slight break-up" },
            { genre: "Funk/Pop", settings: "Clean, neck pickup, full mids, slight compression, sharp attack" },
            { genre: "Folk/Acoustic", settings: "Acoustic — let the guitar breathe. No amp tone manipulation needed." },
          ].map(g => (
            <div key={g.genre} className="flex gap-3 border-b border-white/10 pb-2">
              <div className="w-28 text-amber-300 font-semibold text-xs flex-shrink-0">{g.genre}</div>
              <div className="text-purple-200 text-xs">{g.settings}</div>
            </div>
          ))}
        </div>
      </Card>

      <Callout type="exercise">
        <p className="font-semibold mb-1">The Daily Riff Workout:</p>
        <ol className="space-y-1">
          <li>1. Choose one riff you&apos;re learning</li>
          <li>2. Play it 10 times slow (60 BPM) — clean and deliberate</li>
          <li>3. Increase to 80 BPM — 5 times</li>
          <li>4. Increase to 100 BPM — 5 times</li>
          <li>5. Play at full tempo with the song — once through</li>
          <li>Total time: 10 minutes. Do this every day for a week and that riff will be yours forever.</li>
        </ol>
      </Callout>

      <Callout type="tip">
        Record yourself playing riffs and compare to the original. Your ear will immediately hear what&apos;s off — tone, timing, or dynamics. This is the fastest feedback loop for improvement.
      </Callout>
    </div>
  )
}

type StyleFilter = "all" | "blues" | "rock" | "jazz" | "modern"

const GUITARISTS: {
  name: string
  years: string
  style: StyleFilter
  styleLabel: string
  tag: string
  signature: string
  lick: string
  lesson: string
  tone: string
}[] = [
  {
    name: "BB King",
    years: "1925 – 2015",
    style: "blues",
    styleLabel: "Blues",
    tag: "King of the Blues",
    signature: "Every note was a human voice. BB never strummed chords — he made one note say more than most guitarists say in a solo. His 'BB Box' is a tiny cluster of pentatonic notes played with full vibrato on every landing.",
    lick: `e|--5b7~~---5---5b7~~-5---------|
B|-----------8-----------8-5----|
G|------------------------------|
D|------------------------------|
A|------------------------------|
E|------------------------------|

Key: A blues · 5th position
b7~~ = bend to pitch, then vibrate heavily
Land on 5 (A), bend to 7 (C), vibrate
NEVER rush — let each note breathe 2–4 beats`,
    lesson: "BB's genius was restraint. Play the bend, hold it, vibrate. Silence between notes is intentional. He said: 'I try to make one note cry.' Copy that — not his speed.",
    tone: "Neck pickup · Medium gain · Slightly scooped mids · His guitar 'Lucille' was a semi-hollow ES-355",
  },
  {
    name: "Jimi Hendrix",
    years: "1942 – 1970",
    style: "blues",
    styleLabel: "Blues / Rock",
    tag: "The Electric Messiah",
    signature: "Hendrix treated the guitar as an orchestra — chords, bass lines, and lead all at once. His double-stop bends and thumb-over-the-neck chord shapes revolutionised what was possible.",
    lick: `e|--12-12-12b14-12-------12----|
B|--12-12-12----15-12-12---15--|
G|-----------------------------|
D|-----------------------------|
A|-----------------------------|
E|-----------------------------|

Key: E blues · 12th position
Two strings bent simultaneously (double-stop bend)
Fret both e and B at 12, bend both up together
The dissonant pull-off to 15 (B) is the Hendrix signature`,
    lesson: "The double-stop bend: barre e and B strings at the 12th fret with one finger, then push both strings upward together. This is the most-copied Hendrix move in rock history.",
    tone: "Marshall stack on edge of breakup · Univibe + Fuzz Face (Octavia) · Strat into huge amp — turn it up",
  },
  {
    name: "Eric Clapton",
    years: "1945 – present",
    style: "blues",
    styleLabel: "Blues Rock",
    tag: "Slowhand",
    signature: "Clapton's Cream-era playing was ferocious — pentatonic runs delivered with absolute precision and a perfect slow-hand attack. His vibrato is controlled and vocal, always in service of the melody.",
    lick: `e|--17-17-17b19-17-15-17-15----|
B|---------------------------17-|
G|------------------------------|
D|------------------------------|
A|------------------------------|
E|------------------------------|

Key: A blues · 17th position (high octave)
Run from b19 bend down to 15, resolve on 17 (A)
The b19 is the ♭7 (G) bent up to the root (A)
Play with an even, deliberate attack — no rushing`,
    lesson: "Clapton's secret is his right-hand control. He picks every note cleanly with an angled pick. Before speed, focus on each note ringing clearly — 'Slowhand' wasn't slow; he was deliberate.",
    tone: "Gibson SG or Les Paul through a Marshall Bluesbreaker · Medium-high gain · Bridge pickup",
  },
  {
    name: "Stevie Ray Vaughan",
    years: "1954 – 1990",
    style: "blues",
    styleLabel: "Texas Blues",
    tag: "Texas Hurricane",
    signature: "SRV played .013 gauge strings tuned down a half-step — the heaviness of his attack was physical. He combined Albert King's bent notes, Hendrix's chord shapes, and Freddie King's speed into one volcanic style.",
    lick: `e|--15b17-15-13-15-13-12-13----|
B|-----------------------------15|
G|------------------------------|
D|------------------------------|
A|------------------------------|
E|------------------------------|

Key: G blues · 15th position
b17 = full-step bend from 15 up to 17
Descend fast: 13-12, then resolve to 15 (B string)
SRV attacked this with his full arm — not just fingers`,
    lesson: "SRV's vibrato came from his whole arm rotating — not just his wrist. Put your thumb on the back of the neck, grab the string, and rotate your forearm like turning a doorknob. That's the SRV vibrato.",
    tone: "Strat with .013s tuned Eb · Dumble amp + Tubescreamer · Neck pickup · Everything cranked",
  },
  {
    name: "David Gilmour",
    years: "1946 – present",
    style: "rock",
    styleLabel: "Progressive Rock",
    tag: "The Feel Master",
    signature: "Gilmour is the master of less-is-more. A single bent note with perfect vibrato, held in perfect silence, says more than any shred run. His tone — a Stratocaster through a Hiwatt — is one of the most imitated in history.",
    lick: `e|-------------------------------|
B|--15b17~~-15-12-15-12----------|
G|--------------------14-12------|
D|--------------------------14---|
A|-------------------------------|
E|-------------------------------|

Key: D major / B minor · 12th–15th position
b17~~ = bend to pitch then hold with wide, slow vibrato
Descend through the minor pentatonic D→C→B
The SPACE between notes is what makes this Gilmour`,
    lesson: "Gilmour's vibrato is wide and slow — a whole tone at about 4Hz. Use your whole hand to achieve it. Listen to 'Comfortably Numb' solo 2 and count: he bends, holds, and vibrates for 4 full beats before moving.",
    tone: "Strat (red '0001') · Hiwatt DR103 · Big Muff fuzz + Boss CE-2 chorus + Binson Echorec · Single-coil neck pickup",
  },
  {
    name: "Carlos Santana",
    years: "1947 – present",
    style: "rock",
    styleLabel: "Latin Rock",
    tag: "The Sustain King",
    signature: "Santana found the intersection of rock guitar and Afro-Cuban rhythm. His tone sustains infinitely — he holds notes until they bloom. His phrasing breathes in 8-bar phrases, always singing, never shredding.",
    lick: `e|--12~~~~~~~~~~-10-12-10--------|
B|---------------------------13--|
G|-------------------------------|
D|-------------------------------|
A|-------------------------------|
E|-------------------------------|

Key: A minor · 12th position
12~~ = play note and let sustain with continuous vibrato
The 10-12-10 descent is the 'question'
Landing on 13 (B string, Bb) is the suspended resolution`,
    lesson: "Santana's tone requires the guitar to 'sing' — use the neck pickup, dial in light overdrive, and dig in with the pick for more contact. The sustain on each note should feel like a held vocal note.",
    tone: "PRS Custom 22 (or vintage Gibson SG) · Mesa Boogie Mark I · Heavy overdrive · Neck pickup · Volume at 10",
  },
  {
    name: "Duane Allman",
    years: "1946 – 1971",
    style: "blues",
    styleLabel: "Southern Rock / Slide",
    tag: "Skydog",
    signature: "Duane Allman was the greatest slide guitarist in rock history. He played a glass Coricidin bottle on his ring finger in standard tuning — his slides were melodic and vocal, not just ornamental.",
    lick: `e|--/12\--10-/12\--10-----------|
B|--/12\--10-/12\--10-----------|
G|--/12~~-----------------9----|
D|-----------------------------|
A|-----------------------------|
E|-----------------------------|

Key: G major · Open strings + 12th fret slide
/ = slide up into note  \\ = slide off downward
~~ = vibrate the slide after landing
Both e and B at 12 = G and D (perfect 5th)`,
    lesson: "Slide vibrato: after landing on the note with the slide, rotate your wrist side-to-side (not forward-back). Keep the slide parallel to the fret. Mute strings behind the slide with your picking-hand fingers.",
    tone: "1957 Les Paul Goldtop · Coricidin glass slide · Marshall or Fender amp · Medium-low gain for note definition",
  },
  {
    name: "Gary Moore",
    years: "1952 – 2011",
    style: "rock",
    styleLabel: "Blues Rock",
    tag: "The Irish Blues Tornado",
    signature: "Gary Moore combined the fire of rock with the soulfulness of blues at a ferocity nobody else matched. His bends were aggressive — often a full step and a half — and his vibrato was violent and fast.",
    lick: `e|--15b17b19~~-15-17-15-13--15--|
B|------------------------------|
G|------------------------------|
D|------------------------------|
A|------------------------------|
E|------------------------------|

Key: A blues · 15th position
b17b19 = bend in two stages: first to 17, then push further to 19
This is a 1.5-step bend — requires strong fingers
~~ = vibrate aggressively at the top of the bend
End on 15 (A) for resolution`,
    lesson: "Gary Moore's aggressive bending comes from his left thumb over the neck for extra leverage. Wrap your thumb over the low E side of the neck and push upward with your whole hand. The bend should feel slightly violent.",
    tone: "1959 Les Paul Standard (Peter Green's guitar) · Marshall JCM800 cranked · Medium pick attack · Bridge pickup",
  },
  {
    name: "John Mayer",
    years: "1977 – present",
    style: "modern",
    styleLabel: "Modern Blues",
    tag: "The New Slowhand",
    signature: "Mayer absorbed Hendrix, SRV, and BB King and synthesised them into something unmistakably his own. His thumb-over-the-neck technique adds bass notes under lead lines, creating a one-man-band effect.",
    lick: `e|--3b5~~-3-----------------------|
B|---------5-3-5-3--------------|
G|------------------4-2---------|
D|--0-0-0-----0-0-0-----4-2-0--|
A|------------------------------|
E|------------------------------|

Key: G blues · Open position
Thumb: bass notes on D string (frets 0, 4)
Fingers: lead line on B and e strings
b5~~ = bend and vibrate (the hook)
This creates simultaneous bass + lead — the Mayer 'trick'`,
    lesson: "Mayer's thumb-over technique: wrap your left thumb over the low side of the neck so it can fret the low E or A string independently. This frees your other fingers for lead while the thumb plays rhythm bass.",
    tone: "Fender Stratocaster · John Mayer Silver Sky · Two-Rock Custom Reverb · Light overdrive · In-between pickup positions",
  },
  {
    name: "Django Reinhardt",
    years: "1910 – 1953",
    style: "jazz",
    styleLabel: "Gypsy Jazz",
    tag: "The Genius with Two Fingers",
    signature: "Django lost the use of his ring and pinky fingers in a caravan fire — yet became the most technically dazzling guitarist of his era. He invented Gypsy Jazz: blazing single-note runs, chromatic encircling, and a propulsive right-hand 'la pompe' rhythm.",
    lick: `e|--10-8-10-8-7-5-7-5-----------|
B|---------------------------5---|
G|-------------------------------|
D|-------------------------------|
A|-------------------------------|
E|-------------------------------|

Key: G major · Jazz context · 5th–10th position
Play entirely with index and middle finger only
(ring + pinky unavailable — this is what Django used)
Fast, even 16th notes — imagine bebop phrasing`,
    lesson: "Try this lick using ONLY your index and middle fingers. It will feel impossible — that's Django's daily reality. His index finger would barre across multiple strings and the middle finger did all single-note work.",
    tone: "Selmer Maccaferri archtop guitar (the 'jazz guitar' shape) · No amp — pure acoustic · Thumb pick · No vibrato — speed and clarity",
  },
]

function SignatureLicksTab() {
  const [filter, setFilter] = useState<StyleFilter>("all")

  const FILTERS: { id: StyleFilter; label: string }[] = [
    { id: "all", label: "All Guitarists" },
    { id: "blues", label: "Blues" },
    { id: "rock", label: "Rock" },
    { id: "jazz", label: "Jazz" },
    { id: "modern", label: "Modern" },
  ]

  const visible = filter === "all" ? GUITARISTS : GUITARISTS.filter(g => g.style === filter)

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Signature Licks</h2>
      <p className="text-purple-200 mb-6">
        The licks that define the greatest guitarists in history — with tab, technique breakdown, and tone settings. Learn them to absorb vocabulary. Then forget them, and let them come out as your own.
      </p>

      {/* Style filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
              filter === f.id
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-purple-300 hover:bg-white/20"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-8">
        {visible.map(g => (
          <div key={g.name} className="rounded-2xl border border-white/15 bg-white/5 overflow-hidden">
            {/* Header */}
            <div className="bg-white/10 px-6 py-4 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-xl font-bold text-white">{g.name}</h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-300">
                    {g.styleLabel}
                  </span>
                </div>
                <p className="text-amber-300 text-sm font-medium mt-0.5">{g.tag}</p>
              </div>
              <span className="text-purple-300/60 text-sm shrink-0">{g.years}</span>
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* Signature sound */}
              <p className="text-purple-200 text-sm leading-relaxed">{g.signature}</p>

              {/* Tab */}
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Signature Lick</p>
                <pre className="font-mono text-green-300 bg-black/40 rounded-xl p-4 text-sm overflow-x-auto whitespace-pre leading-relaxed">
                  {g.lick}
                </pre>
              </div>

              {/* Lesson */}
              <div className="border-l-4 border-amber-500 bg-amber-500/10 rounded-r-xl p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">🎸 How to Sound Like Them</p>
                <p className="text-sm text-amber-200 leading-relaxed">{g.lesson}</p>
              </div>

              {/* Tone */}
              <div className="border-l-4 border-blue-400 bg-blue-400/10 rounded-r-xl p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">🔊 Tone Settings</p>
                <p className="text-sm text-blue-200 leading-relaxed">{g.tone}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 border-l-4 border-purple-500 bg-purple-500/10 rounded-r-xl p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-purple-300 mb-1">🔑 Key Insight</p>
        <p className="text-sm text-purple-200 leading-relaxed">
          Don&apos;t just copy licks — steal the <em>idea</em> behind them. BB King&apos;s idea: one bent note, held with full vibrato. Gilmour&apos;s idea: space between notes. SRV&apos;s idea: attack with the whole arm. Once you understand the idea, you can express it with your own notes.
        </p>
      </div>
    </div>
  )
}

export default function RiffsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("what-makes-a-riff")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link href="/" className="text-purple-300 hover:text-white text-sm">← Back to modules</Link>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">Classic Riffs</h1>
          <p className="text-purple-200">Learn the iconic riffs that define rock, blues, and folk guitar — with TAB, theory, and technique tips.</p>
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
          {activeTab === "what-makes-a-riff" && <WhatMakesARiffTab />}
          {activeTab === "rock" && <RockTab />}
          {activeTab === "blues" && <BluesTab />}
          {activeTab === "pop-folk" && <PopFolkTab />}
          {activeTab === "technique" && <TechniqueTab />}
          {activeTab === "signature-licks" && <SignatureLicksTab />}
        </div>
      </div>
    </div>
  )
}
