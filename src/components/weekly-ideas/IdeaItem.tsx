import { Star } from 'lucide-react'
import SourceLink from './SourceLink'
import type { Idea } from '@/types/weekly-ideas'

interface IdeaItemProps {
  idea: Idea
}

export default function IdeaItem({ idea }: IdeaItemProps) {
  return (
    <div className="flex flex-col gap-2">
      {/* Title and description */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <p className="text-[16px] leading-[1.25] font-text text-brand-vanilla">
            {idea.title}
          </p>
          <p className="text-[16px] leading-[1.25] font-text text-[#787878]">
            {idea.description}
          </p>
        </div>
        {idea.starred && (
          <div className="shrink-0 size-5 flex items-center justify-center">
            <Star className="size-5 fill-brand-aperol text-brand-aperol" />
          </div>
        )}
      </div>

      {/* Source links */}
      {idea.sources && idea.sources.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {idea.sources.map((source, index) => (
            <SourceLink key={`${source.name}-${index}`} source={source} />
          ))}
        </div>
      )}
    </div>
  )
}
