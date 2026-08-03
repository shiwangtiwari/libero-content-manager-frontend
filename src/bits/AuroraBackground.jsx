/**
 * Aurora Background — React Bits
 * Animated gradient mesh background
 */
export default function AuroraBackground({ children }) {
  return (
    <div style={{ position: 'relative', minHeight: '100dvh', overflow: 'hidden', background: '#060611' }}>
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: '-40%',
          left: '-20%',
          width: '80%',
          height: '80%',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(99,102,241,0.15) 0%, transparent 70%)',
          animation: 'aurora1 12s ease-in-out infinite alternate',
        }} />
        <div style={{
          position: 'absolute',
          top: '20%',
          right: '-30%',
          width: '70%',
          height: '70%',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(139,92,246,0.12) 0%, transparent 70%)',
          animation: 'aurora2 15s ease-in-out infinite alternate',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-20%',
          left: '20%',
          width: '60%',
          height: '60%',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(59,130,246,0.1) 0%, transparent 70%)',
          animation: 'aurora3 18s ease-in-out infinite alternate',
        }} />
      </div>
      <style>{`
        @keyframes aurora1 {
          0%   { transform: translate(0, 0) scale(1); }
          100% { transform: translate(8%, 12%) scale(1.15); }
        }
        @keyframes aurora2 {
          0%   { transform: translate(0, 0) scale(1); }
          100% { transform: translate(-10%, 8%) scale(1.2); }
        }
        @keyframes aurora3 {
          0%   { transform: translate(0, 0) scale(1); }
          100% { transform: translate(5%, -10%) scale(1.1); }
        }
      `}</style>
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  )
}
