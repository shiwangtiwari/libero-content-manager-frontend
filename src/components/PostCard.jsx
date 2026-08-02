import { useState } from 'react'
import SignalCard from './SignalCard.jsx'
import { approvePost, rejectPost } from '../api/client.js'

const STATUS_BADGE = {
  draft:             'badge-draft',
  approved:          'badge-approved',
  scheduled:         'badge-scheduled',
  pending_reschedule:'badge-pending',
  posted:            'badge-posted',
  rejected:          'badge-rejected',
  failed:            'badge-rejected',
  expired:           'badge-rejected',
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

function humanTime(isoStr) {
  if (!isoStr) return '—'
  try {
    // Already IST string like "2026-08-04 08:30"
    const [datePart, timePart] = isoStr.split(' ')
    if (!datePart) return isoStr
    const date = new Date(datePart + 'T' + (timePart || '00:00') + ':00+05:30')
    return date.toLocaleDateString('en-IN', {
      weekday: 'short', day: 'numeric', month: 'short',
      hour: '2-digit', minute: '2-digit', hour12: true,
      timeZone: 'Asia/Kolkata',
    })
  } catch { return isoStr }
}

export default function PostCard({ post, onRefresh }) {
  const [expanded, setExpanded] = useState(false)
  const [loading, setLoading] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const handleApprove = async () => {
    setLoading('approve')
    try {
      await approvePost(post.id)
      showToast('✅ Post approved')
      onRefresh()
    } catch (e) {
      showToast('❌ ' + (e.response?.data?.detail || 'Failed'))
    } finally { setLoading(null) }
  }

  const handleReject = async () => {
    if (!confirm('Reject and discard this post?')) return
    setLoading('reject')
    try {
      await rejectPost(post.id)
      showToast('🗑 Post rejected')
      onRefresh()
    } catch (e) {
      showToast('❌ ' + (e.response?.data?.detail || 'Failed'))
    } finally { setLoading(null) }
  }

  const content = post.content || ''
  const preview = content.length > 220 ? content.slice(0, 220) + '…' : content
  const canApprove = ['draft', 'pending_reschedule'].includes(post.status)
  const canReject  = ['draft', 'approved', 'pending_reschedule'].includes(post.status)
  const priority   = post.signal_card?.primary_signal === 'telegram_input' ? 'P1'
                   : post.signal_card?.primary_signal === 'linkedin_trending' ? 'P2'
                   : 'P3'

  return (
    <>
      <style>{`
        .post-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 12px;
        }
        .post-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
          gap: 8px;
        }
        .post-header-left {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .post-time {
          font-size: 12px;
          color: var(--text3);
        }
        .post-score {
          font-family: var(--mono);
          font-size: 11px;
          color: var(--accent2);
          background: #1e1b4b;
          padding: 2px 6px;
          border-radius: 4px;
        }
        .post-content {
          font-size: 15px;
          line-height: 1.65;
          color: var(--text);
          white-space: pre-wrap;
          word-break: break-word;
          margin-bottom: 10px;
        }
        .post-show-more {
          background: none;
          border: none;
          color: var(--accent2);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
          margin-bottom: 10px;
          display: block;
          -webkit-tap-highlight-color: transparent;
        }
        .post-image {
          width: 100%;
          border-radius: 8px;
          margin-bottom: 10px;
          aspect-ratio: 1.91;
          object-fit: cover;
          background: var(--surface2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text3);
          font-size: 13px;
        }
        .post-no-image {
          width: 100%;
          border-radius: 8px;
          margin-bottom: 10px;
          aspect-ratio: 3;
          background: var(--surface2);
          border: 1px dashed var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text3);
          font-size: 13px;
          gap: 6px;
        }
        .post-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .post-actions .btn {
          flex: 1;
          min-width: 70px;
          font-size: 13px;
          padding: 0 10px;
        }
        .post-id {
          font-family: var(--mono);
          font-size: 11px;
          color: var(--text3);
          margin-top: 10px;
        }
        .local-toast {
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
          pointer-events: none;
        }
      `}</style>

      <div className="post-card">
        <div className="post-header">
          <div className="post-header-left">
            <span className={`badge ${STATUS_BADGE[post.status] || 'badge-draft'}`}>
              {STATUS_LABEL[post.status] || post.status}
            </span>
            {post.viral_score != null && (
              <span className="post-score">{post.viral_score}/100</span>
            )}
          </div>
          <span className="post-time">
            {humanTime(post.scheduled_time || post.posted_time)}
          </span>
        </div>

        <div className="post-content">
          {expanded ? content : preview}
        </div>

        {content.length > 220 && (
          <button className="post-show-more" onClick={() => setExpanded(e => !e)}>
            {expanded ? 'Show less' : 'Show more'}
          </button>
        )}

        {post.image_url && post.image_url.startsWith('https://') ? (
          <img
            src={post.image_url}
            alt="Post image"
            style={{ width: '100%', borderRadius: 8, marginBottom: 10, display: 'block', objectFit: 'cover', maxHeight: 280 }}
            onError={e => { e.target.style.display = 'none' }}
          />
        ) : post.image_url ? (
          <div className="post-no-image" style={{ border: '1px solid var(--green)', color: 'var(--green)' }}>
            🖼 Image attached (refresh after re-uploading)
          </div>
        ) : (
          <div className="post-no-image">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
            No image · use /generate_image in Telegram
          </div>
        )}

        <SignalCard signalCard={post.signal_card} priority={priority} />

        {(canApprove || canReject) && (
          <>
            <hr className="divider" />
            <div className="post-actions">
              {canApprove && (
                <button
                  className="btn btn-green"
                  onClick={handleApprove}
                  disabled={loading === 'approve'}
                >
                  {loading === 'approve' ? '…' : '✓ Approve'}
                </button>
              )}
              {canReject && (
                <button
                  className="btn btn-red"
                  onClick={handleReject}
                  disabled={loading === 'reject'}
                >
                  {loading === 'reject' ? '…' : 'Reject'}
                </button>
              )}
            </div>
          </>
        )}

        <div className="post-id">{post.id?.slice(0, 8)}</div>
      </div>

      {toast && <div className="local-toast">{toast}</div>}
    </>
  )
}
