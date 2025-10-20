import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import AppLayout from '@/components/AppLayout'
import TableSkeleton from '@/components/TableSkeleton'
import ScoreBreakdown from '@/components/ScoreBreakdown'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Download, ExternalLink, Search, Users, Plus } from 'lucide-react'
import { useLeads, exportLeadsToCSV } from '@/hooks/useLeads'
import { useSavedSearches } from '@/hooks/useSavedSearches'

export default function LeadsPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSearchId, setSelectedSearchId] = useState<string>('all')
  const [minScore, setMinScore] = useState<string>('any')

  // Build filters object
  const filters = {
    searchQuery: searchQuery || undefined,
    searchId: selectedSearchId !== 'all' ? selectedSearchId : undefined,
    minScore: minScore !== 'any' ? parseInt(minScore) : undefined,
  }

  const { data: leads, isLoading } = useLeads(filters)
  const { data: savedSearches } = useSavedSearches()

  const handleExport = () => {
    if (leads && leads.length > 0) {
      const timestamp = new Date().toISOString().split('T')[0]
      exportLeadsToCSV(leads, `leads-${timestamp}.csv`)
    }
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedSearchId('all')
    setMinScore('any')
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Leads
            </h1>
            <p className="text-muted-foreground mt-1">
              All qualified leads from your searches
            </p>
          </div>
          <Button
            onClick={handleExport}
            disabled={!leads || leads.length === 0}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-5 w-5 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Filters */}
        <div className="border rounded-xl p-6 bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm shadow-md">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-foreground">Filter Leads</h3>
            {(searchQuery || selectedSearchId !== 'all' || minScore !== 'any') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-8 text-xs hover:bg-secondary/80 cursor-pointer transition-colors"
              >
                Clear All
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search" className="text-sm font-medium">Search Name</Label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search leads..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="saved-search" className="text-sm font-medium">Saved Search</Label>
              <Select value={selectedSearchId} onValueChange={setSelectedSearchId}>
                <SelectTrigger id="saved-search">
                  <SelectValue placeholder="All searches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All searches</SelectItem>
                  {savedSearches?.map((search) => (
                    <SelectItem key={search.id} value={search.id}>
                      {search.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="min-score" className="text-sm font-medium">Min Score</Label>
              <Select value={minScore} onValueChange={setMinScore}>
                <SelectTrigger id="min-score">
                  <SelectValue placeholder="Any score" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any score</SelectItem>
                  <SelectItem value="8">8+ (High)</SelectItem>
                  <SelectItem value="6">6+ (Medium)</SelectItem>
                  <SelectItem value="4">4+ (Low)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results count */}
          {leads && (
            <div className="mt-5 pt-4 border-t flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {leads.length === 0
                  ? 'No leads match your filters'
                  : `Showing ${leads.length} ${leads.length === 1 ? 'lead' : 'leads'}`
                }
              </span>
              {leads.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {leads.length} result{leads.length !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Leads Table */}
        {isLoading ? (
          <TableSkeleton
            columns={8}
            rows={5}
            headers={['Business', 'Contact', 'Location', 'Score', 'Signals', 'Rating', 'Added', 'Actions']}
          />
        ) : !leads || leads.length === 0 ? (
          <div className="border border-dashed rounded-lg p-12 text-center animate-in fade-in duration-300">
            <div className="mx-auto h-16 w-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No leads yet</h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              Create and run a saved search to start generating qualified leads automatically
            </p>
            <Button
              onClick={() => navigate('/searches')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Search
            </Button>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden animate-in fade-in duration-300">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Business</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Signals</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Added</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead, index) => (
                    <TableRow
                      key={lead.id}
                      className="transition-colors hover:bg-muted/50 animate-in fade-in"
                      style={{ animationDelay: `${index * 50}ms`, animationDuration: '300ms' }}
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium">{lead.name}</div>
                          {lead.is_franchise && (
                            <Badge variant="secondary" className="mt-1 text-xs transition-all duration-200 hover:scale-105">
                              Franchise
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm space-y-1">
                          {lead.phone && <div>{lead.phone}</div>}
                          {lead.email && (
                            <div className="text-muted-foreground">{lead.email}</div>
                          )}
                          {lead.website && (
                            <a
                              href={lead.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline flex items-center gap-1"
                            >
                              Website
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {lead.city && lead.state && (
                            <div>
                              {lead.city}, {lead.state}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <ScoreBreakdown lead={lead} />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {lead.has_online_booking && (
                            <Badge variant="outline" className="text-xs transition-all duration-200 hover:scale-105 hover:bg-accent">
                              Booking
                            </Badge>
                          )}
                          {lead.has_chat_widget && (
                            <Badge variant="outline" className="text-xs transition-all duration-200 hover:scale-105 hover:bg-accent">
                              Chat
                            </Badge>
                          )}
                          {lead.late_hours && (
                            <Badge variant="outline" className="text-xs transition-all duration-200 hover:scale-105 hover:bg-accent">
                              Late Hours
                            </Badge>
                          )}
                          {lead.phone_issues_in_reviews && (
                            <Badge variant="destructive" className="text-xs transition-all duration-200 hover:scale-105">
                              Phone Issues
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {lead.rating && (
                          <div className="text-sm">
                            <div className="font-medium">{lead.rating.toFixed(1)} ⭐</div>
                            {lead.review_count && (
                              <div className="text-muted-foreground text-xs">
                                {lead.review_count} reviews
                              </div>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(lead.created_at), {
                          addSuffix: true,
                        })}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled
                          className="cursor-not-allowed opacity-50"
                        >
                          Push to GHL
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
