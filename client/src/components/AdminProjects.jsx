import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, Eye, Search } from 'lucide-react';

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

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-white">{title} ({filteredProjects.length})</h2>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search projects..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/20 border-b border-white/10 text-xs uppercase text-gray-400">
                <th className="p-4 font-medium">Project Name</th>
                <th className="p-4 font-medium">Student</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProjects.map((project) => (
                <tr key={project._id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 text-white font-medium">{project.title}</td>
                  <td className="p-4 text-gray-300">{project.author?.name || 'Unknown'}</td>
                  <td className="p-4 text-gray-400 text-sm">
                    <span className="px-2 py-1 bg-white/5 rounded border border-white/10">
                      {project.type}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400 text-sm">{new Date(project.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusStyle(project.status)}`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => navigate(`/project/${project._id}`)} 
                        className="p-1.5 text-blue-400 hover:bg-blue-400/10 rounded-md transition-colors" 
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {isPendingView && (
                        <>
                          <button 
                            onClick={() => onUpdateStatus(project._id, 'Approved')}
                            className="p-1.5 text-green-400 hover:bg-green-400/10 rounded-md transition-colors" 
                            title="Approve"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => onUpdateStatus(project._id, 'Rejected')}
                            className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-md transition-colors" 
                            title="Reject"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProjects.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">No projects found in this category.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProjects;