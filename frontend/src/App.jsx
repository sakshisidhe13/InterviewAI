import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home          from "./pages/Home";
import Login         from "./pages/Login";
import Signup        from "./pages/Signup";
import Dashboard     from "./pages/Dashboard";
import MockInterview from "./pages/MockInterview";
import ResumeReview  from "./pages/ResumeReview";
import ResumeUpload  from "./pages/ResumeUpload";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"               element={<Home />}      />
        <Route path="/login"          element={<Login />}     />
        <Route path="/signup"         element={<Signup />}    />
        <Route path="/dashboard"      element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/mock-interview" element={<ProtectedRoute><MockInterview /></ProtectedRoute>} />
        <Route path="/resume-review"  element={<ProtectedRoute><ResumeReview /></ProtectedRoute>} />
        <Route path="/resume-upload"  element={<ProtectedRoute><ResumeUpload /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;