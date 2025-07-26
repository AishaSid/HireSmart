// app/types.ts
export interface CoverLetterRequest {
  jobTitle: string;
  companyName: string;
  hiringManager: string;
  jobDescription: string;
  keySkills: string;
  experience: string;
  tone: string;
}

export interface CoverLetterResponse {
  generatedLetter: string;
}