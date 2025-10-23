import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import WeeklyIdeasCard from '@components/weekly-ideas/WeeklyIdeasCard'

interface IdeaGenerationProps {
  defaultOpen?: boolean
}

const BASE_URL = import.meta.env.BASE_URL

export default function IdeaGeneration({ defaultOpen = false }: IdeaGenerationProps) {
  const [lastUpdated, setLastUpdated] = useState<string>('')

  useEffect(() => {
    // Fetch the latest short-form data to get the update timestamp
    fetch(`${BASE_URL}data/weekly-ideas/short-form/latest.json`)
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
        <div className="flex flex-col gap-6">
          <WeeklyIdeasCard type="short-form" defaultOpen={defaultOpen} />
          <WeeklyIdeasCard type="long-form" defaultOpen={defaultOpen} />
          <WeeklyIdeasCard type="blog" defaultOpen={defaultOpen} />
        </div>
      </div>
    </section>
  )
}
