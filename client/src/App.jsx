import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot'; // Import ChatBot

import Home from './pages/Home';
import Projects from './pages/Projects';
import SubmitProject from './pages/SubmitProject';
import ViewProject from './pages/ViewProject';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';

const AppContent = () => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-black text-white relative">
      {!isAdminRoute && (
        <Navbar 
          isAuthenticated={isAuthenticated} 
          setIsAuthenticated={(val) => !val && logout()} 
        />
      )}
      
      <main className="flex-grow w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/submit" element={<SubmitProject />} />
          <Route path="/project/:id" element={<ViewProject />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin-login" element={<AdminLogin />} /> 
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<div className="text-center mt-40"><h1 className="text-6xl font-bold text-purple-500">404</h1><p className="text-gray-400">Page not found</p></div>} />
        </Routes>
      </main>

      {!isAdminRoute && <Footer />} 
      
      {/* Add ChatBot here so it overlays everything */}
      {!isAdminRoute && <ChatBot />} 
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
      <ToastContainer position="top-right" theme="dark" />
    </AuthProvider>
  );
}

export default App;