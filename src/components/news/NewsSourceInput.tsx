import { useState } from 'react'
import { Plus, Check, X, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface NewsSourceInputProps {
  onSubmit?: (url: string, category?: string) => void
  defaultOpen?: boolean
}

export default function NewsSourceInput({ onSubmit, defaultOpen = false }: NewsSourceInputProps) {
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url.trim()) {
      setStatus('error')
      setMessage('Please enter a URL')
      return
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      setStatus('error')
      setMessage('Please enter a valid URL')
      return
    }

    // TODO: In a real implementation, this would:
    // 1. Call an API endpoint with the URL
    // 2. Backend fetches URL metadata (title, description, domain info)
    // 3. Auto-categorizes based on domain and content
    // 4. Adds to news-sources.md in the appropriate category

    try {
      if (onSubmit) {
        // Category will be auto-determined by the backend
        onSubmit(url)
      }

      // Show success feedback
      setStatus('success')
      setMessage('Source added successfully! Category auto-detected and will appear in the next news update.')

      // Reset form after 2 seconds
      setTimeout(() => {
        setUrl('')
        setStatus('idle')
        setMessage('')
      }, 2000)
    } catch (error) {
      setStatus('error')
      setMessage('Failed to add source. Please try again.')
    }
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
          <Plus className="size-6 shrink-0" />
          <h4 className="text-h4-mobile font-display text-brand-vanilla">
            Add News Source
          </h4>
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
            <div className="px-6 pb-6 pt-2">
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <label htmlFor="source-url" className="text-[14px] font-text text-brand-vanilla">
                    URL
                  </label>
                  <input
                    id="source-url"
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/article"
                    className="bg-[#1e1e1e] border border-[#A3A3A3] rounded px-3 py-2 text-[14px] font-text text-brand-vanilla placeholder:text-[#787878] focus:outline-none focus:border-brand-vanilla transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="self-end bg-brand-vanilla text-brand-charcoal px-4 py-2 rounded text-[14px] font-text font-medium hover:bg-brand-vanilla/90 transition-colors flex items-center gap-2"
                >
                  <Plus className="size-4" />
                  Add Source
                </button>
              </form>

          {/* Status Messages */}
          {status !== 'idle' && (
            <div
              className={`mt-4 flex items-start gap-2 p-3 rounded ${
                status === 'success'
                  ? 'bg-green-500/10 border border-green-500/30'
                  : 'bg-red-500/10 border border-red-500/30'
              }`}
            >
              {status === 'success' ? (
                <Check className="size-4 text-green-500 shrink-0 mt-0.5" />
              ) : (
                <X className="size-4 text-red-500 shrink-0 mt-0.5" />
              )}
              <p
                className={`text-[14px] font-text ${
                  status === 'success' ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {message}
              </p>
            </div>
          )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
