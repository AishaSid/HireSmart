import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mogodb'
import Template from '@/models/templates'

// Sample template data
const DEFAULT_TEMPLATES = [
  {
    name: "Modern Professional",
    category: "modern",
    description: "Clean layout perfect for tech jobs",
    imageUrl: "/template-modern.jpg", // You'll need to add this image
    htmlContent: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Helvetica', Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; margin-bottom: 30px; }
    h1 { color: #2c3e50; margin-bottom: 5px; }
    h2 { color: #3498db; border-bottom: 2px solid #3498db; padding-bottom: 5px; }
    .section { margin-bottom: 20px; }
    .job { margin-bottom: 15px; }
    .date { color: #7f8c8d; font-style: italic; }
  </style>
</head>
<body>
  <div class="header">
    <h1>{{name}}</h1>
    <p>{{title}} • {{email}} • {{phone}} • {{location}}</p>
  </div>
  
  <div class="section">
    <h2>SUMMARY</h2>
    <p>{{summary}}</p>
  </div>
  
  <div class="section">
    <h2>EXPERIENCE</h2>
    {{#each experience}}
    <div class="job">
      <h3>{{position}}</h3>
      <p>{{company}} • <span class="date">{{startDate}} - {{endDate}}</span></p>
      <ul>
        {{#each bullets}}
        <li>{{this}}</li>
        {{/each}}
      </ul>
    </div>
    {{/each}}
  </div>
</body>
</html>`,
    isPopular: true,
    rating: 4.8
  }
]

export async function GET() {
  try {
    await connectDB()
    
    // Check if templates exist, if not insert defaults
    const count = await Template.countDocuments()
    if (count === 0) {
      await Template.insertMany(DEFAULT_TEMPLATES)
    }

    const templates = await Template.find()
    return NextResponse.json({ success: true, data: templates })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch templates' },
      { status: 500 }
    )
  }
}