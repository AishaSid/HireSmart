'use client'

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, FileText, Zap, Users } from "lucide-react";

import { useRouter } from 'next/navigation';


export default function Home() {

  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-background flex items-center justify-center relative overflow-hidden">
      {/* Background Image */}


      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-100 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-100 rounded-full blur-3xl animate-glow-pulse" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div className="animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <FileText className="h-12 w-12 text-blue-600 mr-4 animate-glow-pulse" />
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
              HireSmart
            </h1>
          </div>

          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
            Build professional resumes that get you hired. AI-powered resume builder with smart templates and optimization.
          </p>

          {/* Feature highlights */}
          <div className="flex items-center justify-center space-x-8 mb-8 text-sm text-gray-700">
            <div className="flex items-center">
              <Zap className="h-4 w-4 mr-2 text-blue-600" />
              AI-Powered
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2 text-blue-600" />
              Recruiter Approved
            </div>
            <div className="flex items-center">
              <Sparkles className="h-4 w-4 mr-2 text-blue-600" />
              Professional Templates
            </div>
          </div>

          <div className="animate-slide-in-right flex justify-center" style={{ animationDelay: '0.3s' }}>
            <Button
              size="lg"
              
              onClick={() => router.push('/pages/signup')}

              className="w-[300px] py-8 text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              Build Your Resume
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>

          <div className="mt-12 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <p className="text-sm text-gray-700">
              Join thousands of professionals who landed their dream jobs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
