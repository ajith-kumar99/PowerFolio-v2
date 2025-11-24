import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Rocket, LogOut, LayoutDashboard, ShieldCheck } from 'lucide-react'; // Added ShieldCheck
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // Standard link styles
  const getLinkClasses = (path) => 
    `relative transition-all duration-300 font-semibold group ${
      isActive(path) 
        ? "text-purple-400" 
        : "text-gray-300 hover:text-white"
    }`;

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-black/95 backdrop-blur-xl border-b border-purple-500/20 shadow-[0_4px_20px_rgba(168,85,247,0.15)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Enhanced Logo */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center group">
              <div className="relative p-2.5 ">
                <img src='../../Logo.png' className="w-11 h-9 " />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400 group-hover:from-purple-200 group-hover:via-purple-300 group-hover:to-white transition-all duration-500">
                  PowerFolio
                </span>

              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center space-x-1">
              <Link to="/" className={getLinkClasses('/')}>
                <span className="px-4 py-2 block">Home</span>
                {isActive('/') && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse" />
                )}
                {!isActive('/') && (
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-purple-400 group-hover:w-full transition-all duration-300" />
                )}
              </Link>
              
              <Link to="/projects" className={getLinkClasses('/projects')}>
                <span className="px-4 py-2 block">Explore</span>
                {isActive('/projects') && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse" />
                )}
                {!isActive('/projects') && (
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-purple-400 group-hover:w-full transition-all duration-300" />
                )}
              </Link>
              
              <Link to="/submit" className={getLinkClasses('/submit')}>
                <span className="px-4 py-2 block">Submit Project</span>
                {isActive('/submit') && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse" />
                )}
                {!isActive('/submit') && (
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-purple-400 group-hover:w-full transition-all duration-300" />
                )}
              </Link>
            </div>

            {/* ADMIN LINK - Highlighted Separately */}
            <div className="h-6 w-px bg-white/10 mx-2"></div> {/* Vertical Divider */}
            
            <Link 
              to="/admin-login" 
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-300 ${
                isActive('/admin-login') || isActive('/admin')
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                  : "bg-transparent text-gray-400 border-white/10 hover:border-amber-500/30 hover:text-amber-400"
              }`}
            >
              <ShieldCheck size={16} />
              <span className="text-sm font-bold uppercase tracking-wide">Admin</span>
            </Link>
          </div>

          {/* Auth Buttons (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link 
                  to="/dashboard" 
                  className="flex items-center gap-2 text-white bg-purple-600/10 hover:bg-purple-600/20 transition-all duration-300 px-4 py-2.5 rounded-xl border border-purple-500/30 hover:border-purple-500/50 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] group"
                >
                   <LayoutDashboard className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
                   <span className="text-sm font-semibold">Dashboard</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="p-2.5 text-gray-400 hover:text-red-400 transition-all duration-300 rounded-xl hover:bg-red-500/10 border border-transparent hover:border-red-500/30 group"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                </button>
              </div>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-5 py-2.5 text-sm font-semibold text-gray-300 hover:text-white transition-all duration-300 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10"
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  className="relative px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:scale-105 overflow-hidden group"
                >
                  <span className="relative z-10">Get Started</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-purple-600/10 border border-transparent hover:border-purple-500/30 focus:outline-none transition-all duration-300"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6 animate-in spin-in-180 duration-200" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black/98 border-t border-purple-500/20 backdrop-blur-xl animate-in slide-in-from-top duration-300">
          <div className="px-4 pt-4 pb-3 space-y-2">
            <Link 
              to="/" 
              onClick={() => setIsOpen(false)} 
              className={`block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 ${
                isActive('/') 
                  ? 'bg-gradient-to-r from-purple-600/20 to-purple-800/20 text-purple-300 border border-purple-500/30' 
                  : 'text-gray-300 hover:bg-purple-600/5 hover:text-white border border-transparent hover:border-purple-500/20'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/projects" 
              onClick={() => setIsOpen(false)} 
              className={`block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 ${
                isActive('/projects') 
                  ? 'bg-gradient-to-r from-purple-600/20 to-purple-800/20 text-purple-300 border border-purple-500/30' 
                  : 'text-gray-300 hover:bg-purple-600/5 hover:text-white border border-transparent hover:border-purple-500/20'
              }`}
            >
              Explore Projects
            </Link>
            <Link 
              to="/submit" 
              onClick={() => setIsOpen(false)} 
              className={`block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 ${
                isActive('/submit') 
                  ? 'bg-gradient-to-r from-purple-600/20 to-purple-800/20 text-purple-300 border border-purple-500/30' 
                  : 'text-gray-300 hover:bg-purple-600/5 hover:text-white border border-transparent hover:border-purple-500/20'
              }`}
            >
              Submit Project
            </Link>
            
            {/* ADMIN LINK - Mobile Highlight */}
            <Link 
              to="/admin-login" 
              onClick={() => setIsOpen(false)} 
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-base font-bold transition-all duration-300 ${
                isActive('/admin-login') || isActive('/admin')
                  ? 'bg-gradient-to-r from-amber-600/20 to-amber-800/20 text-amber-400 border border-amber-500/30' 
                  : 'text-gray-400 hover:bg-amber-600/5 hover:text-amber-400 border border-transparent hover:border-amber-500/20'
              }`}
            >
              <ShieldCheck size={18} /> Admin Access
            </Link>

            {isAuthenticated && (
              <Link 
                to="/dashboard" 
                onClick={() => setIsOpen(false)} 
                className={`block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 ${
                  isActive('/dashboard') 
                    ? 'bg-gradient-to-r from-purple-600/20 to-purple-800/20 text-purple-300 border border-purple-500/30' 
                    : 'text-gray-300 hover:bg-purple-600/5 hover:text-white border border-transparent hover:border-purple-500/20'
                }`}
              >
                My Dashboard
              </Link>
            )}
          </div>
          
          <div className="pt-4 pb-5 px-4 border-t border-purple-500/20">
            <div className="flex flex-col gap-3">
              {isAuthenticated ? (
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-white bg-gradient-to-r from-red-600/20 to-red-800/20 border border-red-500/40 rounded-xl hover:from-red-600/30 hover:to-red-800/30 hover:border-red-500/60 transition-all duration-300 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                >
                  <LogOut className="w-5 h-5" /> Sign Out
                </button>
              ) : (
                <>
                  <Link 
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="text-center px-4 py-3 text-sm font-semibold text-gray-300 border border-purple-500/30 rounded-xl hover:bg-purple-600/5 hover:text-white hover:border-purple-500/50 transition-all duration-300"
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="text-center px-4 py-3 text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;