import React from 'react';
import logo from '../assets/logo.png'
import { useNavigate } from 'react-router-dom';
export default function QueueBoardingScreen() {
    const nav = useNavigate()
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-2xl">
        {/* Logo */}
        <div className="flex justify-center">
            <img 
                src={logo}
                className="w-70 h-auto" 
            />
        </div>
        
        {/* Text Content */}
        <div className="space-y-2">
          <p className="text-lg text-black max-w-xl mx-auto leading-relaxed">
            Reduce wait times, improve service, and enhance customer satisfaction.
          </p>
        </div>

        {/* Loading indicator */}
        <div className="flex justify-center pt-8">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-[#0D47A1] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-[#0D47A1] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-[#0D47A1] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center pt-8">
          <button 
            className="bg-[#F97316] text-white px-8 py-4 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            onClick={() => nav('/')}          
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}