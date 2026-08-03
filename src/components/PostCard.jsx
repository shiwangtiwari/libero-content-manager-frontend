import { useState } from 'react'
import ShineCard from '../bits/ShineCard.jsx'
import SignalCard from './SignalCard.jsx'
import { approvePost, rejectPost } from '../api/client.js'

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
  const [expanded, setExpanded] = useState(false)
  const [loading, setLoading] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500) }

  const handleApprove = async () => {
    setLoading('approve')
    try { await approvePost(post.id); showToast('✅ Approved'); onRefresh() }
    catch (e) { showToast('❌ ' + (e.response?.data?.detail || 'Failed')) }
    finally { setLoading(null) }
  }

  const handleReject = async () => {
    if (!confirm('Reject and discard this post?')) return
    setLoading('reject')
    try { await rejectPost(post.id); showToast('🗑 Rejected'); onRefresh() }
    catch (e) { showToast('❌ ' + (e.response?.data?.detail || 'Failed')) }
    finally { setLoading(null) }
  }

  const content = post.content || ''
  const preview = content.length > 200 ? content.slice(0, 200) + '…' : content
  const isApproved = post.status === 'approved'
  const canApprove = ['draft', 'pending_reschedule'].includes(post.status)
  const canReject = ['draft', 'approved', 'pending_reschedule'].includes(post.status)
  const score = post.viral_score || 0
  const scoreHigh = score >= 70
  const priority = post.signal_card?.primary_signal === 'telegram_input' ? 'P1'
                 : post.signal_card?.primary_signal === 'linkedin_trending' ? 'P2' : 'P3'

  return (
    <>
      <style>{`
        .pc-wrap { margin-bottom: 12px; }
        .pc-inner { padding: 18px; }
        .pc-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 12px;
        }
        .pc-header-left { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .pc-time { font-size: 12px; color: var(--text3); white-space: nowrap; }
        .pc-content {
          font-size: 15px;
          line-height: 1.7;
          color: var(--text);
          white-space: pre-wrap;
          word-break: break-word;
          margin-bottom: 10px;
        }
        .pc-show-more {
          background: none; border: none;
          color: var(--accent2); font-size: 13px; font-weight: 600;
          cursor: pointer; padding: 0; margin-bottom: 12px;
          display: block; -webkit-tap-highlight-color: transparent;
        }
        .pc-image {
          width: 100%; border-radius: 10px; margin-bottom: 14px;
          display: block; object-fit: cover; max-height: 260px;
          border: 1px solid var(--border);
        }
        .pc-no-image {
          width: 100%; border-radius: 10px; margin-bottom: 14px;
          background: var(--surface2); border: 1px dashed var(--border);
          display: flex; align-items: center; justify-content: center;
          color: var(--text3); font-size: 13px; gap: 6px;
          padding: 20px; min-height: 72px;
        }
        .pc-no-image.has-image { border-color: rgba(16,185,129,0.3); color: var(--green); }
        .pc-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 12px; }
        .pc-id { font-family: var(--mono); font-size: 11px; color: var(--text3); }
        .local-toast {
          position: fixed; bottom: calc(var(--nav-h) + 16px);
          left: 50%; transform: translateX(-50%);
          background: var(--surface2); border: 1px solid var(--border2);
          color: var(--text); padding: 10px 20px; border-radius: 99px;
          font-size: 14px; font-weight: 500; z-index: 200;
          white-space: nowrap; pointer-events: none;
          animation: toast-in 0.2s ease;
        }
      `}</style>

      <div className="pc-wrap">
        <ShineCard active={isApproved}>
          <div className="pc-inner">
            <div className="pc-header">
              <div className="pc-header-left">
                <span className={`badge ${STATUS_BADGE[post.status] || 'badge-draft'}`}>
                  {isApproved && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', display: 'inline-block', animation: 'pulse-ring 2s infinite' }} />}
                  {STATUS_LABEL[post.status] || post.status}
                </span>
                {score > 0 && (
                  <span className={`score-badge${scoreHigh ? ' high' : ''}`}>
                    {scoreHigh ? '🔥' : '📊'} {score}/100
                  </span>
                )}
              </div>
              <span className="pc-time">{humanTime(post.scheduled_time || post.posted_time)}</span>
            </div>

            <div className="pc-content">{expanded ? content : preview}</div>
            {content.length > 200 && (
              <button className="pc-show-more" onClick={() => setExpanded(e => !e)}>
                {expanded ? 'Show less ↑' : 'Show more ↓'}
              </button>
            )}

            {post.image_url?.startsWith('https://') ? (
              <img
                src={post.image_url}
                alt="Post image"
                className="pc-image"
                onError={e => { e.target.style.display = 'none' }}
              />
            ) : post.image_url ? (
              <div className="pc-no-image has-image">
                🖼 Image attached
              </div>
            ) : (
              <div className="pc-no-image">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                No image · send /generate_image in Telegram
              </div>
            )}

            <SignalCard signalCard={post.signal_card} priority={priority} />

            {(canApprove || canReject) && (
              <>
                <hr className="divider" />
                <div className="action-row">
                  {canApprove && (
                    <button className="btn btn-green" onClick={handleApprove} disabled={loading === 'approve'}>
                      {loading === 'approve' ? '…' : '✓ Approve'}
                    </button>
                  )}
                  {canReject && (
                    <button className="btn btn-red" onClick={handleReject} disabled={loading === 'reject'}>
                      {loading === 'reject' ? '…' : 'Reject'}
                    </button>
                  )}
                </div>
              </>
            )}

            <div className="pc-footer">
              <span className="pc-id">{post.id?.slice(0, 8)}</span>
            </div>
          </div>
        </ShineCard>
      </div>

      {toast && <div className="local-toast">{toast}</div>}
    </>
  )
}
