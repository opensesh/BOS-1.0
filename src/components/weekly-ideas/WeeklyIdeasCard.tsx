import { useEffect, useState } from 'react'
import { Camera, Film, SquarePen, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import IdeaItem from './IdeaItem'
import type { WeeklyIdeas } from '@/types/weekly-ideas'

interface WeeklyIdeasCardProps {
  type: 'short-form' | 'long-form' | 'blog'
  defaultOpen?: boolean
}

export default function WeeklyIdeasCard({ type, defaultOpen = false }: WeeklyIdeasCardProps) {
  const [data, setData] = useState<WeeklyIdeas | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(defaultOpen)

  // Type-specific configuration
  const typeConfig = {
    'short-form': { icon: Camera, label: 'Short-Form' },
    'long-form': { icon: Film, label: 'Long-Form' },
    blog: { icon: SquarePen, label: 'Blogging' },
  }

  const { icon: Icon, label } = typeConfig[type]

  useEffect(() => {
    // Load the latest ideas for this type
    async function loadIdeas() {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}data/weekly-ideas/${type}/latest.json`)
        if (response.ok) {
          const ideas = await response.json()
          setData(ideas)
        }
      } catch (error) {
        console.error(`Failed to load ${type} ideas:`, error)
      } finally {
        setIsLoading(false)
      }
    }
    loadIdeas()
  }, [type])

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

  if (!data) {
    return (
      <div className="flex flex-col border border-brand-vanilla bg-brand-charcoal rounded p-6">
        <div className="flex items-center gap-6">
          <Icon className="size-6" />
          <p className="text-h4-mobile font-display text-brand-vanilla/50">
            {label} - No ideas available
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
          animate={{ rotate: isOpen ? 180 : 0 }}
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
              className="flex flex-col gap-6 px-6 pb-8 pt-6"
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
              {data.ideas.map((idea, index) => (
                <motion.div
                  key={`${idea.title}-${index}`}
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
                  <IdeaItem idea={idea} />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
