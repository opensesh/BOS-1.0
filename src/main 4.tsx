import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './styles/fonts.css'
import './styles/tokens.css'
import './styles/globals.css'
import App from './App.tsx'
import AppTest from './AppTest.tsx'

const Preview = lazy(() => import('./preview/Preview'))
const HomePage = lazy(() => import('@pages/HomePage'))
const CorePage = lazy(() => import('@pages/CorePage'))
const IdentityPage = lazy(() => import('@pages/IdentityPage'))
const SystemPage = lazy(() => import('@pages/SystemPage'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'core', element: <CorePage /> },
      { path: 'identity', element: <IdentityPage /> },
      { path: 'system', element: <SystemPage /> },
    ],
  },
  { path: '/test', element: <AppTest /> },
  { path: '/preview', element: <Suspense fallback={<div className="p-6">Loading…</div>}><Preview /></Suspense> },
], {
  basename: import.meta.env.BASE_URL,
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
