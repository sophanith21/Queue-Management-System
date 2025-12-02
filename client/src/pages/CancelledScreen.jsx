import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const CancelledScreen = () => (
  <div className='flex flex-col min-h-screen max-w-[400px] mx-auto bg-white px-6 pt-6 pb-6 relative'>
    {/* Header Logo */}
    <div className='flex justify-center items-center gap-2 mb-8'>
      <div className='w-8 h-8'>
        <img src={logo} alt='logo' />
      </div>
      <div className='flex flex-col leading-none'>
        <span className='text-[#FF7A00] font-bold text-lg'>Queue</span>
        <span className='text-[#002D62] font-bold text-lg'>Station</span>
      </div>
    </div>

    <div className='flex-1 flex flex-col items-center justify-center'>
      <p className='text-[#B91C1C] font-semibold text-center px-8 text-2xl'>
        You have successfully cancel the queue
      </p>
    </div>

    <Link
      to='/join' // Navigates back to the JoinQueueScreen route
      className='w-full bg-white border border-[#2668D8] text-[#2668D8] font-medium py-3 rounded-full active:bg-blue-50 transition-colors text-center'>
      Back
    </Link>
  </div>
);

export default CancelledScreen;
