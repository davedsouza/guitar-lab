"use client"

import React, { useState } from "react"
import Link from "next/link"

type Tab = "what-why" | "open-g" | "open-d" | "dadgad" | "open-e" | "slide" | "practice" | "fretboard"

const TABS: { id: Tab; label: string }[] = [
  { id: "what-why",  label: "What & Why" },
  { id: "open-g",    label: "Open G" },
  { id: "open-d",    label: "Open D" },
  { id: "dadgad",    label: "DADGAD" },
  { id: "open-e",    label: "Open E" },
  { id: "slide",     label: "Slide Guitar" },
  { id: "practice",  label: "Practice & Songs" },
  { id: "fretboard", label: "Fretboard Explorer" },
]

function Callout({ type, children }: { type: "tip" | "warning" | "insight" | "exercise"; children: React.ReactNode }) {
  const styles = {
    tip:      "border-l-4 border-purple-500 bg-purple-500/10 text-purple-200",
    warning:  "border-l-4 border-amber-500  bg-amber-500/10  text-amber-200",
    insight:  "border-l-4 border-blue-400   bg-blue-400/10   text-blue-200",
    exercise: "border-l-4 border-green-500  bg-green-500/10  text-green-200",
  }
  const labels = { tip: "💡 Tip", warning: "⚠️ Watch Out", insight: "🔑 Key Insight", exercise: "🎸 Exercise" }
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
      <pre className="font-mono text-green-300 bg-black/40 rounded-xl p-4 text-xs leading-relaxed overflow-x-auto whitespace-pre">{children}</pre>
    </div>
  )
}

function TuningHeader({ name, strings, color, description }: {
  name: string; strings: string[]; color: string; description: string
}) {
  const stdStrings = ["E","A","D","G","B","E"]
  const labels = ["Low E", "A", "D", "G", "B", "High e"]
  return (
    <div className={`bg-white/10 border-l-4 ${color} rounded-xl p-5 mb-6`}>
      <h2 className="text-2xl font-bold text-white mb-1">{name}</h2>
      <p className="text-purple-200 text-sm mb-4">{description}</p>
      <div className="flex flex-wrap gap-2">
        {strings.map((note, i) => (
          <div key={i} className="text-center">
            <div className={`px-3 py-1.5 rounded-lg text-sm font-bold ${
              note !== stdStrings[i] ? "bg-amber-500 text-black" : "bg-white/15 text-white"
            }`}>{note}</div>
            <p className="text-xs text-purple-400 mt-0.5">{labels[i]}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
function WhatWhyTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">What Are Open Tunings?</h2>
      <p className="text-purple-200 mb-6">
        An open tuning means your guitar rings a full chord when strummed open — no fretting required.
        Barre any fret with one finger and you have a full major chord. It changes everything.
      </p>

      <Callout type="insight">
        Standard tuning is optimised for playing conventional chord shapes. Open tunings are optimised for
        <strong className="text-white"> slide guitar, drones, and sounds that are physically impossible in standard tuning</strong>.
        They don&apos;t replace standard — they open entirely new worlds.
      </Callout>

      <Card title="Why Open Tunings Sound Different">
        <div className="space-y-3 text-sm">
          {[
            {
              title: "Drone strings ring freely",
              body: "Multiple strings tuned to the root note create a sustained resonance underneath everything you play. Chords are richer, fuller, more atmospheric."
            },
            {
              title: "One finger = full chord",
              body: "A straight barre across all strings plays a major chord at whatever fret you barre. This makes sliding between chords effortless — and makes slide guitar playable."
            },
            {
              title: "Unique voicings impossible in standard",
              body: "The interval relationships between strings are completely different, creating chord voicings and combinations you simply cannot achieve in standard tuning."
            },
            {
              title: "Sympathetic resonance",
              body: "Open strings vibrate in response to fretted notes. The result is a bloom and sustain that characterises acoustic blues, Celtic folk, and ambient music."
            },
          ].map(r => (
            <div key={r.title} className="border-b border-white/10 pb-3">
              <p className="text-white font-semibold mb-1">{r.title}</p>
              <p className="text-purple-300">{r.body}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card title="The Four Main Open Tunings">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="text-purple-400 border-b border-white/10 text-xs">
                <th className="pb-2 text-left">Tuning</th>
                <th className="pb-2 text-left">Strings (Low → High)</th>
                <th className="pb-2 text-left">Character</th>
                <th className="pb-2 text-left">Famous for</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {[
                { t: "Open G",  s: "D G D G B D",   c: "Warm, bluesy, rock",           f: "Keith Richards, Robert Johnson" },
                { t: "Open D",  s: "D A D F# A D",  c: "Rich, resonant, bittersweet",  f: "Joni Mitchell, Derek Trucks" },
                { t: "DADGAD",  s: "D A D G A D",   c: "Suspended, modal, haunting",   f: "Jimmy Page, Celtic folk" },
                { t: "Open E",  s: "E B E G# B E",  c: "Bright, punchy, electric",     f: "Duane Allman, Elmore James" },
              ].map(r => (
                <tr key={r.t}>
                  <td className="py-2 text-amber-400 font-bold">{r.t}</td>
                  <td className="py-2 text-green-300 font-mono text-xs">{r.s}</td>
                  <td className="py-2 text-purple-300 text-xs">{r.c}</td>
                  <td className="py-2 text-slate-400 text-xs">{r.f}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="How to Retune Safely">
        <div className="space-y-2 text-sm">
          {[
            { step: "1", text: "Always loosen strings before tightening. Going up in pitch creates tension — do it slowly." },
            { step: "2", text: "Tune one string at a time, check against a tuner app after each string." },
            { step: "3", text: "After reaching the tuning, strum and retune — strings settle when under tension." },
            { step: "4", text: "For Open E especially: use lighter strings (10s or 9s) to reduce tension on raised strings." },
            { step: "5", text: "Keep a dedicated open-tuning guitar if you switch often — retuning repeatedly fatigues strings." },
          ].map(r => (
            <div key={r.step} className="flex gap-3">
              <div className="bg-purple-600 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5">{r.step}</div>
              <p className="text-purple-200">{r.text}</p>
            </div>
          ))}
        </div>
      </Card>

      <Callout type="tip">
        Start with <strong className="text-white">Open G</strong> if you play rock or blues — it&apos;s the most widely used.
        Start with <strong className="text-white">DADGAD</strong> if you play acoustic folk or Celtic — it&apos;s the easiest to reach from standard (only 3 strings change, all go down).
      </Callout>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
function OpenGTab() {
  return (
    <div>
      <TuningHeader
        name="Open G — D G D G B D"
        strings={["D","G","D","G","B","D"]}
        color="border-amber-500"
        description="The most popular open tuning for rock and blues. Keith Richards removed the low E string entirely — giving it that distinctive 5-string sound."
      />

      <Card title="How to Tune from Standard">
        <div className="space-y-2 text-sm">
          {[
            { string: "Low E (6th)",   change: "Down 2 semitones → D",  highlight: true },
            { string: "A (5th)",       change: "Down 2 semitones → G",  highlight: true },
            { string: "D (4th)",       change: "Stay the same → D",     highlight: false },
            { string: "G (3rd)",       change: "Stay the same → G",     highlight: false },
            { string: "B (2nd)",       change: "Stay the same → B",     highlight: false },
            { string: "High e (1st)",  change: "Down 2 semitones → D",  highlight: true },
          ].map(r => (
            <div key={r.string} className={`flex items-center gap-3 p-2 rounded-lg ${r.highlight ? "bg-amber-500/10 border border-amber-500/30" : "bg-white/5"}`}>
              <span className="text-white font-semibold w-28 flex-shrink-0 text-xs">{r.string}</span>
              <span className={`text-xs ${r.highlight ? "text-amber-300" : "text-purple-300"}`}>{r.change}</span>
            </div>
          ))}
        </div>
        <p className="text-slate-400 text-xs mt-3">Keith Richards tip: after tuning, remove the low E string entirely. The 5-string voicing is less muddy and his entire Stones sound is built on it.</p>
      </Card>

      <Card title="Chord Shapes in Open G">
        <p className="text-purple-200 text-sm mb-4">A straight barre = major chord. The tonic is always the note you barre to.</p>
        <TabBlock label="Essential Open G chords">
{`Open (G):  Fret 5 (C):  Fret 7 (D):  Fret 10 (F):
D|--0--     D|--5--       D|--7--       D|--10--
B|--0--     B|--5--       B|--7--       B|--10--
G|--0--     G|--5--       G|--7--       G|--10--
D|--0--     D|--5--       D|--7--       D|--10--
G|--0--     G|--5--       G|--7--       G|--10--
D|--0--     D|--5--       D|--7--       D|--10--`}
        </TabBlock>

        <TabBlock label="Keith Richards 5-string (no low E) — Start Me Up, Honky Tonk Women">
{`Open (G):  Fret 5 (C):  Fret 7 (D):
D|--0--     D|--5--       D|--7--
B|--0--     B|--5--       B|--7--
G|--0--     G|--5--       G|--7--
D|--0--     D|--5--       D|--7--
G|--0--     G|--5--       G|--7--
(no low E)

3 chords. One finger each. That's the entire Stones rhythm sound.`}
        </TabBlock>

        <TabBlock label="12-bar blues in Open G — G, C, D">
{`G (open 0) → C (fret 5) → D (fret 7)

Barre each fret straight across all 5 strings.
Shuffle rhythm: long-short, long-short on 8th notes.

This is how Robert Johnson, Muddy Waters and Keith Richards played blues.`}
        </TabBlock>
      </Card>

      <Card title="Famous Songs in Open G">
        <div className="space-y-2 text-sm">
          {[
            { song: "Start Me Up",       artist: "Rolling Stones",          note: "Pure Open G riff — 3 chords, one finger each" },
            { song: "Honky Tonk Women",  artist: "Rolling Stones",          note: "Keith's signature 5-string cowbell riff" },
            { song: "Brown Sugar",       artist: "Rolling Stones",          note: "5-string Open G with slide feel" },
            { song: "Gimme Shelter",     artist: "Rolling Stones",          note: "Open G with capo at 4th fret" },
            { song: "Crossroads",        artist: "Robert Johnson / Clapton", note: "Delta blues foundation in Open G" },
            { song: "Little Martha",     artist: "Allman Brothers",         note: "Fingerstyle in Open G — beautiful melody playing" },
          ].map(s => (
            <div key={s.song} className="border-b border-white/10 pb-2">
              <p className="text-white font-semibold">{s.song} <span className="text-purple-400 font-normal">— {s.artist}</span></p>
              <p className="text-purple-300 text-xs">{s.note}</p>
            </div>
          ))}
        </div>
      </Card>

      <Callout type="exercise">
        Tune to Open G. Strum open = G chord. Barre fret 5 = C chord. Barre fret 7 = D chord. Play 4 bars G | 2 C 2 G | 2 D 2 C | G — that&apos;s a full 12-bar blues in one position. This is why Keith Richards fell in love with this tuning.
      </Callout>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
function OpenDTab() {
  return (
    <div>
      <TuningHeader
        name="Open D — D A D F# A D"
        strings={["D","A","D","F#","A","D"]}
        color="border-blue-400"
        description="Warm, rich, slightly bittersweet. The go-to tuning for acoustic slide, folk, and Joni Mitchell's intricate chord voicings."
      />

      <Card title="How to Tune from Standard">
        <div className="space-y-2 text-sm">
          {[
            { string: "Low E (6th)",  change: "Down 2 semitones → D",   highlight: true },
            { string: "A (5th)",      change: "Stay the same → A",      highlight: false },
            { string: "D (4th)",      change: "Stay the same → D",      highlight: false },
            { string: "G (3rd)",      change: "Down 1 semitone → F#",   highlight: true },
            { string: "B (2nd)",      change: "Down 2 semitones → A",   highlight: true },
            { string: "High e (1st)", change: "Down 2 semitones → D",   highlight: true },
          ].map(r => (
            <div key={r.string} className={`flex items-center gap-3 p-2 rounded-lg ${r.highlight ? "bg-blue-500/10 border border-blue-500/30" : "bg-white/5"}`}>
              <span className="text-white font-semibold w-28 flex-shrink-0 text-xs">{r.string}</span>
              <span className={`text-xs ${r.highlight ? "text-blue-300" : "text-purple-300"}`}>{r.change}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Chord Shapes in Open D">
        <TabBlock label="Basic chords — barre = major chord at that root">
{`Open (D):  Fret 5 (G):  Fret 7 (A):  Fret 3 (F):  Fret 10 (C):
D|--0--     D|--5--       D|--7--       D|--3--       D|--10--
A|--0--     A|--5--       A|--7--       A|--3--       A|--10--
F#|--0--    F#|--5--      F#|--7--      F#|--3--      F#|--10--
D|--0--     D|--5--       D|--7--       D|--3--       D|--10--
A|--0--     A|--5--       A|--7--       A|--3--       A|--10--
D|--0--     D|--5--       D|--7--       D|--3--       D|--10--`}
        </TabBlock>

        <TabBlock label="Joni Mitchell-style partial voicings — add 1 or 2 fingers to open strings">
{`Dsus2 (open):  D add9:       Bass note change:
D|--0--         D|--0--        D|--0--
A|--0--         A|--0--        A|--0--
F#|--0--        F#|--2--       F#|--0--
D|--0--         D|--0--        D|--0--
A|--0--         A|--0--        A|--0--
D|--0--         D|--0--        D|--2--  ← adds F# bass

Joni never stayed on straight barres — she explored partial voicings.`}
        </TabBlock>
      </Card>

      <Card title="Open D vs Open E — Important Relationship">
        <p className="text-purple-200 text-sm mb-3">
          Open D and Open E use exactly the same shapes. Open E is Open D with a capo at the 2nd fret.
          Learn the shapes in Open D (less string tension), then use Open E for the brighter, higher sound.
        </p>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          <div className="bg-white/5 rounded-xl p-3">
            <p className="text-blue-300 font-semibold">Open D — safer for your guitar</p>
            <p className="text-purple-300 text-xs mt-1">Four strings go DOWN in pitch — less tension. Preferred by acoustic players.</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <p className="text-amber-300 font-semibold">Open E — brighter, more electric</p>
            <p className="text-amber-200 text-xs mt-1">Three strings go UP — more tension. Beautiful on electric. Use lighter strings.</p>
          </div>
        </div>
      </Card>

      <Card title="Famous Songs in Open D">
        <div className="space-y-2 text-sm">
          {[
            { song: "Big Yellow Taxi",       artist: "Joni Mitchell",           note: "Classic Open D fingerpicking" },
            { song: "The Circle Game",       artist: "Joni Mitchell",           note: "Intricate Open D chord voicings" },
            { song: "Death Letter",          artist: "Son House / White Stripes", note: "Brutal delta slide blues in Open D" },
            { song: "In My Time of Dying",   artist: "Led Zeppelin",            note: "Acoustic slide in Open D, beautiful melody" },
            { song: "Vigilante Man",         artist: "Ry Cooder",               note: "Roots slide in Open D" },
          ].map(s => (
            <div key={s.song} className="border-b border-white/10 pb-2">
              <p className="text-white font-semibold">{s.song} <span className="text-purple-400 font-normal">— {s.artist}</span></p>
              <p className="text-purple-300 text-xs">{s.note}</p>
            </div>
          ))}
        </div>
      </Card>

      <Callout type="exercise">
        Tune to Open D. Fingerpick: thumb on D (6th string), index on F# (3rd), middle on A (2nd), ring on D (1st). That four-note arpeggio is the foundation of hundreds of folk songs. Add fret 2 on one string at a time and listen to how the chord colour shifts.
      </Callout>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
function DADGADTab() {
  return (
    <div>
      <TuningHeader
        name="DADGAD — D A D G A D"
        strings={["D","A","D","G","A","D"]}
        color="border-emerald-400"
        description="Not a true open major chord — it's an open Dsus4. The suspended, unresolved quality is the entire point. Beloved by Celtic guitarists and acoustic adventurers."
      />

      <Card title="How to Tune from Standard">
        <div className="space-y-2 text-sm">
          {[
            { string: "Low E (6th)",  change: "Down 2 semitones → D",   highlight: true },
            { string: "A (5th)",      change: "Stay the same → A",      highlight: false },
            { string: "D (4th)",      change: "Stay the same → D",      highlight: false },
            { string: "G (3rd)",      change: "Stay the same → G",      highlight: false },
            { string: "B (2nd)",      change: "Down 2 semitones → A",   highlight: true },
            { string: "High e (1st)", change: "Down 2 semitones → D",   highlight: true },
          ].map(r => (
            <div key={r.string} className={`flex items-center gap-3 p-2 rounded-lg ${r.highlight ? "bg-emerald-500/10 border border-emerald-500/30" : "bg-white/5"}`}>
              <span className="text-white font-semibold w-28 flex-shrink-0 text-xs">{r.string}</span>
              <span className={`text-xs ${r.highlight ? "text-emerald-300" : "text-purple-300"}`}>{r.change}</span>
            </div>
          ))}
        </div>
        <p className="text-purple-300 text-xs mt-3">Easiest open tuning to reach from standard — only 3 strings move, all go DOWN.</p>
      </Card>

      <Callout type="insight">
        DADGAD is a <strong className="text-white">Dsus4 chord</strong> — it has no major or minor third, just a perfect 4th (G).
        This ambiguity means it never fully resolves. That floating, haunting quality is the entire character of the tuning.
        It works equally well over major and minor progressions.
      </Callout>

      <Card title="Chord Shapes in DADGAD">
        <TabBlock label="Core DADGAD chords — add only 1 or 2 fingers to open strings">
{`Open (Dsus4):  D major:     G chord:     A chord:     Cadd9:
D|--0--         D|--2--       D|--5--       D|--7--       D|--0--
A|--0--         A|--0--       A|--5--       A|--7--       A|--3--
G|--0--         G|--2--       G|--4--       G|--7--       G|--2--
D|--0--         D|--0--       D|--5--       D|--7--       D|--2--
A|--0--         A|--0--       A|--5--       A|--7--       A|--0--
D|--0--         D|--0--       D|--5--       D|--7--       D|--0--`}
        </TabBlock>

        <TabBlock label="Celtic drone — open strings ring under melody">
{`D melody with open A and D drones ringing freely:
D|--0--2--4--5--4--2--0--|   (melody on top)
A|--0--0--0--0--0--0--0--|   (drone — never changes)
G|--0--0--0--0--0--0--0--|   (drone)
D|--0--0--0--0--0--0--0--|
A|--0--0--0--0--0--0--0--|
D|--0--0--0--0--0--0--0--|

Let ALL open strings ring — the resonance builds up underneath`}
        </TabBlock>

        <TabBlock label="Jimmy Page inspired riff — modal drone feel">
{`D|--0--0--0--0--5--5--5--5--|
A|--0--0--0--0--0--0--0--0--|
G|--0--0--0--2--0--0--0--2--|
D|--0--0--0--0--0--0--0--0--|
A|--0--0--0--0--0--0--0--0--|
D|--0--0--0--0--0--0--0--0--|

The open strings create the layered drone beneath the melody`}
        </TabBlock>
      </Card>

      <Card title="Famous Songs in DADGAD">
        <div className="space-y-2 text-sm">
          {[
            { song: "White Summer / Black Mountain Side", artist: "Led Zeppelin / Jimmy Page", note: "DADGAD's most famous rock moment" },
            { song: "Bron-Y-Aur Stomp",                   artist: "Led Zeppelin",             note: "Acoustic DADGAD groove" },
            { song: "She Moved Through the Fair",          artist: "Traditional Irish",         note: "The classic Celtic DADGAD song" },
            { song: "Photograph",                          artist: "Nickel Creek",              note: "Modern folk-DADGAD fingerpicking" },
          ].map(s => (
            <div key={s.song} className="border-b border-white/10 pb-2">
              <p className="text-white font-semibold">{s.song} <span className="text-purple-400 font-normal">— {s.artist}</span></p>
              <p className="text-purple-300 text-xs">{s.note}</p>
            </div>
          ))}
        </div>
      </Card>

      <Callout type="exercise">
        Tune to DADGAD. Strum open — it doesn&apos;t feel fully resolved. Now put one finger on fret 2 of the G string. Strum. Add fret 2 of the D string (4th). That&apos;s D major emerging from the drone. This partial-fingering approach — adding just 1 or 2 notes to the open strings — is the DADGAD method.
      </Callout>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
function OpenETab() {
  return (
    <div>
      <TuningHeader
        name="Open E — E B E G# B E"
        strings={["E","B","E","G#","B","E"]}
        color="border-red-400"
        description="Bright, punchy, electric. The tuning of Duane Allman, Elmore James, and the Allman Brothers' twin-guitar attack. Three strings go UP in pitch — use lighter strings."
      />

      <Callout type="warning">
        Open E raises three strings above standard pitch, increasing string tension significantly. Use light (9s or 10s) strings. Tune slowly, check with a tuner at each step. If a string feels extremely tight, stop — you may be going the wrong direction.
      </Callout>

      <Card title="How to Tune from Standard">
        <div className="space-y-2 text-sm">
          {[
            { string: "Low E (6th)",  change: "Stay the same → E",      highlight: false, up: false },
            { string: "A (5th)",      change: "Up 2 semitones → B",     highlight: true,  up: true },
            { string: "D (4th)",      change: "Up 2 semitones → E",     highlight: true,  up: true },
            { string: "G (3rd)",      change: "Up 1 semitone → G#",     highlight: true,  up: true },
            { string: "B (2nd)",      change: "Stay the same → B",      highlight: false, up: false },
            { string: "High e (1st)", change: "Stay the same → E",      highlight: false, up: false },
          ].map((r, i) => (
            <div key={i} className={`flex items-center gap-3 p-2 rounded-lg ${r.highlight ? "bg-red-500/10 border border-red-500/30" : "bg-white/5"}`}>
              <span className="text-white font-semibold w-28 flex-shrink-0 text-xs">{r.string}</span>
              <span className={`text-xs ${r.up ? "text-red-400 font-semibold" : "text-purple-300"}`}>{r.change}</span>
              {r.up && <span className="text-red-400 text-xs">↑ raises tension</span>}
            </div>
          ))}
        </div>
        <p className="text-amber-300 text-xs mt-3">Open E = Open D shapes + capo at fret 2. Learn the shapes in Open D, apply in Open E with no new fingering.</p>
      </Card>

      <Card title="Chord Shapes in Open E">
        <TabBlock label="Identical shapes to Open D — just 2 frets higher">
{`Open (E):  Fret 5 (A):  Fret 7 (B):  Fret 4 (G#m): Fret 9 (C#):
E|--0--     E|--5--       E|--7--       E|--4--        E|--9--
B|--0--     B|--5--       B|--7--       B|--4--        B|--9--
G#|--0--    G#|--5--      G#|--7--      G#|--4--       G#|--9--
E|--0--     E|--5--       E|--7--       E|--4--        E|--9--
B|--0--     B|--5--       B|--7--       B|--4--        B|--9--
E|--0--     E|--5--       E|--7--       E|--4--        E|--9--`}
        </TabBlock>

        <TabBlock label="Duane Allman-style slide lick in Open E">
{`e|--0---12---12/14--12-----|
B|--0---12---12/14--12-----|
G#|-0---12---12/14--12-----|
E|--0---12---12/14--12-----|
B|--0---12---12/14--12-----|
E|--0---12---12/14--12-----|

Open = E chord. Slide to 12 = E octave. Slide to 14 = F# (major 2nd).
The slide must sit DIRECTLY over the fret wire — not behind it.`}
        </TabBlock>
      </Card>

      <Card title="Famous Songs in Open E">
        <div className="space-y-2 text-sm">
          {[
            { song: "Statesboro Blues",      artist: "Allman Brothers",              note: "Duane Allman's signature slide piece" },
            { song: "Dust My Broom",         artist: "Elmore James",                 note: "The original Open E electric blues slide riff" },
            { song: "The Sky Is Crying",     artist: "Elmore James / SRV",           note: "Slow blues slide mastery in Open E" },
            { song: "Little Wing (slide)",   artist: "Duane Allman version",         note: "One of the greatest slide performances ever recorded" },
            { song: "Jumpin' Jack Flash",    artist: "Rolling Stones",               note: "Keith used Open E for the main riff" },
          ].map(s => (
            <div key={s.song} className="border-b border-white/10 pb-2">
              <p className="text-white font-semibold">{s.song} <span className="text-purple-400 font-normal">— {s.artist}</span></p>
              <p className="text-purple-300 text-xs">{s.note}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
function SlideTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Slide Guitar</h2>
      <p className="text-purple-200 mb-6">
        A glass or metal slide (bottleneck) placed on a fretting finger, glided along the strings. Open tunings make it approachable — one straight barre plays a full chord anywhere on the neck.
      </p>

      <Card title="Choosing Your Slide">
        <div className="grid sm:grid-cols-3 gap-3 text-sm mb-4">
          {[
            { type: "Glass",       sound: "Warm, smooth, singing",    best: "Blues, acoustic, folk",     eg: "Coricidin bottle (Duane Allman)" },
            { type: "Metal / Steel", sound: "Bright, cutting, aggressive", best: "Electric blues, rock",  eg: "Chrome or steel tube" },
            { type: "Brass",       sound: "Warm but with bite",       best: "All-round versatile",       eg: "Dunlop brass slide" },
          ].map(s => (
            <div key={s.type} className="bg-white/5 border border-white/10 rounded-xl p-3">
              <p className="text-white font-bold">{s.type}</p>
              <p className="text-purple-300 text-xs mt-1">{s.sound}</p>
              <p className="text-amber-400 text-xs mt-1">Best: {s.best}</p>
              <p className="text-slate-400 text-xs mt-1">{s.eg}</p>
            </div>
          ))}
        </div>
        <p className="text-purple-200 text-sm"><strong className="text-white">Which finger?</strong> Ring finger (3rd) — leaves index and middle free for muting behind the slide. Some use pinky. Avoid index — you lose muting capability.</p>
      </Card>

      <Card title="The #1 Rule: Intonation">
        <Callout type="warning">
          The slide must be positioned <strong className="text-white">directly above the fret wire</strong>, not in the space between frets like normal fretting. Play a note and check it with a tuner — if sharp, slide is past the fret; if flat, short of it. This is the entire technique.
        </Callout>
        <TabBlock label="Fret wire position — slide sits OVER the wire, not behind it">
{`Normal fretting:          Slide position:
  Press BEHIND the fret      Slide OVER the fret wire

  | [finger presses]          | [slide hovers directly above]  |
  |                           |                                 |
  ──────────────              ─────────────────────────────────

WRONG (behind fret) → flat pitch
WRONG (past fret)   → sharp pitch
RIGHT (over wire)   → in tune`}
        </TabBlock>
      </Card>

      <Card title="Left Hand: Muting Behind the Slide">
        <p className="text-purple-200 text-sm mb-3">
          The slide activates every string it touches. Fingers behind the slide (between slide and headstock) must rest lightly on strings to stop sympathetic vibration and ringing noise.
        </p>
        <div className="space-y-2 text-sm">
          {[
            { step: "1", text: "Place slide on ring finger — let it rest loosely, parallel to fret wire" },
            { step: "2", text: "Lay index and middle behind the slide — touch strings lightly (no fretting pressure), just enough to damp them" },
            { step: "3", text: "Right hand heel rests on strings near the bridge — adds another layer of noise control" },
            { step: "4", text: "Keep the slide parallel to frets — any angle causes uneven contact across strings" },
          ].map(s => (
            <div key={s.step} className="flex gap-3 border-b border-white/10 pb-2">
              <div className="bg-amber-500 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-black flex-shrink-0">{s.step}</div>
              <p className="text-purple-200">{s.text}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Vibrato — The Slide's Voice">
        <p className="text-purple-200 text-sm mb-3">
          Slide vibrato is a small forward-backward oscillation along the string (toward and away from the nut). Do NOT shake side to side. Good vibrato is what separates expressive playing from robotic note-hitting.
        </p>
        <TabBlock label="Vibrato in Open E — wavy line means keep oscillating over the fret wire">
{`e|--12~~~--10~~~--8~~~--12/14--14~~~--|
B|--12~~~--10~~~--8~~~--12/14--14~~~--|
G#|-12~~~--10~~~--8~~~--12/14--14~~~--|

~~~ = vibrato (oscillate the slide along the string over the fret wire)
/   = slide up into the note from below
Start slowly: small, even oscillations before adding speed`}
        </TabBlock>
      </Card>

      <Callout type="exercise">
        In Open G or Open E, play only the high e string. Place the slide at fret 12. Check intonation with a tuner. Practice vibrato: keep the slide over fret 12 while making small forward-backward motions. Master single-string intonation + vibrato before attempting full chord slides.
      </Callout>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
function PracticeTab() {
  const [open, setOpen] = useState<number | null>(null)

  const groups = [
    {
      tuning: "Open G",
      color: "border-amber-500",
      items: [
        { song: "Honky Tonk Women",   artist: "Rolling Stones",    level: "Beginner",     why: "3 chords, one-finger barre, classic rhythm" },
        { song: "Crossroads",         artist: "Robert Johnson",    level: "Intermediate", why: "Delta blues riff and feel" },
        { song: "Little Martha",      artist: "Allman Brothers",   level: "Intermediate", why: "Fingerstyle melody in Open G" },
      ]
    },
    {
      tuning: "Open D",
      color: "border-blue-400",
      items: [
        { song: "Big Yellow Taxi",    artist: "Joni Mitchell",     level: "Beginner",     why: "Simple open-string fingerpicking" },
        { song: "Death Letter",       artist: "Son House",         level: "Intermediate", why: "Powerful acoustic slide blues" },
        { song: "In My Time of Dying",artist: "Led Zeppelin",      level: "Intermediate", why: "Acoustic slide, hauntingly beautiful" },
      ]
    },
    {
      tuning: "DADGAD",
      color: "border-emerald-400",
      items: [
        { song: "Bron-Y-Aur Stomp",   artist: "Led Zeppelin",      level: "Beginner",     why: "Fun acoustic groove, easy shapes" },
        { song: "She Moved Through the Fair", artist: "Traditional", level: "Beginner",   why: "Beautiful melody, open drone strings" },
        { song: "White Summer",        artist: "Jimmy Page",        level: "Advanced",     why: "DADGAD at its most intricate" },
      ]
    },
    {
      tuning: "Open E",
      color: "border-red-400",
      items: [
        { song: "Dust My Broom",       artist: "Elmore James",      level: "Beginner",     why: "The original slide riff — learn this first" },
        { song: "Statesboro Blues",    artist: "Allman Brothers",   level: "Intermediate", why: "Duane Allman's signature piece" },
        { song: "The Sky Is Crying",   artist: "Elmore James / SRV", level: "Intermediate", why: "Slow blues slide, maximum expression" },
      ]
    },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Practice & Song Reference</h2>
      <p className="text-purple-200 mb-6">Famous songs by tuning and a quick guide to which tuning to start with.</p>

      <Card title="Which Tuning Should I Start With?">
        <div className="space-y-2 text-sm">
          {[
            { goal: "Play blues/rock like the Rolling Stones",      ans: "Open G" },
            { goal: "Learn slide guitar on acoustic",               ans: "Open D" },
            { goal: "Celtic or folk fingerstyle drone sounds",      ans: "DADGAD" },
            { goal: "Play like Duane Allman or Derek Trucks",       ans: "Open E" },
            { goal: "Easiest transition from standard tuning",      ans: "DADGAD (only 3 strings change, all go down)" },
            { goal: "Slide on electric guitar",                     ans: "Open E or Open G" },
            { goal: "Most distinct sound from standard",            ans: "Open D or DADGAD" },
          ].map(r => (
            <div key={r.goal} className="flex gap-3 border-b border-white/10 pb-2">
              <p className="text-purple-300 flex-1">{r.goal}</p>
              <p className="text-amber-400 font-semibold flex-shrink-0">{r.ans}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="space-y-3 mb-6">
        {groups.map((group, i) => (
          <div key={group.tuning} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full p-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
            >
              <p className={`font-bold text-white border-l-4 pl-3 ${group.color}`}>{group.tuning}</p>
              <span className="text-purple-400">{open === i ? "−" : "+"}</span>
            </button>
            {open === i && (
              <div className="px-4 pb-4 border-t border-white/10 pt-3 space-y-2">
                {group.items.map(s => (
                  <div key={s.song} className="flex gap-3 text-sm border-b border-white/5 pb-2">
                    <div className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 h-fit mt-0.5 ${
                      s.level === "Beginner" ? "bg-green-500/20 text-green-400" :
                      s.level === "Intermediate" ? "bg-amber-500/20 text-amber-400" :
                      "bg-red-500/20 text-red-400"
                    }`}>{s.level}</div>
                    <div>
                      <p className="text-white font-semibold">{s.song} <span className="text-purple-400 font-normal">— {s.artist}</span></p>
                      <p className="text-purple-300 text-xs">{s.why}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <Callout type="exercise">
        <p className="font-semibold mb-1">30-Day Open Tuning Challenge:</p>
        Week 1: Tune to Open G daily — learn the 3-chord barre approach, play a 12-bar blues.
        Week 2: Add DADGAD — try fingerpicking open strings, learn one Celtic melody.
        Week 3: Open D slide — single strings only, focus on intonation before chord slides.
        Week 4: Go deep on whichever tuning clicked most.
      </Callout>
    </div>
  )
}

// ─── Fretboard Explorer ───────────────────────────────────────────────────────
function FretboardTab() {
  const CHROM = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']
  const INTERVAL_LABELS = ['R','♭2','2','♭3','3','4','♭5','5','♭6','6','♭7','7']

  const EXPLORER_TUNINGS: Record<string, { semitones: number[]; labels: string[] }> = {
    "Open G": { semitones: [2, 7, 2, 7, 11, 2],  labels: ["D","G","D","G","B","D"] },
    "Open D": { semitones: [2, 9, 2, 6, 9, 2],   labels: ["D","A","D","F#","A","D"] },
    "DADGAD": { semitones: [2, 9, 2, 7, 9, 2],   labels: ["D","A","D","G","A","D"] },
    "Open E": { semitones: [4, 11, 4, 8, 11, 4], labels: ["E","B","E","G#","B","E"] },
  }

  const CHORD_INTERVALS: Record<string, number[]> = {
    "Major":  [0, 4, 7],
    "Minor":  [0, 3, 7],
    "Dom 7":  [0, 4, 7, 10],
    "Maj 7":  [0, 4, 7, 11],
    "Min 7":  [0, 3, 7, 10],
    "Sus2":   [0, 2, 7],
    "Sus4":   [0, 5, 7],
    "Dim":    [0, 3, 6],
  }

  const SCALE_INTERVALS: Record<string, number[]> = {
    "Major":      [0, 2, 4, 5, 7, 9, 11],
    "Minor":      [0, 2, 3, 5, 7, 8, 10],
    "Pent Minor": [0, 3, 5, 7, 10],
    "Pent Major": [0, 2, 4, 7, 9],
    "Blues":      [0, 3, 5, 6, 7, 10],
    "Dorian":     [0, 2, 3, 5, 7, 9, 10],
    "Mixolydian": [0, 2, 4, 5, 7, 9, 10],
  }

  const [tuningName, setTuningName] = useState("Open G")
  const [mode, setMode] = useState<"chords" | "scales">("chords")
  const [rootIdx, setRootIdx] = useState(2)  // D = 2
  const [chordType, setChordType] = useState("Major")
  const [scaleType, setScaleType] = useState("Major")
  const [showIntervals, setShowIntervals] = useState(false)

  // SVG layout constants
  const FW = 40     // fret width
  const SH = 24     // string spacing
  const NX = 55     // nut x position
  const TY = 18     // top string y
  const NF = 12     // number of frets
  const SVG_W = NX + NF * FW + 20
  const SVG_H = TY + 5 * SH + 34

  const tuning = EXPLORER_TUNINGS[tuningName]
  const intervals = mode === "chords" ? CHORD_INTERVALS[chordType] : SCALE_INTERVALS[scaleType]
  const activeNotes = new Set(intervals.map(i => (rootIdx + i) % 12))

  // Display string 0 = high e (tuning index 5), string 5 = low E (tuning index 0)
  const noteAt = (s: number, f: number) => (tuning.semitones[5 - s] + f) % 12
  const dotX   = (f: number) => f === 0 ? NX - 22 : NX + (f - 0.5) * FW
  const dotY   = (s: number) => TY + s * SH

  const dotFill = (note: number) => {
    if (note === rootIdx) return "#f59e0b"
    if (activeNotes.has(note)) return "#a855f7"
    return null
  }
  const dotText = (note: number) =>
    showIntervals ? INTERVAL_LABELS[(note - rootIdx + 12) % 12] : CHROM[note]

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Fretboard Explorer</h2>
      <p className="text-purple-200 text-sm mb-6">
        See chord tones and scale notes across the full fretboard in any open tuning. Toggle between note names and interval numbers.
      </p>

      {/* Controls row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-purple-400 text-xs mb-1.5">Tuning</p>
          <div className="flex flex-wrap gap-1.5">
            {Object.keys(EXPLORER_TUNINGS).map(t => (
              <button key={t} onClick={() => setTuningName(t)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  tuningName === t ? "bg-amber-500 text-black" : "bg-white/10 text-purple-300 hover:bg-white/20"
                }`}>{t}</button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-purple-400 text-xs mb-1.5">Mode</p>
          <div className="flex gap-1.5">
            {(["chords", "scales"] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                  mode === m ? "bg-purple-600 text-white" : "bg-white/10 text-purple-300 hover:bg-white/20"
                }`}>{m}</button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-purple-400 text-xs mb-1.5">Labels</p>
          <div className="flex gap-1.5">
            {(["Notes", "Intervals"] as const).map(l => (
              <button key={l} onClick={() => setShowIntervals(l === "Intervals")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  (l === "Intervals") === showIntervals ? "bg-blue-600 text-white" : "bg-white/10 text-purple-300 hover:bg-white/20"
                }`}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Root note */}
      <div className="mb-4">
        <p className="text-purple-400 text-xs mb-1.5">Root Note</p>
        <div className="flex flex-wrap gap-1.5">
          {CHROM.map((note, i) => (
            <button key={i} onClick={() => setRootIdx(i)}
              className={`w-10 py-1 rounded-lg text-xs font-bold transition-all ${
                rootIdx === i ? "bg-amber-500 text-black" : "bg-white/10 text-purple-300 hover:bg-white/20"
              }`}>{note}</button>
          ))}
        </div>
      </div>

      {/* Chord / Scale type */}
      <div className="mb-5">
        <p className="text-purple-400 text-xs mb-1.5">{mode === "chords" ? "Chord Type" : "Scale Type"}</p>
        <div className="flex flex-wrap gap-1.5">
          {Object.keys(mode === "chords" ? CHORD_INTERVALS : SCALE_INTERVALS).map(t => (
            <button key={t}
              onClick={() => mode === "chords" ? setChordType(t) : setScaleType(t)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                (mode === "chords" ? chordType : scaleType) === t
                  ? "bg-purple-600 text-white"
                  : "bg-white/10 text-purple-300 hover:bg-white/20"
              }`}>{t}</button>
          ))}
        </div>
      </div>

      {/* Heading */}
      <div className="text-center mb-3">
        <span className="text-white font-bold text-xl">{CHROM[rootIdx]} {mode === "chords" ? chordType : scaleType}</span>
        <span className="text-purple-400 text-sm ml-2">in {tuningName}</span>
      </div>

      {/* SVG Fretboard */}
      <div className="overflow-x-auto bg-black/40 rounded-xl p-3 mb-4">
        <svg width={SVG_W} height={SVG_H} xmlns="http://www.w3.org/2000/svg">
          {/* Fret lines */}
          {Array.from({ length: NF + 1 }, (_, f) => (
            <line key={`fret-${f}`}
              x1={NX + f * FW} y1={TY - 8}
              x2={NX + f * FW} y2={TY + 5 * SH + 8}
              stroke={f === 0 ? "#e2e8f0" : "#4b5563"}
              strokeWidth={f === 0 ? 3 : 1}
            />
          ))}

          {/* String lines (thicker towards bottom = lower strings) */}
          {Array.from({ length: 6 }, (_, s) => (
            <line key={`str-${s}`}
              x1={NX - 25} y1={TY + s * SH}
              x2={NX + NF * FW + 15} y2={TY + s * SH}
              stroke="#6b7280"
              strokeWidth={0.75 + s * 0.35}
            />
          ))}

          {/* Single position markers: 3, 5, 7, 9 */}
          {[3, 5, 7, 9].map(f => (
            <circle key={`pm-${f}`}
              cx={NX + (f - 0.5) * FW} cy={TY + 2.5 * SH}
              r={3.5} fill="#374151"
            />
          ))}

          {/* Double position marker: fret 12 */}
          {[1.5, 3.5].map((offset, i) => (
            <circle key={`pm12-${i}`}
              cx={NX + (12 - 0.5) * FW} cy={TY + offset * SH}
              r={3.5} fill="#374151"
            />
          ))}

          {/* String labels (open string note names in this tuning) */}
          {Array.from({ length: 6 }, (_, s) => (
            <text key={`sl-${s}`}
              x={NX - 28} y={TY + s * SH + 4}
              textAnchor="end" fontSize="10" fill="#a78bfa" fontFamily="monospace"
            >{tuning.labels[5 - s]}</text>
          ))}

          {/* Fret numbers */}
          {Array.from({ length: NF }, (_, f) => (
            <text key={`fn-${f}`}
              x={NX + (f + 0.5) * FW} y={TY + 5 * SH + 20}
              textAnchor="middle" fontSize="9" fill="#6b7280"
            >{f + 1}</text>
          ))}

          {/* Note dots */}
          {Array.from({ length: 6 }, (_, s) =>
            Array.from({ length: NF + 1 }, (_, f) => {
              const note = noteAt(s, f)
              const fill = dotFill(note)
              if (!fill) return null
              const cx = dotX(f)
              const cy = dotY(s)
              const label = dotText(note)
              return (
                <g key={`d-${s}-${f}`}>
                  <circle cx={cx} cy={cy} r={9} fill={fill} opacity={0.92} />
                  <text
                    x={cx} y={cy + 4}
                    textAnchor="middle"
                    fontSize={label.length > 2 ? "6" : "8"}
                    fill={fill === "#f59e0b" ? "#000" : "#fff"}
                    fontFamily="monospace" fontWeight="bold"
                  >{label}</text>
                </g>
              )
            })
          )}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex gap-6 justify-center mb-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-amber-500" />
          <span className="text-purple-300 text-xs">Root ({CHROM[rootIdx]})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-purple-500" />
          <span className="text-purple-300 text-xs">{mode === "chords" ? "Chord" : "Scale"} tones</span>
        </div>
      </div>

      {/* Notes summary */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <h4 className="text-white font-semibold mb-3">
          {CHROM[rootIdx]} {mode === "chords" ? chordType : scaleType} — note breakdown
        </h4>
        <div className="flex flex-wrap gap-2">
          {intervals.map((semis, idx) => {
            const note = (rootIdx + semis) % 12
            return (
              <div key={idx} className={`px-3 py-1.5 rounded-lg text-sm font-bold ${
                idx === 0 ? "bg-amber-500 text-black" : "bg-purple-500/30 text-purple-200"
              }`}>
                {CHROM[note]}
                <span className="font-normal opacity-70 ml-1 text-xs">{INTERVAL_LABELS[semis]}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function OpenTuningsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("what-why")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link href="/" className="text-purple-300 hover:text-white text-sm">← Back to modules</Link>
        </div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Open Tunings</h1>
          <p className="text-purple-200">Retune your guitar to unlock sounds, chord voicings, and slide techniques impossible in standard tuning.</p>
        </div>
        <div className="flex flex-wrap gap-2 mb-8">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === t.id ? "bg-purple-600 text-white" : "bg-white/10 text-purple-300 hover:bg-white/20"
              }`}>{t.label}</button>
          ))}
        </div>
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
          {activeTab === "what-why"  && <WhatWhyTab />}
          {activeTab === "open-g"    && <OpenGTab />}
          {activeTab === "open-d"    && <OpenDTab />}
          {activeTab === "dadgad"    && <DADGADTab />}
          {activeTab === "open-e"    && <OpenETab />}
          {activeTab === "slide"     && <SlideTab />}
          {activeTab === "practice"  && <PracticeTab />}
          {activeTab === "fretboard" && <FretboardTab />}
        </div>
      </div>
    </div>
  )
}
