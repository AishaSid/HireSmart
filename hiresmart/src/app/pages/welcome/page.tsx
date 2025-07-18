'use client'

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, FileText, Zap, Users } from "lucide-react";
// import heroImage from "@/assets/hero-bg.jpg";

import { useRouter } from 'next/navigation';


export default function Home() {
 
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-background flex items-center justify-center relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 opacity-30"
        style={{

          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl animate-glow-pulse" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div className="animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <FileText className="h-12 w-12 text-primary mr-4 animate-glow-pulse" />
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              HireSmart
            </h1>
          </div>

          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Build professional resumes that get you hired. AI-powered resume builder with smart templates and optimization.
          </p>

          {/* Feature highlights */}
          <div className="flex items-center justify-center space-x-8 mb-8 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Zap className="h-4 w-4 mr-2 text-primary" />
              AI-Powered
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2 text-primary" />
              Recruiter Approved
            </div>
            <div className="flex items-center">
              <Sparkles className="h-4 w-4 mr-2 text-primary" />
              Professional Templates
            </div>
          </div>

          <div className="animate-slide-in-right" style={{ animationDelay: '0.3s' }}>
            <Button
              size="lg"
              onClick = {() => router.push('/pages/signup')}
              className="px-8 py-4 text-lg font-semibold bg-gradient-primary hover:opacity-90 transition-all duration-300 shadow-glow hover:shadow-elegant group"
            >
              Build Your Resume
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>

          <div className="mt-12 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <p className="text-sm text-muted-foreground">
              Join thousands of professionals who landed their dream jobs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
