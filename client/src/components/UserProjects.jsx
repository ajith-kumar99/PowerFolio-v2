import { Trash2, Eye, Link as LinkIcon, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserProjects = ({ projects, isLoading, handleDelete }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    if (status === 'Approved') return 'text-green-400 border-green-400/20 bg-green-400/10';
    if (status === 'Rejected') return 'text-red-400 border-red-400/20 bg-red-400/10';
    return 'text-yellow-400 border-yellow-400/20 bg-yellow-400/10';
  };

  if (isLoading) return <div className="text-center text-gray-400 py-10">Loading projects...</div>;

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
      <div className="p-6 border-b border-white/10 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">My Projects ({projects.length})</h2>
      </div>
      
      {projects.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p>No projects yet.</p>
          <button onClick={() => navigate('/submit')} className="text-purple-400 mt-2 hover:underline">Submit your first one!</button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-black/20 text-xs text-gray-400 uppercase">
              <tr>
                <th className="px-6 py-4">Project</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Engagement</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {projects.map((project) => (
                <tr key={project._id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{project.title}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded border text-xs font-bold ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    <div className="flex items-center justify-center gap-4">
                      <span className="flex items-center gap-1" title="Views">
                        <Eye size={14} className="text-blue-400" /> 
                        {/* Handle array length or direct number, default to 0 */}
                        {Array.isArray(project.views) ? project.views.length : (project.views || 0)}
                      </span>
                      <span className="flex items-center gap-1" title="Likes">
                        <Heart size={14} className="text-pink-400" />
                        {/* Handle array length or direct number, default to 0 */}
                        {Array.isArray(project.likes) ? project.likes.length : (project.likes || 0)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-3">
                    <button 
                      onClick={() => navigate(`/project/${project._id}`)} 
                      className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(project._id)} 
                      className="text-gray-400 hover:text-red-400 transition-colors p-1 hover:bg-red-500/10 rounded"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserProjects;