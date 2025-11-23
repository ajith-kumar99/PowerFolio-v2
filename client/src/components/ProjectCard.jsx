import { Calendar, Users, Github, ExternalLink, FileText, Eye, MonitorPlay } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProjectCard = ({ project }) => {
  const { API_URL } = useAuth();

  // Helper to ensure links open correctly (fixes localhost redirection)
  const ensureHttp = (url) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `https://${url}`;
  };

  // Fallback logic for images
  const getImageUrl = () => {
    if (project.media?.screenshots?.[0]) {
      const img = project.media.screenshots[0];
      // Check if it's a remote URL (ImageKit) or local path
      return img.startsWith('http') ? img : `${API_URL.replace('/api', '')}/${img}`;
    }
    return "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop";
  };

  // Check if links exist
  const hasGithub = project.links?.github;
  const hasLive = project.links?.live;
  const hasDoc = project.links?.documentation;
  const hasPresentation = project.links?.presentation;

  return (
    <div className="group flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
      
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden bg-gray-800">
        <img 
          src={getImageUrl()} 
          alt={project.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => e.target.src = "https://via.placeholder.com/400x300/1a1a1a/ffffff?text=No+Image"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
        
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 text-xs font-bold text-white bg-purple-600 rounded-full shadow-lg backdrop-blur-md">
            {project.type || project.techBadge}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-grow p-5">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors line-clamp-1">
            {project.title}
          </h3>
          <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">
            {project.shortDescription}
          </p>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs text-gray-300 font-medium">
              {new Date(project.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
            <Users className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs text-gray-300 font-medium">
              {project.teamMembers?.length || 1}
            </span>
          </div>
        </div>

        {/* Conditional Action Icons */}
        <div className="flex items-center gap-4 mb-6 px-1 h-5">
          {hasGithub ? (
            <a 
              href={ensureHttp(project.links.github)} 
              target="_blank" 
              rel="noreferrer" 
              className="text-gray-400 hover:text-white transition-colors" 
              title="GitHub Repo"
            >
              <Github className="w-5 h-5" />
            </a>
          ) : (
            <div className="w-5 h-5 opacity-20"><Github className="w-5 h-5" /></div>
          )}
          
          {hasLive && (
            <a 
              href={ensureHttp(project.links.live)} 
              target="_blank" 
              rel="noreferrer" 
              className="text-gray-400 hover:text-blue-400 transition-colors" 
              title="Live Demo"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          )}
          
          {hasDoc && (
            <a 
              href={ensureHttp(project.links.documentation)} 
              target="_blank" 
              rel="noreferrer" 
              className="text-gray-400 hover:text-purple-400 transition-colors" 
              title="Documentation"
            >
              <FileText className="w-5 h-5" />
            </a>
          )}

          {hasPresentation && (
            <a 
              href={ensureHttp(project.links.presentation)} 
              target="_blank" 
              rel="noreferrer" 
              className="text-gray-400 hover:text-pink-400 transition-colors" 
              title="Presentation"
            >
              <MonitorPlay className="w-5 h-5" />
            </a>
          )}
        </div>

        <div className="h-px w-full bg-white/10 mb-4"></div>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-white/10 flex items-center justify-center text-white font-bold text-xs">
              {project.author?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white leading-tight truncate max-w-[100px]">
                {project.author?.name}
              </span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wide">Creator</span>
            </div>
          </div>
          
          <Link 
            to={`/project/${project._id}`} 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-blue-900/20 flex items-center gap-2"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;