import { useEffect, useState } from 'react'
import PageHero from '@components/sections/PageHero'

export default function SystemPage() {
  const [activeSection, setActiveSection] = useState<string>('figma')

  // Scroll spy effect
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['figma']
      const header = document.querySelector('header')
      const headerHeight = header ? header.offsetHeight : 60
      const offset = headerHeight + 100

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= offset && rect.bottom > offset) {
            setActiveSection(sectionId)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial check
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Emit active section changes
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('active-section-change', {
      detail: { sectionId: activeSection }
    }))
  }, [activeSection])

  return (
    <>
      <PageHero
        title="System"
        description="Tools and resources that power our design workflow."
      />
      <main className="w-full max-w-[1184px] mx-auto px-6 md:px-12 pt-32 pb-32">
        <div className="flex flex-col gap-32">
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
    </main>
    </>
  )
}
