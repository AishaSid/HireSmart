import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import { Readable } from 'stream'

// MongoDB model
const CVSchema = new mongoose.Schema({
  user_id: String,
  filename: String,
  fileBuffer: Buffer,
  uploadedAt: { type: Date, default: Date.now }
})

const CV = mongoose.models.CV || mongoose.model('Cv', CVSchema)

// Connect to MongoDB
async function connectMongo() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI as string)
  }
}

// Route handler
export async function POST(req: NextRequest) {
  try {
    await connectMongo()

    const formData = await req.formData()
    const file = formData.get('file') as File
    const user_id = formData.get('user_id') as string

    if (!file || !user_id) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 })
    }

    // Read file into buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const newCV = new CV({
      user_id,
      filename: file.name,
      fileBuffer: buffer
    })

    await newCV.save()

    return NextResponse.json({ success: true, message: 'CV uploaded' })
  } catch (err) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
