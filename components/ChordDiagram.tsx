interface ChordDiagramProps {
  chordName: string
  fingers: (number | string)[]  // Array of 6 strings, 0 = open, x = muted, number = fret
  frets?: number[]  // Optional: which frets to show (default 0-4)
  size?: 'small' | 'medium' | 'large'
}

export default function ChordDiagram({ chordName, fingers, frets, size = 'medium' }: ChordDiagramProps) {
  const strings = 6

  // Auto-calculate fret range if not provided
  const calculatedFrets = frets || (() => {
    const numericFrets = fingers
      .filter((f): f is number => typeof f === 'number' && f > 0)

    if (numericFrets.length === 0) {
      // All open or muted, show open position
      return [0, 1, 2, 3, 4]
    }

    const minFret = Math.min(...numericFrets)
    const maxFret = Math.max(...numericFrets)

    // If chord fits in open position (0-4), use that
    if (maxFret <= 4) {
      return [0, 1, 2, 3, 4]
    }

    // Otherwise, create a 5-fret window starting from minFret
    const startFret = Math.max(1, minFret - 1) // Start one fret before the lowest finger
    return [startFret, startFret + 1, startFret + 2, startFret + 3, startFret + 4]
  })()

  const numFrets = calculatedFrets.length - 1

  const sizeClasses = {
    small: { width: 100, height: 120, stringGap: 16, fretGap: 20 },
    medium: { width: 140, height: 170, stringGap: 22, fretGap: 28 },
    large: { width: 180, height: 220, stringGap: 28, fretGap: 36 }
  }

  const dims = sizeClasses[size]
  const startX = 20
  const startY = 40

  return (
    <div className="flex flex-col items-center">
      <div className="text-white font-bold mb-2 text-center">{chordName}</div>
      <svg width={dims.width} height={dims.height} className="bg-amber-50/10 rounded-lg">
        {/* Nut (thick line at top if showing fret 0) */}
        {calculatedFrets[0] === 0 && (
          <line
            x1={startX}
            y1={startY}
            x2={startX + (strings - 1) * dims.stringGap}
            y2={startY}
            stroke="white"
            strokeWidth="4"
          />
        )}

        {/* Fret numbers */}
        {calculatedFrets[0] !== 0 && (
          <text
            x={startX - 15}
            y={startY + dims.fretGap / 2}
            fill="white"
            fontSize="12"
            textAnchor="middle"
          >
            {calculatedFrets[0]}
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
            strokeWidth="1.5"
            opacity="0.8"
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
            strokeWidth={i === 0 ? "2" : "1"}
            opacity="0.6"
          />
        ))}

        {/* Finger positions */}
        {fingers.map((fret, stringIndex) => {
          if (fret === 'x' || fret === 'X') {
            // Muted string - draw X above nut
            return (
              <g key={`finger-${stringIndex}`}>
                <line
                  x1={startX + stringIndex * dims.stringGap - 4}
                  y1={startY - 18}
                  x2={startX + stringIndex * dims.stringGap + 4}
                  y2={startY - 10}
                  stroke="#ef4444"
                  strokeWidth="2"
                />
                <line
                  x1={startX + stringIndex * dims.stringGap + 4}
                  y1={startY - 18}
                  x2={startX + stringIndex * dims.stringGap - 4}
                  y2={startY - 10}
                  stroke="#ef4444"
                  strokeWidth="2"
                />
              </g>
            )
          } else if (fret === 0 || fret === '0') {
            // Open string - draw O above nut
            return (
              <circle
                key={`finger-${stringIndex}`}
                cx={startX + stringIndex * dims.stringGap}
                cy={startY - 14}
                r="5"
                fill="none"
                stroke="#22c55e"
                strokeWidth="2"
              />
            )
          } else if (typeof fret === 'number' && fret > 0) {
            // Finger on fret - calculate position relative to displayed frets
            const fretPosition = fret - calculatedFrets[0]
            if (fretPosition >= 0 && fretPosition <= numFrets) {
              return (
                <circle
                  key={`finger-${stringIndex}`}
                  cx={startX + stringIndex * dims.stringGap}
                  cy={startY + fretPosition * dims.fretGap - dims.fretGap / 2}
                  r={size === 'small' ? "6" : size === 'medium' ? "7" : "8"}
                  fill="#8b5cf6"
                  stroke="white"
                  strokeWidth="2"
                />
              )
            }
          }
          return null
        })}

        {/* String labels (E A D G B e) */}
        <g fontSize="10" fill="white" opacity="0.6">
          <text x={startX} y={startY + numFrets * dims.fretGap + 15} textAnchor="middle">E</text>
          <text x={startX + dims.stringGap} y={startY + numFrets * dims.fretGap + 15} textAnchor="middle">A</text>
          <text x={startX + dims.stringGap * 2} y={startY + numFrets * dims.fretGap + 15} textAnchor="middle">D</text>
          <text x={startX + dims.stringGap * 3} y={startY + numFrets * dims.fretGap + 15} textAnchor="middle">G</text>
          <text x={startX + dims.stringGap * 4} y={startY + numFrets * dims.fretGap + 15} textAnchor="middle">B</text>
          <text x={startX + dims.stringGap * 5} y={startY + numFrets * dims.fretGap + 15} textAnchor="middle">e</text>
        </g>
      </svg>
    </div>
  )
}
