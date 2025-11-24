import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Eye, Heart, TrendingUp, Sparkles, Layers } from 'lucide-react'; // Added Layers icon
import { useAuth } from '../context/AuthContext';

const FeaturedProjects = () => {
  const { API_URL } = useAuth();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await fetch(`${API_URL}/projects`);
        if (response.ok) {
          const data = await response.json();
          // Ensure we are setting an array, even if API returns null/undefined
          setProjects(Array.isArray(data) ? data.slice(0, 3) : []);
        }
      } catch (error) {
        console.error(error);
        setProjects([]); // Safety fallback
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeatured();
  }, [API_URL]);

  if (isLoading)
    return (
      <div className="py-24 bg-black flex justify-center items-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-500/15 border-t-purple-500 rounded-full animate-spin"></div>
          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-purple-300 animate-pulse" />
        </div>
      </div>
    );

  return (
    <section className="py-24 bg-black relative overflow-hidden">
      
      {/* Ultra-Soft Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-600/4 rounded-full blur-[130px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-pink-600/4 rounded-full blur-[140px] animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm">
              <Star className="w-4 h-4 text-purple-300 animate-pulse" />
              <span className="text-sm font-bold text-purple-200 tracking-wide">HALL OF FAME</span>
              <TrendingUp className="w-4 h-4 text-purple-300" />
            </div>

            <h2 className="text-5xl md:text-6xl font-bold">
              <span className="text-white">Featured </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-purple-400 to-purple-500 animate-gradient">
                Projects
              </span>
            </h2>

            <p className="text-gray-400 text-lg max-w-xl">
              A showcase of the most inspiring & innovative student projects.
            </p>
          </div>

          <Link
            to="/projects"
            className="group flex items-center gap-3 text-white hover:text-purple-300 transition-all duration-300 px-8 py-4 
            bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/40 
            rounded-full backdrop-blur-sm relative overflow-hidden"
          >
            <span className="relative z-10 font-semibold">View All Projects</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-300/10 to-transparent 
            -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </Link>
        </div>

        {/* CONTENT LOGIC: Check if projects exist */}
        {projects.length > 0 ? (
          /* Grid */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div
                key={project._id}
                className="group relative"
                onMouseEnter={() => setHoveredId(project._id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                }}
              >

                {/* Card Glow */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-3xl 
                opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500"></div>

                {/* Card */}
                <div className="relative bg-[#0f0f11] rounded-3xl overflow-hidden border border-white/5 
                group-hover:border-purple-400/30 transition-all duration-500 shadow-[0_0_20px_rgba(0,0,0,0.45)]">

                  {/* Image */}
                  <div className="relative h-56 bg-gray-900 overflow-hidden">
                    <img
                      src={project.media?.screenshots?.[0] || "https://via.placeholder.com/400"}
                      alt={project.title}
                      className="w-full h-full object-cover transition-all duration-700 
                      group-hover:scale-110 group-hover:brightness-[1.08]"
                      onError={(e) =>
                        (e.target.src = "https://via.placeholder.com/400?text=No+Image")
                      }
                    />

                    {/* Soft Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

                    {/* Type Badge */}
                    <div className="absolute top-4 right-4 px-4 py-1.5 bg-black/50 backdrop-blur-md border border-white/10 rounded-full">
                      <span className="text-purple-300 text-xs font-bold uppercase">{project.type}</span>
                    </div>

                    {/* Hover Stats */}
                    <div
                      className={`absolute bottom-4 left-4 right-4 flex items-center gap-3 transition-all duration-500 ${
                        hoveredId === project._id
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-4"
                      }`}
                    >
                      {/* VIEWS */}
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-full border border-white/10">
                        <Eye className="w-3.5 h-3.5 text-purple-300" />
                        <span className="text-xs text-white">{project.views?.length || 0}</span>
                      </div>

                      {/* LIKES */}
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-full border border-white/10">
                        <Heart className="w-3.5 h-3.5 text-pink-300" />
                        <span className="text-xs text-white">{project.likes?.length || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <h3 className="text-2xl font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                      {project.shortDescription}
                    </p>

                    <div className="h-px bg-white/5"></div>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 
                          flex items-center justify-center text-sm font-bold text-white shadow-lg">
                            {project.author?.name?.charAt(0) || "U"}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-black"></div>
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-white block">
                            {project.author?.name}
                          </span>
                          <span className="text-xs text-gray-500">Creator</span>
                        </div>
                      </div>

                      <Link
                        to={`/project/${project._id}`}
                        className="group/btn flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 
                        text-white text-sm font-semibold rounded-full transition-all duration-300 
                        shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 hover:scale-105"
                      >
                        <span>View</span>
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>

                  {/* Shine Effect */}
                  <div className="absolute inset-0 translate-x-[-120%] group-hover:translate-x-[120%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12"></div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          /* Empty State Styling */
          <div className="flex flex-col items-center justify-center py-24 text-center rounded-3xl bg-white/5 border border-dashed border-white/10 backdrop-blur-sm animate-[fadeInUp_0.6s_ease-out]">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/5">
              <Layers className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              No Projects Yet
            </h3>
            <p className="text-gray-400 max-w-md">
              It looks like the hall of fame is currently empty. Check back later or be the first to submit a project.
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3.5s ease infinite;
        }
      `}</style>
    </section>
  );
};

export default FeaturedProjects;