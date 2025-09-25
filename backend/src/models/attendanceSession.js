import mongoose from 'mongoose'

const AttendanceSessionSchema = new mongoose.Schema(
  {
    classSection: { type: mongoose.Schema.Types.ObjectId, ref: 'ClassSection', required: false, index: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date },
    active: { type: Boolean, default: true },
    usedDeviceIds: { type: [String], default: [] }
  },
  { timestamps: true }
)

export default mongoose.model('AttendanceSession', AttendanceSessionSchema)



