"use client"

import Link from "next/link"
import type { ReactNode } from "react"

export function Panel({ title, children, className = "" }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-white/15 bg-white/[0.06] p-4 ${className}`}>
      {title && <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-purple-300">{title}</h2>}
      {children}
    </section>
  )
}

export function Chip({
  active, onClick, children, className = "", ariaLabel,
}: { active?: boolean; onClick?: () => void; children: ReactNode; className?: string; ariaLabel?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={ariaLabel}
      className={`min-h-12 min-w-12 select-none rounded-xl border px-3 text-base font-semibold transition-colors active:scale-95 ${
        active
          ? "border-amber-400 bg-amber-400 text-slate-950"
          : "border-white/20 bg-white/10 text-white active:bg-white/20"
      } ${className}`}
    >
      {children}
    </button>
  )
}

export function BigButton({
  onClick, children, tone = "primary", className = "", disabled, ariaLabel,
}: { onClick?: () => void; children: ReactNode; tone?: "primary" | "ghost" | "danger"; className?: string; disabled?: boolean; ariaLabel?: string }) {
  const tones = {
    primary: "bg-amber-400 text-slate-950 active:bg-amber-300",
    ghost: "border border-white/25 bg-white/10 text-white active:bg-white/20",
    danger: "border border-red-400/50 bg-red-500/15 text-red-200 active:bg-red-500/30",
  }
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`min-h-14 select-none rounded-2xl px-5 text-lg font-bold transition-transform active:scale-[0.97] disabled:opacity-40 ${tones[tone]} ${className}`}
    >
      {children}
    </button>
  )
}

export function Hint({ children }: { children: ReactNode }) {
  return <p className="text-sm leading-relaxed text-purple-200">{children}</p>
}

export const inputClass =
  "w-full rounded-xl border border-white/25 bg-slate-900 px-4 py-3 text-base text-white placeholder:text-white/40 focus:border-amber-400 focus:outline-none"

export function NextSteps({ items }: { items: { href: string; label: string }[] }) {
  return (
    <nav aria-label="Next steps" className="rounded-2xl border border-white/15 bg-white/[0.04] p-3">
      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-purple-300">Where to next</p>
      <div className="flex flex-wrap gap-2">
        {items.map(i => (
          <Link key={i.href} href={i.href} className="inline-flex min-h-12 items-center rounded-xl border border-white/20 bg-white/10 px-3 text-base font-semibold text-white active:scale-95 active:bg-white/20">
            {i.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
