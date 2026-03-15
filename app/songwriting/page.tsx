"use client"

import React, { useState } from "react"
import Link from "next/link"

type Tab = "process" | "structure" | "melody" | "chords" | "lyrics" | "finishing"

const TABS: { id: Tab; label: string }[] = [
  { id: "process",    label: "The Process" },
  { id: "structure",  label: "Song Structure" },
  { id: "melody",     label: "Melody Writing" },
  { id: "chords",     label: "Chord Progressions" },
  { id: "lyrics",     label: "Lyrics" },
  { id: "finishing",  label: "Finishing a Song" },
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

// ── Tab Content ──────────────────────────────────────────────────────────────

function ProcessTab() {
  const [expandedMethod, setExpandedMethod] = useState<string | null>(null)

  const startingPoints = [
    {
      title: "Start with a riff or chord progression",
      emoji: "🎸",
      detail: "Play guitar until something sounds good. Record everything — even a 10-second voice memo. Come back and build around the strongest idea. This is how most rock, pop, and blues songs start.",
      examples: ["Blackbird (Beatles) — built around a fingerpicking pattern", "Smoke on the Water (Deep Purple) — riff came first", "Wonderwall (Oasis) — chord progression → melody → lyrics"],
    },
    {
      title: "Start with a lyrical idea or title",
      emoji: "✍️",
      detail: "A striking phrase, an image, or a title can be the seed. Write it down, then find a musical mood that matches. Ask: what does this phrase want to sound like? Major or minor? Fast or slow?",
      examples: ["'Hotel California' — the title image drove everything", "'Blowin' in the Wind' — a question became a song", "Start with a title: 'Something Worth Fighting For' — what key? What tempo?"],
    },
    {
      title: "Start with an emotion or story",
      emoji: "❤️",
      detail: "What do you actually feel or want to say? Write down what you want the listener to feel at the end of the song. Then work backwards: what music evokes that feeling? What story gets them there?",
      examples: ["Journal — write freely about the feeling first", "Pick 3 words that describe the emotion and match them to musical qualities", "Ask 'What happened?' and tell it as a narrative"],
    },
    {
      title: "Start with a constraint",
      emoji: "🎯",
      detail: "Constraints force creativity. Write a song that's only 2 minutes. Write a song using only 3 chords. Write a verse in 20 minutes. Deadlines and rules eliminate overthinking.",
      examples: ["Write a song before breakfast", "Use only Am, F, C, G — like 1000 hit songs", "Write the entire song in one sitting, no edits"],
    },
  ]

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 rounded-2xl p-6 border border-purple-500/20">
        <h2 className="text-2xl font-bold text-white mb-2">Songwriting Basics</h2>
        <p className="text-white/70">There is no single &quot;right way&quot; to write a song. But there are principles, habits, and frameworks that make the process less mysterious and more reliable. The goal is to finish songs — not to wait for inspiration.</p>
      </div>

      <Card title="Where to Start">
        <p className="text-white/60 text-sm mb-3">Every song starts somewhere. Here are the 4 most common entry points. Click each to see how to develop it.</p>
        <div className="space-y-2">
          {startingPoints.map(s => (
            <div key={s.title}>
              <button
                onClick={() => setExpandedMethod(expandedMethod === s.title ? null : s.title)}
                className={`w-full text-left rounded-xl p-4 border transition-all flex items-center gap-3 ${expandedMethod === s.title ? "bg-purple-600/20 border-purple-500/40" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
              >
                <span className="text-2xl">{s.emoji}</span>
                <span className="text-white font-medium text-sm">{s.title}</span>
                <span className="ml-auto text-white/40">{expandedMethod === s.title ? "▲" : "▼"}</span>
              </button>
              {expandedMethod === s.title && (
                <div className="bg-white/5 rounded-b-xl border border-t-0 border-white/10 p-4">
                  <p className="text-white/70 text-sm mb-3">{s.detail}</p>
                  <div className="space-y-1">
                    {s.examples.map((ex, i) => <div key={i} className="text-purple-300 text-xs">• {ex}</div>)}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card title="The Creative Habit">
        <div className="space-y-3 text-sm">
          {[
            { title: "Write every day", desc: "Even 10 minutes. Write bad songs — finishing a bad song teaches more than planning a great one." },
            { title: "Record everything", desc: "Hum into your phone. Voice memos disappear from memory within hours. Record even the dumb ideas." },
            { title: "Steal like an artist", desc: "Analyse songs you love: what's the chord progression? What's the melodic rhythm? Then use those ideas as jumping-off points." },
            { title: "Separate writing from editing", desc: "Write fast, edit later. Don't stop mid-line to fix a word — finish the draft, then revise." },
            { title: "Play for people", desc: "The moment you play a song for someone, you hear it differently. Play rough demos, not polished recordings." },
          ].map(item => (
            <div key={item.title} className="bg-white/5 rounded-xl p-3">
              <div className="text-purple-300 font-semibold mb-1">{item.title}</div>
              <div className="text-white/60 text-xs">{item.desc}</div>
            </div>
          ))}
        </div>
      </Card>

      <Callout type="insight">
        Most professional songwriters say their process is 90% work and 10% inspiration. The &quot;magic&quot; moments happen because they show up every day and create the conditions for inspiration to arrive.
      </Callout>
    </div>
  )
}

function StructureTab() {
  const structures = [
    {
      name: "Verse–Chorus",
      pattern: "V – C – V – C – C",
      description: "The most common modern pop and rock structure. Verses tell the story, chorus delivers the emotional payoff. Chorus repeats the title/hook.",
      examples: ["Yesterday (Beatles)", "Smells Like Teen Spirit (Nirvana)", "Rolling in the Deep (Adele)"],
      whenToUse: "When your chorus is strong enough to be repeated multiple times without getting boring.",
    },
    {
      name: "Verse–Pre-chorus–Chorus",
      pattern: "V – Pch – C – V – Pch – C – Bridge – C",
      description: "A pre-chorus builds tension before the chorus drops. Creates a three-stage emotional arc in each cycle.",
      examples: ["Since U Been Gone (Kelly Clarkson)", "Don't Stop Believin' (Journey)"],
      whenToUse: "When you want to make the chorus feel even bigger by building to it.",
    },
    {
      name: "AAA (Through-Composed)",
      pattern: "V – V – V – V",
      description: "No chorus. Each verse has the same melody and chord structure but different lyrics. The story progresses linearly. Common in folk and country.",
      examples: ["The House of the Rising Sun (Animals)", "Bob Dylan's narrative folk songs"],
      whenToUse: "When you're telling a story and the narrative matters more than a hook.",
    },
    {
      name: "AABA (Tin Pan Alley)",
      pattern: "A – A – B – A",
      description: "The classic jazz song form. The A section repeats with slight lyric variation, B is a contrasting bridge. 32 bars total in jazz standards.",
      examples: ["Autumn Leaves", "I Got Rhythm", "Over the Rainbow"],
      whenToUse: "Jazz, standards, or when you want a classic songbook feel.",
    },
    {
      name: "Verse–Chorus–Bridge",
      pattern: "V – C – V – C – B – C – C",
      description: "The bridge provides contrast and relief before the final chorus. Usually different key/feel, lyrically addresses a new angle on the theme.",
      examples: ["Let It Be (Beatles)", "We Are the Champions (Queen)"],
      whenToUse: "Most complete pop/rock structure. Add a bridge when you need a moment of contrast.",
    },
  ]

  const [active, setActive] = useState(0)

  return (
    <div className="space-y-4">
      <Card title="Common Song Structures">
        <div className="flex gap-1.5 flex-wrap mb-4">
          {structures.map((s, i) => (
            <button
              key={s.name}
              onClick={() => setActive(i)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${active === i ? "bg-purple-600 text-white" : "bg-white/10 text-white/60 hover:bg-white/20"}`}
            >
              {s.name}
            </button>
          ))}
        </div>
        {(() => {
          const s = structures[active]
          return (
            <div className="bg-purple-900/20 rounded-xl p-4 border border-purple-500/20">
              <div className="font-mono text-purple-300 text-sm mb-3 bg-black/20 rounded-lg px-3 py-2">{s.pattern}</div>
              <p className="text-white/70 text-sm mb-3">{s.description}</p>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="text-purple-400 font-semibold mb-1">Examples</div>
                  <ul className="text-white/60 space-y-0.5">{s.examples.map(e => <li key={e}>• {e}</li>)}</ul>
                </div>
                <div>
                  <div className="text-purple-400 font-semibold mb-1">Use when</div>
                  <p className="text-white/60">{s.whenToUse}</p>
                </div>
              </div>
            </div>
          )
        })()}
      </Card>

      <Card title="What Each Section Does">
        <div className="space-y-2 text-sm">
          {[
            { section: "Verse",       role: "Tells the story / sets the scene",       feel: "Lower energy, narrative, setup" },
            { section: "Pre-chorus",  role: "Builds tension toward the chorus",        feel: "Rising energy, unresolved feeling" },
            { section: "Chorus",      role: "Delivers the emotional payoff / hook",    feel: "Highest energy, singable, repeatable" },
            { section: "Bridge",      role: "Provides contrast, reframes the theme",   feel: "Different feel/key, emotional turning point" },
            { section: "Outro",       role: "Resolves or fades — leaves a feeling",    feel: "Winding down or triumphant ending" },
            { section: "Intro",       role: "Sets mood, hooks the listener instantly", feel: "Often the most memorable 4–8 bars" },
          ].map(item => (
            <div key={item.section} className="flex gap-3 items-start bg-white/5 rounded-xl p-3">
              <span className="text-purple-400 font-bold text-xs w-20 shrink-0 pt-0.5">{item.section}</span>
              <div>
                <div className="text-white/80">{item.role}</div>
                <div className="text-white/40 text-xs">{item.feel}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Callout type="tip">
        Don&apos;t feel locked into a structure before you start. Write the song first, then figure out what structure it naturally wants. Structure is a tool for finishing and refining, not a cage for creativity.
      </Callout>
    </div>
  )
}

function MelodyTab() {
  return (
    <div className="space-y-4">
      <Card title="What Makes a Good Melody?">
        <div className="space-y-3 text-sm">
          {[
            { principle: "Singability", desc: "The best melodies are ones people can hum after one listen. Keep the range manageable (about an octave), avoid too many large jumps, and place emphasis on strong beats." },
            { principle: "Contrast", desc: "Verses should feel melodically different from choruses. If the verse is low and conversational, the chorus should rise in pitch and energy. Movement creates emotion." },
            { principle: "Rhythm matches words", desc: "The natural stress of spoken words should align with the musical beat. Sing your lyric naturally before writing the melody — the melody often writes itself." },
            { principle: "Repetition + variation", desc: "Repeat melodic phrases (creates familiarity) but vary them slightly (creates interest). The chorus is essentially a repeated melodic phrase." },
            { principle: "Climax placement", desc: "Your highest note should land at the emotional peak of the song — usually the final chorus or a key lyric moment." },
          ].map(item => (
            <div key={item.principle} className="bg-white/5 rounded-xl p-3">
              <div className="text-purple-300 font-semibold mb-1">{item.principle}</div>
              <div className="text-white/60 text-xs">{item.desc}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Melodic Contour">
        <p className="text-white/60 text-sm mb-3">Melodic contour is the &quot;shape&quot; of a melody — the path of pitches over time. Here are 4 common contour patterns:</p>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {[
            { name: "Arc (rise–fall)", shape: "↗ ↘", desc: "Starts mid, climbs, comes back down. Very natural, vocal. 'Somewhere Over the Rainbow.'" },
            { name: "Wave (repeating up–down)", shape: "~ ~ ~", desc: "Alternating motion. Conversational and lyrical. Works well for verses." },
            { name: "Ascending", shape: "↗ ↗ ↗", desc: "Builds tension and energy upward. Great for bridges and climactic moments." },
            { name: "Step + leap", shape: "→ ↑ ↓ →", desc: "Mostly stepwise with occasional leaps for drama. The most common in pop songwriting." },
          ].map(c => (
            <div key={c.name} className="bg-white/5 rounded-xl p-3">
              <div className="text-purple-300 font-semibold text-xs">{c.name}</div>
              <div className="text-white/40 font-mono text-sm my-1">{c.shape}</div>
              <div className="text-white/50 text-xs">{c.desc}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="The Hook">
        <p className="text-white/60 text-sm mb-3">The hook is the most memorable part of your song — usually the title repeated at the peak of the chorus. A great hook is:</p>
        <div className="grid grid-cols-2 gap-2 text-xs mb-3">
          {["Short (4–8 syllables)", "Rhythmically distinctive", "Melodically singable", "Lyrically meaningful", "Placed on the beat", "Emotionally resonant"].map(h => (
            <div key={h} className="bg-purple-500/10 rounded-lg p-2 text-purple-200">✓ {h}</div>
          ))}
        </div>
        <Callout type="exercise">
          Sing your hook to yourself throughout the day. If you can&apos;t remember it after 30 minutes, it&apos;s not hooky enough yet. Rewrite it until it won&apos;t leave your head.
        </Callout>
      </Card>

      <Card title="Writing Melody Over Chords">
        <div className="space-y-2 text-sm text-white/70">
          <p>Play your chord progression on loop. Then, over the top, hum or sing freely without trying to make words. Record it. Listen back and pick the best 4–8 bars.</p>
          <div className="bg-white/5 rounded-xl p-3">
            <div className="text-purple-300 font-semibold mb-1">The &quot;mumble track&quot; technique</div>
            <p className="text-white/60 text-xs">Sing nonsense syllables (&quot;da da dum da da&quot;) to find the melodic idea first. Words can come later. Many hit songs were written this way — &quot;Yesterday&quot; started with &quot;Scrambled eggs&quot; as a placeholder lyric.</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

function ChordsTab() {
  const progressions = [
    { name: "I–V–vi–IV",  key: "C: C G Am F",  feel: "Uplifting, anthemic",      songs: ["Let It Be", "With or Without You", "No Woman No Cry"] },
    { name: "I–IV–V",     key: "G: G C D",      feel: "Classic rock/blues, driving", songs: ["La Bamba", "Twist and Shout", "most 12-bar blues"] },
    { name: "vi–IV–I–V",  key: "Am F C G",      feel: "Emotional, contemporary pop", songs: ["Apologize", "Grenade", "Someone Like You"] },
    { name: "I–vi–IV–V",  key: "C Am F G",      feel: "Sweet, nostalgic, 50s feel", songs: ["Stand By Me", "Earth Angel", "Heart and Soul"] },
    { name: "ii–V–I",     key: "Dm G C",        feel: "Resolution, jazz/folk",      songs: ["Autumn Leaves (core)", "many jazz standards"] },
    { name: "I–III–IV",   key: "C E F",         feel: "Bright, hopeful, movement",  songs: ["Here Comes the Sun", "Eight Days a Week"] },
    { name: "i–VII–VI–VII", key: "Am G F G",    feel: "Epic, anthemic, driving",    songs: ["Stairway to Heaven (verse)", "Smoke on the Water (variation)"] },
    { name: "i–VI–III–VII", key: "Am F C G",    feel: "Dark pop, emotional depth",  songs: ["Radioactive", "Demons", "many modern pop"] },
  ]

  const emotions = [
    { chord: "Major",         feel: "Happy, bright, triumphant" },
    { chord: "Minor",         feel: "Sad, introspective, emotional" },
    { chord: "Dominant 7th",  feel: "Tension, bluesy, wanting resolution" },
    { chord: "Major 7th",     feel: "Dreamy, sophisticated, floating" },
    { chord: "Minor 7th",     feel: "Melancholic, soulful, reflective" },
    { chord: "Diminished",    feel: "Dark, tense, dramatic" },
    { chord: "Suspended (sus2/4)", feel: "Open, unresolved, atmospheric" },
    { chord: "Added 9th (add9)", feel: "Rich, contemporary pop, lush" },
  ]

  return (
    <div className="space-y-4">
      <Card title="Chord Progressions by Feel">
        <p className="text-white/60 text-sm mb-3">These 8 progressions cover the vast majority of popular music. Pick one that matches the mood you want, then write your melody and lyrics on top.</p>
        <div className="space-y-2">
          {progressions.map(p => (
            <div key={p.name} className="bg-white/5 rounded-xl p-3">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="font-mono text-purple-300 text-sm font-bold">{p.name}</span>
                <span className="text-white/40 text-xs font-mono">({p.key})</span>
                <span className="ml-auto text-xs text-amber-400 italic">{p.feel}</span>
              </div>
              <div className="text-white/40 text-xs">{p.songs.join(" · ")}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Emotional Color of Chord Types">
        <div className="grid grid-cols-2 gap-2">
          {emotions.map(e => (
            <div key={e.chord} className="bg-white/5 rounded-xl p-3 text-xs">
              <div className="text-purple-300 font-semibold mb-0.5">{e.chord}</div>
              <div className="text-white/60">{e.feel}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Changing Up a Progression">
        <div className="space-y-3 text-sm text-white/70">
          <p>Once you have a base progression, here are 4 ways to make it more interesting without changing the fundamental feel:</p>
          <div className="space-y-2">
            {[
              { technique: "Add a sus4 then resolve", example: "C → Csus4 → C gives movement within one chord" },
              { technique: "Substitute vi for I", example: "End on Am instead of C for a bittersweet twist" },
              { technique: "Chromatic passing chord", example: "In C: C – Bb – F creates unexpected movement" },
              { technique: "Change rhythm/feel", example: "Same chords, but switch from strumming to arpeggios — totally different vibe" },
            ].map(t => (
              <div key={t.technique} className="bg-white/5 rounded-xl p-3">
                <div className="text-purple-300 font-semibold text-xs mb-0.5">{t.technique}</div>
                <div className="text-white/50 text-xs">{t.example}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Callout type="insight">
        The best songwriting insight: <strong>the progression is a vehicle, not the destination.</strong> A I–V–vi–IV in a major key with the right melody and lyrics can be a joyful anthem OR a tear-jerking ballad. The emotional content comes mostly from melody, rhythm, and lyrics — not the chords alone.
      </Callout>
    </div>
  )
}

function LyricsTab() {
  return (
    <div className="space-y-4">
      <Card title="Lyric Writing Fundamentals">
        <div className="space-y-3 text-sm">
          {[
            { title: "Show, don't tell", desc: "Instead of 'I was sad' — 'I left your coffee on the counter, cold.' Specific, concrete images create emotion more powerfully than abstract statements." },
            { title: "Write to be heard, not read", desc: "Lyrics are meant to be sung. Use words with interesting sounds. Avoid tongue-twisters. Say it out loud — if you stumble, rewrite." },
            { title: "The conversational test", desc: "Would someone say this in real life? Overly poetic or archaic language creates distance. Write how people actually talk, then elevate slightly." },
            { title: "One idea per song", desc: "Great songs focus on one central idea or emotion. If your song is about 3 different things, it has no center. Find the single core message." },
            { title: "The title earns its place", desc: "Your song title should appear at the most emotionally powerful moment — usually the peak of the chorus. Everything else builds toward it." },
          ].map(item => (
            <div key={item.title} className="bg-white/5 rounded-xl p-3">
              <div className="text-purple-300 font-semibold mb-1">{item.title}</div>
              <div className="text-white/60 text-xs">{item.desc}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Rhyme Schemes">
        <p className="text-white/60 text-sm mb-3">Rhyme creates musicality and makes lyrics stick in memory. But forced rhymes kill songs. Here are the main approaches:</p>
        <div className="space-y-2 text-sm">
          {[
            { scheme: "ABAB", example: "Line 1 (A) / Line 2 (B) / Line 3 (A) / Line 4 (B)", feel: "Natural, conversational flow", risk: "Can feel sing-songy if overused" },
            { scheme: "AABB", example: "Line 1 (A) / Line 2 (A) / Line 3 (B) / Line 4 (B)", feel: "Strong, direct, punchy", risk: "Very rigid — rhyme every 2 lines" },
            { scheme: "ABCB", example: "Line 1 (A) / Line 2 (B) / Line 3 (C) / Line 4 (B)", feel: "Only lines 2 and 4 rhyme — feels natural", risk: "Very easy to write, sometimes too loose" },
            { scheme: "No rhyme (free verse)", example: "Bob Dylan, Leonard Cohen — rhyme when it feels right", feel: "Literary, poetic, honest", risk: "Requires strong melodic support to work" },
          ].map(r => (
            <div key={r.scheme} className="bg-white/5 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-purple-300 font-bold">{r.scheme}</span>
                <span className="text-white/40 text-xs italic">{r.feel}</span>
              </div>
              <div className="text-white/50 text-xs mb-1 font-mono">{r.example}</div>
              <div className="text-amber-400/70 text-xs">⚠ {r.risk}</div>
            </div>
          ))}
        </div>
        <Callout type="tip">
          <strong>Near rhymes</strong> (slant rhymes) are your best friend. &quot;Eyes&quot; and &quot;lies&quot; is a perfect rhyme. &quot;Eyes&quot; and &quot;time&quot; is a near rhyme — it works, and it doesn&apos;t force awkward word choices.
        </Callout>
      </Card>

      <Card title="Common Lyric Traps">
        <div className="space-y-2">
          {[
            { trap: "Rhyme-forced word choices", example: "'I feel so great, I cannot wait' — did you really mean 'great'?", fix: "If the rhyme forces a bad word, change the entire rhyme scheme of the section" },
            { trap: "Clichés", example: "'Follow your heart', 'love is blind', 'world on fire'", fix: "Take the cliché and find a fresh, specific image that conveys the same idea" },
            { trap: "Too abstract", example: "'My pain is real and deep and vast'", fix: "Replace abstract statements with one specific concrete image" },
            { trap: "Purple prose", example: "Using the most flowery, ornate language possible", fix: "Write simpler. The most powerful lyrics are often the most plain." },
          ].map(t => (
            <div key={t.trap} className="bg-white/5 rounded-xl p-3 text-sm">
              <div className="text-red-400 font-semibold text-xs mb-1">✗ {t.trap}</div>
              <div className="text-white/50 text-xs italic mb-1">{t.example}</div>
              <div className="text-green-400 text-xs">Fix: {t.fix}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function FinishingTab() {
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 rounded-2xl p-5 border border-purple-500/20">
        <h2 className="text-xl font-bold text-white mb-2">The Most Important Skill: Finishing</h2>
        <p className="text-white/70 text-sm">Most songwriters have dozens of unfinished ideas. The habit of finishing — even imperfect songs — is what separates prolific songwriters from those who write one &quot;great&quot; unfinished song for years.</p>
      </div>

      <Card title="Getting Unstuck">
        <div className="space-y-2 text-sm">
          {[
            { problem: "Stuck on the bridge", solution: "Write the bridge from the opposite emotional perspective of the verse. If the verse is hopeful, make the bridge doubtful — then resolve in the final chorus." },
            { problem: "Verse is good, chorus is weak", solution: "Lower the energy of the verse (quieter, simpler chords) to make the chorus feel bigger by contrast." },
            { problem: "Can't find the right word", solution: "Write 10 bad options. Then 10 more. Eventually the right one appears — or you combine two bad options into one good one." },
            { problem: "Melody feels boring", solution: "Change the rhythm of the vocal melody, not the notes. The same pitches with a syncopated rhythm feel completely different." },
            { problem: "Song feels too long", solution: "Remove the second verse. Most songs work better with V–C–V–C–B–C than with three full verses." },
          ].map(item => (
            <div key={item.problem} className="bg-white/5 rounded-xl p-3">
              <div className="text-amber-400 font-semibold text-xs mb-1">Problem: {item.problem}</div>
              <div className="text-green-300 text-xs">Solution: {item.solution}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="The Rough Demo">
        <p className="text-white/60 text-sm mb-3">Every song needs a rough recording before it&apos;s truly finished. A voice memo of you playing and singing is enough.</p>
        <div className="space-y-2 text-sm">
          {[
            { step: "1", title: "Record a rough demo immediately", desc: "Don't wait until it's perfect. Record it today, flaws and all." },
            { step: "2", title: "Listen with fresh ears (next day)", desc: "You'll hear what works and what doesn't far more clearly after a break." },
            { step: "3", title: "Make one revision pass", desc: "Fix the 2–3 biggest issues. Then stop. Over-revision kills songs." },
            { step: "4", title: "Play it for someone", desc: "Watch their face, not just listen to their feedback. Do they zone out? Do they lean in? Their body language tells you more than their words." },
            { step: "5", title: "Declare it finished", desc: "Good enough is done. Perfect is never done. Ship it." },
          ].map(s => (
            <div key={s.step} className="flex gap-3 items-start bg-white/5 rounded-xl p-3">
              <span className="bg-purple-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shrink-0 font-bold">{s.step}</span>
              <div>
                <div className="text-white/80 font-medium text-xs">{s.title}</div>
                <div className="text-white/50 text-xs mt-0.5">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Your First 10 Songs">
        <p className="text-white/60 text-sm mb-3">The goal of your first 10 songs is not to write great songs. It&apos;s to finish 10 songs. Here&apos;s a structured approach:</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            { num: "1–3", goal: "Finish anything. Terrible is fine. Finishing is everything." },
            { num: "4–6", goal: "Experiment with different structures. Try verse/chorus, try AAA." },
            { num: "7–8", goal: "Focus on one element: make the chorus really sing." },
            { num: "9–10", goal: "Write about something real and specific to you." },
          ].map(s => (
            <div key={s.num} className="bg-purple-900/20 rounded-xl p-3 border border-purple-500/20">
              <div className="text-purple-300 font-bold mb-1">Songs {s.num}</div>
              <div className="text-white/60">{s.goal}</div>
            </div>
          ))}
        </div>
        <Callout type="insight">
          Ira Glass on the creative gap: &quot;Your taste is good enough to know when your work isn&apos;t good yet. The only way to close the gap between taste and ability is to do a huge volume of work.&quot; Write 10 songs to write 1 good one.
        </Callout>
      </Card>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function SongwritingPage() {
  const [activeTab, setActiveTab] = useState<Tab>("process")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 pb-16">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/" className="text-purple-400 hover:text-purple-300 text-sm mb-3 inline-block">← Back to Home</Link>
          <div className="flex items-center gap-3">
            <span className="text-3xl">✍️</span>
            <div>
              <h1 className="text-2xl font-bold text-white">Songwriting Basics</h1>
              <p className="text-white/60 text-sm">Structure, melody, lyrics, and the habit of finishing songs</p>
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
        {activeTab === "process"   && <ProcessTab />}
        {activeTab === "structure" && <StructureTab />}
        {activeTab === "melody"    && <MelodyTab />}
        {activeTab === "chords"    && <ChordsTab />}
        {activeTab === "lyrics"    && <LyricsTab />}
        {activeTab === "finishing" && <FinishingTab />}
      </div>
    </div>
  )
}
