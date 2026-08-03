/**
 * Pulsing Dot — status indicator with glow
 */
export default function PulsingDot({ color = '#10b981', size = 10 }) {
  return (
    <>
      <style>{`
        .pulse-dot {
          position: relative;
          display: inline-block;
        }
        .pulse-dot-inner {
          border-radius: 50%;
        }
        .pulse-dot-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          animation: pulse-ring 2s ease-out infinite;
        }
        @keyframes pulse-ring {
          0%   { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2.5); opacity: 0; }
        }
      `}</style>
      <span className="pulse-dot" style={{ width: size, height: size }}>
        <span
          className="pulse-dot-inner"
          style={{ width: size, height: size, background: color, display: 'block', boxShadow: `0 0 6px ${color}` }}
        />
        <span
          className="pulse-dot-ring"
          style={{ background: color }}
        />
      </span>
    </>
  )
}
