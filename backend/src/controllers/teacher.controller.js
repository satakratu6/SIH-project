import ClassSection from '../models/classSection.js'
import Student from '../models/student.js'
import LeaveRequest from '../models/leaveRequest.js'
import Timetable from '../models/timetable.js'

export async function listStudents(req, res) {
  try {
    const classSectionId = req.query.classSectionId || (req.currentUser?.classes?.[0])
    if (!classSectionId) return res.status(400).json({ message: 'classSectionId required' })
    const section = await ClassSection.findById(classSectionId).populate('students').lean()
    if (!section) return res.status(404).json({ message: 'ClassSection not found' })
    return res.json({ classSectionId, students: section.students })
  } catch (e) {
    return res.status(500).json({ message: 'Server error' })
  }
}

export async function createLeaveRequest(req, res) {
  try {
    const { fromDate, toDate, reason } = req.body || {}
    if (!fromDate || !toDate || !reason) return res.status(400).json({ message: 'fromDate, toDate, reason required' })
    const lr = await LeaveRequest.create({ teacher: req.currentUser._id, fromDate, toDate, reason })
    return res.json({ ok: true, id: lr._id.toString() })
  } catch (e) {
    return res.status(500).json({ message: 'Server error' })
  }
}

export async function listLeaveRequests(req, res) {
  try {
    const items = await LeaveRequest.find({ teacher: req.currentUser._id }).sort({ createdAt: -1 }).lean()
    return res.json({ items })
  } catch (e) {
    return res.status(500).json({ message: 'Server error' })
  }
}

export async function upsertTimetable(req, res) {
  try {
    const { entries } = req.body || {}
    if (!Array.isArray(entries)) return res.status(400).json({ message: 'entries must be array' })
    const tt = await Timetable.findOneAndUpdate(
      { teacher: req.currentUser._id },
      { $set: { entries } },
      { new: true, upsert: true }
    )
    return res.json({ ok: true, timetable: tt })
  } catch (e) {
    return res.status(500).json({ message: 'Server error' })
  }
}

export async function getTimetable(req, res) {
  try {
    const tt = await Timetable.findOne({ teacher: req.currentUser._id }).lean()
    return res.json({ timetable: tt || { teacher: req.currentUser._id, entries: [] } })
  } catch (e) {
    return res.status(500).json({ message: 'Server error' })
  }
}



