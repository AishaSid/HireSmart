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
    const router = useRouter();

    const handleNext = () => setStep(step + 1)

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


        // Supabase JS v2: error is always null if .throwOnError() is used, so no need to check error here.
        if (data) {
            router.push('/main');
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




    return (
        <div className="relative flex h-screen flex-col font-inter">
            <div
                className="flex flex-1 flex-col items-center justify-center bg-cover bg-center bg-no-repeat p-6"
                style={{
                    backgroundImage: `linear-gradient(to bottom right, rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-4.0.3&auto=format&fit=crop&w=1650&q=80')`
                }}
            >
                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 max-w-md w-full flex flex-col gap-6 text-center">
                    {step === 1 && (
                        <>
                            <h2 className="text-white text-3xl font-bold drop-shadow-md">Enter Your Email</h2>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setEmailError('');
                                }}
                                className="p-3 rounded-lg w-full border-none focus:ring-2 focus:ring-[#019863]"
                            />
                            {emailError && (
                                <p className="text-red-500 text-sm mt-2">{emailError}</p>
                            )}
                            <button
                                className="w-full py-3 rounded-xl bg-[#019863] hover:bg-[#017d52] text-white text-lg font-semibold transition duration-200 shadow-lg"
                                onClick={handleEmailCheck}
                            >
                                Next
                            </button>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <h2 className="text-white text-3xl font-bold drop-shadow-md">What should we call you?</h2>
                            <input
                                type="text"
                                placeholder="Your Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="p-3 rounded-lg w-full border-none focus:ring-2 focus:ring-[#019863]"
                            />

                            <button
                                className="w-full py-3 rounded-xl bg-[#019863] hover:bg-[#017d52] text-white text-lg font-semibold transition duration-200 shadow-lg"
                                onClick={handleNext}
                            >
                                Next
                            </button>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <h2 className="text-white text-3xl font-bold drop-shadow-md">Upload Your Resume</h2>
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => setResume(e.target.files?.[0] || null)}
                                className="p-3 rounded-lg w-full border-none text-white bg-white/10 cursor-pointer"
                            />
                            <button
                                className="w-full py-3 mt-4 rounded-xl bg-[#019863] hover:bg-[#017d52] text-white text-lg font-semibold transition duration-200 shadow-lg"
                                onClick={handleFinalSubmit}
                            >
                                Finish
                            </button>
                            <button
                                className="w-full py-3 mt-2 rounded-xl bg-white/20 text-white text-lg font-semibold transition duration-200 shadow-lg"
                                onClick={handleFinalSubmit}
                            >
                                Skip for now
                            </button>
                        </>
                    )}

                </div>
            </div>
        </div>
    )
}
