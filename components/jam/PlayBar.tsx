"use client"

import { useEffect, useRef, useState } from "react"
import { useLocalState } from "@/lib/jam/storage"
import { PLAYBACK_STYLES, playProgression, stopProgression, type PlaybackStyle } from "@/lib/jam/playback"
import { Chip } from "./ui"

const parseStyle = (raw: unknown): PlaybackStyle | null =>
  raw === "hold" || raw === "strum" || raw === "arp" ? raw : null
const parseBpm = (raw: unknown): number | null =>
  typeof raw === "number" && raw >= 40 && raw <= 200 ? raw : null

export default function PlayBar({
  chords, original, defaultBpm = 90, onStep, className = "",
}: {
  chords: string[]
  original?: string[]
  defaultBpm?: number
  onStep?: (index: number | null) => void
  className?: string
}) {
  const [style, setStyle] = useLocalState<PlaybackStyle>("jam.play.style.v1", "strum", parseStyle)
  const [bpm, setBpm] = useLocalState<number>("jam.play.bpm.v1", defaultBpm, parseBpm)
  const [loop, setLoop] = useState(true)
  const [mode, setMode] = useState<null | "play" | "ab">(null)
  const [now, setNow] = useState<number | null>(null)
  const stepRef = useRef(onStep)
  useEffect(() => { stepRef.current = onStep })
  useEffect(() => () => stopProgression(), [])

  const changed = !!original && original.length === chords.length && original.some((c, i) => c !== chords[i])

  function stop() {
    stopProgression()
  }

  function start(kind: "play" | "ab") {
    setMode(kind)
    setNow(null)
    const list = kind === "ab" && original ? [...original, ...chords] : chords
    const n = chords.length
    playProgression(list, {
      bpm,
      style,
      loop: kind === "play" && loop,
      onStep: i => {
        setNow(i)
        stepRef.current?.(kind === "ab" ? i % n : i)
      },
      onEnd: () => {
        setMode(null)
        setNow(null)
        stepRef.current?.(null)
      },
    })
  }

  const playing = mode !== null
  const abLabel = mode === "ab" && now !== null ? (now < chords.length ? "Hearing the original" : "Hearing your version") : null

  return (
    <div className={`rounded-xl border border-white/15 bg-white/[0.05] p-3 ${className}`}>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => (playing ? stop() : start("play"))}
          aria-pressed={playing && mode === "play"}
          className={`flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl px-3 text-base font-bold active:scale-[0.98] ${
            playing && mode === "play" ? "bg-red-500/80 text-white" : "bg-amber-400 text-slate-950"
          }`}
        >
          <span aria-hidden>{playing && mode === "play" ? "■" : "▶"}</span>
          {playing && mode === "play" ? "Stop" : "Play progression"}
        </button>
        {changed && (
          <button
            type="button"
            onClick={() => (mode === "ab" ? stop() : start("ab"))}
            className={`min-h-12 shrink-0 rounded-xl border px-3 text-sm font-bold active:scale-[0.98] ${
              mode === "ab" ? "border-red-400/60 bg-red-500/20 text-red-100" : "border-purple-300/50 bg-purple-400/15 text-purple-100"
            }`}
          >
            {mode === "ab" ? "Stop" : "Compare"}
          </button>
        )}
      </div>
      {abLabel && <p className="mt-2 text-sm font-semibold text-amber-300" role="status">{abLabel}</p>}
      {changed && mode !== "ab" && <p className="mt-2 text-xs text-white/70">Compare plays your original chords, then your version, once each.</p>}
      <div className="mt-3 flex flex-wrap items-center gap-1.5" role="group" aria-label="How to play it">
        {PLAYBACK_STYLES.map(s => (
          <Chip key={s.id} active={style === s.id} onClick={() => setStyle(s.id)} className="min-h-10 text-sm">{s.label}</Chip>
        ))}
        <Chip active={loop} onClick={() => setLoop(l => !l)} className="min-h-10 text-sm">Loop</Chip>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <label htmlFor="play-bpm" className="text-sm font-semibold text-purple-200">Tempo</label>
        <input
          id="play-bpm"
          type="range"
          min={40}
          max={200}
          value={bpm}
          onChange={e => setBpm(parseInt(e.target.value, 10))}
          className="h-10 min-w-0 flex-1 accent-amber-400"
        />
        <span className="w-16 text-right text-sm font-bold tabular-nums text-white">{bpm} bpm</span>
      </div>
      <p className="mt-1 text-xs text-white/60">One bar per chord. Changes to style and tempo apply the next time you press play.</p>
    </div>
  )
}
