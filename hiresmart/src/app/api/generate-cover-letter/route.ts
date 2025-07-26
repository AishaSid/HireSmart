// app/api/generate-cover-letter/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const {
      jobTitle,
      companyName,
      hiringManager,
      jobDescription,
      keySkills,
      experience,
      tone
    } = await req.json();

    // Validate required fields
    if (!jobTitle || !companyName) {
      return NextResponse.json(
        { error: "Job title and company name are required" },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Create a detailed prompt
    const prompt = `
      Generate a ${tone} cover letter for a ${jobTitle} position at ${companyName}.
      ${hiringManager ? `Address it to: ${hiringManager}` : "Address it to Hiring Manager"}
      
      Job Description:
      ${jobDescription || "Not provided"}
      
      Applicant's Key Skills: 
      ${keySkills || "Various relevant skills"}
      
      Relevant Experience:
      ${experience || "Significant experience in the field"}
      
      Include placeholders for personal details where needed. Use professional business letter format.
      Keep it to 3-4 paragraphs. Do not include any markdown formatting.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ generatedLetter: text });
  } catch (error: any) {
    console.error("Gemini Error:", error);
    return NextResponse.json(
      { error: "Failed to generate cover letter: " + error.message },
      { status: 500 }
    );
  }
}