import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import WeeklyIdeasCard from '@components/weekly-ideas/WeeklyIdeasCard'
import DateSelector from '@components/ui/DateSelector'
import { useHistoricalData } from '@/hooks/useHistoricalData'

interface IdeaGenerationProps {
  defaultOpen?: boolean
}

const BASE_URL = import.meta.env.BASE_URL

export default function IdeaGeneration({ defaultOpen = false }: IdeaGenerationProps) {
  const [lastUpdated, setLastUpdated] = useState<string>('')

  // Historical data management for Inspiration section
  const {
    selectedDate,
    availableDates,
    isLoadingDates,
    setDate,
    resetToToday,
    fetchAvailableDates,
  } = useHistoricalData({
    basePath: 'data/weekly-ideas/short-form',
    autoFetch: false, // Load dates on first interaction
  })

  useEffect(() => {
    // Fetch the latest short-form data to get the update timestamp
    const dataFile = selectedDate
      ? `${BASE_URL}data/weekly-ideas/short-form/${selectedDate}.json`
      : `${BASE_URL}data/weekly-ideas/short-form/latest.json`

    fetch(dataFile)
      .then((res) => res.json())
      .then((data) => {
        if (data.date) {
          const date = new Date(data.date)
          const formatted = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
          const time = date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          })
          setLastUpdated(`${formatted} at ${time}`)
        }
      })
      .catch((err) => console.error('Failed to fetch last updated date:', err))
  }, [selectedDate])

  return (
    <section
      id="idea-generation"
      className="w-full max-w-[1184px] mx-auto px-6 sm:px-12 py-12 md:py-16 xl:py-20"
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-6">
          <h2 className="text-h1-mobile md:text-h1-tablet xl:text-h1-desktop font-display text-brand-vanilla">
            Inspiration
          </h2>
          <div className="flex flex-col gap-3">
            <p className="text-b1 font-text text-brand-vanilla">
              Daily content ideas generated and filtered by category
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              {/* Last Updated Indicator */}
              {lastUpdated && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="flex items-center gap-2"
                >
                  <div className="size-2 rounded-full bg-brand-aperol animate-pulse" />
                  <p className="text-caption font-text text-brand-vanilla/60">
                    Last updated: {lastUpdated}
                  </p>
                </motion.div>
              )}

              {/* Date Selector */}
              <DateSelector
                selectedDate={selectedDate}
                availableDates={availableDates}
                isLoading={isLoadingDates}
                onDateChange={(date) => {
                  // Fetch dates if not already loaded
                  if (availableDates.length === 0 && !isLoadingDates) {
                    fetchAvailableDates()
                  }
                  // Only set date if it's not empty
                  if (date) {
                    setDate(date)
                  }
                }}
                onReset={resetToToday}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <WeeklyIdeasCard type="short-form" defaultOpen={defaultOpen} selectedDate={selectedDate} />
          <WeeklyIdeasCard type="long-form" defaultOpen={defaultOpen} selectedDate={selectedDate} />
          <WeeklyIdeasCard type="blog" defaultOpen={defaultOpen} selectedDate={selectedDate} />
        </div>
      </div>
    </section>
  )
}
