import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { SavedSearch, SavedSearchFormData } from '@/lib/types'

interface SavedSearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: SavedSearchFormData) => void
  initialData?: SavedSearch
  templateData?: Partial<SavedSearchFormData>
  isLoading?: boolean
}

export default function SavedSearchDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  templateData,
  isLoading,
}: SavedSearchDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SavedSearchFormData>({
    defaultValues: initialData
      ? {
          name: initialData.name,
          niche: initialData.niche,
          location: initialData.location,
          radius_miles: initialData.radius_miles,
          service: initialData.service,
          min_score: initialData.min_score,
        }
      : templateData
      ? {
          name: templateData.name || '',
          niche: templateData.niche || '',
          location: templateData.location || '',
          radius_miles: templateData.radius_miles || 25,
          service: templateData.service || 'AI Receptionist',
          min_score: templateData.min_score || 7,
        }
      : {
          name: '',
          niche: '',
          location: '',
          radius_miles: 25,
          service: 'AI Receptionist',
          min_score: 7,
        },
  })

  // Reset form when dialog opens/closes or initial/template data changes
  useEffect(() => {
    if (open && initialData) {
      reset({
        name: initialData.name,
        niche: initialData.niche,
        location: initialData.location,
        radius_miles: initialData.radius_miles,
        service: initialData.service,
        min_score: initialData.min_score,
      })
    } else if (open && templateData) {
      reset({
        name: templateData.name || '',
        niche: templateData.niche || '',
        location: templateData.location || '',
        radius_miles: templateData.radius_miles || 25,
        service: templateData.service || 'AI Receptionist',
        min_score: templateData.min_score || 7,
      })
    } else if (!open) {
      reset()
    }
  }, [open, initialData, templateData, reset])

  const handleFormSubmit = (data: SavedSearchFormData) => {
    onSubmit(data)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px] shadow-xl">
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogHeader className="space-y-3 pb-2">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {initialData ? 'Edit Search' : templateData ? 'Customize Template' : 'Create New Search'}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground leading-relaxed">
              {templateData
                ? 'Template pre-filled - just add your location and customize as needed'
                : 'Configure your lead search parameters to find qualified prospects automatically'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Search Name *
              </Label>
              <Input
                id="name"
                placeholder="e.g., Los Angeles Yoga Studios"
                {...register('name', { required: 'Search name is required' })}
              />
              {errors.name && (
                <p className="text-sm text-destructive font-medium">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="niche" className="text-sm font-medium">
                Business Niche *
              </Label>
              <Input
                id="niche"
                placeholder="e.g., yoga studio, gym, wellness center"
                {...register('niche', { required: 'Niche is required' })}
              />
              {errors.niche && (
                <p className="text-sm text-destructive font-medium">{errors.niche.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium">
                Location *
              </Label>
              <Input
                id="location"
                placeholder="e.g., Los Angeles, CA"
                {...register('location', { required: 'Location is required' })}
              />
              {errors.location && (
                <p className="text-sm text-destructive font-medium">{errors.location.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="radius_miles" className="text-sm font-medium">
                  Radius (miles)
                </Label>
                <Input
                  id="radius_miles"
                  type="number"
                  min="1"
                  max="100"
                  {...register('radius_miles', {
                    valueAsNumber: true,
                    min: { value: 1, message: 'Minimum radius is 1 mile' },
                    max: { value: 100, message: 'Maximum radius is 100 miles' },
                  })}
                />
                {errors.radius_miles && (
                  <p className="text-sm text-destructive font-medium">{errors.radius_miles.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="min_score" className="text-sm font-medium">
                  Min Lead Score
                </Label>
                <Input
                  id="min_score"
                  type="number"
                  min="0"
                  max="10"
                  {...register('min_score', {
                    valueAsNumber: true,
                    min: { value: 0, message: 'Minimum score is 0' },
                    max: { value: 10, message: 'Maximum score is 10' },
                  })}
                />
                {errors.min_score && (
                  <p className="text-sm text-destructive font-medium">{errors.min_score.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="service" className="text-sm font-medium">
                Service Offering
              </Label>
              <Input
                id="service"
                placeholder="e.g., AI Receptionist"
                {...register('service')}
              />
            </div>
          </div>

          <DialogFooter className="gap-3 pt-4 border-t border-slate-200 dark:border-[#1f2a3d]">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="justify-center border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 focus-visible:ring-slate-300 dark:border-[#22324a] dark:bg-[#16233a] dark:text-slate-200 dark:hover:bg-[#22324a] dark:hover:text-white dark:focus-visible:ring-[#3b82f6]/40 transition-colors"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
            >
              {isLoading ? 'Saving...' : initialData ? 'Update Search' : 'Create Search'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
