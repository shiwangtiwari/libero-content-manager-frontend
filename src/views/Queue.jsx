import React, { useEffect, useState } from 'react'
import PostCard from '../components/PostCard.jsx'
import { getQueue } from '../api/client.js'

const s = {
  page: { padding: '16px 16px 100px' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  title: { fontSize: '20px', fontWeight: '700', color: '#f0f0f0' },
  count: {
    fontSize: '13px',
    color: '#6b7280',
    background: '#1f2937',
    padding: '3px 10px',
    borderRadius: '20px',
  },
  empty: {
    textAlign: 'center',
    color: '#4b5563',
    padding: '60px 20px',
    fontSize: '15px',
    lineHeight: '1.6',
  },
  refreshBtn: {
    background: 'none',
    border: '1px solid #333',
    color: '#6b7280',
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '13px',
    cursor: 'pointer',
    minHeight: '36px',
  },
  loading: {
    textAlign: 'center',
    color: '#4b5563',
    padding: '40px',
  },
  error: {
    background: '#4b1111',
    border: '1px solid #dc2626',
    borderRadius: '10px',
    padding: '12px 16px',
    color: '#f87171',
    fontSize: '13px',
    marginBottom: '12px',
  },
}

export default function Queue() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getQueue()
      setPosts(data)
    } catch (e) {
      setError('Could not load queue. Check backend connection.')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.title}>Queue</h1>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {!loading && <span style={s.count}>{posts.length}</span>}
          <button style={s.refreshBtn} onClick={load}>Refresh</button>
        </div>
      </div>

      {error && <div style={s.error}>{error}</div>}

      {loading ? (
        <div style={s.loading}>Loading…</div>
      ) : posts.length === 0 ? (
        <div style={s.empty}>
          No posts in queue.<br />
          <span style={{ fontSize: '13px', color: '#374151' }}>
            Drafts will appear here after the next content cycle.
          </span>
        </div>
      ) : (
        posts.map((post) => (
          <PostCard key={post.id} post={post} onRefresh={load} />
        ))
      )}
    </div>
  )
}
