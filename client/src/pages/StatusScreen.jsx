import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const StatusScreen = ({ queueData, showCancelModal, setShowCancelModal }) => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  const handleCloseQueue = () => {
    setShowPopup(true); // Show confirmation popup
  };

  const confirmClose = () => {
    setShowPopup(false);
    navigate('/'); // Navigate after confirmation
  };

  const cancelClose = () => {
    setShowPopup(false); // Just close popup
  };

  return (
    <div className='flex flex-col min-h-screen max-w-[400px] mx-auto bg-white px-6 pt-6 pb-6 relative'>
      {/* Header Logo */}
      <img src={logo} className="mx-auto w-80" />

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
        onClick={handleCloseQueue}
        className='w-full bg-[#B91C1C] text-white font-medium py-3 rounded-full shadow-lg active:scale-95 transition-transform'>
        Cancel Queue
      </button>

      {/* Popup Overlay */}
      {showPopup && (
      <div
        className="fixed inset-0 flex items-center justify-center z-50"
        style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
      >
        <div className="bg-white rounded-2xl p-10 w-[90%] max-w-md text-center shadow-xl">
          <p className="text-2xl font-semibold mb-8">
            Do you want to cancel your queue?
          </p>

          <div className="flex justify-center gap-6">
            <button
              onClick={confirmClose}
              className="bg-[#B22222] text-white px-8 py-4 rounded-full font-semibold hover:scale-105 transition-transform duration-200"
            >
              Yes, Cancel
            </button>

            <button
              onClick={cancelClose}
              className="bg-gray-300 text-black px-8 py-4 rounded-full font-semibold hover:scale-105 transition-transform duration-200"
            >
              No, Keep
            </button>
          </div>
        </div>
      </div>
    )}

    </div>
  );
};

export default StatusScreen;
