import { Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold text-white">PowerFolio</h3>
            <p className="text-gray-400 text-sm">Empowering students to showcase their best work.</p>
          </div>
          
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-purple-500 transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-purple-500 transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-purple-500 transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
          
          <div className="text-gray-500 text-sm">
            © {new Date().getFullYear()} PowerFolio. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;