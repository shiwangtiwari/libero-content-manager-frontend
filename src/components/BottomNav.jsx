export default function BottomNav({ active, onChange }) {
  const tabs = [
    { id: 'queue',    label: 'Queue',    icon: QueueIcon },
    { id: 'posted',   label: 'Posted',   icon: PostedIcon },
    { id: 'input',    label: 'Input',    icon: InputIcon },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ]

  return (
    <>
      <style>{`
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: var(--nav-h);
          background: var(--surface);
          border-top: 1px solid var(--border);
          display: flex;
          z-index: 50;
          padding-bottom: env(safe-area-inset-bottom);
        }
        .nav-tab {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          border: none;
          background: none;
          color: var(--text3);
          cursor: pointer;
          transition: color 0.15s;
          min-height: 44px;
          -webkit-tap-highlight-color: transparent;
          padding: 0;
        }
        .nav-tab.active { color: var(--accent2); }
        .nav-tab svg { width: 22px; height: 22px; }
        .nav-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .nav-dot {
          width: 4px; height: 4px;
          border-radius: 50%;
          background: var(--accent);
          margin-top: 2px;
        }
      `}</style>
      <nav className="bottom-nav">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`nav-tab${active === id ? ' active' : ''}`}
            onClick={() => onChange(id)}
            aria-label={label}
          >
            <Icon />
            <span className="nav-label">{label}</span>
            {active === id && <span className="nav-dot" />}
          </button>
        ))}
      </nav>
    </>
  )
}

function QueueIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M3 9h18M9 21V9" />
    </svg>
  )
}

function PostedIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12l2 2 4-4" />
      <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function InputIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  )
}
