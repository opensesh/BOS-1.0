/**
 * Gallery Component Test Page
 *
 * To view this page:
 * 1. Temporarily replace App.tsx import in main.tsx
 * 2. Or add this as a section in your main App.tsx
 */

import { HoverExpand_001, Skiper52 } from '@/components/ui/expand-on-hover'
import HoverExpandDefault from '@/components/ui/expand-on-hover-demo'

export default function GalleryTest() {
  const customImages = [
    {
      src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
      alt: "Mountain landscape",
      code: "#01",
    },
    {
      src: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800",
      alt: "Abstract art",
      code: "#02",
    },
    {
      src: "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?w=800",
      alt: "City skyline",
      code: "#03",
    },
    {
      src: "https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?w=800",
      alt: "Modern architecture",
      code: "#04",
    },
  ]

  return (
    <div className="min-h-screen bg-brand-charcoal">
      {/* Simple Header */}
      <header className="bg-brand-charcoal border-b border-brand-vanilla/10 py-6">
        <div className="container-responsive">
          <h1 className="text-h2-mobile md:text-h2-tablet font-display text-brand-vanilla">
            Gallery Test
          </h1>
        </div>
      </header>

      <main>
        {/* Test 1: Pre-built Horizontal Gallery */}
        <section className="py-20 bg-brand-vanilla">
          <div className="container-responsive mb-8">
            <h2 className="text-h3 md:text-h3-tablet font-display text-brand-charcoal mb-2">
              1. Horizontal Gallery (Pre-built)
            </h2>
            <p className="text-b2 text-brand-charcoal/70">
              Hover over images to expand
            </p>
          </div>
          <Skiper52 />
        </section>

        {/* Test 2: Vertical Gallery */}
        <section className="py-20 bg-brand-charcoal">
          <div className="container-responsive mb-8">
            <h2 className="text-h3 md:text-h3-tablet font-display text-brand-vanilla mb-2">
              2. Vertical Gallery
            </h2>
            <p className="text-b2 text-brand-vanilla/70">
              Hover over rows to expand
            </p>
          </div>
          <HoverExpandDefault />
        </section>

        {/* Test 3: Custom Images */}
        <section className="py-20 bg-brand-vanilla">
          <div className="container-responsive mb-8">
            <h2 className="text-h3 md:text-h3-tablet font-display text-brand-charcoal mb-2">
              3. Custom Images
            </h2>
            <p className="text-b2 text-brand-charcoal/70">
              Using custom image array
            </p>
          </div>
          <HoverExpand_001 images={customImages} />
        </section>
      </main>
    </div>
  )
}
