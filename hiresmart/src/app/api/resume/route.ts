import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // adjust import as needed
import puppeteer from 'puppeteer';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const { userId, templateId, htmlContent } = await request.json();

    // Generate PDF from htmlContent
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    // Upload PDF to Supabase Storage
    const fileName = `resumes/${userId}/${uuidv4()}.pdf`;
    const { error } = await supabase.storage.from('your-bucket').upload(fileName, pdfBuffer, {
      contentType: 'application/pdf',
    });
    if (error) throw error;

    return NextResponse.json({ success: true, fileName });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}