import { useState, useEffect } from 'react';
import { Mail, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // Import Auth Context for API_URL
import { toast } from 'react-toastify';

// Add custom animations styles
const styles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes wiggle {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(-5deg); }
    75% { transform: rotate(5deg); }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

const AdminUsers = ({ users: initialUsers }) => {
  const { API_URL } = useAuth();
  const [users, setUsers] = useState(initialUsers); // Local state to manage list updates

  // Sync local state when props change (e.g., after a refetch from parent)
  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to remove this user? This cannot be undone.")) {
      return;
    }

    // Optimistic Update: Remove from UI immediately for better UX
    const previousUsers = [...users];
    setUsers(prev => prev.filter(user => user._id !== id));

    try {
      const token = localStorage.getItem('authToken');
      
      // Ensure API_URL is defined before making the request
      if (!API_URL) {
        throw new Error("API Configuration Error");
      }

      const response = await fetch(`${API_URL}/admin/users/${id}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete user');
      }
      
      toast.success("User removed successfully");

    } catch (error) {
      console.error("Delete User Error:", error);
      // Revert optimistic update if failed
      setUsers(previousUsers);
      toast.error(error.message || "Failed to delete user.");
    }
  };

  return (
    // ADDED: h-full, overflow-y-auto, and data-lenis-prevent
    <div 
      className="space-y-4 sm:space-y-6 px-3 sm:px-0 h-full overflow-y-auto custom-scrollbar p-1"
      data-lenis-prevent
    >
      {/* Header with subtle animation */}
      <div className="flex justify-between items-center opacity-0 animate-[fadeIn_0.6s_ease-out_forwards]">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            User Management
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">Manage your platform users</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs text-gray-400">{users.length} Users</span>
        </div>
      </div>

      {/* Mobile user count */}
      <div className="sm:hidden flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg border border-white/10 w-fit opacity-0 animate-[fadeIn_0.6s_ease-out_0.1s_forwards]">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
        <span className="text-xs text-gray-400">{users.length} Total Users</span>
      </div>

      {/* User cards with staggered animation */}
      <div className="grid gap-3 sm:gap-4">
        {users.map((user, index) => (
          <div 
            key={user._id} 
            className="group bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 hover:scale-[1.01] hover:-translate-y-0.5 opacity-0 animate-[slideUp_0.5s_ease-out_forwards] backdrop-blur-sm"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
              {/* Avatar with gradient and animation */}
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center border-2 border-white/20 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <span className="text-sm sm:text-base font-bold text-white">{user.name?.charAt(0)}</span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse"></div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-white font-semibold text-sm sm:text-base truncate">
                    {user.name}
                  </h3>
                  {user.role === 'admin' && (
                    <span className="px-2 py-0.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 text-[10px] sm:text-xs uppercase font-bold rounded-md border border-purple-500/40 shadow-sm animate-pulse">
                      Admin
                    </span>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs sm:text-sm text-gray-400 mt-1">
                  <span className="flex items-center gap-1.5 truncate">
                    <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" /> 
                    <span className="truncate">{user.email}</span>
                  </span>
                  <span className="text-[11px] sm:text-sm text-gray-500">
                    Joined {new Date(user.createdAt).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: window.innerWidth < 640 ? '2-digit' : 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Delete button with enhanced animation */}
            <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-auto ml-auto sm:ml-0">
              <button 
                onClick={() => deleteUser(user._id)}
                className="relative text-gray-400 hover:text-red-400 p-2 sm:p-2.5 hover:bg-red-500/20 rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 group/btn border border-transparent hover:border-red-500/30"
                title="Remove User"
              >
                <Trash2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 group-hover/btn:animate-[wiggle_0.3s_ease-in-out]" />
                <span className="absolute inset-0 rounded-lg sm:rounded-xl bg-red-500/0 group-hover/btn:bg-red-500/10 transition-colors duration-300"></span>
              </button>
            </div>

          </div>
        ))}
        
        {users.length === 0 && (
          <div className="text-center py-12 sm:py-16 opacity-0 animate-[fadeIn_0.6s_ease-out_forwards]">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center border border-white/10">
              <Mail className="w-8 h-8 sm:w-10 sm:h-10 text-gray-600" />
            </div>
            <p className="text-gray-500 text-sm sm:text-base">No users found.</p>
            <p className="text-gray-600 text-xs sm:text-sm mt-1">Users will appear here once registered.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;