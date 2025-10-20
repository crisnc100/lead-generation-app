import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import AppLayout from '@/components/AppLayout'
import SavedSearchDialog from '@/components/SavedSearchDialog'
import SearchGeneratingAnimation from '@/components/SearchGeneratingAnimation'
import TemplateLibrary from '@/components/TemplateLibrary'
import TableSkeleton from '@/components/TableSkeleton'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Plus, Play, Pencil, Trash2, Loader2, Search as SearchIcon, Sparkles } from 'lucide-react'
import {
  useSavedSearches,
  useCreateSavedSearch,
  useUpdateSavedSearch,
  useDeleteSavedSearch,
  useTriggerSearch,
} from '@/hooks/useSavedSearches'
import type { SavedSearch, SavedSearchFormData } from '@/lib/types'
import type { SearchTemplate } from '@/data/searchTemplates'

export default function SearchesPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [templateLibraryOpen, setTemplateLibraryOpen] = useState(false)
  const [editingSearch, setEditingSearch] = useState<SavedSearch | null>(null)
  const [templateData, setTemplateData] = useState<Partial<SavedSearchFormData> | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [searchToDelete, setSearchToDelete] = useState<string | null>(null)
  const [runningSearchId, setRunningSearchId] = useState<string | null>(null)
  const [runningSearch, setRunningSearch] = useState<SavedSearch | null>(null)

  // Queries and mutations
  const { data: searches, isLoading } = useSavedSearches()
  const createMutation = useCreateSavedSearch()
  const updateMutation = useUpdateSavedSearch()
  const deleteMutation = useDeleteSavedSearch()
  const triggerMutation = useTriggerSearch()

  // Handlers
  const handleCreate = () => {
    setEditingSearch(null)
    setTemplateData(null)
    setDialogOpen(true)
  }

  const handleBrowseTemplates = () => {
    setTemplateLibraryOpen(true)
  }

  const handleTemplateSelect = (template: SearchTemplate) => {
    // Convert template to form data (leave location empty for user to fill)
    const formData: Partial<SavedSearchFormData> = {
      name: template.name,
      niche: template.niche,
      location: '', // User must enter their location
      radius_miles: template.defaultRadius,
      service: template.service,
      min_score: template.defaultMinScore,
    }
    setTemplateData(formData)
    setEditingSearch(null)
    setDialogOpen(true)
  }

  const handleEdit = (search: SavedSearch) => {
    setEditingSearch(search)
    setTemplateData(null)
    setDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setSearchToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (searchToDelete) {
      await deleteMutation.mutateAsync(searchToDelete)
      setDeleteDialogOpen(false)
      setSearchToDelete(null)
    }
  }

  const handleSubmit = async (data: SavedSearchFormData) => {
    if (editingSearch) {
      await updateMutation.mutateAsync({ id: editingSearch.id, updates: data })
    } else {
      await createMutation.mutateAsync(data)
    }
    setDialogOpen(false)
    setEditingSearch(null)
  }

  const handleRunSearch = async (search: SavedSearch) => {
    setRunningSearchId(search.id)
    setRunningSearch(search)
    try {
      await triggerMutation.mutateAsync(search.id)
    } catch (error) {
      setRunningSearchId(null)
      setRunningSearch(null)
    }
  }

  const handleAnimationComplete = () => {
    setRunningSearchId(null)
    setRunningSearch(null)
  }

  const formatLastRun = (lastRunAt: string | null) => {
    if (!lastRunAt) return 'Never'
    return formatDistanceToNow(new Date(lastRunAt), { addSuffix: true })
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Saved Searches
            </h1>
            <p className="text-muted-foreground mt-1">
              Create and manage your automated lead searches
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleBrowseTemplates}
              size="lg"
              className="border border-purple-200 bg-background text-foreground hover:bg-secondary hover:border-purple-300 dark:border-purple-700 dark:hover:border-purple-600 transition-all duration-200 cursor-pointer"
            >
              <Sparkles className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
              Browse Templates
            </Button>
            <Button
              onClick={handleCreate}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Search
            </Button>
          </div>
        </div>

        {/* Searches Table */}
        {isLoading ? (
          <TableSkeleton
            columns={9}
            rows={5}
            headers={['Name', 'Niche', 'Location', 'Radius', 'Min Score', 'Status', 'Last Run', 'Leads', 'Actions']}
          />
        ) : !searches || searches.length === 0 ? (
          <div className="border border-dashed rounded-lg p-12 text-center animate-in fade-in duration-300">
            <div className="mx-auto h-16 w-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-4">
              <SearchIcon className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No saved searches yet</h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              Create your first automated lead search to start finding qualified prospects
            </p>
            <Button onClick={handleCreate} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-200">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Search
            </Button>
          </div>
        ) : (
          <div className="border rounded-lg animate-in fade-in duration-300">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Niche</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Radius</TableHead>
                  <TableHead>Min Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Run</TableHead>
                  <TableHead>Leads</TableHead>
                  <TableHead className="w-[200px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searches.map((search, index) => (
                  <TableRow
                    key={search.id}
                    className="transition-colors hover:bg-muted/50 animate-in fade-in"
                    style={{ animationDelay: `${index * 50}ms`, animationDuration: '300ms' }}
                  >
                    <TableCell className="font-medium">{search.name}</TableCell>
                    <TableCell>{search.niche}</TableCell>
                    <TableCell>{search.location}</TableCell>
                    <TableCell>{search.radius_miles} mi</TableCell>
                    <TableCell>{search.min_score}/10</TableCell>
                    <TableCell>
                      <Badge
                        variant={search.enabled ? 'default' : 'secondary'}
                        className="transition-all duration-200 hover:scale-105"
                      >
                        {search.enabled ? 'Active' : 'Paused'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatLastRun(search.last_run_at)}
                    </TableCell>
                    <TableCell>
                      {search.last_run_count > 0 ? (
                        <Badge variant="outline" className="transition-all duration-200 hover:scale-105 hover:bg-accent">
                          {search.last_run_count} lead{search.last_run_count !== 1 ? 's' : ''}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">No leads yet</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleRunSearch(search)}
                          disabled={runningSearchId === search.id}
                          className={runningSearchId === search.id
                            ? "relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-[length:200%_100%] animate-shimmer cursor-wait border-0"
                            : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-200 cursor-pointer hover:shadow-md"
                          }
                        >
                          {runningSearchId === search.id ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                              <span className="hidden sm:inline font-medium tracking-wide">Running...</span>
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4 sm:mr-1" />
                              <span className="hidden sm:inline">Run</span>
                            </>
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(search)}
                          className="cursor-pointer hover:bg-secondary/80 transition-colors"
                          title="Edit search"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(search.id)}
                          className="text-destructive hover:bg-destructive/15 hover:text-destructive focus-visible:ring-destructive/40 dark:hover:bg-destructive/25 transition-colors"
                          title="Delete search"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Template Library */}
        <TemplateLibrary
          open={templateLibraryOpen}
          onOpenChange={setTemplateLibraryOpen}
          onSelectTemplate={handleTemplateSelect}
        />

        {/* Create/Edit Dialog */}
        <SavedSearchDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={handleSubmit}
          initialData={editingSearch || undefined}
          templateData={templateData || undefined}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="shadow-xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-semibold">
                Delete Search?
              </AlertDialogTitle>
              <AlertDialogDescription className="leading-relaxed">
                This action cannot be undone. This will permanently delete the saved search
                and all associated leads.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-3">
              <AlertDialogCancel
                variant="outline"
                className="justify-center border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 focus-visible:ring-slate-300 dark:border-[#22324a] dark:bg-[#16233a] dark:text-slate-200 dark:hover:bg-[#22324a] dark:hover:text-white dark:focus-visible:ring-[#3b82f6]/40 transition-colors"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                variant="destructive"
                className="justify-center bg-red-600 text-white hover:bg-red-500 focus-visible:ring-red-400 shadow-lg hover:shadow-xl transition-all dark:bg-[#ef4444] dark:hover:bg-[#f87171] dark:focus-visible:ring-[#fb7185]/40"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Search Generating Animation */}
        <SearchGeneratingAnimation
          open={!!runningSearch}
          searchName={runningSearch?.name || ''}
          location={runningSearch?.location || ''}
          onComplete={handleAnimationComplete}
        />
      </div>
    </AppLayout>
  )
}
