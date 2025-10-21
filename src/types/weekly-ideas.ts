export interface WeeklyIdeas {
  type: 'short-form' | 'long-form' | 'blog'
  date: string // ISO 8601 format
  ideas: Idea[]
  // Legacy fields (optional for backwards compatibility)
  rating?: number // 0-100
  trends?: Trend[]
}

export interface Trend {
  name: string // "MCP", "GPT 6", "Grok"
  direction: 'up' | 'down'
}

export interface Idea {
  title: string
  description: string
  starred?: boolean
  sources: Source[]
}

export interface Source {
  name: string // "Designer News", "Figma Blog", etc.
  url: string // Full URL to article
}

export interface HotnessConfig {
  thresholds: {
    revolutionary: number // 90-100: Must create content immediately
    highValue: number // 70-89: Strong content opportunity
    moderate: number // 40-69: Consider for content
    low: number // 0-39: Focus on client work
  }
  scoringCriteria: {
    recency: number // How fresh is the news? (weight)
    impact: number // How game-changing? (weight)
    relevance: number // How relevant to our audience? (weight)
    uniqueness: number // How unique is this opportunity? (weight)
  }
}
