/**
 * Gradient Text — React Bits
 * Text with animated gradient fill
 */
export default function GradientText({ children, from = '#818cf8', via = '#c084fc', to = '#60a5fa', animate = true, style = {} }) {
  return (
    <>
      {animate && (
        <style>{`
          @keyframes gradient-shift {
            0%   { background-position: 0% 50%; }
            50%  { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .gradient-text-anim {
            background: linear-gradient(135deg, ${from}, ${via}, ${to}, ${from});
            background-size: 300% 300%;
            animation: gradient-shift 4s ease infinite;
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            color: transparent;
          }
        `}</style>
      )}
      <span
        className={animate ? 'gradient-text-anim' : ''}
        style={animate ? style : {
          background: `linear-gradient(135deg, ${from}, ${via}, ${to})`,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          color: 'transparent',
          ...style,
        }}
      >
        {children}
      </span>
    </>
  )
}
