import { useRef } from 'react'
import SectionDropdown from '@components/common/SectionDropdown'
import DualHeadingText from '@components/core/DualHeadingText'
import TextDropdown from '@components/core/TextDropdown'
import TextColumns from '@components/core/TextColumns'
import useIntersectionObserver from '@hooks/useIntersectionObserver'

type Props = { defaultOpen?: boolean; lazyLoad?: boolean }

export default function CoreSection({ defaultOpen = true, lazyLoad = false }: Props) {
  const ref = useRef<HTMLDivElement | null>(null)
  const inView = useIntersectionObserver(ref as React.RefObject<Element>, { threshold: 0.2 })

  const shouldLoad = !lazyLoad || inView

  // Mission content
  const missionContent = {
    title: "Mission",
    heading: "Help the world make the most of technology",
    body: "We envision a world where anyone can access the level of design once reserved for tech giants. A future where bold branding, creative AI, and great content fuel growth and connection. We want to wake up knowing our work helps people create."
  }

  // Values content with illustrations - 5 items (using actual design system assets)
  const valuesItems = [
    {
      id: 'curiosity',
      title: 'Curiousity',
      description: 'We believe curiosity is essential to staying on the cutting edge of design and innovation.',
      illustration: '/illustrations/curiosity.svg'
    },
    {
      id: 'solutions',
      title: 'Solutions',
      description: 'Every initiative we undertake—whether for clients or our community—is driven by problem-solving and impactful outcomes.',
      illustration: '/illustrations/solutions.svg'
    },
    {
      id: 'respect',
      title: 'Respect',
      description: 'We treat everyone with respect and wield technology responsibly, understanding its potential and its limits.',
      illustration: '/illustrations/respect.svg'
    },
    {
      id: 'connection',
      title: 'Connection',
      description: 'We nurture relationships within our community and brand ecosystems through meaningful engagement and collaborative design systems.',
      illustration: '/illustrations/connection.svg'
    },
    {
      id: 'transparency',
      title: 'Transparency',
      description: 'Celebrate who we are, how we got here, and how we help clients and community grow',
      illustration: '/illustrations/transparency.svg'
    }
  ]

  // Pillars content (no illustrations)
  const pillarsItems = [
    {
      id: 'trusted-advisors',
      title: 'Trusted Advisors',
      description: 'We build lasting relationships through expertise, reliability, and consistent delivery of exceptional results.'
    },
    {
      id: 'transparent-truth',
      title: 'Transparent Truth',
      description: 'Open, honest communication forms the foundation of our relationships with clients and community.'
    },
    {
      id: 'realistic-visionaries',
      title: 'Realistic Visionaries',
      description: 'We balance ambitious thinking with practical execution, turning bold ideas into achievable outcomes.'
    },
    {
      id: 'community-catalysts',
      title: 'Community Catalysts',
      description: 'We actively foster connections, collaboration, and growth within our creative community.'
    },
    {
      id: 'friendly-creatives',
      title: 'Friendly Creatives',
      description: 'Approachable expertise and creative excellence delivered with warmth and genuine care.'
    }
  ]

  // Voice columns
  const voiceColumns = [
    {
      id: 'expert-educational',
      title: 'Expert & Educational',
      description: 'Communicate as if you\'re having a friendly conversation over coffee. Use natural language and relatable examples that connect with everyday experiences. Be transparent about challenges and lessons learned. Your voice should feel warm and welcoming, making even complex topics approachable.'
    },
    {
      id: 'inspirational-visionary',
      title: 'Inspirational & Visionary',
      description: 'Communicate as if you\'re having a friendly conversation over coffee. Use natural language and relatable examples that connect with everyday experiences. Be transparent about challenges and lessons learned. Your voice should feel warm and welcoming, making even complex topics approachable.'
    },
    {
      id: 'conversational-accessible',
      title: 'Conversational & Accessible',
      description: 'Communicate as if you\'re having a friendly conversation over coffee. Use natural language and relatable examples that connect with everyday experiences. Be transparent about challenges and lessons learned. Your voice should feel warm and welcoming, making even complex topics approachable.'
    }
  ]

  return (
    <div ref={ref} className="w-full max-w-[1184px] mx-auto px-6 md:px-12 py-12">
      <SectionDropdown
        title="Core"
        number="01"
        defaultOpen={defaultOpen}
        iconType="chevron"
      >
        {shouldLoad ? (
          <div className="flex flex-col gap-16">
            {/* Mission - Dual Heading Text */}
            <div id="mission">
              <DualHeadingText
                title={missionContent.title}
                heading={missionContent.heading}
                body={missionContent.body}
              />
            </div>

            {/* Values - Text Dropdown with Illustrations */}
            <div id="values">
              <TextDropdown
                title="Values"
                items={valuesItems}
                hasIllustrations={true}
              />
            </div>

            {/* Voice - Text Columns */}
            <div id="voice">
              <TextColumns
                heading="Voice"
                columns={voiceColumns}
              />
            </div>

            {/* Pillars - Text Dropdown without Illustrations */}
            <div id="pillars">
              <TextDropdown
                title="Pillars"
                items={pillarsItems}
                hasIllustrations={false}
              />
            </div>
          </div>
        ) : (
          <div className="text-brand-vanilla/50 font-text text-sm">
            Content loading...
          </div>
        )}
      </SectionDropdown>
    </div>
  )
}