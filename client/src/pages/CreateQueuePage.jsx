import React, { useState } from "react";
import logo from '../assets/logo.png'
import { useNavigate } from "react-router-dom";
export default function CreateQueuePage() {
  const [queueName, setQueueName] = useState("");
  const [attention, setAttention] = useState("");
  const [error, setError] = useState("");

  const nav = useNavigate()

  const handleCreateQueue = () => {
    if (!queueName.trim()) {
      setError("Queue name is required");
      return;
    }
    setError("");
    nav('/qr');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <img src={logo} className="mx-auto w-80" />
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Create New Queue
            </h2>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Queue Name*
              </label>
              <input
                type="text"
                value={queueName}
                onChange={(e) => setQueueName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0D47A1] focus:outline-none transition-colors text-gray-800 placeholder-gray-400 mb-4"
                required
              />

              {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Attention (optional)
              </label>
              <input
                type="text"
                value={attention}
                onChange={(e) => setAttention(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0D47A1] focus:outline-none transition-colors text-gray-800 placeholder-gray-400"
              />
            </div>

            <button
              onClick={handleCreateQueue}
              className="w-full bg-[#F97316] text-white px-8 py-4 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Create Queue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}