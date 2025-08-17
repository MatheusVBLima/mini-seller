import { useState, useEffect } from "react"
import type { Lead, Opportunity } from "../types"
import { api } from "../lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { RefreshCw } from "lucide-react"
import { LeadsTable } from "./leads-table"
import { OpportunitiesTable } from "./opportunities-table"
import { LeadDetailPanel } from "./lead-detail-panel"
import { ConvertLeadDialog } from "./convert-lead-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Badge } from "./ui/badge"
import { Skeleton } from "./ui/skeleton"
import { toast } from "sonner"

function DataSkeleton() {
  return (
    <div className="space-y-6">
      {/* Tabs skeleton */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg max-w-md">
        <Skeleton className="h-9 flex-1" />
        <Skeleton className="h-9 flex-1" />
      </div>

      {/* Table header skeleton */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Skeleton className="h-6 w-24" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        {/* Table skeleton */}
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function DataContent() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isLeadPanelOpen, setIsLeadPanelOpen] = useState(false)
  const [isConvertDialogOpen, setIsConvertDialogOpen] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }
    setError(null)

    try {
      const [leadsResponse, oppsResponse] = await Promise.all([api.getLeads(), api.getOpportunities()])

      if (leadsResponse.success) {
        setLeads(leadsResponse.data)
      } else {
        setError(leadsResponse.error || "Failed to load leads")
      }

      if (oppsResponse.success) {
        setOpportunities(oppsResponse.data)
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    loadData(true)
  }

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead)
    setIsLeadPanelOpen(true)
  }

  const handleCloseLead = () => {
    setIsLeadPanelOpen(false)
    setSelectedLead(null)
  }

  const handleLeadUpdate = (updatedLead: Lead) => {
    setLeads((prevLeads) => prevLeads.map((lead) => (lead.id === updatedLead.id ? updatedLead : lead)))
    setSelectedLead(updatedLead)
  }

  const handleConvertLead = (lead: Lead) => {
    setSelectedLead(lead)
    setIsConvertDialogOpen(true)
  }

  const handleConvertDialogClose = () => {
    setIsConvertDialogOpen(false)
  }

  const handleConvertSuccess = (newOpportunity: Opportunity) => {
    setOpportunities((prev) => [...prev, newOpportunity])
    setIsConvertDialogOpen(false)
    setIsLeadPanelOpen(false)
    toast.success("Lead Converted", {
      description: `Successfully converted ${selectedLead?.name} to an opportunity.`,
    })
  }


  if (loading) {
    return <DataSkeleton />
  }

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => loadData()} variant="outline" className="w-full">
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Seller Console</h1>
            <p className="text-muted-foreground">Manage your leads and convert them into opportunities</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleRefresh} disabled={refreshing} variant="outline" size="sm">
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="leads" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="leads" className="flex items-center gap-2">
            Leads
            <Badge variant="secondary" className="ml-1">
              {leads.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="opportunities" className="flex items-center gap-2">
            Opportunities
            <Badge variant="secondary" className="ml-1">
              {opportunities.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="leads" className="space-y-6">
          <LeadsTable leads={leads} onLeadClick={handleLeadClick} />
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-6">
          <OpportunitiesTable opportunities={opportunities} />
        </TabsContent>
      </Tabs>

      <LeadDetailPanel
        lead={selectedLead}
        isOpen={isLeadPanelOpen}
        onClose={handleCloseLead}
        onLeadUpdate={handleLeadUpdate}
        onConvertLead={handleConvertLead}
      />

      <ConvertLeadDialog
        lead={selectedLead}
        isOpen={isConvertDialogOpen}
        onClose={handleConvertDialogClose}
        onConvertSuccess={handleConvertSuccess}
      />
    </>
  )
}