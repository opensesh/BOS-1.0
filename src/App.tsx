import { Suspense, lazy, useMemo, useEffect, useState } from 'react'
import { LoadingScreen } from '@components/ui/LoadingScreen'

const Header = lazy(() => import('@components/layout/Header'))
const Hero = lazy(() => import('@components/sections/Hero'))
const IdeaGeneration = lazy(() => import('@components/sections/IdeaGeneration'))
const MainResources = lazy(() => import('@components/sections/MainResources'))
const CoreSection = lazy(() => import('@components/sections/CoreSection'))
const IdentitySection = lazy(() => import('@components/sections/IdentitySection'))
const SystemSection = lazy(() => import('@components/sections/SystemSection'))
const Footer = lazy(() => import('@components/layout/Footer'))

export default function App() {
  const [isLoading, setIsLoading] = useState(true)

  // Clear hash on initial load if needed
  useEffect(() => {
    if (window.location.hash && window.location.pathname === '/') {
      // Preserve scroll position but clean URL
      const scrollToId = window.location.hash.slice(1)
      window.history.replaceState(null, '', window.location.pathname)

      // Optional: scroll to the section if it exists
      if (scrollToId) {
        setTimeout(() => {
          const element = document.getElementById(scrollToId)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
          }
        }, 100)
      }
    }
  }, [])

  const fallback = useMemo(
    () => <div className="container-responsive py-12 text-sm opacity-70">Loading…</div>,
    [],
  )

  return (
    <>
      <LoadingScreen
        onComplete={() => setIsLoading(false)}
        minDuration={2000}
      />
      <div className={`min-h-screen bg-brand-charcoal text-brand-vanilla ${isLoading ? 'opacity-0' : ''}`}>
        <Suspense fallback={fallback}>
          <Header />
        </Suspense>
        <main className={isLoading ? '' : 'stagger-item stagger-1'}>
          <div className={isLoading ? '' : 'stagger-item stagger-2'}>
            <Suspense fallback={fallback}>
              <Hero />
            </Suspense>
          </div>
          <div className={isLoading ? '' : 'stagger-item stagger-3'}>
            <Suspense fallback={fallback}>
              <IdeaGeneration defaultOpen={false} />
            </Suspense>
          </div>
          <div className={isLoading ? '' : 'stagger-item stagger-4'}>
            <Suspense fallback={fallback}>
              <MainResources />
            </Suspense>
          </div>
          <section id="core" className={isLoading ? '' : 'stagger-item stagger-5'}>
            <Suspense fallback={fallback}>
              <CoreSection defaultOpen />
            </Suspense>
          </section>
          <section id="identity" className={isLoading ? '' : 'stagger-item stagger-6'}>
            <Suspense fallback={fallback}>
              <IdentitySection defaultOpen={false} lazyLoad />
            </Suspense>
          </section>
          <section id="system" className={isLoading ? '' : 'stagger-item stagger-7'}>
            <Suspense fallback={fallback}>
              <SystemSection defaultOpen={false} lazyLoad />
            </Suspense>
          </section>
        </main>
        <Suspense fallback={fallback}>
          <Footer />
        </Suspense>
      </div>
    </>
  )
}