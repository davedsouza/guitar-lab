# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server on port 3005
npm run build    # Production build
npm run lint     # ESLint
```

No test suite is configured.

## Architecture

Next.js 16 App Router. Every route is `app/<module>/page.tsx`. There is no shared page-level layout beyond `app/layout.tsx` (which only sets fonts and metadata) — no global navbar, no shared sidebar.

**Every page file must start with `"use client"`** — all modules use React state.

### Module pattern

Each module is a single self-contained file following this structure:

1. **Tab type union** — `type Tab = "overview" | "technique" | ...`
2. **`TABS` array** — `{ id: Tab; label: string; emoji?: string }[]`
3. **Local helper components** defined inline in the same file (not imported):
   - `Callout` — coloured left-border box with a label. Types: `tip | warning | insight | exercise | quote`
   - `Card` — `bg-white/5 border border-white/10 rounded-2xl` container with a title
   - `TabBlock` — monospace TAB notation block (`text-green-300 bg-black/40`)
4. **One function per tab** (`function OverviewTab() { ... }`)
5. **Default export** — renders the page chrome (back link, header, tab pills, active tab component)

Do not extract helper components to `components/` unless they render SVG/canvas (like `ChordDiagram`). Inline helpers are the convention.

### Shared components (`components/`)

Only four exist — all render visual diagrams:
- `ChordDiagram` — SVG chord grid. Props: `chordName`, `fingers: (number|string)[]`, `size?: 'small'|'medium'|'large'`
- `FullChordFretboard`, `FullFretboardDiagram`, `ScaleDiagram`

### Shared lib (`lib/`)

- `chordShapes.ts` — `CHORD_VOICINGS` record + `getChordShape(root, quality, voicingIndex)` + `getChordVoicings(root, quality)`. Quality keys: `"Major" | "Minor" | "Dominant 7th" | "Major 7th" | "Minor 7th" | "Diminished"`. Strip `/` from root before passing.
- `scalePatterns.ts` — `SCALE_TYPES`, `NOTES`, `getScaleNotes(root, scaleType)`
- `beginnerData.ts` — static content for the beginner module

### Homepage (`app/page.tsx`)

Maintains a `MODULES` array (one entry per route) and a `LEARNING_PATHS` array. **When adding a new module, add an entry to both arrays.**

## Styling conventions

- Background: `bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900`
- Primary accent: `purple-*` (tabs, borders, highlights)
- Secondary accent: `amber-500` (interactive highlights, active states)
- Glass cards: `bg-white/10 border border-white/20 rounded-2xl`
- Body text: `text-purple-200` or `text-white/70`
- Tailwind CSS v4 — use `@import "tailwindcss"` syntax, not `@tailwind` directives
- Path alias `@/` resolves to the project root

## Adding a new module

1. Create `app/<slug>/page.tsx` — copy the tab structure from an existing module
2. Add an entry to `MODULES` and optionally `LEARNING_PATHS` in `app/page.tsx`
3. The only external audio dependency is `soundfont-player` (already installed)
