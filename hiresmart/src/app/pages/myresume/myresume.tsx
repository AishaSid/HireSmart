"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, Eye, Edit, Trash2, Share, Copy, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

interface MyResumesProps {
  onBack: () => void
}

export function MyResumes({ onBack }: MyResumesProps) {
  const [selectedResume, setSelectedResume] = useState<number | null>(null)

  const resumes = [
    {
      id: 1,
      name: "Software Engineer Resume",
      template: "Modern Professional",
      lastModified: "2024-01-15",
      status: "active",
      downloads: 12,
      views: 45,
      thumbnail: "/placeholder.svg?height=300&width=200&text=Software+Engineer+Resume",
    },
    {
      id: 2,
      name: "Senior Developer Position",
      template: "Tech Innovator",
      lastModified: "2024-01-10",
      status: "draft",
      downloads: 3,
      views: 8,
      thumbnail: "/placeholder.svg?height=300&width=200&text=Senior+Developer+Resume",
    },
    {
      id: 3,
      name: "Product Manager Role",
      template: "Executive Classic",
      lastModified: "2024-01-08",
      status: "active",
      downloads: 8,
      views: 23,
      thumbnail: "/placeholder.svg?height=300&width=200&text=Product+Manager+Resume",
    },
    {
      id: 4,
      name: "Frontend Developer",
      template: "Creative Designer",
      lastModified: "2024-01-05",
      status: "archived",
      downloads: 15,
      views: 67,
      thumbnail: "/placeholder.svg?height=300&width=200&text=Frontend+Developer+Resume",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      case "archived":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (selectedResume) {
    const resume = resumes.find((r) => r.id === selectedResume)
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => setSelectedResume(null)} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to My Resumes
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Share className="h-4 w-4" />
              Share
            </Button>
            <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-500 flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-3xl">{resume?.name}</CardTitle>
                  <CardDescription>
                    Template: {resume?.template} • Last modified: {resume?.lastModified}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(resume?.status || "")}>{resume?.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {/* Resume Preview */}
              <div className="bg-white shadow-2xl rounded-lg p-8 animate-in fade-in duration-500">
                <div className="space-y-6">
                  <div className="text-center border-b pb-6">
                    <h2 className="text-3xl font-bold text-gray-900">John Doe</h2>
                    <p className="text-indigo-600 font-medium text-lg">Senior Software Engineer</p>
                    <div className="flex justify-center gap-4 mt-2 text-gray-600">
                      <span>john@example.com</span>
                      <span>•</span>
                      <span>(555) 123-4567</span>
                      <span>•</span>
                      <span>San Francisco, CA</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Professional Summary</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Experienced software engineer with 8+ years of expertise in full-stack development, cloud
                      architecture, and team leadership. Proven track record of delivering scalable solutions and
                      driving technical innovation in fast-paced environments.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Experience</h3>
                    <div className="space-y-4">
                      <div className="border-l-2 border-indigo-200 pl-4">
                        <h4 className="font-semibold text-gray-900">Senior Software Engineer</h4>
                        <p className="text-indigo-600">TechCorp Inc.</p>
                        <p className="text-sm text-gray-500 mb-2">Jan 2020 - Present</p>
                        <ul className="text-gray-700 text-sm space-y-1">
                          <li>• Led development of microservices architecture serving 1M+ users daily</li>
                          <li>• Reduced system latency by 40% through optimization and caching strategies</li>
                          <li>• Mentored 5 junior developers and established code review processes</li>
                        </ul>
                      </div>
                      <div className="border-l-2 border-indigo-200 pl-4">
                        <h4 className="font-semibold text-gray-900">Software Engineer</h4>
                        <p className="text-indigo-600">StartupXYZ</p>
                        <p className="text-sm text-gray-500 mb-2">Jun 2018 - Dec 2019</p>
                        <ul className="text-gray-700 text-sm space-y-1">
                          <li>• Built and maintained React applications with Node.js backends</li>
                          <li>• Implemented CI/CD pipelines reducing deployment time by 60%</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {["JavaScript", "React", "Node.js", "Python", "AWS", "Docker", "Kubernetes", "GraphQL"].map(
                        (skill) => (
                          <span key={skill} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                            {skill}
                          </span>
                        ),
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Education</h3>
                    <div className="border-l-2 border-indigo-200 pl-4">
                      <h4 className="font-semibold text-gray-900">Bachelor of Science in Computer Science</h4>
                      <p className="text-indigo-600">University of California, Berkeley</p>
                      <p className="text-sm text-gray-500">2014 - 2018</p>
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
      <h1 className="text-6xl font-bold text-center bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
          My Resumes
        </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Resumes</p>
                <p className="text-2xl font-bold text-blue-900">{resumes.length}</p>
              </div>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Eye className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Active</p>
                <p className="text-2xl font-bold text-green-900">
                  {resumes.filter((r) => r.status === "active").length}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Badge className="w-4 h-4 bg-transparent p-0 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Total Downloads</p>
                <p className="text-2xl font-bold text-purple-900">{resumes.reduce((sum, r) => sum + r.downloads, 0)}</p>
              </div>
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <Download className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Total Views</p>
                <p className="text-2xl font-bold text-orange-900">{resumes.reduce((sum, r) => sum + r.views, 0)}</p>
              </div>
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <Eye className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumes Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resumes.map((resume, index) => (
          <Card
            key={resume.id}
            className="group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 overflow-hidden animate-in slide-in-from-bottom-4 duration-500"
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => setSelectedResume(resume.id)}
          >
            <div className="relative">
              <img
                src={resume.thumbnail || "/placeholder.svg"}
                alt={resume.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <Badge className={`absolute top-2 left-2 ${getStatusColor(resume.status)}`}>{resume.status}</Badge>
              <div className="absolute top-2 right-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="bg-white/80 hover:bg-white">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share className="h-4 w-4 mr-2" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl group-hover:text-indigo-500 transition-colors">{resume.name}</CardTitle>
              <CardDescription>Template: {resume.template}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                <span>Modified: {resume.lastModified}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    {resume.downloads}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {resume.views}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {resumes.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No resumes yet</h3>
              <p className="text-gray-600 mb-6">Create your first resume to get started on your job search journey</p>
              <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
                Create Your First Resume
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default MyResumes;