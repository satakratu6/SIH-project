import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['teacher', 'admin'], required: true, index: true },
    classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ClassSection' }]
  },
  { timestamps: true }
)

export default mongoose.model('User', UserSchema)



