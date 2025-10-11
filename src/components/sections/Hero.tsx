import FaultyTerminal from "@components/ui/faulty-terminal"
import { Typewriter } from "@components/ui/typewriter"
import { ShaderAnimation } from "@components/ui/shader-animation"

export default function Hero() {
  const handleScrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const header = document.querySelector('header')
      const headerHeight = header ? header.offsetHeight : 60
      const elementTop = element.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementTop - headerHeight - 20

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }
  return (
    <section
      id="hero"
      className="relative w-full h-dvh overflow-hidden bg-brand-charcoal"
    >
      {/* FaultyTerminal Effect - Layer 0 (behind everything) */}
      <div
        className="absolute inset-0 w-full h-full opacity-20"
        style={{ zIndex: 0 }}
      >
        <FaultyTerminal
          scale={1}
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
          tint="#FE5102"
          mouseReact={false}
          pageLoadAnimation={true}
          brightness={1}
        />
      </div>

      {/* Shader Animation - Layer 2 (above terminal, below gradient) */}
      <div
        className="absolute inset-0 w-full h-full opacity-30"
        style={{ zIndex: 2 }}
      >
        <ShaderAnimation />
      </div>

      {/* Centered Content Container - Visually centered accounting for header and mobile bottom nav */}
      <div
        className="absolute inset-0 flex items-center justify-center px-6 md:px-8"
        style={{ zIndex: 10 }}
      >
        <div className="w-full max-w-7xl text-center -translate-y-[10px] md:-translate-y-[30px]">
          {/* Title */}
          <h1
            className="animate-fade-in text-balance text-center
            text-brand-vanilla font-display text-d1-mobile md:text-d1-tablet xl:text-d1-desktop
            leading-none tracking-tighter mb-6"
            style={{ animationDelay: '0.2s', opacity: 0 }}
          >
            Brand OS
          </h1>

          {/* Subtitle with Typewriter */}
          <div
            className="animate-fade-in text-center
            text-2xl tracking-tight font-accent
            md:text-3xl mb-12"
            style={{ animationDelay: '0.4s', opacity: 0 }}
          >
            <p className="text-brand-vanilla">
              <span>Made to help you </span>
              <Typewriter
                text={[
                  "create",
                  "design",
                  "build",
                  "render",
                  "code",
                  "experiment",
                  "make",
                ]}
                speed={70}
                className="text-brand-aperol font-accent"
                waitTime={1500}
                deleteSpeed={40}
                cursorChar="_"
              />
            </p>
          </div>

          {/* Navigation Buttons */}
          <div
            className="animate-fade-in flex flex-wrap gap-4 justify-center"
            style={{ animationDelay: '0.6s', opacity: 0 }}
          >
            <button
              onClick={() => handleScrollToSection('core')}
              className="bg-brand-vanilla hover:bg-brand-aperol text-brand-charcoal hover:text-brand-vanilla transition-colors px-6 py-3 rounded-full font-text text-button min-w-[128px]"
            >
              Core
            </button>
            <button
              onClick={() => handleScrollToSection('identity')}
              className="bg-brand-vanilla hover:bg-brand-aperol text-brand-charcoal hover:text-brand-vanilla transition-colors px-6 py-3 rounded-full font-text text-button min-w-[128px]"
            >
              Identity
            </button>
            <button
              onClick={() => handleScrollToSection('system')}
              className="bg-brand-vanilla hover:bg-brand-aperol text-brand-charcoal hover:text-brand-vanilla transition-colors px-6 py-3 rounded-full font-text text-button min-w-[128px]"
            >
              System
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Blend */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1/2 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, #191919 0%, transparent 100%)',
          zIndex: 5
        }}
      />
    </section>
  )
}