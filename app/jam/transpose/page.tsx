"use client"

import { useMemo, useState } from "react"
import { ChordTap } from "@/components/jam/ChordSheet"
import KeyPicker from "@/components/jam/KeyPicker"
import { BigButton, Chip, Hint, Panel, inputClass } from "@/components/jam/ui"
import {
  capoOptions, extractChordsFromChart, guessKeys, keyLabel, prefersFlats, transposeChartText, type KeyRef,
} from "@/lib/jam/theory"

const SAMPLE = "G   C   D   Em\nC   G   D   G"

export default function TransposePage() {
  const [text, setText] = useState(SAMPLE)
  const [fromOverride, setFromOverride] = useState<KeyRef | null>(null)
  const [to, setTo] = useState<KeyRef | null>(null)

  const chords = useMemo(() => extractChordsFromChart(text), [text])
  const guessed = useMemo(() => guessKeys(chords)[0]?.key ?? { root: 7, minor: false }, [chords])
  const from = fromOverride ?? guessed
  const target = to ?? from
  const semis = (((target.root - from.root) % 12) + 12) % 12
  const signed = semis > 6 ? semis - 12 : semis
  const flats = prefersFlats(target)

  const out = useMemo(() => transposeChartText(text, semis, flats), [text, semis, flats])
  const outChords = useMemo(() => Array.from(new Set(extractChordsFromChart(out))), [out])
  const capo = useMemo(() => capoOptions(outChords).slice(0, 4), [outChords])

  function bump(n: number) {
    setTo({ root: (((target.root + n) % 12) + 12) % 12, minor: target.minor })
  }

  return (
    <div className="space-y-4">
      <Panel title="Chords or a whole chart">
        <label htmlFor="tr-text" className="sr-only">Chords to transpose</label>
        <textarea
          id="tr-text"
          value={text}
          onChange={e => setText(e.target.value)}
          rows={5}
          spellCheck={false}
          autoCapitalize="none"
          autoCorrect="off"
          className={`${inputClass} font-mono leading-relaxed`}
          placeholder="Paste chords here: G C D Em"
        />
        <p className="mt-2 text-sm text-purple-200">
          Looks like the key of <span className="font-bold text-white">{keyLabel(guessed)}</span>
          {fromOverride ? " (you picked " + keyLabel(fromOverride) + ")" : ""}.
        </p>
      </Panel>

      <Panel title="Move it to a new key">
        <div className="mb-3 flex items-center justify-between gap-2">
          <BigButton tone="ghost" onClick={() => bump(-1)} ariaLabel="Down one half step" className="w-20">−1</BigButton>
          <div className="text-center">
            <p className="text-3xl font-black text-amber-300">{keyLabel(target)}</p>
            <p className="text-sm text-purple-200">{signed === 0 ? "same key" : `${signed > 0 ? "+" : ""}${signed} half step${Math.abs(signed) > 1 ? "s" : ""}`}</p>
          </div>
          <BigButton tone="ghost" onClick={() => bump(1)} ariaLabel="Up one half step" className="w-20">+1</BigButton>
        </div>
        <KeyPicker value={target} onChange={setTo} label="New key" />
        <details className="mt-3">
          <summary className="min-h-12 cursor-pointer py-3 text-sm font-semibold text-purple-200">Wrong starting key? Fix it</summary>
          <KeyPicker value={from} onChange={setFromOverride} label="Original key" />
          {fromOverride && (
            <Chip className="mt-2 text-sm" onClick={() => setFromOverride(null)}>Use detected key</Chip>
          )}
        </details>
      </Panel>

      <Panel title={`Result in ${keyLabel(target)}`}>
        <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-xl bg-black/60 p-3 font-mono text-lg leading-relaxed text-amber-200">{out}</pre>
        <div className="mt-3 flex gap-2">
          <BigButton
            tone="ghost"
            className="flex-1"
            onClick={() => navigator.clipboard?.writeText(out).catch(() => {})}
          >
            Copy
          </BigButton>
          <BigButton tone="ghost" className="flex-1" onClick={() => { setText(out); setFromOverride(null); setTo(null) }}>
            Use as input
          </BigButton>
        </div>
      </Panel>

      <Panel title="Capo ideas for these chords">
        <Hint>Put the capo here and play the easier shapes. The sound stays in {keyLabel(target)}.</Hint>
        <ul className="mt-3 space-y-2">
          {capo.map(o => (
            <li key={o.capo} className="rounded-xl bg-slate-950/60 p-3">
              <p className="text-base font-bold">
                {o.capo === 0 ? "No capo" : `Capo ${o.capo}`}
                <span className="ml-2 text-sm font-medium text-emerald-300">{o.easyCount}/{o.total} easy shapes</span>
              </p>
              <p className="mt-1 flex flex-wrap gap-x-3 font-mono text-lg text-amber-200">
                {Array.from(new Set(o.shapes)).map(c => <ChordTap key={c} chord={c} className="min-h-12 px-1" />)}
              </p>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  )
}
