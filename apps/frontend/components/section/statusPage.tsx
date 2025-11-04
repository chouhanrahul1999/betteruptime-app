"use client";
import { useState } from "react";
import { CardWrapper, type CardVariant } from "../ui/cardRapper";

export const StatusPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const cards = [
    {
      title: "Whitelabel status page",
      description: "Beautifully designed status page. Fully customizable with CSS and Javascript.",
      image: "https://betterstackcdn.com/assets/v2/homepage-v3/whitelabel-status-page-165068a0.png",
      variant: "small" as CardVariant
    },
    {
      title: "Status page updates",
      description: "Send automated updates to your customers when incident occurs. Let your customers subscribe to the entire status page or just selected components.",
      image: "https://betterstackcdn.com/assets/v2/homepage-v3/status-page-updates-e20a996f.jpg",
      variant: "large" as CardVariant
    },
    {
      title: "Translate status page",
      description: "Be perceived as a local by your foreign customers. Customize every translation.",
      image: "https://betterstackcdn.com/assets/v2/homepage-v3/translate-status-page-6efdaacc.png",
      variant: "small" as CardVariant
    },
    {
      title: "Status page charts",
      description: "Show pre-built charts with response times or add custom metrics with advanced visualizations directly to your status page.",
      image: "https://betterstackcdn.com/assets/v2/homepage-v3/status-page-charts-cc80e6ec.jpg",
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
            Status page
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
              Explore status pages
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
