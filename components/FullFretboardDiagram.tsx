import { getScaleIntervals } from "@/lib/scalePatterns"

interface FullFretboardDiagramProps {
  scaleName: string
  rootNoteIndex: number
  scaleType: string
  showNoteNames?: boolean
}

const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
const STRING_TUNING = [4, 9, 2, 7, 11, 4] // E A D G B e in semitones from C

export default function FullFretboardDiagram({
  scaleName,
  rootNoteIndex,
  scaleType,
  showNoteNames = false
}: FullFretboardDiagramProps) {
  const strings = 6
  const numFrets = 12 // Show frets 0-12
  const fretWidth = 70
  const stringGap = 35
  const startX = 80
  const startY = 50
  const width = startX + numFrets * fretWidth + 40
  const height = startY + (strings - 1) * stringGap + 80

  const scaleIntervals = getScaleIntervals(scaleType)

  // Check if a note at a given string and fret is in the scale
  const isInScale = (stringIndex: number, fret: number): { inScale: boolean; isRoot: boolean; noteName: string; intervalIndex: number } => {
    const openStringNote = STRING_TUNING[stringIndex]
    const noteAtFret = (openStringNote + fret) % 12

    const intervalIndex = scaleIntervals.findIndex(interval => {
      return (rootNoteIndex + interval) % 12 === noteAtFret
    })

    const inScale = intervalIndex !== -1
    const isRoot = noteAtFret === rootNoteIndex
    const noteName = NOTES[noteAtFret]

    return { inScale, isRoot, noteName, intervalIndex }
  }

  // Get positions for fret markers (dots)
  const fretMarkers = [3, 5, 7, 9, 12]
  const doubleDotFrets = [12]

  return (
    <div className="flex flex-col items-center overflow-x-auto">
      <div className="text-white font-bold mb-4 text-center text-lg">{scaleName}</div>
      <div className="min-w-max">
        <svg width={width} height={height} className="bg-gradient-to-br from-amber-900/20 to-amber-700/10 rounded-xl border border-amber-600/30">
          {/* Nut (thick line at left) */}
          <line
            x1={startX}
            y1={startY}
            x2={startX}
            y2={startY + (strings - 1) * stringGap}
            stroke="white"
            strokeWidth="6"
          />

          {/* Frets (vertical lines) */}
          {Array.from({ length: numFrets + 1 }).map((_, i) => (
            <line
              key={`fret-${i}`}
              x1={startX + i * fretWidth}
              y1={startY}
              x2={startX + i * fretWidth}
              y2={startY + (strings - 1) * stringGap}
              stroke="white"
              strokeWidth={i === 0 ? "6" : "2"}
              opacity={i === 0 ? "1" : "0.4"}
            />
          ))}

          {/* Strings (horizontal lines) */}
          {Array.from({ length: strings }).map((_, i) => (
            <line
              key={`string-${i}`}
              x1={startX}
              y1={startY + i * stringGap}
              x2={startX + numFrets * fretWidth}
              y2={startY + i * stringGap}
              stroke="white"
              strokeWidth={i === 0 ? "3" : i === 5 ? "1.5" : "2"}
              opacity="0.6"
            />
          ))}

          {/* Fret markers (decorative dots) */}
          {fretMarkers.map(fretNum => {
            const x = startX + (fretNum - 0.5) * fretWidth
            const y = startY + ((strings - 1) * stringGap) / 2

            if (doubleDotFrets.includes(fretNum)) {
              return (
                <g key={`marker-${fretNum}`}>
                  <circle
                    cx={x}
                    cy={y - stringGap}
                    r="6"
                    fill="white"
                    opacity="0.15"
                  />
                  <circle
                    cx={x}
                    cy={y + stringGap}
                    r="6"
                    fill="white"
                    opacity="0.15"
                  />
                </g>
              )
            }

            return (
              <circle
                key={`marker-${fretNum}`}
                cx={x}
                cy={y}
                r="6"
                fill="white"
                opacity="0.15"
              />
            )
          })}

          {/* Scale notes */}
          {Array.from({ length: strings }).map((_, stringIndex) =>
            Array.from({ length: numFrets + 1 }).map((_, fret) => {
              const { inScale, isRoot, noteName, intervalIndex } = isInScale(stringIndex, fret)

              if (!inScale) return null

              const x = startX + (fret === 0 ? 0 : (fret - 0.5) * fretWidth)
              const y = startY + stringIndex * stringGap

              // Color based on interval: root is orange, others vary in purple shades
              const getColor = () => {
                if (isRoot) return "#f59e0b"
                const colors = ["#a855f7", "#9333ea", "#7c3aed", "#6d28d9", "#5b21b6"]
                return colors[intervalIndex % colors.length]
              }

              return (
                <g key={`note-${stringIndex}-${fret}`}>
                  <circle
                    cx={x}
                    cy={y}
                    r={isRoot ? 14 : 12}
                    fill={getColor()}
                    stroke="white"
                    strokeWidth="2.5"
                    opacity="0.95"
                  />
                  {showNoteNames ? (
                    <text
                      x={x}
                      y={y + 1}
                      fill="white"
                      fontSize={isRoot ? "11" : "10"}
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {noteName.replace("#", "♯")}
                    </text>
                  ) : (
                    isRoot && (
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
                    )
                  )}
                </g>
              )
            })
          )}

          {/* Fret numbers */}
          <g fontSize="12" fill="white" opacity="0.5" fontWeight="bold">
            {Array.from({ length: numFrets + 1 }).map((_, i) => (
              <text
                key={`fret-num-${i}`}
                x={startX + i * fretWidth}
                y={startY + (strings - 1) * stringGap + 30}
                textAnchor="middle"
              >
                {i}
              </text>
            ))}
          </g>

          {/* String labels (E A D G B e) */}
          <g fontSize="14" fill="white" opacity="0.7" fontWeight="bold">
            <text x={startX - 20} y={startY + 5} textAnchor="middle">E</text>
            <text x={startX - 20} y={startY + stringGap + 5} textAnchor="middle">A</text>
            <text x={startX - 20} y={startY + stringGap * 2 + 5} textAnchor="middle">D</text>
            <text x={startX - 20} y={startY + stringGap * 3 + 5} textAnchor="middle">G</text>
            <text x={startX - 20} y={startY + stringGap * 4 + 5} textAnchor="middle">B</text>
            <text x={startX - 20} y={startY + stringGap * 5 + 5} textAnchor="middle">e</text>
          </g>
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-amber-500 border-2 border-white"></div>
          <span className="text-purple-200">Root Note ({NOTES[rootNoteIndex]})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-purple-600 border-2 border-white"></div>
          <span className="text-purple-200">Scale Notes</span>
        </div>
      </div>

      <div className="mt-2 text-purple-300 text-xs text-center">
        Showing all notes across 12 frets • Scroll horizontally to see the entire fretboard
      </div>
    </div>
  )
}
