"use client"

import React, { useState } from "react"
import Link from "next/link"

type Tab = "how-it-works" | "key-calculator" | "common-positions" | "transposing" | "partial-tips"

const TABS: { id: Tab; label: string }[] = [
  { id: "how-it-works",      label: "How It Works" },
  { id: "key-calculator",    label: "Key Calculator" },
  { id: "common-positions",  label: "Common Positions" },
  { id: "transposing",       label: "Transposing Songs" },
  { id: "partial-tips",      label: "Partial Capos & Tips" },
]

const CHROM = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
const COMMON_SHAPES = ["C", "D", "E", "G", "A", "Am", "Em"]

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

function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-4">
      {title && <h3 className="text-lg font-bold text-white mb-3">{title}</h3>}
      {children}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
function HowItWorksTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">How a Capo Works</h2>
      <p className="text-purple-200 mb-6">
        A capo clamps across all strings at a given fret, acting as a movable nut. Your chord shapes
        stay exactly the same — the key shifts up by however many frets the capo is placed.
      </p>

      <Callout type="insight">
        Capo at fret 2 means every note sounds <strong className="text-white">2 semitones higher</strong> than
        the shape you play. Play a G shape with capo 2 and you are playing A. The muscle memory
        does not change — only the pitch coming out of the guitar does.
      </Callout>

      <Card title="The Core Formula">
        <div className="bg-black/30 rounded-xl p-4 mb-4 text-center">
          <p className="text-amber-400 text-xl font-bold font-mono">Key = Shape Root + Capo Fret</p>
          <p className="text-purple-300 text-sm mt-2">Count up the chromatic scale from the shape root by the capo fret number</p>
        </div>
        <div className="space-y-2 text-sm">
          {[
            { shape: "G shape", capo: "Capo 2", result: "A",  detail: "G → G# → A" },
            { shape: "C shape", capo: "Capo 2", result: "D",  detail: "C → C# → D" },
            { shape: "D shape", capo: "Capo 2", result: "E",  detail: "D → D# → E" },
            { shape: "G shape", capo: "Capo 5", result: "C",  detail: "G → G# → A → A# → B → C" },
            { shape: "E shape", capo: "Capo 1", result: "F",  detail: "E → F" },
            { shape: "A shape", capo: "Capo 3", result: "C",  detail: "A → A# → B → C" },
          ].map(r => (
            <div key={r.shape + r.capo} className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
              <span className="text-purple-300 w-20 flex-shrink-0 text-xs font-semibold">{r.shape}</span>
              <span className="text-amber-400 w-16 flex-shrink-0 text-xs">{r.capo}</span>
              <span className="text-white font-bold w-8 flex-shrink-0">→ {r.result}</span>
              <span className="text-slate-400 text-xs">{r.detail}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Why Use a Capo?">
        <div className="space-y-4 text-sm">
          {[
            {
              num: "1",
              title: "Match a singer's key without learning new shapes",
              body: "If a singer needs a song in Bb but you know it in G, capo at fret 3 and play G shapes. Same fingering, right key.",
            },
            {
              num: "2",
              title: "Keep the brightness of open chord voicings higher up the neck",
              body: "Open chords have a natural resonance and ring that barre chords cannot fully replicate. A capo at fret 5 gives you open chord brightness in the key of C, D, or G depending on shape.",
            },
            {
              num: "3",
              title: "Play a song in its original key without barre chords",
              body: "Many recordings use capo so the guitarist could use open shapes rather than barre chords. 'Wonderwall', 'Here Comes the Sun', 'Jolene' are classic examples.",
            },
          ].map(r => (
            <div key={r.num} className="flex gap-3 border-b border-white/10 pb-3">
              <div className="bg-purple-600 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5">{r.num}</div>
              <div>
                <p className="text-white font-semibold mb-1">{r.title}</p>
                <p className="text-purple-300">{r.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Chromatic Reference — 12 Semitones">
        <p className="text-purple-300 text-xs mb-3">Count forward from any note to find the result of adding capo frets.</p>
        <div className="flex flex-wrap gap-2">
          {CHROM.map((note, i) => (
            <div key={i} className="text-center">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-sm font-bold text-white">{note}</div>
              <p className="text-purple-500 text-xs mt-0.5">{i}</p>
            </div>
          ))}
        </div>
        <p className="text-purple-400 text-xs mt-3">After B (index 11), wrap back to C (index 0). The chromatic scale is circular.</p>
      </Card>

      <Callout type="insight">
        A capo is <strong className="text-white">not cheating</strong> — it is a legitimate tool that changes the timbre and
        allows musical choices unavailable without one. Every major acoustic player from James Taylor to
        Ed Sheeran to Neil Young uses a capo regularly. It enables you to serve the song.
      </Callout>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
function KeyCalculatorTab() {
  const [shapeIdx, setShapeIdx] = useState(7)   // G
  const [capoFret, setCapoFret] = useState(0)
  const [targetKey, setTargetKey] = useState(9) // A

  const resultKey = CHROM[(shapeIdx + capoFret) % 12]

  // Tool 2: for a given target key, show capo options 0-7
  const capoOptions = Array.from({ length: 8 }, (_, capo) => {
    const shapeRoot = (targetKey - capo + 12) % 12
    const shapeName = CHROM[shapeRoot]
    const isEasy = COMMON_SHAPES.some(s => s === shapeName || s === shapeName + "m")
    return { capo, shapeName, isEasy }
  })

  const bestOption = capoOptions.find(o => o.isEasy) ?? capoOptions[0]

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Key Calculator</h2>
      <p className="text-purple-200 mb-6">Two tools: find out what key you are in, or find out which shapes and capo position to use for a given key.</p>

      {/* Tool 1 */}
      <Card title="Tool 1 — What key am I in?">
        <p className="text-purple-300 text-sm mb-4">Select your chord shape and capo fret to see your actual key.</p>

        <div className="mb-4">
          <p className="text-purple-400 text-xs mb-2">I am playing a ___ shape</p>
          <div className="flex flex-wrap gap-2">
            {CHROM.map((note, i) => (
              <button
                key={i}
                onClick={() => setShapeIdx(i)}
                className={`w-12 py-2 rounded-xl text-sm font-bold transition-all ${
                  shapeIdx === i ? "bg-purple-600 text-white" : "bg-white/10 text-purple-300 hover:bg-white/20"
                }`}
              >{note}</button>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <p className="text-purple-400 text-xs mb-2">Capo on fret ___</p>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 8 }, (_, i) => (
              <button
                key={i}
                onClick={() => setCapoFret(i)}
                className={`w-10 py-2 rounded-xl text-sm font-bold transition-all ${
                  capoFret === i ? "bg-purple-600 text-white" : "bg-white/10 text-purple-300 hover:bg-white/20"
                }`}
              >{i}</button>
            ))}
          </div>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/40 rounded-xl p-5 text-center">
          <p className="text-purple-300 text-sm mb-1">
            {CHROM[shapeIdx]} shape + capo {capoFret} =
          </p>
          <p className="text-amber-400 text-4xl font-bold">
            Key of {resultKey}
          </p>
          {capoFret === 0 && (
            <p className="text-purple-400 text-xs mt-2">No capo — the shape root is your key.</p>
          )}
        </div>
      </Card>

      {/* Tool 2 */}
      <Card title="Tool 2 — What shapes and capo do I need?">
        <p className="text-purple-300 text-sm mb-4">Select the key of the song to see all capo options up to fret 7.</p>

        <div className="mb-5">
          <p className="text-purple-400 text-xs mb-2">Song is in the key of ___</p>
          <div className="flex flex-wrap gap-2">
            {CHROM.map((note, i) => (
              <button
                key={i}
                onClick={() => setTargetKey(i)}
                className={`w-12 py-2 rounded-xl text-sm font-bold transition-all ${
                  targetKey === i ? "bg-amber-500 text-black" : "bg-white/10 text-purple-300 hover:bg-white/20"
                }`}
              >{note}</button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[400px]">
            <thead>
              <tr className="text-purple-400 border-b border-white/10 text-xs">
                <th className="pb-2 text-left">Capo</th>
                <th className="pb-2 text-left">Play shape</th>
                <th className="pb-2 text-left">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {capoOptions.map(opt => (
                <tr
                  key={opt.capo}
                  className={opt.capo === bestOption.capo ? "bg-amber-500/10" : ""}
                >
                  <td className="py-2 pr-4">
                    <span className={`font-bold ${opt.capo === bestOption.capo ? "text-amber-400" : "text-purple-300"}`}>
                      {opt.capo === 0 ? "No capo" : `Capo ${opt.capo}`}
                    </span>
                  </td>
                  <td className="py-2 pr-4">
                    <span className={`font-bold ${opt.isEasy ? "text-green-300" : "text-slate-400"}`}>
                      {opt.shapeName} shape
                    </span>
                  </td>
                  <td className="py-2 text-xs text-purple-400">
                    {opt.capo === bestOption.capo && opt.isEasy
                      ? "Recommended — common open shape"
                      : opt.isEasy
                        ? "Guitar-friendly shape"
                        : "Less common shape"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-purple-400 mt-3">
          Green shapes (C, D, E, G, A, Am, Em) have the most open strings and are easiest to play.
          The highlighted row is the recommended starting point.
        </p>
      </Card>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
function CommonPositionsTab() {
  const positions = [
    {
      capo: 1,
      keys: "C→C#, G→G#, D→D#, A→A#, E→F",
      songs: [
        { title: "Zombie", artist: "The Cranberries", shape: "Am capo 1", note: "Iconic Am–C–G–F progression shifted to Am-like shapes" },
        { title: "Every Rose Has Its Thorn", artist: "Poison", shape: "G capo 1", note: "G, Cadd9, D shapes give the G# arena ballad feel" },
        { title: "Fast Car", artist: "Tracy Chapman", shape: "C capo 1 (partial)", note: "Fingerpicked open shapes one semitone up" },
      ],
    },
    {
      capo: 2,
      keys: "D→E, C→D, G→A, A→B, E→F#",
      songs: [
        { title: "Wonderwall", artist: "Oasis", shape: "Am / G capo 2", note: "Noel Gallagher's signature capo position — Cadd9 and G shapes ring out" },
        { title: "Layla (acoustic)", artist: "Derek & The Dominos", shape: "G capo 2", note: "Unplugged version uses G shapes to get the A key sound" },
        { title: "Blackbird", artist: "The Beatles", shape: "G capo 2", note: "McCartney's fingerstyle melody in G position sounds in A" },
        { title: "More Than Words", artist: "Extreme", shape: "G capo 2", note: "G and Em shapes with intricate picking" },
        { title: "Daughter", artist: "Pearl Jam", shape: "G capo 2", note: "Open G shape, dropped D — capo 2 for the key of A" },
      ],
    },
    {
      capo: 3,
      keys: "G→Bb, C→Eb, A→C, D→F, E→G",
      songs: [
        { title: "Jolene", artist: "Dolly Parton", shape: "Am capo 3", note: "Classic Am-C-G-E in Dm — the heartbreak key" },
        { title: "Horse With No Name", artist: "America", shape: "Em capo 3", note: "Two-chord groove (Em-D6) sits in Gm with capo 3" },
        { title: "Norwegian Wood", artist: "The Beatles", shape: "D/G capo 3", note: "Lennon's modal folk feel transposed up" },
        { title: "Don't Think Twice It's Alright", artist: "Bob Dylan", shape: "C capo 3", note: "Dylan fingerpicking in Eb using C shapes" },
      ],
    },
    {
      capo: 4,
      keys: "D→F#, G→B, C→E, A→C#, E→G#",
      songs: [
        { title: "Wish You Were Here", artist: "Pink Floyd", shape: "G capo 4 (intro)", note: "The iconic fingerpicked intro sits at capo 4 for B" },
        { title: "The Boxer", artist: "Simon & Garfunkel", shape: "C capo 4", note: "C shapes ring in E major — intricate right-hand picking" },
        { title: "Babe I'm Gonna Leave You", artist: "Led Zeppelin", shape: "Am capo 4", note: "Am shapes in C#m, dark and brooding" },
      ],
    },
    {
      capo: 5,
      keys: "G→C, D→G, C→F, A→D, E→A",
      songs: [
        { title: "Here Comes the Sun", artist: "The Beatles", shape: "G capo 5", note: "Harrison's classic — G, Dsus2 and A shapes sound in C" },
        { title: "Redemption Song", artist: "Bob Marley", shape: "G capo 5", note: "Open G voicings, capo 5 lifts to the key of C" },
        { title: "Landslide", artist: "Fleetwood Mac", shape: "C capo 5", note: "Fingerpicked C and G shapes in the key of F" },
        { title: "The A Team", artist: "Ed Sheeran", shape: "G capo 5", note: "Sheeran's open G shapes placed in C with capo 5" },
        { title: "Classical Gas", artist: "Mason Williams", shape: "Am capo 5", note: "Am fingerpicking patterns reach Dm with capo 5" },
      ],
    },
    {
      capo: 7,
      keys: "G→D, D→A, C→G, A→E, E→B",
      songs: [
        { title: "Scarborough Fair", artist: "Simon & Garfunkel", shape: "Am capo 7", note: "Am shapes produce Em-like brightness in the key of Em" },
        { title: "Needle and the Damage Done", artist: "Neil Young", shape: "G capo 7 variation", note: "High capo giving bright, mandolin-like tone" },
        { title: "The Rain Song", artist: "Led Zeppelin", shape: "G capo 7", note: "D major brightness from G shapes, open string resonance" },
        { title: "Fire and Rain", artist: "James Taylor", shape: "D capo 7", note: "A major using D shapes at capo 7, JT's singer-songwriter hallmark" },
      ],
    },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Common Capo Positions</h2>
      <p className="text-purple-200 mb-6">
        The most widely used capo positions with real song examples. Each entry shows the shape played and the resulting key.
      </p>

      <div className="space-y-4">
        {positions.map(pos => (
          <Card key={pos.capo}>
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-purple-600 w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0">{pos.capo}</div>
              <div>
                <p className="text-white font-bold">Capo {pos.capo}</p>
                <p className="text-purple-400 text-xs font-mono">{pos.keys}</p>
              </div>
            </div>
            <div className="space-y-2">
              {pos.songs.map(s => (
                <div key={s.title} className="border-b border-white/10 pb-2 last:border-0 last:pb-0">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <p className="text-white font-semibold text-sm">{s.title}</p>
                    <p className="text-purple-400 text-xs">— {s.artist}</p>
                    <span className="ml-auto bg-amber-500/20 text-amber-300 text-xs px-2 py-0.5 rounded-full font-mono flex-shrink-0">{s.shape}</span>
                  </div>
                  <p className="text-purple-300 text-xs mt-0.5">{s.note}</p>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Callout type="tip">
        Capo 5 and capo 7 are the most musically useful positions — capo 5 gives you open C from G shapes
        and capo 7 gives you open D from G shapes. Between capo 2 and 7 using G, C, D and Am shapes you can
        reach almost any key with familiar fingering.
      </Callout>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
function TransposingSongsTab() {
  const examples = [
    {
      key: "Bb",
      option1: { capo: 3, shape: "G", note: "G, Em, C, D shapes all land in Bb" },
      option2: { capo: 6, shape: "E", note: "E, Am shapes give a darker Bb voicing" },
    },
    {
      key: "F",
      option1: { capo: 1, shape: "E", note: "All E-position chords sound in F — easy barre-free approach" },
      option2: { capo: 5, shape: "C", note: "C shapes with open strings sound bright in F" },
    },
    {
      key: "Eb",
      option1: { capo: 3, shape: "C", note: "C, Am, F, G shapes cleanly produce Eb" },
      option2: { capo: 6, shape: "A", note: "A shapes reach Eb — useful for singer-songwriter work" },
    },
    {
      key: "Ab",
      option1: { capo: 4, shape: "E", note: "E and Am positions produce Ab and related chords" },
      option2: { capo: 1, shape: "G", note: "G shapes at capo 1 give Ab — less common but valid" },
    },
    {
      key: "Db",
      option1: { capo: 4, shape: "A", note: "A shapes sit in Db — country and pop favourite" },
      option2: { capo: 1, shape: "C", note: "C shapes at capo 1 produce Db" },
    },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Transposing Songs</h2>
      <p className="text-purple-200 mb-6">
        Someone hands you a chart in Eb. Or a singer says the key is Bb. Here is how to find the capo
        position that lets you use open chord shapes.
      </p>

      <Card title="Step-by-Step Process">
        <div className="space-y-3 text-sm">
          {[
            { step: "1", text: "Identify the song key. If you have a chord chart, the I chord (tonic) tells you the key." },
            { step: "2", text: 'Ask: is this already a "guitar-friendly" key? The five friendly keys are C, D, E, G, A — they have lots of open strings.' },
            { step: "3", text: "If not friendly, count backward from the key to find which capo position maps a friendly key onto it." },
            { step: "4", text: "Verify: shape root + capo fret = target key. Adjust if not correct." },
            { step: "5", text: "Transpose every chord in the song using the same offset. If the key moved up 3 semitones, every chord moves up 3 semitones in your shape." },
          ].map(r => (
            <div key={r.step} className="flex gap-3">
              <div className="bg-purple-600 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5">{r.step}</div>
              <p className="text-purple-200">{r.text}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card title="The Guitar-Friendly Keys">
        <p className="text-purple-300 text-sm mb-3">These five keys have the most open strings available, giving the richest resonance and easiest chord shapes:</p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
          {["C", "D", "E", "G", "A"].map(k => (
            <div key={k} className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 text-center">
              <p className="text-green-300 text-2xl font-bold">{k}</p>
            </div>
          ))}
        </div>
        <p className="text-purple-400 text-xs">
          Am and Em are also friendly — they share open strings with A and E respectively.
          F, Bb, Eb, Ab, Db, Gb are the "unfriendly" keys that benefit most from a capo.
        </p>
      </Card>

      <Card title="Worked Examples">
        <div className="space-y-4">
          {examples.map(ex => (
            <div key={ex.key} className="border border-white/10 rounded-xl overflow-hidden">
              <div className="bg-white/10 px-4 py-2">
                <p className="text-white font-bold">Song in <span className="text-amber-400">{ex.key}</span></p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
                <div className="p-3">
                  <p className="text-purple-400 text-xs mb-1">Option A</p>
                  <p className="text-white font-semibold text-sm">Capo {ex.option1.capo} — play {ex.option1.shape} shapes</p>
                  <p className="text-purple-300 text-xs mt-1">{ex.option1.note}</p>
                </div>
                <div className="p-3">
                  <p className="text-purple-400 text-xs mb-1">Option B</p>
                  <p className="text-white font-semibold text-sm">Capo {ex.option2.capo} — play {ex.option2.shape} shapes</p>
                  <p className="text-purple-300 text-xs mt-1">{ex.option2.note}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Callout type="tip">
        When a singer says <strong className="text-white">"can we go up a step?"</strong> — move the capo
        up <strong className="text-white">2 frets</strong>. A "step" in music means a whole tone = 2 semitones.
        "Half a step" = 1 fret. Moving the capo up always raises the key; moving it down (or removing it)
        lowers the key.
      </Callout>

      <Callout type="exercise">
        Take any song you know in G (G–Em–C–D). Now imagine the singer needs it in Bb.
        Count: G(0) G#(1) A(2) Bb(3) — capo 3. Put capo on fret 3, play G shapes, and the
        song now sounds in Bb. All four chords automatically shift. This is the whole skill.
      </Callout>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
function PartialTipsTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Partial Capos & Practical Tips</h2>
      <p className="text-purple-200 mb-6">
        Beyond the standard full capo there are creative tools and practical habits that separate
        clean, in-tune capo playing from sloppy results.
      </p>

      <Card title="Partial Capos">
        <p className="text-purple-200 text-sm mb-4">
          A partial capo covers only some strings, leaving others at their open pitch. This creates
          unique voicings that are impossible with a full capo or standard tuning.
        </p>
        <div className="space-y-4 text-sm">
          <div className="border border-white/10 rounded-xl p-4">
            <p className="text-white font-semibold mb-1">Strings 2–4 capo (middle strings only)</p>
            <p className="text-purple-300 text-xs mb-2">Caps G, B, high e strings at fret 2, leaves E, A, D open. Creates an open-D sus2 texture with standard-tuned bass strings.</p>
            <p className="text-amber-300 text-xs">Common in Celtic fingerstyle and Americana music.</p>
          </div>
          <div className="border border-white/10 rounded-xl p-4">
            <p className="text-white font-semibold mb-1">Drop D + partial capo at fret 2 (strings 2–6)</p>
            <p className="text-purple-300 text-xs mb-2">Leaves the low D string open, capos the rest. The droning D bass against capped voicings creates a DADGAD-like suspended texture without retuning.</p>
            <p className="text-amber-300 text-xs">Popular for singer-songwriters who want open-tuning sounds without a second guitar.</p>
          </div>
          <div className="border border-white/10 rounded-xl p-4">
            <p className="text-white font-semibold mb-1">Third Hand Capo / Spider Capo</p>
            <p className="text-purple-300 text-xs mb-2">Specialist capos with individual string toggles, allowing any combination of strings to be capped independently at the same fret. Used by advanced fingerstyle players (e.g., Phil Keaggy, Michael Hedges style).</p>
            <p className="text-amber-300 text-xs">Brand: Third Hand Capo, Spider Capo by Elliot Capos.</p>
          </div>
        </div>
      </Card>

      <Card title="Practical Tips for Clean Capo Use">
        <div className="space-y-3 text-sm">
          {[
            {
              tip: "Always tune AFTER placing the capo",
              detail: "A capo applies uneven pressure across strings, causing slight detuning. Place it first, then tune every string. Skipping this step is the most common cause of in-tune playing sounding wrong.",
              type: "warning" as const,
            },
            {
              tip: "Position just behind the fret wire, not on top of it",
              detail: "Just like fretting a note, the capo should sit as close to the fret as possible without touching the fret wire itself. Too far back causes buzzing; sitting on the fret wire causes sharp intonation.",
              type: "warning" as const,
            },
            {
              tip: "Check each string individually after placing",
              detail: "Strum each string one at a time. Any buzz or muted note means the capo needs repositioning or tightening. A slight twist forward or backward often solves it.",
              type: "tip" as const,
            },
            {
              tip: "Avoid very cheap capos",
              detail: "Inexpensive trigger capos often apply uneven pressure across strings, causing some strings to buzz and others to go sharp. A $15–25 quality capo is worth it.",
              type: "tip" as const,
            },
            {
              tip: "Recommended capos",
              detail: "Kyser Quick-Change (fast, reliable for acoustic), Shubb C-Series (locking screw for fine-tuned pressure, best intonation), G7th Performance 3 (premium adjustable tension, very clean).",
              type: "insight" as const,
            },
          ].map((item, i) => {
            const borderColors = { warning: "border-amber-500/40 bg-amber-500/5", tip: "border-purple-500/40 bg-purple-500/5", insight: "border-blue-400/40 bg-blue-400/5" }
            const labelColors = { warning: "text-amber-400", tip: "text-purple-400", insight: "text-blue-400" }
            return (
              <div key={i} className={`border rounded-xl p-4 ${borderColors[item.type]}`}>
                <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${labelColors[item.type]}`}>{item.tip}</p>
                <p className="text-purple-200 text-sm">{item.detail}</p>
              </div>
            )
          })}
        </div>
      </Card>

      <Card title="Fun Experiment: Capo at Fret 12">
        <p className="text-purple-200 text-sm mb-3">
          Place a capo at fret 12 and play any chord or note. You are now playing exactly
          <strong className="text-white"> one octave higher</strong> than open position — the same note names,
          the same shapes, but in a higher register. This is because fret 12 is the octave of the open string.
        </p>
        <p className="text-purple-300 text-sm">
          The guitar sounds like a mandolin or ukulele in character. It is a great way to layer parts when
          recording — a capo-12 guitar and a regular guitar playing the same chords fill different sonic space.
        </p>
        <Callout type="exercise">
          Record yourself playing a G–Em–C–D progression with no capo. Then add capo 12 and play the same
          progression again on top. Listen back — the two tracks naturally sit in different frequency ranges and
          complement each other. This is a studio trick used on countless folk and pop records.
        </Callout>
      </Card>

      <Card title="Quick Reference Card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[360px]">
            <thead>
              <tr className="text-purple-400 border-b border-white/10 text-xs">
                <th className="pb-2 text-left">Do</th>
                <th className="pb-2 text-left">Avoid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {[
                { do: "Tune after placing", avoid: "Tuning before placing" },
                { do: "Position behind fret wire", avoid: "Placing on or over fret wire" },
                { do: "Check each string individually", avoid: "Only strumming all six at once" },
                { do: "Use a quality capo (Kyser, Shubb, G7th)", avoid: "Very cheap plastic trigger capos" },
                { do: "Move capo between songs for key changes", avoid: "Expecting the capo to stay perfectly in tune all evening without rechecking" },
              ].map((row, i) => (
                <tr key={i}>
                  <td className="py-2 pr-4 text-green-300 text-xs">{row.do}</td>
                  <td className="py-2 text-red-400 text-xs">{row.avoid}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CapoGuidePage() {
  const [activeTab, setActiveTab] = useState<Tab>("how-it-works")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link href="/" className="text-purple-300 hover:text-white text-sm">← Back to modules</Link>
        </div>
        <div className="mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">Capo Guide</h1>
          <p className="text-purple-200">Understand the capo completely — how it shifts keys, which positions unlock which songs, and how to transpose any song without barre chords.</p>
        </div>
        <div className="flex flex-wrap gap-2 mb-8">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === t.id ? "bg-purple-600 text-white" : "bg-white/10 text-purple-300 hover:bg-white/20"
              }`}
            >{t.label}</button>
          ))}
        </div>
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
          {activeTab === "how-it-works"     && <HowItWorksTab />}
          {activeTab === "key-calculator"   && <KeyCalculatorTab />}
          {activeTab === "common-positions" && <CommonPositionsTab />}
          {activeTab === "transposing"      && <TransposingSongsTab />}
          {activeTab === "partial-tips"     && <PartialTipsTab />}
        </div>
      </div>
    </div>
  )
}
