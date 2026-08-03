import { useState } from 'react'

const PRIORITY = {
  P1: { label: 'Your Input', color: '#818cf8', bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.25)' },
  P2: { label: 'Trending + Gap', color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)' },
  P3: { label: 'Trending', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)' },
  P_fallback: { label: 'Fallback', color: '#94a3b8', bg: 'rgba(148,163,184,0.08)', border: 'rgba(148,163,184,0.15)' },
}

export default function SignalCard({ signalCard, priority }) {
  const [open, setOpen] = useState(false)
  if (!signalCard) return null

  const p = PRIORITY[priority] || PRIORITY.P3
  const { trigger, gap_filled, trending_topics = [], niche_match = [], telegram_input_used } = signalCard

  return (
    <>
      <style>{`
        .sc-wrap {
          border-radius: 10px;
          overflow: hidden;
          margin-top: 14px;
          border: 1px solid var(--border);
        }
        .sc-toggle {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          background: var(--surface2);
          border: none;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          color: var(--text2);
          min-height: 44px;
          -webkit-tap-highlight-color: transparent;
          gap: 8px;
        }
        .sc-pill {
          padding: 2px 10px;
          border-radius: 99px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.04em;
        }
        .sc-chevron {
          color: var(--text3);
          transition: transform 0.2s;
          flex-shrink: 0;
        }
        .sc-chevron.open { transform: rotate(180deg); }
        .sc-body {
          padding: 14px;
          background: var(--surface2);
          border-top: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .sc-row strong {
          display: block;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text3);
          margin-bottom: 3px;
        }
        .sc-row { font-size: 13px; color: var(--text2); line-height: 1.55; }
        .sc-tags { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 4px; }
        .sc-tag {
          background: var(--surface3);
          border: 1px solid var(--border);
          color: var(--text2);
          padding: 2px 9px;
          border-radius: 99px;
          font-size: 11px;
        }
      `}</style>
      <div className="sc-wrap">
        <button className="sc-toggle" onClick={() => setOpen(o => !o)}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="sc-pill" style={{ background: p.bg, color: p.color, border: `1px solid ${p.border}` }}>
              {p.label}
            </span>
            Signal card
          </span>
          <svg className={`sc-chevron${open ? ' open' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </button>
        {open && (
          <div className="sc-body">
            {trigger && (
              <div className="sc-row">
                <strong>Trigger</strong>
                {trigger.replace(/^LinkedIn trending in niche \+ gap: /, '').replace(/"/g, '')}
              </div>
            )}
            {telegram_input_used && (
              <div className="sc-row"><strong>Your input</strong>{telegram_input_used}</div>
            )}
            {gap_filled && (
              <div className="sc-row"><strong>Gap filled</strong>{gap_filled}</div>
            )}
            {trending_topics.length > 0 && (
              <div className="sc-row">
                <strong>Trending</strong>
                <div className="sc-tags">
                  {trending_topics.slice(0, 4).map((t, i) => <span key={i} className="sc-tag">{t}</span>)}
                </div>
              </div>
            )}
            {niche_match.length > 0 && (
              <div className="sc-row">
                <strong>Niche match</strong>
                <div className="sc-tags">
                  {niche_match.map((n, i) => (
                    <span key={i} className="sc-tag" style={{ color: p.color, borderColor: p.border }}>{n}</span>
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
