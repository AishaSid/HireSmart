"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Trash2, Download, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

interface CVGeneratorFormProps {
  onBack: () => void;
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
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

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
    }));
  };

  const removeExperience = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

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
    }));
  };
  const router = useRouter();
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => {
      router.replace("/pages/dashboard");
    };
    window.scrollTo(0, 0);
    return () => {
      window.onpopstate = null;
    };
  }, []);

  const removeEducation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const addSkill = () => {
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, ""],
    }));
  };

  const removeSkill = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

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
    }));
  };

  const removeProject = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsGenerating(false);
    setShowPreview(true);
  };

  // Custom animated input component
  const AnimatedInput = ({
    label,
    value,
    onChange,
    placeholder,
    type = "text",
    id,
  }: any) => (
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
  );

  // Custom animated textarea component
  const AnimatedTextarea = ({
    label,
    value,
    onChange,
    placeholder,
    rows = 4,
    id,
  }: any) => (
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
  );

  if (showPreview) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setShowPreview(false)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Form
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-transparent"
            >
              <Eye className="h-4 w-4" />
              Preview
            </Button>
            <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>

        <Card className="max-w-3xl mx-auto border-2">
          <CardContent className="p-6">
            <div className="bg-white shadow-lg rounded-lg p-8 animate-in fade-in duration-500">
              {/* Resume Preview */}
              <div className="space-y-6">
                <div className="text-center border-b pb-6">
                  <h1 className="text-4xl font-bold text-gray-900">
                    {formData.personalInfo.fullName || "Your Name"}
                  </h1>
                  <div className="flex flex-wrap justify-center gap-4 mt-2 text-lg text-gray-600">
                    <span>{formData.personalInfo.email}</span>
                    <span>{formData.personalInfo.phone}</span>
                    <span>{formData.personalInfo.location}</span>
                  </div>
                </div>

                {formData.summary && (
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                      Professional Summary
                    </h2>
                    <p className="text-lg text-gray-700">{formData.summary}</p>
                  </div>
                )}

                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                    Experience
                  </h2>
                  <div className="space-y-4">
                    {formData.experience.map((exp, index) => (
                      <div
                        key={index}
                        className="border-l-2 border-indigo-200 pl-4"
                      >
                        <h3 className="text-lg font-semibold text-gray-900">
                          {exp.position || "Position"}
                        </h3>
                        <p className="text-lg text-indigo-600">
                          {exp.company || "Company"}
                        </p>
                        <p className="text-base text-gray-500">
                          {exp.startDate} - {exp.endDate}
                        </p>
                        <p className="text-lg text-gray-700 mt-2">
                          {exp.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                    Education
                  </h2>
                  <div className="space-y-4">
                    {formData.education.map((edu, index) => (
                      <div
                        key={index}
                        className="border-l-2 border-indigo-200 pl-4"
                      >
                        <h3 className="text-lg font-semibold text-gray-900">
                          {edu.degree || "Degree"}
                        </h3>
                        <p className="text-lg text-indigo-600">
                          {edu.institution || "Institution"}
                        </p>
                        <p className="text-base text-gray-500">
                          {edu.startDate} - {edu.endDate}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                    Skills
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills
                      .filter((skill) => skill.trim())
                      .map((skill, index) => (
                        <span
                          key={index}
                          className="bg-indigo-100 text-blue-500 px-3 py-1 rounded-full text-base"
                        >
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
    );
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
      <h1 className="text-6xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
        Create Your CV
      </h1>

      <div className="max-w-3xl mx-auto space-y-8">
        {/* Personal Information */}
        <Card className="animate-in slide-in-from-bottom-4 duration-500 border-2">
          <CardHeader>
            <CardTitle className="text-2xl text-indigo-500">
              Personal Information
            </CardTitle>
            <CardDescription className="text-lg">
              Basic details about yourself
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <AnimatedInput
                id="fullName"
                label="Full Name"
                value={formData.personalInfo.fullName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData((prev) => ({
                    ...prev,
                    personalInfo: {
                      ...prev.personalInfo,
                      fullName: e.target.value,
                    },
                  }))
                }
              />
              <AnimatedInput
                id="email"
                label="Email"
                type="email"
                value={formData.personalInfo.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData((prev) => ({
                    ...prev,
                    personalInfo: {
                      ...prev.personalInfo,
                      email: e.target.value,
                    },
                  }))
                }
              />
              <AnimatedInput
                id="phone"
                label="Phone"
                value={formData.personalInfo.phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData((prev) => ({
                    ...prev,
                    personalInfo: {
                      ...prev.personalInfo,
                      phone: e.target.value,
                    },
                  }))
                }
              />
              <AnimatedInput
                id="location"
                label="Location"
                value={formData.personalInfo.location}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData((prev) => ({
                    ...prev,
                    personalInfo: {
                      ...prev.personalInfo,
                      location: e.target.value,
                    },
                  }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Professional Summary */}
        <Card className="animate-in slide-in-from-bottom-4 duration-500 border-2">
          <CardHeader>
            <CardTitle className="text-2xl text-indigo-500">
              Professional Summary
            </CardTitle>
            <CardDescription className="text-lg">
              Brief overview of your professional background
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnimatedTextarea
              id="summary"
              label="Professional Summary"
              value={formData.summary}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setFormData((prev) => ({ ...prev, summary: e.target.value }))
              }
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Experience */}
        <Card className="animate-in slide-in-from-bottom-4 duration-500 border-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl text-indigo-500">
                  Work Experience
                </CardTitle>
                <CardDescription className="text-lg">
                  Your professional work history
                </CardDescription>
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
              <div
                key={index}
                className="p-6 border-2 rounded-lg space-y-6 relative"
              >
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
                <div className="grid md:grid-cols-2 gap-6">
                  <AnimatedInput
                    id={`company-${index}`}
                    label="Company"
                    value={exp.company}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const newExp = [...formData.experience];
                      newExp[index].company = e.target.value;
                      setFormData((prev) => ({ ...prev, experience: newExp }));
                    }}
                  />
                  <AnimatedInput
                    id={`position-${index}`}
                    label="Position"
                    value={exp.position}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const newExp = [...formData.experience];
                      newExp[index].position = e.target.value;
                      setFormData((prev) => ({ ...prev, experience: newExp }));
                    }}
                  />
                  <AnimatedInput
                    id={`startDate-${index}`}
                    label="Start Date"
                    type="month"
                    value={exp.startDate}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const newExp = [...formData.experience];
                      newExp[index].startDate = e.target.value;
                      setFormData((prev) => ({ ...prev, experience: newExp }));
                    }}
                  />
                  <AnimatedInput
                    id={`endDate-${index}`}
                    label="End Date"
                    type="month"
                    value={exp.endDate}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const newExp = [...formData.experience];
                      newExp[index].endDate = e.target.value;
                      setFormData((prev) => ({ ...prev, experience: newExp }));
                    }}
                  />
                </div>
                <AnimatedTextarea
                  id={`description-${index}`}
                  label="Job Description"
                  value={exp.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    const newExp = [...formData.experience];
                    newExp[index].description = e.target.value;
                    setFormData((prev) => ({ ...prev, experience: newExp }));
                  }}
                  rows={3}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Education */}
        <Card className="animate-in slide-in-from-bottom-4 duration-500 border-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl text-indigo-500">
                  Education
                </CardTitle>
                <CardDescription className="text-lg">
                  Your educational background
                </CardDescription>
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
              <div
                key={index}
                className="p-6 border-2 rounded-lg space-y-6 relative"
              >
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
                <div className="grid md:grid-cols-2 gap-6">
                  <AnimatedInput
                    id={`institution-${index}`}
                    label="Institution"
                    value={edu.institution}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const newEdu = [...formData.education];
                      newEdu[index].institution = e.target.value;
                      setFormData((prev) => ({ ...prev, education: newEdu }));
                    }}
                  />
                  <AnimatedInput
                    id={`degree-${index}`}
                    label="Degree"
                    value={edu.degree}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const newEdu = [...formData.education];
                      newEdu[index].degree = e.target.value;
                      setFormData((prev) => ({ ...prev, education: newEdu }));
                    }}
                  />
                  <AnimatedInput
                    id={`eduStartDate-${index}`}
                    label="Start Date"
                    type="month"
                    value={edu.startDate}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const newEdu = [...formData.education];
                      newEdu[index].startDate = e.target.value;
                      setFormData((prev) => ({ ...prev, education: newEdu }));
                    }}
                  />
                  <AnimatedInput
                    id={`eduEndDate-${index}`}
                    label="End Date"
                    type="month"
                    value={edu.endDate}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const newEdu = [...formData.education];
                      newEdu[index].endDate = e.target.value;
                      setFormData((prev) => ({ ...prev, education: newEdu }));
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Skills */}
        <Card className="animate-in slide-in-from-bottom-4 duration-500 border-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl text-indigo-500">
                  Skills
                </CardTitle>
                <CardDescription className="text-lg">
                  Your technical and soft skills
                </CardDescription>
              </div>
              <Button
                onClick={addSkill}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-transparent"
              >
                <Plus className="h-4 w-4" />
                Add Skill
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {formData.skills.map((skill, index) => (
                <div key={index} className="flex gap-2">
                  <AnimatedInput
                    id={`skill-${index}`}
                    label="Skill"
                    value={skill}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const newSkills = [...formData.skills];
                      newSkills[index] = e.target.value;
                      setFormData((prev) => ({ ...prev, skills: newSkills }));
                    }}
                  />
                  {formData.skills.length > 1 && (
                    <Button
                      onClick={() => removeSkill(index)}
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 mt-2"
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
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 px-16 py-5 text-xl h-16"
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
  );
}

export default CVGeneratorForm;
