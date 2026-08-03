import { useState, useEffect } from 'react'
import BlurFade from '../bits/BlurFade.jsx'
import PulsingDot from '../bits/PulsingDot.jsx'
import { getHealth } from '../api/client.js'

const SCHEDULE = [
  { day: 'Monday',    time: '6:00 AM',  role: 'Generate draft → Tuesday post' },
  { day: 'Tuesday',   time: '6:00 AM',  role: 'Generate draft → Wednesday post' },
  { day: 'Tuesday',   time: '8:30 AM',  role: 'Post to LinkedIn' },
  { day: 'Wednesday', time: '6:00 AM',  role: 'Generate draft → Thursday post' },
  { day: 'Wednesday', time: '12:00 PM', role: 'Post to LinkedIn' },
  { day: 'Thursday',  time: '9:00 AM',  role: 'Post to LinkedIn' },
]

export default function Settings() {
  const [health, setHealth] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getHealth()
      .then(d => { setHealth(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const backendOk = health?.status === 'ok'
  const schedulerOk = health?.scheduler === 'running'
  const jobCount = health?.scheduler_jobs || 0

  return (
    <>
      <style>{`
        .settings-section { margin-bottom: 24px; }
        .settings-section-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text3);
          margin-bottom: 10px;
        }
        .health-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 14px;
          overflow: hidden;
        }
        .health-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          border-bottom: 1px solid var(--border);
          transition: background 0.15s;
        }
        .health-row:last-child { border-bottom: none; }
        .health-row:hover { background: var(--surface2); }
        .health-info { flex: 1; min-width: 0; }
        .health-name { font-size: 14px; font-weight: 600; color: var(--text); }
        .health-desc { font-size: 12px; color: var(--text3); margin-top: 1px; }
        .health-status { font-size: 12px; font-weight: 600; white-space: nowrap; }
        .sched-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 14px;
          overflow: hidden;
        }
        .sched-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-bottom: 1px solid var(--border);
          gap: 8px;
        }
        .sched-row:last-child { border-bottom: none; }
        .sched-left { display: flex; flex-direction: column; gap: 2px; }
        .sched-day { font-size: 14px; font-weight: 600; color: var(--text); }
        .sched-role { font-size: 12px; color: var(--text3); }
        .sched-time { font-family: var(--mono); font-size: 13px; color: var(--accent2); white-space: nowrap; }
        .info-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 14px;
          overflow: hidden;
        }
        .info-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-bottom: 1px solid var(--border);
          font-size: 14px;
          gap: 8px;
        }
        .info-row:last-child { border-bottom: none; }
        .info-key { color: var(--text2); font-size: 13px; }
        .info-val { font-family: var(--mono); font-size: 12px; color: var(--text); text-align: right; }
        .quick-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          text-decoration: none;
          color: var(--text2);
          font-size: 14px;
          font-weight: 500;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          margin-bottom: 8px;
          transition: all 0.15s;
        }
        .quick-link:hover { border-color: var(--border2); color: var(--text); }
        .quick-link-icon { color: var(--text3); }
      `}</style>

      {loading && <div className="spinner" />}

      {!loading && (
        <>
          <BlurFade delay={0}>
            <div className="settings-section">
              <div className="settings-section-label">System health</div>
              <div className="health-card">
                <div className="health-row">
                  <PulsingDot color={backendOk ? '#10b981' : '#ef4444'} size={10} />
                  <div className="health-info">
                    <div className="health-name">Railway backend</div>
                    <div className="health-desc">FastAPI · {health?.time_ist || '—'}</div>
                  </div>
                  <span className="health-status" style={{ color: backendOk ? 'var(--green)' : 'var(--red)' }}>
                    {backendOk ? 'Online' : 'Offline'}
                  </span>
                </div>
                <div className="health-row">
                  <PulsingDot color={schedulerOk ? '#10b981' : '#ef4444'} size={10} />
                  <div className="health-info">
                    <div className="health-name">Scheduler</div>
                    <div className="health-desc">{jobCount} jobs registered</div>
                  </div>
                  <span className="health-status" style={{ color: schedulerOk ? 'var(--green)' : 'var(--red)' }}>
                    {schedulerOk ? 'Running' : 'Stopped'}
                  </span>
                </div>
                <div className="health-row">
                  <PulsingDot color="#10b981" size={10} />
                  <div className="health-info">
                    <div className="health-name">Supabase</div>
                    <div className="health-desc">PostgreSQL + Storage</div>
                  </div>
                  <span className="health-status" style={{ color: 'var(--green)' }}>Connected</span>
                </div>
                <div className="health-row">
                  <PulsingDot color="#10b981" size={10} />
                  <div className="health-info">
                    <div className="health-name">Telegram bot</div>
                    <div className="health-desc">@libero_content_manager_bot</div>
                  </div>
                  <span className="health-status" style={{ color: 'var(--green)' }}>Polling</span>
                </div>
              </div>
            </div>
          </BlurFade>

          <BlurFade delay={0.08}>
            <div className="settings-section">
              <div className="settings-section-label">Weekly schedule (IST)</div>
              <div className="sched-card">
                {SCHEDULE.map((s, i) => (
                  <div key={i} className="sched-row">
                    <div className="sched-left">
                      <span className="sched-day">{s.day}</span>
                      <span className="sched-role">{s.role}</span>
                    </div>
                    <span className="sched-time">{s.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </BlurFade>

          <BlurFade delay={0.14}>
            <div className="settings-section">
              <div className="settings-section-label">System info</div>
              <div className="info-card">
                <div className="info-row">
                  <span className="info-key">Content model</span>
                  <span className="info-val">claude-sonnet-4-5</span>
                </div>
                <div className="info-row">
                  <span className="info-key">LinkedIn URN</span>
                  <span className="info-val">J5DbZGZIT8</span>
                </div>
                <div className="info-row">
                  <span className="info-key">Image flow</span>
                  <span className="info-val">Prompt → Telegram → Storage</span>
                </div>
                <div className="info-row">
                  <span className="info-key">Phase</span>
                  <span className="info-val" style={{ color: 'var(--green)' }}>P6 — Hardened ✓</span>
                </div>
              </div>
            </div>
          </BlurFade>

          <BlurFade delay={0.2}>
            <div className="settings-section">
              <div className="settings-section-label">Quick links</div>
              <a className="quick-link" href="https://t.me/libero_content_manager_bot" target="_blank" rel="noopener noreferrer">
                <span>Open Telegram Bot</span>
                <svg className="quick-link-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><path d="M15 3h6v6"/><path d="M10 14L21 3"/>
                </svg>
              </a>
              <a className="quick-link" href="https://libero-content-manager-backend-production.up.railway.app/docs" target="_blank" rel="noopener noreferrer">
                <span>API Docs</span>
                <svg className="quick-link-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><path d="M15 3h6v6"/><path d="M10 14L21 3"/>
                </svg>
              </a>
            </div>
          </BlurFade>
        </>
      )}
    </>
  )
}
