"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function HappyCustomers() {
  return (
    <div className="bg-slate-950 text-white py-32 px-24">
      <div className="max-w-6xl mx-auto grid grid-cols-2 gap-20 items-center">
        <div className="pl-12">
          <h1 className="text-4xl font-bold mb-6 leading-tight">
            Happy customers, growing market presence
          </h1>
          <p className="text-gray-400 text-base mb-10 leading-relaxed">
            Ship higher-quality software faster. Be the hero of your engineering teams.
          </p>
          <div className="flex gap-3 mb-4">
            <Input
              type="email"
              placeholder="Your work e-mail"
              className="bg-slate-900/50 border-slate-800 text-white placeholder:text-gray-500 h-12 px-4"
            />
            <Button size="lg" className="bg-[#5f68d7] hover:bg-[#5f68d7]/90 h-12 px-8">
              Start for free
            </Button>
          </div>
          <p className="text-gray-500 text-sm">
            Start monitoring for free or{" "}
            <a href="#" className="text-gray-300 underline hover:text-white">
              book a demo
            </a>
          </p>
        </div>
        <div className="relative">
          <img
            src="https://betterstackcdn.com/assets/v2/tracing/service_map-85ad3618.png"
            alt="Service map"
            className="w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
}
