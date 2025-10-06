import { useState, useEffect } from 'react'
import { DitheringShader } from './dithering-shader'

interface LoadingScreenProps {
  onComplete?: () => void
  minDuration?: number
}

export function LoadingScreen({ onComplete, minDuration = 2000 }: LoadingScreenProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateDimensions = () => {
      const size = Math.max(window.innerWidth, window.innerHeight)
      setDimensions({ width: size, height: size })
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)

    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => {
        onComplete?.()
      }, 600) // Wait for fade out animation
    }, minDuration)

    return () => clearTimeout(timer)
  }, [minDuration, onComplete])

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-brand-charcoal transition-opacity duration-600 overflow-hidden ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <DitheringShader
          shape="ripple"
          type="2x2"
          colorBack="#191919"
          colorFront="#FE5102"
          pxSize={2}
          speed={1.2}
          width={dimensions.width}
          height={dimensions.height}
          style={{
            width: `${dimensions.width}px`,
            height: `${dimensions.height}px`,
            minWidth: '100vw',
            minHeight: '100vh'
          }}
        />
      </div>
      <span className="pointer-events-none z-10 text-center font-accent absolute text-brand-vanilla tracking-normal" style={{ fontSize: '40px', lineHeight: '1.25' }}>
        LOADING
      </span>
    </div>
  )
}
