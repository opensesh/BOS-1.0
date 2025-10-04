import { RefObject, useEffect, useRef, useState } from 'react'

type Options = Omit<IntersectionObserverInit, 'root'> & {
  once?: boolean
}

export function useIntersectionObserver<T extends Element>(
  targetRef: RefObject<T>,
  { threshold = 0.2, rootMargin = '0px', once = true }: Options = {},
) {
  const [isIntersecting, setIntersecting] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const node = targetRef.current
    if (!node) return

    observerRef.current?.disconnect()
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return
        if (entry.isIntersecting) {
          setIntersecting(true)
          if (once) observerRef.current?.disconnect()
        } else if (!once) {
          setIntersecting(false)
        }
      },
      { threshold, rootMargin },
    )
    observerRef.current.observe(node)
    return () => observerRef.current?.disconnect()
  }, [targetRef, threshold, rootMargin, once])

  return isIntersecting
}

export default useIntersectionObserver


