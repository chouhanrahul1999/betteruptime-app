"use client";
import { useState } from "react";
import { CardWrapper, type CardVariant } from "../ui/cardRapper";

export const Feater = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const cards = [
    {
      title: "Screenshots for errors",
      description: "We record the API errors and take a screenshot of your app being down.",
      image: "https://betterstackcdn.com/assets/v2/homepage-v3/screenshots-c599c065.png",
      variant: "small" as CardVariant
    },
    {
      title: "Traceroute & MTR for timeouts",
      description: "Understand connection timeouts and request timeouts with edge-based traceroute and MTR outputs.",
      image: "https://betterstackcdn.com/assets/v2/homepage-v3/mtr-21fc8135.jpg",
      variant: "large" as CardVariant
    },
    {
      title: "Playwright-based transaction checks",
      description: "Run tests with a real Chrome browser instance with a JavaScript runtime.",
      image: "https://betterstackcdn.com/assets/v2/homepage-v3/phone-alert-f4e21af0.jpg",
      variant: "large" as CardVariant
    },
    {
      title: "Phone call alerts & SMS included",
      description: "Unlimited global phone call alerts, sms, push notifications, and Slack notifications included with every Responder license.",
      image: "https://betterstackcdn.com/assets/v2/homepage-v3/playwright-5c8eef44.png",
      variant: "small" as CardVariant
    }
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % cards.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + cards.length) % cards.length);

  return (
    <div className="bg-slate-950 py-20">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold text-white">
            Uptime monitoring
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
              Explore uptime monitoring
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
