// Add a new teacher
export async function addTeacher(req, res) {
  try {
    const { name, email, password } = req.body || {}
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email, and password required' })
    const existing = await User.findOne({ email })
    if (existing) return res.status(409).json({ message: 'Email already exists' })
    const passwordHash = await (await import('bcrypt')).default.hash(password, 10)
    const teacher = await User.create({ name, email, role: 'teacher', passwordHash, classes: [] })
    return res.status(201).json({ teacher })
  } catch (e) {
    console.error('addTeacher error', e)
    return res.status(500).json({ message: 'Server error' })
  }
}

// Remove a teacher
export async function deleteTeacher(req, res) {
  try {
    const id = req.params.id
    const teacher = await User.findOne({ _id: id, role: 'teacher' })
    if (!teacher) return res.status(404).json({ message: 'Not found' })
    await User.deleteOne({ _id: id })
    return res.json({ ok: true })
  } catch (e) {
    console.error('deleteTeacher error', e)
    return res.status(500).json({ message: 'Server error' })
  }
}
// List all teachers
export async function listAllTeachers(req, res) {
  try {
    const teachers = await User.find({ role: 'teacher' }).select('-passwordHash').lean()
    return res.json({ teachers })
  } catch (e) {
    console.error('listAllTeachers error', e)
    return res.status(500).json({ message: 'Server error' })
  }
}

// List all students
export async function listAllStudents(req, res) {
  try {
    const students = await Student.find({}).populate('classSection').lean()
    return res.json({ students })
  } catch (e) {
    console.error('listAllStudents error', e)
    return res.status(500).json({ message: 'Server error' })
  }
}
import fs from 'fs'
import path from 'path'
// import xlsx from 'xlsx' // removed with xlsx-based features
import mongoose from 'mongoose'
import ClassSection from '../models/classSection.js'
import Student from '../models/student.js'
import Attendance from '../models/attendance.js'
import AttendanceSession from '../models/attendanceSession.js'
import LeaveRequest from '../models/leaveRequest.js'
import Complaint from '../models/complaint.js'
import User from '../models/user.js'

export async function adminDashboard(req, res) {
  try {
    const [totalTeachers, totalAdmins, totalClasses, totalStudents, pendingLeaves, pendingComplaints, todayAttendance] = await Promise.all([
      User.countDocuments({ role: 'teacher' }),
      User.countDocuments({ role: 'admin' }),
      ClassSection.countDocuments({}),
      Student.countDocuments({}),
      LeaveRequest.countDocuments({ status: 'pending' }),
      Complaint.countDocuments({ status: 'pending' }),
      Attendance.countDocuments({ createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } })
    ])
    return res.json({
      totals: { teachers: totalTeachers, admins: totalAdmins, classes: totalClasses, students: totalStudents },
      pending: { leaves: pendingLeaves, complaints: pendingComplaints },
      today: { attendanceScans: todayAttendance }
    })
  } catch (e) {
    console.error('adminDashboard error', e)
    return res.status(500).json({ message: 'Server error' })
  }
}

// Class & Section CRUD
export async function listClassSections(req, res) {
  try {
    const items = await ClassSection.find({}).populate('teacher').lean()
    return res.json({ items })
  } catch (e) {
    console.error('listClassSections error', e)
    return res.status(500).json({ message: 'Server error' })
  }
}

export async function createClassSection(req, res) {
  try {
    const { className, sectionName, teacherId } = req.body || {}
    if (!className || !sectionName) return res.status(400).json({ message: 'className and sectionName required' })
    const teacherField = (teacherId && mongoose.isValidObjectId(String(teacherId))) ? new mongoose.Types.ObjectId(String(teacherId)) : undefined
    const doc = await ClassSection.create({ className, sectionName, ...(teacherField ? { teacher: teacherField } : {}) })
    return res.status(201).json({ item: doc })
  } catch (e) {
    if (e?.code === 11000) return res.status(409).json({ message: 'Class/Section already exists' })
    console.error('createClassSection error', e)
    return res.status(500).json({ message: 'Server error' })
  }
}

export async function updateClassSection(req, res) {
  try {
    const id = req.params.id
    const { className, sectionName, teacherId } = req.body || {}
    const teacherField = (teacherId === null || teacherId === '') ? null : (mongoose.isValidObjectId(String(teacherId)) ? new mongoose.Types.ObjectId(String(teacherId)) : undefined)
    const update = { ...(className && { className }), ...(sectionName && { sectionName }) }
    if (teacherField !== undefined) update.teacher = teacherField
    const doc = await ClassSection.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true }
    )
    if (!doc) return res.status(404).json({ message: 'Not found' })
    return res.json({ item: doc })
  } catch (e) {
    if (e?.code === 11000) return res.status(409).json({ message: 'Class/Section already exists' })
    console.error('updateClassSection error', e)
    return res.status(500).json({ message: 'Server error' })
  }
}

export async function deleteClassSection(req, res) {
  try {
    const id = req.params.id
    const doc = await ClassSection.findByIdAndDelete(id)
    if (!doc) return res.status(404).json({ message: 'Not found' })
    // Optional: orphan students remain; admin can reassign later
    return res.json({ ok: true })
  } catch (e) {
    console.error('deleteClassSection error', e)
    return res.status(500).json({ message: 'Server error' })
  }
}

// View students by section
export async function listStudentsBySection(req, res) {
  try {
    const { classSectionId } = req.query || {}
    if (!classSectionId) return res.status(400).json({ message: 'classSectionId required' })
    const section = await ClassSection.findById(classSectionId).populate('students').lean()
    if (!section) return res.status(404).json({ message: 'ClassSection not found' })
    return res.json({ students: section.students })
  } catch (e) {
    console.error('listStudentsBySection error', e)
    return res.status(500).json({ message: 'Server error' })
  }
}

export async function addStudent(req, res) {
  try {
    const { classSectionId, studentId, name, rollNumber, interest, skillLevel, goals } = req.body || {}
    if (!classSectionId || !studentId || !name) return res.status(400).json({ message: 'classSectionId, studentId, name required' })
    const section = await ClassSection.findById(classSectionId)
    if (!section) return res.status(404).json({ message: 'ClassSection not found' })
    const existing = await Student.findOne({ studentId })
    if (existing) return res.status(409).json({ message: 'Student with this id already exists' })
    const student = await Student.create({
      studentId,
      name,
      rollNumber: rollNumber || studentId,
      classSection: section._id,
      interest: interest || '',
      skillLevel: Number.isFinite(Number(skillLevel)) ? Number(skillLevel) : 0,
      goals: goals || ''
    })
    await ClassSection.updateOne({ _id: section._id }, { $addToSet: { students: student._id } })
    return res.status(201).json({ item: student })
  } catch (e) {
    console.error('addStudent error', e)
    if (e?.code === 11000) return res.status(409).json({ message: 'Duplicate student' })
    return res.status(500).json({ message: 'Server error' })
  }
}

export async function deleteStudent(req, res) {
  try {
    const id = req.params.id
    const student = await Student.findById(id)
    if (!student) return res.status(404).json({ message: 'Not found' })
    await ClassSection.updateOne({ _id: student.classSection }, { $pull: { students: student._id } })
    await Student.deleteOne({ _id: student._id })
    return res.json({ ok: true })
  } catch (e) {
    console.error('deleteStudent error', e)
    return res.status(500).json({ message: 'Server error' })
  }
}





// bulkImportStudents removed

// Attendance reports with export
export async function attendanceReport(req, res) {
  try {
    const { classSectionId, studentId, date, format } = req.query || {}

    const match = {}
    if (classSectionId) match.classSection = new mongoose.Types.ObjectId(String(classSectionId))
    if (studentId) match.student = new mongoose.Types.ObjectId(String(studentId))
    if (date) {
      const day = new Date(date)
      const start = new Date(day.setHours(0, 0, 0, 0))
      const end = new Date(new Date(date).setHours(23, 59, 59, 999))
      match.createdAt = { $gte: start, $lte: end }
    }

    const pipeline = [
      {
        $lookup: {
          from: 'attendancesessions',
          localField: 'session',
          foreignField: '_id',
          as: 'session'
        }
      },
      { $unwind: '$session' },
      { $addFields: { classSection: '$session.classSection' } },
      { $match: match },
      {
        $lookup: {
          from: 'students',
          localField: 'student',
          foreignField: '_id',
          as: 'student'
        }
      },
      { $unwind: '$student' },
      {
        $project: {
          _id: 0,
          studentId: '$student.studentId',
          studentName: '$student.name',
          rollNumber: '$student.rollNumber',
          classSection: 1,
          scannedAt: 1,
          deviceId: 1
        }
      }
    ]

    const data = await Attendance.aggregate(pipeline)

    if (format === 'csv') {
      const header = ['studentId', 'studentName', 'rollNumber', 'classSection', 'scannedAt', 'deviceId']
      const csvLines = [header.join(',')]
      for (const row of data) {
        csvLines.push([
          row.studentId,
          row.studentName,
          row.rollNumber,
          String(row.classSection),
          new Date(row.scannedAt).toISOString(),
          row.deviceId
        ].map(v => `"${String(v).replace(/"/g, '""')}` + '"').join(','))
      }
      res.setHeader('Content-Type', 'text/csv')
      res.setHeader('Content-Disposition', 'attachment; filename="attendance.csv"')
      return res.send(csvLines.join('\n'))
    }

    return res.json({ items: data })
  } catch (e) {
    return res.status(500).json({ message: 'Server error' })
  }
}











// allocateSectionsFromXlsx removed
// uploadStudentsDirect removed

// Upload Excel directly (memory) or via URL, parse and insert unique students
export async function uploadStudentsDirect(req, res) {
  try {
    // Accept either uploaded file buffer or URL to fetch
    let buffer = null
    if (req.file && req.file.buffer) {
      buffer = req.file.buffer
    } else if (req.body?.fileUrl || req.query?.fileUrl) {
      const url = String(req.body?.fileUrl || req.query?.fileUrl)
      const axios = (await import('axios')).default
      const resp = await axios.get(url, { responseType: 'arraybuffer' })
      buffer = Buffer.from(resp.data)
    } else {
      return res.status(400).json({ message: 'Provide file (multipart field "file") or fileUrl' })
    }

    const workbook = xlsx.read(buffer, { type: 'buffer' })
    const first = workbook.SheetNames[0]
    const sheet = workbook.Sheets[first]
    const rows = xlsx.utils.sheet_to_json(sheet, { defval: '' })

    const students = []
    for (const r of rows) {
      const id = String(r.StudentID || r['Registration Number'] || r['registration number'] || r.ID || r.id || '').trim()
      const name = String(r.Name || r.NAME || '').trim()
      const klass = String(r.Class || r.class || r.Grade || '').trim()
      if (id && name && klass) students.push({ student_id: id, name, class: klass, section: '' })
    }
    if (!students.length) return res.status(400).json({ message: 'No valid rows found (need StudentID/Registration Number, Name, Class)' })

    const classes = new Set()
    let inserted = 0
    let skipped = 0
    const errors = []

    for (const s of students) {
      classes.add(s.class)
      try {
        const result = await Student.updateOne(
          { studentId: s.student_id },
          {
            $setOnInsert: {
              studentId: s.student_id,
              name: s.name,
              rollNumber: s.student_id,
              // section will be assigned later via ClassSection linkage; keep loose for now
            },
          },
          { upsert: true }
        )
        if (result.upsertedCount && result.upsertedCount > 0) inserted += 1
        else skipped += 1
      } catch (e) {
        skipped += 1
        errors.push({ student_id: s.student_id, error: 'insert failed' })
      }
    }

    return res.json({
      ok: true,
      message: `Successfully processed ${students.length} records`,
      inserted,
      skipped,
      classes: Array.from(classes),
      collection: 'students',
      db: mongoose.connection?.name || undefined,
      errors,
    })
  } catch (e) {
    console.error('uploadStudentsDirect error', e)
    return res.status(500).json({ message: 'Server error' })
  }
}

// Complaints
export async function listComplaints(req, res) {
  try {
    const items = await Complaint.find({}).sort({ createdAt: -1 }).populate('teacher').lean()
    return res.json({ items })
  } catch (e) {
    return res.status(500).json({ message: 'Server error' })
  }
}

export async function updateComplaintStatus(req, res) {
  try {
    const id = req.params.id
    const { status, adminComment } = req.body || {}
    if (!['pending', 'resolved', 'dismissed'].includes(status)) return res.status(400).json({ message: 'Invalid status' })
    const updated = await Complaint.findByIdAndUpdate(id, { $set: { status, adminComment } }, { new: true })
    if (!updated) return res.status(404).json({ message: 'Not found' })
    return res.json({ item: updated })
  } catch (e) {
    return res.status(500).json({ message: 'Server error' })
  }
}

// Leave management
export async function listAllLeaveRequests(req, res) {
  try {
    const items = await LeaveRequest.find({}).sort({ createdAt: -1 }).populate('teacher').lean()
    return res.json({ items })
  } catch (e) {
    return res.status(500).json({ message: 'Server error' })
  }
}

export async function updateLeaveRequest(req, res) {
  try {
    const id = req.params.id
    const { status, adminComment } = req.body || {}
    if (!['approved', 'rejected', 'pending'].includes(status)) return res.status(400).json({ message: 'Invalid status' })
    const updated = await LeaveRequest.findByIdAndUpdate(id, { $set: { status, adminComment } }, { new: true })
    if (!updated) return res.status(404).json({ message: 'Not found' })
    return res.json({ item: updated })
  } catch (e) {
    return res.status(500).json({ message: 'Server error' })
  }
}

