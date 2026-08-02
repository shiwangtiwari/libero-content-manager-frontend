import React, { useState } from 'react'
import SignalCard from './SignalCard.jsx'
import { approvePost, rejectPost, reschedulePost, updatePostContent } from '../api/client.js'

const STATUS_CONFIG = {
  draft: { label: 'Draft', bg: '#374151', color: '#9ca3af' },
  approved: { label: 'Approved', bg: '#064e3b', color: '#34d399' },
  scheduled: { label: 'Scheduled', bg: '#1e3a5f', color: '#60a5fa' },
  pending_reschedule: { label: 'Rescheduling', bg: '#451a03', color: '#fb923c' },
  posted: { label: 'Posted', bg: '#14532d', color: '#4ade80' },
  rejected: { label: 'Rejected', bg: '#4b1111', color: '#f87171' },
  failed: { label: 'Failed', bg: '#4b1111', color: '#f87171' },
  expired: { label: 'Expired', bg: '#374151', color: '#6b7280' },
}

const s = {
  card: {
    background: '#161616',
    border: '1px solid #252525',
    borderRadius: '14px',
    padding: '16px',
    marginBottom: '12px',
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  statusBadge: (status) => {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.draft
    return {
      background: cfg.bg,
      color: cfg.color,
      fontSize: '11px',
      fontWeight: '700',
      padding: '3px 10px',
      borderRadius: '20px',
    }
  },
  scheduledTime: {
    fontSize: '12px',
    color: '#6b7280',
  },
  content: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#e5e7eb',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  showMore: {
    background: 'none',
    border: 'none',
    color: '#60a5fa',
    fontSize: '13px',
    cursor: 'pointer',
    padding: '4px 0',
    marginTop: '4px',
  },
  viral: {
    fontSize: '12px',
    color: '#6b7280',
    marginTop: '8px',
  },
  viralScore: (score) => ({
    color: score >= 85 ? '#4ade80' : score >= 70 ? '#fbbf24' : '#f87171',
    fontWeight: '700',
  }),
  imagePlaceholder: {
    background: '#1f1f1f',
    border: '1px dashed #333',
    borderRadius: '8px',
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#4b5563',
    fontSize: '13px',
    marginTop: '12px',
  },
  image: {
    width: '100%',
    borderRadius: '8px',
    marginTop: '12px',
    objectFit: 'cover',
  },
  actions: {
    display: 'flex',
    gap: '8px',
    marginTop: '14px',
    flexWrap: 'wrap',
  },
  btn: (variant) => {
    const variants = {
      approve: { background: '#065f46', color: '#34d399', border: '1px solid #059669' },
      reject: { background: '#4b1111', color: '#f87171', border: '1px solid #dc2626' },
      reschedule: { background: '#1f2937', color: '#9ca3af', border: '1px solid #374151' },
      edit: { background: '#1e3a5f', color: '#60a5fa', border: '1px solid #1d4ed8' },
      generate: { background: '#1f2937', color: '#c084fc', border: '1px solid #7c3aed' },
    }
    const v = variants[variant] || variants.reschedule
    return {
      ...v,
      padding: '8px 14px',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
      minHeight: '44px',
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
    }
  },
  editArea: {
    width: '100%',
    background: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '8px',
    color: '#e5e7eb',
    fontSize: '14px',
    lineHeight: '1.6',
    padding: '10px',
    marginTop: '10px',
    resize: 'vertical',
    minHeight: '120px',
    fontFamily: 'inherit',
  },
  saveBtn: {
    background: '#1e3a5f',
    color: '#60a5fa',
    border: '1px solid #1d4ed8',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px',
    minHeight: '44px',
  },
}

export default function PostCard({ post, onRefresh }) {
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editContent, setEditContent] = useState(post.content)
  const [loading, setLoading] = useState(null)

  const content = post.content || ''
  const isLong = content.length > 200
  const displayContent = expanded || !isLong ? content : content.slice(0, 200) + '…'
  const status = post.status || 'draft'
  const canAct = ['draft', 'approved', 'scheduled', 'pending_reschedule'].includes(status)

  const handle = (action) => async () => {
    setLoading(action)
    try {
      if (action === 'approve') await approvePost(post.id)
      else if (action === 'reject') await rejectPost(post.id)
      else if (action === 'reschedule') await reschedulePost(post.id, post.scheduled_time)
      onRefresh?.()
    } catch (e) {
      console.error(action, e)
    } finally {
      setLoading(null)
    }
  }

  const handleSaveEdit = async () => {
    setLoading('edit')
    try {
      await updatePostContent(post.id, editContent)
      setEditing(false)
      onRefresh?.()
    } catch (e) {
      console.error('edit', e)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div style={s.card}>
      {/* Top row: status + time */}
      <div style={s.topRow}>
        <span style={s.statusBadge(status)}>
          {STATUS_CONFIG[status]?.label || status}
        </span>
        {post.scheduled_time && (
          <span style={s.scheduledTime}>{post.scheduled_time} IST</span>
        )}
        {post.posted_time && !post.scheduled_time && (
          <span style={s.scheduledTime}>
            {new Date(post.posted_time).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
            })}
          </span>
        )}
      </div>

      {/* Post content */}
      {editing ? (
        <>
          <textarea
            style={s.editArea}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
          <button style={s.saveBtn} onClick={handleSaveEdit} disabled={loading === 'edit'}>
            {loading === 'edit' ? 'Saving…' : 'Save Changes'}
          </button>
        </>
      ) : (
        <>
          <div style={s.content}>{displayContent}</div>
          {isLong && (
            <button style={s.showMore} onClick={() => setExpanded(!expanded)}>
              {expanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </>
      )}

      {/* Viral score */}
      {post.viral_score > 0 && (
        <div style={s.viral}>
          Viral score:{' '}
          <span style={s.viralScore(post.viral_score)}>{post.viral_score}/100</span>
        </div>
      )}

      {/* Image */}
      {post.image_url ? (
        <img src={post.image_url} alt="Post visual" style={s.image} />
      ) : canAct ? (
        <div style={s.imagePlaceholder}>No image yet</div>
      ) : null}

      {/* Signal card */}
      {post.signal_card && Object.keys(post.signal_card).length > 0 && (
        <SignalCard signal={post.signal_card} />
      )}

      {/* Actions */}
      {canAct && !editing && (
        <div style={s.actions}>
          {status !== 'approved' && (
            <button style={s.btn('approve')} onClick={handle('approve')} disabled={!!loading}>
              {loading === 'approve' ? '…' : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                  Approve
                </>
              )}
            </button>
          )}
          <button style={s.btn('edit')} onClick={() => setEditing(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
            Edit
          </button>
          <button style={s.btn('reschedule')} onClick={handle('reschedule')} disabled={!!loading}>
            {loading === 'reschedule' ? '…' : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                Reschedule
              </>
            )}
          </button>
          <button style={s.btn('reject')} onClick={handle('reject')} disabled={!!loading}>
            {loading === 'reject' ? '…' : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                Reject
              </>
            )}
          </button>
        </div>
      )}

      {/* LinkedIn link for posted */}
      {status === 'posted' && post.linkedin_post_id && (
        <div style={{ marginTop: '12px' }}>
          <a
            href={`https://www.linkedin.com/feed/update/${post.linkedin_post_id}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#60a5fa', fontSize: '13px' }}
          >
            View on LinkedIn →
          </a>
        </div>
      )}
    </div>
  )
}
