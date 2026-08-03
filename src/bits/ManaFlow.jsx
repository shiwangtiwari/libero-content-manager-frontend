/**
 * ManaFlow — electric energy border effect
 * Wraps any card with a flowing electric-blue border animation.
 * active=true: full mana glow (for approved posts, active states)
 * pulse=true: subtle breathing glow (for all system cards)
 * dim=true: very faint border only (for secondary cards)
 */
export default function ManaFlow({ children, active = false, pulse = false, dim = false, style = {}, className = '' }) {
  return (
    <>
      <style>{`
        .mana-wrap {
          position: relative;
          border-radius: 14px;
          background: #080d1a;
        }

        /* Dim — just a faint electric border, no glow */
        .mana-wrap.mana-dim {
          border: 1px solid rgba(56, 189, 248, 0.12);
          box-shadow: 0 0 0 0 transparent;
        }

        /* Pulse — soft breathing glow for system panels */
        .mana-wrap.mana-pulse {
          border: 1px solid rgba(56, 189, 248, 0.22);
          box-shadow:
            0 0 12px rgba(56, 189, 248, 0.06),
            inset 0 0 20px rgba(56, 189, 248, 0.03);
          animation: mana-breathe 4s ease-in-out infinite;
        }

        /* Active — full energy flow, conic gradient border */
        .mana-wrap.mana-active {
          border-color: transparent;
        }
        .mana-wrap.mana-active::before {
          content: '';
          position: absolute;
          inset: -1.5px;
          border-radius: 15.5px;
          background: conic-gradient(
            from var(--mana-angle, 0deg),
            #0ea5e9,
            #38bdf8,
            #818cf8,
            #0ea5e9
          );
          animation: mana-spin 3s linear infinite;
          z-index: 0;
        }
        .mana-wrap.mana-active::after {
          content: '';
          position: absolute;
          inset: 1px;
          border-radius: 13px;
          background: #080d1a;
          z-index: 1;
        }

        /* Corner brackets — the Solo Leveling scan-frame detail */
        .mana-corner {
          position: absolute;
          width: 12px;
          height: 12px;
          z-index: 3;
          pointer-events: none;
        }
        .mana-corner svg {
          display: block;
        }
        .mana-corner.tl { top: -1px; left: -1px; }
        .mana-corner.tr { top: -1px; right: -1px; transform: rotate(90deg); }
        .mana-corner.bl { bottom: -1px; left: -1px; transform: rotate(-90deg); }
        .mana-corner.br { bottom: -1px; right: -1px; transform: rotate(180deg); }

        .mana-inner {
          position: relative;
          z-index: 2;
        }

        @keyframes mana-spin {
          0%   { --mana-angle: 0deg; }
          100% { --mana-angle: 360deg; }
        }
        @keyframes mana-breathe {
          0%, 100% { box-shadow: 0 0 12px rgba(56,189,248,0.06), inset 0 0 20px rgba(56,189,248,0.03); border-color: rgba(56,189,248,0.22); }
          50%       { box-shadow: 0 0 22px rgba(56,189,248,0.14), inset 0 0 28px rgba(56,189,248,0.07); border-color: rgba(56,189,248,0.38); }
        }

        @property --mana-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
      `}</style>

      <div
        className={[
          'mana-wrap',
          active ? 'mana-active' : pulse ? 'mana-pulse' : dim ? 'mana-dim' : 'mana-dim',
          className,
        ].filter(Boolean).join(' ')}
        style={style}
      >
        {/* Corner bracket SVGs — only on active/pulse */}
        {(active || pulse) && (
          <>
            {['tl','tr','bl','br'].map(pos => (
              <span key={pos} className={`mana-corner ${pos}`}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M0 8 L0 0 L8 0" stroke="rgba(56,189,248,0.7)" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </span>
            ))}
          </>
        )}
        <div className="mana-inner">
          {children}
        </div>
      </div>
    </>
  )
}
