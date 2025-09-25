import mongoose from 'mongoose';

export async function connectToDatabase(): Promise<typeof mongoose> {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI is not set');
  }
  mongoose.set('strictQuery', true);
  return mongoose.connect(mongoUri, {
    autoIndex: true
  });
}



