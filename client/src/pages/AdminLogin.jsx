import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: 'admin@gmail.com', // Pre-filled for convenience
    password: 'admin@123'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // Check role immediately from local storage or the response
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        
        if (userInfo && userInfo.role === 'admin') {
            toast.success('Welcome, Administrator.');
            navigate('/admin');
        } else {
            toast.error('Access Denied. You are not an admin.');
            // Optional: force logout if they tried to login as admin with student creds
            navigate('/');
        }
      } else {
        toast.error(result.message || 'Invalid admin credentials');
      }
    } catch (error) {
      toast.error('Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black" />

      <div className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 relative z-10 shadow-2xl animate-in fade-in zoom-in duration-500">
        
        <div className="flex justify-center mb-6">
            <div className="p-4 bg-purple-600/20 rounded-full border border-purple-500/30">
                <ShieldCheck className="w-8 h-8 text-purple-500" />
            </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-gray-400 text-sm">Restricted access. Authorized personnel only.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Admin ID</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-purple-500 transition-colors" />
              <input 
                type="email" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-purple-500 focus:outline-none transition-all"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-purple-500 transition-colors" />
              <input 
                type="password" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-purple-500 focus:outline-none transition-all"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-white text-black font-bold py-3 rounded-xl transition-all hover:bg-gray-200 flex items-center justify-center gap-2 disabled:opacity-70 mt-6 shadow-lg shadow-white/10"
          >
            {isLoading ? (
               <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
                <>
                    Access Dashboard <ArrowRight className="w-4 h-4" />
                </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;