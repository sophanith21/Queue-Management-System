import React, {useState} from 'react';
import logo from '../assets/logo.png'
import qrCode from '../assets/qr-code.png'
import { useNavigate } from 'react-router-dom';

export default function QRCodePage({queueData}) {
    const [showPopup, setShowPopup] = useState(false);
    const nav = useNavigate()

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
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
            <div className="flex flex-col items-center justify-center space-y-6 w-full max-w-md">
                {/* Logo */}
                <img 
                    src={logo}
                    className="w-48 h-auto" 
                    alt="Logo"
                />
                
                {/* Queue Name */}
                <div className="text-center space-y-1">
                    <p className="text-md text-gray-700 font-medium">Queue Name</p>
                    <p className="text-3xl font-bold text-orange-500 tracking-wide">{queueData.queueName}</p>
                </div>

                {/* QR Code */}
                <img 
                    src={qrCode}
                    className="w-64 h-auto"
                    alt="QR Code"
                />

                {/* Buttons */}
                <div className="flex flex-col gap-4 w-full mt-4">
                    <button 
                        className="w-full bg-white text-black px-6 py-3 border-2 border-[#0D47A1] rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"       
                    >
                        Display QR Code
                    </button>
                    <div className="flex gap-4 w-full">
                        <button 
                            className="flex-1 bg-[#0D47A1] px-6 py-3 rounded-full text-white font-semibold hover:scale-105 transition-transform duration-200"
                            onClick={() => nav('/manage')}    
                        >
                            Manage Queue
                        </button>
                        <button 
                            className="flex-1 bg-[#B22222] px-6 py-3 rounded-full text-white font-semibold hover:scale-105 transition-transform duration-200"
                            onClick={handleCloseQueue}
                        >
                            Close Queue
                        </button>
                    </div>
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
