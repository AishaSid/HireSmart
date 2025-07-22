"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Sparkles, Download, Copy, RefreshCw } from "lucide-react"

interface CoverLetterProps {
  onBack: () => void
}

export function CoverLetter({ onBack }: CoverLetterProps) {
  const [formData, setFormData] = useState({
    jobTitle: "",
    companyName: "",
    hiringManager: "",
    jobDescription: "",
    keySkills: "",
    experience: "",
    tone: "professional",
  })

  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedLetter, setGeneratedLetter] = useState("")
  const [showPreview, setShowPreview] = useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const sampleLetter = `Dear ${formData.hiringManager || "Hiring Manager"},

I am writing to express my strong interest in the ${formData.jobTitle || "Software Engineer"} position at ${formData.companyName || "your company"}. With my extensive background in software development and passion for creating innovative solutions, I am confident that I would be a valuable addition to your team.

In my previous roles, I have developed expertise in ${formData.keySkills || "various technologies"} and have successfully ${formData.experience || "delivered multiple projects"}. I am particularly drawn to this opportunity because of your company's commitment to innovation and excellence in the technology sector.

The job description mentions requirements that align perfectly with my skill set. I have hands-on experience with the technologies and methodologies mentioned, and I am excited about the possibility of contributing to your team's continued success.

I would welcome the opportunity to discuss how my background and enthusiasm can contribute to ${formData.companyName || "your company"}'s goals. Thank you for considering my application. I look forward to hearing from you soon.

Sincerely,
[Your Name]`

    setGeneratedLetter(sampleLetter)
    setIsGenerating(false)
    setShowPreview(true)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter)
  }

  if (showPreview) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => setShowPreview(false)} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Form
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCopy} className="flex items-center gap-2 bg-transparent">
              <Copy className="h-4 w-4" />
              Copy Text
            </Button>
            <Button variant="outline" onClick={handleGenerate} className="flex items-center gap-2 bg-transparent">
              <RefreshCw className="h-4 w-4" />
              Regenerate
            </Button>
            <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-500 flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl">Generated Cover Letter</CardTitle>
            <CardDescription>
              AI-generated cover letter for {formData.jobTitle} at {formData.companyName}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-white shadow-lg rounded-lg p-8 animate-in fade-in duration-500">
              <div className="whitespace-pre-line text-gray-800 leading-relaxed">{generatedLetter}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

    useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
       <h1 className="text-5xl font-bold text-center bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
          Generate Cover Letter
        </h1>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Job Information */}
        <Card className="animate-in slide-in-from-bottom-4 duration-500">
          <CardHeader>
            <CardTitle className="text-2xl text-indigo-500">Job Information</CardTitle>
            <CardDescription>Tell us about the position you're applying for</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  id="jobTitle"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData((prev) => ({ ...prev, jobTitle: e.target.value }))}
                  placeholder="e.g., Senior Software Engineer"
                />
              </div>
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, companyName: e.target.value }))}
                  placeholder="e.g., TechCorp Inc."
                />
              </div>
            </div>
            <div>
              <Label htmlFor="hiringManager">Hiring Manager Name (Optional)</Label>
              <Input
                id="hiringManager"
                value={formData.hiringManager}
                onChange={(e) => setFormData((prev) => ({ ...prev, hiringManager: e.target.value }))}
                placeholder="e.g., John Smith"
              />
            </div>
          </CardContent>
        </Card>

        {/* Job Description */}
        <Card className="animate-in slide-in-from-bottom-4 duration-500">
          <CardHeader>
            <CardTitle className="text-2xl text-indigo-500">Job Description</CardTitle>
            <CardDescription>Paste the job description or key requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.jobDescription}
              onChange={(e) => setFormData((prev) => ({ ...prev, jobDescription: e.target.value }))}
              placeholder="Paste the job description here or describe the key requirements..."
              rows={6}
            />
          </CardContent>
        </Card>

        {/* Your Background */}
        <Card className="animate-in slide-in-from-bottom-4 duration-500">
          <CardHeader>
            <CardTitle className="text-2xl text-indigo-500">Your Background</CardTitle>
            <CardDescription>Help us understand your qualifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="keySkills">Key Skills & Technologies</Label>
              <Input
                id="keySkills"
                value={formData.keySkills}
                onChange={(e) => setFormData((prev) => ({ ...prev, keySkills: e.target.value }))}
                placeholder="e.g., React, Node.js, Python, AWS, Docker"
              />
            </div>
            <div>
              <Label htmlFor="experience">Relevant Experience</Label>
              <Textarea
                id="experience"
                value={formData.experience}
                onChange={(e) => setFormData((prev) => ({ ...prev, experience: e.target.value }))}
                placeholder="Describe your relevant work experience, achievements, and projects..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Tone Selection */}
        <Card className="animate-in slide-in-from-bottom-4 duration-500">
          <CardHeader>
            <CardTitle className="text-2xl text-indigo-500">Writing Tone</CardTitle>
            <CardDescription>Choose the tone for your cover letter</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { value: "professional", label: "Professional", description: "Formal and business-like" },
                { value: "enthusiastic", label: "Enthusiastic", description: "Energetic and passionate" },
                { value: "conversational", label: "Conversational", description: "Friendly and approachable" },
              ].map((tone) => (
                <Card
                  key={tone.value}
                  className={`cursor-pointer transition-all duration-200 ${
                    formData.tone === tone.value ? "ring-2 ring-indigo-500 bg-indigo-50" : "hover:bg-gray-50"
                  }`}
                  onClick={() => setFormData((prev) => ({ ...prev, tone: tone.value }))}
                >
                  <CardContent className="p-4 text-center">
                    <h3 className="font-semibold text-gray-900 mb-1">{tone.label}</h3>
                    <p className="text-sm text-gray-600">{tone.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Generate Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !formData.jobTitle || !formData.companyName}
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-500 px-12 py-3 text-xl"
          >
            {isGenerating ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating Cover Letter...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Generate Cover Letter
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CoverLetter;