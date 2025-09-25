import mongoose from 'mongoose'

const StudentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rollNumber: { type: String, required: true },
    studentId: { type: String, required: true, unique: true, index: true },
    classSection: { type: mongoose.Schema.Types.ObjectId, ref: 'ClassSection', index: true }
  },
  { timestamps: true }
)

StudentSchema.index({ classSection: 1, rollNumber: 1 }, { unique: true })

export default mongoose.model('Student', StudentSchema)



