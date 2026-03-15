"use client"

import React, { useState } from "react"
import Link from "next/link"

type CalloutType = "tip" | "warning" | "insight" | "exercise"

function Callout({ type, children }: { type: CalloutType; children: React.ReactNode }) {
  const styles: Record<CalloutType, { border: string; bg: string; label: string; labelColor: string; text: string }> = {
    tip:      { border: "border-purple-500", bg: "bg-purple-500/10", label: "TIP",      labelColor: "text-purple-300", text: "text-purple-200" },
    warning:  { border: "border-amber-500",  bg: "bg-amber-500/10",  label: "WARNING",  labelColor: "text-amber-300",  text: "text-amber-200"  },
    insight:  { border: "border-blue-500",   bg: "bg-blue-500/10",   label: "INSIGHT",  labelColor: "text-blue-300",   text: "text-blue-200"   },
    exercise: { border: "border-green-500",  bg: "bg-green-500/10",  label: "EXERCISE", labelColor: "text-green-300",  text: "text-green-200"  },
  }
  const s = styles[type]
  return (
    <div className={`border-l-4 ${s.border} ${s.bg} rounded-r-xl p-4 my-4`}>
      <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${s.labelColor}`}>{s.label}</div>
      <div className={`text-sm leading-relaxed ${s.text}`}>{children}</div>
    </div>
  )
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white/5 border border-white/10 rounded-2xl p-5 mb-4 ${className}`}>
      {children}
    </div>
  )
}

const TABS = ["Why Setup Matters", "Restringing", "Action & Nut", "Intonation", "Truss Rod", "Care & Cleaning"]

const TOOLS = [
  { name: "Clip-on tuner", use: "Essential for intonation checks and restringing" },
  { name: "String winder", use: "Speeds up removing and winding new strings" },
  { name: "Wire cutters", use: "Clips excess string after winding" },
  { name: "Allen/hex wrench set", use: "Adjusts saddle height, some truss rods" },
  { name: "Phillips & flathead screwdrivers", use: "Saddle and truss rod adjustments" },
  { name: "String action gauge / ruler", use: "Measures string height at nut and 12th fret" },
  { name: "Capo", use: "Holds strings down for neck relief checks" },
  { name: "Polish cloth", use: "Wipes body and fretboard without scratching" },
  { name: "Fretboard conditioner (lemon oil)", use: "Hydrates unfinished rosewood/ebony boards" },
]

export default function GuitarSetupPage() {
  const [activeTab, setActiveTab] = useState(0)
  const [restringingStep, setRestringingStep] = useState(0)

  const restringingSteps = [
    { title: "Loosen and remove old strings", detail: "Turn each tuning peg to lower the pitch until the string goes slack. Unwind completely and remove one string at a time — never remove all at once on acoustic guitars as it can warp the top from the sudden tension change." },
    { title: "Clean while strings are off", detail: "This is the best time to clean the fretboard. Use a dry cloth for maple (finished) fretboards. For rosewood or ebony (unfinished), apply a few drops of lemon oil to a cloth and rub gently along the grain. Wipe off excess. Don't flood the wood." },
    { title: "Thread the new string through the bridge", detail: "On electrics, feed through the bridge/tremolo from the back or saddle depending on your bridge type. On acoustics, insert the ball end through the bridge pin hole and press the bridge pin firmly in — angling it helps the ball end seat correctly." },
    { title: "Thread through the tuning peg", detail: "Feed the string through the peg hole. Leave about 2–3 inches of slack (roughly 3 finger-widths) past the peg before you start winding. This gives enough wraps for good contact without excessive winding." },
    { title: "Wind the string", detail: "Start winding so the string coils DOWNWARD on the peg (away from the headstock). For thinner strings (1–3), aim for 2–3 neat winds. For thicker strings (4–6), 2 winds is plenty. Coils should be tight and parallel, not overlapping." },
    { title: "Tune up, then stretch", detail: "Bring the string up to pitch. Then gently pull the string upward away from the body (middle of the string) about 1cm, re-tune, and repeat 3–4 times per string. This pre-stretches the string and dramatically improves tuning stability." },
    { title: "Clip excess string", detail: "Use wire cutters to clip the excess wire close to the tuning peg. Leave just a small stub — loose ends can scratch the headstock and occasionally poke the player's hand." },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">

        <div className="mb-8">
          <Link href="/" className="text-purple-300 hover:text-white text-sm">← Back to modules</Link>
          <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2 mt-4">Guitar Setup & Maintenance</h1>
          <p className="text-purple-300 text-sm sm:text-base">Keep your guitar playing and sounding its best — understand every adjustment from restringing to intonation</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {TABS.map((tab, i) => (
            <button key={tab} onClick={() => setActiveTab(i)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === i ? "bg-purple-600 text-white" : "bg-white/10 text-purple-300 hover:bg-white/20"}`}>
              {tab}
            </button>
          ))}
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">

          {/* ── Tab 0: Why Setup Matters ────────────────────────────── */}
          {activeTab === 0 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Why Guitar Setup Matters</h2>
              <Card>
                <h3 className="text-white font-semibold mb-2">What is a guitar setup?</h3>
                <p className="text-purple-200 text-sm leading-relaxed">
                  A setup is a series of adjustments — to the nut, saddle, truss rod, and intonation — that make a guitar
                  play comfortably, ring in tune up the neck, and respond well to your playing style. It is the difference
                  between fighting the instrument and having it work with you.
                </p>
              </Card>
              <Card>
                <h3 className="text-white font-semibold mb-3">Signs your guitar needs a setup</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { problem: "High action", result: "Strings are hard to press, especially above the 5th fret — hand fatigue, sore fingertips" },
                    { problem: "Buzzing frets", result: "Notes fret out or buzz when played — caused by low action, uneven frets, or too much/little neck relief" },
                    { problem: "Out of tune at 12th fret", result: "Open string is in tune but the same note fretted is sharp or flat — intonation issue" },
                    { problem: "Sharp open notes", result: "Even open strings go sharp when strummed hard — nut slots may be too high" },
                  ].map(item => (
                    <div key={item.problem} className="bg-black/20 rounded-xl p-3 border border-white/10">
                      <div className="text-amber-300 font-semibold text-sm mb-1">{item.problem}</div>
                      <div className="text-purple-300 text-xs leading-relaxed">{item.result}</div>
                    </div>
                  ))}
                </div>
              </Card>
              <Callout type="insight">
                Factory setups on most guitars — including expensive ones — are mediocre at best. Manufacturers set
                action high to prevent any chance of buzzing during shipping and quality control. A proper setup for
                your playing style is almost always an improvement. Many players describe it as feeling like they got
                a new, better guitar.
              </Callout>
              <Card>
                <h3 className="text-white font-semibold mb-3">The tools you need</h3>
                <div className="space-y-2">
                  {TOOLS.map(tool => (
                    <div key={tool.name} className="flex gap-3 text-sm">
                      <span className="text-purple-300 font-semibold shrink-0 w-44">{tool.name}</span>
                      <span className="text-purple-400 text-xs">{tool.use}</span>
                    </div>
                  ))}
                </div>
              </Card>
              <Card>
                <h3 className="text-white font-semibold mb-2">DIY vs luthier — when to go pro</h3>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3">
                    <div className="text-green-300 font-semibold mb-2">Do it yourself</div>
                    <ul className="space-y-1 text-green-200 text-xs">
                      {["Restringing", "Basic cleaning and conditioning", "Intonation adjustment (electric)", "Saddle height adjustment (electric)", "Light truss rod tweaks (¼ turn at a time)"].map(t => <li key={t} className="flex gap-1"><span>•</span><span>{t}</span></li>)}
                    </ul>
                  </div>
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                    <div className="text-amber-300 font-semibold mb-2">See a luthier</div>
                    <ul className="space-y-1 text-amber-200 text-xs">
                      {["Nut slot filing", "Acoustic saddle shaping", "Fret levelling and dressing", "Truss rod if it feels stiff or stuck", "Broken or cracked parts", "Major action changes on acoustic"].map(t => <li key={t} className="flex gap-1"><span>•</span><span>{t}</span></li>)}
                    </ul>
                  </div>
                </div>
              </Card>
              <Card>
                <h3 className="text-white font-semibold mb-2">Maintenance schedule</h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <div className="flex gap-3"><span className="text-purple-400 font-semibold shrink-0">After every session:</span><span>Wipe strings with a dry cloth</span></div>
                  <div className="flex gap-3"><span className="text-purple-400 font-semibold shrink-0">Every 3 months:</span><span>Restring (sooner if strings sound dull or feel rough)</span></div>
                  <div className="flex gap-3"><span className="text-purple-400 font-semibold shrink-0">Every 6 months:</span><span>Full setup check, fretboard conditioning</span></div>
                  <div className="flex gap-3"><span className="text-purple-400 font-semibold shrink-0">Seasonally:</span><span>Check neck relief (guitars move with temperature and humidity changes)</span></div>
                </div>
              </Card>
            </div>
          )}

          {/* ── Tab 1: Restringing ─────────────────────────────────── */}
          {activeTab === 1 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Restringing Your Guitar</h2>
              <Card>
                <h3 className="text-white font-semibold mb-3">Choosing strings</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs min-w-[380px]">
                    <thead>
                      <tr className="text-purple-400 border-b border-white/10">
                        <th className="pb-2 text-left">Type</th>
                        <th className="pb-2 text-left">Light gauge</th>
                        <th className="pb-2 text-left">Regular gauge</th>
                        <th className="pb-2 text-left">Best for</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-purple-200">
                      {[
                        ["Electric", ".009–.042", ".010–.046", "General rock/pop — .009s easier to bend"],
                        ["Acoustic", ".012–.053", ".013–.056", "Fingerpicking / strumming — lighter = easier"],
                        ["Classical", "Low tension", "High tension", "Technique and comfort — nylon is gentler"],
                      ].map(([type, light, reg, best]) => (
                        <tr key={type}>
                          <td className="py-2 font-semibold text-white">{type}</td>
                          <td className="py-2">{light}</td>
                          <td className="py-2">{reg}</td>
                          <td className="py-2 text-purple-400">{best}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Step-by-step interactive */}
              <h3 className="text-white font-semibold mb-3">Step-by-step restringing</h3>
              <div className="flex gap-2 mb-4 flex-wrap">
                {restringingSteps.map((s, i) => (
                  <button key={i} onClick={() => setRestringingStep(i)}
                    className={`w-8 h-8 rounded-full text-sm font-bold transition-all ${restringingStep === i ? "bg-purple-600 text-white" : "bg-white/10 text-purple-300 hover:bg-white/20"}`}>
                    {i + 1}
                  </button>
                ))}
              </div>
              <div className="bg-black/30 border border-purple-500/30 rounded-2xl p-5 mb-4">
                <div className="text-purple-400 text-xs font-semibold uppercase tracking-wider mb-1">
                  Step {restringingStep + 1} of {restringingSteps.length}
                </div>
                <h4 className="text-white font-bold mb-3">{restringingSteps[restringingStep].title}</h4>
                <p className="text-purple-200 text-sm leading-relaxed">{restringingSteps[restringingStep].detail}</p>
                <div className="flex gap-3 mt-4">
                  {restringingStep > 0 && (
                    <button onClick={() => setRestringingStep(s => s - 1)}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-purple-300 rounded-xl text-sm transition-all">
                      ← Previous
                    </button>
                  )}
                  {restringingStep < restringingSteps.length - 1 && (
                    <button onClick={() => setRestringingStep(s => s + 1)}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm transition-all">
                      Next Step →
                    </button>
                  )}
                </div>
              </div>
              <Callout type="tip">
                <strong>The stretch test:</strong> New strings go out of tune because the string is still stretching.
                After fitting, bring each string to pitch, then gently pull it upward 1–2 cm in the middle and retune.
                Repeat 3–4 times per string. This pre-stretches them so they stay in tune from the first song.
              </Callout>
              <Callout type="tip">
                <strong>Winding direction matters:</strong> Strings should wind so that as you turn the peg to tighten,
                the string winds downward toward the headstock. This increases the break angle over the nut — improving
                sustain and keeping the string seated properly.
              </Callout>
            </div>
          )}

          {/* ── Tab 2: Action & Nut ────────────────────────────────── */}
          {activeTab === 2 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Action & Nut Height</h2>
              <Card>
                <h3 className="text-white font-semibold mb-2">What is action?</h3>
                <p className="text-purple-200 text-sm leading-relaxed">
                  Action is the height of the strings above the frets. It is measured at the 12th fret (the key
                  reference point) and at the nut (affecting open string feel). Action controls playability, tone, and
                  whether the guitar buzzes.
                </p>
              </Card>
              <Card>
                <h3 className="text-white font-semibold mb-3">Target measurements at 12th fret</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[360px]">
                    <thead>
                      <tr className="text-purple-400 border-b border-white/10 text-xs">
                        <th className="pb-2 text-left">Guitar type</th>
                        <th className="pb-2 text-center">Low E string</th>
                        <th className="pb-2 text-center">High e string</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-purple-200 text-xs">
                      {[
                        ["Electric (low)", "1.5mm", "1.2mm"],
                        ["Electric (standard)", "2.0mm", "1.5mm"],
                        ["Acoustic (fingerpick)", "2.0mm", "1.5mm"],
                        ["Acoustic (strumming)", "2.5mm", "2.0mm"],
                      ].map(([type, low, high]) => (
                        <tr key={type}>
                          <td className="py-2 text-white">{type}</td>
                          <td className="py-2 text-center text-green-300">{low}</td>
                          <td className="py-2 text-center text-green-300">{high}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-purple-400 text-xs mt-3">Measure from the TOP of the 12th fret to the BOTTOM of the string.</p>
              </Card>
              <Card>
                <h3 className="text-white font-semibold mb-3">Where action is controlled</h3>
                <div className="space-y-3">
                  {[
                    { part: "Bridge saddles", desc: "Controls overall string height. On electrics, each saddle has a height adjustment screw (Allen wrench). Raising = higher action overall, lowering = easier to play but more buzz risk.", safe: true },
                    { part: "Nut slots", desc: "Controls action at the open end (first few frets). If open chords feel stiff or the open string goes sharp when strummed hard, nut slots may be too high. Filing them requires precision and a wrong cut means a new nut — approach with caution.", safe: false },
                    { part: "Truss rod", desc: "Controls neck relief (bow). Affects action across the middle of the neck. Covered in the Truss Rod tab — changes here have wide-reaching effects.", safe: false },
                  ].map(item => (
                    <div key={item.part} className="flex gap-3 bg-black/20 rounded-xl p-3 border border-white/10">
                      <div className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded-full h-fit mt-0.5 ${item.safe ? "bg-green-500/30 text-green-300" : "bg-amber-500/30 text-amber-300"}`}>
                        {item.safe ? "DIY OK" : "Careful"}
                      </div>
                      <div>
                        <div className="text-white font-semibold text-sm">{item.part}</div>
                        <div className="text-purple-300 text-xs mt-1 leading-relaxed">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
              <Card>
                <h3 className="text-white font-semibold mb-2">Action trade-offs</h3>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div className="bg-black/20 rounded-xl p-3 border border-white/10">
                    <div className="text-blue-300 font-semibold mb-2">Low action</div>
                    <div className="text-green-300 text-xs mb-1">✓ Easy to press, fast playing, less finger fatigue</div>
                    <div className="text-red-300 text-xs">✗ More prone to fret buzz, less sustain and resonance</div>
                  </div>
                  <div className="bg-black/20 rounded-xl p-3 border border-white/10">
                    <div className="text-blue-300 font-semibold mb-2">High action</div>
                    <div className="text-green-300 text-xs mb-1">✓ More sustain and volume, less buzz, better for slide</div>
                    <div className="text-red-300 text-xs">✗ Harder to press, more hand fatigue, can affect intonation</div>
                  </div>
                </div>
              </Card>
              <Callout type="warning">
                Nut slot adjustment is the most common DIY mistake. If you file a slot too deep, the string will buzz
                on the first fret and the nut must be replaced. If you want to lower open string action, start with
                a luthier until you are confident with the technique.
              </Callout>
            </div>
          )}

          {/* ── Tab 3: Intonation ──────────────────────────────────── */}
          {activeTab === 3 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Intonation</h2>
              <Card>
                <h3 className="text-white font-semibold mb-2">What is intonation?</h3>
                <p className="text-purple-200 text-sm leading-relaxed">
                  Intonation determines whether your guitar plays in tune at every fret — not just at the open strings.
                  A guitar with poor intonation will sound in tune when open but increasingly sharp or flat as you play
                  higher up the neck. It makes playing with other musicians painful.
                </p>
              </Card>
              <Card>
                <h3 className="text-white font-semibold mb-3">How to check intonation</h3>
                <div className="space-y-3">
                  {[
                    { step: "1", text: "Tune the open string to pitch with a tuner" },
                    { step: "2", text: "Play the 12th fret HARMONIC (lightly touch the string directly above the 12th fret, don't press down) — it should read the same as the open string" },
                    { step: "3", text: "Play the 12th fret FRETTED note (press down normally) — compare to the harmonic" },
                    { step: "4", text: "If the fretted note is SHARP → the string is too short → move the saddle BACK (away from the nut)" },
                    { step: "5", text: "If the fretted note is FLAT → the string is too long → move the saddle FORWARD (toward the nut)" },
                  ].map(item => (
                    <div key={item.step} className="flex gap-3 items-start">
                      <span className="w-7 h-7 rounded-full bg-purple-600/40 border border-purple-500/40 flex items-center justify-center text-purple-200 text-xs font-bold shrink-0">{item.step}</span>
                      <p className="text-purple-200 text-sm leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </Card>
              <Callout type="insight">
                The 12th fret is exactly half the string length — so it should produce exactly one octave above the open
                string. If the fretted note is sharp, the effective string length is shorter than it should be (saddle
                too far forward), so you need to lengthen it by moving the saddle back.
              </Callout>
              <Card>
                <h3 className="text-white font-semibold mb-3">Adjusting saddles (electric guitar)</h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>On most electric bridges (Stratocaster, Telecaster, humbucker-style) each saddle moves independently:</p>
                  <ul className="space-y-2 ml-4">
                    {[
                      "Locate the adjustment screw at the back of the saddle — this controls the saddle's forward/back position",
                      "Turn clockwise to move saddle BACK (lengthens string) — use if fretted 12th is sharp",
                      "Turn counter-clockwise to move saddle FORWARD (shortens string) — use if fretted 12th is flat",
                      "Make small adjustments, retune completely, then recheck",
                      "Always retune before rechecking — the adjustment only means something when the string is at proper tension",
                    ].map((t, i) => (
                      <li key={i} className="flex gap-2"><span className="text-purple-400">•</span><span>{t}</span></li>
                    ))}
                  </ul>
                </div>
              </Card>
              <Callout type="warning">
                Acoustic guitar intonation is largely fixed at the saddle and much harder to adjust without a luthier.
                If your acoustic has persistent intonation issues, a luthier can reshape or replace the saddle. This is
                not typically a DIY task.
              </Callout>
              <Card>
                <h3 className="text-white font-semibold mb-2">Common causes of intonation going off</h3>
                <ul className="space-y-2 text-sm text-purple-200">
                  {[
                    "Changing string gauge — different tension changes the effective speaking length",
                    "Temperature and humidity fluctuations — the neck moves, affecting tension",
                    "Old, worn strings — their mass distribution becomes uneven",
                    "Heavy pick attack — if you dig in hard, your fretted notes go slightly sharp (unavoidable, just be aware)",
                  ].map((t, i) => (
                    <li key={i} className="flex gap-2"><span className="text-purple-400">•</span><span>{t}</span></li>
                  ))}
                </ul>
              </Card>
            </div>
          )}

          {/* ── Tab 4: Truss Rod ───────────────────────────────────── */}
          {activeTab === 4 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Truss Rod & Neck Relief</h2>
              <Callout type="warning">
                The truss rod is the one adjustment that can permanently damage your guitar if done incorrectly.
                <strong> Proceed in quarter-turn increments, wait at least 20 minutes between adjustments</strong>, and if
                the rod feels stiff or does not move easily, stop and consult a luthier. A snapped truss rod is an
                expensive repair.
              </Callout>
              <Card>
                <h3 className="text-white font-semibold mb-2">What the truss rod does</h3>
                <p className="text-purple-200 text-sm leading-relaxed">
                  Inside every guitar neck is a metal rod that counteracts the tension of the strings, which pull the
                  headstock forward. The truss rod lets you control how straight or slightly curved the neck is. A slight
                  upward bow (called neck relief) is actually desirable — it gives the strings room to vibrate freely
                  without buzzing.
                </p>
              </Card>
              <Card>
                <h3 className="text-white font-semibold mb-3">How to check neck relief</h3>
                <div className="space-y-3">
                  {[
                    { step: "1", text: "Capo the guitar at the 1st fret" },
                    { step: "2", text: "Hold down (or use a capo on) the low E string at the fret where the neck meets the body — usually fret 14, 15, or 17 depending on your guitar" },
                    { step: "3", text: "With the string fretted at both ends, look at the gap between the string and the 7th fret" },
                    { step: "4", text: "Ideal gap: about 0.3mm — roughly the thickness of a business card or credit card. You should just be able to slip the card under the string." },
                    { step: "5", text: "Too much gap = too much relief (bow) → tighten rod. No gap or buzzing in the middle = back-bow or too straight → loosen rod." },
                  ].map(item => (
                    <div key={item.step} className="flex gap-3 items-start">
                      <span className="w-7 h-7 rounded-full bg-purple-600/40 border border-purple-500/40 flex items-center justify-center text-purple-200 text-xs font-bold shrink-0">{item.step}</span>
                      <p className="text-purple-200 text-sm leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </Card>
              <Card>
                <h3 className="text-white font-semibold mb-3">Making adjustments</h3>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div className="bg-black/20 rounded-xl p-3 border border-white/10">
                    <div className="text-amber-300 font-semibold mb-2">Too much relief (bowing forward)</div>
                    <p className="text-purple-300 text-xs">Action is high in the middle of the neck, strings hard to press around frets 5–9</p>
                    <p className="text-green-300 text-xs mt-2 font-semibold">Fix: Clockwise (tighten) → straightens neck → reduces relief</p>
                  </div>
                  <div className="bg-black/20 rounded-xl p-3 border border-white/10">
                    <div className="text-amber-300 font-semibold mb-2">Back-bow (bowing backward)</div>
                    <p className="text-purple-300 text-xs">Buzzing across many frets, especially in the middle of the neck</p>
                    <p className="text-green-300 text-xs mt-2 font-semibold">Fix: Counter-clockwise (loosen) → adds forward bow → adds relief</p>
                  </div>
                </div>
              </Card>
              <Card>
                <h3 className="text-white font-semibold mb-2">Seasonal changes</h3>
                <p className="text-purple-200 text-sm leading-relaxed">
                  Wood expands and contracts with humidity and temperature changes. A neck that was perfectly set in summer
                  may develop too much relief in dry winter conditions. This is normal and expected — a small truss rod
                  tweak twice a year (spring and autumn) is standard maintenance, not a sign of a faulty guitar.
                </p>
              </Card>
            </div>
          )}

          {/* ── Tab 5: Care & Cleaning ─────────────────────────────── */}
          {activeTab === 5 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Care & Cleaning</h2>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                {[
                  { title: "After every session", icon: "🎸", items: ["Wipe strings with a dry cloth — removes sweat and oils", "Wipe the neck and body", "Return to stand or case"] },
                  { title: "Every 3 months", icon: "🔁", items: ["Restring (or sooner if strings feel rough or sound dead)", "Condition rosewood/ebony fretboard with lemon oil", "Check tuners for looseness"] },
                  { title: "Every 6 months", icon: "🔧", items: ["Full setup check (action, intonation, neck relief)", "Clean all metal hardware", "Check strap buttons and output jack"] },
                  { title: "Seasonally", icon: "🌡️", items: ["Check neck relief as humidity changes", "Acoustic: check for cracks in dry weather", "Store with appropriate humidity control"] },
                ].map(section => (
                  <div key={section.title} className="bg-black/20 border border-white/10 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{section.icon}</span>
                      <span className="text-white font-semibold text-sm">{section.title}</span>
                    </div>
                    <ul className="space-y-1">
                      {section.items.map((item, i) => (
                        <li key={i} className="text-purple-300 text-xs flex gap-1.5"><span className="text-purple-500">•</span><span>{item}</span></li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <Card>
                <h3 className="text-white font-semibold mb-3">Fretboard care by type</h3>
                <div className="space-y-3 text-sm">
                  {[
                    { type: "Rosewood / Ebony (unfinished)", color: "text-amber-300", care: "Apply lemon oil or fretboard conditioner 2–3 times a year. Use a soft cloth, rub along the grain, leave for 2 minutes, wipe off completely. Never flood the wood — a few drops per string bay is plenty." },
                    { type: "Maple (finished)", color: "text-yellow-200", care: "Wipe clean with a dry cloth only. Maple fretboards are sealed with lacquer — no oil needed or beneficial. Excess moisture can lift or cloud the finish." },
                    { type: "Pau Ferro / Laurel", color: "text-orange-300", care: "Treat like rosewood — light conditioning 2x per year. These woods are drier by nature and benefit from occasional hydration." },
                  ].map(item => (
                    <div key={item.type} className="bg-black/20 rounded-xl p-3 border border-white/10">
                      <div className={`font-semibold mb-1 ${item.color}`}>{item.type}</div>
                      <p className="text-purple-300 text-xs leading-relaxed">{item.care}</p>
                    </div>
                  ))}
                </div>
              </Card>
              <Card>
                <h3 className="text-white font-semibold mb-3">Storage & humidity</h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>Ideal humidity for a guitar: <span className="text-white font-semibold">45–55%</span></p>
                  <ul className="space-y-1 ml-4">
                    {[
                      "Too dry (below 40%): wood shrinks, fret ends protrude, top cracks, action drops, buzzing increases",
                      "Too humid (above 70%): glue joints can loosen, wood swells, action rises, tone becomes muddy",
                      "Acoustic guitars are far more sensitive to humidity changes than electrics",
                      "Use a case humidifier (like a Dampit or D'Addario soundhole humidifier) in dry winters",
                      "A cheap digital hygrometer in your guitar room costs a few pounds and is worth it",
                    ].map((t, i) => (
                      <li key={i} className="flex gap-2"><span className="text-purple-400">•</span><span>{t}</span></li>
                    ))}
                  </ul>
                </div>
              </Card>
              <Card>
                <h3 className="text-white font-semibold mb-3">Quick diagnostic checklist</h3>
                <div className="space-y-2">
                  {[
                    { symptom: "Buzzes at open strings and near nut", fix: "Nut slots too low — needs filing or new nut (luthier)" },
                    { symptom: "Buzzes only in middle of neck (frets 5–9)", fix: "Too much neck relief — tighten truss rod slightly" },
                    { symptom: "Buzzes everywhere high up the neck", fix: "Action too low at saddle — raise bridge saddles" },
                    { symptom: "Out of tune at 12th fret only", fix: "Intonation — adjust saddle position (see Intonation tab)" },
                    { symptom: "Hard to press near nut, easy higher up", fix: "Nut slots too high — file carefully or see luthier" },
                    { symptom: "Strings feel dead and dull", fix: "Time to restring — strings are past their life" },
                  ].map(item => (
                    <div key={item.symptom} className="flex gap-3 text-sm border-b border-white/5 pb-2 last:border-0 last:pb-0">
                      <span className="text-amber-400 shrink-0 mt-0.5">?</span>
                      <div>
                        <div className="text-white text-xs font-semibold">{item.symptom}</div>
                        <div className="text-purple-300 text-xs mt-0.5">{item.fix}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
