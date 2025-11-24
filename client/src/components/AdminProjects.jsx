import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, Eye, Search, Trash2, Calendar, User, Tag } from 'lucide-react';

const AdminProjects = ({ projects, onUpdateStatus, title, isPendingView }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.author?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Rejected': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    }
  };

  const handleAction = (projectId, action) => {
    onUpdateStatus(projectId, action);
  };

  return (
    // ADDED: h-full, overflow-y-auto, and data-lenis-prevent
    // This isolates the scrolling of this component from the main window
    <div 
      className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full overflow-y-auto custom-scrollbar p-1"
      data-lenis-prevent
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          {title} <span className="text-gray-500">({filteredProjects.length})</span>
        </h2>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input 
            type="text" 
            placeholder="Search projects..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300"
          />
        </div>
      </div>

      {/* Desktop Table View (hidden on mobile) */}
      <div className="hidden lg:block bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
        {/* ADDED: data-lenis-prevent to table wrapper for horizontal scroll safety */}
        <div className="overflow-x-auto" data-lenis-prevent>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/40 border-b border-white/10 text-xs uppercase text-gray-400">
                <th className="p-4 font-semibold">Project Name</th>
                <th className="p-4 font-semibold">Student</th>
                <th className="p-4 font-semibold">Type</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProjects.map((project, index) => (
                <tr 
                  key={project._id} 
                  className="hover:bg-white/5 transition-all duration-300 group"
                  style={{ animation: `fadeIn 0.3s ease-out ${index * 0.05}s both` }}
                >
                  <td className="p-4 text-white font-semibold group-hover:text-purple-400 transition-colors">
                    {project.title}
                  </td>
                  <td className="p-4 text-gray-300">{project.author?.name || 'Unknown'}</td>
                  <td className="p-4 text-gray-400 text-sm">
                    <span className="px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 font-medium">
                      {project.type}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400 text-sm">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusStyle(project.status)}`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => navigate(`/project/${project._id}`)} 
                        className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all duration-300 hover:scale-110" 
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      {isPendingView ? (
                        <>
                          <button 
                            onClick={() => onUpdateStatus(project._id, 'Approved')}
                            className="p-2 text-green-400 hover:bg-green-400/10 rounded-lg transition-all duration-300 hover:scale-110" 
                            title="Approve"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => onUpdateStatus(project._id, 'Rejected')}
                            className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-all duration-300 hover:scale-110" 
                            title="Reject"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <button 
                          onClick={() => onUpdateStatus(project._id, 'Rejected')}
                          className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-all duration-300 hover:scale-110" 
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProjects.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="w-8 h-8 text-gray-600" />
                      <p className="text-base">No projects found in this category.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View (visible on small screens) */}
      <div className="lg:hidden space-y-4">
        {filteredProjects.map((project, index) => (
          <div 
            key={project._id}
            className="relative bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-5 backdrop-blur-sm hover:border-white/20 transition-all duration-300"
            style={{ animation: `fadeIn 0.3s ease-out ${index * 0.05}s both` }}
          >
            {/* Status Badge */}
            <div className="absolute top-4 right-4">
              <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusStyle(project.status)}`}>
                {project.status}
              </span>
            </div>

            {/* Project Title */}
            <h3 className="text-lg font-bold text-white mb-3 pr-24 line-clamp-2">
              {project.title}
            </h3>

            {/* Info Grid */}
            <div className="space-y-2.5 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-gray-300">{project.author?.name || 'Unknown'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Tag className="w-4 h-4 text-gray-500" />
                <span className="px-2.5 py-1 bg-white/5 rounded-lg border border-white/10 text-gray-400 text-xs font-medium">
                  {project.type}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-gray-400 text-xs">
                  {new Date(project.createdAt).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4"></div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => navigate(`/project/${project._id}`)} 
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-xl transition-all duration-300 hover:scale-105 font-semibold text-sm border border-blue-500/30"
              >
                <Eye className="w-4 h-4" />
                View
              </button>
              
              {isPendingView ? (
                <>
                  <button 
                    onClick={() => handleAction(project._id, 'Approved')}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-xl transition-all duration-300 hover:scale-105 font-semibold text-sm border border-green-500/30"
                  >
                    <Check className="w-4 h-4" />
                    Approve
                  </button>
                  <button 
                    onClick={() => handleAction(project._id, 'Rejected')}
                    className="p-2.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-xl transition-all duration-300 hover:scale-105 border border-red-500/30"
                    title="Reject"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => handleAction(project._id, 'Rejected')}
                  className="p-2.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-xl transition-all duration-300 hover:scale-105 border border-red-500/30"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        ))}

        {filteredProjects.length === 0 && (
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-12 text-center backdrop-blur-sm">
            <Search className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500">No projects found in this category.</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default AdminProjects;