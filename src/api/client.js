import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'https://libero-content-manager-backend-production.up.railway.app'

const client = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

// ── Posts ──────────────────────────────────────────────────────────────────

export const getQueue = () => client.get('/posts/queue').then(r => Array.isArray(r.data) ? r.data : (r.data.posts || []))
export const getPosted = () => client.get('/posts/posted').then(r => Array.isArray(r.data) ? r.data : (r.data.posts || []))

export const approvePost = (id) => client.post(`/posts/${id}/approve`).then(r => r.data)
export const rejectPost = (id) => client.post(`/posts/${id}/reject`).then(r => r.data)

// ── Inputs ─────────────────────────────────────────────────────────────────

export const submitInput = (message) =>
  client.post('/inputs', { message, source: 'dashboard' }).then(r => r.data)

// ── Health ─────────────────────────────────────────────────────────────────

export const getHealth = () => client.get('/health').then(r => r.data)

// ── Pipeline trigger ───────────────────────────────────────────────────────

export const runPipelineNow = () => client.post('/run_now').then(r => r.data)

export default client
