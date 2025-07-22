"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    FileText,
    Eye,
    Sparkles,
    CheckCircle,
    Plus,
    Star,
    Clock,
    Users,
    TrendingUp,
    Zap,
    ArrowRight,
} from "lucide-react"

 import { CVGeneratorForm } from "./cvgenerator"
 import { ATSOptimizer } from "../atsoptimize/ats"
 import { useRouter } from "next/navigation"
 import Templates from "../resumetemplates/templates";
 import CoverLetter from "../coverletter/cover";
 import MyResumes from "../myresume/myresume";
 

export default function Dashboard() {
    const [activeSection, setActiveSection] = useState("dashboard")
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const router = useRouter()

    const features = [
        {
            icon: FileText,
            title: "Generate Resume",
            description: "Create professional resumes with AI assistance",
            color: "from-blue-400 to-blue-500",
            action: () => setActiveSection("templates"),
        },
        {
            icon: Eye,
            title: "Try Templates",
            description: "Browse and customize professional templates",
            color: "from-indigo-400 to-indigo-500",
            action: () => setActiveSection("templates"),
        },
        {
            icon: Clock,
            title: "My Resumes",
            description: "View and manage your resume history",
            color: "from-purple-400 to-purple-500",
            action: () => setActiveSection("my-resumes"),
        },
        {
            icon: Sparkles,
            title: "Generate Cover Letter",
            description: "Create compelling cover letters instantly",
            color: "from-cyan-400 to-cyan-500",
            action: () => setActiveSection("cover-letter"),
        },
        {
            icon: CheckCircle,
            title: "ATS Optimization",
            description: "Optimize your CV for Applicant Tracking Systems",
            color: "from-emerald-400 to-emerald-500",
            action: () => setActiveSection("ats-optimizer"),
        },
        {
            icon: Plus,
            title: "Don't have a CV?",
            description: "Generate one from scratch with our guided form",
            color: "from-rose-400 to-rose-500",
            action: () => setActiveSection("cv-generator"),
        },
    ]

    const stats = [
        { label: "Resumes Created", value: "50K+", icon: FileText },
        { label: "Success Rate", value: "94%", icon: TrendingUp },
        { label: "Happy Users", value: "25K+", icon: Users },
        { label: "Templates", value: "100+", icon: Star },
    ]

    const renderContent = () => {
        switch (activeSection) {
            case "cv-generator":
             return <CVGeneratorForm onBack={() => setActiveSection("dashboard")} />
            case "templates":
             return <Templates onBack={() => setActiveSection("dashboard")} />
            case "my-resumes":
             return <MyResumes onBack={() => setActiveSection("dashboard")} />
            case "cover-letter":
             return <CoverLetter onBack={() => setActiveSection("dashboard")} />
            case "ats-optimizer":
             return <ATSOptimizer onBack={() => setActiveSection("dashboard")} />
            default:
                return (
                    <div className="space-y-12">
                        {/* Hero Section */}
                        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-8 md:p-12">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 animate-pulse"></div>
                            <div className="relative z-10 max-w-4xl mx-auto text-center">
                                <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6 animate-bounce">
                                    <Sparkles className="h-4 w-4 text-indigo-500" />
                                    <span className="text-sm font-medium text-gray-700">AI-Powered Resume Builder</span>
                                </div>
                                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent mb-6 animate-in fade-in duration-700">
                                    Build Your Dream Career with HireSmart
                                </h1>
                                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-in slide-in-from-bottom-4 duration-500 delay-200">
                                    Create professional resumes, cover letters, and optimize for ATS systems. Create job-sepcific resumes in minutes.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in slide-in-from-bottom-4 duration-500 delay-300">
                                    <Button
                                        size="lg"
                                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-5.5 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl text-lg font-semibold rounded-lg "
                                        onClick={() => setActiveSection("templates")}
                                    >
                                        <Sparkles className="mr-2 h-5 w-5" />
                                        Start Building Now
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="border-2 border-indigo-200 hover:border-indigo-300 px-8 py-5  transform hover:scale-105 transition-all duration-200 bg-transparent text-lg font-semibold rounded-lg"
                                        onClick={() => setActiveSection("templates")}
                                    >
                                        <Eye className="mr-2 h-5 w-5" />
                                        View Templates
                                    </Button>
                                </div>
                            </div>
                        </section>

                        {/* Stats Section */}
                        <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {stats.map((stat, index) => (
                                <Card
                                    key={index}
                                    className="group text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50"
                                >
                                    <CardContent className="p-6">
                                        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mb-4 animate-pulse transition-all duration-3 [animation-duration:5s]">
                                            <stat.icon className="h-6 w-6 text-white" />
                                        </div>
                                        <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                                        <div className="text-sm text-gray-600">{stat.label}</div>
                                    </CardContent>
                                </Card>

                            ))}
                        </section>

                        {/* Features Grid */}
                        <section>
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent mb-4">
                                    Everything You Need to Get Hired
                                </h2>
                                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                    Comprehensive tools to create, optimize, and manage your job application materials
                                </p>
                            </div>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {features.map((feature, index) => (
                                    <Card
                                        key={index}
                                        className="group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white overflow-hidden animate-in slide-in-from-bottom-4 duration-500"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                        onClick={feature.action}
                                    >
                                        <CardHeader className="pb-4">
                                            <div
                                                className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl mb-4 group-hover:scale-110 transition-transform duration-200`}
                                            >
                                                <feature.icon className="h-6 w-6 text-white" />
                                            </div>
                                            <CardTitle className="text-xl font-semibold text-gray-900 group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-indigo-500 group-hover:bg-clip-text group-hover:text-transparent transition-colors">
                                                {feature.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <CardDescription className="text-gray-600 mb-4">{feature.description}</CardDescription>
                                            <div className="flex items-center bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent font-medium group-hover:translate-x-2 transition-transform duration-200">
                                                Get Started
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </section>

                        {/* CTA Section */}
                        <section className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
                            <div className="absolute inset-0 bg-black/10"></div>
                            <div className="relative z-10">
                                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Land Your Dream Job?</h2>
                                <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                                    Join thousands of professionals who have successfully landed their dream jobs with HireSmart
                                </p>
                                <Button
                                    size="lg"
                                    className="bg-white text-blue-500 hover:bg-gray-100 px-8 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl py-6 text-lg font-semibold rounded-lg"
                                    onClick={() => setActiveSection("cv-generator")}
                                >
                                    <Plus className="mr-2 h-5 w-5" />
                                    Create Your First Resume
                                </Button>
                            </div>
                        </section>
                    </div>
                )
        }
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 cursor-pointer" onClick={() => setActiveSection("dashboard")}>
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                                        <Zap className="h-5 w-5 text-white" />
                                    </div>
                                    <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                                        HireSmart
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex space-x-8">
                            <button
                                onClick={() => setActiveSection("dashboard")}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeSection === "dashboard" ? "text-indigo-500 bg-indigo-50" : "text-gray-700 hover:text-indigo-500"
                                    }`}
                            >
                                Dashboard
                            </button>
                            <button
                                onClick={() => setActiveSection("templates")}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeSection === "templates" ? "text-indigo-500 bg-indigo-50" : "text-gray-700 hover:text-indigo-500"
                                    }`}
                            >
                                Templates
                            </button>
                            <button
                                onClick={() => setActiveSection("my-resumes")}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeSection === "my-resumes"
                                    ? "text-indigo-500 bg-indigo-50"
                                    : "text-gray-700 hover:text-indigo-500"
                                    }`}
                            >
                                My Resumes
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white border-t border-gray-200 animate-in slide-in-from-top-2 duration-300">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            <button
                                onClick={() => {
                                    setActiveSection("dashboard")
                                    setMobileMenuOpen(false)
                                }}
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 w-full text-left"
                            >
                                Dashboard
                            </button>
                            <button
                                onClick={() => {
                                    setActiveSection("templates")
                                    setMobileMenuOpen(false)
                                }}
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 w-full text-left"
                            >
                                Templates
                            </button>
                            <button
                                onClick={() => {
                                    setActiveSection("my-resumes")
                                    setMobileMenuOpen(false)
                                }}
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 w-full text-left"
                            >
                                My Resumes
                            </button>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{renderContent()}</main>
        </div>
    )
}
