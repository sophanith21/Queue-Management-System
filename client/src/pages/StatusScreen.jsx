import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const StatusScreen = ({ queueData, showCancelModal, setShowCancelModal }) => {
  const navigate = useNavigate();

  const handleCancelQueue = () => {
    setShowCancelModal(false);
    navigate("/cancelled"); // Navigates to the CancelledScreen route
  };

  return (
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

      <div className='flex-1'>
        <div className='flex justify-between items-center mb-4'>
          <span className='text-gray-500 font-medium text-1xl'>
            Queue Name:
          </span>
          <span className='text-[#FF7A00] font-medium text-1xl'>
            {queueData.queueName}
          </span>
        </div>

        {/* Status Grid */}
        <div className='grid grid-cols-2 gap-4 mb-6'>
          {/* Your Queue */}
          <div className='border-2 border-[#FF7A00] rounded-xl p-4 flex flex-col items-center justify-center aspect-square shadow-sm'>
            <p className='text-gray-600 text-1xl font-medium mb-1'>
              Your Queue
            </p>
            <div className='text-[#FF7A00] text-6xl font-bold'>
              #{queueData.queueNumber}
            </div>
          </div>
          {/* Ahead */}
          <div className='border-2 border-[#2668D8] rounded-xl p-4 flex flex-col items-center justify-center aspect-square shadow-sm'>
            <p className='text-gray-600 text-1xl font-medium mb-1'>Ahead</p>
            <div className='text-[#2668D8] text-6xl font-bold'>
              #{queueData.ahead}
            </div>
          </div>
        </div>

        {/* On Call Hero */}
        <div className='bg-[#FF7A00] rounded-xl p-8 flex flex-col items-center justify-center mb-6 shadow-md'>
          <p className='text-white text-2xl font-medium mb-1 opacity-90'>
            On Call
          </p>
          <div className='text-white text-6xl font-bold'>
            #{queueData.onCall}
          </div>
        </div>

        <p className='text-[#FF7A00] text-1xl font-bold leading-relaxed text-center mb-8'>
          Attention: We reserved the right to skip
          <br />
          your queue in case of no show
        </p>
      </div>

      <button
        onClick={() => setShowCancelModal(true)}
        className='w-full bg-[#B91C1C] text-white font-medium py-3 rounded-full shadow-lg active:scale-95 transition-transform'>
        Cancel Queue
      </button>

      {/* Modal Overlay */}
      {showCancelModal && (
        <div className='absolute inset-0 z-50 flex items-center justify-center px-6'>
          {/* Backdrop */}
          <div
            className='absolute inset-0 bg-black/50 backdrop-blur-[1px]'
            onClick={() => setShowCancelModal(false)}></div>

          {/* Modal Content */}
          <div className='bg-white rounded-2xl w-full max-w-xs p-6 relative z-10 shadow-2xl animate-in fade-in zoom-in duration-200'>
            <p className='text-[#B91C1C] font-bold text-center text-lg mb-8 leading-tight'>
              Are you sure you want to cancel this queue?
            </p>
            <div className='flex gap-4'>
              <button
                onClick={() => setShowCancelModal(false)}
                className='flex-1 border border-[#2668D8] text-[#2668D8] font-medium py-2 rounded-full active:bg-blue-50'>
                No
              </button>
              <button
                onClick={handleCancelQueue}
                className='flex-1 bg-[#B91C1C] text-white font-medium py-2 rounded-full active:bg-red-800'>
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusScreen;
