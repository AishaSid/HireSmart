import { NextResponse } from "next/server"
import puppeteer from "puppeteer"
import { HtmlValidate } from "html-validate"

// Initialize browser once
let browser: import("puppeteer").Browser | null = null
async function getBrowser() {
  if (!browser) {
    try {
      const puppeteerModule = await import("puppeteer")
      browser = await puppeteerModule.default.launch({
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-accelerated-2d-canvas",
          "--no-first-run",
          "--no-zygote",
          "--disable-gpu"
        ]
      })
    } catch (err) {
      console.error("Failed to launch Puppeteer browser:", err)
      throw err
    }
  }
  return browser
}


// Validate HTML with more lenient rules
async function validateHtml(html: string) {
  try {
    const validator = new HtmlValidate({ 
      extends: ["html-validate:recommended"],
      rules: {
        "void-content": "off",
        "no-inline-style": "off",
        "require-sri": "off"
      }
    })
    const report = await validator.validateString(html)
    
    // Only throw on severe errors, not warnings
    const severeErrors = report.results.filter(result => 
      result.messages.some(msg => msg.severity === 2)
    )
    
    if (severeErrors.length > 0) {
      console.warn("HTML validation warnings:", JSON.stringify(report.results))
    }
  } catch (error) {
    console.warn("HTML validation skipped:", error)
    // Don't fail PDF generation due to validation issues
  }
}

// Ensure HTML has proper structure for PDF
function ensureValidHtml(htmlContent: string): string {
  let processedHtml = htmlContent.trim()
  
  // If it's not a complete HTML document, wrap it
  if (!processedHtml.includes('<!DOCTYPE') && !processedHtml.includes('<html')) {
    processedHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resume</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: white;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
        }
        .section {
            margin-bottom: 25px;
        }
        .section h2 {
            color: #2c3e50;
            border-bottom: 1px solid #bdc3c7;
            padding-bottom: 5px;
            margin-bottom: 15px;
        }
        @media print {
            body { margin: 0; padding: 10px; }
        }
    </style>
</head>
<body>
    ${processedHtml}
</body>
</html>`
  }
  
  return processedHtml
}

// PDF Generation API
export async function POST(req: Request) {
  let page: import("puppeteer").Page | null = null
  
  try {
    const { htmlContent, userId } = await req.json()

    // Validate input
    if (!htmlContent) {
      throw new Error("HTML content is required")
    }

    // Validate HTML (non-blocking)
    await validateHtml(htmlContent)

    // Ensure HTML is properly structured
    const processedHtml = ensureValidHtml(htmlContent)

    const browser = await getBrowser()
    page = await browser.newPage()

    // Configure page for better PDF generation
    await page.setViewport({ width: 1200, height: 1600 })

    // Log page errors for debugging
    page.on("console", (msg: any) => {
      if (msg.type() === 'error') {
        console.error("PAGE ERROR:", msg.text())
      }
    })
    page.on("pageerror", (err: Error) => console.error("PAGE ERROR:", err))

    // Set content with proper wait conditions
    await page.setContent(processedHtml, { 
      waitUntil: ["domcontentloaded", "networkidle0"],
      timeout: 30000
    })

    // Wait a bit more for any dynamic content
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Generate PDF with optimized settings
    const pdfBuffer = await page.pdf({ 
      format: "A4", 
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      },
      preferCSSPageSize: true
    })

    // Generate filename
    const filename = userId ? `resume-${userId}-${Date.now()}.pdf` : `resume-${Date.now()}.pdf`

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": pdfBuffer.length.toString(),
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
      },
    })

  } catch (error: any) {
    console.error("PDF Generation Error:", error)
    
    // Return more specific error messages
    let errorMessage = "Failed to generate PDF"
    if (error.message.includes("timeout")) {
      errorMessage = "PDF generation timeout - please try again"
    } else if (error.message.includes("HTML content")) {
      errorMessage = "Invalid HTML content provided"
    } else if (error.message) {
      errorMessage = error.message
    }

    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === "development" ? error.stack : undefined
      },
      { status: 500 }
    )
  } finally {
    // Always close the page
    if (page) {
      try {
        await page.close()
      } catch (error) {
        console.error("Error closing page:", error)
      }
    }
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  if (browser) {
    await browser.close()
    browser = null
  }
  process.exit(0)
})

process.on('SIGTERM', async () => {
  if (browser) {
    await browser.close()
    browser = null
  }
  process.exit(0)
})