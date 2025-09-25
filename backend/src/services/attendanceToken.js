import jwt from 'jsonwebtoken'

// Track intervals per session for rotation
const sessionIntervals = new Map()

function signToken(sessionId) {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET not set')
  // 60s lifetime
  return jwt.sign({ sessionId: String(sessionId) }, secret, { expiresIn: '60s' })
}

export async function startTokenRotation(io, sessionId) {
  function rotateOnce() {
    const token = signToken(sessionId)
    io.to(`session:${sessionId}`).emit('attendance-token', { sessionId, token })
    return token
  }

  const firstToken = rotateOnce()
  const timer = setInterval(rotateOnce, 60 * 1000)
  sessionIntervals.set(sessionId, timer)
  return firstToken
}

export function stopTokenRotation(sessionId) {
  const timer = sessionIntervals.get(sessionId)
  if (timer) {
    clearInterval(timer)
    sessionIntervals.delete(sessionId)
  }
}

export async function validateScanToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    return decoded?.sessionId || null
  } catch (_e) {
    return null
  }
}



