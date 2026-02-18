"use client"

import { useState } from "react"
import Link from "next/link"
import ChordDiagram from "@/components/ChordDiagram"
import {
  GUITAR_PARTS,
  STRING_INFO,
  BEGINNER_CHORDS,
  BEGINNER_TRANSITIONS,
  BASIC_STRUMMING,
  TUNING_INFO,
  FINGER_EXERCISES,
  BEGINNER_SONGS,
  COMMON_MISTAKES,
  SECTIONS,
} from "@/lib/beginnerData"

// Strum Pattern Display Component
function StrumPatternDisplay({ pattern, name }: { pattern: ('D' | 'U' | '-')[], name: string }) {
  return (
    <div className="bg-white/10 rounded-xl p-4">
      <div className="text-white font-semibold mb-3">{name}</div>
      <div className="flex justify-center gap-2">
        {pattern.map((strum, i) => (
          <div
            key={i}
            className={`w-10 h-14 flex flex-col items-center justify-center rounded-lg ${
              strum === 'D' ? 'bg-purple-600' : strum === 'U' ? 'bg-blue-600' : 'bg-white/10'
            }`}
          >
            {strum === 'D' && (
              <>
                <span className="text-white text-lg">↓</span>
                <span className="text-white text-xs">D</span>
              </>
            )}
            {strum === 'U' && (
              <>
                <span className="text-white text-lg">↑</span>
                <span className="text-white text-xs">U</span>
              </>
            )}
            {strum === '-' && (
              <span className="text-white/50 text-xs">-</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// TAB Example Component
function TabExample() {
  return (
    <div className="bg-slate-800 rounded-xl p-4 font-mono text-sm">
      <div className="text-purple-300 mb-2">Example TAB:</div>
      <pre className="text-white leading-relaxed">
{`e|---0---3---0---0---|
B|---1---0---1---1---|
G|---0---0---2---0---|
D|---2---0---2---2---|
A|---3---2---0---3---|
E|-------3----------|`}
      </pre>
      <div className="text-purple-200 text-xs mt-3">
        Numbers = which fret to press | 0 = open string | Lines = strings (e is thinnest)
      </div>
    </div>
  )
}

// Chord Diagram Explanation Component
function ChordDiagramExplanation() {
  return (
    <div className="bg-white/10 rounded-xl p-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-white font-semibold mb-3">How to Read</h4>
          <div className="space-y-2 text-purple-200 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-600 rounded-full"></div>
              <span>Purple dot = press this fret</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-green-500 rounded-full"></div>
              <span>Green circle = play string open</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-red-500 font-bold">X</span>
              <span>Red X = don't play this string</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-1 bg-white"></div>
              <span>Thick top line = nut (fret 0)</span>
            </div>
          </div>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">String Order</h4>
          <div className="text-purple-200 text-sm">
            <p className="mb-2">From left to right:</p>
            <div className="flex gap-3 text-white font-mono">
              <span>E</span>
              <span>A</span>
              <span>D</span>
              <span>G</span>
              <span>B</span>
              <span>e</span>
            </div>
            <p className="mt-2 text-xs">
              (thickest to thinnest, low to high)
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BeginnerModule() {
  const [activeSection, setActiveSection] = useState('anatomy')
  const [selectedChord, setSelectedChord] = useState(0)
  const [selectedTransition, setSelectedTransition] = useState(0)
  const [selectedPattern, setSelectedPattern] = useState(0)
  const [selectedExercise, setSelectedExercise] = useState(0)

  const renderSection = () => {
    switch (activeSection) {
      case 'anatomy':
        return (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">Parts of the Guitar</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {GUITAR_PARTS.map((part, i) => (
                  <div key={i} className="bg-white/10 rounded-xl p-4">
                    <div className="text-white font-semibold">{part.name}</div>
                    <div className="text-purple-200 text-sm">{part.description}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">String Names</h2>
              <div className="bg-amber-500/20 border border-amber-500/50 rounded-lg p-4 mb-4">
                <div className="text-amber-200 font-semibold mb-1">Mnemonic to Remember:</div>
                <div className="text-amber-100 text-lg">
                  <span className="font-bold">E</span>lephants{' '}
                  <span className="font-bold">A</span>nd{' '}
                  <span className="font-bold">D</span>onkeys{' '}
                  <span className="font-bold">G</span>row{' '}
                  <span className="font-bold">B</span>ig{' '}
                  <span className="font-bold">E</span>ars
                </div>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {STRING_INFO.map((s, i) => (
                  <div key={i} className="bg-white/10 rounded-xl p-3 text-center">
                    <div className="text-3xl font-bold text-white">{s.note}</div>
                    <div className="text-purple-300 text-xs">String {s.string}</div>
                    <div className="text-purple-200 text-sm">{s.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'holding':
        return (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">Sitting Position</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-white font-semibold">Body Position</div>
                    <ul className="text-purple-200 text-sm mt-2 space-y-1">
                      <li>• Sit up straight in a chair or stool</li>
                      <li>• Rest the guitar body on your right thigh (if right-handed)</li>
                      <li>• The neck should angle slightly upward</li>
                      <li>• Keep the guitar close to your body</li>
                    </ul>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-white font-semibold">Standing Position</div>
                    <ul className="text-purple-200 text-sm mt-2 space-y-1">
                      <li>• Use a strap adjusted to comfortable height</li>
                      <li>• Guitar should be at same position as when sitting</li>
                      <li>• Don't let it hang too low (looks cool, plays hard)</li>
                    </ul>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-white font-semibold">Fretting Hand (Left)</div>
                    <ul className="text-purple-200 text-sm mt-2 space-y-1">
                      <li>• Thumb behind the neck, roughly centered</li>
                      <li>• Fingers curved, pressing with fingertips</li>
                      <li>• Press just behind the frets, not on them</li>
                      <li>• Keep wrist relatively straight</li>
                    </ul>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-white font-semibold">Strumming Hand (Right)</div>
                    <ul className="text-purple-200 text-sm mt-2 space-y-1">
                      <li>• Rest forearm on the body of the guitar</li>
                      <li>• Strum from the wrist, not the elbow</li>
                      <li>• Keep wrist loose and relaxed</li>
                      <li>• Strum over the sound hole (acoustic) or pickups (electric)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-amber-500/20 border border-amber-500/50 rounded-lg p-4">
              <div className="text-amber-200 font-semibold mb-2">Comfort Tips</div>
              <div className="text-amber-100 text-sm">
                • Take breaks every 15-20 minutes when starting out<br/>
                • If something hurts, stop and check your posture<br/>
                • It's normal for fingertips to be sore at first - calluses will develop!
              </div>
            </div>
          </div>
        )

      case 'diagrams':
        return (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">Reading Chord Diagrams</h2>
              <p className="text-purple-200 mb-6">
                Chord diagrams show you exactly where to put your fingers. Think of it as looking at the guitar neck face-on.
              </p>
              <div className="grid lg:grid-cols-2 gap-6">
                <ChordDiagramExplanation />
                <div className="flex flex-col items-center justify-center">
                  <div className="text-purple-200 mb-2">Example: C Major Chord</div>
                  <ChordDiagram
                    chordName="C"
                    fingers={['x', 3, 2, 0, 1, 0]}
                    size="large"
                  />
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Practice Reading</h3>
              <p className="text-purple-200 mb-4">Can you identify what each symbol means?</p>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="flex flex-col items-center">
                  <ChordDiagram chordName="Em" fingers={[0, 2, 2, 0, 0, 0]} size="medium" />
                  <div className="text-purple-200 text-sm mt-2">All open except 2 fingers</div>
                </div>
                <div className="flex flex-col items-center">
                  <ChordDiagram chordName="D" fingers={['x', 'x', 0, 2, 3, 2]} size="medium" />
                  <div className="text-purple-200 text-sm mt-2">Two X's = don't play those</div>
                </div>
                <div className="flex flex-col items-center">
                  <ChordDiagram chordName="G" fingers={[3, 2, 0, 0, 0, 3]} size="medium" />
                  <div className="text-purple-200 text-sm mt-2">Fingers on both ends</div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'tab':
        return (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">Reading Guitar TAB</h2>
              <p className="text-purple-200 mb-6">
                TAB (tablature) is a simple way to write guitar music. It shows you exactly which frets to play on which strings.
              </p>
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-white font-semibold mb-2">The 6 Lines</div>
                    <div className="text-purple-200 text-sm">
                      Each line represents a string. The top line is the thinnest string (high e), and the bottom line is the thickest (low E).
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-white font-semibold mb-2">The Numbers</div>
                    <div className="text-purple-200 text-sm">
                      Numbers tell you which fret to press. 0 means play the string open (no fretting). 3 means press the 3rd fret.
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-white font-semibold mb-2">Reading Direction</div>
                    <div className="text-purple-200 text-sm">
                      Read left to right, like a book. Numbers stacked vertically are played together (a chord).
                    </div>
                  </div>
                </div>
                <TabExample />
              </div>
            </div>
            <div className="bg-amber-500/20 border border-amber-500/50 rounded-lg p-4">
              <div className="text-amber-200 font-semibold mb-2">TAB vs Sheet Music</div>
              <div className="text-amber-100 text-sm">
                TAB is easier to learn but doesn't show rhythm. Combine TAB with listening to the song to get the timing right!
              </div>
            </div>
          </div>
        )

      case 'chords':
        return (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">Your First 7 Chords</h2>
              <p className="text-purple-200 mb-6">
                Master these 7 chords and you can play thousands of songs! Click each chord to see how to play it.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {BEGINNER_CHORDS.map((chord, i) => (
                  <button
                    key={chord.name}
                    onClick={() => setSelectedChord(i)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      selectedChord === i
                        ? 'bg-purple-600 text-white scale-105'
                        : 'bg-white/20 text-purple-200 hover:bg-white/30'
                    }`}
                  >
                    {chord.name}
                  </button>
                ))}
              </div>
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="flex flex-col items-center">
                  <ChordDiagram
                    chordName={BEGINNER_CHORDS[selectedChord].name}
                    fingers={BEGINNER_CHORDS[selectedChord].fingers}
                    size="large"
                  />
                  <div className="mt-4 flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      BEGINNER_CHORDS[selectedChord].difficulty === 'Easy'
                        ? 'bg-green-500/30 text-green-200'
                        : BEGINNER_CHORDS[selectedChord].difficulty === 'Medium'
                        ? 'bg-yellow-500/30 text-yellow-200'
                        : 'bg-red-500/30 text-red-200'
                    }`}>
                      {BEGINNER_CHORDS[selectedChord].difficulty}
                    </span>
                  </div>
                </div>
                <div className="bg-white/10 rounded-xl p-6">
                  <h3 className="text-white font-bold text-xl mb-4">
                    How to Play {BEGINNER_CHORDS[selectedChord].name}
                  </h3>
                  <ul className="space-y-2">
                    {BEGINNER_CHORDS[selectedChord].tips.map((tip, i) => (
                      <li key={i} className="text-purple-200 flex items-start gap-2">
                        <span className="text-purple-400 mt-1">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">All 7 Chords at a Glance</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                {BEGINNER_CHORDS.map((chord, i) => (
                  <div
                    key={chord.name}
                    onClick={() => setSelectedChord(i)}
                    className={`cursor-pointer transition-all hover:scale-105 ${
                      selectedChord === i ? 'ring-2 ring-purple-500 rounded-xl' : ''
                    }`}
                  >
                    <ChordDiagram
                      chordName={chord.name}
                      fingers={chord.fingers}
                      size="small"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'transitions':
        return (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">Chord Transitions</h2>
              <p className="text-purple-200 mb-6">
                Switching between chords smoothly is key to playing songs. Here are the most common beginner transitions with tips.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {BEGINNER_TRANSITIONS.map((trans, i) => (
                  <button
                    key={`${trans.from}-${trans.to}`}
                    onClick={() => setSelectedTransition(i)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      selectedTransition === i
                        ? 'bg-purple-600 text-white scale-105'
                        : 'bg-white/20 text-purple-200 hover:bg-white/30'
                    }`}
                  >
                    {trans.from} → {trans.to}
                  </button>
                ))}
              </div>
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="flex flex-col items-center">
                  <div className="text-purple-200 mb-2">From:</div>
                  <ChordDiagram
                    chordName={BEGINNER_TRANSITIONS[selectedTransition].from}
                    fingers={BEGINNER_CHORDS.find(c => c.name === BEGINNER_TRANSITIONS[selectedTransition].from)?.fingers || []}
                    size="medium"
                  />
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="text-4xl text-purple-400 mb-4">→</div>
                  {BEGINNER_TRANSITIONS[selectedTransition].anchorFinger && (
                    <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3 text-center">
                      <div className="text-green-200 text-sm font-semibold">Anchor Tip</div>
                      <div className="text-green-100 text-xs">
                        {BEGINNER_TRANSITIONS[selectedTransition].anchorFinger}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-purple-200 mb-2">To:</div>
                  <ChordDiagram
                    chordName={BEGINNER_TRANSITIONS[selectedTransition].to}
                    fingers={BEGINNER_CHORDS.find(c => c.name === BEGINNER_TRANSITIONS[selectedTransition].to)?.fingers || []}
                    size="medium"
                  />
                </div>
              </div>
              <div className="mt-6 bg-white/10 rounded-xl p-6">
                <h3 className="text-white font-bold mb-3">Transition Tips</h3>
                <ul className="space-y-2">
                  {BEGINNER_TRANSITIONS[selectedTransition].tips.map((tip, i) => (
                    <li key={i} className="text-purple-200 flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="bg-amber-500/20 border border-amber-500/50 rounded-lg p-4">
              <div className="text-amber-200 font-semibold mb-2">Practice Method</div>
              <div className="text-amber-100 text-sm">
                Set a metronome to 60 BPM. Change chords every 4 beats. When that's comfortable, try changing every 2 beats, then every beat.
              </div>
            </div>
          </div>
        )

      case 'strumming':
        return (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">Basic Strumming Patterns</h2>
              <p className="text-purple-200 mb-6">
                Strumming gives songs their rhythm and feel. Start with simple down strums and work up to more complex patterns.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {BASIC_STRUMMING.map((pattern, i) => (
                  <button
                    key={pattern.name}
                    onClick={() => setSelectedPattern(i)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      selectedPattern === i
                        ? 'bg-purple-600 text-white scale-105'
                        : 'bg-white/20 text-purple-200 hover:bg-white/30'
                    }`}
                  >
                    {pattern.name}
                  </button>
                ))}
              </div>
              <div className="grid lg:grid-cols-2 gap-6">
                <StrumPatternDisplay
                  pattern={BASIC_STRUMMING[selectedPattern].pattern}
                  name={BASIC_STRUMMING[selectedPattern].name}
                />
                <div className="bg-white/10 rounded-xl p-6">
                  <h3 className="text-white font-bold mb-3">{BASIC_STRUMMING[selectedPattern].name}</h3>
                  <p className="text-purple-200 mb-4">{BASIC_STRUMMING[selectedPattern].description}</p>
                  <div className="text-purple-300 text-sm">
                    Suggested tempo: {BASIC_STRUMMING[selectedPattern].bpm} BPM
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Strumming Tips</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="text-white font-semibold mb-2">Wrist Motion</div>
                  <div className="text-purple-200 text-sm">
                    Strum from the wrist, not the elbow. Keep your wrist loose and relaxed.
                  </div>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="text-white font-semibold mb-2">Keep the Rhythm</div>
                  <div className="text-purple-200 text-sm">
                    Your hand should move in a constant down-up motion, even when you don't hit the strings.
                  </div>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="text-white font-semibold mb-2">Hit All Strings (Mostly)</div>
                  <div className="text-purple-200 text-sm">
                    On down strums, hit all strings. On up strums, focus on the thinner strings.
                  </div>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="text-white font-semibold mb-2">Start Slow</div>
                  <div className="text-purple-200 text-sm">
                    Practice at half speed until the pattern feels natural. Speed comes with time.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'tuning':
        return (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">How to Tune Your Guitar</h2>
              <p className="text-purple-200 mb-6">
                A tuned guitar is essential for learning. Here's the standard tuning and how to tune by ear.
              </p>
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white/10 rounded-xl p-6">
                  <h3 className="text-white font-bold mb-4">Standard Tuning</h3>
                  <div className="grid grid-cols-6 gap-2">
                    {TUNING_INFO.standardTuning.map((note, i) => (
                      <div key={i} className="bg-purple-600 rounded-lg p-3 text-center">
                        <div className="text-white text-2xl font-bold">{note}</div>
                        <div className="text-purple-200 text-xs">String {6 - i}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white/10 rounded-xl p-6">
                  <h3 className="text-white font-bold mb-4">5th Fret Method</h3>
                  <p className="text-purple-200 text-sm mb-4">
                    Once your low E is in tune, you can tune the other strings by ear:
                  </p>
                  <div className="space-y-2">
                    {TUNING_INFO.fifthFretMethod.map((step, i) => (
                      <div key={i} className="bg-white/5 rounded-lg p-2 text-sm">
                        <span className="text-purple-300">Fret {step.fret}, String {step.string}</span>
                        <span className="text-white"> = </span>
                        <span className="text-purple-200">{step.matches}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-amber-500/20 border border-amber-500/50 rounded-lg p-4">
              <div className="text-amber-200 font-semibold mb-2">Tuning Tips</div>
              <div className="text-amber-100 text-sm space-y-1">
                {TUNING_INFO.tips.map((tip, i) => (
                  <p key={i}>• {tip}</p>
                ))}
              </div>
            </div>
          </div>
        )

      case 'exercises':
        return (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">Finger Exercises</h2>
              <p className="text-purple-200 mb-6">
                These exercises build strength, dexterity, and independence in your fretting fingers.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {FINGER_EXERCISES.map((exercise, i) => (
                  <button
                    key={exercise.name}
                    onClick={() => setSelectedExercise(i)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      selectedExercise === i
                        ? 'bg-purple-600 text-white scale-105'
                        : 'bg-white/20 text-purple-200 hover:bg-white/30'
                    }`}
                  >
                    {exercise.name}
                  </button>
                ))}
              </div>
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white/10 rounded-xl p-6">
                  <h3 className="text-white font-bold text-xl mb-2">
                    {FINGER_EXERCISES[selectedExercise].name}
                  </h3>
                  <p className="text-purple-200 mb-4">
                    {FINGER_EXERCISES[selectedExercise].description}
                  </p>
                  <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3">
                    <div className="text-green-200 text-sm font-semibold">Purpose</div>
                    <div className="text-green-100 text-sm">
                      {FINGER_EXERCISES[selectedExercise].purpose}
                    </div>
                  </div>
                </div>
                <div className="bg-white/10 rounded-xl p-6">
                  <h4 className="text-white font-semibold mb-3">Steps</h4>
                  <ol className="space-y-2">
                    {FINGER_EXERCISES[selectedExercise].steps.map((step, i) => (
                      <li key={i} className="text-purple-200 flex items-start gap-3">
                        <span className="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                          {i + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
            <div className="bg-amber-500/20 border border-amber-500/50 rounded-lg p-4">
              <div className="text-amber-200 font-semibold mb-2">Practice Tips</div>
              <div className="text-amber-100 text-sm">
                • Start very slowly - accuracy before speed<br/>
                • Use a metronome to keep steady time<br/>
                • 5-10 minutes of exercises daily is more effective than long occasional sessions
              </div>
            </div>
          </div>
        )

      case 'songs':
        return (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">Your First Songs</h2>
              <p className="text-purple-200 mb-6">
                These songs use only the chords you've learned. Perfect for practicing transitions and strumming!
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {BEGINNER_SONGS.map((song, i) => (
                  <div key={i} className="bg-white/10 rounded-xl p-5 hover:bg-white/15 transition-all">
                    <div className="text-white font-bold text-lg">{song.title}</div>
                    <div className="text-purple-300 text-sm mb-3">{song.artist}</div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {song.chords.map((chord, j) => (
                        <span key={j} className="bg-purple-600/50 text-white px-2 py-0.5 rounded text-sm">
                          {chord}
                        </span>
                      ))}
                    </div>
                    <div className={`inline-block px-2 py-1 rounded text-xs ${
                      song.difficulty === 'Very Easy'
                        ? 'bg-green-500/30 text-green-200'
                        : song.difficulty === 'Easy'
                        ? 'bg-blue-500/30 text-blue-200'
                        : 'bg-yellow-500/30 text-yellow-200'
                    }`}>
                      {song.difficulty}
                    </div>
                    <p className="text-purple-200 text-sm mt-3">{song.notes}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-amber-500/20 border border-amber-500/50 rounded-lg p-4">
              <div className="text-amber-200 font-semibold mb-2">Learning Songs</div>
              <div className="text-amber-100 text-sm">
                • Search for "[song name] guitar chords" to find full chord charts<br/>
                • Listen to the original song to learn the rhythm<br/>
                • Start at half speed and gradually increase<br/>
                • Don't worry about singing while playing at first
              </div>
            </div>
          </div>
        )

      case 'mistakes':
        return (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">Common Beginner Mistakes</h2>
              <p className="text-purple-200 mb-6">
                Everyone makes these mistakes when starting out. Here's how to identify and fix them.
              </p>
              <div className="space-y-4">
                {COMMON_MISTAKES.map((mistake, i) => (
                  <div key={i} className="bg-white/10 rounded-xl p-5">
                    <div className="flex items-start gap-4">
                      <div className="bg-red-500/30 text-red-200 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-bold text-lg">{mistake.mistake}</div>
                        <div className="text-red-300 text-sm mt-1">
                          <span className="font-semibold">Symptom:</span> {mistake.symptom}
                        </div>
                        <div className="text-green-300 text-sm mt-2">
                          <span className="font-semibold">Fix:</span> {mistake.fix}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
              <div className="text-green-200 font-semibold mb-2">Remember</div>
              <div className="text-green-100 text-sm">
                Every guitarist went through these same struggles. With consistent practice, these issues will resolve naturally. Be patient with yourself!
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-purple-300 hover:text-purple-200 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Beginner Module</h1>
          <p className="text-purple-200">Master the fundamentals of guitar playing</p>
        </div>

        {/* Section Navigation */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-2 pb-2 min-w-max">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-4 py-3 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                  activeSection === section.id
                    ? 'bg-purple-600 text-white scale-105'
                    : 'bg-white/20 text-purple-200 hover:bg-white/30'
                }`}
              >
                <span>{section.icon}</span>
                <span className="hidden sm:inline">{section.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Active Section Content */}
        {renderSection()}

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={() => {
              const currentIndex = SECTIONS.findIndex(s => s.id === activeSection)
              if (currentIndex > 0) {
                setActiveSection(SECTIONS[currentIndex - 1].id)
              }
            }}
            disabled={activeSection === SECTIONS[0].id}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeSection === SECTIONS[0].id
                ? 'bg-white/10 text-purple-400 cursor-not-allowed'
                : 'bg-white/20 text-purple-200 hover:bg-white/30'
            }`}
          >
            ← Previous Section
          </button>
          <button
            onClick={() => {
              const currentIndex = SECTIONS.findIndex(s => s.id === activeSection)
              if (currentIndex < SECTIONS.length - 1) {
                setActiveSection(SECTIONS[currentIndex + 1].id)
              }
            }}
            disabled={activeSection === SECTIONS[SECTIONS.length - 1].id}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeSection === SECTIONS[SECTIONS.length - 1].id
                ? 'bg-white/10 text-purple-400 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-500'
            }`}
          >
            Next Section →
          </button>
        </div>
      </div>
    </div>
  )
}
