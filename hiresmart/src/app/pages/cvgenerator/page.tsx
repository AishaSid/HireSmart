"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Plus, Trash2, Download, Eye } from "lucide-react"

interface CVGeneratorFormProps {
  onBack: () => void
}

export function CVGeneratorForm({ onBack }: CVGeneratorFormProps) {
  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      website: "",
    },
    summary: "",
    experience: [
      {
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ],
    education: [
      {
        institution: "",
        degree: "",
        startDate: "",
        endDate: "",
        gpa: "",
      },
    ],
    skills: [""],
    projects: [
      {
        name: "",
        description: "",
        technologies: "",
        link: "",
      },
    ],
  })

  const [isGenerating, setIsGenerating] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const addExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    }))
  }

  const removeExperience = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }))
  }

  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          institution: "",
          degree: "",
          startDate: "",
          endDate: "",
          gpa: "",
        },
      ],
    }))
  }

  const removeEducation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }))
  }

  const addSkill = () => {
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, ""],
    }))
  }

  const removeSkill = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }))
  }

  const addProject = () => {
    setFormData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          name: "",
          description: "",
          technologies: "",
          link: "",
        },
      ],
    }))
  }

  const removeProject = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }))
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setIsGenerating(false)
    setShowPreview(true)
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
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Eye className="h-4 w-4" />
              Preview
            </Button>
            <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-8">
            <div className="bg-white shadow-lg rounded-lg p-8 animate-in fade-in duration-500">
              {/* Resume Preview */}
              <div className="space-y-6">
                <div className="text-center border-b pb-6">
                  <h1 className="text-3xl font-bold text-gray-900">{formData.personalInfo.fullName || "Your Name"}</h1>
                  <div className="flex flex-wrap justify-center gap-4 mt-2 text-gray-600">
                    <span>{formData.personalInfo.email}</span>
                    <span>{formData.personalInfo.phone}</span>
                    <span>{formData.personalInfo.location}</span>
                  </div>
                </div>

                {formData.summary && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">Professional Summary</h2>
                    <p className="text-gray-700">{formData.summary}</p>
                  </div>
                )}

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Experience</h2>
                  <div className="space-y-4">
                    {formData.experience.map((exp, index) => (
                      <div key={index} className="border-l-2 border-indigo-200 pl-4">
                        <h3 className="font-semibold text-gray-900">{exp.position || "Position"}</h3>
                        <p className="text-indigo-600">{exp.company || "Company"}</p>
                        <p className="text-sm text-gray-500">
                          {exp.startDate} - {exp.endDate}
                        </p>
                        <p className="text-gray-700 mt-2">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Education</h2>
                  <div className="space-y-4">
                    {formData.education.map((edu, index) => (
                      <div key={index} className="border-l-2 border-indigo-200 pl-4">
                        <h3 className="font-semibold text-gray-900">{edu.degree || "Degree"}</h3>
                        <p className="text-indigo-600">{edu.institution || "Institution"}</p>
                        <p className="text-sm text-gray-500">
                          {edu.startDate} - {edu.endDate}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills
                      .filter((skill) => skill.trim())
                      .map((skill, index) => (
                        <span key={index} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
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
      <h1 className="text-5xl font-bold text-center mb-8 bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">Create Your CV</h1>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Personal Information */}
        <Card className="animate-in slide-in-from-bottom-4 duration-500">
          <CardHeader>
            <CardTitle className="text-xl text-indigo-600">Personal Information</CardTitle>
            <CardDescription>Basic details about yourself</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={formData.personalInfo.fullName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, fullName: e.target.value },
                    }))
                  }
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.personalInfo.email}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, email: e.target.value },
                    }))
                  }
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.personalInfo.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, phone: e.target.value },
                    }))
                  }
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.personalInfo.location}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, location: e.target.value },
                    }))
                  }
                  placeholder="New York, NY"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Summary */}
        <Card className="animate-in slide-in-from-bottom-4 duration-500">
          <CardHeader>
            <CardTitle className="text-xl text-indigo-600">Professional Summary</CardTitle>
            <CardDescription>Brief overview of your professional background</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.summary}
              onChange={(e) => setFormData((prev) => ({ ...prev, summary: e.target.value }))}
              placeholder="Write a brief summary of your professional experience and key achievements..."
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Experience */}
        <Card className="animate-in slide-in-from-bottom-4 duration-500">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl text-indigo-600">Work Experience</CardTitle>
                <CardDescription>Your professional work history</CardDescription>
              </div>
              <Button
                onClick={addExperience}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-transparent"
              >
                <Plus className="h-4 w-4" />
                Add Experience
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {formData.experience.map((exp, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-4 relative">
                {formData.experience.length > 1 && (
                  <Button
                    onClick={() => removeExperience(index)}
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Company</Label>
                    <Input
                      value={exp.company}
                      onChange={(e) => {
                        const newExp = [...formData.experience]
                        newExp[index].company = e.target.value
                        setFormData((prev) => ({ ...prev, experience: newExp }))
                      }}
                      placeholder="Company Name"
                    />
                  </div>
                  <div>
                    <Label>Position</Label>
                    <Input
                      value={exp.position}
                      onChange={(e) => {
                        const newExp = [...formData.experience]
                        newExp[index].position = e.target.value
                        setFormData((prev) => ({ ...prev, experience: newExp }))
                      }}
                      placeholder="Job Title"
                    />
                  </div>
                  <div>
                    <Label>Start Date</Label>
                    <Input
                      type="month"
                      value={exp.startDate}
                      onChange={(e) => {
                        const newExp = [...formData.experience]
                        newExp[index].startDate = e.target.value
                        setFormData((prev) => ({ ...prev, experience: newExp }))
                      }}
                    />
                  </div>
                  <div>
                    <Label>End Date</Label>
                    <Input
                      type="month"
                      value={exp.endDate}
                      onChange={(e) => {
                        const newExp = [...formData.experience]
                        newExp[index].endDate = e.target.value
                        setFormData((prev) => ({ ...prev, experience: newExp }))
                      }}
                    />
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={exp.description}
                    onChange={(e) => {
                      const newExp = [...formData.experience]
                      newExp[index].description = e.target.value
                      setFormData((prev) => ({ ...prev, experience: newExp }))
                    }}
                    placeholder="Describe your responsibilities and achievements..."
                    rows={3}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Education */}
        <Card className="animate-in slide-in-from-bottom-4 duration-500">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl text-indigo-600">Education</CardTitle>
                <CardDescription>Your educational background</CardDescription>
              </div>
              <Button
                onClick={addEducation}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-transparent"
              >
                <Plus className="h-4 w-4" />
                Add Education
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {formData.education.map((edu, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-4 relative">
                {formData.education.length > 1 && (
                  <Button
                    onClick={() => removeEducation(index)}
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Institution</Label>
                    <Input
                      value={edu.institution}
                      onChange={(e) => {
                        const newEdu = [...formData.education]
                        newEdu[index].institution = e.target.value
                        setFormData((prev) => ({ ...prev, education: newEdu }))
                      }}
                      placeholder="University Name"
                    />
                  </div>
                  <div>
                    <Label>Degree</Label>
                    <Input
                      value={edu.degree}
                      onChange={(e) => {
                        const newEdu = [...formData.education]
                        newEdu[index].degree = e.target.value
                        setFormData((prev) => ({ ...prev, education: newEdu }))
                      }}
                      placeholder="Bachelor of Science"
                    />
                  </div>
                  <div>
                    <Label>Start Date</Label>
                    <Input
                      type="month"
                      value={edu.startDate}
                      onChange={(e) => {
                        const newEdu = [...formData.education]
                        newEdu[index].startDate = e.target.value
                        setFormData((prev) => ({ ...prev, education: newEdu }))
                      }}
                    />
                  </div>
                  <div>
                    <Label>End Date</Label>
                    <Input
                      type="month"
                      value={edu.endDate}
                      onChange={(e) => {
                        const newEdu = [...formData.education]
                        newEdu[index].endDate = e.target.value
                        setFormData((prev) => ({ ...prev, education: newEdu }))
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Skills */}
        <Card className="animate-in slide-in-from-bottom-4 duration-500">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl text-indigo-600">Skills</CardTitle>
                <CardDescription>Your technical and soft skills</CardDescription>
              </div>
              <Button onClick={addSkill} variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                <Plus className="h-4 w-4" />
                Add Skill
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {formData.skills.map((skill, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={skill}
                    onChange={(e) => {
                      const newSkills = [...formData.skills]
                      newSkills[index] = e.target.value
                      setFormData((prev) => ({ ...prev, skills: newSkills }))
                    }}
                    placeholder="e.g., JavaScript, Project Management"
                  />
                  {formData.skills.length > 1 && (
                    <Button
                      onClick={() => removeSkill(index)}
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Generate Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 px-16 py-5 text-xl h-14"
          >
            {isGenerating ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating CV...
              </div>
            ) : (
              "Generate My CV"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
