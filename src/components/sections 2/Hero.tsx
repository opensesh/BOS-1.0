import { ChevronRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Button from "@components/common/Button"
import FaultyTerminal from "@components/ui/faulty-terminal"
import { Typewriter } from "@components/ui/typewriter"

export default function Hero() {
  const navigate = useNavigate()
  return (
    <section
      id="hero"
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
          tint="#FE5102"
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
          Brand OS
        </h1>

        {/* Subtitle with Typewriter */}
        <div
          className="animate-fade-in text-center
          text-2xl tracking-tight font-accent
          md:text-3xl"
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
          className="animate-fade-in flex flex-wrap gap-4 justify-center mt-12"
          style={{ animationDelay: '0.6s', opacity: 0 }}
        >
          <button
            onClick={() => navigate('/core')}
            className="bg-brand-vanilla hover:bg-brand-aperol text-brand-charcoal hover:text-brand-vanilla transition-colors px-6 py-3 rounded-full font-text text-button min-w-[128px]"
          >
            Core
          </button>
          <button
            onClick={() => navigate('/identity')}
            className="bg-brand-vanilla hover:bg-brand-aperol text-brand-charcoal hover:text-brand-vanilla transition-colors px-6 py-3 rounded-full font-text text-button min-w-[128px]"
          >
            Identity
          </button>
          <button
            onClick={() => navigate('/system')}
            className="bg-brand-vanilla hover:bg-brand-aperol text-brand-charcoal hover:text-brand-vanilla transition-colors px-6 py-3 rounded-full font-text text-button min-w-[128px]"
          >
            System
          </button>
        </div>
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