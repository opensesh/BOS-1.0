import { useRef, useState, useEffect } from 'react'
import SectionDropdown from '@components/common/SectionDropdown'
import useIntersectionObserver from '@hooks/useIntersectionObserver'

type Props = { defaultOpen?: boolean; lazyLoad?: boolean }

export default function SystemSection({ defaultOpen = false, lazyLoad = false }: Props) {
  const ref = useRef<HTMLDivElement | null>(null)
  const inView = useIntersectionObserver(ref as React.RefObject<Element>, { threshold: 0.2 })
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [forceLoad, setForceLoad] = useState(false)

  const shouldLoad = forceLoad || !lazyLoad || inView

  // Listen for custom open-section events
  useEffect(() => {
    const handleOpenSection = (event: CustomEvent) => {
      if (event.detail.sectionId === 'system') {
        setForceLoad(true)
        requestAnimationFrame(() => {
          setIsOpen(true)
          window.dispatchEvent(new CustomEvent('section-opened', { detail: { sectionId: 'system' } }))
        })
      }
    }

    window.addEventListener('open-section', handleOpenSection as EventListener)
    return () => window.removeEventListener('open-section', handleOpenSection as EventListener)
  }, [])

  return (
    <div ref={ref} className="w-full max-w-[1184px] mx-auto px-6 md:px-12 py-12">
      <SectionDropdown
        title="System"
        number="03"
        defaultOpen={defaultOpen}
        iconType="chevron"
        isOpen={isOpen}
        onToggle={setIsOpen}
      >
        {shouldLoad ? (
          <div className="flex flex-col gap-24">
            {/* Figma Block - Vertical */}
            <div id="figma" className="flex flex-col gap-6 w-full">
              <div className="flex flex-col gap-8">
                <h2 className="font-display text-d2-mobile md:text-d2-tablet xl:text-d2-desktop text-brand-vanilla">
                  Figma
                </h2>
                <p className="font-text text-b1 text-brand-vanilla">
                  Welcome to ToolKit. Here you'll find the most up to date brand assets as well as interactive tools enabling creative agency.
                </p>
                <div className="flex gap-3 items-center">
                  <a
                    href="https://www.figma.com/design/t6ibLjzJFXY6HzU0bIahxw/BRAND-OS?node-id=11107-68411&t=w51tqPrTUlDRqfak-1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-brand-vanilla hover:bg-brand-vanilla/90 transition-colors px-4 py-3 rounded-full flex gap-2 items-center min-w-[128px] justify-center"
                  >
                    <span className="font-text text-button text-brand-charcoal">Link</span>
                    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                      <path d="M3.33333 8H12.6667M12.6667 8L8.66667 4M12.6667 8L8.66667 12"
                        stroke="#191919"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                </div>
              </div>
              <div className="w-full h-[675px] rounded-xl overflow-hidden">
                <iframe
                  style={{ border: '1px solid rgba(0, 0, 0, 0.1)' }}
                  className="w-full h-full rounded-xl"
                  src="https://embed.figma.com/design/t6ibLjzJFXY6HzU0bIahxw/BRAND-OS?node-id=11107-68411&embed-host=share"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-brand-vanilla/50 font-text text-caption">
            Content loading...
          </div>
        )}
      </SectionDropdown>
    </div>
  )
}