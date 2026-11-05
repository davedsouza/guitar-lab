"use client"

import { useMemo, useState } from "react"
import { ChordTap } from "@/components/jam/ChordSheet"
import { BigButton, Chip, Hint, Panel, inputClass } from "@/components/jam/ui"
import {
  PARTS, PLAN_MAX, getStyle, keyName, makePlan, readChordInput,
  type PlanIdea, type PlanState,
} from "@/lib/jam/plan"
import type { KeyRef } from "@/lib/jam/theory"

const EXAMPLES: { label: string; chords: string[] }[] = [
  { label: "F9 G9", chords: ["F9", "G9"] },
  { label: "Am7 D9 Gmaj7", chords: ["Am7", "D9", "Gmaj7"] },
  { label: "Em C D", chords: ["Em", "C", "D"] },
]

const same = (a: KeyRef | null, b: KeyRef) => a !== null && a.root === b.root && a.minor === b.minor

function IdeaCard({ idea, onUse }: { idea: PlanIdea; onUse: () => void }) {
  return (
    <li className="rounded-xl border border-white/15 bg-white/[0.05] p-3">
      <h3 className="text-sm font-bold text-white">{idea.title}</h3>
      <ol className="mt-2 flex flex-wrap gap-1.5" aria-label={`${idea.title} chords in order`}>
        {idea.items.map((it, i) => (
          <li key={i} className="flex flex-col items-center">
            <ChordTap
              chord={it.chord}
              className={`min-h-11 min-w-14 rounded-xl border px-2 text-lg font-extrabold ${
                it.mine ? "border-amber-400 bg-amber-400 text-slate-950" : "border-purple-300/50 bg-purple-400/15 text-purple-100"
              }`}
            />
            <span aria-hidden className="mt-0.5 text-xs font-semibold text-white/70">{it.roman}</span>
          </li>
        ))}
      </ol>
      <p className="mt-2 text-xs text-white/70">
        <span className="font-bold text-amber-300">Yellow</span> are your chords. <span className="font-bold text-purple-200">Purple</span> are the ones we added.
      </p>
      {idea.notes.length > 0 && (
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-snug text-white/90">
          {idea.notes.map((n, i) => <li key={i}>{n}</li>)}
        </ul>
      )}
      <BigButton tone="ghost" className="mt-3 min-h-12 w-full text-base" onClick={onUse}>Use this in the builder</BigButton>
    </li>
  )
}

export default function PartPlanner({
  plan, setPlan, onUse,
}: {
  plan: PlanState
  setPlan: (u: (p: PlanState) => PlanState) => void
  onUse: (chords: string[], key: KeyRef) => void
}) {
  const [input, setInput] = useState("")
  const [error, setError] = useState("")
  const style = getStyle(plan.style)
  const part = PARTS.find(p => p.id === plan.part) ?? PARTS[0]
  const result = useMemo(() => makePlan(plan.wanted, plan.style, plan.key, plan.keep), [plan.wanted, plan.style, plan.key, plan.keep])
  const dir = style.direction

  function add() {
    const { ok, bad } = readChordInput(input)
    if (bad.length) {
      setError(`Could not read: ${bad.join(" ")}. Try chords like F9, Am7, C#m or Bbmaj7.`)
      return
    }
    setError("")
    if (ok.length === 0) return
    const next = [...plan.wanted, ...ok].slice(0, PLAN_MAX)
    setPlan(p => ({ ...p, wanted: next, key: null }))
    setInput("")
  }

  return (
    <div className="space-y-4">
      <Hint>Tell us the chords you want and the style. We find the key, put them in a good order, and suggest what could go in between.</Hint>

      <Panel title="What is this part?">
        <div className="flex flex-wrap gap-1.5">
          {PARTS.map(p => (
            <Chip key={p.id} active={plan.part === p.id} onClick={() => setPlan(s => ({ ...s, part: p.id }))}>{p.label}</Chip>
          ))}
        </div>
        <p className="mt-3 text-sm text-white/80">{part.tip}</p>
      </Panel>

      <Panel title="Chords you want in the mix">
        {plan.wanted.length === 0 ? (
          <p className="text-base text-white/70">Add up to {PLAN_MAX} chords. Use 9ths, 7ths, anything you like.</p>
        ) : (
          <ul className="flex flex-wrap gap-2" aria-label="Chords you want">
            {plan.wanted.map((c, i) => (
              <li key={i} className="flex items-stretch overflow-hidden rounded-xl border border-white/20 bg-white/10">
                <ChordTap chord={c} className="min-h-12 min-w-14 rounded-none px-3 text-xl font-extrabold text-amber-300" />
                <button
                  type="button"
                  aria-label={`Remove ${c}, number ${i + 1}`}
                  onClick={() => setPlan(p => ({ ...p, wanted: p.wanted.filter((_, j) => j !== i), key: null }))}
                  className="min-h-12 w-11 border-l border-white/15 text-lg text-white/70 active:bg-white/20"
                >
                  <span aria-hidden>×</span>
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-3 flex gap-2">
          <div className="min-w-0 flex-1">
            <label htmlFor="plan-in" className="sr-only">Type the chords you want</label>
            <input
              id="plan-in"
              className={`${inputClass} font-mono`}
              value={input}
              onChange={e => { setInput(e.target.value); setError("") }}
              onKeyDown={e => { if (e.key === "Enter") add() }}
              placeholder="Type chords: F9 G9"
              autoCapitalize="characters"
              autoCorrect="off"
              spellCheck={false}
              aria-describedby={error ? "plan-err" : undefined}
              aria-invalid={error ? true : undefined}
            />
          </div>
          <Chip onClick={add} className="shrink-0">Add</Chip>
        </div>
        {error && <p id="plan-err" className="mt-2 text-sm font-semibold text-red-300">{error}</p>}
        {plan.wanted.length === 0 && (
          <div className="mt-3">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-purple-300">Try an example</p>
            <div className="flex flex-wrap gap-1.5">
              {EXAMPLES.map(e => (
                <Chip key={e.label} onClick={() => setPlan(p => ({ ...p, wanted: e.chords, key: null }))}>{e.label}</Chip>
              ))}
            </div>
          </div>
        )}
        {plan.wanted.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            <Chip onClick={() => setPlan(p => ({ ...p, wanted: p.wanted.slice(0, -1), key: null }))}>Undo</Chip>
            <Chip onClick={() => setPlan(p => ({ ...p, wanted: [], key: null }))}>Clear</Chip>
            {plan.wanted.length > 1 && (
              <Chip active={plan.keep} onClick={() => setPlan(p => ({ ...p, keep: !p.keep }))}>Keep my order</Chip>
            )}
          </div>
        )}
      </Panel>

      {result && (
        <>
          <Panel title="Key">
            <p className="text-lg font-bold text-white">
              {keyName(result.key)}
              <span className="ml-2 text-sm font-semibold text-purple-200">{plan.key ? "chosen by you" : "best guess"}</span>
            </p>
            <p className="mt-1 text-sm text-white/80">
              {result.keys.find(k => same(k.key, result.key))?.reason ?? ""}.
            </p>
            <p className="mt-2 text-xs text-white/70">
              With 7ths and 9ths the same chords can sit in more than one key. If the ideas below sound wrong, try another.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {result.keys.map(k => (
                <Chip key={`${k.key.root}${k.key.minor}`} active={same(result.key, k.key)} onClick={() => setPlan(p => ({ ...p, key: k.key }))}>
                  {keyName(k.key)}
                </Chip>
              ))}
            </div>
          </Panel>

          <Panel title={result.reordered ? "A smoother order" : "Your order"}>
            <ol className="flex flex-wrap items-center gap-1.5" aria-label="Suggested order">
              {result.order.map((c, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  {i > 0 && <span aria-hidden className="text-white/60">→</span>}
                  <ChordTap chord={c} className="min-h-12 min-w-14 rounded-xl border border-amber-400 bg-amber-400 px-2 text-xl font-extrabold text-slate-950" />
                </li>
              ))}
            </ol>
            <p className="mt-2 text-sm text-white/80">
              {result.order.length === 1
                ? "One chord on its own. The ideas below pair it with a chord that fits."
                : result.reordered
                  ? "We moved your chords around so each move is a common one. Tap Keep my order to use yours."
                  : plan.keep
                    ? "Kept in the order you typed."
                    : "Your order already flows well."}
            </p>
          </Panel>

          <Panel title="What could go in between">
            {result.ideas.length === 0 ? (
              <p className="text-base text-white/70">No extra chords needed. Try adding another chord.</p>
            ) : (
              <ul className="space-y-3">
                {result.ideas.map(idea => (
                  <IdeaCard key={idea.id} idea={idea} onUse={() => onUse(idea.items.map(x => x.chord), result.key)} />
                ))}
              </ul>
            )}
            <BigButton tone="ghost" className="mt-3 min-h-12 w-full text-base" onClick={() => onUse(result.order, result.key)}>
              Use just my chords in the builder
            </BigButton>
          </Panel>
        </>
      )}

      <Panel title={`How to play it: ${style.label}`}>
        <dl className="space-y-3 text-sm leading-snug text-white/90">
          <div>
            <dt className="text-xs font-bold uppercase tracking-wider text-amber-300">Feel</dt>
            <dd className="mt-1">{dir.feel} Around {dir.bpm[0]} to {dir.bpm[1]} bpm.</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-wider text-amber-300">Rhythm</dt>
            <dd><ul className="mt-1 list-disc space-y-1 pl-5">{dir.rhythm.map((t, i) => <li key={i}>{t}</li>)}</ul></dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-wider text-amber-300">Riffs and fills</dt>
            <dd><ul className="mt-1 list-disc space-y-1 pl-5">{dir.riff.map((t, i) => <li key={i}>{t}</li>)}</ul></dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-wider text-amber-300">Notes to solo with</dt>
            <dd className="mt-1">{dir.scale}</dd>
          </div>
          {dir.shape && (
            <div>
              <dt className="text-xs font-bold uppercase tracking-wider text-amber-300">Shape tip</dt>
              <dd className="mt-1">{dir.shape}</dd>
            </div>
          )}
        </dl>
      </Panel>
    </div>
  )
}
