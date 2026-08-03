import { useState, useEffect } from 'react'
import BlurFade from '../bits/BlurFade.jsx'
import { getPosted } from '../api/client.js'

function humanTime(str) {
  if (!str) return '—'
  try {
    const [d, t] = str.split(' ')
    const dt = new Date(d + 'T' + (t || '00:00') + ':00+05:30')
    return dt.toLocaleDateString('en-IN', {
      weekday: 'long', day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true,
      timeZone: 'Asia/Kolkata',
    })
  } catch { return str }
}

export default function Posted() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getPosted()
      .then(data => { setPosts(Array.isArray(data) ? data : (data?.posts || [])); setLoading(false) })
      .catch(() => { setError('Could not load posted history.'); setLoading(false) })
  }, [])

  return (
    <>
      <style>{`
        .posted-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 18px;
          margin-bottom: 12px;
          transition: border-color 0.2s;
        }
        .posted-card:hover { border-color: var(--border2); }
        .posted-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
          flex-wrap: wrap;
          gap: 6px;
        }
        .posted-time { font-size: 12px; color: var(--text3); }
        .posted-content {
          font-size: 15px;
          line-height: 1.7;
          color: var(--text);
          white-space: pre-wrap;
          word-break: break-word;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 14px;
        }
        .posted-image {
          width: 100%; border-radius: 10px; margin-bottom: 14px;
          object-fit: cover; max-height: 200px; display: block;
          border: 1px solid var(--border);
        }
        .posted-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
        }
        .posted-link {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: var(--accent2);
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          padding: 6px 14px;
          border-radius: 8px;
          background: rgba(99,102,241,0.1);
          border: 1px solid rgba(99,102,241,0.2);
          transition: all 0.15s;
        }
        .posted-link:hover { background: rgba(99,102,241,0.18); }
        .posted-meta-detail { font-size: 12px; color: var(--text3); font-family: var(--mono); }
      `}</style>

      {loading && <div className="spinner" />}

      {error && (
        <div className="card" style={{ borderColor: 'var(--red)', color: 'var(--red)', fontSize: 14 }}>
          {error}
        </div>
      )}

      {!loading && !error && posts.length === 0 && (
        <BlurFade delay={0.1}>
          <div className="empty">
            <div className="empty-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(56,189,248,0.3)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
            </div>
            <div className="empty-text">No posts yet</div>
            <div className="empty-sub">Published posts appear here with LinkedIn links</div>
          </div>
        </BlurFade>
      )}

      {posts.map((post, i) => (
        <BlurFade key={post.id} delay={i * 0.07}>
          <div className="posted-card">
            <div className="posted-meta">
              <span className="badge badge-posted">Posted</span>
              <span className="posted-time">{humanTime(post.posted_time)}</span>
            </div>

            {post.image_url?.startsWith('https://') && (
              <img src={post.image_url} alt="Post" className="posted-image" onError={e => e.target.remove()} />
            )}

            <div className="posted-content">{post.content}</div>

            <div className="posted-footer">
              <span className="posted-meta-detail">
                {post.viral_score ? `Score: ${post.viral_score}/100` : ''}{post.image_generator ? ` · Image: ${post.image_generator}` : ''}
              </span>
              {post.linkedin_post_id && (
                <a
                  className="posted-link"
                  href={`https://www.linkedin.com/feed/update/${post.linkedin_post_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on LinkedIn
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                    <path d="M15 3h6v6"/><path d="M10 14L21 3"/>
                  </svg>
                </a>
              )}
            </div>
          </div>
        </BlurFade>
      ))}
    </>
  )
}
