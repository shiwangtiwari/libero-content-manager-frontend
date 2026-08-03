import { useState } from 'react'
import ManaFlow from '../bits/ManaFlow.jsx'
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
    try { await approvePost(post.id); showToast('✓ Confirmed'); onRefresh() }
    catch (e) { showToast('✗ ' + (e.response?.data?.detail || 'Failed')) }
    finally { setLoading(null) }
  }

  const handleReject = async () => {
    if (!confirm('Abandon this draft? It will be discarded.')) return
    setLoading('reject')
    try { await rejectPost(post.id); showToast('◌ Abandoned'); onRefresh() }
    catch (e) { showToast('✗ ' + (e.response?.data?.detail || 'Failed')) }
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
        .pc-time { font-size: 12px; color: var(--text3); white-space: nowrap; font-family: var(--mono); }
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
          color: var(--cyan); font-size: 13px; font-weight: 600;
          cursor: pointer; padding: 0; margin-bottom: 12px;
          display: block; -webkit-tap-highlight-color: transparent;
          letter-spacing: 0.05em;
        }
        .pc-image {
          width: 100%; border-radius: 10px; margin-bottom: 14px;
          display: block; object-fit: cover; max-height: 260px;
          border: 1px solid rgba(56,189,248,0.15);
        }
        .pc-no-image {
          width: 100%; border-radius: 10px; margin-bottom: 14px;
          background: rgba(56,189,248,0.03);
          border: 1px dashed rgba(56,189,248,0.15);
          display: flex; align-items: center; justify-content: center;
          color: var(--text3); font-size: 13px; gap: 8px;
          padding: 20px; min-height: 72px;
        }
        .pc-no-image.has-image { border-color: rgba(16,185,129,0.3); color: var(--green); }
        .pc-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 12px; }
        .pc-id { font-family: var(--mono); font-size: 11px; color: rgba(56,189,248,0.35); letter-spacing: 0.08em; }

        /* ── Action buttons — system aesthetic ── */
        .pc-actions { display: flex; gap: 8px; }
        .pc-actions .btn { flex: 1; font-size: 13px; min-height: 44px; letter-spacing: 0.04em; }

        .btn-confirm {
          background: linear-gradient(135deg, rgba(14,165,233,0.15), rgba(56,189,248,0.1));
          color: #38bdf8;
          border: 1px solid rgba(56,189,248,0.35);
          box-shadow: 0 0 14px rgba(56,189,248,0.08), inset 0 0 12px rgba(56,189,248,0.04);
          transition: all 0.2s;
          position: relative;
          overflow: hidden;
        }
        .btn-confirm::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(56,189,248,0.08), transparent);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .btn-confirm:hover:not(:disabled)::before { opacity: 1; }
        .btn-confirm:hover:not(:disabled) {
          border-color: rgba(56,189,248,0.6);
          box-shadow: 0 0 24px rgba(56,189,248,0.2), inset 0 0 16px rgba(56,189,248,0.08);
          color: #7dd3fc;
        }
        .btn-confirm:active:not(:disabled) { transform: scale(0.97); }

        .btn-abandon {
          background: linear-gradient(135deg, rgba(239,68,68,0.1), rgba(220,38,38,0.06));
          color: rgba(252,165,165,0.7);
          border: 1px solid rgba(239,68,68,0.2);
          transition: all 0.2s;
        }
        .btn-abandon:hover:not(:disabled) {
          border-color: rgba(239,68,68,0.4);
          color: #fca5a5;
          box-shadow: 0 0 16px rgba(239,68,68,0.1);
        }
        .btn-abandon:active:not(:disabled) { transform: scale(0.97); }

        .local-toast {
          position: fixed; bottom: calc(var(--nav-h) + 16px);
          left: 50%; transform: translateX(-50%);
          background: rgba(8,13,26,0.95);
          border: 1px solid rgba(56,189,248,0.3);
          color: #38bdf8; padding: 10px 20px; border-radius: 99px;
          font-size: 13px; font-weight: 600; font-family: var(--mono);
          letter-spacing: 0.06em;
          z-index: 200; white-space: nowrap; pointer-events: none;
          box-shadow: 0 0 20px rgba(56,189,248,0.15);
          animation: toast-in 0.2s ease;
        }

        /* Status badge overrides — more system-like */
        .badge-approved {
          background: rgba(56,189,248,0.1);
          color: #38bdf8;
          border: 1px solid rgba(56,189,248,0.3);
        }
        .badge-scheduled {
          background: rgba(129,140,248,0.1);
          color: #818cf8;
          border: 1px solid rgba(129,140,248,0.3);
        }

        /* Approved pulse dot — electric blue instead of green */
        .pc-approved-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #38bdf8;
          display: inline-block;
          animation: pulse-ring 2s infinite;
          box-shadow: 0 0 4px #38bdf8;
        }
      `}</style>

      <div className="pc-wrap">
        <ManaFlow active={isApproved} pulse={!isApproved}>
          <div className="pc-inner">
            <div className="pc-header">
              <div className="pc-header-left">
                <span className={`badge ${STATUS_BADGE[post.status] || 'badge-draft'}`}>
                  {isApproved && <span className="pc-approved-dot" style={{ marginRight: 5 }} />}
                  {STATUS_LABEL[post.status] || post.status}
                </span>
                {score > 0 && (
                  <span className={`score-badge${scoreHigh ? ' high' : ''}`}>
                    {scoreHigh ? '◈' : '◇'} {score}/100
                  </span>
                )}
              </div>
              <span className="pc-time">{humanTime(post.scheduled_time || post.posted_time)}</span>
            </div>

            <div className="pc-content">{expanded ? content : preview}</div>
            {content.length > 200 && (
              <button className="pc-show-more" onClick={() => setExpanded(e => !e)}>
                {expanded ? '[ collapse ]' : '[ expand ]'}
              </button>
            )}

            {post.image_url?.startsWith('https://') ? (
              <img src={post.image_url} alt="Post image" className="pc-image"
                   onError={e => { e.target.style.display = 'none' }} />
            ) : post.image_url ? (
              <div className="pc-no-image has-image">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                Image attached
              </div>
            ) : (
              <div className="pc-no-image">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                No image — send /generate_image in Telegram
              </div>
            )}

            <SignalCard signalCard={post.signal_card} priority={priority} />

            {(canApprove || canReject) && (
              <>
                <hr style={{ border: 'none', borderTop: '1px solid rgba(56,189,248,0.1)', margin: '14px 0' }} />
                <div className="pc-actions">
                  {canApprove && (
                    <button className="btn btn-confirm" onClick={handleApprove} disabled={loading === 'approve'}>
                      {loading === 'approve' ? '···' : '✓ Confirm'}
                    </button>
                  )}
                  {canReject && (
                    <button className="btn btn-abandon" onClick={handleReject} disabled={loading === 'reject'}>
                      {loading === 'reject' ? '···' : 'Abandon'}
                    </button>
                  )}
                </div>
              </>
            )}

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
