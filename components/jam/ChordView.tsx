"use client"

import ChordDiagram from "@/components/ChordDiagram"
import type { ChordVoicing } from "@/lib/chordShapes"
import { fingersText, tabLines } from "@/lib/jam/theory"

const DIFF_COLOR: Record<string, string> = {
  beginner: "text-emerald-300",
  intermediate: "text-amber-300",
  advanced: "text-red-300",
}

export function TabText({ fingers, className = "" }: { fingers: (number | string)[]; className?: string }) {
  return (
    <pre className={`overflow-x-auto rounded-xl bg-black/60 p-3 font-mono text-lg leading-snug text-green-300 ${className}`} aria-label={`Tab: ${fingersText(fingers)}`}>
      {tabLines(fingers).join("\n")}
    </pre>
  )
}

export default function ChordView({
  name, fingers, size = "large", showTab = true,
}: { name: string; fingers: (number | string)[]; size?: "small" | "medium" | "large"; showTab?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <ChordDiagram chordName={name} fingers={fingers} size={size} />
      {showTab && <TabText fingers={fingers} />}
    </div>
  )
}

export function ChordCard({
  name, voicings, index, onIndex, size = "large",
}: { name: string; voicings: ChordVoicing[]; index: number; onIndex: (i: number) => void; size?: "small" | "medium" | "large" }) {
  const current = voicings[Math.min(index, voicings.length - 1)]
  if (!current) return <p className="text-base text-white/80">No shape saved for {name} yet.</p>
  return (
    <div>
      <div className="flex flex-col items-center gap-4">
        <ChordDiagram chordName={name} fingers={current.fingers} size={size} />
        <div className="w-full">
          <TabText fingers={current.fingers} />
          <p className="mt-2 text-center font-mono text-sm text-white/60">E A D G B e · {fingersText(current.fingers)}</p>
        </div>
        <p className="text-sm text-white/80">
          {current.position} · <span className={DIFF_COLOR[current.difficulty]}>{current.difficulty}</span>
        </p>
      </div>
      {voicings.length > 1 && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-purple-300">Other ways to play it ({voicings.length})</p>
          <div className="grid grid-cols-3 gap-2">
            {voicings.map((v, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onIndex(i)}
                aria-pressed={i === index}
                className={`min-h-14 rounded-xl border p-2 text-xs font-semibold ${
                  i === index ? "border-amber-400 bg-amber-400 text-slate-950" : "border-white/20 bg-white/10 text-white"
                }`}
              >
                {v.position.replace(" (Barre)", "")}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
