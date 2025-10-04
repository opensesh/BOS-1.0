import { useEffect, useId, useRef, useState } from 'react'
import type { ReactNode } from 'react'

type AccordionProps = {
  id?: string
  title: ReactNode
  children: ReactNode | (() => ReactNode)
  defaultOpen?: boolean
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
}

export default function Accordion({
  id,
  title,
  children,
  defaultOpen = false,
  isOpen: isOpenProp,
  onOpenChange,
  className,
}: AccordionProps) {
  const internalId = useId()
  const accordionId = id ?? `accordion-${internalId}`
  const [isOpen, setIsOpen] = useState<boolean>(isOpenProp ?? defaultOpen)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)

  // Sync controlled prop
  useEffect(() => {
    if (typeof isOpenProp === 'boolean') setIsOpen(isOpenProp)
  }, [isOpenProp])

  // Measure content height for smooth transitions and no layout shift
  useEffect(() => {
    const panel = panelRef.current
    const content = contentRef.current
    if (!panel || !content) return

    const contentHeight = content.offsetHeight
    if (isOpen) {
      panel.style.height = `${contentHeight}px`
      panel.style.opacity = '1'
      panel.style.visibility = 'visible'
    } else {
      panel.style.height = '0px'
      panel.style.opacity = '0'
      panel.style.visibility = 'hidden'
    }
  }, [isOpen, children])

  const toggle = () => {
    const next = !isOpen
    if (onOpenChange) onOpenChange(next)
    if (isOpenProp == null) setIsOpen(next)
  }

  const renderChildren = typeof children === 'function' ? (children as () => ReactNode)() : children

  return (
    <section
      className={
        `flex flex-col border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm ` +
        `transition-[flex-grow] duration-300 ease-out ${className ?? ''}`
      }
      style={{ flex: 1, minWidth: 0 }}
      aria-labelledby={`${accordionId}-header`}
    >
      <button
        id={`${accordionId}-header`}
        type="button"
        className="w-full text-left px-4 py-3 md:px-6 md:py-4 flex items-center justify-between gap-4"
        aria-controls={`${accordionId}-panel`}
        aria-expanded={isOpen}
        onClick={toggle}
      >
        <div className="text-lg md:text-xl font-medium">{title}</div>
        <svg
          className={`size-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Transition container maintains width with flex:1 in both states */}
      <div
        id={`${accordionId}-panel`}
        ref={panelRef}
        className="overflow-hidden transition-[height,opacity,visibility] duration-300 ease-out will-change-[height,opacity]"
      >
        {/* Lazy mount content only when open to optimize performance */}
        <div ref={contentRef} className="px-4 pb-4 md:px-6 md:pb-6">
          {isOpen ? renderChildren : null}
        </div>
      </div>
    </section>
  )
}


