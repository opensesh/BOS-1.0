import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface DropdownItem {
  id: string
  title: string
  description: string
  illustration?: string // Optional illustration URL for Values
}

interface TextDropdownProps {
  title: string
  items: DropdownItem[]
  hasIllustrations?: boolean
}

export default function TextDropdown({ title, items, hasIllustrations = false }: TextDropdownProps) {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <div className="w-full flex flex-col gap-12">
      {/* Section Title - D2 */}
      <h2 className="font-display text-d2-mobile md:text-d2-tablet xl:text-d2-desktop text-brand-vanilla">
        {title}
      </h2>

      {/* Dropdown Items */}
      <div className="flex flex-col">
        {items.map((item) => (
          <div key={item.id} className="w-full border-b border-brand-vanilla group hover:border-brand-aperol transition-colors">
            {/* Dropdown Header */}
            <button
              onClick={() => toggleItem(item.id)}
              className="w-full py-4 flex items-center gap-4 transition-colors"
              type="button"
              aria-expanded={openItems[item.id]}
            >
              {/* Illustration (for Values only) - 32px with padding to prevent cutoff */}
              {hasIllustrations && item.illustration && (
                <div className="w-8 h-8 flex-shrink-0 p-1 group-hover:brightness-0 group-hover:saturate-100 group-hover:[filter:invert(45%)_sepia(99%)_saturate(2783%)_hue-rotate(5deg)_brightness(101%)_contrast(102%)] transition-all">
                  <img
                    src={item.illustration}
                    alt={item.title}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              
              {/* Title - H4 (22px, Display Medium, 600 weight) */}
              <h4 className="text-h4-mobile md:text-h4-tablet xl:text-h4-desktop text-brand-vanilla text-left flex-1 group-hover:text-brand-aperol transition-colors">
                {item.title}
              </h4>
              
              {/* Chevron */}
              <ChevronDown
                className={`w-4 h-4 text-brand-vanilla transition-all duration-300 flex-shrink-0 group-hover:text-brand-aperol ${
                  openItems[item.id] ? 'rotate-180' : 'rotate-0'
                }`}
              />
            </button>

            {/* Dropdown Content - Body text aligns with title */}
            {openItems[item.id] && (
              <div className={`pb-6 ${hasIllustrations ? 'pl-12' : 'pl-0'}`}>
                <p className="text-b1 text-brand-vanilla">
                  {item.description}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
