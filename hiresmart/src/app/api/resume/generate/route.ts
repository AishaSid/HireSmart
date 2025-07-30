import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import mongoose from "mongoose";
import Resume from "@/models/resume";

export async function POST(req: Request) {
  try {
    const { templateId, userId, commands } = await req.json();

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
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.3,
        topP: 0.95,
        maxOutputTokens: 4000,
      }
    });

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
            {
              text: `
Convert the attached resume into a professional HTML resume.
Style: ${template.description}, ${template.style}.
User commands: ${commands || "None"}.
Return only a complete valid HTML document with <html> and <body> tags.
No explanation or backticks.
              `
            }
          ]
        }
      ]
    });

    const response = await result.response;
    let generatedResume = response.text().trim();

    // Remove markdown/code fencing if still present
    generatedResume = generatedResume.replace(/```html\n?/g, '').replace(/```/g, '').trim();

    if (!/^<(!DOCTYPE html>|html[\s>])/i.test(generatedResume)) {
      throw new Error("Generated content is not valid HTML");
    }

    await saveGeneratedResume(userId, generatedResume, templateId);

    return NextResponse.json({
      success: true,
      generatedResume,
      templateUsed: templateId,
      generatedAt: new Date().toISOString()
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    }, { status: 500 });
  }
}

// --- Template Info (hardcoded for now) ---
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
    // Save to DB if needed
  } catch (error) {
    console.error("Error saving resume:", error);
  }
}
