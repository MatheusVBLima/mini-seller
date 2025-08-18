import { useState, useMemo, useCallback } from "react"
import type { Lead } from "../types"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { useLocalStorage } from "../hooks/use-local-storage"
import { Search, ArrowUpDown, ArrowUp, ArrowDown, Users, Building2, Mail, Star, Tag } from "lucide-react"

interface LeadsTableProps {
  leads: Lead[]
  onLeadClick: (lead: Lead) => void
}

type SortField = "score" | "name" | "company"
type SortDirection = "asc" | "desc"

interface FilterSortState {
  searchQuery: string
  statusFilter: string
  sortField: SortField
  sortDirection: SortDirection
}

const statusColors = {
  new: "ring-blue-700 bg-blue-100 text-blue-700",
  contacted: "ring-amber-800 bg-amber-200 text-amber-800",
  qualified: "ring-green-800 bg-green-200 text-green-800",
  unqualified: "ring-red-800 bg-red-200 text-red-800",
}

const initialState: FilterSortState = {
  searchQuery: "",
  statusFilter: "all",
  sortField: "score",
  sortDirection: "desc",
}

export function LeadsTable({ leads, onLeadClick }: LeadsTableProps) {
  const [filterSort, setFilterSort] = useLocalStorage<FilterSortState>("leads-filter-sort", initialState)
  const [searchQuery, setSearchQuery] = useState(filterSort.searchQuery)

  const updateSearch = useCallback(
    (query: string) => {
      setSearchQuery(query)
      setFilterSort((prev) => ({ ...prev, searchQuery: query }))
    },
    [setFilterSort],
  )

  const updateStatusFilter = useCallback(
    (status: string) => {
      setFilterSort((prev) => ({ ...prev, statusFilter: status }))
    },
    [setFilterSort],
  )

  const filteredAndSortedLeads = useMemo(() => {
    let filtered = leads

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (lead) => lead.name.toLowerCase().includes(query) || lead.company.toLowerCase().includes(query),
      )
    }

    // Apply status filter
    if (filterSort.statusFilter !== "all") {
      filtered = filtered.filter((lead) => lead.status === filterSort.statusFilter)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: string | number
      let bValue: string | number

      switch (filterSort.sortField) {
        case "score":
          aValue = a.score
          bValue = b.score
          break
        case "name":
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case "company":
          aValue = a.company.toLowerCase()
          bValue = b.company.toLowerCase()
          break
        default:
          return 0
      }

      if (aValue < bValue) return filterSort.sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return filterSort.sortDirection === "asc" ? 1 : -1
      return 0
    })

    return filtered
  }, [leads, searchQuery, filterSort])

  const handleSort = useCallback(
    (field: SortField) => {
      setFilterSort((prev) => ({
        ...prev,
        sortField: field,
        sortDirection: prev.sortField === field && prev.sortDirection === "desc" ? "asc" : "desc",
      }))
    },
    [setFilterSort],
  )

  const getSortIcon = (field: SortField) => {
    if (filterSort.sortField !== field) {
      return <ArrowUpDown className="h-4 w-4" />
    }
    return filterSort.sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500"
    if (score >= 75) return "text-yellow-500"
    return "text-red-500"
  }

  const MobileCardView = () => (
    <div className="grid gap-4 md:hidden">
      {filteredAndSortedLeads.map((lead) => (
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
                <span className={`text-sm font-mono font-medium ${getScoreColor(lead.score)}`}>{lead.score}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Mail className="h-3 w-3 flex-shrink-0" />
                <span className="truncate font-mono text-sm">{lead.email}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Tag className="h-3 w-3 flex-shrink-0" />
                  <span>{lead.source}</span>
                </div>
                <Badge className={`ring-1 ${statusColors[lead.status]}`}>
                  {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const DesktopTableView = () => (
    <div className="rounded-md border overflow-x-auto hidden md:block">
      <Table className="font-mono">
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[150px]">
              <Button
                variant="ghost"
                onClick={() => handleSort("name")}
                className="h-auto p-0 font-semibold hover:bg-transparent"
              >
                Name {getSortIcon("name")}
              </Button>
            </TableHead>
            <TableHead className="min-w-[150px]">
              <Button
                variant="ghost"
                onClick={() => handleSort("company")}
                className="h-auto p-0 font-semibold hover:bg-transparent"
              >
                Company {getSortIcon("company")}
              </Button>
            </TableHead>
            <TableHead className="min-w-[200px]">Email</TableHead>
            <TableHead className="min-w-[100px]">Source</TableHead>
            <TableHead className="min-w-[80px]">
              <Button
                variant="ghost"
                onClick={() => handleSort("score")}
                className="h-auto p-0 font-semibold hover:bg-transparent"
              >
                Score {getSortIcon("score")}
              </Button>
            </TableHead>
            <TableHead className="min-w-[120px]">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedLeads.map((lead) => (
            <TableRow
              key={lead.id}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => onLeadClick(lead)}
            >
              <TableCell className="font-medium">{lead.name}</TableCell>
              <TableCell>{lead.company}</TableCell>
              <TableCell className="text-muted-foreground">{lead.email}</TableCell>
              <TableCell>
                <Badge variant="outline">{lead.source}</Badge>
              </TableCell>
              <TableCell>
                <span className={`font-semibold ${getScoreColor(lead.score)}`}>{lead.score}</span>
              </TableCell>
              <TableCell>
                <Badge className={`ring-1 ${statusColors[lead.status]}`} variant="secondary">
                  {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <div className="space-y-4">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <span>Leads ({filteredAndSortedLeads.length})</span>
          </CardTitle>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            {/* Search Input */}
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or company..."
                value={searchQuery}
                onChange={(e) => updateSearch(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>

            {/* Status Filter */}
            <Select value={filterSort.statusFilter} onValueChange={updateStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="unqualified">Unqualified</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredAndSortedLeads.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">No leads found</p>
            <p className="text-muted-foreground text-sm mt-2">
              {searchQuery || filterSort.statusFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "No leads available"}
            </p>
          </div>
        ) : (
          <>
            <MobileCardView />
            <DesktopTableView />
          </>
        )}
      </CardContent>
    </Card>
  )
}