import React from "react";
import { Link } from "react-router-dom";

const JoinQueueScreen = ({ queueData }) => (
  <div className='flex flex-col min-h-screen max-w-[400px] mx-auto bg-white px-6 pt-6 pb-6 relative'>
    <div className='flex-1'>
      <h1 className='text-center text-[#FF7A00] font-bold text-xl mb-8'>
        Queue Information
      </h1>

      {/* Main Ticket Card */}
      <div className='border-2 border-[#FF7A00] rounded-xl p-6 mb-8 text-center bg-white shadow-sm'>
        <p className='text-gray-600 font-medium mb-2 text-1xl'>
          Your Queue Will Be
        </p>
        <div className='text-[#FF7A00] text-5xl font-bold'>
          #{queueData.queueNumber}
        </div>
      </div>

      {/* Details List */}
      <div className='space-y-4 text-sm font-medium'>
        <div className='flex justify-between items-center'>
          <span className='text-gray-500'>Queue Name</span>
          <span className='text-gray-900'>{queueData.queueName}</span>
        </div>
        <div className='flex justify-between items-center'>
          <span className='text-gray-500'>Current Queue</span>
          <span className='text-gray-900'>#{queueData.currentQueue}</span>
        </div>
        <div className='flex justify-between items-center'>
          <span className='text-gray-500'>On Call</span>
          <span className='text-gray-900'>#{queueData.onCall}</span>
        </div>
        <div className='flex justify-between items-center'>
          <span className='text-gray-500'>Ahead</span>
          <span className='text-gray-900'>#{queueData.ahead}</span>
        </div>
      </div>
    </div>

    <Link
      to='/status' // Navigates to the StatusScreen route
      className='w-full bg-[#FF7A00] text-white font-bold py-4 rounded-full shadow-lg active:scale-95 transition-transform text-center'>
      Join Queue
    </Link>
  </div>
);

export default JoinQueueScreen;
