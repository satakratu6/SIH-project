import AttendanceSession from '../models/attendanceSession.js'
import Attendance from '../models/attendance.js'
import Student from '../models/student.js'
import { startTokenRotation, stopTokenRotation, validateScanToken } from '../services/attendanceToken.js'

export async function startSession(req, res) {
  try {
    const { classSectionId } = req.body || {}
    const doc = { teacher: req.currentUser._id }
    if (classSectionId) doc.classSection = classSectionId
    const session = await AttendanceSession.create(doc)
    await startTokenRotation(req.app.locals.io, session._id.toString())
    return res.json({ sessionId: session._id.toString() })
  } catch (e) {
    return res.status(500).json({ message: 'Server error' })
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



