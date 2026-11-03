"use client"

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react"

/** Turns whatever was saved into a safe value, or null if it is the wrong shape. */
export type Parser<T> = (raw: unknown) => T | null

const listeners = new Set<() => void>()
const memory = new Map<string, string>()

function subscribe(cb: () => void) {
  listeners.add(cb)
  window.addEventListener("storage", cb)
  return () => {
    listeners.delete(cb)
    window.removeEventListener("storage", cb)
  }
}

function readRaw(key: string): string | null {
  const held = memory.get(key)
  if (held !== undefined) return held
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeRaw(key: string, raw: string) {
  try {
    window.localStorage.setItem(key, raw)
    memory.delete(key)
  } catch {
    // storage full or blocked (private mode): keep it for this visit so the app still works
    memory.set(key, raw)
  }
  listeners.forEach(l => l())
}

function parseRaw<T>(raw: string | null, fallback: T, parse?: Parser<T>): T {
  if (raw == null) return fallback
  try {
    const v: unknown = JSON.parse(raw)
    if (!parse) return v as T
    const ok = parse(v)
    return ok === null ? fallback : ok
  } catch {
    return fallback
  }
}

export function readJSON<T>(key: string, fallback: T, parse?: Parser<T>): T {
  return parseRaw(readRaw(key), fallback, parse)
}

export function writeJSON(key: string, value: unknown) {
  writeRaw(key, JSON.stringify(value))
}

const noopSubscribe = () => () => {}

export function useLocalState<T>(
  key: string,
  initial: T,
  parse?: Parser<T>
): [T, (v: T | ((prev: T) => T)) => void, boolean] {
  const [fallback] = useState(initial)
  const raw = useSyncExternalStore(subscribe, () => readRaw(key), () => null)
  const loaded = useSyncExternalStore(noopSubscribe, () => true, () => false)
  const value = useMemo(() => parseRaw(raw, fallback, parse), [raw, fallback, parse])

  const set = useCallback(
    (v: T | ((prev: T) => T)) => {
      const prev = parseRaw(readRaw(key), fallback, parse)
      const next = typeof v === "function" ? (v as (p: T) => T)(prev) : v
      writeJSON(key, next)
    },
    [key, fallback, parse]
  )

  return [value, set, loaded]
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4)
}

export interface SavedChart {
  id: string
  title: string
  key: string
  genre: string
  body: string
  updated: number
}

export interface SetlistItem {
  id: string
  title: string
  key: string
  capo: number
  bpm: number | null
  notes: string
  chartId: string | null
}

export const CHARTS_KEY = "jam.charts.v1"
export const SETLIST_KEY = "jam.setlist.v1"
export const BAND_KEY = "jam.band.v1"
export const LAST_KEY = "jam.lastKey.v1"

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v)
const str = (v: unknown, d = "") => (typeof v === "string" ? v : d)

export const parseCharts: Parser<SavedChart[]> = raw => {
  if (!Array.isArray(raw)) return null
  return raw.filter(isObj).map(c => ({
    id: str(c.id) || uid(),
    title: str(c.title, "Untitled"),
    key: str(c.key, "G"),
    genre: str(c.genre, "general"),
    body: str(c.body),
    updated: typeof c.updated === "number" ? c.updated : 0,
  }))
}

export const parseSetlist: Parser<SetlistItem[]> = raw => {
  if (!Array.isArray(raw)) return null
  return raw.filter(isObj).map(i => ({
    id: str(i.id) || uid(),
    title: str(i.title, "Untitled"),
    key: str(i.key, "G"),
    capo: typeof i.capo === "number" ? i.capo : 0,
    bpm: typeof i.bpm === "number" ? i.bpm : null,
    notes: str(i.notes),
    chartId: typeof i.chartId === "string" ? i.chartId : null,
  }))
}

export const parseFont: Parser<number> = raw => (typeof raw === "number" && raw >= 12 && raw <= 64 ? raw : null)

export function makeChart(fields: Omit<SavedChart, "id" | "updated">): SavedChart {
  return { ...fields, id: uid(), updated: Date.now() }
}

export function prependChart(chart: SavedChart) {
  writeJSON(CHARTS_KEY, [chart, ...readJSON<SavedChart[]>(CHARTS_KEY, [], parseCharts)])
}

export function useWakeLock(active: boolean) {
  useEffect(() => {
    if (!active || typeof navigator === "undefined" || !("wakeLock" in navigator)) return
    let lock: WakeLockSentinel | null = null
    let cancelled = false
    const request = async () => {
      try {
        const l = await navigator.wakeLock.request("screen")
        if (cancelled) l.release().catch(() => {})
        else lock = l
      } catch {
        // wake lock can be refused when the tab is hidden or battery is low
      }
    }
    request()
    const onVis = () => document.visibilityState === "visible" && request()
    document.addEventListener("visibilitychange", onVis)
    return () => {
      cancelled = true
      document.removeEventListener("visibilitychange", onVis)
      lock?.release().catch(() => {})
    }
  }, [active])
}
