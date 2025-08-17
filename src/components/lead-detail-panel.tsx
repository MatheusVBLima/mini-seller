import { useState, useEffect } from "react"
import type { Lead } from "../types"
import { api, isValidEmail } from "../lib/api"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Badge } from "./ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "./ui/sheet"
import { Separator } from "./ui/separator"
import { toast } from "sonner"
import { Loader2, Save, RotateCcw, User, Building, Mail, Globe, Star, Flag, TrendingUp, Undo2 } from "lucide-react"

interface LeadDetailPanelProps {
  lead: Lead | null
  isOpen: boolean
  onClose: () => void
  onLeadUpdate: (updatedLead: Lead) => void
  onConvertLead: (lead: Lead) => void
}

const statusOptions = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "unqualified", label: "Unqualified" },
]

const statusColors = {
  new: "ring-blue-700 bg-blue-100 text-blue-700",
  contacted: "ring-amber-800 bg-amber-200 text-amber-800",
  qualified: "ring-green-800 bg-green-200 text-green-800",
  unqualified: "ring-red-800 bg-red-200 text-red-800",
}

export function LeadDetailPanel({ lead, isOpen, onClose, onLeadUpdate, onConvertLead }: LeadDetailPanelProps) {
  const [editedLead, setEditedLead] = useState<Lead | null>(null)
  const [originalLead, setOriginalLead] = useState<Lead | null>(null) // Store original for rollback
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setSaving] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [showRollback, setShowRollback] = useState(false) // Show rollback option on failure

  // Reset state when lead changes
  useEffect(() => {
    if (lead) {
      setEditedLead({ ...lead })
      setOriginalLead({ ...lead })
      setIsEditing(false)
      setEmailError(null)
      setShowRollback(false)
    }
  }, [lead])

  const handleEdit = () => {
    setIsEditing(true)
    setEmailError(null)
    setShowRollback(false)
  }

  const handleCancel = () => {
    if (lead) {
      setEditedLead({ ...lead })
    }
    setIsEditing(false)
    setEmailError(null)
    setShowRollback(false)
  }

  const handleSave = async () => {
    if (!editedLead || !lead) return

    // Validate email format
    if (!isValidEmail(editedLead.email)) {
      setEmailError("Please enter a valid email address")
      return
    }

    setSaving(true)
    setEmailError(null)

    // Optimistic update - immediately update UI
    onLeadUpdate(editedLead)
    setIsEditing(false)

    try {
      const response = await api.updateLead(lead.id, {
        email: editedLead.email,
        status: editedLead.status,
      })

      if (response.success) {
        // Update with server response (in case server modified data)
        onLeadUpdate(response.data)
        setOriginalLead(response.data)
        toast.success("Lead Updated", {
          description: "Lead details have been successfully updated.",
        })
      } else {
        // Rollback optimistic update
        if (originalLead) {
          onLeadUpdate(originalLead)
          setEditedLead({ ...originalLead })
        }
        setShowRollback(true)

        if (response.error?.includes("email")) {
          setEmailError(response.error)
          setIsEditing(true)
        } else {
          toast.error("Update Failed", {
            description: response.error || "Failed to update lead. Changes have been reverted.",
          })
        }
      }
    } catch (error) {
      // Rollback optimistic update
      if (originalLead) {
        onLeadUpdate(originalLead)
        setEditedLead({ ...originalLead })
      }
      setShowRollback(true)
      toast.error("Update Failed", {
        description: "An unexpected error occurred. Changes have been reverted.",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleRollback = () => {
    if (originalLead) {
      onLeadUpdate(originalLead)
      setEditedLead({ ...originalLead })
      setShowRollback(false)
      toast.success("Changes Reverted", {
        description: "Lead has been restored to its previous state.",
      })
    }
  }

  const handleEmailChange = (email: string) => {
    if (editedLead) {
      setEditedLead({ ...editedLead, email })
      // Clear email error when user starts typing
      if (emailError) {
        setEmailError(null)
      }
    }
  }

  const handleStatusChange = (status: Lead["status"]) => {
    if (editedLead) {
      setEditedLead({ ...editedLead, status })
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500"
    if (score >= 75) return "text-yellow-500"
    return "text-red-500"
  }

  if (!lead || !editedLead) return null

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="px-6 pt-6 pb-4">
          <SheetTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {lead.name}
          </SheetTitle>
          <SheetDescription>Lead details and contact information</SheetDescription>
        </SheetHeader>

        <div className="px-6 pb-6 space-y-6">
          {showRollback && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-destructive">Update failed. Changes were reverted.</p>
                <Button onClick={handleRollback} size="sm" variant="outline">
                  <Undo2 className="h-3 w-3 mr-1" />
                  Undo
                </Button>
              </div>
            </div>
          )}

          {/* Lead Score & Status */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Score:</span>
              <span className={`font-semibold ${getScoreColor(lead.score)}`}>{lead.score}</span>
            </div>
            <Badge className={`ring-1 ${statusColors[editedLead.status]}`} variant="secondary">
              {editedLead.status.charAt(0).toUpperCase() + editedLead.status.slice(1)}
            </Badge>
          </div>

          <Separator />

          {/* Basic Information */}
          <div className="space-y-5">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Contact Information</h3>

            {/* Name (Read-only) */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <User className="h-4 w-4" />
                Name
              </Label>
              <Input value={lead.name} disabled className="bg-muted" />
            </div>

            {/* Company (Read-only) */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Building className="h-4 w-4" />
                Company
              </Label>
              <Input value={lead.company} disabled className="bg-muted" />
            </div>

            {/* Email (Editable) */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input
                value={editedLead.email}
                onChange={(e) => handleEmailChange(e.target.value)}
                disabled={!isEditing}
                className={emailError ? "border-destructive" : ""}
                placeholder="Enter email address"
              />
              {emailError && <p className="text-sm text-destructive mt-1">{emailError}</p>}
            </div>

            {/* Source (Read-only) */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Globe className="h-4 w-4" />
                Source
              </Label>
              <Input value={lead.source} disabled className="bg-muted" />
            </div>

            {/* Status (Editable) */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Flag className="h-4 w-4" />
                Status
              </Label>
              <Select value={editedLead.status} onValueChange={handleStatusChange} disabled={!isEditing}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            {/* Convert to Opportunity Button */}
            <Button onClick={() => onConvertLead(lead)} variant="default" className="w-full h-11">
              <TrendingUp className="h-4 w-4 mr-2" />
              Convert to Opportunity
            </Button>

            <div className="flex flex-col sm:flex-row gap-3">
              {!isEditing ? (
                <Button onClick={handleEdit} variant="outline" className="flex-1 bg-transparent h-11">
                  Edit Details
                </Button>
              ) : (
                <>
                  <Button onClick={handleSave} disabled={isSaving} className="flex-1 h-11">
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    disabled={isSaving}
                    className="flex-1 sm:flex-none bg-transparent h-11"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}