import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mogodb'
import Template from '@/models/templates'

// Sample template data
const DEFAULT_TEMPLATES = [
  {
    name: "Modern Professional",
    category: "modern",
    description: "Clean layout perfect for tech jobs",
    imageUrl: "/templates/modern.jpg",
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
  },
  {
    name: "Minimal Clean",
    category: "minimal",
    description: "Simple, whitespace-focused professional layout",
    imageUrl: "/templates/minimal-clean.jpg",
    isPopular: false,
    rating: 4.5,
    downloads: 0,
    htmlContent: `<!DOCTYPE html><html><head><style>body { font-family: Arial, sans-serif; margin: 40px; } h1 { font-size: 2em; margin-bottom: .2em; } .section { margin-top: 1.5em; }</style></head><body><h1>John Doe</h1><p>Software Engineer</p><div class='section'><h2>Experience</h2><p>...</p></div><div class='section'><h2>Skills</h2><p>...</p></div></body></html>`,
    createdAt: new Date("2025-07-30T00:00:00.000Z"),
    updatedAt: new Date("2025-07-30T00:00:00.000Z")
  },
  {
    name: "Ethos Dark",
    category: "creative",
    description: "Dark-themed sections with bold typography",
    imageUrl: "/templates/ethos-dark.jpg",
    isPopular: true,
    rating: 4.7,
    downloads: 0,
    htmlContent: `<!DOCTYPE html><html><head><style>body { font-family: 'Helvetica Neue', sans-serif; background:#222; color:#eee; padding:40px; } h1 { font-size:2.5em; color:#0f9; } .nav { margin-bottom:2em; } section { margin-bottom:1.5em; }</style></head><body><h1>Jane Smith</h1><nav class='nav'>About • Experience • Skills</nav><section><h2>About</h2><p>...</p></section><section><h2>Experience</h2><p>...</p></section></body></html>`,
    createdAt: new Date("2025-07-30T00:00:00.000Z"),
    updatedAt: new Date("2025-07-30T00:00:00.000Z")
  },
  {
    name: "Bootstrap Two-Column",
    category: "modern",
    description: "Two-column layout with sidebar and main content",
    imageUrl: "/templates/bootstrap-two-col.jpg",
    isPopular: false,
    rating: 4.6,
    downloads: 0,
    htmlContent: `<!DOCTYPE html><html><head><link href='https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/css/bootstrap.min.css' rel='stylesheet'></head><body class='p-4'><div class='row'><div class='col-4 bg-light p-3'><h2>John Doe</h2><p>Contact info<br>Skills</p></div><div class='col-8'><h3>Experience</h3><p>...</p><h3>Education</h3><p>...</p></div></div></body></html>`,
    createdAt: new Date("2025-07-30T00:00:00.000Z"),
    updatedAt: new Date("2025-07-30T00:00:00.000Z")
  }
]


export async function GET() {
  try {
  //  await connectDB()
    
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