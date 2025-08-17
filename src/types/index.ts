export interface Lead {
  id: string
  name: string
  company: string
  email: string
  source: string
  score: number
  status: "new" | "contacted" | "qualified" | "unqualified"
}

export interface Opportunity {
  id: string
  name: string
  stage: "prospecting" | "qualification" | "proposal" | "negotiation" | "closed-won" | "closed-lost"
  amount?: number
  accountName: string
  createdFrom?: string // Lead ID that was converted
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  error?: string
}