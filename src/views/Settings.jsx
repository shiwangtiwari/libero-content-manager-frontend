import { useState, useEffect } from 'react'
import { getHealth } from '../api/client.js'

const SCHEDULE = [
  { day: 'Tuesday',   time: '8:30 AM IST' },
  { day: 'Wednesday', time: '12:00 PM IST' },
  { day: 'Thursday',  time: '9:00 AM IST' },
]

const PLATFORMS = [
  { key: 'linkedin',  label: 'LinkedIn',  desc: 'OAuth2 UGC API — posting' },
  { key: 'telegram',  label: 'Telegram',  desc: 'Bot polling — notifications' },
  { key: 'railway',   label: 'Railway',   desc: 'Backend — all jobs' },
]

export default function Settings() {
  const [health, setHealth] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getHealth()
      .then(data => { setHealth(data); setLoading(false) })
      .catch(() => { setLoading(false) })
  }, [])

  const backendOk = health?.status === 'ok'
  const schedulerOk = health?.scheduler === 'running'

  return (
    <>
      <style>{`
        .settings-section {
          margin-bottom: 24px;
        }
        .settings-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text3);
          margin-bottom: 10px;
        }
        .health-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid var(--border);
        }
        .health-row:last-child { border-bottom: none; }
        .health-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .health-dot.green { background: var(--green); box-shadow: 0 0 6px var(--green); }
        .health-dot.red   { background: var(--red);   box-shadow: 0 0 6px var(--red); }
        .health-dot.grey  { background: var(--text3); }
        .health-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--text);
        }
        .health-desc {
          font-size: 12px;
          color: var(--text3);
        }
        .health-status {
          margin-left: auto;
          font-size: 12px;
          font-weight: 600;
          color: var(--text2);
        }
        .sched-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 11px 0;
          border-bottom: 1px solid var(--border);
        }
        .sched-row:last-child { border-bottom: none; }
        .sched-day {
          font-size: 14px;
          font-weight: 600;
          color: var(--text);
        }
        .sched-time {
          font-family: var(--mono);
          font-size: 13px;
          color: var(--accent2);
        }
        .info-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 11px 0;
          border-bottom: 1px solid var(--border);
          font-size: 14px;
        }
        .info-row:last-child { border-bottom: none; }
        .info-key { color: var(--text2); }
        .info-val { color: var(--text); font-family: var(--mono); font-size: 12px; }
        .railway-link {
          color: var(--accent2);
          font-size: 13px;
          text-decoration: none;
          font-weight: 600;
        }
        .railway-link:hover { text-decoration: underline; }
      `}</style>

      <div style={{ paddingTop: 8, marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 4 }}>Settings</div>
        <div style={{ fontSize: 13, color: 'var(--text3)' }}>
          {health?.time_ist ? `Last checked: ${health.time_ist}` : 'Loading…'}
        </div>
      </div>

      {/* System health */}
      <div className="settings-section">
        <div className="settings-label">System health</div>
        <div className="card" style={{ padding: '4px 16px' }}>
          <div className="health-row">
            <span className={`health-dot ${backendOk ? 'green' : 'red'}`} />
            <div>
              <div className="health-name">Railway backend</div>
              <div className="health-desc">FastAPI + APScheduler</div>
            </div>
            <span className="health-status">{backendOk ? 'Online' : 'Offline'}</span>
          </div>
          <div className="health-row">
            <span className={`health-dot ${schedulerOk ? 'green' : 'red'}`} />
            <div>
              <div className="health-name">Scheduler</div>
              <div className="health-desc">Content + posting jobs</div>
            </div>
            <span className="health-status">{schedulerOk ? 'Running' : 'Stopped'}</span>
          </div>
          <div className="health-row">
            <span className="health-dot green" />
            <div>
              <div className="health-name">Supabase</div>
              <div className="health-desc">PostgreSQL database</div>
            </div>
            <span className="health-status">Connected</span>
          </div>
          <div className="health-row">
            <span className="health-dot green" />
            <div>
              <div className="health-name">Telegram bot</div>
              <div className="health-desc">@libero_content_manager_bot</div>
            </div>
            <span className="health-status">Polling</span>
          </div>
        </div>
      </div>

      {/* Posting schedule */}
      <div className="settings-section">
        <div className="settings-label">Posting schedule (IST)</div>
        <div className="card" style={{ padding: '4px 16px' }}>
          {SCHEDULE.map(({ day, time }) => (
            <div key={day} className="sched-row">
              <span className="sched-day">{day}</span>
              <span className="sched-time">{time}</span>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 6 }}>
          Content generation runs Mon/Tue/Wed at 6:00 AM IST
        </div>
      </div>

      {/* System info */}
      <div className="settings-section">
        <div className="settings-label">System info</div>
        <div className="card" style={{ padding: '4px 16px' }}>
          <div className="info-row">
            <span className="info-key">LinkedIn URN</span>
            <span className="info-val">J5DbZGZIT8</span>
          </div>
          <div className="info-row">
            <span className="info-key">Content model</span>
            <span className="info-val">claude-sonnet-4-5</span>
          </div>
          <div className="info-row">
            <span className="info-key">Image flow</span>
            <span className="info-val">Prompt → Telegram</span>
          </div>
          <div className="info-row">
            <span className="info-key">Backend</span>
            <a
              className="railway-link"
              href="https://libero-content-manager-backend-production.up.railway.app/docs"
              target="_blank"
              rel="noopener noreferrer"
            >
              Railway API ↗
            </a>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="settings-section">
        <div className="settings-label">Quick actions</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <a
            className="btn btn-ghost"
            href="https://t.me/libero_content_manager_bot"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none', textAlign: 'center' }}
          >
            Open Telegram Bot ↗
          </a>
          <a
            className="btn btn-ghost"
            href="https://libero-content-manager-backend-production.up.railway.app/docs"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none', textAlign: 'center' }}
          >
            API Docs (Railway) ↗
          </a>
        </div>
      </div>
    </>
  )
}
