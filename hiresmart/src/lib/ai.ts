import { GoogleGenerativeAI } from "@google/generative-ai";
import * as mammoth from "mammoth";
import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy, type PDFPageProxy } from 'pdfjs-dist';

// Configure PDF.js worker
GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/build/pdf.worker.min.js';

interface ATSAnalysis {
  score: number;
  missingKeywords: string[];
  formattingIssues: string[];
  optimizationSuggestions: string[];
  strengths: string[];
}

/**
 * Extract text from PDF files using pdfjs-dist
 * @param arrayBuffer - PDF file contents as ArrayBuffer
 * @returns Extracted text
 */
async function extractTextFromPDF(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    const pdf: PDFDocumentProxy = await getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
    let text = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page: PDFPageProxy = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item: any) => item.str).join(' ') + '\n';
    }
    
    return text;
  } catch (error) {
    console.error("PDF extraction error:", error);
    throw new Error("Failed to extract text from PDF");
  }
}

/**
 * Extract text from various file types
 * @param file - Uploaded file
 * @returns Extracted text
 */
export async function extractTextFromFile(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    
    if (file.type === 'application/pdf') {
      return await extractTextFromPDF(arrayBuffer);
    } 
    else if (
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
      file.type === 'application/msword'
    ) {
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    }
    else {
      throw new Error('Unsupported file type');
    }
  } catch (error: any) {
    console.error("Text extraction error:", error);
    throw new Error(`Failed to extract text: ${error.message}`);
  }
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
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Extract text from resume
    const resumeText = await extractTextFromFile(file);
    console.log(`Extracted text (${resumeText.length} characters)`);

    // Construct prompt for Gemini
    const prompt = `
Analyze this resume for ATS compatibility with this job description.
Provide output in strict JSON format only:

JOB DESCRIPTION:
${jobDescription}

RESUME CONTENT:
${resumeText}

REQUIRED JSON STRUCTURE:
{
  "score": number (0-100),
  "missingKeywords": string[] (top 5-10 missing keywords),
  "formattingIssues": string[] (3-5 major formatting issues),
  "optimizationSuggestions": string[] (5-7 actionable suggestions),
  "strengths": string[] (3-5 resume strengths)
}
`;

    // Call Gemini API
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json",
      },
    });

    let responseText = result.response.text();
    console.log("Raw Gemini response:", responseText);
    
    // Clean Gemini response (sometimes adds markdown)
    responseText = responseText.replace(/```json|```/g, '').trim();
    
    // Handle cases where Gemini adds extra text
    const jsonStart = responseText.indexOf('{');
    const jsonEnd = responseText.lastIndexOf('}') + 1;
    if (jsonStart !== -1 && jsonEnd !== -1) {
      responseText = responseText.substring(jsonStart, jsonEnd);
    }
    
    // Parse and validate the response
    const analysis = JSON.parse(responseText);
    
    // Validate response structure
    const requiredKeys = ['score', 'missingKeywords', 'formattingIssues', 'optimizationSuggestions', 'strengths'];
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