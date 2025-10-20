import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Sparkles, TrendingUp, MapPin } from 'lucide-react'
import {
  searchTemplates,
  categoryLabels,
  type SearchTemplate,
} from '@/data/searchTemplates'

interface TemplateLibraryProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectTemplate: (template: SearchTemplate) => void
}

type CategoryFilter = 'all' | SearchTemplate['category']

export default function TemplateLibrary({
  open,
  onOpenChange,
  onSelectTemplate,
}: TemplateLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all')

  // Filter templates
  const filteredTemplates = searchTemplates.filter((template) => {
    const matchesSearch =
      searchQuery === '' ||
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.niche.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory =
      categoryFilter === 'all' || template.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  const handleSelectTemplate = (template: SearchTemplate) => {
    onSelectTemplate(template)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Search Templates
          </DialogTitle>
          <DialogDescription className="leading-relaxed">
            Get started in 30 seconds with proven lead searches. Select a template, enter
            your location, and start finding qualified leads.
          </DialogDescription>
        </DialogHeader>

        {/* Search & Filters */}
        <div className="space-y-4 py-4 border-b">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates... (e.g., 'gym', 'plumber', 'restaurant')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            <Button
              variant={categoryFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCategoryFilter('all')}
              className={
                categoryFilter === 'all'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                  : ''
              }
            >
              All Templates
            </Button>
            {Object.entries(categoryLabels).map(([key, label]) => (
              <Button
                key={key}
                variant={categoryFilter === key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCategoryFilter(key as SearchTemplate['category'])}
                className={
                  categoryFilter === key
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                    : ''
                }
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto py-4">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto h-16 w-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No templates found</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Try adjusting your search or category filter to find what you're looking for.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTemplates.map((template, index) => (
                <div
                  key={template.id}
                  className="border rounded-lg p-5 hover:border-purple-300 hover:shadow-md transition-all duration-200 cursor-pointer animate-in fade-in"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationDuration: '300ms',
                  }}
                  onClick={() => handleSelectTemplate(template)}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <template.icon className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-base leading-tight mb-1">
                          {template.name}
                        </h3>
                        <p className="text-sm text-muted-foreground font-medium">
                          {template.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      {template.popular && (
                        <Badge className="bg-amber-500 text-white text-xs">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Popular
                        </Badge>
                      )}
                      {template.new && (
                        <Badge className="bg-green-500 text-white text-xs">
                          <Sparkles className="h-3 w-3 mr-1" />
                          New
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-start gap-2 text-sm">
                      <span className="text-muted-foreground font-medium min-w-20">
                        Searches:
                      </span>
                      <span className="text-foreground">{template.niche}</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <span className="text-muted-foreground font-medium min-w-20">
                        Why it works:
                      </span>
                      <span className="text-foreground text-sm leading-relaxed">
                        {template.whyItWorks}
                      </span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground font-medium">
                        {template.estimatedLeadsPerMonth}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSelectTemplate(template)
                      }}
                    >
                      Use Template
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Stats */}
        <div className="border-t pt-4 text-center text-sm text-muted-foreground">
          Showing {filteredTemplates.length} of {searchTemplates.length} templates
        </div>
      </DialogContent>
    </Dialog>
  )
}
