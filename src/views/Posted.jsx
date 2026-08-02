import React, { useEffect, useState } from 'react'
import { getPosted } from '../api/client.js'

const s = {
  page: { padding: '16px 16px 100px' },
  title: { fontSize: '20px', fontWeight: '700', color: '#f0f0f0', marginBottom: '16px' },
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
  badge: {
    background: '#14532d',
    color: '#4ade80',
    fontSize: '11px',
    fontWeight: '700',
    padding: '3px 10px',
    borderRadius: '20px',
  },
  time: { fontSize: '12px', color: '#6b7280' },
  content: {
    fontSize: '14px',
    color: '#e5e7eb',
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    marginBottom: '12px',
  },
  image: {
    width: '100%',
    borderRadius: '8px',
    objectFit: 'cover',
    marginBottom: '12px',
  },
  metrics: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    marginBottom: '10px',
  },
  metric: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  metricValue: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#f0f0f0',
  },
  metricLabel: {
    fontSize: '11px',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  link: { color: '#60a5fa', fontSize: '13px', textDecoration: 'none' },
  empty: {
    textAlign: 'center',
    color: '#4b5563',
    padding: '60px 20px',
    fontSize: '15px',
  },
  genBadge: (gen) => ({
    display: 'inline-block',
    background: gen === 'chatgpt' ? '#065f46' : gen === 'gemini' ? '#1e3a5f' : '#1f2937',
    color: gen === 'chatgpt' ? '#34d399' : gen === 'gemini' ? '#60a5fa' : '#6b7280',
    fontSize: '11px',
    padding: '2px 8px',
    borderRadius: '4px',
    fontWeight: '600',
    marginBottom: '8px',
  }),
}

function MetricBox({ value, label }) {
  return (
    <div style={s.metric}>
      <span style={s.metricValue}>{value ?? '—'}</span>
      <span style={s.metricLabel}>{label}</span>
    </div>
  )
}

export default function Posted() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPosted()
      .then(setPosts)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ ...s.page, color: '#4b5563', paddingTop: '40px', textAlign: 'center' }}>Loading…</div>

  return (
    <div style={s.page}>
      <h1 style={s.title}>Posted</h1>

      {posts.length === 0 ? (
        <div style={s.empty}>No posts published yet.</div>
      ) : (
        posts.map((post) => {
          const m = post.posted_metrics?.[0] || {}
          const postedDate = post.posted_time
            ? new Date(post.posted_time).toLocaleString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
              })
            : null

          return (
            <div key={post.id} style={s.card}>
              <div style={s.topRow}>
                <span style={s.badge}>Posted</span>
                {postedDate && <span style={s.time}>{postedDate}</span>}
              </div>

              {post.image_url && (
                <img src={post.image_url} alt="Post visual" style={s.image} />
              )}

              {post.image_generator && post.image_generator !== 'none' && (
                <div style={s.genBadge(post.image_generator)}>
                  via {post.image_generator}
                </div>
              )}

              <div style={s.content}>{(post.content || '').slice(0, 300)}{post.content?.length > 300 ? '…' : ''}</div>

              <div style={s.metrics}>
                <MetricBox value={m.impressions} label="Views" />
                <MetricBox value={m.likes} label="Likes" />
                <MetricBox value={m.comments} label="Comments" />
                <MetricBox value={m.shares} label="Shares" />
                <MetricBox value={m.clicks} label="Clicks" />
              </div>

              {post.linkedin_post_id && (
                <a
                  style={s.link}
                  href={`https://www.linkedin.com/feed/update/${post.linkedin_post_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on LinkedIn →
                </a>
              )}
            </div>
          )
        })
      )}
    </div>
  )
}
