/**
 * Cursor Trail — React Bits
 * Glowing dot that follows the cursor with a trail
 */
import { useEffect, useRef } from 'react'

export default function CursorTrail() {
  const trailRef = useRef([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    // Only on desktop — skip on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return

    const TRAIL_LENGTH = 12
    const dots = []

    // Create trail dots
    for (let i = 0; i < TRAIL_LENGTH; i++) {
      const dot = document.createElement('div')
      const size = Math.max(4, 14 - i * 0.9)
      const opacity = 1 - i / TRAIL_LENGTH
      dot.style.cssText = `
        position: fixed;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(129,140,248,${opacity}) 0%, rgba(139,92,246,${opacity * 0.5}) 100%);
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        transition: opacity 0.1s;
        mix-blend-mode: screen;
      `
      document.body.appendChild(dot)
      dots.push({ el: dot, x: 0, y: 0 })
    }
    trailRef.current = dots

    const onMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    const animate = () => {
      const { x: mx, y: my } = mouseRef.current

      dots.forEach((dot, i) => {
        if (i === 0) {
          dot.x += (mx - dot.x) * 0.35
          dot.y += (my - dot.y) * 0.35
        } else {
          dot.x += (dots[i - 1].x - dot.x) * 0.6
          dot.y += (dots[i - 1].y - dot.y) * 0.6
        }
        dot.el.style.left = dot.x + 'px'
        dot.el.style.top = dot.y + 'px'
      })

      rafRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafRef.current)
      dots.forEach(d => d.el.remove())
    }
  }, [])

  return null
}
