import { useState, useEffect } from 'react'
import { getPosted } from '../api/client.js'

function humanTime(isoStr) {
  if (!isoStr) return '—'
  try {
    const [datePart, timePart] = isoStr.split(' ')
    const date = new Date(datePart + 'T' + (timePart || '00:00') + ':00+05:30')
    return date.toLocaleDateString('en-IN', {
      weekday: 'long', day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true,
      timeZone: 'Asia/Kolkata',
    })
  } catch { return isoStr }
}

export default function Posted() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getPosted()
      .then(data => { setPosts(data); setLoading(false) })
      .catch(() => { setError('Could not load posted history.'); setLoading(false) })
  }, [])

  return (
    <>
      <style>{`
        .posted-header {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text3);
          margin-bottom: 16px;
          padding-top: 8px;
        }
        .posted-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 12px;
        }
        .posted-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
          flex-wrap: wrap;
          gap: 6px;
        }
        .posted-time {
          font-size: 12px;
          color: var(--text3);
        }
        .posted-content {
          font-size: 15px;
          line-height: 1.65;
          color: var(--text);
          white-space: pre-wrap;
          word-break: break-word;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 12px;
        }
        .posted-generator {
          font-size: 11px;
          color: var(--text3);
          font-family: var(--mono);
        }
        .posted-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: var(--accent2);
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          margin-top: 8px;
        }
        .posted-link:hover { text-decoration: underline; }
      `}</style>

      <div className="posted-header">Posted</div>

      {loading && <div className="spinner" />}

      {error && (
        <div className="card" style={{ borderColor: 'var(--red)', color: 'var(--red)' }}>
          {error}
        </div>
      )}

      {!loading && !error && posts.length === 0 && (
        <div className="empty">
          <div className="empty-icon">📊</div>
          <div className="empty-text">No posts yet</div>
          <div className="empty-sub">Your published posts will appear here</div>
        </div>
      )}

      {posts.map(post => (
        <div key={post.id} className="posted-card">
          <div className="posted-meta">
            <span className="badge badge-posted">Posted</span>
            <span className="posted-time">{humanTime(post.posted_time)}</span>
          </div>
          <div className="posted-content">{post.content}</div>
          <hr className="divider" />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <span className="posted-generator">
              {post.image_generator ? `Image: ${post.image_generator}` : 'No image'}
            </span>
            {post.linkedin_post_id && (
              <a
                className="posted-link"
                href={`https://www.linkedin.com/feed/update/${post.linkedin_post_id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on LinkedIn
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15 3h6v6" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 14L21 3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            )}
          </div>
          <div className="posted-generator" style={{ marginTop: 4, fontFamily: 'var(--mono)' }}>
            {post.id?.slice(0, 8)}
          </div>
        </div>
      ))}
    </>
  )
}
