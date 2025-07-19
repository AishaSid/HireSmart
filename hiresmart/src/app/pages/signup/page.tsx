'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'


export default function Signup() {
    const [step, setStep] = useState(1)
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [emailError, setEmailError] = useState('');
    const [resume, setResume] = useState<File | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [isVisible, setIsVisible] = useState(true)
    const router = useRouter();

    const handleNext = () => setStep(step + 1)
    const handlePrev = () => setStep(step - 1)

    const handleEmailCheck = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError('Invalid email format');
            return;
        }
        setEmailError('');

        const { data, error } = await supabase
            .from('user')
            .select('*')
            .eq('email', email)
            .maybeSingle();

        if (data) {
            router.push('/pages/dashboard');
        } else {
            setStep(2);
        }
    };

    const [signupStatus, setSignupStatus] = useState<{ success: boolean; message: string } | null>(null);

    const handleFinalSubmit = async () => {
        const { error } = await supabase.from('user').insert({
            email,
            first_name: name,
        });

        if (!error) {
            setSignupStatus({ success: true, message: 'Signup Successful' });
            setTimeout(() => {
                router.push('/main');
            }, 1500);
        } else {
            setSignupStatus({ success: false, message: error.message || 'Signup failed. Please try again.' });
        }
    }

    const handleFileChange = (file: File) => {
        if (file && (file.type === 'application/pdf' || file.type.includes('document'))) {
            setResume(file);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileChange(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const steps = [
        { number: 1, title: 'Email' },
        { number: 2, title: 'Profile' },
        { number: 3, title: 'CV Upload' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-accent/30 to-primary-glow/20 overflow-hidden text-black">
                    
            {/* Background Elements */}
<div className="absolute inset-0">
  <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200 rounded-full blur-3xl animate-float" />
  <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-100 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-100 rounded-full blur-3xl animate-glow-pulse" />
</div>

            {/* Navigation */}
            <nav className={`relative z-10 p-6 flex justify-between items-center transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">HireSmart</span>
                </div>
                <button
                    onClick={() => router.push('/')}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 backdrop-blur-sm  hover:bg-gray-200 transition-all duration-300"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>Back to Home</span>
                </button>
            </nav>

            {/* Main Content */}
            <main className="relative z-10 container mx-auto px-6 py-8 ">
                <div className="max-w-md mx-auto">
                    {/* Progress Steps */}
                    <div className={`mb-12 transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        <div className="flex justify-between items-center mb-4">
                            {steps.map((stepItem, index) => (
                                <div key={stepItem.number} className="flex items-center">
                                    <div className={`
                                        w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 text-sm font-semibold
                                        ${step >= stepItem.number
                                            ? 'bg-blue-600 text-white scale-110 shadow-lg shadow-blue-500/30'
                                            : 'bg-gray-200 text-gray-500'
                                        }
                                    `}>
                                        {step > stepItem.number ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : (
                                            stepItem.number
                                        )}
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className={`
                                            w-16 h-1 mx-2 transition-all duration-500 rounded-full
                                            ${step > stepItem.number ? 'bg-blue-600 shadow-lg shadow-blue-500/30' : 'bg-gray-300'}
                                        `} />
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="text-center">
                            <h2 className="text-3xl font-bold mb-2 text-black">Add Your Account</h2>
                            <p className="text-gray-700">Step {step} of 3: {steps[step - 1].title}</p>
                        </div>
                    </div>

                    {/* Form Card */}
                    <div className={` card-elegant p-8 border border-gray-300 rounded-2xl shadow-lg transition-all duration-1000 delay-500 bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        {/* Step 1: Email */}
                        {step === 1 && (
                            <div className="space-y-6 transition-all duration-500 ease-in-out">
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                                        <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-black">What's your email?</h3>
                                    <p className="text-gray-700">You'll be logged in directly if you already have an account.</p>
                                </div>
                                <div className="space-y-2">
                                    <input
                                        type="email"
                                        placeholder="Enter your email address"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            setEmailError('');
                                        }}
                                        className={`w-full px-4 py-4 text-lg rounded-lg bg-gray-100 border border-gray-300 text-gray-900 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 ${emailError ? 'border-red-500' : 'border-gray-300'}`}
                                        autoFocus
                                    />
                                    {emailError && <p className="text-red-400 text-sm">{emailError}</p>}
                                </div>
                                <button
                                    onClick={handleEmailCheck}
                                    disabled={!email}
                                    className="w-full py-4 text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700  text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                                >
                                    Continue
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </button>
                            </div>
                        )}

                        {/* Step 2: Name */}
                        {step === 2 && (
                            <div className="space-y-6 transition-all duration-500 ease-in-out">
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                                        <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-black">What's your name?</h3>
                                    <p className="text-gray-700">This will appear on your resume and profile.</p>
                                </div>
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-4 text-lg rounded-lg bg-white/90 backdrop-blur-sm border-2 border-white/30 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500"
                                        autoFocus
                                    />
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={handlePrev}
                                        className="flex-1 py-4 bg-gray-200 text-gray-800 border border-gray-300 rounded-lg transition-all duration-300 hover:bg-gray-300 flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                                        </svg>
                                        Back
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        disabled={!name}
                                        className="flex-1 py-4 bg-gradient-to-r text-white from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700  text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                                    >
                                        Continue
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: CV Upload */}
                        {step === 3 && (
                            <div className="space-y-6 transition-all duration-500 ease-in-out">
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                                        <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-black">Upload your CV</h3>
                                    <p className="text-gray-700">Help us understand your background better (optional).</p>
                                </div>

                                {/* File Upload Area */}
                                <div
                                    className={`
                                        border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 backdrop-blur-sm
                                        ${isDragging
                                            ? 'border-blue-500 bg-blue-500/20'
                                            : resume
                                                ? 'border-blue-500 bg-blue-500/10'
                                                : 'border-white/30 hover:border-blue-500/50 hover:bg-white/5'
                                        }
                                    `}
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                >
                                    {resume ? (
                                        <div className="flex items-center justify-center space-x-3">
                                            <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <div>
                                                <p className="font-medium text-black">{resume.name}</p>
                                                <p className="text-sm text-gray-700">
                                                    {(resume.size / 1024 / 1024).toFixed(2)} MB
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => setResume(null)}
                                                className="p-1 rounded-full hover:bg-red-500/20 text-red-400 transition-colors duration-200"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ) : (
                                        <div>
                                            <svg className="w-12 h-12 text-blue-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                            <p className="text-lg font-medium mb-2 text-black">Drop your CV here</p>
                                            <p className="text-gray-700 mb-4">or click to browse</p>
                                            <input
                                                type="file"
                                                accept=".pdf,.doc,.docx"
                                                onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                                                className="hidden"
                                                id="cv-upload"
                                            />
                                            <label htmlFor="cv-upload">
                                                <span className="cursor-pointer inline-block px-6 py-3 bg-white/20 backdrop-blur-sm  rounded-lg border border-white/30 hover:bg-white/30 transition-all duration-300">
                                                    Choose File
                                                </span>
                                            </label>
                                            <p className="text-xs text-gray-700 mt-2">PDF, DOC, DOCX only, max 10MB</p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex space-x-3">
                                    <button
                                        onClick={handlePrev}
                                        className="flex-1 py-4 bg-gray-200 text-gray-800 border border-gray-300 rounded-lg transition-all duration-300 hover:bg-gray-300 flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                                        </svg>
                                        Back
                                    </button>
                                    <button
                                        onClick={handleFinalSubmit}
                                        className="flex-1 py-4 bg-white/30 backdrop-blur-sm  text-lg font-semibold rounded-lg transition-all duration-300 hover:bg-white/40"
                                    >
                                        Skip for now
                                    </button>
                                    <button
                                        onClick={handleFinalSubmit}
                                        disabled={!resume}
                                        className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700  text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                                    >
                                        Complete
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Success/Error Message */}
                        {signupStatus && (
                            <div className={`mt-4 p-4 rounded-lg text-center ${signupStatus.success ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                                {signupStatus.message}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}