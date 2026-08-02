import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const client = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

// ── Posts ─────────────────────────────────────────────────────────────────────

export const getPosts = (status) =>
  client.get('/posts', { params: status ? { status } : {} }).then((r) => r.data.posts)

export const getQueue = () =>
  client.get('/posts/queue').then((r) => r.data.posts)

export const getPosted = () =>
  client.get('/posts/posted').then((r) => r.data.posts)

export const getPost = (id) => client.get(`/posts/${id}`).then((r) => r.data)

export const approvePost = (id) => client.patch(`/posts/${id}/approve`).then((r) => r.data)

export const rejectPost = (id) => client.patch(`/posts/${id}/reject`).then((r) => r.data)

export const reschedulePost = (id, scheduled_time) =>
  client.patch(`/posts/${id}/reschedule`, { scheduled_time }).then((r) => r.data)

export const updatePostContent = (id, content) =>
  client.patch(`/posts/${id}/content`, { content }).then((r) => r.data)

// ── Inputs ────────────────────────────────────────────────────────────────────

export const submitInput = (message) =>
  client.post('/inputs', { message, source: 'dashboard' }).then((r) => r.data)

// ── Health ────────────────────────────────────────────────────────────────────

export const getHealth = () => client.get('/health').then((r) => r.data)

export const getSessionHealth = () =>
  client.get('/health/sessions').then((r) => r.data.platforms)

export default client
