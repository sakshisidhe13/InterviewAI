//app.jsx
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import MockInterview from "./pages/MockInterview";
import InterviewAnalysis from "./pages/InterviewAnalysis";
import ResumeReview from "./pages/ResumeReview";
import ResumeUpload from "./pages/ResumeUpload";
import ProtectedRoute from "./components/ProtectedRoute";
import ResumeAnalysis from "./pages/ResumeAnalysis";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout title="Dashboard">
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/mock-interview"
          element={
            <ProtectedRoute>
              <AppLayout title="Mock Interview">
                <MockInterview />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/interviews/:id"
          element={
            <ProtectedRoute>
              <AppLayout title="Interview Analysis">
                <InterviewAnalysis />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/resume-review/:id"
          element={
            <ProtectedRoute>
              <AppLayout title="Resume Analysis">
                <ResumeAnalysis />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/resume-upload"
          element={
            <ProtectedRoute>
              <AppLayout title="Resume Upload">
                <ResumeUpload />
              </AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
