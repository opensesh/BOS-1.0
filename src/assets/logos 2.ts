// Logo assets from Figma Design System
export const LOGO_ASSETS = {
  // Main Logos
  brandmark: {
    vanilla: '/logos/brandmark-vanilla.svg',
    glass: '/logos/brandmark-glass.svg',
  },
  combo: {
    vanilla: '/logos/logo_main_combo_vanilla.svg',
    glass: '/logos/logo_main_combo_glass.svg',
  },
  stacked: {
    vanilla: '/logos/stacked-vanilla.svg',
    glass: '/logos/stacked-glass.svg',
  },
  horizontal: {
    vanilla: '/logos/horizontal-vanilla.svg',
    glass: '/logos/horizontal-glass.svg',
  },
  // Monograms
  core: {
    vanilla: '/logos/core.svg',
    glass: '/logos/core-glass.svg',
  },
  outline: {
    vanilla: '/logos/outline.svg',
    glass: '/logos/outline-glass.svg',
  },
  filled: {
    vanilla: '/logos/filled.svg',
    glass: '/logos/filled-glass.svg',
  },
} as const

export type LogoType = 'brandmark' | 'combo' | 'stacked' | 'horizontal' | 'core' | 'outline' | 'filled'
export type ColorVariant = 'Charcoal' | 'Glass' | 'Vanilla'
