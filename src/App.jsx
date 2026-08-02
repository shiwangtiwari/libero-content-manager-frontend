import { useState } from 'react'
import Queue from './views/Queue.jsx'
import Posted from './views/Posted.jsx'
import Settings from './views/Settings.jsx'
import Input from './views/Input.jsx'
import BottomNav from './components/BottomNav.jsx'

const VIEWS = ['queue', 'posted', 'input', 'settings']

export default function App() {
  const [view, setView] = useState('queue')

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg:        #0b1120;
          --surface:   #111827;
          --surface2:  #1a2235;
          --border:    #1e2d45;
          --accent:    #6366f1;
          --accent2:   #818cf8;
          --green:     #10b981;
          --amber:     #f59e0b;
          --red:       #ef4444;
          --text:      #f1f5f9;
          --text2:     #94a3b8;
          --text3:     #475569;
          --mono:      'JetBrains Mono', monospace;
          --sans:      'Inter', system-ui, sans-serif;
          --nav-h:     64px;
        }

        html, body {
          background: var(--bg);
          color: var(--text);
          font-family: var(--sans);
          font-size: 16px;
          line-height: 1.5;
          min-height: 100dvh;
          -webkit-font-smoothing: antialiased;
        }

        #root {
          display: flex;
          flex-direction: column;
          min-height: 100dvh;
        }

        .page {
          flex: 1;
          overflow-y: auto;
          padding: 16px 16px calc(var(--nav-h) + 16px);
          max-width: 680px;
          margin: 0 auto;
          width: 100%;
        }

        .page-title {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text3);
          margin-bottom: 16px;
          padding-top: 8px;
        }

        .card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 12px;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          min-height: 44px;
          padding: 0 16px;
          border-radius: 8px;
          border: none;
          font-family: var(--sans);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.15s, transform 0.1s;
          -webkit-tap-highlight-color: transparent;
        }
        .btn:active { transform: scale(0.97); opacity: 0.85; }
        .btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

        .btn-primary  { background: var(--accent);  color: #fff; }
        .btn-green    { background: var(--green);   color: #fff; }
        .btn-red      { background: var(--red);     color: #fff; }
        .btn-ghost    { background: var(--surface2); color: var(--text2); border: 1px solid var(--border); }

        .row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .row .btn { flex: 1; min-width: 80px; }

        .badge {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 99px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .badge-draft     { background: #1e2d45; color: #94a3b8; }
        .badge-approved  { background: #064e3b; color: #6ee7b7; }
        .badge-scheduled { background: #1e3a5f; color: #93c5fd; }
        .badge-pending   { background: #451a03; color: #fcd34d; }
        .badge-posted    { background: #1a2e1a; color: #86efac; }
        .badge-rejected  { background: #3b0a0a; color: #fca5a5; }

        .meta {
          font-size: 13px;
          color: var(--text2);
          margin-bottom: 8px;
        }
        .meta strong { color: var(--text); font-weight: 600; }

        .score {
          font-family: var(--mono);
          font-size: 12px;
          color: var(--accent2);
        }

        .divider {
          border: none;
          border-top: 1px solid var(--border);
          margin: 12px 0;
        }

        .empty {
          text-align: center;
          padding: 48px 16px;
          color: var(--text3);
        }
        .empty-icon { font-size: 40px; margin-bottom: 12px; }
        .empty-text { font-size: 15px; margin-bottom: 4px; color: var(--text2); }
        .empty-sub  { font-size: 13px; }

        .spinner {
          width: 24px; height: 24px;
          border: 2px solid var(--border);
          border-top-color: var(--accent);
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          margin: 48px auto;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .toast {
          position: fixed;
          bottom: calc(var(--nav-h) + 16px);
          left: 50%;
          transform: translateX(-50%);
          background: var(--surface2);
          border: 1px solid var(--border);
          color: var(--text);
          padding: 10px 20px;
          border-radius: 99px;
          font-size: 14px;
          font-weight: 500;
          z-index: 100;
          white-space: nowrap;
          animation: fadeup 0.2s ease;
        }
        @keyframes fadeup {
          from { opacity: 0; transform: translateX(-50%) translateY(8px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        input, textarea {
          width: 100%;
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text);
          font-family: var(--sans);
          font-size: 16px;
          padding: 12px 14px;
          outline: none;
          transition: border-color 0.15s;
        }
        input:focus, textarea:focus {
          border-color: var(--accent);
        }
        textarea { resize: vertical; min-height: 120px; line-height: 1.6; }

        label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: var(--text2);
          margin-bottom: 6px;
        }

        @media (min-width: 640px) {
          .page { padding: 24px 24px calc(var(--nav-h) + 24px); }
        }
      `}</style>

      <main className="page">
        {view === 'queue'    && <Queue />}
        {view === 'posted'   && <Posted />}
        {view === 'input'    && <Input />}
        {view === 'settings' && <Settings />}
      </main>

      <BottomNav active={view} onChange={setView} />
    </>
  )
}
