
import { Router } from 'express'
import * as adminController from '../controllers/admin.controller.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()

// Teachers and Students Data
router.get('/teachers', requireAuth, requireRole('admin'), adminController.listAllTeachers)
router.get('/students', requireAuth, requireRole('admin'), adminController.listAllStudents)
router.post('/teachers', requireAuth, requireRole('admin'), adminController.addTeacher)
router.delete('/teachers/:id', requireAuth, requireRole('admin'), adminController.deleteTeacher)

const router = Router()

// Dashboard stats
router.get('/me', requireAuth, requireRole('admin'), adminController.adminDashboard)

// Class & Section CRUD
router.get('/classes', requireAuth, requireRole('admin'), adminController.listClassSections)
router.post('/classes', requireAuth, requireRole('admin'), adminController.createClassSection)
router.put('/classes/:id', requireAuth, requireRole('admin'), adminController.updateClassSection)
router.delete('/classes/:id', requireAuth, requireRole('admin'), adminController.deleteClassSection)

// Student CRUD
router.get('/classes/:id/students', requireAuth, requireRole('admin'), adminController.listStudentsBySection)
router.post('/students', requireAuth, requireRole('admin'), adminController.addStudent)
router.delete('/students/:id', requireAuth, requireRole('admin'), adminController.deleteStudent)
 // router.post('/students/import', auth('admin'), adminController.bulkImportStudents) // removed bulk import route

// Attendance reports
router.get('/attendance/report', requireAuth, requireRole('admin'), adminController.attendanceReport)

// Complaints
router.get('/complaints', requireAuth, requireRole('admin'), adminController.listComplaints)
router.put('/complaints/:id', requireAuth, requireRole('admin'), adminController.updateComplaintStatus)

// Leave Requests
router.get('/leave', requireAuth, requireRole('admin'), adminController.listAllLeaveRequests)
router.put('/leave/:id', requireAuth, requireRole('admin'), adminController.updateLeaveRequest)

export default router
