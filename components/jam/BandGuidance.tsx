"use client"

import Link from "next/link"
import { useState } from "react"
import { getGuidance, bandSummary, type GuidanceGenre } from "@/lib/jam/band"
import { GENRES, getGenre } from "@/lib/jam/genres"
import { keyLabel, type KeyRef } from "@/lib/jam/theory"
import { chordInfo, getProgression, tabLegend, voicingFor, type TabSpec } from "@/lib/jam/tabs"
import { ChordTap } from "./ChordSheet"
import ChordLab, { applySwaps, type Swaps } from "./ChordLab"
import PlayBar from "./PlayBar"
import { TabText } from "./ChordView"
import TabImage from "./TabImage"
import { useBand } from "./BandContext"
import { Chip } from "./ui"

function TabView({ spec }: { spec: TabSpec }) {
  const legend = tabLegend(spec)
  return (
    <div className="mt-3 space-y-2">
      <p className="text-sm font-semibold text-amber-200">
        {spec.capo ? <span className="mr-2 rounded-md bg-amber-400 px-1.5 py-0.5 text-xs font-bold text-slate-900">Capo {spec.capo}</span> : null}
        {spec.caption}
      </p>
      <TabImage spec={spec} />
      {legend && <p className="text-xs text-white/60">{legend}</p>}
      {spec.notes && (
        <ul className="space-y-1 text-sm text-white/85">
          {spec.notes.map((n, i) => <li key={i}>{n}</li>)}
        </ul>
      )}
    </div>
  )
}

function bpmFor(genre: GuidanceGenre): number {
  const g = genre === "general" ? undefined : getGenre(genre)
  const b = g?.progressions[0]?.bpm
  return b ? Math.round((b[0] + b[1]) / 2) : 90
}

function ChordShapes({ chords }: { chords: string[] }) {
  const uniq = Array.from(new Set(chords)).filter(c => chordInfo(c))
  return (
    <div className="mt-3 grid grid-cols-2 gap-2 min-[480px]:grid-cols-3">
      {uniq.map(c => {
        const fingers = [...voicingFor(c)].reverse().map(f => (f === null ? "x" : f))
        return (
          <div key={c} className="rounded-xl bg-white/[0.06] p-2">
            <ChordTap chord={c} className="mb-1 min-h-10 w-full text-center text-base font-bold text-white" />
            <TabText fingers={fingers} className="!text-base" />
          </div>
        )
      })}
    </div>
  )
}

export default function BandGuidance({
  genre, onGenreChange, defaultOpen = false, title = "What everyone plays", progressions, keyRef,
}: {
  progressions?: { label: string; chords: string[]; key?: KeyRef }[]
  keyRef?: KeyRef
  genre: GuidanceGenre
  onGenreChange?: (g: GuidanceGenre) => void
  defaultOpen?: boolean
  title?: string
}) {
  const { band } = useBand()
  const [open, setOpen] = useState(defaultOpen)
  const [tabsOpen, setTabsOpen] = useState<Record<string, boolean>>({})
  const [tipsOpen, setTipsOpen] = useState<Record<string, boolean>>({})
  const [picked, setPicked] = useState(0)
  const [shapesOpen, setShapesOpen] = useState(false)
  const [tryOpen, setTryOpen] = useState(false)
  const [swaps, setSwaps] = useState<Swaps>({})
  const [now, setNow] = useState<number | null>(null)
  const custom = progressions && progressions.length > 0 ? progressions : null
  const sel = custom ? custom[Math.min(picked, custom.length - 1)] : null
  const defaults = getProgression(genre)
  const written = sel ? sel.chords : defaults.chords
  const chords = applySwaps(written, swaps)
  const selKey = sel ? (sel.key ?? keyRef) : defaults.keyRef
  const keyText = sel ? (selKey ? keyLabel(selKey) : null) : defaults.key
  const { roles, extras } = getGuidance(band, genre, { chords, key: selKey })
  const label = genre === "general" ? "any style" : GENRES.find(g => g.id === genre)?.label.toLowerCase()

  return (
    <div className="rounded-2xl border border-amber-400/40 bg-amber-400/10">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        className="flex min-h-14 w-full items-center justify-between gap-3 px-4 text-left"
      >
        <span>
          <span className="block text-base font-bold text-amber-300">{title}</span>
          <span className="block text-sm text-white/70">{bandSummary(band)} · {label}</span>
        </span>
        <span className={`text-2xl text-amber-300 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden>⌄</span>
      </button>
      {open && (
        <div className="space-y-3 border-t border-amber-400/25 px-4 py-4">
          {onGenreChange && (
            <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
              <Chip active={genre === "general"} onClick={() => onGenreChange("general")} className="shrink-0 text-sm">General</Chip>
              {GENRES.map(g => (
                <Chip key={g.id} active={genre === g.id} onClick={() => onGenreChange(g.id)} className="shrink-0 text-sm">{g.label}</Chip>
              ))}
            </div>
          )}
          <div className="rounded-xl border border-white/15 bg-slate-950/60 p-3">
            <p className="text-xs font-bold uppercase tracking-wide text-amber-300">Everyone plays this, one bar each</p>
            {custom && custom.length > 1 && (
              <div className="-mx-1 mt-2 flex gap-1.5 overflow-x-auto px-1 pb-1" role="group" aria-label="Which part of the song">
                {custom.map((p, i) => (
                  <Chip key={i} active={sel === p} onClick={() => setPicked(i)} className="min-h-10 shrink-0 text-sm">{p.label}</Chip>
                ))}
              </div>
            )}
            <p className="mt-1 text-sm text-white/70">
              {keyText ? `Key of ${keyText}` : "Chords from your chart"}
              {!sel ? ` · ${defaults.roman}` : sel.label !== "Chords" && custom && custom.length === 1 ? ` · ${sel.label}` : ""}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {chords.map((c, i) => (
                <ChordTap
                  key={i}
                  chord={c}
                  className={`min-h-12 min-w-12 rounded-lg px-2 py-1.5 text-center text-base font-bold ${
                    now === i ? "bg-amber-400 text-slate-950" : c !== written[i] ? "border border-amber-400 bg-amber-400/20 text-amber-200" : "bg-white/10 text-white"
                  }`}
                />
              ))}
            </div>
            <PlayBar className="mt-3" chords={chords} original={written} defaultBpm={bpmFor(genre)} onStep={setNow} />
            <button
              type="button"
              aria-expanded={tryOpen}
              onClick={() => setTryOpen(o => !o)}
              className="mt-3 min-h-12 w-full rounded-xl border border-purple-300/50 bg-purple-400/15 px-3 text-base font-bold text-purple-100 active:bg-purple-400/30"
            >
              {tryOpen ? "Close the chord lab" : Object.keys(swaps).length ? "Chord lab (testing)" : "Open the chord lab"}
            </button>
            {tryOpen && <ChordLab written={written} swaps={swaps} setSwaps={u => setSwaps(u)} genre={genre} keyRef={selKey} />}
            <button
              type="button"
              aria-expanded={shapesOpen}
              onClick={() => setShapesOpen(o => !o)}
              className="mt-3 min-h-12 w-full rounded-xl border border-white/20 bg-white/10 px-3 text-base font-bold text-white active:bg-white/20"
            >
              {shapesOpen ? "Hide chord shapes" : "Show chord shapes"}
            </button>
            {shapesOpen && <ChordShapes chords={chords} />}
            <p className="mt-2 text-xs text-white/60">
              {sel
                ? "Repeat it. Every tab below follows these chords in order, in the key shown. Change the key on the chart and the tabs change with it."
                : "Repeat it. Every tab below follows these bars in order. Pick a chart or a progression to get tabs for your own chords."}
            </p>
          </div>
          <ul className="space-y-3">
            {roles.map(r => (
              <li key={r.who} className="rounded-xl bg-slate-950/60 p-3">
                <p className="text-sm font-bold text-white">
                  {r.who} <span className="font-semibold text-amber-300">· {r.role}</span>
                </p>
                {(() => {
                  const cut = r.tip.search(/[.!?]\s/)
                  const first = cut > 0 ? r.tip.slice(0, cut + 1) : r.tip
                  const rest = cut > 0 ? r.tip.slice(cut + 2) : ""
                  const more = !!tipsOpen[r.who]
                  return (
                    <>
                      <p className="mt-1 text-sm leading-relaxed text-white/90">{first}{more && rest ? ` ${rest}` : ""}</p>
                      {rest && (
                        <button
                          type="button"
                          aria-expanded={more}
                          onClick={() => setTipsOpen(t => ({ ...t, [r.who]: !t[r.who] }))}
                          className="mt-1 min-h-10 text-sm font-bold text-amber-300 underline"
                        >
                          {more ? "Less" : "More detail"}
                        </button>
                      )}
                    </>
                  )
                })()}
                {r.tab?.kind === "harp" && (
                  <Link
                    href={selKey ? `/harmonica?key=${selKey.root}&mode=${selKey.minor ? "minor" : "major"}` : "/harmonica"}
                    className="mt-2 inline-flex min-h-12 items-center rounded-xl border border-amber-400/50 bg-amber-400/10 px-3 text-sm font-bold text-amber-300 active:bg-amber-400/25"
                  >
                    Learn this on harmonica →
                  </Link>
                )}
                {r.tab && (
                  <>
                    <button
                      type="button"
                      aria-expanded={!!tabsOpen[r.who]}
                      onClick={() => setTabsOpen(t => ({ ...t, [r.who]: !t[r.who] }))}
                      className="mt-2 min-h-12 w-full rounded-xl border border-white/20 bg-white/10 px-3 text-base font-bold text-white active:bg-white/20"
                    >
                      {tabsOpen[r.who] ? "Hide tab" : r.tab.kind === "piano" ? "Show hands chart" : "Show tab"}
                    </button>
                    {tabsOpen[r.who] && <TabView spec={r.tab} />}
                  </>
                )}
              </li>
            ))}
          </ul>
          {extras.length > 0 && (
            <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-purple-200">
              {extras.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          )}
          <p className="text-xs text-white/50">Change who is playing from the band button at the top of the screen.</p>
        </div>
      )}
    </div>
  )
}
