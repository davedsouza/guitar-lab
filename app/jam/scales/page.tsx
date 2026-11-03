"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import GuitarTonePicker from "@/components/GuitarTonePicker"
import KeyPicker from "@/components/jam/KeyPicker"
import TabImage from "@/components/jam/TabImage"
import { Fretboard, HarpGrid, Keyboard } from "@/components/jam/ScaleViews"
import { BigButton, Chip, Hint, Panel } from "@/components/jam/ui"
import { useBand } from "@/components/jam/BandContext"
import { GENRES, type GenreId } from "@/lib/jam/genres"
import { KEY_NAMES, POSITIONS, holeMidi } from "@/lib/harmonicaData"
import { playSequence, preloadSound, stopAll } from "@/lib/harmonicaAudio"
import { playScale, stopScale } from "@/lib/jam/scaleAudio"
import {
  BASS_TUNING, GENRE_SCALES, GUITAR_TUNING, HARP_POSITION_NS, SCALES, SCALE_BY_ID,
  flatsFor, harpGrid, harpKeyFor, harpRun, harpTab, isScaleId, nameOf, positions, relativeLine,
  runTab, scaleMidis, scalePcs, wholeNeck, DEGREE, type ScaleId,
} from "@/lib/jam/scales"

type Inst = "guitar" | "bass" | "piano" | "harp"
const INST_LABEL: Record<Inst, string> = { guitar: "Guitar", bass: "Bass", piano: "Piano", harp: "Harmonica" }
const STRING_NAMES: Record<"guitar" | "bass", string[]> = { guitar: ["e", "B", "G", "D", "A", "E"], bass: ["G", "D", "A", "E"] }

function parseKey(v: string | null): number {
  const n = Number(v)
  return v !== null && Number.isInteger(n) && n >= 0 && n <= 11 ? n : 0
}

function ScalesInner() {
  const params = useSearchParams()
  const { band } = useBand()
  const [root, setRoot] = useState(() => parseKey(params.get("key")))
  const [scaleId, setScaleId] = useState<ScaleId>(() => {
    const s = params.get("scale")
    if (isScaleId(s)) return s
    return params.get("mode") === "minor" ? "minPent" : "majPent"
  })
  const [instPick, setInstPick] = useState<Inst>("guitar")
  const [posIdx, setPosIdx] = useState(0)
  const [harpPick, setHarpPick] = useState<string | null>(null)
  const [degrees, setDegrees] = useState(false)
  const [genre, setGenre] = useState<GenreId | null>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => () => { stopScale(); stopAll() }, [])

  const available: Inst[] = ["guitar", ...(band.bass ? ["bass" as const] : []), ...(band.piano ? ["piano" as const] : []), ...(band.harmonica ? ["harp" as const] : [])]
  const inst: Inst = available.includes(instPick) ? instPick : "guitar"

  const scale = SCALE_BY_ID[scaleId]
  const flats = flatsFor(root, scale)
  const pcs = useMemo(() => scalePcs(root, scale), [root, scale])
  const rootName = nameOf(root, flats)
  const scaleTitle = `${rootName} ${scale.name.toLowerCase()}`

  const tuning = inst === "bass" ? BASS_TUNING : GUITAR_TUNING
  const pos = useMemo(() => positions(tuning, root, scale), [tuning, root, scale])
  const idx = Math.min(posIdx, pos.length - 1)
  const neckNotes = useMemo(() => wholeNeck(tuning, root, scale), [tuning, root, scale])

  const harpPosN = harpPick ?? scale.harpPos
  const harpKey = harpKeyFor(root, harpPosN)
  const harpCells = useMemo(() => harpGrid(harpKey, root, scale), [harpKey, root, scale])
  const run = useMemo(() => harpRun(harpKey, root, scale), [harpKey, root, scale])

  function halt() {
    stopScale()
    stopAll()
    setPlaying(false)
  }

  function hear() {
    if (playing) { halt(); return }
    setPlaying(true)
    const done = () => setPlaying(false)
    if (inst === "harp") {
      preloadSound()
      const midis = run.map(c => holeMidi(c.hole, c.draw, c.bend, harpKey))
      const seq = [...midis, ...midis.slice(0, -1).reverse()]
      playSequence(seq.map((m, i) => ({ midis: [m], at: i, len: 1 })), 130, done)
    } else {
      playScale(scaleMidis(root, scale, inst), inst, done)
    }
  }

  function pickRoot(k: number) { halt(); setRoot(k) }
  function pickScale(id: ScaleId) { halt(); setScaleId(id); setPosIdx(0); setHarpPick(null) }
  function pickInst(i: Inst) { halt(); setInstPick(i); setPosIdx(0) }

  const noteList = scale.steps.map(s => ({ name: nameOf(root + s, flats), degree: DEGREE[s] }))
  const noteWords = noteList.map(n => n.name).join(", ")
  const cur = pos[idx]
  const whole = posIdx === -1
  const shown = whole ? neckNotes : cur?.notes ?? []
  const lo = whole ? 0 : cur?.lo ?? 0
  const hi = whole ? 12 : cur?.hi ?? 4
  const stringInst: "guitar" | "bass" = inst === "bass" ? "bass" : "guitar"
  const posText = whole ? "whole neck, frets 0 to 12" : `${cur?.label ?? ""}, frets ${lo} to ${hi}`

  const harpPosition = POSITIONS.find(p => p.n === harpPosN) ?? POSITIONS[1]
  const harpTabSpec = { ...harpTab(run), caption: `${scaleTitle} on a ${KEY_NAMES[harpKey]} harp` }
  const stringTabSpec = cur ? { ...runTab(stringInst, cur.notes), caption: `${scaleTitle}, ${cur.label}, going up` } : null

  const recommended = genre ? GENRE_SCALES[genre] : null

  return (
    <div className="space-y-4">
      <Panel title="Key and scale">
        <KeyPicker value={{ root, minor: false }} onChange={k => pickRoot(k.root)} allowMinor={false} label="Root note" />
        <p className="mb-2 mt-4 text-xs font-bold uppercase tracking-wider text-purple-300">Scale</p>
        <div className="flex flex-wrap gap-1.5">
          {SCALES.map(s => (
            <Chip key={s.id} active={s.id === scaleId} onClick={() => pickScale(s.id)} className="px-3 text-sm">{s.name}</Chip>
          ))}
        </div>
      </Panel>

      <Panel>
        <p className="text-3xl font-black leading-tight text-amber-300">{scaleTitle}</p>
        <div className="mt-3 flex flex-wrap gap-2" aria-label={`Notes: ${noteWords}`}>
          {noteList.map((n, i) => (
            <div key={i} className={`flex min-w-11 flex-col items-center rounded-xl px-2 py-1.5 ${i === 0 ? "bg-amber-400 text-slate-950" : "bg-white/10 text-white"}`}>
              <span className="text-lg font-black leading-tight">{n.name}</span>
              <span className={`text-xs font-semibold ${i === 0 ? "text-slate-800" : "text-purple-200"}`}>{n.degree}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm leading-relaxed text-purple-100">{scale.feel}</p>
        <p className="mt-1 text-sm text-purple-300">{relativeLine(root, scale)}</p>
      </Panel>

      <Panel title="Play it">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Instrument">
          {available.map(i => (
            <Chip key={i} active={i === inst} onClick={() => pickInst(i)} className="px-4">{INST_LABEL[i]}</Chip>
          ))}
        </div>
        {available.length < 4 && (
          <p className="mt-2 text-xs text-purple-300">
            Want bass, piano or harmonica here? Turn them on under <Link href="/jam" className="font-semibold text-amber-300 underline">Who is playing</Link>.
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <BigButton onClick={hear} tone={playing ? "ghost" : "primary"} className="min-h-12 text-base">
            {playing ? "Stop" : "Hear it"}
          </BigButton>
          <div className="flex gap-1.5" role="group" aria-label="Label dots with">
            <Chip active={!degrees} onClick={() => setDegrees(false)} className="min-h-12 text-sm">Notes</Chip>
            <Chip active={degrees} onClick={() => setDegrees(true)} className="min-h-12 text-sm">Degrees</Chip>
          </div>
        </div>
        {inst === "guitar" && <GuitarTonePicker className="mt-3" />}

        <div className="mt-4">
          {(inst === "guitar" || inst === "bass") && (
            <>
              <div className="mb-3 flex flex-wrap gap-1.5" role="group" aria-label="Position on the neck">
                {pos.map((p, i) => (
                  <Chip key={p.label} active={!whole && i === idx} onClick={() => { halt(); setPosIdx(i) }} className="px-3 text-sm">{p.label}</Chip>
                ))}
                <Chip active={whole} onClick={() => { halt(); setPosIdx(-1) }} className="px-3 text-sm">Whole neck</Chip>
              </div>
              <Fretboard
                names={STRING_NAMES[stringInst]}
                notes={shown}
                lo={lo}
                hi={hi}
                root={root}
                flats={flats}
                degrees={degrees}
                summary={`${scaleTitle} on ${INST_LABEL[inst].toLowerCase()}, ${posText}. Notes: ${noteWords}.`}
              />
              <p className="mt-2 text-xs text-purple-300">
                {whole ? "Every note of the scale up to the 12th fret. " : `${cur?.label}: frets ${lo} to ${hi}. `}
                Amber dots are the root ({rootName}). Start and end your lines on those.
              </p>
            </>
          )}

          {inst === "piano" && (
            <>
              <Keyboard
                pcs={pcs}
                root={root}
                flats={flats}
                degrees={degrees}
                summary={`${scaleTitle} on piano, two octaves. Notes: ${noteWords}.`}
              />
              <p className="mt-2 text-xs text-purple-300">
                Two octaves, starting at C. Amber keys are the root ({rootName}). Play the colored keys and skip the rest.
              </p>
            </>
          )}

          {inst === "harp" && (
            <>
              <p className="mb-2 text-lg font-bold text-amber-300">Use a {KEY_NAMES[harpKey]} harmonica</p>
              <div className="mb-3 flex flex-wrap gap-1.5" role="group" aria-label="Harmonica position">
                {HARP_POSITION_NS.map(n => {
                  const p = POSITIONS.find(x => x.n === n)!
                  return (
                    <Chip key={n} active={n === harpPosN} onClick={() => { halt(); setHarpPick(n) }} className="px-3 text-sm">
                      {n} · {KEY_NAMES[harpKeyFor(root, n)]} harp
                      <span className="sr-only">, {p.name}</span>
                    </Chip>
                  )
                })}
              </div>
              <HarpGrid
                cells={harpCells}
                root={root}
                flats={flats}
                degrees={degrees}
                summary={`${scaleTitle} on a ${KEY_NAMES[harpKey]} harmonica in ${harpPosition.n} position. Notes: ${noteWords}.`}
              />
              <p className="mt-2 text-xs leading-relaxed text-purple-300">
                Colored dots are in the scale, amber is the root. Dashed rings are bent notes (bend the hole&apos;s pitch down). Faint outlines are not in this scale.
                {harpPosN === scale.harpPos ? ` ${harpPosition.n} position is the usual choice for this scale.` : ""}
              </p>
              <p className="mt-2 text-sm text-purple-200">
                {harpPosition.n} position ({harpPosition.name.toLowerCase()}): {harpPosition.feel}{" "}
                <Link href={`/harmonica?key=${root}&mode=${["minor", "minPent", "blues", "dorian"].includes(scale.id) ? "minor" : "major"}`} className="font-semibold text-amber-300 underline">Learn it on harmonica</Link>
              </p>
            </>
          )}
        </div>
      </Panel>

      {(inst === "guitar" || inst === "bass") && stringTabSpec && !whole && (
        <Panel title="The same notes as tab">
          <TabImage spec={stringTabSpec} />
          <p className="mt-2 text-xs text-purple-300">Low string first, then up the neck. Play it up, then back down.</p>
        </Panel>
      )}
      {inst === "harp" && run.length > 1 && (
        <Panel title="The same notes as tab">
          <TabImage spec={harpTabSpec} />
          <p className="mt-2 text-xs text-purple-300">One octave, root to root. Play it up, then back down. A &apos; after a number is a bend.</p>
        </Panel>
      )}

      <Panel title="Which scale fits my style?">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Genre">
          {GENRES.map(g => (
            <Chip key={g.id} active={genre === g.id} onClick={() => setGenre(genre === g.id ? null : g.id)} className="px-3 text-sm">{g.label}</Chip>
          ))}
        </div>
        {recommended ? (
          <ul className="mt-3 space-y-2">
            {recommended.map(r => {
              const def = SCALE_BY_ID[r.id]
              return (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => pickScale(r.id)}
                    aria-pressed={r.id === scaleId}
                    className={`flex min-h-12 w-full flex-col items-start rounded-xl border px-4 py-3 text-left active:scale-[0.99] ${
                      r.id === scaleId ? "border-amber-400 bg-amber-400/15" : "border-white/15 bg-slate-950/60 active:bg-white/10"
                    }`}
                  >
                    <span className="text-base font-bold text-white">{rootName} {def.name.toLowerCase()}</span>
                    <span className="text-sm text-purple-200">{r.why}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="mt-3"><Hint>Pick a style and we will suggest which scales to try in this key.</Hint></div>
        )}
      </Panel>

      <Panel title="How to use a scale">
        <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-purple-100">
          <li>Play the scale in the key of the song. A song in {rootName} uses a {rootName} scale, whatever the chord of the moment is.</li>
          <li>Land on the root (amber) at the end of a phrase. It always sounds finished.</li>
          <li>Five-note scales are the easiest way to sound good fast. Add the others once those feel natural.</li>
          <li>Leave space. Two notes and a pause beat a fast run.</li>
        </ul>
      </Panel>
    </div>
  )
}

export default function ScalesPage() {
  return (
    <Suspense fallback={null}>
      <ScalesInner />
    </Suspense>
  )
}
