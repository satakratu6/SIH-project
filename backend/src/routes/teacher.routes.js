import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { startSession, stopSession, scan } from '../controllers/attendance.controller.js'
import { listStudents, createLeaveRequest, listLeaveRequests, upsertTimetable, getTimetable } from '../controllers/teacher.controller.js'

const router = Router()

router.get('/me', requireAuth, requireRole('teacher'), (req, res) => {
  return res.json({ ok: true, user: req.currentUser })
})

router.post('/attendance/session/start', requireAuth, requireRole('teacher'), startSession)
router.post('/attendance/session/stop', requireAuth, requireRole('teacher'), stopSession)
router.post('/attendance/scan', scan) // open for student devices; token validation inside

// Students
router.get('/students', requireAuth, requireRole('teacher'), listStudents)

// Leave Requests
router.post('/leave', requireAuth, requireRole('teacher'), createLeaveRequest)
router.get('/leave', requireAuth, requireRole('teacher'), listLeaveRequests)

// Timetable
router.get('/timetable', requireAuth, requireRole('teacher'), getTimetable)
router.post('/timetable', requireAuth, requireRole('teacher'), upsertTimetable)

export default router


