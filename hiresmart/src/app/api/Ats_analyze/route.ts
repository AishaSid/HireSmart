import { NextResponse } from 'next/server'
import { analyzeResume } from '@/lib/ai'

export const maxDuration = 300
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const jobDescription = formData.get('jobDescription') as string

    // Validate inputs
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' }, 
        { status: 400 }
      )
    }

    // File type validation
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
    
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF, DOC, and DOCX are allowed.' },
        { status: 400 }
      )
    }

    // File size validation (10MB max)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      )
    }

    // Job description validation (15 characters min)
    if (!jobDescription || jobDescription.trim().length < 15) {
      return NextResponse.json(
        { error: 'Job description must be at least 15 characters long' },
        { status: 400 }
      )
    }

    // Process with AI
    const analysis = await analyzeResume(file, jobDescription)

    // Return successful response
    return new NextResponse(JSON.stringify({
      success: true,
      data: analysis
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
      }
    })

  } catch (error: any) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to analyze resume' },
      { status: 500 }
    )
  }
}