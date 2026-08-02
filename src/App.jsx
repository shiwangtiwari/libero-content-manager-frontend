import React, { useState } from 'react'
import BottomNav from './components/BottomNav.jsx'
import Queue from './views/Queue.jsx'
import Posted from './views/Posted.jsx'
import Input from './views/Input.jsx'
import Settings from './views/Settings.jsx'

const VIEWS = {
  queue: Queue,
  posted: Posted,
  input: Input,
  settings: Settings,
}

const s = {
  app: {
    maxWidth: '640px',
    margin: '0 auto',
    minHeight: '100vh',
    position: 'relative',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 16px 0',
  },
  wordmark: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#60a5fa',
    letterSpacing: '-0.5px',
  },
  sub: {
    fontSize: '11px',
    color: '#4b5563',
  },
}

export default function App() {
  const [view, setView] = useState('queue')
  const ActiveView = VIEWS[view] || Queue

  return (
    <div style={s.app}>
      <div style={s.header}>
        <div>
          <div style={s.wordmark}>Libero</div>
          <div style={s.sub}>Autonomous Edition</div>
        </div>
      </div>

      <main>
        <ActiveView />
      </main>

      <BottomNav active={view} onChange={setView} />
    </div>
  )
}
