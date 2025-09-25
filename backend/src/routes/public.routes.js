import { Router } from 'express'
import { markAttendance } from '../controllers/attendance.controller.js'

const router = Router()

// Public/mobile endpoint for QR scan marking
router.post('/attendance/mark', markAttendance)

export default router


