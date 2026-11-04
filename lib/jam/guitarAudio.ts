// Guitar sound for chords and notes, shared by the whole app. Created lazily on a tap.
// Real samples (General MIDI guitars, downloaded on first use); a plucked-string synth plays until they arrive or if offline.
import { useSyncExternalStore } from "react"

let ctx: AudioContext | null = null
let master: GainNode | null = null
let live: { stop: () => void }[] = []
let endTimer: number | undefined
let endCb: (() => void) | null = null

export type GuitarKind = "steel" | "nylon" | "electric" | "overdrive"
export type SoundStatus = "synth" | "loading" | "samples"

export const GUITARS: { id: GuitarKind; label: string }[] = [
  { id: "steel", label: "Steel string" },
  { id: "nylon", label: "Nylon" },
  { id: "electric", label: "Electric" },
  { id: "overdrive", label: "Overdrive" },
]

const PREF_KEY = "guitar.sound.v1"
let pref: GuitarKind = "steel"
let prefRead = false
const prefListeners = new Set<() => void>()

export function getGuitarKind(): GuitarKind {
  if (!prefRead && typeof window !== "undefined") {
    prefRead = true
    try {
      const v = window.localStorage.getItem(PREF_KEY)
      if (v && GUITARS.some(g => g.id === v)) pref = v as GuitarKind
    } catch { /* storage blocked */ }
  }
  return pref
}

export function setGuitarKind(k: GuitarKind) {
  prefRead = true
  pref = k
  try { window.localStorage.setItem(PREF_KEY, k) } catch { /* storage blocked */ }
  prefListeners.forEach(l => l())
  preloadGuitar(k)
}

function onGuitarKind(cb: () => void) {
  prefListeners.add(cb)
  return () => { prefListeners.delete(cb) }
}

/** The guitar sound the user picked, remembered between visits and shared by every page. */
export function useGuitarKind(): [GuitarKind, (k: GuitarKind) => void] {
  const kind = useSyncExternalStore(onGuitarKind, getGuitarKind, () => "steel" as const)
  return [kind, setGuitarKind]
}

const NAMES: Record<GuitarKind, string> = {
  steel: "acoustic_guitar_steel",
  nylon: "acoustic_guitar_nylon",
  electric: "electric_guitar_clean",
  overdrive: "overdriven_guitar",
}
// The overdriven samples are much louder than the others
const GAIN: Record<GuitarKind, number> = { steel: 2.2, nylon: 2.2, electric: 2.2, overdrive: 1.1 }

type SfPlayer = {
  play: (note: number, when?: number, opts?: { gain?: number; duration?: number; attack?: number; release?: number }) => unknown
  stop: (when?: number) => unknown
}

const samples: Partial<Record<GuitarKind, SfPlayer>> = {}
const tried: Partial<Record<GuitarKind, boolean>> = {}
let status: SoundStatus = "synth"
const listeners = new Set<() => void>()

function setStatus(s: SoundStatus) {
  if (s === status) return
  status = s
  listeners.forEach(l => l())
}

export function guitarStatus(): SoundStatus {
  return status
}

export function onGuitarStatus(cb: () => void) {
  listeners.add(cb)
  return () => { listeners.delete(cb) }
}

function ensure(): AudioContext | null {
  if (typeof window === "undefined") return null
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    ctx = new AC()
    const nav = navigator as Navigator & { audioSession?: { type: string } }
    if (nav.audioSession) { try { nav.audioSession.type = "playback" } catch { /* not supported */ } }
    master = ctx.createGain()
    master.gain.value = 0.7
    master.connect(ctx.destination)
  }
  if (ctx.state !== "running") void ctx.resume().catch(() => {})
  return ctx
}

// Call from a tap. Safe to call many times; each guitar downloads once.
export function preloadGuitar(kind: GuitarKind) {
  const c = ensure()
  if (!c || !master || samples[kind]) { if (samples[kind]) setStatus("samples"); return }
  if (tried[kind]) return
  tried[kind] = true
  setStatus("loading")
  const dest = master
  import("soundfont-player")
    .then(mod => {
      const api = ((mod as { default?: unknown }).default ?? mod) as {
        instrument: (ac: AudioContext, name: string, o?: object) => Promise<SfPlayer>
      }
      return api.instrument(c, NAMES[kind], { soundfont: "FluidR3_GM", format: "mp3", destination: dest })
    })
    .then(p => { samples[kind] = p; setStatus("samples") })
    .catch(() => { tried[kind] = false; setStatus("synth") })
}

const freq = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12)

// Plucked string: a bright start that darkens and dies away.
function pluck(c: AudioContext, out: AudioNode, midi: number, when: number, dur: number) {
  const f = freq(midi)
  const env = c.createGain()
  env.gain.setValueAtTime(0.0001, when)
  env.gain.exponentialRampToValueAtTime(0.35, when + 0.005)
  env.gain.exponentialRampToValueAtTime(0.0001, when + dur)
  const filter = c.createBiquadFilter()
  filter.type = "lowpass"
  filter.frequency.setValueAtTime(Math.min(6000, f * 8), when)
  filter.frequency.exponentialRampToValueAtTime(Math.max(300, f * 1.5), when + dur * 0.6)
  filter.connect(env)
  env.connect(out)
  const oscs = (["sawtooth", "triangle"] as OscillatorType[]).map(type => {
    const o = c.createOscillator()
    const g = c.createGain()
    o.type = type
    o.frequency.value = f
    g.gain.value = 0.5
    o.connect(g)
    g.connect(filter)
    o.start(when)
    o.stop(when + dur + 0.05)
    return o
  })
  return {
    stop: () => {
      try {
        const t = c.currentTime
        env.gain.cancelScheduledValues(t)
        env.gain.setValueAtTime(Math.max(env.gain.value, 0.0001), t)
        env.gain.exponentialRampToValueAtTime(0.0001, t + 0.06)
        oscs.forEach(o => o.stop(t + 0.07))
      } catch { /* already stopped */ }
    },
  }
}

export function stopGuitar() {
  if (endTimer !== undefined) window.clearTimeout(endTimer)
  endTimer = undefined
  live.forEach(v => v.stop())
  live = []
  ;(Object.values(samples) as SfPlayer[]).forEach(p => { try { p.stop(ctx?.currentTime) } catch { /* nothing playing */ } })
  const cb = endCb
  endCb = null
  cb?.()
}

export type PlayStyle = "strum" | "notes"

// midis are low to high. "strum" rolls the notes quickly; "notes" plays them one at a time.
export function playGuitar(midis: number[], kind: GuitarKind, style: PlayStyle, onEnd?: () => void) {
  const c = ensure()
  if (!c || !master || midis.length === 0) { onEnd?.(); return }
  stopGuitar()
  preloadGuitar(kind)
  const gap = style === "strum" ? 0.045 : 0.4
  const ring = style === "strum" ? 2.2 : 1.6
  const t0 = c.currentTime + 0.05
  const sample = samples[kind]
  midis.forEach((m, i) => {
    const when = t0 + i * gap
    if (sample) {
      sample.play(m, when, { gain: GAIN[kind], duration: ring, attack: 0.005, release: 0.4 })
      live.push({ stop: () => { try { sample.stop(c.currentTime) } catch { /* nothing playing */ } } })
    } else {
      live.push(pluck(c, master!, m, when, ring))
    }
  })
  endCb = onEnd ?? null
  endTimer = window.setTimeout(() => {
    endTimer = undefined
    live = []
    const cb = endCb
    endCb = null
    cb?.()
  }, (midis.length * gap + ring) * 1000)
}

// One note, for sequenced playback (scales, arpeggios, quizzes). Does not cut off other notes.
// Call preloadGuitar from the tap that starts a sequence so the context exists.
export function playGuitarNote(midi: number, kind: GuitarKind = getGuitarKind(), opts: { delay?: number; ring?: number; volume?: number } = {}) {
  const c = ensure()
  if (!c || !master) return
  preloadGuitar(kind)
  const when = c.currentTime + 0.03 + (opts.delay ?? 0)
  const ring = opts.ring ?? 1.4
  const sample = samples[kind]
  if (sample) sample.play(midi, when, { gain: GAIN[kind] * (opts.volume ?? 1), duration: ring, attack: 0.005, release: 0.35 })
  else pluck(c, master, midi, when, ring)
}

export const STANDARD_MIDI = [40, 45, 50, 55, 59, 64]

/** MIDI notes for a chord diagram's fingers, ordered E A D G B e. Muted strings are skipped. */
export function fingersToMidi(fingers: (number | string)[]): number[] {
  const out: number[] = []
  fingers.forEach((f, i) => {
    const n = typeof f === "number" ? f : f === "x" || f === "X" ? NaN : Number(f)
    if (Number.isFinite(n) && i < 6) out.push(STANDARD_MIDI[i] + n)
  })
  return out
}
