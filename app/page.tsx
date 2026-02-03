import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            Guitar Lab
          </h1>
          <p className="text-xl text-purple-200">
            Master guitar theory, technique, and fretboard knowledge
          </p>
        </header>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Chord Building Card */}
          <Link href="/chord-builder">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition-all cursor-pointer border border-white/20 hover:scale-105">
              <div className="text-4xl mb-4">🎸</div>
              <h2 className="text-2xl font-bold text-white mb-3">
                Chord Building
              </h2>
              <p className="text-purple-200 mb-4">
                Learn how chords are constructed from the ground up. Understand intervals, triads, and extensions.
              </p>
              <div className="text-purple-300 font-semibold">
                Start Learning →
              </div>
            </div>
          </Link>

          {/* Chord Progressions Card */}
          <Link href="/progressions">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition-all cursor-pointer border border-white/20 hover:scale-105">
              <div className="text-4xl mb-4">🎵</div>
              <h2 className="text-2xl font-bold text-white mb-3">
                Chord Progressions
              </h2>
              <p className="text-purple-200 mb-4">
                Explore common progressions used in popular music. Practice in all keys and understand the theory.
              </p>
              <div className="text-purple-300 font-semibold">
                Explore Progressions →
              </div>
            </div>
          </Link>

          {/* Scales Card */}
          <Link href="/scales">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition-all cursor-pointer border border-white/20 hover:scale-105">
              <div className="text-4xl mb-4">🎼</div>
              <h2 className="text-2xl font-bold text-white mb-3">
                Guitar Scales
              </h2>
              <p className="text-purple-200 mb-4">
                Master essential scales across the fretboard. Learn positions, patterns, and soloing techniques.
              </p>
              <div className="text-purple-300 font-semibold">
                Learn Scales →
              </div>
            </div>
          </Link>

          {/* Nashville Number System Card */}
          <Link href="/nashville-number-system">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition-all cursor-pointer border border-white/20 hover:scale-105">
              <div className="text-4xl mb-4">🎯</div>
              <h2 className="text-2xl font-bold text-white mb-3">
                Nashville Number System
              </h2>
              <p className="text-purple-200 mb-4">
                Learn the universal language of chord progressions. Transpose songs instantly to any key.
              </p>
              <div className="text-purple-300 font-semibold">
                Learn the System →
              </div>
            </div>
          </Link>

          {/* Music Theory Card */}
          <Link href="/music-theory">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition-all cursor-pointer border border-white/20 hover:scale-105">
              <div className="text-4xl mb-4">📚</div>
              <h2 className="text-2xl font-bold text-white mb-3">
                Music Theory
              </h2>
              <p className="text-purple-200 mb-4">
                Build a strong foundation in music theory. Learn notes, intervals, chord construction, and more.
              </p>
              <div className="text-purple-300 font-semibold">
                Study Theory →
              </div>
            </div>
          </Link>

          {/* CAGED System Card */}
          <Link href="/caged-system">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition-all cursor-pointer border border-white/20 hover:scale-105">
              <div className="text-4xl mb-4">🔗</div>
              <h2 className="text-2xl font-bold text-white mb-3">
                CAGED System
              </h2>
              <p className="text-purple-200 mb-4">
                Master the fretboard using 5 interconnected chord shapes. See how everything connects across the neck.
              </p>
              <div className="text-purple-300 font-semibold">
                Unlock the Fretboard →
              </div>
            </div>
          </Link>

          {/* Chord Substitutions Card */}
          <Link href="/chord-substitutions">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition-all cursor-pointer border border-white/20 hover:scale-105">
              <div className="text-4xl mb-4">🎭</div>
              <h2 className="text-2xl font-bold text-white mb-3">
                Chord Substitutions
              </h2>
              <p className="text-purple-200 mb-4">
                Learn advanced techniques to replace chords with alternatives. Add color and sophistication to your playing.
              </p>
              <div className="text-purple-300 font-semibold">
                Explore Substitutions →
              </div>
            </div>
          </Link>

          {/* Fingerstyle Patterns Card */}
          <Link href="/fingerstyle-patterns">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition-all cursor-pointer border border-white/20 hover:scale-105">
              <div className="text-4xl mb-4">🎹</div>
              <h2 className="text-2xl font-bold text-white mb-3">
                Fingerstyle Patterns
              </h2>
              <p className="text-purple-200 mb-4">
                Master fingerpicking patterns from Travis picking to classical techniques. Build independence and fluidity.
              </p>
              <div className="text-purple-300 font-semibold">
                Learn Patterns →
              </div>
            </div>
          </Link>

          {/* Rhythm Trainer Card */}
          <Link href="/rhythm-trainer">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition-all cursor-pointer border border-white/20 hover:scale-105">
              <div className="text-4xl mb-4">🥁</div>
              <h2 className="text-2xl font-bold text-white mb-3">
                Rhythm Trainer
              </h2>
              <p className="text-purple-200 mb-4">
                Master strumming patterns and timing. Learn rock, folk, reggae, and more with visual and audio guides.
              </p>
              <div className="text-purple-300 font-semibold">
                Practice Rhythm →
              </div>
            </div>
          </Link>

          {/* Arpeggios Card */}
          <Link href="/arpeggios">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition-all cursor-pointer border border-white/20 hover:scale-105">
              <div className="text-4xl mb-4">🎹</div>
              <h2 className="text-2xl font-bold text-white mb-3">
                Arpeggios
              </h2>
              <p className="text-purple-200 mb-4">
                Learn to play chords note-by-note across the fretboard. Essential for solos and melodic playing.
              </p>
              <div className="text-purple-300 font-semibold">
                Master Arpeggios →
              </div>
            </div>
          </Link>
        </div>

        {/* Features Section */}
        <div className="mt-16 max-w-7xl mx-auto">
          <h3 className="text-2xl font-bold text-white text-center mb-8">
            What You'll Learn
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
              <h4 className="text-lg font-semibold text-white mb-2">
                Music Theory
              </h4>
              <p className="text-purple-200 text-sm">
                Understand intervals, scales, and how chords are built from notes
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
              <h4 className="text-lg font-semibold text-white mb-2">
                CAGED System
              </h4>
              <p className="text-purple-200 text-sm">
                Connect 5 chord shapes across the neck to unlock the entire fretboard
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
              <h4 className="text-lg font-semibold text-white mb-2">
                Fretboard Notes
              </h4>
              <p className="text-purple-200 text-sm">
                Visualize and memorize all notes across the entire fretboard
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
              <h4 className="text-lg font-semibold text-white mb-2">
                Popular Progressions
              </h4>
              <p className="text-purple-200 text-sm">
                Master the progressions used in thousands of hit songs
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
              <h4 className="text-lg font-semibold text-white mb-2">
                Scale Mastery
              </h4>
              <p className="text-purple-200 text-sm">
                Learn scale patterns and positions across the entire fretboard
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
              <h4 className="text-lg font-semibold text-white mb-2">
                Nashville Numbers
              </h4>
              <p className="text-purple-200 text-sm">
                Master the universal chord numbering system used by pros
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
