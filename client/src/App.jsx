import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RoomOrganizer, Room } from "./pages/Room";
import HomePage from "./pages/Home";
import CreateQueuePage from "./pages/CreateQueuePage";
import QueueBoardingPage from "./pages/Onboarding";
import QRCodePage from "./pages/ResultQRCodePage";
import ManageQueuePage from "./pages/ManageQueue";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/onboarding" element={<QueueBoardingPage />} />
      <Route path="/create" element={<CreateQueuePage />} />
      <Route path="/qr" element={<QRCodePage />} />
      <Route path="/manage" element={<ManageQueuePage />} />
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
  );
}
