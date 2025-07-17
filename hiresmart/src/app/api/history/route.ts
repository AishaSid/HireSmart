import { NextResponse } from 'next/server'

// GET request
export async function GET(request: Request) {
  try {
    // Example: fetch user history
    return NextResponse.json({ message: 'GET successful', data: [] })
  } catch (error) {
    return NextResponse.json({ error: 'Error occurred' }, { status: 500 })
  }
}

// POST request
export async function POST(request: Request) {
  try {
    const body = await request.json()
    // Example: process uploaded CV or generate AI output
    return NextResponse.json({ message: 'POST successful', result: body })
  } catch (error) {
    return NextResponse.json({ error: 'POST failed' }, { status: 400 })
  }
}
