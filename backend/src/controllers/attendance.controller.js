import AttendanceSession from '../models/attendanceSession.js'
import Attendance from '../models/attendance.js'
import Student from '../models/student.js'
import { startTokenRotation, stopTokenRotation, validateScanToken } from '../services/attendanceToken.js'
import jwt from 'jsonwebtoken'

export async function startSession(req, res) {
  try {
    const { classSectionId } = req.body || {}
    const doc = { teacher: req.currentUser._id }
    if (classSectionId) doc.classSection = classSectionId
    const session = await AttendanceSession.create(doc)
    const token = await startTokenRotation(req.app.locals.io, session._id.toString())
    return res.json({ sessionId: session._id.toString(), token })
  } catch (e) {
    // Surface actual error to help diagnose (dev-friendly)
    // eslint-disable-next-line no-console
    console.error('startSession error:', e)
    return res.status(500).json({ message: e?.message || 'Server error' })
  }
}

export async function stopSession(req, res) {
  try {
    const { sessionId } = req.body || {}
    if (!sessionId) return res.status(400).json({ message: 'sessionId required' })
    const session = await AttendanceSession.findByIdAndUpdate(sessionId, { active: false, endedAt: new Date() }, { new: true })
    if (!session) return res.status(404).json({ message: 'Session not found' })
    stopTokenRotation(sessionId)
    return res.json({ ok: true })
  } catch (e) {
    return res.status(500).json({ message: 'Server error' })
  }
}

export async function scan(req, res) {
  try {
    const { token, studentId, deviceId } = req.body || {}
    if (!token || !studentId || !deviceId) return res.status(400).json({ message: 'token, studentId, deviceId required' })
    const sessionId = await validateScanToken(token)
    if (!sessionId) return res.status(400).json({ message: 'Token expired or invalid' })

    const session = await AttendanceSession.findById(sessionId)
    if (!session || !session.active) return res.status(400).json({ message: 'Session inactive' })

    const student = await Student.findOne({ studentId })
    if (!student) return res.status(404).json({ message: 'Student not found' })

    // Device reuse check within session
    if (session.usedDeviceIds.includes(deviceId)) {
      return res.status(400).json({ message: 'Device already used in this session' })
    }

    try {
      const attendance = await Attendance.create({ session: session._id, student: student._id, deviceId })
      session.usedDeviceIds.push(deviceId)
      await session.save()
      // broadcast update
      const payload = { attendees: [{ studentId: student.studentId, name: student.name }] }
      req.app.locals.io.to(`session:${sessionId}`).emit('attendance-update', payload)
      return res.json({ ok: true, attendanceId: attendance._id.toString() })
    } catch (err) {
      if (err && err.code === 11000) {
        return res.status(400).json({ message: 'Student already marked in this session' })
      }
      throw err
    }
  } catch (e) {
    return res.status(500).json({ message: 'Server error' })
  }
}

// Mobile scanner compatibility route: POST /api/attendance/mark
export async function markAttendance(req, res) {
  try {
    const { token, studentId, deviceId } = req.body || {}
    const ip = req.headers['x-forwarded-for'] || req.connection?.remoteAddress || ''
    if (!token || !studentId || !deviceId) return res.status(400).json({ error: 'token, studentId, deviceId required' })
    const sessionId = await validateScanToken(token)
    if (!sessionId) return res.status(401).json({ error: 'Invalid or expired token' })

    const session = await AttendanceSession.findById(sessionId)
    if (!session || !session.active) return res.status(400).json({ error: 'Session inactive' })

    let student = await Student.findOne({ studentId })
    if (!student) {
      // Allow open scanning: auto-provision a minimal student record
      student = await Student.create({
        name: String(studentId),
        rollNumber: String(studentId),
        studentId: String(studentId)
      })
    }

    // Duplicate checks similar to provided snippet
    const alreadyMarked = await Attendance.findOne({ session: session._id, student: student._id })
    if (alreadyMarked) return res.status(400).json({ error: 'Already marked' })

    const deviceUsed = await Attendance.findOne({ session: session._id, deviceId })
    const ipUsed = await Attendance.findOne({ session: session._id, ip, student: { $ne: student._id } })
    if (deviceUsed || ipUsed) return res.status(400).json({ error: 'Device/IP already used' })

    const attendance = await Attendance.create({ session: session._id, student: student._id, deviceId, ip, scannedAt: new Date() })
    // Track used device
    if (!session.usedDeviceIds.includes(deviceId)) {
      session.usedDeviceIds.push(deviceId)
      await session.save()
    }

    // Emit both room-specific and global event names to match client variants
    const studentPayload = { id: student._id.toString(), studentId: student.studentId, name: student.name, rollNumber: student.rollNumber }
    req.app.locals.io.to(`session:${sessionId}`).emit('attendance-update', { attendees: [studentPayload] })
    req.app.locals.io.emit('attendanceUpdate', { sessionId, ...studentPayload })

    return res.json({ success: true, sessionId, attendanceId: attendance._id.toString(), student: studentPayload })
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('markAttendance error:', e)
    return res.status(401).json({ error: 'Invalid token or attendance error' })
  }
}



