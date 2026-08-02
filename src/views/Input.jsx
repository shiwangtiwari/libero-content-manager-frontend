import { useState } from 'react'
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
      setTimeout(() => setDone(false), 3000)
    } catch {
      alert('Failed to save. Is Railway running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        .input-header {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text3);
          margin-bottom: 4px;
          padding-top: 8px;
        }
        .input-sub {
          font-size: 14px;
          color: var(--text2);
          margin-bottom: 20px;
          line-height: 1.5;
        }
        .input-area {
          margin-bottom: 12px;
        }
        .input-area textarea {
          font-size: 16px;
          min-height: 150px;
        }
        .input-hint {
          font-size: 12px;
          color: var(--text3);
          margin-top: 6px;
        }
        .input-success {
          background: #022c22;
          border: 1px solid var(--green);
          color: var(--green);
          border-radius: 8px;
          padding: 12px 16px;
          font-size: 14px;
          font-weight: 500;
          margin-top: 12px;
          text-align: center;
        }
        .char-count {
          text-align: right;
          font-size: 12px;
          color: var(--text3);
          font-family: var(--mono);
          margin-top: 4px;
        }
      `}</style>

      <div className="input-header">What's on your mind?</div>
      <div className="input-sub">
        Share a thought, experience, or topic. It becomes Priority 1 in the next content cycle — your voice, your story.
      </div>

      <div className="input-area">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="E.g. I just realised that the hardest part of being a PM isn't saying no — it's explaining why..."
          maxLength={500}
          autoFocus
        />
        <div className="char-count">{text.length}/500</div>
        <div className="input-hint">
          This is saved to your content signals, same as sending a message to @libero_content_manager_bot
        </div>
      </div>

      <button
        className="btn btn-primary"
        style={{ width: '100%', fontSize: '15px' }}
        onClick={handleSubmit}
        disabled={loading || !text.trim()}
      >
        {loading ? 'Saving…' : 'Save as content signal'}
      </button>

      {done && (
        <div className="input-success">
          ✓ Saved — this will be used as P1 signal in the next generation cycle
        </div>
      )}
    </>
  )
}
