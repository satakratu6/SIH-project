import mongoose from 'mongoose'

const AttendanceSchema = new mongoose.Schema(
  {
    session: { type: mongoose.Schema.Types.ObjectId, ref: 'AttendanceSession', required: true, index: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    deviceId: { type: String, required: true },
    scannedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
)

AttendanceSchema.index({ session: 1, student: 1 }, { unique: true })

export default mongoose.model('Attendance', AttendanceSchema)



