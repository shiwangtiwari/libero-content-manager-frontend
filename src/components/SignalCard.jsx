import React, { useState } from 'react'

const SOURCE_LABELS = {
  telegram_input: { label: 'Your Idea', color: '#a78bfa' },
  linkedin_trending: { label: 'Trending', color: '#34d399' },
  gap_analysis: { label: 'Gap Fill', color: '#fbbf24' },
}

const styles = {
  card: {
    background: '#1e1e2e',
    border: '1px solid #2a2a3a',
    borderRadius: '10px',
    marginTop: '10px',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 14px',
    cursor: 'pointer',
    minHeight: '44px',
    width: '100%',
    background: 'none',
    border: 'none',
    color: '#f0f0f0',
    textAlign: 'left',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  badge: (color) => ({
    background: color + '22',
    color: color,
    fontSize: '11px',
    fontWeight: '700',
    padding: '2px 8px',
    borderRadius: '20px',
    letterSpacing: '0.5px',
  }),
  title: {
    fontSize: '13px',
    color: '#9ca3af',
  },
  chevron: (open) => ({
    fontSize: '10px',
    color: '#6b7280',
    transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
    transition: 'transform 0.2s',
  }),
  body: {
    padding: '0 14px 14px',
    borderTop: '1px solid #2a2a3a',
  },
  row: {
    marginTop: '10px',
  },
  rowLabel: {
    fontSize: '11px',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '3px',
  },
  rowValue: {
    fontSize: '13px',
    color: '#d1d5db',
    lineHeight: '1.4',
  },
  tag: {
    display: 'inline-block',
    background: '#1f2937',
    color: '#9ca3af',
    fontSize: '12px',
    padding: '2px 8px',
    borderRadius: '4px',
    marginRight: '4px',
    marginBottom: '4px',
  },
}

export default function SignalCard({ signal }) {
  const [open, setOpen] = useState(false)

  if (!signal || !signal.primary_signal) {
    return null
  }

  const src = SOURCE_LABELS[signal.primary_signal] || { label: signal.primary_signal, color: '#60a5fa' }

  return (
    <div style={styles.card}>
      <button style={styles.header} onClick={() => setOpen(!open)}>
        <div style={styles.left}>
          <span style={styles.badge(src.color)}>{src.label}</span>
          <span style={styles.title}>Why this post was generated</span>
        </div>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          stroke="#6b7280"
          strokeWidth="2"
          strokeLinecap="round"
          style={styles.chevron(open)}
        >
          <polyline points="2 4 6 8 10 4" />
        </svg>
      </button>

      {open && (
        <div style={styles.body}>
          {signal.trigger && (
            <div style={styles.row}>
              <div style={styles.rowLabel}>Trigger</div>
              <div style={styles.rowValue}>{signal.trigger}</div>
            </div>
          )}
          {signal.telegram_input_used && (
            <div style={styles.row}>
              <div style={styles.rowLabel}>Your input used</div>
              <div style={styles.rowValue}>"{signal.telegram_input_used}"</div>
            </div>
          )}
          {signal.gap_filled && (
            <div style={styles.row}>
              <div style={styles.rowLabel}>Gap filled</div>
              <div style={styles.rowValue}>{signal.gap_filled}</div>
            </div>
          )}
          {signal.trending_topics?.length > 0 && (
            <div style={styles.row}>
              <div style={styles.rowLabel}>Trending topics referenced</div>
              <div>
                {signal.trending_topics.map((t, i) => (
                  <span key={i} style={styles.tag}>{t}</span>
                ))}
              </div>
            </div>
          )}
          {signal.niche_match?.length > 0 && (
            <div style={styles.row}>
              <div style={styles.rowLabel}>Niche match</div>
              <div>
                {signal.niche_match.map((t, i) => (
                  <span key={i} style={styles.tag}>{t}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
