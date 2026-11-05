import { BAND_KEY, CHARTS_KEY, SETLIST_KEY, makeChart, parseCharts, parseSetlist, readJSON, writeJSON, type SavedChart, type SetlistItem } from "./storage"

export function chartToText(c: SavedChart): string {
  return `${c.title}\nKey: ${c.key}\n\n${c.body.trim()}\n`
}

export function textToChart(text: string): SavedChart | null {
  const lines = text.replace(/\r/g, "").split("\n")
  while (lines.length && lines[0].trim() === "") lines.shift()
  if (lines.length < 2) return null
  const title = lines[0].trim().slice(0, 80)
  const keyMatch = /^key:\s*([A-G][#b]?m?)\s*$/i.exec(lines[1].trim())
  const body = (keyMatch ? lines.slice(2) : lines.slice(1)).join("\n").trim()
  if (!title || !body) return null
  return makeChart({ title, key: keyMatch ? keyMatch[1][0].toUpperCase() + keyMatch[1].slice(1) : "G", genre: "general", body })
}

export function setlistToText(items: SetlistItem[], name = "Setlist"): string {
  const rows = items.map((s, i) => {
    const bits = [s.key, s.capo ? `capo ${s.capo}` : "", s.bpm ? `${s.bpm} bpm` : ""].filter(Boolean).join(", ")
    return `${i + 1}. ${s.title}${bits ? ` (${bits})` : ""}${s.notes ? `\n   ${s.notes.replace(/\n/g, " ")}` : ""}`
  })
  return `${name}\n\n${rows.join("\n")}\n`
}

export async function shareText(title: string, text: string): Promise<"shared" | "copied" | "failed"> {
  try {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      await navigator.share({ title, text })
      return "shared"
    }
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") return "failed"
  }
  try {
    await navigator.clipboard.writeText(text)
    return "copied"
  } catch {
    return "failed"
  }
}

const BACKUP_TAG = "guitar-lab-jam-backup"

export function exportBackup(): string {
  const data: Record<string, unknown> = {}
  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i)
      if (k && k.startsWith("jam.")) {
        const raw = window.localStorage.getItem(k)
        if (raw !== null) data[k] = JSON.parse(raw)
      }
    }
  } catch {
    // unreadable storage: export what we have
  }
  return JSON.stringify({ app: BACKUP_TAG, version: 1, saved: new Date().toISOString(), data }, null, 2)
}

export interface ImportResult {
  ok: boolean
  message: string
}

// Adds charts and setlist songs that are not here yet. Never overwrites what is on this device.
export function importBackup(text: string): ImportResult {
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    return { ok: false, message: "That file is not a Guitar Lab backup." }
  }
  const root = parsed as { app?: unknown; data?: unknown }
  if (!root || root.app !== BACKUP_TAG || typeof root.data !== "object" || root.data === null) {
    return { ok: false, message: "That file is not a Guitar Lab backup." }
  }
  const data = root.data as Record<string, unknown>

  const incomingCharts = parseCharts(data[CHARTS_KEY]) ?? []
  const haveCharts = readJSON<SavedChart[]>(CHARTS_KEY, [], parseCharts)
  const chartIds = new Set(haveCharts.map(c => c.id))
  const newCharts = incomingCharts.filter(c => !chartIds.has(c.id))
  if (newCharts.length) writeJSON(CHARTS_KEY, [...haveCharts, ...newCharts])

  const incomingSet = parseSetlist(data[SETLIST_KEY]) ?? []
  const haveSet = readJSON<SetlistItem[]>(SETLIST_KEY, [], parseSetlist)
  const setIds = new Set(haveSet.map(s => s.id))
  const newSongs = incomingSet.filter(s => !setIds.has(s.id))
  if (newSongs.length) writeJSON(SETLIST_KEY, [...haveSet, ...newSongs])

  let restoredBand = false
  if (data[BAND_KEY] !== undefined && window.localStorage.getItem(BAND_KEY) === null) {
    writeJSON(BAND_KEY, data[BAND_KEY])
    restoredBand = true
  }

  const parts = [
    `${newCharts.length} new chart${newCharts.length === 1 ? "" : "s"}`,
    `${newSongs.length} new setlist song${newSongs.length === 1 ? "" : "s"}`,
  ]
  if (restoredBand) parts.push("your band setup")
  return { ok: true, message: `Added ${parts.join(", ")}. Nothing on this device was replaced.` }
}


