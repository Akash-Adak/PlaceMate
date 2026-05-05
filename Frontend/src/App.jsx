import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ResumeParsing from './pages/ResumeParsing';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import Pricing from './pages/Pricing';
import CompanyPlan from './pages/CompanyPlan';
import PracticePlan from './pages/PracticePlan';
import MockInterview from './pages/MockInterview';
import VoiceAssistant from './components/VoiceAssistant';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <ScrollToTop />
        <AuthProvider>
          <div className="bg-white dark:bg-dark-bg min-h-screen font-inter selection:bg-purple-500/30 dark:selection:bg-amber-500/30 selection:text-purple-600 dark:selection:text-amber-500 overflow-x-hidden w-full relative transition-colors duration-300">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route 
                path="/plan/:companyName" 
                element={
                  <ProtectedRoute>
                    <CompanyPlan />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/practice/:companyName/:dayNumber" 
                element={
                  <ProtectedRoute>
                    <PracticePlan />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/resume-parsing" 
                element={
                  <ProtectedRoute>
                    <ResumeParsing />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/mock-interview" 
                element={
                  <ProtectedRoute>
                    <MockInterview />
                  </ProtectedRoute>
                } 
              />
            </Routes>
            <VoiceAssistant />
          </div>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
