import { fingersToMidi, getGuitarKind, playGuitarNote, preloadGuitar, stopGuitar } from "./guitarAudio"
import { chordInfo, voicingFor } from "./tabs"

export type PlaybackStyle = "hold" | "strum" | "arp"

export const PLAYBACK_STYLES: { id: PlaybackStyle; label: string }[] = [
  { id: "hold", label: "Hold" },
  { id: "strum", label: "Strum" },
  { id: "arp", label: "Arpeggio" },
]

const BEATS_PER_BAR = 4
const LEAD_MS = 180

export function chordMidis(sym: string): number[] {
  if (!chordInfo(sym)) return []
  const fingers = [...voicingFor(sym)].reverse().map(f => (f === null ? "x" : f))
  return fingersToMidi(fingers)
}

// Down and up strokes in eighth notes across one bar: D . D U . U D U
const STRUM_STEPS: { at: number; down: boolean; vol: number }[] = [
  { at: 0, down: true, vol: 1 },
  { at: 2, down: true, vol: 0.8 },
  { at: 3, down: false, vol: 0.6 },
  { at: 5, down: false, vol: 0.6 },
  { at: 6, down: true, vol: 0.85 },
  { at: 7, down: false, vol: 0.6 },
]

let timers: number[] = []
let running = false
let endCb: (() => void) | undefined

export function isProgressionPlaying() {
  return running
}

export function stopProgression() {
  timers.forEach(t => window.clearTimeout(t))
  timers = []
  if (running) {
    running = false
    stopGuitar()
    const cb = endCb
    endCb = undefined
    cb?.()
  }
}

function scheduleBar(midis: number[], style: PlaybackStyle, beat: number, delay: number) {
  const kind = getGuitarKind()
  const eighth = beat / 2
  if (midis.length === 0) return
  if (style === "hold") {
    midis.forEach((m, i) => playGuitarNote(m, kind, { delay: delay + i * 0.035, ring: beat * BEATS_PER_BAR + 0.4 }))
    return
  }
  if (style === "strum") {
    STRUM_STEPS.forEach(s => {
      const order = s.down ? midis : [...midis].reverse().slice(0, 4)
      const gap = s.down ? 0.03 : 0.02
      order.forEach((m, i) => playGuitarNote(m, kind, { delay: delay + s.at * eighth + i * gap, ring: beat * 1.4, volume: s.vol }))
    })
    return
  }
  const up = midis.slice(0, Math.min(midis.length, 4))
  const run = [...up, ...(up.length > 2 ? up.slice(1, -1).reverse() : [])]
  for (let k = 0; k < 8; k++) {
    playGuitarNote(run[k % run.length], kind, { delay: delay + k * eighth, ring: beat * 2.2, volume: k % 4 === 0 ? 1 : 0.8 })
  }
}

export interface PlayOptions {
  bpm: number
  style: PlaybackStyle
  loop: boolean
  onStep?: (index: number) => void
  onEnd?: () => void
}

// Call from a tap so the audio context can start. Plays one bar per chord.
export function playProgression(chords: string[], opts: PlayOptions) {
  stopProgression()
  const valid = chords.map((c, k) => ({ c, k })).filter(x => chordInfo(x.c))
  const list = valid.map(x => x.c)
  if (list.length === 0) { opts.onEnd?.(); return }
  preloadGuitar(getGuitarKind())
  running = true
  endCb = opts.onEnd
  const beat = 60 / Math.max(30, Math.min(240, opts.bpm))
  const barMs = beat * BEATS_PER_BAR * 1000
  const startAt = performance.now() + 120
  const total = list.length

  const step = (n: number) => {
    if (!running) return
    const i = n % total
    const barStart = startAt + n * barMs
    const delay = Math.max(0, (barStart - performance.now()) / 1000)
    scheduleBar(chordMidis(list[i]), opts.style, beat, delay)
    const ui = window.setTimeout(() => { if (running) opts.onStep?.(valid[i].k) }, Math.max(0, barStart - performance.now()))
    timers.push(ui)
    const last = n === total - 1 && !opts.loop
    if (last) {
      timers.push(window.setTimeout(() => {
        running = false
        timers = []
        endCb = undefined
        opts.onEnd?.()
      }, barStart + barMs - performance.now() + 150))
      return
    }
    timers.push(window.setTimeout(() => step(n + 1), Math.max(0, barStart + barMs - performance.now() - LEAD_MS)))
  }
  step(0)
}
