import type { Source } from './weekly-ideas'

/**
 * News update types for the News section
 */

export interface NewsUpdate {
  title: string // 1-2 sentence summary of the news/trend
  timestamp: string // Format: "MM/DD/YYYY, H:MM AM/PM" (e.g., "10/11/2025, 2:30 PM")
  sources: Source[] // Array of source links
}

export interface NewsCollection {
  type: 'weekly-update' | 'monthly-outlook'
  date: string // ISO 8601 format
  updates: NewsUpdate[]
}

/**
 * Category configuration for different news types
 */
export interface NewsCategory {
  type: 'weekly-update' | 'monthly-outlook'
  icon: 'newspaper' | 'telescope'
  label: string
  description: string
}

/**
 * Input for adding new news sources
 */
export interface NewsSourceInput {
  url: string
  category?: string
}
