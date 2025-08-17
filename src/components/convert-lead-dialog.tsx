import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import type { Lead, Opportunity } from "../types"
import { api } from "../lib/api"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { toast } from "sonner"
import { Loader2, TrendingUp } from "lucide-react"

interface ConvertLeadDialogProps {
  lead: Lead | null
  isOpen: boolean
  onClose: () => void
  onConvertSuccess: (opportunity: Opportunity) => void
}

const opportunitySchema = z.object({
  opportunityName: z.string().min(1, "Opportunity name is required").trim(),
  accountName: z.string().min(1, "Account name is required").trim(),
  stage: z.enum(["prospecting", "qualification", "proposal", "negotiation"]),
  amount: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val === "") return true
      const num = Number.parseFloat(val)
      return !isNaN(num) && num >= 0
    }, "Amount must be a valid positive number"),
})

type OpportunityFormData = z.infer<typeof opportunitySchema>

const stageOptions = [
  { value: "prospecting", label: "Prospecting" },
  { value: "qualification", label: "Qualification" },
  { value: "proposal", label: "Proposal" },
  { value: "negotiation", label: "Negotiation" },
] as const

export function ConvertLeadDialog({ lead, isOpen, onClose, onConvertSuccess }: ConvertLeadDialogProps) {

  const form = useForm<OpportunityFormData>({
    resolver: zodResolver(opportunitySchema),
    mode: "onChange",
    defaultValues: {
      opportunityName: "",
      accountName: "",
      stage: "prospecting",
      amount: "",
    },
  })

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form

  useEffect(() => {
    if (isOpen && lead) {
      reset({
        opportunityName: `${lead.company} - ${lead.name}`,
        accountName: lead.company,
        stage: "prospecting",
        amount: "",
      })
    }
  }, [isOpen, lead, reset])

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose()
    }
  }

  const onSubmit = async (data: OpportunityFormData) => {
    if (!lead) return

    try {
      const opportunityData = {
        name: data.opportunityName,
        stage: data.stage,
        accountName: data.accountName,
        ...(data.amount &&
          data.amount !== "" && {
            amount: Number.parseFloat(data.amount),
          }),
      }

      const response = await api.convertLeadToOpportunity(lead.id, opportunityData)

      if (response.success) {
        onConvertSuccess(response.data)
        onClose()
      } else {
        toast.error("Conversion Failed", {
          description: response.error || "Failed to convert lead. Please try again.",
        })
      }
    } catch {
      toast.error("Conversion Failed", {
        description: "An unexpected error occurred. Please try again.",
      })
    }
  }

  if (!lead) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex gap-2 items-center">
            <TrendingUp className="w-5 h-5" />
            Convert Lead to Opportunity
          </DialogTitle>
          <DialogDescription>
            Convert {lead.name} from {lead.company} into a sales opportunity.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="py-4 space-y-4">
            <FormField
              control={form.control}
              name="opportunityName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Opportunity Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter opportunity name" {...field} />
                  </FormControl>
                  <FormDescription>This field is required</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accountName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter account name" {...field} />
                  </FormControl>
                  <FormDescription>This field is required</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Initial Stage</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {stageOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Select the initial sales stage</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimated Amount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.00" min="0" step="0.01" {...field} />
                  </FormControl>
                  <FormDescription>Optional - Enter estimated deal value</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    Converting...
                  </>
                ) : (
                  "Convert to Opportunity"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}