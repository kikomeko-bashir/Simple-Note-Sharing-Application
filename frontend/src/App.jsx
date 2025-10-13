import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import AuthWrapper from './components/auth/AuthWrapper.jsx';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <div className="App">
              <Routes>
                {/* Root always shows login. User triggers navigation manually. */}
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                
                {/* Protected Dashboard */}
                <Route 
                  path="/dashboard" 
                  element={
                    <AuthWrapper>
                      <DashboardPage />
                    </AuthWrapper>
                  } 
                />
                
                {/* 404 Page */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
              
              {/* Toast Notifications */}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: 'var(--toast-bg)',
                    color: 'var(--toast-color)',
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: '#10B981',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    duration: 5000,
                    iconTheme: {
                      primary: '#EF4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
            </div>
          </Router>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
