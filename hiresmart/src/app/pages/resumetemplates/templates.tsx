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
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Eye,
  Download,
  Star,
  Heart,
  Zap,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Template {
  _id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  isPopular: boolean;
  rating: number;
  downloads: number;
  htmlContent: string;
}

interface ResumeTemplatesProps {
  onBack: () => void;
}

export function ResumeTemplates({ onBack }: ResumeTemplatesProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [generatedResume, setGeneratedResume] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadingWord, setIsDownloadingWord] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const router = useRouter();

  const categories = [
    { id: "all", name: "All Templates", count: templates.length },
    {
      id: "modern",
      name: "Modern",
      count: templates.filter((t) => t.category === "modern").length,
    },
    {
      id: "classic",
      name: "Classic",
      count: templates.filter((t) => t.category === "classic").length,
    },
    {
      id: "creative",
      name: "Creative",
      count: templates.filter((t) => t.category === "creative").length,
    },
    {
      id: "minimal",
      name: "Minimal",
      count: templates.filter((t) => t.category === "minimal").length,
    },
  ];

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch("/api/templates");
        if (!response.ok) throw new Error("Failed to fetch templates");
        const data = await response.json();
        setTemplates(data.data);
      } catch (error) {
        toast.error("Failed to load templates");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  const filteredTemplates =
    selectedCategory === "all"
      ? templates
      : templates.filter((template) => template.category === selectedCategory);

  const handleGenerateResume = async (templateId: string) => {
    setIsGenerating(true);
    try {
      const userId = localStorage.getItem("user_id");
      if (!userId) throw new Error("User not authenticated");

      // Get job details from your form state
      const currentJobTitle = jobTitle;
      const currentJobDescription = jobDescription;

      const response = await fetch("/api/resume/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId,
          userId,
          jobTitle: currentJobTitle,
          jobDescription: currentJobDescription,
          commands: null, // Add any user commands here
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to generate resume");
      }

      // Additional client-side validation
      if (!data.generatedResume || !data.generatedResume.includes("<html")) {
        throw new Error("Invalid resume format received");
      }

      setGeneratedResume(data.generatedResume);
      toast.success("Resume generated successfully!");
    } catch (error: any) {
      console.error("Generation error:", error);
      toast.error(error.message || "Resume generation failed");

      // Fallback to basic resume if AI fails
      const fallbackHtml = createFallbackResume(jobTitle, jobDescription);
      setGeneratedResume(fallbackHtml);
    } finally {
      setIsGenerating(false);
    }
  };

  // Basic fallback function
  const createFallbackResume = (fallbackJobTitle: string, fallbackJobDescription: string) => {
    return `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Resume</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
          h1 { color: #2c3e50; }
          h2 { color: #3498db; border-bottom: 1px solid #eee; padding-bottom: 5px; }
          .section { margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <h1>${jobTitle || "Your Name"}</h1>
        <div class="contact">
          ${jobDescription ? `<p>Job Description: ${jobDescription}</p>` : ""}
        </div>
        
        <div class="section">
          <h2>Professional Summary</h2>
          <p>${
            jobDescription ||
            "Experienced professional seeking new opportunities"
          }</p>
        </div>
        
          ${
            jobDescription
              ? `
        <div class="section">
          <h2>Experience</h2>
          <p>${jobDescription}</p>
        </div>
        `
              : ""
          }
      </body>
      </html>`;
  };

  const handleDownloadPDF = async () => {
    if (!generatedResume) {
      toast.error("No resume content available");
      return;
    }

    setIsDownloading(true);

    try {
      const userId = localStorage.getItem("user_id");

      const response = await fetch("/api/resume/pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/pdf",
        },
        body: JSON.stringify({
          htmlContent: generatedResume,
          userId: userId || "anonymous",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      // Check if response is actually a PDF
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/pdf")) {
        throw new Error("Invalid response format - expected PDF");
      }

      const blob = await response.blob();

      // Validate blob size
      if (blob.size === 0) {
        throw new Error("Empty PDF file received");
      }

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `resume-${
        userId || "generated"
      }-${new Date().getTime()}.pdf`;
      a.style.display = "none";

      document.body.appendChild(a);
      a.click();

      // Cleanup
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);

      toast.success("Resume downloaded successfully!");
    } catch (error: any) {
      console.error("PDF download error:", error);
      toast.error(error.message || "Failed to download PDF");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadWord = async () => {
    if (!generatedResume) {
      toast.error("No resume content available");
      return;
    }

    setIsDownloadingWord(true);

    try {
      const userId = localStorage.getItem("user_id");

      const response = await fetch("/api/resume/word", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept:
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        },
        body: JSON.stringify({
          htmlContent: generatedResume,
          userId: userId || "anonymous",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      // Check if response is actually a Word document
      const contentType = response.headers.get("content-type");
      if (
        !contentType ||
        !contentType.includes(
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )
      ) {
        throw new Error("Invalid response format - expected Word document");
      }

      const blob = await response.blob();

      // Validate blob size
      if (blob.size === 0) {
        throw new Error("Empty Word document received");
      }

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `resume-${
        userId || "generated"
      }-${new Date().getTime()}.docx`;
      a.style.display = "none";

      document.body.appendChild(a);
      a.click();

      // Cleanup
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);

      toast.success("Word document downloaded successfully!");
    } catch (error: any) {
      console.error("Word download error:", error);
      toast.error(error.message || "Failed to download Word document");
    } finally {
      setIsDownloadingWord(false);
    }
  };

  if (selectedTemplate) {
    const template = templates.find((t) => t._id === selectedTemplate);
    if (!template) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => {
              setSelectedTemplate(null);
              setGeneratedResume(null);
              setJobTitle("");
              setJobDescription("");
            }}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Templates
          </Button>
        </div>

        {/* this is the main content */}
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-2">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {template.name}
                </h1>
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
                <div className="bg-white shadow-2xl rounded-lg p-2 max-w-2xl mx-auto animate-in fade-in duration-500">
                  <div dangerouslySetInnerHTML={{ __html: generatedResume }} />
                </div>
              ) : (
                <div className="bg-white shadow-2xl rounded-lg p-2 max-w-2xl mx-auto animate-in fade-in duration-500">
                  <div className="flex flex-col items-center justify-center h-72 text-gray-400">
                    <Zap className="h-12 w-12 mb-4" />
                    <h3 className="text-xl font-medium mb-2">
                      No Resume Generated Yet
                    </h3>
                    <p className="text-center max-w-md">
                      Click the "Generate Resume" button to create your
                      AI-optimized resume using this template.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Job Information Form */}
        {!generatedResume && (
          <div className="max-w-2xl mx-auto mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Job Information</CardTitle>
                <CardDescription>
                  Enter the job details to tailor your resume
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label
                    htmlFor="jobTitle"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Job Title *
                  </label>
                  <input
                    id="jobTitle"
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g., Software Engineer, Marketing Manager"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="jobDescription"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Job Description (Optional)
                  </label>
                  <textarea
                    id="jobDescription"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here to better tailor your resume..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* this is the button section */}
        <div className="flex items-center justify-center ">
          {generatedResume ? (
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-transparent py-7"
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
                className="flex items-center gap-2 bg-transparent py-7"
                onClick={handleDownloadWord}
                disabled={isDownloadingWord}
              >
                {isDownloadingWord ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Download Word
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => handleGenerateResume(template._id)}
                className="flex items-center gap-2 justify-center py-7"
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
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-500 flex items-center gap-2 py-7"
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
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

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
                      e.stopPropagation();
                      setSelectedTemplate(template._id);
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
              <CardDescription className="mb-3">
                {template.description}
              </CardDescription>
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
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Need a custom resume?
            </h3>
            <p className="text-gray-600 mb-6">
              Our AI can analyze your experience and create a perfectly tailored
              resume
            </p>
            <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-500">
              Create Custom Resume
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ResumeTemplates;
