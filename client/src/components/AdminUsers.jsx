import { Mail, Trash2 } from 'lucide-react';

const AdminUsers = ({ users }) => {
  
  const deleteUser = (id) => {
    if (window.confirm("Are you sure you want to remove this user?")) {
      console.log("Delete logic would go here for ID:", id);
      // Backend integration for deleting users can be added here if needed.
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">User Management</h2>
      </div>

      <div className="grid gap-4">
        {users.map((user) => (
          <div key={user._id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-purple-500/30 transition-colors">
            
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center border border-white/10">
                <span className="text-sm font-bold text-white">{user.name?.charAt(0)}</span>
              </div>
              <div>
                <h3 className="text-white font-medium flex items-center gap-2">
                  {user.name}
                  {user.role === 'admin' && (
                    <span className="px-1.5 py-0.5 bg-purple-500/20 text-purple-300 text-[10px] uppercase font-bold rounded border border-purple-500/30">
                      Admin
                    </span>
                  )}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-400 mt-0.5">
                  <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {user.email}</span>
                  <span className="hidden sm:inline">• Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              <button 
                onClick={() => deleteUser(user._id)}
                className="text-gray-400 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                title="Remove User"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUsers;