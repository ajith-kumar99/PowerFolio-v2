import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Rocket, LogOut, UserCircle, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // Import Auth Context

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth(); // Consume state and function from context
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const getLinkClasses = (path) => 
    `transition-colors duration-300 font-medium ${
      isActive(path) 
        ? "text-purple-500" 
        : "text-gray-300 hover:text-purple-400"
    }`;

  const handleLogout = () => {
    logout(); // Call logout function from context
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-purple-600/20 rounded-lg group-hover:bg-purple-600/30 transition-colors">
                <Rocket className="w-6 h-6 text-purple-500" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                PowerFolio
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link to="/" className={getLinkClasses('/')}>Home</Link>
              <Link to="/projects" className={getLinkClasses('/projects')}>Explore</Link>
              <Link to="/submit" className={getLinkClasses('/submit')}>Submit Project</Link>
            </div>
          </div>

          {/* Auth Buttons (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link 
                  to="/dashboard" 
                  className="flex items-center gap-2 text-white bg-white/5 hover:bg-white/10 transition-colors px-3 py-1.5 rounded-full border border-white/10"
                >
                   <LayoutDashboard className="w-5 h-5 text-purple-400" />
                   <span className="text-sm font-medium">Dashboard</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors rounded-full hover:bg-white/5"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_25px_rgba(147,51,234,0.5)]"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none transition-colors"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black/95 border-b border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" onClick={() => setIsOpen(false)} className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/') ? 'bg-purple-600/20 text-purple-400' : 'text-gray-300 hover:bg-white/5'}`}>
              Home
            </Link>
            <Link to="/projects" onClick={() => setIsOpen(false)} className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/projects') ? 'bg-purple-600/20 text-purple-400' : 'text-gray-300 hover:bg-white/5'}`}>
              Explore Projects
            </Link>
            <Link to="/submit" onClick={() => setIsOpen(false)} className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/submit') ? 'bg-purple-600/20 text-purple-400' : 'text-gray-300 hover:bg-white/5'}`}>
              Submit Project
            </Link>
            {isAuthenticated && (
              <Link to="/dashboard" onClick={() => setIsOpen(false)} className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/dashboard') ? 'bg-purple-600/20 text-purple-400' : 'text-gray-300 hover:bg-white/5'}`}>
                My Dashboard
              </Link>
            )}
          </div>
          
          <div className="pt-4 pb-4 border-t border-white/10">
            <div className="flex items-center px-5 gap-4">
              {isAuthenticated ? (
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600/20 border border-red-500/50 rounded-lg hover:bg-red-600/30"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              ) : (
                <>
                  <Link 
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 text-center px-4 py-2 text-sm font-medium text-gray-300 border border-white/20 rounded-lg hover:bg-white/5"
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 text-center px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg"
                  >
                    Sign Up
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