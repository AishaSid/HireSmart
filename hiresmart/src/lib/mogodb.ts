import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cvbuilder'

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: 'Cv',
    })
    console.log('MongoDB connected')
  } catch (error) {
    console.error('MongoDB connection error:', error)
  }
}
