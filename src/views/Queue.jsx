import { useState, useEffect, useCallback } from 'react'
import PostCard from '../components/PostCard.jsx'
import { getQueue, runPipelineNow } from '../api/client.js'

export default function Queue() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [triggering, setTriggering] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const fetchQueue = useCallback(async () => {
    try {
      const data = await getQueue()
setPosts(Array.isArray(data) ? data : [])
      setError(null)
    } catch {
      setError('Could not load queue. Is Railway running?')
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

  return (
    <>
      <style>{`
        .queue-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          padding-top: 8px;
        }
        .queue-title {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text3);
        }
        .queue-count {
          font-family: var(--mono);
          font-size: 12px;
          color: var(--text3);
          background: var(--surface2);
          padding: 2px 8px;
          border-radius: 99px;
        }
        .trigger-btn {
          font-size: 13px;
          padding: 0 12px;
          height: 36px;
          min-height: 36px;
        }
      `}</style>

      <div className="queue-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="queue-title">Queue</span>
          {!loading && (
            <span className="queue-count">{posts.length}</span>
          )}
        </div>
        <button
          className="btn btn-primary trigger-btn"
          onClick={handleTrigger}
          disabled={triggering}
        >
          {triggering ? '…' : '+ Generate'}
        </button>
      </div>

      {loading && <div className="spinner" />}

      {error && (
        <div className="card" style={{ borderColor: 'var(--red)', color: 'var(--red)' }}>
          {error}
        </div>
      )}

      {!loading && !error && posts.length === 0 && (
        <div className="empty">
          <div className="empty-icon">📭</div>
          <div className="empty-text">Queue is empty</div>
          <div className="empty-sub">Tap Generate to create a new draft</div>
        </div>
      )}

      {posts.map(post => (
        <PostCard key={post.id} post={post} onRefresh={fetchQueue} />
      ))}

      {toast && <div className="toast">{toast}</div>}
    </>
  )
}
