'use client'	
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LogOut, Home } from "lucide-react";

const Index = () => {
 const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-background flex items-center justify-center">
      <div className="text-center animate-fade-in">
        <div className="bg-gradient-card p-8 rounded-xl border border-border shadow-elegant max-w-md">
          <Home className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4 text-foreground">Resume Builder Dashboard</h1>
          <p className="text-muted-foreground mb-6">
            Welcome to HireSmart! You're all set to start building professional resumes.
          </p>
          <Button
            onClick={() => router.push('/')}
            variant="outline"
            className="w-full"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;