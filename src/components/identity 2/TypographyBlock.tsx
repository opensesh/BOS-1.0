import { useState } from 'react'
import { RotateCcw, Download, ChevronDown } from 'lucide-react'
import JSZip from 'jszip'

type TypeStyle = {
  id: string
  label: string
  fontFamily: string
  className: string
}

type TypeCategory = {
  id: 'display' | 'heading' | 'accent' | 'text'
  label: string
  styles: TypeStyle[]
  defaultText: string
  fontFamilyName: string
  fontFiles: string[]
}

const typeCategories: TypeCategory[] = [
  {
    id: 'display',
    label: 'Display',
    styles: [
      { id: 'd1', label: 'Display 1', fontFamily: 'font-display', className: 'text-d1-mobile md:text-d1-tablet xl:text-d1-desktop' },
      { id: 'd2', label: 'Display 2', fontFamily: 'font-display', className: 'text-d2-mobile md:text-d2-tablet xl:text-d2-desktop' },
    ],
    defaultText: 'Brand OS™',
    fontFamilyName: 'Neue Haas Grotesk Display',
    fontFiles: [
      '/fonts/neue-haas-grotesk display/Web/NeueHassGrotesk_Display/NeueHaasDisplayBlack.woff2',
      '/fonts/neue-haas-grotesk display/Web/NeueHassGrotesk_Display/NeueHaasDisplayBlackItalic.woff2',
      '/fonts/neue-haas-grotesk display/Web/NeueHassGrotesk_Display/NeueHaasDisplayBold.woff2',
      '/fonts/neue-haas-grotesk display/Web/NeueHassGrotesk_Display/NeueHaasDisplayBoldItalic.woff2',
      '/fonts/neue-haas-grotesk display/Web/NeueHassGrotesk_Display/NeueHaasDisplayLight.woff2',
      '/fonts/neue-haas-grotesk display/Web/NeueHassGrotesk_Display/NeueHaasDisplayLightItalic.woff2',
      '/fonts/neue-haas-grotesk display/Web/NeueHassGrotesk_Display/NeueHaasDisplayMedium.woff2',
      '/fonts/neue-haas-grotesk display/Web/NeueHassGrotesk_Display/NeueHaasDisplayMediumItalic.woff2',
      '/fonts/neue-haas-grotesk display/Web/NeueHassGrotesk_Display/NeueHaasDisplayRoman.woff2',
      '/fonts/neue-haas-grotesk display/Web/NeueHassGrotesk_Display/NeueHaasDisplayRomanItalic.woff2',
      '/fonts/neue-haas-grotesk display/Web/NeueHassGrotesk_Display/NeueHaasDisplayThin.woff2',
      '/fonts/neue-haas-grotesk display/Web/NeueHassGrotesk_Display/NeueHaasDisplayThinItalic.woff2',
      '/fonts/neue-haas-grotesk display/Web/NeueHassGrotesk_Display/NeueHaasDisplayXThin.woff2',
      '/fonts/neue-haas-grotesk display/Web/NeueHassGrotesk_Display/NeueHaasDisplayXThinItalic.woff2',
      '/fonts/neue-haas-grotesk display/Web/NeueHassGrotesk_Display/NeueHaasDisplayXXThin.woff2',
      '/fonts/neue-haas-grotesk display/Web/NeueHassGrotesk_Display/NeueHaasDisplayXXThinItalic.woff2',
      '/fonts/neue-haas-grotesk display/Desktop/Display/NeueHaasDisplayBlack.ttf',
      '/fonts/neue-haas-grotesk display/Desktop/Display/NeueHaasDisplayBlackItalic.ttf',
      '/fonts/neue-haas-grotesk display/Desktop/Display/NeueHaasDisplayBold.ttf',
      '/fonts/neue-haas-grotesk display/Desktop/Display/NeueHaasDisplayBoldItalic.ttf',
      '/fonts/neue-haas-grotesk display/Desktop/Display/NeueHaasDisplayLight.ttf',
      '/fonts/neue-haas-grotesk display/Desktop/Display/NeueHaasDisplayLightItalic.ttf',
      '/fonts/neue-haas-grotesk display/Desktop/Display/NeueHaasDisplayMedium.ttf',
      '/fonts/neue-haas-grotesk display/Desktop/Display/NeueHaasDisplayMediumItalic.ttf',
      '/fonts/neue-haas-grotesk display/Desktop/Display/NeueHaasDisplayRoman.ttf',
      '/fonts/neue-haas-grotesk display/Desktop/Display/NeueHaasDisplayRomanItalic.ttf',
      '/fonts/neue-haas-grotesk display/Desktop/Display/NeueHaasDisplayThin.ttf',
      '/fonts/neue-haas-grotesk display/Desktop/Display/NeueHaasDisplayThinItalic.ttf',
      '/fonts/neue-haas-grotesk display/Desktop/Display/NeueHaasDisplayXThin.ttf',
      '/fonts/neue-haas-grotesk display/Desktop/Display/NeueHaasDisplayXThinItalic.ttf',
      '/fonts/neue-haas-grotesk display/Desktop/Display/NeueHaasDisplayXXThin.ttf',
      '/fonts/neue-haas-grotesk display/Desktop/Display/NeueHaasDisplayXXThinItalic.ttf',
    ]
  },
  {
    id: 'heading',
    label: 'Heading',
    styles: [
      { id: 'h1', label: 'Heading 1', fontFamily: 'font-display', className: 'text-h1-mobile md:text-h1-tablet xl:text-h1-desktop' },
      { id: 'h2', label: 'Heading 2', fontFamily: 'font-display', className: 'text-h2-mobile md:text-h2-tablet xl:text-h2-desktop' },
      { id: 'h3', label: 'Heading 3', fontFamily: 'font-display', className: 'text-h3 md:text-h3-tablet xl:text-h3-desktop' },
      { id: 'h4', label: 'Heading 4', fontFamily: 'font-display', className: 'text-h4-mobile md:text-h4-tablet xl:text-h4-desktop' },
    ],
    defaultText: 'We aspire to be creative problem solvers',
    fontFamilyName: 'Neue Haas Grotesk Display',
    fontFiles: [
      '/fonts/neue-haas-grotesk display/Web/NeueHassGrotesk_Display/NeueHaasDisplayBlack.woff2',
      '/fonts/neue-haas-grotesk display/Web/NeueHassGrotesk_Display/NeueHaasDisplayBlackItalic.woff2',
      '/fonts/neue-haas-grotesk display/Web/NeueHassGrotesk_Display/NeueHaasDisplayBold.woff2',
      '/fonts/neue-haas-grotesk display/Web/NeueHassGrotesk_Display/NeueHaasDisplayBoldItalic.woff2',
      '/fonts/neue-haas-grotesk display/Web/NeueHassGrotesk_Display/NeueHaasDisplayLight.woff2',
      '/fonts/neue-haas-grotesk display/Web/NeueHassGrotesk_Display/NeueHaasDisplayLightItalic.woff2',
      '/fonts/neue-haas-grotesk display/Web/NeueHassGrotesk_Display/NeueHaasDisplayMedium.woff2',
      '/fonts/neue-haas-grotesk display/Web/NeueHassGrotesk_Display/NeueHaasDisplayMediumItalic.woff2',
      '/fonts/neue-haas-grotesk display/Web/NeueHassGrotesk_Display/NeueHaasDisplayRoman.woff2',
      '/fonts/neue-haas-grotesk display/Web/NeueHassGrotesk_Display/NeueHaasDisplayRomanItalic.woff2',
      '/fonts/neue-haas-grotesk display/Web/NeueHassGrotesk_Display/NeueHaasDisplayThin.woff2',
      '/fonts/neue-haas-grotesk display/Web/NeueHassGrotesk_Display/NeueHaasDisplayThinItalic.woff2',
      '/fonts/neue-haas-grotesk display/Web/NeueHassGrotesk_Display/NeueHaasDisplayXThin.woff2',
      '/fonts/neue-haas-grotesk display/Web/NeueHassGrotesk_Display/NeueHaasDisplayXThinItalic.woff2',
      '/fonts/neue-haas-grotesk display/Web/NeueHassGrotesk_Display/NeueHaasDisplayXXThin.woff2',
      '/fonts/neue-haas-grotesk display/Web/NeueHassGrotesk_Display/NeueHaasDisplayXXThinItalic.woff2',
      '/fonts/neue-haas-grotesk display/Desktop/Display/NeueHaasDisplayBlack.ttf',
      '/fonts/neue-haas-grotesk display/Desktop/Display/NeueHaasDisplayBlackItalic.ttf',
      '/fonts/neue-haas-grotesk display/Desktop/Display/NeueHaasDisplayBold.ttf',
      '/fonts/neue-haas-grotesk display/Desktop/Display/NeueHaasDisplayBoldItalic.ttf',
      '/fonts/neue-haas-grotesk display/Desktop/Display/NeueHaasDisplayLight.ttf',
      '/fonts/neue-haas-grotesk display/Desktop/Display/NeueHaasDisplayLightItalic.ttf',
      '/fonts/neue-haas-grotesk display/Desktop/Display/NeueHaasDisplayMedium.ttf',
      '/fonts/neue-haas-grotesk display/Desktop/Display/NeueHaasDisplayMediumItalic.ttf',
      '/fonts/neue-haas-grotesk display/Desktop/Display/NeueHaasDisplayRoman.ttf',
      '/fonts/neue-haas-grotesk display/Desktop/Display/NeueHaasDisplayRomanItalic.ttf',
      '/fonts/neue-haas-grotesk display/Desktop/Display/NeueHaasDisplayThin.ttf',
      '/fonts/neue-haas-grotesk display/Desktop/Display/NeueHaasDisplayThinItalic.ttf',
      '/fonts/neue-haas-grotesk display/Desktop/Display/NeueHaasDisplayXThin.ttf',
      '/fonts/neue-haas-grotesk display/Desktop/Display/NeueHaasDisplayXThinItalic.ttf',
      '/fonts/neue-haas-grotesk display/Desktop/Display/NeueHaasDisplayXXThin.ttf',
      '/fonts/neue-haas-grotesk display/Desktop/Display/NeueHaasDisplayXXThinItalic.ttf',
    ]
  },
  {
    id: 'accent',
    label: 'Accent',
    styles: [
      { id: 'h5', label: 'Heading 5', fontFamily: 'font-accent', className: 'text-h5-mobile md:text-h5-tablet xl:text-h5-desktop' },
      { id: 'h6', label: 'Heading 6', fontFamily: 'font-accent', className: 'text-h6-mobile md:text-h6-tablet xl:text-h6-desktop' },
    ],
    defaultText: 'Born to Create, Made to Make',
    fontFamilyName: 'Offbit',
    fontFiles: [
      '/fonts/offbit/offbit_Web/OffBit-101.woff2',
      '/fonts/offbit/offbit_Web/OffBit-101Bold.woff2',
      '/fonts/offbit/offbit_Web/OffBit-Bold.woff2',
      '/fonts/offbit/offbit_Web/OffBit-Dot.woff2',
      '/fonts/offbit/offbit_Web/OffBit-DotBold.woff2',
      '/fonts/offbit/offbit_Web/OffBit-Regular.woff2',
      '/fonts/offbit/Desktop/OffBit-101.ttf',
      '/fonts/offbit/Desktop/OffBit-101Bold.ttf',
      '/fonts/offbit/Desktop/OffBit-Bold.ttf',
      '/fonts/offbit/Desktop/OffBit-Dot.ttf',
      '/fonts/offbit/Desktop/OffBit-DotBold.ttf',
      '/fonts/offbit/Desktop/OffBit-Regular.ttf',
    ]
  },
  {
    id: 'text',
    label: 'Text',
    styles: [
      { id: 'b1', label: 'Body 1', fontFamily: 'font-text', className: 'text-b1' },
      { id: 'b2', label: 'Body 2', fontFamily: 'font-text', className: 'text-b2' },
      { id: 'button', label: 'Button', fontFamily: 'font-text', className: 'text-button' },
      { id: 'caption', label: 'Caption', fontFamily: 'font-text', className: 'text-caption' },
      { id: 'label', label: 'Label', fontFamily: 'font-text', className: 'text-label uppercase' },
    ],
    defaultText: 'Figma serves as the core design system that integrates essential brand elements. It\'s filled with a rich base of variables for global and semantic tokens that can be translated into multiple styling outputs. On top of that it incorporates presentation templates, guidelines, flowcharts, and comprehensive AI data formatting for copy and code.',
    fontFamilyName: 'Neue Haas Grotesk Text',
    fontFiles: [
      '/fonts/neue-haas-grotesk text/Web/NeueHassGrotesk_Text/NHaasGroteskTXPro-55Rg.woff2',
      '/fonts/neue-haas-grotesk text/Web/NeueHassGrotesk_Text/NHaasGroteskTXPro-56It.woff2',
      '/fonts/neue-haas-grotesk text/Web/NeueHassGrotesk_Text/NHaasGroteskTXPro-65Md.woff2',
      '/fonts/neue-haas-grotesk text/Web/NeueHassGrotesk_Text/NHaasGroteskTXPro-66MdIt.woff2',
      '/fonts/neue-haas-grotesk text/Web/NeueHassGrotesk_Text/NHaasGroteskTXPro-75Bd.woff2',
      '/fonts/neue-haas-grotesk text/Web/NeueHassGrotesk_Text/NHaasGroteskTXPro-76BdIt.woff2',
      '/fonts/neue-haas-grotesk text/Desktop/Text/NHaasGroteskTXPro-55Rg.otf',
      '/fonts/neue-haas-grotesk text/Desktop/Text/NHaasGroteskTXPro-56It.otf',
      '/fonts/neue-haas-grotesk text/Desktop/Text/NHaasGroteskTXPro-65Md.otf',
      '/fonts/neue-haas-grotesk text/Desktop/Text/NHaasGroteskTXPro-66MdIt.otf',
      '/fonts/neue-haas-grotesk text/Desktop/Text/NHaasGroteskTXPro-75Bd.otf',
      '/fonts/neue-haas-grotesk text/Desktop/Text/NHaasGroteskTXPro-76BdIt.otf',
    ]
  }
]

type TypeRowProps = {
  category: TypeCategory
  isFirst?: boolean
}

function TypeRow({ category, isFirst = false }: TypeRowProps) {
  const [selectedStyle, setSelectedStyle] = useState(category.styles[0])
  const [text, setText] = useState(category.defaultText)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const handleReset = () => {
    setText(category.defaultText)
    setSelectedStyle(category.styles[0])
  }

  const handleDownload = async () => {
    try {
      const zip = new JSZip()
      const fontFolder = zip.folder(category.fontFamilyName)

      if (!fontFolder) {
        throw new Error('Failed to create zip folder')
      }

      // Fetch all font files and add them to the zip
      const fetchPromises = category.fontFiles.map(async (filePath) => {
        try {
          const response = await fetch(filePath)
          if (!response.ok) {
            console.warn(`Failed to fetch ${filePath}: ${response.statusText}`)
            return null
          }
          const blob = await response.blob()
          const fileName = filePath.split('/').pop() || 'font.woff2'
          fontFolder.file(fileName, blob)
          return fileName
        } catch (error) {
          console.warn(`Error fetching ${filePath}:`, error)
          return null
        }
      })

      const results = await Promise.all(fetchPromises)
      const successCount = results.filter(r => r !== null).length

      if (successCount === 0) {
        alert(`No font files found. Please add .woff2 files to the /public/fonts directory:\n\n${category.fontFiles.join('\n')}`)
        return
      }

      // Generate the zip file
      const content = await zip.generateAsync({ type: 'blob' })

      // Create download link
      const url = URL.createObjectURL(content)
      const link = document.createElement('a')
      link.href = url
      link.download = `${category.fontFamilyName.replace(/\s/g, '')}.zip`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      if (successCount < category.fontFiles.length) {
        alert(`Downloaded ${successCount} of ${category.fontFiles.length} font files.\n\nSome files were not found in /public/fonts/`)
      }
    } catch (error) {
      console.error('Download error:', error)
      alert(`Failed to download fonts. Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleStyleSelect = (style: TypeStyle) => {
    setSelectedStyle(style)
    setIsDropdownOpen(false)
  }

  return (
    <div className={`flex flex-col gap-8 w-full ${!isFirst ? 'pt-4 border-t border-[#383838]' : ''}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center justify-between min-w-[282px] w-full">
        {/* Style and Weight Selector */}
        <div className="flex gap-6 items-center min-w-[200px] py-2">
          <p className="font-display text-h4-mobile md:text-h4-tablet xl:text-h4-desktop text-brand-vanilla flex-grow min-w-0">
            {category.label}
          </p>

          {/* Custom Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex gap-2 items-center hover:opacity-80 transition-opacity"
            >
              <span className="font-text text-b2 text-brand-vanilla whitespace-nowrap">
                {selectedStyle.label}
              </span>
              <ChevronDown className="w-4 h-4 text-brand-vanilla" />
            </button>

            {isDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="absolute top-full mt-2 left-0 bg-[#1e1e1e] border border-[#383838] rounded-lg shadow-lg z-20 min-w-[140px]">
                  {category.styles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => handleStyleSelect(style)}
                      className={`w-full text-left px-4 py-2.5 font-text text-b2 text-brand-vanilla hover:bg-[#383838] transition-colors first:rounded-t-lg last:rounded-b-lg ${
                        selectedStyle.id === style.id ? 'bg-[#2a2a2a]' : ''
                      }`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Edit Items */}
        <div className="flex flex-wrap gap-3 items-center max-w-[282px]">
          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="border border-brand-vanilla rounded-full px-4 py-3 flex gap-2 items-center hover:bg-brand-vanilla/10 transition-colors"
          >
            <span className="font-text text-button text-brand-vanilla">Reset</span>
            <RotateCcw className="w-4 h-4 text-brand-vanilla" />
          </button>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="border border-brand-vanilla rounded-full px-4 py-3 flex gap-2 items-center hover:bg-brand-vanilla/10 transition-colors"
          >
            <span className="font-text text-button text-brand-vanilla">Download</span>
            <Download className="w-4 h-4 text-brand-vanilla" />
          </button>
        </div>
      </div>

      {/* Editable Text Display */}
      <div className="w-full">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className={`w-full bg-transparent text-brand-vanilla resize-none outline-none ${selectedStyle.fontFamily} ${selectedStyle.className}`}
          style={{ lineHeight: 'inherit' }}
          rows={Math.max(1, Math.ceil(text.length / 50))}
        />
      </div>
    </div>
  )
}

export default function TypographyBlock() {
  return (
    <div id="typography" className="flex flex-col gap-8">
      {/* Section Title */}
      <h2 className="font-display text-d2-mobile md:text-d2-tablet xl:text-d2-desktop text-brand-vanilla">
        Typography
      </h2>

      {/* Type Rows */}
      <div className="flex flex-col gap-[72px] w-full">
        {typeCategories.map((category, idx) => (
          <TypeRow
            key={category.id}
            category={category}
            isFirst={idx === 0}
          />
        ))}
      </div>
    </div>
  )
}
