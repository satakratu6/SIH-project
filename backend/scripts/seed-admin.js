import dotenv from 'dotenv'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import User from '../src/models/user.js'

dotenv.config()

async function main() {
  const MONGO_URI = process.env.MONGO_URI
  if (!MONGO_URI) {
    console.error('MONGO_URI not set in environment')
    process.exit(1)
  }

  const email = process.env.SEED_ADMIN_EMAIL || 'admin@example.com'
  const password = process.env.SEED_ADMIN_PASSWORD || 'AdminPassword123'
  const name = process.env.SEED_ADMIN_NAME || 'Seeded Admin'

  await mongoose.connect(MONGO_URI)
  try {
    const existing = await User.findOne({ email })
    if (existing) {
      console.log(`Admin already exists: ${email}`)
      return
    }
    const passwordHash = await bcrypt.hash(password, 10)
    await User.create({ name, email, role: 'admin', passwordHash, classes: [] })
    console.log('Seeded admin user:')
    console.log(`  Email: ${email}`)
    console.log(`  Password: ${password}`)
  } finally {
    await mongoose.disconnect()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
