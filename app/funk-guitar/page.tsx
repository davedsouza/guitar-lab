"use client"

import React, { useState } from "react"
import Link from "next/link"
import ChordDiagram from "@/components/ChordDiagram"

type Tab = "mindset" | "muting" | "16th-grooves" | "patterns" | "voicings" | "wah-tone" | "practice"

const TABS: { id: Tab; label: string }[] = [
  { id: "mindset",     label: "The Mindset" },
  { id: "muting",      label: "Muting" },
  { id: "16th-grooves", label: "16th Note Grooves" },
  { id: "patterns",    label: "Classic Patterns" },
  { id: "voicings",    label: "Funk Voicings" },
  { id: "wah-tone",    label: "Wah & Tone" },
  { id: "practice",    label: "Practice" },
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

// ─────────────────────────────────────────────────────────────────────────────
function MindsetTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">The Funk Mindset</h2>
      <p className="text-purple-200 mb-6">
        Funk guitar is not about notes. It&apos;s about <strong className="text-white">rhythm, groove, and pocket</strong>.
        The best funk guitarists often play the fewest notes — what they play with those notes is everything.
      </p>

      <Callout type="insight">
        James Brown&apos;s guitar player was Phelps &quot;Catfish&quot; Collins. His job was not to solo, not to play melodies —
        it was to <strong className="text-white">lock into the groove and not leave it</strong>.
        Funk guitar is a rhythm instrument first, last, and always.
      </Callout>

      <Card title="The Three Pillars of Funk Guitar">
        <div className="space-y-4">
          {[
            {
              num: "1",
              title: "The Pocket",
              body: "Playing exactly in the groove — not rushing, not dragging. The guitar locks with the bass and kick drum so tightly that it becomes part of the rhythm section, not a melodic instrument on top of it.",
              color: "bg-amber-500"
            },
            {
              num: "2",
              title: "The Space",
              body: "What you DON'T play is as important as what you do. Funk guitar breathes. Short, punchy chord stabs separated by rhythmic silence — the silence IS the groove.",
              color: "bg-purple-600"
            },
            {
              num: "3",
              title: "The Scratch",
              body: "Dead notes — muted strings strummed rhythmically. They add percussive texture without pitch. The scratch is the heartbeat of funk guitar.",
              color: "bg-green-600"
            },
          ].map(p => (
            <div key={p.num} className="flex gap-4">
              <div className={`${p.color} w-10 h-10 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 text-lg`}>{p.num}</div>
              <div>
                <p className="text-white font-bold mb-1">{p.title}</p>
                <p className="text-purple-200 text-sm">{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Funk vs Other Styles — The Key Differences">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[400px]">
            <thead>
              <tr className="text-purple-400 border-b border-white/10 text-xs">
                <th className="pb-2 text-left">Element</th>
                <th className="pb-2 text-left">Rock/Pop</th>
                <th className="pb-2 text-left">Funk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-xs">
              {[
                { el: "Rhythm grid", other: "Quarter and eighth notes dominate", funk: "16th notes — everything subdivided" },
                { el: "Chord duration", other: "Hold chords for full bars", funk: "Short stabs — release immediately" },
                { el: "Dead notes", other: "Avoid — accidental muting = mistake", funk: "Essential — percussive texture" },
                { el: "The accent", other: "Beat 1 and 3 (backbeat on 2 and 4)", funk: "Syncopated — on the 'e' and 'a' of beats" },
                { el: "Volume/dynamics", other: "Relatively consistent", funk: "Massive dynamic range — silence to stab" },
                { el: "Guitar role", other: "Lead or rhythm — often leading", funk: "Rhythm section member — lockstep with bass" },
              ].map(r => (
                <tr key={r.el}>
                  <td className="py-2 text-white font-semibold">{r.el}</td>
                  <td className="py-2 text-slate-400">{r.other}</td>
                  <td className="py-2 text-amber-300">{r.funk}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="The Legends — Learn From These Players">
        <div className="space-y-2 text-sm">
          {[
            { name: "Nile Rodgers",  band: "Chic",                  style: "Clean, percussive, melodic — the most musical funk guitarist", rec: "Good Times, Le Freak" },
            { name: "Jimmy Nolen",   band: "James Brown",            style: "The originator — staccato chicken scratch, pure rhythm machine", rec: "Sex Machine, Funky Drummer" },
            { name: "Ernie Isley",   band: "Isley Brothers",         style: "Jimi Hendrix influence meets deep funk groove", rec: "That Lady, Fight the Power" },
            { name: "Eddie Hazel",   band: "Parliament-Funkadelic",  style: "Psychedelic funk — more lead but rooted in groove", rec: "Maggot Brain, One Nation" },
            { name: "Prince",        band: "Solo",                   style: "Everything — rhythmic genius with soul and pop sensibility", rec: "Kiss, Sign o' the Times" },
          ].map(p => (
            <div key={p.name} className="border-b border-white/10 pb-2">
              <div className="flex items-start gap-2">
                <p className="text-white font-bold w-28 flex-shrink-0">{p.name}</p>
                <div>
                  <p className="text-amber-400 text-xs">{p.band}</p>
                  <p className="text-purple-300 text-xs mt-0.5">{p.style}</p>
                  <p className="text-slate-400 text-xs mt-0.5">Listen: {p.rec}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Callout type="exercise">
        Before you play a single note: find &quot;Good Times&quot; by Chic on streaming. Listen to the guitar only.
        Notice how short each chord stab is. Notice the dead-note scratches between stabs.
        Notice that the guitar never leads — it sits perfectly inside the groove.
        That&apos;s your target sound. Now open the Muting tab.
      </Callout>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
function MutingTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Muting — The Foundation of Funk</h2>
      <p className="text-purple-200 mb-6">
        Muting is not an absence of technique. In funk, it IS the technique.
        You need two kinds: <strong className="text-white">left hand muting</strong> (dead notes) and <strong className="text-white">right hand muting</strong> (palm mute / staccato release).
      </p>

      <Card title="Left Hand: Dead Notes (Ghost Notes)">
        <p className="text-purple-200 text-sm mb-4">
          Touch the strings lightly with your fretting fingers — enough to stop them ringing freely but not enough to fret a clear pitch. Strum these and you get a percussive &quot;chk&quot; sound with no definite pitch. This is the chicken scratch.
        </p>
        <div className="space-y-3 text-sm">
          {[
            { step: "1", text: "Form any chord shape (e.g., an E9 chord)" },
            { step: "2", text: "Slightly relax your fretting hand so fingers touch strings but don't press to the fretboard" },
            { step: "3", text: "Strum — you should hear a percussive 'chk' with no pitch" },
            { step: "4", text: "Alternate: fret the chord properly (ring) → relax (dead) → fret (ring) → relax (dead)" },
          ].map(s => (
            <div key={s.step} className="flex gap-3">
              <div className="bg-amber-500 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-black flex-shrink-0">{s.step}</div>
              <p className="text-purple-200 mt-0.5">{s.text}</p>
            </div>
          ))}
        </div>
        <TabBlock label="Dead note notation — X marks a dead/ghost note">
{`Dead notes written as X:
e|--X--X--7--X--X--7--X--X--|
B|--X--X--7--X--X--7--X--X--|
G|--X--X--7--X--X--7--X--X--|
D|--X--X--7--X--X--7--X--X--|  ← D9 chord at fret 7
A|--X--X--5--X--X--5--X--X--|
E|--X--X--X--X--X--X--X--X--|  (not played)

X = dead note (no pitch, just percussion)`}
        </TabBlock>
      </Card>

      <Card title="Right Hand: Staccato Release">
        <p className="text-purple-200 text-sm mb-4">
          In funk, you rarely hold a chord for its full written duration. You strike it and immediately release — right hand lifts slightly, left hand relaxes. The chord is cut short to create a punchy, percussive feel.
        </p>
        <TabBlock label="Staccato chord stabs — play and immediately release">
{`Standard strum (hold chord):    Funk stab (release immediately):
e|--7-------7-------7-------    e|--7·-------7·-------7·-----
B|--7-------7-------7-------    B|--7·-------7·-------7·-----
G|--7-------7-------7-------    G|--7·-------7·-------7·-----
D|--7-------7-------7-------    D|--7·-------7·-------7·-----

· = staccato — chop the note short as soon as you play it
The chord duration might be just 1/16th of a beat — a sharp snap`}
        </TabBlock>
      </Card>

      <Card title="Combining Both: The Chicken Scratch">
        <p className="text-purple-200 text-sm mb-3">
          The classic funk &quot;chicken scratch&quot; is an alternating pattern of fretted chord stabs and dead-note scratches. Both hands work together:
        </p>
        <TabBlock label="Basic chicken scratch pattern (E9 area, 4/4 time)">
{`Count:  1  e  +  a  2  e  +  a  3  e  +  a  4  e  +  a
Strum:  ↓  ↑  ↓  ↑  ↓  ↑  ↓  ↑  ↓  ↑  ↓  ↑  ↓  ↑  ↓  ↑
Sound:  X  X  ♩  X  X  X  ♩  X  X  X  ♩  X  X  X  ♩  X

♩ = fretted chord (press down and immediately release)
X = dead note scratch (relax hand, don't press)
The strumming HAND never stops — 16 constant strokes per bar`}
        </TabBlock>
        <Callout type="insight">
          The key to funk muting is that your strumming hand never stops. It keeps a constant 16th-note down-up motion throughout the bar. Your <strong className="text-white">fretting hand controls what sounds</strong> — press = note, relax = scratch. The rhythm hand just keeps going.
        </Callout>
      </Card>

      <Card title="Muting Exercise Progression">
        <div className="space-y-3 text-sm">
          {[
            { week: "Day 1–3", task: "Dead note only — strum all dead notes on one chord shape for 4 bars at 60 BPM. Perfect the 'chk' sound." },
            { week: "Day 4–6", task: "Add one fretted note per bar: X X X ♩ | X X X ♩. Feel the contrast between dead and live." },
            { week: "Day 7–10", task: "2 fretted + 2 dead alternating: ♩ X ♩ X | ♩ X ♩ X at 60 BPM. Build to 80 BPM." },
            { week: "Day 11–14", task: "Full 16th note chicken scratch with mixed pattern. Lock with a metronome. Push to 90–100 BPM." },
          ].map(r => (
            <div key={r.week} className="border-b border-white/10 pb-2">
              <p className="text-amber-400 font-semibold text-xs">{r.week}</p>
              <p className="text-purple-200">{r.task}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
function SixteenthTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">16th Note Grooves</h2>
      <p className="text-purple-200 mb-6">
        Funk lives in the 16th note grid. Every beat is divided into 4 sub-pulses: <strong className="text-white">1 e + a</strong>.
        Your strumming hand runs this grid constantly — your fretting hand selects which sub-pulses sound.
      </p>

      <Card title="The 16th Note Grid — Know It Cold">
        <TabBlock label="One bar of 4/4 — 16 subdivisions">
{`Beat:      1           2           3           4
Sub:     1  e  +  a  2  e  +  a  3  e  +  a  4  e  +  a
Strum:   ↓  ↑  ↓  ↑  ↓  ↑  ↓  ↑  ↓  ↑  ↓  ↑  ↓  ↑  ↓  ↑
Count:   1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16

Say out loud: "1-ee-and-ah  2-ee-and-ah  3-ee-and-ah  4-ee-and-ah"
Down strum on number positions (1,3,5,7,9,11,13,15)
Up strum on letter positions (e,+,a)`}
        </TabBlock>

        <Callout type="tip">
          Practice saying &quot;1 e + a 2 e + a 3 e + a 4 e + a&quot; out loud while keeping constant 16th note strums with a DEAD chord. No pitch yet — just get the hand moving at the right speed. This is the most important foundational exercise in funk guitar.
        </Callout>
      </Card>

      <Card title="Groove Pattern 1 — On the Beat">
        <TabBlock label="Basic groove: chord hits on every downbeat (1, 2, 3, 4)">
{`Count:  1  e  +  a  2  e  +  a  3  e  +  a  4  e  +  a
Strum:  ↓  ↑  ↓  ↑  ↓  ↑  ↓  ↑  ↓  ↑  ↓  ↑  ↓  ↑  ↓  ↑
Sound:  ♩  X  X  X  ♩  X  X  X  ♩  X  X  X  ♩  X  X  X

e|--7--X--X--X--7--X--X--X--7--X--X--X--7--X--X--X--|
B|--7--X--X--X--7--X--X--X--7--X--X--X--7--X--X--X--|
G|--7--X--X--X--7--X--X--X--7--X--X--X--7--X--X--X--|  ← E9 chord
D|--7--X--X--X--7--X--X--X--7--X--X--X--7--X--X--X--|

Start here at 60 BPM — boring is fine, accuracy is everything`}
        </TabBlock>
      </Card>

      <Card title="Groove Pattern 2 — The Upbeat Stab">
        <TabBlock label="Funk's signature: chord hits on the '+' (the and)">
{`Count:  1  e  +  a  2  e  +  a  3  e  +  a  4  e  +  a
Sound:  X  X  ♩  X  X  X  ♩  X  X  X  ♩  X  X  X  ♩  X

The chord hits on the upstroke ('+') of each beat.
This creates that bouncing, anticipating quality that drives funk.

e|--X--X--7--X--X--X--7--X--X--X--7--X--X--X--7--X--|
B|--X--X--7--X--X--X--7--X--X--X--7--X--X--X--7--X--|
G|--X--X--7--X--X--X--7--X--X--X--7--X--X--X--7--X--|
D|--X--X--7--X--X--X--7--X--X--X--7--X--X--X--7--X--|`}
        </TabBlock>
      </Card>

      <Card title="Groove Pattern 3 — The Classic Funk Syncopation">
        <TabBlock label="Syncopated hits on 'e' of beat 2 and 'a' of beat 3">
{`Count:  1  e  +  a  2  e  +  a  3  e  +  a  4  e  +  a
Sound:  ♩  X  X  X  X  ♩  X  X  X  X  X  ♩  ♩  X  X  X

This is the groove from hundreds of classic funk songs.
The 'e' of 2 hits early, the 'a' of 3 hits late — that syncopation = funk.

e|--7--X--X--X--X--7--X--X--X--X--X--7--7--X--X--X--|
B|--7--X--X--X--X--7--X--X--X--X--X--7--7--X--X--X--|
G|--7--X--X--X--X--7--X--X--X--X--X--7--7--X--X--X--|
D|--7--X--X--X--X--7--X--X--X--X--X--7--7--X--X--X--|`}
        </TabBlock>
      </Card>

      <Callout type="exercise">
        Build these three patterns in order over two weeks. Use a metronome at 65 BPM. Pattern 1: one week. Pattern 2: three days. Pattern 3: one week. Record yourself and compare to actual funk recordings — your ear will tell you when the groove is right.
      </Callout>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
function PatternsTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Classic Funk Patterns</h2>
      <p className="text-purple-200 mb-6">
        Five iconic patterns from the funk canon. Learn each one, then analyse the rhythmic logic behind it.
      </p>

      <Card title="Pattern 1 — The James Brown Stab (E9 position)">
        <p className="text-purple-200 text-sm mb-3">
          James Brown&apos;s band defined funk rhythm guitar. Short, sharp stabs — hit it and let it go. Everything is in the attack and the silence after.
        </p>
        <TabBlock label="JB-style — hit on beat 1 and the 'a' of beat 3">
{`E9 chord position (no open strings for control):
   1  e  +  a  2  e  +  a  3  e  +  a  4  e  +  a
   ♩  X  X  X  X  X  X  X  X  X  X  ♩  X  X  X  X

e|--7--X--X--X--X--X--X--X--X--X--X--7--X--X--X--X--|
B|--7--X--X--X--X--X--X--X--X--X--X--7--X--X--X--X--|
G|--7--X--X--X--X--X--X--X--X--X--X--7--X--X--X--X--|  ← E9 chord
D|--9--X--X--X--X--X--X--X--X--X--X--9--X--X--X--X--|
A|--7--X--X--X--X--X--X--X--X--X--X--7--X--X--X--X--|

The two stabs per bar create space. The groove lives in the gap between them.`}
        </TabBlock>
      </Card>

      <Card title="Pattern 2 — Nile Rodgers / Chic Style">
        <p className="text-purple-200 text-sm mb-3">
          Nile Rodgers&apos; genius was making funk grooves melodic and musical. His patterns often outline a chord progression while keeping the rhythmic drive. Clean, precise, with inner-voice movement.
        </p>
        <TabBlock label="Chic-style groove in Am — notice the inner voice movement">
{`   1  e  +  a  2  e  +  a  3  e  +  a  4  e  +  a
   ♩  X  ♩  X  X  ♩  X  X  ♩  X  ♩  X  X  ♩  X  X

e|--5--X--5--X--X--5--X--X--5--X--5--X--X--5--X--X--|
B|--5--X--5--X--X--5--X--X--5--X--5--X--X--5--X--X--|
G|--5--X--5--X--X--5--X--X--5--X--5--X--X--5--X--X--|
D|--5--X--5--X--X--5--X--X--5--X--5--X--X--5--X--X--|

Listen to "Good Times" and "Le Freak" — this rhythmic density with clean tone
is his entire signature.`}
        </TabBlock>
      </Card>

      <Card title="Pattern 3 — Prince-Style Sparse Groove">
        <p className="text-purple-200 text-sm mb-3">
          Prince often stripped funk down to its essence — fewer notes, more space, maximum attitude. Single-string lines mixed with chord stabs.
        </p>
        <TabBlock label="Prince-style minimalist groove in E">
{`Single note + chord stab approach:
   1  e  +  a  2  e  +  a  3  e  +  a  4  e  +  a

e|--X--X--9--X--X--X--X--X--9--X--7--X--X--X--9--X--|
B|--X--X--9--X--X--X--X--X--9--X--7--X--X--X--9--X--|
G|--X--X--9--X--X--X--X--X--9--X--7--X--X--X--9--X--|
D|--X--X--7--X--X--X--X--X--7--X--5--X--X--X--7--X--|
(Chord on '+'s only — maximum space between hits)

The emptiness IS the groove. Trust the silence.`}
        </TabBlock>
      </Card>

      <Card title="Pattern 4 — Parliament / Funkadelic Groove">
        <p className="text-purple-200 text-sm mb-3">
          P-Funk grooves are heavier, more psychedelic. The guitar plays deeper in the pocket, often doubling bass lines or locking with the keyboard.
        </p>
        <TabBlock label="P-Funk groove — heavier, lock with the bass">
{`Low chord position for weight (A9 shape):
   1  e  +  a  2  e  +  a  3  e  +  a  4  e  +  a
   ♩  X  X  ♩  X  X  ♩  X  ♩  X  X  ♩  X  X  ♩  X

e|--5--X--X--5--X--X--5--X--5--X--X--5--X--X--5--X--|
B|--5--X--X--5--X--X--5--X--5--X--X--5--X--X--5--X--|
G|--6--X--X--6--X--X--6--X--6--X--X--6--X--X--6--X--|  ← A9
D|--5--X--X--5--X--X--5--X--5--X--X--5--X--X--5--X--|
A|--5--X--X--5--X--X--5--X--5--X--X--5--X--X--5--X--|`}
        </TabBlock>
      </Card>

      <Card title="Pattern 5 — Two-Chord Funk Vamp">
        <p className="text-purple-200 text-sm mb-3">
          Many classic funk songs are one or two chords for the entire song. The harmony is simple — the groove is everything.
        </p>
        <TabBlock label="Classic two-chord funk vamp — E9 to A9">
{`E9 (2 bars):                     A9 (2 bars):
   1  e  +  a  2  e  +  a            1  e  +  a  2  e  +  a
   ♩  X  ♩  X  X  X  ♩  X            ♩  X  ♩  X  X  X  ♩  X

e|--7--X--7--X--X--X--7--X--|  e|--5--X--5--X--X--X--5--X--|
B|--7--X--7--X--X--X--7--X--|  B|--5--X--5--X--X--X--5--X--|
G|--7--X--7--X--X--X--7--X--|  G|--6--X--6--X--X--X--6--X--|
D|--7--X--7--X--X--X--7--X--|  D|--5--X--5--X--X--X--5--X--|
A|--7--X--7--X--X--X--7--X--|  A|--5--X--5--X--X--X--5--X--|

E9 = I chord, A9 = IV chord. One pattern, two positions. That's funk.`}
        </TabBlock>
      </Card>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
function VoicingsTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Funk Chord Voicings</h2>
      <p className="text-purple-200 mb-6">
        Funk doesn&apos;t use plain major or minor triads. It lives in <strong className="text-white">dominant 7th, 9th, and 13th chords</strong> — and it uses only the top 4 strings for punch and clarity.
      </p>

      <Callout type="insight">
        The low strings are muddy when chopped percussively. Funk guitarists play <strong className="text-white">on the top 4 or 5 strings</strong>, leaving the bass frequencies to the bass guitar. This creates clarity in the mix and sharpens the attack.
      </Callout>

      <Card title="The Core Funk Chord: Dominant 9th">
        <p className="text-purple-200 text-sm mb-4">
          The dominant 9th chord is the quintessential funk voicing. Rich, slightly tense, never fully at rest — perfect for groove-based music.
        </p>
        <div className="flex gap-4 flex-wrap justify-center mb-3">
          <ChordDiagram chordName="E9" fingers={['x', 7, 7, 7, 7, 7]} size="small" />
          <ChordDiagram chordName="A9" fingers={['x', 5, 5, 6, 5, 5]} size="small" />
          <ChordDiagram chordName="B9" fingers={['x', 7, 7, 8, 7, 7]} size="small" />
        </div>
        <TabBlock label="E9 and A9 — the two most important funk chords">
{`E9 (fret 7):          A9 (fret 5):          B9 (fret 7, A shape):
e|--7--|                e|--5--|                e|--7--|
B|--7--|                B|--5--|                B|--7--|
G|--7--|  ← 9th         G|--6--|  ← 9th         G|--7--|  ← 9th
D|--7--|                D|--5--|                D|--7--|
A|--7--|                A|--5--|                A|--7--|
E|--X--|  (don't play)  E|--X--|                E|--X--|

Barre fret 7 across strings 5-1 = E9.
Barre fret 5 across strings 5-1 = A9.
The root is on the A string (5th).`}
        </TabBlock>
      </Card>

      <Card title="Top-4 String Voicings">
        <p className="text-purple-200 text-sm mb-3">
          The cleanest funk sound uses only the top 4 strings. These voicings chop crisp without mud.
        </p>
        <div className="flex gap-4 flex-wrap justify-center mb-3">
          <ChordDiagram chordName="E7#9" fingers={['x', 'x', 7, 6, 5, 6]} size="small" />
          <ChordDiagram chordName="Dom7" fingers={['x', 'x', 5, 4, 5, 5]} size="small" />
          <ChordDiagram chordName="Min7" fingers={['x', 'x', 5, 5, 4, 5]} size="small" />
        </div>
        <TabBlock label="High-string funk voicings (strings 1–4 only)">
{`E7#9 ("Hendrix chord") top 4:   Dominant 7th top 4:   Minor 7th top 4:
e|--6--|                          e|--5--|                e|--5--|
B|--5--|                          B|--5--|                B|--4--|
G|--6--|                          G|--4--|                G|--5--|
D|--7--|                          D|--5--|                D|--5--|
A|--X--|                          A|--X--|                A|--X--|
E|--X--|                          E|--X--|                E|--X--|

These compact shapes move quickly across the neck for fast chord changes.`}
        </TabBlock>
      </Card>

      <Card title="The Funk Chord Vocabulary">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[420px]">
            <thead>
              <tr className="text-purple-400 border-b border-white/10 text-xs">
                <th className="pb-2 text-left">Chord Type</th>
                <th className="pb-2 text-left">Character</th>
                <th className="pb-2 text-left">Use</th>
                <th className="pb-2 text-left">Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-xs">
              {[
                { type: "Dominant 9 (E9, A9)", char: "Rich, groovy, tense", use: "Main groove chord — the funk workhorse", eg: "Sex Machine, Good Times" },
                { type: "Dominant 7 (E7, A7)", char: "Bluesy, raw", use: "Blues-funk, rougher feel", eg: "Give It Up or Turnit a Loose" },
                { type: "Minor 7 (Em7, Am7)",  char: "Smooth, soulful", use: "Smooth funk, soul, R&B", eg: "What Is Hip, many Isley Brothers" },
                { type: "13th (A13)",           char: "Jazz-funk, sophisticated", use: "When you want the jazziest colour", eg: "Chic extended progressions" },
                { type: "Sus2 / Sus4",          char: "Open, unresolved", use: "Breakdown sections, space", eg: "Prince atmospheric sections" },
              ].map(r => (
                <tr key={r.type}>
                  <td className="py-2 text-amber-400 font-semibold">{r.type}</td>
                  <td className="py-2 text-white">{r.char}</td>
                  <td className="py-2 text-purple-300">{r.use}</td>
                  <td className="py-2 text-slate-400">{r.eg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Moving the Same Shape — Instant Funk Progressions">
        <p className="text-purple-200 text-sm mb-3">
          Funk guitar often uses one chord shape moved to different frets. No new fingering — just shift positions.
        </p>
        <TabBlock label="E9 shape: I–IV–V funk progression in E">
{`E9 (I):       A9 (IV):      B9 (V):
e|--7--|       e|--5--|       e|--7--|
B|--7--|  →    B|--5--|  →    B|--7--|
G|--7--|       G|--6--|       G|--8--|
D|--7--|       D|--5--|       D|--7--|
A|--7--|       A|--5--|       A|--7--|

All the same shape (9th chord). Just move it.
Fret 7 (A string) = E9
Fret 5 (A string) = A9
Fret 7 (E string) = B9`}
        </TabBlock>
      </Card>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
function WahToneTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Wah Pedal & Funk Tone</h2>
      <p className="text-purple-200 mb-6">
        The wah pedal is the voice of funk guitar. Combined with the right amp and guitar tone, it transforms a clean chord stab into something vocal and expressive.
      </p>

      <Card title="The Wah Pedal — How to Use It for Funk">
        <p className="text-purple-200 text-sm mb-4">
          The wah is a bandpass filter on a rocker pedal. Heel down = low/dark. Toe down = high/bright.
          In funk, you don&apos;t sweep it smoothly like a solo — you use it in <strong className="text-white">rhythmic sync with the groove</strong>.
        </p>
        <div className="space-y-3 text-sm">
          {[
            {
              technique: "Downbeat wah",
              desc: "Heel down on beats 1 and 3, toe down on the chord stab. The wah opens as you hit the chord.",
              feel: "Classic Shaft / Isaac Hayes sound"
            },
            {
              technique: "Rhythmic sweep",
              desc: "Rock the pedal in 16th note rhythm — heel on dead notes, toe on chord hits. The pedal moves with the strumming.",
              feel: "Nile Rodgers / Chic approach"
            },
            {
              technique: "Parked wah",
              desc: "Toe pedal stopped at a specific point (often mid-position or toe-down). Creates a permanently filtered, nasal tone.",
              feel: "Isaac Hayes, Curtis Mayfield — the 'talking' guitar"
            },
            {
              technique: "Auto-wah (envelope filter)",
              desc: "Pedal tracks your pick attack automatically — louder attack = wah opens more. Gives wah-like expression without foot movement.",
              feel: "Bootsy Collins-influenced, modern funk"
            },
          ].map(t => (
            <div key={t.technique} className="border-b border-white/10 pb-3">
              <p className="text-white font-semibold">{t.technique}</p>
              <p className="text-purple-300 text-xs mt-0.5">{t.desc}</p>
              <p className="text-amber-400 text-xs mt-0.5">Sound: {t.feel}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Ideal Funk Guitar Tone">
        <div className="space-y-3 text-sm">
          <div className="bg-white/5 rounded-xl p-4">
            <p className="text-white font-semibold mb-2">Guitar</p>
            <p className="text-purple-300 text-xs">Single coil pickups (Stratocaster, Telecaster) are preferred — brighter, more percussive attack, cuts through the mix. Neck or middle pickup for warmth. The bridge pickup for aggressive funk.</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <p className="text-white font-semibold mb-2">Amp</p>
            <p className="text-purple-300 text-xs">Clean is king. No distortion — funk clarity needs a pristine amp tone. High headroom amps (Fender Twin, Roland JC-120) are classics. Maybe a touch of compression to even out the attack.</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <p className="text-white font-semibold mb-2">EQ</p>
            <p className="text-purple-300 text-xs">Scoop the low-mids (300-600Hz) to make room for the bass guitar. Boost upper-mids (2-4kHz) for attack and articulation. The chord stabs need to cut on the attack, not on the sustain.</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <p className="text-white font-semibold mb-2">Essential pedals (in signal order)</p>
            <p className="text-purple-300 text-xs">Tuner → Compressor → Wah (or auto-wah) → Clean amp. Keep it minimal. The technique does the work — gear just reinforces it.</p>
          </div>
        </div>
      </Card>

      <Card title="Classic Funk Guitar Tones — Who to Study">
        <div className="space-y-2 text-sm">
          {[
            { player: "Nile Rodgers",  guitar: "Hitmaker Strat (70s Telecaster)",    tone: "Ultra-clean Fender, heavy compression, no wah" },
            { player: "Jimmy Nolen",   guitar: "Gibson ES-335 / ES-175",             tone: "Clean jazz amp, parked wah, short staccato" },
            { player: "Prince",        guitar: "Custom Cloud Guitar / Telecaster",   tone: "Clean to slightly pushed, wah in rhythmic bursts" },
            { player: "Bootsy Collins", guitar: "Space Bass (he's the bassist!)",   tone: "Listen anyway — he defines the pocket guitar must lock to" },
          ].map(p => (
            <div key={p.player} className="border-b border-white/10 pb-2">
              <p className="text-white font-semibold">{p.player}</p>
              <p className="text-purple-400 text-xs">{p.guitar}</p>
              <p className="text-purple-300 text-xs mt-0.5">{p.tone}</p>
            </div>
          ))}
        </div>
      </Card>

      <Callout type="tip">
        You don&apos;t need a wah pedal to play great funk. Nile Rodgers rarely used wah. Start with a clean tone and focus entirely on the right and left hand technique. Add wah later as a colour — never as a substitute for groove.
      </Callout>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
function FunkPracticeTab() {
  const [open, setOpen] = useState<number | null>(null)

  const sessions = [
    {
      title: "Session 1 — Dead Note Foundation",
      bpm: "60 BPM",
      goal: "Perfect the chicken scratch — no pitch, just rhythm",
      steps: [
        "Set metronome to 60 BPM.",
        "Form an E9 chord shape at fret 7 but don't press — all dead notes.",
        "Strum constant 16th notes for 4 full bars. Count '1 e + a' out loud.",
        "On every beat 1, press the chord briefly. Everything else dead.",
        "Repeat until the contrast between dead and live sounds sharp and clean.",
        "Goal: zero accidentally ringing notes during dead strokes.",
      ]
    },
    {
      title: "Session 2 — Staccato Control",
      bpm: "65 BPM",
      goal: "Make chord hits short and punchy",
      steps: [
        "Play the E9 chord. Hit it cleanly. Immediately release both hands.",
        "The chord should last no more than 1/16th of a beat — a sharp snap.",
        "Try Pattern 1 from the Classic Patterns tab (JB-style).",
        "Record yourself. Listen back. Is the chord cutting short immediately? Are dead notes clean?",
        "Build to Pattern 2. Aim for crisp, even rhythm.",
      ]
    },
    {
      title: "Session 3 — Two Chords, Full Groove",
      bpm: "75 BPM",
      goal: "Groove on E9 → A9 transition with no loss of pocket",
      steps: [
        "Play 4 bars of E9 groove (Pattern 3 from the tab).",
        "Switch to A9 (same shape, fret 5 on A string) for 4 bars.",
        "The switch must not interrupt the constant 16th note strumming.",
        "Your hand keeps moving even when fingers are repositioning.",
        "Record 2 minutes of this loop. Listen — does the groove maintain through chord changes?",
      ]
    },
    {
      title: "Session 4 — Wah Integration",
      bpm: "70 BPM",
      goal: "Add wah pedal without losing pocket",
      steps: [
        "Set wah to heel-down position (dark/low).",
        "Play your groove. On chord hits, rock toward toe-down. On dead notes, heel-down.",
        "The wah rhythm mirrors the strumming rhythm — open on hits, close on scratches.",
        "Warning: adding wah often causes players to rush. Watch the metronome.",
        "Play 4 bars with wah, 4 bars without. The groove must be identical.",
      ]
    },
    {
      title: "Session 5 — Play Along Session",
      bpm: "Match the song",
      goal: "Lock into a real funk track",
      steps: [
        "Find 'Sex Machine' by James Brown. Mute the track's guitar (or don't — play alongside).",
        "Try to lock your groove with the drums and bass.",
        "Then try 'Good Times' by Chic — notice how different the feel is (tighter, more even).",
        "Finally: 'Kiss' by Prince — much sparser, trust the space.",
        "If you can sit comfortably inside all three grooves, you have the foundation of funk guitar.",
      ]
    },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Practice Sessions</h2>
      <p className="text-purple-200 mb-6">Five focused sessions to build from zero to functional funk groove.</p>

      <Callout type="insight">
        The entire skill of funk guitar can be summarised: <strong className="text-white">keep the 16th note grid moving, control what sounds with both hands, leave space</strong>.
        These five sessions build each layer. Do them in order.
      </Callout>

      <div className="space-y-3 mb-6">
        {sessions.map((s, i) => (
          <div key={i} className="bg-white/10 border border-white/20 rounded-xl overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="bg-amber-500 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-black flex-shrink-0">{i + 1}</div>
                <div>
                  <p className="text-white font-semibold">{s.title}</p>
                  <p className="text-purple-300 text-xs">{s.goal} · {s.bpm}</p>
                </div>
              </div>
              <span className="text-purple-400 text-xl flex-shrink-0">{open === i ? "−" : "+"}</span>
            </button>
            {open === i && (
              <div className="px-5 pb-5 border-t border-white/10 pt-4">
                <ol className="space-y-2">
                  {s.steps.map((step, si) => (
                    <li key={si} className="flex gap-3 text-sm text-purple-200">
                      <span className="text-amber-500 font-mono text-xs mt-0.5 flex-shrink-0">{si + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        ))}
      </div>

      <Card title="Essential Listening — Study These Records">
        <div className="space-y-2 text-sm">
          {[
            { track: "Sex Machine",                  artist: "James Brown",            why: "The foundational funk guitar sound — staccato, rhythmic, pure" },
            { track: "Good Times",                   artist: "Chic",                   why: "Nile Rodgers at his most musical — funk as melodic composition" },
            { track: "Le Freak",                     artist: "Chic",                   why: "Study the hi-hat and guitar rhythmic interplay" },
            { track: "That Lady",                    artist: "Isley Brothers",          why: "Ernie Isley — Hendrix influence meets deep pocket funk" },
            { track: "Kiss",                         artist: "Prince",                 why: "Masterclass in restraint — space is the groove" },
            { track: "Cissy Strut",                  artist: "The Meters",             why: "New Orleans funk — the most infectious groove ever recorded" },
            { track: "What Is Hip",                  artist: "Tower of Power",         why: "Tight, precise West Coast funk — guitar in the pocket" },
            { track: "Maggot Brain",                 artist: "Parliament-Funkadelic",  why: "Eddie Hazel solo intro — proof funk guitar can also sing" },
          ].map(t => (
            <div key={t.track} className="border-b border-white/10 pb-2">
              <p className="text-white font-semibold">{t.track} <span className="text-purple-400 font-normal">— {t.artist}</span></p>
              <p className="text-purple-300 text-xs">{t.why}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function FunkGuitarPage() {
  const [activeTab, setActiveTab] = useState<Tab>("mindset")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link href="/" className="text-purple-300 hover:text-white text-sm">← Back to modules</Link>
        </div>
        <div className="mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">Funk Guitar</h1>
          <p className="text-purple-200">Rhythm, pocket, and the chicken scratch. Master the groove-based technique that powers soul, R&B, and funk.</p>
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
          {activeTab === "mindset"      && <MindsetTab />}
          {activeTab === "muting"       && <MutingTab />}
          {activeTab === "16th-grooves" && <SixteenthTab />}
          {activeTab === "patterns"     && <PatternsTab />}
          {activeTab === "voicings"     && <VoicingsTab />}
          {activeTab === "wah-tone"     && <WahToneTab />}
          {activeTab === "practice"     && <FunkPracticeTab />}
        </div>
      </div>
    </div>
  )
}
