import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import NewsCard from '@components/news/NewsCard'
import NewsSourceInput from '@components/news/NewsSourceInput'

interface NewsSectionProps {
  defaultOpen?: boolean
  showSourceInput?: boolean
}

const BASE_URL = import.meta.env.BASE_URL

export default function NewsSection({ defaultOpen = false, showSourceInput = true }: NewsSectionProps) {
  const [lastUpdated, setLastUpdated] = useState<string>('')

  useEffect(() => {
    // Fetch the latest weekly-update data to get the update timestamp
    fetch(`${BASE_URL}data/news/weekly-update/latest.json`)
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
  }, [])

  const handleSourceSubmit = (url: string, category?: string) => {
    // TODO: Implement backend endpoint to save this to news-sources.md
    // For now, we just log it
    console.log('New source submitted:', { url, category })

    // In a real implementation, this would:
    // 1. Send to a backend endpoint
    // 2. Backend would append to .claude/data/news-sources.md
    // 3. Trigger a re-scan of news sources
  }

  return (
    <section
      id="news"
      className="w-full max-w-[1184px] mx-auto px-6 sm:px-12 py-12 md:py-16 xl:py-20"
    >
      <div className="flex flex-col gap-6">
        {/* Section Header */}
        <div className="flex flex-col gap-6">
          <h2 className="text-h1-mobile md:text-h1-tablet xl:text-h1-desktop font-display text-brand-vanilla">
            News
          </h2>
          <div className="flex flex-col gap-3">
            <p className="text-b1 font-text text-brand-vanilla">
              Daily news updates generated and summarized
            </p>
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
          </div>
        </div>

        {/* News Cards */}
        <div className="flex flex-col gap-6">
          <NewsCard type="weekly-update" defaultOpen={defaultOpen} />
          <NewsCard type="monthly-outlook" defaultOpen={defaultOpen} />
        </div>

        {/* Source Input - Optional */}
        {showSourceInput && (
          <NewsSourceInput onSubmit={handleSourceSubmit} />
        )}
      </div>
    </section>
  )
}
