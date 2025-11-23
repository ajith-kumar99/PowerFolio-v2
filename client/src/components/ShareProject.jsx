import { Link } from 'react-router-dom';
import { Rocket, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ShareProject = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 relative z-10">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-16 text-center overflow-hidden relative group">
          
          {/* Hover Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

          <div className="inline-flex items-center justify-center p-3 bg-purple-600/20 rounded-xl mb-6">
            <Rocket className="w-8 h-8 text-purple-400" />
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Ready to Share Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Project?</span>
          </h2>
          
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Join our community of innovators and showcase your work to the world. 
            Get feedback, build your network, and launch your career.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/submit"
              className="group flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg rounded-full transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_40px_rgba(147,51,234,0.6)] hover:scale-105"
            >
              <Sparkles className="w-5 h-5" />
              Submit Your Project
            </Link>
            
            {!isAuthenticated && (
              <Link 
                to="/signup"
                className="flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-medium text-lg rounded-full border border-white/10 transition-colors"
              >
                Create Account
                <ArrowRight className="w-5 h-5" />
              </Link>
            )}
          </div>
          
          {!isAuthenticated && (
            <p className="mt-6 text-sm text-gray-500">
              Free for all students. No credit card required.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ShareProject;