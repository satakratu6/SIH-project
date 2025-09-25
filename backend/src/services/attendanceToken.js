import crypto from 'crypto'

// In-memory token store: token -> { sessionId, expiresAt }
const tokenStore = new Map()
// Track intervals per session
const sessionIntervals = new Map()

function generateToken() {
  return crypto.randomBytes(16).toString('hex')
}

function saveTokenForSession(sessionId, token) {
  const expiresAt = Date.now() + 60 * 1000
  tokenStore.set(token, { sessionId, expiresAt })
}

function cleanupExpiredTokens() {
  const now = Date.now()
  for (const [tok, meta] of tokenStore.entries()) {
    if (meta.expiresAt <= now) tokenStore.delete(tok)
  }
}

export async function startTokenRotation(io, sessionId) {
  async function rotate() {
    const token = generateToken()
    saveTokenForSession(sessionId, token)
    cleanupExpiredTokens()
    io.to(`session:${sessionId}`).emit('attendance-token', { sessionId, token })
  }

  await rotate()
  const timer = setInterval(rotate, 60 * 1000)
  sessionIntervals.set(sessionId, timer)
}

export function stopTokenRotation(sessionId) {
  const timer = sessionIntervals.get(sessionId)
  if (timer) {
    clearInterval(timer)
    sessionIntervals.delete(sessionId)
  }
}

export async function validateScanToken(token) {
  cleanupExpiredTokens()
  const meta = tokenStore.get(token)
  if (!meta) return null
  if (meta.expiresAt <= Date.now()) {
    tokenStore.delete(token)
    return null
  }
  return meta.sessionId
}



