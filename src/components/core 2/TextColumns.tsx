interface Column {
  id: string
  title: string
  description: string
}

interface TextColumnsProps {
  heading: string
  columns: Column[]
}

export default function TextColumns({ heading, columns }: TextColumnsProps) {
  return (
    <div className="w-full flex flex-col gap-6">
      {/* Section Heading - D2 */}
      <h2 className="font-display text-d2-mobile md:text-d2-tablet xl:text-d2-desktop text-brand-vanilla">
        {heading}
      </h2>

      {/* Three Columns - Flexbox that wraps, min-width 300px */}
      <div className="flex flex-wrap gap-6">
        {columns.map((column) => (
          <div
            key={column.id}
            className="flex-1 min-w-[300px] flex flex-col gap-6"
          >
            {/* Column Title - H3 */}
            <h3 className="font-display text-h3 md:text-h3-tablet xl:text-h3-desktop text-brand-vanilla">
              {column.title}
            </h3>

            {/* Column Description - Body 2 */}
            <p className="font-text text-b2 text-brand-vanilla">
              {column.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
