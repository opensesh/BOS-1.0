/**
 * Example page demonstrating the Expand on Hover components
 *
 * This is a reference implementation - you can copy sections into your own pages
 */

import { HoverExpand_001, Skiper52 } from '@/components/ui/expand-on-hover'
import HoverExpandDefault from '@/components/ui/expand-on-hover-demo'

export default function GalleryExample() {
  // Custom images example - replace with your own images
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
  ]

  return (
    <main className="min-h-screen bg-brand-charcoal">
      {/* Hero Section */}
      <section className="container-responsive py-20">
        <h1 className="text-d1-mobile md:text-d1-tablet xl:text-d1-desktop font-display text-brand-vanilla mb-4">
          Gallery Components
        </h1>
        <p className="text-b1 text-brand-vanilla/70 max-w-2xl">
          Interactive hover-expand galleries with smooth animations
        </p>
      </section>

      {/* Example 1: Pre-built Horizontal Gallery */}
      <section className="py-20 bg-brand-vanilla">
        <div className="container-responsive mb-12">
          <h2 className="text-h2-mobile md:text-h2-tablet font-display text-brand-charcoal mb-4">
            Horizontal Gallery
          </h2>
          <p className="text-b2 text-brand-charcoal/70">
            Hover over images to expand them horizontally
          </p>
        </div>
        <Skiper52 />
      </section>

      {/* Example 2: Vertical Gallery */}
      <section className="py-20">
        <div className="container-responsive mb-12">
          <h2 className="text-h2-mobile md:text-h2-tablet font-display text-brand-vanilla mb-4">
            Vertical Gallery
          </h2>
          <p className="text-b2 text-brand-vanilla/70">
            Hover over rows to expand them vertically
          </p>
        </div>
        <HoverExpandDefault />
      </section>

      {/* Example 3: Custom Images */}
      <section className="py-20 bg-brand-vanilla">
        <div className="container-responsive mb-12">
          <h2 className="text-h2-mobile md:text-h2-tablet font-display text-brand-charcoal mb-4">
            Custom Images
          </h2>
          <p className="text-b2 text-brand-charcoal/70">
            Use your own images with custom data
          </p>
        </div>
        <HoverExpand_001 images={customImages} />
      </section>

      {/* Usage Guide */}
      <section className="py-20">
        <div className="container-responsive">
          <h2 className="text-h2-mobile md:text-h2-tablet font-display text-brand-vanilla mb-8">
            How to Use
          </h2>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="bg-brand-charcoal border border-brand-vanilla/20 rounded-3xl p-6">
              <h3 className="text-h4-mobile font-display text-brand-vanilla mb-4">
                Import Components
              </h3>
              <pre className="text-caption font-mono text-brand-vanilla/70 overflow-x-auto">
{`import { HoverExpand_001, Skiper52 }
from '@/components/ui/expand-on-hover'

import HoverExpandDefault
from '@/components/ui/expand-on-hover-demo'`}
              </pre>
            </div>

            <div className="bg-brand-charcoal border border-brand-vanilla/20 rounded-3xl p-6">
              <h3 className="text-h4-mobile font-display text-brand-vanilla mb-4">
                Use in Your Page
              </h3>
              <pre className="text-caption font-mono text-brand-vanilla/70 overflow-x-auto">
{`<HoverExpand_001
  images={myImages}
  className="custom-class"
/>`}
              </pre>
            </div>
          </div>

          <div className="mt-8 bg-brand-aperol/10 border border-brand-aperol/30 rounded-3xl p-6">
            <h3 className="text-h4-mobile font-display text-brand-aperol mb-4">
              📚 Full Documentation
            </h3>
            <p className="text-b2 text-brand-vanilla/70">
              See <code className="font-mono text-brand-aperol">EXPAND_ON_HOVER_INTEGRATION.md</code> for complete usage examples,
              customization options, and integration tips.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
