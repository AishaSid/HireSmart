import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mogodb';
import Resume from '@/models/resume';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { resumeId, jobDescription } = req.body;
    await connectDB();

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Call your generative AI API here
    const optimizedContent = await callGenerativeAI({
      originalResume: resume.originalContent,
      jobDescription
    });

    resume.optimizedContent = optimizedContent;
    resume.jobDescription = jobDescription;
    await resume.save();

    return res.status(200).json({ 
      success: true, 
      optimizedResume: resume 
    });
  } catch (error) {
    console.error('Optimization error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to optimize resume' 
    });
  }
}

async function callGenerativeAI({ originalResume, jobDescription }: { 
  originalResume: string; 
  jobDescription: string 
}) {
  // Replace with your actual generative AI API call
  const response = await fetch('YOUR_GENERATIVE_AI_API_ENDPOINT', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GENERATIVE_AI_API_KEY}`
    },
    body: JSON.stringify({
      resume: originalResume,
      job_description: jobDescription
    })
  });

  if (!response.ok) {
    throw new Error('AI API request failed');
  }

  const data = await response.json();
  return data.optimized_resume;
}