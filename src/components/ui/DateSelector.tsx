import { useState } from 'react'
import { Calendar, RefreshCw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { DateSelectorProps } from '@/types/date-selector'

export default function DateSelector({
  selectedDate,
  availableDates,
  isLoading,
  onDateChange,
  onReset,
}: DateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [hasFetchedDates, setHasFetchedDates] = useState(false)

  const formatDisplayDate = (dateStr: string | null) => {
    if (!dateStr) return 'Today'

    const date = new Date(dateStr + 'T00:00:00') // Ensure local timezone
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const handleButtonClick = () => {
    // If we haven't fetched dates yet, trigger the fetch by calling onDateChange with current value
    if (!hasFetchedDates && availableDates.length === 0) {
      setHasFetchedDates(true)
      // This will trigger fetchAvailableDates in the parent component
      onDateChange(selectedDate || '')
    }
    setIsOpen(!isOpen)
  }

  const handleDateSelect = (dateStr: string) => {
    onDateChange(dateStr)
    setIsOpen(false)
  }

  const handleReset = () => {
    onReset()
    setIsOpen(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex sm:flex-row-reverse items-center gap-2"
    >
      {/* Date Selector Button */}
      <div className="relative">
        <button
          type="button"
          onClick={handleButtonClick}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-2 border border-brand-vanilla rounded transition-colors hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Select date"
        >
          <Calendar className="size-4 text-brand-vanilla" />
          <span className="text-b2 font-text text-brand-vanilla">
            {formatDisplayDate(selectedDate)}
          </span>
          <motion.svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            className="text-brand-vanilla"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <path
              d="M2 4L6 8L10 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </motion.svg>
        </button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="fixed inset-0 z-40"
                onClick={() => setIsOpen(false)}
              />

              {/* Dropdown Content */}
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                className="absolute top-full left-0 sm:right-0 sm:left-auto mt-2 w-64 bg-brand-charcoal border border-brand-vanilla rounded shadow-xl z-50 overflow-hidden"
              >
                {/* Today Option */}
                <button
                  type="button"
                  onClick={handleReset}
                  className={`w-full px-4 py-3 text-left text-b2 font-text transition-colors border-b border-brand-vanilla/20 ${
                    selectedDate === null
                      ? 'bg-brand-aperol/20 text-brand-vanilla'
                      : 'text-brand-vanilla hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>Today (Latest)</span>
                    {selectedDate === null && (
                      <div className="size-2 rounded-full bg-brand-aperol" />
                    )}
                  </div>
                </button>

                {/* Historical Dates */}
                <div className="max-h-64 overflow-y-auto">
                  {isLoading ? (
                    <div className="px-4 py-3 text-b2 font-text text-brand-vanilla/60 flex items-center gap-2">
                      <div className="size-4 border-2 border-brand-vanilla/30 border-t-brand-aperol rounded-full animate-spin" />
                      Loading dates...
                    </div>
                  ) : availableDates.length === 0 ? (
                    <div className="px-4 py-3 text-b2 font-text text-brand-vanilla/60">
                      No historical data available
                    </div>
                  ) : (
                    availableDates.map((dateStr) => (
                      <button
                        key={dateStr}
                        type="button"
                        onClick={() => handleDateSelect(dateStr)}
                        className={`w-full px-4 py-3 text-left text-b2 font-text transition-colors ${
                          selectedDate === dateStr
                            ? 'bg-brand-aperol/20 text-brand-vanilla'
                            : 'text-brand-vanilla hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{formatDisplayDate(dateStr)}</span>
                          {selectedDate === dateStr && (
                            <div className="size-2 rounded-full bg-brand-aperol" />
                          )}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Today Reset Button */}
      {selectedDate && (
        <motion.button
          type="button"
          onClick={handleReset}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="size-8 flex items-center justify-center border border-brand-vanilla/40 rounded-full hover:border-brand-aperol hover:bg-brand-aperol/10 transition-colors group"
          aria-label="Reset to today"
        >
          <RefreshCw className="size-4 text-brand-vanilla group-hover:text-brand-aperol transition-colors" />
        </motion.button>
      )}
    </motion.div>
  )
}
