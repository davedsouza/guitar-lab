"use client"

import { Fragment, Suspense, useEffect, useMemo, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import BandGuidance from "@/components/jam/BandGuidance"
import { useChordSheet } from "@/components/jam/ChordSheet"
import KeyPicker from "@/components/jam/KeyPicker"
import { BigButton, Chip, Hint, Panel, inputClass } from "@/components/jam/ui"
import type { GuidanceGenre } from "@/lib/jam/band"
import { STARTER_CHARTS } from "@/lib/jam/charts"
import { POPULAR_ACOUSTIC } from "@/lib/jam/songs"
import { CHARTS_KEY, makeChart, parseCharts, parseFont, useLocalState, useWakeLock, type SavedChart } from "@/lib/jam/storage"
import {
  classifyChart, extractChordsFromChart, extractPhrases, keyLabel, noteName, parseChord, parseNote,
  prefersFlats, transposeChartText, type KeyRef,
} from "@/lib/jam/theory"

function keyFromString(s: string): KeyRef {
  const m = /^([A-G][#b]?)(m?)$/.exec(s.trim())
  if (!m) return { root: 0, minor: false }
  return { root: parseNote(m[1]) ?? 0, minor: m[2] === "m" }
}

function ChordSpan({ chord, onTap }: { chord: string; onTap: (c: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => onTap(chord)}
      className="relative rounded px-0.5 font-mono font-extrabold text-amber-300 underline-offset-4 after:absolute after:-inset-x-2 after:-inset-y-2 after:content-[''] active:bg-amber-400/30"
    >
      {chord}
    </button>
  )
}

function ChartBody({ text, onTap }: { text: string; onTap: (c: string) => void }) {
  const lines = useMemo(() => classifyChart(text), [text])
  return (
    <div className="space-y-1.5">
      {lines.map((l, i) => {
        if (l.kind === "blank") return <div key={i} className="h-[0.8em]" />
        if (l.kind === "section")
          return <p key={i} className="pt-2 text-[0.7em] font-bold uppercase tracking-widest text-purple-300">{l.text}</p>
        if (l.kind === "chords" && l.text.trim().startsWith("|")) {
          const cells = l.text.split("|").map(c => c.trim()).filter(Boolean)
          return (
            <div key={i} className="flex flex-wrap gap-x-5 gap-y-1 border-l-2 border-amber-300/40 pl-3 font-mono font-extrabold text-amber-300">
              {cells.map((c, j) => (
                <span key={j} className="flex gap-2">
                  {c.split(/\s+/).map((t, k) => <ChordSpan key={k} chord={t} onTap={onTap} />)}
                </span>
              ))}
            </div>
          )
        }
        if (l.kind === "chords")
          return (
            <pre key={i} className="whitespace-pre font-mono font-extrabold text-amber-300">
              {l.text.split(/(\s+)/).map((t, j) => (parseChord(t) ? <ChordSpan key={j} chord={t} onTap={onTap} /> : <Fragment key={j}>{t}</Fragment>))}
            </pre>
          )
        if (l.kind === "inline") {
          const parts = l.text.split(/(\[[^\]]+\])/).filter(p => p !== "")
          const segs: { chord: string; text: string }[] = []
          let cur = { chord: "", text: "" }
          parts.forEach(p => {
            const m = /^\[([^\]]+)\]$/.exec(p)
            if (m) {
              if (cur.chord || cur.text) segs.push(cur)
              cur = { chord: m[1], text: "" }
            } else cur.text += p
          })
          if (cur.chord || cur.text) segs.push(cur)
          return (
            <div key={i} className="flex flex-wrap items-end gap-y-1">
              {segs.map((s, j) => (
                <span key={j} className="inline-flex flex-col">
                  <span className="min-h-[1.3em]">{s.chord && <ChordSpan chord={s.chord} onTap={onTap} />}</span>
                  <span className="whitespace-pre text-white">{s.text || " "}</span>
                </span>
              ))}
            </div>
          )
        }
        return <p key={i} className="whitespace-pre-wrap text-white">{l.text}</p>
      })}
    </div>
  )
}

type Mode = "list" | "view" | "edit"

export default function ChartPage() {
  return (
    <Suspense fallback={<p className="text-purple-200">Loading...</p>}>
      <ChartInner />
    </Suspense>
  )
}

function ChartInner() {
  const [charts, setCharts, loaded] = useLocalState<SavedChart[]>(CHARTS_KEY, [], parseCharts)
  const idParam = useSearchParams().get("id")
  const [activeId, setActiveId] = useState<string | null>(idParam)
  const [rawMode, setMode] = useState<Mode>(idParam ? "view" : "list")
  const [shift, setShift] = useState(0)
  const [font, setFont] = useLocalState<number>("jam.chart.font", 22, parseFont)
  const [speed, setSpeed] = useState(4)
  const [scrolling, setScrolling] = useState(false)
  const showChord = useChordSheet()
  const [draft, setDraft] = useState<SavedChart | null>(null)
  const [songQuery, setSongQuery] = useState("")

  const active = charts.find(c => c.id === activeId) ?? null
  const mode: Mode = loaded && rawMode === "view" && !active ? "list" : rawMode

  useWakeLock(mode === "view")

  // auto-scroll
  const acc = useRef(0)
  useEffect(() => {
    if (!scrolling) return
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      acc.current += ((now - last) / 1000) * speed * 9
      last = now
      const whole = Math.floor(acc.current)
      if (whole > 0) { window.scrollBy(0, whole); acc.current -= whole }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    const stop = () => setScrolling(false)
    window.addEventListener("touchstart", stop, { passive: true })
    window.addEventListener("wheel", stop, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("touchstart", stop)
      window.removeEventListener("wheel", stop)
    }
  }, [scrolling, speed])

  function open(id: string) {
    setActiveId(id)
    setShift(0)
    setScrolling(false)
    setMode("view")
    window.scrollTo(0, 0)
  }

  function startEdit(c: SavedChart) {
    setDraft({ ...c })
    setActiveId(c.id)
    setMode("edit")
  }

  function newFrom(s: { title: string; key: string; genre: string; body: string }) {
    const c = makeChart(s)
    setCharts(prev => [c, ...prev])
    return c
  }

  if (!loaded) return <p className="text-purple-200">Loading...</p>

  // ── List ──
  if (mode === "list") {
    return (
      <div className="space-y-4">
        <BigButton className="w-full" onClick={() => { const c = newFrom({ title: "New chart", key: "G", genre: "general", body: "Verse\n[G]Type your lyrics with [C]chords in brackets" }); startEdit(c) }}>
          + New chart
        </BigButton>
        <Panel title="Your charts">
          {charts.length === 0 ? (
            <Hint>Nothing saved yet. Start with a template below, make a new chart, or send a progression here from the Ideas screen.</Hint>
          ) : (
            <ul className="space-y-2">
              {charts.map(c => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => open(c.id)}
                    className="flex min-h-14 w-full items-center justify-between gap-3 rounded-xl bg-slate-950/60 px-4 text-left active:bg-white/15"
                  >
                    <span className="min-w-0 truncate text-base font-bold">{c.title}</span>
                    <span className="shrink-0 text-sm font-semibold text-amber-300">{c.key}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel title="Templates">
          <ul className="space-y-2">
            {STARTER_CHARTS.map(s => (
              <li key={s.title}>
                <button
                  type="button"
                  onClick={() => open(newFrom(s).id)}
                  className="flex min-h-14 w-full items-center justify-between gap-3 rounded-xl bg-slate-950/60 px-4 text-left active:bg-white/15"
                >
                  <span className="min-w-0 truncate text-base font-bold">{s.title}</span>
                  <span className="shrink-0 text-sm font-semibold text-amber-300">{s.key}</span>
                </button>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title={`Popular acoustic songs (${POPULAR_ACOUSTIC.length})`}>
          <input
            id="jam-song-search"
            type="search"
            value={songQuery}
            onChange={e => setSongQuery(e.target.value)}
            placeholder="Search by song or artist"
            className={`${inputClass} mb-3`}
          />
          <ul className="space-y-2">
            {POPULAR_ACOUSTIC.filter(s => `${s.title} ${s.artist}`.toLowerCase().includes(songQuery.trim().toLowerCase())).map(s => (
              <li key={s.title}>
                <button
                  type="button"
                  onClick={() => open(newFrom({ ...s, title: `${s.title} (${s.artist})` }).id)}
                  className="flex min-h-14 w-full items-center justify-between gap-3 rounded-xl bg-slate-950/60 px-4 py-2 text-left active:bg-white/15"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-base font-bold">{s.title}</span>
                    <span className="block truncate text-xs text-purple-200">{s.artist}</span>
                  </span>
                  <span className="shrink-0 text-sm font-semibold text-amber-300">{s.key}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-3"><Hint>Chords only, simplified from memory. No lyrics. Check them against the recording and edit in the chart.</Hint></div>
        </Panel>
        <Hint>Write chords in brackets inside the lyric line, like [G]word. Or put a line of chords above the lyric. Both work, and both transpose.</Hint>
      </div>
    )
  }

  // ── Edit ──
  if (mode === "edit" && draft) {
    const dk = keyFromString(draft.key)
    return (
      <div className="space-y-4">
        <div>
          <label htmlFor="ch-title" className="mb-1 block text-xs font-bold uppercase tracking-wider text-purple-300">Title</label>
          <input id="ch-title" className={inputClass} value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} />
        </div>
        <Panel>
          <KeyPicker value={dk} onChange={k => setDraft({ ...draft, key: noteName(k.root, prefersFlats(k)) + (k.minor ? "m" : "") })} label="Original key" />
        </Panel>
        <div>
          <label htmlFor="ch-body" className="mb-1 block text-xs font-bold uppercase tracking-wider text-purple-300">Chart</label>
          <textarea
            id="ch-body"
            value={draft.body}
            onChange={e => setDraft({ ...draft, body: e.target.value })}
            rows={14}
            spellCheck={false}
            autoCapitalize="none"
            autoCorrect="off"
            className={`${inputClass} font-mono text-[15px] leading-relaxed`}
          />
          <p className="mt-2 text-sm text-purple-200">Section names (Verse, Chorus, Bridge) on their own line become headings.</p>
        </div>
        <div className="flex gap-2">
          <BigButton className="flex-1" onClick={() => {
            const saved = { ...draft, updated: Date.now() }
            setCharts(prev => prev.map(c => (c.id === saved.id ? saved : c)))
            setShift(0)
            setMode("view")
          }}>Save</BigButton>
          <BigButton tone="ghost" onClick={() => setMode(charts.some(c => c.id === draft.id && c.body === draft.body) ? "view" : "list")}>Cancel</BigButton>
        </div>
        <BigButton tone="danger" className="w-full" onClick={() => {
          if (!window.confirm(`Delete "${draft.title}"?`)) return
          setCharts(prev => prev.filter(c => c.id !== draft.id))
          setActiveId(null)
          setMode("list")
        }}>Delete chart</BigButton>
      </div>
    )
  }

  if (!active) return null

  // ── View ──
  const orig = keyFromString(active.key)
  const nowKey: KeyRef = { root: (orig.root + shift + 120) % 12, minor: orig.minor }
  const flats = prefersFlats(nowKey)
  const shown = transposeChartText(active.body, shift, flats)
  const unique = Array.from(new Set(extractChordsFromChart(shown)))

  return (
    <div className="space-y-4 pb-28">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-2xl font-black leading-tight">{active.title}</h2>
          <p className="text-sm text-purple-200">Key of <span className="font-bold text-amber-300">{keyLabel(nowKey)}</span>{shift !== 0 ? ` (was ${keyLabel(orig)})` : ""}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Chip onClick={() => setMode("list")}>All</Chip>
          <Chip onClick={() => startEdit(active)}>Edit</Chip>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <BigButton tone="ghost" className="min-h-12 w-16 px-0" onClick={() => setShift(s => s - 1)} ariaLabel="Down one half step">−</BigButton>
        <div className="flex-1 text-center text-sm text-purple-200">Transpose {shift > 0 ? "+" : ""}{shift}</div>
        <BigButton tone="ghost" className="min-h-12 w-16 px-0" onClick={() => setShift(s => s + 1)} ariaLabel="Up one half step">+</BigButton>
      </div>

      <div className="flex items-center gap-3 rounded-xl bg-white/[0.06] px-3 py-2">
        <label htmlFor="font" className="text-sm font-semibold text-purple-200">Text size</label>
        <input id="font" type="range" min={14} max={44} value={font} onChange={e => setFont(parseInt(e.target.value, 10))} className="h-10 flex-1 accent-amber-400" />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/15 bg-black/40 p-4" style={{ fontSize: font, lineHeight: 1.35 }}>
        <ChartBody text={shown} onTap={showChord} />
      </div>

      <Hint>Tap any chord to see how to play it.</Hint>

      <Panel title="Chords in this song">
        <div className="flex flex-wrap gap-2">
          {unique.map(c => <Chip key={c} onClick={() => showChord(c)}>{c}</Chip>)}
        </div>
      </Panel>

      <BandGuidance
        genre={(active.genre as GuidanceGenre) || "general"}
        progressions={extractPhrases(shown)}
        keyRef={nowKey}
        onGenreChange={g => setCharts(prev => prev.map(c => (c.id === active.id ? { ...c, genre: g } : c)))}
      />

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/15 bg-slate-950/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <BigButton className="min-h-12 w-32" tone={scrolling ? "danger" : "primary"} onClick={() => { acc.current = 0; setScrolling(s => !s) }}>
            {scrolling ? "Stop" : "Scroll"}
          </BigButton>
          <label htmlFor="speed" className="text-sm font-semibold text-purple-200">Speed</label>
          <input id="speed" type="range" min={1} max={12} value={speed} onChange={e => setSpeed(parseInt(e.target.value, 10))} className="h-10 flex-1 accent-amber-400" />
        </div>
      </div>
    </div>
  )
}
