import React, { Suspense, useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'

type TLazyLoadBlockProps = {
  Component: React.LazyExoticComponent<React.FC>
  minHeight?: number
  fallback?: React.ReactNode
}

const LazyLoadBlock = ({
  Component,
  minHeight = 200,
  fallback
}: TLazyLoadBlockProps) => {
  const { ref, inView } = useInView({ triggerOnce: true })
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (inView) setShouldRender(true)
  }, [inView])

  return (
    <div ref={ref} style={{ minHeight }}>
      {shouldRender ? (
        <Suspense
          fallback={
            <div style={{ minHeight }}>{fallback ?? 'Đang tải...'}</div>
          }
        >
          <Component />
        </Suspense>
      ) : null}
    </div>
  )
}

export default LazyLoadBlock
