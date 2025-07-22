"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Eye, Download, Star, Heart, Zap } from "lucide-react"

interface ResumeTemplatesProps {
  onBack: () => void
}

export function ResumeTemplates({ onBack }: ResumeTemplatesProps) {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null)

  const categories = [
    { id: "all", name: "All Templates", count: 24 },
    { id: "modern", name: "Modern", count: 8 },
    { id: "classic", name: "Classic", count: 6 },
    { id: "creative", name: "Creative", count: 5 },
    { id: "minimal", name: "Minimal", count: 5 },
  ]

  const templates = [
    {
      id: 1,
      name: "Modern Professional",
      category: "modern",
      description: "Clean and contemporary design perfect for tech professionals",
      image: "/placeholder.svg?height=400&width=300&text=Modern+Professional+Template",
      popular: true,
      rating: 4.9,
      downloads: 15420,
    },
    {
      id: 2,
      name: "Executive Classic",
      category: "classic",
      description: "Traditional layout ideal for senior management positions",
      image: "/placeholder.svg?height=400&width=300&text=Executive+Classic+Template",
      popular: false,
      rating: 4.7,
      downloads: 8930,
    },
    {
      id: 3,
      name: "Creative Designer",
      category: "creative",
      description: "Bold and artistic template for creative professionals",
      image: "/placeholder.svg?height=400&width=300&text=Creative+Designer+Template",
      popular: true,
      rating: 4.8,
      downloads: 12340,
    },
    {
      id: 4,
      name: "Minimal Clean",
      category: "minimal",
      description: "Simple and elegant design that focuses on content",
      image: "/placeholder.svg?height=400&width=300&text=Minimal+Clean+Template",
      popular: false,
      rating: 4.6,
      downloads: 7650,
    },
    {
      id: 5,
      name: "Tech Innovator",
      category: "modern",
      description: "Perfect for software developers and tech professionals",
      image: "/placeholder.svg?height=400&width=300&text=Tech+Innovator+Template",
      popular: true,
      rating: 4.9,
      downloads: 18750,
    },
    {
      id: 6,
      name: "Business Professional",
      category: "classic",
      description: "Versatile template suitable for various business roles",
      image: "/placeholder.svg?height=400&width=300&text=Business+Professional+Template",
      popular: false,
      rating: 4.5,
      downloads: 6420,
    },
  ]

  const filteredTemplates =
    selectedCategory === "all" ? templates : templates.filter((template) => template.category === selectedCategory)

  if (selectedTemplate) {
    const template = templates.find((t) => t.id === selectedTemplate)
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => setSelectedTemplate(null)} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Templates
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Eye className="h-4 w-4" />
              Preview
            </Button>
            <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-500 flex items-center gap-2">
              <Download className="h-4 w-4" />
              Use This Template
            </Button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{template?.name}</h1>
                <p className="text-gray-600 mb-4">{template?.description}</p>
                <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{template?.rating}</span>
                  </div>
                  <span>•</span>
                  <span>{template?.downloads.toLocaleString()} downloads</span>
                </div>
              </div>

              {/* Template Preview */}
              <div className="bg-white shadow-2xl rounded-lg p-8 max-w-2xl mx-auto animate-in fade-in duration-500">
                <div className="space-y-6">
                  <div className="text-center border-b pb-6">
                    <h2 className="text-2xl font-bold text-gray-900">John Doe</h2>
                    <p className="text-indigo-600 font-medium">Senior Software Engineer</p>
                    <div className="flex justify-center gap-4 mt-2 text-sm text-gray-600">
                      <span>john@example.com</span>
                      <span>•</span>
                      <span>(555) 123-4567</span>
                      <span>•</span>
                      <span>San Francisco, CA</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Professional Summary</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Experienced software engineer with 8+ years of expertise in full-stack development, cloud
                      architecture, and team leadership. Proven track record of delivering scalable solutions and
                      driving technical innovation.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Experience</h3>
                    <div className="space-y-4">
                      <div className="border-l-2 border-indigo-200 pl-4">
                        <h4 className="font-semibold text-gray-900">Senior Software Engineer</h4>
                        <p className="text-indigo-600 text-sm">TechCorp Inc.</p>
                        <p className="text-xs text-gray-500 mb-2">Jan 2020 - Present</p>
                        <p className="text-gray-700 text-sm">
                          Led development of microservices architecture serving 1M+ users daily.
                        </p>
                      </div>
                      <div className="border-l-2 border-indigo-200 pl-4">
                        <h4 className="font-semibold text-gray-900">Software Engineer</h4>
                        <p className="text-indigo-600 text-sm">StartupXYZ</p>
                        <p className="text-xs text-gray-500 mb-2">Jun 2018 - Dec 2019</p>
                        <p className="text-gray-700 text-sm">
                          Built and maintained React applications with Node.js backends.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {["JavaScript", "React", "Node.js", "Python", "AWS", "Docker"].map((skill) => (
                        <span key={skill} className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
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
            key={template.id}
            className="group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden animate-in slide-in-from-bottom-4 duration-500"
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => setSelectedTemplate(template.id)}
          >
            <div className="relative">
              <img
                src={template.image || "/placeholder.svg"}
                alt={template.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {template.popular && (
                <Badge className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white">
                  <Star className="h-3 w-3 mr-1" />
                  Popular
                </Badge>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl group-hover:text-indigo-500 transition-colors">{template.name}</CardTitle>
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

export default ResumeTemplates;
