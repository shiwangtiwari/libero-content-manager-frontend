import { useState, useEffect } from 'react'
import ManaFlow from '../bits/ManaFlow.jsx'
import { getProfile, addBubble, saveProfile } from '../api/client.js'

export default function Profile() {
  const [bubbles, setBubbles] = useState([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [editId, setEditId] = useState(null)
  const [newLabel, setNewLabel] = useState('')
  const [newContent, setNewContent] = useState('')
  const [toast, setToast] = useState(null)

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2200) }

  useEffect(() => {
    getProfile()
      .then(data => setBubbles(data.bubbles || []))
      .catch(() => showToast('Could not load profile'))
      .finally(() => setLoading(false))
  }, [])

  const handleAdd = async () => {
    if (!newLabel.trim() || !newContent.trim()) {
      showToast('Both label and content are required')
      return
    }
    setAdding(true)
    try {
      const res = await addBubble(newLabel.trim(), newContent.trim())
      setBubbles(prev => [...prev, res.bubble])
      setNewLabel('')
      setNewContent('')
      setShowAdd(false)
      showToast('Bubble added')
    } catch {
      showToast('Failed to add bubble')
    } finally { setAdding(false) }
  }

  const handleEditSave = async (id) => {
    const bubble = bubbles.find(b => b.id === id)
    if (!bubble) return
    setSaving(true)
    try {
      const updated = bubbles.map(b => b.id === id
        ? { ...b, label: bubble.label, content: bubble.content }
        : b
      )
      await saveProfile(updated)
      setBubbles(updated)
      setEditId(null)
      showToast('Saved')
    } catch { showToast('Save failed') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Remove this bubble from your profile?')) return
    const updated = bubbles.filter(b => b.id !== id)
    try {
      await saveProfile(updated)
      setBubbles(updated)
      showToast('Removed')
    } catch { showToast('Remove failed') }
  }

  const updateBubbleLocal = (id, field, value) => {
    setBubbles(prev => prev.map(b => b.id === id ? { ...b, [field]: value } : b))
  }

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 60 }}>
      <div className="spinner" />
    </div>
  )

  return (
    <>
      <style>{`
        .profile-intro {
          font-family: var(--mono);
          font-size: 11px;
          color: rgba(56,189,248,0.4);
          letter-spacing: 0.1em;
          text-align: center;
          padding: 6px 0 20px;
          line-height: 1.8;
        }

        .bubble-wrap { margin-bottom: 10px; }

        .bubble-inner { padding: 16px 18px; }

        .bubble-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .bubble-label {
          font-family: var(--mono);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: #38bdf8;
          text-transform: uppercase;
        }
        .bubble-label-input {
          font-family: var(--mono);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #38bdf8;
          text-transform: uppercase;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(56,189,248,0.3);
          border-radius: 0;
          padding: 2px 0;
          width: auto;
          max-width: 160px;
          outline: none;
          box-shadow: none;
        }
        .bubble-label-input:focus { border-bottom-color: #38bdf8; box-shadow: none; }

        .bubble-content {
          font-size: 14px;
          line-height: 1.7;
          color: var(--text2);
        }
        .bubble-content-input {
          font-size: 14px;
          line-height: 1.7;
          color: var(--text);
          background: rgba(56,189,248,0.04);
          border-color: rgba(56,189,248,0.15);
          resize: vertical;
          min-height: 80px;
        }
        .bubble-content-input:focus {
          border-color: rgba(56,189,248,0.4);
          box-shadow: 0 0 0 2px rgba(56,189,248,0.08);
        }

        .bubble-actions {
          display: flex;
          gap: 8px;
          margin-top: 12px;
        }
        .bubble-btn {
          background: none;
          border: 1px solid rgba(56,189,248,0.15);
          color: rgba(56,189,248,0.5);
          font-family: var(--mono);
          font-size: 10px;
          letter-spacing: 0.08em;
          padding: 5px 12px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s;
          -webkit-tap-highlight-color: transparent;
        }
        .bubble-btn:hover { border-color: rgba(56,189,248,0.4); color: #38bdf8; }
        .bubble-btn.save  { border-color: rgba(56,189,248,0.4); color: #38bdf8; }
        .bubble-btn.save:hover { background: rgba(56,189,248,0.1); }
        .bubble-btn.del   { border-color: rgba(239,68,68,0.2); color: rgba(239,68,68,0.4); }
        .bubble-btn.del:hover { border-color: rgba(239,68,68,0.5); color: #f87171; }

        /* Add bubble panel */
        .add-panel {
          margin-bottom: 12px;
          padding: 18px;
        }
        .add-panel-title {
          font-family: var(--mono);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: rgba(56,189,248,0.6);
          margin-bottom: 14px;
        }
        .add-panel input, .add-panel textarea {
          margin-bottom: 10px;
          background: rgba(56,189,248,0.04);
          border-color: rgba(56,189,248,0.15);
        }
        .add-panel input:focus, .add-panel textarea:focus {
          border-color: rgba(56,189,248,0.4);
          box-shadow: 0 0 0 2px rgba(56,189,248,0.08);
        }
        .add-panel-actions { display: flex; gap: 8px; }

        .add-trigger {
          width: 100%;
          background: rgba(56,189,248,0.04);
          border: 1px dashed rgba(56,189,248,0.2);
          border-radius: 12px;
          color: rgba(56,189,248,0.45);
          font-family: var(--mono);
          font-size: 12px;
          letter-spacing: 0.08em;
          padding: 16px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 24px;
          -webkit-tap-highlight-color: transparent;
        }
        .add-trigger:hover { border-color: rgba(56,189,248,0.4); color: #38bdf8; background: rgba(56,189,248,0.07); }

        .profile-footer {
          text-align: center;
          font-family: var(--mono);
          font-size: 10px;
          color: rgba(56,189,248,0.2);
          letter-spacing: 0.1em;
          padding: 8px 0 16px;
        }
      `}</style>

      <div className="profile-intro">
        IDENTITY MODULE<br/>
        {bubbles.length} CONTEXT VECTORS LOADED<br/>
        INJECTED INTO EVERY CONTENT GENERATION CALL
      </div>

      {/* Existing bubbles */}
      {bubbles.map(b => (
        <div key={b.id} className="bubble-wrap">
          <ManaFlow pulse>
            <div className="bubble-inner">
              <div className="bubble-label-row">
                {editId === b.id ? (
                  <input
                    className="bubble-label-input"
                    value={b.label}
                    onChange={e => updateBubbleLocal(b.id, 'label', e.target.value)}
                    placeholder="Label"
                  />
                ) : (
                  <span className="bubble-label">{b.label}</span>
                )}
              </div>

              {editId === b.id ? (
                <textarea
                  className="bubble-content-input"
                  value={b.content}
                  onChange={e => updateBubbleLocal(b.id, 'content', e.target.value)}
                  rows={3}
                />
              ) : (
                <div className="bubble-content">{b.content}</div>
              )}

              <div className="bubble-actions">
                {editId === b.id ? (
                  <>
                    <button className="bubble-btn save" onClick={() => handleEditSave(b.id)} disabled={saving}>
                      {saving ? '···' : 'SAVE'}
                    </button>
                    <button className="bubble-btn" onClick={() => setEditId(null)}>CANCEL</button>
                  </>
                ) : (
                  <>
                    <button className="bubble-btn" onClick={() => setEditId(b.id)}>EDIT</button>
                    <button className="bubble-btn del" onClick={() => handleDelete(b.id)}>REMOVE</button>
                  </>
                )}
              </div>
            </div>
          </ManaFlow>
        </div>
      ))}

      {/* Add new bubble */}
      {showAdd ? (
        <ManaFlow dim>
          <div className="add-panel">
            <div className="add-panel-title">+ ADD CONTEXT VECTOR</div>
            <input
              placeholder="Label (e.g. My values)"
              value={newLabel}
              onChange={e => setNewLabel(e.target.value)}
            />
            <textarea
              placeholder="Write anything about yourself — your views, experiences, preferences, how you see the world..."
              value={newContent}
              onChange={e => setNewContent(e.target.value)}
              rows={4}
            />
            <div className="add-panel-actions">
              <button className="btn btn-primary" onClick={handleAdd} disabled={adding} style={{ flex: 1, fontSize: 13 }}>
                {adding ? '···' : 'Add Bubble'}
              </button>
              <button className="btn btn-ghost" onClick={() => { setShowAdd(false); setNewLabel(''); setNewContent('') }} style={{ fontSize: 13 }}>
                Cancel
              </button>
            </div>
          </div>
        </ManaFlow>
      ) : (
        <button className="add-trigger" onClick={() => setShowAdd(true)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          ADD CONTEXT VECTOR
        </button>
      )}

      <div className="profile-footer">
        CHANGES TAKE EFFECT ON NEXT CONTENT GENERATION
      </div>

      {toast && <div className="toast">{toast}</div>}
    </>
  )
}
