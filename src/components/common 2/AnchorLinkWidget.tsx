import { useEffect, useRef, useState } from 'react'
import { ExternalLink, ChevronDown, ChevronRight, CornerDownRight } from 'lucide-react'

interface AnchorLinkWidgetProps {
  menuOpen: boolean
  setMenuOpen: (open: boolean) => void
}

interface NavItem {
  id: string
  label: string
  subItems?: { id: string; label: string }[]
}

export default function AnchorLinkWidget({ menuOpen, setMenuOpen }: AnchorLinkWidgetProps) {
  const widgetRef = useRef<HTMLDivElement>(null)
  const [headerHeight, setHeaderHeight] = useState(60)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    core: true, // Core OPEN by default
    identity: false, // Identity CLOSED by default
    system: false, // System CLOSED by default
  })
  const [activeSubItem, setActiveSubItem] = useState<string | null>(null)
  const userInteractedRef = useRef<Record<string, boolean>>({
    core: false,
    identity: false,
    system: false,
  })

  // Calculate actual header height
  useEffect(() => {
    const header = document.querySelector('header')
    if (header) {
      const height = header.offsetHeight
      setHeaderHeight(height)
    }
  }, [])

  const handleScrollToSection = (id: string, parentId?: string) => {
    const header = document.querySelector('header')
    const headerHeight = header ? header.offsetHeight : 60

    const performScroll = (targetId: string) => {
      const targetElement = document.getElementById(targetId)
      console.log('[performScroll]', { targetId, exists: !!targetElement })
      if (targetElement) {
        const elementTop = targetElement.getBoundingClientRect().top + window.pageYOffset
        const offsetPosition = elementTop - headerHeight - 20

        console.log('[performScroll] Scrolling to', { elementTop, offsetPosition, headerHeight })
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })
      } else {
        console.error('[performScroll] Element not found:', targetId)
      }
    }

    console.log('[handleScrollToSection]', { id, parentId })

    // No parent ID means it's a top-level section - scroll and open it
    if (!parentId) {
      console.log('[handleScrollToSection] No parentId, scroll to section and open it')
      setMenuOpen(false)
      performScroll(id)
      setTimeout(() => {
        const openEvent = new CustomEvent('open-section', {
          detail: { sectionId: id }
        })
        window.dispatchEvent(openEvent)
      }, 800)
      return
    }

    // Close menu immediately
    setMenuOpen(false)

    // Mark user interaction
    userInteractedRef.current[parentId] = true

    // Capture whether the section was already open at click time
    const wasOpen = openSections[parentId]

    // Reflect intended open state in the widget immediately
    setOpenSections({
      core: parentId === 'core',
      identity: parentId === 'identity',
      system: parentId === 'system',
    })
    setActiveSubItem(id)

    const parentSection = document.getElementById(parentId)

    console.log('[handleScrollToSection] State check', {
      parentSectionExists: !!parentSection,
      wasOpen,
    })

    // If section was already open, scroll directly
    if (wasOpen) {
      console.log('[handleScrollToSection] Section already open - direct scroll')
      performScroll(id)
      return
    }

    // Otherwise, choreograph: scroll to parent, open it, then poll until target is visible
    if (!parentSection) {
      console.error('[handleScrollToSection] Parent section not found!')
      performScroll(id)
      return
    }

    // Utility: wait until condition is true or timeout
    const waitUntil = (
      condition: () => boolean,
      onDone: () => void,
      { intervalMs = 100, timeoutMs = 4000, label = 'condition' }: { intervalMs?: number; timeoutMs?: number; label?: string } = {}
    ) => {
      let waited = 0
      const tick = () => {
        if (condition()) {
          onDone()
        } else if (waited >= timeoutMs) {
          console.warn(`[waitUntil] Timeout waiting for ${label}`)
          onDone()
        } else {
          waited += intervalMs
          setTimeout(tick, intervalMs)
        }
      }
      tick()
    }

    // Step 1: Scroll to parent section
    const parentTop = parentSection.getBoundingClientRect().top + window.pageYOffset
    const parentOffset = parentTop - headerHeight - 100

    console.log('[handleScrollToSection] Step 1: Scrolling to parent', { parentId, parentOffset })
    window.scrollTo({
      top: parentOffset,
      behavior: 'smooth'
    })

    // Step 2: Wait for section-opened confirmation from the section component
    const sectionOpenedHandler = (evt: Event) => {
      const customEvt = evt as CustomEvent
      if (customEvt.detail.sectionId === parentId) {
        console.log('[handleScrollToSection] Section opened confirmed, waiting for target visibility')
        window.removeEventListener('section-opened', sectionOpenedHandler)

        // Step 3: Wait until target exists and is visible, then scroll precisely
        waitUntil(
          () => {
            const el = document.getElementById(id)
            if (!el) return false
            const r = el.getBoundingClientRect()
            return r.height > 0 && r.width > 0
          },
          () => {
            console.log('[handleScrollToSection] Target ready, performing final scroll')
            performScroll(id)
            // Nudge once more after layout settles
            setTimeout(() => performScroll(id), 300)
          },
          { intervalMs: 100, timeoutMs: 5000, label: 'target visible' }
        )
      }
    }
    window.addEventListener('section-opened', sectionOpenedHandler)

    // Trigger open after scrolling to parent
    const isParentInView = () => {
      const rect = parentSection.getBoundingClientRect()
      const topBuffer = headerHeight + 24
      return rect.bottom > topBuffer && rect.top < window.innerHeight - 80
    }

    waitUntil(
      isParentInView,
      () => {
        console.log('[handleScrollToSection] Parent in view, dispatching open-section', parentId)
        const openEvent = new CustomEvent('open-section', {
          detail: { sectionId: parentId }
        })
        window.dispatchEvent(openEvent)
      },
      { intervalMs: 100, timeoutMs: 5000, label: 'parent in view' }
    )
  }

  const toggleSection = (id: string) => {
    // Mark that user has interacted with this section
    userInteractedRef.current[id] = true

    setOpenSections((prev) => {
      const isCurrentlyOpen = prev[id]
      // If clicking on an already open section, close it
      // Otherwise, close all and open the clicked one
      if (isCurrentlyOpen) {
        return {
          core: false,
          identity: false,
          system: false,
        }
      }
      return {
        core: id === 'core',
        identity: id === 'identity',
        system: id === 'system',
      }
    })
  }

  // Close menu on Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [setMenuOpen])

  // Close menu on outside click (backdrop only, excluding header button)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      // Don't close if clicking the header toggle button (it has its own toggle logic)
      const isHeaderButton = target.closest('header button[aria-label*="menu"]')

      if (menuOpen && widgetRef.current && !widgetRef.current.contains(target) && !isHeaderButton) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen, setMenuOpen])

  // Reset menu state when opening - detect current section
  useEffect(() => {
    if (menuOpen) {
      // Detect which section user is currently viewing
      const allSubItems: { id: string; label: string; parentId: string }[] = navItems.flatMap(item =>
        (item.subItems || []).map(sub => ({ id: sub.id, label: sub.label, parentId: item.id }))
      )

      const viewportCenter = window.innerHeight / 2
      const threshold = 500
      let closestElement: { id: string; distance: number; parentId: string } | null = null

      allSubItems.forEach(({ id, parentId }) => {
        const element = document.getElementById(id)
        if (element) {
          const rect = element.getBoundingClientRect()
          const isVisible = rect.top < window.innerHeight && rect.bottom > 0

          if (isVisible) {
            const elementCenter = rect.top + rect.height / 2
            const distance = Math.abs(elementCenter - viewportCenter)

            if (distance < threshold && (!closestElement || distance < closestElement.distance)) {
              closestElement = { id, distance, parentId }
            }
          }
        }
      })

      if (closestElement) {
        const selected = closestElement as { id: string; distance: number; parentId: string }
        // Open the section the user is currently viewing
        setOpenSections({
          core: selected.parentId === 'core',
          identity: selected.parentId === 'identity',
          system: selected.parentId === 'system',
        })
        setActiveSubItem(selected.id)
      } else {
        // Default to all closed if nothing is detected (above core section)
        setOpenSections({
          core: false,
          identity: false,
          system: false,
        })
        setActiveSubItem(null)
      }

      // Reset user interaction tracking
      userInteractedRef.current = {
        core: false,
        identity: false,
        system: false,
      }
    }
  }, [menuOpen])

  // Scroll detection to highlight active subsection and open the correct section
  useEffect(() => {
    const handleScroll = () => {
      const allSubItems: { id: string; label: string; parentId: string }[] = navItems.flatMap(item =>
        (item.subItems || []).map(sub => ({ id: sub.id, label: sub.label, parentId: item.id }))
      )

      const header = document.querySelector('header')
      const stickyOffset = (header ? header.offsetHeight : 60) + 24
      const viewportTop = stickyOffset
      const viewportBottom = window.innerHeight
      let closestElement: { id: string; distance: number; parentId: string } | null = null

      allSubItems.forEach(({ id, parentId }) => {
        const el = document.getElementById(id)
        if (!el) return
        const rect = el.getBoundingClientRect()
        const elTop = rect.top
        const elCenter = elTop + rect.height / 2
        const isInView = rect.bottom > viewportTop && elTop < viewportBottom
        if (!isInView) return

        const distance = Math.abs(elCenter - (viewportTop + (viewportBottom - viewportTop) / 3))
        if (!closestElement || distance < closestElement.distance) {
          closestElement = { id, distance, parentId }
        }
      })

      if (closestElement) {
        const selected = closestElement as { id: string; distance: number; parentId: string }
        setActiveSubItem(selected.id)
        setOpenSections({
          core: selected.parentId === 'core',
          identity: selected.parentId === 'identity',
          system: selected.parentId === 'system',
        })
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems: NavItem[] = [
    {
      id: 'core',
      label: 'Core',
      subItems: [
        { id: 'mission', label: 'Mission' },
        { id: 'values', label: 'Values' },
        { id: 'voice', label: 'Voice' },
        { id: 'pillars', label: 'Pillars' },
      ],
    },
    {
      id: 'identity',
      label: 'Identity',
      subItems: [
        { id: 'logo', label: 'Logo' },
        { id: 'color', label: 'Color' },
        { id: 'typography', label: 'Typography' },
        { id: 'guide', label: 'Guide' },
      ],
    },
    {
      id: 'system',
      label: 'System',
      subItems: [
        { id: 'figma', label: 'Figma' },
      ],
    },
  ]

  return (
    <>
      {/* Backdrop - z-30 to stay below header (z-50), only render when open */}
      {menuOpen && (
        <div
          className="fixed left-0 right-0 bottom-0 bg-black/40 backdrop-blur-sm z-30"
          style={{ top: `${headerHeight}px` }}
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      {/* Menu Panel - z-40 to stay between backdrop and header */}
      <div
        ref={widgetRef}
        className="fixed w-[448px] bg-brand-charcoal border border-[#787878] rounded-lg shadow-lg transition-all duration-300 ease-out z-40"
        style={{
          top: `${headerHeight + 12}px`,
          right: menuOpen ? 'max(24px, calc(50vw - 568px))' : '-480px', // Fully off-screen when closed (width + margin), aligned when open
        }}
      >
        <div className="px-8 py-6 flex flex-col gap-8">
          {/* Top Section: On this page */}
          <div className="flex items-center justify-between">
            <h3 className="font-text text-label uppercase text-brand-vanilla">On this page</h3>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => (
              <div key={item.id}>
                <button
                  onClick={() => {
                    // Toggle open state only (no page scroll)
                    toggleSection(item.id)
                  }}
                  className={`flex items-center gap-3 py-1 group w-full text-left transition-colors duration-200`}
                >
                  <div className="flex items-center justify-center w-5 h-5">
                    <svg
                      className={`w-3 h-3 ${openSections[item.id] ? 'text-brand-aperol' : 'text-brand-vanilla'}`}
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <circle cx="8" cy="8" r="6" />
                    </svg>
                  </div>
                  <span className={`font-display text-h4-mobile md:text-h4-tablet xl:text-h4-desktop flex-shrink-0 ${
                    openSections[item.id] ? 'text-brand-aperol' : 'text-brand-vanilla'
                  }`}>
                    {item.label}
                  </span>
                  <div className={`flex-1 border-b border-dotted mx-3 ${
                    openSections[item.id] ? 'border-brand-aperol' : 'border-[#787878]'
                  }`}></div>
                  {openSections[item.id] ? (
                    <ChevronDown className="w-5 h-5 text-brand-aperol transition-transform duration-300 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-brand-vanilla transition-transform duration-300 flex-shrink-0" />
                  )}
                </button>
                {openSections[item.id] && item.subItems && (
                  <div className="pl-8 flex flex-col gap-1 mt-3 pb-6 animate-fade-in">
                    {item.subItems.map((subItem) => {
                      const isActive = activeSubItem === subItem.id
                      return (
                        <a
                          key={subItem.id}
                          href={`#${subItem.id}`}
                          onClick={(e) => {
                            e.preventDefault()
                            handleScrollToSection(subItem.id, item.id)
                          }}
                          className={`flex items-center gap-2 py-1 group transition-colors duration-200 ${
                            isActive ? 'text-brand-aperol' : 'text-brand-vanilla hover:text-brand-aperol'
                          }`}
                        >
                          <CornerDownRight className={`w-4 h-4 transition-colors duration-200 flex-shrink-0 ${
                            isActive ? 'text-brand-aperol' : 'text-brand-vanilla group-hover:text-brand-aperol'
                          }`} />
                          <span className="font-text text-b1 flex-shrink-0">{subItem.label}</span>
                          <div className={`flex-1 border-b border-dotted transition-colors duration-200 ml-2 ${
                            isActive ? 'border-brand-aperol' : 'border-[#787878] group-hover:border-brand-aperol'
                          }`}></div>
                        </a>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h3 className="font-text text-caption uppercase text-brand-vanilla">Quick Links</h3>
            <div className="flex gap-2">
              <a
                href="https://www.figma.com/design/t6ibLjzJFXY6HzU0bIahxw/BRAND-OS?node-id=11107-68411&t=w51tqPrTUlDRqfak-1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[132px] bg-white text-brand-charcoal rounded-full px-4 py-3 font-text text-button flex items-center justify-center gap-2 hover:bg-brand-aperol hover:text-white transition-colors"
              >
                Figma
                <svg className="w-4 h-4" viewBox="0 0 38 57" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" />
                </svg>
              </a>
              <a
                href="https://github.com/opensesh"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[132px] bg-white text-brand-charcoal rounded-full px-4 py-3 font-text text-button flex items-center justify-center gap-2 hover:bg-brand-aperol hover:text-white transition-colors"
              >
                Git Repo
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
            <a
              href="https://www.figma.com/proto/t6ibLjzJFXY6HzU0bIahxw/BRAND-OS?page-id=19939%3A21956&node-id=20255-18337&viewport=465%2C-92%2C0.05&t=Fjx1co9Q53DPCGLw-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=20255%3A18337"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-white text-brand-charcoal rounded-full px-4 py-3 font-text text-button flex items-center justify-center gap-2 hover:bg-brand-aperol hover:text-white transition-colors"
            >
              Guidelines
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </>
  )
}