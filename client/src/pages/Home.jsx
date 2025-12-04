import React from "react";
import { Plus, List } from 'lucide-react';
import logo from '../assets/logo.png'
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen via-white to-orange-50 flex flex-col items-center justify-center p-4">
      <div className="mb-12 text-center">
        <div className="mb-12 text-center">
          <img src={logo} className="mx-auto w-80" />
        </div>
      </div>

      <div className="flex gap-4 w-full max-w-md">
        <button 
          className="group relative w-full px-8 py-6 bg-[#F97316] text-white border-2 border-[#F97316] rounded-2xl shadow-lg hover:shadow-xl hover:bg-orange-600 transition-all duration-300 transform hover:-translate-y-1"
          onClick={() => navigate('/create')}  
        >
            <div className="flex flex-col items-center justify-center gap-3">
              <div 
                className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                <Plus className="w-12 h-12 text-white" />
              </div>
              <span className="text-xl font-bold">Create Queue</span>
            </div>
          </button>

          <button 
            className="group relative w-full px-8 py-6 bg-white text-black border-2 border-[#F97316] rounded-2xl shadow-lg hover:shadow-xl hover:bg-orange-50 transition-all duration-300 transform hover:-translate-y-1"
            onClick={() => navigate('/join')}    
          >
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="p-2 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors">
                <List className="w-12 h-12 text-[#0D47A1]" />
              </div>
              <span className="text-xl font-bold">Join Queue</span>
            </div>
          </button>
      </div>
    </div>
  );
}