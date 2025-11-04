"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#0f1117] relative">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-90"
        style={{ backgroundImage: "url('https://betterstackcdn.com/assets/auth/flare-v3-4ebdb86f.jpg')" }}
      />
      
      <Link href="/" className="absolute top-10 left-10 z-20 inline-flex items-center gap-2 text-gray-500 hover:text-gray-400 transition-colors text-sm">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Better Stack
      </Link>

      <div className="relative z-10 flex items-center justify-center min-h-screen py-12">
        <div className="w-full max-w-[440px] px-6">
          <div className="flex flex-col items-center mb-12">
            <img 
              className="w-16 mb-10" 
              src="https://cdn.prod.website-files.com/5e9dc792e1210c5325f7ebbc/64354680f3f50b5758e2cb0d_1642608434799.webp" 
              alt="Better Stack" 
            />
            <h1 className="text-4xl font-semibold text-white mb-4">Sign up for free</h1>
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <Link href="/signin" className="text-[#6366f1] hover:underline">
                Sign in
              </Link>
              .
            </p>
          </div>

          <form className="space-y-5">
            <div>
              <label className="text-gray-400 text-sm block mb-2.5">E-mail</label>
              <Input
                type="email"
                placeholder="Your work e-mail"
                className="w-full bg-[#1a1c28] border-[#2a2d3a] text-white placeholder:text-gray-600 h-12 rounded-xl px-4"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm block mb-2.5">Password</label>
              <Input
                type="password"
                placeholder="•••••••"
                className="w-full bg-[#1a1c28] border-[#2a2d3a] text-white placeholder:text-gray-600 h-12 rounded-xl px-4"
              />
            </div>

            <Button className="w-full h-12 bg-[#6366f1] hover:bg-[#5558e3] text-white font-medium rounded-xl mt-6">
              Sign up
            </Button>

            <div className="text-center pt-3">
              <button
                type="button"
                className="text-gray-400 hover:text-gray-300 text-sm transition-colors"
              >
                Sign up using magic link
              </button>
            </div>

            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#2a2d3a]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[#0f1117] text-gray-500">or</span>
              </div>
            </div>

            <Button
              variant="outline"
              type="button"
              className="w-full h-12 bg-transparent border-[#2a2d3a] text-gray-300 hover:bg-[#1a1c28] rounded-xl hover:text-white "
            >
              Single Sign-On (SSO)
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
