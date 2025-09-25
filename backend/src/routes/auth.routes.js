import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'

const router = Router()

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {}
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' })
    const user = await User.findOne({ email }).select('+passwordHash')
    if (!user) return res.status(401).json({ message: 'Invalid credentials' })
    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' })
    const token = jwt.sign({ id: user._id.toString(), role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' })
    return res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch (e) {
    return res.status(500).json({ message: 'Server error' })
  }
})

export default router


