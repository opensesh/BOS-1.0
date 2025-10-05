import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import { PaintBucket, Download } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
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
      return `${import.meta.env.BASE_URL}assets/logos/logo_main_combo_charcoal.svg`
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

  // Render logo - now properly sized SVGs with correct aspect ratios
  const renderLogo = () => {
    if (!svgContent) return null

    // All logos: center and scale to fit within container with proper aspect ratio
    // SVGs now have proper dimensions and preserveAspectRatio="xMidYMid meet"
    // Main logos: 85.5% (reduced by 5% from 90%), Accessory logos: 66.5% (reduced by 5% from 70%)
    const sizeScale = (logoType === 'filled' || logoType === 'outline') ? '66.5%' : '85.5%'

    const responsiveSvg = svgContent.replace(
      /<svg([^>]*)>/,
      `<svg$1 style="width: ${sizeScale}; height: ${sizeScale}; max-width: 100%; max-height: 100%;">`
    )

    return (
      <div className="w-full h-full flex items-center justify-center">
        <div
          className="flex items-center justify-center overflow-hidden"
          style={{ width: sizeScale, height: sizeScale }}
          dangerouslySetInnerHTML={{ __html: responsiveSvg }}
        />
      </div>
    )
  }

  // Determine if this logo should have square aspect ratio (all frames on mobile need square to fit buttons)
  const isSquareFrame = logoType === 'combo' || logoType === 'stacked' || logoType === 'brandmark' || logoType === 'horizontal' || logoType === 'core' || logoType === 'filled' || logoType === 'outline'

  return (
    <div className={`relative flex flex-col bg-black rounded-3xl min-w-[260px] flex-1 basis-0 grow overflow-hidden ${isSquareFrame ? 'aspect-square' : ''}`}>
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
            <motion.button
              onClick={handleColorClick}
              className={`rounded-full p-3 ${showColorMenu ? 'bg-brand-aperol' : 'bg-brand-charcoal'}`}
              aria-label="Change color"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <motion.div
                animate={{
                  y: showColorMenu ? [0, -3, 0] : 0
                }}
                transition={{
                  duration: 0.4,
                  ease: "easeInOut"
                }}
              >
                <PaintBucket className="w-4 h-4 text-brand-vanilla" />
              </motion.div>
            </motion.button>

            {/* Color Menu */}
            <AnimatePresence>
              {showColorMenu && (
                <motion.div
                  className="absolute top-full right-0 mt-[24px] flex flex-col gap-2 z-[30]"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.05 }}
                >
                  {colorVariants.map((color, index) => {
                    const isSelected = currentColor === color
                    const getColorButtonStyle = () => {
                      // Selected state styling based on which color is selected
                      if (isSelected) {
                        if (color === 'Charcoal') {
                          // Charcoal selected: charcoal fill with vanilla text
                          return 'bg-brand-charcoal border-brand-charcoal text-brand-vanilla'
                        }
                        if (color === 'Glass') {
                          // Glass selected: mono 50 fill with vanilla text and border
                          return 'bg-[#808080] border-brand-vanilla text-brand-vanilla'
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
                        return `bg-brand-charcoal ${borderColor} text-brand-vanilla`
                      }
                      if (color === 'Glass') {
                        // Glass button: mono 50 fill with vanilla text and border
                        const textColor = currentColor === 'Vanilla' ? 'text-brand-vanilla' : 'text-brand-charcoal'
                        return `bg-[#808080] border-brand-vanilla ${textColor}`
                      }
                      if (color === 'Vanilla') {
                        return 'bg-brand-vanilla border-black text-black'
                      }
                      return 'bg-brand-charcoal border-white text-white'
                    }

                    return (
                      <motion.button
                        key={color}
                        onClick={() => handleColorSelect(color)}
                        className={`rounded-full px-4 py-3 border min-w-[80px] ${getColorButtonStyle()}`}
                        initial={{
                          opacity: 0,
                          x: -20
                        }}
                        animate={{
                          opacity: 1,
                          x: 0
                        }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 25,
                          delay: 0.05 + (index * 0.05)
                        }}
                        whileHover={{ scale: 1.05, x: -4 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="font-text text-button whitespace-nowrap leading-[1.25]">
                          {color}
                        </span>
                      </motion.button>
                    )
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Download Button */}
          <div className="relative" ref={downloadMenuRef}>
            <motion.button
              onClick={handleDownloadClick}
              className={`rounded-full p-3 ${showDownloadMenu ? 'bg-brand-aperol' : 'bg-brand-charcoal'}`}
              aria-label="Download logo"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <motion.div
                animate={{
                  y: showDownloadMenu ? [0, -3, 0] : 0
                }}
                transition={{
                  duration: 0.4,
                  ease: "easeInOut"
                }}
              >
                <Download className="w-4 h-4 text-brand-vanilla" />
              </motion.div>
            </motion.button>

            {/* Download Menu */}
            <AnimatePresence>
              {showDownloadMenu && (
                <motion.div
                  className="absolute top-full right-0 mt-[24px] flex flex-col gap-2 z-[30]"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <motion.button
                    onClick={() => handleFormatSelect('SVG')}
                    className="bg-brand-charcoal rounded-full px-4 py-3 border border-white min-w-[80px]"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                      delay: 0
                    }}
                    whileHover={{ scale: 1.05, x: -4 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="font-text text-button text-white leading-[1.25]">SVG</span>
                  </motion.button>
                  <motion.button
                    onClick={() => handleFormatSelect('PNG')}
                    className="bg-brand-charcoal rounded-full px-4 py-3 border border-white min-w-[80px]"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                      delay: 0.05
                    }}
                    whileHover={{ scale: 1.05, x: -4 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="font-text text-button text-white leading-[1.25]">PNG</span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Logo Display Area - exact Figma structure */}
      <div
        ref={logoDisplayRef}
        className={`w-full box-border flex gap-2.5 items-center justify-center px-0 py-[5%] relative flex-1 transition-colors overflow-visible ${getBackgroundColor()}`}
      >
        {renderLogo()}
      </div>
    </div>
  )
})

LogoFrame.displayName = 'LogoFrame'

export default LogoFrame
