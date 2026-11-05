"use client"

import { useState } from "react"
import KeyPicker from "@/components/jam/KeyPicker"
import PlayBar from "@/components/jam/PlayBar"
import SoloBoard, { ROLE_FILL } from "@/components/jam/SoloBoard"
import { ChordTap } from "@/components/jam/ChordSheet"
import { Chip, Hint, NextSteps, Panel } from "@/components/jam/ui"
import { GENRES, type GenreId } from "@/lib/jam/genres"
import { progressionChords } from "@/lib/jam/charts"
import { parseCharts, useLocalState, useRememberedKey } from "@/lib/jam/storage"
import { GUITAR_TUNING, SCALE_BY_ID, nameOf, wholeNeck } from "@/lib/jam/scales"
import { EXERCISES, WINDOWS, chordToneNotes, cueFor, roleName, spellFlats, stepWords, type Role } from "@/lib/jam/solo"
import { chordInfo } from "@/lib/jam/tabs"
import { extractPhrases, guessKeys, isMinorSuffix, parseChord, prefersFlats, type KeyRef } from "@/lib/jam/theory"

const STRING_WORDS = ["high e", "B", "G", "D", "A", "low E"]
const ROLE_SHOWN: Record<string, Role[]> = {
  roots: ["R"],
  thirds: ["R", "3"],
  wander: ["R", "3", "7"],
  approach: ["R", "3", "7"],
  arpeggio: ["R", "3", "5", "7"],
  contrast: ["R", "3", "5", "7"],
}

function keyFromChartLabel(label: string): KeyRef | null {
  const c = parseChord(label)
  return c ? { root: c.root, minor: isMinorSuffix(c.suffix) } : null
}

export default function SoloOverChanges() {
  const [source, setSource] = useState<"ideas" | "charts">("ideas")
  const [genre, setGenre] = useState<GenreId>("jazz")
  const [progIdx, setProgIdx] = useState(0)
  const [key, setKey] = useRememberedKey({ root: 7, minor: false }, false)
  const [charts] = useLocalState("jam.charts.v1", [], parseCharts)
  const [chartId, setChartId] = useState<string | null>(null)
  const [phraseIdx, setPhraseIdx] = useState(0)
  const [win, setWin] = useState(2)
  const [exIdx, setExIdx] = useState(1)
  const [numbers, setNumbers] = useState(false)
  const [view, setView] = useState(0)
  const [now, setNow] = useState<number | null>(null)

  const info = GENRES.find(g => g.id === genre)!
  const idea = info.progressions[Math.min(progIdx, info.progressions.length - 1)]
  const chart = source === "charts" ? charts.find(c => c.id === chartId) ?? charts[0] : undefined
  const phrases = chart ? extractPhrases(chart.body, 6) : []
  const phrase = phrases[Math.min(phraseIdx, Math.max(0, phrases.length - 1))]

  const chords = (source === "ideas" ? progressionChords(idea, key) : phrase?.chords ?? []).filter(c => chordInfo(c))
  const tonic: KeyRef =
    source === "ideas"
      ? { root: key.root, minor: idea.minor ?? key.minor }
      : (chart && keyFromChartLabel(chart.key)) || guessKeys(chords, 1)[0]?.key || { root: 0, minor: false }
  const flats = spellFlats(chords, prefersFlats(tonic))
  const defaultBpm = source === "ideas" ? Math.round((idea.bpm[0] + idea.bpm[1]) / 2) : 80

  const n = chords.length
  const shown = n === 0 ? 0 : Math.min(now ?? view, n - 1)
  const cur = chords[shown]
  const next = n > 0 ? chords[(shown + 1) % n] : undefined
  const w = WINDOWS[win]
  const ex = EXERCISES[exIdx]
  const roles = ROLE_SHOWN[ex.id]

  const notes = cur ? chordToneNotes(cur, w.lo, w.hi) : []
  const faint = ex.id === "wander" || ex.id === "contrast" ? wholeNeck(GUITAR_TUNING, tonic.root, SCALE_BY_ID[tonic.minor ? "minPent" : "majPent"], 17) : []
  const sameChord = !!cur && cur === next
  const cue = cur && next && !sameChord ? cueFor(cur, next, w.lo, w.hi) : null
  const curInfo = cur ? chordInfo(cur) : null
  const nextInfo = next ? chordInfo(next) : null
  const target = cue && ex.id !== "roots" ? cue.target : null
  const approach = cue && ex.id === "approach" ? cue.approach : null

  function pickChords(reset: () => void) {
    reset()
    setView(0)
    setNow(null)
  }

  function cueText(): string {
    if (!cur || !next || !curInfo || !nextInfo) return ""
    if (sameChord) return `${cur} repeats. Pick a different chord tone on each bar so the line keeps moving.`
    if (ex.id === "roots") return `Move to the root of ${next}, ${nameOf(nextInfo.root, flats)}.`
    if (!cue) return ""
    const m = cue.move
    const toName = nameOf(m.to.pc, flats)
    const toRole = roleName(nextInfo, m.to.role, next)
    const fromRole = roleName(curInfo, m.from.role, cur)
    const where = cue.target ? ` On the board: fret ${cue.target.fret} on the ${STRING_WORDS[cue.target.string - 1]} string.` : " Slide to a nearby fret to find it."
    if (m.semis === 0) return `${toName} is in both chords: the ${fromRole} of ${cur} and the ${toRole} of ${next}. Hold it right through the change.${where}`
    return `Land on ${toName}, the ${toRole} of ${next}. From the ${fromRole} of ${cur} (${nameOf(m.from.pc, flats)}) it is ${stepWords(m)}.${where}`
  }

  const toneLine = curInfo
    ? (["R", "3", "5", "7"] as Role[])
        .map(r => {
          const pc = r === "R" ? curInfo.root : r === "3" ? curInfo.third : r === "5" ? curInfo.fifth : curInfo.seventh
          return pc === null ? null : `${roleName(curInfo, r, cur)} ${nameOf(pc, flats)}`
        })
        .filter(Boolean)
        .join(" · ")
    : ""

  return (
    <div className="space-y-4">
      <Hint>
        Soloing over changes means your line lets the listener hear each chord. The simplest way: when a new chord arrives, be sitting on a note that belongs to it. The 3rd and 7th of a chord are the most telling notes, so aim for those first.
      </Hint>

      <Panel title="Pick a progression">
        <div className="flex gap-1.5" role="group" aria-label="Where the chords come from">
          <Chip active={source === "ideas"} onClick={() => pickChords(() => setSource("ideas"))} className="flex-1">From Ideas</Chip>
          <Chip active={source === "charts"} onClick={() => pickChords(() => setSource("charts"))} className="flex-1">My charts</Chip>
        </div>

        {source === "ideas" ? (
          <>
            <div className="-mx-1 mt-3 flex gap-1.5 overflow-x-auto px-1 pb-1" role="group" aria-label="Genre">
              {GENRES.map(g => (
                <Chip key={g.id} active={genre === g.id} onClick={() => pickChords(() => { setGenre(g.id); setProgIdx(0) })} className="shrink-0">{g.label}</Chip>
              ))}
            </div>
            <div className="-mx-1 mt-1.5 flex gap-1.5 overflow-x-auto px-1 pb-1" role="group" aria-label="Progression">
              {info.progressions.map((p, i) => (
                <Chip key={p.name} active={progIdx === i} onClick={() => pickChords(() => setProgIdx(i))} className="shrink-0 text-sm">{p.name}</Chip>
              ))}
            </div>
            <div className="mt-3">
              <KeyPicker value={key} onChange={k => pickChords(() => setKey(k))} label="Play in" allowMinor={false} />
            </div>
          </>
        ) : charts.length === 0 ? (
          <p className="mt-3 text-sm text-white/80">No saved charts yet. Save one from Song Builder or Ideas and it will show up here.</p>
        ) : (
          <>
            <div className="-mx-1 mt-3 flex gap-1.5 overflow-x-auto px-1 pb-1" role="group" aria-label="Saved charts">
              {charts.map(c => (
                <Chip key={c.id} active={chart?.id === c.id} onClick={() => pickChords(() => { setChartId(c.id); setPhraseIdx(0) })} className="shrink-0 text-sm">{c.title || "Untitled"}</Chip>
              ))}
            </div>
            {phrases.length > 1 && (
              <div className="-mx-1 mt-1.5 flex gap-1.5 overflow-x-auto px-1 pb-1" role="group" aria-label="Section of the chart">
                {phrases.map((p, i) => (
                  <Chip key={`${p.label}-${i}`} active={phraseIdx === i} onClick={() => pickChords(() => setPhraseIdx(i))} className="shrink-0 text-sm">{p.label}</Chip>
                ))}
              </div>
            )}
            {chart && phrases.length === 0 && <p className="mt-3 text-sm text-white/80">No chords found in that chart.</p>}
          </>
        )}
      </Panel>

      {n === 0 ? null : (
        <>
          <PlayBar chords={chords} defaultBpm={defaultBpm} onStep={setNow} />

          <Panel title="Where your hand is">
            <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1" role="group" aria-label="Fret position">
              {WINDOWS.map((x, i) => (
                <Chip key={x.lo} active={win === i} onClick={() => setWin(i)} className="shrink-0 text-sm">
                  {x.label}
                </Chip>
              ))}
            </div>
            <p className="mt-2 text-sm text-white/70">The board shows five frets. Stay in one spot and see how many chord tones are already under your fingers.</p>
          </Panel>

          <Panel title="Now and next">
            <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1" role="group" aria-label="Chords in the progression">
              {chords.map((c, i) => (
                <Chip key={i} active={i === shown} onClick={() => setView(i)} className="shrink-0 text-lg font-bold">{c}</Chip>
              ))}
            </div>

            <div className="mt-3 rounded-xl border border-amber-400/40 bg-amber-400/10 p-3" role="status" aria-live="polite">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-200">Next bar: {next}</p>
              <p className="mt-1 text-base leading-snug text-white">{cueText()}</p>
            </div>

            <div className="mt-3 flex items-center justify-between gap-2">
              <h3 className="text-lg font-bold text-white">
                <ChordTap chord={cur} className="-mx-1 min-h-11 px-1 text-lg font-bold">{cur}</ChordTap> chord tones
              </h3>
              <div className="flex gap-1.5" role="group" aria-label="Dot labels">
                <Chip active={!numbers} onClick={() => setNumbers(false)} className="min-h-10 text-sm">Notes</Chip>
                <Chip active={numbers} onClick={() => setNumbers(true)} className="min-h-10 text-sm">Roles</Chip>
              </div>
            </div>
            <div className="mt-2">
              <SoloBoard
                notes={notes}
                faint={faint}
                lo={w.lo}
                hi={w.hi}
                flats={flats}
                numbers={numbers}
                rolesShown={roles}
                target={target}
                approach={approach}
                summary={`${cur} chord tones on frets ${w.lo} to ${w.hi}`}
              />
            </div>
            <p className="mt-2 text-sm text-white/85">{toneLine}</p>
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/80" aria-label="Legend">
              {([["R", "Root"], ["3", "3rd"], ["7", "7th"], ["5", "5th"]] as [Role, string][]).map(([r, label]) => (
                <li key={r} className="flex items-center gap-1.5">
                  <span aria-hidden className="inline-block h-3 w-3 rounded-full" style={{ background: ROLE_FILL[r] }} />
                  {label}
                </li>
              ))}
              <li className="flex items-center gap-1.5">
                <span aria-hidden className="inline-block h-3 w-3 rounded-full border-2 border-dashed border-white" />
                Land here next bar
              </li>
            </ul>
          </Panel>

          <Panel title="Practice ladder">
            <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1" role="group" aria-label="Exercise">
              {EXERCISES.map((e, i) => (
                <Chip key={e.id} active={exIdx === i} onClick={() => setExIdx(i)} className="shrink-0 text-sm">{i + 1}. {e.short}</Chip>
              ))}
            </div>
            <h3 className="mt-3 text-lg font-bold text-white">{ex.title}</h3>
            <ol className="mt-2 list-decimal space-y-2 pl-5 text-base leading-snug text-white/90">
              {ex.steps.map((s, i) => <li key={i}>{s}</li>)}
            </ol>
            <p className="mt-3 rounded-xl border border-purple-300/30 bg-purple-400/10 p-3 text-sm text-purple-100">
              <span className="font-bold">Listen for: </span>{ex.listen}
            </p>
            <p className="mt-3 text-xs text-white/60">Work down the ladder in order. Each step uses the one before it. Press Play above, pick the loop speed that feels comfortable, and slow it down if you miss the landing.</p>
          </Panel>
        </>
      )}

      <NextSteps items={[{ href: "/jam/scales", label: "Scales" }, { href: "/jam/progressions", label: "Ideas" }, { href: "/jam/chart", label: "Chart" }, { href: "/chord-bible", label: "Chord Bible" }]} />
    </div>
  )
}
