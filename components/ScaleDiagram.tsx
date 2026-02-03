interface ScaleDiagramProps {
  scaleName: string
  pattern: number[][] // [string index][fret offsets]
  rootNote: string
  startFret: number
  rootString?: number
  size?: 'small' | 'medium' | 'large'
  showNoteNames?: boolean
}

const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
const STRING_TUNING = [4, 9, 2, 7, 11, 4] // E A D G B e in semitones from C

export default function ScaleDiagram({
  scaleName,
  pattern,
  rootNote,
  startFret,
  rootString,
  size = 'large',
  showNoteNames = true
}: ScaleDiagramProps) {
  const strings = 6
  const numFrets = 5 // Show 5 frets

  const sizeClasses = {
    small: { width: 140, height: 160, stringGap: 22, fretGap: 24 },
    medium: { width: 180, height: 200, stringGap: 28, fretGap: 32 },
    large: { width: 240, height: 260, stringGap: 38, fretGap: 42 }
  }

  const dims = sizeClasses[size]
  const startX = 30
  const startY = 50

  // Helper function to get note at specific string and fret
  const getNoteAtFret = (stringIndex: number, fret: number): string => {
    const openStringNote = STRING_TUNING[stringIndex]
    const noteIndex = (openStringNote + fret) % 12
    return NOTES[noteIndex]
  }

  // Calculate absolute fret positions for each note in the pattern
  const notePositions: { string: number; fret: number; isRoot: boolean; noteName: string }[] = []

  pattern.forEach((stringPattern, stringIndex) => {
    stringPattern.forEach((fretOffset) => {
      const absoluteFret = startFret + fretOffset
      const isRoot = rootString === stringIndex && fretOffset === 0
      const noteName = getNoteAtFret(stringIndex, absoluteFret)
      notePositions.push({
        string: stringIndex,
        fret: absoluteFret,
        isRoot,
        noteName
      })
    })
  })

  return (
    <div className="flex flex-col items-center">
      <div className="text-white font-bold mb-3 text-center text-lg">{scaleName}</div>
      <svg width={dims.width} height={dims.height} className="bg-gradient-to-br from-amber-900/20 to-amber-700/10 rounded-xl border border-amber-600/30">
        {/* Nut (thick line at top if showing fret 0) */}
        {startFret === 0 && (
          <line
            x1={startX}
            y1={startY}
            x2={startX + (strings - 1) * dims.stringGap}
            y2={startY}
            stroke="white"
            strokeWidth="5"
          />
        )}

        {/* Fret number indicator */}
        {startFret > 0 && (
          <text
            x={startX - 20}
            y={startY + dims.fretGap / 2}
            fill="white"
            fontSize="14"
            fontWeight="bold"
            textAnchor="middle"
          >
            {startFret}
          </text>
        )}

        {/* Strings (vertical lines) */}
        {Array.from({ length: strings }).map((_, i) => (
          <line
            key={`string-${i}`}
            x1={startX + i * dims.stringGap}
            y1={startY}
            x2={startX + i * dims.stringGap}
            y2={startY + numFrets * dims.fretGap}
            stroke="white"
            strokeWidth="2"
            opacity="0.7"
          />
        ))}

        {/* Frets (horizontal lines) */}
        {Array.from({ length: numFrets + 1 }).map((_, i) => (
          <line
            key={`fret-${i}`}
            x1={startX}
            y1={startY + i * dims.fretGap}
            x2={startX + (strings - 1) * dims.stringGap}
            y2={startY + i * dims.fretGap}
            stroke="white"
            strokeWidth={i === 0 ? "3" : "1.5"}
            opacity="0.6"
          />
        ))}

        {/* Scale notes */}
        {notePositions.map((note, index) => {
          const fretPosition = note.fret - startFret

          // Only show notes that fall within our display range
          if (fretPosition < 0 || fretPosition > numFrets) {
            return null
          }

          const x = startX + note.string * dims.stringGap
          const y = startY + fretPosition * dims.fretGap - dims.fretGap / 2

          return (
            <g key={`note-${index}`}>
              {/* Note circle */}
              <circle
                cx={x}
                cy={y}
                r={note.isRoot ? 12 : 10}
                fill={note.isRoot ? "#f59e0b" : "#8b5cf6"}
                stroke="white"
                strokeWidth="2"
                opacity="0.95"
              />
              {/* Note name */}
              {showNoteNames && (
                <text
                  x={x}
                  y={y + 1}
                  fill="white"
                  fontSize={note.isRoot ? "10" : "9"}
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {note.noteName.replace("#", "♯")}
                </text>
              )}
              {/* Root note indicator when not showing note names */}
              {!showNoteNames && note.isRoot && (
                <text
                  x={x}
                  y={y + 1}
                  fill="white"
                  fontSize="11"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  R
                </text>
              )}
            </g>
          )
        })}

        {/* String labels (E A D G B e) */}
        <g fontSize="12" fill="white" opacity="0.7" fontWeight="bold">
          <text x={startX} y={startY + numFrets * dims.fretGap + 20} textAnchor="middle">E</text>
          <text x={startX + dims.stringGap} y={startY + numFrets * dims.fretGap + 20} textAnchor="middle">A</text>
          <text x={startX + dims.stringGap * 2} y={startY + numFrets * dims.fretGap + 20} textAnchor="middle">D</text>
          <text x={startX + dims.stringGap * 3} y={startY + numFrets * dims.fretGap + 20} textAnchor="middle">G</text>
          <text x={startX + dims.stringGap * 4} y={startY + numFrets * dims.fretGap + 20} textAnchor="middle">B</text>
          <text x={startX + dims.stringGap * 5} y={startY + numFrets * dims.fretGap + 20} textAnchor="middle">e</text>
        </g>
      </svg>

      {/* Legend */}
      <div className="mt-3 flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-amber-500 border-2 border-white"></div>
          <span className="text-purple-200">Root Note ({rootNote})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-purple-600 border-2 border-white"></div>
          <span className="text-purple-200">Scale Notes</span>
        </div>
      </div>
    </div>
  )
}
