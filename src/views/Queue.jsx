import { useState, useEffect, useCallback } from 'react'
import PostCard from '../components/PostCard.jsx'
import BlurFade from '../bits/BlurFade.jsx'
import { getQueue, runPipelineNow } from '../api/client.js'

export default function Queue() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [triggering, setTriggering] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  const fetchQueue = useCallback(async () => {
    try {
      const data = await getQueue()
      setPosts(Array.isArray(data) ? data : (data?.posts || []))
      setError(null)
    } catch {
      setError('Could not reach Railway backend.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchQueue() }, [fetchQueue])

  const handleTrigger = async () => {
    setTriggering(true)
    try {
      await runPipelineNow()
      showToast('⚙️ Pipeline triggered — draft arriving in ~30s')
    } catch {
      showToast('❌ Failed to trigger pipeline')
    } finally {
      setTriggering(false)
    }
  }

  const pendingCount = posts.filter(p => p.status === 'draft' || p.status === 'pending_reschedule').length
  const approvedCount = posts.filter(p => p.status === 'approved').length

  return (
    <>
      <style>{`
        .queue-stats {
          display: flex;
          gap: 10px;
          margin-bottom: 16px;
        }
        .queue-stat {
          flex: 1;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 12px 14px;
          text-align: center;
        }
        .queue-stat-num {
          font-size: 24px;
          font-weight: 700;
          font-family: var(--mono);
          line-height: 1;
          margin-bottom: 4px;
        }
        .queue-stat-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text3);
          font-weight: 600;
        }
        .generate-btn {
          font-size: 14px;
          height: 40px;
          min-height: 40px;
          padding: 0 16px;
          border-radius: 10px;
        }
      `}</style>

      {!loading && !error && (
        <BlurFade delay={0}>
          <div className="queue-stats">
            <div className="queue-stat">
              <div className="queue-stat-num" style={{ color: 'var(--accent2)' }}>{pendingCount}</div>
              <div className="queue-stat-label">Pending</div>
            </div>
            <div className="queue-stat">
              <div className="queue-stat-num" style={{ color: 'var(--green)' }}>{approvedCount}</div>
              <div className="queue-stat-label">Approved</div>
            </div>
            <div className="queue-stat" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <button
                className="btn btn-primary generate-btn"
                onClick={handleTrigger}
                disabled={triggering}
              >
                {triggering ? '…' : '+ Generate'}
              </button>
            </div>
          </div>
        </BlurFade>
      )}

      {loading && <div className="spinner" />}

      {error && (
        <BlurFade delay={0.1}>
          <div className="card" style={{ borderColor: 'var(--red)', color: 'var(--red)', fontSize: 14, textAlign: 'center' }}>
            <p style={{ margin: '0 0 0.8rem 0' }}>{error}</p>
            <button
              onClick={() => { setLoading(true); setError(null); fetchQueue() }}
              style={{
                padding: '0.5rem 1.2rem', background: 'var(--accent)', color: '#000',
                border: 'none', borderRadius: '8px', fontWeight: 700,
                cursor: 'pointer', fontSize: '0.9rem'
              }}
            >
              Retry
            </button>
          </div>
        </BlurFade>
      )}

      {!loading && !error && posts.length === 0 && (
        <BlurFade delay={0.1}>
          <div className="empty">
            <div className="empty-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(56,189,248,0.3)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>
            </div>
            <div className="empty-text">[ QUEUE EMPTY ]</div>
            <div className="empty-sub">Next draft generates automatically<br/>Mon 6:00 AM IST → Tue post<br/>Tue 6:00 AM IST → Wed post<br/>Wed 6:00 AM IST → Thu post</div>
          </div>
        </BlurFade>
      )}

      {posts.map((post, i) => (
        <BlurFade key={post.id} delay={0.05 + i * 0.07}>
          <PostCard post={post} onRefresh={fetchQueue} />
        </BlurFade>
      ))}

      {toast && <div className="toast">{toast}</div>}
    </>
  )
}
