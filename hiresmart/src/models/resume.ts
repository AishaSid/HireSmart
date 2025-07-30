import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase'; // adjust import as needed
import puppeteer from 'puppeteer';
import { v4 as uuidv4 } from 'uuid';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { htmlContent, userId } = req.body; // Pass HTML and userId from client

      // Generate PDF
      const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
      await browser.close();

      // Upload to Supabase Storage
      const fileName = `resumes/${userId}/${uuidv4()}.pdf`;
      const { error } = await supabase.storage.from('your-bucket').upload(fileName, pdfBuffer, {
        contentType: 'application/pdf',
      });
      if (error) throw error;

      return res.status(200).json({ success: true, fileName });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  if (req.method === 'GET') {
    try {
      const { fileName } = req.query;
      const { data, error } = await supabase.storage.from('your-bucket').download(fileName as string);
      if (error || !data) throw error;

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
      res.send(data); // Stream the PDF
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}