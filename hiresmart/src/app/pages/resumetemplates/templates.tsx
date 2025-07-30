"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Eye, Download, Star, Heart, Zap } from "lucide-react"
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

  const handleUseTemplate = async (templateId: string) => {
    try {
      const userId = localStorage.getItem('user_id');
      if (!userId) {
        throw new Error('User data not found');
      }

      
      const cvResponse = await fetch(`/api/upload-cv?user_id=${userId}`);
      if (!cvResponse.ok) throw new Error('Failed to fetch CV PDF');
      const cvBlob = await cvResponse.blob();
      // Convert PDF blob to base64 for AI API (if needed)
      const cvBase64 = await blobToBase64(cvBlob);

      // 2. Send the CV to genAi endpoint to generate a resume
      const aiResponse = await fetch('/api/resume/genAi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalContent: cvBase64,
          templateId,
          userId,
        }),
      });
      if (!aiResponse.ok) throw new Error('Failed to generate resume');
      const { optimized_resume } = await aiResponse.json();

      // 3. Download the generated resume as a file
      const blob = new Blob([optimized_resume], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resume-${templateId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      toast.success('Resume generated and downloaded!');
    } catch (error) {
      toast.error('Failed to apply template');
      console.error(error);
    }
  };

  // Helper to convert Blob to base64
  function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result?.toString().split(',')[1];
        resolve(base64data || '');
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  const handleDownloadPDF = async (templateId: string) => {
    try {
      const userId = localStorage.getItem('user_id');
      if (!userId) throw new Error('User data not found');
     
      const cvResponse = await fetch(`/api/upload-cv?user_id=${userId}`);
      if (!cvResponse.ok) throw new Error('Failed to fetch CV PDF');
      const cvBlob = await cvResponse.blob();
      const cvBase64 = await blobToBase64(cvBlob);
      // Send the CV to genAi endpoint to generate a resume
      const aiResponse = await fetch('/api/resume/genAi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalContent: cvBase64,
          templateId,
          userId,
        }),
      });
      if (!aiResponse.ok) throw new Error('Failed to generate resume');
      const { optimized_resume } = await aiResponse.json();
      // Download the generated resume as a file
      const blob = new Blob([optimized_resume], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resume-${templateId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      toast.success('Resume generated and downloaded!');
    } catch (error) {
      toast.error('Failed to download template');
      console.error(error);
    }
  };

  if (selectedTemplate) {
    const template = templates.find(t => t._id === selectedTemplate)
    if (!template) return null

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => setSelectedTemplate(null)} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Templates
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2 bg-transparent"
              onClick={() => handleDownloadPDF(template._id)}
            >
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
            <Button 
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-500 flex items-center gap-2"
              onClick={() => handleUseTemplate(template._id)}
            >
              <Download className="h-4 w-4" />
              Use This Template
            </Button>
          </div>
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

              {/* Template Preview */}
              <div 
                className="bg-white shadow-2xl rounded-lg p-8 max-w-2xl mx-auto animate-in fade-in duration-500"
                dangerouslySetInnerHTML={{ __html: template.htmlContent }}
              />
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

      {/* Category Filter */}
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

      {/* Templates Grid */}
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
                      handleDownloadPDF(template._id)
                    }}
                  >
                    <Download className="h-4 w-4" />
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

      {/* CTA Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-0">
        <CardContent className="p-8 text-center">
          <div className="max-w-2xl mx-auto">
            <Zap className="h-12 w-12 text-indigo-500 mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Can't find the perfect template?</h3>
            <p className="text-gray-600 mb-6">
              Our AI can create a custom template based on your industry and preferences
            </p>
            <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-500">
              Create Custom Template
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ResumeTemplates