import { useState, useRef, useImperativeHandle, forwardRef } from 'react'
import { RotateCcw } from 'lucide-react'
import LogoFrame from './LogoFrame'

export type LogoFrameHandle = {
  resetColor: () => void
}

export default function LogoBlock() {
  // Refs for each logo frame to call reset
  const brandmarkRef = useRef<LogoFrameHandle>(null)
  const comboRef = useRef<LogoFrameHandle>(null)
  const stackedRef = useRef<LogoFrameHandle>(null)
  const horizontalRef = useRef<LogoFrameHandle>(null)
  const coreRef = useRef<LogoFrameHandle>(null)
  const outlineRef = useRef<LogoFrameHandle>(null)
  const filledRef = useRef<LogoFrameHandle>(null)

  const handleMainReset = () => {
    brandmarkRef.current?.resetColor()
    comboRef.current?.resetColor()
    stackedRef.current?.resetColor()
    horizontalRef.current?.resetColor()
  }

  const handleMonogramReset = () => {
    coreRef.current?.resetColor()
    outlineRef.current?.resetColor()
    filledRef.current?.resetColor()
  }

  return (
    <div className="flex flex-col gap-12 p-12">
      {/* Section Title */}
      <div className="flex flex-col gap-8">
        <h2 className="font-display text-d2-mobile md:text-d2-tablet tracking-[-2px] text-brand-vanilla">
          Logo
        </h2>
      </div>

      {/* Main Section */}
      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between w-full">
          <h3 className="font-display text-h4-mobile tracking-[-0.25px] text-brand-vanilla">
            Main
          </h3>
          <button
            onClick={handleMainReset}
            className="flex items-center gap-2 px-4 py-3 rounded-full border border-brand-vanilla transition-opacity hover:opacity-80"
          >
            <span className="font-text text-button text-brand-vanilla leading-[1.25]">Reset</span>
            <RotateCcw className="w-4 h-4 text-brand-vanilla" />
          </button>
        </div>

        <div className="flex flex-wrap gap-6">
          <LogoFrame
            ref={brandmarkRef}
            title="Brandmark"
            logoType="brandmark"
            logoAlt="Brandmark logo"
          />
          <LogoFrame
            ref={comboRef}
            title="Combo"
            logoType="combo"
            logoAlt="Combo logo"
          />
          <LogoFrame
            ref={stackedRef}
            title="Stacked"
            logoType="stacked"
            logoAlt="Stacked logo"
          />
          <LogoFrame
            ref={horizontalRef}
            title="Horizontal"
            logoType="horizontal"
            logoAlt="Horizontal logo"
          />
        </div>
      </div>

      {/* Accessory Section */}
      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between w-full">
          <h3 className="font-display text-h4-mobile tracking-[-0.25px] text-brand-vanilla">
            Accessory
          </h3>
          <button
            onClick={handleMonogramReset}
            className="flex items-center gap-2 px-4 py-3 rounded-full border border-brand-vanilla transition-opacity hover:opacity-80"
          >
            <span className="font-text text-button text-brand-vanilla leading-[1.25]">Reset</span>
            <RotateCcw className="w-4 h-4 text-brand-vanilla" />
          </button>
        </div>

        <div className="flex flex-wrap gap-6">
          <LogoFrame
            ref={coreRef}
            title="Core"
            logoType="core"
            logoAlt="Core monogram"
          />
          <LogoFrame
            ref={outlineRef}
            title="Outline"
            logoType="outline"
            logoAlt="Outline monogram"
          />
          <LogoFrame
            ref={filledRef}
            title="Filled"
            logoType="filled"
            logoAlt="Filled monogram"
          />
        </div>
      </div>
    </div>
  )
}
