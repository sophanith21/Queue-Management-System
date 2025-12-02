import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ManageQueuePage() {
  const nav = useNavigate();
  const [current, setCurrent] = useState(1);
  const [ahead, setAhead] = useState(5);
  const [oneCall, setOneCall] = useState(3);
  const [next, setNext] = useState(2);
  const [callingNumber, setCallingNumber] = useState(1);

  const [showPopup, setShowPopup] = useState(false);

  const decrementCalling = () => {
    if (callingNumber > 0) setCallingNumber(callingNumber - 1);
  };

  const incrementCalling = () => {
    setCallingNumber(callingNumber + 1);
  };

  const handleCloseQueue = () => {
    setShowPopup(true); // Show confirmation popup
  };

  const confirmClose = () => {
    setShowPopup(false);
    nav('/'); // Navigate after confirmation
  };

  const cancelClose = () => {
    setShowPopup(false); // Just close popup
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 relative">
      <div className="w-full max-w-4xl space-y-8">
        {/* Page Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-[#F97316]">
          Manage Queue
        </h1>

        {/* Queue Stats */}
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-white rounded-2xl shadow-lg border-2 border-[rgba(13,71,161,0.5)] py-2 px-4 flex justify-between items-center">
            <p className="text-gray-600 text-xl">Current</p>
            <p className="text-4xl font-bold text-black">#{current}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border-2 border-[rgba(13,71,161,0.5)] py-2 px-4 flex justify-between items-center">
            <p className="text-gray-600 text-xl">Ahead</p>
            <p className="text-4xl font-bold text-black">{ahead}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border-2 border-[rgba(13,71,161,0.5)] py-2 px-4 flex justify-between items-center">
            <p className="text-gray-600 text-xl">One Call</p>
            <p className="text-4xl font-bold text-black">{oneCall}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border-2 border-[rgba(13,71,161,0.5)] py-2 px-4 flex justify-between items-center">
            <p className="text-gray-600 text-xl">Next</p>
            <p className="text-4xl font-bold text-black">{next}</p>
          </div>
        </div>

        {/* Calling Control */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600 text-2xl">On Call</p>
            <p className="text-5xl font-bold text-[#F97316]">#{callingNumber}</p>
          </div>

          <div className="flex justify-center items-center gap-6">
            <button 
              onClick={decrementCalling}
              className="w-16 h-16 bg-[#B22222] text-white text-3xl font-bold rounded-full hover:scale-105 transition-transform duration-200 shadow-md"
            >
              -
            </button>
            <button 
              onClick={incrementCalling}
              className="w-16 h-16 bg-[#0D47A1] text-white text-3xl font-bold rounded-full hover:scale-105 transition-transform duration-200 shadow-md"
            >
              +
            </button>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-center">
          <button 
            onClick={handleCloseQueue}
            className="bg-[#B22222] text-white px-12 py-4 rounded-full text-lg font-semibold hover:scale-105 transition-transform duration-200 shadow-lg"
          >
            Close Queue
          </button>
        </div>
      </div>

      {/* Popup Overlay */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-xl">
            <p className="text-xl font-semibold mb-6">Are you sure you want to close the queue?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmClose}
                className="bg-[#B22222] text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition-transform duration-200"
              >
                Close Queue
              </button>
              <button
                onClick={cancelClose}
                className="bg-gray-300 text-black px-6 py-3 rounded-full font-semibold hover:scale-105 transition-transform duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
