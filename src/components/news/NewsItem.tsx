import SourceLink from '@components/weekly-ideas/SourceLink'
import type { NewsUpdate } from '@/types/news'

interface NewsItemProps {
  update: NewsUpdate
}

export default function NewsItem({ update }: NewsItemProps) {
  return (
    <div className="flex flex-col items-start justify-center bg-[#1e1e1e] border-l-[1.572px] border-[#ff7f00] rounded-lg py-3 px-3 gap-3">
      {/* Title and Timestamp */}
      <div className="flex flex-col gap-1 w-full">
        <p className="text-[16px] leading-[1.25] font-text text-brand-vanilla">
          {update.title}
        </p>
        <p className="text-[12px] leading-[1.25] font-text text-[#787878]">
          {update.timestamp}
        </p>
      </div>

      {/* Source links */}
      {update.sources && update.sources.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {update.sources.map((source, index) => (
            <SourceLink key={`${source.name}-${index}`} source={source} />
          ))}
        </div>
      )}
    </div>
  )
}
