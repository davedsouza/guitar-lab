"use client"

import { useState } from "react"
import Link from "next/link"

type Tab = "what-is-it" | "major-harmony" | "minor-harmony" | "chord-scale" | "on-guitar" | "practice"

const TABS: { id: Tab; label: string }[] = [
  { id: "what-is-it", label: "What Is It?" },
  { id: "major-harmony", label: "Major Scale Chords" },
  { id: "minor-harmony", label: "Minor Scale Chords" },
  { id: "chord-scale", label: "Chord → Scale" },
  { id: "on-guitar", label: "On the Guitar" },
  { id: "practice", label: "Practice" },
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

// ─── Degree pill colours ──────────────────────────────────────────────────────
const DEGREE_COLORS: Record<string, string> = {
  I:    "bg-emerald-600/30 text-emerald-300 border-emerald-500/40",
  ii:   "bg-blue-600/30   text-blue-300   border-blue-500/40",
  iii:  "bg-indigo-600/30 text-indigo-300 border-indigo-500/40",
  IV:   "bg-amber-600/30  text-amber-300  border-amber-500/40",
  V:    "bg-red-600/30    text-red-300    border-red-500/40",
  vi:   "bg-purple-600/30 text-purple-300 border-purple-500/40",
  "vii°": "bg-slate-600/30 text-slate-300 border-slate-500/40",
  i:    "bg-purple-600/30 text-purple-300 border-purple-500/40",
  "ii°":"bg-slate-600/30 text-slate-300 border-slate-500/40",
  III:  "bg-blue-600/30   text-blue-300   border-blue-500/40",
  iv:   "bg-amber-600/30  text-amber-300  border-amber-500/40",
  v:    "bg-red-600/30    text-red-300    border-red-500/40",
  VI:   "bg-emerald-600/30 text-emerald-300 border-emerald-500/40",
  VII:  "bg-indigo-600/30 text-indigo-300 border-indigo-500/40",
}

function Pill({ degree }: { degree: string }) {
  const cls = DEGREE_COLORS[degree] ?? "bg-white/10 text-white border-white/20"
  return (
    <span className={`inline-flex items-center justify-center w-12 h-7 rounded-lg border text-xs font-bold ${cls}`}>
      {degree}
    </span>
  )
}

// ─── What Is It ───────────────────────────────────────────────────────────────
function WhatIsItTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">What Is Diatonic Harmonisation?</h2>
      <p className="text-purple-200 mb-6">
        Every scale contains 7 notes. If you stack thirds on top of each note — using only notes from that same scale — you build a chord.
        Do this for every note in the scale and you get the <span className="text-white font-semibold">diatonic chords</span>: the family of chords that naturally live inside a key.
      </p>

      <Callout type="insight">
        This is why certain chords always sound right together in a song. G, Em, Am, and C all sound great together because they all come from the key of G major — they are the diatonic chords of that scale.
      </Callout>

      <Card title="How Chords Are Built From a Scale — Step by Step">
        <p className="text-purple-200 text-sm mb-4">
          Take the C major scale: <span className="font-mono text-green-300">C D E F G A B</span>.
          To build a chord on <strong className="text-white">C</strong>, take every other note: C → skip D → E → skip F → G.
          That gives you <strong className="text-amber-300">C E G = C major</strong>.
        </p>
        <p className="text-purple-200 text-sm mb-4">
          Now do the same starting on <strong className="text-white">D</strong>: D → skip E → F → skip G → A.
          That gives you <strong className="text-amber-300">D F A = D minor</strong> (because D–F is a minor third).
        </p>
        <p className="text-purple-200 text-sm">
          Repeat for every note of the scale. The result is 7 chords — the complete diatonic chord set for that key.
        </p>
      </Card>

      <Card title="The Result — 7 Diatonic Chords (C Major)">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center min-w-[480px]">
            <thead>
              <tr className="text-purple-400 border-b border-white/10">
                <th className="pb-2 text-left">Degree</th>
                <th className="pb-2">Chord</th>
                <th className="pb-2">Type</th>
                <th className="pb-2">Notes</th>
                <th className="pb-2 text-left pl-2">Nashville #</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {[
                { deg: "I",    chord: "C",    type: "Major",     notes: "C E G",   num: "1" },
                { deg: "ii",   chord: "Dm",   type: "Minor",     notes: "D F A",   num: "2m" },
                { deg: "iii",  chord: "Em",   type: "Minor",     notes: "E G B",   num: "3m" },
                { deg: "IV",   chord: "F",    type: "Major",     notes: "F A C",   num: "4" },
                { deg: "V",    chord: "G",    type: "Major",     notes: "G B D",   num: "5" },
                { deg: "vi",   chord: "Am",   type: "Minor",     notes: "A C E",   num: "6m" },
                { deg: "vii°", chord: "Bdim", type: "Diminished",notes: "B D F",   num: "7°" },
              ].map(r => (
                <tr key={r.deg} className="text-sm">
                  <td className="py-2 text-left"><Pill degree={r.deg} /></td>
                  <td className="py-2 text-white font-bold">{r.chord}</td>
                  <td className="py-2 text-purple-300">{r.type}</td>
                  <td className="py-2 font-mono text-green-300 text-xs">{r.notes}</td>
                  <td className="py-2 text-amber-300 text-left pl-2">{r.num}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Callout type="tip">
        The pattern of chord types is always the same regardless of key: <strong className="text-white">Major Minor Minor Major Major Minor Diminished</strong>.
        I ii iii IV V vi vii° — memorise this sequence and you can build the diatonic chords for any major key instantly.
      </Callout>

      <Card title="Why This Matters for Guitar">
        <ul className="space-y-2 text-sm text-purple-200">
          <li>• <span className="text-white font-semibold">Songwriting:</span> Every chord in your progression should (usually) come from this family — instant harmony.</li>
          <li>• <span className="text-white font-semibold">Soloing:</span> When a chord changes, you know which scale notes belong to it — target chord tones confidently.</li>
          <li>• <span className="text-white font-semibold">Ear training:</span> Recognise which degree a chord is by its sound. The IV always sounds 'lifting'; the V always sounds 'tense'.</li>
          <li>• <span className="text-white font-semibold">Transposing:</span> Know the pattern, not the chord names — move to any key instantly.</li>
        </ul>
      </Card>
    </div>
  )
}

// ─── Major Scale Harmony ──────────────────────────────────────────────────────
const MAJOR_KEYS: Record<string, { chords: string[]; notes: string[] }> = {
  C:  { chords: ["C",  "Dm",  "Em",  "F",   "G",   "Am",  "Bdim"],  notes: ["C","D","E","F","G","A","B"] },
  G:  { chords: ["G",  "Am",  "Bm",  "C",   "D",   "Em",  "F#dim"], notes: ["G","A","B","C","D","E","F#"] },
  D:  { chords: ["D",  "Em",  "F#m", "G",   "A",   "Bm",  "C#dim"], notes: ["D","E","F#","G","A","B","C#"] },
  A:  { chords: ["A",  "Bm",  "C#m", "D",   "E",   "F#m", "G#dim"], notes: ["A","B","C#","D","E","F#","G#"] },
  E:  { chords: ["E",  "F#m", "G#m", "A",   "B",   "C#m", "D#dim"], notes: ["E","F#","G#","A","B","C#","D#"] },
  F:  { chords: ["F",  "Gm",  "Am",  "Bb",  "C",   "Dm",  "Edim"],  notes: ["F","G","A","Bb","C","D","E"] },
  Bb: { chords: ["Bb", "Cm",  "Dm",  "Eb",  "F",   "Gm",  "Adim"],  notes: ["Bb","C","D","Eb","F","G","A"] },
}
const DEGREE_LABELS = ["I","ii","iii","IV","V","vi","vii°"]
const DEGREE_TYPES  = ["Major","Minor","Minor","Major","Major","Minor","Dim"]

function MajorHarmonyTab() {
  const [key, setKey] = useState("G")
  const data = MAJOR_KEYS[key]

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Major Scale — Diatonic Chords</h2>
      <p className="text-purple-200 mb-6">
        Every major key produces the same pattern of 7 chords. The chord types never change — only the root notes shift.
        Select a key to see its diatonic chord set.
      </p>

      {/* Key selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.keys(MAJOR_KEYS).map(k => (
          <button
            key={k}
            onClick={() => setKey(k)}
            className={`px-4 py-1.5 rounded-xl text-sm font-bold transition-all ${
              key === k ? "bg-purple-600 text-white" : "bg-white/10 text-purple-300 hover:bg-white/20"
            }`}
          >{k} Major</button>
        ))}
      </div>

      {/* Scale notes */}
      <div className="flex gap-1 mb-6 flex-wrap">
        {data.notes.map((n, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="bg-white/10 border border-white/20 rounded-lg w-10 h-10 flex items-center justify-center text-white font-bold text-sm">{n}</div>
            <div className="text-purple-400 text-xs mt-1">{DEGREE_LABELS[i]}</div>
          </div>
        ))}
      </div>

      {/* Chord table */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-6">
        {data.chords.map((chord, i) => (
          <div key={i} className="bg-white/10 border border-white/20 rounded-xl p-4 flex items-center gap-3">
            <Pill degree={DEGREE_LABELS[i]} />
            <div>
              <p className="text-white font-bold">{chord}</p>
              <p className="text-purple-300 text-xs">{DEGREE_TYPES[i]}</p>
            </div>
          </div>
        ))}
      </div>

      <Callout type="insight">
        The pattern is always: <strong className="text-white">Major · Minor · Minor · Major · Major · Minor · Diminished</strong>.
        In Nashville terms: 1 · 2m · 3m · 4 · 5 · 6m · 7°. Memorise this once — it works in every key.
      </Callout>

      <Card title="The Big 3 Diatonic Relationships">
        <div className="space-y-3 text-sm">
          {[
            { name: "I → IV → V (the workhorse)", desc: "Three major chords. The foundation of blues, country, rock, and pop. In G: G → C → D.", example: "G major: G C D" },
            { name: "I → vi → IV → V (the 50s loop)", desc: "Adds the relative minor. Sounds instantly familiar. In G: G Em C D.", example: "G major: G Em C D" },
            { name: "ii → V → I (the resolution)", desc: "Jazz and classical standard. Maximum tension to resolution. In G: Am D G.", example: "G major: Am D G" },
          ].map(r => (
            <div key={r.name} className="border-b border-white/10 pb-3">
              <p className="text-amber-300 font-semibold">{r.name}</p>
              <p className="text-purple-200 text-xs mt-1">{r.desc}</p>
              <p className="text-green-300 font-mono text-xs mt-1">{r.example} (in {key}:  {r.example.split(" ").map(n => {
                // Replace note names with key-transposed versions: just show the current key's chords
                return n
              }).join(" ")})</p>
            </div>
          ))}
        </div>
      </Card>

      <Card title={`Common Progressions in ${key} Major`}>
        <div className="space-y-2 text-sm font-mono">
          {[
            { prog: "I – V – vi – IV", chords: [0,4,5,3] },
            { prog: "I – IV – V",      chords: [0,3,4] },
            { prog: "I – vi – IV – V", chords: [0,5,3,4] },
            { prog: "ii – V – I",      chords: [1,4,0] },
            { prog: "I – V – IV – I",  chords: [0,4,3,0] },
          ].map(p => (
            <div key={p.prog} className="flex items-center gap-4 border-b border-white/10 pb-2">
              <span className="text-purple-400 w-32 text-xs">{p.prog}</span>
              <span className="text-green-300">{p.chords.map(i => data.chords[i]).join(" – ")}</span>
            </div>
          ))}
        </div>
      </Card>

      <Callout type="exercise">
        <p className="font-semibold mb-1">Exercise: Strum the Diatonic Chords</p>
        Pick any key above. Play through all 7 chords slowly, one strum each. Notice how they all sound like they &quot;belong&quot; together. Then pick 3 or 4 and try to write a chord progression. You&apos;re using diatonic harmony.
      </Callout>
    </div>
  )
}

// ─── Minor Scale Harmony ──────────────────────────────────────────────────────
const MINOR_KEYS: Record<string, { chords: string[]; notes: string[] }> = {
  Am: { chords: ["Am",  "Bdim", "C",   "Dm",  "Em",  "F",   "G"],   notes: ["A","B","C","D","E","F","G"] },
  Em: { chords: ["Em",  "F#dim","G",   "Am",  "Bm",  "C",   "D"],   notes: ["E","F#","G","A","B","C","D"] },
  Dm: { chords: ["Dm",  "Edim", "F",   "Gm",  "Am",  "Bb",  "C"],   notes: ["D","E","F","G","A","Bb","C"] },
  Bm: { chords: ["Bm",  "C#dim","D",   "Em",  "F#m", "G",   "A"],   notes: ["B","C#","D","E","F#","G","A"] },
  "F#m":{ chords: ["F#m", "G#dim","A",   "Bm",  "C#m", "D",   "E"],   notes: ["F#","G#","A","B","C#","D","E"] },
}
const MINOR_DEGREE_LABELS = ["i","ii°","III","iv","v","VI","VII"]
const MINOR_DEGREE_TYPES  = ["Minor","Dim","Major","Minor","Minor","Major","Major"]

function MinorHarmonyTab() {
  const [key, setKey] = useState("Am")
  const data = MINOR_KEYS[key]

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Minor Scale — Diatonic Chords</h2>
      <p className="text-purple-200 mb-6">
        The natural minor scale produces a different chord pattern: the i chord is minor, and the v chord is also minor (unlike the major key where V is major).
        This gives minor keys a darker, more melancholic quality.
      </p>

      {/* Key selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.keys(MINOR_KEYS).map(k => (
          <button
            key={k}
            onClick={() => setKey(k)}
            className={`px-4 py-1.5 rounded-xl text-sm font-bold transition-all ${
              key === k ? "bg-purple-600 text-white" : "bg-white/10 text-purple-300 hover:bg-white/20"
            }`}
          >{k}</button>
        ))}
      </div>

      {/* Scale notes */}
      <div className="flex gap-1 mb-6 flex-wrap">
        {data.notes.map((n, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="bg-white/10 border border-white/20 rounded-lg w-10 h-10 flex items-center justify-center text-white font-bold text-sm">{n}</div>
            <div className="text-purple-400 text-xs mt-1">{MINOR_DEGREE_LABELS[i]}</div>
          </div>
        ))}
      </div>

      {/* Chord grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-6">
        {data.chords.map((chord, i) => (
          <div key={i} className="bg-white/10 border border-white/20 rounded-xl p-4 flex items-center gap-3">
            <Pill degree={MINOR_DEGREE_LABELS[i]} />
            <div>
              <p className="text-white font-bold">{chord}</p>
              <p className="text-purple-300 text-xs">{MINOR_DEGREE_TYPES[i]}</p>
            </div>
          </div>
        ))}
      </div>

      <Callout type="insight">
        Minor pattern: <strong className="text-white">Minor · Dim · Major · Minor · Minor · Major · Major</strong>.
        The two major chords (♭VI and ♭VII) are where minor keys get their characteristic &quot;lift&quot; — think the chorus of Hotel California (VI → III → VII → iv).
      </Callout>

      <Card title={`Common Progressions in ${key}`}>
        <div className="space-y-2 text-sm font-mono">
          {[
            { prog: "i – VII – VI – VII",   chords: [0,6,5,6] },
            { prog: "i – VI – III – VII",   chords: [0,5,2,6] },
            { prog: "i – iv – VII – III",   chords: [0,3,6,2] },
            { prog: "i – VI – VII – i",     chords: [0,5,6,0] },
            { prog: "i – v – VI – VII",     chords: [0,4,5,6] },
          ].map(p => (
            <div key={p.prog} className="flex items-center gap-4 border-b border-white/10 pb-2">
              <span className="text-purple-400 w-36 text-xs">{p.prog}</span>
              <span className="text-green-300">{p.chords.map(i => data.chords[i]).join(" – ")}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card title="The Harmonic Minor Twist">
        <p className="text-purple-200 text-sm mb-3">
          Natural minor has a minor v chord (weak resolution). Raising the 7th by a half step creates the <strong className="text-white">harmonic minor</strong> scale —
          turning v into V (major), which gives a strong, classical resolution back to i.
        </p>
        <div className="space-y-2 text-sm">
          {[
            { label: "Natural minor v",   example: key === "Am" ? "Em" : key === "Em" ? "Bm" : key === "Dm" ? "Am" : "Fm", feel: "Weak, drifting" },
            { label: "Harmonic minor V7", example: key === "Am" ? "E7" : key === "Em" ? "B7" : key === "Dm" ? "A7" : "F#7", feel: "Strong pull back to i — classical sound" },
          ].map(r => (
            <div key={r.label} className="flex gap-4 border-b border-white/10 pb-2">
              <span className="text-purple-300 w-36">{r.label}</span>
              <span className="text-amber-300 font-bold w-10">{r.example}</span>
              <span className="text-purple-200 text-xs">{r.feel}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ─── Chord → Scale ────────────────────────────────────────────────────────────
function ChordScaleTab() {
  const relationships = [
    {
      chord: "Major chord (e.g. G)",
      scales: ["G Major (Ionian)", "G Lydian (#4 — dreamy)"],
      avoid: "G Dorian, G Phrygian (contain notes that clash with the major 3rd)",
      best: "G Major scale / G Lydian",
      color: "border-emerald-500",
    },
    {
      chord: "Dominant 7 (e.g. G7)",
      scales: ["G Mixolydian (♭7)", "G Blues scale", "G Minor pentatonic"],
      avoid: "G Major scale (F# clashes with F natural in G7)",
      best: "G Mixolydian",
      color: "border-amber-500",
    },
    {
      chord: "Minor chord (e.g. Am)",
      scales: ["A Dorian (natural 6 — cool)", "A Aeolian (♭6 — dark)", "A Minor pentatonic"],
      avoid: "A Major (major 3rd clashes with minor chord)",
      best: "A Dorian or A Aeolian depending on mood",
      color: "border-blue-500",
    },
    {
      chord: "Minor 7 (e.g. Am7)",
      scales: ["A Dorian (the jazz choice)", "A Aeolian"],
      avoid: "A Phrygian (♭2 clashes with B natural in most Am7 contexts)",
      best: "A Dorian",
      color: "border-indigo-500",
    },
    {
      chord: "Diminished (e.g. Bdim)",
      scales: ["B Locrian", "Diminished scale (whole-half)", "B Minor pentatonic"],
      avoid: "Most major scales — too many clashes",
      best: "Treat as a passing chord, not a long solo destination",
      color: "border-slate-500",
    },
    {
      chord: "Major 7 (e.g. Cmaj7)",
      scales: ["C Ionian (Major)", "C Lydian (#4 — floaty)"],
      avoid: "C Mixolydian (♭7 clashes with the maj7)",
      best: "C Lydian for a modern, open sound",
      color: "border-purple-500",
    },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Chord → Which Scale?</h2>
      <p className="text-purple-200 mb-6">
        The reverse question: given a chord that&apos;s being played, which scale can you solo over it?
        The answer comes directly from diatonic theory — match the scale to the chord quality and avoid notes that clash with the chord tones.
      </p>

      <Callout type="insight">
        The rule of thumb: <strong className="text-white">your scale must contain all the notes of the chord being played</strong>.
        If the chord has a major 3rd, your scale must also have a major 3rd. If it has a ♭7, your scale must have a ♭7.
      </Callout>

      <div className="space-y-4">
        {relationships.map(r => (
          <div key={r.chord} className={`bg-white/10 border-l-4 ${r.color} rounded-xl p-5`}>
            <h3 className="text-white font-bold mb-3">{r.chord}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex gap-2 flex-wrap">
                <span className="text-purple-400 text-xs w-24 flex-shrink-0 mt-0.5">Use:</span>
                <div className="flex flex-wrap gap-1">
                  {r.scales.map(s => (
                    <span key={s} className="bg-green-500/20 text-green-300 border border-green-500/30 rounded-lg px-2 py-0.5 text-xs">{s}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <span className="text-purple-400 text-xs w-24 flex-shrink-0 mt-0.5">Best choice:</span>
                <span className="text-amber-300 text-xs font-semibold">{r.best}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-purple-400 text-xs w-24 flex-shrink-0 mt-0.5">Avoid:</span>
                <span className="text-red-300 text-xs">{r.avoid}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Callout type="tip">
        In practice, over a simple I IV V blues in A: use A minor pentatonic for the whole thing. It works over all three dominant 7 chords.
        For a jazz chord progression with major 7s and minor 7s — match each chord individually using the table above.
      </Callout>

      <Card title="The Shortcut: Stay Diatonic">
        <p className="text-purple-200 text-sm mb-3">
          If the song is in one key and the chords are all diatonic (from that key), you can solo using the key&apos;s major or minor scale throughout — no need to switch scale per chord.
          This covers 80% of pop, rock, country, and folk music.
        </p>
        <p className="text-purple-200 text-sm">
          Only switch scales chord-by-chord when:
        </p>
        <ul className="space-y-1 text-sm text-purple-200 mt-2">
          <li>• The song modulates (changes key)</li>
          <li>• There&apos;s a chord borrowed from another key (e.g. a IV7 or ♭VII)</li>
          <li>• You&apos;re playing jazz, where each chord gets its own mode</li>
        </ul>
      </Card>
    </div>
  )
}

// ─── On the Guitar ────────────────────────────────────────────────────────────
function OnGuitarTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Diatonic Chords on the Guitar</h2>
      <p className="text-purple-200 mb-6">
        Here&apos;s how diatonic harmony maps directly onto the fretboard — chord shapes, scale positions, and how to use both together when playing.
      </p>

      <Card title="G Major Diatonic Chords — Open Position">
        <p className="text-purple-200 text-sm mb-3">The 7 diatonic chords of G major using open chord shapes:</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center min-w-[500px]">
            <thead>
              <tr className="text-purple-400 border-b border-white/10">
                <th className="pb-2">Degree</th>
                <th className="pb-2">Chord</th>
                <th className="pb-2">Shape</th>
                <th className="pb-2">Notes on guitar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {[
                { deg: "I",    chord: "G",    shape: "G open",    notes: "x-x-0-0-0-3 (EADGBe)" },
                { deg: "ii",   chord: "Am",   shape: "Am open",   notes: "x-0-2-2-1-0" },
                { deg: "iii",  chord: "Bm",   shape: "Bm barre",  notes: "x-2-4-4-3-2 (2nd fret)" },
                { deg: "IV",   chord: "C",    shape: "C open",    notes: "x-3-2-0-1-0" },
                { deg: "V",    chord: "D",    shape: "D open",    notes: "x-x-0-2-3-2" },
                { deg: "vi",   chord: "Em",   shape: "Em open",   notes: "0-2-2-0-0-0" },
                { deg: "vii°", chord: "F#dim",shape: "Diminished",notes: "2-0-2-1-x-x" },
              ].map(r => (
                <tr key={r.deg}>
                  <td className="py-2"><Pill degree={r.deg} /></td>
                  <td className="py-2 text-white font-bold">{r.chord}</td>
                  <td className="py-2 text-purple-300">{r.shape}</td>
                  <td className="py-2 font-mono text-green-300 text-xs">{r.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <TabBlock label="Diatonic chord progression in G — strum through the key">
{`G         Em        C         D
e|--3------|--0------|--0------|--2------|
B|--3------|--0------|--1------|--3------|
G|--0------|--0------|--0------|--2------|
D|--0------|--2------|--2------|--0------|
A|--2------|--2------|--3------|--x------|
E|--3------|--0------|--x------|--x------|
  I         vi        IV        V

All 4 chords come from G major — they'll always sound right together`}
      </TabBlock>

      <TabBlock label="G major scale + diatonic chord tones (how they overlap)">
{`G major scale (Position 1):
e|--2-3-5-------|
B|--3-5---------|
G|--2-4-5-------|
D|--2-3-5-------|
A|--2-3-5-------|
E|--2-3-5-------|

G chord tones (I): G B D — the 1st, 3rd, 5th notes of the scale
Am chord tones (ii): A C E — the 2nd, 4th, 6th notes of the scale
D chord tones (V): D F# A — the 5th, 7th, 2nd notes of the scale

→ Every diatonic chord is made from notes already in the scale`}
      </TabBlock>

      <Card title="How to Use This When Soloing">
        <ol className="space-y-3 text-sm text-purple-200">
          <li>
            <span className="text-white font-semibold">Step 1 — Identify the key.</span>
            <p>What key is the song in? If the chords are G Em C D, you&apos;re in G major.</p>
          </li>
          <li>
            <span className="text-white font-semibold">Step 2 — Play the key&apos;s scale.</span>
            <p>G major scale works over the whole progression. You don&apos;t need to switch scale per chord.</p>
          </li>
          <li>
            <span className="text-white font-semibold">Step 3 — Target chord tones on beat 1.</span>
            <p>When the G chord plays, land on G, B, or D. When Em plays, land on E, G, or B. The rest is just passing notes.</p>
          </li>
          <li>
            <span className="text-white font-semibold">Step 4 — Use the chord shapes as guides.</span>
            <p>The notes inside each chord shape on the fretboard ARE the chord tones. Overlay your scale and target those dots.</p>
          </li>
        </ol>
      </Card>

      <TabBlock label="Targeting chord tones over I → IV → V in G">
{`Over G (I):    Land on G, B, or D on beat 1
e|--3----5-3----|  ← G (fret 3), B (fret 0 open)
B|--0----3------|
G|--------------|

Over C (IV):   Land on C, E, or G on beat 1
e|--0----3-0----|  ← E (open), C (fret 5 G string)
B|--1----3------|
G|--0----2------|

Over D (V):    Land on D, F#, or A on beat 1
e|--2----5-3----|  ← D (fret 2), F# (fret 2 e-string)
B|--3----5------|
G|--2----4------|`}
      </TabBlock>

      <Callout type="tip">
        Practice playing the chord on beat 1 of each bar with your left hand, then solo with your right. This physically forces you to feel the chord change and target the right notes simultaneously.
      </Callout>
    </div>
  )
}

// ─── Practice ─────────────────────────────────────────────────────────────────
function PracticeTab() {
  const [openKey, setOpenKey] = useState<string | null>(null)

  const exercises = [
    {
      title: "Exercise 1 — Strum All 7 Diatonic Chords",
      difficulty: "Beginner",
      goal: "Build familiarity with the chord family in a key",
      steps: [
        "Choose a key (start with G major)",
        "Play each of the 7 diatonic chords in order: G Am Bm C D Em F#dim",
        "One bar each (4 strums per chord), 70 BPM",
        "Listen to how they all sound like they belong together",
        "Try starting on different chords — start on vi (Em) and the key feels minor",
      ],
    },
    {
      title: "Exercise 2 — Write a Progression",
      difficulty: "Beginner",
      goal: "Understand chord selection from the diatonic set",
      steps: [
        "Pick a key: G major. Your chords: G Am Bm C D Em F#dim",
        "Choose any 3 or 4 chords from that list",
        "Play them in a loop — it will sound like a song",
        "Try: G – D – Em – C (I V vi IV) — the most used progression in pop",
        "Try: Em – C – G – D (vi IV I V) — same chords, starts minor",
      ],
    },
    {
      title: "Exercise 3 — Scale Over Chord Changes",
      difficulty: "Intermediate",
      goal: "Use one scale over multiple diatonic chords",
      steps: [
        "Set a backing track: G – C – D (I IV V in G major)",
        "Solo using only the G major scale (or G pentatonic to start)",
        "As each chord changes, try to land on a chord tone on beat 1",
        "G chord → land on G, B, or D. C chord → land on C, E, or G. D chord → land on D, F#, or A",
        "Record yourself — listen back to hear how the chord tones anchor your phrases",
      ],
    },
    {
      title: "Exercise 4 — Identify Chord Degrees by Ear",
      difficulty: "Intermediate",
      goal: "Train your ear to recognise chord function",
      steps: [
        "Play G (I) — notice it feels stable, at home",
        "Play C (IV) — notice the lift, the 'going somewhere' feeling",
        "Play D (V) — notice the tension, wanting to resolve back to G",
        "Play Em (vi) — notice the melancholy, the 'shadow' of the key",
        "Practice until you can tell I IV V vi by their emotional quality alone",
      ],
    },
    {
      title: "Exercise 5 — Mode Per Chord (Advanced)",
      difficulty: "Advanced",
      goal: "Match a mode to each chord in a progression",
      steps: [
        "Progression: Gmaj7 – Am7 – Bm7 – Cmaj7 (I – ii – iii – IV in G)",
        "Over Gmaj7: play G Ionian (major scale)",
        "Over Am7: play A Dorian (start scale on A, same notes as G major)",
        "Over Bm7: play B Phrygian (start on B)",
        "Over Cmaj7: play C Lydian (start on C — same notes again!)",
        "Notice: same notes, different starting point — that's modal thinking",
      ],
    },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Practice Exercises</h2>
      <p className="text-purple-200 mb-6">Five exercises that take you from &quot;knowing the theory&quot; to &quot;hearing and using it&quot;. Work through them in order.</p>

      <Callout type="insight">
        The goal isn&apos;t to memorise chord names — it&apos;s to hear the function. When you can feel the difference between I, IV, V, and vi just by listening, diatonic harmony becomes instinctive.
      </Callout>

      <div className="space-y-3">
        {exercises.map((ex, i) => {
          const isOpen = openKey === ex.title
          const diffColor = ex.difficulty === "Beginner" ? "text-green-400 bg-green-400/10 border-green-400/30"
            : ex.difficulty === "Intermediate" ? "text-amber-400 bg-amber-400/10 border-amber-400/30"
            : "text-red-400 bg-red-400/10 border-red-400/30"
          return (
            <div key={i} className="bg-white/10 border border-white/20 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenKey(isOpen ? null : ex.title)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-purple-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">{i + 1}</div>
                  <div>
                    <p className="text-white font-semibold">{ex.title}</p>
                    <p className="text-purple-300 text-xs">{ex.goal}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs border rounded-full px-2 py-0.5 ${diffColor}`}>{ex.difficulty}</span>
                  <span className="text-purple-400 text-lg">{isOpen ? "−" : "+"}</span>
                </div>
              </button>
              {isOpen && (
                <div className="px-5 pb-5 border-t border-white/10 pt-4">
                  <ol className="space-y-2">
                    {ex.steps.map((step, si) => (
                      <li key={si} className="flex gap-3 text-sm text-purple-200">
                        <span className="text-purple-500 font-mono text-xs mt-0.5 flex-shrink-0">{si + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <Card title="Quick Reference — The Pattern You Need to Memorise">
        <div className="space-y-2">
          <div>
            <p className="text-amber-300 font-semibold text-sm mb-2">Major Key Chord Types:</p>
            <div className="flex gap-2 flex-wrap">
              {[["I","Major"],["ii","Minor"],["iii","Minor"],["IV","Major"],["V","Major"],["vi","Minor"],["vii°","Dim"]].map(([deg, type]) => (
                <div key={deg} className="text-center">
                  <Pill degree={deg} />
                  <p className="text-purple-300 text-xs mt-1">{type}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <p className="text-blue-300 font-semibold text-sm mb-2">Minor Key Chord Types:</p>
            <div className="flex gap-2 flex-wrap">
              {[["i","Minor"],["ii°","Dim"],["III","Major"],["iv","Minor"],["v","Minor"],["VI","Major"],["VII","Major"]].map(([deg, type]) => (
                <div key={deg} className="text-center">
                  <Pill degree={deg} />
                  <p className="text-purple-300 text-xs mt-1">{type}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DiatonicChordsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("what-is-it")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link href="/" className="text-purple-300 hover:text-white text-sm">← Back to modules</Link>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Diatonic Chords</h1>
          <p className="text-purple-200">Discover the 7 chords that live inside every scale — and learn which scales to solo with over any chord.</p>
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
          {activeTab === "what-is-it"    && <WhatIsItTab />}
          {activeTab === "major-harmony" && <MajorHarmonyTab />}
          {activeTab === "minor-harmony" && <MinorHarmonyTab />}
          {activeTab === "chord-scale"   && <ChordScaleTab />}
          {activeTab === "on-guitar"     && <OnGuitarTab />}
          {activeTab === "practice"      && <PracticeTab />}
        </div>
      </div>
    </div>
  )
}
