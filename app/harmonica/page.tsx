"use client"

import { Suspense, useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import TabImage from "@/components/jam/TabImage"
import { onSoundStatus, playNotes, playSequence, preloadSound, soundStatus, stopAll } from "@/lib/harmonicaAudio"
import {
  ADV_LICKS, BEND_LICKS, BLUES_12, BLUES_12_LICK, BLUES_CHORD_LICKS, BLUES_LICKS, CHORD_LICKS,
  KEY_NAMES, MAX_BEND, POSITIONS, SCALE_LICK, TUNES, bendName, harpForSong, holeMidi, lickSteps, noteName,
  octaveOf, toTabSpec, tuneToLick, type Lick,
} from "@/lib/harmonicaData"

// ─── Types ────────────────────────────────────────────────────────────────────

type Level = "beginner" | "intermediate" | "advanced"

const LEVELS: { id: Level; label: string; blurb: string }[] = [
  { id: "beginner", label: "Beginner", blurb: "Holding the harp, clean single notes, first tunes and chords" },
  { id: "intermediate", label: "Intermediate", blurb: "Positions, 12-bar blues, bending and playing with others" },
  { id: "advanced", label: "Advanced", blurb: "Other positions, soloing, hand effects and overblows" },
]

const SECTIONS: Record<Level, { id: string; label: string }[]> = {
  beginner: [
    { id: "harp", label: "Your harp" },
    { id: "breath", label: "Breath & tone" },
    { id: "notes", label: "First notes & tunes" },
    { id: "chords", label: "Chords & rhythm" },
    { id: "week1", label: "Week 1 plan" },
  ],
  intermediate: [
    { id: "positions", label: "Positions & keys" },
    { id: "blues", label: "Cross harp blues" },
    { id: "bending", label: "Bending" },
    { id: "tongue", label: "Tongue blocking" },
    { id: "others", label: "Play with others" },
  ],
  advanced: [
    { id: "modes", label: "Other positions" },
    { id: "solo", label: "Soloing" },
    { id: "effects", label: "Hand & breath effects" },
    { id: "overblow", label: "Overblows" },
    { id: "plan", label: "Practice plan" },
  ],
}

// ─── Inline helpers ───────────────────────────────────────────────────────────

const CALLOUT: Record<string, { box: string; label: string; name: string }> = {
  tip: { box: "border-green-400/60 bg-green-400/10", label: "text-green-300", name: "Tip" },
  warning: { box: "border-red-400/60 bg-red-400/10", label: "text-red-300", name: "Watch out" },
  insight: { box: "border-purple-400/60 bg-purple-400/10", label: "text-purple-300", name: "Good to know" },
  exercise: { box: "border-amber-400/60 bg-amber-400/10", label: "text-amber-300", name: "Try this" },
}

function Callout({ type, children }: { type: keyof typeof CALLOUT; children: ReactNode }) {
  const c = CALLOUT[type]
  return (
    <div className={`rounded-xl border-l-4 p-4 ${c.box}`}>
      <p className={`mb-1 text-xs font-bold uppercase tracking-wide ${c.label}`}>{c.name}</p>
      <div className="space-y-2 text-sm leading-relaxed text-white/85">{children}</div>
    </div>
  )
}

function Card({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="min-w-0 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
      {title && <h2 className="mb-3 text-lg font-bold text-white">{title}</h2>}
      <div className="space-y-3 text-sm leading-relaxed text-purple-100/90">{children}</div>
    </section>
  )
}

function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc space-y-1.5 pl-5">
      {items.map((t, i) => <li key={i}>{t}</li>)}
    </ul>
  )
}

function Steps({ items }: { items: ReactNode[] }) {
  return (
    <ol className="list-decimal space-y-1.5 pl-5">
      {items.map((t, i) => <li key={i}>{t}</li>)}
    </ol>
  )
}

const full = (m: number) => `${noteName(m)}${octaveOf(m)}`

// ─── Interactive: hole diagram ────────────────────────────────────────────────

function HoleDiagram({ keyIdx }: { keyIdx: number }) {
  const [hole, setHole] = useState(4)
  const h = hole - 1
  const blow = holeMidi(hole, false, 0, keyIdx)
  const draw = holeMidi(hole, true, 0, keyIdx)
  const blowBends = Array.from({ length: MAX_BEND.blow[h] }, (_, i) => i + 1)
  const drawBends = Array.from({ length: MAX_BEND.draw[h] }, (_, i) => i + 1)

  const play = (label: string, midi: number) => (
    <button
      key={label}
      type="button"
      onClick={() => playNotes([midi], 1.2)}
      className="min-h-11 rounded-lg bg-white/10 px-3 text-sm font-semibold text-white active:bg-white/25"
    >
      {label}
    </button>
  )

  return (
    <div>
      <div className="grid grid-cols-10 gap-1" role="group" aria-label="Harmonica holes">
        {Array.from({ length: 10 }, (_, i) => i + 1).map(n => {
          const on = n === hole
          return (
            <button
              key={n}
              type="button"
              onClick={() => { setHole(n); playNotes([holeMidi(n, false, 0, keyIdx)], 0.9) }}
              aria-pressed={on}
              aria-label={`Hole ${n}, blow ${noteName(holeMidi(n, false, 0, keyIdx))}, draw ${noteName(holeMidi(n, true, 0, keyIdx))}`}
              className={`flex min-w-0 flex-col items-center overflow-hidden rounded-md border text-center ${on ? "border-amber-300 bg-amber-300/20" : "border-white/15 bg-white/[0.06]"}`}
            >
              <span className="w-full bg-amber-400/15 py-1.5 text-[11px] font-bold leading-none text-amber-200">{noteName(holeMidi(n, false, 0, keyIdx))}</span>
              <span className="w-full py-2 text-sm font-bold leading-none text-white">{n}</span>
              <span className="w-full bg-sky-400/15 py-1.5 text-[11px] font-bold leading-none text-sky-200">{noteName(holeMidi(n, true, 0, keyIdx))}</span>
            </button>
          )
        })}
      </div>
      <p className="mt-2 text-xs text-white/60">
        <span className="font-semibold text-amber-200">Top row = blow</span> (breathe out) ·{" "}
        <span className="font-semibold text-sky-200">bottom row = draw</span> (breathe in). Tap a hole to hear it.
      </p>
      <div className="mt-3 rounded-xl bg-slate-950/60 p-3">
        <p className="text-base font-bold text-white">Hole {hole}</p>
        <p className="mt-1 text-sm text-white/80">
          Blow <span className="font-bold text-amber-200">{full(blow)}</span> · Draw <span className="font-bold text-sky-200">{full(draw)}</span>
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {play(`Blow ${noteName(blow)}`, blow)}
          {play(`Draw ${noteName(draw)}`, draw)}
        </div>
        {drawBends.length + blowBends.length > 0 ? (
          <div className="mt-3 space-y-2">
            {drawBends.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-sky-200">Draw bends on hole {hole}</p>
                <div className="mt-1 flex flex-wrap gap-2">
                  {drawBends.map(b => play(`-${hole}${"'".repeat(b)} ${noteName(holeMidi(hole, true, b, keyIdx))} (${bendName(b)})`, holeMidi(hole, true, b, keyIdx)))}
                </div>
              </div>
            )}
            {blowBends.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-amber-200">Blow bends on hole {hole}</p>
                <div className="mt-1 flex flex-wrap gap-2">
                  {blowBends.map(b => play(`${hole}${"'".repeat(b)} ${noteName(holeMidi(hole, false, b, keyIdx))} (${bendName(b)})`, holeMidi(hole, false, b, keyIdx)))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="mt-2 text-xs text-white/60">No bends on this hole.</p>
        )}
      </div>
    </div>
  )
}

// ─── Interactive: bend map ────────────────────────────────────────────────────

function BendMap() {
  return (
    <div>
      <div className="grid grid-cols-10 gap-1 text-center text-[11px] font-bold">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="flex min-w-0 flex-col-reverse items-center gap-1">
            {Array.from({ length: MAX_BEND.blow[i] }, (_, b) => (
              <span key={b} className="w-full rounded bg-amber-400/20 py-1 text-amber-200">{b + 1 === 1 ? "½" : b + 1 === 2 ? "1" : "1½"}</span>
            ))}
          </div>
        ))}
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="rounded bg-purple-500/40 py-1.5 text-white">{i + 1}</div>
        ))}
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="flex min-w-0 flex-col items-center gap-1">
            {Array.from({ length: MAX_BEND.draw[i] }, (_, b) => (
              <span key={b} className="w-full rounded bg-sky-400/20 py-1 text-sky-200">{b + 1 === 1 ? "½" : b + 1 === 2 ? "1" : "1½"}</span>
            ))}
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-white/60">
        Numbers are steps you can bend a note down. <span className="text-amber-200">Amber above</span> = blow bends (holes 8 to 10).{" "}
        <span className="text-sky-200">Blue below</span> = draw bends (holes 1 to 6).
      </p>
    </div>
  )
}

// ─── Interactive: lick player ─────────────────────────────────────────────────

function LickPlayer({ lick, keyIdx, bpm: startBpm = 80, tip, tonicLabel }: { lick: Lick; keyIdx: number; bpm?: number; tip?: string; tonicLabel?: boolean }) {
  const [playing, setPlaying] = useState(false)
  const [bpm, setBpm] = useState(startBpm)
  const spec = useMemo(() => toTabSpec(lick), [lick])
  const id = `bpm-${lick.id}`

  useEffect(() => stopAll, [])

  const toggle = () => {
    if (playing) { stopAll(); return }
    setPlaying(true)
    playSequence(lickSteps(lick, keyIdx), bpm, () => setPlaying(false))
  }

  const keyName = KEY_NAMES[(((keyIdx + (lick.tonic ?? 0)) % 12) + 12) % 12]

  return (
    <div className="min-w-0 rounded-xl bg-slate-950/50 p-3">
      <p className="text-base font-bold text-white">{lick.title}</p>
      <p className="mt-1 text-sm text-white/75">{lick.note}</p>
      {tonicLabel && lick.tonic !== undefined && <p className="mt-1 text-xs font-semibold text-amber-200">Sounds in the key of {keyName} on your harp</p>}
      <div className="mt-2"><TabImage spec={spec} /></div>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          aria-pressed={playing}
          className={`min-h-12 min-w-28 rounded-xl px-4 text-base font-bold ${playing ? "bg-red-500 text-white" : "bg-purple-600 text-white active:bg-purple-500"}`}
        >
          {playing ? "Stop" : "Play"}
        </button>
        <label htmlFor={id} className="flex min-w-0 flex-1 items-center gap-2 text-xs text-white/70">
          <span className="w-16 shrink-0">{bpm} bpm</span>
          <input
            id={id}
            type="range"
            min={40}
            max={140}
            step={5}
            value={bpm}
            onChange={e => setBpm(Number(e.target.value))}
            className="min-w-0 flex-1 accent-amber-400"
          />
        </label>
      </div>
      {tip && <p className="mt-2 text-sm text-purple-200">{tip}</p>}
    </div>
  )
}

// ─── Interactive: key finder ──────────────────────────────────────────────────

function KeyFinder({ keyIdx, startSong = 7, startType = "major" }: { keyIdx: number; startSong?: number; startType?: "major" | "minor" }) {
  const [song, setSong] = useState(startSong)
  const [type, setType] = useState<"major" | "minor">(startType)
  const picks = POSITIONS.filter(p => (type === "major" ? ["1st", "2nd", "12th"] : ["3rd", "4th", "5th"]).includes(p.n))
  const best = type === "major" ? "2nd" : "3rd"

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end gap-3">
        <label htmlFor="kf-song" className="text-xs font-semibold text-white/70">
          Song key
          <select
            id="kf-song"
            value={song}
            onChange={e => setSong(Number(e.target.value))}
            className="mt-1 block min-h-12 rounded-xl border border-white/20 bg-slate-900 px-3 text-base text-white"
          >
            {KEY_NAMES.map((k, i) => <option key={k} value={i}>{k}</option>)}
          </select>
        </label>
        <div className="flex gap-2" role="group" aria-label="Song type">
          {(["major", "minor"] as const).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              aria-pressed={type === t}
              className={`min-h-12 rounded-xl px-4 text-sm font-bold ${type === t ? "bg-purple-600 text-white" : "bg-white/10 text-purple-200"}`}
            >
              {t === "major" ? "Major or blues" : "Minor"}
            </button>
          ))}
        </div>
      </div>
      <ul className="grid gap-2 min-[480px]:grid-cols-3">
        {picks.map(p => {
          const k = harpForSong(song, p)
          return (
            <li key={p.n} className="rounded-xl bg-slate-950/60 p-3">
              <p className="text-xs font-bold uppercase tracking-wide text-purple-300">{p.n} position{p.n === best ? " · start here" : ""}</p>
              <p className="mt-1 text-xl font-bold text-amber-200">{KEY_NAMES[k]} harp</p>
              <p className="mt-1 text-xs text-white/70">{p.feel}</p>
              <p className="mt-1 text-xs text-white/60">Home: {p.home}</p>
            </li>
          )
        })}
      </ul>
      <div>
        <p className="mb-2 text-sm font-semibold text-white">The other way round: what your {KEY_NAMES[keyIdx]} harp plays</p>
        <ul className="space-y-1.5">
          {POSITIONS.map(p => (
            <li key={p.n} className="flex flex-wrap items-baseline justify-between gap-x-3 rounded-lg bg-white/[0.06] px-3 py-2 text-sm">
              <span className="font-bold text-white">{p.n}: {KEY_NAMES[(keyIdx + p.up) % 12]}</span>
              <span className="text-xs text-purple-200">{p.mode}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// ─── Beginner ─────────────────────────────────────────────────────────────────

function BeginnerTab({ sec, keyIdx }: { sec: string; keyIdx: number }) {
  if (sec === "harp") return (
    <div className="space-y-4">
      <Card title="The harp you want">
        <p>
          Start with a standard 10-hole <strong>diatonic harmonica in the key of C</strong>. It is the most common key, every method book assumes it, and
          all the tunes on this page are written for it. Entry-level harps from the main makers are fine. Skip the very cheap toy ones, because their
          reeds leak and drift out of tune.
        </p>
        <p>
          A diatonic harp is tuned in the <strong>Richter</strong> layout: each hole has two reeds, one you blow and one you draw. The layout is not a full
          scale in every direction, and that is on purpose. The notes are picked so that blowing gives you a chord and drawing gives you another.
        </p>
      </Card>
      <Card title="Hole by hole">
        <HoleDiagram keyIdx={keyIdx} />
        <Callout type="insight">
          <p>
            Holes 4 to 7 hold a full major scale: blow 4 is C, draw 4 is D, blow 5 is E, draw 5 is F, blow 6 is G, draw 6 is A, draw 7 is B and blow 7 is C.
            The low holes are missing a few notes, which is why most beginner tunes live in the middle.
          </p>
        </Callout>
      </Card>
      <Card title="How to read the tab">
        <Bullets items={[
          <><strong>4</strong> means blow hole 4. <strong>-4</strong> means draw hole 4.</>,
          <><strong>-3&apos;</strong> means draw hole 3 and bend it down a half step. Two marks (<strong>-3&apos;&apos;</strong>) is a whole step.</>,
          <><strong>4-6</strong> means blow holes 4, 5 and 6 together as a chord.</>,
          <>In the pictures, the top row is blow and the bottom row is draw. An empty beat means hold the note before it in a tune, or rest in a lick.</>,
        ]} />
        <p>The numbers do not change with the key of the harp. The same tab sounds in whatever key your harp is.</p>
      </Card>
      <Card title="Holding it">
        <Steps items={[
          "Low numbers on the left, hole numbers facing up so you can read them.",
          "Hold the harp between the thumb and first finger of your left hand, with your right hand free to cup it later.",
          "Keep your shoulders loose. Rest your elbows. If your wrists ache, you are squeezing too hard.",
        ]} />
      </Card>
      <Card title="Looking after it">
        <Bullets items={[
          "Do not play right after eating or drinking anything but water. Sugar and crumbs gum up the reeds.",
          "Play gently. Blowing or drawing hard bends reeds out of tune.",
          "Tap it out against your palm after playing, then store it in its case so it stays dry.",
          "Do not soak it or use hot water. Wooden combs swell and reeds can corrode.",
        ]} />
      </Card>
    </div>
  )

  if (sec === "breath") return (
    <div className="space-y-4">
      <Card title="Breathe from your belly">
        <p>
          Harmonica uses slow, full breaths. Breathe the way you do when you sigh, not the quick shallow way you do when you are nervous. Blowing is a
          gentle sigh out. Drawing is a soft sip in.
        </p>
        <Callout type="tip">
          <p>Play so quietly that someone in the next room could barely hear you. Reeds speak best to light air, and loud playing wastes breath.</p>
        </Callout>
      </Card>
      <Card title="One note at a time">
        <p>You need to play a single hole without touching its neighbors. There are two ways.</p>
        <Steps items={[
          <><strong>Pucker.</strong> Shape your lips like you are about to whistle or say &quot;oo&quot;. Put the harp so the hole is in the middle of your lips.</>,
          <><strong>Check it.</strong> Play blow 4. Slide to the next hole on each side. If hole 4 sounds muddy, two holes are open, so close your lips up.</>,
          <><strong>Tongue block (later).</strong> Cover the left holes with the flat of your tongue. This is a different, bigger sound and is covered under Intermediate.</>,
        ]} />
        <Callout type="exercise">
          <p>Play blow 4, draw 4, blow 4, draw 4. Go slowly. Both notes should be clean and the same loudness. Do this for two minutes.</p>
        </Callout>
      </Card>
      <Card title="When it sounds wrong">
        <Bullets items={[
          <><strong>Thin or whistling:</strong> your lips are too tight or you are blowing too hard.</>,
          <><strong>Two notes at once:</strong> your mouth is too wide. Pucker more.</>,
          <><strong>No sound on a draw:</strong> you are sucking air around the harp. Make a seal with your lips.</>,
          <><strong>Out of breath fast:</strong> you are using too much air. Soften it.</>,
        ]} />
      </Card>
    </div>
  )

  if (sec === "notes") return (
    <div className="space-y-4">
      <Card title="Warm-up: the middle of the harp">
        <p>Run up and down holes 4 to 7. This is a C major scale on a C harp.</p>
        <LickPlayer lick={SCALE_LICK} keyIdx={keyIdx} bpm={70} tonicLabel />
      </Card>
      <Card title="Five tunes">
        <p>Each tune uses holes you already know. Read the tab left to right. An empty beat means keep holding the note before it.</p>
        <div className="space-y-3">
          {TUNES.map(t => (
            <LickPlayer key={t.id} lick={tuneToLick(t)} keyIdx={keyIdx} bpm={90} tip={t.tip} tonicLabel />
          ))}
        </div>
        <Callout type="insight">
          <p>All five are public-domain melodies, written in 1st position. On a harp in any other key, the same tab is the same tune in that key.</p>
        </Callout>
      </Card>
    </div>
  )

  if (sec === "chords") return (
    <div className="space-y-4">
      <Card title="Playing chords">
        <p>
          Opening your mouth wide over three holes plays a chord. On a C harp, blow on holes 1 to 3 (or 4 to 6) is a C chord, and draw 1 to 3 is a G chord
          shape. That is why harp is so good for strumming along.
        </p>
        <div className="space-y-3">
          {CHORD_LICKS.map(l => <LickPlayer key={l.id} lick={l} keyIdx={keyIdx} bpm={80} />)}
        </div>
        <Callout type="tip">
          <p>Make a wider mouth, like saying &quot;aw&quot; with the harp held loosely against your lips. Breathe from your belly.</p>
        </Callout>
      </Card>
      <Card title="Rhythm is the point">
        <p>Chords on harp are mostly about the rhythm. Say the beat as you play: &quot;one and two and three and four and&quot;. Blow on the numbers, draw on the &quot;and&quot;.</p>
        <Callout type="exercise">
          <p>Tap your foot, count four beats, and play the in-out chug on holes 1 to 3 for a full minute without losing the beat.</p>
        </Callout>
      </Card>
    </div>
  )

  return (
    <div className="space-y-4">
      <Card title="Your first week">
        <p>Ten to fifteen minutes a day beats an hour once a week. Here is a simple plan.</p>
        <ol className="space-y-2">
          {[
            ["Day 1 and 2", "Single notes on holes 4 and 5. Blow and draw, slow and clean."],
            ["Day 3", "The scale on holes 4 to 7."],
            ["Day 4", "Mary Had a Little Lamb, slowly, then at a steady pace."],
            ["Day 5", "Twinkle, Twinkle and Ode to Joy."],
            ["Day 6", "The in-out chug on holes 1 to 3 for a full minute."],
            ["Day 7", "Play one tune through with the chug before and after it. Rest if your lips are sore."],
          ].map(([d, t]) => (
            <li key={d} className="flex gap-3 rounded-lg bg-white/[0.06] px-3 py-2">
              <span className="w-24 shrink-0 font-bold text-amber-200">{d}</span>
              <span className="min-w-0 flex-1">{t}</span>
            </li>
          ))}
        </ol>
        <Callout type="insight">
          <p>Ready to move on when you can play Mary Had a Little Lamb cleanly without looking at the holes and keep the chug steady for a minute.</p>
        </Callout>
      </Card>
    </div>
  )
}

// ─── Intermediate ─────────────────────────────────────────────────────────────

function IntermediateTab({ sec, keyIdx, fromJam }: { sec: string; keyIdx: number; fromJam?: JamLink }) {
  if (sec === "positions") return (
    <div className="space-y-4">
      <Card title="Positions: one harp, many keys">
        <p>
          A diatonic harp has one set of notes, but you can treat different notes as home. Each choice of home note is a <strong>position</strong>, and
          each position has its own sound. This is how one harp plays many songs.
        </p>
        <p>
          <strong>1st position</strong> treats the harp&apos;s own key as home. <strong>2nd position (cross harp)</strong> makes the home note a fifth above, and it
          is the position for most blues, rock and country.
        </p>
        <Callout type="tip">
          <p>Quick rule for cross harp: count up four letters from the song key. A song in G: G, A, B, C. Use a C harp.</p>
        </Callout>
      </Card>
      <Card title="Key finder">
        <KeyFinder keyIdx={keyIdx} startSong={fromJam?.song} startType={fromJam?.type} />
        <p className="text-xs text-white/60">For minor songs use the minor key itself. A song in A minor is key A, minor.</p>
      </Card>
      <Card title="The positions at a glance">
        <ul className="space-y-2">
          {POSITIONS.map(p => (
            <li key={p.n} className="rounded-xl bg-slate-950/50 p-3">
              <p className="text-sm font-bold text-white">{p.n}: {p.name} <span className="font-semibold text-purple-300">· {p.mode}</span></p>
              <p className="mt-1 text-sm text-white/75">{p.feel}</p>
              <p className="mt-1 text-xs text-amber-200">Home note: {p.home}</p>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )

  if (sec === "blues") return (
    <div className="space-y-4">
      <Card title="Cross harp on a C harp = key of G">
        <p>
          In 2nd position, <strong>draw 2</strong> is home. The G chord is <strong>draw 2-3-4</strong>, and the C chord is <strong>blow 2-3-4</strong>. Everything in this
          section is written for the key of G on a C harp.
        </p>
        <div className="space-y-3">
          {BLUES_CHORD_LICKS.map(l => <LickPlayer key={l.id} lick={l} keyIdx={keyIdx} bpm={80} />)}
        </div>
      </Card>
      <Card title="The 12-bar blues">
        <p>The most common form in blues and rock. Twelve bars, three chords.</p>
        <div className="grid grid-cols-4 gap-1.5">
          {BLUES_12.chords.map((c, i) => (
            <div key={i} className="rounded-lg bg-slate-950/60 py-2 text-center">
              <p className="text-[10px] text-white/50">Bar {i + 1}</p>
              <p className="text-base font-bold text-amber-200">{c}</p>
            </div>
          ))}
        </div>
        <p>Here is one short phrase for each chord, in G on a C harp. Land on these notes as each chord arrives.</p>
        <LickPlayer lick={BLUES_12_LICK} keyIdx={keyIdx} bpm={70} tonicLabel />
        <Callout type="insight">
          <p>The Bb on the G7 bars (draw 3, bent a half step) is the blue note. It sounds a little sour on purpose, and that is the blues.</p>
        </Callout>
      </Card>
      <Card title="Blues licks">
        <p>Short phrases to mix and match over the twelve bars. They all stay inside the blues scale.</p>
        <div className="space-y-3">
          {BLUES_LICKS.map(l => <LickPlayer key={l.id} lick={l} keyIdx={keyIdx} bpm={80} tonicLabel />)}
        </div>
      </Card>
    </div>
  )

  if (sec === "bending") return (
    <div className="space-y-4">
      <Card title="What a bend is">
        <p>
          A bend pulls a note down in pitch by changing the shape of your mouth, and it only works on certain holes. It is the main thing that makes harp
          sound like harp. It takes weeks to learn. Be patient.
        </p>
        <BendMap />
      </Card>
      <Card title="How to start on draw 4">
        <Steps items={[
          "Draw hole 4 cleanly. Keep it quiet.",
          "Keep drawing softly while you slowly change the shape inside your mouth. Try moving from an \"ee\" toward an \"oo\" or \"ow\" shape. Every player finds their own, so go slowly and experiment.",
          "Do not suck harder. Bending is mouth shape, not force.",
          "When it works the note sags down about a half step. Release back to the clean note.",
        ]} />
        <Callout type="warning">
          <p>If you feel the note choking out, ease off. Pushing hard breaks reeds. Soft air, shaped mouth.</p>
        </Callout>
      </Card>
      <Card title="Bend exercises">
        <div className="space-y-3">
          {BEND_LICKS.map(l => <LickPlayer key={l.id} lick={l} keyIdx={keyIdx} bpm={60} />)}
        </div>
        <p>Use the hole diagram under Beginner to hear the target pitch of any bend, then match it.</p>
      </Card>
    </div>
  )

  if (sec === "tongue") return (
    <div className="space-y-4">
      <Card title="Tongue blocking">
        <p>
          Open your mouth wide over four holes and cover the left three with your tongue. Only the right hole is open. The sound is fuller than puckering
          and it lets you do <strong>octaves</strong> and the rhythmic tricks you hear on old records.
        </p>
        <Steps items={[
          "Take in four holes with your mouth open wide.",
          "Lay your tongue flat over the left three holes.",
          "Blow and draw through the right hole only.",
          "Lift your tongue to play the whole chord, then close it again for the single note.",
        ]} />
      </Card>
      <Card title="Octaves">
        <p>Cover the two middle holes of a four-hole span with your tongue and play the two outer holes together. Blow 3 and blow 6 are an octave apart. The lick below plays draw 2, blow 3 and blow 6 one at a time so you can hear it: draw 2 and blow 3 are the same note, and blow 6 is one octave higher.</p>
        <LickPlayer lick={BLUES_LICKS.find(l => l.id === "l-octave")!} keyIdx={keyIdx} bpm={80} tonicLabel />
      </Card>
    </div>
  )

  return (
    <div className="space-y-4">
      <Card title="Playing with other people">
        <Bullets items={[
          "Ask the key of the song first. Then use the key finder to pick the right harp.",
          "Leave space. Harp is loud and stays in the same range as the singer. Play between the lines, not over them.",
          "Start with short phrases and repeat them. Repeating is what makes a lick sound like a plan.",
          "Listen to the bass and drums. Your chug should lock with the kick and snare.",
        ]} />
      </Card>
      <Card title="Practice with the Jam tools">
        <p>The Jam section builds chord charts and band guidance. Add harmonica to your band and it shows what the harp plays on each chord.</p>
        <div className="flex flex-wrap gap-2">
          <Link href="/jam" className="inline-flex min-h-12 items-center rounded-xl bg-purple-600 px-4 text-sm font-bold text-white">Open Jam</Link>
          <Link href="/jam/progressions" className="inline-flex min-h-12 items-center rounded-xl bg-white/10 px-4 text-sm font-bold text-purple-200">Chord progressions</Link>
        </div>
      </Card>
    </div>
  )
}

// ─── Advanced ─────────────────────────────────────────────────────────────────

function AdvancedTab({ sec, keyIdx }: { sec: string; keyIdx: number }) {
  if (sec === "modes") return (
    <div className="space-y-4">
      <Card title="3rd position: Dorian">
        <p>Home is draw 4. It gives a minor sound with a raised sixth, the sound of a lot of soul, funk and jazzy blues.</p>
        <div className="space-y-3">
          <LickPlayer lick={ADV_LICKS.find(l => l.id === "p3")!} keyIdx={keyIdx} bpm={80} tonicLabel />
          <LickPlayer lick={ADV_LICKS.find(l => l.id === "p3p")!} keyIdx={keyIdx} bpm={80} tonicLabel />
        </div>
      </Card>
      <Card title="4th position: natural minor">
        <p>Home is draw 6. Darker than 3rd, and a good fit for slow minor songs.</p>
        <LickPlayer lick={ADV_LICKS.find(l => l.id === "p4")!} keyIdx={keyIdx} bpm={70} tonicLabel />
      </Card>
      <Card title="12th position: Lydian">
        <p>Home is draw 5. A bright major with a raised fourth. A little dreamy.</p>
        <LickPlayer lick={ADV_LICKS.find(l => l.id === "p12")!} keyIdx={keyIdx} bpm={80} tonicLabel />
      </Card>
    </div>
  )

  if (sec === "solo") return (
    <div className="space-y-4">
      <Card title="Build solos from a motif">
        <p>A good solo is a short idea, repeated and changed. Play the hook, then change one note or the ending.</p>
        <LickPlayer lick={ADV_LICKS.find(l => l.id === "motif")!} keyIdx={keyIdx} bpm={80} tonicLabel />
      </Card>
      <Card title="Call and response">
        <p>Play a phrase, leave space, then answer it. Imagine the band as the other half of the conversation.</p>
        <LickPlayer lick={BLUES_LICKS.find(l => l.id === "l-call")!} keyIdx={keyIdx} bpm={80} tonicLabel />
      </Card>
      <Card title="Target the chord changes">
        <p>Land on a note that belongs to each chord at the moment it arrives. In G on a C harp:</p>
        <Bullets items={[
          <><strong>G7:</strong> draw 2 (G), blow 3 (G), draw 3 (B, the 3rd) and draw 4 (D). Bend draw 3 down and it becomes the blue note.</>,
          <><strong>C7:</strong> blow 4 (C), blow 5 (E), blow 6 (G), and draw 3 bent (Bb).</>,
          <><strong>D7:</strong> draw 4 (D), draw 6 (A) and blow 4 (C). Draw 5 (F) is a blues passing note here. A C harp has no F#.</>,
        ]} />
        <Callout type="exercise">
          <p>Play the 12-bar phrase from Intermediate, then make up your own two-note landing for each chord.</p>
        </Callout>
      </Card>
    </div>
  )

  if (sec === "effects") return (
    <div className="space-y-4">
      <Card title="Hand wah">
        <p>Cup your right hand around the harp and open and close it. Closed, the sound is dull and &quot;oo&quot;-like. Open, it is bright and &quot;ah&quot;-like. Say &quot;wah-wah&quot; as you do it. Practice on a held note first, then add it to a rhythm.</p>
      </Card>
      <Card title="Vibrato">
        <p>Three kinds: <strong>throat</strong> (a gentle pulse in the throat), <strong>diaphragm</strong> (a pulse from the belly, slow and wide) and <strong>hand</strong> (pulse the cup of your hand). Start with a single held note and aim for an even speed.</p>
      </Card>
      <Card title="Tongue effects">
        <Bullets items={[
          <><strong>Slap:</strong> play a single note with your tongue blocking the other holes, then snap the tongue off so the whole chord pops out for an instant.</>,
          <><strong>Trill:</strong> rock the harp quickly back and forth between two neighboring holes.</>,
        ]} />
      </Card>
    </div>
  )

  if (sec === "overblow") return (
    <div className="space-y-4">
      <Card title="What overblows and overdraws are">
        <p>
          A standard harp is missing some notes. <strong>Overblows</strong> (holes 1 to 6) and <strong>overdraws</strong> (holes 7 to 10) are advanced techniques that
          produce those missing notes, so you can play every note in the scale. Shaping your mouth makes the reed for the opposite breath sound, at a pitch above both of the normal notes in that hole.
        </p>
        <Callout type="warning">
          <p>These are very hard. Most players need months or years. Learn clean bends first.</p>
        </Callout>
      </Card>
      <Card title="What you need">
        <Bullets items={[
          "Clean, controlled bends first.",
          "A well-set harp. Leaky or loosely set reeds will not work. Many players get a custom-set harp or learn to adjust reed gaps.",
          "Short, patient practice sessions.",
        ]} />
      </Card>
    </div>
  )

  return (
    <div className="space-y-4">
      <Card title="A weekly rotation">
        <ol className="space-y-2">
          {[
            ["Mon", "Tone: long notes on every hole, quiet and even."],
            ["Tue", "Bends: draw 2, 3 and 4. Check pitch against the hole diagram."],
            ["Wed", "Positions: one scale in 2nd, 3rd and 4th."],
            ["Thu", "Rhythm: chug and shuffle with a metronome."],
            ["Fri", "Solo: 12-bar blues with a backing from the Jam section."],
            ["Sat", "Learn one song by ear."],
            ["Sun", "Rest or play for fun."],
          ].map(([d, t]) => (
            <li key={d} className="flex gap-3 rounded-lg bg-white/[0.06] px-3 py-2">
              <span className="w-10 shrink-0 font-bold text-amber-200">{d}</span>
              <span className="min-w-0 flex-1">{t}</span>
            </li>
          ))}
        </ol>
      </Card>
      <Card>
        <p className="text-xs text-white/60">
          Everything on this page is written for a standard Richter-tuned diatonic harmonica. Other tunings, like country tuning or natural minor harps, change the notes.
          Tabs and sounds are built from the note layout and are not recorded from a real harp.
        </p>
      </Card>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

interface JamLink { song: number; type: "major" | "minor" }

function jamLinkFrom(params: URLSearchParams): JamLink | undefined {
  const key = params.get("key")
  if (key === null || !/^\d{1,2}$/.test(key) || Number(key) > 11) return undefined
  return { song: Number(key), type: params.get("mode") === "minor" ? "minor" : "major" }
}

export default function HarmonicaPage() {
  return (
    <Suspense fallback={null}>
      <HarmonicaInner />
    </Suspense>
  )
}

function HarmonicaInner() {
  const fromJam = jamLinkFrom(useSearchParams())
  const [level, setLevel] = useState<Level>(fromJam ? "intermediate" : "beginner")
  const [secs, setSecs] = useState<Record<Level, string>>({ beginner: "harp", intermediate: "positions", advanced: "modes" })
  const [keyIdx, setKeyIdx] = useState(0)
  const sec = secs[level]
  const sound = useSyncExternalStore(onSoundStatus, soundStatus, () => "synth" as const)

  useEffect(() => {
    window.addEventListener("click", preloadSound, { once: true })
    return () => window.removeEventListener("click", preloadSound)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:py-8">
        <Link href="/" className="mb-2 inline-flex min-h-11 items-center text-sm text-purple-300 hover:text-purple-200">← Back to Home</Link>
        <h1 className="mb-1 text-3xl font-bold text-white sm:text-4xl">Harmonica</h1>
        <p className="mb-5 text-purple-300">The 10-hole blues harp, from your first note to soloing over a band</p>

        {fromJam && (
          <p className="mb-5 rounded-2xl border border-amber-400/40 bg-amber-400/10 p-3 text-sm text-amber-100">
            From Jam: your song is in {KEY_NAMES[fromJam.song]} {fromJam.type}. The key finder below shows which harp to bring.
            {" "}<Link href="/jam" className="font-semibold underline">Back to Jam</Link>
          </p>
        )}

        <div className="mb-5 flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
          <label htmlFor="harp-key" className="text-sm font-semibold text-white">My harp</label>
          <select
            id="harp-key"
            value={keyIdx}
            onChange={e => { stopAll(); setKeyIdx(Number(e.target.value)) }}
            className="min-h-12 rounded-xl border border-white/20 bg-slate-900 px-3 text-base text-white"
          >
            {KEY_NAMES.map((k, i) => <option key={k} value={i}>{k}</option>)}
          </select>
          <p className="min-w-0 flex-1 text-xs text-white/60">Notes and sounds follow your harp. The tab stays the same.</p>
          <p className="w-full text-xs text-white/60" role="status">
            {sound === "samples" && "Sound: real harmonica recording."}
            {sound === "loading" && "Sound: loading the harmonica recording (about 3 MB). Basic tones play until it is ready."}
            {sound === "synth" && "Sound: basic tones until the harmonica recording loads."}
            {" "}On an iPhone, turn the ring switch to ring or you will hear nothing.
          </p>
        </div>

        <div className="mb-2 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Level">
          {LEVELS.map(l => (
            <button
              key={l.id}
              type="button"
              role="tab"
              aria-selected={level === l.id}
              onClick={() => { stopAll(); setLevel(l.id) }}
              className={`min-h-12 shrink-0 whitespace-nowrap rounded-xl px-4 text-sm font-semibold transition-all ${level === l.id ? "bg-purple-600 text-white" : "bg-white/10 text-purple-200 hover:bg-white/20"}`}
            >
              {l.label}
            </button>
          ))}
        </div>
        <p className="mb-4 text-sm text-purple-200">{LEVELS.find(l => l.id === level)!.blurb}</p>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
          {SECTIONS[level].map(s => (
            <button
              key={s.id}
              type="button"
              onClick={() => { stopAll(); setSecs(p => ({ ...p, [level]: s.id })) }}
              aria-pressed={sec === s.id}
              className={`min-h-11 shrink-0 whitespace-nowrap rounded-lg px-3 text-sm font-semibold transition-all ${sec === s.id ? "bg-amber-500 text-slate-900" : "bg-white/10 text-purple-300 hover:bg-white/20"}`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {level === "beginner" && <BeginnerTab sec={sec} keyIdx={keyIdx} />}
        {level === "intermediate" && <IntermediateTab sec={sec} keyIdx={keyIdx} fromJam={fromJam} />}
        {level === "advanced" && <AdvancedTab sec={sec} keyIdx={keyIdx} />}
      </div>
    </div>
  )
}
