import type { Lead, Opportunity, ApiResponse } from "../types"
import leadsData from "../data/leads.json"

// Simulate network latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// In-memory storage for demo purposes
let leads: Lead[] = leadsData as Lead[]
const opportunities: Opportunity[] = []

// Mock API functions
export const api = {
  // Leads API
  async getLeads(): Promise<ApiResponse<Lead[]>> {
    await delay(800) // Simulate API latency

    // Simulate occasional errors (5% chance)
    if (Math.random() < 0.05) {
      return {
        data: [],
        success: false,
        error: "Failed to fetch leads. Please try again.",
      }
    }

    return {
      data: [...leads],
      success: true,
    }
  },

  async updateLead(id: string, updates: Partial<Lead>): Promise<ApiResponse<Lead>> {
    await delay(500)

    // Simulate validation errors
    if (updates.email && !isValidEmail(updates.email)) {
      return {
        data: {} as Lead,
        success: false,
        error: "Invalid email format",
      }
    }

    const leadIndex = leads.findIndex((lead) => lead.id === id)
    if (leadIndex === -1) {
      return {
        data: {} as Lead,
        success: false,
        error: "Lead not found",
      }
    }

    leads[leadIndex] = { ...leads[leadIndex], ...updates }

    return {
      data: leads[leadIndex],
      success: true,
    }
  },

  async convertLeadToOpportunity(
    leadId: string,
    opportunityData: Omit<Opportunity, "id" | "createdFrom">,
  ): Promise<ApiResponse<Opportunity>> {
    await delay(600)

    const lead = leads.find((l) => l.id === leadId)
    if (!lead) {
      return {
        data: {} as Opportunity,
        success: false,
        error: "Lead not found",
      }
    }

    const opportunity: Opportunity = {
      id: `opp-${Date.now()}`,
      ...opportunityData,
      createdFrom: leadId,
    }

    opportunities.push(opportunity)

    // Remove lead from leads list (converted)
    leads = leads.filter((l) => l.id !== leadId)

    return {
      data: opportunity,
      success: true,
    }
  },

  // Opportunities API
  async getOpportunities(): Promise<ApiResponse<Opportunity[]>> {
    await delay(400)

    return {
      data: [...opportunities],
      success: true,
    }
  },
}

// Utility functions
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Export utility functions for components to use
export { isValidEmail }