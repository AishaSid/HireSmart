"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Eye, Download, Star, Heart, Zap, Loader2, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface Template {
  _id: string
  name: string
  category: string
  description: string
  imageUrl: string
  isPopular: boolean
  rating: number
  downloads: number
  htmlContent: string
}

interface ResumeTemplatesProps {
  onBack: () => void
}

export function ResumeTemplates({ onBack }: ResumeTemplatesProps) {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [templates, setTemplates] = useState<Template[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [generatedResume, setGeneratedResume] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const router = useRouter()

  const categories = [
    { id: "all", name: "All Templates", count: templates.length },
    { id: "modern", name: "Modern", count: templates.filter(t => t.category === "modern").length },
    { id: "classic", name: "Classic", count: templates.filter(t => t.category === "classic").length },
    { id: "creative", name: "Creative", count: templates.filter(t => t.category === "creative").length },
    { id: "minimal", name: "Minimal", count: templates.filter(t => t.category === "minimal").length },
  ]

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch('/api/templates')
        if (!response.ok) throw new Error('Failed to fetch templates')
        const data = await response.json()
        setTemplates(data.data)
      } catch (error) {
        toast.error('Failed to load templates')
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTemplates()
  }, [])

  const filteredTemplates = selectedCategory === "all" 
    ? templates 
    : templates.filter(template => template.category === selectedCategory)

  const handleGenerateResume = async (templateId: string) => {
    setIsGenerating(true)
    try {
      const userId = localStorage.getItem('user_id');
      if (!userId) {
        throw new Error('User data not found. Please login again.');
      }

      // 1. Get template details
      const template = templates.find(t => t._id === templateId);
      if (!template) {
        throw new Error('Template not found');
      }

      // 2. Generate AI-optimized resume - let the API handle PDF fetching
      const aiResponse = await fetch('/api/resume/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          templateId,
          userId,
          commands: null
        }),
      });
      
      if (!aiResponse.ok) {
        const errorText = await aiResponse.text();
        console.error('AI generation error:', errorText);
        throw new Error('Failed to generate resume');
      }
      
      const responseData = await aiResponse.json();
      
      if (!responseData.success || !responseData.generatedResume) {
        throw new Error(responseData.error || 'Invalid response from AI service');
      }

      setGeneratedResume(responseData.generatedResume);
      toast.success('Resume generated successfully!');
      
    } catch (error: any) {
      console.error('Resume generation error:', error);
      toast.error(error.message || 'Failed to generate resume');
    } finally {
      setIsGenerating(false);
    }
  };
          

  const handleDownloadPDF = async () => {
    if (!generatedResume) {
      toast.error('No resume content available');
      return;
    }

    setIsDownloading(true);
    
    try {
      const userId = localStorage.getItem('user_id');
      
      const response = await fetch('/api/resume/pdf', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/pdf'
        },
        body: JSON.stringify({ 
          htmlContent: generatedResume,
          userId: userId || 'anonymous'
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      // Check if response is actually a PDF
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/pdf')) {
        throw new Error('Invalid response format - expected PDF');
      }

      const blob = await response.blob();
      
      // Validate blob size
      if (blob.size === 0) {
        throw new Error('Empty PDF file received');
      }

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resume-${userId || 'generated'}-${new Date().getTime()}.pdf`;
      a.style.display = 'none';
      
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);
      
      toast.success('Resume downloaded successfully!');
      
    } catch (error: any) {
      console.error('PDF download error:', error);
      toast.error(error.message || 'Failed to download PDF');
    } finally {
      setIsDownloading(false);
    }
  };

  if (selectedTemplate) {
    const template = templates.find(t => t._id === selectedTemplate)
    if (!template) return null

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => {
            setSelectedTemplate(null)
            setGeneratedResume(null)
          }} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Templates
          </Button>
          
          {generatedResume ? (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex items-center gap-2 bg-transparent"
                onClick={handleDownloadPDF}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Download PDF
                  </>
                )}
              </Button>
              <Button 
                variant="outline"
                onClick={() => handleGenerateResume(template._id)}
                className="flex items-center gap-2"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Regenerating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Regenerate
                  </>
                )}
              </Button>
            </div>
          ) : (
            <Button 
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-500 flex items-center gap-2"
              onClick={() => handleGenerateResume(template._id)}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  Generate Resume
                </>
              )}
            </Button>
          )}
        </div>

        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{template.name}</h1>
                <p className="text-gray-600 mb-4">{template.description}</p>
                <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{template.rating}</span>
                  </div>
                  <span>•</span>
                  <span>{template.downloads.toLocaleString()} downloads</span>
                </div>
              </div>

              {generatedResume ? (
                <div className="bg-white shadow-2xl rounded-lg p-8 max-w-2xl mx-auto animate-in fade-in duration-500">
                  <div dangerouslySetInnerHTML={{ __html: generatedResume }} />
                </div>
              ) : (
                <div className="bg-white shadow-2xl rounded-lg p-8 max-w-2xl mx-auto animate-in fade-in duration-500">
                  <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                    <Zap className="h-12 w-12 mb-4" />
                    <h3 className="text-xl font-medium mb-2">No Resume Generated Yet</h3>
                    <p className="text-center max-w-md">
                      Click the "Generate Resume" button to create your AI-optimized resume using this template.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
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
        Resume Templates
      </h1>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            onClick={() => setSelectedCategory(category.id)}
            className={`${
              selectedCategory === category.id
                ? "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-500"
                : ""
            }`}
          >
            {category.name}
            <Badge variant="secondary" className="ml-2">
              {category.count}
            </Badge>
          </Button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template, index) => (
          <Card
            key={template._id}
            className="group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 overflow-hidden animate-in slide-in-from-bottom-4 duration-500"
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => setSelectedTemplate(template._id)}
          >
            <div className="relative">
              <img
                src={template.imageUrl || "/placeholder.svg"}
                alt={template.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {template.isPopular && (
                <Badge className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white">
                  <Star className="h-3 w-3 mr-1" />
                  Popular
                </Badge>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="bg-white/90 hover:bg-white"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedTemplate(template._id)
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl group-hover:text-indigo-500 transition-colors">
                  {template.name}
                </CardTitle>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{template.rating}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="mb-3">{template.description}</CardDescription>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{template.downloads.toLocaleString()} downloads</span>
                <Badge variant="outline" className="capitalize">
                  {template.category}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-0">
        <CardContent className="p-8 text-center">
          <div className="max-w-2xl mx-auto">
            <Zap className="h-12 w-12 text-indigo-500 mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Need a custom resume?</h3>
            <p className="text-gray-600 mb-6">
              Our AI can analyze your experience and create a perfectly tailored resume
            </p>
            <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-500">
              Create Custom Resume
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ResumeTemplates