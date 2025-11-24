import { Link } from 'react-router-dom';
import { Rocket, ArrowRight, Sparkles, Zap, Shield, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ShareProject = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="py-32 relative overflow-hidden bg-black">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Softer Gradient Backdrop */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/10 to-black" />

        {/* Reduced Glow Orbs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-purple-600/12 rounded-full blur-[140px] animate-pulse pointer-events-none" />
        <div className="absolute top-1/4 right-1/4 w-[350px] h-[350px] bg-pink-600/10 rounded-full blur-[110px] animate-pulse delay-700 pointer-events-none" />

        {/* Softer Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_60%,transparent_100%)]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="relative bg-gradient-to-br from-white/[0.05] to-white/[0.015] border border-white/10 rounded-3xl p-8 sm:p-12 md:p-16 lg:p-20 text-center overflow-hidden group hover:border-purple-500/30 transition-all duration-500">
          
          {/* Border Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/10 to-purple-600/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700 pointer-events-none" />

          {/* Shimmer */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500 pointer-events-none" />

          {/* Corner Decorations */}
          <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-purple-500/10 rounded-tl-3xl group-hover:border-purple-500/30 transition-colors duration-500" />
          <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-purple-500/10 rounded-br-3xl group-hover:border-purple-500/30 transition-colors duration-500" />

          {/* Icon */}
          <div className="relative inline-flex items-center justify-center mb-8 animate-in fade-in zoom-in duration-700">
            <div className="absolute inset-0 bg-purple-600/15 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-500" />
            <div className="relative p-4 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl border border-purple-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
              <Rocket className="w-10 h-10 text-purple-300 group-hover:text-purple-200 transition-colors" />
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            Ready to Share Your{' '}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-purple-400 animate-gradient-x">
                Project?
              </span>
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 blur-sm" />
            </span>
          </h2>

          {/* Subheading */}
          <p className="text-gray-400 text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            Join our community of innovators and showcase your work to the world.
            Get feedback, build your network, and{' '}
            <span className="text-purple-300 font-semibold">launch your career</span>.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 hover:border-purple-500/40 transition-all group/pill">
              <Zap className="w-4 h-4 text-purple-300 group-hover/pill:scale-110 transition-transform" />
              <span className="text-sm font-semibold text-purple-200">Instant Publishing</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 hover:border-blue-500/40 transition-all group/pill">
              <Shield className="w-4 h-4 text-blue-300 group-hover/pill:scale-110 transition-transform" />
              <span className="text-sm font-semibold text-blue-200">Professional Profile</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/20 hover:border-pink-500/40 transition-all group/pill">
              <Users className="w-4 h-4 text-pink-300 group-hover/pill:scale-110 transition-transform" />
              <span className="text-sm font-semibold text-pink-200">Active Community</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
            <Link 
              to="/submit"
              className="group/btn relative flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-lg rounded-full transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] hover:scale-105 w-full sm:w-auto overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
              <Sparkles className="w-5 h-5 relative z-10 group-hover/btn:rotate-180 transition-transform duration-500" />
              <span className="relative z-10">Submit Your Project</span>
            </Link>
            
            {!isAuthenticated && (
              <Link 
                to="/signup"
                className="group/btn relative flex items-center justify-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold text-lg rounded-full border-2 border-white/20 hover:border-purple-500/40 transition-all hover:shadow-[0_0_20px_rgrgba(168,85,247,0.3)] w-full sm:w-auto overflow-hidden"
              >
                <span className="relative z-10">Create Account</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/10 to-purple-600/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
              </Link>
            )}
          </div>


          {/* Accent Circles */}
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-600/8 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-pink-600/8 rounded-full blur-3xl pointer-events-none" />
        </div>
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

export default ShareProject;
