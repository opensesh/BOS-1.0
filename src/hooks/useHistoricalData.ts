import { useState, useCallback, useEffect } from 'react'
import type { UseHistoricalDataResult } from '@/types/date-selector'

const BASE_URL = import.meta.env.BASE_URL

interface UseHistoricalDataOptions {
  basePath: string // e.g., 'data/weekly-ideas/short-form' or 'data/news/weekly-update'
  autoFetch?: boolean // Automatically fetch available dates on mount
}

/**
 * Custom hook to manage historical date selection and data fetching
 *
 * Scans the last 30 days to find available date-stamped JSON files
 * and provides state management for date selection.
 */
export function useHistoricalData({
  basePath,
  autoFetch = false,
}: UseHistoricalDataOptions): UseHistoricalDataResult {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [availableDates, setAvailableDates] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingDates, setIsLoadingDates] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasFetchedDates, setHasFetchedDates] = useState(false)

  /**
   * Scan the last 30 days to find available date files
   */
  const fetchAvailableDates = useCallback(async () => {
    if (isLoadingDates || hasFetchedDates) return

    setIsLoadingDates(true)
    setError(null)

    try {
      const dates: string[] = []
      const today = new Date()

      // Check the last 30 days for available files
      for (let i = 0; i < 30; i++) {
        const checkDate = new Date(today)
        checkDate.setDate(today.getDate() - i)

        const dateString = checkDate.toISOString().split('T')[0] // YYYY-MM-DD format
        const fileUrl = `${BASE_URL}${basePath}/${dateString}.json`

        try {
          const response = await fetch(fileUrl, { method: 'HEAD' })
          if (response.ok) {
            dates.push(dateString)
          }
        } catch {
          // File doesn't exist, continue
          continue
        }
      }

      setAvailableDates(dates.sort().reverse()) // Most recent first
      setHasFetchedDates(true)
    } catch (err) {
      console.error('Failed to fetch available dates:', err)
      setError('Failed to load available dates')
    } finally {
      setIsLoadingDates(false)
    }
  }, [basePath, isLoadingDates, hasFetchedDates])

  /**
   * Set the selected date
   */
  const setDate = useCallback((date: string) => {
    setSelectedDate(date)
    setError(null)
  }, [])

  /**
   * Reset to today (null = latest.json)
   */
  const resetToToday = useCallback(() => {
    setSelectedDate(null)
    setError(null)
  }, [])

  // Auto-fetch dates on mount if enabled
  useEffect(() => {
    if (autoFetch && !hasFetchedDates) {
      fetchAvailableDates()
    }
  }, [autoFetch, hasFetchedDates, fetchAvailableDates])

  return {
    selectedDate,
    availableDates,
    isLoading,
    isLoadingDates,
    error,
    setDate,
    resetToToday,
    fetchAvailableDates,
  }
}
