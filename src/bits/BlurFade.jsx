/**
 * Blur Fade — React Bits
 * Items fade and unblur in with a stagger delay
 */
import { useState, useEffect, useRef } from 'react'

export default function BlurFade({ children, delay = 0, duration = 0.4, blur = 6 }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay * 1000)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        filter: visible ? 'blur(0px)' : `blur(${blur}px)`,
        transform: visible ? 'translateY(0)' : 'translateY(8px)',
        transition: `opacity ${duration}s ease, filter ${duration}s ease, transform ${duration}s ease`,
        willChange: 'opacity, filter, transform',
      }}
    >
      {children}
    </div>
  )
}
