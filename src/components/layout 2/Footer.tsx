import { ArrowUp } from 'lucide-react'

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

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-[#1e1e1e] w-full">
      <div className="max-w-[1327px] mx-auto px-6 py-20 flex flex-wrap gap-[60px] items-end justify-between">
        {/* Left Section: Logo and Tagline */}
        <div className="flex-1 min-w-[260px] flex flex-col items-start pr-12">
          {/* Logo - Using single combo SVG to preserve aspect ratio */}
          <div className="mb-3 pl-3">
            <img
              src="/logos/logo_main_combo_vanilla.svg"
              alt="Open Session"
              className="h-[50px] w-auto"
            />
          </div>

          {/* Tagline and Copyright */}
          <div className="flex flex-wrap gap-[19px] items-center px-3">
            <p className="font-accent text-[20px] text-brand-vanilla leading-[1.5]">
              Brand, Design, Create
            </p>
            <p className="font-text text-caption text-brand-vanilla">
              San Diego, CA © 2025
            </p>
          </div>
        </div>

        {/* Right Section: Back to Top and Social Links */}
        <div className="flex-1 min-w-[200px] max-w-[360px] flex flex-col gap-6 px-3">
          {/* Back to Top Button */}
          <button
            onClick={scrollToTop}
            className="w-full bg-brand-charcoal border border-[#787878] rounded-lg px-3 py-3 flex items-center justify-center gap-3 hover:border-brand-vanilla transition-colors"
          >
            <ArrowUp className="w-[18px] h-[18px] text-brand-vanilla" />
            <span className="font-text text-button text-brand-vanilla">Back to top</span>
          </button>

          {/* Social Links */}
          <div className="flex flex-col gap-3">
            <p className="font-accent text-[18px] text-brand-vanilla leading-[1.5]">Social Links</p>
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
      </div>
    </footer>
  )
}


