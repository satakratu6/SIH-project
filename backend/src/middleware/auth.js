import jwt from 'jsonwebtoken'
import User from '../models/user.js'

export function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
    if (!token) return res.status(401).json({ message: 'Unauthorized' })
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = payload
    next()
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

export function requireRole(role) {
  return async function (req, res, next) {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' })
    try {
      const user = await User.findById(req.user.id).lean()
      if (!user) return res.status(401).json({ message: 'Unauthorized' })
      if (user.role !== role) return res.status(403).json({ message: 'Forbidden' })
      req.currentUser = user
      next()
    } catch (e) {
      return res.status(500).json({ message: 'Server error' })
    }
  }
}



