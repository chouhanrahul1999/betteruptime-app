"use client";

import { FaInstagram, FaTiktok, FaLinkedin, FaTwitter, FaGithub, FaYoutube } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-white py-16 px-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-16">
          <div className="max-w-lg">
            <div className="flex items-center gap-2 mb-5">
              <img 
                className="w-7" 
                src="https://cdn.prod.website-files.com/5e9dc792e1210c5325f7ebbc/64354680f3f50b5758e2cb0d_1642608434799.webp" 
                alt="Better Stack" 
              />
              <span className="text-xl font-medium">Better Stack</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              AI-native platform for on-call and incident response with effortless monitoring, status pages, tracing, infrastructure monitoring and log management.
            </p>
          </div>
          
          <div className="flex items-start gap-12">
            <div className="flex flex-col gap-3">
              <a href="tel:+16289003830" className="text-gray-400 hover:text-white text-sm transition-colors">
                +1 (628) 900-3830
              </a>
              <a href="mailto:hello@betterstack.com" className="text-gray-400 hover:text-white text-sm transition-colors">
                hello@betterstack.com
              </a>
            </div>
            <div className="flex items-center gap-3">
              <a href="#" className="text-gray-500 hover:text-white transition-colors">
                <FaInstagram size={18} />
              </a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">
                <FaTiktok size={18} />
              </a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">
                <FaLinkedin size={18} />
              </a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">
                <FaTwitter size={18} />
              </a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">
                <FaGithub size={18} />
              </a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">
                <FaYoutube size={18} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-6 border-t border-zinc-800/50">
          <div className="flex items-center gap-8 text-sm">
            <a href="#" className="text-gray-500 hover:text-gray-300 transition-colors">Terms of Use</a>
            <a href="#" className="text-gray-500 hover:text-gray-300 transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-gray-300 transition-colors">GDPR</a>
            <a href="#" className="flex items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              System status
            </a>
          </div>
          
          <div className="text-sm text-gray-500">
            © 2025 Better Stack, Inc.
          </div>
        </div>
      </div>
    </footer>
  );
}
