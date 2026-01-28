import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Pages
import LandingPage from './pages/LandingPage';
import GalleryPage from './pages/GalleryPage';
import SuccessPage from './pages/SuccessPage';
import AdminPage from './pages/AdminPage';

// Components
import LoadingScreen from './components/LoadingScreen';
import BackgroundParticles from './components/BackgroundParticles';

function App() {
  const { user, teamData, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  return (
    <div className="relative min-h-screen bg-deep-space">
      <BackgroundParticles />
      
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={user ? <Navigate to="/gallery" replace /> : <LandingPage />} 
          />
          
          <Route 
            path="/gallery" 
            element={
              user 
                ? (teamData?.selectedUseCaseId 
                    ? <Navigate to="/success" replace /> 
                    : <GalleryPage />)
                : <Navigate to="/" replace />
            } 
          />
          
          <Route 
            path="/success" 
            element={
              user && teamData?.selectedUseCaseId 
                ? <SuccessPage /> 
                : <Navigate to="/gallery" replace />
            } 
          />
          
          <Route 
            path="/admin" 
            element={<AdminPage />} 
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
