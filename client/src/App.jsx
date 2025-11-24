import "./App.css";
import { RoomOrganizer, Room } from "./pages/Room";
import { Home } from "./pages/Home";
import { Route, Routes } from "react-router-dom";

const WS = "http://localhost:3000";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:id/organizer" element={<RoomOrganizer />} />
        <Route path="/room/:id/participant" element={<Room />} />
      </Routes>
    </>
  );
}

export default App;
