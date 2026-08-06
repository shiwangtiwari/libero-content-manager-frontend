import axios from 'axios'

// Use /api proxy (Vercel proxies to Railway server-side — no CORS on mobile)
// Falls back to direct URL for localhost dev
const API_URL = import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'https://libero-content-manager-backend-production.up.railway.app'
    : '/api')

const client = axios.create({
  baseURL: API_URL,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
})

// Auto-retry once on timeout or network error
client.interceptors.response.use(
  response => response,
  async error => {
    const config = error.config
    if (!config || config._retried) return Promise.reject(error)
    const isTimeout = error.code === 'ECONNABORTED' || (error.message && error.message.includes('timeout'))
    const isNetwork = !error.response
    if (isTimeout || isNetwork) {
      config._retried = true
      await new Promise(r => setTimeout(r, 3000))
      return client(config)
    }
    return Promise.reject(error)
  }
)

export const getQueue   = () => client.get('/posts/queue').then(r => Array.isArray(r.data) ? r.data : (r.data?.posts || []))
export const getPosted  = () => client.get('/posts/posted').then(r => Array.isArray(r.data) ? r.data : (r.data?.posts || []))

export const approvePost = (id) => client.post(`/posts/${id}/approve`).then(r => r.data)
export const rejectPost  = (id) => client.post(`/posts/${id}/reject`).then(r => r.data)

export const submitInput    = (message) => client.post('/inputs', { message, source: 'dashboard' }).then(r => r.data)
export const getHealth      = () => client.get('/health').then(r => r.data)
export const runPipelineNow = () => client.post('/run_now').then(r => r.data)

// Profile / About Me
export const getProfile  = () => client.get('/profile').then(r => r.data)
export const saveProfile = (bubbles) => client.post('/profile', { bubbles }).then(r => r.data)
export const addBubble   = (label, content) => client.post('/profile/bubble', { label, content }).then(r => r.data)

// Post content editing
export const editPost = (id, content) => client.post(`/posts/${id}/edit`, { content }).then(r => r.data)

export default client
