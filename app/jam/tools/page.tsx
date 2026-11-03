"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { BigButton, Chip, Hint, Panel } from "@/components/jam/ui"
import { useWakeLock } from "@/lib/jam/storage"

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

const INSTRUMENTS = {
  guitar: [
    { name: "E", oct: 2, f: 82.41 }, { name: "A", oct: 2, f: 110 }, { name: "D", oct: 3, f: 146.83 },
    { name: "G", oct: 3, f: 196 }, { name: "B", oct: 3, f: 246.94 }, { name: "E", oct: 4, f: 329.63 },
  ],
  bass: [
    { name: "E", oct: 1, f: 41.2 }, { name: "A", oct: 1, f: 55 }, { name: "D", oct: 2, f: 73.42 }, { name: "G", oct: 2, f: 98 },
  ],
}

function detectPitch(buf: Float32Array, sampleRate: number): number {
  let size = buf.length
  let rms = 0
  for (let i = 0; i < size; i++) rms += buf[i] * buf[i]
  rms = Math.sqrt(rms / size)
  if (rms < 0.01) return -1

  let r1 = 0
  let r2 = size - 1
  const thres = 0.2
  for (let i = 0; i < size / 2; i++) if (Math.abs(buf[i]) < thres) { r1 = i; break }
  for (let i = 1; i < size / 2; i++) if (Math.abs(buf[size - i]) < thres) { r2 = size - i; break }
  const b = buf.slice(r1, r2)
  size = b.length
  if (size < 64) return -1

  const c = new Float32Array(size)
  for (let i = 0; i < size; i++) {
    let sum = 0
    for (let j = 0; j < size - i; j++) sum += b[j] * b[j + i]
    c[i] = sum
  }
  let d = 0
  while (d < size - 1 && c[d] > c[d + 1]) d++
  let maxval = -1
  let maxpos = -1
  for (let i = d; i < size; i++) if (c[i] > maxval) { maxval = c[i]; maxpos = i }
  if (maxpos <= 0 || maxpos >= size - 1) return -1
  const x1 = c[maxpos - 1], x2 = c[maxpos], x3 = c[maxpos + 1]
  const a = (x1 + x3 - 2 * x2) / 2
  const bb = (x3 - x1) / 2
  const t0 = a ? maxpos - bb / (2 * a) : maxpos
  return sampleRate / t0
}

function describe(freq: number) {
  const midi = 69 + 12 * Math.log2(freq / 440)
  const near = Math.round(midi)
  const cents = Math.round((midi - near) * 100)
  return { note: NOTE_NAMES[((near % 12) + 12) % 12], oct: Math.floor(near / 12) - 1, cents, freq }
}

function Tuner() {
  const [running, setRunning] = useState(false)
  const [error, setError] = useState("")
  const [reading, setReading] = useState<ReturnType<typeof describe> | null>(null)
  const [inst, setInst] = useState<"guitar" | "bass">("guitar")
  const ctxRef = useRef<AudioContext | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const timer = useRef<number | null>(null)
  const history = useRef<number[]>([])

  useWakeLock(running)

  const stop = useCallback(() => {
    if (timer.current) window.clearInterval(timer.current)
    timer.current = null
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    ctxRef.current?.close().catch(() => {})
    ctxRef.current = null
    history.current = []
    setRunning(false)
    setReading(null)
  }, [])

  useEffect(() => stop, [stop])

  async function start() {
    setError("")
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      })
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      await ctx.resume()
      const src = ctx.createMediaStreamSource(stream)
      const an = ctx.createAnalyser()
      an.fftSize = 8192
      src.connect(an)
      ctxRef.current = ctx
      streamRef.current = stream
      const raw = new Float32Array(an.fftSize)
      const dec = 4
      const small = new Float32Array(an.fftSize / dec)
      timer.current = window.setInterval(() => {
        an.getFloatTimeDomainData(raw)
        for (let i = 0; i < small.length; i++) {
          let s = 0
          for (let k = 0; k < dec; k++) s += raw[i * dec + k]
          small[i] = s / dec
        }
        const f = detectPitch(small, ctx.sampleRate / dec)
        if (f > 30 && f < 1200) {
          history.current = [...history.current.slice(-4), f]
          const sorted = [...history.current].sort((a, b) => a - b)
          setReading(describe(sorted[Math.floor(sorted.length / 2)]))
        } else {
          history.current = []
        }
      }, 120)
      setRunning(true)
    } catch {
      setError("Couldn't reach the microphone. Allow mic access for this site in your browser settings, then try again.")
    }
  }

  function playRef(f: number) {
    const ctx = new AudioContext()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = "triangle"
    o.frequency.value = f
    g.gain.setValueAtTime(0.0001, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.4, ctx.currentTime + 0.05)
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.2)
    o.connect(g).connect(ctx.destination)
    o.start()
    o.stop(ctx.currentTime + 2.3)
    o.onended = () => ctx.close().catch(() => {})
  }

  const strings = INSTRUMENTS[inst]
  const cents = reading?.cents ?? 0
  const inTune = reading && Math.abs(cents) <= 5
  const pos = reading ? Math.max(-50, Math.min(50, cents)) : 0

  return (
    <Panel title="Tuner">
      <div className="mb-3 flex gap-2">
        <Chip active={inst === "guitar"} onClick={() => setInst("guitar")}>Guitar</Chip>
        <Chip active={inst === "bass"} onClick={() => setInst("bass")}>Bass</Chip>
      </div>

      <div className={`rounded-2xl border-2 p-4 text-center ${inTune ? "border-emerald-400 bg-emerald-400/10" : "border-white/15 bg-black/40"}`} aria-live="polite">
        <p className={`text-8xl font-black leading-none ${inTune ? "text-emerald-300" : "text-white"}`}>{reading ? reading.note : "—"}</p>
        <p className="mt-1 h-5 text-sm text-purple-200">{reading ? `${reading.freq.toFixed(1)} Hz` : running ? "Pluck a string..." : ""}</p>
        <div className="relative mx-auto mt-4 h-4 max-w-sm rounded-full bg-white/10">
          <div className="absolute left-1/2 top-[-4px] h-6 w-0.5 bg-white/60" />
          <div
            className={`absolute top-0 h-4 w-4 -translate-x-1/2 rounded-full transition-all duration-100 ${reading ? (inTune ? "bg-emerald-400" : "bg-amber-400") : "bg-white/20"}`}
            style={{ left: `${50 + pos}%` }}
          />
        </div>
        <p className="mt-3 h-7 text-lg font-bold">
          {!reading ? "" : inTune ? "In tune" : cents < 0 ? `Too low · tune up ${Math.abs(cents)}¢` : `Too high · tune down ${cents}¢`}
        </p>
      </div>

      <BigButton className="mt-3 w-full" tone={running ? "danger" : "primary"} onClick={running ? stop : start}>
        {running ? "Stop tuner" : "Start tuner"}
      </BigButton>
      {error && <p className="mt-2 text-sm text-red-300">{error}</p>}

      <p className="mb-2 mt-4 text-xs font-bold uppercase tracking-wider text-purple-300">Tap to hear the note</p>
      <div className={`grid gap-2 ${strings.length === 6 ? "grid-cols-6" : "grid-cols-4"}`}>
        {strings.map((s, i) => (
          <Chip key={i} onClick={() => playRef(s.f)} className="flex-col px-0 leading-tight" ariaLabel={`Play ${s.name}${s.oct}`}>
            {s.name}<span className="text-xs font-medium opacity-60">{s.oct}</span>
          </Chip>
        ))}
      </div>
      <Hint>Standard tuning, low to high. The tuner hears any note, not just these.</Hint>
    </Panel>
  )
}

function Metronome() {
  const [bpm, setBpm] = useState(100)
  const [beats, setBeats] = useState(4)
  const [running, setRunning] = useState(false)
  const [beat, setBeat] = useState(-1)
  const taps = useRef<number[]>([])
  const ctxRef = useRef<AudioContext | null>(null)
  const bpmRef = useRef(bpm)
  const beatsRef = useRef(beats)
  bpmRef.current = bpm
  beatsRef.current = beats

  useWakeLock(running)

  useEffect(() => {
    if (!running) return
    const ctx = new AudioContext()
    ctxRef.current = ctx
    ctx.resume()
    let next = ctx.currentTime + 0.08
    let n = 0
    const timeouts: number[] = []
    const click = (time: number, accent: boolean) => {
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.frequency.value = accent ? 1500 : 1000
      g.gain.setValueAtTime(0.0001, time)
      g.gain.exponentialRampToValueAtTime(0.7, time + 0.002)
      g.gain.exponentialRampToValueAtTime(0.0001, time + 0.06)
      o.connect(g).connect(ctx.destination)
      o.start(time)
      o.stop(time + 0.08)
    }
    const timer = window.setInterval(() => {
      while (next < ctx.currentTime + 0.12) {
        const idx = n % beatsRef.current
        click(next, idx === 0)
        timeouts.push(window.setTimeout(() => setBeat(idx), Math.max(0, (next - ctx.currentTime) * 1000)))
        next += 60 / bpmRef.current
        n++
      }
    }, 25)
    return () => {
      window.clearInterval(timer)
      timeouts.forEach(window.clearTimeout)
      ctx.close().catch(() => {})
      setBeat(-1)
    }
  }, [running])

  function tap() {
    const now = performance.now()
    const prev = taps.current
    const recent = prev.length && now - prev[prev.length - 1] > 2000 ? [] : prev
    const next = [...recent, now].slice(-8)
    taps.current = next
    if (next.length >= 2) {
      const avg = (next[next.length - 1] - next[0]) / (next.length - 1)
      setBpm(Math.max(30, Math.min(240, Math.round(60000 / avg))))
    }
  }

  return (
    <Panel title="Tempo">
      <div className="flex items-center justify-between gap-2">
        <BigButton tone="ghost" className="w-20 px-0" onClick={() => setBpm(b => Math.max(30, b - 1))} ariaLabel="Slower">−</BigButton>
        <div className="text-center">
          <p className="text-6xl font-black leading-none text-amber-300">{bpm}</p>
          <p className="text-sm text-purple-200">beats per minute</p>
        </div>
        <BigButton tone="ghost" className="w-20 px-0" onClick={() => setBpm(b => Math.min(240, b + 1))} ariaLabel="Faster">+</BigButton>
      </div>
      <label htmlFor="bpm-slider" className="sr-only">Tempo</label>
      <input id="bpm-slider" type="range" min={30} max={240} value={bpm} onChange={e => setBpm(parseInt(e.target.value, 10))} className="mt-3 h-10 w-full accent-amber-400" />

      <div className="mt-3 flex items-center justify-center gap-2">
        {Array.from({ length: beats }).map((_, i) => (
          <span key={i} className={`h-5 w-5 rounded-full ${beat === i ? (i === 0 ? "bg-amber-400" : "bg-white") : "bg-white/20"}`} />
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span className="text-sm font-semibold text-purple-200">Beats</span>
        {[2, 3, 4, 6].map(n => <Chip key={n} active={beats === n} onClick={() => setBeats(n)}>{n}</Chip>)}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <BigButton tone={running ? "danger" : "primary"} onClick={() => setRunning(r => !r)}>{running ? "Stop" : "Start"}</BigButton>
        <BigButton tone="ghost" onClick={tap}>Tap tempo</BigButton>
      </div>
      <Hint>Tap along with the song four or more times and the tempo fills in.</Hint>
    </Panel>
  )
}

export default function Tools() {
  return (
    <div className="space-y-4">
      <Tuner />
      <Metronome />
    </div>
  )
}
