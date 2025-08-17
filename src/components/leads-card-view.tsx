import type { Lead } from "../types"
import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import { Building2, Mail, Star, Tag } from "lucide-react"

interface LeadsCardViewProps {
  leads: Lead[]
  onLeadClick: (lead: Lead) => void
}

const getStatusBadgeColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "qualified":
      return "ring-green-700 bg-green-100 text-green-700 dark:ring-green-400 dark:bg-green-950 dark:text-green-400"
    case "contacted":
      return "ring-amber-700 bg-amber-100 text-amber-700 dark:ring-amber-400 dark:bg-amber-950 dark:text-amber-400"
    case "new":
      return "ring-blue-700 bg-blue-100 text-blue-700 dark:ring-blue-400 dark:bg-blue-950 dark:text-blue-400"
    case "unqualified":
      return "ring-red-700 bg-red-100 text-red-700 dark:ring-red-400 dark:bg-red-950 dark:text-red-400"
    default:
      return "ring-gray-700 bg-gray-100 text-gray-700 dark:ring-gray-400 dark:bg-gray-950 dark:text-gray-400"
  }
}

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-green-600 dark:text-green-400"
  if (score >= 60) return "text-amber-600 dark:text-amber-400"
  return "text-red-600 dark:text-red-400"
}

export function LeadsCardView({ leads, onLeadClick }: LeadsCardViewProps) {
  if (leads.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No leads found</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {leads.map((lead) => (
        <Card
          key={lead.id}
          className="cursor-pointer transition-all hover:shadow-md hover:border-primary/20"
          onClick={() => onLeadClick(lead)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base truncate">{lead.name}</h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <Building2 className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{lead.company}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 ml-2">
                <Star className="h-3 w-3 text-amber-500" />
                <span className={`text-sm font-medium ${getScoreColor(lead.score)}`}>{lead.score}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Mail className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{lead.email}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Tag className="h-3 w-3 flex-shrink-0" />
                  <span>{lead.source}</span>
                </div>
                <Badge className={`ring-1 ${getStatusBadgeColor(lead.status)}`}>{lead.status}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}