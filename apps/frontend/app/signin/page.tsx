"use client";
import axios from "axios";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BACK_URL } from "@/lib/utils";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${BACK_URL}/user/signin`, {
        username,
        password,
      });
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        window.dispatchEvent(new Event("auth-change"));
        router.push("/dashboard");
      }
    } catch (e: any) {
      if (e.response?.data?.errors) {
        const fieldErrors = e.response.data.errors.fieldErrors;
        const errorMessages = [];

        if (fieldErrors?.username) {
          errorMessages.push(`Username: ${fieldErrors.username.join(", ")}`);
        }
        if (fieldErrors?.password) {
          errorMessages.push(`Password: ${fieldErrors.password.join(", ")}`);
        }

        setError(errorMessages.join(" | ") || e.response.data.message);
      } else {
        setError(
          e.response?.data?.message || "Sign in failed. Please try again."
        );
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1117] relative">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-90"
        style={{
          backgroundImage:
            "url('https://betterstackcdn.com/assets/auth/flare-v3-4ebdb86f.jpg')",
        }}
      />

      <Link
        href="/"
        className="absolute top-10 left-10 z-20 inline-flex items-center gap-2 text-gray-500 hover:text-gray-400 transition-colors text-sm"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
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
            <h1 className="text-4xl font-semibold text-white mb-4">
              Welcome back
            </h1>
            <p className="text-gray-400 text-sm">
              First time here?{" "}
              <Link href="/signup" className="text-[#6366f1] hover:underline">
                Sign up for free
              </Link>
              .
            </p>
          </div>

          <form onSubmit={handleSignin} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}
            <div>
              <label className="text-gray-400 text-sm block mb-2.5">
                E-mail
              </label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="email"
                placeholder="Your work e-mail"
                className="w-full bg-[#1a1c28] border-[#2a2d3a] text-white placeholder:text-gray-600 h-12 rounded-xl px-4"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm block mb-2.5">
                Password
              </label>
              <div className="relative">
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="•••••••"
                  className="w-full bg-[#1a1c28] border-[#2a2d3a] text-white placeholder:text-gray-600 h-12 rounded-xl px-4"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#6366f1] hover:bg-[#5558e3] text-white font-medium rounded-xl mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>

            <div className="text-center pt-3">
              <button
                type="button"
                className="text-gray-400 hover:text-gray-300 text-sm transition-colors"
              >
                Sign in using magic link
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
              className="w-full h-12 bg-transparent border-[#2a2d3a] text-gray-300 hover:bg-[#1a1c28] hover:text-white rounded-xl"
            >
              Single Sign-On (SSO)
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
