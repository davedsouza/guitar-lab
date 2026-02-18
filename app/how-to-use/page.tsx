"use client"

import { useState } from "react"
import Link from "next/link"

type SkillLevel = 'beginner' | 'intermediate' | 'advanced'

const MODULES = [
  {
    name: 'Beginner Module',
    href: '/beginner',
    icon: '🌟',
    description: 'Start your guitar journey here. Learn guitar anatomy, proper technique, and your first chords.',
    features: [
      'Guitar parts and string names',
      'How to hold the guitar',
      'Reading chord diagrams and TAB',
      '7 essential beginner chords',
      'Chord transitions and strumming',
      'Tuning and finger exercises',
      'First songs and common mistakes'
    ],
    level: 'beginner' as SkillLevel,
    prerequisite: null,
  },
  {
    name: 'Chord Building',
    href: '/chord-builder',
    icon: '🎸',
    description: 'Understand how chords are constructed from intervals and the chromatic scale.',
    features: [
      'Select any root note (C through B)',
      'Explore chord types (Major, Minor, 7th, etc.)',
      'See the intervals that create each chord',
      'View multiple chord voicings/positions',
      'Full fretboard visualization'
    ],
    level: 'intermediate' as SkillLevel,
    prerequisite: 'Beginner Module',
  },
  {
    name: 'Chord Progressions',
    href: '/progressions',
    icon: '🎵',
    description: 'Learn the chord progressions that power thousands of popular songs.',
    features: [
      'Common progressions (I-IV-V, ii-V-I, etc.)',
      'Practice in any key',
      'Chord diagrams for each progression',
      'Genre-specific progressions'
    ],
    level: 'beginner' as SkillLevel,
    prerequisite: 'Know basic open chords',
  },
  {
    name: 'Guitar Scales',
    href: '/scales',
    icon: '🎼',
    description: 'Master scales to improve your soloing and understand melody.',
    features: [
      'Major and minor scales',
      'Pentatonic scales (minor & major)',
      'Blues scale',
      'Multiple positions across the neck',
      'Full fretboard visualization'
    ],
    level: 'intermediate' as SkillLevel,
    prerequisite: 'Comfortable with basic chords',
  },
  {
    name: 'Nashville Number System',
    href: '/nashville-number-system',
    icon: '🎯',
    description: 'Learn the universal language for chord progressions used by professional musicians.',
    features: [
      'Number-based chord notation',
      'Transpose songs instantly',
      'Understand chord functions',
      'Communicate with other musicians'
    ],
    level: 'intermediate' as SkillLevel,
    prerequisite: 'Understanding of chord progressions',
  },
  {
    name: 'Music Theory',
    href: '/music-theory',
    icon: '📚',
    description: 'Build a strong foundation in music theory to understand the "why" behind music.',
    features: [
      'Notes and the chromatic scale',
      'Intervals and their sounds',
      'How scales are constructed',
      'Chord construction from scales',
      'Key signatures'
    ],
    level: 'intermediate' as SkillLevel,
    prerequisite: 'Basic chord knowledge',
  },
  {
    name: 'CAGED System',
    href: '/caged-system',
    icon: '🔗',
    description: 'Unlock the entire fretboard using 5 interconnected chord shapes.',
    features: [
      'The 5 CAGED chord shapes',
      'How shapes connect across the neck',
      'Play any chord anywhere',
      'Link scales to chord shapes'
    ],
    level: 'intermediate' as SkillLevel,
    prerequisite: 'Open chords mastered',
  },
  {
    name: 'Chord Substitutions',
    href: '/chord-substitutions',
    icon: '🎭',
    description: 'Add sophistication to your playing by replacing chords with colorful alternatives.',
    features: [
      'Tritone substitutions',
      'Relative major/minor swaps',
      'Extended chord replacements',
      'Jazz voicings'
    ],
    level: 'advanced' as SkillLevel,
    prerequisite: 'Music theory & CAGED',
  },
  {
    name: 'Fingerstyle Patterns',
    href: '/fingerstyle-patterns',
    icon: '🎹',
    description: 'Master fingerpicking from Travis picking to classical techniques.',
    features: [
      'Basic fingerpicking patterns',
      'Travis picking',
      'Classical patterns',
      'Finger independence exercises'
    ],
    level: 'intermediate' as SkillLevel,
    prerequisite: 'Comfortable chord changes',
  },
  {
    name: 'Rhythm Trainer',
    href: '/rhythm-trainer',
    icon: '🥁',
    description: 'Develop solid timing and learn strumming patterns for various genres.',
    features: [
      'Visual strumming patterns',
      'Rock, folk, reggae, and more',
      'Tempo control',
      'Accent patterns'
    ],
    level: 'beginner' as SkillLevel,
    prerequisite: 'Basic strumming ability',
  },
  {
    name: 'Arpeggios',
    href: '/arpeggios',
    icon: '🎶',
    description: 'Play chord tones individually for melodic soloing and accompaniment.',
    features: [
      'Major and minor arpeggios',
      '7th chord arpeggios',
      'Multiple positions',
      'Sweep picking introduction'
    ],
    level: 'advanced' as SkillLevel,
    prerequisite: 'Scales & chord theory',
  },
]

const LEARNING_PATHS = {
  beginner: {
    title: 'Beginner Path',
    subtitle: 'Just getting started? Follow this path.',
    duration: '3-6 months',
    color: 'green',
    steps: [
      {
        module: 'Beginner Module',
        href: '/beginner',
        focus: 'Complete all sections',
        goals: [
          'Learn guitar anatomy and string names',
          'Develop proper holding and posture',
          'Read chord diagrams confidently',
          'Play G, C, D, Em, Am, E, A chords cleanly'
        ],
        practiceTime: '15-30 min/day',
      },
      {
        module: 'Rhythm Trainer',
        href: '/rhythm-trainer',
        focus: 'Basic strumming patterns',
        goals: [
          'Master down strums on beat',
          'Learn down-up strumming',
          'Play along with a metronome',
          'Develop consistent timing'
        ],
        practiceTime: '10-15 min/day',
      },
      {
        module: 'Chord Progressions',
        href: '/progressions',
        focus: 'Simple 3-4 chord songs',
        goals: [
          'Play G-C-D progression smoothly',
          'Learn Am-G-C-D progression',
          'Change chords in time with music',
          'Play 5-10 simple songs'
        ],
        practiceTime: '15-20 min/day',
      },
      {
        module: 'Practice Songs',
        href: '/beginner',
        focus: 'Apply what you\'ve learned',
        goals: [
          'Play full songs from start to finish',
          'Strum and change chords together',
          'Build a repertoire of 10+ songs',
          'Play for friends/family!'
        ],
        practiceTime: '20-30 min/day',
      },
    ]
  },
  intermediate: {
    title: 'Intermediate Path',
    subtitle: 'Ready to level up? Expand your skills.',
    duration: '6-12 months',
    color: 'yellow',
    steps: [
      {
        module: 'Music Theory',
        href: '/music-theory',
        focus: 'Understand the fundamentals',
        goals: [
          'Know all notes on the fretboard',
          'Understand intervals (3rds, 5ths, 7ths)',
          'Learn how chords are built',
          'Understand key signatures'
        ],
        practiceTime: '20 min/day',
      },
      {
        module: 'Guitar Scales',
        href: '/scales',
        focus: 'Pentatonic and major scales',
        goals: [
          'Master minor pentatonic box 1',
          'Learn all 5 pentatonic positions',
          'Play major scale in 2 positions',
          'Improvise over backing tracks'
        ],
        practiceTime: '20-30 min/day',
      },
      {
        module: 'CAGED System',
        href: '/caged-system',
        focus: 'Connect the fretboard',
        goals: [
          'Learn all 5 CAGED shapes',
          'Play any major chord anywhere',
          'Connect scale patterns to chords',
          'See the fretboard as one system'
        ],
        practiceTime: '20-30 min/day',
      },
      {
        module: 'Chord Building',
        href: '/chord-builder',
        focus: 'Understand chord construction',
        goals: [
          'Build major and minor chords',
          'Understand 7th chords',
          'Learn multiple voicings',
          'Create your own chord shapes'
        ],
        practiceTime: '15-20 min/day',
      },
      {
        module: 'Nashville Number System',
        href: '/nashville-number-system',
        focus: 'Think in numbers',
        goals: [
          'Convert songs to numbers',
          'Transpose songs to any key',
          'Recognize common progressions',
          'Communicate with other musicians'
        ],
        practiceTime: '15 min/day',
      },
      {
        module: 'Fingerstyle Patterns',
        href: '/fingerstyle-patterns',
        focus: 'Develop finger independence',
        goals: [
          'Learn basic fingerpicking',
          'Master Travis picking basics',
          'Play fingerstyle arrangements',
          'Combine with chord knowledge'
        ],
        practiceTime: '20 min/day',
      },
    ]
  },
  advanced: {
    title: 'Advanced Path',
    subtitle: 'Push your boundaries and master the instrument.',
    duration: '12+ months',
    color: 'purple',
    steps: [
      {
        module: 'Chord Substitutions',
        href: '/chord-substitutions',
        focus: 'Advanced harmony',
        goals: [
          'Use tritone substitutions',
          'Apply secondary dominants',
          'Voice lead between chords',
          'Add color tones (9ths, 11ths, 13ths)'
        ],
        practiceTime: '20-30 min/day',
      },
      {
        module: 'Arpeggios',
        href: '/arpeggios',
        focus: 'Melodic chord tones',
        goals: [
          'Play arpeggios for all chord types',
          'Connect arpeggios across positions',
          'Use arpeggios in improvisation',
          'Develop sweep picking technique'
        ],
        practiceTime: '20-30 min/day',
      },
      {
        module: 'Advanced Scales',
        href: '/scales',
        focus: 'Modes and exotic scales',
        goals: [
          'Learn all 7 modes',
          'Understand modal harmony',
          'Apply modes to progressions',
          'Explore harmonic minor modes'
        ],
        practiceTime: '30 min/day',
      },
      {
        module: 'Full Fretboard Mastery',
        href: '/caged-system',
        focus: 'Complete integration',
        goals: [
          'Instantly find any note',
          'Play any chord in any position',
          'Connect scales, chords, and arpeggios',
          'Improvise freely across the neck'
        ],
        practiceTime: '30+ min/day',
      },
      {
        module: 'Style Development',
        href: '/fingerstyle-patterns',
        focus: 'Find your voice',
        goals: [
          'Develop personal playing style',
          'Transcribe solos by ear',
          'Write your own music',
          'Perform confidently'
        ],
        practiceTime: '30+ min/day',
      },
    ]
  },
}

export default function HowToUse() {
  const [selectedPath, setSelectedPath] = useState<SkillLevel>('beginner')
  const [showAllModules, setShowAllModules] = useState(false)

  const currentPath = LEARNING_PATHS[selectedPath]
  const pathColors = {
    beginner: { bg: 'bg-green-600', border: 'border-green-500', text: 'text-green-200', light: 'bg-green-500/20' },
    intermediate: { bg: 'bg-yellow-600', border: 'border-yellow-500', text: 'text-yellow-200', light: 'bg-yellow-500/20' },
    advanced: { bg: 'bg-purple-600', border: 'border-purple-500', text: 'text-purple-200', light: 'bg-purple-500/20' },
  }
  const colors = pathColors[selectedPath]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-purple-300 hover:text-purple-200 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">How to Use Guitar Lab</h1>
          <p className="text-purple-200">Your complete guide to mastering the guitar with this app</p>
        </div>

        {/* Quick Overview */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Welcome to Guitar Lab!</h2>
          <p className="text-purple-200 mb-4">
            Guitar Lab is a comprehensive learning platform designed to take you from complete beginner to advanced player.
            Each module focuses on a specific aspect of guitar playing, and they all work together to build your skills systematically.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4">
              <div className="text-green-200 font-bold text-lg mb-1">Beginner</div>
              <div className="text-green-100 text-sm">4 modules to get you playing songs</div>
            </div>
            <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-4">
              <div className="text-yellow-200 font-bold text-lg mb-1">Intermediate</div>
              <div className="text-yellow-100 text-sm">6 modules to expand your skills</div>
            </div>
            <div className="bg-purple-500/20 border border-purple-500/50 rounded-xl p-4">
              <div className="text-purple-200 font-bold text-lg mb-1">Advanced</div>
              <div className="text-purple-100 text-sm">5 modules to achieve mastery</div>
            </div>
          </div>
        </div>

        {/* Learning Path Selector */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Choose Your Learning Path</h2>
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => setSelectedPath('beginner')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                selectedPath === 'beginner'
                  ? 'bg-green-600 text-white scale-105'
                  : 'bg-white/20 text-green-200 hover:bg-white/30'
              }`}
            >
              🌱 Beginner
            </button>
            <button
              onClick={() => setSelectedPath('intermediate')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                selectedPath === 'intermediate'
                  ? 'bg-yellow-600 text-white scale-105'
                  : 'bg-white/20 text-yellow-200 hover:bg-white/30'
              }`}
            >
              🚀 Intermediate
            </button>
            <button
              onClick={() => setSelectedPath('advanced')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                selectedPath === 'advanced'
                  ? 'bg-purple-600 text-white scale-105'
                  : 'bg-white/20 text-purple-200 hover:bg-white/30'
              }`}
            >
              ⭐ Advanced
            </button>
          </div>

          {/* Selected Learning Path */}
          <div className={`${colors.light} border ${colors.border} rounded-2xl p-6`}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white">{currentPath.title}</h3>
                <p className={colors.text}>{currentPath.subtitle}</p>
              </div>
              <div className={`${colors.light} border ${colors.border} rounded-lg px-4 py-2 mt-4 md:mt-0`}>
                <span className={colors.text}>Estimated Duration: </span>
                <span className="text-white font-bold">{currentPath.duration}</span>
              </div>
            </div>

            <div className="space-y-6">
              {currentPath.steps.map((step, index) => (
                <div key={index} className="bg-white/10 rounded-xl p-5">
                  <div className="flex items-start gap-4">
                    <div className={`${colors.bg} text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                        <Link href={step.href} className="text-white font-bold text-lg hover:text-purple-300 transition-colors">
                          {step.module} →
                        </Link>
                        <span className={`${colors.text} text-sm`}>{step.practiceTime}</span>
                      </div>
                      <p className="text-purple-300 text-sm mb-3">{step.focus}</p>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {step.goals.map((goal, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className={colors.text}>✓</span>
                            <span className="text-purple-200 text-sm">{goal}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* All Modules Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">All Modules</h2>
            <button
              onClick={() => setShowAllModules(!showAllModules)}
              className="bg-white/20 text-purple-200 hover:bg-white/30 px-4 py-2 rounded-lg transition-all"
            >
              {showAllModules ? 'Show Less' : 'Show All Details'}
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MODULES.map((module, index) => (
              <Link key={index} href={module.href}>
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-5 border border-white/20 hover:bg-white/20 transition-all h-full">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{module.icon}</span>
                    <h3 className="text-white font-bold">{module.name}</h3>
                  </div>
                  <div className={`inline-block px-2 py-1 rounded text-xs mb-3 ${
                    module.level === 'beginner' ? 'bg-green-500/30 text-green-200' :
                    module.level === 'intermediate' ? 'bg-yellow-500/30 text-yellow-200' :
                    'bg-purple-500/30 text-purple-200'
                  }`}>
                    {module.level.charAt(0).toUpperCase() + module.level.slice(1)}
                  </div>
                  <p className="text-purple-200 text-sm mb-3">{module.description}</p>

                  {showAllModules && (
                    <>
                      <div className="border-t border-white/10 pt-3 mt-3">
                        <div className="text-purple-300 text-xs font-semibold mb-2">Features:</div>
                        <ul className="text-purple-200 text-xs space-y-1">
                          {module.features.map((feature, i) => (
                            <li key={i}>• {feature}</li>
                          ))}
                        </ul>
                      </div>
                      {module.prerequisite && (
                        <div className="bg-amber-500/20 rounded-lg p-2 mt-3">
                          <span className="text-amber-200 text-xs">Prerequisite: {module.prerequisite}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-4">Tips for Success</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-white font-semibold mb-2">🎯 Set Daily Goals</div>
                <p className="text-purple-200 text-sm">
                  Even 15 minutes of focused practice daily is better than occasional long sessions. Consistency builds muscle memory.
                </p>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-white font-semibold mb-2">🐢 Start Slow</div>
                <p className="text-purple-200 text-sm">
                  Always practice new techniques slowly at first. Speed comes naturally with accuracy. Use a metronome!
                </p>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-white font-semibold mb-2">🔄 Review Regularly</div>
                <p className="text-purple-200 text-sm">
                  Come back to earlier modules periodically. You'll understand concepts deeper as your skills grow.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-white font-semibold mb-2">🎵 Apply to Music</div>
                <p className="text-purple-200 text-sm">
                  Always connect what you learn to real songs. Theory without application is just information.
                </p>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-white font-semibold mb-2">📝 Track Progress</div>
                <p className="text-purple-200 text-sm">
                  Keep a practice journal. Note what you worked on and what needs improvement. Celebrate small wins!
                </p>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-white font-semibold mb-2">🤝 Play with Others</div>
                <p className="text-purple-200 text-sm">
                  When possible, play with other musicians. It improves timing, listening, and makes practice more fun.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <Link href="/beginner">
            <button className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all hover:scale-105">
              Start Your Journey →
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
