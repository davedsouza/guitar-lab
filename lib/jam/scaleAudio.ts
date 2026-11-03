// Bass and keys synth for hearing a scale; guitar uses the shared guitar sound. Created lazily on a tap.
import { getGuitarKind, playGuitarNote, preloadGuitar, stopGuitar } from "./guitarAudio"

let ctx: AudioContext | null = null
let master: GainNode | null = null
let live: { stop: () => void }[] = []
let endTimer: number | undefined
let endCb: (() => void) | null = null

function ensure(): AudioContext | null {
  if (typeof window === "undefined") return null
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    ctx = new AC()
    const nav = navigator as Navigator & { audioSession?: { type: string } }
    if (nav.audioSession) { try { nav.audioSession.type = "playback" } catch { /* not supported */ } }
    master = ctx.createGain()
    master.gain.value = 0.6
    master.connect(ctx.destination)
  }
  if (ctx.state === "suspended") void ctx.resume()
  return ctx
}

const freq = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12)

export type Timbre = "guitar" | "bass" | "piano"

function voice(c: AudioContext, out: AudioNode, midi: number, when: number, dur: number, timbre: Timbre) {
  const f = freq(midi)
  const env = c.createGain()
  const decay = timbre === "piano" ? 1.3 : timbre === "bass" ? 0.9 : 1.0
  env.gain.setValueAtTime(0.0001, when)
  env.gain.exponentialRampToValueAtTime(0.5, when + 0.006)
  env.gain.exponentialRampToValueAtTime(0.0001, when + Math.max(dur, decay))
  const filter = c.createBiquadFilter()
  filter.type = "lowpass"
  filter.frequency.setValueAtTime(timbre === "bass" ? 900 : 3200, when)
  filter.frequency.exponentialRampToValueAtTime(timbre === "bass" ? 300 : 700, when + 0.5)
  filter.connect(env)
  env.connect(out)
  const types: OscillatorType[] = timbre === "piano" ? ["triangle", "sine"] : timbre === "bass" ? ["sine", "triangle"] : ["sawtooth", "triangle"]
  const mult = timbre === "piano" ? [1, 2] : [1, 1]
  const gains = timbre === "piano" ? [0.7, 0.25] : [0.45, 0.5]
  const oscs = types.map((type, i) => {
    const o = c.createOscillator()
    const g = c.createGain()
    o.type = type
    o.frequency.value = f * mult[i]
    g.gain.value = gains[i]
    o.connect(g)
    g.connect(filter)
    o.start(when)
    o.stop(when + Math.max(dur, decay) + 0.05)
    return o
  })
  return {
    stop: () => {
      try {
        const t = c.currentTime
        env.gain.cancelScheduledValues(t)
        env.gain.setValueAtTime(Math.max(env.gain.value, 0.0001), t)
        env.gain.exponentialRampToValueAtTime(0.0001, t + 0.05)
        oscs.forEach(o => o.stop(t + 0.06))
      } catch { /* already stopped */ }
    },
  }
}

export function stopScale() {
  stopGuitar()
  if (endTimer !== undefined) window.clearTimeout(endTimer)
  endTimer = undefined
  live.forEach(v => v.stop())
  live = []
  const cb = endCb
  endCb = null
  cb?.()
}

// Plays one note at a time, `step` seconds apart. onEnd fires when it finishes or is cut off.
export function playScale(midis: number[], timbre: Timbre, onEnd?: () => void, step = 0.42) {
  if (timbre === "guitar" && midis.length > 0) {
    stopScale()
    const kind = getGuitarKind()
    preloadGuitar(kind)
    midis.forEach((m, i) => playGuitarNote(m, kind, { delay: 0.03 + i * step, ring: step * 1.6 + 0.8 }))
    endCb = onEnd ?? null
    endTimer = window.setTimeout(() => {
      endTimer = undefined
      const cb = endCb
      endCb = null
      cb?.()
    }, (midis.length * step + 1.2) * 1000)
    return
  }
  const c = ensure()
  if (!c || !master || midis.length === 0) { onEnd?.(); return }
  stopScale()
  const t0 = c.currentTime + 0.06
  midis.forEach((m, i) => live.push(voice(c, master!, m, t0 + i * step, step * 1.6, timbre)))
  endCb = onEnd ?? null
  endTimer = window.setTimeout(() => {
    endTimer = undefined
    live = []
    const cb = endCb
    endCb = null
    cb?.()
  }, (midis.length * step + 1.0) * 1000)
}
