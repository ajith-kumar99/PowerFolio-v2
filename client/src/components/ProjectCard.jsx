import { useState } from 'react';
import { Calendar, Users, Github, ExternalLink, FileText, Eye, MonitorPlay, ArrowUpRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProjectCard = ({ project }) => {
  const { API_URL } = useAuth();
  const [isHovered, setIsHovered] = useState(false);

  const ensureHttp = (url) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `https://${url}`;
  };

  const getImageUrl = () => {
    if (project.media?.screenshots?.[0]) {
      const img = project.media.screenshots[0];
      return img.startsWith('http') ? img : `${API_URL.replace('/api', '')}/${img}`;
    }
    return "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop";
  };

  const hasGithub = project.links?.github;
  const hasLive = project.links?.live;
  const hasDoc = project.links?.documentation;
  const hasPresentation = project.links?.presentation;

  return (
    <div 
      className="group relative flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Subtle Glow Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-purple-600/20 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-700"></div>
      
      {/* Main Card */}
      <div className="relative flex flex-col h-full bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/[0.08] rounded-3xl overflow-hidden backdrop-blur-sm transition-all duration-500 group-hover:border-white/20 group-hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)]">
        
        {/* Image Section */}
        <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-900 to-black">
          <img 
            src={getImageUrl()} 
            alt={project.title} 
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
            onError={(e) => e.target.src = "https://via.placeholder.com/400x300/1a1a1a/ffffff?text=No+Image"}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500"></div>
          
          {/* Type Badge */}
          <div className="absolute top-4 right-4">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-600/40 blur-md"></div>
              <span className="relative px-4 py-1.5 text-xs font-bold text-white bg-black/40 backdrop-blur-md border border-white/20 rounded-full flex items-center gap-1.5 shadow-lg">
                <Sparkles className="w-3 h-3" />
                {project.type || project.techBadge}
              </span>
            </div>
          </div>

          {/* Quick Links Overlay - Appears on Hover */}
          <div className={`absolute inset-x-0 bottom-0 p-4 flex items-center justify-center gap-3 transition-all duration-500 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
            {hasGithub && (
              <a 
                href={ensureHttp(project.links.github)} 
                target="_blank" 
                rel="noreferrer" 
                className="p-3 bg-black/60 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/10 hover:scale-110 transition-all duration-300 shadow-lg group/link"
                title="GitHub Repository"
                onClick={(e) => e.stopPropagation()}
              >
                <Github className="w-4 h-4 text-white" />
              </a>
            )}
            
            {hasLive && (
              <a 
                href={ensureHttp(project.links.live)} 
                target="_blank" 
                rel="noreferrer" 
                className="p-3 bg-black/60 backdrop-blur-md border border-blue-500/30 rounded-xl hover:bg-blue-500/20 hover:scale-110 transition-all duration-300 shadow-lg group/link"
                title="Live Demo"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-4 h-4 text-blue-400" />
              </a>
            )}
            
            {hasDoc && (
              <a 
                href={ensureHttp(project.links.documentation)} 
                target="_blank" 
                rel="noreferrer" 
                className="p-3 bg-black/60 backdrop-blur-md border border-purple-500/30 rounded-xl hover:bg-purple-500/20 hover:scale-110 transition-all duration-300 shadow-lg group/link"
                title="Documentation"
                onClick={(e) => e.stopPropagation()}
              >
                <FileText className="w-4 h-4 text-purple-400" />
              </a>
            )}

            {hasPresentation && (
              <a 
                href={ensureHttp(project.links.presentation)} 
                target="_blank" 
                rel="noreferrer" 
                className="p-3 bg-black/60 backdrop-blur-md border border-pink-500/30 rounded-xl hover:bg-pink-500/20 hover:scale-110 transition-all duration-300 shadow-lg group/link"
                title="Presentation"
                onClick={(e) => e.stopPropagation()}
              >
                <MonitorPlay className="w-4 h-4 text-pink-400" />
              </a>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col flex-grow p-6">
          {/* Title & Description */}
          <div className="mb-5">
            <h3 className="text-xl font-bold text-white mb-2.5 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all duration-300 line-clamp-1">
              {project.title}
            </h3>
            <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
              {project.shortDescription}
            </p>
          </div>

          {/* Meta Info */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all duration-300 backdrop-blur-sm">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs text-gray-300 font-medium">
                {new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all duration-300 backdrop-blur-sm">
              <Users className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs text-gray-300 font-medium">
                {project.teamMembers?.length || 1} {(project.teamMembers?.length || 1) === 1 ? 'Member' : 'Members'}
              </span>
            </div>
          </div>

          {/* Divider with gradient */}
          <div className="relative h-px mb-5 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <div className={`absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/40 to-purple-500/0 transition-transform duration-700 ${isHovered ? 'translate-x-0' : '-translate-x-full'}`}></div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-auto">
            {/* Author Info */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 border-2 border-white/20 flex items-center justify-center text-white font-bold text-sm shadow-lg transition-transform duration-300 group-hover:scale-105">
                  {project.author?.name?.charAt(0) || 'U'}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-black shadow-lg"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white leading-tight max-w-[120px] truncate">
                  {project.author?.name}
                </span>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Creator</span>
              </div>
            </div>
            
            {/* View Button */}
            <Link 
              to={`/project/${project._id}`} 
              className="group/btn relative px-5 py-2.5 bg-gradient-to-r from-purple-600/90 to-blue-600/90 hover:from-purple-600 hover:to-blue-600 text-white text-xs font-bold rounded-xl transition-all duration-300 shadow-lg shadow-purple-900/30 hover:shadow-purple-900/50 hover:scale-105 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                View
                <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
            </Link>
          </div>
        </div>

        {/* Shine Effect */}
        <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent skew-x-12 pointer-events-none"></div>
      </div>
    </div>
  );
};

export default ProjectCard;