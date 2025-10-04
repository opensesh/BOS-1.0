import { useState } from 'react'
import { ExternalLink } from 'lucide-react'

// Social icon components using SVGs from public folder
const OpenSessionIcon = () => (
  <div className="overflow-clip relative shrink-0 size-[16px]">
    <img alt="" className="block max-w-none size-full" src="/Link Icons/Linkree_website_thumbnails.svg" />
  </div>
)

const SubstackIcon = () => (
  <div className="overflow-clip relative shrink-0 size-[16px]">
    <img alt="" className="block max-w-none size-full" src="/Link Icons/Linkree_substack_thumbnails.svg" />
  </div>
)

const MediumIcon = () => (
  <div className="overflow-clip relative shrink-0 size-[16px]">
    <img alt="" className="block max-w-none size-full" src="/Link Icons/Linkree_medium_thumbnails.svg" />
  </div>
)

const YouTubeIcon = () => (
  <div className="overflow-clip relative shrink-0 size-[16px]">
    <img alt="" className="block max-w-none size-full" src="/Link Icons/Linkree_youtube_thumbnails.svg" />
  </div>
)

const FigmaIcon = () => (
  <div className="overflow-clip relative shrink-0 size-[16px]">
    <img alt="" className="block max-w-none size-full" src="/Link Icons/Linkree_figma_thumbnails.svg" />
  </div>
)

const InstagramIcon = () => (
  <div className="overflow-clip relative shrink-0 size-[16px]">
    <img alt="" className="block max-w-none size-full" src="/Link Icons/Linkree_instagram_thumbnails.svg" />
  </div>
)

const LinkedInIcon = () => (
  <div className="overflow-clip relative shrink-0 size-[18px]">
    <img alt="" className="block max-w-none size-full" src="/Link Icons/Linkree_linkedin_thumbnails.svg" />
  </div>
)

export default function MainResources() {
  const [leftOpen, setLeftOpen] = useState(true) // Start with Key Resources open
  const [rightOpen, setRightOpen] = useState(false) // Start with Download Assets closed

  return (
    <section className="w-full max-w-[1184px] mx-auto px-6 md:px-12">
      {/* Main Resources Heading */}
      <h2 className="font-display text-h1-mobile md:text-h1-tablet xl:text-h1-desktop text-brand-vanilla mb-6">
        Main Resources
      </h2>

      {/* Two Accordions Side by Side */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Accordion: Key Resources */}
        <div className={`transition-all duration-300 rounded-lg border border-brand-vanilla shadow-lg overflow-hidden ${
          leftOpen ? 'flex-1 min-w-0' : 'flex-initial w-auto'
        }`}>
          <button
            onClick={() => setLeftOpen(!leftOpen)}
            className="w-full bg-brand-charcoal border-b border-[#595959] px-6 py-4 flex items-center justify-between gap-3 hover:bg-brand-charcoal/90 transition-colors"
            type="button"
          >
            <span className="font-text text-label text-brand-vanilla uppercase">Key Resources</span>
            <svg
              className={`w-4 h-2 text-brand-vanilla transition-transform duration-300 ${leftOpen ? 'rotate-180' : ''}`}
              viewBox="0 0 14 8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M1 1l6 6 6-6" />
            </svg>
          </button>

          {leftOpen && (
            <div className="bg-brand-charcoal px-6 py-8 space-y-8">
              {/* Figma File */}
              <div className="space-y-4">
                <h3 className="font-accent text-h5-mobile text-brand-vanilla">Figma File</h3>
                <p className="font-text text-b2 text-brand-vanilla">
                  Brand OS Comprehensive and expanding design system with all resources
                </p>
                <a
                  href="https://www.figma.com/design/t6ibLjzJFXY6HzU0bIahxw/BRAND-OS?node-id=11107-68411&t=w51tqPrTUlDRqfak-1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-brand-vanilla text-brand-charcoal rounded-full px-4 py-3 font-text text-button flex items-center justify-center gap-2 hover:bg-brand-aperol hover:text-brand-vanilla transition-colors"
                >
                  More Info
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 8h10m0 0l-4-4m4 4l-4 4" />
                  </svg>
                </a>
              </div>

              {/* Brand Guidelines */}
              <div className="space-y-4">
                <h3 className="font-accent text-h5-mobile text-brand-vanilla">Brand Guidelines</h3>
                <p className="font-text text-b2 text-brand-vanilla">
                  Detailed visuals and instruction on how to use the brand across all mediumd
                </p>
                <a
                  href="https://www.figma.com/proto/t6ibLjzJFXY6HzU0bIahxw/BRAND-OS?page-id=19939%3A21956&node-id=20255-18337&viewport=465%2C-92%2C0.05&t=Fjx1co9Q53DPCGLw-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=20255%3A18337"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-brand-vanilla text-brand-charcoal rounded-full px-4 py-3 font-text text-button flex items-center justify-center gap-2 hover:bg-brand-aperol hover:text-brand-vanilla transition-colors"
                >
                  Full Slides
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 8h10m0 0l-4-4m4 4l-4 4" />
                  </svg>
                </a>
              </div>

              {/* Contact */}
              <div className="space-y-4">
                <h3 className="font-accent text-h5-mobile text-brand-vanilla">Contact</h3>
                <p className="font-text text-b2 text-brand-vanilla">
                  Can't find what you're after or need to talk to some about specifics.
                </p>
                <a
                  href="https://opensession.co/contact"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full border border-brand-vanilla text-brand-vanilla rounded-full px-4 py-3 font-text text-button flex items-center justify-center gap-2 hover:bg-brand-vanilla hover:text-brand-charcoal transition-colors"
                >
                  Get in Touch
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Right Accordion: Download Assets */}
        <div className={`transition-all duration-300 rounded-lg border border-brand-vanilla shadow-lg overflow-hidden ${
          rightOpen ? 'flex-1 min-w-0' : 'flex-initial w-auto'
        }`}>
          <button
            onClick={() => setRightOpen(!rightOpen)}
            className="w-full bg-brand-charcoal border-b border-[#595959] px-6 py-4 flex items-center justify-between gap-3 hover:bg-brand-charcoal/90 transition-colors"
            type="button"
          >
            <span className="font-text text-label text-brand-vanilla uppercase">Download Assets</span>
            <svg
              className={`w-4 h-2 text-brand-vanilla transition-transform duration-300 ${rightOpen ? 'rotate-180' : ''}`}
              viewBox="0 0 14 8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M1 1l6 6 6-6" />
            </svg>
          </button>

          {rightOpen && (
            <div className="bg-brand-charcoal px-6 py-8 space-y-8">
              {/* Download Links */}
              <div className="space-y-6">
                {[
                  'Icons',
                  'Logo Kit',
                  'Font Files',
                  'Illustrations',
                  'Colour Swatches',
                  'Creative Assets',
                ].map((item) => (
                  <div key={item} className="flex items-end gap-2 border-b border-[#787878] pb-1">
                    <h3 className="font-accent text-h5-mobile text-brand-vanilla flex-1">{item}</h3>
                    <button className="flex items-center gap-2 py-1 text-brand-vanilla font-text text-button hover:text-brand-aperol transition-colors">
                      Download
                      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M8 2v8m0 0l3-3m-3 3L5 7m-3 7h12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className="space-y-3">
                <p className="font-text text-caption text-brand-vanilla">Social Links</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { Icon: OpenSessionIcon, label: 'Website', url: 'https://opensession.co/' },
                    { Icon: SubstackIcon, label: 'Newsletter', url: 'https://open-session.link/substack-website' },
                    { Icon: MediumIcon, label: 'Medium', url: 'https://open-session.link/medium-website' },
                    { Icon: YouTubeIcon, label: 'YouTube', url: 'https://open-session.link/youtube-website' },
                    { Icon: FigmaIcon, label: 'Figma', url: 'https://open-session.link/figma-website' },
                    { Icon: InstagramIcon, label: 'Instagram', url: 'https://open-session.link/instagram-website' },
                    { Icon: LinkedInIcon, label: 'LinkedIn', url: 'https://open-session.link/linkedin-website' },
                  ].map(({ Icon, label, url }) => (
                    <a
                      key={label}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative w-10 h-10 rounded-full border border-brand-vanilla bg-brand-charcoal flex items-center justify-center hover:bg-brand-aperol hover:border-brand-aperol transition-colors"
                      aria-label={label}
                    >
                      <Icon />
                      <span className="absolute bottom-full mb-2 px-2 py-1 bg-brand-charcoal border border-brand-vanilla rounded text-brand-vanilla font-text text-caption whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        {label}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}