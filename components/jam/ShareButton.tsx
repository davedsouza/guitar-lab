"use client"

import { useState } from "react"
import { shareText } from "@/lib/jam/share"

export default function ShareButton({
  title, getText, label = "Share", className = "",
}: { title: string; getText: () => string; label?: string; className?: string }) {
  const [msg, setMsg] = useState("")
  async function go() {
    const r = await shareText(title, getText())
    setMsg(r === "copied" ? "Copied. Paste it anywhere." : r === "shared" ? "Shared." : "Could not share from here.")
    window.setTimeout(() => setMsg(""), 3500)
  }
  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={go}
        className={`min-h-12 min-w-12 select-none rounded-xl border border-white/20 bg-white/10 px-3 text-base font-semibold text-white active:scale-95 active:bg-white/20 ${className}`}
      >
        {label}
      </button>
      <span role="status" aria-live="polite" className="text-sm font-semibold text-amber-300">{msg}</span>
    </span>
  )
}
