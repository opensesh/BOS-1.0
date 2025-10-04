import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import { PaintBucket, Download } from 'lucide-react'
import { LOGO_ASSETS, type LogoType, type ColorVariant } from '../../assets/logos'
import type { LogoFrameHandle } from './LogoBlock'

type DownloadFormat = 'SVG' | 'PNG'

interface LogoFrameProps {
  title: string
  logoType: LogoType
  logoAlt?: string
  colorVariants?: ColorVariant[]
}

const LogoFrame = forwardRef<LogoFrameHandle, LogoFrameProps>(({
  title,
  logoType,
  logoAlt = 'Logo',
  colorVariants = ['Charcoal', 'Glass', 'Vanilla'],
}, ref) => {
  const [showColorMenu, setShowColorMenu] = useState(false)
  const [showDownloadMenu, setShowDownloadMenu] = useState(false)
  const [currentColor, setCurrentColor] = useState<ColorVariant>('Vanilla')
  const logoDisplayRef = useRef<HTMLDivElement>(null)
  const [svgContent, setSvgContent] = useState<string>('')
  const colorMenuRef = useRef<HTMLDivElement>(null)
  const downloadMenuRef = useRef<HTMLDivElement>(null)

  // Expose resetColor method to parent via ref
  useImperativeHandle(ref, () => ({
    resetColor: () => {
      setCurrentColor('Vanilla')
    }
  }))

  // Handle click outside to close menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorMenuRef.current && !colorMenuRef.current.contains(event.target as Node)) {
        setShowColorMenu(false)
      }
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(event.target as Node)) {
        setShowDownloadMenu(false)
      }
    }

    if (showColorMenu || showDownloadMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [showColorMenu, showDownloadMenu])

  const handleColorClick = () => {
    setShowColorMenu(!showColorMenu)
    setShowDownloadMenu(false)
  }

  const handleDownloadClick = () => {
    setShowDownloadMenu(!showDownloadMenu)
    setShowColorMenu(false)
  }

  const handleColorSelect = (color: ColorVariant) => {
    setCurrentColor(color)
    setShowColorMenu(false)
  }

  const handleFormatSelect = async (format: DownloadFormat) => {
    setShowDownloadMenu(false)

    if (format === 'SVG') {
      downloadSVG()
    } else if (format === 'PNG') {
      await convertToPNG()
    }
  }

  const downloadSVG = () => {
    if (!svgContent) return

    // Determine section based on logoType
    const section = ['core', 'outline', 'filled'].includes(logoType) ? 'monogram' : 'main'
    const filename = `logo_${section}_${logoType}_${currentColor.toLowerCase()}.svg`

    const blob = new Blob([svgContent], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const convertToPNG = async () => {
    if (!logoDisplayRef.current || !svgContent) return

    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const rect = logoDisplayRef.current.getBoundingClientRect()
      canvas.width = rect.width * 2
      canvas.height = rect.height * 2

      // Fill background
      ctx.fillStyle = getBackgroundColor() === 'bg-brand-charcoal' ? '#191919' : '#FFFAEE'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Create blob from SVG and draw
      const blob = new Blob([svgContent], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      const img = new Image()

      await new Promise<void>((resolve) => {
        img.onload = () => {
          const scale = Math.min(canvas.width / img.width, canvas.height / img.height) * 0.7
          const scaledWidth = img.width * scale
          const scaledHeight = img.height * scale
          const x = (canvas.width - scaledWidth) / 2
          const y = (canvas.height - scaledHeight) / 2
          ctx.drawImage(img, x, y, scaledWidth, scaledHeight)
          URL.revokeObjectURL(url)
          resolve()
        }
        img.src = url
      })

      // Determine section based on logoType
      const section = ['core', 'outline', 'filled'].includes(logoType) ? 'monogram' : 'main'
      const filename = `logo_${section}_${logoType}_${currentColor.toLowerCase()}.png`

      canvas.toBlob((blob) => {
        if (!blob) return
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      }, 'image/png')
    } catch (error) {
      console.error('PNG conversion failed:', error)
    }
  }

  // Get current logo source based on variant
  const getCurrentLogoSrc = () => {
    const logo = LOGO_ASSETS[logoType]

    // All logos now have variants structure
    const logoWithVariants = logo as { vanilla: string; glass: string }

    if (currentColor === 'Glass') {
      return logoWithVariants.glass
    }

    // For combo, use charcoal-specific SVG if it exists
    if (logoType === 'combo' && currentColor === 'Charcoal') {
      return '/logos/logo_main_combo_charcoal.svg'
    }

    // Use vanilla version for Vanilla and other Charcoal logos
    return logoWithVariants.vanilla
  }

  // Fetch and modify SVG content
  useEffect(() => {
    const fetchAndModifySVG = async () => {
      const logoSrc = getCurrentLogoSrc()

      if (typeof logoSrc === 'string') {
        try {
          const response = await fetch(logoSrc)
          let svg = await response.text()

          // Modify SVG color based on selection (except for combo which has separate files)
          if (currentColor === 'Charcoal' && logoType !== 'combo') {
            // Replace CSS variable fills and direct color fills with charcoal
            svg = svg.replace(/fill="var\(--fill-0,\s*#[Ff]{3,6}[Aa]?[Ee]{2}?\)"/gi, 'fill="#191919"')
            svg = svg.replace(/fill="#[Ff]{3,6}[Aa]?[Ee]{2}?"/gi, 'fill="#191919"')
            svg = svg.replace(/fill:[#]?[Ff]{3,6}[Aa]?[Ee]{2}?/gi, 'fill:#191919')
          }

          setSvgContent(svg)
        } catch (error) {
          console.error('Failed to fetch SVG:', error)
        }
      } else if (logoSrc.icon && logoSrc.text) {
        // For combo logos, fetch both parts
        try {
          const [iconResponse, textResponse] = await Promise.all([
            fetch(logoSrc.icon),
            fetch(logoSrc.text)
          ])

          let iconSvg = await iconResponse.text()
          let textSvg = await textResponse.text()

          // Modify colors if Charcoal selected
          if (currentColor === 'Charcoal') {
            iconSvg = iconSvg.replace(/fill="var\(--fill-0,\s*#[Ff]{3,6}[Aa]?[Ee]{2}?\)"/gi, 'fill="#191919"')
            iconSvg = iconSvg.replace(/fill="#[Ff]{3,6}[Aa]?[Ee]{2}?"/gi, 'fill="#191919"')
            textSvg = textSvg.replace(/fill="var\(--fill-0,\s*#[Ff]{3,6}[Aa]?[Ee]{2}?\)"/gi, 'fill="#191919"')
            textSvg = textSvg.replace(/fill="#[Ff]{3,6}[Aa]?[Ee]{2}?"/gi, 'fill="#191919"')
          }

          // Render combo as side by side in a container (don't combine SVGs)
          setSvgContent(JSON.stringify({ icon: iconSvg, text: textSvg }))
        } catch (error) {
          console.error('Failed to fetch combo SVGs:', error)
        }
      }
    }

    fetchAndModifySVG()
  }, [currentColor, logoType])

  // Get background color (INVERSE of logo color)
  const getBackgroundColor = () => {
    switch (currentColor) {
      case 'Charcoal':
        return 'bg-brand-vanilla' // White background for charcoal logo
      case 'Vanilla':
        return 'bg-brand-charcoal' // Dark background for vanilla logo
      case 'Glass':
        return 'bg-[#1e1e1e]' // Dark background for glass logo
      default:
        return 'bg-black'
    }
  }

  // Render logo with exact Figma positioning
  const renderLogo = () => {
    if (!svgContent) return null

    // Combo - modify SVG to match stacked properties
    if (logoType === 'combo') {
      // Modify SVG to have same properties as stacked: preserveAspectRatio="none" width="100%" height="100%"
      let modifiedSvg = svgContent
        .replace(/<svg[^>]*/, (match) => {
          return match
            .replace(/width="[^"]*"/gi, 'width="100%"')
            .replace(/height="[^"]*"/gi, 'height="100%"')
            .replace(/preserveAspectRatio="[^"]*"/gi, 'preserveAspectRatio="none"')
        })

      // Add attributes if they don't exist
      if (!modifiedSvg.includes('width=')) {
        modifiedSvg = modifiedSvg.replace('<svg', '<svg width="100%"')
      }
      if (!modifiedSvg.includes('height=')) {
        modifiedSvg = modifiedSvg.replace('<svg', '<svg height="100%"')
      }
      if (!modifiedSvg.includes('preserveAspectRatio')) {
        modifiedSvg = modifiedSvg.replace('<svg', '<svg preserveAspectRatio="none"')
      }
      if (!modifiedSvg.includes('overflow=')) {
        modifiedSvg = modifiedSvg.replace('<svg', '<svg overflow="visible"')
      }
      if (!modifiedSvg.includes('style=')) {
        modifiedSvg = modifiedSvg.replace('<svg', '<svg style="display: block;"')
      }

      return (
        <div className="relative shrink-0 size-[211.437px]">
          <div
            className="absolute aspect-[480/141] left-[5%] right-[5%] top-1/2 -translate-y-1/2"
            dangerouslySetInnerHTML={{ __html: modifiedSvg }}
          />
        </div>
      )
    }

    // Brandmark - uses aspect ratio positioning
    if (logoType === 'brandmark') {
      return (
        <div className="relative shrink-0 size-[211.437px]">
          <div
            className="absolute aspect-[160/140] left-[0.17%] right-[-0.17%] top-1/2 -translate-y-1/2"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        </div>
      )
    }

    // Stacked - uses Figma structure with py-24 wrapper and fixed size container
    if (logoType === 'stacked') {
      return (
        <div className="relative shrink-0 size-[211.437px]">
          <div
            className="absolute aspect-[368.133/140] left-[19.41%] right-[19.24%] top-1/2 -translate-y-1/2"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        </div>
      )
    }

    // Horizontal - fixed height with percentage positioning
    if (logoType === 'horizontal') {
      return (
        <div className="w-full h-[260px] relative">
          <div
            className="absolute aspect-[401/63] left-[31.57%] right-[31.57%] top-1/2 -translate-y-1/2"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        </div>
      )
    }

    // Monograms - centered with specific positioning
    if (logoType === 'core') {
      return (
        <div className="relative shrink-0 size-[211.437px]">
          <div
            className="absolute aspect-[176/88] left-[20.67%] right-[20.67%] top-1/2 -translate-y-1/2"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        </div>
      )
    }

    if (logoType === 'outline' || logoType === 'filled') {
      return (
        <div className="relative shrink-0 size-[211.437px]">
          <div
            className="absolute h-[60.612px] w-[35.24px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        </div>
      )
    }

    return null
  }

  return (
    <div className="relative flex flex-col bg-black rounded-3xl min-w-[260px] flex-1 basis-0 grow overflow-hidden">
      {/* Border overlay */}
      <div aria-hidden="true" className="absolute border border-[#787878] border-solid inset-0 pointer-events-none rounded-3xl z-10" style={{ borderColor: currentColor === 'Charcoal' ? 'transparent' : '#787878' }} />

      {/* Header */}
      <div className="bg-brand-vanilla box-border flex items-center justify-between overflow-visible p-3 relative rounded-tl-3xl rounded-tr-3xl shrink-0 w-full z-[15]">
        <h3 className="font-display text-h4-mobile tracking-[-0.25px] text-brand-charcoal leading-[1.2]">
          {title}
        </h3>

        <div className="flex gap-3 items-center relative z-[20]">
          {/* Color Button */}
          <div className="relative" ref={colorMenuRef}>
            <button
              onClick={handleColorClick}
              className={`rounded-full p-3 transition-all ${showColorMenu ? 'bg-brand-aperol' : 'bg-brand-charcoal hover:opacity-80'}`}
              aria-label="Change color"
            >
              <PaintBucket className="w-4 h-4 text-brand-vanilla" />
            </button>

            {/* Color Menu */}
            {showColorMenu && (
              <div className="absolute top-full right-0 mt-[20px] flex flex-col gap-2 z-[30]">
                {colorVariants.map((color) => {
                  const isSelected = currentColor === color
                  const getColorButtonStyle = () => {
                    // Selected state styling based on which color is selected
                    if (isSelected) {
                      if (color === 'Charcoal') {
                        // Charcoal selected: charcoal fill with vanilla text
                        return 'bg-brand-charcoal border-brand-charcoal text-brand-vanilla'
                      }
                      if (color === 'Glass') {
                        // Glass selected: glass effect with vanilla text
                        return 'backdrop-blur-[51px] bg-[rgba(255,250,238,0.2)] border-brand-vanilla text-brand-vanilla shadow-[3.4px_-3.4px_3.4px_0px_inset_rgba(214,210,200,0.6),-3.4px_3.4px_3.4px_0px_inset_rgba(255,255,255,0.6)]'
                      }
                      if (color === 'Vanilla') {
                        // Vanilla selected: vanilla fill with charcoal text
                        return 'bg-brand-vanilla border-brand-vanilla text-brand-charcoal'
                      }
                      // Default selected state (orange)
                      return 'bg-brand-aperol border-brand-aperol text-brand-vanilla'
                    }

                    // Unselected states - always show consistent styling
                    if (color === 'Charcoal') {
                      // When Vanilla or Glass selected, use vanilla border for contrast
                      const borderColor = (currentColor === 'Vanilla' || currentColor === 'Glass')
                        ? 'border-brand-vanilla'
                        : 'border-brand-charcoal'
                      return `bg-brand-charcoal ${borderColor} text-brand-vanilla hover:opacity-80`
                    }
                    if (color === 'Glass') {
                      // Glass button text: vanilla when vanilla selected (charcoal bg), charcoal otherwise
                      const textColor = currentColor === 'Vanilla' ? 'text-brand-vanilla' : 'text-brand-charcoal'
                      return `backdrop-blur-[51px] bg-[rgba(255,250,238,0.2)] border-brand-vanilla ${textColor} shadow-[3.4px_-3.4px_3.4px_0px_inset_rgba(214,210,200,0.6),-3.4px_3.4px_3.4px_0px_inset_rgba(255,255,255,0.6)] hover:bg-[rgba(255,250,238,0.3)]`
                    }
                    if (color === 'Vanilla') {
                      return 'bg-brand-vanilla border-black text-black hover:opacity-80'
                    }
                    return 'bg-brand-charcoal border-white text-white hover:opacity-80'
                  }

                  return (
                    <button
                      key={color}
                      onClick={() => handleColorSelect(color)}
                      className={`rounded-full px-4 py-3 border transition-all min-w-[80px] ${getColorButtonStyle()}`}
                    >
                      <span className="font-text text-button whitespace-nowrap leading-[1.25]">
                        {color}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Download Button */}
          <div className="relative" ref={downloadMenuRef}>
            <button
              onClick={handleDownloadClick}
              className={`rounded-full p-3 transition-all ${showDownloadMenu ? 'bg-brand-aperol' : 'bg-brand-charcoal hover:opacity-80'}`}
              aria-label="Download logo"
            >
              <Download className="w-4 h-4 text-brand-vanilla" />
            </button>

            {/* Download Menu */}
            {showDownloadMenu && (
              <div className="absolute top-full right-0 mt-[20px] flex flex-col gap-2 z-[30]">
                <button
                  onClick={() => handleFormatSelect('SVG')}
                  className="bg-brand-charcoal rounded-full px-4 py-3 border border-white hover:opacity-80 transition-opacity min-w-[80px]"
                >
                  <span className="font-text text-button text-white leading-[1.25]">SVG</span>
                </button>
                <button
                  onClick={() => handleFormatSelect('PNG')}
                  className="bg-brand-charcoal rounded-full px-4 py-3 border border-white hover:opacity-80 transition-opacity min-w-[80px]"
                >
                  <span className="font-text text-button text-white leading-[1.25]">PNG</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Logo Display Area - exact Figma structure */}
      <div
        ref={logoDisplayRef}
        className={`w-full box-border flex gap-2.5 items-center justify-center px-0 py-6 relative flex-1 transition-colors overflow-visible ${getBackgroundColor()}`}
      >
        {renderLogo()}
      </div>
    </div>
  )
})

LogoFrame.displayName = 'LogoFrame'

export default LogoFrame
