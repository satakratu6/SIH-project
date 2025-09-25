import mongoose from 'mongoose'

const TimetableEntrySchema = new mongoose.Schema(
  {
    day: { type: String, required: true },
    period: { type: String },
    subject: { type: String, required: true },
    room: { type: String },
    timeFrom: { type: String },
    timeTo: { type: String }
  },
  { _id: false }
)

const TimetableSchema = new mongoose.Schema(
  {
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    entries: { type: [TimetableEntrySchema], default: [] }
  },
  { timestamps: true }
)

export default mongoose.model('Timetable', TimetableSchema)



