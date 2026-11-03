"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LEARNING_PATHS, PATH_KEY } from "@/lib/learningPaths"
import { useLocalState } from "@/lib/jam/storage"

const parseTitle = (raw: unknown) => (typeof raw === "string" ? raw : null)

// Top-right "next lesson" button for the learning path the learner is following.
// A module that sits in several paths only shows it once a path has been picked on the home page.
export default function NextLesson() {
  const pathname = usePathname()
  const [active, setActive] = useLocalState<string>(PATH_KEY, "", parseTitle)

  const containing = LEARNING_PATHS.filter(p => p.steps.some(s => s.href === pathname))
  const path = containing.find(p => p.title === active) ?? (containing.length === 1 ? containing[0] : null)
  if (!path) return null

  const i = path.steps.findIndex(s => s.href === pathname)
  const next = path.steps[i + 1]
  const cls =
    "flex min-h-10 shrink-0 items-center gap-1 whitespace-nowrap rounded-lg bg-amber-500 px-3 py-1.5 text-sm font-bold text-slate-950 transition-colors hover:bg-amber-400"
  const title = `${path.title} path, lesson ${i + 1} of ${path.steps.length}`

  if (!next) {
    return (
      <Link href="/" title={title} className={cls}>
        Finish path <span aria-hidden>✓</span>
      </Link>
    )
  }
  return (
    <Link href={next.href} title={title} onClick={() => setActive(path.title)} className={cls}>
      <span className="sm:hidden">Next</span>
      <span className="hidden sm:inline lg:hidden">Next lesson</span>
      <span className="hidden lg:inline">Next: {next.label}</span>
      <span aria-hidden>→</span>
    </Link>
  )
}
