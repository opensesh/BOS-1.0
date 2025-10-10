import JSZip from 'jszip'

const BASE_URL = import.meta.env.BASE_URL

// Complete file mappings for each asset folder
const assetFiles: Record<string, string[]> = {
  icons: [
    'Linkree_figma_thumbnails.svg',
    'Linkree_instagram_thumbnails.svg',
    'Linkree_linkedin_thumbnails.svg',
    'Linkree_medium_thumbnails.svg',
    'Linkree_newsletter_thumbnails.svg',
    'Linkree_substack_thumbnails.svg',
    'Linkree_website_thumbnails.svg',
    'Linkree_youtube_thumbnails.svg',
    'OS_brand_favicon.png',
  ],
  logos: [
    'brandmark-glass.svg',
    'brandmark-vanilla.svg',
    'combo-icon-glass.svg',
    'combo-icon-vanilla.svg',
    'combo-text-glass.svg',
    'combo-text-vanilla.svg',
    'core-glass.svg',
    'core.svg',
    'filled-glass.svg',
    'filled.svg',
    'horizontal-glass.svg',
    'horizontal-vanilla.svg',
    'logo_main_combo_charcoal.svg',
    'logo_main_combo_glass.svg',
    'logo_main_combo_vanilla.svg',
    'outline-glass.svg',
    'outline.svg',
    'stacked-glass.svg',
    'stacked-vanilla.svg',
  ],
  textures: [
    'texture_recycled-card_01_compressed.jpg',
    'texture_ascii_01_white_compressed.jpg',
    'texture_recycled-card_04_compressed.jpg',
    'texture_recycled-card_03_compressed.jpg',
    'texture_ascii_03_black_compressed.jpg',
    'texture_recycled-card_02_compressed.jpg',
    'texture_halftone_04_compressed.jpg',
    'texture_halftone_03_compressed.jpg',
    'texture_halftone_02_compressed.jpg',
    'texture_ascii_02_white_compressed.jpg',
    'texture_halftone_01_compressed.jpg',
    'texture_ascii_04_black_compressed.jpg',
  ],
  images: [
    'auto-audi-quattro-urban-portrait.png',
    'auto-bmw-convertible-garage-night.png',
    'auto-desert-porsche-sunset-drift.png',
    'auto-night-drive-motion-blur.png',
    'auto-rally-porsche-night-racing.png',
    'auto-truck-wildflowers-mountain-dusk.png',
    'auto-vintage-interior-dashboard-sunset.png',
    'auto-white-porsche-desert-headlights.png',
    'escape-astronaut-sparkle-floating.png',
    'escape-cliffside-workspace-ocean-view.png',
    'escape-coastal-laptop-remote-work.png',
    'escape-desert-silhouette-wanderer.png',
    'escape-floating-sun-documents.png',
    'escape-geometric-stairs-silhouette.png',
    'escape-meadow-workspace-clouds.png',
    'escape-mountain-desk-wilderness.png',
    'feel-abstract-figure-warm-tones.png',
    'feel-delicate-abstract-movement.png',
    'feel-dynamic-spin-motion-dress.png',
    'feel-ethereal-portrait-softness.png',
    'feel-flowing-fabric-grace.png',
    'feel-motion-blur-bouquet-flowers.png',
    'feel-portrait-shadow-play.png',
    'feel-water-droplets-diagonal-reflection.png',
    'lifestyle-casual-chic-sidewalk.png',
    'lifestyle-confident-street-style.png',
    'lifestyle-contemporary-fashion-portrait.png',
    'lifestyle-editorial-look-urban.png',
    'lifestyle-minimalist-white-tones.png',
    'lifestyle-modern-aesthetic-pose.png',
    'lifestyle-urban-angel-street-fashion.png',
    'lifestyle-yellow-puffer-portrait.png',
    'move-abstract-dance-flow.png',
    'move-athletic-motion-energy.png',
    'move-dynamic-figure-action.png',
    'move-flowing-movement-grace.png',
    'move-gesture-blur-dance.png',
    'move-kinetic-energy-motion.png',
    'move-palm-trees-runners-motion.png',
    'move-speed-blur-running.png',
    'work-business-presentation.png',
    'work-conference-networking-event.png',
    'work-corporate-environment.png',
    'work-iterra-brand-green-hills.png',
    'work-office-workspace-modern.png',
    'work-professional-collaboration.png',
    'work-professional-setting.png',
    'work-team-meeting-discussion.png',
  ],
  fonts: [
    'README.md',
    'neue-haas-grotesk display/Desktop/Display/NeueHaasDisplayBlack.ttf',
    'neue-haas-grotesk display/Desktop/Display/NeueHaasDisplayBlackItalic.ttf',
    'neue-haas-grotesk display/Desktop/Display/NeueHaasDisplayBold.ttf',
    'neue-haas-grotesk display/Desktop/Display/NeueHaasDisplayBoldItalic.ttf',
    'neue-haas-grotesk display/Desktop/Display/NeueHaasDisplayLight.ttf',
    'neue-haas-grotesk display/Desktop/Display/NeueHaasDisplayLightItalic.ttf',
    'neue-haas-grotesk display/Desktop/Display/NeueHaasDisplayMedium.ttf',
    'neue-haas-grotesk display/Desktop/Display/NeueHaasDisplayMediumItalic.ttf',
    'neue-haas-grotesk display/Desktop/Display/NeueHaasDisplayRoman.ttf',
    'neue-haas-grotesk display/Desktop/Display/NeueHaasDisplayRomanItalic.ttf',
    'neue-haas-grotesk display/Desktop/Display/NeueHaasDisplayThin.ttf',
    'neue-haas-grotesk display/Desktop/Display/NeueHaasDisplayThinItalic.ttf',
    'neue-haas-grotesk display/Desktop/Display/NeueHaasDisplayXThin.ttf',
    'neue-haas-grotesk display/Desktop/Display/NeueHaasDisplayXThinItalic.ttf',
    'neue-haas-grotesk display/Desktop/Display/NeueHaasDisplayXXThin.ttf',
    'neue-haas-grotesk display/Desktop/Display/NeueHaasDisplayXXThinItalic.ttf',
    'neue-haas-grotesk display/Web/NeueHassGrotesk_Display/NeueHaasDisplayBlack.woff2',
    'neue-haas-grotesk display/Web/NeueHassGrotesk_Display/NeueHaasDisplayBlackItalic.woff2',
    'neue-haas-grotesk display/Web/NeueHassGrotesk_Display/NeueHaasDisplayBold.woff2',
    'neue-haas-grotesk display/Web/NeueHassGrotesk_Display/NeueHaasDisplayBoldItalic.woff2',
    'neue-haas-grotesk display/Web/NeueHassGrotesk_Display/NeueHaasDisplayLight.woff2',
    'neue-haas-grotesk display/Web/NeueHassGrotesk_Display/NeueHaasDisplayLightItalic.woff2',
    'neue-haas-grotesk display/Web/NeueHassGrotesk_Display/NeueHaasDisplayMedium.woff2',
    'neue-haas-grotesk display/Web/NeueHassGrotesk_Display/NeueHaasDisplayMediumItalic.woff2',
    'neue-haas-grotesk display/Web/NeueHassGrotesk_Display/NeueHaasDisplayRoman.woff2',
    'neue-haas-grotesk display/Web/NeueHassGrotesk_Display/NeueHaasDisplayRomanItalic.woff2',
    'neue-haas-grotesk display/Web/NeueHassGrotesk_Display/NeueHaasDisplayThin.woff2',
    'neue-haas-grotesk display/Web/NeueHassGrotesk_Display/NeueHaasDisplayThinItalic.woff2',
    'neue-haas-grotesk display/Web/NeueHassGrotesk_Display/NeueHaasDisplayXThin.woff2',
    'neue-haas-grotesk display/Web/NeueHassGrotesk_Display/NeueHaasDisplayXThinItalic.woff2',
    'neue-haas-grotesk display/Web/NeueHassGrotesk_Display/NeueHaasDisplayXXThin.woff2',
    'neue-haas-grotesk display/Web/NeueHassGrotesk_Display/NeueHaasDisplayXXThinItalic.woff2',
    'neue-haas-grotesk text/Desktop/Text/NHaasGroteskTXPro-55Rg.otf',
    'neue-haas-grotesk text/Desktop/Text/NHaasGroteskTXPro-56It.otf',
    'neue-haas-grotesk text/Desktop/Text/NHaasGroteskTXPro-65Md.otf',
    'neue-haas-grotesk text/Desktop/Text/NHaasGroteskTXPro-66MdIt.otf',
    'neue-haas-grotesk text/Desktop/Text/NHaasGroteskTXPro-75Bd.otf',
    'neue-haas-grotesk text/Desktop/Text/NHaasGroteskTXPro-76BdIt.otf',
    'neue-haas-grotesk text/Web/NeueHassGrotesk_Text/NHaasGroteskTXPro-55Rg.woff2',
    'neue-haas-grotesk text/Web/NeueHassGrotesk_Text/NHaasGroteskTXPro-56It.woff2',
    'neue-haas-grotesk text/Web/NeueHassGrotesk_Text/NHaasGroteskTXPro-65Md.woff2',
    'neue-haas-grotesk text/Web/NeueHassGrotesk_Text/NHaasGroteskTXPro-66MdIt.woff2',
    'neue-haas-grotesk text/Web/NeueHassGrotesk_Text/NHaasGroteskTXPro-75Bd.woff2',
    'neue-haas-grotesk text/Web/NeueHassGrotesk_Text/NHaasGroteskTXPro-76BdIt.woff2',
    'offbit/Desktop/OffBit-101.ttf',
    'offbit/Desktop/OffBit-101Bold.ttf',
    'offbit/Desktop/OffBit-Bold.ttf',
    'offbit/Desktop/OffBit-Dot.ttf',
    'offbit/Desktop/OffBit-DotBold.ttf',
    'offbit/Desktop/OffBit-Regular.ttf',
    'offbit/offbit_Web/OffBit-101.woff2',
    'offbit/offbit_Web/OffBit-101Bold.woff2',
    'offbit/offbit_Web/OffBit-Bold.woff2',
    'offbit/offbit_Web/OffBit-Dot.woff2',
    'offbit/offbit_Web/OffBit-DotBold.woff2',
    'offbit/offbit_Web/OffBit-Regular.woff2',
  ],
}

// Fix SVG to have proper aspect ratio for downloads
function fixSVGAspectRatio(svgContent: string): string {
  // Replace preserveAspectRatio="none" with preserveAspectRatio="xMidYMid meet"
  let fixed = svgContent.replace(/preserveAspectRatio="none"/gi, 'preserveAspectRatio="xMidYMid meet"')

  // Extract viewBox to calculate proper dimensions
  const viewBoxMatch = fixed.match(/viewBox="([^"]+)"/)
  if (viewBoxMatch) {
    // viewBox format: "minX minY width height"
    const viewBoxValues = viewBoxMatch[1].split(/\s+/).map(Number)
    const width = viewBoxValues[2]
    const height = viewBoxValues[3]

    // Replace width="100%" and height="100%" with actual dimensions from viewBox
    fixed = fixed.replace(/width="100%"/gi, `width="${width}"`)
    fixed = fixed.replace(/height="100%"/gi, `height="${height}"`)
  }

  // Remove overflow="visible" and style attributes that affect display
  fixed = fixed.replace(/overflow="visible"/gi, '')
  fixed = fixed.replace(/style="display: block;"/gi, '')

  return fixed
}

export async function downloadFolderAsZip(folderName: string) {
  const zip = new JSZip()
  const folder = zip.folder(folderName)

  if (!folder) {
    throw new Error('Failed to create zip folder')
  }

  const files = assetFiles[folderName] || []

  if (files.length === 0) {
    console.error(`No files found for folder: ${folderName}`)
    return
  }

  try {
    // Fetch all files and add to zip
    const fetchPromises = files.map(async (fileName) => {
      const filePath = `${BASE_URL}assets/${folderName}/${fileName}`
      const response = await fetch(filePath)

      if (!response.ok) {
        console.warn(`Failed to fetch ${fileName}`)
        return
      }

      // For logos folder, fix SVG aspect ratio
      if (folderName === 'logos' && fileName.endsWith('.svg')) {
        const svgText = await response.text()
        const fixedSVG = fixSVGAspectRatio(svgText)
        folder.file(fileName, fixedSVG)
      } else {
        const blob = await response.blob()
        folder.file(fileName, blob)
      }
    })

    await Promise.all(fetchPromises)

    // Generate zip file
    const content = await zip.generateAsync({ type: 'blob' })

    // Create download link
    const url = URL.createObjectURL(content)
    const link = document.createElement('a')
    link.href = url
    link.download = `${folderName}.zip`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error creating zip:', error)
    throw error
  }
}
