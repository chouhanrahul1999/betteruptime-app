"use client";
import { useState } from "react";
import { CardWrapper, type CardVariant } from "../ui/cardRapper";

export const LogManagement = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const cards = [
    {
      title: "Query-time sampling",
      description: "Sample your logs at query time to reduce costs and improve performance.",
      image: "https://betterstackcdn.com/assets/v2/homepage-v3/query-time-sampling-58e2ff43.jpg",
      variant: "large" as CardVariant
    },
    {
      title: "Mark spam",
      description: "Automatically mark and filter out spam logs to keep your data clean.",
      image: "https://betterstackcdn.com/assets/v2/homepage-v3/mark-spam-70de9a06.jpg",
      variant: "small" as CardVariant
    },
    {
      title: "Pattern filtering",
      description: "Filter logs by patterns to quickly find what you're looking for.",
      image: "https://betterstackcdn.com/assets/v2/homepage-v3/pattern-filtering-627a8b7d.jpg",
      variant: "small" as CardVariant
    },
    {
      title: "Always available storage",
      description: "Your logs are always available with reliable and scalable storage.",
      image: "https://betterstackcdn.com/assets/v2/homepage-v3/always-available-storage-48c3d507.jpg",
      variant: "large" as CardVariant
    }
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % cards.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + cards.length) % cards.length);

  return (
    <div className="bg-slate-950 py-20">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold text-white">
            Log management
          </h2>
          <div className="flex items-center gap-4">
            <button onClick={prevSlide} className="w-10 h-10 rounded-full border border-gray-700 hover:border-gray-600 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
              <svg
                className="w-5 h-5"
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
            </button>
            <button onClick={nextSlide} className="w-10 h-10 rounded-full border border-gray-700 hover:border-gray-600 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
            <button className="px-6 py-2.5 rounded-full border border-gray-700 hover:border-gray-600 text-white text-sm font-medium transition-colors flex items-center gap-2">
              Explore log management
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="overflow-hidden">
          <div 
            className="flex gap-6 transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 33.33}%)` }}
          >
            {cards.map((card, index) => (
              <CardWrapper key={index} {...card} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
