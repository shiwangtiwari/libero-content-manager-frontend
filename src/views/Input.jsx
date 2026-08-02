import React, { useState } from 'react'
import { submitInput } from '../api/client.js'

const s = {
  page: { padding: '16px 16px 100px' },
  title: { fontSize: '20px', fontWeight: '700', color: '#f0f0f0', marginBottom: '6px' },
  subtitle: { fontSize: '14px', color: '#6b7280', marginBottom: '20px', lineHeight: '1.5' },
  textarea: {
    width: '100%',
    background: '#161616',
    border: '1px solid #333',
    borderRadius: '12px',
    color: '#e5e7eb',
    fontSize: '16px',
    lineHeight: '1.6',
    padding: '14px',
    resize: 'vertical',
    minHeight: '140px',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  btnRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '12px',
  },
  submitBtn: (disabled) => ({
    background: disabled ? '#1f2937' : '#1e3a5f',
    color: disabled ? '#4b5563' : '#60a5fa',
    border: `1px solid ${disabled ? '#374151' : '#1d4ed8'}`,
    padding: '12px 24px',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: disabled ? 'not-allowed' : 'pointer',
    minHeight: '44px',
    transition: 'all 0.2s',
  }),
  success: {
    background: '#064e3b',
    border: '1px solid #059669',
    borderRadius: '10px',
    padding: '14px 16px',
    color: '#34d399',
    fontSize: '14px',
    marginTop: '16px',
    lineHeight: '1.5',
  },
  error: {
    background: '#4b1111',
    border: '1px solid #dc2626',
    borderRadius: '10px',
    padding: '14px 16px',
    color: '#f87171',
    fontSize: '14px',
    marginTop: '16px',
  },
  hint: {
    marginTop: '24px',
    background: '#1a1a1a',
    border: '1px solid #252525',
    borderRadius: '10px',
    padding: '14px 16px',
  },
  hintTitle: { fontSize: '13px', color: '#9ca3af', fontWeight: '600', marginBottom: '8px' },
  hintList: { fontSize: '13px', color: '#6b7280', lineHeight: '1.8', paddingLeft: '16px' },
}

export default function Input() {
  const [text, setText] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!text.trim()) return
    setLoading(true)
    setError(null)
    try {
      await submitInput(text.trim())
      setSubmitted(true)
      setText('')
      setTimeout(() => setSubmitted(false), 5000)
    } catch (e) {
      setError('Failed to save. Check backend connection.')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={s.page}>
      <h1 style={s.title}>What's on your mind?</h1>
      <p style={s.subtitle}>
        This becomes Priority 1 content signal — highest weight in the next generation cycle.
        Also works via Telegram: just send any message to the bot.
      </p>

      <textarea
        style={s.textarea}
        placeholder="A thought, a take, something you want to write about…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
      />

      <div style={s.btnRow}>
        <button
          style={s.submitBtn(!text.trim() || loading)}
          onClick={handleSubmit}
          disabled={!text.trim() || loading}
        >
          {loading ? 'Saving…' : 'Save Signal'}
        </button>
      </div>

      {submitted && (
        <div style={s.success}>
          ✅ Saved as Priority 1 content signal. This will shape the next LinkedIn post.
        </div>
      )}

      {error && <div style={s.error}>{error}</div>}

      <div style={s.hint}>
        <div style={s.hintTitle}>Examples of useful signals</div>
        <ul style={s.hintList}>
          <li>A PM lesson from something that happened this week</li>
          <li>A framework that changed how you think about product</li>
          <li>Something the NextLeap program taught you</li>
          <li>A pattern you've noticed in dev-to-PM transitions</li>
          <li>A contrarian take on something in the PM world</li>
        </ul>
      </div>
    </div>
  )
}
