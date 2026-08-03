export default function BottomNav({ active, onChange }) {
  const tabs = [
    { id: 'queue',    label: 'Queue',    icon: QueueIcon },
    { id: 'posted',   label: 'Posted',   icon: PostedIcon },
    { id: 'input',    label: 'Write',    icon: InputIcon },
    { id: 'profile',  label: 'Profile',  icon: ProfileIcon },
    { id: 'settings', label: 'System',   icon: SettingsIcon },
  ]

  return (
    <>
      <style>{`
        .bottom-nav {
          position: fixed;
          bottom: 0; left: 0; right: 0;
          height: var(--nav-h);
          background: rgba(8, 13, 26, 0.92);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-top: 1px solid rgba(56, 189, 248, 0.1);
          display: flex;
          z-index: 100;
          padding-bottom: env(safe-area-inset-bottom);
        }
        .nav-tab {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          border: none;
          background: none;
          color: rgba(56,189,248,0.28);
          cursor: pointer;
          transition: color 0.2s;
          min-height: 44px;
          -webkit-tap-highlight-color: transparent;
          padding: 0;
          position: relative;
        }
        .nav-tab.active { color: #38bdf8; }
        .nav-tab svg { width: 20px; height: 20px; transition: transform 0.2s; }
        .nav-tab.active svg { transform: translateY(-1px); filter: drop-shadow(0 0 4px rgba(56,189,248,0.5)); }
        .nav-label {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-family: var(--mono);
          transition: color 0.2s;
        }

        /* Electric top bar instead of pill */
        .nav-indicator {
          position: absolute;
          top: 0; left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 1.5px;
          border-radius: 0 0 2px 2px;
          background: #38bdf8;
          box-shadow: 0 0 8px #38bdf8, 0 0 16px rgba(56,189,248,0.4);
          transition: width 0.25s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s;
          opacity: 0;
        }
        .nav-tab.active .nav-indicator {
          opacity: 1;
          width: 28px;
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
            <span className="nav-indicator" />
            <Icon />
            <span className="nav-label">{label}</span>
          </button>
        ))}
      </nav>
    </>
  )
}

function QueueIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>
    </svg>
  )
}
function PostedIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
      <path d="M22 4L12 14.01l-3-3"/>
    </svg>
  )
}
function InputIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9"/>
      <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </svg>
  )
}
function ProfileIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4"/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>
  )
}
function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
    </svg>
  )
}
