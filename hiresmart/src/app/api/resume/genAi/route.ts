import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { originalContent } = await req.json();

    // 1. Prepare the Gemini API request
    const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
    const apiKey = process.env.GEMINI_API_KEY || "AIzaSyD-9tS6dFi82NaoD8oZ0WvwJ1U1Yvw3hYw"; // Fallback to your key
    
    const aiResponse = await fetch(`${apiUrl}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Please optimize this resume:\n\n${originalContent}\n\nReturn only the optimized resume content with no additional commentary or formatting.`
          }]
        }]
      }),
    });

    if (!aiResponse.ok) {
      const errorData = await aiResponse.json();
      console.error("Gemini API Error:", errorData);
      throw new Error(`AI API failed with status ${aiResponse.status}`);
    }

    // 2. Parse Gemini's response format
    const responseData = await aiResponse.json();
    const optimizedResume = responseData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!optimizedResume) {
      throw new Error("No optimized content received from AI");
    }

    // 3. Return optimized resume
    return NextResponse.json({ 
      success: true, 
      optimized_resume: optimizedResume 
    });

  } catch (error: any) {
    console.error("Resume Generation Error:", error);
    return NextResponse.json(
      { 
        error: error.message || "Failed to generate resume",
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}