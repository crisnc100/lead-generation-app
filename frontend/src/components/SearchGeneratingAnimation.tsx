import { useEffect, useState } from 'react'
import { Loader2, Radar, Sparkles, Target, CheckCircle } from 'lucide-react'

interface SearchGeneratingAnimationProps {
  open: boolean
  searchName: string
  location: string
  onComplete?: () => void
}

type Stage = 'initializing' | 'scanning' | 'analyzing' | 'scoring' | 'complete'

const stageConfig = {
  initializing: {
    icon: Loader2,
    text: 'Initializing search...',
    duration: 800,
    showRadar: false,
    showParticles: false,
  },
  scanning: {
    icon: Radar,
    text: 'Scanning',
    duration: 2000,
    showRadar: true,
    showParticles: false,
  },
  analyzing: {
    icon: Sparkles,
    text: 'Analyzing businesses...',
    duration: 1800,
    showRadar: true,
    showParticles: true,
  },
  scoring: {
    icon: Target,
    text: 'Scoring leads...',
    duration: 1500,
    showRadar: false,
    showParticles: true,
  },
  complete: {
    icon: CheckCircle,
    text: 'Search complete!',
    duration: 1000,
    showRadar: false,
    showParticles: false,
  },
}

export default function SearchGeneratingAnimation({
  open,
  searchName,
  location,
  onComplete,
}: SearchGeneratingAnimationProps) {
  const [stage, setStage] = useState<Stage>('initializing')
  const [businessCount, setBusinessCount] = useState(0)

  useEffect(() => {
    if (!open) {
      setStage('initializing')
      setBusinessCount(0)
      return
    }

    const stages: Stage[] = ['initializing', 'scanning', 'analyzing', 'scoring', 'complete']
    let currentIndex = 0

    const advanceStage = () => {
      if (currentIndex < stages.length - 1) {
        currentIndex++
        const nextStage = stages[currentIndex]
        setStage(nextStage)

        // Simulate business count increase during analyzing/scoring
        if (nextStage === 'analyzing' || nextStage === 'scoring') {
          const targetCount = nextStage === 'analyzing' ? 15 : 8
          let count = 0
          const countInterval = setInterval(() => {
            count++
            setBusinessCount(count)
            if (count >= targetCount) clearInterval(countInterval)
          }, stageConfig[nextStage].duration / targetCount)
        }

        setTimeout(advanceStage, stageConfig[nextStage].duration)
      } else {
        // Complete stage - trigger onComplete after showing success
        setTimeout(() => {
          onComplete?.()
        }, stageConfig.complete.duration)
      }
    }

    const initialTimer = setTimeout(advanceStage, stageConfig.initializing.duration)

    return () => clearTimeout(initialTimer)
  }, [open, onComplete])

  if (!open) return null

  const config = stageConfig[stage]
  const Icon = config.icon

  // Generate particle positions
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 3,
    size: Math.random() * 4 + 4,
  }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-background/80 to-blue-900/30 backdrop-blur-md animate-in fade-in duration-300" />

      {/* Radar Circles */}
      {config.showRadar && (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
          <div
            className="absolute w-64 h-64 rounded-full border-2 border-purple-500/30 animate-radar-pulse"
            style={{ animationDelay: '0s' }}
          />
          <div
            className="absolute w-64 h-64 rounded-full border-2 border-purple-400/20 animate-radar-pulse"
            style={{ animationDelay: '0.7s' }}
          />
          <div
            className="absolute w-64 h-64 rounded-full border-2 border-blue-400/20 animate-radar-pulse"
            style={{ animationDelay: '1.4s' }}
          />
        </div>
      )}

      {/* Floating Particles */}
      {config.showParticles && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute rounded-full bg-gradient-to-br from-purple-400 to-blue-400 animate-particle-float"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                animationDelay: `${particle.delay}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Central Card */}
      <div
        className={`relative max-w-md w-full mx-4 p-8 rounded-2xl border-2 bg-card/80 backdrop-blur-xl animate-card-enter ${
          stage === 'complete'
            ? 'border-green-500/50 animate-success-flash'
            : 'border-purple-500/20'
        }`}
      >
        {/* Search Name */}
        <div className="text-center mb-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Running Search</h3>
          <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            {searchName}
          </h2>
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div
            className={`h-20 w-20 rounded-full flex items-center justify-center ${
              stage === 'complete'
                ? 'bg-green-500/20'
                : 'bg-gradient-to-br from-purple-500/20 to-blue-500/20'
            }`}
          >
            <Icon
              className={`h-10 w-10 ${
                stage === 'complete'
                  ? 'text-green-500'
                  : 'text-purple-500'
              } ${
                stage === 'initializing' || stage === 'scanning' ? 'animate-spin' : ''
              }`}
            />
          </div>
        </div>

        {/* Stage Text */}
        <div className="text-center space-y-3">
          <h3 className="text-2xl font-bold animate-in fade-in duration-300">
            {config.text}
          </h3>

          {/* Dynamic Info */}
          {stage === 'scanning' && (
            <p className="text-muted-foreground animate-in fade-in duration-300">
              {location}
            </p>
          )}

          {(stage === 'analyzing' || stage === 'scoring') && (
            <div className="flex items-center justify-center gap-2 animate-in fade-in duration-300">
              <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {businessCount}
              </div>
              <div className="text-sm sm:text-base text-muted-foreground font-medium">
                {stage === 'analyzing' ? 'businesses found' : 'qualified leads'}
              </div>
            </div>
          )}

          {stage === 'complete' && (
            <div className="text-lg text-green-600 font-semibold animate-in fade-in duration-300">
              {businessCount} leads added successfully
            </div>
          )}
        </div>

        {/* Progress Indicator */}
        {stage !== 'complete' && (
          <div className="mt-6 flex justify-center gap-2">
            {['initializing', 'scanning', 'analyzing', 'scoring'].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  s === stage
                    ? 'w-8 bg-gradient-to-r from-purple-600 to-blue-600'
                    : ['initializing', 'scanning', 'analyzing', 'scoring'].indexOf(s) <
                      ['initializing', 'scanning', 'analyzing', 'scoring'].indexOf(stage)
                    ? 'w-6 bg-purple-600/50'
                    : 'w-6 bg-muted'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
