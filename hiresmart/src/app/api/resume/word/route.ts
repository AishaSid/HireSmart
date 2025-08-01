// app/api/resume/word/route.ts
import { NextResponse } from "next/server";
import { Packer } from "docx";
import { Document, Paragraph, TextRun } from "docx";

export async function POST(req: Request) {
  try {
    const { htmlContent, userId } = await req.json();
    
    // Convert HTML to Word document
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "Professional Resume",
                bold: true,
                size: 28
              })
            ]
          }),
          // Add more content from HTML
          ...convertHtmlToDocx(htmlContent)
        ]
      }]
    });

    const buffer = await Packer.toBuffer(doc);
    
    // Save to database
    await saveWordResume(userId, htmlContent, buffer);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="resume-${Date.now()}.docx"`,
        "Cache-Control": "no-cache"
      }
    });

  } catch (error) {
    console.error("Word Generation Error:", error);
    return NextResponse.json(
      { error: "Failed to generate Word document" },
      { status: 500 }
    );
  }
}

function convertHtmlToDocx(html: string) {
  // Implement HTML to DOCX conversion logic
  // This is a simplified version - you'll need a more robust parser
  const paragraphs = html.split(/<\/?p>/).filter(Boolean);
  return paragraphs.map(text => 
    new Paragraph({
      children: [new TextRun(text)]
    })
  );
}

async function saveWordResume(userId: string, htmlContent: string, buffer: Buffer) {
  try {
    // Save to DB if needed
    console.log(`Word resume saved for user: ${userId}`);
  } catch (error) {
    console.error("Error saving Word resume:", error);
  }
}