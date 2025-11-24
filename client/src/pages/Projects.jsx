import { useState, useEffect } from 'react';
import { Search, X, RefreshCw, AlertCircle } from 'lucide-react';
import ProjectCard from '../components/ProjectCard';
import { useAuth } from '../context/AuthContext';

const Projects = () => {
  const { API_URL } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debounce search to prevent too many API calls
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProjects();
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      // Construct URL with search query if it exists
      const url = searchTerm 
        ? `${API_URL}/projects?keyword=${searchTerm}` 
        : `${API_URL}/projects`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch projects');
      }

      setProjects(data);
      setError(null);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Failed to load projects. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pb-20">
      {/* Background Elements for premium feel */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-[128px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Header Section */}
        <div className="flex flex-col gap-8 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Innovation</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl">
              Discover inspiring projects built by our community. Search by name, technology, or creator.
            </p>
          </div>
          
          {/* Sticky Search Bar Container */}
          <div className="sticky top-20 z-40">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-black/60 backdrop-blur-xl p-2 rounded-2xl border border-white/10 shadow-2xl">
              
              {/* Search Input */}
              <div className="relative w-full md:w-[600px] group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-purple-400 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search projects (e.g., 'AI', 'React', 'Nikhil')..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-10 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all relative z-10"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors z-20"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Stats Badge */}
              <div className="hidden md:flex items-center gap-3 px-6 py-3 bg-white/5 rounded-xl border border-white/10">
                <div className="relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                  <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-green-500 animate-ping opacity-75" />
                </div>
                <span className="text-sm font-medium text-gray-300">
                  Showing <span className="text-white font-bold">{projects.length}</span> results
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <RefreshCw className="w-10 h-10 text-purple-500 animate-spin mb-4" />
            <p className="text-gray-400">Loading exciting projects...</p>
          </div>
        ) : error ? (
          /* Error State */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Oops! Something went wrong</h3>
            <p className="text-gray-400">{error}</p>
            <button 
              onClick={fetchProjects}
              className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          /* Projects Grid */
          <>
            {projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
                {projects.map((project, index) => (
                  <div 
                    key={project._id}
                    className="animate-in fade-in slide-in-from-bottom-4 duration-700"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <ProjectCard project={project} />
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 ring-1 ring-white/10">
                  <Search className="w-10 h-10 text-gray-600" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">No projects found</h3>
              
                <button 
                  onClick={() => setSearchTerm('')}
                  className="mt-8 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full font-medium transition-colors"
                >
                  Clear Search
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Projects;