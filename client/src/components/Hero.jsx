import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative pt-20 pb-32 overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] -z-10 pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="text-center max-w-4xl mx-auto px-4 relative z-10">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-purple-300 mb-8 hover:bg-white/10 transition-colors cursor-default">
          <Sparkles className="w-4 h-4" />
          <span>The #1 Platform for Student Developers</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
          Showcase Your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 animate-gradient-x">
            Academic Brilliance
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          PowerFolio is the ultimate ecosystem for students to publish projects, 
          build a professional portfolio, and get discovered by top recruiters.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            to="/projects"
            className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-purple-600 rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(147,51,234,0.5)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10">Explore Projects</span>
          </Link>
          
          <Link 
            to="/submit"
            className="group inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white border border-white/20 rounded-full hover:bg-white/5 hover:border-purple-500/50 transition-all"
          >
            <span>Submit Project</span>
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Decorative Grid (Optional CSS enhancement) */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 -z-20 pointer-events-none mix-blend-overlay"></div>
    </section>
  );
};

export default Hero;