"use client"

import React, { useState, useRef, useCallback } from "react"
import Link from "next/link"

// ─── Types ────────────────────────────────────────────────────────────────────
type CalloutType = "tip" | "warning" | "insight" | "exercise"

// ─── Callout ──────────────────────────────────────────────────────────────────
function Callout({ type, children }: { type: CalloutType; children: React.ReactNode }) {
  const styles: Record<CalloutType, { border: string; bg: string; label: string; labelColor: string; text: string }> = {
    tip:      { border: "border-purple-500", bg: "bg-purple-500/10", label: "TIP",      labelColor: "text-purple-300", text: "text-purple-200" },
    warning:  { border: "border-amber-500",  bg: "bg-amber-500/10",  label: "NOTE",     labelColor: "text-amber-300",  text: "text-amber-200"  },
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

// ─── Card ─────────────────────────────────────────────────────────────────────
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white/5 border border-white/10 rounded-2xl p-5 mb-4 ${className}`}>
      {children}
    </div>
  )
}

// ─── Interval data ────────────────────────────────────────────────────────────
const INTERVALS = [
  { name: "Minor 2nd",   semitones: 1,  character: "Tense, dissonant, like a horror film",          song: "Jaws theme" },
  { name: "Major 2nd",   semitones: 2,  character: "Stepwise, neutral, building motion",            song: "Happy Birthday (first two notes)" },
  { name: "Minor 3rd",   semitones: 3,  character: "Sad, introspective, blues-tinged",              song: "Smoke on the Water (opening)" },
  { name: "Major 3rd",   semitones: 4,  character: "Bright, happy, affirming",                      song: "When the Saints Go Marching In" },
  { name: "Perfect 4th", semitones: 5,  character: "Open, strong, anticipatory",                    song: "Here Comes the Bride" },
  { name: "Tritone",     semitones: 6,  character: "Unstable, tense, dramatic — the 'devil in music'", song: "The Simpsons theme" },
  { name: "Perfect 5th", semitones: 7,  character: "Powerful, hollow, open — power chord backbone", song: "Star Wars theme" },
  { name: "Minor 6th",   semitones: 8,  character: "Longing, bittersweet, romantic",                song: "The Entertainer (descending)" },
  { name: "Major 6th",   semitones: 9,  character: "Sweet, nostalgic, folky",                       song: "My Bonnie Lies Over the Ocean" },
  { name: "Minor 7th",   semitones: 10, character: "Tense but smooth, jazz-blues sound",            song: "Somewhere (West Side Story)" },
  { name: "Major 7th",   semitones: 11, character: "Dreamy, yearning, almost resolved",             song: "Take On Me (A-ha)" },
  { name: "Octave",      semitones: 12, character: "Complete, open, full resolution",               song: "Somewhere Over the Rainbow (first two notes)" },
]

// ─── Chord quality data ───────────────────────────────────────────────────────
const CHORD_QUALITIES = [
  { name: "Major",     intervals: [0, 4, 7],     character: "Bright, happy, resolved",          song: "Any pop/rock chorus",            color: "bg-yellow-500/20 border-yellow-500/40 text-yellow-200" },
  { name: "Minor",     intervals: [0, 3, 7],     character: "Dark, sad, introspective",          song: "Stairway to Heaven intro",       color: "bg-blue-500/20 border-blue-500/40 text-blue-200" },
  { name: "Dom 7th",   intervals: [0, 4, 7, 10], character: "Tense, bluesy, wants to resolve",   song: "Purple Haze (E7#9)",             color: "bg-orange-500/20 border-orange-500/40 text-orange-200" },
  { name: "Major 7th", intervals: [0, 4, 7, 11], character: "Dreamy, lush, sophisticated",       song: "Don't Know Why (Norah Jones)",   color: "bg-purple-500/20 border-purple-500/40 text-purple-200" },
  { name: "Minor 7th", intervals: [0, 3, 7, 10], character: "Mellow, soulful, smooth",           song: "I Will (Beatles)",               color: "bg-cyan-500/20 border-cyan-500/40 text-cyan-200" },
  { name: "Diminished",intervals: [0, 3, 6, 9],  character: "Eerie, tense, dramatic, unstable",  song: "The intro to many horror films",  color: "bg-red-500/20 border-red-500/40 text-red-200" },
]

// ─── Audio utilities ──────────────────────────────────────────────────────────
function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null
  const W = window as Window & { webkitAudioContext?: typeof AudioContext }
  const AC = window.AudioContext || W.webkitAudioContext
  if (!AC) return null
  return new AC()
}

function playNote(ctx: AudioContext, freq: number, startTime: number, duration: number, gain = 0.3) {
  const osc = ctx.createOscillator()
  const gainNode = ctx.createGain()
  osc.type = "sine"
  osc.frequency.value = freq
  gainNode.gain.setValueAtTime(0, startTime)
  gainNode.gain.linearRampToValueAtTime(gain, startTime + 0.02)
  gainNode.gain.setValueAtTime(gain, startTime + duration - 0.05)
  gainNode.gain.linearRampToValueAtTime(0, startTime + duration)
  osc.connect(gainNode)
  gainNode.connect(ctx.destination)
  osc.start(startTime)
  osc.stop(startTime + duration)
}

function semitoneToFreq(base: number, semitones: number) {
  return base * Math.pow(2, semitones / 12)
}

const BASE_FREQ = 261.63 // C4

// ─── Tabs ─────────────────────────────────────────────────────────────────────
const TABS = ["Why Ear Training?", "Intervals", "Interval Trainer", "Chord Quality", "Chord Trainer", "Melodic Memory", "Practice Plan"]

// ─── Main page ────────────────────────────────────────────────────────────────
export default function EarTrainingPage() {
  const [activeTab, setActiveTab] = useState(0)

  // Interval quiz state
  const [quizInterval, setQuizInterval] = useState<number | null>(null)
  const [quizBaseFreq, setQuizBaseFreq] = useState(BASE_FREQ)
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null)
  const [intervalScore, setIntervalScore] = useState({ correct: 0, total: 0 })
  const [intervalHistory, setIntervalHistory] = useState<Record<string, { correct: number; total: number }>>({})
  const [showIntervalHint, setShowIntervalHint] = useState(false)

  // Chord quiz state
  const [quizChordIdx, setQuizChordIdx] = useState<number | null>(null)
  const [chordAnswer, setChordAnswer] = useState<string | null>(null)
  const [chordScore, setChordScore] = useState({ correct: 0, total: 0 })
  const [chordHistory, setChordHistory] = useState<Record<string, { correct: number; total: number }>>({})

  const audioCtxRef = useRef<AudioContext | null>(null)

  const getCtx = useCallback(() => {
    if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
      audioCtxRef.current = getAudioContext()
    }
    return audioCtxRef.current
  }, [])

  function playInterval(baseFreq: number, semitones: number) {
    const ctx = getCtx()
    if (!ctx) return
    const now = ctx.currentTime
    playNote(ctx, baseFreq, now, 0.8)
    playNote(ctx, semitoneToFreq(baseFreq, semitones), now, 0.8)
  }

  function playIntervalMelodic(baseFreq: number, semitones: number) {
    const ctx = getCtx()
    if (!ctx) return
    const now = ctx.currentTime
    playNote(ctx, baseFreq, now, 0.6)
    playNote(ctx, semitoneToFreq(baseFreq, semitones), now + 0.65, 0.8)
  }

  function playChordQuality(intervals: number[], baseFreq: number) {
    const ctx = getCtx()
    if (!ctx) return
    const now = ctx.currentTime
    intervals.forEach((semitones, i) => {
      const osc = ctx.createOscillator()
      const gainNode = ctx.createGain()
      osc.type = "triangle"
      osc.frequency.value = semitoneToFreq(baseFreq, semitones)
      gainNode.gain.setValueAtTime(0, now + i * 0.07)
      gainNode.gain.linearRampToValueAtTime(0.2, now + i * 0.07 + 0.03)
      gainNode.gain.setValueAtTime(0.2, now + 1.2)
      gainNode.gain.linearRampToValueAtTime(0, now + 1.5)
      osc.connect(gainNode)
      gainNode.connect(ctx.destination)
      osc.start(now + i * 0.07)
      osc.stop(now + 1.6)
    })
  }

  function newIntervalQuestion() {
    const randomInterval = INTERVALS[Math.floor(Math.random() * INTERVALS.length)]
    const baseFreqs = [261.63, 277.18, 293.66, 311.13, 329.63, 349.23]
    const base = baseFreqs[Math.floor(Math.random() * baseFreqs.length)]
    setQuizInterval(randomInterval.semitones)
    setQuizBaseFreq(base)
    setQuizAnswer(null)
    setShowIntervalHint(false)
    setTimeout(() => playIntervalMelodic(base, randomInterval.semitones), 100)
  }

  function answerInterval(name: string) {
    if (quizAnswer !== null || quizInterval === null) return
    const correct = INTERVALS.find(i => i.semitones === quizInterval)?.name ?? ""
    const isCorrect = name === correct
    setQuizAnswer(name)
    setIntervalScore(prev => ({ correct: prev.correct + (isCorrect ? 1 : 0), total: prev.total + 1 }))
    setIntervalHistory(prev => {
      const entry = prev[correct] ?? { correct: 0, total: 0 }
      return { ...prev, [correct]: { correct: entry.correct + (isCorrect ? 1 : 0), total: entry.total + 1 } }
    })
  }

  function newChordQuestion() {
    const idx = Math.floor(Math.random() * CHORD_QUALITIES.length)
    setQuizChordIdx(idx)
    setChordAnswer(null)
    setTimeout(() => playChordQuality(CHORD_QUALITIES[idx].intervals, BASE_FREQ), 100)
  }

  function answerChord(name: string) {
    if (chordAnswer !== null || quizChordIdx === null) return
    const correct = CHORD_QUALITIES[quizChordIdx].name
    const isCorrect = name === correct
    setChordAnswer(name)
    setChordScore(prev => ({ correct: prev.correct + (isCorrect ? 1 : 0), total: prev.total + 1 }))
    setChordHistory(prev => {
      const entry = prev[correct] ?? { correct: 0, total: 0 }
      return { ...prev, [correct]: { correct: entry.correct + (isCorrect ? 1 : 0), total: entry.total + 1 } }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">

        <div className="mb-8">
          <Link href="/" className="text-purple-300 hover:text-white text-sm">← Back to modules</Link>
          <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2 mt-4">Ear Training</h1>
          <p className="text-purple-300 text-sm sm:text-base">Train your ears to recognise intervals, chords, and melodies — the skill that ties everything together</p>
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

          {/* ── Tab 0: Why Ear Training ────────────────────────────── */}
          {activeTab === 0 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Why Ear Training Matters</h2>
              <Card>
                <h3 className="text-white font-semibold mb-2">What is ear training?</h3>
                <p className="text-purple-200 text-sm leading-relaxed">
                  Ear training is the practice of developing your ability to recognise musical elements by sound alone —
                  intervals (the distance between two notes), chord qualities (major vs minor vs 7th), rhythms, and melodies.
                  It bridges the gap between what you play and what you hear.
                </p>
              </Card>
              <Card>
                <h3 className="text-white font-semibold mb-3">What you will develop</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { icon: "🎯", title: "Interval recognition", desc: "Hear the distance between any two notes — the building block of all melody and harmony" },
                    { icon: "🎸", title: "Chord quality", desc: "Instantly tell major from minor from dominant 7th by sound, not by sight" },
                    { icon: "🎵", title: "Melodic memory", desc: "Hear a melody once and find it on your guitar — the skill behind learning songs by ear" },
                    { icon: "🥁", title: "Rhythmic precision", desc: "Internalise tempos, subdivisions, and rhythmic patterns without looking at a page" },
                  ].map(item => (
                    <div key={item.title} className="bg-black/20 rounded-xl p-3 border border-white/10">
                      <div className="text-2xl mb-1">{item.icon}</div>
                      <div className="text-white font-semibold text-sm">{item.title}</div>
                      <div className="text-purple-300 text-xs mt-1 leading-relaxed">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </Card>
              <Callout type="insight">
                Every module in this app benefits from ear training. When you can hear a chord quality, you understand
                why a substitution works. When you recognise intervals, improvisation becomes conversation rather than
                guesswork. Ear training is the multiplier on everything else you learn.
              </Callout>
              <Card>
                <h3 className="text-white font-semibold mb-2">How ear training connects to other modules</h3>
                <div className="space-y-2 text-sm">
                  {[
                    ["Improvisation", "Hear where the melody wants to go before you play it"],
                    ["Chord Substitutions", "Understand why a substitute sounds right or wrong"],
                    ["Song Library", "Learn songs from recordings, not just chord charts"],
                    ["Songwriting", "Hum melodies and know what notes they are instantly"],
                    ["Blues & Jazz", "Develop the vocabulary to respond musically in real time"],
                  ].map(([mod, benefit]) => (
                    <div key={mod} className="flex gap-3">
                      <span className="text-purple-400 shrink-0">→</span>
                      <span><span className="text-white font-semibold">{mod}:</span> <span className="text-purple-200">{benefit}</span></span>
                    </div>
                  ))}
                </div>
              </Card>
              <Callout type="tip">
                <strong>5 minutes daily beats 1 hour weekly.</strong> Ear training is a cumulative skill — short, consistent
                sessions train your auditory memory far more effectively than occasional marathon sessions. Use this module
                for 5–10 minutes each practice day and you will notice results within 2–3 weeks.
              </Callout>
            </div>
          )}

          {/* ── Tab 1: Intervals ───────────────────────────────────── */}
          {activeTab === 1 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">The 12 Intervals</h2>
              <p className="text-purple-200 text-sm mb-4 leading-relaxed">
                An interval is the distance between two notes measured in semitones. There are 12 intervals within an octave.
                Each has a unique character — once you associate that character with a sound, you can identify it anywhere.
              </p>
              <div className="space-y-3">
                {INTERVALS.map(interval => (
                  <div key={interval.name} className="bg-black/20 border border-white/10 rounded-xl p-4">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-purple-600/40 text-purple-200 text-xs font-bold px-2 py-0.5 rounded">
                            {interval.semitones} {interval.semitones === 1 ? "semitone" : "semitones"}
                          </span>
                          <span className="text-white font-semibold text-sm">{interval.name}</span>
                        </div>
                        <p className="text-purple-300 text-xs leading-relaxed">{interval.character}</p>
                        <p className="text-purple-400 text-xs mt-1">🎵 {interval.song}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => playIntervalMelodic(BASE_FREQ, interval.semitones)}
                          className="px-3 py-1.5 bg-purple-700/50 hover:bg-purple-600 text-purple-200 hover:text-white rounded-lg text-xs font-semibold transition-all">
                          ▶ Melodic
                        </button>
                        <button
                          onClick={() => playInterval(BASE_FREQ, interval.semitones)}
                          className="px-3 py-1.5 bg-purple-900/50 hover:bg-purple-700 text-purple-300 hover:text-white rounded-lg text-xs font-semibold transition-all">
                          ▶ Harmonic
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Callout type="tip">
                Use the <strong>song reference</strong> as a mnemonic. Hear the first two notes of "Here Comes the Bride"
                in your head — that's a perfect 4th. Do this for each interval until the song and the sound are fused.
              </Callout>
            </div>
          )}

          {/* ── Tab 2: Interval Trainer ────────────────────────────── */}
          {activeTab === 2 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Interval Ear Trainer</h2>
              <p className="text-purple-200 text-sm mb-4">
                Two notes will play melodically. Identify the interval between them.
              </p>

              <div className="flex gap-3 mb-6 flex-wrap">
                <button onClick={newIntervalQuestion}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition-all text-sm">
                  {quizInterval === null ? "Start Quiz" : "New Interval"}
                </button>
                {quizInterval !== null && (
                  <button onClick={() => playIntervalMelodic(quizBaseFreq, quizInterval)}
                    className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-purple-200 font-semibold rounded-xl transition-all text-sm">
                    ▶ Play Again
                  </button>
                )}
                {quizInterval !== null && !showIntervalHint && (
                  <button onClick={() => setShowIntervalHint(true)}
                    className="px-5 py-2.5 bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 font-semibold rounded-xl transition-all text-sm">
                    Hint
                  </button>
                )}
              </div>

              {/* Score */}
              <div className="flex gap-4 mb-6">
                <div className="bg-green-500/20 border border-green-500/30 rounded-xl px-4 py-2 text-center">
                  <div className="text-green-300 font-bold text-lg">{intervalScore.correct}</div>
                  <div className="text-green-400 text-xs">Correct</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-center">
                  <div className="text-white font-bold text-lg">{intervalScore.total}</div>
                  <div className="text-purple-400 text-xs">Total</div>
                </div>
                {intervalScore.total > 0 && (
                  <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl px-4 py-2 text-center">
                    <div className="text-purple-300 font-bold text-lg">
                      {Math.round((intervalScore.correct / intervalScore.total) * 100)}%
                    </div>
                    <div className="text-purple-400 text-xs">Accuracy</div>
                  </div>
                )}
              </div>

              {/* Hint */}
              {showIntervalHint && quizInterval !== null && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 mb-4 text-sm text-amber-200">
                  🎵 Song reference: <strong>{INTERVALS.find(i => i.semitones === quizInterval)?.song}</strong>
                </div>
              )}

              {/* Answer buttons */}
              {quizInterval !== null && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                  {INTERVALS.map(interval => {
                    const correctName = INTERVALS.find(i => i.semitones === quizInterval)?.name
                    let btnClass = "bg-white/10 text-purple-200 hover:bg-white/20"
                    if (quizAnswer !== null) {
                      if (interval.name === correctName) btnClass = "bg-green-600 text-white"
                      else if (interval.name === quizAnswer) btnClass = "bg-red-600 text-white"
                      else btnClass = "bg-white/5 text-purple-400"
                    }
                    return (
                      <button key={interval.name} onClick={() => answerInterval(interval.name)}
                        disabled={quizAnswer !== null}
                        className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all border border-white/10 ${btnClass}`}>
                        {interval.name}
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Result message */}
              {quizAnswer !== null && quizInterval !== null && (
                <div className={`rounded-xl p-3 mb-4 text-sm font-semibold ${quizAnswer === INTERVALS.find(i => i.semitones === quizInterval)?.name ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}`}>
                  {quizAnswer === INTERVALS.find(i => i.semitones === quizInterval)?.name
                    ? "✓ Correct!"
                    : `✗ That was a ${INTERVALS.find(i => i.semitones === quizInterval)?.name}`}
                </div>
              )}

              {/* History breakdown */}
              {Object.keys(intervalHistory).length >= 5 && (
                <Card>
                  <h3 className="text-white font-semibold mb-3 text-sm">Accuracy by interval</h3>
                  <div className="space-y-2">
                    {INTERVALS.filter(i => intervalHistory[i.name]).map(interval => {
                      const h = intervalHistory[interval.name]
                      const pct = Math.round((h.correct / h.total) * 100)
                      return (
                        <div key={interval.name} className="flex items-center gap-3">
                          <span className="text-purple-200 text-xs w-28 shrink-0">{interval.name}</span>
                          <div className="flex-1 bg-white/10 rounded-full h-2">
                            <div className={`h-2 rounded-full ${pct >= 80 ? "bg-green-500" : pct >= 50 ? "bg-amber-500" : "bg-red-500"}`}
                              style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-purple-300 text-xs w-10 text-right">{pct}%</span>
                        </div>
                      )
                    })}
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* ── Tab 3: Chord Quality ───────────────────────────────── */}
          {activeTab === 3 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Chord Quality by Ear</h2>
              <p className="text-purple-200 text-sm mb-4 leading-relaxed">
                Every chord type has a distinct emotional colour. Click each chord to hear it and absorb its character.
              </p>
              <div className="grid sm:grid-cols-2 gap-3 mb-6">
                {CHORD_QUALITIES.map(chord => (
                  <button key={chord.name} onClick={() => playChordQuality(chord.intervals, BASE_FREQ)}
                    className={`border rounded-xl p-4 text-left hover:brightness-110 transition-all ${chord.color}`}>
                    <div className="font-bold text-sm mb-1">{chord.name} ▶</div>
                    <div className="text-xs leading-relaxed opacity-80">{chord.character}</div>
                    <div className="text-xs opacity-60 mt-1">e.g. {chord.song}</div>
                  </button>
                ))}
              </div>
              <Card>
                <h3 className="text-white font-semibold mb-2">How to distinguish them</h3>
                <div className="space-y-2 text-sm">
                  {[
                    ["Major vs Minor", "Major sounds resolved and upward; minor sounds darker and inward. The 3rd (3rd note of the chord) is the key difference — major 3rd vs minor 3rd."],
                    ["Dom 7th vs Major 7th", "Both are \"major-flavoured\" but the dom 7th has a b7 that creates tension, while the major 7th adds a dreamy floating quality."],
                    ["Minor 7th vs Diminished", "Minor 7th is smooth and relaxed; diminished has a tense, unstable quality because of the tritone between the root and the diminished 5th."],
                  ].map(([pair, desc]) => (
                    <div key={pair} className="bg-black/20 rounded-lg p-3 border border-white/5">
                      <div className="text-white font-semibold text-xs mb-1">{pair}</div>
                      <div className="text-purple-300 text-xs leading-relaxed">{desc}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* ── Tab 4: Chord Trainer ───────────────────────────────── */}
          {activeTab === 4 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Chord Quality Trainer</h2>
              <p className="text-purple-200 text-sm mb-4">
                A chord will play. Identify its quality from the six buttons.
              </p>
              <div className="flex gap-3 mb-6 flex-wrap">
                <button onClick={newChordQuestion}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition-all text-sm">
                  {quizChordIdx === null ? "Start Quiz" : "New Chord"}
                </button>
                {quizChordIdx !== null && (
                  <button onClick={() => playChordQuality(CHORD_QUALITIES[quizChordIdx].intervals, BASE_FREQ)}
                    className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-purple-200 font-semibold rounded-xl transition-all text-sm">
                    ▶ Play Again
                  </button>
                )}
              </div>

              {/* Score */}
              <div className="flex gap-4 mb-6">
                <div className="bg-green-500/20 border border-green-500/30 rounded-xl px-4 py-2 text-center">
                  <div className="text-green-300 font-bold text-lg">{chordScore.correct}</div>
                  <div className="text-green-400 text-xs">Correct</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-center">
                  <div className="text-white font-bold text-lg">{chordScore.total}</div>
                  <div className="text-purple-400 text-xs">Total</div>
                </div>
                {chordScore.total > 0 && (
                  <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl px-4 py-2 text-center">
                    <div className="text-purple-300 font-bold text-lg">
                      {Math.round((chordScore.correct / chordScore.total) * 100)}%
                    </div>
                    <div className="text-purple-400 text-xs">Accuracy</div>
                  </div>
                )}
              </div>

              {quizChordIdx !== null && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                  {CHORD_QUALITIES.map(chord => {
                    const correct = CHORD_QUALITIES[quizChordIdx].name
                    let btnClass = "bg-white/10 text-purple-200 hover:bg-white/20"
                    if (chordAnswer !== null) {
                      if (chord.name === correct) btnClass = "bg-green-600 text-white"
                      else if (chord.name === chordAnswer) btnClass = "bg-red-600 text-white"
                      else btnClass = "bg-white/5 text-purple-400"
                    }
                    return (
                      <button key={chord.name} onClick={() => answerChord(chord.name)}
                        disabled={chordAnswer !== null}
                        className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all border border-white/10 ${btnClass}`}>
                        {chord.name}
                      </button>
                    )
                  })}
                </div>
              )}

              {chordAnswer !== null && quizChordIdx !== null && (
                <div className={`rounded-xl p-3 mb-4 text-sm font-semibold ${chordAnswer === CHORD_QUALITIES[quizChordIdx].name ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}`}>
                  {chordAnswer === CHORD_QUALITIES[quizChordIdx].name
                    ? "✓ Correct!"
                    : `✗ That was a ${CHORD_QUALITIES[quizChordIdx].name} — ${CHORD_QUALITIES[quizChordIdx].character}`}
                </div>
              )}

              {Object.keys(chordHistory).length >= 4 && (
                <Card>
                  <h3 className="text-white font-semibold mb-3 text-sm">Accuracy by chord quality</h3>
                  <div className="space-y-2">
                    {CHORD_QUALITIES.filter(c => chordHistory[c.name]).map(chord => {
                      const h = chordHistory[chord.name]
                      const pct = Math.round((h.correct / h.total) * 100)
                      return (
                        <div key={chord.name} className="flex items-center gap-3">
                          <span className="text-purple-200 text-xs w-24 shrink-0">{chord.name}</span>
                          <div className="flex-1 bg-white/10 rounded-full h-2">
                            <div className={`h-2 rounded-full ${pct >= 80 ? "bg-green-500" : pct >= 50 ? "bg-amber-500" : "bg-red-500"}`}
                              style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-purple-300 text-xs w-10 text-right">{pct}%</span>
                        </div>
                      )
                    })}
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* ── Tab 5: Melodic Memory ──────────────────────────────── */}
          {activeTab === 5 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Melodic Memory</h2>
              <Card>
                <h3 className="text-white font-semibold mb-2">What is melodic memory?</h3>
                <p className="text-purple-200 text-sm leading-relaxed">
                  Melodic memory is the ability to hold a melody in your mind and reproduce it on your instrument without
                  the music in front of you. It is the core skill behind learning songs by ear, transcribing solos, and
                  improvising melodically rather than just pattern-playing.
                </p>
              </Card>
              <Callout type="insight">
                <strong>Sing what you play.</strong> The most powerful melodic memory exercise is also the simplest: hum
                or sing every note you play. If you can not sing it, you do not truly know it. This single habit,
                practised consistently, will transform your musical ear within months.
              </Callout>
              <Card>
                <h3 className="text-white font-semibold mb-3">5-step method for learning a melody by ear</h3>
                <div className="space-y-3">
                  {[
                    ["1. Listen whole", "Play the melody through 3–4 times without your guitar. Just absorb the shape and feel."],
                    ["2. Hum it", "Before touching your guitar, hum or sing the melody. This forces your brain to encode it aurally."],
                    ["3. Find the first note", "This is the unlock. Find the starting pitch on your guitar. Everything else follows from there."],
                    ["4. Work phrase by phrase", "Learn one small phrase (2–4 bars), confirm it's correct, then move to the next. Never learn a wrong version."],
                    ["5. Connect phrases", "Once each phrase is solid, string them together. The transitions between phrases are where mistakes hide."],
                  ].map(([step, desc]) => (
                    <div key={step} className="flex gap-3">
                      <span className="text-purple-400 font-bold text-sm shrink-0 mt-0.5">{step}</span>
                      <span className="text-purple-200 text-sm leading-relaxed">{desc}</span>
                    </div>
                  ))}
                </div>
              </Card>
              <Card>
                <h3 className="text-white font-semibold mb-3">Daily melodic memory exercises</h3>
                <div className="space-y-2">
                  {[
                    "Sing any scale you practice — every note, out loud. Connect the sound to the position.",
                    "Learn one new melody a week purely by ear (a nursery rhyme, a TV jingle, a simple folk song).",
                    "After practising a riff or lick, put your guitar down and try to sing it perfectly. Then pick up and check.",
                    "Transcribe: find a 4-bar melody in a song you love and work out the exact notes. Slow down on YouTube or use an app.",
                    "Play a note on your guitar, close your eyes, and try to hear a different note before playing it — then play.",
                  ].map((ex, i) => (
                    <div key={i} className="flex gap-2 text-sm text-purple-200">
                      <span className="text-purple-400 shrink-0">•</span>
                      <span>{ex}</span>
                    </div>
                  ))}
                </div>
              </Card>
              <Callout type="tip">
                <strong>Relative pitch vs perfect pitch:</strong> Perfect pitch (knowing a note name without reference)
                is rare and largely innate. Relative pitch (knowing the relationship between notes) is trainable by
                anyone. All professional musicians use relative pitch — it is the practical, learnable skill this module
                develops.
              </Callout>
            </div>
          )}

          {/* ── Tab 6: Practice Plan ──────────────────────────────── */}
          {activeTab === 6 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Ear Training Practice Plan</h2>
              <Card>
                <h3 className="text-white font-semibold mb-3">Daily 10-minute structure</h3>
                <div className="space-y-2">
                  {[
                    { time: "3 min", task: "Interval trainer — focus on the 3–4 intervals you score worst on", color: "bg-purple-600/40" },
                    { time: "3 min", task: "Chord quality trainer — cycle through all 6 types at least twice", color: "bg-blue-600/40" },
                    { time: "4 min", task: "Melodic sing-back — pick a melody from the radio/playlist and try to find the first 4 bars on your guitar", color: "bg-green-600/40" },
                  ].map(item => (
                    <div key={item.task} className="flex gap-3 items-start">
                      <span className={`${item.color} text-white text-xs font-mono px-2 py-0.5 rounded shrink-0 mt-0.5`}>{item.time}</span>
                      <span className="text-purple-200 text-sm">{item.task}</span>
                    </div>
                  ))}
                </div>
              </Card>
              <Card>
                <h3 className="text-white font-semibold mb-4">4-Week Progression</h3>
                <div className="space-y-3">
                  {[
                    { week: "Week 1", focus: "Core 5 intervals", color: "border-purple-500", tasks: ["Focus on: unison, minor 3rd, major 3rd, perfect 4th, perfect 5th — the most common in music", "Drill each one using the song references until you can identify them in 1 second", "Sing: C major scale ascending and descending every day"] },
                    { week: "Week 2", focus: "Full interval set", color: "border-blue-500", tasks: ["Add: minor 2nd, major 2nd, tritone, minor 6th, major 6th, minor 7th, major 7th, octave", "Take the interval trainer daily — aim for 75%+ accuracy", "Transcription: find the first 4 notes of a song you know well"] },
                    { week: "Week 3", focus: "Chord qualities", color: "border-green-500", tasks: ["Listen to each chord quality in the Chord Quality tab daily before quizzing", "Chord trainer: aim for 80%+ on major, minor, dom 7th. They are most common.", "Contextual listening: when you hear music, try to identify the chord quality by ear"] },
                    { week: "Week 4", focus: "Real music application", color: "border-amber-500", tasks: ["Transcribe a melody from a recording (start simple — a folk song or well-known riff)", "Identify chord qualities in a song you're learning without looking at a chord chart", "Maintain interval and chord quiz practice — the skills will fade without continued use"] },
                  ].map(w => (
                    <div key={w.week} className={`border-l-4 ${w.color} bg-black/20 rounded-xl p-4`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-white font-bold text-sm">{w.week}</span>
                        <span className="text-purple-300 text-xs">— {w.focus}</span>
                      </div>
                      <ul className="space-y-1">
                        {w.tasks.map((t, i) => (
                          <li key={i} className="text-purple-200 text-xs flex gap-2 leading-relaxed">
                            <span className="text-purple-400 shrink-0">•</span><span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Card>
              <Card>
                <h3 className="text-white font-semibold mb-2">Milestones to aim for</h3>
                <div className="space-y-2">
                  {[
                    "Month 1: Identify any of the 5 core intervals within 2 seconds, reliably distinguish major from minor",
                    "Month 2: Identify all 12 intervals with 75%+ accuracy, name all 6 chord qualities by ear",
                    "Month 3: Transcribe a simple 8-bar melody from a recording without assistance",
                    "Month 6: Learn any song you know well by ear in one sitting",
                  ].map((m, i) => (
                    <div key={i} className="flex gap-2 text-sm text-purple-200">
                      <span className="text-amber-400 shrink-0">★</span><span>{m}</span>
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
