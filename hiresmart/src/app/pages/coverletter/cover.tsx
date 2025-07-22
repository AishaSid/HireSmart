"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input" 
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Sparkles, Download, Copy, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"

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

  // Custom animated input component
  const AnimatedInput = ({ label, value, onChange, placeholder, type = "text", id }: any) => (
    <div className="relative">
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder=" "
        className="h-14 text-lg border-2 peer placeholder-transparent hover:shadow-lg hover:shadow-blue-400 focus:shadow-lg focus:shadow-indigo-400 focus:border-blue-500 focus:border-2"
      />
      <label
        htmlFor={id}
        className="absolute left-3 text-lg text-gray-600 transition-all duration-200 transform -translate-y-1/2 top-1/2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-lg peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:left-3 peer-focus:text-sm peer-focus:text-indigo-600 peer-focus:bg-white peer-focus:px-1 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-3 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:text-indigo-600 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1"
      >
        {label}
      </label>
    </div>
  )

  // Custom animated textarea component
  const AnimatedTextarea = ({ label, value, onChange, placeholder, rows = 4, id }: any) => (
    <div className="relative">
      <Textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder=" "
        rows={rows}
        className="min-h-20 text-lg border-2 border-transparent peer placeholder-transparent resize-none hover:shadow-lg hover:shadow-blue-400 focus:shadow-lg focus:shadow-indigo-400 focus:border-blue-500 focus:border-2"
      />
      <label
        htmlFor={id}
        className="absolute left-3 text-lg text-gray-600 transition-all duration-200 transform -translate-y-1/2 top-6 peer-placeholder-shown:top-6 peer-placeholder-shown:text-lg peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:left-3 peer-focus:text-sm peer-focus:text-indigo-600 peer-focus:bg-white peer-focus:px-1 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-3 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:text-indigo-600 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1"
      >
        {label}
      </label>
    </div>
  )

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

        <Card className="max-w-4xl mx-auto border-2">
          <CardHeader>
            <CardTitle className="text-3xl">Generated Cover Letter</CardTitle>
            <CardDescription className="text-lg">
              AI-generated cover letter for {formData.jobTitle} at {formData.companyName}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-white shadow-lg rounded-lg p-8 animate-in fade-in duration-500">
              <div className="whitespace-pre-line text-gray-800 leading-relaxed text-lg">{generatedLetter}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

 
    const router = useRouter()
    useEffect(() => {
      window.history.pushState(null, '', window.location.href)
      window.onpopstate = () => {
        router.replace('/pages/dashboard')
      }
      window.scrollTo(0, 0);
      return () => {
        window.onpopstate = null
      }
    }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
      <h1 className="text-6xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
        Generate Cover Letter
      </h1>

      <div className="max-w-3xl mx-auto space-y-8">
        {/* Job Information */}
        <Card className="animate-in slide-in-from-bottom-4 duration-500 border-2">
          <CardHeader>
            <CardTitle className="text-2xl text-indigo-500">Job Information</CardTitle>
            <CardDescription className="text-lg">Tell us about the position you're applying for</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <AnimatedInput
                id="jobTitle"
                label="Job Title"
                value={formData.jobTitle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((prev) => ({ ...prev, jobTitle: e.target.value }))}
              />
              <AnimatedInput
                id="companyName"
                label="Company Name"
                value={formData.companyName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((prev) => ({ ...prev, companyName: e.target.value }))}
              />
            </div>
            <AnimatedInput
              id="hiringManager"
              label="Hiring Manager Name (Optional)"
              value={formData.hiringManager}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((prev) => ({ ...prev, hiringManager: e.target.value }))}
            />
          </CardContent>
        </Card>

        {/* Job Description */}
        <Card className="animate-in slide-in-from-bottom-4 duration-500 border-2">
          <CardHeader>
            <CardTitle className="text-2xl text-indigo-500">Job Description</CardTitle>
            <CardDescription className="text-lg">Paste the job description or key requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <AnimatedTextarea
              id="jobDescription"
              label="Job Description or Key Requirements"
              value={formData.jobDescription}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData((prev) => ({ ...prev, jobDescription: e.target.value }))}
              rows={6}
            />
          </CardContent>
        </Card>

        {/* Your Background */}
        <Card className="animate-in slide-in-from-bottom-4 duration-500 border-2">
          <CardHeader>
            <CardTitle className="text-2xl text-indigo-500">Your Background</CardTitle>
            <CardDescription className="text-lg">Help us understand your qualifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <AnimatedInput
              id="keySkills"
              label="Key Skills & Technologies"
              value={formData.keySkills}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((prev) => ({ ...prev, keySkills: e.target.value }))}
            />
            <AnimatedTextarea
              id="experience"
              label="Relevant Experience"
              value={formData.experience}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData((prev) => ({ ...prev, experience: e.target.value }))}
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Tone Selection */}
        <Card className="animate-in slide-in-from-bottom-4 duration-500 border-2">
          <CardHeader>
            <CardTitle className="text-2xl text-indigo-500">Writing Tone</CardTitle>
            <CardDescription className="text-lg">Choose the tone for your cover letter</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { value: "professional", label: "Professional", description: "Formal and business-like" },
                { value: "enthusiastic", label: "Enthusiastic", description: "Energetic and passionate" },
                { value: "conversational", label: "Conversational", description: "Friendly and approachable" },
              ].map((tone) => (
                <Card
                  key={tone.value}
                  className={`cursor-pointer transition-all duration-200 border-2 hover:shadow-lg hover:shadow-blue-400 ${
                    formData.tone === tone.value ? "ring-2 ring-indigo-500 bg-indigo-50 border-indigo-500" : "hover:bg-gray-50"
                  }`}
                  onClick={() => setFormData((prev) => ({ ...prev, tone: tone.value }))}
                >
                  <CardContent className="p-6 text-center">
                    <h3 className="font-semibold text-gray-900 mb-2 text-lg">{tone.label}</h3>
                    <p className="text-base text-gray-600">{tone.description}</p>
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
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-500 px-16 py-5 text-xl h-16"
          >
            {isGenerating ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating Cover Letter...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Generate My Cover Letter
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CoverLetter;