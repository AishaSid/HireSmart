'use client'

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  return (
<div className="relative flex h-screen flex-col font-inter">
  <div
    className="flex flex-1 flex-col items-center justify-center bg-cover bg-center bg-no-repeat p-6"
    style={{
      backgroundImage: `linear-gradient(to bottom right, rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-4.0.3&auto=format&fit=crop&w=1650&q=80')`
    }}
  >
    <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 max-w-3xl w-full flex flex-col gap-5 text-center">
      <h1 className="text-white text-4xl md:text-5xl font-extrabold leading-tight drop-shadow-md">
        Craft Your Career Story with Precision
      </h1>
      <p className="text-white text-base md:text-lg leading-relaxed drop-shadow-sm">
        Transform your job applications with HireSmart—tailor resumes and generate cover letters effortlessly. Highlight your strengths and stand out from the crowd.
      </p>
      <button
        type="button"
        onClick={() => router.push('/pages/signup')}
        className="mt-4 w-full max-w-[300px] mx-auto py-3 rounded-xl bg-[#019863] hover:bg-[#017d52] text-white text-lg font-semibold transition duration-200 shadow-lg"
      >
        Get Started
      </button>
    </div>
  </div>
</div>

  );
}
