"use client"

import { Chip } from "./ui"
import { FLAT_NAMES, SHARP_NAMES, prefersFlats, type KeyRef } from "@/lib/jam/theory"

export default function KeyPicker({
  value, onChange, allowMinor = true, label = "Key",
}: { value: KeyRef; onChange: (k: KeyRef) => void; allowMinor?: boolean; label?: string }) {
  const flats = prefersFlats(value)
  const names = flats ? FLAT_NAMES : SHARP_NAMES
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-purple-300">{label}</span>
        {allowMinor && (
          <div className="flex gap-1.5">
            <Chip active={!value.minor} onClick={() => onChange({ ...value, minor: false })} className="min-h-10 text-sm">Major</Chip>
            <Chip active={value.minor} onClick={() => onChange({ ...value, minor: true })} className="min-h-10 text-sm">Minor</Chip>
          </div>
        )}
      </div>
      <div className="grid grid-cols-6 gap-1.5">
        {names.map((n, i) => (
          <Chip key={i} active={value.root === i} onClick={() => onChange({ ...value, root: i })} className="px-0">
            {n}
          </Chip>
        ))}
      </div>
    </div>
  )
}
