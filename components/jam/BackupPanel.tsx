"use client"

import { useRef, useState } from "react"
import { exportBackup, importBackup } from "@/lib/jam/share"
import { Hint } from "./ui"

export default function BackupPanel() {
  const fileRef = useRef<HTMLInputElement>(null)
  const [msg, setMsg] = useState("")
  const [bad, setBad] = useState(false)

  function download() {
    const blob = new Blob([exportBackup()], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `guitar-lab-backup-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    setBad(false)
    setMsg("Backup saved to your downloads.")
  }

  async function restore(file: File | undefined) {
    if (!file) return
    const r = importBackup(await file.text())
    setBad(!r.ok)
    setMsg(r.message)
    if (fileRef.current) fileRef.current.value = ""
  }

  const btn = "min-h-12 rounded-xl border border-white/20 bg-white/10 px-4 text-base font-semibold text-white active:scale-95 active:bg-white/20"
  return (
    <div>
      <Hint>Your charts and setlist live on this device. Save a backup file to keep them safe or move them to another phone.</Hint>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className={btn} onClick={download}>Save a backup</button>
        <button type="button" className={btn} onClick={() => fileRef.current?.click()}>Restore from a backup</button>
        <input ref={fileRef} id="jam-restore" type="file" accept="application/json,.json" className="sr-only" tabIndex={-1} aria-label="Choose a backup file" onChange={e => restore(e.target.files?.[0])} />
      </div>
      <p role="status" aria-live="polite" className={`mt-2 text-sm font-semibold ${bad ? "text-red-300" : "text-amber-300"}`}>{msg}</p>
    </div>
  )
}
