import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Star, Zap } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black flex items-center">
      {/* Soft Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-40" />

      {/* Subtle Glow Orbs */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-purple-600/40 rounded-full blur-[180px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[450px] h-[450px] bg-blue-500/20 rounded-full blur-[150px] animate-pulse pointer-events-none" />

      <div className="text-center max-w-4xl mx-auto px-6 sm:px-8 relative z-10">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-purple-300 mb-6">
          <Sparkles className="w-4 h-4" />
          <span>The #1 Platform for Student Developers</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white mb-6 leading-tight">
          Showcase Your{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-purple-400 animate-gradient-x">
            Academic Brilliance
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          PowerFolio helps students{' '}
          <span >publish projects</span>,{' '}
          <span >build portfolios</span>, and{' '}
          <span >get discovered</span> by top recruiters.
        </p>

  

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            to="/projects"
            className="group relative inline-flex items-center justify-center px-8 py-3 text-base font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-full w-full sm:w-auto hover:scale-105 transition-all"
          >
            <span className="flex items-center gap-2">
              Explore Projects
              <Sparkles className="w-5 h-5" />
            </span>
          </Link>
          
          <Link 
            to="/submit"
            className="group relative inline-flex items-center justify-center px-8 py-3 text-base font-bold text-white border-2 border-purple-500/50 rounded-full hover:bg-purple-600/10 w-full sm:w-auto"
          >
            <span className="flex items-center gap-2">
              Submit Project
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>

        <p className="mt-6 text-xs text-gray-500">
          🔥 Join thousands of students building their future
        </p>
      </div>

      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`
          }}
        />
      </div>

      <style>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% auto;
          animation: gradient-x 4s ease infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;
