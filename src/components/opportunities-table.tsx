import type { Opportunity } from "../types"
import { Badge } from "./ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { TrendingUp, DollarSign } from "lucide-react"

interface OpportunitiesTableProps {
  opportunities: Opportunity[]
}

const stageColors = {
  prospecting: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  qualification: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  proposal: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  negotiation: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  "closed-won": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  "closed-lost": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

export function OpportunitiesTable({ opportunities }: OpportunitiesTableProps) {
  const formatCurrency = (amount?: number) => {
    if (!amount) return "—"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const totalValue = opportunities.reduce((sum, opp) => sum + (opp.amount || 0), 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            <span>Opportunities ({opportunities.length})</span>
          </div>
          {opportunities.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>Total Value: {formatCurrency(totalValue)}</span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {opportunities.length === 0 ? (
          <div className="text-center py-12">
            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">No opportunities yet</p>
            <p className="text-muted-foreground text-sm mt-2">Convert leads to create your first opportunity</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table className="font-mono">
              <TableHeader>
                <TableRow>
                  <TableHead>Opportunity Name</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Source Lead</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {opportunities.map((opportunity) => (
                  <TableRow key={opportunity.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium">{opportunity.name}</TableCell>
                    <TableCell>{opportunity.accountName}</TableCell>
                    <TableCell>
                      <Badge className={stageColors[opportunity.stage]} variant="secondary">
                        {opportunity.stage.charAt(0).toUpperCase() + opportunity.stage.slice(1).replace("-", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(opportunity.amount)}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {opportunity.createdFrom ? `Lead ${opportunity.createdFrom.slice(-3)}` : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}