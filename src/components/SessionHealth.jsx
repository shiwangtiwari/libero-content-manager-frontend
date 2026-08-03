import ManaFlow from '../bits/ManaFlow.jsx'

const PLATFORM_LABELS = {
  claude:  'CONTENT ENGINE',
  chatgpt: 'IMAGE GEN / GPT',
  gemini:  'IMAGE GEN / GEMINI',
}

function humanTime(str) {
  if (!str) return 'NEVER CHECKED'
  try {
    const dt = new Date(str)
    return dt.toLocaleString('en-IN', {
      hour: '2-digit', minute: '2-digit',
      day: 'numeric', month: 'short',
      hour12: false,
    }).toUpperCase()
  } catch { return str }
}

export default function SessionHealth({ platforms = [] }) {
  return (
    <>
      <style>{`
        .sh-wrap { display: flex; flex-direction: column; gap: 10px; }

        .sh-row {
          padding: 14px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          border-radius: 12px;
          background: rgba(8, 13, 26, 0.6);
        }
        .sh-left {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
          min-width: 0;
        }

        /* Status indicator — electric dot with scan ring */
        .sh-indicator {
          flex-shrink: 0;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          position: relative;
        }
        .sh-indicator.ok {
          background: #38bdf8;
          box-shadow: 0 0 6px #38bdf8;
        }
        .sh-indicator.ok::before {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 1px solid rgba(56,189,248,0.4);
          animation: sh-scan 2.5s ease-out infinite;
        }
        .sh-indicator.err {
          background: #ef4444;
          box-shadow: 0 0 6px rgba(239,68,68,0.6);
        }

        .sh-name {
          font-family: var(--mono);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          color: var(--text2);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sh-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 3px;
          flex-shrink: 0;
        }
        .sh-status {
          font-family: var(--mono);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
        }
        .sh-status.ok  { color: #38bdf8; }
        .sh-status.err { color: #f87171; }

        .sh-time {
          font-family: var(--mono);
          font-size: 10px;
          color: rgba(56,189,248,0.3);
          letter-spacing: 0.06em;
        }

        .sh-empty {
          font-family: var(--mono);
          font-size: 12px;
          color: rgba(56,189,248,0.25);
          text-align: center;
          padding: 24px;
          letter-spacing: 0.08em;
        }

        @keyframes sh-scan {
          0%   { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2.4); opacity: 0; }
        }
      `}</style>

      <div className="sh-wrap">
        {platforms.length === 0 && (
          <div className="sh-empty">[ NO TELEMETRY DATA ]</div>
        )}
        {platforms.map(p => {
          const ok = p.is_healthy
          const label = PLATFORM_LABELS[p.platform] || p.platform.toUpperCase()
          const failures = p.failure_count > 0 ? ` ×${p.failure_count}` : ''
          return (
            <ManaFlow key={p.platform} pulse={ok} dim={!ok}>
              <div className="sh-row">
                <div className="sh-left">
                  <div className={`sh-indicator ${ok ? 'ok' : 'err'}`} />
                  <span className="sh-name">{label}</span>
                </div>
                <div className="sh-right">
                  <span className={`sh-status ${ok ? 'ok' : 'err'}`}>
                    {ok ? 'ONLINE' : `FAULT${failures}`}
                  </span>
                  <span className="sh-time">{humanTime(p.last_checked)}</span>
                </div>
              </div>
            </ManaFlow>
          )
        })}
      </div>
    </>
  )
}
