import { GoogleGenerativeAI, type Part } from "@google/generative-ai";

interface ATSAnalysis {
  score: number;
  missingKeywords: string[];
  foundKeywords: string[];
  formattingIssues: string[];
  optimizationSuggestions: string[];
  strengths: string[];
}

/**
 * Analyze resume with Google Gemini
 * @param file - Uploaded resume file
 * @param jobDescription - Job description text
 * @returns Analysis results
 */
export async function analyzeResume(file: File, jobDescription: string): Promise<ATSAnalysis> {
  try {
    // Validate API key
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY environment variable is not set");
    }
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json",
      },
    });

    // Convert file to Google Generative AI format
    const fileArrayBuffer = await file.arrayBuffer();
    const fileBase64 = Buffer.from(fileArrayBuffer).toString('base64');
    
    // Create parts for Gemini
    const filePart: Part = {
      inlineData: {
        mimeType: file.type,
        data: fileBase64
      }
    };
    
    const promptPart: Part = {
      text: `
You are an expert ATS (Applicant Tracking System) analyzer. 
Perform a comprehensive analysis of this resume against the provided job description.

JOB DESCRIPTION:
${jobDescription}

ANALYSIS REQUIREMENTS:
1. Calculate an ATS compatibility score (0-100)
2. Identify keywords:
   - List the top 10-15 most important keywords found in the resume
   - List the top 10 most critical missing keywords from the job description
3. Identify 3-5 major formatting issues
4. Provide 5-7 actionable optimization suggestions
5. Highlight 3-5 key strengths of the resume

OUTPUT FORMAT (JSON ONLY):
{
  "score": number,
  "foundKeywords": string[],
  "missingKeywords": string[],
  "formattingIssues": string[],
  "optimizationSuggestions": string[],
  "strengths": string[]
}
`
    };

    // Call Gemini API with the file and text prompt
    const result = await model.generateContent({
      contents: [{
        role: "user",
        parts: [promptPart, filePart]
      }]
    });

    let responseText = result.response.text();
    console.log("Raw Gemini response:", responseText);
    
    // Clean Gemini response
    responseText = responseText.replace(/```json|```/g, '').trim();
    
    // Extract JSON from response
    const jsonStart = responseText.indexOf('{');
    const jsonEnd = responseText.lastIndexOf('}') + 1;
    if (jsonStart !== -1 && jsonEnd !== -1) {
      responseText = responseText.substring(jsonStart, jsonEnd);
    }
    
    // Parse and validate the response
    const analysis = JSON.parse(responseText);
    
    // Validate response structure
    const requiredKeys = [
      'score', 
      'foundKeywords', 
      'missingKeywords', 
      'formattingIssues', 
      'optimizationSuggestions', 
      'strengths'
    ];
    
    for (const key of requiredKeys) {
      if (!(key in analysis)) {
        throw new Error(`Invalid analysis format: Missing ${key} property`);
      }
    }
    
    return analysis;
  } catch (error: any) {
    console.error("Gemini analysis error:", error);
    throw new Error("AI analysis failed: " + error.message);
  }
}