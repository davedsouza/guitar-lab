"use client"

import React, { useState } from "react"
import Link from "next/link"

// ─── Types ────────────────────────────────────────────────────────────────────

type CalloutType = "tip" | "warning" | "insight" | "exercise"

// ─── Callout Component ────────────────────────────────────────────────────────

function Callout({ type, children }: { type: CalloutType; children: React.ReactNode }) {
  const styles: Record<CalloutType, { border: string; bg: string; label: string; labelColor: string; textColor: string }> = {
    tip:      { border: "border-purple-500", bg: "bg-purple-500/10", label: "TIP",      labelColor: "text-purple-300", textColor: "text-purple-200" },
    warning:  { border: "border-amber-500",  bg: "bg-amber-500/10",  label: "NOTE",     labelColor: "text-amber-300",  textColor: "text-amber-200"  },
    insight:  { border: "border-blue-500",   bg: "bg-blue-500/10",   label: "INSIGHT",  labelColor: "text-blue-300",   textColor: "text-blue-200"   },
    exercise: { border: "border-green-500",  bg: "bg-green-500/10",  label: "EXERCISE", labelColor: "text-green-300",  textColor: "text-green-200"  },
  }
  const s = styles[type]
  return (
    <div className={`border-l-4 ${s.border} ${s.bg} rounded-r-xl p-4 my-4`}>
      <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${s.labelColor}`}>{s.label}</div>
      <div className={`text-sm leading-relaxed ${s.textColor}`}>{children}</div>
    </div>
  )
}

// ─── Card Component ───────────────────────────────────────────────────────────

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white/5 border border-white/10 rounded-2xl p-5 mb-4 ${className}`}>
      {children}
    </div>
  )
}

// ─── TAB Block Component ──────────────────────────────────────────────────────

function TabBlock({ label, children }: { label?: string; children: string }) {
  return (
    <div className="mb-4">
      {label && <div className="text-purple-400 text-xs font-semibold uppercase tracking-wider mb-1">{label}</div>}
      <pre className="font-mono text-green-300 bg-black/40 rounded-xl p-4 text-xs leading-relaxed overflow-x-auto whitespace-pre">
        {children}
      </pre>
    </div>
  )
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

const TABS = [
  "What Are Inversions",
  "Triad Inversions",
  "7th Chord Inversions",
  "Voice Leading",
  "Drop Voicings",
  "Practical Applications",
  "Practice",
]

// ─── Tab Content ──────────────────────────────────────────────────────────────

function TabWhatAreInversions() {
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">What Are Inversions?</h2>
      <p className="text-purple-200 text-sm leading-relaxed mb-4">
        A chord is a group of notes. Normally the root (the note the chord is named after) sits at the
        bottom. An inversion simply means you've moved a different note to the bottom — the chord stays
        the same, but the colour, weight, and smoothness changes completely.
      </p>

      <Card>
        <h3 className="text-white font-bold mb-3">The Four Positions</h3>
        <div className="space-y-3 text-sm">
          <div className="flex gap-3 items-start">
            <div className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded shrink-0 mt-0.5">Root</div>
            <div>
              <div className="text-white font-semibold">Root Position — root in bass</div>
              <div className="text-purple-300">C major: C–E–G (C on the bottom). The most stable, grounded sound.</div>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <div className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded shrink-0 mt-0.5">1st</div>
            <div>
              <div className="text-white font-semibold">1st Inversion — 3rd in bass</div>
              <div className="text-purple-300">C major: E–G–C (E on the bottom). Lighter, less resolved. Written C/E.</div>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <div className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded shrink-0 mt-0.5">2nd</div>
            <div>
              <div className="text-white font-semibold">2nd Inversion — 5th in bass</div>
              <div className="text-purple-300">C major: G–C–E (G on the bottom). Creates tension, wants to move. Written C/G.</div>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <div className="bg-amber-600 text-white text-xs font-bold px-2 py-1 rounded shrink-0 mt-0.5">3rd</div>
            <div>
              <div className="text-white font-semibold">3rd Inversion — 7th in bass (7th chords only)</div>
              <div className="text-purple-300">Cmaj7: B–C–E–G (B on the bottom). Very unstable, wants to resolve urgently. Written Cmaj7/B.</div>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-white font-bold mb-3">Slash Chord Notation</h3>
        <p className="text-purple-200 text-sm mb-3">
          When you see a chord written like <span className="text-white font-mono">C/E</span>, read it
          as "C chord with E in the bass." The letter before the slash is the chord; the letter after
          is the bass note.
        </p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {[
            { name: "C/E",    meaning: "C major, 1st inversion" },
            { name: "C/G",    meaning: "C major, 2nd inversion" },
            { name: "G/B",    meaning: "G major, 1st inversion" },
            { name: "Am/E",   meaning: "Am, 1st inversion" },
            { name: "D/F#",   meaning: "D major, 1st inversion" },
            { name: "Cmaj7/B",meaning: "Cmaj7, 3rd inversion" },
          ].map(item => (
            <div key={item.name} className="bg-black/20 rounded-lg p-2">
              <div className="text-white font-mono font-bold">{item.name}</div>
              <div className="text-purple-400 text-xs">{item.meaning}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="text-white font-bold mb-3">Visual — C Major in Three Positions</h3>
        <p className="text-purple-300 text-xs mb-3">Same three notes, different bottom note:</p>
        <div className="grid grid-cols-3 gap-3 text-center text-xs">
          {[
            { label: "Root Position", notes: ["G", "E", "C"], bass: "C", color: "bg-purple-600" },
            { label: "1st Inversion", notes: ["C", "G", "E"], bass: "E", color: "bg-blue-600" },
            { label: "2nd Inversion", notes: ["E", "C", "G"], bass: "G", color: "bg-green-600" },
          ].map(pos => (
            <div key={pos.label}>
              <div className="text-purple-300 mb-2 font-semibold">{pos.label}</div>
              <div className="space-y-1">
                {pos.notes.map((n, i) => (
                  <div key={i} className={`${i === 2 ? pos.color : "bg-white/10"} rounded px-2 py-1.5 text-white font-mono font-bold`}>
                    {n}
                  </div>
                ))}
              </div>
              <div className="text-purple-400 mt-1">bass: {pos.bass}</div>
            </div>
          ))}
        </div>
      </Card>

      <Callout type="insight">
        Why does this matter? Every inversion of the same chord has a different emotional weight.
        Root position is solid and final. 1st inversion is lighter and melodic. 2nd inversion
        creates tension and movement. Choosing the right inversion is how you shape the feel of
        a progression — not just the harmony.
      </Callout>
    </div>
  )
}

function TabTriadInversions() {
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">Triad Inversions on Guitar</h2>
      <p className="text-purple-200 text-sm leading-relaxed mb-4">
        On guitar, triad inversions are best played on three adjacent strings. Each string set gives
        you a different tonal colour — the higher the strings, the brighter and more chime-like the
        inversion sounds.
      </p>

      <h3 className="text-white font-bold mb-3">C Major — Strings 1-2-3 (e B G)</h3>
      <TabBlock label="Root position — C on bottom (G string)">
{`e  |---0---|   (E)
B  |---1---|   (C)
G  |---0---|   (G)  ← bass note (C is actually the C on fret 5 of G... use this voicing as presented)

Tip: on strings 1-2-3, root pos is often played:
e  |---0---|   (E)
B  |---1---|   (C)
G  |---0---|   (G)    → C/G sound, but brightest voicing`}
      </TabBlock>

      <TabBlock label="Root position — C major triad (proper root pos, G–B–e)">
{`e  |---0---|   (E = 5th)
B  |---1---|   (C = root)
G  |---0---|   (G = 5th)

Strum only strings 1-2-3`}
      </TabBlock>

      <TabBlock label="1st inversion — E in bass (C/E)">
{`e  |---1---|   (F... use this shape)
B  |---1---|   (C)
G  |---2---|   (E)  ← E in bass

Shape: G string fret 2, B string fret 1, e string fret 1`}
      </TabBlock>

      <TabBlock label="2nd inversion — G in bass (C/G)">
{`e  |---3---|   (G = bass note on top... wrap-around)
B  |---1---|   (C)
G  |---0---|   (G)  ← G in bass

Shape: G string open, B string fret 1, e string fret 3`}
      </TabBlock>

      <Callout type="tip">
        These three shapes repeat as you move up the neck. Learn them on strings 1-2-3, then shift
        the same principle to strings 2-3-4 and 3-4-5 for a darker tone.
      </Callout>

      <h3 className="text-white font-bold mb-3 mt-6">G Major — All Three Inversions (strings 1-2-3)</h3>
      <TabBlock label="G major triads — root, 1st, 2nd inversion">
{`Root position:
e  |---3---|   (G)
B  |---3---|   (G... use: B fret 0 = B... actually:)
e  |---3---|
B  |---0---|
G  |---0---|   → G major, root pos (G B D... wait — use practical shape)

Practical root position (G major triad, strings 1-2-3):
e  |---3---|   (G)
B  |---3---|   (G)
G  |---4---|   (B)

1st inversion (B in bass):
e  |---3---|   (G)
B  |---0---|   (B)  ← B in bass
G  |---0---|   (G)

2nd inversion (D in bass):
e  |---3---|   (G)
B  |---3---|   (G... )
G  |---2---|   (D)  ← D in bass`}
      </TabBlock>

      <h3 className="text-white font-bold mb-3 mt-2">A minor — All Three Inversions (strings 1-2-3)</h3>
      <TabBlock label="Am triads — root, 1st, 2nd inversion">
{`Root position (A in bass — use string 4 as bass reference):
e  |---0---|   (E = 5th)
B  |---1---|   (C = b3rd)
G  |---2---|   (A = root)  ← A in bass on G string

1st inversion (C in bass):
e  |---1---|   (F... )
B  |---1---|   (C)  ← C in bass
G  |---0---|   (G = 5th... use: fret 2 for A, but C in bass = 1st inv)

1st inversion (practical):
e  |---0---|   (E)
B  |---1---|   (C)  ← C in bass on B string
G  |---2---|   (A)

2nd inversion (E in bass):
e  |---0---|   (E)  ← E in bass (top string, but lowest pitch in voicing)
B  |---1---|   (C)
G  |---2---|   (A)

Note: on top 3 strings the "bass" is the G string — work inversions
across string sets (D G B, A D G) to hear bass note move lower.`}
      </TabBlock>

      <Callout type="exercise">
        Play C major root position on strings 1-2-3, then 1st inversion, then 2nd inversion — all
        without lifting your hand far from the same fret area. Notice how smoothly they connect.
        Now do the same for G major and Am. This is the foundation of voice leading.
      </Callout>
    </div>
  )
}

function TabSeventhChordInversions() {
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">7th Chord Inversions</h2>
      <p className="text-purple-200 text-sm leading-relaxed mb-4">
        7th chords have four notes, so they have four positions: root, 1st, 2nd, and 3rd inversion.
        Each inversion has a different degree of tension and movement — a crucial tool in jazz and
        sophisticated pop arranging.
      </p>

      <h3 className="text-white font-bold mb-3">Cmaj7 — All Four Inversions</h3>
      <TabBlock label="Cmaj7: root, 1st, 2nd, 3rd inversion">
{`Root position (C in bass) — Cmaj7:
e  |---0---|   (E)
B  |---0---|   (C... fret 1 = C)
G  |---0---|   (G)
D  |---2---|   (E)
A  |---3---|   (C)  ← root
E  |---x---|

1st inversion (E in bass) — Cmaj7/E:
e  |---0---|   (E)
B  |---0---|   (C... fret 1 = C)
G  |---0---|   (G)
D  |---2---|   (E)  ← 3rd in bass
A  |---x---|
E  |---0---|   (E)  ← bass

2nd inversion (G in bass) — Cmaj7/G:
e  |---0---|
B  |---1---|   (C)
G  |---0---|   (G... open)
D  |---0---|   (D... wait — use fret 2 = E)
A  |---x---|
E  |---3---|   (G)  ← 5th in bass

3rd inversion (B in bass) — Cmaj7/B:
e  |---0---|   (E)
B  |---0---|   (B open)  ← 7th in bass
G  |---0---|   (G)
D  |---2---|   (E)
A  |---x---|
E  |---x---|`}
      </TabBlock>

      <h3 className="text-white font-bold mb-3 mt-2">G7 — Dominant 7th Inversions</h3>
      <TabBlock label="G7: root, 1st, 2nd, 3rd inversion">
{`Root position — G7:
e  |---1---|   (F = b7th)
B  |---0---|   (B = 3rd)
G  |---0---|   (G = root)
D  |---0---|   (D = 5th)
A  |---2---|   (B)
E  |---3---|   (G)  ← root bass

1st inversion (B in bass) — G7/B:
e  |---1---|   (F)
B  |---0---|   (B)
G  |---0---|   (G)
D  |---0---|   (D)
A  |---2---|   (B)  ← 3rd in bass

2nd inversion (D in bass) — G7/D:
e  |---1---|   (F)
B  |---0---|   (B)
G  |---0---|   (G)
D  |---0---|   (D)  ← 5th in bass
A  |---x---|
E  |---x---|

3rd inversion (F in bass) — G7/F:
e  |---1---|   (F)
B  |---0---|   (B)
G  |---0---|   (G)
D  |---x---|
A  |---x---|
E  |---1---|   (F)  ← b7th in bass`}
      </TabBlock>

      <h3 className="text-white font-bold mb-3 mt-2">Drop 2 Concept</h3>
      <Card>
        <h4 className="text-white font-semibold mb-2">What is a Drop 2 voicing?</h4>
        <p className="text-purple-200 text-sm mb-3">
          Take any four-note chord in close position (notes as close together as possible). Find the
          second highest note. Drop it down an octave. The result is a <strong className="text-white">Drop 2</strong> voicing
          — spread across a wider range, fits the guitar perfectly, and sounds richer and more open.
        </p>
        <div className="bg-black/20 rounded-lg p-3 text-xs text-purple-300 font-mono mb-3">
          Close Cmaj7: C – E – G – B<br/>
          2nd highest = G<br/>
          Drop G down an octave: G – C – E – B (Drop 2)
        </div>
      </Card>

      <TabBlock label="Drop 2 voicings — Cmaj7, G7, Dm7 (strings 1-2-3-4)">
{`Drop 2 Cmaj7 (strings 1-2-3-4):
e  |---0---|   (E)
B  |---0---|   (... fret 1 = C on B string... use: B fret 0 = B)

Practical Drop 2 Cmaj7:
e  |---0---|   (E = 3rd)
B  |---5---|   (E... use: B fret 5 = E)
G  |---4---|   (B = maj7th)
D  |---5---|   (G = 5th)
   Drop 2 root pos Cmaj7 at 5th pos

Drop 2 G7 (moveable, root on string 4):
e  |---3---|   (G)
B  |---4---|   (F... fret 6 = Bb... use fret 3 = D... )
G  |---3---|   (Bb... fret 4 = B)
D  |---5---|   (G)  ← root

Drop 2 Dm7:
e  |---1---|   (F = b3rd... fret 1 on e = F)
B  |---3---|   (D = root)
G  |---2---|   (A = 5th)
D  |---0---|   (D = root)  ← or use: D open for root pos`}
      </TabBlock>

      <Callout type="insight">
        Drop 2 voicings are the bread and butter of jazz guitar. They sit perfectly under the fingers
        on four adjacent strings, and every chord in a progression can be connected smoothly by moving
        one or two fingers at a time.
      </Callout>
    </div>
  )
}

function TabVoiceLeading() {
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">Voice Leading</h2>
      <p className="text-purple-200 text-sm leading-relaxed mb-4">
        Voice leading is the art of connecting chords so that each individual note (voice) moves as
        smoothly and logically as possible. Good voice leading is the difference between a chord
        progression that sounds mechanical and one that sounds inevitable.
      </p>

      <Card>
        <h3 className="text-white font-bold mb-3">The Three Golden Rules</h3>
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="bg-purple-600 text-white font-bold text-sm w-7 h-7 rounded-full flex items-center justify-center shrink-0">1</div>
            <div>
              <div className="text-white font-semibold text-sm">Keep common tones</div>
              <div className="text-purple-300 text-xs">If a note appears in both chords, hold it in the same voice. It acts as an anchor.</div>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="bg-purple-600 text-white font-bold text-sm w-7 h-7 rounded-full flex items-center justify-center shrink-0">2</div>
            <div>
              <div className="text-white font-semibold text-sm">Move by step when possible</div>
              <div className="text-purple-300 text-xs">Move each voice by a semitone or tone rather than a leap. Stepwise motion sounds smooth and singable.</div>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="bg-purple-600 text-white font-bold text-sm w-7 h-7 rounded-full flex items-center justify-center shrink-0">3</div>
            <div>
              <div className="text-white font-semibold text-sm">Avoid parallel 5ths</div>
              <div className="text-purple-300 text-xs">Two voices moving in the same direction by a 5th sounds hollow and muddy. Classical voice leading avoids this; it can be used deliberately for effect.</div>
            </div>
          </div>
        </div>
      </Card>

      <h3 className="text-white font-bold mb-3">C — F — G — C with Smooth Voice Leading</h3>
      <TabBlock label="Minimal movement — each voice moves by step or stays put">
{`C major (root pos):        F major (1st inv, C/F):     G major (2nd inv, G/D):
e  |---0---| (E)       →   e  |---1---| (F)  +1 step   e  |---3---| (G)  +2 steps
B  |---1---| (C)       →   B  |---1---| (C)  HOLD       B  |---1---| (D... B stays)
G  |---0---| (G)       →   G  |---2---| (A)  +2 steps   G  |---0---| (G)  HOLD
D  |---2---| (E bass)  →   D  |---3---| (F)  +1 step    D  |---0---| (D)  -3 steps

Return to C — voices resolve back stepwise`}
      </TabBlock>

      <h3 className="text-white font-bold mb-3 mt-2">Bad vs Good Voice Leading</h3>
      <TabBlock label="BAD — voices leap around, no smooth connection">
{`C major open chord:       G major open chord:
e  |---0---|              e  |---3---|   (leap of 3)
B  |---1---|              B  |---3---|   (leap of 2)
G  |---0---|              G  |---0---|   (ok)
D  |---2---|              D  |---0---|   (leap of 2)
A  |---3---|              A  |---2---|   (leap of 1... better)
E  |---x---|              E  |---3---|   (leap of 3)

Total movement: large, disjointed — each string jumps independently`}
      </TabBlock>

      <TabBlock label="GOOD — inversions used to minimise movement">
{`C major (root pos):       G/B (1st inversion):
e  |---0---| (E)       →   e  |---3---| (G)   move 3
B  |---1---| (C)       →   B  |---0---| (B)   move 1 step down
G  |---0---| (G)       →   G  |---0---| (G)   HOLD
D  |---2---| (E)       →   D  |---0---| (D)   move 2 steps down
A  |---3---| (C bass)  →   A  |---2---| (B)   move 1 step down

Total movement: minimal — sounds connected and musical`}
      </TabBlock>

      <h3 className="text-white font-bold mb-3 mt-2">ii–V–I with Smooth Voice Leading (Dm7–G7–Cmaj7)</h3>
      <TabBlock label="Jazz ii-V-I — each chord resolves stepwise into the next">
{`Dm7 (root pos):           G7 (1st inv, G7/B):        Cmaj7 (root pos):
e  |---1---| (F)       →   e  |---1---| (F)  HOLD    → e  |---0---| (E)  -1 step
B  |---1---| (C)       →   B  |---0---| (B)  -1 step → B  |---0---| (B... fret 1=C) HOLD
G  |---2---| (A)       →   G  |---0---| (G)  -2 step → G  |---0---| (G)  HOLD
D  |---0---| (D)       →   D  |---0---| (D)  HOLD    → D  |---2---| (E)  +2 steps
A  |---x---|           →   A  |---2---| (B)           → A  |---3---| (C)  +1 step`}
      </TabBlock>

      <Callout type="insight">
        Voice leading is why jazz sounds smooth — every note has somewhere logical to go. When you
        listen to a great jazz guitarist like Joe Pass or Wes Montgomery, what you're hearing isn't
        just good chords — it's the elegant movement between them. Each voice has a purpose and a
        destination.
      </Callout>
    </div>
  )
}

function TabDropVoicings() {
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">Drop Voicings</h2>
      <p className="text-purple-200 text-sm leading-relaxed mb-4">
        Drop voicings are the guitarist's solution to the problem of four-note chords. Close-position
        7th chords span an octave and a half — too wide for a single hand. By dropping one voice an
        octave, you get playable shapes that still contain all four notes.
      </p>

      <Card>
        <h3 className="text-white font-bold mb-2">Drop 2 — The Essential One</h3>
        <p className="text-purple-200 text-sm mb-2">
          Take a chord in close position. Number the voices from top (1) to bottom (4). Drop voice
          number 2 (the second from the top) down an octave. That's Drop 2. It's the most commonly
          used voicing in jazz guitar because it sits naturally under four fingers on four strings.
        </p>
        <div className="bg-black/20 rounded p-3 font-mono text-xs text-green-300">
          {"Close Cmaj7:  B  G  E  C  (top→bottom)"}
          {"\nVoice #2 = G"}
          {"\nDrop G oct:  B  E  C  G  (Drop 2 result)"}
          {"\nOn guitar:   strings 1-2-3-4 = B E C G"}
        </div>
      </Card>

      <h3 className="text-white font-bold mb-3 mt-2">Drop 2 — Complete Chord Set in C</h3>
      <TabBlock label="Cmaj7 Drop 2 — strings 1-2-3-4 (positions up the neck)">
{`Cmaj7 Drop 2 (root position, 7th fret area):
e  |---7---| (B = maj7)
B  |---8---| (E = 3rd... fret 5 = E, use 8 for higher)
G  |---9---| (... adjust: G string fret 9 = D#... )

Practical Cmaj7 Drop 2 voicings (moveable):
Strings 1-2-3-4:
e  |---0---|   B = maj7th
B  |---1---|   C = root (fret 1)
G  |---0---|   G = 5th (open)
D  |---2---|   E = 3rd

Or at 5th position:
e  |---5---|
B  |---5---|
G  |---4---|
D  |---5---|`}
      </TabBlock>

      <TabBlock label="Dm7 Drop 2 — root position">
{`Dm7 Drop 2 (strings 1-2-3-4):
e  |---1---| (F = b3rd)
B  |---3---| (D = root)
G  |---2---| (A = 5th)
D  |---0---| (D = root / C = b7th... open D for Dm7 root pos)

At 5th position:
e  |---6---| (... fret 6 on e = A#/Bb... adjust)
B  |---6---| (D = root... fret 3 = D on B)
G  |---5---| (A = 5th)
D  |---5---| (G = b7th... or: use Dm7 moveable shape)`}
      </TabBlock>

      <TabBlock label="Em7, Fmaj7, G7, Am7 — Drop 2 reference shapes (open/low pos)">
{`Em7 Drop 2:
e  |---0---| (E = root)
B  |---3---| (G = b3rd)
G  |---0---| (G = b3rd... open)
D  |---2---| (B = 5th... fret 2 = E, use: D string fret 0 = D = b7th)

Fmaj7 Drop 2:
e  |---0---| (E = maj7th)
B  |---1---| (F = root... fret 1)
G  |---2---| (A = 3rd)
D  |---3---| (C = 5th)

G7 Drop 2:
e  |---1---| (F = b7th)
B  |---3---| (G = root... fret 3 = D... use B fret 0 = B = 3rd)
G  |---0---| (G = root... open G = root of G7)
D  |---0---| (D = 5th)

Am7 Drop 2:
e  |---0---| (E = 5th)
B  |---1---| (C = b3rd)
G  |---0---| (G = b7th... open)
D  |---2---| (E = 5th... or A string fret 0 = A root)`}
      </TabBlock>

      <h3 className="text-white font-bold mb-3 mt-2">Drop 3 — Briefly</h3>
      <Card>
        <p className="text-purple-200 text-sm">
          Drop 3 takes the third voice from the top and drops it an octave. This creates a wider
          spread — typically across 5 strings, with a string skipped. Less common than Drop 2 on
          guitar, but useful for very open, widely-voiced chords. The gap between strings creates
          a natural "hole" in the voicing that sounds airy and rich.
        </p>
      </Card>

      <h3 className="text-white font-bold mb-3">ii–V–I Using Drop 2 (Dm7–G7–Cmaj7)</h3>
      <TabBlock label="ii-V-I with Drop 2 voicings — move up the neck">
{`Dm7 Drop 2        G7 Drop 2         Cmaj7 Drop 2
(strings 1-2-3-4) (strings 1-2-3-4) (strings 1-2-3-4)

e  |---5---|      e  |---3---|       e  |---0---|
B  |---6---|      B  |---3---|       B  |---1---|
G  |---5---|      G  |---4---|       G  |---0---|
D  |---5---|      D  |---5---|       D  |---2---|

Voice movement:
  e: 5 → 3 → 0    (smooth descending)
  B: 6 → 3 → 1    (smooth descending)
  G: 5 → 4 → 0    (smooth descending)
  D: 5 → 5 → 2    (holds then drops)`}
      </TabBlock>

      <Callout type="exercise">
        Play the ii–V–I above slowly, one chord at a time. Watch how little each finger needs to
        move. Now try it at 60 BPM with a metronome. This is the core of jazz comping — keeping
        your hand in one area of the neck while the harmony changes beneath you.
      </Callout>
    </div>
  )
}

function TabPracticalApplications() {
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">Practical Applications</h2>
      <p className="text-purple-200 text-sm leading-relaxed mb-4">
        Inversions aren't just theory — they're some of the most practical tools in real-world
        guitar playing. Here are the techniques that come up again and again in actual songs.
      </p>

      <h3 className="text-white font-bold mb-3">I–IV–V with Moving Bass (G → G/B → C)</h3>
      <TabBlock label="Smooth bassline using 1st inversion of G">
{`G major         G/B (1st inv)    C major
e  |---3---|    e  |---3---|     e  |---0---|
B  |---3---|    B  |---0---|     B  |---1---|
G  |---0---|    G  |---0---|     G  |---0---|
D  |---0---|    D  |---0---|     D  |---2---|
A  |---2---|    A  |---2---|     A  |---3---|
E  |---3---|    E  |---x---|     E  |---x---|
bass: G         bass: B          bass: C

Bass notes: G → B → C (stepwise ascent — smooth as butter)`}
      </TabBlock>

      <TabBlock label="G → G/B → C → D/F# — complete progression">
{`G               G/B              C               D/F#
e  |---3---|    e  |---3---|     e  |---0---|    e  |---2---|
B  |---3---|    B  |---0---|     B  |---1---|    B  |---3---|
G  |---0---|    G  |---0---|     G  |---0---|    G  |---2---|
D  |---0---|    D  |---0---|     D  |---2---|    D  |---0---|
A  |---2---|    A  |---2---|     A  |---3---|    A  |---x---|
E  |---3---|    E  |---x---|     E  |---x---|    E  |---2---|
bass: G         bass: B          bass: C         bass: F#

Ascending bass line: G – B – C – F# (wide but memorable)`}
      </TabBlock>

      <h3 className="text-white font-bold mb-3 mt-2">Descending Bassline (Beatles / Folk Style)</h3>
      <TabBlock label="C → C/B → Am → Am/G → F — stepwise descent">
{`C              C/B              Am              Am/G            F
e  |---0---|   e  |---0---|    e  |---0---|    e  |---0---|    e  |---1---|
B  |---1---|   B  |---1---|    B  |---1---|    B  |---1---|    B  |---1---|
G  |---0---|   G  |---0---|    G  |---2---|    G  |---2---|    G  |---2---|
D  |---2---|   D  |---2---|    D  |---2---|    D  |---2---|    D  |---3---|
A  |---3---|   A  |---x---|    A  |---0---|    A  |---x---|    A  |---3---|
E  |---x---|   E  |---2---|    E  |---x---|    E  |---3---|    E  |---1---|
bass: C        bass: B         bass: A         bass: G         bass: F

Bass: C – B – A – G – F  (descending scale, one note per chord)`}
      </TabBlock>

      <h3 className="text-white font-bold mb-3 mt-2">Pedal Tone</h3>
      <Card>
        <p className="text-purple-200 text-sm">
          A pedal tone keeps one constant note (usually the open low E or A string) ringing while
          the chords above it change. It creates tension as the harmony moves against the static bass.
          Think of the intro to "Wish You Were Here" or Led Zeppelin's "The Rain Song."
        </p>
      </Card>
      <TabBlock label="Open E pedal tone — chords shift while E drones below">
{`Em          Dsus2/E      Cadd9/E      Asus2/E
e  |---0---| e  |---0---|  e  |---0---|  e  |---0---|
B  |---0---| B  |---3---|  B  |---3---|  B  |---2---|
G  |---0---| G  |---2---|  G  |---0---|  G  |---2---|
D  |---2---| D  |---0---|  D  |---2---|  D  |---2---|
A  |---2---| A  |---x---|  A  |---3---|  A  |---0---|
E  |---0---| E  |---0---|  E  |---0---|  E  |---0---|
              ↑             ↑             ↑
         E pedal held throughout — creates movement over stability`}
      </TabBlock>

      <h3 className="text-white font-bold mb-3 mt-2">Jazz Turnaround</h3>
      <TabBlock label="Cmaj7 → Em7/B → A7/C# → Dm7 → G7">
{`Cmaj7          Em7/B           A7/C#           Dm7            G7
e  |---0---|   e  |---0---|    e  |---0---|    e  |---1---|   e  |---1---|
B  |---0---|   B  |---0---|    B  |---2---|    B  |---1---|   B  |---0---|
G  |---0---|   G  |---0---|    G  |---0---|    G  |---2---|   G  |---0---|
D  |---2---|   D  |---2---|    D  |---2---|    D  |---0---|   D  |---0---|
A  |---3---|   A  |---x---|    A  |---4---|    A  |---x---|   A  |---2---|
E  |---x---|   E  |---7---|    E  |---x---|    E  |---x---|   E  |---3---|
bass: C        bass: B         bass: C#        bass: D        bass: G

Bass: C – B – C# – D – G (chromatic approach into the V chord — very jazz)`}
      </TabBlock>

      <Callout type="insight">
        The power of inversions in real songs is in the bass movement. When the bass moves
        stepwise — up or down — it creates a sense of narrative and motion that chord-to-chord
        root jumps can't achieve. This is the "something special" you hear in songs by the Beatles,
        Burt Bacharach, and any good jazz composer.
      </Callout>
    </div>
  )
}

function TabPractice() {
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">Practice Exercises</h2>
      <p className="text-purple-200 text-sm leading-relaxed mb-4">
        Work through these four exercises in order. Spend at least one week on each before moving to
        the next. Use a metronome — start slow (50–60 BPM) and only increase tempo when every chord
        change is clean and confident.
      </p>

      <Card>
        <h3 className="text-white font-bold mb-2">Exercise 1 — C Major Triad Through All Inversions</h3>
        <p className="text-purple-300 text-xs mb-3">
          Play each inversion on all three string sets. Listen to how the same chord changes colour.
        </p>
      </Card>
      <TabBlock label="C major — all inversions, strings 1-2-3 then 2-3-4 then 3-4-5">
{`STRINGS 1-2-3 (e B G):
Root pos:       1st inv (C/E):   2nd inv (C/G):
e |--0--|       e |--1--|         e |--3--|
B |--1--|       B |--1--|         B |--1--|
G |--0--|       G |--2--|         G |--0--|
(G-C-E)        (E-C-G... )      (G-C-... )

STRINGS 2-3-4 (B G D):
Root pos:       1st inv:         2nd inv:
B |--1--|       B |--1--|         B |--3--|
G |--0--|       G |--2--|         G |--0--|
D |--2--|       D |--3--|         D |--0--|

STRINGS 3-4-5 (G D A):
Root pos:       1st inv:         2nd inv:
G |--5--|       G |--5--|         G |--0--|
D |--5--|       D |--7--|         D |--2--|
A |--3--|       A |--7--|         A |--3--|
(C root)       (E bass)          (G bass)`}
      </TabBlock>

      <Card>
        <h3 className="text-white font-bold mb-2">Exercise 2 — I–V–vi–IV Using Inversions</h3>
        <p className="text-purple-300 text-xs mb-3">
          Play C–G–Am–F using inversions that create minimal voice movement. Every note should move
          by a step or stay still.
        </p>
      </Card>
      <TabBlock label="I-V-vi-IV with smooth voice leading in C">
{`C (root)       G/B (1st inv)    Am (root)       F (root)
e  |---0---|   e  |---0---|     e  |---0---|    e  |---1---|
B  |---1---|   B  |---0---|     B  |---1---|    B  |---1---|
G  |---0---|   G  |---0---|     G  |---2---|    G  |---2---|
D  |---2---|   D  |---0---|     D  |---2---|    D  |---3---|
A  |---3---|   A  |---2---|     A  |---0---|    A  |---3---|
E  |---x---|   E  |---x---|     E  |---x---|    E  |---1---|

Bass line: C – B – A – F  (descending scale fragments)
Upper voices barely move between chords`}
      </TabBlock>

      <Card>
        <h3 className="text-white font-bold mb-2">Exercise 3 — ii–V–I with Drop 2 Voicings</h3>
        <p className="text-purple-300 text-xs mb-3">
          Play Dm7–G7–Cmaj7 using Drop 2 voicings on strings 1-2-3-4. Keep your hand in one
          position — the chords should come to your hand, not the other way around.
        </p>
      </Card>
      <TabBlock label="ii-V-I Drop 2, all in 5th position area">
{`Dm7 Drop2      G7 Drop2         Cmaj7 Drop2
e  |---5---|   e  |---3---|     e  |---5---|
B  |---6---|   B  |---3---|     B  |---5---|
G  |---5---|   G  |---4---|     G  |---4---|
D  |---5---|   D  |---5---|     D  |---5---|

Finger guide:
Dm7:  e=pinky, B=ring, G=index, D=middle  (approximate — adjust for comfort)
G7:   e=index, B=index(barre), G=ring, D=pinky
Cmaj7: e=pinky, B=ring, G=middle, D=pinky`}
      </TabBlock>

      <Card>
        <h3 className="text-white font-bold mb-2">Exercise 4 — 8-Bar Descending Bassline</h3>
        <p className="text-purple-300 text-xs mb-3">
          This progression uses inversions to walk the bass down one octave over 8 bars. Play it at
          60 BPM, letting each chord ring fully before moving.
        </p>
      </Card>
      <TabBlock label="8-bar descending bassline — C down to C">
{`Bar 1: C        Bar 2: C/B       Bar 3: Am        Bar 4: Am/G
e |--0--|       e |--0--|         e |--0--|         e |--0--|
B |--1--|       B |--1--|         B |--1--|         B |--1--|
G |--0--|       G |--0--|         G |--2--|         G |--2--|
D |--2--|       D |--2--|         D |--2--|         D |--2--|
A |--3--|       A |--x--|         A |--0--|         A |--x--|
E |--x--|       E |--2--|         E |--x--|         E |--3--|
bass: C         bass: B           bass: A           bass: G

Bar 5: F        Bar 6: F/E       Bar 7: Dm         Bar 8: G
e |--1--|       e |--0--|         e |--1--|         e |--3--|
B |--1--|       B |--1--|         B |--3--|         B |--3--|
G |--2--|       G |--2--|         G |--2--|         G |--0--|
D |--3--|       D |--3--|         D |--0--|         D |--0--|
A |--3--|       A |--x--|         A |--x--|         A |--2--|
E |--1--|       E |--0--|         E |--x--|         E |--3--|
bass: F         bass: E           bass: D           bass: G

Bass: C – B – A – G – F – E – D – G
(descend an octave, then resolve up to the V)`}
      </TabBlock>

      <h3 className="text-white font-bold mb-3 mt-2">Inversion Reference Chart</h3>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-purple-300 border-b border-white/10">
                <th className="text-left pb-2 pr-4">Chord</th>
                <th className="text-left pb-2 pr-4">Root Position</th>
                <th className="text-left pb-2 pr-4">1st Inv (slash)</th>
                <th className="text-left pb-2">2nd Inv (slash)</th>
              </tr>
            </thead>
            <tbody className="text-purple-200 space-y-1">
              {[
                ["C major",  "C–E–G",   "C/E",  "C/G"],
                ["G major",  "G–B–D",   "G/B",  "G/D"],
                ["D major",  "D–F#–A",  "D/F#", "D/A"],
                ["A major",  "A–C#–E",  "A/C#", "A/E"],
                ["E major",  "E–G#–B",  "E/G#", "E/B"],
                ["F major",  "F–A–C",   "F/A",  "F/C"],
                ["Am",       "A–C–E",   "Am/C", "Am/E"],
                ["Em",       "E–G–B",   "Em/G", "Em/B"],
                ["Dm",       "D–F–A",   "Dm/F", "Dm/A"],
              ].map(([chord, root, first, second]) => (
                <tr key={chord} className="border-b border-white/5">
                  <td className="py-1.5 pr-4 font-semibold text-white">{chord}</td>
                  <td className="py-1.5 pr-4 font-mono">{root}</td>
                  <td className="py-1.5 pr-4 font-mono text-blue-300">{first}</td>
                  <td className="py-1.5 font-mono text-green-300">{second}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <h3 className="text-white font-bold mb-3">What to Practise Daily</h3>
      <Card>
        <div className="space-y-2 text-sm">
          {[
            { time: "5 min",  task: "Triad inversions on one string set (rotate the string set each day)" },
            { time: "5 min",  task: "ii–V–I in one key using Drop 2 voicings — then move it to a new key" },
            { time: "5 min",  task: "Pick any 4-chord song you know and play it with inversions creating a bassline" },
            { time: "5 min",  task: "Slow voice leading practice: play each chord change at 40 BPM, listening for smooth motion" },
          ].map((item, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="bg-purple-600/60 text-purple-200 text-xs px-2 py-0.5 rounded font-mono shrink-0 mt-0.5">{item.time}</div>
              <div className="text-purple-200">{item.task}</div>
            </div>
          ))}
        </div>
      </Card>

      <Callout type="tip">
        Twenty minutes a day with inversions will transform your playing faster than most other
        practice you can do. The key is going slowly enough to hear the voice leading — if the
        changes aren't smooth, slow down, not up.
      </Callout>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ChordInversionsPage() {
  const [activeTab, setActiveTab] = useState(0)

  const tabContent = [
    <TabWhatAreInversions key="what" />,
    <TabTriadInversions key="triads" />,
    <TabSeventhChordInversions key="seventh" />,
    <TabVoiceLeading key="voice" />,
    <TabDropVoicings key="drop" />,
    <TabPracticalApplications key="practical" />,
    <TabPractice key="practice" />,
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">

        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-purple-300 hover:text-white text-sm">
            ← Back to modules
          </Link>
          <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2 mt-4">
            Chord Inversions &amp; Voice Leading
          </h1>
          <p className="text-purple-300 text-sm">
            Same chords, richer sound — the art of choosing which note goes on the bottom.
          </p>
        </div>

        {/* Tab Bar */}
        <div className="flex flex-wrap gap-2 mb-8">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === i
                  ? "bg-purple-600 text-white"
                  : "bg-white/10 text-purple-300 hover:bg-white/20"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
          {tabContent[activeTab]}
        </div>

      </div>
    </div>
  )
}
