import "./App.css";
import { RoomOrganizer, Room } from "./pages/Room";
import { Home } from "./pages/Home";
// import { Route, Routes } from "react-router-dom";

import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import JoinQueueScreen from "./pages/JoinQueueScreen";
import StatusScreen from "./pages/StatusScreen";
import CancelledScreen from "./pages/CancelledScreen";

const WS = "http://localhost:3000";
const queueData = {
  queueNumber: 26,
  queueName: "Marshmallow",
  currentQueue: 25,
  onCall: 2,
  ahead: 24,
};

function App() {
  const [showCancelModal, setShowCancelModal] = useState(false);
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/room/:id/organizer' element={<RoomOrganizer />} />
        <Route path='/room/:id/participant' element={<Room />} />

        <Route
          path='/join'
          element={<JoinQueueScreen queueData={queueData} />}
        />
        <Route
          path='/status'
          element={
            <StatusScreen
              queueData={queueData}
              showCancelModal={showCancelModal}
              setShowCancelModal={setShowCancelModal}
            />
          }
        />
        <Route path='/cancelled' element={<CancelledScreen />} />
      </Routes>
    </>
  );
}

export default App;
