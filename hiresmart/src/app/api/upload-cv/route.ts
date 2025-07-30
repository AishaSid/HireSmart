import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

// Define the CV schema and model only once
const CVSchema = new mongoose.Schema({
  user_id: String,
  filename: String,
  fileBuffer: Buffer,
  uploadedAt: { type: Date, default: Date.now }
})

const CV = mongoose.models.Cv || mongoose.model('Cv', CVSchema);

// Connect to MongoDB
async function connectMongo() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI as string, {
      dbName: 'test', // Explicitly use the 'test' database
    });
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
  } catch (err: any) {
    console.error('Upload error:', err.message || err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectMongo();
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get('user_id');
    if (!user_id) {
      return NextResponse.json({ error: 'Missing user_id' }, { status: 400 });
    }

    let cv = await CV.findOne({ user_id });
    if (!cv) {
     cv = await CV.findOne();
    }
    if (!cv ) {
      return NextResponse.json({ error: 'CV not found' }, { status: 404 });
    }

    return new NextResponse(cv.fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${cv.filename || 'cv.pdf'}"`,
      },
    });
  } catch (err: any) {
    console.error('Fetch error:', err.message || err);
    return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
  }
}
