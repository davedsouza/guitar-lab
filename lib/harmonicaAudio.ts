// Simple reed-like synth for the harmonica module. Created lazily on a user tap.
let ctx: AudioContext | null = null
let master: GainNode | null = null
let live: { stop: () => void }[] = []

function ensure(): AudioContext | null {
  if (typeof window === "undefined") return null
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    ctx = new AC()
    // iOS 17+: play through the speaker even when the ring/silent switch is on
    const nav = navigator as Navigator & { audioSession?: { type: string } }
    if (nav.audioSession) { try { nav.audioSession.type = "playback" } catch { /* not supported */ } }
    master = ctx.createGain()
    master.gain.value = 0.5
    // Phone speakers are quiet, so notes are loud and a limiter catches chord peaks
    const limiter = ctx.createDynamicsCompressor()
    limiter.threshold.value = -8
    limiter.knee.value = 6
    limiter.ratio.value = 12
    limiter.attack.value = 0.003
    limiter.release.value = 0.15
    master.connect(limiter)
    limiter.connect(ctx.destination)
  }
  if (ctx.state !== "running") void ctx.resume().catch(() => {})
  return ctx
}

const freq = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12)

function voice(c: AudioContext, out: AudioNode, midi: number, when: number, dur: number, vol: number) {
  const f = freq(midi)
  const filter = c.createBiquadFilter()
  filter.type = "lowpass"
  filter.frequency.value = Math.min(4200, f * 5)
  filter.Q.value = 1.2
  const env = c.createGain()
  env.gain.setValueAtTime(0.0001, when)
  env.gain.exponentialRampToValueAtTime(vol, when + 0.04)
  env.gain.setValueAtTime(vol, when + Math.max(0.05, dur - 0.08))
  env.gain.exponentialRampToValueAtTime(0.0001, when + dur)
  filter.connect(env)
  env.connect(out)
  const oscs = [-6, 6].map(detune => {
    const o = c.createOscillator()
    o.type = "sawtooth"
    o.frequency.value = f
    o.detune.value = detune
    o.connect(filter)
    o.start(when)
    o.stop(when + dur + 0.05)
    return o
  })
  return {
    // fade out over 40 ms so cutting a note short does not click
    stop: () => {
      try {
        const t = c.currentTime
        env.gain.cancelScheduledValues(t)
        env.gain.setValueAtTime(Math.max(env.gain.value, 0.0001), t)
        env.gain.exponentialRampToValueAtTime(0.0001, t + 0.04)
        oscs.forEach(o => o.stop(t + 0.05))
      } catch { /* already stopped */ }
    },
  }
}

// ── Real harmonica samples (General MIDI "harmonica" soundfont) ──
// Downloaded on the first tap (about 2.7 MB). Until it arrives, or if it cannot load (offline), the synth above plays.
type SfPlayer = {
  play: (note: number, when?: number, opts?: { gain?: number; duration?: number; attack?: number; release?: number }) => unknown
  stop: (when?: number) => unknown
}
export type SoundStatus = "synth" | "loading" | "samples"

let sample: SfPlayer | null = null
let status: SoundStatus = "synth"
let triedLoad = false
const statusListeners = new Set<(s: SoundStatus) => void>()

function setStatus(s: SoundStatus) {
  status = s
  statusListeners.forEach(l => l(s))
}

export function soundStatus(): SoundStatus {
  return status
}

export function onSoundStatus(cb: (s: SoundStatus) => void) {
  statusListeners.add(cb)
  return () => { statusListeners.delete(cb) }
}

// Call from a tap or click. Safe to call many times; it only downloads once.
export function preloadSound() {
  const c = ensure()
  if (!c || !master || triedLoad) return
  triedLoad = true
  setStatus("loading")
  const dest = master
  import("soundfont-player")
    .then(mod => {
      const api = ((mod as { default?: unknown }).default ?? mod) as {
        instrument: (ac: AudioContext, name: string, o?: object) => Promise<SfPlayer>
      }
      return api.instrument(c, "harmonica", { soundfont: "FluidR3_GM", format: "mp3", destination: dest })
    })
    .then(p => { sample = p; setStatus("samples") })
    .catch(() => { triedLoad = false; setStatus("synth") })
}

// The harmonica recording is about 15 dB quieter than the synth at the same gain
const SAMPLE_BOOST = 22

function note(c: AudioContext, midi: number, when: number, dur: number, vol: number) {
  if (sample) {
    const p = sample
    p.play(midi, when, { gain: vol * SAMPLE_BOOST, duration: dur, attack: 0.03, release: 0.12 })
    return { stop: () => { try { p.stop(c.currentTime) } catch { /* nothing playing */ } } }
  }
  return voice(c, master!, midi, when, dur, vol)
}

let endCb: (() => void) | null = null
let endTimer: number | undefined

// Stops every sound and tells whoever was playing that it ended.
export function stopAll() {
  if (endTimer !== undefined) window.clearTimeout(endTimer)
  endTimer = undefined
  live.forEach(v => v.stop())
  live = []
  const cb = endCb
  endCb = null
  cb?.()
}

export function playNotes(midis: number[], seconds = 1) {
  const c = ensure()
  if (!c || !master) return
  preloadSound()
  stopAll()
  const vol = 0.22 / Math.sqrt(midis.length)
  midis.forEach(m => live.push(note(c, m, c.currentTime + 0.01, seconds, vol)))
}

export interface SeqStep { midis: number[]; at: number; len: number }

// Plays steps (beats) at the given tempo. onEnd fires when the last note finishes or when anything else starts or stops the sound.
export function playSequence(steps: SeqStep[], bpm: number, onEnd?: () => void) {
  const c = ensure()
  if (!c || !master || steps.length === 0) { onEnd?.(); return }
  preloadSound()
  stopAll()
  const spb = 60 / bpm
  const t0 = c.currentTime + 0.08
  let end = 0
  for (const s of steps) {
    const vol = 0.2 / Math.sqrt(s.midis.length)
    const dur = Math.max(0.12, s.len * spb * 0.92)
    s.midis.forEach(m => live.push(note(c, m, t0 + s.at * spb, dur, vol)))
    end = Math.max(end, s.at * spb + dur)
  }
  endCb = onEnd ?? null
  endTimer = window.setTimeout(() => { endTimer = undefined; live = []; const cb = endCb; endCb = null; cb?.() }, (end + 0.15) * 1000)
}
