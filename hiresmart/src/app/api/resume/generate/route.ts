import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import mongoose from "mongoose";
import Resume from "@/models/resume";

export async function POST(req: Request) {
  try {
    const { templateId, userId, jobTitle, jobDescription } = await req.json();

    if (!templateId || !userId) {
      throw new Error("Missing required fields");
    }

    const template = await getTemplateDetails(templateId);

    const resumeDoc = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/upload-cv?user_id=${userId}`);
    const pdfBuffer = Buffer.from(await resumeDoc.arrayBuffer());
    const base64Pdf = pdfBuffer.toString("base64");

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Gemini API key not configured");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash", // Using 1.5-flash for better HTML generation
      generationConfig: {
        temperature: 0.2, // Lower temperature for more structured output
        topP: 0.9,
        maxOutputTokens: 4000,
      }
    });

    // More explicit prompt with HTML structure requirements
    const prompt = `
    Generate a professional resume in STRICT HTML5 format based on the attached CV and these requirements:

    JOB TITLE: ${jobTitle || 'Not specified'}
    ${jobDescription ? `JOB DESCRIPTION KEY POINTS:\n${jobDescription.substring(0, 500)}` : ''}

    TEMPLATE STYLE: ${template.style} must be followed in resume 

    REQUIREMENTS:
    1. Return ONLY valid HTML5 with this EXACT structure:
       <!DOCTYPE html>
       <html lang="en">
       <head>
         <meta charset="UTF-8">
         <meta name="viewport" content="width=device-width, initial-scale=1.0">
         <title>Resume</title>
         <style>
           /* Basic professional styling */
           body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0 auto; max-width: 800px; padding: 20px; }
           h1 { color: #2c3e50; border-bottom: 2px solid #eee; padding-bottom: 10px; }
           h2 { color: #3498db; margin-top: 20px; }
           .section { margin-bottom: 20px; }
           ul { padding-left: 20px; }
         </style>
       </head>
       <body>
         <!-- Resume content here -->
       </body>
       </html>

    2. Content must include:
       - Name and contact info at top
       - Professional summary
       - Relevant work experience (most recent first)
       - Education
       - Technical skills matching ${jobTitle || 'the position'}

    3. Formatting rules:
       - Use semantic HTML5 tags (section, article, etc.)
       - Keep bullet points on one line (• Item one • Item two)
       - No markdown or backticks
       - No explanations or comments
       - Quantify achievements where possible

    4. Important:
       - Tailor content specifically for ${jobTitle || 'this position'}
       - Remove irrelevant jobs/education
       - Highlight transferable skills
       - Use action verbs (developed, implemented, optimized)
       ${jobDescription ? '- Match skills to the job requirements' : ''}

    FAILURE TO FOLLOW THESE INSTRUCTIONS WILL RESULT IN INVALID OUTPUT
    `;

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: "application/pdf",
                data: base64Pdf,
              }
            },
            { text: prompt }
          ]
        }
      ]
    });

    const response = await result.response;
    let generatedResume = response.text().trim();

    // Strict HTML validation and cleanup
    generatedResume = ensureValidHtml(generatedResume);

    if (!isValidHtml(generatedResume)) {
      throw new Error("Generated content failed HTML validation");
    }

    await saveGeneratedResume(userId, generatedResume, templateId);

    return NextResponse.json({
      success: true,
      generatedResume,
      templateUsed: templateId,
      generatedAt: new Date().toISOString()
    });

  } catch (error: any) {
    console.error("Resume generation error:", error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    }, { status: 500 });
  }
}

// Strict HTML validation
function isValidHtml(html: string): boolean {
  const requiredTags = ['<!DOCTYPE html>', '<html', '<head', '<body', '</html>'];
  return requiredTags.every(tag => html.includes(tag));
}

// Ensure proper HTML structure
function ensureValidHtml(content: string): string {
  let html = content.trim();

  // Remove all markdown artifacts
  html = html.replace(/```html?/g, '').replace(/```/g, '').trim();

  // Ensure doctype exists
  if (!html.startsWith('<!DOCTYPE html>')) {
    html = `<!DOCTYPE html>${html}`;
  }

  // Ensure html tags exist
  if (!html.includes('<html')) {
    html = html.replace('<!DOCTYPE html>', `<!DOCTYPE html>\n<html lang="en">`);
  }
  if (!html.includes('</html>')) {
    html = `${html}\n</html>`;
  }

  // Ensure head and body exist
  if (!html.includes('<head>')) {
    html = html.replace('<html', '<html>\n<head>\n<meta charset="UTF-8">\n<title>Resume</title>\n</head>');
  }
  if (!html.includes('<body>')) {
    html = html.replace('</head>', '</head>\n<body>');
    html = html.replace('</html>', '</body>\n</html>');
  }

  // Clean up whitespace
  html = html
    .replace(/\s*\n\s*•\s*\n\s*/g, ' • ')
    .replace(/>\s+</g, '><')
    .replace(/\s{2,}/g, ' ')
    .trim();

  return html;
}

// --- Template Info ---
async function getTemplateDetails(templateId: string) {
  return {
    id: templateId,
    name: "Professional Modern",
    description: "Clean, contemporary layout with emphasis on skills and experience",
    format: "Single column with sections",
    style: "Modern professional with clean typography and subtle accents"
  };
}

// --- Save Resume ---
async function saveGeneratedResume(userId: string, content: string, templateId: string) {
  try {
    // Save to DB implementation
  } catch (error) {
    console.error("Error saving resume:", error);
  }
}