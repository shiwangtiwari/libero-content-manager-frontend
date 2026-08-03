import { useState } from 'react'
import AuroraBackground from './bits/AuroraBackground.jsx'
import CursorTrail from './bits/CursorTrail.jsx'
import GradientText from './bits/GradientText.jsx'
import Queue from './views/Queue.jsx'
import Posted from './views/Posted.jsx'
import Input from './views/Input.jsx'
import Settings from './views/Settings.jsx'
import BottomNav from './components/BottomNav.jsx'

export default function App() {
  const [view, setView] = useState('queue')

  const VIEW_TITLES = {
    queue: 'Queue',
    posted: 'Posted',
    input: "What's on your mind",
    settings: 'System',
  }

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg:        #060611;
          --surface:   #0d1117;
          --surface2:  #111827;
          --surface3:  #1a2235;
          --border:    #1e2d45;
          --border2:   #243350;
          --accent:    #6366f1;
          --accent2:   #818cf8;
          --purple:    #8b5cf6;
          --cyan:      #06b6d4;
          --green:     #10b981;
          --amber:     #f59e0b;
          --red:       #ef4444;
          --text:      #f1f5f9;
          --text2:     #94a3b8;
          --text3:     #475569;
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
          background: linear-gradient(to bottom, rgba(6,6,17,0.95) 80%, transparent);
          backdrop-filter: blur(8px);
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

        /* Cards */
        .card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 18px;
          margin-bottom: 12px;
          transition: border-color 0.2s;
        }
        .card:hover { border-color: var(--border2); }

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
          background: linear-gradient(135deg, var(--accent), var(--purple));
          color: #fff;
          box-shadow: 0 0 20px rgba(99,102,241,0.25);
        }
        .btn-primary:hover:not(:disabled) {
          box-shadow: 0 0 30px rgba(99,102,241,0.4);
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
          background: var(--surface2);
          color: var(--text2);
          border: 1px solid var(--border);
        }
        .btn-ghost:hover:not(:disabled) { border-color: var(--border2); color: var(--text); }

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
        }
        .badge-draft     { background: #1e2d45; color: #94a3b8; border: 1px solid #243350; }
        .badge-approved  { background: #022c22; color: #6ee7b7; border: 1px solid #065f46; }
        .badge-scheduled { background: #1e3a5f; color: #93c5fd; border: 1px solid #1e4080; }
        .badge-pending   { background: #451a03; color: #fcd34d; border: 1px solid #78350f; }
        .badge-posted    { background: #1a2e1a; color: #86efac; border: 1px solid #166534; }
        .badge-rejected  { background: #3b0a0a; color: #fca5a5; border: 1px solid #7f1d1d; }

        /* Divider */
        .divider { border: none; border-top: 1px solid var(--border); margin: 14px 0; }

        /* Empty state */
        .empty {
          text-align: center;
          padding: 64px 24px;
          color: var(--text3);
        }
        .empty-icon { font-size: 48px; margin-bottom: 16px; filter: grayscale(0.3); }
        .empty-text { font-size: 17px; font-weight: 600; color: var(--text2); margin-bottom: 6px; }
        .empty-sub { font-size: 14px; line-height: 1.6; }

        /* Spinner */
        .spinner {
          width: 28px; height: 28px;
          border: 2px solid var(--border);
          border-top-color: var(--accent);
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
          background: var(--surface2);
          border: 1px solid var(--border2);
          color: var(--text);
          padding: 11px 22px;
          border-radius: 99px;
          font-size: 14px;
          font-weight: 500;
          z-index: 200;
          white-space: nowrap;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
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
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 10px;
          color: var(--text);
          font-family: var(--sans);
          font-size: 16px;
          padding: 13px 16px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        input:focus, textarea:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
        }
        textarea { resize: vertical; min-height: 130px; line-height: 1.65; }
        label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: var(--text2);
          margin-bottom: 7px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        /* Score ring */
        .score-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #1e1b4b;
          border: 1px solid rgba(99,102,241,0.3);
          padding: 3px 10px;
          border-radius: 99px;
          font-family: var(--mono);
          font-size: 12px;
          color: var(--accent2);
        }
        .score-badge.high { background: #022c22; border-color: rgba(16,185,129,0.3); color: #6ee7b7; }

        /* Row of action buttons */
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
              <GradientText from="#818cf8" via="#c084fc" to="#60a5fa">
                {VIEW_TITLES[view]}
              </GradientText>
            </span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text3)', letterSpacing: '0.08em' }}>
              LIBERO
            </span>
          </div>

          {view === 'queue'    && <Queue />}
          {view === 'posted'   && <Posted />}
          {view === 'input'    && <Input />}
          {view === 'settings' && <Settings />}
        </main>
        <BottomNav active={view} onChange={setView} />
      </AuroraBackground>
    </>
  )
}
