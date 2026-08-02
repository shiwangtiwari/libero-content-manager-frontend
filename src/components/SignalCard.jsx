import { useState } from 'react'

const PRIORITY_LABELS = {
  P1: { label: 'Your Input', color: '#6366f1', bg: '#1e1b4b' },
  P2: { label: 'Trending + Gap', color: '#10b981', bg: '#022c22' },
  P3: { label: 'Trending', color: '#f59e0b', bg: '#1c1007' },
  P_fallback: { label: 'Fallback', color: '#94a3b8', bg: '#1e2d45' },
}

export default function SignalCard({ signalCard, priority }) {
  const [open, setOpen] = useState(false)
  if (!signalCard) return null

  const p = PRIORITY_LABELS[priority] || PRIORITY_LABELS['P3']
  const trigger = signalCard.trigger || ''
  const gap = signalCard.gap_filled || ''
  const trending = signalCard.trending_topics || []
  const niche = signalCard.niche_match || []
  const tgInput = signalCard.telegram_input_used || ''

  return (
    <>
      <style>{`
        .signal-wrap {
          margin-top: 12px;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid var(--border);
        }
        .signal-toggle {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 12px;
          background: var(--surface2);
          border: none;
          cursor: pointer;
          color: var(--text2);
          font-size: 13px;
          font-weight: 600;
          -webkit-tap-highlight-color: transparent;
          min-height: 44px;
        }
        .signal-toggle-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .signal-pill {
          padding: 2px 8px;
          border-radius: 99px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.04em;
        }
        .signal-chevron {
          transition: transform 0.2s;
          color: var(--text3);
        }
        .signal-chevron.open { transform: rotate(180deg); }
        .signal-body {
          padding: 12px;
          background: var(--surface2);
          border-top: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .signal-row {
          font-size: 13px;
          color: var(--text2);
          line-height: 1.5;
        }
        .signal-row strong {
          color: var(--text3);
          font-weight: 600;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          display: block;
          margin-bottom: 2px;
        }
        .signal-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-top: 2px;
        }
        .signal-tag {
          background: var(--border);
          color: var(--text2);
          padding: 2px 8px;
          border-radius: 99px;
          font-size: 11px;
        }
      `}</style>

      <div className="signal-wrap">
        <button className="signal-toggle" onClick={() => setOpen(o => !o)}>
          <span className="signal-toggle-left">
            <span className="signal-pill" style={{ background: p.bg, color: p.color }}>
              {p.label}
            </span>
            Signal card
          </span>
          <svg className={`signal-chevron${open ? ' open' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {open && (
          <div className="signal-body">
            {trigger && (
              <div className="signal-row">
                <strong>Trigger</strong>
                {trigger.replace(/^LinkedIn trending in niche \+ gap: /, '').replace(/^You said: /, '')}
              </div>
            )}
            {tgInput && (
              <div className="signal-row">
                <strong>Your input</strong>
                {tgInput}
              </div>
            )}
            {gap && (
              <div className="signal-row">
                <strong>Gap filled</strong>
                {gap}
              </div>
            )}
            {trending.length > 0 && (
              <div className="signal-row">
                <strong>Trending topics</strong>
                <div className="signal-tags">
                  {trending.slice(0, 4).map((t, i) => (
                    <span key={i} className="signal-tag">{t}</span>
                  ))}
                </div>
              </div>
            )}
            {niche.length > 0 && (
              <div className="signal-row">
                <strong>Niche match</strong>
                <div className="signal-tags">
                  {niche.map((n, i) => (
                    <span key={i} className="signal-tag" style={{ color: p.color }}>{n}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
