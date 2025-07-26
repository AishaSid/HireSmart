"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Upload, CheckCircle, AlertTriangle, XCircle, Download, Zap, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface ATSOptimizerProps {
  onBack: () => void
}

interface ATSAnalysis {
  score: number
  foundKeywords: string[]
  missingKeywords: string[]
  formattingIssues: string[]
  optimizationSuggestions: string[]
  strengths: string[]
}

export function ATSOptimizer({ onBack }: ATSOptimizerProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [analysisError, setAnalysisError] = useState("")
  const [analysisResults, setAnalysisResults] = useState<ATSAnalysis | null>(null)
  const router = useRouter()

  useEffect(() => {
    window.history.pushState(null, '', window.location.href)
    window.onpopstate = () => {
      router.replace('/pages/dashboard')
    }
    window.scrollTo(0, 0)
    return () => {
      window.onpopstate = null
    }
  }, [])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  const handleAnalyze = async () => {
    setAnalysisError("")
    setAnalysisComplete(false)
    
    if (!uploadedFile) {
      setAnalysisError("Please upload a resume file")
      return
    }

    if (!jobDescription || jobDescription.trim().length < 15) {
      setAnalysisError("Job description must be at least 15 characters")
      return
    }

    setIsAnalyzing(true)

    try {
      const formData = new FormData()
      formData.append("file", uploadedFile)
      formData.append("jobDescription", jobDescription)

      const response = await fetch("/api/Ats_analyze", {
        method: "POST",
        body: formData,
      })

      // Check for JSON response
      const contentType = response.headers.get("content-type") || ""
      if (!contentType.includes("application/json")) {
        const text = await response.text()
        throw new Error(`Server error: ${response.status} - ${text.slice(0, 100)}`)
      }

      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || "Analysis failed")
      }

      setAnalysisResults(result.data)
      setAnalysisComplete(true)
    } catch (error: any) {
      console.error("Analysis error:", error)
      setAnalysisError(error.message || "Failed to analyze resume")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  if (analysisComplete && analysisResults) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => {
            setAnalysisComplete(false)
            setAnalysisResults(null)
          }} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Analyze Another Resume
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Zap className="h-4 w-4" />
              Auto-Optimize
            </Button>
            <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-500 flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download Optimized
            </Button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto space-y-6">
          {/* ATS Score */}
          <Card className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 border-0">
            <CardContent className="p-8">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-white shadow-lg mb-6">
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getScoreColor(analysisResults.score)}`}>
                    {analysisResults.score}
                  </div>
                  <div className="text-sm text-gray-600">ATS Score</div>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {analysisResults.score >= 80
                  ? "Excellent!"
                  : analysisResults.score >= 60
                    ? "Good Progress"
                    : "Needs Improvement"}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {analysisResults.score >= 80
                  ? "Your resume is well-optimized for ATS systems and should pass most automated screenings."
                  : analysisResults.score >= 60
                    ? "Your resume has good ATS compatibility but could benefit from some improvements."
                    : "Your resume needs significant optimization to improve ATS compatibility."}
              </p>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Formatting Issues */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-yellow-600">Formatting Issues</CardTitle>
                <CardDescription>Areas that need attention for better ATS compatibility</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysisResults.formattingIssues.map((issue, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-600">{issue}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Strengths */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-green-600">Strengths</CardTitle>
                <CardDescription>What your resume does well</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysisResults.strengths.map((strength, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-gray-800">{strength}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Keywords Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-indigo-500">Keywords Analysis</CardTitle>
              <CardDescription>Keywords found and missing in your resume</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-green-600 mb-3 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Found Keywords ({analysisResults.foundKeywords.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisResults.foundKeywords.map((keyword, index) => (
                      <Badge key={index} className="bg-green-100 text-green-800">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-red-600 mb-3 flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    Missing Keywords ({analysisResults.missingKeywords.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisResults.missingKeywords.map((keyword, index) => (
                      <Badge key={index} className="bg-red-100 text-red-800">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Optimization Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-blue-600">Optimization Suggestions</CardTitle>
              <CardDescription>Actionable tips to improve your resume</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {analysisResults.optimizationSuggestions.map((suggestion, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <Zap className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-600">{suggestion}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
      <h1 className="text-6xl font-bold text-center bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
        ATS Optimizer
      </h1>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Upload Section */}
        <Card className="text-center animate-in slide-in-from-bottom-4 duration-500">
          <CardContent className="p-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Upload Your Resume</h2>
              <p className="text-gray-600 mb-8">
                Upload your resume to get a comprehensive ATS compatibility analysis and optimization suggestions
              </p>

              {/* Job Description Input */}
              <div className="space-y-4 mb-6">
                <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700">
                  Job Description
                </label>
                <textarea
                  id="jobDescription"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description you're applying for..."
                  className="min-h-[150px] w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
                <p className="text-sm text-gray-500">
                  Provide the job description for targeted ATS analysis (minimum 15 characters)
                </p>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-indigo-400 transition-colors">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="resume-upload"
                />
                <label htmlFor="resume-upload" className="cursor-pointer">
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-gray-900">Click to upload or drag and drop</p>
                      <p className="text-sm text-gray-500">PDF, DOC, or DOCX (max 10MB)</p>
                    </div>
                  </div>
                </label>
              </div>

              {uploadedFile && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-green-800 font-medium">{uploadedFile.name}</span>
                  </div>
                </div>
              )}

              {/* Error Display */}
              {analysisError && (
                <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                    <span>{analysisError}</span>
                  </div>
                </div>
              )}

              {uploadedFile && (
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || jobDescription.trim().length < 15}
                  size="lg"
                  className="mt-6 w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-500 text-white"
                >
                  {isAnalyzing ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analyzing Resume...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Analyze ATS Compatibility
                    </div>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: CheckCircle,
              title: "ATS Score",
              description: "Get a comprehensive score showing how well your resume performs with ATS systems",
            },
            {
              icon: AlertTriangle,
              title: "Keyword Analysis",
              description: "Identify found and missing keywords critical for the job description",
            },
            {
              icon: Zap,
              title: "Optimization Tips",
              description: "Receive specific recommendations to improve your resume's ATS compatibility",
            },
          ].map((feature, index) => (
            <Card
              key={index}
              className="text-center animate-in slide-in-from-bottom-4 duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Section */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-0">
          <CardContent className="p-8">
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Why ATS Optimization Matters</h3>
              <p className="text-gray-700 mb-6">
                Over 90% of large companies use Applicant Tracking Systems (ATS) to screen resumes. These systems
                automatically filter resumes before they reach human recruiters. Our optimizer ensures your resume
                passes these automated screenings.
              </p>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-indigo-600 mb-1">90%</div>
                  <div className="text-sm text-gray-600">of companies use ATS</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-indigo-600 mb-1">75%</div>
                  <div className="text-sm text-gray-600">of resumes are rejected by ATS</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-indigo-600 mb-1">3x</div>
                  <div className="text-sm text-gray-600">higher chance with optimization</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ATSOptimizer;