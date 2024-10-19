import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserAuthPage from "./pages/UserAuthPage";
import EventDiscoveryPage from "./pages/EventDiscoveryPage";

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route
            path="/"
            element={
              <div className="container mx-auto py-8">
                <h1 className="text-2xl font-bold">
                  Welcome to Local Event Finder
                </h1>
              </div>
            }
          />
          <Route path="/login" element={<UserAuthPage />} />
          <Route path="/events" element={<EventDiscoveryPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
