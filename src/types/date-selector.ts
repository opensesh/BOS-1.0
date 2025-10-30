/**
 * Types for the historical date selector feature
 */

export interface DateSelectorProps {
  selectedDate: string | null
  availableDates: string[]
  isLoading: boolean
  onDateChange: (date: string) => void
  onReset: () => void
}

export interface HistoricalDataConfig {
  basePath: string // e.g., 'data/weekly-ideas/short-form'
  type: 'inspiration' | 'news'
}

export interface UseHistoricalDataResult {
  selectedDate: string | null
  availableDates: string[]
  isLoading: boolean
  isLoadingDates: boolean
  error: string | null
  setDate: (date: string) => void
  resetToToday: () => void
  fetchAvailableDates: () => Promise<void>
}
