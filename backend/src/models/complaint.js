import mongoose from 'mongoose'

const complaintSchema = new mongoose.Schema({
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['pending', 'resolved', 'dismissed'], default: 'pending' },
  response: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

complaintSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

const Complaint = mongoose.model('Complaint', complaintSchema)
export default Complaint
