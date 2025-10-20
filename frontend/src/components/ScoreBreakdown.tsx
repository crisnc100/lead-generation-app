import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { Info, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import type { Lead } from '@/lib/types'

interface ScoreBreakdownProps {
  lead: Lead
}

interface ScoreItem {
  label: string
  points: number
  type: 'positive' | 'negative' | 'neutral'
  reason: string
}

/**
 * Calculate score breakdown based on lead signals
 * This documents the scoring algorithm used in n8n
 */
function calculateScoreBreakdown(lead: Lead): ScoreItem[] {
  const items: ScoreItem[] = []

  // Base score
  items.push({
    label: 'Base Score',
    points: 0,
    type: 'neutral',
    reason: 'Starting point for all leads',
  })

  // POSITIVE SIGNALS (Opportunities)

  // No online booking = opportunity
  if (!lead.has_online_booking) {
    items.push({
      label: 'No Online Booking',
      points: 2,
      type: 'positive',
      reason: 'Business struggles with appointment management - perfect fit for AI booking system',
    })
  }

  // Phone issues in reviews = pain point
  if (lead.phone_issues_in_reviews) {
    items.push({
      label: 'Phone Issues in Reviews',
      points: 2,
      type: 'positive',
      reason: 'Customers complain about phone service - AI receptionist solves this pain point',
    })
  }

  // Late hours = high volume
  if (lead.late_hours) {
    items.push({
      label: 'Late Hours Operation',
      points: 1,
      type: 'positive',
      reason: 'Open early/late means high call volume - AI handles overflow',
    })
  }

  // Outdated website = tech upgrade opportunity
  const currentYear = new Date().getFullYear()
  if (lead.website_copyright_year && lead.website_copyright_year < currentYear - 3) {
    items.push({
      label: 'Outdated Website',
      points: 1,
      type: 'positive',
      reason: `Website copyright ${lead.website_copyright_year} - likely needs tech modernization`,
    })
  }

  // No SSL = security concern
  if (lead.website_exists && !lead.ssl_valid) {
    items.push({
      label: 'No SSL Certificate',
      points: 1,
      type: 'positive',
      reason: 'Lacks basic security - opportunity to position as tech advisor',
    })
  }

  // Not mobile responsive = behind on tech
  if (lead.website_exists && !lead.mobile_responsive) {
    items.push({
      label: 'Not Mobile-Friendly',
      points: 1,
      type: 'positive',
      reason: 'Website not mobile-optimized - indicates tech gap',
    })
  }

  // Good rating = easier sell
  if (lead.rating && lead.rating >= 4.5) {
    items.push({
      label: 'High Rating',
      points: 1,
      type: 'positive',
      reason: `${lead.rating.toFixed(1)}★ - established business, easier to sell to`,
    })
  }

  // High review count = established
  if (lead.review_count && lead.review_count >= 100) {
    items.push({
      label: 'Established Business',
      points: 1,
      type: 'positive',
      reason: `${lead.review_count} reviews - proven track record, can afford solutions`,
    })
  }

  // NEGATIVE SIGNALS (Harder to sell)

  // Has chat widget = already tech-savvy
  if (lead.has_chat_widget) {
    items.push({
      label: 'Already Has Chat Widget',
      points: -1,
      type: 'negative',
      reason: 'Already invested in automated communication - may not see value',
    })
  }

  // Is franchise = harder to sell
  if (lead.is_franchise) {
    items.push({
      label: 'Franchise Location',
      points: -1,
      type: 'negative',
      reason: 'Corporate decisions made at HQ - harder to sell individual location',
    })
  }

  // Low rating = risky
  if (lead.rating && lead.rating < 3.0) {
    items.push({
      label: 'Low Rating',
      points: -1,
      type: 'negative',
      reason: `${lead.rating.toFixed(1)}★ - struggling business, risky to sell to`,
    })
  }

  return items
}

export default function ScoreBreakdown({ lead }: ScoreBreakdownProps) {
  const breakdown = calculateScoreBreakdown(lead)
  const totalPoints = breakdown.reduce((sum, item) => sum + item.points, 0)

  const getScoreBadgeClass = (score: number) => {
    if (score >= 8) return 'bg-green-600 hover:bg-green-700'
    if (score >= 6) return 'bg-yellow-600 hover:bg-yellow-700'
    return 'bg-slate-500 hover:bg-slate-600'
  }

  const getIcon = (type: ScoreItem['type']) => {
    if (type === 'positive') return <CheckCircle2 className="h-4 w-4 text-green-600" />
    if (type === 'negative') return <XCircle className="h-4 w-4 text-red-600" />
    return <AlertCircle className="h-4 w-4 text-slate-500" />
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Badge
          className={`${getScoreBadgeClass(lead.lead_score)} cursor-pointer transition-all duration-200 hover:scale-105`}
        >
          <span className="font-bold">{lead.lead_score}/10</span>
          <Info className="h-3 w-3 ml-1" />
        </Badge>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="start">
        <div className="p-4 border-b bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-base">Lead Score Breakdown</h4>
            <Badge className={getScoreBadgeClass(lead.lead_score)}>
              {lead.lead_score}/10
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground font-medium">
            Why this lead scored {lead.lead_score} points
          </p>
        </div>

        <div className="max-h-96 overflow-y-auto">
          <div className="p-4 space-y-3">
            {breakdown.map((item, index) => (
              <div
                key={index}
                className="flex gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex-shrink-0 mt-0.5">{getIcon(item.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{item.label}</span>
                    <span
                      className={`text-sm font-bold ${
                        item.points > 0
                          ? 'text-green-600'
                          : item.points < 0
                          ? 'text-red-600'
                          : 'text-slate-500'
                      }`}
                    >
                      {item.points > 0 ? '+' : ''}
                      {item.points} {Math.abs(item.points) === 1 ? 'pt' : 'pts'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.reason}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t bg-muted/30">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Total Score</span>
            <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {totalPoints} / 10
            </span>
          </div>
          {lead.why_flagged && (
            <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded text-xs">
              <span className="font-medium text-amber-900">Key Opportunity:</span>{' '}
              <span className="text-amber-800">{lead.why_flagged}</span>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
