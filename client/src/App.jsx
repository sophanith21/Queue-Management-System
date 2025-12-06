import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { RoomOrganizer } from "./pages/RoomOrganizer";

import HomePage from "./pages/Home";
import CreateQueuePage from "./pages/CreateQueuePage";
import QueueBoardingPage from "./pages/Onboarding";
import { Room } from "./pages/Room";
import ReportPage from "./pages/ReportPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<QueueBoardingPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/create" element={<CreateQueuePage />} />
      <Route path="/queue/:id/organizer" element={<RoomOrganizer />} />
      <Route path="/queue/:id/participant" element={<Room />} />
      <Route path="report/:roomId" element={<ReportPage />} />

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
  );
}
