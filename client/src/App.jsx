import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import React, { useState } from "react";
import { RoomOrganizer, Room } from "./pages/Room";

import JoinQueueScreen from "./pages/JoinQueueScreen";
import StatusScreen from "./pages/StatusScreen";
import CancelledScreen from "./pages/CancelledScreen";
import HomePage from "./pages/Home";
import CreateQueuePage from "./pages/CreateQueuePage";
import QueueBoardingPage from "./pages/Onboarding";
import ResultQRCodePage from "./pages/ResultQRCodePage";
import ManageQueuePage from "./pages/ManageQueue";

const WS = "http://localhost:3000";
const queueData = {
  queueNumber: 26,
  queueName: "Marshmallow",
  currentQueue: 25,
  onCall: 2,
  ahead: 24,
};

export default function App() {
  const [showCancelModal, setShowCancelModal] = useState(false);
  return (
    <Routes>
      <Route path="/onboarding" element={<QueueBoardingPage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/create" element={<CreateQueuePage />} />
      <Route path='/join' element={<JoinQueueScreen queueData={queueData} />}/>
      <Route path="/manage" element={<ManageQueuePage queueData={queueData}/>} />
      <Route path="/qr" element={<ResultQRCodePage queueData={queueData}/>} />
      <Route path='/status' element={<StatusScreen queueData={queueData}/>}/>
      <Route path="/room/:id/organizer" element={<RoomOrganizer />} />
      <Route path="/room/:id/participant" element={<Room />} />

      {/* 404 fallback */}
      <Route
        path="*"
        element={
          <div className="text-center mt-20">
              <h2 className="text-2xl font-bold text-red-500">
                404 — Page Not Found
              </h2>
          </div>
        }
      />
    </Routes>
  )
}