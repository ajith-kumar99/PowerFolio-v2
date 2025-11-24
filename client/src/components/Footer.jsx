import { Twitter, Linkedin, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom'; // Optional: Use if you want the logo clickable

const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Main Container */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* 1. Brand Section (Logo + Text) */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            {/* Logo Wrapper: Keeps Image and Title side-by-side */}
            <div className="group flex items-center gap-3 mb-2 cursor-pointer">
              <img 
                src='../../Logo.png' 
                alt="PowerFolio Logo"
                className="w-10 h-auto object-contain transform group-hover:scale-105 transition-transform duration-300" 
              />
              <h3 className="text-xl font-bold text-white tracking-wide">PowerFolio</h3>
            </div>
            
            <p className="text-gray-400 text-sm max-w-xs">
              Empowering students to showcase their best work.
            </p>
          </div>

          {/* 2. Social Links */}
          <div className="flex items-center space-x-6">
            <a
              href="https://www.linkedin.com/company/gradxpert/"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-2 bg-white/5 rounded-full hover:bg-white/10 transition-all duration-300"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
            </a>
            <a
              href="https://x.com/gradxpert/"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-2 bg-white/5 rounded-full hover:bg-white/10 transition-all duration-300"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
            </a>
            <a
              href="https://www.instagram.com/gradxpert/"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-2 bg-white/5 rounded-full hover:bg-white/10 transition-all duration-300"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5 text-gray-400 group-hover:text-pink-400 transition-colors" />
            </a>
          </div>

          {/* 3. Copyright */}
          <div className="text-gray-600 text-sm font-medium">
            &copy; {new Date().getFullYear()} PowerFolio | All rights reserved.
          </div>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;