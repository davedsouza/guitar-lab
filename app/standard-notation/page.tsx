"use client"

import React, { useState } from "react"
import Link from "next/link"

type Tab = "why-bother" | "staff-clef" | "note-values" | "key-sigs" | "time-sigs" | "guitar-notation" | "note-trainer"

const TABS: { id: Tab; label: string }[] = [
  { id: "why-bother",      label: "Why Bother?" },
  { id: "staff-clef",      label: "Staff & Clef" },
  { id: "note-values",     label: "Note Values" },
  { id: "key-sigs",        label: "Key Signatures" },
  { id: "time-sigs",       label: "Time Signatures" },
  { id: "guitar-notation", label: "Guitar Notation" },
  { id: "note-trainer",    label: "🎯 Note Trainer" },
]

// ─── Shared UI ────────────────────────────────────────────────────────────────
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

// ─── Staff SVG Engine ─────────────────────────────────────────────────────────
// Treble clef staff. Top line = F5, bottom line = E4. Ledger notes: C4, D4, G5, A5.
// Staff lines sit at diatonic steps 0, 2, 4, 6, 8 counting down from F5.
const ST = 38   // y of top staff line (F5)
const HS = 7    // pixels per diatonic half-step

const NOTE_STEP: Record<string, number> = {
  A5: -2, G5: -1,
  F5:  0, E5:  1, D5:  2, C5:  3, B4:  4,
  A4:  5, G4:  6, F4:  7, E4:  8,
  D4:  9, C4: 10,
}

// y-coordinate of a note in the SVG
function ny(note: string): number { return ST + (NOTE_STEP[note] ?? 0) * HS }

// Staff line y-positions (F5, D5, B4, G4, E4)
const SLY = [0, 2, 4, 6, 8].map(s => ST + s * HS) // [38, 52, 66, 80, 94]

// Shared staff lines + treble clef — used by all staff SVG components
function StaffBase({ x1 = 52, x2 = 202 }: { x1?: number; x2?: number }) {
  return (
    <>
      {SLY.map((ly, i) => (
        <line key={i} x1={x1} y1={ly} x2={x2} y2={ly}
              stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" />
      ))}
      {/* Treble clef — baseline at 116 (E4 y=94, +22) */}
      <text x="5" y={116} fontSize="58" fill="rgba(255,255,255,0.82)"
            fontFamily="'Times New Roman', Georgia, serif"
            style={{ userSelect: "none" }}>
        𝄞
      </text>
    </>
  )
}

// Single note on the staff (used in Note Trainer)
function StaffNote({ note, correct, wrong }: { note: string; correct?: boolean; wrong?: boolean }) {
  const y   = ny(note)
  const step = NOTE_STEP[note] ?? 0
  const stemUp = step >= 4
  const hasLedgerAbove = step === -2   // A5
  const hasLedgerBelow = step === 10   // C4
  const noteColor = correct ? "#22c55e" : wrong ? "#ef4444" : "#f59e0b"
  const nx = 140

  return (
    <svg width={210} height={145} className="overflow-visible">
      <StaffBase />
      {hasLedgerAbove && (
        <line x1={nx - 14} y1={y} x2={nx + 14} y2={y}
              stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" />
      )}
      {hasLedgerBelow && (
        <line x1={nx - 14} y1={y} x2={nx + 14} y2={y}
              stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" />
      )}
      {stemUp
        ? <line x1={nx + 8} y1={y - 4} x2={nx + 8} y2={y - 32} stroke={noteColor} strokeWidth="1.8" />
        : <line x1={nx - 8} y1={y + 4} x2={nx - 8} y2={y + 32} stroke={noteColor} strokeWidth="1.8" />
      }
      <ellipse cx={nx} cy={y} rx={8.5} ry={5.5}
               fill={noteColor} transform={`rotate(-12,${nx},${y})`} />
    </svg>
  )
}

// Annotated staff showing a specific set of labeled notes (for teaching diagrams)
function AnnotatedStaff({ notes, color = "#f59e0b" }: { notes: string[]; color?: string }) {
  const spacing = 46
  const firstX = 78
  const totalW = firstX + notes.length * spacing + 20

  return (
    <div className="overflow-x-auto">
      <svg width={totalW} height={145} style={{ minWidth: totalW }}>
        <StaffBase x1={46} x2={totalW - 8} />
        {notes.map((note, i) => {
          const x = firstX + i * spacing
          const y = ny(note)
          const step = NOTE_STEP[note] ?? 0
          const hasLedgerAbove = step === -2
          const hasLedgerBelow = step === 10
          const stemUp = step >= 4
          const label = note[0]
          return (
            <g key={note}>
              {hasLedgerAbove && (
                <line x1={x - 14} y1={y} x2={x + 14} y2={y}
                      stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" />
              )}
              {hasLedgerBelow && (
                <line x1={x - 14} y1={y} x2={x + 14} y2={y}
                      stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" />
              )}
              {stemUp
                ? <line x1={x + 8} y1={y - 4} x2={x + 8} y2={y - 28} stroke={color} strokeWidth="1.6" />
                : <line x1={x - 8} y1={y + 4} x2={x - 8} y2={y + 28} stroke={color} strokeWidth="1.6" />
              }
              <ellipse cx={x} cy={y} rx={8} ry={5.5}
                       fill={color} transform={`rotate(-12,${x},${y})`} />
              <text x={x} y={120} textAnchor="middle"
                    fill="#c4b5fd" fontSize="13" fontWeight="bold">{label}</text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

// ─── Tab content ──────────────────────────────────────────────────────────────
function WhyBotherTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Why Learn Standard Notation?</h2>
      <p className="text-purple-200 mb-6">
        Most guitarists avoid it — which means learning it puts you ahead of 90% of players. It&apos;s not as hard as it looks.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-amber-400 font-bold mb-2">TAB</p>
          <ul className="text-purple-200 text-sm space-y-1">
            <li>✓ Shows exactly where to put your fingers</li>
            <li>✓ Fast to read for guitar-specific stuff</li>
            <li>✗ No rhythm information</li>
            <li>✗ Guitar only — can&apos;t communicate with other musicians</li>
            <li>✗ Classical repertoire unavailable</li>
            <li>✗ Can&apos;t sight-read lead sheets or charts</li>
          </ul>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-green-400 font-bold mb-2">Standard Notation</p>
          <ul className="text-purple-200 text-sm space-y-1">
            <li>✓ Complete rhythm + pitch information</li>
            <li>✓ Universal — works with any instrument</li>
            <li>✓ Unlocks 400+ years of repertoire</li>
            <li>✓ Read lead sheets, fake books, charts</li>
            <li>✓ Communicate with pianists, horn players, everyone</li>
            <li>✗ Doesn&apos;t show which position to use on guitar</li>
          </ul>
        </div>
      </div>

      <Callout type="insight">
        Most professional guitar sheet music shows <strong className="text-white">both TAB and standard notation together</strong>.
        Learning to read the standard notation line just takes you to the next level — and it&apos;s much faster than you think.
      </Callout>

      <Card title="The Guitar&apos;s Hidden Secret: It&apos;s a Transposing Instrument">
        <p className="text-purple-200 text-sm mb-3">
          Guitar music is written <strong className="text-white">one octave higher</strong> than it actually sounds.
          This was done to keep most guitar notes on or near the staff rather than on a wall of ledger lines.
        </p>
        <p className="text-purple-200 text-sm mb-3">
          A written C on the guitar staff sounds like the C an octave lower on the piano.
          You never need to think about this when reading guitar music — it&apos;s automatic — but it explains
          why guitar sheet music doesn&apos;t match what you&apos;d play on a keyboard reading the same notes.
        </p>
        <p className="text-amber-300 text-sm font-semibold">
          Written note → sounding pitch = one octave lower. Guitar sheet music is always in this convention.
        </p>
      </Card>

      <Card title="What You Actually Need to Learn">
        <div className="space-y-2 text-sm">
          {[
            { item: "Note names on the staff", time: "1–2 days to learn, weeks to automate" },
            { item: "Note values (rhythm)", time: "A few hours — you already know this from counting beats" },
            { item: "Key signatures", time: "30 minutes — one pattern to remember" },
            { item: "Time signatures", time: "Already intuitive if you play with rhythm" },
            { item: "Guitar-specific symbols", time: "1 session to recognize them all" },
          ].map(r => (
            <div key={r.item} className="flex items-start gap-3 border-b border-white/10 pb-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <div>
                <p className="text-white font-semibold">{r.item}</p>
                <p className="text-purple-400 text-xs">{r.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Callout type="exercise">
        Use the <strong className="text-white">Note Trainer</strong> tab every day for 5 minutes.
        Within two weeks most players can identify all staff notes instantly. That&apos;s the entire skill — the rest of notation falls into place around it.
      </Callout>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
function StaffClefTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">The Staff & Treble Clef</h2>
      <p className="text-purple-200 mb-6">
        Music is written on a <strong className="text-white">staff</strong> — 5 horizontal lines. Notes sit on lines or in the spaces between them. The higher the note, the higher it sits on the staff.
      </p>

      <Card title="The Five Lines">
        <p className="text-purple-200 text-sm mb-4">
          The treble clef (the curly symbol) tells you this is the <strong className="text-white">G clef</strong> — its curl wraps around the G line (second from the bottom).
          Guitarists use only the treble clef.
        </p>
        <div className="bg-black/30 rounded-xl p-4 mb-4">
          <AnnotatedStaff notes={["E4","G4","B4","D5","F5"]} color="#f59e0b" />
        </div>
        <p className="text-center text-amber-400 font-bold tracking-widest text-lg mb-1">E · G · B · D · F</p>
        <p className="text-center text-purple-300 text-sm">
          &ldquo;Every Good Boy Does Fine&rdquo; — the five lines from bottom to top
        </p>
      </Card>

      <Card title="The Four Spaces">
        <div className="bg-black/30 rounded-xl p-4 mb-4">
          <AnnotatedStaff notes={["F4","A4","C5","E5"]} color="#818cf8" />
        </div>
        <p className="text-center text-indigo-400 font-bold tracking-widest text-lg mb-1">F · A · C · E</p>
        <p className="text-center text-purple-300 text-sm">
          The four spaces spell <strong>FACE</strong> — easy to memorise
        </p>
      </Card>

      <Card title="Ledger Lines — Going Beyond the Staff">
        <p className="text-purple-200 text-sm mb-4">
          When notes go higher or lower than the staff, short lines called <strong className="text-white">ledger lines</strong> extend the staff temporarily. Guitar uses two below the staff frequently.
        </p>
        <div className="bg-black/30 rounded-xl p-4 mb-4">
          <AnnotatedStaff notes={["C4","D4","E4","F5","G5","A5"]} color="#34d399" />
        </div>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          <div className="bg-white/5 rounded-xl p-3">
            <p className="text-white font-semibold mb-1">Below the staff</p>
            <p className="text-purple-300 text-xs">D4 = space just below. C4 = sits on the first ledger line below.</p>
            <p className="text-amber-400 text-xs mt-1">C4 is the most important ledger note — it appears constantly.</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <p className="text-white font-semibold mb-1">Above the staff</p>
            <p className="text-purple-300 text-xs">G5 = space just above. A5 = sits on the first ledger line above.</p>
          </div>
        </div>
      </Card>

      <Card title="All Notes — Full Range">
        <div className="bg-black/30 rounded-xl p-4 mb-4">
          <AnnotatedStaff
            notes={["C4","D4","E4","F4","G4","A4","B4","C5","D5","E5","F5","G5","A5"]}
            color="#f59e0b"
          />
        </div>
        <p className="text-purple-300 text-sm text-center">
          C4 to A5 — the core reading range for guitar. Note names repeat every octave (every 7 notes).
        </p>
      </Card>

      <Callout type="tip">
        <strong className="text-white">The fast shortcut:</strong> memorise the lines first (EGBDF), then the spaces fall naturally in between.
        Once you know E and G are lines 1 and 2, F between them is obvious. Work outward from there.
      </Callout>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
function NoteValuesTab() {
  const notes = [
    { name: "Whole Note",       beats: 4, symbol: "○",     fill: false, flags: 0, description: "Open oval, no stem. Holds for the full bar in 4/4." },
    { name: "Half Note",        beats: 2, symbol: "𝅗𝅥",    fill: false, flags: 0, description: "Open oval with a stem. Two per bar in 4/4." },
    { name: "Quarter Note",     beats: 1, symbol: "♩",      fill: true,  flags: 0, description: "Filled oval with a stem. The most common note value — one beat." },
    { name: "Eighth Note",      beats: 0.5, symbol: "♪",   fill: true,  flags: 1, description: "Filled oval, stem with one flag (or beamed with adjacent eighths)." },
    { name: "Sixteenth Note",   beats: 0.25, symbol: "𝅘𝅥𝅯", fill: true, flags: 2, description: "Filled oval, stem with two flags. Four per beat." },
  ]

  const rests = [
    { name: "Whole Rest",     beats: 4,    look: "▬ (hangs from a line)" },
    { name: "Half Rest",      beats: 2,    look: "▬ (sits on a line)" },
    { name: "Quarter Rest",   beats: 1,    look: "𝄽 (squiggle)" },
    { name: "Eighth Rest",    beats: 0.5,  look: "𝄾 (angled with flag)" },
    { name: "Sixteenth Rest", beats: 0.25, look: "𝄿 (two angled flags)" },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Note Values & Rhythm</h2>
      <p className="text-purple-200 mb-6">
        A note&apos;s shape tells you how long to hold it. Every note has a corresponding rest (silence of the same duration).
      </p>

      <Card title="Note Values">
        <div className="space-y-3">
          {notes.map(n => (
            <div key={n.name} className="flex items-start gap-4 border-b border-white/10 pb-3">
              <div className="text-3xl w-10 text-center flex-shrink-0 text-amber-400 leading-none pt-1">
                {n.symbol}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <p className="text-white font-semibold">{n.name}</p>
                  <span className="bg-purple-600/40 text-purple-200 text-xs px-2 py-0.5 rounded-full">
                    {n.beats} {n.beats === 1 ? "beat" : "beats"}
                  </span>
                </div>
                <p className="text-purple-300 text-xs">{n.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Visual Rhythm — How a Bar Fills Up (in 4/4)">
        <div className="space-y-3 font-mono text-xs">
          {[
            { label: "Whole (4 beats)", bars: [{ w: "100%", color: "bg-amber-500" }], count: "1 . . . . . . ." },
            { label: "Halves (2 beats)", bars: [{ w: "50%", color: "bg-blue-500" }, { w: "50%", color: "bg-blue-400" }], count: "1 . . . 3 . . ." },
            { label: "Quarters (1 beat)", bars: Array(4).fill({ w: "25%", color: "bg-green-500" }), count: "1 . 2 . 3 . 4 ." },
            { label: "Eighths (½ beat)", bars: Array(8).fill({ w: "12.5%", color: "bg-purple-500" }), count: "1 + 2 + 3 + 4 +" },
          ].map((row, ri) => (
            <div key={ri}>
              <p className="text-purple-400 mb-1">{row.label}</p>
              <div className="flex gap-0.5 h-6 mb-1">
                {row.bars.map((bar, bi) => (
                  <div key={bi} style={{ width: bar.w }} className={`${bar.color} rounded-sm opacity-80`} />
                ))}
              </div>
              <p className="text-slate-400">{row.count}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Rests — Silence Has Value Too">
        <p className="text-purple-200 text-sm mb-3">
          Every note value has a matching rest. Rests are just as important as notes — silence is part of music.
        </p>
        <div className="space-y-2">
          {rests.map(r => (
            <div key={r.name} className="flex items-center gap-4 text-sm border-b border-white/10 pb-2">
              <span className="text-white font-semibold w-36">{r.name}</span>
              <span className="bg-purple-600/30 text-purple-200 text-xs px-2 py-0.5 rounded-full w-20 text-center">
                {r.beats} {r.beats === 1 ? "beat" : "beats"}
              </span>
              <span className="text-slate-400 text-xs">{r.look}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Dotted Notes & Ties">
        <div className="space-y-3 text-sm">
          <div>
            <p className="text-white font-semibold mb-1">Dotted notes</p>
            <p className="text-purple-200">A dot after a note adds half its value. A dotted quarter = 1½ beats. A dotted half = 3 beats.</p>
          </div>
          <div>
            <p className="text-white font-semibold mb-1">Tied notes</p>
            <p className="text-purple-200">A curved line connecting two of the same note — hold for the combined duration. Used when a note needs to cross a bar line or create unusual durations.</p>
          </div>
          <div>
            <p className="text-white font-semibold mb-1">Slurs (look like ties — different meaning)</p>
            <p className="text-purple-200">A curved line over different notes = play smoothly (legato). Not the same as a tie. Context makes it clear which it is.</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
function KeySigsTab() {
  const sharps = [
    { key: "G",  sharps: 1, note: "F#" },
    { key: "D",  sharps: 2, note: "F#, C#" },
    { key: "A",  sharps: 3, note: "F#, C#, G#" },
    { key: "E",  sharps: 4, note: "F#, C#, G#, D#" },
    { key: "B",  sharps: 5, note: "F#, C#, G#, D#, A#" },
  ]

  const flats = [
    { key: "F",  flats: 1, note: "Bb" },
    { key: "Bb", flats: 2, note: "Bb, Eb" },
    { key: "Eb", flats: 3, note: "Bb, Eb, Ab" },
    { key: "Ab", flats: 4, note: "Bb, Eb, Ab, Db" },
    { key: "Db", flats: 5, note: "Bb, Eb, Ab, Db, Gb" },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Key Signatures</h2>
      <p className="text-purple-200 mb-6">
        Instead of writing a sharp or flat on every affected note, the key signature at the start of each line tells you which notes are always sharp or flat throughout the piece.
      </p>

      <Callout type="insight">
        The key signature saves enormous clutter. A piece in D major has F# and C# throughout — writing ♯ on every F and C would be exhausting. Instead, two sharps at the start mean &ldquo;always play F# and C# unless told otherwise.&rdquo;
      </Callout>

      <Card title="Sharp Keys — Order of Sharps: F C G D A E B">
        <p className="text-purple-200 text-sm mb-4">
          Sharps are added one at a time in this fixed order. To find the key: the last sharp is the 7th degree — the key is one semitone above it.
        </p>
        <div className="space-y-2">
          {sharps.map(k => (
            <div key={k.key} className="flex items-center gap-3 border-b border-white/10 pb-2">
              <div className="flex gap-0.5">
                {Array.from({ length: k.sharps }).map((_, i) => (
                  <span key={i} className="text-amber-400 font-bold">♯</span>
                ))}
              </div>
              <span className="text-white font-bold w-8">{k.key}</span>
              <span className="text-purple-300 text-xs">{k.note}</span>
            </div>
          ))}
        </div>
        <p className="text-amber-400 text-xs mt-3">
          Trick: last sharp + 1 semitone = key name. (3 sharps: G# → A major) ✓
        </p>
      </Card>

      <Card title="Flat Keys — Order of Flats: B E A D G C F">
        <p className="text-purple-200 text-sm mb-4">
          Flats are added in the opposite order. To find the key: the second-to-last flat IS the key name.
          (One flat = F major — just memorise this one.)
        </p>
        <div className="space-y-2">
          {flats.map(k => (
            <div key={k.key} className="flex items-center gap-3 border-b border-white/10 pb-2">
              <div className="flex gap-0.5">
                {Array.from({ length: k.flats }).map((_, i) => (
                  <span key={i} className="text-blue-400 font-bold">♭</span>
                ))}
              </div>
              <span className="text-white font-bold w-8">{k.key}</span>
              <span className="text-purple-300 text-xs">{k.note}</span>
            </div>
          ))}
        </div>
        <p className="text-blue-400 text-xs mt-3">
          Trick: second-to-last flat = key name. (4 flats: Bb Eb Ab Db → second-to-last = Ab major) ✓
        </p>
      </Card>

      <Card title="The Circle of Fifths">
        <p className="text-purple-200 text-sm mb-3">
          Moving clockwise adds one sharp each time. Moving counter-clockwise adds one flat. C major (no sharps or flats) sits at the top.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
          {[
            { key: "C", sig: "no ♯/♭", col: "bg-white/10" },
            { key: "G", sig: "1♯",     col: "bg-amber-500/20" },
            { key: "D", sig: "2♯",     col: "bg-amber-500/25" },
            { key: "A", sig: "3♯",     col: "bg-amber-500/30" },
            { key: "E", sig: "4♯",     col: "bg-amber-500/35" },
            { key: "F", sig: "1♭",     col: "bg-blue-500/20" },
            { key: "Bb", sig: "2♭",    col: "bg-blue-500/25" },
            { key: "Eb", sig: "3♭",    col: "bg-blue-500/30" },
          ].map(k => (
            <div key={k.key} className={`${k.col} border border-white/10 rounded-xl p-2`}>
              <p className="text-white font-bold">{k.key}</p>
              <p className="text-purple-400">{k.sig}</p>
            </div>
          ))}
        </div>
      </Card>

      <Callout type="tip">
        For guitar, the most common sharp keys are G, D, A, E (all very guitaristic). The most useful flat keys are F and Bb. Spend 80% of your time with these six.
      </Callout>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
function TimeSigsTab() {
  const signatures = [
    {
      sig: "4/4", name: "Common Time", feel: "4 quarter-note beats per bar",
      count: "1  2  3  4", use: "Rock, pop, blues, country, jazz — the default",
      example: "Almost every song you know",
    },
    {
      sig: "3/4", name: "Waltz Time", feel: "3 quarter-note beats per bar",
      count: "1  2  3", use: "Waltzes, ballads, folk — has a lilt or sway",
      example: "Amazing Grace, Happy Birthday, My Favourite Things",
    },
    {
      sig: "6/8", name: "Compound Time", feel: "6 eighth-note beats (2 strong groups of 3)",
      count: "1  2  3  4  5  6", use: "Compound feel — bouncy, rolling",
      example: "House of the Rising Sun, Nothing Else Matters (chorus)",
    },
    {
      sig: "2/4", name: "Cut Time / March", feel: "2 quarter-note beats per bar",
      count: "1  2", use: "Marches, fast passages — feels twice as fast as 4/4",
      example: "Military marches, some bluegrass",
    },
    {
      sig: "5/4", name: "Odd Time", feel: "5 quarter-note beats (groups of 2+3 or 3+2)",
      count: "1  2  3  4  5", use: "Progressive rock, jazz — unusual, asymmetric feel",
      example: "Take Five (Dave Brubeck), Mission Impossible theme",
    },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Time Signatures</h2>
      <p className="text-purple-200 mb-6">
        The time signature appears at the start of a piece — two numbers stacked. The top tells you <strong className="text-white">how many beats per bar</strong>.
        The bottom tells you <strong className="text-white">what note value = one beat</strong>.
      </p>

      <Card title="Reading the Two Numbers">
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <div className="text-5xl font-bold text-amber-400 mb-2" style={{ fontFamily: "serif", lineHeight: 1 }}>
              <span>4</span><br/><span>4</span>
            </div>
            <p className="text-white font-semibold">Top number: 4</p>
            <p className="text-purple-300 text-xs mt-1">4 beats per bar</p>
            <p className="text-white font-semibold mt-2">Bottom number: 4</p>
            <p className="text-purple-300 text-xs mt-1">A quarter note = 1 beat</p>
            <p className="text-amber-400 text-xs mt-2">(4 = quarter note, 8 = eighth note, 2 = half note)</p>
          </div>
          <div className="space-y-2 text-xs">
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-white font-bold">Bottom = 4 → quarter notes count</p>
              <p className="text-purple-300">Standard. Each beat = ♩</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-white font-bold">Bottom = 8 → eighth notes count</p>
              <p className="text-purple-300">Common in 6/8 — each beat = ♪</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-white font-bold">Bottom = 2 → half notes count</p>
              <p className="text-purple-300">Cut time — march / fast feel</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-3 mb-4">
        {signatures.map(s => (
          <div key={s.sig} className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-start gap-4">
              <div className="text-3xl font-bold text-amber-400 w-14 text-center flex-shrink-0"
                   style={{ fontFamily: "serif", lineHeight: 1.1 }}>
                {s.sig}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <p className="text-white font-semibold">{s.name}</p>
                  <span className="text-purple-400 text-xs">({s.feel})</span>
                </div>
                <p className="text-green-300 font-mono text-xs mb-1">Count: {s.count}</p>
                <p className="text-purple-300 text-xs mb-0.5">{s.use}</p>
                <p className="text-amber-400 text-xs">e.g. {s.example}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Callout type="tip">
        The most important difference to feel: <strong className="text-white">4/4 vs 3/4</strong>.
        In 4/4 you accent beats 1 and 3. In 3/4 you accent only beat 1 — it creates the waltz lilt.
        Tap your foot and count out loud when reading a new piece.
      </Callout>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
function GuitarNotationTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Guitar-Specific Notation</h2>
      <p className="text-purple-200 mb-6">
        Professional guitar sheet music uses additional symbols beyond standard notation — for bends, vibrato, slides, and more.
        Here&apos;s how they appear on the page.
      </p>

      <Card title="Standard Notation + TAB Together">
        <p className="text-purple-200 text-sm mb-3">
          Most published guitar music shows both staves simultaneously — standard notation on top, TAB below.
          Use the notation for rhythm and pitch, the TAB for position.
        </p>
        <div className="bg-black/40 rounded-xl p-4 font-mono text-xs text-green-300 overflow-x-auto">
          <pre>{`Standard:   &  ♩    ♩    ♩    ♩   |
            |  •────•────•────•   |
            |  G4   A4   B4   A4  |

TAB:        e|──────────────────|
            B|──────────────────|
            G|──5────7────9────7-|
            D|──────────────────|
            A|──────────────────|
            E|──────────────────|`}</pre>
        </div>
        <p className="text-purple-300 text-xs mt-3">
          The TAB confirms you play those notes on the G string at frets 5, 7, 9. The notation gives you the exact rhythm.
        </p>
      </Card>

      <Card title="Technique Markings in Standard Notation">
        <div className="space-y-3 text-sm">
          {[
            { symbol: "⌒ (curved line)", name: "Bend",    desc: "Curved line with arrow above the note. Often labelled '½' (half step) or 'full' (whole step)." },
            { symbol: "~~ (wavy line)",  name: "Vibrato",  desc: "Wavy line above the note — oscillate pitch rapidly. Width of wave = depth of vibrato." },
            { symbol: "/ (slash)",       name: "Slide up", desc: "Diagonal line rising before the note head — slide into the note from below." },
            { symbol: "\\ (backslash)",  name: "Slide down", desc: "Diagonal line falling after the note head — slide away after striking." },
            { symbol: "H.O.",            name: "Hammer-on", desc: "Slur mark over ascending notes, sometimes labelled 'H'. Fret without picking." },
            { symbol: "P.O.",            name: "Pull-off",  desc: "Slur mark over descending notes, sometimes labelled 'P'. Pull string sideways." },
            { symbol: "P.M. ─┐",        name: "Palm mute", desc: "P.M. over a bracket — mute with heel of picking hand for the bracketed notes." },
            { symbol: "harm.",           name: "Harmonic",  desc: "Note in diamond shape, or 'harm.' label. Touch string lightly — don't press." },
          ].map(r => (
            <div key={r.name} className="border-b border-white/10 pb-2">
              <div className="flex gap-3 items-start">
                <span className="text-amber-400 font-mono text-xs w-28 flex-shrink-0 mt-0.5">{r.symbol}</span>
                <div>
                  <p className="text-white font-semibold">{r.name}</p>
                  <p className="text-purple-300 text-xs">{r.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Dynamics — How Loud to Play">
        <div className="grid sm:grid-cols-2 gap-2 text-sm">
          {[
            { sym: "pp", name: "Pianissimo", mean: "Very soft" },
            { sym: "p",  name: "Piano",      mean: "Soft" },
            { sym: "mp", name: "Mezzo-piano", mean: "Moderately soft" },
            { sym: "mf", name: "Mezzo-forte", mean: "Moderately loud" },
            { sym: "f",  name: "Forte",      mean: "Loud" },
            { sym: "ff", name: "Fortissimo", mean: "Very loud" },
            { sym: "cresc.", name: "Crescendo", mean: "Gradually get louder" },
            { sym: "dim.",   name: "Diminuendo", mean: "Gradually get softer" },
          ].map(d => (
            <div key={d.sym} className="flex items-center gap-3 bg-white/5 rounded-lg p-2">
              <span className="text-amber-400 font-bold italic w-12 text-right flex-shrink-0">{d.sym}</span>
              <div>
                <p className="text-white text-xs font-semibold">{d.name}</p>
                <p className="text-purple-400 text-xs">{d.mean}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Repeat & Navigation Symbols">
        <div className="space-y-2 text-sm">
          {[
            { sym: "𝄆 … 𝄇", name: "Repeat Signs",   desc: "Play everything between the signs again." },
            { sym: "D.C.",    name: "Da Capo",         desc: "Go back to the very beginning." },
            { sym: "D.S.",    name: "Dal Segno",       desc: "Go back to the 𝄋 (segno) sign." },
            { sym: "Fine",    name: "Fine",            desc: "The end — stop here when you arrive via D.C. or D.S." },
            { sym: "⊕ Coda", name: "Coda",            desc: "Jump to the coda (tail section) when instructed." },
            { sym: "[1.] [2.]", name: "First/Second endings", desc: "Play the first ending the first time, second ending on the repeat." },
          ].map(r => (
            <div key={r.name} className="flex gap-3 border-b border-white/10 pb-2">
              <span className="text-amber-400 font-mono text-xs w-20 flex-shrink-0 mt-0.5">{r.sym}</span>
              <div>
                <p className="text-white font-semibold">{r.name}</p>
                <p className="text-purple-300 text-xs">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
const POOLS = {
  beginner:     ["E4", "G4", "B4", "D5", "F5"] as const,
  intermediate: ["E4", "F4", "G4", "A4", "B4", "C5", "D5", "E5", "F5"] as const,
  advanced:     ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5", "D5", "E5", "F5", "G5", "A5"] as const,
}
type Level = keyof typeof POOLS

// Hints for each note: which line/space it's on
const NOTE_HINT: Record<string, string> = {
  C4: "Ledger line below the staff",
  D4: "Space just below the staff",
  E4: "Bottom line (line 1) — E for 'Every'",
  F4: "First space — F for 'Face'",
  G4: "Second line — G for 'Good'",
  A4: "Second space — A for 'fAce'",
  B4: "Middle line (line 3) — B for 'Boy'",
  C5: "Third space — C for 'faCe'",
  D5: "Fourth line — D for 'Does'",
  E5: "Fourth space — E for 'facE'",
  F5: "Top line (line 5) — F for 'Fine'",
  G5: "Space above the staff",
  A5: "Ledger line above the staff",
}

function shuffle<T>(arr: readonly T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

function NoteTrainerTab() {
  const [level, setLevel] = useState<Level>("beginner")
  const [pool, setPool] = useState<string[]>(() => shuffle(POOLS.beginner))
  const [idx, setIdx]   = useState(0)
  const [answered, setAnswered] = useState<string | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)

  const currentNote = pool[idx % pool.length]
  const correctLetter = currentNote[0]
  const isCorrect = answered === correctLetter
  const isWrong   = answered !== null && answered !== correctLetter
  const accuracy  = score.total > 0 ? Math.round(score.correct / score.total * 100) : 0

  function changeLevel(newLevel: Level) {
    setLevel(newLevel)
    setPool(shuffle(POOLS[newLevel]))
    setIdx(0)
    setAnswered(null)
    setShowHint(false)
  }

  function handleAnswer(letter: string) {
    if (answered !== null) return
    setAnswered(letter)
    const correct = letter === correctLetter
    setScore(s => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }))
    if (correct) {
      const newStreak = streak + 1
      setStreak(newStreak)
      setBestStreak(b => Math.max(b, newStreak))
    } else {
      setStreak(0)
    }
  }

  function nextNote() {
    const nextIdx = idx + 1
    if (nextIdx % pool.length === 0) setPool(shuffle(POOLS[level]))
    setIdx(nextIdx)
    setAnswered(null)
    setShowHint(false)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Note Trainer</h2>
      <p className="text-purple-200 mb-6">
        Identify the note shown on the staff. Aim for instant recognition — no counting, no guessing.
      </p>

      {/* Level selector */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(["beginner", "intermediate", "advanced"] as Level[]).map(l => (
          <button
            key={l}
            onClick={() => changeLevel(l)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all capitalize ${
              level === l ? "bg-purple-600 text-white" : "bg-white/10 text-purple-300 hover:bg-white/20"
            }`}
          >
            {l}
            <span className="text-xs ml-1 opacity-70">
              {l === "beginner" ? "(5 notes)" : l === "intermediate" ? "(9 notes)" : "(13 notes)"}
            </span>
          </button>
        ))}
      </div>

      {/* Score bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6 text-center text-xs">
        {[
          { label: "Correct", val: score.correct, color: "text-green-400" },
          { label: "Total",   val: score.total,   color: "text-white" },
          { label: "Accuracy", val: `${accuracy}%`, color: accuracy >= 80 ? "text-green-400" : accuracy >= 50 ? "text-amber-400" : "text-red-400" },
          { label: "Streak",  val: streak,         color: streak >= 5 ? "text-amber-400" : "text-white" },
        ].map(s => (
          <div key={s.label} className="bg-white/10 rounded-xl p-2">
            <p className={`text-lg font-bold ${s.color}`}>{s.val}</p>
            <p className="text-purple-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Staff display */}
      <div className="bg-black/40 border border-white/10 rounded-2xl p-6 mb-6 flex flex-col items-center">
        <StaffNote note={currentNote} correct={isCorrect} wrong={isWrong} />

        {/* Feedback */}
        {answered !== null && (
          <div className={`mt-3 text-center px-4 py-2 rounded-xl ${isCorrect ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}`}>
            {isCorrect
              ? <p className="font-semibold">✓ Correct! That&apos;s {currentNote}</p>
              : <p className="font-semibold">✗ That was {currentNote} — the answer is <strong>{correctLetter}</strong></p>
            }
            <p className="text-xs mt-1 opacity-80">{NOTE_HINT[currentNote]}</p>
          </div>
        )}

        {/* Hint */}
        {answered === null && showHint && (
          <div className="mt-3 bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-2 text-center">
            <p className="text-amber-300 text-xs">{NOTE_HINT[currentNote]}</p>
          </div>
        )}
      </div>

      {/* Answer buttons */}
      <div className="flex justify-center gap-2 mb-4 flex-wrap">
        {["C", "D", "E", "F", "G", "A", "B"].map(letter => {
          let cls = "bg-white/15 text-white hover:bg-purple-500/60"
          if (answered !== null) {
            if (letter === correctLetter) cls = "bg-green-500 text-white"
            else if (letter === answered) cls = "bg-red-500 text-white"
            else cls = "bg-white/5 text-slate-500"
          }
          return (
            <button
              key={letter}
              onClick={() => handleAnswer(letter)}
              disabled={answered !== null}
              className={`w-11 h-11 rounded-xl font-bold text-lg transition-all ${cls}`}
            >
              {letter}
            </button>
          )
        })}
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3">
        {answered === null && (
          <button
            onClick={() => setShowHint(h => !h)}
            className="px-4 py-2 bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-xl text-sm"
          >
            {showHint ? "Hide Hint" : "Show Hint"}
          </button>
        )}
        {answered !== null && (
          <button
            onClick={nextNote}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl text-sm transition-all"
          >
            Next Note →
          </button>
        )}
      </div>

      {/* Level guide */}
      <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-3">Level Guide</p>
        <div className="space-y-2 text-xs">
          <div>
            <p className="text-white font-semibold">Beginner — Lines only</p>
            <p className="text-purple-400">E4  G4  B4  D5  F5  (EGBDF — Every Good Boy Does Fine)</p>
          </div>
          <div>
            <p className="text-white font-semibold">Intermediate — Lines + spaces, no ledger lines</p>
            <p className="text-purple-400">E4 F4 G4 A4 B4 C5 D5 E5 F5</p>
          </div>
          <div>
            <p className="text-white font-semibold">Advanced — Full range with ledger lines</p>
            <p className="text-purple-400">C4 D4 + all intermediate + G5 A5</p>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-white/10">
          <p className="text-amber-400 text-xs font-semibold">Target: instant recognition with 90%+ accuracy at each level before moving up.</p>
          <p className="text-purple-400 text-xs mt-1">Best streak this session: <span className="text-white font-bold">{bestStreak}</span></p>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function StandardNotationPage() {
  const [activeTab, setActiveTab] = useState<Tab>("why-bother")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link href="/" className="text-purple-300 hover:text-white text-sm">← Back to modules</Link>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">Standard Notation</h1>
          <p className="text-purple-200">Read music the way every other instrument does. Unlock sheet music, lead sheets, and a new way of thinking.</p>
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
          {activeTab === "why-bother"      && <WhyBotherTab />}
          {activeTab === "staff-clef"      && <StaffClefTab />}
          {activeTab === "note-values"     && <NoteValuesTab />}
          {activeTab === "key-sigs"        && <KeySigsTab />}
          {activeTab === "time-sigs"       && <TimeSigsTab />}
          {activeTab === "guitar-notation" && <GuitarNotationTab />}
          {activeTab === "note-trainer"    && <NoteTrainerTab />}
        </div>
      </div>
    </div>
  )
}
