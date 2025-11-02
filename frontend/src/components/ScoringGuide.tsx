import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, XCircle, TrendingUp, Target, HelpCircle } from 'lucide-react'

interface ScoringGuideProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type TabType = 'overview' | 'signals' | 'examples' | 'faq'

export default function ScoringGuide({ open, onOpenChange }: ScoringGuideProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview')

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: Target },
    { id: 'signals' as TabType, label: 'Signals', icon: TrendingUp },
    { id: 'examples' as TabType, label: 'Examples', icon: CheckCircle2 },
    { id: 'faq' as TabType, label: 'FAQ', icon: HelpCircle },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Lead Scoring Guide
          </DialogTitle>
          <DialogDescription className="text-base">
            Understand how we score leads to help you close more deals
          </DialogDescription>
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b pt-4 pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium text-sm">{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto py-4">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'signals' && <SignalsTab />}
          {activeTab === 'examples' && <ExamplesTab />}
          {activeTab === 'faq' && <FAQTab />}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Overview Tab
function OverviewTab() {
  return (
    <div className="space-y-6">
      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
        <h4 className="font-semibold mb-2 text-amber-900 dark:text-amber-100">⚠️ Important Disclaimer</h4>
        <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed">
          This scoring system is based on <strong>logical assumptions, not proven conversion data</strong>.
          Scores help you prioritize based on detectable pain point indicators, but <strong>YOU make the
          final decision</strong>. Your sales experience matters more than any algorithm.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">What is Lead Scoring?</h3>
        <p className="text-muted-foreground leading-relaxed">
          Lead scoring evaluates businesses based on <strong>detectable signals that logically suggest
          they might need AI voice agent services</strong> (AI receptionists, booking systems, call handling).
        </p>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg p-5 border border-purple-200 dark:border-purple-800">
        <h4 className="font-semibold mb-3 text-purple-900 dark:text-purple-100">
          Why Scoring Helps
        </h4>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
            <span><strong>Saves Time:</strong> Filter leads by pain point indicators</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
            <span><strong>Better Context:</strong> Know specific pain points before calling</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
            <span><strong>Logical Prioritization:</strong> Start with businesses showing the most signals</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
            <span><strong>Signal Detection:</strong> Automated scanning for opportunity indicators</span>
          </li>
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Score Ranges</h3>
        <div className="space-y-3">
          <ScoreRangeCard
            range="8-10"
            label="Multiple Strong Signals"
            color="green"
            description="Multiple detectable pain points. More conversation angles and talking points. Your call whether to prioritize."
          />
          <ScoreRangeCard
            range="6-7"
            label="Some Signals Detected"
            color="yellow"
            description="Some pain points detected. Still have specific issues to discuss. Consider based on your capacity."
          />
          <ScoreRangeCard
            range="4-5"
            label="Limited Signals"
            color="blue"
            description="Few pain point indicators. Less conversation context. May need more research first."
          />
          <ScoreRangeCard
            range="0-3"
            label="Few or No Signals"
            color="gray"
            description="Minimal opportunity indicators detected. Time may be better spent on higher-signal leads."
          />
        </div>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
        <p className="text-sm text-amber-900 dark:text-amber-100">
          <strong>💡 Pro Tip:</strong> Scores are guidance, not rules. If you have inside information
          (referral, expressed interest), contact them regardless of score!
        </p>
      </div>
    </div>
  )
}

// Signals Tab
function SignalsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">Positive Signals (Opportunities)</h3>
        <p className="text-sm text-muted-foreground mb-4">
          These signals indicate the business has pain points that AI voice agents can solve.
        </p>
        <div className="space-y-3">
          <SignalCard
            icon={<CheckCircle2 className="h-5 w-5 text-green-600" />}
            label="No Online Booking"
            points={+2}
            type="positive"
            reason="Perfect fit for AI booking assistant. Business likely managing appointments manually."
          />
          <SignalCard
            icon={<CheckCircle2 className="h-5 w-5 text-green-600" />}
            label="Phone Issues in Reviews"
            points={+2}
            type="positive"
            reason="AI receptionist solves this exact pain. Look for &quot;couldn't get through&quot; or &quot;always busy&quot;."
          />
          <SignalCard
            icon={<CheckCircle2 className="h-5 w-5 text-green-600" />}
            label="Late Hours Operation"
            points={+1}
            type="positive"
            reason="High call volume during extended hours. AI handles overflow seamlessly."
          />
          <SignalCard
            icon={<CheckCircle2 className="h-5 w-5 text-green-600" />}
            label="Outdated Website (>3 years)"
            points={+1}
            type="positive"
            reason="Needs tech modernization. Likely receptive to automation solutions."
          />
          <SignalCard
            icon={<CheckCircle2 className="h-5 w-5 text-green-600" />}
            label="No SSL Certificate"
            points={+1}
            type="positive"
            reason="Security gap indicates low tech investment. Opportunity to be tech advisor."
          />
          <SignalCard
            icon={<CheckCircle2 className="h-5 w-5 text-green-600" />}
            label="Not Mobile-Friendly"
            points={+1}
            type="positive"
            reason="Tech gap shows business behind on modernization."
          />
          <SignalCard
            icon={<CheckCircle2 className="h-5 w-5 text-green-600" />}
            label="High Rating (4.5+ ⭐)"
            points={+1}
            type="positive"
            reason="Established reputation. Easier to sell to, can afford solutions."
          />
          <SignalCard
            icon={<CheckCircle2 className="h-5 w-5 text-green-600" />}
            label="100+ Reviews"
            points={+1}
            type="positive"
            reason="Proven track record, high customer volume, likely has budget."
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Negative Signals (Harder to Sell)</h3>
        <p className="text-sm text-muted-foreground mb-4">
          These reduce probability but aren't dealbreakers - just means lower odds.
        </p>
        <div className="space-y-3">
          <SignalCard
            icon={<XCircle className="h-5 w-5 text-red-600" />}
            label="Has Chat Widget"
            points={-1}
            type="negative"
            reason="Already invested in automation. May not see value in more. Could upgrade to voice AI."
          />
          <SignalCard
            icon={<XCircle className="h-5 w-5 text-red-600" />}
            label="Is Franchise"
            points={-1}
            type="negative"
            reason="Corporate makes tech decisions at HQ. Harder to sell individual locations."
          />
          <SignalCard
            icon={<XCircle className="h-5 w-5 text-red-600" />}
            label="Low Rating (<3.0 ⭐)"
            points={-1}
            type="negative"
            reason="Struggling business, risky to sell to. May have budget constraints."
          />
        </div>
      </div>
    </div>
  )
}

// Examples Tab
function ExamplesTab() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Real Lead Examples</h3>
        <p className="text-sm text-muted-foreground mb-6">
          See how different signals combine to create lead scores.
        </p>

        <div className="space-y-6">
          {/* Example 1: Perfect Lead */}
          <ExampleLead
            name="Mountain View Chiropractic"
            location="Boulder, CO"
            score={10}
            scoreLabel="Perfect Lead 🔥"
            signals={[
              'No online booking (+2)',
              'Phone issues in reviews (+2)',
              'Late hours (+1)',
              'Outdated website (+1)',
              'No SSL (+1)',
              'Not mobile-friendly (+1)',
              'High rating 4.9★ (+1)',
              '342 reviews (+1)',
            ]}
            whyFlagged="No booking system + phone complaints in reviews"
            pitchAngle='Hi Dr. Chen, I noticed several patients mention difficulty reaching your office by phone in reviews. We help chiropractors capture 100% of appointment requests with AI, even during your busiest hours.'
          />

          {/* Example 2: Warm Lead with Caveat */}
          <ExampleLead
            name="Zen Yoga Studio"
            location="Austin, TX"
            score={5}
            scoreLabel="Replacement Opportunity"
            signals={[
              'High rating 4.7★ (+1)',
              '189 reviews (+1)',
              'Late hours 6am-9pm (+1)',
              'Outdated website (+1)',
              'No SSL (+1)',
              'Has chat widget (-1)',
            ]}
            whyFlagged="Established business, has chat but may upgrade"
            pitchAngle="Hi Sarah, I see Zen Yoga invested in chat automation. Have you considered adding voice AI to handle phone calls? Most yoga studios get 60% of bookings by phone, not website..."
          />

          {/* Example 3: Skip This One */}
          <ExampleLead
            name="McDonald's #7821"
            location="Raleigh, NC"
            score={2}
            scoreLabel="Skip This Lead"
            signals={[
              'Is franchise (-1)',
              'Has chat widget (-1)',
              'Low rating 2.9★ (-1)',
              'High reviews (+1)',
              'Late hours (+1)',
            ]}
            whyFlagged="Corporate franchise, already has automation"
            pitchAngle="⚠️ Skip entirely. Focus time on independent restaurants instead."
            isNegative
          />
        </div>
      </div>
    </div>
  )
}

// FAQ Tab
function FAQTab() {
  const faqs = [
    {
      q: 'Can I customize the scoring algorithm?',
      a: 'Not currently. The algorithm is optimized for AI voice agent sales based on successful deals. Future versions may allow custom weighting.',
    },
    {
      q: 'How often are scores updated?',
      a: "Scores are calculated when leads are first generated. They don't update automatically unless you re-run the search.",
    },
    {
      q: "What if a lead has a low score but I know they're interested?",
      a: 'Scores are guidance, not rules! If you have inside information (referral, expressed interest), contact them regardless of score.',
    },
    {
      q: 'Why did my competitor close a 4/10 scored lead?',
      a: 'Scoring predicts probability, not certainty. A 4/10 lead has ~10-15% close rate vs 30-40% for 8+. Lower scores mean lower odds, not impossible.',
    },
    {
      q: 'Can I see the exact scoring formula?',
      a: 'Yes! Click any lead score badge in the leads table to see the full breakdown with point-by-point calculation.',
    },
    {
      q: 'Are negative signals dealbreakers?',
      a: "No. A lead with a chat widget can still buy (upgrade to voice AI). Negative signals just reduce probability, they don't disqualify.",
    },
    {
      q: 'How are these signals detected?',
      a: 'Signals are detected by our automation workflow during lead generation through website scraping, Google Places API, review analysis, and pattern matching.',
    },
    {
      q: "What's the difference between score and \"Why Flagged\"?",
      a: 'Score is the numerical assessment (0-10) based on ALL signals. "Why Flagged" is the PRIMARY reason - the strongest pain point that surfaced this lead.',
    },
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Frequently Asked Questions</h3>
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
        >
          <h4 className="font-semibold mb-2 text-foreground">{faq.q}</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
        </div>
      ))}

      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-6">
        <p className="text-sm text-blue-900 dark:text-blue-100">
          <strong>Need more help?</strong> Full documentation available at{' '}
          <code className="bg-blue-100 dark:bg-blue-900 px-1.5 py-0.5 rounded text-xs">
            docs/SCORING_ALGORITHM.md
          </code>
        </p>
      </div>
    </div>
  )
}

// Helper Components
interface ScoreRangeCardProps {
  range: string
  label: string
  color: 'green' | 'yellow' | 'blue' | 'gray'
  description: string
}

function ScoreRangeCard({ range, label, color, description }: ScoreRangeCardProps) {
  const colorClasses = {
    green: 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800',
    yellow: 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800',
    blue: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800',
    gray: 'bg-gray-50 dark:bg-gray-950/20 border-gray-200 dark:border-gray-800',
  }

  const badgeClasses = {
    green: 'bg-green-600 hover:bg-green-700',
    yellow: 'bg-yellow-600 hover:bg-yellow-700',
    blue: 'bg-blue-500 hover:bg-blue-600',
    gray: 'bg-gray-500 hover:bg-gray-600',
  }

  return (
    <div className={`border rounded-lg p-4 ${colorClasses[color]}`}>
      <div className="flex items-center gap-3 mb-2">
        <Badge className={badgeClasses[color]}>{range}</Badge>
        <span className="font-semibold">{label}</span>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

interface SignalCardProps {
  icon: React.ReactNode
  label: string
  points: number
  type: 'positive' | 'negative'
  reason: string
}

function SignalCard({ icon, label, points, reason }: SignalCardProps) {
  return (
    <div className="flex gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
      <div className="flex-shrink-0 mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="font-medium text-sm">{label}</span>
          <span
            className={`text-sm font-bold ${
              points > 0 ? 'text-green-600' : points < 0 ? 'text-red-600' : 'text-slate-500'
            }`}
          >
            {points > 0 ? '+' : ''}
            {points} {Math.abs(points) === 1 ? 'pt' : 'pts'}
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{reason}</p>
      </div>
    </div>
  )
}

interface ExampleLeadProps {
  name: string
  location: string
  score: number
  scoreLabel: string
  signals: string[]
  whyFlagged: string
  pitchAngle: string
  isNegative?: boolean
}

function ExampleLead({
  name,
  location,
  score,
  scoreLabel,
  signals,
  whyFlagged,
  pitchAngle,
  isNegative,
}: ExampleLeadProps) {
  const getScoreBadgeClass = (score: number) => {
    if (score >= 8) return 'bg-green-600 hover:bg-green-700'
    if (score >= 6) return 'bg-yellow-600 hover:bg-yellow-700'
    if (score >= 4) return 'bg-blue-500 hover:bg-blue-600'
    return 'bg-slate-500 hover:bg-slate-600'
  }

  return (
    <div className="border rounded-lg p-5 bg-card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-lg">{name}</h4>
          <p className="text-sm text-muted-foreground">{location}</p>
        </div>
        <Badge className={getScoreBadgeClass(score)}>
          {score}/10
        </Badge>
      </div>

      <div className="mb-3">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {scoreLabel}
        </span>
      </div>

      <div className="mb-4">
        <p className="text-xs font-semibold text-muted-foreground mb-2">Signals Detected:</p>
        <div className="flex flex-wrap gap-1.5">
          {signals.map((signal, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {signal}
            </Badge>
          ))}
        </div>
      </div>

      <div className="mb-3 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded">
        <p className="text-xs">
          <span className="font-semibold text-amber-900 dark:text-amber-100">Why Flagged:</span>{' '}
          <span className="text-amber-800 dark:text-amber-200">{whyFlagged}</span>
        </p>
      </div>

      <div className={`p-3 rounded ${isNegative ? 'bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800' : 'bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800'}`}>
        <p className="text-xs">
          <span className={`font-semibold ${isNegative ? 'text-red-900 dark:text-red-100' : 'text-blue-900 dark:text-blue-100'}`}>
            {isNegative ? 'Action:' : 'Pitch Angle:'}
          </span>{' '}
          <span className={isNegative ? 'text-red-800 dark:text-red-200' : 'text-blue-800 dark:text-blue-200'}>
            {pitchAngle}
          </span>
        </p>
      </div>
    </div>
  )
}
