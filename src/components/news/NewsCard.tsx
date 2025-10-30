import { useEffect, useState } from 'react'
import { Newspaper, Telescope, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import NewsItem from './NewsItem'
import type { NewsCollection } from '@/types/news'

interface NewsCardProps {
  type: 'weekly-update' | 'monthly-outlook'
  defaultOpen?: boolean
  selectedDate?: string | null
}

export default function NewsCard({ type, defaultOpen = false, selectedDate = null }: NewsCardProps) {
  const [data, setData] = useState<NewsCollection | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(defaultOpen)

  // Type-specific configuration
  const typeConfig = {
    'weekly-update': { icon: Newspaper, label: 'Weekly Update' },
    'monthly-outlook': { icon: Telescope, label: 'Monthly Outlook' },
  }

  const { icon: Icon, label } = typeConfig[type]

  useEffect(() => {
    // Load news for this type (either selected date or latest)
    async function loadNews() {
      setIsLoading(true)
      try {
        const fileName = selectedDate ? `${selectedDate}.json` : 'latest.json'
        const response = await fetch(`${import.meta.env.BASE_URL}data/news/${type}/${fileName}`)
        if (response.ok) {
          const news = await response.json()
          setData(news)
        } else {
          // If selected date doesn't exist, fallback to latest
          if (selectedDate) {
            const fallbackResponse = await fetch(`${import.meta.env.BASE_URL}data/news/${type}/latest.json`)
            if (fallbackResponse.ok) {
              const news = await fallbackResponse.json()
              setData(news)
            }
          }
        }
      } catch (error) {
        console.error(`Failed to load ${type} news:`, error)
      } finally {
        setIsLoading(false)
      }
    }
    loadNews()
  }, [type, selectedDate])

  if (isLoading) {
    return (
      <div className="flex flex-col border border-brand-vanilla bg-brand-charcoal rounded p-6">
        <div className="animate-pulse flex items-center gap-6">
          <div className="size-6 bg-white/10 rounded" />
          <div className="h-6 bg-white/10 rounded w-32" />
        </div>
      </div>
    )
  }

  if (!data || !data.updates || data.updates.length === 0) {
    return (
      <div className="flex flex-col border border-brand-vanilla bg-brand-charcoal rounded p-6">
        <div className="flex items-center gap-6">
          <Icon className="size-6" />
          <p className="text-h4-mobile font-display text-brand-vanilla/50">
            {label} - No updates available
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col border border-brand-vanilla bg-brand-charcoal rounded overflow-hidden">
      {/* Header - Always visible */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between p-6 w-full text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-6">
          <Icon className="size-6 shrink-0" />
          <h3 className="text-h4-mobile font-display text-brand-vanilla">
            {label}
          </h3>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 90 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          <ChevronDown className="size-4" />
        </motion.div>
      </button>

      {/* Expandable Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: 'auto',
              opacity: 1,
              transition: {
                height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                opacity: { duration: 0.25, delay: 0.05 }
              }
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
                opacity: { duration: 0.15 }
              }
            }}
            className="overflow-hidden"
          >
            <motion.div
              className="flex flex-col gap-4 px-6 pb-4 pt-4"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.06,
                    delayChildren: 0.1
                  }
                },
                hidden: {
                  transition: {
                    staggerChildren: 0.03,
                    staggerDirection: -1
                  }
                }
              }}
            >
              {data.updates.map((update, index) => (
                <motion.div
                  key={`${update.title}-${index}`}
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: -8,
                      transition: {
                        duration: 0.2,
                        ease: [0.4, 0, 0.2, 1]
                      }
                    },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.3,
                        ease: [0.4, 0, 0.2, 1]
                      }
                    }
                  }}
                >
                  <NewsItem update={update} />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
