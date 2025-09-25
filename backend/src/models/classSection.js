import mongoose from 'mongoose'

const ClassSectionSchema = new mongoose.Schema(
  {
    className: { type: String, required: true },
    sectionName: { type: String, required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }]
  },
  { timestamps: true }
)

ClassSectionSchema.index({ className: 1, sectionName: 1 }, { unique: true })

export default mongoose.model('ClassSection', ClassSectionSchema)



