import React, { useEffect, useState } from 'react'
import SessionHealth from '../components/SessionHealth.jsx'
import { getSessionHealth } from '../api/client.js'

const POSTING_SCHEDULE = [
  { day: 'Tuesday', time: '8:30 AM IST' },
  { day: 'Wednesday', time: '12:00 PM IST' },
  { day: 'Thursday', time: '9:00 AM IST' },
]

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const s = {
  page: { padding: '16px 16px 100px' },
  title: { fontSize: '20px', fontWeight: '700', color: '#f0f0f0', marginBottom: '20px' },
  section: { marginBottom: '28px' },
  sectionTitle: {
    fontSize: '12px',
    color: '#6b7280',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '12px',
  },
  scheduleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#161616',
    border: '1px solid #252525',
    borderRadius: '10px',
    padding: '12px 16px',
    marginBottom: '8px',
  },
  day: { fontSize: '14px', color: '#e5e7eb', fontWeight: '500' },
  time: { fontSize: '13px', color: '#60a5fa', fontWeight: '600' },
  oauthCard: {
    background: '#161616',
    border: '1px solid #252525',
    borderRadius: '10px',
    padding: '14px 16px',
  },
  oauthTitle: { fontSize: '14px', color: '#e5e7eb', fontWeight: '500', marginBottom: '6px' },
  oauthStatus: (ok) => ({
    fontSize: '13px',
    color: ok ? '#4ade80' : '#f87171',
    marginBottom: '10px',
  }),
  link: {
    display: 'inline-block',
    color: '#60a5fa',
    fontSize: '13px',
    textDecoration: 'none',
    background: '#1e3a5f',
    border: '1px solid #1d4ed8',
    padding: '8px 14px',
    borderRadius: '8px',
    minHeight: '44px',
    lineHeight: '28px',
  },
  refreshBtn: {
    background: 'none',
    border: '1px solid #333',
    color: '#6b7280',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '12px',
    cursor: 'pointer',
    minHeight: '32px',
    marginLeft: '8px',
  },
  infoCard: {
    background: '#1a1a1a',
    border: '1px solid #252525',
    borderRadius: '10px',
    padding: '14px 16px',
    fontSize: '13px',
    color: '#6b7280',
    lineHeight: '1.6',
  },
}

export default function Settings() {
  const [platforms, setPlatforms] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const data = await getSessionHealth()
      setPlatforms(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const authUrl = `${API_URL}/auth/linkedin/url`

  return (
    <div style={s.page}>
      <h1 style={s.title}>Settings</h1>

      {/* Session health */}
      <div style={s.section}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
          <span style={s.sectionTitle}>Session Health</span>
          <button style={s.refreshBtn} onClick={load}>↻ Refresh</button>
        </div>
        {loading ? (
          <div style={{ color: '#4b5563', fontSize: '14px' }}>Checking sessions…</div>
        ) : (
          <SessionHealth platforms={platforms} />
        )}
        <div style={{ ...s.infoCard, marginTop: '10px' }}>
          Sessions expire approximately monthly. When a platform shows red, go to Railway → Variables and paste fresh cookies from Cookie-Editor.
        </div>
      </div>

      {/* Posting schedule */}
      <div style={s.section}>
        <div style={s.sectionTitle}>Posting Schedule</div>
        {POSTING_SCHEDULE.map((slot) => (
          <div key={slot.day} style={s.scheduleRow}>
            <span style={s.day}>{slot.day}</span>
            <span style={s.time}>{slot.time}</span>
          </div>
        ))}
        <div style={s.infoCard}>
          Content generation runs 26–30 hours before each post. Missed approvals auto-reschedule to the next slot.
        </div>
      </div>

      {/* LinkedIn OAuth */}
      <div style={s.section}>
        <div style={s.sectionTitle}>LinkedIn Connection</div>
        <div style={s.oauthCard}>
          <div style={s.oauthTitle}>LinkedIn OAuth2</div>
          <div style={s.oauthStatus(true)}>
            ● Token set in Railway env (LINKEDIN_ACCESS_TOKEN)
          </div>
          <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px' }}>
            LinkedIn access tokens expire every 60 days. When posting fails, click below to get a new authorization URL, then follow Section 8 of the master doc.
          </p>
          <a href={authUrl} target="_blank" rel="noopener noreferrer" style={s.link}>
            Get LinkedIn Auth URL →
          </a>
        </div>
      </div>

      {/* System info */}
      <div style={s.section}>
        <div style={s.sectionTitle}>System</div>
        <div style={s.infoCard}>
          Backend: Railway (FastAPI)<br />
          Database: Supabase (PostgreSQL)<br />
          Dashboard: Vercel (React)<br />
          Content generation: Playwright → Claude.ai<br />
          Image generation: Playwright → ChatGPT / Gemini<br />
          Posting: LinkedIn OAuth2 UGC API
        </div>
      </div>
    </div>
  )
}
