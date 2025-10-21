import NewsCard from '@components/news/NewsCard'
import NewsSourceInput from '@components/news/NewsSourceInput'

interface NewsSectionProps {
  defaultOpen?: boolean
  showSourceInput?: boolean
}

export default function NewsSection({ defaultOpen = false, showSourceInput = true }: NewsSectionProps) {
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
          <p className="text-b1 font-text text-brand-vanilla">
            Daily news updates generated and summarized
          </p>
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
