import { Trash2, Eye, Heart, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const UserProjects = ({ projects, isLoading, handleDelete }) => {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null);

  const getStatusColor = (status) => {
    if (status === 'Approved') return 'text-green-400 border-green-400/20 bg-green-400/10';
    if (status === 'Rejected') return 'text-red-400 border-red-400/20 bg-red-400/10';
    return 'text-yellow-400 border-yellow-400/20 bg-yellow-400/10';
  };

  const getStatusIcon = (status) => {
    if (status === 'Approved') return '✓';
    if (status === 'Rejected') return '✗';
    return '⏳';
  };

  if (isLoading) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden p-8">
        <div className="flex flex-col items-center justify-center text-gray-400 py-10">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4"></div>
          <p>Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 rounded-3xl overflow-hidden backdrop-blur-xl">
      <div className="p-4 sm:p-6 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-lg sm:text-xl font-bold text-white">
          My Projects 
          <span className="ml-2 px-2 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-xs sm:text-sm text-purple-300">
            {projects.length}
          </span>
        </h2>
       
      </div>
      
      {projects.length === 0 ? (
        <div className="text-center py-16 px-4 text-gray-400">
          <div className="mb-4 inline-block p-4 bg-white/5 rounded-2xl">
            <Eye className="w-12 h-12 text-gray-500" />
          </div>
          <p className="text-lg font-medium mb-2">No projects yet</p>
          <p className="text-sm text-gray-500 mb-6">Start showcasing your work today!</p>
          <button 
            onClick={() => navigate('/submit')} 
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
          >
            Submit Your First Project
          </button>
        </div>
      ) : (
        <>
          {/* Desktop Table View - Hidden on mobile */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-black/20 text-xs text-gray-400 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold">Project</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 text-center font-semibold">Engagement</th>
                  <th className="px-6 py-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {projects.map((project) => (
                  <tr key={project._id} className="hover:bg-white/5 transition-all duration-200 group">
                    <td className="px-6 py-4 font-medium text-white group-hover:text-purple-300 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        {project.title}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-bold ${getStatusColor(project.status)} transition-all duration-200 hover:scale-105`}>
                        <span>{getStatusIcon(project.status)}</span>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      <div className="flex items-center justify-center gap-6">
                        <div className="flex items-center gap-2 group/view" title="Views">
                          <div className="p-1.5 bg-blue-500/10 rounded-lg group-hover/view:bg-blue-500/20 transition-colors">
                            <Eye size={14} className="text-blue-400" />
                          </div>
                          <span className="font-semibold">
                            {Array.isArray(project.views) ? project.views.length : (project.views || 0)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 group/like" title="Likes">
                          <div className="p-1.5 bg-pink-500/10 rounded-lg group-hover/like:bg-pink-500/20 transition-colors">
                            <Heart size={14} className="text-pink-400" />
                          </div>
                          <span className="font-semibold">
                            {Array.isArray(project.likes) ? project.likes.length : (project.likes || 0)}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => navigate(`/project/${project._id}`)} 
                          className="text-gray-400 hover:text-white transition-all duration-200 p-2 hover:bg-white/10 rounded-lg group/btn"
                          title="View Details"
                        >
                          <Eye size={18} className="group-hover/btn:scale-110 transition-transform" />
                        </button>
                        <button 
                          onClick={() => handleDelete(project._id)} 
                          className="text-gray-400 hover:text-red-400 transition-all duration-200 p-2 hover:bg-red-500/10 rounded-lg group/btn"
                          title="Delete"
                        >
                          <Trash2 size={18} className="group-hover/btn:scale-110 transition-transform" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View - Visible only on mobile */}
          <div className="md:hidden divide-y divide-white/5">
            {projects.map((project) => (
              <div 
                key={project._id} 
                className="p-4 hover:bg-white/5 transition-all duration-300 relative"
              >
                {/* Project Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 min-w-0 pr-3">
                    <h3 
                      className="text-white font-semibold truncate text-base mb-2 cursor-pointer hover:text-purple-300 transition-colors"
                      onClick={() => navigate(`/project/${project._id}`)}
                    >
                      {project.title}
                    </h3>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-bold ${getStatusColor(project.status)}`}>
                      <span>{getStatusIcon(project.status)}</span>
                      {project.status}
                    </span>
                  </div>
                  
                  {/* Actions Menu */}
                  <div className="relative">
                    <button 
                      onClick={() => setOpenMenu(openMenu === project._id ? null : project._id)}
                      className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                    >
                      <MoreVertical size={18} />
                    </button>
                    
                    {openMenu === project._id && (
                      <>
                        {/* Backdrop */}
                        <div 
                          className="fixed inset-0 z-10"
                          onClick={() => setOpenMenu(null)}
                        ></div>
                        
                        {/* Dropdown Menu */}
                        <div className="absolute right-0 top-full mt-2 w-48 bg-gray-900 border border-white/20 rounded-xl shadow-2xl z-20 overflow-hidden backdrop-blur-xl">
                          <button
                            onClick={() => {
                              navigate(`/project/${project._id}`);
                              setOpenMenu(null);
                            }}
                            className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-3"
                          >
                            <Eye size={16} className="text-blue-400" />
                            View Details
                          </button>
                          <button
                            onClick={() => {
                              handleDelete(project._id);
                              setOpenMenu(null);
                            }}
                            className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-red-500/10 hover:text-red-400 transition-colors flex items-center gap-3 border-t border-white/5"
                          >
                            <Trash2 size={16} className="text-red-400" />
                            Delete Project
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Engagement Stats */}
                <div className="flex items-center gap-6 mt-4 pt-3 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-500/10 rounded-lg">
                      <Eye size={14} className="text-blue-400" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Views</div>
                      <div className="text-sm font-semibold text-gray-300">
                        {Array.isArray(project.views) ? project.views.length : (project.views || 0)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-pink-500/10 rounded-lg">
                      <Heart size={14} className="text-pink-400" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Likes</div>
                      <div className="text-sm font-semibold text-gray-300">
                        {Array.isArray(project.likes) ? project.likes.length : (project.likes || 0)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default UserProjects;