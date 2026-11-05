"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import BandGuidance from "@/components/jam/BandGuidance"
import { ChordTap } from "@/components/jam/ChordSheet"
import ChordLab, { applySwaps, type Swaps } from "@/components/jam/ChordLab"
import PlayBar from "@/components/jam/PlayBar"
import KeyPicker from "@/components/jam/KeyPicker"
import PartPlanner from "@/components/jam/PartPlanner"
import { BigButton, Chip, Hint, NextSteps, Panel, inputClass } from "@/components/jam/ui"
import { GROUPS, keyCandidates, keyChordList, loopBack, romanLine, suggestNext, type Suggestion } from "@/lib/jam/next"
import { chordsToChartBody } from "@/lib/jam/charts"
import { getGenre } from "@/lib/jam/genres"
import { makeChart, prependChart, useLocalState, useRememberedKey } from "@/lib/jam/storage"
import { BUILDER_KEY, EMPTY, MAX, parseSaved, type Saved } from "@/lib/jam/next"
import { PLAN_EMPTY, PLAN_KEY, STYLES, getStyle, parsePlan, readChordInput as readChords, type PlanState } from "@/lib/jam/plan"
import { capoOptions, keyLabel, noteName, prefersFlats, type KeyRef } from "@/lib/jam/theory"

const START = ["G", "C", "D", "Em", "Am", "A", "E", "F"]

const same = (a: KeyRef | null, b: KeyRef) => a !== null && a.root === b.root && a.minor === b.minor

function SuggestionRow({ s, onAdd }: { s: Suggestion; onAdd: () => void }) {
  return (
    <li className="flex items-stretch gap-2">
      <button
        type="button"
        onClick={onAdd}
        className="flex min-h-16 w-20 shrink-0 select-none flex-col items-center justify-center rounded-xl bg-amber-400 text-slate-950 active:scale-95 active:bg-amber-300"
      >
        <span className="text-xl font-extrabold leading-tight"><span className="sr-only">Add </span>{s.chord}</span>
        <span aria-hidden className="text-xs font-bold leading-tight opacity-70">{s.roman}</span>
      </button>
      <div className="min-w-0 flex-1 py-0.5">
        <p className="text-sm leading-snug text-white/90">{s.why}</p>
        <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
          {s.open !== null && (
            <span className={`rounded px-1.5 py-0.5 font-bold ${s.open ? "bg-emerald-400/20 text-emerald-200" : "bg-white/10 text-white/75"}`}>
              {s.open ? "Open shape" : "Barre chord"}
            </span>
          )}
          {s.songs.length > 0 && <span className="text-purple-200">Heard in {s.songs.join(", ")}</span>}
        </p>
      </div>
      <ChordTap chord={s.chord} className="min-h-16 w-12 shrink-0 rounded-xl border border-white/20 bg-white/10 text-lg font-bold text-white">
        <span aria-hidden>?</span>
      </ChordTap>
    </li>
  )
}

export default function BuilderPage() {
  const router = useRouter()
  const [saved, setSaved] = useLocalState<Saved>(BUILDER_KEY, EMPTY, parseSaved)
  const [plan, setPlan] = useLocalState<PlanState>(PLAN_KEY, PLAN_EMPTY, parsePlan)
  const [sevenths, setSevenths] = useState(false)
  const [input, setInput] = useState("")
  const [error, setError] = useState("")
  const [note, setNote] = useState("")
  const [lastKey, setLastKey] = useRememberedKey({ root: 7, minor: false })
  const [swaps, setSwaps] = useState<Swaps>({})
  const [now, setNow] = useState<number | null>(null)

  const { chords } = saved
  const style = getStyle(plan.style)
  const candidates = chords.length ? keyCandidates(chords) : []
  const key: KeyRef | null = saved.key ?? candidates[0] ?? null
  const flats = key ? prefersFlats(key) : false
  const romans = key ? romanLine(chords, key) : []
  const suggestions = key ? suggestNext(chords, key, sevenths) : []
  const loop = key ? loopBack(chords) : null
  const inKey = key ? keyChordList(key, sevenths) : []
  const played = applySwaps(chords, swaps)
  const genreBpm = getGenre(style.genre)?.progressions[0]?.bpm
  const defaultBpm = genreBpm ? Math.round((genreBpm[0] + genreBpm[1]) / 2) : 90

  function setChords(next: string[], msg: string) {
    setSaved(s => ({ ...s, chords: next.slice(0, MAX) }))
    setNote(msg)
  }

  function add(chord: string) {
    if (chords.length >= MAX) {
      setNote(`That is the limit of ${MAX} chords.`)
      return
    }
    setChords([...chords, chord], `Added ${chord}.`)
  }

  function submit() {
    const { ok, bad } = readChords(input)
    if (bad.length) {
      setError(`Could not read: ${bad.join(" ")}. Try chords like Am, F#m, D7 or Cmaj7.`)
      return
    }
    setError("")
    if (ok.length === 0) return
    setChords([...chords, ...ok], `Added ${ok.join(" ")}.`)
    setInput("")
  }

  function toChart() {
    if (!key) return
    const chart = makeChart({ title: "My progression", key: keyLabel(key), genre: style.genre, body: chordsToChartBody(played) })
    prependChart(chart)
    router.push(`/jam/chart?id=${chart.id}`)
  }

  const capoList = chords.length >= 2 ? capoOptions(chords) : []
  const capo0 = capoList.find(o => o.capo === 0)
  const bestCapo = capoList[0]
  const capoHint =
    bestCapo && capo0 && bestCapo.capo > 0 && bestCapo.easyCount > capo0.easyCount
      ? `Capo ${bestCapo.capo} turns these into ${bestCapo.shapes.join(" ")}, which are easier shapes.`
      : null

  function loadIdea(next: string[], k: KeyRef) {
    setSaved({ chords: next.slice(0, MAX), key: k })
    setPlan(p => ({ ...p, mode: "steps" }))
    setNote(`Loaded ${next.length} chords into the builder.`)
    setError("")
  }

  const styleBlock = (
    <Panel title="Style">
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Style of music">
        {STYLES.map(st => (
          <Chip key={st.id} active={plan.style === st.id} onClick={() => setPlan(p => ({ ...p, style: st.id }))} className="text-sm">
            {st.label}
          </Chip>
        ))}
      </div>
      <p className="mt-3 text-sm text-white/80">{style.blurb}</p>
    </Panel>
  )

  const modeBlock = (
    <div className="grid grid-cols-2 gap-2" role="group" aria-label="How do you want to build?">
      <Chip active={plan.mode === "steps"} onClick={() => setPlan(p => ({ ...p, mode: "steps" }))}>Step by step</Chip>
      <Chip active={plan.mode === "plan"} onClick={() => setPlan(p => ({ ...p, mode: "plan" }))}>Plan a part</Chip>
    </div>
  )

  if (plan.mode === "plan") {
    return (
      <div className="space-y-4">
        {modeBlock}
        {styleBlock}
        <PartPlanner plan={plan} setPlan={setPlan} onUse={loadIdea} />
        <p className="sr-only" role="status" aria-live="polite">{note}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {modeBlock}
      <Hint>Add a few chords. We guess the key and suggest what to play next, with the reason for each.</Hint>
      {styleBlock}

      <Panel title="Your progression">
        {chords.length === 0 ? (
          <p className="text-base text-white/70">No chords yet. Tap one below to start.</p>
        ) : (
          <ul className="flex flex-wrap gap-2" aria-label="Chords so far">
            {chords.map((c, i) => (
              <li key={i} className="flex items-stretch overflow-hidden rounded-xl border border-white/20 bg-white/10">
                <div className="flex min-w-14 flex-col items-center justify-center px-1">
                  <ChordTap chord={c} className="min-h-10 rounded-none px-2 text-xl font-extrabold text-amber-300" />
                  <span aria-hidden className="-mt-1 min-h-4 text-xs font-semibold text-white/70">{romans[i] ?? ""}</span>
                </div>
                <button
                  type="button"
                  aria-label={`Remove ${c}, number ${i + 1}`}
                  onClick={() => setChords(chords.filter((_, j) => j !== i), `Removed ${c}.`)}
                  className="min-h-14 w-11 border-l border-white/15 text-lg text-white/70 active:bg-white/20"
                >
                  <span aria-hidden>×</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-3 flex gap-2">
          <div className="min-w-0 flex-1">
            <label htmlFor="bld-in" className="sr-only">Type chords</label>
            <input
              id="bld-in"
              className={`${inputClass} font-mono`}
              value={input}
              onChange={e => { setInput(e.target.value); setError("") }}
              onKeyDown={e => { if (e.key === "Enter") submit() }}
              placeholder="Type chords: Am F C G"
              autoCapitalize="characters"
              autoCorrect="off"
              spellCheck={false}
              aria-describedby={error ? "bld-err" : undefined}
              aria-invalid={error ? true : undefined}
            />
          </div>
          <Chip onClick={submit} className="shrink-0">Add</Chip>
        </div>
        {error && <p id="bld-err" className="mt-2 text-sm font-semibold text-red-300">{error}</p>}

        {chords.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            <Chip onClick={() => setChords(chords.slice(0, -1), `Removed ${chords[chords.length - 1]}.`)}>Undo</Chip>
            <Chip onClick={() => { setSaved(EMPTY); setNote("Cleared."); setError("") }}>Start over</Chip>
          </div>
        )}
        <p className="sr-only" role="status" aria-live="polite">{note}</p>
      </Panel>

      {chords.length === 0 && (
        <Panel title="Start with a chord">
          <div className="flex flex-wrap gap-1.5">
            {START.map(c => <Chip key={c} className="min-w-14" onClick={() => add(c)}>{c}</Chip>)}
          </div>
          <p className="mt-4 text-sm text-purple-200">Or choose a key and we will suggest where to begin.</p>
          <div className="mt-3">
            <KeyPicker value={saved.key ?? lastKey} onChange={k => { setLastKey(k); setSaved(s => ({ ...s, key: k })) }} label="Key" />
          </div>
        </Panel>
      )}

      {key && (
        <Panel title="Key">
          <p className="text-lg font-bold text-white">
            {noteName(key.root, flats)} {key.minor ? "minor" : "major"}
            <span className="ml-2 text-sm font-semibold text-purple-200">
              {saved.key ? "chosen by you" : chords.length ? "best guess" : ""}
            </span>
          </p>
          {candidates.length > 1 && (
            <div className="mt-3">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-purple-300">Your chords also fit</p>
              <div className="flex flex-wrap gap-1.5">
                {candidates.map(k => (
                  <Chip key={`${k.root}${k.minor}`} active={same(key, k)} onClick={() => setSaved(s => ({ ...s, key: k }))}>
                    {keyLabel(k)}
                  </Chip>
                ))}
              </div>
            </div>
          )}
          {chords.length > 0 && (
            <details className="mt-3">
              <summary className="min-h-12 cursor-pointer py-3 text-sm font-bold text-amber-300">Set the key yourself</summary>
              <KeyPicker value={key} onChange={k => setSaved(s => ({ ...s, key: k }))} label="Key" />
              {saved.key && <Chip className="mt-3" onClick={() => setSaved(s => ({ ...s, key: null }))}>Go back to the guess</Chip>}
            </details>
          )}
        </Panel>
      )}

      {key && (
        <Panel title={chords.length ? `After ${chords[chords.length - 1]}, try` : "Good first chords"}>
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm text-white/70">Tap a chord to add it. Tap ? to see how to play it.</p>
            <Chip active={sevenths} onClick={() => setSevenths(v => !v)} className="shrink-0 text-sm">7ths</Chip>
          </div>
          {loop && (
            <div className="mb-4">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-300">Close the loop</p>
              <ul className="mt-2">
                <SuggestionRow
                  s={{ chord: loop, roman: romans[0] ?? "", group: "safe", why: "Back to where you started, so it repeats smoothly.", open: null, songs: [] }}
                  onAdd={() => add(loop)}
                />
              </ul>
            </div>
          )}
          {GROUPS.map(g => {
            const items = suggestions.filter(s => s.group === g.id)
            if (items.length === 0) return null
            return (
              <div key={g.id} className="mb-4 last:mb-0">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300">{g.label}</h3>
                <p className="mb-2 text-xs text-white/60">{g.blurb}</p>
                <ul className="space-y-2.5">
                  {items.map(s => <SuggestionRow key={s.chord} s={s} onAdd={() => add(s.chord)} />)}
                </ul>
              </div>
            )
          })}
        </Panel>
      )}

      {key && inKey.length > 0 && (
        <Panel title={`Any chord in ${keyLabel(key)}`}>
          <div className="flex flex-wrap gap-1.5">
            {inKey.map(c => (
              <Chip key={c.chord} onClick={() => add(c.chord)} className="min-w-16">
                <span className="sr-only">Add </span>{c.chord} <span aria-hidden className="text-xs font-semibold opacity-70">{c.roman}</span>
              </Chip>
            ))}
          </div>
        </Panel>
      )}

      {chords.length >= 2 && key && (
        <>
          {capoHint && <p className="rounded-xl border border-amber-400/40 bg-amber-400/10 p-3 text-sm text-amber-100">{capoHint}</p>}
          <Panel title="Play it and try changes">
            <div className="flex flex-wrap gap-2" aria-label="Your chords, playing now">
              {played.map((c, i) => (
                <ChordTap
                  key={i}
                  chord={c}
                  className={`min-h-11 rounded-xl border px-3 text-lg font-extrabold ${
                    now === i ? "border-amber-400 bg-amber-400 text-slate-950" : c !== chords[i] ? "border-amber-400/70 text-amber-300" : "border-white/20 bg-white/10 text-white"
                  }`}
                />
              ))}
            </div>
            <PlayBar className="mt-3" chords={played} original={chords} defaultBpm={defaultBpm} onStep={setNow} />
            <ChordLab written={chords} swaps={swaps} setSwaps={u => setSwaps(u)} genre={style.genre} keyRef={key} title="My progression" />
          </Panel>
          <BigButton className="w-full" onClick={toChart}>{Object.keys(swaps).length ? "Save my version to Chart" : "Save to Chart"}</BigButton>
          <BandGuidance
            genre={style.genre}
            title="Who plays what over this"
            progressions={[{ label: "Your progression", chords: played, key }]}
          />
        </>
      )}
      <NextSteps items={[{ href: "/jam/progressions", label: "Ideas" }, { href: "/jam/scales", label: "Scales" }, { href: "/jam/circle", label: "Circle of 5ths" }]} />
    </div>
  )
}
