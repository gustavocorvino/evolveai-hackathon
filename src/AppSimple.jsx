import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import LandingPageSimple from './pages/LandingPageSimple';
import GalleryPageSimple from './pages/GalleryPageSimple';
import SuccessPageSimple from './pages/SuccessPageSimple';

// Components
import LoadingScreen from './components/LoadingScreen';
import BackgroundParticles from './components/BackgroundParticles';

function AppRoutes() {
  const { user, teamData, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={user ? <Navigate to="/gallery" replace /> : <LandingPageSimple />} 
        />
        
        <Route 
          path="/gallery" 
          element={
            user 
              ? (teamData?.selectedUseCaseId 
                  ? <Navigate to="/success" replace /> 
                  : <GalleryPageSimple />)
              : <Navigate to="/" replace />
          } 
        />
        
        <Route 
          path="/success" 
          element={
            user && teamData?.selectedUseCaseId 
              ? <SuccessPageSimple /> 
              : <Navigate to="/gallery" replace />
          } 
        />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <div className="relative min-h-screen bg-deep-space">
        <BackgroundParticles />
        <AppRoutes />
      </div>
    </AuthProvider>
  );
}

export default App;
