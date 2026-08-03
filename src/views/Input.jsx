import { useState } from 'react'
import BlurFade from '../bits/BlurFade.jsx'
import GradientText from '../bits/GradientText.jsx'
import { submitInput } from '../api/client.js'

export default function Input() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async () => {
    if (!text.trim()) return
    setLoading(true)
    try {
      await submitInput(text.trim())
      setDone(true)
      setText('')
      setTimeout(() => setDone(false), 4000)
    } catch {
      alert('Failed to save. Check Railway is running.')
    } finally {
      setLoading(false)
    }
  }

  const pct = text.length / 500
  const circumference = 2 * Math.PI * 16

  return (
    <>
      <style>{`
        .input-desc {
          font-size: 14px;
          color: var(--text2);
          line-height: 1.65;
          margin-bottom: 24px;
          padding: 14px 16px;
          background: rgba(99,102,241,0.06);
          border: 1px solid rgba(99,102,241,0.15);
          border-radius: 10px;
        }
        .input-examples {
          margin-top: 10px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .input-example {
          font-size: 13px;
          color: var(--text3);
          padding-left: 12px;
          border-left: 2px solid rgba(99,102,241,0.3);
          line-height: 1.5;
        }
        .input-field-wrap { position: relative; margin-bottom: 16px; }
        .input-counter {
          position: absolute;
          bottom: 12px;
          right: 12px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .input-counter-ring { transform: rotate(-90deg); }
        .input-counter-ring circle {
          transition: stroke-dashoffset 0.2s;
          stroke-linecap: round;
        }
        .input-success {
          background: rgba(16,185,129,0.08);
          border: 1px solid rgba(16,185,129,0.25);
          color: var(--green);
          border-radius: 10px;
          padding: 14px 18px;
          font-size: 14px;
          font-weight: 600;
          margin-top: 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          animation: toast-in 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }
        .input-p1-badge {
          display: inline-block;
          background: rgba(99,102,241,0.12);
          border: 1px solid rgba(99,102,241,0.25);
          color: var(--accent2);
          padding: 2px 10px;
          border-radius: 99px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.05em;
        }
      `}</style>

      <BlurFade delay={0}>
        <div className="input-desc">
          <p>Your words become Priority 1 content signals — the highest weight in the system, above LinkedIn trending and gap analysis.</p>
          <div className="input-examples">
            <div className="input-example">A lesson from a real decision this week</div>
            <div className="input-example">Something that surprised you about PM work</div>
            <div className="input-example">A mistake, a win, or a question you're sitting with</div>
          </div>
        </div>
      </BlurFade>

      <BlurFade delay={0.1}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <label style={{ margin: 0 }}>Signal input</label>
          <span className="input-p1-badge">P1 Priority</span>
        </div>
        <div className="input-field-wrap">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="I just realised that the hardest part of being a PM isn't saying no — it's explaining why without losing the relationship..."
            maxLength={500}
            autoFocus
            style={{ paddingBottom: 48 }}
          />
          <div className="input-counter">
            <svg width="36" height="36" className="input-counter-ring" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="none" stroke="var(--border)" strokeWidth="2.5" />
              <circle
                cx="18" cy="18" r="16" fill="none"
                stroke={pct > 0.9 ? 'var(--red)' : 'var(--accent)'}
                strokeWidth="2.5"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - pct)}
              />
            </svg>
          </div>
        </div>
      </BlurFade>

      <BlurFade delay={0.15}>
        <button
          className="btn btn-primary"
          style={{ width: '100%', fontSize: 15, height: 50, borderRadius: 12 }}
          onClick={handleSubmit}
          disabled={loading || !text.trim()}
        >
          {loading ? 'Saving…' : 'Save as content signal →'}
        </button>
      </BlurFade>

      {done && (
        <BlurFade delay={0}>
          <div className="input-success">
            <span>✓</span>
            <span>Saved. Next content generation cycle will use this as P1 signal.</span>
          </div>
        </BlurFade>
      )}
    </>
  )
}
