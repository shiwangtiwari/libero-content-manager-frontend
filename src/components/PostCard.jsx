import { useState } from 'react'
import ManaFlow from '../bits/ManaFlow.jsx'
import SignalCard from './SignalCard.jsx'
import { approvePost, rejectPost, editPost } from '../api/client.js'

const STATUS_BADGE = {
  draft:              'badge-draft',
  approved:           'badge-approved',
  scheduled:          'badge-scheduled',
  pending_reschedule: 'badge-pending',
  posted:             'badge-posted',
  rejected:           'badge-rejected',
  failed:             'badge-rejected',
  expired:            'badge-rejected',
}
const STATUS_LABEL = {
  draft:              'Draft',
  approved:           'Approved',
  scheduled:          'Scheduled',
  pending_reschedule: 'Rescheduled',
  posted:             'Posted',
  rejected:           'Rejected',
  failed:             'Failed',
  expired:            'Expired',
}

function humanTime(str) {
  if (!str) return '—'
  try {
    const [d, t] = str.split(' ')
    const dt = new Date(d + 'T' + (t || '00:00') + ':00+05:30')
    return dt.toLocaleDateString('en-IN', {
      weekday: 'short', day: 'numeric', month: 'short',
      hour: '2-digit', minute: '2-digit', hour12: true,
      timeZone: 'Asia/Kolkata',
    })
  } catch { return str }
}

export default function PostCard({ post, onRefresh }) {
  // ── Derive content FIRST before any hooks ──────────────────────────────────
  // This was the bug: content was derived below the hooks so useState(content)
  // received undefined on first render, making the textarea uncontrolled.
  const content = post.content || ''
  const preview = content.length > 200 ? content.slice(0, 200) + '…' : content

  // ── Hooks ───────────────────────────────────────────────────────────────────
  const [expanded, setExpanded]     = useState(false)
  const [loading, setLoading]       = useState(null)
  const [toast, setToast]           = useState(null)
  const [editing, setEditing]       = useState(false)
  const [editContent, setEditContent] = useState(content)  // ← now defined
  const [savingEdit, setSavingEdit] = useState(false)

  // ── Derived state ────────────────────────────────────────────────────────────
  const isApproved  = post.status === 'approved'
  const canApprove  = ['draft', 'pending_reschedule'].includes(post.status)
  const canReject   = ['draft', 'approved', 'pending_reschedule'].includes(post.status)
  const canEdit     = post.status !== 'posted' && post.status !== 'rejected' && post.status !== 'expired'
  const score       = post.viral_score || 0
  const scoreHigh   = score >= 70
  const priority    = post.signal_card?.primary_signal === 'telegram_input' ? 'P1'
                    : post.signal_card?.primary_signal === 'linkedin_trending' ? 'P2' : 'P3'

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2800) }

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleSaveEdit = async () => {
    const trimmed = editContent.trim()
    if (!trimmed) { showToast('Content cannot be empty'); return }
    if (trimmed.length > 3000) {
      showToast(`Too long: ${trimmed.length}/3000 chars — shorten by ${trimmed.length - 3000}`)
      return
    }
    setSavingEdit(true)
    try {
      await editPost(post.id, trimmed)
      showToast('Saved')
      setEditing(false)
      onRefresh()
    } catch (e) {
      const detail = e?.response?.data?.detail || e?.message || 'Unknown error'
      showToast('Save failed — ' + detail)
    } finally {
      setSavingEdit(false)
    }
  }

  const handleApprove = async () => {
    setLoading('approve')
    try {
      await approvePost(post.id)
      showToast('Confirmed')
      onRefresh()
    } catch (e) {
      showToast(e?.response?.data?.detail || 'Approve failed')
    } finally { setLoading(null) }
  }

  const handleReject = async () => {
    if (!confirm('Abandon this draft? It will be discarded.')) return
    setLoading('reject')
    try {
      await rejectPost(post.id)
      showToast('Abandoned')
      onRefresh()
    } catch (e) {
      showToast(e?.response?.data?.detail || 'Reject failed')
    } finally { setLoading(null) }
  }

  const handleStartEdit = () => {
    setEditContent(content)  // reset to latest saved content
    setEditing(true)
  }

  const handleCancelEdit = () => {
    setEditContent(content)
    setEditing(false)
  }

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        .pc-wrap { margin-bottom: 12px; }
        .pc-inner { padding: 18px; }

        .pc-header {
          display: flex; align-items: flex-start;
          justify-content: space-between; gap: 10px; margin-bottom: 12px;
        }
        .pc-header-left { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .pc-time { font-size: 12px; color: var(--text3); white-space: nowrap; font-family: var(--mono); }

        .pc-content {
          font-size: 15px; line-height: 1.7; color: var(--text);
          white-space: pre-wrap; word-break: break-word; margin-bottom: 10px;
        }
        .pc-show-more {
          background: none; border: none; color: var(--cyan); font-size: 13px;
          font-weight: 600; cursor: pointer; padding: 0; margin-bottom: 12px;
          display: block; -webkit-tap-highlight-color: transparent;
          letter-spacing: 0.05em; font-family: var(--mono);
        }

        /* ── Edit area ── */
        .pc-edit-area {
          margin-bottom: 12px;
        }
        .pc-edit-textarea {
          width: 100%;
          min-height: 240px;
          background: rgba(56,189,248,0.04);
          border: 1px solid rgba(56,189,248,0.3);
          border-radius: 10px;
          color: var(--text);
          font-family: var(--sans);
          font-size: 15px;
          line-height: 1.7;
          padding: 14px;
          resize: vertical;
          outline: none;
          box-shadow: 0 0 0 3px rgba(56,189,248,0.06);
          margin-bottom: 8px;
          display: block;
        }
        .pc-edit-textarea:focus {
          border-color: rgba(56,189,248,0.5);
          box-shadow: 0 0 0 3px rgba(56,189,248,0.10);
        }
        .pc-edit-meta {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 10px;
        }
        .pc-char-count {
          font-family: var(--mono); font-size: 11px;
          color: rgba(56,189,248,0.35);
        }
        .pc-char-count.over { color: #f87171; }
        .pc-edit-btns { display: flex; gap: 8px; }

        /* ── Image placeholder ── */
        .pc-no-image {
          width: 100%; border-radius: 10px; margin-bottom: 14px;
          background: rgba(56,189,248,0.03);
          border: 1px dashed rgba(56,189,248,0.15);
          display: flex; align-items: center; justify-content: center;
          color: var(--text3); font-size: 13px; gap: 8px;
          padding: 20px; min-height: 72px;
        }
        .pc-image {
          width: 100%; border-radius: 10px; margin-bottom: 14px;
          display: block; object-fit: cover; max-height: 260px;
          border: 1px solid rgba(56,189,248,0.15);
        }

        /* ── Edit trigger button — full width, clearly visible ── */
        .pc-edit-trigger {
          width: 100%;
          background: rgba(56,189,248,0.03);
          border: 1px solid rgba(56,189,248,0.15);
          border-radius: 8px;
          color: rgba(56,189,248,0.45);
          font-family: var(--mono);
          font-size: 11px;
          letter-spacing: 0.1em;
          padding: 10px;
          cursor: pointer;
          transition: all 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 12px;
          -webkit-tap-highlight-color: transparent;
        }
        .pc-edit-trigger:hover, .pc-edit-trigger:active {
          border-color: rgba(56,189,248,0.4);
          color: #38bdf8;
          background: rgba(56,189,248,0.07);
        }

        /* ── Actions ── */
        .pc-actions { display: flex; gap: 8px; }
        .pc-actions .btn { flex: 1; font-size: 13px; min-height: 44px; letter-spacing: 0.04em; }

        .btn-confirm {
          background: linear-gradient(135deg, rgba(14,165,233,0.15), rgba(56,189,248,0.1));
          color: #38bdf8; border: 1px solid rgba(56,189,248,0.35);
          box-shadow: 0 0 14px rgba(56,189,248,0.08);
          transition: all 0.2s; position: relative; overflow: hidden;
        }
        .btn-confirm:hover:not(:disabled) {
          border-color: rgba(56,189,248,0.6);
          box-shadow: 0 0 24px rgba(56,189,248,0.2);
          color: #7dd3fc;
        }
        .btn-confirm:active:not(:disabled) { transform: scale(0.97); }

        .btn-abandon {
          background: linear-gradient(135deg, rgba(239,68,68,0.1), rgba(220,38,38,0.06));
          color: rgba(252,165,165,0.7); border: 1px solid rgba(239,68,68,0.2);
          transition: all 0.2s;
        }
        .btn-abandon:hover:not(:disabled) {
          border-color: rgba(239,68,68,0.4); color: #fca5a5;
          box-shadow: 0 0 16px rgba(239,68,68,0.1);
        }
        .btn-abandon:active:not(:disabled) { transform: scale(0.97); }

        .btn-sys {
          background: none; border: 1px solid rgba(56,189,248,0.15);
          color: rgba(56,189,248,0.5); font-family: var(--mono);
          font-size: 10px; letter-spacing: 0.08em;
          padding: 5px 12px; border-radius: 6px; cursor: pointer;
          transition: all 0.15s; -webkit-tap-highlight-color: transparent;
        }
        .btn-sys:hover { border-color: rgba(56,189,248,0.4); color: #38bdf8; }
        .btn-sys.save { border-color: rgba(56,189,248,0.4); color: #38bdf8; }
        .btn-sys.save:hover { background: rgba(56,189,248,0.1); }

        /* ── Footer ── */
        .pc-footer {
          display: flex; align-items: center;
          justify-content: space-between; margin-top: 14px;
        }
        .pc-id {
          font-family: var(--mono); font-size: 11px;
          color: rgba(56,189,248,0.25); letter-spacing: 0.08em;
        }

        /* ── Status badge overrides ── */
        .badge-approved {
          background: rgba(56,189,248,0.1); color: #38bdf8;
          border: 1px solid rgba(56,189,248,0.3);
        }
        .pc-approved-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #38bdf8; display: inline-block;
          animation: pulse-ring 2s infinite; box-shadow: 0 0 4px #38bdf8;
          margin-right: 5px;
        }

        /* ── Score badge ── */
        .score-badge {
          display: inline-flex; align-items: center; gap: 5px;
          background: rgba(14,165,233,0.08); border: 1px solid rgba(56,189,248,0.2);
          padding: 3px 10px; border-radius: 99px;
          font-family: var(--mono); font-size: 11px; color: rgba(56,189,248,0.7);
        }
        .score-badge.high {
          background: rgba(16,185,129,0.08); border-color: rgba(16,185,129,0.3); color: #6ee7b7;
        }

        /* ── Toast ── */
        .local-toast {
          position: fixed; bottom: calc(var(--nav-h) + 16px);
          left: 50%; transform: translateX(-50%);
          background: rgba(8,13,26,0.96); border: 1px solid rgba(56,189,248,0.3);
          color: #38bdf8; padding: 10px 20px; border-radius: 99px;
          font-size: 13px; font-weight: 600; font-family: var(--mono);
          letter-spacing: 0.06em; z-index: 200; white-space: nowrap;
          pointer-events: none; box-shadow: 0 0 20px rgba(56,189,248,0.15);
          animation: toast-in 0.2s ease;
        }

        @keyframes pulse-ring {
          0%, 100% { box-shadow: 0 0 0 0 rgba(56,189,248,0.4); }
          50%       { box-shadow: 0 0 0 4px rgba(56,189,248,0); }
        }
        @keyframes toast-in {
          from { opacity:0; transform:translateX(-50%) translateY(10px) scale(0.95); }
          to   { opacity:1; transform:translateX(-50%) translateY(0) scale(1); }
        }
      `}</style>

      <div className="pc-wrap">
        <ManaFlow active={isApproved} pulse={!isApproved && post.status !== 'posted'}>
          <div className="pc-inner">

            {/* Header */}
            <div className="pc-header">
              <div className="pc-header-left">
                <span className={`badge ${STATUS_BADGE[post.status] || 'badge-draft'}`}>
                  {isApproved && <span className="pc-approved-dot" />}
                  {STATUS_LABEL[post.status] || post.status}
                </span>
                {score > 0 && (
                  <span className={`score-badge${scoreHigh ? ' high' : ''}`}>
                    {scoreHigh ? '◈' : '◇'} {score}/100
                  </span>
                )}
              </div>
              <span className="pc-time">
                {humanTime(post.scheduled_time || post.posted_time)}
              </span>
            </div>

            {/* Content or Edit Textarea */}
            {editing ? (
              <div className="pc-edit-area">
                <textarea
                  className="pc-edit-textarea"
                  value={editContent}
                  onChange={e => setEditContent(e.target.value)}
                  placeholder="Edit your post content here..."
                  autoFocus
                />
                <div className="pc-edit-meta">
                  <span className={`pc-char-count${editContent.length > 3000 ? ' over' : ''}`}>
                    {editContent.length} / 3000 chars
                    {editContent.length > 3000 && ` — shorten by ${editContent.length - 3000}`}
                  </span>
                  <div className="pc-edit-btns">
                    <button
                      className="btn-sys save"
                      onClick={handleSaveEdit}
                      disabled={savingEdit || editContent.length > 3000}
                    >
                      {savingEdit ? '···' : 'SAVE'}
                    </button>
                    <button className="btn-sys" onClick={handleCancelEdit}>
                      CANCEL
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="pc-content">{expanded ? content : preview}</div>
                {content.length > 200 && (
                  <button className="pc-show-more" onClick={() => setExpanded(e => !e)}>
                    {expanded ? '[ collapse ]' : '[ expand full post ]'}
                  </button>
                )}
              </>
            )}

            {/* Image */}
            {!editing && (
              post.image_url?.startsWith('https://') ? (
                <img
                  src={post.image_url}
                  alt="Post image"
                  className="pc-image"
                  onError={e => { e.target.style.display = 'none' }}
                />
              ) : (
                <div className="pc-no-image">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="3"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <path d="M21 15l-5-5L5 21"/>
                  </svg>
                  {post.image_url ? 'Image attached' : 'No image — send /generate_image in Telegram'}
                </div>
              )
            )}

            {/* Signal card */}
            {!editing && <SignalCard signalCard={post.signal_card} priority={priority} />}

            {/* EDIT CONTENT button — full width, clearly visible, shown for all editable posts */}
            {canEdit && !editing && (
              <button className="pc-edit-trigger" onClick={handleStartEdit}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                EDIT CONTENT
              </button>
            )}

            {/* Divider */}
            {(canApprove || canReject) && !editing && (
              <hr style={{
                border: 'none',
                borderTop: '1px solid rgba(56,189,248,0.1)',
                margin: '4px 0 12px',
              }} />
            )}

            {/* Approve / Reject */}
            {!editing && (canApprove || canReject) && (
              <div className="pc-actions">
                {canApprove && (
                  <button
                    className="btn btn-confirm"
                    onClick={handleApprove}
                    disabled={loading === 'approve'}
                  >
                    {loading === 'approve' ? '···' : '✓ Confirm'}
                  </button>
                )}
                {canReject && (
                  <button
                    className="btn btn-abandon"
                    onClick={handleReject}
                    disabled={loading === 'reject'}
                  >
                    {loading === 'reject' ? '···' : 'Abandon'}
                  </button>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="pc-footer">
              <span className="pc-id">SYS:{post.id?.slice(0, 8)?.toUpperCase()}</span>
            </div>

          </div>
        </ManaFlow>
      </div>

      {toast && <div className="local-toast">{toast}</div>}
    </>
  )
}
