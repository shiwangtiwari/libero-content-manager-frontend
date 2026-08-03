import { useState } from 'react'
import AuroraBackground from './bits/AuroraBackground.jsx'
import CursorTrail from './bits/CursorTrail.jsx'
import GradientText from './bits/GradientText.jsx'
import Queue from './views/Queue.jsx'
import Posted from './views/Posted.jsx'
import Input from './views/Input.jsx'
import Settings from './views/Settings.jsx'
import Profile from './views/Profile.jsx'
import BottomNav from './components/BottomNav.jsx'

export default function App() {
  const [view, setView] = useState('queue')

  const VIEW_TITLES = {
    queue:    'Queue',
    posted:   'Posted',
    input:    "Write",
    profile:  'Profile',
    settings: 'System',
  }

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg:        #060611;
          --surface:   #080d1a;
          --surface2:  #0d1525;
          --surface3:  #111e33;
          --border:    rgba(56,189,248,0.1);
          --border2:   rgba(56,189,248,0.2);
          /* Shifted accent palette: electric blue instead of warm indigo */
          --accent:    #0ea5e9;
          --accent2:   #38bdf8;
          --purple:    #818cf8;
          --cyan:      #38bdf8;
          --green:     #10b981;
          --amber:     #f59e0b;
          --red:       #ef4444;
          --text:      #e2e8f0;
          --text2:     #7dd3fc;
          --text3:     rgba(56,189,248,0.3);
          --mono:      'JetBrains Mono', 'Fira Code', monospace;
          --sans:      'Inter', system-ui, sans-serif;
          --nav-h:     68px;
          --radius:    14px;
        }

        html, body {
          background: var(--bg);
          color: var(--text);
          font-family: var(--sans);
          font-size: 16px;
          line-height: 1.5;
          min-height: 100dvh;
          -webkit-font-smoothing: antialiased;
          overscroll-behavior: none;
        }

        #root { display: flex; flex-direction: column; min-height: 100dvh; }

        .page {
          flex: 1;
          overflow-y: auto;
          padding: 0 16px calc(var(--nav-h) + 24px);
          max-width: 700px;
          margin: 0 auto;
          width: 100%;
        }

        /* Page header */
        .page-header {
          position: sticky;
          top: 0;
          z-index: 30;
          padding: 16px 0 12px;
          background: linear-gradient(to bottom, rgba(6,6,17,0.97) 80%, transparent);
          backdrop-filter: blur(12px);
          margin-bottom: 4px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .page-title {
          font-size: 22px;
          font-weight: 700;
          letter-spacing: -0.02em;
        }
        .page-header-sys {
          font-family: var(--mono);
          font-size: 10px;
          color: rgba(56,189,248,0.25);
          letter-spacing: 0.1em;
        }

        /* Cards — electric border */
        .card {
          background: var(--surface);
          border: 1px solid rgba(56,189,248,0.1);
          border-radius: var(--radius);
          padding: 18px;
          margin-bottom: 12px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .card:hover {
          border-color: rgba(56,189,248,0.2);
          box-shadow: 0 0 16px rgba(56,189,248,0.04);
        }

        /* Buttons */
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          min-height: 44px;
          padding: 0 18px;
          border-radius: 10px;
          border: none;
          font-family: var(--sans);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
          -webkit-tap-highlight-color: transparent;
          position: relative;
          overflow: hidden;
        }
        .btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: white;
          opacity: 0;
          transition: opacity 0.15s;
        }
        .btn:active::after { opacity: 0.08; }
        .btn:active { transform: scale(0.97); }
        .btn:disabled { opacity: 0.38; cursor: not-allowed; transform: none; }

        .btn-primary {
          background: linear-gradient(135deg, #0ea5e9, #818cf8);
          color: #fff;
          box-shadow: 0 0 20px rgba(14,165,233,0.25);
        }
        .btn-primary:hover:not(:disabled) {
          box-shadow: 0 0 32px rgba(14,165,233,0.4);
          transform: translateY(-1px);
        }
        .btn-green {
          background: linear-gradient(135deg, #059669, #10b981);
          color: #fff;
          box-shadow: 0 0 16px rgba(16,185,129,0.2);
        }
        .btn-red {
          background: linear-gradient(135deg, #dc2626, #ef4444);
          color: #fff;
        }
        .btn-ghost {
          background: rgba(56,189,248,0.05);
          color: rgba(56,189,248,0.6);
          border: 1px solid rgba(56,189,248,0.15);
        }
        .btn-ghost:hover:not(:disabled) {
          border-color: rgba(56,189,248,0.35);
          color: #38bdf8;
        }

        /* Badges */
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 10px;
          border-radius: 99px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          font-family: var(--mono);
        }
        .badge-draft     { background: rgba(56,189,248,0.05); color: rgba(56,189,248,0.5); border: 1px solid rgba(56,189,248,0.15); }
        .badge-approved  { background: rgba(56,189,248,0.1);  color: #38bdf8;              border: 1px solid rgba(56,189,248,0.3); }
        .badge-scheduled { background: rgba(129,140,248,0.1); color: #818cf8;              border: 1px solid rgba(129,140,248,0.3); }
        .badge-pending   { background: rgba(245,158,11,0.1);  color: #fcd34d;              border: 1px solid rgba(245,158,11,0.3); }
        .badge-posted    { background: rgba(16,185,129,0.1);  color: #6ee7b7;              border: 1px solid rgba(16,185,129,0.3); }
        .badge-rejected  { background: rgba(239,68,68,0.08);  color: #fca5a5;              border: 1px solid rgba(239,68,68,0.2); }

        /* Divider */
        .divider { border: none; border-top: 1px solid rgba(56,189,248,0.08); margin: 14px 0; }

        /* Empty state */
        .empty { text-align: center; padding: 64px 24px; color: var(--text3); }
        .empty-icon { margin-bottom: 16px; opacity: 0.5; }
        .empty-text { font-size: 15px; font-weight: 600; color: rgba(56,189,248,0.4); margin-bottom: 6px; font-family: var(--mono); letter-spacing: 0.06em; }
        .empty-sub  { font-size: 13px; line-height: 1.6; color: rgba(56,189,248,0.25); font-family: var(--mono); }

        /* Spinner */
        .spinner {
          width: 28px; height: 28px;
          border: 1.5px solid rgba(56,189,248,0.12);
          border-top-color: #38bdf8;
          border-radius: 50%;
          animation: spin 0.65s linear infinite;
          margin: 64px auto;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Toast */
        .toast {
          position: fixed;
          bottom: calc(var(--nav-h) + 20px);
          left: 50%;
          transform: translateX(-50%);
          background: rgba(8,13,26,0.96);
          border: 1px solid rgba(56,189,248,0.3);
          color: #38bdf8;
          padding: 10px 22px;
          border-radius: 99px;
          font-size: 13px;
          font-weight: 600;
          font-family: var(--mono);
          letter-spacing: 0.06em;
          z-index: 200;
          white-space: nowrap;
          box-shadow: 0 0 24px rgba(56,189,248,0.15);
          animation: toast-in 0.25s cubic-bezier(0.34,1.56,0.64,1);
          pointer-events: none;
        }
        @keyframes toast-in {
          from { opacity: 0; transform: translateX(-50%) translateY(12px) scale(0.95); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
        }

        /* Inputs */
        input, textarea {
          width: 100%;
          background: rgba(56,189,248,0.04);
          border: 1px solid rgba(56,189,248,0.12);
          border-radius: 10px;
          color: var(--text);
          font-family: var(--sans);
          font-size: 16px;
          padding: 13px 16px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        input:focus, textarea:focus {
          border-color: rgba(56,189,248,0.4);
          box-shadow: 0 0 0 3px rgba(56,189,248,0.08);
        }
        textarea { resize: vertical; min-height: 130px; line-height: 1.65; }
        label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          color: rgba(56,189,248,0.5);
          margin-bottom: 7px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-family: var(--mono);
        }

        /* Score badge */
        .score-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(14,165,233,0.08);
          border: 1px solid rgba(56,189,248,0.2);
          padding: 3px 10px;
          border-radius: 99px;
          font-family: var(--mono);
          font-size: 11px;
          color: rgba(56,189,248,0.7);
        }
        .score-badge.high {
          background: rgba(16,185,129,0.08);
          border-color: rgba(16,185,129,0.3);
          color: #6ee7b7;
        }

        .action-row { display: flex; gap: 8px; flex-wrap: wrap; }
        .action-row .btn { flex: 1; min-width: 80px; font-size: 13px; padding: 0 12px; }

        @media (min-width: 640px) {
          .page { padding: 0 24px calc(var(--nav-h) + 28px); }
          .page-title { font-size: 26px; }
        }
      `}</style>

      <AuroraBackground>
        <CursorTrail />
        <main className="page">
          <div className="page-header">
            <span className="page-title">
              <GradientText from="#38bdf8" via="#818cf8" to="#0ea5e9">
                {VIEW_TITLES[view]}
              </GradientText>
            </span>
            <span className="page-header-sys">LIBERO / SYS</span>
          </div>

          {view === 'queue'    && <Queue />}
          {view === 'posted'   && <Posted />}
          {view === 'input'    && <Input />}
          {view === 'profile'  && <Profile />}
          {view === 'settings' && <Settings />}
        </main>
        <BottomNav active={view} onChange={setView} />
      </AuroraBackground>
    </>
  )
}
