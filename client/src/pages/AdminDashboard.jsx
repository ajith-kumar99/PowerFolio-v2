import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Users, 
  LogOut, 
  Menu, 
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

// Import Sub-components
import AdminStats from '../components/AdminStats';
import AdminProjects from '../components/AdminProjects';
import AdminUsers from '../components/AdminUsers';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, API_URL, logout, loading } = useAuth(); 
  const [activeTab, setActiveTab] = useState('analytics');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Data States
  const [projects, setProjects] = useState([]);
  const [usersList, setUsersList] = useState([]);

  const fetchData = async () => {
    setIsDataLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const headers = { 'Authorization': `Bearer ${token}` };

      // We don't strictly need '/admin/stats' anymore since we calculate on frontend
      // But we fetch all projects and users to compute stats dynamically
      const [projectsRes, usersRes] = await Promise.all([
        fetch(`${API_URL}/admin/projects`, { headers }), 
        fetch(`${API_URL}/admin/users`, { headers })
      ]);

      if (!projectsRes.ok || !usersRes.ok) {
        if (projectsRes.status === 401) {
            toast.error("Session expired. Please login again.");
            logout();
            return;
        }
        throw new Error('Failed to fetch admin data');
      }

      const projectsData = await projectsRes.json();
      const usersData = await usersRes.json();

      setProjects(projectsData);
      setUsersList(usersData);

    } catch (error) {
      console.error("Admin Load Error:", error);
      toast.error("Failed to load dashboard data.");
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    if (loading) return; 

    if (!user || user.role !== 'admin') {
      navigate('/admin-login'); 
      return;
    }

    fetchData();
  }, [user, loading, navigate, API_URL]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Handle Status Updates
  const handleUpdateProjectStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/admin/projects/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Update failed');

      toast.success(newStatus === 'Rejected' ? 'Project rejected & removed' : `Project ${newStatus}`);
      
      // Refresh Data locally
      if (newStatus === 'Rejected') {
          setProjects(prev => prev.filter(p => p._id !== id));
      } else {
          setProjects(prev => prev.map(p => p._id === id ? { ...p, status: newStatus } : p));
      }
      // No need to refetch entire DB, local update is sufficient for UI
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  const renderContent = () => {
    if (isDataLoading) {
      return (
        <div className="flex justify-center items-center h-full min-h-[400px]">
          <div className="text-center">
             <RefreshCw className="w-8 h-8 text-purple-500 animate-spin mx-auto mb-2" />
             <p className="text-gray-400 text-sm">Loading Admin Data...</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'analytics': 
        // Pass projects and users directly for dynamic calc
        return <AdminStats projects={projects} users={usersList} />;
      case 'pending': 
        return <AdminProjects 
          title="Pending Review" 
          projects={projects.filter(p => p.status === 'Pending')} 
          onUpdateStatus={handleUpdateProjectStatus} 
          isPendingView={true}
        />;
      case 'approved': 
        return <AdminProjects 
          title="Approved Projects" 
          projects={projects.filter(p => p.status === 'Approved')} 
          onUpdateStatus={handleUpdateProjectStatus} 
          isPendingView={false}
        />;
      case 'users': return <AdminUsers users={usersList} />;
      default: return <AdminStats projects={projects} users={usersList} />;
    }
  };

  const menuItems = [
    { id: 'analytics', label: 'Analytics', icon: <LayoutDashboard size={20} /> },
    { id: 'pending', label: 'Pending Requests', icon: <Clock size={20} /> },
    { id: 'approved', label: 'Approved Projects', icon: <CheckCircle2 size={20} /> },
    { id: 'users', label: 'Manage Users', icon: <Users size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-black flex text-white">
      
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0a0a0a] border-r border-white/10 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col p-6">
          
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <ShieldCheck className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">AdminPanel</span>
          </div>

          <nav className="space-y-2 flex-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === item.id 
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl text-sm font-medium transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        <header className="lg:hidden h-16 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10 flex items-center px-4 justify-between sticky top-0 z-30">
          <span className="font-bold">Admin Dashboard</span>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-gray-400 hover:text-white"
          >
            <Menu size={24} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto bg-black p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </main>

    </div>
  );
};

export default AdminDashboard;