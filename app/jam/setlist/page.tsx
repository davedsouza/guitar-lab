"use client"

import Link from "next/link"
import { useState } from "react"
import KeyPicker from "@/components/jam/KeyPicker"
import { BigButton, Chip, Hint, Panel, inputClass } from "@/components/jam/ui"
import {
  CHARTS_KEY, SETLIST_KEY, parseCharts, parseSetlist, uid, useLocalState, useWakeLock, type SavedChart, type SetlistItem,
} from "@/lib/jam/storage"
import { keyLabel, noteName, parseNote, prefersFlats, type KeyRef } from "@/lib/jam/theory"

function keyFromString(s: string): KeyRef {
  const m = /^([A-G][#b]?)(m?)$/.exec(s.trim())
  return m ? { root: parseNote(m[1]) ?? 0, minor: m[2] === "m" } : { root: 0, minor: false }
}

const BLANK: SetlistItem = { id: "", title: "", key: "G", capo: 0, bpm: null, notes: "", chartId: null }

export default function Setlist() {
  const [items, setItems, loaded] = useLocalState<SetlistItem[]>(SETLIST_KEY, [], parseSetlist)
  const [charts] = useLocalState<SavedChart[]>(CHARTS_KEY, [], parseCharts)
  const [editing, setEditing] = useState<SetlistItem | null>(null)
  const [gig, setGig] = useState(false)
  const [pos, setPos] = useState(0)

  useWakeLock(gig)

  if (!loaded) return <p className="text-purple-200">Loading...</p>

  function move(i: number, d: number) {
    setItems(prev => {
      const j = i + d
      if (j < 0 || j >= prev.length) return prev
      const copy = [...prev]
      ;[copy[i], copy[j]] = [copy[j], copy[i]]
      return copy
    })
  }

  // ── Gig mode ──
  if (gig && items.length > 0) {
    const i = Math.min(pos, items.length - 1)
    const s = items[i]
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-purple-200">Song {i + 1} of {items.length}</p>
          <Chip onClick={() => setGig(false)}>Exit</Chip>
        </div>
        <div className="rounded-3xl border-2 border-amber-400/60 bg-black/50 p-5 text-center">
          <h2 className="break-words text-3xl font-black leading-tight">{s.title}</h2>
          <p className="mt-4 text-6xl font-black text-amber-300">{s.key}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-1 text-xl font-bold">
            {s.capo > 0 && <span>Capo {s.capo}</span>}
            {s.bpm && <span>{s.bpm} bpm</span>}
          </div>
          {s.notes && <p className="mt-4 whitespace-pre-wrap text-lg leading-relaxed text-white/85">{s.notes}</p>}
          {s.chartId && charts.some(c => c.id === s.chartId) && (
            <Link href={`/jam/chart?id=${s.chartId}`} className="mt-5 flex min-h-14 items-center justify-center rounded-2xl bg-white/15 text-lg font-bold active:bg-white/25">
              Open chart
            </Link>
          )}
        </div>
        {items[i + 1] && <p className="text-center text-base text-purple-200">Next: <span className="font-bold text-white">{items[i + 1].title}</span> in {items[i + 1].key}</p>}
        <div className="grid grid-cols-2 gap-3">
          <BigButton tone="ghost" disabled={i === 0} onClick={() => setPos(i - 1)}>Previous</BigButton>
          <BigButton disabled={i === items.length - 1} onClick={() => setPos(i + 1)}>Next song</BigButton>
        </div>
      </div>
    )
  }

  // ── Edit form ──
  if (editing) {
    const ek = keyFromString(editing.key)
    return (
      <div className="space-y-4">
        <div>
          <label htmlFor="sl-title" className="mb-1 block text-xs font-bold uppercase tracking-wider text-purple-300">Song</label>
          <input id="sl-title" className={inputClass} value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} placeholder="Song title" />
        </div>
        <Panel>
          <KeyPicker value={ek} onChange={k => setEditing({ ...editing, key: noteName(k.root, prefersFlats(k)) + (k.minor ? "m" : "") })} />
        </Panel>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="sl-capo" className="mb-1 block text-xs font-bold uppercase tracking-wider text-purple-300">Capo fret</label>
            <input id="sl-capo" type="number" inputMode="numeric" min={0} max={12} className={inputClass} value={editing.capo} onChange={e => setEditing({ ...editing, capo: Math.max(0, Math.min(12, parseInt(e.target.value, 10) || 0)) })} />
          </div>
          <div>
            <label htmlFor="sl-bpm" className="mb-1 block text-xs font-bold uppercase tracking-wider text-purple-300">Tempo (bpm)</label>
            <input id="sl-bpm" type="number" inputMode="numeric" min={30} max={260} className={inputClass} value={editing.bpm ?? ""} onChange={e => setEditing({ ...editing, bpm: parseInt(e.target.value, 10) || null })} />
          </div>
        </div>
        <div>
          <label htmlFor="sl-notes" className="mb-1 block text-xs font-bold uppercase tracking-wider text-purple-300">Notes</label>
          <textarea id="sl-notes" rows={3} className={inputClass} value={editing.notes} onChange={e => setEditing({ ...editing, notes: e.target.value })} placeholder="Intro 4 bars, big stop at the end..." />
        </div>
        {charts.length > 0 && (
          <div>
            <label htmlFor="sl-chart" className="mb-1 block text-xs font-bold uppercase tracking-wider text-purple-300">Chart</label>
            <select id="sl-chart" className={inputClass} value={editing.chartId ?? ""} onChange={e => setEditing({ ...editing, chartId: e.target.value || null })}>
              <option value="">No chart</option>
              {charts.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
        )}
        <div className="flex gap-2">
          <BigButton className="flex-1" disabled={!editing.title.trim()} onClick={() => {
            const saved = { ...editing, title: editing.title.trim() }
            if (saved.id) setItems(prev => prev.map(x => (x.id === saved.id ? saved : x)))
            else setItems(prev => [...prev, { ...saved, id: uid() }])
            setEditing(null)
          }}>Save</BigButton>
          <BigButton tone="ghost" onClick={() => setEditing(null)}>Cancel</BigButton>
        </div>
      </div>
    )
  }

  // ── List ──
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <BigButton onClick={() => setEditing({ ...BLANK })}>+ Add song</BigButton>
        <BigButton tone="ghost" disabled={items.length === 0} onClick={() => { setPos(0); setGig(true) }}>Start set</BigButton>
      </div>
      {items.length === 0 ? (
        <Panel><Hint>No songs yet. Add what you plan to play, with the key, capo and tempo, so you are not hunting for it on stage. Saved on this phone.</Hint></Panel>
      ) : (
        <ol className="space-y-2">
          {items.map((s, i) => (
            <li key={s.id} className="rounded-2xl border border-white/15 bg-white/[0.06] p-3">
              <div className="flex items-center gap-3">
                <span className="w-6 text-center text-lg font-black text-purple-300">{i + 1}</span>
                <button type="button" onClick={() => setEditing(s)} className="min-h-12 min-w-0 flex-1 text-left">
                  <span className="block truncate text-base font-bold">{s.title}</span>
                  <span className="block text-sm text-purple-200">
                    {keyLabel(keyFromString(s.key))}{s.capo > 0 ? ` · capo ${s.capo}` : ""}{s.bpm ? ` · ${s.bpm} bpm` : ""}
                  </span>
                </button>
                <div className="flex shrink-0">
                  <button type="button" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)} className="min-h-12 min-w-11 text-xl disabled:opacity-25">▲</button>
                  <button type="button" aria-label="Move down" disabled={i === items.length - 1} onClick={() => move(i, 1)} className="min-h-12 min-w-11 text-xl disabled:opacity-25">▼</button>
                  <button type="button" aria-label={`Remove ${s.title}`} onClick={() => setItems(prev => prev.filter(x => x.id !== s.id))} className="min-h-12 min-w-11 text-xl text-red-300">✕</button>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
