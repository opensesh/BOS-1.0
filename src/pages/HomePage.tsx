import { Suspense, lazy, useMemo } from 'react'

const Hero = lazy(() => import('@components/sections/Hero'))
const MainResources = lazy(() => import('@components/sections/MainResources'))

export default function HomePage() {
  const fallback = useMemo(
    () => <div className="container-responsive py-12 text-sm opacity-70">Loading…</div>,
    [],
  )

  return (
    <main>
      <div className="stagger-item stagger-2">
        <Suspense fallback={fallback}>
          <Hero />
        </Suspense>
      </div>
      <div className="stagger-item stagger-3 pt-32 pb-32">
        <Suspense fallback={fallback}>
          <MainResources />
        </Suspense>
      </div>
    </main>
  )
}
