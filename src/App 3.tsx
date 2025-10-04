import { Suspense, lazy, useMemo, useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { LoadingScreen } from '@components/ui/LoadingScreen'

const Header = lazy(() => import('@components/layout/Header'))
const Footer = lazy(() => import('@components/layout/Footer'))

export default function App() {
  const [isLoading, setIsLoading] = useState(true)
  const location = useLocation()

  const fallback = useMemo(
    () => <div className="container-responsive py-12 text-sm opacity-70">Loading…</div>,
    [],
  )

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

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
        <div className={isLoading ? '' : 'stagger-item stagger-1'}>
          <Suspense fallback={fallback}>
            <Outlet />
          </Suspense>
        </div>
        <Suspense fallback={fallback}>
          <Footer />
        </Suspense>
      </div>
    </>
  )
}