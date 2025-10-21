import { ExternalLink } from 'lucide-react'
import type { Source } from '@/types/weekly-ideas'

interface SourceLinkProps {
  source: Source
}

export default function SourceLink({ source }: SourceLinkProps) {
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 border-[0.5px] border-[#A3A3A3] rounded px-2 py-0.5 text-caption font-medium text-[#A3A3A3] hover:border-brand-vanilla hover:text-brand-vanilla transition-colors"
    >
      {source.name}
      <ExternalLink className="size-3" />
    </a>
  )
}
