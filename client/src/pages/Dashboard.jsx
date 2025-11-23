import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import DashboardStats from '../components/DashboardStats';
import UserProjects from '../components/UserProjects';
import EditProfile from '../components/EditProfile';
import { UserCircle, Settings, Bell, RefreshCw } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, API_URL } = useAuth();
  
  // Data States
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false); // Modal State

  // Fetch Projects Logic
  const fetchMyProjects = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/projects/myprojects`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch projects');
      
      setProjects(data);

    } catch (error) {
      console.error("Dashboard Fetch Error:", error);
      toast.error(error.message || 'Error loading your projects.');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete Handler
  const handleDeleteProject = async (id) => {
    try {
      if (!window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
        return;
      }
      
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/projects/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to delete project');
      
      toast.success('Project deleted successfully!');
      setProjects(prev => prev.filter(p => p._id !== id)); 
      
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error(error.message || 'Failed to delete project.');
    }
  };

  // Auth Check & Initial Load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
    } else {
      fetchMyProjects();
    }
  }, [navigate, API_URL]);

  // Loading State
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-screen bg-black">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-purple-500 animate-spin mb-4 mx-auto" />
          <p className="text-white text-lg">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-20">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 relative z-10">
        
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Welcome back, {user?.name || 'Student'}! 👋</h1>
            <p className="text-gray-400">Here's what's happening with your projects.</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Cleaned up UI: Removed Bell/Settings, kept Profile Edit trigger */}
            <button 
              onClick={() => setIsEditProfileOpen(true)}
              className="p-2.5 bg-white/5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors border border-white/10"
              title="Edit Profile"
            >
              <Settings className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 p-0.5 overflow-hidden">
                {user?.profilePicture ? (
                   <img src={user.profilePicture} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                    <UserCircle className="w-full h-full text-gray-300" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <DashboardStats projects={projects} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Projects List */}
          <div className="lg:col-span-2 space-y-8 order-2 lg:order-1">
            <UserProjects 
              projects={projects} 
              isLoading={isLoading} 
              handleDelete={handleDeleteProject}
            />
          </div>

          {/* Right Column: Sidebar */}
          <div className="space-y-8 order-1 lg:order-2">
            
            {/* Quick Actions Card */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => navigate('/submit')}
                  className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-medium hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg shadow-purple-900/20"
                >
                  Submit New Project
                </button>
                <button 
                  onClick={() => setIsEditProfileOpen(true)}
                  className="w-full py-3 px-4 bg-white/5 border border-white/10 rounded-xl text-gray-300 font-medium hover:bg-white/10 transition-colors"
                >
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Recent Activity (Latest 5) */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
              <div className="space-y-6">
                {projects.slice(0, 5).map((project) => (
                  <div key={project._id} className="flex gap-4 items-start">
                    <div className="w-2 h-2 mt-2 rounded-full bg-purple-500 shrink-0" />
                    <div>
                      <p className="text-sm text-gray-300 leading-snug">
                        Your project <span className="text-white font-medium">{project.title}</span> status is <span className={project.status === 'Approved' ? 'text-green-400' : project.status === 'Rejected' ? 'text-red-400' : 'text-yellow-400'}>{project.status}</span>.
                      </p>
                      <span className="text-xs text-gray-500 mt-1 block">
                        Submitted: {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
                {projects.length === 0 && <p className="text-xs text-gray-500 text-center py-4">No recent activity.</p>}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Edit Profile Modal */}
      <EditProfile 
        isOpen={isEditProfileOpen} 
        onClose={() => setIsEditProfileOpen(false)} 
      />

    </div>
  );
};

export default Dashboard;