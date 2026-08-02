import React from 'react'

const PLATFORM_LABELS = {
  claude: 'Claude.ai',
  chatgpt: 'ChatGPT',
  gemini: 'Gemini',
}

const s = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#161616',
    border: '1px solid #252525',
    borderRadius: '10px',
    padding: '12px 16px',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  dot: (healthy) => ({
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: healthy ? '#4ade80' : '#f87171',
    flexShrink: 0,
  }),
  name: {
    fontSize: '14px',
    color: '#e5e7eb',
    fontWeight: '500',
  },
  right: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '2px',
  },
  statusText: (healthy) => ({
    fontSize: '12px',
    color: healthy ? '#4ade80' : '#f87171',
    fontWeight: '600',
  }),
  lastChecked: {
    fontSize: '11px',
    color: '#4b5563',
  },
}

export default function SessionHealth({ platforms = [] }) {
  return (
    <div style={s.container}>
      {platforms.map((p) => {
        const checked = p.last_checked
          ? new Date(p.last_checked).toLocaleString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
              day: 'numeric',
              month: 'short',
            })
          : 'Never'

        return (
          <div key={p.platform} style={s.row}>
            <div style={s.left}>
              <div style={s.dot(p.is_healthy)} />
              <span style={s.name}>{PLATFORM_LABELS[p.platform] || p.platform}</span>
            </div>
            <div style={s.right}>
              <span style={s.statusText(p.is_healthy)}>
                {p.is_healthy ? 'Healthy' : 'Expired'}
              </span>
              <span style={s.lastChecked}>Checked {checked}</span>
            </div>
          </div>
        )
      })}
      {platforms.length === 0 && (
        <div style={{ color: '#4b5563', fontSize: '14px', textAlign: 'center', padding: '20px' }}>
          No session data yet.
        </div>
      )}
    </div>
  )
}
