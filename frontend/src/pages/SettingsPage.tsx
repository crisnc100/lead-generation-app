import { useState } from 'react'
import { useForm } from 'react-hook-form'
import AppLayout from '@/components/AppLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
import { Check, ExternalLink, Copy, AlertCircle } from 'lucide-react'
import { useWorkspace } from '@/hooks/useWorkspace'
import { useGHLIntegration, useDisconnectIntegration, useWorkspaceStats } from '@/hooks/useIntegrations'
import { supabase } from '@/lib/supabase'
import { toast } from '@/lib/toast'

interface WorkspaceFormData {
  name: string
}

export default function SettingsPage() {
  const { workspace, loading } = useWorkspace()
  const { data: ghlIntegration, isLoading: ghlLoading } = useGHLIntegration()
  const { data: stats } = useWorkspaceStats()
  const disconnectMutation = useDisconnectIntegration()

  const [isEditingName, setIsEditingName] = useState(false)
  const [disconnectDialogOpen, setDisconnectDialogOpen] = useState(false)
  const [copiedWebhook, setCopiedWebhook] = useState(false)

  const { register, handleSubmit, reset } = useForm<WorkspaceFormData>({
    defaultValues: {
      name: workspace?.name || '',
    },
  })

  const handleUpdateWorkspace = async (data: WorkspaceFormData) => {
    if (!workspace) return

    const { error } = await supabase
      .from('workspaces')
      .update({ name: data.name, updated_at: new Date().toISOString() })
      .eq('id', workspace.id)

    if (error) {
      toast.error('Failed to update workspace', {
        description: error.message,
      })
      return
    }

    toast.success('Workspace updated')
    setIsEditingName(false)
    window.location.reload() // Refresh to update context
  }

  const handleConnectGHL = () => {
    // In a real app, this would redirect to GoHighLevel OAuth
    // For now, we'll show a placeholder message
    alert('GoHighLevel OAuth integration coming soon!\n\nThis will redirect you to GoHighLevel to authorize access.')
  }

  const handleDisconnect = () => {
    if (!ghlIntegration) return
    disconnectMutation.mutate(ghlIntegration.id, {
      onSuccess: () => {
        setDisconnectDialogOpen(false)
      },
    })
  }

  const copyWebhookUrl = () => {
    if (!workspace) return
    const webhookUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/trigger-search`
    navigator.clipboard.writeText(webhookUrl)
    setCopiedWebhook(true)
    toast.success('Webhook URL copied!')
    setTimeout(() => setCopiedWebhook(false), 2000)
  }

  const getPlanBadge = (plan: string) => {
    if (plan === 'agency') return <Badge className="bg-purple-600">Agency</Badge>
    if (plan === 'pro') return <Badge className="bg-blue-600">Pro</Badge>
    return <Badge variant="secondary">Free</Badge>
  }

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-600'
    if (percentage >= 70) return 'bg-yellow-600'
    return 'bg-green-600'
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AppLayout>
    )
  }

  if (!workspace) {
    return (
      <AppLayout>
        <div className="space-y-3 text-center py-12">
          <h2 className="text-xl font-semibold">No workspace available</h2>
          <p className="text-muted-foreground">
            Create a workspace or contact an administrator to be added to one before managing
            settings.
          </p>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-muted-foreground mt-1">Manage your workspace and integrations</p>
        </div>

        {/* Workspace Settings */}
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader>
            <CardTitle>Workspace Settings</CardTitle>
            <CardDescription>Manage your workspace information and plan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Workspace Name */}
            <div className="space-y-2">
              <Label htmlFor="workspace-name">Workspace Name</Label>
              {isEditingName ? (
                <form onSubmit={handleSubmit(handleUpdateWorkspace)} className="flex gap-2">
                  <Input
                    id="workspace-name"
                    {...register('name', { required: true })}
                    className="flex-1"
                  />
                  <Button type="submit" size="sm">
                    Save
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsEditingName(false)
                      reset()
                    }}
                  >
                    Cancel
                  </Button>
                </form>
              ) : (
                <div className="flex items-center gap-2">
                  <Input value={workspace.name} disabled className="flex-1" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingName(true)}
                    className="cursor-pointer hover:bg-secondary transition-colors"
                  >
                    Edit
                  </Button>
                </div>
              )}
            </div>

            {/* Current Plan */}
            <div className="space-y-2">
              <Label>Current Plan</Label>
              <div className="flex items-center gap-2">
                {getPlanBadge(workspace.plan)}
                <span className="text-sm text-muted-foreground">
                  {workspace.monthly_lead_limit} leads per month
                </span>
              </div>
            </div>

            {/* Usage Stats */}
            {stats && (
              <div className="space-y-4 pt-4 border-t">
                <Label>Usage This Month</Label>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>
                      {stats.leadsThisMonth} / {stats.monthlyLimit} leads
                    </span>
                    <span className="text-muted-foreground">{stats.percentageUsed}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${getUsageColor(stats.percentageUsed)}`}
                      style={{ width: `${Math.min(stats.percentageUsed, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <div className="text-2xl font-bold">{stats.totalLeads}</div>
                    <div className="text-sm text-muted-foreground font-medium">Total Leads</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold">{stats.savedSearches}</div>
                    <div className="text-sm text-muted-foreground font-medium">Saved Searches</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* GoHighLevel Integration */}
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader>
            <CardTitle>GoHighLevel Integration</CardTitle>
            <CardDescription>Connect your GoHighLevel account to push leads automatically</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {ghlLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : ghlIntegration ? (
              <>
                {/* Connected State */}
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 bg-green-600 rounded-full flex items-center justify-center">
                      <Check className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Connected to GoHighLevel</div>
                    <div className="text-sm text-muted-foreground">
                      Connected on {new Date(ghlIntegration.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => setDisconnectDialogOpen(true)}>
                    Disconnect
                  </Button>
                </div>

                {/* Webhook URL */}
                <div className="space-y-2">
                  <Label>n8n Webhook URL</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Use this webhook URL in your n8n workflow to trigger searches
                  </p>
                  <div className="flex gap-2">
                    <Input
                      value={`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/trigger-search`}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button variant="outline" size="sm" onClick={copyWebhookUrl}>
                      {copiedWebhook ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg mt-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900">
                      <strong>Note:</strong> Include your workspace ID in the webhook payload:{' '}
                      <code className="bg-blue-100 px-1 py-0.5 rounded">
                        {`{"workspace_id": "${workspace.id}"}`}
                      </code>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Not Connected State */}
                <div className="text-center py-8">
                  <div className="mx-auto h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <ExternalLink className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Not Connected</h3>
                  <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                    Connect your GoHighLevel account to automatically push qualified leads to your CRM.
                  </p>
                  <Button onClick={handleConnectGHL}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Connect GoHighLevel
                  </Button>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-medium mb-2">What you'll get:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      Automatic lead syncing to your GoHighLevel account
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      Custom field mapping and tagging
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      Real-time webhook notifications
                    </li>
                  </ul>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Disconnect Confirmation Dialog */}
        <AlertDialog open={disconnectDialogOpen} onOpenChange={setDisconnectDialogOpen}>
          <AlertDialogContent className="shadow-xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Disconnect GoHighLevel?</AlertDialogTitle>
              <AlertDialogDescription>
                This will remove the integration and stop automatic lead syncing. You can reconnect at
                any time.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDisconnect} disabled={disconnectMutation.isPending}>
                {disconnectMutation.isPending ? 'Disconnecting...' : 'Disconnect'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  )
}
