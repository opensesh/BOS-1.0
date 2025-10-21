import WeeklyIdeasCard from '@components/weekly-ideas/WeeklyIdeasCard'

interface IdeaGenerationProps {
  defaultOpen?: boolean
}

export default function IdeaGeneration({ defaultOpen = false }: IdeaGenerationProps) {
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
          <p className="text-b1 font-text text-brand-vanilla">
            Daily content ideas generated and filtered by category
          </p>
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
