import FaultyTerminal from "@components/ui/faulty-terminal"

interface PageHeroProps {
  title: string
  description: string
}

export default function PageHero({ title, description }: PageHeroProps) {
  return (
    <section
      className="relative mx-auto w-full pt-32 pb-20 px-6 text-center md:px-8
      h-[690px] overflow-hidden
      bg-[linear-gradient(to_bottom,#FFFAEE,#FFFAEE_50%,#e8e8e8_88%)]
      dark:bg-[linear-gradient(to_bottom,#191919,#191919_50%,#0a0a0a_88%)]
      rounded-b-xl flex flex-col items-center justify-center"
    >
      {/* FaultyTerminal Effect - Layer 0 (behind everything) */}
      <div
        className="absolute inset-0 w-full h-full opacity-20"
        style={{ zIndex: 0 }}
      >
        <FaultyTerminal
          scale={1.2}
          gridMul={[1, 1]}
          digitSize={1.5}
          timeScale={0.5}
          scanlineIntensity={0.5}
          glitchAmount={0.8}
          flickerAmount={0.6}
          noiseAmp={1}
          chromaticAberration={0}
          dither={0}
          curvature={0}
          tint="#FFFAEE"
          mouseReact={false}
          pageLoadAnimation={true}
          brightness={1}
        />
      </div>

      {/* Centered Content */}
      <div className="relative w-full max-w-7xl mx-auto px-4" style={{ zIndex: 10 }}>
        {/* Title */}
        <h1
          className="animate-fade-in text-balance text-center
          text-brand-vanilla py-6 font-display text-d1-mobile md:text-d1-tablet xl:text-d1-desktop
          leading-none tracking-tighter"
          style={{ animationDelay: '0.2s', opacity: 0 }}
        >
          {title}
        </h1>

        {/* Description */}
        <p
          className="animate-fade-in text-center
          text-brand-vanilla font-text text-h5-mobile md:text-h5-tablet xl:text-h5-desktop
          max-w-3xl mx-auto"
          style={{ animationDelay: '0.4s', opacity: 0 }}
        >
          {description}
        </p>
      </div>

      {/* Bottom Fade */}
      <div
        className="animate-fade-up-no-translate relative mt-32 opacity-0 [perspective:2000px]
        after:absolute after:inset-0 after:z-50
        after:[background:linear-gradient(to_top,#191919_10%,transparent)]"
      />
    </section>
  )
}
