import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Calendar, Users, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const FeaturedProjects = () => {
  const { API_URL } = useAuth();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await fetch(`${API_URL}/projects`);
        if (response.ok) {
          const data = await response.json();
          // Slice the first 3 projects
          setProjects(data.slice(0, 3));
        }
      } catch (error) { 
        console.error(error); 
      } finally { 
        setIsLoading(false); 
      }
    };
    fetchFeatured();
  }, [API_URL]);

  // Loading State
  if (isLoading) return (
    <div className="py-24 bg-black flex justify-center">
      <RefreshCw className="animate-spin text-purple-500 w-8 h-8" />
    </div>
  );

  return (
    <section className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <div className="flex items-center gap-2 text-purple-400 mb-4">
              <Star className="w-5 h-5 fill-current" />
              <span className="text-sm font-bold">Hall of Fame</span>
            </div>
            <h2 className="text-4xl font-bold text-white">
              Featured <span className="text-purple-500">Masterpieces</span>
            </h2>
          </div>
          <Link 
            to="/projects" 
            className="flex items-center gap-2 text-white hover:text-purple-400 transition-colors px-6 py-3 border border-white/10 rounded-full"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div key={project._id} className="group bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all">
              {/* Image */}
              <div className="h-48 bg-gray-800 relative overflow-hidden">
                <img 
                  src={project.media?.screenshots?.[0] || "https://via.placeholder.com/400"} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                  alt={project.title} 
                  onError={(e) => e.target.src = "https://via.placeholder.com/400?text=No+Image"}
                />
                <div className="absolute top-3 right-3 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  {project.type}
                </div>
              </div>
              
              {/* Content */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{project.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-2 mb-4">{project.shortDescription}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs text-white">
                      {project.author?.name?.charAt(0) || 'U'}
                    </div>
                    <span className="text-sm text-gray-400">{project.author?.name}</span>
                  </div>
                  <Link to={`/project/${project._id}`} className="text-sm text-blue-400 hover:text-blue-300">
                    Details &rarr;
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturedProjects;