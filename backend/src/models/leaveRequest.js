import mongoose from 'mongoose'

const LeaveRequestSchema = new mongoose.Schema(
  {
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
    adminComment: { type: String }
  },
  { timestamps: true }
)

export default mongoose.model('LeaveRequest', LeaveRequestSchema)



