import { useState, useEffect } from 'react'
import PageHero from '@components/sections/PageHero'
import LogoBlock from '@components/identity/LogoBlock'
import TypographyBlock from '@components/identity/TypographyBlock'

export default function IdentityPage() {
  const [activeSection, setActiveSection] = useState<string>('logo')

  const copyToClipboard = async (text: string) => {
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        const successful = document.execCommand('copy')
        textArea.remove()
        if (successful) {
          // no-op
        }
      }
    } catch (err) {
      console.error('Failed to copy:', err)
      alert(`Failed to copy: ${text}`)
    }
  }

  const brandColors = [
    {
      name: 'Primary/Charcoal',
      hex: '#191919',
      rgb: 'rgb(25, 25, 25)',
      bg: 'bg-[#191919]',
      textColor: 'text-[#f0f0f0]',
      labelBg: 'bg-[#c7c7c7]',
      labelText: 'text-[#383838]',
      label: 'Primary'
    },
    {
      name: 'Primary/Vanilla',
      hex: '#FFFAEE',
      rgb: 'rgb(110, 98, 244)',
      bg: 'bg-[#fffaee]',
      textColor: 'text-black',
      labelBg: 'bg-[#c7c7c7]',
      labelText: 'text-[#383838]',
      label: 'Secondary'
    },
    {
      name: 'Secondary/Aperol',
      hex: '#FE5102',
      rgb: 'rgb(254, 81, 2)',
      bg: 'bg-[#fe5102]',
      textColor: 'text-black',
      labelBg: 'bg-[#383838]',
      labelText: 'text-[#dddee2]',
      label: 'Secondary'
    }
  ]

  const monoColors = [
    { name: 'Black', hex: '#000000', rgb: 'rgb(0, 0, 0)', bg: 'bg-[#000000]', textColor: 'text-[#f0f0f0]' },
    { name: 'Black-90', hex: '#1E1E1E', rgb: 'rgb(30, 30, 30)', bg: 'bg-[#1e1e1e]', textColor: 'text-[#f0f0f0]' },
    { name: 'Black-80', hex: '#383838', rgb: 'rgb(56, 56, 56)', bg: 'bg-[#383838]', textColor: 'text-[#f0f0f0]' },
    { name: 'Black-70', hex: '#4A4A4A', rgb: 'rgb(74, 74, 74)', bg: 'bg-[#4a4a4a]', textColor: 'text-[#f0f0f0]' },
    { name: 'Black-60', hex: '#595959', rgb: 'rgb(89, 89, 89)', bg: 'bg-[#595959]', textColor: 'text-[#f0f0f0]' },
    { name: 'Black-50', hex: '#787878', rgb: 'rgb(120, 120, 120)', bg: 'bg-[#787878]', textColor: 'text-black' },
    { name: 'Black-40', hex: '#A3A3A3', rgb: 'rgb(163, 163, 163)', bg: 'bg-[#a3a3a3]', textColor: 'text-black' },
    { name: 'Black-30', hex: '#C7C7C7', rgb: 'rgb(199, 199, 199)', bg: 'bg-[#c7c7c7]', textColor: 'text-black' },
    { name: 'Black-20', hex: '#DDDEE2', rgb: 'rgb(221, 222, 226)', bg: 'bg-[#dddee2]', textColor: 'text-black' },
    { name: 'Black-10', hex: '#F0F0F0', rgb: 'rgb(240, 240, 240)', bg: 'bg-[#f0f0f0]', textColor: 'text-black' },
    { name: 'White', hex: '#FFFFFF', rgb: 'rgb(255, 255, 255)', bg: 'bg-[#ffffff]', textColor: 'text-black' }
  ]

  // Scroll spy effect
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['logo', 'color', 'typography', 'guide']
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
        title="Identity"
        description="Visual elements that bring our brand to life."
      />
      <main className="w-full max-w-[1184px] mx-auto px-6 md:px-12 pt-32 pb-32">
        <div className="flex flex-col gap-32">
        {/* Logo Block */}
        <div id="logo">
          <LogoBlock />
        </div>

        {/* Color Block */}
        <div id="color" className="flex flex-col gap-8">
          <h2 className="font-display text-d2-mobile md:text-d2-tablet xl:text-d2-desktop text-brand-vanilla">
            Color
          </h2>

          {/* Brand Colors */}
          <div className="flex flex-col gap-6">
            <h3 className="font-display text-h4-mobile md:text-h4-tablet xl:text-h4-desktop text-brand-vanilla">Brand</h3>
            <div className="flex flex-col md:flex-row gap-6 w-full">
              {brandColors.map((color) => (
                <div
                  key={color.hex}
                  className={`flex-1 ${color.bg} rounded-xl p-6 flex flex-col border ${color.name.includes('Charcoal') ? 'border-[#787878]' : 'border-[#4a4a4a]'}`}
                >
                  <div className="flex flex-wrap gap-4 items-start justify-between w-full">
                    <div className="flex gap-2 items-center">
                      <p className={`font-text text-b1 ${color.textColor}`}>
                        {color.name}
                      </p>
                      <button
                        onClick={() => copyToClipboard(color.name)}
                        className="hover:opacity-70 transition-opacity flex-shrink-0"
                        title="Copy color name"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                          <path d="M5.33333 10L2.66667 10C1.93333 10 1.33333 9.4 1.33333 8.66667L1.33333 2.66667C1.33333 1.93333 1.93333 1.33333 2.66667 1.33333L8.66667 1.33333C9.4 1.33333 10 1.93333 10 2.66667L10 5.33333M7.33333 14.6667L13.3333 14.6667C14.0667 14.6667 14.6667 14.0667 14.6667 13.3333L14.6667 7.33333C14.6667 6.6 14.0667 6 13.3333 6L7.33333 6C6.6 6 6 6.6 6 7.33333L6 13.3333C6 14.0667 6.6 14.6667 7.33333 14.6667Z"
                            stroke={color.textColor === 'text-black' ? 'black' : '#f0f0f0'}
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className={`${color.labelBg} px-3 py-1.5 rounded-full`}>
                      <p className={`font-text text-[12px] font-bold leading-[1.25] ${color.labelText}`}>
                        {color.label}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 mt-12">
                    {[
                      { label: color.hex },
                      { label: color.rgb }
                    ].map((item, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <p className={`font-text text-[12px] font-bold leading-[1.25] ${color.textColor}`}>
                          {item.label}
                        </p>
                        <button
                          onClick={() => copyToClipboard(item.label)}
                          className="hover:opacity-70 transition-opacity flex-shrink-0"
                          title={`Copy ${item.label}`}
                        >
                          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                            <path d="M5.33333 10L2.66667 10C1.93333 10 1.33333 9.4 1.33333 8.66667L1.33333 2.66667C1.33333 1.93333 1.93333 1.33333 2.66667 1.33333L8.66667 1.33333C9.4 1.33333 10 1.93333 10 2.66667L10 5.33333M7.33333 14.6667L13.3333 14.6667C14.0667 14.6667 14.6667 14.0667 14.6667 13.3333L14.6667 7.33333C14.6667 6.6 14.0667 6 13.3333 6L7.33333 6C6.6 6 6 6.6 6 7.33333L6 13.3333C6 14.0667 6.6 14.6667 7.33333 14.6667Z"
                              stroke={color.textColor === 'text-black' ? 'black' : '#f0f0f0'}
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mono Colors */}
          <div className="flex flex-col gap-6">
            <h3 className="font-display text-h4-mobile md:text-h4-tablet xl:text-h4-desktop text-brand-vanilla">Mono</h3>
            <div className="flex flex-wrap gap-4 w-full">
              {monoColors.map((color) => (
                <div
                  key={color.hex}
                  className={`flex-1 min-w-[162px] min-h-[162px] ${color.bg} rounded-xl p-[10px] flex flex-col justify-between border border-[#4a4a4a]`}
                >
                  <div className="flex gap-2 items-center">
                    <p className={`font-text text-b2 ${color.textColor}`}>
                      {color.name}
                    </p>
                    <button
                      onClick={() => copyToClipboard(color.name)}
                      className="hover:opacity-70 transition-opacity flex-shrink-0"
                      title="Copy color name"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                        <path d="M5.33333 10L2.66667 10C1.93333 10 1.33333 9.4 1.33333 8.66667L1.33333 2.66667C1.33333 1.93333 1.93333 1.33333 2.66667 1.33333L8.66667 1.33333C9.4 1.33333 10 1.93333 10 2.66667L10 5.33333M7.33333 14.6667L13.3333 14.6667C14.0667 14.6667 14.6667 14.0667 14.6667 13.3333L14.6667 7.33333C14.6667 6.6 14.0667 6 13.3333 6L7.33333 6C6.6 6 6 6.6 6 7.33333L6 13.3333C6 14.0667 6.6 14.6667 7.33333 14.6667Z"
                          stroke={color.textColor === 'text-black' ? 'black' : '#f0f0f0'}
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="flex flex-col gap-2">
                    {[
                      { label: color.hex },
                      { label: color.rgb }
                    ].map((item, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <p className={`font-text text-[12px] font-bold leading-[1.25] ${color.textColor}`}>
                          {item.label}
                        </p>
                        <button
                          onClick={() => copyToClipboard(item.label)}
                          className="hover:opacity-70 transition-opacity flex-shrink-0"
                          title={`Copy ${item.label}`}
                        >
                          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                            <path d="M5.33333 10L2.66667 10C1.93333 10 1.33333 9.4 1.33333 8.66667L1.33333 2.66667C1.33333 1.93333 1.93333 1.33333 2.66667 1.33333L8.66667 1.33333C9.4 1.33333 10 1.93333 10 2.66667L10 5.33333M7.33333 14.6667L13.3333 14.6667C14.0667 14.6667 14.6667 14.0667 14.6667 13.3333L14.6667 7.33333C14.6667 6.6 14.0667 6 13.3333 6L7.33333 6C6.6 6 6 6.6 6 7.33333L6 13.3333C6 14.0667 6.6 14.6667 7.33333 14.6667Z"
                              stroke={color.textColor === 'text-black' ? 'black' : '#f0f0f0'}
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Typography Block */}
        <div id="typography">
          <TypographyBlock />
        </div>

        {/* Guide/Iframe Block - Horizontal */}
        <div id="guide" className="flex gap-6 items-start w-full">
          <div className="flex-1 flex flex-col gap-8 min-w-0">
            <h2 className="font-display text-d2-mobile md:text-d2-tablet xl:text-d2-desktop text-brand-vanilla">
              Guide
            </h2>
            <p className="font-text text-b1 text-brand-vanilla">
              Welcome to Open Session. Here you can find all of our brand guidelines. Covering everything from messaging to art direction and even AI guidance
            </p>
            <div className="flex gap-3 items-center">
              <a
                href="https://www.figma.com/proto/t6ibLjzJFXY6HzU0bIahxw/BRAND-OS?page-id=19939%3A21956&node-id=20255-18337&viewport=465%2C-92%2C0.05&t=Fjx1co9Q53DPCGLw-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=20255%3A18337"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand-vanilla hover:bg-brand-vanilla/90 transition-colors px-4 py-3 rounded-full flex gap-2 items-center min-w-[128px] justify-center"
              >
                <span className="font-text text-button text-brand-charcoal">Source</span>
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
          <div className="flex-1 min-w-[300px] h-[399px] rounded-xl overflow-hidden">
            <iframe
              style={{ border: '1px solid rgba(0, 0, 0, 0.1)' }}
              className="w-full h-full rounded-xl"
              src="https://embed.figma.com/proto/t6ibLjzJFXY6HzU0bIahxw/BRAND-OS?page-id=19939%3A21956&node-id=20255-18337&viewport=465%2C-92%2C0.05&scaling=scale-down&content-scaling=fixed&starting-point-node-id=20255%3A18337&embed-host=share"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </main>
    </>
  )
}
