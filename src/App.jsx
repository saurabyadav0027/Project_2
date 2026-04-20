import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ApplicationProvider } from "./context/ApplicationContext";
import Navbar          from "./components/Navbar";
import Dashboard       from "./pages/Dashboard";
import Applications    from "./pages/Applications";
import AddApplication  from "./pages/AddApplication";
import Analytics       from "./pages/Analytics";

export default function App() {
  return (
    <ApplicationProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-slate-50">
          <Navbar />

          {/* Page content */}
          <div className="flex-1">
            <Routes>
              {/* Redirect root → /dashboard */}
              <Route path="/"                  element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard"         element={<Dashboard />} />
              <Route path="/applications"      element={<Applications />} />
              <Route path="/applications/new"  element={<AddApplication />} />
              <Route path="/analytics"         element={<Analytics />} />

              {/* Catch-all fallback */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </ApplicationProvider>
  );
}
